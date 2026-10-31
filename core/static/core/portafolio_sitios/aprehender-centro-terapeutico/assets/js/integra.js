/*
 * Integra: carril de instalaciones con controles y movimiento preciso
 * (revelados por recorte, líneas que se trazan en orden, sin rebotes).
 */
(function () {
  'use strict';
  var PSI = window.PSI;
  if (!PSI) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Carril de instalaciones ---------- */

  var carril = PSI.$('#carril');
  var ant = PSI.$('.js-carril-ant');
  var sig = PSI.$('.js-carril-sig');

  function estadoBotones() {
    var max = carril.scrollWidth - carril.clientWidth - 2;
    ant.disabled = carril.scrollLeft <= 2;
    sig.disabled = carril.scrollLeft >= max;
  }

  if (carril && ant && sig) {
    var mover = function (dir) {
      carril.scrollBy({ left: dir * carril.clientWidth * .8, behavior: reduce.matches ? 'auto' : 'smooth' });
    };
    ant.addEventListener('click', function () { mover(-1); });
    sig.addEventListener('click', function () { mover(1); });
    carril.addEventListener('scroll', estadoBotones, { passive: true });
    window.addEventListener('resize', estadoBotones);
    window.addEventListener('load', estadoBotones);
    estadoBotones();
  }

  if (!PSI.motionOk()) return;

  var gsap = window.gsap;
  var preciso = 'power3.inOut';

  /* ---------- Intro del hero: la retícula se traza y las fotos se recortan ---------- */

  if (PSI.heroPendiente()) {
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo('.in-reticula span', { scaleY: 0 }, { scaleY: 1, transformOrigin: '50% 0', duration: 1.1, ease: preciso, stagger: .035 }, 0)
      .fromTo('.in-hero__ref', { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: .6 }, .2)
      .fromTo('.in-hero__linea', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .8, stagger: .09 }, .3)
      .fromTo('.in-hero__lateral', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .7 }, .7)
      .fromTo('.in-hero__arq', { opacity: 1, clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: preciso }, .45)
      .fromTo('.in-hero__arq img', { scale: 1.08 }, { scale: 1, duration: 1.8, ease: 'power2.out' }, .45)
      .fromTo('.in-hero__sesion', { opacity: 1, clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: preciso }, 1);
    PSI.soltarHero();
  }

  gsap.from('.in-atributos li', {
    opacity: 0, y: 12, duration: .7, ease: 'power2.out', stagger: .1,
    scrollTrigger: { trigger: '.in-atributos', start: 'top 88%', once: true }
  });

  /* ---------- Servicios: las celdas aparecen en orden de lectura ---------- */

  window.ScrollTrigger.batch('.in-celda', {
    start: 'top 88%',
    once: true,
    onEnter: function (lote) {
      gsap.from(lote, { opacity: 0, y: 16, duration: .7, ease: 'power2.out', stagger: .07 });
    }
  });

  /* ---------- Diagrama: nodos y conectores en secuencia ---------- */

  function animarDiagrama(svg) {
    var nodos = svg.querySelectorAll('.js-nodo');
    var sats = svg.querySelectorAll('.js-sat');
    var lineas = [];
    svg.querySelectorAll('.js-conector').forEach(function (el) {
      (el.tagName === 'path' ? [el] : Array.prototype.slice.call(el.querySelectorAll('path'))).forEach(function (p) {
        if (p.getAttribute('stroke-dasharray')) return; // la línea punteada solo aparece
        var largo = p.getTotalLength();
        p.style.strokeDasharray = largo;
        p.style.strokeDashoffset = largo;
        lineas.push(p);
      });
    });
    var punteadas = Array.prototype.slice.call(svg.querySelectorAll('.js-conector[stroke-dasharray], .in-svg-nota'));

    var tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 75%', once: true } });
    tl.from(nodos, { opacity: 0, y: 8, duration: .5, ease: 'power2.out', stagger: .14 })
      .to(lineas, { strokeDashoffset: 0, duration: .45, ease: preciso, stagger: .08 }, .2)
      .from(sats, { opacity: 0, duration: .5 }, '-=.3')
      .from(punteadas, { opacity: 0, duration: .6 }, '-=.1');
  }

  var mm = gsap.matchMedia();
  mm.add('(min-width: 992px)', function () { animarDiagrama(PSI.$('.in-diagrama__svg--h')); });
  mm.add('(max-width: 991.98px)', function () { animarDiagrama(PSI.$('.in-diagrama__svg--v')); });

  /* ---------- Mapa de cobertura ---------- */

  gsap.from('.js-punto', {
    opacity: 0, scale: .4, transformOrigin: '50% 50%', duration: .6, ease: 'power2.out', stagger: .12,
    scrollTrigger: { trigger: '.in-mapa', start: 'top 80%', once: true }
  });
})();
