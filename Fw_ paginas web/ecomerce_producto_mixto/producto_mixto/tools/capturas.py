#!/usr/bin/env python3
"""Convierte las capturas de tools/_capturas/ (tools/capturas.js) en WebP para el portafolio.
Los componentes se centran sobre un lienzo 4:3 de color papel para que la galería sea uniforme."""
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / 'tools' / '_capturas'
DEST = RAIZ / 'assets' / 'images' / 'portafolio'
PAPEL = (251, 250, 246)


def main():
    DEST.mkdir(parents=True, exist_ok=True)
    for png in sorted(ORIGEN.glob('*.png')):
        im = Image.open(png).convert('RGB')
        n = png.stem
        if n == 'inicio-1440':
            im.save(DEST / 'inicio-1440.webp', 'WEBP', quality=80, method=6)
            im.resize((900, round(im.height * 900 / im.width)), Image.LANCZOS).save(DEST / 'inicio-900.webp', 'WEBP', quality=80, method=6)
        elif n.startswith('movil'):
            im.save(DEST / f'{n}.webp', 'WEBP', quality=80, method=6)
        else:
            W, H = 800, 600
            k = min((W - 80) / im.width, (H - 80) / im.height, 1.0)
            im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
            lienzo = Image.new('RGB', (W, H), PAPEL)
            lienzo.paste(im, ((W - im.width) // 2, (H - im.height) // 2))
            lienzo.save(DEST / f'{n}.webp', 'WEBP', quality=82, method=6)
        print('ok', n)


if __name__ == '__main__':
    main()
