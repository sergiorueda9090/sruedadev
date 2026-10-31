# VITALIA — Bienestar que se siente

Tienda virtual **conceptual** de bienestar, nutrición y cuidado personal, creada como proyecto de portafolio de [SRuedaDev](https://sruedadev.com/). Es un comercio electrónico completo en el frontend: catálogo filtrable, fichas de producto detalladas, carrito persistente y checkout de demostración.

> **Marca y datos ficticios.** VITALIA no existe. Productos, precios, descuentos, valoraciones, opiniones, testimonios y condiciones comerciales son demostrativos y están identificados así en la interfaz. No hay registros sanitarios, certificaciones ni respaldo médico.

## Ejecutar

```bash
cd producto && python3 -m http.server 8080   # abrir http://localhost:8080
```

También funciona abriendo `index.html` directamente (`file://`): no hay módulos ES ni peticiones `fetch`. Requiere internet para Bootstrap 5.3.3, Bootstrap Icons 1.11.3, GSAP 3.13.0 + ScrollTrigger (jsDelivr, versión fija con SRI) y Google Fonts (Newsreader y Hanken Grotesk). La página `404.html` usa rutas absolutas (`/…`) porque el servidor la entrega desde cualquier URL: sirve el sitio en la raíz del dominio.

## Páginas

| Archivo | Contenido |
|---|---|
| `index.html` | Héroe, beneficios, categorías, destacados, rutina de bienestar (pestañas), experiencia de compra, testimonios de demostración, artículos, FAQ, newsletter |
| `pages/catalogo.html` | Búsqueda, categorías, rango de precio, destacados, orden, cuadrícula compacta/ampliada, contador, estado vacío. Estado en la URL (`?categoria=vitaminas&max=60000&orden=precio-asc`) |
| `pages/producto.html?id=<id>` | Ficha: galería (6 vistas), comparador antes/después, Etiqueta abierta, información desplegable, opiniones de ejemplo, FAQ del producto, relacionados |
| `pages/carrito.html` | Carrito completo con resumen |
| `pages/checkout.html` | Checkout de demostración con validación y confirmación |
| `pages/nosotros.html` | Filosofía (`#filosofia`), principios y criterios de selección |
| `pages/bienestar.html` | Guía con 4 artículos de información general |
| `pages/preguntas-frecuentes.html` | FAQ por temas (`#envios`, `#pedidos`, …) |
| `pages/contacto.html` | Formulario de contacto y canales por configurar |
| `pages/politicas-de-privacidad.html`, `pages/terminos-y-condiciones.html` | Textos legales demostrativos |
| `pages/portafolio.html` | Caso de portafolio (objetivo, problema, funciones, tecnologías, capturas, componentes) |
| `404.html` | Página no encontrada |

## Arquitectura

HTML + CSS + JavaScript vanilla en scripts clásicos con `defer`, todos bajo `window.VT`. Orden de carga fijo:

```
config → products → cart → ui → widgets → forms → animations → [home | filters | product | checkout | pages] → app
```

| Archivo | Responsabilidad |
|---|---|
| `assets/js/config.js` | **Único archivo de configuración**: marca, `modo`, dominio, WhatsApp, correo, redes, envíos, pagos, departamentos, cantidad máxima, animaciones |
| `assets/js/products.js` | Catálogo (13 productos, 6 categorías) y funciones de consulta (`porId`, `relacionados`, `imagen`, …) |
| `assets/js/cart.js` | Única lógica de carrito y favoritos. Guarda solo `{id, cantidad}` con prefijo `vitalia:v1:`; los totales se recalculan siempre desde `products.js`; lo leído se sanea |
| `assets/js/ui.js` | Header, footer, menú móvil, buscador, paneles de carrito y favoritos, tarjeta de producto, notificaciones, WhatsApp |
| `assets/js/widgets.js` | Carrusel (scroll-snap) y pestañas ARIA |
| `assets/js/forms.js` | Validación accesible (errores con `aria-invalid`, foco en el primero, resumen), newsletter y contacto |
| `assets/js/animations.js` | GSAP + ScrollTrigger |
| `assets/js/app.js` | Arranque según `<body data-page="…">` |

El header y el footer se generan desde `ui.js`; cada HTML trae una navegación mínima de respaldo para funcionar sin JavaScript. Los estilos usan tokens en `:root` (`styles.css`); Bootstrap solo aporta la cuadrícula, acordeón, offcanvas y modal. Al cambiar CSS/JS, sube el `?v=N` en todos los HTML.

### Dirección de arte

- **Paleta:** papel `#FBFAF6`, marfil `#F2EEE3`, beige `#E6DCCB`, salvia `#A9BBA2`, verde botánico `#2E5B45` (acción), azul petróleo `#1F4B5A` (secundario), ámbar `#E4B23C` (acentos puntuales).
- **Tipografía:** Newsreader (titulares ligeros, editoriales) + Hanken Grotesk (interfaz y texto).
- **Motivos de marca:** la cápsula (logotipo, marcos de foto con arco) y la **Etiqueta abierta**, un panel inspirado en las tablas de composición que convierte la transparencia en el elemento visual distintivo.
- **Movimiento:** una sola entrada orquestada en el héroe, revelados discretos al desplazarse y respuestas a acciones (añadir, favoritos, paneles).

## Funcionalidades

- Header fijo que se compacta al desplazarse; mega menú; menú móvil (offcanvas); buscador en vivo con flechas.
- Carrito lateral y página de carrito: añadir, quitar (con deshacer), cambiar cantidades (1–10), subtotales, total, contador en el header, persistencia y sincronización entre pestañas.
- Favoritos con panel lateral y estado vacío.
- Galería: miniaturas, flechas, teclado (←/→, Inicio, Fin, Enter), zoom con el cursor, vista ampliada en modal, deslizamiento táctil.
- Comparador antes/después: `input range` accesible (teclado y lector de pantalla) con rótulos visibles. Tres usos responsables: evolución de la presentación, textura y organización. Nunca resultados físicos.
- Checkout: contacto, dirección, ciudad, departamento, código postal opcional, envío, pago (sin datos de tarjeta), resumen dinámico, confirmación `DEMO-AAAAMMDD-NNNN`. No se envía ni se guarda ningún dato personal.
- WhatsApp: mensaje general y mensaje con el nombre del producto en cada ficha.
- Accesibilidad: saltar al contenido, foco visible, nombres accesibles en botones de ícono, ARIA en pestañas/galería/carrusel, `prefers-reduced-motion`, contraste AA, estados que no dependen solo del color.
- SEO: título y descripción por página (la ficha los ajusta por producto), Open Graph con `og.jpg`, canonical, JSON-LD `WebSite` y `BreadcrumbList`, `sitemap.xml`, `robots.txt`, `noindex` en carrito/checkout/404, imágenes WebP con `srcset`, `width/height` y `loading="lazy"`.

No se publican datos estructurados `Product`, `Offer` ni `AggregateRating`: los precios y valoraciones son de demostración. Añádelos solo cuando sean reales.

## Imágenes

| Tipo | Origen | Herramienta |
|---|---|---|
| Estilo de vida, editorial, ingredientes, entornos | Unsplash (licencia Unsplash). Autor y origen en `assets/images/credits.json` | `python3 tools/fotos.py` (manifiesto `tools/fotos.json`) |
| Envases (6 vistas por producto), comparador, categorías, héroe, `og.jpg` | Ilustraciones SVG generadas desde `products.js` (campo `envase`) | `tools/estudio.html` + `tools/render.js` → `python3 tools/imagenes.py` |
| Capturas del portafolio | Capturas del propio sitio | `tools/capturas.js` → `python3 tools/capturas.py` |

```bash
python3 -m http.server 8091 &
NODE_PATH=<carpeta node_modules con playwright> node tools/render.js http://localhost:8091   # [id] para un solo producto, «extras» para categorías/héroe/OG
python3 tools/imagenes.py
```

Para usar fotografías reales basta con reemplazar `assets/images/products/<id>/<vista>-{400,900}.webp` (4:5) y `comparar-{antes,despues}-{700,1200}.webp` (4:3) manteniendo nombres y proporciones. Las fotos del comparador deben tener autorización de uso y no pueden sugerir resultados de salud o cambios físicos.

## Antes de publicar una tienda real

**Datos que deben sustituirse** (`config.js` y `products.js`):

- `modo: 'publicacion'` (oculta avisos de revisión y el panel de WhatsApp sin número).
- `dominio` y luego `python3 tools/seo.py` (canonical, Open Graph, sitemap, robots). El valor actual, `https://vitalia.sruedadev.com`, es un marcador.
- `contacto.whatsapp`, `correo`, `horario`; `redes` con sus URL.
- Envíos (`envios`, `envioGratisDesde`), métodos de pago y cupones.
- Cada producto: nombre, precio, presentación, ingredientes, composición, modo de uso, advertencias, conservación, imágenes. Quitar `precioAnterior` si no es un precio real anterior.
- Valoraciones y opiniones: eliminar las de ejemplo o conectarlas a un sistema real de opiniones verificadas.
- Testimonios de la portada (`index.html`): eliminarlos o reemplazarlos por opiniones reales con autorización.

**Revisión legal:** política de privacidad (Ley 1581 de 2012), términos, derecho de retracto y garantías (Ley 1480 de 2011), autorización de datos para la newsletter.

**Revisión sanitaria y comercial:** registro sanitario INVIMA de cada suplemento, alimento o cosmético; textos de etiqueta y declaraciones de propiedades; advertencias obligatorias; artículos de la guía revisados por un profesional de la salud.

## Qué requiere un backend

Pedidos reales, inventario, cálculo de envío por destino, cupones validados en servidor, envío de formularios y newsletter (con doble confirmación), cuentas de usuario, opiniones verificadas y facturación electrónica.

### Pasarela de pagos (integración futura)

1. El frontend envía el carrito (`[{id, cantidad}]`) y los datos de entrega a un endpoint propio (`POST /api/pedidos`).
2. El backend **recalcula precios y envío desde su base de datos** (nunca confía en importes del navegador), crea el pedido en estado «pendiente» y solicita a la pasarela (Wompi, PayU, Mercado Pago, ePayco…) una sesión o enlace de pago firmado con la llave privada, que vive solo en el servidor.
3. El navegador redirige al checkout alojado de la pasarela o usa su widget oficial: los datos de tarjeta nunca pasan por la tienda.
4. La pasarela notifica el resultado al **webhook** del backend; este verifica la firma, actualiza el pedido y descuenta inventario.
5. La página de retorno consulta el estado del pedido en el backend y muestra la confirmación real.

En el frontend, el cambio se concentra en `assets/js/checkout.js` (sustituir `simularEnvio` por la llamada al endpoint) y en `config.pagos`.

## Pruebas realizadas

Con Playwright + Chrome headless (script de verificación fuera del proyecto):

- 13 páginas + 13 fichas de producto a **360, 390, 768, 1366 y 1920 px**: sin desbordamiento horizontal, sin errores de consola, sin recursos 404, sin imágenes rotas, un `h1` por página, ningún botón o enlace visible sin nombre accesible, ningún contenido animado que quede oculto tras desplazarse; 109 enlaces internos verificados.
- 46 comprobaciones funcionales: filtros, orden, rango de precio con error, estado vacío, limpiar, cuadrícula, añadir al carrito, notificación, favoritos, persistencia al recargar, galería con teclado, modal, comparador con teclado, límites de cantidad, recalculo de importes, saneamiento de `localStorage` manipulado, validación y foco del checkout, envío en el resumen, confirmación, vaciado del carrito, ausencia de datos personales guardados, formularios de contacto y newsletter, buscador, WhatsApp contextual.
- Sin animaciones: con `prefers-reduced-motion`, con GSAP bloqueado y en `file://`, todo el contenido queda visible.

**Pendiente:** no se probó en Safari/iOS ni con lectores de pantalla reales (NVDA, VoiceOver); el número de WhatsApp, el correo y el dominio siguen sin configurar a propósito.
