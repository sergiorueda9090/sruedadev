# Pendientes — Revista Maquinaria (MaquiAndes, datos de prueba)

> ⚠ MODO PRUEBA (`modoPrueba: true` en `data/catalogo.js`): cinta "DATOS DE PRUEBA" en el catálogo y aviso rojo en la web.

## Empresa
- [ ] Nombre, logo, eslogan, descripción, público objetivo
- [ ] WhatsApp real. **Crítico**: de este dato dependen los QR, los botones "Cotizar" y la lista de cotización
- [ ] Teléfono, correo (**sin dato**), NIT (opcional)
- [ ] Dirección del patio y **ubicación exacta** (lat/lng o enlace de Google Maps). Hoy el mapa muestra Bogotá de prueba
- [ ] Zona de cobertura real
- [ ] Horario por día (`horarioSemana`)
- [ ] Instagram / Facebook / sitio web / dominio

## Equipos (13 de prueba)
- [ ] Lista real de equipos y categorías
- [ ] **Especificaciones reales** de cada máquina (las actuales son valores de ejemplo, no de la máquina de la foto)
- [ ] **Tarifas reales** por hora / día / mes (las actuales son inventadas)
- [ ] Operador: incluido u opcional por equipo
- [ ] Disponibilidad (hoy `RET-02` está marcada como no disponible para probar)
- [ ] Equipos "Más solicitados" (hoy: EXC-01, RET-01, CAR-01, VOL-02)
- [ ] **Fotos reales** de los equipos del cliente (las actuales son de Wikimedia Commons)

## Servicios y condiciones (todo de prueba, confirmar con el cliente)
- [ ] Servicios: con operador, sin operador, transporte, por hora/día/mes
- [ ] Mínimo de alquiler, jornada diaria, combustible, transporte, documentos/depósito, precios con o sin IVA
- [ ] Tipos de trabajo del formulario de cotización

## Antes de publicar
- [ ] `modoPrueba: false`
- [ ] Decidir si se deja el crédito "Sitio desarrollado por SRUEDADev" (`creditoDesarrollador`)
- [ ] `bash tools/generar_pdf.sh` y `bash tools/empaquetar_web.sh`
- [ ] Escanear los QR y enviar una cotización de prueba al WhatsApp real
- [ ] Aprobación del cliente
