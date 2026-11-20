#!/usr/bin/env bash
# Exporta los PDF del catálogo con Chrome/Chromium headless.
#   dist/catalogo.pdf          → páginas A4 sueltas (para Heyzine / impresión)
#   dist/catalogo-revista.pdf  → revista abierta: portada sola + doble página
# Uso: bash tools/generar_pdf.sh
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="$(command -v google-chrome || command -v chromium || command -v chromium-browser)"
mkdir -p dist

exportar() { # $1 = URL, $2 = archivo destino
  "$CHROME" --headless=new --disable-gpu --no-sandbox \
    --allow-file-access-from-files \
    --run-all-compositor-stages-before-draw \
    --virtual-time-budget=15000 \
    --no-pdf-header-footer \
    --generate-pdf-document-outline \
    --print-to-pdf="$PWD/$2" "$1" 2>/dev/null
  echo "PDF generado: $2"
}

exportar "file://$PWD/index.html"          dist/catalogo.pdf
exportar "file://$PWD/index.html?pliegos"  dist/catalogo-revista.pdf
