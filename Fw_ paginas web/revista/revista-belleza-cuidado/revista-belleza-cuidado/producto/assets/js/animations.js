/* VITALIA — animaciones con GSAP + ScrollTrigger.
 * Principios: solo transform y opacidad; un único momento orquestado (la entrada del
 * héroe) y revelados discretos al desplazarse. Si GSAP no carga, las animaciones
 * están desactivadas en config.js o el usuario prefiere movimiento reducido, se
 * retira la clase «anim» de <html> y todo el contenido queda visible sin animar.
 */
(function (VT) {
  'use strict';
  const html = document.documentElement;
  const opciones = (VT.config && VT.config.animaciones) || {};
  const gsap = window.gsap;
  const ST = window.ScrollTrigger;
  const permitido = html.classList.contains('anim') && opciones.activas !== false && gsap && ST;

  function desactivar() { html.classList.remove('anim'); }

  if (!permitido) {
    desactivar();
    VT.anim = { revelar() {}, tarjetas() {}, refrescar() {}, activo: false };
    return;
  }

  gsap.registerPlugin(ST);
  const D = opciones.duracion || 0.9;
  const Y = opciones.desplazamiento || 28;
  const EASE = 'power3.out';
  gsap.defaults({ ease: EASE, duration: D });

  // Red de seguridad: si algo falla antes de animar, mostrar todo.
  const seguro = setTimeout(desactivar, 3500);

  function heroe() {
    const h = document.querySelector('.hero');
    if (!h) return;
    const q = (s) => h.querySelectorAll(s);
    gsap.set(q('[data-hero="estante"]'), { opacity: 1 });
    const tl = gsap.timeline({ defaults: { ease: EASE } });
    tl.fromTo(q('[data-hero="tag"]'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(q('[data-hero="linea"]'), { opacity: 0, yPercent: 40 }, { opacity: 1, yPercent: 0, duration: 1, stagger: 0.12 }, '-=0.3')
      .fromTo(q('[data-hero="foto"]'), { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' }, 0.15)
      .fromTo(q('[data-hero="texto"]'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, '-=1')
      .fromTo(q('[data-hero="productos"]'), { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out' }, '-=0.9')
      .fromTo(q('[data-hero="etiqueta"]'), { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.8 }, '-=0.8')
      .fromTo(q('[data-hero="estante"] > *'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.6');
    // Paralaje suave de la composición de productos (solo pantallas grandes)
    gsap.matchMedia().add('(min-width: 992px)', () => {
      gsap.to(q('[data-hero="productos"]'), { yPercent: -8, ease: 'none', scrollTrigger: { trigger: h, start: 'top top', end: 'bottom top', scrub: 0.6 } });
    });
  }

  // Revelado genérico: [data-reveal] (y opcionalmente data-reveal="stagger" para hijos)
  function revelar(ctx = document) {
    ctx.querySelectorAll('[data-reveal]:not([data-anim-listo])').forEach((el) => {
      el.dataset.animListo = '1';
      const hijos = el.dataset.reveal === 'stagger' ? el.children : null;
      if (hijos) {
        gsap.set(el, { opacity: 1 });
        gsap.fromTo(hijos, { opacity: 0, y: Y }, { opacity: 1, y: 0, stagger: 0.09, duration: D * 0.9, scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
      } else {
        gsap.fromTo(el, { opacity: 0, y: Y }, { opacity: 1, y: 0, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      }
    });
  }

  // Tarjetas de producto generadas por JS (catálogo, destacados, relacionados)
  function tarjetas(ctx) {
    const cards = Array.from(ctx.querySelectorAll('[data-card]:not([data-anim-listo])'));
    if (!cards.length) return;
    cards.forEach((c) => { c.dataset.animListo = '1'; });
    ST.batch(cards, {
      start: 'top 92%', once: true,
      onEnter: (lote) => gsap.fromTo(lote, { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.8, overwrite: true })
    });
    // Las que ya están en pantalla se muestran aunque el batch no dispare
    requestAnimationFrame(() => ST.refresh());
  }

  // Línea que conecta los pasos de compra
  function pasos() {
    const linea = document.querySelector('.pasos-linea');
    if (!linea) return;
    gsap.fromTo(linea, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'power2.inOut', scrollTrigger: { trigger: linea, start: 'top 80%', once: true } });
  }

  // Barras de distribución de opiniones
  function barras(ctx = document) {
    ctx.querySelectorAll('.barra span').forEach((b) => {
      gsap.fromTo(b, { scaleX: 0 }, { scaleX: 1, duration: 1, scrollTrigger: { trigger: b, start: 'top 92%', once: true } });
    });
  }

  function init() {
    clearTimeout(seguro);
    heroe();
    revelar();
    pasos();
    barras();
    // Las cards presentes en el HTML inicial
    tarjetas(document);
  }

  VT.anim = {
    activo: true,
    init,
    revelar,
    tarjetas,
    barras,
    refrescar: () => ST.refresh(),
    // Limpia los triggers de un contenedor antes de volver a pintarlo (catálogo)
    limpiar(ctx) {
      ST.getAll().forEach((t) => { if (t.trigger && ctx.contains(t.trigger)) t.kill(); });
    }
  };
})(window.VT = window.VT || {});
