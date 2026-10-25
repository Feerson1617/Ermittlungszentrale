# SCORM 1.2 für itslearning

Die Ausgabe enthält das vollständige Spiel 2.2 mit fünf unabhängig startbaren
Akten, 24 Fotos, sieben Wörterbuchsprachen und der ursprünglichen Bewertung
(30 reguläre + 5 Bonuspunkte, Hinweislimits 5/3/2/1). Es gibt ein einziges SCO.
Die normale GitHub-Pages-Fassung und ihre Veröffentlichungswege bleiben unverändert.

## Anleitung für Lehrkräfte – ohne Terminal

1. Im Repository oben **Actions** öffnen und links **SCORM 1.2 für itslearning**
   wählen. Den erfolgreichen Lauf mit grünem Häkchen für den SCORM-Branch bzw.
   später den übernommenen Stand öffnen. Auf Commit und Datum achten.
2. Unten unter **Artifacts** das Artefakt **Ermittlungszentrale-SCORM-1.2**
   herunterladen. Für Actions-Artefakte ist die Anmeldung im vorhandenen
   GitHub-Konto erforderlich; ein zusätzlicher Dienst ist nicht nötig.
3. GitHub verpackt das Artefakt selbst nochmals als Download-ZIP. **Nur die
   Lehrkraft** öffnet diese äußere ZIP und entnimmt daraus
   **`Ermittlungszentrale-SCORM-1.2.zip`**. Die eigentliche SCORM-ZIP geschlossen
   lassen. Nicht das äußere GitHub-Artefakt und nicht „Code → Download ZIP“ importieren.
4. Im itslearning-Kurs **Inhaltspaket importieren** öffnen, die eigentliche
   **`Ermittlungszentrale-SCORM-1.2.zip`** auswählen und als **SCORM 1.2**
   importieren. Die ZIP enthält `imsmanifest.xml` direkt im Hauptverzeichnis.
5. Zunächst selbst und dann mit einem Test-Schülerzugang öffnen. Den Player
   auf ausreichend große Darstellung einstellen. Ein eigenes Browserfenster
   ist ebenfalls vorgesehen; nötigenfalls das bewusst geöffnete Fenster erlauben.
6. Schülerinnen und Schüler öffnen anschließend nur den Kursinhalt in Safari.
   Sie benötigen keine App, keinen Download und müssen nichts entpacken.
   Der optionale Ermittlungsbogen bleibt als lokale PDF erreichbar.

Bei einem Importfehler die konkrete itslearning-Meldung und den verwendeten
Build notieren. Ein erfolgreicher lokaler Mock-Test ersetzt den tatsächlichen
Import nicht. Bei blockierten Skripten, falschen MIME-Typen oder einer
Cross-Origin-Isolierung muss die Plattformkonfiguration geprüft werden.

**Manuell erneut bauen:** Nach Verfügbarkeit des Workflows auf dem
Standardbranch in Actions **Run workflow** wählen und den gewünschten Branch
selektieren. Vor einem Merge startet der Push auf
`feature/scorm-itslearning-1-2` den Workflow automatisch. Falls GitHub den
manuellen Start noch nicht anbietet, liegt das an der Sichtbarkeit von
`workflow_dispatch` auf dem Standardbranch. Kein Merge ist für den lokalen
Build oder den automatischen Branch-Lauf nötig. Artefakte bleiben 90 Tage
verfügbar und lassen sich danach mit einem neuen Lauf erneut erzeugen.

## Reproduzierbarer Build für die technische Betreuung

Voraussetzungen: Python 3.13 und Node.js 24 für die vorhandenen Tests.
Der Build selbst verwendet nur die Python-Standardbibliothek und kein Netzwerk.

```sh
npm ci
python3 -m pip install -r requirements-scorm.txt
npm run build:scorm
npm run validate:scorm
python3 tests/scorm-package.py
npm test
npm run test:pdf
npx playwright install --with-deps chromium webkit
npm run test:scorm
```

Die bestehenden Tests erwarten Chromium unter `/usr/bin/chromium` oder unter
`CHROMIUM_PATH`. In GitHub Actions wird der von Playwright installierte Pfad
in diese Variable übernommen. `npm run test:scorm` startet selbst einen
HTTP-Server auf Port 4173. Dort darf kein anderer Test-/Spielserver laufen.
Die Tests verwenden die tatsächlich entpackte ZIP, einschließlich HTTP-Pfaden
wie `/kurs/inhalt/4711/`, `nosniff` und passenden MIME-Typen für Module/JSON.

Ausgabe: `artifacts/scorm/Ermittlungszentrale-SCORM-1.2.zip` und Prüfsummendatei.
Die ZIP verwendet feste Zeitstempel, Dateireihenfolge und Berechtigungen.
Für bytegleiche Ergebnisse sollen dieselbe Python-/zlib-Version und derselbe
Quellstand verwendet werden. Keine Node-Abhängigkeit gelangt ins Schülerpaket.

## Aufbau und Sicherheit

- `scripts/build-scorm.py`: feste Positivliste statt Kopie des Repositories.
  Alle Spielmodule, Spieldaten, Karten und Fotos werden bytegleich übernommen.
  Die drei Informations-/Startseiten und die Schülerbogen-HTML erhalten
  zusätzlich nur lokale SCORM-Dateiverweise; ihr Originalinhalt bleibt gleich.
- `scorm/runtime.js`: isolierte technische SCORM-Sitzung, nur in der exportierten
  `index.html` geladen. Die normale `index.html` im Repository wird nicht editiert.
- `scorm/export.css`: Kennzeichnung bewusst aufrufbarer HTTP(S)-Quellenlinks
  mit „(extern)“. Kein automatischer Quellenabruf; vorhandene externe HTML-Links
  verwenden `noopener noreferrer`.
- Die bestehende Content-Security-Policy einschließlich Hash der Startlogik
  wird **unverändert** beibehalten. Kein `unsafe-inline`, keine zusätzliche
  Domain und keine externe Bibliothek. Lokale Skripte sind bereits durch
  `script-src 'self'` erlaubt. `frame-ancestors` kann nicht per Meta-Tag für
  itslearning gesetzt werden; Plattformheader sind im Praxistest zu prüfen.
- Die internen Planungsunterlagen unter `sources/`, QA-Berichte, Tests, Skripte,
  Repositorydaten und der Erwartungshorizont sind ausgeschlossen. Der bereits
  vorhandene Spielverweis `sources/auftrag-v2.md` führt im Paket nur auf einen
  ausdrücklich als solchen gekennzeichneten öffentlichen Quellenhinweis,
  nicht auf eine Kopie des internen Auftrags. Spieltexte und Quellenstatus
  werden dadurch nicht umgeschrieben. Öffentliche Bild-/Wörterbuchnachweise
  und die lokalen Lagos-Belege bleiben enthalten.
- Historische SCORM-Schemata werden lokal mitgeliefert. Herkunft und zwei eng
  begrenzte XML-/XSD-Kompatibilitätskorrekturen: `scorm/schemas/README.md`.
  Die Validierung benötigt keinen Zugriff auf ADL-/IMS-Server.

## SCORM-Lebenszyklus

Die Laufzeit sucht `API` im eigenen Fenster, in übergeordneten Fenstern und
bei Openern einschließlich deren Vorfahren. Die Suche ist zyklensicher und
auf 100 Kontexte begrenzt; Zugriffsfehler werden abgefangen. Es wird genau
`LMSInitialize("")` aufgerufen. Nur nach erfolgreicher Initialisierung folgt
beim Verlassen nach Möglichkeit `LMSFinish("")`. Guards verhindern doppelte
Aufrufe. Fehlende APIs, Exceptions und abgewiesene Initialisierungen blockieren
das Spiel nicht. Bei einer Rückkehr aus dem Browser-Back/Forward-Cache wird
nach vorherigem Sitzungsende eine neue technische Sitzung begonnen.

Kein `beforeunload`-Dialog; ein Wechsel in den Hintergrund beendet die Sitzung
nicht. iPadOS kann Safari-Prozesse ohne Abschlussereignis beenden: Ein Finish
kann daher technisch nicht garantiert werden. Der LMS-Player muss verwaiste
Sitzungen selbst behandeln. SCORM-Sitzung und lokaler Spielstand bleiben getrennt.

Die Integration ruft **keine** `LMSGetValue`, `LMSSetValue`, `LMSCommit` oder
CMI-Datenfelder auf. Es werden weder Punkte/Noten noch Antworten, Namen,
Freitext, Bookmark, Abschlussstatus oder Fortschritt an den SCORM-Adapter
übergeben. itslearning darf deshalb keine automatische Punktesynchronisierung
oder vom Spiel gesetzte Fertigmeldung erwarten. Die Punkte werden wie bisher
im Spiel angezeigt und auf Papier gesichert.

## Technische Datenschutzübersicht

| Funktion | Tatsächliche Daten / Empfänger | Dauer / Grenze |
|---|---|---|
| Spielzustand im Arbeitsspeicher | Akten, Antworten, Auswahl, Hinweise, Punkte; nur Browser | Während der geöffneten Anwendung |
| Optionales `sessionStorage` | JSON unter `ermittlungszentrale-session-v2`; bestehende Migration prüft auch `ermittlungszentrale-session-v1` | Bestehendes Verhalten: Neuladen kann Zustand im selben Tab wiederherstellen; tab-/originabhängig. Zurücksetzen einer Akte setzt deren Daten zurück. Safari/LMS können Storage beschränken. |
| Papierbogen / lokale PDF | Der ausgelieferte Bogen ist leer. Name/Team werden nicht durch das Spiel erfasst. Papier bleibt bei der Lerngruppe/Lehrkraft. | Papierorganisation durch Schule |
| Paketdateien per HTTP(S) | HTML, JS, CSS, JSON, Karten und Bilder an den Browser; Requests an die Hosting-Origin des LMS | itslearning/Host kann IP, Zeit, URL, Browser und Kontozuordnung protokollieren; abhängig von dessen Konfiguration |
| SCORM-Adapter | Nur technische Aufrufe mit leerem String | itslearning kennt durch Anmeldung/Kurskontext ggf. Person, Start, Öffnungen, Sitzungsdauer/Ende und kann eigene Statuswerte erfassen. Diese stammen nicht aus einer Übertragung von Spielantworten. |
| Bewusst angeklickte externe Quelle | Erst nach aktivem Aufruf Kontakt zum jeweiligen Quellenanbieter | Dessen Datenschutzregeln gelten; Browser übermittelt z. B. IP/Browserdaten. Kein automatischer Abruf beim Spielen. |

Keine zusätzlichen Konten, Cookies, `localStorage`, Analyse, Telemetrie,
Service Worker, Backend oder Drittanbieter-API in der Spielanwendung. HTTP-Caches
und mögliche Cookies/Analysen des itslearning-Players selbst werden vom LMS
bestimmt. Das Paket kann dessen Verhalten weder kontrollieren noch ausschließen.
Die lokalen JSON-Quellennachweise enthalten Foto-/Quellenurheber, keine neu
erfassten Schülerdaten. Keine behördliche Datenschutzfreigabe wird behauptet.

## Manuelle Abnahme vor dem Unterricht

- In der tatsächlichen Schleswig-Holstein-Instanz importieren; eingebetteten
  und ggf. Fensterstart, Module/JSON und PDF mit einem Schülerzugang prüfen.
- Auf einem verwalteten Schul-iPad in Safari Hoch-/Querformat, Scrollen,
  Touchziele, Foto-/Kartendialoge, Bildschirmtastatur, Wörterbuch samt RTL und
  Wechsel zwischen Akten prüfen. Fenstergrößen des LMS beachten.
- Neuladen, Zurücksetzen, Kurswechsel, Schließen/Wiederöffnen, Hintergrundwechsel
  und Rückkehr testen; lokale Speicherung ist bewusst keine LMS-Sicherung.
- In den Browser-/LMS-Protokollen bestätigen, dass keine SCORM-Antworten,
  Noten oder künstlichen Abschlusswerte gesetzt werden. Das unabhängige
  Sitzungsprotokoll des LMS darf vorhanden sein.
- Mit dem tatsächlich geltenden Schulnetz testen. Bekannte fachliche,
  sprachliche und Druck-Abnahmepunkte der Version 2.2 separat weiterführen.

Automatisierte Nachweise und klare Abnahmegrenzen: [Testbericht](scorm-testbericht.md).
