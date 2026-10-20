import { readFile, writeFile } from "node:fs/promises";
const root = new URL("../", import.meta.url);
const media = JSON.parse(await readFile(new URL("data/media.json", root)));
const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const rows = Object.entries(media.images);
const authorHtml = i => i.authorUrl ? `<a href="${esc(i.authorUrl)}" rel="noopener noreferrer">${esc(i.author)}</a>` : esc(i.author);
const intro = `# Bildquellen und Karten

## Dokumentarische Fotografien

${rows.length} von 15 authentischen Fotografien sind lokal eingebunden. Recherche, Abgleich der Aufnahmeorte, Lizenzprüfung und Sichtprüfung: 20.10.2026. Keine generierten Beweisbilder; keine externen Bildabrufe beim Spielen.

Die Ortsprüfung stützt sich auf die Autorbeschreibung, die Originalquellen und geografischen Kategorien sowie, soweit vorhanden, Koordinaten der Commons-Beschreibungsseite. Die jeweilige Genauigkeit und jede Motivabweichung stehen unten. Nicht belegte Straßen, Farmstandorte oder GPS-Koordinaten werden nicht ergänzt. Einzelbilder belegen weder gegenwärtige Zustände noch zeitliche Trends für ein ganzes Land.

Unter \`docs/media/\` liegen unveränderte Commons-API-Antworten mit Beschreibungs-Wikitext, Revisions-ID, Urheber, Lizenzvorlage, Originaldatei-URL/-SHA1 und Kategorien. \`data/media.json\` enthält zusätzlich die SHA256 von Nachweisen, Originaldownloads und ausgelieferten WebP-Dateien. Die heruntergeladenen Originale wurden vor der Optimierung bytegenau mit dem SHA1 aus der Commons-Dateiinformation abgeglichen. Die großen Originaldownloads werden nicht zusätzlich ausgeliefert.

Alle lokalen Ableitungen behalten die jeweilige Bildlizenz. WebP-Konvertierung, Verkleinerung (maximal 1400 × 1400 Pixel) und Entfernung von EXIF; kein inhaltlicher Eingriff, keine generative Bearbeitung, kein gespeicherter Beschnitt. Die Oberfläche zeigt das vollständige Bild mit \`object-fit: contain\`. Eventuelle Bearbeitungen bereits auf Commons stehen im gesicherten Quellennachweis.

Die sichtbare Kurzangabe nennt Urheber und Lizenz. Die lokale Seite [Bildnachweise](../bildnachweise.html) enthält Originaltitel, Quell- und Lizenzlinks, Ortsbeleg und Bearbeitung. Sie ist im Spiel bei den anonymen Rätseln erst nach der Lösung verlinkt. Akte 001 zeigt neutrale Bildnummern, Motive und Dateipfade; keine Ortsnamen oder Originaltitel. Akte 002 und 004 verwenden dieselben zehn Einträge mit identischen Nummern und Dateien. In Akte 003 folgen Atlas- und Kakaopunkt den dokumentierten Aufnahmekoordinaten; der Stadtpunkt markiert Lagos Island aus der Autorbeschreibung. Die Karten sind stark vereinfacht und keine Navigationskarten.

Die Fotos laden erst in der geöffneten Akte, kompakte Auswahlen zusätzlich mit Lazy Loading. Zusammen: ${(rows.reduce((sum, [,i]) => sum + i.bytes, 0) / 1024 / 1024).toFixed(2)} MiB. Kein Vorladen der 15 Fotos auf dem Startbildschirm. Bildabnahme ist von der weiterhin offenen sprachlichen und echten Geräteabnahme getrennt.

| Nachweis | Spielschlüssel | Motiv / belegter Ort | Urheber | Lizenz | Datei |
|---|---|---|---|---|---|
${rows.map(([key,i]) => `| ${i.creditId} | ${key} | ${i.description} ${i.location} | ${i.author} | [${i.license}](${i.licenseUrl}) | [${i.path}](../${i.path}) |`).join("\n")}
`;
const details = rows.map(([key,i]) => `
### ${i.creditId} · ${key}

- **Original:** [${i.sourceTitle}](${i.source}); [geprüfte Beschreibungsrevision ${i.sourceRevision}](${i.sourceRevisionUrl}).
- **Aufnahmeort:** ${i.location}.
- **Aufnahmedatum laut Quelle:** ${i.taken}.
- **Ortsbeleg:** ${i.locationEvidence}
- **Urheber / Lizenz:** ${i.authorUrl ? `[${i.author}](${i.authorUrl})` : i.author}; [${i.license}](${i.licenseUrl}).
- **Erforderliche Attribution der lokalen Fassung:** ${i.attribution}
- **Motivabweichung / Grenze:** ${i.deviation || "Keine Abweichung vom geplanten Motiv."}
- **Lokal:** ${i.path}, ${i.width} × ${i.height} Pixel, ${Math.round(i.bytes/1024)} KiB; SHA256 \`${i.sha256}\`.
- **Quellennachweis:** [${i.evidence}](../${i.evidence}); SHA256 \`${i.evidenceSha256}\`.
`).join("\n");
const current = await readFile(new URL("docs/bildquellen.md", root), "utf8");
const maps = current.slice(current.indexOf("## Karten: Natural Earth"));
await writeFile(new URL("docs/bildquellen.md", root), intro + details + "\n" + maps);
const html = `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self'; style-src 'self'; object-src 'none'; base-uri 'self'">
<title>Bildquellen und Lizenzen · Ermittlungszentrale</title><link rel="stylesheet" href="css/style.css"></head>
<body><main class="credits-page"><h1>Bildquellen und Lizenzen</h1><p>Authentische Fotografien aus Wikimedia Commons. Prüfung: 20.10.2026. Ortsangaben entsprechen der dokumentierten Genauigkeit.</p><p><a href="index.html">Zur Ermittlungszentrale</a> · <a href="docs/bildquellen.md">Vollständige Dokumentation</a></p>
${rows.map(([key,i]) => `<article class="panel" id="${i.creditId}"><h2>${esc(i.creditId)} · ${esc(i.description)}</h2><img class="credit-preview" src="${esc(i.path)}" width="${i.width}" height="${i.height}" loading="lazy" alt="${esc(i.description)}"><p><strong>Ort:</strong> ${esc(i.location)}</p><p><strong>Aufnahmedatum laut Quelle:</strong> ${esc(i.taken)}</p><p>${esc(i.locationEvidence)}</p><p><strong>Original:</strong> <a href="${esc(i.source)}" rel="noopener noreferrer">${esc(i.sourceTitle)}</a> · <a href="${esc(i.sourceRevisionUrl)}" rel="noopener noreferrer">Geprüfte Beschreibungsrevision</a></p><p><strong>Urheber:</strong> ${authorHtml(i)} · <a href="${esc(i.licenseUrl)}" rel="noopener noreferrer">${esc(i.license)}</a></p><p><strong>Attribution:</strong> ${esc(i.attribution)}</p><p><strong>Motivabweichung / Grenze:</strong> ${esc(i.deviation || "Keine Abweichung vom geplanten Motiv.")}</p><p><a href="${esc(i.evidence)}">Lokaler Quellennachweis</a></p></article>`).join("\n")}
<p>Die Bilder behalten ihre jeweils angegebene Lizenz. Unterrichts- und Geräteabnahme werden getrennt dokumentiert.</p></main></body></html>\n`;
await writeFile(new URL("bildnachweise.html", root), html);
console.log(`${rows.length} Bildnachweise erzeugt.`);
