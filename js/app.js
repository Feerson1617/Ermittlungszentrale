import {
  cases,
  photos,
  clues,
  futureQuestions,
  caseTasks,
} from "../data/cases.js";
import { maps } from "../data/maps.js";
import { createTask, openHint, submitTask, attemptResolution, confirmResolution, correctionKeys } from "./scoring.js";
import { freshState, loadState, saveState } from "./session.js";
import { languages, lookup } from "./dictionary.js";
import { geographyFlow, coreLearning, extraSpurs, evidenceSources } from "../data/learning.js";
const main = document.querySelector("#main");
const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const icons = {
  search: '<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
  pictures:
    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m3 17 5-5 4 4 4-6 5 7"/><circle cx="8" cy="9" r="1"/>',
  map: '<path d="m2 6 7-3 6 3 7-3v15l-7 3-6-3-7 3Z M9 3v15 M15 6v15"/>',
  report: '<path d="M6 3h12v19H6z M9 8h6 M9 12h6 M9 16h4"/>',
  compass: '<circle cx="12" cy="12" r="10"/><path d="m16 8-2 6-6 2 2-6Z"/>',
};
const icon = (name) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.pictures}</svg>`;
let storage;
try {
  storage = window.sessionStorage;
} catch {
  /* Browser storage is optional. */
}
let state = loadState(storage);
let rubrics, entries, media;
const persist = () => saveState(state, storage);
const cstate = () => state.cases[state.current];
function activeTaskId() {
  if (state.current === 1) return "title";
  if (state.current === 2 && cstate().phase === 3) return "selection";
  if (state.current === 3) return geographyFlow[cstate().phase]?.task || null;
  if (state.current === 4 && cstate().phase === 2) return "headline";
  if (state.current === 5 && cstate().phase === 1) return "future";
  return null;
}
function conceptHelp() {
 return `<details class="concept-help"><summary>Begriffe erklären · kostenlos</summary><dl><dt>Redaktion</dt><dd>Menschen, die Beiträge auswählen und bearbeiten.</dd><dt>Ausschnitt</dt><dd>Ein Teil eines Ganzen.</dd><dt>Hinweis</dt><dd>Eine Hilfe beim Rätsel. Nur Lösungshinweise senken das Punktelimit.</dd><dt>zuordnen</dt><dd>Passende Dinge zusammenbringen.</dd><dt>ernten</dt><dd>Reife Früchte oder andere Pflanzenteile einsammeln.</dd><dt>aufbereiten</dt><dd>Material für den nächsten Arbeitsschritt vorbereiten.</dd><dt>Bohnen</dt><dd>Hier: die Samen in einer Kakaofrucht. Aus ihnen können Kakaoprodukte entstehen.</dd><dt>Versorgung</dt><dd>Menschen bekommen, was sie brauchen, zum Beispiel Wasser oder medizinische Behandlung.</dd></dl></details>`;
}
function currentLearning() {
 return state.current === 3 ? coreLearning[geographyFlow[cstate().phase]?.learning] : null;
}
function captureDraft() {
 const id = activeTaskId(), t = id && state.tasks[id];
 if (!t || t.scored || t.locked) return;
 for (const input of main.querySelectorAll('#answer-form input[name], #answer-form select[name]')) {
  if (input.type === "radio" && !input.checked) continue;
  if (input.id === "name-choice" && !input.value) continue;
  if (input.name.startsWith("match-")) (t.answers.matches ||= {})[input.name.slice(6)] = input.value;
  else t.answers[input.name] = input.value;
 }
}
function imageItem(key) {
 return photos.find(p => p.key === key) || {key, title:media.images[key]?.description, motif:key === "housing" ? "Viele Dächer aus der Luft" : media.images[key]?.description};
}
function photo(item, {anonymous = false, compact = false, zoom = true, year = false} = {}) {
 const asset = media.images[item.key];
 const alt = anonymous ? `Beweisfoto: ${item.motif}` : `${item.title || item.name || item.motif}. ${asset?.location || item.location || ""}`;
 const label = anonymous ? `Beweisfoto${item.anonymousId ? " " + item.anonymousId : ""}` : `${item.id ? `${String(item.id).padStart(2,"0")} · ` : ""}${item.title || item.name || item.motif}`;
 if (!asset) return `<figure class="photo"><div class="photo-missing" role="img" aria-label="Foto fehlt">Foto noch nicht verfügbar</div><figcaption>${escape(label)}</figcaption></figure>`;
 return `<figure class="photo"><img src="${escape(asset.path)}" alt="${escape(alt)}" width="${asset.width}" height="${asset.height}" decoding="async" loading="${compact ? "lazy" : "eager"}"><figcaption>${escape(label)}${year ? `<span class="photo-year">Aufnahme: ${escape(asset.taken.slice(0,4))}</span>` : ""}<span class="photo-credit">Foto: ${escape(asset.author)} · ${escape(asset.license)} · verkleinert${anonymous ? "" : ` · Nachweis ${escape(asset.creditId)}`}</span>${zoom ? `<button type="button" class="photo-zoom outline" data-action="zoom" data-media="${escape(asset.creditId)}" data-anonymous="${anonymous}" aria-label="${escape(label)} vergrößern">Bild vergrößern</button>` : ""}</figcaption></figure>`;
}
function map(key, label) {
  return `<div class="map" role="img" aria-label="${escape(label)}">${maps[key]}</div>`;
}
function photoGrid(selected, limit, action = "select") {
 return `<div class="choice-grid">${photos.map(p => `<div class="photo-option"><button type="button" class="photo-choice" data-action="${action}" data-photo="${p.id}" aria-label="Bild ${p.id}: ${escape(p.title)}" aria-pressed="${selected.includes(p.id)}" ${selected.length >= limit && !selected.includes(p.id) ? "disabled" : ""}>${photo(p,{compact:true,zoom:false})}</button><button type="button" class="photo-zoom outline" data-action="zoom" data-media="${escape(media.images[p.key].creditId)}" aria-label="Bild ${p.id} vergrößern">Bild ${p.id} vergrößern</button></div>`).join("")}</div><p class="selection-count" aria-live="polite">${selected.length} von ${limit} Bildern gewählt</p>`;
}
function smallPhotos(ids) {
  return `<div class="compact-photos">${ids
    .map((id) =>
      photo(
        photos.find((p) => p.id === id),
        { compact: true },
      ),
    )
    .join("")}</div>`;
}
function home() {
  return `<section class="hero"><div><div class="intro-label"><span class="status-dot"></span>Die Zentrale ist bereit.</div><h1>Willkommen,<br>Ermittlungsteam.</h1><p>Beginnt am besten mit Akte 001. Folgt den Spuren.<br>Haltet eure Ergebnisse auf Papier fest.</p></div><img class="hero-art" src="assets/icons/detective.svg" alt="Eine geheime Akte und eine Lupe"></section>
  <div class="section-caption"><h2>EURE ERMITTLUNGSAKTEN</h2><span>Jede Akte kann einzeln gestartet werden.</span></div>
  <section class="case-grid" aria-label="Akten auswählen">${cases.map((c) => `<button type="button" class="case-card ${c.bonus ? "bonus" : ""} ${state.cases[c.id].done ? "done" : ""}" data-action="open" data-case="${c.id}"><span class="case-icon">${icon(c.icon)}</span><span><span class="number">AKTE ${String(c.id).padStart(3, "0")} ${c.bonus ? "· BONUS-ERMITTLUNG – FREIWILLIG" : ""}</span><strong>${escape(c.name)}</strong><span class="sub">${escape(c.subtitle)} · ${c.time}${state.cases[c.id].done ? " · abgeschlossen" : casePending(c.id) ? " · Auflösung oder Papiernotiz offen" : ""}</span></span><span class="arrow" aria-hidden="true">→</span></button>`).join("")}</section>
  ${media.status !== "complete" ? `<p class="notice">Bildabnahme offen: Die Beweisfotos fehlen noch. Die Motive sind beschrieben.</p>` : ""}`;
}
function casePending(id) { return caseTasks[id].some(key => state.tasks[key].scored && (!state.tasks[key].resolved || !state.tasks[key].ack)); }
function stageCount() { return {1:1,2:5,3:9,4:4,5:3}[state.current]; }
function heading() {
  const c = cases.find((c) => c.id === state.current),
    s = cstate();
  return `<nav class="case-nav" aria-label="Akte steuern"><button type="button" class="outline" data-action="home" >← Zur Zentrale</button><button type="button" class="text-button" data-action="restart">Akte neu starten</button></nav><header class="case-heading"><div><p class="eyebrow">AKTE ${String(c.id).padStart(3, "0")}${c.bonus ? " · BONUS-ERMITTLUNG – FREIWILLIG" : ""}</p><h1>${escape(c.name)}</h1></div><div class="step"><span>Schritt ${Math.min(s.phase + 1, stageCount())} / ${stageCount()}</span><progress value="${Math.min(s.phase + 1, stageCount())}" max="${stageCount()}" aria-label="Fortschritt der Akte"></progress></div></header>`;
}
function hintPanel(id) {
  const t = state.tasks[id],
    r = rubrics.tasks[id];
  return `<aside class="hint-panel" aria-label="Hinweise und Punkte"><p class="eyebrow">NOCH ERREICHBAR</p><div class="point-cap">${rubrics.limits[t.hint]} <small>${state.current === 5 ? "Bonuspunkte" : "Punkte"}</small></div><p>${t.hint} von 3 Hinweisen geöffnet</p>${
    t.hint
      ? `<ol class="hint-list">${r.hints
          .slice(0, t.hint)
          .map((h) => `<li>${escape(h)}</li>`)
          .join("")}</ol>`
      : ""
  }<button type="button" data-action="hint" ${t.hint === 3 ? "disabled" : ""}>${t.hint < 3 ? `Hinweis ${t.hint + 1} öffnen` : "Alle Hinweise sind offen"}</button><p class="rule-text">${t.hint === 3 ? "Ihr habt jetzt beliebig viele Versuche." : "Ein Versuch pro Hinweisstufe. Der nächste Hinweis senkt die Punkte."}</p></aside>`;
}
function feedback(t) {
  if (!t.feedback || t.feedback === "correct") return "";
  const messages = {
    empty: "Füllt zuerst alle Antwortfelder aus.",
    unclear:
      "Den Namen können wir nicht sicher erkennen. Wählt ihn in der neutralen Namensliste aus. Erst die Abgabe zählt als euer Versuch.",
    wrong:
      t.hint < 3
        ? "Das ist noch nicht die Lösung. Öffnet den nächsten Hinweis."
        : "Das ist noch nicht die Lösung. Versucht es noch einmal.",
  };
  return `<div class="feedback ${t.feedback === "unclear" ? "neutral" : ""}" role="status" tabindex="-1">${messages[t.feedback] || ""}</div>`;
}
function radios(name, options, current) {
  return `<div class="radio-stack">${options.map(([value, text]) => `<label class="radio-option"><input type="radio" name="${name}" value="${value}" ${current === value ? "checked" : ""}><span>${escape(text)}</span></label>`).join("")}</div>`;
}
function fallback(id) {
 const r = rubrics.tasks[id], t = state.tasks[id];
 let visuals = "";
 if (id === "title") visuals = `<div class="fallback-maps"><div><h3>Kontinent A</h3>${map("a","Weltkarte. Kontinent A ist markiert.")}</div><div><h3>Kontinent B</h3>${map("b","Weltkarte. Kontinent B ist markiert.")}</div></div>`;
 if (["atlas","city","cocoa"].includes(id)) visuals = map(id,"Karte mit Ländernamen und markiertem Ort.");
 return `<p class="intro-label">Jetzt gibt es eine einfachere Abschlussaufgabe · 1 Punkt</p><p>Der bisherige Antwortentwurf bleibt getrennt erhalten.</p><h2>${escape(r.fallback.prompt)}</h2>${visuals}${radios("fallback",r.fallback.options.map(o=>[o.id,o.label]),t.answers.fallback)}`;
}
function nameAnswer(id, label) {
 const t=state.tasks[id], r=rubrics.tasks[id];
 if (t.clarification) return `<div class="feedback neutral"><p>Eure Eingabe: „${escape(t.clarificationInput || t.answers.name)}“</p><label for="name-choice">Welchen Namen meint ihr?</label><select id="name-choice" name="name"><option value="">Bitte auswählen</option>${r.neutralNames.map(name=>`<option ${name===t.answers.name?"selected":""}>${escape(name)}</option>`).join("")}</select><p>Keine Antwort ist als richtig markiert. Die nächste Gesamtabgabe zählt auf derselben Hinweisstufe.</p></div>`;
 return `<label for="name-answer">${escape(label)}</label><input id="name-answer" class="answer-input" name="name" value="${escape(t.answers.name || "")}" maxlength="100" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Ein Wort genügt.">`;
}
function continent() {
 return `<p class="instruction">Alle Fotos zeigen Orte auf demselben Kontinent.<br>Wie heißt er? Ein Wort genügt.</p><div class="photo-grid">${[6,2,4,3].map((id,i)=>photo({...photos.find(p=>p.id===id),anonymousId:i+1},{anonymous:true})).join("")}</div>${nameAnswer("title","Welcher Kontinent ist gesucht?")}`;
}
function selection() {
 const a=state.tasks.selection.answers, step=cstate().questionStep || 0, r=rubrics.tasks.selection;
 const questions=[
  `<p class="instruction">Zeigen die vier Fotos alle Orte oder einige Orte?</p>${radios("scope",[["all","Alle Orte"],["some","Einige Orte"]],a.scope)}`,
  `<p class="instruction">Sieht es überall auf dem Kontinent gleich aus?</p>${radios("diversity",[["different","Nein, Orte unterscheiden sich."],["same","Ja, überall gleich."]],a.diversity)}`,
  `<label for="work-answer">Welches fehlende Bild zeigt eine Fabrik oder Geschäfte?</label>${selectPicture("work",a.work)}`,
  `<label for="education-answer">Welches fehlende Bild zeigt Lernen oder medizinische Versorgung?</label>${selectPicture("education",a.education)}`,
 ];
 const review=step===4;
 return `<p class="eyebrow">EIN ERFUNDENES REDAKTIONSBEISPIEL</p><h2>„So sieht Afrika aus!“</h2>${smallPhotos(r.editorial)}<p>Ihr gebt alle vier Antworten gemeinsam ab. Vorher wird nichts bewertet.</p><p class="question-progress">${review?"Eure Gesamtabgabe":`Teilfrage ${step+1} von 4`}</p>${review ? `<ul><li>Orte: ${a.scope==="some"?"einige":"alle"}</li><li>Überall gleich: ${a.diversity==="different"?"nein":"ja"}</li><li>Arbeit: Bild ${escape(a.work)}</li><li>Lernen/Behandlung: Bild ${escape(a.education)}</li></ul>` : questions[step]}<div class="actions">${step>0?'<button type="button" class="outline" data-action="question-prev">Zurück zur Teilfrage</button>':""}${review?"":'<button type="button" class="primary" data-action="question-next">Antwort behalten und weiter</button>'}</div>${conceptHelp()}`;
}
function selectPicture(name,value) {
 const available=photos.filter(p=>!rubrics.tasks.selection.editorial.includes(p.id));
 return `<div class="compact-photos">${available.map(p=>photo(p,{compact:true})).join("")}</div><select name="${name}" id="${name}-answer"><option value="">Bitte auswählen</option>${available.map(p=>`<option value="${p.id}" ${String(p.id)===String(value)?"selected":""}>Bild ${p.id} · ${escape(p.title)}</option>`).join("")}</select>`;
}
function geography(id) {
 const data={atlas:{key:"atlas",prompt:"Auf diesem Foto liegt Schnee. Findet das Land!",evidence:"Der rote Punkt liegt im Gebirge im Norden/Nordwesten des Kontinents."},city:{key:"lagos",prompt:"Findet das Land dieser Großstadt!",evidence:"Der rote Punkt zeigt eine Stadt an der Küste Westafrikas."},cocoa:{key:"cocoa",prompt:"Aus diesen Früchten wird Kakao hergestellt. Findet das Land!",evidence:"Der rote Punkt zeigt den belegten Aufnahmeort in Westafrika."}}[id];
 return `<h2>${escape(rubrics.tasks[id].label)}</h2><p class="instruction">${data.prompt}</p><div class="geography-layout">${photo(imageItem(data.key),{anonymous:true})}${map(id,"Afrikakarte mit Ländernamen und rotem Punkt am gesuchten Ort.")}</div><button type="button" class="outline" data-action="map" data-map="${id}">Karte groß ansehen</button><p class="map-caption">${data.evidence} Lest die Ländernamen.</p>${nameAnswer(id,"Wie heißt das Land?")}`;
}
function headline() {
 const r=rubrics.tasks.headline;
 return `<p class="instruction">Welche Überschrift passt zu Foto und Ortsbeleg?</p><div class="photo-grid">${photo(photos.find(p=>p.key==="market"))}</div>${radios("headline",r.options.map(o=>[o.id,o.label]),state.tasks.headline.answers.headline)}`;
}
function matching() {
 const a=state.tasks.future.answers;
 return `<h2>Welche Frage passt zum gefragten Schwerpunkt?</h2><p>Mehrere Themen können zusammenhängen. Gebt die vier Zuordnungen gemeinsam ab.</p>${clues.map(c=>`<div class="match-row"><h3>${escape(c.name)}</h3><p>${escape(c.text)}</p><label for="match-${c.key}">Passende Untersuchungsfrage</label><select id="match-${c.key}" name="match-${c.key}"><option value="">Bitte auswählen</option>${futureQuestions.map(q=>`<option value="${q.id}" ${a.matches?.[c.key]===q.id?"selected":""}>${escape(q.text)}</option>`).join("")}</select></div>`).join("")}`;
}
function resolution(id) {
 const t=state.tasks[id], r=rubrics.tasks[id], keys=correctionKeys(r);
 if (t.usedFallback || t.fullCorrect) return "";
 const descriptions = id==="selection" ? r.criteria.map(c=>c.explanation) : keys.map(k=>r.explanations[k]);
 return `<section class="resolution" aria-label="Fachliche Auflösung"><h3>Die übrigen Spuren klären · ohne weitere Punkte</h3>${keys.map((key,i)=>`<div class="criterion ${t.criteria[i]?"criterion-correct":"criterion-open"}"><p><strong>${escape(id==="selection"?r.criteria[i].label:clues.find(c=>c.key===key).name)}: ${t.criteria[i]?"stimmt":t.resolved?"ursprünglich offen – jetzt aufgelöst":"noch zu klären"}</strong></p>${t.criteria[i] || t.resolutionTried || t.resolved ? `<p>${escape(descriptions[i])}</p>` : `<label for="correction-${key}">Welche Aussage passt?</label><select id="correction-${key}" data-correction="${key}"><option value="">Bitte auswählen</option>${correctionOptions(id,key).map(o=>`<option value="${o.id}" ${String(t.resolutionAnswers[key])===String(o.id)?"selected":""}>${escape(o.label)}</option>`).join("")}</select>`}</div>`).join("")}${t.resolved?'<p role="status">Die Auflösung ist abgeschlossen. Eure Punkte bleiben unverändert.</p>':t.resolutionTried?'<p>Die Lösung ist jetzt erklärt. Eure Punkte bleiben unverändert.</p><button type="button" data-action="resolution-confirm">Auflösung verstanden</button>':'<button type="button" data-action="resolution-check">Auflösung prüfen · ohne Punkte</button><p>Ihr prüft einmal. Falls noch etwas nicht passt, erklären wir die Lösung.</p>'}</section>`;
}
function correctionOptions(id,key) {
 if(id==="future")return futureQuestions.map(q=>({id:q.id,label:q.text}));
 if(key==="scope")return [{id:"some",label:"Die Fotos zeigen einige Orte."},{id:"all",label:"Die Fotos zeigen alle Orte."}];
 if(key==="diversity")return [{id:"same",label:"Überall sieht es gleich aus."},{id:"different",label:"Orte unterscheiden sich."}];
 return photos.filter(p=>!rubrics.tasks.selection.editorial.includes(p.id)).map(p=>({id:p.id,label:`Bild ${p.id} · ${p.title}`}));
}
function resultView(id) {
 const t=state.tasks[id], r=rubrics.tasks[id];
 const message=t.usedFallback?"Abschlussaufgabe gelöst: 1 Punkt.":t.fullCorrect?`Alle Teile stimmen.${t.hint?` Mit ${t.hint===1?"einem Hinweis":`${t.hint} Hinweisen`}: ${t.points} Punkte.`:""}`:"Ein Teil stimmt. Eure Punkte bleiben erhalten. Schaut euch die übrigen Spuren an.";
 return `<section class="panel result"><p class="result-stamp">${message}</p><h2>${escape(t.fullCorrect||t.usedFallback?r.success:t.resolved?"Punkte gesichert – Auflösung abgeschlossen":"Punkte gesichert – Auflösung noch wichtig")}</h2>${id==="title"?map("reveal","Weltkarte. Der gesuchte Kontinent Afrika ist hervorgehoben."):""}<div class="points">${t.points} <small>${state.current===5?"Bonuspunkte":t.points===1?"Punkt":"Punkte"}</small></div><p>Diese Wertung bleibt festgeschrieben. Es gibt keine Nachbepunktung.</p>${resolution(id)}<p>${escape(r.paper)}</p><label class="check-label"><input type="checkbox" id="points-recorded" ${t.ack?"checked":""}>Wir haben unsere Punkte notiert.</label><div class="actions"><button type="button" class="primary" data-action="result-next" ${!t.ack||!t.resolved?"disabled":""}>${id==="title"?"Zur Ermittlungszentrale":"Weiter"}</button></div>${!t.resolved?'<p>Zur Zentrale könnt ihr zurückkehren. Die offene Auflösung bleibt gespeichert.</p>':""}</section>`;
}
function taskView(id) {
  const t = state.tasks[id];
  if (t.scored) return resultView(id);
  const task =
    t.hint === 3
      ? fallback(id)
      : id === "title"
        ? continent()
        : id === "selection"
          ? selection()
          : ["atlas", "city", "cocoa"].includes(id)
            ? geography(id)
            : id === "headline"
              ? headline()
              : matching();
  return `<div class="case-layout"><div class="case-content"><form id="answer-form" class="panel" novalidate><fieldset ${t.locked ? "disabled" : ""}><legend class="sr-only">Eure gemeinsame Antwort</legend>${task}${id!=="selection"||t.hint===3||cstate().questionStep===4?'<div class="actions"><button type="submit" class="primary">Antwort abgeben</button></div>':""}</fieldset>${feedback(t)}</form></div>${hintPanel(id)}</div>`;
}
function pictureSelection(id) {
 const c=cstate();
 return `<section class="panel"><p class="intro-label">Eure Auswahl wird nicht bewertet.</p><p class="instruction">${id===2?"Welche vier Bilder kommen euch zuerst in den Sinn, wenn ihr an Afrika denkt?":"Wählt noch einmal vier Bilder. Vergleicht mit eurer ersten Auswahl."}</p><p>${id===2?"Denkt zuerst kurz einzeln nach. Einigt euch dann als Team.":"Eine veränderte Auswahl ist nicht automatisch besser oder richtiger."}</p>${photoGrid(c.selected,4)}<div class="actions"><button type="button" class="primary" data-action="phase-next" ${c.selected.length!==4?"disabled":""}>Auswahl ansehen</button></div></section>`;
}
function paperSelection() {
 return `<section class="panel"><h2>Eure erste gemeinsame Auswahl</h2><p class="number-list">${cstate().selected.map(n=>String(n).padStart(2,"0")).join(" · ")}</p>${smallPhotos(cstate().selected)}<p>Notiert die vier Bildnummern auf Papier. Akte 001 hat eure Auswahl vielleicht schon beeinflusst.</p><label class="check-label"><input type="checkbox" id="paper-recorded" ${cstate().paperAck?"checked":""}>Wir haben die Bildnummern notiert.</label><div class="actions"><button type="button" class="primary" data-action="phase-next" ${!cstate().paperAck?"disabled":""}>Zur Redaktion</button></div></section>`;
}
function compare() {
 return `<section class="panel"><p class="eyebrow">EINE ERFUNDENE REDAKTION</p><h2>„So sieht Afrika aus!“</h2><div class="comparison"><div><h3>Eure Auswahl</h3>${smallPhotos(cstate().confirmedSelection)}</div><div><h3>Die Redaktion</h3>${smallPhotos(rubrics.tasks.selection.editorial)}</div></div><p class="instruction">Was zeigt sie? Was fehlt? Sprecht kurz darüber.</p><p>Sie konzentriert sich auf Naturraum, Landwirtschaft und Wasserversorgung. Wasserzugang ist nicht automatisch Wassermangel.</p><details><summary>Vermutungen besprechen · ohne Punkte</summary><p>Sehen alle Orte gleich aus? Welche Arbeiten und Lernmöglichkeiten vermutet ihr? Ihr könnt auch sagen: Das wissen wir noch nicht.</p></details>${conceptHelp()}<div class="actions"><button type="button" class="primary" data-action="phase-next">Die Auswahl prüfen</button></div></section>`;
}
function reflection() {
 const first=state.cases[2].confirmedSelection;
 return `<section class="panel"><h2>Vergleicht eure Auswahlen.</h2><p>Neue Auswahl: <strong>${cstate().selected.join(" · ")}</strong></p>${first.length===4?`<p>Bestätigte erste Auswahl: ${first.join(" · ")}</p>`:'<p>Eine bestätigte erste Auswahl fehlt in dieser Sitzung. Nutzt euren Papierbogen. Fehlt auch er, beschreibt euren jetzigen Stand; ein früherer Vergleich wird nicht erfunden.</p>'}<p class="instruction">Gleich geblieben … / Neu oder ergänzt … / Dazu passt Beleg …</p><p>Wählt einen passenden Satzanfang. Ein Stichwort oder Bildverweis auf Papier genügt; eure Meinung wird nicht bewertet.</p><p>Auch zwölf Bilder sind keine repräsentative Auswahl aller Lebensbedingungen.</p><label class="check-label"><input type="checkbox" id="paper-recorded" ${cstate().paperAck?"checked":""}>Wir haben etwas auf Papier festgehalten.</label><div class="actions"><button type="button" class="primary" data-action="phase-next" ${!cstate().paperAck?"disabled":""}>Die Überschrift prüfen</button></div></section>`;
}
function sourceLink(key) {
 const source=evidenceSources[key];
 return source?.url?`<p class="source-note">Sachquelle: <a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.title)}</a></p>`:"";
}
function optionalSpurs(keys=[]) {
 return keys.length?`<details class="optional-spurs"><summary>Weitere Spuren · freiwillig und ohne Punkte</summary>${keys.map(key=>{const x=extraSpurs[key];return `<article><h3>${escape(x.title)}</h3>${(x.photos||[]).map(k=>photo(imageItem(k),{compact:true})).join("")}<p>${escape(x.text)}</p>${sourceLink(x.source)}</article>`;}).join("")}</details>`:"";
}
function cocoaSymbols(index) {
 const shapes = [
  '<ellipse cx="24" cy="22" rx="13" ry="19" fill="#cdb468"/><path d="M24 4C12 16 12 28 24 41M24 4C35 16 35 28 24 41"/>',
  '<ellipse cx="16" cy="22" rx="8" ry="14" fill="#a47757" transform="rotate(-25 16 22)"/><path d="M11 11Q21 21 20 33"/><ellipse cx="36" cy="22" rx="8" ry="14" fill="#a47757" transform="rotate(25 36 22)"/><path d="M40 11Q30 21 32 33"/>',
  '<rect x="10" y="4" width="28" height="36" rx="3" fill="#a47757"/><path d="M24 4V40M10 16H38M10 28H38"/>',
  '<path d="M6 17L11 5H37L42 17Z" fill="#cdb468"/><path d="M9 18V40H39V18M6 17H42M17 23H30V40"/>',
 ];
 return `<svg class="chain-symbol" viewBox="0 0 48 44" fill="none" stroke="#493d30" stroke-width="1.6" ${index===1?'role="img" aria-label="Kakaobohnen als Ausgangsmaterial, schematisch"':'aria-hidden="true"'}>${shapes[index]}</svg>`;
}
function learningView() {
 const c=cstate(), lesson=currentLearning(), step=lesson.steps[c.learningStep], answers=c.learningAnswers;
 const fields=step.reflection?`<label for="learning-evidence">Eure Spur oder euer Rückblick</label><select id="learning-evidence" data-learning="evidence"><option value="">Bitte auswählen</option>${photos.map(p=>`<option value="${p.id}" ${answers.evidence===String(p.id)?"selected":""}>Bild ${p.id} · ${escape(p.title)}</option>`).join("")}<option value="A3-B1" ${answers.evidence==="A3-B1"?"selected":""}>A3-B1 · Stadtvergleich Lagos</option><option value="known" ${answers.evidence==="known"?"selected":""}>Das wussten wir schon.</option><option value="question" ${answers.evidence==="question"?"selected":""}>Wir haben eine offene Frage.</option></select><label for="learning-note">Wenige Wörter, wenn ihr möchtet</label><textarea id="learning-note" data-learning="note" maxlength="140">${escape(answers.note||"")}</textarea>`:(step.questions||[]).map(q=>`<label for="learning-${q.key}">${escape(q.label)}</label><select id="learning-${q.key}" data-learning="${q.key}"><option value="">Bitte auswählen</option>${q.options.map(o=>`<option value="${o.id}" ${String(answers[q.key])===o.id?"selected":""}>${escape(o.label)}</option>`).join("")}</select>`).join("");
 return `<section class="panel learning" data-learning-step="${step.id}"><p class="intro-label">Belege prüfen · ohne Punkte</p><h2>${escape(step.title)}</h2><p>${escape(step.text)}</p>${step.schema==="vehicles"?'<div class="evidence-schema" role="img" aria-label="Schema: Fabrik und Fahrzeug"><span aria-hidden="true">▥ → ▰</span><p>Schema zur Fahrzeugproduktion · kein dokumentarisches Foto</p></div>':step.schema==="cocoa"?`<div class="evidence-schema"><p>Vereinfachtes Schema mit vier Schritten · keine zusätzlichen Beweisfotos</p><ol class="cocoa-chain" aria-label="Vier Schritte vom Anbau zum Produkt">${step.chain.map((label,index)=>`<li>${cocoaSymbols(index)}<span>${escape(label)}</span></li>`).join("")}</ol></div>`:""}<div class="learning-photos">${(step.photos||[]).map((key,i)=>photo({...imageItem(key),anonymousId:String.fromCharCode(65+i)},{anonymous:step.anonymousPhotos,year:step.showYears})).join("")}</div>${step.map?map(step.map,"Karte: roter Punkt bei Lagos. Die Karte zeigt nicht die genaue Lage einzelner Stadtteile."):""}${step.cards?`<div class="context-cards">${step.cards.map(card=>`<article><h3>${escape(card.title)}</h3><p>${escape(card.text)}</p></article>`).join("")}</div>`:""}${c.learningChecked?`<div class="feedback neutral" role="status"><h3>Kurze Auflösung · eure Punkte bleiben gleich</h3><p>${escape(step.explanation)}</p></div>${sourceLink(step.source)}${optionalSpurs(lesson.extras)}<p>Wechselt jetzt, wenn möglich, die Bedienung im Team.</p><button type="button" class="primary" data-action="learning-next">Weiter ermitteln</button>`:`<div class="learning-fields">${fields}</div>${c.learningFeedback?`<p role="status">${escape(c.learningFeedback)}</p>`:""}<button type="button" class="primary" data-action="learning-check">Belege auswerten · ohne Punkte</button>`}${conceptHelp()}</section>`;
}
function futureIntro() {
 return `<section class="panel"><p class="instruction">Erfundene Nachrichten zu echten Orten und Fotos.</p><p>Die Fotos illustrieren die Nachrichten; sie beweisen nicht, dass die erfundene Situation dort geschehen ist.</p><div class="clue-grid">${clues.map(c=>`<article class="clue-card">${photo(c)}<h2>${escape(c.name)}</h2><p>${escape(c.text)}</p></article>`).join("")}</div><p>Zuzug und natürliches Bevölkerungswachstum sind verschiedene Ursachen. Die Stadtansicht beweist keinen Wachstumstrend.</p><div class="actions"><button type="button" class="primary" data-action="phase-next">Spuren zuordnen</button></div></section>`;
}
function futureQuestion() {
 return `<section class="panel"><h2>Welche Zukunftsfrage habt ihr?</h2><p>Eine freiwillige Frage, ohne Punkte.</p><div class="question-ideas">${["Warum gibt es …?","Wer kann … nutzen?","Welche Folgen hat …?","Wie könnte man …?"].map(text=>`<button type="button" data-action="sentence" data-sentence="${escape(text)}">${escape(text)}</button>`).join("")}</div><label for="future-question">Eure Frage (freiwillig)</label><textarea id="future-question" maxlength="300">${escape(cstate().question||"")}</textarea><p>Die Frage kann auch nur auf Papier stehen.</p><button type="button" class="primary" data-action="finish">Ermittlung abschließen</button></section>`;
}
function summary() {
  const id = state.current;
  const intro =
    id === 3
      ? `<h2>Ihr habt drei Orte entdeckt!</h2>${map("summary", "Afrikakarte mit Marokko, Nigeria und Ghana sowie Kenia und Südafrika als Vergleichsländern.")}<table class="summary-table"><thead><tr><th>Fall</th><th>Land</th><th>Punkte</th></tr></thead><tbody>${["atlas", "city", "cocoa"].map((key, i) => `<tr><td>${String.fromCharCode(65 + i)}</td><td>${rubrics.tasks[key].solution}</td><td>${state.tasks[key].points} / 5</td></tr>`).join("")}</tbody></table><p>Schreibt die Länder und Punkte auf euren Bogen.</p><p class="instruction">Was hat euch überrascht?</p><p>Ein Wort genügt. Es gibt dafür keine Punkte.</p>`
      : id === 4
        ? `<h2>Ermittlung abgeschlossen!</h2><p>Ihr habt viele unterschiedliche Orte entdeckt.<br>Prüft eure Punkte und euren Ermittlungsbogen.</p><h3>Rechnet eure Punkte zusammen.</h3><p class="quiet">Nutzt euren Papierbogen. Ihr braucht keinen alten digitalen Spielstand.</p><div class="calculator">${[5, 5, 15, 5].map((max, i) => `<label>Akte ${i + 1} / ${max}<input type="number" inputmode="numeric" min="0" max="${max}" step="1" class="score-input" aria-label="Punkte Akte ${i + 1}"></label>`).join("")}</div><p id="calculator-total" class="calculator-total" aria-live="polite">Gesamt: — / 30</p><p>Bonus-Akte 005: extra aufschreiben. Maximal 5 Bonuspunkte.</p>`
        : id === 2
          ? `<h2>Fotos zeigen nur einen Teil der Wirklichkeit. Auch zwölf Bilder sind keine repräsentative Stichprobe.</h2><p>Ergänzt auf Papier: „Vier Fotos zeigen nur …“</p>`
          : id === 5
            ? `<h2>Neue Spuren gefunden!</h2><p>Im Geographieunterricht könnt ihr eure Fragen weiter untersuchen.</p><p class="points">${state.tasks.future.points} / 5 Bonuspunkte</p><p>Die Bonuspunkte zählen getrennt.</p>`
            : `<h2>Unser neues Thema ist AFRIKA!</h2>${map("reveal", "Weltkarte mit hervorgehobenem Afrika.")}`;
  return `<section class="panel case-summary">${intro}<div class="actions"><button type="button" class="primary" data-action="home">Zur Ermittlungszentrale</button></div></section>`;
}
function body() {
 const id=state.current,c=cstate();
 if(c.done)return summary();
 if(id===1)return taskView("title");
 if(id===2)return c.phase===0?pictureSelection(2):c.phase===1?paperSelection():c.phase===2?compare():c.phase===3?taskView("selection"):summary();
 if(id===3){const flow=geographyFlow[c.phase];return flow?.task?taskView(flow.task):flow?.learning?learningView():summary();}
 if(id===4)return c.phase===0?pictureSelection(4):c.phase===1?reflection():c.phase===2?taskView("headline"):summary();
 if(id===5)return c.phase===0?futureIntro():c.phase===1?taskView("future"):futureQuestion();
 return "";
}
function render({ focus = false, scroll = false } = {}) {
  main.innerHTML = state.current === null ? home() : heading() + body();
  if(state.notice)main.insertAdjacentHTML("afterbegin",`<aside class="notice" role="status">${escape(state.notice)} <button type="button" data-action="dismiss-notice">Verstanden</button></aside>`);
  document.querySelector("#photo-sources").hidden = false;
  persist();
  if (scroll) window.scrollTo({ top: 0, behavior: "instant" });
  if (focus) main.focus({ preventScroll: true });
}
function finish() {
  cstate().done = true;
  render({ focus: true, scroll: true });
}
let photoTrigger;
const photoDialog=document.querySelector("#photo-dialog");
photoDialog.addEventListener("close",()=>{if(photoTrigger?.isConnected)photoTrigger.focus();});
document.querySelector("#photo-close").addEventListener("click",()=>photoDialog.close());
main.addEventListener("click",event=>{
 const button=event.target.closest("button[data-action]");if(!button||button.disabled)return;
 captureDraft();const action=button.dataset.action;
 if(action==="open"){state.current=Number(button.dataset.case);render({focus:true,scroll:true});}
 else if(action==="home"){state.current=null;render({focus:true,scroll:true});}
 else if(action==="dismiss-notice"){state.notice=null;render();}
 else if(action==="map"){document.querySelector("#map-content").innerHTML=map(button.dataset.map,"Länderkarte mit markiertem Fundort.");document.querySelector("#map-dialog").showModal();}
 else if(action==="zoom"){
  const asset=Object.values(media.images).find(image=>image.creditId===button.dataset.media);if(!asset)return;photoTrigger=button;
  document.querySelector("#photo-title").textContent=button.dataset.anonymous==="true"?"Beweisfoto":asset.description;
  document.querySelector("#photo-content").innerHTML=`<img src="${escape(asset.path)}" width="${asset.width}" height="${asset.height}" alt="${escape(button.dataset.anonymous==="true"?"Vergrößertes Beweisfoto":asset.description)}"><p>Foto: ${escape(asset.author)} · ${escape(asset.license)} · verkleinert</p>`;photoDialog.showModal();
 }
 else if(action==="restart")document.querySelector("#restart-dialog").showModal();
 else if(action==="hint"){const id=activeTaskId();if(id){openHint(state.tasks[id]);render();main.querySelector(".hint-panel")?.scrollIntoView({block:"nearest"});}}
 else if(action==="select"){
  const selected=cstate().selected,id=Number(button.dataset.photo),index=selected.indexOf(id);
  if(index>=0)selected.splice(index,1);else if(selected.length<4)selected.push(id);
  const y=scrollY;render();scrollTo(0,y);main.querySelector(`[data-action="select"][data-photo="${id}"]`)?.focus({preventScroll:true});
 }
 else if(action==="question-next"||action==="question-prev"){
  const c=cstate(),t=state.tasks.selection,keys=["scope","diversity","work","education"];
  if(action==="question-next"&&!t.answers[keys[c.questionStep]]){t.feedback="empty";render();return;}
  c.questionStep+=action==="question-next"?1:-1;t.feedback="";render({scroll:true});
 }
 else if(action==="phase-next"){
  const c=cstate();if([2,4].includes(state.current)&&c.phase===0&&c.selected.length!==4)return;
  if([2,4].includes(state.current)&&c.phase===1&&!c.paperAck)return;
  if([2,4].includes(state.current)&&c.phase===1)c.confirmedSelection=structuredClone(c.selected);
  c.phase++;c.paperAck=false;render({focus:true,scroll:true});
 }
 else if(action==="resolution-check"||action==="resolution-confirm"){
  const id=activeTaskId(),t=id&&state.tasks[id];if(!t)return;
  if(action==="resolution-confirm")confirmResolution(t);else{
   const answers=Object.fromEntries([...main.querySelectorAll("[data-correction]")].map(input=>[input.dataset.correction,input.value]));
   if(attemptResolution(t,rubrics.tasks[id],answers)==="empty"){main.querySelector(".resolution")?.insertAdjacentHTML("beforeend",'<p role="status">Wählt bitte eine Aussage je offener Spur.</p>');return;}
  }render({focus:true,scroll:true});
 }
 else if(action==="result-next"){
  const id=activeTaskId(),t=id&&state.tasks[id];if(!t?.scored||!t.resolved||!t.ack)return;
  if(state.current===1){cstate().done=true;state.current=null;}
  else{cstate().phase++;if([2,4].includes(state.current))cstate().done=true;}
  render({focus:true,scroll:true});
 }
 else if(action==="learning-check"){
  const c=cstate(),step=currentLearning()?.steps[c.learningStep];if(!step||c.learningChecked)return;
  for(const input of main.querySelectorAll("[data-learning]"))c.learningAnswers[input.dataset.learning]=input.value;
  const required=step.reflection?["evidence"]:step.questions.map(q=>q.key);
  if(required.some(key=>!c.learningAnswers[key])){c.learningFeedback="Wählt bitte eine Antwort. Es werden keine Punkte verändert.";render();return;}
  c.learningChecked=true;c.learningFeedback="";render({focus:true,scroll:true});
 }
 else if(action==="learning-next"){
  const c=cstate(),lesson=currentLearning();if(!lesson||!c.learningChecked)return;
  if(c.learningStep+1<lesson.steps.length)c.learningStep++;else{c.phase++;c.learningStep=0;if(c.phase===geographyFlow.length)c.done=true;}
  c.learningChecked=false;c.learningAnswers={};render({focus:true,scroll:true});
 }
 else if(action==="sentence"){const input=document.querySelector("#future-question");input.value=button.dataset.sentence;cstate().question=input.value;persist();input.focus();}
 else if(action==="finish"){if(state.current===5&&cstate().phase===2&&state.tasks.future.resolved&&state.tasks.future.ack)finish();}
});
main.addEventListener("input",event=>{
 const el=event.target;
 if(el.dataset.learning){cstate().learningAnswers[el.dataset.learning]=el.value;persist();return;}
 if(el.dataset.correction){const id=activeTaskId();if(id)state.tasks[id].resolutionAnswers[el.dataset.correction]=el.value;persist();return;}
 if(el.id==="future-question"){cstate().question=el.value;persist();return;}
 if(el.matches(".score-input")){
  const inputs=[...main.querySelectorAll(".score-input")],valid=inputs.every(i=>i.value!==""&&i.checkValidity());
  document.querySelector("#calculator-total").textContent=valid?`Gesamt: ${inputs.reduce((sum,i)=>sum+Number(i.value),0)} / 30`:"Tragt in jedes Feld eine ganze Zahl im erlaubten Bereich ein.";return;
 }
 captureDraft();persist();
});
main.addEventListener("change",event=>{
 const el=event.target;
 if(el.id==="points-recorded"){
  const id=activeTaskId();if(!id)return;const t=state.tasks[id];t.ack=el.checked;persist();main.querySelector('[data-action="result-next"]').disabled=!t.ack||!t.resolved;
 }else if(el.id==="paper-recorded"){cstate().paperAck=el.checked;persist();main.querySelector('[data-action="phase-next"]').disabled=!el.checked;}
 else{captureDraft();if(el.dataset.learning)cstate().learningAnswers[el.dataset.learning]=el.value;persist();}
});
main.addEventListener("submit",event=>{
 if(event.target.id!=="answer-form")return;event.preventDefault();captureDraft();
 const id=activeTaskId();if(!id)return;const task=state.tasks[id];
 if(id==="selection"&&task.hint<3&&cstate().questionStep!==4)return;
 const original=task.answers.name;submitTask(task,rubrics.tasks[id],task.answers,rubrics.limits);
 if(task.clarification)task.clarificationInput=original;
 if(id==="title"&&task.scored)state.revealed=true;
 render({focus:task.scored,scroll:task.scored});if(!task.scored)main.querySelector(".feedback")?.focus();
});

const dictionaryDialog = document.querySelector("#dictionary");
document.querySelector("#dictionary-open").addEventListener("click", () => {
  captureDraft();
  dictionaryDialog.showModal();
  document.querySelector("#dictionary-input").focus();
});
document
  .querySelector("#dictionary-close")
  .addEventListener("click", () => dictionaryDialog.close());
function dictionarySearch() {
  const language = document.querySelector("#dictionary-language").value;
  const input = document.querySelector("#dictionary-input").value;
  const r = lookup(entries, input, language),
    out = document.querySelector("#dictionary-result");
  out.dir = languages.find((l) => l[0] === language)?.[2] || "ltr";
  out.lang = language === "ku" ? "kmr" : language;
  out.textContent =
    r.status === "empty"
      ? "Hier steht die Übersetzung."
      : r.status === "found"
        ? r.translation
        : "Keine Übersetzung vorhanden.";
  document.querySelector("#dictionary-context").textContent = r.entry?.context
    ? `Bedeutung im Spiel: ${r.entry.context}` : "";
  const suggestions = document.querySelector("#dictionary-suggestions");
  suggestions.innerHTML = r.suggestions
    .map(
      (e) =>
        `<button type="button" data-word="${escape(e.de)}">${escape(e.de)}</button>`,
    )
    .join("");
}
document
  .querySelector("#dictionary-input")
  .addEventListener("input", dictionarySearch);
document
  .querySelector("#dictionary-language")
  .addEventListener("change", dictionarySearch);
document
  .querySelector("#dictionary-suggestions")
  .addEventListener("click", (e) => {
    const b = e.target.closest("[data-word]");
    if (b) {
      document.querySelector("#dictionary-input").value = b.dataset.word;
      dictionarySearch();
    }
  });
document
  .querySelector("#map-close")
  .addEventListener("click", () =>
    document.querySelector("#map-dialog").close(),
  );
const restartDialog = document.querySelector("#restart-dialog");
document
  .querySelector("#restart-cancel")
  .addEventListener("click", () => restartDialog.close());
document.querySelector("#restart-confirm").addEventListener("click", () => {
  if (state.current === null) return;
  for (const id of caseTasks[state.current]) state.tasks[id] = createTask();
  state.cases[state.current] = structuredClone(
    freshState().cases[state.current],
  );
  restartDialog.close();
  render({ focus: true, scroll: true });
});
export async function boot({ signal } = {}) {
  [rubrics, entries, media] = await Promise.all(
    ["rubrics.json", "dictionary.json", "media.json"].map(async (file) => {
      const response = await fetch(new URL("../data/" + file, import.meta.url), { signal });
      if (!response.ok) throw new Error(`${file}: HTTP ${response.status}.`);
      if (!response.headers.get("Content-Type")?.includes("application/json"))
        throw new Error(`${file}: Der Server liefert keine JSON-Datei.`);
      try { return await response.json(); }
      catch { throw new Error(`${file}: Die JSON-Datei ist ungültig.`); }
    }),
  );
  if (signal?.aborted) return;
  if (!rubrics?.tasks || !Array.isArray(rubrics.limits) || !Array.isArray(entries) || !media?.images)
    throw new Error("Die lokalen Spieldaten haben ein ungültiges Format.");
  document.querySelector("#dictionary-language").innerHTML = languages
    .map(([code, name]) => `<option value="${code}">${name}</option>`)
    .join("");
  // Load photographs only when their case is opened; all paths are local.
  document.querySelector("#dictionary-open").disabled = false;
  render();
}
