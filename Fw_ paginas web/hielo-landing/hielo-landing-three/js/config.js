/* ==========================================================================
   CONFIGURACIÓN DE LA EMPRESA — único archivo que se edita al recibir datos.

   Reglas:
   - Un dato no confirmado se deja en null (o lista vacía). Nunca se rellena
     con un ejemplo: la página lo marca «por confirmar» en modo revisión y lo
     oculta en modo publicación.
   - No escribir certificaciones, registros INVIMA, cifras, clientes ni
     testimonios sin documento que los respalde.
   - modo: 'revision'    → aviso superior y marcadores visibles.
           'publicacion' → se oculta todo lo pendiente.
   ========================================================================== */
window.SITE = {
  modo: 'revision',

  empresa: {
    nombreComercial: null,        // 'Nombre comercial' → logotipo, título, pie, JSON-LD
    razonSocial: null,            // 'Nombre S.A.S.'
    nit: null,                    // '900.000.000-0'
    eslogan: 'Frío limpio, entregado a tiempo.', // propuesta: confirmar con la empresa
    descripcion: null,            // Párrafo corporativo real (quiénes son, dónde está la planta)
    anioFundacion: null,          // 2010 → activa la razón «Experiencia en el sector»
    logo: null,                   // 'assets/icons/logo.svg' — null = logotipo tipográfico provisional
    ciudad: null,                 // 'Bucaramanga'
    departamento: null,           // 'Santander'
    direccion: null,              // 'Calle 00 # 00-00, barrio'
    urlCanonica: null             // 'https://www.dominio.com/' (con https y barra final)
  },

  contacto: {
    telefono: null,               // Texto visible: '607 000 0000'
    telefonoHref: null,           // Para tel:   '+576070000000'
    whatsapp: null,               // Solo dígitos con indicativo: '573000000000'
    correo: null,                 // 'ventas@dominio.com'
    horario: null                 // 'Lunes a sábado, 6:00 a. m. – 4:00 p. m.'
  },

  // Perfiles oficiales verificados: { red: 'Instagram', url: 'https://…', icono: 'instagram' }
  redes: [],

  // Atributos de la línea de confianza del hero (máximo 3). Confirmar que son ciertos.
  atributosHero: ['Producción con control de higiene', 'Entregas acordadas por zona', 'Un asesor para tu cuenta'],

  /* Banner principal: fotos que rotan (carrusel). Para cambiar una foto, reemplaza
     el archivo o edita la ruta. Cada diapositiva:
       grande / mediana: versión horizontal (ancho 1800 y 1200 px)
       movil: versión vertical 4:5 para pantallas < 768 px
       ancho / alto: medidas de la versión grande
     Con una sola diapositiva no se muestran controles. */
  heroDiapositivas: [
    {
      grande: 'assets/img/hero-full.webp', mediana: 'assets/img/hero-full-1200.webp', movil: 'assets/img/hero-hielo-sm.webp',
      ancho: 1800, alto: 1197,
      alt: 'Primer plano de cubos de hielo cristalinos con pequeñas burbujas en su interior'
    },
    {
      grande: 'assets/img/hero-hielo-claro.webp', mediana: 'assets/img/hero-hielo-claro-1200.webp', movil: 'assets/img/hero-hielo-claro-movil.webp',
      ancho: 1800, alto: 1197,
      alt: 'Trozos de hielo completamente transparente sobre una mesa de madera'
    },
    {
      grande: 'assets/img/hero-bebida.webp', mediana: 'assets/img/hero-bebida-1200.webp', movil: 'assets/img/hero-bebida-movil.webp',
      ancho: 2048, alto: 1362,
      alt: 'Cubo de hielo cayendo en un vaso de agua y levantando salpicaduras'
    }
  ],
  heroIntervalo: 7000,            // milisegundos entre fotos (0 = no rota sola)

  // Efecto del banner: copos de nieve y cubos 🧊 que caen. false desactiva cada uno.
  heroEfectos: { copos: true, cubos: true },

  /* Productos. disponible: true  → confirmado (se muestra en publicación)
                            null  → propuesta sin confirmar (solo en revisión)
                            false → no se fabrica (no se muestra nunca)
     presentaciones: pesos/empaques confirmados, p. ej. ['Bolsa de 2 kg', 'Bolsa de 5 kg'] */
  productos: [
    {
      id: 'cubos',
      nombre: 'Cubos de hielo',
      corto: 'Cubos',
      disponible: null,
      imagen: 'assets/img/hielo-cubos',
      ancho: 1000, alto: 750,
      alt: 'Montón de cubos de hielo transparentes',
      descripcion: 'Piezas regulares para vaso y coctel: tardan en derretirse y mantienen la bebida fría.',
      aplicaciones: ['Vasos y cocteles', 'Barras', 'Cocinas', 'Celebraciones'],
      presentaciones: []
    },
    {
      id: 'escamas',
      nombre: 'Escamas de hielo',
      corto: 'Escamas',
      disponible: null,
      imagen: 'assets/img/hielo-escamas',
      ancho: 1000, alto: 750,
      alt: 'Puñado de hojuelas finas de hielo',
      descripcion: 'Hojuelas delgadas que se acomodan alrededor del producto; frecuentes en vitrinas y conservación de alimentos.',
      aplicaciones: ['Pescados y mariscos', 'Vitrinas de alimentos', 'Banquetes'],
      presentaciones: []
    },
    {
      id: 'bloque',
      nombre: 'Bloques de hielo',
      corto: 'Bloques',
      disponible: null,
      imagen: 'assets/img/hielo-bloque',
      ancho: 900, alto: 675,
      alt: 'Bloques grandes de hielo uno sobre otro',
      descripcion: 'Piezas grandes de deshielo lento, para mantener el frío por horas o picar en el lugar.',
      aplicaciones: ['Traslado de alimentos', 'Plantas y obras', 'Reventa'],
      presentaciones: []
    },
    {
      id: 'frappe',
      nombre: 'Hielo frappé',
      corto: 'Frappé',
      disponible: null,
      imagen: 'assets/img/hielo-frappe',
      ancho: 1000, alto: 750,
      alt: 'Fragmentos pequeños de hielo picado',
      descripcion: 'Hielo picado fino que enfría al instante y llena cualquier recipiente.',
      aplicaciones: ['Coctelería', 'Bebidas granizadas', 'Vitrinas de bebidas'],
      presentaciones: []
    },
    {
      id: 'cilindrico',
      nombre: 'Hielo tubular',
      corto: 'Tubular',
      disponible: null,
      imagen: 'assets/img/hielo-cilindrico',
      ancho: 1000, alto: 750,
      alt: 'Piezas de hielo en forma de tubo hueco',
      descripcion: 'Cilindros huecos que se sirven fácil con pala y enfrían rápido por su forma.',
      aplicaciones: ['Barras', 'Neveras de tienda', 'Servicio de bebidas'],
      presentaciones: []
    }
  ],

  // Guía orientativa «formato habitual por tipo de negocio» (sección de clientes
  // mientras no haya logotipos ni testimonios autorizados). Usa los id de productos.
  usosPorSector: [
    { sector: 'Cocinas y barras', productos: ['cubos', 'cilindrico', 'frappe'] },
    { sector: 'Hotelería', productos: ['cubos', 'cilindrico'] },
    { sector: 'Eventos y banquetes', productos: ['cubos', 'frappe', 'escamas'] },
    { sector: 'Tiendas y autoservicios', productos: ['cubos', 'cilindrico'] },
    { sector: 'Reventa y distribución', productos: ['cubos', 'bloque'] },
    { sector: 'Pescados y alimentos', productos: ['frappe', 'escamas', 'bloque'] },
    { sector: 'Industria y empresas', productos: ['cubos', 'bloque'] }
  ],

  // Etiqueta de precio en las fichas (no se publican precios).
  textoPrecio: 'Precio por volumen, bajo cotización',

  operacion: {
    pedidosRecurrentes: null,     // true si la empresa atiende pedidos programados
    anticipacionPedido: null,     // 'Pedidos con 24 horas de anticipación'
    pedidoMinimo: null,           // 'Desde 50 kg por entrega'
    condicionesAltoVolumen: null  // Texto confirmado sobre pedidos grandes
  },

  cobertura: {
    ciudadBase: null,             // 'Bucaramanga'
    municipios: [],               // ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta']
    modalidad: [],                // ['Entrega con vehículo propio', 'Recogida en planta']
    coordenadas: null             // { lat: 7.1, lng: -73.1 } → enlace «Ver en el mapa» (OpenStreetMap)
  },

  calidad: {
    procesoConfirmado: false,     // true cuando la planta valide los 6 pasos del proceso
    registroSanitario: null,      // Texto exacto del documento sanitario vigente
    certificaciones: []           // Solo nombres de certificaciones verificadas
  },

  /* Indicadores. Solo cifras reales y documentadas (valor numérico).
     Si ninguno tiene valor, la sección muestra cómo se organiza el suministro. */
  indicadores: [
    { etiqueta: 'kilos de hielo al día', valor: null, prefijo: '', sufijo: '' },
    { etiqueta: 'negocios atendidos', valor: null, prefijo: '', sufijo: '' },
    { etiqueta: 'municipios con despacho', valor: null, prefijo: '', sufijo: '' },
    { etiqueta: 'años en el oficio', valor: null, prefijo: '', sufijo: '' }
  ],

  clientes: {
    logos: [],                    // { nombre, src, ancho, alto } — solo con autorización escrita
    testimonios: []               // { texto, autor, cargo, empresa } — solo verificables y autorizados
  },

  // Preguntas frecuentes. respuesta: null → se marca pendiente (revisión) u oculta (publicación).
  // auto: la respuesta se arma desde los datos de arriba cuando existen.
  faq: [
    { pregunta: '¿Qué hielo fabrican?', respuesta: null, auto: 'productos' },
    { pregunta: '¿En qué empaques lo venden?', respuesta: null, auto: 'presentaciones' },
    { pregunta: '¿Hacen ventas al por mayor?', respuesta: null },
    {
      pregunta: '¿Cómo pido una cotización?',
      respuesta: 'Llena el formulario de esta página o usa los datos de contacto del pie. Indica qué hielo necesitas, cuánto, cada cuánto y dónde lo recibes; con eso te enviamos empaques y condiciones.'
    },
    { pregunta: '¿Hasta dónde entregan?', respuesta: null, auto: 'cobertura' },
    { pregunta: '¿Puedo dejar un pedido fijo?', respuesta: null },
    { pregunta: '¿Con cuánto tiempo debo pedir?', respuesta: null, auto: 'anticipacion' },
    {
      pregunta: '¿Qué datos piden para cotizar?',
      respuesta: 'Tipo de hielo, cantidad estimada (kilos, bolsas o bloques), frecuencia de compra, municipio y dirección de entrega, y un teléfono.'
    }
  ],

  legal: {
    politicaPrivacidad: 'privacidad.html'  // Borrador incluido; reemplazar por la versión aprobada
  },

  // Servicio real de recepción de formularios (https). null = el formulario no envía nada.
  formEndpoint: null,

  // Fotografías temporales de referencia (Wikimedia Commons). Ver assets/img/credits.json.
  creditosFotos: [
    { foto: 'Imagen de inicio: cubos con burbujas', autor: 'liz west', licencia: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Cloudy_ice_cubes.jpg' },
    { foto: 'Sistema de filtración de agua', autor: 'Mas mufti', licencia: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Reverse_Osmosis_System.jpg' },
    { foto: 'Cubos de hielo', autor: 'Forbes Johnston from Winchester, UK', licencia: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:2022_(365_challenge)_-_Week_29_(water)_-_Day_6_-_ice_cubes_(52231813566).jpg' },
    { foto: 'Hielo tubular', autor: 'User:Mattes', licencia: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Ice_cubes_for_beverages_-_hollow_cylinders.JPG' },
    { foto: 'Hielo frappé', autor: 'Michael Scialdone', licencia: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Ice_cubes_(Day_143).jpg' },
    { foto: 'Escamas de hielo', autor: 'Jpdeex', licencia: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Flake_ice.jpg' },
    { foto: 'Bloques de hielo', autor: 'Salil Kumar Mukherjee', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Ice_blocks_transport_on_trolley.jpg' },
    { foto: 'Tanque donde se forman los bloques', autor: 'Ihab Mohammed', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Ice_blocks_transferred_to_the_ships.jpg' },
    { foto: 'Descarga de bloques en la calle', autor: 'CEphoto, Uwe Aranas', licencia: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Ho-Chi-Minh-City_Vietnam_Ice-Delivery-02.jpg' },
    { foto: 'Bebida con hielo y limón', autor: 'Kyle Flood from Victoria, British Columbia, Canada', licencia: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Gin_and_tonic.jpg' },
    { foto: 'Baldes con hielo para botellas', autor: 'dionhinchcliffe', licencia: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Ice_buckets_and_sparkling_wine.jpg' },
    { foto: 'Mariscos sobre hielo', autor: 'Paul Arps (paularps)', licencia: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Fr%C3%BCchte_des_Meeres,_2011_(01).jpg' },
    { foto: 'Bolsa de cubos', autor: 'Alicia Fagerving', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Ice_cube_bag_01.jpg' },
    { foto: 'Pescado cubierto de hielo', autor: 'QueenCityCebu', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Freshly_Caught_Sardines_at_Toledo.jpg' },
    { foto: 'Bloques recién desmoldados', autor: 'David Vinter', licencia: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Grimsby_Ice_Factory_-_Slab_Ice_-_geograph.org.uk_-_1191556.jpg' },
    { foto: 'Máquina productora de hielo', autor: 'www.zcommunityblog.com', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Ice_Block_making_Machine.jpg' },
    { foto: 'Hielo embolsado en celdas', autor: 'Alicia Fagerving', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Ice_cube_bag_02.jpg' },
    { foto: 'Moldes para cubos', autor: 'Harald Hoyer from Schwerin, Germany', licencia: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Ice_Cubes_(4330423566).jpg' },
    { foto: 'Cubo sobre fondo oscuro', autor: 'Forbes Johnston from Winchester, UK', licencia: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:I_is_for_Icecube_(50869079828).jpg' },
    { foto: 'Cubo sobre madera', autor: 'Matthew Bellemare', licencia: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Ice_cube_(143761739).jpg' },
    { foto: 'Pala de acero con cubos de hielo', autor: 'Achim Schleuning', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Ice_cubes_with_shovel.jpg' },
    { foto: 'Hielo transparente sobre madera (banner)', autor: 'rawdonfox from Leeds, Yorkshire', licencia: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Ice-cubes._-_Flickr_-_rawdonfox.jpg' },
    { foto: 'Cubo cayendo en un vaso (banner)', autor: 'Jan Bambach', licencia: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Ice_Ice_Baby_(152310599).jpeg' }
  ]
};
