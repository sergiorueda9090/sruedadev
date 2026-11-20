#!/usr/bin/env python3
"""Convierte los PNG de tools/_render/ (generados por tools/render.js) en WebP optimizados.

  products/<id>/<vista>-400.webp y -900.webp   (vistas 4:5)
  products/<id>/comparar-antes|despues-1200.webp y -700.webp (4:3)
  products/<id>/recorte-600.webp                (fondo transparente)
  categorias/<categoria>-480.webp y -900.webp   (1:1)
  hero/productos-1100.webp y -640.webp          (transparente)
  og.jpg (1200×630, Open Graph)

Uso: python3 tools/imagenes.py
"""
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / 'tools' / '_render'
IMG = RAIZ / 'assets' / 'images'


def guardar(im, destino, ancho, alfa=False):
    destino.parent.mkdir(parents=True, exist_ok=True)
    alto = round(im.height * ancho / im.width)
    im = im.resize((ancho, alto), Image.LANCZOS)
    if not alfa:
        im = im.convert('RGB')
    im.save(destino, 'WEBP', quality=82 if not alfa else 86, method=6)


def main():
    n = 0
    for png in sorted(ORIGEN.glob('*.png')):
        nombre, _, vista = png.stem.partition('--')
        im = Image.open(png)
        if nombre == 'categoria':
            for a in (480, 900):
                guardar(im, IMG / 'categorias' / f'{vista}-{a}.webp', a)
        elif nombre == 'og':
            im.convert('RGB').save(IMG / 'og.jpg', 'JPEG', quality=86, optimize=True)
        elif nombre == 'heroe':
            for a in (640, 1100):
                guardar(im, IMG / 'hero' / f'productos-{a}.webp', a, alfa=True)
        elif vista.startswith('comparar'):
            for a in (700, 1200):
                guardar(im, IMG / 'products' / nombre / f'{vista}-{a}.webp', a)
        elif vista == 'recorte':
            guardar(im, IMG / 'products' / nombre / 'recorte-600.webp', 600, alfa=True)
        else:
            for a in (400, 900):
                guardar(im, IMG / 'products' / nombre / f'{vista}-{a}.webp', a)
        n += 1
    print(n, 'imágenes procesadas')


if __name__ == '__main__':
    main()
