#!/usr/bin/env bash
# Regenera los CSS/JS minificados que sirve base.html.
# Requiere Node (usa esbuild via npx, sin instalar nada en el proyecto).
# Uso: tras editar estilo.css o main.js, correr este script y commitear
# los .min.* junto con el cambio.
set -euo pipefail
cd "$(dirname "$0")/.."

npx --yes esbuild@0.24.0 core/static/core/css/estilo.css --minify --outfile=core/static/core/css/estilo.min.css
npx --yes esbuild@0.24.0 core/static/core/js/main.js --minify --outfile=core/static/core/js/main.min.js

echo "listo: estilo.min.css y main.min.js regenerados"
