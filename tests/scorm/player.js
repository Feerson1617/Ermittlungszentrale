'use strict';
window.scormCalls=[];
let active=false;
const mode=new URLSearchParams(location.search).get('mode');
window.API={
 LMSInitialize(arg){window.scormCalls.push(['LMSInitialize',arg]);if(active||arg!==''||mode==='failed')return 'false';if(mode==='throws')throw Error('LMS unavailable');active=true;return 'true';},
 LMSFinish(arg){window.scormCalls.push(['LMSFinish',arg]);if(!active||arg!=='')throw Error('Invalid SCORM lifecycle');active=false;return 'true';},
};
for(const name of ['LMSGetValue','LMSSetValue','LMSCommit','LMSGetLastError','LMSGetErrorString','LMSGetDiagnostic']){
 window.API[name]=(...args)=>{window.scormCalls.push([name,...args]);throw Error('Unzulässiger Datenzugriff: '+name);};
}
if(mode==='missing')delete window.API;
if(mode!=='popup'){
 const frame=document.createElement('iframe');frame.title='Ermittlungszentrale';
 if(mode==='blocked')frame.src='http://localhost:4173/kurs/inhalt/4711/index.html';
 else if(mode==='nested')frame.src='/nested.html';
 else frame.src='/kurs/inhalt/4711/index.html';
 document.querySelector('#stage').append(frame);
}
