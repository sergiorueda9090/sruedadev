# Cooperativa Santandereana de Transportadores Limitada — prototipo web

Página corporativa de una sola página (HTML5, CSS3, Bootstrap 5.3.3, JavaScript ES6+, AOS 2.3.4, Bootstrap Icons 1.11.3, Inter vía Google Fonts).

> **Estado: prototipo para revisión.** No es el sitio oficial de la cooperativa. Ningún dato operativo, de contacto ni legal se ha inventado: todo lo no confirmado está vacío o marcado como «Por confirmar».

## Ejecutar en local

```bash
cd webs/transporte
python3 -m http.server 8000
# abrir http://localhost:8000
```

Necesita conexión a internet: Bootstrap, AOS, los iconos y la fuente se cargan desde CDN con versión fija y hash SRI. Si AOS no carga, el contenido sigue visible (solo se pierden las animaciones).

## Estructura

```
transporte/
├── index.html          Página completa (HTML semántico)
├── css/styles.css      Tokens de diseño, componentes y secciones
├── js/config.js        ← DATOS DE LA COOPERATIVA (único archivo a editar)
├── js/main.js          Datos en la página, menú, navegación activa, AOS, formulario
├── assets/images/      Fotografías provisionales en WebP (ver créditos)
├── assets/icons/       Reservado para logotipo y favicon oficiales
└── README.md
```

## Cómo se gestiona el contenido provisional

`js/config.js` centraliza los datos de contacto, las redes sociales, los documentos legales y el destino del formulario. **Un valor en `null` no se muestra**: ni en la barra superior, ni en el contacto, ni en el footer.

`modo` controla qué ve el visitante:

| Modo | Efecto |
|---|---|
| `'revision'` (actual) | Muestra el aviso de prototipo y todo el contenido provisional con la etiqueta **Por confirmar**, para que la cooperativa lo revise. |
| `'publicacion'` | Oculta todo elemento con `data-status="pendiente"` (servicios, «Lo que nos distingue», textos provisionales) y muestra las alternativas `data-only="publicacion"`. |

Al confirmar un contenido, quita su `data-status="pendiente"` y la etiqueta `.pending-tag` en `index.html`.

## Qué encontramos en fuentes públicas (sin confirmar)

Varias tesis universitarias identifican a la Cooperativa Santandereana de Transportadores Limitada como **COPETRAN**. Según una auditoría de la UNAB (2011), se dedicaba al transporte terrestre de carga y pasajeros, con actividades de combustible y turismo. Son fuentes secundarias y antiguas; por eso las modalidades aparecen como «Por confirmar» y **no** se usa la sigla, el logotipo ni el eslogan de la marca. En Wikimedia Commons hay fotos de sus buses (azul marino y azul sobre blanco, coherentes con la paleta propuesta), pero no se usaron porque muestran la marca y harían pasar el prototipo por oficial.

- UNAB, «Auditoría financiera a la cartera comercial de la Cooperativa Santandereana de Transportadores “Copetran Ltda”»: https://kujane.minciencias.gov.co/Record/UNAB2_61f51f1df37dfb9fd0842e7c04008fd3/Details
- UNAB, «Reestructura operativa y de control de la Cooperativa Santandereana de Transportadores Limitada, COPETRAN»: https://repository.unab.edu.co/items/7a3d3e31-8470-4071-8e42-b8351cb00f4e/full
- USTA, «Informe de la práctica empresarial realizada en Copetran Ltda»: https://repository.usta.edu.co/items/75b9ba93-9301-49ac-947c-32246c51d530

## Datos que necesita la cooperativa para completar el sitio

**Identidad**
- Logotipo oficial (SVG) y autorización de uso; favicon.
- Confirmar si el sitio debe usar el nombre comercial (p. ej. la sigla) además del nombre legal.

**Contacto (en `config.js`)**
- Teléfono(s), correo, WhatsApp, dirección de la sede y horario de atención.
- Perfiles oficiales en redes sociales.

**Contenido**
- Texto institucional: historia, actividad, organización (sustituye el texto provisional de «Nosotros»).
- Servicios que presta hoy, con su alcance real: modalidad, destinos o rutas autorizadas, forma de compra o contratación.
- Atributos diferenciales con respaldo (sección «Lo que nos distingue», máximo 4).
- Información de seguridad que quiera publicar: pólizas, mantenimiento, formación, protocolos.
- Habilitaciones y autorizaciones vigentes (número, entidad y fecha), si se van a mencionar.
- Cifras (años de operación, asociados, vehículos, municipios) **con fuente y fecha**. La sección de indicadores está omitida hasta tenerlas.

**Legal**
- Política de tratamiento de datos personales (Ley 1581 de 2012) y aviso de privacidad, con su URL.
- Aprobación del contenido final y del dominio.

## Imágenes provisionales que deben sustituirse

| Archivo | Uso | Origen | Licencia |
|---|---|---|---|
| `hero-canon-chicamocha-{1600,2400}.webp`, `-movil-900.webp` | Hero | «Cañón del Rio Chicamocha», DanielORo, Wikimedia Commons | CC BY 4.0 |
| `bucaramanga-viaducto-{640,1000}.webp` | Nosotros | «Bucaramanga 3 Sder Col enr 2022», EEIM, Wikimedia Commons | CC BY-SA 4.0 |
| `carretera-atardecer-{900,1600}.webp` | Servicio destacado | «Paisajes de carretera», Johanrockdriz, Wikimedia Commons | CC BY-SA 4.0 |

Todas están recortadas y convertidas a WebP. Las licencias exigen atribución: los créditos están en el footer («Créditos fotográficos»). Lo ideal es reemplazarlas por fotografías propias de vehículos, sede y personal, con autorización.

## Implementado vs. pendiente

**Implementado y probado**
- Las 12 secciones del encargo. La de indicadores está omitida a propósito y la de operación se sustituyó por «Cómo trabajamos», que describe el proceso de atención sin afirmar capacidades.
- Menú responsive: completo desde 1200 px y panel lateral por debajo. Enlace activo según la sección visible. El menú se cierra al elegir una opción.
- Formulario con validación HTML y JavaScript, errores accesibles, foco en el primer error y preselección del tipo de consulta desde los enlaces «Solicitar información». Protección frente a doble envío y estados de carga, éxito y error.
- Modo revisión/publicación y datos centralizados en `config.js`.
- SEO base: `title`, descripción, Open Graph, jerarquía de encabezados y `alt` descriptivos. `noindex` activado mientras sea prototipo.
- Accesibilidad: enlace «Saltar al contenido», foco visible, contraste AA y `prefers-reduced-motion` (sin AOS ni animación del hero).

**Requiere backend o integración**
- Envío real del formulario: definir `formEndpoint` en `config.js` (POST JSON). Sin él, el formulario valida pero informa claramente que **no** se ha enviado nada. Si se configuran correo o WhatsApp, ofrece enviar el mensaje por esos canales.
- WhatsApp: basta con indicar el número en `config.js`.
- Analítica: no incluida.

**Antes de publicar**
1. Completar `config.js` y sustituir los textos provisionales.
2. Cambiar `modo` a `'publicacion'` y revisar la página.
3. Retirar `<meta name="robots" content="noindex, nofollow">`.
4. Añadir `canonical`, `og:url` y `og:image` con URL absoluta; favicon oficial.
5. Opcional: datos estructurados Schema.org (`Organization`) solo con datos confirmados.

## Pruebas realizadas

Con Chrome headless (Playwright) a 360×800, 390×844, 768×1024, 1366×768 y 1920×1080:
- Sin desbordamiento horizontal, sin errores ni avisos en consola y sin recursos 404.
- Todos los enlaces internos apuntan a secciones existentes y todas las imágenes cargan.
- Menú móvil: abre y se cierra al navegar.
- Formulario: 5 errores al enviarlo vacío con el foco en el primero, validación de correo y teléfono, y aviso honesto de «pendiente de conexión» al enviarlo válido.
- Modo publicación: oculta todo lo pendiente y muestra las alternativas.
