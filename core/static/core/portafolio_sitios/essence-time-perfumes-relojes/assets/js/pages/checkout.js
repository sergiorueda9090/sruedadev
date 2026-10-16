/* ==========================================================================
   ESSENCE & TIME — Checkout y confirmación de DEMOSTRACIÓN
   - No procesa pagos ni pide datos de tarjeta, CVV o claves.
   - Los datos personales del formulario NO se guardan ni salen del navegador.
   - Solo se guarda un resumen del pedido (productos, importes, zona) para la
     página de confirmación, identificado por una referencia local.
   Una tienda real necesita backend: validación en servidor de precios, stock
   y cupones, gestión de pedidos e integración con una pasarela certificada.
   ========================================================================== */
(function (ET) {
  'use strict';

  const ORDERS_KEY = 'orders';
  const MAX_ORDERS = 5;

  ET.pages = ET.pages || {};

  /* ------------------------------------------------------------------ CHECKOUT */
  ET.pages.checkout = {
    init() {
      const { config, cart, ui, utils, storage } = ET;
      const { $, esc, formatCOP, plural } = utils;
      const root = $('[data-checkout-root]');

      if (cart.isEmpty()) {
        root.innerHTML = ui.emptyState({
          title: 'Tu carrito está vacío',
          text: 'Añade productos al carrito para continuar con el pedido de demostración.',
          actions: [{ label: 'Ver perfumes', href: 'perfumes.html' }, { label: 'Ver relojes', href: 'relojes.html' }],
        });
        return;
      }
      if (cart.hasBlockingIssues()) {
        root.innerHTML = ui.emptyState({
          title: 'Hay productos agotados en tu carrito',
          text: 'Elimínalos desde el carrito para poder continuar.',
          actions: [{ label: 'Volver al carrito', href: 'carrito.html' }],
        });
        return;
      }

      const field = (id, label, attrs = '', { opt = false, hint = '', type = 'text', cls = '' } = {}) => `
        <div class="field ${cls}" data-field>
          <label class="field__label" for="co-${id}">${label}${opt ? ' <span class="opt">(opcional)</span>' : ''}</label>
          <input class="input-et" id="co-${id}" name="${id}" type="${type}" ${attrs} aria-describedby="${hint ? `co-${id}-hint ` : ''}co-${id}-error">
          ${hint ? `<p class="field__hint" id="co-${id}-hint">${hint}</p>` : ''}
          <p class="field__error" id="co-${id}-error"></p>
        </div>`;

      root.innerHTML = `
        <div class="checkout-layout">
          <form class="checkout-form" id="checkout-form" novalidate>
            <div class="notice notice--error mb-5" data-error-summary hidden tabindex="-1" role="alert"></div>
            <fieldset class="checkout-block">
              <legend class="checkout-block__title">Datos de contacto</legend>
              <div class="row row-et">
                <div class="col-sm-6">${field('firstName', 'Nombre', 'autocomplete="given-name" maxlength="60" required')}</div>
                <div class="col-sm-6">${field('lastName', 'Apellidos', 'autocomplete="family-name" maxlength="60" required')}</div>
                <div class="col-sm-6">${field('email', 'Correo electrónico', 'autocomplete="email" maxlength="120" required', { type: 'email' })}</div>
                <div class="col-sm-6">${field('phone', 'Teléfono', 'autocomplete="tel" inputmode="tel" maxlength="16" required', { type: 'tel', hint: 'Celular de 10 dígitos, por ejemplo 300 123 4567.' })}</div>
              </div>
            </fieldset>
            <fieldset class="checkout-block">
              <legend class="checkout-block__title">Dirección de entrega</legend>
              <div class="row row-et">
                <div class="col-sm-6"><div class="field" data-field>
                  <label class="field__label" for="co-department">Departamento</label>
                  <select class="select-et" id="co-department" name="department" autocomplete="address-level1" required aria-describedby="co-department-error">
                    <option value="">Elige un departamento</option>
                    ${config.departments.map((d) => `<option>${esc(d)}</option>`).join('')}
                  </select>
                  <p class="field__error" id="co-department-error"></p></div></div>
                <div class="col-sm-6">${field('city', 'Ciudad o municipio', 'autocomplete="address-level2" maxlength="60" required')}</div>
                <div class="col-12">${field('address', 'Dirección', 'autocomplete="street-address" maxlength="120" required', { hint: 'Calle, número y barrio. Por ejemplo: Calle 72 # 10-34, Chapinero.' })}</div>
                <div class="col-12"><div class="field" data-field>
                  <label class="field__label" for="co-notes">Información adicional <span class="opt">(opcional)</span></label>
                  <textarea class="textarea-et" id="co-notes" name="notes" maxlength="300" rows="3" aria-describedby="co-notes-hint co-notes-error"></textarea>
                  <p class="field__hint" id="co-notes-hint">Apartamento, torre o indicaciones para la entrega.</p>
                  <p class="field__error" id="co-notes-error"></p></div></div>
              </div>
            </fieldset>
            <fieldset class="checkout-block">
              <legend class="checkout-block__title">Entrega</legend>
              <div class="option-list" data-delivery>
                ${config.shipping.methods.map((m, i) => `<label class="option-card"><input class="visually-hidden-input" type="radio" name="delivery" value="${m.id}" ${i === 0 ? 'checked' : ''}>
                  <span class="option-card__body"><span class="option-card__title"><span>${esc(m.label)}</span><span data-ship-price>Elige un departamento</span></span>
                  <span class="option-card__meta">${esc(m.description)} <span data-eta>Plazo por confirmar.</span></span></span></label>`).join('')}
              </div>
            </fieldset>
            <fieldset class="checkout-block">
              <legend class="checkout-block__title">Medio de pago</legend>
              <p class="field__hint mb-3">Opciones de demostración, no conectadas a ninguna pasarela. No te pediremos datos de tarjeta ni claves bancarias.</p>
              <div class="field mb-0" data-field>
                <div class="option-list">
                  ${config.payments.methods.map((m) => `<label class="option-card"><input class="check-et__input" type="radio" name="payment" value="${m.id}" required aria-describedby="co-payment-error">
                    <i class="bi ${esc(m.icon)}" aria-hidden="true"></i>
                    <span class="option-card__body"><span class="option-card__title"><span>${esc(m.label)}</span></span></span></label>`).join('')}
                </div>
                <p class="field__error" id="co-payment-error"></p>
              </div>
            </fieldset>
            <div class="field" data-field>
              <label class="check-et"><input type="checkbox" name="terms" required aria-describedby="co-terms-error">
                <span>Entiendo que este es un pedido de demostración, que no se procesa ningún pago y acepto los <a href="terminos.html">términos</a> y la <a href="privacidad.html">política de privacidad</a>.</span></label>
              <p class="field__error" id="co-terms-error"></p>
            </div>
            <button type="submit" class="btn-et btn-et--primary checkout-submit">Confirmar pedido de demostración</button>
          </form>
          <aside class="summary checkout-summary" aria-labelledby="co-sum-title" data-co-summary></aside>
        </div>`;

      const form = $('#checkout-form');
      const dep = $('#co-department');

      const renderSummary = () => {
        const zone = cart.zoneForDepartment(dep.value);
        const method = form.delivery ? (form.querySelector('[name="delivery"]:checked') || {}).value : null;
        const t = cart.totals({ zoneId: zone ? zone.id : null, methodId: method });
        $('[data-ship-price]', form).textContent = t.shippingKnown ? (t.shipping === 0 ? 'Gratis' : formatCOP(t.shipping)) : 'Elige un departamento';
        if (zone && zone.eta) $('[data-eta]', form).textContent = zone.eta;
        $('[data-co-summary]').innerHTML = `
          <h2 class="summary__title" id="co-sum-title">Tu pedido</h2>
          <ul class="checkout-summary__lines">${t.lines.map((l) => `<li class="line line--compact">
            ${ui.productImg(l.product.images[0], { cls: 'line__img', sizes: '56px', alt: '' })}
            <div class="line__body"><p class="line__name">${esc(l.product.name)}</p>
              <p class="line__variant">${ET.catalog.hasChoice(l.product) ? `${esc(l.variant.label)}, ` : ''}cantidad ${l.qty}</p></div>
            <span class="num">${formatCOP(l.lineTotal)}</span></li>`).join('')}</ul>
          <dl class="summary__rows mt-4">
            <div><dt>Subtotal (${plural(t.count, 'producto', 'productos')})</dt><dd>${formatCOP(t.subtotal)}</dd></div>
            ${t.discount ? `<div class="is-discount"><dt>Descuento ${esc(t.coupon.code)}</dt><dd>−${formatCOP(t.discount)}</dd></div>` : ''}
            ${t.coupon && t.couponIssue ? `<div><dt class="text-danger-et">${esc(t.couponMessage)}</dt><dd></dd></div>` : ''}
            <div><dt>Envío${t.zone ? ` (${esc(t.zone.label)})` : ''}</dt><dd>${t.shippingKnown ? formatCOP(t.shipping) : 'Elige un departamento'}</dd></div>
          </dl>
          <div class="summary__total"><span>Total</span><span>${formatCOP(t.total)}</span></div>
          <p class="summary__tax">Pedido de demostración: no se cobrará este importe.</p>
          <a class="btn-et btn-et--text mt-2" href="carrito.html">Editar carrito</a>`;
        return t;
      };

      dep.addEventListener('change', renderSummary);
      form.addEventListener('change', (e) => { if (e.target.name === 'delivery') renderSummary(); });
      document.addEventListener('et:cart-change', () => {
        if (cart.isEmpty()) window.location.reload(); else renderSummary();
      });
      renderSummary();

      ET.validation.attach(form, {
        summary: $('[data-error-summary]', form),
        fields: {
          firstName: ['required', 'name'],
          lastName: ['required', 'name'],
          email: ['required', 'email'],
          phone: ['required', 'phoneCO'],
          department: ['required'],
          city: ['required', 'name'],
          address: ['required', 'min10'],
          notes: ['max500'],
          payment: ['checked'],
          terms: ['checked'],
        },
        messages: {
          department: { required: 'Elige el departamento de entrega para calcular el envío.' },
          city: { name: 'Escribe el nombre de la ciudad o municipio.' },
          payment: { checked: 'Elige un medio de pago de demostración.' },
          terms: { checked: 'Confirma que entiendes que es un pedido de demostración.' },
        },
        onValid() {
          // Revalidación final contra el catálogo (stock y precios actuales)
          if (cart.isEmpty() || cart.hasBlockingIssues()) { window.location.href = 'carrito.html'; return; }
          const t = renderSummary();
          if (!t.shippingKnown) { dep.focus(); return; }
          const order = {
            ref: utils.orderRef(),
            createdAt: new Date().toISOString(),
            demo: true,
            zone: t.zone.label,
            payment: (config.payments.methods.find((m) => m.id === form.querySelector('[name="payment"]:checked').value) || {}).label,
            lines: t.lines.map((l) => ({
              pid: l.pid, name: l.product.name, brand: l.product.brand,
              variant: ET.catalog.hasChoice(l.product) ? l.variant.label : null,
              qty: l.qty, unit: l.unitPrice, total: l.lineTotal, image: l.product.images[0],
            })),
            subtotal: t.subtotal, discount: t.discount, coupon: t.coupon ? t.coupon.code : null,
            shipping: t.shipping, total: t.total,
          };
          // Sin datos personales: el formulario se descarta aquí.
          const orders = (storage.get(ORDERS_KEY, []) || []).filter((o) => o && o.ref);
          storage.set(ORDERS_KEY, [order, ...orders].slice(0, MAX_ORDERS));
          form.reset();
          cart.clear();
          window.location.href = `confirmacion.html?pedido=${encodeURIComponent(order.ref)}`;
        },
      });
    },
  };

  /* ------------------------------------------------------------- CONFIRMACIÓN */
  ET.pages.confirmation = {
    init() {
      const { ui, utils, storage } = ET;
      const { $, esc, formatCOP } = utils;
      const root = $('[data-confirm-root]');
      const ref = (utils.params().get('pedido') || '').trim();
      const orders = storage.get(ORDERS_KEY, []);
      const order = Array.isArray(orders) ? orders.find((o) => o && o.ref === ref) : null;

      // Validación defensiva del registro local
      const valid = order && Array.isArray(order.lines) && order.lines.length
        && [order.subtotal, order.discount, order.total].every((n) => Number.isInteger(n) && n >= 0);

      if (!valid) {
        document.title = 'Pedido no encontrado | Essence & Time';
        root.innerHTML = ui.emptyState({
          heading: 'h1',
          title: 'No encontramos este pedido de demostración',
          text: 'Los pedidos de demostración solo se guardan en el navegador donde se crearon. Puede que el enlace sea incorrecto o que se hayan borrado los datos del sitio.',
          actions: [{ label: 'Volver al catálogo', href: 'perfumes.html' }, { label: 'Ir al inicio', href: 'index.html' }],
        });
        return;
      }

      const date = new Intl.DateTimeFormat('es-CO', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(order.createdAt));
      root.innerHTML = `
        <div class="confirm__head">
          <span class="confirm__icon" role="img" aria-label="Pedido preparado"><i class="bi bi-check2" aria-hidden="true"></i></span>
          <ol class="steps confirm__steps" aria-label="Pasos de la compra">
            <li class="is-done"><span class="steps__n" aria-hidden="true">1</span>Carrito</li>
            <li class="is-done"><span class="steps__n" aria-hidden="true">2</span>Entrega y pago</li>
            <li aria-current="step"><span class="steps__n" aria-hidden="true">3</span>Confirmación</li>
          </ol>
          <h1 class="confirm__title">Tu pedido de demostración está preparado</h1>
          <p class="confirm__ref">Referencia <strong class="num">${esc(order.ref)}</strong><span class="confirm__date">${esc(date)}</span></p>
        </div>
        <div class="notice notice--pending confirm__notice" role="note"><i class="bi bi-exclamation-triangle" aria-hidden="true"></i>
          <p><strong>No se ha procesado ningún pago</strong> y este pedido no se enviará. Es una simulación local guardada solo en este navegador.</p></div>
        <section class="summary confirm__summary" aria-labelledby="cf-sum">
          <h2 class="summary__title" id="cf-sum">Resumen</h2>
          <ul class="checkout-summary__lines">${order.lines.map((l) => `<li class="line line--compact">
            ${ui.productImg(l.image, { cls: 'line__img', sizes: '56px', alt: '' })}
            <div class="line__body"><p class="line__brand">${esc(l.brand)}</p><p class="line__name">${esc(l.name)}</p>
              <p class="line__variant">${l.variant ? `${esc(l.variant)}, ` : ''}cantidad ${Number(l.qty)}</p></div>
            <span class="num">${formatCOP(l.total)}</span></li>`).join('')}</ul>
          <dl class="summary__rows mt-4">
            <div><dt>Subtotal</dt><dd>${formatCOP(order.subtotal)}</dd></div>
            ${order.discount ? `<div class="is-discount"><dt>Descuento ${esc(order.coupon || '')}</dt><dd>−${formatCOP(order.discount)}</dd></div>` : ''}
            <div><dt>Envío (${esc(order.zone)})</dt><dd>${formatCOP(order.shipping)}</dd></div>
            <div><dt>Medio de pago</dt><dd>${esc(order.payment || '')}</dd></div>
          </dl>
          <div class="summary__total"><span>Total calculado</span><span>${formatCOP(order.total)}</span></div>
        </section>
        <div class="confirm__actions">
          <a class="btn-et btn-et--primary" href="index.html">Volver al inicio</a>
          <a class="btn-et btn-et--secondary" href="perfumes.html">Seguir explorando la tienda</a>
        </div>`;
    },
  };
})(window.ET);
