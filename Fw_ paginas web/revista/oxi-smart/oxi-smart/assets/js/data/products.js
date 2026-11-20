/* =====================================================================
   PRODUCTOS — fuente única del catálogo web, las fichas técnicas y los PDF
   ---------------------------------------------------------------------
   REGLAS
   · precio: número en COP sin puntos (ej. 4850000) o null → "Consultar precio".
   · referencia: código comercial confirmado o null → "Por asignar".
   · specs: deje null todo dato no confirmado por el cliente. Lo null no se
     publica como dato; se muestra como "Por confirmar".
   · imagenes: la primera es la principal. "ilustrativa: true" pone la marca
     "Foto ilustrativa" (obligatoria si la foto no es del equipo real).
     "encuadre: 'contain'" para fotos de estudio con fondo blanco.
   · estado: "aprobado" cuando el cliente valide toda la ficha;
     "borrador" muestra el aviso "Ficha en validación".
   · Las listas vacías ([]) se muestran como pendientes de aprobación.

   ESTADO ACTUAL (nov. 2026): las líneas de producto se definieron a partir de
   las categorías del brief. Nombres, descripciones generales y aplicaciones
   describen el TIPO de equipo; precios, referencias y especificaciones están
   pendientes de que Oxi Smart los entregue. Ver README › "Pendientes".
   ===================================================================== */
window.OXI = window.OXI || {};

/* Campos de la placa de datos técnica, en el orden en que se muestran. */
window.OXI.specFields = [
  { key: "potenciaHP", label: "Potencia", unidad: "HP" },
  { key: "voltaje", label: "Voltaje", unidad: "V" },
  { key: "frecuencia", label: "Frecuencia", unidad: "Hz" },
  { key: "fases", label: "Fases", unidad: "" },
  { key: "rpm", label: "Velocidad", unidad: "RPM" },
  { key: "capacidad", label: "Capacidad", unidad: "" },
  { key: "dimensiones", label: "Dimensiones", unidad: "" },
  { key: "peso", label: "Peso", unidad: "kg" },
  { key: "materiales", label: "Materiales", unidad: "" },
  { key: "instalacion", label: "Tipo de instalación", unidad: "" },
  { key: "garantia", label: "Garantía", unidad: "" }
];

/* Plantilla de especificaciones vacía (todo pendiente). */
const OXI_SPECS_PENDIENTES = () => ({
  potenciaHP: null, voltaje: null, frecuencia: null, fases: null, rpm: null,
  capacidad: null, dimensiones: null, peso: null, materiales: null,
  instalacion: null, garantia: null
});

window.OXI.products = [
  /* ---------------------------- AIREADORES ---------------------------- */
  {
    id: "aireador-de-paletas",
    nombre: "Aireador de paletas",
    referencia: null,
    categoria: "aireadores",
    precio: null,
    destacado: true,
    estado: "borrador",
    resumen:
      "Rotores de paletas sobre flotadores que oxigenan el agua y generan corriente en estanques en tierra.",
    descripcion:
      "El aireador de paletas gira sobre la superficie del estanque, salpica el agua para que absorba oxígeno del aire y crea una corriente horizontal que reparte el agua oxigenada y evita zonas muertas. Es el equipo más usado en estanques en tierra de tilapia, cachama y otras especies de aguas cálidas.",
    imagenes: [
      { src: "assets/images/products/aireador-paletas-estudio.webp", alt: "Aireador de paletas con cuatro rotores sobre dos flotadores, foto de estudio", ilustrativa: true, encuadre: "contain" },
      { src: "assets/images/products/aireador-paletas-estanque.webp", alt: "Aireador de paletas amarillo y azul flotando en un estanque piscícola", ilustrativa: true },
      { src: "assets/images/products/aireador-paletas-detalle.webp", alt: "Detalle de aireador de paletas en reposo sobre el agua", ilustrativa: true },
      { src: "assets/images/products/aireador-paletas-operacion.webp", alt: "Aireadores de paletas en operación levantando agua en un estanque en tierra", ilustrativa: true }
    ],
    caracteristicas: [],
    specs: OXI_SPECS_PENDIENTES(),
    aplicaciones: [
      "Estanques en tierra para engorde de tilapia y cachama",
      "Reservorios y lagos de producción",
      "Apoyo en horas de bajo oxígeno (noche y madrugada)"
    ],
    ventajas: [],
    componentes: [],
    recomendaciones: []
  },
  {
    id: "aireador-tipo-splash",
    nombre: "Aireador tipo splash",
    referencia: null,
    categoria: "aireadores",
    precio: null,
    destacado: true,
    estado: "borrador",
    resumen:
      "Impulsor vertical que lanza el agua al aire en forma de chorro para oxigenarla.",
    descripcion:
      "El aireador tipo splash (impulsor o turbina vertical) toma agua de la superficie y la lanza hacia arriba en forma de lluvia. Al caer, las gotas absorben oxígeno. Es útil en estanques pequeños y medianos y en sitios donde se necesita oxigenación localizada.",
    imagenes: [
      { src: "assets/images/products/aireador-splash-1.webp", alt: "Aireador tipo splash en operación lanzando agua en un estanque", ilustrativa: true },
      { src: "assets/images/products/aireador-splash-2.webp", alt: "Estanques piscícolas con aireadores tipo splash funcionando", ilustrativa: true }
    ],
    caracteristicas: [],
    specs: OXI_SPECS_PENDIENTES(),
    aplicaciones: [
      "Estanques pequeños y medianos",
      "Oxigenación localizada en zonas de alimentación",
      "Reservorios de agua para la finca"
    ],
    ventajas: [],
    componentes: [],
    recomendaciones: []
  },
  {
    id: "aireador-inyector",
    nombre: "Aireador inyector de aire",
    referencia: null,
    categoria: "aireadores",
    precio: null,
    destacado: false,
    estado: "borrador",
    resumen:
      "Hélice sumergida que aspira aire y lo inyecta bajo el agua, mezclando el estanque en profundidad.",
    descripcion:
      "El aireador inyector (tipo aspirador) usa una hélice que gira bajo el agua y aspira aire a través de un tubo. Las burbujas salen por debajo de la superficie y la corriente que genera mezcla las capas del estanque.",
    imagenes: [
      { src: "assets/images/products/aireador-inyector.webp", alt: "Aireador flotante sobre plataforma en un estanque", ilustrativa: true }
    ],
    caracteristicas: [],
    specs: OXI_SPECS_PENDIENTES(),
    aplicaciones: [
      "Estanques con mayor profundidad",
      "Mezcla de capas de agua para evitar estratificación"
    ],
    ventajas: [],
    componentes: [],
    recomendaciones: []
  },

  /* ---------------------- SISTEMAS DE OXIGENACIÓN ---------------------- */
  {
    id: "soplador-regenerativo",
    nombre: "Soplador de aire (blower)",
    referencia: null,
    categoria: "oxigenacion",
    precio: null,
    destacado: true,
    estado: "borrador",
    resumen:
      "Equipo que suministra aire a baja presión para alimentar difusores en tanques y estanques.",
    descripcion:
      "El soplador produce un caudal continuo de aire que se distribuye por tubería hasta los difusores. Es el corazón de los sistemas de aireación por difusión en tanques circulares, alevinajes y sistemas de recirculación.",
    imagenes: [
      { src: "assets/images/products/soplador.webp", alt: "Soplador de canal lateral (blower) de aluminio, foto de estudio", ilustrativa: true, encuadre: "contain" }
    ],
    caracteristicas: [],
    specs: OXI_SPECS_PENDIENTES(),
    aplicaciones: [
      "Tanques circulares de levante y engorde",
      "Salas de alevinaje e incubación",
      "Sistemas de recirculación (RAS) y biofloc"
    ],
    ventajas: [],
    componentes: [],
    recomendaciones: []
  },
  {
    id: "difusor-de-disco",
    nombre: "Difusor de disco de burbuja fina",
    referencia: null,
    categoria: "oxigenacion",
    precio: null,
    destacado: false,
    estado: "borrador",
    resumen:
      "Membrana que divide el aire del soplador en burbujas finas para transferir más oxígeno al agua.",
    descripcion:
      "El difusor de disco se instala en el fondo del tanque o estanque y se conecta a la línea de aire. Su membrana perforada produce burbujas finas, que tienen más superficie de contacto con el agua que las burbujas gruesas.",
    imagenes: [
      { src: "assets/images/products/difusor-disco.webp", alt: "Difusor de disco produciendo burbuja fina dentro de un tanque", ilustrativa: true }
    ],
    caracteristicas: [],
    specs: OXI_SPECS_PENDIENTES(),
    aplicaciones: [
      "Fondo de tanques circulares",
      "Estanques profundos",
      "Sistemas de biofloc"
    ],
    ventajas: [],
    componentes: [],
    recomendaciones: []
  },
  {
    id: "manguera-difusora",
    nombre: "Manguera difusora microperforada",
    referencia: null,
    categoria: "oxigenacion",
    precio: null,
    destacado: false,
    estado: "borrador",
    resumen:
      "Manguera con microperforaciones que distribuye aire en línea a lo largo del tanque o estanque.",
    descripcion:
      "La manguera difusora se tiende en el fondo y se alimenta con un soplador. Libera burbujas a lo largo de todo su recorrido, lo que permite airear tanques y canales de forma uniforme.",
    imagenes: [
      { src: "assets/images/products/manguera-difusora.webp", alt: "Canal con aireación por difusión de burbujas desde el fondo", ilustrativa: true }
    ],
    caracteristicas: [],
    specs: OXI_SPECS_PENDIENTES(),
    aplicaciones: [
      "Tanques circulares y rectangulares",
      "Canales y estanques alargados",
      "Transporte y acopio de peces vivos"
    ],
    ventajas: [],
    componentes: [],
    recomendaciones: []
  },

  /* ---------------------- EQUIPOS PARA PISCICULTURA ---------------------- */
  {
    id: "medidor-oxigeno-disuelto",
    nombre: "Medidor de oxígeno disuelto",
    referencia: null,
    categoria: "piscicultura",
    precio: null,
    destacado: false,
    estado: "borrador",
    resumen:
      "Instrumento para medir el oxígeno disuelto y la temperatura del agua en campo.",
    descripcion:
      "Medir el oxígeno disuelto permite decidir cuándo encender los aireadores, ajustar la alimentación y detectar a tiempo condiciones de riesgo, sobre todo en la madrugada.",
    imagenes: [
      { src: "assets/images/products/medidor-oxigeno.webp", alt: "Medidor portátil de oxígeno disuelto con sonda", ilustrativa: true }
    ],
    caracteristicas: [],
    specs: OXI_SPECS_PENDIENTES(),
    aplicaciones: [
      "Monitoreo diario de estanques y tanques",
      "Control del encendido de aireadores",
      "Registro de calidad de agua"
    ],
    ventajas: [],
    componentes: [],
    recomendaciones: []
  },
  {
    id: "tablero-control-aireadores",
    nombre: "Tablero de control para aireadores",
    referencia: null,
    categoria: "piscicultura",
    precio: null,
    destacado: false,
    estado: "borrador",
    resumen:
      "Tablero eléctrico para arrancar, proteger y programar los aireadores de la finca.",
    descripcion:
      "El tablero concentra el arranque y la protección eléctrica de los aireadores. Según el diseño, puede incluir temporizadores o control según la medición de oxígeno para encenderlos solo cuando se necesitan.",
    imagenes: [
      { src: "assets/images/products/tablero-control.webp", alt: "Tablero eléctrico de control de motores con pulsadores de arranque y parada", ilustrativa: true }
    ],
    caracteristicas: [],
    specs: OXI_SPECS_PENDIENTES(),
    aplicaciones: [
      "Fincas con varios aireadores",
      "Programación del encendido nocturno",
      "Protección de motores eléctricos"
    ],
    ventajas: [],
    componentes: [],
    recomendaciones: []
  },
  {
    id: "alimentador-automatico",
    nombre: "Alimentador automático",
    referencia: null,
    categoria: "piscicultura",
    precio: null,
    destacado: false,
    estado: "borrador",
    resumen:
      "Equipo que distribuye el alimento balanceado en horarios y raciones programadas.",
    descripcion:
      "El alimentador automático entrega raciones de alimento a intervalos definidos. Ayuda a mantener la rutina de alimentación y a distribuir mejor el alimento en el estanque.",
    imagenes: [
      { src: "assets/images/products/alimentador-automatico.webp", alt: "Alimentador automático flotante en un estanque", ilustrativa: true },
      { src: "assets/images/products/alimentador-recarga.webp", alt: "Operario recargando un alimentador automático junto a un aireador", ilustrativa: true }
    ],
    caracteristicas: [],
    specs: OXI_SPECS_PENDIENTES(),
    aplicaciones: [
      "Estanques de engorde",
      "Tanques de levante",
      "Fincas con alimentación en varios horarios"
    ],
    ventajas: [],
    componentes: [],
    recomendaciones: []
  },

  /* ------------------------ TANQUES Y ESTRUCTURAS ------------------------ */
  {
    id: "tanque-circular-piscicultura",
    nombre: "Tanque circular para piscicultura",
    referencia: null,
    categoria: "tanques",
    precio: null,
    destacado: true,
    estado: "borrador",
    resumen:
      "Tanque de forma circular para levante y engorde con circulación y desagüe central.",
    descripcion:
      "La forma circular favorece que el agua gire y arrastre los sólidos hacia el desagüe central, lo que facilita la limpieza. Se usa en sistemas intensivos, biofloc y recirculación, donde se controla mejor el agua y la alimentación.",
    imagenes: [
      { src: "assets/images/products/tanque-circular.webp", alt: "Tanques circulares de piscicultura bajo cubierta", ilustrativa: true }
    ],
    caracteristicas: [],
    specs: OXI_SPECS_PENDIENTES(),
    aplicaciones: [
      "Levante de alevinos",
      "Engorde en sistemas intensivos",
      "Biofloc y recirculación"
    ],
    ventajas: [],
    componentes: [],
    recomendaciones: []
  },
  {
    id: "geomembrana-estanques",
    nombre: "Geomembrana para estanques",
    referencia: null,
    categoria: "tanques",
    precio: null,
    destacado: true,
    estado: "borrador",
    resumen:
      "Lámina impermeable para revestir estanques y reservorios y evitar pérdidas de agua por infiltración.",
    descripcion:
      "La geomembrana recubre el fondo y los taludes del estanque para retener el agua. Reduce la infiltración en suelos permeables y facilita la limpieza entre ciclos de producción.",
    imagenes: [
      { src: "assets/images/products/geomembrana.webp", alt: "Estanque en construcción revestido con geomembrana", ilustrativa: true }
    ],
    caracteristicas: [],
    specs: OXI_SPECS_PENDIENTES(),
    aplicaciones: [
      "Revestimiento de estanques en tierra",
      "Reservorios de agua",
      "Tanques en geomembrana con estructura"
    ],
    ventajas: [],
    componentes: [],
    recomendaciones: []
  },
  {
    id: "estructura-tanque",
    nombre: "Estructura para tanque en geomembrana",
    referencia: null,
    categoria: "tanques",
    precio: null,
    destacado: false,
    estado: "borrador",
    resumen:
      "Estructura perimetral que da forma y soporte a tanques circulares revestidos en geomembrana.",
    descripcion:
      "La estructura sostiene las paredes del tanque y la geomembrana interior. Permite montar tanques de distintos diámetros sobre terreno nivelado.",
    imagenes: [
      { src: "assets/images/products/estructura-tanque.webp", alt: "Tanques circulares con estructura metálica en una sala de cultivo", ilustrativa: true }
    ],
    caracteristicas: [],
    specs: OXI_SPECS_PENDIENTES(),
    aplicaciones: [
      "Tanques de levante y engorde",
      "Ampliación de capacidad sin excavar estanques"
    ],
    ventajas: [],
    componentes: [],
    recomendaciones: []
  },

  /* ---------------------- ACCESORIOS Y COMPONENTES ---------------------- */
  {
    id: "paletas-repuesto",
    nombre: "Paletas de repuesto para aireador",
    referencia: null,
    categoria: "accesorios",
    precio: null,
    destacado: false,
    estado: "borrador",
    resumen:
      "Paletas para el mantenimiento y la reposición en rotores de aireadores de paletas.",
    descripcion:
      "Las paletas se desgastan o se rompen con el uso. Tener repuestos permite devolver el aireador a operación sin detener la producción por mucho tiempo.",
    imagenes: [
      { src: "assets/images/products/paletas-repuesto.webp", alt: "Detalle de las paletas de un aireador en operación", ilustrativa: true }
    ],
    caracteristicas: [],
    specs: OXI_SPECS_PENDIENTES(),
    aplicaciones: ["Mantenimiento de aireadores de paletas"],
    ventajas: [],
    componentes: [],
    recomendaciones: []
  },
  {
    id: "flotadores-aireador",
    nombre: "Flotadores para aireador",
    referencia: null,
    categoria: "accesorios",
    precio: null,
    destacado: false,
    estado: "borrador",
    resumen:
      "Flotadores de reposición que mantienen el aireador a la altura correcta sobre el agua.",
    descripcion:
      "El flotador sostiene el motor y los rotores a la profundidad de trabajo adecuada. Un flotador en buen estado mantiene la eficiencia del aireador.",
    imagenes: [
      { src: "assets/images/products/flotadores-aireador.webp", alt: "Aireador de paletas sobre tres flotadores en un estanque", ilustrativa: true }
    ],
    caracteristicas: [],
    specs: OXI_SPECS_PENDIENTES(),
    aplicaciones: ["Reposición en aireadores de paletas y splash"],
    ventajas: [],
    componentes: [],
    recomendaciones: []
  },
  {
    id: "cable-sumergible",
    nombre: "Cable eléctrico para aireadores",
    referencia: null,
    categoria: "accesorios",
    precio: null,
    destacado: false,
    estado: "borrador",
    resumen:
      "Cable para la conexión de aireadores flotantes desde el tablero hasta el estanque.",
    descripcion:
      "La conexión eléctrica de equipos flotantes requiere un cable adecuado para la intemperie y el contacto con el agua, con el calibre según la potencia y la distancia.",
    imagenes: [
      { src: "assets/images/products/cable-aireadores.webp", alt: "Cable encauchetado multiconductor con terminales", ilustrativa: true }
    ],
    caracteristicas: [],
    specs: OXI_SPECS_PENDIENTES(),
    aplicaciones: ["Instalación de aireadores flotantes"],
    ventajas: [],
    componentes: [],
    recomendaciones: []
  }
];
