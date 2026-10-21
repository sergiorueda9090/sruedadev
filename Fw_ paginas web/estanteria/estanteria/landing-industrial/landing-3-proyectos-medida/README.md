# Landing 3 · Proyectos industriales a medida (marca de ejemplo «Nave»)

Página editorial inspirada en estudios de arquitectura industrial. Vende **la capacidad de analizar un espacio y diseñar una solución propia**, desde el levantamiento hasta el montaje. No es un catálogo.

## Concepto

- **Público**: dueños de proyecto, gerentes de planta y constructoras con naves nuevas, ampliaciones o necesidades fuera de catálogo.
- **Propuesta de valor**: «Cada espacio industrial tiene una solución por diseñar».
- **Lenguaje visual**: editorial asimétrico sobre 12 columnas, titulares de gran escala, proyectos numerados P-01…P-04 con fichas técnicas, alternancia de imagen y texto, una línea de tiempo con entregables.
- **Paleta**: blanco cálido mineral `#F0EFEA` / `#F8F7F3`, gris mineral `#A9A69D` (líneas) y `#5B5953` (texto), grafito suave `#2B2C2E` y amarillo industrial `#F2B705` para la acción.
- **Tipografía**: Big Shoulders (display condensada de carácter estructural) e Instrument Sans para el texto.
- **Navegación**: header mínimo transparente sobre el hero (se vuelve sólido al bajar) y botón «Menú» que abre un panel lateral.
- **Animación**: la foto del hero se abre como el portón de una nave y el titular sube línea a línea (momento principal); revelado discreto de fotos; parallax leve solo en escritorio; la línea de tiempo se llena de amarillo con el scroll.

## Secciones

Header · Hero · Enfoque · Proyectos conceptuales · Diseñado alrededor de tu operación · Análisis (espacio, carga, dimensiones, rotación, flujo) · Cómo trabajamos (7 etapas) · Soluciones especiales (cantilever, carga pesada, entrepisos, a medida) · Materiales, acabados y montaje · Preguntas frecuentes · Diagnóstico inicial · CTA final · Footer · WhatsApp flotante.

Los **proyectos P-01…P-04 son conceptuales**: lo indica la propia sección. Reemplazarlos por proyectos reales con autorización del cliente.

## Formulario de diagnóstico

Pensado para aceptar información parcial:

- **Imprescindible**: nombre, un medio de contacto (correo **o** teléfono) y autorización de datos.
- **Opcional**: empresa, ciudad, tipo de solución, dimensiones aproximadas, productos almacenados, peso aproximado («solo si lo conoces») y descripción.
- Una barra de progreso cuenta los datos opcionales completados sin exigirlos.

Sin `formEndpoint` no se envía nada y se informa; con endpoint, `POST` JSON y confirmación solo con respuesta `2xx`.

## Qué editar

| Qué | Dónde |
|---|---|
| Modo revisión / publicación | `CONFIG.modo` en `js/main.js` |
| WhatsApp | `CONFIG.whatsapp` (número de ejemplo; `esEjemplo: false` al usar el real) |
| Recepción del formulario | `CONFIG.formEndpoint` |
| Datos de contacto | `CONFIG.contacto` |
| Textos y proyectos | `index.html` |
| Logotipo | `.brand` en header y footer (texto «Nave» + barra amarilla en CSS) |
| Favicon | `assets/favicon.svg` |
| Fotos | `assets/images/` (mismos nombres) o `tools/fotos.py` |
| Colores y tipografía | `:root` en `css/styles.css` |
| SEO | `<head>` (`og:image` absoluta en producción) |

En modo revisión aparece abajo a la izquierda una pastilla «Versión de demostración» que se puede ocultar (se recuerda durante la sesión). Los «Por confirmar» señalan: portafolio real de soluciones especiales, calidades de acero, acabados y certificaciones, cobertura geográfica y política del diagnóstico.

## Ejecutar

```bash
python3 -m http.server 8080   # desde esta carpeta → http://localhost:8080
```
