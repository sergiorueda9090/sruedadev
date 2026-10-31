/* =========================================================================
   Mudanza Pro — configuración comercial
   -------------------------------------------------------------------------
   ÚNICO archivo que se edita al recibir los datos reales del negocio.
   «Mudanza Pro» es un nombre provisional de demostración, no una empresa real.

   Regla: ningún dato se inventa. Lo que no esté confirmado se deja vacío
   ('' o []) y la página lo oculta (modo 'publicacion') o lo marca
   «Por configurar» (modo 'revision').
   ========================================================================= */
window.BUSINESS_CONFIG = {
  // 'revision' muestra la barra de demostración y los avisos «Por configurar».
  // Cambiar a 'publicacion' cuando los datos estén completos y verificados.
  modo: 'revision',

  businessName: 'Mudanza Pro',
  descriptor: 'Mudanzas y acarreos',

  // WhatsApp en formato internacional SIN «+», espacios ni guiones: 57 + 10 dígitos
  // de un celular colombiano (empieza por 3). Ejemplo de FORMATO, no es un número
  // real: '573001234567'. Vacío = sin configurar: los botones llevan al cotizador
  // y el cotizador muestra el mensaje preparado en lugar de abrir WhatsApp.
  whatsappNumber: '',

  phone: '',
  email: '',
  schedule: '',     // p. ej. 'Lunes a sábado, 7:00 a. m. – 6:00 p. m.' (solo si está confirmado)
  address: '',

  legal: {
    razonSocial: '',
    nit: ''
  },

  // Municipios donde se hacen mudanzas y acarreos. Editar según la cobertura real.
  serviceArea: ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta'],
  // Destinos fuera del área metropolitana confirmados. Vacío = «se consulta al cotizar».
  regionalDestinations: [],

  social: {
    instagram: '',
    facebook: '',
    tiktok: ''
  },

  serviceConditionsUrl: '',

  messages: {
    general: 'Hola, quiero cotizar una mudanza. ¿Qué información necesitan?',
    formIntro: 'Hola, quiero cotizar una mudanza o acarreo:'
  }
};
