/*
 * Configuración de Obra Fina Remodelaciones (marca ficticia de demostración).
 * Es el único archivo que se edita al recibir los datos reales de la empresa.
 *
 * - modo: 'revision' muestra «Por configurar» y los bloques pendientes;
 *         'publicacion' oculta todo lo que no tenga dato.
 * - contacto.whatsapp: número internacional sin espacios ni signos: 57 + 10 dígitos (ej.: '573001234567').
 * - contacto.telefono: como se marcaría (ej.: '+57 300 123 4567').
 * - formEndpoint: URL https que reciba un POST JSON (Formspree, Getform, backend propio). Vacío = no se envía nada.
 * - canonical: URL pública definitiva de esta página (https). Vacío = no se declara.
 * No escriba datos sin confirmar: déjelos en ''.
 */
window.SITE = {
  modo: 'revision',
  marca: 'Obra Fina Remodelaciones',
  canonical: '',
  formEndpoint: '',
  whatsappMensaje: 'Hola, quiero información sobre remodelación o mantenimiento de un espacio.',
  contacto: {
    telefono: '',
    whatsapp: '',
    email: '',
    direccion: '',
    ciudad: '',
    horario: ''
  }
};
