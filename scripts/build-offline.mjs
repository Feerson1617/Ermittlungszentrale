import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const raw=p=>fs.readFileSync(path.join(root,p));
const literal=x=>JSON.stringify(x).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
const paths=['data/cases.js','data/maps.js','data/learning.js','data/word-help.js','js/scoring.js','js/session.js','js/dictionary.js','js/learning-feedback.js','js/app.js'];
const metadata=JSON.parse(read('data/media.json'));
for(const [id,item] of Object.entries(metadata.images)){
 if(!item.path.startsWith('assets/images/')||!item.path.endsWith('.webp'))throw Error('Unknown image '+id);
 item.path='data:image/webp;base64,'+raw(item.path).toString('base64');
}
const icon='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(read('assets/icons/detective.svg')).replace(/'/g,'%27');
const imports=/(^|\n)\s*import\s+(?:[\s\S]*?\s+from\s+)?["'][^"']+["'];?/g;
const exports=/(^|\n)export\s+(?=(?:async\s+)?(?:function|const|let|var|class))/g;
const modules=paths.map(p=>read(p).replace(imports,'\n').replace(exports,'$1'));
let app=modules[modules.length-1];
const start=app.indexOf('async function boot({ signal } = {}) {');
const end=app.indexOf('  if (signal?.aborted) return;',start);
if(start<0||end<0)throw Error('Unbekannte boot-Struktur');
app=app.slice(0,start)+'async function boot({ signal } = {}) {\n  [rubrics, entries, media] = [OFFLINE_RUBRICS, OFFLINE_DICTIONARY, OFFLINE_MEDIA];\n'+app.slice(end);
modules[modules.length-1]=app.replaceAll('assets/icons/detective.svg',icon);
let js='"use strict";\n'+
 'const OFFLINE_RUBRICS='+literal(JSON.parse(read('data/rubrics.json')))+';\n'+
 'const OFFLINE_DICTIONARY='+literal(JSON.parse(read('data/dictionary.json')))+';\n'+
 'const OFFLINE_MEDIA='+literal(metadata)+';\n'+modules.join('\n\n')+'\n';
new Function(js);
const pdf={bogen:raw('materials/ermittlungsbogen.pdf').toString('base64'),lehrer:raw('materials/erwartungshorizont.pdf').toString('base64')};
const dict=read('woerterbuch.html').replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/i,'').replace(/<link rel="stylesheet" href="css\/style\.css"\s*\/?>/i,'<style>'+read('css/style.css')+'</style>');
const helpers=[
 'const OFFLINE_PDFS='+literal(pdf)+';',
 'const OFFLINE_WORD_SOURCE='+literal(dict)+';',
 "function bytes(b64){const s=atob(b64),b=new Uint8Array(s.length);for(let i=0;i<s.length;i++)b[i]=s.charCodeAt(i);return b;}",
 "function safe(s){return String(s??'').replace(/[&<>\\\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\\\"':'&quot;',\\\"'\\\":'&#39;'}[c]));}",
 "function makeCredits(){const a=Object.values(OFFLINE_MEDIA.images).sort((x,y)=>String(x.creditId).localeCompare(String(y.creditId)));",
 "return '<!doctype html><html lang=de><meta charset=utf-8><title>Bildquellen · Offline</title><style>body{max-width:960px;margin:2rem auto;padding:0 1rem;font:16px/1.55 Arial;background:#f4f2ec;color:#183e3f}article{background:white;padding:18px;margin:20px 0;border-radius:12px}article img{max-width:480px;width:100%;height:auto}</style><h1>Bildquellen und Lizenzen</h1><p>Alle Nachweise sind in dieser Datei enthalten. Originalquellen sind nur online erreichbar.</p>'+a.map(m=>'<article id='+safe(m.creditId)+'><h2>'+safe(m.creditId)+' · '+safe(m.description||m.sourceTitle)+'</h2><img src=\\\"'+m.path+'\\\" alt=\\\"'+safe(m.description)+'\\\"><p><b>Ort:</b> '+safe(m.location)+'</p><p><b>Urheber:</b> '+safe(m.author)+'</p><p><b>Lizenz:</b> '+safe(m.license)+'</p><p><b>Quelle:</b> '+safe(m.sourceTitle)+'</p><p><b>Bearbeitung:</b> '+safe(m.modification)+'</p><p><b>Grenze:</b> '+safe(m.deviation||m.locationEvidence)+'</p></article>').join('')+'</html>';}",
 "const makeUrl=(data,type)=>URL.createObjectURL(new Blob([data],{type}));",
 "document.addEventListener('click',e=>{const a=e.target.closest('a[data-offline-pdf],a[data-offline-credits],a[data-offline-dictionary]');if(!a)return;",
 "try{if(a.dataset.offlinePdf){const p=OFFLINE_PDFS[a.dataset.offlinePdf];if(!p){e.preventDefault();return;}a.href=makeUrl(bytes(p),'application/pdf');a.target='_blank';return;}",
 "if(a.hasAttribute('data-offline-credits')){a.href=makeUrl(makeCredits(),'text/html;charset=utf-8');a.target='_blank';return;}",
 "if(a.hasAttribute('data-offline-dictionary')){a.href=makeUrl(OFFLINE_WORD_SOURCE,'text/html;charset=utf-8');a.target='_blank';return;}}",
 "catch(err){e.preventDefault();console.error('Offline-Dokument:',err)}},true);",
 "(async()=>{try{await boot();document.documentElement.dataset.appState='ready'}catch(e){document.documentElement.dataset.appState='failed';console.error(e);document.querySelector('#main').innerHTML='<section class=panel role=alert><h1>Startfehler der Offline-Datei</h1><p>Prüft, ob JavaScript aktiviert ist.</p></section>'}})();",
].join('\n');
js+=(helpers+'\n').replace(/<\/script/gi,'<\\/script');
new Function(js);
let html=read('index.html');
html=html.replace(/<meta\s+http-equiv="Content-Security-Policy"[\s\S]*?\/>/i,'')
 .replace(/\s*<script data-startup>[\s\S]*?<\/script>/i,'')
 .replace(/<link id="app-style" rel="stylesheet" href="css\/style\.css"\s*\/?>/i,'<style id="app-style">'+read('css/style.css')+'</style>')
 .replaceAll('href="assets/icons/detective.svg"','href="'+icon+'"')
 .replaceAll('href="bildnachweise.html"','href="#" data-offline-credits')
 .replaceAll('href="woerterbuch.html"','href="#" data-offline-dictionary')
 .replaceAll('href="materials/ermittlungsbogen.pdf"','href="#" data-offline-pdf="bogen"')
 .replace('Das Spiel ist noch nicht gestartet.','Das Spiel wird offline gestartet …')
 .replace('JavaScript, Gestaltung und lokale Spieldaten müssen geladen werden. Falls diese Meldung bleibt, ist der Start blockiert.','Alle Spieldaten und Fotos sind in dieser Datei.')
 .replace(/<details>\s*<summary>Hilfe für eine lokale Kopie<\/summary>[\s\S]*?<\/details>/i,'<p>Offline-Ausgabe 2.2</p>')
 .replace('<title>Die geheime Ermittlungszentrale</title>','<title>Ermittlungszentrale · OFFLINE 2.2</title>')
 .replace(/<\/body>/i,'<script>'+js+'</script></body>');
const filename='Ermittlungszentrale_OFFLINE_2_2.html';
fs.writeFileSync(path.join(root,filename),html,'utf8');
const size=fs.statSync(path.join(root,filename)).size;
if(size>=10000000)throw Error('Zu groß für 10 MB: '+size);
if(html.includes('data-startup')||html.includes('Content-Security-Policy')||js.includes('import.meta.url'))throw Error('HTML nicht offlinefähig');
console.log('Offline-Export:',filename,size,'Byte',Object.keys(metadata.images).length,'Fotos');
