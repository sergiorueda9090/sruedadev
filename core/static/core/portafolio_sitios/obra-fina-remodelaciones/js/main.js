/* Obra Fina Remodelaciones: comportamiento propio del sitio. Requiere config.js, credits.js y shared/js/core.js. */
(function () {
  'use strict';

  const CES = window.CES;
  const SITE = window.SITE || {};
  if (!CES) return;

  /* Comparador boceto / foto: el rango controla qué porción del boceto se ve desde la izquierda. */
  function initCompare() {
    const figure = CES.$('[data-compare]');
    const range = figure && CES.$('.compare__range', figure);
    if (!range) return;
    const update = () => {
      const value = Number(range.value);
      figure.style.setProperty('--pos', `${value}%`);
      let text = `${value} % boceto, ${100 - value} % foto`;
      if (value === 50) text = 'Mitad boceto, mitad foto';
      if (value === 0) text = 'Solo foto';
      if (value === 100) text = 'Solo boceto';
      range.setAttribute('aria-valuetext', text);
    };
    range.addEventListener('input', update);
    update();
  }

  /* Mensaje de WhatsApp armado con los datos del formulario. */
  function quoteMessage(data) {
    const lines = [
      `Hola, soy ${data.nombre || ''}. Quiero solicitar una visita o cotización.`,
      `Espacio: ${data.espacio || ''}`,
      `Servicio: ${data.servicio || ''}`,
      `Ubicación: ${data.ubicacion || ''}`,
      `Teléfono: ${data.telefono || ''}`
    ];
    if (data.mensaje) lines.push(`Detalle: ${data.mensaje}`);
    return lines.join('\n');
  }

  CES.init(SITE);
  CES.initTabs(CES.$('[data-tabs]'));
  initCompare();
  CES.initForm(CES.$('#form-cotizar'), SITE, {
    whatsappText: quoteMessage,
    subject: 'Solicitud de visita o cotización',
    successText: 'Recibimos su solicitud. Le contactaremos al número que indicó para acordar la visita.'
  });
  CES.initLightbox(CES.$('[data-gallery]'));
  CES.initAOS();
})();
