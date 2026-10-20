# Testbericht

Prüfstand: 20.10.2026, nach Integration aller 15 Fotografien. Node.js 24.19.0, npm 11.9.0, Playwright 1.58.2, Chromium 154 und Playwright-WebKit 26.0 unter Debian 13. Die folgenden Durchläufe wurden tatsächlich ausgeführt; kein Test auf einem echten iPad wird behauptet.

| Prüfung | Ergebnis |
|---|---|
| `npm test` | **180/180 bestanden**, keine fehlgeschlagenen oder übersprungenen Tests |
| `TEST_WEBKIT=1 npm run test:e2e` mit den unten genannten Umgebungsvariablen | **63/63 bestanden**, je 21 unter Chromium/iPad, Chromium/iPhone und WebKit/iPad |
| `python3 scripts/prepare-media.py /tmp/approved-originals` | Alle 15 Originalrevisionen per SHA1 und SHA256 verifiziert, lokale WebP-Dateien reproduziert |
| `npm run media:credits` | Alle 15 Nachweise in HTML und Markdown erzeugt |
| `npm run materials` | Schülerbogen und aktualisierten Erwartungshorizont als HTML/PDF erzeugt; Seitenüberlauf geprüft |
| `npm run test:pdf` | Schülerbogen exakt zwei DIN-A4-Seiten, Erwartungshorizont sieben Seiten, alle Aufgaben/Punktfelder vorhanden |
| `sha256sum -c docs/kartendaten.sha256` | Ausgangsdaten unverändert und korrekt |
| `git diff --check` | Keine Whitespace-Fehler |
| `npm run audit:release` | **Exit-Code 2, zehn offene Abnahmepunkte**, ausschließlich Wörterbuch/Sprachprüfung und echter iPad-Safari-Test; keine offenen Bildpunkte |

## Bildprüfung

Alle 15 Fotos stammen von Wikimedia Commons. Für jedes Bild wurden Motiv, dokumentierter Aufnahmeort, Urheber, konkrete freie Lizenz samt Version, Attribution und Bearbeitung geprüft. Die Ortsgenauigkeit wird nicht über die Quelle hinaus behauptet. Lokale Commons-Antworten unter `docs/media/` sichern Beschreibung, Kategorien, Original-SHA1, Lizenzvorlage und Beschreibungsrevision. Die tatsächlichen Originaldownloads wurden vor der Optimierung mit diesen SHA1-Werten abgeglichen; `data/media.json` enthält zusätzlich SHA256 für Originale, WebP-Dateien und Quellenbelege.

Keine generierten Beweisfotos. Alle 15 ausgelieferten WebP-Dateien haben maximal 1400 × 1400 Pixel, mindestens 652 Pixel an der kürzeren Seite, jeweils weniger als 500 KiB und zusammen 2.975.140 Bytes (2,84 MiB). Keine externen Bildrequests. Auf dem Startbildschirm lädt kein Beweisfoto; Fotos werden erst beim Öffnen der Akte angefordert, kompakte Auswahlen zusätzlich bei Bedarf. Browserprüfungen kontrollieren nicht nur Dateipfade, sondern erfolgreiches Dekodieren und natürliche Bildbreite.

Die Auswahl wurde nach der Sichtprüfung korrigiert: Das Atlasbild zeigt deutlich Schnee, und das Kakaobild zeigt gut erkennbare Früchte am Baum. Atlas- und Kakaopunkt auf der Karte folgen den dokumentierten Aufnahmekoordinaten. Lagos Island ist durch die Autorbeschreibung belegt. Quellen-/Ortsnamen bleiben in Akte 001 vor der Lösung unsichtbar; neutrale Dateinamen und Bildbeschreibungen verraten den Kontinent nicht. Der Quellenlink wird bei anonymen Rätseln erst nach ihrer Lösung sichtbar. Akte 002 und 004 liefern für alle zehn Nummern identische Bildpfade und Beschreibungen.

Dokumentierte Alternativen: Kronendach-Luftaufnahme des Ituri-Regenwalds; Strand statt Küstenstadt auf Sansibar; Außenansichten von Ghacem und Cocoa Processing Company statt Innenansichten; abgeerntetes Hirsefeld in der Trockenzeit; historische Stadtansicht Nairobis; großes solarthermisches Kraftwerk mit Spiegeln statt kleiner Photovoltaikanlage. Das einzelne Feldbild beweist keine Missernte, das Stadtbild keinen Wachstumstrend. Die Alternativen passen zu den vorgesehenen vier Zukunftsthemen. Einzelbelege: `bildquellen.md`.

## Logik, Inhalt und Browserabläufe

Die bisherigen Bewertungs- und Inhaltstests bestehen weiter: alle sieben Wertungsaufgaben, Hinweislimits 5/3/2/1, Versuchssperren, unbegrenzte einfache Abschlussaufgaben nach Hinweis 3, Teilpunkte, Papierbestätigung, 30 Hauptpunkte und fünf getrennte Bonuspunkte. Schreibvarianten, Negationen, widersprüchliche/unklare Eingaben, Sitzungsneuladen und Betrieb ohne Browser-Persistenz sind abgedeckt. Wörterbuch mit 187 Begriffen, sieben Sprachen, RTL sowie vorhandenen und fehlenden Übersetzungen geprüft.

17 zusätzliche Node-Tests prüfen die 15 eindeutigen Dateien, WebP-Format, Bildbudget, Prüfsummen, vollständige Attribution, zulässige Lizenzversionen und Übereinstimmung mit den gesicherten Commons-Revisionen. Die drei zusätzlichen Browsertests pro Konfiguration prüfen bedarfsgerechtes Laden, identische Aktenkataloge, Ortsanonymität, alle drei Fotokartenrätsel, vier Zukunftsfotos und alle 15 Bilder auf der lokalen Nachweisseite.

Browserkonfigurationen: Chromium mit iPad-Querformat 1024 × 768 und Touch; Chromium mit iPhone-13-Hochformat 390 × 664 und Touch; WebKit mit iPad-Querformat 1024 × 768 und Touch. Testpfad jeweils `/Ermittlungszentrale/`. Kein horizontaler Überlauf, keine fehlgeschlagenen Bildabrufe, keine externen Requests und keine JavaScript-Laufzeitfehler in den Medientests. Die bestehenden Tests kontrollieren außerdem Touch-Ziele, Dialogfokus, Escape, Wörterbuchzustand und vergrößerbare Karten.

## Sichtprüfung

Alle fünf Akten mit neuen Bildern visuell angesehen, einschließlich aller drei Länderfälle in Akte 003: sieben Fotodarstellungen je Konfiguration. Sämtliche Motive bleiben durch `object-fit: contain` vollständig sichtbar. Nummern, Quellenkurzangaben, Karten, Eingaben und Auswahlzustände sind lesbar; keine überlagerten oder abgeschnittenen Bedienelemente gefunden. Auf schmalen Geräten laufen die Fotokarten untereinander; längere Ansichten benötigen vertikales Scrollen.

Reviewbare Übersichten der sieben Fotoansichten:

- [Chromium mit iPad-Parametern](qa/akten-chromium-ipad.jpg)
- [WebKit mit iPad-Parametern](qa/akten-webkit-ipad.jpg)

Die Übersichten sind verkleinerte Browseraufnahmen, kein Nachweis eines echten iPads. Original-Screenshots entstehen beim Test unter `test-results/`; der HTML-Bericht liegt unter `playwright-report/`. Beide Verzeichnisse bleiben Entwicklungsartefakte. Die Fotobestandteile der Übersichten behalten die Einzellizenzen aus `bildquellen.md`.

Das aktualisierte Lehrerdokument wurde erneut als PDF gerastert und die geänderte erste Seite visuell geprüft; keine abgeschnittenen Zeilen. Der Schülerbogen behält seine zwei Seiten und denselben Inhalt.

## WebKit-Umgebung

`PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright npx playwright install webkit` konnte WebKit 26.0 und FFmpeg herunterladen. Die fehlenden Debian-Bibliotheken wurden aus signierten Paketindizes heruntergeladen und unter `/tmp/webkit-libs` entpackt; keine Systeminstallation nötig. Der lokale WPE-Wrapper wurde um diesen Bibliothekssuchpfad ergänzt. Weil Playwrights Vorabprüfung dynamisch geladene Bibliotheken ausschließlich im Systemcache von `ldconfig` sucht, erkennt sie das lokal bereitgestellte GLES nicht. Nur diese Umgebungs-Vorabprüfung wurde abgeschaltet; der echte WebKit-Prozess und alle 21 WebKit-Funktionstests wurden ausgeführt.

Tatsächlich verwendeter vollständiger Browserbefehl:

```sh
PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright \
LD_LIBRARY_PATH=/tmp/webkit-libs/usr/lib/x86_64-linux-gnu \
PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 \
TEST_WEBKIT=1 npm run test:e2e
```

Diese lokale Einrichtung verändert keine Spielabhängigkeiten. Auf einem System mit regulär installierten Playwright-Bibliotheken genügt `TEST_WEBKIT=1 npm run test:e2e` nach der WebKit-Installation.

## Verbleibende Abnahme

`npm run audit:release` meldet zehn offene Punkte: 134 fehlende Kurmandschi- und 135 fehlende Sorani-Übersetzungen (zwei Meldungen), muttersprachliche Prüfung aller sieben Sprachen (sieben Meldungen) sowie Safari auf einem echten Schul-iPad (eine Meldung). `data/review.json` bleibt entsprechend unbestätigt. Kein Bild oder fehlender Wörterbucheintrag wurde erfunden. Der automatische WebKit-Lauf ersetzt den echten Gerätetest mit Touch, Bildschirmtastatur, Scrollen und PDF-Druck nicht.

GitHub-Ziel ist ausschließlich der vorhandene Branch `feature/detektivspiel-komplett` und dessen offener Draft-PR #1 gegen `main`. Kein zweiter PR, kein Merge und kein Deployment.
