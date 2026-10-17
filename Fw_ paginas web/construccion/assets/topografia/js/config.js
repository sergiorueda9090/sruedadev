/*
 * Configuración de Cota Cero Topografía (marca ficticia de demostración).
 * Es el único archivo que se edita al recibir los datos reales de la empresa.
 * - modo: 'revision' muestra los marcadores «Por configurar» y los bloques pendientes;
 *         'publicacion' los oculta.
 * - Campos vacíos ('') no se inventan: la página los marca o los oculta.
 * - whatsapp: número internacional sin signos, p. ej. 57 seguido de los 10 dígitos.
 * - formEndpoint: URL https que reciba un POST JSON (Formspree, Getform, función propia…).
 * - canonical: URL https definitiva de esta página, cuando exista dominio.
 */
window.SITE = {
  modo: 'revision',
  marca: 'Cota Cero Topografía',
  canonical: '',
  formEndpoint: '',
  whatsappMensaje: 'Hola, quiero cotizar un servicio topográfico. Les comparto la ubicación del predio y lo que necesito.',
  contacto: {
    telefono: '',
    whatsapp: '',
    email: '',
    direccion: '',
    ciudad: '',
    horario: ''
  }
};
