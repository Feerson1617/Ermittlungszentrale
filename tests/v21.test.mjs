import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {photos,clues,editorialClaims} from '../data/cases.js';
import {coreLearning,extraSpurs} from '../data/learning.js';
import {evaluate,createTask,submitTask} from '../js/scoring.js';
import {freshState,loadState,saveState,STORE} from '../js/session.js';
import {verifyMediaLicense} from '../scripts/media-license.mjs';
const root=new URL('../',import.meta.url),json=async path=>JSON.parse(await readFile(new URL(path,root)));
const media=await json('data/media.json'),rubrics=await json('data/rubrics.json');

test('2.1 erhält alle 19 bisherigen Bilddateien und ihre belegten Identitäten',async()=>{
 const original=await json('tests/fixtures/v20-media-identities.json');
 assert.equal(Object.keys(original).length,19);
 for(const [key,fields] of Object.entries(original))for(const [field,value] of Object.entries(fields))assert.equal(media.images[key][field],value,`${key}.${field}`);
 const used=new Set([...photos.map(p=>p.key),...clues.map(c=>c.key),...Object.values(coreLearning).flatMap(l=>l.steps.flatMap(s=>s.photos||[])),...Object.values(extraSpurs).flatMap(s=>s.photos||[])]);
 for(const key of Object.keys(original))assert.ok(used.has(key),key);
});
test('2.1 ersetzt genau 7/8/9/11/12; alle anderen Katalogidentitäten bleiben gleich',()=>{
 assert.deepEqual(photos.map(p=>p.key),['savanna','desert','forest','lagos','farm','atlas','rural','mine','classroom','market','carry','healthpost']);
 for(const p of photos)assert.equal(media.images[p.key].selectionNumber,p.id);
 for(const key of ['coast','factory','school','supply','clinic'])assert.equal(media.images[key].selectionNumber,null);
});
for(const work of ['8','10'])for(const education of ['9','12'])test(`Neue Motive: Bergbau/Handel ${work} und Lern-/Behandlungsort ${education} sind gültig`,()=>{
 const t=createTask();submitTask(t,rubrics.tasks.selection,{scope:'some',diversity:'different',work,education});
 assert.equal(t.raw,5);assert.equal(t.points,5);assert.equal(t.fullCorrect,true);
});
test('Andere fehlende Bilder sind nicht allein wegen ihres Fehlens richtige Gegenbelege',()=>{
 for(const work of ['3','4','6','9','12'])assert.equal(evaluate(rubrics.tasks.selection,{scope:'some',diversity:'different',work,education:'9'}).raw,4);
 for(const education of ['3','4','6','8','10'])assert.equal(evaluate(rubrics.tasks.selection,{scope:'some',diversity:'different',work:'8',education}).raw,4);
});
test('Sechs Redaktionsbehauptungen erhalten vier kurze unbewertete Beleg-Rückbezüge',()=>{
 assert.deepEqual(rubrics.tasks.selection.editorial,[2,5,7,11]);
 const returns=Object.values(coreLearning).flatMap(l=>l.steps).filter(s=>s.checks?.length);
 assert.equal(returns.length,4);
 assert.deepEqual(new Set(returns.flatMap(s=>s.checks.flatMap(c=>c.claims))),new Set(editorialClaims.map(c=>c.id)));
 assert.equal(Object.values(coreLearning).reduce((n,l)=>n+l.steps.length,0),10);
 assert.equal(Object.values(rubrics.tasks).filter(t=>t.case!==5).reduce((n,t)=>n+t.max,0),30);assert.equal(rubrics.tasks.future.max,5);
 const health=returns.find(s=>s.id==='education-health');
 assert.deepEqual(health.photos,['classroom','school','healthpost','clinic']);
 assert.match(health.checks.find(c=>c.claims.includes('health')).finding,/nicht geklärt/);
 assert.deepEqual(returns.find(s=>s.id==='water-access').photos,['carry','supply']);
});
test('2.0-Sitzung wird nicht mit neuen Bildidentitäten wiederhergestellt',()=>{
 const old=freshState();delete old.contentVersion;old.cases[2].confirmedSelection=[7,8,9,11];
 const s=loadState({getItem:key=>key===STORE?JSON.stringify(old):null});
 assert.equal(s.contentVersion,'2.1');assert.match(s.notice,/alte Nummern.*andere Fotos/);
 assert.deepEqual(s.cases[2].confirmedSelection,[]);assert.equal(s.tasks.title.scored,false);
});
test('2.1-Neuladen erhält auch identische erste und zweite persönliche Auswahlen',()=>{
 let value;const storage={getItem:key=>key===STORE?value:null,setItem:(_,v)=>value=v};
 const s=freshState();s.cases[2].confirmedSelection=[2,5,7,11];s.cases[4].confirmedSelection=[2,5,7,11];
 saveState(s,storage);assert.deepEqual(loadState(storage),s);
});
test('Public-Domain-Sonderfall benötigt tatsächliche Datei- und Lizenzvorlagenbelege',async()=>{
 const i=media.images.healthpost,page=Object.values((await json(i.evidence)).query.pages)[0];
 assert.equal(await verifyMediaLicense(i,page,root),true);
 assert.equal(await verifyMediaLicense({...i,rightsEvidenceSha256:'0'.repeat(64)},page,root),false);
 assert.equal(await verifyMediaLicense({...i,rightsEvidence:'docs/media/not-present.json'},page,root),false);
 const altered=structuredClone(page);altered.revisions[0].slots.main['*']='Unbelegte Behauptung: Public Domain';
 assert.equal(await verifyMediaLicense(i,altered,root),false);
});
