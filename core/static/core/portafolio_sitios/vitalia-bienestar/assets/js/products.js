/* VITALIA — catálogo demostrativo.
 * Productos, precios, valoraciones y opiniones son ficticios. Antes de publicar una
 * tienda real, cada ficha debe reemplazarse por la información verificada del
 * fabricante (composición, registro sanitario, advertencias y modo de uso).
 *
 * Imágenes: assets/images/products/<id>/<vista>-<ancho>.webp
 *   vistas: frente, posterior, lateral, ingredientes, entorno, presentacion (400 y 900 px, 4:5)
 *   comparador: comparar-antes / comparar-despues (1200 px, 4:3)
 * Se generan con tools/render.js a partir del campo «envase»; para usar fotos reales,
 * basta con sustituir esos archivos manteniendo nombre y proporción.
 */
(function (VT) {
  'use strict';

  const categorias = [
    { id: 'bienestar-diario', nombre: 'Bienestar diario', color: '#9BD7E0', resumen: 'Bebidas e infusiones para acompañar los momentos tranquilos del día.' },
    { id: 'nutricion', nombre: 'Nutrición', color: '#EEDFEA', resumen: 'Polvos y mezclas para preparar en casa, con la etiqueta a la vista.' },
    { id: 'vitaminas', nombre: 'Vitaminas y minerales', color: '#F2B8D9', resumen: 'Complementos con composición declarada y advertencias claras.' },
    { id: 'cuidado-personal', nombre: 'Cuidado personal', color: '#83CF9E', resumen: 'Higiene y cuidado del cuerpo con texturas suaves y aromas botánicos.' },
    { id: 'cuidado-capilar', nombre: 'Cuidado capilar', color: '#F2B8D9', resumen: 'Shampoo, acondicionador y tónico para una rutina de cabello sencilla.' },
    { id: 'cosmetica', nombre: 'Cosmética', color: '#E7C6DA', resumen: 'Fórmulas faciales y labiales para una rutina corta y constante.' },
    { id: 'accesorios', nombre: 'Accesorios de bienestar', color: '#5E1F5B', resumen: 'Objetos que ayudan a ordenar la rutina y llevarla contigo.' }
  ];

  // Advertencias comunes a los complementos. Son textos de referencia que
  // deben confirmarse con la etiqueta aprobada de cada producto real.
  const ADV_COMPLEMENTO = [
    'No supere la porción indicada en la etiqueta del fabricante.',
    'Si está en embarazo, en lactancia, toma medicamentos o tiene una condición de salud, consulte a un profesional antes de usarlo.',
    'Este producto no es un medicamento y no sustituye una alimentación variada y equilibrada.',
    'Manténgase fuera del alcance de los niños.'
  ];
  const ADV_COSMETICO = [
    'Solo para uso externo. Evite el contacto con los ojos.',
    'Haga una prueba en una zona pequeña antes del primer uso. Suspenda si nota irritación.',
    'Manténgase fuera del alcance de los niños.'
  ];
  const USO_COMPLEMENTO = null; // nunca se publican porciones inventadas

  const productos = [
    {
      id: 'vitamina-c-zinc', nombre: 'Vitamina C + Zinc', categoria: 'vitaminas',
      precio: 58900, precioAnterior: 66900, etiqueta: 'Precio de lanzamiento', destacado: true,
      presentacion: 'Frasco de vidrio ámbar · 60 cápsulas vegetales',
      resumen: 'Complemento en cápsulas vegetales, en frasco de vidrio ámbar que protege el contenido de la luz.',
      descripcion: 'Una presentación sencilla para quien ya decidió incluir vitamina C y zinc en su rutina, junto con su profesional de la salud. El frasco de vidrio ámbar reduce la exposición a la luz y la tapa de rosca mantiene el contenido seco. La etiqueta reúne en un solo lugar la composición, la porción del fabricante y las advertencias.',
      beneficios: [
        { icono: 'brightness-alt-high', titulo: 'Vidrio ámbar', texto: 'Filtra buena parte de la luz que puede alterar el contenido.' },
        { icono: 'flower1', titulo: 'Cápsula de origen vegetal', texto: 'Cubierta elaborada sin gelatina animal (dato demostrativo).' },
        { icono: 'card-checklist', titulo: 'Etiqueta completa', texto: 'Composición, porción y advertencias visibles antes de comprar.' }
      ],
      ingredientes: ['Ácido ascórbico (vitamina C)', 'Citrato de zinc', 'Cubierta: hidroxipropilmetilcelulosa', 'Antiaglomerante: celulosa microcristalina'],
      composicion: 'Contenido por porción pendiente de la ficha técnica del fabricante.',
      modoUso: USO_COMPLEMENTO,
      advertencias: ADV_COMPLEMENTO,
      conservacion: 'Lugar fresco y seco, por debajo de 30 °C. Cierre bien el frasco después de cada uso.',
      ingredienteFoto: 'naranja', ingredienteTexto: 'Naranja: imagen ilustrativa. La vitamina C de la fórmula no proviene necesariamente de esta fruta.',
      envase: { forma: 'frasco', vidrio: '#8A4B12', tapa: '#F3EFE6', banda: '#B0018F', etiqueta: '#FFFBFD', contenido: '60 cápsulas', medida: '9,5 × 5 cm' },
      comparacion: { tipo: 'presentacion' },
      entorno: 'cocina',
      valoracion: { promedio: 4.7, distribucion: [14, 4, 1, 0, 0] },
      opiniones: [
        { nombre: 'Laura M.', fecha: '2026-09-14', puntuacion: 5, texto: 'Me gustó encontrar la composición completa antes de pagar. El frasco de vidrio se siente de buena calidad.' },
        { nombre: 'Andrés P.', fecha: '2026-08-30', puntuacion: 5, texto: 'Las cápsulas son pequeñas y fáciles de tomar. Lo consulté primero con mi médica, como sugiere la ficha.' },
        { nombre: 'Camila R.', fecha: '2026-08-02', puntuacion: 4, texto: 'Buena presentación. Me habría gustado una versión con más unidades.' }
      ],
      faq: [
        { p: '¿Dónde veo la porción recomendada?', r: 'En la etiqueta posterior del frasco, definida por el fabricante. En este prototipo no se publica una porción para no inventar instrucciones de consumo.' },
        { p: '¿Puedo tomarlo con otros complementos?', r: 'Esa decisión depende de tu situación. Consulta con un profesional de la salud antes de combinar complementos.' },
        { p: '¿El frasco es reciclable?', r: 'El vidrio ámbar es reciclable. La tapa debe separarse antes de depositarlo.' }
      ]
    },
    {
      id: 'magnesio-noche', nombre: 'Magnesio Noche', categoria: 'vitaminas',
      precio: 64900, precioAnterior: null, etiqueta: 'Nuevo', destacado: true,
      presentacion: 'Frasco de vidrio azul · 90 cápsulas vegetales',
      resumen: 'Bisglicinato de magnesio en cápsulas, pensado para quien prefiere tomar sus complementos al final del día.',
      descripcion: 'Magnesio Noche reúne bisglicinato de magnesio en cápsulas vegetales dentro de un frasco de vidrio azul petróleo. El nombre se refiere al momento del día en que muchas personas organizan sus complementos, no a un efecto sobre el sueño. Consulta con tu profesional de la salud si es adecuado para ti.',
      beneficios: [
        { icono: 'moon-stars', titulo: 'Para tu rutina de la noche', texto: 'Diseño y nombre pensados para ubicarlo fácilmente junto a tu mesa de noche.' },
        { icono: 'droplet-half', titulo: 'Cápsula sin sabor', texto: 'No necesitas mezclarla ni prepararla.' },
        { icono: 'recycle', titulo: 'Envase retornable', texto: 'Propuesta de programa de retorno de frascos (por confirmar).' }
      ],
      ingredientes: ['Bisglicinato de magnesio', 'Cubierta: hidroxipropilmetilcelulosa', 'Antiaglomerante: estearato de magnesio vegetal'],
      composicion: 'Contenido por porción pendiente de la ficha técnica del fabricante.',
      modoUso: USO_COMPLEMENTO,
      advertencias: ADV_COMPLEMENTO,
      conservacion: 'Lugar fresco y seco, lejos de la luz directa del sol.',
      ingredienteFoto: 'semillas', ingredienteTexto: 'Semillas de calabaza: imagen ilustrativa de alimentos que contienen magnesio.',
      envase: { forma: 'frasco', vidrio: '#1F4B5A', tapa: '#E9E3D6', banda: '#9BD7E0', etiqueta: '#FFFBFD', contenido: '90 cápsulas', medida: '11 × 5,5 cm' },
      comparacion: { tipo: 'presentacion' },
      entorno: 'lino',
      valoracion: { promedio: 4.6, distribucion: [11, 5, 1, 0, 0] },
      opiniones: [
        { nombre: 'Natalia G.', fecha: '2026-09-21', puntuacion: 5, texto: 'El frasco azul es precioso y lo tengo a la vista en la mesa de noche. La etiqueta se lee bien.' },
        { nombre: 'Julián T.', fecha: '2026-09-03', puntuacion: 4, texto: 'Cápsulas sin olor. El envío de prueba llegó bien empacado.' },
        { nombre: 'Sofía L.', fecha: '2026-08-11', puntuacion: 5, texto: 'Me gusta que no prometa cosas raras y explique para qué sirve el nombre.' }
      ],
      faq: [
        { p: '¿Ayuda a dormir?', r: 'No hacemos esa afirmación. El nombre indica el momento del día en el que muchas personas organizan sus complementos. Consulta con un profesional si buscas apoyo para el descanso.' },
        { p: '¿Qué es el bisglicinato?', r: 'Es una forma de magnesio unida a glicina. La información técnica completa debe venir del fabricante.' },
        { p: '¿Cuánto dura un frasco?', r: 'Depende de la porción indicada en la etiqueta del fabricante, que no se publica en este prototipo.' }
      ]
    },
    {
      id: 'omega-algas', nombre: 'Omega 3 de Algas', categoria: 'vitaminas',
      precio: 89900, precioAnterior: null, etiqueta: '', destacado: false,
      presentacion: 'Frasco de vidrio ámbar · 60 cápsulas blandas',
      resumen: 'Aceite de microalgas en cápsulas blandas de origen vegetal, una alternativa sin aceite de pescado.',
      descripcion: 'Una opción para quienes prefieren obtener omega 3 de microalgas en lugar de pescado. Las cápsulas blandas se elaboran con almidón y carragenina (dato demostrativo) y se envasan en vidrio ámbar con tapa hermética.',
      beneficios: [
        { icono: 'water', titulo: 'Origen vegetal', texto: 'Aceite obtenido de microalgas cultivadas, no de pescado.' },
        { icono: 'shield-check', titulo: 'Cierre hermético', texto: 'Tapa con sello interior para conservar el aceite.' },
        { icono: 'card-checklist', titulo: 'Composición declarada', texto: 'EPA y DHA indicados en la etiqueta del fabricante.' }
      ],
      ingredientes: ['Aceite de microalgas (Schizochytrium sp.)', 'Cápsula: almidón modificado, carragenina, glicerina', 'Antioxidante: tocoferoles mixtos'],
      composicion: 'Contenido de EPA y DHA por porción pendiente de la ficha técnica del fabricante.',
      modoUso: USO_COMPLEMENTO,
      advertencias: ADV_COMPLEMENTO,
      conservacion: 'Después de abierto, mantener refrigerado y consumir antes de la fecha indicada en el envase.',
      ingredienteFoto: 'algas', ingredienteTexto: 'Algas: imagen ilustrativa. El aceite proviene de microalgas cultivadas.',
      envase: { forma: 'frasco', vidrio: '#7A4A1A', tapa: '#AB004E', banda: '#AB004E', etiqueta: '#F4F1E8', contenido: '60 cápsulas blandas', medida: '10 × 5 cm' },
      comparacion: { tipo: 'presentacion' },
      entorno: 'cocina',
      valoracion: { promedio: 4.5, distribucion: [7, 4, 1, 0, 0] },
      opiniones: [
        { nombre: 'Daniela V.', fecha: '2026-09-09', puntuacion: 5, texto: 'Buscaba una opción sin pescado y la ficha explica bien de dónde sale el aceite.' },
        { nombre: 'Mateo S.', fecha: '2026-07-26', puntuacion: 4, texto: 'Las cápsulas no dejan sabor. El precio es algo alto.' },
        { nombre: 'Valentina O.', fecha: '2026-07-04', puntuacion: 5, texto: 'Me gustó el empaque y la advertencia de refrigerar después de abrir.' }
      ],
      faq: [
        { p: '¿Es apto para personas veganas?', r: 'La fórmula demostrativa no contiene ingredientes animales. Una tienda real debe confirmarlo con la certificación correspondiente, que este prototipo no tiene.' },
        { p: '¿Por qué refrigerarlo?', r: 'Los aceites se oxidan con el calor y el aire. La refrigeración ayuda a conservarlos una vez abierto el frasco.' }
      ]
    },
    {
      id: 'proteina-vegetal-vainilla', nombre: 'Proteína Vegetal Vainilla', categoria: 'nutricion',
      precio: 119900, precioAnterior: 134900, etiqueta: 'Precio de lanzamiento', destacado: true,
      presentacion: 'Tarro de 500 g',
      resumen: 'Proteína de arveja y arroz en polvo con vainilla natural, para batidos y preparaciones en casa.',
      descripcion: 'Una mezcla en polvo de proteína de arveja y de arroz, endulzada con stevia y saborizada con vainilla natural. Se disuelve en bebidas o se incorpora a preparaciones como avena o pancakes. El tarro incluye una cuchara medidora y un cierre de rosca amplio.',
      beneficios: [
        { icono: 'cup-straw', titulo: 'Se integra fácil', texto: 'Polvo fino pensado para mezclarse con leche, bebida vegetal o agua.' },
        { icono: 'flower2', titulo: 'Fuentes vegetales', texto: 'Arveja y arroz como fuentes de proteína (dato demostrativo).' },
        { icono: 'egg-fried', titulo: 'Versátil en la cocina', texto: 'Sirve para batidos, avenas y recetas horneadas.' }
      ],
      ingredientes: ['Proteína aislada de arveja', 'Proteína de arroz integral', 'Saborizante natural de vainilla', 'Edulcorante: glucósidos de esteviol', 'Goma xantana'],
      composicion: 'Tabla nutricional pendiente de la ficha técnica del fabricante.',
      modoUso: USO_COMPLEMENTO,
      advertencias: ['Puede contener trazas de soya y frutos secos (dato demostrativo).', 'No sustituye una comida completa.', 'Manténgase fuera del alcance de los niños.'],
      conservacion: 'Lugar fresco y seco. Cierre bien el tarro y use la cuchara seca.',
      ingredienteFoto: 'arveja', ingredienteTexto: 'Arvejas: imagen ilustrativa de la fuente vegetal de la proteína.',
      envase: { forma: 'tarro', vidrio: '#E9E2D2', tapa: '#AB004E', banda: '#EEDFEA', etiqueta: '#FFFBFD', contenido: '500 g', medida: '14 × 11 cm' },
      comparacion: { tipo: 'textura', antes: 'Polvo en la cuchara', despues: 'Mezclado en bebida', colorA: '#EFE6D2', colorB: '#F4EBDD' },
      entorno: 'cocina',
      valoracion: { promedio: 4.4, distribucion: [10, 7, 2, 1, 0] },
      opiniones: [
        { nombre: 'Felipe C.', fecha: '2026-09-18', puntuacion: 5, texto: 'Se disuelve bien en bebida de almendras. El sabor a vainilla es suave.' },
        { nombre: 'Mariana B.', fecha: '2026-08-24', puntuacion: 4, texto: 'La uso en la avena de la mañana. El tarro es grande y cierra bien.' },
        { nombre: 'Esteban Q.', fecha: '2026-08-01', puntuacion: 3, texto: 'Me gustó, pero prefiero sabores menos dulces.' }
      ],
      faq: [
        { p: '¿Tiene azúcar añadida?', r: 'La fórmula demostrativa usa stevia. Verifica siempre la tabla nutricional del producto real.' },
        { p: '¿Cuántas porciones trae?', r: 'Depende de la porción definida por el fabricante en la tabla nutricional, que no se publica en este prototipo.' }
      ]
    },
    {
      id: 'ritual-matinal', nombre: 'Ritual Matinal Avena y Cacao', categoria: 'nutricion',
      precio: 46900, precioAnterior: null, etiqueta: '', destacado: false,
      presentacion: 'Bolsa resellable de 400 g',
      resumen: 'Mezcla de avena, cacao y canela para preparar una bebida caliente o fría en minutos.',
      descripcion: 'Avena en hojuelas finas, cacao en polvo y un toque de canela, listos para mezclar con leche o bebida vegetal. La bolsa tiene cierre resellable y una ventana que deja ver el producto.',
      beneficios: [
        { icono: 'cup-hot', titulo: 'Fría o caliente', texto: 'Se prepara en licuadora o directamente en la olla.' },
        { icono: 'eye', titulo: 'Ventana transparente', texto: 'Ves la mezcla antes de abrir la bolsa.' },
        { icono: 'lock', titulo: 'Cierre resellable', texto: 'Mantiene la mezcla seca entre usos.' }
      ],
      ingredientes: ['Avena en hojuelas finas', 'Cacao en polvo', 'Panela pulverizada', 'Canela molida'],
      composicion: 'Tabla nutricional pendiente de la ficha técnica del fabricante.',
      modoUso: 'Mezcla la cantidad que indique la etiqueta con tu bebida preferida y licúa o calienta hasta integrar.',
      advertencias: ['Puede contener trazas de gluten por procesamiento compartido (dato demostrativo).', 'Manténgase fuera del alcance de los niños.'],
      conservacion: 'Lugar fresco y seco. Cierre la bolsa después de cada uso.',
      ingredienteFoto: 'avena', ingredienteTexto: 'Avena con cacao: imagen ilustrativa de la preparación.',
      envase: { forma: 'doypack', vidrio: '#D8C6A0', tapa: '#5C3B26', banda: '#5C3B26', etiqueta: '#F4EBDD', contenido: '400 g', medida: '22 × 15 cm' },
      comparacion: { tipo: 'textura', antes: 'Mezcla en seco', despues: 'Bebida preparada', colorA: '#B8956B', colorB: '#8A5E3F' },
      entorno: 'madera',
      valoracion: { promedio: 4.8, distribucion: [16, 3, 0, 0, 0] },
      opiniones: [
        { nombre: 'Paula E.', fecha: '2026-09-25', puntuacion: 5, texto: 'Mi desayuno favorito de esta semana de prueba. El cacao no es amargo.' },
        { nombre: 'Santiago H.', fecha: '2026-09-02', puntuacion: 5, texto: 'La bolsa cierra bien y la ventana ayuda a saber cuánto queda.' },
        { nombre: 'Isabela N.', fecha: '2026-08-15', puntuacion: 4, texto: 'Rica fría con hielo. La canela se siente poco.' }
      ],
      faq: [
        { p: '¿Es libre de gluten?', r: 'No lo afirmamos: la avena puede compartir procesos con cereales que contienen gluten. Una tienda real debe confirmarlo con el fabricante.' },
        { p: '¿Se puede preparar con agua?', r: 'Sí, aunque la textura será más ligera que con leche o bebida vegetal.' }
      ]
    },
    {
      id: 'colageno-frutos-rojos', nombre: 'Colágeno Frutos Rojos', categoria: 'bienestar-diario',
      precio: 98900, precioAnterior: 109900, etiqueta: 'Precio de lanzamiento', destacado: true,
      presentacion: 'Tarro de 300 g',
      resumen: 'Colágeno hidrolizado en polvo con sabor a frutos rojos, para disolver en agua fría o tibia.',
      descripcion: 'Polvo de colágeno hidrolizado con frutos rojos deshidratados y un color natural de remolacha. Se disuelve en agua fría o tibia y no necesita licuadora. Su efecto depende de cada persona y de su alimentación; no prometemos resultados en la piel, el cabello ni las articulaciones.',
      beneficios: [
        { icono: 'droplet', titulo: 'Se disuelve en frío', texto: 'Basta con revolver unos segundos en un vaso de agua.' },
        { icono: 'palette', titulo: 'Color natural', texto: 'El tono rosado viene de la remolacha en polvo.' },
        { icono: 'box2-heart', titulo: 'Cuchara incluida', texto: 'Medidor dentro del tarro para seguir la etiqueta.' }
      ],
      ingredientes: ['Colágeno hidrolizado bovino', 'Frutos rojos deshidratados (fresa, frambuesa, arándano)', 'Remolacha en polvo', 'Ácido cítrico', 'Edulcorante: glucósidos de esteviol'],
      composicion: 'Tabla nutricional pendiente de la ficha técnica del fabricante.',
      modoUso: USO_COMPLEMENTO,
      advertencias: ADV_COMPLEMENTO,
      conservacion: 'Lugar fresco y seco. Use la cuchara seca y cierre bien el tarro.',
      ingredienteFoto: 'frutos', ingredienteTexto: 'Frambuesas y arándanos: imagen ilustrativa del sabor.',
      envase: { forma: 'tarro', vidrio: '#F1E4E1', tapa: '#9BD7E0', banda: '#C96A7A', etiqueta: '#FFFBFD', contenido: '300 g', medida: '12 × 10 cm' },
      comparacion: { tipo: 'textura', antes: 'Polvo en la cuchara', despues: 'Disuelto en agua', colorA: '#E7B9BF', colorB: '#E58E9C' },
      entorno: 'lino',
      valoracion: { promedio: 4.6, distribucion: [13, 5, 1, 0, 0] },
      opiniones: [
        { nombre: 'Carolina F.', fecha: '2026-09-27', puntuacion: 5, texto: 'Sabe a frutos rojos sin ser empalagoso. Se disuelve muy bien.' },
        { nombre: 'Diana K.', fecha: '2026-09-06', puntuacion: 4, texto: 'Me gusta que la ficha diga claramente que no promete resultados.' },
        { nombre: 'Tomás A.', fecha: '2026-08-19', puntuacion: 5, texto: 'El tarro es bonito y la cuchara viene dentro, como dice la descripción.' }
      ],
      faq: [
        { p: '¿Mejora la piel o el cabello?', r: 'No hacemos esa afirmación. Si buscas un objetivo concreto, consulta con un profesional de la salud.' },
        { p: '¿De qué origen es el colágeno?', r: 'En la fórmula demostrativa es de origen bovino. Confirma siempre el origen con la etiqueta del producto real.' }
      ]
    },
    {
      id: 'infusion-calma', nombre: 'Infusión Calma', categoria: 'bienestar-diario',
      precio: 32900, precioAnterior: null, etiqueta: '', destacado: true,
      presentacion: 'Caja con 20 bolsitas',
      resumen: 'Mezcla de manzanilla, toronjil y cáscara de naranja en bolsitas biodegradables.',
      descripcion: 'Una infusión floral y suave para preparar en una taza de agua caliente. La caja está hecha de cartón reciclado y las bolsitas, de fibra vegetal sin grapas (dato demostrativo). El nombre describe el momento de pausa que acompaña, no un efecto.',
      beneficios: [
        { icono: 'cup-hot', titulo: 'Sabor floral suave', texto: 'Manzanilla y toronjil con un final cítrico.' },
        { icono: 'leaf', titulo: 'Bolsitas sin grapa', texto: 'Fibra vegetal que se puede compostar (por confirmar).' },
        { icono: 'box', titulo: 'Caja reciclada', texto: 'Cartón con tintas de base vegetal.' }
      ],
      ingredientes: ['Flores de manzanilla', 'Hojas de toronjil', 'Cáscara de naranja deshidratada', 'Hojas de hierbabuena'],
      composicion: 'Proporción de cada planta pendiente de la ficha técnica del fabricante.',
      modoUso: 'Deja reposar una bolsita en agua caliente entre 3 y 5 minutos y retírala.',
      advertencias: ['Si está en embarazo, en lactancia o toma medicamentos, consulte a un profesional antes de consumir infusiones de plantas.', 'Manténgase fuera del alcance de los niños.'],
      conservacion: 'Lugar fresco, seco y lejos de olores fuertes.',
      ingredienteFoto: 'manzanilla', ingredienteTexto: 'Flores de manzanilla secas: imagen ilustrativa.',
      envase: { forma: 'caja', vidrio: '#DDF2F5', tapa: '#AB004E', banda: '#9BD7E0', etiqueta: '#FFFBFD', contenido: '20 bolsitas', medida: '13 × 7 × 7 cm' },
      comparacion: { tipo: 'textura', antes: 'Mezcla seca', despues: 'Infusión servida', colorA: '#C9B98A', colorB: '#D9B65C' },
      entorno: 'madera',
      valoracion: { promedio: 4.9, distribucion: [18, 2, 0, 0, 0] },
      opiniones: [
        { nombre: 'Gabriela S.', fecha: '2026-10-01', puntuacion: 5, texto: 'Sabor delicado. La caja se ve muy bien en la cocina.' },
        { nombre: 'Ricardo D.', fecha: '2026-09-12', puntuacion: 5, texto: 'Las bolsitas no tienen grapa y eso me gusta.' },
        { nombre: 'Lina P.', fecha: '2026-08-27', puntuacion: 5, texto: 'Me la tomo después de la cena. Muy aromática.' }
      ],
      faq: [
        { p: '¿Contiene cafeína?', r: 'Las plantas de la mezcla demostrativa no contienen cafeína. Confírmalo en la etiqueta del producto real.' },
        { p: '¿Puedo prepararla fría?', r: 'Sí: prepárala caliente, déjala enfriar y sírvela con hielo.' }
      ]
    },
    {
      id: 'serum-hialuronico', nombre: 'Sérum Hidratante Hialurónico', categoria: 'cosmetica',
      precio: 79900, precioAnterior: null, etiqueta: 'Nuevo', destacado: true,
      presentacion: 'Frasco gotero de 30 ml',
      resumen: 'Sérum ligero con ácido hialurónico y aloe vera, de absorción rápida y sin fragancia añadida.',
      descripcion: 'Un sérum acuoso con ácido hialurónico de dos pesos moleculares y gel de aloe vera. Se absorbe rápido y deja una sensación fresca, sin película grasa. No tiene fragancia añadida. Los resultados cosméticos varían según la piel y la rutina de cada persona.',
      beneficios: [
        { icono: 'droplet-half', titulo: 'Textura acuosa', texto: 'Se extiende con facilidad y se absorbe en segundos.' },
        { icono: 'eyedropper', titulo: 'Gotero de vidrio', texto: 'Dosifica pocas gotas sin tocar el producto con los dedos.' },
        { icono: 'slash-circle', titulo: 'Sin fragancia añadida', texto: 'Pensado para quienes prefieren productos sin perfume.' }
      ],
      ingredientes: ['Aqua', 'Aloe barbadensis leaf juice', 'Sodium hyaluronate', 'Glycerin', 'Panthenol', 'Phenoxyethanol'],
      composicion: 'Lista INCI demostrativa. Debe sustituirse por la lista aprobada del fabricante.',
      modoUso: 'Aplica unas gotas sobre el rostro limpio, extiende con suaves toques y continúa con tu crema habitual.',
      advertencias: ADV_COSMETICO,
      conservacion: 'Lugar fresco, lejos de la luz directa. Cierre bien el gotero después de usar.',
      ingredienteFoto: 'aloe', ingredienteTexto: 'Hojas de aloe vera: imagen ilustrativa.',
      envase: { forma: 'gotero', vidrio: '#F1DDEA', tapa: '#5E1F5B', banda: '#9BD7E0', etiqueta: '#FFFBFD', contenido: '30 ml', medida: '10,5 × 3,5 cm' },
      comparacion: { tipo: 'textura', antes: 'Gota recién aplicada', despues: 'Textura extendida', colorA: '#DDEBEE', colorB: '#E8F1F2' },
      entorno: 'bano',
      valoracion: { promedio: 4.7, distribucion: [15, 4, 1, 0, 0] },
      opiniones: [
        { nombre: 'Manuela Z.', fecha: '2026-09-29', puntuacion: 5, texto: 'Ligero de verdad. Lo uso antes de la crema y no se siente pegajoso.' },
        { nombre: 'Alejandra W.', fecha: '2026-09-15', puntuacion: 5, texto: 'Me gustó que no tenga perfume. El gotero es práctico.' },
        { nombre: 'Juan D.', fecha: '2026-08-21', puntuacion: 4, texto: 'Buena textura. Me habría gustado una presentación de 50 ml.' }
      ],
      faq: [
        { p: '¿Sirve para todo tipo de piel?', r: 'Su textura es ligera, pero cada piel reacciona distinto. Haz una prueba en una zona pequeña antes del primer uso.' },
        { p: '¿Se usa de día o de noche?', r: 'Puede incorporarse en cualquier momento de la rutina. De día, completa siempre con protector solar.' }
      ]
    },
    {
      id: 'balsamo-labial-cacao', nombre: 'Bálsamo Labial de Cacao', categoria: 'cosmetica',
      precio: 21900, precioAnterior: null, etiqueta: '', destacado: false,
      presentacion: 'Tubo de 10 g',
      resumen: 'Bálsamo con manteca de cacao y aceite de almendras, con un ligero aroma a chocolate.',
      descripcion: 'Un bálsamo de textura cremosa para llevar en el bolsillo. Combina manteca de cacao, cera de candelilla y aceite de almendras. Deja un brillo suave, sin color.',
      beneficios: [
        { icono: 'emoji-smile', titulo: 'Textura cremosa', texto: 'Se desliza sin arrastrar y deja un brillo discreto.' },
        { icono: 'bag', titulo: 'Formato de bolsillo', texto: 'Tubo compacto con tapa a presión.' },
        { icono: 'flower3', titulo: 'Cera vegetal', texto: 'Candelilla en lugar de cera de abejas (dato demostrativo).' }
      ],
      ingredientes: ['Theobroma cacao seed butter', 'Euphorbia cerifera wax', 'Prunus amygdalus dulcis oil', 'Tocopherol', 'Aroma'],
      composicion: 'Lista INCI demostrativa. Debe sustituirse por la lista aprobada del fabricante.',
      modoUso: 'Aplica sobre los labios cuantas veces quieras durante el día.',
      advertencias: ['Contiene aceite de almendras: no usar en caso de alergia a frutos secos.', 'Suspenda el uso si nota irritación.'],
      conservacion: 'Evite dejarlo al sol o dentro del carro: la manteca de cacao se ablanda con el calor.',
      ingredienteFoto: 'manteca', ingredienteTexto: 'Textura de manteca vegetal: imagen ilustrativa.',
      envase: { forma: 'tubo', vidrio: '#F1E7DA', tapa: '#5C3B26', banda: '#9BD7E0', etiqueta: '#F1E7DA', contenido: '10 g', medida: '9 × 2 cm', pequeno: true },
      comparacion: { tipo: 'textura', antes: 'Bálsamo en barra', despues: 'Textura sobre la piel', colorA: '#E9D6BC', colorB: '#EFE2CE' },
      entorno: 'bano',
      valoracion: { promedio: 4.3, distribucion: [6, 4, 2, 0, 0] },
      opiniones: [
        { nombre: 'Verónica J.', fecha: '2026-09-17', puntuacion: 5, texto: 'Huele delicioso y dura bastante en los labios.' },
        { nombre: 'Kevin R.', fecha: '2026-08-28', puntuacion: 4, texto: 'Práctico para llevar. En clima caliente se ablanda un poco.' },
        { nombre: 'Luisa F.', fecha: '2026-08-05', puntuacion: 4, texto: 'Buen precio y bonita presentación.' }
      ],
      faq: [
        { p: '¿Tiene color?', r: 'No. Deja un brillo transparente.' },
        { p: '¿Lo puede usar cualquier persona?', r: 'Contiene aceite de almendras: las personas con alergia a frutos secos no deben usarlo.' }
      ]
    },
    {
      id: 'gel-ducha-eucalipto', nombre: 'Gel de Ducha Eucalipto', categoria: 'cuidado-personal',
      precio: 38900, precioAnterior: 42900, etiqueta: 'Precio de lanzamiento', destacado: true,
      presentacion: 'Botella con dispensador · 400 ml',
      resumen: 'Gel de ducha de espuma suave con aceite esencial de eucalipto y romero.',
      descripcion: 'Un gel de ducha de pH equilibrado (dato demostrativo) con tensioactivos suaves y un aroma fresco de eucalipto y romero. La botella de plástico reciclado trae dispensador para dosificar sin desperdicio.',
      beneficios: [
        { icono: 'wind', titulo: 'Aroma fresco', texto: 'Eucalipto y romero con aceites esenciales.' },
        { icono: 'moisture', titulo: 'Espuma suave', texto: 'Limpia sin dejar sensación de tirantez (experiencia de uso).' },
        { icono: 'recycle', titulo: 'Plástico reciclado', texto: 'Botella elaborada con material reciclado (por confirmar).' }
      ],
      ingredientes: ['Aqua', 'Sodium cocoyl glutamate', 'Coco-glucoside', 'Glycerin', 'Eucalyptus globulus leaf oil', 'Rosmarinus officinalis leaf oil', 'Citric acid'],
      composicion: 'Lista INCI demostrativa. Debe sustituirse por la lista aprobada del fabricante.',
      modoUso: 'Aplica sobre la piel húmeda, masajea hasta formar espuma y enjuaga.',
      advertencias: ADV_COSMETICO,
      conservacion: 'Mantener cerrado y lejos de la luz directa del sol.',
      ingredienteFoto: 'eucalipto', ingredienteTexto: 'Rama de eucalipto: imagen ilustrativa del aroma.',
      envase: { forma: 'dispensador', vidrio: '#DDF2F5', tapa: '#AB004E', banda: '#AB004E', etiqueta: '#FFFBFD', contenido: '400 ml', medida: '21 × 6,5 cm' },
      comparacion: { tipo: 'textura', antes: 'Gel en la palma', despues: 'Espuma al frotar', colorA: '#CFE0CF', colorB: '#F4F7F2' },
      entorno: 'bano',
      valoracion: { promedio: 4.5, distribucion: [9, 6, 1, 0, 0] },
      opiniones: [
        { nombre: 'Héctor M.', fecha: '2026-09-23', puntuacion: 5, texto: 'El aroma a eucalipto es fresco sin ser fuerte. El dispensador funciona bien.' },
        { nombre: 'Ana María C.', fecha: '2026-09-01', puntuacion: 4, texto: 'Rinde bastante y la botella se ve elegante en el baño.' },
        { nombre: 'Pablo G.', fecha: '2026-08-13', puntuacion: 5, texto: 'Buena espuma. Lo uso todos los días.' }
      ],
      faq: [
        { p: '¿Sirve para el cabello?', r: 'Está formulado para el cuerpo. Para el cabello te recomendamos un champú.' },
        { p: '¿Hay recarga?', r: 'Las recargas están en evaluación para una tienda real; en este prototipo no existen.' }
      ]
    },
    {
      id: 'crema-manos-karite', nombre: 'Crema de Manos Karité', categoria: 'cuidado-personal',
      precio: 29900, precioAnterior: null, etiqueta: '', destacado: false,
      presentacion: 'Tubo de 75 ml',
      resumen: 'Crema de manos con manteca de karité y avena coloidal, de absorción rápida.',
      descripcion: 'Una crema de textura media con manteca de karité, avena coloidal y glicerina. Se absorbe en pocos segundos para que puedas seguir con tu día sin manos resbalosas.',
      beneficios: [
        { icono: 'hand-index-thumb', titulo: 'Absorción rápida', texto: 'No deja sensación grasosa en el teclado ni en el celular.' },
        { icono: 'bag-heart', titulo: 'Tubo para llevar', texto: '75 ml que caben en cualquier bolso.' },
        { icono: 'flower1', titulo: 'Aroma suave', texto: 'Notas de avena y vainilla, discretas.' }
      ],
      ingredientes: ['Aqua', 'Butyrospermum parkii butter', 'Glycerin', 'Avena sativa kernel flour', 'Cetearyl alcohol', 'Parfum'],
      composicion: 'Lista INCI demostrativa. Debe sustituirse por la lista aprobada del fabricante.',
      modoUso: 'Aplica una pequeña cantidad sobre las manos limpias y masajea hasta absorber.',
      advertencias: ADV_COSMETICO,
      conservacion: 'Lugar fresco. Cierre bien la tapa después de usar.',
      ingredienteFoto: 'karite', ingredienteTexto: 'Manteca vegetal: imagen ilustrativa.',
      envase: { forma: 'tubo', vidrio: '#F4EFE4', tapa: '#9BD7E0', banda: '#83CF9E', etiqueta: '#F4EFE4', contenido: '75 ml', medida: '15 × 4,5 cm' },
      comparacion: { tipo: 'textura', antes: 'Crema recién aplicada', despues: 'Crema absorbida', colorA: '#F5EFE3', colorB: '#F3ECE0' },
      entorno: 'bano',
      valoracion: { promedio: 4.6, distribucion: [10, 4, 1, 0, 0] },
      opiniones: [
        { nombre: 'Margarita L.', fecha: '2026-09-19', puntuacion: 5, texto: 'Se absorbe rapidísimo. La llevo en el bolso.' },
        { nombre: 'Óscar V.', fecha: '2026-08-31', puntuacion: 4, texto: 'Aroma suave y agradable.' },
        { nombre: 'Juliana T.', fecha: '2026-08-09', puntuacion: 5, texto: 'Buen tamaño y el tubo no se rompe.' }
      ],
      faq: [
        { p: '¿Tiene fragancia?', r: 'Sí, una fragancia suave de avena y vainilla. Si prefieres productos sin perfume, revisa el sérum hialurónico.' },
        { p: '¿Se puede usar en el cuerpo?', r: 'Sí, aunque su formato está pensado para las manos.' }
      ]
    },
    {
      id: 'shampoo-cebolla-romero', nombre: 'Shampoo Cebolla y Romero', categoria: 'cuidado-capilar',
      precio: 46900, precioAnterior: 52900, etiqueta: 'Nuevo', destacado: true,
      presentacion: 'Botella con dispensador · 400 ml',
      resumen: 'Shampoo de limpieza suave con extracto de cebolla y romero, en botella con dispensador.',
      descripcion: 'Un shampoo de espuma cremosa con extracto de cebolla roja y aceite esencial de romero. Limpia sin dejar el cabello áspero y el dispensador permite usar solo la cantidad necesaria. No promete crecimiento ni detener la caída: si notas pérdida de cabello, consulta con un dermatólogo.',
      beneficios: [
        { icono: 'droplet-half', titulo: 'Limpieza suave', texto: 'Tensoactivos suaves, sin sulfatos (dato demostrativo).' },
        { icono: 'flower2', titulo: 'Aroma a romero', texto: 'Fresco y herbal; el olor a cebolla no se percibe al enjuagar.' },
        { icono: 'hand-index', titulo: 'Dispensador', texto: 'Una o dos pulsaciones bastan para cabello medio.' }
      ],
      ingredientes: ['Aqua', 'Sodium cocoyl isethionate', 'Cocamidopropyl betaine', 'Allium cepa bulb extract', 'Rosmarinus officinalis leaf oil', 'Panthenol', 'Citric acid'],
      composicion: 'Lista INCI demostrativa. Debe sustituirse por la lista aprobada del fabricante.',
      modoUso: 'Aplica sobre el cabello húmedo, masajea el cuero cabelludo y enjuaga con abundante agua.',
      advertencias: ADV_COSMETICO,
      conservacion: 'Mantener cerrado, lejos de la luz directa del sol y del calor.',
      ingredienteFoto: 'cebolla', ingredienteTexto: 'Cebolla roja: imagen ilustrativa del extracto vegetal.',
      envase: { forma: 'dispensador', vidrio: '#FBF7FA', tapa: '#B0018F', banda: '#AB004E', etiqueta: '#FFFBFD', contenido: '400 ml', medida: '21 × 6,5 cm' },
      comparacion: { tipo: 'textura', antes: 'Shampoo en la palma', despues: 'Espuma al frotar', colorA: '#F3E6EE', colorB: '#FFFFFF' },
      entorno: 'bano',
      valoracion: { promedio: 4.6, distribucion: [11, 5, 1, 0, 0] },
      opiniones: [
        { nombre: 'Daniela R.', fecha: '2026-10-02', puntuacion: 5, texto: 'Pensé que olería a cebolla y no: queda un aroma suave a romero.' },
        { nombre: 'Marcela H.', fecha: '2026-09-20', puntuacion: 4, texto: 'Hace buena espuma. Me gusta que la ficha no prometa milagros.' },
        { nombre: 'Jorge A.', fecha: '2026-09-04', puntuacion: 5, texto: 'El dispensador es cómodo en la ducha.' }
      ],
      faq: [
        { p: '¿Hace crecer el cabello?', r: 'No hacemos esa promesa. Es un shampoo de limpieza; si te preocupa la caída del cabello, consulta con un dermatólogo.' },
        { p: '¿Sirve para cabello teñido?', r: 'La fórmula de demostración no incluye sulfatos, pero una tienda real debe confirmarlo con el fabricante.' }
      ]
    },
    {
      id: 'acondicionador-argan', nombre: 'Acondicionador Reparador Argán', categoria: 'cuidado-capilar',
      precio: 42900, precioAnterior: null, etiqueta: '', destacado: false,
      presentacion: 'Tubo de 250 ml',
      resumen: 'Acondicionador cremoso con aceite de argán y pantenol para desenredar después del shampoo.',
      descripcion: 'Un acondicionador de textura cremosa con aceite de argán, pantenol y manteca de karité. Ayuda a desenredar y deja el cabello más fácil de peinar. El tubo de pie se apoya sobre la tapa para aprovechar el producto hasta el final.',
      beneficios: [
        { icono: 'magic', titulo: 'Desenreda', texto: 'Facilita el peinado en cabello húmedo.' },
        { icono: 'droplet', titulo: 'Aceite de argán', texto: 'Aporta suavidad sin dejar el cabello pesado (dato demostrativo).' },
        { icono: 'arrow-down-up', titulo: 'Tubo de pie', texto: 'Se apoya sobre la tapa para usarlo hasta el final.' }
      ],
      ingredientes: ['Aqua', 'Cetearyl alcohol', 'Behentrimonium chloride', 'Argania spinosa kernel oil', 'Butyrospermum parkii butter', 'Panthenol', 'Parfum'],
      composicion: 'Lista INCI demostrativa. Debe sustituirse por la lista aprobada del fabricante.',
      modoUso: 'Después del shampoo, aplica de medios a puntas, deja actuar dos minutos y enjuaga.',
      advertencias: ADV_COSMETICO,
      conservacion: 'Lugar fresco. Cierre bien la tapa después de usar.',
      ingredienteFoto: 'aceite', ingredienteTexto: 'Aceite vegetal en frasco de vidrio: imagen ilustrativa.',
      envase: { forma: 'tubo', vidrio: '#C9EBD6', tapa: '#B0018F', banda: '#83CF9E', etiqueta: '#C9EBD6', contenido: '250 ml', medida: '19 × 6 cm' },
      comparacion: { tipo: 'textura', antes: 'Crema en la palma', despues: 'Textura extendida', colorA: '#FBF4F0', colorB: '#F6EEE8' },
      entorno: 'bano',
      valoracion: { promedio: 4.7, distribucion: [12, 4, 1, 0, 0] },
      opiniones: [
        { nombre: 'Liliana C.', fecha: '2026-09-28', puntuacion: 5, texto: 'Mi cabello rizado se desenreda mucho más fácil.' },
        { nombre: 'Natalia P.', fecha: '2026-09-10', puntuacion: 5, texto: 'Me encanta el color verde menta del tubo.' },
        { nombre: 'Camilo B.', fecha: '2026-08-22', puntuacion: 4, texto: 'Rinde bien. Lo usaría también como crema para peinar.' }
      ],
      faq: [
        { p: '¿Se puede dejar sin enjuagar?', r: 'Está pensado para enjuagarse. Para dejar en el cabello, una tienda real debería ofrecer una crema para peinar.' },
        { p: '¿Sirve para cabello fino?', r: 'Sí, aplicándolo solo de medios a puntas y en poca cantidad.' }
      ]
    },
    {
      id: 'tonico-capilar-romero', nombre: 'Tónico Capilar de Romero', categoria: 'cuidado-capilar',
      precio: 38900, precioAnterior: null, etiqueta: '', destacado: true,
      presentacion: 'Frasco gotero · 60 ml',
      resumen: 'Tónico ligero para el cuero cabelludo con romero y niacinamida, en frasco gotero.',
      descripcion: 'Un tónico de textura acuosa para aplicar directamente sobre el cuero cabelludo con el gotero. Combina extracto de romero, niacinamida y pantenol en una fórmula sin grasa que no requiere enjuague. Es un producto cosmético: no trata la caída del cabello ni reemplaza la consulta dermatológica.',
      beneficios: [
        { icono: 'eyedropper', titulo: 'Gotero preciso', texto: 'Aplicas el tónico por secciones, sin desperdicio.' },
        { icono: 'wind', titulo: 'Sin grasa', texto: 'Se absorbe rápido y no hay que enjuagarlo.' },
        { icono: 'flower2', titulo: 'Romero', texto: 'Aroma herbal fresco y suave.' }
      ],
      ingredientes: ['Aqua', 'Propanediol', 'Niacinamide', 'Rosmarinus officinalis leaf extract', 'Panthenol', 'Phenoxyethanol'],
      composicion: 'Lista INCI demostrativa. Debe sustituirse por la lista aprobada del fabricante.',
      modoUso: 'Sobre el cuero cabelludo limpio, aplica unas gotas por secciones y masajea con las yemas. No enjuagar.',
      advertencias: ADV_COSMETICO,
      conservacion: 'Mantener el gotero cerrado y lejos de la luz directa.',
      ingredienteFoto: 'romero', ingredienteTexto: 'Ramas de romero: imagen ilustrativa.',
      envase: { forma: 'gotero', vidrio: '#E6D3EE', tapa: '#AB004E', banda: '#9BD7E0', etiqueta: '#FFFBFD', contenido: '60 ml', medida: '12 × 4 cm' },
      comparacion: { tipo: 'textura', antes: 'Gota recién aplicada', despues: 'Textura extendida', colorA: '#EAF5E4', colorB: '#F2F8EE' },
      entorno: 'lino',
      valoracion: { promedio: 4.5, distribucion: [8, 5, 1, 0, 0] },
      opiniones: [
        { nombre: 'Alejandra M.', fecha: '2026-10-05', puntuacion: 5, texto: 'No engrasa el cabello y el aroma a romero es muy agradable.' },
        { nombre: 'Felipe S.', fecha: '2026-09-17', puntuacion: 4, texto: 'El gotero facilita aplicarlo por partes.' },
        { nombre: 'Paola V.', fecha: '2026-08-29', puntuacion: 5, texto: 'Me gustó que la ficha explicara que no es un tratamiento médico.' }
      ],
      faq: [
        { p: '¿Detiene la caída del cabello?', r: 'No. Es un cosmético para el cuero cabelludo. La caída del cabello puede tener muchas causas y debe revisarla un dermatólogo.' },
        { p: '¿Se usa todos los días?', r: 'La frecuencia la define el fabricante en la etiqueta aprobada. En este prototipo no se publica una pauta.' }
      ]
    },
    {
      id: 'botella-termica', nombre: 'Botella Térmica Salvia', categoria: 'accesorios',
      precio: 74900, precioAnterior: 84900, etiqueta: 'Edición limitada', destacado: true,
      presentacion: 'Acero inoxidable · 600 ml',
      resumen: 'Botella de acero inoxidable con doble pared y tapa de bambú, en color verde salvia.',
      descripcion: 'Una botella de doble pared de acero inoxidable con acabado mate en verde salvia y tapa de bambú. Está pensada para acompañarte con agua o infusiones durante el día. Los tiempos de conservación de temperatura son demostrativos y deben confirmarse con el fabricante.',
      beneficios: [
        { icono: 'thermometer-half', titulo: 'Doble pared', texto: 'Ayuda a conservar la temperatura de la bebida.' },
        { icono: 'tree', titulo: 'Tapa de bambú', texto: 'Con sello de silicona para evitar goteos.' },
        { icono: 'brush', titulo: 'Acabado mate', texto: 'Pintura en polvo resistente al roce diario.' }
      ],
      ingredientes: [],
      materiales: ['Cuerpo: acero inoxidable 18/8', 'Tapa: bambú con sello de silicona grado alimenticio', 'Acabado: pintura en polvo'],
      composicion: 'Ficha técnica y certificaciones de contacto con alimentos pendientes del fabricante.',
      modoUso: 'Lávala antes del primer uso con agua tibia y jabón neutro. No la uses en microondas ni lavavajillas.',
      advertencias: ['No apta para bebidas gasificadas.', 'Con líquidos muy calientes, abre la tapa con precaución.'],
      conservacion: 'Lávala a mano y déjala secar destapada.',
      ingredienteFoto: null,
      envase: { forma: 'botella', vidrio: '#9FB39A', tapa: '#C9A577', banda: '#AB004E', etiqueta: '#9FB39A', contenido: '600 ml', medida: '26 × 7,5 cm' },
      comparacion: { tipo: 'presentacion' },
      entorno: 'madera',
      valoracion: { promedio: 4.8, distribucion: [12, 2, 0, 0, 0] },
      opiniones: [
        { nombre: 'Daniel F.', fecha: '2026-09-26', puntuacion: 5, texto: 'El color es más bonito en persona. No gotea en el morral.' },
        { nombre: 'Melissa A.', fecha: '2026-09-07', puntuacion: 5, texto: 'La tapa de bambú le da un toque especial.' },
        { nombre: 'Sebastián U.', fecha: '2026-08-17', puntuacion: 4, texto: 'Muy buena, aunque es algo pesada.' }
      ],
      faq: [
        { p: '¿Cuánto tiempo conserva el frío o el calor?', r: 'Depende de la bebida y del ambiente. Una tienda real debe publicar los tiempos probados por el fabricante.' },
        { p: '¿Se puede lavar en lavavajillas?', r: 'No. Lávala a mano para cuidar el acabado y la tapa de bambú.' }
      ]
    },
    {
      id: 'pastillero-semanal', nombre: 'Organizador Semanal', categoria: 'accesorios',
      precio: 27900, precioAnterior: null, etiqueta: '', destacado: false,
      presentacion: '7 compartimentos con tapa',
      resumen: 'Organizador de complementos con siete compartimentos rotulados y tapas a presión.',
      descripcion: 'Un organizador semanal de plástico libre de BPA (dato demostrativo) con siete compartimentos rotulados de lunes a domingo. Cada tapa se abre por separado, para llevar solo el día que necesitas.',
      beneficios: [
        { icono: 'calendar-week', titulo: 'Días rotulados', texto: 'De lunes a domingo, en relieve para reconocerlos al tacto.' },
        { icono: 'grid-3x2-gap', titulo: 'Compartimentos separables', texto: 'Lleva solo el día que necesitas.' },
        { icono: 'lock', titulo: 'Tapas a presión', texto: 'Cierran firme dentro del bolso.' }
      ],
      ingredientes: [],
      materiales: ['Cuerpo y tapas: polipropileno libre de BPA (por confirmar)'],
      composicion: 'Ficha técnica pendiente del fabricante.',
      modoUso: 'Organiza tus complementos según las indicaciones de cada etiqueta o de tu profesional de la salud.',
      advertencias: ['Manténgase fuera del alcance de los niños.', 'Conserve los complementos en su envase original si la etiqueta así lo indica.'],
      conservacion: 'Lávalo a mano con agua tibia y jabón neutro.',
      ingredienteFoto: null,
      envase: { forma: 'pastillero', vidrio: '#F4F1E8', tapa: '#9BD7E0', banda: '#AB004E', etiqueta: '#F4F1E8', contenido: '7 compartimentos', medida: '21 × 3,5 cm' },
      comparacion: { tipo: 'organizacion' },
      entorno: 'lino',
      valoracion: { promedio: 4.4, distribucion: [7, 5, 2, 0, 0] },
      opiniones: [
        { nombre: 'Rosa E.', fecha: '2026-09-11', puntuacion: 5, texto: 'Por fin tengo mis complementos ordenados por día.' },
        { nombre: 'Miguel Á. B.', fecha: '2026-08-22', puntuacion: 4, texto: 'Las tapas cierran bien. Los compartimentos son algo pequeños para cápsulas grandes.' },
        { nombre: 'Clara N.', fecha: '2026-07-30', puntuacion: 4, texto: 'Práctico y bonito, combina con los frascos.' }
      ],
      faq: [
        { p: '¿Caben cápsulas blandas grandes?', r: 'Caben varias por compartimento, según su tamaño. Consulta las medidas en la vista de presentación.' },
        { p: '¿Puedo guardar ahí cualquier complemento?', r: 'Revisa la etiqueta de cada producto: algunos deben conservarse en su envase original.' }
      ]
    }
  ];

  const IMG = 'assets/images/products/';

  VT.catalogo = {
    categorias,
    productos,
    vistas: [
      { id: 'frente', nombre: 'Envase frontal' },
      { id: 'posterior', nombre: 'Etiqueta posterior' },
      { id: 'lateral', nombre: 'Vista lateral' },
      { id: 'ingredientes', nombre: 'Ingredientes' },
      { id: 'entorno', nombre: 'En uso' },
      { id: 'presentacion', nombre: 'Presentación' }
    ],
    porId: (id) => productos.find((p) => p.id === id) || null,
    categoria: (id) => categorias.find((c) => c.id === id) || null,
    porCategoria: (id) => productos.filter((p) => p.categoria === id),
    destacados: () => productos.filter((p) => p.destacado),
    // Misma categoría primero; luego complementarios de otras categorías.
    relacionados(producto, n = 4) {
      const misma = productos.filter((p) => p.categoria === producto.categoria && p.id !== producto.id);
      const otras = productos.filter((p) => p.categoria !== producto.categoria && (p.destacado || p.categoria === 'accesorios'));
      return misma.concat(otras).slice(0, n);
    },
    totalOpiniones: (p) => p.valoracion.distribucion.reduce((a, b) => a + b, 0),
    // Ruta relativa a la raíz del sitio; app.js antepone el prefijo de la página.
    imagen: (p, vista = 'frente', ancho = 900) => `${IMG}${p.id}/${vista}-${ancho}.webp`,
    vistasDe(p) {
      return this.vistas.filter((v) => v.id !== 'ingredientes' || p.ingredienteFoto).map((v) =>
        v.id === 'ingredientes' ? v : (p.ingredientes.length || v.id !== 'posterior' ? v : { id: v.id, nombre: 'Detalle de materiales' }));
    }
  };
})(window.VT = window.VT || {});
