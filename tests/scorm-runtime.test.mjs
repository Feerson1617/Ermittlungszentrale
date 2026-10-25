import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const code = readFileSync(new URL('../scorm/runtime.js', import.meta.url), 'utf8');
function environment({result='true', throws=false, finishThrows=false}={}) {
  const calls=[], events={};
  const api={
    LMSInitialize(arg){calls.push(['LMSInitialize',arg]);if(throws)throw Error('blocked');return result;},
    LMSFinish(arg){calls.push(['LMSFinish',arg]);if(finishThrows)throw Error('gone');return 'true';},
  };
  const win={addEventListener:(name,fn)=>(events[name]??=[]).push(fn)};
  win.parent=win;
  const context=vm.createContext({window:win});
  return {win,api,calls,run:()=>vm.runInContext(code,context),emit:(name,event={})=>events[name]?.forEach(fn=>fn(event))};
}
test('parent API: exactly initialize and finish, no student data or CMI calls',()=>{
  const e=environment();e.win.parent={API:e.api};e.run();e.run();
  e.emit('pagehide');e.emit('unload');e.emit('pagehide');
  assert.deepEqual(e.calls,[['LMSInitialize',''],['LMSFinish','']]);
});
test('opener and opener ancestor API discovery',()=>{
  const e=environment();e.win.opener={parent:{API:e.api}};e.run();e.emit('pagehide');assert.equal(e.calls.length,2);
});
test('blocked parent and API access still allow opener discovery',()=>{
  const e=environment();Object.defineProperty(e.win,'API',{get(){throw Error('SecurityError');}});
  Object.defineProperty(e.win,'parent',{get(){throw Error('SecurityError');}});
  e.win.opener={API:e.api};e.run();assert.deepEqual(e.calls,[['LMSInitialize','']]);
});
for(const result of ['false','',undefined,0,'TRUE'])test(`failed initialization (${String(result)}) never finishes`,()=>{
  const e=environment({result:result===undefined?null:result});e.win.API=e.api;e.run();e.emit('pagehide');e.emit('unload');
  assert.deepEqual(e.calls,[['LMSInitialize','']]);assert.equal(e.win.__ermittlungszentraleScorm12.phase,'failed');
});
test('missing API, inaccessible opener and cyclic frame graph are bounded',()=>{
  const e=environment();Object.defineProperty(e.win,'opener',{get(){throw Error('blocked');}});e.run();e.emit('pagehide');assert.deepEqual(e.calls,[]);
});
test('frame search stops at 100 contexts',()=>{
  const e=environment();let p=e.win;for(let i=0;i<110;i++){p.parent={};p=p.parent;}p.API=e.api;e.run();assert.equal(e.calls.length,0);
});
test('throwing initialize does not block app or call finish',()=>{
  const e=environment({throws:true});e.win.API=e.api;e.run();e.emit('pagehide');assert.equal(e.calls.length,1);
});
test('throwing finish is attempted only once',()=>{
  const e=environment({finishThrows:true});e.win.API=e.api;e.run();e.emit('pagehide');e.emit('unload');assert.equal(e.calls.length,2);
});
test('Safari bfcache restore starts a new technical session only after persisted pagehide',()=>{
  const e=environment();e.win.API=e.api;e.run();e.emit('pageshow',{persisted:true});assert.equal(e.calls.length,1);
  e.emit('pagehide',{persisted:true});e.emit('pageshow',{persisted:true});e.emit('pagehide');e.emit('unload');
  assert.deepEqual(e.calls.map(c=>c[0]),['LMSInitialize','LMSFinish','LMSInitialize','LMSFinish']);
});
test('backgrounding has no finish handler and no progress reporting',()=>{
 const e=environment();e.win.API=e.api;e.run();e.emit('visibilitychange');assert.equal(e.calls.length,1);
 assert.doesNotMatch(code,/LMS(?:GetValue|SetValue|Commit|GetLastError)|cmi\./);
});
