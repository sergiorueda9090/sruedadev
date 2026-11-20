/* =========================================================================
   SITIO WEB — completa sitio.html con los datos de data/menu.js
   (la misma fuente que la carta PDF y la revista).
   ========================================================================= */
(function () {
  "use strict";

  const D = window.CATALOGO;
  const N = D.negocio;
  const $ = (id) => document.getElementById(id);

  /* ---------- utilidades ---------- */
  const esc = (v) =>
    String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const vacio = (v) => v === null || v === undefined || v === "" || (Array.isArray(v) && !v.length);
  const pendiente = (campo) => `<span class="pendiente">Pendiente: ${esc(campo)}</span>`;
  const valor = (v, campo) => (vacio(v) ? pendiente(campo) : esc(v));
  const precio = (p) =>
    vacio(p) ? pendiente("precio") : `$${Number(p).toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;
  const sinTildes = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  const MSG = "Hola, vi la página web y quiero hacer un pedido";
  const wa = (texto) => (N.whatsappLink ? N.whatsappLink + (texto ? `?text=${encodeURIComponent(texto)}` : "") : null);
  const insta = () =>
    N.instagram ? (/^https?:/.test(N.instagram) ? N.instagram : `https://instagram.com/${N.instagram.replace(/^@/, "")}`) : null;
  const U = N.ubicacion || {};
  const consulta = U.lat && U.lng ? `${U.lat},${U.lng}` : U.consultaMapa || N.direccion;
  // Botón "Agregar" / selector de cantidad del carrito (js/carrito.js)
  const pedirBtn = (x, grande) => window.Carrito.control(x, grande);
  const qrSvg = (texto) => {
    if (!texto || typeof qrcode !== "function") return "";
    const q = qrcode(0, "M");
    q.addData(texto);
    q.make();
    return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
  };

  /* ---------- horario ---------- */
  const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const h12 = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    if (h === 12 && m === 0) return "12:00 m.";
    const s = h < 12 ? "a.m." : "p.m.";
    return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${s}`;
  };
  function estadoAhora() {
    const H = N.horarioSemana;
    if (!H) return null;
    const ahora = new Date();
    const min = ahora.getHours() * 60 + ahora.getMinutes();
    const aMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
    const hoy = H[ahora.getDay()];
    if (hoy && min >= aMin(hoy[0]) && min < aMin(hoy[1])) return { abierto: true, texto: `Abierto ahora · cierra a las ${h12(hoy[1])}` };
    // próxima apertura
    for (let i = 0; i < 7; i++) {
      const d = (ahora.getDay() + i) % 7;
      const r = H[d];
      if (!r) continue;
      if (i === 0 && min >= aMin(r[0])) continue;
      const cuando = i === 0 ? "hoy" : i === 1 ? "mañana" : `el ${DIAS[d].toLowerCase()}`;
      return { abierto: false, texto: `Cerrado · abre ${cuando} a las ${h12(r[0])}` };
    }
    return { abierto: false, texto: "Cerrado" };
  }

  /* ---------- SEO: meta y datos estructurados ---------- */
  function seo() {
    const titulo = `${N.nombre}${N.subtitulo ? " · " + N.subtitulo : ""}`;
    document.title = titulo;
    const meta = (sel, v) => { const m = document.querySelector(sel); if (m && v) m.setAttribute("content", v); };
    meta('meta[name="description"]', N.descripcion);
    meta('meta[property="og:title"]', titulo);
    meta('meta[property="og:description"]', N.eslogan);
    meta('meta[property="og:image"]', N.fotoPortada);

    const diasSchema = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const ld = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: titulo,
      description: N.descripcion,
      servesCuisine: N.tipoComida,
      telephone: N.whatsapp,
      address: { "@type": "PostalAddress", streetAddress: N.direccion },
      image: N.fotoPortada,
      hasMenu: "revista.html",
      acceptsReservations: false,
      sameAs: [insta(), N.facebook, N.tiktok].filter(Boolean),
      openingHoursSpecification: Object.entries(N.horarioSemana || {})
        .filter(([, r]) => r)
        .map(([d, r]) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: diasSchema[d], opens: r[0], closes: r[1] })),
    };
    if (U.lat && U.lng) ld.geo = { "@type": "GeoCoordinates", latitude: U.lat, longitude: U.lng };
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  }

  /* ---------- secciones ---------- */
  function general() {
    if (D.modoPrueba) $("aviso-prueba").classList.remove("d-none");
    document.querySelectorAll(".js-wa").forEach((a) => { const u = wa(MSG); if (u) a.href = u; });
    ["nav-logo", "pie-logo"].forEach((id) => ($(id).src = N.logo));
    $("nav-nombre").textContent = N.nombre;
    $("pie-nombre").textContent = `${N.nombre} ${N.subtitulo || ""}`;
    $("pie-credito").innerHTML = `© ${new Date().getFullYear()} ${esc(N.nombre)}${D.modoPrueba ? " · Fotos de referencia (maqueta)" : ""}`;
    $("pie-redes").innerHTML = [
      insta() && `<a href="${esc(insta())}" target="_blank" rel="noopener" aria-label="Instagram"><i class="bi bi-instagram"></i></a>`,
      N.facebook && `<a href="${esc(N.facebook)}" target="_blank" rel="noopener" aria-label="Facebook"><i class="bi bi-facebook"></i></a>`,
      N.tiktok && `<a href="${esc(N.tiktok)}" target="_blank" rel="noopener" aria-label="TikTok"><i class="bi bi-tiktok"></i></a>`,
      wa(MSG) && `<a href="${esc(wa(MSG))}" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>`,
    ].filter(Boolean).join("");
  }

  function hero() {
    $("hero-nombre").textContent = N.nombre.toUpperCase();
    $("hero-sub").textContent = (N.subtitulo || "").toUpperCase();
    $("hero-eslogan").innerHTML = valor(N.eslogan, "eslogan");
    $("hero-foto").src = N.logo;
    $("hero-foto").alt = `Logo ${N.nombre}`;
    const e = estadoAhora();
    if (e) {
      $("estado-abierto").textContent = e.texto;
      $("estado-abierto").classList.add(e.abierto ? "estado--abierto" : "estado--cerrado");
    }
    $("hero-datos").innerHTML = `
      <li><i class="bi bi-geo-alt-fill"></i>${valor(N.direccion, "dirección")}</li>
      <li><i class="bi bi-clock-fill"></i>${valor(N.horario, "horario")}</li>`;
    const iconos = { Domicilios: "bi-bicycle", "Para llevar": "bi-bag-check", "En el local": "bi-shop" };
    $("servicios").innerHTML = (N.servicios || [])
      .map((s) => `<span class="servicio"><i class="bi ${iconos[s] || "bi-check2-circle"}"></i>${esc(s)}</span>`).join("");
  }

  function recomendados() {
    const lista = D.productos.filter((x) => x.destacado);
    if (!lista.length) { $("recomendados").remove(); return; }
    $("reco").innerHTML = lista.map((x) => `
      <div class="col-10 col-sm-6 ${lista.length % 3 === 0 ? "col-lg-4" : "col-lg-3"} col-reco text-center">
        <figure class="polaroid m-0">
          <img src="${esc(x.foto)}" alt="${esc(x.nombre)}" loading="lazy">
          <figcaption>${esc(x.nombre)}</figcaption>
          <span class="etiqueta-precio">${vacio(x.precio) ? "?" : "$" + Math.round(x.precio / 1000) + "K"}</span>
        </figure>
        <p class="reco-desc">${valor(x.descripcion, "descripción")}</p>
        ${pedirBtn(x, true)}
      </div>`).join("");
  }

  function menuRapido() {
    let filtro = "todos";
    const cats = D.categorias.filter((c) => D.productos.some((x) => x.categoria === c.id));
    $("filtros").innerHTML = [`<button class="filtro activo" data-cat="todos">Todo</button>`]
      .concat(cats.map((c) => `<button class="filtro" data-cat="${esc(c.id)}">${esc(c.nombre)}</button>`)).join("");
    $("lista-menu").innerHTML = D.productos.map((x) => `
      <div class="col-md-6 col-xl-4 item-menu" data-cat="${esc(x.categoria)}"
           data-texto="${esc(sinTildes([x.nombre, x.descripcion || "", (x.ingredientes || []).join(" ")].join(" ")))}">
        <div class="tarjeta">
          ${x.foto ? `<img src="${esc(x.foto)}" alt="${esc(x.nombre)}" loading="lazy">` : ""}
          <div class="flex-grow-1 d-flex flex-column">
            <h3>${esc(x.nombre)}</h3>
            <p>${valor(x.descripcion, "descripción")}</p>
            <div class="mt-auto d-flex flex-wrap justify-content-between align-items-center gap-2">
              <span class="precio">${precio(x.precio)}</span>${pedirBtn(x)}
            </div>
          </div>
        </div>
      </div>`).join("");

    const aplicar = () => {
      const q = sinTildes($("buscar").value.trim());
      let visibles = 0;
      document.querySelectorAll(".item-menu").forEach((n) => {
        const ok = (filtro === "todos" || n.dataset.cat === filtro) && (!q || n.dataset.texto.includes(q));
        n.classList.toggle("d-none", !ok);
        if (ok) visibles++;
      });
      $("sin-resultados").classList.toggle("d-none", visibles > 0);
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
      <div><dt>Horario</dt><dd>${valor(N.horario, "horario")}</dd></div>`;
    const fotos = D.productos.filter((x) => x.foto).filter((x, i, a) => a.findIndex((y) => y.categoria === x.categoria) === i);
    $("galeria").innerHTML = [D.productos.find((x) => x.destacado) || fotos[0], ...fotos]
      .filter((x, i, a) => x && a.indexOf(x) === i).slice(0, 6)
      .map((x) => `<img src="${esc(x.foto)}" alt="${esc(x.nombre)}" loading="lazy">`).join("");
  }

  function ubicacion() {
    $("mapa").src = `https://www.google.com/maps?q=${encodeURIComponent(consulta)}&z=15&output=embed`;
    $("ubi-direccion").innerHTML = valor(N.direccion, "dirección");
    $("ubi-referencia").innerHTML = U.referencia ? esc(U.referencia) : (D.modoPrueba ? pendiente("ubicación exacta en el mapa") : "");
    $("btn-maps").href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(consulta)}`;
    $("btn-waze").href = U.lat && U.lng
      ? `https://waze.com/ul?ll=${U.lat},${U.lng}&navigate=yes`
      : `https://waze.com/ul?q=${encodeURIComponent(consulta)}&navigate=yes`;

    const H = N.horarioSemana || {};
    const hoy = new Date().getDay();
    $("tabla-horario").innerHTML = [1, 2, 3, 4, 5, 6, 0]
      .map((d) => `<tr class="${d === hoy ? "hoy" : ""}"><td>${DIAS[d]}${d === hoy ? " (hoy)" : ""}</td><td>${H[d] ? `${h12(H[d][0])} – ${h12(H[d][1])}` : "Cerrado"}</td></tr>`)
      .join("");
    $("ubi-domicilio").innerHTML = valor(N.zonaDomicilio, "zona y costo de domicilio");
    $("ubi-pagos").innerHTML = vacio(N.mediosPago)
      ? pendiente("medios de pago")
      : N.mediosPago.map((m) => `<span class="chip">${esc(m)}</span>`).join("");
  }

  function resenas() {
    // No se muestran reseñas inventadas: solo el enlace real a Google cuando exista.
    const url = N.linkResenasGoogle || null;
    $("resenas-cta").innerHTML = url
      ? `<a class="btn btn-kraft btn-lg" href="${esc(url)}" target="_blank" rel="noopener"><i class="bi bi-star-fill"></i> Déjanos tu reseña en Google</a>`
      : `<a class="btn btn-kraft btn-lg disabled" aria-disabled="true"><i class="bi bi-star-fill"></i> Déjanos tu reseña en Google</a><div class="mt-3">${pendiente("enlace de reseñas de Google")}</div>`;
  }

  function contacto() {
    const item = (url, icono, titulo, texto) => {
      const dentro = `<i class="bi ${icono}"></i><div><small>${titulo}</small>${texto}</div>`;
      return url ? `<a class="contacto-item" href="${esc(url)}" target="_blank" rel="noopener">${dentro}</a>` : `<div class="contacto-item">${dentro}</div>`;
    };
    $("contacto-lista").innerHTML = [
      item(wa(MSG), "bi-whatsapp", "WhatsApp · pedidos", valor(N.whatsapp, "WhatsApp")),
      item(insta(), "bi-instagram", "Instagram", valor(N.instagram, "Instagram")),
      item(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`, "bi-geo-alt-fill", "Dirección", valor(N.direccion, "dirección")),
      item(N.sitioWeb, "bi-globe2", "Sitio web", valor(N.sitioWeb, "dominio del sitio web")),
    ].join("");
    $("qr-web").innerHTML = qrSvg(wa(MSG));
  }

  seo();
  general();
  hero();
  recomendados();
  menuRapido();
  nosotros();
  ubicacion();
  resenas();
  contacto();
  window.Carrito.montar();
})();
