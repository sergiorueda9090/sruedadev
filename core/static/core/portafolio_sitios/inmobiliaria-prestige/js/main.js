/* Inmobiliaria Prestige — interacciones y animaciones.
   Script clásico (sin módulos) para que funcione también abriendo el archivo directamente. */
(function () {
  'use strict';

  /* ======================================================
     1. CONFIGURACIÓN — lo único que se edita para un cliente
     ====================================================== */

  // Número de EJEMPLO. Reemplazar por el número autorizado del cliente
  // (código de país + número, sin «+» ni espacios) antes de publicar.
  const WHATSAPP_NUMBER = "573001234567";

  // true: muestra los avisos de «demostración» (barra superior, notas en formularios y fichas).
  const DEMO_MODE = true;

  const MESSAGES = {
    asesor: 'Hola, quisiera hablar con un asesor de Inmobiliaria Prestige sobre propiedades exclusivas.',
    propietario: 'Hola, tengo una propiedad que quisiera vender y me gustaría solicitar una valoración.',
    propiedad: (p) => `Hola, estoy interesado en conocer más información sobre el inmueble «${p.name}» (${p.sector}, ${p.city}). ¿Podrían brindarme detalles?`
  };

  // Inmuebles DEMOSTRATIVOS: no son inventario real. `image` es la ruta sin sufijo de ancho
  // (se usan los archivos <image>-640.webp y <image>-1100.webp).
  const PROPERTIES = [
    {
      id: 'penthouse-cabecera', demo: true,
      name: 'Penthouse Altos de Cabecera', operation: 'venta', type: 'Penthouse',
      city: 'Bucaramanga', sector: 'Cabecera del Llano',
      price: 2350000000, beds: 4, baths: 5, area: 380,
      image: 'assets/img/penthouse-cabecera',
      alt: 'Sala abierta de doble altura con sofá blanco, cocina al fondo y muro en madera',
      summary: 'Último piso con doble altura, terraza perimetral y vista abierta sobre la ciudad. Ascensor privado y tres parqueaderos.',
      features: ['Terraza de 90 m² con zona BBQ', 'Estudio independiente', 'Cuarto útil y tres parqueaderos']
    },
    {
      id: 'casa-ruitoque', demo: true,
      name: 'Casa Mirador de Ruitoque', operation: 'venta', type: 'Casa',
      city: 'Floridablanca', sector: 'Ruitoque',
      price: 3800000000, beds: 5, baths: 6, area: 620,
      image: 'assets/img/casa-ruitoque',
      alt: 'Casa blanca de dos niveles con piscina y jardín al atardecer',
      summary: 'Residencia de dos niveles en condominio campestre, con piscina, jardín y vista hacia el cañón.',
      features: ['Piscina climatizada', 'Suite principal con vestier', 'Lote de 1.100 m²']
    },
    {
      id: 'residencia-lagos', demo: true,
      name: 'Residencia Lagos del Cacique', operation: 'venta', type: 'Casa',
      city: 'Bucaramanga', sector: 'Lagos del Cacique',
      price: 2900000000, beds: 4, baths: 5, area: 450,
      image: 'assets/img/residencia-lagos',
      alt: 'Casa moderna de fachada oscura iluminada al anochecer junto a un gran árbol',
      summary: 'Casa contemporánea en conjunto cerrado, con fachada en madera, gran ventanal y jardín con árbol nativo.',
      features: ['Sala de doble altura', 'Cocina abierta con isla', 'Seguridad 24 horas']
    },
    {
      id: 'finca-piedecuesta', demo: true,
      name: 'Hacienda La Colina', operation: 'venta', type: 'Finca',
      city: 'Piedecuesta', sector: 'Zona campestre',
      price: 1950000000, beds: 5, baths: 5, area: 520,
      image: 'assets/img/finca-piedecuesta',
      alt: 'Casa de hacienda con tejas de barro y piscina iluminada en la noche',
      summary: 'Casa de hacienda con corredores, teja de barro y piscina, sobre un lote de 1,2 hectáreas con árboles frutales.',
      features: ['Lote de 1,2 ha', 'Kiosco y zona de juegos', 'Casa de mayordomo']
    },
    {
      id: 'casa-giron', demo: true,
      name: 'Casa Campestre El Mirador', operation: 'venta', type: 'Casa campestre',
      city: 'Girón', sector: 'Zona campestre',
      price: 1650000000, beds: 4, baths: 4, area: 410,
      image: 'assets/img/casa-giron',
      alt: 'Casa campestre de muros ocres con jacuzzi y terraza al atardecer',
      summary: 'Casa de muros cálidos con terrazas escalonadas, jacuzzi y vista al atardecer sobre el valle.',
      features: ['Jacuzzi exterior', 'Terrazas cubiertas', 'Bodega y parqueadero para cuatro vehículos']
    },
    {
      id: 'apto-sotomayor', demo: true,
      name: 'Apartamento Parque Sotomayor', operation: 'arriendo', type: 'Apartamento',
      city: 'Bucaramanga', sector: 'Sotomayor',
      price: 9500000, beds: 3, baths: 4, area: 210,
      image: 'assets/img/apto-sotomayor',
      alt: 'Sala de doble altura con chimenea, muros claros y comedor junto a la cocina',
      summary: 'Apartamento amoblado de doble altura frente a zona verde, con chimenea y acabados en piedra.',
      features: ['Amoblado', 'Gimnasio y piscina del edificio', 'Dos parqueaderos']
    }
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
    [].concat(children).forEach((c) => c && node.append(c));
    return node;
  }

  function priceLabel(p) {
    return p.operation === 'arriendo' ? `${COP.format(p.price)} al mes` : COP.format(p.price);
  }

  /* ======================================================
     3. ENLACES DE WHATSAPP Y MODO DEMO
     ====================================================== */
  function bindWhatsApp() {
    $$('[data-wa]').forEach((a) => {
      const msg = MESSAGES[a.dataset.wa];
      if (typeof msg !== 'string') return;
      a.href = waLink(msg);
      a.target = '_blank';
      a.rel = 'noopener';
    });
    if (!DEMO_MODE) $$('[data-demo]').forEach((n) => n.remove());
  }

  /* ======================================================
     4. COLECCIÓN Y FICHA DE DETALLE
     ====================================================== */
  function renderCollection() {
    const track = $('#collection-track');
    if (!track) return;
    const frag = document.createDocumentFragment();
    PROPERTIES.forEach((p) => {
      const isRent = p.operation === 'arriendo';
      const img = el('img', {
        src: `${p.image}-640.webp`,
        srcset: `${p.image}-640.webp 640w, ${p.image}-1100.webp 1100w`,
        sizes: '(min-width: 992px) 30vw, 82vw',
        width: 640, height: 800, loading: 'lazy', decoding: 'async', alt: p.alt
      });
      const li = el('li', { class: 'plate' }, [
        el('figure', { class: 'plate-media' }, [
          img,
          el('span', { class: `plate-op${isRent ? ' is-rent' : ''}`, text: isRent ? 'Arriendo' : 'Venta' })
        ]),
        el('div', { class: 'plate-body' }, [
          el('p', { class: 'plate-place', text: `${p.sector}, ${p.city}` }),
          el('h3', { class: 'plate-name', text: p.name }),
          el('p', { class: 'plate-specs', text: `${p.beds} habitaciones, ${p.baths} baños, ${NUM.format(p.area)} m²` }),
          el('p', { class: 'plate-price' }, [document.createTextNode(COP.format(p.price)), isRent ? el('small', { text: ' al mes' }) : null]),
          el('div', { class: 'plate-actions' }, [
            el('button', { class: 'link-btn', type: 'button', 'data-detail': p.id, 'aria-label': `Ver detalles de ${p.name}` }, [document.createTextNode('Ver detalles')]),
            el('a', { class: 'link-btn', href: waLink(MESSAGES.propiedad(p)), target: '_blank', rel: 'noopener', 'aria-label': `Consultar por WhatsApp sobre ${p.name}` }, [
              el('i', { class: 'bi bi-whatsapp', 'aria-hidden': 'true' }), document.createTextNode('Consultar')
            ])
          ])
        ])
      ]);
      frag.append(li);
    });
    track.replaceChildren(frag);
  }

  function bindModal() {
    const modalEl = $('#property-modal');
    if (!modalEl) return;
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-detail]');
      if (!btn) return;
      const p = PROPERTIES.find((x) => x.id === btn.dataset.detail);
      if (!p) return;
      const img = $('[data-modal-img]', modalEl);
      img.src = `${p.image}-640.webp`;
      img.alt = p.alt;
      img.closest('.col-md-5').classList.remove('img-fallback');
      $('[data-modal-place]', modalEl).textContent = `${p.type} en ${p.operation}, ${p.sector}, ${p.city}`;
      $('[data-modal-title]', modalEl).textContent = p.name;
      $('[data-modal-price]', modalEl).textContent = priceLabel(p);
      $('[data-modal-summary]', modalEl).textContent = p.summary;
      $('[data-modal-specs]', modalEl).replaceChildren(
        ...[['Habitaciones', p.beds], ['Baños', p.baths], ['Área', `${NUM.format(p.area)} m²`]].map(([k, v]) =>
          el('div', {}, [el('dt', { text: k }), el('dd', { text: String(v) })]))
      );
      $('[data-modal-features]', modalEl).replaceChildren(...p.features.map((f) => el('li', { text: f })));
      $('[data-modal-wa]', modalEl).href = waLink(MESSAGES.propiedad(p));

      if (window.bootstrap && window.bootstrap.Modal) {
        window.bootstrap.Modal.getOrCreateInstance(modalEl).show(btn);
      } else {
        window.open(waLink(MESSAGES.propiedad(p)), '_blank', 'noopener');
      }
    });
  }

  /* ======================================================
     5. CATEGORÍAS: vista previa y preselección en el formulario
     ====================================================== */
  function bindCategories() {
    const preview = $('#category-preview-img');
    const rows = $$('.category-row');
    let current = 'cat-penthouses';
    let swapTimer = null;

    function show(row) {
      rows.forEach((r) => r.classList.toggle('is-active', r === row));
      if (!preview || row.dataset.preview === current) return;
      current = row.dataset.preview;
      clearTimeout(swapTimer);
      preview.classList.add('is-swapping');
      swapTimer = setTimeout(() => {
        preview.src = `assets/img/${current}-1100.webp`;
        preview.onload = () => preview.classList.remove('is-swapping');
      }, reduceMotion.matches ? 0 : 220);
    }

    rows.forEach((row) => {
      row.addEventListener('mouseenter', () => show(row));
      row.addEventListener('focus', () => show(row));
      row.addEventListener('click', () => setFormField('f-tipo', row.dataset.category));
    });
    if (rows[0]) rows[0].classList.add('is-active');

    $$('[data-set-interest]').forEach((a) =>
      a.addEventListener('click', () => setFormField('f-interes', a.dataset.setInterest)));
  }

  function setFormField(id, value) {
    const field = document.getElementById(id);
    if (!field) return;
    const option = Array.from(field.options).find((o) => o.text === value || o.value === value);
    if (option) field.value = option.value || option.text;
  }

  /* ======================================================
     6. FORMULARIO (validación accesible + mensaje de WhatsApp)
     ====================================================== */
  function bindForm() {
    const form = $('#lead-form');
    if (!form) return;
    const panel = form.parentElement;
    const result = $('[data-form-result]', panel);
    const status = $('[data-form-status]', form);
    const submit = $('.btn-submit', form);
    const label = $('.btn-label', submit);
    const originalLabel = label.textContent;
    let busy = false;

    const rules = {
      nombre: (v) => v.trim().length >= 3 || 'Escriba su nombre completo (mínimo 3 letras).',
      telefono: (v) => /^(\+?57)?3\d{9}$/.test(v.replace(/[\s-]/g, '')) || 'Escriba un celular colombiano de 10 dígitos que empiece por 3.',
      correo: (v) => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Revise el correo: debe tener el formato nombre@dominio.com.',
      interes: (v) => !!v || 'Elija qué le interesa: comprar, invertir, arrendar o vender.',
      consentimiento: (_, f) => f.checked || 'Debe autorizar el tratamiento de datos para que podamos responderle.'
    };

    function setError(field, message) {
      const err = document.getElementById(`${field.id}-err`);
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (!err) return;
      err.textContent = message || '';
      err.hidden = !message;
    }

    function validateField(field) {
      const rule = rules[field.name];
      if (!rule) return true;
      const ok = rule(field.value, field);
      setError(field, ok === true ? '' : ok);
      return ok === true;
    }

    Object.keys(rules).forEach((name) => {
      const field = form.elements[name];
      field.addEventListener('blur', () => { if (field.getAttribute('aria-invalid') !== null) validateField(field); });
      field.addEventListener('change', () => { if (field.getAttribute('aria-invalid') === 'true') validateField(field); });
      field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') validateField(field); });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (busy) return;
      const fields = Object.keys(rules).map((n) => form.elements[n]);
      const invalid = fields.filter((f) => !validateField(f));
      if (invalid.length) {
        status.textContent = `Hay ${invalid.length} ${invalid.length === 1 ? 'campo por corregir' : 'campos por corregir'}.`;
        invalid[0].focus();
        return;
      }

      busy = true;
      submit.disabled = true;
      submit.setAttribute('aria-busy', 'true');
      label.textContent = 'Preparando mensaje…';

      const d = Object.fromEntries(new FormData(form).entries());
      const lines = [
        'Hola, les escribo desde el sitio web de Inmobiliaria Prestige.',
        `Nombre: ${d.nombre.trim()}`,
        `Celular: ${d.telefono.trim()}`,
        d.correo && d.correo.trim() ? `Correo: ${d.correo.trim()}` : null,
        `Me interesa: ${d.interes}`,
        d.tipo ? `Tipo de propiedad: ${d.tipo}` : null,
        d.presupuesto ? `Presupuesto: ${d.presupuesto}` : null,
        d.mensaje && d.mensaje.trim() ? `Mensaje: ${d.mensaje.trim()}` : null
      ].filter(Boolean);

      // Pausa breve para que el cambio de estado sea perceptible; no hay envío a ningún servidor.
      setTimeout(() => {
        $('[data-result-link]', result).href = waLink(lines.join('\n'));
        form.hidden = true;
        result.hidden = false;
        result.focus();
        busy = false;
        submit.disabled = false;
        submit.removeAttribute('aria-busy');
        label.textContent = originalLabel;
      }, 500);
    });

    $('[data-result-edit]', result).addEventListener('click', () => {
      result.hidden = true;
      form.hidden = false;
      form.elements.nombre.focus();
    });
  }

  /* ======================================================
     7. ENCABEZADO, AÑO E IMÁGENES CAÍDAS
     ====================================================== */
  function bindHeader() {
    const header = $('.site-header');
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
    const setHeaderH = () => document.documentElement.style.setProperty('--header-h', `${header.offsetHeight}px`);
    window.addEventListener('resize', setHeaderH);
    setHeaderH();
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Cierra el menú móvil al elegir una sección.
    const menu = $('#menu');
    $$('#menu a').forEach((a) => a.addEventListener('click', () => {
      if (menu.classList.contains('show') && window.bootstrap) window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }));
    $$('[data-year]').forEach((n) => { n.textContent = new Date().getFullYear(); });
  }

  function markBroken(img) {
    const box = img.closest('figure, .hero-media, .owners-media, .col-md-5');
    if (box) box.classList.add('img-fallback');
  }
  function bindImageFallback() {
    document.addEventListener('error', (e) => {
      if (e.target.tagName === 'IMG') markBroken(e.target);
    }, true);
    $$('img').forEach((img) => { if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) markBroken(img); });
  }

  /* ======================================================
     8. ANIMACIONES (GSAP + ScrollTrigger)
     El contenido es visible sin JS; GSAP solo anima desde estados iniciales.
     ====================================================== */
  function initMotion() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 992px) and (min-height: 760px)' }, (ctx) => {
      const { motion, desktop } = ctx.conditions;
      if (!motion) return;

      // Hero: la fotografía se abre desde un marco y el titular sube línea por línea.
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-media', { clipPath: 'inset(9% 7% 9% 7%)', duration: 1.6, ease: 'power2.inOut' })
        .from('.hero-media img', { scale: 1.14, duration: 2.2, ease: 'power2.out' }, 0)
        .from('.hero-title .line > span', { yPercent: 105, duration: 1.1, stagger: 0.14 }, 0.55)
        .from('.hero-lead', { opacity: 0, y: 18, duration: 0.8 }, 1.05)
        .from('.hero-actions .btn', { opacity: 0, y: 14, duration: 0.7, stagger: 0.1 }, 1.2)
        .from('.hero-caption', { opacity: 0, duration: 0.6 }, 1.4);

      // Colección: en escritorio la sección se fija y las fichas avanzan en horizontal.
      const section = $('.collection');
      const track = $('#collection-track');
      if (desktop && track && track.children.length) {
        section.classList.add('is-pinned');
        const distance = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.collection-pin',
            start: () => `top ${$('.site-header').offsetHeight}px`,
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set('.collection-progress span', { scaleX: self.progress })
          }
        });
        // Con teclado: al enfocar una ficha fuera de pantalla, desplaza la página hasta ella.
        const onFocus = (e) => {
          const plate = e.target.closest('.plate');
          const st = tween.scrollTrigger;
          if (!plate || !st) return;
          const ratio = Math.min(1, plate.offsetLeft / (distance() || 1));
          window.scrollTo({ top: st.start + ratio * (st.end - st.start), behavior: 'auto' });
        };
        track.addEventListener('focusin', onFocus);
        return () => {
          section.classList.remove('is-pinned');
          track.removeEventListener('focusin', onFocus);
          gsap.set(track, { clearProps: 'transform' });
        };
      }

      if (!desktop) {
        gsap.from('.plate', {
          opacity: 0, x: 40, duration: 0.8, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: '#collection-track', start: 'top 85%', once: true }
        });
      }
    });

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Asesoría: la imagen se revela de abajo hacia arriba una sola vez.
      gsap.from('.advisory-media', {
        clipPath: 'inset(100% 0% 0% 0%)', duration: 1.3, ease: 'power3.inOut',
        scrollTrigger: { trigger: '.advisory', start: 'top 70%', once: true }
      });
      gsap.from('.steps li', {
        opacity: 0, y: 16, duration: 0.6, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: '.steps', start: 'top 85%', once: true }
      });

      // Mosaico: desplazamiento vertical muy leve de las fotografías.
      $$('.mosaic-item img').forEach((img, i) => {
        img.setAttribute('data-parallax', '');
        gsap.fromTo(img, { yPercent: -4 - (i % 2) * 2 }, {
          yPercent: 4 + (i % 2) * 2, ease: 'none',
          scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });

      // Propietarios: la fotografía se acerca ligeramente al desplazarse.
      gsap.fromTo('.owners-media img', { scale: 1.08 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: '.owners', start: 'top bottom', end: 'bottom top', scrub: true }
      });

      return () => $$('.mosaic-item img').forEach((img) => img.removeAttribute('data-parallax'));
    });

    // Las imágenes diferidas cambian alturas: recalcula los triggers cuando terminan de cargar.
    window.addEventListener('load', () => ScrollTrigger.refresh());
    // Las fuentes web cambian la altura del texto: recalcula posiciones al cargarlas.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  /* ======================================================
     9. ARRANQUE
     ====================================================== */
  function init() {
    bindWhatsApp();
    renderCollection();
    bindModal();
    bindCategories();
    bindForm();
    bindHeader();
    bindImageFallback();
    initMotion();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
