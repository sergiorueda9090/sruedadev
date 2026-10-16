/* ==========================================================================
   ESSENCE & TIME — Configuración central
   Todo dato de marca, comercial o de negocio se edita aquí.
   Regla: los valores `null` o listas vacías NO se muestran en la interfaz.
   Nunca se rellenan con datos inventados (teléfonos, direcciones, NIT, redes).
   ========================================================================== */
(function (global) {
  'use strict';

  const deepFreeze = (obj) => {
    Object.values(obj).forEach((v) => {
      if (v && typeof v === 'object' && !Object.isFrozen(v)) deepFreeze(v);
    });
    return Object.freeze(obj);
  };

  const CONFIG = {
    brand: {
      name: 'Essence & Time',
      logoText: { first: 'Essence', joiner: '&', second: 'Time' },
      tagline: 'Fragancias y relojes para elegir sin prisa',
      description:
        'Tienda multimarca de perfumes, lociones y relojes. Selección curada, precios claros y una compra sin sorpresas.',
      legalName: null,   // Razón social — pendiente de definir
      taxId: null,       // NIT — pendiente de definir
      foundedYear: null,
    },

    // Franja superior. Mensaje neutro: sin promesas de envío gratis ni descuentos.
    topbar: {
      enabled: true,
      message: 'Descubre tu próxima fragancia favorita',
      link: { label: 'Ver novedades', href: 'novedades.html' },
    },

    // Datos de contacto: se muestran solo si tienen valor.
    contact: {
      email: null,       // p. ej. 'hola@dominio.co'
      phone: null,       // formato E.164, p. ej. '+57...'
      whatsapp: null,
      address: null,
      hours: null,       // p. ej. 'Lunes a viernes, 9:00 a 18:00'
    },

    // Redes sociales: añadir objetos { network, label, url, icon } (Bootstrap Icons).
    // Ejemplo: { network: 'instagram', label: 'Instagram', url: 'https://...', icon: 'bi-instagram' }
    social: [],

    locale: {
      lang: 'es-CO',
      currency: 'COP',
      country: 'CO',
    },

    /* ---- Envío: regla configurable ---------------------------------------
       Tarifas de DEMOSTRACIÓN por zona según el departamento de entrega.
       `freeShippingFrom: null` desactiva el envío gratis (no se anuncia).    */
    shipping: {
      isDemo: true,
      currency: 'COP',
      freeShippingFrom: null,
      zones: [
        { id: 'local',    label: 'Bogotá D.C.',              departments: ['Bogotá D.C.'], rate: 12000, eta: null },
        { id: 'regional', label: 'Cundinamarca y Antioquia', departments: ['Cundinamarca', 'Antioquia'], rate: 16000, eta: null },
        { id: 'national', label: 'Resto del país',           departments: '*', rate: 22000, eta: null },
      ],
      // eta: null → la interfaz muestra «Plazo por confirmar». No se inventan tiempos.
      methods: [
        { id: 'domicilio', label: 'Envío a domicilio', description: 'Tarifa según el departamento de entrega.', usesZoneRate: true, surcharge: 0 },
      ],
    },

    // Departamentos de Colombia (para el formulario de entrega)
    departments: [
      'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C.', 'Bolívar', 'Boyacá', 'Caldas',
      'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía',
      'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño', 'Norte de Santander',
      'Putumayo', 'Quindío', 'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre',
      'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada',
    ],

    // Medios de pago: solo representaciones visuales, ninguno está conectado.
    payments: {
      connected: false,
      methods: [
        { id: 'pse',          label: 'PSE (no conectado)',                icon: 'bi-bank' },
        { id: 'tarjeta',      label: 'Tarjeta (no conectado)',            icon: 'bi-credit-card' },
        { id: 'contraentrega', label: 'Pago contra entrega (no conectado)', icon: 'bi-cash-coin' },
      ],
    },

    // Políticas comerciales: null = pendiente de aprobación; la interfaz lo indica.
    policies: {
      returnsWindowDays: null,   // Plazo de retracto/cambios aprobado por el negocio
      watchWarranty: null,       // p. ej. '12 meses de garantía del fabricante'
      exchangeConditions: null,
      trackingAvailable: false,
    },

    /* ---- Cupones de demostración -----------------------------------------
       type: 'percent' (value = %), 'fixed' (value = COP enteros).
       El descuento nunca supera el subtotal elegible (sin totales negativos). */
    coupons: [
      { code: 'BIENVENIDA10', type: 'percent', value: 10,    minSubtotal: 0,      maxDiscount: 80000,  appliesTo: null,        expiresAt: '2027-12-31', description: '10 % de descuento (demo)' },
      { code: 'REGALO40',     type: 'fixed',   value: 40000, minSubtotal: 350000, maxDiscount: null,   appliesTo: null,        expiresAt: '2027-12-31', description: '$ 40.000 en compras desde $ 350.000 (demo)' },
      { code: 'RELOJ15',      type: 'percent', value: 15,    minSubtotal: 0,      maxDiscount: 150000, appliesTo: ['relojes'], expiresAt: '2027-12-31', description: '15 % en relojes (demo)' },
      { code: 'VERANO25',     type: 'percent', value: 20,    minSubtotal: 0,      maxDiscount: null,   appliesTo: null,        expiresAt: '2025-08-31', description: 'Campaña finalizada (demo de cupón expirado)' },
    ],

    /* ---- Taxonomía del catálogo ------------------------------------------ */
    categories: [
      {
        slug: 'perfumes', label: 'Perfumes', page: 'perfumes.html',
        intro: 'Eaux de parfum y eaux de toilette para el día, la noche y lo que haya entre ambos.',
        subcategories: [
          { slug: 'mujer',  label: 'Para ella' },
          { slug: 'hombre', label: 'Para él' },
          { slug: 'unisex', label: 'Unisex' },
        ],
      },
      {
        slug: 'lociones', label: 'Lociones', page: 'lociones.html',
        intro: 'Lociones corporales, body mist y fragancias ligeras para la rutina diaria.',
        subcategories: [
          { slug: 'corporal',  label: 'Lociones corporales' },
          { slug: 'body-mist', label: 'Body mist' },
          { slug: 'ligera',    label: 'Fragancias ligeras' },
          { slug: 'set',       label: 'Sets de cuidado y regalo' },
        ],
      },
      {
        slug: 'relojes', label: 'Relojes', page: 'relojes.html',
        intro: 'Relojes de cuarzo y automáticos con esferas legibles y correas para el uso diario.',
        subcategories: [
          { slug: 'hombre', label: 'Para él' },
          { slug: 'mujer',  label: 'Para ella' },
          { slug: 'unisex', label: 'Unisex' },
        ],
      },
      {
        slug: 'regalos', label: 'Regalos', page: 'regalos.html',
        intro: 'Sets de fragancia y accesorios listos para regalar.',
        subcategories: [
          { slug: 'sets',        label: 'Sets de fragancia' },
          { slug: 'accesorios',  label: 'Accesorios' },
        ],
      },
    ],

    // Momentos de uso: atributo propio de la tienda para descubrir productos.
    moments: [
      { slug: 'dia',      label: 'De día' },
      { slug: 'noche',    label: 'De noche' },
      { slug: 'oficina',  label: 'Para la oficina' },
      { slug: 'ocasion',  label: 'Ocasión especial' },
    ],

    // Colecciones de regalo: filtros temáticos sobre el catálogo existente
    occasions: [
      { slug: 'cumpleanos',  label: 'Cumpleaños' },
      { slug: 'aniversario', label: 'Aniversarios' },
      { slug: 'celebracion', label: 'Celebraciones' },
      { slug: 'sorpresa',    label: 'Detalles para sorprender' },
    ],

    // Rangos de presupuesto (COP) ajustados a los precios del catálogo
    budgets: [
      { slug: 'hasta-250', label: 'Hasta $ 250.000',          min: 0,      max: 250000 },
      { slug: '250-500',   label: '$ 250.000 a $ 500.000',    min: 250001, max: 500000 },
      { slug: '500-900',   label: '$ 500.000 a $ 900.000',    min: 500001, max: 900000 },
      { slug: 'desde-900', label: 'Más de $ 900.000',         min: 900001, max: null },
    ],

    catalog: {
      pageSize: 12,
      lowStockThreshold: 3,
      maxQtyPerLine: 10,
      sortOptions: [
        { value: 'featured',   label: 'Relevancia' },
        { value: 'newest',     label: 'Más recientes' },
        { value: 'price-asc',  label: 'Precio: menor a mayor' },
        { value: 'price-desc', label: 'Precio: mayor a menor' },
        { value: 'name-asc',   label: 'Nombre: A a Z' },
      ],
    },

    seo: {
      siteUrl: null,          // Dominio definitivo, p. ej. 'https://www.dominio.co' → activa canonical
      titleSuffix: 'Essence & Time',
      defaultImage: 'assets/images/hero/og-default.jpg',
      structuredData: false,  // Product JSON-LD desactivado: catálogo conceptual, sin datos reales
    },

    storage: {
      namespace: 'et',
      version: 1,
    },

    demo: {
      enabled: true,
      notice:
        'Tienda de demostración. Los productos son conceptuales, no se procesan pagos y los pedidos no se envían.',
    },
  };

  global.ET = global.ET || {};
  global.ET.config = deepFreeze(CONFIG);
})(window);
