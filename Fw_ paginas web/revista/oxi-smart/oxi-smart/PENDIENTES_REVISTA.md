# Catálogo digital / revista — Oxi Smart Ingeniería

## Archivos
```
oxi-smart/
├── index_revista.html            # catálogo A4 para PDF (index_revista.html?pliegos = revista abierta)
├── revista.html                  # revista digital (efecto de pasar página + sonido + descarga del PDF)
├── assets/css/catalogo-revista.css · assets/css/revista.css
├── assets/js/catalogo-revista.js # maquetador: lee assets/js/data/*.js (los mismos datos del sitio)
├── assets/js/revista.js          # visor tipo revista (StPageFlip)
├── assets/vendor/                # bootstrap, bootstrap-icons, page-flip, qrcode (sin depender de CDN)
├── tools/generar_pdf_revista.sh  # genera y comprime dist/catalogo.pdf y dist/catalogo-revista.pdf
├── assets/js/data/fichas-tecnicas.js # fichas técnicas (solo catálogo/revista, NO las usa la web)
└── dist/catalogo.pdf (48 págs. A4, para Heyzine) · dist/catalogo-revista.pdf (pliegos)
```
Después de cambiar datos en `assets/js/data/` ejecute: `bash tools/generar_pdf_revista.sh`

Páginas: Portada · Empresa · Índice · Destacados · Guía de selección · por cada línea: portadilla en doble página y, por cada producto, **doble página: presentación (izq.) + ficha técnica (der.)** · Cómo cotizar · Asesoría · Contraportada.
La revista cuadra sola los pliegos: cada producto cae en página par para que su ficha quede enfrente.
Validación automática: 15/15 productos con ficha, todos en página par, 0 páginas desbordadas.

## Información pendiente (aparece marcada como "Pendiente" en el catálogo)
- [ ] **WhatsApp** (`company.js › whatsapp`). Crítico: sin número, los botones "Cotizar" abren WhatsApp sin destinatario y el QR de la contraportada no se imprime.
- [ ] Teléfono, correo, ciudad, dirección, horario
- [ ] Misión y visión
- [ ] Confirmar dominio `www.oxismartingenieria.com`
- [ ] **Precios** de los 15 productos (hoy "Consultar precio")
- [ ] **Referencias** de los 15 productos (hoy "Por asignar")
- [ ] ⚠ **Fichas técnicas** (`fichas-tecnicas.js`): los valores son **de referencia** (típicos del mercado), NO del cliente. Potencias, caudales, dimensiones, pesos, materiales, garantías, lo que incluye y el mantenimiento deben confirmarse con el fabricante o modelo real. Cada ficha impresa lleva la nota "Datos técnicos de referencia"; al confirmar una ficha, poner `referencial: false`.
- [ ] Guía de selección y consejos (página 5): validar con el equipo técnico de Oxi Smart
- [ ] **Fotografías reales**: los 15 productos tienen foto, pero **todas son ilustrativas** de Wikimedia Commons (marcadas "Foto ilustrativa", créditos en la contraportada y en la web). Reemplazar por fotos propias. Prioridad: medidor de oxígeno (se ve la marca HANNA) y tablero de control (rótulos en ruso).
- [ ] La validación del catálogo exige foto en todos los productos (`sinImagen` en la consola)
- [ ] Aprobación de cada ficha (`estado: "aprobado"` quita el aviso "Ficha en validación")
