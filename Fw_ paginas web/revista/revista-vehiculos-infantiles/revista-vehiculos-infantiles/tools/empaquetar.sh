#!/usr/bin/env bash
# Arma la carpeta lista para publicar: publicar/  (y publicar.zip)
#   - Solo lo que usa el sitio: páginas, css, js, vendor, PDF y las fotos ya organizadas.
#   - NO copia las carpetas originales de fotos del negocio, tools/ ni datos-del-negocio/.
#   - El PDF se comprime para la web (requiere ghostscript); el de pdf/ sigue siendo el de imprenta.
#   - Si negocio.csv trae sitioWeb (https://…), genera sitemap.xml y lo enlaza en robots.txt.
# Publicar: arrastrar la carpeta publicar/ a https://app.netlify.com/drop  (o subir publicar.zip al hosting).
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf publicar publicar.zip
mkdir -p publicar/assets
cp -- *.html robots.txt publicar/
mkdir -p publicar/css publicar/pdf
cp css/*.css publicar/css/            # solo hojas de estilo (otros archivos sueltos en css/ no se publican)
cp -r js vendor publicar/
# PDF liviano para la web (el original de pdf/ queda intacto para imprenta)
PDF=pdf/revista-vehiculos-infantiles.pdf
if command -v gs >/dev/null; then
  gs -q -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -dColorImageResolution=150 -sOutputFile="publicar/$PDF" "$PDF"
  echo "PDF para web: $(du -h "publicar/$PDF" | cut -f1) (original: $(du -h "$PDF" | cut -f1))"
else
  cp "$PDF" "publicar/$PDF"
fi
for d in banners logo carros-electricos motos-electricas cuatrimotos vehiculos-gasolina; do cp -r "assets/$d" publicar/assets/; done

DOMINIO="$(node -e 'global.window={};require("./js/datos.js");require("./js/fichas.js");process.stdout.write((window.REVISTA.negocio.sitioWeb||"").replace(/\/$/,""))')"
if [[ "$DOMINIO" == https://* ]]; then
  {
    echo '<?xml version="1.0" encoding="UTF-8"?>'
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    for p in sitio.html tienda.html revista.html politica-datos.html; do echo "  <url><loc>$DOMINIO/$p</loc></url>"; done
    node -e 'global.window={};require("./js/datos.js");require("./js/fichas.js");window.REVISTA.productos.forEach(p=>console.log(`  <url><loc>'"$DOMINIO"'/producto.html?ref=${encodeURIComponent(p.ref)}</loc></url>`))'
    echo '</urlset>'
  } > publicar/sitemap.xml
  echo "Sitemap: $DOMINIO/sitemap.xml" >> publicar/robots.txt
  echo "sitemap.xml generado para $DOMINIO"
else
  echo "Sin sitioWeb en datos-del-negocio/negocio.csv: no se genera sitemap.xml (se puede publicar igual)."
fi

if command -v zip >/dev/null; then (cd publicar && zip -qr ../publicar.zip .); echo "publicar.zip listo"; fi
echo "Carpeta publicar/: $(du -sh publicar | cut -f1), $(find publicar -type f | wc -l) archivos"
grep -q 'modoPrueba: true' js/datos.js && echo "⚠ modoPrueba sigue en true: la tienda mostrará la cinta de 'Tienda de prueba'." || true
