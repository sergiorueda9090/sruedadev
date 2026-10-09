import json
from pathlib import Path

from django.http import Http404, HttpResponse, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.http import require_POST

from . import data

PORTAFOLIO_PAGES_DIR = Path(__file__).resolve().parent / "portafolio_pages"
PROYECTOS_POR_PAGINA = 6

# Dominio de publicación. Se usa para construir URLs absolutas en el sitemap
# y en robots.txt, que no dependen de `request.get_host()` porque deben ser
# correctas incluso si el sitio se visita antes de que el dominio final esté
# resuelto, o detrás de un proxy/túnel en desarrollo.
DOMINIO = "https://sruedadev.com"

# Solo estos slugs tienen una página propia servida por Django.
PROYECTOS_SLUGS = {p["slug"] for p in data.PROYECTOS}
PLANES_POR_SLUG = {p["slug"]: p for p in data.PLANES}


def _proyectos_paginados():
    proyectos = []
    for proyecto in data.PROYECTOS:
        proyecto = dict(proyecto)
        proyecto["url"] = reverse("core:portafolio_detalle", args=[proyecto["slug"]])
        proyectos.append(proyecto)

    return [
        proyectos[i:i + PROYECTOS_POR_PAGINA]
        for i in range(0, len(proyectos), PROYECTOS_POR_PAGINA)
    ]


def home(request):
    contexto = {
        "proceso": data.PROCESO,
        "proyectos_paginas": _proyectos_paginados(),
        "planes": data.PLANES,
        "faq": data.FAQ,
        "testimonios": data.TESTIMONIOS,
        "clientes": data.CLIENTES,
        "servicios_interes": data.SERVICIOS_INTERES,
        "presupuestos": data.PRESUPUESTOS,
    }
    return render(request, "core/index.html", contexto)


def portafolio_detalle(request, slug):
    if slug not in PROYECTOS_SLUGS:
        raise Http404("Proyecto no encontrado")

    archivo = PORTAFOLIO_PAGES_DIR / ("%s.html" % slug)
    contenido = archivo.read_text(encoding="utf-8")
    return HttpResponse(contenido)


def nosotros(request):
    contexto = {"proceso": data.PROCESO}
    return render(request, "core/nosotros.html", contexto)


def terminos(request):
    return render(request, "core/legal/terminos.html")


def privacidad(request):
    return render(request, "core/legal/privacidad.html")


def cookies(request):
    return render(request, "core/legal/cookies.html")


def servicio_detalle(request, slug):
    servicio = PLANES_POR_SLUG.get(slug)
    if servicio is None:
        raise Http404("Servicio no encontrado")

    url_servicio = DOMINIO + reverse("core:servicio_detalle", args=[slug])

    # JSON-LD generado en la vista (no en la plantilla) para no depender del
    # escapado automático de Django al construir JSON a mano: los textos de
    # cada servicio vienen de data.py, pero cualquiera con comillas o saltos
    # de línea rompería un JSON armado con {{ }} sueltos en el template.
    service_jsonld = json.dumps({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": servicio["titulo"],
        "description": servicio["descripcion"],
        "url": url_servicio,
        "provider": {
            "@type": "ProfessionalService",
            "name": "sruedadev.com",
            "url": DOMINIO,
        },
        "areaServed": {"@type": "Country", "name": "Colombia"},
    }, ensure_ascii=False)

    breadcrumb_jsonld = json.dumps({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Inicio", "item": DOMINIO + "/"},
            {"@type": "ListItem", "position": 2, "name": "Servicios", "item": DOMINIO + "/#planes"},
            {"@type": "ListItem", "position": 3, "name": servicio["titulo"], "item": url_servicio},
        ],
    }, ensure_ascii=False)

    contexto = {
        "servicio": servicio,
        "proceso": data.PROCESO,
        "service_jsonld": service_jsonld,
        "breadcrumb_jsonld": breadcrumb_jsonld,
    }
    return render(request, "core/servicio_detalle.html", contexto)


@require_POST
def contacto(request):
    datos = request.POST
    errores = {}

    nombre = datos.get("nombre", "").strip()
    email = datos.get("email", "").strip()
    mensaje = datos.get("mensaje", "").strip()
    acepta = datos.get("aceptaTerminos")
    trampa = datos.get("sitioWeb", "").strip()

    if trampa:
        # Campo honeypot relleno: probablemente un bot, respondemos como si todo hubiera ido bien.
        return JsonResponse({"ok": True, "mensaje": "¡Gracias! Recibimos tu solicitud."})

    if not nombre:
        errores["nombre"] = "Cuéntanos tu nombre."
    if not email:
        errores["email"] = "Necesitamos un correo para responderte."
    if not mensaje:
        errores["mensaje"] = "Cuéntanos brevemente qué necesitas."
    if not acepta:
        errores["aceptaTerminos"] = "Debes aceptar los términos y la política de privacidad."

    if errores:
        return JsonResponse({"ok": False, "errores": errores}, status=400)

    return JsonResponse({
        "ok": True,
        "mensaje": "¡Gracias, %s! Recibimos tu solicitud y te responderemos pronto." % nombre,
    })


def robots_txt(request):
    lineas = [
        "User-agent: *",
        "Allow: /",
        "",
        "Sitemap: %s/sitemap.xml" % DOMINIO,
    ]
    return HttpResponse("\n".join(lineas), content_type="text/plain")


def sitemap_xml(request):
    # Sin modelos ni CMS, el sitemap se arma a mano a partir de las mismas
    # fuentes de verdad que usan las vistas (data.py): no hay forma de que se
    # desincronice de lo que Django realmente sirve. No se incluye <lastmod>
    # porque no hay fecha real de última edición que reportar.
    urls = [DOMINIO + "/"]
    urls += [
        DOMINIO + reverse(nombre)
        for nombre in (
            "core:nosotros", "core:terminos", "core:privacidad", "core:cookies",
        )
    ]
    urls += [
        DOMINIO + reverse("core:servicio_detalle", args=[plan["slug"]])
        for plan in data.PLANES
    ]
    urls += [
        DOMINIO + reverse("core:portafolio_detalle", args=[proyecto["slug"]])
        for proyecto in data.PROYECTOS
    ]

    partes = ['<?xml version="1.0" encoding="UTF-8"?>']
    partes.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    for url in urls:
        partes.append("<url><loc>%s</loc></url>" % url)
    partes.append("</urlset>")

    return HttpResponse("\n".join(partes), content_type="application/xml")
