#!/usr/bin/env bash
# Genera el PDF de la revista (A4, una hoja por página) desde revista/index.html?pdf
# e imprime la línea VALIDACION (páginas, productos, páginas con contenido cortado).
#   revista/pdf/revista-vitalia.pdf  → para imprimir o subir a Heyzine
set -euo pipefail
cd "$(dirname "$0")/.."
CHROME="$(command -v google-chrome || command -v chromium || command -v chromium-browser)"
mkdir -p revista/pdf
"$CHROME" --headless=new --disable-gpu --no-sandbox --allow-file-access-from-files \
  --run-all-compositor-stages-before-draw --virtual-time-budget=20000 \
  --no-pdf-header-footer --generate-pdf-document-outline \
  --print-to-pdf="$PWD/revista/pdf/revista-vitalia.pdf" "file://$PWD/revista/index.html?pdf" 2>/dev/null
echo "PDF generado: revista/pdf/revista-vitalia.pdf ($(du -h revista/pdf/revista-vitalia.pdf | cut -f1))"
"$CHROME" --headless=new --disable-gpu --no-sandbox --allow-file-access-from-files \
  --virtual-time-budget=15000 --enable-logging=stderr --v=0 --dump-dom "file://$PWD/revista/index.html?pdf" 2>&1 >/dev/null \
  | grep -o 'VALIDACION {"paginas":[0-9]*,"productos":[0-9]*,"enRevista":[0-9]*,"faltantes":\[[^]]*\],"cortadas":\[[^]]*\],"fichasCortadas":\[[^]]*\]' | head -1 || true
