"""Validate the actual archive, schemas, dependency paths and source parity offline."""
from pathlib import Path, PurePosixPath
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from tempfile import TemporaryDirectory
from lxml import etree
import hashlib
import json
import re
import sys
import zipfile
from importlib.util import spec_from_file_location, module_from_spec

ROOT = Path(__file__).resolve().parent.parent
build_spec = spec_from_file_location('scorm_build', ROOT / 'scripts/build-scorm.py')
build = module_from_spec(build_spec)
build_spec.loader.exec_module(build)
CP = 'http://www.imsproject.org/xsd/imscp_rootv1p1p2'
ADL = 'http://www.adlnet.org/xsd/adlcp_rootv1p2'
MD = 'http://www.imsglobal.org/xsd/imsmd_rootv1p2p1'
NS = {'cp': CP, 'adl': ADL}


def validate(archive_path):
    with TemporaryDirectory() as temp, zipfile.ZipFile(archive_path) as archive:
        names = archive.namelist()
        assert len(names) == len(set(names)), 'Doppelte ZIP-Einträge'
        for name in names:
            assert not name.startswith('/') and '..' not in PurePosixPath(name).parts and '\\' not in name, name
            assert not archive.getinfo(name).is_dir(), 'Nur Dateien erwartet'
        expected = set(build.source_files()) | set(build.SCHEMAS) | {
            'imsmanifest.xml', 'scorm-runtime.js', 'sources/auftrag-v2.md'}
        assert set(names) == expected, f'Unerwartete/fehlende Dateien: {set(names) ^ expected}'
        assert 'imsmanifest.xml' in names
        assert not any(re.search(r'erwartungshorizont|(^|/)(tests|scripts|node_modules|\.git|qa)/', n, re.I) for n in names)
        archive.extractall(temp)
        package = Path(temp)
        parser = etree.XMLParser(no_network=True, resolve_entities=False)
        manifest = etree.parse(str(package / 'imsmanifest.xml'), parser)
        # Load every namespace explicitly so strict ADL attribute validation is active.
        imports = ''.join(f'<xs:import namespace="{ns}" schemaLocation="{name}"/>' for ns, name in [
            (CP, 'imscp_rootv1p1p2.xsd'), (ADL, 'adlcp_rootv1p2.xsd'), (MD, 'imsmd_rootv1p2p1.xsd')])
        schema_doc = etree.fromstring(f'<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">{imports}</xs:schema>'.encode(), parser, base_url=str(package / 'validator.xsd'))
        schema = etree.XMLSchema(schema_doc)
        schema.assertValid(manifest)
        resources = manifest.xpath('//cp:resource', namespaces=NS)
        assert len(resources) == 1 and resources[0].get(f'{{{ADL}}}scormtype') == 'sco'
        assert resources[0].get('href') == 'index.html'
        assert manifest.xpath('//cp:item/@identifierref', namespaces=NS) == [resources[0].get('identifier')]
        assert manifest.xpath('//cp:metadata/cp:schema/text()', namespaces=NS) == ['ADL SCORM']
        assert manifest.xpath('//cp:metadata/cp:schemaversion/text()', namespaces=NS) == ['1.2']
        declared = resources[0].xpath('cp:file/@href', namespaces=NS)
        assert len(declared) == len(set(declared)) and set(declared) == set(names) - {'imsmanifest.xml'}
        # Prove that the XSD validator actually rejects invalid ADL attributes.
        resources[0].set(f'{{{ADL}}}scormtype', 'invalid')
        assert not schema.validate(manifest), 'ADL-Schema nicht aktiv'
        resources[0].set(f'{{{ADL}}}scormtype', 'sco')
        external = set()
        checked = set()

        def reference(owner, ref, automatic=False):
            ref = unquote(ref.strip())
            parsed = urlsplit(ref)
            if parsed.scheme or parsed.netloc:
                if ref.startswith('data:') and automatic:
                    return
                assert not automatic, f'Externe Laufzeitabhängigkeit: {owner}: {ref}'
                assert parsed.scheme in ('https', 'http'), ref
                external.add(ref)
                return
            assert not parsed.path.startswith('/'), f'Absoluter Pfad: {ref}'
            target = (package / owner).parent / parsed.path if parsed.path else package / owner
            resolved = target.resolve()
            assert resolved.is_relative_to(package.resolve()) and resolved.is_file(), f'Fehlender Verweis {owner}: {ref}'
            checked.add(resolved.relative_to(package.resolve()).as_posix())
            if parsed.fragment and resolved.suffix == '.html':
                assert re.search(r'\bid=["\']' + re.escape(parsed.fragment) + r'["\']', resolved.read_text()), f'Fehlendes Sprungziel: {ref}'

        class HTML(HTMLParser):
            def __init__(self, owner):
                super().__init__()
                self.owner = owner
            def handle_starttag(self, tag, attrs):
                attrs = dict(attrs)
                for key in ['src', 'href', 'poster', 'data']:
                    if key in attrs:
                        automatic = tag not in ['a', 'area']
                        reference(self.owner, attrs[key], automatic)
                assert 'srcset' not in attrs, 'srcset-Abhängigkeiten explizit prüfen'
                assert tag not in ['iframe', 'object', 'embed'], 'Unerwarteter eingebetteter Inhalt'
                if tag == 'link':
                    assert attrs.get('rel') not in ['preconnect', 'dns-prefetch', 'prefetch', 'prerender'], attrs

        for name in names:
            path = package / name
            if path.suffix == '.html':
                HTML(name).feed(path.read_text())
            if path.suffix == '.css':
                for ref in re.findall(r'url\(["\']?([^\)"\']+)', path.read_text()):
                    reference(name, ref, True)
                assert not re.search(r'@import', path.read_text()), 'CSS-Import explizit prüfen'
            if path.suffix == '.js':
                code = path.read_text()
                for ref in re.findall(r'\b(?:from|import)\s*\(?\s*["\']([^"\']+)["\']', code):
                    reference(name, ref, True)
                assert not re.search(r'\b(?:XMLHttpRequest|WebSocket|sendBeacon|serviceWorker)\b', code), name
                assert not re.search(r'\bfetch\s*\(', code) or name == 'js/app.js', name
            if path.suffix in ['.json', '.geojson']:
                json.loads(path.read_text())
            if path.suffix == '.md':
                for ref in re.findall(r'\[[^\]]*\]\(([^)]+)\)', path.read_text()):
                    reference(name, ref)
            if path.suffix == '.svg':
                svg = etree.parse(str(path), parser)
                for element in svg.iter():
                    assert etree.QName(element).localname not in ['script', 'foreignObject']
                    for attr, value in element.attrib.items():
                        if etree.QName(attr).localname == 'href':
                            reference(name, value, True)
        for file in ['rubrics.json', 'dictionary.json', 'media.json']:
            reference('js/app.js', '../data/' + file, True)
        media = json.loads((package / 'data/media.json').read_text())
        assert len(media['images']) == 24
        for image in media['images'].values():
            reference('index.html', image['path'], True)
            reference('index.html', image['evidence'])
            assert hashlib.sha256((package / image['path']).read_bytes()).hexdigest() == image['sha256']
        # Runtime templates contain locally routed source links, not automatic requests.
        for ref in re.findall(r'local:"([^"]+)"', (package / 'data/learning.js').read_text()):
            reference('index.html', ref)
        for name in build.source_files():
            if name == 'css/style.css':
                assert (package / name).read_bytes() == (ROOT / name).read_bytes() + b'\n' + (ROOT / 'scorm/export.css').read_bytes(), 'Nur ergänzende Linkkennzeichnung in der Export-CSS erlaubt'
            elif not name.endswith('.html'):
                assert (package / name).read_bytes() == (ROOT / name).read_bytes(), f'Quellabweichung: {name}'
            else:
                original = (ROOT / name).read_text()
                exported = (package / name).read_text()
                if name == 'index.html':
                    exported = exported.replace('<script src="scorm-runtime.js" async></script>', '', 1)
                assert exported == original, f'Unzulässige HTML-Änderung: {name}'
        provenance = json.loads((ROOT / 'scorm/schemas/provenance.json').read_text())
        for name in build.SCHEMAS:
            schema_bytes = (package / name).read_bytes()
            assert schema_bytes == (ROOT / 'scorm/schemas' / name).read_bytes()
            assert hashlib.sha256(schema_bytes).hexdigest() == provenance[name]['sha256'], f'Schema-Provenienz: {name}'
        print(f'BESTANDEN: {len(names)} ZIP-Dateien, 1 SCO, XSD inkl. ADL-Negativtest, '
              f'{len(checked)} aufgelöste lokale Ziele, 24 Foto-Hashes, Quellgleichheit, '
              f'{len(external)} ausschließlich bewusst aufrufbare externe Quellenlinks.')


if __name__ == '__main__':
    validate(Path(sys.argv[1]) if len(sys.argv) > 1 else build.ZIP)
