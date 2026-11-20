#!/usr/bin/env bash
# Arma la tienda VITALIA + revista lista para subir al hosting: ../publicar-vitalia/ y ../publicar-vitalia.zip
# (sin tools/, sin caché de fotos y sin README). Sirve en la raíz del dominio (404.html usa rutas absolutas).
set -euo pipefail
cd "$(dirname "$0")/.."
DEST=../publicar-vitalia
rm -rf "$DEST" "$DEST.zip"
mkdir -p "$DEST"
cp -r -- *.html robots.txt sitemap.xml assets pages revista "$DEST"/
command -v zip >/dev/null && (cd "$DEST" && zip -qr ../publicar-vitalia.zip .) && echo "publicar-vitalia.zip listo"
echo "Carpeta $(realpath "$DEST"): $(du -sh "$DEST" | cut -f1), $(find "$DEST" -type f | wc -l) archivos"
