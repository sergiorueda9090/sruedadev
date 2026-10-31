/*
 * Configuración central de las tres demos. Es lo único que se edita al recibir
 * datos reales de una institución.
 *
 * - modo: 'revision' muestra avisos de demo y marca «Por configurar» lo que falta;
 *         'publicacion' oculta esos avisos y los datos vacíos.
 * - whatsapp: número en formato internacional sin «+» ni espacios (p. ej. '57300…').
 *   Vacío = los botones de WhatsApp llevan al formulario y lo dicen.
 * - formEndpoint: URL que recibe un POST con los campos del formulario.
 *   Vacío = el formulario valida pero no envía nada, y lo explica.
 * - Ningún dato de contacto es real: no inventar teléfonos, correos ni direcciones.
 */
window.PSI_CONFIG = {
  modo: 'revision',

  marcas: {
    neuroavanzar: {
      nombre: 'Neuroavanzar',
      whatsapp: '',
      mensajeWhatsapp: 'Hola, quisiera recibir información sobre los servicios y el proceso de atención.',
      formEndpoint: '',
      correo: '',
      telefono: '',
      direccion: '',
      ciudad: 'Bucaramanga, Santander',
      horarios: []
    },

    aprehender: {
      nombre: 'Aprehender Centro Terapéutico',
      whatsapp: '',
      mensajeWhatsapp: 'Hola, quisiera recibir información sobre las terapias y el proceso de atención.',
      formEndpoint: '',
      correo: '',
      telefono: '',
      direccion: '',
      ciudad: 'Floridablanca, Santander',
      horarios: []
    },

    integra: {
      nombre: 'Integra Neurorehabilitación',
      whatsapp: '',
      mensajeWhatsapp: 'Hola, quisiera recibir información sobre los servicios y el proceso de atención.',
      formEndpoint: '',
      correo: '',
      telefono: '',
      direccion: '',
      ciudad: 'Bucaramanga, Santander',
      // Ejemplo de formato: ['Lunes a viernes: 7:00 a. m. – 6:00 p. m.', 'Sábados: 8:00 a. m. – 12:00 m.']
      horarios: []
    }
  }
};
