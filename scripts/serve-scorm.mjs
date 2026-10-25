// Tests always serve files freshly extracted from the actual ZIP, never the staging tree.
import {execFileSync} from 'node:child_process';
import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const extracted=resolve(root,'artifacts/scorm/served');
execFileSync('python3',['-c',`import zipfile,shutil; from pathlib import Path; p=Path(${JSON.stringify(extracted)}); shutil.rmtree(p,ignore_errors=True); zipfile.ZipFile('artifacts/scorm/Ermittlungszentrale-SCORM-1.2.zip').extractall(p)`],{cwd:root});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.geojson':'application/geo+json; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.pdf':'application/pdf','.md':'text/plain; charset=utf-8','.txt':'text/plain; charset=utf-8','.xsd':'application/xml','.xml':'application/xml'};
createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://local');let path=decodeURIComponent(url.pathname);
  if(path==='/nested.html'){res.writeHead(200,{'Content-Type':'text/html'}).end('<!doctype html><iframe title="Spiel" src="/kurs/inhalt/4711/index.html" style="width:100%;height:95vh;border:0"></iframe>');return;}
  if(path==='/Ermittlungszentrale'){res.writeHead(308,{Location:'/Ermittlungszentrale/'+url.search}).end();return;}
  const fixtures={'/player.html':'player.html','/player.js':'player.js','/player.css':'player.css'};
  let target;
  if(fixtures[path])target=resolve(root,'tests/scorm',fixtures[path]);
  else{
   for(const prefix of ['/Ermittlungszentrale','/kurs/inhalt/4711'])if(path.startsWith(prefix+'/')){path=path.slice(prefix.length);break;}
   target=resolve(extracted,'.'+path);
   if(!target.startsWith(extracted+sep)&&target!==extracted){res.writeHead(403).end();return;}
   if((await stat(target)).isDirectory())target=resolve(target,'index.html');
  }
  const data=await readFile(target);
  res.writeHead(200,{'Content-Type':mime[extname(target)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':['.webp','.svg','.png'].includes(extname(target))?'public, max-age=3600':'no-store'}).end(data);
 }catch{res.writeHead(404,{'Content-Type':'text/plain'}).end('Datei nicht gefunden');}
}).listen(4173,'0.0.0.0',()=>console.log('SCORM-ZIP-Testserver: 4173'));
