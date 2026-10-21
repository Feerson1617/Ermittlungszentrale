import {readFile,writeFile,mkdir} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {chromium} from "@playwright/test";
import {cases,photos,clues,caseTasks} from "../data/cases.js";
import {maps} from "../data/maps.js";
import {coreLearning,extraSpurs,evidenceSources} from "../data/learning.js";
const root=fileURLToPath(new URL("..",import.meta.url));
const read=path=>readFile(resolve(root,path),"utf8");
const r=JSON.parse(await read("data/rubrics.json")),media=JSON.parse(await read("data/media.json")),dictionary=JSON.parse(await read("data/dictionary.json"));
const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const line='<div class="write-line"></div>';
const sheetStyle=`*{box-sizing:border-box}body{margin:0;font:12pt/1.3 Arial,sans-serif;color:#111;background:#eee}h1{font-size:20pt;margin:0 0 4mm}h2{font-size:13pt;margin:0 0 2mm}p{margin:2mm 0}section{margin-top:4mm;padding-top:3mm;border-top:1px solid #444}.sheet{position:relative;width:190mm;height:277mm;margin:10mm auto;background:white;overflow:hidden;break-after:page}.sheet:last-child{break-after:auto}.sheet-footer{position:absolute;bottom:0;left:0;right:0;display:flex;justify-content:space-between;font-size:9pt}.name-row{display:flex;justify-content:space-between;font-size:11pt}.map{height:68mm;margin:2mm 0}.map svg{width:100%;height:100%;display:block}.map path{fill:white;stroke:#222;stroke-width:.8}.map rect{fill:white}.numbers{font-size:18pt;letter-spacing:3mm}.write-line{height:8mm;border-bottom:1px solid #666;margin-bottom:1mm}.points{text-align:right;font-weight:bold}.score-table{border-collapse:collapse;width:100%}.score-table th,.score-table td{padding:2mm;border-bottom:1px solid #777;text-align:left}.small{font-size:10.5pt}.totals{display:flex;gap:6mm;flex-wrap:wrap}.print-bar{max-width:190mm;margin:12px auto}@page{size:A4;margin:10mm}@media print{body{background:white}.sheet{margin:0}.print-bar{display:none}}`;
const worksheet=`<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Meine geheime Ermittlungsakte</title><style>${sheetStyle}</style></head><body><aside class="print-bar"><a href="ermittlungsbogen.pdf">PDF herunterladen</a><p>Ein Blatt · zwei Seiten · DIN A4 · 100 % · beidseitig an langer Kante.</p></aside>
<article class="sheet" aria-label="Vorderseite"><h1>Meine geheime Ermittlungsakte</h1><div class="name-row"><span>Name: ____________________</span><span>Team: ____________________</span></div>
<section><h2>Akte 001 · Der verschwundene Titel</h2><p>Gesuchtes Thema: __________________________________</p><p>Nach der Lösung: Markiert den gesuchten Kontinent rot.</p><div class="map" role="img" aria-label="Unbeschriftete Weltkarte ohne Hervorhebung">${maps.world}</div><p class="points">Punkte: ______ / 5</p></section>
<section><h2>Akte 002 · Die Bilder im Kopf</h2><p>Unsere erste gemeinsame Auswahl: vier aus ${photos.length} Bildern</p><p class="numbers">___ ___ ___ ___</p><p>In der Auswahl der Redaktion fehlt … (Bildnummer oder Stichwort)</p>${line}<p class="small">Vier Fotos zeigen einige Orte. Sie stehen nicht für alle Lebensbedingungen.</p><p class="points">Punkte: ______ / 5</p></section><div class="sheet-footer"><span>Wörter und Stichpunkte genügen. Ergebnisse auf Papier sichern.</span><span>1 / 2</span></div></article>
<article class="sheet" aria-label="Rückseite"><section><h2>Akte 003 · Ein Kontinent, viele Gesichter</h2><table class="score-table"><thead><tr><th>Fall</th><th>Land</th><th>Punkte</th></tr></thead><tbody><tr><td>A · Schnee</td><td>_____________________</td><td>____ / 5</td></tr><tr><td>B · Stadt</td><td>_____________________</td><td>____ / 5</td></tr><tr><td>C · Früchte</td><td>_____________________</td><td>____ / 5</td></tr></tbody></table><p>Eine wirtschaftliche Spur: Bild/Beleg ____ · __________________</p><p>Eine Spur zum Zusammenleben: Bild/Beleg ____ · _____________</p></section>
<section><h2>Akte 004 · Der letzte Ermittlungsbericht</h2><p>Unsere zweite Auswahl:</p><p class="numbers">___ ___ ___ ___</p><p>Wählt einen Rückblick: gleich geblieben / neu oder ergänzt / dazu passt Beleg</p>${line}<p>Gewählte Überschrift:</p>${line}<p class="points">Punkte: ______ / 5</p></section>
<section><h2>Akte 005 · freiwillig</h2><p>Unsere Zukunftsfrage (freiwillig):</p>${line}<p class="points">Bonus: ______ / 5</p></section>
<section><h2>Unsere Punkte</h2><div class="totals"><span>Akte 1: ____</span><span>Akte 2: ____</span><span>Akte 3: ____ / 15</span><span>Akte 4: ____</span></div><p><strong>Gesamt: ______ / 30</strong> &nbsp; Bonus-Akte 5: ______ / 5</p><p class="small">Nicht gespielte Akten bleiben leer. Auswahlen, Rückblick und eigene Fragen werden nicht bewertet.</p></section><div class="sheet-footer"><span>Die Bildnummern in Akte 002 und 004 sind identisch.</span><span>2 / 2</span></div></article></body></html>`;
if(/Afrika|Africa|Marokko|Nigeria|Ghana/i.test(worksheet))throw new Error("Lösung im neutralen Schülerbogen");
const mediaTable=`| Nummer | Motiv | Belegter Ort | Einsatz / Nachweis |\n|---|---|---|---|\n${photos.map(p=>{const i=media.images[p.key];return `| ${p.id} | ${p.title} | ${i.location} | Akten 002/004; ${i.creditId}${[9,12].includes(p.id)?'; Bildung/Gesundheit':''}${p.id===11?'; Wasserversorgung, kein automatischer Mangel':''} |`;}).join('\n')}`;
const selectedKeys=new Set(photos.map(p=>p.key));
const additionalTable=`| Beleg-ID | Motiv | Belegter Ort / Datum | Einsatz und Grenze |\n|---|---|---|---|\n${Object.entries(media.images).filter(([key])=>!selectedKeys.has(key)).map(([key,i])=>`| ${i.creditId} | ${i.description} | ${i.location}; ${i.taken} | ${key==='housing'||key==='trade'?'Lagos-Ermittlung; keine Einkommenszuordnung':'Länderfall / Zukunftsspur; kein Häufigkeits- oder Trendbeleg'} |`).join('\n')}`;
const solutions=`| Wertung | Richtige Lösung / Menge | Maximal |\n|---|---|---|\n${Object.entries(r.tasks).map(([key,t])=>`| ${key} · Akte ${t.case} | ${t.solution} | ${t.max}${t.case===5?' Bonus':''} |`).join('\n')}`;
const taskDetails=Object.entries(r.tasks).map(([key,t])=>`## ${t.label}

Aufgaben-ID: ${key}; Akte ${t.case}; höchstens ${t.max} ${t.case===5?'Bonus':'Haupt'}punkte.

**Lösung:** ${t.solution}

${t.criteria?`**Kriterien:** ${t.criteria.map(c=>c.label+': '+c.points).join('; ')}. Vier Teilfragen schrittweise eingeben, anschließend genau eine Gesamtabgabe. Für Arbeit gelten alle passenden Bilder ${t.correctAnswers.work.join('/')}; für Lernen/Behandlung ${t.correctAnswers.education.join('/')}. Die Redaktion verwendet ${t.editorial.join(', ')}; Bilder außerhalb der Redaktion sind nicht allein deshalb sachlich passend.`:''}

**Hinweise in Reihenfolge:**

${t.hints.map((hint,i)=>`${i+1}. ${hint}`).join('\n')}

**Vereinfachte Abschlussaufgabe:** ${t.fallback.prompt} ${t.fallback.options.map(o=>`${o.id.toUpperCase()}: ${o.label}`).join(' / ')}. Richtige ID: ${t.fallback.answer.toUpperCase()}. Erst richtige Abgabe: ein Punkt; kein Punkt allein fürs Hinweisöffnen.

**Papier:** ${t.paper}

${t.aliases?`**Explizite Namensvarianten:** ${t.aliases.join(', ')}. Weitere unbekannte Namen nur neutral klären, keine pauschale Distanzschwelle. Kontinent- und Länderbehauptungen getrennt behandeln.`:''}
`).join('\n');
const lessonDetails=Object.entries(coreLearning).map(([key,lesson])=>`### ${lesson.title}

${lesson.steps.map(step=>`**${step.title}:** ${step.text} ${step.questions?.map(q=>q.label).join(' ')||''}\n\nAuflösung: ${step.explanation}`).join('\n\n')}

Weitere Spuren: ${(lesson.extras||[]).map(key=>extraSpurs[key].title).join('; ')||'keine zusätzliche Pflichtstrecke'}.
`).join('\n');
const coverage=['ru','uk','pl','tr','ar','ku','ckb'].map(lang=>`${lang}: ${dictionary.filter(w=>w[lang]).length}/${dictionary.length}`).join('; ');
const teacher=`# Erwartungshorizont · Die geheime Ermittlungszentrale 2.0

Stand: 21.10.2026. Gemeinsame Datengrundlage: data/cases.js, data/rubrics.json, data/learning.js und data/media.json. Nach Änderungen: npm run materials. Die Aufgaben haben sieben Wertungen, keine zusätzlichen Punkteblöcke.

## Unterrichtsrahmen und Grenzen

Jahrgang 7, Zweierteams, Schul-iPads. Bezug aus dem bereitgestellten geprüften Auftrag: ETS-Curriculum „Afrika – Abhängigkeiten von Naturraum und Bevölkerungsentwicklung und seine wirtschaftlichen Potentiale“. Schwerpunkte: Afrikabild, naturräumliche Abhängigkeiten, Bevölkerungsentwicklung, wirtschaftliche Möglichkeiten, nachhaltige Entwicklungschancen. Das Spiel eröffnet die Einheit und deckt nicht den ganzen Unterrichtsgegenstand ab.

Die Fachanforderungen Schleswig-Holstein 2015 und der Leitfaden 2016 sind im Auftrag benannt. Die schulischen/offiziellen Originaldateien wurden nicht zusätzlich mitgeliefert; der Abruf des offiziellen Fachportals ist vom Cloud-Proxy blockiert. Deshalb keine selbst überprüfte Aussage zur aktuellen Rechtsgeltung, keine erfundenen Kompetenznummern oder Seitenbezüge. Unterrichtsablauf, Zeitplan und „Weitere Spuren“ sind didaktische Vorschläge, keine amtlichen Vorgaben.

Leitlinie: Vorstellungen sichtbar machen → an räumlich verorteten Belegen prüfen/ergänzen → begründet reflektieren. Die erste Bildauswahl folgt bereits auf Akte 001; sie ist kein unbeeinflusster Vortest. Eine Teamantwort ist keine Individualdiagnose. Punkte sind Spielrückmeldung, keine individuelle Schulnote und kein objektiver Lernzuwachsnachweis. Eine geänderte Auswahl ist nicht automatisch besser.

Natur und Umwelt, Wirtschaft und Zusammenleben sind Betrachtungsperspektiven. Erst die offene Frage nach Nutzen, Zugang/Teilhabe und Umweltfolgen bahnt Nachhaltigkeitsbewertung an. Landwirtschaft ist kein Gegenbegriff zu Modernität, Qualifikation oder Wohlstand. Einzelbilder zeigen weder Anteile noch allgemeine Trends.

## Kernweg und Planung – Zeiten ungemessen

| Abschnitt | Planungsziel | Kern / mögliche Kürzung |
|---|---|---|
| Stunde 1 | 5 Minuten Organisation; 10 Akte 001; 20 Akte 002; 10 Sicherung/Puffer | Einzelüberlegung, dann Teamwahl; Bedienung wechseln |
| Stunde 2 | 3 Minuten Wiedereinstieg; 26 Akte 003; 9 Akte 004; 7 gemeinsame Sicherung | Drei Länder; Industrie, Handel, Kakaokette, Stadtvergleich, Bildung/Gesundheit |
| Freiwillig | Akte 005 oder weitere Stunde | Vier erfundene Nachrichten und offene Zukunftsfrage; Weitere Spuren |
| Drei-Stunden-Alternative | 001/002; dann 003; dann 004 und Auswertung | Stundenwechsel jeweils zwischen Akten, keine notwendige Speicherung mitten in einer Akte |

Papierarbeit ist mitgedacht. Keine Garantie, dass alle Teams 90 Minuten schaffen. Zuerst freiwillige Breite kürzen; Rückmeldung und Reflexion erhalten. Film, Digitales, Energie und Logistik bleiben freiwillige Vertiefungen. Nach jedem Länderfall die Bedienung im Team wechseln.

## Papierausgabe und Lösungsschutz – M1

Ein einziges beidseitiges A4-Blatt: beide Seiten sind themenneutral, ohne vorgedruckte Kontinent- oder Ländernamen. Es kann von Beginn an ausgegeben werden; kein zusätzlicher Startbogen erforderlich. Die Weltkarte ist unbeschriftet und ohne hervorgehobenen Kontinent. Erst nach der Lösung den gesuchten Kontinent rot markieren. Stichwörter und Bild-/Belegnummern genügen; keine zwölf Fotos auf Papier.

Alle Akten sind unabhängig startbar. Die Empfehlung lautet „Beginnt mit Akte 001“; es gibt keine Freischaltung. Wer andere Akten oder bewusst Bildquellen öffnet, kann das Thema erfahren. Lizenzangaben werden nicht entfernt; die Quellen sind jederzeit bewusst aufrufbar. Lehrerunterlagen sind nicht in der Schülernavigation, bleiben im öffentlichen Repository aber auffindbar.

## Kompakte Lösungstabelle

${solutions}

## Punkte, Vollständigkeit und Auflösung – T2/D1

Hinweislimit 5/3/2/1. Auf Stufen 0–2 genau eine reguläre Gesamtabgabe je Stufe; freiwillig vorgezogene Hinweise sind möglich. Bei null Rohpunkten frühe Stufe sperren, neuer Versuch erst nach nächstem Hinweis. Auf Stufe 3 unbegrenzt einfache Abschlussaufgabe, erst richtige Lösung ergibt einen Punkt.

Leere/unvollständige Eingaben verbrauchen keinen Versuch. Mehrteilige Aufgaben erst gemeinsam bewerten, keine vorzeitigen Einzelpunkte. Bei positiven Rohpunkten: festgeschriebene Punkte = min(Rohpunkte, Hinweislimit). Danach keine Hinweise und keine Nachbepunktung.

Fachliche Vollständigkeit ist unabhängig vom Limit: fünf richtige Rohpunkte bei einem Hinweis ergeben drei Punkte und vollständigen Erfolg. Drei Rohpunkte am Drei-Punkte-Limit bleiben dagegen teilweise richtig. Vereinfachte Aufgabe: „Abschlussaufgabe gelöst: 1 Punkt“, keine Behauptung, alle ursprünglichen Kriterien seien erfüllt.

Teilpunkte bei positiver Teilwertung: richtige/falsche Kriterien mit Beleg auflösen. Eine kurze unbewertete Korrektur je offenem Kernkriterium, gemeinsam prüfen. Bei weiterer falscher Auswahl Lösung erklären und bestätigen lassen, keine endlose Schleife. Rückkehr zur Zentrale ist möglich; offene Auflösung/Papierbestätigung bleiben sichtbar und gespeichert. Reguläres Fortsetzen erst nach Auflösung und Papierbestätigung. Das gilt auch für die Bonuszuordnung.

Bonus-Rohpunkte: 0 richtige → 0; 1 → 1; 2 → 2; 3 → 3; 4 → 5. Danach Hinweislimit. Optionen bleiben unabhängig, keine automatische Eliminierung. Hauptsumme höchstens 30, Bonus getrennt höchstens 5. Nicht gespielte Akten nicht als gespielte Nullpunkte ausgeben.

## Sprache, Entwürfe und Namensklärung – T1/T3/T4

Akte 002 verwendet geschlossene Antworten statt fehleranfälliger Satzinterpretation; kein Versprechen einer allgemeinen Sprach-KI. Historische Freitextfälle bleiben als Tests dokumentiert, darunter „nur wenige“, „ein paar Orte“, „nur ein paar Orte“ und „Die Fotos zeigen nur einen kleinen Teil“.

Akte 001: „Afrika ist ein Kontinent“ und „Afrika ist kein Land, sondern ein Kontinent“ richtig. „Afrika ist ein Land“ fachlich falsch, frühe Versuchsregel greift. „Afrika Land?“ wird neutral geklärt. Amerika/America/Südafrika/Asien sind keine richtigen Kontinentlösungen. Eindeutige Aliasse wie Affrika, Africka, Afirka und Afrka bleiben zulässig.

Bei nicht erkennbaren Namen bietet eine neutrale Namensliste mehrere Länder/Kontinente ohne Richtig-Markierung. Diese Anzeige nennt keine Lösung; erst die abschließende inhaltliche Entscheidung zählt einmal als reguläre Abgabe auf derselben Stufe. Eindeutig falsche Antworten werden dadurch nicht zu kostenlosen Korrekturversuchen. Negationen und fachlich falsche Behauptungen bleiben relevant.

Hinweise 1/2 behalten Texte, Bilder und Zuordnungen. Fokussierte Eingaben werden vor dem Rendern gesichert. Nach Hinweis 3 liegen regulärer Entwurf und vereinfachte Antwort getrennt vor. Wörterbuch, Bildzoom und Begriffshilfen kosten keine Punkte.

## Sieben Aufgaben im Einzelnen

${taskDetails}

## Verbindlicher unbewerteter Kern in Akte 003

${lessonDetails}

## Freiwillige weitere Spuren

${Object.values(extraSpurs).map(x=>`### ${x.title}\n\n${x.text}`).join('\n\n')}

## Bildnummern 1–12 – M2

Beide Auswahlakten verwenden exakt dieselben Nummern, Motive, Beschriftungen und Dateien. Erste und zweite bestätigte Auswahl bleiben getrennt. Auch zwölf Bilder sind keine repräsentative Stichprobe des Kontinents. Die Redaktion [${r.tasks.selection.editorial.join(', ')}] ist ein erfundenes Modell mit begrenztem Themenfokus; kein empirischer Beleg eines allgemeinen deutschen Medienbildes und kein Beleg allgemeiner Armut.

${mediaTable}

## Zusätzliche Belegbilder – nicht Teil des Zwölferkatalogs

${additionalTable}

Lagos-Vergleich: Lagos Island 2016, Makoko 2019; weitere Alltagsperspektive Balogun-Markt 2007. Unterschiedliche Perspektiven und Jahre ausdrücklich beachten, kein Wachstumstrend und keine Einkommen aus Gebäuden/Personen ableiten. Wirtschaftliches Wachstum kann ungleich zugutekommen; die Fotos selbst belegen keinen Wachstumstrend. Die Makoko-Aufnahme zeigt dichte Bebauung aus der Luft, keinen daraus sicher feststellbaren Versorgungsgrad. Der ursprüngliche Commons-Titel bleibt nur im vollständigen Quellennachweis unverändert erhalten.

Butaro: historische Krankenhaus-Außenaufnahme 2011, keine Behauptung aktueller Qualität oder universellen Zugangs. Wasserbild: Wassertank in Kajiado County, kein Beleg für Wassermangel. Landwirtschaft bleibt eine wirtschaftliche Tätigkeit; Industriebetriebe sind kein automatischer Wohlstands-/Arbeitsqualitätsbeleg.

## Sachquellen und ihre tatsächliche Prüfung

${Object.values(evidenceSources).map(x=>`**${x.title}:** ${x.url||x.local} (Abschnitt ${x.section}). ${x.status}`).join('\n\n')}

Renault-/SIGA-/UNESCO-Aussagen sind im geprüften Projektauftrag benannte Beispiele; die direkten Originalabrufe sind technisch blockiert und nicht als selbst erfolgreich geprüft ausgegeben. Schemata sind ausdrücklich Schemata, keine erzeugten dokumentarischen Fotos. Allgemeine qualitative Kontextkarten ersetzen keine lokalen Einkommen-/Versorgungsstatistiken. Keine Rankings oder erfundenen Zahlen.

Die ${Object.keys(media.images).length} echten Fotografien besitzen Commons-Quellenrevisionen, Ortsbelege, Urheber, freie Lizenzen und Prüfsummen in data/media.json und docs/media/. Die Originaldownloads der vier Ergänzungen wurden per SHA1 verifiziert; alle lokalen Ableitungen per SHA256. Bilder behalten ihre Einzellizenzen. Quellen: bildnachweise.html und docs/bildquellen.md. Das kleinere Original des Balogun-Fotos wurde nicht hochskaliert.

Karten: Natural Earth 1:110 Millionen, Public Domain; vereinfachte Länderumrisse, keine Navigation. Westsahara als eigener Raum, keine politische Anerkennungsaussage. Beim Stadtvergleich ist der Punkt eine grobe Lage von Lagos, keine punktgenaue Verortung beider Stadtteile.

## Wörterbuch und sprachliche Abnahme

${dictionary.length} deutsche Einträge; ${coverage}. Sieben Sprachen: Russisch, Ukrainisch, Polnisch, Türkisch, Arabisch, Kurmandschi, Sorani. Kurmandschi lateinisch (kmr), Sorani arabisch (ckb/RTL), Arabisch RTL. Einzelwortformen sind keine Satzübersetzungen. Vorhanden, quellengestützt/redaktionell geprüft und menschlich sprachkundig geprüft bleiben getrennte Statusangaben. Keine menschliche Abnahme wurde erfunden. Fehlende Werte bleiben sichtbar statt erfunden; vollständige Belege und offene Wörter in docs/woerterbuch-pruefung.md.

## Technik, Datenschutz und verbleibende Abnahme

Kein Konto, keine Datenbank, keine Zeitwertung und kein Audio. Alle Akten funktionieren im Arbeitsspeicher ohne erlaubten Browser-Speicher. Optionale sessionStorage-Wiederherstellung kann Neuladen abfedern; bei gesperrtem Speicher verliert Neuladen die Sitzung. Schema 1 wird mit verständlicher Meldung verworfen, damit alte Wertungen nicht unbemerkt auf neue Aufgaben übertragen werden. Papier bleibt die Sicherung zwischen Geräten und Stunden.

Kein garantierter vollständiger Offline-Neustart: noch nicht geladene Ressourcen benötigen den eigenen statischen Server. Die App überträgt keine Schülerantworten an externe Dienste; der Host kann Zugriffsprotokolle einschließlich IP-Adressen führen. Keine pauschale DSGVO-Freigabe behauptet. Schulische Datenschutzprüfung getrennt beurteilen.

Offen ohne tatsächliche Durchführung: echtes Schul-iPad/Safari, reale Druckprobe, sprachkundige Prüfung, Lerngruppenerprobung/Lernwirkung und gemessene Bearbeitungszeit. Außerdem direkter Originalabgleich der blockierten Sachquellen und Live-Browserabnahme. Automatische Tests und ein erfolgreicher Pages-Build ersetzen diese Prüfungen nicht. Keine pauschale Unterrichtsfreigabe.
`;
function inline(text){return esc(text).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');}
function markdownHTML(text){
 const out=[];let table=false,list=false;
 const close=()=>{if(table){out.push('</tbody></table>');table=false;}if(list){out.push('</ol>');list=false;}};
 for(const line of text.split('\n')){
  if(line.startsWith('|')){
   if(/^\|[-|: ]+\|$/.test(line))continue;
   const cells=line.slice(1,-1).split('|').map(x=>x.trim());
   if(!table){close();out.push('<table><thead><tr>'+cells.map(c=>'<th scope="col">'+inline(c)+'</th>').join('')+'</tr></thead><tbody>');table=true;}
   else out.push('<tr>'+cells.map(c=>'<td>'+inline(c)+'</td>').join('')+'</tr>');
   continue;
  }
  if(/^\d+\. /.test(line)){if(table)close();if(!list){out.push('<ol>');list=true;}out.push('<li>'+inline(line.replace(/^\d+\. /,''))+'</li>');continue;}
  close();const heading=line.match(/^(#{1,3}) (.*)/);
  if(heading)out.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`);
  else if(line.trim())out.push('<p>'+inline(line)+'</p>');
 }
 close();return out.join('\n');
}
const cleanTeacher=teacher.split('\n').map(line=>line.trimEnd()).join('\n');
const teacherHTML=`<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Erwartungshorizont · Ermittlungszentrale 2.0</title><style>@page{size:A4;margin:16mm 15mm 20mm}body{font:10.5pt/1.4 Arial,sans-serif;color:#111;max-width:180mm;margin:20px auto}h1{font-size:21pt;line-height:1.15}h2{font-size:15pt;margin-top:7mm;break-after:avoid}h3{font-size:12pt;break-after:avoid}p{orphans:3;widows:3;overflow-wrap:anywhere}table{border-collapse:collapse;width:100%;font-size:9pt;margin:4mm 0;table-layout:fixed}thead{display:table-header-group}th,td{border:1px solid #aaa;text-align:left;padding:2mm;overflow-wrap:anywhere;vertical-align:top}tr{break-inside:avoid}li{margin:1.5mm 0}@media print{body{max-width:none;margin:0}}</style></head><body>${markdownHTML(cleanTeacher)}</body></html>`;
await mkdir(resolve(root,'materials'),{recursive:true});await mkdir(resolve(root,'docs'),{recursive:true});
await writeFile(resolve(root,'materials/ermittlungsbogen.html'),worksheet);
await writeFile(resolve(root,'docs/erwartungshorizont.md'),cleanTeacher.trimEnd()+"\n");
await writeFile(resolve(root,'materials/erwartungshorizont.html'),teacherHTML);
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const page=await browser.newPage();await page.emulateMedia({media:'print'});
 for(const name of ['ermittlungsbogen','erwartungshorizont']){
  await page.setContent(name==='ermittlungsbogen'?worksheet:teacherHTML);
  if(name==='ermittlungsbogen'){
   const bad=await page.locator('.sheet').evaluateAll(els=>els.map(el=>({height:el.clientHeight,scroll:el.scrollHeight,footer:el.lastElementChild.getBoundingClientRect().top,content:el.children[el.children.length-2].getBoundingClientRect().bottom})).filter(x=>x.scroll>x.height+1||x.content>x.footer));
   if(bad.length)throw new Error('Schülerbogen überschreitet die Seite: '+JSON.stringify(bad));
  }
  await page.pdf({path:resolve(root,`materials/${name}.pdf`),format:'A4',printBackground:true,preferCSSPageSize:true,
   displayHeaderFooter:name==='erwartungshorizont',headerTemplate:'<span></span>',footerTemplate:'<div style="font:9px Arial;width:100%;text-align:center">Erwartungshorizont · <span class="pageNumber"></span> / <span class="totalPages"></span></div>'});
  console.log('Created',name+'.pdf');
 }
}finally{await browser.close();}
