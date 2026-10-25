# Die Ermittlungszentrale in itslearning öffnen

**Stand: bereit für den itslearning-Praxistest.**

[Aktuelle SCORM-Exporte in GitHub Actions](https://github.com/Feerson1617/Ermittlungszentrale/actions/workflows/scorm-itslearning.yml) · [früherer erfolgreicher Testlauf (noch mit äußerer Transport-ZIP)](https://github.com/Feerson1617/Ermittlungszentrale/actions/runs/40182137568).

## ZIP herunterladen

1. Den [SCORM-Build auf GitHub](https://github.com/Feerson1617/Ermittlungszentrale/actions/workflows/scorm-itslearning.yml)
   öffnen. Der fertige Lauf muss ein **grünes Häkchen** haben.
2. Im erfolgreichen **neuen** Workflow-Lauf unter **Artifacts** direkt auf **`Ermittlungszentrale-SCORM-1.2.zip`** klicken (GitHub-Anmeldung erforderlich).
3. **Genau diese heruntergeladene ZIP unverändert** in itslearning importieren. Sie enthält `imsmanifest.xml` in ihrer Wurzel. **Nicht entpacken, nicht neu komprimieren.** Nicht „Code → Download ZIP“ verwenden.

   **Hinweis für alte Läufe:** Das oben verlinkte historische Artefakt enthält noch eine zusätzliche GitHub-Transport-ZIP. Diese einmal entpacken und nur die darin enthaltene SCORM-ZIP verwenden.

## In itslearning importieren

1. Im Kurs **Inhaltspaket importieren** wählen.
2. **`Ermittlungszentrale-SCORM-1.2.zip`** hochladen und **SCORM 1.2** auswählen.
3. Den neuen Kursinhalt zunächst mit einem Test-Schülerzugang öffnen.
   Auf einem echten Schul-iPad Hoch-/Querformat, Wörterbuch, Bilder, Navigation
   und Neuladen prüfen. Diese reale Geräte-/Plattformprobe steht noch aus.

Danach öffnen die Schülerinnen und Schüler nur den Kursinhalt in Safari.
**Keine zusätzliche App, kein Entpacken und kein Datei-Download zum Spielen.**
Der leere Ermittlungsbogen bleibt als PDF verfügbar.

Das Spiel behält alle fünf Akten und 30+5 mögliche Punkte. Punkte und Antworten
werden **nicht** als SCORM-Ergebnisse an itslearning übertragen; die Punkte
werden wie bisher auf Papier gesichert. Die Plattform kann unabhängig davon
Kurszugriffe und technische Sitzungen protokollieren.

[Technische Anleitung und Datenschutz](scorm-itslearning.md) ·
[Testbericht und verbleibende manuelle Prüfungen](scorm-testbericht.md).

Neue Builds lassen sich über den Workflow **SCORM 1.2 für itslearning** erzeugen.
Die ZIP-Artefakte bleiben 90 Tage gespeichert. Vor einem Merge läuft der Build
beim Push auf den SCORM-Branch; nach Verfügbarkeit des Workflows auf `main`
ist auch **Actions → Run workflow** möglich. Kein Terminal erforderlich.
