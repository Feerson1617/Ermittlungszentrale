# Tatsächlich geprüfter Stand – Version 2.2

Stand 21.10.2026. Branch `fix/ermittlungszentrale-2-2-abnahme`, Basis `origin/main` = `3a6274f`, vollständig übernommener 2.1-Stand = `b219afb` (lokale Übernahmekommitte `cf3b644`, `87c13c0`). Die nachgeführten 2.1-Änderungen waren vor 2.2 dateigenau mit dem bisherigen Entwicklungsbranch identisch. Der [Auftrag](../sources/auftrag-v2.2.md) erlaubt neuen Branch-Push und neuen Draft-PR ausdrücklich. Kein Merge und kein Push auf den Pages-Quellbranch.

[Manifest der geprüften Dateien](qa/v22/verified-files.sha256). Historische Ergebnisse: [2.1](testbericht-v21.md), [2.0](testbericht-v2.md); deren Testzahlen sind keine neuen 2.2-Ergebnisse.

## Ausgeführte Prüfungen

| Prüfung | Tatsächliches Ergebnis |
|---|---|
| `npm test` | **303/303 bestanden**, kein Fehler oder übersprungener Test. Einschließlich jeder fachlichen Antwortoption der unbewerteten Lernschritte, persönlicher Vermutung, kurzer Kernsätze, Material- und Bildschutz. |
| Vollständiges `TEST_WEBKIT=1 npm run test:e2e` | **290/290 bestanden**, 58 in jedem der fünf Profile, keine Wiederholungsversuche oder übersprungenen Fälle. |
| Gezielter neuer Ablauf vor Gesamtsuite | Acht neue Chromium-/WebKit-Fälle bestanden; danach vollständige Suite wiederholt. Wörterbuch-Schließen/Escape, Fokus, Zustands-/Punkteerhalt und alle zehn Lernschritte jeweils mit richtigen/falschen Antworten. |
| Neu gestarteter Node-Spielserver + `check:start` | Vier vollständige Browserdurchläufe: Root und Projektpfad, Desktop und iPad-Parameter. CSS, Motiv, alle fünf Akten, Hinweise/Punkte, Wörterbuch, Länder-/Lernweg und alle 24 Fotos. |
| Zwei unabhängige Python-HTTP-Server + `check:start` | Weitere vier vollständige Durchläufe unter Root/Projektpfad und Desktop/iPad, ohne Ressourcenmocks. |
| `npm run materials`, `npm run test:pdf` | Erfolgreich: zwei neutrale A4-Schülerseiten und 13 nummerierte A4-Lehrerseiten. Keine vorgegebene Erkenntnis aus Akte 002; getrennte Punktefelder und aktualisierter Titel geprüft. |
| `pdftoppm -scale-to 1050 -png` und Sichtung | Alle 15 Seiten digital gerendert und tatsächlich angesehen, einschließlich abschließender Neugenerierung. Keine abgeschnittenen Inhalte oder überlagerten Fußzeilen erkannt. Keine reale Druckprobe. |
| Zusätzlicher visueller Browserlauf | Desktop und iPad-Parameter: neue Bildtitel/Redaktionsfrage, richtige und falsche Rückmeldung, aufklappbare Grenzen, datierte Lagos-Karten, Satzanfänge und deutsche Wörterbuchhilfe bedient; keine Fehler. Startfehler separat bewusst simuliert und verständliche Browserhilfe erfasst. |
| `npm run media:credits`, Bild-/Quellenintegrität | Erfolgreich. Alle 24 bestehenden Fotodateien/-identitäten unverändert; kein neues Foto und keine neue Bildlizenz. Unterrichts- und Quellenunterlagen konsistent. |
| Kartenprüfsummen und `git diff --check` | Erfolgreich. |
| `npm run audit:release` | **Exit-Code 2, 20 offene Abnahmekategorien**. Bisher 19 plus ausdrücklich separat erfasster Schulnetztest. Keine kaputten Fotografien oder Quellenhashes. |

Protokolle: [Node](qa/v22/node-tests.txt), [Browser](qa/v22/browser-tests.txt), [gezielte Fälle](qa/v22/focused-tests.txt), [PDF](qa/v22/pdf-check.txt), [Audit](qa/v22/release-audit.txt), [visuelle Bedienung](qa/v22/visual-browser.txt).

Der erste Desktoplauf zeigte zwei veraltete Texterwartungen nach der Sprachänderung; diese wurden an die neuen tatsächlich angezeigten Formulierungen angepasst. Der neue Tastaturtest deckte zusätzlich auf, dass Escape bei gefülltem Suchfeld zunächst nicht schloss. Dafür wurde die explizite Escape-Behandlung ergänzt. Danach bestanden die gezielten Fälle und die vollständige Gesamtsuite. Keine Testfälle deaktiviert und keine CSP gelockert. Die zusätzlich wiederverwendeten älteren Python-Server lieferten zunächst leere HTTP-Antworten. Beide Server wurden unabhängig neu gestartet, danach bestanden sämtliche vier statischen Browserdurchläufe. Dafür wurde kein Anwendungscode geändert.

## Profile und Umgebung

| Profil | Browser / Viewport | Bestandene Fälle |
|---|---|---:|
| chromium-desktop | Chromium, 1440 × 1000 | 58 |
| chromium-ipad | Chromium, iPad-Parameter quer, 1080 × 810, Touch | 58 |
| chromium-ipad-portrait | Chromium, iPad-Parameter hoch, 810 × 1080, Touch | 58 |
| chromium-mobile | Chromium, schmales Touch-Format, 390 × 664 | 58 |
| webkit-ipad | Tatsächliches Linux-WebKit, iPad-Parameter quer, 1080 × 810 | 58 |

Node 24.19.0, npm 11.9.0, Playwright 1.58.2, Chromium 154, Playwright-WebKit 26 unter Debian 13. Verwendeter Befehl:

```sh
PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright \
LD_LIBRARY_PATH=/tmp/webkit-libs/usr/lib/x86_64-linux-gnu \
PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 \
TEST_WEBKIT=1 npm run test:e2e
```

Nur die Host-Vorprüfung wird wegen der lokal bereitgestellten Bibliotheken übersprungen; WebKit wurde tatsächlich ausgeführt. Kein echtes Schul-iPad. Auf neuem Rechner müssen Browser und Bibliotheken installiert werden.

Strenge Start-, V2- und V2.2-Abläufe überwachen JavaScript-/Konsolenfehler, HTTP-Fehler, fehlgeschlagene und fremde Anfragen. Sie bestanden ohne solche Fehler. WebKit-Screenshotinstrumentierung wird getrennt erfasst, da deren eigenes Inline-Stylesheet die echte CSP verletzen kann; keine Lockerung und kein Wegfiltern echter App-Fehler. Absichtlich simulierte Ressourcenfehler prüfen die Starthilfe gesondert.

## Regressionen und Sichtnachweise

- 2.1 vollständig erhalten: fünf Akten, drei Länder, zehn Lernschritte, zwölf identische Auswahlbilder, getrennte Auswahlen, 24 unveränderte Fotodateien, 30+5, 5/3/2/1, Teilauflösung, Namensklärung und Hinweise.
- Alle fachlichen Antwortoptionen liefern eine passende Erklärung, ohne Eingaben oder Wertungen zu verändern. Persönliche Vermutungen mit Ja/Nein/Unbekannt und Rückblick werden nie als falsch markiert. Richtige und falsche Lernwege, Neuladen in der Rückmeldung sowie gleichbleibende Auswahlen geprüft.
- Wörterbuch per Tastatur öffnen, über Schaltfläche und über Escape schließen, Fokus auf Auslöser, Antwort-/Punkteerhalt und deutsche Hilfe geprüft, auch unter WebKit. Keine neue Übersetzung oder menschliche Sprachfreigabe.
- Titel 9 exakt „Klassenraum mit Holztischen und Stühlen“, drei sichtbare Satzanfänge und freie Alternative, offene Sicherung ohne Lösungsverrat, getrennte Punktezellen, sichtbare Browserhilfe und exakter CSP-Hash geprüft.
- Lagos-Karten nennen die beiden tatsächlich geprüften Aufnahmeorte/-jahre; keine generischen Wasser-/Schul-/Einkommensbehauptungen in den Karten. [Quellenprüfung](lagos-quellen-v22.md).

| Ansicht | Nachweis |
|---|---|
| Bildkatalog / einfache Redaktionsfrage | [Katalog](qa/v22/desktop/bildkatalog.jpg), [Redaktion](qa/v22/desktop/redaktion-einfache-sprache.jpg) |
| Konkrete richtige und falsche Antwort | [Rückmeldung](qa/v22/desktop/antworten-richtig-falsch.jpg) |
| Kurzer Kern und ausführliche Grenzen | [Mehr erfahren](qa/v22/ipad/mehr-erfahren.jpg) |
| Eingegrenzter Lagos-Vergleich | [Datierte Karten](qa/v22/ipad/lagos-datierte-beobachtung.jpg) |
| Freier Rückblick | [Satzanfänge](qa/v22/ipad/satzanfaenge.jpg) |
| Deutsche Hilfe ohne erfundene Übersetzung | [Wörterbuch](qa/v22/ipad/woerterbuch-deutsche-hilfe.jpg) |
| Bewusst simulierter Ressourcenfehler | [Browserhilfe](qa/v22/start-hilfe-simulierter-fehler.jpg) |
| Neu gestartete Anwendung | [Menü](qa/v22/start-desktop.png), [geöffnete Akte](qa/v22/start-ipad-akte-001.png) |
| Druckmaterialien | Alle 15 Seiten unter `docs/qa/v22/pdf/` |

[Node-HTTP-Protokoll](qa/v22/start-http-node.json) und [statische Server](qa/v22/start-http-static.json): jeweils vier erfolgreiche Browserdurchläufe, ohne Konsolen-/Laufzeitfehler, Fehlanfragen oder externe Ressourcen. Bilder wurden im Spiel einschließlich freiwilliger Spuren dekodiert. Richtiger Serverstart und öffentliche Grenzen: [Vorschau](vorschau.md).

## Fachliche und menschliche Grenzen

Die erneut abgerufenen Commons-Bildrevisionen sichern Lagos Island 2016 und Makoko 2019. Sie liefern keine zusätzlichen örtlichen Daten zur Versorgung. UN-Habitat-/Weltbank-Startseiten waren am Proxy blockiert; kein Inhalt daraus als Quelle ausgegeben. Daher ausdrücklich die erlaubte Eingrenzung auf sichtbare Bebauung und Bildperspektiven, keine erfundenen Armuts-/Versorgungsangaben. Schüler und Lehrermaterial unterscheiden Bildbeobachtung und Herkunftsangabe.

Keine erzwungene Meinungsänderung, keine neue Akte oder Punkte. Sprachliche Überarbeitung ist redaktionell, kein Nachweis der Verständlichkeit für die tatsächliche Klasse. Echter Schul-iPad-Test, Schulnetz, sprachkundige Übersetzungskontrolle, realer beidseitiger Druck, Unterrichtserprobung und Zeitmessung bleiben offen. Zusätzlich bestehen die bekannten Originalquellen- und öffentlichen Browsergrenzen fort. [Abnahme](abnahme.md).

2.2 wird nur auf dem neuen PR-Branch veröffentlicht. Der bisherige Pages-Quellbranch und `main` bleiben unverändert; keine eigenständige Veröffentlichung auf Pages. Der neue PR bleibt Draft und offen.
