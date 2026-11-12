/* =========================================================================
   SITIO WEB — MESA DORADA
   Completa sitio.html con data/menu.js (misma fuente que la carta PDF).
   Carrito: js/carrito.js · Reservas: js/reservas.js
   ========================================================================= */
(function () {
  "use strict";

  const D = window.CATALOGO;
  const N = D.negocio;
  const $ = (id) => document.getElementById(id);
  const esc = (v) =>
    String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const vacio = (v) => v === null || v === undefined || v === "" || (Array.isArray(v) && !v.length);
  const pendiente = (campo) => `<span class="pendiente">Pendiente: ${esc(campo)}</span>`;
  const valor = (v, campo) => (vacio(v) ? pendiente(campo) : esc(v));
  const precio = (p) => (vacio(p) ? pendiente("precio") : `$${Number(p).toLocaleString("es-CO", { maximumFractionDigits: 0 })}`);
  const sinTildes = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const cat = (id) => D.categorias.find((c) => c.id === id) || {};
  const de = (id) => D.productos.filter((x) => x.categoria === id);
  const control = (x, grande) => window.Carrito.control(x, grande);

  const MSG = "Hola, vi la página web y quiero hacer un pedido";
  const wa = (t) => (N.whatsappLink ? N.whatsappLink + (t ? `?text=${encodeURIComponent(t)}` : "") : null);
  const insta = () =>
    N.instagram ? (/^https?:/.test(N.instagram) ? N.instagram : `https://instagram.com/${N.instagram.replace(/^@/, "")}`) : null;
  const U = N.ubicacion || {};
  const consulta = U.lat && U.lng ? `${U.lat},${U.lng}` : U.consultaMapa || N.direccion;
  const qrSvg = (texto) => {
    if (!texto || typeof qrcode !== "function") return "";
    const q = qrcode(0, "M");
    q.addData(texto);
    q.make();
    return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
  };

  /* ---------- horario ---------- */
  const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const h12 = (t) => {
    const [h, m] = t.split(":").map(Number);
    if (h === 12 && m === 0) return "12:00 m.";
    return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "a.m." : "p.m."}`;
  };
  function estadoAhora() {
    const H = N.horarioSemana;
    if (!H) return null;
    const a = new Date(), min = a.getHours() * 60 + a.getMinutes();
    const aMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
    const hoy = H[a.getDay()];
    if (hoy && min >= aMin(hoy[0]) && min < aMin(hoy[1])) return { abierto: true, texto: `Abierto ahora · cierra a las ${h12(hoy[1])}` };
    for (let i = 0; i < 7; i++) {
      const d = (a.getDay() + i) % 7, r = H[d];
      if (!r || (i === 0 && min >= aMin(r[0]))) continue;
      return { abierto: false, texto: `Cerrado · abre ${i === 0 ? "hoy" : i === 1 ? "mañana" : "el " + DIAS[d].toLowerCase()} a las ${h12(r[0])}` };
    }
    return { abierto: false, texto: "Cerrado" };
  }

  /* ---------- SEO ---------- */
  function seo() {
    const titulo = `${N.nombre} · ${N.subtitulo || ""}`;
    document.title = titulo;
    const meta = (s, v) => { const m = document.querySelector(s); if (m && v) m.setAttribute("content", v); };
    meta('meta[name="description"]', N.descripcion);
    meta('meta[property="og:title"]', titulo);
    meta('meta[property="og:description"]', N.eslogan);
    meta('meta[property="og:image"]', N.fotoPortada);
    const dias = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const ld = {
      "@context": "https://schema.org", "@type": "Restaurant",
      name: N.nombre, description: N.descripcion, servesCuisine: N.tipoComida, telephone: N.whatsapp,
      address: { "@type": "PostalAddress", streetAddress: N.direccion }, image: N.fotoPortada,
      hasMenu: "revista.html", acceptsReservations: true,
      sameAs: [insta(), N.facebook].filter(Boolean),
      openingHoursSpecification: Object.entries(N.horarioSemana || {}).filter(([, r]) => r)
        .map(([d, r]) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: dias[d], opens: r[0], closes: r[1] })),
    };
    if (U.lat && U.lng) ld.geo = { "@type": "GeoCoordinates", latitude: U.lat, longitude: U.lng };
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  }

  /* ---------- general ---------- */
  function general() {
    if (D.modoPrueba) $("aviso-prueba").classList.remove("d-none");
    document.querySelectorAll(".js-wa").forEach((a) => { const u = wa(MSG); if (u) a.href = u; });
    ["nav-logo", "pie-logo"].forEach((id) => ($(id).src = N.logo));
    $("nav-nombre").textContent = N.nombre;
    $("pie-nombre").textContent = N.nombre;
    $("pie-redes").innerHTML = [
      insta() && `<a href="${esc(insta())}" target="_blank" rel="noopener" aria-label="Instagram"><i class="bi bi-instagram"></i></a>`,
      N.facebook && `<a href="${esc(N.facebook)}" target="_blank" rel="noopener" aria-label="Facebook"><i class="bi bi-facebook"></i></a>`,
      wa(MSG) && `<a href="${esc(wa(MSG))}" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>`,
    ].filter(Boolean).join("");
    const dev = N.creditoDesarrollador;
    $("pie-credito").innerHTML = `© ${new Date().getFullYear()} ${esc(N.nombre)}` +
      (D.modoPrueba ? " · Fotos de referencia: TheMealDB / TheCocktailDB" : "") +
      (dev ? ` · Sitio desarrollado por <a href="${esc(dev.url)}" target="_blank" rel="noopener">${esc(dev.nombre)}</a>` : "");
  }

  function hero() {
    $("hero-sub").textContent = N.subtitulo || "";
    $("hero-nombre").textContent = N.nombre;
    $("hero-texto").innerHTML = valor(N.descripcion, "descripción");
    const e = estadoAhora();
    if (e) { $("estado-abierto").textContent = e.texto; $("estado-abierto").classList.add(e.abierto ? "estado--abierto" : "estado--cerrado"); }
    $("hero-datos").innerHTML = `
      <li><i class="bi bi-geo-alt-fill"></i>${valor(N.direccion, "dirección")}</li>
      <li><i class="bi bi-clock-fill"></i>${valor(N.horario, "horario")}</li>`;
    const otros = D.productos.filter((x) => x.foto && x.foto !== N.fotoPortada);
    const m1 = otros.find((x) => x.categoria === "postres"), m2 = otros.find((x) => x.categoria === "favoritos");
    $("escena").innerHTML = `
      <div class="arco-grande"><img src="${esc(N.fotoPortada)}" alt="${esc(N.nombre)}"></div>
      ${m1 ? `<div class="mini mini--izq"><img src="${esc(m1.foto)}" alt=""></div>` : ""}
      ${m2 ? `<div class="mini mini--der"><img src="${esc(m2.foto)}" alt=""></div>` : ""}`;
  }

  // Sección estilo "lista": foto redonda con pestaña naranja
  function favoritos() {
    const c = cat("favoritos");
    $("fav-titulo").textContent = c.nombre || "Favoritos";
    $("fav-intro").textContent = c.intro || "";
    $("fav-lista").innerHTML = de("favoritos").map((x) => `
      <div class="col-lg-6">
        <article class="fav">
          <div class="fav__texto">
            <h3>${esc(x.nombre)}</h3>
            <p>${valor(x.descripcion, "descripción")}</p>
            <div class="d-flex align-items-center gap-3 flex-wrap"><span class="precio">${precio(x.precio)}</span>${control(x)}</div>
          </div>
          <div class="fav__foto"><div class="circulo"><img src="${esc(x.foto)}" alt="${esc(x.nombre)}" loading="lazy"></div></div>
        </article>
      </div>`).join("");
  }

  // Sección estilo "arcos"
  function casa() {
    const c = cat("casa");
    $("casa-titulo").innerHTML = `<em>${esc(N.nombre)}</em><span>${esc(c.nombre || "Creaciones de la casa")}</span>`;
    $("casa-intro").textContent = c.intro || "";
    $("casa-lista").innerHTML = de("casa").map((x) => `
      <div class="col-sm-6 col-lg-4">
        <article class="arco">
          <div class="arco__foto">
            ${x.destacado ? `<span class="badge-top">★ Favorito</span>` : ""}
            <img src="${esc(x.foto)}" alt="${esc(x.nombre)}" loading="lazy">
            ${x.disponible === false ? `<div class="no-disponible">No disponible</div>` : ""}
          </div>
          <h3>${esc(x.nombre)}</h3>
          <p>${valor(x.descripcion, "descripción")}</p>
          <div class="d-flex align-items-center justify-content-center gap-3 flex-wrap"><span class="precio">${precio(x.precio)}</span>${control(x)}</div>
        </article>
      </div>`).join("");
  }

  function menuCompleto() {
    let filtro = "todos";
    const cats = D.categorias.filter((c) => de(c.id).length);
    $("filtros").innerHTML = [`<button class="filtro activo" data-cat="todos">Todo</button>`]
      .concat(cats.map((c) => `<button class="filtro" data-cat="${esc(c.id)}">${esc(c.corto || c.nombre)}</button>`)).join("");
    $("lista-menu").innerHTML = D.productos.map((x) => `
      <div class="col-md-6 col-xl-4 item-menu" data-cat="${esc(x.categoria)}" data-texto="${esc(sinTildes(`${x.nombre} ${x.descripcion || ""}`))}">
        <div class="tarjeta">
          ${x.foto ? `<img src="${esc(x.foto)}" alt="${esc(x.nombre)}" loading="lazy">` : ""}
          <div class="flex-grow-1 d-flex flex-column">
            <h3>${esc(x.nombre)}</h3>
            <p>${valor(x.descripcion, "descripción")}</p>
            <div class="mt-auto d-flex flex-wrap justify-content-between align-items-center gap-2">
              <span class="precio precio--chico">${precio(x.precio)}</span>${control(x)}
            </div>
          </div>
        </div>
      </div>`).join("");
    const aplicar = () => {
      const q = sinTildes($("buscar").value.trim());
      let n = 0;
      document.querySelectorAll(".item-menu").forEach((el) => {
        const ok = (filtro === "todos" || el.dataset.cat === filtro) && (!q || el.dataset.texto.includes(q));
        el.classList.toggle("d-none", !ok);
        if (ok) n++;
      });
      $("sin-resultados").classList.toggle("d-none", n > 0);
    };
    $("filtros").addEventListener("click", (e) => {
      const b = e.target.closest(".filtro");
      if (!b) return;
      filtro = b.dataset.cat;
      document.querySelectorAll(".filtro").forEach((f) => f.classList.toggle("activo", f === b));
      aplicar();
    });
    $("buscar").addEventListener("input", aplicar);
  }

  function nosotros() {
    $("nosotros-texto").innerHTML = valor(N.descripcion, "descripción");
    $("nosotros-ficha").innerHTML = `
      <div><dt>Cocina</dt><dd>${valor(N.tipoComida, "tipo de comida")}</dd></div>
      <div><dt>Ideal para</dt><dd>${valor(N.publico, "público")}</dd></div>
      <div><dt>Horario</dt><dd>${valor(N.horario, "horario")}</dd></div>
      <div><dt>Reservas</dt><dd><a href="#reservas">${valor(N.reservas, "reservas")}</a></dd></div>`;
    const fotos = D.categorias.map((c) => (de(c.id).find((x) => x.foto) || {}).foto).filter(Boolean).slice(0, 5);
    $("galeria").innerHTML = fotos.map((f, i) => `<img src="${esc(f)}" alt="" loading="lazy" class="${i === 0 ? "grande" : ""}">`).join("");
    const r = D.productos.find((x) => x.categoria === "postres" && x.foto);
    if (r) $("reserva-foto").innerHTML = `<img src="${esc(r.foto)}" alt="" loading="lazy">`;
  }

  function ubicacion() {
    $("mapa").src = `https://www.google.com/maps?q=${encodeURIComponent(consulta)}&z=15&output=embed`;
    $("ubi-direccion").innerHTML = valor(N.direccion, "dirección") + (U.referencia ? `<br><small>${esc(U.referencia)}</small>` : D.modoPrueba ? `<br>${pendiente("ubicación exacta en el mapa")}` : "");
    $("btn-maps").href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(consulta)}`;
    $("btn-waze").href = U.lat && U.lng ? `https://waze.com/ul?ll=${U.lat},${U.lng}&navigate=yes` : `https://waze.com/ul?q=${encodeURIComponent(consulta)}&navigate=yes`;
    const H = N.horarioSemana || {}, hoy = new Date().getDay();
    $("tabla-horario").innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) =>
      `<tr class="${d === hoy ? "hoy" : ""}"><td>${DIAS[d]}${d === hoy ? " (hoy)" : ""}</td><td>${H[d] ? `${h12(H[d][0])} – ${h12(H[d][1])}` : "Cerrado"}</td></tr>`).join("");
    $("ubi-pagos").innerHTML = vacio(N.mediosPago) ? pendiente("medios de pago") : N.mediosPago.map((m) => `<span class="chip">${esc(m)}</span>`).join("");
  }

  function contacto() {
    const item = (url, icono, titulo, texto) => {
      const dentro = `<i class="bi ${icono}"></i><div><small>${titulo}</small>${texto}</div>`;
      return url ? `<a class="contacto-item" href="${esc(url)}" target="_blank" rel="noopener">${dentro}</a>` : `<div class="contacto-item">${dentro}</div>`;
    };
    $("contacto-lista").innerHTML = [
      item(wa(MSG), "bi-whatsapp", "Pedidos y reservas", valor(N.whatsapp, "WhatsApp")),
      item(insta(), "bi-instagram", "Instagram", valor(N.instagram, "Instagram")),
      item(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`, "bi-geo-alt-fill", "Dirección", valor(N.direccion, "dirección")),
    ].join("");
    $("qr-web").innerHTML = qrSvg(wa(MSG));
    // reseñas: solo el enlace real de Google, nunca reseñas inventadas
    $("resenas-cta").innerHTML = N.linkResenasGoogle
      ? `<a class="btn btn-cafe btn-lg" href="${esc(N.linkResenasGoogle)}" target="_blank" rel="noopener"><i class="bi bi-star-fill"></i> Déjanos tu reseña en Google</a>`
      : (D.modoPrueba ? pendiente("enlace de reseñas de Google") : "");
  }

  seo();
  general();
  hero();
  favoritos();
  casa();
  menuCompleto();
  nosotros();
  ubicacion();
  contacto();
  window.Carrito.montar();
  window.Reservas.montar();
})();
