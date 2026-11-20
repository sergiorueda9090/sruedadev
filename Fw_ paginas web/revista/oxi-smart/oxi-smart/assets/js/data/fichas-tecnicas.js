/* =====================================================================
   FICHAS TÉCNICAS DEL CATÁLOGO / REVISTA (solo index_revista.html y revista.html)
   ---------------------------------------------------------------------
   ⚠ VALORES DE REFERENCIA: datos típicos de equipos de este tipo en el
   mercado, redactados para maquetar la revista. NO son datos confirmados
   de Oxi Smart. Cada ficha impresa lo indica con la nota "Datos de
   referencia". Reemplácelos por los del fabricante/modelo real y ponga
   `referencial: false` en la ficha ya confirmada.

   Este archivo NO lo usa el sitio web (que sigue leyendo products.js),
   para que la web no publique datos sin confirmar.

   Campos:
   · kpis:      3 cifras clave { v: valor, u: unidad, l: etiqueta }
   · grupos:    tablas de la placa técnica { t: título, i: icono, f: [[campo, valor]] }
   · ventajas:  3 puntos fuertes { i: icono, t: título, d: texto }  (página izquierda)
   · sistemas:  { recomendado: [...], posible: [...] } con ids de OXI.sistemas
   · dim:       esquema de medidas { tipo: "caja", l, a, h } | { tipo: "cilindro", d, h } | null
   · incluye, mantenimiento: listas · garantia: texto
   ===================================================================== */
window.OXI = window.OXI || {};

window.OXI.sistemas = [
  { id: "estanque", nombre: "Estanque en tierra", icono: "bi-water" },
  { id: "reservorio", nombre: "Reservorio / lago", icono: "bi-droplet-half" },
  { id: "tanque", nombre: "Tanque circular", icono: "bi-circle" },
  { id: "biofloc", nombre: "Biofloc", icono: "bi-flower3" },
  { id: "ras", nombre: "Recirculación (RAS)", icono: "bi-arrow-repeat" },
  { id: "transporte", nombre: "Transporte / acopio", icono: "bi-truck" }
];

window.OXI.fichas = {
  /* ------------------------------ AIREADORES ------------------------------ */
  "aireador-de-paletas": {
    referencial: true,
    kpis: [
      { v: "2", u: "HP", l: "Potencia del motor" },
      { v: "2,4", u: "kg O₂/h", l: "Transferencia de oxígeno (SOTR)" },
      { v: "4.000", u: "m²", l: "Espejo de agua sugerido" }
    ],
    grupos: [
      { t: "Eléctrico", i: "bi-lightning-charge", f: [["Potencia", "2 HP (1,5 kW)"], ["Voltaje", "220 / 440 V"], ["Fases · frecuencia", "Trifásico · 60 Hz"], ["Protección del motor", "IP55, clase F"]] },
      { t: "Desempeño", i: "bi-speedometer2", f: [["Eficiencia (SAE)", "1,6 kg O₂/kWh"], ["Velocidad del rotor", "110–120 RPM"], ["Impulsores", "4 rotores de 6 paletas"], ["Profundidad mínima", "0,8 m"]] },
      { t: "Construcción", i: "bi-tools", f: [["Flotadores", "HDPE rotomoldeado (2)"], ["Bastidor", "Acero galvanizado en caliente"], ["Reductor", "Engranajes en baño de aceite"], ["Paletas", "Polipropileno de alta resistencia"]] },
      { t: "Dimensiones y peso", i: "bi-rulers", f: [["Largo × ancho × alto", "2,40 × 1,90 × 0,80 m"], ["Peso", "58 kg"]] }
    ],
    ventajas: [
      { i: "bi-arrows-move", t: "Oxigena y mueve el agua", d: "La corriente horizontal reparte el oxígeno y evita zonas muertas." },
      { i: "bi-gear-wide-connected", t: "Transmisión robusta", d: "Reductor en baño de aceite para trabajo continuo nocturno." },
      { i: "bi-shield-check", t: "Hecho para intemperie", d: "Flotadores HDPE y bastidor galvanizado resistentes a la corrosión." }
    ],
    sistemas: { recomendado: ["estanque", "reservorio"], posible: ["biofloc"] },
    dim: { tipo: "caja", l: "2,40 m", a: "1,90 m", h: "0,80 m" },
    incluye: ["Motor eléctrico 2 HP", "Reductor", "4 rotores con paletas", "2 flotadores", "Bastidor y tornillería"],
    mantenimiento: ["Revisar el nivel de aceite del reductor cada mes", "Cambiar el aceite cada 3.000 horas", "Inspeccionar paletas y acoples cada 15 días"],
    garantia: "12 meses en motor y reductor"
  },

  "aireador-tipo-splash": {
    referencial: true,
    kpis: [
      { v: "1", u: "HP", l: "Potencia del motor" },
      { v: "1,2", u: "kg O₂/h", l: "Transferencia de oxígeno (SOTR)" },
      { v: "4", u: "m", l: "Diámetro de rocío" }
    ],
    grupos: [
      { t: "Eléctrico", i: "bi-lightning-charge", f: [["Potencia", "1 HP (0,75 kW)"], ["Voltaje", "220 V"], ["Fases · frecuencia", "Mono o trifásico · 60 Hz"], ["Protección del motor", "IP55, sellado"]] },
      { t: "Desempeño", i: "bi-speedometer2", f: [["Eficiencia (SAE)", "1,6 kg O₂/kWh"], ["Velocidad", "3.450 RPM"], ["Cobertura sugerida", "1.000–1.500 m²"], ["Profundidad mínima", "0,6 m"]] },
      { t: "Construcción", i: "bi-tools", f: [["Impulsor", "Acero inoxidable 304"], ["Flotador", "HDPE rotomoldeado"], ["Carcasa del motor", "Aluminio con pintura epóxica"]] },
      { t: "Dimensiones y peso", i: "bi-rulers", f: [["Diámetro × alto", "0,95 × 0,60 m"], ["Peso", "28 kg"]] }
    ],
    ventajas: [
      { i: "bi-bullseye", t: "Oxigenación localizada", d: "Ideal para zonas de alimentación y estanques pequeños." },
      { i: "bi-plug", t: "Fácil de instalar", d: "Se ancla con cuerdas y queda listo para conectar." },
      { i: "bi-lightning", t: "Bajo consumo", d: "Motor de 1 HP para fincas con energía limitada." }
    ],
    sistemas: { recomendado: ["estanque", "reservorio"], posible: ["tanque"] },
    dim: { tipo: "cilindro", d: "0,95 m", h: "0,60 m" },
    incluye: ["Motor sumergible sellado", "Impulsor inoxidable", "Flotador", "Cable de 10 m"],
    mantenimiento: ["Limpiar el impulsor de algas cada 15 días", "Revisar sellos y cable cada mes", "Verificar anclajes después de lluvias fuertes"],
    garantia: "12 meses en motor"
  },

  "aireador-inyector": {
    referencial: true,
    kpis: [
      { v: "1", u: "HP", l: "Potencia del motor" },
      { v: "0,9", u: "kg O₂/h", l: "Transferencia de oxígeno (SOTR)" },
      { v: "1,2", u: "m", l: "Profundidad mínima" }
    ],
    grupos: [
      { t: "Eléctrico", i: "bi-lightning-charge", f: [["Potencia", "1 HP (0,75 kW)"], ["Voltaje", "220 / 440 V"], ["Fases · frecuencia", "Trifásico · 60 Hz"], ["Velocidad", "3.450 RPM"]] },
      { t: "Desempeño", i: "bi-speedometer2", f: [["Eficiencia (SAE)", "1,2 kg O₂/kWh"], ["Ángulo de trabajo", "30°–45° regulable"], ["Alcance de la corriente", "Hasta 15 m"]] },
      { t: "Construcción", i: "bi-tools", f: [["Eje y hélice", "Acero inoxidable 304"], ["Tubo aspirador", "1,2 m, inoxidable"], ["Soporte", "Flotador HDPE o fijo a muelle"]] },
      { t: "Dimensiones y peso", i: "bi-rulers", f: [["Largo total", "1,80 m"], ["Peso", "32 kg"]] }
    ],
    ventajas: [
      { i: "bi-layers", t: "Mezcla en profundidad", d: "Rompe la estratificación de capas de agua." },
      { i: "bi-volume-mute", t: "Operación silenciosa", d: "No salpica: menos ruido y menos evaporación." },
      { i: "bi-sliders", t: "Ángulo regulable", d: "Se ajusta según la profundidad del estanque." }
    ],
    sistemas: { recomendado: ["reservorio", "estanque"], posible: ["ras"] },
    dim: { tipo: "caja", l: "1,80 m", a: "0,45 m", h: "0,55 m" },
    incluye: ["Motor", "Eje con hélice", "Tubo aspirador", "Soporte de montaje"],
    mantenimiento: ["Limpiar la toma de aire cada semana", "Revisar el rodamiento inferior cada 3 meses", "Inspeccionar la hélice por desgaste"],
    garantia: "12 meses en motor"
  },

  /* ------------------------ SISTEMAS DE OXIGENACIÓN ------------------------ */
  "soplador-regenerativo": {
    referencial: true,
    kpis: [
      { v: "210", u: "m³/h", l: "Caudal máximo de aire" },
      { v: "250", u: "mbar", l: "Presión máxima" },
      { v: "60", u: "discos", l: "Difusores de 9\" alimentados" }
    ],
    grupos: [
      { t: "Eléctrico", i: "bi-lightning-charge", f: [["Potencia", "3 HP (2,2 kW)"], ["Voltaje", "220 / 440 V"], ["Fases · frecuencia", "Trifásico · 60 Hz"], ["Servicio", "Continuo 24/7 · IP55"]] },
      { t: "Desempeño", i: "bi-speedometer2", f: [["Caudal", "210 m³/h"], ["Presión diferencial", "250 mbar"], ["Ruido", "68 dB(A) a 1 m"], ["Aire", "Libre de aceite"]] },
      { t: "Construcción", i: "bi-tools", f: [["Carcasa", "Aluminio fundido"], ["Conexiones", "2\" roscadas"], ["Accesorios", "Filtro de entrada y silenciadores"]] },
      { t: "Dimensiones y peso", i: "bi-rulers", f: [["Largo × ancho × alto", "0,45 × 0,42 × 0,40 m"], ["Peso", "30 kg"]] }
    ],
    ventajas: [
      { i: "bi-droplet", t: "Aire libre de aceite", d: "No contamina el agua de los tanques." },
      { i: "bi-clock-history", t: "Trabajo continuo", d: "Diseñado para operar las 24 horas." },
      { i: "bi-diagram-3", t: "Un equipo, muchos puntos", d: "Alimenta varios tanques con una sola línea de aire." }
    ],
    sistemas: { recomendado: ["tanque", "biofloc", "ras"], posible: ["transporte"] },
    dim: { tipo: "caja", l: "0,45 m", a: "0,42 m", h: "0,40 m" },
    incluye: ["Soplador", "Filtro de aire", "2 silenciadores", "Válvula de alivio"],
    mantenimiento: ["Limpiar el filtro de aire cada 15 días", "Revisar la válvula de alivio cada mes", "Verificar la temperatura de la carcasa en operación"],
    garantia: "12 meses"
  },

  "difusor-de-disco": {
    referencial: true,
    kpis: [
      { v: "9", u: "pulg.", l: "Diámetro del disco" },
      { v: "1–3", u: "mm", l: "Tamaño de burbuja" },
      { v: "1,5–8", u: "m³/h", l: "Caudal de aire por disco" }
    ],
    grupos: [
      { t: "Desempeño", i: "bi-speedometer2", f: [["Caudal por disco", "1,5–8 m³/h"], ["Transferencia (SOTE)", "6–8 % por metro de inmersión"], ["Profundidad de trabajo", "0,5–6 m"], ["Pérdida de carga", "20–45 mbar"]] },
      { t: "Construcción", i: "bi-tools", f: [["Membrana", "EPDM microperforada"], ["Base", "Polipropileno reforzado"], ["Conexión", "Rosca 3/4\" NPT"], ["Válvula antirretorno", "Integrada"]] },
      { t: "Dimensiones y peso", i: "bi-rulers", f: [["Diámetro × alto", "230 × 60 mm"], ["Peso", "0,6 kg"]] }
    ],
    ventajas: [
      { i: "bi-circle", t: "Burbuja fina", d: "Más superficie de contacto: más oxígeno disuelto por m³ de aire." },
      { i: "bi-arrow-down-up", t: "Antirretorno", d: "La membrana se cierra al apagar el soplador." },
      { i: "bi-hourglass-split", t: "Larga vida útil", d: "Membrana EPDM de 3 a 5 años según la calidad del agua." }
    ],
    sistemas: { recomendado: ["tanque", "biofloc", "ras"], posible: ["estanque"] },
    dim: { tipo: "cilindro", d: "230 mm", h: "60 mm" },
    incluye: ["Difusor con membrana", "Anillo de sujeción", "Adaptador 3/4\""],
    mantenimiento: ["Revisar la uniformidad de la burbuja cada semana", "Limpiar la membrana con agua a presión entre ciclos", "Cambiar la membrana cada 3–5 años"],
    garantia: "6 meses"
  },

  "manguera-difusora": {
    referencial: true,
    kpis: [
      { v: "0,5–1", u: "mm", l: "Tamaño de burbuja" },
      { v: "0,4", u: "m³/h", l: "Caudal de aire por metro" },
      { v: "100", u: "m", l: "Presentación por rollo" }
    ],
    grupos: [
      { t: "Desempeño", i: "bi-speedometer2", f: [["Caudal por metro", "0,2–0,5 m³/h"], ["Presión de trabajo", "0,2–0,5 bar"], ["Profundidad de trabajo", "0,3–3 m"]] },
      { t: "Construcción", i: "bi-tools", f: [["Material", "Caucho EPDM autolastrado"], ["Diámetro int. × ext.", "10 × 16 mm"], ["Perforación", "Microporos en toda la longitud"]] },
      { t: "Presentación", i: "bi-box-seam", f: [["Rollo", "100 m"], ["Peso del rollo", "18 kg"]] }
    ],
    ventajas: [
      { i: "bi-distribute-horizontal", t: "Aire uniforme", d: "Burbuja a lo largo de todo el recorrido." },
      { i: "bi-arrow-down-circle", t: "Se queda en el fondo", d: "Autolastrada: no necesita pesas." },
      { i: "bi-scissors", t: "Corte a la medida", d: "Se adapta a tanques, canales y tinas de transporte." }
    ],
    sistemas: { recomendado: ["tanque", "transporte", "biofloc"], posible: ["ras"] },
    dim: null,
    incluye: ["Rollo de manguera", "Conectores y abrazaderas (según pedido)"],
    mantenimiento: ["Revisar fugas en conexiones cada semana", "Lavar entre ciclos para evitar taponamiento", "Guardar enrollada y a la sombra"],
    garantia: "6 meses"
  },

  /* ----------------------- EQUIPOS PARA PISCICULTURA ----------------------- */
  "medidor-oxigeno-disuelto": {
    referencial: true,
    kpis: [
      { v: "0–20", u: "mg/L", l: "Rango de oxígeno disuelto" },
      { v: "0,01", u: "mg/L", l: "Resolución" },
      { v: "IP67", u: "", l: "Sumergible y a prueba de polvo" }
    ],
    grupos: [
      { t: "Medición", i: "bi-speedometer2", f: [["Oxígeno disuelto", "0–20 mg/L · 0–200 %"], ["Exactitud", "±1,5 % de la lectura"], ["Temperatura", "0–50 °C · ±0,2 °C"], ["Tecnología del sensor", "Óptico (luminiscencia)"]] },
      { t: "Equipo", i: "bi-cpu", f: [["Pantalla", "LCD retroiluminada"], ["Memoria", "500 registros con fecha y hora"], ["Cable de sonda", "5 m"], ["Batería", "Recargable · 30 h de uso"]] },
      { t: "Dimensiones y peso", i: "bi-rulers", f: [["Medidor", "190 × 85 × 45 mm"], ["Peso", "0,45 kg con sonda"]] }
    ],
    ventajas: [
      { i: "bi-moon-stars", t: "Decide a tiempo", d: "Mide en la madrugada, la hora de menor oxígeno." },
      { i: "bi-eye", t: "Sensor óptico", d: "Sin membranas ni electrolito que cambiar." },
      { i: "bi-journal-text", t: "Registro de datos", d: "Guarda lecturas para llevar la bitácora de calidad de agua." }
    ],
    sistemas: { recomendado: ["estanque", "tanque", "biofloc", "ras"], posible: ["reservorio", "transporte"] },
    dim: { tipo: "caja", l: "190 mm", a: "85 mm", h: "45 mm" },
    incluye: ["Medidor", "Sonda con cable de 5 m", "Cargador", "Estuche de transporte"],
    mantenimiento: ["Enjuagar la sonda con agua limpia después de cada uso", "Calibrar en aire saturado cada semana", "Cambiar la tapa del sensor cada 12–24 meses"],
    garantia: "12 meses"
  },

  "tablero-control-aireadores": {
    referencial: true,
    kpis: [
      { v: "6", u: "circuitos", l: "Aireadores controlados" },
      { v: "24", u: "h", l: "Programación por circuito" },
      { v: "IP55", u: "", l: "Gabinete para exterior" }
    ],
    grupos: [
      { t: "Eléctrico", i: "bi-lightning-charge", f: [["Tensión", "220 / 440 V trifásico · 60 Hz"], ["Capacidad", "6 aireadores de hasta 2 HP"], ["Arranque", "Directo con guardamotor"], ["Protecciones", "Sobrecarga, cortocircuito, falla de fase"]] },
      { t: "Control", i: "bi-sliders", f: [["Temporizador", "Digital, 24 h por circuito"], ["Modo de operación", "Manual / automático"], ["Entrada de sensor", "4–20 mA para oxígeno (opcional)"], ["Señalización", "Pilotos de marcha y falla"]] },
      { t: "Dimensiones", i: "bi-rulers", f: [["Gabinete", "600 × 400 × 200 mm"], ["Material", "Acero con pintura electrostática"]] }
    ],
    ventajas: [
      { i: "bi-alarm", t: "Encendido programado", d: "Los aireadores arrancan solos en las horas críticas." },
      { i: "bi-shield-lock", t: "Motores protegidos", d: "Corta ante falla de fase o sobrecarga." },
      { i: "bi-graph-up", t: "Listo para automatizar", d: "Admite sensor de oxígeno para encender según la medición." }
    ],
    sistemas: { recomendado: ["estanque", "reservorio"], posible: ["tanque", "biofloc"] },
    dim: { tipo: "caja", l: "600 mm", a: "200 mm", h: "400 mm" },
    incluye: ["Gabinete con puerta y chapa", "Guardamotores", "Contactores", "Temporizadores", "Planos eléctricos"],
    mantenimiento: ["Reapretar borneras cada 6 meses", "Probar protecciones cada 3 meses", "Mantener el gabinete cerrado y seco"],
    garantia: "12 meses"
  },

  "alimentador-automatico": {
    referencial: true,
    kpis: [
      { v: "60", u: "L", l: "Capacidad de tolva" },
      { v: "8–12", u: "m", l: "Alcance de lanzamiento" },
      { v: "12", u: "raciones", l: "Programables por día" }
    ],
    grupos: [
      { t: "Eléctrico", i: "bi-lightning-charge", f: [["Alimentación", "12 V DC"], ["Energía", "Batería + panel solar 50 W (opcional)"], ["Motor", "Lanzador centrífugo"]] },
      { t: "Operación", i: "bi-sliders", f: [["Raciones", "Hasta 12 por día"], ["Duración por ración", "1–60 s"], ["Tamaño de pellet", "2–10 mm"], ["Alcance", "8–12 m regulable"]] },
      { t: "Construcción", i: "bi-tools", f: [["Tolva", "Polietileno con protección UV"], ["Tapa", "Hermética contra lluvia"], ["Soporte", "Trípode o poste galvanizado"]] }
    ],
    ventajas: [
      { i: "bi-calendar-check", t: "Rutina constante", d: "Raciones a la misma hora todos los días." },
      { i: "bi-sun", t: "Opción solar", d: "Funciona en lotes sin red eléctrica." },
      { i: "bi-distribute-vertical", t: "Mejor distribución", d: "Reparte el alimento en un área amplia del estanque." }
    ],
    sistemas: { recomendado: ["estanque", "tanque"], posible: ["biofloc", "reservorio"] },
    dim: { tipo: "cilindro", d: "0,50 m", h: "0,85 m" },
    incluye: ["Tolva con tapa", "Lanzador y controlador", "Soporte", "Cableado"],
    mantenimiento: ["Limpiar restos de alimento húmedo cada semana", "Revisar la batería y los bornes cada mes", "Verificar el alcance y la ración cada ciclo"],
    garantia: "12 meses"
  },

  /* -------------------------- TANQUES Y ESTRUCTURAS -------------------------- */
  "tanque-circular-piscicultura": {
    referencial: true,
    kpis: [
      { v: "6", u: "m", l: "Diámetro" },
      { v: "34", u: "m³", l: "Volumen útil" },
      { v: "1,2", u: "m", l: "Altura de agua" }
    ],
    grupos: [
      { t: "Capacidad", i: "bi-moisture", f: [["Diámetro", "6,0 m (otros: 4–12 m)"], ["Altura útil", "1,2 m"], ["Volumen útil", "34 m³"], ["Borde libre", "0,2 m"]] },
      { t: "Hidráulica", i: "bi-water", f: [["Desagüe", "Central de 4\" con tubo de rebose"], ["Pendiente del fondo", "2–3 % hacia el centro"], ["Entrada de agua", "Tangencial para generar giro"]] },
      { t: "Construcción", i: "bi-tools", f: [["Pared", "Lámina de acero galvanizado"], ["Revestimiento", "Geomembrana HDPE 1,0 mm"], ["Montaje", "Atornillado sobre piso nivelado"]] }
    ],
    ventajas: [
      { i: "bi-arrow-clockwise", t: "Autolimpieza", d: "El giro del agua lleva los sólidos al desagüe central." },
      { i: "bi-clipboard-data", t: "Más control", d: "Agua, oxígeno y alimentación medibles por tanque." },
      { i: "bi-arrows-angle-expand", t: "Crece por módulos", d: "Amplía la producción tanque a tanque." }
    ],
    sistemas: { recomendado: ["tanque", "biofloc", "ras"], posible: [] },
    dim: { tipo: "cilindro", d: "6,0 m", h: "1,4 m" },
    incluye: ["Paredes y tornillería", "Geomembrana a la medida", "Kit de desagüe central", "Planos de montaje"],
    mantenimiento: ["Retirar sólidos del desagüe cada día", "Revisar tornillería cada 6 meses", "Inspeccionar la geomembrana entre ciclos"],
    garantia: "12 meses en estructura"
  },

  "geomembrana-estanques": {
    referencial: true,
    kpis: [
      { v: "1,0", u: "mm", l: "Espesor (0,75 – 1,5 mm)" },
      { v: "7", u: "m", l: "Ancho de rollo" },
      { v: "+10", u: "años", l: "Vida útil a la intemperie" }
    ],
    grupos: [
      { t: "Material", i: "bi-layers", f: [["Tipo", "HDPE (polietileno de alta densidad)"], ["Espesores", "0,75 · 1,0 · 1,5 mm"], ["Densidad", "0,94 g/cm³"], ["Protección UV", "Negro de humo ≥ 2 %"]] },
      { t: "Desempeño", i: "bi-speedometer2", f: [["Resistencia a la tensión", "≥ 27 kN/m (1,0 mm)"], ["Elongación a la rotura", "≥ 700 %"], ["Uso", "Apta para contacto con peces"]] },
      { t: "Instalación", i: "bi-tools", f: [["Uniones", "Termofusión con cuña caliente"], ["Anclaje", "Zanja perimetral"], ["Presentación", "Rollos de 7 m de ancho"]] }
    ],
    ventajas: [
      { i: "bi-droplet-fill", t: "Cero infiltración", d: "Retiene el agua en suelos arenosos o permeables." },
      { i: "bi-stars", t: "Limpieza fácil", d: "Fondo liso para vaciar y desinfectar entre ciclos." },
      { i: "bi-sun", t: "Resiste el sol", d: "Aditivos contra rayos UV para uso a la intemperie." }
    ],
    sistemas: { recomendado: ["estanque", "reservorio", "tanque"], posible: ["biofloc"] },
    dim: null,
    incluye: ["Geomembrana a la medida del proyecto", "Termofusión en obra (según cotización)"],
    mantenimiento: ["Evitar objetos cortantes en el fondo", "Revisar uniones y taludes entre ciclos", "Reparar pinchazos con parche termofusionado"],
    garantia: "Según fabricante y espesor"
  },

  "estructura-tanque": {
    referencial: true,
    kpis: [
      { v: "4–12", u: "m", l: "Diámetros disponibles" },
      { v: "1,2", u: "m", l: "Altura de pared" },
      { v: "94", u: "m³", l: "Volumen en Ø 10 m" }
    ],
    grupos: [
      { t: "Estructura", i: "bi-bounding-box", f: [["Pared", "Lámina corrugada galvanizada cal. 20"], ["Refuerzo", "Anillo superior en ángulo"], ["Tornillería", "Galvanizada con arandela de sello"]] },
      { t: "Medidas de referencia", i: "bi-rulers", f: [["Ø 4 m", "15 m³"], ["Ø 6 m", "34 m³"], ["Ø 8 m", "60 m³"], ["Ø 10 m", "94 m³"]] },
      { t: "Montaje", i: "bi-tools", f: [["Base", "Terreno nivelado y compactado"], ["Tiempo de armado", "1 día (cuadrilla de 3 personas)"]] }
    ],
    ventajas: [
      { i: "bi-box-seam", t: "Modular", d: "Se transporta en piezas y se arma en la finca." },
      { i: "bi-shovel", t: "Sin excavación", d: "Aumenta la capacidad sin construir estanques." },
      { i: "bi-arrow-repeat", t: "Reubicable", d: "Se desarma y se vuelve a armar en otro lugar." }
    ],
    sistemas: { recomendado: ["tanque", "biofloc", "ras"], posible: [] },
    dim: { tipo: "cilindro", d: "4–12 m", h: "1,2 m" },
    incluye: ["Láminas de pared", "Anillo de refuerzo", "Tornillería", "Manual de armado"],
    mantenimiento: ["Reapretar tornillos después del primer llenado", "Revisar corrosión cada 6 meses", "Mantener el borde libre de vegetación"],
    garantia: "12 meses en estructura"
  },

  /* ------------------------ ACCESORIOS Y COMPONENTES ------------------------ */
  "paletas-repuesto": {
    referencial: true,
    kpis: [
      { v: "6", u: "uds.", l: "Paletas por rotor" },
      { v: "0,35", u: "kg", l: "Peso por paleta" },
      { v: "PP", u: "", l: "Polipropileno de alta resistencia" }
    ],
    grupos: [
      { t: "Material", i: "bi-layers", f: [["Paleta", "Polipropileno con protección UV"], ["Fijación", "Tornillo inoxidable 304"]] },
      { t: "Compatibilidad", i: "bi-puzzle", f: [["Rotores", "Aireadores de paletas de 1 a 3 HP"], ["Presentación", "Unidad o juego por rotor"]] }
    ],
    ventajas: [
      { i: "bi-arrow-repeat", t: "Reposición rápida", d: "El aireador vuelve a operar en minutos." },
      { i: "bi-sun", t: "Protección UV", d: "No se cristaliza con el sol." },
      { i: "bi-check2-circle", t: "Ajuste exacto", d: "Mismo perfil de la paleta original." }
    ],
    sistemas: { recomendado: ["estanque", "reservorio"], posible: [] },
    dim: null,
    incluye: ["Paletas", "Tornillería inoxidable"],
    mantenimiento: ["Cambiar paletas rotas o deformadas", "Reemplazar el juego completo para mantener el balance"],
    garantia: "3 meses por defecto de fabricación"
  },

  "flotadores-aireador": {
    referencial: true,
    kpis: [
      { v: "90", u: "kg", l: "Flotación por unidad" },
      { v: "1,2", u: "m", l: "Largo" },
      { v: "HDPE", u: "", l: "Rotomoldeado con espuma" }
    ],
    grupos: [
      { t: "Construcción", i: "bi-tools", f: [["Material", "HDPE rotomoldeado con protección UV"], ["Relleno", "Espuma de poliuretano (no se hunde si se perfora)"], ["Fijación", "Abrazaderas galvanizadas"]] },
      { t: "Dimensiones y peso", i: "bi-rulers", f: [["Largo × ancho × alto", "1,20 × 0,32 × 0,30 m"], ["Peso", "6,5 kg"], ["Flotación", "90 kg por unidad"]] }
    ],
    ventajas: [
      { i: "bi-life-preserver", t: "Insumergible", d: "El relleno de espuma lo mantiene a flote aunque se perfore." },
      { i: "bi-rulers", t: "Altura correcta", d: "Las paletas trabajan a la profundidad de diseño." },
      { i: "bi-sun", t: "Protección UV", d: "No se agrieta con la exposición al sol." }
    ],
    sistemas: { recomendado: ["estanque", "reservorio"], posible: [] },
    dim: { tipo: "caja", l: "1,20 m", a: "0,32 m", h: "0,30 m" },
    incluye: ["Flotador", "Abrazaderas de montaje"],
    mantenimiento: ["Revisar fisuras cada 3 meses", "Verificar la nivelación del aireador"],
    garantia: "6 meses"
  },

  "cable-sumergible": {
    referencial: true,
    kpis: [
      { v: "4×12", u: "AWG", l: "Calibre de referencia" },
      { v: "600", u: "V", l: "Tensión de aislamiento" },
      { v: "90", u: "°C", l: "Temperatura de operación" }
    ],
    grupos: [
      { t: "Especificación", i: "bi-plug", f: [["Tipo", "Encauchetado multiconductor"], ["Calibres", "4×14 · 4×12 · 4×10 AWG"], ["Aislamiento", "600 V · 90 °C"], ["Chaqueta", "Resistente a aceite, humedad y UV"]] },
      { t: "Selección (referencia a 220 V)", i: "bi-table", f: [["Hasta 2 HP · 30 m", "4×14 AWG"], ["Hasta 2 HP · 60 m", "4×12 AWG"], ["Hasta 3 HP · 60 m", "4×10 AWG"]] }
    ],
    ventajas: [
      { i: "bi-cloud-drizzle", t: "Para intemperie", d: "Chaqueta resistente al sol, la lluvia y el agua." },
      { i: "bi-bezier2", t: "Flexible", d: "Acompaña el movimiento del aireador flotante." },
      { i: "bi-rulers", t: "Por metro", d: "Se vende a la medida de la distancia al tablero." }
    ],
    sistemas: { recomendado: ["estanque", "reservorio"], posible: ["tanque"] },
    dim: null,
    incluye: ["Cable por metro", "Terminales (según pedido)"],
    mantenimiento: ["Evitar tensión en el cable: dejar holgura", "Revisar la chaqueta por cortes cada mes", "Sellar empalmes con kit termoencogible"],
    garantia: "Según fabricante"
  }
};
