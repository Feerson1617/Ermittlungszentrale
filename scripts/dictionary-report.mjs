import { writeFile } from "node:fs/promises";
import { dictionaryIntegrity } from "./dictionary-integrity.mjs";
import { languages } from "../js/dictionary.js";
const root = new URL("../", import.meta.url);
const { dictionary, evidence, problems } = await dictionaryIntegrity(root);
if (problems.length) throw new Error(problems.join("\n"));
const cell = s => String(s || "**offen**").replaceAll("|", "\\|").replaceAll("\n", " ");
const count = lang => dictionary.filter(e => e[lang]).length;
const refs = (de, lang) => [...new Set(evidence.entries.find(e => e.de === de)
  .translations[lang].references.map(r => r.source))].join(", ");
const added = lang => evidence.entries.filter(e => e.translations[lang].previous === null && e.translations[lang].translation).length;
const missing = lang => dictionary.filter(e => !e[lang]).map(e => e.de);
const report = `# Wörterbuch: Quellen, Plausibilitätsprüfung und offene Abnahme

Stand: ${evidence.date}. ${dictionary.length} deutsche Suchbegriffe, sieben getrennte Sprachen. Neu belegt: **${added("ku")} Kurmandschi- und ${added("ckb")} Sorani-Übersetzungen**. Alle ${count("ku") + count("ckb")} vorhandenen kurdischen Einträge haben einzeln zugeordnete Quellenbelege. Die fehlenden Werte bleiben ausdrücklich leer. Version 2.0 ergänzt zehn deutsche Begriffe. Neue nichtleere Werte in allen sieben Sprachen haben Einzelbelege; für die 187 Bestandswerte in fünf Sprachen bleibt es bei der redaktionellen Plausibilitätsprüfung. Die bestätigten Suchformen „notiert“, „beeinflusst“ und „Ermittlungsteam“ verweisen auf ihre Grundbegriffe. „Bildbeleg“ und „Beleg“ verweisen ausdrücklich auf den vorhandenen Begriff „Beweis“; hierfür wird keine neue kurdische Zusammensetzung erfunden.

**Dies ist eine quellengestützte redaktionelle Plausibilitätsprüfung durch Codex. Keine muttersprachliche, professionelle oder schulische Sprachfreigabe wurde durchgeführt.** Auch eine bestandene Prüfsummen-/Schriftprüfung ersetzt keine sprachliche Abnahme.

| Sprache | Vorhanden / ${dictionary.length} | Prüfung in diesem Durchlauf | Muttersprachliche Abnahme |
|---|---:|---|---|
${languages.map(([code,name]) => `| ${name} | ${count(code)} | ${["ku","ckb"].includes(code) ? "Einzelbelege, Bedeutung, Varietät und Schrift redaktionell geprüft" : "Die 187 Bestandswerte und die neuen Werte auf Bedeutung, Wortform und Schrift plausibilisiert; kein vollständiger Wörterbuch-Einzelnachweis behauptet"} | **offen** |`).join("\n")}

## Verbleibende Lücken in allen Sprachen

${languages.map(([code,name]) => `- **${name} (${missing(code).length}):** ${missing(code).join(", ") || "keine leeren Werte"}.`).join("\n")}

## Besonders prüfbedürftige kurdische Lücken

- **Kurmandschi (${missing("ku").length}):** ${missing("ku").join(", ")}.
- **Sorani (${missing("ckb").length}):** ${missing("ckb").join(", ")}.

In den geprüften Quellen fand sich für diese Einträge kein hinreichend passender Beleg in der benötigten Varietät und Spielbedeutung. Insbesondere wurde „nachhaltig“ nicht mit einem bloßen Wort für „dauerhaft“ gefüllt, „zuordnen“ nicht mit dem englischen *match* im Sinne eines Streichholzes und „Stichpunkt“ nicht mit „Passwort“. Für „vergleichen wir“ fehlt eine belegte vollständige Aufforderung; eine Einzelwortübersetzung ersetzt sie nicht. Es wurden keine neuen kurdischen Fachwörter zusammengesetzt, um die Statistik zu vervollständigen. Das Wörterbuch ist daher weiterhin nicht vollständig.

## Was überprüft wurde

- Für alle sieben Sprachen wurden alle ${dictionary.length} Einträge im Spielkontext gelesen und auf erkennbare Bedeutungsverwechslungen, Schriftmischung, leere/duplizierte Stichwörter und auffällige Wortformen geprüft. Beispiele: Land/Staat statt Boden, Karte statt Bankkarte, See/Binnengewässer statt Meer, Strom/Elektrizität statt Fluss, Fall/Ermittlungsfall statt Sturz, Bogen/Papier statt Waffe und anbauen/Pflanzen statt Gebäudeanbau.
- Kurmandschi (kmr; Datenfeld ku) und Sorani (ckb) wurden getrennt gehalten. Sorani steht in arabischer Schrift mit RTL; keine automatisierte Umschrift aus Kurmandschi wurde verwendet. Belegte Varianten wurden nicht pauschal „vereinheitlicht“.
- Die polnische Angabe für **alle** wurde von *wszyscy* zu *wszyscy / wszystkie* erweitert. Die erste Form ist männlich-personal; bei Bildern/Orten und nicht-männlich-personalen Gruppen braucht man die zweite. Der zusätzliche Flexionsbeleg ist mit Wiktionary-Revisions-ID gesichert.
- Russische und ukrainische Einträge sind in der vorgesehenen Bedeutung redaktionell plausibel. Aspekte, Kasus, Geschlecht und Flexion in ganzen Sätzen bleiben muttersprachlich zu prüfen; einzelne Wörter bilden keine Satzübersetzung.
- Polnische Formen hängen von Genus und Personengruppe ab. Die ergänzte Bedeutungshilfe erklärt den Bild-/Ortskontext; weitere Satzflexion wird nicht als abgenommen behauptet.
- Türkische Verben verwenden überwiegend Infinitive; kurze UI-Angaben können Nomen oder Adjektive sein. Eine idiomatische Prüfung für Lernende ist weiterhin nötig.
- Neue Einträge verwenden die exakt belegte Wortform; kyrillische Betonungszeichen bleiben erhalten. „beeinflussen“ ist im Arabischen mit einer belegten Verbform angeführt; dies ist keine konjugierte Satzübersetzung.
- Arabische Verben werden im vorhandenen Bestand häufig durch das übliche Verbalnomen (Maṣdar), etwa *قراءة* oder *كتابة*, wiedergegeben. Das ist keine vollständig konjugierte Handlungsanweisung. Kontextformen, Artikel, Genus und sprachliches Register bleiben offen.
- Bei beiden kurdischen Varianten bleiben Idiomatik, regionale Schreibvarianten und besonders die Eignung fachlicher Begriffe für Klasse 7 muttersprachlich zu bestätigen. Community-Wörterbücher und Lokalisierungen sind Belege für tatsächliche Verwendung, keine professionelle Freigabe.

## Quellen und Nutzungsbedingungen

| Kennung | Quelle / Urheber | Lizenz | Gesicherter Stand |
|---|---|---|---|
${Object.entries(evidence.sources).map(([key,s]) => `| ${key} | [${s.title}](${s.url}); ${s.author} | ${s.licenseFile ? `[${s.license}](${s.licenseFile.replace(/^docs\//, "")})` : `[${s.license}](${s.licenseUrl})`} | ${s.revision ? "Git-Commit " + s.revision : "Seitenrevision je Einzelbeleg"} |`).join("\n")}

Die Einzelauszüge behalten ihre jeweilige Quellenlizenz. Urheber-/Lizenzangaben und Bearbeitung sind Bestandteil der Nachweise. Die Quellendaten wurden nicht als ein vollständiges fremdes Wörterbuch in das Spiel kopiert. Die verschiedenen Quellen werden nicht pauschal unter eine gemeinsame Lizenz umetikettiert.

FreeDict ist ein älteres Deutsch–Kurmandschi-Wörterbuch. Seine Alternativen wurden nach Bedeutung ausgewählt. Roj ist eine veröffentlichte englisch–soranische Community-Wörterbuchfassung; mehrdeutige englische Einträge enthalten oft mehrere unpassende Bedeutungen und wurden deshalb einzeln gefiltert. Explizite englische Wiktionary-Übersetzungstabellen und kurdische Lemmadefinitionen wurden nach Sprache und Sinn geprüft. Unicode CLDR liefert die Ländernamen. Mozilla liefert tatsächliche UI-Beschriftungen für „weiter“ und „bestätigen“.

Beim Wîkîferheng-Material wurde der versionierte GitHub-/Kaikki-Auszug geprüft. Es wird kein direkter Abruf oder eigener Revisionsnachweis der ursprünglichen ku.wiktionary.org-Seite behauptet. Einträge ohne Definition sowie bloße leere Formverweise wurden nicht als alleiniger Bedeutungsbeleg verwendet. Zusätzlich konsultiert wurde *Towards Electronic Lexicography for the Kurdish Language*, Ahmadi/Hassani/McCrae, eLex 2019, mit den Thackston-basierten [KurdishLex-Ressourcen](https://github.com/KurdishBLARK/KurdishLex); daraus wurden keine neuen arabischen Schreibungen automatisch konstruiert.

## Nachweise und Bearbeitung

Maschinenlesbare Einzelauszüge: [data/dictionary-evidence.json](../data/dictionary-evidence.json). Enthalten sind Originalausschnitt, Bedeutung, Sprachvarietät, Quellen-ID, konkrete Wiki-/Git-Revision und SHA256. Der Wörterbuchstand ist zusätzlich an seinen Datei-Hash gebunden: ${evidence.dictionarySha256}.

Bearbeitung: Auswahl eines passenden bezeugten Wortes oder einer vorhandenen Umschreibung; Unicode NFC; bei Sorani arabisches ي/ك für den Zeichenvergleich durch ی/ک und ھ durch ه ersetzt; allgemeine Stichwörter kleingeschrieben. Die ursprüngliche Quellenform bleibt im Beleg erhalten. „Kakao“ in Kurmandschi ist aus dem belegten *kakaoyê* im Kontext „Kakaobohnen“ als Grundform abgeleitet und ausdrücklich so gekennzeichnet. Die soranischen Angaben bei „Ausschnitt“ und „Düne“ sind zitierte allgemeine Umschreibungen, keine behaupteten normierten Fachtermini. Ihr enger fachlicher Einsatz bleibt Teil der muttersprachlichen/fachlichen Abnahme.

Die Daten werden beim Spielen ausschließlich lokal geladen. Die Belegdatei und Quellenrecherche verursachen keine externen Übersetzungsanfragen. npm run dictionary:report erzeugt diesen Bericht aus Daten und Belegen neu. npm run audit:release prüft auch deren Übereinstimmung und hält Sprachlücken, muttersprachliche Abnahmen sowie den echten iPad-Safari-Test weiterhin offen.

## Einzelliste der kurdischen Einträge

Die vollständigen Quellenausschnitte und zusätzlichen Belege stehen in der JSON-Datei; die Tabelle nennt die zugeordneten Quellenkennungen. Alle Zeilen sind redaktionell, noch nicht muttersprachlich abgenommen.

| Deutsch / Kontext | Kurmandschi | Belege | Sorani | Belege |
|---|---|---|---|---|
${dictionary.map(e => `| ${cell(e.de)}${e.context ? ": " + cell(e.context) : ""} | ${cell(e.ku)} | ${cell(refs(e.de,"ku"))} | ${cell(e.ckb)} | ${cell(refs(e.de,"ckb"))} |`).join("\n")}
`;
await writeFile(new URL("docs/woerterbuch-pruefung.md", root), report);
const escape = s => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const html = `<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self'; object-src 'none'; base-uri 'self'">
<title>Wörterbuch · Quellen und Prüfstand</title><link rel="stylesheet" href="css/style.css"></head>
<body><main class="credits-page"><h1>Wörterbuch: Quellen und Prüfstand</h1>
<p>Stand: ${escape(evidence.date)}. Redaktionell anhand von Quellen geprüft; <strong>noch nicht muttersprachlich abgenommen</strong>.</p>
<p><a href="index.html">Zur Ermittlungszentrale</a> · <a href="docs/woerterbuch-pruefung.md">Vollständiger Prüfbericht und Einzelliste</a></p>
<section class="panel"><h2>Abdeckung</h2><p>${added("ku")+added("ckb")} Übersetzungen wurden mit Belegen ergänzt. Für unsichere Begriffe wird keine Übersetzung erfunden.</p>
<table class="summary-table"><thead><tr><th>Sprache</th><th>Begriffe</th><th>Muttersprachliche Abnahme</th></tr></thead><tbody>
${languages.map(([code,name]) => `<tr><td>${escape(name)}</td><td>${count(code)} / ${dictionary.length}</td><td>offen</td></tr>`).join("")}
</tbody></table></section>
<section class="panel"><h2>Offene Begriffe</h2><p><strong>Kurmandschi:</strong> ${escape(missing("ku").join(", "))}.</p><p><strong>Sorani:</strong> ${escape(missing("ckb").join(", "))}.</p>
<p>Für diese Begriffe fehlen passende Belege in der benötigten Bedeutung. Besonders Fachbegriffe und ganze Formulierungen benötigen weitere Prüfung.</p></section>
<section class="panel"><h2>Was die Prüfung bedeutet</h2><p>Alle sieben Sprachen wurden redaktionell auf Bedeutung und Schrift geprüft. Alle vorhandenen kurdischen Werte haben Einzelbelege. Das bestätigt keine muttersprachliche Freigabe und keine vollständige Richtigkeit in ganzen Sätzen.</p><p>Im Spiel helfen Bedeutungsangaben bei mehrdeutigen Wörtern, zum Beispiel Land/Staat, See/Binnengewässer und Strom/Elektrizität. Regionale Schreibweisen, Idiomatik und sprachliche Eignung für Klasse 7 bleiben zu prüfen.</p>
<p>Kurmandschi und Sorani werden getrennt geführt. Einzelwortformen können von der Form in einem vollständigen Satz abweichen. Arabische Verben stehen häufig als Verbalnomen.</p></section>
<section class="panel"><h2>Quellen und Lizenzen</h2><ul>
${Object.values(evidence.sources).map(s=>`<li><a href="${escape(s.url)}" rel="noopener noreferrer">${escape(s.title)}</a> — ${escape(s.author)}; ${s.licenseFile ? `<a href="${escape(s.licenseFile)}">${escape(s.license)}</a>` : `<a href="${escape(s.licenseUrl)}" rel="noopener noreferrer">${escape(s.license)}</a>`}.</li>`).join("")}
</ul><p>Die Einzelauszüge behalten ihre Quellenlizenz. Bei Community-Wörterbüchern wurden mehrdeutige Belege nach Bedeutung ausgewählt; sie ersetzen keine professionelle Prüfung.</p><p>Die Wîkîferheng-Belege stammen aus dem verlinkten versionierten Auszug; ein eigener Direktabruf der Ursprungsseiten wird nicht behauptet.</p>
<p><a href="data/dictionary-evidence.json">Gesicherte Einzelbelege mit Revisionen und Prüfsummen</a></p></section></main></body></html>\n`;
await writeFile(new URL("woerterbuch.html", root), html);
console.log(`Wörterbuchbericht: Kurmandschi ${count("ku")}/${dictionary.length}, Sorani ${count("ckb")}/${dictionary.length}; muttersprachliche Abnahme offen.`);
