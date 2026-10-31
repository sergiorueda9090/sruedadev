#!/usr/bin/env python3
"""Escribe el SEO estático del sitio a partir de assets/js/config.js (solo biblioteca estándar).

Uso (desde la carpeta maquinaria/):
    python3 tools/seo.py

Hace lo siguiente:
  - index.html, entre <!-- seo:inicio --> y <!-- seo:fin -->: Open Graph, Twitter, canonical y og:url
    (solo si SITE.dominio es https) y datos estructurados JSON-LD (solo si la marca NO es ficticia,
    y únicamente con los datos que estén confirmados en config.js).
  - Texto alternativo de las <img data-foto="grupo/slot"> desde tools/credits.json.
  - robots.txt y sitemap.xml (el sitemap solo lista URLs si hay dominio).

Los rastreadores de redes sociales no ejecutan JavaScript: por eso esto va en el HTML.
Ejecútalo cada vez que cambies config.js o las fotos.
"""
import datetime
import html
import json
import re
from pathlib import Path
from urllib.parse import urlparse

RAIZ = Path(__file__).resolve().parent.parent
CONFIG = RAIZ / 'assets' / 'js' / 'config.js'
CREDITOS = RAIZ / 'tools' / 'credits.json'
INDEX = RAIZ / 'index.html'
ROBOTS = RAIZ / 'robots.txt'
SITEMAP = RAIZ / 'sitemap.xml'
OG_IMAGE = 'assets/img/og-rasante.jpg'
# Páginas indexables (privacidad, créditos y 404 llevan noindex).
PAGINAS = ['']


def js_a_json(src):
    """Convierte el objeto literal de config.js a JSON: quita comentarios, pasa comillas
    simples a dobles, pone comillas a las claves y elimina comas finales."""
    cuerpo = src[src.index('{'):src.rindex('}') + 1]
    partes, codigo, i, n = [], [], 0, len(cuerpo)

    def cerrar_codigo():
        t = re.sub(r'([{,]\s*)([A-Za-z_$][\w$]*)\s*:', r'\1"\2":', ''.join(codigo))
        partes.append(t)
        codigo.clear()

    while i < n:
        c = cuerpo[i]
        if c in '\'"':
            q, j, buf = c, i + 1, []
            while cuerpo[j] != q:
                if cuerpo[j] == '\\':
                    buf.append(cuerpo[j:j + 2])
                    j += 2
                    continue
                buf.append(cuerpo[j])
                j += 1
            texto = ''.join(buf)
            if q == "'":
                texto = texto.replace("\\'", "'").replace('"', '\\"')
            cerrar_codigo()
            partes.append('"' + texto + '"')
            i = j + 1
        elif cuerpo.startswith('//', i):
            i = cuerpo.index('\n', i)
        elif cuerpo.startswith('/*', i):
            i = cuerpo.index('*/', i) + 2
        else:
            codigo.append(c)
            i += 1
    cerrar_codigo()
    s = re.sub(r',(\s*[}\]])', r'\1', ''.join(partes))
    return json.loads(s)


def https(url):
    try:
        u = urlparse(url or '')
        return u.scheme == 'https' and bool(u.netloc)
    except ValueError:
        return False


def jsonld(site, dominio):
    """Organization/LocalBusiness solo con datos confirmados en config.js."""
    marca = site.get('marca', {})
    c = site.get('contacto', {})
    data = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness' if c.get('ciudad') else 'Organization',
        'name': f"{marca.get('nombre', '')} {marca.get('complemento', '')}".strip(),
        'description': 'Alquiler de maquinaria pesada, vehículos de carga y equipos para obra.',
        'url': dominio,
        'logo': dominio + 'assets/icons/logo.png',
        'image': dominio + OG_IMAGE,
    }
    if c.get('telefono'):
        data['telephone'] = c['telefono']
    if c.get('email'):
        data['email'] = c['email']
    if c.get('ciudad'):
        data['address'] = {'@type': 'PostalAddress', 'addressLocality': c['ciudad'], 'addressCountry': 'CO'}
        if c.get('departamento'):
            data['address']['addressRegion'] = c['departamento']
        if c.get('direccion'):
            data['address']['streetAddress'] = c['direccion']
    if site.get('cobertura'):
        data['areaServed'] = site['cobertura']
    redes = [u for u in site.get('redes', {}).values() if https(u)]
    if redes:
        data['sameAs'] = redes
    return data


def bloque_seo(site):
    marca = site.get('marca', {})
    nombre = f"{marca.get('nombre', '')} {marca.get('complemento', '')}".strip()
    dominio = site.get('dominio', '')
    dominio = dominio if https(dominio) else ''
    if dominio and not dominio.endswith('/'):
        dominio += '/'
    img = (dominio + OG_IMAGE) if dominio else OG_IMAGE
    e = html.escape
    lineas = [
        '<meta property="og:type" content="website">',
        '<meta property="og:locale" content="es_CO">',
        f'<meta property="og:site_name" content="{e(nombre)}">',
        f'<meta property="og:title" content="{e(marca.get("nombre", ""))} | Maquinaria pesada, vehículos de carga y equipos para obra">',
        '<meta property="og:description" content="Consulta disponibilidad y solicita cotización de maquinaria pesada, vehículos de carga, grúas y equipos de concreto.">',
        f'<meta property="og:image" content="{e(img)}">',
        '<meta property="og:image:width" content="1200">',
        '<meta property="og:image:height" content="630">',
        '<meta name="twitter:card" content="summary_large_image">',
    ]
    if dominio:
        lineas.insert(0, f'<link rel="canonical" href="{e(dominio)}">')
        lineas.insert(2, f'<meta property="og:url" content="{e(dominio)}">')
    if marca.get('ficticia'):
        lineas.append('<!-- JSON-LD omitido: la marca es ficticia (config.js → marca.ficticia). -->')
    elif dominio:
        datos = json.dumps(jsonld(site, dominio), ensure_ascii=False, indent=2).replace('</', '<\\/')
        lineas.append('<script type="application/ld+json">\n' + datos + '\n  </script>')
    else:
        lineas.append('<!-- JSON-LD omitido: falta SITE.dominio. -->')
    return dominio, '\n  '.join(lineas)


def sincronizar_alts(texto):
    if not CREDITOS.exists():
        return texto, 0
    alts = {f"{c['grupo']}/{c['slot']}": c['alt'] for c in json.loads(CREDITOS.read_text())}
    cambios = 0

    def reemplazo(m):
        nonlocal cambios
        etiqueta = m.group(0)
        clave = re.search(r'data-foto="([^"]+)"', etiqueta).group(1)
        if clave not in alts:
            print('  sin crédito para', clave)
            return etiqueta
        nueva = re.sub(r'alt="[^"]*"', 'alt="' + html.escape(alts[clave], quote=True) + '"', etiqueta)
        cambios += nueva != etiqueta
        return nueva

    return re.sub(r'<img\b[^>]*data-foto="[^"]+"[^>]*>', reemplazo, texto, flags=re.S), cambios


def main():
    site = js_a_json(CONFIG.read_text(encoding='utf-8'))
    dominio, bloque = bloque_seo(site)
    texto = INDEX.read_text(encoding='utf-8')
    texto = re.sub(r'(<!-- seo:inicio[^>]*-->\n  ).*?(\n  <!-- seo:fin -->)',
                   lambda m: m.group(1) + bloque + m.group(2), texto, flags=re.S)
    texto, n_alts = sincronizar_alts(texto)
    INDEX.write_text(texto, encoding='utf-8')

    robots = 'User-agent: *\nAllow: /\nDisallow: /tools/\n'
    if dominio:
        robots += f'\nSitemap: {dominio}sitemap.xml\n'
    ROBOTS.write_text(robots, encoding='utf-8')

    hoy = datetime.date.today().isoformat()
    urls = ''.join(f'  <url><loc>{html.escape(dominio + p)}</loc><lastmod>{hoy}</lastmod></url>\n'
                   for p in PAGINAS) if dominio else ''
    aviso = '' if dominio else '  <!-- Vacío: configure SITE.dominio en assets/js/config.js y ejecute tools/seo.py -->\n'
    SITEMAP.write_text('<?xml version="1.0" encoding="UTF-8"?>\n'
                       '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                       f'{aviso}{urls}</urlset>\n', encoding='utf-8')

    print('SEO escrito.', 'Dominio:', dominio or '(sin dominio)', '| alts actualizados:', n_alts)
    if site.get('modo') == 'publicacion' and site.get('marca', {}).get('ficticia'):
        print('AVISO: modo publicación con marca ficticia. Cambie marca.ficticia cuando tenga el nombre real.')


if __name__ == '__main__':
    main()
