# Version 2.2 – Befunde und Umsetzung

Auftrag: unverändert gesicherter [Nutzertext](../sources/auftrag-v2.2.md). Die Zuordnung H1, M1–M3 und N1–N4 folgt den konkreten Beschreibungen dieses Auftrags; ein separater vollständiger Work-Prüfbericht wurde nicht zusätzlich bereitgestellt. Keine erneute Entwicklung oder zusätzliche Akte.

## Git-Grundlage und Veröffentlichung

Frisch abgeglichen: `main` = `3a6274f732696048a4d45ee63964992b02f9ef58` (Merge von PR #1); `feature/detektivspiel-komplett` = `b219afbef1c8589fc0a40210acddd1246d63e9d5`. `main` hat denselben Anwendungsbaum wie `d8a4c4c`. Die 2.1-Commits `e422525` und `b219afb` fehlen dort.

Neuer Branch `fix/ermittlungszentrale-2-2-abnahme` direkt von `origin/main`. Nur die beiden fehlenden Commits übernommen: `cf3b644` und `87c13c0`. Der Dateibaum danach war per `git diff --exit-code` exakt gleich dem vollständigen 2.1-Branch. Keine bereits in `main` enthaltenen Änderungen erneut übertragen. Darauf folgen ausschließlich die Korrekturen für 2.2.

Der neue Auftrag gibt Push dieses neuen Branches und Erstellung eines neuen Draft-PR ausdrücklich frei. [Draft-PR #2](https://github.com/Feerson1617/Ermittlungszentrale/pull/2) ist erstellt und bleibt offen; Implementierungscommit `459d795`. Kein Merge. Pages bezieht weiterhin den alten Entwicklungsbranch; dieser wird nicht gepusht. Keine Pages-Einstellungen geändert, keine Veröffentlichung von 2.2 auf Pages. PR #1 bleibt geschlossen.

## Befundmatrix

| Befund | Umsetzung | Prüfung / fachliche Grenze |
|---|---|---|
| H1 · Lagos | Zwei datierte Karten mit sichtbaren Gebäuden/Blickrichtungen: Lagos Island 2016, Makoko 2019. Generische Karten zu Versorgung entfernt. | [Originalrevisionen erneut geprüft](lagos-quellen-v22.md). Keine zusätzlichen örtlich/zeitlich belastbaren Wasser-/Sanitärdaten zugänglich; explizit erlaubte Eingrenzung des Lernziels genutzt. Keine erfundenen Sozialdaten. |
| M1 · Sprache | „Welche Aussage tut so, als wäre es überall gleich?“; kurze Arbeitsaufträge in allen Akten; kurze Kernsätze und aufklappbares „Mehr erfahren“. Deutsche Hilfen aus gemeinsamer Datei, auch im Wörterbuch. | Aussagegrenzen unter „Mehr erfahren“ erhalten. 197 Einträge/sieben Sprachen unverändert; keine neuen Übersetzungen und keine sprachkundige Abnahme behauptet. Verständlichkeit für die tatsächliche Lerngruppe bleibt zu erproben. |
| M2 · Individuelle Rückmeldung | Jede fachliche Auswahl: richtige Antwort bestätigen oder gewählte falsche Option mit eigenem Grund erklären, anschließend passendes Bild-/Schemaergebnis. | Alle fachlichen Antwortoptionen geprüft; keine Punkte, Sperren oder Korrekturschleifen. Persönliche Vermutung und Reflexion explizit ohne Richtig-falsch-Wertung. |
| M3 · Wörterbuch-Fokus | Auslöser merken; bei Dialogende explizit zurückfokussieren. Escape schließt auch bei gefülltem Suchfeld. | Tastaturtest deckte zunächst ab, dass Escape im Suchfeld konsumiert wurde. Explizite Behandlung ohne Eingriff in laufende IME-Eingabe; Schließen/Escape in Chromium und WebKit geprüft, Entwürfe/Punkte erhalten. |
| N1 · Bild 9 | Einheitlich „Klassenraum mit Holztischen und Stühlen“ in beiden Auswahlakten, Katalog und Materialien. | Identität, Datei, Quelle und Lizenz unverändert. Keine Behauptung allgemeiner Schulqualität. |
| N2 · Satzanfänge | Sichtbar: „Gleich geblieben ist …“, „Neu ist für uns …“, „Dazu passt Bild …“. | Eigene Wörter und unveränderte Vorstellung zulässig; keine zusätzliche Bewertung oder Schreibpflicht. |
| N3 · Punkte auf Papier | Tabelle mit eigenen Feldern für 001–004, Maxima 5/5/15/5. | Hauptsumme 30, Bonus getrennt 5; kein optisches Zusammenlaufen von „/ 15“ und nächster Akte. |
| N4 · Starthilfe | Direkt Safari/normalen Browser öffnen; eingebettete Vorschau kann Dateien blockieren. Lokale Serverhilfe nur als Zusatz für lokale Kopie. | CSP nicht gelockert, früher Startwächter und Zeitlimit erhalten; exakter Hash neu berechnet und geprüft. Kein Wechsel auf HTTP für die öffentliche Seite. |
| Zusätzlich · Lösungsverrat | „Vier Fotos zeigen …“ bleibt offen, ausdrücklich erst nach der Aufgabe ergänzen. | Keine vorgegebene Antwort „einige Orte“ oder „nicht alle Lebensbedingungen“ mehr auf leerem Bogen. Beide Seiten weiter kontinentneutral. |

## Erhalten und synchronisiert

Alle fünf unabhängigen Akten, drei Länder, zehn unbewertete Schritte, zwölf identische Auswahlbilder, vier Redaktions-Rückbezüge und alle 24 Fotodateien erhalten. 30+5 Punkte, 5/3/2/1, Namensklärung, Teilauflösung, Hinweise, Zoom und Papierbestätigung unverändert. Bestehende 2.1-Sitzungen bleiben kompatibel; kein neuer Reset für 2.2.

Gemeinsame Daten: `data/learning.js`, `data/cases.js`, `data/rubrics.json`, `data/word-help.js`. Die reine Rückmeldungsfunktion `js/learning-feedback.js` verändert keine Sitzung oder Wertung. Der Materialgenerator übernimmt dieselben Lerntexte, Antworten, Fehlerbeispiele und Aussagegrenzen. Schülerbogen weiter genau zwei A4-Seiten; Lehrerunterlagen durch kompaktere Wiederholungen und Tabellenabstände weiter 13 Seiten bei gleicher Grundschriftgröße. Alle Seiten digital rendern und sichten; keine reale Druckprobe daraus ableiten.

## Abnahme

Tatsächliche Ergebnisse und Nachweise: [Testbericht](testbericht.md). Menschliche/örtliche Abnahmen: [Abnahmestatus](abnahme.md). Neu wird das ausdrücklich angeforderte Schulnetz separat als offen im Audit erfasst. Deshalb 20 offene Kategorien statt der bisherigen 19; keine zuvor offene Prüfung automatisch bestätigt. Echtes Schul-iPad, Schulnetz, sprachkundige Kontrolle, realer beidseitiger Druck und Lerngruppenerprobung/Zeitmessung bleiben offen.
