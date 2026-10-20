# Abnahme und bekannte Einschränkungen

## Fachliche Unterrichtsfreigabe noch offen

- 15 echte, belegte Fotografien fehlen. Jede fehlende Aufnahme ist im Spiel sichtbar markiert. Die Quellenprüfung wird nicht durch generierte oder unlizenzierte Bilder ersetzt. Siehe `bildquellen.md`.
- Wörterbuch: 187 deutsche Begriffe, je 187 Übersetzungen für Russisch, Ukrainisch, Polnisch, Türkisch und Arabisch; 53 für Kurmandschi, 52 für Sorani. Fehlende Fachbegriffe werden nicht erfunden. Sie benötigen Ergänzung aus zuverlässiger Quelle und muttersprachliche Prüfung. Auch die vorhandenen redaktionellen Übersetzungen sind keine professionell oder muttersprachlich abgenommene Fassung.
- Safari auf einem echten Schul-iPad wurde noch nicht geprüft. Der optionale Playwright-WebKit-Download wurde durch die Netzwerkpolicy mit HTTP 403 blockiert. Chromium mit iPad-Geräteparametern ist kein Safari-Nachweis.
- Ein öffentlicher Quellcode schützt Lösungen nicht technisch. Der Erwartungshorizont ist nur aus der Schülernavigation ausgeblendet.

`npm run audit:release` meldet diese Punkte mit Exit-Code 2. Das ist ein bewusst offener Abnahmestatus, kein übergangener Testfehler. Die technischen Funktionstests müssen separat erfolgreich sein.

## Geprüfte Technik

Siehe `testbericht.md` für tatsächlich ausgeführte Befehle und Ergebnisse. Keine Anmeldung; keine externe Antwortbewertung, Übersetzung oder Schrift. `sessionStorage` ist optional und nur für die laufende Tabsitzung. Ohne Browser-Persistenz bleibt das Spiel funktionsfähig; ein Neuladen verliert dann die laufende Ermittlung. Papier ist die verlässliche Sicherung über Stunden und Geräte hinweg.

## Noch nötige Geräteprüfung

Auf dem tatsächlichen Schul-iPad in Safari: Zentrale in Querformat öffnen; alle Akten antippen; Tastatur ein-/ausblenden; lange Auswahlansichten scrollen; Wörterbuch in Arabisch/Sorani prüfen; Wörterbuch und Neustartdialog schließen; falsche Antwort und Hinweisstufen testen; Bogen als PDF öffnen und drucken. Browserdatenspeicherung testweise einschränken. Erst nach tatsächlichem Test `data/review.json` für Safari bestätigen.

## Netzwerkfreigaben für die Entwicklung

Im Umgebungsentwurf wurden `commons.wikimedia.org`, `upload.wikimedia.org`, `de.wiktionary.org` und `en.wiktionary.org` ergänzt. Die Speicherung aktiviert diese Freigaben nicht automatisch in der laufenden Maschine. Für den optionalen WebKit-Test werden zusätzlich `cdn.playwright.dev` und `playwright.download.prss.microsoft.com` benötigt. Zur Laufzeit benötigt das veröffentlichte Spiel ausschließlich seine eigenen statischen Dateien.
