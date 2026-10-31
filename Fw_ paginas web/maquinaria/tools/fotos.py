#!/usr/bin/env python3
"""Busca, recorta y registra fotografías de Wikimedia Commons (solo stdlib + Pillow).

Uso:
  python3 tools/fotos.py buscar "hydraulic excavator crawler" --out /tmp/x [--n 16] [--min 1400]
      Descarga miniaturas de candidatos con licencia aceptada y genera
      <out>/hoja.jpg (hoja de contactos numerada) y <out>/candidatos.json.

  python3 tools/fotos.py usar "File:Nombre.jpg" --slot excavadora-orugas --grupo catalogo \
      --ratio 4:3 --foco 0.5,0.55 [--zoom 1.0] --alt "Descripción de lo que se ve"
      Descarga la imagen (máx. 3840 px), recorta a la proporción con el foco dado
      (fracciones x,y del centro del recorte) y escribe
      assets/img/<grupo>/<slot>-<ancho>.webp. Registra el crédito en tools/credits.json
      y regenera assets/js/credits.js.

  python3 tools/fotos.py creditos
      Solo regenera assets/js/credits.js desde tools/credits.json.
"""
import argparse
import fcntl
import io
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
CREDITOS_JSON = RAIZ / 'tools' / 'credits.json'
CREDITOS_JS = RAIZ / 'assets' / 'js' / 'credits.js'
API = 'https://commons.wikimedia.org/w/api.php'
UA = 'MaquinariaDemoSite/1.0 (sitio de demostracion; contacto via commons)'

# Anchos de salida por grupo: el menor se usa en tarjetas, el mayor en el visor.
ANCHOS = {
    'hero': (960, 1600, 2400),
    'catalogo': (640, 1280),
    'servicios': (800, 1400),
    'proyectos': (800, 1600),
    'secciones': (800, 1600),
}
LICENCIAS = {
    'cc0': 'https://creativecommons.org/publicdomain/zero/1.0/',
    'public domain': 'https://creativecommons.org/publicdomain/mark/1.0/',
    'pd': 'https://creativecommons.org/publicdomain/mark/1.0/',
    'cc by 2.0': 'https://creativecommons.org/licenses/by/2.0/',
    'cc by 2.5': 'https://creativecommons.org/licenses/by/2.5/',
    'cc by 3.0': 'https://creativecommons.org/licenses/by/3.0/',
    'cc by 4.0': 'https://creativecommons.org/licenses/by/4.0/',
    'cc by-sa 2.0': 'https://creativecommons.org/licenses/by-sa/2.0/',
    'cc by-sa 2.5': 'https://creativecommons.org/licenses/by-sa/2.5/',
    'cc by-sa 3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
    'cc by-sa 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
}


def http(url, intentos=4):
    for i in range(intentos):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code in (429, 503) and i < intentos - 1:
                time.sleep(4 * (i + 1))
                continue
            raise


def api(**params):
    params.update(format='json', formatversion='2')
    return json.loads(http(API + '?' + urllib.parse.urlencode(params)))


def limpiar(html):
    texto = re.sub(r'<[^>]+>', '', html or '')
    return re.sub(r'\s+', ' ', texto).strip()


def licencia_de(meta):
    nombre = limpiar(meta.get('LicenseShortName', {}).get('value', ''))
    clave = nombre.lower().replace('-', ' ').replace('by sa', 'by-sa')
    clave = re.sub(r'\s+', ' ', clave)
    if 'nc' in clave.split() or 'nd' in clave.split():
        return None
    for k, url in LICENCIAS.items():
        if clave == k or clave.startswith(k):
            return nombre, url
    if 'public domain' in clave:
        return 'Dominio público', LICENCIAS['public domain']
    return None


def info(titulos, ancho):
    datos = api(action='query', titles='|'.join(titulos), prop='imageinfo',
                iiprop='url|size|mime|extmetadata', iiurlwidth=ancho)
    return datos['query']['pages']


def buscar(a):
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    res = api(action='query', list='search', srsearch=a.consulta + ' filetype:bitmap',
              srnamespace=6, srlimit=50)
    titulos = [r['title'] for r in res['query']['search']]
    candidatos = []
    for i in range(0, len(titulos), 25):
        for p in info(titulos[i:i + 25], 330):
            ii = (p.get('imageinfo') or [{}])[0]
            if ii.get('mime') not in ('image/jpeg', 'image/png') or ii.get('width', 0) < a.min:
                continue
            lic = licencia_de(ii.get('extmetadata', {}))
            if not lic:
                continue
            candidatos.append({'titulo': p['title'], 'ancho': ii['width'], 'alto': ii['height'],
                               'licencia': lic[0], 'thumb': ii['thumburl']})
            if len(candidatos) >= a.n:
                break
        if len(candidatos) >= a.n:
            break
    celdas = []
    for c in candidatos:
        try:
            im = Image.open(io.BytesIO(http(c['thumb']))).convert('RGB')
        except Exception as e:  # noqa: BLE001 - miniatura dañada: se omite
            print('omitida', c['titulo'], e, file=sys.stderr)
            continue
        im.thumbnail((330, 250))
        celdas.append((c, im))
        time.sleep(0.3)
    col, cw, ch = 4, 340, 290
    filas = max(1, (len(celdas) + col - 1) // col)
    hoja = Image.new('RGB', (col * cw, filas * ch), 'white')
    d = ImageDraw.Draw(hoja)
    try:
        fuente = ImageFont.truetype('DejaVuSans-Bold.ttf', 16)
    except OSError:
        fuente = ImageFont.load_default()
    for n, (c, im) in enumerate(celdas):
        x, y = (n % col) * cw + 5, (n // col) * ch + 5
        hoja.paste(im, (x, y))
        d.rectangle([x, y, x + 34, y + 24], fill='black')
        d.text((x + 5, y + 3), str(n), fill='yellow', font=fuente)
        d.text((x, y + 256), f"{c['ancho']}x{c['alto']} {c['licencia'][:14]}", fill='black', font=fuente)
        c['n'] = n
    hoja.save(out / 'hoja.jpg', quality=82)
    lista = [c for c, _ in celdas]
    (out / 'candidatos.json').write_text(json.dumps(lista, ensure_ascii=False, indent=1))
    for c in lista:
        print(f"{c['n']:>2}  {c['ancho']}x{c['alto']}  {c['licencia']:<14} {c['titulo']}")
    print('hoja:', out / 'hoja.jpg')


def cargar_creditos():
    if CREDITOS_JSON.exists():
        return json.loads(CREDITOS_JSON.read_text())
    return []


def escribir_js(creditos):
    CREDITOS_JS.parent.mkdir(parents=True, exist_ok=True)
    cuerpo = json.dumps(creditos, ensure_ascii=False, indent=2)
    CREDITOS_JS.write_text(
        '/* Generado por tools/fotos.py: no editar a mano. Fotos de referencia de Wikimedia Commons. */\n'
        'window.CREDITOS = ' + cuerpo + ';\n')


def usar(a):
    titulo = a.titulo if a.titulo.startswith('File:') else 'File:' + a.titulo
    # 3840 es uno de los anchos de miniatura estándar de Wikimedia (https://w.wiki/GHai);
    # pedir anchos no estándar provoca errores 429.
    p = info([titulo], 3840)[0]
    ii = p['imageinfo'][0]
    meta = ii.get('extmetadata', {})
    lic = licencia_de(meta)
    if not lic:
        sys.exit('Licencia no aceptada: ' + limpiar(meta.get('LicenseShortName', {}).get('value', '')))
    url = ii.get('thumburl') if ii['width'] > 3840 else ii['url']
    try:
        datos = http(url)
    except urllib.error.HTTPError as e:
        if e.code != 429:
            raise
        # Respaldo: miniatura estándar de 1920 px (Wikimedia limita más las descargas de originales).
        print('AVISO: original limitado (429); se usa la miniatura de 1920 px', file=sys.stderr)
        datos = http(info([titulo], 1920)[0]['imageinfo'][0]['thumburl'])
    im = Image.open(io.BytesIO(datos))
    im = ImageOps.exif_transpose(im).convert('RGB')
    rw, rh = (float(x) for x in a.ratio.split(':'))
    fx, fy = (float(x) for x in a.foco.split(','))
    W, H = im.size
    # recorte máximo con la proporción pedida, reducido por zoom
    if W / H > rw / rh:
        ch = H
        cw = H * rw / rh
    else:
        cw = W
        ch = W * rh / rw
    cw, ch = cw / a.zoom, ch / a.zoom
    x0 = min(max(fx * W - cw / 2, 0), W - cw)
    y0 = min(max(fy * H - ch / 2, 0), H - ch)
    im = im.crop((round(x0), round(y0), round(x0 + cw), round(y0 + ch)))
    destino = RAIZ / 'assets' / 'img' / a.grupo
    destino.mkdir(parents=True, exist_ok=True)
    anchos = ANCHOS[a.grupo]
    if im.width < anchos[-1] * 0.8:
        print(f'AVISO: recorte de {im.width}px, menor que el ancho mayor {anchos[-1]}px', file=sys.stderr)
    for w in anchos:
        w2 = min(w, im.width)
        h2 = round(w2 * rh / rw)
        im.resize((w2, h2), Image.LANCZOS).save(destino / f'{a.slot}-{w}.webp', 'WEBP',
                                                 quality=76 if w < 1000 else 74, method=6)
    autor = limpiar(meta.get('Artist', {}).get('value', '')) or 'Desconocido'
    credito = {
        'slot': a.slot, 'grupo': a.grupo, 'alt': a.alt,
        'titulo': titulo[5:], 'autor': autor[:160],
        'licencia': lic[0], 'licenciaUrl': lic[1],
        'fuente': ii['descriptionurl'],
        'cambios': f'Recortada a {a.ratio}, redimensionada y convertida a WebP',
    }
    with open(RAIZ / 'tools' / '.credits.lock', 'w') as candado:
        fcntl.flock(candado, fcntl.LOCK_EX)  # varios procesos pueden registrar a la vez
        creditos = [c for c in cargar_creditos() if not (c['slot'] == a.slot and c['grupo'] == a.grupo)]
        repetida = [c['slot'] for c in creditos if c['titulo'] == credito['titulo']]
        if repetida:
            print('AVISO: esta foto ya se usa en', repetida, file=sys.stderr)
        creditos.append(credito)
        creditos.sort(key=lambda c: (c['grupo'], c['slot']))
        CREDITOS_JSON.write_text(json.dumps(creditos, ensure_ascii=False, indent=1))
        escribir_js(creditos)
    print('ok', destino / f'{a.slot}-{anchos[0]}.webp', f'({im.width}x{im.height} recorte)', autor[:60], lic[0])


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest='cmd', required=True)
    b = sub.add_parser('buscar')
    b.add_argument('consulta')
    b.add_argument('--out', required=True)
    b.add_argument('--n', type=int, default=16)
    b.add_argument('--min', type=int, default=1400)
    u = sub.add_parser('usar')
    u.add_argument('titulo')
    u.add_argument('--slot', required=True)
    u.add_argument('--grupo', required=True, choices=sorted(ANCHOS))
    u.add_argument('--ratio', default='4:3')
    u.add_argument('--foco', default='0.5,0.5')
    u.add_argument('--zoom', type=float, default=1.0)
    u.add_argument('--alt', required=True)
    sub.add_parser('creditos')
    a = ap.parse_args()
    if a.cmd == 'buscar':
        buscar(a)
    elif a.cmd == 'usar':
        usar(a)
    else:
        escribir_js(cargar_creditos())


if __name__ == '__main__':
    main()
