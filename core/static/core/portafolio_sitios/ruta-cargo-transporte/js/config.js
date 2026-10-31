/* =========================================================================
   Ruta Cargo — configuración comercial
   -------------------------------------------------------------------------
   ÚNICO archivo que se edita al recibir los datos reales de la empresa.
   «Ruta Cargo» es un nombre provisional de demostración, no una empresa real.

   Regla: ningún dato se inventa. Lo que no esté confirmado se deja vacío
   ('' o []) y la página lo oculta (modo 'publicacion') o lo marca
   «Por configurar» (modo 'revision').
   ========================================================================= */
window.BUSINESS_CONFIG = {
  // 'revision' muestra la barra de demostración y los avisos «Por configurar».
  // Cambiar a 'publicacion' cuando los datos estén completos y verificados.
  modo: 'revision',

  businessName: 'Ruta Cargo',
  descriptor: 'Transporte de carga y entregas',

  // WhatsApp en formato internacional SIN «+», espacios ni guiones: 57 + 10 dígitos
  // de un celular colombiano (empieza por 3). Ejemplo de FORMATO, no es un número
  // real: '573001234567'. Vacío = sin configurar: los botones llevan al formulario
  // y el formulario muestra el mensaje preparado en lugar de abrir WhatsApp.
  whatsappNumber: '',

  phone: '',        // línea para llamadas, si es distinta del WhatsApp (p. ej. '+57 607 000 0000')
  email: '',
  schedule: '',     // p. ej. 'Lunes a viernes, 7:00 a. m. – 6:00 p. m.' (solo si está confirmado)
  address: '',      // sede o bodega, solo si atiende al público

  legal: {
    razonSocial: '',
    nit: ''
  },

  // Municipios donde se presta el servicio. Editar según la cobertura real.
  serviceArea: ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta'],
  // Destinos regionales confirmados (p. ej. otros municipios de Santander).
  // Vacío = la página dice que las rutas regionales se confirman al cotizar.
  regionalDestinations: [],

  // URLs completas (https://…). Vacías = no se muestran.
  social: {
    linkedin: '',
    instagram: '',
    facebook: ''
  },

  // Enlace a las condiciones del servicio (PDF o página). Vacío = no se muestra.
  serviceConditionsUrl: '',

  messages: {
    general: 'Hola, quiero cotizar un servicio de transporte de carga. ¿Qué información necesitan?',
    formIntro: 'Hola, quiero solicitar una cotización de transporte de carga:'
  }
};
