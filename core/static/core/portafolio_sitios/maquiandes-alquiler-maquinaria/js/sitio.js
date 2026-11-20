/* =========================================================================
   SITIO WEB — ALQUILER DE MAQUINARIA
   Completa sitio.html con data/catalogo.js (misma fuente que el catálogo PDF).
   ========================================================================= */
(function () {
  "use strict";

  const D = window.CATALOGO;
  const N = D.negocio;
  const CR = window.CREDITOS_FOTOS || {};
  const $ = (id) => document.getElementById(id);
  const esc = (v) =>
    String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const vacio = (v) => v === null || v === undefined || v === "" || (Array.isArray(v) && !v.length);
  const pendiente = (campo) => `<span class="pendiente">Pendiente: ${esc(campo)}</span>`;
  const valor = (v, campo) => (vacio(v) ? pendiente(campo) : esc(v));
  const pesos = (n) => `$${Number(n).toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;
  const sinTildes = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const cat = (id) => D.categorias.find((c) => c.id === id) || {};

  const MSG = "Hola, vi la página web y quiero cotizar alquiler de maquinaria";
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
    if (hoy && min >= aMin(hoy[0]) && min < aMin(hoy[1])) return { abierto: true, texto: `Atendiendo ahora · hasta las ${h12(hoy[1])}` };
    for (let i = 0; i < 7; i++) {
      const d = (a.getDay() + i) % 7, r = H[d];
      if (!r || (i === 0 && min >= aMin(r[0]))) continue;
      return { abierto: false, texto: `Fuera de horario · atendemos ${i === 0 ? "hoy" : i === 1 ? "mañana" : "el " + DIAS[d].toLowerCase()} desde las ${h12(r[0])}` };
    }
    return { abierto: false, texto: "Fuera de horario" };
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
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: N.nombre,
      description: N.descripcion,
      telephone: N.telefono || N.whatsapp,
      address: { "@type": "PostalAddress", streetAddress: N.direccion },
      areaServed: N.cobertura,
      image: N.fotoPortada,
      sameAs: [insta(), N.facebook].filter(Boolean),
      openingHoursSpecification: Object.entries(N.horarioSemana || {}).filter(([, r]) => r)
        .map(([d, r]) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: dias[d], opens: r[0], closes: r[1] })),
      makesOffer: D.equipos.map((x) => ({ "@type": "Offer", itemOffered: { "@type": "Product", name: x.nombre }, businessFunction: "http://purl.org/goodrelations/v1#LeaseOut" })),
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
    $("nav-sub").textContent = N.subtitulo || "";
    $("pie-nombre").textContent = N.nombre;
    $("pie-redes").innerHTML = [
      insta() && `<a href="${esc(insta())}" target="_blank" rel="noopener" aria-label="Instagram"><i class="bi bi-instagram"></i></a>`,
      N.facebook && `<a href="${esc(N.facebook)}" target="_blank" rel="noopener" aria-label="Facebook"><i class="bi bi-facebook"></i></a>`,
      wa(MSG) && `<a href="${esc(wa(MSG))}" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>`,
    ].filter(Boolean).join("");
    const dev = N.creditoDesarrollador;
    $("pie-dev").innerHTML = dev
      ? `Sitio desarrollado por <a href="${esc(dev.url)}" target="_blank" rel="noopener"><b>${esc(dev.nombre)}</b></a>${dev.texto ? `<br><small>${esc(dev.texto)}</small>` : ""}`
      : `© ${new Date().getFullYear()} ${esc(N.nombre)}`;
    const cr = Object.entries(CR);
    if (!cr.length) $("pie-creditos").remove();
    else $("lista-creditos").innerHTML = cr.map(([ref, c]) =>
      `<div>${esc(ref)}: <a href="${esc(c.pagina)}" target="_blank" rel="noopener">${esc(c.archivo.replace(/^File:/, ""))}</a> — ${esc(c.autor || "autor desconocido")} · ${c.licencia_url ? `<a href="${esc(c.licencia_url)}" target="_blank" rel="noopener">${esc(c.licencia)}</a>` : esc(c.licencia)}</div>`).join("");
  }

  function hero() {
    $("hero-texto").innerHTML = valor(N.descripcion, "descripción");
    $("hero-foto").src = N.fotoPortada;
    $("hero-foto").alt = N.nombre;
    const e = estadoAhora();
    if (e) { $("estado-abierto").textContent = e.texto; $("estado-abierto").classList.add(e.abierto ? "estado--abierto" : "estado--cerrado"); }
    $("hero-beneficios").innerHTML = (D.servicios || []).map((s) => `<span><i class="bi ${esc(s.icono)}"></i>${esc(s.titulo)}</span>`).join("");
    $("tira-cat").innerHTML = D.categorias.map((c) => {
      const f = (D.equipos.find((x) => x.categoria === c.id && x.foto) || {}).foto;
      return f ? `<a href="#maquinaria" data-filtro="${esc(c.id)}"><img src="${esc(f)}" alt="" loading="lazy"><span>${esc(c.nombre)} <i class="bi bi-chevron-right"></i></span></a>` : "";
    }).join("");
  }

  function maquinaria() {
    let filtro = "todos";
    const cats = D.categorias.filter((c) => D.equipos.some((x) => x.categoria === c.id));
    $("filtros").innerHTML = [`<button class="filtro activo" data-cat="todos">Todos</button>`]
      .concat(cats.map((c) => `<button class="filtro" data-cat="${esc(c.id)}"><i class="bi ${esc(c.icono)}"></i> ${esc(c.nombre)}</button>`)).join("");
    $("grid-equipos").innerHTML = D.equipos.map((x) => {
      const T = x.tarifas || {};
      const tar = [["hora", "Hora"], ["dia", "Día"], ["mes", "Mes"]].filter(([k]) => typeof T[k] === "number")
        .map(([k, n]) => `<div class="tarifa"><small>${n}</small><b>${pesos(T[k])}</b></div>`).join("") || pendiente("tarifas");
      return `
        <div class="col-md-6 col-xl-4 item-equipo" data-cat="${esc(x.categoria)}"
             data-texto="${esc(sinTildes([x.nombre, x.descripcion || "", cat(x.categoria).nombre || "", ...(x.especificaciones || []).flat()].join(" ")))}">
          <article class="tarjeta-equipo">
            <div class="tarjeta-equipo__foto">
              <img src="${esc(x.foto)}" alt="${esc(x.nombre)}" loading="lazy">
              <span class="ref">${esc(x.ref)}</span>
              ${x.destacado ? `<span class="top">Más solicitado</span>` : ""}
              ${x.disponible === false ? `<div class="no-disponible">No disponible</div>` : ""}
            </div>
            <div class="tarjeta-equipo__cuerpo">
              <div class="cat">${esc(cat(x.categoria).nombre || "")}</div>
              <h3>${esc(x.nombre)}</h3>
              <p>${valor(x.descripcion, "descripción")}</p>
              <dl class="specs">${(x.especificaciones || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
              <div class="tarifas">${tar}</div>
              <div class="d-flex align-items-center justify-content-between gap-2 mt-3 flex-wrap">
                <span class="operador"><i class="bi bi-person-badge"></i> Operador: ${valor(x.operador, "operador")}</span>
                ${window.Cotizacion.control(x)}
              </div>
            </div>
          </article>
        </div>`;
    }).join("");

    const aplicar = () => {
      const q = sinTildes($("buscar").value.trim());
      let n = 0;
      document.querySelectorAll(".item-equipo").forEach((el) => {
        const ok = (filtro === "todos" || el.dataset.cat === filtro) && (!q || el.dataset.texto.includes(q));
        el.classList.toggle("d-none", !ok);
        if (ok) n++;
      });
      $("sin-resultados").classList.toggle("d-none", n > 0);
    };
    const elegir = (c) => {
      filtro = c;
      document.querySelectorAll(".filtro").forEach((f) => f.classList.toggle("activo", f.dataset.cat === c));
      aplicar();
    };
    $("filtros").addEventListener("click", (e) => { const b = e.target.closest(".filtro"); if (b) elegir(b.dataset.cat); });
    $("tira-cat").addEventListener("click", (e) => { const a = e.target.closest("[data-filtro]"); if (a) elegir(a.dataset.filtro); });
    $("buscar").addEventListener("input", aplicar);
  }

  function servicios() {
    $("grid-servicios").innerHTML = (D.servicios || []).map((s) => `
      <div class="col-sm-6 col-lg-3"><div class="servicio"><i class="bi ${esc(s.icono)}"></i><h3>${esc(s.titulo)}</h3><p>${esc(s.texto)}</p></div></div>`).join("");
  }

  function condiciones() {
    $("acordeon").innerHTML = (D.condiciones || []).map((c, i) => `
      <div class="accordion-item">
        <h3 class="accordion-header">
          <button class="accordion-button ${i ? "collapsed" : ""}" type="button" data-bs-toggle="collapse" data-bs-target="#cond-${i}" aria-expanded="${i ? "false" : "true"}" aria-controls="cond-${i}">
            <i class="bi ${esc(c.icono)} me-2"></i>${esc(c.titulo)}
          </button>
        </h3>
        <div id="cond-${i}" class="accordion-collapse collapse ${i ? "" : "show"}" data-bs-parent="#acordeon">
          <div class="accordion-body">${esc(c.texto)}</div>
        </div>
      </div>`).join("") || pendiente("condiciones de alquiler");
  }

  function ubicacion() {
    $("mapa").src = `https://www.google.com/maps?q=${encodeURIComponent(consulta)}&z=13&output=embed`;
    $("ubi-direccion").innerHTML = valor(N.direccion, "dirección") + (D.modoPrueba ? `<br>${pendiente("ubicación exacta en el mapa")}` : "");
    $("btn-maps").href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(consulta)}`;
    $("btn-waze").href = U.lat && U.lng ? `https://waze.com/ul?ll=${U.lat},${U.lng}&navigate=yes` : `https://waze.com/ul?q=${encodeURIComponent(consulta)}&navigate=yes`;
    $("ubi-cobertura").innerHTML = valor(N.cobertura, "zona de cobertura");
    const H = N.horarioSemana || {}, hoy = new Date().getDay();
    $("tabla-horario").innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) =>
      `<tr class="${d === hoy ? "hoy" : ""}"><td>${DIAS[d]}${d === hoy ? " (hoy)" : ""}</td><td>${H[d] ? `${h12(H[d][0])} – ${h12(H[d][1])}` : "Cerrado"}</td></tr>`).join("");
  }

  function contacto() {
    const item = (url, icono, titulo, texto) => {
      const dentro = `<i class="bi ${icono}"></i><div><small>${titulo}</small>${texto}</div>`;
      return url ? `<a class="contacto-item" href="${esc(url)}" target="_blank" rel="noopener">${dentro}</a>` : `<div class="contacto-item">${dentro}</div>`;
    };
    $("contacto-lista").innerHTML = [
      item(wa(MSG), "bi-whatsapp", "WhatsApp · cotizaciones", valor(N.whatsapp, "WhatsApp")),
      item(N.correo ? `mailto:${N.correo}` : null, "bi-envelope-fill", "Correo", valor(N.correo, "correo")),
      item(insta(), "bi-instagram", "Instagram", valor(N.instagram, "Instagram")),
      item(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`, "bi-geo-alt-fill", "Patio de maquinaria", valor(N.direccion, "dirección")),
    ].join("");
    $("qr-web").innerHTML = qrSvg(wa(MSG));
  }

  seo();
  general();
  hero();
  maquinaria();
  servicios();
  condiciones();
  ubicacion();
  contacto();
  window.Cotizacion.montar();
})();
