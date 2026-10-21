# Abnahme der Version 2.0

Stand: 21.10.2026. Grundlage ist der unveränderte [geprüfte Auftrag](../sources/auftrag-v2.md). Der Nutzer hat anschließend ausdrücklich „Version 2.0 umsetzen, aber auch Push, PR und Deployment“ beauftragt. Das gilt für den bestehenden Entwicklungsbranch und PR #1; kein neuer PR, kein Merge, keine Änderung von Pages-/Umgebungsberechtigungen.

## Technisch und redaktionell umgesetzt

- Fünf unabhängig startbare Akten, sieben Wertungen, 30 Hauptpunkte und fünf getrennte Bonuspunkte. Kurzer Kernweg mit neun unbewerteten Belegschritten; Vertiefungen freiwillig.
- Befunde T1–T4, D1/D2, M1/M2 bearbeitet: geschlossene Gesamtabgabe; Teilpunkte unabhängig von Vollständigkeit; begrenzte unbezahlte Auflösung; Entwurfserhalt; aufgabenspezifische Negation und neutrale Namensklärung; unterschiedliche feste Antwortpositionen und stabile Zuordnungs-IDs; ganzer Schülerbogen neutral; nummerierte Lehrertabelle 1–12.
- 19 authentische lokale Fotos, darunter alle 15 Bestandsdateien unverändert. Vier Ergänzungen mit geprüften Commons-Revisionen, Orts-/Lizenzbelegen, Urhebern und Prüfsummen. [Bildquellen](bildquellen.md). Alle zwölf Auswahlmotive sind in Akte 002/004 identisch. Schemata sind ausdrücklich als solche gekennzeichnet.
- Wörterbuch: 197 deutsche Begriffe; ru 196, uk 195, pl 197, tr 195, ar 196, ku 184, ckb 184. Zehn neue Begriffe, bekannte Wortformen und Bildbeleg-Alias. Alle vorhandenen kurdischen sowie alle neuen nichtleeren V2-Werte haben Einzelbelege. Fünf andere Altbestände sind redaktionell plausibilisiert; keine vollständige Einzelbelegung dieser Altbestände behauptet. [Prüfbericht mit allen Lücken](woerterbuch-pruefung.md).
- Schülerbogen genau zwei A4-Seiten; Erwartungshorizont elf A4-Seiten mit Nummerierung. Sämtliche 13 Seiten digital gerendert und visuell geprüft. PDF-Format-/Inhaltsprüfung und Überlaufprüfung bestanden. Keine reale Druckprobe behauptet.
- Starthilfe, CSP-Hash, HTTP-MIME-Typen und relative Pfade bleiben erhalten. Desktop, Tablet quer/hoch und schmale Ansicht werden automatisiert geprüft. [Tatsächliche technische Ergebnisse](testbericht.md), [Vorschaugrenzen](vorschau.md).

## Offene Abnahmen – keine pauschale Unterrichtsfreigabe

`npm run audit:release` meldet **19 offene Kategorien**, Exit-Code 2. Sie enthalten:

| Bereich | Offen / tatsächliche Grenze |
|---|---|
| Wörterbuchlücken | ru 1, uk 2, tr 2, ar 1, ku 13, ckb 13; insgesamt 32 leere Werte. Keine erfundenen Wörter zum Schließen der Statistik. Polnisch ohne leere Werte. |
| Sprachkundige Abnahme | Alle sieben Sprachen. Quellen- und Schriftprüfung bestätigen keine muttersprachliche Idiomatik, Flexion oder Eignung für die Lerngruppe. |
| Echtes Schul-iPad / Safari | Vom Projektteam anschließend vorgesehen. WebKit unter Linux und Geräteemulation ersetzen dieses Gerät nicht. |
| Curriculum-Originale | Offizielle/schulische Originaldateien nicht zusätzlich mitgeliefert, Fachportal am Proxy blockiert. Keine selbst geprüfte aktuelle Rechtsgeltung oder erfundene Kompetenznummern. |
| Sachquellen-Originale | Renault/SIGA/UNESCO-Beispiele aus dem bereitgestellten geprüften Auftrag; direkter Originalabgleich teilweise technisch blockiert. Quellenstatus in `data/learning.js`, Lehrerunterlagen und Umsetzungsmatrix. |
| Reale Druckprobe | Beide Seiten auf dem tatsächlichen Drucker prüfen; digitale Sichtung allein genügt nicht. |
| Lerngruppe | Zeiten, Verständlichkeit, Bedienwechsel, Lernwirkung und die Tragfähigkeit des 90-Minuten-Ziels ungemessen. Drei-Stunden-Alternative ist vorbereitet. |
| Öffentliche Live-Funktion | HTTPS-Abruf von `feerson1617.github.io` scheitert aus dieser Cloud beim Proxy-CONNECT mit 403. Keine Live-Konsole/MIME-Befunde oder reparierte Codex-Vorschau behauptet. Erfolgreicher Pages-Build ist davon getrennt. |

`data/review.json` hält redaktionelle Wörterbuchprüfung (mit Datei-Hash), sieben sprachkundige Abnahmen, echten Safari-Test und V2-Abnahmen getrennt. Kein menschlicher Prüfstatus wird durch technische Tests auf wahr gesetzt. Das Release-Audit erfasst jetzt auch Druck, Unterricht, Originalquellen und Live-Browserprüfung.

## Geräte- und Unterrichtsprüfung durch das Projektteam

Auf dem Schul-iPad: Menü quer/hoch öffnen, alle Akten bedienen, zwölf Fotos scrollen/vergrößern, Bildschirmtastatur ein-/ausblenden, Arabisch/Sorani lesen, Dialoge mit Fokus-Rückgabe schließen, Hinweise und Teilauflösung nach Navigation/Neuladen prüfen. PDF im tatsächlichen Safari öffnen und beidseitig drucken. Speicher testweise sperren. Zeiten und Partnerwechsel mit Lerngruppe erproben. Erst nach tatsächlicher Durchführung zugehörige Statusfelder bestätigen.

Der öffentliche Quellcode schützt Lösungen nicht technisch. Andere Akten und bewusst geöffnete Bildnachweise können den Kontinent verraten. Lehrerunterlagen sind aus der Schülernavigation ausgeblendet, im Repository auffindbar. Der Host kann Zugriffsprotokolle führen; keine zusätzliche Antworttelemetrie und keine pauschale schulische Datenschutzfreigabe.
