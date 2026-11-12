# Revista Naranja — menú digital (maqueta de prueba)

Estilo inspirado en `../menu_1.jpeg`: fotos circulares, cajas con borde, títulos en píldora,
páginas que alternan naranja y crema. El nombre, el logo y los textos son propios (no se copió la plantilla).

```
revista-naranja/
├── index.html            # documento para PDF (index.html?pliegos = revista abierta)
├── revista.html          # visor con efecto de pasar página + sonido (usa js/revista.js)
├── css/menu.css          # estilos (tokens de color en :root)
├── js/menu.js            # maquetador: paginación sin cortes, índice, enlaces, QR
├── data/menu.js          # ← datos del negocio y productos
├── data/fuentes/         # respuestas originales de las APIs (trazabilidad)
├── img/productos/        # fotos (de prueba, ver abajo)
├── img/logo/             # logo de prueba
├── tools/descargar_fuentes.py   # descarga fotos/ingredientes de prueba
├── tools/generar_pdf.sh         # genera dist/menu.pdf y dist/menu-revista.pdf
└── dist/
```
Comparte `vendor/` (Bootstrap, íconos, StPageFlip, QR) y `js/revista.js` con el catálogo principal.

## Paleta (tomada de la imagen de referencia)
| Rol | HEX |
|---|---|
| Principal (naranja) | `#E36D27` |
| Secundario (café) | `#832E09` |
| Fondo (crema) | `#FFF5D2` |
| Texto | `#3A1806` |
| Acento (dorado) | `#F4B740` |

## Fuentes de las fotos y los ingredientes
Las fotos e ingredientes vienen de **TheMealDB** y **TheCocktailDB** (APIs públicas de recetas).
Están solo para la maqueta: **no son fotos del restaurante** y su licencia no está pensada para uso comercial.
Antes de publicar hay que reemplazarlas por fotos reales del cliente.
Las descripciones se escribieron en español y solo mencionan ingredientes que trae la fuente (`data/fuentes/resumen.json`).

## Generar
```
bash tools/generar_pdf.sh
```
