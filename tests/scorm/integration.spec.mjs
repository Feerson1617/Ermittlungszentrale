import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {assertCasesAndDictionary,assertCleanStart,observeStart} from '../browser/start-check.mjs';
import {choose,selectionTask,answerSelection,submit,result,solveCountries,home,open} from '../browser/v2-helpers.mjs';
const media=JSON.parse(await readFile(new URL('../../data/media.json',import.meta.url)));
const origin='http://127.0.0.1:4173';
async function embedded(page,mode=''){
 await page.goto(`/player.html?mode=${mode}`,{waitUntil:"domcontentloaded"});
 await expect.poll(()=>page.frames().filter(f=>f.url().includes('/kurs/')).length).toBe(1);
 const game=page.frames().find(f=>f.url().includes('/kurs/'));
 await expect(game.locator('.case-card')).toHaveCount(5);
 return game;
}
const calls=page=>page.evaluate(()=>window.scormCalls);

test('SCORM iframe: alle fünf Akten vollständig, 30+5 Punkte, keine CMI-Übertragung',async({page})=>{
 test.setTimeout(150000);
 const events=observeStart(page,origin);
 const game=await embedded(page);
 await open(game,1);await game.locator('#name-answer').fill('Afrika');await submit(game);await result(game,5);
 await open(game,2);await selectionTask(game);await answerSelection(game);await submit(game);await result(game,5);await home(game);
 await open(game,3);expect(await solveCountries(game)).toEqual([1,5,4]);await home(game);
 await open(game,4);await choose(game,[3,6,8,9]);await game.getByRole('button',{name:'Auswahl ansehen',exact:true}).click();
 await game.locator('#paper-recorded').check();await game.getByRole('button',{name:'Die Überschrift prüfen'}).click();
 await game.locator('input[name="headline"][value="c"]').check();await submit(game);await result(game,5);await home(game);
 await open(game,5);await game.getByRole('button',{name:'Spuren zuordnen'}).click();
 for(const [key,value] of Object.entries({water:'nature',people:'population',economy:'economy',solar:'future'}))await game.locator(`#match-${key}`).selectOption(value);
 await submit(game);await result(game,5);await game.getByRole('button',{name:'Wie könnte man …?'}).click();
 await game.locator('#future-question').fill('Wie können Menschen Wasser sparen?');await game.getByRole('button',{name:'Ermittlung abschließen'}).click();
 await expect(game.locator('main')).toContainText('5 / 5 Bonuspunkte');
 const points=await game.evaluate(()=>Object.values(JSON.parse(sessionStorage.getItem('ermittlungszentrale-session-v2')).tasks).map(t=>t.points));
 expect(points).toEqual([5,5,5,5,5,5,5]);expect(await calls(page)).toEqual([['LMSInitialize','']]);
 await game.goto(new URL('/woerterbuch.html',game.url()).href);await expect.poll(()=>calls(page)).toEqual([['LMSInitialize',''],['LMSFinish','']]);
 assertCleanStart(events);
});

test('Tiefe variable HTTP-Pfade, alle 24 Fotos, JSON, GeoJSON und MIME-Typen',async({page,request})=>{
 test.setTimeout(120000);
 const url=origin+'/kurs/inhalt/4711/index.html';const events=observeStart(page,url);
 await page.goto(url);await expect(page.locator('.case-card')).toHaveCount(5);await assertCasesAndDictionary(page);
 for(const image of Object.values(media.images)){
  const response=await request.get('/kurs/inhalt/4711/'+image.path);expect(response.status()).toBe(200);expect(response.headers()['content-type']).toBe('image/webp');
 }
 for(const [file,mime] of [['data/countries.geojson','application/geo+json'],['data/media.json','application/json'],['js/app.js','text/javascript'],['css/style.css','text/css'],['materials/ermittlungsbogen.pdf','application/pdf']]){
  const response=await request.get('/kurs/inhalt/4711/'+file);expect(response.ok()).toBeTruthy();expect(response.headers()['content-type']).toContain(mime);
 }
 assertCleanStart(events);
});

for(const mode of ['missing','failed','throws','blocked','nested'])test(`SCORM Startmodus ${mode}: Spiel bleibt bedienbar`,async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));const game=await embedded(page,mode);
 await open(game,1);await game.locator('#name-answer').fill('Afrika');await submit(game);await result(game,5);
 await game.goto(new URL('/woerterbuch.html',game.url()).href);
 const expected=mode==='nested'?[['LMSInitialize',''],['LMSFinish','']]:['failed','throws'].includes(mode)?[['LMSInitialize','']]:[];
 await expect.poll(()=>calls(page)).toEqual(expected);expect(errors).toEqual([]);
});

test('Separates Fenster: API im Opener, Neuladen und geordnetes Ende',async({page})=>{
 await page.goto('/player.html?mode=popup');const [popup]=await Promise.all([page.waitForEvent('popup'),page.locator('#popup').click()]);
 await expect(popup.locator('.case-card')).toHaveCount(5);expect(await calls(page)).toEqual([['LMSInitialize','']]);
 await popup.reload();await expect(popup.locator('.case-card')).toHaveCount(5);
 expect(await calls(page)).toEqual([['LMSInitialize',''],['LMSFinish',''],['LMSInitialize','']]);
 await popup.goto(origin+'/woerterbuch.html');await expect.poll(()=>calls(page)).toEqual([['LMSInitialize',''],['LMSFinish',''],['LMSInitialize',''],['LMSFinish','']]);await popup.close();
});

test('Mehrfaches Finish und bfcache-Seitenwechsel erzeugen keine Doppelaufrufe',async({page})=>{
 const game=await embedded(page);
 await game.evaluate(()=>{dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));dispatchEvent(new PageTransitionEvent('pagehide'));dispatchEvent(new Event('unload'));});
 expect(await calls(page)).toEqual([['LMSInitialize',''],['LMSFinish',''],['LMSInitialize',''],['LMSFinish','']]);
});

test('Touch, Scrollen, Fotozoom, Wörterbuch und Karte im Player',async({page},info)=>{
 const game=await embedded(page);
 await open(game,2);
 const photo=game.locator('[data-action="select"][data-photo="12"]');await photo.scrollIntoViewIfNeeded();
 if(info.project.use.hasTouch)await photo.tap();else await photo.click();await expect(photo).toHaveAttribute('aria-pressed','true');
 await home(game);await open(game,3);await game.getByRole('button',{name:'Karte groß ansehen'}).click();await expect(game.locator('#map-dialog')).toBeVisible();await game.locator('#map-close').click();
 await game.locator('[data-action="zoom"]').first().click();await expect(game.locator('#photo-dialog')).toBeVisible();await game.locator('#photo-close').click();
 await game.locator('#dictionary-open').click();await game.locator('#dictionary-input').fill('Karte');await game.locator('#dictionary-language').selectOption('ckb');await expect(game.locator('#dictionary-result')).toHaveAttribute('dir','rtl');
 expect(await game.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 // caret: initial avoids Playwright injecting a stylesheet rejected by the application's CSP.
 await page.screenshot({path:info.outputPath('scorm-player.png'),fullPage:true,caret:'initial'});
 await game.locator('#dictionary-close').click();await expect(game.locator('#dictionary-open')).toBeFocused();
});

test('Verzögerte SCORM-Datei blockiert weder Spielstart noch Antwortabgabe',async({page})=>{
 let pending;
 await page.route('**/scorm-runtime.js',route=>{pending=route;});
 const game=await embedded(page);await expect.poll(()=>Boolean(pending)).toBeTruthy();
 await open(game,1);await game.locator('#name-answer').fill('Afrika');await submit(game);await result(game,5);
 expect(await calls(page)).toEqual([]);await pending.continue();
 await expect.poll(()=>calls(page)).toEqual([['LMSInitialize','']]);
 await game.goto(new URL('/woerterbuch.html',game.url()).href);
 await expect.poll(()=>calls(page)).toEqual([['LMSInitialize',''],['LMSFinish','']]);
});
