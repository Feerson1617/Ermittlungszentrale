Das Projekt enthält ein Geographie-Detektivspiel mit fünf unabhängig startbaren Akten, lokaler Bewertung, Wörterbuch und druckbaren Unterrichtsmaterialien. Alle 15 authentischen Beweisfotografien sind jetzt vollständig integriert. Der PR bleibt wegen ausstehender Sprach- und echter iPad-Abnahmen ein Entwurf.

- Akte 001 erschließt den Kontinent aus vier Fotos; Bildbeschriftungen, neutrale Dateinamen und verzögert eingeblendete Quellen verraten ihn vor der Lösung nicht.
- Akte 002 und 004 nutzen dieselben zehn nummerierten Fotografien und lokale Dateien. Persönliche Vorstellungen bleiben unbewertet.
- Akte 003 verbindet echte Fotos mit Karten zu Marokko, Nigeria und Ghana. Atlas- und Kakaopunkt folgen den belegten Aufnahmekoordinaten.
- Akte 005 eröffnet Wasser/Naturraum, Bevölkerungs- und Stadtentwicklung, wirtschaftliche Wertschöpfung sowie Energie/Zukunft anhand von vier authentischen Fotos.

Alle 15 Bilder stammen von Wikimedia Commons. Aufnahmeorte, Urheber, Quellenrevisionen, freie Lizenzen samt Version, Attributionen und jede Motivabweichung sind in `data/media.json`, `docs/bildquellen.md`, `docs/media/` und der lokalen Seite `bildnachweise.html` dokumentiert. Originaldownloads wurden bytegenau mit den Commons-SHA1-Werten abgeglichen; Originale, optimierte Bilder und Nachweise haben zusätzlich SHA256. Reale Alternativen umfassen unter anderem Betriebsaußenansichten, ein abgeerntetes Sahelfeld und eine solarthermische Anlage. Keine generierten Beweisbilder oder ungeklärten Bildrechte.

15 WebP-Dateien mit maximal 1400 Pixeln an der längsten Seite und zusammen 2,84 MiB. Vollständige Motive ohne Beschnitt; Laden erst beim Öffnen einer Akte, kompakte Auswahlen zusätzlich bei Bedarf. Keine externen Bildabrufe zur Laufzeit. Kurzangaben an den Fotos und vollständige lokale Quellen-/Lizenzseite. Lehrermaterialien und Abnahmedokumentation aktualisiert.

Regulär maximal 30 Punkte und getrennt fünf Bonuspunkte. Hinweislimits 5/3/2/1, lokale Schreibvarianten, Teilpunkte, Papierbestätigung und optionale Tabsitzung. Keine externen Bewertungs-/Übersetzungsdienste, Konten, Analytics, Audio oder dauerhafte Schülerdatenspeicherung.

Tatsächlich nach der Bildintegration ausgeführt:

- `npm test`: **180/180 bestanden**, nichts übersprungen.
- `TEST_WEBKIT=1 npm run test:e2e` mit dokumentierter lokaler WebKit-Umgebung: **63/63 bestanden**; je 21 unter Chromium/iPad, Chromium/iPhone und WebKit/iPad. Keine externen Requests, Bildlade- oder Laufzeitfehler in den Medienprüfungen.
- Alle fünf Akten und drei Länderfälle visuell geprüft; Chromium-/WebKit-Übersichten unter `docs/qa/`.
- `python3 scripts/prepare-media.py /tmp/approved-originals`, `npm run media:credits`, `npm run materials`, `npm run test:pdf`: erfolgreich. Schülerbogen zwei A4-Seiten; Erwartungshorizont sieben Seiten.
- `sha256sum -c docs/kartendaten.sha256` und `git diff --check`: erfolgreich.
- `npm run audit:release`: erwarteter **Exit-Code 2 mit zehn offenen Abnahmepunkten**, keine offenen Bildpunkte.

Vor Unterrichtsfreigabe bleiben offen:

- [ ] Kurmandschi (134 Lücken) und Sorani (135 Lücken) ergänzen.
- [ ] Alle sieben Sprachfassungen muttersprachlich prüfen, einschließlich RTL für Arabisch/Sorani.
- [ ] Test auf einem echten Schul-iPad in Safari mit Touch, Bildschirmtastatur, Scrollen, Dialogen, Wörterbuch, Hinweisen/Punkten und PDF-Öffnen/Drucken. Linux-WebKit ersetzt diesen Test nicht.

Fortsetzung direkt auf `feature/detektivspiel-komplett` für den bestehenden Draft-PR #1 gegen `main`. Kein zweiter PR, kein Merge und kein Deployment. Einzelheiten: `docs/testbericht.md` und `docs/abnahme.md`.
