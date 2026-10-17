/*
 * Datos del estudio que presenta el showroom. Es lo único que hay que editar en index.html.
 * - modo: 'revision' muestra «Por configurar» donde falta un dato; 'publicacion' oculta esos elementos.
 * - estudio: nombre comercial del estudio de diseño web (vacío = se muestra «Showroom web»).
 * - whatsapp: 57 + 10 dígitos, sin espacios ni signos (ej. '573001234567').
 * - formEndpoint: URL https que recibe un POST JSON (Formspree, Getform, un webhook propio…).
 *   Vacío = el formulario valida pero no envía, y lo dice.
 * - canonical: URL pública definitiva del showroom (vacío = no se declara).
 */
window.SITE = {
  modo: 'revision',
  estudio: 'sruedadev.com',
  canonical: '',
  formEndpoint: '',
  whatsappMensaje: 'Hola, vi el showroom de sitios web para construcción e ingeniería y quiero conversar sobre un proyecto.',
  contacto: {
    telefono: '',
    whatsapp: '',
    email: '',
    ciudad: ''
  }
};
