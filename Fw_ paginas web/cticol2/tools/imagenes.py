#!/usr/bin/env python3
"""Convierte las fotos originales de img/ en WebP optimizados dentro de assets/img/.

    python3 tools/imagenes.py          # procesa todo el manifiesto
    python3 tools/imagenes.py --ver    # además genera hojas de revisión en tools/_revision/

Cada entrada del MANIFIESTO define:
  origen  archivo dentro de img/ (las fotos que entregó el cliente; no se modifican)
  destino ruta sin extensión dentro de assets/img/ (se crea <destino>-<ancho>.webp)
  anchos  anchos de salida; los que superan el ancho original se omiten
  recorte (izq, arriba, der, abajo) en fracciones del original, opcional
  tapar   lista de cajas (izq, arriba, der, abajo) en fracciones que se desenfocan:
          se usa para ocultar nombres y logotipos de otras empresas de transporte.

Requiere Pillow.
"""
import sys
from pathlib import Path
from PIL import Image, ImageFilter, ImageDraw

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / 'img'
SALIDA = RAIZ / 'assets' / 'img'

# Cajas a desenfocar (marcas de otras empresas visibles en la foto).
TAPAR_SIRIUS = [(0.555, 0.52, 0.745, 0.635)]
TAPAR_COL1 = [(0.325, 0.555, 0.44, 0.597), (0.13, 0.55, 0.24, 0.61)]

MANIFIESTO = [
    # Slider principal
    {'origen': 'img4.jpeg', 'destino': 'hero/carga-general', 'anchos': [2048, 1440, 960, 640]},
    {'origen': 'img3.jpeg', 'destino': 'hero/carga-pesada', 'anchos': [1470, 960, 640]},
    {'origen': 'img12.jpeg', 'destino': 'hero/sobredimensionada', 'anchos': [1200, 960, 640], 'tapar': TAPAR_SIRIUS},
    # Servicios
    {'origen': 'img13.jpeg', 'destino': 'services/carga-general', 'anchos': [960, 640], 'recorte': (0, 0, 0.95, 0.94)},
    {'origen': 'img6.jpeg', 'destino': 'services/mercancia-seca', 'anchos': [1200, 960, 640]},
    {'origen': 'img10.jpeg', 'destino': 'services/carga-pesada', 'anchos': [972, 640]},
    {'origen': 'col_1.jpeg', 'destino': 'services/carga-sobredimensionada', 'anchos': [1280, 960, 640], 'tapar': TAPAR_COL1},
    {'origen': 'img8.jpeg', 'destino': 'services/maquinaria-pesada', 'anchos': [1188, 960, 640]},
    {'origen': 'img5.jpeg', 'destino': 'services/transporte-especializado', 'anchos': [880, 640]},
    # Empresa
    {'origen': 'img14.jpeg', 'destino': 'company/patio', 'anchos': [1536, 960, 640]},
    {'origen': 'col_3.jpeg', 'destino': 'company/municipio', 'anchos': [835, 640]},
    {'origen': 'img2.jpeg', 'destino': 'company/ruta', 'anchos': [1290, 960, 640]},
    # Flota
    {'origen': 'col_4.jpeg', 'destino': 'fleet/tractocamion', 'anchos': [800, 560]},
    {'origen': 'img1.jpeg', 'destino': 'fleet/camion', 'anchos': [850, 560]},
    # Única foto que no es del cliente: Eirik Skarstein, Unsplash (yFXmbinYr0Y), ver assets/img/CREDITOS.md
    {'origen': 'unsplash-turbo-yFXmbinYr0Y.jpg', 'destino': 'fleet/turbo', 'anchos': [1200, 800, 560], 'recorte': (0.42, 0.14, 1.0, 0.94)},
    {'origen': 'col_2.jpeg', 'destino': 'fleet/cama-baja', 'anchos': [600]},
    {'origen': 'img11.jpeg', 'destino': 'fleet/remolque-modular', 'anchos': [800, 560],
     'tapar': [(0.095, 0.63, 0.18, 0.675), (0.42, 0.595, 0.515, 0.655)]},
]


def procesar(item, ver=False):
    src = ORIGEN / item['origen']
    im = Image.open(src).convert('RGB')
    w, h = im.size
    for (l, t, r, b) in item.get('tapar', []):
        caja = (int(l * w), int(t * h), int(r * w), int(b * h))
        zona = im.crop(caja).filter(ImageFilter.GaussianBlur(radius=max(6, (caja[2] - caja[0]) // 10)))
        im.paste(zona, caja)
    if 'recorte' in item:
        l, t, r, b = item['recorte']
        im = im.crop((int(l * w), int(t * h), int(r * w), int(b * h)))
        w, h = im.size
    destino = SALIDA / item['destino']
    destino.parent.mkdir(parents=True, exist_ok=True)
    hechos = []
    for ancho in item['anchos']:
        if ancho > w:
            continue
        alto = round(h * ancho / w)
        im.resize((ancho, alto), Image.LANCZOS).save(f'{destino}-{ancho}.webp', 'WEBP', quality=80, method=6)
        hechos.append(ancho)
    print(f"{item['destino']:40} {w}x{h} -> {hechos}")
    if ver and item.get('tapar'):
        rev = RAIZ / 'tools' / '_revision'
        rev.mkdir(exist_ok=True)
        im.save(rev / (Path(item['destino']).name + '.jpg'), quality=85)


if __name__ == '__main__':
    ver = '--ver' in sys.argv
    for item in MANIFIESTO:
        procesar(item, ver)
