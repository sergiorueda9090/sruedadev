# Landing pages de limpieza y lavado profesional — Bucaramanga y área metropolitana

Tres landing pages **independientes**, cada una con identidad visual, estructura y narrativa propias, para captar cotizaciones por WhatsApp. Las marcas (Renueva Hogar, Descanso Fresco, Hogar Claro) son **provisionales y editables**; ningún dato de contacto, precio, cifra ni testimonio es real.

| Carpeta | Marca provisional | Servicio | Concepto visual | Elemento protagonista |
|---|---|---|---|---|
| `lavado-muebles/` | Renueva Hogar | Lavado de sofás, salas, poltronas y sillas tapizadas | «Muestrario de tapicería»: blanco con un leve tono menta, turquesa profundo y menta; Bricolage Grotesque + Figtree; bordes en zigzag de tijera de picos y costuras punteadas | Muestrario de muebles con pestañas, costura del proceso que se dibuja al bajar y comparador antes/después |
| `lavado-colchones/` | Descanso Fresco | Limpieza de colchones (sencillo a king), cabeceros y almohadones | «Mañana tranquila»: gris perla, azul cielo y verde agua; Young Serif + Instrument Sans; composición centrada y radios grandes en forma de almohada | Plano del colchón a escala: eliges el tamaño, el plano cambia y el botón arma el mensaje de WhatsApp con tamaño y municipio |
| `limpieza-hogar/` | Hogar Claro | Aseo general, limpieza profunda, cocinas, baños, mudanzas, posremodelación y oficinas pequeñas | «Plano y lista de chequeo»: blanco, beige y verde; Schibsted Grotesk como única familia; retícula ordenada con casillas de verificación | Plano interactivo del apartamento: cada espacio o servicio muestra lo que **incluye** y lo que **no incluye** |

Cada carpeta contiene: `index.html`, `assets/css/styles.css`, `assets/js/config.js` (**datos comerciales**), `assets/js/main.js`, `assets/js/legal.js`, `assets/images/` (WebP + `CREDITOS.md`), `assets/favicon.svg`, `privacidad.html`, `robots.txt` y, en `limpieza-hogar/`, `condiciones.html`. No comparten archivos: se pueden entregar o publicar por separado.

## Ejecutar en local

```bash
cd lavanderia_muebles
python3 -m http.server 8080
# http://localhost:8080/lavado-muebles/
# http://localhost:8080/lavado-colchones/
# http://localhost:8080/limpieza-hogar/
```

También funcionan abriendo el `index.html` directamente (scripts clásicos, sin módulos ni build).

## Dependencias (CDN, versión fija con SRI)

- Bootstrap 5.3.3 (CSS + bundle JS: menú colapsable y acordeones)
- Bootstrap Icons 1.11.3
- GSAP 3.13.0 + ScrollTrigger
- Google Fonts (Bricolage Grotesque, Figtree, Young Serif, Instrument Sans y Schibsted Grotesk)

No se usa jQuery: ninguna interacción lo necesitaba (pestañas, filtros, formularios y plano están en JavaScript vanilla). Tampoco AOS, porque GSAP ya cubre las animaciones.

**Alternativas si falla una librería** (probadas bloqueando el CDN): todo el contenido y los formularios siguen visibles y funcionando. Sin GSAP no hay animaciones; sin Bootstrap JS, el menú móvil no se despliega, pero las secciones siguen accesibles con el desplazamiento, y en el FAQ de las landings 1 y 2 las respuestas no se despliegan (el de la landing 3 usa `<details>` nativo y sí funciona). Si una foto no carga, su contenedor muestra un fondo de respaldo con el texto «Imagen no disponible».

## Qué editar: `assets/js/config.js`

Cada landing tiene su objeto `window.SITE`:

| Campo | Para qué |
|---|---|
| `modo` | `'revision'` muestra la barra de demostración y los avisos «Por configurar». **Cambiar a `'publicacion'` solo con los datos completos.** En publicación se ocultan los avisos y, en la landing 1, la simulación de antes/después |
| `marca.nombre`, `marca.descriptor` | Nombre comercial (se actualiza en el header, el footer y las páginas legales). **También hay que cambiarlo a mano en `<title>`, `meta description` y `og:*` de cada HTML** |
| `whatsapp` | Número en formato `57XXXXXXXXXX` (sin `+` ni espacios). Vacío = los botones llevan al formulario y el formulario explica que el número no está configurado |
| `contacto` | Teléfono, correo, horario, dirección. Lo vacío no se muestra |
| `municipios`, `ciudadPrincipal` | Cobertura (la página aclara que se confirma por barrio) |
| `redes` | URLs `https://` de Instagram, Facebook y TikTok |
| `mensajes` | Mensajes precargados de WhatsApp (con marcadores `{mueble}`, `{tamano}`, `{municipio}`, `{tipo}`, `{servicio}` o `{paquete}`) |
| `paquetes` | Nombre, alcance y `precio` (`null` = «Solicitar cotización»; entero en COP para mostrar «Desde $…») |
| `resultados` (muebles) | Pares reales antes/después **del mismo mueble**. Mientras esté vacío se muestra una simulación marcada como ilustrativa (solo en modo revisión) |
| `tamanos` (colchones) | Medidas de referencia del plano a escala |
| `colores` (colchones) | Color primario y de acento opcionales |
| `servicios`, `complementoTapiceria` (hogar) | Activar o desactivar servicios; mostrar la opción de combinar con lavado de tapicería solo si el negocio la ofrece |
| `aviso.responsable`, `aviso.nit` | Responsable del tratamiento de datos (aparece en la política de privacidad) |
| `seo.dominio` | Dominio definitivo. Sin dominio no se generan canonical ni datos estructurados |

## Datos que el propietario debe completar

1. **Número de WhatsApp** de cada marca (y teléfono de llamadas si es distinto).
2. **Nombre comercial definitivo**, logotipo (si existe; hoy hay un logotipo tipográfico con un ícono SVG) y favicon.
3. Correo, horario de atención y redes sociales.
4. Cobertura real por municipio o barrio.
5. Tarifas, si se quieren publicar.
6. **Fotos propias**: las actuales son de banco de imágenes (Unsplash y Pexels, con licencia de uso comercial) y **no muestran trabajos del negocio**. Ver `assets/images/CREDITOS.md` en cada landing.
7. Fotos reales de antes y después (muebles) para `resultados`.
8. Responsable y NIT para la política de privacidad; revisión legal de `privacidad.html` y `condiciones.html` (la base cita la Ley 1581 de 2012).
9. Dominio, para canonical, `og:image` absoluta, sitemap y datos estructurados.

## Formularios: qué hacen y qué no

- Validan los campos obligatorios de forma accesible: resumen del error, foco en el primer campo con error y mensajes asociados con `aria-describedby`.
- **No envían nada a ningún servidor ni guardan datos.** Al pulsar «Preparar mensaje» se muestra el texto en un cuadro editable; la persona lo revisa y abre WhatsApp con él, o lo copia.
- Las **fotos no se adjuntan** desde el formulario: el enlace `wa.me` solo transporta texto. La página lo dice y el mensaje termina con «Les envío fotos por este chat». Para subir fotos desde la página se necesitaría un backend (por ejemplo, un formulario con almacenamiento propio); no se simuló.

## Imágenes

`tools/fotos.py` (Python con la biblioteca estándar + Pillow) descarga cada foto de `tools/fotos.json`, la recorta a la proporción de su espacio y genera WebP en varios anchos, además de `CREDITOS.md`:

```bash
python3 tools/fotos.py todo                       # todas
python3 tools/fotos.py todo --solo lavado-muebles  # una landing
```

Para usar fotos propias: reemplaza los archivos `assets/images/<slot>-<ancho>.webp` con los mismos nombres y proporciones, o agrega una entrada al manifiesto. La carpeta `tools/` no se publica.

## Publicar

Son archivos estáticos: sube **el contenido de una carpeta de landing** a la raíz del hosting (Netlify, Vercel, Cloudflare Pages, GitHub Pages o cualquier hosting compartido por FTP).

1. Completa `config.js` y cambia `modo` a `'publicacion'`.
2. Cambia `<title>`, `meta description` y `og:title` si cambió el nombre; pon `og:image` como URL absoluta (`https://tu-dominio.com/assets/images/…`).
3. Pon el dominio en `seo.dominio` (genera canonical y, con un teléfono real, datos estructurados `LocalBusiness`). Para buscadores que no ejecutan JavaScript, conviene además escribir `<link rel="canonical" href="https://tu-dominio.com/">` directamente en el `<head>`.
4. Crea `sitemap.xml` con la URL de la página y descomenta la línea `Sitemap:` de `robots.txt`.
5. No subas `tools/` ni archivos `.md` que no quieras publicar.

### Dominio y analítica

- Un dominio por marca (p. ej. `renuevahogar.com.co`) con HTTPS. Si las tres marcas son del mismo negocio, puede convenir un solo dominio con tres rutas; en ese caso, ajusta canonical y sitemap.
- Analítica: Google Analytics 4 o una opción sin cookies (Plausible, Umami). Mide como conversiones los clics en `a[href^="https://wa.me"]` y el envío de «Preparar mensaje». Si usas cookies de analítica, agrega el aviso correspondiente en la política de privacidad.
- Da de alta Google Search Console y un **Perfil de Empresa en Google** con los datos reales; es lo que más pesa en las búsquedas locales («lavado de muebles en Bucaramanga»).

## Pruebas realizadas

Con Chrome sin interfaz (Playwright) sobre `python3 -m http.server`:

- **Resoluciones** 360×800, 390×844, 768×1024, 1366×768 y 1920×1080 en las tres páginas: sin desplazamiento horizontal, sin errores de consola, sin recursos 404 y sin imágenes rotas. Revisión visual de capturas completas a 1366 y 390 px.
- **WhatsApp**: sin número, los botones llevan al formulario; con un número de prueba inyectado solo durante el test, los enlaces son `https://wa.me/<número>?text=…` con texto bien codificado (acentos, `&`, `#`, saltos de línea), mensajes distintos por mueble, paquete, servicio y tamaño, y el mensaje editado se respeta.
- **Formularios**: validación, foco en el primer error, fecha pasada rechazada (hogar), vista previa editable, botón deshabilitado y explicado sin número, y botón para copiar.
- **Interacciones**: menú móvil (abre, cierra al elegir un enlace y navega), pestañas del muestrario con mouse y flechas, plano de colchón (cambio de tamaño, proporción sencillo/king = 0,499), radiogroup con teclado, filtros de la galería, plano del hogar (clic en un espacio, pestañas con teclado), comparador antes/después y modo publicación.
- **Accesibilidad**: «Saltar al contenido» como primer elemento con Tab, un único H1, `alt` en todas las imágenes, etiquetas en todos los campos, objetivos táctiles de al menos 40 px y contraste AA calculado en los pares de color con texto (se oscurecieron el verde de WhatsApp y el turquesa de la landing 2 para cumplirlo).
- **Degradación**: con `prefers-reduced-motion` el contenido aparece sin animación; con el CDN bloqueado no hay errores propios y el contenido y los formularios siguen visibles.

Durante las pruebas se corrigieron: el plano SVG del hogar no aparecía (el atributo `hidden` en SVG se quita con `removeAttribute`), la rejilla de «ocasiones» desbordaba, y un error de usabilidad en los tres formularios: al corregir un campo y pulsar enseguida el botón, el mensaje de error se ocultaba al perder el foco, el botón se desplazaba y el clic no llegaba. Ahora se revalida mientras se escribe.

## Pendientes y limitaciones conocidas

- No se probó en Safari/iOS ni en Firefox (solo Chromium). No se hizo una auditoría con lector de pantalla real.
- Sin datos reales, los datos estructurados `LocalBusiness` no se publican (es intencional).
- Las fotos de banco de imágenes son la mayor limitación para la credibilidad: el trabajo real del negocio debe reemplazarlas.
- Las medidas de colchón son referencias comunes en Colombia; cada fabricante puede variar.
