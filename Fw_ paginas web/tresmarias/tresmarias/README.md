# Cabaña Las Tres Marías — sitio web

Sitio estático de una página para un alojamiento rural en Berlín, corregimiento de Tona (Santander). Además tiene páginas de privacidad, condiciones y 404. Usa HTML, CSS y JavaScript vanilla, sin build ni backend, y funciona también abierto como `file://`. La auditoría SEO y de rendimiento está en [`SEO.md`](SEO.md).

## Requisitos

- **Para ver el sitio**: solo un navegador. Todas las dependencias están en el proyecto, sin CDN:
  - Bootstrap 5.3.3 (CSS recortado y JS sin Popper);
  - GSAP 3.13.0 + ScrollTrigger;
  - fuentes Cormorant Garamond y Manrope en WOFF2;
  - íconos de Bootstrap Icons 1.11.3 como sprite SVG dentro de `index.html`.
- **Para regenerar imágenes**: Python 3 con Pillow (`pip install pillow`).
- **Para el SEO estático** (`tools/seo.py`): Python 3, solo la biblioteca estándar.
- **Para recortar de nuevo Bootstrap**, solo si usas clases nuevas: Node y `npx purgecss@6`.

## Ejecutar

```bash
cd tresmarias && python3 -m http.server 8080   # abrir http://localhost:8080
```

`http.server` no comprime ni manda cabeceras de caché, así que las mediciones de velocidad locales salen peores que en un hosting configurado (ver `SEO.md`).

## Estructura

```text
tresmarias/
├── index.html                Página principal (única indexable)
├── privacidad.html           Política de privacidad (noindex; responsable pendiente)
├── condiciones.html          Condiciones de reserva (noindex; pendientes)
├── 404.html                  Página de error (noindex, rutas absolutas)
├── robots.txt / sitemap.xml  Los escribe tools/seo.py (el sitemap, solo con dominio)
├── .htaccess                 Apache/cPanel: 404, compresión, caché, bloqueo de carpetas de trabajo
├── SEO.md                    Informe de auditoría, palabras clave y mediciones
├── assets/
│   ├── css/styles.css        @font-face, tokens (:root), componentes, secciones, visor, movimiento
│   ├── js/config.js          ← ÚNICO archivo con datos del propietario (window.TM)
│   ├── js/main.js            Aplica la configuración; medición GA4 opcional
│   ├── js/gallery.js         Filtros de galería y visor accesible
│   ├── js/booking.js         Formulario: validación, vista previa y WhatsApp
│   ├── js/animations.js      GSAP: revelado de fotos, cambio de plan, parallax
│   ├── vendor/               bootstrap-5.3.3.purged.min.css, bootstrap-5.3.3.min.js, gsap-3.13.0.min.js, ScrollTrigger-3.13.0.min.js
│   ├── fonts/                cormorant-garamond-latin.woff2, manrope-latin.woff2 (+ LICENCIA.txt, OFL)
│   ├── icons/                favicon.svg, contour.svg
│   └── images/               hero/ cabin/ bedrooms/ bathrooms/ interiors/ landscapes/ activities/
│                             og-tres-marias.jpg, inventario.json
├── tools/
│   ├── imagenes.py           Optimiza fotos y reescribe galería, srcset y data-full de index.html
│   ├── seo.py                Escribe canonical, Open Graph, JSON-LD, sitemap.xml y robots.txt
│   ├── purgecss.config.cjs   Configuración para recortar Bootstrap
│   └── bootstrap-5.3.3.min.css  Original sin recortar (fuente para PurgeCSS)
└── _originales/              Fotos tal como se recibieron
```

`tools/`, `_originales/`, `README.md` y `SEO.md` no son parte del sitio. No los subas al hosting; el `.htaccess` los bloquea por si acaso.

## Configuración (`assets/js/config.js`)

- `modo: 'revision'` muestra los datos vacíos marcados «Por confirmar» y una barra de aviso. `modo: 'publicacion'` oculta todo lo pendiente.
- `atributos`: tipo, habitaciones (3), baños (2), chimenea, cocina con comedor, sala, Wi-Fi, parqueadero para 2 vehículos, patio y balcón. **Estos valores vienen del brief de SEO (octubre de 2026) y el propietario debe confirmarlos.** Siguen vacíos: capacidad, agua caliente, mascotas y acceso.
- `whatsapp: '57XXXXXXXXXX'` (solo dígitos, con indicativo). Sin número, el formulario arma el mensaje y ofrece copiarlo, y los botones llevan al formulario.
- `capacidadMaxima`: con un número, el formulario no deja pasar más huéspedes.
- `ubicacion`:
  - `zona` (Berlín, Tona, Santander) es la que dio el cliente; se publica en la web y en los datos estructurados.
  - `confirmada: true` cuando el propietario confirme y autorice publicar el sector o la dirección.
  - Con `lat`/`lng` verificados aparecen el mapa de Google Maps y el campo `geo` del JSON-LD.
- `dominio`: el dominio definitivo con `https://`. **Después de cambiarlo, ejecuta `python3 tools/seo.py`.**
- `ga4`: el ID real de Google Analytics 4 (`G-…`). Vacío, no se carga ningún script. Si lo activas, actualiza la sección de cookies de `privacidad.html`.
- `politicas`, `tarifas`, `redes`, `correo`, `lugares`: ver los comentarios en el archivo.

**Siempre que cambies `config.js`, ejecuta `python3 tools/seo.py`** para que los datos estructurados coincidan con lo visible.

### Cambiar textos, fotos y tarifas

- **Textos**: están en `index.html`. Las preguntas frecuentes se arman en `main.js` (`faqItems`) desde la configuración.
- **Tarifas**: objetos `{ plan: 'familiar', texto: 'Desde $… por noche', nota: '…' }` en `tarifas`. Valores de `plan`: `familiar`, `romantico`, `amigos`, `aventura` o `descanso`.
- **Fotos**:
  1. Copia el original a `_originales/`.
  2. Edita la lista `FOTOS` de `tools/imagenes.py` (id, carpeta, categoría, tipo `propia`, `ilustrativa` o `referencia`, alt y título).
  3. Ejecuta `python3 tools/imagenes.py`. Genera WebP de 400, 640, 960 y 1280 px (más 1600 y 1920 para las panorámicas y un recorte vertical del hero para móvil). También actualiza la galería y todos los `srcset`, `width`, `height` y `data-full` de `index.html`. El atributo `sizes` lo escribes tú según el diseño.

  Para usar una foto real como imagen de Open Graph, cambia `og_image()` en el mismo script.
- Al cambiar CSS o JS propios, sube el `?v=N` en `index.html`, `privacidad.html`, `condiciones.html` y `404.html`.
- **Bootstrap**: si usas una clase de Bootstrap que no estaba en el sitio, regenera el CSS recortado:

  ```bash
  npx purgecss@6 --config tools/purgecss.config.cjs --output tools/purged/
  mv tools/purged/bootstrap-5.3.3.min.css assets/vendor/bootstrap-5.3.3.purged.min.css
  ```

  Luego sube su `?v=`.

## Despliegue

El sitio son archivos estáticos: se sube el contenido de `tresmarias/` (sin `tools/` ni `_originales/`) a la raíz del dominio.

1. Define `dominio` en `config.js` y ejecuta `python3 tools/seo.py`. Así se escriben canonical, `og:url`, `og:image` absoluta, la URL del JSON-LD, `sitemap.xml` y la línea `Sitemap:` de `robots.txt`.
2. Cambia a `modo: 'publicacion'` cuando los datos estén confirmados.
3. Configura el servidor:
   - **Apache/cPanel**: el `.htaccess` ya trae la 404, la compresión (Brotli/gzip), la caché (HTML sin caché; CSS, JS y fuentes por 1 año; imágenes por 30 días) y el bloqueo de carpetas de trabajo. Descomenta y ajusta el bloque de **HTTPS y dominio canónico** (con o sin `www`) y la redirección `/index.html → /`.
   - **Nginx**: `error_page 404 /404.html;`, `gzip on;` con los tipos de texto, `expires 1y` para `css|js|woff2`, `expires 30d` para imágenes, `expires -1` para HTML, `return 301 https://…` para la versión canónica, y `location ~ ^/(tools|_originales)/ { return 404; }`.
   - **Netlify o Cloudflare Pages**: sirven `404.html` y comprimen solos. Las cabeceras de caché van en un archivo `_headers` y las redirecciones en `_redirects`.
4. Comprueba en el dominio real:
   - `/robots.txt`, `/sitemap.xml` y que `/no-existe` responda 404;
   - [PageSpeed Insights](https://pagespeed.web.dev/);
   - [Prueba de resultados enriquecidos](https://search.google.com/test/rich-results);
   - [Schema Markup Validator](https://validator.schema.org/).

Los pasos de Google Search Console, del Perfil de Negocio y de GA4 están en `SEO.md`.

## Datos pendientes del propietario

- **Confirmar** los atributos que vienen del brief: 3 habitaciones, 2 baños, chimenea, cocina con comedor, sala, patio, balcón, Wi-Fi y parqueadero para 2 vehículos.
- Número de WhatsApp, correo y redes oficiales.
- Dominio definitivo y acceso al hosting y a Google Search Console. ID de GA4, si se va a medir.
- Sector o vereda, autorización para publicar dirección o coordenadas, indicaciones de llegada y estado de la vía.
- Capacidad máxima, distribución de camas, agua caliente, equipamiento de cocina y mascotas.
- Tarifas, horarios de llegada y salida, anticipo, cancelación y política por clima.
- Responsable del tratamiento de datos para `privacidad.html` (Ley 1581 de 2012).
- **Fotografías reales** de la cabaña y de Berlín, con autor y permiso. La imagen para redes (`og-tres-marias.jpg`) es un paisaje de referencia: debería reemplazarse por una foto real de la propiedad.
- Lagunas recomendables con nombre, ruta, exigencia y fuente. Bicicleta de montaña o patinaje solo si existen lugares verificados.

## Inventario y honestidad de las imágenes

Las 58 fotos recibidas no traen autor, licencia ni lugar. El detalle está en `assets/images/inventario.json`.

- **15 ilustrativas** (interiores, fachadas, terraza): son de cabañas distintas entre sí y **no son Las Tres Marías**. En pantalla llevan «Foto ilustrativa, no es la cabaña».
- **41 de referencia** (páramo, frailejones, lagunas, caminatas): el lugar exacto es desconocido. Llevan «Paisaje de referencia, lugar por confirmar».
- **2 excluidas**: `balcon_1.jpeg` (montañas nevadas alpinas) y `balcon_2.jpeg` (un jacuzzi no confirmado).
- Falta la foto del pueblo de Berlín. En su lugar hay un marcador «Foto pendiente».

Antes de publicar hay que verificar los derechos de uso de cada foto o reemplazarla.

## Fuentes de los datos del destino

- Berlín (corregimiento de Tona) y el DMI Páramo de Berlín: [documento técnico de la CDMB](https://cdmb.gov.co/images/documentos/institucional/areas_protegidas/Doc%20DMI%20P%20Berl%C3%ADn.pdf).
- El Picacho (unos 20 km al este de Bucaramanga, Ruta 66, peaje a unos 3.400 m): [Wikipedia](https://en.wikipedia.org/wiki/Picacho_Mountain_(Colombia)).

No se publican distancias ni tiempos desde la cabaña, porque no se conoce su ubicación exacta.

## Diseño

- **Paleta**: la del brief, con tokens en `:root`. Todos los pares de texto y fondo cumplen contraste AA.
- **Tipografía**: Cormorant Garamond en titulares y Manrope en el texto, con `font-display: swap` y ambas precargadas.
- **Identidad**: tres estrellas del cinturón de Orión («las Tres Marías») y un lenguaje de cuaderno de campo.
- **Movimiento**:
  - La entrada del hero se hace en CSS: dura menos de un segundo y no depende de JS.
  - GSAP revela las fotos grandes y anima el cambio de plan; el parallax del destino es solo para escritorio.
  - Todo se desactiva con `prefers-reduced-motion`.

## Limitaciones

- No hay disponibilidad en tiempo real: el formulario solo prepara un mensaje de WhatsApp.
- Sin dominio no hay canonical ni sitemap, y la imagen de Open Graph es relativa (las redes no la mostrarán).
- La galería y los `srcset` de `index.html` los reescribe `tools/imagenes.py`. Los cambios a mano en esos atributos se pierden en la siguiente ejecución.
- Abierto como `file://`, Chrome bloquea las fuentes locales (CORS) y muestra las de respaldo. Todo lo demás funciona. Para revisar el diseño fiel usa `python3 -m http.server`.
- La lista de datos, las fichas de lugares y las preguntas frecuentes se generan con JavaScript desde `config.js`. Google renderiza JavaScript, pero otros buscadores pueden no verlas.
