# Solar Ingeniería Diseño y Construcciones — prototipo web

Sitio corporativo multipágina para una empresa de energía solar, ingeniería y proyectos en Santander, Colombia. HTML5, CSS3, Bootstrap 5.3.3, JavaScript sin frameworks, Bootstrap Icons 1.11.3, AOS 2.3.4 y Manrope (Google Fonts).

> **Estado: prototipo para revisión.** No se encontró información pública verificable de la empresa, así que **ningún dato operativo, de contacto ni legal se ha inventado**: todo lo no confirmado está vacío o marcado como «Por confirmar».

## Ejecutar en local

```bash
cd webs/solar
python3 -m http.server 8000
# abrir http://localhost:8000
```

Necesita conexión a internet: Bootstrap, AOS, los iconos y la fuente se cargan desde CDN con versión fija y hash SRI. Si AOS no carga, el contenido se ve igual (solo se pierden las entradas animadas).

## Estructura

```
solar/
├── index.html          Inicio: hero con carta solar, servicios, proceso, sectores, portafolio, CTA
├── servicios.html      Detalle y alcance de cada servicio (anclas #diseno, #ingenieria, #construccion, #mantenimiento)
├── proyectos.html      Plantilla de ficha de proyecto y lista del material necesario
├── nosotros.html       Presentación, datos de la empresa y proceso
├── contacto.html       Formulario de cotización (contacto.html?servicio=<id> preselecciona el servicio)
├── privacidad.html     Borrador de estructura de la política de datos (no es la política oficial)
├── 404.html
├── css/styles.css      Tokens (colores, tipografía, espaciado) en :root y todos los componentes
├── js/config.js        ← DATOS DE LA EMPRESA (único archivo a editar)
├── js/main.js          Datos en la página, header, menú, carta solar, formulario, AOS
├── assets/images/      Fotografías provisionales en WebP + credits.json
├── assets/logo/        logo-provisional.svg (reemplazar por el oficial)
└── assets/icons/       favicon.svg (provisional)
```

Header y footer están escritos en cada HTML, así que la navegación funciona sin JavaScript.

## Dirección creativa

- **Concepto:** «energía solar con ingeniería detrás». El elemento distintivo es una **carta solar interactiva**: el recorrido real del sol calculado para la latitud de Bucaramanga (7,1° N), con la fecha de hoy, los solsticios y el equinoccio. Muestra la elevación, el azimut y la duración del día. Es el único movimiento automático de la página: al cargar, el sol recorre su arco hasta la hora actual. Comunica capacidad técnica sin afirmar nada sobre la empresa.
- **Paleta:** petróleo `#0F3A3E`, pino `#1F5F55`, blanco cálido `#FBFAF7`, arena `#EDE9E0`, grafito `#1C2828` y amarillo solar `#F2B33D`, usado solo en el sol del diagrama, el subrayado del menú y el botón de la banda final.
- **Tipografía:** Manrope en todo el sitio, con titulares en 800 e interlineado ajustado y cifras tabulares en las lecturas de la carta solar.
- **Composición:** hero asimétrico 5/7 con la foto a sangre a la derecha. Servicios en lista editorial con título fijo, no en tarjetas. Proceso numerado (es una secuencia real) y sectores en rejilla escalonada.

## Cómo se gestiona el contenido provisional

`js/config.js` centraliza el nombre, la razón social, el NIT, el contacto, el WhatsApp con su mensaje inicial, las redes, la URL de la política de datos, el destino del formulario y la latitud de la carta solar. **Un valor en `null` no se muestra.** Los botones de WhatsApp y de llamada solo aparecen cuando el número existe.

| `modo` | Efecto |
|---|---|
| `'revision'` (actual) | Muestra el aviso de prototipo y las etiquetas **Por confirmar**. |
| `'publicacion'` | Oculta todo elemento con `data-status="pendiente"` y las etiquetas, y muestra las alternativas `data-only="publicacion"`. |

Al confirmar un contenido, quita su `data-status="pendiente"` y su `.pending-tag` en el HTML. **No cambies a `'publicacion'` antes de confirmar los servicios**: hoy casi todo el contenido es provisional y la portada quedaría reducida al hero, el proceso y la banda de contacto.

Los colores se cambian en el bloque `:root` de `css/styles.css`. Al modificar CSS o JS, sube el `?v=1` de los enlaces en todos los HTML.

## Formulario

Valida en el navegador: errores accesibles, foco en el primer error, honeypot contra bots y bloqueo del doble envío.

- **Sin `formEndpoint`** (estado actual): **no envía nada** y lo dice. Si hay WhatsApp o correo configurados, ofrece enviar el mismo resumen por esos canales.
- **Con `formEndpoint`**: hace un POST JSON con un tiempo de espera de 12 s y muestra éxito o error según la respuesta. El servidor debe validar de nuevo todos los campos.

## Datos que debe confirmar la empresa

**Identidad:** logotipo oficial (SVG), favicon, colores corporativos (si existen) y autorización de uso.

**Contacto (`config.js`):** teléfono, WhatsApp, correo, dirección de la sede, horario y redes oficiales.

**Empresa:** razón social, NIT, ciudad de la sede, año de fundación, cobertura geográfica, equipo técnico y matrículas profesionales, y habilitaciones o certificaciones vigentes (número, entidad y fecha).

**Contenido:**
- Servicios que presta realmente y su alcance. Los cuatro actuales se derivaron del nombre; el de mantenimiento es el más dudoso.
- Público y sectores que atiende (vivienda, comercio, industria, agro).
- Proceso de trabajo real.
- Texto institucional, y misión, visión y valores si se van a publicar.
- Diferenciadores con respaldo. No se incluyó ninguno porque no hay información verificable.

**Proyectos:** para cada obra, la autorización del cliente, fotos propias, datos técnicos (kWp, paneles, inversor), la ubicación autorizada, el alcance y el resultado medido si existe.

**Legal:** la política de tratamiento de datos aprobada (Ley 1581 de 2012) y su URL, la aprobación del contenido final y el dominio.

## Imágenes provisionales que deben sustituirse

Todas vienen de Wikimedia Commons, están recortadas y convertidas a WebP y llevan la etiqueta «Imagen/Foto ilustrativa» en la página. Los créditos están en el footer («Créditos fotográficos») y en `assets/images/credits.json`. Las licencias CC BY-SA exigen atribución.

| Archivo | Uso | Autor | Licencia |
|---|---|---|---|
| `cubierta-industrial-*` | Hero | Asurnipal | CC BY-SA 4.0 |
| `tejado-residencial-*` | Sector vivienda, servicio de diseño | Marta Victoria | CC BY-SA 4.0 |
| `cubierta-comercial-*` | Sector comercio, servicio de mantenimiento | Esthee2010 | CC BY-SA 4.0 |
| `parque-en-obra-*` | Sector industria y agro, servicio de construcción | Hanno Böck | CC0 |
| `estructura-montaje-*` | Ficha de proyecto, servicio de ingeniería | Marta Victoria | CC BY-SA 4.0 |
| `tecnico-altura-*` | Nosotros | CoCreatr | CC BY-SA 2.0 |

Lo ideal es reemplazarlas por fotografías propias de obras, equipo y sede. Se descartaron imágenes con marcas o logotipos visibles.

## Verificación realizada

Con Chrome headless (Playwright) a 360, 390, 768, 1366 y 1920 px, en las 7 páginas:
- Sin desbordamiento horizontal, sin errores ni avisos en consola, sin recursos 404 y con todas las imágenes cargadas.
- Carta solar: al mediodía da 74° hacia el norte el 21 de junio, 83° hacia el sur en el equinoccio y 59° hacia el sur el 21 de diciembre, lo que coincide con la teoría para 7,1° N. Después del ocaso indica «Bajo el horizonte».
- Menú móvil: abre y cierra.
- Formulario:
  - Enviado vacío, marca 7 errores y pone el foco en el primero.
  - Valida el formato del correo.
  - `?servicio=ingenieria` preselecciona el servicio.
  - Enviado válido sin destino, muestra un aviso honesto de que no se envió nada.
- Modo publicación con WhatsApp y teléfono simulados: oculta todo lo pendiente, aparecen los botones de WhatsApp y llamada, y el formulario ofrece enviar por WhatsApp con el resumen prellenado.

**No probado:** lectores de pantalla reales, Safari/iOS y un endpoint de formulario real. El rendimiento (Lighthouse) no se ha medido.

## Limitaciones conocidas

- Depende de las CDN. Sin el CSS de Bootstrap, el menú móvil se muestra desplegado.
- La carta solar usa la hora del dispositivo como hora solar aproximada (en Bucaramanga la diferencia es de pocos minutos) y una fórmula simplificada de la declinación, suficiente para ilustrar, no para diseñar.
- `og:image` usa una ruta relativa y no hay `canonical`, porque no hay dominio definitivo.

## Antes de publicar

1. Completar `config.js` y sustituir los textos, servicios e imágenes provisionales.
2. Conectar el formulario (`formEndpoint`) a un servicio de correo o CRM con validación en servidor.
3. Reemplazar `privacidad.html` por la política aprobada o enlazarla en `legal.privacidad`.
4. Cambiar `modo` a `'publicacion'` y revisar cada página.
5. Retirar `<meta name="robots" content="noindex, nofollow">` de todas las páginas.
6. Añadir `canonical`, `og:url` y `og:image` con URL absoluta, más `sitemap.xml` y `robots.txt`.
7. Configurar `404.html` como página de error en el servidor, HTTPS y cabeceras de seguridad (CSP, HSTS).
8. Opcional: datos estructurados `LocalBusiness`, solo con datos confirmados.
