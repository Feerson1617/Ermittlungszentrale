# Codex-Auftrag – Ermittlungszentrale 2.2: Abschließende Korrekturen und neuer Pull Request

## 1. Ziel

Führe die abschließenden Korrekturen am Geographie-Lernspiel „Die geheime Ermittlungszentrale“ auf Grundlage des unabhängigen Work-Abschlussprüfberichts vom 21.10.2026 durch.

Repository: https://github.com/Feerson1617/Ermittlungszentrale

Bisheriger Entwicklungsbranch: `feature/detektivspiel-komplett`

Bisheriger PR #1: bereits vom Nutzer bewusst gemergt und geschlossen.

Live-Version: https://feerson1617.github.io/Ermittlungszentrale/

Ziel ist eine **fachlich und sprachlich verbesserte Version 2.2**, ohne das vorhandene Spiel grundlegend umzubauen.

Die Abschlussprüfung hat bestätigt, dass Version 2.1 technisch funktioniert und alle fünf Akten vollständig durchspielbar sind. Es wurden keine kritischen Spielfehler gefunden.

Konzentriere dich daher auf die konkret festgestellten Mängel.

## 2. GitHub – Neuer Pull Request ausdrücklich erwünscht

**Erstelle für diese Entwicklungsrunde einen neuen Pull Request.**

Wichtige Ausgangslage:

- PR #1 wurde vom Nutzer bewusst gemergt und geschlossen.
- `main` enthält den Stand dieses Merges.
- Der Branch `feature/detektivspiel-komplett` enthält darüber hinaus die neueren Änderungen aus Version 2.1.
- Diese neueren Änderungen dürfen beim nächsten Merge keinesfalls verloren gehen.

Gehe folgendermaßen vor:

1. Prüfe zunächst den aktuellen Stand von `main` und `feature/detektivspiel-komplett`.
2. Ermittle, welche Version-2.1-Änderungen bereits in `main` enthalten sind und welche noch nicht.
3. Erstelle einen neuen Arbeitsbranch, vorzugsweise `fix/ermittlungszentrale-2-2-abnahme`.
4. Sorge für eine saubere Git-Historie. Bevorzugt soll der neue Branch vom aktuellen `main` ausgehen und die noch fehlenden Änderungen aus Version 2.1 einschließlich der nachfolgenden Korrekturen vollständig übernehmen.
5. Achte darauf, keine bereits gemergten Änderungen zu duplizieren und keine Funktionen zu verlieren.
6. Implementiere und teste sämtliche Korrekturen.
7. Pushe den neuen Arbeitsbranch.
8. Erstelle anschließend einen **neuen Draft-Pull-Request gegen `main`**.

Vorgeschlagener Titel:

**„Ermittlungszentrale 2.2 – Didaktische Abschlusskorrekturen und Sprachoptimierung“**

Der Pull Request soll den vollständigen neuen Entwicklungsstand einschließlich Version 2.1 enthalten.

Im PR ausdrücklich dokumentieren, welche Änderungen aus Version 2.1 gegenüber `main` noch nachgeführt werden und welche Korrekturen neu zu Version 2.2 gehören.

**Keine eigenständige Zusammenführung in `main`.**

Der Nutzer wird den neuen PR nach Kontrolle selbst mergen.

Ändere keine GitHub-Pages-Einstellungen. Vermeide insbesondere einen Push auf den bisherigen Pages-Quellbranch, wenn dadurch ungeprüft die öffentliche Version geändert würde.

Die Erstellung und Veröffentlichung des neuen PR-Branches ist hiermit ausdrücklich freigegeben. Ein Merge oder eine Änderung der öffentlichen GitHub-Pages-Konfiguration dagegen nicht.

---

## 3. Priorität hoch: Stadtvergleich Lagos fachlich konkretisieren

Der Work-Bericht bemängelt, dass der Vergleich zwischen Lagos Island und Makoko zwar unterschiedliche Gebäude und Perspektiven zeigt, aber kaum konkrete geografische Informationen über unterschiedliche Lebensbedingungen liefert.

Betroffen:

`data/learning.js` – `city-context`

Ergänze maximal zwei kurze, verlässliche und datierte Sachinformationen zu den untersuchten Stadträumen.

Bevorzugte Themen:

- Wohnen und bauliche Infrastruktur.
- Wasserversorgung oder Sanitärversorgung.
- Erreichbarkeit öffentlicher Einrichtungen.

Verwende ausschließlich konkret überprüfte geografische Informationen.

Für jede Aussage müssen Ort, Zeitraum und Quelle zusammenpassen.

**Wichtig:**

- Keine Einkommen aus Bildern ableiten.
- Keine erfundenen Haushaltsgeschichten.
- Keine ungesicherten Armutsquoten.
- Keine pauschalen Aussagen über sämtliche Bewohner eines Stadtteils.
- Unterschiedliche Aufnahmejahre berücksichtigen.
- Die bisherigen Aussagen zur begrenzten Aussagekraft einzelner Fotos erhalten.

Falls keine belastbaren konkreten Informationen gefunden werden können, verenge das Lernziel auf beobachtbare Unterschiede in der Bebauung und die unterschiedlichen Bildperspektiven.

Die Schülerinnen und Schüler sollen weiterhin mit sehr kurzen, verständlichen Informationen arbeiten.

---

## 4. Priorität hoch: Sprache deutlich vereinfachen

Die sprachliche Verständlichkeit hat für die leistungsschwache siebte Klasse höchste Priorität.

### 4.1 Schwierige Arbeitsaufträge ersetzen

Beispiel aus Akte 002:

Bisher:

„Welche Aussage ist besonders pauschal?“

Besser:

**„Welche Aussage tut so, als wäre es überall gleich?“**

Prüfe ähnliche Formulierungen in sämtlichen Akten.

Insbesondere:

- pauschal
- Beleg / belegen
- Versorgung
- Lebensbedingungen
- Verarbeitung / aufbereiten
- Infrastruktur
- wirtschaftliche Tätigkeit

Verwende möglichst alltagsnahe Formulierungen.

Wenn ein Fachbegriff für das Lernen wichtig ist, erkläre ihn unmittelbar in einfacher Sprache.

### 4.2 Erklärungen kürzen

Viele Rückmeldungen enthalten mehrere abstrakte Einschränkungen hintereinander.

Überarbeite diese nach folgendem Muster:

**Ein klarer Kernsatz.**

Darunter bei Bedarf:

**„Mehr erfahren“** mit einer fachlich ausführlicheren Erklärung.

Wichtig: Die fachlichen Aussagegrenzen dürfen durch die Kürzung nicht verloren gehen.

Beispiel:

Kernsatz:

„Das Foto zeigt einen Ort. Es zeigt nicht, wie alle Menschen leben.“

Vertiefung:

„Um zu wissen, wie viele Menschen bestimmte Lebensbedingungen haben, brauchen wir weitere Informationen.“

Keine zusätzlichen langen Pflichttexte.

### 4.3 Wörterbuch und Begriffshilfen

Prüfe die wichtigsten tatsächlich verwendeten Arbeitswörter.

Ergänze passende deutsche Verständnishilfen.

Bestehende sieben Sprachen beibehalten.

Neue Übersetzungen nur anhand verlässlicher Quellen ergänzen.

Keine erfundenen Übersetzungen.

Die weiterhin offenen sprachkundigen Prüfungen dürfen nicht als abgeschlossen markiert werden.

---

## 5. Priorität mittel: Falsche Antworten in unbewerteten Ermittlungen erklären

Betroffen sind insbesondere die zehn unbewerteten Belegschritte in Akte 003.

Bisher erscheint nach einer vollständig bearbeiteten Frage dieselbe allgemeine Erklärung – unabhängig davon, ob die Antwort richtig oder falsch war.

Das kann dazu führen, dass Lernende ihre eigene falsche Vorstellung nicht ausdrücklich korrigieren.

### Neuer Rückmeldeablauf

Bei richtiger Antwort:

„Richtig. Auf dem Bild seht ihr …“

Bei falscher Antwort:

„Ihr habt … gewählt. Das passt nicht, weil …“

Danach:

„Der Beleg zeigt …“

Die Rückmeldungen müssen jeweils konkret zur gewählten Antwort passen.

Keine pauschale Fehlerbotschaft.

Keine Beschämung.

Keine zusätzlichen Spielpunkte.

Keine neuen Versuchsbegrenzungen.

Keine endlosen Wiederholungsschleifen.

Persönliche Vermutungen und Reflexionen bleiben ausdrücklich unbewertet.

Die fachliche Erklärung soll für sprachlich schwache Lernende unmittelbar verständlich sein.

---

## 6. Priorität mittel: Wörterbuch-Fokus korrigieren

Work hat bei WebKit festgestellt, dass nach dem Schließen des Wörterbuchdialogs der Tastaturfokus verloren gehen oder im unsichtbaren Eingabefeld verbleiben kann.

Betroffen:

`js/app.js`

Merke beim Öffnen des Wörterbuchs die auslösende Schaltfläche.

Gib nach dem Schließen den Fokus ausdrücklich an diese Schaltfläche zurück.

Prüfe:

- Schließen-Schaltfläche.
- Escape-Verhalten.
- Tastaturbedienung.
- WebKit mit iPad-Parametern.
- Erhalt sämtlicher bisherigen Antworten und Punkte.

Orientiere dich an der bereits funktionierenden Fokusrückgabe beim Fotozoom.

---

## 7. Kleinere fachliche und gestalterische Korrekturen

### 7.1 Bild 9 genauer beschriften

Bisher:

„Schule mit einfacher Ausstattung“

Das authentische Foto zeigt einen leeren Klassenraum.

Ändere den Titel in:

**„Klassenraum mit Holztischen und Stühlen“**

Übernimm die neue Beschriftung konsequent in:

- Akte 002.
- Akte 004.
- Bildkatalog.
- Erwartungshorizont.
- Bildnachweise und betroffene Aufgaben.

Kein neues Foto erforderlich.

Keine zusätzlichen Behauptungen über Schulqualität.

### 7.2 Akte 004 – Satzanfänge tatsächlich anbieten

Bisher wird die Auswahl eines Satzanfangs angekündigt, ohne dass entsprechende Formulierungen konkret angeboten werden.

Ergänze sichtbar:

„Gleich geblieben ist …“

„Neu ist für uns …“

„Dazu passt Bild …“

Die Teams können eine dieser Formulierungen nutzen.

Eine andere freie Formulierung oder eine unveränderte Vorstellung bleibt zulässig.

Die Reflexion bleibt unbewertet.

### 7.3 Ermittlungsbogen – Lösung nicht vorwegnehmen

Auf Seite 1 steht bisher bereits:

„Vier Fotos zeigen einige Orte. Sie stehen nicht für alle Lebensbedingungen.“

Dieser Satz enthält einen wesentlichen Teil der bewerteten Erkenntnis aus Akte 002.

Ersetze ihn durch eine offene Sicherung, beispielsweise:

**„Vier Fotos zeigen … ______________________________“**

Der Satz soll erst nach Bearbeitung der Aufgabe ergänzt werden.

Der Ermittlungsbogen darf weiterhin von Beginn an ausgegeben werden, ohne die Kontinentlösung zu verraten.

Die Gesamtzahl der Schülerseiten bleibt bei zwei DIN-A4-Seiten.

### 7.4 Punkteübersicht besser gestalten

Auf Seite 2 des Ermittlungsbogens stehen „/ 15“ und „Akte 4“ optisch zu dicht nebeneinander.

Verbessere die Abstände oder nutze eine deutlich strukturierte Tabelle.

Die Übersicht soll weiterhin enthalten:

- Akte 001: maximal 5.
- Akte 002: maximal 5.
- Akte 003: maximal 15.
- Akte 004: maximal 5.
- Hauptsumme: maximal 30.
- Bonus: separat maximal 5.

### 7.5 Fehlermeldung beim Spielstart

Bei blockierten eingebetteten Browsern empfiehlt die Anwendung bisher einen HTTP-Webserver.

Das ist missverständlich, weil die tatsächliche GitHub-Pages-Seite bereits über HTTPS funktioniert.

Formuliere die Hilfe verständlicher:

„Öffnet das Spiel direkt in Safari oder einem normalen Browser.“

Ergänzend:

„Eine eingebettete Vorschau kann wichtige Spieldateien blockieren.“

Keine pauschale Lockerung der Content Security Policy.

Kein Wechsel auf unverschlüsseltes HTTP.

---

## 8. Unterrichtsmaterialien vollständig synchronisieren

Aktualisiere nach sämtlichen Änderungen:

- `data/learning.js`
- betroffene Spieltexte und Hilfen
- Bewertungs- und Antwortdaten, soweit erforderlich
- Ermittlungsbogen
- Erwartungshorizont
- Bildkatalog
- Bildquellen
- didaktische Dokumentation

Verändere keine fachlich korrekten Inhalte ohne Notwendigkeit.

Die Schülerunterlagen bleiben bei genau zwei A4-Seiten.

Aktualisiere den Erwartungshorizont aus den gemeinsamen Datenquellen. Die bisherige Fassung umfasst 13 Seiten; halte diesen Umfang möglichst ein, sofern dies ohne Lesbarkeitsverlust möglich ist.

Alle PDFs neu erzeugen und sämtliche Seiten auf Lesbarkeit, Seitenumbrüche und Beschnitt prüfen.

Die eigentlichen Spielmechaniken müssen erhalten bleiben.

---

## 9. Verbindliche Qualitätssicherung

### Technische Prüfung

Führe die vorhandenen Logik- und Browsertests erneut aus.

Ergänze gezielte Regressionstests für die vorgenommenen Korrekturen.

Prüfe insbesondere:

- Alle fünf Akten.
- Drei Länderfälle in Akte 003.
- Alle zehn unbewerteten Belegschritte.
- Individuelle Rückmeldungen bei richtigen und falschen Antworten.
- Identische zwölf Bilder in Akte 002/004.
- Korrekte Bildnummern.
- Wörterbuch-Fokus.
- Navigation und Sitzung.
- Neuladen und Neustart.
- Hauptpunkte und Bonuspunkte.
- PDF-Generierung.
- Start über einen vollständigen HTTP(S)-Server.
- Kompatibilität mit GitHub Pages.

### Didaktische Prüfung

Überprüfe ausdrücklich:

1. Sind die zentralen Arbeitsaufträge auch für sprachlich schwache Schülerinnen und Schüler verständlich?
2. Werden falsche Aussagen fachlich eindeutig, aber freundlich korrigiert?
3. Bleibt die Trennung zwischen Bildbeobachtung und ergänzender Sachinformation erkennbar?
4. Werden Afrika-Klischees bewusst untersucht, ohne neue Stereotype zu erzeugen?
5. Sind die zusätzlichen Informationen zu Lagos geografisch und zeitlich belastbar?
6. Sind Spiel, Erwartungshorizont und Ermittlungsbogen inhaltlich konsistent?
7. Wird weiterhin keine persönliche Meinungsänderung erzwungen?

Teste auf Desktop sowie simulierten iPads im Hoch- und Querformat.

Ein emuliertes iPad ist kein echtes Schul-iPad.

Melde ausschließlich tatsächlich durchgeführte Prüfungen.

---

## 10. Abschluss und Übergabe

Erstelle einen kompakten Abschlussbericht mit:

- Umgesetzten Work-Befunden H1, M1–M3 und N1–N4.
- Zusätzlich korrigiertem Lösungsverrat auf dem Ermittlungsbogen.
- Betroffenen Dateien.
- Tatsächlich bestandenen Tests.
- Geprüften Quellen für Lagos.
- Änderungen der Schülertexte.
- Geprüften PDF-Materialien.
- Noch offenen Abnahmen.
- Link zum neuen Draft-Pull-Request.

Die bekannten offenen Prüfungen bleiben ausdrücklich offen, sofern sie nicht tatsächlich durchgeführt wurden:

- Echter Schul-iPad-Test.
- Schulnetz.
- Sprachkundige Kontrolle der Übersetzungen.
- Realer beidseitiger Druck.
- Erprobung mit der Lerngruppe und Messung der Bearbeitungszeiten.

**Keine erneute große Erweiterung des Spiels.**

**Keine neue inhaltliche Akte.**

**Keine zusätzliche Punktevergabe.**

**Keine grundlegende Neugestaltung.**

### Verbindlicher Abschluss

Die Arbeit gilt erst als abgeschlossen, wenn:

1. Alle beschriebenen Korrekturen implementiert sind.
2. Die relevanten Tests erfolgreich durchlaufen wurden.
3. Sämtliche Unterrichtsmaterialien konsistent aktualisiert sind.
4. Ein neuer Arbeitsbranch gepusht wurde.
5. **Ein neuer Draft-Pull-Request gegen `main` erstellt wurde.**

Der Pull Request bleibt offen.

**Kein Merge.**

**Keine eigenständige Veröffentlichung auf GitHub Pages.**

Der Nutzer entscheidet selbst über die endgültige Übernahme.

Ziel ist eine fachlich korrekte, sprachlich leicht zugängliche und zuverlässig bedienbare Version 2.2 für die abschließende Erprobung im Geographieunterricht der 7. Klasse.