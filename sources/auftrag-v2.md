# Geprüfter Entwicklungsauftrag: Die geheime Ermittlungszentrale 2.0

Diese Fassung ersetzt die bisherigen Entwicklungsaufträge für diese Überarbeitung. Sie führt die fachliche Konzeption und alle acht Work-Befunde zusammen. Frühere Texte und Referenzdateien dienen als Quellen; bei widersprüchlichen Projektvorgaben gilt diese Fassung. Sicherheits- und Werkzeugvorgaben deiner Umgebung gelten unverändert.

## 0. Auftrag, Ausgangsstand und Veröffentlichungsgrenze

Überarbeite die bestehende Anwendung tatsächlich. Liefere keine bloße Planung. Erhalte funktionierende Bestandteile und vermeide einen vollständigen Architekturwechsel.

- Repository: `Feerson1617/Ermittlungszentrale`
- Ausgangsbranch: `feature/detektivspiel-komplett`
- Bestehender Draft-PR: `#1`, Zielbranch `main`
- Historischer Work-Prüfstand: `ede9a89234c880bb81f7a4d1f64d6a9f741b101c`
- Öffentliche Spieladresse: `https://feerson1617.github.io/Ermittlungszentrale/`

Lies vorhandene `AGENTS.md`, README, Akten-, Bewertungs- und Mediendaten, Tests und Materialgeneratoren. Prüfe den aktuellen Branchstand; der genannte Commit ist kein Rücksetzauftrag. Erhalte zwischenzeitliche und fremde Änderungen. Behandle vorhandene Dateien unter `sources/` als schreibgeschützte Referenzen. Fehlende Anhänge sind kein Grund, die Arbeit nicht zu beginnen: Dieser Auftrag enthält die benötigten Anforderungen.

Arbeite zunächst ausschließlich in der lokalen Arbeitskopie der Entwicklungsumgebung. Lokale Commits sind erlaubt. Kein Push, kein neuer PR, kein Remote-PR-Update, kein Merge, kein Deployment und keine Änderung von Pages- oder Umgebungsberechtigungen ohne gesonderte Freigabe. Ein Push auf den bisherigen Entwicklungsbranch kann die öffentliche Website automatisch aktualisieren. Eine frühere Freigabe für einen anderen Commit gilt nicht für diese Überarbeitung.

Halte am Ende einen prüfbaren Diff und einen wiederherstellbaren lokalen Stand bereit. Wenn die Umgebung kurzlebig ist, liefere ein Projektarchiv oder ein Git-Bundle mit Startanleitung, soweit möglich. Keine Zugangsdaten, personenbezogenen Testdaten oder unnötigen Abhängigkeiten mitliefern. Nach späterer Freigabe soll derselbe Branch und damit PR #1 aktualisiert werden; niemals fremde Änderungen durch Force-Push überschreiben.

## 1. Unveränderte Rahmenbedingungen

Zielgruppe: leistungsschwache 7. Klasse mit unterschiedlichen Deutschkenntnissen und teilweise Lese-Rechtschreib-Schwäche. Zweierteams, Schul-iPads, bevorzugt Safari im Querformat. Die Geräte können zwischen Unterrichtsstunden vollständig zurückgesetzt werden.

Erhalte eine zentrale `index.html` als Spieleinstieg mit fünf unabhängig anwählbaren Akten. Lokale JavaScript-, CSS-, Bild- und Datendateien bleiben erlaubt. Druckmaterialien und Quellen dürfen eigene Dokumente besitzen. Keine Schülerkonten, Datenbank, verpflichtende dauerhafte Speicherung, Audioausgabe oder Zeitwertung.

Startbildschirm: kompakte Begrüßung oben links, kleines Detektivmotiv oben rechts, vier große Aktenkästen in zwei Spalten, darunter eine breite freiwillige Bonusakte. Im Hochformat sinnvoll umbrechen. Keine Neugestaltung zulasten funktionierender Bedienung.

Die Hauptwertung bleibt 30 Punkte: Akte 001 = 5; Akte 002 = 5; Akte 003 = 3 × 5; Akte 004 = 5. Akte 005 bringt getrennt höchstens 5 Bonuspunkte. Neue wirtschaftliche, gesellschaftliche und reflexive Lernimpulse bleiben unbewertet. Persönliche Vorstellungen, Bildauswahlen, eigene Fragen und Veränderungen der Vorstellungen werden niemals nach Richtigkeit bepunktet.

Teampunkte sind Spielrückmeldungen, keine individuellen Schulnoten und kein objektiver Nachweis eines Lernzuwachses. Keine Rangliste mit Namen. Wörterbuch, Begriffserklärungen, Bildvergrößerung und Bedienhilfen kosten keine Punkte; nur ausdrücklich als Lösungshinweise bezeichnete Hilfen verändern das Punktelimit.

## 2. Fachlicher Rahmen und Umgang mit Belegen

Grundlage ist das bereitgestellte ETS-Curriculum, Jahrgang 7: „Afrika – Abhängigkeiten von Naturraum und Bevölkerungsentwicklung und seine wirtschaftlichen Potentiale“. Schwerpunkte: Afrikabild in Deutschland, naturräumliche Abhängigkeiten, Bevölkerungswachstum als Chance und Risiko, wirtschaftlicher Aufschwung, nachhaltige Entwicklungschancen.

Ergänzend: Geographie-Fachanforderungen Schleswig-Holstein 2015 und Leitfaden 2016, insbesondere Raumwahrnehmung/-konstruktion, Karten- und Medienauswertung, Kommunikation, begründetes Beurteilen, Vorstellungsentwicklung und Reflexion. Der Allgemeine Teil von 2024 ersetzt den alten Allgemeinen Teil; prüfe spätere Änderungen auf dem offiziellen Fachportal, falls du Aussagen zur aktuellen Geltung machst. Erfinde keine Kompetenzkennziffern oder Seitenbezüge. Unterscheide verbindliche Fachvorgaben und didaktische Vorschläge. Das Spiel eröffnet die Einheit und erfüllt nicht deren gesamten Stoffumfang.

Leitlinie: Vorstellungen sichtbar machen → an räumlich verorteten Belegen prüfen und erweitern → begründet reflektieren. „Natur und Umwelt – Wirtschaft – Zusammenleben“ sind zunächst Betrachtungsperspektiven. Das bloße Sortieren in diese Bereiche ist noch keine Nachhaltigkeitsbewertung. Letztere wird in Akte 005 durch eine offene Frage zu Nutzen, Teilhabe und Umweltfolgen angebahnt.

Unterscheide immer: sichtbarer Bildinhalt, zusätzlich belegte Sachinformation und Vermutung. Ein Gegenbeispiel widerlegt „nirgends/niemand/ausschließlich“, aber keine Aussage über „meistens“, Häufigkeiten oder Anteile. Ein Krankenhausfoto belegt weder flächendeckenden Zugang noch Unabhängigkeit von internationaler Finanzierung. Eine Skyline belegt weder Einkommen noch Wachstum. Ein Betrieb zeigt nicht automatisch steigenden Wohlstand oder gute Arbeitsbedingungen.

Landwirtschaft ist kein Gegenbegriff zu Modernität, Qualifikation oder Wohlstand. Stelle Wirtschaftsbereiche nicht als Werteskala dar. Afrika darf weder als einheitlicher Krisenraum noch als einheitlicher Erfolgsraum erscheinen. Nutze konkrete Orte und zeige afrikanische Akteurinnen und Akteure als Handelnde. Staatsangehörigkeit, Herkunft, Beruf und Einkommen von Abgebildeten dürfen nicht aus ihrem Aussehen erschlossen werden.

Eine erfundene Redaktion ist ein didaktisches Modell, kein empirischer Nachweis eines allgemeinen „deutschen Afrikabilds“. Die Lernenden untersuchen ihre Teamvorstellungen und einen ausgewählten Medienausschnitt. Vermeide Pauschalurteile über deutsche Medien und Hilfsorganisationen. Die erste Bildauswahl folgt bereits auf Akte 001 und ist daher kein unbeeinflusster diagnostischer Vortest.

## 3. Lernumfang und Sprache verbindlich begrenzen

Erhalte die fachlichen Erweiterungen, unterscheide aber einen kurzen Kernweg und freiwillige „Weitere Spuren“. Es gibt keine neue Akte und keine weiteren bepunkteten Aufgabenblöcke. Die zusätzlichen Perspektiven werden in vorhandene Fälle integriert.

Verbindlich im Kern: drei Länderfälle, ein Industriebeispiel, ein Dienstleistungsbeispiel, eine einfache Kakao-Verarbeitungskette, ein Stadtvergleich zu unterschiedlichen Lebensbedingungen und kurze Belege zu Bildung/medizinischer Versorgung. Zusätzliche Film-, Digital-, Energie- oder Logistikbeispiele bleiben als freiwillige Vertiefungen vorhanden, nicht als weitere Pflichtstrecke.

Planungsziel, ausdrücklich ungemessen:
- Stunde 1: 5 Min. Organisation, 10 Min. Akte 001, 20 Min. Akte 002, 10 Min. Auswertung/Puffer.
- Stunde 2: 3 Min. Wiedereinstieg, 26 Min. Akte 003, 9 Min. Akte 004, 7 Min. gemeinsame Sicherung.
- Akte 005 und „Weitere Spuren“: freiwillig für schnellere Teams oder eine weitere Stunde.

Papierarbeit ist in den Aktenzeiten mitgedacht. Keine Garantie, dass alle Teams das in 90 Minuten schaffen. Dokumentiere eine Drei-Stunden-Alternative: 001/002, 003, 004/Auswertung; damit entsteht keine notwendige Speicherung mitten in einer Akte. Kürze zuerst optionale Breite, nicht Rückmeldung oder Reflexion.

Arbeitsaufträge möglichst ein bis zwei kurze Sätze; Zusatzinformation je Belegkarte etwa ein bis zwei Sätze. Das sind Gestaltungsziele, keine Anweisung zu ungrammatischen Textfragmenten. Keine langen Pflichttexte. Ein Entscheidungsschritt pro Ansicht; bei gemeinsam bewerteten Teilfragen schrittweise Eingabe ohne vorzeitige Einzelbewertung, anschließend klare Gesamtabgabe. Doppelte Eingaben vermeiden.

Die Teams wechseln die Bedienung ungefähr nach jedem Fall. Vor der ersten gemeinsamen Bildauswahl denkt jedes Kind kurz selbst nach; danach einigt sich das Team. Keine scheinbare Individualdiagnose aus dieser Teamentscheidung.

## 4. Akte 001 – Der verschwundene Titel

Erhalte die vier vorhandenen authentischen Fotos: Atlas-Schnee, Namib-Wüste, Lagos und Regenwald im Kongobecken. Auftrag: „Alle Fotos zeigen Orte auf demselben Kontinent. Wie heißt er? Ein Wort genügt.“ Die Hinweise und 5/3/2/1-Staffel bleiben erhalten, sofern sachlich korrekt. Allein die ersten Hinweise müssen noch keine eindeutige Lösung liefern; die letzte Hilfe muss mit einer einfachen Weltkarte zum Ziel führen.

Vor der Auflösung keine unbeabsichtigte Nennung Afrikas im normalen Start-/Akte-001-Ablauf, in Vorschaubildern, Alternativtexten, Seitentiteln oder ausgegebenem Schülerbogen. Abbildungen müssen dennoch sinnvoll beschrieben werden. Die Lösung darf durch geografische Überlegung oder Wiedererkennen eines Motivs gefunden werden.

Alle Akten bleiben unabhängig anwählbar. Deshalb gibt es keine globale Geheimhaltung: Wer absichtlich Akte 002–005 öffnet oder Quellen untersucht, kann das Thema erfahren. Empfehlung „Beginnt mit Akte 001“ genügt; keine neue Zugangssperre. Lizenzangaben dürfen nicht für einen vermeintlichen Spoilerschutz unzulässig entfernt werden.

Richtige Namensvarianten akzeptieren, darunter `Afrika`, `afrika`, `AFRIKA`, `Africa`, `Affrika`, `Africka`, `Afirka`, `Afrka`. `Amerika`, `America`, `Südafrika`, `Asien` sind keine richtigen Kontinentlösungen. Weitere eindeutige Schreibvarianten aufgabenspezifisch behandeln, nicht mit einer pauschalen Distanzschwelle.

T4 verbindlich: „Afrika ist ein Kontinent“ und „Afrika ist kein Land, sondern ein Kontinent“ sind richtig. Die eindeutig falsche Zusatzbehauptung „Afrika ist ein Land“ zählt als fachlich falsch, nicht als Schreibfehler; auf früher Stufe greift die normale Versuchs-/Hinweisregel. Ein mehrdeutiges Fragment wie „Afrika Land?“ darf nicht allein aufgrund des Wortes „Land“ automatisch falsch sein. Löse echte Mehrdeutigkeit neutral auf, ohne Antworten vorzusagen. Länderfragen in Akte 003 benötigen eigene Regeln.

Abschluss: Lösung und Weltkarte zeigen; Themenname, Punkte und rote Markierung des gesuchten Kontinents auf Papier sichern.

## 5. Gemeinsamer Auswahlkatalog für Akten 002 und 004

Erweitere den bisherigen Auswahlkatalog auf genau zwölf nummerierte authentische Motive. Erhalte möglichst die Identitäten und Nummern 1–10: Savanne, Wüste, Regenwald, Lagos, Landwirtschaft, Atlas-Schnee, Küste, Industrie, Universität, städtischer Alltag/Markt. Ergänze 11: Wasserzugang/Wasserversorgung; 12: medizinische Versorgung. Nutze respektvolle Fotos ohne akute Notfälle, entwürdigende Darstellungen oder identifizierbare leidende Kinder. Bevorzuge für die Ergänzungen andere Länder als Ghana, sofern passende belegte Quellen verfügbar sind.

Wasserzugang ist nicht automatisch Wassermangel. Medizinisches Personal nicht allein anhand des Fotos als „einheimisch“ bezeichnen; eine belegte örtliche Einrichtung reicht. Keine logospezifische Hilfskampagne erfinden oder reale Organisationen abwerten.

Trenne drei Kennungen: stabile interne Medien-ID, sichtbare Auswahlbildnummer 1–12 und Dateipfad. Die bestehenden Dateien `11.webp` usw. können schon andere Motive enthalten; nicht überschreiben. Zusätzliche Ermittlungsbilder erhalten eigene Belegkennungen, etwa A3-B1, und gehören nicht automatisch zum Zwölferkatalog. Beide Auswahlakten nutzen identische Motive, Nummern und sachliche Grundbeschriftungen; keine suggestiven Titel wie „Armut“ ohne Beleg.

Auch zwölf Bilder sind keine repräsentative Stichprobe Afrikas. Diese Grenze wird am Ende ausdrücklich benannt. Vorhandene Quellen und geeignete Bilder weiterverwenden; zusätzliche Medien gezielt und nicht als Selbstzweck beschaffen.

## 6. Akte 002 – Die Bilder im Kopf

### 6.1 Eigene Vorstellungen sichtbar machen

Auftrag: „Welche vier Bilder kommen euch zuerst in den Sinn, wenn ihr an Afrika denkt?“ Kurze Einzelüberlegung, dann gemeinsame Auswahl von vier aus zwölf Bildern. Kein Richtig/Falsch, keine Punkte, keine Rangfolge „besserer“ Bilder. Bildnummern auf Papier notieren; bestätigte Auswahl separat sichern.

Nicht behaupten, die erste Wahl sei unbeeinflusst: Akte 001 hat bereits andere Räume gezeigt. Keine Frage „Welche vier Bilder beweisen, dass Afrika vielfältig ist?“ vor dieser Auswahl.

### 6.2 Eine einseitige Redaktion untersuchen

Eine ausdrücklich erfundene Redaktion veröffentlicht vier vorhandene Fotos mit der Überschrift „So sieht Afrika aus!“. Bevorzugter Ausschnitt: 1 Savanne, 2 Wüste, 5 Landwirtschaft und 11 Wasserzugang. Begründe die Auswahl als begrenzten Themenfokus, nicht als Beweis allgemeiner Armut. Wasserknappheit nur mit zusätzlichem belastbarem Kontext behaupten.

Kurzer Auftrag: „Vergleicht eure Bilder mit den Bildern der Redaktion. Was zeigt sie? Was fehlt?“ Eine mündliche Beobachtung genügt.

Greife typische vereinfachte Vorstellungen zu Natur, Arbeit und Zusammenleben mit höchstens zwei bis drei kurzen Vermutungsimpulsen auf. Themenpool für die Redaktion: Wüste/Hitze/Wildtiere; Landwirtschaft/Plantagen/Rohstoffe; Armut, Ernährung, Bildungsangebote und Versorgung. Bananen-, Baumwoll- oder Kakaoanbau dürfen als Teil bestimmter regionaler Wirtschaften vorkommen, nicht als Beschreibung des gesamten Kontinents. Die Wahrnehmung von Hilfskampagnen kann angesprochen werden, ohne reale Organisationen wie Brot für die Welt oder Ärzte ohne Grenzen pauschal für Stereotype verantwortlich zu machen. Nicht eine ganze Liste negativer Stereotype wiederholen. Kinder dürfen „Das wissen wir noch nicht“ wählen. Nicht unterstellen, dass alle Lernenden solche Vorstellungen besitzen.

Die ausführlichen Widerlegungen zu Berufen, Bildung und Lebensbedingungen folgen erst in Akte 003. Verschiebe den im alten Auftrag vorgesehenen vollständigen Gegenbeweis-Parcours dorthin. Akte 002 endet bereits mit der gesicherten Einsicht, dass Auswahl begrenzt ist; offensichtliche falsche Aussagen dürfen nicht unkommentiert als Tatsachen stehen bleiben.

### 6.3 Bewertete Aufgabe: fünf Kriterienpunkte, eine Gesamtabgabe

Bevorzugte Umsetzung: geschlossene Antwortformate anstelle fehleranfälliger Satzinterpretation.

1. „Zeigen die vier Fotos alle Orte oder einige Orte?“ Zwei klare Optionen; „einige Orte“ = 2 Rohpunkte.
2. „Sieht es überall auf dem Kontinent gleich aus?“ Ja/Nein; Nein = 1 Rohpunkt.
3. „Welches fehlende Bild zeigt eine Fabrik oder Geschäfte?“ Ein Bild auswählen = 1 Rohpunkt.
4. „Welches fehlende Bild zeigt Lernen oder medizinische Versorgung?“ Ein Bild auswählen = 1 Rohpunkt.

Für 3 und 4 sämtliche tatsächlich passenden, nicht in der Redaktion enthaltenen Bilder im Erwartungshorizont zulassen. Beispielsweise Industrie/Markt sowie Universität/Gesundheitszentrum, soweit Bild und Kontext das tragen. Eine Skyline ohne entsprechenden Tätigkeitsbeleg ist kein automatischer Berufsbeleg. Die Formulierungen sind bei abweichenden Fotos genau anzupassen.

Teilfragen schrittweise zeigen, Antworten behalten, am Ende gemeinsam abgeben; vorher keine Lösungen oder Teilpunkte anzeigen. Maximal 5 Rohpunkte. Erste Bildauswahl und Gespräch bleiben unbewertet. Eindeutige einfache Optionen sind für diese Lerngruppe zulässig; vermeide nur, dass das ganze Spiel ohne Bildprüfung anhand eines einheitlichen Antwortmusters lösbar wird.

T1: Falls Freitext alternativ erhalten bleibt, akzeptiere insbesondere „nur wenige“, „ein paar Orte“, „nur ein paar Orte“, „Die Fotos zeigen nur einen kleinen Teil“ sowie eindeutige Schreibvarianten. Kein Zwang zu vollständigen Sätzen. Bei Umstellung auf Auswahl im Bericht ausdrücklich erklären, dass die Fehlerquelle beseitigt statt eine allgemeine Sprachinterpretation versprochen wird. Nicht mehr verwendeten Bewertungs-Code entfernen oder weiterhin korrekt testen.

### 6.4 Auflösung

Teilpunkte unverändert sichern. Falsche Kriterien kurz auflösen und gegebenenfalls eine unbewertete Korrektur anbieten; siehe Abschnitt 10. Kernsatz: „Die Fotos zeigen einige Orte. Sie zeigen nicht, wie alle Menschen leben.“

Den Begriff „Klischee“ erst nach der offenen Auswahl bei Bedarf erklären: „Eine feste Vorstellung, die Unterschiede oft ausblendet.“ Keine zusätzliche Pflichtdefinition auf Papier. Eine Quellenbeobachtung genügt: „In der Auswahl fehlt …“

## 7. Akte 003 – Ein Kontinent, viele Gesichter

Diese Akte verbindet weiterhin die drei bepunkteten Länderfälle mit kurzen unbewerteten Beleg-Ermittlungen. Die Länderzuordnung dient der Orientierung, nicht allein als Nachweis von Umlernen. Jeder Fall kombiniert Foto, einfache Lageinformation/Karte und mindestens eine neue Beobachtung. Die Informationen müssen ohne vorausgesetztes Spezialwissen zur Lösung reichen.

### 7.1 Marokko: Naturraum UND Industrie

Erhalte den Schnee-im-Atlas-Fall, Lösung Marokko, maximal 5 Punkte. Einfache Lagebeziehung: Norden/Nordwesten Afrikas. Foto, Fundort und Kartenpunkt müssen zusammenpassen.

Unbewerteter Kern: Schnee-/Gebirgsfoto plus belegtes Beispiel der Fahrzeugproduktion in Marokko. Trenne die Aussagen ausdrücklich:
- Schnee im Gebirge widerspricht „überall ganzjährig heiß“.
- Die Fabrik belegt industrielle Tätigkeit; sie widerlegt nicht, dass ein Standort in einer trockenen Landschaft liegen kann.

Auftrag: „Welche Spur zeigt einen anderen Naturraum? Welche zeigt einen anderen Arbeitsplatz?“ Zwei Zuordnungen und eine kurze Auflösung genügen. Nicht „Welche Fabrik beweist, dass Marokko keine Wüste ist?“

Sicherung: „In Marokko gibt es unterschiedliche Landschaften und Arbeitsplätze.“ Schnee ist örtlich und jahreszeitlich begrenzt. Keine automatische Gleichsetzung von Industrie und gutem Lebensstandard.

Freiwillige weitere Spur: vorhandenes Noor-Foto. Solarthermie mit Spiegeln korrekt beschreiben, nicht als Photovoltaik ausgeben. Kein pauschales Nachhaltigkeitssiegel und keine zusätzlichen Punkte.

### 7.2 Nigeria/Lagos: Dienstleistungen und gesellschaftliche Unterschiede

Erhalte das Lagos-Länder-Mystery, Lösung Nigeria, maximal 5 Punkte. Einfache Lagebeziehung: Westafrika/Küste. Die Skyline lokalisiert einen Stadtraum, nicht die Lebensverhältnisse sämtlicher Einwohner.

Unbewerteter wirtschaftlicher Kern: ein belegter Arbeitskontext aus Handel oder Dienstleistungen. Nicht nach unbekannten Berufen raten lassen: Eine kurze Information benennt die Tätigkeit, ein Bild/Schema hilft bei der Zuordnung. Auftrag beispielsweise: „Welche Arbeit gehört zu dieser Spur?“ Die Antwort ergibt sich aus Belegen, nicht aus Vorwissen oder vermeintlich unmöglichen Berufen.

Freiwillige weitere Spuren: digitale Dienstleistungen oder Filmproduktion/Nollywood. Alle ursprünglich vorgesehenen Bereiche bleiben als Vertiefungsmöglichkeit dokumentiert; nicht vier bis sechs neue Berufe als Pflichtquiz. Eine landesweite Filmwirtschaft nicht ohne Ortsbeleg ausschließlich Lagos zuordnen. Icons dürfen Tätigkeiten darstellen, gelten aber nicht als fotografischer Ortsnachweis.

### 7.3 Integriertes Kern-Mystery: Zwei Bilder – eine Stadt?

Nutze zwei belegte Fotos unterschiedlicher Wohn-/Stadträume derselben Stadt, vorzugsweise Lagos, plus zwei kurze verlässliche Kontextkarten. Wenn nötig, wähle ein besser belegtes afrikanisches Stadtbeispiel und passe sämtliche Ortsbezüge an. Nutze möglichst vergleichbare Aufnahmezeiträume; sonst Unterschiede des Aufnahmejahrs sichtbar einordnen.

Ablauf:
1. „Was ist auf den Bildern verschieden?“ Eine sichtbare Eigenschaft auswählen/benennen.
2. „Könnten beide Orte in derselben Stadt liegen?“ Unbewertete Vermutung.
3. Orte mit Karte oder eindeutiger Quelleninformation auflösen.
4. „Welche Unterschiede können wir belegen?“ Die kurzen Kontextkarten zu Wohnen und einem Versorgungsaspekt auswerten.

Einkommensunterschiede und Vermögensunterschiede sind nicht identisch. Es geht zunächst um unterschiedliche Lebensbedingungen. Erkläre mit belegtem Kontext, dass finanzielle Möglichkeiten den Zugang zu Wohnraum und Leistungen mitprägen, aber nicht die einzige Ursache sind; Infrastruktur und öffentliche Versorgung spielen ebenfalls eine Rolle. Keine Moral von individueller Leistung/Fleiß und Armut.

Keine Einkommen aus Gebäuden, Hautfarbe oder Kleidung ableiten; keine erfundenen dokumentarischen Haushalte. Keine abwertenden Stadtteilbezeichnungen. Eine kurze dritte Alltagsperspektive soll verdeutlichen, dass es nicht nur zwei einheitliche Gruppen „arm“/„reich“ gibt; sie darf nicht ohne Beleg als statistische Mittelschicht bezeichnet werden.

Sicherung: „Menschen können in derselben Stadt sehr unterschiedlich leben.“ Zusatz im Lehrermaterial: wirtschaftliches Wachstum kann ungleich zugutekommen; die Fotos selbst belegen keinen Wachstumstrend. Armut wird weder geleugnet noch zur Eigenschaft des Kontinents erklärt. Diese Ermittlung ist verpflichtender Kern, aber unbewertet.

### 7.4 Ghana: Anbau, Verarbeitung und Handel

Erhalte den Kakao-Länderfall, Lösung Ghana, maximal 5 Punkte. Kakao wächst auch in anderen Ländern; die Lösung folgt aus dem konkreten Foto-/Kartenbeleg, nicht aus einem vermeintlichen Alleinstellungsmerkmal.

Unbewerteter Kern: drei bis vier Bild-/Symbolkarten ordnen:
„Kakaofrüchte anbauen und ernten → Bohnen aufbereiten/verarbeiten → Produkte herstellen → handeln/verkaufen“.

Für Klasse 7 darf die Kette vereinfacht werden; erkennbare Kakaobohnen als Ausgangsmaterial der Verarbeitung erhalten. Ein Bild einer Betriebsfassade zeigt keinen Produktionsablauf. Benötigten Ablauf mit belegter Information oder ausdrücklich als Schema gekennzeichneter Grafik erklären.

Zeige anhand eines belegten Betriebs, dass in Ghana auch Verarbeitung und Produktherstellung stattfinden. Nicht behaupten, dies geschehe mit der gesamten Ernte oder ausschließlich dort. Auftrag: „Wo wird angebaut, wo verarbeitet, wo verkauft?“ Keine automatische Zusage, Verarbeitung führe stets zu höheren Gewinnen, mehr Beschäftigung oder allgemeinem Wohlstand.

Sicherung: „Zur Wirtschaft gehören Anbau, Verarbeitung und Handel.“ Freiwillige weitere Frage: „Was braucht ein Betrieb, um mehr selbst herzustellen?“ Zwei bis drei Belege etwa zu Energie, Kenntnissen oder Maschinen; keine vollständige Wirtschaftssimulation.

### 7.5 Bildung, Gesundheit und Rückbezug

Integriere Universität und Gesundheitszentrum aus dem Zwölferkatalog in einen gemeinsamen kurzen Belegvergleich, nicht als zwei weitere Unterrichtskapitel.

Auftrag: „Was zeigen diese Beispiele? Was wissen wir dadurch noch nicht?“
- Belegt: An den genannten Orten gibt es Lernmöglichkeiten beziehungsweise medizinische Versorgung.
- Nicht allein belegt: Alle haben Zugang; die Qualität ist überall gleich; internationale Unterstützung spielt keine Rolle.

Eine örtliche Einrichtung kann zugleich lokal getragen und international unterstützt sein. Selbstbestimmung und Zusammenarbeit sind kein Gegensatz. Kein Ja-Nein-Quiz zur vermeintlichen Hilfsabhängigkeit einer Bevölkerung.

Abschluss, unbewertet: „Welche Spur ergänzt eure erste Auswahl?“ Ein Bild/Beleg und wenige Wörter oder ein Partnersatz reichen. „Das wussten wir schon“ und offene Fragen zulassen. Erst hier werden die wirtschaftlichen und sozialen Vermutungen aus Akte 002 ausführlicher überprüft. Es gibt keine Pflicht, eine vorgegebene Haltung zu übernehmen.

## 8. Akte 004 – Der letzte Ermittlungsbericht

Zeige denselben Zwölferkatalog mit gleicher Nummerierung und sachlicher Grundbeschriftung. Auftrag: „Wählt noch einmal vier Bilder. Vergleicht mit eurer ersten Auswahl.“ Die zweite Auswahl nicht als „richtige“ oder repräsentative Gesamtdarstellung Afrikas bezeichnen.

Erste und zweite Auswahl getrennt halten. Der Papierbogen ist die verlässliche Verbindung. Vorhandene Sitzungsdaten dürfen helfen; ohne sie keinen früheren Zustand erfinden. Ohne früheren Papierbogen aktuellen Kenntnisstand reflektieren und den fehlenden Vergleich kenntlich machen.

Unbewertete Sicherung: „Gleich geblieben … / Neu oder ergänzt … / Dazu passt Beleg …“. Ein Stichwort je benötigtem Feld reicht; nicht alle Satzanfänge obligatorisch ausfüllen lassen. Eine neue Auswahl allein beweist keinen Lernfortschritt.

Erhalte eine klar materialgebundene Überschriftenauswahl, maximal 5 Punkte. Foto und kurze Ortsangabe müssen die richtige Überschrift tragen. Beispiel bei belegtem Marktfoto: „Handel auf einem Markt in Accra“. Distraktoren dürfen sichtbaren Inhalt oder räumliche Reichweite verfehlen, nicht bloß ungewöhnliche Wörter enthalten. Keine zwei gleichermaßen passenden Überschriften als eindeutig richtig/falsch werten.

Nach Wertung kurze Auflösung und Überschrift auf Papier sichern. Eine eigene alternative Überschrift oder Begründung bleibt unbewertet. Abschluss: reguläre Punkte auf Papier addieren; fehlende Akten nicht als gespielte Nullpunkte darstellen. Bonus separat. Keine erfundene sitzungsübergreifende Summe.

## 9. Akte 005 – Die Spur in die Zukunft

Freiwillig und unabhängig startbar. Erhalte vier kurze fiktive Nachrichten mit belegten Fotos: Wasser/Naturraum, Bevölkerung, Wirtschaft, nachhaltige Entwicklung. Kennzeichne: „Erfundene Nachrichten zu echten Orten/Fotos.“ Die Fotografie ist Illustration, kein Beweis der erfundenen Situation.

Natur: Wasserbedarf und unterschiedliche Regenbedingungen. Ein abgeerntetes Feld ist keine belegte Missernte.
Bevölkerung: Zuzug und natürliches Bevölkerungswachstum unterscheiden. Mehr Einwohner bedeuten nicht automatisch mehr Geburten. Die Nachricht darf zusätzlichen Bedarf an Schulen/Wohnraum und mögliche Chancen eröffnen, ohne Ursachen gleichzusetzen.
Wirtschaft: Verarbeitung und wirtschaftliche Möglichkeiten, ohne garantierte Gewinne zu versprechen.
Nachhaltigkeit: Stromversorgung als offene Abwägung. Leitfrage etwa „Wie bekommen Menschen Strom, ohne Natur und andere Menschen unnötig zu belasten?“ Nicht „Solar = automatisch nachhaltig“.

Vier passende Untersuchungsfragen zuordnen, nicht vier exklusive Ursachen behaupten. Benenne den jeweils gesuchten Schwerpunkt; mehrere Themen können zusammenhängen. Auswahltexte verständlich halten. Inhaltliche Schlüsselwörter sind erlaubte Sprachhilfen, bloße Gleichheit von Buchstaben/Reihenfolge ist kein Lösungsweg.

Bonus-Rohpunkte nach Zahl richtiger Zuordnungen: 0→0, 1→1, 2→2, 3→3, 4→5. Anschließend Hinweislimit anwenden. Die vier Felder bleiben unabhängig; Optionen nicht automatisch eliminieren, sodass auch drei richtige Zuordnungen sinnvoll möglich sind. Teilweise richtige Zuordnungen nach Punktefestschreibung auflösen. Eigene Zukunftsfrage unbewertet, mit kurzen Satzanfängen. Keine Pflicht, diese Fragen später als feste Stundenleitfragen zu übernehmen.

## 10. Bewertung, Versuche und die Work-Befunde T1–T4/D1–D2

### Einheitlicher Bewertungsvertrag

Hinweislimit = `[5,3,2,1]`. Auf Stufen 0, 1 und 2 jeweils eine reguläre Gesamtabgabe. Ein Hinweis darf freiwillig vorher geöffnet werden; erreichbare Punkte sichtbar anzeigen. Nach eindeutig falscher Abgabe mit 0 Rohpunkten ist eine neue Gesamtabgabe erst mit dem nächsten Hinweis erlaubt. Auf Stufe 3 unbegrenzt eine einfache Abschlussaufgabe bearbeiten. Erst ihre richtige Lösung bringt 1 Punkt; Hinweisöffnen allein nicht.

Leere/unvollständige Pflichtfelder zunächst als Eingabeproblem behandeln, ohne Versuch zu verbrauchen. Keine Teilpunkte für bloße Teilnahme. Bei mehreren Teilfragen alle erforderlichen Eingaben erst gemeinsam bewerten. Schülerdaten nicht an externe Dienste übertragen.

Bei 1–5 Rohpunkten regulärer Aufgaben gilt: `vergebene Punkte = min(Rohpunkte, Hinweislimit)`. Wertung einmal festschreiben. Danach keine weiteren Hinweise/Neubewertungen dieser Wertung. Fachliche Aufarbeitung ist getrennt und kann keine Punkte erhöhen. Vollständigkeit anhand erfüllter Kriterien bestimmen, nicht anhand ausgeschöpfter Punktgrenze.

### T2/D1: Punktestand und Lernabschluss trennen

Verwende logisch getrennte Zustände für Antwortentwurf, Versuchssperre, festgeschriebene Bewertung, fachliche Vollständigkeit, Auflösung und Papierbestätigung.

- Vollständig richtig: „Alle Teile stimmen. Mit einem Hinweis: 3 Punkte.“
- Teilweise richtig: „Ein Teil stimmt. Eure Punkte bleiben erhalten. Schaut euch die übrigen Spuren an.“
- Vereinfachte Aufgabe: „Abschlussaufgabe gelöst: 1 Punkt.“ Keine Behauptung, alle ursprünglichen Kriterien seien erfüllt.

Nach positiver Teilwertung richtige/falsche Kriterien einzeln mit Beleg zeigen. Höchstens eine kurze unbewertete Korrekturhandlung pro Kernmissverständnis. Bei weiterer falscher Auswahl Lösung erklären und bestätigen lassen, statt eine endlose Schleife zu erzeugen. Erst dann regulär fortsetzen. Rückkehr zur Zentrale bleibt möglich; eine offene Auflösung darf dadurch nicht unbemerkt als abgeschlossen gelten. Dasselbe bei Akte 005.

Historische Regressionsfälle aus dem alten Katalog:
- T2: ein Hinweis; `scope:"einige", diversity:"nein", missing:[1,2]` → raw 3, points 3, trotzdem nur teilweise richtig.
- D1: `scope:"alle", diversity:"ja", missing:[3,1]` → raw 1, Wertung gesichert, aber fachliche Auflösung notwendig.

Die neuen Bildteilfragen haben andere Daten. Historische Fälle als Regression/Fixture dokumentieren und fachlich gleichwertige neue Tests ergänzen; nicht alte Positionsarrays blind übernehmen.

### T3: Antwortentwürfe

Hinweise 1 und 2 dürfen Texte, Bildauswahlen und Zuordnungen nicht löschen. Vor einem Neurendern auch noch fokussierte Eingaben sichern. Nach Hinweis 3 regulären Entwurf und vereinfachte Antwort getrennt verwalten; kurz erklären: „Jetzt gibt es eine einfachere Abschlussaufgabe.“

### T1/T4: Sprachsensible, begrenzte Erkennung

Grammatik, Interpunktion, Groß-/Kleinschreibung und Satzlänge sind keine Bewertungskriterien. Einzelwörter und eindeutige Fragmente reichen. Lokale Unicode-, Groß-/Kleinschreibungs- und Leerzeichennormalisierung, Aliaslisten und aufgabenspezifische Regeln nutzen. Bedeutungsrelevante Satzteile dabei nicht blind entfernen. Negationen nicht pauschal entfernen. Fachlich falsche Begriffe und Behauptungen bleiben falsch.

Keine Schleife „Schreibt klarer“, wenn das System scheitert. Bei wirklich nicht erkennbaren Namen eine neutrale Wortklärung oder alternative Namensauswahl anbieten. Eine solche Darstellung zeigt keine richtige Lösung an; die abschließende inhaltliche Entscheidung zählt genau einmal als reguläre Abgabe auf derselben Stufe. Eindeutig falsche Antworten nicht über einen Klärungsdialog zu kostenlos korrigierbaren Versuchen umdeuten. In Akte 002 bevorzugt von Anfang an Auswahl statt Satzdeutung verwenden.

### D2: Antwortpositionen

Variiere die richtigen Positionen der sieben vereinfachten Abschlussaufgaben bewusst fest; Zufall ist unnötig. Bei Bildkarten müssen angezeigte Beschriftung, Markierung, Option und Lösungs-ID gemeinsam stimmen. Bonusfragen ebenfalls nicht in Lösungsreihenfolge anzeigen. Stabile Kennungen statt Indexarithmetik.

Keine zusätzlichen Wertungsaufgaben. Sieben Wertungen: title, selection, atlas, city, cocoa, headline, future beziehungsweise dokumentierte gleichwertige Kennungen. Unbewertete Lernschritte getrennt modellieren.

## 11. Papiermaterialien und Erwartungshorizont: M1/M2

### M1: Lösung schützen, ohne zusätzliche Standardkopien

Bevorzugte Lösung: Der gesamte zweiseitige Schüler-Blankobogen wird vorab themenneutral formuliert, nicht nur Akte 001. Auf keiner Seite stehen „Afrika“, vorgedruckte Lösungsstaaten, verräterische Beispielsätze oder geografische Lösungstitel. Nutze neutrale Aktennamen, leere Länderfelder und „Markiert den gesuchten Kontinent rot“. Die Weltkarte ist unbeschriftet und hebt keinen Kontinent hervor. Dadurch kann derselbe Bogen von Beginn an ausgegeben werden; kein standardmäßiger Zusatzbogen nötig.

Nur falls dies ohne Verlust der Verständlichkeit nicht gelingt: einen optionalen neutralen Startbogen anbieten und den vollständigen Bogen erst nach der Auflösung bzw. beim direkten Start einer späteren Akte. Nicht beide Lösungen gleichzeitig als Pflichtmaterial verlangen. Der Lehrkraft den gewählten Ablauf eindeutig erklären.

### Wenige schriftliche Ergebnisse

Ein beidseitig bedruckbares A4-Blatt, zwei Seiten: Thema/Weltkarte/Punkte, erste vier Bildnummern, drei Länder mit Punkten, ein wirtschaftlicher und ein sozialer Bild-/Belegverweis, zweite Auswahl, kurze offene Reflexion, gewählte Überschrift, Punktesumme und freiwillige Zukunftsfrage. Stichwörter/Ankreuzen statt vieler Schreibzeilen. Keine zwölf Fotos auf den Bogen drucken; Bilder bleiben digital. Nicht für jede neue Vertiefung ein zusätzliches Pflichtfeld erzeugen.

### M2 und Lehrerdokument

Gemeinsame strukturierte Datenbasis für Aufgaben, Rubriken, sichtbare Bildnummern und Materialexport. Explizite Tabelle „Nummer 1–12 – Motiv – Ort – didaktischer Einsatz“ in Markdown, HTML und PDF. Zusätzliche Belegbilder getrennt auflisten. Keine bloße Bulletliste zum Abzählen.

Erwartungshorizont mit kompakter Lösungstabelle, Seitenzahlen, gültigen Antwortmengen, Schreibvarianten, Hinweislimits, Wertungs-/Auflösungsregeln und Bildgrenzen. Erkläre Quellenstatus, nicht bepunktete Reflexion und Grenzen der Diagnose. Lehrerunterlagen nicht über die normale Schülernavigation verlinken; öffentliche Auffindbarkeit offen benennen.

Alle betroffenen HTML/PDF-Dateien neu generieren, nicht nur fertige PDFs bearbeiten. Sämtliche Seiten rendern und visuell prüfen: Lesbarkeit, Umbrüche, Beschnitt, Karten, Bildnummern und Schreibraum. Schülerbogen genau zwei A4-Seiten; Lehrerdokument nicht künstlich auf die früheren sieben Seiten begrenzen. Reale Druckprobe separat offen halten.

## 12. Lokales Wörterbuch und Hilfen

Oberfläche beibehalten: links deutsches Eingabefeld, Mitte Zielsprachen-Dropdown, rechts Übersetzung. Jederzeit erreichbar, lautlos und ohne Punktabzug. Kein automatisches Übersetzen über das Netz.

Sprachen: Russisch, Ukrainisch, Polnisch, Türkisch, Standardarabisch, Kurmandschi und Sorani; korrekte Sprachkennungen und RTL bei Arabisch/Sorani. Deutsch und Zahlen in gemischten Ansichten sauber ausrichten. Schließen/Sprachwechsel darf Antworten und Hinweise nicht verändern.

Prüfe gezielt „notiert“→„notieren“, „gemeinsam“, „beeinflusst“→„beeinflussen“, „Ermittlungsteam“. Eindeutige Flexions-/Suchaliaslisten, unsichere Ähnlichkeiten nur als Vorschläge. Kein universelles Stemming, das falsche Begriffe still ersetzt. Bei einfachen Schülertexten gegebenenfalls „zusammen“ oder „Team“ statt zusätzlichem Fachwort verwenden.

Neue Kernbegriffe kontextbezogen aufnehmen: Vorstellung, Unterschied, vergleichen, Bildbeleg, Fabrik, Beruf, Verarbeitung, Handel, Bildung, Krankenhaus, Einkommen und Lebensbedingungen. Weiterführende Begriffe nur, wenn sie wirklich verwendet werden. Wortschatzabdeckung gegen die tatsächlichen Arbeitsaufträge prüfen, nicht gegen eine beliebige Zielwortzahl.

Historischer Stand: je 187 vorhandene Einträge in fünf Sprachen, 176/187 Kurmandschi, 177/187 Sorani. Vorhandensein bedeutet nicht lückenlose Quellenbelegung oder muttersprachliche Qualität. Prüfe aktuellen Stand; ergänze nur belegte, kontext- und varietätengerechte Übersetzungen. Quellen und erforderliche Lizenzangaben erhalten. Fehlende Werte verständlich anzeigen, nicht erfinden. Keine neue Sprachvariante hinzufügen.

Knappe kostenlose deutsche Hilfen: Redaktion = Menschen, die Beiträge auswählen/bearbeiten; Ausschnitt = ein Teil; Hinweis = Hilfe beim Rätsel; zuordnen = passende Dinge zusammenbringen. Inhalte erklärender Hilfen nicht versehentlich als kostenpflichtige Lösungshinweise behandeln.

Getrennte Statusangaben für vorhandene Übersetzung, Quellenbeleg/redaktionelle Prüfung und menschliche sprachkundige Prüfung. Automatische Tests oder Muttersprachlichkeit allein garantieren keine fachliche Qualität. Vorhandene menschliche Abnahmefelder niemals ohne tatsächliche Prüfung bestätigen; qualifizierte Sprachkundige können solche Prüfungen durchführen.

## 13. Zustände, Bedienung und technischer Betrieb

Ohne Speicherung muss jede Akte im Arbeitsspeicher spielbar sein. Optionale `sessionStorage`-Wiederherstellung darf Neuladen abfedern. Ohne erlaubten Speicher kann Neuladen den Fortschritt verlieren; keine gegenteilige Garantie. Papier bleibt die Sicherung zwischen Geräten/Stunden.

Bestätigte erste/zweite Bildauswahl getrennt von veränderlichen Entwürfen halten. Ein absichtlicher Neustart darf nur die betroffene Akte nach Warnung zurücksetzen; nicht unbemerkt die andere Auswahl. Keine umfangreiche Historienfunktion nötig. Alte Formate sicher migrieren oder mit verständlichem Hinweis gezielt verwerfen. Bildnummern 11/12 in Validierung, Zählern, Exporten und Tests berücksichtigen.

Fünf Akten unabhängig, keine persistenten Freischaltungen. Navigation und Papierbestätigung eindeutig; kein Verlust festgeschriebener Punkte durch Dialoge oder Auflösungen. Doppelklicks dürfen keine Doppelwertung auslösen. Gesamtanzeige darf nur bekannte Werte ausweisen; optionaler Papierrechner bleibt lokal.

Fotovergrößerung implementieren: eigener klarer Button neben der Bildauswahl, keine verschachtelten Buttons und keine Kollision „Bild auswählen“ versus „vergrößern“. Große Schließen-Fläche, Fokus zurück zum Auslöser, Schrift-/Bildinhalt nicht abgeschnitten. Kein Hover-Zwang, Drag-and-drop nur mit Tippalternative. Orientierung: mindestens etwa 48 CSS-Pixel große Haupt-Touchziele, lesbare Systemschrift, Browserzoom nicht sperren.

Startüberwachung, Zeitlimit, Fehlerdiagnosen und restriktive CSP erhalten. Keine pauschale Lockerung mit `unsafe-inline`/`unsafe-eval` zur Fehlerkaschierung. Bei geändertem Inline-Startscript Hash konsistent regenerieren. Vollständige HTTP-Auslieferung der Module und JSON-Daten; eine Einzeldateivorschau ersetzt das nicht. Kein neues Framework, Backend oder Service Worker ohne begründeten Bedarf.

Entwicklungsrecherche und Spielen trennen: In der erlaubten Entwicklungsumgebung dürfen Bilder/Quellen/Toolpakete heruntergeladen werden. Beim Spielen nur Ressourcen des eigenen statischen Hosts; keine externen Übersetzer, Fonts, Bilder oder Telemetrie. Ein Quellenlink darf eine externe Seite nur nach bewusster Nutzeraktion öffnen, keine automatischen Fremdanfragen. Schülerantworten niemals in URLs, Analytics oder Remote-Logs schreiben.

Lokale Verarbeitung bedeutet nicht vollständige Offline-Fähigkeit. Noch nicht geladene Ressourcen benötigen den eigenen Server. Dokumentiere das. GitHub Pages protokolliert nach Anbieterangaben unter anderem IP-Adressen; deshalb nicht „keine Daten verlassen das Gerät“ oder pauschal „DSGVO-konform“ behaupten. Die App überträgt keine Schülerantworten, Hosting und schulische Datenschutzfreigabe sind getrennt zu beurteilen.

## 14. Medien- und Sachquellen

Vorhandene 15 geeignete Fotos weiterverwenden und gezielt ergänzen. Pro Medium zentrale Metadaten: ID, Nummer falls Auswahlbild, Motiv, belegter Ort, Datum soweit bekannt, Autor, Originalquelle, Lizenz/Version, Bearbeitung, Bildgrenzen und tatsächlicher lokaler Pfad. Prüfsummen und vorhandene Belege erhalten. Quellenbeleg beweist nicht automatisch fachliche Repräsentativität.

Authentische Beweisfotos nicht durch generierte Szenen ersetzen. Dekorative Icons und ausdrücklich gekennzeichnete Schemata dürfen selbst erstellt werden. Für neue Aufnahmen freie geeignete Rechte prüfen; die Veröffentlichung auf einer Institutionsseite ist allein keine Nutzungserlaubnis. Quellen für Sachinformationen und Bildrechte können verschieden sein. Datenschutz/Personenrechte besonders bei Kindern und Gesundheit berücksichtigen.

Lizenzgerechte Attribution hat Vorrang vor absolutem Spoilerschutz. Quellenzugang nicht bis zu einer richtigen Antwort grundsätzlich unmöglich machen. Im normalen Akte-001-Ablauf neutrale Beweisnummern und nötige Kurzcredits, ein gesonderter bewusst aufrufbarer Nachweis darf Ortsinformationen enthalten. Originaltitel und Rechtehinweise in den vollständigen Nachweisen korrekt erhalten. Kein Versprechen, technisch öffentlich zugängliche Lösungen zu verbergen.

Geeignete Primärquellen für die inhaltliche Recherche sind etwa offizielle Betriebsinformationen zur marokkanischen Fahrzeugproduktion, Ghana/Cocoa Processing Company zur Verarbeitung und UNESCO zur nigerianischen Filmwirtschaft. Diese belegen konkrete Beispiele, nicht automatisch gesellschaftlichen Nutzen. Keine Rankings, Einkommenszahlen oder Wachstumswerte ergänzen, wenn sie für die Aufgabe nicht nötig sind. Nötige Daten mit Jahr, Bezugsraum und Quelle versehen.

## 15. Tatsächlich prüfen und Befunde sauber trennen

Work berichtete am historischen Stand lokale Modulprüfungen, Bilddekodierung und PDF-Sichtungen, aber keinen erfolgreichen Live-Durchlauf und keinen echten iPad-Test. Seine 2.871 Einzelassertionen waren keine Browserdurchläufe. Vorhandene Codex-Testzahlen nicht als eigene neue Ergebnisse ausgeben. Historische Tests gegen die alte Abschlussregel beweisen nicht deren didaktische Qualität.

Prüfe den erreichbaren öffentlichen Ausgangsstand lesend, ohne daran etwas zu verändern. Bei DNS/Proxy-/Browserproblemen die Grenze dokumentieren und lokal weiterarbeiten. Ein erfolgreicher Pages-Build ist keine Funktionsabnahme. Ohne Veröffentlichung kann die Live-Seite die neuen lokalen Änderungen nicht zeigen.

Mindestens folgende Tests und Sichtprüfungen durchführen:

1. **Start und Hosting:** `/`, `/Ermittlungszentrale/`, fehlender Slash im zuständigen Server, normaler statischer HTTP-Server ohne spezielle App-Routen. CSS tatsächlich angewendet, fünf Akten sichtbar/bedienbar, Startmeldung beendet. HTML/CSS/Modulgraph/JSON/Bilder/PDF mit richtigen HTTP-Status/MIME, keine relevanten Konsolenfehler. Fehlende/blockierte/hängende Ressourcen verständlich abgefangen. Kein gemockter Erfolg als reale Serverprüfung.
2. **Alle fünf Akten:** vollständige Durchläufe einschließlich neuer Kernphasen, freiwilliger Spuren und unabhängiger Starts. Alle aktiven Fotos wirklich laden und dekodieren, nicht nur Pfade zählen. Bildnummern 1–12 identisch in 002/004, neue Beleg-IDs konfliktfrei.
3. **T1–T4:** oben genannte Kurzantworten oder deren ersetzendes Auswahlformat; Namensvarianten, echte Negationen, falsche geografische Begriffe; keine Punkte für leere Antworten; Entwürfe auch bei fokussiertem Eingabefeld erhalten; fachliche Vollständigkeit unabhängig von Hinweisgrenzen. Historische und neue analoge Regressionen kennzeichnen.
4. **D1/D2/Wertung:** Teilpunkte fest, Auflösung nach Navigation/Neuladen noch offen bzw. korrekt abgeschlossen, keine Nachbepunktung, keine Doppelwertung. 0-Rohpunkte führen zum nächsten Hinweis, letzte Stufe zu beliebig vielen Versuchen und 1 Punkt bei Erfolg. Abwechslungsreiche Positionen und korrekte ID-Zuordnung. Bonuswerte 0/1/2/3/5 testen, Hauptmaximum 30 und Bonusmaximum 5.
5. **M1/M2/Materialien:** neutraler Schülerbogen einschließlich beider Seiten; keine Lösung im vorgesehenen Startzugang. Explizite Nummern 1–12 und Ortsbezüge in Lehrerdokumenten. Alle erzeugten PDF-Seiten visuell prüfen. Tatsächlichen Papierdruck nicht simuliert als geprüft ausgeben.
6. **Sitzung/Navigation:** getrennte Bildauswahlen; Neustart nur betroffener Akte; Rückkehr zur Zentrale; Dialoge; Papierbestätigung; blockierter/defekter Speicher; alte Schemas; unabhängiger Start von Akte 004 ohne erfundene erste Auswahl.
7. **Sprache:** sieben Sprachen, Flexionssuche, neue Kernwörter, fehlende Werte, RTL/gemischte Schrift, Fokus und Spielstanderhalt. Inhaltsprüfung und technische Lookup-Prüfung getrennt ausweisen; keine fiktive menschliche Sprachfreigabe.
8. **Browser/Bedienung:** Desktop und iPad-Hoch-/Querformat, Chromium und WebKit soweit verfügbar. Sichtbarkeit, Scrollen, Zoom, Dialoghöhe und Touchziele tatsächlich prüfen. Fotozoom und Auswahl getrennt bedienbar. Nicht prüfen lassen, dass alle zwölf großen Fotos ohne Scrollen auf einen Bildschirm passen.
9. **Fachlichkeit:** Jede gewertete Aufgabe aus zugänglichen Belegen lösbar; Mehrfachrichtigkeit korrekt abgebildet; keine aus Fotos erfundenen Einkommen/Herkünfte; keine quantitativen Aussagen aus Einzelbildern; keine kausale Gleichsetzung von Zuzug und Geburtenüberschuss; richtige Solartechnologie.

Echter Schul-iPad-Test bleibt offen, solange nicht tatsächlich durchgeführt. Bei erfolgtem Test Modell, iPadOS, Safari, Tastatur, PDF-Rückkehr und Schulnetz dokumentieren. Emulation ersetzt das nicht. Gleiches gilt für Lernwirkung und Bearbeitungsdauer einer realen Lerngruppe.

## 16. Umsetzung, Übergabe und Abschluss

Arbeite in prüfbaren Etappen: Ausgangsstand sichern; Bewertungs-/Zustandsfehler korrigieren; Kerninhalte und belegte Materialien integrieren; optionale Spuren ergänzen; Wörterbuch und Druckmaterialien synchronisieren; vollständige Regression und Sichtprüfung. Neue Testregeln fachlich begründen, nicht Tests löschen oder Erwartungen absenken, um Grün zu erhalten.

Bei Quellen- oder Werkzeuggrenzen unabhängig mögliche Arbeiten fortsetzen. Zentrale Inhalte nicht stillschweigend streichen; konkret melden, was fehlt und welche Alternative geprüft wurde. Kein unbegrenzter Recherchelauf für entbehrliche Zusatzbilder. Keine behauptete Fertigstellung nach bloßer Oberfläche.

Liefere:
- Befundmatrix T1–T4, D1–D2, M1–M2 mit Umsetzung, Dateien, Testnachweis und offenem Rest.
- Zuordnung der fachlichen Erweiterungen zum Kernweg/zu „Weiteren Spuren“, tatsächliche Medienliste und Quellenstatus.
- Aktualisierten Ermittlungsbogen, Erwartungshorizont, didaktische Kurzbeschreibung, Start-/Testanleitung und Versions-/Abnahmehinweise.
- Tatsächlich ausgeführte Tests, Fehler und Ergebnisse, Screenshots sowie gerenderte Materialansichten; geprüften lokalen Stand eindeutig nennen.
- Getrennten Status für lokale Technik, öffentliche Live-Seite, echtes Schul-iPad, Übersetzungsprüfung und Unterrichtserprobung. Offene Abnahmen nicht in der Gesamtzahl erfolgreicher Tests verstecken.
- Konkreten Diff, lokale Commit-IDs und bei Bedarf ein wiederherstellbares Projektarchiv. Keine Änderung des Remote-PR ohne Freigabe.

Am Ende keine pauschale Unterrichtsfreigabe, wenn wesentliche Prüfungen offen sind. Nenne konkret, was lokal nutzbar ist und was noch nicht bestätigt werden konnte. Bitte erst dann um eine eng umrissene Push-Freigabe für die genannten Commits einschließlich des Hinweises auf die mögliche automatische Pages-Veröffentlichung. Kein eigenständiger Merge.

Leitprinzip: Mehr geografische Erkenntnistiefe durch räumlich verortete Belege, kurze Entscheidungen und gute Auflösung – nicht durch mehr Pflichttext oder eine immer längere Aufgabenfolge.


## Quellenorientierung für die weitere Umsetzung

Die nachstehenden öffentlich zugänglichen Quellen wurden bei der Promptprüfung am 21.10.2026 als fachliche bzw. technische Orientierung herangezogen. Sie sind keine automatisch freigegebenen Bildsammlungen. Prüfe für jedes tatsächlich verwendete Bild und jede neue Aussage den konkreten Beleg, Nutzungsrechte und den relevanten Zeitpunkt. Keine Unternehmenswerbung oder darin enthaltene Nachhaltigkeitsbehauptungen ungeprüft übernehmen.

- Projektquelle: „Fachinternes Curriculum Geographie ETS Tönning/Friedrichstadt Sek. I“, S. 4; „Fachanforderungen Geographie Sekundarstufe (2015)“; „Leitfaden zu den Fachanforderungen Geographie“, besonders S. 22–24 und 38–39. Nutze vorhandene Originaldateien, sofern in deiner Umgebung bereitgestellt.
- Offizielles Fachportal / geltende Dokumente: https://fachportal.lernnetz.de/sh/fachanforderungen/geographie.html
- Wirtschaftlicher Sachbeleg Marokko, kein pauschaler Wohlstandsbeleg: https://www.renaultgroup.com/en/magazine/our-group-news/tangier-factory-the-industrial-and-logistics-hub-where-everything-comes-together/
- Ghana, Verarbeitung und Produkte: https://siga.gov.gh/entity/cocoa-processing-company/
- Nigeria/Filmwirtschaft, datierte Darstellung und konkrete Ortsbezüge beachten: https://courier.unesco.org/en/articles/nollywoods-streaming-romance
- Nachhaltigkeitsdimensionen: https://unosd.un.org/en/content/sustainable-development-goals-sdgs
- GitHub Pages und Hostingdaten: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- Pages-Publishing bei Branch-Push: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- Beispiel für Lizenzbedingungen, tatsächliche Lizenzversion jedes Mediums gesondert prüfen: https://creativecommons.org/licenses/by-sa/4.0/

Ende des vollständigen Entwicklungsauftrags.
