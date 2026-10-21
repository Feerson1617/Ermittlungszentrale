# Wiederherstellung und Übergabe – Version 2.0

Geprüfte Anwendung: `c213e9fcb96d07a8830838e1a4b6881b5cedf62b`. Die anschließende Dokumentationsänderung ergänzt Prüfbericht/Übergabe ohne Änderung der Anwendung. Ausgangsstand: `ede9a89234c880bb81f7a4d1f64d6a9f741b101c`. Branch `feature/detektivspiel-komplett`; bestehender [Draft-PR #1](https://github.com/Feerson1617/Ermittlungszentrale/pull/1) gegen `main`.

## Wiederherstellbare Dateien

Die Übergabedateien werden neben der Arbeitskopie unter `/workspace/attachments/` bereitgestellt:

- `Ermittlungszentrale-v2.bundle`: vollständige Git-Historie des Entwicklungsbranches einschließlich der Abschlussdokumentation.
- `Ermittlungszentrale-v2.zip`: vollständig statisch nutzbarer Projektstand, keine `node_modules`, Zugangsdaten oder Browserprofile.
- `Ermittlungszentrale-v2-diff.txt`: prüfbarer Textdiff gegen den Ausgangsstand; Bilder/PDFs zusätzlich im Archiv und Git-Bundle.
- `Ermittlungszentrale-v2-remote.json`: nach Push erhobener Branch-/PR-/Pages-Buildstand; ein Buildnachweis ersetzt keine Live-Funktionsprüfung.
- `Ermittlungszentrale-v2-Ausgangsstand.bundle`: separat gesicherter Ausgangsstand vor dieser Überarbeitung.

Git-Bundle wiederherstellen:

```sh
git clone --branch feature/detektivspiel-komplett Ermittlungszentrale-v2.bundle Ermittlungszentrale
cd Ermittlungszentrale
npm start
```

ZIP-Alternative: entpacken, im enthaltenen Ordner `Ermittlungszentrale` `npm start` ausführen. Spielserver: `http://localhost:4173/` oder `/Ermittlungszentrale/`. Kein Installationsschritt fürs Spielen. Cloud-Portweiterleitung muss den gesamten HTTP-Server bereitstellen; keine Einzeldateivorschau. Der Server muss während der Benutzung laufen.

## Prüfen

```sh
sha256sum -c docs/qa/v2/verified-files.sha256
npm ci
npm test
npm run test:e2e
npm run test:pdf
npm run audit:release
```

WebKit und Entwicklungsbibliotheken nach README bereitstellen. Fertige PDFs/Fotos sind im Archiv enthalten. Für die PDF-Prüfung Python/pypdf installieren. Das Release-Audit endet wegen 19 offen dokumentierten Kategorien mit Code 2; technische Tests getrennt bewerten. [Testbericht](testbericht.md), [Abnahme](abnahme.md), [Befundmatrix](v2-umsetzung.md).

## Veröffentlichung und Grenzen

Der Nutzer hat diese Version einschließlich Push, PR-Aktualisierung und Deployment ausdrücklich beauftragt. Nur der bestehende Entwicklungsbranch/PR wird aktualisiert, kein neuer PR und kein Merge. Die vorhandene Legacy-Pages-Konfiguration veröffentlicht automatisch aus diesem Branch und `/`; keine Pages-/Umgebungsberechtigungen ändern.

Aktueller Branch und Build können unabhängig über die GitHub-API geprüft werden:

```sh
gh api repos/Feerson1617/Ermittlungszentrale/pulls/1 --jq '{head:.head.sha,branch:.head.ref,draft,base:.base.ref}'
gh api repos/Feerson1617/Ermittlungszentrale/pages/builds/latest --jq '{commit,status,updated_at}'
```

Die nach dem Push gesicherte JSON-Antwort liegt zusätzlich bei den Übergabedateien. Der vorliegende Bericht behauptet weder eine durchgeführte echte iPad-/Sprachabnahme noch eine reparierte Codex-Webvorschau. Der direkte öffentliche Zugriff scheitert aus dieser Cloud am Proxy-CONNECT. Die lokale Node-/statische Alternative ist vollständig geprüft. Für die echte öffentliche Browserabnahme `check:start` mit genau der veröffentlichten URL verwenden, sobald der Zugriff möglich ist.
