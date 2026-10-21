# HTTP-Start und Vorschau der Version 2.2

Stand: 21.10.2026. Die vom Projektteam genannte Adresse `https://feerson1617.github.io/Ermittlungszentrale/` ist **GitHub Pages**, keine weitergeleitete Codex-Serveradresse. Die lokale Anwendung und die tatsächliche öffentliche Website werden getrennt beurteilt.

## Bestätigter Fehler und verbleibende Diagnosegrenze

Beim ursprünglichen Ausfall griff die Fehlerbehandlung erst in `js/app.js`. Wenn dieses Einstiegsmodul oder ein statischer Import nicht ausgeführt wurde, konnte `boot().catch(...)` nie laufen. Ausgefallenes CSS und hängende Abrufe wurden ebenfalls nicht ausreichend erkannt. Diese reproduzierten Ladebedingungen ließen die Seite dauerhaft bei der Lademeldung stehen.

Die frühe Überwachung in `index.html` behebt diese Fehlerklasse: CSS-Zustand/Stil, dynamischer Modulimport, Datenfehler und Zeitlimit nach 18 Sekunden führen zu verständlicher Starthilfe. Ein exakter SHA256-Hash erlaubt ausschließlich dieses kleine Inline-Skript in der CSP, ohne `unsafe-inline`. Eine statische Erklärung bleibt bei vollständig gesperrtem JavaScript sichtbar. Späte Abrufe dürfen den abgebrochenen Start nicht überschreiben. Version 2.2 erhält die Überwachung und ergänzt verständliche Browserhilfe: direkt in Safari oder einem normalen Browser öffnen; eingebettete Vorschauen können Spieldateien blockieren. Der exakte CSP-Hash wurde passend zum geänderten Wächter neu berechnet, ohne unsafe-inline.

Zusätzlich war `/Ermittlungszentrale` ohne Slash auf dem Entwicklungsserver eine 404-Antwort; inzwischen folgt HTTP 308 auf `/Ermittlungszentrale/`, Query bleibt erhalten. Fehlende Dateien bleiben echte 404-Antworten; kein HTML-Fallback mit Status 200. CSS, ES-Module, JSON, SVG, WebP und PDFs werden mit passenden MIME-Typen ausgeliefert, erfolgreiche Ressourcen mit `nosniff`.

**Der konkrete Auslöser des damaligen öffentlichen GitHub-Pages-Ausfalls ist nicht nachgewiesen.** Bereits der normale HTTP-Start des Ausgangsstands funktionierte lokal. Der direkte öffentliche HTTPS-Abruf scheitert aus dieser Cloud beim Egress-Proxy-CONNECT mit 403. Das ist keine vom Pages-Server gelieferte HTTP-403-Seite. Daher liegen hier keine belastbaren Live-Konsole-, MIME-, CSP- oder Ressourcenbefunde dieser Website vor. Es wurden für Version 2.1 keine Netzwerk-/Pages-Berechtigungen geändert.

Unter den verfügbaren Werkzeugen gibt es keinen bedienbaren Codex-Vorschau-/Portweiterleitungsendpunkt. Geöffnet und geprüft wird der tatsächlich laufende HTTP-Server in dieser Maschine. Es wird keine öffentliche Codex-Vorschauadresse erfunden und keine reparierte Codex-Webvorschau behauptet. Eine übergeordnete CSP/Sandbox kann das Spiel selbst nicht lockern; eine Einzeldateivorschau ersetzt keinen vollständigen statischen Server.

## Richtiger Startweg

```sh
cd /workspace/Ermittlungszentrale
npm start
```

Der Prozess muss weiterlaufen und hört auf `0.0.0.0:4173`. Im lokalen Browser: `http://localhost:4173/` oder `http://localhost:4173/Ermittlungszentrale/`. In einer Cloud-Oberfläche muss deren unterstützte Portweiterleitung die **gesamte Anwendung** auf diesem Port bereitstellen. `file://` und bloße HTML-Anhänge reichen nicht für Module und JSON. Ein Serverprozess überlebt einen neuen Cloud-Auftrag nicht zwingend.

Mit Entwicklungsabhängigkeiten/Chromium eine beliebige bereits laufende HTTP(S)-Adresse prüfen:

```sh
npm run check:start -- http://127.0.0.1:4173/ http://127.0.0.1:4173/Ermittlungszentrale/
```

Der Prüfer startet keinen Testserver und mockt keine Ressourcen. Er kontrolliert gestaltetes Menü, Detektivmotiv, vier große Akten und separate Bonusakte, Bedienung aller fünf Akten, Wörterbuch, Hinweis-/Punktevergabe, drei Länderfälle mit den neuen Belegschritten und **alle 24 dekodierten lokalen Fotos**. Konsolenfehler, HTTP-Statuscodes, MIME-Typen, Dokument-CSP und externe/fehlgeschlagene Anfragen werden erfasst. Ergebnisse/Screenshots stehen unter `artifacts/start-check/`; Fehler führen zu einem Fehlercode. Ein erfolgreicher lokaler Lauf ist kein Live-Nachweis für eine andere URL.

## Funktionierende statische Alternative

```sh
python3 -m http.server 4175 --bind 127.0.0.1 --directory /workspace/Ermittlungszentrale
```

Dann Root unter `http://localhost:4175/` öffnen. Alternativ für den Projektpfad:

```sh
python3 -m http.server 4174 --bind 127.0.0.1 --directory /workspace
```

Dann `http://localhost:4174/Ermittlungszentrale/` öffnen. Beide Varianten werden zusätzlich zum Node-Server mit demselben Browserprüfer tatsächlich bedient. Statische relative Ressourcen und `.nojekyll` bleiben mit GitHub Pages kompatibel. Kein Backend oder Framework wurde hinzugefügt.

## Prüfungen und Nachweise

Die Regressionen prüfen den **sichtbaren, interaktiven Start**, das Verschwinden der Starthilfe/Lademeldung, CSS-Eigenschaften und geladene Menüillustration. Weitere Fälle simulieren fehlende/falsche/hängende CSS-, Modul- und JSON-Abrufe sowie eine vollständige Skriptsperre. Keine Aufweichung der CSP für den Test.

Die neue fachliche Strecke ist im Startprüfer enthalten. Separate V2-/V2.1-/V2.2-Tests prüfen Teilauflösung nach Navigation/Reload, Entwurfserhalt, alte Sitzungen, getrennte Auswahlen, Zoom, freiwillige Spuren und das sichtbare Kakaoschema.

Aktuelle Ergebnisse und Bildnachweise: [Testbericht](testbericht.md), [aktuelles Menü](qa/v22/start-desktop.png), `docs/qa/v22/start-http-node.json`, `docs/qa/v22/start-http-static.json`. Frühere Dateien unter `docs/qa/start-*`, `docs/qa/v2/` und `docs/qa/v21/` sind historische Belege und werden nicht als neue 2.2-Ergebnisse ausgegeben.

## Pages-Veröffentlichung und echte Live-Abnahme

GitHub Pages bezieht weiterhin `feature/detektivspiel-komplett`, Verzeichnis `/`. Version 2.2 liegt auf dem neuen Branch `fix/ermittlungszentrale-2-2-abnahme` mit neuem Draft-PR gegen `main`. Der neue Auftrag erlaubt diesen Branch-Push und den neuen PR ausdrücklich; kein Merge, kein Push auf den Pages-Quellbranch, keine Änderung von Pages-Einstellungen und keine Veröffentlichung von 2.2. PR #1 bleibt geschlossen. Die öffentliche Live-Version bleibt davon getrennt.

Ein erfolgreicher Pages-Build belegt die Veröffentlichung eines Commits, keine erfolgreiche Browserfunktion. Sobald der direkte Zugriff auf die öffentliche URL möglich ist, denselben `check:start` gegen genau diese Adresse ausführen. Erst der erfolgreiche Live-Durchlauf erlaubt die entsprechende Funktionsaussage. Echter Schul-iPad-Safari-Test bleibt zusätzlich Aufgabe des Projektteams.
