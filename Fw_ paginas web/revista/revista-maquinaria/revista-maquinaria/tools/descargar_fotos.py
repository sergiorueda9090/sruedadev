"""Descarga fotos de maquinaria de Wikimedia Commons (licencias libres) para la maqueta.

⚠ SOLO PARA MAQUETA. Hay que reemplazarlas por fotos reales de los equipos del cliente.
Las licencias CC BY / CC BY-SA exigen dar crédito: el catálogo y el sitio muestran
autor y licencia tomados de data/fuentes/creditos.json.

Uso: python3 tools/descargar_fotos.py
"""
import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
API = "https://commons.wikimedia.org/w/api.php"
UA = {"User-Agent": "catalogo-maqueta/1.0 (uso educativo)"}

# ref -> (búsqueda, texto que debe contener el nombre del archivo)
FOTOS = {
    "EXC-01": ("hydraulic excavator construction site", "JCB JS220LC hydraulic excavator - 01"),
    "EXC-02": ("hydraulic excavator construction site", "Caterpillar 302.7D excavator"),
    "RET-01": ("backhoe loader", "Terex TLB 825 in Saint Petersburg"),
    "RET-02": ("backhoe loader", "Caterpillar backhoe loader at construction site"),
    "CAR-01": ("wheel loader construction site", "Caterpillar 950k Wheel Loader"),
    "CAR-02": ("wheel loader", "CASE 321F Compact Wheel Loader, Windsor, Ontario, 2025-06-23"),
    "CAR-03": ("skid steer loader", "Bobcat T650 compact track loader"),
    "MOT-01": ("motor grader", "Caterpillar motor grader left"),
    "MOT-02": ("motor grader", "Budowa Velostrady"),
    "COM-01": ("road roller compactor", "Caterpillar CB54B roller"),
    "COM-02": ("road roller compactor", "Ride-on roller compactor"),
    "VOL-01": ("dump truck construction", "Dump Truck - geograph.org.uk - 6465555"),
    "VOL-02": ("tipper truck", "Mercedes-Benz Arocs - dump truck version (1)"),
}


def api(params: dict) -> dict:
    url = API + "?" + urllib.parse.urlencode({"format": "json", **params})
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
        return json.load(r)


def limpiar(html: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html or "")).strip()


def optimizar(ruta: Path, ancho: int = 1000, calidad: int = 80) -> None:
    """Reduce la foto a `ancho` px y la recomprime (catálogo y web más livianos)."""
    try:
        from PIL import Image
    except ImportError:
        return
    im = Image.open(ruta).convert("RGB")
    if im.width > ancho:
        im = im.resize((ancho, round(im.height * ancho / im.width)), Image.LANCZOS)
    im.save(ruta, "JPEG", quality=calidad, optimize=True, progressive=True)


def main() -> None:
    creditos = {}
    for ref, (busqueda, contiene) in FOTOS.items():
        datos = api({
            "action": "query", "generator": "search", "gsrnamespace": 6,
            "gsrsearch": f"{busqueda} filetype:bitmap", "gsrlimit": 20,
            "prop": "imageinfo", "iiprop": "url|extmetadata", "iiurlwidth": 1200,
        })
        paginas = datos.get("query", {}).get("pages", {}).values()
        p = next((p for p in paginas if contiene.lower() in p["title"].lower()), None)
        if not p:
            print(f"✗ {ref}: no se encontró '{contiene}'")
            continue
        ii = p["imageinfo"][0]
        m = ii.get("extmetadata", {})
        destino = RAIZ / "img" / "equipos" / f"{ref.lower()}.jpg"
        req = urllib.request.Request(ii["thumburl"], headers=UA)
        with urllib.request.urlopen(req, timeout=60) as r:
            destino.write_bytes(r.read())
        optimizar(destino)
        creditos[ref] = {
            "archivo": p["title"],
            "autor": limpiar(m.get("Artist", {}).get("value")),
            "licencia": m.get("LicenseShortName", {}).get("value", ""),
            "licencia_url": m.get("LicenseUrl", {}).get("value", ""),
            "pagina": ii.get("descriptionurl", ""),
        }
        print(f"✓ {ref}  {creditos[ref]['licencia']:12s} {creditos[ref]['autor'][:30]:30s} {p['title'][5:70]}")

    (RAIZ / "data" / "fuentes" / "creditos.json").write_text(
        json.dumps(creditos, ensure_ascii=False, indent=2), encoding="utf-8")
    # también como JS para que el catálogo y el sitio muestren los créditos
    (RAIZ / "data" / "creditos.js").write_text(
        "/* Generado por tools/descargar_fotos.py — créditos de fotos (Wikimedia Commons) */\n"
        "window.CREDITOS_FOTOS = " + json.dumps(creditos, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8")


if __name__ == "__main__":
    main()
