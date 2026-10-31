/*
 * Neuroavanzar: especialidades con visor fijo y movimiento orgánico (curvas
 * suaves, flotación lenta, líneas que se dibujan). Sin GSAP todo queda visible.
 */
(function () {
  'use strict';
  var PSI = window.PSI;
  if (!PSI) return;

  /* ---------- Especialidades: la foto del visor sigue a la especialidad activa ---------- */

  var items = PSI.$$('.na-esp__item');
  var fotos = PSI.$$('.na-esp__visor img');
  var nombre = PSI.$('.js-visor-nombre');

  function activar(item) {
    if (!item || item.classList.contains('is-activa')) return;
    items.forEach(function (i) { i.classList.toggle('is-activa', i === item); });
    fotos.forEach(function (f) { f.classList.toggle('is-activa', f.dataset.foto === item.dataset.foto); });
    if (nombre) nombre.textContent = item.querySelector('h3').textContent;
  }

  items.forEach(function (item) {
    item.addEventListener('mouseenter', function () { activar(item); });
    item.addEventListener('focusin', function () { activar(item); });
  });

  // Al desplazarse, la especialidad que cruza el centro de la pantalla toma el visor.
  if ('IntersectionObserver' in window) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { if (e.isIntersecting) activar(e.target); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    items.forEach(function (item) { observador.observe(item); });
  }

  if (!PSI.motionOk()) return;

  var gsap = window.gsap;

  function trazar(path) {
    var largo = path.getTotalLength();
    path.style.strokeDasharray = largo;
    path.style.strokeDashoffset = largo;
    return largo;
  }

  /* ---------- Intro del hero: una sola secuencia lenta ---------- */

  if (PSI.heroPendiente()) {
    var tl = gsap.timeline({ defaults: { ease: 'sine.out' } });
    tl.fromTo('.na-hero__identificador', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .9 }, 0)
      .fromTo('.na-linea > span', { opacity: 0, yPercent: 100 }, { opacity: 1, yPercent: 0, duration: 1.3, ease: 'power3.out', stagger: .14 }, .15)
      .fromTo('.na-hero__marco', { opacity: 0, scale: .94 }, { opacity: 1, scale: 1, duration: 1.8, ease: 'power2.out' }, .2)
      .fromTo('.na-hero__marco img', { scale: 1.14 }, { scale: 1, duration: 2.4, ease: 'power2.out' }, .2)
      .fromTo('.na-hero__intro', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1 }, .75)
      .fromTo('.na-hero__acciones', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1 }, .95)
      .fromTo('.na-hero__frase', { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 1.1 }, 1.3)
      .fromTo('.na-hero__mancha--salvia', { opacity: 0, scale: .6 }, { opacity: .55, scale: 1, duration: 1.8, ease: 'power2.out' }, .5)
      .fromTo('.na-hero__punto', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.6)' }, 1.1);

    var trayecto = PSI.$('.js-trayecto');
    if (trayecto && trayecto.getBoundingClientRect().width) {
      trazar(trayecto);
      tl.to(trayecto, { strokeDashoffset: 0, duration: 2.6, ease: 'sine.inOut' }, .6);
    }
    PSI.soltarHero();
  }

  // Flotación lenta de las formas: solo transform, sin afectar el diseño.
  PSI.$$('.js-flota').forEach(function (el, i) {
    gsap.to(el, { y: i % 2 ? 10 : -12, rotation: i % 2 ? -4 : 3, duration: 5 + i * 1.3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  });

  /* ---------- Proceso: la línea se dibuja con el desplazamiento ---------- */

  var mm = gsap.matchMedia();
  var etapas = PSI.$('.na-proceso__etapas');

  function lineaProceso(selector) {
    var path = PSI.$(selector + ' .js-proceso-linea');
    if (!path || !etapas) return;
    trazar(path);
    gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: { trigger: etapas, start: 'top 80%', end: 'bottom 55%', scrub: 1 }
    });
  }
  mm.add('(min-width: 768px)', function () { lineaProceso('.na-proceso__linea--h'); });
  mm.add('(max-width: 767.98px)', function () { lineaProceso('.na-proceso__linea--v'); });

  gsap.from('.na-etapa', {
    opacity: 0,
    y: 28,
    duration: 1.1,
    ease: 'sine.out',
    stagger: .2,
    scrollTrigger: { trigger: etapas, start: 'top 78%', once: true }
  });
  gsap.from('.na-etapa__num', {
    scale: .7,
    rotation: -8,
    duration: 1.4,
    ease: 'elastic.out(1, .6)',
    stagger: .2,
    scrollTrigger: { trigger: etapas, start: 'top 78%', once: true }
  });

  /* ---------- Acompañamiento: parallax suave solo en pantallas grandes ---------- */

  mm.add('(min-width: 768px)', function () {
    gsap.fromTo('.js-parallax', { yPercent: -8 }, {
      yPercent: 0,
      ease: 'none',
      scrollTrigger: { trigger: '.na-acomp__foto', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
  gsap.from('.na-acomp__texto', {
    y: 40,
    opacity: 0,
    duration: 1.2,
    ease: 'sine.out',
    scrollTrigger: { trigger: '.na-acomp__texto', start: 'top 88%', once: true }
  });

  /* ---------- Familias: la foto aparece desde su forma ---------- */

  gsap.from('.na-familias__foto img', {
    scale: .92,
    opacity: 0,
    duration: 1.6,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.na-familias', start: 'top 75%', once: true }
  });
})();
