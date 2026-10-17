/*
 * Configuración de Nodo Ingeniería Integral (marca ficticia de demostración).
 * Es el único archivo que se edita al recibir los datos reales de la empresa.
 *
 * - modo: 'revision' muestra los datos faltantes como «Por configurar» y los bloques pendientes;
 *         'publicacion' oculta lo que no esté confirmado.
 * - canonical: URL https definitiva de esta página (vacío = no se publica canonical).
 * - formEndpoint: URL https que recibe el formulario por POST (JSON). Vacío = el formulario
 *   valida pero no envía nada y lo dice.
 * - contacto.whatsapp: número internacional sin signos, p. ej. 57 + 10 dígitos.
 * No escriba datos sin confirmar: deje la cadena vacía.
 */
window.SITE = {
  modo: 'revision',
  marca: 'Nodo Ingeniería Integral',
  canonical: '',
  formEndpoint: '',
  whatsappMensaje: 'Hola, quiero hablar con un especialista de Nodo Ingeniería Integral sobre un proyecto.',
  contacto: {
    telefono: '',
    whatsapp: '',
    email: '',
    direccion: '',
    ciudad: '',
    horario: ''
  }
};
