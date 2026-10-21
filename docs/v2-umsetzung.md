# Ermittlungszentrale 2.0 – Umsetzung und Abnahme

Stand: 21.10.2026. Verbindliche Aufgabenreferenz: `sources/auftrag-v2.md`; die beiden hochgeladenen Fassungen sind bytegleich. Zusätzliche ausdrückliche Nutzeranweisung: „Version 2.0 umsetzen, aber auch Push, PR und Deployment“. Damit sind die Veröffentlichung auf dem bestehenden Entwicklungsbranch, die Aktualisierung von PR #1 und die damit verbundene automatische Pages-Veröffentlichung für diese Überarbeitung freigegeben. Kein neuer PR, kein Merge und keine Änderung von Umgebungs-/Pages-Berechtigungen.

Ausgangspunkt: `ede9a89234c880bb81f7a4d1f64d6a9f741b101c`, sauberes Arbeitsverzeichnis, Remote ohne zwischenzeitliche Commits. Wiederherstellbarer Ausgangsstand: Git-Bundle `Ermittlungszentrale-v2-Ausgangsstand.bundle` in den Übergabedateien. Kein Rücksetzen und kein Architekturwechsel; HTML/CSS/JS und lokales statisches Hosting bleiben erhalten. Originalreferenzen unter `sources/` werden nicht verändert.

## Befundmatrix

| Befund | Tatsächlicher Ausgangsbefund | Umsetzung / Dateien | Neuer Nachweis / Rest |
|---|---|---|---|
| T1 | „nur wenige“, „ein paar Orte“ und ähnliche Formulierungen fehlen in den Kurzantwortregeln | Akte 002 auf schrittweise geschlossene Antworten mit einer Gesamtabgabe umstellen; historische Freitextfälle separat erhalten | `tests/v2-scoring.test.mjs` (historische Fixture) und geschlossene Browser-Gesamtabgabe |
| T2 | Rückmeldung leitet fachlichen Erfolg aus Punkteobergrenze ab | Rohkriterien, festgeschriebene Punkte, Vollständigkeit, Auflösung und Papierbestätigung trennen | Rohkriterien, `fullCorrect`, `scored`, `resolved`, `ack`; Grenzfall drei Rohpunkte bei Limit drei geprüft |
| T3 | `openHint` setzt den Antwortentwurf zurück | Entwürfe erhalten; Abschlussentwurf getrennt; fokussierte Eingaben vor Rendern sichern | Fokuswert, Hinweise 1/2 und getrennter Abschlussentwurf in Unit-/Browsertests |
| T4 | Tatsächlich geprüft: „Afrika ist ein Land“ richtig; „Afrika ist kein Land, sondern ein Kontinent“ falsch | aufgabenspezifische Bedeutungs-/Negationsregeln und neutrale Namensklärung | Richtige/falsche Negation, neutrale Namensliste und getrennte Länderregeln getestet |
| D1 | Positive Teilpunkte schließen ohne fachliche Korrektur ab | begrenzte unbewertete Auflösung mit Einzelerklärung, keine Nachbepunktung, Zustand nach Navigation erhalten | Einmalige unbezahlte Korrektur, Erklärung/Bestätigung und Reload-Rückkehr getestet |
| D2 | Alle vereinfachten Antworten stehen an Position A; Bonus folgt Indexreihenfolge | feste unterschiedliche Positionen, stabile Antwortkennungen | Sieben unterschiedliche feste Antwortpositionen, Bonus nach IDs trotz geänderter Optionsreihenfolge |
| M1 | Schülerbogen nennt auf Seite 2 bereits Afrika | ganzer zweiseitiger Bogen themenneutral; gleiche Kopie ab Start verwendbar | Zwei A4-Seiten ohne Afrika/Africa/Lösungsländer; PDF-Text und Sichtprüfung beider Seiten |
| M2 | Motivliste enthält zehn unstrukturierte Listeneinträge | gemeinsame Datengrundlage; explizite Tabelle 1–12 in MD/HTML/PDF; zusätzliche Belege getrennt | Datenbasierte Tabelle 1–12 in MD/HTML/PDF; PDF-Zeilenprüfung und Sichtprüfung aller Seiten |

## Umfang und Prüfgrenzen

- Kurzer Kernweg: drei Länderfälle, Industrie, Dienstleistung, Kakaokette, Stadtvergleich/Lebensbedingungen, Bildung/Gesundheit. Keine weitere bepunktete Aufgabe; weiterhin 30 Haupt- und fünf Bonuspunkte.
- Freiwillige weitere Spuren: Film/Digitales, Energie/Solarthermie und Logistik; keine zusätzlichen Pflichtkapitel.
- Zwölferkatalog: Nummern 1–10 erhalten; 11 Wasserversorgung, 12 medizinische Versorgung neu. Interne Medien-ID, Auswahlbildnummer und Dateipfad getrennt halten.
- Keine pauschale Unterrichts-, Sprach- oder Gerätefreigabe. Bearbeitungszeiten und Lernwirkung sind ohne Lerngruppenerprobung ungemessen.
- Ausgangsprüfung am 21.10.: bestehende Node-Suite erneut ausgeführt. Die historischen 152 Browserdurchläufe werden nicht als neue Ergebnisse dieser Überarbeitung ausgegeben.
- Direkte Abrufe von Renault Group, SIGA, Fachportal und öffentlicher Spieladresse scheitern aktuell beim Cloud-Proxy-CONNECT mit 403. Keine Host-Berechtigungen verändert. Commons ist erreichbar; Orts-/Lizenzbelege können gesichert werden. Quellenstatus und inhaltliche Reichweite werden bei jedem verwendeten Beleg getrennt ausgewiesen.

## Tatsächliche Umsetzung

| Bereich | Dateien | Ergebnis |
|---|---|---|
| Bewertung und Sitzung | `js/scoring.js`, `js/session.js`, `data/rubrics.json` | Fachliche Vollständigkeit getrennt von festen Punkten und Auflösung; sichere V1-Rücksetzung; getrennte Auswahlen |
| Oberfläche und Lernweg | `js/app.js`, `data/cases.js`, `data/learning.js`, `css/style.css`, `index.html` | Vier geschlossene Teilfragen, neun unbewertete Belegschritte, Schema mit erkennbaren Kakaobohnen, freiwillige Spuren, getrennte Zoomknöpfe |
| Neue Medien | vier WebP-Dateien, `docs/media/{supply,clinic,housing,trade}.json`, `data/media.json` | 19 echte lokale Fotos, 12 Auswahlmotive; alle 15 alten Dateien unverändert; ID/Nummer/Pfad getrennt |
| Wörterbuch | `data/dictionary*.json`, `js/dictionary.js`, Bericht/Integritätswerkzeuge | Zehn neue Begriffe, 24 benötigte Suchbegriffe/-formen zugeordnet; alle neuen nichtleeren Werte einzeln belegt |
| Materialien | `scripts/materials.mjs`, `materials/`, `docs/erwartungshorizont.md` | Schüler zwei neutrale A4-Seiten; Lehrer elf Seiten mit expliziter Bildtabelle und Seitenzahlen |
| Regressionen | `tests/v2-scoring.test.mjs`, `tests/browser/v2*`, angepasste Bestandsprüfungen | Historische Freitext-Fixture bleibt erhalten; neue geschlossene Form wird separat geprüft; echte Startbedingungen bleiben enthalten |

## Kernweg / freiwillige Breite / Quellenstatus

| Abschnitt | Verpflichtend | Weitere Spuren | Beleg und Reichweite |
|---|---|---|---|
| Marokko | Länderfall, Schnee/Naturraum und Fahrzeugproduktion | Solarthermie, Transport | Schnee-Foto ortsbelegt; Fahrzeugproduktion als Schema nach geprüftem Auftrag/Renault-Quelle, direkter Originalabgleich offen |
| Nigeria | Länderfall, Stoffhandel, zwei Stadtansichten, zwei Kontextkarten, weitere Alltagsperspektive | Filmwirtschaft landesweit, Digitales | Drei Lagos-Fotoorte belegt; Daten 2007/2016/2019; keine Einkommens-/Wachstumswerte aus Bildern; qualitative Kontextinformation aus Auftrag |
| Ghana | Länderfall, Anbau → Bohnen → Produkte → Handel | Was braucht ein Betrieb? | Ghana-Fotos und Betriebsort Tema belegt; Schema erklärt Ablauf; SIGA-Original direkt noch nicht abgeglichen |
| Bildung/Gesundheit | Ein kurzer gemeinsamer Vergleich Universität/Krankenhaus | keine Zusatzstrecke | Accra und Butaro lokal belegt; kein universeller Zugang/Qualitäts-/Finanzierungsnachweis |
| Rückbezug | Ein Beleg, wenige Wörter oder Partnersatz; bereits bekannt/offene Frage zulässig | keine Zusatzwertung | Vorstellungen werden nicht benotet |
| Akte 005 | freiwillig | vier Zukunftsschwerpunkte und eigene Frage | Erfundene Nachrichten, echte Fotos; keine behaupteten dokumentarischen Ereignisse |

Das kleinere Balogun-Original (963 × 640) bleibt ohne Hochskalierung. Die drei neuen großen Ableitungen werden wie der Bestand mit Lanczos, WebP Qualität 82 optimiert. Das gemeinsame Werkzeug reproduziert alle 19 Bilder aus SHA1-/SHA256-geprüften Originalen; die 15 Bestandsableitungen bleiben bytegleich. Gesamtbudget 3.59 MiB; kein Foto über 500 KiB, kein externer Bildabruf im Spiel.

## Wortschatz gegen die Arbeitsaufträge

Geprüfte Suchbegriffe und Formen: Vorstellung, Unterschied, vergleichen, Bildbeleg, Fabrik, Beruf, Verarbeitung, Handel, Bildung, Krankenhaus, Einkommen, Lebensbedingungen, notiert, gemeinsam, beeinflusst, Ermittlungsteam, Redaktion, Ausschnitt, Hinweis, zuordnen, anbauen, herstellen, verkaufen, Produkt. Alle 24 haben einen eindeutigen lokalen Wörterbucheintrag oder ausdrücklich dokumentierten Alias. „Bildbeleg“/„Beleg“ nutzt den vorhandenen Begriff Beweis; keine neu erfundene kurdische Zusammensetzung. Für ernten, aufbereiten, Bohnen und Versorgung gibt es kostenlose deutsche Erklärungen direkt im Belegweg. Eine allgemeine vollständige Übersetzung sämtlicher Sätze wird nicht behauptet.

Abdeckung jetzt 197 Begriffe: ru 196, uk 195, pl 197, tr 195, ar 196, ku 184, ckb 184. V2 ergänzt 8 belegte Kurmandschi- und 7 belegte Sorani-Werte. Die 353 vorhandenen kurdischen Werte bleiben erhalten, insgesamt jetzt 368. Neue nichtleere Werte aller sieben Sprachen sind einzeln belegt; alle menschlichen Sprachabnahmen bleiben offen. Die übrigen 32 Sprachwerte bleiben leer, besonders nicht belegte Fachzusammensetzungen. Ein Quellenbeleg ist keine professionelle oder muttersprachliche Freigabe.

## Technischer Abschluss und verbleibende Abnahme

Aktuelle ausgeführte Prüfungen, lokale/öffentliche Trennung und Übergabe: [Testbericht](testbericht.md), [Abnahme](abnahme.md), [Vorschau](vorschau.md). Bild-/Quellenbelege sind geprüft, aber nicht als statistisch repräsentativ ausgegeben. Echte Geräte-, Druck-, Sprach- und Unterrichtsprüfung sowie die direkten Original-/Live-Abgleiche bleiben ausdrücklich offen. `audit:release` erfasst jetzt auch diese V2-Grenzen; keine Abnahme wurde automatisch erfunden.

