/* =========================================================================
   DATOS DEL CATÁLOGO
   -------------------------------------------------------------------------
   ⚠ DATOS DE PRUEBA — Todo el contenido de este archivo es ficticio y sirve
   únicamente para validar el diseño y la paginación. Reemplazar por la
   información real del cliente antes de publicar en Heyzine.

   Reglas para la carga real:
   - Precios: copiar EXACTAMENTE el valor entregado por el cliente.
   - Fotos: colocar el archivo real en img/productos/ y actualizar "foto".
   - Si un dato no existe, dejar null: el catálogo mostrará "PENDIENTE".
   ========================================================================= */

window.CATALOGO = {
  modoPrueba: false,

  negocio: {
    nombre: "La Casona del Sabor",
    eslogan: "Cocina casera colombiana",
    descripcion:
      "Restaurante familiar de cocina tradicional colombiana. Preparamos recetas de la casa con ingredientes frescos, en porciones generosas y con atención cercana.",
    tipoComida: "Cocina tradicional colombiana",
    publico: "Familias, trabajadores de la zona y grupos de amigos",
    whatsapp: "+57 300 000 0000",
    whatsappLink: "https://wa.me/573000000000",
    direccion: "Calle 00 # 00-00, Barrio Ejemplo, Ciudad",
    instagram: "@lacasonadelsabor.demo",
    sitioWeb: null, // pendiente: el cliente no ha confirmado si tiene sitio web
    horario: null, // pendiente
    logo: "img/logo/logo-casona.png",
    moneda: "COP",
  },

  // Paleta propuesta (de prueba). Cambiar aquí y en css/catalogo.css (:root).
  paleta: {
    principal: "#7A2E1F",
    secundario: "#E9B44C",
    acento: "#3E6B48",
    fondo: "#FBF6EE",
    texto: "#2B2118",
  },

  categorias: [
    { id: "entradas", nombre: "Entradas", icono: "bi-egg-fried", intro: "Para abrir el apetito y compartir en la mesa." },
    { id: "sopas", nombre: "Sopas y caldos", icono: "bi-cup-hot", intro: "Recetas de olla, como en casa." },
    { id: "tipicos", nombre: "Platos típicos", icono: "bi-fire", intro: "Los platos de la casa, servidos en porción completa." },
    { id: "carnes", nombre: "Carnes", icono: "bi-grid-3x3", intro: "Cortes de res en salsa y a la parrilla." },
    { id: "pescados", nombre: "Pescados y mariscos", icono: "bi-water", intro: "Del río y del mar." },
    { id: "postres", nombre: "Postres", icono: "bi-cake2", intro: "El cierre dulce de la comida." },
    { id: "bebidas", nombre: "Bebidas", icono: "bi-cup-straw", intro: "Jugos naturales y bebidas para acompañar." },
  ],

  /* Fotos: originales en img/ (por nombre de plato), optimizadas en img/productos/ con la ref.
     Descripciones escritas según lo que se ve en cada foto: el cliente debe confirmarlas.
     Precios: de prueba. */
  productos: [
    // --- Entradas ---
    { ref: "ENT-01", categoria: "entradas", nombre: "Empanadas", foto: "img/productos/ent-01.jpg",
      descripcion: "Empanadas doradas de masa de maíz, servidas en canasta con ají de la casa.",
      ingredientes: ["Masa de maíz", "Ají"],
      precio: 14000, porcion: "4 unidades", disponible: true, destacado: false },
    { ref: "ENT-02", categoria: "entradas", nombre: "Patacones con hogao", foto: "img/productos/ent-02.jpg",
      descripcion: "Patacones de plátano verde con hogao fresco y guacamole.",
      ingredientes: ["Plátano verde", "Hogao", "Guacamole"],
      precio: 16500, porcion: "4 unidades", disponible: true, destacado: false },
    { ref: "ENT-03", categoria: "entradas", nombre: "Chicharrón con arepa", foto: "img/productos/ent-03.jpg",
      descripcion: "Chicharrón carnudo y crocante, con arepa de maíz y limón.",
      ingredientes: ["Chicharrón", "Arepa de maíz", "Limón"],
      precio: 19000, porcion: null, disponible: true, destacado: false },

    // --- Sopas y caldos ---
    { ref: "SOP-01", categoria: "sopas", nombre: "Ajiaco santafereño", foto: "img/productos/sop-01.jpg",
      descripcion: "Sopa espesa de papas con pollo desmechado, mazorca y guascas; con arroz, aguacate, crema y alcaparras.",
      ingredientes: ["Pollo", "Papa", "Mazorca", "Guascas", "Arroz", "Aguacate", "Crema de leche", "Alcaparras"],
      precio: 28000, porcion: null, disponible: true, destacado: true },
    { ref: "SOP-02", categoria: "sopas", nombre: "Sancocho de gallina", foto: "img/productos/sop-02.jpg",
      descripcion: "Presa de gallina en caldo con mazorca, papa y cilantro, servido en olla de barro.",
      ingredientes: ["Gallina", "Mazorca", "Papa", "Cilantro"],
      precio: 30000, porcion: null, disponible: true, destacado: false },
    { ref: "SOP-03", categoria: "sopas", nombre: "Mute santandereano", foto: "img/productos/sop-03.jpg",
      descripcion: "Sopa espesa de maíz y carnes, acompañada de hogao y aguacate.",
      ingredientes: ["Maíz", "Carnes", "Hogao", "Aguacate"],
      precio: 26000, porcion: null, disponible: true, destacado: false },
    { ref: "SOP-04", categoria: "sopas", nombre: "Cuchuco", foto: "img/productos/sop-04.jpg",
      descripcion: "Sopa tradicional de grano partido con papa y cilantro.",
      ingredientes: ["Cuchuco", "Papa", "Cilantro"],
      precio: 22000, porcion: null, disponible: true, destacado: false },
    { ref: "SOP-05", categoria: "sopas", nombre: "Sopa de mondongo", foto: "img/productos/sop-05.jpg",
      descripcion: "Mondongo en caldo con papa, zanahoria y cilantro.",
      ingredientes: ["Mondongo", "Papa", "Zanahoria", "Cilantro"],
      precio: 24000, porcion: null, disponible: true, destacado: false },
    { ref: "SOP-06", categoria: "sopas", nombre: "Caldo de costilla", foto: "img/productos/sop-06.jpg",
      descripcion: "Caldo de costilla de res con papa y cilantro, acompañado de arepa.",
      ingredientes: ["Costilla de res", "Papa", "Cilantro", "Arepa"],
      precio: 15000, porcion: null, disponible: true, destacado: false },
    { ref: "SOP-07", categoria: "sopas", nombre: "Sopa de lentejas", foto: "img/productos/sop-07.jpg",
      descripcion: "Lentejas en sopa con papa, zanahoria y cilantro.",
      ingredientes: ["Lentejas", "Papa", "Zanahoria", "Cilantro"],
      precio: 16000, porcion: null, disponible: true, destacado: false },
    { ref: "SOP-08", categoria: "sopas", nombre: "Sopa de arroz", foto: "img/productos/sop-08.jpg",
      descripcion: "Sopa casera de arroz con cilantro.",
      ingredientes: ["Arroz", "Cilantro"],
      precio: 15000, porcion: null, disponible: true, destacado: false },
    { ref: "SOP-09", categoria: "sopas", nombre: "Changua", foto: "img/productos/sop-09.jpg",
      descripcion: "Caldo de leche con huevo pocheado, cilantro y pan tostado. Ideal para el desayuno.",
      ingredientes: ["Leche", "Huevo", "Cilantro", "Pan tostado"],
      precio: 12000, porcion: null, disponible: true, destacado: false },

    // --- Platos típicos ---
    { ref: "TIP-01", categoria: "tipicos", nombre: "Bandeja de la casa", foto: "img/productos/tip-01.jpg",
      descripcion: "Nuestra bandeja tradicional, servida completa en un solo plato.",
      ingredientes: ["Fríjol", "Arroz blanco", "Carne molida", "Chicharrón", "Chorizo", "Huevo frito", "Maduro", "Aguacate", "Arepa"],
      precio: 32000, porcion: null, disponible: true, destacado: true },
    { ref: "TIP-02", categoria: "tipicos", nombre: "Cazuela de frijoles", foto: "img/productos/tip-02.jpg",
      descripcion: "Frijoles con chicharrón, hogao y aguacate; con arroz y arepa.",
      ingredientes: ["Fríjol", "Chicharrón", "Hogao", "Aguacate", "Arroz", "Arepa"],
      precio: 26000, porcion: null, disponible: true, destacado: false },
    { ref: "TIP-03", categoria: "tipicos", nombre: "Tamal tolimense", foto: "img/productos/tip-03.jpg",
      descripcion: "Tamal envuelto en hoja de plátano con carnes, huevo y verduras.",
      ingredientes: ["Masa de maíz", "Pollo", "Cerdo", "Huevo", "Hoja de plátano"],
      precio: 15000, porcion: null, disponible: true, destacado: false },
    { ref: "TIP-04", categoria: "tipicos", nombre: "Lechona", foto: "img/productos/tip-04.jpg",
      descripcion: "Cerdo desmechado y cuero tostado, servido sobre hoja de plátano.",
      ingredientes: ["Cerdo", "Cuero tostado", "Hoja de plátano"],
      precio: 22000, porcion: null, disponible: true, destacado: false },
    { ref: "TIP-05", categoria: "tipicos", nombre: "Arroz atollado", foto: "img/productos/tip-05.jpg",
      descripcion: "Arroz meloso con carnes y chorizo, acompañado de patacones.",
      ingredientes: ["Arroz", "Carne de cerdo", "Chorizo", "Patacones"],
      precio: 25000, porcion: null, disponible: true, destacado: false },
    { ref: "TIP-06", categoria: "tipicos", nombre: "Pepitoria", foto: "img/productos/tip-06.jpg",
      descripcion: "Arroz de pepitoria con huevo cocido, yuca y arepa.",
      ingredientes: ["Pepitoria", "Arroz", "Huevo", "Yuca", "Arepa"],
      precio: 27000, porcion: null, disponible: true, destacado: false },
    { ref: "TIP-07", categoria: "tipicos", nombre: "Cabrito", foto: "img/productos/tip-07.jpg",
      descripcion: "Tabla de cabrito con pepitoria, arepa y guacamole.",
      ingredientes: ["Cabrito", "Pepitoria", "Arepa", "Guacamole"],
      precio: 38000, porcion: null, disponible: true, destacado: false },
    { ref: "TIP-08", categoria: "tipicos", nombre: "Pollo sudado", foto: "img/productos/tip-08.jpg",
      descripcion: "Pollo guisado con papa y mazorca, acompañado de arroz blanco.",
      ingredientes: ["Pollo", "Papa", "Mazorca", "Arroz"],
      precio: 22000, porcion: null, disponible: true, destacado: false },

    // --- Carnes ---
    { ref: "CAR-01", categoria: "carnes", nombre: "Sobrebarriga criolla", foto: "img/productos/car-01.jpg",
      descripcion: "Sobrebarriga en salsa con hogao fresco, papa salada y arroz.",
      ingredientes: ["Sobrebarriga", "Hogao", "Papa", "Arroz"],
      precio: 30000, porcion: null, disponible: true, destacado: false },
    { ref: "CAR-02", categoria: "carnes", nombre: "Sobrebarriga en salsa", foto: "img/productos/car-02.jpg",
      descripcion: "Sobrebarriga en salsa de tomate con papa, arroz y aguacate.",
      ingredientes: ["Sobrebarriga", "Salsa de tomate", "Papa", "Arroz", "Aguacate"],
      precio: 29000, porcion: null, disponible: true, destacado: false },
    { ref: "CAR-03", categoria: "carnes", nombre: "Carne oreada", foto: "img/productos/car-03.jpg",
      descripcion: "Carne oreada a la parrilla con arepa, yuca y ensalada.",
      ingredientes: ["Carne oreada", "Arepa", "Yuca", "Ensalada"],
      precio: 32000, porcion: null, disponible: true, destacado: false },

    // --- Pescados y mariscos ---
    { ref: "PES-01", categoria: "pescados", nombre: "Mojarra frita", foto: "img/productos/pes-01.jpg",
      descripcion: "Mojarra entera frita con patacón, arroz con coco, ensalada y limón.",
      ingredientes: ["Mojarra", "Patacón", "Arroz con coco", "Ensalada", "Limón"],
      precio: 38000, porcion: null, disponible: true, destacado: true },
    { ref: "PES-02", categoria: "pescados", nombre: "Bagre en salsa", foto: "img/productos/pes-02.jpg",
      descripcion: "Bagre en salsa criolla con arroz blanco y plátano asado.",
      ingredientes: ["Bagre", "Salsa criolla", "Arroz", "Plátano"],
      precio: 36000, porcion: null, disponible: true, destacado: false },
    { ref: "PES-03", categoria: "pescados", nombre: "Pescado sudado", foto: "img/productos/pes-03.jpg",
      descripcion: "Pescado guisado en salsa de tomate con papa y cilantro.",
      ingredientes: ["Pescado", "Tomate", "Papa", "Cilantro"],
      precio: 34000, porcion: null, disponible: true, destacado: false },
    { ref: "PES-04", categoria: "pescados", nombre: "Pescado en caldo", foto: "img/productos/pes-04.jpg",
      descripcion: "Pescado entero en caldo con plátano y limón.",
      ingredientes: ["Pescado", "Plátano", "Limón"],
      precio: 34000, porcion: null, disponible: true, destacado: false },
    { ref: "PES-05", categoria: "pescados", nombre: "Cazuela de mariscos", foto: "img/productos/pes-05.jpg",
      descripcion: "Cazuela cremosa de mariscos con patacón y arroz con coco.",
      ingredientes: ["Mariscos", "Patacón", "Arroz con coco"],
      precio: 42000, porcion: null, disponible: true, destacado: false },

    // --- Postres ---
    { ref: "POS-01", categoria: "postres", nombre: "Postre de natas", foto: "img/productos/pos-01.jpg",
      descripcion: "Postre tradicional de natas con ciruelas pasas.",
      ingredientes: ["Leche", "Natas", "Azúcar", "Ciruelas pasas"],
      precio: 9000, porcion: null, disponible: true, destacado: false },
    { ref: "POS-02", categoria: "postres", nombre: "Brevas con arequipe", foto: "img/productos/pos-02.jpg",
      descripcion: "Brevas caladas bañadas en arequipe.",
      ingredientes: ["Brevas", "Arequipe"],
      precio: 10500, porcion: null, disponible: true, destacado: false },
    { ref: "POS-03", categoria: "postres", nombre: "Arroz con leche", foto: "img/productos/pos-03.jpg",
      descripcion: "Arroz con leche cremoso con canela.",
      ingredientes: ["Arroz", "Leche", "Canela"],
      precio: 8000, porcion: null, disponible: true, destacado: false },

    // --- Bebidas ---
    { ref: "BEB-01", categoria: "bebidas", nombre: "Limonada de coco", foto: "img/productos/beb-01.svg",
      descripcion: "Limonada frappé con crema de coco.",
      ingredientes: ["Limón", "Crema de coco", "Hielo"],
      precio: 11000, porcion: null, disponible: true, destacado: false },
    { ref: "BEB-02", categoria: "bebidas", nombre: "Jugo de lulo", foto: "img/productos/beb-02.svg",
      descripcion: "Jugo natural de lulo, en agua o en leche.",
      ingredientes: ["Lulo"],
      precio: 7500, porcion: null, disponible: true, destacado: false },
    { ref: "BEB-03", categoria: "bebidas", nombre: "Aguapanela con limón", foto: "img/productos/beb-03.svg",
      descripcion: "Aguapanela fría con limón.",
      ingredientes: ["Panela", "Limón"],
      precio: 5000, porcion: null, disponible: true, destacado: false },
    { ref: "BEB-04", categoria: "bebidas", nombre: "Gaseosa", foto: null, // foto pendiente (prueba de campo faltante)
      descripcion: null,
      ingredientes: [],
      precio: 4500, porcion: "350 ml", disponible: true, destacado: false },
  ],
};
