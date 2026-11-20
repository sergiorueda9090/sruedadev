#!/usr/bin/env bash
# Exporta la revista a PDF A4 (una hoja por página) con Chrome/Chromium headless.
#   pdf/revista-vehiculos-infantiles.pdf  → listo para imprimir o subir a Heyzine
# También imprime el reporte de validación (páginas, productos, contenido cortado, pendientes).
set -euo pipefail
cd "$(dirname "$0")/.."
CHROME="$(command -v google-chrome || command -v chromium || command -v chromium-browser)"
mkdir -p pdf
"$CHROME" --headless=new --disable-gpu --no-sandbox --allow-file-access-from-files \
  --run-all-compositor-stages-before-draw --virtual-time-budget=20000 \
  --no-pdf-header-footer --generate-pdf-document-outline \
  --print-to-pdf="$PWD/pdf/revista-vehiculos-infantiles.pdf" "file://$PWD/revista.html?pdf" 2>/dev/null
echo "PDF generado: pdf/revista-vehiculos-infantiles.pdf"
"$CHROME" --headless=new --disable-gpu --no-sandbox --allow-file-access-from-files \
  --virtual-time-budget=15000 --enable-logging=stderr --v=0 --dump-dom "file://$PWD/revista.html?pdf" 2>&1 >/dev/null \
  | grep -o 'VALIDACION {.*}' | sed 's/\\"/"/g' | head -1 || true
