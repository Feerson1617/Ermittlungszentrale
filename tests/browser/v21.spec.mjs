import {test,expect} from '@playwright/test';
import {boot,open,home,choose,paper,submit,result,learning,decoded} from './v2-helpers.mjs';
import {editorialClaims} from '../../data/cases.js';
const errors=new WeakMap();
test.beforeEach(async({page})=>{
 const seen=[];errors.set(page,seen);
 page.on('pageerror',e=>seen.push(e.message));
 page.on('console',m=>{if(m.type()==='error')seen.push(m.text());});
 page.on('requestfailed',r=>seen.push(r.url()));
 page.on('response',r=>{if(r.status()>=400)seen.push(`${r.status()} ${r.url()}`);});
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4173/'))seen.push(r.url());});
});
test.afterEach(async({page})=>expect(errors.get(page)).toEqual([]));
const session=page=>page.evaluate(()=>JSON.parse(sessionStorage.getItem('ermittlungszentrale-session-v2')));

test('2.1: offene persönliche Auswahl vor klar gekennzeichneter erfundener Redaktion',async({page})=>{
 await boot(page);await open(page,2);
 await expect(page.locator('main')).toContainText('Welche vier Bilder passen für euch besonders zu Afrika?');
 await expect(page.locator('[data-claim],.new-evidence')).toHaveCount(0);
 await choose(page,[2,5,7,11]);await page.getByRole('button',{name:'Auswahl ansehen',exact:true}).click();
 await expect(page.locator('[data-claim]')).toHaveCount(0);await paper(page);
 await expect(page.getByRole('heading',{name:'Die erfundene Redaktion behauptet …',exact:true})).toBeVisible();
 await expect(page.locator('.editorial-claims')).toContainText('keine Tatsachen');
 for(const claim of editorialClaims)await expect(page.locator(`[data-claim="${claim.id}"]`)).toHaveText(`„${claim.text}“`);
 const editorial=page.locator('.comparison > div').nth(1);
 await expect(editorial.locator('img')).toHaveCount(4);
 expect(await editorial.locator('img').evaluateAll(imgs=>imgs.map(i=>i.getAttribute('src')))).toEqual([
  'assets/images/02.webp','assets/images/05.webp','assets/images/v21-rural.webp','assets/images/v21-carry.webp',
 ]);
 await expect(page.locator('main')).toContainText('Sie steht nicht für alle Medien');
 await expect(page.locator('.new-evidence')).toHaveCount(0);
 const s=await session(page);expect(s.cases[2].confirmedSelection).toEqual([2,5,7,11]);expect(Object.values(s.tasks).every(t=>!t.scored&&t.points===0)).toBeTruthy();
});

test('2.1: vier Beleg-Rückbezüge prüfen alle Behauptungen und verändern keine Punkte',async({page})=>{
 test.setTimeout(90000);await boot(page);await open(page,3);
 const ids=[],views=[];
 for(const country of ['Marokko','Nigeria','Ghana']){
  await page.locator('#name-answer').fill(country);await submit(page);await result(page,5);
  const before=(await session(page)).tasks;
  await learning(page,async p=>{await decoded(p);await expect(p.locator('.new-evidence')).toHaveCount(0);},async p=>{
   expect((await session(p)).tasks).toEqual(before);
   if(await p.locator('.new-evidence').count()){
    views.push(await p.locator('[data-learning-step]').getAttribute('data-learning-step'));
    await expect(p.getByRole('heading',{name:'Neue Beweise gefunden!',exact:true})).toBeVisible();
    ids.push(...await p.locator('[data-reviewed-claim]').evaluateAll(els=>els.map(e=>e.dataset.reviewedClaim)));
    if(views.at(-1)==='education-health'){
     await expect(p.locator('.learning-photos img')).toHaveCount(4);
     await expect(p.locator('.new-evidence')).toContainText('nicht geklärt');
    }
    if(views.at(-1)==='water-access')await expect(p.locator('.learning')).toContainText('Wie weit der Weg ist und ob das Wasser trinkbar ist, zeigen diese Fotos nicht');
   }
  });
 }
 expect(views).toEqual(['city-trade','city-context','education-health','water-access']);
 expect(ids.sort()).toEqual(editorialClaims.map(c=>c.id).sort());
 const s=await session(page);expect(s.tasks.atlas.points+s.tasks.city.points+s.tasks.cocoa.points).toBe(15);
 expect(s.tasks.selection.scored).toBe(false);
});

test('2.1: identische erste und zweite Viererwahl ist zulässig und bleibt getrennt gespeichert',async({page})=>{
 await boot(page);await open(page,2);await choose(page,[2,5,7,11]);await page.getByRole('button',{name:'Auswahl ansehen',exact:true}).click();await paper(page);await home(page);
 await open(page,4);await choose(page,[2,5,7,11]);await page.getByRole('button',{name:'Auswahl ansehen',exact:true}).click();
 await expect(page.locator('main')).toContainText('Was ist gleich geblieben?');await paper(page);
 await page.reload();
 const s=await session(page);expect(s.cases[2].confirmedSelection).toEqual([2,5,7,11]);expect(s.cases[4].confirmedSelection).toEqual([2,5,7,11]);
 expect(s.tasks.headline.scored).toBe(false);expect(s.tasks.selection.scored).toBe(false);
});

test('2.1: vorhandene 2.0-Fotoauswahl wird mit verständlicher Meldung zurückgesetzt',async({page})=>{
 await page.addInitScript(()=>sessionStorage.setItem('ermittlungszentrale-session-v2',JSON.stringify({version:2,current:2,cases:{2:{confirmedSelection:[7,8,9,11]}}})));
 await boot(page);await expect(page.locator('main')).toContainText('damit alte Nummern nicht für andere Fotos stehen');
 await page.locator('[data-action="dismiss-notice"]').click();await open(page,2);
 await expect(page.locator('[data-action="select"][aria-pressed="true"]')).toHaveCount(0);
});
