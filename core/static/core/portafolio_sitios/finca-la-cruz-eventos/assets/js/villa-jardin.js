/* Villa Jardín: índice de celebraciones y animaciones.
 * Depende de main.js (window.EV). El contenido es visible sin este archivo. */
(function () {
  'use strict';

  var EV = window.EV;
  var sitio = EV.sitio() || {};

  /* Índice de celebraciones: el elemento activo muestra su foto (escritorio)
   * y su enlace abre WhatsApp con el tipo de evento ya escrito. */
  function iniciarIndice() {
    var items = document.querySelectorAll('.indice-item');
    var activar = function (item) {
      items.forEach(function (otro) { otro.classList.toggle('is-activo', otro === item); });
    };
    items.forEach(function (item) {
      var enlace = item.querySelector('.indice-enlace');
      item.addEventListener('mouseenter', function () { activar(item); });
      enlace.addEventListener('focus', function () { activar(item); });

      var evento = enlace.getAttribute('data-evento');
      var wa = EV.enlaceWhatsApp(sitio.whatsapp, 'Hola, vi la página de Villa Jardín y quiero cotizar un ' + evento + '.');
      if (wa && EV.soloDigitos(sitio.whatsapp).length >= 10) {
        enlace.setAttribute('href', wa);
        enlace.setAttribute('target', '_blank');
        enlace.setAttribute('rel', 'noopener');
        enlace.setAttribute('aria-label', 'Cotizar ' + evento + ' por WhatsApp');
      }
    });
  }

  function animar() {
    if (!EV.prepararGsap()) return;
    var gsap = window.gsap;

    /* Momento principal: el marco de la invitación se dibuja y el texto aparece. */
    var entrada = gsap.timeline({ defaults: { ease: 'power3.out' } });
    entrada
      .from('.hero-foto img', { scale: 1.08, duration: 2.4, ease: 'power2.out' }, 0)
      .from('.hero-linea--sup, .hero-linea--inf', { scaleX: 0, duration: 1.2, ease: 'power2.inOut' }, .2)
      .from('.hero-linea--izq, .hero-linea--der', { scaleY: 0, duration: 1.2, ease: 'power2.inOut' }, .2)
      .from('.hero-lugar', { autoAlpha: 0, y: 12, duration: .8 }, .7)
      .from('.hero-titulo', { autoAlpha: 0, y: 28, duration: 1.1 }, .85)
      .from('.hero-sub', { autoAlpha: 0, y: 18, duration: .9 }, 1.15)
      .from('.hero-acciones > *', { autoAlpha: 0, y: 14, duration: .7, stagger: .1 }, 1.35);

    if (!window.ScrollTrigger) return;

    /* Revelado de fotografías: se descubren de abajo hacia arriba. */
    gsap.utils.toArray('.revelar').forEach(function (el) {
      gsap.from(el, {
        clipPath: 'inset(14% 0 0 0)',
        autoAlpha: 0,
        y: 24,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    /* Títulos de sección y pasos del proceso. */
    gsap.utils.toArray('.seccion .titulo-vj').forEach(function (titulo) {
      gsap.from(titulo, {
        autoAlpha: 0, y: 22, duration: .9, ease: 'power3.out',
        scrollTrigger: { trigger: titulo, start: 'top 88%', once: true }
      });
    });
    gsap.from('.paso', {
      autoAlpha: 0, y: 20, duration: .7, stagger: .12, ease: 'power2.out',
      scrollTrigger: { trigger: '.pasos', start: 'top 80%', once: true }
    });
  }

  iniciarIndice();
  animar();
})();
