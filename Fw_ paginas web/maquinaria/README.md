# Rasante — Maquinaria y Equipos (demostración)

Sitio corporativo one-page para una empresa de **alquiler de maquinaria pesada, vehículos de carga y equipos para obra**.
Público: constructoras, contratistas, ingenieros, empresas industriales y entidades que contratan obra.
Objetivo comercial: que el visitante encuentre el equipo y pida una cotización (formulario o WhatsApp).

> **Todo es de demostración hasta recibir los datos reales.** «Rasante» es una marca ficticia, el catálogo
> describe *tipos* de equipo del sector (no inventario), las fotos son de referencia de Wikimedia Commons
> y no hay teléfono, WhatsApp, correo, dirección, cobertura, experiencia, clientes ni proyectos inventados.

## Ejecutar

```bash
cd maquinaria && python3 -m http.server 8080   # abrir http://localhost:8080
```

Sin build. HTML + CSS + JavaScript vanilla en scripts clásicos `defer` (también abre con `file://`).
Requiere internet para las dependencias de CDN (versión fija y hash SRI):

| Dependencia | Versión | Uso |
|---|---|---|
| Bootstrap (CSS + bundle JS) | 5.3.3 | rejilla, formularios, menú móvil (offcanvas) |
| Bootstrap Icons | 1.11.3 | iconos |
| GSAP + ScrollTrigger | 3.13.0 | animación de entrada del hero, revelado de fotos de servicios, línea de la vía, transición del catálogo al filtrar |
| Google Fonts | Barlow Condensed (500–700) y Barlow (400–600) | tipografía |

Si GSAP no carga o el usuario pidió movimiento reducido (`prefers-reduced-motion`), todo el contenido se ve completo y estático.

## Estructura

```
maquinaria/
  index.html            página principal (todas las secciones)
  creditos.html         autores y licencias de las fotos (se genera desde credits.js)
  privacidad.html       BORRADOR de aviso de privacidad (pendiente de revisión jurídica)
  404.html              página de error (funciona sin JS)
  robots.txt, sitemap.xml   generados por tools/seo.py
  assets/
    css/styles.css      estilos por bloques numerados; tokens de diseño en :root
    js/config.js        DATOS DE LA EMPRESA (único archivo a editar al recibir datos)
    js/catalogo.js      categorías y equipos del catálogo
    js/credits.js       créditos de fotos (generado por tools/fotos.py: no editar)
    js/main.js          interacciones (bloques numerados)
    js/paginas.js       lista de créditos en creditos.html
    img/hero/           4 fotos del carrusel de portada (hero, hero-2, hero-3, hero-4) en 960/1600/2400
    img/catalogo|servicios|proyectos|secciones/   fotos WebP en 2 anchos
    img/og-rasante.jpg  imagen para redes sociales (1200×630)
    icons/              favicon.svg, favicon-32.png, apple-touch-icon.png, logo.svg, logo.png
  tools/
    fotos.py            busca, recorta y registra fotos de Wikimedia Commons
    slots.md            qué foto va en cada lugar y criterios de aceptación
    credits.json        registro de créditos (fuente de credits.js)
    seo.py              canonical, Open Graph, JSON-LD, alt de imágenes, robots y sitemap
```

## Modo revisión / publicación

`config.js → modo`:

- `'revision'` (actual): barra «Sitio de demostración», etiquetas «Por confirmar», catálogo completo de referencia,
  botones de WhatsApp que avisan «por configurar» y llevan al formulario.
- `'publicacion'`: oculta todo lo marcado `data-status="pendiente"` y `.pending-tag`; el catálogo muestra **solo**
  equipos con `confirmado: true` (si no hay ninguno, muestra «Estamos preparando el catálogo» con un botón al formulario);
  los botones de WhatsApp se ocultan si no hay número; los diferenciadores sin confirmar no aparecen;
  la sección de cobertura se oculta si no hay ni sede ni zonas.

## Dónde cambiar cada cosa

| Qué | Dónde |
|---|---|
| Nombre de la empresa | `config.js → marca` y el texto «Rasante» en `index.html`, `creditos.html`, `privacidad.html`, `404.html`, `<title>`, logos SVG en línea |
| Logotipo | sustituir los `<svg class="marca__simbolo">` de cabecera y pie (o cambiarlos por `<img src="assets/icons/logo.svg">`), `assets/icons/*` |
| Teléfono, WhatsApp, correo, dirección, horario | `config.js → contacto` (WhatsApp solo dígitos con 57) |
| Mensajes iniciales de WhatsApp | `config.js → mensajes` (`{equipo}` y `{ciudad}` se reemplazan) |
| Cobertura y experiencia | `config.js → cobertura`, `experiencia` |
| Redes sociales | `config.js → redes` (solo URLs https confirmadas) |
| Ventajas («Qué puedes esperar») | `config.js → diferenciadores` (`confirmado: true` para publicarlas) |
| Equipos del catálogo | `catalogo.js → equipos` (nombre, uso, `specs` verificadas, `confirmado`) |
| Categorías y filtros | `catalogo.js → categorias` (los filtros, el índice bajo el hero, la placa y el formulario se generan solos) |
| Servicios | `index.html`, sección `#servicios` (5 artículos `.servicio`) |
| Proyectos | `index.html`, sección `#proyectos` (`.mosaico`). Hoy son **obras de referencia**; al tener proyectos autorizados, cambiar fotos, títulos y textos y quitar el aviso `data-status="pendiente"` |
| Texto de «Nosotros» | `index.html`, sección `#nosotros` (reemplazar el párrafo pendiente) |
| Formulario | `config.js → formEndpoint` (ver abajo) |
| Analytics / Search Console | ver abajo |

### Carrusel del hero

`index.html → .hero__media` tiene 4 `<img class="hero__slide">`. Solo la primera carga de entrada (es la imagen
LCP, con `fetchpriority="high"`); las demás llevan `data-src`/`data-srcset` y `main.js` las pide tras el evento `load`.
Fundido cada 6 s (`INTERVALO` en `bindCarrusel`), botón de pausa e indicadores accesibles (requisito WCAG 2.2.2);
se detiene con la pestaña oculta y, con `prefers-reduced-motion`, no avanza solo. Para añadir o quitar fotos basta
con añadir o quitar `<img class="hero__slide">` (los indicadores se generan solos). La primera foto también es la base
de `og-rasante.jpg`.

### Fotos

Cada foto tiene un «slot» (ver `tools/slots.md`). Para **sustituir por fotos propias** basta con guardar los WebP con el
mismo nombre y anchos (`catalogo/<id>-640.webp` y `-1280.webp` en 4:3; `servicios/<slot>-800/-1400` en 5:4;
`proyectos/<slot>-800/-1600` en 3:2; `hero/hero-960/-1600/-2400` en 16:9) y actualizar el `alt` y el crédito en
`tools/credits.json` (luego `python3 tools/fotos.py creditos` y `python3 tools/seo.py`).

Para buscar otra foto de referencia:

```bash
python3 tools/fotos.py buscar "wheel loader quarry" --out /tmp/cand     # hoja de contactos numerada
python3 tools/fotos.py usar "File:Nombre.jpg" --slot cargador-frontal --grupo catalogo \
  --ratio 4:3 --foco 0.5,0.55 --alt "Cargador frontal de ruedas cargando grava en una cantera"
python3 tools/seo.py   # actualiza los alt del HTML
```

`fotos.py` solo acepta CC0, dominio público, CC BY y CC BY-SA, y registra autor, licencia y fuente.
Las fotos CC BY / BY-SA exigen atribución: está en `creditos.html` (enlazada en el pie) y en el visor ampliado.

## Formulario

Valida en el navegador (mensajes junto a cada campo, foco en el primer error, sin depender solo del color).
**No simula envíos**:

- Sin `formEndpoint`: muestra «Solicitud lista, pero no enviada», el resumen, y ofrece *Enviar por WhatsApp*
  (si hay número) o *Copiar solicitud*. Encima del formulario se avisa de que no está conectado.
- Con `formEndpoint` (https): `POST` JSON con `nombre, empresa, telefono, correo, tipo, tipoNombre, ciudad, necesidad,
  origen, fecha`. Respuesta 2xx = «Solicitud enviada»; cualquier otra = error con alternativas.

Opciones para conectarlo: Formspree / Getform / Basin (endpoint https que reenvía al correo empresarial),
una función serverless propia (Cloudflare Workers, Netlify/Vercel Functions, AWS Lambda) que envíe correo
o cree el lead en el CRM, o un webhook de n8n/Make. Configure CORS para el dominio del sitio y protección
anti-spam (honeypot o Turnstile) en el servicio receptor.

## SEO

- `python3 tools/seo.py` tras editar `config.js` o las fotos: escribe Open Graph, canonical y `og:url`
  (solo con `dominio` https), `robots.txt`, `sitemap.xml` y los `alt` de las imágenes estáticas.
- **JSON-LD** (`LocalBusiness`/`Organization`) solo se genera si `marca.ficticia` es `false` y hay dominio,
  y únicamente con los datos confirmados en `config.js`.
- Un `h1` (hero), `h2` por sección, `h3` por servicio/equipo/paso. Meta descripción específica.
- Preparado para páginas individuales futuras: cada equipo tiene un `id` estable (`catalogo.js`) que puede servir de
  slug (`/equipos/excavadora-orugas/`), y cada servicio un ancla (`#servicio-tierras`…).
- **Search Console**: pegar la meta `google-site-verification` donde indica el comentario en `<head>` de `index.html`
  (o verificar por DNS).
- **Google Analytics 4**: poner el ID real en `config.js → analytics.ga4`. No se carga nada sin ID; con ID se muestra
  un aviso de consentimiento y gtag solo se carga si el visitante acepta (preferencia en `localStorage`).
  Revise con asesoría legal los requisitos de la Ley 1581 de 2012 antes de activarlo.

## Rendimiento

Fotos WebP recortadas y dimensionadas (catálogo ≈ 640 px para tarjetas y 1280 px para el visor), `srcset`/`sizes`,
`loading="lazy"` fuera del primer pantallazo, `width`/`height` explícitos, precarga del hero con `fetchpriority="high"`.
En «Toda la maquinaria» se pintan 12 equipos y el resto con «Mostrar los N equipos restantes».

Métricas que hay que medir con Lighthouse / PageSpeed Insights sobre el dominio real (no se declaran puntuaciones aquí):
LCP (la foto del hero, objetivo < 2,5 s), CLS (< 0,1), INP (< 200 ms), peso total transferido y número de peticiones,
y las auditorías de accesibilidad y SEO. Las fuentes de Google y los CDN pesan en el primer render: si hace falta,
alojarlos localmente (como en `tresmarias/`).

## Despliegue

Es un sitio estático: subir la carpeta completa (sin `tools/`, opcional) a Netlify, Vercel, Cloudflare Pages,
GitHub Pages o cualquier hosting con HTTPS. Configurar `404.html` como página de error si el hosting lo permite.
Antes de publicar: completar `config.js`, poner `modo: 'publicacion'`, `marca.ficticia: false`, `dominio`,
ejecutar `python3 tools/seo.py`, sustituir fotos de referencia por fotos propias y revisar el aviso de privacidad.

## Datos pendientes de confirmar

Nombre comercial y logotipo · actividad principal exacta · ciudad, departamento y dirección (si se publica) ·
zonas de operación · teléfono verificado · WhatsApp comercial · correo empresarial · horario · experiencia ·
historia de la empresa · listado real de equipos y servicios, con especificaciones verificadas ·
si se alquila con operador, transporte en cama baja, mantenimiento, documentación entregada ·
proyectos autorizados con fotos · redes sociales · responsable del tratamiento de datos (NIT, domicilio, canal de habeas data) ·
dominio · endpoint del formulario · ID de GA4 y verificación de Search Console · fotografías propias.

### Fotos que faltan o conviene cambiar

Sin foto todavía (la tarjeta muestra «Foto por confirmar» y no se abre en el visor; la sección se adapta):
`catalogo/tractocamion`, `camion-plataforma`, `cama-baja`, `carrotanque`, `camion-taller`, `fresadora`,
`rodillo-tandem`, `secciones/equipo-tecnico` (sección «Nosotros» a ancho completo sin foto) y `secciones/cta`
(la llamada final queda sobre fondo petróleo). Se buscan con `tools/fotos.py` según `tools/slots.md`.

Conviene sustituir: `catalogo/grua-telescopica` (rótulo «COLONIA» de una empresa de grúas en la pluma) y
`hero/hero-2` (solo se obtuvo a 1920 px; rótulo pequeño de contratista en el tercer camión).

## Pruebas

Hechas (Playwright + Chromium headless sobre `python3 -m http.server`, 19-oct-2026):

- 360, 390, 768, 1366 y 1920 px: sin desbordamiento horizontal, sin errores de consola, sin respuestas 404,
  sin imágenes rotas (tras desplazar toda la página para cargar las diferidas). Lo mismo en `creditos.html`,
  `privacidad.html` y `404.html` a 390 px.
- Revisión visual de cada sección a 1366 y 390 px y del hero a 768 y 1920 px; revisión de cada foto (pertinencia,
  encuadre, rótulos de empresas). Se reemplazaron el hero original (nombre de contratista visible) y la grúa
  telescópica (nombre y teléfono de empresa de alquiler).
- Catálogo: 12 tarjetas iniciales, «Mostrar los N restantes» → 42, cada filtro muestra solo su categoría,
  `aria-pressed` y región viva actualizados, el índice bajo el hero filtra y desplaza.
- Visor: abre, flechas ← → cambian de foto, contador, crédito con licencia, Escape cierra y el foco vuelve a la tarjeta;
  galería de proyectos 5 fotos.
- Placa del hero: la categoría cambia la lista de equipos; «Continuar en el formulario» pasa equipo y ciudad.
- Formulario: envío vacío marca 6 errores y enfoca el primero; teléfono y correo inválidos con mensaje; envío válido
  sin endpoint muestra «Solicitud lista, pero no enviada» con resumen.
- WhatsApp sin número (revisión): avisa «por configurar» y preselecciona el equipo en el formulario.
- Modo publicación (configuración inyectada en el navegador): sin datos oculta barra demo, etiquetas, WhatsApp,
  cobertura y ventajas, y el catálogo muestra «preparando»; con datos y un equipo confirmado muestra topbar, solo ese
  equipo con su especificación, enlace `https://wa.me/57…?text=` con el nombre del equipo, zonas y FAQ de zonas.
- Carrusel: avanza a los 6 s, indicadores con `aria-current`, pausa detiene el avance, con movimiento reducido arranca
  en pausa; las fotos 2–4 no se piden antes de `load`.
- Menú móvil (offcanvas) abre y se cierra al navegar; el primer Tab enfoca «Saltar al contenido».

Pendientes de comprobación manual:

- Lighthouse / PageSpeed Insights sobre el dominio real (LCP, CLS, INP, peso). No se midió aquí.
- Lectores de pantalla reales (NVDA, VoiceOver, TalkBack) y navegadores Safari/Firefox, iOS y Android físicos.
- Contraste de los textos sobre cada foto del carrusel (hay veladura, pero conviene revisarlo con fotos propias).
- Envío real del formulario cuando exista `formEndpoint`, y enlaces de WhatsApp con el número real.
- Validación jurídica del aviso de privacidad y del aviso de cookies para GA4.
