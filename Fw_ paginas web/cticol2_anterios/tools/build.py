#!/usr/bin/env python3
"""Genera el sitio estático de CTICOL a partir de datos/*.json.

    python3 tools/build.py                       # usa el modo de datos/sitio.json
    python3 tools/build.py --modo publicacion    # fuerza un modo sin editar el JSON

Escribe en la raíz del proyecto: las páginas .html, assets/js/config.js, sitemap.xml y robots.txt.
NO edite los .html generados: edite datos/ o este archivo y vuelva a ejecutarlo.

Modo 'revision'    → muestra todo; lo no confirmado lleva la marca «Por confirmar» o «Texto provisional».
Modo 'publicacion' → omite lo no confirmado (confirmado/aprobado/enFlota en false, campos vacíos).

Requiere Python 3.8+ y Pillow (solo para leer el tamaño de las imágenes).
"""
import datetime
import html
import json
import re
import sys
from pathlib import Path
from urllib.parse import quote

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
DATOS = RAIZ / 'datos'
IMG = RAIZ / 'assets' / 'img'

S = json.loads((DATOS / 'sitio.json').read_text(encoding='utf-8'))
SERVICIOS = json.loads((DATOS / 'servicios.json').read_text(encoding='utf-8'))['servicios']
FLOTA = json.loads((DATOS / 'flota.json').read_text(encoding='utf-8'))
PROYECTOS = json.loads((DATOS / 'proyectos.json').read_text(encoding='utf-8'))
MAPA = json.loads((DATOS / 'mapa.json').read_text(encoding='utf-8'))

if '--modo' in sys.argv:
    S['modo'] = sys.argv[sys.argv.index('--modo') + 1]
REVISION = S['modo'] != 'publicacion'
MARCA = S['marca']
C = S['contacto']
DOMINIO = MARCA['dominio'].rstrip('/')
ANIO = datetime.date.today().year
ANIOS = ANIO - MARCA['fundacion'] if MARCA.get('fundacion') else None
VERSION = '10'  # súbalo al cambiar CSS/JS para invalidar la caché del navegador

CDN = {
    'bootstrap': ('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
                  'sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH'),
    'icons': ('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
              'sha384-XGjxtQfXaH2tnPFa9x+ruJTuLE3Aa6LhHSWRr1XeTyhezb4abCG4ccI5AkVDxqC+'),
    'swipercss': ('https://cdn.jsdelivr.net/npm/swiper@11.1.14/swiper-bundle.min.css',
                  'sha384-IFb872aCXZQb6BKRUHmGn0YHKnFl4ylZjkgVRRyMTEQ5bjo/H6xFUiLJm6opOO66'),
    'swiper': ('https://cdn.jsdelivr.net/npm/swiper@11.1.14/swiper-bundle.min.js',
               'sha384-JiF4eFN9V3I2Fry7TzFM3XKdq0P3abiVxpOeHjGz4cwvas+uNg6pFWVmuD6MKXqG'),
    'gsap': ('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js',
             'sha384-HOvlOYPIs/zjoIkWUGXkVmXsjr8GuZLV+Q+rcPwmJOVZVpvTSXQChiN4t9Euv9Vc'),
    'scrolltrigger': ('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js',
                      'sha384-P8VzCVnT9NBUkMrpcIZrJbA7EBjJvh/fJS6PmP+4nLIM284DtsImIv8D0fFjIkeh'),
}


# ---------------------------------------------------------------- utilidades

def e(texto):
    return html.escape(str(texto), quote=True)


def visible(item, campo='confirmado'):
    """Un elemento se muestra en revisión siempre; al publicar solo si está confirmado."""
    if isinstance(item, str):
        return True
    return REVISION or item.get(campo, True)


def texto_de(item):
    return item if isinstance(item, str) else item['texto']


def pendiente(item, campo='confirmado'):
    return isinstance(item, dict) and not item.get(campo, True)


def tag(etiqueta='Por confirmar'):
    return f'<span class="tag-pend">{e(etiqueta)}</span>' if REVISION else ''


def wa_link(mensaje=None, numero=None):
    linea = next((w for w in C['whatsapp'] if w.get('cotizaciones')), C['whatsapp'][0] if C['whatsapp'] else None)
    numero = numero or (linea['numero'] if linea else '')
    if not numero:
        return ''
    return f"https://wa.me/{numero}?text={quote(mensaje or S['whatsappMensaje'])}"


_tamanos = {}


def variantes(base):
    """Anchos disponibles de assets/img/<base>-<ancho>.webp, de menor a mayor."""
    archivos = sorted(IMG.glob(f'{base}-*.webp'), key=lambda p: int(p.stem.rsplit('-', 1)[1]))
    if not archivos:
        raise SystemExit(f'Falta la imagen {base}: ejecute python3 tools/imagenes.py')
    return [(int(p.stem.rsplit('-', 1)[1]), p) for p in archivos]


def tamano(path):
    if path not in _tamanos:
        with Image.open(path) as im:
            _tamanos[path] = im.size
    return _tamanos[path]


def img(base, alt, sizes='100vw', cls='', carga='lazy', extra=''):
    vs = variantes(base)
    ancho, mayor = vs[-1]
    w, h = tamano(mayor)
    media = next((v for v in vs if v[0] >= 960), vs[-1])
    srcset = ', '.join(f'assets/img/{base}-{a}.webp {a}w' for a, _ in vs)
    prioridad = ' fetchpriority="high"' if carga == 'eager' else ''
    clase = f' class="{cls}"' if cls else ''
    return (f'<img{clase} src="assets/img/{base}-{media[0]}.webp" srcset="{srcset}" sizes="{sizes}" '
            f'width="{w}" height="{h}" alt="{e(alt)}" loading="{carga}" decoding="async"{prioridad}{extra}>')


def img_src(base, minimo=960):
    vs = variantes(base)
    return f"assets/img/{base}-{next((a for a, _ in vs if a >= minimo), vs[-1][0])}.webp"


def lista(items, cls='check-list'):
    lis = []
    for it in items:
        if not visible(it):
            continue
        marca = tag() if pendiente(it) else ''
        lis.append(f'<li>{e(texto_de(it))}{marca}</li>')
    return f'<ul class="{cls}">' + ''.join(lis) + '</ul>' if lis else ''


def tel_href(numero):
    return f'tel:+{numero}'


# ---------------------------------------------------------------- piezas comunes

AC_PAGE = ' aria-current="page"'
AC_TRUE = ' aria-current="true"'

NAV = [
    ('index.html', 'Inicio'),
    ('nosotros.html', 'Nosotros'),
    ('servicios.html', 'Servicios'),
    ('flota.html', 'Nuestra flota'),
    ('proyectos.html', 'Proyectos'),
    ('cobertura.html', 'Cobertura'),
    ('contacto.html', 'Contacto'),
]

def anios(texto):
    return texto.replace('{anios}', str(ANIOS)) if ANIOS is not None else texto


def linea_wa(area):
    return next((w for w in C['whatsapp'] if w['area'].lower() == area.lower()), None)


def rastreo_link(cls, contenido):
    """Enlace «Rastrear envío»: a la plataforma si tiene URL; si no, a rastreo.html (consulta por WhatsApp)."""
    url = S.get('rastreo', {}).get('url', '')
    if url.startswith('https://'):
        return (f'<a class="{cls}" href="{e(url)}" target="_blank" rel="noopener">{contenido}'
                '<span class="visually-hidden"> (se abre en una pestaña nueva)</span></a>')
    return f'<a class="{cls}" href="rastreo.html">{contenido}</a>'


def respaldo_html(cls=''):
    items = [r for r in S.get('respaldo', {}).get('items', []) if visible(r)]
    if not items:
        return ''
    lis = ''.join(f'<li data-reveal-item><i class="bi bi-{r["icono"]}" aria-hidden="true"></i>'
                  f'<h3>{e(r["nombre"])}{tag() if pendiente(r) else ""}</h3><p>{e(r["texto"])}</p></li>' for r in items)
    return f'<ul class="backing {cls}">{lis}</ul>'


def mv_visible():
    inst = S['institucional']
    return any(visible(inst[k], 'aprobado') for k in ('mision', 'vision'))


def submenu(href):
    """Entradas (activo, nombre, icono) del submenú de un elemento del menú principal."""
    if href == 'servicios.html':
        return [('serv:' + s['id'], s['nombre'], s['icono']) for s in SERVICIOS]
    if href == 'nosotros.html' and mv_visible():
        return [('nosotros.html', 'Quiénes somos', 'building'), ('mision-vision.html', 'Misión y visión', 'bullseye')]
    return []


LOGO = ('<svg class="brand-mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false">'
        '<rect width="40" height="40" rx="7" fill="#F36B21"/>'
        '<path d="M5 17h8l3 7h12l2-4h5" fill="none" stroke="#0B1928" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>'
        '<rect x="17" y="11" width="10" height="9" rx="1.2" fill="#0B1928"/>'
        '<circle cx="10" cy="29" r="3" fill="#0B1928"/><circle cx="31" cy="29" r="3" fill="#0B1928"/>'
        '</svg>')


def header(activo):
    tel = C['telefonoPrincipal']
    items = []
    for href, nombre in NAV:
        subs = submenu(href)
        actual = AC_PAGE if href == activo or any(activo == a for a, _, _ in subs) else ''
        if subs:
            clave = href.replace('.html', '')
            lis = ''.join(f'<li><a href="{h}"{AC_PAGE if activo == a else ""}><i class="bi bi-{i}" aria-hidden="true"></i>{e(n)}</a></li>'
                          for a, n, i in subs for h in [a.replace('serv:', '') + ('.html' if a.startswith('serv:') else '')])
            items.append(
                f'<li class="has-sub"><a href="{href}"{actual}>{nombre}</a>'
                f'<button class="sub-toggle" type="button" aria-expanded="false" aria-controls="sub-{clave}">'
                f'<i class="bi bi-chevron-down" aria-hidden="true"></i><span class="visually-hidden">Ver las páginas de {e(nombre)}</span></button>'
                f'<ul class="sub" id="sub-{clave}">{lis}</ul></li>')
        else:
            items.append(f'<li><a href="{href}"{actual}>{nombre}</a></li>')
    aviso = ''
    if REVISION:
        aviso = ('<div class="review-bar" role="note"><div class="container">'
                 '<strong>Modo revisión.</strong> Lo marcado «Por confirmar» o «Texto provisional» se oculta al publicar. '
                 'Las fotos son de referencia.</div></div>')
    desp = linea_wa(S.get('rastreo', {}).get('lineaWhatsapp', 'Despachos'))
    info = []
    if desp:
        info.append(f'<li><i class="bi bi-whatsapp" aria-hidden="true"></i>{e(desp["area"])}: '
                    f'<a href="https://wa.me/{desp["numero"]}" target="_blank" rel="noopener">{e(desp["mostrar"])}</a></li>')
    if C['correo']:
        info.append(f'<li><i class="bi bi-envelope" aria-hidden="true"></i><a href="mailto:{e(C["correo"])}">{e(C["correo"])}</a></li>')
    if ANIOS:
        info.append(f'<li class="topbar-exp"><i class="bi bi-award" aria-hidden="true"></i>Desde {MARCA["fundacion"]} en el mercado</li>')
    topbar = (f'<div class="topbar"><div class="container topbar-row"><ul class="topbar-info">{"".join(info)}</ul>'
              + rastreo_link('topbar-track', '<i class="bi bi-geo-alt-fill" aria-hidden="true"></i>Rastrear envío')
              + '</div></div>')
    return f'''<a class="skip-link" href="#contenido">Saltar al contenido</a>
{aviso}
{topbar}
<header class="site-header" data-header>
  <div class="container header-row">
    <a class="brand" href="index.html" aria-label="{e(MARCA['nombre'])}, ir al inicio">{LOGO}<span class="brand-text"><strong>{e(MARCA['nombre'])}</strong><small>{e(MARCA['descriptor'])}</small></span></a>
    <nav class="main-nav" id="menu-principal" aria-label="Principal" data-nav>
      <ul class="nav-list">{''.join(items)}</ul>
      <div class="nav-extra">
        <a class="nav-phone" href="{tel_href(tel['numero'])}"><i class="bi bi-telephone" aria-hidden="true"></i>{e(tel['mostrar'])}</a>
        <a class="btn-cta" href="contacto.html#cotizar">Solicitar cotización</a>
        {rastreo_link('btn-line', '<i class="bi bi-geo-alt-fill" aria-hidden="true"></i>Rastrear envío')}
        {redes_html('social--menu')}
      </div>
    </nav>
    <div class="header-actions">
      <a class="header-phone" href="{tel_href(tel['numero'])}"><i class="bi bi-telephone" aria-hidden="true"></i><span><small>{e(tel['area'])}</small>{e(tel['mostrar'])}</span></a>
      <a class="btn-cta btn-cta--header" href="contacto.html#cotizar">Solicitar cotización</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="menu-principal" data-nav-toggle>
        <span class="nav-toggle-bars" aria-hidden="true"></span><span class="visually-hidden">Abrir menú</span>
      </button>
    </div>
  </div>
  <div class="hazard" aria-hidden="true"></div>
</header>'''


REDES = [('facebook', 'Facebook'), ('instagram', 'Instagram'), ('linkedin', 'LinkedIn'),
         ('youtube', 'YouTube'), ('tiktok', 'TikTok'), ('twitter-x', 'X')]


def redes_html(cls=''):
    """Fila de iconos de redes sociales.

    Red con URL https → enlace. Red vacía → en revisión, icono atenuado «Por configurar» (sin enlace);
    al publicar se omite. WhatsApp (línea de cotizaciones) se añade siempre que exista.
    """
    items, configuradas = [], 0
    for clave, nombre in REDES:
        url = S['redes'].get(clave, '')
        if url.startswith('https://'):
            configuradas += 1
            items.append(f'<li><a class="social-btn social-btn--{clave}" href="{e(url)}" target="_blank" rel="noopener" title="{nombre}">'
                         f'<i class="bi bi-{clave}" aria-hidden="true"></i><span class="visually-hidden">{nombre} de {e(MARCA["nombre"])} (se abre en una pestaña nueva)</span></a></li>')
        elif REVISION:
            items.append(f'<li><span class="social-btn social-btn--off" title="{nombre}: por configurar">'
                         f'<i class="bi bi-{clave}" aria-hidden="true"></i><span class="visually-hidden">{nombre}: por configurar</span></span></li>')
    wa = wa_link()
    if wa:
        items.append(f'<li><a class="social-btn social-btn--whatsapp" href="{e(wa)}" target="_blank" rel="noopener" title="WhatsApp">'
                     f'<i class="bi bi-whatsapp" aria-hidden="true"></i><span class="visually-hidden">WhatsApp de {e(MARCA["nombre"])} (se abre en una pestaña nueva)</span></a></li>')
    if not items:
        return ''
    nota = ''
    if REVISION and configuradas < len(REDES):
        nota = '<p class="social-note">Los iconos atenuados se activan al configurar su URL en <code>datos/sitio.json</code> → <code>redes</code>.</p>'
    return f'<ul class="social {cls}" aria-label="Redes sociales">{"".join(items)}</ul>{nota}'


def contacto_lineas(cls='foot-contact'):
    t = C['telefonoPrincipal']
    filas = [f'<li><i class="bi bi-telephone" aria-hidden="true"></i><span><small>{e(t["area"])}</small>'
             f'<a href="{tel_href(t["numero"])}">{e(t["mostrar"])}</a></span></li>']
    for w in C['whatsapp']:
        filas.append(f'<li><i class="bi bi-whatsapp" aria-hidden="true"></i><span><small>WhatsApp {e(w["area"])}</small>'
                     f'<a href="https://wa.me/{w["numero"]}" target="_blank" rel="noopener">{e(w["mostrar"])}</a></span></li>')
    if C['correo']:
        filas.append(f'<li><i class="bi bi-envelope" aria-hidden="true"></i><span><small>Correo</small>'
                     f'<a href="mailto:{e(C["correo"])}">{e(C["correo"])}</a></span></li>')
    if C['direccion']:
        filas.append(f'<li><i class="bi bi-geo-alt" aria-hidden="true"></i><span><small>Dirección</small>{e(C["direccion"])}'
                     f'{", " + e(C["ciudad"]) if C["ciudad"] else ""}</span></li>')
    elif REVISION and C['direccionNota']:
        filas.append(f'<li><i class="bi bi-geo-alt" aria-hidden="true"></i><span><small>Dirección</small>{e(C["direccionNota"])}</span></li>')
    if C['horario']:
        filas.append(f'<li><i class="bi bi-clock" aria-hidden="true"></i><span><small>Horario</small>{e(C["horario"])}</span></li>')
    elif REVISION:
        filas.append(f'<li><i class="bi bi-clock" aria-hidden="true"></i><span><small>Horario</small>Por confirmar</span></li>')
    return f'<ul class="{cls}">' + ''.join(filas) + '</ul>'


def footer():
    serv = ''.join(f'<li><a href="{s["id"]}.html">{e(s["nombre"])}</a></li>' for s in SERVICIOS)
    enlaces = list(NAV)
    if mv_visible():
        enlaces.insert(2, ('mision-vision.html', 'Misión y visión'))
    if not S.get('rastreo', {}).get('url', '').startswith('https://'):
        enlaces.append(('rastreo.html', 'Rastrear envío'))
    emp = ''.join(f'<li><a href="{h}">{n}</a></li>' for h, n in enlaces)
    legal_id = ' · '.join(x for x in [MARCA['razonSocial'], f"NIT {MARCA['nit']}" if MARCA['nit'] else ''] if x)
    redes = redes_html('social--foot')
    col_redes = f'<div class="foot-col"><h2 class="foot-h">Síganos</h2>{redes}</div>' if redes else ''
    return f'''<footer class="site-footer">
  <div class="hazard" aria-hidden="true"></div>
  <div class="container foot-grid">
    <div class="foot-col foot-brand">
      <a class="brand" href="index.html" aria-label="{e(MARCA['nombre'])}, ir al inicio">{LOGO}<span class="brand-text"><strong>{e(MARCA['nombre'])}</strong><small>{e(MARCA['descriptor'])}</small></span></a>
      <p>{e(MARCA['resumen'])}</p>
      {f'<p class="foot-muted">{e(legal_id)}</p>' if legal_id else ''}
    </div>
    <div class="foot-col"><h2 class="foot-h">Empresa</h2><ul class="foot-links">{emp}</ul></div>
    <div class="foot-col"><h2 class="foot-h">Servicios</h2><ul class="foot-links">{serv}</ul></div>
    <div class="foot-col"><h2 class="foot-h">Contacto</h2>{contacto_lineas()}</div>
    {col_redes}
  </div>
  <div class="foot-bottom">
    <div class="container foot-bottom-row">
      <p>© {ANIO} {e(MARCA['razonSocial'] or MARCA['nombre'])}. Todos los derechos reservados.</p>
      <ul class="foot-legal">
        <li><a href="privacidad.html">Política de privacidad</a></li>
        <li><a href="privacidad.html#tratamiento">Tratamiento de datos personales</a></li>
        <li><a href="terminos.html">Términos y condiciones</a></li>
      </ul>
    </div>
  </div>
</footer>
{wa_float()}'''


def wa_float():
    url = wa_link()
    if not url:
        return ''
    return (f'<a class="wa-float" href="{e(url)}" target="_blank" rel="noopener" data-wa-float>'
            f'<i class="bi bi-whatsapp" aria-hidden="true"></i><span class="wa-float-label">Escríbanos</span>'
            f'<span class="visually-hidden"> por WhatsApp (se abre en una pestaña nueva)</span></a>')


def jsonld_org():
    org = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': MARCA['razonSocial'] or MARCA['nombre'],
        'alternateName': MARCA['nombre'],
        'description': MARCA['resumen'],
        'email': C['correo'] or None,
        'telephone': '+' + C['telefonoPrincipal']['numero'],
        'areaServed': {'@type': 'Country', 'name': 'Colombia'},
        'contactPoint': [{'@type': 'ContactPoint', 'telephone': '+' + w['numero'],
                          'contactType': 'sales' if w.get('cotizaciones') else 'customer service',
                          'availableLanguage': 'es', 'areaServed': 'CO'} for w in C['whatsapp']],
    }
    if DOMINIO:
        org['url'] = DOMINIO + '/'
        org['logo'] = DOMINIO + '/assets/img/logo/cticol.svg'
    if MARCA['nit']:
        org['taxID'] = MARCA['nit']
    if MARCA['razonSocial']:
        org['legalName'] = MARCA['razonSocial']
    if MARCA.get('fundacion'):
        org['foundingDate'] = str(MARCA['fundacion'])
    redes = [u for u in S['redes'].values() if u.startswith('https://')]
    if redes:
        org['sameAs'] = redes
    return {k: v for k, v in org.items() if v}


def head(archivo, titulo, descripcion, og_img, extra_css='', extra_head='', jsonld=None):
    url = f'{DOMINIO}/{"" if archivo == "index.html" else archivo}' if DOMINIO else ''
    canon = f'<link rel="canonical" href="{url}">\n  <meta property="og:url" content="{url}">' if url else ''
    og_imagen = f'<meta property="og:image" content="{DOMINIO}/{og_img}">' if DOMINIO and og_img else ''
    ga = ''
    if S['analitica']['ga4']:
        gid = e(S['analitica']['ga4'])
        ga = (f'<script async src="https://www.googletagmanager.com/gtag/js?id={gid}"></script>\n'
              f'  <script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}'
              f'gtag("js",new Date());gtag("config","{gid}");</script>')
    gsc = f'<meta name="google-site-verification" content="{e(S["analitica"]["searchConsole"])}">' if S['analitica']['searchConsole'] else ''
    robots = '<meta name="robots" content="noindex">' if REVISION else ''
    datos = [jsonld_org()] + (jsonld or [])
    ld = '\n  '.join(f'<script type="application/ld+json">{json.dumps(d, ensure_ascii=False)}</script>' for d in datos)
    return f'''<!doctype html>
<html lang="es-CO" data-modo="{S['modo']}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{e(titulo)}</title>
  <script>document.documentElement.classList.add('js')</script>
  <meta name="description" content="{e(descripcion)}">
  {robots}
  {canon}
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_CO">
  <meta property="og:site_name" content="{e(MARCA['nombre'])}">
  <meta property="og:title" content="{e(titulo)}">
  <meta property="og:description" content="{e(descripcion)}">
  {og_imagen}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#0B1928">
  {gsc}
  <link rel="icon" href="assets/img/logo/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  {extra_head}
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@500;600;700;800&display=swap">
  <link rel="stylesheet" href="{CDN['bootstrap'][0]}" integrity="{CDN['bootstrap'][1]}" crossorigin="anonymous">
  <link rel="stylesheet" href="{CDN['icons'][0]}" integrity="{CDN['icons'][1]}" crossorigin="anonymous">
  {extra_css}
  <link rel="stylesheet" href="assets/css/styles.css?v={VERSION}">
  <link rel="stylesheet" href="assets/css/responsive.css?v={VERSION}">
  <link rel="stylesheet" href="assets/css/animations.css?v={VERSION}">
  {ga}
  {ld}
</head>'''


def scripts(extra=()):
    base = [f'<script defer src="{CDN["gsap"][0]}" integrity="{CDN["gsap"][1]}" crossorigin="anonymous"></script>',
            f'<script defer src="{CDN["scrolltrigger"][0]}" integrity="{CDN["scrolltrigger"][1]}" crossorigin="anonymous"></script>']
    if 'swiper' in extra:
        base.append(f'<script defer src="{CDN["swiper"][0]}" integrity="{CDN["swiper"][1]}" crossorigin="anonymous"></script>')
    base.append(f'<script defer src="assets/js/config.js?v={VERSION}"></script>')
    base.append(f'<script defer src="assets/js/main.js?v={VERSION}"></script>')
    for nombre in ('slider', 'forms', 'gallery', 'tracking'):
        if nombre in extra:
            base.append(f'<script defer src="assets/js/{nombre}.js?v={VERSION}"></script>')
    base.append(f'<script defer src="assets/js/animations.js?v={VERSION}"></script>')
    return '\n'.join(base)


def pagina(archivo, titulo, descripcion, activo, cuerpo, og_img='assets/img/hero/carga-general-1440.webp',
           js=(), extra_css='', extra_head='', jsonld=None, body_cls=''):
    doc = f'''{head(archivo, titulo, descripcion, og_img, extra_css, extra_head, jsonld)}
<body class="{body_cls}">
{header(activo)}
<main id="contenido" tabindex="-1">
{cuerpo}
</main>
{footer()}
{scripts(js)}
</body>
</html>
'''
    doc = re.sub(r'\n\s*\n+', '\n', doc)
    (RAIZ / archivo).write_text(doc, encoding='utf-8')
    return archivo


def banner(titulo, lede, foto, alt, migas, pos='center'):
    rastro = ''.join(f'<li><a href="{h}">{e(n)}</a></li>' for h, n in migas)
    return f'''<section class="page-banner">
  {img(foto, alt, sizes='100vw', cls='page-banner-img', carga='eager', extra=f' style="object-position:{pos}"')}
  <div class="page-banner-shade" aria-hidden="true"></div>
  <div class="container page-banner-inner">
    <nav class="crumbs" aria-label="Ruta de navegación"><ol><li><a href="index.html">Inicio</a></li>{rastro}<li aria-current="page">{e(titulo)}</li></ol></nav>
    <h1 class="page-title">{e(titulo)}</h1>
    {f'<p class="page-lede">{e(lede)}</p>' if lede else ''}
  </div>
</section>'''


def cta_band(titulo='¿Necesitas transportar tu mercancía?',
             texto='Cuéntenos qué carga necesita mover, desde dónde y hacia dónde. Le respondemos con una cotización.',
             servicio=None):
    destino = f'contacto.html?servicio={servicio}#cotizar' if servicio else 'contacto.html#cotizar'
    wa = wa_link()
    t = C['telefonoPrincipal']
    return f'''<section class="cta-band" aria-labelledby="cta-titulo">
  <div class="hazard" aria-hidden="true"></div>
  <div class="container cta-row">
    <div class="cta-copy">
      <h2 id="cta-titulo">{e(titulo)}</h2>
      <p>{e(texto)}</p>
    </div>
    <div class="cta-actions">
      <a class="btn-cta btn-lg" href="{destino}">Solicitar cotización</a>
      {f'<a class="btn-line" href="{e(wa)}" target="_blank" rel="noopener"><i class="bi bi-whatsapp" aria-hidden="true"></i>Escribir por WhatsApp</a>' if wa else ''}
      <a class="cta-phone" href="{tel_href(t['numero'])}"><i class="bi bi-telephone" aria-hidden="true"></i>{e(t['mostrar'])}</a>
    </div>
  </div>
</section>'''


def sec_head(titulo, texto='', id_=None, cls='', extra=''):
    ident = f' id="{id_}"' if id_ else ''
    return (f'<div class="sec-head {cls}" data-reveal><h2{ident}>{titulo}</h2>'
            f'{f"<p>{e(texto)}</p>" if texto else ""}{extra}</div>')


# ---------------------------------------------------------------- mapa

def mapa_svg(con_ciudades, cls='co-map', vecinos=True):
    p = MAPA['proyeccion']

    def xy(lat, lon):
        return ((lon - p['lonMin']) * p['cos'] * p['escala'], (p['latMax'] - lat) * p['escala'])

    puntos = ''
    if con_ciudades:
        for c in S['cobertura']['ciudades']:
            x, y = xy(c['lat'], c['lon'])
            puntos += (f'<g class="co-city" tabindex="0" role="img" aria-label="{e(c["nombre"])}, {e(c["departamento"])}">'
                       f'<circle class="co-ring" cx="{x:.1f}" cy="{y:.1f}" r="9"/><circle class="co-dot" cx="{x:.1f}" cy="{y:.1f}" r="4.5"/></g>')
        etiquetas = {'Cartagena', 'Bucaramanga', 'Medellín', 'Bogotá', 'Cali', 'Cúcuta', 'Buenaventura', 'Puerto Gaitán', 'Barrancabermeja', 'Puerto Bolívar'}
        izquierda = {'Medellín', 'Cali', 'Buenaventura', 'Cartagena', 'Barrancabermeja'}
        for c in S['cobertura']['ciudades']:
            if c['nombre'] in etiquetas:
                x, y = xy(c['lat'], c['lon'])
                if c['nombre'] in izquierda:
                    puntos += f'<text class="co-label" x="{x - 12:.1f}" y="{y + 5:.1f}" text-anchor="end">{e(c["nombre"])}</text>'
                else:
                    puntos += f'<text class="co-label" x="{x + 12:.1f}" y="{y + 5:.1f}">{e(c["nombre"])}</text>'
    capa_vecinos = f'<path class="co-vecinos" d="{MAPA["vecinos"]}"/>' if vecinos else ''
    desc = ('Mapa de Colombia con las ciudades de la lista de cobertura.' if con_ciudades
            else 'Mapa de Colombia.')
    return (f'<svg class="{cls}" viewBox="0 0 {MAPA["ancho"]} {MAPA["alto"]}" role="img" aria-label="{desc}">'
            f'{capa_vecinos}<path class="co-pais" d="{MAPA["colombia"]}"/>{puntos}</svg>')


def cobertura_visible():
    return REVISION or S['cobertura']['confirmado']


def departamentos():
    deps = {}
    for c in S['cobertura']['ciudades']:
        deps.setdefault(c['departamento'], []).append(c['nombre'])
    return deps


# ---------------------------------------------------------------- páginas

HERO = [
    {'foto': 'hero/carga-general', 'alt': 'Tractocamión con furgón tomando una curva en una carretera de montaña',
     'tag': 'Soluciones de transporte terrestre', 'titulo': 'Transportamos tu carga con', 'hl': 'seguridad y confianza.',
     'texto': 'Soluciones de transporte terrestre para movilizar mercancías y carga general, con compromiso, responsabilidad y cumplimiento en cada operación.',
     'btn1': ('Solicitar cotización', 'contacto.html#cotizar'), 'btn2': ('Conocer nuestros servicios', 'servicios.html'),
     'tramo': 'Carga general', 'pos': '58% center'},
    {'foto': 'hero/carga-pesada', 'alt': 'Tractocamión con cama baja transportando una excavadora y un cargador al atardecer',
     'tag': 'Especialistas en transporte especializado', 'titulo': 'Movemos grandes retos. Transportamos', 'hl': 'grandes proyectos.',
     'texto': 'Transporte especializado de maquinaria pesada y equipos industriales, con soluciones adaptadas a los requerimientos de cada operación.',
     'btn1': ('Cotizar transporte', 'contacto.html?servicio=carga-pesada#cotizar'), 'btn2': ('Nuestra flota', 'flota.html'),
     'tramo': 'Carga pesada', 'pos': '30% center'},
    {'foto': 'hero/sobredimensionada', 'alt': 'Remolques modulares con recipientes metálicos de gran longitud en una vía recta',
     'tag': 'Capacidad para operaciones especiales', 'titulo': 'Soluciones logísticas para', 'hl': 'cargas extraordinarias.',
     'texto': 'Movilización de cargas especiales y sobredimensionadas mediante planificación logística y soluciones de transporte según las características de cada proyecto.',
     'btn1': ('Solicitar asesoría', 'contacto.html?servicio=carga-sobredimensionada#cotizar'), 'btn2': ('Contáctanos', 'contacto.html'),
     'tramo': 'Sobredimen\u00adsionada', 'pos': '62% center'},
]


def hero():
    slides, tramos = [], []
    for i, h in enumerate(HERO):
        carga = 'eager' if i == 0 else 'lazy'
        slides.append(f'''<div class="swiper-slide hero-slide" role="group" aria-roledescription="diapositiva" aria-label="{i + 1} de {len(HERO)}: {e(h['tramo'])}">
        {img(h['foto'], h['alt'], cls='hero-img', carga=carga, extra=f' style="object-position:{h["pos"]}"')}
        <div class="hero-shade" aria-hidden="true"></div>
        <div class="container hero-content">
          <p class="hero-tag" data-hero="tag">{e(h['tag'])}</p>
          <h2 class="hero-title" data-hero="title">{e(h['titulo'])} <span class="hl">{e(h['hl'])}</span></h2>
          <p class="hero-text" data-hero="text">{e(h['texto'])}</p>
          <div class="hero-actions" data-hero="actions">
            <a class="btn-cta btn-lg" href="{h['btn1'][1]}">{e(h['btn1'][0])}</a>
            <a class="btn-ghost btn-lg" href="{h['btn2'][1]}">{e(h['btn2'][0])}</a>
          </div>
        </div>
      </div>''')
        tramos.append(f'<button class="tramo{" is-active" if i == 0 else ""}" type="button" data-tramo="{i}" aria-label="Ir a la diapositiva {i + 1}: {e(h["tramo"])}"'
                      f'{AC_TRUE if i == 0 else ""}><span class="tramo-bar"><span class="tramo-fill"></span></span>'
                      f'<span class="tramo-name">{e(h["tramo"])}</span></button>')
    return f'''<section class="hero" aria-roledescription="carrusel" aria-label="Servicios destacados de {e(MARCA['nombre'])}">
  <h1 class="visually-hidden">{e(MARCA['nombre'])}: transporte de carga general, pesada y sobredimensionada en Colombia</h1>
  <div class="swiper hero-swiper" data-hero-swiper>
    <div class="swiper-wrapper">
      {''.join(slides)}
    </div>
  </div>
  <div class="hero-nav">
    <div class="container hero-nav-row">
      <div class="hero-tramos">{''.join(tramos)}</div>
      <div class="hero-ctrl">
        <button class="hero-btn" type="button" data-hero-prev aria-label="Diapositiva anterior"><i class="bi bi-arrow-left" aria-hidden="true"></i></button>
        <button class="hero-btn" type="button" data-hero-pause aria-label="Pausar el carrusel" aria-pressed="false"><i class="bi bi-pause-fill" aria-hidden="true"></i></button>
        <button class="hero-btn" type="button" data-hero-next aria-label="Diapositiva siguiente"><i class="bi bi-arrow-right" aria-hidden="true"></i></button>
      </div>
    </div>
  </div>
</section>'''


def tarjeta_servicio(s, variante):
    sizes = {'feature': '(min-width: 992px) 60vw, 100vw', 'side': '(min-width: 992px) 30vw, 100vw',
             'std': '(min-width: 992px) 30vw, (min-width: 768px) 50vw, 100vw', 'wide': '(min-width: 992px) 45vw, 100vw'}[variante]
    return f'''<article class="svc svc--{variante}" data-reveal-item>
      <a class="svc-link" href="{s['id']}.html">
        <div class="svc-media">{img(s['foto'], s['fotoAlt'], sizes=sizes)}</div>
        <div class="svc-body">
          <h3><i class="bi bi-{s['icono']}" aria-hidden="true"></i>{e(s['nombre'])}</h3>
          <p>{e(s['resumen'])}</p>
          <span class="svc-more">Conocer el servicio <i class="bi bi-arrow-right-short" aria-hidden="true"></i></span>
        </div>
      </a>
    </article>'''


def flota_visibles():
    return [v for v in FLOTA['vehiculos'] if visible(v, 'enFlota')]


def exp_line():
    if not (ANIOS and MARCA.get('razonAnterior') and MARCA['razonSocial']):
        return ''
    return (f'<p class="exp-line"><i class="bi bi-award" aria-hidden="true"></i><span><strong>{ANIOS} años en el mercado.</strong> '
            f'Iniciamos en {MARCA["fundacion"]} como {e(MARCA["razonAnterior"])} y desde 2025 somos {e(MARCA["razonSocial"])}.</span></p>')


def pag_inicio():
    s = {x['id']: x for x in SERVICIOS}
    servicios = f'''<section class="section" aria-labelledby="t-servicios">
  <div class="container">
    {sec_head('Lo que transportamos', 'Seis servicios para cargas de todo tamaño: desde mercancía empacada hasta equipos que superan las medidas de un vehículo convencional.', 't-servicios', extra='<a class="link-arrow" href="servicios.html">Ver todos los servicios</a>')}
    <div class="svc-grid">
      {tarjeta_servicio(s['carga-general'], 'feature')}
      {tarjeta_servicio(s['mercancia-seca'], 'side')}
      {tarjeta_servicio(s['carga-pesada'], 'std')}
      {tarjeta_servicio(s['carga-sobredimensionada'], 'std')}
      {tarjeta_servicio(s['maquinaria-pesada'], 'std')}
      {tarjeta_servicio(s['transporte-especializado'], 'wide')}
    </div>
  </div>
</section>'''

    intro = f'''<section class="section intro" aria-labelledby="t-intro">
  <div class="container">
    <div class="row gx-4 gy-4 gx-xl-5 align-items-end">
      <div class="col-lg-6"><h2 class="display-h" id="t-intro" data-reveal>Somos tu aliado estratégico en transporte y logística.</h2></div>
      <div class="col-lg-6" data-reveal>
        <p class="lead-p">En {e(MARCA['nombre'])} movilizamos carga general, mercancía seca, carga pesada y sobredimensionada por carretera. Revisamos cada carga antes de cotizarla para asignar el vehículo adecuado y planear el viaje con usted.</p>
        {exp_line()}
        <p>Desde la solicitud hasta la entrega tiene un contacto directo de operaciones que le informa la salida, el avance y la llegada de su mercancía.</p>
      </div>
    </div>
    <ul class="load-strip" aria-label="Tipos de carga que transportamos">
      <li><i class="bi bi-box-seam" aria-hidden="true"></i><span>Carga general</span></li>
      <li><i class="bi bi-boxes" aria-hidden="true"></i><span>Mercancía seca</span></li>
      <li><i class="bi bi-truck-flatbed" aria-hidden="true"></i><span>Carga pesada</span></li>
      <li><i class="bi bi-arrows-angle-expand" aria-hidden="true"></i><span>Carga sobredimensionada</span></li>
    </ul>
  </div>
</section>'''

    empresa = f'''<section class="section section--tight" aria-labelledby="t-empresa">
  <div class="container">
    <div class="row gx-4 gy-5 gx-xl-5 align-items-center">
      <div class="col-lg-6">
        <figure class="photo-frame" data-reveal="img">{img('company/municipio', 'Camión con cama baja transportando un cargador por la plaza de un municipio colombiano', sizes='(min-width: 992px) 45vw, 100vw')}</figure>
      </div>
      <div class="col-lg-6">
        <div data-reveal>
          <h2 id="t-empresa">Una operación pensada desde la carga</h2>
          <p>Cada carga es distinta. Antes de asignar un vehículo revisamos el peso, las medidas, el tipo de empaque y las condiciones del cargue y de la entrega. Con esa información definimos el equipo, la ruta y los tiempos del viaje.</p>
          <ul class="check-list">
            <li>Revisión de la carga antes de cotizar</li>
            <li>Vehículo según el peso y las medidas</li>
            <li>Información del viaje de principio a fin</li>
          </ul>
          <a class="link-arrow" href="nosotros.html">Conocer {e(MARCA['nombre'])}</a>
        </div>
      </div>
    </div>
  </div>
</section>'''

    porque_items = ''.join(f'<li data-reveal-item><i class="bi bi-{p["icono"]}" aria-hidden="true"></i><div><h3>{e(p["nombre"])}</h3><p>{e(p["texto"])}</p></div></li>' for p in S['porQue'])
    porque = f'''<section class="section section--gray" aria-labelledby="t-porque">
  <div class="container">
    <div class="row gx-4 gy-5 gx-xl-5">
      <div class="col-lg-5">
        <div class="porque-aside">
          {sec_head('¿Por qué elegirnos?', 'Lo que puede esperar de nosotros en cada viaje, sin promesas que no podamos demostrar.', 't-porque')}
          <figure class="photo-frame photo-frame--short d-none d-lg-block" data-reveal="img">{img('company/patio', 'Tractocamiones blancos con semirremolque cerrado estacionados en un patio', sizes='40vw')}</figure>
        </div>
      </div>
      <div class="col-lg-7"><ul class="reasons">{porque_items}</ul></div>
    </div>
  </div>
</section>'''

    flota_sec = ''
    vis = flota_visibles()
    if vis:
        vistos, slides = set(), []
        for v in vis:
            if v['categoria'] in vistos:
                continue
            vistos.add(v['categoria'])
            cat = next(c['nombre'] for c in FLOTA['categorias'] if c['id'] == v['categoria'])
            slides.append(f'''<div class="swiper-slide"><a class="fleet-card" href="flota.html#{v['categoria']}">
          <div class="fleet-media">{img(v['foto'], v['fotoAlt'], sizes='(min-width: 1200px) 30vw, (min-width: 768px) 45vw, 85vw')}</div>
          <div class="fleet-cap"><h3>{e(cat)}</h3><p>{e(v['descripcion'])}</p>{tag() if pendiente(v, 'enFlota') else ''}</div></a></div>''')
        flota_sec = f'''<section class="section section--navy" aria-labelledby="t-flota">
  <div class="container">
    <div class="sec-head sec-head--split" data-reveal>
      <div><h2 id="t-flota">Nuestra flota y respaldo</h2><p>{e(FLOTA.get('propiedad', 'Flota'))} de turbos, camiones sencillos y tractomulas, con el respaldo que su carga necesita.</p></div>
      <div class="swiper-ctrl"><button class="round-btn" type="button" data-fleet-prev aria-label="Vehículos anteriores"><i class="bi bi-arrow-left" aria-hidden="true"></i></button><button class="round-btn" type="button" data-fleet-next aria-label="Vehículos siguientes"><i class="bi bi-arrow-right" aria-hidden="true"></i></button></div>
    </div>
    {respaldo_html('backing--dark')}
    <div class="swiper fleet-swiper" data-fleet-swiper aria-label="Tipos de vehículos">
      <div class="swiper-wrapper">{''.join(slides)}</div>
    </div>
    <a class="link-arrow link-arrow--light" href="flota.html">Ver la flota completa</a>
  </div>
</section>'''

    sectores = ''.join(f'<li data-reveal-item><i class="bi bi-{x["icono"]}" aria-hidden="true"></i><h3>{e(x["nombre"])}</h3><p>{e(x["texto"])}</p></li>' for x in S['sectores'])
    clientes = ''.join(f'<li data-reveal-item><i class="bi bi-{x["icono"]}" aria-hidden="true"></i><div><h3>{e(x["nombre"])}</h3><p>{e(x["texto"])}</p></div></li>'
                       for x in S.get('clientes', {}).get('items', []))
    lista_clientes = f'<ul class="clients">{clientes}</ul>' if clientes else ''
    sectores_sec = f'''<section class="section" aria-labelledby="t-sectores">
  <div class="container">
    {sec_head('A quién atendemos', 'Empresas comerciales, industrias, distribuidores y personas naturales que necesitan mover carga por carretera.', 't-sectores')}
    {lista_clientes}
    <h3 class="h-small sectors-title">Sectores que atendemos</h3>
    <ul class="sectors">{sectores}</ul>
  </div>
</section>'''

    cobertura_sec = ''
    if cobertura_visible():
        deps = departamentos()
        cobertura_sec = f'''<section class="section section--gray section--tight" aria-labelledby="t-cobertura">
  <div class="container">
    <div class="row gx-4 gy-4 gx-xl-5 align-items-center">
      <div class="col-lg-7" data-reveal>
        <h2 id="t-cobertura">Cobertura y operaciones {'' if S['cobertura']['confirmado'] else tag()}</h2>
        <p>{e(S['cobertura']['texto'])}</p>
        <ul class="chip-list">{''.join(f'<li>{e(d)}</li>' for d in deps)}</ul>
        {'' if S['cobertura']['confirmado'] else '<p class="note-pend">Ciudades tomadas del mapa recibido. Falta que la empresa confirme su cobertura y sus rutas.</p>'}
        <a class="link-arrow" href="cobertura.html">Ver la cobertura</a>
      </div>
      <div class="col-lg-5"><div class="map-mini">{mapa_svg(True, vecinos=False)}</div></div>
    </div>
  </div>
</section>'''

    cuerpo = '\n'.join([hero(), intro, servicios, empresa, porque, flota_sec, sectores_sec, cobertura_sec, cta_band()])
    precarga = (f'<link rel="preload" as="image" href="{img_src("hero/carga-general")}" '
                f'imagesrcset="{", ".join(f"assets/img/hero/carga-general-{a}.webp {a}w" for a, _ in variantes("hero/carga-general"))}" imagesizes="100vw" fetchpriority="high">')
    swiper_css = f'<link rel="stylesheet" href="{CDN["swipercss"][0]}" integrity="{CDN["swipercss"][1]}" crossorigin="anonymous">'
    return pagina('index.html', f"{MARCA['nombre']} | Transporte de carga general, pesada y sobredimensionada",
                  'Transporte terrestre de carga general, mercancía seca, carga pesada, maquinaria amarilla y carga sobredimensionada en Colombia. Solicite su cotización.',
                  'index.html', cuerpo, js=('swiper', 'slider'), extra_css=swiper_css, extra_head=precarga, body_cls='page-home')


def bloque_pend(titulo, aprobado):
    return '' if aprobado else tag('Texto provisional')


def pag_nosotros():
    inst = S['institucional']
    qs = inst['quienesSomos']
    partes = [banner('Nosotros', 'Una empresa colombiana de transporte terrestre de carga.', 'company/patio',
                     'Tractocamiones con semirremolque cerrado en un patio', [], pos='center 60%')]
    partes.append(f'''<section class="section" aria-labelledby="t-quienes">
  <div class="container"><div class="row gx-4 gy-5 gx-xl-5 align-items-center">
    <div class="col-lg-6" data-reveal><h2 id="t-quienes">Quiénes somos</h2>{''.join(f'<p>{e(p)}</p>' for p in qs['texto'])}</div>
    <div class="col-lg-6"><figure class="photo-frame" data-reveal="img">{img('company/municipio', 'Camión con cama baja y un cargador en la plaza de un municipio', sizes='(min-width: 992px) 45vw, 100vw')}</figure></div>
  </div></div>
</section>''')
    resp = respaldo_html()
    if resp:
        partes.append(f'''<section class="section section--tight" aria-labelledby="t-respaldo"><div class="container">
  {sec_head('Nuestro respaldo', 'Lo que acompaña a cada despacho, desde el cargue hasta la entrega.', 't-respaldo')}
  {resp}
</div></section>''')
    hist = inst['historia']
    if hist['aprobado'] and hist['texto']:
        parrafos = ''.join(f'<p>{e(anios(x))}</p>' for x in hist['texto'])
        hitos = ''.join(f'<li data-reveal-item><span class="tl-year">{e(h["anio"])}</span><p>{e(anios(h["texto"]))}</p></li>' for h in hist.get('hitos', []))
        linea = f'<ol class="timeline">{hitos}</ol>' if hitos else ''
        partes.append(f'''<section class="section section--gray" aria-labelledby="t-historia"><div class="container">
  <div class="row gx-4 gy-5 gx-xl-5 align-items-center">
    <div class="col-lg-5" data-reveal><h2 id="t-historia">Nuestra historia</h2>{parrafos}</div>
    <div class="col-lg-7">{linea}</div>
  </div>
</div></section>''')
    elif REVISION:
        partes.append('''<section class="section section--gray section--tight" aria-labelledby="t-historia"><div class="container narrow">
  <h2 id="t-historia">Nuestra historia <span class="tag-pend">Pendiente</span></h2>
  <div class="placeholder-box"><i class="bi bi-hourglass-split" aria-hidden="true"></i><p>La empresa debe suministrar su historia: año de fundación, cómo empezó y hechos importantes. No se redacta una historia inventada. Esta sección no aparece al publicar mientras esté vacía.</p></div>
</div></section>''')

    if mv_visible():
        partes.append(f'''<section class="section section--tight" aria-labelledby="t-mv"><div class="container">
  <a class="mv-teaser" href="mision-vision.html" data-reveal>
    <span class="mv-teaser-icons" aria-hidden="true"><i class="bi bi-bullseye"></i><i class="bi bi-binoculars"></i></span>
    <span class="mv-teaser-text"><span class="h2-like" id="t-mv">Misión y visión</span><span>Para qué existimos y hacia dónde vamos como empresa de transporte.</span></span>
    <span class="mv-teaser-go">Leer misión y visión <i class="bi bi-arrow-right" aria-hidden="true"></i></span>
  </a>
</div></section>''')

    val = inst['valores']
    if visible(val, 'aprobado'):
        items = ''.join(f'<li data-reveal-item><i class="bi bi-{v["icono"]}" aria-hidden="true"></i><h3>{e(v["nombre"])}</h3><p>{e(v["texto"])}</p></li>' for v in val['lista'])
        partes.append(f'''<section class="section section--gray" aria-labelledby="t-valores"><div class="container">
  {sec_head('Valores corporativos ' + bloque_pend('', val['aprobado']), '', 't-valores')}
  <ul class="sectors sectors--values">{items}</ul>
</div></section>''')

    com = inst['compromiso']
    if visible(com, 'aprobado'):
        partes.append(f'''<section class="section section--navy commit" aria-labelledby="t-compromiso"><div class="container narrow" data-reveal>
  <h2 id="t-compromiso">Nuestro compromiso {bloque_pend('', com['aprobado'])}</h2>
  <p class="commit-text">{e(com['texto'])}</p>
</div></section>''')

    fil = inst['filosofia']
    if visible(fil, 'aprobado'):
        pasos = ''.join(f'<li data-reveal-item><span class="step-n" aria-hidden="true">{i + 1}</span><h3>{e(p["nombre"])}</h3><p>{e(p["texto"])}</p></li>' for i, p in enumerate(fil['pasos']))
        partes.append(f'''<section class="section" aria-labelledby="t-filosofia"><div class="container">
  {sec_head('Nuestra filosofía de servicio ' + bloque_pend('', fil['aprobado']), 'Cinco pasos que seguimos en cada solicitud, de la primera llamada a la entrega.', 't-filosofia')}
  <ol class="steps">{pasos}</ol>
</div></section>''')
    partes.append(cta_band())
    return pagina('nosotros.html', f"Nosotros | {MARCA['nombre']}",
                  f"Conozca a {MARCA['nombre']}: empresa colombiana de transporte terrestre de carga general, mercancía seca, carga pesada y sobredimensionada.",
                  'nosotros.html', '\n'.join(partes), og_img='assets/img/company/patio-960.webp')


def pag_mision_vision():
    inst = S['institucional']
    bloques = []
    datos = (('mision', 'Misión', 'bullseye', 'Para qué existimos', 'hero/carga-general', 'Tractocamión con furgón tomando una curva en una carretera de montaña'),
             ('vision', 'Visión', 'binoculars', 'Hacia dónde vamos', 'company/ruta', 'Tractocamión con cama baja llevando una excavadora y un cargador al atardecer'))
    for i, (clave, titulo, icono, sub, foto, alt) in enumerate(datos):
        b = inst[clave]
        if not visible(b, 'aprobado'):
            continue
        nota = '' if b['aprobado'] else ('<p class="note-pend">Texto de prueba escrito para la demostración, pendiente de aprobación de la empresa. '
                                         f'Edítelo en <code>datos/sitio.json</code> → <code>institucional.{clave}</code> y ponga <code>aprobado: true</code>.</p>')
        bloques.append(f'''<section class="mv-band{' mv-band--navy' if i % 2 else ''}" aria-labelledby="t-{clave}">
  <div class="container"><div class="mv-band-row{' mv-band-row--rev' if i % 2 else ''}">
    <figure class="mv-band-media photo-frame" data-reveal="img">{img(foto, alt, sizes='(min-width: 992px) 46vw, 100vw')}</figure>
    <div class="mv-band-body" data-reveal>
      <span class="mv-icon mv-icon--static"><i class="bi bi-{icono}" aria-hidden="true"></i></span>
      <p class="mv-kicker">{sub}</p>
      <h2 id="t-{clave}">{titulo} {bloque_pend(titulo, b['aprobado'])}</h2>
      <p class="mv-statement">{e(b['texto'])}</p>
      {lista(b.get('puntos', []), 'mv-points')}
      {nota}
    </div>
  </div></div>
</section>''')
    if not bloques:
        bloques.append('<section class="section"><div class="container narrow"><div class="placeholder-box"><i class="bi bi-hourglass-split" aria-hidden="true"></i>'
                       '<p>Estamos preparando la misión y la visión de la empresa.</p></div></div></section>')
    puente = f'''<section class="section section--gray section--tight" aria-labelledby="t-mv-mas"><div class="container">
  <h2 id="t-mv-mas" class="h-small">Siga conociendo {e(MARCA['nombre'])}</h2>
  <ul class="other-svc other-svc--3">
    <li><a href="nosotros.html"><i class="bi bi-building" aria-hidden="true"></i>Quiénes somos, valores y filosofía de servicio</a></li>
    <li><a href="servicios.html"><i class="bi bi-truck" aria-hidden="true"></i>Nuestros servicios de transporte</a></li>
    <li><a href="flota.html"><i class="bi bi-truck-flatbed" aria-hidden="true"></i>Nuestra flota</a></li>
  </ul>
</div></section>'''
    cuerpo = '\n'.join([banner('Misión y visión', 'Para qué existimos y hacia dónde vamos.', 'company/ruta',
                                'Tractocamión con cama baja y maquinaria al atardecer', [('nosotros.html', 'Nosotros')], pos='center 60%')]
                        + bloques + [puente, cta_band()])
    return pagina('mision-vision.html', f"Misión y visión | {MARCA['nombre']}",
                  f"Misión y visión de {MARCA['nombre']}, empresa colombiana de transporte terrestre de carga.",
                  'mision-vision.html', cuerpo, og_img='assets/img/company/ruta-960.webp')


def pag_servicios():
    chips = ''.join(f'<li><a href="#{s["id"]}"><i class="bi bi-{s["icono"]}" aria-hidden="true"></i>{e(s["corto"])}</a></li>' for s in SERVICIOS)
    filas = []
    for i, s in enumerate(SERVICIOS):
        wa = wa_link(f"Hola, quiero cotizar el servicio de {s['nombre'].lower()}.")
        filas.append(f'''<article class="svc-row{' svc-row--rev' if i % 2 else ''}" id="{s['id']}" aria-labelledby="t-{s['id']}">
    <figure class="svc-row-media photo-frame" data-reveal="img">{img(s['foto'], s['fotoAlt'], sizes='(min-width: 992px) 50vw, 100vw')}</figure>
    <div class="svc-row-body" data-reveal>
      <h2 id="t-{s['id']}"><i class="bi bi-{s['icono']}" aria-hidden="true"></i>{e(s['nombre'])}</h2>
      <p class="lead-p">{e(s['resumen'])}</p>
      {lista(s['caracteristicas'][:3])}
      <div class="btn-row">
        <a class="btn-dark" href="{s['id']}.html">Ver el servicio</a>
        {f'<a class="btn-wa" href="{e(wa)}" target="_blank" rel="noopener"><i class="bi bi-whatsapp" aria-hidden="true"></i>Cotizar por WhatsApp</a>' if wa else ''}
      </div>
    </div>
  </article>''')
    cuerpo = f'''{banner('Servicios', 'Transporte terrestre para carga general, mercancía seca, carga pesada, maquinaria y cargas sobredimensionadas.', 'services/carga-sobredimensionada', 'Tractocamión con cama baja y equipo cubierto con lona', [], pos='center 55%')}
<nav class="svc-jump" aria-label="Servicios en esta página"><div class="container"><ul>{chips}</ul></div></nav>
<section class="section" aria-label="Catálogo de servicios"><div class="container svc-rows">{''.join(filas)}</div></section>
{cta_band('¿No sabe qué servicio necesita su carga?', 'Descríbanos qué va a mover y le recomendamos el vehículo y la forma de hacer el viaje.')}'''
    return pagina('servicios.html', f"Servicios de transporte de carga | {MARCA['nombre']}",
                  'Transporte de carga general, mercancía seca, carga pesada, carga sobredimensionada, maquinaria pesada y transporte especializado.',
                  'servicios.html', cuerpo, og_img='assets/img/services/carga-sobredimensionada-960.webp')


def pag_servicio(s):
    wa = wa_link(f"Hola, quiero cotizar el servicio de {s['nombre'].lower()}.")
    otros = ''.join(f'<li><a href="{o["id"]}.html"><i class="bi bi-{o["icono"]}" aria-hidden="true"></i>{e(o["nombre"])}</a></li>' for o in SERVICIOS if o['id'] != s['id'])
    mercancias = ''.join(f'<li>{e(m)}</li>' for m in s['mercancias'])
    soluciones = lista(s['soluciones'], 'sol-list')
    t = C['telefonoPrincipal']
    cuerpo = f'''{banner(s['nombre'], s['resumen'], s['foto'], s['fotoAlt'], [('servicios.html', 'Servicios')])}
<section class="section" aria-label="Detalle del servicio">
  <div class="container"><div class="row gx-4 gy-5 gx-xl-5">
    <div class="col-lg-8 svc-detail">
      <div data-reveal><h2>Descripción</h2>{''.join(f'<p>{e(p)}</p>' for p in s['descripcion'])}</div>
      <div class="detail-block" data-reveal><h2>Características</h2>{lista(s['caracteristicas'])}</div>
      <div class="detail-block" data-reveal><h2>Tipos de mercancía</h2><ul class="chip-list chip-list--light">{mercancias}</ul></div>
      {f'<div class="detail-block" data-reveal><h2>Soluciones disponibles</h2>{soluciones}</div>' if soluciones else ''}
    </div>
    <aside class="col-lg-4" aria-labelledby="t-cotizar">
      <div class="quote-box">
        <h2 id="t-cotizar">Solicite su cotización</h2>
        <p>Para cotizar este servicio necesitamos:</p>
        <ul class="mini-list">
          <li>Ciudad de origen y de destino</li>
          <li>Qué es la carga y cómo está empacada</li>
          <li>Peso y medidas aproximadas</li>
          <li>Fecha en que necesita el viaje</li>
        </ul>
        <a class="btn-cta w-100" href="contacto.html?servicio={s['id']}#cotizar">Solicitar cotización</a>
        {f'<a class="btn-wa w-100" href="{e(wa)}" target="_blank" rel="noopener"><i class="bi bi-whatsapp" aria-hidden="true"></i>Cotizar por WhatsApp</a>' if wa else ''}
        <a class="quote-phone" href="{tel_href(t['numero'])}"><i class="bi bi-telephone" aria-hidden="true"></i><span><small>{e(t['area'])}</small>{e(t['mostrar'])}</span></a>
      </div>
    </aside>
  </div></div>
</section>
<section class="section section--gray section--tight" aria-labelledby="t-otros"><div class="container">
  <h2 id="t-otros" class="h-small">Otros servicios</h2>
  <ul class="other-svc">{otros}</ul>
</div></section>
{cta_band(servicio=s['id'])}'''
    ld = {'@context': 'https://schema.org', '@type': 'Service', 'name': s['nombre'], 'description': s['resumen'],
          'serviceType': s['nombre'], 'areaServed': {'@type': 'Country', 'name': 'Colombia'},
          'provider': {'@type': 'Organization', 'name': MARCA['razonSocial'] or MARCA['nombre']}}
    if DOMINIO:
        ld['url'] = f"{DOMINIO}/{s['id']}.html"
    return pagina(f"{s['id']}.html", f"{s['nombre']} | {MARCA['nombre']}", f"{s['resumen']} Solicite su cotización con {MARCA['nombre']}.",
                  'serv:' + s['id'], cuerpo, og_img=img_src(s['foto']), jsonld=[ld])


def filtros(categorias, nombre_grupo):
    botones = [f'<button type="button" class="filter is-active" data-filter="*" aria-pressed="true">Todos</button>']
    botones += [f'<button type="button" class="filter" data-filter="{c["id"]}" aria-pressed="false">{e(c["nombre"])}</button>' for c in categorias]
    return f'<div class="filters" role="group" aria-label="{e(nombre_grupo)}">{"".join(botones)}</div>'


def pag_flota():
    vis = flota_visibles()
    cats = [c for c in FLOTA['categorias'] if any(v['categoria'] == c['id'] for v in vis)]
    tarjetas = []
    for v in vis:
        cat = next(c['nombre'] for c in FLOTA['categorias'] if c['id'] == v['categoria'])
        ficha = ''.join(f'<li><span>{e(k)}</span>{e(val)}</li>' for k, val in (f.split(':', 1) if ':' in f else ('Dato', f) for f in v['ficha']))
        cap = f'<p class="fleet-capacity"><strong>Capacidad:</strong> {e(v["capacidad"])}</p>' if v['capacidad'] else (
            '<p class="fleet-capacity fleet-capacity--pend">Capacidad: por confirmar</p>' if REVISION else '')
        tarjetas.append(f'''<article class="fleet-item" data-cat="{v['categoria']}" data-reveal-item>
      <div class="fleet-item-media">{img(v['foto'], v['fotoAlt'], sizes='(min-width: 1200px) 30vw, (min-width: 768px) 45vw, 100vw')}</div>
      <div class="fleet-item-body">
        <p class="fleet-cat">{e(cat)}</p>
        <h3>{e(v['nombre'])} {tag() if pendiente(v, 'enFlota') else ''}</h3>
        <p>{e(v['descripcion'])}</p>
        {cap}
        {f'<ul class="spec-list">{ficha}</ul>' if ficha else ''}
      </div>
    </article>''')
    anclas = ''.join(f'<span id="{c["id"]}" class="anchor-target"></span>' for c in cats)
    if tarjetas:
        contenido = f'''{filtros(cats, 'Filtrar por tipo de vehículo')}
    {anclas}
    <p class="filter-count" aria-live="polite" data-filter-count></p>
    <div class="fleet-grid" data-filter-grid>{''.join(tarjetas)}</div>'''
    else:
        contenido = '<div class="placeholder-box"><i class="bi bi-truck" aria-hidden="true"></i><p>Estamos actualizando la información de nuestra flota. Escríbanos y le indicamos el vehículo disponible para su carga.</p><a class="btn-cta" href="contacto.html#cotizar">Solicitar cotización</a></div>'
    nota = ('<p class="note-pend">Confirmados por la empresa: turbos, camiones sencillos y tractomulas (flota propia y tercerizada). '
            'Plataformas, camas bajas y remolques especializados están por confirmar y no aparecen al publicar. '
            'Faltan cantidades y capacidades. La foto del turbo es de Unsplash; las demás son de referencia.</p>') if REVISION else ''
    cuerpo = f'''{banner('Nuestra flota', 'Vehículos y equipos para cada tipo de carga.', 'fleet/tractocamion', 'Tractocamiones azules en carretera', [])}
<section class="section" aria-labelledby="t-catalogo"><div class="container">
  {sec_head('Catálogo de vehículos', FLOTA.get('propiedad', 'Flota') + ' de turbos, camiones sencillos y tractomulas. Filtre por tipo de vehículo.', 't-catalogo')}
  {nota}
  {contenido}
</div></section>
{banda_respaldo('t-respaldo-f')}
{cta_band('¿No sabe qué vehículo necesita?', 'Cuéntenos el peso y las medidas de su carga y le indicamos la configuración adecuada.')}'''
    return pagina('flota.html', f"Nuestra flota | {MARCA['nombre']}",
                  'Flota propia y tercerizada de tractomulas, camiones sencillos y camiones turbo, con rastreo GPS 24/7 y pólizas de seguro de mercancía.',
                  'flota.html', cuerpo, js=('gallery',), og_img='assets/img/fleet/tractocamion-800.webp')


def pag_proyectos():
    cats = PROYECTOS['categorias']
    items = []
    for i, p in enumerate(PROYECTOS['items']):
        cat = next(c['nombre'] for c in cats if c['id'] == p['categoria'])
        grande = img_src(p['foto'], 1200)
        items.append(f'''<figure class="gal-item" data-cat="{p['categoria']}" data-reveal-item>
      <button type="button" class="gal-open" data-lightbox="{i}" data-full="{grande}" data-caption="{e(p['titulo'])}" data-alt="{e(p['alt'])}" aria-label="Ampliar: {e(p['titulo'])}">
        {img(p['foto'], p['alt'], sizes='(min-width: 1200px) 30vw, (min-width: 768px) 45vw, 100vw')}
      </button>
      <figcaption><span>{e(cat)}</span>{e(p['titulo'])}</figcaption>
    </figure>''')
    aviso = ''
    if PROYECTOS['demostracion']:
        aviso = ('<div class="demo-note" role="note"><i class="bi bi-info-circle" aria-hidden="true"></i><p><strong>Galería de referencia.</strong> '
                 f'Estas fotografías son de demostración y no corresponden a operaciones realizadas por {e(MARCA["nombre"])}. '
                 'Se reemplazarán por fotografías propias de la empresa.</p></div>')
    cuerpo = f'''{banner('Proyectos y galería', 'Operaciones de carga, transporte de maquinaria y proyectos industriales.', 'company/ruta', 'Tractocamión con cama baja y maquinaria al atardecer', [], pos='center 60%')}
<section class="section" aria-labelledby="t-galeria"><div class="container">
  {sec_head('Galería', 'Seleccione una foto para verla en tamaño completo.', 't-galeria')}
  {aviso}
  {filtros(cats, 'Filtrar la galería')}
  <p class="filter-count" aria-live="polite" data-filter-count></p>
  <div class="gal-grid" data-filter-grid>{''.join(items)}</div>
</div></section>
<dialog class="lightbox" data-lightbox-dialog aria-label="Foto ampliada">
  <div class="lb-inner">
    <img class="lb-img" alt="" data-lb-img>
    <p class="lb-cap" data-lb-cap></p>
    <button type="button" class="lb-btn lb-close" data-lb-close aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    <button type="button" class="lb-btn lb-prev" data-lb-prev aria-label="Foto anterior"><i class="bi bi-chevron-left" aria-hidden="true"></i></button>
    <button type="button" class="lb-btn lb-next" data-lb-next aria-label="Foto siguiente"><i class="bi bi-chevron-right" aria-hidden="true"></i></button>
  </div>
</dialog>
{cta_band()}'''
    return pagina('proyectos.html', f"Proyectos y galería | {MARCA['nombre']}",
                  'Galería de operaciones de transporte de carga, maquinaria pesada y proyectos industriales.',
                  'proyectos.html', cuerpo, js=('gallery',), og_img='assets/img/company/ruta-960.webp')


def pag_cobertura():
    cob = S['cobertura']
    con = cobertura_visible()
    deps = departamentos()
    if con:
        listado = ''.join(f'<li><h3>{e(d)}</h3><p>{e(", ".join(cs))}</p></li>' for d, cs in deps.items())
        bloque = f'''<h2 id="t-zonas">Departamentos y ciudades {'' if cob['confirmado'] else tag()}</h2>
        {'' if cob['confirmado'] else '<p class="note-pend">Ciudades tomadas del mapa recibido junto con las fotos. Falta que la empresa confirme dónde opera; al publicar, esta lista y los puntos del mapa se ocultan hasta confirmarla.</p>'}
        <ul class="dep-list">{listado}</ul>'''
    else:
        bloque = '<h2 id="t-zonas">Consulte su ruta</h2><p>Indíquenos la ciudad de origen y de destino y le confirmamos la disponibilidad de vehículo para su carga.</p>'
    rutas = ''
    if cob['rutas']:
        rutas = '<div class="detail-block"><h2>Rutas principales</h2><ul class="check-list">' + ''.join(f'<li>{e(r)}</li>' for r in cob['rutas']) + '</ul></div>'
    elif REVISION:
        rutas = '<div class="detail-block"><h2>Rutas principales <span class="tag-pend">Por confirmar</span></h2><p class="note-pend">La empresa no ha indicado sus rutas principales. No se dibujan rutas en el mapa hasta tenerlas.</p></div>'
    cuerpo = f'''{banner('Cobertura', 'Transporte de carga por carretera en Colombia.', 'hero/carga-general', 'Tractocamión en una carretera de montaña', [], pos='center 45%')}
<section class="section" aria-labelledby="t-zonas"><div class="container">
  <div class="row gx-4 gy-5 gx-xl-5">
    <div class="col-lg-6"><div class="map-panel" data-reveal>{mapa_svg(con, vecinos=False)}<p class="map-src">Contorno: Natural Earth (dominio público).</p></div></div>
    <div class="col-lg-6">
      <p class="lead-p" data-reveal>{e(cob['texto'])}</p>
      <div class="detail-block detail-block--first" data-reveal>{bloque}</div>
      {rutas}
      <div class="detail-block" data-reveal><h2>Información sobre operaciones</h2>
        <ul class="check-list">
          <li>Confirmamos la disponibilidad del vehículo en la ciudad de origen</li>
          <li>Le informamos el tiempo estimado de viaje para su ruta</li>
          <li>Revisamos las restricciones de la vía para cargas pesadas y sobredimensionadas</li>
        </ul>
      </div>
    </div>
  </div>
</div></section>
{cta_band('Consulte la disponibilidad para su ruta', 'Indíquenos el origen, el destino y el tipo de carga. Le respondemos con disponibilidad y cotización.')}'''
    return pagina('cobertura.html', f"Cobertura | {MARCA['nombre']}",
                  'Cobertura de transporte de carga por carretera en Colombia. Consulte la disponibilidad para su ruta.',
                  'cobertura.html', cuerpo)


def aviso_envio():
    linea = next((w for w in C['whatsapp'] if w.get('cotizaciones')), None)
    if linea and S.get('formWhatsapp', True):
        return (f'<p class="form-send-hint"><i class="bi bi-whatsapp" aria-hidden="true"></i>Al solicitar la cotización se abre WhatsApp '
                f'con su solicitud lista para enviar a nuestra línea {e(linea["area"].lower())} {e(linea["mostrar"])}.</p>')
    return ''


def banda_respaldo(ident):
    resp = respaldo_html('backing--dark')
    if not resp:
        return ''
    return (f'<section class="section section--navy section--tight" aria-labelledby="{ident}"><div class="container">'
            f'{sec_head("Respaldo en cada viaje", "", ident)}{resp}</div></section>')


def pag_rastreo():
    desp = linea_wa(S.get('rastreo', {}).get('lineaWhatsapp', 'Despachos'))
    t = C['telefonoPrincipal']
    url = S.get('rastreo', {}).get('url', '')
    if url.startswith('https://'):
        principal = (f'<div class="track-box" data-reveal><h2>Plataforma de rastreo</h2><p>Consulte el estado de su envío en nuestra plataforma.</p>'
                     f'<a class="btn-cta btn-lg" href="{e(url)}" target="_blank" rel="noopener"><i class="bi bi-geo-alt-fill" aria-hidden="true"></i>'
                     'Ir a la plataforma de rastreo</a></div>')
    else:
        formulario = ''
        if desp:
            formulario = f'''<form class="track-form" data-track-form novalidate data-wa="{desp['numero']}">
    <div class="field"><label for="t-guia">Número de remesa, manifiesto o guía *</label><input id="t-guia" name="guia" required maxlength="60" autocomplete="off" aria-describedby="t-guia-h"><p class="field-hint" id="t-guia-h">Aparece en los documentos del despacho. Si no lo tiene, escriba la placa del vehículo o la fecha de cargue.</p><p class="field-err" id="e-guia"></p></div>
    <div class="field"><label for="t-nombre">Su nombre o empresa *</label><input id="t-nombre" name="nombre" required maxlength="120" autocomplete="organization"><p class="field-err" id="e-nombre"></p></div>
    <button class="btn-wa btn-lg" type="submit"><i class="bi bi-whatsapp" aria-hidden="true"></i>Consultar por WhatsApp</button>
    <p class="form-send-hint"><i class="bi bi-whatsapp" aria-hidden="true"></i>Se abre WhatsApp de {e(desp['area'])} ({e(desp['mostrar'])}) con su consulta escrita: presione «Enviar».</p>
    <div class="form-status" role="status" aria-live="polite" data-track-status></div>
  </form>'''
        principal = f'''<div class="track-box" data-reveal>
  <p class="track-status"><i class="bi bi-tools" aria-hidden="true"></i>Plataforma de rastreo en desarrollo</p>
  <h2>Consulte su envío con nuestro equipo de despachos</h2>
  <p>Estamos construyendo la plataforma para rastrear envíos en línea. Mientras tanto, escríbanos el número de su remesa o manifiesto y le informamos dónde va su carga: nuestros vehículos tienen rastreo GPS 24/7.</p>
  {formulario}
</div>'''
    filas = []
    if desp:
        filas.append(f'<li><i class="bi bi-whatsapp" aria-hidden="true"></i><span><small>WhatsApp {e(desp["area"])}</small>'
                     f'<a href="https://wa.me/{desp["numero"]}" target="_blank" rel="noopener">{e(desp["mostrar"])}</a></span></li>')
    filas.append(f'<li><i class="bi bi-telephone" aria-hidden="true"></i><span><small>{e(t["area"])}</small>'
                 f'<a href="{tel_href(t["numero"])}">{e(t["mostrar"])}</a></span></li>')
    if C['correo']:
        filas.append(f'<li><i class="bi bi-envelope" aria-hidden="true"></i><span><small>Correo</small>'
                     f'<a href="mailto:{e(C["correo"])}">{e(C["correo"])}</a></span></li>')
    cuerpo = f'''{banner('Rastrear envío', 'Sepa dónde va su carga.', 'hero/carga-general', 'Tractocamión con furgón en una carretera de montaña', [], pos='center 45%')}
<section class="section" aria-label="Consulta de envíos"><div class="container">
  <div class="row gx-4 gy-5 gx-xl-5">
    <div class="col-lg-7">{principal}</div>
    <div class="col-lg-5"><div class="contact-panel" data-reveal><h2>Otros canales</h2><ul class="contact-list">{''.join(filas)}</ul></div></div>
  </div>
</div></section>
{banda_respaldo('t-respaldo-r')}'''
    return pagina('rastreo.html', f"Rastrear envío | {MARCA['nombre']}",
                  f"Consulte el estado de su envío con {MARCA['nombre']}. Vehículos con rastreo GPS 24/7.",
                  'rastreo.html', cuerpo, js=('tracking',))


def pag_contacto():
    opciones = ''.join(f'<option value="{s["id"]}">{e(s["nombre"])}</option>' for s in SERVICIOS)
    mapa, ubicacion = '', ''
    prueba = C.get('mapaPrueba') or {}
    if C['mapaUrl'].startswith('https://') and C['direccion']:
        url, lugar, aviso = C['mapaUrl'], C['direccion'] + (f", {C['ciudad']}" if C['ciudad'] else ''), ''
    elif REVISION and prueba.get('activo') and prueba.get('url', '').startswith('https://'):
        url, lugar = prueba['url'], prueba['lugar']
        aviso = (f'<p class="note-pend"><strong>Ubicación de prueba:</strong> {e(lugar)}. No es la dirección de {e(MARCA["nombre"])} '
                 '(la oficina está en traslado). Este mapa no aparece al publicar hasta que se configure la dirección real.</p>')
    else:
        url = ''
        if REVISION:
            mapa = '<p class="note-pend">El mapa de ubicación aparece cuando la empresa confirme su nueva dirección (la oficina está en traslado).</p>'
    if url:
        destino = 'https://www.google.com/maps/search/?api=1&query=' + quote(lugar)
        ubicacion = f'''<section class="section section--gray section--tight" aria-labelledby="t-ubicacion"><div class="container">
  <div class="sec-head sec-head--split" data-reveal>
    <div><h2 id="t-ubicacion">Dónde estamos</h2><p>{e(lugar)}</p></div>
    <a class="btn-dark" href="{e(destino)}" target="_blank" rel="noopener"><i class="bi bi-geo-alt" aria-hidden="true"></i>Abrir en Google Maps</a>
  </div>
  {aviso}
  <div class="map-embed map-embed--wide" data-reveal>
    <iframe src="{e(url)}" title="Mapa de Google con la ubicación: {e(lugar)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
  </div>
</div></section>'''
    redes = redes_html('social--light')
    cuerpo = f'''{banner('Contacto', 'Hable con nuestro equipo comercial o de operaciones.', 'services/carga-general', 'Tractocamión con plataforma en carretera de montaña', [], pos='center 45%')}
<section class="section" aria-label="Canales de contacto y formulario"><div class="container">
  <div class="row gx-4 gy-5 gx-xl-5">
    <div class="col-lg-5">
      <div class="contact-panel" data-reveal>
        <h2>Canales de atención</h2>
        {contacto_lineas('contact-list')}
        {f'<h3 class="h-small">Redes sociales</h3>{redes}' if redes else ''}
        {mapa}
      </div>
    </div>
    <div class="col-lg-7">
      <form class="quote-form" id="cotizar" novalidate data-quote-form aria-labelledby="t-form">
        <h2 id="t-form">Solicitud de cotización</h2>
        <p class="form-help">Los campos con <span aria-hidden="true">*</span><span class="visually-hidden">asterisco</span> son obligatorios.</p>
        <div class="form-error-summary" data-error-summary tabindex="-1" hidden></div>
        <div class="row g-3">
          <div class="col-md-6 field"><label for="f-nombre">Nombre completo *</label><input id="f-nombre" name="nombre" autocomplete="name" required maxlength="120"><p class="field-err" id="e-nombre"></p></div>
          <div class="col-md-6 field"><label for="f-empresa">Empresa</label><input id="f-empresa" name="empresa" autocomplete="organization" maxlength="120"></div>
          <div class="col-md-6 field"><label for="f-telefono">Teléfono *</label><input id="f-telefono" name="telefono" type="tel" inputmode="tel" autocomplete="tel" required maxlength="20"><p class="field-err" id="e-telefono"></p></div>
          <div class="col-md-6 field"><label for="f-correo">Correo electrónico *</label><input id="f-correo" name="correo" type="email" autocomplete="email" required maxlength="160"><p class="field-err" id="e-correo"></p></div>
          <div class="col-12 field"><label for="f-servicio">Tipo de servicio *</label><select id="f-servicio" name="servicio" required><option value="">Seleccione un servicio</option>{opciones}<option value="otro">Otro / no estoy seguro</option></select><p class="field-err" id="e-servicio"></p></div>
          <div class="col-md-6 field"><label for="f-origen">Ciudad de origen *</label><input id="f-origen" name="origen" autocomplete="off" required maxlength="80"><p class="field-err" id="e-origen"></p></div>
          <div class="col-md-6 field"><label for="f-destino">Ciudad de destino *</label><input id="f-destino" name="destino" autocomplete="off" required maxlength="80"><p class="field-err" id="e-destino"></p></div>
          <div class="col-12 field"><label for="f-carga">Descripción de la carga *</label><textarea id="f-carga" name="carga" rows="3" required maxlength="600" aria-describedby="h-carga"></textarea><p class="field-hint" id="h-carga">Qué es, cómo está empacada, peso y medidas aproximadas.</p><p class="field-err" id="e-carga"></p></div>
          <div class="col-12 field"><label for="f-mensaje">Mensaje</label><textarea id="f-mensaje" name="mensaje" rows="3" maxlength="1000" aria-describedby="h-mensaje"></textarea><p class="field-hint" id="h-mensaje">Fecha estimada del viaje u otra información útil.</p></div>
          <div class="col-12 field field-hp" aria-hidden="true"><label for="f-web">No llene este campo</label><input id="f-web" name="web" tabindex="-1" autocomplete="off"></div>
          <div class="col-12 field field-check"><input id="f-datos" name="datos" type="checkbox" required><label for="f-datos">Autorizo el tratamiento de mis datos personales según la <a href="privacidad.html#tratamiento">política de tratamiento de datos</a>. *</label><p class="field-err" id="e-datos"></p></div>
        </div>
        <button class="btn-cta btn-lg" type="submit" data-submit>Solicitar cotización</button>
        {aviso_envio()}
        <div class="form-status" role="status" aria-live="polite" data-form-status></div>
      </form>
    </div>
  </div>
</div></section>
{ubicacion}'''
    return pagina('contacto.html', f"Contacto y cotizaciones | {MARCA['nombre']}",
                  f"Solicite una cotización de transporte de carga. Teléfono {C['telefonoPrincipal']['mostrar']}, WhatsApp y correo de {MARCA['nombre']}.",
                  'contacto.html', cuerpo, js=('forms',))


def pag_legal(archivo, titulo, secciones, lede):
    cuerpo_secs = ''.join(f'<section aria-labelledby="t-{sid}" id="{sid}"><h2 id="t-{sid}">{e(t)}</h2>{contenido}</section>' for sid, t, contenido in secciones)
    nota = '<p class="note-pend">Texto base pendiente de revisión jurídica y de completar la razón social, el NIT y la dirección del responsable.</p>' if REVISION else ''
    cuerpo = f'''<section class="legal-head"><div class="container narrow"><nav class="crumbs crumbs--dark" aria-label="Ruta de navegación"><ol><li><a href="index.html">Inicio</a></li><li aria-current="page">{e(titulo)}</li></ol></nav><h1>{e(titulo)}</h1><p>{e(lede)}</p>{nota}</div></section>
<section class="section section--tight"><div class="container narrow legal">{cuerpo_secs}</div></section>'''
    return pagina(archivo, f"{titulo} | {MARCA['nombre']}", lede, archivo, cuerpo)


def responsable():
    partes = [MARCA['razonSocial'] or MARCA['nombre']]
    if MARCA['nit']:
        partes.append(f"NIT {MARCA['nit']}")
    if C['direccion']:
        partes.append(C['direccion'])
    contacto = f"correo {C['correo']}" if C['correo'] else ''
    return e(', '.join(partes)), e(contacto)


def pag_privacidad():
    resp, cont = responsable()
    secs = [
        ('privacidad', 'Política de privacidad', f'''<p>Este sitio web pertenece a {resp}. Solo recogemos los datos personales que usted escribe en el formulario de cotización o que nos envía por WhatsApp, teléfono o correo.</p>
<p>El sitio no usa cookies propias de seguimiento. Si se activa Google Analytics, se informará en esta página y se usará solo para medir visitas de forma agregada.</p>
<p>La página de contacto puede mostrar un mapa de Google Maps. Al cargarlo, Google puede usar cookies propias según su política de privacidad.</p>'''),
        ('tratamiento', 'Tratamiento de datos personales', f'''<p>En cumplimiento de la Ley 1581 de 2012 y sus decretos reglamentarios, informamos:</p>
<ul class="check-list">
<li><strong>Responsable:</strong> {resp}{f", {cont}" if cont else ""}.</li>
<li><strong>Datos que tratamos:</strong> nombre, empresa, teléfono, correo electrónico, ciudades de origen y destino, y la descripción de la carga.</li>
<li><strong>Finalidad:</strong> responder su solicitud, preparar y enviar la cotización, coordinar el servicio contratado y comunicarnos con usted sobre él.</li>
<li><strong>Sus derechos:</strong> conocer, actualizar, rectificar y suprimir sus datos, revocar la autorización y presentar quejas ante la Superintendencia de Industria y Comercio.</li>
<li><strong>Cómo ejercerlos:</strong> escriba {f"al {cont}" if cont else "a los canales de contacto de este sitio"} indicando su nombre, su solicitud y un dato de contacto para responderle.</li>
<li><strong>Conservación:</strong> guardamos los datos mientras sean necesarios para la finalidad indicada y para cumplir obligaciones legales.</li>
</ul>
<p>No vendemos ni cedemos sus datos a terceros. Solo los compartimos con quienes participan en la prestación del servicio que usted solicite, cuando sea necesario.</p>'''),
    ]
    return pag_legal('privacidad.html', 'Política de privacidad y tratamiento de datos', secs,
                     'Cómo tratamos los datos personales que usted nos entrega a través de este sitio.')


def pag_terminos():
    resp, _ = responsable()
    secs = [
        ('uso', 'Uso del sitio', f'<p>Este sitio informa sobre los servicios de transporte de carga de {resp}. Al usarlo, usted acepta estos términos.</p>'),
        ('cotizaciones', 'Cotizaciones', '<p>Las solicitudes enviadas desde el sitio no constituyen un contrato de transporte. La cotización, las condiciones del servicio y la tarifa se confirman por escrito antes de cada operación.</p>'),
        ('contenido', 'Contenido e imágenes', '<p>Los textos, el logotipo y el diseño del sitio son de la empresa. Algunas fotografías son de referencia y pueden no corresponder a vehículos u operaciones propias.</p>'),
        ('enlaces', 'Enlaces a terceros', '<p>Los enlaces a WhatsApp, redes sociales u otros sitios llevan a servicios de terceros con sus propias condiciones.</p>'),
        ('ley', 'Ley aplicable', '<p>Estos términos se rigen por las leyes de la República de Colombia.</p>'),
    ]
    return pag_legal('terminos.html', 'Términos y condiciones', secs, 'Condiciones de uso de este sitio web.')


def pag_404():
    cuerpo = f'''<section class="notfound"><div class="container narrow">
  <p class="nf-code" aria-hidden="true">404</p>
  <h1>Esta página no existe</h1>
  <p>La dirección puede estar mal escrita o la página cambió de lugar. Use el menú o vaya a una de estas secciones:</p>
  <div class="btn-row"><a class="btn-cta" href="index.html">Ir al inicio</a><a class="btn-dark" href="servicios.html">Ver servicios</a><a class="btn-dark" href="contacto.html">Contacto</a></div>
</div></section>'''
    return pagina('404.html', f"Página no encontrada | {MARCA['nombre']}", 'La página que busca no existe.', '404.html', cuerpo)


# ---------------------------------------------------------------- salidas auxiliares

def config_js():
    linea = next((w for w in C['whatsapp'] if w.get('cotizaciones')), None)
    datos = {
        'modo': S['modo'],
        'marca': MARCA['nombre'],
        'formEndpoint': S['formEndpoint'] if S['formEndpoint'].startswith('https://') else '',
        'formWhatsapp': S.get('formWhatsapp', True),
        'whatsapp': {'numero': linea['numero'] if linea else '', 'mostrar': linea['mostrar'] if linea else '', 'mensaje': S['whatsappMensaje']},
        'correo': C['correo'],
        'servicios': {s['id']: s['nombre'] for s in SERVICIOS},
    }
    texto = ('/* Generado por tools/build.py desde datos/sitio.json. No editar a mano. */\n'
             f'window.CT = {json.dumps(datos, ensure_ascii=False, indent=2)};\n')
    (RAIZ / 'assets' / 'js' / 'config.js').write_text(texto, encoding='utf-8')


def sitemap(paginas):
    base = DOMINIO or 'https://DOMINIO-POR-CONFIGURAR'
    hoy = datetime.date.today().isoformat()
    urls = ''.join(f'  <url><loc>{base}/{"" if p == "index.html" else p}</loc><lastmod>{hoy}</lastmod></url>\n'
                   for p in paginas if p != '404.html')
    aviso = '' if DOMINIO else '<!-- Configure marca.dominio en datos/sitio.json y ejecute tools/build.py: las URL deben ser absolutas. -->\n'
    (RAIZ / 'sitemap.xml').write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n{aviso}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}</urlset>\n', encoding='utf-8')
    robots = 'User-agent: *\n' + ('Disallow: /\n' if REVISION else 'Allow: /\n')
    robots += f'Sitemap: {base}/sitemap.xml\n'
    (RAIZ / 'robots.txt').write_text(robots, encoding='utf-8')


def favicon():
    destino = IMG / 'logo'
    destino.mkdir(parents=True, exist_ok=True)
    svg = LOGO.replace(' class="brand-mark"', ' xmlns="http://www.w3.org/2000/svg"').replace(' aria-hidden="true" focusable="false"', '')
    (destino / 'favicon.svg').write_text(svg, encoding='utf-8')
    (destino / 'cticol.svg').write_text(svg, encoding='utf-8')


def main():
    favicon()
    config_js()
    hechas = [pag_inicio(), pag_nosotros()]
    if mv_visible():
        hechas.append(pag_mision_vision())
    else:
        (RAIZ / 'mision-vision.html').unlink(missing_ok=True)
    hechas.append(pag_servicios())
    hechas += [pag_servicio(s) for s in SERVICIOS]
    hechas += [pag_flota(), pag_proyectos(), pag_cobertura(), pag_rastreo(), pag_contacto(), pag_privacidad(), pag_terminos(), pag_404()]
    sitemap(hechas)
    print(f"Modo {S['modo']}: {len(hechas)} páginas →", ', '.join(hechas))


if __name__ == '__main__':
    main()
