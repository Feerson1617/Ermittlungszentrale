# Abnahme und bekannte Einschränkungen

## Fachliche Unterrichtsfreigabe noch offen

- Alle 15 echten Fotografien sind integriert und anhand ihrer Commons-Beschreibungsseiten auf Motiv, Aufnahmeort, Urheber und freie Lizenz geprüft. Quellenrevisionen, Attributionen, Prüfsummen und Motivabweichungen: `bildquellen.md`, `data/media.json`, `docs/media/` und `bildnachweise.html`. Die Bildintegration ist abgeschlossen; eine Erprobung mit der Lerngruppe bleibt sinnvoll.
- Wörterbuch: 187 deutsche Begriffe, je 187 Übersetzungen für Russisch, Ukrainisch, Polnisch, Türkisch und Arabisch; jetzt **176 für Kurmandschi und 177 für Sorani**. 248 der ursprünglich 269 fehlenden Werte wurden mit überprüfbaren Belegen ergänzt. Alle sieben Sprachfassungen wurden redaktionell auf Plausibilität geprüft; alle vorhandenen kurdischen Werte haben Einzelnachweise. **Keine muttersprachliche oder professionelle Freigabe** fand statt. Offen bleiben 11 Kurmandschi- und 10 Sorani-Werte, für die in den geprüften Quellen kein passender Beleg gefunden wurde. Die vollständigen Lücken, Quellen, Bedeutungshilfen und Grenzen stehen in [Wörterbuchprüfung](woerterbuch-pruefung.md) und `data/dictionary-evidence.json`. Unsichere Fachwörter wurden nicht erfunden.
- Safari auf einem echten Schul-iPad wurde noch nicht geprüft. Playwright-WebKit 26.0 steht inzwischen für automatisierte Tests zur Verfügung. Weder Chromium mit iPad-Geräteparametern noch WebKit unter Linux ersetzen den echten Safari-Gerätetest.
- Ein öffentlicher Quellcode schützt Lösungen nicht technisch. Der Erwartungshorizont ist nur aus der Schülernavigation ausgeblendet.

`npm run audit:release` meldet diese Punkte mit Exit-Code 2. Das ist ein bewusst offener Abnahmestatus, kein übergangener Testfehler. Die technischen Funktionstests müssen separat erfolgreich sein.

`data/review.json` trennt die datierte redaktionelle Prüfung (`dictionaryEditorial`, an den Datei-Hash gebunden) von den sieben weiterhin unbestätigten muttersprachlichen Abnahmen (`dictionary`). Eine redaktionelle oder automatisierte Prüfung setzt diese Abnahmen nicht auf wahr. Der Safari-Eintrag bleibt ebenfalls offen; den echten Schul-iPad-Test übernimmt das Projektteam anschließend selbst.

## Gemeldeter Ausfall der veröffentlichten Seite

Der Start der bereits laufenden Anwendung ist unter Root und Projektpfad auf Desktop/iPad geprüft; CSS-/Modul-/JSON-Fehler haben jetzt eine verständliche Starthilfe statt einer dauerhaften Lademeldung. Der gemeldete Ausfall auf der tatsächlichen GitHub-Pages-Adresse bleibt **nicht abschließend diagnostiziert**: der Cloud-Proxy blockiert den Abruf, und es steht kein bedienbarer Codex-Vorschauendpunkt zur Verfügung. Diese Live-Abnahme wird vom dateibasierten Release-Audit nicht erfasst. Das Projektteam hat den Push der geprüften Startkorrektur einschließlich der automatischen Pages-Veröffentlichung am 21.10.2026 ausdrücklich freigegeben. Die fehlende Live-Abnahme bleibt davon unabhängig offen. Nachweise, unabhängige statische Alternative und Konflikt zum Deployment-Verbot: [Vorschauprüfung](vorschau.md).

## Geprüfte Technik

Siehe `testbericht.md` für tatsächlich ausgeführte Befehle und Ergebnisse. Keine Anmeldung; keine externe Antwortbewertung, Übersetzung oder Schrift. `sessionStorage` ist optional und nur für die laufende Tabsitzung. Ohne Browser-Persistenz bleibt das Spiel funktionsfähig; ein Neuladen verliert dann die laufende Ermittlung. Papier ist die verlässliche Sicherung über Stunden und Geräte hinweg.

## Noch nötige Geräteprüfung

Auf dem tatsächlichen Schul-iPad in Safari: Zentrale in Querformat öffnen; alle Akten antippen; Tastatur ein-/ausblenden; lange Auswahlansichten scrollen; Wörterbuch in Arabisch/Sorani prüfen; Wörterbuch und Neustartdialog schließen; falsche Antwort und Hinweisstufen testen; Bogen als PDF öffnen und drucken. Browserdatenspeicherung testweise einschränken. Erst nach tatsächlichem Test `data/review.json` für Safari bestätigen.

## Netzwerkfreigaben für die Entwicklung

Die aktive Policy erlaubt `commons.wikimedia.org`, `upload.wikimedia.org`, `cdn.playwright.dev` und `playwright.download.prss.microsoft.com`. Commons-API, Originaldownloads und WebKit-Installation wurden in diesem Durchlauf tatsächlich erreicht. Zeitweilige Wikimedia-Rate-Limits wurden beachtet. Der von der API angebotene Thumbnail-Host ist nicht freigegeben; verwendet wurden Originaldownloads mit lokaler Optimierung. Zur Laufzeit benötigt das Spiel ausschließlich seine eigenen statischen Dateien.

## GitHub-Übergabe

Der bestehende offene Draft-PR [#1](https://github.com/Feerson1617/Ermittlungszentrale/pull/1) verwendet `feature/detektivspiel-komplett` gegen `main`. Die Wörterbuchergänzung liegt auf diesem Entwicklungsbranch. Die geprüfte Startkorrektur und ihre Statusdokumentation werden mit ausdrücklicher Freigabe vom 21.10.2026 direkt auf denselben Branch übertragen; die damit verbundene automatische Pages-Veröffentlichung ist ebenfalls freigegeben. Kein zweiter PR und kein Merge. Beschreibung: `docs/pull-request.md`.
