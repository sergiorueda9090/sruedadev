# La Casona del Sabor — sitio web + carta en revista + PDF

```
revista-casona/             # La Casona del Sabor (carpeta autocontenida)
    ├── css/revista.css         # estilos del visor revista
    ├── js/revista.js           # libro con StPageFlip, controles, teclado
    ├── vendor/                 # Bootstrap 5.3.3, Bootstrap Icons 1.11.3, StPageFlip 2.0.7, qrcode-generator 1.4.4
    ├── index.html              # documento para PDF (las páginas A4 se arman con JS)
    ├── tienda.html             # ← SITIO WEB: carta en línea con pedido por WhatsApp
    ├── css/tienda.css · js/tienda.js
    ├── revista.html            # visor tipo revista con efecto de pasar página
    ├── css/catalogo.css        # estilos organizados por sección + @media print
    ├── js/catalogo.js          # paginación sin cortes, índice automático, validación
    ├── data/productos.js       # ← ÚNICO archivo a editar con la info del cliente
    ├── img/
    │   ├── logo/               # logo oficial
    │   ├── productos/          # fotos reales (nombre = ref en minúscula, ej. fue-01.jpg)
    │   └── recursos/           # texturas u otros recursos gráficos
    ├── tools/
    │   ├── generar_pdf.sh          # exporta dist/catalogo.pdf con Chrome headless
    │   └── generar_placeholders.py # regenera los marcadores de prueba
    ├── dist/catalogo.pdf          # PDF A4 página por página → para Heyzine / imprenta
    ├── dist/catalogo-revista.pdf  # PDF tipo revista abierta (doble página) → para enviar
    └── PENDIENTES.md           # información faltante
```

## Sitio web (`tienda.html`)
Carta en línea sin pasarela de pago: el cliente arma su pedido y lo envía por WhatsApp. Lee los mismos datos
que la revista y el PDF (`data/productos.js`): un cambio de precio se ve en los tres.

- Hero con fotos de los recomendados, beneficios, recomendados, **carta por secciones** (barra fija con buscador y
  accesos a cada sección), cómo pedir, nuestra casa, visítanos (mapa, horario, WhatsApp, Instagram) y pie.
- En cada plato: botón «Agregar» que se convierte en − cantidad +, sin abrir nada.
- **Ficha del plato**: foto grande, ingredientes, porción, **indicaciones para la cocina** (ej. «sin cebolla»),
  cantidad con subtotal, «Pedir solo este plato por WhatsApp» y platos relacionados.
- **Pedido**: Domicilio (pide dirección) o Recoger, nombre, «¿para cuándo?» y nota. Mensaje que se envía:
  ```
  Hola, quiero hacer un pedido en La Casona del Sabor:
  • 2 × Ajiaco santafereño (SOP-01) — $56.000
     ↳ Sin alcaparras
  • 1 × Bandeja de la casa (TIP-01) — $32.000
  Total de los platos: $88.000 COP
  Entrega: Domicilio
  Dirección: Cra 5 # 10-20, Centro
  ¿Me confirman el total con domicilio y el tiempo de entrega? ¡Gracias!
  ```
- El mismo plato con distintas indicaciones va en líneas separadas. El pedido se guarda en el navegador.
- Enlaces directos: `tienda.html#plato=SOP-01` abre la ficha; `tienda.html#seccion=sopas` va a la sección.
- Platos con `disponible: false` se muestran como «No disponible hoy»; sin foto, como «Foto próximamente».
- La revista tiene un botón de canasta que lleva a la web.

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
- La barra tiene botones de sonido (activar/silenciar), pantalla completa y descarga del PDF.
- **Sonido al pasar página**: se genera con Web Audio, así que no necesita archivos de audio. Si el usuario lo silencia, el navegador lo recuerda.
- Al tocar el índice, la revista pasa la hoja hasta esa sección.

Para Heyzine basta con subir `dist/catalogo.pdf`: Heyzine ya agrega su propio efecto de pasar página.
`revista.html` sirve para publicar el catálogo en un sitio propio sin depender de Heyzine.

## ¿Qué PDF usar?
| Archivo | Formato | Uso |
|---|---|---|
| `dist/catalogo.pdf` | 17 páginas A4 | **Heyzine** (arma la revista y le pone el efecto) e imprenta |
| `dist/catalogo-revista.pdf` | Portada A4 + 8 dobles páginas | Enviar por WhatsApp o correo para que se vea como revista abierta |

Un PDF no puede tener la animación de pasar página: el efecto lo pone el visor (Heyzine o `revista.html`).
No subas `catalogo-revista.pdf` a Heyzine, porque saldrían dos páginas dentro de cada hoja.

## PDF interactivo
Los dos PDF traen elementos donde se puede hacer clic (funcionan en Acrobat, Chrome, el celular y Heyzine):
- **Índice**: lleva a la página de cada categoría. El PDF también trae **marcadores** (panel lateral) con secciones y productos.
- **Botón "Pedir"** en cada producto: abre WhatsApp con un mensaje como *"Hola, quiero pedir: Bandeja de la casa (FUE-01)"*.
  No aparece en los productos marcados como no disponibles.
- **Contacto**: WhatsApp, Instagram y la dirección (abre Google Maps).
- **Código QR** en la contraportada: abre WhatsApp con un mensaje de pedido. Sirve cuando el catálogo está impreso.

Todos los enlaces se generan desde `negocio.whatsappLink`, `negocio.instagram` y `negocio.direccion` en `data/productos.js`.
