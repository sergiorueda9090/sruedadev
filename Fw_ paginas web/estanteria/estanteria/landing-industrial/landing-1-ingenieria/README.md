# Landing 1 · Ingeniería industrial premium (marca de ejemplo «Ortogonal»)

Página corporativa y técnica. Su argumento comercial: la empresa ofrece **un proyecto de ingeniería** (diagnóstico, cálculo, fabricación, montaje), no la venta de estanterías metálicas.

## Concepto

- **Público**: gerentes de operaciones, jefes de planta y responsables de logística que comparan proveedores por capacidad técnica.
- **Propuesta de valor**: «La estantería es lo que se ve. El proyecto está en el cálculo».
- **Lenguaje visual**: plano técnico. Retícula fina de plano en el hero y en el bloque de ingeniería, un cajetín (como el de un plano) para las capacidades, fichas técnicas con tablas, y **cotas** dibujadas sobre la foto del hero (altura útil, ancho de pasillo, carga por nivel): lo que se mide en un diagnóstico.
- **Paleta**: azul profundo `#0A2130`, petróleo `#0F4C5C` / `#0B3541`, gris acero `#53646F`, papel `#F3F6F7`, blanco y naranja industrial `#E8641B` limitado a CTA, cotas y marcadores.
- **Tipografía**: Archivo (Google Fonts) usando su eje de anchura: 112–125 % en titulares, 75 % en anotaciones.
- **Navegación**: barra corporativa fija con enlaces por sección (se marca la sección activa) y botón de cotización; menú colapsable en móvil.
- **Animación**: entrada del hero y dibujo de las cotas (momento principal), revelado de fotos grandes y línea del proceso que avanza con el scroll en escritorio.

## Secciones

Header · Hero · Capacidades · Problemas · Soluciones (pestañas: selectivo, carga pesada, cantilever, multinivel/entrepisos, picking) · Proceso (5 etapas) · Galería · Ingeniería y personalización · Indicadores · Testimonios · Preguntas frecuentes · CTA final · Formulario · Footer · WhatsApp flotante.

## Archivos

```
index.html          estructura y textos
css/styles.css      diseño (tokens en :root)
js/main.js          CONFIG + comportamiento
assets/favicon.svg  favicon provisional
assets/images/      fotos WebP + CREDITOS.md
```

## Qué editar

| Qué | Dónde |
|---|---|
| Modo revisión / publicación | `CONFIG.modo` en `js/main.js` |
| WhatsApp | `CONFIG.whatsapp` (número de ejemplo; poner `esEjemplo: false` al usar el real) |
| Recepción del formulario | `CONFIG.formEndpoint` |
| Teléfono, correo, dirección, horario | `CONFIG.contacto` (vacío = no se publica) |
| Indicadores de confianza | `CONFIG.indicadores`: `valor: null` no se publica. Solo cifras verificables |
| Testimonios | `CONFIG.testimonios`: los de `ejemplo: true` solo se ven en revisión |
| Textos | `index.html` |
| Logotipo | Bloque `.brand` en el header y el footer: cambia el texto o reemplaza el `<svg>` por `<img src="assets/logo.svg" alt="Nombre">` |
| Favicon | Reemplaza `assets/favicon.svg` (o cambia el `<link rel="icon">`) |
| Fotos | Mismos nombres de archivo en `assets/images/`, o `tools/fotos.py` (ver README general) |
| Colores y tipografía | Variables de `:root` en `css/styles.css` |
| SEO | `<title>`, `description`, `canonical` y `og:*` en el `<head>` (`og:image` debe ser URL absoluta) |

Las etiquetas «Por confirmar» del HTML (`data-status="pendiente"`) marcan afirmaciones comerciales que el proveedor debe validar: qué capacidades presta, qué sistemas ofrece, cobertura, costo de la visita, inspección posterior. Al confirmarlas, borra el elemento con `data-status="pendiente"`.

## Formulario

Campos obligatorios: nombre, empresa, correo, mensaje y autorización de datos. El teléfono es opcional pero se valida si se escribe. Sin `formEndpoint` el formulario no envía nada y lo dice. Con `formEndpoint` hace `POST` JSON y solo confirma si la respuesta es `2xx`.

## Ejecutar

```bash
python3 -m http.server 8080   # desde esta carpeta → http://localhost:8080
```
