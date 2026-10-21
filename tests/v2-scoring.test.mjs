import {test} from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {evaluateName,evaluateScope,evaluate,createTask,openHint,submitTask,attemptResolution,confirmResolution} from "../js/scoring.js";
import {freshState,loadState,saveState,STORE,LEGACY_STORE} from "../js/session.js";
const r=JSON.parse(await readFile(new URL('../data/rubrics.json',import.meta.url)));
const old=JSON.parse(await readFile(new URL('./fixtures/v1-rubrics.json',import.meta.url)));
const correct={scope:'some',diversity:'different',work:'8',education:'12'};
for(const input of ['nur wenige','ein paar Orte','nur ein paar Orte','Die Fotos zeigen nur einen kleinen Teil'])
 test(`T1 historischer Freitext: ${input}`,()=>assert.equal(evaluateScope(input).raw,2));
for(const input of ['Afrika ist ein Kontinent','Afrika ist kein Land, sondern ein Kontinent','AFRIKA','Afirka','Africa'])
 test(`T4 erkennt die richtige Kontinentantwort: ${input}`,()=>assert.equal(evaluateName(input,r.tasks.title).raw,5));
for(const input of ['Afrika ist ein Land','Afrika ist kein Kontinent','Amerika','America','Südafrika','Asien'])
 test(`T4 fachlich falsch: ${input}`,()=>assert.equal(evaluateName(input,r.tasks.title).status,'wrong'));
test('T4 ein mehrdeutiges Fragment öffnet Klärung ohne Versuch',()=>{
 const t=createTask();submitTask(t,r.tasks.title,{name:'Afrika Land?'});
 assert.equal(t.clarification,true);assert.deepEqual(t.attempts,[0,0,0,0]);assert.equal(t.points,0);
 submitTask(t,r.tasks.title,{name:'Afrika'});assert.equal(t.points,5);assert.equal(t.attempts[0],1);
});
for(const [label,answers,raw] of [['T2',{scope:'einige',diversity:'nein',missing:[1,2]},3],['D1',{scope:'alle',diversity:'ja',missing:[3,1]},1]])
 test(`${label} historische Fixture: Teilwertung bleibt fachlich unvollständig`,()=>{
  const t=createTask();if(label==='T2')openHint(t);submitTask(t,old.tasks.selection,answers);
  assert.equal(t.raw,raw);assert.equal(t.points,raw);assert.equal(t.scored,true);assert.equal(t.fullCorrect,false);assert.equal(t.resolved,false);
 });
test('T2 neue Auswahl: drei Punkte am Hinweislimit sind kein vollständiger Erfolg',()=>{
 const t=createTask();openHint(t);submitTask(t,r.tasks.selection,{...correct,work:'1',education:'2'});
 assert.equal(t.raw,3);assert.equal(t.points,3);assert.equal(t.fullCorrect,false);assert.equal(t.resolved,false);
 assert.equal(submitTask(t,r.tasks.selection,correct).status,'scored');assert.equal(t.points,3);assert.equal(openHint(t),false);
});
test('D1 Auflösung ist begrenzt, unbewertet und nach Fehlkorrektur bestätigbar',()=>{
 const t=createTask();submitTask(t,r.tasks.selection,{scope:'all',diversity:'same',work:'8',education:'1'});
 assert.equal(t.raw,1);assert.equal(attemptResolution(t,r.tasks.selection,{}),'empty');
 assert.equal(attemptResolution(t,r.tasks.selection,{scope:'all',diversity:'same',education:'1'}),'explain');
 assert.equal(attemptResolution(t,r.tasks.selection,correct),'unavailable');assert.equal(t.resolved,false);
 assert.equal(confirmResolution(t),true);assert.equal(t.resolved,true);assert.equal(t.points,1);assert.equal(t.fullCorrect,false);
});
test('D1 richtige Korrektur schließt die Auflösung ohne Nachbepunktung',()=>{
 const t=createTask();submitTask(t,r.tasks.selection,{...correct,education:'1'});
 assert.equal(t.raw,4);assert.equal(attemptResolution(t,r.tasks.selection,{education:'9'}),'resolved');assert.equal(t.points,4);
});
test('T3 Hinweise behalten den Entwurf und trennen die vereinfachte Aufgabe',()=>{
 const t=createTask();t.answers=structuredClone(correct);openHint(t);assert.deepEqual(t.answers,correct);
 openHint(t);assert.deepEqual(t.answers,correct);openHint(t);
 assert.deepEqual(t.regularDraft,correct);assert.deepEqual(t.answers,{});
 submitTask(t,r.tasks.selection,{fallback:r.tasks.selection.fallback.answer});
 assert.equal(t.points,1);assert.equal(t.usedFallback,true);assert.equal(t.fullCorrect,false);assert.equal(t.resolved,true);
 assert.deepEqual(t.regularDraft,correct);
});
for(const [key,task] of Object.entries(r.tasks)) test(`D2 ${key}: Antwort-ID stimmt mit angezeigter Option überein`,()=>{
 assert.ok(task.fallback.options.some(o=>o.id===task.fallback.answer));
 const t=createTask();openHint(t);openHint(t);openHint(t);
 const wrong=task.fallback.options.find(o=>o.id!==task.fallback.answer).id;
 submitTask(t,task,{fallback:wrong});assert.equal(t.points,0);assert.equal(t.scored,false);assert.equal(t.locked,false);
 submitTask(t,task,{fallback:task.fallback.answer});assert.equal(t.points,1);assert.equal(t.scored,true);
});
test('D2 richtige Positionen wechseln statt immer A',()=>assert.deepEqual(new Set(Object.values(r.tasks).map(t=>t.fallback.answer)),new Set(['a','b'])));
for(const count of [0,1,2,3,4]) test(`Bonus: ${count} richtige stabile Kennungen ergeben ${count===4?5:count} Rohpunkte`,()=>{
 const expected=r.tasks.future.matchingAnswers, keys=Object.keys(expected), matches={};
 keys.forEach((key,i)=>matches[key]=i<count?expected[key]:Object.values(expected)[(i+1)%4]);
 const t=createTask();const x=submitTask(t,r.tasks.future,{matches});
 assert.equal(x.raw,count===4?5:count);assert.equal(t.fullCorrect,count===4);
 if(count>0&&count<4){const corrections=Object.fromEntries(keys.filter((_,i)=>!t.criteria[i]).map(key=>[key,expected[key]]));assert.equal(attemptResolution(t,r.tasks.future,corrections),'resolved');assert.equal(t.points,count);}
});
test('Leere Pflichtfelder verbrauchen keinen Versuch',()=>{
 const t=createTask();submitTask(t,r.tasks.selection,{scope:'some'});assert.deepEqual(t.attempts,[0,0,0,0]);assert.equal(t.points,0);
});
test('Schema 1 wird gezielt mit verständlicher Meldung verworfen',()=>{
 const s=loadState({getItem:key=>key===LEGACY_STORE?JSON.stringify({version:1}):null});
 assert.equal(s.version,2);assert.match(s.notice,/alte digitale Sitzung/);assert.equal(s.tasks.title.scored,false);
});
test('Offene Auflösung und getrennte Bildauswahlen überleben Wiederherstellung',()=>{
 let value;const storage={getItem:key=>key===STORE?value:null,setItem:(_,v)=>value=v};
 const s=freshState();s.current=2;s.cases[2].selected=[1,2,11,12];s.cases[2].confirmedSelection=[1,2,11,12];s.cases[4].selected=[3,4,8,9];
 submitTask(s.tasks.selection,r.tasks.selection,{scope:'all',diversity:'same',work:'8',education:'1'});saveState(s,storage);
 assert.deepEqual(loadState(storage),s);assert.equal(loadState(storage).tasks.selection.resolved,false);
});

test('Länderregeln unterscheiden Land, Kontinent und die jeweils verneinte Aussage',()=>{
 for(const [id,name] of [['atlas','Marokko'],['city','Nigeria'],['cocoa','Ghana']]){
  assert.equal(evaluate(r.tasks[id],{name:`${name} ist ein Land`}).raw,5);
  assert.equal(evaluate(r.tasks[id],{name:`${name} ist kein Kontinent, sondern ein Land`}).raw,5);
  assert.equal(evaluate(r.tasks[id],{name:`${name} ist ein Kontinent`}).status,'wrong');
  assert.equal(evaluate(r.tasks[id],{name:`${name} ist kein Land`}).status,'wrong');
 }
});

test('Strukturell beschädigte Lernphase wird vor dem Rendern verworfen',()=>{
 const state=freshState();state.current=3;state.cases[3].phase=1;state.cases[3].learningStep=12;
 assert.equal(loadState({getItem:()=>JSON.stringify(state)}).current,null);
 state.cases[3].learningStep=0;state.cases[3].phase=12;
 assert.equal(loadState({getItem:()=>JSON.stringify(state)}).current,null);
});
