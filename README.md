# Die geheime Ermittlungszentrale 2.2

Geographie-Detektivspiel für Klasse 7: fünf unabhängig startbare Akten, Zweierteams, kurze Arbeitsschritte und Ergebnisse auf Papier. Statisches HTML/CSS/JavaScript; kein Build für das Spiel erforderlich.

Version 2.2 übernimmt den vollständigen Stand von 2.1 und korrigiert gezielt Sprache, Rückmeldungen, Wörterbuch-Fokus und Materialien. Der Lagos-Vergleich beschränkt sich auf verifizierte Bildorte/-jahre und sichtbare Gebäude/Blickrichtungen. Lange Grenzen stehen unter „Mehr erfahren“. Jede fachliche Auswahl im unbewerteten Lernweg erhält eine passende Erklärung; persönliche Vermutungen bleiben frei. **Alle 24 Fotos, fünf Akten, 30+5 Punkte und 5/3/2/1 bleiben erhalten.** [Befundmatrix](docs/v22-umsetzung.md).

**Neuer PR-Branch:** `fix/ermittlungszentrale-2-2-abnahme`, auf Grundlage von `main` mit den dort fehlenden 2.1-Änderungen. [Draft-PR #2](https://github.com/Feerson1617/Ermittlungszentrale/pull/2) ist erstellt und bleibt offen. Kein Merge, kein Push auf den bisherigen Pages-Quellbranch und keine Änderung der Pages-Einstellungen.

**Abnahme:** lokal technisch geprüft; keine pauschale Unterrichtsfreigabe. Offen sind sprachkundige Prüfungen, echte iPad-Safari- und Druckprobe, Lerngruppenerprobung/Zeitmessung, direkte Originalabgleiche einzelner Sach-/Curriculumquellen sowie die öffentliche Live-Funktion. [Abnahmestatus](docs/abnahme.md), [Testbericht](docs/testbericht.md).

## SCORM 1.2 für itslearning

Der getrennte SCORM-Export wird mit `npm run build:scorm` erzeugt. Die ZIP enthält das vollständige Spiel 2.2 und verändert die Pages-Fassung nicht. [Anleitung für Lehrkräfte und technische Dokumentation](docs/scorm-itslearning.md) · [Test- und Abnahmebericht](docs/scorm-testbericht.md).

## Start und Vorschau

Im vollständigen Repository, mit Node.js 24:

```sh
npm start
```

Den laufenden HTTP-Server auf Port **4173** öffnen: `/` oder `/Ermittlungszentrale/`. Der Server hört auf `0.0.0.0`. In einer Cloud-Oberfläche muss eine unterstützte Portweiterleitung den ganzen Server bereitstellen. Eine Einzeldateivorschau oder `file://` kann Modulgraph und lokale JSON-Dateien nicht laden. Ladefehler zeigen eine verständliche Starthilfe statt einer dauerhaften Lademeldung.

Alternativ ein unabhängiger statischer Server:

```sh
python3 -m http.server 4175 --bind 127.0.0.1 --directory /workspace/Ermittlungszentrale
```

Für den Projektpfad stattdessen `/workspace` auf Port 4174 ausliefern und `/Ermittlungszentrale/` öffnen. Der Spielserver braucht keine npm-Abhängigkeiten. Einzelheiten und Grenzen: [Vorschauprüfung](docs/vorschau.md).

Eine bereits laufende Vorschau vollständig prüfen, ohne einen Testserver zu starten:

```sh
npm ci
npm run check:start -- http://127.0.0.1:4173/ http://127.0.0.1:4173/Ermittlungszentrale/
```

Der Prüfer öffnet das gestaltete Menü, alle fünf Akten, Wörterbuch und Länder-/Lernweg; alle 24 lokalen Fotos müssen dekodieren. Er kontrolliert Konsolenfehler, Anfragen, MIME-Typen und Punkte. Benötigt Chromium, hier `/usr/bin/chromium`; bei Bedarf `CHROMIUM_PATH` setzen.

## Akten und Bewertung

| Akte | Inhalt | Höchstens |
|---|---|---:|
| 001 | Kontinent aus vier Beweisfotos erschließen | 5 |
| 002 | Vier aus zwölf Motiven; Medienauswahl in vier geschlossenen Schritten prüfen | 5 |
| 003 | Marokko, Nigeria, Ghana; zehn kurze unbewertete Belegschritte | 15 |
| 004 | Unabhängige zweite Auswahl, Rückblick und präzise Quellenüberschrift | 5 |
| 005 | Erfundene Nachrichten, reale Belegfotos und Zukunftsfragen | 5 Bonus |

Hinweise begrenzen auf 5/3/2/1 Punkte. Frühe Stufen erlauben je eine Gesamtabgabe; bei null Rohpunkten erst nach dem nächsten Hinweis erneut versuchen. Nach Hinweis 3 ist die vereinfachte Aufgabe beliebig oft versuchbar; erst die richtige Antwort ergibt einen Punkt. Entwürfe bleiben durch Hinweise 1/2 erhalten; die vereinfachte Antwort bleibt getrennt.

Positive Rohpunkte schreiben die Wertung fest. Fachliche Vollständigkeit wird unabhängig vom Punktelimit festgestellt: drei richtige Rohpunkte am Drei-Punkte-Limit sind weiterhin nur teilweise richtig. Offene Kriterien werden anschließend unbewertet korrigiert oder erklärt und bestätigt; keine Nachbepunktung. Rückkehr zur Zentrale ist jederzeit möglich, die offene Auflösung bleibt erkennbar. Fortsetzen erfordert Auflösung und Papierbestätigung. Persönliche Auswahlen, Vermutungen, Rückblicke, Begriffshilfen, Zoom und Wörterbuch werden nicht bewertet.

Explizite Namensvarianten und aufgabenspezifische Negationsregeln ersetzen keine allgemeine Sprach-KI. Unklare Namen werden neutral geklärt, ohne vorzeitig einen Versuch zu verbrauchen. „Afrika ist ein Land“ ist falsch; „Afrika ist kein Land, sondern ein Kontinent“ ist richtig. Keine pauschale unscharfe Ähnlichkeitssuche für Ländernamen.

## Bilder und Quellen

**24 echte Fotografien:** die bisherigen 19 bleiben bytegleich; fünf neue Commons-Fotos ergänzen den Weg. Vier neue Fotos stehen unter CC BY-SA 4.0, die senegalesische Gesundheitsstation ist als amtliches US-Regierungswerk gemeinfrei (PD-USGov-HHS, Vorlage lokal gesichert). Alle zwölf Auswahlbilder in Akte 002/004 stammen aus derselben zentralen Liste. Universität, Krankenhaus, Wassertank und Industriefoto sind zusätzliche Belege; die Küste bleibt als freiwillige Spur erreichbar. Quellen geben die belegte Ortsgenauigkeit an: Bei Klassenraum und Wassertransport ist nur das Land nachgewiesen.

Alle Fotografien liegen optimiert lokal als WebP vor. Orts-/Lizenzbelege, Urheber, Quellenrevisionen, Bearbeitungen, Grenzen und Prüfsummen stehen in [Bildquellen](docs/bildquellen.md), `data/media.json`, `docs/media/` und [Bildnachweisen](bildnachweise.html). Die bewusst aufrufbare Nachweisseite nennt Aufnahmeorte; im normalen Start/Akte 001 stehen keine geografischen Lösungsnamen. Eine technische Geheimhaltung des öffentlichen Quellcodes wird nicht behauptet.

Neue Sachinformationen stützen sich auf den bereitgestellten geprüften Auftrag und dessen benannte Quellen. Direkte Originalabrufe einzelner Institutionen sind durch den Cloud-Proxy blockiert; das ist ausdrücklich dokumentiert. Eine schematische Darstellung wird als Schema bezeichnet und ersetzt keine echte Fotografie durch eine generierte Szene.

```sh
npm run media:credits
python3 scripts/prepare-media.py /pfad/zu/originalen
```

Das Optimierungsskript benötigt Pillow und die mit ursprünglichem Dateinamen separat bereitgestellten Originale; es lädt nichts herunter. Quellenprüfsummen müssen stimmen. Das kleinere Balogun-Original wird nicht hochskaliert.

## Wörterbuch

197 deutsche Begriffe, sieben getrennte Sprachen: Russisch 196, Ukrainisch 195, Polnisch 197, Türkisch 195, Arabisch 196, Kurmandschi 184, Sorani 184. Fehlende Werte bleiben ausdrücklich leer; kostenlose deutsche Bedeutungshilfen bleiben verfügbar. Arabisch und Sorani verwenden RTL, Kurmandschi lateinische Schrift. Bekannte Formen wie „notiert“, „beeinflusst“ und „Ermittlungsteam“ verweisen auf ihre Grundbegriffe; „Bildbeleg“ auf den vorhandenen Begriff „Beweis“.

Alle kurdischen Werte und alle neuen nichtleeren V2-Werte haben einzelne Quellenbelege. Die fünf übrigen Sprachbestände wurden redaktionell plausibilisiert; vollständige Einzelbelege dieser Altbestände werden nicht behauptet. **Keine muttersprachliche Abnahme fand statt.** Quellen, Lücken, Wortbedeutungen und Grenzen: [Wörterbuchprüfung](docs/woerterbuch-pruefung.md), `data/dictionary-evidence.json`. `npm run dictionary:report` erzeugt den Bericht neu.

## Materialien und Unterricht

- [Schülerbogen PDF](materials/ermittlungsbogen.pdf) / [HTML](materials/ermittlungsbogen.html): genau zwei themenneutrale A4-Seiten, ab Beginn verwendbar; Weltkarte ohne Beschriftung oder Hervorhebung.
- [Erwartungshorizont PDF](materials/erwartungshorizont.pdf), [HTML](materials/erwartungshorizont.html), [Markdown](docs/erwartungshorizont.md): 13 Seiten mit Lösungen, Regeln, allen zwölf Bildnummern und Quellenstatus. Nicht aus der Schülernavigation verlinkt, im öffentlichen Projekt aber zugänglich.
- [Didaktischer Lernweg](docs/didaktisches-konzept.md): 90 Minuten als ungemessenes Planungsziel sowie Drei-Stunden-Alternative.

Schülerbogen mit 100 %, beidseitig an langer Kante drucken. Alle PDF-Seiten wurden digital gerendert; eine reale Druckprobe bleibt offen. Keine DOCX-Fassung; HTML bleibt bearbeitbar.

## Datenschutz und Speicherung

Keine Konten, Cookies, Datenbank, Analytics, Audio oder externe Übersetzungs-/Bewertungsdienste. Die App sendet keine Antworten an externe Dienste. Der statische Host kann Zugriffsprotokolle einschließlich IP-Adressen führen; keine pauschale schulische Datenschutzfreigabe.

`sessionStorage` ist optional. Ohne Speicher funktioniert das Spiel im Arbeitsspeicher; Neuladen verliert dann den Stand. Alte V1- und 2.0-Sitzungen werden mit verständlicher Meldung zurückgesetzt, damit die geänderten Bildnummern keine falschen Erinnerungen übernehmen. Sitzungen aus 2.1 bleiben mit 2.2 kompatibel; alte Papiernotizen gehören zum alten Bildkatalog. Erste/zweite bestätigte Bildauswahl bleiben getrennt; Neustart setzt nur die gewählte Akte zurück. Papier sichert die Arbeit über Stunden/Geräte hinweg. Keine garantierte Offline-Neuladung: noch nicht geladene Ressourcen benötigen den eigenen Server. Keine Schülernamen im Spiel eingeben.

## Entwicklung und Prüfungen

```sh
npm ci
npm test
npm run test:e2e
TEST_WEBKIT=1 npm run test:e2e
npm run materials
npm run test:pdf
npm run audit:release
```

Playwright prüft Desktop, iPad quer/hoch und schmales Touch-Format; mit `TEST_WEBKIT=1` zusätzlich echtes WebKit unter Linux. Installation: `npx playwright install webkit`, erforderliche Systembibliotheken bereitstellen. Dies ersetzt keinen echten iPad-Safari-Test. PDF-Prüfung benötigt Python/pypdf; fertige Dateien sind enthalten.

`audit:release` endet mit **2**, solange dokumentierte menschliche, Quellen- oder Live-Abnahmen offen sind. Das ist getrennt von den technischen Tests. Den tatsächlich ausgeführten Stand und die Befehle nennt der [Testbericht](docs/testbericht.md).

## GitHub Pages und Übergabe

GitHub Pages bezieht weiterhin `feature/detektivspiel-komplett` und `/`. Dieser Quellbranch wird für 2.2 nicht verändert. Der neue Branch `fix/ermittlungszentrale-2-2-abnahme` wird nach Prüfung mit einem neuen Draft-PR gegen `main` veröffentlicht; die Freigabe dazu steht im [Auftrag 2.2](sources/auftrag-v2.2.md). Kein Merge oder Deployment durch diese Entwicklungsrunde. Der Nutzer entscheidet selbst über die Übernahme. `.nojekyll` und relative Pfade bleiben erhalten.

`index.html`, `css/`, `js/`, `data/`, `assets/` bilden die statische Anwendung. `materials/` enthält Druckdateien, `docs/` Quellen und Abnahme, `scripts/` Prüfwerkzeuge, `tests/` Node/Playwright, `sources/auftrag-v2.2.md` die unveränderte aktuelle Aufgabenreferenz; die Vorgänger bleiben erhalten.
