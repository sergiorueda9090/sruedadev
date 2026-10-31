# Landing pages para transporte, mudanzas y logística

Tres landing pages de demostración, independientes entre sí, más un índice de portafolio. Las desarrolló **SRuedaDev** para presentarlas a empresas de Bucaramanga, Floridablanca, Girón, Piedecuesta y el resto de Santander.

| Carpeta | Demo | Para quién | Identidad |
|---|---|---|---|
| `transporte-carga/` | **Ruta Cargo** | Distribuidoras, comercios y fabricantes con despachos frecuentes | Corporativa y luminosa. Azul marino y azul intenso, naranja solo en las acciones. Archivo con ancho expandido. Motivo: «línea de ruta» con paradas (cobertura y proceso) |
| `mudanzas-acarreos/` | **Mudanza Pro** | Familias, oficinas y comercios que se trasladan | Cercana. Blanco cálido, verde petróleo, beige y ámbar. Bricolage Grotesque y Figtree. Motivo: «etiqueta de trasteo» kraft con cinta (cotizador) |
| `carga-segura/` | **Carga Segura 360** | Empresas que mueven mercancía en furgón cerrado | La más corporativa. Azul profundo, gris acero, verde para lo confirmado y naranja para las acciones. Source Serif 4 e IBM Plex Sans. Motivo: protocolo de buenas prácticas interactivo |

Los tres nombres son **provisionales**: no son empresas reales, ni marcas verificadas, ni clientes. Las páginas no inventan teléfonos, cifras, certificaciones, pólizas, rastreo GPS, años de experiencia, testimonios ni precios. Cada dato que depende de la empresa real está en `js/config.js`.

## Estructura

```
mudanzas/
├── index.html                  Índice del portafolio (tarjetas con vista previa de cada demo)
├── assets/                     css/index.css, favicon.svg, previews/ (capturas reales de cada hero)
├── transporte-carga/           ┐
├── mudanzas-acarreos/          ├─ cada una: index.html · css/styles.css · js/config.js · js/main.js
├── carga-segura/               ┘           js/creditos.js (generado) · assets/favicon.svg · assets/images/*.webp
└── tools/
    ├── fotos.json              Manifiesto de fotos: fuente, id, recorte, autor, texto alternativo
    └── fotos.py                Descarga, recorta y convierte a WebP; escribe créditos
```

Cada landing funciona por sí sola: se puede copiar su carpeta a otro hosting sin las demás. El único enlace entre ellas es «Ver las tres propuestas» en el pie (`../index.html`). Elimínalo si publicas una demo suelta.

## Ejecutar

```bash
cd mudanzas && python3 -m http.server 8080
# http://localhost:8080/  (índice)   http://localhost:8080/carga-segura/   etc.
```

También funcionan abriendo el `index.html` directamente (`file://`): los scripts son clásicos con `defer`, no módulos.

Se necesita internet para las dependencias, que se cargan desde jsDelivr con versión fija y hash SRI. Ninguna es obligatoria para leer el contenido:

- Bootstrap 5.3.3: CSS y bundle JS, usados en el menú móvil y el acordeón de preguntas.
- Bootstrap Icons 1.11.3.
- GSAP 3.13.0 + ScrollTrigger.
- Google Fonts.

Si cambias una versión, actualiza también su `integrity`.

## Personalizar para un cliente real

### 1. Datos comerciales: `js/config.js` (único archivo por landing)

| Campo | Qué es |
|---|---|
| `modo` | `'revision'` muestra la barra de demostración y los avisos «Por configurar». `'publicacion'` oculta todo lo que no tenga dato |
| `businessName` | Nombre comercial. Se aplica al header, el footer y el copyright. **Cambia también `<title>` y las metas `description` y `og:*` en `index.html`** |
| `whatsappNumber` | `57` + 10 dígitos, sin `+` ni espacios. Ejemplo de **formato**: `573001234567`. Vacío o con formato inválido, los botones llevan al formulario y el formulario muestra el mensaje en vez de abrir WhatsApp |
| `phone`, `email`, `schedule`, `address` | Contacto del pie. Vacío = «Por configurar» en revisión, oculto en publicación |
| `legal.razonSocial`, `legal.nit` | Datos legales del pie |
| `serviceArea` | Municipios de cobertura. Alimenta la ruta del hero, la sección de cobertura, el pie y los textos «en Bucaramanga, Floridablanca…» |
| `regionalDestinations` | Destinos fuera del área metropolitana **confirmados**. Vacío = «se confirman al cotizar» |
| `social.*` | URL `https://` completa. Vacío = el icono no se muestra |
| `serviceConditionsUrl` | Enlace a las condiciones del servicio (PDF o página) |
| `messages.general`, `messages.formIntro` | Texto precargado del botón de WhatsApp y encabezado del mensaje del formulario |

### 2. Logotipo

El isotipo es `assets/favicon.svg`: se usa como favicon, en el header y en el pie. Reemplázalo por el logo real en SVG, o cambia el `<img>` de `.brand` en `index.html` (header y footer).

### 3. Colores y tipografía

Cada `css/styles.css` empieza con un bloque `:root` de variables:

- Ruta Cargo: `--rc-*`.
- Mudanza Pro: `--mp-*`.
- Carga Segura 360: `--cs-*`.

Cambia ahí los colores corporativos y verifica el contraste del botón principal (mínimo 4.5:1 con su texto). La fuente se cambia en el `<link>` de Google Fonts y en `--font*`.

### 4. Fotografías

Son fotos libres de Unsplash y Pexels (uso comercial permitido; créditos en `assets/images/CREDITOS.md` y en el pie de cada página). **Ninguna muestra a la empresa real.** Para cambiarlas:

1. Edita la entrada en `tools/fotos.json` (`fuente`, `id`, `ratio`, `foco`, `autor`, `alt`), o sustituye directamente los `.webp` conservando nombre y proporción.
2. Ejecuta `python3 tools/fotos.py todo`, o con `--solo carga-segura --slot hero` para una sola foto. Requiere Pillow.
3. Si cambias una descripción, actualiza el `alt` en `index.html`.
4. Si cambias el hero, vuelve a capturar la vista previa del índice (`assets/previews/`).

### 5. Servicios, preguntas frecuentes y textos

Están en `index.html`, como HTML semántico, para que los indexen los buscadores. Edita directamente las secciones `#servicios`, `#preguntas`, etc. Las opciones del `<select>` del formulario deben coincidir con los servicios reales.

En **Carga Segura 360**, la sección «Seguridad y cumplimiento» describe buenas prácticas *recomendadas*. Antes de publicar, deja solo las que la empresa realmente cumple. La nota amarilla que lo recuerda solo se ve en modo revisión.

### 6. Horarios, condiciones y datos legales

Van en `config.js` (`schedule`, `serviceConditionsUrl`, `legal`). Las respuestas sobre seguro y responsabilidad están redactadas de forma neutral («se informan por escrito en la cotización»). Si la empresa tiene una póliza real, ajústalas.

### Antes de publicar (lista corta)

- [ ] `config.js` completo y `modo: 'publicacion'`.
- [ ] `<title>`, meta description y `og:*` con el nombre real.
- [ ] `og:image` con URL absoluta (`https://dominio/...`): las redes sociales no leen rutas relativas.
- [ ] Fotos propias de la empresa y logo real.
- [ ] Servicios, cobertura y prácticas ajustados a lo que la empresa ofrece.
- [ ] Quitar el enlace «Ver las tres propuestas» y la mención de demostración del pie.

## Cómo funcionan los formularios

No hay backend: **ningún formulario envía datos a un servidor ni los guarda**.

1. Al enviar, se validan los campos obligatorios, el celular colombiano (10 dígitos que empiezan por 3, con o sin `+57`), que la fecha no sea pasada y la longitud mínima de la descripción.
2. Los errores se anuncian junto a cada campo (`aria-invalid` + `aria-describedby`) y en un resumen con `role="status"`, y el foco va al primer campo con error.
3. Si los datos son válidos:
   - **Con WhatsApp configurado:** se abre `https://wa.me/<número>?text=<mensaje>` con `encodeURIComponent()`. El usuario envía el mensaje desde WhatsApp. La página no dice que la cotización sea automática.
   - **Sin WhatsApp configurado:** se muestra el mensaje que se enviaría, con un botón para copiarlo, y un aviso de que no se envió nada.

## Animaciones (GSAP)

Cada página tiene un único momento orquestado en el hero:

- **Ruta Cargo:** el titular entra por líneas y la ruta se traza bajo la foto.
- **Mudanza Pro:** la foto se descubre y la etiqueta «se pega».
- **Carga Segura 360:** el mosaico se revela pieza por pieza.

Además hay pocas entradas al hacer scroll, con `once: true` y sin animaciones permanentes. En Carga Segura, el cambio de pestaña del protocolo responde a la acción del usuario.

Las animaciones son opcionales:

- Los estados iniciales los pone GSAP, no el CSS. Si GSAP no carga, todo queda visible.
- Con `prefers-reduced-motion: reduce` no se ejecuta ninguna animación.

## Desplegar

Sube la carpeta `mudanzas/` (o solo una landing) a cualquier hosting estático o tradicional: FTP/cPanel, Netlify, Vercel, GitHub Pages o Cloudflare Pages. No hay build ni dependencias de servidor.

## Verificación realizada

Hecha con Playwright + Google Chrome headless en esta máquina (scripts en el directorio temporal de la sesión, no incluidos en el proyecto):

- **Anchos 360, 390, 768, 1440 y 1920 px** en las cuatro páginas: sin desbordamiento horizontal, sin errores ni advertencias de consola y sin respuestas HTTP ≥ 400. En Mudanza Pro, las fotos que sobresalen están dentro de la galería con desplazamiento horizontal, como corresponde.
- **Revisión visual** de capturas de página completa a 390, 768 y 1440 px. Se corrigieron:
  - el desbordamiento de los gutters de Bootstrap en móvil;
  - la foto principal de Carga Segura, porque mostraba el logo de una empresa real de alquiler de camiones;
  - el mosaico del hero;
  - el orden de la galería en móvil;
  - las proporciones en tableta.
- **Pruebas funcionales en las tres landings:**
  - Enlaces y anclas: ningún enlace vacío, todas las anclas internas existen, un solo `h1` y todas las imágenes con `alt`.
  - Formulario vacío: marca los errores y enfoca el primero.
  - Validaciones: rechaza un celular inválido, una fecha pasada y una descripción corta.
  - Sin número configurado: muestra el mensaje preparado con los datos, incluida la fecha en formato dd/mm/aaaa.
  - Con número de prueba inyectado y modo `publicacion`:
    - todos los botones `data-wa` apuntan a `wa.me`;
    - el formulario abre WhatsApp con el texto bien codificado (probado con `&` y `#`);
    - desaparecen la barra de demo y los «Por configurar»;
    - el correo configurado aparece enlazado y el teléfono vacío se oculta.
  - Con el CDN de GSAP bloqueado y con movimiento reducido: títulos y botones visibles.
  - Menú móvil: se abre.
  - Pestañas del protocolo: responden a las flechas y a Fin.
  - Galería de Mudanza Pro: el botón siguiente desplaza.

**Lo que no se probó:**

- El envío real a un WhatsApp: solo se verificó la URL generada, que WhatsApp redirige a `api.whatsapp.com/send`.
- Lectores de pantalla reales.
- Safari y Firefox.
- La validación W3C formal del HTML.
