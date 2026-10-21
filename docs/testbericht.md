# Testbericht

Prüfstand: 21.10.2026 (Gesamttests am 20.10., abschließender Servercheck am 21.10.), nach der Startkorrektur und Wörterbuchergänzung. Die Live-Seite ist noch nicht abgenommen; siehe [Vorschauprüfung](vorschau.md). Die Fotoabnahme aus Commit 5321c9c bleibt gültig; die 15 Fotos wurden in diesem Durchlauf nicht verändert. Node.js 24.19.0, npm 11.9.0, Playwright 1.58.2, Chromium 154 und Playwright-WebKit 26.0 unter Debian 13. Die folgenden Durchläufe wurden tatsächlich ausgeführt; kein Test auf einem echten iPad wird behauptet.

| Prüfung | Ergebnis |
|---|---|
| `npm test` | **192/192 bestanden**, keine fehlgeschlagenen oder übersprungenen Tests |
| `TEST_WEBKIT=1 npm run test:e2e` mit den unten genannten Umgebungsvariablen | **152/152 bestanden**, je 38 unter Chromium/Desktop, Chromium/iPad, Chromium/iPhone und WebKit/iPad |
| Separat gestarteter Node-Server + `npm run check:start -- …` | Vier erfolgreiche Läufe: Root/Projektpfad jeweils Desktop/iPad; sichtbares Menü, fünf Akten, 15 Fotos, Wörterbuch, Hinweise und Punkte |
| Unabhängige Python-HTTP-Server + `npm run check:start -- …` | Dieselben vier Prüfungen bestanden, ohne Anwendungserver-Routing |
| `npm run dictionary:report` (Wörterbuchdurchlauf) | Quellenbericht und lokale Statusseite aus den aktuellen Belegen erzeugt |
| Wörterbuchquellen | 353 vorhandene kurdische Werte einzeln belegt; versionierte FreeDict-/Roj-Downloads zusätzlich gegen die dokumentierten Hashes abgeglichen |
| `npm run materials` (Wörterbuchdurchlauf; Materialien seither unverändert) | Schülerbogen und aktualisierten Erwartungshorizont als HTML/PDF erzeugt; Seitenüberlauf geprüft |
| `npm run test:pdf` | Schülerbogen exakt zwei DIN-A4-Seiten, Erwartungshorizont sieben Seiten, alle Aufgaben/Punktfelder vorhanden |
| `sha256sum -c docs/kartendaten.sha256` | Ausgangsdaten unverändert und korrekt |
| `git diff --check` | Keine Whitespace-Fehler |
| `npm run audit:release` | **Exit-Code 2, zehn offene Abnahmepunkte**, 11 Kurmandschi-/10 Sorani-Lücken, sieben muttersprachliche Abnahmen und echter iPad-Safari-Test; keine offenen Bildpunkte oder beschädigten Quellenbelege |

## Startkorrektur und tatsächliche Auslieferung

Der bisherige Stand funktionierte auf dem korrekt gestarteten HTTP-Server bereits unter Root und Projektpfad. Fehlgeschlagene Module/CSS wurden jedoch von der bisherigen Fehlerbehandlung nicht erreicht; das konnte die Lademeldung dauerhaft stehen lassen. Jetzt laufen eine frühe, per CSP-Hash freigegebene Startüberwachung, konkrete JSON-Fehlerdiagnosen und ein 18-Sekunden-Zeitlimit. `/Ermittlungszentrale` ohne Slash wird mit HTTP 308 weitergeleitet. Die Spielmechanik und Inhaltsdaten wurden nicht geändert.

14 neue Browserfälle je Konfiguration prüfen echten Start unter beiden Pfaden, angewendetes CSS, Detektivmotiv, fünf sichtbare/bedienbare Akten, alle 15 im Spiel dekodierten Fotos, Wörterbuch und Hinweise/Punkte, Weiterleitung, sieben fehlerhafte Ressourcen-/Datenszenarien, drei hängende Abrufe und eine übergeordnete Skriptsperre. Ein zusätzlicher Node-Test sichert den exakten CSP-Hash. Erfolgsläufe prüfen auch die Browserkonsole und HTTP-/MIME-Fehler.

Der erste Gesamtlauf lieferte 150 bestandene und zwei fehlgeschlagene Fälle. Der Trace zeigte bei beiden WebKit-Startfällen eine CSP-Meldung durch Playwrights Screenshot-Vorbereitung (temporäres Inline-Stylesheet `body {}`). Die Konsolenprüfung erfolgt nun ohne diesen Screenshot-Eingriff; Fehler werden nicht herausgefiltert und die App-CSP wurde dafür nicht gelockert. Die zwei Fälle bestanden gezielt erneut; danach wurde der vollständige Browserlauf wiederholt.

Zusätzlich wurde `npm start` unabhängig vom Playwright-Testserver gestartet und mit `check:start` in Desktop/iPad bedient. Zwei unabhängig gestartete Python-Server prüfen außerdem statisches Hosting unter Root und Projektpfad. Diese Läufe starten keinen eigenen Testserver und mocken keine Ressourcen. Pro Lauf werden fünf Akten bedient, alle 15 Fotos im Spiel dekodiert, das Wörterbuch geöffnet und die Hinweis-/Punktevergabe geprüft. Nach Abschluss wurde der Node-Server neu gestartet und die Serverprüfung erneut ausgeführt. Sichtprüfung: [Desktop-Menü](qa/start-desktop.png), [iPad-Viewport-Menü](qa/start-ipad.png). Akte 001 wurde erfolgreich geöffnet und mit geladenen Fotos angesehen. Kein Bild stammt von einem echten iPad.

Die gemeldete URL ist GitHub Pages. Deren direkter Abruf ist vom Cloud-Proxy blockiert; Status/MIME/CSP dieser Live-URL und eine vollständige Codex-Portvorschau konnten nicht geprüft werden. Es wird keine reparierte öffentliche Vorschau behauptet. Laut GitHub-API veröffentlicht Pages automatisch den Entwicklungsbranch; die Startkorrektur bleibt deshalb vorerst lokal, um das Deployment-Verbot einzuhalten. Vollständige Befunde und reproduzierbare Alternativen: [Vorschauprüfung](vorschau.md).

## Wörterbuchergänzung und erneute Sprachprüfung

123 neue Kurmandschi- und 125 neue Sorani-Werte (248 insgesamt) mit überprüfbaren Einzelbelegen ergänzt. Abdeckung: 187/187 in Russisch, Ukrainisch, Polnisch, Türkisch und Arabisch; 176/187 Kurmandschi und 177/187 Sorani. 21 unbelegte Werte bleiben ausdrücklich null. Keine bloße Wortzahl-Füllung mit erfundenen Fachbegriffen, falschen Bedeutungen oder automatisierter Umschrift. Vollständige Einzelliste und Grenzen: [Wörterbuchprüfung](woerterbuch-pruefung.md).

Alle sieben Sprachfassungen wurden durch Codex redaktionell auf Bedeutung im Spiel, Wortform, Schrift und auffällige Mehrdeutigkeit geprüft. Das ist keine muttersprachliche oder professionelle Prüfung. Polnisch „alle“ um die nicht-männlich-personale Form *wszystkie* ergänzt; mehrdeutige deutsche Wörter erhalten eine Bedeutungshilfe. Arabische Verbalnomen, slawische Flexion sowie kurdische regionale/idiomatische Formen bleiben muttersprachlich zu prüfen. Die Daten-/Belegzuordnung ist per SHA256 gegen veraltete Abnahmeangaben abgesichert.

11 zusätzliche Node-Tests prüfen die Einzelnachweise, Dateibindung, erhaltene Lücken, Schriften/NFC, Trennung der kurdischen Varietäten und die Trennung von redaktioneller Prüfung und muttersprachlicher Abnahme. Drei zusätzliche Browserfälle je Projekt prüfen neue Begriffe in allen sieben Sprachen, RTL und Sprachkennungen, deutsche Bedeutungshilfen, bewusst fehlende Fachwörter, erhaltenen Ermittlungsstand und die lokale Quellen-/Statusseite. Nach Sichtprüfung wurde zusätzlich die Erreichbarkeit des Quellenlinks im gescrollten schmalen Dialog abgesichert; die neun Wörterbuchdurchläufe wurden gezielt erneut ausgeführt.

Wörterbuchdialog in Chromium/iPad, WebKit/iPad und schmalem Chromium-Viewport visuell angesehen: Sorani-Zeichen lesbar, RTL-Ausgabe korrekt, deutsche Bedeutungshilfe LTR, keine verdeckten Eingaben. Die schmale Dialogansicht benötigt vertikales Scrollen; der Quellenlink bleibt erreichbar. Reviewaufnahmen: [Chromium](qa/woerterbuch-chromium-ipad.jpg), [WebKit](qa/woerterbuch-webkit-ipad.jpg). Kein Screenshot stammt von einem echten iPad.

## Bildprüfung (unveränderter Bestand, Medien-Browsertests erneut bestanden)

Alle 15 Fotos stammen von Wikimedia Commons. Für jedes Bild wurden Motiv, dokumentierter Aufnahmeort, Urheber, konkrete freie Lizenz samt Version, Attribution und Bearbeitung geprüft. Die Ortsgenauigkeit wird nicht über die Quelle hinaus behauptet. Lokale Commons-Antworten unter `docs/media/` sichern Beschreibung, Kategorien, Original-SHA1, Lizenzvorlage und Beschreibungsrevision. Die tatsächlichen Originaldownloads wurden vor der Optimierung mit diesen SHA1-Werten abgeglichen; `data/media.json` enthält zusätzlich SHA256 für Originale, WebP-Dateien und Quellenbelege.

Keine generierten Beweisfotos. Alle 15 ausgelieferten WebP-Dateien haben maximal 1400 × 1400 Pixel, mindestens 652 Pixel an der kürzeren Seite, jeweils weniger als 500 KiB und zusammen 2.975.140 Bytes (2,84 MiB). Keine externen Bildrequests. Auf dem Startbildschirm lädt kein Beweisfoto; Fotos werden erst beim Öffnen der Akte angefordert, kompakte Auswahlen zusätzlich bei Bedarf. Browserprüfungen kontrollieren nicht nur Dateipfade, sondern erfolgreiches Dekodieren und natürliche Bildbreite.

Die Auswahl wurde nach der Sichtprüfung korrigiert: Das Atlasbild zeigt deutlich Schnee, und das Kakaobild zeigt gut erkennbare Früchte am Baum. Atlas- und Kakaopunkt auf der Karte folgen den dokumentierten Aufnahmekoordinaten. Lagos Island ist durch die Autorbeschreibung belegt. Quellen-/Ortsnamen bleiben in Akte 001 vor der Lösung unsichtbar; neutrale Dateinamen und Bildbeschreibungen verraten den Kontinent nicht. Der Quellenlink wird bei anonymen Rätseln erst nach ihrer Lösung sichtbar. Akte 002 und 004 liefern für alle zehn Nummern identische Bildpfade und Beschreibungen.

Dokumentierte Alternativen: Kronendach-Luftaufnahme des Ituri-Regenwalds; Strand statt Küstenstadt auf Sansibar; Außenansichten von Ghacem und Cocoa Processing Company statt Innenansichten; abgeerntetes Hirsefeld in der Trockenzeit; historische Stadtansicht Nairobis; großes solarthermisches Kraftwerk mit Spiegeln statt kleiner Photovoltaikanlage. Das einzelne Feldbild beweist keine Missernte, das Stadtbild keinen Wachstumstrend. Die Alternativen passen zu den vorgesehenen vier Zukunftsthemen. Einzelbelege: `bildquellen.md`.

## Logik, Inhalt und Browserabläufe

Die bisherigen Bewertungs- und Inhaltstests bestehen weiter: alle sieben Wertungsaufgaben, Hinweislimits 5/3/2/1, Versuchssperren, unbegrenzte einfache Abschlussaufgaben nach Hinweis 3, Teilpunkte, Papierbestätigung, 30 Hauptpunkte und fünf getrennte Bonuspunkte. Schreibvarianten, Negationen, widersprüchliche/unklare Eingaben, Sitzungsneuladen und Betrieb ohne Browser-Persistenz sind abgedeckt. Wörterbuch mit 187 Begriffen, sieben Sprachen, RTL sowie vorhandenen und fehlenden Übersetzungen geprüft.

17 zusätzliche Node-Tests prüfen die 15 eindeutigen Dateien, WebP-Format, Bildbudget, Prüfsummen, vollständige Attribution, zulässige Lizenzversionen und Übereinstimmung mit den gesicherten Commons-Revisionen. Die drei zusätzlichen Browsertests pro Konfiguration prüfen bedarfsgerechtes Laden, identische Aktenkataloge, Ortsanonymität, alle drei Fotokartenrätsel, vier Zukunftsfotos und alle 15 Bilder auf der lokalen Nachweisseite.

Browserkonfigurationen: Chromium/Desktop 1440 × 1000; Chromium mit iPad-Querformat 1080 × 810 und Touch; Chromium mit iPhone-13-Hochformat 390 × 664 und Touch; WebKit mit iPad-Querformat 1080 × 810 und Touch. Starttests unter `/` und `/Ermittlungszentrale/`, übrige Fälle unter dem Projektpfad. Kein horizontaler Überlauf, keine fehlgeschlagenen Bildabrufe, keine externen Requests und keine JavaScript-Laufzeitfehler in den Medientests. Die bestehenden Tests kontrollieren außerdem Touch-Ziele, Dialogfokus, Escape, Wörterbuchzustand und vergrößerbare Karten.

## Sichtprüfung

Alle fünf Akten mit neuen Bildern visuell angesehen, einschließlich aller drei Länderfälle in Akte 003: sieben Fotodarstellungen je Konfiguration. Sämtliche Motive bleiben durch `object-fit: contain` vollständig sichtbar. Nummern, Quellenkurzangaben, Karten, Eingaben und Auswahlzustände sind lesbar; keine überlagerten oder abgeschnittenen Bedienelemente gefunden. Auf schmalen Geräten laufen die Fotokarten untereinander; längere Ansichten benötigen vertikales Scrollen.

Reviewbare Übersichten der sieben Fotoansichten:

- [Chromium mit iPad-Parametern](qa/akten-chromium-ipad.jpg)
- [WebKit mit iPad-Parametern](qa/akten-webkit-ipad.jpg)

Die Übersichten sind verkleinerte Browseraufnahmen, kein Nachweis eines echten iPads. Original-Screenshots entstehen beim Test unter `test-results/`; der HTML-Bericht liegt unter `playwright-report/`. Beide Verzeichnisse bleiben Entwicklungsartefakte. Die Fotobestandteile der Übersichten behalten die Einzellizenzen aus `bildquellen.md`.

Das aktualisierte Lehrerdokument wurde erneut als PDF gerastert und die geänderte erste Seite visuell geprüft; keine abgeschnittenen Zeilen. Der Schülerbogen behält seine zwei Seiten und denselben Inhalt.

## WebKit-Umgebung

`PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright npx playwright install webkit` konnte WebKit 26.0 und FFmpeg herunterladen. Die fehlenden Debian-Bibliotheken wurden aus signierten Paketindizes heruntergeladen und unter `/tmp/webkit-libs` entpackt; keine Systeminstallation nötig. Der lokale WPE-Wrapper wurde um diesen Bibliothekssuchpfad ergänzt. Weil Playwrights Vorabprüfung dynamisch geladene Bibliotheken ausschließlich im Systemcache von `ldconfig` sucht, erkennt sie das lokal bereitgestellte GLES nicht. Nur diese Umgebungs-Vorabprüfung wurde abgeschaltet; der echte WebKit-Prozess und alle 38 WebKit-Funktionstests wurden ausgeführt.

Tatsächlich verwendeter vollständiger Browserbefehl:

```sh
PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright \
LD_LIBRARY_PATH=/tmp/webkit-libs/usr/lib/x86_64-linux-gnu \
PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 \
TEST_WEBKIT=1 npm run test:e2e
```

Diese lokale Einrichtung verändert keine Spielabhängigkeiten. Auf einem System mit regulär installierten Playwright-Bibliotheken genügt `TEST_WEBKIT=1 npm run test:e2e` nach der WebKit-Installation.

## Verbleibende Abnahme

`npm run audit:release` meldet zehn offene Punkte: 11 fehlende Kurmandschi- und 10 fehlende Sorani-Übersetzungen (zwei Meldungen), muttersprachliche Prüfung aller sieben Sprachen (sieben Meldungen) sowie Safari auf einem echten Schul-iPad (eine Meldung). Die sieben muttersprachlichen Einträge und Safari in `data/review.json` bleiben unbestätigt. Die neue hashgebundene `dictionaryEditorial`-Prüfung ist davon getrennt und behauptet keine Muttersprachlerbeteiligung. Kein Bild oder fehlender Wörterbucheintrag wurde erfunden. Der automatische WebKit-Lauf ersetzt den echten Gerätetest mit Touch, Bildschirmtastatur, Scrollen und PDF-Druck nicht.

GitHub-Ziel ist ausschließlich der vorhandene Branch `feature/detektivspiel-komplett` und dessen offener Draft-PR #1 gegen `main`. Kein zweiter PR und kein Merge. Der Push der Startkorrektur bleibt wegen der automatischen Pages-Veröffentlichung aus dem Entwicklungsbranch zunächst aus; Details in `vorschau.md`.
