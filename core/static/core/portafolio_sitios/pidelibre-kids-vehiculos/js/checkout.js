/* =========================================================================
   CARRITO Y COTIZACIÓN — carrito.html
   Sin pasarela de pago: el "checkout" arma una solicitud de cotización y
   la abre en WhatsApp. El carrito no se vacía solo; el cliente lo vacía
   cuando confirma que envió el mensaje.
   ========================================================================= */
(function () {
  "use strict";

  const T = window.Tienda;
  const C = window.Carrito;
  const { N, esc, pesos, etiqueta, urlProducto } = T;
  const $ = (id) => document.getElementById(id);

  T.cabecera("carrito");
  T.pie();

  /* ---------- líneas ---------- */
  function linea(l) {
    const p = l.producto, cs = p.colores || [], sub = C.subtotal(l);
    return `
      <article class="c-linea prop-borde--${esc(p.propulsion)}" data-clave="${esc(l.clave)}">
        <a class="c-linea__foto" href="${urlProducto(p.ref)}"><img src="${esc(T.fotoDe(p, l.color))}" alt="${esc(p.nombre)}${l.color ? ` en color ${esc(l.color)}` : ""}"></a>
        <div class="c-linea__info">
          <div class="tarjeta__tags">${etiqueta(p)}<span class="ref">Ref. ${esc(p.ref)}</span></div>
          <h3><a href="${urlProducto(p.ref)}">${esc(p.nombre)}</a></h3>
          <div class="c-linea__campos">
            ${cs.length ? `<label>Color
              <select class="form-select form-select-sm" data-color ${cs.length > 1 ? "" : "disabled"}>
                ${cs.map((c) => `<option ${c.nombre === l.color ? "selected" : ""}>${esc(c.nombre)}</option>`).join("")}
              </select></label>` : ""}
            <div class="stepper stepper--sm" role="group" aria-label="Cantidad de ${esc(p.nombre)}">
              <button type="button" data-paso="-1" aria-label="Quitar una unidad" ${l.unidades <= 1 ? "disabled" : ""}><i class="bi bi-dash"></i></button>
              <input type="number" min="1" max="${C.MAX}" value="${l.unidades}" data-unidades aria-label="Cantidad" inputmode="numeric">
              <button type="button" data-paso="1" aria-label="Agregar una unidad"><i class="bi bi-plus"></i></button>
            </div>
            <button type="button" class="btn-quitar" data-quitar><i class="bi bi-trash3"></i> Quitar</button>
          </div>
        </div>
        <div class="c-linea__precio">
          ${sub === null ? `<b>Por confirmar</b>` : `<b>${pesos(sub)}</b>${l.unidades > 1 ? `<small>${pesos(p.precio)} c/u</small>` : ""}`}
        </div>
      </article>`;
  }

  function pintar() {
    const ls = C.lineas();
    const hay = ls.length > 0;
    const confirmando = !$("confirmacion").classList.contains("d-none");
    $("checkout").classList.toggle("d-none", !hay || confirmando);
    document.querySelector(".etapas").classList.toggle("d-none", !hay || confirmando);
    $("vacio").classList.toggle("d-none", hay || confirmando);
    if (!hay) return;
    $("lineas").innerHTML = ls.map(linea).join("");
    const n = C.cantidad();
    $("r-unidades").textContent = `Productos (${n} ${n === 1 ? "unidad" : "unidades"})`;
    $("r-subtotal").textContent = pesos(C.total());
    $("r-total").textContent = `${pesos(C.total())}${C.sinPrecio() ? " +" : ""}`;
    $("r-nota").textContent = [
      C.sinPrecio() ? "Hay productos con precio por confirmar." : "",
      "Precios con IVA incluido.",
      "El valor final se confirma en la cotización.",
    ].filter(Boolean).join(" ");
  }

  $("lineas").addEventListener("click", (e) => {
    const art = e.target.closest(".c-linea");
    if (!art) return;
    const clave = art.dataset.clave;
    const l = C.lineas().find((x) => x.clave === clave);
    if (e.target.closest("[data-quitar]")) { C.quitar(clave); T.avisar(`${l.producto.nombre} se quitó del carrito`); return; }
    const b = e.target.closest("[data-paso]");
    if (b) C.cambiar(clave, l.unidades + parseInt(b.dataset.paso, 10));
  });
  $("lineas").addEventListener("change", (e) => {
    const art = e.target.closest(".c-linea");
    if (!art) return;
    const clave = art.dataset.clave;
    if (e.target.matches("[data-unidades]")) C.cambiar(clave, parseInt(e.target.value, 10));
    if (e.target.matches("[data-color]")) C.cambiarColor(clave, e.target.value);
  });
  document.addEventListener("carrito:cambio", pintar);

  /* ---------- datos y envío ---------- */
  // formas de pago confirmadas por el negocio (negocio.csv) reemplazan las de ejemplo
  if (Array.isArray(N.pagos) && N.pagos.length) {
    $("c-pago").innerHTML = `<option value="">Prefiero que me indiquen</option>${N.pagos.map((x) => `<option>${T.esc(x)}</option>`).join("")}`;
  }
  const campos = { nombre: "c-nombre", celular: "c-celular", ciudad: "c-ciudad", direccion: "c-direccion", pago: "c-pago", notas: "c-notas" };
  const d = C.datos;
  Object.entries(campos).forEach(([k, id]) => ($(id).value = d[k] || ""));
  document.querySelectorAll('[name="c-tipo"]').forEach((r) => (r.checked = r.value === (d.tipo || "Familia")));
  $("form-cotizar").addEventListener("input", () => {
    const nuevo = Object.fromEntries(Object.entries(campos).map(([k, id]) => [k, $(id).value]));
    nuevo.tipo = (document.querySelector('[name="c-tipo"]:checked') || {}).value || "Familia";
    C.guardarDatos(nuevo);
    const etapas = document.querySelectorAll(".etapas li");
    etapas[0].classList.remove("actual"); etapas[0].classList.add("hecha"); etapas[1].classList.add("actual");
  });

  function mensaje(num) {
    const d = C.datos;
    const lineas = C.lineas().map((l) => {
      const s = C.subtotal(l);
      return `• ${l.unidades} × ${l.producto.nombre} (${l.ref})${l.color ? ` · ${l.color}` : ""} · ${s === null ? "precio por confirmar" : "ref. " + pesos(s)}`;
    });
    return [
      `*Solicitud de cotización ${num}*`,
      `Tienda: ${N.nombre}`,
      "",
      ...lineas,
      "",
      `Total de referencia: *${pesos(C.total())}*${C.sinPrecio() ? " (+ productos por confirmar)" : ""} (${C.cantidad()} ${C.cantidad() === 1 ? "unidad" : "unidades"})`,
      "Envío: por cotizar",
      "",
      `Nombre: ${d.nombre.trim()}`,
      `Celular: ${d.celular.trim()}`,
      `Ciudad: ${d.ciudad.trim()}`,
      d.direccion.trim() ? `Dirección: ${d.direccion.trim()}` : null,
      `Compro como: ${d.tipo}`,
      d.pago ? `Pago preferido: ${d.pago}` : null,
      d.notas.trim() ? `Notas: ${d.notas.trim()}` : null,
      "",
      "Quedo atento a la disponibilidad y al costo del envío. ¡Gracias!",
    ].filter((x) => x !== null).join("\n");
  }

  $("form-cotizar").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    f.classList.add("was-validated");
    if (!f.checkValidity()) {
      const malo = f.querySelector(":invalid");
      if (malo) malo.focus();
      return;
    }
    if (!C.lineas().length) return;
    if (!N.whatsappLink) { T.avisar("Falta configurar el WhatsApp de la tienda."); return; }
    const num = "#" + Date.now().toString(36).toUpperCase().slice(-5);
    const url = `${N.whatsappLink}?text=${encodeURIComponent(mensaje(num))}`;
    window.open(url, "_blank", "noopener");
    $("conf-num").textContent = num;
    $("conf-abrir").href = url;
    $("confirmacion").classList.remove("d-none");
    pintar();
    $("confirmacion").focus();
    window.scrollTo({ top: 0 });
  });
  $("conf-vaciar").addEventListener("click", () => {
    C.vaciar();
    $("confirmacion").classList.add("d-none");
    pintar();
    T.avisar("Carrito vacío. ¡Gracias por tu cotización!");
  });
  $("conf-volver").addEventListener("click", () => { $("confirmacion").classList.add("d-none"); pintar(); });

  pintar();
})();
