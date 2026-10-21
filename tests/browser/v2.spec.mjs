import {test,expect} from '@playwright/test';
import {boot,open,home,submit,choose,paper,selectionTask,answerSelection,result,learning,solveCountries,decoded,resolvePartial} from './v2-helpers.mjs';
const observed=new WeakMap();
test.beforeEach(async({page})=>{
 const errors=[];observed.set(page,errors);page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 page.on('requestfailed',r=>errors.push(r.url()));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4173/'))errors.push(r.url());});
});
test.afterEach(async({page})=>expect(observed.get(page)).toEqual([]));
test('T3 fokussierter Entwurf bleibt durch Hinweise und Wörterbuch erhalten',async({page})=>{
 await boot(page);await open(page,1);await page.locator('#name-answer').evaluate(e=>{e.value='Afirka';e.focus();});
 await page.locator('[data-action="hint"]').click();await expect(page.locator('#name-answer')).toHaveValue('Afirka');
 await page.locator('#dictionary-open').click();await page.locator('#dictionary-input').fill('Karte');await page.locator('#dictionary-close').click();
 await expect(page.locator('#name-answer')).toHaveValue('Afirka');await expect(page.locator('.point-cap')).toContainText('3');
 await submit(page);await expect(page.locator('.result-stamp')).toContainText('Alle Teile stimmen. Mit einem Hinweis: 3 Punkte.');
});
test('T4 falsche Zusatzbehauptung sperrt, richtige Negation wird erkannt',async({page})=>{
 await boot(page);await open(page,1);await page.locator('#name-answer').fill('Afrika ist ein Land');await submit(page);
 await expect(page.getByRole('button',{name:'Antwort abgeben',exact:true})).toBeDisabled();await expect(page.locator('.result')).toHaveCount(0);
 await page.locator('[data-action="hint"]').click();await expect(page.locator('#name-answer')).toHaveValue('Afrika ist ein Land');
 await page.locator('#name-answer').fill('Afrika ist kein Land, sondern ein Kontinent');await submit(page);await result(page,3);
});
test('T4 neutrale Namensklärung zählt erst die abschließende Entscheidung',async({page})=>{
 await boot(page);await open(page,1);await page.locator('#name-answer').fill('Afrika Land?');await submit(page);
 await expect(page.locator('#name-choice option')).toHaveCount(7);await expect(page.locator('#name-choice')).toHaveValue('');
 await expect(page.locator('.point-cap')).toContainText('5');await page.locator('#name-choice').selectOption({label:'Afrika'});await submit(page);await result(page,5);
});
test('T2/D1 Teilpunkte am Limit: Auflösung bleibt nach Navigation und Reload offen',async({page})=>{
 await boot(page);await open(page,2);await selectionTask(page);await answerSelection(page,{scope:'some',diversity:'different',work:'6',education:'3'});
 await page.locator('[data-action="hint"]').click();await submit(page);
 await expect(page.locator('.result-stamp')).toContainText('Ein Teil stimmt');await expect(page.locator('.result .points')).toContainText('3');
 await home(page);await expect(page.locator('[data-case="2"]')).toContainText('Auflösung oder Papiernotiz offen');
 await page.reload();await open(page,2);await expect(page.locator('[data-action="resolution-check"]')).toBeVisible();
 await resolvePartial(page,'selection',true);await expect(page.locator('.result .points')).toContainText('3');await result(page,3);
});
test('Akte 003: drei Länder und alle verpflichtenden Beleg-Ermittlungen',async({page})=>{
 await boot(page);await open(page,3);const seen=[];
 const counts=await solveCountries(page,async p=>{await decoded(p);const step=p.locator('[data-learning-step]');if(await step.count())seen.push(await step.getAttribute('data-learning-step'));});
 expect(counts).toEqual([1,5,4]);expect(seen).toContain('city-context');expect(seen).toContain('education-health');expect(seen).toContain('reflection');
 await expect(page.locator('.summary-table tbody tr')).toHaveCount(3);await expect(page.locator('.summary-table')).toContainText('Marokko');
});
test('Fotozoom ist kostenlos, separat anwählbar und stellt Fokus wieder her',async({page})=>{
 await boot(page);await open(page,2);const choice=page.locator('[data-action="select"][data-photo="12"]');
 const zoom=page.getByRole('button',{name:'Bild 12 vergrößern',exact:true});await zoom.click();await expect(page.locator('#photo-dialog')).toBeVisible();
 await expect.poll(()=>page.locator('#photo-content img').evaluate(i=>i.complete&&i.naturalWidth>=600)).toBeTruthy();
 await page.locator('#photo-close').click();await expect(zoom).toBeFocused();await expect(choice).toHaveAttribute('aria-pressed','false');
 await choice.click();await expect(choice).toHaveAttribute('aria-pressed','true');expect(await page.locator('button button').count()).toBe(0);
});
test('Akte 004 ohne erste Auswahl erfindet keinen Vergleich oder Nullpunktestand',async({page})=>{
 await boot(page);await open(page,4);await choose(page,[3,8,11,12]);await page.getByRole('button',{name:'Auswahl ansehen',exact:true}).click();
 await expect(page.locator('main')).toContainText('Eine bestätigte erste Auswahl fehlt');await paper(page);
 await page.locator('input[name="headline"][value="c"]').check();await submit(page);await result(page,5);
 for(const input of await page.locator('.score-input').all())await expect(input).toHaveValue('');await expect(page.locator('#calculator-total')).toContainText('—');
});
test('Getrennte bestätigte Auswahlen: Neustart der vierten Akte lässt die erste bestehen',async({page})=>{
 await boot(page);await open(page,2);await choose(page,[1,2,11,12]);await page.getByRole('button',{name:'Auswahl ansehen',exact:true}).click();await paper(page);await home(page);
 await open(page,4);await choose(page,[3,4,8,9]);await page.getByRole('button',{name:'Auswahl ansehen',exact:true}).click();await expect(page.locator('main')).toContainText('1 · 2 · 11 · 12');
 await page.locator('[data-action="restart"]').click();await page.locator('#restart-confirm').click();await expect(page.locator('[aria-pressed="true"]')).toHaveCount(0);
 await home(page);await open(page,2);await expect(page.locator('main')).toContainText('Eure Auswahl');
 const state=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('ermittlungszentrale-session-v2')));expect(state.cases[2].confirmedSelection).toEqual([1,2,11,12]);
});
test('Bonus: drei richtige Zuordnungen ergeben drei Punkte, keine Vollständigkeit',async({page})=>{
 await boot(page);await open(page,5);await expect(page.locator('main')).toContainText('Erfundene Nachrichten');await page.locator('[data-action="phase-next"]').click();
 for(const [key,value] of Object.entries({water:'nature',people:'population',economy:'economy',solar:'nature'}))await page.locator(`#match-${key}`).selectOption(value);
 await submit(page);await expect(page.locator('.result-stamp')).toContainText('Ein Teil stimmt');await resolvePartial(page,'future');await result(page,3);
 await page.locator('#future-question').fill('Wer kann die Versorgung nutzen?');await page.locator('[data-action="finish"]').click();await expect(page.locator('.case-summary')).toContainText('3 / 5 Bonuspunkte');
});

test('Alte Sitzung zeigt die Rücksetzinformation und alle Akten bleiben unabhängig',async({page})=>{
 await page.addInitScript(()=>sessionStorage.setItem('ermittlungszentrale-session-v1',JSON.stringify({version:1,current:3})));
 await boot(page);await expect(page.locator('main')).toContainText('Die alte digitale Sitzung');
 await page.locator('[data-action="dismiss-notice"]').click();await open(page,4);
 await expect(page.locator('[data-action="select"]')).toHaveCount(12);
});
test('Weitere Spuren bleiben freiwillig, lokale Energieabbildung ist kostenlos erreichbar',async({page})=>{
 await boot(page);await open(page,3);await page.locator('#name-answer').fill('Marokko');await submit(page);await result(page,5);
 for(const select of await page.locator('select[data-learning]').all())await select.selectOption({index:1});
 await page.locator('[data-action="learning-check"]').click();await page.locator('.optional-spurs summary').click();
 await expect(page.locator('.optional-spurs')).toContainText('Solarthermie');await decoded(page);
 const state=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('ermittlungszentrale-session-v2')));
 expect(state.tasks.atlas.points).toBe(5);expect(state.tasks.city.scored).toBe(false);
 await page.locator('[data-action="learning-next"]').click();await expect(page.locator('#name-answer')).toBeVisible();
});

test('Kakaokette ist vor der Zuordnung als vierstufiges Schema sichtbar',async({page})=>{
 await boot(page);await open(page,3);
 await page.locator('#name-answer').fill('Marokko');await submit(page);await result(page,5);await learning(page);
 await page.locator('#name-answer').fill('Nigeria');await submit(page);await result(page,5);await learning(page);
 await page.locator('#name-answer').fill('Ghana');await submit(page);await result(page,5);
 await expect(page.locator('.cocoa-chain li')).toHaveCount(4);
 await expect(page.locator('.cocoa-chain')).toContainText('Bohnen aufbereiten und verarbeiten');
 await expect(page.locator('.learning [role="status"]')).toHaveCount(0);
});
