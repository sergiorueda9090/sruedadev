/* =========================================================================
   Carga Segura 360 — configuración comercial
   -------------------------------------------------------------------------
   ÚNICO archivo que se edita al recibir los datos reales de la empresa.
   «Carga Segura 360» es un nombre provisional de demostración, no una marca
   comercial verificada.

   Regla: ningún dato se inventa (ni certificaciones, ni pólizas, ni rastreo,
   ni cifras). Lo que no esté confirmado se deja vacío ('' o []) y la página
   lo oculta (modo 'publicacion') o lo marca «Por configurar» (modo 'revision').
   ========================================================================= */
window.BUSINESS_CONFIG = {
  // 'revision' muestra la barra de demostración, los avisos «Por configurar» y
  // la nota de que las buenas prácticas deben ajustarse a la oferta real.
  modo: 'revision',

  businessName: 'Carga Segura 360',
  descriptor: 'Transporte de carga en furgón cerrado',

  // WhatsApp en formato internacional SIN «+», espacios ni guiones: 57 + 10 dígitos
  // de un celular colombiano (empieza por 3). Ejemplo de FORMATO, no es un número
  // real: '573001234567'. Vacío = sin configurar: los botones llevan al formulario
  // y el formulario muestra el mensaje preparado en lugar de abrir WhatsApp.
  whatsappNumber: '',

  phone: '',
  email: '',
  schedule: '',
  address: '',

  legal: {
    razonSocial: '',
    nit: ''
  },

  // Municipios del área de operación. Editar según la cobertura real.
  serviceArea: ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta'],
  // Destinos regionales confirmados. Vacío = «se confirman en cada propuesta».
  regionalDestinations: [],

  social: {
    linkedin: '',
    instagram: '',
    facebook: ''
  },

  serviceConditionsUrl: '',

  messages: {
    general: 'Hola, quiero hablar con un asesor sobre un servicio de transporte de carga.',
    formIntro: 'Hola, quiero solicitar un servicio de transporte de carga:'
  }
};
