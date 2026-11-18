/*
 * CTICOL — carruseles del inicio (Swiper 11 + GSAP 3).
 *   Hero: 3 diapositivas, fundido, autoplay de 6 s con pausa al pasar el cursor,
 *         barra de progreso por tramo, botón de pausa, zoom lento (Ken Burns)
 *         y entrada escalonada de etiqueta, título, texto y botones.
 *   Flota: carrusel táctil de tipos de vehículo.
 * Con prefers-reduced-motion: sin autoplay (se puede activar con el botón), sin zoom ni entradas.
 * Sin Swiper: se ve la primera diapositiva fija (ver styles.css).
 */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsap = window.gsap;
  const animar = Boolean(gsap) && !reduce;
  const DURACION = 6000;

  /* Divide el título en palabras con máscara para que suban línea a línea. */
  function partirTitulo(titulo) {
    const envolver = (texto, destino) => {
      texto.split(/(\s+)/).forEach((trozo) => {
        if (!trozo) return;
        if (/^\s+$/.test(trozo)) { destino.appendChild(document.createTextNode(' ')); return; }
        const w = document.createElement('span');
        w.className = 'w';
        const i = document.createElement('span');
        i.textContent = trozo;
        w.appendChild(i);
        destino.appendChild(w);
      });
    };
    Array.from(titulo.childNodes).forEach((nodo) => {
      if (nodo.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        envolver(nodo.textContent, frag);
        titulo.replaceChild(frag, nodo);
      } else if (nodo.nodeType === Node.ELEMENT_NODE) {
        const texto = nodo.textContent;
        nodo.textContent = '';
        envolver(texto, nodo);
      }
    });
  }

  function entrada(slide) {
    if (!animar || !slide) return;
    const q = (sel) => slide.querySelector(sel);
    const palabras = slide.querySelectorAll('.hero-title .w > span');
    gsap.killTweensOf([q('[data-hero="tag"]'), palabras, q('[data-hero="text"]'), q('[data-hero="actions"]')]);
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .fromTo(q('[data-hero="tag"]'), { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: .6 }, .15)
      .fromTo(palabras, { yPercent: 110 }, { yPercent: 0, duration: .85, stagger: .045 }, .25)
      .fromTo(q('[data-hero="text"]'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .7 }, .65)
      .fromTo(q('[data-hero="actions"]'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .7 }, .8);
  }

  function kenBurns(slide) {
    if (!animar || !slide) return;
    const img = slide.querySelector('.hero-img');
    if (img) gsap.fromTo(img, { scale: 1 }, { scale: 1.08, duration: 8, ease: 'none', overwrite: true });
  }

  function initHero() {
    const hero = document.querySelector('.hero');
    const el = document.querySelector('[data-hero-swiper]');
    if (!hero || !el) return;
    document.querySelectorAll('.hero-title').forEach(partirTitulo);
    hero.classList.add('hero-ready');
    if (typeof window.Swiper !== 'function') return;

    const tramos = Array.from(document.querySelectorAll('[data-tramo]'));
    const pausa = document.querySelector('[data-hero-pause]');

    const marcarTramo = (activo) => {
      tramos.forEach((t, i) => {
        t.classList.toggle('is-active', i === activo);
        t.classList.toggle('is-done', i < activo);
        if (i === activo) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
        const fill = t.querySelector('.tramo-fill');
        if (fill && i >= activo) fill.style.transform = 'scaleX(0)';
      });
    };

    const swiper = new window.Swiper(el, {
      effect: 'fade',
      fadeEffect: { crossFade: true },
      speed: reduce ? 0 : 1100,
      rewind: true,
      autoplay: { delay: DURACION, disableOnInteraction: false, pauseOnMouseEnter: true },
      keyboard: { enabled: true, onlyInViewport: true },
      navigation: { prevEl: '[data-hero-prev]', nextEl: '[data-hero-next]' },
      a11y: {
        enabled: true,
        slideLabelMessage: '',
        itemRoleDescriptionMessage: '',
        prevSlideMessage: 'Diapositiva anterior',
        nextSlideMessage: 'Diapositiva siguiente',
        firstSlideMessage: 'Primera diapositiva',
        lastSlideMessage: 'Última diapositiva'
      },
      on: {
        init(s) {
          const slide = s.slides[s.activeIndex];
          marcarTramo(s.realIndex);
          kenBurns(slide);
          entrada(slide);
        },
        slideChangeTransitionStart(s) {
          const slide = s.slides[s.activeIndex];
          marcarTramo(s.realIndex);
          kenBurns(slide);
          entrada(slide);
        },
        autoplayTimeLeft(s, tiempo, progreso) {
          const t = tramos[s.realIndex];
          const fill = t && t.querySelector('.tramo-fill');
          if (fill) fill.style.transform = `scaleX(${Math.min(1, Math.max(0, 1 - progreso))})`;
        }
      }
    });

    // Las diapositivas inactivas no deben recibir foco con Tab.
    const inertes = () => swiper.slides.forEach((s, i) => { s.inert = i !== swiper.activeIndex; });
    inertes();
    swiper.on('slideChange', inertes);

    tramos.forEach((t, i) => t.addEventListener('click', () => swiper.slideTo(i)));

    const setPausa = (pausado) => {
      if (!pausa) return;
      pausa.setAttribute('aria-pressed', String(pausado));
      pausa.setAttribute('aria-label', pausado ? 'Reproducir el carrusel' : 'Pausar el carrusel');
      pausa.querySelector('i').className = pausado ? 'bi bi-play-fill' : 'bi bi-pause-fill';
    };
    if (reduce) { swiper.autoplay.stop(); setPausa(true); }
    if (pausa) {
      pausa.addEventListener('click', () => {
        if (swiper.autoplay.running) { swiper.autoplay.stop(); setPausa(true); }
        else { swiper.autoplay.start(); setPausa(false); }
      });
    }
    // Pausa mientras el foco del teclado está dentro del hero.
    hero.addEventListener('focusin', () => { if (swiper.autoplay.running) swiper.autoplay.pause(); });
    hero.addEventListener('focusout', (ev) => {
      if (!hero.contains(ev.relatedTarget) && swiper.autoplay.running) swiper.autoplay.resume();
    });
  }

  function initFlota() {
    const el = document.querySelector('[data-fleet-swiper]');
    if (!el || typeof window.Swiper !== 'function') return;
    new window.Swiper(el, {
      slidesPerView: 1.12,
      spaceBetween: 16,
      speed: reduce ? 0 : 600,
      grabCursor: true,
      keyboard: { enabled: true, onlyInViewport: true },
      navigation: { prevEl: '[data-fleet-prev]', nextEl: '[data-fleet-next]' },
      a11y: { enabled: true, prevSlideMessage: 'Vehículos anteriores', nextSlideMessage: 'Vehículos siguientes', slideLabelMessage: '{{index}} de {{slidesLength}}' },
      breakpoints: {
        576: { slidesPerView: 1.6, spaceBetween: 20 },
        768: { slidesPerView: 2.2, spaceBetween: 24 },
        1200: { slidesPerView: 3, spaceBetween: 28 }
      }
    });
  }

  initHero();
  initFlota();
})();
