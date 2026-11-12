# Información faltante / pendiente de aprobación

> ⚠ El catálogo está en **MODO PRUEBA** (`modoPrueba: true` en `data/productos.js`).
> Todo el contenido actual es ficticio: nombre, descripción, contacto, productos y precios.
> Cada página muestra la cinta roja "DATOS DE PRUEBA".

## Negocio (reemplazar todo)
- [ ] Nombre del restaurante
- [ ] Descripción del negocio
- [ ] Tipo de comida
- [ ] Público objetivo
- [ ] WhatsApp (número y enlace `wa.me`). **Crítico**: de este dato dependen el QR y todos los botones "Pedir"
- [ ] Dirección
- [ ] Instagram
- [ ] Sitio web: **sin dato** (se muestra "PENDIENTE")
- [ ] Horario: **sin dato** (se muestra "PENDIENTE")
- [ ] Eslogan: confirmar si existe o eliminarlo

## Identidad visual
- [ ] Logo oficial (SVG o PNG con fondo transparente) → `img/logo/`
- [ ] Aprobar la paleta propuesta o entregar la de la marca:
  | Rol | HEX |
  |---|---|
  | Principal | `#7A2E1F` |
  | Secundario | `#E9B44C` |
  | Acento | `#3E6B48` |
  | Fondo | `#FBF6EE` |
  | Texto | `#2B2118` |

## Productos
- [ ] Lista real de productos y categorías
- [ ] Fotografías reales (las 14 actuales son marcadores "FOTO PENDIENTE")
- [ ] Precios confirmados por el cliente
- [ ] Definir qué productos van en "Recomendados"

Campos vacíos que se dejaron a propósito para probar cómo se ven los pendientes:
- `FUE-05` Sobrebarriga en salsa: **precio**
- `BEB-04` Gaseosa: **fotografía** y **descripción**
- `FUE-03` Sancocho de gallina: marcado como **no disponible**

## Antes de publicar en Heyzine
- [ ] Poner `modoPrueba: false`
- [ ] Ejecutar `bash tools/generar_pdf.sh` y revisar el PDF
- [ ] Escanear el QR con un celular y probar 2–3 botones "Pedir" con el número real
- [ ] Aprobación final del cliente
