#!/usr/bin/env python3
"""Prepara las fotografías locales de las tres landing pages (stdlib + Pillow).

Las fotos vienen de Unsplash (licencia Unsplash) y Pexels (licencia Pexels):
ambas permiten uso comercial gratuito sin atribución obligatoria; aun así se
registra autor y origen. Se descargan una vez, se recortan a la proporción del
espacio que ocupan y se guardan como WebP en <landing>/assets/images/, de modo
que las páginas no dependen de enlaces remotos.

Ninguna foto muestra un trabajo real del negocio: son de demostración y deben
sustituirse por fotos propias antes de publicar (ver CREDITOS.md de cada landing).

Uso:
  python3 tools/fotos.py todo                 # procesa todo tools/fotos.json
  python3 tools/fotos.py todo --solo mudanzas-acarreos
Cada entrada de fotos.json: proyecto, slot, fuente ('unsplash'|'pexels'), id,
ratio ('4:5'), anchos ([640, 1100]), foco ('0.5,0.5'), autor, alt.
"""
import argparse
import io
import json
import urllib.request
from pathlib import Path

from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
MANIFIESTO = RAIZ / 'tools' / 'fotos.json'
UA = 'LandingTransporteDemo/1.0 (sitio de demostracion)'
CACHE = RAIZ / 'tools' / '_cache'

FUENTES = {
    'unsplash': {
        'url': 'https://images.unsplash.com/{id}?w=2800&q=85&fm=jpg&fit=max',
        'pagina': 'https://images.unsplash.com/{id}',
        'licencia': 'Licencia Unsplash', 'licencia_url': 'https://unsplash.com/license'},
    'pexels': {
        'url': 'https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w=2600',
        'pagina': 'https://www.pexels.com/photo/{id}/',
        'licencia': 'Licencia Pexels', 'licencia_url': 'https://www.pexels.com/license/'},
}


def descargar(fuente, ident):
    CACHE.mkdir(exist_ok=True)
    local = CACHE / f'{fuente}-{ident}.jpg'
    if not local.exists():
        req = urllib.request.Request(FUENTES[fuente]['url'].format(id=ident), headers={'User-Agent': UA})
        with urllib.request.urlopen(req, timeout=120) as r:
            local.write_bytes(r.read())
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
    destino = RAIZ / e['proyecto'] / 'assets' / 'images'
    destino.mkdir(parents=True, exist_ok=True)
    im = ImageOps.exif_transpose(Image.open(io.BytesIO(descargar(e['fuente'], e['id'])))).convert('RGB')
    im, rw, rh = recortar(im, e['ratio'], e.get('foco', '0.5,0.5'))
    archivos = []
    for ancho in e['anchos']:
        ancho = min(ancho, im.width)
        alto = round(ancho * rh / rw)
        nombre = f"{e['slot']}-{ancho}.webp"
        im.resize((ancho, alto), Image.LANCZOS).save(destino / nombre, 'WEBP', quality=78, method=6)
        archivos.append(nombre)
    print(e['proyecto'], e['slot'], archivos)
    return archivos


def escribir_creditos(entradas, proyecto):
    filas = [e for e in entradas if e['proyecto'] == proyecto]
    (RAIZ / proyecto / 'js').mkdir(parents=True, exist_ok=True)
    lineas = ['# Créditos fotográficos', '',
              'Fotografías de demostración de Unsplash (https://unsplash.com/license) y Pexels',
              '(https://www.pexels.com/license/), ambas con uso comercial gratuito. **Ninguna muestra',
              'un trabajo real de la empresa**: sustitúyelas por fotos propias antes de publicar y',
              'vuelve a ejecutar `python3 tools/fotos.py` si cambias alguna.', '',
              '| Archivo | Autor | Origen | Qué muestra |', '|---|---|---|---|']
    for e in filas:
        pagina = FUENTES[e['fuente']]['pagina'].format(id=e['id'])
        lineas.append(f"| `{e['slot']}-*.webp` | {e.get('autor') or '—'} | {pagina} | {e['alt']} |")
    (RAIZ / proyecto / 'assets' / 'images' / 'CREDITOS.md').write_text('\n'.join(lineas) + '\n')
    # Copia para el pie de página (se carga como script clásico: funciona también en file://).
    datos = [{'archivo': e['slot'], 'autor': e.get('autor') or '',
              'origen': FUENTES[e['fuente']]['pagina'].format(id=e['id']),
              'licencia': FUENTES[e['fuente']]['licencia'], 'licenciaUrl': FUENTES[e['fuente']]['licencia_url']}
             for e in filas]
    (RAIZ / proyecto / 'js' / 'creditos.js').write_text(
        '/* Generado por tools/fotos.py — no editar a mano. */\nwindow.CREDITOS = '
        + json.dumps(datos, ensure_ascii=False, indent=1) + ';\n')


def main():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest='cmd', required=True)
    t = sub.add_parser('todo')
    t.add_argument('--solo', default='')
    t.add_argument('--slot', default='')
    a = p.parse_args()
    entradas = json.loads(MANIFIESTO.read_text())
    for e in entradas:
        if (a.solo and e['proyecto'] != a.solo) or (a.slot and e['slot'] != a.slot):
            continue
        procesar(e)
    for proyecto in sorted({e['proyecto'] for e in entradas}):
        escribir_creditos(entradas, proyecto)


if __name__ == '__main__':
    main()
