/*
 * Cabaña Las Tres Marías — configuración del sitio.
 * Es el ÚNICO archivo que hay que editar al recibir datos del propietario.
 *
 * Regla: lo que no esté confirmado se deja vacío ('' o null).
 *   - modo 'revision':    los datos vacíos se muestran marcados «Por confirmar».
 *   - modo 'publicacion': los datos vacíos se ocultan.
 */
window.TM = {
  modo: 'revision', // 'revision' | 'publicacion'

  nombre: 'Cabaña Las Tres Marías',

  // Solo dígitos, con indicativo de país y sin '+'. Ejemplo de formato: '57' + número de 10 dígitos.
  whatsapp: '',
  correo: '',

  // Dominio definitivo, sin barra final (ej. 'https://www.ejemplo.co').
  // Después de definirlo ejecuta `python3 tools/seo.py`: escribe canonical, Open Graph absoluto, JSON-LD y sitemap.xml.
  dominio: '',

  // Google Analytics 4 (opcional). ID real con forma 'G-XXXXXXXXXX'. Vacío = no se carga ningún script de medición.
  ga4: '',

  // Número máximo de huéspedes (adultos + niños). null = sin límite configurado: el formulario no impone uno.
  capacidadMaxima: null,

  // Atributos de la cabaña. valor '' = por confirmar.
  // Los valores con datos vienen del brief de SEO (oct. 2026): confírmalos con el propietario antes de publicar.
  atributos: [
    { clave: 'tipo', etiqueta: 'Tipo de alojamiento', valor: 'Cabaña' },
    { clave: 'capacidad', etiqueta: 'Capacidad máxima', valor: '' },
    { clave: 'habitaciones', etiqueta: 'Habitaciones', valor: '3' },
    { clave: 'banos', etiqueta: 'Baños', valor: '2' },
    { clave: 'chimenea', etiqueta: 'Chimenea', valor: 'Sí' },
    { clave: 'cocina', etiqueta: 'Cocina', valor: 'Sí, con comedor' },
    { clave: 'sala', etiqueta: 'Sala', valor: 'Sí' },
    { clave: 'aguaCaliente', etiqueta: 'Agua caliente', valor: '' },
    { clave: 'wifi', etiqueta: 'Wi-Fi', valor: 'Sí' },
    { clave: 'parqueadero', etiqueta: 'Parqueadero', valor: 'Para 2 vehículos' },
    { clave: 'exteriores', etiqueta: 'Zonas exteriores', valor: 'Patio y balcón' },
    { clave: 'mascotas', etiqueta: 'Mascotas', valor: '' },
    { clave: 'acceso', etiqueta: 'Acceso', valor: '' }
  ],

  ubicacion: {
    // Zona indicada por el cliente (corregimiento y municipio). Se publica en la web y en los datos estructurados.
    zona: 'Berlín, Tona, Santander',
    // true cuando el propietario confirme el sector o vereda exactos y autorice publicarlos.
    confirmada: false,
    sector: '',        // vereda o sector
    direccion: '',
    lat: null,         // coordenadas verificadas, en grados decimales
    lng: null,
    indicaciones: '',  // cómo llegar
    estadoVia: '',
    recomendaciones: ''
  },

  politicas: {
    checkIn: '',
    checkOut: '',
    cancelacion: '',
    deposito: '',
    clima: ''          // qué pasa con la reserva si hay clima adverso
  },

  // Tarifas: déjalas vacías hasta tenerlas. Ejemplo de forma:
  // { plan: 'familiar', texto: 'Desde $000.000 por noche', nota: 'Hasta N personas' }
  tarifas: [],

  // Redes: URL completa (https://...). Vacías no se muestran.
  redes: { instagram: '', facebook: '', tiktok: '' },

  // Fichas «Lugares para visitar». Solo datos con fuente. Campo '' = por confirmar.
  // publicar:false -> la ficha solo aparece en modo revisión.
  lugares: [
    {
      nombre: 'Berlín',
      tipo: 'Pueblo de alta montaña',
      ubicacion: 'Corregimiento del municipio de Tona, Santander',
      experiencia: 'Cultura local, comercio y paisaje agrícola de montaña',
      exigencia: 'Baja',
      equipo: 'Ropa abrigada e impermeable',
      acceso: '',
      fuente: 'CDMB, documento técnico del DMI Páramo de Berlín',
      enlace: 'https://cdmb.gov.co/images/documentos/institucional/areas_protegidas/Doc%20DMI%20P%20Berl%C3%ADn.pdf',
      publicar: true
    },
    {
      nombre: 'Páramo de Berlín',
      tipo: 'Área protegida de páramo',
      ubicacion: 'Distrito de Manejo Integrado declarado por la CDMB en 2007. Su parte alta está en el corregimiento de Berlín (Tona); la mayor parte, en Silos y Mutiscua (Norte de Santander)',
      experiencia: 'Frailejones, pajonales y lagunas de alta montaña',
      exigencia: '',
      equipo: 'Botas, impermeable, capas de abrigo, agua y protector solar',
      acceso: 'Solo por rutas autorizadas. Consulta a la CDMB o a guías locales antes de ir',
      fuente: 'CDMB, documento técnico del DMI Páramo de Berlín',
      enlace: 'https://cdmb.gov.co/images/documentos/institucional/areas_protegidas/Doc%20DMI%20P%20Berl%C3%ADn.pdf',
      publicar: true
    },
    {
      nombre: 'El Picacho',
      tipo: 'Montaña y ascenso en bicicleta',
      ubicacion: 'Unos 20 km al este de Bucaramanga, sobre la Ruta 66. El peaje cercano a la cima está a unos 3.400 m',
      experiencia: 'Ciclismo de carretera y miradores desde la vía',
      exigencia: 'Alta en bicicleta: subida larga y sostenida',
      equipo: 'Casco, luces, ropa visible y abrigo para el descenso',
      acceso: 'Carretera nacional compartida con carros y camiones',
      fuente: 'Wikipedia, «Picacho Mountain (Colombia)»',
      enlace: 'https://en.wikipedia.org/wiki/Picacho_Mountain_(Colombia)',
      publicar: true
    },
    {
      nombre: 'Lagunas del páramo',
      tipo: 'Lagunas de alta montaña',
      ubicacion: '',
      experiencia: 'Caminata de páramo',
      exigencia: '',
      equipo: '',
      acceso: '',
      fuente: '',
      enlace: '',
      publicar: false
    }
  ]
};
