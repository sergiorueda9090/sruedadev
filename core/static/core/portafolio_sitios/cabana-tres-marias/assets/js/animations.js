/*
 * Cabaña Las Tres Marías — animaciones (GSAP + ScrollTrigger).
 * Opt-in: solo corren sin movimiento reducido y si GSAP cargó. Revelado de fotos grandes,
 * transición de los planes y un parallax en el panorama del destino solo en escritorio.
 * Sin GSAP, todo queda visible.
 */
(function () {
  'use strict';

  var gsap = window.gsap;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!gsap || reduce) return;

  var ST = window.ScrollTrigger;
  if (ST) gsap.registerPlugin(ST);

  // 1. La entrada del hero está en CSS (styles.css, bloque 6) para no depender de esta librería.

  /* ---------- 2. Cambio de plan ---------- */
  window.TMAnim = {
    plan: function (panel) {
      gsap.fromTo(panel.querySelector('.plan-photo img'), { scale: 1.05, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' });
      gsap.fromTo(panel.querySelectorAll('.plan-body > *'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out', clearProps: 'all' });
    }
  };

  if (!ST) return;

  /* ---------- 3. Revelado de fotos ---------- */
  var mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767.98px)' }, function (ctx) {
    var desktop = ctx.conditions.desktop;
    gsap.utils.toArray('.reveal').forEach(function (fig) {
      var im = fig.querySelector('img');
      var t = gsap.timeline({ scrollTrigger: { trigger: fig, start: 'top 88%', once: true } });
      t.fromTo(fig, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: desktop ? 1.1 : 0.7, ease: 'power3.inOut', clearProps: 'clipPath' });
      if (desktop && im) t.fromTo(im, { scale: 1.12 }, { scale: 1, duration: 1.4, ease: 'power2.out', clearProps: 'transform' }, 0);
    });

    /* ---------- 4. Parallax del destino (solo escritorio) ---------- */
    if (desktop) {
      gsap.fromTo('.destino-img', { yPercent: -8 }, {
        yPercent: 0, ease: 'none',
        scrollTrigger: { trigger: '.destino-media', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }
  });

  window.addEventListener('load', function () { ST.refresh(); });
})();
