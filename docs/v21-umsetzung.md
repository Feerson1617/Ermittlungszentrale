# Ermittlungszentrale 2.1 – lokale Überarbeitung

Stand: 21.10.2026. Unveränderte Aufgabenreferenz: [Auftrag 2.1](../sources/auftrag-v2.1.md). Tatsächlich geprüfter Ausgangsstand: `d8a4c4cdbfa51f059bcca362cbccef31719d4c86` auf `feature/detektivspiel-komplett`, anfangs saubere Arbeitskopie. Ausgangsstand separat als Git-Bundle gesichert, Node-Ausgangssuite erneut mit 238 erfolgreichen Prüfungen ausgeführt.

## Umfang und Veröffentlichungsgrenze

Gezielte Nachbesserung auf der bestehenden Vanilla-Anwendung. Fünf unabhängige Akten, Oberfläche, zwölf Auswahlbilder, 30+5 Punkte, Hinweislimit 5/3/2/1, Teilauflösung, Wörterbuch, Zoom und Papiermaterial bleiben erhalten. Keine neue Pflichtschreibarbeit, keine neuen Punkteblöcke.

Abschnitt 12 verlangt einen lokal implementierten, geprüften Stand und anschließend eine neue ausdrückliche Push-Freigabe: „Kein Push, kein Merge, kein Deployment ohne ausdrückliche Freigabe.“ Die frühere Freigabe für 2.0 wird nicht übertragen. Nach Übergabe des geprüften lokalen Ergebnisses hat der Nutzer ausdrücklich „pushen ja, kein merge“ freigegeben. Implementierungscommit `e422525` wurde daraufhin auf denselben Entwicklungsbranch gepusht. Keine Änderung von Pages-/Netzwerkeinstellungen, kein neuer PR und kein Merge. Der vorhandene Pages-Build startet automatisch.

**Tatsächlicher GitHub-Zustand, nur gelesen:** PR #1 ist bereits am 21.10.2026 um 09:08:09 UTC gemergt/geschlossen worden, Merge-Commit `3a6274f732696048a4d45ee63964992b02f9ef58`. Der Auftrag beschreibt ihn noch als Draft. Remote-Entwicklungsbranch nach Freigabe auf Implementierungscommit `e422525` aktualisiert; `main` ist der genannte Merge-Commit mit gleichem Anwendungsbaum wie `d8a4c4c`. Kein Merge wurde in dieser Bearbeitung ausgeführt. [API-Befund](qa/v21/github-readonly.json). Der neue Push ergänzt den gemergten PR nicht. Ohne neuen PR ist der Branch-Vergleich `main...feature/detektivspiel-komplett` der überprüfbare Änderungsnachweis.

## Fünf neue Motive

| Nummer / Beleg | Neues Foto / belegter Ort | Quelle und Lizenz | Tatsächlicher Inhalt und Grenze |
|---|---|---|---|
| 7 / F18 | Lehmhäuser, Raum Tamale, Ghana | Salifu Wumpini Hussein, „Rural Home 05.jpg“, Commons-Revision 1176782095; CC BY-SA 4.0 | Lehmwände, Strohdächer, Hof, Wege und Leitungen. Kein Armuts- oder Strommangelbeleg; kein genauer Dorfname behauptet. |
| 8 / F19 | Palabora-Tagebau bei Phalaborwa, Südafrika | Bjørn Christian Tørrissen, „Palabora-Open-Pit-Mine-2019.jpg“, Revision 1181247760; CC BY-SA 4.0 | Terrassierter Tagebau 2019. Keine ungesicherten Aussagen zu Arbeitsbedingungen, Fördermengen oder Umweltfolgen. |
| 9 / F20 | Leerer Klassenraum, Nigeria | Danslafrique, „Empty Classroom.JPG“, Revision 1228963026; CC BY-SA 4.0 | Einfache Tische/Stühle, Fenster, Ventilatoren und Lernmaterial; keine Kinder. Nur Land belegt, kein Schulname. Ausstattung eines Raums belegt keine allgemeine Lernqualität. |
| 11 / F21 | Wassertransport, Uganda | Mstephen247, „Woman carrying jerrycan Of water.jpg“, Revision 1214213035; CC BY-SA 4.0 | Kanistertragen in Alltagsszene, Hauptpersonen von hinten. Land belegt; Weglänge, Menge, Qualität, Knappheit und Einkommen unbekannt. |
| 12 / F22 | Gesundheitsstation Dankh Sene, Distrikt Diourbel, Senegal | Nathaly Herrel / President’s Malaria Initiative, „Dankh Sene health post in Diourbel District, Senegal (14153373970).jpg“, Revision 958484348; Public Domain, PD-USGov-HHS | Kleine Station außen, am Gebäudeschild verortet, keine Patienten. Gewählte Alternative: Außenansicht statt unbelegt einfacher Innenausstattung. Keine Aussage zu Behandlungsqualität oder Krankenhausdichte. |

Vollständige Original-/Revisions-/Lizenzlinks, Attribution, Daten, sichtbarer Inhalt, Personendarstellung und Grenzen: [Bildquellen](bildquellen.md), [lokale Nachweisseite](../bildnachweise.html), `data/media.json`. Commons-API-Antworten liegen unverändert unter `docs/media/`. Für das gemeinfreie US-Regierungswerk zusätzlich tatsächliche Lizenzvorlage mit Revision und Hash: `docs/media/healthlicense.json`; Commons-Dateiseite enthält PD-USGov-HHS und die Flickr-Prüfung als „United States Government Work“. Keine erfundenen Lizenz-URLs; keine beliebige automatische Anerkennung von Public Domain.

Alle fünf Originaldownloads wurden per Commons-SHA1 sowie dokumentierter SHA256 geprüft und als WebP optimiert: maximal 1400 Pixel, Qualität 82, kein Hochskalieren, kein inhaltlicher Eingriff und kein gespeicherter Beschnitt. Bilder bleiben vollständig sichtbar. Zusammen 24 lokale Fotos mit 4,76 MiB, je unter 500 KiB. Kein externes Bildladen zur Laufzeit. Alle 24 Ableitungen separat aus Originalen bytegleich reproduziert.

**Erhalten:** Die 19 bisherigen Bilddateien und ihre Quellenidentitäten bleiben bytegleich. Küste jetzt freiwillige Naturraumspur; Industriebetrieb weiter bei Wirtschaft/Betriebsbedarf; Universität, Wassertank und Butaro-Krankenhaus als zusätzliche Gegenüberstellungen. Nummern 1–6 und 10 behalten ihre bisherigen Identitäten.

## Lernfolge und betroffene Kriterien

| Abschnitt | Umsetzung | Grenze / Prüfung |
|---|---|---|
| Akte 002, erste Wahl | „Welche vier Bilder passen für euch besonders zu Afrika?“ Erst allein überlegen, dann vier als Team. Bestätigen und auf Papier sichern. | Unbewertet; keine Redaktionsbehauptungen vor bestätigter Wahl. Kein unbeeinflusster Vortest nach Akte 001. |
| Erfundene Redaktion | Bilder 2/5/7/11: Wüste, Landwirtschaft, Lehmhäuser, Wassertransport. Sechs pauschale Behauptungen deutlich von neutralen Fototiteln getrennt, „keine Tatsachen“. | Kein Beleg eines allgemeinen Medienbildes, keine Gleichsetzung mit allen Medien. Kurze mündliche Frage; noch keine komplette Gegenbeweisstrecke. |
| Bewertete Auswahlaufgabe | Einige Orte (2), unterschiedliche Orte (1), Bergbau/Handel 8 oder 10 (1), Lern-/Behandlungsort 9 oder 12 (1). Vier Schritte, eine Gesamtabgabe. | Alle vier gültigen Kombinationen getestet. Ein beliebiges fehlendes Foto genügt nicht automatisch. Punktelogik unverändert. |
| Akte 003, Arbeiten | Bergbau, Landwirtschaft, Industriebetrieb, Handel; Fahrzeugproduktion bei Tanger als bestehendes Schema; Kakaokette weiter vorhanden. | Konkrete Gegenbelege zu „nur Landwirtschaft“, keine Rangfolge rückständig/modern und keine Häufigkeitsangaben. |
| Akte 003, Wohnen | Lagos Island/Makoko bleiben derselbe Stadtvergleich; neues Dorfmotiv ausdrücklich Ghana. | Perspektiven und Jahre unterscheiden sich. Bauweise/Kleidung verraten keine individuellen Einkommen. Keine Umkehr „alle wohlhabend“. |
| Akte 003, Bildung/Medizin | Klassenraum/Universität, Gesundheitsstation/Krankenhaus. | Schulbildung ist konkret belegt; Klinikmangel oder allgemeine Qualität bleiben ohne weitere Daten offen. |
| Akte 003, Wasser | Neue kurze Ansicht: Tragen und Speichern. | Kanister ≠ schmutzig/arm; Tank ≠ reich. Qualität und Weglänge unbekannt. |
| Vier Rückbezüge | „Neue Beweise gefunden!“ nach Auswertung bei Arbeiten, Wohnkontext, Bildung/Medizin und Wasser; alle sechs Behauptungs-IDs wieder aufgenommen. | Unbewertet, keine neue Antwort- oder Schreibschleife. Es darf auch „mit diesen Fotos nicht geklärt“ herauskommen. |
| Akte 004 | Derselbe Zwölferkatalog, getrennte bestätigte Auswahl. Was verändert/ergänzt sich, was bleibt, welcher Beleg passt? | Gleiche Viererwahl zulässig, kein erfundener Vorhervergleich. Nur bisherige Überschriftenaufgabe bewertet. |
| Sitzung | Inhaltsversion 2.1 zusätzlich zum bestehenden Schema. Alte 2.0-Identitäten verständlich zurücksetzen; neue Sitzungen normal wiederherstellen. | Alte Papiernotizen nicht als neue Fotoauswahl umdeuten; neuen Bogen verwenden. Getrennte Auswahlen, Teilauflösung und Werte bleiben in 2.1 erhalten. |

Die sechs **erfundenen Behauptungen** lauten: „In Afrika leben alle Menschen in Armut“, „Dort wohnen alle Menschen in einfachen Hütten“, „In Afrika arbeiten Menschen nur in der Landwirtschaft“, „In Afrika gibt es keine Schulbildung“, „Krankenhäuser gibt es dort kaum“, „Überall fehlt sauberes Wasser“. Es sind Prüfgegenstände, keine Tatsachenbehauptungen der Anwendung.

## Materialien und Sprache

Gemeinsamer Generator nutzt Katalog, Rubriken, Lernschritte und Behauptungen aus denselben Daten wie das Spiel. Schülerbogen unverändert neutral, genau zwei A4-Seiten. Erwartungshorizont aktualisiert in Markdown/HTML/PDF: 13 nummerierte Seiten, sämtliche zwölf Motive mit Orts-/Urheber-/Lizenzverweisen, neue Redaktionsauswahl, Gegenbelege, Rückbezüge, Grenzen und Sitzungswechsel. Alle 15 Seiten digital gerendert und angesehen. Keine reale Druckprobe.

Schülertexte überwiegend kurze Hauptsätze und konkrete Begriffe. Zusätzliche kostenlose deutsche Hilfen erklären Bergbau, Klischee und Gesundheitsstation. Keine neue Pflichtschreibarbeit. Das Wörterbuch selbst bleibt einschließlich Belegen, Schrifttrennung und 32 offenen Werten unverändert; keine neuen unbelegten Übersetzungen. Keine sprachkundige oder muttersprachliche Prüfung behauptet.

## Prüfung und offene Abnahme

Tatsächlich ausgeführte Prüfungen und vollständige Protokolle stehen im [Testbericht](testbericht.md), neue Ansichten und PDF-Renderings unter `docs/qa/v21/`. Die ursprünglichen V2-Ergebnisse bleiben unter `docs/qa/v2/` historisch erhalten. Neue Regressionen prüfen insbesondere die Reihenfolge der persönlichen Wahl/Behauptungen, alle gültigen Gegenbelege, vier punktneutrale Rückbezüge, gleichbleibende Auswahl, alte Sitzungsidentitäten und den belegten Public-Domain-Sonderfall.

19 offene Audit-Kategorien bleiben ausdrücklich bestehen: sechs Wörterbuchlücken, sieben sprachkundige Abnahmen, echtes Schul-iPad sowie Curriculum-/Sachquellenoriginale, realer Druck, Lerngruppe/Zeit/Lernwirkung und öffentliche Live-Funktion. Einzelbilder belegen außerdem keine konkrete Armutsquote, Krankenhausdichte oder Trinkwasserqualität. Das ist eine fachliche Aussagegrenze, kein durch erfundene Daten zu schließender Mangel. [Abnahme](abnahme.md).
