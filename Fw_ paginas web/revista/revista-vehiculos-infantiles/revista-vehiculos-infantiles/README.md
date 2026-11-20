# Revista de vehículos infantiles — maqueta de prueba

Revista editorial comercial A4 (15 páginas) para una tienda, importadora o distribuidora de vehículos infantiles.
Sale de un solo archivo de datos, `js/datos.js`, y produce:
- **La revista digital** (`revista.html`): hojas que se pasan con el mouse, el dedo, los botones o el teclado,
  doble página en computador, una sola en celular, portada y contraportada rígidas y sonido de hoja.
- **El PDF** (`pdf/revista-vehiculos-infantiles.pdf`), listo para imprimir o subir a Heyzine, generado desde `revista.html?pdf`.
- **La página web** (`sitio.html`): inicio con catálogo, ficha completa y la revista incrustada.
- **La tienda online sin pago en línea** (`tienda.html`, `producto.html`, `carrito.html`): carrito y solicitud de cotización por WhatsApp.

> **Productos reales, empresa de prueba.** Los 22 productos usan las **fotos entregadas por el negocio** (con permiso) y solo datos
> que salen de ellas: referencia del fabricante (nombre de archivo), colores (fotos) y medidas (infografías). **No se inventaron**
> precios, edades ni especificaciones: aparecen como "Consultar" o no se muestran, y quedan en el reporte de pendientes.
> La empresa "Pidelibre Kids", su logo y su contacto siguen siendo de prueba (`modoPrueba: true`, cinta roja en cada página).

```
revista-vehiculos-infantiles/
├── revista.html              # revista con hojas que se pasan · revista.html?pdf = páginas para imprimir
├── sitio.html                # página web (catálogo, pedido, revista incrustada)
├── tienda.html · producto.html?ref=CE-01 · carrito.html   # tienda online (cotización por WhatsApp)
├── css/sitio.css · js/sitio.js                # estilos y lógica de la página de inicio
├── css/tienda.css                             # estilos de tienda, producto y carrito
├── js/carrito.js                              # carrito compartido + cabecera, pie y tarjeta de la tienda
├── js/tienda.js · js/producto.js · js/checkout.js   # catálogo con filtros, página de producto, carrito y cotización
├── css/styles.css            # diseño editorial y CSS de impresión
├── css/visor.css             # visor de la revista (fondo, hojas, barra de controles)
├── js/datos.js               # ← datos del negocio, categorías y productos
├── js/main.js                # maquetador: páginas, fichas, índice, validación
├── js/visor.js               # pasa las páginas a hojas (StPageFlip) + sonido + navegación
├── js/creditos.js            # créditos de fotos de terceros (vacío: las fotos son del negocio)
├── assets/carros-electricos/ · motos-electricas/ · cuatrimotos/ · vehiculos-gasolina/   # fotos organizadas: <ref>-<n>.webp
│   assets/<carpetas originales del negocio>/                       # fotos tal como se entregaron (no se modifican)
│   assets/logo/
├── pdf/revista-vehiculos-infantiles.pdf
├── tools/generar_pdf.sh      # genera el PDF e imprime el reporte de validación
├── tools/organizar_fotos.py  # copia las fotos de cada referencia de las carpetas originales a rutas limpias
├── tools/datos_negocio.py    # plantilla Excel (CSV) de precios, edades, specs y referencias → js/fichas.js
├── tools/empaquetar.sh       # arma publicar/ y publicar.zip listos para subir al hosting
├── datos-del-negocio/        # productos.csv y negocio.csv: los llena el negocio
├── js/fichas.js              # GENERADO desde los CSV (no editar a mano); se carga después de js/datos.js
├── politica-datos.html       # política de tratamiento de datos (Ley 1581 de 2012)
├── index.html · 404.html · robots.txt   # para el hosting
└── vendor/                   # Bootstrap 5.3.3, Bootstrap Icons, StPageFlip (pasar hojas), generador de QR
```

## Identidad visual — "Pit lane"
Catálogo de concesionario a escala niño: fondos claros, foto protagonista y cifras técnicas grandes.

| Token | Color | Uso |
|---|---|---|
| `--blanco` | `#FFFFFF` | Fondo de página |
| `--pista` | `#EEF1F5` | Piso de estudio detrás de las fotos, bloques suaves |
| `--pizarra` | `#22324A` | Texto y títulos (azul profundo, no negro) |
| `--electrico` | `#1554F0` | Todo lo **eléctrico** |
| `--gasolina` | `#E25F12` | Todo lo **a gasolina** |
| `--pedales` | `#13A06F` | Todo lo **de pedales** |

El color siempre indica el tipo de propulsión: etiqueta de cada ficha, títulos de sección e índice.
Las tres franjas diagonales de la portada y el cierre usan esos mismos tres colores.
Tipografía: **Archivo** (Google Fonts), ancha para títulos y cifras y normal para el texto.
La única animación es la entrada de las franjas en la portada; se desactiva con "reducir movimiento" y no afecta el PDF.

## Estructura (18 páginas)
Portada, quiénes somos, índice, apertura "Movilidad eléctrica", carros eléctricos (7), motos eléctricas (3),
cuatrimotos a gasolina (4) y motos cross a gasolina (8) con banda de uso responsable, cómo comprar y contacto (QR de WhatsApp).

El brief pide entre 15 y 25 páginas "según la cantidad de productos" y sin páginas de relleno: con 22 productos son 18.
Al agregar productos, la revista crece sola.

Fichas: dos por página, alternando el lado de la foto; si una categoría queda con un solo producto, la ficha ocupa la página completa.
Las categorías sin productos no aparecen. Los campos en `null` no se muestran en la ficha pública.

## Editar
Todo está en `js/datos.js`:
- `negocio`: nombre, WhatsApp (de él dependen los QR y los botones), redes, dirección.
- `categorias`: orden, nombre e introducción.
- `productos`: `ref`, `categoria`, `nombre`, `marca`, `modelo`, `foto`, `fotoPos` (encuadre opcional), `propulsion`,
  `specs` (edad, bateria, potencia, motor, cilindraje, arranque, autonomia, velocidad, pesoMax, ocupantes, dimensiones, carga, transmision),
  `especiales`, `colores`, `precio`, `disponible`, `garantia`.

Fotos: las fotos de cada producto (`fotos`) forman la galería de la página de producto; cada color puede tener su foto (`colores[].foto`),
que se muestra al elegirlo y en el carrito. Para agregar fotos nuevas: ponerlas en `assets/`, agregarlas en `tools/organizar_fotos.py`
y ejecutar `python3 tools/organizar_fotos.py`.

Antes de publicar: poner `modoPrueba: false` y cambiar nombre, logo y contacto por los reales.

## Página web (`sitio.html`)
Usa los mismos datos (`js/datos.js`) y la misma identidad que la revista.
- **Banners (carrusel bajo el menú, también arriba de `tienda.html`):** `motos_kids_1/2/3` (Cuatrimotos, Mini quads, KMV mini motores).
  Se editan en un solo lugar: `banners` en `js/datos.js` (imagen, texto alternativo y enlace). Cada uno lleva a su categoría
  de la tienda (`tienda.html?cat=…`). Avanza solo cada 6 s, se pausa con el mouse encima y no avanza solo si el visitante pidió
  "reducir movimiento". En celular se recorta hacia el lado del texto. Copias optimizadas en `assets/banners/` (800 y 1600 px),
  generadas por `tools/organizar_fotos.py` (sección `BANNERS`).
- **Explora por tipo:** fotos de ambiente `motos_kids_4` (moto cross) y `motos_kids_5` (cuatrimoto), más la foto real del Unimog rojo
  para carros eléctricos; cada una lleva a su categoría en la tienda.
- **Primera pantalla:** título y foto de portada, las tres franjas de color y **tres selectores grandes por tipo de propulsión**
  (eléctricos, a gasolina, de pedales; también accesorios) que filtran el catálogo.
- **Catálogo:** filtros por categoría, **edad del niño** (se lee de la edad recomendada de cada ficha; los vehículos con edad
  "según fabricante" no aparecen al filtrar por edad) y búsqueda por nombre, referencia o color.
  Cada tarjeta lleva foto, etiqueta de propulsión, tres cifras clave, precio, **Ver ficha** y **Agregar al pedido**.
  Los agotados ofrecen "Avísame cuando llegue" por WhatsApp.
- **Ficha completa** (ventana): todas las especificaciones, características, colores y, en los de gasolina, el aviso de uso responsable.
- **Carrito:** "Agregar al carrito" usa el mismo carrito de la tienda (ver abajo); el menú muestra cuántas unidades lleva.
- **Revista incrustada:** se hojea dentro de la página; sus botones cambian a "Añadir al pedido" y suman al carrito.
- Cómo comprar, distribuidores (lista de precios por WhatsApp), antes de la primera salida, contacto con QR y créditos de fotos.
- SEO: título, descripción, Open Graph y datos estructurados `Store` con ofertas (precio, disponibilidad, color).

## Tienda online — sin pasarela de pago
Funciona como un e-commerce, pero **no cobra**: el "checkout" arma una **solicitud de cotización** y la abre en WhatsApp.
Un solo carrito para todo el sitio (inicio, tienda, producto y revista incrustada), guardado en el navegador y sincronizado entre pestañas.

- **`tienda.html`** — buscador en la cabecera, accesos por propulsión, filtros laterales (propulsión, categoría, edad del niño,
  precio máximo, solo disponibles), chips de filtros activos que se quitan con un toque y orden (destacados, precio, nombre).
  Los filtros quedan en la URL para compartir la búsqueda, p. ej. `tienda.html?prop=electrico&edad=5&orden=precio-asc`.
  En celular los filtros se abren en un panel.
- **`producto.html?ref=…`** — foto grande, precio, **muestras de color**, cantidad, **Agregar al carrito**,
  **Cotizar solo este por WhatsApp**, características, ficha técnica y "También te puede interesar".
- **Ficha técnica "Plano de taller"** (`js/ficha.js` + `css/ficha.css`, en `producto.html#ficha`), hecha solo con datos reales:
  - **Plano acotado**: vista lateral (foto con cotas de largo y alto) y vista superior (huella con el ancho), a la misma escala,
    sobre cuadrícula del color de la propulsión. Las cotas se trazan una vez al llegar (no con "reducir movimiento").
    Sin medidas: foto sobre la cuadrícula y botón **Pedir las medidas** por WhatsApp.
  - **Placa de identificación**: referencia, modelo, marca, tipo, motor, cilindraje, batería, medidas… solo los campos que existen;
    los colores de fábrica con su foto eligen el color de compra.
  - **Frente al catálogo**: largo y cilindraje comparados con los demás productos (enlaces a cada uno).
  - **¿Cabe por tu puerta?**: con el ancho de la puerta dice si pasa de frente, inclinado o no pasa.
  - **Pregunta lo que necesitas saber**: un botón de WhatsApp por cada dato que falta (edad, batería, velocidad…).
  - **Imprimir ficha**: imprime solo la ficha en A4. El inicio (`sitio.html`) enlaza a ella desde la ventana de cada producto.
  Si la referencia no existe, muestra un aviso con enlace a la tienda. Datos estructurados `Product` para buscadores.
- **`carrito.html`** — cada línea es referencia + color (se puede cambiar el color y la cantidad), resumen con total de referencia
  y envío "se cotiza según la ciudad", y el formulario: nombre, celular, ciudad, dirección (opcional), familia o tienda,
  forma de pago preferida y notas. **Enviar cotización por WhatsApp** abre un mensaje así:

  ```
  *Solicitud de cotización #OVBJ8*
  Tienda: Pidelibre Kids
  • 2 × Go-kart de pedales Sport (OT-01) · Naranja · ref. $3.180.000
  • 2 × Camioneta 4x4 Ranger Kid (CE-02) · Rojo · ref. $4.900.000
  Total de referencia: *$8.080.000* (4 unidades)
  Envío: por cotizar
  Nombre / Celular / Ciudad / Compro como / Pago preferido / Notas
  ```
  Después muestra una confirmación con el número de cotización. El carrito **no se vacía solo**: el cliente lo vacía cuando confirma que envió el mensaje.
- Los agotados no entran al carrito; ofrecen "Avísame cuando llegue" por WhatsApp.

## Datos del negocio (precios, edades, specs, referencias)
1. Abrir en Excel `datos-del-negocio/productos.csv` (una fila por producto, ya trae lo confirmado) y `negocio.csv`
   (envíos, formas de pago, garantía, horario, dirección, correo, Instagram, dominio).
2. Llenar lo que se tenga. Celda vacía = ese dato no se publica (no borra nada). Guardar como **CSV delimitado por punto y coma**.
3. `python3 tools/datos_negocio.py importar` → genera `js/fichas.js` e informa cuántos precios, edades y medidas hay, y los errores.
4. `bash tools/generar_pdf.sh` para actualizar la revista.

Lo que se activa solo con esos datos: precio en tarjetas, carrito y WhatsApp; filtro por edad; plano acotado y "¿cabe por tu puerta?"
(con largo, ancho y alto); referencia real en todo el sitio; bloque **Compra con confianza** en cada producto (envío, formas de pago,
garantía, horario/dirección); formas de pago reales en el carrito; dirección y horario en el pie; sitemap con el dominio.
`python3 tools/datos_negocio.py plantilla` vuelve a crear las plantillas (no sobrescribe unas ya llenas).

## Fotos de tienda o exterior
Las fotos que no son de estudio (fondo blanco) llevan `fotoAmbiente: true` en `js/datos.js`: llenan el marco en vez de verse como un
recuadro dentro del gris. Hoy: MC-NK, MC-27, MC-MB, PB-01 y PB-02. Para el mejor resultado, reemplazarlas por fotos de fondo blanco
de al menos 1200 px (vehículo completo, de lado o en tres cuartos, sin logos de otras tiendas ni textos encima).

## Datos personales
`carrito.html` pide **autorización** (casilla obligatoria) antes de enviar la cotización, con enlace a `politica-datos.html`.
La política toma el nombre y los canales de contacto de los datos del negocio e incluye "Borrar mis datos de este navegador".
Es un **texto base**: el negocio debe revisarlo (idealmente con un abogado) antes de publicar.

## Publicar
```
bash tools/empaquetar.sh
```
Crea `publicar/` (y `publicar.zip`, ~9 MB) solo con lo que usa el sitio, y un PDF comprimido para la web (~1,6 MB; el de `pdf/`
sigue siendo el de imprenta, ~16 MB). La forma más simple: arrastrar `publicar/` a https://app.netlify.com/drop (gratis;
luego se conecta el dominio propio). También sirve cualquier hosting que acepte archivos estáticos (cPanel, GitHub Pages).
Con `sitioWeb` en `negocio.csv` genera `sitemap.xml`. La revista en Heyzine se sube a mano con el PDF.
Antes de publicar: nombre y logo reales y `modoPrueba: false` en `js/datos.js`.

## Generar el PDF
```
bash tools/generar_pdf.sh
```
Usa Chrome/Chromium headless: A4 vertical, una hoja por página, colores y fuentes incrustados, enlaces de WhatsApp y del índice clicables.
Al final imprime la línea `VALIDACION` con páginas, productos incluidos, páginas con contenido cortado y datos pendientes.
**No se ha publicado en Heyzine**: hay que subir el PDF manualmente.

---

## Reporte de productos incluidos (22)
| Ref. | Producto | Categoría | Propulsión | Colores (con foto) | Datos confirmados | Fotos |
|---|---|---|---|---|---|---|
| SX2128 | Jeep Speed 4x4 | Carros eléctricos | Eléctrico | Amarillo, Rosado | — | 6 |
| X15A | Jeep Wrangler | Carros eléctricos | Eléctrico | Blanco, Rosado | — | 5 |
| S313 | Jeep Wrangler 4x4 Estrella | Carros eléctricos | Eléctrico | Rojo, Rosado | 92 × 67 × 72 cm | 9 |
| S618 | Jeep Rubicon 4x4 12V | Carros eléctricos | Eléctrico | Blanco | 12 V · 86 × 63 × 64 cm | 2 |
| FT699 | Camioneta eléctrica FT699 | Carros eléctricos | Eléctrico | Blanco | 2 puestos · 83 × 82 × 89 cm | 3 |
| UNIMOG* | Campero Mercedes-Benz Unimog | Carros eléctricos | Eléctrico | Verde, Rojo | — | 9 |
| 017 | Jeep Running 4x4 | Carros eléctricos | Eléctrico | Verde militar | — | 1 |
| MCE-83* | Moto cross eléctrica 83 | Motos eléctricas | Eléctrico | Rojo, Verde | — | 9 |
| ME-68* | Moto eléctrica con rueditas | Motos eléctricas | Eléctrico | Rosado, Verde | Rueditas de entrenamiento removibles | 4 |
| MT3* | Moto eléctrica de tres ruedas | Motos eléctricas | Eléctrico | Blanco, Rojo | 2 a 5 años · 84 × 44 × 57 cm · luces, música, adelante/atrás | 4 |
| MA010 | Cuatrimoto 2T 50 cc | Cuatrimotos a gasolina | Gasolina | Azul, Verde | 2T · 50 cc · 100 × 59 × 53 cm | 5 |
| ATV008 | Cuatrimoto deportiva 4T 125 cc | Cuatrimotos a gasolina | Gasolina | Verde | 4T · 125 cc · 160 × 95 × 100 cm | 5 |
| ATV011 | Cuatrimoto todoterreno 4T 180 cc | Cuatrimotos a gasolina | Gasolina | Gris | 4T · 180 cc · 170 × 103 × 93 cm | 2 |
| MQ-01* | Mini cuatrimoto a gasolina | Cuatrimotos a gasolina | Gasolina | Verde | — | 5 |
| KXD708 | Moto cross KMV 23 | Motos cross a gasolina | Gasolina | Rojo, Azul, Verde, Naranja | KMV · 2T · 50 cc | 5 |
| DB-005 | Motocross 2T 60 cc | Motos cross a gasolina | Gasolina | Rojo, Azul, Naranja, Rosado | 2T · 60 cc | 8 |
| KMV502 | Moto cross 4T 110 cc | Motos cross a gasolina | Gasolina | Rojo, Azul | KMV · 4T · 110 cc | 2 |
| MC-NK* | Mini moto cross NK | Motos cross a gasolina | Gasolina | Azul, Rojo | — | 2 |
| MC-27* | Mini moto cross 27 | Motos cross a gasolina | Gasolina | Azul | — | 1 |
| MC-MB* | Mini moto cross Minibike | Motos cross a gasolina | Gasolina | Azul | — | 1 |
| PB-01* | Pit bike azul | Motos cross a gasolina | Gasolina | Azul | — | 1 |
| PB-02* | Pit bike blanca | Motos cross a gasolina | Gasolina | Blanco | — | 1 |

Medidas: tomadas de las infografías del fabricante (largo × ancho × alto). 12 V del Rubicon: del nombre de la carpeta entregada.
\* **UNIMOG, MCE-83, ME-68, MT3, MQ-01, MC-NK, MC-27, MC-MB, PB-01 y PB-02** son claves provisionales (no venía referencia comercial): confirmarlas con el negocio.
Los cuatro últimos vienen de `assets/motos_wow`. MT3: edad y medidas tomadas de su infografía; usa `fotoPlano` (foto sin textos) en el plano de la ficha.

## Fotos entregadas que NO se usaron (y por qué)
- **Carro Eléctrico - Jeep Speed 4x4:** la carpeta incluye **otros modelos**. El Rubicon S618 y la FT699 ya tienen ficha propia
  (la foto real del S618 se toma de esta carpeta). La **Toyota Hilux** (rosada y roja, con medidas 102 × 81 × 77 cm) y el jeep
  blanco de detalles verdes no se usan: no tienen carpeta propia. Si se venden, se pueden agregar como productos.
- **Jeep Rubicun 4x4 12V Milen:** 12 de 13 imágenes son **generadas con IA** (ChatGPT). Solo se usa la infografía con medidas.
- **Unimog:** la carpeta dice "Rojo", pero las fotos de estudio (22, 23, 24) son de un Unimog **verde**; las fotos "by Milen"
  (pasto e interior) sí son rojas. Se publicó con los dos colores, cada uno con su foto: confirmar que el verde se vende.
  Las fotos "by Milen" llevan esa marca de agua.
- **Cuatrimoto a gasolina 2T, 50 CC / KXD702_6:** es otro modelo de cuatrimoto.
- **Moto Cross a gasolina KMV 2T 50cc:** son **imágenes generadas con IA** (archivos "ChatGPT_Image…"). El brief pide no reemplazar
  fotos reales por imágenes generadas, y el modelo es el mismo de "Potente moto de cross KMV 23" (KXD708 KMV 2T 50cc), que sí tiene fotos reales.
- **motos_wow / shopping_mm_1–3 (cuatrimoto negra):** es una **Yamaha Raptor**, cuatrimoto deportiva de adulto con logo de Yamaha;
  mm_2 y mm_3 parecen **generadas con IA**. No se publicó: confirmar si se vende, su referencia y conseguir fotos reales propias.
- **motos_wow / shopping_5_2.webp:** miniatura de 64 px, repetida.
- **motos_wow / moto_gasolina_4:** pocket bike fotografiada en otra tienda, con su logo (Planet Outlet).
- **motos_wow / moto_gasolina_5:** es la moto **eléctrica** MCE-83, ya publicada.
- **motos_wow / moto_gasolina_9:** archivo idéntico a moto_gasolina_3.
- **motos_wow / moto_gasolina_11 a 17:** fotos de ambiente (niños corriendo); parecen **generadas con IA** y no muestran un modelo del catálogo.
- Las fotos de las motos nuevas a gasolina son de tienda o exterior (no de estudio) y varias son pequeñas (PB-02: 320 px,
  MC-MB: 500 px): conviene reemplazarlas por fotos de fondo blanco.
- Las fotos de prueba de Wikimedia Commons se eliminaron.

## Datos faltantes (los entrega el negocio)
- **Empresa:** nombre real, logo, teléfono, dirección, correo, Facebook, sitio web y cobertura.
- **Los 22 productos:** **precio**, **edad recomendada por el fabricante**, garantía (solo con documento) y disponibilidad real.
- **Carros eléctricos (7):** batería (voltaje y capacidad; solo el S618 dice 12 V), velocidad, autonomía, tiempo de carga,
  ocupantes y peso máximo; medidas de SX2128, X15A, UNIMOG y 017. Referencia comercial del Unimog.
- **Gasolina:** sistema de arranque, transmisión, peso máximo y medidas de las motos (KXD708, DB-005, KMV502).
- **Marca** de SX2128, X15A, S313, S618, FT699, 017, MA010, ATV008, ATV011 y DB-005.
- Mientras falten, los filtros de edad y precio de la tienda y del inicio se ocultan solos, y el precio dice "Consultar".

## Validación final (última generación)
- 14 páginas A4 verticales, sin páginas vacías.
- 13 de 13 productos incluidos; ninguna página con contenido cortado (`cortadas: []`).
- Índice: números de página calculados automáticamente y enlaces internos funcionando.
- Botones de WhatsApp: cada ficha abre un mensaje con el nombre y la referencia; el QR apunta al WhatsApp real del negocio (+57 314 380 1560).
- Enlaces externos: WhatsApp real (+57 314 380 1560) e Instagram de prueba. Teléfono, correo, Facebook, sitio web y dirección no aparecen porque faltan.
- Revista digital: portada sola, luego dobles páginas (2–3, 4–5…); en celular, una página a la vez.
  Barra con selector de sección, portada, anterior, siguiente, contraportada, sonido, pantalla completa, PDF y WhatsApp.
  Teclado: ← → (pasar hoja), Inicio y Fin. Los enlaces del índice pasan las hojas hasta la sección.
  `revista.html#p=10` abre directamente en la página 10.
