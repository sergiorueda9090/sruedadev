/* ==========================================================================
   ESSENCE & TIME — Página de carrito
   Toda la lógica de importes vive en cart.js; aquí solo se presenta.
   ========================================================================== */
(function (ET) {
  'use strict';

  ET.pages = ET.pages || {};
  ET.pages.cart = {
    init() {
      const { config, catalog, cart, ui, utils, storage } = ET;
      const { $, $$, esc, formatCOP, plural } = utils;
      const root = $('[data-cart-root]');
      const live = $('[data-cart-live]');
      const MAX = config.catalog.maxQtyPerLine;
      let zoneId = storage.get('ship-zone', null);
      if (!cart.zoneById(zoneId)) zoneId = null;
      let lastRemoved = null;
      let couponFeedback = null; // { ok, message }
      const lineMsgs = {};       // mensajes por línea tras actualizar cantidades

      const lineHTML = (l) => {
        const key = `${l.pid}:${l.vid}`;
        const limit = Math.min(l.variant.stock, MAX);
        const out = l.issue === 'unavailable';
        const msg = lineMsgs[key];
        return `<li class="line cart-line ${l.issue ? 'line--issue' : ''}" data-line="${key}">
          <a href="producto.html?p=${l.product.slug}" tabindex="-1" aria-hidden="true">${ui.productImg(l.product.images[0], { cls: 'line__img', sizes: '120px', alt: '' })}</a>
          <div class="line__body">
            <p class="line__brand">${esc(l.product.brand)}</p>
            <h2 class="line__name"><a href="producto.html?p=${l.product.slug}${catalog.hasChoice(l.product) ? `&v=${l.vid}` : ''}">${esc(l.product.name)}</a></h2>
            ${catalog.hasChoice(l.product) ? `<p class="line__variant">${esc(l.product.variantLabel || 'Tamaño')}: ${esc(l.variant.label)}</p>` : ''}
            <p class="line__variant">Precio unitario: <span class="num">${formatCOP(l.unitPrice)}</span></p>
            ${out ? '<p class="line__msg text-danger-et"><i class="bi bi-exclamation-circle" aria-hidden="true"></i> Este producto se agotó. Elimínalo para continuar con el pedido.</p>' : ''}
            ${msg ? `<p class="line__msg ${msg.ok ? 'text-muted' : 'text-danger-et'}" role="${msg.ok ? 'status' : 'alert'}">${esc(msg.text)}</p>` : ''}
            <div class="line__controls">
              ${out ? '<span></span>' : `<div class="qty qty--sm" role="group" aria-label="Cantidad de ${esc(l.product.name)}">
                <button type="button" class="qty__btn" data-dec="${key}" ${l.qty <= 1 ? 'disabled' : ''} aria-label="Quitar una unidad de ${esc(l.product.name)}"><i class="bi bi-dash" aria-hidden="true"></i></button>
                <input class="qty__input" type="number" inputmode="numeric" min="1" max="${limit}" value="${l.qty}" data-qty="${key}" aria-label="Cantidad de ${esc(l.product.name)}">
                <button type="button" class="qty__btn" data-inc="${key}" ${l.qty >= limit ? 'disabled' : ''} aria-label="Añadir una unidad de ${esc(l.product.name)}"><i class="bi bi-plus" aria-hidden="true"></i></button>
              </div>`}
              <p class="cart-line__total m-0"><span class="visually-hidden">Subtotal: </span><span class="num">${out ? '—' : formatCOP(l.lineTotal)}</span></p>
            </div>
            <button type="button" class="btn-et btn-et--text line__remove" data-remove-line="${key}">Eliminar<span class="visually-hidden"> ${esc(l.product.name)}</span></button>
          </div>
        </li>`;
      };

      const summaryHTML = (t) => {
        const blocked = cart.hasBlockingIssues();
        const coupon = t.coupon;
        const feedback = couponFeedback || (coupon && t.couponIssue ? { ok: false, message: t.couponMessage } : null);
        return `<aside class="summary cart-summary" aria-labelledby="sum-title">
          <h2 class="summary__title" id="sum-title">Resumen del pedido</h2>
          <form class="coupon" data-coupon-form novalidate>
            <div class="field mb-2" data-field>
              <label class="field__label" for="coupon">Código de descuento</label>
              <div class="input-group-et">
                <input class="input-et" id="coupon" name="coupon" autocomplete="off" autocapitalize="characters" maxlength="30" value="${coupon ? esc(coupon.code) : ''}" ${coupon ? 'readonly' : ''} aria-describedby="coupon-msg">
                ${coupon ? '<button type="button" class="btn-et btn-et--secondary" data-coupon-remove>Quitar</button>' : '<button type="submit" class="btn-et btn-et--secondary">Aplicar</button>'}
              </div>
              <p class="coupon__msg ${feedback ? (feedback.ok ? 'text-success-et' : 'text-danger-et') : ''}" id="coupon-msg" role="status">${feedback ? esc(feedback.message) : `Códigos de demostración: ${config.coupons.filter((c) => !c.expiresAt || new Date(c.expiresAt) > new Date()).map((c) => c.code).join(', ')}.`}</p>
            </div>
          </form>
          <div class="field mb-4">
            <label class="field__label" for="zone">Estimar envío</label>
            <select class="select-et select-et--sm" id="zone" data-zone>
              <option value="">Elige una zona</option>
              ${config.shipping.zones.map((z) => `<option value="${z.id}" ${z.id === zoneId ? 'selected' : ''}>${esc(z.label)}</option>`).join('')}
            </select>
          </div>
          <dl class="summary__rows">
            <div><dt>Subtotal (${plural(t.count, 'producto', 'productos')})</dt><dd>${formatCOP(t.subtotal)}</dd></div>
            ${t.discount ? `<div class="is-discount"><dt>Descuento ${esc(coupon.code)}</dt><dd>−${formatCOP(t.discount)}</dd></div>` : ''}
            <div><dt>Envío${t.zone ? ` a ${esc(t.zone.label)}` : ''}</dt><dd>${t.shippingKnown ? (t.shipping === 0 ? 'Gratis' : formatCOP(t.shipping)) : 'Se calcula en el checkout'}</dd></div>
          </dl>
          <div class="summary__total"><span>${t.shippingKnown ? 'Total' : 'Total sin envío'}</span><span>${formatCOP(t.total)}</span></div>
          <p class="summary__tax">Precios en pesos colombianos. Tarifas de envío de demostración.</p>
          ${blocked ? '<p class="notice notice--error mt-3"><i class="bi bi-exclamation-circle" aria-hidden="true"></i><span>Elimina los productos agotados para continuar.</span></p>' : ''}
          <a class="btn-et btn-et--primary btn-et--block mt-4 ${blocked ? '' : ''}" href="checkout.html" ${blocked ? 'aria-disabled="true" tabindex="-1"' : ''} data-checkout-link>Continuar al checkout</a>
          <a class="btn-et btn-et--text mt-2" href="perfumes.html">Seguir comprando</a>
        </aside>`;
      };

      const render = ({ focus } = {}) => {
        const t = cart.totals({ zoneId });
        const notices = cart.notices.splice(0).map((n) => `<p class="notice mb-4" role="status"><i class="bi bi-info-circle" aria-hidden="true"></i><span>${esc(n.message)}</span></p>`).join('');
        const undo = lastRemoved ? `<div class="notice notice--success mb-4 cart-undo" role="status">
            <i class="bi bi-check2-circle" aria-hidden="true"></i>
            <p>Quitaste ${esc(lastRemoved.name)} del carrito. <button type="button" class="btn-et btn-et--text btn-et--sm" data-undo>Deshacer</button></p></div>` : '';

        if (!t.lines.length) {
          root.innerHTML = `${notices}${undo}${ui.emptyState({
            title: 'Tu carrito está vacío',
            text: 'Explora la colección y añade tu próxima fragancia o reloj.',
            actions: [{ label: 'Ver perfumes', href: 'perfumes.html' }, { label: 'Ver relojes', href: 'relojes.html' }, { label: 'Ver favoritos', href: 'favoritos.html' }],
          })}`;
        } else {
          root.innerHTML = `${notices}${undo}
            <div class="cart-layout">
              <section class="cart-lines" aria-label="Productos en el carrito"><ul class="cart-lines__list">${t.lines.map(lineHTML).join('')}</ul></section>
              ${summaryHTML(t)}
            </div>
            <div class="cart-bar" aria-hidden="true">
              <div><span class="cart-bar__label">${t.shippingKnown ? 'Total' : 'Total sin envío'}</span><strong class="num">${formatCOP(t.total)}</strong></div>
              <a class="btn-et btn-et--primary" href="checkout.html" tabindex="-1" ${cart.hasBlockingIssues() ? 'aria-disabled="true"' : ''}>Ir al checkout</a>
            </div>`;
        }
        if (focus) {
          const el = typeof focus === 'string' ? $(focus, root) : null;
          (el || $('h1')).focus?.();
        }
      };

      const setQty = (key, n) => {
        const [pid, vid] = key.split(':');
        const res = cart.setQty(pid, vid, n);
        lineMsgs[key] = res.ok ? (res.warning ? { ok: false, text: res.warning } : null) : { ok: false, text: res.error };
        couponFeedback = null;
        render();
        const input = $(`[data-qty="${key}"]`, root);
        if (input) input.focus();
        if (res.ok) live.textContent = `Cantidad actualizada a ${res.qty}.`;
      };

      root.addEventListener('click', (e) => {
        const inc = e.target.closest('[data-inc]');
        const dec = e.target.closest('[data-dec]');
        if (inc || dec) {
          const key = (inc || dec).dataset.inc || (inc || dec).dataset.dec;
          const line = cart.lines().find((l) => `${l.pid}:${l.vid}` === key);
          if (!line) return;
          setQty(key, line.qty + (inc ? 1 : -1));
          const btn = $(`[data-${inc ? 'inc' : 'dec'}="${key}"]`, root);
          if (btn && !btn.disabled) btn.focus();
          return;
        }
        const rm = e.target.closest('[data-remove-line]');
        if (rm) {
          const [pid, vid] = rm.dataset.removeLine.split(':');
          const line = cart.lines().find((l) => l.pid === pid && l.vid === vid);
          lastRemoved = line ? { pid, vid, qty: line.qty, name: line.product.name } : null;
          cart.remove(pid, vid);
          couponFeedback = null;
          render();
          live.textContent = lastRemoved ? `${lastRemoved.name} eliminado del carrito.` : '';
          const undoBtn = $('[data-undo]', root);
          if (undoBtn) undoBtn.focus();
          return;
        }
        if (e.target.closest('[data-undo]') && lastRemoved) {
          const r = lastRemoved;
          lastRemoved = null;
          cart.add(r.pid, r.vid, r.qty);
          render();
          live.textContent = `${r.name} volvió al carrito.`;
          const input = $(`[data-qty="${r.pid}:${r.vid}"]`, root);
          if (input) input.focus();
          return;
        }
        if (e.target.closest('[data-coupon-remove]')) {
          cart.removeCoupon();
          couponFeedback = { ok: true, message: 'Quitaste el código de descuento.' };
          render();
          $('#coupon', root).focus();
          return;
        }
        const blocked = e.target.closest('a[aria-disabled="true"]');
        if (blocked) { e.preventDefault(); }
      });

      root.addEventListener('change', (e) => {
        if (e.target.matches('[data-qty]')) setQty(e.target.dataset.qty, e.target.value);
        if (e.target.matches('[data-zone]')) {
          zoneId = e.target.value || null;
          storage.set('ship-zone', zoneId);
          render();
          $('[data-zone]', root).focus();
        }
      });

      root.addEventListener('submit', (e) => {
        if (!e.target.matches('[data-coupon-form]')) return;
        e.preventDefault();
        couponFeedback = cart.applyCoupon(e.target.coupon.value);
        render();
        $('#coupon', root).focus();
      });

      // Cambios desde el minicarrito u otra pestaña
      document.addEventListener('et:cart-change', (e) => {
        if (e.detail && (e.detail.reason === 'external' || e.detail.reason === 'remove') && !root.contains(document.activeElement)) render();
      });

      render();
    },
  };
})(window.ET);
