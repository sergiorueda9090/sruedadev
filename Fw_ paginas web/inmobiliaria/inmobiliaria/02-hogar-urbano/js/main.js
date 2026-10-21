/* Hogar Urbano — buscador, tarjetas, formulario de propietarios y animaciones.
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
    general: 'Hola, estoy buscando inmueble en el área metropolitana de Bucaramanga. ¿Me pueden ayudar?',
    propiedad: (p) => `Hola, estoy interesado en conocer más información sobre el inmueble «${p.name}» (${p.sector}, ${p.city}). ¿Podrían brindarme detalles?`
  };

  // Rangos de presupuesto por operación (pesos colombianos).
  const BUDGETS = {
    venta: [
      { min: 0, max: 300000000, label: 'Hasta $300 millones' },
      { min: 300000000, max: 600000000, label: '$300 a $600 millones' },
      { min: 600000000, max: Infinity, label: 'Más de $600 millones' }
    ],
    arriendo: [
      { min: 0, max: 1500000, label: 'Hasta $1,5 millones al mes' },
      { min: 1500000, max: 3000000, label: '$1,5 a $3 millones al mes' },
      { min: 3000000, max: Infinity, label: 'Más de $3 millones al mes' }
    ]
  };

  const TYPE_LABELS = { apartamento: 'Apartamento', casa: 'Casa', lote: 'Lote', local: 'Local', oficina: 'Oficina' };

  // Inmuebles DEMOSTRATIVOS: no son inventario real. `image` es la ruta sin sufijo
  // (se usan <image>-480.webp y <image>-960.webp). beds/baths en 0 se ocultan.
  const PROPERTIES = [
    { id: 'apto-canaveral', demo: true, name: 'Apartamento con balcón en Cañaveral', operation: 'arriendo', type: 'apartamento', city: 'Floridablanca', sector: 'Cañaveral', price: 2300000, beds: 3, baths: 2, area: 78, image: 'assets/img/apto-canaveral', alt: 'Apartamento con sala, comedor y cocina integrados junto a un ventanal' },
    { id: 'casa-lagos', demo: true, name: 'Casa familiar con garaje doble', operation: 'venta', type: 'casa', city: 'Floridablanca', sector: 'Lagos II', price: 520000000, beds: 4, baths: 3, area: 160, image: 'assets/img/casa-lagos', alt: 'Fachada de casa de dos pisos con garaje y luces encendidas al atardecer' },
    { id: 'apto-real-de-minas', demo: true, name: 'Apartamento cerca al parque', operation: 'venta', type: 'apartamento', city: 'Bucaramanga', sector: 'Real de Minas', price: 340000000, beds: 3, baths: 2, area: 72, image: 'assets/img/apto-real-de-minas', alt: 'Sala con sofá azul, piso de madera y ventana amplia' },
    { id: 'apartaestudio-cabecera', demo: true, name: 'Apartaestudio amoblado', operation: 'arriendo', type: 'apartamento', city: 'Bucaramanga', sector: 'Cabecera del Llano', price: 1450000, beds: 1, baths: 1, area: 38, image: 'assets/img/apartaestudio-cabecera', alt: 'Rincón de apartaestudio con sillón amarillo, lámpara de pie y cuadro' },
    { id: 'casa-giron', demo: true, name: 'Casa moderna con antejardín', operation: 'venta', type: 'casa', city: 'Girón', sector: 'El Poblado', price: 410000000, beds: 3, baths: 3, area: 140, image: 'assets/img/casa-giron', alt: 'Casa moderna blanca con volumen en madera y antejardín' },
    { id: 'lote-piedecuesta', demo: true, name: 'Lote campestre con vista', operation: 'venta', type: 'lote', city: 'Piedecuesta', sector: 'Vía a Guatiguará', price: 260000000, beds: 0, baths: 0, area: 1200, image: 'assets/img/lote-piedecuesta', alt: 'Terreno verde en ladera con montañas y nubes al fondo' },
    { id: 'local-centro', demo: true, name: 'Local comercial a la calle', operation: 'arriendo', type: 'local', city: 'Bucaramanga', sector: 'Centro', price: 4800000, beds: 0, baths: 1, area: 85, image: 'assets/img/local-centro', alt: 'Local comercial adecuado como tienda de ropa con estanterías y lámparas' },
    { id: 'oficina-cabecera', demo: true, name: 'Oficina con sala de juntas', operation: 'arriendo', type: 'oficina', city: 'Bucaramanga', sector: 'Cabecera del Llano', price: 3200000, beds: 0, baths: 2, area: 64, image: 'assets/img/oficina-cabecera', alt: 'Oficina con piso en concreto pulido, divisiones de vidrio y cocineta' },
    { id: 'apto-piedecuesta', demo: true, name: 'Apartamento para estrenar', operation: 'venta', type: 'apartamento', city: 'Piedecuesta', sector: 'Cerca al parque principal', price: 245000000, beds: 3, baths: 2, area: 63, image: 'assets/img/apto-piedecuesta', alt: 'Sala con sofá de cuero, cojines verdes y cocina abierta al fondo' },
    { id: 'casa-san-alonso', demo: true, name: 'Casa de dos pisos con patio', operation: 'arriendo', type: 'casa', city: 'Bucaramanga', sector: 'San Alonso', price: 3900000, beds: 4, baths: 3, area: 180, image: 'assets/img/casa-san-alonso', alt: 'Casa de dos pisos con fachada en madera, ventanales y jardín' },
    { id: 'apto-bucarica', demo: true, name: 'Apartamento con cocina remodelada', operation: 'arriendo', type: 'apartamento', city: 'Floridablanca', sector: 'Bucarica', price: 1900000, beds: 3, baths: 2, area: 68, image: 'assets/img/apto-bucarica', alt: 'Cocina en L con gabinetes grises, repisas abiertas y ventana' },
    { id: 'oficina-floridablanca', demo: true, name: 'Oficina luminosa sobre la autopista', operation: 'arriendo', type: 'oficina', city: 'Floridablanca', sector: 'Autopista', price: 2600000, beds: 0, baths: 1, area: 55, image: 'assets/img/oficina-floridablanca', alt: 'Oficina abierta luminosa con plantas, piso de madera y ventanales' }
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

  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

  /* ======================================================
     3. ESTADO DE BÚSQUEDA
     ====================================================== */
  const state = { op: '', type: '', city: '', budget: '' };

  function parseBudget(value) {
    if (!value) return null;
    const [op, idx] = value.split(':');
    const range = BUDGETS[op] && BUDGETS[op][Number(idx)];
    return range ? { op, ...range } : null;
  }

  function matches(p, s = state) {
    if (s.op && p.operation !== s.op) return false;
    if (s.type && p.type !== s.type) return false;
    if (s.city && p.city !== s.city) return false;
    const b = parseBudget(s.budget);
    if (b && (p.operation !== b.op || p.price < b.min || p.price >= b.max)) return false;
    return true;
  }

  const results = () => PROPERTIES.filter((p) => matches(p));

  /* ======================================================
     4. BUSCADOR (formulario del hero)
     ====================================================== */
  const form = () => $('#buscar');

  function fillBudgetOptions() {
    const select = $('#s-presupuesto');
    const keep = state.budget;
    const groups = state.op ? [state.op] : ['venta', 'arriendo'];
    const nodes = [el('option', { value: '', text: 'Cualquier precio' })];
    groups.forEach((op) => {
      const opts = BUDGETS[op].map((b, i) => el('option', { value: `${op}:${i}`, text: b.label }));
      nodes.push(state.op ? opts : el('optgroup', { label: op === 'venta' ? 'Para comprar' : 'Para arrendar' }, opts));
    });
    select.replaceChildren(...nodes.flat());
    const stillValid = keep && (!state.op || keep.startsWith(`${state.op}:`));
    state.budget = stillValid ? keep : '';
    select.value = state.budget;
  }

  function syncFormFromState() {
    const f = form();
    $$('input[name="op"]', f).forEach((r) => { r.checked = r.value === state.op; });
    $('#s-tipo').value = state.type;
    $('#s-ciudad').value = state.city;
    fillBudgetOptions();
  }

  function readFormIntoState() {
    const f = form();
    state.op = (f.querySelector('input[name="op"]:checked') || {}).value || '';
    state.type = $('#s-tipo').value;
    state.city = $('#s-ciudad').value;
    state.budget = $('#s-presupuesto').value;
    // Elegir un presupuesto de arriendo con «Todos» activa la operación correspondiente.
    const b = parseBudget(state.budget);
    if (b && !state.op) { state.op = b.op; syncFormFromState(); }
  }

  function bindSearch() {
    const f = form();
    fillBudgetOptions();
    f.addEventListener('change', (e) => {
      readFormIntoState();
      if (e.target.name === 'op') fillBudgetOptions();
      update(true);
    });
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      readFormIntoState();
      update(true);
      scrollToResults();
    });
  }

  function scrollToResults() {
    const target = $('#inmuebles');
    target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
    // Lleva el foco al resumen para que los lectores de pantalla anuncien el resultado.
    const summary = $('#results-summary');
    summary.setAttribute('tabindex', '-1');
    summary.focus({ preventScroll: true });
  }

  /* ======================================================
     5. RESULTADOS, FILTROS ACTIVOS Y ESTADO VACÍO
     ====================================================== */
  function card(p) {
    const isRent = p.operation === 'arriendo';
    const specs = [];
    if (p.beds) specs.push(el('li', {}, [el('i', { class: 'bi bi-door-closed', 'aria-hidden': 'true' }), plural(p.beds, 'habitación', 'habitaciones')]));
    if (p.baths) specs.push(el('li', {}, [el('i', { class: 'bi bi-droplet', 'aria-hidden': 'true' }), plural(p.baths, 'baño', 'baños')]));
    specs.push(el('li', {}, [el('i', { class: 'bi bi-bounding-box', 'aria-hidden': 'true' }), `${NUM.format(p.area)} m²`]));

    return el('li', { class: 'property-item' }, [
      el('article', { class: 'card-home', 'aria-labelledby': `t-${p.id}` }, [
        el('figure', { class: 'card-media' }, [
          el('img', { src: `${p.image}-480.webp`, srcset: `${p.image}-480.webp 480w, ${p.image}-960.webp 960w`, sizes: '(min-width: 1100px) 31vw, (min-width: 640px) 46vw, 92vw', width: 480, height: 360, loading: 'lazy', decoding: 'async', alt: p.alt }),
          el('span', { class: `tag-op ${p.operation}`, text: isRent ? 'Arriendo' : 'Venta' }),
          el('span', { class: 'tag-type', text: TYPE_LABELS[p.type] })
        ]),
        el('div', { class: 'card-body-home' }, [
          el('p', { class: 'card-price' }, [COP.format(p.price), isRent ? el('small', { text: ' /mes' }) : null]),
          el('h3', { class: 'card-title', id: `t-${p.id}`, text: p.name }),
          el('p', { class: 'card-place' }, [el('i', { class: 'bi bi-geo-alt', 'aria-hidden': 'true' }), `${p.sector}, ${p.city}`]),
          el('ul', { class: 'card-specs', 'aria-label': 'Características' }, specs),
          el('div', { class: 'card-actions' }, [
            el('a', { class: 'btn btn-outline-green', href: waLink(MESSAGES.propiedad(p)), target: '_blank', rel: 'noopener', 'aria-label': `Consultar por WhatsApp: ${p.name}, ${p.city}` }, [
              el('i', { class: 'bi bi-whatsapp', 'aria-hidden': 'true' }), 'Consultar por WhatsApp'
            ])
          ])
        ])
      ])
    ]);
  }

  function describeFilters() {
    const parts = [];
    if (state.op) parts.push({ key: 'op', label: state.op === 'venta' ? 'En venta' : 'En arriendo' });
    if (state.type) parts.push({ key: 'type', label: TYPE_LABELS[state.type] });
    if (state.city) parts.push({ key: 'city', label: state.city });
    const b = parseBudget(state.budget);
    if (b) parts.push({ key: 'budget', label: b.label });
    return parts;
  }

  let firstRender = true;
  function update(animate) {
    const list = results();
    const grid = $('#property-grid');
    grid.replaceChildren(...list.map(card));
    $('#empty-state').hidden = list.length > 0;
    grid.hidden = list.length === 0;

    const filters = describeFilters();
    $('#results-summary').textContent = filters.length
      ? `${plural(list.length, 'inmueble encontrado', 'inmuebles encontrados')} de ${PROPERTIES.length}`
      : `${plural(PROPERTIES.length, 'inmueble', 'inmuebles')} disponibles para la demostración`;

    const chips = filters.map((f) => el('button', { type: 'button', class: 'filter-chip', 'data-remove': f.key, 'aria-label': `Quitar filtro: ${f.label}` }, [
      f.label, el('i', { class: 'bi bi-x-lg', 'aria-hidden': 'true' })
    ]));
    if (filters.length > 1) chips.push(el('button', { type: 'button', class: 'clear-all', 'data-clear-filters': '' }, ['Quitar todos']));
    $('#active-filters').replaceChildren(...chips);

    const count = $('[data-count]');
    count.textContent = String(list.length);
    $('.btn-search').setAttribute('aria-label', `Buscar propiedades: ${plural(list.length, 'resultado', 'resultados')}`);

    $$('.category-tile').forEach((t) => t.setAttribute('aria-pressed', String(t.dataset.type === state.type)));

    // Mensaje de WhatsApp del estado vacío con lo que la persona buscaba.
    const wish = filters.map((f) => f.label.toLowerCase()).join(', ');
    $('[data-wa-search]').href = waLink(`Hola, busco un inmueble con estas características: ${wish || 'sin filtros definidos'}. ¿Me avisan si tienen algo parecido?`);
    $('[data-wa-search]').target = '_blank';
    $('[data-wa-search]').rel = 'noopener';

    // La altura de la grilla cambia: los disparadores de más abajo deben recalcularse.
    if (!firstRender && window.ScrollTrigger) window.ScrollTrigger.refresh();
    if (animate && !firstRender) animateCards();
    firstRender = false;
  }

  function updateCounts() {
    const base = { op: '', type: '', city: '', budget: '' };
    $$('[data-cat-count]').forEach((n) => {
      const c = PROPERTIES.filter((p) => matches(p, { ...base, type: n.dataset.catCount })).length;
      n.textContent = plural(c, 'inmueble', 'inmuebles');
    });
    $$('[data-city-count]').forEach((n) => {
      const c = PROPERTIES.filter((p) => matches(p, { ...base, city: n.dataset.cityCount })).length;
      n.textContent = `(${c})`;
    });
  }

  function bindFilterShortcuts() {
    document.addEventListener('click', (e) => {
      const remove = e.target.closest('[data-remove]');
      const clear = e.target.closest('[data-clear-filters]');
      const cat = e.target.closest('.category-tile');
      const city = e.target.closest('[data-city]');
      if (remove) {
        state[remove.dataset.remove] = '';
        if (remove.dataset.remove === 'op') state.budget = '';
        syncFormFromState();
        update(true);
        const next = $('.filter-chip') || $('#results-summary');
        if (next === $('#results-summary')) next.setAttribute('tabindex', '-1');
        next.focus();
      } else if (clear) {
        Object.keys(state).forEach((k) => { state[k] = ''; });
        syncFormFromState();
        update(true);
        $('#results-summary').setAttribute('tabindex', '-1');
        $('#results-summary').focus();
      } else if (cat) {
        state.type = state.type === cat.dataset.type ? '' : cat.dataset.type;
        syncFormFromState();
        update(true);
        scrollToResults();
      } else if (city) {
        state.city = city.dataset.city;
        syncFormFromState();
        update(true);
        scrollToResults();
      }
    });
  }

  /* ======================================================
     6. FORMULARIO DE PROPIETARIOS
     ====================================================== */
  function bindOwnerForm() {
    const f = $('#owner-form');
    if (!f) return;
    const result = $('[data-form-result]');
    const status = $('[data-form-status]', f);
    const submit = $('.btn-submit', f);
    const label = $('.btn-label', submit);
    const original = label.textContent;
    let busy = false;

    const rules = {
      nombre: (v) => v.trim().length >= 3 || 'Escribe tu nombre (mínimo 3 letras).',
      telefono: (v) => /^(\+?57)?3\d{9}$/.test(v.replace(/[\s-]/g, '')) || 'Escribe un celular de 10 dígitos que empiece por 3.',
      correo: (v) => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Revisa el correo, por ejemplo: nombre@correo.com.',
      operacion: () => !!f.querySelector('input[name="operacion"]:checked') || 'Elige si quieres vender, arrendar o que lo administren.',
      tipo: (v) => !!v || 'Elige el tipo de inmueble.',
      ciudad: (v) => !!v || 'Elige la ciudad donde está el inmueble.',
      consentimiento: () => f.elements.consentimiento.checked || 'Necesitamos tu autorización para poder contactarte.'
    };

    const errorTarget = (name) => (name === 'operacion' ? $('fieldset', f) : f.elements[name]);
    const focusTarget = (name) => (name === 'operacion' ? f.querySelector('input[name="operacion"]') : f.elements[name]);

    function check(name) {
      const field = f.elements[name];
      const value = field && 'value' in field ? field.value : '';
      const ok = rules[name](value);
      const target = errorTarget(name);
      const err = $(`#o-${name}-err`);
      target.setAttribute('aria-invalid', ok === true ? 'false' : 'true');
      err.textContent = ok === true ? '' : ok;
      err.hidden = ok === true;
      return ok === true;
    }

    Object.keys(rules).forEach((name) => {
      const nodes = name === 'operacion' ? $$('input[name="operacion"]', f) : [f.elements[name]];
      nodes.forEach((n) => ['input', 'change'].forEach((ev) => n.addEventListener(ev, () => {
        if (errorTarget(name).getAttribute('aria-invalid') === 'true') check(name);
      })));
    });

    f.addEventListener('submit', (e) => {
      e.preventDefault();
      if (busy) return;
      const bad = Object.keys(rules).filter((n) => !check(n));
      if (bad.length) {
        status.textContent = `Revisa ${plural(bad.length, 'campo', 'campos')} antes de continuar.`;
        focusTarget(bad[0]).focus();
        return;
      }
      busy = true;
      submit.disabled = true;
      submit.setAttribute('aria-busy', 'true');
      label.textContent = 'Preparando mensaje…';

      const d = Object.fromEntries(new FormData(f).entries());
      const text = [
        'Hola, quiero publicar mi inmueble con Hogar Urbano.',
        `Nombre: ${d.nombre.trim()}`,
        `Celular: ${d.telefono.trim()}`,
        d.correo && d.correo.trim() ? `Correo: ${d.correo.trim()}` : null,
        `Quiero: ${d.operacion}`,
        `Inmueble: ${d.tipo} en ${d.ciudad}`,
        d.mensaje && d.mensaje.trim() ? `Detalles: ${d.mensaje.trim()}` : null
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
  }

  /* ======================================================
     7. GENERALES: WhatsApp, encabezado, año, imágenes caídas
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

    const header = $('.site-header');
    const float = $('.wa-float');
    float.classList.add('is-deferred');
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      const searchBottom = $('#buscar').getBoundingClientRect().bottom;
      float.classList.toggle('is-visible', searchBottom < 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const menu = $('#menu');
    $$('#menu a').forEach((a) => a.addEventListener('click', () => {
      if (menu.classList.contains('show') && window.bootstrap) window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }));
    $$('[data-year]').forEach((n) => { n.textContent = new Date().getFullYear(); });

    const mark = (img) => { const box = img.closest('figure'); if (box) box.classList.add('img-fallback'); };
    document.addEventListener('error', (e) => { if (e.target.tagName === 'IMG') mark(e.target); }, true);
    $$('img').forEach((img) => { if (img.complete && img.naturalWidth === 0) mark(img); });
  }

  /* ======================================================
     8. ANIMACIONES (GSAP + ScrollTrigger)
     ====================================================== */
  let gsapReady = false;

  function animateCards() {
    if (!gsapReady || reduceMotion.matches) return;
    window.gsap.from('#property-grid .card-home', { opacity: 0, y: 18, duration: 0.45, stagger: 0.05, ease: 'power2.out', clearProps: 'all' });
  }

  function initMotion() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    gsapReady = true;

    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      // Entrada del hero: el arco crece desde el umbral, luego aparece el buscador.
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero h1', { opacity: 0, y: 28, duration: 0.8 })
        .from('.hero-lead, .owner-link', { opacity: 0, y: 16, duration: 0.6, stagger: 0.1 }, 0.2)
        .from('.hero-arch', { opacity: 0, y: 40, duration: 1.1 }, 0.05)
        .from('.hero-arch img', { scale: 1.15, duration: 1.6, ease: 'power2.out' }, 0.05)
        .from('.search-card', { opacity: 0, y: 30, duration: 0.7 }, 0.6);

      gsap.from('#property-grid .card-home', {
        opacity: 0, y: 24, duration: 0.6, stagger: 0.07, ease: 'power2.out', clearProps: 'all',
        scrollTrigger: { trigger: '#property-grid', start: 'top 85%', once: true }
      });
      gsap.from('.city-card', {
        opacity: 0, y: 30, duration: 0.7, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.city-grid', start: 'top 80%', once: true }
      });
    });

    window.addEventListener('load', () => ScrollTrigger.refresh());
    // Las fuentes web cambian la altura del texto: recalcula posiciones al cargarlas.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  /* ======================================================
     9. ARRANQUE
     ====================================================== */
  function init() {
    bindGeneral();
    bindSearch();
    bindFilterShortcuts();
    updateCounts();
    update(false);
    bindOwnerForm();
    initMotion();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
