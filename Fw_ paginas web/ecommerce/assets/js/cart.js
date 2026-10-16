/* ==========================================================================
   ESSENCE & TIME — Carrito (única fuente de lógica de carrito)
   Estado persistido: { lines: [{ pid, vid, qty }], coupon: 'CODIGO' | null }
   Los precios NUNCA se guardan: se leen del catálogo en cada cálculo.
   Evento global: 'et:cart-change' con { reason, cart }.
   ========================================================================== */
(function (ET) {
  'use strict';

  const KEY = 'cart';
  const { config, catalog, storage, utils } = ET;
  const MAX_LINE = config.catalog.maxQtyPerLine;

  let state = { lines: [], coupon: null };
  const notices = []; // ajustes detectados al sanear (stock reducido, productos retirados)

  /* ---- Saneamiento ------------------------------------------------------ */
  function sanitize(raw) {
    const clean = { lines: [], coupon: null };
    if (!raw || typeof raw !== 'object') return clean;

    const seen = new Map();
    (Array.isArray(raw.lines) ? raw.lines : []).forEach((l) => {
      if (!l || typeof l !== 'object') return;
      const product = catalog.byId(String(l.pid));
      const variant = product && catalog.variant(product, String(l.vid));
      if (!product || !variant) {
        notices.push({ type: 'removed', message: 'Retiramos de tu carrito un producto que ya no está en el catálogo.' });
        return;
      }
      const key = `${product.id}:${variant.id}`;
      let qty = utils.clampInt(l.qty, 1, MAX_LINE, 1) + (seen.get(key) || 0);
      const limit = Math.min(variant.stock, MAX_LINE);
      if (variant.stock > 0 && qty > limit) {
        qty = limit;
        notices.push({ type: 'adjusted', message: `Ajustamos la cantidad de ${product.name} a las unidades disponibles.` });
      }
      seen.set(key, Math.min(qty, MAX_LINE));
    });

    seen.forEach((qty, key) => {
      const [pid, vid] = key.split(':');
      clean.lines.push({ pid, vid, qty });
    });

    if (typeof raw.coupon === 'string' && raw.coupon.length <= 40) clean.coupon = raw.coupon.toUpperCase();
    return clean;
  }

  function load() {
    state = sanitize(storage.get(KEY));
  }

  function save(reason) {
    storage.set(KEY, state);
    utils.emit('et:cart-change', { reason, cart: api });
  }

  function findLine(pid, vid) {
    return state.lines.find((l) => l.pid === pid && l.vid === vid);
  }

  /* ---- Cupones ---------------------------------------------------------- */
  function findCoupon(code) {
    const c = String(code || '').trim().toUpperCase();
    return config.coupons.find((cp) => cp.code === c) || null;
  }

  function isExpired(coupon) {
    if (!coupon.expiresAt) return false;
    const end = new Date(`${coupon.expiresAt}T23:59:59-05:00`); // hora de Colombia
    return Date.now() > end.getTime();
  }

  /** Evalúa un cupón contra las líneas válidas. Nunca devuelve descuentos negativos ni mayores al elegible. */
  function evaluateCoupon(coupon, detailedLines, subtotal) {
    if (!coupon) return { discount: 0, issue: null };
    if (isExpired(coupon)) return { discount: 0, issue: 'expired' };

    const eligible = detailedLines
      .filter((l) => !l.issue && (!coupon.appliesTo || coupon.appliesTo.includes(l.product.category)))
      .reduce((sum, l) => sum + l.lineTotal, 0);

    if (eligible <= 0) return { discount: 0, issue: 'not-eligible' };
    if (subtotal < (coupon.minSubtotal || 0)) {
      return { discount: 0, issue: 'min-subtotal', missing: coupon.minSubtotal - subtotal };
    }

    let discount = coupon.type === 'percent'
      ? Math.round((eligible * coupon.value) / 100)
      : Math.round(coupon.value);
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    discount = Math.max(0, Math.min(discount, eligible));
    return { discount, issue: null };
  }

  function couponMessage(coupon, result) {
    if (!coupon) return 'Ese código no existe. Revisa que esté bien escrito.';
    switch (result.issue) {
      case 'expired':      return `El código ${coupon.code} expiró y ya no se puede usar.`;
      case 'not-eligible': return `El código ${coupon.code} no aplica a los productos de tu carrito.`;
      case 'min-subtotal': return `Te faltan ${utils.formatCOP(result.missing)} para usar ${coupon.code}.`;
      default:             return `Código ${coupon.code} aplicado: ${coupon.description}.`;
    }
  }

  /* ---- Envío ------------------------------------------------------------ */
  function zoneById(id) {
    return config.shipping.zones.find((z) => z.id === id) || null;
  }

  function zoneForDepartment(dep) {
    if (!dep) return null;
    return config.shipping.zones.find((z) => Array.isArray(z.departments) && z.departments.includes(dep))
      || config.shipping.zones.find((z) => z.departments === '*')
      || null;
  }

  /* ---- API pública ------------------------------------------------------ */
  const api = {
    notices,

    /** Añade unidades. Devuelve { ok, qty, error }. No duplica líneas. */
    add(pid, vid, qty = 1) {
      const product = catalog.byId(pid);
      const variant = product && catalog.variant(product, vid);
      if (!product || !variant) return { ok: false, error: 'Este producto no está disponible.' };

      const wanted = utils.clampInt(qty, 1, MAX_LINE, NaN);
      if (!Number.isFinite(wanted)) return { ok: false, error: `Elige una cantidad entre 1 y ${MAX_LINE}.` };
      if (variant.stock <= 0) return { ok: false, error: 'Esta presentación está agotada.' };

      const line = findLine(product.id, variant.id);
      const current = line ? line.qty : 0;
      const limit = Math.min(variant.stock, MAX_LINE);
      if (current >= limit) {
        return { ok: false, error: `Ya tienes en el carrito las ${limit} unidades disponibles.` };
      }
      const next = Math.min(current + wanted, limit);
      if (line) line.qty = next; else state.lines.push({ pid: product.id, vid: variant.id, qty: next });
      save('add');
      const added = next - current;
      return {
        ok: true, qty: next, added, product, variant,
        warning: added < wanted ? `Solo pudimos añadir ${added}: es el máximo disponible.` : null,
      };
    },

    /** Fija la cantidad de una línea (se ajusta a stock). Devuelve { ok, qty, error }. */
    setQty(pid, vid, qty) {
      const line = findLine(pid, vid);
      if (!line) return { ok: false, error: 'Ese producto ya no está en tu carrito.' };
      const product = catalog.byId(pid);
      const variant = catalog.variant(product, vid);
      const n = Number.parseInt(qty, 10);
      if (!Number.isFinite(n) || n < 1) return { ok: false, error: 'La cantidad mínima es 1. Para quitarlo, usa «Eliminar».', qty: line.qty };
      const limit = Math.min(variant.stock, MAX_LINE);
      if (limit <= 0) return { ok: false, error: 'Esta presentación está agotada.', qty: line.qty };
      line.qty = Math.min(n, limit);
      save('qty');
      return {
        ok: true, qty: line.qty,
        warning: n > limit ? `Solo hay ${limit} ${limit === 1 ? 'unidad disponible' : 'unidades disponibles'}.` : null,
      };
    },

    remove(pid, vid) {
      const before = state.lines.length;
      state.lines = state.lines.filter((l) => !(l.pid === pid && l.vid === vid));
      if (state.lines.length !== before) save('remove');
    },

    clear() {
      state = { lines: [], coupon: null };
      save('clear');
    },

    count() {
      return state.lines.reduce((n, l) => n + l.qty, 0);
    },

    isEmpty() { return state.lines.length === 0; },

    /** Líneas enriquecidas con producto, precio actual y posibles incidencias. */
    lines() {
      return state.lines.map((l) => {
        const product = catalog.byId(l.pid);
        const variant = catalog.variant(product, l.vid);
        let issue = null;
        if (variant.stock <= 0) issue = 'unavailable';
        else if (l.qty > variant.stock) issue = 'over-stock';
        const unitPrice = Math.max(0, variant.price);
        return {
          ...l, product, variant, unitPrice, issue,
          lineTotal: issue === 'unavailable' ? 0 : unitPrice * Math.min(l.qty, variant.stock),
        };
      });
    },

    hasBlockingIssues() {
      return this.lines().some((l) => l.issue);
    },

    coupon() { return state.coupon ? findCoupon(state.coupon) : null; },

    /** Aplica un código. Devuelve { ok, message }. Solo guarda cupones existentes y vigentes. */
    applyCoupon(code) {
      const trimmed = String(code || '').trim();
      if (!trimmed) return { ok: false, message: 'Escribe un código de descuento.' };
      const coupon = findCoupon(trimmed);
      const lines = this.lines();
      const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
      const result = evaluateCoupon(coupon, lines, subtotal);
      if (!coupon || result.issue === 'expired' || result.issue === 'not-eligible') {
        return { ok: false, message: couponMessage(coupon, result) };
      }
      state.coupon = coupon.code;
      save('coupon');
      return { ok: !result.issue, message: couponMessage(coupon, result) };
    },

    removeCoupon() {
      state.coupon = null;
      save('coupon');
    },

    zoneById,
    zoneForDepartment,

    /**
     * Totales del pedido. `zoneId` opcional: sin zona, el envío queda pendiente.
     * Todos los importes son enteros COP >= 0.
     */
    totals({ zoneId = null, methodId = null } = {}) {
      const lines = this.lines();
      const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
      const coupon = this.coupon();
      const result = evaluateCoupon(coupon, lines, subtotal);
      const discount = result.discount;

      const zone = zoneById(zoneId);
      const method = config.shipping.methods.find((m) => m.id === methodId) || config.shipping.methods[0];
      let shipping = null;
      if (subtotal > 0 && zone) {
        const free = config.shipping.freeShippingFrom != null && subtotal - discount >= config.shipping.freeShippingFrom;
        shipping = free ? 0 : Math.max(0, (method.usesZoneRate ? zone.rate : 0) + (method.surcharge || 0));
      }
      if (subtotal === 0) shipping = 0;

      const total = Math.max(0, subtotal - discount + (shipping || 0));
      return {
        lines,
        count: lines.reduce((n, l) => n + l.qty, 0),
        subtotal,
        discount,
        shipping,
        shippingKnown: shipping !== null,
        zone,
        method,
        total,
        coupon,
        couponIssue: coupon ? result.issue : null,
        couponMessage: coupon ? couponMessage(coupon, result) : null,
      };
    },
  };

  load();
  storage.onExternalChange(KEY, () => { load(); utils.emit('et:cart-change', { reason: 'external', cart: api }); });

  ET.cart = api;
})(window.ET);
