# Die Ermittlungszentrale in itslearning öffnen

## ZIP herunterladen

1. Den [SCORM-Build auf GitHub](https://github.com/Feerson1617/Ermittlungszentrale/actions/runs/40178307900)
   öffnen. Der fertige Lauf muss ein **grünes Häkchen** haben.
2. Unten bei **Artifacts** auf **Ermittlungszentrale-SCORM-1.2** klicken.
   Dafür ist die Anmeldung im bereits vorhandenen GitHub-Konto erforderlich.
3. GitHub liefert eine äußere Download-ZIP. Diese **als Lehrkraft einmal öffnen**
   und die darin enthaltene **`Ermittlungszentrale-SCORM-1.2.zip`** entnehmen.
   Diese innere SCORM-ZIP **geschlossen lassen**. Nicht „Code → Download ZIP“ verwenden.

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
