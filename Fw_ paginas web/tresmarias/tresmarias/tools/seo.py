#!/usr/bin/env python3
"""Escribe el SEO estático del sitio a partir de assets/js/config.js.

Uso (desde la carpeta tresmarias/):
    python3 tools/seo.py

Solo usa la biblioteca estándar. Escribe:
  - En index.html, entre <!-- seo:inicio --> y <!-- seo:fin -->: og:image, twitter:image,
    datos estructurados JSON-LD (LodgingBusiness) y, si hay dominio, canonical y og:url.
  - sitemap.xml y la línea Sitemap de robots.txt, solo si TM.dominio tiene un dominio https.

Los rastreadores de redes sociales no ejecutan JavaScript: por eso esto va en el HTML.
Los datos estructurados solo incluyen lo que también se muestra en la página.
Ejecútalo cada vez que cambies config.js.
"""
import datetime
import json
import re
from pathlib import Path
from urllib.parse import urlparse

RAIZ = Path(__file__).resolve().parent.parent
CONFIG = RAIZ / 'assets' / 'js' / 'config.js'
INDEX = RAIZ / 'index.html'
ROBOTS = RAIZ / 'robots.txt'
SITEMAP = RAIZ / 'sitemap.xml'
OG_IMAGE = 'assets/images/og-tres-marias.jpg'
# Páginas indexables. privacidad, condiciones y 404 llevan noindex y no van al sitemap.
PAGINAS = [('', INDEX)]


def js_a_json(src):
    """Convierte el objeto literal de config.js a JSON: quita comentarios, pasa comillas
    simples a dobles, pone comillas a las claves y elimina comas finales."""
    cuerpo = src[src.index('{'):src.rindex('}') + 1]
    partes, codigo, i, n = [], [], 0, len(cuerpo)

    def cerrar_codigo():
        # Claves sin comillas y comas finales: solo fuera de las cadenas.
        t = re.sub(r'([{,]\s*)([A-Za-z_$][\w$]*)\s*:', r'\1"\2":', ''.join(codigo))
        partes.append(t); codigo.clear()

    while i < n:
        c = cuerpo[i]
        if c in '\'"':
            q, j, buf = c, i + 1, []
            while cuerpo[j] != q:
                if cuerpo[j] == '\\':
                    buf.append(cuerpo[j:j + 2]); j += 2; continue
                buf.append(cuerpo[j]); j += 1
            texto = ''.join(buf)
            if q == "'":
                texto = texto.replace("\\'", "'").replace('"', '\\"')
            cerrar_codigo(); partes.append('"' + texto + '"'); i = j + 1
        elif cuerpo.startswith('//', i):
            i = cuerpo.index('\n', i)
        elif cuerpo.startswith('/*', i):
            i = cuerpo.index('*/', i) + 2
        else:
            codigo.append(c); i += 1
    cerrar_codigo()
    s = re.sub(r',(\s*[}\]])', r'\1', ''.join(partes))
    return json.loads(s)


def https(url):
    try:
        u = urlparse(url)
        return u.scheme == 'https' and bool(u.netloc)
    except ValueError:
        return False


def jsonld(tm, dominio):
    attrs = {a['clave']: a['valor'] for a in tm.get('atributos', []) if a.get('valor')}
    ubi = tm.get('ubicacion', {})
    data = {
        '@context': 'https://schema.org',
        '@type': 'LodgingBusiness',
        'name': tm.get('nombre', 'Cabaña Las Tres Marías'),
        'description': 'Cabaña de tres habitaciones con chimenea en Berlín, corregimiento de Tona (Santander, Colombia), '
                       'para descansar y conocer el páramo y la alta montaña santandereana.',
        'address': {
            '@type': 'PostalAddress',
            'addressLocality': 'Berlín, Tona',
            'addressRegion': 'Santander',
            'addressCountry': 'CO',
        },
    }
    if ubi.get('confirmada') and ubi.get('direccion'):
        data['address']['streetAddress'] = ubi['direccion']
    if attrs.get('habitaciones', '').isdigit():
        data['numberOfRooms'] = int(attrs['habitaciones'])
    servicios = [('wifi', 'Wi-Fi'), ('parqueadero', 'Parqueadero'), ('chimenea', 'Chimenea'),
                 ('cocina', 'Cocina'), ('aguaCaliente', 'Agua caliente')]
    feats = [{'@type': 'LocationFeatureSpecification', 'name': nombre, 'value': True}
             for clave, nombre in servicios if attrs.get(clave)]
    if 'balc' in attrs.get('exteriores', '').lower():
        feats.append({'@type': 'LocationFeatureSpecification', 'name': 'Balcón', 'value': True})
    if 'patio' in attrs.get('exteriores', '').lower():
        feats.append({'@type': 'LocationFeatureSpecification', 'name': 'Patio', 'value': True})
    if feats:
        data['amenityFeature'] = feats
    if isinstance(tm.get('capacidadMaxima'), int):
        data['maximumAttendeeCapacity'] = tm['capacidadMaxima']
    if isinstance(ubi.get('lat'), (int, float)) and isinstance(ubi.get('lng'), (int, float)):
        data['geo'] = {'@type': 'GeoCoordinates', 'latitude': ubi['lat'], 'longitude': ubi['lng']}
    numero = re.sub(r'\D', '', str(tm.get('whatsapp', '')))
    if len(numero) >= 10:
        data['telephone'] = '+' + numero
    redes = [u for u in (tm.get('redes') or {}).values() if u and https(u)]
    if redes:
        data['sameAs'] = redes
    if dominio:
        data['url'] = dominio + '/'
        data['image'] = dominio + '/' + OG_IMAGE
    return data


def bloque_head(tm, dominio):
    img = (dominio + '/' if dominio else '') + OG_IMAGE
    lineas = []
    if dominio:
        lineas += [f'  <link rel="canonical" href="{dominio}/">', f'  <meta property="og:url" content="{dominio}/">']
    lineas += [f'  <meta property="og:image" content="{img}">', f'  <meta name="twitter:image" content="{img}">']
    ld = json.dumps(jsonld(tm, dominio), ensure_ascii=False, indent=2).replace('</', '<\\/')
    lineas.append('  <script type="application/ld+json">\n' + '\n'.join('  ' + l for l in ld.splitlines()) + '\n  </script>')
    return '\n'.join(lineas)


def main():
    tm = js_a_json(CONFIG.read_text(encoding='utf-8'))
    dominio = tm.get('dominio', '').rstrip('/')
    if dominio and not https(dominio):
        raise SystemExit(f'TM.dominio debe empezar por https:// ({dominio!r})')

    texto = INDEX.read_text(encoding='utf-8')
    nuevo, n = re.subn(r'(<!-- seo:inicio[^>]*-->).*?(\s*<!-- seo:fin -->)',
                       lambda m: m.group(1) + '\n' + bloque_head(tm, dominio) + m.group(2), texto, flags=re.S)
    if not n:
        raise SystemExit('No se encontraron los marcadores seo:inicio / seo:fin en index.html')
    INDEX.write_text(nuevo, encoding='utf-8')

    robots = ['User-agent: *', 'Allow: /', '']
    if dominio:
        urls = []
        for ruta, archivo in PAGINAS:
            # lastmod = fecha real de la última modificación del archivo.
            fecha = datetime.date.fromtimestamp(archivo.stat().st_mtime).isoformat()
            urls.append(f'  <url>\n    <loc>{dominio}/{ruta}</loc>\n    <lastmod>{fecha}</lastmod>\n  </url>')
        SITEMAP.write_text('<?xml version="1.0" encoding="UTF-8"?>\n'
                           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                           + '\n'.join(urls) + '\n</urlset>\n', encoding='utf-8')
        robots.append(f'Sitemap: {dominio}/sitemap.xml')
        print(f'canonical, Open Graph, JSON-LD y sitemap.xml escritos para {dominio}')
    else:
        robots += ['# Al definir TM.dominio en config.js y ejecutar tools/seo.py se añade aquí la línea Sitemap.']
        print('Sin dominio: se escribió el JSON-LD y Open Graph relativo. Sin canonical ni sitemap.xml.')
    ROBOTS.write_text('\n'.join(robots) + '\n', encoding='utf-8')


if __name__ == '__main__':
    main()
