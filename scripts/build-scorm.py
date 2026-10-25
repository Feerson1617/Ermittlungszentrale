"""Deterministic allowlist build; Python standard library only, no network access."""
from pathlib import Path
from xml.sax.saxutils import escape
import hashlib
import json
import shutil
import zipfile

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'artifacts/scorm'
PACKAGE = OUT / 'package'
ZIP = OUT / 'Ermittlungszentrale-SCORM-1.2.zip'
SCHEMAS = ['imscp_rootv1p1p2.xsd', 'imsmd_rootv1p2p1.xsd', 'ims_xml.xsd', 'adlcp_rootv1p2.xsd']


def source_files():
    paths = ['index.html', 'bildnachweise.html', 'woerterbuch.html',
             'materials/ermittlungsbogen.pdf', 'materials/ermittlungsbogen.html',
             'docs/bildquellen.md', 'docs/woerterbuch-pruefung.md',
             'docs/lagos-quellen-v22.md', 'docs/kartendaten.sha256']
    for folder in ['js', 'css', 'assets', 'data', 'docs/media', 'docs/dictionary-sources', 'docs/sachquellen']:
        paths.extend(p.relative_to(ROOT).as_posix() for p in (ROOT / folder).rglob('*') if p.is_file() and p.name != 'review.json')
    return sorted(paths)


def build():
    if PACKAGE.exists():
        shutil.rmtree(PACKAGE)
    PACKAGE.mkdir(parents=True)
    paths = source_files()
    for name in paths:
        target = PACKAGE / name
        target.parent.mkdir(parents=True, exist_ok=True)
        content = (ROOT / name).read_bytes()
        if name.endswith('.html'):
            # Add a local stylesheet without changing any original text or CSP.
            prefix = '../' if name.startswith('materials/') else ''
            content = content.replace(b'</head>', f'<link rel="stylesheet" href="{prefix}scorm-export.css"></head>'.encode(), 1)
            if name == 'index.html':
                content = content.replace(b'</head>', b'<script src="scorm-runtime.js" defer></script></head>', 1)
        target.write_bytes(content)
    shutil.copyfile(ROOT / 'scorm/runtime.js', PACKAGE / 'scorm-runtime.js')
    shutil.copyfile(ROOT / 'scorm/export.css', PACKAGE / 'scorm-export.css')
    for name in SCHEMAS:
        shutil.copyfile(ROOT / 'scorm/schemas' / name, PACKAGE / name)
    # The application links to its original teaching brief as a curriculum source.
    # Keep that path working with a public source notice, never ship the full brief.
    notice = PACKAGE / 'sources/auftrag-v2.md'
    notice.parent.mkdir(exist_ok=True)
    notice.write_text('# Quellenhinweis zum Unterrichtsauftrag\n\n'
        'Der im Spiel genannte Unterrichtsauftrag ist eine lehrkraftinterne Planungsunterlage '
        'und wird im Schülerpaket nicht mitgeliefert. Die im Spiel sichtbaren Quellenangaben '
        'und fachlichen Einschränkungen bleiben erhalten. Ein direkter Originalabgleich '
        'der Fachanforderungen und ihrer aktuellen Geltung ist weiterhin offen.\n', encoding='utf-8')
    files = sorted(p.relative_to(PACKAGE).as_posix() for p in PACKAGE.rglob('*') if p.is_file() and p.name != 'review.json')
    refs = '\n'.join(f'      <file href="{escape(name)}"/>' for name in files)
    manifest = f'''<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="Ermittlungszentrale-2.2-SCORM12" version="1.0"
 xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
 xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd">
  <metadata><schema>ADL SCORM</schema><schemaversion>1.2</schemaversion></metadata>
  <organizations default="organisation">
    <organization identifier="organisation">
      <title>Die geheime Ermittlungszentrale 2.2</title>
      <item identifier="spiel" identifierref="sco">
        <title>Die geheime Ermittlungszentrale – alle fünf Akten</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="sco" type="webcontent" adlcp:scormtype="sco" href="index.html">
{refs}
    </resource>
  </resources>
</manifest>
'''
    (PACKAGE / 'imsmanifest.xml').write_text(manifest, encoding='utf-8')
    # Stable ordering, timestamps, permissions and compression across repeated builds.
    with zipfile.ZipFile(ZIP, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in sorted(p for p in PACKAGE.rglob('*') if p.is_file() and p.name != 'review.json'):
            info = zipfile.ZipInfo(path.relative_to(PACKAGE).as_posix(), (2026, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            info.create_system = 3
            archive.writestr(info, path.read_bytes(), compresslevel=9)
    digest = hashlib.sha256(ZIP.read_bytes()).hexdigest()
    (OUT / (ZIP.name + '.sha256')).write_text(f'{digest}  {ZIP.name}\n')
    print(f'{ZIP}: {ZIP.stat().st_size} Bytes, {len(files) + 1} Dateien, SHA256 {digest}')


if __name__ == '__main__':
    build()
