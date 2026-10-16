import json
from pathlib import Path
from urllib.parse import quote_plus

from django.http import Http404, HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.templatetags.static import static as static_url
from django.urls import reverse
from django.views.decorators.http import require_POST

from . import data

PORTAFOLIO_PAGES_DIR = Path(__file__).resolve().parent / "portafolio_pages"

# Dominio de publicación. Se usa para construir URLs absolutas en el sitemap
# y en robots.txt, que no dependen de `request.get_host()` porque deben ser
# correctas incluso si el sitio se visita antes de que el dominio final esté
# resuelto, o detrás de un proxy/túnel en desarrollo.
DOMINIO = "https://sruedadev.com"

# Solo estos slugs tienen una página propia servida por Django.
PROYECTOS_POR_SLUG = {p["slug"]: p for p in data.PROYECTOS}
PLANES_POR_SLUG = {p["slug"]: p for p in data.PLANES}
CATEGORIAS_POR_SLUG = {c["slug"]: c for c in data.CATEGORIAS_PORTAFOLIO}


def _url_proyecto(proyecto):
    # Los proyectos "sitio_estatico" son sitios multi-página con sus propios
    # css/js/imágenes: se sirven tal cual desde static/core/portafolio_sitios/
    # en vez de por portafolio_detalle, que solo sabe devolver un .html suelto.
    if proyecto.get("sitio_estatico"):
        return static_url("core/portafolio_sitios/%s/index.html" % proyecto["slug"])
    # "caso_estudio": proyecto propio sin sitio público todavía (ver portafolio_caso).
    if proyecto.get("caso_estudio"):
        return reverse("core:portafolio_caso", args=[proyecto["slug"]])
    return reverse("core:portafolio_detalle", args=[proyecto["slug"]])

# Mensaje precargado del botón de WhatsApp en /salud/. El número sigue
# viniendo de data.WHATSAPP_NUMERO vía el context processor: aquí solo se
# codifica el texto para el enlace wa.me.
SALUD_WHATSAPP_MENSAJE = (
    "Hola Sergio, vi la página de salud y quiero información sobre la "
    "Landing Salud Express"
)
SALUD_WHATSAPP_TEXTO = quote_plus(SALUD_WHATSAPP_MENSAJE)


def _categorias_con_conteo():
    categorias = []
    for categoria in data.CATEGORIAS_PORTAFOLIO:
        categoria = dict(categoria)
        categoria["url"] = reverse("core:portafolio_categoria", args=[categoria["slug"]])
        categoria["total_proyectos"] = sum(
            1 for p in data.PROYECTOS if p["categoria_slug"] == categoria["slug"]
        )
        categorias.append(categoria)
    return categorias


def home(request):
    contexto = {
        "proceso": data.PROCESO,
        "categorias_portafolio": _categorias_con_conteo(),
        "planes": data.PLANES,
        "faq": data.FAQ,
        "testimonios": data.TESTIMONIOS,
        "clientes": data.CLIENTES,
        "servicios_interes": data.SERVICIOS_INTERES,
        "presupuestos": data.PRESUPUESTOS,
    }
    return render(request, "core/index.html", contexto)


def portafolio_categoria(request, slug):
    categoria = CATEGORIAS_POR_SLUG.get(slug)
    if categoria is None:
        raise Http404("Categoría no encontrada")

    proyectos = []
    for proyecto in data.PROYECTOS:
        if proyecto["categoria_slug"] != slug:
            continue
        proyecto = dict(proyecto)
        proyecto["url"] = _url_proyecto(proyecto)
        proyectos.append(proyecto)

    contexto = {
        "categoria": categoria,
        "proyectos": proyectos,
    }
    return render(request, "core/portafolio_categoria.html", contexto)


def portafolio_detalle(request, slug):
    proyecto = PROYECTOS_POR_SLUG.get(slug)
    if proyecto is None:
        raise Http404("Proyecto no encontrado")

    # Los "sitio_estatico" no tienen .html en portafolio_pages: viven en
    # static/core/portafolio_sitios/. Se redirige a su URL real en vez de
    # devolver 404.
    if proyecto.get("sitio_estatico") or proyecto.get("caso_estudio"):
        return redirect(_url_proyecto(proyecto))

    archivo = PORTAFOLIO_PAGES_DIR / ("%s.html" % slug)
    if not archivo.exists():
        raise Http404("Proyecto no encontrado")
    contenido = archivo.read_text(encoding="utf-8")
    return HttpResponse(contenido)


def portafolio_caso(request, slug):
    proyecto = PROYECTOS_POR_SLUG.get(slug)
    if proyecto is None or not proyecto.get("caso_estudio"):
        raise Http404("Proyecto no encontrado")

    contexto = {"proyecto": proyecto}
    return render(request, "core/portafolio_caso.html", contexto)


def salud(request):
    caso_exito = next(
        (dict(p) for p in data.PROYECTOS if p["slug"] == "dentalsmile-consultorio"),
        None,
    )
    if caso_exito is not None:
        caso_exito["url"] = reverse("core:portafolio_detalle", args=[caso_exito["slug"]])

    contexto = {
        "whatsapp_texto_salud": SALUD_WHATSAPP_TEXTO,
        "caso_exito": caso_exito,
    }
    return render(request, "core/salud.html", contexto)


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
        "Disallow: /admin/",
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
            "core:salud",
        )
    ]
    urls += [
        DOMINIO + reverse("core:servicio_detalle", args=[plan["slug"]])
        for plan in data.PLANES
    ]
    urls += [
        DOMINIO + reverse("core:portafolio_categoria", args=[categoria["slug"]])
        for categoria in data.CATEGORIAS_PORTAFOLIO
    ]
    urls += [
        DOMINIO + _url_proyecto(proyecto)
        for proyecto in data.PROYECTOS
        if not proyecto.get("sitio_estatico")
    ]

    partes = ['<?xml version="1.0" encoding="UTF-8"?>']
    partes.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    for url in urls:
        partes.append("<url><loc>%s</loc></url>" % url)
    partes.append("</urlset>")

    return HttpResponse("\n".join(partes), content_type="application/xml")
