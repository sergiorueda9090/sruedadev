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
- [x] Logo: `img/logo/logo-casona.png` (fondo quitado del original `img/La Casona del Sabor Colombiano.png`). Se usa en portada, encabezados, cierre y favicon
- [ ] Aprobar la paleta propuesta o entregar la de la marca:
  | Rol | HEX |
  |---|---|
  | Principal | `#7A2E1F` |
  | Secundario | `#E9B44C` |
  | Acento | `#3E6B48` |
  | Fondo | `#FBF6EE` |
  | Texto | `#2B2118` |

## Productos
- [ ] Confirmar carta y categorías: 35 productos en Entradas, Sopas y caldos, Platos típicos, Carnes, Pescados y mariscos, Postres y Bebidas
- [x] Fotos de 31 platos (originales en `img/`, optimizadas en `img/productos/` con la ref)
- [ ] Confirmar descripciones e ingredientes: se escribieron según lo que se ve en cada foto
- [ ] Fotos de bebidas (BEB-01 a BEB-04 siguen con "FOTO PENDIENTE")
- [ ] Precios confirmados por el cliente
- [ ] Definir qué productos van en "Recomendados"

Campos vacíos que se dejaron a propósito para probar cómo se ven los pendientes:
- `BEB-04` Gaseosa: **fotografía** y **descripción**

## Sitio web
- [ ] Confirmar si hacen domicilios y en qué zonas (la web ofrece Domicilio y Recoger; el costo se confirma por WhatsApp)
- [ ] Horario de atención (se muestra en la barra superior y en «Visítanos»)
- [ ] Medios de pago para responder los pedidos
- [ ] Hosting y dominio para publicar (sitio estático: subir la carpeta completa)

## Antes de publicar en Heyzine
- [ ] Poner `modoPrueba: false`
- [ ] Ejecutar `bash tools/generar_pdf.sh` y revisar el PDF
- [ ] Escanear el QR con un celular y probar 2–3 botones "Pedir" con el número real
- [ ] Aprobación final del cliente
