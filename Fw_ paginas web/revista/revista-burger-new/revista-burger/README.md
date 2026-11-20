# Revista Burger — menú de hamburguesería (maqueta de prueba)

Estilo inspirado en `../menu_2.jpeg`: portada de pizarra negra, páginas de papel kraft, paneles blancos y negros,
cintas con estrellas y dibujos de línea. Nombre, logo, dibujos (`js/dibujos.js`) y textos son propios:
no se copió la plantilla ni sus ilustraciones.

```
revista-burger/
├── index.html / revista.html     # PDF y visor con efecto de pasar página + sonido
├── css/menu.css                  # estilos (tokens en :root)
├── js/menu.js                    # maquetador
├── js/dibujos.js                 # dibujos SVG propios (hamburguesa, papas, vaso, perro caliente)
├── data/menu.js                  # ← datos del negocio y productos
├── data/fuentes/                 # respuestas originales de las APIs
├── img/productos/ · img/logo/
├── tools/descargar_fuentes.py · tools/generar_pdf.sh
└── dist/menu.pdf · dist/menu-revista.pdf
```

## Paleta
| Rol | HEX |
|---|---|
| Negro pizarra | `#151515` |
| Kraft | `#BEA885` |
| Blanco (paneles) | `#FFFFFF` |
| Acento dorado | `#D9A441` |
| Texto | `#1A1A1A` |

Tipografías: Luckiest Guy (títulos), Oswald (nombres y cintas), Montserrat (texto).

## Paginación
Las categorías fluyen en paneles blancos o negros. Reglas para que se vea bien:
- Ningún producto queda cortado entre páginas.
- Un título de categoría nunca queda al final de una página con un solo producto debajo.
- Nunca queda un único producto suelto al principio de la página siguiente.

## Fotos
Las fotos e ingredientes vienen de TheMealDB y TheCocktailDB y son **solo para la maqueta**.
Hay que reemplazarlas por fotos reales del cliente.

`bash tools/generar_pdf.sh` vuelve a generar los PDF.

## Página web (combo carta + web)
`sitio.html` es la página web del restaurante. Usa los mismos datos (`data/menu.js`), así que un cambio de precio
actualiza la web, la revista y los PDF.

Secciones: aviso de abierto/cerrado según el horario · hero con botón de WhatsApp · servicios · los más pedidos ·
**carta tipo revista incrustada** (con pantalla completa y descarga del PDF) · **menú rápido con buscador y filtros** ·
nosotros + galería · **ubicación** (mapa de Google, botones "Cómo llegar" con Google Maps y Waze, horario por día con el día de hoy
resaltado, domicilios y medios de pago) · reseñas (solo el enlace real de Google, sin reseñas inventadas) ·
contacto con QR · botón flotante de WhatsApp.
SEO: título, descripción, vista previa al compartir (Open Graph) y datos estructurados `Restaurant` para Google.

Datos que usa solo la web (en `negocio`): `horarioSemana`, `ubicacion` (lat/lng o consulta), `mediosPago`,
`zonaDomicilio`, `linkResenasGoogle`, `facebook`, `tiktok`.

### Publicar
```
bash tools/generar_pdf.sh
bash tools/empaquetar_web.sh     # crea publicar/ con todo adentro
```
Sube la carpeta `publicar/` a Netlify (arrastrar y soltar), Cloudflare Pages, GitHub Pages o el hosting del cliente.
`publicar/index.html` es la web y `publicar/revista.html` la carta.

## Carrito de pedido por WhatsApp (en la página web)
`js/carrito.js`. En la web, cada producto tiene **Agregar** y luego un selector − / +. Aparece una barra abajo
("Ver mi pedido", cantidad y total) que abre el panel del pedido:
- lista con cantidades editables y subtotal (los productos sin precio quedan "por confirmar");
- forma de entrega (sale de `servicios`); si es domicilio, pide la dirección y avisa que el costo se confirma;
- **nota por producto** ("Agregar nota a este producto", ej. "una sin cebolla"), que sale debajo del producto en el mensaje;
- nombre (obligatorio), medio de pago (lista de `mediosPago` o texto libre) y notas generales del pedido;
- **un solo mensaje de WhatsApp** con número de pedido, productos, subtotal y datos.

El carrito se recuerda en el navegador del cliente. En la **revista incrustada** en la web, los botones dicen
"Agregar" y suman al mismo carrito. El PDF y la revista abierta por separado siguen pidiendo producto por producto.
