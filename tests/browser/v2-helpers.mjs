import {expect} from '@playwright/test';
export const open=(page,n)=>page.locator(`[data-action="open"][data-case="${n}"]`).click();
export const home=page=>page.locator('.case-nav [data-action="home"]').click();
export const submit=page=>page.getByRole('button',{name:'Antwort abgeben',exact:true}).click();
export async function boot(page){await page.goto('./');await expect(page.locator('.case-card')).toHaveCount(5);}
export async function choose(page,ids){for(const id of ids)await page.locator(`[data-action="select"][data-photo="${id}"]`).click();}
export async function paper(page){await page.locator('#paper-recorded').check();await page.locator('[data-action="phase-next"]').click();}
export async function selectionTask(page){
 await choose(page,[1,2,3,4]);await page.getByRole('button',{name:'Auswahl ansehen',exact:true}).click();await paper(page);await page.getByRole('button',{name:'Die Auswahl prüfen',exact:true}).click();
}
export async function answerSelection(page,answers={scope:'some',diversity:'different',work:'8',education:'12'}){
 for(const key of ['scope','diversity','work','education']){
  if(key==='scope'||key==='diversity')await page.locator(`input[name="${key}"][value="${answers[key]}"]`).check();
  else await page.locator(`#${key}-answer`).selectOption(String(answers[key]));
  await page.locator('[data-action="question-next"]').click();
 }
}
export async function result(page,points){
 await expect(page.locator('.result .points')).toContainText(String(points));await expect(page.locator('[data-action="result-next"]')).toBeDisabled();
 await page.locator('#points-recorded').check();await page.locator('[data-action="result-next"]').click();
}
export async function learning(page,visit=async()=>{},after=async()=>{}){
 let count=0;
 while(await page.locator('[data-learning-step]').count()){
  await visit(page);
  for(const select of await page.locator('select[data-learning]').all())await select.selectOption({index:1});
  if(await page.locator('#learning-note').count())await page.locator('#learning-note').fill('Eine Spur ergänzt unsere Auswahl.');
  await page.locator('[data-action="learning-check"]').click();await expect(page.locator('.learning [role="status"]')).toBeVisible();await after(page);
  await page.locator('[data-action="learning-next"]').click();if(++count>12)throw Error('Unbegrenzte Lernschleife');
 }
 return count;
}
export async function solveCountries(page,visit=async()=>{}){
 const counts=[];
 for(const name of ['Marokko','Nigeria','Ghana']){
  await visit(page);await page.locator('#name-answer').fill(name);await submit(page);await result(page,5);counts.push(await learning(page,visit));
 }
 return counts;
}
export async function decoded(page){
 for(const img of await page.locator('main .photo img').all()){
  await img.scrollIntoViewIfNeeded();await expect.poll(()=>img.evaluate(i=>i.complete&&i.naturalWidth>=600)).toBeTruthy();
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
}
export async function resolvePartial(page,kind='selection',wrong=false){
 const expected=kind==='selection'?{scope:'some',diversity:'different',work:'8',education:'12'}:{water:'nature',people:'population',economy:'economy',solar:'future'};
 const incorrect=kind==='selection'?{scope:'all',diversity:'same',work:'6',education:'3'}:{water:'population',people:'economy',economy:'future',solar:'nature'};
 for(const select of await page.locator('[data-correction]').all()){
  const key=await select.getAttribute('data-correction');await select.selectOption((wrong?incorrect:expected)[key]);
 }
 await page.locator('[data-action="resolution-check"]').click();
 if(wrong){await expect(page.locator('[data-action="resolution-check"]')).toHaveCount(0);await page.locator('[data-action="resolution-confirm"]').click();}
 await expect(page.locator('.resolution')).toContainText('Die Auflösung ist abgeschlossen');
}
