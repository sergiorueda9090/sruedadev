/* Showroom: datos del estudio, formulario y animaciones. Depende de showroom-config.js y core.js. */
(function () {
  'use strict';

  const site = window.SITE || {};
  const CES = window.CES;
  if (!CES) return;

  function applyStudioName() {
    if (!CES.filled(site.estudio)) return;
    CES.$$('[data-studio]').forEach((node) => { node.textContent = site.estudio; });
  }

  function whatsappText(data) {
    return [
      'Hola, quiero solicitar una propuesta de sitio web.',
      `Nombre: ${data.nombre}`,
      `Empresa: ${data.empresa}`,
      `Correo: ${data.correo}`,
      `Tipo de empresa: ${data.tipo}`,
      data.mensaje ? `Necesidad: ${data.mensaje}` : ''
    ].filter(Boolean).join('\n');
  }

  CES.init(site);
  applyStudioName();
  CES.initForm(CES.$('#sr-form'), site, {
    whatsappText,
    subject: 'Solicitud de propuesta de sitio web',
    successText: 'Recibimos su solicitud. Le escribiremos al correo que indicó.'
  });
  CES.initAOS({ duration: 700 });
})();
