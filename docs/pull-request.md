Fehlende oder blockierte CSS-/JavaScript-Dateien konnten die Seite dauerhaft bei „Die Akten werden geöffnet …“ stehen lassen: Die frühere Fehlerbehandlung wurde bei Importfehlern nie ausgeführt. Die Startkorrektur zeigt jetzt verständliche Fehler für CSS, Module und JSON-Daten sowie nach 18 Sekunden bei hängenden Abrufen. Eine statische Starthilfe bleibt auch bei vollständiger Skriptsperre sichtbar; die CSP erlaubt das frühe Prüfskript ausschließlich über seinen exakten Hash. Der Entwicklungsserver korrigiert außerdem den Projektpfad ohne abschließenden Slash.

Root und Projektpfad wurden auf Desktop/iPad über einen separat gestarteten Node-Server und unabhängige statische Python-Server tatsächlich bedient: vollständiges Menü, Detektivmotiv, fünf Akten, alle 15 Fotos, Wörterbuch und Hinweise/Punkte. Neue Regressionstests prüfen den sichtbaren Start, Ressourcenfehler und hängende Abrufe. Spielinhalte, Übersetzungen, Bewertungsregeln und Unterrichtsmaterialien bleiben erhalten.

Die öffentliche URL ist hier vom Cloud-Proxy blockiert und wird nicht als repariert behauptet. Das Projektteam hat den Push der geprüften Startkorrektur einschließlich der automatischen Pages-Veröffentlichung aus `feature/detektivspiel-komplett` am 21.10.2026 ausdrücklich freigegeben. Der bestehende PR bleibt ein Draft; kein neuer PR und kein Merge. Befunde: `docs/vorschau.md`, Validierung: `docs/testbericht.md`.

Das Projekt enthält ein Geographie-Detektivspiel mit fünf unabhängig startbaren Akten, lokaler Bewertung, Wörterbuch und druckbaren Unterrichtsmaterialien. Alle 15 authentischen Beweisfotografien sind integriert. Das lokale Wörterbuch wurde um 248 belegte Kurmandschi-/Sorani-Werte ergänzt. Der PR bleibt wegen ausstehender Sprach- und echter iPad-Abnahmen ein Entwurf.

- Akte 001 erschließt den Kontinent aus vier Fotos; Bildbeschriftungen, neutrale Dateinamen und verzögert eingeblendete Quellen verraten ihn vor der Lösung nicht.
- Akte 002 und 004 nutzen dieselben zehn nummerierten Fotografien und lokale Dateien. Persönliche Vorstellungen bleiben unbewertet.
- Akte 003 verbindet echte Fotos mit Karten zu Marokko, Nigeria und Ghana. Atlas- und Kakaopunkt folgen den belegten Aufnahmekoordinaten.
- Akte 005 eröffnet Wasser/Naturraum, Bevölkerungs- und Stadtentwicklung, wirtschaftliche Wertschöpfung sowie Energie/Zukunft anhand von vier authentischen Fotos.

Alle 15 Bilder stammen von Wikimedia Commons. Aufnahmeorte, Urheber, Quellenrevisionen, freie Lizenzen samt Version, Attributionen und jede Motivabweichung sind in `data/media.json`, `docs/bildquellen.md`, `docs/media/` und der lokalen Seite `bildnachweise.html` dokumentiert. Originaldownloads wurden bytegenau mit den Commons-SHA1-Werten abgeglichen; Originale, optimierte Bilder und Nachweise haben zusätzlich SHA256. Reale Alternativen umfassen unter anderem Betriebsaußenansichten, ein abgeerntetes Sahelfeld und eine solarthermische Anlage. Keine generierten Beweisbilder oder ungeklärten Bildrechte.

15 WebP-Dateien mit maximal 1400 Pixeln an der längsten Seite und zusammen 2,84 MiB. Vollständige Motive ohne Beschnitt; Laden erst beim Öffnen einer Akte, kompakte Auswahlen zusätzlich bei Bedarf. Keine externen Bildabrufe zur Laufzeit. Kurzangaben an den Fotos und vollständige lokale Quellen-/Lizenzseite. Lehrermaterialien und Abnahmedokumentation aktualisiert.

Regulär maximal 30 Punkte und getrennt fünf Bonuspunkte. Hinweislimits 5/3/2/1, lokale Schreibvarianten, Teilpunkte, Papierbestätigung und optionale Tabsitzung. Keine externen Bewertungs-/Übersetzungsdienste, Konten, Analytics, Audio oder dauerhafte Schülerdatenspeicherung.

Wörterbuch und Abnahme:

- Kurmandschi von 53 auf 176/187, Sorani von 52 auf 177/187 ergänzt. Alle 353 vorhandenen kurdischen Werte besitzen Einzelbelege mit Originalauszug, passender Varietät, Quellenrevision und Prüfsummen; Quellenlizenzen dokumentiert.
- Alle sieben Sprachen redaktionell auf Plausibilität geprüft. Polnische Form „alle“ präzisiert; Bedeutungsangaben schützen vor Verwechslungen wie Strom/Fluss und See/Meer. Muttersprachliche Abnahme aller sieben Sprachen bleibt ausdrücklich offen.
- Lokale Quellen-/Statusseite und vollständige Einzelliste: `woerterbuch.html`, `docs/woerterbuch-pruefung.md`, `data/dictionary-evidence.json`. Der Release-Audit erkennt veraltete oder beschädigte Wörterbuchbelege. Redaktionelle und muttersprachliche Abnahme sind getrennte Felder.
- 21 Werte bleiben bewusst leer: elf Kurmandschi und zehn Sorani. Für diese Fachbegriffe/Formulierungen fand sich in den geprüften Quellen kein hinreichend passender Beleg. Keine erfundenen Fachwörter oder ungeprüften zusammengesetzten Ersatzbegriffe.

Validierung des aktuellen Spielstands:

- `npm test`: **192/192 bestanden**, nichts übersprungen.
- `TEST_WEBKIT=1 npm run test:e2e` mit dokumentierter lokaler WebKit-Umgebung: **152/152 bestanden**; je 38 unter Chromium/Desktop, Chromium/iPad, Chromium/iPhone und WebKit/iPad. Keine externen Requests, Bildlade- oder Laufzeitfehler in den Medienprüfungen.
- Alle fünf Akten und drei Länderfälle visuell geprüft; Chromium-/WebKit-Übersichten unter `docs/qa/`.
- `npm run dictionary:report`, `npm run materials`, `npm run test:pdf`: erfolgreich. Quellen-Hashes zusätzlich abgeglichen; neun Wörterbuch-Browserdurchläufe nach ergänzter Scrollprüfung erneut bestanden. Schülerbogen zwei A4-Seiten; Erwartungshorizont sieben Seiten.
- `sha256sum -c docs/kartendaten.sha256` und `git diff --check`: erfolgreich.
- `npm run audit:release`: erwarteter **Exit-Code 2 mit zehn offenen Abnahmepunkten**, keine offenen Bildpunkte.

Vor Unterrichtsfreigabe bleiben offen:

- [ ] Kurmandschi (elf Lücken) und Sorani (zehn Lücken) ergänzen.
- [ ] Alle sieben Sprachfassungen muttersprachlich prüfen, einschließlich RTL für Arabisch/Sorani.
- [ ] Test auf einem echten Schul-iPad in Safari mit Touch, Bildschirmtastatur, Scrollen, Dialogen, Wörterbuch, Hinweisen/Punkten und PDF-Öffnen/Drucken. Linux-WebKit ersetzt diesen Test nicht.

Der echte iPad-Test wird anschließend vom Projektteam übernommen. Es wird kein durchgeführter Geräte- oder Muttersprachlertest behauptet.

Fortsetzung direkt auf `feature/detektivspiel-komplett` für den bestehenden Draft-PR #1 gegen `main`. Kein zweiter PR und kein Merge. Der Push einschließlich der dadurch ausgelösten automatischen Pages-Veröffentlichung ist ausdrücklich freigegeben. Einzelheiten: `docs/testbericht.md` und `docs/abnahme.md`.
