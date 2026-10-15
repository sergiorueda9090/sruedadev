/* ==========================================================================
   AlquilaYa — lógica de la demostración
   Todo el estado vive en el navegador (LocalStorage). No hay backend.
   ========================================================================== */
'use strict';

(() => {
  /* ========================================================================
     1. DATOS DE PROPIEDADES
     ======================================================================== */
  const unsplash = (id, width = 1200) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=75`;

  const PROPERTIES = [
    {
      id: 'apto-poblado',
      title: 'Loft con terraza en El Poblado',
      type: 'apartamento',
      city: 'Medellín',
      department: 'Antioquia',
      location: 'El Poblado, a 5 minutos del Parque Lleras',
      description: 'Loft luminoso de dos niveles con terraza privada y vista a las montañas del valle de Aburrá. Ideal para escapadas de fin de semana o para trabajar unos días desde la ciudad de la eterna primavera, con cafés, restaurantes y la estación Poblado a poca distancia.',
      pricePerNight: 320000,
      cleaningFee: 60000,
      capacity: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 2,
      rating: 4.9,
      reviewCount: 128,
      featured: true,
      superhost: true,
      petFriendly: false,
      pool: true,
      amenities: ['wifi', 'kitchen', 'ac', 'pool', 'workspace', 'tv', 'hotWater', 'parking'],
      images: [
        { photo: '1502672260266-1c1ef2d93688', alt: 'Sala del loft con sofá claro y ventanales amplios' },
        { photo: '1522708323590-d24dbb6b0267', alt: 'Zona social abierta con comedor y cocina integrada' },
        { photo: '1505693416388-ac5ce068fe85', alt: 'Habitación principal con cama doble y luz natural' }
      ]
    },
    {
      id: 'apto-rodadero',
      title: 'Apartamento frente al mar en El Rodadero',
      type: 'apartamento',
      city: 'Santa Marta',
      department: 'Magdalena',
      location: 'El Rodadero, a una cuadra de la playa',
      description: 'Apartamento fresco y amplio con balcón hacia el mar Caribe. Bajas a la playa en un minuto, tienes piscina en el edificio y quedas a media hora del Parque Tayrona y del centro histórico de Santa Marta.',
      pricePerNight: 280000,
      cleaningFee: 50000,
      capacity: 5,
      bedrooms: 2,
      beds: 3,
      bathrooms: 2,
      rating: 4.7,
      reviewCount: 86,
      featured: false,
      superhost: false,
      petFriendly: false,
      pool: true,
      amenities: ['wifi', 'kitchen', 'ac', 'pool', 'tv', 'parking'],
      images: [
        { photo: '1560448204-e02f11c3d0e2', alt: 'Sala del apartamento con decoración costera' },
        { photo: '1493809842364-78817add7ffb', alt: 'Espacio abierto con muebles de madera y plantas' },
        { photo: '1540518614846-7eded433c457', alt: 'Habitación con cama doble y ropa de cama blanca' }
      ]
    },
    {
      id: 'casa-salento',
      title: 'Casa colonial en Salento',
      type: 'casa',
      city: 'Salento',
      department: 'Quindío',
      location: 'Eje Cafetero, a 10 minutos del Valle del Cocora',
      description: 'Casa de bahareque con balcones de colores, patio interior y chimenea para las noches frescas del Quindío. Caminas a la calle Real y al mirador, y llegas en pocos minutos al Valle del Cocora y sus palmas de cera.',
      pricePerNight: 390000,
      cleaningFee: 70000,
      capacity: 6,
      bedrooms: 3,
      beds: 4,
      bathrooms: 2,
      rating: 4.8,
      reviewCount: 64,
      featured: true,
      superhost: false,
      petFriendly: true,
      pool: false,
      amenities: ['wifi', 'kitchen', 'tv', 'hotWater', 'pets', 'outdoor', 'parking'],
      images: [
        { photo: '1564013799919-ab600027ffc6', alt: 'Fachada de la casa con jardín y entrada amplia' },
        { photo: '1586023492125-27b2c045efd7', alt: 'Sala acogedora con sillones y luz cálida' },
        { photo: '1556909114-f6e7ad7d3136', alt: 'Cocina equipada con isla central' }
      ]
    },
    {
      id: 'casa-barichara',
      title: 'Casa con piscina en Barichara',
      type: 'casa',
      city: 'Barichara',
      department: 'Santander',
      location: 'Centro histórico, a 3 cuadras del parque principal',
      description: 'Casa amplia y luminosa, con techos altos, jardín y piscina rodeada de buganvilias. Perfecta para recorrer el Camino Real hacia Guane y volver a descansar en uno de los pueblos más bonitos de Colombia.',
      pricePerNight: 450000,
      cleaningFee: 80000,
      capacity: 8,
      bedrooms: 4,
      beds: 5,
      bathrooms: 3,
      rating: 4.9,
      reviewCount: 41,
      featured: false,
      superhost: true,
      petFriendly: true,
      pool: true,
      amenities: ['wifi', 'kitchen', 'pool', 'hotWater', 'pets', 'outdoor', 'workspace', 'tv'],
      images: [
        { photo: '1600596542815-ffad4c1539a9', alt: 'Exterior de la casa con piscina y zonas verdes' },
        { photo: '1600607687939-ce8a6c25118c', alt: 'Sala con techos altos y grandes ventanales' },
        { photo: '1600566753190-17f0baa2a6c3', alt: 'Cocina abierta con comedor de madera' }
      ]
    },
    {
      id: 'finca-montenegro',
      title: 'Finca cafetera La Esperanza',
      type: 'finca',
      city: 'Montenegro',
      department: 'Quindío',
      location: 'Eje Cafetero, a 15 minutos del Parque del Café',
      description: 'Finca tradicional entre cafetales con corredores amplios, hamacas, piscina y zona de BBQ. Espacio para que toda la familia se reúna, recorra el cultivo de café y visite el Parque del Café y Panaca.',
      pricePerNight: 650000,
      cleaningFee: 120000,
      capacity: 12,
      bedrooms: 5,
      beds: 8,
      bathrooms: 4,
      rating: 4.8,
      reviewCount: 97,
      featured: true,
      superhost: true,
      petFriendly: true,
      pool: true,
      amenities: ['wifi', 'kitchen', 'pool', 'parking', 'tv', 'hotWater', 'pets', 'outdoor', 'bbq'],
      images: [
        { photo: '1449844908441-8829872d2607', alt: 'Casa de la finca rodeada de vegetación' },
        { photo: '1470770841072-f978cf4d019e', alt: 'Paisaje de montañas y lago cerca de la finca' },
        { photo: '1500382017468-9049fed747ef', alt: 'Campos de cultivo al atardecer' }
      ]
    },
    {
      id: 'finca-santafe',
      title: 'Finca El Tamarindo',
      type: 'finca',
      city: 'Santa Fe de Antioquia',
      department: 'Antioquia',
      location: 'Vereda El Tunal, a 1 hora y media de Medellín',
      description: 'Finca de clima cálido con piscina grande, kiosco con hamacas y amplias zonas verdes. Un plan clásico de puente festivo a hora y media de Medellín, cerca del Puente de Occidente y del centro colonial.',
      pricePerNight: 580000,
      cleaningFee: 100000,
      capacity: 10,
      bedrooms: 4,
      beds: 7,
      bathrooms: 3,
      rating: 4.6,
      reviewCount: 52,
      featured: false,
      superhost: false,
      petFriendly: true,
      pool: true,
      amenities: ['wifi', 'kitchen', 'ac', 'pool', 'parking', 'tv', 'pets', 'outdoor', 'bbq'],
      images: [
        { photo: '1613490493576-7fde63acd811', alt: 'Casa principal de la finca con piscina iluminada' },
        { photo: '1512917774080-9991f1c4c750', alt: 'Vista exterior de la casa con jardín' },
        { photo: '1571896349842-33c89424de2d', alt: 'Piscina con zona de descanso al aire libre' }
      ]
    }
  ];

  /* ========================================================================
     2. CONFIGURACIÓN Y CONSTANTES
     ======================================================================== */
  const STORAGE_KEYS = Object.freeze({
    reservations: 'alquilaya.v1.reservations',
    favorites: 'alquilaya.v1.favorites'
  });

  const PROPERTY_MAP = new Map(PROPERTIES.map((p) => [p.id, p]));

  const TYPE_LABELS = Object.freeze({ apartamento: 'Apartamento', casa: 'Casa', finca: 'Finca' });
  const TYPE_PLURALS = Object.freeze({ apartamento: 'apartamentos', casa: 'casas', finca: 'fincas' });

  const AMENITIES = Object.freeze({
    wifi: { label: 'Wi-Fi', icon: 'bi-wifi' },
    kitchen: { label: 'Cocina equipada', icon: 'bi-egg-fried' },
    ac: { label: 'Aire acondicionado', icon: 'bi-snow' },
    pool: { label: 'Piscina', icon: 'bi-water' },
    parking: { label: 'Parqueadero', icon: 'bi-p-square' },
    workspace: { label: 'Zona de trabajo', icon: 'bi-laptop' },
    tv: { label: 'Televisión', icon: 'bi-tv' },
    hotWater: { label: 'Agua caliente', icon: 'bi-thermometer-sun' },
    pets: { label: 'Admite mascotas', icon: 'bi-house-heart' },
    outdoor: { label: 'Zonas exteriores', icon: 'bi-tree' },
    bbq: { label: 'Zona de BBQ', icon: 'bi-fire' }
  });

  const DEFAULT_FILTERS = Object.freeze({ type: 'all', destination: '', checkIn: '', checkOut: '', guests: 2 });
  const MAX_NIGHTS = 60;
  const MAX_SEARCH_GUESTS = 30;
  const MS_PER_DAY = 86400000;
  const SEARCH_DELAY_MS = 380;
  const BOOKING_DELAY_MS = 550;
  const FORM_DELAY_MS = 650;
  const CANCEL_CONFIRM_MS = 4000;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ========================================================================
     3. UTILIDADES DE FORMATO, FECHAS Y DOM
     ======================================================================== */
  const currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  });
  const dateFormatter = new Intl.DateTimeFormat('es-CO', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'
  });
  const shortDateFormatter = new Intl.DateTimeFormat('es-CO', {
    weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC'
  });
  const ratingFormatter = new Intl.NumberFormat('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  const formatCOP = (value) => currencyFormatter.format(value);
  const pluralize = (n, one, many) => `${n} ${n === 1 ? one : many}`;

  /** Convierte "AAAA-MM-DD" en milisegundos UTC (medianoche). Devuelve null si no es una fecha real. */
  function parseISODate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const [y, m, d] = value.split('-').map(Number);
    const time = Date.UTC(y, m - 1, d);
    const check = new Date(time);
    if (check.getUTCFullYear() !== y || check.getUTCMonth() !== m - 1 || check.getUTCDate() !== d) return null;
    return time;
  }

  const toISODate = (timeUTC) => new Date(timeUTC).toISOString().slice(0, 10);

  /** Fecha local de hoy como "AAAA-MM-DD" (sin horas, inmune a cambios de horario). */
  function todayISO() {
    const now = new Date();
    return toISODate(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  }

  const addDays = (iso, days) => toISODate(parseISODate(iso) + days * MS_PER_DAY);

  /** Noches entre dos fechas de calendario: 10 → 13 son 3 noches. */
  const nightsBetween = (checkIn, checkOut) =>
    Math.round((parseISODate(checkOut) - parseISODate(checkIn)) / MS_PER_DAY);

  const formatDate = (iso) => dateFormatter.format(new Date(parseISODate(iso)));
  const formatShortDate = (iso) => shortDateFormatter.format(new Date(parseISODate(iso)));
  const formatRange = (checkIn, checkOut) => `${formatDate(checkIn)} al ${formatDate(checkOut)}`;

  /** Intervalos semiabiertos [llegada, salida): el día de salida queda libre para otra llegada. */
  const rangesOverlap = (aIn, aOut, bIn, bOut) => aIn < bOut && bIn < aOut;

  /** Minúsculas y sin tildes, para comparar destinos. */
  const normalizeText = (text) =>
    String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

  /** Crea nodos de forma segura: todo el texto se asigna con textContent. */
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
    children.forEach((child) => {
      if (child !== null && child !== undefined && child !== false) node.append(child);
    });
    return node;
  }

  const icon = (name, extraClass = '') =>
    el('i', { className: `bi ${name} ${extraClass}`.trim(), attrs: { 'aria-hidden': 'true' } });

  function renderStars(rating) {
    const label = `Calificación ${ratingFormatter.format(rating)} de 5`;
    const wrapper = el('span', { className: 'stars', attrs: { role: 'img', 'aria-label': label } });
    for (let i = 1; i <= 5; i += 1) {
      let name = 'bi-star';
      if (rating >= i - 0.25) name = 'bi-star-fill';
      else if (rating >= i - 0.75) name = 'bi-star-half';
      wrapper.append(icon(name));
    }
    return wrapper;
  }

  /** Muestra un fondo neutro si una foto de Unsplash no carga. */
  function attachImageFallback(img) {
    img.addEventListener('error', () => {
      const holder = img.parentElement;
      if (holder) holder.classList.add('img-fallback');
    }, { once: true });
  }

  function generateReservationCode(existing) {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const randomChars = () => {
      const bytes = new Uint8Array(6);
      if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(bytes);
      else bytes.forEach((_, i) => { bytes[i] = Math.floor(Math.random() * 256); });
      return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
    };
    const used = new Set(existing.map((r) => r.id));
    let code;
    do { code = `AY-${randomChars()}`; } while (used.has(code));
    return code;
  }

  function scrollToElement(element) {
    element.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  }

  function setButtonLoading(button, isLoading, loadingText) {
    if (isLoading) {
      button.dataset.originalLabel = button.textContent.trim();
      button.disabled = true;
      button.classList.add('is-loading');
      button.replaceChildren(
        el('span', { className: 'spinner-border spinner-border-sm', attrs: { 'aria-hidden': 'true' } }),
        el('span', { text: loadingText || 'Procesando...' })
      );
    } else {
      button.disabled = false;
      button.classList.remove('is-loading');
      button.replaceChildren(el('span', { className: 'btn-label', text: button.dataset.originalLabel || '' }));
    }
  }

  /* ========================================================================
     4. PERSISTENCIA EN LOCALSTORAGE
     ======================================================================== */
  const storage = {
    read(key, fallback) {
      try {
        const raw = window.localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (error) {
        console.warn(`AlquilaYa: no se pudo leer "${key}".`, error);
        return fallback;
      }
    },
    write(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.warn(`AlquilaYa: no se pudo guardar "${key}".`, error);
        return false;
      }
    }
  };

  function isValidReservation(r) {
    return Boolean(r) && typeof r === 'object'
      && typeof r.id === 'string' && /^AY-[A-Z0-9]{6}$/.test(r.id)
      && PROPERTY_MAP.has(r.propertyId)
      && parseISODate(r.checkIn) !== null
      && parseISODate(r.checkOut) !== null
      && r.checkIn < r.checkOut
      && Number.isInteger(r.guests) && r.guests >= 1
      && Number.isInteger(r.nights) && r.nights === nightsBetween(r.checkIn, r.checkOut)
      && Number.isFinite(r.total) && r.total > 0;
  }

  function loadReservations() {
    const data = storage.read(STORAGE_KEYS.reservations, []);
    if (!Array.isArray(data)) return [];
    const seen = new Set();
    return data.filter((r) => {
      if (!isValidReservation(r) || seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });
  }

  const saveReservations = (list) => storage.write(STORAGE_KEYS.reservations, list);

  function loadFavorites() {
    const data = storage.read(STORAGE_KEYS.favorites, []);
    if (!Array.isArray(data)) return new Set();
    return new Set(data.filter((id) => typeof id === 'string' && PROPERTY_MAP.has(id)));
  }

  const saveFavorites = (set) => storage.write(STORAGE_KEYS.favorites, Array.from(set));

  /* ========================================================================
     ESTADO Y REFERENCIAS AL DOM
     ======================================================================== */
  const state = {
    reservations: [],
    favorites: new Set(),
    filters: { ...DEFAULT_FILTERS },
    onlyFavorites: false,
    activePropertyId: null,
    focusBookingOnOpen: false,
    isBooking: false,
    seededBlocks: []
  };

  const modalFocus = { returnTo: null, switching: false };
  let dom = {};

  function cacheDom() {
    const $ = (id) => document.getElementById(id);
    dom = {
      searchForm: $('searchForm'),
      searchType: $('searchType'),
      searchDestination: $('searchDestination'),
      searchCheckIn: $('searchCheckIn'),
      searchCheckOut: $('searchCheckOut'),
      searchGuests: $('searchGuests'),
      searchError: $('searchError'),
      searchSubmitBtn: $('searchSubmitBtn'),
      catalogSection: $('propiedades'),
      catalogTitle: $('catalogTitle'),
      grid: $('propertyGrid'),
      resultsCount: $('resultsCount'),
      activeFilters: $('activeFilters'),
      emptyState: $('emptyState'),
      emptyStateText: $('emptyStateText'),
      emptyResetBtn: $('emptyResetBtn'),
      resetFiltersBtn: $('resetFiltersBtn'),
      favoritesToggle: $('favoritesToggle'),
      typeChips: Array.from(document.querySelectorAll('.type-chips .chip')),
      // modal de propiedad
      propertyModal: $('propertyModal'),
      pmTitle: $('pmTitle'),
      pmLocation: $('pmLocation'),
      pmMainImage: $('pmMainImage'),
      pmThumbs: $('pmThumbs'),
      pmRating: $('pmRating'),
      pmFacts: $('pmFacts'),
      pmDescription: $('pmDescription'),
      pmAmenities: $('pmAmenities'),
      pmPolicies: $('pmPolicies'),
      pmBlocked: $('pmBlocked'),
      pmPrice: $('pmPrice'),
      bookingForm: $('bookingForm'),
      bookCheckIn: $('bookCheckIn'),
      bookCheckOut: $('bookCheckOut'),
      bookGuests: $('bookGuests'),
      bookGuestsHint: $('bookGuestsHint'),
      bkNights: $('bkNights'),
      bkPrice: $('bkPrice'),
      bkSubtotal: $('bkSubtotal'),
      bkSubtotalLabel: $('bkSubtotalLabel'),
      bkCleaning: $('bkCleaning'),
      bkTotal: $('bkTotal'),
      bookingFeedback: $('bookingFeedback'),
      confirmBookingBtn: $('confirmBookingBtn'),
      // confirmación
      confirmationModal: $('confirmationModal'),
      cfCode: $('cfCode'),
      cfProperty: $('cfProperty'),
      cfDates: $('cfDates'),
      cfNights: $('cfNights'),
      cfGuests: $('cfGuests'),
      cfTotal: $('cfTotal'),
      cfViewReservations: $('cfViewReservations'),
      // mis reservas
      reservationsModal: $('reservationsModal'),
      reservationsList: $('reservationsList'),
      reservationsEmpty: $('reservationsEmpty'),
      reservationsBadge: $('reservationsBadge'),
      exploreFromReservations: $('exploreFromReservations'),
      // formularios auxiliares
      loginForm: $('loginForm'),
      publishForm: $('publishForm'),
      contactForm: $('contactForm'),
      // otros
      navMenu: $('navMenu'),
      backToTop: $('backToTop'),
      toastContainer: $('toastContainer'),
      currentYear: $('currentYear')
    };
  }

  const getModal = (element) => bootstrap.Modal.getOrCreateInstance(element);

  /** Abre un modal desde JavaScript recordando qué elemento debe recuperar el foco. */
  function showModal(element, trigger) {
    if (trigger) modalFocus.returnTo = trigger;
    getModal(element).show();
  }

  /** Cierra un modal y abre otro cuando el primero termina de ocultarse (Bootstrap no apila modales). */
  function switchModal(fromElement, toElement) {
    if (!fromElement.classList.contains('show')) {
      getModal(toElement).show();
      return;
    }
    modalFocus.switching = true;
    fromElement.addEventListener('hidden.bs.modal', () => {
      getModal(toElement).show();
      window.setTimeout(() => { modalFocus.switching = false; }, 0);
    }, { once: true });
    getModal(fromElement).hide();
  }

  function restoreFocusAfterModal() {
    if (modalFocus.switching || document.querySelector('.modal.show')) return;
    const target = modalFocus.returnTo;
    modalFocus.returnTo = null;
    if (!target) return;
    if (document.body.contains(target)) target.focus();
    else dom.catalogTitle.focus();
  }

  function showToast(message, variant = 'success') {
    const icons = { success: 'bi-check-circle-fill', error: 'bi-exclamation-octagon-fill', info: 'bi-info-circle-fill' };
    const toast = el('div', {
      className: `toast ay-toast ay-toast--${variant}`,
      attrs: { role: variant === 'error' ? 'alert' : 'status', 'aria-atomic': 'true' }
    }, [
      el('div', { className: 'd-flex' }, [
        el('div', { className: 'toast-body' }, [icon(icons[variant] || icons.info), el('span', { text: message })]),
        el('button', {
          className: 'btn-close me-2 m-auto',
          attrs: { type: 'button', 'data-bs-dismiss': 'toast', 'aria-label': 'Cerrar notificación' }
        })
      ])
    ]);
    dom.toastContainer.append(toast);
    toast.addEventListener('hidden.bs.toast', () => toast.remove(), { once: true });
    bootstrap.Toast.getOrCreateInstance(toast, { delay: 5000 }).show();
  }

  function renderResultBox(container, variant, message) {
    const icons = { success: 'bi-check-circle-fill', error: 'bi-exclamation-octagon-fill', info: 'bi-info-circle-fill' };
    container.replaceChildren(
      el('div', { className: `result-box result-box--${variant}` }, [icon(icons[variant]), el('p', { className: 'mb-0', text: message })])
    );
  }

  /* ========================================================================
     DISPONIBILIDAD SIMULADA
     ======================================================================== */

  /** Fechas ya ocupadas "por otros huéspedes", relativas a hoy para que la demo siempre tenga ejemplos. */
  function buildSeededBlocks(today) {
    return [
      { propertyId: 'finca-montenegro', checkIn: addDays(today, 5), checkOut: addDays(today, 9) },
      { propertyId: 'apto-poblado', checkIn: addDays(today, 12), checkOut: addDays(today, 15) },
      { propertyId: 'casa-barichara', checkIn: addDays(today, 2), checkOut: addDays(today, 4) },
      { propertyId: 'finca-santafe', checkIn: addDays(today, 20), checkOut: addDays(today, 23) }
    ];
  }

  function getBlockedRanges(propertyId) {
    const external = state.seededBlocks
      .filter((b) => b.propertyId === propertyId)
      .map((b) => ({ checkIn: b.checkIn, checkOut: b.checkOut, mine: false }));
    const mine = state.reservations
      .filter((r) => r.propertyId === propertyId)
      .map((r) => ({ checkIn: r.checkIn, checkOut: r.checkOut, mine: true, id: r.id }));
    return [...external, ...mine].sort((a, b) => a.checkIn.localeCompare(b.checkIn));
  }

  const findConflict = (propertyId, checkIn, checkOut) =>
    getBlockedRanges(propertyId).find((r) => rangesOverlap(checkIn, checkOut, r.checkIn, r.checkOut)) || null;

  /* ========================================================================
     5. RENDERIZADO DE TARJETAS
     ======================================================================== */
  function getCardBadge(property) {
    if (property.superhost) return { text: 'Superanfitrión', icon: 'bi-award-fill' };
    if (property.featured) return { text: 'Destacado', icon: 'bi-stars' };
    if (property.rating >= 4.8) return { text: 'Favorito', icon: 'bi-heart-fill' };
    return null;
  }

  function createFavoriteButton(property) {
    const isFav = state.favorites.has(property.id);
    const button = el('button', {
      className: 'fav-btn',
      attrs: { type: 'button', 'aria-pressed': String(isFav), 'aria-label': `Guardar ${property.title} en favoritos` },
      dataset: { action: 'favorite', id: property.id }
    }, [icon(isFav ? 'bi-heart-fill' : 'bi-heart')]);
    return button;
  }

  function createPropertyCard(property) {
    const badge = getCardBadge(property);
    const cover = property.images[0];

    const img = el('img', {
      attrs: { src: unsplash(cover.photo, 800), alt: cover.alt, loading: 'lazy', width: 800, height: 600 }
    });
    attachImageFallback(img);

    const media = el('div', { className: 'property-card__media' }, [
      img,
      badge ? el('span', { className: 'card-badge' }, [icon(badge.icon), el('span', { text: badge.text })]) : null,
      createFavoriteButton(property)
    ]);

    const specs = el('ul', { className: 'spec-list', attrs: { 'aria-label': 'Capacidad' } }, [
      el('li', {}, [icon('bi-people'), el('span', { text: pluralize(property.capacity, 'huésped', 'huéspedes') })]),
      el('li', {}, [icon('bi-door-closed'), el('span', { text: pluralize(property.bedrooms, 'habitación', 'habitaciones') })]),
      el('li', {}, [icon('bi-droplet'), el('span', { text: pluralize(property.bathrooms, 'baño', 'baños') })])
    ]);

    const features = el('div', { className: 'feature-tags' }, [
      property.pool
        ? el('span', { className: 'feature-tag' }, [icon('bi-water'), el('span', { text: 'Piscina' })])
        : el('span', { className: 'feature-tag feature-tag--muted' }, [icon('bi-dash-circle'), el('span', { text: 'Sin piscina' })]),
      property.petFriendly
        ? el('span', { className: 'feature-tag feature-tag--green' }, [icon('bi-house-heart'), el('span', { text: 'Pet-friendly' })])
        : el('span', { className: 'feature-tag feature-tag--muted' }, [icon('bi-slash-circle'), el('span', { text: 'No admite mascotas' })])
    ]);

    const body = el('div', { className: 'property-card__body' }, [
      el('div', { className: 'card-topline' }, [
        el('span', { className: 'type-label', text: TYPE_LABELS[property.type] }),
        el('span', { className: 'rating-inline' }, [
          renderStars(property.rating),
          el('span', { text: ratingFormatter.format(property.rating) }),
          el('small', { text: `(${property.reviewCount})` })
        ])
      ]),
      el('h3', { className: 'property-card__title', text: property.title }),
      el('p', { className: 'property-card__location' }, [icon('bi-geo-alt'), el('span', { text: `${property.city}, ${property.department}` })]),
      specs,
      features,
      el('div', { className: 'property-card__footer' }, [
        el('p', { className: 'price' }, [el('strong', { text: formatCOP(property.pricePerNight) }), el('span', { text: 'por noche' })]),
        el('div', { className: 'card-actions' }, [
          el('button', {
            className: 'btn btn-outline-brand',
            text: 'Ver detalles',
            attrs: { type: 'button', 'aria-label': `Ver detalles de ${property.title}` },
            dataset: { action: 'details', id: property.id }
          }),
          el('button', {
            className: 'btn btn-brand',
            text: 'Reservar',
            attrs: { type: 'button', 'aria-label': `Reservar ${property.title}` },
            dataset: { action: 'book', id: property.id }
          })
        ])
      ])
    ]);

    const article = el('article', { className: 'property-card', attrs: { 'aria-label': property.title } }, [media, body]);
    return el('div', { className: 'col-12 col-md-6 col-lg-4' }, [article]);
  }

  function renderSkeletons(count = 3) {
    const skeletons = Array.from({ length: count }, () =>
      el('div', { className: 'col-12 col-md-6 col-lg-4', attrs: { 'aria-hidden': 'true' } }, [
        el('div', { className: 'skeleton-card' }, [
          el('div', { className: 'sk-media' }),
          el('div', { className: 'sk-line w-70' }),
          el('div', { className: 'sk-line' }),
          el('div', { className: 'sk-line' })
        ])
      ])
    );
    dom.grid.setAttribute('aria-busy', 'true');
    dom.emptyState.hidden = true;
    dom.grid.replaceChildren(...skeletons);
    dom.resultsCount.textContent = 'Buscando alojamientos...';
  }

  function renderCatalog() {
    const results = filterProperties(state.filters);
    dom.grid.setAttribute('aria-busy', 'false');
    dom.grid.replaceChildren(...results.map(createPropertyCard));

    const count = results.length;
    dom.resultsCount.textContent = count === 0
      ? 'Sin resultados'
      : `${pluralize(count, 'alojamiento disponible', 'alojamientos disponibles')}`;

    dom.emptyState.hidden = count !== 0;
    if (count === 0) {
      dom.emptyStateText.textContent = state.onlyFavorites && state.favorites.size === 0
        ? 'Todavía no has guardado favoritos. Toca el corazón de un alojamiento para guardarlo aquí.'
        : 'Prueba con otras fechas, menos huéspedes o un destino diferente.';
    }
    renderActiveFilters();
  }

  function renderActiveFilters() {
    const f = state.filters;
    const parts = [];
    if (f.type !== 'all') parts.push(TYPE_PLURALS[f.type]);
    if (f.destination) parts.push(`en «${f.destination}»`);
    if (f.checkIn && f.checkOut) parts.push(`del ${formatRange(f.checkIn, f.checkOut)}`);
    if (f.guests !== DEFAULT_FILTERS.guests) parts.push(`para ${pluralize(f.guests, 'huésped', 'huéspedes')}`);
    if (state.onlyFavorites) parts.push('solo favoritos');
    dom.activeFilters.hidden = parts.length === 0;
    dom.activeFilters.textContent = parts.length ? `Mostrando ${parts.join(', ')}.` : '';
  }

  /* ========================================================================
     6. BÚSQUEDA Y FILTROS
     ======================================================================== */
  function filterProperties(filters) {
    const query = normalizeText(filters.destination);
    const hasDates = Boolean(filters.checkIn && filters.checkOut);
    return PROPERTIES.filter((p) => {
      if (filters.type !== 'all' && p.type !== filters.type) return false;
      if (query) {
        const haystack = normalizeText(`${p.city} ${p.department} ${p.location} ${p.title}`);
        if (!haystack.includes(query)) return false;
      }
      if (p.capacity < filters.guests) return false;
      if (hasDates && findConflict(p.id, filters.checkIn, filters.checkOut)) return false;
      if (state.onlyFavorites && !state.favorites.has(p.id)) return false;
      return true;
    });
  }

  function setFieldError(input, errorElement, message) {
    input.classList.toggle('is-invalid', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (errorElement) errorElement.textContent = message || '';
  }

  const errorElementFor = (input) => document.getElementById(`${input.id}Error`);

  function readSearchForm() {
    return {
      type: dom.searchType.value,
      destination: dom.searchDestination.value.trim(),
      checkIn: dom.searchCheckIn.value,
      checkOut: dom.searchCheckOut.value,
      guestsRaw: dom.searchGuests.value.trim()
    };
  }

  function validateSearch(values) {
    const errors = {};
    const today = todayISO();
    const guests = Number(values.guestsRaw);

    if (values.checkIn && parseISODate(values.checkIn) === null) errors.checkIn = 'Fecha de llegada no válida.';
    else if (values.checkIn && values.checkIn < today) errors.checkIn = 'La llegada no puede ser anterior a hoy.';

    if (values.checkOut && parseISODate(values.checkOut) === null) errors.checkOut = 'Fecha de salida no válida.';

    if (values.checkIn && !values.checkOut && !errors.checkIn) errors.checkOut = 'Elige también la fecha de salida.';
    if (!values.checkIn && values.checkOut) errors.checkIn = 'Elige también la fecha de llegada.';

    if (values.checkIn && values.checkOut && !errors.checkIn && !errors.checkOut && values.checkOut <= values.checkIn) {
      errors.checkOut = 'La salida debe ser posterior a la llegada.';
    }

    if (values.guestsRaw === '' || !Number.isInteger(guests) || guests < 1) errors.guests = 'Indica al menos 1 huésped.';
    else if (guests > MAX_SEARCH_GUESTS) errors.guests = `Máximo ${MAX_SEARCH_GUESTS} huéspedes por búsqueda.`;

    return { errors, guests };
  }

  function showSearchErrors(errors) {
    setFieldError(dom.searchCheckIn, errorElementFor(dom.searchCheckIn), errors.checkIn);
    setFieldError(dom.searchCheckOut, errorElementFor(dom.searchCheckOut), errors.checkOut);
    setFieldError(dom.searchGuests, errorElementFor(dom.searchGuests), errors.guests);
    const messages = Object.values(errors);
    dom.searchError.hidden = messages.length === 0;
    dom.searchError.textContent = messages.length ? `Revisa la búsqueda: ${messages.join(' ')}` : '';
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    if (dom.searchSubmitBtn.disabled) return;

    const values = readSearchForm();
    const { errors, guests } = validateSearch(values);
    showSearchErrors(errors);
    if (Object.keys(errors).length) {
      const firstInvalid = dom.searchForm.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    state.filters = {
      type: values.type,
      destination: values.destination,
      checkIn: values.checkIn,
      checkOut: values.checkOut,
      guests
    };
    syncTypeChips();

    setButtonLoading(dom.searchSubmitBtn, true, 'Buscando...');
    renderSkeletons(3);
    scrollToElement(dom.catalogSection);

    window.setTimeout(() => {
      renderCatalog();
      setButtonLoading(dom.searchSubmitBtn, false);
      dom.searchSubmitBtn.prepend(icon('bi-search'));
    }, SEARCH_DELAY_MS);
  }

  function syncTypeChips() {
    dom.typeChips.forEach((chip) => {
      const active = chip.dataset.type === state.filters.type;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', String(active));
    });
  }

  function handleTypeChip(event) {
    const chip = event.target.closest('.chip[data-type]');
    if (!chip) return;
    state.filters.type = chip.dataset.type;
    dom.searchType.value = chip.dataset.type;
    syncTypeChips();
    renderCatalog();
  }

  function syncFavoritesToggle() {
    dom.favoritesToggle.setAttribute('aria-pressed', String(state.onlyFavorites));
    const toggleIcon = dom.favoritesToggle.querySelector('i');
    toggleIcon.className = `bi ${state.onlyFavorites ? 'bi-heart-fill' : 'bi-heart'}`;
  }

  function resetFilters() {
    dom.searchForm.reset();
    showSearchErrors({});
    state.filters = { ...DEFAULT_FILTERS };
    state.onlyFavorites = false;
    syncTypeChips();
    syncFavoritesToggle();
    syncDateMins(dom.searchCheckIn, dom.searchCheckOut);
    renderCatalog();
    showToast('Filtros restablecidos. Ves todos los alojamientos.', 'info');
  }

  /* ========================================================================
     7. GESTIÓN DE FAVORITOS
     ======================================================================== */
  function toggleFavorite(propertyId, button) {
    const property = PROPERTY_MAP.get(propertyId);
    if (!property) return;

    const willBeFavorite = !state.favorites.has(propertyId);
    if (willBeFavorite) state.favorites.add(propertyId);
    else state.favorites.delete(propertyId);

    if (!saveFavorites(state.favorites)) {
      showToast('No pudimos guardar tus favoritos en este navegador. Seguirán marcados hasta que recargues.', 'error');
    }

    if (state.onlyFavorites) {
      renderCatalog();
    } else if (button) {
      button.setAttribute('aria-pressed', String(willBeFavorite));
      button.replaceChildren(icon(willBeFavorite ? 'bi-heart-fill' : 'bi-heart'));
      button.classList.remove('is-popping');
      void button.offsetWidth; // reinicia la animación
      button.classList.add('is-popping');
    }
    showToast(willBeFavorite ? `Guardado en favoritos: ${property.title}.` : `Quitado de favoritos: ${property.title}.`, 'info');
  }

  function handleGridClick(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const { action, id } = button.dataset;
    if (!PROPERTY_MAP.has(id)) return;

    if (action === 'favorite') toggleFavorite(id, button);
    if (action === 'details') openPropertyModal(id, { trigger: button, focusBooking: false });
    if (action === 'book') openPropertyModal(id, { trigger: button, focusBooking: true });
  }

  /* ========================================================================
     8. MODAL DE DETALLES
     ======================================================================== */
  function renderGallery(property) {
    const setMain = (index) => {
      const image = property.images[index];
      dom.pmMainImage.classList.remove('is-swapping');
      void dom.pmMainImage.offsetWidth;
      dom.pmMainImage.classList.add('is-swapping');
      dom.pmMainImage.src = unsplash(image.photo);
      dom.pmMainImage.alt = image.alt;
      dom.pmThumbs.querySelectorAll('.thumb-btn').forEach((thumb, i) => {
        thumb.setAttribute('aria-current', String(i === index));
      });
    };

    const thumbs = property.images.map((image, index) => {
      const thumbImg = el('img', {
        attrs: { src: unsplash(image.photo, 240), alt: '', loading: 'lazy', width: 96, height: 72 }
      });
      const btn = el('button', {
        className: 'thumb-btn',
        attrs: { type: 'button', 'aria-label': `Ver foto ${index + 1} de ${property.images.length}: ${image.alt}`, 'aria-current': String(index === 0) }
      }, [thumbImg]);
      btn.addEventListener('click', () => setMain(index));
      return btn;
    });

    dom.pmMainImage.parentElement.classList.remove('img-fallback');
    dom.pmMainImage.src = unsplash(property.images[0].photo);
    dom.pmMainImage.alt = property.images[0].alt;
    dom.pmThumbs.replaceChildren(...thumbs);
  }

  function renderPropertyFacts(property) {
    const fact = (iconName, value, label) =>
      el('li', {}, [icon(iconName), el('strong', { text: String(value) }), el('span', { text: label })]);
    dom.pmFacts.replaceChildren(
      fact('bi-people', property.capacity, property.capacity === 1 ? 'huésped máx.' : 'huéspedes máx.'),
      fact('bi-door-closed', property.bedrooms, property.bedrooms === 1 ? 'habitación' : 'habitaciones'),
      fact('bi-moon-stars', property.beds, property.beds === 1 ? 'cama' : 'camas'),
      fact('bi-droplet', property.bathrooms, property.bathrooms === 1 ? 'baño' : 'baños')
    );
  }

  function renderAmenities(property) {
    const items = property.amenities
      .filter((key) => AMENITIES[key])
      .map((key) => el('li', {}, [icon(AMENITIES[key].icon), el('span', { text: AMENITIES[key].label })]));
    dom.pmAmenities.replaceChildren(...items);
  }

  function renderPolicies(property) {
    const policy = (ok, iconOk, textOk, textNo) =>
      el('li', { className: ok ? 'policy-yes' : 'policy-no' }, [icon(ok ? iconOk : 'bi-x-circle'), el('span', { text: ok ? textOk : textNo })]);
    dom.pmPolicies.replaceChildren(
      policy(property.pool, 'bi-check-circle-fill', 'Tiene piscina para uso de los huéspedes.', 'No tiene piscina.'),
      policy(property.petFriendly, 'bi-check-circle-fill', 'Admite mascotas. Avisa al anfitrión al reservar.', 'No se admiten mascotas.'),
      el('li', { className: 'policy-yes' }, [icon('bi-clock'), el('span', { text: 'Llegada desde las 3:00 p. m. y salida hasta las 11:00 a. m.' })])
    );
  }

  function renderBlockedDates(property) {
    const today = todayISO();
    const upcoming = getBlockedRanges(property.id).filter((r) => r.checkOut > today);
    if (upcoming.length === 0) {
      dom.pmBlocked.replaceChildren(el('li', {}, [icon('bi-calendar-check'), el('span', { text: 'Sin fechas ocupadas próximamente.' })]));
      return;
    }
    dom.pmBlocked.replaceChildren(...upcoming.map((r) =>
      el('li', { className: r.mine ? 'is-mine' : '' }, [
        icon(r.mine ? 'bi-calendar-check-fill' : 'bi-calendar-x'),
        el('span', { text: `${formatRange(r.checkIn, r.checkOut)}${r.mine ? ' (tu reserva de prueba)' : ' (ocupado)'}` })
      ])
    ));
  }

  function fillPropertyModal(property) {
    dom.pmTitle.textContent = property.title;
    dom.pmLocation.textContent = `${property.location}. ${property.city}, ${property.department}`;
    renderGallery(property);

    dom.pmRating.replaceChildren(
      el('span', { className: 'rating-inline' }, [
        renderStars(property.rating),
        el('span', { text: ratingFormatter.format(property.rating) }),
        el('small', { text: `${property.reviewCount} reseñas` })
      ]),
      property.superhost ? el('span', { className: 'feature-tag feature-tag--green' }, [icon('bi-award-fill'), el('span', { text: 'Superanfitrión' })]) : null,
      property.featured ? el('span', { className: 'feature-tag' }, [icon('bi-stars'), el('span', { text: 'Destacado' })]) : null
    );

    renderPropertyFacts(property);
    dom.pmDescription.textContent = property.description;
    renderAmenities(property);
    renderPolicies(property);
    renderBlockedDates(property);
    dom.pmPrice.textContent = formatCOP(property.pricePerNight);
  }

  function prepareBookingForm(property) {
    const today = todayISO();
    const f = state.filters;
    const searchDatesUsable = f.checkIn && f.checkOut && f.checkIn >= today
      && !findConflict(property.id, f.checkIn, f.checkOut);

    dom.bookingForm.reset();
    dom.bookCheckIn.value = searchDatesUsable ? f.checkIn : '';
    dom.bookCheckOut.value = searchDatesUsable ? f.checkOut : '';
    dom.bookGuests.value = String(Math.min(Math.max(f.guests, 1), property.capacity));
    dom.bookGuests.max = String(property.capacity);
    dom.bookGuestsHint.textContent = `Máximo ${pluralize(property.capacity, 'huésped', 'huéspedes')}.`;
    syncDateMins(dom.bookCheckIn, dom.bookCheckOut);

    [dom.bookCheckIn, dom.bookCheckOut, dom.bookGuests].forEach((input) => setFieldError(input, errorElementFor(input), ''));
    state.isBooking = false;
    dom.confirmBookingBtn.disabled = false;
    updateBookingQuote({ showAll: false });
  }

  function openPropertyModal(propertyId, { trigger = null, focusBooking = false } = {}) {
    const property = PROPERTY_MAP.get(propertyId);
    if (!property) return;
    state.activePropertyId = propertyId;
    state.focusBookingOnOpen = focusBooking;
    fillPropertyModal(property);
    prepareBookingForm(property);
    showModal(dom.propertyModal, trigger);
  }

  function handlePropertyModalShown() {
    const body = dom.propertyModal.querySelector('.modal-body');
    if (state.focusBookingOnOpen) {
      dom.bookingForm.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
      const target = dom.bookCheckIn.value ? dom.confirmBookingBtn : dom.bookCheckIn;
      target.focus({ preventScroll: true });
    } else {
      body.scrollTop = 0;
    }
  }

  /* ========================================================================
     9. CALCULADORA DE RESERVAS
     ======================================================================== */
  function readBookingForm() {
    return {
      checkIn: dom.bookCheckIn.value,
      checkOut: dom.bookCheckOut.value,
      guestsRaw: dom.bookGuests.value.trim()
    };
  }

  /**
   * Evalúa la reserva y devuelve errores por campo, un error general (solapamiento)
   * y la cotización cuando todo es válido.
   */
  function evaluateBooking(property, values) {
    const errors = {};
    const today = todayISO();
    const guests = Number(values.guestsRaw);

    if (!values.checkIn) errors.checkIn = 'Selecciona la fecha de llegada.';
    else if (parseISODate(values.checkIn) === null) errors.checkIn = 'Fecha de llegada no válida.';
    else if (values.checkIn < today) errors.checkIn = 'La llegada no puede ser anterior a hoy.';

    if (!values.checkOut) errors.checkOut = 'Selecciona la fecha de salida.';
    else if (parseISODate(values.checkOut) === null) errors.checkOut = 'Fecha de salida no válida.';
    else if (values.checkIn && !errors.checkIn && values.checkOut <= values.checkIn) {
      errors.checkOut = 'La salida debe ser posterior a la llegada.';
    }

    if (values.guestsRaw === '' || !Number.isInteger(guests) || guests < 1) {
      errors.guests = 'Indica al menos 1 huésped.';
    } else if (guests > property.capacity) {
      errors.guests = `Este alojamiento admite máximo ${pluralize(property.capacity, 'huésped', 'huéspedes')}.`;
    }

    let generalError = '';
    let nights = 0;
    if (!errors.checkIn && !errors.checkOut) {
      nights = nightsBetween(values.checkIn, values.checkOut);
      if (nights > MAX_NIGHTS) {
        errors.checkOut = `La estancia máxima en esta demostración es de ${MAX_NIGHTS} noches.`;
      } else {
        const conflict = findConflict(property.id, values.checkIn, values.checkOut);
        if (conflict) {
          generalError = conflict.mine
            ? `Ya tienes una reserva de prueba aquí del ${formatRange(conflict.checkIn, conflict.checkOut)}. Elige otras fechas.`
            : `Estas fechas se cruzan con una estadía ocupada del ${formatRange(conflict.checkIn, conflict.checkOut)}. Elige otras fechas.`;
        }
      }
    }

    const ok = Object.keys(errors).length === 0 && !generalError;
    const datesOk = !errors.checkIn && !errors.checkOut && nights > 0;
    const quote = datesOk ? buildQuote(property, nights) : null;
    return { ok, errors, generalError, quote, guests, values };
  }

  /** Total = (noches × precio por noche) + tarifa de limpieza. */
  function buildQuote(property, nights) {
    const subtotal = nights * property.pricePerNight;
    return {
      nights,
      pricePerNight: property.pricePerNight,
      subtotal,
      cleaningFee: property.cleaningFee,
      total: subtotal + property.cleaningFee
    };
  }

  function renderQuote(property, quote) {
    dom.bkPrice.textContent = formatCOP(property.pricePerNight);
    dom.bkCleaning.textContent = formatCOP(property.cleaningFee);
    if (!quote) {
      dom.bkNights.textContent = '—';
      dom.bkSubtotal.textContent = '—';
      dom.bkSubtotalLabel.textContent = 'Subtotal del alojamiento';
      dom.bkTotal.textContent = '—';
      return;
    }
    dom.bkNights.textContent = pluralize(quote.nights, 'noche', 'noches');
    dom.bkSubtotalLabel.textContent = `Subtotal (${quote.nights} × ${formatCOP(quote.pricePerNight)})`;
    dom.bkSubtotal.textContent = formatCOP(quote.subtotal);
    dom.bkTotal.textContent = formatCOP(quote.total);
  }

  function setBookingFeedback(message, tone) {
    dom.bookingFeedback.textContent = message;
    dom.bookingFeedback.classList.toggle('is-error', tone === 'error');
    dom.bookingFeedback.classList.toggle('is-ok', tone === 'ok');
  }

  /**
   * Recalcula y muestra errores. Con showAll=false solo marca campos que ya tienen valor,
   * para no llenar de rojo un formulario recién abierto.
   */
  function updateBookingQuote({ showAll }) {
    const property = PROPERTY_MAP.get(state.activePropertyId);
    if (!property) return null;
    const result = evaluateBooking(property, readBookingForm());

    // Las fechas vacías solo se marcan al intentar confirmar; los huéspedes vienen precargados.
    const dateError = (input, message) => (showAll || input.value !== '' ? message : '');
    setFieldError(dom.bookCheckIn, errorElementFor(dom.bookCheckIn), dateError(dom.bookCheckIn, result.errors.checkIn));
    setFieldError(dom.bookCheckOut, errorElementFor(dom.bookCheckOut), dateError(dom.bookCheckOut, result.errors.checkOut));
    setFieldError(dom.bookGuests, errorElementFor(dom.bookGuests), result.errors.guests);

    renderQuote(property, result.generalError ? null : result.quote);

    if (result.generalError) {
      setBookingFeedback(result.generalError, 'error');
    } else if (result.ok) {
      setBookingFeedback(`Fechas disponibles: ${pluralize(result.quote.nights, 'noche', 'noches')} por ${formatCOP(result.quote.total)} en total.`, 'ok');
    } else if (showAll) {
      setBookingFeedback('Revisa los campos marcados para confirmar la reserva.', 'error');
    } else if (!dom.bookCheckIn.value || !dom.bookCheckOut.value) {
      setBookingFeedback('Elige tus fechas para ver el total de la estadía.', '');
    } else {
      setBookingFeedback('Corrige los campos marcados para poder confirmar.', 'error');
    }
    return result;
  }

  /* ========================================================================
     10. VALIDACIÓN Y CONFIRMACIÓN
     ======================================================================== */
  function handleConfirmBooking(event) {
    event.preventDefault();
    if (state.isBooking) return; // evita dobles envíos

    const property = PROPERTY_MAP.get(state.activePropertyId);
    if (!property) return;

    const result = updateBookingQuote({ showAll: true });
    if (!result || !result.ok) {
      const firstInvalid = dom.bookingForm.querySelector('.is-invalid');
      (firstInvalid || dom.bookCheckIn).focus();
      return;
    }

    state.isBooking = true;
    setButtonLoading(dom.confirmBookingBtn, true, 'Confirmando...');

    window.setTimeout(() => {
      try {
        finalizeReservation(property, result);
      } finally {
        state.isBooking = false;
        setButtonLoading(dom.confirmBookingBtn, false);
      }
    }, BOOKING_DELAY_MS);
  }

  function finalizeReservation(property, result) {
    // Releemos LocalStorage: otra pestaña pudo reservar las mismas fechas mientras tanto.
    state.reservations = loadReservations();
    const { checkIn, checkOut } = result.values;
    const conflict = findConflict(property.id, checkIn, checkOut);
    if (conflict) {
      setBookingFeedback(`Otra reserva tomó estas fechas (${formatRange(conflict.checkIn, conflict.checkOut)}) mientras confirmabas. Elige otras fechas.`, 'error');
      renderBlockedDates(property);
      renderCatalog();
      updateReservationsBadge();
      return;
    }

    const quote = buildQuote(property, nightsBetween(checkIn, checkOut));
    const reservation = {
      id: generateReservationCode(state.reservations),
      propertyId: property.id,
      checkIn,
      checkOut,
      guests: result.guests,
      nights: quote.nights,
      pricePerNight: quote.pricePerNight,
      cleaningFee: quote.cleaningFee,
      subtotal: quote.subtotal,
      total: quote.total,
      createdAt: new Date().toISOString()
    };

    const next = [...state.reservations, reservation];
    if (!saveReservations(next)) {
      setBookingFeedback('No pudimos guardar la reserva en este navegador (almacenamiento lleno o bloqueado). Intenta de nuevo.', 'error');
      showToast('La reserva no se guardó. Revisa que tu navegador permita el almacenamiento local.', 'error');
      return;
    }

    state.reservations = next;
    renderCatalog();
    updateReservationsBadge();
    fillConfirmation(reservation, property);
    modalFocus.returnTo = modalFocus.returnTo && document.body.contains(modalFocus.returnTo) ? modalFocus.returnTo : dom.catalogTitle;
    switchModal(dom.propertyModal, dom.confirmationModal);
  }

  function fillConfirmation(reservation, property) {
    dom.cfCode.textContent = reservation.id;
    dom.cfProperty.textContent = property.title;
    dom.cfDates.textContent = `${formatShortDate(reservation.checkIn)} al ${formatShortDate(reservation.checkOut)}`;
    dom.cfNights.textContent = pluralize(reservation.nights, 'noche', 'noches');
    dom.cfGuests.textContent = pluralize(reservation.guests, 'huésped', 'huéspedes');
    dom.cfTotal.textContent = formatCOP(reservation.total);
  }

  /* ========================================================================
     11. GESTIÓN DE MIS RESERVAS
     ======================================================================== */
  function updateReservationsBadge() {
    const today = todayISO();
    const upcoming = state.reservations.filter((r) => r.checkOut >= today).length;
    dom.reservationsBadge.hidden = upcoming === 0;
    dom.reservationsBadge.textContent = String(upcoming);
    dom.reservationsBadge.setAttribute('aria-label', `${upcoming} próximas`);
  }

  function createReservationItem(reservation) {
    const property = PROPERTY_MAP.get(reservation.propertyId);
    const isPast = reservation.checkOut < todayISO();
    const thumb = el('img', {
      className: 'reservation__img',
      attrs: { src: unsplash(property.images[0].photo, 240), alt: property.images[0].alt, loading: 'lazy', width: 112, height: 112 }
    });

    const cancelBtn = el('button', {
      className: 'btn btn-danger-soft',
      attrs: { type: 'button', 'aria-label': `Cancelar la reserva ${reservation.id}` },
      dataset: { action: 'cancel', id: reservation.id }
    }, [icon('bi-x-circle'), el('span', { text: isPast ? 'Eliminar del historial' : 'Cancelar reserva' })]);

    return el('li', { className: 'reservation' }, [
      thumb,
      el('div', {}, [
        el('div', { className: 'reservation__head' }, [
          el('h3', { className: 'reservation__title', text: property.title }),
          el('span', { className: 'reservation__code' }, [
            el('span', { text: reservation.id }),
            el('span', { className: `status-pill ${isPast ? 'status-pill--past' : ''}`, text: isPast ? 'Finalizada' : 'Confirmada' })
          ])
        ]),
        el('p', { className: 'reservation__meta', text: `${property.city}, ${property.department}` }),
        el('div', { className: 'reservation__details' }, [
          el('span', {}, [el('strong', { text: 'Fechas: ' }), el('span', { text: formatRange(reservation.checkIn, reservation.checkOut) })]),
          el('span', {}, [el('strong', { text: 'Noches: ' }), el('span', { text: String(reservation.nights) })]),
          el('span', {}, [el('strong', { text: 'Huéspedes: ' }), el('span', { text: String(reservation.guests) })]),
          el('span', {}, [el('strong', { text: 'Total: ' }), el('span', { text: formatCOP(reservation.total) })])
        ]),
        el('div', { className: 'reservation__actions' }, [
          el('button', {
            className: 'btn btn-outline-brand',
            attrs: { type: 'button' },
            dataset: { action: 'view', id: reservation.propertyId }
          }, [icon('bi-house'), el('span', { text: 'Ver alojamiento' })]),
          cancelBtn
        ])
      ])
    ]);
  }

  function renderReservationsList() {
    const sorted = [...state.reservations].sort((a, b) => a.checkIn.localeCompare(b.checkIn));
    dom.reservationsList.replaceChildren(...sorted.map(createReservationItem));
    dom.reservationsEmpty.hidden = sorted.length > 0;
  }

  function cancelReservation(reservationId) {
    const latest = loadReservations();
    const target = latest.find((r) => r.id === reservationId);
    if (!target) {
      state.reservations = latest;
      renderReservationsList();
      showToast('Esa reserva ya no existe en este navegador.', 'info');
      return;
    }
    const next = latest.filter((r) => r.id !== reservationId);
    if (!saveReservations(next)) {
      showToast('No pudimos cancelar la reserva: el almacenamiento local no respondió.', 'error');
      return;
    }
    state.reservations = next;
    renderReservationsList();
    renderCatalog();
    updateReservationsBadge();
    showToast(`Reserva ${reservationId} cancelada. Esas fechas vuelven a estar disponibles.`, 'success');
    const firstAction = dom.reservationsList.querySelector('button') || dom.exploreFromReservations;
    firstAction.focus();
  }

  /** Cancelar pide un segundo clic de confirmación para evitar cancelaciones accidentales. */
  function handleReservationsClick(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const { action, id } = button.dataset;

    if (action === 'view' && PROPERTY_MAP.has(id)) {
      state.activePropertyId = id;
      state.focusBookingOnOpen = false;
      fillPropertyModal(PROPERTY_MAP.get(id));
      prepareBookingForm(PROPERTY_MAP.get(id));
      modalFocus.returnTo = dom.catalogTitle;
      switchModal(dom.reservationsModal, dom.propertyModal);
      return;
    }

    if (action === 'cancel') {
      if (button.classList.contains('is-confirming')) {
        window.clearTimeout(Number(button.dataset.timer));
        cancelReservation(id);
        return;
      }
      button.classList.add('is-confirming');
      const label = button.querySelector('span');
      const originalText = label.textContent;
      label.textContent = 'Toca otra vez para confirmar';
      const timer = window.setTimeout(() => {
        button.classList.remove('is-confirming');
        label.textContent = originalText;
      }, CANCEL_CONFIRM_MS);
      button.dataset.timer = String(timer);
    }
  }

  /* ========================================================================
     12. FORMULARIOS AUXILIARES (acceso, publicar, contacto)
     ======================================================================== */
  /**
   * Valida con la API nativa del navegador + estilos de Bootstrap,
   * simula una breve espera y muestra un resultado honesto sobre lo que ocurrió.
   */
  function setupDemoForm(form, { onSuccess, resetOnSuccess = true }) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const resultBox = form.querySelector('.form-result');

    form.addEventListener('input', (event) => {
      const field = event.target;
      if (typeof field.setCustomValidity === 'function') field.setCustomValidity('');
      if (form.classList.contains('was-validated')) field.setAttribute('aria-invalid', String(!field.checkValidity()));
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (submitBtn.disabled) return;

      // Evita valores de solo espacios en campos de texto obligatorios.
      form.querySelectorAll('input[type="text"], textarea').forEach((field) => {
        field.setCustomValidity(field.required && field.value.trim() === '' && field.value !== '' ? 'Campo vacío' : '');
      });

      form.classList.add('was-validated');
      form.querySelectorAll('input, select, textarea').forEach((field) => {
        field.setAttribute('aria-invalid', String(!field.checkValidity()));
      });

      if (!form.checkValidity()) {
        renderResultBox(resultBox, 'error', 'Revisa los campos marcados en rojo.');
        const firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      resultBox.replaceChildren();
      setButtonLoading(submitBtn, true, submitBtn.dataset.loadingText);
      window.setTimeout(() => {
        setButtonLoading(submitBtn, false);
        const message = onSuccess(form);
        if (resetOnSuccess) {
          form.reset();
          form.classList.remove('was-validated');
          form.querySelectorAll('[aria-invalid]').forEach((field) => field.removeAttribute('aria-invalid'));
        }
        renderResultBox(resultBox, 'success', message);
      }, FORM_DELAY_MS);
    });
  }

  function resetDemoForm(form) {
    form.reset();
    form.classList.remove('was-validated');
    form.querySelectorAll('[aria-invalid]').forEach((field) => field.removeAttribute('aria-invalid'));
    const resultBox = form.querySelector('.form-result');
    if (resultBox) resultBox.replaceChildren();
  }

  function setupAuxiliaryForms() {
    setupDemoForm(dom.loginForm, {
      onSuccess: () => {
        dom.loginForm.querySelector('#loginPassword').value = '';
        return 'Los datos tienen un formato válido, pero esta es una demostración local: no se inició sesión, no existe ninguna cuenta y tu contraseña no se guardó.';
      },
      resetOnSuccess: false
    });

    setupDemoForm(dom.publishForm, {
      onSuccess: (form) => {
        const city = form.querySelector('#pubCity').value.trim();
        return `Propuesta revisada para ${city}. Como es una demostración, la propiedad no se publicó ni se envió a ningún servidor.`;
      }
    });

    setupDemoForm(dom.contactForm, {
      onSuccess: (form) => {
        const name = form.querySelector('#contactName').value.trim().split(/\s+/)[0];
        return `Gracias, ${name}. Tu mensaje pasó la validación, pero es una simulación: no se envió ningún correo.`;
      }
    });

    document.getElementById('loginModal').addEventListener('hidden.bs.modal', () => resetDemoForm(dom.loginForm));
    document.getElementById('publishModal').addEventListener('hidden.bs.modal', () => resetDemoForm(dom.publishForm));
  }

  /* ========================================================================
     13. INICIALIZACIÓN DE EVENTOS
     ======================================================================== */

  /** Mantiene min de llegada = hoy y min de salida = llegada + 1 día. */
  function syncDateMins(checkInInput, checkOutInput) {
    const today = todayISO();
    checkInInput.min = today;
    const base = checkInInput.value && parseISODate(checkInInput.value) !== null && checkInInput.value >= today
      ? checkInInput.value
      : today;
    checkOutInput.min = addDays(base, 1);
  }

  function bindSearchEvents() {
    dom.searchForm.addEventListener('submit', handleSearchSubmit);
    dom.searchCheckIn.addEventListener('change', () => {
      syncDateMins(dom.searchCheckIn, dom.searchCheckOut);
      // Si la salida quedó antes de la nueva llegada, se propone la noche siguiente.
      if (dom.searchCheckIn.value && (!dom.searchCheckOut.value || dom.searchCheckOut.value <= dom.searchCheckIn.value)) {
        dom.searchCheckOut.value = addDays(dom.searchCheckIn.value, 1);
      }
    });
    [dom.searchCheckIn, dom.searchCheckOut, dom.searchGuests].forEach((input) => {
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) setFieldError(input, errorElementFor(input), '');
        if (!dom.searchForm.querySelector('.is-invalid')) showSearchErrors({});
      });
    });

    document.querySelector('.type-chips').addEventListener('click', handleTypeChip);
    dom.favoritesToggle.addEventListener('click', () => {
      state.onlyFavorites = !state.onlyFavorites;
      syncFavoritesToggle();
      renderCatalog();
    });
    dom.resetFiltersBtn.addEventListener('click', resetFilters);
    dom.emptyResetBtn.addEventListener('click', () => {
      resetFilters();
      dom.catalogTitle.focus();
    });
    dom.grid.addEventListener('click', handleGridClick);
  }

  function bindBookingEvents() {
    dom.bookingForm.addEventListener('submit', handleConfirmBooking);
    dom.bookCheckIn.addEventListener('change', () => {
      syncDateMins(dom.bookCheckIn, dom.bookCheckOut);
      if (dom.bookCheckIn.value && dom.bookCheckOut.value && dom.bookCheckOut.value <= dom.bookCheckIn.value) {
        dom.bookCheckOut.value = addDays(dom.bookCheckIn.value, 1);
      }
    });
    ['input', 'change'].forEach((type) => {
      [dom.bookCheckIn, dom.bookCheckOut, dom.bookGuests].forEach((input) => {
        input.addEventListener(type, () => updateBookingQuote({ showAll: false }));
      });
    });

    dom.propertyModal.addEventListener('shown.bs.modal', handlePropertyModalShown);
    dom.propertyModal.addEventListener('hidden.bs.modal', () => { state.activePropertyId = state.isBooking ? state.activePropertyId : null; });
    attachImageFallback(dom.pmMainImage);
    dom.pmMainImage.addEventListener('load', () => dom.pmMainImage.parentElement.classList.remove('img-fallback'));
  }

  function bindReservationEvents() {
    dom.reservationsModal.addEventListener('show.bs.modal', () => {
      state.reservations = loadReservations();
      renderReservationsList();
    });
    dom.reservationsList.addEventListener('click', handleReservationsClick);
    dom.exploreFromReservations.addEventListener('click', () => {
      dom.reservationsModal.addEventListener('hidden.bs.modal', () => scrollToElement(dom.catalogSection), { once: true });
      getModal(dom.reservationsModal).hide();
    });
    dom.cfViewReservations.addEventListener('click', () => switchModal(dom.confirmationModal, dom.reservationsModal));

    // Sincroniza cambios hechos en otra pestaña del mismo navegador.
    window.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEYS.reservations) {
        state.reservations = loadReservations();
        renderCatalog();
        updateReservationsBadge();
        if (dom.reservationsModal.classList.contains('show')) renderReservationsList();
        if (state.activePropertyId && dom.propertyModal.classList.contains('show')) {
          renderBlockedDates(PROPERTY_MAP.get(state.activePropertyId));
          updateBookingQuote({ showAll: false });
        }
      }
      if (event.key === STORAGE_KEYS.favorites) {
        state.favorites = loadFavorites();
        renderCatalog();
      }
    });
  }

  function bindNavigationEvents() {
    // Cierra el menú móvil al elegir una sección.
    const collapse = bootstrap.Collapse.getOrCreateInstance(dom.navMenu, { toggle: false });
    dom.navMenu.addEventListener('click', (event) => {
      const isNavAction = event.target.closest('a.nav-link, .nav-actions .btn');
      if (isNavAction && dom.navMenu.classList.contains('show')) collapse.hide();
    });

    const toggleBackToTop = () => { dom.backToTop.hidden = window.scrollY < 600; };
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();
    dom.backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
      document.querySelector('.brand').focus({ preventScroll: true });
    });

    document.addEventListener('hidden.bs.modal', restoreFocusAfterModal);
  }

  function init() {
    if (typeof bootstrap === 'undefined') {
      console.error('AlquilaYa: Bootstrap no se cargó. Revisa tu conexión a internet.');
      return;
    }
    cacheDom();
    state.seededBlocks = buildSeededBlocks(todayISO());
    state.reservations = loadReservations();
    state.favorites = loadFavorites();

    dom.currentYear.textContent = String(new Date().getFullYear());
    syncDateMins(dom.searchCheckIn, dom.searchCheckOut);

    bindSearchEvents();
    bindBookingEvents();
    bindReservationEvents();
    bindNavigationEvents();
    setupAuxiliaryForms();

    renderCatalog();
    updateReservationsBadge();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
