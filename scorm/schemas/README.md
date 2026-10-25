# SCORM-1.2-Schemata

Historische IMS CP 1.1.2, IMS MD 1.2.1, ADL CP 1.2 und XML-Attribute.
Versionierte Quelle: Education-Numerique/authoring.js, Commit
`fe7fb92bce8cd844d7397b2fe0a7b47b8ec42ad1`, Verzeichnis `src/activity/scorm/`.
Die exakten URLs und SHA256 vor/nach Anpassung stehen in `provenance.json`.
Urheberhinweise in den Dateien bleiben erhalten. Keine Downloads beim Build.

Zwei dokumentierte Kompatibilitätskorrekturen an den historischen Kopien:

- `ims_xml.xsd`: Die verbotene Standardnamensraumdeklaration
  `xmlns="http://www.w3.org/XML/1998/namespace"` entfernt. Der unveränderte
  `targetNamespace` definiert weiterhin dieselben XML-Attribute.
- `imsmd_rootv1p2p1.xsd`: Im Erweiterungswildcard `##any` durch `##other`
  ersetzt. `##any` überschneidet sich mit optionalen IMS-Elementen und erzeugt
  für XSD 1.0 ein nicht deterministisches Inhaltsmodell. Der Wildcard erlaubt
  weiterhin fremde Namensräume, keine doppelten IMS-Elementdefinitionen.

Das Manifest verwendet keine erweiterten LOM-Metadaten. Die Prüfung lädt
alle drei SCORM-/IMS-Namensräume explizit und offline; eine absichtlich
ungültige `adlcp:scormtype`-Angabe muss als Negativkontrolle scheitern.
