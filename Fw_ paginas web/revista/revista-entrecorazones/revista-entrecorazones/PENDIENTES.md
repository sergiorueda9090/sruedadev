# Información faltante / pendiente de aprobación — Revista Digitar

> ⚠ El catálogo está en **MODO PRUEBA** (`modoPrueba: true` en `data/productos.js`).
> Los productos, descripciones, precios y datos de contacto son **de ejemplo**.
> Cada página muestra la cinta roja "DATOS DE PRUEBA".
> El contenido anterior (restaurante La Casona) quedó en `_respaldo-casona/`.

## Negocio
- [x] Nombre: Revista Digitar · Boutique erótica · Tienda para adultos (tomado del logo)
- [x] Eslogan: "Compra · Explora · Disfruta" (tomado del logo)
- [ ] Confirmar la descripción del negocio (redactada de ejemplo)
- [ ] WhatsApp real (número y enlace `wa.me`). **Crítico**: de él dependen el QR y los botones "Lo quiero"
- [ ] Dirección (o confirmar si es solo tienda en línea)
- [ ] Instagram
- [ ] Sitio web: **sin dato** (se muestra "PENDIENTE")
- [ ] Horario: **sin dato** (se muestra "PENDIENTE")
- [ ] Política de discreción: el texto actual solo invita a preguntar por empaque y entrega discreta.
      Confirmar qué ofrece realmente la tienda (empaque sin marca, nombre en la factura, envíos) antes de prometerlo.

## Identidad visual
- [x] Logo: `img/logo/logo-digitar.png` (recortado en círculo del original `Logotipo Boutique Erótica Revista Digitar.png`). Portada, encabezados, cierre, favicon y confirmación de edad
- [ ] Aprobar la paleta:
  | Rol | HEX |
  |---|---|
  | Vino (principal) | `#7A1436` |
  | Dorado (secundario) | `#C9A45C` |
  | Rosa intenso (acento, del logo) | `#D63A78` |
  | Rosa suave | `#F6E3EA` |
  | Negro elegante | `#1B0A11` |
  | Fondo | `#FFFAFB` |
- [x] Tipografía: Cormorant Garamond (títulos), Jost (textos), Great Vibes (detalles caligráficos)

## Productos
- [x] Colecciones: Lencería, Juguetes íntimos, Para parejas, Cosmética y cuidado íntimo, Bienestar y sensualidad, Juegos y experiencias, Accesorios
- [x] **112 productos de REFERENCIA** cargados con fotos, nombre, precio y descripción reales, tomados del
      catálogo público de **avenida69.co** (otra tienda, vía sus páginas de categoría `/lenceria-sexy/`,
      `/juguetes/`, `/cosmetica-sexual/`, `/bienestar/`, `/accesorios/`, `/hombres/`; acceso de lectura
      permitido por su `robots.txt` y `agents.md`). **No son el inventario real de este cliente** — sirven
      para que el diseño y la paginación se vean con fotos reales mientras llega el inventario propio.
  - Lencería, Juguetes, Cosmética y Bienestar: 20 productos cada una.
  - Accesorios: 20, pero muy centrados en repuestos de "fucking machine" y cargadores Lovense porque así
    está organizada esa categoría en avenida69.co (los complementos más "ligeros" — diademas, collares,
    pinzas — quedaron del lado de Lencería/Juguetes porque aparecían ahí en el sitio de origen).
  - **Para parejas: solo 7** y **Juegos: solo 5** — avenida69.co no tiene esas categorías dedicadas; se
    armaron filtrando por palabras clave (anillo/arnés/bondage para parejas; dados/cartas para juegos).
    Si se quieren 20 en cada una, hay que sumar otra fuente o pedirle productos al cliente.
  - Antes de publicar: decidir si este contenido de referencia se reemplaza por el inventario real del
    cliente (lo más probable) o si se deja como catálogo propio — en ese caso, revisar nombres/descripciones
    palabra por palabra porque son copy de otra tienda, no redactado para este negocio.
- [ ] Descripciones y "Incluye": usar solo datos del proveedor (materiales, funciones, contenido) cuando se
      reemplace por el inventario real
- [ ] **Modo de uso** (`uso` en cada producto: cuándo, pasos y nota): quedó en `null` (PENDIENTE) en los 112
      productos de referencia porque no está confirmado. Completar con el manual o la etiqueta real.
- [ ] Precios reales del proveedor del cliente (los actuales son los de avenida69.co, de referencia)
- [x] Fotos comerciales reales (no explícitas) — reemplazaron las ilustraciones SVG. Los SVG originales
      quedaron respaldados en `img/productos/_svg-placeholders-originales/`.
- [ ] Definir los "Favoritos" (hoy quedó destacado el primer producto de cada categoría: LEN-01, JUG-01,
      PAR-01, COS-01, BIE-01, JUE-01, ACC-01)

## Tienda web
- [ ] Confirmar si hay tienda física para la opción «Recoger en tienda» del pedido (si no, quitarla en `tienda.html`)
- [ ] Confirmar medios de pago y opciones de envío para responder los pedidos (hoy la tienda solo dice que se confirman por WhatsApp)
- [ ] Hosting y dominio para publicar `tienda.html` (sitio estático: basta subir la carpeta completa)

## Antes de publicar
- [ ] Poner `modoPrueba: false`
- [ ] Ejecutar `bash tools/generar_pdf.sh` y revisar el PDF
- [ ] Escanear el QR y probar 2–3 botones "Lo quiero" con el número real
- [ ] Verificar la normativa local sobre publicidad de productos para adultos (avisos de edad, plataformas donde se publica)
- [ ] Aprobación final del cliente
