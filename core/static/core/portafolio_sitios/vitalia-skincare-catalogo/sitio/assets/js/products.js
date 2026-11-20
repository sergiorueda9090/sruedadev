/* VITALIA — catálogo SKIN1004 (línea Madagascar Centella).
 * Nombres, precios, presentaciones, registros INVIMA, EAN, descripciones, modo de uso e
 * ingredientes destacados tomados del catálogo público de un distribuidor colombiano
 * (lineaestetica.co, noviembre de 2026). No se publican valoraciones ni opiniones: no
 * hay compras reales que las respalden. Antes de vender, confirma precios y
 * disponibilidad con tu proveedor y los datos con el envase.
 *
 * Imágenes: assets/images/products/<id>/<vista>-<ancho>.webp (400 y 900 px, 4:5)
 *   vistas: frente (envase sobre fondo blanco) y foto-2 … foto-N (fotos de ambiente)
 *   Se generan desde assets/descargas con el script de fotos (ver README).
 */
(function (VT) {
  'use strict';

  const categorias = [
    { id: 'limpieza', nombre: 'Limpieza', color: '#CDB5F6', resumen: 'Aceites y espumas para retirar maquillaje, protector solar e impurezas sin resecar.' },
    { id: 'tonicos', nombre: 'Tónicos', color: '#F2E6F1', resumen: 'El primer paso después de limpiar: hidratan y preparan la piel para lo que sigue.' },
    { id: 'serums', nombre: 'Sérums y ampollas', color: '#C2A2FA', resumen: 'Fórmulas concentradas con centella para calmar, equilibrar o iluminar.' },
    { id: 'hidratacion', nombre: 'Cremas e hidratación', color: '#9164CC', resumen: 'Cremas, geles y mascarilla de noche para cerrar la rutina.' },
    { id: 'proteccion-solar', nombre: 'Protección solar', color: '#E0D3FB', resumen: 'Protección SPF50+ PA++++ de textura ligera para el uso diario.' },
    { id: 'kits', nombre: 'Kits', color: '#422962', resumen: 'Varias referencias en una caja, para probar o regalar.' }
  ];

  const ADV = [
    'Solo para uso externo. Evite el contacto con los ojos; si ocurre, enjuague con abundante agua.',
    'Haga una prueba en una zona pequeña antes del primer uso. Suspenda si nota irritación.',
    'Manténgase fuera del alcance de los niños.'
  ];
  const ADV_ACIDOS = ADV.concat('Contiene exfoliantes suaves: use protector solar durante el día.');
  const CONSERVACION = 'Lugar fresco y seco, lejos de la luz directa del sol. Cierre bien el envase después de cada uso.';
  const COMPOSICION = 'Ingredientes destacados según la descripción del distribuidor. La lista completa (INCI) está impresa en el envase.';

  // Datos comunes de todas las fichas
  const p = (d) => Object.assign({
    marca: 'SKIN1004', etiqueta: '', destacado: false, advertencias: ADV, conservacion: CONSERVACION,
    composicion: COMPOSICION, comparacion: null, valoracion: null, opiniones: [], faq: []
  }, d);

  const productos = [
    // ---------------- Limpieza ----------------
    p({
      id: 'light-cleansing-oil', nombre: 'Madagascar Centella Light Cleansing Oil', categoria: 'limpieza',
      precio: 44506, precioAnterior: 52360, fotos: 3, destacado: true,
      contenido: '30 ml', presentacion: 'Aceite limpiador · 30 ml', registro: 'NSOC39193-25CO', ean: '8809576261226',
      resumen: 'Aceite limpiador ligero que retira maquillaje, protector solar, exceso de grasa e impurezas y deja la piel limpia y confortable.',
      descripcion: 'Aceite limpiador ligero que se funde con la piel para disolver maquillaje, protector solar e impurezas sin necesidad de frotar, ayudando a mantener la barrera cutánea mientras limpia. Enriquecido con centella asiática de Madagascar, reconocida por sus propiedades calmantes. Apto para todo tipo de piel, incluida la sensible, mixta y grasa.',
      beneficios: [
        { icono: 'droplet-half', titulo: 'Retira maquillaje y protector', texto: 'Disuelve maquillaje, protector solar e impurezas, también en la zona de los ojos.' },
        { icono: 'feather', titulo: 'Textura ligera', texto: 'No deja sensación grasosa después de enjuagar.' },
        { icono: 'flower1', titulo: 'Con centella asiática', texto: 'Limpieza delicada, pensada incluso para piel sensible.' }
      ],
      ingredientes: ['Centella asiática de Madagascar'],
      modoUso: 'Aplica una cantidad adecuada sobre el rostro seco y masajea suavemente para disolver maquillaje, protector solar e impurezas.'
    }),
    p({
      id: 'ampoule-foam', nombre: 'Madagascar Centella Ampoule Foam', categoria: 'limpieza',
      precio: 69615, precioAnterior: 81900, fotos: 4,
      contenido: '125 ml', presentacion: 'Espuma limpiadora · 125 ml', registro: 'NSOC39529-25CO', ean: '8809576261127',
      resumen: 'Espuma limpiadora cremosa con centella asiática de Madagascar que retira impurezas, exceso de grasa y restos de maquillaje.',
      descripcion: 'Espuma limpiadora de fórmula cremosa enriquecida con centella asiática de Madagascar, para calmar la piel mientras retira impurezas, exceso de grasa y residuos de maquillaje. Incluye ácido salicílico (BHA), que ayuda a purificar los poros, y ácido hialurónico, que mantiene la hidratación. Deja la piel fresca y limpia, sin sensación tirante.',
      beneficios: [
        { icono: 'water', titulo: 'Limpieza sin resecar', texto: 'Limpia en profundidad sin dejar la piel tirante.' },
        { icono: 'shield-check', titulo: 'Cuida la barrera', texto: 'Con centella para calmar mientras limpia.' },
        { icono: 'person-check', titulo: 'Para piel mixta o sensible', texto: 'También para piel con tendencia a brotes.' }
      ],
      ingredientes: ['Centella asiática de Madagascar', 'Ácido salicílico (BHA)', 'Ácido hialurónico'],
      advertencias: ADV_ACIDOS,
      modoUso: 'Aplica una pequeña cantidad en las manos mojadas, haz espuma, masajea suavemente el rostro y enjuaga con agua tibia.'
    }),

    // ---------------- Tónicos ----------------
    p({
      id: 'hyalu-cica-brightening-toner', nombre: 'Madagascar Centella Hyalu-Cica Brightening Toner', categoria: 'tonicos',
      precio: 34000, precioAnterior: 40000, fotos: 3, etiqueta: 'Nuevo',
      contenido: '30 ml', presentacion: 'Tónico facial · 30 ml', registro: 'NSOC50025-26CO', ean: '8809576261073',
      resumen: 'Tónico hidratante que ayuda a mejorar la apariencia del tono desigual y deja la piel lista para el sérum.',
      descripcion: 'Tónico facial que hidrata mientras ayuda a mejorar la apariencia del tono desigual, dejando la piel fresca y suave. Combina el complejo Hyalu-Cica (centella asiática de Madagascar y ácido hialurónico) con niacinamida, AHA y LHA, que favorecen una renovación suave de la superficie de la piel y una textura más uniforme.',
      beneficios: [
        { icono: 'brightness-high', titulo: 'Luminosidad', texto: 'Ayuda a una apariencia más luminosa y uniforme.' },
        { icono: 'droplet', titulo: 'Hidratación duradera', texto: 'Ácido hialurónico y centella en el primer paso de la rutina.' },
        { icono: 'stars', titulo: 'Exfoliación suave', texto: 'AHA y LHA para mejorar la textura de la piel.' }
      ],
      ingredientes: ['Centella asiática de Madagascar', 'Ácido hialurónico', 'Niacinamida', 'AHA', 'LHA'],
      advertencias: ADV_ACIDOS,
      modoUso: 'Después de la limpieza, aplica una cantidad adecuada con un disco de algodón o con las manos. Distribuye sobre rostro y cuello hasta su absorción y continúa con el sérum y la crema.'
    }),
    p({
      id: 'poremizing-clear-toner', nombre: 'Madagascar Centella Poremizing Clear Toner', categoria: 'tonicos',
      precio: 82365, precioAnterior: 96900, fotos: 4,
      contenido: '210 ml', presentacion: 'Tónico facial · 210 ml', registro: 'NSOC39321-25CO', ean: '8809576261455',
      resumen: 'Tónico con centella y sal rosa del Himalaya que ayuda a refinar la apariencia de los poros y controlar el exceso de grasa.',
      descripcion: 'Tónico que ayuda a refinar la apariencia de los poros, equilibrar la producción de grasa y calmar la piel, gracias a su mezcla de centella asiática de Madagascar y sal rosa del Himalaya. Su textura ligera y fresca mejora la textura de la piel sin resecar ni dejar sensación pesada.',
      beneficios: [
        { icono: 'circle', titulo: 'Poros menos visibles', texto: 'Ayuda a minimizar la apariencia de los poros.' },
        { icono: 'sliders', titulo: 'Equilibrio', texto: 'Ayuda a regular la grasa sin resecar.' },
        { icono: 'person-check', titulo: 'Piel mixta o grasa', texto: 'También para piel con tendencia a imperfecciones.' }
      ],
      ingredientes: ['Centella asiática de Madagascar', 'Sal rosa del Himalaya'],
      modoUso: 'Aplica con las manos o con un algodón sobre el rostro limpio, dando suaves toques hasta su absorción.'
    }),
    p({
      id: 'tone-brightening-boosting-toner', nombre: 'Madagascar Centella Tone Brightening Boosting Toner', categoria: 'tonicos',
      precio: 84065, precioAnterior: 98900, fotos: 5,
      contenido: '210 ml', presentacion: 'Tónico facial · 210 ml', registro: 'NSOC39177-25CO', ean: '8809576261165',
      resumen: 'Tónico ligero con 90 % de centella, niacinamida y vitamina C para una piel de tono más uniforme y radiante.',
      descripcion: 'Tónico ligero formulado con un 90 % de centella asiática de Madagascar para calmar y fortalecer la piel, junto con niacinamida, vitamina C y exfoliantes suaves que ayudan a iluminar, renovar y unificar el tono. Textura acuosa de rápida absorción, cómoda en climas cálidos.',
      beneficios: [
        { icono: 'brightness-high', titulo: 'Luminosidad sin irritar', texto: 'Niacinamida y vitamina C para un tono más parejo.' },
        { icono: 'stars', titulo: 'Exfoliación suave', texto: 'Mejora la textura, apta para piel sensible.' },
        { icono: 'water', titulo: 'Textura acuosa', texto: 'Se absorbe rápido, ideal para climas cálidos.' }
      ],
      ingredientes: ['Centella asiática de Madagascar (90 %)', 'Niacinamida', 'Vitamina C', 'Exfoliantes suaves'],
      advertencias: ADV_ACIDOS,
      modoUso: 'Aplica una pequeña cantidad sobre la piel limpia, dando suaves toques hasta su absorción.'
    }),

    // ---------------- Sérums y ampollas ----------------
    p({
      id: 'teca-ampoule', nombre: 'Madagascar Centella TECA Ampoule', categoria: 'serums',
      precio: 67915, precioAnterior: 79900, fotos: 6, destacado: true, etiqueta: 'Nuevo',
      contenido: '50 ml', presentacion: 'Sérum concentrado · 50 ml', registro: 'NSOC49898-26CO', ean: '8809913834557',
      resumen: 'Sérum concentrado que ayuda a calmar la piel sensible, fortalecer la barrera cutánea y aportar hidratación profunda.',
      descripcion: 'Sérum concentrado que combina centella asiática de Madagascar con el complejo TECA (madecassoside, asiaticoside, ácido madecásico y ácido asiático), además de pantenol y ácido hialurónico. Ayuda a reducir la sensación de irritación, reforzar la barrera protectora y mantener la hidratación. Textura ligera, sin sensación pegajosa. Para piel sensible, reactiva o deshidratada.',
      beneficios: [
        { icono: 'heart-pulse', titulo: 'Calma la piel sensible', texto: 'Ayuda a reducir la sensación de irritación y la apariencia de rojeces.' },
        { icono: 'shield-check', titulo: 'Barrera cutánea', texto: 'Complejo TECA y pantenol para reforzarla.' },
        { icono: 'feather', titulo: 'Textura ligera', texto: 'Se absorbe rápido y no deja sensación grasosa.' }
      ],
      ingredientes: ['Centella asiática de Madagascar', 'Complejo TECA', 'Pantenol', 'Ácido hialurónico'],
      modoUso: 'Aplica de 2 a 3 gotas sobre la piel limpia después del tónico. Distribuye sobre rostro y cuello hasta su absorción y continúa con la crema hidratante.'
    }),
    p({
      id: 'probio-cica-intensive-ampoule', nombre: 'Madagascar Centella Probio-Cica Intensive Ampoule', categoria: 'serums',
      precio: 53465, precioAnterior: 62900, fotos: 1,
      contenido: '30, 50 o 95 ml', presentacion: 'Ampolla facial · 30, 50 o 95 ml (precio de la presentación base)', registro: 'NSOC39319-25CO', ean: '8809913830634 (30 ml)',
      resumen: 'Ampolla concentrada con centella fermentada y probióticos para piel sensible, deshidratada o con la barrera debilitada.',
      descripcion: 'Ampolla facial con la tecnología Probio-Cica, que combina centella asiática fermentada de Madagascar y probióticos para fortalecer la barrera natural de la piel. Contiene además ceramidas, ácido hialurónico, pantenol y beta-glucano, que favorecen una hidratación intensa. Textura nutritiva de rápida absorción, para el día y la noche.',
      beneficios: [
        { icono: 'shield-check', titulo: 'Barrera fortalecida', texto: 'Centella fermentada, probióticos y ceramidas.' },
        { icono: 'droplet', titulo: 'Hidratación intensa', texto: 'Ácido hialurónico, pantenol y beta-glucano.' },
        { icono: 'feather', titulo: 'Nutre sin pesar', texto: 'Textura nutritiva que se absorbe rápido.' }
      ],
      ingredientes: ['Centella asiática fermentada de Madagascar', 'Probióticos', 'Ceramidas', 'Ácido hialurónico', 'Pantenol', 'Beta-glucano'],
      modoUso: 'Aplica unas gotas sobre la piel limpia después del tónico. Masajea suavemente hasta su absorción y continúa con la crema hidratante. Para la rutina de día y de noche.'
    }),
    p({
      id: 'poremizing-fresh-ampoule', nombre: 'Madagascar Centella Poremizing Fresh Ampoule', categoria: 'serums',
      precio: 50065, precioAnterior: 58900, fotos: 1,
      contenido: '100 ml', presentacion: 'Ampolla facial · 100 ml', registro: 'NSOC39397-25CO', ean: '7708162555606',
      resumen: 'Ampolla ligera que ayuda a mejorar la apariencia de los poros y controlar el brillo mientras hidrata.',
      descripcion: 'Ampolla facial de textura acuosa que combina centella asiática de Madagascar, sal rosa del Himalaya, complejo Peptide-9 y ácido hialurónico. Ayuda a mantener el equilibrio de la piel, mejorar la apariencia de los poros y aportar una hidratación ligera con sensación fresca. Ideal para piel mixta y grasa.',
      beneficios: [
        { icono: 'circle', titulo: 'Poros refinados', texto: 'Ayuda a mejorar la apariencia de los poros visibles.' },
        { icono: 'sliders', titulo: 'Controla el brillo', texto: 'Ayuda a controlar la apariencia del exceso de grasa.' },
        { icono: 'wind', titulo: 'Sensación fresca', texto: 'Textura acuosa de rápida absorción.' }
      ],
      ingredientes: ['Centella asiática de Madagascar', 'Sal rosa del Himalaya', 'Complejo Peptide-9', 'Ácido hialurónico'],
      modoUso: 'Aplica unas gotas sobre la piel limpia después del tónico. Distribuye sobre rostro y cuello hasta su absorción y continúa con la crema hidratante. Mañana y noche.'
    }),
    p({
      id: 'matrixyl-10-boosting-shot', nombre: 'Madagascar Centella Matrixyl 10 Boosting Shot Ampoule', categoria: 'serums',
      precio: 118150, precioAnterior: 139000, fotos: 1,
      contenido: '30 ml', presentacion: 'Ampolla facial · 30 ml', registro: 'NSOC45743-25CO', ean: '7708162555248',
      resumen: 'Tratamiento intensivo con péptidos Matrixyl 10 y centella para una piel de apariencia más firme y lisa.',
      descripcion: 'Tratamiento intensivo que combina la centella asiática de Madagascar con Matrixyl 10, un complejo de péptidos que ayuda a suavizar las líneas de expresión y mejorar la elasticidad. Su fórmula ligera tipo ampolla se absorbe rápido y aporta hidratación sin sensación pesada.',
      beneficios: [
        { icono: 'arrow-up-circle', titulo: 'Firmeza y elasticidad', texto: 'Péptidos Matrixyl 10 para una apariencia más firme.' },
        { icono: 'bezier2', titulo: 'Líneas de expresión', texto: 'Ayuda a suavizar su apariencia.' },
        { icono: 'droplet', titulo: 'Hidrata sin pesar', texto: 'Textura ligera que refuerza la barrera.' }
      ],
      ingredientes: ['Centella asiática de Madagascar', 'Matrixyl 10 (complejo de péptidos)'],
      modoUso: 'Aplica una cantidad adecuada sobre el rostro limpio antes de la crema hidratante, en la mañana y/o en la noche.'
    }),

    // ---------------- Cremas e hidratación ----------------
    p({
      id: 'probio-cica-enrich-cream', nombre: 'Madagascar Centella Probio-Cica Enrich Cream', categoria: 'hidratacion',
      precio: 101065, precioAnterior: 118900, fotos: 6, destacado: true,
      contenido: '50 ml', presentacion: 'Crema facial · 50 ml', registro: 'NSOC39813-25CO', ean: '8809576261769',
      resumen: 'Crema nutritiva con centella fermentada, ceramida NP y manteca de karité para piel seca y sensible.',
      descripcion: 'Crema densa pero ligera, enriquecida con centella asiática fermentada de Madagascar, ceramida NP y manteca de karité, para brindar hidratación intensa, calmar la piel y reforzar su barrera protectora sin dejar sensación pesada ni grasosa. Para piel seca, sensible o con la barrera comprometida.',
      beneficios: [
        { icono: 'droplet-fill', titulo: 'Nutrición profunda', texto: 'Manteca de karité y aceite de macadamia ayudan a retener la humedad.' },
        { icono: 'heart-pulse', titulo: 'Calma la piel sensible', texto: 'Centella fermentada y TECA.' },
        { icono: 'shield-check', titulo: 'Barrera y elasticidad', texto: 'Ceramida NP para fortalecer la barrera cutánea.' }
      ],
      ingredientes: ['Centella asiática fermentada de Madagascar', 'Ceramida NP', 'Manteca de karité', 'Aceite de semilla de macadamia', 'TECA'],
      modoUso: 'Aplica una cantidad adecuada como último paso de tu rutina y da suaves toques hasta su absorción.'
    }),
    p({
      id: 'hyalu-cica-sleeping-pack', nombre: 'Madagascar Centella Hyalu-Cica Sleeping Pack', categoria: 'hidratacion',
      precio: 34000, precioAnterior: 40000, fotos: 5, etiqueta: 'Nuevo', destacado: true,
      contenido: '30 ml', presentacion: 'Mascarilla de noche · 30 ml', registro: 'NSOC50022-26CO', ean: '8809576261004',
      resumen: 'Mascarilla nocturna en gel que hidrata durante el descanso y ayuda a despertar con la piel más luminosa.',
      descripcion: 'Mascarilla de noche que combina el complejo Hyalu-Cica (centella asiática de Madagascar y ácido hialurónico) con ceramidas, melatonina y niacinamida, para mantener la hidratación, favorecer la recuperación de la barrera cutánea y una apariencia más luminosa y descansada. Textura ligera en gel, sin sensación pesada ni pegajosa.',
      beneficios: [
        { icono: 'moon-stars', titulo: 'Hidratación nocturna', texto: 'Actúa mientras descansas.' },
        { icono: 'shield-check', titulo: 'Barrera cutánea', texto: 'Ceramidas para fortalecer la barrera natural.' },
        { icono: 'brightness-high', titulo: 'Luminosidad', texto: 'Niacinamida para una apariencia más luminosa al despertar.' }
      ],
      ingredientes: ['Centella asiática de Madagascar', 'Ácido hialurónico', 'Ceramidas', 'Melatonina', 'Niacinamida'],
      modoUso: 'Como último paso de la rutina nocturna, aplica una cantidad adecuada sobre el rostro evitando el contorno de ojos y labios. Déjala actuar toda la noche y enjuaga a la mañana siguiente.'
    }),
    p({
      id: 'tea-trica-b5-cream', nombre: 'Madagascar Centella Tea-Trica B5 Cream', categoria: 'hidratacion',
      precio: 95965, precioAnterior: 112900, fotos: 4,
      contenido: '75 ml', presentacion: 'Crema en gel · 75 ml', registro: 'NSOC39179-25CO', ean: '8809913830047',
      resumen: 'Crema en gel con 5 % de pantenol, árbol de té y centella para calmar e hidratar sin brillo.',
      descripcion: 'Crema en gel calmante e hidratante con 5 % de pantenol (vitamina B5), árbol de té (extracto y aceite), ceramida NP, exosoma de cica, centella asiática y ácido hialurónico. Ayuda a calmar la piel irritada, fortalecer la barrera cutánea y ofrecer una hidratación ligera. Textura en gel de rápida absorción con acabado fresco y sin brillos.',
      beneficios: [
        { icono: 'droplet', titulo: '5 % pantenol', texto: 'Hidrata y refuerza la protección natural de la piel.' },
        { icono: 'tree', titulo: 'Árbol de té', texto: 'Ayuda a calmar brotes y la apariencia del enrojecimiento.' },
        { icono: 'wind', titulo: 'Acabado sin brillo', texto: 'Gel fresco de rápida absorción para el uso diario.' }
      ],
      ingredientes: ['Pantenol (vitamina B5) 5 %', 'Árbol de té (extracto y aceite)', 'Ceramida NP', 'Exosoma de cica', 'Centella asiática', 'Ácido hialurónico'],
      modoUso: 'Aplica una cantidad adecuada sobre el rostro limpio como último paso de tu rutina, dando suaves toques hasta su absorción.'
    }),
    p({
      id: 'poremizing-light-gel-cream', nombre: 'Madagascar Centella Poremizing Light Gel Cream', categoria: 'hidratacion',
      precio: 84915, precioAnterior: 99900, fotos: 4,
      contenido: '75 ml', presentacion: 'Crema en gel · 75 ml', registro: 'NSOC39747-25CO', ean: '8809576261646',
      resumen: 'Crema en gel ligera con centella y sal rosa del Himalaya que hidrata sin obstruir los poros.',
      descripcion: 'Crema en gel que combina centella asiática de Madagascar con sal rosa del Himalaya para ofrecer una hidratación fresca y equilibrada, mientras ayuda a reducir la apariencia de los poros y controlar el exceso de grasa. Textura ligera y no pegajosa, ideal para piel mixta a grasa y climas cálidos.',
      beneficios: [
        { icono: 'droplet', titulo: 'Hidrata sin obstruir', texto: 'Hidratación ligera que respeta los poros.' },
        { icono: 'wind', titulo: 'Controla el brillo', texto: 'Acabado fresco, ideal para climas cálidos.' },
        { icono: 'shield-check', titulo: 'Calma la piel', texto: 'Centella para fortalecer la barrera cutánea.' }
      ],
      ingredientes: ['Centella asiática de Madagascar', 'Sal rosa del Himalaya'],
      modoUso: 'Aplica una cantidad adecuada sobre el rostro limpio y masajea hasta su absorción.'
    }),

    // ---------------- Protección solar ----------------
    p({
      id: 'water-fit-sun-serum', nombre: 'Madagascar Centella Hyalu-Cica Water-Fit Sun Serum SPF50+', categoria: 'proteccion-solar',
      precio: 84065, precioAnterior: 98900, fotos: 5, destacado: true,
      contenido: '50 ml', presentacion: 'Protector solar en sérum SPF50+ PA++++ · 50 ml', registro: 'NSOC39317-25CO', ean: '8809576261592',
      resumen: 'Protector solar SPF50+ PA++++ en formato sérum ultraligero que protege, hidrata y calma.',
      descripcion: 'Protector solar en formato sérum ultraligero, con SPF50+ PA++++. Centella asiática y ácido hialurónico mantienen la piel hidratada y aliviada, y sus agentes despigmentantes ayudan con los tonos irregulares por exposición al sol. Textura suave y liviana para usar todos los días.',
      beneficios: [
        { icono: 'sun', titulo: 'SPF50+ PA++++', texto: 'Protección alta frente a los rayos UVA y UVB.' },
        { icono: 'droplet', titulo: 'Hidrata y calma', texto: 'Centella asiática y ácido hialurónico.' },
        { icono: 'feather', titulo: 'Sérum ultraligero', texto: 'Textura liviana, cómoda para el uso diario.' }
      ],
      ingredientes: ['Centella asiática', 'Ácido hialurónico', 'Filtros solares SPF50+ PA++++'],
      advertencias: ADV.concat('El protector solar es un complemento: evite la exposición prolongada al sol y reaplíquelo durante el día.'),
      modoUso: 'Aplica de manera uniforme y en dosis generosas en rostro, cuello, escote y manos por la mañana o 30 minutos antes de la exposición solar. Reaplica con frecuencia durante el día.'
    }),

    // ---------------- Kits ----------------
    p({
      id: 'ampoule-kit-4', nombre: 'Madagascar Centella Ampoule Kit (4 piezas)', categoria: 'kits',
      precio: 146115, precioAnterior: 171900, fotos: 3, etiqueta: 'Ideal para regalar', destacado: true,
      contenido: '4 × 30 ml', presentacion: 'Kit de 4 ampollas · 4 × 30 ml', registro: 'NSOC39174-25CO, NSOC39527-25CO, NSOC39397-25CO, NSOC39697-25CO', ean: '8809576261868',
      resumen: 'Cuatro ampollas con centella de Madagascar, cada una para una necesidad: calmar, iluminar, equilibrar poros y proteger.',
      descripcion: 'Kit con 4 ampollas faciales concentradas, formuladas con centella asiática de Madagascar, para piel sensible, mixta o con imperfecciones. Centella Ampoule calma y fortalece la piel irritada; Tone Brightening Ampoule ayuda a iluminar y unificar el tono; Poremizing Ampoule ayuda a regular la grasa y afinar la apariencia de los poros; Tea-Trica Ampoule es antioxidante y fortalece la barrera.',
      beneficios: [
        { icono: 'grid', titulo: 'Cuatro ampollas', texto: 'Centella, Tone Brightening, Poremizing y Tea-Trica.' },
        { icono: 'sliders', titulo: 'Rutina adaptable', texto: 'Elige la ampolla según lo que tu piel necesite cada día.' },
        { icono: 'gift', titulo: 'Para probar o regalar', texto: 'Presentación en caja, en tamaño de 30 ml.' }
      ],
      ingredientes: ['Centella asiática de Madagascar'],
      modoUso: 'Aplica unas gotas de la ampolla elegida sobre la piel limpia después del tónico y continúa con la crema hidratante.'
    })
  ];

  const IMG = 'assets/images/products/';

  VT.catalogo = {
    categorias,
    productos,
    porId: (id) => productos.find((x) => x.id === id) || null,
    categoria: (id) => categorias.find((c) => c.id === id) || null,
    porCategoria: (id) => productos.filter((x) => x.categoria === id),
    destacados: () => productos.filter((x) => x.destacado),
    // Misma categoría primero; luego destacados de otras categorías.
    relacionados(producto, n = 4) {
      const misma = productos.filter((x) => x.categoria === producto.categoria && x.id !== producto.id);
      const otras = productos.filter((x) => x.categoria !== producto.categoria && x.destacado);
      return misma.concat(otras).slice(0, n);
    },
    totalOpiniones: (x) => (x.valoracion ? x.valoracion.distribucion.reduce((a, b) => a + b, 0) : 0),
    // Ruta relativa a la raíz del sitio; app.js antepone el prefijo de la página.
    imagen: (x, vista = 'frente', ancho = 900) => `${IMG}${x.id}/${vista}-${ancho}.webp`,
    // frente = envase sobre fondo blanco; foto-2 … foto-N = fotos de ambiente
    vistasDe(x) {
      const n = Math.max(1, x.fotos || 1);
      return Array.from({ length: n }, (_, i) => (i === 0 ? { id: 'frente', nombre: 'Envase' } : { id: `foto-${i + 1}`, nombre: `Foto ${i + 1}` }));
    }
  };
})(window.VT = window.VT || {});
