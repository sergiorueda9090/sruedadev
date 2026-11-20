/* =========================================================================
   CARRITO COMPARTIDO + PIEZAS COMUNES DE LA TIENDA
   Lo usan sitio.html, tienda.html, producto.html y carrito.html.
   - Sin pasarela de pago: el carrito termina en una SOLICITUD DE COTIZACIÓN
     que se envía completa por WhatsApp.
   - Cada línea = referencia + color. Se guarda en el navegador (localStorage)
     y se sincroniza entre pestañas.
   - window.Tienda: utilidades, cabecera, pie, aviso, tarjeta de producto.
   ========================================================================= */
(function () {
  "use strict";

  const D = window.REVISTA;
  const N = D.negocio;
  const CR = window.CREDITOS_FOTOS || {};
  const CLAVE = "carrito:" + N.nombre;
  const MAX = 99; // tiendas y distribuidores piden varias unidades
  const porRef = Object.fromEntries(D.productos.map((p) => [p.ref, p]));

  /* ---------- utilidades ---------- */
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const vacio = (v) => v === null || v === undefined || v === "" || (Array.isArray(v) && !v.length);
  const pesos = (n) => `$${Number(n).toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;
  const sinTildes = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const wa = (t) => (N.whatsappLink ? N.whatsappLink + (t ? `?text=${encodeURIComponent(t)}` : "") : null);
  const insta = () => (N.instagram ? (/^https?:/.test(N.instagram) ? N.instagram : `https://instagram.com/${N.instagram.replace(/^@/, "")}`) : null);
  const qrSvg = (texto) => {
    if (!texto || typeof qrcode !== "function") return "";
    const q = qrcode(0, "M"); q.addData(texto); q.make();
    return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
  };
  const PROP = {
    electrico: { nombre: "Eléctricos", uno: "Eléctrico", icono: "bi-lightning-charge-fill", texto: "Con batería recargable" },
    gasolina: { nombre: "A gasolina", uno: "Gasolina", icono: "bi-fuel-pump-fill", texto: "Con supervisión adulta" },
    pedales: { nombre: "De pedales", uno: "Pedales", icono: "bi-bicycle", texto: "Con la fuerza del niño" },
    accesorio: { nombre: "Accesorios", uno: "Accesorio", icono: "bi-shield-check", texto: "Protección y repuestos" },
  };
  const etiqueta = (p) => {
    const P = PROP[p.propulsion] || { uno: "Por confirmar", icono: "bi-question-circle" };
    const s = p.specs || {};
    const extra = p.propulsion === "electrico" && s.bateria ? ` ${s.bateria.split("·")[0].trim()}` : p.propulsion === "gasolina" && s.cilindraje ? ` ${s.cilindraje}` : "";
    return `<span class="prop prop--${esc(p.propulsion)}"><i class="bi ${P.icono}"></i>${P.uno}${esc(extra)}</span>`;
  };
  const SPECS = [
    ["edad", "Edad recomendada"], ["bateria", "Batería"], ["motor", "Motor"], ["cilindraje", "Cilindraje"],
    ["potencia", "Potencia"], ["velocidad", "Velocidad"], ["autonomia", "Autonomía"], ["arranque", "Arranque"],
    ["transmision", "Transmisión"], ["pesoMax", "Peso máximo"], ["ocupantes", "Ocupantes"], ["carga", "Tiempo de carga"],
    ["dimensiones", "Medidas"],
  ];
  const specsDe = (p) => SPECS.filter(([k]) => !vacio((p.specs || {})[k])).map(([k, n]) => [n, p.specs[k]]);
  const rangoEdad = (p) => {
    const m = ((p.specs || {}).edad || "").match(/(\d+)\s*a\s*(\d+)\s*años/);
    return m ? [parseInt(m[1], 10), parseInt(m[2], 10)] : null;
  };
  const precioHTML = (p) => typeof p.precio === "number"
    ? `<small>Precio</small><b>${pesos(p.precio)}</b>`
    : `<small>Precio</small><b>Consultar</b>`;
  const urlProducto = (ref) => `producto.html?ref=${encodeURIComponent(ref)}`;
  // foto que corresponde al color elegido (si el color tiene foto propia)
  const fotoDe = (p, color) => ((p.colores || []).find((c) => c.nombre === color) || {}).foto || p.foto;
  // fotos del producto sin repetir: la principal primero
  const galeria = (p) => [...new Set([p.foto, ...(p.fotos || [])].filter(Boolean))];

  /* ---------- carrito ---------- */
  // líneas: { "CE-01|Blanco": { ref, color, unidades } }
  let lineas = {};
  let datos = { nombre: "", celular: "", ciudad: "", direccion: "", tipo: "Familia", pago: "", notas: "" };
  function cargar() {
    try {
      const g = JSON.parse(localStorage.getItem(CLAVE) || "null");
      lineas = {};
      if (g && g.lineas) Object.entries(g.lineas).forEach(([k, l]) => { if (porRef[l.ref] && porRef[l.ref].disponible !== false) lineas[k] = l; });
      if (g && g.datos) datos = Object.assign(datos, g.datos);
    } catch (_) { /* sin almacenamiento: funciona igual en esta pestaña */ }
  }
  const guardar = () => { try { localStorage.setItem(CLAVE, JSON.stringify({ lineas, datos })); } catch (_) {} avisarCambio(); };
  const avisarCambio = () => document.dispatchEvent(new CustomEvent("carrito:cambio"));
  cargar();
  // otra pestaña cambió el carrito
  window.addEventListener("storage", (e) => { if (e.key === CLAVE) { cargar(); avisarCambio(); } });

  const colorPorDefecto = (p) => ((p.colores || [])[0] || {}).nombre || "";
  const Carrito = {
    lineas: () => Object.entries(lineas).map(([clave, l]) => ({ clave, ...l, producto: porRef[l.ref] })),
    cantidad: () => Object.values(lineas).reduce((s, l) => s + l.unidades, 0),
    tiene: (ref) => Object.values(lineas).some((l) => l.ref === ref),
    agregar(ref, color, unidades = 1) {
      const p = porRef[ref];
      if (!p || p.disponible === false) return false;
      const c = color || colorPorDefecto(p);
      const k = `${ref}|${c}`;
      if (lineas[k]) lineas[k].unidades = Math.min(MAX, lineas[k].unidades + unidades);
      else lineas[k] = { ref, color: c, unidades: Math.min(MAX, unidades) };
      guardar();
      avisar(`${p.nombre}${c ? ` (${c})` : ""} agregado al carrito`, true);
      return true;
    },
    cambiar(clave, unidades) {
      if (!lineas[clave]) return;
      lineas[clave].unidades = Math.max(1, Math.min(MAX, unidades | 0 || 1));
      guardar();
    },
    quitar(clave) { delete lineas[clave]; guardar(); },
    // cambia el color de una línea sin moverla de lugar; si ya existe ese color, suma las unidades
    cambiarColor(clave, color) {
      const l = lineas[clave];
      if (!l || l.color === color) return;
      const nueva = `${l.ref}|${color}`;
      const resultado = {};
      Object.entries(lineas).forEach(([k, x]) => {
        if (k === nueva) return;
        if (k === clave) resultado[nueva] = { ref: l.ref, color, unidades: Math.min(MAX, l.unidades + (lineas[nueva] ? lineas[nueva].unidades : 0)) };
        else resultado[k] = x;
      });
      lineas = resultado;
      guardar();
    },
    vaciar() { lineas = {}; guardar(); },
    subtotal: (l) => (typeof porRef[l.ref].precio === "number" ? porRef[l.ref].precio * l.unidades : null),
    total() { return Object.values(lineas).reduce((s, l) => s + (Carrito.subtotal(l) || 0), 0); },
    sinPrecio() { return Object.values(lineas).some((l) => Carrito.subtotal(l) === null); },
    get datos() { return datos; },
    guardarDatos(d) { datos = Object.assign(datos, d); try { localStorage.setItem(CLAVE, JSON.stringify({ lineas, datos })); } catch (_) {} },
    MAX,
  };

  /* ---------- aviso ---------- */
  let tAviso;
  function avisar(texto, conEnlace) {
    let a = document.getElementById("aviso");
    if (!a) { a = document.createElement("div"); a.id = "aviso"; a.className = "aviso"; a.setAttribute("role", "status"); a.setAttribute("aria-live", "polite"); document.body.appendChild(a); }
    a.innerHTML = `${esc(texto)}${conEnlace && !/carrito\.html/.test(location.pathname) ? ` <a href="carrito.html">Ver carrito</a>` : ""}`;
    a.classList.add("visible");
    clearTimeout(tAviso);
    tAviso = setTimeout(() => a.classList.remove("visible"), 2600);
  }

  /* ---------- cabecera y pie compartidos ---------- */
  function cabecera(activa) {
    const h = document.getElementById("cabecera");
    if (!h) return;
    const link = (href, txt, id) => `<li><a href="${href}" ${activa === id ? 'aria-current="page"' : ""}>${txt}</a></li>`;
    h.innerHTML = `
      ${D.modoPrueba ? `<div class="aviso-prueba">Tienda de prueba: el nombre y el contacto de la empresa son de ejemplo</div>` : ""}
      <div class="cab">
        <div class="container cab__fila">
          <a class="cab__marca" href="sitio.html"><img src="${esc(N.logo)}" alt="" width="40" height="40"><span>${esc(N.nombre)}</span></a>
          <form class="cab__buscar" action="tienda.html" role="search">
            <label class="visually-hidden" for="cab-q">Buscar vehículos</label>
            <i class="bi bi-search" aria-hidden="true"></i>
            <input id="cab-q" name="q" type="search" class="form-control" placeholder="Buscar por nombre, referencia o color" value="${esc(new URLSearchParams(location.search).get("q") || "")}">
          </form>
          <a class="cab__carrito" href="carrito.html" ${activa === "carrito" ? 'aria-current="page"' : ""}><i class="bi bi-cart3"></i><span>Carrito</span><b class="cab__cant" id="cab-cant">0</b></a>
        </div>
        <nav class="container cab__nav" aria-label="Principal">
          <ul>
            ${link("sitio.html", "Inicio", "inicio")}
            ${link("tienda.html", "Tienda", "tienda")}
            ${["electrico", "gasolina", "pedales"].filter((k) => D.productos.some((p) => p.propulsion === k))
              .map((k) => `<li><a class="cab__prop cab__prop--${k}" href="tienda.html?prop=${k}">${PROP[k].nombre}</a></li>`).join("")}
            ${link("revista.html", "Revista", "revista")}
          </ul>
        </nav>
      </div>`;
    const pintar = () => {
      const n = Carrito.cantidad();
      const c = document.getElementById("cab-cant");
      c.textContent = n;
      c.classList.toggle("activo", n > 0);
      c.setAttribute("aria-label", `${n} ${n === 1 ? "unidad" : "unidades"} en el carrito`);
    };
    pintar();
    document.addEventListener("carrito:cambio", pintar);
  }

  function pie() {
    const f = document.getElementById("pie");
    if (!f) return;
    const MSG = `Hola, vi la tienda de ${N.nombre} y quiero información`;
    const item = (url, icono, texto) => vacio(texto) ? "" :
      (url ? `<li><a href="${esc(url)}" target="_blank" rel="noopener"><i class="bi ${icono}"></i>${esc(texto)}</a></li>` : `<li><i class="bi ${icono}"></i>${esc(texto)}</li>`);
    const cr = Object.entries(CR);
    f.innerHTML = `
      <div class="container pie__grid">
        <div>
          <span class="pie__marca"><img src="${esc(N.logo)}" alt="" width="32" height="32">${esc(N.nombre)}</span>
          <p class="pie__texto">Sin pago en línea: arma tu carrito y te enviamos la cotización con disponibilidad y envío por WhatsApp.</p>
        </div>
        <ul class="pie__lista">
          ${item(wa(MSG), "bi-whatsapp", N.whatsapp)}
          ${item(N.telefono ? `tel:${N.telefono.replace(/\s/g, "")}` : null, "bi-telephone", N.telefono)}
          ${item(N.correo ? `mailto:${N.correo}` : null, "bi-envelope", N.correo)}
          ${item(insta(), "bi-instagram", N.instagram)}
          ${item(null, "bi-map", [N.ciudad, N.pais].filter(Boolean).join(", "))}
          ${item(null, "bi-truck", N.cobertura)}
          ${item(null, "bi-geo-alt", N.direccion)}
          ${item(null, "bi-clock", N.horario)}
          <li><a href="politica-datos.html"><i class="bi bi-file-earmark-lock"></i>Política de tratamiento de datos</a></li>
        </ul>
      </div>
      ${cr.length ? `<div class="container"><details class="pie__creditos"><summary>Créditos de fotografías</summary>${cr.map(([ref, c]) =>
        `<div>${esc(ref)}: <a href="${esc(c.pagina)}" target="_blank" rel="noopener">${esc(c.archivo.replace(/^File:/, ""))}</a>, ${esc(c.autor || "autor desconocido")}, ${c.licencia_url ? `<a href="${esc(c.licencia_url)}" target="_blank" rel="noopener">${esc(c.licencia)}</a>` : esc(c.licencia)}</div>`).join("")}</details></div>` : ""}`;
  }

  /* ---------- carrusel de banners (inicio y tienda) ---------- */
  // Dibuja D.banners dentro de `el`. En la tienda, si el banner lleva a la categoría que ya se está viendo, el clic no recarga.
  function carrusel(el) {
    const B = D.banners || [];
    if (!el || !B.length) { if (el) el.remove(); return; }
    const id = "carrusel";
    el.innerHTML = `
      <div id="${id}" class="carousel slide" data-bs-ride="carousel" data-bs-interval="6000" data-bs-pause="hover">
        ${B.length > 1 ? `<div class="carousel-indicators">${B.map((b, i) => `<button type="button" data-bs-target="#${id}" data-bs-slide-to="${i}" ${i ? "" : 'class="active" aria-current="true"'} aria-label="${esc(b.alt)}"></button>`).join("")}</div>` : ""}
        <div class="carousel-inner">
          ${B.map((b, i) => `
          <div class="carousel-item${i ? "" : " active"}">
            <a href="${esc(b.url)}">
              <img src="assets/banners/${esc(b.img)}-1600.webp" srcset="assets/banners/${esc(b.img)}-800.webp 800w, assets/banners/${esc(b.img)}-1600.webp 1600w"
                   sizes="(min-width: 1400px) 1320px, 100vw" width="2200" height="814" alt="${esc(b.alt)}. ${esc(b.ver || "")}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}>
            </a>
          </div>`).join("")}
        </div>
        ${B.length > 1 ? `
        <button class="carousel-control-prev" type="button" data-bs-target="#${id}" data-bs-slide="prev" aria-label="Banner anterior"><i class="bi bi-chevron-left" aria-hidden="true"></i></button>
        <button class="carousel-control-next" type="button" data-bs-target="#${id}" data-bs-slide="next" aria-label="Banner siguiente"><i class="bi bi-chevron-right" aria-hidden="true"></i></button>` : ""}
      </div>`;
    if (window.bootstrap) {
      const c = bootstrap.Carousel.getOrCreateInstance(document.getElementById(id));
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) c.pause(); // no avanza solo
      else c.cycle();
    }
  }

  /* ---------- tarjeta de producto (tienda y relacionados) ---------- */
  function tarjeta(p) {
    const sp = specsDe(p).slice(0, 3);
    const agotado = p.disponible === false;
    return `
      <article class="tarjeta prop-borde--${esc(p.propulsion)}" data-ref="${esc(p.ref)}">
        <a class="tarjeta__foto" href="${urlProducto(p.ref)}" aria-label="Ver ${esc(p.nombre)}">
          <img src="${esc(p.foto)}" alt="${esc(p.nombre)}" loading="lazy"${p.fotoAmbiente ? ' class="foto--ambiente"' : ""}>
          ${agotado ? `<span class="agotado">Agotado por ahora</span>` : ""}
        </a>
        <div class="tarjeta__cuerpo">
          <div class="tarjeta__tags">${etiqueta(p)}<span class="ref">Ref. ${esc(p.ref)}</span></div>
          <h3><a href="${urlProducto(p.ref)}">${esc(p.nombre)}</a></h3>
          ${sp.length ? `<dl class="cifras">${sp.map(([k, v]) => `<div${k === "Medidas" ? ' class="cifra--ancha"' : ""}><dd>${esc(v)}</dd><dt>${esc(k)}</dt></div>`).join("")}</dl>` : ""}
          ${(p.colores || []).length > 1 ? `<div class="mini-colores" aria-label="${p.colores.length} colores">${p.colores.map((c) => `<i style="background:${esc(c.hex)}" title="${esc(c.nombre)}"></i>`).join("")}<span>${p.colores.length} colores</span></div>` : ""}
          <div class="tarjeta__pie"><div class="precio">${precioHTML(p)}</div></div>
          <div class="tarjeta__acciones">
            ${agotado
              ? (wa(`Hola, ¿cuándo llega el ${p.nombre} (${p.ref})?`) ? `<a class="btn-secundario w-100" href="${esc(wa(`Hola, ¿cuándo llega el ${p.nombre} (${p.ref})?`))}" target="_blank" rel="noopener"><i class="bi bi-bell"></i> Avísame cuando llegue</a>` : "")
              : `<button type="button" class="btn-principal w-100" data-carrito="${esc(p.ref)}"><i class="bi bi-cart-plus"></i> Agregar al carrito</button>`}
          </div>
        </div>
      </article>`;
  }
  // botón "Agregar al carrito" de cualquier tarjeta (agrega el primer color; se cambia en el carrito o en la ficha)
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-carrito]");
    if (b) Carrito.agregar(b.dataset.carrito);
  });

  /* ---------- desde la revista incrustada ---------- */
  window.addEventListener("message", (e) => {
    const fr = document.getElementById("iframe-revista");
    if (!fr || e.source !== fr.contentWindow) return;
    const m = e.data;
    if (m && m.tipo === "pedido:agregar" && typeof m.ref === "string" && porRef[m.ref]) Carrito.agregar(m.ref);
  });

  window.Carrito = Carrito;
  window.Tienda = {
    D, N, porRef, esc, vacio, pesos, sinTildes, wa, insta, qrSvg, PROP, etiqueta, specsDe, rangoEdad, precioHTML,
    urlProducto, fotoDe, galeria, tarjeta, cabecera, pie, avisar, carrusel,
  };
})();
