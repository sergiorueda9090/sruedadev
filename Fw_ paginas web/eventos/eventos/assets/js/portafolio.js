/* Portafolio: entrada única de la portada y las tres tarjetas. */
(function () {
  'use strict';
  if (!window.EV || !window.EV.prepararGsap()) return;
  window.gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.portada-titulo', { autoAlpha: 0, y: 30, duration: .9 })
    .from('.portada-pie', { autoAlpha: 0, duration: .7 }, '-=.4')
    .from('.propuesta', { autoAlpha: 0, y: 48, duration: .9, stagger: .14 }, '-=.5');
})();
