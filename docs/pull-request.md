Das bisher leere Projekt erhält ein Geographie-Detektivspiel mit fünf unabhängig startbaren Akten, lokaler Bewertung und druckbaren Unterrichtsmaterialien. Die Unterrichtsabnahme bleibt wegen fehlender authentischer Fotos, unvollständiger kurdischer Übersetzungen und ausstehender Sprach-/Safari-Prüfung offen; diesen PR als Entwurf prüfen.

- Akte 001: Kontinent erschließen, Thema erst nach Lösung anzeigen.
- Akte 002: persönliche Bildauswahl, fiktive Redaktion und drei gemeinsam bewertete Teilaufgaben.
- Akte 003: drei Kartenmysteries zu Marokko, Nigeria und Ghana.
- Akte 004: unabhängiger Papiervergleich und fachliche Überschriftenwahl.
- Akte 005: freiwillige Zuordnung von vier Zukunftsspuren; eigene Frage unbewertet.

Hinweislimits 5/3/2/1, begrenzte frühe Versuche, unbegrenzte einfache Abschlussaufgabe nach Hinweis 3, Teilpunkte und verpflichtende Papierbestätigung. Regulär maximal 30 Punkte, Bonus maximal 5 getrennt. Lokale aufgabenspezifische Schreibvarianten mit Verneinungs-/Widerspruchsbehandlung; Amerika oder Südafrika werden nicht als Afrika akzeptiert.

Wörterbuch mit 187 deutschen Begriffen und sieben Sprachen: Russisch, Ukrainisch, Polnisch, Türkisch, Arabisch, Kurmandschi, Sorani. Die ersten fünf haben jeweils 187, Kurmandschi 53 und Sorani 52 Übersetzungen. RTL für Arabisch/Sorani. Fehlende Begriffe bleiben ausdrücklich ohne Übersetzung. Muttersprachliche Abnahme steht aus.

Schülerbogen als HTML und genau zweiseitiges DIN-A4-PDF; separater Erwartungshorizont als Markdown, HTML und siebenseitiges PDF aus gemeinsamen Bewertungsdaten. README, Didaktik, Bildquellen, Abnahme und Testbericht sind enthalten. Keine Audioausgabe, externen Dienste, Accounts, Cookies oder dauerhafte Schülerdatenspeicherung. Optionale Tabsitzung, vollständig ohne Browser-Persistenz nutzbar.

Tatsächlich ausgeführt:

- `npm ci`: erfolgreich.
- `npm test`: 163/163 bestanden, keine übersprungen.
- `npm run test:e2e`: 36/36 bestanden, Chromium mit iPad-Querformat und schmalem Touch-Viewport, Projekt-Unterpfad `/Ermittlungszentrale/`.
- `npm run materials` und `npm run test:pdf`: erfolgreich; beide Bogenseiten zusätzlich gerastert und visuell geprüft.
- `sha256sum -c docs/kartendaten.sha256` und `git diff --check`: erfolgreich.
- `npm run audit:release`: Exit-Code 2 wegen der dokumentierten offenen Abnahmen.

15 dokumentarische Fotos fehlen: Wikimedia wurde vom Netzwerkproxy blockiert. Alle Motive sind sichtbar als fehlend gekennzeichnet, keine generierten Beweisfotos oder erfundenen Quellen. Suchanforderungen und Aufnahmeprozess: `docs/bildquellen.md`. Karten sind lokal aus Natural-Earth-Polygonen (Public Domain) abgeleitet. WebKit-Download war blockiert; Chromium-Emulation ist kein Safari-Nachweis.

GitHub Pages benötigt keinen Build: nach Abnahme und Merge in Settings → Pages den Branch `main`, Ordner `/ (root)` auswählen. `.nojekyll` und relative Ressourcen sind vorhanden. Kein Merge oder Deployment wurde eigenständig ausgelöst.
