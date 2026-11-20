"""Genera las ilustraciones SVG de los productos (Revista Digitar · Boutique Erótica).

No son fotografías: son ilustraciones de línea, discretas y no explícitas,
marcadas "IMAGEN ILUSTRATIVA" para que nadie las confunda con la foto real
del producto. Cuando el cliente entregue las fotos comerciales, se guardan en
img/productos/<ref>.jpg y se actualiza "foto" en data/productos.js.

Uso: python3 tools/generar_placeholders.py
"""
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

ORO = "#C9A45C"
VINO = "#7A1436"

# fondo (degradado), color del trazo, color de detalle, color del sello
TEMAS = {
    "lenceria":   ("#8A1A41", "#3A0A1C", ORO,  "#F6C9D8", "#F6E3EA"),
    "juguetes":   ("#FBEFF3", "#EBC0D0", VINO, "#D63A78", VINO),
    "parejas":    ("#C02C64", "#5E0F2E", "#FBE7C6", ORO, "#FBE7C6"),
    "cosmetica":  ("#FFF8FA", "#F2D3DE", VINO, ORO, VINO),
    "bienestar":  ("#3A1220", "#160810", ORO,  "#E7739F", "#F0D9A8"),
    "juegos":     ("#D63A78", "#7A1436", "#FFF3F7", ORO, "#FFF3F7"),
    "accesorios": ("#F6E3EA", "#E2B3C4", VINO, ORO, VINO),
}

# ---- motivos: dibujados alrededor de (0,0), aprox. ±140 px ----
M = {
"brasier": """
  <path d="M-125 -10 C-120 55 -20 60 0 5 C20 60 120 55 125 -10"/>
  <path d="M-125 -10 C-110 -55 -40 -60 0 5 M125 -10 C110 -55 40 -60 0 5"/>
  <path d="M-150 25 L-125 -10 M150 25 L125 -10"/>
  <path d="M-95 -45 L-80 -120 M95 -45 L80 -120"/>
  <path class="d" d="M-75 20 q20 -18 40 0 q20 -18 40 0 M35 20 q20 -18 40 0"/>
  <path class="d" d="M0 -5 l-12 -12 m12 12 l12 -12"/>""",
"body": """
  <path d="M-55 -130 L-70 -60 C-80 -10 -60 40 -70 80 L-35 125 L35 125 L70 80 C60 40 80 -10 70 -60 L55 -130"/>
  <path d="M-70 -60 C-30 -30 30 -30 70 -60"/>
  <path class="d" d="M-60 0 q15 -12 30 0 q15 -12 30 0 q15 -12 30 0 q15 -12 30 0"/>
  <path class="d" d="M-50 40 q12 -10 25 0 q12 -10 25 0 q12 -10 25 0 q12 -10 25 0"/>""",
"babydoll": """
  <path d="M-45 -135 L-55 -60 M45 -135 L55 -60"/>
  <path d="M-55 -60 C-35 -35 -10 -40 0 -55 C10 -40 35 -35 55 -60"/>
  <path d="M-55 -60 L-130 120 Q0 145 130 120 L55 -60"/>
  <path class="d" d="M-60 -30 C-20 -15 20 -15 60 -30"/>
  <path class="d" d="M-115 95 q20 15 40 0 q20 15 40 0 q20 15 40 0 q20 15 40 0 q20 15 40 0"/>""",
"kimono": """
  <path d="M-50 -135 L-140 -80 L-115 0 L-80 -20 L-80 130 L80 130 L80 -20 L115 0 L140 -80 L50 -135"/>
  <path d="M-50 -135 L20 30 M50 -135 L-20 30"/>
  <path d="M-80 20 L80 20"/>
  <path class="d" d="M0 20 l-35 70 M0 20 l30 75 M0 20 m-14 0 a14 10 0 1 0 28 0 a14 10 0 1 0 -28 0"/>""",
"liguero": """
  <path d="M-120 -90 C-60 -60 60 -60 120 -90 L110 -40 C55 -15 -55 -15 -110 -40 Z"/>
  <path d="M-95 -30 L-80 40 M95 -30 L80 40 M-45 -18 L-40 40 M45 -18 L40 40"/>
  <path d="M-95 40 L-75 140 M-25 40 L-30 140 M25 40 L30 140 M95 40 L75 140"/>
  <path class="d" d="M-95 40 C-70 52 -45 52 -25 40 M25 40 C45 52 70 52 95 40"/>
  <path class="d" d="M0 -40 l-18 -14 v28 z M0 -40 l18 -14 v28 z"/>""",
"masajeador": """
  <g transform="rotate(-35)">
    <rect x="-24" y="-20" width="48" height="160" rx="24"/>
    <ellipse cx="0" cy="-70" rx="48" ry="55"/>
    <path class="d" d="M-24 60 h48 M0 95 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0"/>
  </g>""",
"huevo": """
  <ellipse cx="-50" cy="0" rx="55" ry="75"/>
  <path d="M-50 75 C-40 110 0 115 30 100"/>
  <rect x="45" y="-40" width="80" height="120" rx="30"/>
  <circle class="d" cx="85" cy="0" r="14"/>
  <path class="d" d="M85 35 v20 M75 45 h20"/>""",
"succion": """
  <g transform="rotate(-20)">
    <path d="M-70 -95 C-20 -140 70 -120 80 -40 C90 40 60 120 0 125 C-60 120 -95 50 -95 -10 C-95 -50 -88 -80 -70 -95 Z"/>
    <ellipse cx="0" cy="-70" rx="34" ry="22"/>
    <path class="d" d="M-30 40 h60 M0 15 v50"/>
  </g>""",
"bala": """
  <g transform="rotate(-25)">
    <rect x="-38" y="-120" width="76" height="200" rx="38"/>
    <path class="d" d="M-38 40 h76 M0 60 v20"/>
  </g>
  <path class="d" d="M80 -100 l0 30 M65 -85 l30 0"/>""",
"regalo": """
  <rect x="-115" y="-25" width="230" height="140" rx="6"/>
  <rect x="-130" y="-65" width="260" height="40" rx="6"/>
  <path d="M0 -65 V115"/>
  <path class="d" d="M0 -65 C-30 -130 -100 -110 -60 -70 Z M0 -65 C30 -130 100 -110 60 -70 Z"/>
  <path class="d" d="M-70 50 q15 -18 30 0 q15 -18 30 0 l-30 30 z"/>""",
"anillo": """
  <circle cx="0" cy="15" r="85"/>
  <circle cx="0" cy="15" r="58"/>
  <rect x="-35" y="-115" width="70" height="50" rx="22"/>
  <path class="d" d="M-120 -80 q-12 -10 -24 0 M120 -80 q12 -10 24 0 M-130 -60 q-22 -18 -44 0 M130 -60 q22 -18 44 0"/>""",
"u": """
  <path d="M-90 -110 C-115 -20 -95 100 0 110 C95 100 115 0 90 -60"/>
  <path d="M-55 -110 C-75 -30 -60 70 0 75 C60 70 75 0 55 -60"/>
  <path d="M-90 -110 C-80 -125 -60 -125 -55 -110 M90 -60 C85 -80 60 -80 55 -60"/>
  <circle class="d" cx="0" cy="92" r="6"/>""",
"esposas": """
  <circle cx="-75" cy="30" r="58"/>
  <circle cx="75" cy="30" r="58"/>
  <circle cx="-75" cy="30" r="40"/>
  <circle cx="75" cy="30" r="40"/>
  <path class="d" d="M-25 -20 q12 -25 25 0 q12 -25 25 0"/>
  <path class="d" d="M-120 -95 C-60 -135 60 -135 120 -95"/>""",
"frasco_bomba": """
  <rect x="-60" y="-40" width="120" height="170" rx="22"/>
  <rect x="-25" y="-75" width="50" height="35" rx="6"/>
  <path d="M0 -75 V-105 H55 V-92"/>
  <path class="d" d="M-30 35 h60 M-30 60 h40"/>
  <path class="d" d="M0 0 q-14 -14 -24 -2 q-6 10 24 30 q30 -20 24 -30 q-10 -12 -24 2"/>""",
"frasco_gotero": """
  <path d="M-55 -20 h110 v130 a20 20 0 0 1 -20 20 h-70 a20 20 0 0 1 -20 -20 Z"/>
  <rect x="-22" y="-55" width="44" height="35" rx="4"/>
  <path d="M-12 -55 C-14 -110 14 -110 12 -55"/>
  <path class="d" d="M0 30 q-22 30 0 50 q22 -20 0 -50"/>""",
"tubo": """
  <path d="M-55 -120 h110 l-20 210 h-70 Z"/>
  <rect x="-38" y="90" width="76" height="40" rx="6"/>
  <path class="d" d="M-40 -95 h80 M-30 -10 h60 M-25 20 h50"/>
  <path class="d" d="M0 -60 q-16 -16 -26 -2 q-6 12 26 32 q32 -20 26 -32 q-10 -14 -26 2"/>""",
"limpiador": """
  <path d="M-50 -40 h100 v160 a15 15 0 0 1 -15 15 h-70 a15 15 0 0 1 -15 -15 Z"/>
  <path d="M-20 -40 v-30 h40 v30 M20 -60 h45 l10 -15"/>
  <path class="d" d="M95 -90 l18 -8 M100 -70 l22 0 M95 -50 l18 8"/>
  <path class="d" d="M-25 30 l18 18 l35 -40"/>""",
"caja": """
  <path d="M-120 -40 L0 -90 L120 -40 L120 85 L0 135 L-120 85 Z"/>
  <path d="M-120 -40 L0 10 L120 -40 M0 10 V135"/>
  <path class="d" d="M60 40 q-14 -14 -24 -2 q-6 10 24 30 q30 -20 24 -30 q-10 -12 -24 2"/>""",
"vela": """
  <path d="M-85 -20 v120 a20 20 0 0 0 20 20 h130 a20 20 0 0 0 20 -20 v-120"/>
  <ellipse cx="0" cy="-20" rx="85" ry="22"/>
  <path d="M0 -25 v-25"/>
  <path class="d" d="M0 -55 C-25 -85 -5 -115 0 -135 C8 -110 28 -85 0 -55 Z"/>
  <path class="d" d="M-45 55 q-12 -12 -22 -2 q-6 10 22 26 q28 -16 22 -26 q-10 -10 -22 2"/>""",
"spray": """
  <rect x="-55" y="-30" width="110" height="160" rx="30"/>
  <rect x="-18" y="-70" width="36" height="40" rx="6"/>
  <path d="M18 -60 h20"/>
  <path class="d" d="M60 -75 l25 -10 M62 -60 h30 M60 -45 l25 10 M95 -90 l10 -4 M100 -60 h10"/>
  <path class="d" d="M0 45 q-18 -18 -30 -2 q-8 12 30 36 q38 -24 30 -36 q-12 -16 -30 2"/>""",
"tarro": """
  <rect x="-80" y="-40" width="160" height="165" rx="26"/>
  <rect x="-90" y="-80" width="180" height="40" rx="10"/>
  <g class="d">
    <circle cx="-35" cy="30" r="6"/><circle cx="10" cy="10" r="5"/><circle cx="40" cy="55" r="7"/>
    <circle cx="-15" cy="80" r="5"/><circle cx="-50" cy="95" r="4"/><circle cx="35" cy="95" r="5"/>
  </g>""",
"polvo": """
  <ellipse cx="-30" cy="60" rx="100" ry="28"/>
  <path d="M-130 60 v30 a100 28 0 0 0 200 0 v-30"/>
  <path class="d" d="M60 40 C90 -30 120 -80 135 -130 C110 -110 80 -60 60 40 Z"/>
  <path class="d" d="M62 30 l40 -40 M70 0 l45 -50 M82 -30 l38 -55"/>""",
"dados": """
  <path d="M-130 -20 L-70 -50 L-10 -20 L-70 10 Z M-130 -20 V60 L-70 90 V10 M-10 -20 V60 L-70 90"/>
  <path d="M10 -40 L80 -75 L140 -40 L70 -5 Z M10 -40 V45 L70 80 V-5 M140 -40 V45 L70 80"/>
  <g class="d">
    <circle cx="-70" cy="-20" r="7"/><circle cx="-105" cy="25" r="6"/><circle cx="-90" cy="55" r="6"/>
    <circle cx="-40" cy="20" r="6"/><circle cx="-30" cy="55" r="6"/>
    <circle cx="60" cy="-55" r="6"/><circle cx="95" cy="-30" r="6"/><circle cx="40" cy="20" r="6"/><circle cx="105" cy="25" r="6"/>
  </g>""",
"cartas": """
  <g transform="rotate(-18 0 60)"><rect x="-60" y="-110" width="120" height="170" rx="12"/></g>
  <g transform="rotate(14 0 60)"><rect x="-60" y="-110" width="120" height="170" rx="12"/></g>
  <path class="d" d="M18 -20 q-22 -22 -36 -2 q-8 14 36 44 q44 -30 36 -44 q-14 -20 -36 2"/>
  <path class="d" d="M38 -85 l8 -14 l8 14 l-8 14 z"/>""",
"ruleta": """
  <circle cx="0" cy="0" r="120"/>
  <circle cx="0" cy="0" r="25"/>
  <path d="M0 -120 V-25 M0 25 V120 M-120 0 H-25 M25 0 H120 M-85 -85 L-18 -18 M18 18 L85 85 M85 -85 L18 -18 M-18 18 L-85 85"/>
  <path class="d" d="M0 -150 l-14 -22 h28 z"/>
  <path class="d" d="M-60 -35 q-8 -8 -15 -1 q-4 7 15 18 q19 -11 15 -18 q-7 -7 -15 1"/>""",
"cupones": """
  <path d="M-140 -60 h280 v35 a22 22 0 0 0 0 44 v35 h-280 v-35 a22 22 0 0 0 0 -44 Z"/>
  <path d="M60 -60 v114" stroke-dasharray="10 10"/>
  <path class="d" d="M-40 -10 q-22 -22 -36 -2 q-8 14 36 44 q44 -30 36 -44 q-14 -20 -36 2"/>
  <path d="M-130 80 h260" opacity=".5"/>""",
"antifaz": """
  <path d="M-140 -10 C-130 -70 -40 -70 0 -30 C40 -70 130 -70 140 -10 C130 50 50 60 0 20 C-50 60 -130 50 -140 -10 Z"/>
  <path d="M-95 -15 C-80 -35 -50 -35 -38 -10 C-55 5 -80 5 -95 -15 Z M95 -15 C80 -35 50 -35 38 -10 C55 5 80 5 95 -15 Z"/>
  <path class="d" d="M-140 -10 C-160 30 -150 80 -170 120 M140 -10 C160 30 150 80 170 120"/>""",
"pluma": """
  <path d="M-110 120 C-40 40 40 -60 110 -130"/>
  <path d="M110 -130 C40 -120 -40 -40 -60 60 C10 40 90 -40 110 -130 Z"/>
  <path class="d" d="M-10 0 l50 -10 M10 -30 l55 -12 M-35 30 l40 -2 M30 -60 l50 -16"/>""",
"gargantilla": """
  <path d="M-130 -60 C-110 40 110 40 130 -60"/>
  <path d="M-130 -35 C-110 65 110 65 130 -35"/>
  <circle cx="0" cy="40" r="10"/>
  <path class="d" d="M0 50 C-28 75 -12 115 0 125 C12 115 28 75 0 50 Z"/>""",
"estuche": """
  <path d="M-130 -30 C-130 -80 130 -80 130 -30 L120 100 C120 125 -120 125 -120 100 Z"/>
  <path d="M-128 -40 C-60 -60 60 -60 128 -40" stroke-dasharray="8 8"/>
  <path d="M110 -45 l20 45 l-14 6"/>
  <path class="d" d="M0 30 q-22 -22 -36 -2 q-8 14 36 44 q44 -30 36 -44 q-14 -20 -36 2"/>""",
}

PRODUCTOS = {
    "len-01": ("lenceria", "brasier"), "len-02": ("lenceria", "body"), "len-03": ("lenceria", "babydoll"),
    "len-04": ("lenceria", "kimono"), "len-05": ("lenceria", "liguero"),
    "jug-01": ("juguetes", "masajeador"), "jug-02": ("juguetes", "huevo"), "jug-03": ("juguetes", "succion"),
    "jug-04": ("juguetes", "bala"),
    "par-01": ("parejas", "regalo"), "par-02": ("parejas", "anillo"), "par-03": ("parejas", "u"),
    "par-04": ("parejas", "esposas"),
    "cos-01": ("cosmetica", "frasco_bomba"), "cos-02": ("cosmetica", "frasco_gotero"), "cos-03": ("cosmetica", "tubo"),
    "cos-04": ("cosmetica", "limpiador"), "cos-05": ("cosmetica", "caja"),
    "bie-01": ("bienestar", "vela"), "bie-02": ("bienestar", "spray"), "bie-03": ("bienestar", "tarro"),
    "bie-04": ("bienestar", "polvo"),
    "jue-01": ("juegos", "dados"), "jue-02": ("juegos", "cartas"), "jue-03": ("juegos", "ruleta"),
    "jue-04": ("juegos", "cupones"),
    "acc-01": ("accesorios", "antifaz"), "acc-02": ("accesorios", "pluma"), "acc-03": ("accesorios", "gargantilla"),
    "acc-04": ("accesorios", "estuche"),
}

CORAZON = "M0 4 q-6 -7 -11 -1 q-3 5 11 13 q14 -8 11 -13 q-5 -6 -11 1"

SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <radialGradient id="g" cx="50%" cy="42%" r="75%">
      <stop offset="0" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/>
    </radialGradient>
    <style>
      .m {{ fill: none; stroke: {trazo}; stroke-width: 6; stroke-linecap: round; stroke-linejoin: round; }}
      .m .d {{ stroke: {detalle}; stroke-width: 4.5; }}
      .m g.d circle {{ fill: {detalle}; stroke: none; }}
    </style>
  </defs>
  <rect width="800" height="500" fill="url(#g)"/>
  <circle cx="400" cy="250" r="190" fill="none" stroke="{trazo}" stroke-opacity=".18" stroke-width="2"/>
  <circle cx="400" cy="250" r="212" fill="none" stroke="{trazo}" stroke-opacity=".10" stroke-width="1.5" stroke-dasharray="3 9"/>
  <g fill="{detalle}" fill-opacity=".45">
    <path transform="translate(110 90) scale(1.3)" d="{corazon}"/>
    <path transform="translate(690 120) scale(.9)" d="{corazon}"/>
    <path transform="translate(140 410) scale(.8)" d="{corazon}"/>
    <path transform="translate(665 395) scale(1.4)" d="{corazon}"/>
  </g>
  <g fill="{trazo}" fill-opacity=".35">
    <path transform="translate(220 70)" d="M0 -9 L2.5 -2.5 L9 0 L2.5 2.5 L0 9 L-2.5 2.5 L-9 0 L-2.5 -2.5 Z"/>
    <path transform="translate(600 440) scale(.8)" d="M0 -9 L2.5 -2.5 L9 0 L2.5 2.5 L0 9 L-2.5 2.5 L-9 0 L-2.5 -2.5 Z"/>
  </g>
  <g class="m" transform="translate(400 250) scale(1.22)">{motivo}
  </g>
  <text x="400" y="482" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="700"
        letter-spacing="3" fill="{sello}" fill-opacity=".7">IMAGEN ILUSTRATIVA · {ref}</text>
</svg>
"""


def main() -> None:
    destino = RAIZ / "img" / "productos"
    destino.mkdir(parents=True, exist_ok=True)
    for archivo, (tema, motivo) in PRODUCTOS.items():
        c1, c2, trazo, detalle, sello = TEMAS[tema]
        svg = SVG.format(c1=c1, c2=c2, trazo=trazo, detalle=detalle, sello=sello,
                         corazon=CORAZON, motivo=M[motivo], ref=archivo.upper())
        (destino / f"{archivo}.svg").write_text(svg, encoding="utf-8")
    print(f"{len(PRODUCTOS)} ilustraciones generadas en img/productos/")


if __name__ == "__main__":
    main()
