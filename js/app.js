import {
  cases,
  photos,
  clues,
  futureQuestions,
  caseTasks,
} from "../data/cases.js";
import { maps } from "../data/maps.js";
import { createTask, openHint, submitTask } from "./scoring.js";
import { freshState, loadState, saveState } from "./session.js";
import { languages, lookup } from "./dictionary.js";
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
  if (state.current === 3 && cstate().phase < 3)
    return ["atlas", "city", "cocoa"][cstate().phase];
  if (state.current === 4 && cstate().phase === 2) return "headline";
  if (state.current === 5 && cstate().phase === 1) return "future";
  return null;
}
function recordPending() {
  const id = activeTaskId();
  return id && state.tasks[id].complete && !state.tasks[id].ack;
}
function photo(item, { anonymous = false, compact = false } = {}) {
  const asset = media.images[item.key];
  const alt = anonymous
    ? `Beweisfoto: ${item.motif}`
    : `${item.title || item.name || item.motif}. ${asset?.location || item.location || ""}`;
  const visual = asset
    ? `<img src="${escape(asset.path)}" alt="${escape(alt)}" width="${asset.width}" height="${asset.height}" decoding="async" ${compact ? 'loading="lazy"' : 'loading="eager"'}>`
    : `<div class="photo-missing" role="img" aria-label="Foto fehlt. ${escape(anonymous ? item.motif : alt)}">${icon("pictures")}<span>Foto noch nicht verfügbar</span><small>${escape(item.motif)}</small></div>`;
  const caption = anonymous
    ? `Beweisfoto${item.anonymousId ? " " + item.anonymousId : ""}`
    : `${item.id ? `${String(item.id).padStart(2, "0")} · ` : ""}${escape(item.title || item.name || item.motif)}`;
  const credit = asset
    ? `<span class="photo-credit">Foto: ${escape(asset.author)} · ${escape(asset.license)} · verkleinert${anonymous ? "" : ` · <span>Nachweis ${escape(asset.creditId)}</span>`}</span>`
    : "";
  return `<figure class="photo">${visual}<figcaption>${caption}${credit}</figcaption></figure>`;
}
function map(key, label) {
  return `<div class="map" role="img" aria-label="${escape(label)}">${maps[key]}</div>`;
}
function photoGrid(selected, limit, action = "select") {
  return `<div class="choice-grid">${photos.map((p) => `<button type="button" class="photo-choice" data-action="${action}" data-photo="${p.id}" aria-label="Bild ${p.id}: ${escape(p.title)}" aria-pressed="${selected.includes(p.id)}" ${selected.length >= limit && !selected.includes(p.id) ? "disabled" : ""}>${photo(p, { compact: true })}</button>`).join("")}</div><p class="selection-count" aria-live="polite">${selected.length} von ${limit} Bildern gewählt</p>`;
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
  return `<section class="hero"><div><div class="intro-label"><span class="status-dot"></span>Die Zentrale ist bereit.</div><h1>Willkommen,<br>Ermittlungsteam.</h1><p>Öffnet eine Akte. Folgt den Spuren.<br>Haltet eure Ergebnisse auf Papier fest.</p></div><img class="hero-art" src="assets/icons/detective.svg" alt="Eine geheime Akte und eine Lupe"></section>
  <div class="section-caption"><h2>EURE ERMITTLUNGSAKTEN</h2><span>Jede Akte kann einzeln gestartet werden.</span></div>
  <section class="case-grid" aria-label="Akten auswählen">${cases.map((c) => `<button type="button" class="case-card ${c.bonus ? "bonus" : ""} ${state.cases[c.id].done ? "done" : ""}" data-action="open" data-case="${c.id}"><span class="case-icon">${icon(c.icon)}</span><span><span class="number">AKTE ${String(c.id).padStart(3, "0")} ${c.bonus ? "· BONUS-ERMITTLUNG – FREIWILLIG" : ""}</span><strong>${escape(c.name)}</strong><span class="sub">${escape(c.subtitle)} · ${c.time}${state.cases[c.id].done ? " · abgeschlossen" : ""}</span></span><span class="arrow" aria-hidden="true">→</span></button>`).join("")}</section>
  ${media.status !== "complete" ? `<p class="notice">Bildabnahme offen: Die Beweisfotos fehlen noch. Die Motive sind beschrieben.</p>` : ""}`;
}
function stageCount() {
  return { 1: 1, 2: 4, 3: 4, 4: 4, 5: 3 }[state.current];
}
function heading() {
  const c = cases.find((c) => c.id === state.current),
    s = cstate();
  return `<nav class="case-nav" aria-label="Akte steuern"><button type="button" class="outline" data-action="home" ${recordPending() ? 'disabled title="Notiert zuerst eure Punkte."' : ""}>← Zur Zentrale</button><button type="button" class="text-button" data-action="restart">Akte neu starten</button></nav><header class="case-heading"><div><p class="eyebrow">AKTE ${String(c.id).padStart(3, "0")}${c.bonus ? " · BONUS-ERMITTLUNG – FREIWILLIG" : ""}</p><h1>${escape(c.name)}</h1></div><div class="step"><span>Schritt ${Math.min(s.phase + 1, stageCount())} / ${stageCount()}</span><progress value="${Math.min(s.phase + 1, stageCount())}" max="${stageCount()}" aria-label="Fortschritt der Akte"></progress></div></header>`;
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
      "Wir können eure Antwort nicht sicher verstehen. Schreibt dieselbe Aussage noch einmal klarer. Ändert eure Lösung nicht. Es wurde noch kein Versuch gewertet.",
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
  const r = rubrics.tasks[id],
    t = state.tasks[id];
  let visuals = "";
  if (id === "title")
    visuals = `<div class="fallback-maps"><div><h3>Kontinent A</h3>${map("a", "Weltkarte. Kontinent A ist markiert.")}</div><div><h3>Kontinent B</h3>${map("b", "Weltkarte. Kontinent B ist markiert.")}</div></div>`;
  if (["atlas", "city", "cocoa"].includes(id))
    visuals = map(
      id,
      "Karte mit Ländernamen und einem roten Punkt am gesuchten Ort.",
    );
  return `<p class="intro-label">Einfache Abschlussaufgabe · 1 Punkt</p><h2>${escape(r.fallback.prompt)}</h2>${visuals}${radios(
    "fallback",
    r.fallback.options.map((s, i) => [["a", "b"][i], s]),
    t.answers.fallback,
  )}`;
}
function continent() {
  const a = state.tasks.title.answers;
  return `<p class="instruction">Eine neue Unterrichtsakte ist aufgetaucht.<br>Aber der Titel fehlt!</p><p>Untersucht die Fotos. Alle Orte liegen auf demselben Kontinent.</p><div class="photo-grid">${[6, 2, 4, 3].map((id, i) => photo({ ...photos.find((p) => p.id === id), anonymousId: i + 1 }, { anonymous: true })).join("")}</div><label for="name-answer">Welcher Kontinent ist gesucht?</label><input id="name-answer" class="answer-input" name="name" value="${escape(a.name || "")}" maxlength="100" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Ein Wort genügt.">`;
}
function selection() {
  const t = state.tasks.selection,
    a = t.answers;
  return `<p class="eyebrow">EIN ERFUNDENES REDAKTIONSBEISPIEL</p><h2>„So sieht Afrika aus!“</h2>${smallPhotos(rubrics.tasks.selection.editorial)}<p class="quiet">Die Redaktion zeigt nur diese vier Fotos. Es geht um dieses Beispiel.</p>
 <div class="field"><label for="scope-answer">1. Zeigen die vier Fotos alle Orte Afrikas oder nur einige?</label><input id="scope-answer" class="answer-input" name="scope" value="${escape(a.scope || "")}" maxlength="100" placeholder="Ein Wort oder Stichpunkte genügen."></div>
 <div class="field"><p class="field-label">2. Sieht es überall in Afrika gleich aus?</p>${radios(
   "diversity",
   [
     ["ja", "Ja"],
     ["nein", "Nein"],
   ],
   a.diversity,
 )}</div>
 <div class="field"><p class="field-label">3. Welche zwei Bilder fehlen in der Auswahl der Redaktion?</p><p class="quiet">Wählt zwei aus. Ihr gebt alle drei Antworten zusammen ab.</p>${photoGrid(a.missing || [], 2, "missing")}</div>`;
}
function geography(id) {
  const info = {
    atlas: {
      photo: 6,
      prompt: "Auf diesem Foto liegt Schnee. Findet das Land!",
      evidence:
        "Der rote Punkt liegt im Gebirge. Lest die Ländernamen auf der Karte.",
    },
    city: {
      photo: 4,
      prompt: "Hier leben sehr viele Menschen. Findet das Land!",
      evidence:
        "Der rote Punkt zeigt die Stadt. Vergleicht den Punkt mit den Ländernamen.",
    },
    cocoa: {
      photo: null,
      prompt: "Aus diesen Früchten wird Kakao hergestellt. Findet das Land!",
      evidence:
        "Der rote Punkt zeigt den Aufnahmeort in einem Gebiet mit Kakaoanbau. Lest die Ländernamen.",
    },
  }[id];
  const item = info.photo
    ? photos.find((p) => p.id === info.photo)
    : {
        key: "cocoa",
        title: "Kakaofrüchte",
        motif: "Kakaofrüchte am Baum",
        location: "Ghana",
      };
  return `<h2>${escape(rubrics.tasks[id].label)}</h2><p class="instruction">${info.prompt}</p><div class="geography-layout">${photo(item, { anonymous: true })}${map(id, "Afrikakarte. Marokko, Nigeria, Ghana, Kenia und Südafrika sind beschriftet. Ein roter Punkt hilft bei der Zuordnung.")}</div><button type="button" class="outline" data-action="map" data-map="${id}">Karte groß ansehen</button><p class="map-caption">${info.evidence}<br>Die Länder haben viele verschiedene Orte.</p><label for="name-answer">Wie heißt das Land?</label><input id="name-answer" class="answer-input" name="name" value="${escape(state.tasks[id].answers.name || "")}" maxlength="100" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ein Ländername genügt.">`;
}
function headline() {
  return `<p class="quiet">Eine erfundene Überschrift zu einem Foto:</p><h2>„So leben alle Menschen in Afrika!“</h2><div class="photo-grid">${photo(photos[9])}</div><p class="instruction">Ist das richtig? Wählt eine bessere Überschrift.</p>${radios(
    "headline",
    [
      ["a", "A · So leben alle Menschen in Afrika."],
      ["b", "B · Ein Ort in Afrika."],
      ["c", "C · Überall in Afrika sieht es gleich aus."],
    ],
    state.tasks.headline.answers.headline,
  )}`;
}
function matching() {
  const a = state.tasks.future.answers;
  return `<h2>Welche Frage passt zu welcher Spur?</h2><p>Ordnet alle vier Spuren zu. Dann gebt ihr gemeinsam ab.</p>${clues.map((c, i) => `<div class="match-row"><h3>Spur ${i + 1} · ${c.name}</h3><p>${c.text}</p><label for="match-${i}">Wählt die passende Frage.</label><select id="match-${i}" name="match-${i}"><option value="">Bitte auswählen</option>${futureQuestions.map((q, j) => `<option value="${j}" ${String(a.matches?.[i]) === String(j) ? "selected" : ""}>${String.fromCharCode(65 + j)} · ${q}</option>`).join("")}</select></div>`).join("")}`;
}
function resultView(id) {
  const t = state.tasks[id],
    r = rubrics.tasks[id];
  return `<section class="panel result"><p class="result-stamp">${t.points < rubrics.limits[t.hint] ? "TEILERFOLG · FALL ABGESCHLOSSEN" : "FALL GELÖST!"}</p><h2>${escape(r.success)}</h2>${id === "title" ? map("reveal", "Weltkarte mit hervorgehobenem Afrika.") : ""}<div class="points">${t.points} <small>${state.current === 5 ? "Bonuspunkte" : t.points === 1 ? "Punkt" : "Punkte"}</small></div>${t.raw < 5 && t.hint < 3 ? `<p class="correct-breakdown">${t.raw} von 5 Rohpunkten. Eure richtigen Teile zählen.</p>` : ""}<p>${escape(r.paper)}</p><p><strong>Tragt eure Punkte jetzt auf eurem Ermittlungsbogen ein.</strong></p><label class="check-label"><input type="checkbox" id="points-recorded" ${t.ack ? "checked" : ""}>Wir haben unsere Punkte notiert.</label><div class="actions"><button type="button" class="primary" data-action="result-next" ${!t.ack ? "disabled" : ""}>${id === "title" ? "Zur Ermittlungszentrale" : "Weiter"}</button></div></section>`;
}
function taskView(id) {
  const t = state.tasks[id];
  if (t.complete) return resultView(id);
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
  return `<div class="case-layout"><div class="case-content"><form id="answer-form" class="panel" novalidate><fieldset ${t.locked ? "disabled" : ""}><legend class="sr-only">Eure gemeinsame Antwort</legend>${task}<div class="actions"><button type="submit" class="primary">Antwort abgeben</button></div></fieldset>${feedback(t)}</form></div>${hintPanel(id)}</div>`;
}
function pictureSelection(id) {
  const c = cstate();
  return `<section class="panel"><p class="intro-label">Diese Auswahl gibt keine Punkte.</p><p class="instruction">${id === 2 ? "Welche vier Bilder fallen euch zuerst ein, wenn ihr an Afrika denkt?" : "Welche vier Bilder würdet ihr jetzt wählen?"}</p><p>Tippt vier Bilder an.</p>${photoGrid(c.selected, 4)}<div class="actions"><button type="button" class="primary" data-action="phase-next" ${c.selected.length !== 4 ? "disabled" : ""}>Auswahl ansehen</button></div></section>`;
}
function paperSelection() {
  const c = cstate();
  return `<section class="panel"><h2>Eure Bildnummern</h2><p class="number-list">${c.selected.map((x) => String(x).padStart(2, "0")).join(" · ")}</p>${smallPhotos(c.selected)}<p>Schreibt die vier Bildnummern bei Akte 002 auf euren Ermittlungsbogen.</p><label class="check-label"><input type="checkbox" id="paper-recorded" ${c.paperAck ? "checked" : ""}>Wir haben die Bildnummern notiert.</label><div class="actions"><button type="button" class="primary" data-action="phase-next" ${!c.paperAck ? "disabled" : ""}>Zur Redaktion</button></div></section>`;
}
function compare() {
  return `<section class="panel"><p class="eyebrow">EIN ERFUNDENES REDAKTIONSBEISPIEL</p><h2>„So sieht Afrika aus!“</h2><p>Eine Redaktion wählt nur vier Fotos. Vergleicht die Bilder.</p><div class="comparison"><div><h3>Eure Auswahl</h3>${smallPhotos(cstate().selected)}</div><div><h3>Die Auswahl der Redaktion</h3>${smallPhotos(rubrics.tasks.selection.editorial)}</div></div><p class="instruction">Was ist gleich? Was fehlt?</p><p class="quiet">Sprecht kurz darüber. Ihr müsst keinen langen Text schreiben.</p><div class="actions"><button type="button" class="primary" data-action="phase-next">Die Überschrift prüfen</button></div></section>`;
}
function reflection() {
  return `<section class="panel"><h2>Vergleicht eure Auswahl.</h2><p class="number-list">${cstate()
    .selected.map((x) => String(x).padStart(2, "0"))
    .join(
      " · ",
    )}</p><p>Notiert diese neuen Bildnummern bei Akte 004.<br>Schaut auf eure erste Auswahl auf Papier.</p><p class="instruction">Am Anfang dachte ich …<br>Jetzt weiß ich …</p><p>Schreibt Wörter oder Stichpunkte auf euren Bogen.<br>Eure Auswahl darf gleich bleiben. Dafür gibt es keine Punkte.</p><label class="check-label"><input type="checkbox" id="paper-recorded" ${cstate().paperAck ? "checked" : ""}>Wir haben verglichen und etwas notiert.</label><div class="actions"><button type="button" class="primary" data-action="phase-next" ${!cstate().paperAck ? "disabled" : ""}>Zum letzten Rätsel</button></div></section>`;
}
function futureIntro() {
  return `<section class="panel"><p class="instruction">Vier geheimnisvolle Nachrichten sind eingetroffen.<br>Was steckt dahinter?</p><p>Untersucht die Spuren!</p><div class="clue-grid">${clues.map((c, i) => `<article class="clue-card">${photo(c)}<h2>Spur ${i + 1} · ${c.name}</h2><p>${c.text}</p></article>`).join("")}</div><div class="actions"><button type="button" class="primary" data-action="phase-next">Spuren zuordnen</button></div></section>`;
}
function futureQuestion() {
  return `<section class="panel"><h2>Was möchtet ihr über Afrika noch herausfinden?</h2><p>Überlegt euch eine Frage. Dafür gibt es keine Punkte.</p><div class="question-ideas">${["Warum gibt es …?", "Wie können Menschen …?", "Was passiert, wenn …?", "Wie könnte man …?"].map((q) => `<button type="button" data-action="sentence" data-sentence="${escape(q)}">${q}</button>`).join("")}</div><label for="future-question">Eure Frage (freiwillig)</label><textarea id="future-question" maxlength="300" placeholder="Wörter oder Stichpunkte genügen.">${escape(cstate().question || "")}</textarea><p class="quiet">Ihr könnt die Frage auch nur auf Papier schreiben.</p><div class="actions"><button type="button" class="primary" data-action="finish">Ermittlung abschließen</button></div></section>`;
}
function summary() {
  const id = state.current;
  const intro =
    id === 3
      ? `<h2>Ihr habt drei Orte entdeckt!</h2>${map("summary", "Afrikakarte mit Marokko, Nigeria und Ghana sowie Kenia und Südafrika als Vergleichsländern.")}<table class="summary-table"><thead><tr><th>Fall</th><th>Land</th><th>Punkte</th></tr></thead><tbody>${["atlas", "city", "cocoa"].map((key, i) => `<tr><td>${String.fromCharCode(65 + i)}</td><td>${rubrics.tasks[key].solution}</td><td>${state.tasks[key].points} / 5</td></tr>`).join("")}</tbody></table><p>Schreibt die Länder und Punkte auf euren Bogen.</p><p class="instruction">Was hat euch überrascht?</p><p>Ein Wort genügt. Es gibt dafür keine Punkte.</p>`
      : id === 4
        ? `<h2>Ermittlung abgeschlossen!</h2><p>Ihr habt viele unterschiedliche Orte entdeckt.<br>Prüft eure Punkte und euren Ermittlungsbogen.</p><h3>Rechnet eure Punkte zusammen.</h3><p class="quiet">Nutzt euren Papierbogen. Ihr braucht keinen alten digitalen Spielstand.</p><div class="calculator">${[5, 5, 15, 5].map((max, i) => `<label>Akte ${i + 1} / ${max}<input type="number" inputmode="numeric" min="0" max="${max}" step="1" class="score-input" aria-label="Punkte Akte ${i + 1}"></label>`).join("")}</div><p id="calculator-total" class="calculator-total" aria-live="polite">Gesamt: — / 30</p><p>Bonus-Akte 005: extra aufschreiben. Maximal 5 Bonuspunkte.</p>`
        : id === 2
          ? `<h2>Fotos zeigen nur einen Teil der Wirklichkeit.</h2><p>Ergänzt auf Papier: „Vier Fotos zeigen nur …“</p>`
          : id === 5
            ? `<h2>Neue Spuren gefunden!</h2><p>Im Geographieunterricht könnt ihr eure Fragen weiter untersuchen.</p><p class="points">${state.tasks.future.points} / 5 Bonuspunkte</p><p>Die Bonuspunkte zählen getrennt.</p>`
            : `<h2>Unser neues Thema ist AFRIKA!</h2>${map("reveal", "Weltkarte mit hervorgehobenem Afrika.")}`;
  return `<section class="panel case-summary">${intro}<div class="actions"><button type="button" class="primary" data-action="home">Zur Ermittlungszentrale</button></div></section>`;
}
function body() {
  const id = state.current,
    c = cstate();
  if (c.done) return summary();
  if (id === 1) return taskView("title");
  if (id === 2)
    return c.phase === 0
      ? pictureSelection(2)
      : c.phase === 1
        ? paperSelection()
        : c.phase === 2
          ? compare()
          : c.phase === 3
            ? taskView("selection")
            : summary();
  if (id === 3)
    return c.phase < 3
      ? taskView(["atlas", "city", "cocoa"][c.phase])
      : summary();
  if (id === 4)
    return c.phase === 0
      ? pictureSelection(4)
      : c.phase === 1
        ? reflection()
        : c.phase === 2
          ? taskView("headline")
          : summary();
  if (id === 5)
    return c.phase === 0
      ? futureIntro()
      : c.phase === 1
        ? taskView("future")
        : futureQuestion();
  return "";
}
function render({ focus = false, scroll = false } = {}) {
  main.innerHTML = state.current === null ? home() : heading() + body();
  // Source titles and places must not disclose either anonymous photo mystery.
  const anonymousTask = state.current === 1 ? "title"
    : state.current === 3 ? ["atlas", "city", "cocoa"][cstate().phase] : null;
  const sourcesVisible = state.current !== null &&
    (!anonymousTask || state.tasks[anonymousTask].complete);
  document.querySelector("#photo-sources").hidden = !sourcesVisible;
  persist();
  if (scroll) window.scrollTo({ top: 0, behavior: "instant" });
  if (focus) main.focus({ preventScroll: true });
}
function finish() {
  cstate().done = true;
  render({ focus: true, scroll: true });
}
main.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button || button.disabled) return;
  const action = button.dataset.action;
  if (action === "open") {
    state.current = Number(button.dataset.case);
    render({ focus: true, scroll: true });
  } else if (action === "home") {
    if (recordPending()) return;
    state.current = null;
    render({ focus: true, scroll: true });
  } else if (action === "map") {
    document.querySelector("#map-content").innerHTML = map(
      button.dataset.map,
      "Länderkarte mit markiertem Fundort.",
    );
    document.querySelector("#map-dialog").showModal();
  } else if (action === "restart")
    document.querySelector("#restart-dialog").showModal();
  else if (action === "hint") {
    const id = activeTaskId();
    if (id) {
      openHint(state.tasks[id]);
      render();
      main.querySelector(".hint-panel")?.scrollIntoView({ block: "nearest" });
    }
  } else if (action === "select" || action === "missing") {
    const selected =
      action === "select"
        ? cstate().selected
        : (state.tasks.selection.answers.missing ||= []);
    const id = Number(button.dataset.photo),
      index = selected.indexOf(id),
      limit = action === "select" ? 4 : 2;
    if (index >= 0) selected.splice(index, 1);
    else if (selected.length < limit) selected.push(id);
    const y = window.scrollY;
    render();
    window.scrollTo(0, y);
    main
      .querySelector(`[data-action="${action}"][data-photo="${id}"]`)
      ?.focus({ preventScroll: true });
  } else if (action === "phase-next") {
    cstate().phase++;
    cstate().paperAck = false;
    render({ focus: true, scroll: true });
  } else if (action === "result-next") {
    const id = activeTaskId();
    if (!id || !state.tasks[id].ack) return;
    if (state.current === 1) {
      cstate().done = true;
      state.current = null;
    } else if (state.current === 3) {
      cstate().phase++;
      if (cstate().phase === 3) cstate().done = true;
    } else {
      cstate().phase++;
      if ([2, 4].includes(state.current)) cstate().done = true;
    }
    render({ focus: true, scroll: true });
  } else if (action === "sentence") {
    const input = document.querySelector("#future-question");
    input.value = button.dataset.sentence;
    cstate().question = input.value;
    persist();
    input.focus();
  } else if (action === "finish") finish();
});
main.addEventListener("input", (event) => {
  const el = event.target;
  if (el.id === "future-question") {
    cstate().question = el.value;
    persist();
    return;
  }
  if (el.matches(".score-input")) {
    const inputs = [...main.querySelectorAll(".score-input")];
    const valid = inputs.every((i) => i.value !== "" && i.checkValidity());
    document.querySelector("#calculator-total").textContent = valid
      ? `Gesamt: ${inputs.reduce((n, i) => n + Number(i.value), 0)} / 30`
      : "Tragt in jedes Feld eine ganze Zahl im erlaubten Bereich ein.";
    return;
  }
  const id = activeTaskId();
  if (!id || state.tasks[id].complete || state.tasks[id].locked) return;
  const a = state.tasks[id].answers;
  if (el.name.startsWith("match-")) {
    a.matches ||= ["", "", "", ""];
    a.matches[Number(el.name.slice(-1))] = el.value;
  } else if (el.name) a[el.name] = el.value;
  persist();
});
main.addEventListener("change", (event) => {
  const el = event.target;
  if (el.id === "points-recorded") {
    const id = activeTaskId();
    if (!id) return;
    state.tasks[id].ack = el.checked;
    persist();
    main.querySelector('[data-action="result-next"]').disabled = !el.checked;
    main.querySelector('[data-action="home"]').disabled = !el.checked;
  }
  if (el.id === "paper-recorded") {
    cstate().paperAck = el.checked;
    persist();
    main.querySelector('[data-action="phase-next"]').disabled = !el.checked;
  }
});
main.addEventListener("submit", (event) => {
  if (event.target.id !== "answer-form") return;
  event.preventDefault();
  const id = activeTaskId();
  if (!id) return;
  const task = state.tasks[id];
  submitTask(task, rubrics.tasks[id], task.answers, rubrics.limits);
  if (id === "title" && task.complete) state.revealed = true;
  render();
  if (task.complete) {
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  } else main.querySelector(".feedback")?.focus();
});
const dictionaryDialog = document.querySelector("#dictionary");
document.querySelector("#dictionary-open").addEventListener("click", () => {
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
