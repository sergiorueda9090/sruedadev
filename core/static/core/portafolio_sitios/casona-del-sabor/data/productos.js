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
    logo: "img/logo/logo-placeholder.svg",
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
    { id: "fuertes", nombre: "Platos fuertes", icono: "bi-fire", intro: "Los platos de la casa, servidos en porción completa." },
    { id: "postres", nombre: "Postres", icono: "bi-cake2", intro: "El cierre dulce de la comida." },
    { id: "bebidas", nombre: "Bebidas", icono: "bi-cup-straw", intro: "Jugos naturales y bebidas para acompañar." },
  ],

  productos: [
    // --- Entradas ---
    { ref: "ENT-01", categoria: "entradas", nombre: "Empanadas de pipián", foto: "img/productos/ent-01.svg",
      descripcion: "Empanadas crocantes de masa de maíz rellenas de pipián, acompañadas de ají de maní.",
      ingredientes: ["Masa de maíz", "Papa amarilla", "Maní", "Ají de maní"],
      precio: 14000, porcion: "4 unidades", disponible: true, destacado: false },
    { ref: "ENT-02", categoria: "entradas", nombre: "Patacones con hogao", foto: "img/productos/ent-02.svg",
      descripcion: "Patacones de plátano verde servidos con hogao casero y queso costeño.",
      ingredientes: ["Plátano verde", "Tomate", "Cebolla larga", "Queso costeño"],
      precio: 16500, porcion: "3 unidades", disponible: true, destacado: false },
    { ref: "ENT-03", categoria: "entradas", nombre: "Chicharrón con arepa", foto: "img/productos/ent-03.svg",
      descripcion: "Chicharrón carnudo dorado al punto, con arepa de maíz y limón.",
      ingredientes: ["Tocino de cerdo", "Arepa de maíz", "Limón"],
      precio: 19000, porcion: null, disponible: true, destacado: false },

    // --- Platos fuertes ---
    { ref: "FUE-01", categoria: "fuertes", nombre: "Bandeja de la casa", foto: "img/productos/fue-01.svg",
      descripcion: "Nuestra bandeja tradicional, servida completa en un solo plato.",
      ingredientes: ["Fríjol", "Arroz blanco", "Carne molida", "Chicharrón", "Huevo frito", "Maduro", "Aguacate", "Arepa"],
      precio: 32000, porcion: null, disponible: true, destacado: true },
    { ref: "FUE-02", categoria: "fuertes", nombre: "Ajiaco santafereño", foto: "img/productos/fue-02.svg",
      descripcion: "Sopa espesa de tres papas con pollo desmechado y guascas, con crema y alcaparras aparte.",
      ingredientes: ["Papa criolla", "Papa sabanera", "Papa pastusa", "Pollo", "Guascas", "Mazorca", "Crema de leche", "Alcaparras"],
      precio: 28000, porcion: null, disponible: true, destacado: true },
    { ref: "FUE-03", categoria: "fuertes", nombre: "Sancocho de gallina", foto: "img/productos/fue-03.svg",
      descripcion: "Sancocho cocinado a fuego lento, servido con arroz y aguacate.",
      ingredientes: ["Gallina", "Yuca", "Plátano", "Mazorca", "Cilantro", "Arroz", "Aguacate"],
      precio: 30000, porcion: null, disponible: false, destacado: false },
    { ref: "FUE-04", categoria: "fuertes", nombre: "Mojarra frita", foto: "img/productos/fue-04.svg",
      descripcion: "Mojarra entera frita, con patacón, arroz con coco y ensalada.",
      ingredientes: ["Mojarra", "Plátano verde", "Arroz con coco", "Ensalada"],
      precio: 38000, porcion: null, disponible: true, destacado: true },
    { ref: "FUE-05", categoria: "fuertes", nombre: "Sobrebarriga en salsa", foto: "img/productos/fue-05.svg",
      descripcion: "Sobrebarriga en salsa criolla, con papa salada y arroz.",
      ingredientes: ["Sobrebarriga", "Salsa criolla", "Papa", "Arroz"],
      precio: null, porcion: null, disponible: true, destacado: false }, // precio pendiente (prueba de campo faltante)

    // --- Postres ---
    { ref: "POS-01", categoria: "postres", nombre: "Postre de natas", foto: "img/productos/pos-01.svg",
      descripcion: "Postre tradicional de natas, preparado en casa.",
      ingredientes: ["Leche", "Natas", "Azúcar", "Canela"],
      precio: 9000, porcion: null, disponible: true, destacado: false },
    { ref: "POS-02", categoria: "postres", nombre: "Brevas con arequipe", foto: "img/productos/pos-02.svg",
      descripcion: "Brevas caladas servidas con arequipe y queso fresco.",
      ingredientes: ["Brevas", "Arequipe", "Queso fresco"],
      precio: 10500, porcion: null, disponible: true, destacado: false },
    { ref: "POS-03", categoria: "postres", nombre: "Arroz con leche", foto: "img/productos/pos-03.svg",
      descripcion: "Arroz con leche cremoso con canela y uvas pasas.",
      ingredientes: ["Arroz", "Leche", "Canela", "Uvas pasas"],
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
