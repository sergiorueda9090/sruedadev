#!/usr/bin/env bash
# Arma publicar/ : carpeta autocontenida lista para subir a un hosting
# (Netlify, Cloudflare Pages, GitHub Pages o el hosting del cliente).
#
#   publicar/index.html     ← la página web (sitio.html)
#   publicar/revista.html   ← la carta tipo revista
#   publicar/dist/*.pdf     ← los PDF
#
# Uso: bash tools/empaquetar_web.sh   (genera antes los PDF con tools/generar_pdf.sh)
set -euo pipefail
cd "$(dirname "$0")/.."

OUT=publicar
rm -rf "$OUT"
mkdir -p "$OUT"/{css,js,data,dist,vendor}

cp sitio.html "$OUT/index.html"
cp revista.html "$OUT/revista.html"
cp css/menu.css css/sitio.css "$OUT/css/"
cp css/revista.css "$OUT/css/revista.css"
cp js/menu.js js/dibujos.js js/sitio.js js/carrito.js "$OUT/js/"
cp js/revista.js "$OUT/js/revista.js"
cp data/menu.js "$OUT/data/"
cp -r img "$OUT/"
cp dist/*.pdf "$OUT/dist/" 2>/dev/null || echo "⚠ No hay PDF en dist/: ejecuta tools/generar_pdf.sh"
cp -r vendor/bootstrap vendor/bootstrap-icons vendor/page-flip vendor/qrcode "$OUT/vendor/"

# Rutas compartidas (../) → rutas locales dentro de publicar/
sed -i -e 's|\.\./vendor/|vendor/|g' -e 's|\.\./js/revista\.js|js/revista.js|g' -e 's|\.\./css/revista\.css|css/revista.css|g' \
  "$OUT/index.html" "$OUT/revista.html"

# Todo archivo local referenciado por las páginas debe existir en publicar/
for pag in "$OUT/index.html" "$OUT/revista.html"; do
  for ref in $(grep -oE '(src|href)="[^"#:]+\.(js|css)"' "$pag" | sed -E 's/.*="([^"]+)"/\1/'); do
    [ -f "$OUT/$ref" ] || { echo "✗ Falta $ref (referenciado en $(basename "$pag"))"; exit 1; }
  done
done

if grep -q '\.\./' "$OUT/index.html" "$OUT/revista.html"; then
  echo "✗ Quedaron rutas con ../ :"; grep -n '\.\./' "$OUT/index.html" "$OUT/revista.html"; exit 1
fi
echo "✓ Carpeta lista: $OUT/  ($(du -sh "$OUT" | cut -f1))"
