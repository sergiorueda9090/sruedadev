# Easypark de Colombia S.A.S. — prototipo web

Sitio corporativo multipágina para Easypark de Colombia S.A.S. (Bucaramanga, Santander), en el sector de servicios y tecnología, orientado a clientes empresariales. HTML5, CSS3, Bootstrap 5.3.3, JavaScript sin frameworks, Bootstrap Icons 1.11.3, AOS 2.3.4 y Overpass (Google Fonts).

> **Estado: prototipo para revisión.** No se encontró información pública verificable de la empresa. **La actividad (servicios para parqueaderos) se dedujo del nombre** y está marcada como «Por confirmar» en todo el sitio. Ningún dato operativo, de contacto ni legal se ha inventado.

## Ejecutar en local

```bash
cd webs/corporativos/easypark
python3 -m http.server 8000
# abrir http://localhost:8000
```

Necesita conexión a internet: Bootstrap, AOS, los iconos y la fuente se cargan desde CDN con versión fija y hash SRI.

## Estructura

```
easypark/
├── index.html          Inicio: hero con plano animado, servicios, proceso, sectores, portafolio, CTA
├── servicios.html      Detalle de cada servicio (#operacion, #acceso, #pagos, #soporte)
├── proyectos.html      Plantilla de ficha de proyecto y material necesario
├── nosotros.html       Presentación, datos de la empresa, «por qué elegirnos» (editable) y proceso
├── contacto.html       Formulario de propuesta (contacto.html?servicio=<id> preselecciona el servicio)
├── privacidad.html     Borrador de estructura de la política de datos (no es la política oficial)
├── 404.html
├── css/styles.css      Tokens (colores, tipografía, espaciado) en :root y todos los componentes
├── js/config.js        ← DATOS DE LA EMPRESA (único archivo a editar)
├── js/main.js          Datos en la página, header, menú, animación del plano, formulario, AOS
├── assets/images/      Fotografías provisionales en WebP + credits.json
├── assets/logo/        logo-provisional.svg (reemplazar por el oficial)
└── assets/icons/       favicon.svg (provisional)
```

## Dirección creativa

- **Concepto:** el lenguaje de la señalización de parqueaderos.
- **Elemento distintivo:** un **plano de parqueadero visto desde arriba**. Al cargar la página, un vehículo llega, la talanquera sube, el vehículo ocupa el cupo B5 y el tablero «Cupos libres» baja de 5 a 4. Es el único movimiento automático del sitio. El HTML ya trae el estado final, así que sin JavaScript o con movimiento reducido se ve quieto. Está rotulado como ilustración y no representa un producto de la empresa.
- **Paleta:** azul señal `#1446C8`, asfalto `#24282D`, concreto `#E7EAEE`, fondo `#F5F7F9`, tinta `#14181C` y amarillo de demarcación `#F4C430`, este último solo sobre asfalto o como trazo.
- **Tipografía:** Overpass, basada en la Highway Gothic de la señalización vial, en todo el sitio. Cifras tabulares en el tablero.
- **Composición:**
  - Servicios presentados como el directorio de un edificio.
  - Proceso con números pintados como cupos sobre asfalto (es una secuencia real).
  - Sectores sobre una foto aérea.
  - Ficha de proyecto con forma de tiquete de parqueo.

## Contenido provisional y modos

`js/config.js` centraliza el nombre, el NIT, la ciudad, el contacto, el WhatsApp con su mensaje inicial, las redes, la política de datos y el destino del formulario. **Un valor en `null` no se muestra.**

| `modo` | Efecto |
|---|---|
| `'revision'` (actual) | Muestra el aviso de prototipo y las etiquetas **Por confirmar**. |
| `'publicacion'` | Oculta todo elemento con `data-status="pendiente"` y muestra las alternativas `data-only="publicacion"`. |

**Teléfono recibido sin verificar (302 271 9337):** está en `porVerificar.telefono`. Solo se ve en modo revisión, en el footer y en la página de contacto, con la etiqueta «Sin verificar». Nunca se convierte en enlace `tel:` y se oculta en modo publicación. Cuando la empresa lo confirme, cópialo a `contacto.telefono` y `contacto.telefonoHref` (y a `contacto.whatsapp` si ese número tiene WhatsApp), y bórralo de `porVerificar`.

Al confirmar un contenido, quita su `data-status="pendiente"` y su `.pending-tag` en el HTML. **No cambies a `'publicacion'` antes de confirmar los servicios**: hoy casi todo el contenido es provisional. Al modificar CSS o JS, sube el `?v=1` de los enlaces en todos los HTML. Header y footer están escritos en cada HTML: un cambio en ellos va en las 7 páginas.

## Formulario

Valida en el navegador: errores accesibles, foco en el primer error, honeypot contra bots y bloqueo del doble envío.

- **Sin `formEndpoint`** (estado actual): no envía nada y lo dice. Si hay WhatsApp o correo configurados, ofrece enviar el mismo resumen por esos canales.
- **Con `formEndpoint`**: hace un POST JSON con un tiempo de espera de 12 s. El servidor debe validar de nuevo todos los campos.

## Datos que debe confirmar la empresa

**Lo más importante: la actividad real.** ¿Presta servicios para parqueaderos? ¿Cuáles: operación, control de acceso, pagos, soporte u otros? Si la actividad es otra, hay que reescribir el hero, los servicios, los sectores, el plano del hero y las fotos.

**Identidad:** logotipo oficial (SVG), favicon, colores corporativos (si existen) y autorización de uso.
**Aviso de marca:** «EasyPark» también es el nombre de una aplicación internacional de pago de estacionamiento. Conviene confirmar si la empresa tiene relación con ella o si su marca está registrada en Colombia, para evitar confusiones. El sitio no usa logotipos ni colores de terceros.

**Contacto:**
- Verificar el teléfono 302 271 9337 y confirmar si tiene WhatsApp.
- Correo, dirección de la sede, horario y redes oficiales.

**Empresa:** NIT, año de constitución, cobertura geográfica, equipo y forma de atención, y tecnología o proveedores que utiliza (solo si se pueden nombrar).

**Contenido:**
- Público y sectores que atiende.
- Proceso de trabajo real.
- Texto institucional.
- Diferenciadores con respaldo para la sección «Por qué elegirnos».

**Proyectos:** autorización de cada cliente, fotos propias sin placas ni personas identificables, número de cupos y accesos, alcance y resultado medido si existe.

**Legal:** política de tratamiento de datos aprobada (Ley 1581 de 2012), aprobación del contenido y dominio.

## Imágenes provisionales que deben sustituirse

Todas vienen de Wikimedia Commons, están recortadas y convertidas a WebP y llevan la etiqueta «Imagen ilustrativa». Los créditos están en el footer («Créditos fotográficos») y en `assets/images/credits.json`. Se descartaron imágenes con marcas de fabricantes visibles.

| Archivo | Uso | Autor | Licencia |
|---|---|---|---|
| `lote-aereo-*` | Sectores (inicio) | Gabriel Picard | CC BY-SA 4.0 |
| `talanquera-acceso-*` | Ficha de proyecto, servicio de control de acceso | Globetrotter19 | CC BY-SA 4.0 |
| `sotano-demarcado-*` | Servicio de operación | Tadeusz Hare | CC BY-SA 4.0 |
| `sensores-ocupacion-*` | Servicio de pagos | Tim Sheerman-Chase | CC BY 2.0 |
| `camara-placas-*` | Servicio de soporte, Nosotros | Mbrickn | CC BY 4.0 |

Lo ideal es reemplazarlas por fotos propias de parqueaderos atendidos, equipos y equipo humano, con autorización.

## Verificación realizada

Con Chrome headless (Playwright) a 360, 390, 768, 1366 y 1920 px, en las 7 páginas:
- Sin desbordamiento horizontal, sin errores ni avisos en consola, sin recursos 404 y con todas las imágenes cargadas.
- Animación del plano: revisada fotograma a fotograma. La talanquera sube, el vehículo entra y se estaciona, y el tablero baja de 5 a 4.
- Menú móvil: abre y cierra.
- Formulario:
  - Enviado vacío, marca 8 errores y pone el foco en el primero.
  - Valida el formato del correo.
  - `?servicio=acceso` preselecciona el servicio.
  - Enviado válido sin destino, muestra un aviso honesto de que no se envió nada.
- Modo publicación con WhatsApp y teléfono simulados: oculta todo lo pendiente, aparecen los botones de WhatsApp y llamada, y el formulario ofrece enviar por WhatsApp con el resumen prellenado.
- Teléfono sin verificar: se ve solo en revisión, sin enlace, y desaparece en publicación.

**No probado:** lectores de pantalla reales, Safari/iOS y un endpoint de formulario real. El rendimiento (Lighthouse) no se ha medido.

## Limitaciones conocidas

- Depende de las CDN. Sin el CSS de Bootstrap, el menú móvil se muestra desplegado.
- `og:image` usa una ruta relativa y no hay `canonical`, porque no hay dominio definitivo.

## Antes de publicar

1. Confirmar la actividad y los servicios, y completar `config.js`.
2. Sustituir textos, logotipo e imágenes provisionales.
3. Conectar el formulario (`formEndpoint`) a un correo o CRM con validación en servidor.
4. Reemplazar `privacidad.html` por la política aprobada o enlazarla en `legal.privacidad`.
5. Cambiar `modo` a `'publicacion'` y revisar cada página.
6. Retirar `<meta name="robots" content="noindex, nofollow">` de todas las páginas.
7. Añadir `canonical`, `og:url` y `og:image` con URL absoluta, más `sitemap.xml` y `robots.txt`.
8. Configurar `404.html` como página de error, HTTPS y cabeceras de seguridad (CSP, HSTS).
9. Opcional: datos estructurados `LocalBusiness`, solo con datos confirmados.
