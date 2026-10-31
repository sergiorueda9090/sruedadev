#!/usr/bin/env python3
"""Prepara las fotografías locales de las tres demos (stdlib + Pillow + curl).

Todas las fotos vienen de Unsplash (licencia Unsplash: uso comercial gratuito,
atribución no obligatoria; aun así se registra autor y origen). Se descargan una
vez, se recortan a la proporción del espacio que ocupan y se guardan como WebP en
assets/images/<marca>/<slot>-<ancho>.webp: las páginas no dependen de enlaces remotos.

Son fotos ilustrativas: no muestran profesionales, pacientes ni instalaciones de
ninguna institución real. Sustitúyelas por fotos propias antes de publicar.

Uso:
  python3 tools/fotos.py              # procesa todo tools/fotos.json y regenera creditos.html
  python3 tools/fotos.py --marca integra --slot hero
Cada entrada: marca, slot, id (photo-…), autor, pagina, ratio ('4:5'), anchos, foco ('x,y'), alt.
"""
import argparse
import html
import io
import json
import subprocess
from pathlib import Path

from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
MANIFIESTO = RAIZ / 'tools' / 'fotos.json'
CACHE = RAIZ / 'tools' / '_cache'
NOMBRES = {'neuroavanzar': 'Neuroavanzar', 'aprehender': 'Aprehender', 'integra': 'Integra Neurorehabilitación'}


def descargar(ident):
    # curl en lugar de urllib: el CDN de Unsplash responde mejor sin User-Agent de Python.
    CACHE.mkdir(exist_ok=True)
    local = CACHE / f'{ident}.jpg'
    if not local.exists():
        url = f'https://images.unsplash.com/{ident}?w=2800&q=85&fm=jpg&fit=max'
        datos = subprocess.run(['curl', '-sfL', '--max-time', '120', url], capture_output=True, check=True).stdout
        local.write_bytes(datos)
    return local.read_bytes()


def recortar(im, ratio, foco):
    rw, rh = (float(x) for x in ratio.split(':'))
    fx, fy = (float(x) for x in foco.split(','))
    w, h = im.size
    if w / h > rw / rh:
        cw, ch = int(h * rw / rh), h
    else:
        cw, ch = w, int(w * rh / rw)
    cx = min(max(int(fx * w - cw / 2), 0), w - cw)
    cy = min(max(int(fy * h - ch / 2), 0), h - ch)
    return im.crop((cx, cy, cx + cw, cy + ch)), rw, rh


def procesar(e):
    destino = RAIZ / 'assets' / 'images' / e['marca']
    destino.mkdir(parents=True, exist_ok=True)
    im = ImageOps.exif_transpose(Image.open(io.BytesIO(descargar(e['id'])))).convert('RGB')
    im, rw, rh = recortar(im, e['ratio'], e.get('foco', '0.5,0.5'))
    hechos = []
    for ancho in e['anchos']:
        ancho = min(ancho, im.width)
        alto = round(ancho * rh / rw)
        nombre = f"{e['slot']}-{ancho}.webp"
        im.resize((ancho, alto), Image.LANCZOS).save(destino / nombre, 'WEBP', quality=78, method=6)
        hechos.append(f'{nombre} ({ancho}x{alto})')
    print(e['marca'], ' '.join(hechos))


def escribir_creditos(entradas):
    filas = []
    for marca in NOMBRES:
        for e in (x for x in entradas if x['marca'] == marca):
            filas.append(
                f'<tr><td>{NOMBRES[marca]}</td><td><code>{e["slot"]}</code></td>'
                f'<td>{html.escape(e["alt"])}</td><td>{html.escape(e["autor"])}</td>'
                f'<td><a href="{e["pagina"]}" rel="noopener">Ver en Unsplash</a></td></tr>')
    plantilla = (RAIZ / 'tools' / 'creditos.plantilla.html').read_text()
    (RAIZ / 'creditos.html').write_text(plantilla.replace('<!-- FILAS -->', '\n'.join(filas)))


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--marca', default='')
    p.add_argument('--slot', default='')
    a = p.parse_args()
    entradas = json.loads(MANIFIESTO.read_text())
    for e in entradas:
        if (a.marca and e['marca'] != a.marca) or (a.slot and e['slot'] != a.slot):
            continue
        procesar(e)
    escribir_creditos(entradas)


if __name__ == '__main__':
    main()
