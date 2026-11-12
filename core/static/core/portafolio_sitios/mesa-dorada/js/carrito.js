/* =========================================================================
   CARRITO DE PEDIDO POR WHATSAPP
   - Agrega productos (con cantidades) desde la web o desde la revista
     incrustada (mensaje postMessage {tipo: "carrito:agregar", ref}).
   - Panel con resumen, forma de entrega, datos del cliente y notas.
   - Envía UN solo mensaje de WhatsApp con el pedido completo.
   - Guarda el carrito en el navegador del cliente (si está disponible).
   ========================================================================= */
(function () {
  "use strict";

  const D = window.CATALOGO;
  const N = D.negocio;
  const CLAVE = "carrito:" + N.nombre;
  const porRef = Object.fromEntries(D.productos.map((x) => [x.ref, x]));
  const $ = (id) => document.getElementById(id);
  const esc = (v) =>
    String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pesos = (n) => `$${Number(n).toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;
  const tienePrecio = (x) => typeof x.precio === "number";

  /* ---------- estado ---------- */
  let items = {}; // ref -> cantidad
  let notasItem = {}; // ref -> nota del producto (ej. "una sin cebolla")
  let datos = { entrega: (N.servicios || [])[0] || "Domicilios", nombre: "", direccion: "", pago: "", notas: "" };
  try {
    const g = JSON.parse(localStorage.getItem(CLAVE) || "null");
    if (g && g.items) {
      items = Object.fromEntries(Object.entries(g.items).filter(([r, c]) => porRef[r] && porRef[r].disponible !== false && c > 0));
      datos = Object.assign(datos, g.datos || {});
      notasItem = Object.fromEntries(Object.entries(g.notasItem || {}).filter(([r]) => items[r]));
    }
  } catch (_) { /* navegador sin almacenamiento: el carrito funciona igual */ }
  const guardar = () => {
    try { localStorage.setItem(CLAVE, JSON.stringify({ items, datos, notasItem })); } catch (_) {}
  };

  const cantidadTotal = () => Object.values(items).reduce((a, b) => a + b, 0);
  const subtotal = () =>
    Object.entries(items).reduce((s, [r, c]) => s + (tienePrecio(porRef[r]) ? porRef[r].precio * c : 0), 0);
  const sinPrecio = () => Object.keys(items).filter((r) => !tienePrecio(porRef[r]));

  /* ---------- acciones ---------- */
  function cambiar(ref, delta) {
    const x = porRef[ref];
    if (!x || x.disponible === false) return;
    const n = Math.max(0, Math.min(99, (items[ref] || 0) + delta));
    if (n === 0) { delete items[ref]; delete notasItem[ref]; }
    else items[ref] = n;
    guardar();
    pintar();
    if (delta > 0) {
      avisar(primeraVez ? `${x.nombre} agregado · puedes añadirle una nota en “Ver mi pedido”` : `${x.nombre} agregado al pedido`, primeraVez ? 3500 : 1800);
      primeraVez = false;
    }
  }
  let primeraVez = !Object.keys(items).length;
  const agregar = (ref) => cambiar(ref, 1);
  function vaciar() {
    items = {};
    notasItem = {};
    guardar();
    pintar();
  }

  /* ---------- controles en las tarjetas ---------- */
  // Devuelve el HTML del control para un producto (lo usa sitio.js)
  function control(x, grande) {
    if (x.disponible === false) return `<span class="agotado">No disponible</span>`;
    return `<span class="ctrl-carrito ${grande ? "ctrl-carrito--grande" : ""}" data-ref="${esc(x.ref)}"></span>`;
  }
  function pintarControles() {
    document.querySelectorAll(".ctrl-carrito").forEach((c) => {
      const ref = c.dataset.ref;
      const n = items[ref] || 0;
      c.innerHTML = n
        ? `<span class="cant">
             <button type="button" class="cant__btn" data-accion="menos" aria-label="Quitar uno"><i class="bi bi-dash-lg"></i></button>
             <b aria-live="polite">${n}</b>
             <button type="button" class="cant__btn" data-accion="mas" aria-label="Agregar uno"><i class="bi bi-plus-lg"></i></button>
           </span>`
        : `<button type="button" class="btn btn-wa ${c.classList.contains("ctrl-carrito--grande") ? "" : "btn-sm"}" data-accion="mas"><i class="bi bi-bag-plus-fill"></i> Agregar</button>`;
    });
  }
  // Notas por producto (en el panel "Tu pedido")
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".btn-nota");
    if (!b) return;
    notasItem[b.dataset.ref] = "";
    pintar();
    const inp = document.querySelector(`.nota-item[data-ref="${b.dataset.ref}"]`);
    if (inp) inp.focus();
  });
  document.addEventListener("input", (e) => {
    if (!e.target.classList.contains("nota-item")) return;
    notasItem[e.target.dataset.ref] = e.target.value;
    guardar(); // sin repintar, para no perder el foco mientras escribe
  });
  document.addEventListener("focusout", (e) => {
    const t = e.target;
    if (!t.classList || !t.classList.contains("nota-item") || t.value.trim()) return;
    delete notasItem[t.dataset.ref]; // nota vacía: vuelve a mostrar el botón
    guardar();
    setTimeout(pintar, 0);
  });

  document.addEventListener("click", (e) => {
    const b = e.target.closest(".ctrl-carrito [data-accion]");
    if (!b) return;
    const ref = b.closest(".ctrl-carrito").dataset.ref;
    cambiar(ref, b.dataset.accion === "mas" ? 1 : -1);
  });

  /* ---------- barra flotante + panel ---------- */
  function pintar() {
    pintarControles();
    const n = cantidadTotal();
    const barra = $("barra-carrito");
    barra.classList.toggle("visible", n > 0);
    document.body.classList.toggle("con-carrito", n > 0);
    $("barra-cant").textContent = n;
    $("barra-total").textContent = pesos(subtotal()) + (sinPrecio().length ? " + por confirmar" : "");

    const lista = $("carrito-lista");
    if (!n) {
      lista.innerHTML = `<div class="carrito-vacio"><i class="bi bi-bag"></i><p>Tu pedido está vacío.<br>Agrega productos desde el menú.</p></div>`;
    } else {
      lista.innerHTML = Object.entries(items).map(([r, c]) => {
        const x = porRef[r];
        return `
          <div class="linea">
            ${x.foto ? `<img src="${esc(x.foto)}" alt="">` : ""}
            <div class="linea__info">
              <div class="linea__nombre">${esc(x.nombre)}</div>
              <div class="linea__precio">${tienePrecio(x) ? `${pesos(x.precio)} c/u` : `<span class="pendiente">Precio por confirmar</span>`}</div>
              <span class="ctrl-carrito" data-ref="${esc(r)}"></span>
            </div>
            <div class="linea__total">${tienePrecio(x) ? pesos(x.precio * c) : "—"}</div>
            <div class="linea__nota">
              ${notasItem[r] !== undefined
                ? `<input class="form-control form-control-sm nota-item" data-ref="${esc(r)}" maxlength="120"
                     value="${esc(notasItem[r])}" placeholder="${c > 1 ? "Ej. una sin cebolla, otra sin tomate" : "Ej. sin cebolla, término medio"}"
                     aria-label="Nota para ${esc(x.nombre)}">`
                : `<button type="button" class="btn-nota" data-ref="${esc(r)}"><i class="bi bi-pencil"></i> Agregar nota a este producto</button>`}
            </div>
          </div>`;
      }).join("");
      pintarControles();
    }
    $("carrito-subtotal").textContent = pesos(subtotal());
    $("carrito-aviso-precio").classList.toggle("d-none", !sinPrecio().length);
    $("btn-enviar").disabled = !n;
    $("btn-vaciar").classList.toggle("d-none", !n);
    pintarEntrega();
  }

  function pintarEntrega() {
    const dom = /domicilio/i.test(datos.entrega);
    $("grupo-direccion").classList.toggle("d-none", !dom);
    $("aviso-domicilio").classList.toggle("d-none", !dom);
  }

  /* ---------- mensaje de WhatsApp ---------- */
  function codigoPedido() {
    const t = Date.now().toString(36).toUpperCase();
    return t.slice(-4);
  }
  function mensaje() {
    const lineas = Object.entries(items).map(([r, c]) => {
      const x = porRef[r];
      const nota = (notasItem[r] || "").trim();
      return `• ${c} × ${x.nombre} (${x.ref}) — ${tienePrecio(x) ? pesos(x.precio * c) : "precio por confirmar"}` +
        (nota ? `\n    ↳ _${nota}_` : "");
    });
    const partes = [
      `¡Hola, ${N.nombre}! Quiero hacer este pedido 🍽️`,
      `Pedido #${codigoPedido()}`,
      "",
      ...lineas,
      "",
      `*Subtotal: ${pesos(subtotal())}*${sinPrecio().length ? " (+ productos por confirmar)" : ""}`,
      /domicilio/i.test(datos.entrega) ? "Costo del domicilio: por confirmar" : null,
      "",
      `Entrega: ${({ Domicilios: "Domicilio" })[datos.entrega] || datos.entrega}`,
      `Nombre: ${datos.nombre.trim()}`,
      /domicilio/i.test(datos.entrega) ? `Dirección: ${datos.direccion.trim()}` : null,
      datos.pago ? `Pago: ${datos.pago}` : null,
      datos.notas.trim() ? `Notas del pedido: ${datos.notas.trim()}` : null,
    ];
    return partes.filter((p) => p !== null).join("\n");
  }

  function enviar(e) {
    e.preventDefault();
    const form = $("form-pedido");
    form.classList.add("was-validated");
    if (!form.checkValidity() || !cantidadTotal()) return;
    if (!N.whatsappLink) { alert("Falta configurar el número de WhatsApp del restaurante."); return; }
    window.open(`${N.whatsappLink}?text=${encodeURIComponent(mensaje())}`, "_blank", "noopener");
    $("carrito-enviado").classList.remove("d-none");
  }

  /* ---------- formulario ---------- */
  function montarFormulario() {
    const servicios = N.servicios && N.servicios.length ? N.servicios : ["Domicilios", "Para llevar"];
    $("opciones-entrega").innerHTML = servicios.map((s, i) => `
      <input type="radio" class="btn-check" name="entrega" id="ent-${i}" value="${esc(s)}" ${s === datos.entrega ? "checked" : ""}>
      <label class="btn btn-outline-dark" for="ent-${i}">${esc(s)}</label>`).join("");
    if (!servicios.includes(datos.entrega)) {
      datos.entrega = servicios[0];
      document.querySelector('input[name="entrega"]').checked = true;
    }
    const pagos = N.mediosPago && N.mediosPago.length ? N.mediosPago : null;
    $("grupo-pago").innerHTML = pagos
      ? `<label class="form-label" for="pago">Medio de pago</label>
         <select class="form-select" id="pago"><option value="">Selecciona…</option>${pagos.map((p) => `<option ${p === datos.pago ? "selected" : ""}>${esc(p)}</option>`).join("")}</select>`
      : `<label class="form-label" for="pago">Medio de pago <span class="text-muted">(opcional)</span></label>
         <input class="form-control" id="pago" placeholder="Ej. efectivo, transferencia" value="${esc(datos.pago)}">`;
    $("nombre").value = datos.nombre;
    $("direccion").value = datos.direccion;
    $("notas").value = datos.notas;

    $("form-pedido").addEventListener("input", (e) => {
      const t = e.target;
      if (t.name === "entrega") { datos.entrega = t.value; pintarEntrega(); $("direccion").required = /domicilio/i.test(t.value); }
      if (t.id in datos) datos[t.id] = t.value;
      guardar();
    });
    $("form-pedido").addEventListener("change", (e) => { if (e.target.id === "pago") { datos.pago = e.target.value; guardar(); } });
    $("direccion").required = /domicilio/i.test(datos.entrega);
    $("form-pedido").addEventListener("submit", enviar);
    $("btn-vaciar").addEventListener("click", () => { if (confirm("¿Vaciar el pedido?")) vaciar(); });
    $("btn-nuevo").addEventListener("click", () => { vaciar(); $("carrito-enviado").classList.add("d-none"); });
    // mientras el panel está abierto se ocultan la barra y el botón flotante
    const panel = $("panel-carrito");
    panel.addEventListener("show.bs.offcanvas", () => document.body.classList.add("panel-abierto"));
    panel.addEventListener("hidden.bs.offcanvas", () => document.body.classList.remove("panel-abierto"));
  }

  /* ---------- aviso breve ---------- */
  let tAviso;
  function avisar(texto, ms = 1800) {
    const t = $("toast-carrito");
    t.textContent = texto;
    t.classList.add("visible");
    clearTimeout(tAviso);
    tAviso = setTimeout(() => t.classList.remove("visible"), ms);
  }

  /* ---------- productos agregados desde la revista incrustada ---------- */
  window.addEventListener("message", (e) => {
    const m = e.data;
    const fr = document.getElementById("iframe-revista");
    if (!fr || e.source !== fr.contentWindow) return; // solo mensajes de nuestra revista
    if (!m || m.tipo !== "carrito:agregar" || typeof m.ref !== "string" || !porRef[m.ref]) return;
    agregar(m.ref);
  });

  window.Carrito = { control, agregar, pintar, montar: () => { montarFormulario(); pintar(); } };
})();
