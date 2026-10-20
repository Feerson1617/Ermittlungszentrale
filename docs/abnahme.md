# Abnahme und bekannte Einschränkungen

## Fachliche Unterrichtsfreigabe noch offen

- Alle 15 echten Fotografien sind integriert und anhand ihrer Commons-Beschreibungsseiten auf Motiv, Aufnahmeort, Urheber und freie Lizenz geprüft. Quellenrevisionen, Attributionen, Prüfsummen und Motivabweichungen: `bildquellen.md`, `data/media.json`, `docs/media/` und `bildnachweise.html`. Die Bildintegration ist abgeschlossen; eine Erprobung mit der Lerngruppe bleibt sinnvoll.
- Wörterbuch: 187 deutsche Begriffe, je 187 Übersetzungen für Russisch, Ukrainisch, Polnisch, Türkisch und Arabisch; 53 für Kurmandschi, 52 für Sorani. Fehlende Fachbegriffe werden nicht erfunden. Sie benötigen Ergänzung aus zuverlässiger Quelle und muttersprachliche Prüfung. Auch die vorhandenen redaktionellen Übersetzungen sind keine professionell oder muttersprachlich abgenommene Fassung.
- Safari auf einem echten Schul-iPad wurde noch nicht geprüft. Playwright-WebKit 26.0 steht inzwischen für automatisierte Tests zur Verfügung. Weder Chromium mit iPad-Geräteparametern noch WebKit unter Linux ersetzen den echten Safari-Gerätetest.
- Ein öffentlicher Quellcode schützt Lösungen nicht technisch. Der Erwartungshorizont ist nur aus der Schülernavigation ausgeblendet.

`npm run audit:release` meldet diese Punkte mit Exit-Code 2. Das ist ein bewusst offener Abnahmestatus, kein übergangener Testfehler. Die technischen Funktionstests müssen separat erfolgreich sein.

## Geprüfte Technik

Siehe `testbericht.md` für tatsächlich ausgeführte Befehle und Ergebnisse. Keine Anmeldung; keine externe Antwortbewertung, Übersetzung oder Schrift. `sessionStorage` ist optional und nur für die laufende Tabsitzung. Ohne Browser-Persistenz bleibt das Spiel funktionsfähig; ein Neuladen verliert dann die laufende Ermittlung. Papier ist die verlässliche Sicherung über Stunden und Geräte hinweg.

## Noch nötige Geräteprüfung

Auf dem tatsächlichen Schul-iPad in Safari: Zentrale in Querformat öffnen; alle Akten antippen; Tastatur ein-/ausblenden; lange Auswahlansichten scrollen; Wörterbuch in Arabisch/Sorani prüfen; Wörterbuch und Neustartdialog schließen; falsche Antwort und Hinweisstufen testen; Bogen als PDF öffnen und drucken. Browserdatenspeicherung testweise einschränken. Erst nach tatsächlichem Test `data/review.json` für Safari bestätigen.

## Netzwerkfreigaben für die Entwicklung

Die aktive Policy erlaubt `commons.wikimedia.org`, `upload.wikimedia.org`, `cdn.playwright.dev` und `playwright.download.prss.microsoft.com`. Commons-API, Originaldownloads und WebKit-Installation wurden in diesem Durchlauf tatsächlich erreicht. Zeitweilige Wikimedia-Rate-Limits wurden beachtet. Der von der API angebotene Thumbnail-Host ist nicht freigegeben; verwendet wurden Originaldownloads mit lokaler Optimierung. Zur Laufzeit benötigt das Spiel ausschließlich seine eigenen statischen Dateien.

## GitHub-Übergabe

Der bestehende offene Draft-PR [#1](https://github.com/Feerson1617/Ermittlungszentrale/pull/1) verwendet `feature/detektivspiel-komplett` gegen `main`. Die Bildintegration wird direkt auf diesen Entwicklungsbranch übertragen; kein zweiter PR, kein Merge und kein Deployment. Beschreibung: `docs/pull-request.md`.
