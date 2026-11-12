/* =========================================================================
   DATOS DEL MENÚ — REVISTA BURGER
   -------------------------------------------------------------------------
   ⚠ DATOS DE PRUEBA
   - Negocio, contacto, horarios y PRECIOS: ficticios.
   - Fotos e ingredientes: TheMealDB / TheCocktailDB (data/fuentes/resumen.json).
     NO son fotos del restaurante: reemplazar por fotografías reales.
   - Las descripciones solo mencionan ingredientes que aparecen en la fuente.
   ========================================================================= */

window.CATALOGO = {
  modoPrueba: true,

  negocio: {
    nombre: "Humo & Pan",
    subtitulo: "Burger Bar",
    eslogan: "Hamburguesas a la plancha, hechas al momento",
    descripcion:
      "Hamburguesería de barrio: carne a la plancha, pan dorado y salsas de la casa. Pide en la barra, por WhatsApp o llévatela a casa.",
    tipoComida: "Hamburguesas, sándwiches y acompañamientos",
    publico: "Jóvenes, familias y grupos de amigos",
    whatsapp: "+57 300 000 0000",
    whatsappLink: "https://wa.me/573000000000",
    direccion: "Calle 00 # 00-00, Barrio Ejemplo, Ciudad",
    instagram: "@humoypan.demo",
    sitioWeb: null, // pendiente
    horario: "Martes a domingo · 12:00 m. – 10:00 p.m.",
    servicios: ["Domicilios", "Para llevar", "En el local"],
    etiquetasPortada: ["Res", "Pollo", "Veggie"],
    logo: "img/logo/logo-prueba.svg",
    moneda: "COP",
    fotoPortada: "img/productos/ham-02.jpg",

    /* ---- Datos que usa la página web (sitio.html) ---- */
    // Horario por día (0 = domingo … 6 = sábado). null = cerrado. Formato 24 h.
    horarioSemana: {
      0: ["12:00", "22:00"],
      1: null,
      2: ["12:00", "22:00"],
      3: ["12:00", "22:00"],
      4: ["12:00", "22:00"],
      5: ["12:00", "22:00"],
      6: ["12:00", "22:00"],
    },
    // Ubicación para el mapa. Si hay lat/lng se usan; si no, se busca "consultaMapa" o la dirección.
    // ⚠ PRUEBA: el mapa apunta al centro de Bogotá solo para mostrar el diseño.
    ubicacion: { lat: null, lng: null, consultaMapa: "Bogotá, Colombia", referencia: null },
    mediosPago: null, // pendiente, ej.: ["Efectivo", "Nequi", "Daviplata", "Tarjeta débito/crédito"]
    zonaDomicilio: null, // pendiente, ej.: "Barrios A, B y C · domicilio desde $3.000"
    linkResenasGoogle: null, // pendiente: enlace de la ficha de Google Maps para dejar reseña
    facebook: null, // opcional
    tiktok: null, // opcional
  },

  paleta: {
    negro: "#151515",
    kraft: "#BEA885",
    blanco: "#FFFFFF",
    acento: "#D9A441",
    texto: "#1A1A1A",
  },

  // panel: "blanco" | "negro" — estilo del recuadro de la sección, como en la referencia
  categorias: [
    { id: "hamburguesas", nombre: "Hamburguesas", panel: "blanco", intro: "Carne, pan y salsa de la casa." },
    { id: "sandwiches", nombre: "Sándwiches", panel: "negro", intro: "Para los que vienen con hambre." },
    { id: "acompanamientos", nombre: "Acompañamientos", panel: "blanco", intro: "Para compartir en la mesa." },
    { id: "postres", nombre: "Postres", panel: "negro", intro: "El cierre dulce." },
    { id: "bebidas", nombre: "Bebidas", panel: "negro", intro: "Batidos, limonadas y café." },
  ],

  productos: [
    // --- Hamburguesas ---
    { ref: "HAM-01", categoria: "hamburguesas", nombre: "La Aussie", foto: "img/productos/ham-01.jpg",
      descripcion: "Carne de res magra con remolacha, rúgula y dip de crema agria con cebollín, en pan naan.",
      ingredientes: ["Carne de res", "Remolacha", "Pan naan", "Rúgula", "Dip de crema agria y cebollín"],
      precio: 27000, disponible: true, destacado: false },
    { ref: "HAM-02", categoria: "hamburguesas", nombre: "Doble Clásica", foto: "img/productos/ham-02.jpg",
      descripcion: "Doble carne de res en pan con ajonjolí, queso, lechuga, pepinillos y salsa de la casa.",
      ingredientes: ["Carne de res", "Pan con ajonjolí", "Queso", "Lechuga", "Pepinillos", "Cebolla", "Mayonesa", "Mostaza"],
      precio: 29000, disponible: true, destacado: true },
    { ref: "HAM-03", categoria: "hamburguesas", nombre: "Cordero Tzatziki", foto: "img/productos/ham-03.jpg",
      descripcion: "Carne de cordero con bulgur y especias, salsa de yogur griego con pepino y menta.",
      ingredientes: ["Cordero", "Bulgur", "Comino", "Cilantro", "Páprika", "Ajo", "Pepino", "Yogur griego", "Menta"],
      precio: 32000, disponible: true, destacado: false },
    { ref: "HAM-04", categoria: "hamburguesas", nombre: "Pollo picante", foto: "img/productos/ham-04.jpg",
      descripcion: "Pechuga de pollo con salsa picante y limón, queso, repollo, lechuga y pimentón rojo.",
      ingredientes: ["Pechuga de pollo", "Salsa picante", "Limón", "Queso", "Repollo", "Mayonesa", "Crema agria", "Lechuga", "Pimentón rojo"],
      precio: 26000, disponible: true, destacado: true },
    { ref: "HAM-05", categoria: "hamburguesas", nombre: "Kofta en pita", foto: "img/productos/ham-05.jpg",
      descripcion: "Kofta de cordero con garam masala en pan pita, con tomate, repollo morado y yogur.",
      ingredientes: ["Cordero", "Cebolla", "Ajo", "Garam masala", "Cilantro", "Salsa de ají", "Pan pita", "Tomate", "Repollo morado", "Yogur"],
      precio: 28000, disponible: true, destacado: false },
    { ref: "HAM-06", categoria: "hamburguesas", nombre: "Crispy Chicken", foto: "img/productos/ham-06.jpg",
      descripcion: "Pechuga de pollo marinada y apanada con páprika y cayena, en pan con ajonjolí.",
      ingredientes: ["Pechuga de pollo", "Jugo de pepinillo", "Huevo", "Leche", "Harina", "Páprika", "Ajo en polvo", "Cayena", "Pan con ajonjolí"],
      precio: 25000, disponible: true, destacado: true },

    // --- Sándwiches ---
    { ref: "SAN-01", categoria: "sandwiches", nombre: "Cubano", foto: "img/productos/san-01.jpg",
      descripcion: "Cerdo marinado en naranja y limón, jamón, queso suizo y pepinillos en pan cubano.",
      ingredientes: ["Chuleta de cerdo", "Naranja", "Limón", "Orégano", "Mostaza Dijon", "Mayonesa", "Pan cubano", "Queso suizo", "Jamón", "Pepinillos"],
      precio: 26000, disponible: true, destacado: false },
    { ref: "SAN-02", categoria: "sandwiches", nombre: "Chivito", foto: "img/productos/san-02.jpg",
      descripcion: "Lomo de res, tocineta, jamón, mozzarella, huevo, tomate y lechuga con chimichurri.",
      ingredientes: ["Lomo de res", "Tocineta", "Jamón", "Mozzarella", "Huevo", "Tomate", "Lechuga", "Mostaza", "Chimichurri"],
      precio: 31000, disponible: true, destacado: false },
    { ref: "SAN-03", categoria: "sandwiches", nombre: "Falafel", foto: "img/productos/san-03.jpg",
      descripcion: "Falafel en pan pita con salsa de tahini, vegetales frescos y harissa.",
      ingredientes: ["Falafel", "Tahini", "Limón", "Ajo", "Pan pita", "Lechuga", "Tomate", "Pepino", "Pepinillos", "Cebolla roja", "Harissa"],
      precio: 23000, disponible: true, destacado: false },

    // --- Acompañamientos ---
    { ref: "ACO-01", categoria: "acompanamientos", nombre: "Yuca fries", foto: "img/productos/aco-01.jpg",
      descripcion: "Yuca al horno con ají en polvo, con salsa de aguacate, crema agria y cilantro.",
      ingredientes: ["Yuca", "Aceite de oliva", "Ají en polvo", "Aguacate", "Crema agria", "Limón", "Cilantro"],
      precio: 12000, disponible: true, destacado: false },
    { ref: "ACO-02", categoria: "acompanamientos", nombre: "Alitas crispy", foto: "img/productos/aco-02.jpg",
      descripcion: "Alitas de pollo extra crocantes con ajo y cúrcuma.",
      ingredientes: ["Alitas de pollo", "Pimienta negra", "Ajo en polvo", "Cúrcuma", "Almidón de yuca"],
      precio: 22000, disponible: true, destacado: false },
    { ref: "ACO-03", categoria: "acompanamientos", nombre: "Pollo karaage", foto: "img/productos/aco-03.jpg",
      descripcion: "Pollo frito al estilo japonés marinado en jengibre, ajo, soya y sake, con limón.",
      ingredientes: ["Pollo", "Jengibre", "Ajo", "Salsa de soya", "Sake", "Fécula de papa", "Limón"],
      precio: 19000, disponible: true, destacado: false },
    { ref: "ACO-04", categoria: "acompanamientos", nombre: "Ensalada de papa", foto: "img/productos/aco-04.jpg",
      descripcion: "Papa nueva con espárragos, rábano, cebolla roja y cebollín en aderezo cremoso.",
      ingredientes: ["Papa", "Espárragos", "Cebollín", "Cebolla roja", "Rábano", "Crème fraîche", "Mayonesa", "Mostaza Dijon"],
      precio: 11000, disponible: false, destacado: false },

    // --- Postres ---
    { ref: "POS-01", categoria: "postres", nombre: "Brownie con frambuesa", foto: "img/productos/pos-01.jpg",
      descripcion: "Brownie de chocolate oscuro y de leche con frambuesas.",
      ingredientes: ["Chocolate oscuro", "Chocolate de leche", "Mantequilla", "Azúcar morena", "Huevos", "Harina", "Cacao", "Frambuesas"],
      precio: 12000, disponible: true, destacado: false },
    { ref: "POS-02", categoria: "postres", nombre: "Cheesecake New York", foto: "img/productos/pos-02.jpg",
      descripcion: "Cheesecake horneado de queso crema con limón y cubierta de crema agria.",
      ingredientes: ["Queso crema", "Crema agria", "Mantequilla", "Azúcar", "Harina", "Limón", "Huevos"],
      precio: 14000, disponible: true, destacado: false },
    { ref: "POS-03", categoria: "postres", nombre: "Cheesecake de maní", foto: "img/productos/pos-03.jpg",
      descripcion: "Cheesecake frío de mantequilla de maní con base de galleta y crocante de maní.",
      ingredientes: ["Galletas de maní", "Mantequilla", "Ricotta", "Mantequilla de maní", "Crema de leche", "Crocante de maní"],
      precio: 14000, disponible: true, destacado: false },

    // --- Bebidas ---
    { ref: "BEB-01", categoria: "bebidas", nombre: "Malteada de banano", foto: "img/productos/beb-01.jpg",
      descripcion: "Banano batido con leche y jugo de naranja.",
      ingredientes: ["Banano", "Leche", "Jugo de naranja", "Almíbar"],
      precio: 12000, disponible: true, destacado: false },
    { ref: "BEB-02", categoria: "bebidas", nombre: "Batido de frutas", foto: "img/productos/beb-02.jpg",
      descripcion: "Yogur batido con banano, fruta y jugo de naranja.",
      ingredientes: ["Yogur", "Banano", "Jugo de naranja", "Fruta", "Hielo"],
      precio: 11000, disponible: true, destacado: false },
    { ref: "BEB-03", categoria: "bebidas", nombre: "Limonada soda", foto: "img/productos/beb-03.jpg",
      descripcion: "Limón y soda con cáscara de limón.",
      ingredientes: ["Limón", "Azúcar", "Soda"],
      precio: 8000, disponible: true, destacado: false },
    { ref: "BEB-04", categoria: "bebidas", nombre: "Naranjada", foto: "img/productos/beb-04.jpg",
      descripcion: "Jugo de naranja y limón con soda.",
      ingredientes: ["Jugo de naranja", "Jugo de limón", "Almíbar", "Soda"],
      precio: 8000, disponible: true, destacado: false },
    { ref: "BEB-05", categoria: "bebidas", nombre: "Café helado", foto: "img/productos/beb-05.jpg",
      descripcion: "Café frío con leche.",
      ingredientes: ["Café", "Leche", "Azúcar"],
      precio: 9000, disponible: true, destacado: false },
    { ref: "BEB-06", categoria: "bebidas", nombre: "Chocolate caliente", foto: "img/productos/beb-06.jpg",
      descripcion: "Chocolate en leche.",
      ingredientes: ["Chocolate", "Leche"],
      precio: null, disponible: true, destacado: false }, // precio pendiente (prueba)
  ],
};
