# Revista Digitar — Boutique erótica (tienda web + revista digital + catálogo PDF)

```
revista-entrecorazones/     # Revista Digitar · Boutique erótica (carpeta autocontenida)
    ├── css/revista.css         # estilos del visor revista
    ├── js/revista.js           # libro con StPageFlip, controles, teclado
    ├── vendor/                 # Bootstrap 5.3.3, Bootstrap Icons 1.11.3, StPageFlip 2.0.7, qrcode-generator 1.4.4
    ├── index.html              # documento para PDF (las páginas A4 se arman con JS)
    ├── tienda.html             # ← SITIO WEB / ecommerce (pedidos por WhatsApp)
    ├── css/tienda.css · js/tienda.js
    ├── revista.html            # visor tipo revista con efecto de pasar página
    ├── css/catalogo.css        # estilos organizados por sección + @media print
    ├── js/catalogo.js          # paginación sin cortes, índice automático, validación
    ├── data/productos.js       # ← ÚNICO archivo a editar con la info del cliente
    ├── img/
    │   ├── logo/               # logo-digitar.png (recortado en círculo) + favicons
    │   ├── productos/          # ilustraciones SVG de ejemplo → reemplazar por fotos reales (ej. len-01.jpg)
    │   └── recursos/           # texturas u otros recursos gráficos
    ├── tools/
    │   ├── generar_pdf.sh          # exporta dist/catalogo.pdf con Chrome headless
    │   └── generar_placeholders.py # regenera las ilustraciones "Imagen ilustrativa"
    ├── dist/catalogo.pdf          # PDF A4 página por página → para Heyzine / imprenta
    ├── dist/catalogo-revista.pdf  # PDF tipo revista abierta (doble página) → para enviar
    ├── PENDIENTES.md           # información faltante
    └── _respaldo-casona/       # contenido anterior (restaurante): fotos, logo y datos
```

## Tienda web (`tienda.html`)
Ecommerce sin pasarela de pago: el cliente arma su pedido y lo envía por WhatsApp. Lee los mismos
datos que la revista y el PDF (`data/productos.js`), así que todo se actualiza en un solo lugar.

- Confirmación de mayoría de edad (compartida con la revista: se pide una vez por sesión).
- Hero, beneficios, colecciones, favoritos, catálogo, cómo comprar, revista, preguntas frecuentes y contacto.
- **Catálogo**: búsqueda (nombre, referencia, uso; sin importar tildes), filtro por colección y orden por precio o nombre.
- **Ficha de producto**: descripción, incluye, presentación, disponibilidad, cantidad, **modo de uso** completo,
  productos relacionados y enlace para compartir.
- **Pedido** (carrito): se guarda en el navegador; cantidades, total estimado y datos opcionales (nombre, ciudad,
  entrega, nota). El botón «Enviar pedido por WhatsApp» abre el chat con este mensaje:
  ```
  Hola, quiero hacer este pedido desde la tienda Revista Digitar:
  • 1 × Conjunto de encaje Bordeaux (LEN-01) — $159.000
  • 2 × Vela de masaje (BIE-01) — $130.000
  Total estimado: $289.000 COP
  Entrega: Envío a domicilio
  ```
  También hay «Pedir solo este producto por WhatsApp» en cada ficha y «Avísame cuando esté disponible» en los agotados.
- Enlaces directos: `tienda.html#producto=LEN-01` abre la ficha; `tienda.html#coleccion=juguetes` filtra la colección.
- Responsive: en celular aparece una barra fija «Ver pedido» con el total.
- Productos con `precio: null` se muestran como «Consultar precio» y se envían «por cotizar».

## Fichas de producto
Cada producto se muestra en una tarjeta horizontal: imagen, nombre, precio, botón "Lo quiero",
descripción, "Incluye" y un bloque **Modo de uso**:
- **Cuándo** (etiqueta con reloj): cuándo o con cuánto tiempo de anticipación se aplica o se prepara.
- **Pasos** numerados de aplicación o de uso.
- **Nota** de cuidado o seguridad.

Se edita en `data/productos.js`, campo `uso: { cuando, pasos: [...], nota }`. Si falta, se muestra "PENDIENTE".
Si en una página queda espacio, la siguiente colección empieza en la misma página.

## Flujo
1. Editar `data/productos.js` (precios exactos; `null` = se muestra "PENDIENTE").
2. Copiar las fotos a `img/productos/` y el logo a `img/logo/`.
3. `bash tools/generar_pdf.sh` → genera los dos PDF de `dist/`.

Abrir `index.html` en el navegador permite revisar el diseño en pantalla. La consola muestra
`VALIDACION {...}` con productos faltantes y campos pendientes.

## Modo revista (`revista.html`)
Usa las mismas páginas del PDF, pero en forma de libro, y se puede pasar página:
- Arrastrando la esquina de la hoja o haciendo clic sobre ella (también con el dedo en celular).
- Con los botones ‹ › o con las flechas del teclado. `Inicio` y `Fin` van a la portada y la contraportada.
- En computador muestra doble página; en celular, una sola página.
- `revista.html#p=5` abre directamente en la página 5.
- **Lupa** (botón dorado o tecla `Z`): abre las páginas que se están viendo ampliadas y con scroll, para leer
  las fichas y el modo de uso. Se acerca o aleja con `+` / `−` y se cierra con `Esc`. En escritorio abre
  ajustada al ancho (hasta 150 %); en celular abre al 90 % con desplazamiento horizontal. Los botones
  de WhatsApp funcionan también dentro de la lupa.
- La barra tiene botones de sonido (activar/silenciar), pantalla completa y descarga del PDF.
- **Sonido al pasar página**: se genera con Web Audio, así que no necesita archivos de audio. Si el usuario lo silencia, el navegador lo recuerda.
- Al tocar el índice, la revista pasa la hoja hasta esa sección.
- **Confirmación de mayoría de edad**: al abrir la revista se pide confirmar que se es mayor de 18 años
  (se recuerda durante la sesión del navegador). No aparece en los PDF.

Para Heyzine basta con subir `dist/catalogo.pdf`: Heyzine ya agrega su propio efecto de pasar página.
`revista.html` sirve para publicar el catálogo en un sitio propio sin depender de Heyzine.

## ¿Qué PDF usar?
| Archivo | Formato | Uso |
|---|---|---|
| `dist/catalogo.pdf` | 21 páginas A4 | **Heyzine** (arma la revista y le pone el efecto) e imprenta |
| `dist/catalogo-revista.pdf` | Portada A4 + 10 dobles páginas | Enviar por WhatsApp o correo para que se vea como revista abierta |

Un PDF no puede tener la animación de pasar página: el efecto lo pone el visor (Heyzine o `revista.html`).
No subas `catalogo-revista.pdf` a Heyzine, porque saldrían dos páginas dentro de cada hoja.

## PDF interactivo
Los dos PDF traen elementos donde se puede hacer clic (funcionan en Acrobat, Chrome, el celular y Heyzine):
- **Índice**: lleva a la página de cada categoría. El PDF también trae **marcadores** (panel lateral) con secciones y productos.
- **Botón "Lo quiero"** en cada producto: abre WhatsApp con un mensaje como *"Hola, me interesa: Conjunto de encaje Bordeaux (LEN-01)"*.
  No aparece en los productos marcados como no disponibles.
- **Contacto**: WhatsApp, Instagram y la dirección (abre Google Maps).
- **Código QR** en la contraportada: abre WhatsApp con un mensaje de pedido. Sirve cuando el catálogo está impreso.

Todos los enlaces se generan desde `negocio.whatsappLink`, `negocio.instagram` y `negocio.direccion` en `data/productos.js`.
