# Showroom de sitios web para construcción e ingeniería

Cinco sitios corporativos **conceptuales** (marcas ficticias) y un showroom que los presenta, pensados para mostrar a prospectos del sector cómo puede verse y funcionar su sitio web. Todo es estático: HTML, CSS y JavaScript sin build ni servidor de aplicación.

| Demo | Carpeta | Marca ficticia | Idea central |
|---|---|---|---|
| Constructora corporativa | `assets/constructora/` | Basalto Constructora | Portada asimétrica, portafolio filtrable, cotización |
| Ingeniería civil y geotecnia | `assets/geotecnia/` | Estrato Geotecnia | Servicios como registro de perforación |
| Remodelaciones y mantenimiento | `assets/remodelaciones/` | Obra Fina Remodelaciones | WhatsApp como canal principal, comparador antes/después |
| Topografía | `assets/topografia/` | Cota Cero Topografía | Curvas de nivel y panel de capas tipo SIG |
| Ingeniería multidisciplinaria | `assets/ingenieria-integral/` | Nodo Ingeniería Integral | Matriz disciplinas × etapas |

La estructura sigue la pedida en el brief (`construction-engineering-showcase/`), con la raíz en esta carpeta `construccion/`.

## Ejecutar

```bash
cd construccion
python3 -m http.server 8080
# abrir http://localhost:8080
```

También abre con doble clic (`file://`): todos los scripts son clásicos, sin módulos ES ni `fetch` de archivos locales.

Requiere internet para las dependencias CDN (versiones fijas y con SRI): Bootstrap 5.3.3 (solo CSS), Bootstrap Icons 1.11.3, AOS 2.3.4 y Google Fonts. Si AOS no carga, el contenido se ve completo sin animaciones; si las fuentes no cargan, se usan las del sistema.

## Estructura

```
construccion/
├── index.html                      showroom
├── README.md
├── research/
│   ├── company-profiles.md         investigación de 18 empresas de Santander (fuentes y fechas)
│   ├── design-decisions.md         dirección de arte de cada sitio
│   └── image-spec.md               especificación de fotografías por sitio
└── assets/
    ├── shared/
    │   ├── css/base.css            piezas comunes: barra del showroom, foco, estados de formulario, visor, diálogos, modo revisión
    │   ├── css/showroom.css        estilos del showroom
    │   ├── js/core.js              núcleo común (window.CES): contacto, WhatsApp, formularios, visor, pestañas, menú móvil
    │   ├── js/showroom-config.js   datos del estudio que presenta el showroom
    │   ├── js/showroom.js
    │   └── images/                 capturas de vista previa y favicon del showroom
    └── <sitio>/
        ├── index.html
        ├── favicon.svg
        ├── css/styles.css          identidad visual propia (variables en :root)
        ├── js/config.js            ÚNICO archivo de datos editables del sitio
        ├── js/main.js              comportamiento propio del sitio
        └── images/                 fotos WebP (-800 y -1600) + credits.js
```

Cada sitio carga en este orden: `AOS → js/config.js → images/credits.js → ../shared/js/core.js → js/main.js` (todos `defer`).

## Personalizar un sitio

Todo dato de contacto o de negocio se edita en `js/config.js` del sitio (y en `assets/shared/js/showroom-config.js` para el showroom):

```js
window.SITE = {
  modo: 'revision',          // 'revision' | 'publicacion'
  marca: 'Basalto Constructora',
  canonical: '',             // URL https definitiva; vacío = no se declara
  formEndpoint: '',          // URL https que recibe POST JSON; vacío = no se envía nada
  whatsappMensaje: '…',      // mensaje predefinido
  contacto: { telefono: '', whatsapp: '', email: '', direccion: '', ciudad: '', horario: '' }
};
```

- **Modo revisión**: los datos vacíos aparecen como «Por configurar» y se ven los bloques marcados `data-status="pendiente"` (contenido que la empresa debe confirmar: interventoría, drones/LiDAR, sectores…). **Modo publicación**: todo eso se oculta. Antes de publicar, confirme cada bloque pendiente y quite su `data-status`, o elimínelo.
- **WhatsApp**: número en formato internacional sin signos (`573001234567`). Sin número, los botones abren un diálogo que explica que falta configurarlo (revisión) o se ocultan (publicación). Nunca se inventa un número.
- **Textos y marca**: están en el HTML de cada sitio. Para cambiar colores o tipografía, edite las variables de `:root` en `css/styles.css`.
- **Fotos**: cada imagen existe en `nombre-800.webp` y `nombre-1600.webp`; el HTML usa `srcset`. Al sustituir una foto por una propia, mantenga los dos tamaños, actualice `width`/`height` y el `alt`, y quite la etiqueta «Foto de referencia» solo si la foto es de una obra real de la empresa. Registre en `images/credits.js` las fotos de terceros.

## Conectar los formularios

Los formularios **no simulan envíos**. Validan en el navegador (mensajes en español, foco en el primer error, `aria-invalid`) y luego:

1. Si `formEndpoint` tiene una URL https, envían un `POST` con `Content-Type: application/json` y los campos del formulario. Solo muestran éxito con una respuesta 2xx; si falla, conservan los datos y ofrecen WhatsApp o correo.
2. Si no hay endpoint, dicen que los datos no se enviaron y ofrecen enviarlos por WhatsApp o correo (si están configurados).

Servicios compatibles sin backend propio: Formspree, Getform, Basin, un webhook de n8n/Make/Zapier o una función serverless. Verifique que el servicio acepte JSON y CORS desde su dominio.

## Desplegar

1. Configure `js/config.js` de cada sitio (y el del showroom): datos reales, `modo: 'publicacion'`, `formEndpoint`, `canonical`.
2. Quite `<meta name="robots" content="noindex">` de las páginas que deban indexarse (está puesto porque son demos con marcas ficticias).
3. Para compartir en redes, añada `og:image` con una URL **absoluta** a una imagen 1200×630 y, si lo prefiere, un `<link rel="canonical">` estático.
4. Suba la carpeta tal cual a cualquier hosting estático (Netlify, Vercel, GitHub Pages, Cloudflare Pages, Apache/Nginx). No requiere build.
5. Datos estructurados (`schema.org/LocalBusiness`): agréguelos solo con información real y verificada de la empresa.

## Reglas de contenido

- Marcas ficticias; antes de usar una marca en producción, verifique que no coincida con una registrada.
- Sin métricas, testimonios, certificaciones, licencias, clientes, precios, garantías ni plazos inventados.
- Portafolios y casos usan fotos de referencia con licencia libre, etiquetadas como tales y descritas por tipología, sin nombres de proyecto.
- La investigación de empresas reales (`research/company-profiles.md`) solo orientó los arquetipos: no se copiaron textos, imágenes ni diseños.

## Pruebas realizadas (17 de octubre de 2026, Chrome headless + Playwright)

- **6 páginas × 360, 390, 576, 768, 1024, 1440 y 1920 px**: sin desbordamiento horizontal, sin errores ni avisos de consola, sin respuestas 4xx/5xx y sin imágenes rotas.
- **Análisis estático**: todos los enlaces internos, anclas y `srcset` resuelven; un único `h1` por página y sin saltos de nivel de encabezado; todas las imágenes con `alt`; sin `href="#"`; todo `target="_blank"` lleva `noopener`; títulos y descripciones únicos.
- **Funcionales** (resultados reales de cada sitio):

  | Página | Pruebas superadas |
  |---|---|
  | Showroom | 24/24 |
  | Constructora | 24/24 |
  | Geotecnia | 16/16 |
  | Remodelaciones | 28/28 |
  | Topografía | 25/25 |
  | Ingeniería integral | 34/34 |

  Cubren: menú móvil (abrir, cerrar con Escape o con un enlace, retorno del foco); formulario vacío (errores, `aria-invalid`, foco en el primero, grupos de casillas); formulario válido sin endpoint (dice que no se envió nada); WhatsApp sin número (diálogo) y con número inyectado (`wa.me` con el texto correcto); pestañas, registro, capas y matriz con teclado; visor de galería (flechas, Escape, retorno del foco); filtros del portafolio; comparador con teclado; modo publicación (oculta pendientes y «Por configurar»); movimiento reducido; ida y vuelta showroom ↔ cada demo.
- **`file://`**: las seis páginas cargan sin errores.
- Revisión visual de capturas a 390, 768 y 1440 px de todas las páginas.

## Limitaciones conocidas

- **Fotos de referencia**: todas son de Wikimedia Commons (CC0, dominio público, CC BY, CC BY-SA), y algunas son de lugares reconocibles (p. ej., el hero de Constructora es un museo en Saitama, Japón). Ninguna se presenta como obra de la empresa. Para un cliente real, sustitúyalas por fotos propias. Las CC BY/BY-SA exigen mantener el crédito, que ya aparece en el pie de cada sitio.
- **Pocas fotos para algunos temas**: en Topografía, la galería repite fotos de otras secciones y el hero no muestra a un topógrafo; en Ingeniería integral, la foto de interventoría se recortó para excluir rostros.
- **Capturas automáticas de página completa**: con AOS activo, las secciones que aún no se han animado salen en blanco. No es un fallo del sitio: al desplazarse se animan, y con movimiento reducido todo se ve desde el inicio.
- **Requiere internet** para CDN y fuentes.
- **Investigación**: 14 de las 18 empresas se confirmaron en Santander. Algunos directorios bloquearon las consultas (HTTP 429). Los detalles y pendientes están en `research/company-profiles.md`.
