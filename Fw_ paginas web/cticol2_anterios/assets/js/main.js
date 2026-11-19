/*
 * CTICOL — comportamiento común a todas las páginas:
 *   1. Header fijo con estado «compacto» al hacer scroll.
 *   2. Menú móvil (hamburguesa) y submenú de servicios.
 * Depende de assets/js/config.js (window.CT), generado por tools/build.py.
 */
(function () {
  'use strict';

  /* 1. Header ------------------------------------------------------------ */
  const header = document.querySelector('[data-header]');
  if (header) {
    let ticking = false;
    const update = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* 2. Menú móvil ------------------------------------------------------- */
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const escritorio = window.matchMedia('(min-width: 992px)');

  function setMenu(abierto) {
    if (!nav || !toggle) return;
    // El panel empieza justo debajo del header (que baja si se ve el aviso de modo revisión).
    if (abierto && header) nav.style.top = `${Math.round(header.getBoundingClientRect().bottom)}px`;
    nav.classList.toggle('is-open', abierto);
    toggle.setAttribute('aria-expanded', String(abierto));
    toggle.querySelector('.visually-hidden').textContent = abierto ? 'Cerrar menú' : 'Abrir menú';
    document.body.classList.toggle('nav-open', abierto);
  }

  if (nav && toggle) {
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (ev) => {
      if (ev.target.closest('a')) setMenu(false);
    });
    escritorio.addEventListener('change', (ev) => { if (ev.matches) setMenu(false); });
  }

  /* Submenú de servicios: abre con el botón (teclado y móvil) y con hover en escritorio */
  document.querySelectorAll('.has-sub').forEach((item) => {
    const boton = item.querySelector('.sub-toggle');
    if (!boton) return;
    boton.addEventListener('click', () => {
      const abierto = boton.getAttribute('aria-expanded') !== 'true';
      boton.setAttribute('aria-expanded', String(abierto));
      item.classList.toggle('is-open', abierto);
    });
    item.addEventListener('focusout', (ev) => {
      if (escritorio.matches && !item.contains(ev.relatedTarget)) {
        boton.setAttribute('aria-expanded', 'false');
        item.classList.remove('is-open');
      }
    });
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Escape') return;
    const abierto = document.querySelector('.has-sub.is-open');
    if (abierto) {
      abierto.classList.remove('is-open');
      const b = abierto.querySelector('.sub-toggle');
      b.setAttribute('aria-expanded', 'false');
      b.focus();
      return;
    }
    if (nav && nav.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });
})();
