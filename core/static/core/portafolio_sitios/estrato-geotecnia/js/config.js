/*
 * Configuración de Estrato Geotecnia (marca ficticia de demostración).
 * Es el único archivo que se edita al recibir datos reales.
 * - modo: 'revision' muestra los datos faltantes como «Por configurar» y los bloques pendientes;
 *         'publicacion' los oculta.
 * - canonical: URL https definitiva de la página (vacío = no se publica canonical).
 * - formEndpoint: URL https que recibe un POST JSON del formulario (vacío = el formulario no envía nada).
 * - contacto.whatsapp: número internacional sin signos, p. ej. 57 + 10 dígitos.
 * No escriba datos sin confirmar: deje la cadena vacía.
 */
window.SITE = {
  modo: 'revision',
  marca: 'Estrato Geotecnia',
  canonical: '',
  formEndpoint: '',
  whatsappMensaje: 'Hola, quiero consultar un proyecto con Estrato Geotecnia. Necesito orientación sobre un estudio de suelos o un problema geotécnico.',
  contacto: {
    telefono: '',
    whatsapp: '',
    email: '',
    direccion: '',
    ciudad: '',
    horario: ''
  }
};
