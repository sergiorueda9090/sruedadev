# Pendientes — Revista Burger

> ⚠ MODO PRUEBA (`modoPrueba: true` en `data/menu.js`). Cinta "DATOS DE PRUEBA" en cada página
> y crédito de fotos en la portada.

## Negocio (todo es ficticio)
- [ ] Nombre, eslogan, descripción, tipo de comida, público
- [ ] WhatsApp real. **Crítico**: de este dato dependen los 2 QR (portada y contraportada) y todos los botones "Pedir"
- [ ] Dirección, Instagram, horario
- [ ] Sitio web: **sin dato**
- [ ] Servicios (Domicilios / Para llevar / En el local) y etiquetas de portada (Res / Pollo / Veggie): confirmar
- [ ] Logo oficial (el actual dice "LOGO DE PRUEBA")

## Productos
- [ ] Carta real: nombres, categorías, descripciones e ingredientes
- [ ] **Precios reales**: los actuales son inventados
- [ ] **Fotos reales**: las 22 actuales son de TheMealDB / TheCocktailDB
- [ ] Definir los productos "Top" / Recomendados (hoy: HAM-02, HAM-04, HAM-06)

Campos que se dejaron vacíos a propósito para probar cómo se ven:
- `BEB-06` Chocolate caliente: **precio**
- `ACO-04` Ensalada de papa: marcado como **no disponible**

## Página web
- [ ] **Ubicación exacta**: coordenadas (lat/lng) o enlace de Google Maps del local. Hoy el mapa muestra Bogotá de prueba
- [ ] Horario por día (`horarioSemana`), coherente con el texto de horario
- [ ] Medios de pago
- [ ] Zona y costo de domicilio
- [ ] Enlace de reseñas de Google (ficha de Google Business del local)
- [ ] Facebook / TikTok (opcional)
- [ ] Dominio (ej. humoypan.com) y dónde se va a alojar
- [ ] Imagen para compartir (Open Graph): ideal una foto horizontal real del local o del plato estrella

## Antes de publicar
- [ ] `modoPrueba: false` (quita la cinta y el crédito de fotos)
- [ ] `bash tools/generar_pdf.sh`
- [ ] Escanear los QR (portada y contraportada) y probar algunos botones "Pedir"
- [ ] Aprobación del cliente
