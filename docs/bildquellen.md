# Bildquellen und Karten

## Status der dokumentarischen Fotos: offen

**Es sind noch keine dokumentarischen Fotografien eingebunden.** Der Zugriff auf `commons.wikimedia.org` wurde während der Entwicklung vom Netzwerkproxy mit HTTP 403 abgewiesen. Es wurden keine generierten Landschaftsbilder, fremden Fotos ohne belegte Rechte oder erfundenen Quellen verwendet. Die schraffierten Flächen sind ausdrücklich fehlende Fotos und beschreiben nur das benötigte Motiv.

Die vollständig implementierten Abläufe ersetzen keine visuelle Unterrichtsabnahme. Vor Unterrichtseinsatz diese 15 Bilder beschaffen und einzeln prüfen:

| Schlüssel | Bildnummer | Benötigtes reales Motiv | Geplanter Aufnahmeort, noch kein belegtes Bild |
|---|---:|---|---|
| savanna | 1 | Savanne mit Wildtieren | Kenia |
| desert | 2 | Namib-Dünen | Namibia |
| forest | 3 | Tropischer Regenwald | Kongobecken; konkreten Ort belegen |
| lagos | 4 | Moderne Skyline | Lagos, Nigeria |
| farm | 5 | Landwirtschaftliche Arbeit | Ghana |
| atlas | 6 | Schnee im Atlasgebirge | Marokko |
| coast | 7 | Küstenstadt/Strand | Sansibar, Tansania |
| factory | 8 | Industrie/Produktion | Ghana |
| school | 9 | Universität | Accra, Ghana |
| market | 10 | Städtischer Markt/Alltag | Accra, Ghana |
| cocoa | — | Kakaofrüchte und Anbau | Ghana |
| water | — | Landwirtschaft in trockener Region | Sahelregion; konkreten Ort belegen |
| people | — | Wachsende Stadt | Nairobi, Kenia |
| economy | — | Kakaoverarbeitung | Ghana |
| solar | — | Lokale Solaranlage | Marokko |

Alle Angaben in dieser Tabelle sind **Suchanforderungen**, keine Behauptungen über vorhandene Fotos. Es gibt noch keine Fotografen- oder Lizenzangaben, weil kein Bild übernommen wurde.

## Aufnahmeprozess

1. Nach erlaubtem Zugriff ein echtes Foto und seine Beschreibungsseite prüfen. Motiv und geografischen Ort nachweisen; nicht allein dem Dateinamen vertrauen.
2. Einzeln Urheber, Quelle, Lizenz einschließlich Version, erforderliche Attribution und eventuelle Bearbeitung notieren. Keine fair-use-Fotos und keine ungeklärten Lizenzen übernehmen. Personenrechte beachten.
3. Die optimierte Datei lokal unter `assets/images/` speichern (ungefähr 1000–1400 Pixel breite JPEG/WebP, hohe visuelle Lesbarkeit). Metadaten ohne benötigte Orts- oder Personeninformationen entfernen; Quellenbeleg behalten. Bearbeitung gegebenenfalls angeben.
4. In `data/media.json` den Schlüssel ergänzen. Pflichtfelder: `path`, `description`, `location`, `author`, `source`, `license`, `attribution`, `sha256`. Pfad relativ zum Repository, keine externe URL als Bildpfad. SHA256 mit `sha256sum assets/images/DATEI` bestimmen. Lizenzbeleg als lokale Text-/JSON-Datei in `docs/` sichern.
5. Hier den tatsächlichen Einzelbildnachweis ergänzen. Die Lernoberfläche zeigt in Akte 001 zunächst nur Beweisnummern und neutrale Motive. Quellen und Ortsnamen dürfen die Themenauflösung nicht vorwegnehmen.
6. `npm run audit:release`, Funktions- und Sichtprüfungen ausführen. Erst bei vollständiger Lizenz- und Motivprüfung `status` im Medienkatalog auf `complete` setzen. Ein ausgefülltes JSON allein ersetzt keine Prüfung.

Es gibt keine externen Bildabrufe während des Spiels. Das einzige derzeit verwendete Oberflächenbild ist eine selbst erstellte, als Dekoration erkennbare SVG-Zeichnung von Akte und Lupe (`assets/icons/detective.svg`). Sie dient nicht als geografischer Beweis.

## Karten: Natural Earth

- Quelle: Natural Earth, `ne_110m_admin_0_countries.geojson`, https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson
- Maßstab: 1:110 Millionen, vereinfachte Länderpolygone.
- Lizenz: Public Domain. Nutzungsbedingungen: https://www.naturalearthdata.com/about/terms-of-use/
- Lokale Ausgangsdaten: `data/countries.geojson`; Abruf am 20.10.2026.
- Lokale Ableitungen: `assets/maps/*.svg`, `data/maps.js`, erzeugt mit `python3 scripts/maps.py` (Python-Standardbibliothek).
- Projektion: Plattkarte (Längen-/Breitengrade linear). Unbeschriftete Weltkarte im Schülerbogen. Im Spiel gibt es zusätzliche Länderbeschriftungen und rote Fundortpunkte. Kein externer Kartendienst.
- Enthalten sind die Grenzen der Quelle, einschließlich gesonderter Westsahara-Geometrie. Grenzen sind didaktisch vereinfacht; keine Aussage über staatliche Anerkennung.

Die SHA256 der lokal verwendeten Ausgangsdaten steht in `docs/kartendaten.sha256`. Diese Prüfsumme belegt die verwendete Datei, keinen späteren Stand des veränderlichen `master`-Branches.
