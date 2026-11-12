/* =========================================================================
   DATOS DE LA CARTA — MESA DORADA
   -------------------------------------------------------------------------
   ⚠ DATOS DE PRUEBA
   - Negocio, contacto, horarios y PRECIOS: ficticios.
   - Fotos e ingredientes: TheMealDB / TheCocktailDB (data/fuentes/resumen.json).
     NO son fotos del restaurante: reemplazarlas por fotografías reales.
   - Las descripciones solo mencionan ingredientes que aparecen en la fuente.
   ========================================================================= */

window.CATALOGO = {
  modoPrueba: false,

  negocio: {
    nombre: "Mesa Dorada",
    subtitulo: "Bistró & cocina de autor",
    eslogan: "Recetas de la casa, hechas con calma",
    descripcion:
      "Un bistró para sentarse sin prisa: platos clásicos preparados a diario, pastas, carnes y postres de la casa. Ven a la mesa o pide para llevar.",
    tipoComida: "Cocina internacional de bistró",
    publico: "Parejas, familias y celebraciones",
    whatsapp: "+57 300 000 0000",
    whatsappLink: "https://wa.me/573000000000",
    direccion: "Calle 00 # 00-00, Barrio Ejemplo, Ciudad",
    instagram: "@mesadorada.demo",
    sitioWeb: null, // pendiente
    horario: "Martes a domingo · 12:00 m. – 10:00 p.m.",
    reservas: "Reservas por WhatsApp",
    logo: "img/logo/logo-prueba.svg",
    moneda: "COP",
    fotoPortada: "img/productos/cas-03.jpg",

    /* ---- Datos que usa la página web (sitio.html) ---- */
    servicios: ["Para llevar", "Domicilios"], // opciones de entrega del carrito
    // Horario por día (0 = domingo … 6 = sábado). null = cerrado. Formato 24 h.
    horarioSemana: { 0: ["12:00", "22:00"], 1: null, 2: ["12:00", "22:00"], 3: ["12:00", "22:00"], 4: ["12:00", "22:00"], 5: ["12:00", "22:00"], 6: ["12:00", "22:00"] },
    // Reservas: intervalo entre horas (min), última reserva antes del cierre (min) y máximo de personas
    reservasConfig: { intervalo: 30, ultimaAntesDeCierre: 90, maxPersonas: 20, anticipacionDias: 60 },
    ocasiones: ["Cumpleaños", "Aniversario", "Reunión de trabajo", "Cita", "Otra"],
    // ⚠ PRUEBA: el mapa apunta al centro de Bogotá solo para mostrar el diseño.
    ubicacion: { lat: null, lng: null, consultaMapa: "Bogotá, Colombia", referencia: null },
    mediosPago: null, // pendiente
    zonaDomicilio: null, // pendiente
    linkResenasGoogle: null, // pendiente
    facebook: null,
    creditoDesarrollador: null, // ej. { nombre: "SRUEDADev", url: "https://sruedadev.com" }
  },

  paleta: { naranja: "#F58F19", cafe: "#8A4A17", gris: "#E8E8E8", crema: "#FCEBD4", texto: "#333333" },

  // diseno: "lista" (página gris, fotos redondas con pestaña) | "arcos" (página crema, fotos en arco, 3 columnas)
  categorias: [
    { id: "favoritos", nombre: "Favoritos de nuestros clientes", corto: "Favoritos", diseno: "lista",
      intro: "Los que más piden nuestros clientes y repiten en cada visita." },
    { id: "casa", nombre: "Creaciones de la casa", corto: "Platos fuertes", diseno: "arcos", marca: true,
      intro: "Nuestros platos principales, preparados al momento." },
    { id: "entradas", nombre: "Para empezar", corto: "Entradas", diseno: "lista",
      intro: "Sopas, ensaladas y entradas para abrir el apetito." },
    { id: "postres", nombre: "Postres", corto: "Postres", diseno: "arcos",
      intro: "El final dulce de la mesa." },
    { id: "bebidas", nombre: "Bebidas", corto: "Bebidas", diseno: "lista",
      intro: "Batidos naturales, té y limonada." },
  ],

  productos: [
    // --- Favoritos ---
    { ref: "FAV-01", categoria: "favoritos", nombre: "Hamburguesa de cordero", foto: "img/productos/fav-01.jpg",
      descripcion: "Carne de cordero con bulgur, comino y páprika, en pan con salsa de yogur griego, pepino y menta.",
      precio: 34000, disponible: true, destacado: true },
    { ref: "FAV-02", categoria: "favoritos", nombre: "Yuca crocante", foto: "img/productos/fav-02.jpg",
      descripcion: "Yuca al horno con ají en polvo, servida con salsa de aguacate, crema agria, limón y cilantro.",
      precio: 16000, disponible: true, destacado: false },
    { ref: "FAV-03", categoria: "favoritos", nombre: "Sándwich cubano", foto: "img/productos/fav-03.jpg",
      descripcion: "Cerdo marinado en naranja y limón con jamón, queso suizo, pepinillos y mostaza Dijon en pan cubano.",
      precio: 29000, disponible: true, destacado: false },
    { ref: "FAV-04", categoria: "favoritos", nombre: "Ensalada de salmón y aguacate", foto: "img/productos/fav-04.jpg",
      descripcion: "Salmón con aguacate, pepino, espinaca y menta, aderezada con limón, miel y aceite de oliva.",
      precio: 36000, disponible: true, destacado: false },

    // --- Entradas ---
    { ref: "ENT-01", categoria: "entradas", nombre: "Sopa de cebolla gratinada", foto: "img/productos/ent-01.jpg",
      descripcion: "Cebolla caramelizada en caldo de res con vino blanco, gratinada con pan y queso gruyère.",
      precio: 22000, disponible: true, destacado: false },
    { ref: "ENT-02", categoria: "entradas", nombre: "Bisque de langostinos", foto: "img/productos/ent-02.jpg",
      descripcion: "Crema de langostinos con hinojo, tomate, vino blanco y un toque de brandy.",
      precio: 28000, disponible: true, destacado: false },
    { ref: "ENT-03", categoria: "entradas", nombre: "Ensalada shopska", foto: "img/productos/ent-03.jpg",
      descripcion: "Pepino, tomate, cebolla roja y pimentón verde con queso feta, perejil y aceite de oliva.",
      precio: 19000, disponible: true, destacado: false },
    { ref: "ENT-04", categoria: "entradas", nombre: "Huevos Benedict con salmón", foto: "img/productos/ent-04.jpg",
      descripcion: "Muffin inglés con salmón ahumado, huevo pochado y salsa holandesa de mantequilla y limón.",
      precio: 27000, disponible: true, destacado: false },

    // --- Creaciones de la casa ---
    { ref: "CAS-01", categoria: "casa", nombre: "Pizza margarita", foto: "img/productos/cas-01.jpg",
      descripcion: "Masa artesanal, passata de tomate, mozzarella, orégano y albahaca.",
      precio: 38000, disponible: true, destacado: false },
    { ref: "CAS-02", categoria: "casa", nombre: "Fettuccine Alfredo", foto: "img/productos/cas-02.jpg",
      descripcion: "Pasta en salsa de crema, mantequilla y parmesano, con perejil y pimienta.",
      precio: 35000, disponible: true, destacado: true },
    { ref: "CAS-03", categoria: "casa", nombre: "Lomo a la Diana", foto: "img/productos/cas-03.jpg",
      descripcion: "Lomo de res con salsa de champiñones, chalotas, brandy, crema y mostaza Dijon.",
      precio: 58000, disponible: true, destacado: true },
    { ref: "CAS-04", categoria: "casa", nombre: "Risotto de salmón y langostinos", foto: "img/productos/cas-04.jpg",
      descripcion: "Arroz cremoso con vino blanco, salmón, langostinos, espárragos, limón y parmesano.",
      precio: 52000, disponible: true, destacado: false },
    { ref: "CAS-05", categoria: "casa", nombre: "Pollo Marengo", foto: "img/productos/cas-05.jpg",
      descripcion: "Pierna de pollo en salsa de tomate con champiñones, aceitunas negras y perejil.",
      precio: 39000, disponible: true, destacado: false },
    { ref: "CAS-06", categoria: "casa", nombre: "Lasaña de la casa", foto: "img/productos/cas-06.jpg",
      descripcion: "Capas de pasta con carne de res y tocineta en salsa de tomate, mozzarella y parmesano.",
      precio: 37000, disponible: false, destacado: false },

    // --- Postres ---
    { ref: "POS-01", categoria: "postres", nombre: "Brownie con frambuesas", foto: "img/productos/pos-01.jpg",
      descripcion: "Chocolate oscuro y de leche con cacao y frambuesas.",
      precio: 15000, disponible: true, destacado: false },
    { ref: "POS-02", categoria: "postres", nombre: "Tarta Tatin", foto: "img/productos/pos-02.jpg",
      descripcion: "Manzanas caramelizadas sobre hojaldre, con crème fraîche.",
      precio: 17000, disponible: true, destacado: false },
    { ref: "POS-03", categoria: "postres", nombre: "Tarta de fresas", foto: "img/productos/pos-03.jpg",
      descripcion: "Base de mazapán y chocolate, crema pastelera y fresas frescas con menta.",
      precio: 18000, disponible: true, destacado: false },
    { ref: "POS-04", categoria: "postres", nombre: "Pancakes de banano", foto: "img/productos/pos-04.jpg",
      descripcion: "Pancakes de banano y huevo con nueces pecanas y frambuesas.",
      precio: 16000, disponible: true, destacado: false },
    { ref: "POS-05", categoria: "postres", nombre: "Tarta de melaza", foto: "img/productos/pos-05.jpg",
      descripcion: "Tarta inglesa de jarabe dorado con limón.",
      precio: 15000, disponible: true, destacado: false },
    { ref: "POS-06", categoria: "postres", nombre: "Tarta Bakewell", foto: "img/productos/pos-06.jpg",
      descripcion: "Masa quebrada con mermelada de frambuesa y crema de almendras.",
      precio: null, disponible: true, destacado: false }, // precio pendiente (prueba)

    // --- Bebidas ---
    { ref: "BEB-01", categoria: "bebidas", nombre: "Batido de kiwi y papaya", foto: "img/productos/beb-01.jpg",
      descripcion: "Kiwi y papaya naturales.",
      precio: 12000, disponible: true, destacado: false },
    { ref: "BEB-02", categoria: "bebidas", nombre: "Batido de mango y naranja", foto: "img/productos/beb-02.jpg",
      descripcion: "Mango y naranja naturales.",
      precio: 12000, disponible: true, destacado: false },
    { ref: "BEB-03", categoria: "bebidas", nombre: "Té tailandés helado", foto: "img/productos/beb-03.jpg",
      descripcion: "Té frío con leche condensada y menta.",
      precio: 11000, disponible: true, destacado: false },
    { ref: "BEB-04", categoria: "bebidas", nombre: "Limonada de lima", foto: "img/productos/beb-04.jpg",
      descripcion: "Lima, azúcar y soda.",
      precio: 9000, disponible: true, destacado: false },
  ],
};
