# Auditoría SEO y de rendimiento — Cabaña Las Tres Marías

Fecha: 19 de octubre de 2026. Alcance: el sitio estático de `tresmarias/` (una página indexable más privacidad, condiciones y 404).

## A. Auditoría inicial

| # | Problema | Archivo / recurso | Impacto | Solución | Prioridad |
|---|---|---|---|---|---|
| 1 | Canonical, `og:url` y JSON-LD se insertaban con JavaScript; `og:image` era relativa | `index.html`, `main.js` | Las redes sociales y algunos rastreadores no ejecutan JS: la vista previa salía sin imagen y los datos estructurados podían no leerse | `tools/seo.py` los escribe en el HTML estático desde `config.js` | Crítica |
| 2 | No había `sitemap.xml` ni página 404 | raíz | Descubrimiento e indexación; errores con respuesta 200 | `seo.py` genera el sitemap cuando hay dominio. Se añadieron `404.html` y `ErrorDocument` en `.htaccess` | Alta |
| 3 | LCP móvil de 6,5 s en laboratorio | `<head>` | Experiencia y Core Web Vitals | Ver D | Alta |
| 4 | 4 CSS bloqueantes desde 3 orígenes (Google Fonts, jsDelivr ×2) | `<head>` | ~1,1 s de bloqueo de renderizado en móvil | Fuentes, Bootstrap y GSAP alojados localmente; Bootstrap CSS recortado | Alta |
| 5 | Fuente completa de Bootstrap Icons (CSS + WOFF2) para 14 íconos | `<head>` | Un CSS bloqueante y una fuente extra | Sprite SVG con los 14 íconos | Alta |
| 6 | El H1 del hero quedaba invisible hasta que cargaba GSAP | `styles.css`, `animations.js` | Si GSAP tardaba, el titular tardaba | Entrada del hero en CSS puro, de menos de 1 s | Alta |
| 7 | El H1 tenía el nombre del negocio en texto oculto (`visually-hidden`) | `index.html` | Texto oculto en el H1: práctica dudosa | Nombre visible dentro del H1 | Media |
| 8 | Imágenes solo en 640 y 1280 px; `sizes` imprecisos | `index.html` | ~200–400 KB de más | Variantes 400/640/960/1280 (+1600/1920 en panorámicas), recorte vertical del hero para móvil y `sizes` ajustados | Media |
| 9 | Contraste insuficiente: dorado sobre verde, textos con `opacity`, etiqueta de revisión | `styles.css` | Accesibilidad AA | Colores ajustados; todos los pares ≥ 4,5:1 | Media |
| 10 | `role="tabpanel"` en `<article>`; nombre accesible de las fotos distinto del texto visible | `index.html`, `gallery.js` | Accesibilidad | `<div role="tabpanel">`; `aria-label` que incluye la etiqueta visible | Media |
| 11 | El texto no mencionaba las características ni la ubicación de forma natural | `index.html` | Relevancia local | Copia ajustada (ver C) | Media |
| 12 | Sin compresión ni caché en el servidor local | servidor | Peso y visitas repetidas | `.htaccess` con Brotli/gzip y caché; instrucciones para otros hostings | Media (depende del hosting) |
| 13 | Sin medición de conversiones | — | No se sabe qué genera consultas | GA4 opcional que solo se activa con un ID real | Baja |

No se encontraron enlaces rotos, imágenes inexistentes ni errores de consola. Hay un solo H1 y la jerarquía H2 → H3 → H4 no tiene saltos. El formulario, los enlaces de WhatsApp, el menú, la galería, el visor y el acordeón funcionaban y se conservaron.

## B. Archivos modificados o creados

- `index.html`:
  - `<head>` nuevo: título, descripción, `robots`, Open Graph y bloque `seo:inicio/fin`;
  - recursos locales, con precarga de fuentes y de la foto del hero según el ancho;
  - `<picture>` del hero con recorte vertical;
  - nombre visible en el H1 y copia con los datos del brief;
  - sprite SVG de íconos, `div` para los paneles de planes y `sizes` corregidos.
- `assets/css/styles.css`: `@font-face` locales, clase `.ic`, entrada del hero en CSS y contrastes.
- `assets/js/main.js`: sin inyección de SEO; medición GA4 opcional (`track`); respuesta de ubicación en las preguntas frecuentes.
- `assets/js/animations.js`: ya no anima el hero y respeta `prefers-reduced-motion` directamente.
- `assets/js/booking.js` y `gallery.js`: eventos de medición; nombres accesibles de las fotos.
- `assets/js/config.js`: atributos del brief, campos `ga4` y comentarios de `dominio`.
- Nuevos:
  - `tools/seo.py`, `.htaccess`, `404.html`, `SEO.md`;
  - `assets/vendor/*`, `assets/fonts/*`;
  - `tools/purgecss.config.cjs`, `tools/bootstrap-5.3.3.min.css`.
- `tools/imagenes.py`: más anchos, hero móvil y reescritura automática de `srcset`, `width`, `height` y `data-full`.
- `privacidad.html`, `condiciones.html`: recursos locales; texto de terceros y cookies actualizado.
- `robots.txt`: lo escribe `seo.py`.

## C. SEO implementado

**Título** (57 caracteres): `Cabaña Las Tres Marías | Alojamiento en Berlín, Santander`.

**Descripción** (153 caracteres): «Cabaña en Berlín, Tona (Santander) con tres habitaciones, dos baños, chimenea, cocina, balcón, Wi-Fi y parqueadero. Consulta disponibilidad por WhatsApp.»

**H1**: «Cabaña Las Tres Marías. Desconéctate del ruido. Reconecta con lo que importa.» Todo el texto es visible.

**Contenido local**:
- La ubicación (Berlín, corregimiento de Tona, Santander) aparece en el hero, en «La cabaña», en el destino, en las preguntas frecuentes y en el pie.
- El H2 de actividades ahora es «Qué hacer en Berlín y sus alrededores».
- No se afirman distancias, vistas, acceso privado ni cercanía a El Picacho.

**Características** (vienen del brief; el propietario debe confirmarlas): 3 habitaciones, 2 baños, chimenea, sala, comedor, cocina, patio, balcón, Wi-Fi y parqueadero para 2 vehículos. Aparecen en el texto, en la lista de datos, en las preguntas frecuentes y en el JSON-LD.

**Datos estructurados**: tipo `LodgingBusiness` con `name`, `description`, `address` (Berlín, Tona; Santander; CO), `numberOfRooms: 3` y `amenityFeature` (Wi-Fi, parqueadero, chimenea, cocina, balcón, patio). Con `dominio` se añaden `url` e `image`; con WhatsApp, `telephone`; con coordenadas, `geo`; con redes, `sameAs`.

No se incluyen reseñas, calificaciones, precios, horarios ni disponibilidad. Tampoco se usa `VacationRental`: Google lo reserva a socios con feed de anuncios. Tampoco se usa `FAQPage`: desde 2023 Google solo muestra esos resultados para sitios gubernamentales y de salud. El JSON-LD se validó como JSON y coincide con lo visible. **Falta validarlo** en Rich Results Test y en Schema Markup Validator con la URL pública.

**Indexación**:
- `index.html` lleva `index, follow, max-image-preview:large`.
- Privacidad, condiciones y 404 llevan `noindex`: hoy su contenido está pendiente o no aporta a la búsqueda.
- `robots.txt` permite todo. Con dominio, `seo.py` añade `Sitemap:` y genera `sitemap.xml`, que solo incluye la URL canónica de inicio con `lastmod` igual a la fecha real de modificación del archivo.

**Open Graph y X**: `og:title`, `og:description`, `og:type`, `og:locale=es_CO`, `og:site_name`, `og:image` (1200×630) con `og:image:alt`, y `twitter:card=summary_large_image`. **Pendiente**: la imagen es un paisaje de referencia, no la cabaña; hay que reemplazarla por una foto real.

### Estrategia de palabras clave

Son hipótesis. **No se ha medido volumen, competencia ni tendencia.** Hay que validarlas en Google Keyword Planner y, cuando haya datos, en el informe de Rendimiento de Search Console.

| Intención | Términos | Dónde se trabajan | Relevancia hoy |
|---|---|---|---|
| Transaccional | alquiler de cabaña en Berlín; cabaña en Berlín Santander; cabañas en Berlín Santander | Título, H1, descripción, «Reservar» | Alta (principal: **cabaña en Berlín Santander**) |
| Local | alojamiento en Berlín Santander; cabaña en Tona Santander; hospedaje cerca de Berlín Santander; alojamiento rural en Santander | Hero, «La cabaña», ubicación, pie, JSON-LD | Alta |
| Experiencial | cabaña para familias / parejas en Santander; escapada de fin de semana en Santander; cabaña con chimenea en Santander | Planes, espacios | Media-alta (capacidad por confirmar) |
| Atributos | cabaña con parqueadero en Santander; alojamiento con cocina y varias habitaciones en Santander | Lista de datos, espacios, preguntas frecuentes | Media |
| Informativa | turismo rural en Berlín Santander; páramo de Berlín; El Picacho Santander | Destino, paisajes, lugares, qué hacer | Media |

Se descartó por ahora «alojamiento cerca de El Picacho Santander»: la distancia no está verificada. No se crearon páginas por variante de búsqueda, porque serían casi idénticas. Si en el futuro se escribe una guía propia (por ejemplo, cómo llegar a Berlín o qué llevar al páramo) con información verificada, puede ser una página aparte.

## D. Rendimiento (laboratorio, Lighthouse 12, Chromium headless)

Son datos de laboratorio con throttling simulado, no datos reales de usuarios (CrUX). INP no se mide en laboratorio; TBT es su indicador aproximado.

| Escenario | Perf. | LCP | FCP | TBT | CLS | Peso | Solicitudes |
|---|---|---|---|---|---|---|---|
| Antes, móvil (`http.server`) | 70 | 6,5 s | 2,8 s | 70 ms | 0,075 | 1.157 KiB | 28 |
| Antes, escritorio | 93 | 1,5 s | 1,0 s | 10 ms | 0,029 | 1.258 KiB | 30 |
| Después, móvil (`http.server`, sin compresión) | 79 | 4,8 s | 2,1 s | 10 ms | 0,08* | 927 KiB | 24 |
| Después, escritorio (`http.server`) | 98 | 1,1 s | 0,5 s | 0 ms | 0,03* | 1.162 KiB | 27 |
| Después, móvil (servidor con gzip y caché, modo publicación) | 96 | 2,8 s | 1,1 s | 60 ms | 0 | 618 KiB | 24 |
| Después, escritorio (ídem) | 100 | 0,7 s | 0,3 s | 0 ms | 0 | 712 KiB | 27 |

\* En modo revisión, la barra de aviso aparece después de cargar y mueve el contenido. En publicación no existe y el CLS es 0.

Accesibilidad pasó de 97 a 100, buenas prácticas quedó en 100 y SEO en 100, en los dos dispositivos.

**Otros datos**:
- **Foto del hero**: 60 KB en móvil (recorte de 768×1365) y 145 KB en escritorio a 1920 px (también hay 960, 1280 y 1600).
- **CSS bloqueante**: 8,8 KB (Bootstrap recortado) + 8,9 KB (`styles.css`), comprimidos.
- **JS diferido**: Bootstrap 16 KB, GSAP + ScrollTrigger 45 KB y JS propio 14 KB, comprimidos.
- **Sobre el LCP**: Chrome no cuenta como LCP una imagen que ocupa todo el viewport (la trata como fondo), así que el LCP del hero es texto. En el navegador sin throttling se pinta en 150–180 ms. Los 2,8 s móviles son la estimación simulada de 4G lento.

**Pendiente o descartado a propósito**:
- **Minificar** `styles.css` y el JS propio ahorraría unos 6 KB y 8 KB sin comprimir, y casi nada con gzip. No se añadió un build, para mantener la arquitectura sin compilación.
- **El JS «no usado»** (~100 KB según Lighthouse) es Bootstrap y GSAP. Está diferido y no bloquea (TBT ≤ 60 ms).
- **Inlinear el CSS crítico** podría bajar algo el LCP simulado, pero complica el mantenimiento. Se puede evaluar después con datos reales.

## E. Validaciones ejecutadas

- **Funcional (Playwright, Chromium)**:
  - formulario: errores con foco, fechas, capacidad y mensaje de WhatsApp codificado con el plan;
  - plan → WhatsApp o formulario;
  - pestañas con teclado; filtros de galería; visor con flechas, Escape, bloqueo del fondo y foco devuelto;
  - acordeón; menú móvil (abrir, cerrar con enlace y con Escape);
  - modo publicación sin «Por confirmar».
- **Sin desbordamiento horizontal** a 360, 390, 430, 768, 1024 y 1440 px. Sin errores de consola ni 404. Las 222 rutas locales referenciadas en `index.html` existen. Abierto como `file://`, el sitio funciona completo, pero Chrome bloquea las fuentes locales por CORS y usa las de respaldo (Georgia y la sans del sistema). Servido por HTTP las carga bien.
- **SEO**: un solo H1, sin saltos de encabezados, todas las imágenes con `alt`, sin anclas rotas ni enlaces vacíos. El hero no usa `loading="lazy"` y tiene `fetchpriority="high"`. Privacidad y condiciones responden 200 con `noindex`; una URL inexistente responde 404 con `noindex`.
- **`seo.py` con un dominio de prueba** (en una copia aparte): canonical, `og:url`, `og:image` absoluta, JSON-LD válido con `url`, `telephone` y `geo`, `sitemap.xml` y `robots.txt` con `Sitemap:`.
- **No ejecutadas** (necesitan la URL pública o una cuenta): PageSpeed Insights, Rich Results Test, Schema Markup Validator, Search Console, prueba real de las redirecciones HTTPS/www y de las cabeceras del hosting.

## F. Pendientes del propietario

- Confirmar las características que vienen del brief y completar la capacidad.
- Dominio definitivo, hosting (tipo y acceso) y acceso a Search Console.
- Número oficial de WhatsApp; redes y correo, si existen.
- Si se publicará la dirección o las coordenadas (autorización).
- ID de GA4, si se quiere medir; en ese caso, actualizar la política de cookies.
- Fotos reales de la cabaña (también para la imagen de Open Graph) con derechos de uso.

## G. Próximos pasos (por impacto y facilidad)

1. Dominio → `python3 tools/seo.py` → subir al hosting → activar HTTPS y la redirección canónica en `.htaccess`.
2. **Search Console**:
   - agregar la propiedad de dominio y verificarla con un registro DNS TXT;
   - enviar `https://<dominio>/sitemap.xml`;
   - inspeccionar la URL de inicio y solicitar la indexación;
   - revisar Páginas e Indexación a los pocos días, y Rendimiento y Core Web Vitals cuando haya datos.
3. Validar el JSON-LD en Rich Results Test y en Schema Markup Validator con la URL pública.
4. **Perfil de Negocio de Google**:
   - primero buscar si ya existe uno para la cabaña, para no duplicarlo;
   - si no existe y el negocio cumple los requisitos (atención real a huéspedes en la dirección), crearlo con el mismo nombre, zona y teléfono de la web;
   - si no se quiere mostrar la dirección, la ficha puede configurarse sin mostrarla según las opciones del perfil.
5. Reemplazar las fotos ilustrativas por fotos reales: es la mejora más grande para la conversión y para las imágenes en Google.
6. Activar GA4 (opcional) poniendo `ga4` en `config.js`. Eventos ya preparados: `clic_whatsapp`, `clic_reservar`, `consultar_plan`, `consulta_formulario` y `ver_mapa`. En GA4, marcar `consulta_formulario` y `clic_whatsapp` como eventos clave.
7. PageSpeed Insights en el dominio real. Con datos de campo, decidir si vale la pena inlinear el CSS crítico.

## H. Comandos

```bash
cd tresmarias
python3 -m http.server 8080          # ver en http://localhost:8080
python3 tools/imagenes.py            # tras cambiar fotos
python3 tools/seo.py                 # tras cambiar config.js (dominio, WhatsApp, datos)
```

El despliegue (archivos a subir y configuración de Apache, Nginx y Netlify) está en el README, sección «Despliegue».
