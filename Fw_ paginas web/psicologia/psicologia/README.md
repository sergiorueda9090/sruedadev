# Demos sector salud — psicorehabilitación, neurodesarrollo y rehabilitación

Tres landing pages demostrativas e independientes de SRuedaDev para instituciones de Santander, más un catálogo para presentarlas. **Las marcas son ficticias**, las fotos son ilustrativas (Unsplash) y ningún dato de contacto es real.

| Ruta | Marca | Concepto | Tipografía | Movimiento |
|---|---|---|---|---|
| `index.html` | Catálogo SRuedaDev | Presentación neutra de las tres demos | Hanken Grotesk | Ninguno |
| `neuroavanzar/` | Neuroavanzar (neurodesarrollo infantil, Bucaramanga) | Formas orgánicas y una «línea de trayecto» que conecta hero y proceso; especialidades como índice editorial con visor fijo | DM Serif Display + Manrope | Orgánico, lento |
| `aprehender/` | Aprehender Centro Terapéutico (Floridablanca) | Piezas de juguete didáctico de madera: fotos recortadas como arcoíris, disco, cuarto de círculo; proceso en pestañas; galería con visor | Fraunces (SOFT/WONK) + Plus Jakarta Sans | Expresivo, con rebote |
| `integra-neurorehabilitacion/` | Integra Neurorehabilitación (Santander) | Retícula arquitectónica, pies «Fig.», servicios como ficha técnica, diagrama SVG y mapa esquemático | Source Serif 4 + Inter | Preciso: recortes y trazos |

## Ejecutar

```bash
cd psicologia && python3 -m http.server 8080   # http://localhost:8080
```

Sin build. Bootstrap 5.3.3 (solo CSS: retícula de formularios y utilidades), Bootstrap Icons 1.11.3, GSAP 3.13.0 + ScrollTrigger y Google Fonts vienen de CDN con versión fija. Las fotos son WebP locales.

## Estructura

```
assets/css/global.css      base común: foco, formularios, aviso de privacidad, visor
assets/css/<marca>.css     identidad de cada demo (tokens en :root)
assets/css/catalogo.css    portada y créditos
assets/js/config.js        window.PSI_CONFIG: modo y datos de contacto de las tres marcas
assets/js/global.js        window.PSI: menú, WhatsApp, datos, formularios, visor
assets/js/<marca>.js       comportamiento y animaciones propias
assets/images/<marca>/     fotos WebP (generadas con tools/fotos.py)
assets/images/catalogo/    capturas del catálogo y og:image (tools/capturas.*)
creditos.html              generado por tools/fotos.py
```

Orden de scripts en cada demo (todos `defer`, scripts clásicos): `gsap → ScrollTrigger → config.js → global.js → <marca>.js`.

## Configurar datos reales

Todo se edita en `assets/js/config.js`:

- `modo: 'revision'` muestra el aviso superior de demo y marca «Por configurar»; `'publicacion'` oculta avisos (`.solo-revision`) y los datos vacíos (`[data-dato-wrap]`).
- `whatsapp`: número internacional sin `+` (p. ej. `573001234567`). Vacío → los botones de WhatsApp llevan al formulario y lo dicen («WhatsApp por configurar»). Con número se construye `https://wa.me/<número>?text=<mensajeWhatsapp>`.
- `formEndpoint`: URL `https://` que recibe un POST (`FormData`). Vacío → el formulario valida pero **no envía nada** y lo explica; si hay WhatsApp o correo ofrece enviar la solicitud por ese canal. Nunca se simula un envío ni se usa `localStorage`.
- `correo`, `telefono`, `direccion`, `horarios` (lista de textos).

Los formularios piden solo nombre, medio de contacto, servicio (y municipio en Integra); el mensaje es opcional y advierte que no se incluyan datos clínicos.

## Contenido que debe adaptarse

- Servicios: son demostrativos; ajustar a la oferta y habilitaciones reales de cada institución.
- El aviso de privacidad es un texto de demo que menciona la Ley 1581 de 2012; la institución debe publicar su política real.
- No hay testimonios, cifras, certificaciones ni Schema.org: no añadirlos sin datos verificados.
- `canonical` apunta a `https://sruedadev.com/demos/psicologia/...` y `og:image` es relativa: cambiarlas al publicar en el dominio definitivo.

## Fotos

`tools/fotos.json` es el manifiesto (marca, slot, id de Unsplash, autor, recorte, anchos, `alt`). Tras editarlo:

```bash
python3 tools/fotos.py                      # todas (usa tools/_cache para no volver a descargar)
python3 tools/fotos.py --marca integra --slot hero
```

Genera `assets/images/<marca>/<slot>-<ancho>.webp` y regenera `creditos.html` desde `tools/creditos.plantilla.html`. Al cambiar el recorte, revisa los `width`/`height` del HTML (deben conservar la proporción).

Capturas del catálogo (requieren el servidor local y Playwright para Node):

```bash
NODE_PATH=/ruta/a/node_modules node tools/capturas.js && python3 tools/capturas.py
```

## Animaciones y accesibilidad

- Un script en el `<head>` oculta `[data-hero]` solo si se va a animar; si GSAP no carga o hay `prefers-reduced-motion`, `global.js` lo muestra de inmediato (y un temporizador de 3 s lo garantiza). Las demás animaciones usan `gsap.from` con `once`, así que el contenido es visible sin JS.
- Parallax solo en pantallas ≥ 768 px (`gsap.matchMedia`).
- Pestañas de Aprehender con patrón ARIA (flechas, Inicio/Fin); sin JS se ocultan y se muestran las cuatro etapas.
- Visor de imágenes con `<dialog>` (Esc, flechas, devuelve el foco). Carril de Integra con botones y desplazamiento por teclado.
- El diagrama SVG de Integra es decorativo (`aria-hidden`): su contenido está en la lista ordenada que lo acompaña. Hay versión horizontal (≥ 992 px) y vertical.

## Verificación realizada

Con Playwright + Chrome headless (2026-10-29), a 360, 390, 768, 1366 y 1920 px: sin errores de consola, sin 404, sin desbordamiento horizontal, un solo `h1` por página, enlaces internos y anclas válidos, imágenes visibles cargadas, menú móvil (abre, enfoca, cierra al navegar), validación de formularios (errores accesibles, foco en el primero, mensaje de demo sin envío, `localStorage` vacío), preselección de servicio, aviso de privacidad, pestañas, visor, acordeón y carril. También con el CDN de GSAP bloqueado y con movimiento reducido: el contenido se ve completo. No se midió Lighthouse.
