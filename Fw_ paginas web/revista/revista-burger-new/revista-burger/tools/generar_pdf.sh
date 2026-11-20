#!/usr/bin/env bash
# Exporta los PDF del menú con Chrome/Chromium headless.
#   dist/menu.pdf          → páginas A4 sueltas (Heyzine / imprenta)
#   dist/menu-revista.pdf  → revista abierta (portada sola + doble página)
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
exportar "file://$PWD/index.html"         dist/menu.pdf
exportar "file://$PWD/index.html?pliegos" dist/menu-revista.pdf
