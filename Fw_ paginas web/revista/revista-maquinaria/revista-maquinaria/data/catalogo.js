/* =========================================================================
   DATOS DEL CATÁLOGO — ALQUILER DE MAQUINARIA PESADA
   -------------------------------------------------------------------------
   ⚠ DATOS DE PRUEBA
   - Negocio, contacto, cobertura, condiciones, ESPECIFICACIONES y TARIFAS:
     ficticios, solo para mostrar el diseño. El cliente debe entregar los reales.
   - Fotos: Wikimedia Commons con licencias libres (ver data/creditos.js).
     No son los equipos del cliente: reemplazarlas por fotos propias.
   ========================================================================= */

window.CATALOGO = {
  modoPrueba: false,

  negocio: {
    nombre: "MaquiAndes",
    subtitulo: "Alquiler de maquinaria pesada",
    eslogan: "Equipos listos para tu obra",
    descripcion:
      "Alquilamos maquinaria pesada para obras civiles, vías, movimiento de tierra y construcción. Equipos con o sin operador, por hora, día o mes, con transporte hasta tu obra.",
    tipoNegocio: "Alquiler de maquinaria pesada",
    publico: "Constructoras, contratistas, municipios y particulares",
    whatsapp: "+57 300 000 0000",
    whatsappLink: "https://wa.me/573000000000",
    telefono: "+57 300 000 0000",
    correo: null, // pendiente
    direccion: "Patio de maquinaria: Km 0 vía Ejemplo, Ciudad",
    cobertura: "Ciudad y municipios cercanos (zona de prueba)",
    instagram: "@maquiandes.demo",
    facebook: null,
    sitioWeb: null,
    nit: null, // pendiente
    horario: "Lunes a sábado · 7:00 a.m. – 5:00 p.m.",
    horarioSemana: { 0: null, 1: ["07:00", "17:00"], 2: ["07:00", "17:00"], 3: ["07:00", "17:00"], 4: ["07:00", "17:00"], 5: ["07:00", "17:00"], 6: ["07:00", "17:00"] },
    // ⚠ PRUEBA: el mapa apunta al centro de Bogotá solo para mostrar el diseño.
    ubicacion: { lat: null, lng: null, consultaMapa: "Bogotá, Colombia" },
    logo: "img/logo/logo-prueba.svg",
    moneda: "COP",
    fotoPortada: "img/equipos/exc-01.jpg",
    // Crédito del desarrollador en el pie del sitio web (poner null para quitarlo)
    creditoDesarrollador: { nombre: "SRUEDADev", url: "https://sruedadev.com", texto: "Páginas web que generan oportunidades" },
  },

  servicios: [
    { icono: "bi-person-badge", titulo: "Con operador", texto: "El equipo llega con su operador." },
    { icono: "bi-key", titulo: "Sin operador", texto: "Alquiler en seco para empresas con operador propio." },
    { icono: "bi-truck-flatbed", titulo: "Transporte a la obra", texto: "Llevamos y recogemos el equipo en cama baja." },
    { icono: "bi-calendar-week", titulo: "Por hora, día o mes", texto: "Tarifas según la duración de tu proyecto." },
  ],

  // Condiciones de alquiler — ⚠ TODAS DE PRUEBA, confirmar con el cliente
  condiciones: [
    { icono: "bi-hourglass-split", titulo: "Mínimo de alquiler", texto: "4 horas por servicio con operador." },
    { icono: "bi-sun", titulo: "Jornada diaria", texto: "La tarifa por día corresponde a 8 horas de trabajo." },
    { icono: "bi-fuel-pump", titulo: "Combustible", texto: "Incluido en alquiler con operador. En alquiler sin operador corre por cuenta del cliente." },
    { icono: "bi-truck-flatbed", titulo: "Transporte", texto: "Se cotiza según la distancia a la obra." },
    { icono: "bi-file-earmark-text", titulo: "Documentos", texto: "Para alquiler sin operador se firma contrato y se deja depósito." },
    { icono: "bi-receipt", titulo: "Precios", texto: "Tarifas de referencia. El valor final se confirma en la cotización." },
  ],

  categorias: [
    { id: "excavadoras", nombre: "Excavadoras", icono: "bi-minecart-loaded", intro: "Excavación, zanjas y cimentaciones." },
    { id: "retroexcavadoras", nombre: "Retroexcavadoras", icono: "bi-cone-striped", intro: "Excavar y cargar con un solo equipo." },
    { id: "cargadores", nombre: "Cargadores", icono: "bi-box-seam", intro: "Carga de material y movimiento de tierra." },
    { id: "motoniveladoras", nombre: "Motoniveladoras", icono: "bi-signpost-split", intro: "Perfilado y nivelación de vías." },
    { id: "compactadores", nombre: "Compactadores", icono: "bi-record-circle", intro: "Compactación de suelos y asfalto." },
    { id: "volquetas", nombre: "Volquetas", icono: "bi-truck", intro: "Transporte de material." },
  ],

  // especificaciones y tarifas: ⚠ VALORES DE PRUEBA (no corresponden a la máquina de la foto)
  equipos: [
    { ref: "EXC-01", categoria: "excavadoras", nombre: "Excavadora sobre orugas 22 t", foto: "img/equipos/exc-01.jpg",
      descripcion: "Para excavaciones grandes, zanjas, cimentaciones y cargue de volquetas.",
      especificaciones: [["Peso operativo", "22 t"], ["Potencia", "160 hp"], ["Cucharón", "1,1 m³"], ["Prof. de excavación", "6,5 m"]],
      tarifas: { hora: 190000, dia: 1400000, mes: 26000000 }, operador: "Opcional", disponible: true, destacado: true },
    { ref: "EXC-02", categoria: "excavadoras", nombre: "Miniexcavadora 3 t", foto: "img/equipos/exc-02.jpg",
      descripcion: "Compacta, para espacios reducidos, redes de servicios y obras urbanas.",
      especificaciones: [["Peso operativo", "3 t"], ["Potencia", "24 hp"], ["Cucharón", "0,08 m³"], ["Prof. de excavación", "2,8 m"]],
      tarifas: { hora: 110000, dia: 780000, mes: 14500000 }, operador: "Opcional", disponible: true, destacado: false },

    { ref: "RET-01", categoria: "retroexcavadoras", nombre: "Retroexcavadora 4x4", foto: "img/equipos/ret-01.jpg",
      descripcion: "Cucharón frontal y brazo trasero: excava, carga y nivela en la misma obra.",
      especificaciones: [["Peso operativo", "8 t"], ["Potencia", "95 hp"], ["Cucharón frontal", "1,0 m³"], ["Prof. de excavación", "4,3 m"]],
      tarifas: { hora: 130000, dia: 950000, mes: 18000000 }, operador: "Incluido", disponible: true, destacado: true },
    { ref: "RET-02", categoria: "retroexcavadoras", nombre: "Retroexcavadora 4x4 (unidad 2)", foto: "img/equipos/ret-02.jpg",
      descripcion: "Para zanjas, redes de alcantarillado, mantenimiento vial y cargue de material.",
      especificaciones: [["Peso operativo", "8 t"], ["Potencia", "92 hp"], ["Cucharón frontal", "1,0 m³"], ["Prof. de excavación", "4,2 m"]],
      tarifas: { hora: 130000, dia: 950000, mes: 18000000 }, operador: "Incluido", disponible: false, destacado: false },

    { ref: "CAR-01", categoria: "cargadores", nombre: "Cargador frontal 18 t", foto: "img/equipos/car-01.jpg",
      descripcion: "Cargue de volquetas, acopio y movimiento de material en patios y canteras.",
      especificaciones: [["Peso operativo", "18 t"], ["Potencia", "195 hp"], ["Cucharón", "3,1 m³"], ["Altura de descarga", "2,9 m"]],
      tarifas: { hora: 200000, dia: 1500000, mes: 28000000 }, operador: "Incluido", disponible: true, destacado: true },
    { ref: "CAR-02", categoria: "cargadores", nombre: "Cargador compacto", foto: "img/equipos/car-02.jpg",
      descripcion: "Ágil para obras urbanas, mantenimiento y manejo de agregados.",
      especificaciones: [["Peso operativo", "6 t"], ["Potencia", "74 hp"], ["Cucharón", "1,0 m³"], ["Altura de descarga", "2,6 m"]],
      tarifas: { hora: 120000, dia: 880000, mes: 16500000 }, operador: "Opcional", disponible: true, destacado: false },
    { ref: "CAR-03", categoria: "cargadores", nombre: "Minicargador de orugas", foto: "img/equipos/car-03.jpg",
      descripcion: "Trabaja en terrenos blandos y espacios estrechos; ideal para limpieza y adecuaciones.",
      especificaciones: [["Peso operativo", "4,5 t"], ["Potencia", "74 hp"], ["Capacidad de carga", "1 t"], ["Ancho", "1,8 m"]],
      tarifas: { hora: 100000, dia: 720000, mes: 13500000 }, operador: "Opcional", disponible: true, destacado: false },

    { ref: "MOT-01", categoria: "motoniveladoras", nombre: "Motoniveladora 140 hp", foto: "img/equipos/mot-01.jpg",
      descripcion: "Perfilado de vías, conformación de taludes y nivelación de terrenos.",
      especificaciones: [["Peso operativo", "15 t"], ["Potencia", "140 hp"], ["Ancho de cuchilla", "3,7 m"], ["Escarificador", "Sí"]],
      tarifas: { hora: 210000, dia: 1550000, mes: null }, operador: "Incluido", disponible: true, destacado: false },
    { ref: "MOT-02", categoria: "motoniveladoras", nombre: "Motoniveladora para vías", foto: "img/equipos/mot-02.jpg",
      descripcion: "Mantenimiento de vías terciarias y conformación de subrasante.",
      especificaciones: [["Peso operativo", "14 t"], ["Potencia", "130 hp"], ["Ancho de cuchilla", "3,6 m"], ["Escarificador", "Sí"]],
      tarifas: { hora: 200000, dia: 1480000, mes: null }, operador: "Incluido", disponible: true, destacado: false },

    { ref: "COM-01", categoria: "compactadores", nombre: "Vibrocompactador doble tambor 10 t", foto: "img/equipos/com-01.jpg",
      descripcion: "Compactación de carpeta asfáltica y bases granulares.",
      especificaciones: [["Peso operativo", "10 t"], ["Potencia", "130 hp"], ["Ancho de tambor", "1,7 m"], ["Vibración", "Doble tambor"]],
      tarifas: { hora: 160000, dia: 1150000, mes: 21000000 }, operador: "Incluido", disponible: true, destacado: false },
    { ref: "COM-02", categoria: "compactadores", nombre: "Compactador de rodillo para asfalto", foto: "img/equipos/com-02.jpg",
      descripcion: "Para parcheo, andenes, parqueaderos y vías de bajo tráfico.",
      especificaciones: [["Peso operativo", "2,5 t"], ["Potencia", "33 hp"], ["Ancho de tambor", "1,2 m"], ["Vibración", "Doble tambor"]],
      tarifas: { hora: 95000, dia: 690000, mes: 12500000 }, operador: "Opcional", disponible: true, destacado: false },

    { ref: "VOL-01", categoria: "volquetas", nombre: "Dumper de obra 3 t", foto: "img/equipos/vol-01.jpg",
      descripcion: "Traslado de material dentro de la obra, en espacios donde no entra una volqueta.",
      especificaciones: [["Capacidad", "3 t"], ["Tracción", "4x4"], ["Descarga", "Frontal"], ["Potencia", "35 hp"]],
      tarifas: { hora: 70000, dia: 500000, mes: 9500000 }, operador: "Opcional", disponible: true, destacado: false },
    { ref: "VOL-02", categoria: "volquetas", nombre: "Volqueta 4 ejes 16 m³", foto: "img/equipos/vol-02.jpg",
      descripcion: "Transporte de material de excavación, agregados y escombros.",
      especificaciones: [["Capacidad", "16 m³"], ["Ejes", "4 (8x4)"], ["Potencia", "420 hp"], ["Descarga", "Trasera"]],
      tarifas: { hora: null, dia: 1300000, mes: null }, operador: "Incluido", disponible: true, destacado: true },
  ],
};
