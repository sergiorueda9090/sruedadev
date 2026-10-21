# Landing pages para empresas de estanterías y racks industriales

Tres landing pages B2B **independientes y con conceptos distintos**, pensadas para conseguir solicitudes de cotización de empresas que necesitan ordenar y ampliar su almacenamiento. Las marcas (Ortogonal, Estiba, Nave) son **ficticias y editables**: no corresponden a ninguna empresa real.

| Carpeta | Marca de ejemplo | Estrategia | Abrir |
|---|---|---|---|
| `landing-1-ingenieria/` | Ortogonal | Ingeniería corporativa: la empresa vende cálculo y proyecto, no estructura metálica | `landing-1-ingenieria/index.html` |
| `landing-2-almacenamiento/` | Estiba | Catálogo comercial: el visitante identifica su sistema y cotiza rápido | `landing-2-almacenamiento/index.html` |
| `landing-3-proyectos-medida/` | Nave | Estudio de proyectos: vende diagnóstico y soluciones a medida | `landing-3-proyectos-medida/index.html` |

Cada carpeta tiene su propio `index.html`, `css/styles.css`, `js/main.js`, `assets/` (fotos WebP, favicon y créditos) y `README.md`. No comparten código ni archivos: se pueden entregar o publicar por separado.

## Ejecutar

Funcionan abriendo el `index.html` directamente, pero lo recomendado es un servidor local:

```bash
cd landing-industrial
python3 -m http.server 8080
# http://localhost:8080/landing-1-ingenieria/
# http://localhost:8080/landing-2-almacenamiento/
# http://localhost:8080/landing-3-proyectos-medida/
```

Requieren internet para las dependencias de CDN (versiones fijas, con hash SRI): Bootstrap 5.3.3, Bootstrap Icons 1.11.3, GSAP 3.13.0 + ScrollTrigger y Google Fonts. Las fotografías son locales.

## Tecnología

HTML5 semántico, CSS propio con variables (Bootstrap solo para rejilla, colapsables, acordeón y offcanvas), JavaScript vanilla en script clásico (`defer`, sin módulos ni build), GSAP + ScrollTrigger para animaciones. Sin React, Vue, Angular, Tailwind ni jQuery.

## Tres direcciones creativas

Las páginas se distinguen aunque se oculten colores y logotipos: cambian la retícula, el tipo de hero, la navegación, la forma de presentar los sistemas y el momento de animación.

| | 1 · Ingeniería (Ortogonal) | 2 · Catálogo (Estiba) | 3 · A medida (Nave) |
|---|---|---|---|
| Público principal | Gerentes de operaciones y plantas manufactureras que comparan proveedores por capacidad técnica | Jefes de bodega y compras que necesitan saber qué sistema pedir | Dueños de proyecto con naves nuevas, ampliaciones o casos fuera de catálogo |
| Propuesta de valor | «La estantería es lo que se ve; el proyecto está en el cálculo» | «Encuentra tu sistema y cotízalo en minutos» | «Diseñamos alrededor de tu operación, del levantamiento al montaje» |
| Paleta | Azul profundo `#0A2130`, petróleo `#0F4C5C`, gris acero `#53646F`, blanco y naranja `#E8641B` solo en CTA y cotas | Blanco, gris claro `#F2F4F6`, azul industrial `#0B4F9C`, naranja `#F5821F` para selección | Blanco cálido mineral `#F0EFEA`, gris mineral `#A9A69D`, grafito `#2B2C2E`, amarillo `#F2B705` |
| Tipografía | Archivo con eje de anchura: expandida en titulares, condensada en anotaciones | Barlow + Barlow Condensed (familia inspirada en señalización vial) | Big Shoulders (display condensada a gran escala) + Instrument Sans |
| Estilo fotográfico | Gran formato, pasillos de racks con perspectiva, estructura y fabricación | Fotos individuales por sistema, bodegas iluminadas y ordenadas | Arquitectónica: naves vacías, estructuras, vistas en planta, detalle de material |
| Hero | Dividido: texto sobre retícula de plano a la izquierda, foto a la derecha con **cotas técnicas** que se dibujan | Titular + CTA arriba, foto panorámica y **barra de accesos por necesidad** encima de la foto | Foto a pantalla completa que **se abre como un portón** y titular gigante línea a línea |
| Composición | Bloques amplios, cajetín de plano para capacidades, fichas técnicas en pestañas, proceso en 5 columnas | Modular: selector, rejilla de tarjetas filtrable, tabla comparativa, guía de 3 preguntas, carrusel | Editorial asimétrica en 12 columnas, proyectos P-01…P-04 en zigzag, línea de tiempo, alternancia imagen/texto |
| Navegación | Barra corporativa con enlaces por sección y botón de cotización | Menú orientado a producto (desplegable «Sistemas» A–G) + barra de acción fija en móvil | Header mínimo transparente con botón «Menú» que abre un panel lateral |
| CTA | Rectángulo naranja con texto oscuro, «Solicitar una cotización» | Botón azul «Cotizar mi proyecto» + «Cotizar este sistema» en cada tarjeta, que preselecciona el formulario | Amarillo de seguridad «Cuéntanos tu proyecto» y formulario de diagnóstico |
| Animaciones principales | Dibujo de cotas sobre la foto del hero, revelado de fotos, línea de proceso que avanza con el scroll | Entrada del hero, losetas de catálogo que «se encienden», respuesta animada del selector y de los filtros | Apertura del hero, titular por líneas, parallax leve (solo escritorio), línea de tiempo que se llena |

Todas respetan `prefers-reduced-motion` y las animaciones son *opt-in*: sin GSAP, sin JavaScript o con movimiento reducido, todo el contenido se ve.

## Personalizar

En cada landing, `js/main.js` empieza con un objeto `CONFIG` (lo único que hay que tocar para un cliente):

- `modo`: `'revision'` muestra el aviso de demostración y los elementos «Por confirmar»; `'publicacion'` los oculta, junto con indicadores sin valor y testimonios de ejemplo.
- `whatsapp.numero` / `whatsapp.esEjemplo`: el número `573001234567` es **de ejemplo**. Mientras `esEjemplo` sea `true`, el botón no abre WhatsApp: muestra un aviso. Para activarlo, poner el número real (código de país + número, sin `+` ni espacios) y `esEjemplo: false`.
- `formEndpoint`: URL que recibirá el formulario por `POST` (JSON).
- `contacto`: teléfono, correo, dirección y horario. Vacío = no se publica.

Textos, fotos, logotipo y favicon se cambian como se explica en el README de cada landing.

## Fotografías

Todas vienen de Unsplash (licencia Unsplash, uso comercial permitido) y se guardaron como WebP locales en `<landing>/assets/images/`, recortadas a la proporción de su espacio y en dos o tres anchos para `srcset`. Cada landing usa fotos distintas. Los créditos están en `tools/creditos.json` y en `<landing>/assets/images/CREDITOS.md`.

**Son fotos de referencia: no muestran proyectos del proveedor.** Las galerías y proyectos están marcados como referencia o conceptuales. Antes de publicar, sustituirlas por fotos propias.

Para reemplazar o añadir una foto (requiere Python 3 y Pillow):

```bash
python3 tools/fotos.py usar photo-XXXXXXXXXXXX --proyecto landing-1-ingenieria \
    --slot hero --ratio 4:5 --anchos 640,1000,1400 --autor "Nombre" \
    --alt "Descripción de lo que se ve"
```

Para usar una foto propia, basta con guardar archivos WebP con el mismo nombre (`hero-640.webp`, `hero-1000.webp`…) y la misma proporción, o cambiar las rutas en el HTML.

## Formularios: integración pendiente

**Ningún formulario envía datos todavía.** Validan en el navegador, señalan los errores con foco en el primer campo y, como no hay `formEndpoint`, dicen explícitamente que la solicitud no se envió. Nunca muestran un falso «enviado».

Cuando se configure `formEndpoint`, el formulario hace `POST` con JSON (`Content-Type: application/json`) y solo muestra confirmación si la respuesta es `2xx`; si falla, muestra un error. Opciones: un endpoint propio, Formspree, Getform, una función serverless o un webhook de un CRM. El JSON incluye un campo `origen` con el nombre de la landing.

## Datos que requieren información real

En las tres páginas:

- Nombre comercial, logotipo y favicon.
- Teléfono, correo, dirección, horario y número de WhatsApp.
- Servicios que realmente presta (diseño, fabricación, instalación, inspección) y sistemas que fabrica o comercializa.
- Cobertura geográfica y política del diagnóstico o visita técnica.
- Fotos de proyectos propios con autorización del cliente.
- En la landing 1: indicadores de confianza (años, proyectos, posiciones, ciudades) y testimonios reales.
- En la landing 3: calidades de acero, acabados y certificaciones.
- URL definitiva (`canonical`) y `og:image` absoluta.
- Texto de autorización de datos y enlace a la política de tratamiento de datos (Ley 1581 de 2012).

Todo lo pendiente está marcado en pantalla con «Por confirmar» o «Por configurar» mientras el modo sea `revision`.

## Verificación realizada

Con Playwright + Google Chrome headless, servidor local:

- **Responsive** a 360, 390, 768, 1366 y 1920 px en las tres páginas: sin desbordamiento horizontal, sin errores de consola, sin peticiones fallidas, sin imágenes rotas, sin enlaces vacíos ni anclas rotas.
- **Interacción**: pestañas de soluciones (clic y flechas del teclado), menú móvil, selector de necesidades, filtros del catálogo con conteo, botón «Cotizar este sistema» que preselecciona el formulario, galería con botones, barra de acción, menú lateral con navegación, validación de los tres formularios (vacío, correo mal formado, envío parcial en la landing 3), mensaje honesto sin endpoint y aviso del WhatsApp de ejemplo.
- **Sin JavaScript**: el contenido es visible; las fichas de la landing 1 se muestran en lista y el selector de la landing 2 se oculta para no dejar controles sin efecto.
- **Movimiento reducido**: no se ejecutan las animaciones de entrada.
- **Contraste**: los pares de color de texto y botones superan AA (4,5:1).

No se probó en Safari ni Firefox, ni en dispositivos físicos. No se probó un envío real porque no hay endpoint configurado.
