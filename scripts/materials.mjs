import { readFile, writeFile, mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { resolve } from "node:path";
import { cases, photos } from "../data/cases.js";
import { maps } from "../data/maps.js";
import {
  scopeAccepted,
  scopeRejected,
  diversityAccepted,
  diversityRejected,
} from "../js/scoring.js";
const root = resolve(new URL("..", import.meta.url).pathname);
const r = JSON.parse(
  await readFile(resolve(root, "data/rubrics.json"), "utf8"),
);
const dictionary = JSON.parse(
  await readFile(resolve(root, "data/dictionary.json"), "utf8"),
);
const e = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const line = '<div class="write-line"></div>';
const style = `*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;color:#111;background:#e9e9e9;font-size:12pt;line-height:1.35}h1{font-size:21pt;line-height:1.15;margin:0 0 8mm}h2{font-size:14pt;margin:0 0 3mm}h3{font-size:12pt;margin:4mm 0 2mm}p{margin:2.5mm 0}section{margin:5mm 0 0;padding-top:3mm;border-top:1px solid #333}.sheet{background:white;width:190mm;height:277mm;margin:10mm auto;padding:0;overflow:hidden;page-break-after:always;position:relative}.sheet:last-child{page-break-after:auto}.sheet-footer{position:absolute;bottom:1mm;left:0;right:0;display:flex;justify-content:space-between;font-size:9pt}.write-line{height:9mm;border-bottom:1px solid #555;margin-bottom:2mm}.name-row{display:flex;gap:8mm;justify-content:space-between}.map{width:100%;height:65mm;margin:3mm 0 0}.map svg{width:100%;height:100%;display:block}.map path{fill:white;stroke:#222;stroke-width:.8}.map rect{fill:white}.points{text-align:right;font-weight:bold;margin-top:3mm}.numbers{font-size:19pt;letter-spacing:3mm;margin:3mm 0 4mm}.sub{font-size:10.5pt}.question{font-weight:normal}.score-table{border-collapse:collapse;width:100%;font-size:11pt}.score-table td,.score-table th{border-bottom:1px solid #777;padding:2mm;text-align:left}.totals{display:flex;gap:4mm;justify-content:space-between;flex-wrap:wrap;font-size:11pt}.totals span{min-width:20mm}.print-bar{max-width:190mm;margin:15px auto}a{color:#111}.print-bar p{font-size:11pt}@page{size:A4;margin:10mm}@media print{body{background:white}.sheet{margin:0;break-after:page}.sheet:last-child{break-after:auto}.print-bar{display:none}}`;
const worksheet = `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Meine geheime Ermittlungsakte</title><style>${style}</style></head><body><aside class="print-bar"><a href="ermittlungsbogen.pdf">PDF herunterladen</a><p>DIN A4 · 100 % · beidseitig · lange Kante · keine Kopf- und Fußzeilen.</p></aside>
<article class="sheet" aria-label="Vorderseite"><h1>Meine geheime Ermittlungsakte</h1><div class="name-row"><span>Name: ____________________</span><span>Team: ____________________</span></div>
<section><h2>Akte 001 · Der verschwundene Titel</h2><p class="question">Welches neue Thema erwartet uns im Geographieunterricht?</p><p>Antwort: __________________________________________</p><p class="points">Punkte: ______ / 5</p><div class="map" role="img" aria-label="Unbeschriftete Weltkarte ohne Hervorhebung">${maps.world}</div><p>Nach der Lösung: Markiere Afrika rot.</p></section>
<section><h2>Akte 002 · Die Bilder im Kopf</h2><p>Welche Bilder verbinden wir mit Afrika?</p><p>Unsere vier Bildnummern:</p><p class="numbers">___ ___ ___ ___</p><p>Was zeigen die vier Bilder der Redaktion nicht?</p>${line}${line}<p>Vier Fotos zeigen nur …</p>${line}<p class="points">Punkte: ______ / 5</p></section><div class="sheet-footer"><span>Gemeinsam ermitteln. Wörter und Stichpunkte genügen.</span><span>1 / 2</span></div></article>
<article class="sheet" aria-label="Rückseite"><section><h2>Akte 003 · Ein Kontinent, viele Gesichter</h2><p>Wie unterschiedlich ist Afrika?</p><table class="score-table"><thead><tr><th>Fall</th><th>Land</th><th>Punkte</th></tr></thead><tbody><tr><td>A · Schnee</td><td>_______________________</td><td>____ / 5</td></tr><tr><td>B · Großstadt</td><td>_______________________</td><td>____ / 5</td></tr><tr><td>C · Zutat</td><td>_______________________</td><td>____ / 5</td></tr></tbody></table><p>Das hat mich überrascht:</p>${line}</section>
<section><h2>Akte 004 · Der letzte Ermittlungsbericht</h2><p>Was hat sich an unseren Vorstellungen verändert?</p><p>Unsere neuen vier Bildnummern:</p><p class="numbers">___ ___ ___ ___</p><p>Am Anfang dachte ich …</p>${line}<p>Jetzt weiß ich …</p>${line}<p class="points">Punkte: ______ / 5</p></section>
<section><h2>Akte 005 · freiwillig</h2><p>Eine Frage für die nächsten Geographiestunden:</p>${line}${line}<p class="points">Bonus: ______ / 5</p></section>
<section><h2>Unsere Punkte</h2><div class="totals"><span>Akte 1: ____</span><span>Akte 2: ____</span><span>Akte 3: ____ / 15</span><span>Akte 4: ____</span></div><p><strong>Gesamt: ______ / 30</strong> &nbsp;&nbsp; Bonus-Akte 5: ______ / 5</p><p class="sub">Persönliche Bildauswahl, Gedanken und eigene Fragen geben keine Punkte.</p></section><div class="sheet-footer"><span>Bildnummern in Akte 002 und 004 sind gleich.</span><span>2 / 2</span></div></article></body></html>`;
await mkdir(resolve(root, "materials"), { recursive: true });
await mkdir(resolve(root, "docs"), { recursive: true });
await writeFile(resolve(root, "materials/ermittlungsbogen.html"), worksheet);
const coverage = Object.fromEntries(
  ["ru", "uk", "pl", "tr", "ar", "ku", "ckb"].map((l) => [
    l,
    dictionary.filter((x) => x[l]).length,
  ]),
);
const tasks = Object.entries(r.tasks)
  .map(([key, t]) => {
    const criteria = t.criteria
      ? `\nTeilpunkte: ${t.criteria.map((c) => `${c.label}: ${c.points}`).join("; ")}. Gemeinsame Abgabe aller drei Teile. Jedes gewählte Foto außerhalb der Redaktion [${t.editorial.join(", ")}] zählt einen Punkt. Auswahl genau zwei verschiedene Fotos.\n`
      : "";
    return `## ${t.label}\n\nAkte ${t.case}; Aufgaben-ID: \`${key}\`; maximal ${t.max} ${t.case === 5 ? "Bonus" : ""}punkte.\n\n**Lösung:** ${t.solution}\n${criteria}\n**Hinweise (in dieser Reihenfolge):**\n\n${t.hints.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n**Nach Hinweis 3:** ${t.fallback.prompt} ${t.fallback.options.map((s, i) => `${String.fromCharCode(65 + i)}: ${s}`).join(" / ")} Richtig: A. Erfolgreiche Abgabe: ein Punkt, vorher kein Punkt.\n\n**Sicherung:** ${t.paper}\n\n**Rückmeldung:** ${t.success}\n${t.aliases ? `\nAkzeptierte normalisierte Namensformen: ${t.aliases.map((a) => "`" + a + "`").join(", ")}. Dazu kurze Sätze wie „Das Land ist …“. Keine allgemeine Distanzkorrektur.\n` : ""}`;
  })
  .join("\n");
const teacher = `# Erwartungshorizont · Die geheime Ermittlungszentrale

Bearbeitbare Ausgangsfassung. Aufgaben, Hinweise, Lösungen und Namensvarianten werden aus \`data/rubrics.json\` erzeugt. Formulierungen zur Kurzantwortauswertung stammen aus \`js/scoring.js\`. Nach Inhaltsänderungen \`npm run materials\` ausführen.

## Unterricht und Lernziele

Geographie, Jahrgang 7, ETS Tönning/Friedrichstadt. Bezug laut Entwicklungsauftrag: „Afrika – Abhängigkeiten von Naturraum und Bevölkerungsentwicklung und seine wirtschaftlichen Potentiale“. Kein unabhängiger Abgleich mit einer schulischen Curriculumdatei: Diese wurde nicht mitgeliefert.

Fünf Schwerpunkte: Afrikabild in Deutschland; naturräumliche Abhängigkeiten; Bevölkerungswachstum als Chance und Risiko; wirtschaftlicher Aufschwung; nachhaltige Entwicklungschancen. Die Akten regen Fragen an und nehmen die folgenden Unterrichtsstunden nicht vorweg.

Zweierteams; keine Zeitwertung, kein Audio. Akten sind unabhängig. Akte 001: etwa 10–12 Minuten. Akten 002 und 003: jeweils etwa 15–20 Minuten. Akte 004: 8–10 Minuten. Freiwillige Akte 005: 10–15 Minuten. Einzelne Stunden auswählen; nicht alle Akten in eine Unterrichtsstunde drängen.

Akte 001: Thema aus widersprüchlich wirkenden Raumbeispielen erschließen. Akte 002: persönliche Vorstellungen ausdrücken und begrenzte Medienauswahl erkennen. Akte 003: Orte räumlich verorten und Vielfalt erkennen. Akte 004: Vorstellungen überdenken, ohne eine bestimmte Meinung zu erzwingen. Akte 005: Fragen für die weitere Einheit entwickeln.

## Vor dem Einsatz: offene Abnahme

Authentische Beweisfotos sind noch nicht eingebunden. Wikimedia-Zugriff wurde vom Umgebungsproxy mit HTTP 403 verweigert. Die Anwendung zeigt beschriftete fehlende Motive, keine erfundenen Beweisbilder. Alle Bildrätsel benötigen für den vorgesehenen Unterricht echte, einzeln lizenzgeprüfte Fotos. Deshalb diese Fassung noch nicht als vollständig abgenommenes Unterrichtsspiel behandeln. Einzelheiten: \`docs/bildquellen.md\` und \`docs/abnahme.md\`.

Wörterbuch: ${dictionary.length} deutsche Begriffe. Abdeckung: Russisch ${coverage.ru}, Ukrainisch ${coverage.uk}, Polnisch ${coverage.pl}, Türkisch ${coverage.tr}, Arabisch ${coverage.ar}, Kurmandschi ${coverage.ku}, Sorani ${coverage.ckb}. Fehlende Begriffe bleiben ausdrücklich leer. Redaktionelle Übersetzungen, keine professionelle Wörterbuchlizenz oder erfolgte muttersprachliche Abnahme behauptet. Vor Einsatz insbesondere beide kurdischen Varianten und arabische Fachbegriffe muttersprachlich prüfen. Die Abdeckung genügt noch nicht allen Auftragswörtern in beiden kurdischen Varianten.

Der Schülerbogen enthält gemäß Auftrag das Thema bereits in mehreren Aufgaben. Für die Überraschung in Akte 001 den Bogen erst nach der Lösung ausgeben oder die späteren Aufgaben zunächst abdecken. Nicht behaupten, der öffentlich einsehbare Quellcode oder diese Datei sei technisch geheim.

## Punkte und Versuche

Hinweisstufen 0 / 1 / 2 / 3 begrenzen die Punkte auf ${r.limits.join(" / ")}. Öffnen eines Hinweises senkt das Limit für diesen Fall dauerhaft. Pro früher Stufe genau eine eindeutig bewertbare Gesamtabgabe. Bei null Rohpunkten wird die Stufe gesperrt; nur der nächste Hinweis öffnet einen neuen Versuch. Nach Hinweis 3 gibt es unbegrenzt viele Versuche und eine einfache Auswahlaufgabe. Das Öffnen der Hinweise vergibt keine Punkte.

Teilpunkte: Endpunkte = min(Rohpunkte, Hinweislimit). Positive Teilabgabe schließt die Aufgabe ab; richtige Teile gehen nicht durch falsche Teile verloren. Kein nachträgliches Nachprüfen einzelner Antworten. Nach jedem Ergebnis muss das Team die Papiernotiz bestätigen. Erst dann ist die Fortsetzung möglich. Akte 003 hat drei getrennte Fälle mit eigenen Limits und Ergebnisbestätigungen.

Regulär: Akte 001 = 5; Akte 002 = 5; Akte 003 = 15; Akte 004 = 5; Gesamt = 30. Akte 005 = bis zu 5 Bonuspunkte, getrennt. Bonuszuordnung: vier richtig = fünf Rohpunkte; drei = drei; zwei = zwei; eins = eins; null = keine Punkte und nächster Hinweis. Die Frage am Ende ist unbewertet.

## Sprachsensible Bewertung

Unicode, Großschreibung, Satzzeichen und Leerraum werden normalisiert. Häufige geografische Schreibvarianten sind ausdrücklich freigegeben. Artikel und kurze Satzrahmen sind erlaubt. Es gibt keinen Abzug für Grammatik, Stichpunkte oder Satzfragmente. Unbekannte Schreibweisen werden nicht per Levenshtein in ein vermeintlich ähnliches Land umgewandelt.

„Amerika“, „America“, „Südamerika“, „Nordamerika“, „Asien“, „Antarktis“ und „Südafrika“ lösen Akte 001 nicht. „Afrika und Amerika“ ist widersprüchlich und wird nicht als richtig gewertet. Verneinung wie „nicht Afrika“ wird erkannt.

Unklare Eingabe: keine Punkte und kein verbrauchter Versuch; kurze neutrale Bitte, dieselbe Aussage klarer zu schreiben. Es werden keine richtigen Teilantworten angezeigt und keine neue inhaltliche Lösungsfrage gestellt. Falls nötig prüft die Lehrkraft, ob das Team dieselbe Aussage nur verständlicher formuliert. Automatische lokale Regeln können die Bedeutung beliebiger freier Sätze nicht garantieren. Lange Erklärungen werden deshalb durch kurze oder geschlossene Teilaufgaben ersetzt.

Leere oder unvollständige Abgaben verbrauchen keinen Versuch. Eindeutig falsche bekannte Antworten werden gewertet und sperren die frühe Stufe. Ohne Browser-Persistenz bleibt alles im Arbeitsspeicher spielbar. Papier sichert die Punkte über Gerätewechsel und Unterrichtsstunden.

### Akte 002: Kurzantworten

Zwei Rohpunkte für einen Ausschnitt. Explizite akzeptierte Kurzformen nach Normalisierung: ${scopeAccepted.map((x) => "„" + x + "“").join(", ")}. Einfache Satzrahmen wie „Die vier Fotos zeigen …“ werden entfernt. Auch „einige Orte“, „wenige Plätze“ und „manche Stellen“ sind zulässig.

Explizit falsch: ${scopeRejected.map((x) => "„" + x + "“").join(", ")}; ebenso „nicht einige“, „kein Teil“ beziehungsweise verneinte Teilbehauptungen, soweit die Regel sie eindeutig erkennt. Mischformen wie „einige und alle“ bleiben ungeklärt und geben keine automatischen Punkte.

Ein Rohpunkt für Vielfalt. Akzeptiert: ${diversityAccepted.map((x) => "„" + x + "“").join(", ")}. Falsch: ${diversityRejected.map((x) => "„" + x + "“").join(", ")}. Im Spiel ist diese Teilfrage geschlossen (Ja/Nein), damit keine langen Erklärungen nötig sind.

${tasks}

## Bildnummern und Redaktionsbeispiel

${photos.map((p) => p.id + ". " + p.title + ". Geplantes Motiv: " + p.location + ".").join("\n")}

Die fiktive Redaktion wählt 1, 2, 5 und 10. Auch ihre städtische Marktaufnahme ersetzt keine Darstellung aller Lebensräume. Das Beispiel zeigt eine begrenzte Auswahl; es ist kein Beleg über alle deutschen Medien. Fehlende Motive für Teilaufgabe 3 sind folglich 3, 4, 6, 7, 8 und 9. Akte 004 nutzt dieselben zehn Datenobjekte und Nummern. Keine Veränderung einer persönlichen Auswahl wird verlangt oder bewertet.

## Differenzierung und Grenzen

Lernende können Antworten vor der gemeinsamen Abgabe ändern. Wörterbuch, Partnergespräch und Papier stehen jederzeit bereit. Hinweise sind freiwillig; keine Zeitpunkte. Ab Stufe 3 hilft eine binäre, fachlich sinnvolle Abschlussaufgabe. Bei Akte 001 zeigen zwei unbeschriftete Karten Kontinente A und B; A markiert Afrika. Der Name erscheint erst nach Lösung. Akte 003 nutzt Karte und markierten Standort als Beweismittel bereits vor bezahlten Hinweisen.

Karten: Natural Earth 1:110 Millionen, Public Domain. Vereinfachte Küsten und Ländergrenzen, keine Navigationskarten. Westsahara wird als eigener Raum geführt; keine Aussage zur politischen Anerkennung. Schnee im Atlasgebirge gilt nicht als Wetterbeschreibung für ganz Marokko. Stadtzuzug ist nicht gleich natürliches Bevölkerungswachstum; die Bonusspur eröffnet beide Fragen, ohne eine einzige Ursache zu behaupten. Solarenergie ist eine Möglichkeit, keine pauschale Lösung für jeden Ort.

Diese Dokumente sind vom normalen Spiel aus nicht verlinkt. Im öffentlichen Repository bleiben sie zugänglich.
`;
await writeFile(resolve(root, "docs/erwartungshorizont.md"), teacher);
// The Markdown is deliberately simple and printable; escape all content before structural formatting.
function markdownHTML(text) {
  const lines = text.split("\n");
  let out = [],
    list = false;
  for (const line of lines) {
    if (/^\d+\. /.test(line)) {
      if (!list) {
        out.push("<ul>");
        list = true;
      }
      out.push("<li>" + inline(line.replace(/^\d+\. /, "")) + "</li>");
      continue;
    }
    if (list) {
      out.push("</ul>");
      list = false;
    }
    const heading = line.match(/^(#{1,3}) (.*)/);
    if (heading)
      out.push(
        `<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`,
      );
    else if (line) out.push("<p>" + inline(line) + "</p>");
  }
  if (list) out.push("</ul>");
  return out.join("\n");
}
function inline(line) {
  return e(line)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}
const teacherHTML = `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Erwartungshorizont · Ermittlungszentrale</title><style>@page{size:A4;margin:18mm}body{font:11pt/1.5 Arial,sans-serif;color:#151515;max-width:180mm;margin:25px auto}h1{font-size:22pt;line-height:1.15}h2{font-size:16pt;margin-top:25px;break-after:avoid}h3{font-size:13pt;break-after:avoid}p{orphans:3;widows:3}code{font-size:10pt;overflow-wrap:anywhere}li{margin:4px 0}strong{font-weight:700}@media print{body{margin:0;max-width:none}}</style></head><body>${markdownHTML(teacher)}</body></html>`;
await writeFile(
  resolve(root, "materials/erwartungshorizont.html"),
  teacherHTML,
);
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage();
  for (const name of ["ermittlungsbogen", "erwartungshorizont"]) {
    await page.emulateMedia({ media: "print" });
    await page.setContent(
      await readFile(resolve(root, `materials/${name}.html`), "utf8"),
    );
    if (name === "ermittlungsbogen") {
      const overflow = await page
        .locator(".sheet")
        .evaluateAll((els) =>
          els
            .map((el) => ({
              height: el.clientHeight,
              scroll: el.scrollHeight,
              last: el.lastElementChild.getBoundingClientRect().top,
              content:
                el.children[el.children.length - 2].getBoundingClientRect()
                  .bottom,
            }))
            .filter((x) => x.scroll > x.height + 1 || x.content > x.last),
        );
      if (overflow.length)
        throw new Error(
          "Schülerbogen überschreitet die Seitengrenze: " +
            JSON.stringify(overflow),
        );
    }
    await page.pdf({
      path: resolve(root, `materials/${name}.pdf`),
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
    });
    console.log("Created", name + ".pdf");
  }
} finally {
  await browser.close();
}
