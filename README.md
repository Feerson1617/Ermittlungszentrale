# Die geheime Ermittlungszentrale

Ein browserbasiertes Geographie-Detektivspiel für Klasse 7: fünf unabhängige Akten, kurze Texte, Zweierteams und Ergebnisse auf Papier. Reines HTML, CSS und JavaScript, ohne Build-Schritt für das Spiel.

**Abnahmestatus:** Alle fünf Akten enthalten die 15 authentischen, lokal gespeicherten Fotografien mit belegten Aufnahmeorten und freien Lizenzen. Das Wörterbuch ist auf 176 Kurmandschi- und 177 Sorani-Werte erweitert; alle sieben Sprachen sind redaktionell plausibilisiert. Offen bleiben 21 kurdische Einträge, die muttersprachliche Abnahme aller sieben Sprachen und Safari auf einem echten Schul-iPad. Einzelheiten in [Abnahme](docs/abnahme.md), [Wörterbuchprüfung](docs/woerterbuch-pruefung.md), [Bildquellen](docs/bildquellen.md) und [Testbericht](docs/testbericht.md).

## Lokal starten

Mit Node.js 24 (getestet; keine Laufzeitpakete nötig):

```sh
npm start
```

Danach Port 4173 im Browser öffnen. Alternativ `python3 -m http.server 4173` im Repository. `index.html` nicht als `file://` öffnen, weil ES-Module und lokale JSON-Daten einen HTTP-Server benötigen.

## GitHub Pages

Nach Prüfung und Merge: im Repository **Settings → Pages → Deploy from a branch → main → / (root)** auswählen und speichern. GitHub Pages veröffentlicht `index.html` und die relativen Ressourcen. Es gibt keinen Build oder App-Server im Deployment. `.nojekyll` verhindert Jekyll-Verarbeitung. Die Anwendung ist auch unter dem Projektpfad `/Ermittlungszentrale/` getestet. Es wurde durch die Entwicklung noch kein Merge oder Pages-Deployment ausgelöst.

Unterricht erst nach den offenen Abnahmen freigeben. Alle Akten starten über denselben Link. Lösungen und Lehrermaterialien sind im öffentlichen Repository technisch einsehbar; es gibt keine behauptete Zugriffssperre.

## Akten und Punkte

| Akte | Inhalt | Maximal |
|---|---|---:|
| 001 · Der verschwundene Titel | Kontinent aus Beweismaterial erschließen | 5 |
| 002 · Die Bilder im Kopf | Persönliche Motive, Medienauswahl und Ausschnitte | 5 |
| 003 · Ein Kontinent, viele Gesichter | Marokko, Nigeria und Ghana räumlich zuordnen | 15 |
| 004 · Der letzte Ermittlungsbericht | Persönlicher Vergleich und passende Überschrift | 5 |
| 005 · Die Spur in die Zukunft | Vier Spuren und Fragen für die weitere Einheit | 5 Bonus |

Regulär maximal 30 Punkte; Bonus getrennt. Hinweisstufen begrenzen auf 5/3/2/1. Ein eindeutig falscher Versuch pro früher Stufe; nach Hinweis 3 unbegrenzte Versuche mit einer einfachen Abschlussauswahl. Richtige Teilkriterien bleiben erhalten. Ein positiver Teilerfolg beendet die Aufgabe. Persönliche Vorstellungen, Bildauswahl, Reflexionen und eigene Fragen werden nicht bewertet.

Sprachbewertung: explizite Schreibvarianten, Unicode-/Satzzeichen-Normalisierung, Verneinungsprüfung und vorsichtige Klärung unbekannter Formulierungen. Keine allgemeine Ähnlichkeitssuche für Ländernamen. „Amerika“ und „Südafrika“ werden nicht als „Afrika“ gewertet. Unklare Abgaben geben keine willkürlichen Punkte und verbrauchen keinen Versuch; das Team formuliert dieselbe Aussage verständlicher.

## Datenschutz und Betrieb

Keine Konten, Cookies, Datenbank, Analytics, externen APIs, Audioausgabe oder externen Fonts. Antworten und Punkte werden lokal berechnet. Optionale `sessionStorage`-Sicherung im Tab; keine verpflichtende Speicherung, kein `localStorage`. Ohne Speicher funktioniert alles im Arbeitsspeicher. Papier sichert die Punkte über Gerätewechsel hinweg. Bei Nutzung von GitHub Pages gelten dessen übliche Hosting-Zugriffsprotokolle; es gibt keine zusätzliche Telemetrie im Spiel.

Alle Ressourcen liegen lokal im Repository. Es gibt keine fremden Inhalte zur Laufzeit. Die Beweisfotos laden erst in der geöffneten Akte, kompakte Auswahlen zusätzlich bei Bedarf. Kein Service Worker, keine garantierte vollständige Offline-Neuladung nach Schließen des Browsers. Nicht geladene Akten benötigen auch während einer Sitzung den eigenen statischen Server; externe Dienste sind unnötig.

Die [lokalen Bildnachweise](bildnachweise.html) nennen Urheber, Originalquelle, Lizenz samt Version, Ortsbeleg und Motivabweichungen für alle 15 Fotos. Im Spiel ist der Link bei anonymen Rätseln erst nach der Lösung sichtbar. Die vollständigen Commons-Quellennachweise liegen unter `docs/media/`; der Medienkatalog enthält Prüfsummen. `npm run media:credits` erzeugt die Nachweisseite und `docs/bildquellen.md` aus dem Katalog neu.

Zur erneuten Optimierung die in `data/media.json` angegebenen Originaldateien mit ihren ursprünglichen Wikimedia-Dateinamen in einem separaten Verzeichnis bereitstellen. `python3 scripts/prepare-media.py /pfad/zu/originalen` prüft SHA1/SHA256 und erzeugt die WebP-Dateien neu (Entwicklungswerkzeug: Pillow 12.3.0). Danach `npm run media:credits` ausführen. Das Skript lädt selbst nichts herunter.

## Wörterbuch

187 Begriffe. Sieben getrennte Zielsprachen: Russisch, Ukrainisch, Polnisch, Türkisch und Standardarabisch mit jeweils 187 Werten; Kurmandschi mit 176 und Sorani mit 177. Alle 353 vorhandenen kurdischen Werte sind einzeln mit Quellen verbunden; 248 wurden neu ergänzt. Versionierte Wörterbuch-/Wiktionary-Belege, CLDR-Ländernamen und Mozilla-UI-Angaben: [Prüfbericht](docs/woerterbuch-pruefung.md), maschinenlesbar `data/dictionary-evidence.json`. `npm run dictionary:report` erzeugt den Bericht neu.

Arabisch und Sorani erscheinen mit RTL-Schreibrichtung; Kurmandschi bleibt getrennt in lateinischer Schrift. Bei mehrdeutigen Begriffen nennt das Spiel die Bedeutung, beispielsweise „Strom = Elektrizität“ oder „See = Binnengewässer“. Sichere bekannte Tippvarianten werden erkannt; unsichere Treffer werden nur vorgeschlagen. Die 11 Kurmandschi- und 10 Sorani-Lücken bleiben „Keine Übersetzung vorhanden“. Die quellengestützte redaktionelle Plausibilitätsprüfung ersetzt keine muttersprachliche Freigabe. Diese steht für alle sieben Sprachen aus.

## Unterrichtsmaterialien

- [Ermittlungsbogen HTML](materials/ermittlungsbogen.html) und [PDF](materials/ermittlungsbogen.pdf): genau zwei DIN-A4-Seiten, beidseitig an langer Kante, 100 %, schwarz-weiß-tauglich.
- [Erwartungshorizont Markdown](docs/erwartungshorizont.md), [HTML](materials/erwartungshorizont.html) und [PDF](materials/erwartungshorizont.pdf): aus denselben Rubrikdaten generiert; nicht in der Schüleroberfläche verlinkt.
- [Didaktische Umsetzung](docs/didaktisches-konzept.md).

Der Bogen nennt das Thema schon in den späteren Aufgaben. Für die Überraschung in Akte 001 den Bogen erst nach der Lösung ausgeben oder spätere Bereiche zunächst abdecken. Eine DOCX-Fassung wurde nicht erstellt; die HTML-Fassung ist bearbeitbar.

## Entwicklung und Tests

Node.js 24 und npm 11 wurden verwendet. Nur Entwicklungswerkzeuge sind abhängig von npm-Paketen:

```sh
npm ci
npm test
npm run test:e2e
npm run materials
npm run test:pdf
npm run audit:release
```

Playwright nutzt hier `/usr/bin/chromium`. Für andere Systeme `CHROMIUM_PATH` auf eine installierte Chromium-Binärdatei setzen. Zwei Projekte prüfen iPad-Querformat (1024 × 768, Touch) und schmales iPhone-Format (390 × 664, Touch). Die Geräteemulation ist kein Nachweis eines echten Safari-Geräts. Optional bei verfügbarem WebKit: `TEST_WEBKIT=1 npm run test:e2e`. Dessen Browser vorher mit `npx playwright install webkit` installieren. Netzwerk und Browser-Bibliotheken müssen vorhanden sein.

PDF-Generierung: `npm run materials` braucht Chromium und prüft den HTML-Seitenüberlauf vor der Ausgabe. Die PDF-Inhalts-/Formatprüfung nutzt Python mit `pypdf` (`python3 -m pip install pypdf` in einer Entwicklungsumgebung). Fertige PDFs liegen im Repository; zum Spielen ist keine Installation erforderlich.

`npm run audit:release` beendet sich absichtlich mit Code 2, solange die dokumentierten Bild-, Sprach- und Geräteabnahmen offen sind. Das ist keine technische Funktionsprüfung. Änderungen an Rubriken: Materialien neu generieren und die betroffenen Tests wiederholen.

## Struktur

```text
index.html           zentrale Schüleranwendung
css/style.css        responsive Oberfläche und Touch-Ziele
js/                  Navigation, Sitzung, Bewertung, Wörterbuch
 data/               Akten, Rubriken, Übersetzungen, lokale Kartendaten
assets/              lokale Karten, Oberflächenzeichnung und 15 Beweisfotos
materials/           druckbare HTML-/PDF-Dateien
 docs/               Erwartungshorizont, Quellen, Didaktik, Abnahmestatus
scripts/             Entwicklungsserver, Material-/Kartengenerierung, Abnahmeprüfung
tests/               Node-Tests und Playwright-Browserdurchläufe
```

Keine Schülernamen im Spiel eingeben; Namensfelder gibt es nur auf Papier. Entwicklungsbranch `feature/detektivspiel-komplett`, bestehender Draft-PR #1 gegen `main`. Kein Merge oder Deployment ohne gesonderten Auftrag.
