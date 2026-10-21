# Landing 2 · Almacenamiento inteligente (marca de ejemplo «Estiba»)

Página comercial orientada a catálogo y comparación. Objetivo: que el visitante identifique **qué sistema necesita** y lo cotice en pocos clics.

## Concepto

- **Público**: jefes de bodega, compras y distribuidores que saben qué almacenan pero no qué sistema pedir.
- **Propuesta de valor**: «Encuentra el sistema de racks ideal para tu operación y cotízalo».
- **Lenguaje visual**: señalética de bodega. Cada sistema tiene una **loseta con letra** (A–G), como las señales de pasillo de los racks; la misma letra aparece en el menú, el catálogo, la tabla comparativa, la guía, la galería y el formulario.
- **Paleta**: blanco, gris muy claro `#F2F4F6`, tinta `#14202B`, azul industrial `#0B4F9C` (marca y CTA) y naranja `#F5821F` para selección y estados activos.
- **Tipografía**: Barlow (texto) y Barlow Condensed (titulares y losetas), familia inspirada en la señalización vial.
- **Navegación**: menú de producto con desplegable «Sistemas» A–G; en móvil, barra de acción fija abajo con «Cotizar mi proyecto» y WhatsApp; en escritorio aparece como botón flotante tras el hero y se oculta al llegar al formulario.
- **Animación**: entrada del hero, losetas del catálogo que «se encienden» al entrar, transición de la respuesta del selector y de los filtros.

## Interactividad

- **Selector de necesidades** (pallets, carga pesada, materiales largos, almacenamiento vertical, aprovechar la altura): muestra explicación, sistemas recomendados (enlazan y resaltan su tarjeta del catálogo) y los datos que definen la elección. Siempre visible el aviso: la recomendación es orientativa y no sustituye el estudio técnico de cargas, dimensiones, anclajes e instalación. Los accesos del hero abren el selector con la necesidad elegida.
- **Filtros del catálogo** (pallets, cajas y piezas, materiales largos, alta densidad) con conteo «Mostrando N de 7 sistemas».
- **«Cotizar este sistema»** preselecciona el sistema en el formulario.
- **Galería** desplazable con botones y teclado.
- Sin JavaScript, el selector se oculta (no quedan controles sin efecto) y el catálogo y la guía se ven completos.

## Qué editar

| Qué | Dónde |
|---|---|
| Modo revisión / publicación | `CONFIG.modo` en `js/main.js` |
| WhatsApp | `CONFIG.whatsapp` (número de ejemplo; `esEjemplo: false` al usar el real) |
| Recepción del formulario | `CONFIG.formEndpoint` |
| Tiempo de respuesta | `CONFIG.tiempoRespuesta` (vacío = no se muestra; solo si se garantiza) |
| Datos de contacto | `CONFIG.contacto` |
| Recomendaciones del selector | `NECESIDADES` en `js/main.js` (letras de `SISTEMAS`) |
| Catálogo | Tarjetas `.sys-card` en `index.html`: `data-cat` define los filtros; mantener la letra de la loseta igual a la de `SISTEMAS` y de la tabla |
| Logotipo y favicon | `.brand` en header/footer y `assets/favicon.svg` |
| Fotos | `assets/images/` (mismos nombres) o `tools/fotos.py` |
| Colores y tipografía | `:root` en `css/styles.css` |
| SEO | `<head>` (`og:image` absoluta en producción) |

Elementos con `data-status="pendiente"` («Por confirmar»): catálogo real del proveedor, si instala con personal propio, si fabrica a medida, disponibilidad de repuestos y fotos de instalaciones propias.

## Formulario

Obligatorios: nombre, correo, teléfono y autorización de datos. Empresa, ciudad, sistema y detalles son opcionales. Incluye un campo oculto `necesidad` que se llena si el visitante llega desde el selector. Sin `formEndpoint` no se envía nada y se informa; con endpoint, `POST` JSON y confirmación solo con respuesta `2xx`.

## Ejecutar

```bash
python3 -m http.server 8080   # desde esta carpeta → http://localhost:8080
```
