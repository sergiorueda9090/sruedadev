/* VITALIA — página de carrito y checkout por WhatsApp.
 * El checkout valida los datos y arma el PEDIDO COMPLETO (productos, cantidades, totales,
 * envío, pago preferido y datos de entrega) en un mensaje que se abre en WhatsApp con el
 * número de config.contacto.whatsapp. No cobra, no pide tarjetas y no guarda datos personales:
 * salen del navegador solo cuando el cliente envía el mensaje.
 * Integración futura con pasarela de pagos: ver README («Pasarela de pagos»).
 */
(function (VT) {
  'use strict';
  VT.paginas = VT.paginas || {};

  // El envío no se calcula aquí: se cotiza por WhatsApp según la ciudad.
  function resumenTotales() {
    const { u, carrito } = VT;
    const sub = carrito.subtotal();
    return `<dl class="totales">
      <div><dt>Subtotal</dt><dd>${u.dinero(sub)}</dd></div>
      <div><dt>Envío</dt><dd><span class="fw-normal texto-suave">Se cotiza por WhatsApp</span></dd></div>
      <div class="total"><dt>Total sin envío</dt><dd>${u.dinero(sub)}</dd></div></dl>`;
  }

  // ---------- carrito ----------
  VT.paginas.carrito = function () {
    const { u, ui, carrito, config } = VT;
    const lista = u.$('#carritoLista'); const resumen = u.$('#carritoResumen');

    function pintar() {
      const lineas = carrito.lineas();
      u.$('#carritoConteo').textContent = lineas.length ? `${carrito.unidades()} ${carrito.unidades() === 1 ? 'unidad' : 'unidades'} en tu carrito.` : '';
      if (!lineas.length) {
        lista.innerHTML = ui.vacio({ icono: 'bi-bag', titulo: 'Tu carrito está vacío', texto: 'Cuando añadas productos, aquí verás cantidades, subtotales y el total antes de continuar.', cta: 'Explorar productos', href: 'catalogo.html' });
        resumen.hidden = true; return;
      }
      resumen.hidden = false;
      lista.innerHTML = lineas.map((l) => ui.lineaCarrito(l, 'pagina')).join('') +
        `<div class="d-flex flex-wrap justify-content-between gap-3 pt-4"><a class="enlace-v" href="catalogo.html"><i class="bi bi-arrow-left" aria-hidden="true"></i> Seguir comprando</a>
         <button class="btn-texto" type="button" id="vaciar">Vaciar carrito</button></div>`;
      resumen.innerHTML = `<h2>Resumen</h2>${resumenTotales()}
        <p class="small texto-suave">El costo del envío te lo confirmamos por WhatsApp según tu ciudad.</p>
        <a class="btn-v btn-bloque" href="checkout.html">Continuar con el pedido <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
        <p class="small texto-suave mt-3 mb-0"><i class="bi bi-whatsapp" aria-hidden="true"></i> Sin pago en línea: el pedido se envía por WhatsApp y el pago se acuerda en el chat.</p>`;
      u.$('#vaciar').addEventListener('click', () => {
        const copia = carrito.items(); carrito.vaciar();
        ui.toast({ titulo: 'Carrito vaciado', icono: 'bi-trash3', accion: { texto: 'Deshacer', fn: () => copia.forEach((i) => carrito.agregar(i.id, i.cantidad)) } });
      });
    }
    document.addEventListener('vt:carrito', pintar);
    pintar();
  };

  // ---------- checkout: solo los datos necesarios para coordinar por WhatsApp ----------
  VT.paginas.checkout = function () {
    const { u, carrito, config, forms } = VT;
    const esc = u.esc;
    const raiz = u.$('#checkout');

    if (!carrito.lineas().length) {
      raiz.innerHTML = VT.ui.vacio({ icono: 'bi-bag', titulo: 'Tu carrito está vacío', texto: 'Añade productos a tu carrito para enviar el pedido por WhatsApp.', cta: 'Ir a la tienda', href: 'catalogo.html' });
      return;
    }

    raiz.innerHTML = `<ol class="checkout-pasos" aria-label="Progreso de compra"><li><a href="carrito.html">Carrito</a></li><li aria-current="step">Tus datos</li><li>Enviar por WhatsApp</li></ol>
    <div class="checkout-layout">
      <form id="formCheckout" data-form="checkout" novalidate>
        <div class="form-resumen-errores" tabindex="-1" hidden></div>
        <fieldset class="bloque-form"><legend>Tus datos de entrega</legend>
          <div class="row g-3">
            <div class="col-md-6 campo m-0"><label for="cNombre">Nombre</label><input class="input-v" id="cNombre" name="nombre" autocomplete="name" required minlength="3" data-nombre="El nombre"><p class="error-msg" id="err-cNombre"></p></div>
            <div class="col-md-6 campo m-0"><label for="cTel">Celular</label><input class="input-v" id="cTel" name="telefono" type="tel" autocomplete="tel" inputmode="tel" required data-tel data-nombre="El celular"><p class="error-msg" id="err-cTel"></p></div>
            <div class="col-md-6 campo m-0"><label for="cCiudad">Ciudad</label><input class="input-v" id="cCiudad" name="ciudad" autocomplete="address-level2" required minlength="3" data-nombre="La ciudad"><p class="error-msg" id="err-cCiudad"></p></div>
            <div class="col-md-6 campo m-0"><label for="cDir">Dirección</label><input class="input-v" id="cDir" name="direccion" autocomplete="street-address" required minlength="6" data-nombre="La dirección" placeholder="Calle, número, barrio, apto."><p class="error-msg" id="err-cDir"></p></div>
            <div class="col-12 campo m-0"><label for="cNotas">Notas <span class="opcional">(opcional)</span></label><textarea class="input-v" id="cNotas" name="notas" rows="2" maxlength="300" placeholder="Ej. es un regalo, horario de entrega, cómo prefieres pagar"></textarea></div>
          </div>
        </fieldset>
        <label class="check-v mb-2"><input type="checkbox" id="cTerminos" name="terminos" required data-msg-requerido="Acepta los términos y la política de privacidad para continuar."> <span>Acepto los <a href="terminos-y-condiciones.html" target="_blank">términos y condiciones</a> y la <a href="politicas-de-privacidad.html" target="_blank">política de privacidad</a>.</span></label>
        <p class="error-msg" id="err-cTerminos"></p>
        <button class="btn-v btn-bloque mt-3" type="submit"><i class="bi bi-whatsapp" aria-hidden="true"></i> Enviar pedido por WhatsApp</button>
        <p class="ayuda mt-2">Se abre WhatsApp con tu pedido listo. Te respondemos con el envío, el total final y cómo pagar.</p>
      </form>
      <aside class="resumen-pedido fijo" aria-labelledby="resTitulo">
        <h2 id="resTitulo">Tu pedido</h2>
        <ul class="resumen-items">${carrito.lineas().map((l) => `<li><span class="img"><img src="${u.img(l.producto, 'frente', 400)}" alt="" width="52" height="65"><span class="n" aria-hidden="true">${l.cantidad}</span></span><span>${esc(l.producto.nombre)}<span class="d-block small texto-suave">${l.cantidad} × ${u.dinero(l.producto.precio)}</span></span><strong>${u.dinero(l.total)}</strong></li>`).join('')}</ul>
        ${resumenTotales()}
        <a class="small" href="carrito.html">Editar carrito</a>
      </aside>
    </div>`;

    const form = u.$('#formCheckout');
    forms.enVivo(form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!forms.validar(form)) return;
      const d = new FormData(form);
      const v = (k) => String(d.get(k) || '').trim();
      const lineas = carrito.lineas();
      const hoy = new Date();
      const numero = `PED-${hoy.getFullYear()}${String(hoy.getMonth() + 1).padStart(2, '0')}${String(hoy.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
      const mensaje = [
        `*Pedido ${numero}*`,
        '',
        ...lineas.map((l) => `• ${l.cantidad} × ${l.producto.nombre} · ${u.dinero(l.total)}`),
        '',
        `*Subtotal: ${u.dinero(carrito.subtotal())}* (sin envío)`,
        '',
        `Nombre: ${v('nombre')}`,
        `Celular: ${v('telefono')}`,
        `Ciudad: ${v('ciudad')}`,
        `Dirección: ${v('direccion')}`,
        v('notas') ? `Notas: ${v('notas')}` : null,
        '',
        '¿Me confirman disponibilidad, envío y cómo pagar? ¡Gracias!'
      ].filter((x) => x !== null).join('\n');
      const url = u.whatsapp(mensaje);
      if (!url) {
        VT.ui.toast({ titulo: 'Falta configurar el WhatsApp de la tienda', icono: 'bi-exclamation-triangle' });
        return;
      }
      window.open(url, '_blank', 'noopener');
      raiz.innerHTML = `<ol class="checkout-pasos" aria-label="Progreso de compra"><li>Carrito</li><li>Tus datos</li><li aria-current="step">Enviar por WhatsApp</li></ol>
      <div class="confirmacion" tabindex="-1" id="confirmacion">
        <div class="sello"><i class="bi bi-whatsapp" aria-hidden="true"></i></div>
        <h1 class="h2">Tu pedido está listo en WhatsApp</h1>
        <p class="texto-suave">Gracias, ${esc(v('nombre').split(' ')[0])}. Envía el mensaje y te respondemos con el envío, el total final y cómo pagar.</p>
        <p class="numero">${numero}</p>
        <div class="d-flex flex-wrap justify-content-center gap-3 mt-2">
          <a class="btn-v" href="${esc(url)}" target="_blank" rel="noopener"><i class="bi bi-whatsapp" aria-hidden="true"></i> Abrir WhatsApp otra vez</a>
          <button class="btn-v btn-sec" type="button" id="yaEnvie">Ya lo envié: vaciar carrito</button>
        </div>
      </div>`;
      u.$('#yaEnvie').addEventListener('click', () => {
        carrito.vaciar();
        VT.ui.toast({ titulo: 'Carrito vacío. ¡Gracias por tu pedido!', icono: 'bi-check2' });
        u.$('#yaEnvie').replaceWith(Object.assign(document.createElement('a'), { className: 'btn-v btn-sec', href: 'catalogo.html', textContent: 'Seguir comprando' }));
      });
      const conf = u.$('#confirmacion'); conf.focus(); conf.scrollIntoView({ block: 'start' });
      document.title = 'Pedido listo en WhatsApp | VITALIA';
    });
  };
})(window.VT = window.VT || {});
