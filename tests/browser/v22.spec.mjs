import {test,expect} from '@playwright/test';
import {boot,open,choose,submit,result} from './v2-helpers.mjs';
import {coreLearning} from '../../data/learning.js';
const steps=Object.values(coreLearning).flatMap(l=>l.steps),failures=new WeakMap();
test.beforeEach(async({page})=>{
 const errors=[];failures.set(page,errors);
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 page.on('requestfailed',r=>errors.push(r.url()));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4173/'))errors.push(r.url());});
});
test.afterEach(async({page})=>expect(failures.get(page)).toEqual([]));
const session=page=>page.evaluate(()=>JSON.parse(sessionStorage.getItem('ermittlungszentrale-session-v2')));
for(const mode of ['correct','explain'])test(`2.2 alle zehn Lernschritte: konkrete Rückmeldung ${mode}, keine neuen Punkte`,async({page})=>{
 test.setTimeout(90000);await boot(page);await open(page,3);const seen=[];
 for(const country of ['Marokko','Nigeria','Ghana']){
  await page.locator('#name-answer').fill(country);await submit(page);await result(page,5);
  const tasks=(await session(page)).tasks;
  while(await page.locator('[data-learning-step]').count()){
   const id=await page.locator('[data-learning-step]').getAttribute('data-learning-step'),step=steps.find(s=>s.id===id);seen.push(id);
   if(step.reflection)await page.locator('#learning-evidence').selectOption('known');
   for(const q of step.questions||[])await page.locator(`#learning-${q.key}`).selectOption(q.any?'no':mode==='correct'?q.answer:q.options.find(o=>o.id!==q.answer).id);
   await page.locator('[data-action="learning-check"]').click();
   for(const q of step.questions||[]){
    const feedback=page.locator(`[data-learning-feedback="${q.key}"]`);await expect(feedback).toBeVisible();
    await expect(feedback).toHaveAttribute('data-feedback-kind',q.any?'personal':mode);
    if(q.any)await expect(feedback).toContainText('nicht als richtig oder falsch bewertet');
    else{
     await expect(feedback).toContainText(q.evidence);
     if(mode==='explain'){const o=q.options.find(o=>o.id!==q.answer);await expect(feedback).toContainText(o.label);await expect(feedback).toContainText(o.why);}
    }
   }
   await expect(page.locator('.more-info')).not.toHaveAttribute('open');
   await page.locator('.more-info summary').click();await expect(page.locator('.more-info p')).toBeVisible();
   expect((await session(page)).tasks).toEqual(tasks);
   if(id==='city-context'){
    await expect(page.locator('.context-cards')).toContainText('2016');await expect(page.locator('.context-cards')).toContainText('2019');
    await page.reload();await expect(page.locator('[data-learning-feedback="conditions"]')).toHaveAttribute('data-feedback-kind',mode);
    expect((await session(page)).tasks).toEqual(tasks);
   }
   await page.locator('[data-action="learning-next"]').click();
  }
 }
 expect(seen).toEqual(steps.map(s=>s.id));
 await expect(page.locator('.summary-table')).toContainText('Ghana');
});
test('2.2 Wörterbuch: Schließen und Escape geben Fokus zurück, Antwort und Punkte bleiben',async({page})=>{
 await boot(page);await open(page,1);await page.locator('#name-answer').fill('Afirka');await page.locator('[data-action="hint"]').click();
 const before=(await session(page)).tasks,trigger=page.locator('#dictionary-open');
 for(const close of ['button','escape']){
  await trigger.focus();await trigger.press('Enter');await expect(page.locator('#dictionary-input')).toBeFocused();
  await page.locator('#dictionary-input').fill('belegen');await expect(page.locator('#dictionary-context')).toContainText('Einfach erklärt:');
  if(close==='button')await page.locator('#dictionary-close').click();else await page.keyboard.press('Escape');
  await expect(page.locator('#dictionary')).not.toBeVisible();await expect(trigger).toBeFocused();
  await expect(page.locator('#name-answer')).toHaveValue('Afirka');expect((await session(page)).tasks).toEqual(before);
 }
 await submit(page);await expect(page.locator('.result .points')).toContainText('3');
});
test('2.2 Klassenraumtitel und sichtbare Satzanfänge, freie Reflexion bleibt möglich',async({page})=>{
 await boot(page);await open(page,4);
 await expect(page.locator('[data-action="select"][data-photo="9"]')).toContainText('Klassenraum mit Holztischen und Stühlen');
 await choose(page,[2,5,7,11]);await page.getByRole('button',{name:'Auswahl ansehen',exact:true}).click();
 for(const text of ['Gleich geblieben ist …','Neu ist für uns …','Dazu passt Bild …'])await expect(page.locator('.sentence-starters')).toContainText(text);
 await expect(page.locator('main')).toContainText('oder eigene Wörter');expect((await session(page)).tasks.headline.scored).toBe(false);
});
