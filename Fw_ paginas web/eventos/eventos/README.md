# Experiencias y eventos: tres propuestas digitales

Tres landing pages de demostración para negocios de eventos del área metropolitana de Bucaramanga, y un portafolio (`index.html`) para presentarlas. **No son sitios oficiales**: cada página lo dice en una barra superior y en el pie, y las fotografías son de referencia.

| | Villa Jardín | Finca La Cruz | Alquieventos |
|---|---|---|---|
| Negocio | Finca para bodas y celebraciones | Espacio campestre social y empresarial | Alquiler de carpas, mesas, sillas, tarimas y mobiliario |
| Concepto | Editorial de bodas en jardín | Celebración campestre contemporánea | Catálogo comercial ordenado |
| Paleta | Oliva `#3e4a2b`, marfil `#f7f2e7`, arena `#e4d7c0`, dorado `#b39257` (solo filetes), blanco | Terracota `#a84a24`, bosque `#1f3a2c`, crema `#f4ecdf`, arena `#e5d2b0`, coral `#e58b6e` (solo el botón del formulario) | Marino `#0e2440`, blanco, gris `#eef1f5`, amarillo `#f5b82e`, negro suave `#1a1d23` |
| Tipografía | Cormorant Garamond + Manrope | DM Serif Display + DM Sans | Sora + Inter |
| Recurso propio | Hero como **tarjeta de invitación** (marco doble que se dibuja al cargar); celebraciones como **índice** con vista previa | Bloques de color a sangre; fotos con **una sola esquina curva**; **formulario en forma de frase** | **Solicitud tipo remisión**: catálogo filtrable, cantidades, panel lateral y resumen |
| Conversión | Llamada (fijo y celular); WhatsApp listo para activar | Formulario → mensaje estructurado de WhatsApp; modalidades que preseleccionan el tipo de evento | Lista de productos con cantidades → mensaje de WhatsApp con la solicitud completa |

## Abrir

```bash
cd eventos && python3 -m http.server 8080   # http://localhost:8080
```

También funcionan abriendo los `.html` directamente (scripts clásicos con `defer`, sin módulos ni build). Bootstrap 5.3.3, Bootstrap Icons 1.11.3, GSAP 3.13.0 + ScrollTrigger y Google Fonts se cargan desde CDN con versión fija y hash SRI; si cambias una versión, actualiza el `integrity`:

```bash
curl -sL <url> | openssl dgst -sha384 -binary | openssl base64 -A
```

Las fotografías son locales (WebP en `assets/images/`).

## Estructura

```
eventos/
├── index.html               portafolio de las tres propuestas
├── villa-jardin.html
├── finca-la-cruz.html
├── alquieventos.html
├── assets/
│   ├── css/  global.css (accesibilidad, aviso de demo, botón flotante, estados de formulario)
│   │         villa-jardin.css · finca-la-cruz.css · alquieventos.css · portafolio.css
│   ├── js/   config.js  ← datos editables de los tres negocios
│   │         main.js    ← utilidades compartidas (window.EV): contacto, validación, WhatsApp, GSAP
│   │         villa-jardin.js · finca-la-cruz.js · alquieventos.js · portafolio.js
│   └── images/<demo>/*.webp, favicons SVG
└── tools/
    ├── fotos.py             descarga, recorta y convierte fotos a WebP; registra créditos
    ├── descargar_todo.sh    regenera todas las fotos
    ├── creditos.json        origen, licencia y texto alternativo de cada foto
    └── seo.py               canonical, og:url, og:image absoluta y sitemap.xml
```

## Editar datos (`assets/js/config.js`)

Es el único archivo que se toca al recibir datos de un cliente.

- `modo: 'revision'` muestra las etiquetas «Por confirmar» y los datos pendientes; `'publicacion'` los oculta.
- `telefonos`: solo dígitos y sin indicativo; los enlaces `tel:` añaden `+57`.
- `whatsapp`: formato internacional sin `+` (p. ej. `'573001234567'`). Vacío = sin WhatsApp: los botones de WhatsApp se ocultan y aparece la llamada.
- `direccion`, `mapaUrl`, `horario`, `cobertura`, etc.: vacíos hasta confirmarlos. La página no inventa nada: muestra «Por confirmar» en modo revisión.

### Estado de los datos

| Dato | Villa Jardín | Finca La Cruz | Alquieventos |
|---|---|---|---|
| Teléfonos | 607 646 3452 (fijo) y 320 349 3120 (celular), entregados para la demo | 317 540 8777, entregado para la demo | 317 682 5487, entregado para la demo |
| WhatsApp | **Sin configurar.** El brief pide no suponer qué línea tiene WhatsApp; el 320 349 3120 es celular, pero no está confirmado. Al confirmarlo: `whatsapp: '573203493120'` | Configurado con el número entregado; confirmar con el negocio que es su WhatsApp | Configurado con el número entregado; confirmar con el negocio |
| Dirección, mapa, horarios | Por confirmar | Por confirmar | Por confirmar (también la cobertura de entrega) |
| Tipos de evento, servicios, capacidad | Por confirmar (marcados en la página) | Por confirmar; las modalidades son de ejemplo y no tienen precio | El catálogo es de ejemplo: referencias, existencias y precios por confirmar |

No hay testimonios, cifras, premios ni precios. Tampoco hay datos estructurados (JSON-LD): se añadirán cuando la dirección y los datos del negocio sean verificables.

## Formularios

Ningún formulario envía datos a un servidor. Validan en el navegador (mensajes junto al campo, foco en el primer error, fecha no anterior a hoy, teléfono colombiano de 10 dígitos), arman el mensaje y abren `wa.me`. Si el navegador bloquea la ventana, dejan un enlace «abre WhatsApp aquí». En Alquieventos la selección de productos se guarda en `sessionStorage` (`alquieventos.solicitud.v1`) solo durante la sesión, y se valida al leerla.

## Animaciones

GSAP solo se activa si carga y si el usuario no pidió movimiento reducido. El contenido se ve completo sin JavaScript, sin GSAP y con `prefers-reduced-motion`. Cada página tiene un único momento de entrada en el hero (el marco de invitación, el bloque de color que se extiende o la foto que se descubre) y revelados discretos una sola vez al desplazarse; no hay scroll secuestrado ni animaciones continuas.

## Fotografías

Son de Unsplash ([licencia Unsplash](https://unsplash.com/license): uso comercial gratuito, sin atribución obligatoria), descargadas y recortadas a la proporción de cada espacio. Ninguna se repite entre las tres demos (el portafolio reutiliza la portada de cada una). **No corresponden a los negocios** y cada página lo indica; deben reemplazarse por fotografías reales.

```bash
python3 tools/fotos.py hoja photo-XXXX photo-YYYY --out /tmp/hoja    # hoja de contactos para elegir
python3 tools/fotos.py usar photo-XXXX --proyecto alquieventos --slot p-nuevo \
    --ratio 4:3 --anchos 480,800 --alt "Descripción de lo que se ve"
```

## SEO

Cada página tiene un `title`, una descripción y metadatos Open Graph propios, y está orientada a búsquedas locales (Bucaramanga, Floridablanca, Piedecuesta). El canonical no se inventa: cuando exista el dominio, define `sitioBase` en `config.js` y ejecuta:

```bash
python3 tools/seo.py   # escribe canonical, og:url, og:image absoluta y sitemap.xml
```

Con `sitioBase` vacío, el script quita esas etiquetas y borra `sitemap.xml`.

## Verificación realizada

Con Chrome headless (Playwright) a 360, 390, 768, 1024, 1366 y 1920 px en las cuatro páginas:

- Sin desbordamiento horizontal, sin imágenes rotas, sin errores de consola y sin respuestas 404.
- Anclas internas y enlaces entre páginas válidos.
- Menú móvil: abre, navega y se cierra.
- Finca La Cruz: errores de validación, preselección por modalidad y mensaje de WhatsApp completo.
- Alquieventos: filtros, atajos del hero, agregar y cambiar cantidades, panel lateral, persistencia tras recargar, exigencia de productos y mensaje con cantidades.
- Villa Jardín: sin WhatsApp configurado se ocultan esos botones y aparece la llamada.
- Contenido visible con `prefers-reduced-motion`, sin JavaScript y con GSAP bloqueado.
