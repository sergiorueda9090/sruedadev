/* Inmobiliaria 360 — inmuebles, proyectos, formulario de asesoría y animaciones.
   Script clásico (sin módulos) para que funcione también abriendo el archivo directamente. */
(function () {
  'use strict';

  /* ======================================================
     1. CONFIGURACIÓN — lo único que se edita para un cliente
     ====================================================== */

  // Número de EJEMPLO. Reemplazar por el número autorizado del cliente
  // (código de país + número, sin «+» ni espacios) antes de publicar.
  const WHATSAPP_NUMBER = "573001234567";

  // true: muestra los avisos de «demostración».
  const DEMO_MODE = true;

  const MESSAGES = {
    asesoria: 'Hola, quisiera recibir asesoría de Inmobiliaria 360.',
    propietario: 'Hola, tengo un inmueble y quisiera información para venderlo, arrendarlo o que ustedes lo administren.',
    inversion: 'Hola, me interesa conocer opciones de inversión inmobiliaria en el área metropolitana de Bucaramanga.',
    propiedad: (p) => `Hola, estoy interesado en conocer más información sobre el inmueble «${p.name}» (${p.sector}, ${p.city}). ¿Podrían brindarme detalles?`,
    proyecto: (p) => `Hola, quisiera información del proyecto «${p.name}» en ${p.city}: tipologías, precios y plan de pagos.`
  };

  // Inmuebles DEMOSTRATIVOS (no son inventario real). segment: 'residencial' | 'comercial'.
  // `image` sin sufijo: se usan <image>-480.webp y <image>-960.webp. beds en 0 se muestra como «uso».
  const PROPERTIES = [
    { id: 'apto-provenza', demo: true, segment: 'residencial', name: 'Apartamento tipo loft', use: 'Vivienda', operation: 'venta', city: 'Bucaramanga', sector: 'Provenza', price: 385000000, beds: 3, baths: 2, area: 86, image: 'assets/img/apto-provenza', alt: 'Apartamento tipo loft con muro de ladrillo, biblioteca y comedor' },
    { id: 'casa-floridablanca', demo: true, segment: 'residencial', name: 'Casa de un nivel en conjunto', use: 'Vivienda', operation: 'arriendo', city: 'Floridablanca', sector: 'Lagos I', price: 4200000, beds: 3, baths: 3, area: 150, image: 'assets/img/casa-floridablanca', alt: 'Casa de un piso con fachada en madera y piedra y acceso amplio' },
    { id: 'apto-cabecera', demo: true, segment: 'residencial', name: 'Apartamento con estudio', use: 'Vivienda', operation: 'arriendo', city: 'Bucaramanga', sector: 'Cabecera del Llano', price: 3100000, beds: 3, baths: 2, area: 95, image: 'assets/img/apto-cabecera', alt: 'Sala de apartamento con sofás grises y biblioteca empotrada' },
    { id: 'apto-giron', demo: true, segment: 'residencial', name: 'Apartamento con vista a zonas verdes', use: 'Vivienda', operation: 'venta', city: 'Girón', sector: 'El Poblado', price: 298000000, beds: 3, baths: 2, area: 70, image: 'assets/img/apto-giron', alt: 'Sala con ventanales de piso a techo y vista a zonas verdes' },
    { id: 'oficina-cabecera', demo: true, segment: 'comercial', name: 'Oficina en edificio empresarial', use: 'Oficina', operation: 'arriendo', city: 'Bucaramanga', sector: 'Cabecera del Llano', price: 6500000, beds: 0, baths: 2, area: 140, image: 'assets/img/oficina-cabecera', alt: 'Oficina con ventanales perimetrales, piso en concreto y sala de reuniones' },
    { id: 'bodega-chimita', demo: true, segment: 'comercial', name: 'Bodega con muelle de carga', use: 'Bodega', operation: 'venta', city: 'Girón', sector: 'Zona industrial Chimitá', price: 2400000000, beds: 0, baths: 2, area: 1800, image: 'assets/img/bodega-chimita', alt: 'Bodega de gran altura con estanterías industriales y cubierta metálica' },
    { id: 'local-floridablanca', demo: true, segment: 'comercial', name: 'Local esquinero de doble altura', use: 'Local', operation: 'arriendo', city: 'Floridablanca', sector: 'Autopista', price: 7800000, beds: 0, baths: 2, area: 210, image: 'assets/img/local-floridablanca', alt: 'Local comercial de doble altura adecuado como restaurante' },
    { id: 'oficina-piso', demo: true, segment: 'comercial', name: 'Piso completo de oficinas', use: 'Oficina', operation: 'venta', city: 'Bucaramanga', sector: 'Sotomayor', price: 1350000000, beds: 0, baths: 4, area: 320, image: 'assets/img/oficina-piso', alt: 'Sala de juntas con ventanal continuo y mesa para doce personas' }
  ];

  // Proyectos DEMOSTRATIVOS. stage: índice en STAGES.
  const STAGES = ['Lanzamiento', 'Preventa', 'Construcción', 'Entrega'];
  const PROJECTS = [
    { id: 'torre-mirador', demo: true, name: 'Torre Mirador 36', city: 'Bucaramanga', sector: 'Cabecera del Llano', from: 412000000, units: 'Apartamentos de 64 a 110 m²', delivery: 'Entrega estimada: por confirmar', stage: 2, image: 'assets/img/proyecto-torre', alt: 'Torre de vivienda en construcción con grúa' },
    { id: 'parque-arenales', demo: true, name: 'Parque Arenales', city: 'Piedecuesta', sector: 'Vía Piedecuesta', from: 268000000, units: 'Apartamentos de 58 a 82 m² con piscina y zonas verdes', delivery: 'Entrega estimada: por confirmar', stage: 1, image: 'assets/img/proyecto-parque', alt: 'Conjunto residencial de baja altura con piscina y zonas verdes' },
    { id: 'balcones', demo: true, name: 'Balcones de la Autopista', city: 'Floridablanca', sector: 'Autopista', from: 335000000, units: 'Apartamentos de 60 a 95 m² con balcón', delivery: 'Entrega estimada: por confirmar', stage: 0, image: 'assets/img/proyecto-balcones', alt: 'Fachada de edificio con balcones iluminados en tonos cálidos' }
  ];

  /* ======================================================
     2. UTILIDADES
     ====================================================== */
  const COP = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
  const NUM = new Intl.NumberFormat('es-CO');
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function waLink(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (v === null || v === undefined || v === false) return;
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else node.setAttribute(k, v === true ? '' : v);
    });
    [].concat(children).forEach((c) => c && node.append(typeof c === 'string' ? document.createTextNode(c) : c));
    return node;
  }

  /* ======================================================
     3. INMUEBLES CON FILTRO POR USO
     ====================================================== */
  let segment = '';

  function unit(p) {
    const isRent = p.operation === 'arriendo';
    const data = p.beds
      ? [['Área', `${NUM.format(p.area)} m²`], ['Habitaciones', p.beds], ['Baños', p.baths]]
      : [['Área', `${NUM.format(p.area)} m²`], ['Uso', p.use], ['Baños', p.baths]];
    return el('li', {}, [
      el('article', { class: 'unit', 'aria-labelledby': `u-${p.id}` }, [
        el('figure', { class: 'unit-media' }, [
          el('img', { src: `${p.image}-480.webp`, srcset: `${p.image}-480.webp 480w, ${p.image}-960.webp 960w`, sizes: '(min-width: 1200px) 23vw, (min-width: 640px) 46vw, 92vw', width: 480, height: 360, loading: 'lazy', decoding: 'async', alt: p.alt }),
          el('div', { class: 'unit-tags' }, [
            el('span', { class: isRent ? 'tag-arriendo' : 'tag-venta', text: isRent ? 'Arriendo' : 'Venta' }),
            el('span', { class: 'tag-uso', text: p.use })
          ])
        ]),
        el('div', { class: 'unit-body' }, [
          el('p', { class: 'unit-place', text: `${p.sector}, ${p.city}` }),
          el('h3', { class: 'unit-name', id: `u-${p.id}`, text: p.name }),
          el('dl', { class: 'unit-data' }, data.map(([k, v]) => el('div', {}, [el('dt', { text: k }), el('dd', { text: String(v) })]))),
          el('p', { class: 'unit-price' }, [COP.format(p.price), isRent ? el('small', { text: ' al mes' }) : null]),
          el('a', { class: 'unit-cta', href: waLink(MESSAGES.propiedad(p)), target: '_blank', rel: 'noopener', 'aria-label': `Consultar por WhatsApp: ${p.name}, ${p.city}` }, [
            el('i', { class: 'bi bi-whatsapp', 'aria-hidden': 'true' }), 'Consultar'
          ])
        ])
      ])
    ]);
  }

  function renderListings(animate) {
    const list = PROPERTIES.filter((p) => !segment || p.segment === segment);
    $('#listing-grid').replaceChildren(...list.map(unit));
    const label = segment ? (segment === 'residencial' ? 'residenciales' : 'comerciales') : 'residenciales y comerciales';
    $('#results-line').textContent = `${list.length} inmuebles ${label} de ejemplo`;
    $$('.segment-btn').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.segment === segment)));
    // La altura de la grilla cambia: los disparadores de más abajo deben recalcularse.
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    if (animate && window.gsap && !reduceMotion.matches) {
      window.gsap.from('#listing-grid .unit', { opacity: 0, y: 16, duration: 0.45, stagger: 0.05, ease: 'power2.out', clearProps: 'all' });
    }
  }

  function bindListings() {
    $$('.segment-btn').forEach((b) => b.addEventListener('click', () => {
      segment = b.dataset.segment;
      renderListings(true);
    }));
    $$('[data-segment-link]').forEach((a) => a.addEventListener('click', () => {
      segment = a.dataset.segmentLink;
      renderListings(false);
    }));
  }

  /* ======================================================
     4. PROYECTOS
     ====================================================== */
  function renderProjects() {
    const grid = $('#project-grid');
    grid.replaceChildren(...PROJECTS.map((p, i) => el('article', { class: 'project', 'aria-labelledby': `p-${p.id}` }, [
      el('figure', { class: 'project-media' }, [
        el('img', { src: `${p.image}-${i === 0 ? 1400 : 800}.webp`, srcset: `${p.image}-800.webp 800w, ${p.image}-1400.webp 1400w`, sizes: i === 0 ? '(min-width: 992px) 56vw, 100vw' : '(min-width: 992px) 40vw, 100vw', width: 1400, height: 875, loading: 'lazy', decoding: 'async', alt: p.alt }),
        el('span', { class: 'project-flag', text: 'Proyecto de ejemplo' })
      ]),
      el('div', { class: 'project-body' }, [
        el('h3', { id: `p-${p.id}`, text: p.name }),
        el('p', { class: 'project-place', text: `${p.sector}, ${p.city}` }),
        el('p', { class: 'project-price' }, [el('span', { text: 'Desde' }), el('strong', { text: COP.format(p.from) })]),
        el('p', { class: 'project-meta', text: `${p.units}. ${p.delivery}.` }),
        el('ol', { class: 'stage', 'aria-label': `Etapa actual: ${STAGES[p.stage]}` }, STAGES.map((s, k) =>
          el('li', { class: k < p.stage ? 'done' : (k === p.stage ? 'current' : null), 'aria-current': k === p.stage ? 'step' : null, text: s }))),
        el('div', { class: 'project-actions' }, [
          el('a', { href: waLink(MESSAGES.proyecto(p)), target: '_blank', rel: 'noopener', 'aria-label': `Pedir información del proyecto ${p.name} por WhatsApp` }, [
            el('i', { class: 'bi bi-whatsapp', 'aria-hidden': 'true' }), 'Pedir información'
          ])
        ])
      ])
    ])));
  }

  /* ======================================================
     5. FORMULARIO DE ASESORÍA
     ====================================================== */
  function bindForm() {
    const f = $('#advice-form');
    if (!f) return;
    const result = $('[data-form-result]');
    const status = $('[data-form-status]', f);
    const submit = $('.btn-submit', f);
    const label = $('.btn-label', submit);
    const original = label.textContent;
    let busy = false;

    const rules = {
      nombre: (v) => v.trim().length >= 3 || 'Escribe tu nombre completo (mínimo 3 letras).',
      telefono: (v) => /^(\+?57)?3\d{9}$/.test(v.replace(/[\s-]/g, '')) || 'Escribe un celular colombiano de 10 dígitos que empiece por 3.',
      correo: (v) => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Revisa el correo: debe tener el formato nombre@empresa.com.',
      interes: (v) => !!v || 'Elige qué necesitas: comprar, arrendar, vender, administrar o invertir.',
      consentimiento: (_, field) => field.checked || 'Debes autorizar el tratamiento de datos para que podamos contactarte.'
    };

    function check(name) {
      const field = f.elements[name];
      const ok = rules[name](field.value, field);
      const err = $(`#a-${name}-err`);
      field.setAttribute('aria-invalid', ok === true ? 'false' : 'true');
      err.textContent = ok === true ? '' : ok;
      err.hidden = ok === true;
      return ok === true;
    }

    Object.keys(rules).forEach((name) => ['input', 'change'].forEach((ev) =>
      f.elements[name].addEventListener(ev, () => { if (f.elements[name].getAttribute('aria-invalid') === 'true') check(name); })));

    f.addEventListener('submit', (e) => {
      e.preventDefault();
      if (busy) return;
      const bad = Object.keys(rules).filter((n) => !check(n));
      if (bad.length) {
        status.textContent = `Hay ${bad.length} ${bad.length === 1 ? 'campo por corregir' : 'campos por corregir'}.`;
        f.elements[bad[0]].focus();
        return;
      }
      busy = true;
      submit.disabled = true;
      submit.setAttribute('aria-busy', 'true');
      label.textContent = 'Preparando solicitud…';

      const d = Object.fromEntries(new FormData(f).entries());
      const text = [
        'Hola, solicito asesoría de Inmobiliaria 360.',
        `Nombre: ${d.nombre.trim()}`,
        `Celular: ${d.telefono.trim()}`,
        d.correo && d.correo.trim() ? `Correo: ${d.correo.trim()}` : null,
        `Necesito: ${d.interes}`,
        d.uso ? `Tipo de inmueble: ${d.uso}` : null,
        d.ciudad ? `Ciudad: ${d.ciudad}` : null,
        d.mensaje && d.mensaje.trim() ? `Mensaje: ${d.mensaje.trim()}` : null
      ].filter(Boolean).join('\n');

      // Pausa breve para que el cambio de estado sea visible; no hay envío a ningún servidor.
      setTimeout(() => {
        $('[data-result-link]', result).href = waLink(text);
        f.hidden = true;
        result.hidden = false;
        result.focus();
        busy = false;
        submit.disabled = false;
        submit.removeAttribute('aria-busy');
        label.textContent = original;
      }, 500);
    });

    $('[data-result-edit]', result).addEventListener('click', () => {
      result.hidden = true;
      f.hidden = false;
      f.elements.nombre.focus();
    });

    $$('[data-set-interest]').forEach((a) => a.addEventListener('click', () => {
      f.elements.interes.value = a.dataset.setInterest;
    }));
  }

  /* ======================================================
     6. GENERALES
     ====================================================== */
  function bindGeneral() {
    $$('[data-wa]').forEach((a) => {
      const msg = MESSAGES[a.dataset.wa];
      if (typeof msg !== 'string') return;
      a.href = waLink(msg);
      a.target = '_blank';
      a.rel = 'noopener';
    });
    if (!DEMO_MODE) $$('[data-demo]').forEach((n) => n.remove());

    const menu = $('#menu');
    $$('#menu a').forEach((a) => a.addEventListener('click', () => {
      if (menu.classList.contains('show') && window.bootstrap) window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }));
    $$('[data-year]').forEach((n) => { n.textContent = new Date().getFullYear(); });

    const mark = (img) => { const box = img.closest('figure, .line-feature, .invest-bg, .final-bg'); if (box) box.classList.add('img-fallback'); };
    document.addEventListener('error', (e) => { if (e.target.tagName === 'IMG') mark(e.target); }, true);
    $$('img').forEach((img) => { if (img.complete && img.naturalWidth === 0) mark(img); });
  }

  /* ======================================================
     7. ANIMACIONES (GSAP + ScrollTrigger)
     ====================================================== */
  function initMotion() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      // Hero: la viga naranja se traza, el titular sube línea por línea
      // y la fotografía se descubre piso por piso, de abajo hacia arriba.
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-beam', { scaleY: 0, duration: 0.9, ease: 'power2.inOut' })
        .from('.hero-title .ln > span', { yPercent: 110, duration: 0.9, stagger: 0.12 }, 0.2)
        .fromTo('.floors i', { scaleX: 1 }, { scaleX: 0, duration: 0.7, stagger: { each: 0.1, from: 'end' }, ease: 'power3.inOut' }, 0.3)
        .from('.hero-photo img', { scale: 1.12, duration: 1.6, ease: 'power2.out' }, 0.3)
        .from('.hero-lead, .hero-actions', { opacity: 0, y: 16, duration: 0.6, stagger: 0.1 }, 0.8)
        .from('.hero-index a', { opacity: 0, y: 12, duration: 0.5, stagger: 0.06 }, 1.1);

      gsap.from('.project', {
        opacity: 0, y: 30, duration: 0.7, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: '#project-grid', start: 'top 80%', once: true }
      });

      gsap.fromTo('.invest-bg img', { yPercent: -6 }, {
        yPercent: 0, ease: 'none',
        scrollTrigger: { trigger: '.invest', start: 'top bottom', end: 'bottom top', scrub: true }
      });

      // Indicadores de ejemplo: conteo desde cero una sola vez.
      $$('[data-count-to]').forEach((n) => {
        const target = Number(n.dataset.countTo);
        const obj = { v: 0 };
        n.textContent = '0';
        gsap.to(obj, {
          v: target, duration: 1.4, ease: 'power2.out',
          scrollTrigger: { trigger: '.metrics-grid', start: 'top 85%', once: true },
          onUpdate: () => { n.textContent = NUM.format(Math.round(obj.v)); }
        });
      });
    });

    window.addEventListener('load', () => ScrollTrigger.refresh());
    // Las fuentes web cambian la altura del texto: recalcula posiciones al cargarlas.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  /* ======================================================
     8. ARRANQUE
     ====================================================== */
  function init() {
    bindGeneral();
    renderListings(false);
    bindListings();
    renderProjects();
    bindForm();
    initMotion();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
