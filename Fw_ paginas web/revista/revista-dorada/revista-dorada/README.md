# Mesa Dorada — carta de bistró (maqueta de prueba)

Estilo inspirado en `../menu_3.jpeg`: páginas grises tipo **lista** (viñeta naranja, foto redonda con pestaña naranja
hasta el borde) alternadas con páginas crema de **arcos** (fotos en arco, 3 columnas, títulos Playfair en café).
Nombre, logo y textos propios (no se copió la plantilla). Cada plato lleva **precio** y botón **Pedir** por WhatsApp.

```
revista-dorada/
├── index.html / revista.html     # PDF y revista (efecto de pasar página + sonido)
├── css/menu.css · js/menu.js
├── data/menu.js                  # ← datos; cada categoría define su diseño: "lista" o "arcos"
├── data/fuentes/                 # respuestas originales de TheMealDB / TheCocktailDB
├── img/productos/ · img/logo/
├── tools/descargar_fuentes.py · tools/generar_pdf.sh
└── dist/menu.pdf · dist/menu-revista.pdf
```

## Páginas (9)
Portada · Bienvenida (con recuadro para reservar mesa) · Índice · Favoritos (lista) · Creaciones de la casa (arcos) ·
Para empezar (lista) · Postres (arcos) · Bebidas (lista) · ¡Gracias! con QR.
El orden de las categorías hace que cada doble página quede **lista a la izquierda y arcos a la derecha**, como la referencia.

- Diseño "lista": 4 platos por página. Diseño "arcos": 6 por página. Si hay más, sigue en una página de continuación.
- La sombra del lomo se pone del lado correcto según la página quede a la izquierda o a la derecha del pliego.

`bash tools/generar_pdf.sh` genera los dos PDF.

## Página web (`sitio.html`)
Misma identidad que la carta. Secciones: aviso abierto/cerrado · hero con foto en arco · **Favoritos** (estilo lista con
foto redonda y pestaña naranja) · **Creaciones de la casa** (arcos) · **Menú completo** con buscador y filtros ·
carta tipo revista incrustada · **Reserva tu mesa** · Nosotros y galería · Ubicación (mapa, Google Maps, Waze, horario,
medios de pago) · Contacto con QR · enlace de reseñas de Google (solo el real) · botón flotante de WhatsApp.

- **Carrito** (`js/carrito.js`, el mismo de la web burger): Agregar → cantidades, nota por plato, Para llevar / Domicilio
  (sale de `servicios`), un solo WhatsApp con el pedido. También suma desde la revista incrustada.
- **Reservas** (`js/reservas.js`): fecha (hasta `anticipacionDias`), hora solo dentro del horario de ese día
  (cada `intervalo` min, hasta `ultimaAntesDeCierre` min antes de cerrar; si es hoy, no muestra horas pasadas),
  personas (máx. `maxPersonas`), ocasión, nombre y notas → solicitud por WhatsApp. Si el día está cerrado, lo avisa.
- Crédito del desarrollador opcional: `creditoDesarrollador` en `data/menu.js`.

```
bash tools/generar_pdf.sh
bash tools/empaquetar_web.sh     # crea publicar/ (index.html = la web)
```
