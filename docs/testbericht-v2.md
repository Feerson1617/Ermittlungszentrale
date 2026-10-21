# Tatsächlich geprüfter Stand – Version 2.0

21.10.2026. Geprüfte Implementierung: **`c213e9fcb96d07a8830838e1a4b6881b5cedf62b`**, ausgehend von `ede9a89234c880bb81f7a4d1f64d6a9f741b101c`, Branch `feature/detektivspiel-komplett`. Nachfolgende Übergabedokumentation ändert die Anwendung nicht. [SHA256-Manifest der geprüften Dateien](qa/v2/verified-files.sha256). Node 24.19.0, npm 11.9.0, Playwright 1.58.2, Chromium 154, tatsächliches Playwright-WebKit 26.0 unter Debian 13. Keine echte iPad-, muttersprachliche oder Unterrichtsprüfung wird behauptet.

## Frisch ausgeführte Prüfungen

| Befehl / Prüfung | Tatsächliches Ergebnis |
|---|---|
| `npm test` | **238/238 bestanden**, keine Fehler oder übersprungenen Tests. Logik, historische Freitext-Fixture, neue Kriterien, Sitzung, Inhalte, Wörterbuch-/Bildbelege, Start-CSP. |
| `TEST_WEBKIT=1 npm run test:e2e` mit untenstehender Umgebung | **250/250 bestanden**, 50 Fälle in jedem der fünf Profile; keine übersprungenen Fälle oder Wiederholungsversuche. |
| Separat neu gestartetes `npm start` und `check:start` | Vier erfolgreiche Läufe: Root/Projektpfad jeweils Desktop/iPad. Menü/CSS/Motiv, alle Akten, Wörterbuch, Hinweise/Punkte, kompletter Länder-/Belegweg und 19 dekodierte Fotos. |
| Zwei unabhängige Python-HTTP-Server und `check:start` | Weitere vier erfolgreiche Läufe: Root und Projektpfad jeweils Desktop/iPad. Keine gemockten Ressourcen oder spezieller App-Testserver. |
| `npm run dictionary:report` | Erfolgreich; 197 Begriffe, alle Quellenhashes konsistent, Lücken und menschliche Abnahmen offen. |
| `npm run media:credits` | 19 konsistente lokale Nachweise erzeugt. |
| `python3 scripts/prepare-media.py /tmp/approved-originals` | Alle 19 Originale per SHA1/SHA256 geprüft und Ableitungen reproduziert. Alle 15 Bestandsbilder bleiben bytegleich. |
| `npm run materials`, `npm run test:pdf` | Erfolgreich: zwei neutrale Schülerseiten, elf Lehrerseiten, A4, Seitenzahlen, zwölf nummerierte Tabellenzeilen und Inhalte geprüft. |
| Vollständiges PDF-Rendering und Sichtprüfung | Sämtliche 13 Seiten mit `pdftoppm -r 100 -png` gerendert, tatsächlich angesehen; kein Beschnitt/Überlauf erkannt. Keine reale Druckprobe. |
| `sha256sum -c docs/kartendaten.sha256`, `git diff --check` | Erfolgreich. |
| `npm run audit:release` | Erwarteter **Exit-Code 2 mit 19 offenen Kategorien**. Keine kaputten Dateien, Quellenhashes oder fehlenden Fotografien. Die offenen Abnahmen sind unten getrennt ausgewiesen. |

Vollständige aktuelle Protokolle: [Node](qa/v2/node-tests.txt), [Browser](qa/v2/browser-tests.txt), [PDF](qa/v2/pdf-check.txt), [Audit](qa/v2/release-audit.txt), [Medienreproduktion](qa/v2/media-reproduction.txt). Frühere Testzahlen 192/152 werden nicht als neue V2-Ergebnisse ausgegeben. Ein erster V2-Lauf mit 245 Browserfällen bestand ebenfalls; die finale Zahl 250 stammt aus der vollständigen Wiederholung nach dem sichtbaren Kakaoschema und dessen zusätzlicher Regression.

## Browserprofile und Umgebung

| Profil | Browser / Viewport | Fälle |
|---|---|---:|
| chromium-desktop | Chromium, 1440 × 1000 | 50 |
| chromium-ipad | Chromium, iPad-Parameter quer, 1080 × 810, Touch | 50 |
| chromium-ipad-portrait | Chromium, iPad-Parameter hoch, 810 × 1080, Touch | 50 |
| chromium-mobile | Chromium, iPhone-Parameter, 390 × 664, Touch | 50 |
| webkit-ipad | Echtes WebKit unter Linux, iPad-Parameter quer, 1080 × 810, Touch | 50 |

```sh
PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright \
LD_LIBRARY_PATH=/tmp/webkit-libs/usr/lib/x86_64-linux-gnu \
PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 \
TEST_WEBKIT=1 npm run test:e2e
```

Die benötigten WebKit-Bibliotheken wurden in dieser Cloud bereits lokal bereitgestellt. Nur die Host-Vorprüfung wird übersprungen, weil die Bibliotheken außerhalb des globalen Loader-Verzeichnisses liegen; der Browserprozess selbst wurde tatsächlich ausgeführt. Die Werte sind umgebungsspezifisch. Ein frischer Rechner braucht Browserinstallation/Systembibliotheken. Linux-WebKit ist kein Safari-Test auf einem echten iPad.

WebKit-Screenshotvorbereitung kann ein eigenes Inline-Stylesheet einfügen, das die reale CSP zurückweist. Deshalb enthalten die strengen Konsolen-/Netzwerk-Startprüfungen keine Screenshotinstrumentierung; Ansichten werden separat erfasst. Weder CSP gelockert noch echte App-Fehler weggefiltert. In den ungestörten Start- und V2-Abläufen waren die überwachten Konsolen-, Ressourcen- und externen Requestlisten leer. Absichtlich simulierte Startfehler müssen dagegen eine verständliche Fehlermeldung zeigen.

## Welche Regressionen tatsächlich geprüft werden

- T1: historische Formulierungen bleiben in einer getrennten V1-Fixture nachvollziehbar. Die Anwendung verwendet vier geschlossene Teilfragen mit genau einer Gesamtabgabe; fehlende Felder verbrauchen keinen Versuch.
- T2/D1: drei Rohpunkte bei einem Hinweis ergeben drei festgeschriebene Punkte, bleiben fachlich teilweise richtig. Richtige Kriterien, einmalige unbezahlte Korrektur, Erklärung/Bestätigung nach Fehlkorrektur, keine Nachbepunktung, Navigation/Reload und Papierbestätigung geprüft. Entsprechende Bonus-Teilauflösung geprüft.
- T3: fokussierter Wert auch ohne künstlich ausgelöstes Input-Ereignis durch Hinweis/Dialog erhalten; normale und vereinfachte Entwürfe getrennt.
- T4: „Afrika ist ein Land“ falsch, „Afrika ist kein Land, sondern ein Kontinent“ richtig, „Afrika Land?“ neutral geklärt. Länderregeln unterscheiden Land/Kontinent gesondert. Bekannte Aliasse bleiben erhalten; keine allgemeine Fuzzy-Suche.
- D2: sieben vereinfachte Aufgaben mit wechselnden festen korrekten Positionen; Bonus nach stabilen Kennungen trotz veränderter Optionsreihenfolge. Rohpunkte 0/1/2/3/5 geprüft.
- M1/M2: ganzer Schülerbogen ohne Afrika/Africa/Lösungsländer; zwei A4-Seiten. Datenbasierte Tabelle 1–12 in MD/HTML/PDF, Extra-Belege getrennt, alle Lehrerseiten nummeriert.
- Vollständiger Akte-003-Weg: drei Länderwertungen und neun unbewertete Schritte, Quellen-/Datierungsgrenzen und sichtbares vierstufiges Kakaoschema. Weitere Spuren freiwillig und ohne Punkte. Kein Ende nach den drei Länderfragen allein.
- Zwölf identische Motive/Dateien in Akte 002/004, getrennte bestätigte Auswahlen, Reset nur der aktuellen Akte, unabhängiger Start von Akte 004 ohne erfundene frühere Auswahl oder vorgegebene Nullpunkte.
- Separater Fotozoom, keine verschachtelten Buttons, Fokus-Rückgabe, lesbare Karten, RTL, Dialoge, gesperrter Speicher, V1-Rücksetzinformation und strukturell beschädigter Sitzungsstand.
- Echter sichtbarer HTTP-Start unter beiden Pfaden: Lademeldung verschwindet, CSS-Werte stimmen, alle fünf Schaltflächen/Motiv sind sichtbar und bedienbar. CSS-/Modul-/JSON-Fehler, MIME-Probleme, hängende Abrufe und übergeordnete Skriptsperre bleiben abgedeckt.

## Sichtprüfung und reale Ladebedingungen

Nach Ende der Tests den alten Node-Prozess beendet, **`npm start` neu gestartet** und beide Pfade erneut im Browser geöffnet. Ein vollständiges Spielmenü erschien, Akte 001 wurde geöffnet; anschließend alle fünf Akten und der Länder-/Belegweg bedient. Der Server bleibt auf Port 4173 verfügbar, solange die Cloud-Umgebung und der Prozess laufen.

[HTTP-/Konsolenprotokoll Node](qa/v2/start-http-node.json) und [unabhängige statische Server](qa/v2/start-http-static.json): je vier erfolgreiche Läufe mit jeweils leeren Fehler-, Fehlanfrage- und Fremdanfragelisten; 33 Antworten je Lauf mit dokumentierten MIME-Typen. [Node-Startlog](qa/v2/node-start.txt), [statisches Startlog](qa/v2/static-start.txt). Alle 19 Fotografien wurden im Spiel dekodiert, nicht nur auf der Quellenseite.

[Neu gestartetes Menü Desktop](qa/v2/start-desktop.png), [iPad-Viewport](qa/v2/start-ipad.png), [geöffnete Akte 001](qa/v2/start-ipad-akte-001.png). Weitere tatsächlich gesichtete Ansichten: alle fünf Akten, drei Fotokartenfälle, neue Belegschritte, Tabletvergleich, Kakaoschema, offene/abgeschlossene Teilauflösung, Wörterbuch/RTL sowie Hoch- und schmale Ansicht unter `docs/qa/v2/{desktop,ipad,portrait,mobile,webkit}/`. Beispiel: [Teilpunkte offen](qa/v2/ipad/teilpunkte-offen.png), [Auflösung abgeschlossen](qa/v2/ipad/teilpunkte-aufgeloest.png), [Sorani-Begriff](qa/v2/ipad/woerterbuch-neuer-begriff.png). Sämtliche Materialseiten: `docs/qa/v2/pdf/`.

**Öffentliche Live-Seite bleibt ungeprüft.** Der frische direkte HTTPS-Versuch endet am Proxy-CONNECT mit 403, Curl-Exit 56, Ziel-HTTP 000: [Abrufprotokoll](qa/v2/live-access.txt). Es wird keine HTTP-403-Antwort des Pages-Servers behauptet. Es gibt hier keinen bedienbaren Codex-Portweiterleitungsendpunkt; eine öffentliche Codex-Vorschau wurde nicht als repariert ausgegeben. Die neu geprüften Node-/Python-Server sind die funktionierende lokale Alternative. Startwege und Grenzen: [Vorschau](vorschau.md).

## Bild- und Wörterbuchprüfung

19 echte Fotos, 3.59 MiB zusammen; jede Datei unter 500 KiB, längste Seite höchstens 1400, kürzeste mindestens 600 Pixel. Das Balogun-Original mit 963 × 640 bleibt ohne Hochskalierung. Alle 15 ursprünglichen Dateien sind unverändert; vier Ergänzungen haben eigene Commons-Revisionen, Original- und Ableitungsprüfsummen, Orts-/Lizenzbelege. Keine generierten Beweisfotos. Kleine selbst erstellte Symbole illustrieren ausdrücklich ein Schema. Tabellen/Katalog: [Bildquellen](bildquellen.md).

Zehn Wörterbucheinträge hinzugefügt, darunter acht belegte Kurmandschi- und sieben belegte Sorani-Werte; vorhandene Werte erhalten. Jetzt 197 Begriffe, ru 196 / uk 195 / pl 197 / tr 195 / ar 196 / ku 184 / ckb 184. Alle neuen nichtleeren Werte aller Sprachen und sämtliche 368 kurdischen Werte sind einzeln an Sinn, Varietät und Originalauszug gebunden. Neue Quellen werden als tatsächlich abgerufene Wiki-Revision, versionierter Wörterbuchauszug oder FreeDict-Eintrag dokumentiert. Fünf nichtkurdische Altbestände bleiben redaktionell plausibilisiert; keine vollständigen Einzelbelege dieser Altbestände behauptet.

24 tatsächlich benötigte Suchformen gegen den lokalen Wortschatz geprüft: [Zuordnung](qa/v2/word-coverage.json), [Kontext und Grenzen](v2-umsetzung.md). Zusätzliche deutsche Begriffshilfen erklären ernten/aufbereiten/Bohnen/Versorgung. Alle Sprach-Abnahmefelder bleiben falsch. Vollständiger Bericht: [Wörterbuch](woerterbuch-pruefung.md).

## Offene Abnahme und Übergabe

Audit: sechs Sprachlücken-Kategorien (insgesamt 32 leere Werte), sieben sprachkundige Abnahmen, echtes Safari-iPad sowie fünf V2-Kategorien: Curriculum-Originale, direkte Sachquellen-Originale, reale Druckprobe, Lerngruppe/Zeit/Lernwirkung, öffentliche Browserfunktion. **19 offene Kategorien**, keine pauschale Unterrichtsfreigabe. Die fremden Originalseiten sind teilweise am Proxy blockiert; benannte Aussagen aus dem bereitgestellten geprüften Auftrag sind entsprechend gekennzeichnet. Kein erfundenes aktuelles Recht, Haushaltseinkommen, Wachstumstrend oder flächendeckender Zugang.

Der Nutzer hat V2 einschließlich Push, bestehendem PR #1 und Deployment ausdrücklich freigegeben. `feature/detektivspiel-komplett` bleibt der Entwicklungsbranch, PR #1 Draft gegen `main`. Kein neuer PR und kein Merge. Pages veröffentlicht diesen Branch automatisch; Veröffentlichung und Live-Funktionsabnahme bleiben getrennt. Start und Wiederherstellung stehen in [Übergabe](uebergabe-v2.md); der nach Push erhobene Remote-/Buildstand wird als zusätzliche Übergabedatei gesichert. Ein Git-Bundle und Projektarchiv ermöglichen die Wiederherstellung ohne installierte Entwicklungsabhängigkeiten.
