"""Descarga fotografías ILUSTRATIVAS de Wikimedia Commons (licencias libres) y las
convierte a WebP. Son temporales: deben reemplazarse por fotografías reales de
Oxi Smart Ingeniería. Las licencias CC BY / CC BY-SA exigen crédito; los créditos
se escriben en assets/js/data/credits.js y el sitio y los PDF los muestran solos.

Uso:  python3 tools/descargar_fotos.py      (requiere Pillow)
"""
import json, re, time, urllib.parse, urllib.request
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
IMG = RAIZ / "assets" / "images"
API = "https://commons.wikimedia.org/w/api.php"
UA = {"User-Agent": "oxi-catalog-builder/1.0 (photo credits tool)"}

# destino (relativo a assets/images) -> título exacto en Commons
FOTOS = {
    "banners/hero-aireadores.webp": "File:Paddlewheel Aerator at a Catfish Farm- Boligee, AL (Greene County).jpg",
    "banners/estanques-aireacion.webp": "File:Aerating a pond at Gavins Point National Fish Hatchery (51238907383).jpg",
    "banners/tilapia-tanque.webp": "File:Tilapia 004.jpg",
    "products/aireador-paletas-estudio.webp": "File:FORJET paddlewheel aerator ( 2HP - 4 impellers ).jpg",
    "products/aireador-paletas-estanque.webp": "File:Aeration in a Fish Pond in Armenia.JPG",
    "products/aireador-paletas-detalle.webp": "File:Fish farm water aeration system idle - 01.JPG",
    "products/aireador-paletas-operacion.webp": "File:Paddlewheel Aerator at a Catfish Farm- Boligee, AL (Greene County).jpg",
    "products/aireador-splash-1.webp": "File:Fish farm water aeration system in operation - 01.JPG",
    "products/aireador-splash-2.webp": "File:Fish Ponds in a Medium Size Fish Farm in Armenia 03.JPG",
    "products/difusor-disco.webp": "File:Image-DiscDiffuser.JPG",
    "products/tanque-circular.webp": "File:Circular Tanks in a Medium size Fish Farm in Armenia 02.JPG",
    "products/geomembrana.webp": "File:Teichbau2-Teichfolie.JPG",
    "products/aireador-inyector.webp": "File:Pond aerator waterbird platform at Matching, Essex, England 01.jpg",
    "products/soplador.webp": "File:P1011540 WP.jpg",
    "products/manguera-difusora.webp": "File:RD-Westmoreland -Fayette Municipal Sewage Authority Plant (20210903-RD-LSC-0276).jpg",
    "products/medidor-oxigeno.webp": "File:Dissolved oxygen meter.jpg",
    "products/tablero-control.webp": "File:Motor control panel for firefighting, Bolid (01).jpg",
    "products/alimentador-automatico.webp": "File:Automatic Fish Feeder (51372009281).jpg",
    "products/alimentador-recarga.webp": "File:Refilling an automatic fish feeder (49647414778).jpg",
    "products/estructura-tanque.webp": "File:Hatchery Tanks at Garrison Dam National Fish Hatchery (51313830533).jpg",
    "products/paletas-repuesto.webp": "File:Paddle Wheel Aerator working.jpg",
    "products/flotadores-aireador.webp": "File:Paddlewheel aerator 2hp.jpg",
    "products/cable-aireadores.webp": "File:Gummischlauchleitung H07RN-F 5G6 Aderendhülsen CEE 2012 04 03.jpg",
}


def api(params):
    url = API + "?" + urllib.parse.urlencode({"format": "json", **params})
    for intento in range(5):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code != 429:
                raise
            time.sleep(10 * (intento + 1))
    raise RuntimeError("Commons no responde (429)")


def limpiar(html):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html or "")).strip()


def descargar(url, destino, ancho):
    for intento in range(5):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=90) as r:
                tmp = destino.with_suffix(".tmp")
                tmp.write_bytes(r.read())
            break
        except urllib.error.HTTPError as e:
            if e.code != 429:
                raise
            time.sleep(10 * (intento + 1))
    im = Image.open(tmp).convert("RGB")
    if im.width > ancho:
        im = im.resize((ancho, round(im.height * ancho / im.width)), Image.LANCZOS)
    im.save(destino, "WEBP", quality=80, method=6)
    tmp.unlink()


def main():
    titulos = list(FOTOS.values())
    datos = api({"action": "query", "titles": "|".join(titulos), "prop": "imageinfo",
                 "iiprop": "url|extmetadata", "iiurlwidth": 2200})
    por_titulo = {p["title"]: p for p in datos["query"]["pages"].values()}
    norm = {n["from"]: n["to"] for n in datos["query"].get("normalized", [])}
    creditos = {}
    for destino, titulo in FOTOS.items():
        p = por_titulo.get(norm.get(titulo, titulo))
        if not p or "imageinfo" not in p:
            print("✗ no encontrada:", titulo)
            continue
        ii = p["imageinfo"][0]
        m = ii.get("extmetadata", {})
        ancho = 2200 if "hero" in destino else (1800 if destino.startswith("banners") else 1400)
        ruta = IMG / destino
        if not ruta.exists():
            descargar(ii.get("thumburl") or ii["url"], ruta, ancho)
            time.sleep(2)
        creditos["assets/images/" + destino] = {
            "titulo": p["title"][5:],
            "autor": limpiar(m.get("Artist", {}).get("value")) or "Autor no indicado",
            "licencia": m.get("LicenseShortName", {}).get("value", ""),
            "fuente": ii.get("descriptionurl", ""),
        }
        print(f"✓ {destino:45s} {creditos['assets/images/' + destino]['licencia']}")
    (RAIZ / "assets/js/data/credits.js").write_text(
        "/* Generado por tools/descargar_fotos.py — créditos de las fotografías ilustrativas.\n"
        "   Al reemplazar una foto por una propia del cliente, borre su entrada (o el archivo completo). */\n"
        "window.OXI = window.OXI || {};\nwindow.OXI.credits = "
        + json.dumps(creditos, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")


if __name__ == "__main__":
    main()
