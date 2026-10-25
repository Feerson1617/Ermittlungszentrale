# SCORM 1.2 – Test- und Abnahmebericht

Prüfdatum: 25.10.2026. **Die Abnahme der gebauten Fassung läuft noch.**
Echte itslearning-Importe und Schul-iPad-Tests wurden nicht durchgeführt.
Dieser Bericht wird mit den abschließenden Browserergebnissen ergänzt.

## Grundlage und Abgrenzung

Repository `Feerson1617/Ermittlungszentrale`, Ausgangscommit
`9fa662f1ece86097db107dd75dadbb202549834f` auf `main`: Spiel 2.2 nach Merge
von PR #2. Vorhandene lokale/entfernte Branches, README, Module, Daten,
Materialien und Tests wurden geprüft. Keine `AGENTS.md` im Repository.
Eigenständiger Branch: `feature/scorm-itslearning-1-2`.

Der offene PR #3 (`offline-export-2026-10-21`, `94a92b6`) wurde gelesen,
aber nicht übernommen. Dessen Ein-Datei-Ansatz entfernt die CSP und bettet
auch den Erwartungshorizont ein. Der SCORM-Export bleibt mehrteilig,
behält die CSP und schließt das Lehrermaterial aus.

`index.html`, `js/`, `css/`, `data/`, `assets/`, Materialien und bestehende
Browsertests im Repository bleiben gegenüber `main` unverändert. Bestehende
npm-Prüfbefehle und Abhängigkeiten wurden nicht ersetzt. GitHub Pages war
bei der Prüfung weiterhin aus `main` und `/` veröffentlicht; keine Änderung
an Einstellungen, kein Push auf `main`, kein automatischer Merge.

## Paketprüfung

| Prüfung | Ergebnis |
|---|---|
| ZIP ohne übergeordneten Ordner | bestanden; `imsmanifest.xml` direkt an der Wurzel |
| Ein SCO für das gesamte Spiel | bestanden; `index.html`, eine Organisation/ein Item/eine SCO-Ressource |
| SCORM-1.2-Metadaten und XSD | bestanden, offline mit lxml; CP-, ADL- und MD-Schemata gemeinsam geladen |
| Negativkontrolle der ADL-XSD | bestanden; ungültiges `scormtype` wird abgewiesen |
| Vollständige Ressourcenliste | bestanden; 97 Dateien, alle Paketdateien im Manifest außer dem Manifest selbst |
| Lokale Verweise | bestanden; 80 unterschiedliche lokale Ziele aus HTML, CSS, Modulimporten, JSON, SVG, Markdown und Quellennachweisen aufgelöst |
| Fotos | bestanden; 24 unterschiedliche Katalogeinträge, Zuordnung/Pfade und SHA256 kontrolliert |
| JSON und GeoJSON | bestanden; syntaktisch geprüft, vollständig enthalten |
| Externe Abhängigkeiten | keine automatischen externen Ressourcen; 91 unterschiedliche bewusst aufrufbare externe Quellen-/Lizenzlinks |
| Spielinhalt/Wertung | kopierte Module, Daten, Karten und Fotos bytegleich; HTML nach Entfernung ausschließlich der eingefügten lokalen Verweise identisch |
| Lehrermaterial | ausgeschlossen; Positivliste und zusätzliche Namens-/Paketprüfung; ursprünglicher interner Auftrag nicht mitkopiert |
| Reproduzierbarkeit | zwei Builds mit demselben Quellstand und derselben Laufzeit bytegleich |
| Fehlererkennung | alle 10 gezielten Paket-Manipulationstests bestanden |

Lokale ZIP: **6.047.101 Bytes**, entpackt **8.805.776 Bytes**.
SHA256:
`0ff8eb477174150f13e18b8c47f3f7cde372a067df2457e8be2269b954ff52d9`.
Eine andere Python-/zlib-Version kann andere komprimierte Bytes erzeugen;
die im jeweiligen Build mitgelieferte Prüfsummendatei gilt für dessen ZIP.

Die zehn Manipulationstests prüfen: fehlendes Foto, eingeschleusten
Erwartungshorizont, ZIP-Pfad außerhalb des Pakets, falsche SCORM-Version,
ungültiges ADL-Attribut, externes Skript, fehlendes CSS-Ziel, veränderte
Wertungsdatei, veränderte Fotobytes und veränderten Spieltext.

## Laufzeit- und Spielprüfung

Der lokale SCORM-Player verwendet eine zustandsbehaftete SCORM-1.2-API.
Er lehnt doppelte Starts/ungültige Enden ab und protokolliert jede Methode.
Alle Datenzugriffs-/CMI-Methoden werfen im Mock absichtlich einen Fehler.
Der Server entpackt die fertige ZIP frisch, liefert ausschließlich diese
Paketdateien aus und setzt echte MIME-Typen sowie `X-Content-Type-Options:
nosniff`. Keine Modul-/JSON-Mocks beim regulären Durchspielen.

Die 14 isolierten SCORM-Laufzeittests bestehen: Suche im Parent/Opener
und dessen Vorfahren, Zugriffsfehler, Zyklen/Suchlimit, fehlende API,
falsche Rückgabewerte und Exceptions bei Initialisierung, genau ein Finish,
Exception beim Finish, simulierte Back/Forward-Cache-Rückkehr sowie kein
Finish beim bloßen Hintergrundwechsel. Es gibt keine CMI-Lese-/Schreibaufrufe.

Die zusätzlichen Browserfälle prüfen das Durchspielen aller fünf Akten im
iframe mit sieben vollen Aufgabenwertungen (30+5), unveränderte zehn
Lernschritte, Sitzungsende ohne Übertragung dieser Werte, verschachtelte
Frames, eigene Fenster mit Opener, Neuladen, fehlende/fehlerhafte API und
einen tatsächlich fremden Origin im Kindframe für blockierten Parent-Zugriff.
Die synthetischen `pagehide`/`pageshow`-Tests prüfen die Ereignisbehandlung,
behaupten aber keinen echten iPadOS-Prozess-/Back-Forward-Cache-Test.

Die unverändert übernommenen 58 vorhandenen Browserfälle je Profil prüfen
richtige/falsche/teilrichtige/unklare Antworten, Sperren und Hinweislimits,
Auflösung ohne Nachbepunktung, getrennte Viererwahlen, alle Fotos und ihre
Lizenzen, Papierbestätigungen, offene Reflexionen, die Länder-/Lernwege,
Wörterbuchsprachen/RTL/Suche/Bedeutungshilfe/Fokus, Modal-/Zoomfunktionen,
Neuladen/Zurücksetzen und optionale Speicherung. Die ursprünglichen
Startfehlerfälle mit absichtlich fehlenden/falschen/zeitverzögerten Ressourcen
bleiben negative Tests; sie sind keine ungeklärten Auslieferungsfehler.

| Testlauf | Ergebnis |
|---|---|
| Bestehende Node-Prüfdateien | alle 8 bestanden; `npm test` einschließlich zusätzlicher Runtime-Datei: 9 Dateien bestanden |
| SCORM-Laufzeit einzeln | 14/14 bestanden |
| PDF-Prüfung | bestanden; Schülerbogen 2 × A4, Lehrerfassung 13 Seiten ausschließlich im Repository |
| Bestehende Browserfälle auf Webfassung | **290/290 bestanden**, 9,5 Minuten: Desktop, iPad quer/hoch, Mobil (Chromium), iPad quer (WebKit) |
| Browserfälle auf entpackter SCORM-ZIP | läuft noch; sechs Profile einschließlich WebKit quer/hoch |
| Originaler Release-Audit | Exit 2, exakt 20 bekannte offene Abnahmepunkte; keine technische Freigabe daraus abgeleitet |

## Während der Entwicklung behobener SCORM-Befund

Die erste Exportfassung lud die SCORM-Datei mit `defer`. Bei absichtlich
hängendem CSS wartete dadurch `DOMContentLoaded`, und ein vorhandener
Startfehler-Browsertest erreichte seine Fehleranzeige nicht rechtzeitig.
Die Einbindung wurde auf `async` geändert: Die Laufzeit benötigt keine DOM-
Elemente und darf den Spielstart nicht blockieren. Zusätzlich prüft ein neuer
Browsertest, dass bei absichtlich verzögertem SCORM-Skript bereits gespielt
und geantwortet werden kann. Der ursprüngliche CSS-Fehlertest bleibt
unverändert. Die betroffenen ersten CI-/Paketläufe wurden abgebrochen;
sie sind keine freigegebenen Artefakte.

## Testumgebung und Grenzen

Cloud-Linux/Debian 13, Node.js 24.19.0, Python 3.12.14, zlib 1.3.2,
lxml 6.1.1, pypdf 6.10.0, Playwright 1.58.2.
Lokales Chromium: 154.0.8037.57. WebKit: 26.0, Playwright-Build 2248.
Die CI installiert die zu Playwright gehörenden Browser regulär.

Lokal war der zusätzliche Chromium-Download durch eine gesperrte
Weiterleitung nicht möglich; das bereits installierte Chromium wurde genutzt.
Für WebKit fehlten Systembibliotheken. Da kein Root-Passwort verfügbar war,
wurden benötigte Debian-Bibliotheken ohne Systemänderung im Arbeitsbereich
entpackt und dem lokalen Browser zur Verfügung gestellt. Der pauschale
Playwright-Host-Vorcheck wurde dafür lokal übersprungen; WebKit selbst wurde
tatsächlich gestartet und getestet. Keine Browser-/CSP-Sicherheitsregeln des
Spiels wurden dafür abgeschaltet. Netzwerkfähige Testprozesse wurden mit den
in dieser Cloud erforderlichen Ausführungsberechtigungen gestartet.

Simulierte iPad-Profile: 1080 × 810 quer und 810 × 1080 hoch mit Touch,
zusätzlich Desktop 1440 × 1000 und iPhone-13-Profil für Chromium. Das sind
keine physischen Apple-Geräte. WebKit unter Linux ersetzt nicht Safari unter
iPadOS, die Bildschirmtastatur, Schulverwaltung/MDM, das echte Schulnetz oder
den itslearning-Player. Screenshots und Touch-/Scroll-/Dialogprüfungen werden
zusätzlich im gebauten Player ausgeführt.

## Weiterhin manuell offen

1. **Tatsächlicher itslearning-Import:** ZIP importieren und mit Schülerkonto
   laden; Plattform-MIME-Typen, Verschachtelung, API-Erreichbarkeit, CSP-/Frame-
   Header, Fensterstart und Schließen prüfen. Kein solcher Import wurde hier
   durchgeführt. Die technische Datensparsamkeit des Pakets ersetzt keine
   Prüfung der unabhängigen itslearning-Sitzungsprotokolle.
2. **Echtes verwaltetes Schul-iPad:** Safari, Hoch-/Querformat, Touch/Scrollen,
   Bildschirmtastatur, Dialoge, Wörterbuch/RTL, PDF, Hintergrundwechsel,
   Neuladen/Zurücksetzen und Rückkehr in den Kurs prüfen.
3. **Bereits bekannte 2.2-Abnahmepunkte:** offene Übersetzungen (ru 1, uk 2,
   tr 2, ar 1, ku 13, ckb 13), muttersprachliche Prüfung aller sieben Sprachen,
   echter Safari-Test, Curriculum-/Sachquellenoriginale, reale Druckprobe,
   Lerngruppen-/Zeitprobe, öffentliche Live-Browserabnahme und Schulnetz.
   Das sind die 20 Meldungen des bestehenden Audits, keine neu entstandenen
   SCORM-Befunde. Fachliche Rückmeldungen wurden nicht stillschweigend geändert.

Diese Ausgabe behauptet weder eine Unterrichts-/Datenschutzfreigabe noch
bestandene reale Geräte- oder Plattformtests.

## Nachweise und Wiederholung

- [Unveränderte Webfassung: Browserprotokoll](qa/scorm/web-regression.txt)
- [Node-Prüfdateien](qa/scorm/unit-tests.tap), [14 Runtime-Tests](qa/scorm/runtime-tests.tap)
- [10 Paket-Negativtests](qa/scorm/package-negative-tests.txt)
- [PDF-Prüfung](qa/scorm/pdf-tests.txt), [bestehender Release-Audit](qa/scorm/release-audit.txt)
- Build-, Testbefehle, Datenschutz und Importanleitung: [SCORM-Dokumentation](scorm-itslearning.md)

GitHub Actions führt denselben Ablauf aus und stellt nach erfolgreicher
Prüfung die ZIP und vollständige Browserberichte als Artefakte bereit.
Die Download- und PR-Verweise werden nach Abschluss des tatsächlichen
Workflow-Laufs ergänzt; ein Upload wird nicht vorab als erfolgreich bezeichnet.
