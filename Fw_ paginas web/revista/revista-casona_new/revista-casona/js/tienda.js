/* =========================================================================
   SITIO WEB — La Casona del Sabor
   Carta en línea con pedido por WhatsApp (sin pasarela de pago).
   Lee los mismos datos que la revista y el PDF (data/productos.js).

   1. Utilidades        5. Ficha del plato (modal)
   2. Contenido base    6. Pedido (líneas con indicaciones + mensaje WhatsApp)
   3. Tarjetas          7. Enlaces directos (#plato=REF, #seccion=id)
   4. Carta y búsqueda  8. Inicio
   ========================================================================= */
(function () {
  "use strict";

  const D = window.CATALOGO;
  const N = D.negocio;
  const PRODUCTOS = D.productos;
  const CATS = D.categorias;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------------- 1. UTILIDADES ---------------- */
  const esc = (v) =>
    String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const normal = (t) => String(t ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const pesos = (n) => "$" + Number(n).toLocaleString("es-CO", { maximumFractionDigits: 0 });
  const precioHtml = (p) =>
    p === null || p === undefined ? `<span class="precio precio--consultar">Consultar</span>`
      : `<span class="precio">${pesos(p)}</span>`;
  const porRef = (ref) => PRODUCTOS.find((x) => x.ref === ref);
  const catDe = (x) => CATS.find((c) => c.id === x.categoria) || { nombre: x.categoria, icono: "bi-egg-fried", id: x.categoria };
  const pendiente = (t) => `<span class="pendiente">Por confirmar: ${esc(t)}</span>`;
  const linkWA = (texto) => (N.whatsappLink ? N.whatsappLink + (texto ? `?text=${encodeURIComponent(texto)}` : "") : null);
  const linkIG = () =>
    N.instagram ? (/^https?:/.test(N.instagram) ? N.instagram : `https://instagram.com/${N.instagram.replace(/^@/, "")}`) : null;
  const linkMapa = () => (N.direccion ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(N.direccion)}` : null);
  const almacen = {
    leer(k, def) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (_) { return def; } },
    guardar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} },
  };
  const foto = (x, cls = "") =>
    x.foto ? `<img class="${cls}" src="${esc(x.foto)}" alt="${esc(x.nombre)}" loading="lazy">`
      : `<span class="sinfoto ${cls}"><i class="bi ${esc(catDe(x).icono)}"></i><small>Foto próximamente</small></span>`;

  /* ---------------- 2. CONTENIDO BASE ---------------- */
  function contenidoBase() {
    $("#heroEslogan").textContent = N.eslogan || "";
    $("#heroDesc").textContent = N.descripcion || "";
    $("#heroNumProd").textContent = PRODUCTOS.length;
    $("#heroNumCat").textContent = CATS.length;
    $("#nosotrosNombre").textContent = N.nombre;
    $("#nosotrosDesc").textContent = N.descripcion || "";
    $("#datoCocina").innerHTML = N.tipoComida ? esc(N.tipoComida) : pendiente("tipo de cocina");
    $("#datoPublico").innerHTML = N.publico ? esc(N.publico) : pendiente("público");
    $("#pieEslogan").textContent = (N.eslogan || "") + ".";
    $("#topHorario").textContent = N.horario || "Horario por confirmar";
    $("#anio").textContent = new Date().getFullYear();
    if (D.modoPrueba) $("#topPrueba").hidden = false;

    const waGeneral = linkWA(`Hola, vengo de la página de ${N.nombre} y quiero hacer una consulta`);
    const flot = $("#waFlotante");
    if (waGeneral) flot.href = waGeneral; else flot.remove();

    // Collage del hero: recomendados primero
    const conFoto = PRODUCTOS.filter((x) => x.foto && /\.jpe?g$/i.test(x.foto));
    const hero = [...conFoto.filter((x) => x.destacado), ...conFoto.filter((x) => !x.destacado)].slice(0, 3);
    $("#heroArte").innerHTML = hero.map((x, i) => `
      <figure class="plato-hero plato-hero--${i + 1}">
        <img src="${esc(x.foto)}" alt="" ${i ? 'loading="lazy"' : ""}>
        <figcaption>${esc(x.nombre)}</figcaption>
      </figure>`).join("") + `<img class="hero__sello" src="${esc(N.logo)}" alt="">`;

    const fotosCasa = ["ENT-01", "SOP-02", "POS-02", "TIP-04"].map(porRef).filter((x) => x && x.foto);
    $("#nosotrosFotos").innerHTML = fotosCasa.map((x) => `<img src="${esc(x.foto)}" alt="" loading="lazy">`).join("");

    const links = CATS.map((c) => `<a href="#seccion=${esc(c.id)}">${esc(c.nombre)}</a>`).join("");
    $("#pieCategorias").innerHTML = links;
    $("#menuCategorias").innerHTML = `<h3>La carta</h3>` +
      CATS.map((c) => `<a href="#seccion=${esc(c.id)}" data-bs-dismiss="offcanvas"><i class="bi ${esc(c.icono)}"></i> ${esc(c.nombre)}</a>`).join("");

    const item = (icono, titulo, valor, url, accion) => {
      const v = valor ? esc(valor) : pendiente(titulo.toLowerCase());
      const cuerpo = `<i class="bi ${icono}"></i><div><span class="contacto__t">${titulo}</span><span class="contacto__v">${v}</span>${url ? `<span class="contacto__a">${accion} <i class="bi bi-arrow-up-right"></i></span>` : ""}</div>`;
      return url ? `<a class="contacto__item" href="${esc(url)}" target="_blank" rel="noopener">${cuerpo}</a>` : `<div class="contacto__item">${cuerpo}</div>`;
    };
    $("#gridContacto").innerHTML =
      item("bi-geo-alt-fill", "Dirección", N.direccion, linkMapa(), "Cómo llegar") +
      item("bi-clock-fill", "Horario", N.horario, null) +
      item("bi-whatsapp", "WhatsApp", N.whatsapp, waGeneral, "Escribir") +
      item("bi-instagram", "Instagram", N.instagram, linkIG(), "Ver fotos");
  }

  /* ---------------- 3. TARJETAS ---------------- */
  // Control de cantidad de la tarjeta: muestra el total del plato en el pedido
  function controlCantidad(x) {
    if (x.disponible === false) return `<span class="agotado">No disponible hoy</span>`;
    const n = cantidadDe(x.ref);
    return n
      ? `<div class="cantidad cantidad--tarjeta" data-ctrl="${esc(x.ref)}">
           <button type="button" data-menos="${esc(x.ref)}" aria-label="Quitar uno de ${esc(x.nombre)}"><i class="bi bi-dash"></i></button>
           <span>${n}</span>
           <button type="button" data-mas="${esc(x.ref)}" aria-label="Agregar otro ${esc(x.nombre)}"><i class="bi bi-plus"></i></button>
         </div>`
      : `<button class="btn-agregar" type="button" data-mas="${esc(x.ref)}" aria-label="Agregar ${esc(x.nombre)}"><i class="bi bi-plus-lg"></i><span>Agregar</span></button>`;
  }

  function tarjetaPlato(x) {
    const ingr = (x.ingredientes || []).slice(0, 5).map(esc).join(" · ");
    return `
      <article class="plato${x.disponible === false ? " plato--agotado" : ""}" data-ref="${esc(x.ref)}">
        <button class="plato__foto" type="button" data-abrir="${esc(x.ref)}" aria-label="Ver ${esc(x.nombre)}">
          ${foto(x)}
          ${x.destacado ? `<span class="etq"><i class="bi bi-star-fill"></i></span>` : ""}
        </button>
        <div class="plato__info">
          <div class="plato__top">
            <h4 class="plato__nombre"><button type="button" data-abrir="${esc(x.ref)}">${esc(x.nombre)}</button></h4>
            <span class="plato__puntos" aria-hidden="true"></span>
            ${precioHtml(x.precio)}
          </div>
          ${x.descripcion ? `<p class="plato__desc">${esc(x.descripcion)}</p>` : ""}
          ${ingr ? `<p class="plato__ingr">${ingr}</p>` : ""}
          <div class="plato__pie">
            <span class="plato__porcion">${x.porcion ? `<i class="bi bi-rulers"></i> ${esc(x.porcion)}` : ""}</span>
            <span class="plato__accion" data-accion="${esc(x.ref)}">${controlCantidad(x)}</span>
          </div>
        </div>
      </article>`;
  }

  function tarjetaRecomendado(x) {
    const c = catDe(x);
    return `
      <article class="reco" data-ref="${esc(x.ref)}">
        <button class="reco__foto" type="button" data-abrir="${esc(x.ref)}" aria-label="Ver ${esc(x.nombre)}">
          ${foto(x)}
          <span class="reco__cat"><i class="bi ${esc(c.icono)}"></i> ${esc(c.nombre)}</span>
        </button>
        <div class="reco__info">
          <h3><button type="button" data-abrir="${esc(x.ref)}">${esc(x.nombre)}</button></h3>
          <p>${esc(x.descripcion || "")}</p>
          <div class="reco__pie">
            ${precioHtml(x.precio)}
            <span class="plato__accion" data-accion="${esc(x.ref)}">${controlCantidad(x)}</span>
          </div>
        </div>
      </article>`;
  }

  /* ---------------- 4. CARTA Y BÚSQUEDA ---------------- */
  function pintarCarta(q = "") {
    const nq = normal(q.trim());
    const coincide = (x) => {
      if (!nq) return true;
      const t = normal([x.nombre, x.ref, x.descripcion, catDe(x).nombre, (x.ingredientes || []).join(" ")].join(" "));
      return nq.split(/\s+/).every((p) => t.includes(p));
    };
    let total = 0;
    $("#cartaSecciones").innerHTML = CATS.map((c) => {
      const lista = PRODUCTOS.filter((x) => x.categoria === c.id && coincide(x));
      total += lista.length;
      if (!lista.length) return "";
      return `
        <section class="carta-sec" id="sec-${esc(c.id)}" data-sec="${esc(c.id)}" aria-labelledby="t-${esc(c.id)}">
          <header class="carta-sec__cab">
            <span class="carta-sec__icono"><i class="bi ${esc(c.icono)}"></i></span>
            <div><h3 id="t-${esc(c.id)}">${esc(c.nombre)}</h3><p>${esc(c.intro)}</p></div>
            <span class="carta-sec__n">${lista.length}</span>
          </header>
          <div class="platos">${lista.map(tarjetaPlato).join("")}</div>
        </section>`;
    }).join("");
    $("#vacio").hidden = total > 0;
    const r = $("#resultado");
    r.hidden = !nq;
    r.innerHTML = `<strong>${total}</strong> ${total === 1 ? "resultado" : "resultados"} para «${esc(q)}»`;
    observarSecciones();
  }

  function pintarChips() {
    $("#chips").innerHTML = CATS.map((c) =>
      `<a class="chip" href="#sec-${esc(c.id)}" data-chip="${esc(c.id)}"><i class="bi ${esc(c.icono)}"></i>${esc(c.nombre)}</a>`).join("");
  }

  // Resalta la sección visible en la barra de la carta
  let observador;
  function observarSecciones() {
    if (!("IntersectionObserver" in window)) return;
    if (observador) observador.disconnect();
    observador = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.dataset.sec;
        $$(".chip").forEach((ch) => ch.classList.toggle("chip--on", ch.dataset.chip === id));
        const activo = $(`.chip[data-chip="${id}"]`);
        if (activo) activo.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$(".carta-sec").forEach((s) => observador.observe(s));
  }

  function irSeccion(id) {
    const s = document.getElementById("sec-" + id);
    if (s) s.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function eventosCarta() {
    $("#gridRecomendados").innerHTML = PRODUCTOS.filter((x) => x.destacado).map(tarjetaRecomendado).join("");
    pintarChips();
    pintarCarta();

    $("#chips").addEventListener("click", (e) => {
      const a = e.target.closest("[data-chip]");
      if (!a) return;
      e.preventDefault();
      if ($("#busqueda").value) { $("#busqueda").value = ""; pintarCarta(); }
      irSeccion(a.dataset.chip);
    });
    let t;
    $("#busqueda").addEventListener("input", (e) => {
      clearTimeout(t);
      t = setTimeout(() => pintarCarta(e.target.value), 160);
    });
    $("#limpiarBusqueda").addEventListener("click", () => { $("#busqueda").value = ""; pintarCarta(); });
    $("#btnBuscar").addEventListener("click", () => {
      $("#carta").scrollIntoView({ behavior: "smooth" });
      setTimeout(() => $("#busqueda").focus({ preventScroll: true }), 450);
    });

    document.addEventListener("click", (e) => {
      const mas = e.target.closest("[data-mas]");
      if (mas) { agregar(mas.dataset.mas, 1, ""); return; }
      const menos = e.target.closest("[data-menos]");
      if (menos) { quitarUno(menos.dataset.menos); return; }
      const ab = e.target.closest("[data-abrir]");
      if (ab) { abrirFicha(ab.dataset.abrir); return; }
      const ir = e.target.closest("[data-ir]");
      if (ir) setTimeout(() => $(ir.dataset.ir).scrollIntoView({ behavior: "smooth" }), 300);
    });
  }

  /* ---------------- 5. FICHA DEL PLATO ---------------- */
  const modalFicha = () => bootstrap.Modal.getOrCreateInstance($("#ficha"));

  function abrirFicha(ref) {
    const x = porRef(ref);
    if (!x) return;
    const c = catDe(x);
    const agotado = x.disponible === false;
    const rel = PRODUCTOS.filter((y) => y.categoria === x.categoria && y.ref !== x.ref && y.foto).slice(0, 3);
    $("#fichaCuerpo").innerHTML = `
      <div class="ficha__foto">${foto(x)}
        ${x.destacado ? `<span class="etq etq--txt"><i class="bi bi-star-fill"></i> Recomendado de la casa</span>` : ""}
      </div>
      <div class="ficha__info">
        <span class="kicker"><i class="bi ${esc(c.icono)}"></i> ${esc(c.nombre)}</span>
        <div class="ficha__titulo">
          <h2 id="fichaNombre">${esc(x.nombre)}</h2>
          ${precioHtml(x.precio)}
        </div>
        ${x.descripcion ? `<p class="ficha__desc">${esc(x.descripcion)}</p>` : ""}
        ${x.ingredientes && x.ingredientes.length ? `
          <div class="ficha__ingr"><h3>Ingredientes</h3><div>${x.ingredientes.map((i) => `<span class="tag">${esc(i)}</span>`).join("")}</div></div>` : ""}
        ${x.porcion ? `<p class="ficha__porcion"><i class="bi bi-rulers"></i> Porción: <strong>${esc(x.porcion)}</strong></p>` : ""}
        ${agotado ? `<p class="agotado agotado--grande">No disponible hoy</p>` : `
          <label class="ficha__nota">Indicaciones para la cocina <small>(opcional)</small>
            <textarea id="fichaNota" rows="2" maxlength="140" placeholder="Ej.: sin cebolla, salsa aparte…"></textarea>
          </label>
          <div class="ficha__compra">
            <div class="cantidad" aria-label="Cantidad">
              <button type="button" data-fcant="-1" aria-label="Menos"><i class="bi bi-dash"></i></button>
              <input type="number" id="fichaCant" value="1" min="1" max="30" inputmode="numeric" aria-label="Cantidad">
              <button type="button" data-fcant="1" aria-label="Más"><i class="bi bi-plus"></i></button>
            </div>
            <button class="btn-marca btn-marca--lg ficha__agregar" type="button" id="fichaAgregar">
              <i class="bi bi-basket2"></i> Agregar · <span id="fichaSubtotal">${x.precio != null ? pesos(x.precio) : "Consultar"}</span>
            </button>
          </div>
          <a class="btn-wa btn-wa--linea" id="fichaPedirYa" href="#" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i> Pedir solo este plato por WhatsApp</a>`}
      </div>
      ${rel.length ? `
      <div class="ficha__rel">
        <h3>También en ${esc(c.nombre)}</h3>
        <div class="rel">${rel.map((y) => `
          <button class="rel__item" type="button" data-abrir="${esc(y.ref)}">
            <img src="${esc(y.foto)}" alt="" loading="lazy">
            <span><strong>${esc(y.nombre)}</strong>${y.precio != null ? pesos(y.precio) : "Consultar"}</span>
          </button>`).join("")}</div>
      </div>` : ""}`;

    const cant = $("#fichaCant");
    if (cant) {
      const leer = () => Math.max(1, Math.min(30, parseInt(cant.value, 10) || 1));
      const refrescar = () => {
        if (x.precio != null) $("#fichaSubtotal").textContent = pesos(x.precio * leer());
        const a = $("#fichaPedirYa");
        const url = linkWA(mensajePedido([{ ref: x.ref, n: leer(), nota: $("#fichaNota").value.trim() }], null));
        if (url) a.href = url; else a.remove();
      };
      $$("[data-fcant]", $("#fichaCuerpo")).forEach((b) => b.addEventListener("click", () => {
        cant.value = Math.max(1, Math.min(30, leer() + Number(b.dataset.fcant)));
        refrescar();
      }));
      cant.addEventListener("input", refrescar);
      $("#fichaNota").addEventListener("input", refrescar);
      $("#fichaAgregar").addEventListener("click", () => {
        agregar(x.ref, leer(), $("#fichaNota").value.trim());
        modalFicha().hide();
      });
      refrescar();
    }
    $("#ficha .modal-body").scrollTop = 0;
    history.replaceState(null, "", "#plato=" + x.ref);
    modalFicha().show();
  }

  /* ---------------- 6. PEDIDO ---------------- */
  // Cada línea: { ref, n, nota }. El mismo plato con distinta indicación va en líneas separadas.
  const CLAVE = "casona:pedido";
  let pedido = almacen.leer(CLAVE, []);
  if (!Array.isArray(pedido)) pedido = [];
  pedido = pedido.filter((l) => { const x = porRef(l.ref); return x && x.disponible !== false && l.n > 0; });

  const cantidadDe = (ref) => pedido.filter((l) => l.ref === ref).reduce((s, l) => s + l.n, 0);
  const total = (ls) => ls.reduce((s, l) => s + (porRef(l.ref).precio || 0) * l.n, 0);
  const hayConsultar = (ls) => ls.some((l) => porRef(l.ref).precio == null);

  function agregar(ref, n, nota) {
    const x = porRef(ref);
    if (!x || x.disponible === false) return;
    const linea = pedido.find((l) => l.ref === ref && (l.nota || "") === (nota || ""));
    if (linea) linea.n = Math.min(30, linea.n + n);
    else pedido.push({ ref, n: Math.min(30, n), nota: nota || "" });
    guardarYPintar();
    aviso(`${x.nombre} agregado${n > 1 ? ` (×${n})` : ""}`);
    const b = $(".carrito-btn");
    b.classList.remove("pulso"); void b.offsetWidth; b.classList.add("pulso");
  }

  function quitarUno(ref) {
    // primero la línea sin indicaciones; si no hay, la última agregada
    const lineas = pedido.filter((l) => l.ref === ref);
    const l = lineas.find((z) => !z.nota) || lineas[lineas.length - 1];
    if (!l) return;
    l.n -= 1;
    if (l.n <= 0) pedido.splice(pedido.indexOf(l), 1);
    guardarYPintar();
  }

  function guardarYPintar() {
    almacen.guardar(CLAVE, pedido);
    pintarCarrito();
    // refrescar los controles de cantidad visibles
    $$("[data-accion]").forEach((el) => { el.innerHTML = controlCantidad(porRef(el.dataset.accion)); });
  }

  function datosCliente() {
    const f = $("#carritoDatos");
    const v = (n) => (f.elements[n] && f.elements[n].value ? f.elements[n].value.trim() : "");
    return {
      entrega: (f.querySelector("[name=entrega]:checked") || {}).value || "",
      nombre: v("nombre"), direccion: v("direccion"), hora: v("hora"), nota: v("nota"),
    };
  }

  function mensajePedido(ls, datos) {
    const filas = [];
    ls.forEach((l) => {
      const x = porRef(l.ref);
      filas.push(`• ${l.n} × ${x.nombre} (${x.ref})` + (x.precio != null ? ` — ${pesos(x.precio * l.n)}` : " — precio por confirmar"));
      if (l.nota) filas.push(`   ↳ ${l.nota}`);
    });
    const partes = [
      `Hola, quiero hacer un pedido en ${N.nombre}:`,
      "",
      ...filas,
      "",
      `Total de los platos: ${pesos(total(ls))} ${N.moneda}${hayConsultar(ls) ? " (+ productos por confirmar)" : ""}`,
    ];
    const domicilio = !datos || datos.entrega === "Domicilio";
    if (datos) {
      const extra = [];
      if (datos.entrega) extra.push(`Entrega: ${datos.entrega}`);
      if (domicilio && datos.direccion) extra.push(`Dirección: ${datos.direccion}`);
      if (datos.nombre) extra.push(`Nombre: ${datos.nombre}`);
      if (datos.hora) extra.push(`Para: ${datos.hora}`);
      if (datos.nota) extra.push(`Nota: ${datos.nota}`);
      if (extra.length) partes.push("", ...extra);
    }
    partes.push("", datos && !domicilio
      ? "¿Me confirman el total y a qué hora puedo recogerlo? ¡Gracias!"
      : "¿Me confirman el total con domicilio y el tiempo de entrega? ¡Gracias!");
    return partes.join("\n");
  }

  function pintarCarrito() {
    const nItems = pedido.reduce((s, l) => s + l.n, 0);
    const t = total(pedido);
    $("#cuentaCarrito").textContent = nItems;
    $("#cuentaCarrito").classList.toggle("on", nItems > 0);
    $("#carritoVacio").hidden = pedido.length > 0;
    $("#carritoDatos").hidden = $("#carritoPie").hidden = pedido.length === 0;
    $("#carritoTotal").textContent = pesos(t) + (hayConsultar(pedido) ? " +" : "");
    $("#barraPedido").hidden = nItems === 0;
    $("#barraCant").textContent = nItems;
    $("#barraTotal").textContent = pesos(t);
    document.body.classList.toggle("con-pedido", nItems > 0);

    $("#carritoLista").innerHTML = pedido.map((l, i) => {
      const x = porRef(l.ref);
      return `
      <div class="linea" data-i="${i}">
        <button class="linea__img" type="button" data-abrir="${esc(x.ref)}" aria-label="Ver ${esc(x.nombre)}">${foto(x)}</button>
        <div class="linea__info">
          <strong>${esc(x.nombre)}</strong>
          ${l.nota ? `<span class="linea__nota"><i class="bi bi-chat-left-text"></i> ${esc(l.nota)}</span>` : `<span class="linea__ref">${x.precio != null ? pesos(x.precio) + " c/u" : "Precio por confirmar"}</span>`}
          <div class="linea__ctrl">
            <div class="cantidad cantidad--sm">
              <button type="button" data-linea="-1" aria-label="Quitar uno"><i class="bi bi-dash"></i></button>
              <span aria-live="polite">${l.n}</span>
              <button type="button" data-linea="1" aria-label="Agregar uno"><i class="bi bi-plus"></i></button>
            </div>
            <span class="linea__precio">${x.precio != null ? pesos(x.precio * l.n) : "—"}</span>
          </div>
        </div>
        <button class="linea__quitar" type="button" data-quitar aria-label="Quitar ${esc(x.nombre)}"><i class="bi bi-x-lg"></i></button>
      </div>`;
    }).join("");
    actualizarEnlacePedido();
  }

  function actualizarEnlacePedido() {
    const d = datosCliente();
    $("#campoDireccion").hidden = d.entrega !== "Domicilio";
    const url = pedido.length ? linkWA(mensajePedido(pedido, d)) : null;
    const a = $("#enviarPedido");
    a.href = url || "#";
    a.classList.toggle("deshabilitado", !url);
    $(".carrito__nota").innerHTML = d.entrega === "Domicilio"
      ? `<i class="bi bi-info-circle"></i> No incluye el domicilio. Te confirmamos el total final por WhatsApp.`
      : `<i class="bi bi-info-circle"></i> Te confirmamos por WhatsApp a qué hora puedes recogerlo.`;
  }

  function eventosCarrito() {
    $("#carritoLista").addEventListener("click", (e) => {
      const fila = e.target.closest(".linea");
      if (!fila) return;
      const l = pedido[Number(fila.dataset.i)];
      if (!l) return;
      const d = e.target.closest("[data-linea]");
      if (d) {
        l.n = Math.min(30, l.n + Number(d.dataset.linea));
        if (l.n <= 0) pedido.splice(pedido.indexOf(l), 1);
        guardarYPintar();
      } else if (e.target.closest("[data-quitar]")) {
        pedido.splice(pedido.indexOf(l), 1);
        guardarYPintar();
      } else if (e.target.closest("[data-abrir]")) {
        bootstrap.Offcanvas.getOrCreateInstance($("#carrito")).hide();
      }
    });
    $("#carritoDatos").addEventListener("input", actualizarEnlacePedido);
    $("#carritoDatos").addEventListener("change", actualizarEnlacePedido);
    $("#carritoDatos").addEventListener("submit", (e) => e.preventDefault());
    $("#vaciarCarrito").addEventListener("click", () => {
      if (confirm("¿Vaciar tu pedido?")) { pedido = []; guardarYPintar(); }
    });
    $("#enviarPedido").addEventListener("click", (e) => {
      if (e.currentTarget.classList.contains("deshabilitado")) e.preventDefault();
    });
  }

  let tAviso;
  function aviso(txt) {
    const t = $("#toast");
    $("#toastTxt").textContent = txt;
    t.hidden = false;
    t.classList.remove("on"); void t.offsetWidth; t.classList.add("on");
    clearTimeout(tAviso);
    tAviso = setTimeout(() => { t.classList.remove("on"); setTimeout(() => (t.hidden = true), 300); }, 2600);
  }

  /* ---------------- 7. ENLACES DIRECTOS ---------------- */
  function leerHash() {
    const h = decodeURIComponent(location.hash.slice(1));
    const mp = h.match(/^plato=([\w-]+)$/i);
    const ms = h.match(/^seccion=([\w-]+)$/i);
    if (mp && porRef(mp[1].toUpperCase())) abrirFicha(mp[1].toUpperCase());
    else if (ms) setTimeout(() => irSeccion(ms[1]), 50);
  }
  function eventosNavegacion() {
    window.addEventListener("hashchange", leerHash);
    $("#ficha").addEventListener("hidden.bs.modal", () => {
      if (/^#plato=/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search);
    });
    const cab = $("#cabecera");
    const onScroll = () => cab.classList.toggle("cabecera--scroll", window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- 8. INICIO ---------------- */
  contenidoBase();
  eventosCarta();
  eventosCarrito();
  eventosNavegacion();
  pintarCarrito();
  leerHash();
})();
