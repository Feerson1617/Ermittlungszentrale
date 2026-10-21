"""Optimize verified Commons originals. Development only: Pillow 12.3.0.

Usage: python3 scripts/prepare-media.py /path/to/originals
Keep original Wikimedia filenames in that directory. This script never downloads.
"""
import hashlib
import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse
from PIL import Image, ImageOps

root = Path(__file__).resolve().parent.parent
catalog_path = root / 'data/media.json'
catalog = json.loads(catalog_path.read_text())
originals = Path(sys.argv[1])
for key, entry in catalog['images'].items():
    source = originals / unquote(Path(urlparse(entry['original']).path).name)
    content = source.read_bytes()
    assert hashlib.sha1(content).hexdigest() == entry['originalSha1'], f'Originalrevision stimmt nicht: {key}'
    assert hashlib.sha256(content).hexdigest() == entry['originalSha256'], f'Original-SHA256 stimmt nicht: {key}'
    assert re.fullmatch(r'assets/images/[a-z\d-]+\.webp', entry['path'])
    image = ImageOps.exif_transpose(Image.open(source)).convert('RGB')
    image.thumbnail((1400, 1400), Image.Resampling.LANCZOS)
    target = root / entry['path']
    image.save(target, 'WEBP', quality=82, method=6)
    optimized = target.read_bytes()
    entry.update(width=image.width, height=image.height, bytes=len(optimized),
                 sha256=hashlib.sha256(optimized).hexdigest())
    print(f'{key}: {image.width} × {image.height}, {len(optimized)} bytes')
catalog_path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n')
