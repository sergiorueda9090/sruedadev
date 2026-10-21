# Landing pages inmobiliarias: tres demos comerciales

Tres landing pages independientes para presentar a inmobiliarias pequeñas y medianas de Bucaramanga, Floridablanca, Girón y Piedecuesta. Cada una tiene su propia identidad, su propia estructura de conversión y sus propias fotografías. No comparten código: se puede entregar una sola carpeta a un cliente.

**Todo el contenido es demostrativo.** Las marcas, los inmuebles, los precios, los proyectos, las cifras y los testimonios son ejemplos. Cada página lo indica con una barra superior y notas en formularios, fichas y testimonios (controladas por `DEMO_MODE` en cada `js/main.js`).

## Las tres propuestas

| | 01 Inmobiliaria Prestige | 02 Hogar Urbano | 03 Inmobiliaria 360 |
|---|---|---|---|
| Para quién | Inmobiliarias de propiedades premium, fincas y penthouses | Agencias de arriendos, inmobiliarias de barrio y agentes independientes | Empresas con varias líneas: compraventa, arriendos, administración, proyectos e inversión |
| Concepto | Editorial de lujo: pocas propiedades, bien presentadas | Buscar casa desde el celular en segundos | Solidez corporativa y capacidad de gestión |
| Paleta | Petróleo `#0F3A40`, blanco cálido `#F8F6F1`, piedra `#DEDAD2`, oro `#D2B47F` (solo acento) | Verde profundo `#1D4A38`, verde suave `#DCEBDD`, arena `#F3EAD9`, blanco | Azul noche `#0B1A30`, cemento `#C8CBCB`, blanco, naranja `#EC5F14` |
| Tipografía | Bodoni Moda (titulares, cursiva en la segunda línea del hero) + Hanken Grotesk | Bricolage Grotesque (titulares compactos) + Figtree | Archivo en ancho expandido (125 %) para titulares y normal para texto |
| Forma | Esquinas casi rectas, mucho aire, filetes dorados finos | Radios generosos, pastillas, la foto del hero con forma de **arco de puerta** | Esquinas rectas, retícula de plano visible, bloques con divisiones de 1 px |
| Elemento memorable | La **colección privada**: la sección se fija y las fichas avanzan en horizontal al desplazarse (escritorio) | El **buscador** con conteo de resultados en vivo; filtra la grilla, las categorías y las ciudades | El **hero**: viga naranja que se traza y fotografía que se descubre «piso por piso» |
| Trato | Usted | Tú | Tú |
| Conversión | Ficha de detalle (modal) + WhatsApp por propiedad, formulario para compradores e inversionistas, banda para propietarios | WhatsApp en cada tarjeta, estado vacío que convierte la búsqueda en mensaje, formulario «Publica tu inmueble» | Fichas residenciales y comerciales, proyectos por etapa, bloque de captación naranja, inversión y formulario de asesoría |

### Secciones

- **01 Prestige**: navegación, hero panorámico, colección privada (6 inmuebles), categorías con vista previa, asesoría editorial con proceso en 4 pasos, mosaico de arquitectura y estilo de vida, formulario para compradores e inversionistas, CTA para propietarios, testimonios de ejemplo, footer.
- **02 Hogar Urbano**: navbar, hero con buscador (operación, tipo, ciudad, presupuesto), categorías (apartamentos, casas, lotes, locales, oficinas), 12 inmuebles con filtros y estado vacío, «Encuentra tu hogar en Santander» con fotos reales de las cuatro ciudades, ventajas, formulario para propietarios, testimonios de ejemplo, preguntas frecuentes, CTA de WhatsApp, footer.
- **03 Inmobiliaria 360**: navbar corporativa, hero arquitectónico con índice de líneas, cuatro líneas de negocio, 8 inmuebles con filtro residencial/comercial, 3 proyectos con etapa de obra, administración (servicios y proceso), captación de propietarios, inversionistas (con foto real de Bucaramanga), indicadores **marcados como cifras de ejemplo**, formulario de asesoría, preguntas frecuentes, CTA final, footer.

## Estructura

```
inmobiliaria/
├── README.md
├── tools/
│   ├── fotos.py            # descarga, recorta y convierte fotos a WebP; registra créditos
│   ├── descargar_todo.sh   # regenera todas las fotos de los tres proyectos
│   └── creditos.json       # origen, autor y licencia de cada foto
├── 01-inmobiliaria-prestige/
│   ├── index.html
│   ├── css/styles.css
│   ├── js/main.js
│   └── assets/ (favicon.svg, img/*.webp)
├── 02-hogar-urbano/        # misma estructura
└── 03-inmobiliaria-360/    # misma estructura
```

## Tecnologías

- HTML5 semántico, CSS3 propio y JavaScript vanilla (script clásico con `defer`, sin módulos ni build).
- Bootstrap 5.3.3 (grilla, navbar colapsable, acordeón y modal) y Bootstrap Icons 1.11.3.
- GSAP 3.13.0 + ScrollTrigger.
- Google Fonts.

Las librerías se cargan desde jsDelivr con versión fija y hash SRI (`integrity`). Si cambias una versión, actualiza también el hash:

```bash
curl -sL <url> | openssl dgst -sha384 -binary | openssl base64 -A
```

## Ejecutar

Desde la carpeta `inmobiliaria/`:

```bash
python3 -m http.server 8080
```

Abrir `http://localhost:8080/01-inmobiliaria-prestige/`, `/02-hogar-urbano/` o `/03-inmobiliaria-360/`. También funcionan abriendo el `index.html` directamente. Requieren internet para Bootstrap, GSAP y las fuentes. Las fotografías son locales.

## Fotografías

Todas están descargadas, recortadas y optimizadas en WebP dentro de `assets/img/` de cada proyecto, así que no dependen de enlaces remotos. Las tres propuestas usan fotografías distintas.

- **Inmuebles, interiores y arquitectura**: Unsplash, [licencia Unsplash](https://unsplash.com/license) (uso comercial gratuito, sin atribución obligatoria). Son **imágenes de referencia**: no corresponden a los inmuebles ficticios ni a Santander, y así se indica en cada página.
- **Ciudades de Santander** (Hogar Urbano e Inmobiliaria 360): Wikimedia Commons, con atribución visible junto a la imagen:
  - Bucaramanga: *Bucaramanga v cu.JPG*, EEIM, CC BY-SA 3.0.
  - Floridablanca: *Cañaveral, Floridablanca Sder Col enr 2022.jpg*, EEIM, CC BY-SA 4.0.
  - Girón: *Calles. Sector antiguo de la ciudad de Girón*, Kamilokardona, CC BY-SA 3.0.
  - Piedecuesta: *Piedecuesta, Santander.JPG*, Claudio A Moreno, CC BY-SA 3.0.
  - Bucaramanga de noche: *Bucaramanga desde Cabecera Noche 2.jpg*, Ángel Páez, CC BY 4.0.

El detalle de cada archivo (origen, autor, licencia, texto alternativo) está en `tools/creditos.json`.

**Cambiar o agregar una foto** (requiere Python 3 y Pillow):

```bash
python3 tools/fotos.py usar photo-1600585154340-be6161a56a0c \
  --proyecto 01-inmobiliaria-prestige --slot residencia-lagos \
  --ratio 4:5 --anchos 640,1100 --foco 0.5,0.5 --alt "Descripción de lo que se ve"
```

La fuente puede ser un ID de Unsplash (`photo-…`) o un archivo de Commons (`File:Nombre.jpg`). Para un cliente real, reemplaza las fotos por las de sus inmuebles, con su autorización.

Si una imagen no carga, la página muestra un fondo con el color de la marca y el texto «Imagen no disponible» en lugar de un ícono roto.

## Cambiar el número de WhatsApp

Al inicio de cada `js/main.js`:

```js
const WHATSAPP_NUMBER = "573001234567";
```

Es un **número de ejemplo**. Reemplázalo por el número autorizado del cliente: código de país + número, sin `+`, espacios ni guiones (ej.: `573151234567`). Todos los enlaces `https://wa.me/` de la página (botón flotante, tarjetas, formularios, CTA) se construyen desde esa constante, con el mensaje codificado con `encodeURIComponent`. Los mensajes base están en el objeto `MESSAGES` del mismo archivo.

Los botones nunca envían nada automáticamente: abren WhatsApp con el mensaje escrito para que la persona lo revise y lo envíe.

## Modificar las propiedades demostrativas

Cada `js/main.js` tiene un arreglo `PROPERTIES` (y `PROJECTS` en 360) al inicio. Cada objeto incluye nombre, operación (`venta`/`arriendo`), tipo, ciudad, sector, precio en COP como entero, habitaciones, baños, área, imagen y texto alternativo. Los precios se muestran con `Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })`.

- `image` es la ruta **sin** sufijo de ancho: `assets/img/casa-lagos` usa `casa-lagos-480.webp` y `casa-lagos-960.webp` (640/1100 en Prestige).
- En Hogar Urbano, `type` debe ser `apartamento`, `casa`, `lote`, `local` u `oficina` (alimenta categorías y filtros). Los rangos del filtro de presupuesto están en `BUDGETS`. Los conteos por categoría y ciudad se calculan solos.
- En 360, `segment` es `residencial` o `comercial`. Si `beds` es 0, la ficha muestra el uso (oficina, bodega, local) en lugar de habitaciones. En `PROJECTS`, `stage` es el índice de `STAGES` (0 Lanzamiento, 1 Preventa, 2 Construcción, 3 Entrega).
- Los indicadores de 360 están en el HTML (`data-count-to`). Son cifras de ejemplo: no se deben publicar sin datos verificados de la empresa.

## Conectar los formularios a un backend

Hoy los formularios validan en el navegador y, si todo está bien, preparan un mensaje de WhatsApp. **No envían ni guardan datos**, y la interfaz lo dice. Para conectar un backend real (un endpoint propio, un CRM, Formspree o similar):

1. En la función del formulario (`bindForm` / `bindOwnerForm` de cada `main.js`), dentro del `setTimeout` del envío, reemplaza la pausa por una petición:

   ```js
   const res = await fetch(FORM_ENDPOINT, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(Object.fromEntries(new FormData(form)))
   });
   if (!res.ok) throw new Error('No se pudo enviar');
   ```

2. Solo después de una respuesta correcta cambia el texto del resultado a «Recibimos tu solicitud». Si falla, muestra un error claro y conserva los datos escritos.
3. Valida de nuevo en el servidor (nunca confíes solo en el navegador), protege el endpoint contra spam (honeypot, reCAPTCHA o límite de peticiones) y guarda la autorización de tratamiento de datos con fecha.
4. Mantén el botón de WhatsApp como alternativa.

## Checklist antes de publicar para un cliente real

- [ ] Reemplazar nombre, logotipo, colores (si aplica) y textos con la marca del cliente.
- [ ] Cambiar `WHATSAPP_NUMBER` por el número autorizado y probar cada botón.
- [ ] Reemplazar `PROPERTIES` / `PROJECTS` por inventario real y vigente, con fotos propias autorizadas.
- [ ] Reemplazar o retirar testimonios y cifras de ejemplo. Publicar solo testimonios reales con autorización y cifras verificables.
- [ ] Completar los datos «por configurar»: dirección, correo, horario, NIT y matrícula de arrendador (si administra arriendos).
- [ ] Publicar la política de tratamiento de datos personales (Ley 1581 de 2012) y enlazarla desde los formularios y el footer.
- [ ] Conectar los formularios a un backend o dejarlos solo como puente a WhatsApp.
- [ ] Cambiar `DEMO_MODE` a `false` para quitar los avisos de demostración.
- [ ] Actualizar `canonical`, `og:url` y `og:image` con el dominio real y **quitar** `<meta name="robots" content="noindex">`.
- [ ] Agregar `robots.txt`, `sitemap.xml` y, si se desea, datos estructurados (`RealEstateAgent`) con información verificada.
- [ ] Reemplazar el favicon provisional (`assets/favicon.svg`) por el del cliente.
- [ ] Probar en celular real, en Chrome y Safari, y revisar Lighthouse.

## Verificación realizada

Probado con Playwright y Chrome 144 (headless) servido con `python3 -m http.server`:

- Anchos 320, 360, 390, 768, 1366, 1440 y 1920 px: sin desplazamiento horizontal, sin errores de consola y sin recursos 404 en las tres páginas.
- Un único `h1` por página, sin IDs duplicados, sin anclas rotas, todas las imágenes con `alt` y todos los archivos de imagen presentes.
- Formularios: con campos vacíos muestran los errores y llevan el foco al primero. Con datos válidos deshabilitan el botón, muestran el estado de carga y luego el resultado con el enlace `wa.me` y el mensaje armado.
- Hogar Urbano: conteo en vivo del buscador, estado vacío (arriendo en Girón), «Quitar filtros», presupuesto que activa la operación, filtros desde categorías y ciudades.
- Prestige: ficha de detalle en modal; categoría que preselecciona el tipo en el formulario.
- 360: filtro residencial/comercial y conteo de indicadores de ejemplo.
- Con GSAP bloqueado y con `prefers-reduced-motion: reduce`, todo el contenido se ve. Sin JavaScript se ven el hero y las secciones estáticas; las fichas de inmuebles (generadas desde `PROPERTIES`) se reemplazan por un aviso para escribir por WhatsApp.
- Menú móvil: abre y se cierra al elegir una sección.

No se probó en Safari ni en dispositivos físicos.
