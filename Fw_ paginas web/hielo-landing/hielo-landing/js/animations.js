/* ==========================================================================
   animations.js — movimiento con GSAP + ScrollTrigger
   - Un solo momento orquestado: la foto del hero se «desempaña» mientras
     entran el titular, el texto y los botones.
   - En el resto de la página: la línea del proceso se llena, los títulos y
     las fichas aparecen al entrar en pantalla, y las cifras reales cuentan.
   - Con prefers-reduced-motion o sin GSAP no se anima nada y todo queda
     visible (el estado inicial oculto solo existe con html.js-anim).
   ========================================================================== */
(function () {
  'use strict';

  var raiz = document.documentElement;
  var reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsap = window.gsap;

  if (reducido || !gsap) {
    raiz.classList.remove('js-anim');
    return;
  }
  window.__heroAnimado = true;

  var ST = window.ScrollTrigger;
  if (ST) gsap.registerPlugin(ST);

  /* Hero ------------------------------------------------------------------- */
  var hero = document.querySelector('.hero');
  if (hero && raiz.classList.contains('js-anim')) {
    var partes = hero.querySelectorAll('[data-hero]');
    var foto = hero.querySelector('.hero-photo img');
    var escarcha = hero.querySelector('.frost');
    var lamina = hero.querySelector('.hero-pane');

    var tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: function () { raiz.classList.remove('js-anim'); gsap.set([partes, lamina, escarcha, foto], { clearProps: 'all' }); }
    });
    tl.fromTo(foto, { scale: 1.08 }, { scale: 1, duration: 2.2, ease: 'power2.out' }, 0)
      .fromTo(escarcha, { opacity: 1 }, { opacity: 0, duration: 1.8, ease: 'power1.inOut' }, 0.25)
      .fromTo(partes, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.1)
      .fromTo(lamina, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9 }, 1.1);

    // Planos translúcidos detrás de la foto: deriva mínima al desplazar.
    if (ST && window.matchMedia('(min-width: 992px)').matches) {
      gsap.to('.hero-photo', {
        yPercent: -4, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 }
      });
    }
  }

  if (!ST) return;

  /* Títulos de sección --------------------------------------------------------- */
  gsap.utils.toArray('main .section-title, .cta-copy h2').forEach(function (t) {
    if (t.closest('.hero')) return;
    gsap.from(t, {
      opacity: 0, y: 18, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: t, start: 'top 88%', once: true }
    });
  });

  /* Fichas de producto, en grupo ----------------------------------------------- */
  ST.batch('.product', {
    start: 'top 90%', once: true,
    onEnter: function (lote) {
      gsap.from(lote, { opacity: 0, y: 26, duration: 0.8, stagger: 0.1, ease: 'power2.out', clearProps: 'transform,opacity' });
    }
  });

  /* Línea del proceso ------------------------------------------------------------ */
  var linea = document.querySelector('.process-line');
  if (linea) {
    gsap.fromTo(linea, { '--fill': 0 }, {
      '--fill': 1, duration: 1.6, ease: 'power1.inOut',
      scrollTrigger: { trigger: linea, start: 'top 75%', once: true }
    });
    gsap.from(linea.querySelectorAll('.step-node'), {
      scale: 0.6, opacity: 0, duration: 0.5, stagger: 0.18, ease: 'back.out(1.6)',
      scrollTrigger: { trigger: linea, start: 'top 75%', once: true }
    });
  }

  /* Contadores: solo cifras reales (config.indicadores con valor numérico) ------ */
  gsap.utils.toArray('[data-count]').forEach(function (n) {
    var fin = Number(n.getAttribute('data-count'));
    if (!isFinite(fin)) return;
    var obj = { v: 0 };
    gsap.to(obj, {
      v: fin, duration: 1.6, ease: 'power2.out',
      scrollTrigger: { trigger: n, start: 'top 85%', once: true },
      onUpdate: function () { n.textContent = Math.round(obj.v).toLocaleString('es-CO'); },
      onComplete: function () { n.textContent = fin.toLocaleString('es-CO'); }
    });
  });
})();
