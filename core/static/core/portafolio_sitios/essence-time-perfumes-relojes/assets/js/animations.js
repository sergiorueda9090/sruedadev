/* ==========================================================================
   ESSENCE & TIME — Animaciones (módulo central GSAP + ScrollTrigger)
   Principios:
   - Nada se anima por defecto: solo elementos con atributos opt-in
     [data-hero-item], [data-reveal], [data-reveal-group], [data-parallax].
   - Movimiento reducido, ahorro de datos o GSAP ausente → sin animación y
     contenido visible desde el primer momento.
   - Cada elemento se inicializa una sola vez (data-anim-ready).
   ========================================================================== */
(function (ET) {
  'use strict';

  const root = document.documentElement;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const lowPower = (navigator.hardwareConcurrency || 8) <= 4;

  let enabled = !!(gsap && ScrollTrigger) && !reduced.matches && !saveData;
  if (enabled) gsap.registerPlugin(ScrollTrigger);
  if (!enabled) root.classList.remove('motion-ok');

  // Si el usuario activa «reducir movimiento» con la página abierta, se detiene todo.
  reduced.addEventListener('change', (e) => {
    if (!e.matches || !enabled) return;
    enabled = false;
    ScrollTrigger.getAll().forEach((t) => t.kill());
    gsap.globalTimeline.clear();
    gsap.set('[data-hero-item], [data-reveal], [data-reveal-group] > *, .split-line__inner', { clearProps: 'all' });
    root.classList.remove('motion-ok');
  });

  const once = (el) => {
    if (el.dataset.animReady) return false;
    el.dataset.animReady = '1';
    return true;
  };

  const EASE = 'power3.out';

  const anim = {
    get enabled() { return enabled; },

    /** Entrada del hero: imagen, después titular por líneas y por último texto y CTAs. */
    hero(scope = document) {
      const items = Array.from(scope.querySelectorAll('[data-hero-item]'));
      if (!items.length) return;
      if (!enabled) { items.forEach((el) => { el.style.opacity = 1; }); return; }
      if (!once(items[0])) return;

      const media = items.filter((el) => el.dataset.heroItem === 'media');
      const title = items.filter((el) => el.dataset.heroItem === 'title');
      const rest = items.filter((el) => el.dataset.heroItem === 'text');
      // Se fija la opacidad final ANTES de crear los from(): GSAP toma como destino
      // el valor actual, y el CSS inicial lo deja en 0.
      gsap.set(items, { opacity: 1, animation: 'none' });
      const tl = gsap.timeline({ defaults: { ease: EASE } });

      if (media.length) tl.from(media, { opacity: 0, scale: 1.04, duration: 1.2, stagger: .18, ease: 'power2.out' }, 0);
      title.forEach((t) => {
        const lines = t.querySelectorAll('.split-line__inner');
        if (lines.length) tl.from(lines, { yPercent: 108, duration: .9, stagger: .09 }, .15);
        else tl.from(t, { opacity: 0, y: 18, duration: .8 }, .15);
      });
      if (rest.length) tl.from(rest, { opacity: 0, y: 14, duration: .7, stagger: .08 }, .55);
    },

    /** Revelado al entrar en el viewport, una sola vez. */
    reveal(targets, { y = 22, stagger = .08 } = {}) {
      if (!enabled) return;
      const els = gsap.utils.toArray(targets).filter(once);
      if (!els.length) return;
      gsap.set(els, { opacity: 0, y });
      ScrollTrigger.batch(els, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: .8, ease: EASE, stagger, overwrite: true }),
      });
    },

    /** Titular con líneas .split-line: sube línea a línea al entrar. */
    headline(el) {
      if (!enabled || !el || !once(el)) return;
      const lines = el.querySelectorAll('.split-line__inner');
      if (!lines.length) return;
      gsap.from(lines, {
        yPercent: 108, duration: .9, ease: EASE, stagger: .08,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    },

    /** Desplazamiento muy leve de imágenes de banner (solo escritorio y equipos capaces). */
    parallax(targets) {
      if (!enabled || lowPower || !window.matchMedia('(min-width: 992px)').matches) return;
      gsap.utils.toArray(targets).filter(once).forEach((img) => {
        gsap.fromTo(img, { yPercent: -4 }, {
          yPercent: 4, ease: 'none',
          scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: .6 },
        });
      });
    },

    toastIn(el) {
      if (!enabled) return;
      gsap.from(el, { opacity: 0, y: 16, duration: .35, ease: EASE });
    },
    toastOut(el, done) {
      if (!enabled) { done(); return; }
      gsap.to(el, { opacity: 0, y: 8, duration: .22, ease: 'power2.in', onComplete: done });
    },

    /** Minicarrito: el panel entra con la transición de Bootstrap; sus líneas, escalonadas. */
    miniCartIn(panel) {
      if (!enabled) return;
      const lines = panel.querySelectorAll('.line, .empty-state, .mini-cart__foot');
      gsap.fromTo(lines, { opacity: 0, x: 18 }, { opacity: 1, x: 0, duration: .45, ease: EASE, stagger: .05, delay: .08, clearProps: 'transform' });
    },

    /** Confirmación breve en el botón que añadió al carrito (funciona sin GSAP). */
    confirmButton(btn) {
      if (!btn || btn.dataset.confirming) return;
      btn.dataset.confirming = '1';
      const original = btn.innerHTML;
      const w = btn.offsetWidth;
      btn.style.minWidth = `${w}px`;
      btn.innerHTML = '<i class="bi bi-check2" aria-hidden="true"></i> Añadido';
      if (enabled) gsap.fromTo(btn, { scale: .96 }, { scale: 1, duration: .4, ease: 'back.out(3)' });
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.minWidth = '';
        delete btn.dataset.confirming;
      }, 1600);
    },

    /** Inicialización opt-in de la página. */
    init(scope = document) {
      this.hero(scope);
      scope.querySelectorAll('[data-reveal]').forEach((el) => this.reveal(el));
      scope.querySelectorAll('[data-reveal-group]').forEach((g) => {
        if (g.dataset.animReady) return;
        g.dataset.animReady = '1';
        this.reveal(g.children, { stagger: .1 });
      });
      scope.querySelectorAll('[data-headline]').forEach((el) => this.headline(el));
      this.parallax(scope.querySelectorAll('[data-parallax]'));
    },

    /** Recalcula posiciones tras cambios de layout (filtros, carga progresiva). */
    refresh() { if (enabled) ScrollTrigger.refresh(); },
  };

  ET.anim = anim;
})(window.ET);
