#!/usr/bin/env python3
"""Convierte tools/_capturas/<marca>.png en assets/images/catalogo/<marca>-{640,1200}.webp."""
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
for png in sorted((RAIZ / 'tools' / '_capturas').glob('*.png')):
    im = Image.open(png).convert('RGB')
    for ancho in (640, 1200):
        alto = round(ancho * im.height / im.width)
        destino = RAIZ / 'assets' / 'images' / 'catalogo' / f'{png.stem}-{ancho}.webp'
        im.resize((ancho, alto), Image.LANCZOS).save(destino, 'WEBP', quality=82, method=6)
        print(destino.relative_to(RAIZ))
