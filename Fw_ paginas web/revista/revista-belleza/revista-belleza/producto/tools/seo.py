#!/usr/bin/env python3
"""Aplica el dominio definitivo de assets/js/config.js (campo «dominio») a todas las
páginas: <link rel="canonical">, og:url, og:image y las URL de los JSON-LD; y regenera
sitemap.xml y robots.txt. Ejecutar tras cambiar el dominio:  python3 tools/seo.py
"""
import re
from datetime import date
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CONFIG = (RAIZ / 'assets' / 'js' / 'config.js').read_text()
DOMINIO = re.search(r"dominio:\s*'([^']+)'", CONFIG).group(1).rstrip('/')
PAGINAS = [RAIZ / 'index.html', RAIZ / '404.html', *sorted((RAIZ / 'pages').glob('*.html'))]
SIN_INDEXAR = {'404.html', 'carrito.html', 'checkout.html'}


def url_de(f):
    rel = f.relative_to(RAIZ).as_posix()
    return f'{DOMINIO}/' if rel == 'index.html' else f'{DOMINIO}/{rel}'


def main():
    for f in PAGINAS:
        html = f.read_text()
        u = url_de(f)
        html = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{u}">', html)
        html = re.sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{u}">', html)
        html = re.sub(r'<meta property="og:image" content="[^"]*">', f'<meta property="og:image" content="{DOMINIO}/assets/images/og.jpg">', html)
        # URL absolutas dentro de los JSON-LD (WebSite y BreadcrumbList)
        html = re.sub(r'"(url|item|target)": "https?://[^/"]+', lambda m: f'"{m.group(1)}": "{DOMINIO}', html)
        f.write_text(html)
    hoy = date.today().isoformat()
    urls = [url_de(f) for f in PAGINAS if f.name not in SIN_INDEXAR]
    (RAIZ / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + ''.join(f'  <url><loc>{u}</loc><lastmod>{hoy}</lastmod></url>\n' for u in urls) + '</urlset>\n')
    (RAIZ / 'robots.txt').write_text(f'User-agent: *\nAllow: /\nDisallow: /tools/\n\nSitemap: {DOMINIO}/sitemap.xml\n')
    print(f'Dominio aplicado: {DOMINIO} ({len(PAGINAS)} páginas, {len(urls)} URL en el sitemap)')


if __name__ == '__main__':
    main()
