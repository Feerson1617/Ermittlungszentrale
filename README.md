# Die geheime Ermittlungszentrale 2.0

Geographie-Detektivspiel für Klasse 7: fünf unabhängig startbare Akten, Zweierteams, kurze Arbeitsschritte und Ergebnisse auf Papier. Statisches HTML/CSS/JavaScript; kein Build für das Spiel erforderlich.

Version 2.0 ergänzt den kurzen Lernweg um Industrie, Handel, eine Kakaokette, unterschiedliche Lebensbedingungen in derselben Stadt sowie Bildung/Gesundheit. Die sieben Wertungen bleiben bei **30 Hauptpunkten und fünf getrennten Bonuspunkten**. Film, Digitales, Energie und Logistik sind freiwillige „Weitere Spuren“. Die vollständige Umsetzung und Befundmatrix stehen in [Version 2.0](docs/v2-umsetzung.md).

**Abnahme:** lokal technisch geprüft; keine pauschale Unterrichtsfreigabe. Offen sind sprachkundige Prüfungen, echte iPad-Safari- und Druckprobe, Lerngruppenerprobung/Zeitmessung, direkte Originalabgleiche einzelner Sach-/Curriculumquellen sowie die öffentliche Live-Funktion. [Abnahmestatus](docs/abnahme.md), [Testbericht](docs/testbericht.md).

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

Der Prüfer öffnet das gestaltete Menü, alle fünf Akten, Wörterbuch und Länder-/Lernweg; alle 19 lokalen Fotos müssen dekodieren. Er kontrolliert Konsolenfehler, Anfragen, MIME-Typen und Punkte. Benötigt Chromium, hier `/usr/bin/chromium`; bei Bedarf `CHROMIUM_PATH` setzen.

## Akten und Bewertung

| Akte | Inhalt | Höchstens |
|---|---|---:|
| 001 | Kontinent aus vier Beweisfotos erschließen | 5 |
| 002 | Vier aus zwölf Motiven; Medienauswahl in vier geschlossenen Schritten prüfen | 5 |
| 003 | Marokko, Nigeria, Ghana; neun kurze unbewertete Belegschritte | 15 |
| 004 | Unabhängige zweite Auswahl, Rückblick und präzise Quellenüberschrift | 5 |
| 005 | Erfundene Nachrichten, reale Belegfotos und Zukunftsfragen | 5 Bonus |

Hinweise begrenzen auf 5/3/2/1 Punkte. Frühe Stufen erlauben je eine Gesamtabgabe; bei null Rohpunkten erst nach dem nächsten Hinweis erneut versuchen. Nach Hinweis 3 ist die vereinfachte Aufgabe beliebig oft versuchbar; erst die richtige Antwort ergibt einen Punkt. Entwürfe bleiben durch Hinweise 1/2 erhalten; die vereinfachte Antwort bleibt getrennt.

Positive Rohpunkte schreiben die Wertung fest. Fachliche Vollständigkeit wird unabhängig vom Punktelimit festgestellt: drei richtige Rohpunkte am Drei-Punkte-Limit sind weiterhin nur teilweise richtig. Offene Kriterien werden anschließend unbewertet korrigiert oder erklärt und bestätigt; keine Nachbepunktung. Rückkehr zur Zentrale ist jederzeit möglich, die offene Auflösung bleibt erkennbar. Fortsetzen erfordert Auflösung und Papierbestätigung. Persönliche Auswahlen, Vermutungen, Rückblicke, Begriffshilfen, Zoom und Wörterbuch werden nicht bewertet.

Explizite Namensvarianten und aufgabenspezifische Negationsregeln ersetzen keine allgemeine Sprach-KI. Unklare Namen werden neutral geklärt, ohne vorzeitig einen Versuch zu verbrauchen. „Afrika ist ein Land“ ist falsch; „Afrika ist kein Land, sondern ein Kontinent“ ist richtig. Keine pauschale unscharfe Ähnlichkeitssuche für Ländernamen.

## Bilder und Quellen

**19 echte Fotografien:** die bisherigen 15 bleiben erhalten; ergänzt sind Wasserversorgung in Kenia, ein Krankenhaus in Ruanda und zwei weitere Lagos-Perspektiven. Die Auswahlbilder 1–12 in Akte 002/004 stammen aus derselben zentralen Liste. Zusätzliche Beleg-IDs sind keine Auswahlbildnummern; bestehende Dateinamen bleiben erhalten.

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
- [Erwartungshorizont PDF](materials/erwartungshorizont.pdf), [HTML](materials/erwartungshorizont.html), [Markdown](docs/erwartungshorizont.md): elf Seiten mit Lösungen, Regeln, allen zwölf Bildnummern und Quellenstatus. Nicht aus der Schülernavigation verlinkt, im öffentlichen Projekt aber zugänglich.
- [Didaktischer Lernweg](docs/didaktisches-konzept.md): 90 Minuten als ungemessenes Planungsziel sowie Drei-Stunden-Alternative.

Schülerbogen mit 100 %, beidseitig an langer Kante drucken. Alle PDF-Seiten wurden digital gerendert; eine reale Druckprobe bleibt offen. Keine DOCX-Fassung; HTML bleibt bearbeitbar.

## Datenschutz und Speicherung

Keine Konten, Cookies, Datenbank, Analytics, Audio oder externe Übersetzungs-/Bewertungsdienste. Die App sendet keine Antworten an externe Dienste. Der statische Host kann Zugriffsprotokolle einschließlich IP-Adressen führen; keine pauschale schulische Datenschutzfreigabe.

`sessionStorage` ist optional. Ohne Speicher funktioniert das Spiel im Arbeitsspeicher; Neuladen verliert dann den Stand. Alte V1-Sitzungen werden mit verständlicher Meldung zurückgesetzt. Erste/zweite bestätigte Bildauswahl bleiben getrennt; Neustart setzt nur die gewählte Akte zurück. Papier sichert die Arbeit über Stunden/Geräte hinweg. Keine garantierte Offline-Neuladung: noch nicht geladene Ressourcen benötigen den eigenen Server. Keine Schülernamen im Spiel eingeben.

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

GitHub Pages veröffentlicht laut API automatisch aus `feature/detektivspiel-komplett` und `/`; `.nojekyll` und relative Pfade bleiben erhalten. Der Nutzer hat für Version 2.0 ausdrücklich **Push, Aktualisierung von PR #1 und Deployment** beauftragt. Es gibt keinen neuen PR, keinen Merge und keine Änderung der Pages-/Umgebungsberechtigungen. Ein erfolgreicher Pages-Build ist keine Live-Funktionsabnahme. Die öffentliche URL ist aus dieser Cloud bisher am Proxy-CONNECT gesperrt; es wird keine reparierte Codex-Webvorschau behauptet.

`index.html`, `css/`, `js/`, `data/`, `assets/` bilden die statische Anwendung. `materials/` enthält Druckdateien, `docs/` Quellen und Abnahme, `scripts/` Prüfwerkzeuge, `tests/` Node/Playwright, `sources/auftrag-v2.md` die unveränderte Aufgabenreferenz.
