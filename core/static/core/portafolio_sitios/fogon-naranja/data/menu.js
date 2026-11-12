/* =========================================================================
   DATOS DEL MENÚ — REVISTA NARANJA
   -------------------------------------------------------------------------
   ⚠ DATOS DE PRUEBA
   - Negocio, contacto, horarios y PRECIOS: ficticios.
   - Fotos e ingredientes: tomados de TheMealDB / TheCocktailDB
     (ver data/fuentes/resumen.json). NO son fotos del restaurante.
     Reemplazarlas por fotografías reales del cliente antes de publicar.
   - Las descripciones solo mencionan ingredientes que aparecen en la fuente.
   ========================================================================= */

window.CATALOGO = {
  modoPrueba: false,

  negocio: {
    nombre: "Fogón Naranja",
    eslogan: "Sabores a la brasa y del mundo",
    descripcion:
      "Cocina de fuego lento con recetas de distintas partes del mundo: parrilla, pastas, hamburguesas y postres de la casa. Un lugar para compartir sin afán.",
    tipoComida: "Parrilla y cocina internacional",
    publico: "Familias, parejas y grupos de amigos",
    whatsapp: "+57 300 000 0000",
    whatsappLink: "https://wa.me/573000000000",
    telefono: "+57 300 000 0000",
    direccion: "Carrera 00 # 00-00, Barrio Ejemplo, Ciudad",
    instagram: "@fogonnaranja.demo",
    sitioWeb: null, // pendiente
    horario: "Todos los días · 11:00 a.m. – 11:00 p.m.",
    servicios: ["Domicilios", "Para llevar", "Consumo en el local"],
    logo: "img/logo/logo-prueba.svg",
    moneda: "COP",
    fotoPortada: "img/productos/par-01.jpg",
  },

  paleta: {
    principal: "#E36D27",
    secundario: "#832E09",
    acento: "#F4B740",
    fondo: "#FFF5D2",
    texto: "#3A1806",
  },

  // tema: "naranja" | "crema" — alterna el estilo de página como en la referencia
  categorias: [
    { id: "entradas", nombre: "Entradas", icono: "bi-egg-fried", tema: "naranja", intro: "Para abrir el apetito." },
    { id: "parrilla", nombre: "De la parrilla", icono: "bi-fire", tema: "crema", intro: "Carnes y pescados al fuego." },
    { id: "hamburguesas", nombre: "Hamburguesas y sándwiches", icono: "bi-basket2", tema: "naranja", intro: "Entre panes, como debe ser." },
    { id: "pastas", nombre: "Pizzas y pastas", icono: "bi-circle-half", tema: "crema", intro: "Masa, salsa y queso." },
    { id: "postres", nombre: "Postres", icono: "bi-cake2", tema: "naranja", intro: "El final dulce." },
    { id: "bebidas", nombre: "Bebidas", icono: "bi-cup-straw", tema: "crema", intro: "Frías, calientes y batidas." },
  ],

  productos: [
    // --- Entradas ---
    { ref: "ENT-01", categoria: "entradas", nombre: "Burek de carne", foto: "img/productos/ent-01.jpg",
      descripcion: "Masa filo crocante rellena de carne molida y cebolla, al estilo de los Balcanes.",
      ingredientes: ["Masa filo", "Carne molida", "Cebolla"],
      precio: 18000, disponible: true, destacado: false },
    { ref: "ENT-02", categoria: "entradas", nombre: "Sopa de lentejas turca", foto: "img/productos/ent-02.jpg",
      descripcion: "Çorba de lentejas con zanahoria y tomate, perfumada con comino, páprika y menta.",
      ingredientes: ["Lentejas", "Cebolla", "Zanahoria", "Tomate", "Comino", "Páprika", "Menta", "Tomillo"],
      precio: 15000, disponible: true, destacado: false },
    { ref: "ENT-03", categoria: "entradas", nombre: "Langostinos saganaki", foto: "img/productos/ent-03.jpg",
      descripcion: "Langostinos en salsa de tomate con ajo y vino blanco, gratinados con queso feta.",
      ingredientes: ["Langostinos", "Aceite de oliva", "Cebolla", "Perejil", "Vino blanco", "Tomate", "Ajo", "Queso feta"],
      precio: 32000, disponible: true, destacado: false },
    { ref: "ENT-04", categoria: "entradas", nombre: "Croquetas de pescado", foto: "img/productos/ent-04.jpg",
      descripcion: "Fofos de eglefino y papa con cilantro, ají verde y jengibre, apanados y fritos.",
      ingredientes: ["Eglefino", "Papa", "Ají verde", "Cilantro", "Comino", "Ajo", "Jengibre", "Huevo", "Apanado"],
      precio: 21000, disponible: true, destacado: false },

    // --- Parrilla ---
    { ref: "PAR-01", categoria: "parrilla", nombre: "Pollo tandoori", foto: "img/productos/par-01.jpg",
      descripcion: "Muslos de pollo marinados en yogur griego y especias, asados y servidos con cebolla roja y limón.",
      ingredientes: ["Muslos de pollo", "Yogur griego", "Garam masala", "Páprika", "Cúrcuma", "Jengibre", "Ajo", "Cebolla roja", "Limón"],
      precio: 36000, disponible: true, destacado: true },
    { ref: "PAR-02", categoria: "parrilla", nombre: "Biryani de cordero", foto: "img/productos/par-02.jpg",
      descripcion: "Arroz basmati con cordero, azafrán y especias enteras, con marañones, menta y cilantro.",
      ingredientes: ["Cordero", "Arroz basmati", "Azafrán", "Yogur", "Marañones", "Menta", "Cilantro", "Ghee", "Canela", "Cardamomo", "Clavo"],
      precio: 42000, disponible: true, destacado: true },
    { ref: "PAR-03", categoria: "parrilla", nombre: "Pecho de res al horno", foto: "img/productos/par-03.jpg",
      descripcion: "Pecho de res cocido lentamente en caldo con tomillo y romero, con zanahoria y papa.",
      ingredientes: ["Pecho de res", "Cebolla", "Ajo", "Tomillo", "Romero", "Laurel", "Caldo de res", "Zanahoria", "Mostaza", "Papa"],
      precio: 45000, disponible: true, destacado: false },
    { ref: "PAR-04", categoria: "parrilla", nombre: "Salmón teriyaki", foto: "img/productos/par-04.jpg",
      descripcion: "Salmón glaseado con salsa de soya y sake, terminado con ajonjolí.",
      ingredientes: ["Salmón", "Aceite de oliva", "Salsa de soya", "Sake", "Ajonjolí"],
      precio: 48000, disponible: true, destacado: true },

    // --- Hamburguesas y sándwiches ---
    { ref: "HAM-01", categoria: "hamburguesas", nombre: "Doble clásica", foto: "img/productos/ham-01.jpg",
      descripcion: "Doble carne en pan con ajonjolí, queso, lechuga, pepinillos y salsa de la casa.",
      ingredientes: ["Carne molida", "Pan con ajonjolí", "Queso", "Lechuga", "Pepinillos", "Cebolla", "Mayonesa", "Mostaza"],
      precio: 29000, disponible: true, destacado: true },
    { ref: "HAM-02", categoria: "hamburguesas", nombre: "Shawarma de pollo", foto: "img/productos/ham-02.jpg",
      descripcion: "Pollo especiado con salsa de yogur y ajo, lechuga y tomate en pan pita.",
      ingredientes: ["Muslos de pollo", "Cilantro", "Comino", "Cardamomo", "Páprika", "Yogur griego", "Ajo", "Lechuga", "Tomate", "Pan pita"],
      precio: 24000, disponible: true, destacado: false },
    { ref: "HAM-03", categoria: "hamburguesas", nombre: "Sándwich mac & cheese", foto: "img/productos/ham-03.jpg",
      descripcion: "Pan tostado a la plancha relleno de macarrones con salsa de tres quesos.",
      ingredientes: ["Macarrones", "Pan", "Mantequilla", "Leche", "Crema de leche", "Queso cheddar", "Queso Monterey Jack", "Queso Colby Jack"],
      precio: 22000, disponible: false, destacado: false },

    // --- Pizzas y pastas ---
    { ref: "PIZ-01", categoria: "pastas", nombre: "Pizza margarita", foto: "img/productos/piz-01.jpg",
      descripcion: "Masa artesanal con passata de tomate, mozzarella, orégano y albahaca.",
      ingredientes: ["Masa de trigo", "Passata de tomate", "Mozzarella", "Orégano", "Albahaca", "Aceite de oliva"],
      precio: 34000, disponible: true, destacado: false },
    { ref: "PIZ-02", categoria: "pastas", nombre: "Spaghetti carbonara", foto: "img/productos/piz-02.jpg",
      descripcion: "Spaghetti con yema de huevo, tocineta y queso pecorino, con pimienta negra.",
      ingredientes: ["Spaghetti", "Yema de huevo", "Tocineta", "Queso pecorino", "Pimienta negra"],
      precio: 31000, disponible: true, destacado: false },
    { ref: "PIZ-03", categoria: "pastas", nombre: "Penne arrabbiata", foto: "img/productos/piz-03.jpg",
      descripcion: "Penne en salsa de tomate picante con ajo y albahaca, con parmigiano-reggiano.",
      ingredientes: ["Penne", "Tomate", "Ajo", "Ají en hojuelas", "Albahaca", "Parmigiano-Reggiano"],
      precio: 27000, disponible: true, destacado: false },

    // --- Postres ---
    { ref: "POS-01", categoria: "postres", nombre: "Torta de chocolate", foto: "img/productos/pos-01.jpg",
      descripcion: "Gâteau húmedo de chocolate y mantequilla.",
      ingredientes: ["Chocolate", "Mantequilla", "Leche", "Huevos", "Azúcar", "Harina"],
      precio: 14000, disponible: true, destacado: false },
    { ref: "POS-02", categoria: "postres", nombre: "Pudín de caramelo", foto: "img/productos/pos-02.jpg",
      descripcion: "Sticky toffee pudding con salsa de caramelo de azúcar mascabado y crema.",
      ingredientes: ["Mantequilla", "Azúcar mascabado", "Huevos", "Harina", "Melaza", "Crema de leche", "Vainilla"],
      precio: 15000, disponible: true, destacado: false },
    { ref: "POS-03", categoria: "postres", nombre: "Pancakes con frutos rojos", foto: "img/productos/pos-03.jpg",
      descripcion: "Pancakes con frambuesas y arándanos.",
      ingredientes: ["Harina", "Huevos", "Leche", "Azúcar", "Frambuesas", "Arándanos"],
      precio: 16000, disponible: true, destacado: false },

    // --- Bebidas ---
    { ref: "BEB-01", categoria: "bebidas", nombre: "Café helado", foto: "img/productos/beb-01.jpg",
      descripcion: "Café frío con leche y un toque de azúcar.",
      ingredientes: ["Café", "Leche", "Azúcar"],
      precio: 9000, disponible: true, destacado: false },
    { ref: "BEB-02", categoria: "bebidas", nombre: "Limonada de fresa", foto: "img/productos/beb-02.jpg",
      descripcion: "Limonada natural con fresas.",
      ingredientes: ["Limón", "Fresas", "Azúcar"],
      precio: 10000, disponible: true, destacado: false },
    { ref: "BEB-03", categoria: "bebidas", nombre: "Lassi de mango", foto: "img/productos/beb-03.jpg",
      descripcion: "Bebida de yogur batido con mango.",
      ingredientes: ["Mango", "Yogur", "Azúcar"],
      precio: 11000, disponible: true, destacado: false },
    { ref: "BEB-04", categoria: "bebidas", nombre: "Malteada fresa y banano", foto: "img/productos/beb-04.jpg",
      descripcion: "Batido de fresa y banano con yogur, leche y miel.",
      ingredientes: ["Fresas", "Banano", "Yogur", "Leche", "Miel"],
      precio: 12000, disponible: true, destacado: false },
    { ref: "BEB-05", categoria: "bebidas", nombre: "Masala chai", foto: "img/productos/beb-05.jpg",
      descripcion: "Té negro con leche, jengibre y especias.",
      ingredientes: ["Té", "Leche", "Jengibre", "Cardamomo", "Clavo", "Canela", "Pimienta negra"],
      precio: null, disponible: true, destacado: false }, // precio pendiente (prueba de campo faltante)
  ],
};
