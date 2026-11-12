# Catálogo digital — restaurante

```
catalogo/
├── css/revista.css         # (compartido) estilos del visor revista
├── js/revista.js           # (compartido) libro con StPageFlip, controles, teclado
├── vendor/                 # (compartido) Bootstrap 5.3.3, Bootstrap Icons 1.11.3, StPageFlip 2.0.7, qrcode-generator 1.4.4
└── revista-casona/         # ← este proyecto (La Casona del Sabor)
    ├── index.html              # documento para PDF (las páginas A4 se arman con JS)
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
| `dist/catalogo.pdf` | 11 páginas A4 | **Heyzine** (arma la revista y le pone el efecto) e imprenta |
| `dist/catalogo-revista.pdf` | Portada A4 + 5 dobles páginas | Enviar por WhatsApp o correo para que se vea como revista abierta |

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
