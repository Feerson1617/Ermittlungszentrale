"""Meaningful PDF validation. Requires pypdf (development only)."""
from pathlib import Path
from pypdf import PdfReader
root=Path(__file__).resolve().parent.parent
pdf=PdfReader(root/'materials/ermittlungsbogen.pdf')
assert len(pdf.pages)==2, 'Ermittlungsbogen muss genau zwei Seiten haben'
for p in pdf.pages:
    assert abs(float(p.mediabox.width)-595.28)<2
    assert abs(float(p.mediabox.height)-841.89)<2
front,back=[p.extract_text() for p in pdf.pages]
for term in ['Meine geheime Ermittlungsakte','Name:','Team:','Akte 001','Akte 002','1 / 2']:
    assert term in front, term
for term in ['Akte 003','Akte 004','Akte 005','Gesamt:','/ 30','Bonus-Akte 5:','2 / 2']:
    assert term in back, term
teacher=PdfReader(root/'materials/erwartungshorizont.pdf')
assert len(teacher.pages)>1
text='\n'.join(p.extract_text() for p in teacher.pages)
for term in ['Marokko','Nigeria','Ghana','Kurmandschi','Sorani','Teilpunkte','Hinweise']:
    assert term in text, term
print(f'PDF geprüft: Schülerbogen 2 × DIN A4, Erwartungshorizont {len(teacher.pages)} Seiten, alle Aufgaben und Punktfelder vorhanden.')
