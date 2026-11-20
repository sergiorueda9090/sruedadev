/* =========================================================================
   TIENDA — Revista Digitar · Boutique erótica
   Ecommerce sin pasarela: el pedido se arma aquí y se envía por WhatsApp.
   Lee los mismos datos que la revista y el PDF (data/productos.js).

   1. Utilidades        5. Ficha de producto (modal)
   2. Contenido base    6. Pedido (carrito + mensaje de WhatsApp)
   3. Tarjetas          7. Enlaces directos (#producto=REF, #coleccion=id)
   4. Catálogo/filtros  8. Confirmación de edad e inicio
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
    p === null || p === undefined ? `<span class="precio precio--consultar">Consultar precio</span>`
      : `<span class="precio">${pesos(p)}<small>${esc(N.moneda)}</small></span>`;
  const porRef = (ref) => PRODUCTOS.find((x) => x.ref === ref);
  const catDe = (x) => CATS.find((c) => c.id === x.categoria) || { nombre: x.categoria, icono: "bi-heart" };
  const pendiente = (t) => `<span class="pendiente">Por confirmar: ${esc(t)}</span>`;
  const linkWA = (texto) => (N.whatsappLink ? N.whatsappLink + (texto ? `?text=${encodeURIComponent(texto)}` : "") : null);
  const linkIG = () =>
    N.instagram ? (/^https?:/.test(N.instagram) ? N.instagram : `https://instagram.com/${N.instagram.replace(/^@/, "")}`) : null;
  const linkMapa = () => (N.direccion ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(N.direccion)}` : null);
  const almacen = {
    leer(k, def) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (_) { return def; } },
    guardar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} },
  };

  /* ---------------- 2. CONTENIDO BASE ---------------- */
  function contenidoBase() {
    $("#heroKicker").textContent = N.kicker || "Boutique erótica";
    $("#heroEslogan").textContent = N.eslogan || "";
    $("#heroDesc").textContent = N.descripcion || "";
    $("#heroNumProd").textContent = PRODUCTOS.length;
    $("#heroNumCol").textContent = CATS.length;
    $("#pieAviso").textContent = N.aviso || "Solo para mayores de 18 años.";
    $("#faqDiscrecion").innerHTML = `${esc(N.discrecion || "")} Tus datos se usan solo para coordinar tu pedido.`;
    $("#anio").textContent = new Date().getFullYear();
    if (D.modoPrueba) $("#topPrueba").hidden = false;

    const waGeneral = linkWA("Hola, vengo de la tienda Revista Digitar y quiero recibir asesoría");
    const flot = $("#waFlotante");
    if (waGeneral) flot.href = waGeneral; else flot.remove();

    // Colecciones
    const cuenta = (id) => PRODUCTOS.filter((x) => x.categoria === id).length;
    $("#gridColecciones").innerHTML = CATS.map((c, i) => {
      const muestra = PRODUCTOS.find((x) => x.categoria === c.id && x.foto);
      return `
      <a class="coleccion" href="#coleccion=${esc(c.id)}" data-cat="${esc(c.id)}" style="--i:${i}">
        ${muestra ? `<img src="${esc(muestra.foto)}" alt="" loading="lazy">` : ""}
        <span class="coleccion__velo"></span>
        <span class="coleccion__icono"><i class="bi ${esc(c.icono)}"></i></span>
        <span class="coleccion__txt">
          <strong>${esc(c.nombre)}</strong>
          <span>${esc(c.intro)}</span>
          <em>${cuenta(c.id)} productos <i class="bi bi-arrow-right"></i></em>
        </span>
      </a>`;
    }).join("");
    const linksCol = CATS.map((c) => `<a href="#coleccion=${esc(c.id)}">${esc(c.nombre)}</a>`).join("");
    $("#pieColecciones").innerHTML = linksCol;
    $("#menuColecciones").innerHTML = `<h3>Colecciones</h3>` +
      CATS.map((c) => `<a href="#coleccion=${esc(c.id)}" data-bs-dismiss="offcanvas"><i class="bi ${esc(c.icono)}"></i> ${esc(c.nombre)}</a>`).join("");

    // Contacto
    const item = (icono, titulo, valor, url, accion) => {
      const v = valor ? esc(valor) : pendiente(titulo.toLowerCase());
      const cuerpo = `<i class="bi ${icono}"></i><div><span class="contacto__t">${titulo}</span><span class="contacto__v">${v}</span>${url ? `<span class="contacto__a">${accion} <i class="bi bi-arrow-up-right"></i></span>` : ""}</div>`;
      return url ? `<a class="contacto__item" href="${esc(url)}" target="_blank" rel="noopener">${cuerpo}</a>` : `<div class="contacto__item">${cuerpo}</div>`;
    };
    $("#gridContacto").innerHTML =
      item("bi-whatsapp", "WhatsApp", N.whatsapp, waGeneral, "Escribir") +
      item("bi-instagram", "Instagram", N.instagram, linkIG(), "Seguir") +
      item("bi-geo-alt", "Dirección", N.direccion, linkMapa(), "Ver mapa") +
      item("bi-clock", "Horario", N.horario, null);
  }

  /* ---------------- 3. TARJETAS ---------------- */
  function tarjeta(x) {
    const c = catDe(x);
    const agotado = x.disponible === false;
    return `
      <article class="producto${agotado ? " producto--agotado" : ""}" data-ref="${esc(x.ref)}" data-cat="${esc(x.categoria)}">
        <button class="producto__media" type="button" data-abrir="${esc(x.ref)}" aria-label="Ver ${esc(x.nombre)}">
          ${x.foto ? `<img src="${esc(x.foto)}" alt="${esc(x.nombre)}" loading="lazy">` : `<span class="producto__sinfoto"><i class="bi bi-image"></i></span>`}
          ${x.destacado ? `<span class="etq etq--fav"><i class="bi bi-heart-fill"></i> Favorito</span>` : ""}
          ${agotado ? `<span class="etq etq--agotado">Agotado</span>` : ""}
          <span class="producto__ver"><i class="bi bi-eye"></i> Ver detalle y modo de uso</span>
        </button>
        <div class="producto__info">
          <span class="producto__cat"><i class="bi ${esc(c.icono)}"></i> ${esc(c.nombre)}</span>
          <h3 class="producto__nombre"><button type="button" data-abrir="${esc(x.ref)}">${esc(x.nombre)}</button></h3>
          <p class="producto__desc">${esc(x.descripcion || "")}</p>
          ${x.uso && x.uso.cuando ? `<p class="producto__cuando"><i class="bi bi-clock"></i> ${esc(x.uso.cuando)}</p>` : ""}
          <div class="producto__pie">
            ${precioHtml(x.precio)}
            ${agotado
              ? `<a class="btn-mini btn-mini--linea" href="${esc(linkWA(`Hola, ¿cuándo vuelve a estar disponible ${x.nombre} (${x.ref})?`) || "#")}" target="_blank" rel="noopener" aria-label="Consultar disponibilidad de ${esc(x.nombre)}"><i class="bi bi-bell"></i></a>`
              : `<button class="btn-mini" type="button" data-agregar="${esc(x.ref)}" aria-label="Agregar ${esc(x.nombre)} al pedido"><i class="bi bi-bag-plus"></i><span>Agregar</span></button>`}
          </div>
        </div>
      </article>`;
  }

  /* ---------------- 4. CATÁLOGO Y FILTROS ---------------- */
  const estado = { cat: "todas", q: "", orden: "destacados" };

  function pintarChips() {
    const chip = (id, nombre, icono, n) =>
      `<button class="chip${estado.cat === id ? " chip--on" : ""}" type="button" role="tab" aria-selected="${estado.cat === id}" data-chip="${esc(id)}">
        ${icono ? `<i class="bi ${esc(icono)}"></i>` : ""}${esc(nombre)} <span>${n}</span></button>`;
    $("#chips").innerHTML = chip("todas", "Todo", "bi-grid", PRODUCTOS.length) +
      CATS.map((c) => chip(c.id, c.nombre, c.icono, PRODUCTOS.filter((x) => x.categoria === c.id).length)).join("");
  }

  function filtrar() {
    const q = normal(estado.q.trim());
    let lista = PRODUCTOS.filter((x) => estado.cat === "todas" || x.categoria === estado.cat);
    if (q) {
      lista = lista.filter((x) => {
        const texto = normal([x.nombre, x.ref, x.descripcion, catDe(x).nombre, (x.ingredientes || []).join(" "),
          x.uso ? [x.uso.cuando, ...(x.uso.pasos || [])].join(" ") : ""].join(" "));
        return q.split(/\s+/).every((p) => texto.includes(p));
      });
    }
    const orig = (x) => PRODUCTOS.indexOf(x);
    const precio = (x, alto) => (x.precio == null ? (alto ? -1 : Infinity) : x.precio);
    const ordenes = {
      destacados: (a, b) => (a.disponible === false) - (b.disponible === false) || b.destacado - a.destacado || orig(a) - orig(b),
      "precio-asc": (a, b) => precio(a) - precio(b),
      "precio-desc": (a, b) => precio(b, true) - precio(a, true),
      nombre: (a, b) => a.nombre.localeCompare(b.nombre, "es"),
    };
    return lista.sort(ordenes[estado.orden]);
  }

  function pintarCatalogo() {
    const lista = filtrar();
    $("#gridProductos").innerHTML = lista.map(tarjeta).join("");
    $("#vacio").hidden = lista.length > 0;
    const cat = CATS.find((c) => c.id === estado.cat);
    $("#resultado").innerHTML = `<strong>${lista.length}</strong> ${lista.length === 1 ? "producto" : "productos"}` +
      (cat ? ` en <strong>${esc(cat.nombre)}</strong>` : "") + (estado.q ? ` para «${esc(estado.q)}»` : "");
  }

  function elegirColeccion(id, desplazar) {
    estado.cat = CATS.some((c) => c.id === id) ? id : "todas";
    pintarChips();
    pintarCatalogo();
    if (desplazar) $("#catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function eventosCatalogo() {
    $("#gridFavoritos").innerHTML = PRODUCTOS.filter((x) => x.destacado).map(tarjeta).join("");
    pintarChips();
    pintarCatalogo();

    $("#chips").addEventListener("click", (e) => {
      const b = e.target.closest("[data-chip]");
      if (b) elegirColeccion(b.dataset.chip, false);
    });
    let t;
    $("#busqueda").addEventListener("input", (e) => {
      clearTimeout(t);
      t = setTimeout(() => { estado.q = e.target.value; pintarCatalogo(); }, 160);
    });
    $("#orden").addEventListener("change", (e) => { estado.orden = e.target.value; pintarCatalogo(); });
    $("#limpiarFiltros").addEventListener("click", () => {
      estado.q = ""; $("#busqueda").value = ""; elegirColeccion("todas", false);
    });
    $("#btnBuscar").addEventListener("click", () => {
      $("#catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => $("#busqueda").focus({ preventScroll: true }), 450);
    });

    // Delegación: abrir ficha / agregar al pedido desde cualquier tarjeta
    document.addEventListener("click", (e) => {
      const ag = e.target.closest("[data-agregar]");
      if (ag) { agregar(ag.dataset.agregar, 1); return; }
      const ab = e.target.closest("[data-abrir]");
      if (ab) abrirFicha(ab.dataset.abrir);
      const ir = e.target.closest("[data-ir]");
      if (ir) setTimeout(() => $(ir.dataset.ir).scrollIntoView({ behavior: "smooth" }), 300);
    });
  }

  /* ---------------- 5. FICHA DE PRODUCTO ---------------- */
  const modalFicha = () => bootstrap.Modal.getOrCreateInstance($("#ficha"));
  let fichaActual = null;

  function abrirFicha(ref) {
    const x = porRef(ref);
    if (!x) return;
    fichaActual = x;
    const c = catDe(x);
    const agotado = x.disponible === false;
    const u = x.uso;
    const relacionados = PRODUCTOS.filter((y) => y.categoria === x.categoria && y.ref !== x.ref).slice(0, 3);
    $("#fichaCuerpo").innerHTML = `
      <div class="ficha__grid" data-cat="${esc(x.categoria)}">
        <div class="ficha__media">
          ${x.foto ? `<img src="${esc(x.foto)}" alt="${esc(x.nombre)}">` : `<span class="producto__sinfoto"><i class="bi bi-image"></i></span>`}
          ${x.destacado ? `<span class="etq etq--fav"><i class="bi bi-heart-fill"></i> Favorito</span>` : ""}
          ${agotado ? `<span class="etq etq--agotado">Agotado</span>` : ""}
          <p class="ficha__ilustrativa"><i class="bi bi-info-circle"></i> Imagen ilustrativa. Solicita fotos reales del producto por WhatsApp.</p>
        </div>
        <div class="ficha__info">
          <span class="producto__cat"><i class="bi ${esc(c.icono)}"></i> ${esc(c.nombre)} · Ref. ${esc(x.ref)}</span>
          <h2 id="fichaNombre">${esc(x.nombre)}</h2>
          <div class="ficha__precio">${precioHtml(x.precio)}</div>
          <p class="ficha__desc">${esc(x.descripcion || "")}</p>
          <ul class="ficha__datos">
            ${x.ingredientes && x.ingredientes.length ? `<li><span>Incluye</span><div>${x.ingredientes.map((i) => `<b class="tag">${esc(i)}</b>`).join("")}</div></li>` : ""}
            ${x.porcion ? `<li><span>Presentación</span><div><b class="tag tag--suave"><i class="bi bi-tag"></i> ${esc(x.porcion)}</b></div></li>` : ""}
            <li><span>Disponibilidad</span><div>${agotado ? `<b class="tag tag--agotado">Agotado</b>` : `<b class="tag tag--ok"><i class="bi bi-check2"></i> Disponible · se confirma al pedir</b>`}</div></li>
          </ul>

          ${agotado ? `
            <a class="btn-wa" href="${esc(linkWA(`Hola, ¿cuándo vuelve a estar disponible ${x.nombre} (${x.ref})?`) || "#")}" target="_blank" rel="noopener"><i class="bi bi-bell"></i> Avísame cuando esté disponible</a>
          ` : `
            <div class="ficha__compra">
              <div class="cantidad" aria-label="Cantidad">
                <button type="button" data-cant="-1" aria-label="Menos"><i class="bi bi-dash"></i></button>
                <input type="number" id="fichaCant" value="1" min="1" max="20" inputmode="numeric" aria-label="Cantidad">
                <button type="button" data-cant="1" aria-label="Más"><i class="bi bi-plus"></i></button>
              </div>
              <button class="btn-marca btn-marca--lg ficha__agregar" type="button" id="fichaAgregar"><i class="bi bi-bag-plus"></i> Agregar al pedido</button>
            </div>
            <a class="btn-wa btn-wa--linea" id="fichaPedirYa" href="#" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i> Pedir solo este producto por WhatsApp</a>
          `}
          <button class="ficha__compartir" type="button" id="fichaCompartir"><i class="bi bi-link-45deg"></i> Copiar enlace del producto</button>

          ${u ? `
          <section class="uso" aria-labelledby="usoTit">
            <div class="uso__cab">
              <h3 id="usoTit"><i class="bi bi-journal-text"></i> Modo de uso</h3>
              <span class="uso__cuando"><i class="bi bi-clock"></i> ${esc(u.cuando || "")}</span>
            </div>
            <ol class="uso__pasos">${(u.pasos || []).map((p) => `<li>${esc(p)}</li>`).join("")}</ol>
            ${u.nota ? `<p class="uso__nota"><i class="bi bi-shield-check"></i> ${esc(u.nota)}</p>` : ""}
            <p class="uso__legal">Indicaciones orientativas. Sigue siempre el manual o la etiqueta del fabricante.</p>
          </section>` : ""}
        </div>
      </div>
      ${relacionados.length ? `
      <div class="ficha__rel">
        <h3>También en ${esc(c.nombre)}</h3>
        <div class="rel">${relacionados.map((y) => `
          <button class="rel__item" type="button" data-abrir="${esc(y.ref)}">
            ${y.foto ? `<img src="${esc(y.foto)}" alt="" loading="lazy">` : ""}
            <span><strong>${esc(y.nombre)}</strong>${y.precio != null ? pesos(y.precio) : "Consultar precio"}</span>
          </button>`).join("")}</div>
      </div>` : ""}`;

    const cant = $("#fichaCant");
    const actualizarPedirYa = () => {
      const a = $("#fichaPedirYa");
      if (!a) return;
      const n = Math.max(1, Math.min(20, parseInt(cant.value, 10) || 1));
      const url = linkWA(mensajePedido([{ x, n }]));
      if (url) a.href = url; else a.remove();
    };
    if (cant) {
      $$("[data-cant]", $("#fichaCuerpo")).forEach((b) =>
        b.addEventListener("click", () => {
          cant.value = Math.max(1, Math.min(20, (parseInt(cant.value, 10) || 1) + Number(b.dataset.cant)));
          actualizarPedirYa();
        }));
      cant.addEventListener("input", actualizarPedirYa);
      $("#fichaAgregar").addEventListener("click", () => {
        agregar(x.ref, Math.max(1, Math.min(20, parseInt(cant.value, 10) || 1)));
        modalFicha().hide();
      });
      actualizarPedirYa();
    }
    $("#fichaCompartir").addEventListener("click", async (e) => {
      const url = location.href.split("#")[0] + "#producto=" + x.ref;
      try { await navigator.clipboard.writeText(url); e.currentTarget.innerHTML = `<i class="bi bi-check2"></i> Enlace copiado`; }
      catch (_) { prompt("Copia el enlace del producto:", url); }
    });

    $("#ficha .modal-body").scrollTop = 0;
    history.replaceState(null, "", "#producto=" + x.ref);
    modalFicha().show();
  }

  /* ---------------- 6. PEDIDO ---------------- */
  const CLAVE = "digitar:pedido";
  let pedido = almacen.leer(CLAVE, {});
  // descartar referencias que ya no existen o están agotadas
  Object.keys(pedido).forEach((r) => { const x = porRef(r); if (!x || x.disponible === false || !(pedido[r] > 0)) delete pedido[r]; });

  const lineas = () => Object.entries(pedido).map(([r, n]) => ({ x: porRef(r), n })).filter((l) => l.x);
  const total = (ls) => ls.reduce((s, l) => s + (l.x.precio || 0) * l.n, 0);
  const hayConsultar = (ls) => ls.some((l) => l.x.precio == null);

  function agregar(ref, n) {
    const x = porRef(ref);
    if (!x || x.disponible === false) return;
    pedido[ref] = Math.min(20, (pedido[ref] || 0) + n);
    guardarYPintar();
    aviso(`${x.nombre} agregado a tu pedido`);
    const b = $(".carrito-btn");
    b.classList.remove("pulso"); void b.offsetWidth; b.classList.add("pulso");
  }

  function guardarYPintar() {
    almacen.guardar(CLAVE, pedido);
    pintarCarrito();
  }

  function datosCliente() {
    const f = $("#carritoDatos");
    const v = (n) => (f.elements[n] && f.elements[n].value ? f.elements[n].value.trim() : "");
    return { nombre: v("nombre"), ciudad: v("ciudad"), entrega: (f.querySelector("[name=entrega]:checked") || {}).value || "", nota: v("nota") };
  }

  function mensajePedido(ls, datos) {
    const filas = ls.map((l) =>
      `• ${l.n} × ${l.x.nombre} (${l.x.ref})` + (l.x.precio != null ? ` — ${pesos(l.x.precio * l.n)}` : " — precio por confirmar"));
    const t = total(ls);
    const partes = [
      "Hola, quiero hacer este pedido desde la tienda Revista Digitar:",
      "",
      ...filas,
      "",
      `Total estimado: ${pesos(t)} ${N.moneda}${hayConsultar(ls) ? " (+ productos por cotizar)" : ""}`,
    ];
    if (datos) {
      const extra = [];
      if (datos.nombre) extra.push(`Nombre: ${datos.nombre}`);
      if (datos.ciudad) extra.push(`Ciudad: ${datos.ciudad}`);
      if (datos.entrega) extra.push(`Entrega: ${datos.entrega}`);
      if (datos.nota) extra.push(`Nota: ${datos.nota}`);
      if (extra.length) partes.push("", ...extra);
    }
    partes.push("", "Quedo pendiente de la confirmación de disponibilidad, pago y entrega. ¡Gracias!");
    return partes.join("\n");
  }

  function pintarCarrito() {
    const ls = lineas();
    const nItems = ls.reduce((s, l) => s + l.n, 0);
    const t = total(ls);
    $("#cuentaCarrito").textContent = nItems;
    $("#cuentaCarrito").classList.toggle("on", nItems > 0);
    $("#carritoVacio").hidden = ls.length > 0;
    $("#carritoDatos").hidden = $("#carritoPie").hidden = ls.length === 0;
    $("#carritoTotal").textContent = pesos(t) + (hayConsultar(ls) ? " + por cotizar" : "");
    $("#barraPedido").hidden = nItems === 0;
    $("#barraCant").textContent = nItems;
    $("#barraTotal").textContent = pesos(t);
    document.body.classList.toggle("con-pedido", nItems > 0);

    $("#carritoLista").innerHTML = ls.map(({ x, n }) => `
      <div class="linea" data-ref="${esc(x.ref)}">
        <button class="linea__img" type="button" data-abrir="${esc(x.ref)}" aria-label="Ver ${esc(x.nombre)}">${x.foto ? `<img src="${esc(x.foto)}" alt="">` : ""}</button>
        <div class="linea__info">
          <strong>${esc(x.nombre)}</strong>
          <span class="linea__ref">Ref. ${esc(x.ref)}${x.porcion ? ` · ${esc(x.porcion)}` : ""}</span>
          <div class="linea__ctrl">
            <div class="cantidad cantidad--sm">
              <button type="button" data-linea="-1" aria-label="Quitar uno"><i class="bi bi-dash"></i></button>
              <span aria-live="polite">${n}</span>
              <button type="button" data-linea="1" aria-label="Agregar uno"><i class="bi bi-plus"></i></button>
            </div>
            <span class="linea__precio">${x.precio != null ? pesos(x.precio * n) : "Por cotizar"}</span>
          </div>
        </div>
        <button class="linea__quitar" type="button" data-quitar aria-label="Quitar ${esc(x.nombre)}"><i class="bi bi-x-lg"></i></button>
      </div>`).join("");
    actualizarEnlacePedido();
  }

  function actualizarEnlacePedido() {
    const ls = lineas();
    const url = ls.length ? linkWA(mensajePedido(ls, datosCliente())) : null;
    const a = $("#enviarPedido");
    a.href = url || "#";
    a.classList.toggle("deshabilitado", !url);
  }

  function eventosCarrito() {
    $("#carritoLista").addEventListener("click", (e) => {
      const fila = e.target.closest(".linea");
      if (!fila) return;
      const ref = fila.dataset.ref;
      const d = e.target.closest("[data-linea]");
      if (d) {
        pedido[ref] = Math.max(0, Math.min(20, (pedido[ref] || 0) + Number(d.dataset.linea)));
        if (!pedido[ref]) delete pedido[ref];
        guardarYPintar();
      } else if (e.target.closest("[data-quitar]")) {
        delete pedido[ref];
        guardarYPintar();
      } else if (e.target.closest("[data-abrir]")) {
        bootstrap.Offcanvas.getOrCreateInstance($("#carrito")).hide();
      }
    });
    $("#carritoDatos").addEventListener("input", actualizarEnlacePedido);
    $("#carritoDatos").addEventListener("submit", (e) => e.preventDefault());
    $("#vaciarCarrito").addEventListener("click", () => {
      if (confirm("¿Vaciar tu pedido?")) { pedido = {}; guardarYPintar(); }
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
    tAviso = setTimeout(() => { t.classList.remove("on"); setTimeout(() => (t.hidden = true), 300); }, 2800);
  }

  /* ---------------- 7. ENLACES DIRECTOS ---------------- */
  function leerHash() {
    const h = decodeURIComponent(location.hash.slice(1));
    const mp = h.match(/^producto=([\w-]+)$/i);
    const mc = h.match(/^coleccion=([\w-]+)$/i);
    if (mp && porRef(mp[1].toUpperCase())) abrirFicha(mp[1].toUpperCase());
    else if (mc) elegirColeccion(mc[1], true);
  }
  function eventosNavegacion() {
    window.addEventListener("hashchange", leerHash);
    $("#ficha").addEventListener("hidden.bs.modal", () => {
      if (/^#producto=/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search);
      fichaActual = null;
    });
    // Sombra del encabezado al hacer scroll
    const cab = $("#cabecera");
    const onScroll = () => cab.classList.toggle("cabecera--scroll", window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- 8. EDAD E INICIO ---------------- */
  function edad() {
    const CLAVE_EDAD = "revista:mayor18"; // compartida con revista.html
    const caja = $("#edad");
    if (!caja) return;
    let ok = false;
    try { ok = sessionStorage.getItem(CLAVE_EDAD) === "si"; } catch (_) {}
    if (ok) return;
    caja.hidden = false;
    document.body.classList.add("bloqueado");
    $("#edadSi").focus();
    $("#edadSi").onclick = () => {
      try { sessionStorage.setItem(CLAVE_EDAD, "si"); } catch (_) {}
      caja.hidden = true;
      document.body.classList.remove("bloqueado");
    };
    $("#edadNo").onclick = () => { $("#edadBotones").hidden = true; $("#edadSalida").hidden = false; };
  }

  edad();
  contenidoBase();
  eventosCatalogo();
  eventosCarrito();
  eventosNavegacion();
  pintarCarrito();
  leerHash();
})();
