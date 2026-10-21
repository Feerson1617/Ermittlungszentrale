# Start und Vorschau: Befund und Prüfweg

Stand: 21.10.2026. Gesamttests am 20.10., abschließender Server-/Browsercheck am 21.10.2026. Die geprüfte Startkorrektur ist für den bestehenden Entwicklungsbranch und PR #1 freigegeben. Die öffentliche Website und die Codex-Vorschau werden ausdrücklich nicht als repariert oder abgenommen bezeichnet.

## Tatsächlich beobachtet

Die vom Projektteam genannte Adresse `https://feerson1617.github.io/Ermittlungszentrale/` ist GitHub Pages. Sie ist keine weitergeleitete Codex-Serveradresse. Die GitHub-API meldete `status: built`, `build_type: legacy`, Quelle `feature/detektivspiel-komplett`, Pfad `/` und als letzten erfolgreich veröffentlichten Commit `84f5467896df9c6627af70594a0851940649d326` (20.10.2026, 17:54 UTC).

Zu Beginn lief in dieser Cloud-Aufgabe kein Anwendungsserver; Port 4173 war nicht belegt. Nach `npm start` funktionierte bereits der unveränderte Stand unter `/` und `/Ermittlungszentrale/`: fünf Akten, angewendete CSS-Gestaltung, keine Browserfehler und HTTP 200 für CSS, alle importierten Module und die drei JSON-Dateien. Die relativen Import- und Ressourcenpfade sind dort korrekt. Es wurde kein allgemeiner CSS-, Modul- oder Bewertungsfehler im bisherigen normalen HTTP-Start nachgewiesen.

Bestätigte Fehler:

1. Die bisherige Fehlerbehandlung lief erst innerhalb von `js/app.js`. Wenn dieses Einstiegsmodul oder ein statischer Import nicht geladen/ausgeführt werden konnte, wurde `boot().catch(...)` nie erreicht. Die Seite blieb ohne Fehlermeldung bei „Die Akten werden geöffnet …“. Ausgefallenes CSS wurde ebenfalls nicht erkannt, ein hängender Abruf hatte kein Zeitlimit. Dies reproduziert den hängenbleibenden Start bei blockierten/fehlenden Ressourcen, beweist aber nicht den Auslöser auf der öffentlichen Website.
2. Der Entwicklungsserver lieferte für `/Ermittlungszentrale` ohne abschließenden Slash HTTP 404. Das ist korrigiert. Die gemeldete öffentliche Adresse enthält bereits den Slash; dieser Fehler wird daher nicht als Ursache ihres Ausfalls ausgegeben.

**Die tatsächliche Ursache des vom Projektteam beobachteten Ausfalls auf GitHub Pages bleibt unbestätigt.** Der direkte HTTPS-Abruf wird in dieser Cloud vom Egress-Proxy beim CONNECT mit HTTP 403 abgewiesen. Das ist keine vom GitHub-Pages-Server gelieferte 403-Antwort. Ohne Abruf gibt es keine belastbaren Live-Statuscodes, MIME-Typen, Browserkonsolen- oder CSP-Befunde dieser Website. Der Versuch, die konkrete Domain `feerson1617.github.io` im bekannten Cloud-Konfigurationsentwurf zu ergänzen, scheiterte mit `draft_not_editable`; die Freigabe wurde nicht als gespeichert oder wirksam behauptet. `environment_status` meldete während der ersten Diagnose außerdem „The environment configuration changed“. Am 21.10. ist die Cloud wieder als verbunden gemeldet; die Domain fehlt weiterhin in der bekannten Liste, und der reale HTTPS-Abruf scheitert erneut beim Proxy-CONNECT mit 403. Die zuletzt gelesene Entwurfs-ID/Revision ist unverändert; eine unveränderte Speicherung wurde nicht blind erneut versucht.

Es gibt in den verfügbaren Werkzeugen keinen bedienbaren Codex-Vorschau-/Portweiterleitungsendpunkt. Die Browserprüfung konnte daher nur den tatsächlich laufenden HTTP-Server in dieser Maschine öffnen. Eine öffentliche Codex-Vorschau-URL wurde nicht erfunden. Falls in Codex nur eine Einzeldateivorschau unterstützt wird, kann sie die Anwendung mit Modulgraph und JSON-Dateien nicht ersetzen. Die folgenden HTTP-Startwege sind die geprüfte Alternative.

## Korrektur

- `index.html`: kleine frühe Startüberwachung vor dem Stylesheet und dem Modulgraphen. Ein exakter SHA256-Hash erlaubt ausschließlich dieses Inline-Skript in der bestehenden CSP; kein `unsafe-inline`, keine externen Dienste. Statische Starthilfe bleibt auch bei vollständig gesperrtem JavaScript sichtbar.
- Die Überwachung prüft den CSS-Ladezustand und den vorhandenen Spielstil, fängt dynamische Importfehler und erzwungene CSP-Verletzungen ab und zeigt nach 18 Sekunden eine verständliche Fehlermeldung. Abgebrochene Datenabrufe dürfen später keinen halbfertigen Start überschreiben. Ein Link lädt die Seite erneut.
- `js/app.js`: exportiert den bisherigen Start als `boot`, verwendet ein Abbruchsignal und unterscheidet HTTP-Fehler, falschen JSON-MIME-Typ, ungültiges JSON und unpassendes Datenformat. Spielabläufe, Lösungen und Bewertungsregeln bleiben erhalten.
- `scripts/serve.mjs`: HTTP 308 für fehlenden Verzeichnis-Slash mit erhaltener Query; unveränderliche Projektwurzel unabhängig vom Arbeitsverzeichnis, korrekte MIME-Typen einschließlich `.mjs`/`.geojson` und `nosniff` für erfolgreiche Dateien. Fehlende Dateien bleiben echte 404-Antworten und werden nicht als HTML-Fallback mit Status 200 ausgegeben.
- `scripts/check-start.mjs`/`package.json`: Prüfung einer bereits laufenden HTTP(S)-Adresse, ohne eigenen Testserver. `playwright.config.mjs`: zusätzliches Desktop-Profil. Neue Tests: `tests/startup.test.mjs`, `tests/browser/startup.spec.mjs` und der gemeinsame Prüfer `tests/browser/start-check.mjs`. README, Abnahme, Testbericht und PR-Notiz sind aktualisiert; Startbilder und HTTP-Protokolle liegen unter `docs/qa/start-*`.
- Neue Regressionstests prüfen sichtbare Gestaltung, Motiv, vier normale Akten und die Bonusakte, alle fünf Bedienwege, alle 15 im Spiel dekodierten Fotos, Wörterbuch und Hinweise/Punkte. Fehlerfälle decken CSS, Einstieg, transitiven Import, JSON-Status/MIME/Inhalt, hängende CSS-/Modul-/Datenabrufe und eine übergeordnete Skriptsperre ab.

Eine fremde CSP oder ein Sandbox-Attribut, das sämtliches JavaScript untersagt, kann die Anwendung selbst nicht lockern. Dann bleibt die verständliche statische Starthilfe stehen; benötigt wird eine vollständige Servervorschau. Diese Grenze wird ausdrücklich getestet.

## Geprüfter Startweg

Im vollständigen Projektordner, mit Node.js 24:

```sh
cd /workspace/Ermittlungszentrale
npm start
```

Der Prozess muss weiterlaufen. Er hört auf `0.0.0.0:4173`. Im eigenen lokalen Browser ist die Serveradresse `http://localhost:4173/` oder `http://localhost:4173/Ermittlungszentrale/`. Diese lokalen Adressen sind keine öffentlich erreichbaren Links in einer Cloud-Oberfläche. Dort muss die unterstützte Portweiterleitung auf Port 4173 zeigen und die gesamte Anwendung bereitstellen. Nur `index.html` als Datei/Anhang zu öffnen reicht nicht. Prozesse überleben neue Cloud-Aufgaben nicht automatisch.

Der folgende Prüfaufruf startet **keinen Testserver** und verwendet keine gemockten Ressourcen:

```sh
npm run check:start -- http://127.0.0.1:4173/ http://127.0.0.1:4173/Ermittlungszentrale/
```

Er öffnet beide Pfade in Desktop- und iPad-Querformat, prüft die sichtbare Anwendung, öffnet alle Akten, bedient Auswahl/Wörterbuch, löst Akte 001 nach einem Hinweis mit drei Punkten und alle drei Länderfälle mit je fünf Punkten. Alle 15 Fotografien müssen im Spiel erfolgreich dekodieren. HTTP-Status, MIME-Typen, CSP, Konsolen-/Ressourcenfehler und Screenshots landen unter `artifacts/start-check/`; der Befehl endet bei Fehler mit einem Fehlercode. Dafür sind die Entwicklungsabhängigkeiten (`npm ci`) und Chromium erforderlich. Der reine Spielserver braucht keine npm-Abhängigkeiten.

Denselben Aufruf mit einer tatsächlich bereitgestellten Vorschau-URL verwenden. Ein Erfolg gegen den lokalen Server ist kein Live-Nachweis für diese andere URL.

## Statische Alternative und Pages-Kompatibilität

Der vollständige Projektordner lässt sich auch ohne den Node-Server ausliefern:

```sh
python3 -m http.server 4175 --bind 127.0.0.1 --directory /workspace/Ermittlungszentrale
```

Für einen Projektunterpfad kann aus dem übergeordneten Verzeichnis ausgeliefert werden:

```sh
python3 -m http.server 4174 --bind 127.0.0.1 --directory /workspace
```

Dann liegt die Anwendung unter `/Ermittlungszentrale/`. Beide Varianten wurden unabhängig vom Node-Server mit `check:start` im Browser geprüft. Es sind weiterhin nur statische relative Ressourcen nötig; kein Build und keine spezielle Serverweiterleitung für die Spielnavigation. `.nojekyll` bleibt erhalten.

## Gesicherte Nachweise

- [Desktop-Menü](qa/start-desktop.png), [iPad-Viewport-Menü](qa/start-ipad.png): nach dem Neustart des Servers am 21.10.2026 aufgenommen und visuell geprüft.
- [HTTP-/Konsolenprotokoll Node](qa/start-http-node.json): vier erfolgreiche Läufe mit jeweils null Konsolen-, Ressourcen- und externen Requestfehlern; mit tatsächlicher Dokument-CSP und MIME-Typen.
- [HTTP-/Konsolenprotokoll unabhängiger statischer Server](qa/start-http-static.json): ebenfalls vier erfolgreiche Läufe.
- [Gesamttests und Grenzen](testbericht.md): 192 Node-Tests, 152 Browserfälle einschließlich 38 WebKit; PDF-Prüfung bestanden.

## GitHub-Übergabe und ausdrückliche Freigabe

**Die aktuelle Pages-Konfiguration veröffentlicht den Entwicklungsbranch automatisch. Ein Push auf `feature/detektivspiel-komplett` kann daher gleichzeitig ein Deployment auslösen.** Der Push war zunächst wegen des Deployment-Verbots zurückgestellt. Am 21.10.2026 hat das Projektteam die konkrete Nachfrage zum Push von Commit `5496125` trotz automatischer Pages-Veröffentlichung mit „Ja“ beantwortet. Damit ist dieser Push einschließlich der begleitenden Statusdokumentation freigegeben. Die Pages-Einstellungen bleiben unverändert; es wird kein separater Build-/Deployment-Endpunkt aufgerufen. PR #1 bleibt der einzige Draft-PR; kein Merge in `main`. Eine erfolgreiche Pages-Buildmeldung wäre weiterhin keine Browser- oder Geräteabnahme der Live-Seite.

Für eine spätere direkte Live-Diagnose wird Netzwerkzugriff auf `feerson1617.github.io` benötigt. Danach HTML, `css/style.css`, `js/app.js`, den gesamten Modulgraphen und `data/{rubrics,dictionary,media}.json` auf der tatsächlichen Website abfragen und `check:start` mit genau dieser URL ausführen. Erst ein erfolgreicher Live-Lauf erlaubt die Aussage, dass diese Vorschau funktioniert.
