# Testbericht

Prüfstand: 20.10.2026. Node.js 24.19.0, npm 11.9.0, Playwright 1.58.2, installierter Chromium 154. Die beschriebenen Durchläufe wurden tatsächlich ausgeführt. Die technischen Ergebnisse ersetzen die offenen fachlichen und visuellen Abnahmen nicht.

| Prüfung | Ergebnis |
|---|---|
| `npm ci --cache /workspace/.npm-cache --no-audit --no-fund` | Erfolgreich mit Lockdatei |
| `npm test` | 163 ausgeführt, 163 bestanden, 0 fehlgeschlagen, 0 übersprungen |
| `npm run test:e2e` | 36 ausgeführt, 36 bestanden, 0 fehlgeschlagen; 18 je Gerätekonfiguration |
| `npm run materials` | Beide HTML-/PDF-Materialien erzeugt; HTML-Seitengrenzen des Schülerbogens geprüft |
| `npm run test:pdf` | Schülerbogen exakt zwei A4-Seiten; erwartete Inhalte auf beiden Seiten; Lehrerdokument sieben Seiten |
| `sha256sum -c docs/kartendaten.sha256` | Ausgangsdaten stimmen mit dokumentiertem Hash überein |
| `git diff --check` | Keine Whitespace-Fehler |
| `npm run audit:release` | **Offen, Exit-Code 2:** 15 Fotos, Wörterbuchlücken/Sprachabnahme und echter Safari-Gerätetest; kein Funktionspass behauptet |
| WebKit-Installation | **Nicht verfügbar:** Proxy verweigert Browser-Download mit HTTP 403; keine WebKit- oder Safari-Tests ausgeführt |

## Bewertungs- und Inhaltstests

Alle sieben Wertungsaufgaben: richtige und falsche Abgaben, leere Eingaben, Hinweislimits 5/3/2/1, Sperre pro früher Stufe, unbegrenzte Versuche nach Hinweis 3, mindestens ein Punkt erst bei erfolgreicher Lösung, unveränderliches abgeschlossenes Ergebnis und keine vorzeitige Abschlussauswahl.

Freitext: richtige Ein-Wort-Antworten, einfache ganze Sätze und Fragmente, Satzzeichen, Vollbreiten-Unicode, Schreibfehler, Buchstabendreher und Synonyme. Amerika, America, Süd-/Nordamerika, Asien, Antarktis und Südafrika lösen Akte 001 nicht. Niger wird nicht zu Nigeria. Negationen und widersprüchliche Eingaben geben keine falschen positiven Bewertungen. Unklare Antworten verbrauchen keinen Versuch und verraten keine erreichten Teilkriterien.

Akte 002: positive Teilkriterien bleiben erhalten, auch wenn andere falsch sind; Hinweislimit wird auf die Summe angewandt. Nur eine gemeinsame Abgabe. Keine Punkte für doppelte oder ungültige Bildnummern. Akte 005: vier Zuordnungen geben fünf, sonst je korrekter Zuordnung einen Rohpunkt. Hauptwertung 30 und Bonus 5 getrennt.

Inhalt: fünf Akten, sieben Aufgaben, genau zehn gemeinsame Foto-IDs, 187 eindeutige deutsche Wörter, sieben Sprachen und RTL-Metadaten. Existenz der lokalen Karten und echte Länderpolygone. Keine externen Laufzeitdienste und keine Audio-/Tracking-/dauerhaften Speicheraufrufe in den Spielquellen.

## Browserdurchläufe

- Chromium, iPad-Geräteparameter: 1024 × 768, Touch, Querformat.
- Chromium, iPhone-13-Geräteparameter: 390 × 664, Touch, Hochformat.
- Testpfad `/Ermittlungszentrale/` (GitHub-Pages-Unterpfad).
- Jede Akte aus einer frischen Sitzung unabhängig gestartet. Alle sieben Wertungsaufgaben regulär gelöst; persönliche Auswahlen und Reflexionsschritte bestätigt; Bonusfrage unbewertet.
- Kein Lösungsname auf Startbildschirm, im Seitentitel, in Akte 001 oder ihren Bild-/Kartenbeschreibungen vor der Auflösung. Auch nach Hinweis 3 keine vorzeitige Namensnennung.
- Papierbestätigung sperrt Fortsetzung und Rückkehr bis zum Häkchen. Sitzungsneuladen erhält Hinweisstufe und Versuchssperre. Neustart verlangt Bestätigung.
- Wörterbuch: sieben Sprachen, bekannte Suche, RTL, fehlendes Wort, Schließen ohne Antwortverlust. Karte lässt sich groß öffnen, ohne Antwort-/Hinweisstand zu ändern.
- Breitenüberlauf geprüft; Haupt-Touchziele mindestens 44 Pixel; Dialogfokus und Escape-Schließen geprüft. Screenshots der Zentrale und repräsentativer Zustände visuell angesehen. Kartenbeschriftung nach Sichtprüfung vergrößert und zusätzlich eine große Kartenansicht eingebaut.
- Vollständiger Testdurchlauf überwacht JavaScript-Laufzeitfehler und externe Requests. Zusätzlich frische Sitzung mit absichtlich gesperrtem `sessionStorage` und `localStorage`: alle Akten erreichbar, erste Akte lösbar, keine Laufzeitfehler, fehlgeschlagenen lokalen Requests oder externen Abrufe.

Die Chromium-Geräteparameter simulieren keine Safari-Engine und kein echtes iPad. Dieser Unterschied ist ein offener Abnahmepunkt.

## Druckprüfung

PDF-Metadaten und Text geprüft: zwei Seiten, ca. 595 × 842 Punkte, DIN A4, keine zusätzlichen Kopf-/Fußzeilen. Vorder- und Rückseite gerastert und visuell geprüft. Weltkarte unbeschriftet, ohne Hervorhebung; Bogen schwarz-weiß lesbar. Namens-, Team-, Länder-, Bildnummern-, Reflexions- und Punktefelder vorhanden. Der Materialgenerator prüft vor Ausgabe, dass die letzten Inhalte weder über die Seitenhöhe noch in den Fußbereich laufen.

## Blockaden außerhalb der Spielmechanik

Wikimedia-Zugriff und WebKit-Download wurden vom Umgebungsproxy blockiert. Die nötigen Netzwerkdomains sowie reproduzierbare Installations-/Startanweisungen sind im Umgebungsentwurf gespeichert; die aktive Policy enthielt beim letzten Statuscheck weiterhin keine zusätzlichen Domains. Git-Lesezugriff auf das Repository funktioniert. Ein spezifischer GitHub-API-Leseaufruf für das Repository wurde mit `Forbidden` abgewiesen. Weder ein neues Token noch freigeschaltete API-Schreibrechte werden daraus abgeleitet.

Zur Unterrichtsfreigabe siehe `abnahme.md`. Die fehlenden Fotos und Übersetzungen wurden nicht mit erfundenen Daten aufgefüllt.
