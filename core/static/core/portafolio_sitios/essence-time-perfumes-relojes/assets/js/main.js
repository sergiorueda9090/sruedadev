/* ==========================================================================
   ESSENCE & TIME — Arranque
   Último script de cada página. Monta los componentes compartidos una vez,
   ejecuta el módulo de la página (<body data-page="...">) e inicializa las
   animaciones opt-in.
   ========================================================================== */
(function (ET) {
  'use strict';

  /** Carrusel de productos: Swiper si está cargado; si no, scroll nativo. */
  ET.carousel = function carousel(rootEl) {
    if (!rootEl || rootEl.dataset.carouselReady) return null;
    rootEl.dataset.carouselReady = '1';
    const el = rootEl.querySelector('.swiper');
    if (!window.Swiper || !el) {
      rootEl.classList.add('carousel-et--native');
      return null;
    }
    const prev = rootEl.querySelector('[data-carousel-prev]');
    const next = rootEl.querySelector('[data-carousel-next]');
    const bar = rootEl.querySelector('.carousel-et__bar');
    return new window.Swiper(el, {
      slidesPerView: 'auto',
      spaceBetween: 16,
      speed: ET.utils.prefersReducedMotion() ? 0 : 520,
      watchOverflow: true,
      grabCursor: true,
      keyboard: { enabled: true, onlyInViewport: true },
      a11y: {
        prevSlideMessage: 'Productos anteriores',
        nextSlideMessage: 'Productos siguientes',
        slideLabelMessage: 'Producto {{index}} de {{slidesLength}}',
      },
      navigation: prev && next ? { prevEl: prev, nextEl: next } : undefined,
      scrollbar: bar ? { el: bar, draggable: true } : undefined,
      breakpoints: { 992: { spaceBetween: 28 } },
    });
  };

  function boot() {
    if (ET._booted) return;
    ET._booted = true;
    ET.ui.mount();

    const page = document.body.dataset.page;
    const mod = ET.pages && ET.pages[page];
    if (mod && typeof mod.init === 'function') {
      try {
        mod.init();
      } catch (err) {
        // Un fallo de la página no debe dejar el contenido principal vacío
        console.error('[Essence & Time] Error al iniciar la página:', err);
        const main = document.getElementById('main');
        if (main && !main.querySelector('[data-page-error]')) {
          main.insertAdjacentHTML('afterbegin', `<div class="wrap section-sm" data-page-error><div class="notice notice--error" role="alert">
            <i class="bi bi-exclamation-triangle" aria-hidden="true"></i><p>Parte de esta página no se pudo cargar. Recarga la página o vuelve al <a href="index.html">inicio</a>.</p></div></div>`);
        }
      }
    }
    document.querySelectorAll('[data-carousel]').forEach(ET.carousel);
    ET.anim.init();
  }

  ET.pages = ET.pages || {};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})(window.ET);
