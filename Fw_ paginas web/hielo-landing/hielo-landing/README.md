# Fábrica de hielo — landing page

Landing de una sola página para una fábrica de hielo en Colombia que vende a negocios: restaurantes, bares, hoteles, eventos, tiendas, distribuidores, pescaderías y empresas. Está hecha con HTML5, CSS3, Bootstrap 5.3.3, Bootstrap Icons 1.11.3 y JavaScript vanilla, con GSAP 3.13.0 y ScrollTrigger para las animaciones. No tiene backend ni proceso de compilación.

**Estado: prototipo en revisión.** El encargo no incluía datos reales de la empresa. Nombre, contacto, productos confirmados, presentaciones, cobertura, registros y cifras están vacíos en `js/config.js`. En modo revisión la página los marca «por confirmar»; en modo publicación los oculta. No se inventó ningún dato.

> Este proyecto es distinto de `corporativos/hielo/`, que es un sitio multipágina de un encargo anterior. Comparten algunas fotos de referencia, pero no código.

## Ejecutar

```bash
cd corporativos/hielo-landing && python3 -m http.server 8080   # http://localhost:8080
```

También funciona abriendo `index.html` directamente (`file://`). Necesita internet para Bootstrap, los iconos, GSAP y la fuente Manrope. Los CDN usan versión fija y hash SRI; si cambias una versión, actualiza también el `integrity`.

## Estructura

```text
hielo-landing/
├── index.html            estructura semántica de las 16 secciones
├── privacidad.html       BORRADOR de política de datos (requiere revisión jurídica)
├── css/
│   ├── styles.css        tokens, identidad visual y componentes
│   └── responsive.css    ajustes por ancho (lg 992, md 768, sm 576)
├── js/
│   ├── config.js         ← DATOS DE LA EMPRESA (único archivo que se edita)
│   ├── whatsapp.js       enlaces wa.me seguros (solo con número válido)
│   ├── main.js           pinta los datos, navegación, pestañas de sectores, SEO
│   ├── form.js           validación y preparación de la cotización
│   ├── gallery.js        visor de fotos accesible (<dialog>)
│   └── animations.js     GSAP: entrada del hero, línea del proceso, contadores
└── assets/
    ├── img/              fotos WebP (grande + «-sm»), og-hielo.jpg, credits.json
    └── icons/            favicon.svg y logotipo provisional (claro y oscuro)
```

Los scripts son clásicos con `defer`, y su orden en `index.html` importa: `config → whatsapp → main → form → gallery → animations`.

## Cómo cargar los datos reales — `js/config.js`

Regla general: **un dato que no esté confirmado se deja en `null` o en una lista vacía**. Nunca se pone un ejemplo.

| Clave | Qué controla |
|---|---|
| `modo` | `'revision'` muestra el aviso superior y los marcadores; `'publicacion'` oculta todo lo pendiente |
| `empresa.nombreComercial` | Logotipo tipográfico, `<title>`, pie y JSON-LD. Mientras sea `null`, en revisión aparece `[Nombre de la empresa]` |
| `empresa.razonSocial`, `nit`, `descripcion`, `ciudad`, `departamento`, `direccion` | Ficha de «Nosotros», pie y datos estructurados |
| `empresa.anioFundacion` | Activa la razón «Experiencia en el sector» |
| `empresa.logo` | Ruta `assets/…(svg/png/webp)` o URL https. Sustituye el logotipo provisional en la cabecera y el pie |
| `empresa.urlCanonica` | URL https definitiva: añade `canonical`, `og:url` y la URL absoluta de `og:image` |
| `contacto.telefono` / `telefonoHref` | Texto visible y valor para el enlace `tel:` (`+57…`) |
| `contacto.whatsapp` | Solo dígitos con indicativo (`57` + 10 dígitos). Activa todos los botones de WhatsApp |
| `contacto.correo`, `contacto.horario` | Barra superior y pie |
| `redes` | `{ red, url, icono }`, con URL https e icono de Bootstrap Icons (`instagram`, `facebook`…) |
| `atributosHero` | Línea de confianza del hero (máximo 3). **Confirmar que son ciertos** |
| `productos[]` | `disponible: true` (se publica), `null` (propuesto, solo en revisión) o `false` (no se fabrica). `presentaciones: ['Bolsa de 2 kg', …]` |
| `textoPrecio` | Etiqueta de precio de las fichas (por defecto «Solicitar precio mayorista»). No se publican precios |
| `usosPorSector` | Guía orientativa «formato habitual por tipo de negocio» (matriz de la sección de clientes) |
| `operacion.*` | Pedidos recurrentes, anticipación, pedido mínimo y condiciones para alto volumen |
| `cobertura.ciudadBase`, `municipios`, `modalidad`, `coordenadas` | Sección de cobertura, esquema de anillos y enlace a OpenStreetMap |
| `calidad.procesoConfirmado` | `true` retira la nota «flujo de referencia» del proceso |
| `calidad.registroSanitario`, `certificaciones` | Solo textos copiados del documento vigente |
| `indicadores[]` | `valor` numérico **documentado**. Si ninguno tiene valor, la sección muestra «Así organizamos tu suministro» en lugar de cifras |
| `clientes.logos`, `clientes.testimonios` | Solo con autorización escrita. Mientras estén vacíos, se muestra la matriz «Soluciones para negocios de distintos sectores» |
| `faq[]` | `respuesta` fija o `auto` (`productos`, `presentaciones`, `cobertura`, `anticipacion`), que se arma desde los datos. Sin respuesta: pendiente en revisión, oculta en publicación |
| `legal.politicaPrivacidad` | Enlace a la política aprobada |
| `formEndpoint` | URL https de un servicio real de recepción de formularios (ver abajo) |
| `creditosFotos` | Créditos que se listan en el pie |

### Textos que también deben validarse

Los textos de beneficios, «Por qué elegirnos», el proceso de 6 pasos y los usos por sector se redactaron como **propuesta comercial razonable**, no como hechos verificados de una planta concreta. Antes de publicar, la empresa debe confirmar que describen su operación (por ejemplo, «agua tratada» o «empaque cerrado») y, si no, se editan en `index.html`.

## Formulario de cotización

HTML, CSS y JavaScript no pueden recibir ni guardar un formulario por sí solos. Al pulsar «Preparar solicitud», el formulario valida los campos y luego se comporta así:

1. **Con `formEndpoint`** (https): envía un `POST` JSON con `formulario`, `pagina`, `enviado`, `acepta_datos` y los campos `nombre`, `empresa`, `telefono`, `correo`, `ciudad`, `tipo`, `cantidad`, `frecuencia` y `mensaje`. Solo muestra «Solicitud enviada» si el servidor responde 2xx. Si hay error o pasan 15 s sin respuesta, lo informa y conserva los datos.
2. **Sin endpoint pero con WhatsApp:** muestra el resumen y un botón que abre WhatsApp con ese mensaje. Nada se envía hasta que el usuario lo confirma en WhatsApp.
3. **Sin ninguno:** dice explícitamente «Tu solicitud no se ha enviado» y ofrece copiar el resumen.

La casilla de tratamiento de datos es obligatoria y no viene marcada. El teléfono acepta celular colombiano (empieza por 3) o fijo (empieza por 60), de 10 dígitos, con o sin `+57`.

El servidor que reciba el formulario debe volver a validar los datos, limitar los envíos y permitir CORS solo desde el dominio del sitio. Ninguna clave de API va en el navegador.

## Dirección de arte

- **Concepto:** «Pureza que enfría. Confianza que abastece.» Corporativo industrial, luminoso y con mucho blanco. Se usa la paleta del brief: `#123B5D` para titulares, la banda «Por qué elegirnos» y el pie; `#1769AA` para acciones; `#69D9F2` solo como acento sobre fondos oscuros o como relleno, porque sobre blanco no tiene contraste suficiente; `#F7FBFD` y `#E9F0F4` como fondos; `#263746` para texto; `#2E8B65` para estados válidos. Para botones y texto verde se usa `#226B4D`, que sí cumple AA con blanco.
- **Tipografía:** solo Manrope (400–800). Titulares en 800 con tracking negativo y texto en 400/500.
- **Momento memorable:** al cargar, la foto del hero aparece **empañada como un vidrio frío y se aclara** mientras entran el titular y los botones. Encima flota una lámina esmerilada con la línea de confianza, y detrás de la foto hay dos planos translúcidos desplazados, como un cubo visto a través de otro. El logotipo provisional repite ese motivo de dos caras desplazadas.
- **Composición:** cada sección tiene una forma propia para no repetir el mismo molde de tarjeta:
  - Beneficios: franja con divisores.
  - Productos: ficha destacada horizontal y el resto en 2×2.
  - «Por qué elegirnos»: lista sobre fondo oscuro.
  - Proceso: línea de 6 pasos, horizontal en escritorio y vertical en móvil.
  - Sectores: pestañas con imagen grande.
  - Cobertura: esquema de anillos.
  - Galería: retícula editorial con visor.
  - Clientes: matriz de sectores por tipo de hielo.
- **Movimiento:** la entrada del hero es la única animación orquestada. Además, la línea del proceso se llena una vez, los títulos y las fichas aparecen al entrar en pantalla, la foto del hero tiene una deriva mínima con el scroll (solo en escritorio) y las cifras reales cuentan. No hay animaciones infinitas. Con `prefers-reduced-motion` no hay movimiento. Si GSAP no carga, todo se ve igual, sin animar.

## Imágenes

Las 21 fotos son **de referencia temporal**, tomadas de Wikimedia Commons con licencias CC BY / CC BY-SA. Cada una lleva la etiqueta «Foto de referencia» y ninguna se presenta como de la empresa. Autor, licencia, fuente y uso de cada una están en `assets/img/credits.json` y se listan en el pie, en «Créditos de fotografías». Se recortaron y se convirtieron a WebP; las de CC BY-SA conservan esa licencia. Se descartó una foto de trituradora en la que se leía la marca de otra fábrica de hielo.

Para reemplazarlas por fotos propias, conserva los nombres (`nombre.webp` grande y `nombre-sm.webp` pequeña) y la proporción: 4:5 en hero, «Por qué elegirnos» y CTA; 4:3 en el resto. Si cambias las dimensiones, actualiza `width`/`height` en el HTML o en `productos[]`. Cuando una foto sea de la empresa, quita su `<span class="ref-tag">`.

## SEO

`<title>`, meta description, Open Graph (con `og-hielo.jpg` de 1200×630), favicon SVG, un único `h1` y encabezados en orden. Con datos confirmados, `main.js` añade `canonical`, `og:url` y un JSON-LD `LocalBusiness` que incluye solo los campos existentes, sin valoraciones, precios ni certificaciones. Se genera desde JavaScript; Google lo lee, pero si se necesita en el HTML estático, se puede copiar desde el inspector.

## Antes de publicar

1. Completar `js/config.js` con datos verificados y poner `modo: 'publicacion'`.
2. Marcar `disponible: true` solo en los productos que se fabrican y cargar sus presentaciones.
3. Validar los textos propuestos (ver arriba) y el proceso real; poner `calidad.procesoConfirmado: true`.
4. Reemplazar las fotos de referencia por fotos propias y autorizadas.
5. Aprobar la política de privacidad, reemplazar el borrador y ajustar `legal.politicaPrivacidad`.
6. Configurar `formEndpoint` o, como mínimo, `contacto.whatsapp`.
7. Configurar `empresa.urlCanonica` y **quitar** `<meta name="robots" content="noindex, nofollow">` de `index.html`.
8. Al cambiar CSS o JS, subir `?v=N` en `index.html` y `privacidad.html`.

## Pruebas realizadas (16 de octubre de 2026, Chrome headless con Playwright)

- **Responsive:** 360, 390, 768, 1366 y 1920 px. Sin desbordamiento horizontal, sin errores ni avisos de consola y sin respuestas 4xx/5xx. Se revisaron visualmente capturas de página completa en 1366 y 390 px y vistas del hero durante y después de la animación.
- **Funcionales (67 comprobaciones), en modo revisión, con WhatsApp simulado, con endpoint simulado (200 y 500) y en modo publicación con datos parciales:**
  - Marcadores visibles en revisión y ausentes en publicación.
  - Ningún enlace `wa.me` sin número; mensaje de WhatsApp con el producto o con los datos del formulario.
  - Validación: foco en el primer error, `aria-invalid`, teléfono y correo inválidos, casilla no premarcada.
  - El formulario nunca dice «enviada» sin envío real.
  - Visor de galería: Enter, flechas, Escape y retorno del foco.
  - Pestañas de sectores con flechas, Home y End; menú móvil (cierre al elegir sección y con Escape).
  - Cifras solo con valor real; JSON-LD sin valoraciones; canonical configurable.
  - Movimiento reducido, GSAP bloqueado (contenido visible) y `file://`.

**No se probó:** Safari ni Firefox, lectores de pantalla reales ni Lighthouse.
