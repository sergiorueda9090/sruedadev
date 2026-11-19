# CTICOL — sitio corporativo (transporte de carga general, pesada y sobredimensionada)

Sitio multipágina estático: 15 páginas de contenido (inicio, nosotros, misión y visión, servicios + 6 fichas de
servicio, flota, proyectos, cobertura, rastrear envío, contacto) más privacidad, términos y 404. Versión corporativa ampliada del
one-page de `../cticol/`; usa los mismos datos de contacto confirmados.

**Las páginas `.html` se generan**: no se editan a mano. Se editan los datos en `datos/` (o las plantillas
de `tools/build.py`) y se ejecuta el generador. Así el header, el footer y el botón de WhatsApp están en un
solo lugar y son iguales en todas las páginas.

## Tecnologías

| Pieza | Versión | Uso |
|---|---|---|
| HTML5 + CSS3 + JavaScript vanilla (ES6, scripts clásicos con `defer`) | — | Todo el sitio; funciona también abriendo los archivos con `file://` |
| Bootstrap (solo CSS) | 5.3.3 | Rejilla y utilidades. El menú y los componentes son propios, sin el JS de Bootstrap |
| Bootstrap Icons | 1.11.3 | Iconografía |
| Swiper | 11.1.14 | Slider principal y carrusel de flota (solo en `index.html`) |
| GSAP + ScrollTrigger | 3.13.0 | Entrada del slider, zoom lento (Ken Burns) y apariciones al hacer scroll |
| Google Fonts | — | Sora (títulos) e Inter (texto) |

Todas las dependencias se cargan desde jsDelivr con versión fija y hash SRI (`integrity`), definidos en
`CDN` dentro de `tools/build.py`: si cambia una versión, actualice también su hash.
Sin internet el contenido se ve igual (sin animaciones, el slider muestra la primera foto fija).

## Ejecutar y generar

```bash
cd cticol2
python3 tools/build.py                      # genera los .html, config.js, sitemap.xml y robots.txt
python3 -m http.server 8080                 # abrir http://localhost:8080
python3 tools/build.py --modo publicacion   # prueba el modo publicación sin editar el JSON
```

Requiere Python 3.10+ y Pillow (`pip install pillow`).

## Estructura

```
cticol2/
├── index.html, nosotros.html, mision-vision.html, rastreo.html, servicios.html, flota.html, proyectos.html, cobertura.html, contacto.html
├── carga-general.html, mercancia-seca.html, carga-pesada.html, carga-sobredimensionada.html,
│   maquinaria-pesada.html, transporte-especializado.html        ← una página por servicio
├── privacidad.html, terminos.html, 404.html
├── sitemap.xml, robots.txt                                       ← generados
├── datos/
│   ├── sitio.json        ← empresa, contacto, WhatsApp, redes, GA4, textos institucionales, cobertura
│   ├── servicios.json    ← los 6 servicios (cada uno genera su página)
│   ├── flota.json        ← categorías y vehículos
│   ├── proyectos.json    ← galería
│   └── mapa.json         ← contorno de Colombia (generado por tools/mapa.py)
├── assets/
│   ├── css/styles.css (tokens y componentes), responsive.css, animations.css
│   ├── js/config.js (generado), main.js, slider.js, animations.js, forms.js, gallery.js, tracking.js
│   └── img/hero/, services/, fleet/, company/, logo/   ← WebP generados
├── img/                  ← fotos originales entregadas por el cliente (no se tocan)
└── tools/build.py, imagenes.py, mapa.py
```

## Modo revisión / publicación

`"modo"` en `datos/sitio.json`:

- `revision` (actual): aviso amarillo arriba, etiquetas «Por confirmar» / «Texto provisional» / «Pendiente»,
  notas sobre lo que falta, `noindex` y `robots.txt` bloqueando buscadores.
- `publicacion`: se omite todo lo que tenga `confirmado: false`, `aprobado: false` o `enFlota: false`, y los
  campos vacíos. Las secciones que quedan sin contenido desaparecen (p. ej. la flota muestra un aviso para
  escribir; Nosotros queda solo con «Quiénes somos» mientras la misión, la visión, etc. no estén aprobadas).

## Configurar datos de la empresa (`datos/sitio.json`)

### Datos entregados por el cliente (2026-11-18)

| Dato | Dónde está en `datos/` | Dónde se ve |
|---|---|---|
| Razón social actual: Compañía Transportadora e Inversiones de Colombia (sin tipo societario) | `sitio.json` → `marca.razonSocial` | Footer, © y JSON-LD (`legalName`) |
| Inicio en 2019 como Logística y Transportes TRANSFER; cambio de razón social en 2025; 7 años | `marca.fundacion`, `marca.razonAnterior`, `institucional.historia` (con `hitos`) | Barra superior, introducción del inicio, «Nuestra historia» con línea de tiempo en Nosotros. Los años se calculan con el año actual (`{anios}`) |
| Flota propia y tercerizada: turbos, sencillos, tractomulas | `flota.json` (`enFlota: true` en esos tres) | Flota, carrusel del inicio. Sin cantidades ni capacidades |
| GPS 24/7, pólizas de seguro de mercancía, conductores capacitados | `sitio.json` → `respaldo` | Inicio («Nuestra flota y respaldo»), Nosotros, Flota, Rastrear envío, «¿Por qué elegirnos?» |
| Clientes: empresas comerciales, industrias, distribuidores, personas naturales | `sitio.json` → `clientes` | Inicio («A quién atendemos», junto a los sectores) |

Ojo: la flota confirmada no incluye camas bajas, plataformas ni remolques modulares, pero el sitio (por el brief) ofrece
carga pesada, sobredimensionada y maquinaria amarilla. Confirmar si esos servicios se prestan con flota tercerizada.

### Rastrear envío

Botón amarillo en la barra superior (todas las páginas), en el menú móvil y en el footer. La plataforma de rastreo
está en desarrollo, así que `rastreo.url` está vacío y el botón lleva a `rastreo.html`: ahí el cliente escribe su
número de remesa/manifiesto y su nombre, y se abre WhatsApp de Despachos (317 300 4381) con la consulta escrita.
Cuando la plataforma esté lista, ponga su URL (`https://…`) en `rastreo.url` y ejecute `tools/build.py`: todos los
botones abrirán la plataforma directamente (`rastreo.html` queda con un botón hacia ella).

- **Teléfono del header**: `contacto.telefonoPrincipal` (`numero` con indicativo 57, solo dígitos; `mostrar` es el texto visible).
- **WhatsApp**: `contacto.whatsapp`. La línea con `"cotizaciones": true` recibe el botón flotante, los botones
  «Cotizar por WhatsApp» y el formulario. El mensaje inicial está en `whatsappMensaje`.
- **Correo, dirección, ciudad, horario**: vacíos se ocultan. Con `direccion` y `mapaUrl` (URL `https://` de
  inserción de Google Maps) aparece el mapa en Contacto.
- **Redes sociales**: `redes` → `facebook`, `instagram`, `linkedin`, `youtube`, `tiktok`, `twitter-x` (URL completa
  `https://…`). Los iconos salen en el footer («Síganos»), en Contacto y al final del menú móvil, junto con el de
  WhatsApp (línea de cotizaciones). Con URL son enlaces que abren en pestaña nueva; vacías, en modo revisión se ven
  atenuadas («Por configurar») y al publicar se omiten.
- **Razón social, NIT, dominio**: `marca`. Con `dominio` (p. ej. `https://www.ejemplo.com`, sin barra final) se
  generan canonical, `og:url`, `og:image`, el logo del JSON-LD y un `sitemap.xml` válido. **Sin dominio, el
  sitemap lleva `https://DOMINIO-POR-CONFIGURAR`**: configúrelo antes de publicar.
- **Misión y visión** tienen página propia (`mision-vision.html`, en el submenú de Nosotros y en el footer);
  Nosotros enlaza a ella. Si ninguna de las dos está aprobada, al publicar la página no se genera y desaparece
  del menú.
- **Mapa de Google (Contacto, sección «Dónde estamos»)**: hoy muestra una **ubicación de prueba**
  (`contacto.mapaPrueba`: Parque Santander, Bucaramanga) con un aviso de que no es la dirección de la empresa;
  solo aparece en modo revisión. Para la dirección real: llene `direccion`, `ciudad` y `mapaUrl` (en Google Maps:
  Compartir → Insertar un mapa → copiar solo la URL del `src`, o `https://maps.google.com/maps?q=<dirección>&z=16&output=embed`)
  y ponga `mapaPrueba.activo` en `false`. La política de privacidad ya menciona las cookies de Google Maps.
- **Textos institucionales**: `institucional.*`. Misión, visión, valores, compromiso y filosofía son
  **textos provisionales** escritos para la demo (`aprobado: false`); la historia está vacía porque no se
  inventa. Al aprobarlos, ponga `aprobado: true`.
- **Cobertura**: las 16 ciudades vienen del mapa que llegó con las fotos (`img/img16.jpeg`); no se sabe si
  son de CTICOL, por eso `confirmado: false`. `rutas` está vacío: no se dibujan rutas hasta tenerlas.
- **Google Analytics 4 / Search Console**: `analitica.ga4` (`G-XXXXXXX`) y `analitica.searchConsole` (código de
  la meta de verificación). Vacíos no se inserta nada.

Servicios (`datos/servicios.json`): cada elemento de `caracteristicas` o `soluciones` puede ser texto o
`{"texto": …, "confirmado": false}`. Las modalidades concretas que la empresa no ha confirmado (carga
consolidada, permisos, escoltas, remolques modulares, puertos…) están marcadas así.

Flota (`datos/flota.json`): `capacidad` y `ficha` (lista `"Dato: valor"`) solo se muestran si se llenan.
Hoy todos los vehículos tienen `enFlota: false`.

## Formulario de cotización

`contacto.html#cotizar` valida en el navegador (errores junto a cada campo, resumen con enlaces y foco en el
primer error) y **no simula envíos**:

- **WhatsApp (siempre, con `formWhatsapp: true`)**: al presionar «Solicitar cotización» se abre WhatsApp con
  la solicitud escrita (nombre, empresa, teléfono, correo, servicio, origen, destino, carga y mensaje) dirigida a
  la línea con `cotizaciones: true` (hoy Comercial 316 473 2031). Debajo del botón se avisa que esto ocurrirá.
  Un sitio estático **no puede enviar el mensaje solo**: el cliente presiona «Enviar» en WhatsApp. Para que llegue
  sin intervención haría falta un backend con la API de WhatsApp Business.
- **Servidor (`formEndpoint`, `https://…`)**: si se configura, además se hace un POST JSON y solo se confirma
  «Recibimos su solicitud» si responde 2xx; si falla, se dice y la copia por WhatsApp sigue disponible.
- Sin WhatsApp ni endpoint: dice que no se envió y ofrece copiar el resumen.

Los enlaces `contacto.html?servicio=<id>#cotizar` preseleccionan el servicio.

## Imágenes

`python3 tools/imagenes.py` convierte las fotos de `img/` en WebP de varios anchos (`assets/img/<carpeta>/<nombre>-<ancho>.webp`)
según el `MANIFIESTO`. Para cambiar una foto: ponga el original en `img/`, edite su entrada y ejecute el
script y luego `tools/build.py` (que lee los anchos disponibles para `srcset`, `width` y `height`).
`tapar` desenfoca zonas (en fracciones del original): se usó para ocultar nombres de otras transportadoras
visibles en tres fotos (`--ver` guarda las fotos tapadas en `tools/_revision/` para revisarlas).

Sobre las fotos entregadas (la del camión turbo, `img/unsplash-turbo-yFXmbinYr0Y.jpg`, es de Unsplash: crédito en `assets/img/CREDITOS.md`):
- **Son de referencia**, no de CTICOL; la galería lo dice explícitamente (`demostracion: true` en
  `proyectos.json`). Confirme los derechos de uso antes de publicar y reemplácelas por fotos propias.
- No se usaron `img7.jpeg` (marca de agua de otra empresa de logística) ni `img9.jpeg` (camión rotulado de
  otra transportadora); `img11.jpeg` se usa con los logotipos desenfocados.
- Siguen visibles marcas de fabricantes de los equipos (Caterpillar, John Deere, Scania, Kenworth).
- Varias fotos parecen generadas con IA (`img2/img3`, `img4`, `k-lAr…`); a la de `k-lAr…` se le recortó la marca de agua.
- El hero usa fotos de 1200 a 2048 px: a 1920 px la de carga sobredimensionada (1200 px) se ve algo suave; conviene una foto propia de 2000 px o más.

El mapa de Colombia sale de Natural Earth (dominio público) con `tools/mapa.py` (instrucciones en el script).

## Publicar

1. Completar en `datos/sitio.json`: `dominio`, razón social, NIT, dirección, horario, redes; aprobar o
   reemplazar los textos institucionales; confirmar servicios, flota y cobertura.
2. Poner `"modo": "publicacion"` y ejecutar `python3 tools/build.py`.
3. Subir la carpeta a cualquier hosting estático (sin `datos/`, `tools/` ni `img/` si no se quiere exponer los
   originales). Configurar `404.html` como página de error.
4. Dar de alta el sitio en Search Console y enviar `sitemap.xml`.
5. Al cambiar CSS o JS, subir `VERSION` en `tools/build.py` para invalidar la caché.

## Verificación hecha

Playwright + Chrome headless en 1920, 1440, 1024, 768, 390 y 360 px, en las 18 páginas, en ambos modos:
sin errores ni advertencias de consola, sin respuestas 4xx/5xx, sin desbordamiento horizontal y sin
elementos que queden ocultos tras el scroll. Probados también: autoplay del slider (cambia a los 6 s),
filtros y visor de la galería (teclado y Escape con retorno del foco), validación del formulario con foco en
el primer error, preselección del servicio y apertura de WhatsApp, y el menú móvil con submenú.
