/* VITALIA — página de carrito y checkout demostrativo.
 * El checkout valida los datos y muestra una confirmación de demostración: no envía
 * ni guarda datos personales, no pide números de tarjeta y no procesa pagos.
 * Integración real de pagos: ver README («Pasarela de pagos»).
 */
(function (VT) {
  'use strict';
  VT.paginas = VT.paginas || {};

  function resumenTotales(envioId) {
    const { u, carrito, config } = VT;
    const sub = carrito.subtotal();
    const m = config.envios.find((e) => e.id === envioId);
    const envio = m ? carrito.envio(envioId) : null;
    return `<dl class="totales">
      <div><dt>Subtotal</dt><dd>${u.dinero(sub)}</dd></div>
      <div><dt>Envío${m ? ` (${u.esc(m.nombre.toLowerCase())})` : ''}</dt><dd>${envio == null ? '<span class="fw-normal texto-suave">Elige un método</span>' : (envio === 0 ? 'Sin costo' : u.dinero(envio))}</dd></div>
      <div class="total"><dt>Total${envio == null ? ' estimado' : ''}</dt><dd>${u.dinero(sub + (envio || 0))}</dd></div></dl>`;
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
      const minimo = Math.min(...config.envios.map((e) => e.precio));
      resumen.innerHTML = `<h2>Resumen</h2>${resumenTotales(null)}
        <p class="small texto-suave">El envío se elige en el siguiente paso${minimo === 0 ? ' (hay una opción sin costo)' : ''}. Valores de ejemplo.</p>
        <a class="btn-v btn-bloque" href="checkout.html">Continuar al proceso de compra <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
        <p class="small texto-suave mt-3 mb-0"><i class="bi bi-shield-check" aria-hidden="true"></i> Compra de demostración: no se procesan pagos.</p>`;
      u.$('#vaciar').addEventListener('click', () => {
        const copia = carrito.items(); carrito.vaciar();
        ui.toast({ titulo: 'Carrito vaciado', icono: 'bi-trash3', accion: { texto: 'Deshacer', fn: () => copia.forEach((i) => carrito.agregar(i.id, i.cantidad)) } });
      });
    }
    document.addEventListener('vt:carrito', pintar);
    pintar();
  };

  // ---------- checkout ----------
  VT.paginas.checkout = function () {
    const { u, carrito, config, forms } = VT;
    const esc = u.esc;
    const raiz = u.$('#checkout');

    if (!carrito.lineas().length) {
      raiz.innerHTML = VT.ui.vacio({ icono: 'bi-bag', titulo: 'No hay productos para pagar', texto: 'Añade productos a tu carrito para recorrer el proceso de compra de demostración.', cta: 'Ir a la tienda', href: 'catalogo.html' });
      return;
    }

    const opcEnvio = config.envios.map((e, i) => `<label class="opcion-radio"><input type="radio" name="envio" value="${e.id}" ${i === 0 ? 'required' : ''} data-nombre="Un método de envío" data-msg-requerido="Elige un método de envío.">
      <div><strong>${esc(e.nombre)}</strong><span>${esc(e.detalle)}</span></div><span class="valor">${e.precio ? u.dinero(e.precio) : 'Sin costo'}</span></label>`).join('');
    const opcPago = config.pagos.map((p, i) => `<label class="opcion-radio"><input type="radio" name="pago" value="${p.id}" ${i === 0 ? 'required' : ''} data-nombre="Un método de pago" data-msg-requerido="Elige un método de pago.">
      <i class="bi bi-${p.icono}" aria-hidden="true"></i><div><strong>${esc(p.nombre)}</strong><span>${esc(p.detalle)}</span></div></label>`).join('');
    const deps = config.departamentos.map((d) => `<option>${esc(d)}</option>`).join('');

    raiz.innerHTML = `<ol class="checkout-pasos" aria-label="Progreso de compra"><li><a href="carrito.html">Carrito</a></li><li aria-current="step">Datos y pago</li><li>Confirmación</li></ol>
    <div class="checkout-layout">
      <form id="formCheckout" data-form="checkout" novalidate>
        <div class="form-resumen-errores" tabindex="-1" hidden></div>
        <fieldset class="bloque-form"><legend><span class="n" aria-hidden="true">1</span> Datos de contacto</legend>
          <div class="row g-3">
            <div class="col-md-6 campo m-0"><label for="cNombre">Nombre completo</label><input class="input-v" id="cNombre" name="nombre" autocomplete="name" required minlength="3" data-nombre="El nombre"><p class="error-msg" id="err-cNombre"></p></div>
            <div class="col-md-6 campo m-0"><label for="cCorreo">Correo electrónico</label><input class="input-v" id="cCorreo" name="correo" type="email" autocomplete="email" required data-nombre="El correo"><p class="error-msg" id="err-cCorreo"></p></div>
            <div class="col-md-6 campo m-0"><label for="cTel">Celular</label><input class="input-v" id="cTel" name="telefono" type="tel" autocomplete="tel" inputmode="tel" required data-tel data-nombre="El celular"><p class="ayuda">Para coordinar la entrega.</p><p class="error-msg" id="err-cTel"></p></div>
          </div>
        </fieldset>
        <fieldset class="bloque-form"><legend><span class="n" aria-hidden="true">2</span> Dirección de entrega</legend>
          <div class="row g-3">
            <div class="col-12 campo m-0"><label for="cDir">Dirección</label><input class="input-v" id="cDir" name="direccion" autocomplete="street-address" required minlength="6" data-nombre="La dirección" placeholder="Calle, número, barrio"><p class="error-msg" id="err-cDir"></p></div>
            <div class="col-12 campo m-0"><label for="cDir2">Apartamento, torre o indicaciones <span class="opcional">(opcional)</span></label><input class="input-v" id="cDir2" name="complemento" autocomplete="address-line2"></div>
            <div class="col-md-6 campo m-0"><label for="cCiudad">Ciudad o municipio</label><input class="input-v" id="cCiudad" name="ciudad" autocomplete="address-level2" required minlength="3" data-nombre="La ciudad"><p class="error-msg" id="err-cCiudad"></p></div>
            <div class="col-md-6 campo m-0"><label for="cDep">Departamento</label><select class="select-v" id="cDep" name="departamento" autocomplete="address-level1" required data-nombre="El departamento" data-msg-requerido="Elige un departamento."><option value="">Selecciona</option>${deps}</select><p class="error-msg" id="err-cDep"></p></div>
            <div class="col-md-6 campo m-0"><label for="cPostal">Código postal <span class="opcional">(opcional)</span></label><input class="input-v" id="cPostal" name="postal" autocomplete="postal-code" inputmode="numeric" data-patron="^[0-9]{6}$" data-nombre="El código postal" data-msg-patron="El código postal tiene 6 dígitos."><p class="error-msg" id="err-cPostal"></p></div>
          </div>
        </fieldset>
        <fieldset class="bloque-form"><legend><span class="n" aria-hidden="true">3</span> Método de envío</legend>
          <div class="opciones-radio" id="opcEnvio">${opcEnvio}</div><p class="error-msg mt-2" id="err-envio"></p>
          <p class="ayuda mt-2">Costos y tiempos de ejemplo: una tienda real los confirma con su transportadora.</p>
        </fieldset>
        <fieldset class="bloque-form"><legend><span class="n" aria-hidden="true">4</span> Método de pago</legend>
          <div class="opciones-radio opciones-pago">${opcPago}</div><p class="error-msg mt-2" id="err-pago"></p>
          <div class="aviso-ficha"><i class="bi bi-shield-lock" aria-hidden="true"></i><p class="m-0">Esta página nunca pide números de tarjeta ni claves. En una tienda real, el pago se haría en la página segura de la pasarela de pagos.</p></div>
        </fieldset>
        <fieldset class="bloque-form"><legend class="visually-hidden">Confirmación</legend>
          <label class="check-v mb-2"><input type="checkbox" id="cDemo" name="demo" required data-msg-requerido="Confirma que entiendes que es una compra de demostración."> <span>Entiendo que es una <strong>compra de demostración</strong>: no se cobrará nada ni se enviará ningún producto.</span></label>
          <p class="error-msg" id="err-cDemo"></p>
          <label class="check-v mb-2"><input type="checkbox" id="cTerminos" name="terminos" required data-msg-requerido="Acepta los términos y la política de privacidad para continuar."> <span>Acepto los <a href="terminos-y-condiciones.html" target="_blank">términos y condiciones</a> y la <a href="politicas-de-privacidad.html" target="_blank">política de privacidad</a>.</span></label>
          <p class="error-msg" id="err-cTerminos"></p>
          <button class="btn-v btn-bloque mt-3" type="submit">Confirmar pedido de demostración</button>
          <p class="ayuda mt-2">Los datos que escribas no se envían ni se guardan: solo se usan en esta pantalla para validar el formulario.</p>
        </fieldset>
      </form>
      <aside class="resumen-pedido fijo" aria-labelledby="resTitulo">
        <h2 id="resTitulo">Tu pedido</h2>
        <ul class="resumen-items">${carrito.lineas().map((l) => `<li><span class="img"><img src="${u.img(l.producto, 'frente', 400)}" alt="" width="52" height="65"><span class="n" aria-hidden="true">${l.cantidad}</span></span><span>${esc(l.producto.nombre)}<span class="d-block small texto-suave">${l.cantidad} × ${u.dinero(l.producto.precio)}</span></span><strong>${u.dinero(l.total)}</strong></li>`).join('')}</ul>
        <div id="resTotales" aria-live="polite">${resumenTotales(null)}</div>
        <a class="small" href="carrito.html">Editar carrito</a>
      </aside>
    </div>`;

    const form = u.$('#formCheckout');
    forms.enVivo(form);
    form.addEventListener('change', (e) => { if (e.target.name === 'envio') u.$('#resTotales').innerHTML = resumenTotales(e.target.value); });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!forms.validar(form)) return;
      const d = new FormData(form);
      const envio = config.envios.find((x) => x.id === d.get('envio'));
      const pago = config.pagos.find((x) => x.id === d.get('pago'));
      const lineas = carrito.lineas();
      const totales = resumenTotales(envio.id);
      const hoy = new Date();
      const numero = `DEMO-${hoy.getFullYear()}${String(hoy.getMonth() + 1).padStart(2, '0')}${String(hoy.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
      const nombre = String(d.get('nombre')).trim().split(' ')[0];
      forms.simularEnvio(form.querySelector('[type="submit"]'), () => {
        carrito.vaciar();
        raiz.innerHTML = `<ol class="checkout-pasos" aria-label="Progreso de compra"><li>Carrito</li><li>Datos y pago</li><li aria-current="step">Confirmación</li></ol>
        <div class="confirmacion" tabindex="-1" id="confirmacion">
          <div class="sello"><i class="bi bi-check2" aria-hidden="true"></i></div>
          <h1 class="h2">Pedido de demostración confirmado</h1>
          <p class="texto-suave">Gracias, ${esc(nombre)}. Así se vería la confirmación de una compra real.</p>
          <p class="numero">${numero}</p>
          <div class="resumen-pedido text-start mb-4">
            <ul class="resumen-items">${lineas.map((l) => `<li><span class="img"><img src="${u.img(l.producto, 'frente', 400)}" alt="" width="52" height="65"><span class="n" aria-hidden="true">${l.cantidad}</span></span><span>${esc(l.producto.nombre)}</span><strong>${u.dinero(l.total)}</strong></li>`).join('')}</ul>
            ${totales}
            <p class="small m-0">Envío: ${esc(envio.nombre)}. Pago: ${esc(pago.nombre)}.</p>
          </div>
          <div class="aviso-ficha"><i class="bi bi-info-circle" aria-hidden="true"></i><p class="m-0"><strong>Compra de demostración.</strong> No se realizó ningún cobro, no se reservó inventario y tus datos no se enviaron ni se guardaron. El carrito se vació para que puedas probar de nuevo.</p></div>
          <div class="d-flex flex-wrap justify-content-center gap-3 mt-4"><a class="btn-v" href="catalogo.html">Volver a la tienda</a><a class="btn-v btn-sec" href="../index.html">Ir al inicio</a></div>
        </div>`;
        const conf = u.$('#confirmacion'); conf.focus(); conf.scrollIntoView({ block: 'start' });
        document.title = 'Pedido de demostración confirmado | VITALIA';
      });
    });
  };
})(window.VT = window.VT || {});
