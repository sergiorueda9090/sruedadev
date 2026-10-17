/* Estrato Geotecnia: comportamiento propio del sitio. Depende de ../shared/js/core.js (window.CES). */
(function () {
  'use strict';

  const CES = window.CES;
  const SITE = window.SITE || {};
  if (!CES) return;

  /* Texto alternativo desde images/credits.js (describe lo que realmente muestra cada foto). */
  function applyPhotoAlts() {
    CES.$$('img[data-slot]').forEach((img) => {
      img.alt = CES.altFor(img.dataset.slot, img.alt);
    });
  }

  /* Registro de perforación: pestañas verticales; el estrato activo se marca en el contenedor. */
  function initLog() {
    const tablist = CES.$('.log__tabs');
    const log = CES.$('.log');
    if (!tablist || !log) return;
    CES.initTabs(tablist, (tab) => {
      log.dataset.active = tab.id.replace('tab-', '');
    });
    /* En móvil el panel queda bajo la lista: si al tocar un estrato no se ve, se lleva a la vista. */
    CES.$$('[role="tab"]', tablist).forEach((tab) => {
      tab.addEventListener('click', () => {
        if (window.innerWidth >= 992) return;
        const panel = document.getElementById(tab.getAttribute('aria-controls'));
        if (panel && panel.getBoundingClientRect().top > window.innerHeight * 0.75) {
          panel.scrollIntoView({ behavior: CES.prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
        }
      });
    });
  }

  function whatsappText(data) {
    return [
      'Hola, quiero consultar un proyecto con Estrato Geotecnia.',
      `Nombre: ${data.nombre || ''}`,
      data.empresa ? `Empresa: ${data.empresa}` : '',
      `Tipo de proyecto: ${data.tipo || ''}`,
      `Etapa: ${data.etapa || ''}`,
      `Ubicación: ${data.municipio || ''}`,
      `Necesito: ${data.necesidad || ''}`,
      `Descripción: ${data.descripcion || ''}`,
      `Contacto: ${data.email || ''} / ${data.telefono || ''}`
    ].filter(Boolean).join('\n');
  }

  CES.init(SITE);
  applyPhotoAlts();
  initLog();
  CES.initForm(CES.$('#form-proyecto'), SITE, {
    whatsappText,
    subject: 'Consulta de proyecto geotécnico',
    successText: 'Recibimos la descripción de su proyecto. Le responderemos por el medio de contacto que indicó.'
  });
  CES.initAOS();
})();
