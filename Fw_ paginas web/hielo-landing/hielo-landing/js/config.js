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
    eslogan: 'Pureza que enfría. Confianza que abastece.', // concepto del brief: confirmar con la empresa
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
  atributosHero: ['Calidad controlada', 'Distribución programada', 'Atención comercial directa'],

  /* Productos. disponible: true  → confirmado (se muestra en publicación)
                            null  → propuesta sin confirmar (solo en revisión)
                            false → no se fabrica (no se muestra nunca)
     presentaciones: pesos/empaques confirmados, p. ej. ['Bolsa de 2 kg', 'Bolsa de 5 kg'] */
  productos: [
    {
      id: 'cubos',
      nombre: 'Hielo en cubos',
      disponible: null,
      imagen: 'assets/img/hielo-cubos',
      ancho: 1000, alto: 750,
      alt: 'Cubos de hielo transparentes apilados',
      descripcion: 'El formato más versátil para servir bebidas: cubos de tamaño parejo que enfrían sin aguarse de inmediato.',
      aplicaciones: ['Bebidas', 'Bares', 'Restaurantes', 'Eventos'],
      presentaciones: []
    },
    {
      id: 'cilindrico',
      nombre: 'Hielo cilíndrico',
      disponible: null,
      imagen: 'assets/img/hielo-cilindrico',
      ancho: 1000, alto: 750,
      alt: 'Hielo en forma de cilindros huecos',
      descripcion: 'Piezas tubulares con buena superficie de contacto, fáciles de dosificar con pala en barras y neveras.',
      aplicaciones: ['Bares', 'Tiendas', 'Neveras de servicio'],
      presentaciones: []
    },
    {
      id: 'frappe',
      nombre: 'Hielo frappé o triturado',
      disponible: null,
      imagen: 'assets/img/hielo-frappe',
      ancho: 1000, alto: 750,
      alt: 'Hielo triturado en fragmentos pequeños',
      descripcion: 'Fragmentos pequeños que enfrían rápido y se acomodan a cualquier recipiente.',
      aplicaciones: ['Cocteles', 'Granizados', 'Exhibición de bebidas'],
      presentaciones: []
    },
    {
      id: 'escamas',
      nombre: 'Hielo en escamas',
      disponible: null,
      imagen: 'assets/img/hielo-escamas',
      ancho: 1000, alto: 750,
      alt: 'Mano sosteniendo hielo en escamas finas',
      descripcion: 'Láminas delgadas que cubren el producto de forma uniforme; habitual en exhibición y conservación de alimentos.',
      aplicaciones: ['Pescaderías', 'Exhibición de alimentos', 'Catering'],
      presentaciones: []
    },
    {
      id: 'bloque',
      nombre: 'Hielo en bloque',
      disponible: null,
      imagen: 'assets/img/hielo-bloque',
      ancho: 900, alto: 675,
      alt: 'Bloques grandes de hielo apilados',
      descripcion: 'Bloques de gran volumen que se derriten despacio; pensados para enfriar por más tiempo o para triturar en el sitio.',
      aplicaciones: ['Transporte de alimentos', 'Industria', 'Distribuidores'],
      presentaciones: []
    }
  ],

  // Guía orientativa «formato habitual por tipo de negocio» (sección de clientes
  // mientras no haya logotipos ni testimonios autorizados). Usa los id de productos.
  usosPorSector: [
    { sector: 'Restaurantes y bares', productos: ['cubos', 'cilindrico', 'frappe'] },
    { sector: 'Hoteles y moteles', productos: ['cubos', 'cilindrico'] },
    { sector: 'Eventos y catering', productos: ['cubos', 'frappe', 'escamas'] },
    { sector: 'Supermercados y tiendas', productos: ['cubos', 'cilindrico'] },
    { sector: 'Distribuidores y revendedores', productos: ['cubos', 'bloque'] },
    { sector: 'Pescaderías y alimentos', productos: ['frappe', 'escamas', 'bloque'] },
    { sector: 'Empresas e industria', productos: ['cubos', 'bloque'] }
  ],

  // Etiqueta de precio en las fichas (no se publican precios).
  textoPrecio: 'Solicitar precio mayorista',

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
    { etiqueta: 'kilogramos producidos por día', valor: null, prefijo: '', sufijo: '' },
    { etiqueta: 'clientes comerciales atendidos', valor: null, prefijo: '', sufijo: '' },
    { etiqueta: 'municipios con entrega', valor: null, prefijo: '', sufijo: '' },
    { etiqueta: 'años de experiencia', valor: null, prefijo: '', sufijo: '' }
  ],

  clientes: {
    logos: [],                    // { nombre, src, ancho, alto } — solo con autorización escrita
    testimonios: []               // { texto, autor, cargo, empresa } — solo verificables y autorizados
  },

  // Preguntas frecuentes. respuesta: null → se marca pendiente (revisión) u oculta (publicación).
  // auto: la respuesta se arma desde los datos de arriba cuando existen.
  faq: [
    { pregunta: '¿Qué tipos de hielo comercializan?', respuesta: null, auto: 'productos' },
    { pregunta: '¿Cuáles son las presentaciones disponibles?', respuesta: null, auto: 'presentaciones' },
    { pregunta: '¿Venden hielo al por mayor?', respuesta: null },
    {
      pregunta: '¿Cómo solicito una cotización?',
      respuesta: 'Completa el formulario de cotización de esta página o usa los datos de contacto del pie de página, indicando el tipo de hielo, la cantidad aproximada, la frecuencia y el lugar de entrega. Con esa información el equipo comercial te responde con presentaciones y condiciones.'
    },
    { pregunta: '¿Qué zonas de entrega cubren?', respuesta: null, auto: 'cobertura' },
    { pregunta: '¿Cómo funcionan los pedidos recurrentes?', respuesta: null },
    { pregunta: '¿Con cuánto tiempo de anticipación debo realizar un pedido?', respuesta: null, auto: 'anticipacion' },
    {
      pregunta: '¿Qué información necesito para cotizar?',
      respuesta: 'El tipo de hielo, la cantidad aproximada (en kilos, bolsas o bloques), cada cuánto lo necesitas, el municipio y la dirección de entrega, y un teléfono de contacto.'
    }
  ],

  legal: {
    politicaPrivacidad: 'privacidad.html'  // Borrador incluido; reemplazar por la versión aprobada
  },

  // Servicio real de recepción de formularios (https). null = el formulario no envía nada.
  formEndpoint: null,

  // Fotografías temporales de referencia (Wikimedia Commons). Ver assets/img/credits.json.
  creditosFotos: [
    { foto: 'Portada', autor: 'liz west', licencia: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Cloudy_ice_cubes.jpg' },
    { foto: 'Presentación corporativa', autor: 'Mas mufti', licencia: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Reverse_Osmosis_System.jpg' },
    { foto: 'Producto: cubos', autor: 'Forbes Johnston from Winchester, UK', licencia: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:2022_(365_challenge)_-_Week_29_(water)_-_Day_6_-_ice_cubes_(52231813566).jpg' },
    { foto: 'Producto: cilíndrico', autor: 'User:Mattes', licencia: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Ice_cubes_for_beverages_-_hollow_cylinders.JPG' },
    { foto: 'Producto: frappé / triturado', autor: 'Michael Scialdone', licencia: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Ice_cubes_(Day_143).jpg' },
    { foto: 'Producto: escamas', autor: 'Jpdeex', licencia: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Flake_ice.jpg' },
    { foto: 'Producto: bloque', autor: 'Salil Kumar Mukherjee', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Ice_blocks_transport_on_trolley.jpg' },
    { foto: '¿Por qué elegirnos?', autor: 'Ihab Mohammed', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Factory_of_Ice.jpg' },
    { foto: 'Galería', autor: 'Ihab Mohammed', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Ice_blocks_transferred_to_the_ships.jpg' },
    { foto: 'Sector: distribuidores', autor: 'CEphoto, Uwe Aranas', licencia: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Ho-Chi-Minh-City_Vietnam_Ice-Delivery-02.jpg' },
    { foto: 'Sector: restaurantes y bares', autor: 'Kyle Flood from Victoria, British Columbia, Canada', licencia: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Gin_and_tonic.jpg' },
    { foto: 'Sector: hoteles', autor: 'dionhinchcliffe', licencia: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Ice_buckets_and_sparkling_wine.jpg' },
    { foto: 'Sector: eventos y catering', autor: 'Paul Arps (paularps)', licencia: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Fr%C3%BCchte_des_Meeres,_2011_(01).jpg' },
    { foto: 'Sector: supermercados y tiendas', autor: 'Alicia Fagerving', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Ice_cube_bag_01.jpg' },
    { foto: 'Sector: pescaderías', autor: 'QueenCityCebu', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Freshly_Caught_Sardines_at_Toledo.jpg' },
    { foto: 'Sector: empresas e industria; galería', autor: 'David Vinter', licencia: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Grimsby_Ice_Factory_-_Slab_Ice_-_geograph.org.uk_-_1191556.jpg' },
    { foto: 'Galería', autor: 'www.zcommunityblog.com', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Ice_Block_making_Machine.jpg' },
    { foto: 'Galería', autor: 'Alicia Fagerving', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Ice_cube_bag_02.jpg' },
    { foto: 'Galería', autor: 'Harald Hoyer from Schwerin, Germany', licencia: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Ice_Cubes_(4330423566).jpg' },
    { foto: 'Galería', autor: 'Forbes Johnston from Winchester, UK', licencia: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:I_is_for_Icecube_(50869079828).jpg' },
    { foto: 'Llamada a la acción', autor: 'Matthew Bellemare', licencia: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Ice_cube_(143761739).jpg' }
  ]
};
