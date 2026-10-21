import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {coreLearning} from '../data/learning.js';
import {photos} from '../data/cases.js';
import {wordHelp} from '../data/word-help.js';
import {learningFeedback} from '../js/learning-feedback.js';
const steps=Object.values(coreLearning).flatMap(l=>l.steps);
for(const step of steps)for(const q of step.questions||[]){
 if(q.any){
  for(const o of q.options)test(`Persönliche Vermutung ${o.id} bleibt ohne Richtig-falsch-Wertung`,()=>{
   const f=learningFeedback(step,{[q.key]:o.id}).find(f=>f.key===q.key);
   assert.equal(f.kind,'personal');assert.ok(f.text.includes(o.label));assert.match(f.text,/nicht als richtig oder falsch bewertet/);
  });continue;
 }
 for(const o of q.options)test(`${step.id}/${q.key}/${o.id}: passende konkrete Rückmeldung`,()=>{
  const answers={[q.key]:o.id},snapshot=structuredClone(answers);
  const f=learningFeedback(step,answers).find(f=>f.key===q.key);
  assert.deepEqual(answers,snapshot);assert.ok(f.text.includes(q.evidence));
  if(o.id===q.answer){assert.equal(f.kind,'correct');assert.match(f.text,/^Richtig\./);}
  else{assert.ok(o.why?.length>15);assert.equal(f.kind,'explain');assert.ok(f.text.includes(`„${o.label}“`));assert.ok(f.text.includes(o.why));}
 });
}
test('Zehn unveränderte Lernschritte, kurze Kernsätze und ausführliche Grenzen erhalten',()=>{
 assert.equal(steps.length,10);
 for(const s of steps){assert.ok(s.more?.length>30,s.id);assert.ok(s.explanation.split(/\s+/).length<=27,s.id);}
 assert.equal(learningFeedback(steps.find(s=>s.reflection),{evidence:'known'})[0].kind,'personal');
});
test('Lagos beschränkt die zwei Karten auf datierte Bildbeobachtungen',()=>{
 const s=steps.find(s=>s.id==='city-context');assert.equal(s.cards.length,2);
 assert.match(s.cards[0].title,/Lagos Island.*2016/);assert.match(s.cards[1].title,/Makoko.*2019/);
 assert.doesNotMatch(s.cards.map(c=>c.text).join(' '),/Wasser|Schule|Einkommen|arm|Toilette/);
 assert.match(s.more,/keine Messungen/);assert.match(s.more,/fehlen hier geprüfte örtliche Daten/);
});
test('Bild 9 benennt genau den sichtbaren Klassenraum',()=>{
 assert.equal(photos.find(p=>p.id===9).title,'Klassenraum mit Holztischen und Stühlen');
});
test('Alle 24 Fotoidentitäten und Dateiprüfsummen aus 2.1 bleiben erhalten',async()=>{
 const baseline=JSON.parse(await readFile(new URL('./fixtures/v21-media-checksums.json',import.meta.url)));
 const media=JSON.parse(await readFile(new URL('../data/media.json',import.meta.url)));
 assert.equal(Object.keys(baseline).length,24);
 for(const [key,old] of Object.entries(baseline))for(const field of ['path','sha256'])assert.equal(media.images[key][field],old[field],`${key}.${field}`);
});
test('Alle schwierigen Arbeitswörter besitzen eine konkrete deutsche Hilfe',()=>{
 for(const word of ['vergleichen','Beleg','belegen','pauschal','Versorgung','Lebensbedingungen','Infrastruktur','wirtschaftliche Tätigkeit','aufbereiten','verarbeiten'])
  assert.ok(wordHelp.some(([head,meaning])=>head.split(' / ').includes(word)&&meaning.length>20),word);
});
test('Schülerbogen enthält die Antwort nicht mehr und trennt alle Punktefelder',async()=>{
 const html=await readFile(new URL('../materials/ermittlungsbogen.html',import.meta.url),'utf8');
 assert.doesNotMatch(html,/Vier Fotos zeigen einige Orte|Sie stehen nicht für alle Lebensbedingungen/);
 assert.match(html,/Erst nach der Aufgabe ergänzen/);assert.match(html,/Vier Fotos zeigen … _/);
 assert.match(html,/aria-label="Punkte der vier Hauptakten"/);
 for(const n of ['001','002','003','004'])assert.match(html,new RegExp('<th>Akte '+n+'</th>'));
});
