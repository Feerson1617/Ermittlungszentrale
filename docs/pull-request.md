**Vorbereitete Startkorrektur – noch nicht in den Remote-Commits dieses PR enthalten:** CSS-/Modul-/JSON-Fehler führen nun zu einer verständlichen Starthilfe; ein Zeitlimit verhindert die dauerhafte Lademeldung. Root, Projektpfad und Weiterleitung ohne Slash sind geprüft. Separat gestarteter Node-Server und unabhängige statische Python-Server wurden auf Desktop/iPad tatsächlich bedient: fünf Akten, alle 15 Fotos, Wörterbuch, Hinweise und Punkte. Neue Regressionstests prüfen außerdem fehlende, falsch ausgelieferte und hängende Ressourcen. Aktueller lokaler Stand: **192/192 Node-Tests, 152/152 Browserfälle einschließlich 38 WebKit**, PDF-Prüfung bestanden.

Die GitHub-API meldet Pages als automatische Veröffentlichung aus `feature/detektivspiel-komplett`. Der Push der lokalen Startkorrektur bleibt deshalb wegen des ausdrücklichen Deployment-Verbots aus. Die öffentliche URL ist hier vom Cloud-Proxy blockiert und wird nicht als repariert behauptet. Der bestehende PR bleibt ein Draft, kein neuer PR und kein Merge. Befunde/Startweg: `docs/vorschau.md`, Nachweise: `docs/testbericht.md`.

---

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

Tatsächlich nach der Wörterbuchergänzung ausgeführt:

- `npm test`: **191/191 bestanden**, nichts übersprungen.
- `TEST_WEBKIT=1 npm run test:e2e` mit dokumentierter lokaler WebKit-Umgebung: **72/72 bestanden**; je 24 unter Chromium/iPad, Chromium/iPhone und WebKit/iPad. Keine externen Requests, Bildlade- oder Laufzeitfehler in den Medienprüfungen.
- Alle fünf Akten und drei Länderfälle visuell geprüft; Chromium-/WebKit-Übersichten unter `docs/qa/`.
- `npm run dictionary:report`, `npm run materials`, `npm run test:pdf`: erfolgreich. Quellen-Hashes zusätzlich abgeglichen; neun Wörterbuch-Browserdurchläufe nach ergänzter Scrollprüfung erneut bestanden. Schülerbogen zwei A4-Seiten; Erwartungshorizont sieben Seiten.
- `sha256sum -c docs/kartendaten.sha256` und `git diff --check`: erfolgreich.
- `npm run audit:release`: erwarteter **Exit-Code 2 mit zehn offenen Abnahmepunkten**, keine offenen Bildpunkte.

Vor Unterrichtsfreigabe bleiben offen:

- [ ] Kurmandschi (elf Lücken) und Sorani (zehn Lücken) ergänzen.
- [ ] Alle sieben Sprachfassungen muttersprachlich prüfen, einschließlich RTL für Arabisch/Sorani.
- [ ] Test auf einem echten Schul-iPad in Safari mit Touch, Bildschirmtastatur, Scrollen, Dialogen, Wörterbuch, Hinweisen/Punkten und PDF-Öffnen/Drucken. Linux-WebKit ersetzt diesen Test nicht.

Der echte iPad-Test wird anschließend vom Projektteam übernommen. Es wird kein durchgeführter Geräte- oder Muttersprachlertest behauptet.

Fortsetzung direkt auf `feature/detektivspiel-komplett` für den bestehenden Draft-PR #1 gegen `main`. Kein zweiter PR, kein Merge und kein Deployment. Einzelheiten: `docs/testbericht.md` und `docs/abnahme.md`.
