"""Adversarial checks of the ZIP validator, using the built artifact."""
from importlib.util import spec_from_file_location, module_from_spec
from pathlib import Path
from tempfile import TemporaryDirectory
from contextlib import redirect_stdout
from io import StringIO
from lxml import etree
import unittest
import zipfile

ROOT = Path(__file__).resolve().parent.parent
spec = spec_from_file_location('validator', ROOT / 'scripts/validate-scorm.py')
validator = module_from_spec(spec)
spec.loader.exec_module(validator)
ZIP = ROOT / 'artifacts/scorm/Ermittlungszentrale-SCORM-1.2.zip'


class PackageTests(unittest.TestCase):
    def mutated(self, transform):
        with zipfile.ZipFile(ZIP) as archive:
            files = {name: archive.read(name) for name in archive.namelist()}
        transform(files)
        with TemporaryDirectory() as temp:
            path = Path(temp) / 'mutant.zip'
            with zipfile.ZipFile(path, 'w') as archive:
                for name, data in files.items():
                    archive.writestr(name, data)
            with self.assertRaises((AssertionError, etree.DocumentInvalid, etree.XMLSyntaxError)):
                with redirect_stdout(StringIO()):
                    validator.validate(path)

    def test_missing_photo(self):
        self.mutated(lambda f: f.pop('assets/images/01.webp'))

    def test_teacher_material(self):
        self.mutated(lambda f: f.update({'materials/erwartungshorizont.pdf': b'teacher'}))

    def test_path_traversal(self):
        self.mutated(lambda f: f.update({'../outside': b'unsafe'}))

    def test_wrong_scorm_version(self):
        self.mutated(lambda f: f.update({'imsmanifest.xml': f['imsmanifest.xml'].replace(b'<schemaversion>1.2', b'<schemaversion>2004')}))

    def test_invalid_adl_type(self):
        self.mutated(lambda f: f.update({'imsmanifest.xml': f['imsmanifest.xml'].replace(b'scormtype="sco"', b'scormtype="invalid"')}))

    def test_remote_automatic_resource(self):
        self.mutated(lambda f: f.update({'index.html': f['index.html'].replace(b'</head>', b'<script src="https://example.org/tracker.js"></script></head>')}))

    def test_relative_reference_missing(self):
        self.mutated(lambda f: f.update({'index.html': f['index.html'].replace(b'css/style.css', b'css/missing.css')}))

    def test_scoring_modification(self):
        self.mutated(lambda f: f.update({'js/scoring.js': f['js/scoring.js'] + b'\n// unapproved change'}))

    def test_photo_bytes_modified(self):
        self.mutated(lambda f: f.update({'assets/images/01.webp': f['assets/images/01.webp'] + b'changed'}))

    def test_game_text_modified(self):
        self.mutated(lambda f: f.update({'index.html': f['index.html'].replace('Gemeinsam ermitteln.'.encode(), b'Changed game text.')}))


if __name__ == '__main__':
    unittest.main(verbosity=2)
