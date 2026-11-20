/* =====================================================================
   OXI SMART INGENIERÍA — Información corporativa (fuente única)
   ---------------------------------------------------------------------
   Todo dato de contacto del sitio y de los PDF sale de aquí.
   Regla: un campo en null = "pendiente de aprobación" y NO se muestra.
   No escriba datos que el cliente no haya confirmado.
   ===================================================================== */
window.OXI = window.OXI || {};

window.OXI.company = {
  nombre: "Oxi Smart Ingeniería",
  nombreCorto: "Oxi Smart",
  lema: "Ingeniería e innovación para el crecimiento de la acuicultura",
  descripcion:
    "Soluciones y equipos especializados para optimizar los procesos de producción piscícola mediante tecnología, ingeniería y sistemas de oxigenación.",

  // Presentación corporativa (página Empresa y PDF). Texto descriptivo, sin cifras ni afirmaciones sin confirmar.
  presentacion: [
    "Oxi Smart Ingeniería trabaja en ingeniería aplicada a la acuicultura y la piscicultura: equipos y soluciones para que el agua de los estanques y tanques tenga el oxígeno y la circulación que la producción necesita.",
    "Acompañamos a productores de peces en la selección de aireadores, sistemas de oxigenación, tanques y accesorios, según el tipo de cultivo, el tamaño de las unidades productivas y la energía disponible en la finca."
  ],
  mision: null, // PENDIENTE: texto aprobado por el cliente
  vision: null, // PENDIENTE

  // ---------------- Contacto ----------------
  // WhatsApp en formato internacional SIN "+", espacios ni guiones. Ej.: "573001234567"
  whatsapp: null, // PENDIENTE — mientras sea null los botones abren WhatsApp para elegir el contacto
  telefono: null, // PENDIENTE — texto para mostrar. Ej.: "+57 300 123 4567"
  email: null, // PENDIENTE
  ciudad: null, // PENDIENTE. Ej.: "Villavicencio, Meta"
  direccion: null, // PENDIENTE
  pais: "Colombia",
  horario: null, // PENDIENTE. Ej.: "Lunes a sábado, 7:00 a. m. – 6:00 p. m."
  mapaEmbedUrl: null, // PENDIENTE: URL "embed" de Google Maps

  // Dominio definitivo (sin "/" final). Lo usan canonical, Open Graph, sitemap y JSON-LD.
  // Tras cambiarlo ejecute:  node tools/build-seo.js
  sitioWeb: "https://www.oxismartingenieria.com", // PENDIENTE DE CONFIRMAR

  redes: {
    tiktok: "https://www.tiktok.com/@oxismartingenieri",
    facebook: null,
    instagram: null,
    youtube: null
  },

  // Testimonios: solo reales y autorizados. Vacío = la sección no aparece.
  // Formato: { nombre: "", cargo: "", empresa: "", ciudad: "", texto: "" }
  testimonios: [],

  // ---------------- Medición ----------------
  analytics: {
    ga4Id: null, // Ej.: "G-XXXXXXXXXX" — al definirlo, main.js carga GA4 automáticamente
    searchConsole: null // código de verificación; se inserta con node tools/build-seo.js
  },

  // ---------------- Catálogo ----------------
  moneda: "COP",
  catalogo: {
    titulo: "Catálogo de equipos",
    edicion: "2026",
    notaPrecios:
      "Precios en pesos colombianos (COP). Sujetos a cambio sin previo aviso y a confirmación en la cotización formal. No incluyen transporte ni instalación salvo que se indique.",
    productosPorPagina: 9
  }
};
