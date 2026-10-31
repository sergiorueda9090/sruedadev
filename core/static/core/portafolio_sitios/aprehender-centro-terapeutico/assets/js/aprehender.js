/*
 * Aprehender: pestañas del proceso, visor de la galería y movimiento expresivo
 * (piezas que se apilan, fotos que «encajan» con un pequeño rebote).
 */
(function () {
  'use strict';
  var PSI = window.PSI;
  if (!PSI) return;

  var motion = PSI.motionOk();
  var gsap = window.gsap;

  /* ---------- Pestañas del proceso (patrón ARIA tabs) ---------- */

  var tabs = PSI.$$('.ap-tab');
  var paneles = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });

  function animarPanel(panel) {
    if (!motion) return;
    gsap.fromTo(panel.querySelector('.ap-panel__figura'), { scale: .75, rotation: -8, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: .8, ease: 'back.out(1.7)', transformOrigin: '50% 100%' });
    gsap.fromTo(panel.querySelector('.ap-panel__num'), { yPercent: 35, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .7, ease: 'power3.out' });
    gsap.fromTo(panel.querySelectorAll('h3, p:not(.ap-panel__num)'), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power2.out', stagger: .08, delay: .1 });
  }

  function seleccionar(i, enfocar) {
    tabs.forEach(function (t, j) {
      var activa = i === j;
      t.setAttribute('aria-selected', String(activa));
      t.tabIndex = activa ? 0 : -1;
      paneles[j].hidden = !activa;
    });
    if (enfocar) tabs[i].focus();
    animarPanel(paneles[i]);
  }

  if (tabs.length) {
    paneles.forEach(function (p, j) { p.hidden = j !== 0; });
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { seleccionar(i, false); });
      tab.addEventListener('keydown', function (e) {
        var destino = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') destino = (i + 1) % tabs.length;
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') destino = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') destino = 0;
        if (e.key === 'End') destino = tabs.length - 1;
        if (destino !== null) { e.preventDefault(); seleccionar(destino, true); }
      });
    });
  }

  /* ---------- Galería ---------- */

  PSI.visor(PSI.$$('.ap-galeria__btn'));

  if (!motion) return;

  function trazar(path) {
    var largo = path.getTotalLength();
    path.style.strokeDasharray = largo;
    path.style.strokeDashoffset = largo;
  }

  /* ---------- Intro del hero: las piezas del juguete se apilan ---------- */

  if (PSI.heroPendiente()) {
    var arcos = PSI.$$('.js-arco');
    arcos.forEach(trazar);

    var tl = gsap.timeline();
    tl.fromTo('.ap-hero__lugar', { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: .7, ease: 'power2.out' }, 0)
      .fromTo('.ap-hero__linea > span', { opacity: 0, yPercent: 110, rotation: 3 }, { opacity: 1, yPercent: 0, rotation: 0, duration: 1, ease: 'back.out(1.3)', stagger: .11 }, .1)
      .to(arcos, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', stagger: .16 }, .25)
      .fromTo('.ap-collage__principal', { opacity: 0, yPercent: 18 }, { opacity: 1, yPercent: 0, duration: 1.1, ease: 'back.out(1.25)' }, .7)
      .fromTo('.ap-collage__circulo', { opacity: 0, scale: 0, rotation: -25 }, { opacity: 1, scale: 1, rotation: 0, duration: .9, ease: 'back.out(1.8)' }, 1.05)
      .fromTo('.ap-collage__cuarto', { opacity: 0, scale: 0, rotation: 20 }, { opacity: 1, scale: 1, rotation: 0, duration: .9, ease: 'back.out(1.8)', transformOrigin: '100% 100%' }, 1.2)
      .fromTo('.ap-forma', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .7, ease: 'back.out(2)', stagger: .12 }, 1.3)
      .fromTo('.ap-etiqueta', { opacity: 0, y: -22 }, { opacity: 1, y: 0, duration: .7, ease: 'bounce.out', stagger: .14 }, 1.45)
      .fromTo('.ap-hero__texto > p', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .8, ease: 'power2.out' }, .75)
      .fromTo('.ap-hero__acciones', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .8, ease: 'power2.out' }, .9);
    PSI.soltarHero();
  }

  /* ---------- Desplazamiento: pocas entradas, con carácter ---------- */

  gsap.from('.ap-destacada', {
    y: 60, opacity: 0, rotation: -1.5, duration: 1.1, ease: 'back.out(1.2)',
    scrollTrigger: { trigger: '.ap-terapias__grid', start: 'top 80%', once: true }
  });
  gsap.from('.ap-secundaria__foto', {
    scale: .6, rotation: -14, opacity: 0, duration: 1, ease: 'back.out(1.7)', stagger: .18,
    scrollTrigger: { trigger: '.ap-terapias__grid', start: 'top 70%', once: true }
  });

  window.ScrollTrigger.batch('.ap-galeria__item', {
    start: 'top 88%',
    once: true,
    onEnter: function (lote) {
      gsap.from(lote, { y: 50, opacity: 0, rotation: function (i) { return i % 2 ? 2 : -2; }, duration: 1, ease: 'back.out(1.3)', stagger: .12 });
    }
  });

  var arcosContacto = PSI.$$('.ap-contacto__arcos path');
  arcosContacto.forEach(trazar);
  gsap.to(arcosContacto, {
    strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', stagger: .15,
    scrollTrigger: { trigger: '.ap-contacto', start: 'top 70%', once: true }
  });

})();
