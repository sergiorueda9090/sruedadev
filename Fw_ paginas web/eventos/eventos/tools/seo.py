#!/usr/bin/env python3
"""Escribe canonical, og:url, og:image absoluta y sitemap.xml a partir de
`sitioBase` en assets/js/config.js (solo stdlib).

Mientras `sitioBase` esté vacío (no hay dominio definitivo), quita canonical y
og:url, deja og:image relativa y borra sitemap.xml: no se inventa un dominio.

Uso (desde la carpeta eventos/):  python3 tools/seo.py
"""
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
PAGINAS = ['index.html', 'villa-jardin.html', 'finca-la-cruz.html', 'alquieventos.html']


def sitio_base():
    config = (RAIZ / 'assets' / 'js' / 'config.js').read_text(encoding='utf-8')
    m = re.search(r"sitioBase:\s*'([^']*)'", config)
    base = (m.group(1).strip() if m else '')
    if base and not base.startswith('https://'):
        raise SystemExit(f'sitioBase debe empezar por https:// (actual: {base!r})')
    return base.rstrip('/') + '/' if base else ''


def actualizar(pagina, base):
    ruta = RAIZ / pagina
    html = ruta.read_text(encoding='utf-8')
    html = re.sub(r'\n\s*<link rel="canonical"[^>]*>', '', html)
    html = re.sub(r'\n\s*<meta property="og:url"[^>]*>', '', html)
    html = re.sub(r'(<meta property="og:image" content=")[^"]*?(assets/[^"]+")',
                  lambda m: m.group(1) + base + m.group(2), html)
    if base:
        url = base if pagina == 'index.html' else base + pagina
        etiquetas = (f'\n  <link rel="canonical" href="{url}">'
                     f'\n  <meta property="og:url" content="{url}">')
        html = re.sub(r'(<meta name="description"[^>]*>)', lambda m: m.group(1) + etiquetas, html, count=1)
    ruta.write_text(html, encoding='utf-8')
    return url if base else '(sin canonical)'


def main():
    base = sitio_base()
    for pagina in PAGINAS:
        print(pagina, '→', actualizar(pagina, base))
    mapa = RAIZ / 'sitemap.xml'
    if base:
        urls = ''.join(f'  <url><loc>{base if p == "index.html" else base + p}</loc></url>\n' for p in PAGINAS)
        mapa.write_text('<?xml version="1.0" encoding="UTF-8"?>\n'
                        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                        f'{urls}</urlset>\n', encoding='utf-8')
        print('sitemap.xml escrito')
    elif mapa.exists():
        mapa.unlink()
        print('sitemap.xml eliminado (sin sitioBase)')


if __name__ == '__main__':
    main()
