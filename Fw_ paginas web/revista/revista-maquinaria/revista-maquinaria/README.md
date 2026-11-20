# Revista Maquinaria — catálogo + sitio web de alquiler de maquinaria pesada (maqueta de prueba)

Estilo inspirado en la pieza de SRUEDADev (cielo, azul marino, amarillo, tira de categorías).
Empresa de prueba: **MaquiAndes**. Todo sale de `data/catalogo.js`: catálogo PDF, revista y sitio web.

```
revista-maquinaria/
├── index.html            # catálogo para PDF (index.html?pliegos = revista abierta)
├── revista.html          # catálogo tipo revista (efecto de pasar página + sonido)
├── sitio.html            # página web con lista de cotización
├── css/catalogo.css · css/sitio.css
├── js/catalogo.js        # maquetador del catálogo
├── js/sitio.js           # página web
├── js/cotizacion.js      # lista de cotización por WhatsApp
├── data/catalogo.js      # ← datos de la empresa, servicios, condiciones, equipos
├── data/creditos.js      # créditos de fotos (generado)
├── data/fuentes/creditos.json
├── img/equipos/ · img/logo/
├── tools/descargar_fotos.py   # descarga y optimiza las fotos de Wikimedia Commons
├── tools/generar_pdf.sh       # dist/catalogo.pdf y dist/catalogo-revista.pdf
├── tools/empaquetar_web.sh    # publicar/ listo para subir
└── dist/
```

## Catálogo (PDF / revista) — 9 páginas
Portada (título, foto, tira de 6 categorías, WhatsApp, QR) · Nosotros y servicios · Índice con enlaces ·
Fichas por categoría (foto, especificaciones, tarifas por hora/día/mes, operador, botón **Cotizar**) ·
Condiciones de alquiler y "cómo alquilar" · Contraportada con QR y créditos de fotos.

Reglas de paginación: ninguna ficha se corta, nunca queda un solo equipo de una categoría a un lado del corte
(si no se puede, la categoría pasa completa) y, si sobra mucho espacio en una página, se agrega un recuadro para cotizar.

## Sitio web (`sitio.html`)
Menú fijo con "Solicita una cotización" · aviso de atención según el horario · hero · tira de categorías (filtra los equipos) ·
**Maquinaria** con buscador y filtros · Servicios y pasos · **catálogo tipo revista incrustado** · Condiciones (preguntas frecuentes) ·
**Ubicación y cobertura** (mapa, Google Maps, Waze, horario) · banda de llamado a la acción · Contacto con QR · botón flotante de WhatsApp ·
créditos de fotos y crédito del desarrollador (`creditoDesarrollador`, poner `null` para quitarlo). SEO con datos estructurados `LocalBusiness`.

### Lista de cotización (`js/cotizacion.js`)
- "Agregar a cotización" en cada equipo (también desde la revista incrustada: "Añadir a cotización").
- Por equipo: cobro por hora/día/mes (solo los que tienen tarifa), duración, unidades, con/sin operador (si es opcional) y nota.
- Datos de la obra: fecha de inicio (no permite fechas pasadas), ubicación, tipo de trabajo, transporte, nombre, empresa y notas.
- **Valor de referencia** calculado (sin transporte) y un solo WhatsApp con toda la solicitud.

## Fotos
Wikimedia Commons, licencias CC BY / CC BY-SA / CC0 (`data/fuentes/creditos.json`). Las licencias CC BY exigen dar crédito:
el catálogo los lista en la contraportada y la web en el pie. **No son los equipos del cliente**: reemplazarlas por fotos propias
(con fotos propias, los créditos desaparecen solos si se vacía `data/creditos.js`).

## Comandos
```
python3 tools/descargar_fotos.py   # solo si se quieren volver a descargar las fotos de prueba
bash tools/generar_pdf.sh
bash tools/empaquetar_web.sh       # crea publicar/ (index.html = la web)
```
