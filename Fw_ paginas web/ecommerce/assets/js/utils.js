/* ==========================================================================
   ESSENCE & TIME — Utilidades compartidas
   ========================================================================== */
(function (ET) {
  'use strict';

  const copFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });

  const utils = {
    /** Formatea un entero COP. Valores no válidos se muestran como $ 0. */
    formatCOP(value) {
      const n = Number.isFinite(value) ? Math.round(value) : 0;
      return copFormatter.format(n);
    },

    /** Entero dentro de [min, max]; devuelve `fallback` si no es numérico. */
    clampInt(value, min, max, fallback = min) {
      const n = Number.parseInt(value, 10);
      if (!Number.isFinite(n)) return fallback;
      return Math.min(max, Math.max(min, n));
    },

    /** Minúsculas sin tildes ni diacríticos, para búsquedas. */
    normalize(str) {
      return String(str ?? '')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9ñ\s.-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    },

    /** Escapa texto para interpolarlo en plantillas HTML. */
    esc(str) {
      return String(str ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
      }[c]));
    },

    $(sel, root = document) { return root.querySelector(sel); },
    $$(sel, root = document) { return Array.from(root.querySelectorAll(sel)); },

    debounce(fn, wait = 160) {
      let t;
      return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
    },

    params() { return new URLSearchParams(window.location.search); },

    /** Plural sencillo en español. */
    plural(n, one, many) { return `${n} ${n === 1 ? one : many}`; },

    /** Página actual (nombre de archivo), para aria-current. */
    currentPage() {
      const file = window.location.pathname.split('/').pop();
      return file === '' ? 'index.html' : file;
    },

    /** Crea un elemento desde una cadena HTML (un único nodo raíz). */
    html(str) {
      const t = document.createElement('template');
      t.innerHTML = str.trim();
      return t.content.firstElementChild;
    },

    /** Referencia de pedido legible: ET-AAMMDD-XXXX. */
    orderRef() {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const bytes = new Uint8Array(3);
      (window.crypto || {}).getRandomValues ? crypto.getRandomValues(bytes) : bytes.forEach((_, i) => { bytes[i] = Math.random() * 255; });
      const code = Array.from(bytes, (b) => b.toString(36).padStart(2, '0')).join('').slice(0, 5).toUpperCase();
      return `ET-${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${code}`;
    },

    prefersReducedMotion() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    emit(name, detail) { document.dispatchEvent(new CustomEvent(name, { detail })); },
  };

  ET.utils = utils;
})(window.ET);
