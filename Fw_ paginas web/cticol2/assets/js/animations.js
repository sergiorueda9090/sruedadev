/*
 * CTICOL — entradas al hacer scroll (GSAP + ScrollTrigger).
 *   [data-reveal="img"]  la foto se descubre de izquierda a derecha, como una carga que entra a la plataforma.
 *   [data-reveal]        bloques de texto: suben 24 px y aparecen.
 *   [data-reveal-item]   elementos de una lista: aparecen en grupo, escalonados.
 * Si GSAP no carga o el usuario pide movimiento reducido, no se toca nada: el contenido ya está visible.
 */
(function () {
  'use strict';

  const gsap = window.gsap;
  const ST = window.ScrollTrigger;
  if (!gsap || !ST || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ST);

  gsap.utils.toArray('[data-reveal="img"]').forEach((el) => {
    const img = el.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    tl.fromTo(el, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power3.inOut', clearProps: 'clipPath' });
    if (img) tl.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.5, ease: 'power3.out', clearProps: 'transform' }, 0);
  });

  gsap.utils.toArray('[data-reveal]:not([data-reveal="img"])').forEach((el) => {
    gsap.fromTo(el, { autoAlpha: 0, y: 24 }, {
      autoAlpha: 1, y: 0, duration: .8, ease: 'power2.out', clearProps: 'transform,opacity,visibility',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  const items = gsap.utils.toArray('[data-reveal-item]');
  if (items.length) {
    gsap.set(items, { autoAlpha: 0, y: 28 });
    ST.batch(items, {
      start: 'top 92%',
      once: true,
      onEnter: (lote) => gsap.to(lote, { autoAlpha: 1, y: 0, duration: .7, stagger: .08, ease: 'power2.out', clearProps: 'transform' })
    });
  }

  // Las fotos con loading="lazy" cambian la altura de la página al cargar: recalcula los disparadores.
  window.addEventListener('load', () => ST.refresh());
})();
