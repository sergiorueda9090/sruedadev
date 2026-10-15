/* ==========================================================================
   Hotel Aurea — lógica de la página
   Hotel ficticio de demostración. No hay backend: la página solo prepara
   mensajes de WhatsApp que el visitante revisa y envía por su cuenta.
   ========================================================================== */
'use strict';

document.documentElement.classList.add('js');

(() => {
  /* ========================================================================
     CONFIGURACIÓN CENTRALIZADA
     Vacío ('') o null = dato no configurado: se oculta o se marca «Por configurar».
     ======================================================================== */
  const HOTEL_CONFIG = {
    name: 'Hotel Aurea',
    demoMode: true, // true: muestra etiquetas de contenido de ejemplo.

    whatsapp: {
      number: '', // Formato internacional, solo dígitos y sin «+». Ej.: '573001234567'.
      messages: {
        default: 'Hola, quisiera información sobre Hotel Aurea. ¿Me pueden compartir disponibilidad y tarifas?',
        plan: 'Hola, quiero planear una estadía en Hotel Aurea. ¿Me ayudan con opciones de habitación, fechas y tarifas?'
      }
    },

    contact: {
      address: '',
      phone: '',          // Ej.: '+57 601 000 0000'
      email: '',          // Ej.: 'reservas@tuhotel.com'
      hours: []           // Ej.: ['Recepción: 24 horas', 'Reservas: lunes a sábado, 8:00 a. m. – 6:00 p. m.']
    },

    social: {             // URL completas (https://...). Vacío = no se muestra.
      instagram: '',
      facebook: '',
      tiktok: ''
    },

    map: {
      embedUrl: '',       // URL de inserción de Google Maps: https://www.google.com/maps/embed?pb=...
      linkUrl: ''         // Enlace para abrir en Google Maps: https://maps.app.goo.gl/...
    },

    currency: { locale: 'es-CO', code: 'COP' },

    // Atributos de la sección de presentación (contenido de ejemplo editable).
    attributes: [
      { icon: 'bi-moon-stars', title: 'Comodidad', text: 'Camas amplias, textiles suaves y silencio para dormir bien.' },
      { icon: 'bi-person-heart', title: 'Atención personalizada', text: 'Un equipo cercano que se anticipa a lo que necesitas.' },
      { icon: 'bi-tree', title: 'Espacios para desconectar', text: 'Jardines, piscina y rincones para no hacer nada.' }
    ],

    // Habitaciones de ejemplo. Los precios son demostrativos hasta que el hotel los confirme.
    rooms: [
      {
        id: 'deluxe',
        name: 'Habitación Deluxe',
        description: 'Madera cálida, cama king y una ventana que mira al jardín. Ideal para parejas.',
        capacity: 'Hasta 2 personas',
        features: ['Cama king', 'Vista al jardín', 'Baño privado', 'Escritorio'],
        pricePerNight: 420000,
        priceIsDemo: true,
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=75',
        alt: 'Habitación con cama doble, paredes de madera y ventanal hacia la vegetación'
      },
      {
        id: 'premium',
        name: 'Suite Premium',
        description: 'Más espacio, sala de estar y detalles pensados para quedarse un día más.',
        capacity: 'Hasta 2 personas',
        features: ['Sala de estar', 'Cama king', 'Bañera', 'Minibar'],
        pricePerNight: 680000,
        priceIsDemo: true,
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=75',
        alt: 'Suite elegante con sofá capitoné, cama doble y lámparas de luz cálida'
      },
      {
        id: 'familiar',
        name: 'Suite Familiar',
        description: 'Dos camas, espacio para moverse y la comodidad que necesita toda la familia.',
        capacity: 'Hasta 4 personas',
        features: ['Dos camas dobles', 'Zona de estar', 'Baño amplio', 'Cuna a solicitud'],
        pricePerNight: 790000,
        priceIsDemo: true,
        image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=900&q=75',
        alt: 'Habitación luminosa con dos camas dobles y cabeceros tapizados'
      }
    ],

    // confirmed: false = ejemplo visual; true = servicio confirmado por el hotel.
    services: [
      { icon: 'bi-wifi', title: 'Wi-Fi', text: 'Conexión en habitaciones y zonas comunes.', confirmed: false },
      { icon: 'bi-egg-fried', title: 'Restaurante', text: 'Desayunos, almuerzos y cenas con productos locales.', confirmed: false },
      { icon: 'bi-water', title: 'Piscina', text: 'Agua tranquila, tumbonas y sombra para la tarde.', confirmed: false },
      { icon: 'bi-flower2', title: 'Spa', text: 'Masajes y tratamientos para relajarte.', confirmed: false },
      { icon: 'bi-car-front', title: 'Estacionamiento', text: 'Espacio para tu vehículo durante la estadía.', confirmed: false },
      { icon: 'bi-bell', title: 'Servicio a la habitación', text: 'Pide algo de comer sin salir de tu habitación.', confirmed: false }
    ],

    // Fotos de la galería (orden = composición del rectángulo áureo, de mayor a menor).
    gallery: [
      { src: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1600&q=75', alt: 'Terraza de madera con tumbonas junto a una piscina rodeada de palmeras', caption: 'Piscina' },
      { src: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1400&q=75', alt: 'Habitación con cama doble, lámparas de mesa y cuadro sobre el cabecero', caption: 'Habitaciones' },
      { src: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1200&q=75', alt: 'Mesa de desayuno con huevos, frutas, waffles y jugos', caption: 'Desayuno' },
      { src: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=75', alt: 'Sendero de jardín entre arbustos con flores rosadas', caption: 'Jardines' },
      { src: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=75', alt: 'Tratamiento de spa con piedras calientes sobre la espalda', caption: 'Spa' }
    ],

    // Reseñas. isDemo: true = texto ficticio de ejemplo. Reemplázalas por opiniones verificadas.
    reviews: [
      { name: 'Huésped de ejemplo 1', origin: 'Reseña ficticia', rating: 5, text: 'La habitación olía a madera y a limpio, y el desayuno en la terraza fue el mejor momento de cada día.', isDemo: true },
      { name: 'Huésped de ejemplo 2', origin: 'Reseña ficticia', rating: 5, text: 'Celebramos un aniversario y prepararon la mesa con flores. Un detalle que no olvidamos.', isDemo: true },
      { name: 'Huésped de ejemplo 3', origin: 'Reseña ficticia', rating: 4, text: 'Viajamos con niños y la suite familiar tenía espacio de sobra. Volveríamos.', isDemo: true }
    ],

    // Preguntas frecuentes. isDemo: true = respuesta de ejemplo, no es una política oficial.
    faq: [
      { q: '¿Cuáles son los horarios de llegada y salida?', a: 'Ejemplo: llegada desde las 3:00 p. m. y salida hasta las 12:00 m. Confirma el horario con el hotel antes de tu viaje.', isDemo: true },
      { q: '¿Cuál es la política de cancelación?', a: 'La política de cancelación depende de la tarifa y la temporada. El hotel te la compartirá por WhatsApp junto con la cotización.', isDemo: true },
      { q: '¿Se admiten mascotas?', a: 'Pregunta al hotel antes de reservar: la admisión de mascotas y sus condiciones deben confirmarse directamente.', isDemo: true },
      { q: '¿Qué métodos de pago aceptan?', a: 'El hotel te indicará los métodos de pago disponibles al confirmar tu reserva. Esta página no procesa pagos.', isDemo: true },
      { q: '¿Qué servicios están incluidos?', a: 'Los servicios incluidos varían según la habitación y la tarifa. Consulta qué incluye tu estadía antes de confirmar.', isDemo: true },
      { q: '¿Cómo consulto disponibilidad?', a: 'Completa el formulario «Consulta tu estadía» con tus fechas y huéspedes. Se abrirá WhatsApp con el mensaje listo para que lo envíes; el hotel te responderá con disponibilidad y tarifas.', isDemo: false }
    ]
  };

  /* ========================================================================
     CONSTANTES Y UTILIDADES
     ======================================================================== */
  const MS_PER_DAY = 86400000;
  const MAX_NIGHTS = 60;
  const MAX_ADULTS = 20;
  const MAX_CHILDREN = 10;
  const SUBMIT_COOLDOWN_MS = 1500;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const hasText = (value) => typeof value === 'string' && value.trim() !== '';
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const isAmount = (value) => typeof value === 'number' && Number.isFinite(value) && value > 0;

  let currencyFormatter;
  try {
    currencyFormatter = new Intl.NumberFormat(HOTEL_CONFIG.currency.locale, {
      style: 'currency', currency: HOTEL_CONFIG.currency.code, maximumFractionDigits: 0
    });
  } catch (error) {
    console.warn('Hotel Aurea: configuración de moneda no válida, se usa COP.', error);
    currencyFormatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
  }
  const formatPrice = (amount) => currencyFormatter.format(amount);

  /** Crea nodos asignando texto con textContent (sin innerHTML). */
  function el(tag, options = {}, children = []) {
    const node = document.createElement(tag);
    const { className, text, attrs, dataset } = options;
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    if (attrs) {
      Object.entries(attrs).forEach(([name, value]) => {
        if (value === false || value === null || value === undefined) return;
        node.setAttribute(name, value === true ? '' : String(value));
      });
    }
    if (dataset) Object.assign(node.dataset, dataset);
    children.forEach((child) => { if (child) node.append(child); });
    return node;
  }
  const icon = (name) => el('i', { className: `bi ${name}`, attrs: { 'aria-hidden': 'true' } });
  const demoTag = (text = 'Ejemplo') => el('span', { className: 'demo-tag', text });

  function protectImage(img) {
    const holder = () => img.parentElement;
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) holder()?.classList.add('img-fallback');
    img.addEventListener('error', () => holder()?.classList.add('img-fallback'));
    img.addEventListener('load', () => holder()?.classList.remove('img-fallback'));
  }

  function isSafeHttpsUrl(value, allowedHosts) {
    if (!hasText(value)) return false;
    try {
      const url = new URL(value.trim());
      if (url.protocol !== 'https:') return false;
      return allowedHosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));
    } catch (error) {
      return false;
    }
  }

  /* --- Fechas: días de calendario en UTC, sin horas ni cambios de horario --- */
  function parseISODate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const [y, m, d] = value.split('-').map(Number);
    const time = Date.UTC(y, m - 1, d);
    const check = new Date(time);
    if (check.getUTCFullYear() !== y || check.getUTCMonth() !== m - 1 || check.getUTCDate() !== d) return null;
    return time;
  }
  const toISODate = (time) => new Date(time).toISOString().slice(0, 10);
  function todayISO() {
    const now = new Date();
    return toISODate(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  }
  const addDays = (iso, days) => toISODate(parseISODate(iso) + days * MS_PER_DAY);
  const nightsBetween = (a, b) => Math.round((parseISODate(b) - parseISODate(a)) / MS_PER_DAY);
  const dateFormatter = new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const formatDate = (iso) => dateFormatter.format(new Date(parseISODate(iso)));

  /* ========================================================================
     REFERENCIAS AL DOM
     ======================================================================== */
  let dom = {};
  function cacheDom() {
    const $ = (id) => document.getElementById(id);
    dom = {
      header: $('siteHeader'),
      navMenu: $('navMenu'),
      form: $('bookingForm'),
      checkIn: $('checkIn'),
      checkOut: $('checkOut'),
      adults: $('adults'),
      children: $('children'),
      roomInterest: $('roomInterest'),
      nightsSummary: $('nightsSummary'),
      bookingStatus: $('bookingStatus'),
      bookingSubmit: $('bookingSubmit'),
      aboutAttributes: $('aboutAttributes'),
      roomsGrid: $('roomsGrid'),
      roomsLead: $('roomsLead'),
      servicesList: $('servicesList'),
      servicesLead: $('servicesLead'),
      experiences: $('experiences'),
      galleryGrid: $('galleryGrid'),
      galleryModal: $('galleryModal'),
      galleryImage: $('galleryModalImage'),
      galleryCaption: $('galleryModalCaption'),
      galleryCounter: $('galleryCounter'),
      galleryPrev: $('galleryPrev'),
      galleryNext: $('galleryNext'),
      reviewsList: $('reviewsList'),
      reviewsNote: $('reviewsNote'),
      faqAccordion: $('faqAccordion'),
      faqNote: $('faqNote'),
      contactList: $('contactList'),
      mapContainer: $('mapContainer'),
      footerContact: $('footerContact'),
      footerSocial: $('footerSocial'),
      waPendingModal: $('waPendingModal'),
      waPendingMessage: $('waPendingMessage'),
      copyMessageBtn: $('copyMessageBtn'),
      copyStatus: $('copyStatus'),
      currentYear: $('currentYear')
    };
  }

  /* ========================================================================
     1. INICIALIZACIÓN SEGURA DE AOS
     El HTML usa data-reveal; solo se convierte en data-aos si AOS cargó y la
     persona no prefiere movimiento reducido. Así nada queda oculto si falla.
     ======================================================================== */
  function initAnimations() {
    const targets = document.querySelectorAll('[data-reveal]');
    if (reducedMotion.matches || typeof window.AOS === 'undefined') return;
    try {
      targets.forEach((node) => {
        node.setAttribute('data-aos', node.dataset.reveal);
        if (node.dataset.revealDelay) node.setAttribute('data-aos-delay', node.dataset.revealDelay);
      });
      window.AOS.init({ duration: 650, easing: 'ease-out-cubic', once: true, offset: 40 });
    } catch (error) {
      console.warn('Hotel Aurea: AOS no se pudo iniciar; el contenido se muestra sin animación.', error);
      targets.forEach((node) => { node.removeAttribute('data-aos'); node.removeAttribute('data-aos-delay'); });
    }
  }

  /** Marca para AOS los elementos generados por JavaScript (tarjetas, servicios, galería). */
  function markReveal(nodes, effect = 'fade-up', step = 90) {
    nodes.forEach((node, index) => {
      node.dataset.reveal = effect;
      node.dataset.revealDelay = String(Math.min(index * step, 360));
    });
  }

  /* ========================================================================
     2. NAVBAR
     ======================================================================== */
  function updateHeader() {
    const menuOpen = dom.navMenu.classList.contains('show') || dom.navMenu.classList.contains('collapsing');
    dom.header.classList.toggle('is-solid', window.scrollY > 40 || menuOpen);
  }

  function bindNavigation() {
    window.addEventListener('scroll', updateHeader, { passive: true });
    dom.navMenu.addEventListener('show.bs.collapse', () => dom.header.classList.add('is-solid'));
    dom.navMenu.addEventListener('hidden.bs.collapse', updateHeader);

    const collapse = bootstrap.Collapse.getOrCreateInstance(dom.navMenu, { toggle: false });
    dom.navMenu.addEventListener('click', (event) => {
      if (event.target.closest('a') && dom.navMenu.classList.contains('show')) collapse.hide();
    });
    bootstrap.ScrollSpy.getOrCreateInstance(document.body, { target: '#navMenu', rootMargin: '0px 0px -55%' });
    updateHeader();
  }

  /* ========================================================================
     RENDERIZADO DE CONTENIDO CONFIGURABLE
     ======================================================================== */
  function renderAttributes() {
    const items = HOTEL_CONFIG.attributes
      .filter((a) => hasText(a.title))
      .map((a) => el('li', { className: 'attribute' }, [icon(a.icon || 'bi-stars'), el('h3', { text: a.title }), el('p', { text: a.text || '' })]));
    dom.aboutAttributes.replaceChildren(...items);
  }

  function renderRooms() {
    const rooms = HOTEL_CONFIG.rooms.filter((room) => hasText(room.id) && hasText(room.name));
    const cards = rooms.map((room) => {
      const img = el('img', { attrs: { src: room.image, alt: room.alt || room.name, loading: 'lazy', width: 900, height: 556 } });
      protectImage(img);
      const price = isAmount(room.pricePerNight)
        ? el('p', { className: 'room__price' }, [el('span', { text: 'Desde' }), el('strong', { text: formatPrice(room.pricePerNight) }), el('span', { text: 'por noche' })])
        : el('p', { className: 'room__price' }, [el('strong', { text: 'Tarifa por consultar' })]);

      return el('article', { className: 'room', attrs: { 'aria-labelledby': `room-${room.id}` } }, [
        el('figure', { className: 'room__photo' }, [img]),
        el('div', { className: 'room__body' }, [
          el('h3', { className: 'room__name', text: room.name, attrs: { id: `room-${room.id}` } }),
          hasText(room.capacity) ? el('p', { className: 'room__capacity' }, [icon('bi-people'), el('span', { text: room.capacity })]) : null,
          el('p', { className: 'room__desc', text: room.description || '' }),
          el('ul', { className: 'room__features', attrs: { 'aria-label': 'Características' } }, (room.features || []).filter(hasText).map((f) => el('li', { text: f }))),
          el('div', { className: 'room__footer' }, [
            price,
            isAmount(room.pricePerNight) && room.priceIsDemo ? demoTag('Precio demostrativo, no es una tarifa vigente') : null,
            el('button', {
              className: 'btn btn-outline-olive',
              attrs: { type: 'button', 'aria-label': `Consultar ${room.name} por WhatsApp` },
              dataset: { wa: 'room', roomId: room.id }
            }, [icon('bi-whatsapp'), el('span', { text: 'Consultar habitación' })])
          ])
        ])
      ]);
    });
    markReveal(cards);
    dom.roomsGrid.replaceChildren(...cards);

    // Opciones del selector del buscador.
    rooms.forEach((room) => dom.roomInterest.append(el('option', { text: room.name, attrs: { value: room.id } })));
  }

  function renderServices() {
    const services = HOTEL_CONFIG.services.filter((s) => hasText(s.title));
    const confirmedCount = services.filter((s) => s.confirmed === true).length;
    const visible = HOTEL_CONFIG.demoMode ? services : services.filter((s) => s.confirmed === true);

    const items = visible.map((service) => el('li', { className: 'service' }, [
      el('span', { className: 'service__icon', attrs: { 'aria-hidden': 'true' } }, [icon(service.icon || 'bi-check2')]),
      el('h3', { text: service.title }),
      el('p', { text: service.text || '' }),
      service.confirmed === true ? null : demoTag('Ejemplo')
    ]));
    markReveal(items, 'fade-up', 70);
    dom.servicesList.replaceChildren(...items);

    if (confirmedCount < services.length && HOTEL_CONFIG.demoMode) {
      dom.servicesLead.textContent = 'Servicios de ejemplo. Los marcados como «Ejemplo» se mostrarán como confirmados cuando el hotel los active.';
    } else if (visible.length === 0) {
      dom.servicesLead.textContent = 'Consulta por WhatsApp los servicios disponibles durante tu estadía.';
    }
  }

  /* ========================================================================
     GALERÍA
     ======================================================================== */
  const galleryState = { index: 0, modal: null };
  const galleryPhotos = () => HOTEL_CONFIG.gallery.filter((p) => hasText(p.src) && hasText(p.alt));

  function renderGallery() {
    const tiles = galleryPhotos().slice(0, 5).map((photo, index) => {
      const img = el('img', { attrs: { src: photo.src, alt: photo.alt, loading: 'lazy' } });
      protectImage(img);
      return el('button', {
        className: 'gallery__item',
        attrs: { type: 'button', 'aria-label': `Ampliar foto: ${photo.alt}` },
        dataset: { index: String(index) }
      }, [img, hasText(photo.caption) ? el('span', { className: 'gallery__caption', text: photo.caption, attrs: { 'aria-hidden': 'true' } }) : null]);
    });
    markReveal(tiles, 'fade-up', 80);
    dom.galleryGrid.replaceChildren(...tiles);
  }

  function showPhoto(index) {
    const photos = galleryPhotos();
    if (!photos.length) return;
    galleryState.index = (index + photos.length) % photos.length;
    const photo = photos[galleryState.index];
    dom.galleryImage.classList.remove('is-changing');
    void dom.galleryImage.offsetWidth; // reinicia la animación
    dom.galleryImage.classList.add('is-changing');
    dom.galleryImage.src = photo.src;
    dom.galleryImage.alt = photo.alt;
    dom.galleryCaption.textContent = photo.alt;
    dom.galleryCounter.textContent = `${galleryState.index + 1} de ${photos.length}`;
  }

  function bindGallery() {
    dom.galleryGrid.addEventListener('click', (event) => {
      const tile = event.target.closest('.gallery__item');
      if (!tile) return;
      showPhoto(Number(tile.dataset.index));
      galleryState.modal.show();
    });
    dom.galleryPrev.addEventListener('click', () => showPhoto(galleryState.index - 1));
    dom.galleryNext.addEventListener('click', () => showPhoto(galleryState.index + 1));
    document.addEventListener('keydown', (event) => {
      if (!dom.galleryModal.classList.contains('show')) return;
      if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(galleryState.index + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(galleryState.index - 1); }
    });
    protectImage(dom.galleryImage);
  }

  /* ========================================================================
     EXPERIENCIAS (pestañas accesibles; sin JS se ven todos los paneles)
     ======================================================================== */
  function initExperienceTabs() {
    const tabs = Array.from(dom.experiences.querySelectorAll('[role="tab"]'));
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
    if (!tabs.length || panels.some((p) => !p)) return;
    dom.experiences.classList.add('is-tabs');

    const select = (index, focus) => {
      tabs.forEach((tab, i) => {
        const active = i === index;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        panels[i].hidden = !active;
        panels[i].classList.toggle('is-entering', active);
      });
      if (focus) tabs[index].focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(index, false));
      tab.addEventListener('keydown', (event) => {
        const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        if (event.key in keys) {
          event.preventDefault();
          select((index + keys[event.key] + tabs.length) % tabs.length, true);
        } else if (event.key === 'Home') {
          event.preventDefault(); select(0, true);
        } else if (event.key === 'End') {
          event.preventDefault(); select(tabs.length - 1, true);
        }
      });
    });
    select(0, false);
    panels[0].classList.remove('is-entering');
  }

  /* ========================================================================
     TESTIMONIOS Y FAQ
     ======================================================================== */
  function renderReviews() {
    const reviews = HOTEL_CONFIG.reviews.filter((r) => hasText(r.name) && hasText(r.text));
    const anyDemo = reviews.some((r) => r.isDemo);
    dom.reviewsNote.textContent = reviews.length === 0
      ? 'Pronto compartiremos opiniones de huéspedes.'
      : anyDemo ? 'Reseñas ficticias de demostración. Se reemplazarán por opiniones verificadas de huéspedes.' : '';
    dom.reviewsNote.hidden = !dom.reviewsNote.textContent;

    const items = reviews.map((review) => {
      const rating = Math.min(Math.max(Math.round(Number(review.rating) || 0), 0), 5);
      return el('figure', { className: 'review' }, [
        el('blockquote', {}, [el('p', { text: `«${review.text}»` })]),
        el('figcaption', {}, [
          rating ? el('span', { className: 'stars', text: '★'.repeat(rating) + '☆'.repeat(5 - rating), attrs: { role: 'img', 'aria-label': `Calificación ${rating} de 5` } }) : null,
          el('strong', { text: review.name }),
          hasText(review.origin) ? el('span', { text: review.origin }) : null,
          review.isDemo ? demoTag('Contenido ficticio') : null
        ])
      ]);
    });
    markReveal(items, 'fade-up', 100);
    dom.reviewsList.replaceChildren(...items);
  }

  function renderFaq() {
    const items = HOTEL_CONFIG.faq.filter((f) => hasText(f.q) && hasText(f.a));
    dom.faqNote.textContent = items.some((f) => f.isDemo)
      ? 'Las respuestas marcadas como ejemplo no son políticas oficiales. Confirma cada condición con el hotel por WhatsApp.'
      : 'Si tu pregunta no está aquí, escríbenos por WhatsApp.';

    const nodes = items.map((item, index) => {
      const headingId = `faqHeading${index}`;
      const panelId = `faqPanel${index}`;
      return el('div', { className: 'accordion-item' }, [
        el('h3', { className: 'accordion-header', attrs: { id: headingId } }, [
          el('button', {
            className: 'accordion-button collapsed',
            text: item.q,
            attrs: { type: 'button', 'data-bs-toggle': 'collapse', 'data-bs-target': `#${panelId}`, 'aria-expanded': 'false', 'aria-controls': panelId }
          })
        ]),
        el('div', { className: 'accordion-collapse collapse', attrs: { id: panelId, 'aria-labelledby': headingId, 'data-bs-parent': '#faqAccordion' } }, [
          el('div', { className: 'accordion-body' }, [
            el('p', { text: item.a }),
            item.isDemo ? demoTag('Respuesta de ejemplo') : null
          ])
        ])
      ]);
    });
    dom.faqAccordion.replaceChildren(...nodes);
    dom.faqAccordion.dataset.reveal = 'fade-up';
  }

  /* ========================================================================
     CONTACTO, MAPA, FOOTER
     ======================================================================== */
  const PENDING = 'Por configurar';
  const isValidEmail = (v) => hasText(v) && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  const phoneHref = (v) => `tel:${v.replace(/[^\d+]/g, '')}`;

  function renderContact() {
    const c = HOTEL_CONFIG.contact;
    const hours = (c.hours || []).filter(hasText);
    const row = (iconName, label, content) => el('div', {}, [el('dt', {}, [icon(iconName), el('span', { text: label })]), el('dd', {}, [content])]);
    const pending = () => el('span', { className: 'pending', text: PENDING });

    dom.contactList.replaceChildren(
      row('bi-geo-alt', 'Dirección', hasText(c.address) ? document.createTextNode(c.address) : pending()),
      row('bi-telephone', 'Teléfono', hasText(c.phone) ? el('a', { text: c.phone, attrs: { href: phoneHref(c.phone) } }) : pending()),
      row('bi-envelope', 'Correo', isValidEmail(c.email) ? el('a', { text: c.email.trim(), attrs: { href: `mailto:${c.email.trim()}` } }) : pending()),
      row('bi-clock', 'Horarios', hours.length ? el('ul', {}, hours.map((h) => el('li', { text: h }))) : pending()),
      row('bi-whatsapp', 'WhatsApp', isWhatsAppConfigured() ? document.createTextNode(`+${waNumber()}`) : pending())
    );

    // Footer: solo datos configurados.
    const footerItems = [];
    if (hasText(c.address)) footerItems.push(el('li', { text: c.address }));
    if (hasText(c.phone)) footerItems.push(el('li', {}, [el('a', { text: c.phone, attrs: { href: phoneHref(c.phone) } })]));
    if (isValidEmail(c.email)) footerItems.push(el('li', {}, [el('a', { text: c.email.trim(), attrs: { href: `mailto:${c.email.trim()}` } })]));
    footerItems.push(el('li', {}, [el('button', {
      className: 'link-button', text: 'Escribir por WhatsApp', attrs: { type: 'button' }, dataset: { wa: 'default' }
    })]));
    if (footerItems.length === 1 && HOTEL_CONFIG.demoMode) footerItems.unshift(el('li', { className: 'pending', text: 'Datos de contacto por configurar' }));
    dom.footerContact.replaceChildren(...footerItems);

    const socialMeta = {
      instagram: { icon: 'bi-instagram', label: 'Instagram', hosts: ['instagram.com'] },
      facebook: { icon: 'bi-facebook', label: 'Facebook', hosts: ['facebook.com'] },
      tiktok: { icon: 'bi-tiktok', label: 'TikTok', hosts: ['tiktok.com'] }
    };
    const socials = Object.entries(socialMeta)
      .filter(([key, meta]) => isSafeHttpsUrl(HOTEL_CONFIG.social[key], meta.hosts))
      .map(([key, meta]) => el('li', {}, [el('a', {
        attrs: { href: HOTEL_CONFIG.social[key].trim(), target: '_blank', rel: 'noopener noreferrer', 'aria-label': `${meta.label} de ${HOTEL_CONFIG.name} (se abre en una pestaña nueva)` }
      }, [icon(meta.icon)])]));
    dom.footerSocial.replaceChildren(...socials);
  }

  function renderMap() {
    const { embedUrl, linkUrl } = HOTEL_CONFIG.map;
    const validEmbed = isSafeHttpsUrl(embedUrl, ['google.com']) && new URL(embedUrl.trim()).pathname.startsWith('/maps/embed');
    if (validEmbed) {
      dom.mapContainer.replaceChildren(el('iframe', {
        attrs: { src: embedUrl.trim(), title: `Mapa de ubicación de ${HOTEL_CONFIG.name}`, loading: 'lazy', referrerpolicy: 'no-referrer-when-downgrade', allowfullscreen: true }
      }));
      return;
    }
    const validLink = isSafeHttpsUrl(linkUrl, ['google.com', 'maps.app.goo.gl', 'goo.gl']);
    dom.mapContainer.replaceChildren(el('div', { className: 'map__empty' }, [
      icon('bi-map'),
      el('p', { text: 'El mapa aparecerá cuando el hotel configure su ubicación. Mientras tanto, pídela por WhatsApp.' }),
      validLink ? el('a', { className: 'btn btn-outline-olive', text: 'Abrir en Google Maps', attrs: { href: linkUrl.trim(), target: '_blank', rel: 'noopener noreferrer' } }) : null
    ]));
  }

  /* ========================================================================
     3–6. FORMULARIO: VALIDACIÓN, NOCHES Y MENSAJE
     ======================================================================== */
  const touched = new Set();

  function readForm() {
    return {
      checkIn: dom.checkIn.value,
      checkOut: dom.checkOut.value,
      adultsRaw: dom.adults.value.trim(),
      childrenRaw: dom.children.value.trim(),
      roomId: dom.roomInterest.value
    };
  }

  function validateStay(values) {
    const errors = {};
    const today = todayISO();
    const adults = Number(values.adultsRaw);
    const children = values.childrenRaw === '' ? 0 : Number(values.childrenRaw);

    if (!values.checkIn) errors.checkIn = 'Elige la fecha de llegada.';
    else if (parseISODate(values.checkIn) === null) errors.checkIn = 'La fecha de llegada no es válida.';
    else if (values.checkIn < today) errors.checkIn = 'La llegada no puede ser una fecha pasada.';

    if (!values.checkOut) errors.checkOut = 'Elige la fecha de salida.';
    else if (parseISODate(values.checkOut) === null) errors.checkOut = 'La fecha de salida no es válida.';

    let nights = 0;
    if (!errors.checkIn && !errors.checkOut) {
      nights = nightsBetween(values.checkIn, values.checkOut);
      if (nights <= 0) errors.checkOut = 'La salida debe ser posterior a la llegada.';
      else if (nights > MAX_NIGHTS) errors.checkOut = `Para más de ${MAX_NIGHTS} noches, escríbenos directamente por WhatsApp.`;
    }

    if (values.adultsRaw === '' || !Number.isInteger(adults) || adults < 1) errors.adults = 'Indica al menos 1 adulto.';
    else if (adults > MAX_ADULTS) errors.adults = `Para grupos de más de ${MAX_ADULTS} adultos, escríbenos por WhatsApp.`;

    if (!Number.isInteger(children) || children < 0) errors.children = 'Escribe 0 o más niños.';
    else if (children > MAX_CHILDREN) errors.children = `Máximo ${MAX_CHILDREN} niños por consulta.`;

    return {
      errors,
      nights: errors.checkIn || errors.checkOut ? 0 : nights,
      adults: errors.adults ? null : adults,
      children: errors.children ? null : children
    };
  }

  function setFieldError(input, message) {
    const feedback = document.getElementById(`${input.id}Error`);
    input.classList.toggle('is-invalid', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (feedback) feedback.textContent = message || '';
  }

  function setStatus(message, tone) {
    dom.bookingStatus.textContent = message;
    dom.bookingStatus.classList.toggle('is-error', tone === 'error');
    dom.bookingStatus.classList.toggle('is-ok', tone === 'ok');
  }

  function updateStay({ showAll = false } = {}) {
    const values = readForm();
    const result = validateStay(values);
    const fields = { checkIn: dom.checkIn, checkOut: dom.checkOut, adults: dom.adults, children: dom.children };
    Object.entries(fields).forEach(([key, input]) => {
      setFieldError(input, showAll || touched.has(key) ? result.errors[key] : '');
    });
    dom.nightsSummary.textContent = result.nights > 0
      ? `${plural(result.nights, 'noche', 'noches')} de estadía`
      : 'Elige tus fechas';
    return { values, result };
  }

  const findRoom = (id) => HOTEL_CONFIG.rooms.find((room) => room.id === id) || null;

  function buildStayMessage(values, result, room) {
    const lines = [
      `Hola, quisiera consultar disponibilidad en ${HOTEL_CONFIG.name}.`,
      '',
      `Llegada: ${formatDate(values.checkIn)}.`,
      `Salida: ${formatDate(values.checkOut)}.`,
      `Noches: ${result.nights}.`,
      `Adultos: ${result.adults}.`,
      `Niños: ${result.children}.`
    ];
    if (room) lines.push(`Habitación de interés: ${room.name}.`);
    lines.push('', '¿Me pueden confirmar si hay disponibilidad y las tarifas para esas fechas?');
    return lines.join('\n');
  }

  /** Mensaje para «Consultar habitación»: incluye las fechas si el buscador ya es válido. */
  function buildRoomMessage(room) {
    const { values, result } = updateStay();
    if (Object.keys(result.errors).length === 0) return buildStayMessage(values, result, room);
    return `Hola, me interesa la ${room.name} de ${HOTEL_CONFIG.name}. ¿Me pueden compartir disponibilidad y tarifas?`;
  }

  let submitLocked = false;
  function handleSubmit(event) {
    event.preventDefault();
    if (submitLocked) return;
    const { values, result } = updateStay({ showAll: true });
    if (Object.keys(result.errors).length) {
      setStatus('Revisa los campos marcados para preparar tu consulta.', 'error');
      dom.form.querySelector('.is-invalid')?.focus();
      return;
    }
    submitLocked = true;
    dom.bookingSubmit.disabled = true;
    window.setTimeout(() => { submitLocked = false; dom.bookingSubmit.disabled = false; }, SUBMIT_COOLDOWN_MS);

    const opened = openWhatsApp(buildStayMessage(values, result, findRoom(values.roomId)));
    setStatus(opened
      ? 'Abrimos WhatsApp con tu consulta. Revísala y envíala; el hotel te confirmará disponibilidad.'
      : 'Tu consulta está lista, pero el número de WhatsApp del hotel aún no está configurado.', opened ? 'ok' : '');
  }

  function syncDateLimits() {
    const today = todayISO();
    dom.checkIn.min = today;
    const base = parseISODate(dom.checkIn.value) !== null && dom.checkIn.value >= today ? dom.checkIn.value : today;
    dom.checkOut.min = addDays(base, 1);
  }

  function bindForm() {
    const keys = new Map([[dom.checkIn, 'checkIn'], [dom.checkOut, 'checkOut'], [dom.adults, 'adults'], [dom.children, 'children']]);
    dom.checkIn.addEventListener('change', () => {
      syncDateLimits();
      if (dom.checkIn.value && (!dom.checkOut.value || dom.checkOut.value <= dom.checkIn.value)) {
        dom.checkOut.value = dom.checkOut.min;
      }
    });
    keys.forEach((key, input) => {
      ['input', 'change'].forEach((type) => input.addEventListener(type, () => {
        touched.add(key);
        updateStay();
        if (dom.bookingStatus.classList.contains('is-error') && !dom.form.querySelector('.is-invalid')) setStatus('', '');
      }));
    });
    dom.form.addEventListener('submit', handleSubmit);
  }

  /* ========================================================================
     WHATSAPP
     ======================================================================== */
  const waNumber = () => String(HOTEL_CONFIG.whatsapp.number || '').trim();
  const isWhatsAppConfigured = () => /^\d{8,15}$/.test(waNumber());

  function buildWhatsAppUrl(message) {
    return isWhatsAppConfigured() ? `https://wa.me/${waNumber()}?text=${encodeURIComponent(message)}` : null;
  }

  let pendingModal = null;
  function openWhatsApp(message) {
    const url = buildWhatsAppUrl(message);
    if (!url) {
      dom.waPendingMessage.textContent = message;
      dom.copyStatus.textContent = '';
      pendingModal.show();
      return false;
    }
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    else window.location.href = url; // navegador con bloqueo de ventanas
    return true;
  }

  function messageFor(trigger) {
    const kind = trigger.dataset.wa;
    if (kind === 'room') {
      const room = findRoom(trigger.dataset.roomId);
      if (room) return buildRoomMessage(room);
    }
    return HOTEL_CONFIG.whatsapp.messages[kind] || HOTEL_CONFIG.whatsapp.messages.default;
  }

  function decorateWhatsAppTriggers() {
    if (isWhatsAppConfigured()) return;
    document.querySelectorAll('[data-wa]').forEach((trigger) => {
      if (trigger.classList.contains('link-button')) return;
      trigger.append(el('span', { className: 'wa-pending-badge', text: 'Pendiente' }));
      trigger.title = 'Número de WhatsApp pendiente de configurar';
    });
  }

  async function copyPendingMessage() {
    try {
      await navigator.clipboard.writeText(dom.waPendingMessage.textContent);
      dom.copyStatus.textContent = 'Mensaje copiado.';
    } catch (error) {
      const range = document.createRange();
      range.selectNodeContents(dom.waPendingMessage);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      dom.copyStatus.textContent = 'Selecciona el texto resaltado y cópialo manualmente.';
    }
  }

  function bindWhatsApp() {
    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-wa]');
      if (!trigger) return;
      event.preventDefault();
      openWhatsApp(messageFor(trigger));
    });
    dom.copyMessageBtn.addEventListener('click', copyPendingMessage);
  }

  /* ========================================================================
     INICIALIZACIÓN
     ======================================================================== */
  function init() {
    cacheDom();
    dom.currentYear.textContent = String(new Date().getFullYear());
    document.querySelectorAll('main img').forEach(protectImage);

    renderAttributes();
    renderRooms();
    renderServices();
    renderGallery();
    renderReviews();
    renderFaq();
    renderContact();
    renderMap();
    initExperienceTabs();
    syncDateLimits();
    updateStay();
    bindForm();

    if (typeof window.bootstrap === 'undefined') {
      console.error('Hotel Aurea: Bootstrap no se cargó; los modales y el menú móvil no estarán disponibles.');
      initAnimations();
      return;
    }
    galleryState.modal = bootstrap.Modal.getOrCreateInstance(dom.galleryModal);
    pendingModal = bootstrap.Modal.getOrCreateInstance(dom.waPendingModal);

    decorateWhatsAppTriggers();
    bindWhatsApp();
    bindGallery();
    bindNavigation();
    initAnimations();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
