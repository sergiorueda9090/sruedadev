"""Organiza las fotos reales entregadas por el negocio (carpetas en assets/) en rutas limpias por producto.

- Lee las carpetas originales (nombres con espacios, comas, .webp) sin modificarlas.
- Copia SOLO las fotos de cada referencia a assets/<categoría>/<ref>-<n>.webp, reducidas a 1200 px
  y recomprimidas (mantiene la proporción, sin deformar).
- No usa fotos de otro modelo ni imágenes generadas con IA (ver EXCLUIDAS).

Uso: python3 tools/organizar_fotos.py
"""
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
A = RAIZ / "assets"

# ref -> (categoría destino, carpeta original, [archivos en orden: el primero es la foto principal])
# Un archivo con "/" se toma relativo a assets/ (para fotos del mismo modelo guardadas en otra carpeta).
FOTOS = {
    "SX2128": ("carros-electricos", "Carro Eléctrico - Jeep Speed 4x4",
               ["SX2128_1.webp", "SX2128.webp", "SX2128_2.webp", "SX2128_4.webp", "SX2128_3.webp", "SX2128_5.webp"]),
    "X15A": ("carros-electricos", "Carro Eléctrico - Jeep Wrangler",
             ["X15A_1.webp", "X15A.webp", "X15A_2.webp", "X15A_3.webp", "X15A_4.webp"]),
    "FT699": ("carros-electricos", "Carro eléctrico - Camioneta eléctrica para niños",
              ["JeepinfantilelectricotodoterrenoSuper.webp", "camioneta_1.webp", "Jeepelectricoinfantilconmedidas_3.webp"]),
    "017": ("carros-electricos", "Carro eléctrico - Jeep Running 4x4 para niños", ["017_VERDE.webp"]),
    "S313": ("carros-electricos", "Carro eléctrico - Jeep Wrangler 4x4 para niños",
             ["S313_ESTRELLA_2.webp", "S313_ESTRELLA_1.webp", "S313_ESTRELLA_3.webp", "Jeep_infantil_rosa_todoterreno_4WD.webp",
              "S313_ESTRELLA_6.webp", "S313_ESTRELLA_4.webp", "S313_ESTRELLA_5.webp", "S313_ESTRELLA_7.webp",
              "Jeepelectricoinfantilrosatodoterrenoconmedidas_1.webp"]),
    "UNIMOG": ("carros-electricos", "Carro Eléctrico para niño Campero Mercedes Benz Unimog Rojo",
               ["23.webp", "22.webp", "24.webp", "AnyConv.com__IMG_0733_Editada-963842.webp", "AnyConv.com__IMG_0720_Editada.webp",
                "AnyConv.com__IMG_0714_Editada.webp", "AnyConv.com__IMG_0707_Editada.webp", "AnyConv.com__IMG_0705_Editada.webp",
                "AnyConv.com__IMG_0739_Editada.webp"]),
    "S618": ("carros-electricos", "Jeep Rubicun 4x4 12V Milen | Carro Eléctrico Infantil para Niños",
             ["Carro Eléctrico - Jeep Speed 4x4/S618_RUBICUN_1.webp", "Jeepinfantiltodoterrenoconmedidas_1.webp"]),
    "MA010": ("cuatrimotos", "Cuatrimoto a gasolina 2T, 50 CC ",
              ["MA010_1.webp", "MA010.webp", "MA010_2.webp", "ATVazulconmedidastecnicas_1.webp", "MA010_3.webp"]),
    "ATV008": ("cuatrimotos", "Cuatrimoto a gasolina 4T, 125CC",
               ["ATV008_3.webp", "ATV008_1.webp", "ATV008.webp", "ATV008_2.webp", "InfografiadeATVdeportivoconmedidas.webp"]),
    "ATV011": ("cuatrimotos", "Cuatrimoto a gasolina 4T, 180CC",
               ["atv011_1.webp", "Cuatrimototodoterrenoconmedidas.webp"]),
    "KMV502": ("vehiculos-gasolina", "Moto Cross a gasolina 4T 110cc",
               ["AnyConv.com__KMV502.webp", "AnyConv.com__KMV5021.webp"]),
    "DB-005": ("vehiculos-gasolina", "Motocross a gasolina 2T, 60cc",
               ["DB-005_ROJO.webp", "DB-005_ROJO_1.webp", "DB-005_AZUL.webp", "DB-005_AZUL_1.webp",
                "DB-005_NARANJA.webp", "DB-005_NARANJA_1.webp", "DB-005_ROSA.webp", "DB-005_ROSA_1.webp"]),
    "KXD708": ("vehiculos-gasolina", "Potente moto de cross KMV 23",
               [f"KXD708KMVMotoCross2T50cc-13-594830_{i}.webp" for i in (1, 2, 3, 4, 7)]),
    # assets/motos_wow (entregadas sin referencia: claves provisionales, confirmar con el negocio)
    "MCE-83": ("motos-electricas", "motos_wow",
               ["m2.png", "m_1.png", "m_3.png", "m_4.png", "m_5.png", "m_v_1.png", "m_v_2.png", "m_v_3.png", "m_v_4.png"]),
    "ME-68": ("motos-electricas", "motos_wow", ["shopping_3_1.webp", "shopping_3_3.webp", "shopping_3_2.webp", "shopping_5_1.webp"]),
    "MT3": ("motos-electricas", "motos_wow", ["shopping_4_4.webp", "shopping_4_2.webp", "shopping_4_3.webp", "shopping_4_1.webp"]),
    "MQ-01": ("cuatrimotos", "motos_wow",
              ["shopping_m_1.webp", "shopping_m_3.webp", "shopping_m_2.webp", "shopping_m_5.webp", "shopping_m_4.webp"]),
    # assets/motos_wow/moto_gasolina_* (sin referencia: claves provisionales)
    "MC-NK": ("vehiculos-gasolina", "motos_wow", ["moto_gasolina_2.jpeg", "moto_gasolina_3.jpeg"]),
    "MC-27": ("vehiculos-gasolina", "motos_wow", ["moto_gasolina_6.jpeg"]),
    "MC-MB": ("vehiculos-gasolina", "motos_wow", ["moto_gasolina_1.webp"]),
    "PB-01": ("vehiculos-gasolina", "motos_wow", ["moto_gasolina_7.jpeg"]),
    "PB-02": ("vehiculos-gasolina", "motos_wow", ["moto_gasolina_8.webp"]),
}

# Fotos que NO se usan y por qué (también se listan en el README)
EXCLUIDAS = {
    "Carro Eléctrico - Jeep Speed 4x4": "Toyota Hilux (rosada y roja) y el jeep blanco de detalles verdes son OTROS modelos sin carpeta propia",
    "Cuatrimoto a gasolina 2T, 50 CC /KXD702_6.webp": "otro modelo de cuatrimoto",
    "Moto Cross a gasolina KMV 2T 50cc": "imágenes generadas con IA (ChatGPT); se usan las fotos reales de KXD708",
    "Jeep Rubicun 4x4 12V Milen | …/ChatGPT*": "12 imágenes generadas con IA; se usan la foto real S618_RUBICUN_1 y la infografía",
    "motos_wow/shopping_mm_*": "Yamaha Raptor: cuatrimoto de adulto con logo de Yamaha; mm_2 y mm_3 parecen generadas con IA",
    "motos_wow/shopping_5_2.webp": "miniatura de 64 px (repetida)",
    "motos_wow/moto_gasolina_4.jpeg": "pocket bike con el logo de otra tienda (Planet Outlet)",
    "motos_wow/moto_gasolina_5.png": "es la moto ELÉCTRICA MCE-83 (ya publicada), no una de gasolina",
    "motos_wow/moto_gasolina_9.jpeg": "archivo idéntico a moto_gasolina_3.jpeg",
    "motos_wow/moto_gasolina_11–17": "fotos de ambiente (niños corriendo); parecen generadas con IA y no muestran un modelo del catálogo",
}


# Banners y fotos de ambiente de la página web: archivo original -> nombre limpio (se generan en 800 y 1600 px)
BANNERS = {
    "motos_kids_1.webp": "banner-cuatrimotos",
    "motos_kids_2.webp": "banner-mini-quads",
    "motos_kids_3.webp": "banner-kmv",
    "motos_kids_4.jpeg": "ambiente-moto-cross",
    "motos_kids_5.jpeg": "ambiente-cuatrimoto",
}


def copiar(origen: Path, destino: Path, ancho: int = 1200, calidad: int = 84) -> None:
    im = Image.open(origen)
    if im.mode in ("P", "LA", "RGBA") or "transparency" in im.info:
        # PNG recortado: el fondo transparente pasa a blanco (no al color de la paleta)
        im = im.convert("RGBA")
        fondo = Image.new("RGBA", im.size, "white")
        fondo.alpha_composite(im)
        im = fondo
    im = im.convert("RGB")
    if im.width > ancho:
        im = im.resize((ancho, round(im.height * ancho / im.width)), Image.LANCZOS)
    destino.parent.mkdir(parents=True, exist_ok=True)
    im.save(destino, "WEBP", quality=calidad, method=6)


def main() -> None:
    for ref, (categoria, carpeta, archivos) in FOTOS.items():
        for n, nombre in enumerate(archivos, 1):
            origen = A / nombre if "/" in nombre else A / carpeta / nombre
            if not origen.exists():
                print(f"✗ {ref}: falta {carpeta}/{nombre}")
                continue
            destino = A / categoria / f"{ref.lower()}-{n}.webp"
            copiar(origen, destino)
        print(f"✓ {ref}: {len(archivos)} fotos → assets/{categoria}/")
    for origen, nombre in BANNERS.items():
        if not (A / origen).exists():
            print(f"✗ banner: falta {origen}")
            continue
        for ancho in (800, 1600):
            copiar(A / origen, A / "banners" / f"{nombre}-{ancho}.webp", ancho=ancho, calidad=82)
        print(f"✓ banner {origen} → assets/banners/{nombre}-800/1600.webp")


if __name__ == "__main__":
    main()
