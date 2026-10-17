/* Basalto Constructora: comportamiento propio del sitio. Requiere ../shared/js/core.js (window.CES). */
(function () {
  'use strict';

  const CES = window.CES;
  const SITE = window.SITE || {};
  if (!CES) return;

  const CATEGORY_NAMES = {
    residencial: 'residenciales',
    comercial: 'comerciales',
    institucional: 'institucionales',
    'obra-civil': 'de obra civil'
  };

  /* Filtros del portafolio: botones con aria-pressed y anuncio del resultado. */
  function initPortfolioFilters() {
    const mosaic = CES.$('[data-mosaic]');
    const buttons = CES.$$('[data-filter]');
    const status = CES.$('[data-filter-status]');
    if (!mosaic || !buttons.length) return;
    const items = CES.$$('[data-category]', mosaic);

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
        let visible = 0;
        items.forEach((item) => {
          const show = filter === 'todos' || item.dataset.category === filter;
          item.hidden = !show;
          if (show) visible += 1;
        });
        mosaic.classList.toggle('is-filtered', filter !== 'todos');
        if (status) {
          const noun = visible === 1 ? 'proyecto' : 'proyectos';
          status.textContent = filter === 'todos'
            ? `Mostrando los ${visible} proyectos.`
            : `Mostrando ${visible} ${noun} ${CATEGORY_NAMES[filter] || ''}.`;
        }
      });
    });
  }

  /* Los enlaces «Cotizar…» de cada servicio preseleccionan el tipo de proyecto. */
  function initServiceShortcuts() {
    const select = CES.$('#q-servicio');
    if (!select) return;
    CES.$$('[data-service]').forEach((link) => {
      link.addEventListener('click', () => {
        select.value = link.dataset.service;
        select.dispatchEvent(new Event('change'));
      });
    });
  }

  /* Botones anterior/siguiente de la tira de galería (desplazamiento manual, sin autoplay). */
  function initGalleryStrip() {
    const strip = CES.$('[data-gallery]');
    const prev = CES.$('[data-gallery-prev]');
    const next = CES.$('[data-gallery-next]');
    if (!strip || !prev || !next) return;

    const updateButtons = () => {
      const max = strip.scrollWidth - strip.clientWidth - 2;
      prev.disabled = strip.scrollLeft <= 2;
      next.disabled = strip.scrollLeft >= max;
    };
    const move = (direction) => {
      strip.scrollBy({
        left: direction * strip.clientWidth * 0.8,
        behavior: CES.prefersReducedMotion() ? 'auto' : 'smooth'
      });
    };
    prev.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    strip.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    window.addEventListener('load', updateButtons);
    updateButtons();
  }

  function quoteMessage(data) {
    return [
      'Hola, quiero solicitar una cotización.',
      `Nombre: ${data.nombre || ''}`,
      data.empresa ? `Empresa: ${data.empresa}` : '',
      `Teléfono: ${data.telefono || ''}`,
      `Correo: ${data.email || ''}`,
      `Tipo de proyecto: ${CES.$('#q-servicio option:checked')?.textContent || data.servicio || ''}`,
      `Etapa: ${data.etapa || ''}`,
      `Municipio: ${data.municipio || ''}`,
      `Descripción: ${data.descripcion || ''}`
    ].filter(Boolean).join('\n');
  }

  CES.init(SITE);
  initPortfolioFilters();
  initServiceShortcuts();
  initGalleryStrip();
  CES.initForm(CES.$('#form-cotizacion'), SITE, {
    whatsappText: quoteMessage,
    subject: 'Solicitud de cotización',
    successText: 'Recibimos su solicitud de cotización. Le contactaremos por el teléfono o el correo que indicó.'
  });
  CES.initLightbox(CES.$('[data-gallery]'));
  CES.initAOS();
})();
