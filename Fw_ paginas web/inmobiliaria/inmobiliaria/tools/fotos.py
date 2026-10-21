#!/usr/bin/env python3
"""Prepara las fotografías locales de las tres landing pages (stdlib + Pillow).

Las fotos vienen de Unsplash (licencia Unsplash: uso comercial gratuito, sin
atribución obligatoria) y de Wikimedia Commons (licencias CC con atribución).
Se descargan una sola vez, se recortan a la proporción del espacio que ocupan
y se guardan como WebP en <proyecto>/assets/img/. Así las páginas no dependen
de enlaces remotos a imágenes.

Uso:
  python3 tools/fotos.py hoja ID [ID ...] --out DIR
      Descarga miniaturas de fotos de Unsplash (ID = 'photo-…') y genera
      DIR/hoja.jpg, una hoja de contactos numerada para elegir.

  python3 tools/fotos.py usar FUENTE --proyecto 01-inmobiliaria-prestige \
      --slot hero --ratio 16:9 --anchos 960,1600,2400 [--foco 0.5,0.5] \
      --alt "Descripción de lo que se ve"
      FUENTE es un ID de Unsplash ('photo-…') o un archivo de Commons
      ('File:Nombre.jpg'). Escribe assets/img/<slot>-<ancho>.webp y registra
      el crédito en tools/creditos.json.
"""
import argparse
import io
import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
CREDITOS = RAIZ / 'tools' / 'creditos.json'
UA = 'InmobiliariaDemo/1.0 (sitio de demostracion)'
COMMONS_API = 'https://commons.wikimedia.org/w/api.php'


def descargar(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def unsplash_url(pid, w):
    return f'https://images.unsplash.com/{pid}?w={w}&q=85&fm=jpg&fit=max'


def commons_info(archivo):
    q = urllib.parse.urlencode({
        'action': 'query', 'format': 'json', 'titles': archivo, 'prop': 'imageinfo',
        'iiprop': 'url|extmetadata|size', 'iiurlwidth': 4000,
    })
    data = json.loads(descargar(f'{COMMONS_API}?{q}'))
    page = next(iter(data['query']['pages'].values()))
    ii = page['imageinfo'][0]
    meta = ii.get('extmetadata', {})
    limpio = lambda k: re.sub(r'<[^>]+>', '', meta.get(k, {}).get('value', '')).strip()
    return {
        'url': ii.get('thumburl') or ii['url'],
        'pagina': ii['descriptionurl'],
        'autor': limpio('Artist'),
        'licencia': limpio('LicenseShortName'),
        'licencia_url': meta.get('LicenseUrl', {}).get('value', ''),
    }


def hoja(ids, out):
    out = Path(out)
    out.mkdir(parents=True, exist_ok=True)
    tw, th, cols = 320, 220, 5
    celdas = []
    for i, pid in enumerate(ids, 1):
        try:
            im = Image.open(io.BytesIO(descargar(unsplash_url(pid, 480)))).convert('RGB')
            celdas.append((i, pid, ImageOps.fit(im, (tw, th))))
        except Exception as e:  # noqa: BLE001 — se informa y se sigue con las demás
            print(f'{i:>3} {pid} FALLA {e}', file=sys.stderr)
    filas = (len(celdas) + cols - 1) // cols
    lienzo = Image.new('RGB', (cols * tw, filas * (th + 22)), 'white')
    d = ImageDraw.Draw(lienzo)
    for n, (i, pid, im) in enumerate(celdas):
        x, y = (n % cols) * tw, (n // cols) * (th + 22)
        lienzo.paste(im, (x, y))
        d.text((x + 4, y + th + 4), f'{i} {pid[6:24]}', fill='black')
    lienzo.save(out / 'hoja.jpg', quality=80)
    print(f'{len(celdas)}/{len(ids)} fotos → {out / "hoja.jpg"}')


def usar(a):
    destino = RAIZ / a.proyecto / 'assets' / 'img'
    destino.mkdir(parents=True, exist_ok=True)
    if a.fuente.startswith('File:'):
        info = commons_info(a.fuente)
        crudo = descargar(info['url'])
        credito = {'fuente': 'Wikimedia Commons', 'pagina': info['pagina'], 'autor': info['autor'],
                   'licencia': info['licencia'], 'licencia_url': info['licencia_url']}
    else:
        crudo = descargar(unsplash_url(a.fuente, 2600))
        credito = {'fuente': 'Unsplash', 'pagina': f'https://images.unsplash.com/{a.fuente}',
                   'autor': '', 'licencia': 'Licencia Unsplash',
                   'licencia_url': 'https://unsplash.com/license'}
    im = ImageOps.exif_transpose(Image.open(io.BytesIO(crudo))).convert('RGB')
    rw, rh = (float(x) for x in a.ratio.split(':'))
    fx, fy = (float(x) for x in a.foco.split(','))
    w, h = im.size
    if w / h > rw / rh:
        cw, ch = int(h * rw / rh), h
    else:
        cw, ch = w, int(w * rh / rw)
    cx = min(max(int(fx * w - cw / 2), 0), w - cw)
    cy = min(max(int(fy * h - ch / 2), 0), h - ch)
    im = im.crop((cx, cy, cx + cw, cy + ch))
    archivos = []
    for ancho in (int(x) for x in a.anchos.split(',')):
        ancho = min(ancho, im.width)
        alto = round(ancho * rh / rw)
        nombre = f'{a.slot}-{ancho}.webp'
        im.resize((ancho, alto), Image.LANCZOS).save(destino / nombre, 'WEBP', quality=78, method=6)
        archivos.append(nombre)
    registro = json.loads(CREDITOS.read_text()) if CREDITOS.exists() else []
    registro = [r for r in registro if not (r['proyecto'] == a.proyecto and r['slot'] == a.slot)]
    registro.append({'proyecto': a.proyecto, 'slot': a.slot, 'origen': a.fuente, 'alt': a.alt,
                     'archivos': archivos, **credito})
    registro.sort(key=lambda r: (r['proyecto'], r['slot']))
    CREDITOS.write_text(json.dumps(registro, ensure_ascii=False, indent=2) + '\n')
    print(a.proyecto, a.slot, archivos, f'(origen {im.width}px)')


def main():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest='cmd', required=True)
    h = sub.add_parser('hoja')
    h.add_argument('ids', nargs='+')
    h.add_argument('--out', required=True)
    u = sub.add_parser('usar')
    u.add_argument('fuente')
    u.add_argument('--proyecto', required=True)
    u.add_argument('--slot', required=True)
    u.add_argument('--ratio', default='4:3')
    u.add_argument('--anchos', default='640,1280')
    u.add_argument('--foco', default='0.5,0.5')
    u.add_argument('--alt', required=True)
    a = p.parse_args()
    hoja(a.ids, a.out) if a.cmd == 'hoja' else usar(a)


if __name__ == '__main__':
    main()
