# Lokale Übergabe · Ermittlungszentrale 2.1

Stand 21.10.2026. Branch `feature/detektivspiel-komplett`, Grundlage `d8a4c4cdbfa51f059bcca362cbccef31719d4c86`. Änderungen lokal committet; die konkrete Commit-ID steht im Abschlussbericht und im Bundle. Keine Remote-Schreibaktion, kein eigener Merge und kein Deployment von 2.1. Auftrag Abschnitt 12 verlangt eine erneute ausdrückliche Freigabe vor Push.

## Überprüfbarer Stand

[Umsetzung und alle zehn Abschlussfragen](v21-umsetzung.md), [Testbericht](testbericht.md), [Abnahme](abnahme.md), [Bildquellen](bildquellen.md). 254 Node- und 270 Browserprüfungen bestanden, einschließlich tatsächlich ausgeführtem Linux-WebKit. Acht zusätzliche vollständige HTTP-Prüfläufe auf neu gestartetem Node-Server und unabhängigen Python-Servern bestanden; alle 24 Fotos dekodiert. Alle 15 PDF-Seiten digital gerendert und angesehen. Audit weiterhin 19 offene Kategorien, kein erfundener menschlicher Prüfstatus.

Neue [Bildauswahl](qa/v21/desktop/akte-002.jpg), [Redaktion](qa/v21/ipad/akte-002-redaktion.jpg), [Bildung/Medizin](qa/v21/ipad/akte-003-neue-beweise-education-health.jpg), [Wasser](qa/v21/webkit/akte-003-neue-beweise-water-access.jpg). Weitere Nachweise unter `docs/qa/v21/`; dort auch das SHA256-Manifest der geprüften Dateien.

## Lokal starten

```sh
cd /workspace/Ermittlungszentrale
npm start
```

HTTP unter `http://localhost:4173/` oder `/Ermittlungszentrale/`, vollständiges Menü mit fünf Schaltflächen. Der Prozess muss laufen. Startregression mit installiertem Chromium und Entwicklungsabhängigkeiten:

```sh
npm ci
npm run check:start -- http://127.0.0.1:4173/ http://127.0.0.1:4173/Ermittlungszentrale/
```

Dies prüft die tatsächliche gesamte Anwendung. Cloud-Portweiterleitung ist hier kein bedienbares Werkzeug; es wird keine öffentliche Codex-Vorschauadresse erfunden. Die öffentliche Pages-Adresse scheitert weiterhin am Proxy-CONNECT und 2.1 ist noch nicht veröffentlicht. [Genaue Grenzen](vorschau.md).

## Archiv und Wiederherstellung

Separat im Übergabeordner `/workspace/attachments/`: vollständiges Projektarchiv `Ermittlungszentrale-v2.1.zip`, vollständiges Git-Bundle `Ermittlungszentrale-v2.1.bundle`, kompakte Änderungsliste `Ermittlungszentrale-v2.1-diff.txt`, Laufzeitpaket `Ermittlungszentrale-v2.1-Spiel.zip` und `Ermittlungszentrale-v2.1-SHA256.txt` mit Dateiprüfsummen. Keine installierten Abhängigkeiten oder Zugangsdaten enthalten. Die großen Originaldownloads liegen nicht im Spielarchiv; sie sind über Original-URLs und Hashes in den Quellen genau bestimmbar. Die lokalen optimierten Fotos und alle Lizenzbelege sind enthalten.

Vollständige Git-Wiederherstellung ohne GitHub-Schreibzugriff:

```sh
git clone -b feature/detektivspiel-komplett Ermittlungszentrale-v2.1.bundle Ermittlungszentrale-v21
cd Ermittlungszentrale-v21
sha256sum -c docs/qa/v21/verified-files.sha256
npm start
```

Das vollständige Projektarchiv enthält auch Tests und QA-Nachweise. Das kleinere Spielpaket enthält Laufzeit, Server, Materialien, Quellen und Lizenzen; große QA-Bilder sind dort ausgelassen. Für Entwicklung und Prüfprotokolle das vollständige Archiv/Bundle verwenden. Start ohne npm-Installation möglich: `npm start` braucht nur Node; Browser-/PDF-Prüfungen benötigen die dokumentierten Entwicklungswerkzeuge.

## Tatsächlicher PR-Zustand und möglicher späterer Push

Reine GitHub-Lesekontrolle: PR #1 ist am 21.10.2026 um 09:08:09 UTC bereits gemergt/geschlossen worden, Merge-Commit `3a6274f732696048a4d45ee63964992b02f9ef58`. Sein alter Head ist `d8a4c4c`; der Remote-Entwicklungsbranch steht weiterhin dort. `main` ist dieser Merge mit demselben Ausgangs-Anwendungsbaum. [API-Antwort](qa/v21/github-readonly.json). In dieser Überarbeitung keine dieser Remote-Aktionen ausgeführt.

Ein neuer Push kann den gemergten PR nicht mehr ergänzen. Kein zweiter PR wird eigenständig erstellt. Nach ausdrücklicher Freigabe wäre der Push auf **denselben Entwicklungsbranch** und anschließend die GitHub-Vergleichsansicht `main...feature/detektivspiel-komplett` ein nachvollziehbarer Änderungsnachweis. Der bestehende Pages-Workflow kann dabei automatisch veröffentlichen; deshalb Freigabe erst nach Sichtung dieses lokalen Ergebnisses. Keine Pages-Einstellungen ändern und kein Force-Push.
