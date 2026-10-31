# Sector jurídico: tres landing pages de demostración (SRuedaDev)

Tres sitios estáticos **independientes** para mostrar a abogados y firmas en Colombia. No comparten CSS, JS ni fotografías: cada carpeta se puede copiar sola a un hosting tradicional.

| Carpeta | Marca de demostración | Público | Concepto visual |
|---|---|---|---|
| `landing-01-abogado-personal/` | Abogado Fabián Blanco | Personas y empresas que buscan conocer el perfil de un abogado independiente | **Membrete**: papel cálido, azul marino, línea dorada; Libre Caslon + Hanken Grotesk; monograma «FB», ficha de datos profesionales, índice de áreas |
| `landing-02-firma-juridica/` | Blanco & Asociados — Consultoría jurídica empresarial | Emprendedores, pymes y empresas consolidadas | **Plano arquitectónico**: blanco, azul petróleo, grafito, bronce; Archivo con anchos variables; retícula visible, panorama 21:9, directorio de servicios en pestañas, línea de tiempo que se traza al desplazarse |
| `landing-03-servicios-juridicos/` | Tu Derecho, Nuestra Orientación | Personas naturales con asuntos de familia, laborales o civiles | **Conversación**: blanco cálido, crema, verde profundo, terracota; Bricolage Grotesque + Atkinson Hyperlegible; foto en arco con burbuja de atajos, tarjetas de situación que se despliegan, pestañas por área |

## Ejecutar

```bash
cd abodago/sector-juridico
python3 -m http.server 8080
# http://localhost:8080/landing-01-abogado-personal/
# http://localhost:8080/landing-02-firma-juridica/
# http://localhost:8080/landing-03-servicios-juridicos/
```

También funcionan abriendo `index.html` directamente (`file://`). Requieren internet para las librerías por CDN con versión fija: Bootstrap 5.3.3, Bootstrap Icons 1.11.3, GSAP 3.13.0 + ScrollTrigger y Google Fonts. Las fotos son locales (WebP).

## Estructura de cada landing

```
index.html                 contenido semántico, SEO (title, description, Open Graph), favicon
assets/css/styles.css      variables de diseño en :root (colores, tipografía, espaciado)
assets/js/main.js          configuración al inicio + menú, formulario, WhatsApp y animaciones
assets/images/             fotos WebP en varios anchos, favicon.svg y CREDITOS.md
```

## Personalizar (todo está al inicio de `assets/js/main.js`)

```js
const WHATSAPP_NUMBER = "573XXXXXXXXX"; // 57 + 10 dígitos, sin espacios ni «+»
const FORM_ENDPOINT = "";               // URL que recibe el formulario por POST (JSON)
const MODO = 'revision';                // 'publicacion' oculta avisos y datos «Por confirmar»
```

- **WhatsApp**: mientras el número sea el marcador `573XXXXXXXXX`, los botones no abren un enlace roto: muestran un aviso «WhatsApp aún no configurado». Con un número válido, todos los botones (incluido el flotante) abren `https://wa.me/<número>?text=<mensaje>` con un mensaje distinto según el botón (`data-whatsapp` en el HTML).
- **Formulario**: valida en el navegador con mensajes accesibles y lleva el foco al primer error. Sin `FORM_ENDPOINT` **no simula un envío exitoso**: indica que es una demostración y que no se envió nada. Con endpoint, hace `fetch` POST en JSON y solo confirma si el servidor responde `2xx`.
- **Áreas y servicios configurables**:
  - Landing 01: objeto `AREAS` (`civil`, `comercial`, `laboral`, `familia`, `administrativo`, `asesoria`). `true` = confirmada por el abogado. En modo publicación solo se muestran las confirmadas.
  - Landing 03: objeto `SERVICIOS` (15 servicios por clave, coinciden con `data-servicio` en el HTML). Los no confirmados se marcan «Por confirmar» en revisión y se ocultan en publicación.
  - Landing 02: los 8 servicios están en el HTML (`.dir-panel`); elimine los que la firma no preste y su opción en el `<select>` del formulario.
- **Datos «Por confirmar»** (tarjeta profesional, teléfono, correo, domicilio, formación, cargos): se reemplazan directamente en `index.html`. Los elementos con `data-pendiente` desaparecen en modo publicación.
- **Colores y tipografía**: variables en `:root` de cada `styles.css`.
- **Fotos**: las del equipo, el retrato del abogado y las oficinas son de referencia (Unsplash). Sustitúyalas por fotos reales del cliente. Para cambiar o recortar fotos, edite `tools/fotos.json` (id de Unsplash/Pexels, proporción, anchos, foco, alt) y ejecute `python3 tools/fotos.py todo` (requiere Pillow): genera los WebP y `assets/images/CREDITOS.md`.

## Antes de publicar

1. Reemplazar todos los datos «Por confirmar» por datos reales y verificados; `MODO = 'publicacion'`.
2. Configurar `WHATSAPP_NUMBER` y `FORM_ENDPOINT`.
3. Sustituir fotos de referencia, nombres y perfiles de demostración (landing 02) y redactar los artículos reales.
4. Redactar el aviso de privacidad completo con el responsable del tratamiento (Ley 1581 de 2012).
5. Quitar `<meta name="robots" content="noindex, follow">`, poner URL absolutas en `canonical` y `og:image` y, si hay datos reales verificados, añadir JSON-LD (`Attorney` / `LegalService`). No se incluyó JSON-LD porque no hay datos reales que lo respalden.

## Responsabilidad profesional (Ley 1123 de 2007)

El artículo 31, numeral 1, del Código Disciplinario del Abogado considera falta contra el decoro profesional la propaganda que no se limite al nombre del abogado, sus títulos y especializaciones académicas, los cargos desempeñados, los asuntos que atiende de preferencia o con exclusividad y los datos de su domicilio profesional. Por eso las tres páginas:

- No prometen resultados ni usan superlativos («el mejor», «éxito garantizado»), cifras de casos, premios ni testimonios.
- Presentan las áreas como «asuntos que se atienden», configurables y sin afirmar que se prestan todas.
- Marcan como ejemplo los perfiles, la historia de la firma y los artículos, y dejan vacíos los títulos y cargos hasta acreditarlos.
- Aclaran que el contacto inicial no crea una relación abogado-cliente y piden no enviar información confidencial por el formulario.

La Corte Constitucional estudió los artículos 30 a 40 de la ley en la Sentencia C-009 de 2023. Antes de publicar, el abogado o la firma deben validar el texto final con el régimen vigente.

## Verificación realizada

Con Playwright y Chrome headless (2026-10-30):

- Anchos de 360, 390, 768, 1440 y 1920 px: sin desbordamiento horizontal, sin errores de consola y sin respuestas 404.
- Prueba funcional en las tres páginas: el menú móvil abre y se cierra al navegar, el formulario valida y lleva el foco al primer error, sin endpoint muestra el aviso de demostración, sin número de WhatsApp aparece el aviso y con un número configurado se generan enlaces `wa.me`. También abren el aviso de privacidad y el acordeón; el botón para volver arriba funciona, las anclas internas son válidas y todas las imágenes cargan.
- Landing 02: pestañas con teclado y botón «Consultar» que preselecciona el tipo de consulta. Landing 03: pestañas por área, atajos del hero que abren la tarjeta de situación y acordeón `<details>`.
- Sin JavaScript se ve todo el contenido. Con `prefers-reduced-motion` el hero aparece de inmediato.
