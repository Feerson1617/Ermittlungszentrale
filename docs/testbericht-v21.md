# Tatsächlich geprüfter Stand – Version 2.1

21.10.2026, Branch `feature/detektivspiel-komplett`, Ausgangsstand `d8a4c4cdbfa51f059bcca362cbccef31719d4c86`. Die geprüften Dateien sind im [SHA256-Manifest](qa/v21/verified-files.sha256) festgehalten. Nach lokaler Prüfung und ausdrücklicher neuer Nutzerfreigabe wurde Implementierungscommit `e422525` gepusht, ohne Merge. Das SHA256-Manifest der geprüften Anwendung bleibt unverändert gültig. Der [V2-Testbericht](testbericht-v2.md) bleibt als historischer Befund erhalten und wird nicht als neues Testergebnis ausgegeben.

Node 24.19.0, npm 11.9.0, Playwright 1.58.2, Chromium 154, tatsächliches Playwright-WebKit 26.0 unter Debian 13. Keine echte iPad-, muttersprachliche, Druck- oder Unterrichtsprüfung wird behauptet.

## Frisch ausgeführte Prüfungen

| Befehl / Prüfung | Tatsächliches Ergebnis |
|---|---|
| `npm test` | **254/254 bestanden**, keine Fehler oder übersprungenen Tests. Logik, Punkte, Inhalte, Belege, Wörterbuch, Sitzung und Start-CSP. |
| `TEST_WEBKIT=1 npm run test:e2e` mit Umgebung unten | **270/270 bestanden**, 54 Fälle in jedem der fünf Profile; keine übersprungenen Fälle und keine Wiederholungsversuche. |
| Neu gestartetes `npm start` und `check:start` | Vier erfolgreiche Läufe: Root/Projektpfad jeweils Desktop/iPad. Gestaltetes Menü, Motiv, fünf bedienbare Akten, Wörterbuch, Hinweise/Punkte, Länder-/Belegweg und 24 dekodierte Fotografien. |
| Zwei unabhängige Python-HTTP-Server mit `check:start` | Weitere vier erfolgreiche Läufe: Root und Projektpfad jeweils Desktop/iPad, gleicher vollständiger Ablauf ohne Ressourcenmocks. |
| `npm run dictionary:report` | Erfolgreich; Bestand und Quellenhashes konsistent, weiterhin 197 Begriffe und 32 leere Werte. |
| `npm run media:credits` | 24 konsistente lokale Bildnachweise, einschließlich zusätzlicher belegter PD-Lizenzgrundlage. |
| Medienreproduktion in separater Kopie | Alle 24 Originale gegen dokumentierte SHA1/SHA256 geprüft; alle 24 WebP-Ableitungen mit unverändertem Optimierungsskript bytegleich reproduziert. 19 Bestandsfotos/Quellidentitäten unverändert. |
| `npm run materials`, `npm run test:pdf` | Erfolgreich: zwei neutrale Schülerseiten und 13 Lehrerseiten, A4, Seitenzahlen, zwölf Katalogzeilen, neue Motive, Lizenzgrundlage und vier Beleg-Rückbezüge geprüft. Schüler-Überlaufprüfung bestanden. |
| PDF-Rendering und Sichtung | Sämtliche 15 Seiten mit `pdftoppm -scale-to 1050 -png` digital gerendert und angesehen; keine abgeschnittenen Inhalte oder überlagerten Fußzeilen erkannt. |
| `sha256sum -c docs/kartendaten.sha256`, `git diff --check` | Erfolgreich. |
| `npm run audit:release` | **Exit-Code 2, 19 offene Abnahmekategorien**. Keine kaputten Bilddateien, ungültigen Quellenhashes, fehlenden Fotografien oder fehlgeschlagenen technischen Tests. |

Protokolle: [Node](qa/v21/node-tests.txt), [Browser](qa/v21/browser-tests.txt), [HTTP Node](qa/v21/node-start.txt), [HTTP statisch](qa/v21/static-start.txt), [PDF](qa/v21/pdf-check.txt), [Audit](qa/v21/release-audit.txt), [Medienreproduktion](qa/v21/media-reproduction.txt).

Der erste Desktoplauf fand zwei veraltete Testannahmen: Großschreibung des bisherigen Reflexionssatzes und nicht existierende, im neuen Test angenommene Bestandsdateinamen. Die Erwartungen wurden an die tatsächliche unveränderte Funktion/Dateinamen angepasst. Der dokumentierte Schlusslauf wiederholt alle 270 Fälle vollständig nach diesen Korrekturen. Zusätzliche PDF-Prüfung behandelt einen legitimen Zeilenumbruch im Lizenzkürzel. Keine Browserprüfung wurde übersprungen oder CSP gelockert.

## Browserprofile

| Profil | Browser / Viewport | Bestandene Fälle |
|---|---|---:|
| chromium-desktop | Chromium, 1440 × 1000 | 54 |
| chromium-ipad | Chromium, iPad-Parameter quer, 1080 × 810, Touch | 54 |
| chromium-ipad-portrait | Chromium, iPad-Parameter hoch, 810 × 1080, Touch | 54 |
| chromium-mobile | Chromium, iPhone-Parameter, 390 × 664, Touch | 54 |
| webkit-ipad | Echtes WebKit unter Linux, iPad-Parameter quer, 1080 × 810, Touch | 54 |

```sh
PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright \
LD_LIBRARY_PATH=/tmp/webkit-libs/usr/lib/x86_64-linux-gnu \
PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 \
TEST_WEBKIT=1 npm run test:e2e
```

Browserbibliotheken waren lokal vorhanden. Nur die Host-Vorprüfung wird übersprungen, weil Bibliotheken außerhalb des globalen Loader-Verzeichnisses liegen; der WebKit-Prozess wurde tatsächlich ausgeführt. Ein frischer Rechner benötigt Browserinstallation und Bibliotheken. Dies ist kein echter Safari-Test auf dem Schul-iPad.

WebKit-Screenshotinstrumentierung kann ein eigenes Inline-Stylesheet einfügen, das die reale CSP zurückweist. Deshalb enthalten strenge Konsolen-/Netzwerkprüfungen keine Screenshotinstrumentierung; Ansichten werden separat erfasst. Die strengen neuen V2.1-Abläufe überwachen Konsolenfehler, JavaScript-Fehler, HTTP-Fehler, fehlgeschlagene und fremde Anfragen und bestanden ohne solche Einträge. Absichtlich simulierte Startfehler zeigen dagegen die erwartete Starthilfe.

## Neue und erhaltene Regressionen

- Alle 19 bisherigen Fotos mit Dateinamen, Hash, Quellrevision, Urheber, Lizenz und Ortsidentität gegen V2-Fixture geprüft; alle bleiben im Spiel erreichbar. Nur Auswahlidentitäten 7/8/9/11/12 ausgetauscht. Zwölf identische Nummern, Titel und Dateien in Akte 002/004.
- Persönliche Viererwahl und Papierbestätigung vor den sechs Redaktionsbehauptungen; keine Behauptungen vorab, keine neuen Belege schon in Akte 002. Redaktion ausdrücklich erfunden, Behauptungen ausdrücklich keine Tatsachen. Ihre Fotos genau 2/5/7/11.
- Alle vier Kombinationen aus 8/10 als Bergbau/Handel und 9/12 als Lern-/Behandlungsort ergeben fünf Rohpunkte. Andere fehlende Bilder zählen nicht automatisch. Hinweislimits, reguläre Gesamtabgabe, unvollständige Antworten, frühe Sperre und vereinfachter Abschluss bleiben geprüft.
- Drei Länder und zehn unbewertete Belegschritte; vier Rückbezüge greifen alle sechs Behauptungs-IDs auf und verändern weder Punkte noch Aufgabenstände. Klinikdichte bleibt ausdrücklich ungeklärt. Wassertragen und -speichern belegen keine Wasserqualität.
- Unveränderte erste/zweite Viererwahl zulässig und getrennt wiederherstellbar. Alte 2.0-Sitzungen werden wegen geänderter Fotoidentitäten mit verständlicher Meldung zurückgesetzt. V1, strukturell beschädigte Lernphasen, gesperrter Speicher, Neustart nur einer Akte bleiben geprüft.
- Public-Domain-Sonderfall verlangt tatsächlichen Dateiwikitext, US-Regierungs-Lizenzprüfung, gesicherte Lizenzvorlage und passenden Hash. Fehlender, manipulierter oder unzutreffender Nachweis wird verworfen.
- T1–T4 und D1/D2 aus V2 erhalten: historische Freitext-Fixture; geschlossene Gesamtabgabe; Teilpunkte getrennt von fachlicher Vollständigkeit; begrenzte unbezahlte Korrektur/Bestätigung; Entwurfserhalt; aufgabenspezifische Negation und neutrale Namensklärung; stabile Bonus-IDs und getrennte Bonuspunkte.
- Sichtbarer vierstufiger Kakaoweg, freiwillige Spuren, kostenloser Zoom, Fokus-Rückgabe, keine verschachtelten Buttons, lesbare Karten, Wörterbuch mit sieben Sprachen/RTL, Touch-Ziele und Dialoge weiterhin geprüft.
- Vollständiger HTTP-Start unter `/` und `/Ermittlungszentrale/`: Lademeldung verschwindet, CSS-Werte stimmen, Motiv und fünf Schaltflächen sichtbar/bedienbar. Fehlerhafte, fehlende oder hängende CSS-/Modul-/JSON-Abrufe sowie übergeordnete Skriptsperre bleiben abgedeckt.

## Tatsächlicher Serverstart und Sichtprüfung

Nach Ende der Gesamtsuite den laufenden Node-Spielserver beendet und `npm start` neu gestartet. Beide Pfade anschließend im Browser geöffnet, vollständiges Menü gesehen, Akte 001 geöffnet und danach sämtliche Akten sowie Länder-/Belegweg bedient. Der Server auf Port 4173 bleibt verfügbar, solange Prozess und Cloud-Umgebung laufen. Keine Abhängigkeit vom automatischen Playwright-Testserver.

[HTTP-Protokoll Node](qa/v21/start-http-node.json) und [unabhängige statische Server](qa/v21/start-http-static.json): jeweils vier erfolgreiche Läufe mit **38 Antworten pro Lauf**, passenden MIME-Typen und leeren JavaScript-/Konsolenfehler-, Fehlanfrage- und Fremdanfragelisten. Alle 24 Fotos tatsächlich im Spiel dekodiert, einschließlich freiwilliger Küstenspur. [Menü Desktop](qa/v21/start-desktop.png), [Menü iPad-Parameter](qa/v21/start-ipad.png), [geöffnete Akte](qa/v21/start-ipad-akte-001.png).

Neue Screenshots tatsächlich angesehen: sämtliche Akten, drei Fotokartenfälle, neue Motive, Redaktion, vier Beleg-Rückbezüge, Kakaoweg und freiwillige Küste; zusätzlich geänderte Ansichten quer/hoch, schmal und unter WebKit. Keine abgeschnittenen Fotos oder horizontaler Überlauf erkannt. Archivierte Browserbilder sind platzsparend als JPEG (Qualität 85, gleiche Abmessungen) gespeichert; originale PNGs bleiben in lokalen Playwright-Artefakten. PDF-Renderings bleiben PNG.

| Ansicht | Nachweis |
|---|---|
| Neue zwölf Motive | [Desktop](qa/v21/desktop/akte-002.jpg), [Hochformat](qa/v21/portrait/akte-002.jpg) |
| Erfundene Redaktion | [Desktop](qa/v21/desktop/akte-002-redaktion.jpg), [Tablet quer](qa/v21/ipad/akte-002-redaktion.jpg) |
| Neue Belege: Arbeiten / Wohnen | [Arbeiten](qa/v21/desktop/akte-003-neue-beweise-city-trade.jpg), [Wohnkontext](qa/v21/desktop/akte-003-neue-beweise-city-context.jpg) |
| Neue Belege: Bildung/Medizin / Wasser | [Bildung/Medizin](qa/v21/ipad/akte-003-neue-beweise-education-health.jpg), [Wasser](qa/v21/desktop/akte-003-neue-beweise-water-access.jpg), [WebKit](qa/v21/webkit/akte-003-neue-beweise-water-access.jpg) |
| Unveränderter Zwölferkatalog in Akte 004 | [Zweite Auswahl](qa/v21/desktop/akte-004.jpg) |
| Materialien | Alle Seiten unter `docs/qa/v21/pdf/` |

**Öffentliche Live-Funktion weiterhin nicht geprüft:** Der erneute normale HTTPS-Abruf endet am Egress-Proxy-CONNECT mit 403, Curl 56, Ziel-HTTP 000 ([Protokoll](qa/v21/live-access.txt)). Das ist keine HTTP-403-Seite von Pages. Kein bedienbarer Codex-Portweiterleitungsendpunkt verfügbar; keine reparierte öffentliche Codex-Webvorschau behauptet. Die tatsächlich bedienten Node-/Python-Server sind die funktionierende lokale Alternative. Nach Freigabe wurde 2.1 auf den Pages-Quellbranch gepusht; eine erfolgreiche Veröffentlichung ist kein Live-Funktionsnachweis.

## Offene Abnahmen und GitHub

19 Audit-Kategorien: sechs Sprachlücken (32 Werte), sieben sprachkundige Abnahmen, echtes iPad/Safari sowie Curriculum-Originale, direkte Sachquellen-Originale, reale Druckprobe, Lerngruppe/Zeit/Lernwirkung und öffentliche Live-Browserfunktion. Fachliche Aussagegrenzen der Fotos bleiben ausdrücklich benannt. [Abnahme](abnahme.md), [Umsetzung](v21-umsetzung.md).

Die reine GitHub-Lesekontrolle stellte fest: **PR #1 bereits gemergt/geschlossen**, 21.10.2026 09:08:09 UTC, Merge-Commit `3a6274f`; Remote-Entwicklungsbranch nach Freigabe auf Implementierungscommit `e422525` aktualisiert. `main` enthält denselben Anwendungsbaum wie die Ausgangsbasis. [API-Befund](qa/v21/github-readonly.json). Die nach Auftrag Abschnitt 12 erforderliche Freigabe wurde ausdrücklich erteilt. Implementierungscommit `e422525` wurde gepusht; `main` ist unverändert. Kein neuer PR und kein Merge. Der vorhandene Pages-Build startet automatisch; der geschlossene PR wird dadurch nicht aktualisiert.
