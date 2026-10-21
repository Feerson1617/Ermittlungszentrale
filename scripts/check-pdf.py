"""Meaningful PDF validation. Requires pypdf (development only)."""
from pathlib import Path
from pypdf import PdfReader
import re
root=Path(__file__).resolve().parent.parent
pdf=PdfReader(root/'materials/ermittlungsbogen.pdf')
assert len(pdf.pages)==2, 'Ermittlungsbogen muss genau zwei Seiten haben'
for p in pdf.pages:
    assert abs(float(p.mediabox.width)-595.28)<2
    assert abs(float(p.mediabox.height)-841.89)<2
front,back=[p.extract_text() for p in pdf.pages]
assert not re.search(r'Afrika|Africa|Marokko|Nigeria|Ghana',front+'\n'+back,re.I), 'Lösung auf dem unausgefüllten Bogen'
for term in ['Meine geheime Ermittlungsakte','Name:','Team:','Akte 001','Akte 002','1 / 2']:
    assert term in front, term
for term in ['Akte 003','Akte 004','Akte 005','Gesamt:','/ 30','Bonus-Akte 5:','2 / 2']:
    assert term in back, term
teacher=PdfReader(root/'materials/erwartungshorizont.pdf')
assert len(teacher.pages)>1
text='\n'.join(p.extract_text() for p in teacher.pages)
for term in ['Marokko','Nigeria','Ghana','Kurmandschi','Sorani','Teilpunkte','Hinweise']:
    assert term in text, term
for i,p in enumerate(teacher.pages,1):
    page=p.extract_text()
    assert re.search(rf'{i}\s*/\s*{len(teacher.pages)}',page), f'Seitenzahl {i} fehlt'
    assert len(page.strip())>100, f'Leere Lehrerseite {i}'
    assert abs(float(p.mediabox.width)-595.28)<2 and abs(float(p.mediabox.height)-841.89)<2
catalog=text.split('Bildnummern 1–12 – M2',1)[1].split('Zusätzliche Belegbilder',1)[0]
for n in range(1,13):
    assert re.search(rf'(?m)^{n}\s',catalog), f'Auswahlbild {n} fehlt in der PDF-Tabelle'
for term in ['Kajiado','Butaro','Versorgung','Maximal','Abschlussaufgabe','Keine menschliche Abnahme wurde erfunden']:
    assert term in text,term
normalized=re.sub(r'\s+',' ',text)
for term in ['Ermittlungszentrale 2.1','Lehmhäuser mit Strohdächern','Bergbau','Schule mit einfacher Ausstattung','Wasser holen und transportieren','Gesundheitsstation','Phalaborwa','Dankh Sene','keine Tatsachen']:
    assert term in normalized,term
assert re.search(r'PD-\s*USGov-HHS',text), 'Lizenzgrundlage fehlt'
assert text.count('Neue Beweise gefunden!')==4, 'Vier Beleg-Rückbezüge fehlen im Lehrertext'
print(f'PDF geprüft: Schülerbogen 2 × DIN A4, Erwartungshorizont {len(teacher.pages)} Seiten, alle Aufgaben und Punktfelder vorhanden.')
