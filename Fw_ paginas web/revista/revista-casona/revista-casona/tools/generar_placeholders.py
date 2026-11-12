"""Genera imágenes de marcador (SVG) para el modo de prueba.

No son fotos de comida: son recuadros explícitos "FOTO PENDIENTE" para que
nadie confunda un placeholder con una fotografía real del cliente.
Uso: python3 tools/generar_placeholders.py
"""
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
PRODUCTOS = {
    "ent-01": "ENT-01", "ent-02": "ENT-02", "ent-03": "ENT-03",
    "fue-01": "FUE-01", "fue-02": "FUE-02", "fue-03": "FUE-03",
    "fue-04": "FUE-04", "fue-05": "FUE-05",
    "pos-01": "POS-01", "pos-02": "POS-02", "pos-03": "POS-03",
    "beb-01": "BEB-01", "beb-02": "BEB-02", "beb-03": "BEB-03",
}

FOTO = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <pattern id="h" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="24" height="24" fill="#F1E6D4"/>
      <line x1="0" y1="0" x2="0" y2="24" stroke="#E6D5BA" stroke-width="10"/>
    </pattern>
  </defs>
  <rect width="800" height="600" fill="url(#h)"/>
  <rect x="20" y="20" width="760" height="560" fill="none" stroke="#C9B08A" stroke-width="4" stroke-dasharray="16 12"/>
  <g transform="translate(400 255)" fill="none" stroke="#9C7B52" stroke-width="10" stroke-linejoin="round">
    <rect x="-80" y="-50" width="160" height="110" rx="14"/>
    <path d="M-34 -50 l12 -22 h44 l12 22"/>
    <circle cx="0" cy="5" r="32"/>
  </g>
  <text x="400" y="400" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" font-weight="700" fill="#7A5A35" letter-spacing="4">FOTO PENDIENTE</text>
  <text x="400" y="450" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#9C7B52">{ref}</text>
</svg>
"""

LOGO = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <circle cx="200" cy="200" r="190" fill="#FBF6EE" stroke="#7A2E1F" stroke-width="8"/>
  <circle cx="200" cy="200" r="168" fill="none" stroke="#E9B44C" stroke-width="3" stroke-dasharray="10 8"/>
  <text x="200" y="182" text-anchor="middle" font-family="Georgia, serif" font-size="46" font-weight="700" fill="#7A2E1F">LOGO</text>
  <text x="200" y="230" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#2B2118" letter-spacing="3">DE PRUEBA</text>
  <text x="200" y="270" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#3E6B48">reemplazar por el oficial</text>
</svg>
"""


def main() -> None:
    destino = RAIZ / "img" / "productos"
    destino.mkdir(parents=True, exist_ok=True)
    for archivo, ref in PRODUCTOS.items():
        (destino / f"{archivo}.svg").write_text(FOTO.format(ref=ref), encoding="utf-8")
    (RAIZ / "img" / "logo" / "logo-placeholder.svg").write_text(LOGO, encoding="utf-8")
    print(f"{len(PRODUCTOS)} fotos de marcador + 1 logo generados")


if __name__ == "__main__":
    main()
