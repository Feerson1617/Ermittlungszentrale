Die in `main` noch fehlende Version 2.1 wird vollständig übernommen. Darauf korrigiert Version 2.2 die im Abschlussauftrag beschriebenen didaktischen, sprachlichen und Bedienprobleme: konkrete Antworten erklären, kurze Arbeitsaufträge, zuverlässiger Wörterbuch-Fokus und ein Schülerbogen ohne vorweggenommene Erkenntnis. Fünf Akten, alle Fotos und die Bewertung bleiben erhalten.

## Aus Version 2.1 gegenüber main nachgeführt

- Basis ist `main` bei `3a6274f` (bewusst gemergter PR #1). Die dort fehlenden Commits `e422525` und `b219afb` wurden als `cf3b644` und `87c13c0` übernommen. Der Dateibaum entsprach danach exakt dem bisherigen vollständigen 2.1-Branch.
- Fünf neue Auswahlmotive 7/8/9/11/12: Lehmhäuser, Bergbau, Klassenraum, Wassertransport und Gesundheitsstation. Alle 19 vorherigen Fotos erhalten; zusammen 24 lokale authentische Fotos mit Lizenz-/Ortsbelegen.
- Gemeinsamer Zwölferkatalog für Akte 002/004, erfundene Redaktion 2/5/7/11, sechs klar getrennte Behauptungen und vier unbewertete Rückbezüge in Akte 003. Zehn Lernschritte und kompatible Sitzungsverwaltung.

## Neu in Version 2.2

- **H1:** Lagos Island 2016 und Makoko 2019 anhand erneut abgerufener Originalrevisionen gesichert. Zusätzliche örtliche Wasser-/Sanitärinformationen konnten nicht verifiziert werden. Deshalb die ausdrücklich erlaubte Alternative umgesetzt: Lernziel auf sichtbare Bebauung und Blickrichtungen verengen; keine generischen Versorgungsbehauptungen.
- **M1:** einfache Arbeitsaufträge, kurze Kernsätze, längere Aussagegrenzen unter „Mehr erfahren“. Deutsche Worthilfen auch im Wörterbuch; keine neuen ungeprüften Übersetzungen.
- **M2:** jede fachliche Antwortoption erhält eine konkrete Erklärung. Keine Punkte oder neuen Versuchsgrenzen; Vermutungen und Rückblick ohne Richtig-falsch-Urteil.
- **M3:** Wörterbuch-Auslöser merken und nach Schließen/Escape fokussieren. Escape funktioniert auch bei gefülltem Suchfeld; Entwürfe/Punkte bleiben erhalten.
- **N1–N4:** präziser Klassenraumtitel, drei sichtbare Satzanfänge mit freier Alternative, getrennte Punktefelder und verständliche Browser-Starthilfe ohne CSP-Lockerung.
- **Zusätzlich:** offene Sicherung „Vier Fotos zeigen …“ statt vorgegebener Lösung auf dem Schülerbogen. Gemeinsame Materialdaten aktualisiert: zwei neutrale Schülerseiten und 13 Lehrerseiten, alle digital gerendert und gesichtet.

## Tatsächlich geprüfter Stand

- 303 Node-Tests und 290 Browserprüfungen bestanden: Desktop, iPad quer/hoch, schmales Touch-Format und tatsächlich ausgeführtes Linux-WebKit.
- Acht vollständige Browserdurchläufe auf neu gestartetem Node-Spielserver und unabhängigen statischen Servern bestanden, Root/Projektpfad, alle 24 Fotos dekodiert.
- Alle zehn Lernschritte mit richtigen/falschen Antworten, Wörterbuch-Tastatur/Fokus, Navigation/Neuladen, identische zwölf Auswahlbilder, 30+5 und 5/3/2/1 geprüft.
- PDF-Generierung, Format-/Inhaltsprüfung, Sichtung aller 15 Seiten, Bild-/Quellen-/Kartenintegrität und `git diff --check` bestanden.
- Release-Audit erwartungsgemäß Exit 2 mit 20 offenen Kategorien: die bisherigen 19 plus explizit erfasster Schulnetztest. Echtes Schul-iPad, Schulnetz, sprachkundige Kontrolle, realer Druck und Lerngruppe/Zeitmessung bleiben offen; kein solcher Prüfstatus erfunden.

[Befundmatrix](https://github.com/Feerson1617/Ermittlungszentrale/blob/fix/ermittlungszentrale-2-2-abnahme/docs/v22-umsetzung.md) · [Prüfbericht und Screenshots](https://github.com/Feerson1617/Ermittlungszentrale/blob/fix/ermittlungszentrale-2-2-abnahme/docs/testbericht.md) · [Lagos-Quellen](https://github.com/Feerson1617/Ermittlungszentrale/blob/fix/ermittlungszentrale-2-2-abnahme/docs/lagos-quellen-v22.md) · [Abnahme](https://github.com/Feerson1617/Ermittlungszentrale/blob/fix/ermittlungszentrale-2-2-abnahme/docs/abnahme.md).

Dieser PR bleibt **Draft und offen**. Kein Merge, kein Push auf `feature/detektivspiel-komplett`, keine Pages-Einstellungen geändert und keine Veröffentlichung von 2.2 auf Pages. Der Nutzer entscheidet über die Übernahme.
