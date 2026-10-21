# Abnahme der Version 2.2

Stand 21.10.2026. [Auftrag 2.2](../sources/auftrag-v2.2.md), [Befundmatrix](v22-umsetzung.md). Neuer Branch `fix/ermittlungszentrale-2-2-abnahme` von `main`, einschließlich aller dort noch fehlenden 2.1-Änderungen. Neuer Draft-PR vom Nutzer ausdrücklich beauftragt. Kein Merge, keine Änderung von Pages-Einstellungen, kein Push auf den bisherigen Pages-Quellbranch.

## Umgesetzt und technisch prüfbar

- H1: Lagos auf verifizierte Bildorte/-jahre und sichtbare Bebauung/Blickrichtungen eingegrenzt. Originalrevisionen erneut abgerufen; zusätzliche örtliche Wasser-/Sanitärdaten nicht verifiziert. Keine Versorgungsbehauptungen aus Bildern. [Quellen und Grenze](lagos-quellen-v22.md).
- M1: einfache Arbeitsaufträge, kurze Kernsätze, längere Grenzen unter „Mehr erfahren“, deutsche Worthilfen auch im Wörterbuch. Sieben Sprachen und 197 Einträge unverändert; keine erfundenen Übersetzungen.
- M2: individuelle, freundliche Erklärungen zu jeder fachlichen Antwortoption. Richtige Antwort bestätigen; falsche Auswahl nennen und konkret erklären; passendes Ergebnis nennen. Vermutung und Reflexion ohne Richtig-falsch-Wertung. Keine Punkte oder neuen Versuchsgrenzen.
- M3: Wörterbuch merkt seine Startschaltfläche und stellt nach Schließen/Escape den Fokus ausdrücklich wieder her. Escape funktioniert auch im gefüllten Suchfeld; Entwürfe und Punkte bleiben erhalten.
- N1–N4: präziser Klassenraumtitel; drei sichtbare Satzanfänge mit freier Alternative; getrennte Punktefelder; Starthilfe empfiehlt Safari/normalen Browser statt eines vermeintlich fehlenden HTTP-Servers.
- Lösungsverrat entfernt: „Vier Fotos zeigen …“ bleibt offen und wird erst nach Akte 002 ergänzt. Schülerbogen genau zwei neutrale A4-Seiten, Lehrerunterlagen 13 nummerierte Seiten. Alle Seiten digital gerendert und angesehen.
- Fünf Akten, drei Länder, zehn Lernschritte, zwölf gemeinsame Bildnummern, 24 Fotodateien, Hinweis-/Teilpunktlogik und 30+5 Punkte erhalten. 2.1-Sitzungen bleiben kompatibel. [Tatsächlich durchgeführte Tests](testbericht.md).

## Offene menschliche und örtliche Abnahmen

`npm run audit:release`: **20 offene Kategorien**, Exit-Code 2. Die bisher 19 Kategorien bleiben bestehen; das ausdrücklich beauftragte Schulnetz wird jetzt zusätzlich separat erfasst. Keine bereits offene Prüfung wurde automatisch bestätigt.

| Bereich | Offener Umfang |
|---|---|
| Wörterbuchlücken: sechs Kategorien | ru 1, uk 2, tr 2, ar 1, ku 13, ckb 13; zusammen 32 leere Werte. Polnisch vollständig befüllt. |
| Sprachkundige Prüfung: sieben Kategorien | Alle sieben Sprachen. Quellen-/Schriftprüfung ist keine muttersprachliche Abnahme. |
| Echtes Schul-iPad / Safari | Linux-WebKit und simulierte iPad-Parameter ersetzen kein Gerät. |
| Schulnetz | Noch nicht im tatsächlichen Schulnetz getestet. |
| Reale Druckprobe | Beidseitiger Druck auf dem vorgesehenen Drucker noch offen. |
| Lerngruppe | Verständlichkeit, Bedienwechsel, Lernwirkung und Bearbeitungszeit nicht mit der Klasse erprobt/gemessen. |
| Curriculum-Originale | Originaldateien/aktuelle Geltung weiter ungeprüft. Keine erfundenen amtlichen Kompetenznummern. |
| Sachquellen-Originale | Renault/SIGA/UNESCO-Abgleich teilweise technisch blockiert; Status in Lehrerunterlagen ausgewiesen. |
| Öffentliche Browserabnahme | Neue Version nicht veröffentlicht; der bisherige öffentliche Abruf ist aus dieser Cloud gesperrt. Keine reparierte öffentliche Codex-Vorschau behauptet. |

`data/review.json`: alle sieben sprachkundigen Abnahmen, echtes Safari-Gerät, Druck, Lerngruppe und Originalabgleiche bleiben falsch. Neu `v22.schoolNetwork: false`. Keine pauschale Unterrichts-, Sprach- oder Datenschutzfreigabe.

Vor endgültiger Übernahme: Auf echtem Schul-iPad quer/hoch alle Akten, Tastatur, Wörterbuch-Schließen/Escape, Arabisch/Sorani, Fotozoom, Hinweise und Teilauflösung nach Navigation/Neuladen prüfen. Im Schulnetz laden, PDF in Safari öffnen und beidseitig drucken. Mit Lerngruppe Sprache, Zeit und Wirkung erproben. Erst nach tatsächlicher Durchführung zugehörige Statusfelder bestätigen.
