/* Configuración editable de las tres demos. Es el único archivo que se toca al
 * recibir datos reales de un cliente.
 *
 * - modo: 'revision' muestra las etiquetas «Por confirmar» y los datos pendientes;
 *   'publicacion' los oculta.
 * - Teléfonos: solo dígitos, sin indicativo. El enlace tel: añade +57.
 * - whatsapp: número en formato internacional sin '+' ni espacios (p. ej. '573001234567').
 *   Vacío ('') = no hay WhatsApp confirmado: los botones de WhatsApp se ocultan y
 *   en su lugar aparece la llamada.
 * - Campos vacíos ('') = dato sin confirmar: la página no lo muestra o lo marca
 *   «Por confirmar». No completar con datos supuestos.
 */
window.EVENTOS = {
  modo: 'revision',

  // Dominio definitivo (con barra final), p. ej. 'https://www.ejemplo.co/eventos/'.
  // Lo usa tools/seo.py para escribir canonical y og:url. Vacío = sin canonical.
  sitioBase: '',

  villaJardin: {
    nombre: 'Villa Jardín Recepción y Eventos',
    telefonos: [
      { etiqueta: 'Teléfono fijo', numero: '6076463452' },
      { etiqueta: 'Celular', numero: '3203493120' }
    ],
    // El 320 349 3120 es un celular, pero no está confirmado que tenga WhatsApp.
    // Cuando el negocio lo confirme: whatsapp: '573203493120'.
    whatsapp: '',
    mensajeWhatsapp: 'Hola, vi la página de Villa Jardín y quiero cotizar un evento.',
    zona: 'Área metropolitana de Bucaramanga, Santander',
    direccion: '',
    mapaUrl: '',
    horarioVisitas: '',
    correo: '',
    instagram: ''
  },

  fincaLaCruz: {
    nombre: 'Finca La Cruz',
    lema: 'Momentos Inolvidables',
    telefonos: [
      { etiqueta: 'Celular', numero: '3175408777' }
    ],
    // Número entregado para la demo. Confirmar con el negocio que es su WhatsApp.
    whatsapp: '573175408777',
    mensajeWhatsapp: 'Hola, vi la página de Finca La Cruz y quiero consultar disponibilidad para un evento.',
    zona: 'Área metropolitana de Bucaramanga, Santander',
    direccion: '',
    mapaUrl: '',
    comoLlegar: '',
    correo: '',
    instagram: ''
  },

  alquieventos: {
    nombre: 'Alquieventos',
    telefonos: [
      { etiqueta: 'Celular', numero: '3176825487' }
    ],
    // Número entregado para la demo. Confirmar con el negocio que es su WhatsApp.
    whatsapp: '573176825487',
    mensajeWhatsapp: 'Hola, vi el catálogo de Alquieventos y quiero cotizar un alquiler.',
    zona: 'Área metropolitana de Bucaramanga, Santander',
    cobertura: '',
    direccion: '',
    horario: '',
    correo: '',
    instagram: ''
  }
};
