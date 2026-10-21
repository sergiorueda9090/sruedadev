#!/usr/bin/env python3
"""Prepara las fotografías locales de las tres landing pages (stdlib + Pillow).

Las fotos vienen de Unsplash (licencia Unsplash: uso comercial gratuito, sin
atribución obligatoria; aun así se registra el autor). Se descargan una vez,
se recortan a la proporción del espacio que ocupan y se guardan como WebP en
<landing>/assets/images/. Así las páginas no dependen de enlaces remotos.

Uso:
  python3 tools/fotos.py usar photo-XXXX --proyecto landing-1-ingenieria \
      --slot hero --ratio 4:5 --anchos 640,1000,1400 [--foco 0.5,0.5] \
      --autor "Nombre" --alt "Descripción de lo que se ve"

Escribe <proyecto>/assets/images/<slot>-<ancho>.webp, registra el crédito en
tools/creditos.json y regenera <proyecto>/assets/images/CREDITOS.md.
"""
import argparse
import io
import json
import urllib.request
from pathlib import Path

from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
CREDITOS = RAIZ / 'tools' / 'creditos.json'
UA = 'EstanteriaDemo/1.0 (sitio de demostracion)'


def descargar(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=90) as r:
        return r.read()


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


def escribir_creditos_md(registro, proyecto):
    filas = [r for r in registro if r['proyecto'] == proyecto]
    lineas = ['# Créditos fotográficos', '',
              'Fotografías de demostración descargadas de Unsplash (licencia Unsplash,',
              'https://unsplash.com/license). Sustitúyelas por fotos propias de la empresa',
              'antes de publicar: ninguna muestra un proyecto real del proveedor.', '',
              '| Archivo | Autor | Origen | Qué muestra |', '|---|---|---|---|']
    for r in filas:
        lineas.append(f"| `{r['slot']}-*.webp` | {r['autor'] or '—'} | {r['pagina']} | {r['alt']} |")
    (RAIZ / proyecto / 'assets' / 'images' / 'CREDITOS.md').write_text('\n'.join(lineas) + '\n')


def usar(a):
    destino = RAIZ / a.proyecto / 'assets' / 'images'
    destino.mkdir(parents=True, exist_ok=True)
    crudo = descargar(f'https://images.unsplash.com/{a.fuente}?w=2800&q=85&fm=jpg&fit=max')
    im = ImageOps.exif_transpose(Image.open(io.BytesIO(crudo))).convert('RGB')
    im, rw, rh = recortar(im, a.ratio, a.foco)
    archivos = []
    for ancho in (int(x) for x in a.anchos.split(',')):
        ancho = min(ancho, im.width)
        alto = round(ancho * rh / rw)
        nombre = f'{a.slot}-{ancho}.webp'
        im.resize((ancho, alto), Image.LANCZOS).save(destino / nombre, 'WEBP', quality=76, method=6)
        archivos.append(nombre)
    registro = json.loads(CREDITOS.read_text()) if CREDITOS.exists() else []
    registro = [r for r in registro if not (r['proyecto'] == a.proyecto and r['slot'] == a.slot)]
    registro.append({'proyecto': a.proyecto, 'slot': a.slot, 'origen': a.fuente, 'alt': a.alt,
                     'ratio': a.ratio, 'archivos': archivos, 'fuente': 'Unsplash',
                     'pagina': f'https://images.unsplash.com/{a.fuente}',
                     'autor': a.autor, 'licencia': 'Licencia Unsplash',
                     'licencia_url': 'https://unsplash.com/license'})
    registro.sort(key=lambda r: (r['proyecto'], r['slot']))
    CREDITOS.write_text(json.dumps(registro, ensure_ascii=False, indent=2) + '\n')
    escribir_creditos_md(registro, a.proyecto)
    print(a.proyecto, a.slot, archivos)


def main():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest='cmd', required=True)
    u = sub.add_parser('usar')
    u.add_argument('fuente')
    u.add_argument('--proyecto', required=True)
    u.add_argument('--slot', required=True)
    u.add_argument('--ratio', default='3:2')
    u.add_argument('--anchos', default='640,1100')
    u.add_argument('--foco', default='0.5,0.5')
    u.add_argument('--autor', default='')
    u.add_argument('--alt', required=True)
    usar(p.parse_args())


if __name__ == '__main__':
    main()
