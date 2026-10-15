/* ==========================================================================
   Refugio Natural — lógica de la página
   Todo lo que el propietario debe completar está en CONFIG (bloque 1).
   La página no guarda datos personales ni crea reservas: solo prepara
   un mensaje que el visitante revisa y envía por WhatsApp.
   ========================================================================== */
'use strict';

(() => {
  /* ========================================================================
     1. CONFIGURACIÓN DE REFUGIO NATURAL
     Regla general: null o '' = dato no confirmado. La página lo mostrará
     como «Por confirmar» (modo demostración) u ocultará el elemento.
     ======================================================================== */
  const CONFIG = {
    // true: muestra avisos de demostración y las opciones pendientes. Ponlo en false al publicar.
    demoMode: true,

    whatsapp: {
      // Formato internacional, solo dígitos, sin "+" ni espacios. Ej.: '573001234567'.
      number: '',
      messages: {
        default: 'Hola, estoy interesado en conocer la disponibilidad de Refugio Natural. ¿Me podrían compartir las tarifas y las condiciones de reserva?',
        price: 'Hola, quisiera consultar el precio de Refugio Natural para mis fechas. ¿Me podrían compartir las tarifas y las condiciones de reserva?',
        location: 'Hola, ¿me podrían compartir la ubicación de Refugio Natural y las indicaciones para llegar?'
      }
    },

    contact: {
      email: '',                  // Ej.: 'reservas@tudominio.com'
      social: {                   // URL completas (https://...). Vacío = no se muestra.
        instagram: '',
        facebook: '',
        tiktok: ''
      }
    },

    property: {
      maxGuests: 6,               // Capacidad máxima de personas (adultos + niños).
      maxGuestsProvisional: true, // true mientras el propietario no confirme la capacidad.
      bedrooms: null,
      bathrooms: null,
      beds: null
    },

    stay: {
      minNights: null,            // Ej.: 2. null = sin mínimo publicado.
      checkInTime: '',            // Ej.: '3:00 p. m.'
      checkOutTime: ''            // Ej.: '12:00 m.'
    },

    pricing: {
      pricePerNight: 450000,      // COP. null = precio por confirmar.
      cleaningFee: null,          // COP. null = no publicado; 0 = sin cargo.
      extraFees: [],              // Cargos adicionales obligatorios: [{ label: 'Persona adicional', amount: 50000 }]
      provisional: true           // true = valores de demostración, no tarifas confirmadas.
    },

    includedServices: [],         // Ej.: ['Ropa de cama y toallas', 'Wi-Fi']

    policies: {
      booking: '',                // Condiciones para separar la fecha.
      deposit: '',                // Información sobre anticipos.
      cancellation: '',           // Política de cancelación.
      payments: '',               // Medios de pago aceptados.
      pets: ''                    // Detalle de la política de mascotas (si amenities.pets = true).
    },

    // true = confirmada, false = no disponible (se oculta), null = por confirmar.
    amenities: {
      kitchen: null,
      livingRoom: null,
      garden: null,
      terrace: null,
      pool: null,
      bbq: null,
      parking: null,
      wifi: null,
      airConditioning: null,
      fans: null,
      pets: null,
      hammocks: null
    },

    location: {
      municipality: '',
      department: '',
      reference: '',              // Ej.: 'Vereda ..., a la entrada del condominio ...'
      directions: '',             // Indicaciones de llegada.
      mapsUrl: ''                 // Enlace de Google Maps (https://maps.app.goo.gl/...).
    },

    // Fotos ilustrativas de Unsplash. Reemplaza `src` por las fotos reales (ruta local o URL)
    // y cambia `illustrative` a false.
    gallery: {
      illustrative: true,
      photos: [
        { src: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=1600&q=75', alt: 'Casa campestre con techo a dos aguas, palmeras y jardín amplio', caption: 'Fachada y jardín' },
        { src: 'https://images.unsplash.com/photo-1520483601560-389dff434fdf?auto=format&fit=crop&w=1600&q=75', alt: 'Vista desde una terraza techada hacia palmeras y vegetación tropical', caption: 'Terraza' },
        { src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=75', alt: 'Sala luminosa con sofás claros, plantas y cuadros', caption: 'Sala de estar' },
        { src: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1600&q=75', alt: 'Habitación con cama, cojines en tonos cálidos y plantas colgantes', caption: 'Habitación' },
        { src: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1600&q=75', alt: 'Cocina blanca con estufa, mesón y gabinetes', caption: 'Cocina' },
        { src: 'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?auto=format&fit=crop&w=1600&q=75', alt: 'Sendero con baranda de madera entre vegetación que lleva a una cabaña', caption: 'Entorno natural' }
      ]
    },

    // Solo reseñas reales, con autorización de quien las escribió.
    // Formato: { name: 'Nombre', comment: 'Texto', rating: 5, date: '2026-09-14' }
    reviews: []
  };

  /* ========================================================================
     CONSTANTES Y CATÁLOGOS
     ======================================================================== */
  const AMENITY_CATALOG = Object.freeze({
    kitchen: { label: 'Cocina', icon: 'bi-cup-hot' },
    livingRoom: { label: 'Sala de estar', icon: 'bi-lamp' },
    garden: { label: 'Jardín', icon: 'bi-flower1' },
    terrace: { label: 'Terraza', icon: 'bi-brightness-high' },
    pool: { label: 'Piscina', icon: 'bi-water' },
    bbq: { label: 'Zona BBQ', icon: 'bi-fire' },
    parking: { label: 'Parqueadero', icon: 'bi-car-front' },
    wifi: { label: 'Wi-Fi', icon: 'bi-wifi' },
    airConditioning: { label: 'Aire acondicionado', icon: 'bi-snow' },
    fans: { label: 'Ventiladores', icon: 'bi-fan' },
    pets: { label: 'Admite mascotas', icon: 'bi-house-heart' },
    hammocks: { label: 'Zona de hamacas', icon: 'bi-moon-stars' }
  });

  const PENDING_TEXT = 'Por confirmar con el propietario';
  const MAX_NIGHTS = 60;
  const MS_PER_DAY = 86400000;
  const GALLERY_VISIBLE = 5;
  const SUBMIT_COOLDOWN_MS = 1500;

  /* ========================================================================
     2. FORMATO DE MONEDA Y UTILIDADES DE DOM
     ======================================================================== */
  const currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0
  });
  const formatCOP = (amount) => currencyFormatter.format(amount);
  const isAmount = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0;
  const hasText = (value) => typeof value === 'string' && value.trim() !== '';
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

  /** Crea elementos asignando texto con textContent (nunca innerHTML). */
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

  /** Si una foto no carga, el contenedor muestra un fondo de respaldo. */
  function protectImage(img) {
    const markBroken = () => { if (img.parentElement) img.parentElement.classList.add('img-fallback'); };
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) markBroken();
    img.addEventListener('error', markBroken);
    img.addEventListener('load', () => { if (img.parentElement) img.parentElement.classList.remove('img-fallback'); });
  }

  function isSafeHttpsUrl(value, allowedHosts) {
    if (!hasText(value)) return false;
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:') return false;
      return !allowedHosts || allowedHosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));
    } catch (error) {
      return false;
    }
  }

  const isValidEmail = (value) => hasText(value) && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

  /* ========================================================================
     3. UTILIDADES DE FECHA (días de calendario en UTC, sin horas)
     ======================================================================== */
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

  /** Del 10 al 13 son 3 noches: diferencia de días de calendario. */
  const nightsBetween = (checkIn, checkOut) =>
    Math.round((parseISODate(checkOut) - parseISODate(checkIn)) / MS_PER_DAY);

  const longDateFormatter = new Intl.DateTimeFormat('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
  });
  const formatLongDate = (iso) => longDateFormatter.format(new Date(parseISODate(iso)));

  /* ========================================================================
     REFERENCIAS AL DOM
     ======================================================================== */
  let dom = {};

  function cacheDom() {
    const $ = (id) => document.getElementById(id);
    dom = {
      demoBar: $('demoBar'),
      navMenu: $('navMenu'),
      galleryGrid: $('galleryGrid'),
      galleryNote: $('galleryNote'),
      galleryModal: $('galleryModal'),
      galleryModalImage: $('galleryModalImage'),
      galleryModalCaption: $('galleryModalCaption'),
      galleryCounter: $('galleryCounter'),
      galleryPrev: $('galleryPrev'),
      galleryNext: $('galleryNext'),
      propertyFacts: $('propertyFacts'),
      amenitiesList: $('amenitiesList'),
      amenitiesPending: $('amenitiesPending'),
      amenitiesPendingList: $('amenitiesPendingList'),
      ratePrice: $('ratePrice'),
      rateProvisional: $('rateProvisional'),
      conditionsList: $('conditionsList'),
      form: $('consulta'),
      checkIn: $('checkIn'),
      checkOut: $('checkOut'),
      adults: $('adults'),
      children: $('children'),
      guestName: $('guestName'),
      guestMessage: $('guestMessage'),
      capacityHint: $('capacityHint'),
      bdNights: $('bdNights'),
      bdRate: $('bdRate'),
      bdSubtotal: $('bdSubtotal'),
      bdSubtotalLabel: $('bdSubtotalLabel'),
      bdCleaningRow: $('bdCleaningRow'),
      bdCleaning: $('bdCleaning'),
      bdTotal: $('bdTotal'),
      breakdownNote: $('breakdownNote'),
      messagePreview: $('messagePreview'),
      formStatus: $('formStatus'),
      inquirySubmit: $('inquirySubmit'),
      reviewsSection: $('testimonios'),
      reviewsBlock: $('reviewsBlock'),
      reviewsList: $('reviewsList'),
      inviteBlock: $('inviteBlock'),
      locationDetails: $('locationDetails'),
      mapsLink: $('mapsLink'),
      contactList: $('contactList'),
      footerContact: $('footerContact'),
      footerSocial: $('footerSocial'),
      faqAccordion: $('faqAccordion'),
      waPendingModal: $('waPendingModal'),
      waPendingMessage: $('waPendingMessage'),
      copyMessageBtn: $('copyMessageBtn'),
      copyStatus: $('copyStatus'),
      currentYear: $('currentYear')
    };
  }

  /* ========================================================================
     4. RENDERIZADO DE AMENIDADES, CAPACIDAD Y TARIFAS
     ======================================================================== */
  const pendingTag = (text = 'Por confirmar') => el('span', { className: 'tag tag--pending', text });

  function renderPropertyFacts() {
    const { maxGuests, maxGuestsProvisional, bedrooms, bathrooms, beds } = CONFIG.property;
    const facts = [
      { icon: 'bi-people', label: 'Capacidad', value: Number.isInteger(maxGuests) ? plural(maxGuests, 'persona', 'personas') : null, provisional: maxGuestsProvisional },
      { icon: 'bi-door-closed', label: 'Habitaciones', value: Number.isInteger(bedrooms) ? String(bedrooms) : null },
      { icon: 'bi-moon-stars', label: 'Camas', value: Number.isInteger(beds) ? String(beds) : null },
      { icon: 'bi-droplet', label: 'Baños', value: Number.isInteger(bathrooms) ? String(bathrooms) : null }
    ];
    const rows = facts
      .filter((fact) => fact.value !== null || CONFIG.demoMode)
      .map((fact) => el('div', {}, [
        el('dt', {}, [icon(fact.icon), el('span', { text: fact.label })]),
        el('dd', {}, fact.value === null
          ? [pendingTag()]
          : [document.createTextNode(fact.value), fact.provisional ? el('span', { text: ' ' }) : null, fact.provisional ? pendingTag('Provisional') : null])
      ]));
    dom.propertyFacts.replaceChildren(...rows);
    dom.propertyFacts.hidden = rows.length === 0;
  }

  function renderAmenities() {
    const entries = Object.entries(AMENITY_CATALOG);
    const confirmed = entries.filter(([key]) => CONFIG.amenities[key] === true);
    const pending = entries.filter(([key]) => CONFIG.amenities[key] !== true && CONFIG.amenities[key] !== false);

    const toItem = ([, amenity], note) => el('li', { className: 'amenity' }, [
      icon(amenity.icon),
      el('span', {}, [document.createTextNode(amenity.label), note ? el('small', { text: note }) : null])
    ]);

    if (confirmed.length) {
      dom.amenitiesList.replaceChildren(...confirmed.map((entry) => toItem(entry)));
    } else {
      dom.amenitiesList.replaceChildren(el('li', { className: 'amenity', attrs: { style: 'grid-column: 1 / -1' } }, [
        icon('bi-chat-heart'),
        el('span', { text: 'El propietario aún no ha publicado las amenidades. Pregunta por WhatsApp por lo que necesites para tu estadía.' })
      ]));
    }

    const showPending = CONFIG.demoMode && pending.length > 0;
    dom.amenitiesPending.hidden = !showPending;
    if (showPending) dom.amenitiesPendingList.replaceChildren(...pending.map((entry) => toItem(entry, 'Opción configurable')));
  }

  /** Texto de una condición o null si no está configurada. */
  function describeCleaningFee() {
    const fee = CONFIG.pricing.cleaningFee;
    if (!isAmount(fee)) return null;
    return fee === 0 ? 'Sin cargo de limpieza' : formatCOP(fee);
  }

  function renderRates() {
    const { pricePerNight, provisional } = CONFIG.pricing;
    dom.ratePrice.textContent = isAmount(pricePerNight) ? formatCOP(pricePerNight) : 'Por confirmar';
    dom.rateProvisional.hidden = !(provisional && isAmount(pricePerNight));

    const { maxGuests, maxGuestsProvisional } = CONFIG.property;
    const { minNights, checkInTime, checkOutTime } = CONFIG.stay;
    const p = CONFIG.policies;
    const services = CONFIG.includedServices.filter(hasText);

    const rows = [
      { icon: 'bi-people', label: 'Capacidad máxima', value: Number.isInteger(maxGuests) ? `${plural(maxGuests, 'persona', 'personas')}${maxGuestsProvisional ? ' (provisional)' : ''}` : null },
      { icon: 'bi-calendar-event', label: 'Estancia mínima', value: Number.isInteger(minNights) && minNights > 0 ? plural(minNights, 'noche', 'noches') : null },
      { icon: 'bi-sunrise', label: 'Llegada', value: hasText(checkInTime) ? `Desde las ${checkInTime}` : null },
      { icon: 'bi-sunset', label: 'Salida', value: hasText(checkOutTime) ? `Hasta las ${checkOutTime}` : null },
      { icon: 'bi-stars', label: 'Limpieza', value: describeCleaningFee() },
      ...CONFIG.pricing.extraFees.filter((fee) => hasText(fee.label) && isAmount(fee.amount))
        .map((fee) => ({ icon: 'bi-plus-circle', label: fee.label, value: formatCOP(fee.amount) })),
      { icon: 'bi-check2', label: 'Incluye', list: services.length ? services : null },
      { icon: 'bi-calendar-check', label: 'Condiciones de reserva', value: hasText(p.booking) ? p.booking : null },
      { icon: 'bi-cash-coin', label: 'Anticipo', value: hasText(p.deposit) ? p.deposit : null },
      { icon: 'bi-arrow-counterclockwise', label: 'Cancelación', value: hasText(p.cancellation) ? p.cancellation : null }
    ];

    dom.conditionsList.replaceChildren(...rows.map((row) => {
      let content;
      if (row.list) content = el('ul', {}, row.list.map((item) => el('li', { text: item })));
      else if (row.value) content = document.createTextNode(row.value);
      else content = el('span', { className: 'pending', text: PENDING_TEXT });
      return el('div', {}, [el('dt', {}, [icon(row.icon), el('span', { text: row.label })]), el('dd', {}, [content])]);
    }));
  }

  /* ========================================================================
     5. GESTIÓN DE LA GALERÍA
     ======================================================================== */
  const gallery = { index: 0, modal: null };
  const galleryPhotos = () => CONFIG.gallery.photos.filter((photo) => hasText(photo.src) && hasText(photo.alt));

  function renderGallery() {
    const photos = galleryPhotos();
    const illustrative = CONFIG.gallery.illustrative;
    dom.galleryNote.textContent = illustrative
      ? 'Fotografías ilustrativas: se reemplazarán por fotos reales de Refugio Natural. Toca una foto para verla en grande.'
      : 'Toca una foto para verla en grande.';

    const visible = photos.slice(0, GALLERY_VISIBLE);
    const hiddenCount = photos.length - visible.length;

    const tiles = visible.map((photo, index) => {
      const img = el('img', { attrs: { src: photo.src.replace('w=1600', index === 0 ? 'w=1200' : 'w=700'), alt: photo.alt, loading: 'lazy' } });
      protectImage(img);
      const isLastWithMore = hiddenCount > 0 && index === visible.length - 1;
      const label = isLastWithMore
        ? `Ver las ${photos.length} fotos de la galería`
        : `Ampliar foto: ${photo.caption || photo.alt}`;
      return el('button', {
        className: 'gallery__item',
        attrs: { type: 'button', 'aria-label': label },
        dataset: { index: String(index) }
      }, [
        img,
        photo.caption && !isLastWithMore ? el('span', { className: 'gallery__caption', text: photo.caption }) : null,
        isLastWithMore ? el('span', { className: 'gallery__more', text: `+${plural(hiddenCount, 'foto', 'fotos')}` }) : null
      ]);
    });
    dom.galleryGrid.replaceChildren(...tiles);
  }

  function showGalleryPhoto(index) {
    const photos = galleryPhotos();
    if (!photos.length) return;
    gallery.index = (index + photos.length) % photos.length;
    const photo = photos[gallery.index];
    const img = dom.galleryModalImage;

    img.classList.remove('is-changing');
    void img.offsetWidth; // reinicia la animación de cambio
    img.classList.add('is-changing');
    img.src = photo.src;
    img.alt = photo.alt;

    const suffix = CONFIG.gallery.illustrative ? ' (foto ilustrativa)' : '';
    dom.galleryModalCaption.textContent = `${photo.caption ? `${photo.caption}: ` : ''}${photo.alt}${suffix}`;
    dom.galleryCounter.textContent = `${gallery.index + 1} de ${photos.length}`;
  }

  function openGallery(index) {
    showGalleryPhoto(index);
    gallery.modal.show();
  }

  function handleGalleryKeys(event) {
    if (!dom.galleryModal.classList.contains('show')) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); showGalleryPhoto(gallery.index + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); showGalleryPhoto(gallery.index - 1); }
  }

  /* ========================================================================
     6. CALCULADORA DE ESTANCIA
     ======================================================================== */
  function readForm() {
    return {
      checkIn: dom.checkIn.value,
      checkOut: dom.checkOut.value,
      adultsRaw: dom.adults.value.trim(),
      childrenRaw: dom.children.value.trim(),
      name: dom.guestName.value.replace(/\s+/g, ' ').trim(),
      message: dom.guestMessage.value.replace(/\n{3,}/g, '\n\n').trim()
    };
  }

  /** Total estimado = noches × precio por noche + limpieza + cargos adicionales configurados. */
  function buildQuote(nights) {
    const { pricePerNight, cleaningFee, extraFees } = CONFIG.pricing;
    if (!isAmount(pricePerNight) || nights <= 0) return null;
    const subtotal = nights * pricePerNight;
    const cleaning = isAmount(cleaningFee) ? cleaningFee : 0;
    const extras = extraFees.filter((fee) => hasText(fee.label) && isAmount(fee.amount));
    const extrasTotal = extras.reduce((sum, fee) => sum + fee.amount, 0);
    return { nights, pricePerNight, subtotal, cleaning, extras, total: subtotal + cleaning + extrasTotal };
  }

  function renderBreakdown(nights, quote) {
    const { pricePerNight, cleaningFee, provisional } = CONFIG.pricing;
    dom.bdNights.textContent = nights > 0 ? plural(nights, 'noche', 'noches') : '—';
    dom.bdRate.textContent = isAmount(pricePerNight) ? formatCOP(pricePerNight) : 'Por confirmar';
    dom.bdSubtotalLabel.textContent = quote ? `Subtotal (${nights} × ${formatCOP(quote.pricePerNight)})` : 'Subtotal de la estancia';
    dom.bdSubtotal.textContent = quote ? formatCOP(quote.subtotal) : '—';

    const showCleaning = isAmount(cleaningFee) && cleaningFee > 0;
    dom.bdCleaningRow.hidden = !showCleaning;
    if (showCleaning) dom.bdCleaning.textContent = formatCOP(cleaningFee);

    // Filas de cargos adicionales configurados (se regeneran en cada cálculo).
    dom.form.querySelectorAll('[data-extra-fee]').forEach((row) => row.remove());
    if (quote) {
      const totalRow = dom.bdTotal.parentElement;
      quote.extras.forEach((fee) => {
        totalRow.before(el('div', { dataset: { extraFee: '' } }, [el('dt', { text: fee.label }), el('dd', { text: formatCOP(fee.amount) })]));
      });
    }

    dom.bdTotal.textContent = quote ? formatCOP(quote.total) : (isAmount(pricePerNight) ? '—' : 'Por confirmar');

    if (!isAmount(pricePerNight)) {
      dom.breakdownNote.textContent = 'El propietario te compartirá la tarifa por WhatsApp.';
    } else if (provisional) {
      dom.breakdownNote.textContent = 'Tarifa provisional de demostración. El valor final lo confirma el propietario.';
    } else {
      dom.breakdownNote.textContent = 'Estimado de referencia. El valor final y la disponibilidad los confirma el propietario.';
    }
  }

  function renderCapacityHint() {
    const { maxGuests, maxGuestsProvisional } = CONFIG.property;
    if (Number.isInteger(maxGuests)) {
      dom.capacityHint.textContent = `Capacidad máxima: ${plural(maxGuests, 'persona', 'personas')} entre adultos y niños${maxGuestsProvisional ? ' (dato provisional)' : ''}.`;
      dom.adults.max = String(maxGuests);
      dom.children.max = String(Math.max(maxGuests - 1, 0));
    } else {
      dom.capacityHint.textContent = 'Confirma con el propietario la capacidad para tu grupo.';
    }
  }

  /* ========================================================================
     7. VALIDACIÓN DEL FORMULARIO
     ======================================================================== */
  const touched = new Set();

  function validateInquiry(values) {
    const errors = {};
    const today = todayISO();
    const minNights = Number.isInteger(CONFIG.stay.minNights) && CONFIG.stay.minNights > 0 ? CONFIG.stay.minNights : 1;
    const adults = Number(values.adultsRaw);
    const children = values.childrenRaw === '' ? 0 : Number(values.childrenRaw);

    if (!values.checkIn) errors.checkIn = 'Elige tu fecha de llegada.';
    else if (parseISODate(values.checkIn) === null) errors.checkIn = 'La fecha de llegada no es válida.';
    else if (values.checkIn < today) errors.checkIn = 'La llegada no puede ser anterior a hoy.';

    if (!values.checkOut) errors.checkOut = 'Elige tu fecha de salida.';
    else if (parseISODate(values.checkOut) === null) errors.checkOut = 'La fecha de salida no es válida.';

    let nights = 0;
    if (!errors.checkIn && !errors.checkOut) {
      nights = nightsBetween(values.checkIn, values.checkOut);
      if (nights <= 0) errors.checkOut = 'La salida debe ser posterior a la llegada.';
      else if (nights < minNights) errors.checkOut = `La estancia mínima es de ${plural(minNights, 'noche', 'noches')}.`;
      else if (nights > MAX_NIGHTS) errors.checkOut = `Para estancias de más de ${MAX_NIGHTS} noches, escríbele directamente al propietario.`;
    }

    if (values.adultsRaw === '' || !Number.isInteger(adults) || adults < 1) errors.adults = 'Indica al menos 1 adulto.';
    if (!Number.isInteger(children) || children < 0) errors.children = 'Escribe 0 o más niños.';

    const { maxGuests } = CONFIG.property;
    if (!errors.adults && !errors.children && Number.isInteger(maxGuests) && adults + children > maxGuests) {
      errors.adults = `Son ${adults + children} personas y la capacidad máxima es de ${maxGuests}.`;
    }

    if (values.name.length < 2) errors.guestName = 'Escribe tu nombre para que el propietario sepa con quién habla.';

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
    dom.formStatus.textContent = message;
    dom.formStatus.classList.toggle('is-error', tone === 'error');
    dom.formStatus.classList.toggle('is-ok', tone === 'ok');
  }

  /** Recalcula todo. Con showAll=false solo marca errores de campos ya tocados. */
  function updateInquiry({ showAll = false } = {}) {
    const values = readForm();
    const result = validateInquiry(values);
    const fields = { checkIn: dom.checkIn, checkOut: dom.checkOut, adults: dom.adults, children: dom.children, guestName: dom.guestName };

    Object.entries(fields).forEach(([key, input]) => {
      const visible = showAll || touched.has(key);
      setFieldError(input, visible ? result.errors[key] : '');
    });

    const quote = buildQuote(result.nights);
    renderBreakdown(result.nights, quote);
    dom.messagePreview.textContent = buildInquiryMessage(values, result, quote);
    return { values, result, quote };
  }

  /* ========================================================================
     8. GENERACIÓN DE ENLACES Y MENSAJES DE WHATSAPP
     ======================================================================== */
  const whatsappNumber = () => String(CONFIG.whatsapp.number || '').trim();
  const isWhatsAppConfigured = () => /^\d{8,15}$/.test(whatsappNumber());

  function buildWhatsAppUrl(message) {
    if (!isWhatsAppConfigured()) return null;
    return `https://wa.me/${whatsappNumber()}?text=${encodeURIComponent(message)}`;
  }

  function buildInquiryMessage(values, result, quote) {
    const has = (key) => !result.errors[key];
    const lines = [
      'Hola, estoy interesado en alojarme en Refugio Natural.',
      '',
      `Nombre: ${values.name.length >= 2 ? values.name : '[tu nombre]'}.`,
      `Llegada: ${has('checkIn') && values.checkIn ? formatLongDate(values.checkIn) : '[fecha de llegada]'}.`,
      `Salida: ${has('checkOut') && values.checkOut ? formatLongDate(values.checkOut) : '[fecha de salida]'}.`,
      `Número de noches: ${result.nights > 0 ? result.nights : '[noches]'}.`,
      `Adultos: ${result.adults !== null ? result.adults : '[adultos]'}.`,
      `Niños: ${result.children !== null ? result.children : '0'}.`
    ];
    if (quote) {
      const note = CONFIG.pricing.provisional ? 'valor de referencia de la página, sujeto a confirmación' : 'estimado de la página, sujeto a confirmación';
      lines.push(`Total estimado: ${formatCOP(quote.total)} (${note}).`);
    }
    if (values.message) lines.push('', `Mensaje: ${values.message}`);
    lines.push('', '¿Me pueden confirmar la disponibilidad y las condiciones de reserva?');
    return lines.join('\n');
  }

  function messageForTrigger(trigger) {
    const messages = CONFIG.whatsapp.messages;
    const kind = trigger.dataset.wa;
    if (kind === 'faq' && hasText(trigger.dataset.waQuestion)) {
      return `Hola, tengo una pregunta sobre Refugio Natural: ${trigger.dataset.waQuestion}`;
    }
    return messages[kind] || messages.default;
  }

  /** Abre WhatsApp para que el visitante revise y envíe el mensaje. Nunca lo envía solo. */
  function openWhatsApp(message) {
    const url = buildWhatsAppUrl(message);
    if (!url) {
      showPendingWhatsApp(message);
      return false;
    }
    const opened = window.open(url, '_blank');
    if (opened) opened.opener = null;
    else window.location.href = url; // si el navegador bloquea la pestaña nueva
    return true;
  }

  let pendingModal = null;
  function showPendingWhatsApp(message) {
    dom.waPendingMessage.textContent = message;
    dom.copyStatus.textContent = '';
    pendingModal.show();
  }

  async function copyPendingMessage() {
    const text = dom.waPendingMessage.textContent;
    try {
      await navigator.clipboard.writeText(text);
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

  /** Marca visualmente los botones de WhatsApp cuando falta el número. */
  function decorateWhatsAppTriggers(root = document) {
    if (isWhatsAppConfigured()) return;
    root.querySelectorAll('[data-wa]:not(.is-pending)').forEach((trigger) => {
      trigger.classList.add('is-pending');
      if (trigger.id === 'waFloat') {
        trigger.append(el('span', { className: 'pending-dot', attrs: { 'aria-hidden': 'true' } }));
        trigger.setAttribute('aria-label', 'WhatsApp pendiente de configurar: ver el mensaje');
      } else if (!trigger.classList.contains('faq-ask')) {
        trigger.append(el('span', { className: 'pending-badge', text: 'Pendiente' }));
      }
      trigger.setAttribute('title', 'Número de WhatsApp pendiente de configurar');
    });
  }

  /* ========================================================================
     CONTENIDO CONFIGURABLE: TESTIMONIOS, UBICACIÓN, CONTACTO Y FAQ
     ======================================================================== */
  function renderReviews() {
    const reviews = CONFIG.reviews.filter((r) => hasText(r.name) && hasText(r.comment));
    const hasReviews = reviews.length > 0;
    dom.reviewsBlock.hidden = !hasReviews;
    dom.inviteBlock.hidden = hasReviews;
    dom.reviewsSection.setAttribute('aria-labelledby', hasReviews ? 'reviewsTitle' : 'inviteTitle');
    if (!hasReviews) return;

    dom.reviewsList.replaceChildren(...reviews.map((review) => {
      const rating = Math.min(Math.max(Math.round(Number(review.rating) || 0), 0), 5);
      const dateText = parseISODate(review.date) !== null
        ? new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(parseISODate(review.date)))
        : '';
      return el('figure', { className: 'review' }, [
        rating ? el('p', { className: 'stars', text: '★'.repeat(rating) + '☆'.repeat(5 - rating), attrs: { role: 'img', 'aria-label': `Calificación ${rating} de 5` } }) : null,
        el('blockquote', {}, [el('p', { text: review.comment })]),
        el('figcaption', { text: dateText ? `${review.name}, ${dateText}` : review.name })
      ]);
    }));
  }

  const MAPS_HOSTS = ['google.com', 'maps.app.goo.gl', 'goo.gl'];

  function renderLocation() {
    const loc = CONFIG.location;
    const place = [loc.municipality, loc.department].filter(hasText).join(', ');
    const hasDetails = place || hasText(loc.reference) || hasText(loc.directions);

    if (!hasDetails) {
      dom.locationDetails.replaceChildren(el('p', { className: 'location-empty' }, [
        icon('bi-geo-alt'),
        el('span', { text: 'Consulta la ubicación y las indicaciones directamente con el propietario. Te las compartirá por WhatsApp.' })
      ]));
    } else {
      const item = (iconName, title, text) => el('div', { className: 'location-item' }, [
        icon(iconName), el('div', {}, [el('strong', { text: title }), el('span', { text })])
      ]);
      dom.locationDetails.replaceChildren(
        place ? el('p', { className: 'location-place', text: place }) : null,
        hasText(loc.reference) ? item('bi-geo-alt', 'Referencia', loc.reference) : null,
        hasText(loc.directions) ? item('bi-signpost-2', 'Cómo llegar', loc.directions) : null
      );
    }

    const validMaps = isSafeHttpsUrl(loc.mapsUrl, MAPS_HOSTS);
    dom.mapsLink.hidden = !validMaps;
    if (validMaps) {
      dom.mapsLink.href = loc.mapsUrl;
      dom.mapsLink.setAttribute('aria-label', 'Cómo llegar: abrir la ubicación en Google Maps (pestaña nueva)');
    }
  }

  function renderContact() {
    const number = whatsappNumber();
    const email = CONFIG.contact.email;
    const items = (light) => {
      const list = [];
      list.push(isWhatsAppConfigured()
        ? el('li', {}, [icon('bi-whatsapp'), el('span', { text: `WhatsApp +${number}` })])
        : el('li', {}, [icon('bi-whatsapp'), el('span', { className: 'pending', text: 'WhatsApp: número pendiente de configurar' })]));
      if (isValidEmail(email)) {
        list.push(el('li', {}, [icon('bi-envelope'), el('a', { text: email.trim(), attrs: { href: `mailto:${email.trim()}` } })]));
      } else if (CONFIG.demoMode && !light) {
        list.push(el('li', {}, [icon('bi-envelope'), el('span', { className: 'pending', text: 'Correo: opcional, pendiente de configurar' })]));
      }
      return list;
    };
    dom.contactList.replaceChildren(...items(false));
    dom.footerContact.replaceChildren(...items(true));

    const socialIcons = {
      instagram: { icon: 'bi-instagram', label: 'Instagram', hosts: ['instagram.com'] },
      facebook: { icon: 'bi-facebook', label: 'Facebook', hosts: ['facebook.com'] },
      tiktok: { icon: 'bi-tiktok', label: 'TikTok', hosts: ['tiktok.com'] }
    };
    const socials = Object.entries(socialIcons)
      .filter(([key, meta]) => isSafeHttpsUrl(CONFIG.contact.social[key], meta.hosts))
      .map(([key, meta]) => el('li', {}, [el('a', {
        attrs: { href: CONFIG.contact.social[key], target: '_blank', rel: 'noopener noreferrer', 'aria-label': `${meta.label} de Refugio Natural (pestaña nueva)` }
      }, [icon(meta.icon)])]));
    dom.footerSocial.replaceChildren(...socials);
  }

  /** Las respuestas salen solo de CONFIG; si falta el dato, se invita a preguntar. */
  function buildFaqItems() {
    const { maxGuests, maxGuestsProvisional } = CONFIG.property;
    const { checkInTime, checkOutTime } = CONFIG.stay;
    const p = CONFIG.policies;
    const services = CONFIG.includedServices.filter(hasText);
    const loc = CONFIG.location;
    const place = [loc.municipality, loc.department].filter(hasText).join(', ');
    const pets = CONFIG.amenities.pets;

    return [
      {
        q: '¿Cómo puedo reservar?',
        a: ['Elige tus fechas en el formulario de consulta y envía el mensaje por WhatsApp. El propietario te confirmará la disponibilidad, el valor final y las condiciones para separar la fecha.', 'Tu estadía solo queda reservada cuando el propietario la confirma directamente contigo.']
      },
      {
        q: '¿Cómo confirmo la disponibilidad?',
        a: ['Esta página no muestra un calendario en tiempo real. La disponibilidad la confirma siempre el propietario por WhatsApp.']
      },
      {
        q: '¿Cuál es la capacidad máxima?',
        a: Number.isInteger(maxGuests) && !maxGuestsProvisional ? [`Refugio Natural recibe hasta ${plural(maxGuests, 'persona', 'personas')}, contando adultos y niños.`] : null
      },
      {
        q: '¿Qué incluye la tarifa?',
        a: services.length ? ['La tarifa incluye:', services] : null
      },
      {
        q: '¿Cuáles son los horarios de llegada y salida?',
        a: hasText(checkInTime) && hasText(checkOutTime) ? [`La llegada es desde las ${checkInTime} y la salida hasta las ${checkOutTime}.`] : null
      },
      {
        q: '¿Se permiten mascotas?',
        a: pets === true ? [hasText(p.pets) ? p.pets : 'Sí, Refugio Natural admite mascotas. Avísale al propietario cuando hagas tu consulta.']
          : pets === false ? ['No, por el momento Refugio Natural no admite mascotas.'] : null
      },
      {
        q: '¿Cómo funcionan los pagos?',
        a: hasText(p.payments) || hasText(p.deposit)
          ? [p.payments, p.deposit, 'Esta página no procesa pagos: acuérdalos únicamente con el propietario.'].filter(hasText)
          : null
      },
      {
        q: '¿Cuál es la política de cancelación?',
        a: hasText(p.cancellation) ? [p.cancellation] : null
      },
      {
        q: '¿Cómo puedo obtener la ubicación?',
        a: place ? [`Refugio Natural está en ${place}. El propietario te enviará la ubicación exacta y las indicaciones al confirmar tu estadía.`] : null
      }
    ];
  }

  function renderFaq() {
    const items = buildFaqItems().map((item, index) => {
      const headingId = `faqHeading${index}`;
      const panelId = `faqPanel${index}`;

      const body = el('div', { className: 'accordion-body' });
      if (item.a) {
        item.a.forEach((part) => {
          body.append(Array.isArray(part)
            ? el('ul', {}, part.map((text) => el('li', { text })))
            : el('p', { text: part }));
        });
      } else {
        body.append(
          el('p', { text: 'El propietario aún no ha publicado esta información. Pregúntale directamente y te responderá por WhatsApp.' }),
          el('button', {
            className: 'faq-ask',
            attrs: { type: 'button' },
            dataset: { wa: 'faq', waQuestion: item.q }
          }, [icon('bi-whatsapp'), el('span', { text: 'Preguntar por WhatsApp' })])
        );
      }

      return el('div', { className: 'accordion-item' }, [
        el('h3', { className: 'accordion-header', attrs: { id: headingId } }, [
          el('button', {
            className: 'accordion-button collapsed',
            text: item.q,
            attrs: { type: 'button', 'data-bs-toggle': 'collapse', 'data-bs-target': `#${panelId}`, 'aria-expanded': 'false', 'aria-controls': panelId }
          })
        ]),
        el('div', {
          className: 'accordion-collapse collapse',
          attrs: { id: panelId, 'aria-labelledby': headingId, 'data-bs-parent': '#faqAccordion' }
        }, [body])
      ]);
    });
    dom.faqAccordion.replaceChildren(...items);
  }

  /* ========================================================================
     9. GESTIÓN DE EVENTOS
     ======================================================================== */
  function syncDateLimits() {
    const today = todayISO();
    const minNights = Number.isInteger(CONFIG.stay.minNights) && CONFIG.stay.minNights > 0 ? CONFIG.stay.minNights : 1;
    dom.checkIn.min = today;
    const base = parseISODate(dom.checkIn.value) !== null && dom.checkIn.value >= today ? dom.checkIn.value : today;
    dom.checkOut.min = addDays(base, minNights);
  }

  function handleCheckInChange() {
    syncDateLimits();
    // Si la salida quedó antes de la nueva llegada, propone la estancia mínima.
    if (dom.checkIn.value && (!dom.checkOut.value || dom.checkOut.value <= dom.checkIn.value)) {
      dom.checkOut.value = dom.checkOut.min;
    }
  }

  let submitLocked = false;
  function handleInquirySubmit(event) {
    event.preventDefault();
    if (submitLocked) return;

    const { values, result, quote } = updateInquiry({ showAll: true });
    if (Object.keys(result.errors).length) {
      setStatus('Revisa los campos marcados para preparar tu consulta.', 'error');
      const firstInvalid = dom.form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    submitLocked = true;
    dom.inquirySubmit.disabled = true;
    window.setTimeout(() => { submitLocked = false; dom.inquirySubmit.disabled = false; }, SUBMIT_COOLDOWN_MS);

    const opened = openWhatsApp(buildInquiryMessage(values, result, quote));
    setStatus(opened
      ? 'Abrimos WhatsApp con tu mensaje. Revísalo y envíalo para hacer tu consulta.'
      : 'Tu mensaje está listo, pero el número de WhatsApp aún no está configurado.', opened ? 'ok' : '');
  }

  function bindFormEvents() {
    const fieldKeys = new Map([
      [dom.checkIn, 'checkIn'], [dom.checkOut, 'checkOut'], [dom.adults, 'adults'],
      [dom.children, 'children'], [dom.guestName, 'guestName']
    ]);
    dom.checkIn.addEventListener('change', handleCheckInChange);

    fieldKeys.forEach((key, input) => {
      input.addEventListener('change', () => { touched.add(key); updateInquiry(); });
      input.addEventListener('blur', () => { if (input.value !== '') { touched.add(key); updateInquiry(); } });
      input.addEventListener('input', () => {
        if (input.type === 'date' || input.type === 'number') touched.add(key);
        updateInquiry();
        if (dom.formStatus.classList.contains('is-error') && !dom.form.querySelector('.is-invalid')) setStatus('', '');
      });
    });
    dom.guestMessage.addEventListener('input', () => updateInquiry());
    dom.form.addEventListener('submit', handleInquirySubmit);
  }

  function bindWhatsAppEvents() {
    // Delegación: cubre también los botones creados dinámicamente (FAQ).
    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-wa]');
      if (!trigger) return;
      event.preventDefault();
      openWhatsApp(messageForTrigger(trigger));
    });
    dom.copyMessageBtn.addEventListener('click', copyPendingMessage);
  }

  function bindGalleryEvents() {
    dom.galleryGrid.addEventListener('click', (event) => {
      const tile = event.target.closest('.gallery__item');
      if (tile) openGallery(Number(tile.dataset.index));
    });
    dom.galleryPrev.addEventListener('click', () => showGalleryPhoto(gallery.index - 1));
    dom.galleryNext.addEventListener('click', () => showGalleryPhoto(gallery.index + 1));
    document.addEventListener('keydown', handleGalleryKeys);
    protectImage(dom.galleryModalImage);
  }

  function bindNavigationEvents() {
    const collapse = bootstrap.Collapse.getOrCreateInstance(dom.navMenu, { toggle: false });
    dom.navMenu.addEventListener('click', (event) => {
      if (event.target.closest('a') && dom.navMenu.classList.contains('show')) collapse.hide();
    });
    // Resalta la sección visible en el menú.
    bootstrap.ScrollSpy.getOrCreateInstance(document.body, { target: '#navMenu', rootMargin: '0px 0px -55%' });
  }

  /* ========================================================================
     10. INICIALIZACIÓN DE LA PÁGINA
     ======================================================================== */
  function renderContent() {
    dom.demoBar.hidden = !CONFIG.demoMode;
    dom.currentYear.textContent = String(new Date().getFullYear());
    document.querySelectorAll('.photo-note').forEach((note) => { note.hidden = !CONFIG.gallery.illustrative; });
    document.querySelectorAll('main img').forEach(protectImage);

    renderGallery();
    renderPropertyFacts();
    renderAmenities();
    renderRates();
    renderCapacityHint();
    renderReviews();
    renderLocation();
    renderContact();
    renderFaq();
    decorateWhatsAppTriggers();
  }

  function init() {
    if (typeof bootstrap === 'undefined') {
      console.error('Refugio Natural: Bootstrap no se cargó. Revisa la conexión a internet.');
      return;
    }
    cacheDom();
    gallery.modal = bootstrap.Modal.getOrCreateInstance(dom.galleryModal);
    pendingModal = bootstrap.Modal.getOrCreateInstance(dom.waPendingModal);

    renderContent();
    syncDateLimits();
    updateInquiry();

    bindFormEvents();
    bindWhatsAppEvents();
    bindGalleryEvents();
    bindNavigationEvents();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
