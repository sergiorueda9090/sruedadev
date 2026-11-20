#!/usr/bin/env bash
# Exporta los PDF del catálogo con Chrome/Chromium headless (desde index_revista.html).
#   dist/catalogo.pdf          → páginas A4 sueltas (Heyzine / imprenta / botón de revista.html)
#   dist/catalogo-revista.pdf  → revista abierta (portada sola + doble página)
set -euo pipefail
cd "$(dirname "$0")/.."
CHROME="$(command -v google-chrome || command -v chromium || command -v chromium-browser)"
mkdir -p dist
exportar() {
  "$CHROME" --headless=new --disable-gpu --no-sandbox --allow-file-access-from-files \
    --run-all-compositor-stages-before-draw --virtual-time-budget=20000 \
    --no-pdf-header-footer --generate-pdf-document-outline \
    --print-to-pdf="$PWD/$2" "$1" 2>/dev/null
  echo "PDF generado: $2"
}
exportar "file://$PWD/index_revista.html"         dist/catalogo.pdf
exportar "file://$PWD/index_revista.html?pliegos" dist/catalogo-revista.pdf

# Chrome incrusta las fotos .webp sin comprimir: se recomprimen con Ghostscript (≈150 ppp, calidad de pantalla/Heyzine).
if command -v gs >/dev/null; then
  for f in dist/catalogo.pdf dist/catalogo-revista.pdf; do
    gs -q -dNOPAUSE -dBATCH -dSAFER -sDEVICE=pdfwrite -dCompatibilityLevel=1.6 -dPDFSETTINGS=/ebook \
       -dDownsampleColorImages=true -dColorImageResolution=150 -dAutoRotatePages=/None \
       -sOutputFile="$f.tmp" "$f" && mv "$f.tmp" "$f"
    echo "Comprimido: $f ($(du -h "$f" | cut -f1))"
  done
fi
