#!/usr/bin/env python3
"""Descarga y prepara las fotografías de estilo de vida de VITALIA (stdlib + Pillow + curl).

Todas vienen de Unsplash (licencia Unsplash: uso comercial gratuito, sin
atribución obligatoria). Aun así se registra autor y origen en
assets/images/credits.json. Se descargan una vez (caché en tools/_cache/),
se recortan a la proporción del espacio que ocupan y se guardan como WebP en
assets/images/<carpeta>/<nombre>-<ancho>.webp, así el sitio no depende de
enlaces remotos.

Son imágenes ilustrativas: no muestran productos ni clientes reales.

Uso:
  python3 tools/fotos.py            # procesa tools/fotos.json
Cada entrada: slot ('carpeta/nombre'), id (Unsplash), ratio, anchos, foco, alt.
"""
import io
import json
import re
import subprocess
from pathlib import Path

from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
MANIFIESTO = RAIZ / 'tools' / 'fotos.json'
CACHE = RAIZ / 'tools' / '_cache'
IMAGENES = RAIZ / 'assets' / 'images'
CREDITOS = IMAGENES / 'credits.json'


def descargar(ident):
    CACHE.mkdir(exist_ok=True)
    local = CACHE / f'unsplash-{ident}.jpg'
    if not local.exists():
        url = f'https://unsplash.com/photos/{ident}/download?w=2400'
        subprocess.run(['curl', '-sfL', '--max-time', '120', '-o', str(local), url], check=True)
    return local.read_bytes()


def autor(ident):
    cache = CACHE / f'unsplash-{ident}.autor'
    if cache.exists():
        return cache.read_text()
    r = subprocess.run(['curl', '-sfL', '--max-time', '60', f'https://unsplash.com/photos/{ident}'],
                       capture_output=True, text=True)
    m = re.search(r'Photo by ([^"<]+?) on Unsplash', r.stdout)
    nombre = m.group(1).strip() if m else ''
    cache.write_text(nombre)
    return nombre


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
    carpeta, nombre = e['slot'].split('/')
    destino = IMAGENES / carpeta
    destino.mkdir(parents=True, exist_ok=True)
    im = ImageOps.exif_transpose(Image.open(io.BytesIO(descargar(e['id'])))).convert('RGB')
    im, rw, rh = recortar(im, e['ratio'], e.get('foco', '0.5,0.5'))
    archivos = []
    for ancho in e['anchos']:
        ancho = min(ancho, im.width)
        alto = round(ancho * rh / rw)
        archivo = f'{nombre}-{ancho}.webp'
        im.resize((ancho, alto), Image.LANCZOS).save(destino / archivo, 'WEBP', quality=80, method=6)
        archivos.append(f'{carpeta}/{archivo}')
    print(e['slot'], archivos)
    return archivos


def main():
    manifiesto = json.loads(MANIFIESTO.read_text())
    creditos = []
    for e in manifiesto:
        archivos = procesar(e)
        creditos.append({
            'archivos': archivos, 'alt': e['alt'], 'autor': autor(e['id']),
            'fuente': f"https://unsplash.com/photos/{e['id']}",
            'licencia': 'Licencia Unsplash', 'licencia_url': 'https://unsplash.com/license'})
    previos = json.loads(CREDITOS.read_text()) if CREDITOS.exists() else {}
    previos['fotografias'] = creditos
    CREDITOS.write_text(json.dumps(previos, ensure_ascii=False, indent=1) + '\n')
    print('créditos:', CREDITOS.relative_to(RAIZ))


if __name__ == '__main__':
    main()
