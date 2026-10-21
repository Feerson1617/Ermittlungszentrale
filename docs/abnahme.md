# Abnahme der Version 2.1

Stand: 21.10.2026. Grundlage: unveränderter [Auftrag 2.1](../sources/auftrag-v2.1.md), ausgehend vom tatsächlich geprüften Entwicklungsstand `d8a4c4c` auf `feature/detektivspiel-komplett`. Gezielt überarbeitet, kein Neubau. Die nach Abschnitt 12 erforderliche Freigabe wurde nach lokaler Prüfung ausdrücklich erteilt: **Implementierungscommit `e422525` gepusht, ohne Merge.** PR #1 ist bereits geschlossen und wurde nicht aktualisiert. Der vorhandene Pages-Build wird automatisch angestoßen. Kein Merge und keine Änderung von Pages-Einstellungen.

## Lokal umgesetzt

- Fünf unabhängig startbare Akten; sieben Wertungen, 30 Hauptpunkte und fünf getrennte Bonuspunkte. Hinweislimit 5/3/2/1, Teilpunkte mit unbezahlter Auflösung, Entwurfserhalt, Namensklärung und Papierbestätigung erhalten.
- Gemeinsamer Katalog weiterhin genau zwölf Fotos in Akte 002/004. Nur Nummern 7/8/9/11/12 erhalten neue Identitäten: Lehmhäuser, Bergbau, Klassenraum, Wassertransport, Gesundheitsstation. Alle 19 bisherigen Dateien und Quellidentitäten bleiben unverändert und im Spiel erreichbar. Insgesamt 24 echte lokale Fotografien, 4,76 MiB.
- Fünf neue Quellen anhand tatsächlicher Commons-Revisionen, Originaldownloads, Ortsangaben, Urheber und Lizenznachweise geprüft. Viermal CC BY-SA 4.0; Gesundheitsstation Public Domain als dokumentiertes US-Regierungswerk mit zusätzlicher gesicherter Lizenzvorlage. [Einzelnachweise und Grenzen](bildquellen.md).
- Erste persönliche Viererwahl vor den Behauptungen. Erfundene Redaktion zeigt 2/5/7/11 und sechs ausdrücklich pauschale Behauptungen. Akte 003 differenziert in zehn unbewerteten Schritten mit vier kurzen Rückbezügen; Akte 004 erlaubt auch unveränderte Auswahl. Kein Schluss auf Armut aus Bauweise, Wasserqualität aus Kanistern oder Klinikdichte aus zwei Fotos.
- Ältere digitale Sitzungen werden wegen der geänderten Bildidentitäten verständlich zurückgesetzt. Innerhalb von 2.1 bleiben getrennte Auswahlen, Entwürfe und Wertungen erhalten. Für einen neuen Durchlauf neuen Papierbogen verwenden; alte Notizen gehören zum alten Katalog.
- Schülerbogen zwei neutrale A4-Seiten; Erwartungshorizont 13 nummerierte A4-Seiten. Alle 15 Seiten digital gerendert und angesehen. Keine reale Druckprobe behauptet.
- Wörterbuchbestand unverändert: 197 Begriffe; ru 196, uk 195, pl 197, tr 195, ar 196, ku 184, ckb 184. Keine erfundenen Werte; deutsche Hilfen für Bergbau, Klischee und Gesundheitsstation ergänzt. [Sprachprüfung](woerterbuch-pruefung.md).
- HTTP-Start, CSS, Motiv, fünf bedienbare Akten, alle Fotos, Wörterbuch, Hinweise/Punkte und beide URL-Pfade sind Teil der Prüfungen. [Tatsächliche Testresultate](testbericht.md); [Umsetzungsmatrix](v21-umsetzung.md).

## GitHub-Befund aus reiner Lesekontrolle

PR #1 wurde laut API am 21.10.2026 um 09:08:09 UTC gemergt und geschlossen, Merge-Commit `3a6274f732696048a4d45ee63964992b02f9ef58`. Nach der neuen Nutzerfreigabe wurde Implementierungscommit `e422525` auf denselben Entwicklungsbranch gepusht; `main` bleibt unverändert auf `3a6274f`. Der Auftrag beschreibt somit einen überholten PR-Zustand. Der Branch-Push aktualisiert den gemergten PR nicht; es wird kein zweiter PR angelegt. Der Branch-Vergleich `main...feature/detektivspiel-komplett` dient als Änderungsnachweis. [API-Befund](qa/v21/github-readonly.json).

## Fachliche Grenzen der fünf neuen Motive

Das Dorfmotiv belegt traditionelle Bauweise, keinen nachgewiesenen Armuts- oder Versorgungsmangel; Leitungen sind sichtbar. Der Tagebau belegt einen konkreten Wirtschaftsort, keine Arbeitsbedingungen oder aktuellen Fördermengen. Der Klassenraum ist auf Landesebene Nigeria verortet, ohne belegten Schulnamen. Der Wassertransport ist auf Landesebene Uganda verortet, ohne belegte Weglänge oder Wasserqualität. Die senegalesische Gesundheitsstation ist präzise benannt und am Schild nachvollziehbar; es ist eine Außenaufnahme, ihre Innenausstattung ist unbekannt. Diese Grenzen sind beschriftet und keine fehlenden Dateien oder frei erfundenen Ortsangaben.

## Weiter offene Abnahmen

`npm run audit:release` meldet **19 offene Kategorien**, Exit-Code 2:

| Bereich | Tatsächlich offen |
|---|---|
| Wörterbuchlücken (sechs Kategorien) | ru 1, uk 2, tr 2, ar 1, ku 13, ckb 13; insgesamt 32 leere Werte. Polnisch vollständig befüllt. |
| Sprachkundige Prüfung (sieben Kategorien) | Alle sieben Sprachen. Redaktionelle Quellen-/Schriftprüfung ist keine muttersprachliche Idiomatik- oder Lerngruppenabnahme. |
| Echtes Schul-iPad / Safari | Vom Projektteam vorgesehen. Linux-WebKit und Geräteparameter ersetzen das Gerät nicht. |
| Curriculum-Originale | Offizielle/schulische Originaldateien nicht zusätzlich mitgeliefert; Fachportal am Proxy blockiert. Keine selbst geprüfte aktuelle Rechtsgeltung. |
| Sachquellen-Originale | Renault/SIGA/UNESCO aus dem bereitgestellten geprüften Auftrag; direkter Originalabgleich teilweise blockiert. Status in `data/learning.js` und Lehrerunterlagen. |
| Reale Druckprobe | Beide Seiten auf tatsächlichem Drucker prüfen; digitales Rendering reicht nicht. |
| Lerngruppe | Zeiten, Verständlichkeit, Bedienwechsel und Lernwirkung ungemessen. Neuer Wasserschritt erhöht Umfang leicht; Drei-Stunden-Alternative vorhanden. |
| Öffentliche Live-Funktion | Bisher am Proxy-CONNECT gesperrt; Der Push löst den vorhandenen Pages-Build aus; dessen Erfolg ersetzt keine Live-Browserabnahme. Keine reparierte öffentliche Codex-Vorschau oder Live-Browserprüfung behauptet. |

`data/review.json` bleibt unverändert. Kein menschlicher Status wird durch automatisierte Prüfungen bestätigt. Keine pauschale Unterrichts-, Datenschutz- oder Sprachfreigabe.

## Prüfung durch das Projektteam

Auf echtem Schul-iPad: Menü quer/hoch, alle Akten, zwölf Auswahlfotos und neue Belege scrollen/vergrößern, Bildschirmtastatur, Arabisch/Sorani, Dialoge/Fokus, Hinweis-/Teilauflösung nach Navigation/Neuladen prüfen. PDF in Safari öffnen und beidseitig drucken. Speicher testweise sperren; bei gesperrtem Speicher geht Neuladen mit Verlust des digitalen Standes einher. Mit Lerngruppe Zeit und Wirkung prüfen. Erst nach tatsächlicher Durchführung zugehörige Statusfelder bestätigen.

Andere Akten und bewusst geöffnete Quellen können das Thema vor Akte 001 verraten. Der öffentliche Quellcode schützt Lösungen nicht technisch. Die App sendet keine Schülerantworten an externe Dienste; der statische Host kann Zugriffsprotokolle führen.
