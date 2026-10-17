/*
 * Configuración de Basalto Constructora (marca ficticia de demostración).
 * Es el único archivo que se edita al recibir los datos reales de la empresa.
 *
 * - modo: 'revision' muestra «Por configurar» y los bloques pendientes;
 *         'publicacion' los oculta.
 * - canonical: URL https definitiva de esta página (vacío = no se declara).
 * - formEndpoint: URL https que recibe el formulario en JSON (POST).
 *   Vacío = el formulario valida pero no envía nada y lo dice.
 * - contacto.whatsapp: número internacional sin signos, p. ej. 57 + 10 dígitos.
 * - Deje en '' todo dato no confirmado: la página lo oculta o lo marca.
 */
window.SITE = {
  modo: 'revision',
  marca: 'Basalto Constructora',
  canonical: '',
  formEndpoint: '',
  whatsappMensaje: 'Hola, quiero solicitar una cotización para un proyecto de construcción.',
  contacto: {
    telefono: '',
    whatsapp: '',
    email: '',
    direccion: '',
    ciudad: '',
    horario: ''
  }
};
