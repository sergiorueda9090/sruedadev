# Essence & Time — e-commerce de demostración

Tienda multimarca de perfumes, lociones, relojes y regalos para Colombia (COP, español de Colombia).
Es un **frontend estático de demostración**: no hay backend, no se procesan pagos y **todos los productos y marcas son conceptuales**.

## Requisitos

- Un navegador moderno (Chrome, Edge, Firefox o Safari de los últimos dos años).
- Python 3 (o cualquier servidor HTTP estático) para servirlo en local.
- Conexión a internet: Bootstrap, GSAP, Swiper, Bootstrap Icons y Google Fonts se cargan desde CDN con versión fija y hash SRI.

## Ejecutar en local

```bash
cd webs/ecommerce
python3 -m http.server 8080
# abrir http://localhost:8080
```

También funciona abriendo `index.html` directamente (`file://`), porque no hay `fetch()` de archivos locales. Aun así, el servidor es el modo recomendado: `localStorage` se aísla por origen y el comportamiento es el de producción.

Para empezar con la tienda vacía, borra los datos del sitio desde el navegador. Se guardan en `localStorage` con el prefijo `et:v1:`.

## Estructura

```
ecommerce/
├── index.html               Inicio
├── perfumes.html            Catálogo (data-scope="perfumes")
├── lociones.html            Catálogo (data-scope="lociones")
├── relojes.html             Catálogo (data-scope="relojes")
├── regalos.html             Regalos: categoría «regalos» + productos con etiqueta «regalo»
├── novedades.html           Productos con etiqueta «nuevo»
├── busqueda.html            busqueda.html?q=<texto>
├── producto.html            producto.html?p=<slug>[&v=<variante>]
├── favoritos.html · carrito.html · checkout.html · confirmacion.html?pedido=<ref>
├── nosotros.html · contacto.html · faq.html · envios-devoluciones.html
├── privacidad.html · terminos.html · 404.html
└── assets/
    ├── css/
    │   ├── tokens.css        Variables: color, tipografía, espaciado, radios, sombras, movimiento, capas
    │   ├── base.css          Tipografía base, enlaces, foco, accesibilidad, «minutero»
    │   ├── layout.css        Contenedor, secciones, header, mega menú, menú móvil, footer
    │   ├── components.css    Botones, formularios, tarjeta de producto, filtros, toasts, modal, acordeón…
    │   ├── animations.css    Keyframes y estado inicial del hero (con failsafe)
    │   └── pages.css         Estilos específicos de cada página
    ├── js/
    │   ├── config.js         Marca, contacto, envíos, cupones, categorías, políticas, SEO
    │   ├── utils.js          Formato COP, normalización de texto, utilidades DOM
    │   ├── products.js       Catálogo de demostración (33 productos)
    │   ├── catalog-api.js    Búsqueda, variantes, relacionados, facetas
    │   ├── storage.js        localStorage versionado y tolerante a fallos
    │   ├── cart.js           Única lógica de carrito: stock, cupones, envío, totales
    │   ├── wishlist.js       Favoritos
    │   ├── validation.js     Validación accesible de formularios
    │   ├── animations.js     Módulo central GSAP + ScrollTrigger (opt-in)
    │   ├── components.js     Header, footer, minicarrito, buscador, tarjeta, toasts, modal rápido
    │   ├── main.js           Arranque por página (<body data-page="…">) y carrusel
    │   └── pages/            home, catalog, product, cart-page, checkout, favorites, faq, contact, info
    └── images/               hero, perfumes, lociones, relojes, regalos, editorial, credits.json
```

El header y el footer se generan desde JavaScript (`components.js`). Cada HTML trae un header y un footer mínimos de respaldo, de modo que el contenido y la navegación esencial siguen disponibles sin JavaScript. La página 404 funciona completa sin JavaScript.

Los archivos `*_prompt.md` y `auditor.md` de la raíz son los briefs de trabajo del proyecto, no parte de la tienda. Muévelos o exclúyelos antes de publicar, porque un servidor estático los serviría.

## Bibliotecas

| Biblioteca | Versión | Uso |
|---|---|---|
| Bootstrap | 5.3.3 | Rejilla, offcanvas (menú, filtros, minicarrito), modal, collapse. Apariencia reescrita vía tokens |
| Bootstrap Icons | 1.11.3 | Iconografía |
| GSAP + ScrollTrigger | 3.13.0 | Entrada del hero, revelados puntuales, minicarrito, toasts, galería |
| Swiper | 11.1.14 | Carrusel de la portada y galería móvil de la ficha |
| Google Fonts | — | Open Sans 400–700 en todo el sitio (titulares, interfaz, cifras tabulares); Bodoni Moda solo para el «&» del logotipo (subconjunto de un glifo) |

Sin frameworks, sin jQuery, sin TypeScript. JavaScript en scripts clásicos con `defer` bajo `window.ET`, porque los módulos ES no funcionan en `file://`.

## Cómo añadir productos

Añade un objeto al array de `assets/js/products.js`:

```js
{
  id: 'p12', slug: 'nombre-unico-en-url', name: 'Nombre', brand: 'Marca',
  category: 'perfumes',            // perfumes | lociones | relojes | regalos
  subcategory: 'mujer',            // ver config.categories[].subcategories
  gender: 'mujer',                 // mujer | hombre | unisex | null
  concentration: 'Eau de parfum',  // perfumes
  family: 'Floral', accord: 'Floral blanca',
  notes: { top: [], heart: [], base: [] },
  productType: 'Loción corporal',  // lociones
  watch: { caseMaterial, strapType, strapMaterial, diameterMm, movement, dialColor, waterResistance, style, color }, // relojes
  contents: [],                    // sets
  short: 'Una línea.', description: 'Texto completo.',
  images: [img('perfumes/archivo-sin-sufijo', 'Texto alternativo')],
  variants: [v('50', '50 ml', 329000, 9, 'SKU-050', { volumeMl: 50, compareAt: 359000 })],
  variantLabel: 'Correa',          // opcional, si la variante no es de tamaño
  tags: ['nuevo', 'regalo'], moments: ['dia'], occasions: ['cumpleanos'],
  featured: 5, addedAt: '2026-10-01', related: ['p01'],
}
```

Solo rellena los campos que conozcas: la ficha y los filtros muestran únicamente los atributos presentes, y un filtro aparece solo cuando hay dos o más valores distintos.

## Cómo cambiar las imágenes

1. Exporta cada imagen de producto en proporción **4:5** a dos tamaños: `nombre-800.webp` (800×1000) y `nombre-400.webp` (400×500).
2. Guárdalas en la carpeta de su categoría dentro de `assets/images/`.
3. Referencia la ruta **sin sufijo ni extensión** en `images[].src`, por ejemplo `perfumes/nombre`.
4. Registra la procedencia y la licencia en `assets/images/credits.json`.

Las imágenes editoriales usan 3:2 a 1600/800 px. Las del hero y los bloques editoriales están enlazadas directamente en `index.html` y en las páginas de categoría.

Las fotografías actuales son de **Pexels (Pexels License)**. Se revisaron para que no aparezcan logotipos de marcas reales y son ilustrativas: no representan productos oficiales.

## Cómo modificar precios

Los precios están en `products.js` (`variants[].price`), como **enteros en COP**. `compareAt` es el precio anterior: solo se muestra tachado, con su porcentaje, si es mayor que el precio actual. Los totales se recalculan siempre desde el catálogo, nunca desde lo guardado en el navegador.

Los cupones, las tarifas de envío por zona y los rangos de presupuesto están en `config.js` (`coupons`, `shipping`, `budgets`). Cupones de demostración:

| Código | Regla |
|---|---|
| `BIENVENIDA10` | 10 % con tope de $ 80.000 |
| `REGALO40` | $ 40.000 en compras desde $ 350.000 |
| `RELOJ15` | 15 % solo en relojes, con tope de $ 150.000 |
| `VERANO25` | Expirado (para probar el mensaje) |

## Cómo cambiar la identidad visual

- **Colores, tipografía, espaciado, radios, sombras y movimiento**: en `assets/css/tokens.css`. Bootstrap hereda los valores mediante sus variables `--bs-*`.
- **Fuentes**: cambia la URL de Google Fonts en el `<head>` de cada página y las variables `--font-sans` y `--font-logo`. Las hojas locales llevan `?v=N`: súbelo al cambiar CSS para evitar la caché del navegador.
- **Nombre, logotipo textual, mensaje de la franja superior y aviso de demostración**: en `config.brand`, `config.topbar` y `config.demo`.
- **Datos de contacto y redes**: `config.contact` y `config.social`. Mientras estén vacíos, no se muestran.
- **Elemento de marca, el «minutero»** (`.dial-track`, en `base.css`): las 60 marcas de una esfera de reloj. Aparece en el footer, la banda de relojes, la barra de los carruseles, el progreso de la carga de productos y la ficha de perfume.

Contrastes verificados (WCAG AA): el gris secundario `#746B61` no alcanza AA sobre el fondo arena, así que allí se usa `#685F56` (4,9:1). El dorado `#C5A46D` es solo decorativo sobre fondos claros; como texto se usa únicamente sobre la banda oscura.

## Cómo probar

- **Flujo de compra:**
  1. En una ficha, elige el tamaño y la cantidad y añade al carrito.
  2. En el carrito, aplica `BIENVENIDA10` y estima el envío.
  3. Completa el checkout de demostración y revisa la confirmación.
- **Estados especiales:**
  - Variante agotada: *Rubí 100 ml* o *Aurora 34* con correa café.
  - Producto agotado: *Crema corporal Leche de Coco*.
  - Últimas unidades: *Rubí 50 ml* y *Noche Estrellada 32*.
- **Filtros y URL compartible:** `perfumes.html?genero=hombre&orden=price-asc` o `regalos.html?ocasion=aniversario&presupuesto=250-500`.
- **Búsqueda tolerante:** `busqueda.html?q=acéro`; con un error tipográfico (`?q=perfme`) sugiere «perfume».

## Limitaciones de esta versión

- `localStorage` es editable por el usuario. Precios, stock, cupones y pedidos **no son fiables** fuera de esta demo; el código solo los sanea para que la interfaz no se rompa.
- El inventario es simulado y no se reserva al comprar. El pedido solo existe en el navegador donde se creó.
- Los formularios de contacto y de newsletter validan, pero **no envían nada**.
- No hay cuentas de usuario, historial, facturación, impuestos desglosados ni seguimiento de envíos.
- El canonical solo se genera por JavaScript cuando se define `config.seo.siteUrl`. `og:image` usa una ruta relativa: en producción debe ser una URL absoluta.
- La página `404.html` usa rutas relativas. En el servidor definitivo debe configurarse como página de error para la raíz del sitio.
- Los datos estructurados de producto están desactivados (`seo.structuredData: false`) porque el catálogo es conceptual.

## Pendiente antes de publicar como tienda real

1. **Backend y base de datos** para el catálogo, el inventario y los pedidos, con **validación en servidor** de precios, stock y cupones.
2. **Pasarela de pagos certificada** (PSE, tarjetas, contra entrega), sin que los datos de tarjeta pasen por el frontend.
3. **Datos comerciales reales**: razón social, NIT, dirección, canales de atención y horarios en `config.js`.
4. **Políticas aprobadas y revisión legal**: privacidad (Ley 1581 de 2012 y su reglamentación), términos, cambios, retracto y garantías (Ley 1480 de 2011). Las páginas actuales son borradores marcados como pendientes.
5. **Tarifas y plazos reales** de la transportadora, integración de seguimiento y facturación electrónica.
6. **Productos reales**, con fichas técnicas verificadas y fotografía propia o licenciada para cada referencia.
7. **Analítica y cookies** con un mecanismo de consentimiento, si se usan.
8. **Infraestructura**: dominio, HTTPS, cabeceras de seguridad (CSP, HSTS), caché de recursos y, opcionalmente, empaquetado y minificado de CSS y JS.
