/* =====================================================================
   OXI SMART — main.js
   Utilidades compartidas por todas las páginas y por el generador PDF.
   Depende de: assets/js/data/*.js (cargados antes).
   ===================================================================== */
(() => {
  "use strict";

  const OXI = (window.OXI = window.OXI || {});
  const C = OXI.company || {};
  const credits = OXI.credits || {};

  /* ------------------------- Formato ------------------------- */
  const priceFmt = new Intl.NumberFormat("es-CO", {
    style: "currency", currency: C.moneda || "COP", maximumFractionDigits: 0
  });

  const escapeHtml = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const normalize = (s) =>
    String(s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

  const hasPrice = (p) => typeof p.precio === "number" && p.precio > 0;
  const priceText = (p) => (hasPrice(p) ? priceFmt.format(p.precio) : "Consultar precio");
  const refText = (p) => p.referencia || "Por asignar";

  /** Devuelve el valor de una especificación ya formateado, o null si no está confirmado. */
  const specValue = (p, field) => {
    const v = p.specs ? p.specs[field.key] : null;
    if (v === null || v === undefined || v === "") return null;
    if (typeof v === "number" && field.unidad) return `${v.toLocaleString("es-CO")} ${field.unidad}`;
    return String(v);
  };

  /* ------------------------- Datos ------------------------- */
  const categories = () => [...(OXI.categories || [])].sort((a, b) => a.orden - b.orden);
  const getCategory = (id) => (OXI.categories || []).find((c) => c.id === id);
  const getProduct = (id) => (OXI.products || []).find((p) => p.id === id);
  const productsIn = (catId) => (OXI.products || []).filter((p) => p.categoria === catId);
  const productUrl = (p) => `producto.html?id=${encodeURIComponent(p.id)}`;
  const catalogUrl = (catId) => (catId ? `catalogo.html?categoria=${encodeURIComponent(catId)}` : "catalogo.html");

  /** Lista de secciones de la ficha que siguen vacías (para avisos y PDF). */
  const pendingSections = (p) => {
    const names = { caracteristicas: "características", ventajas: "ventajas", componentes: "componentes", recomendaciones: "recomendaciones", aplicaciones: "aplicaciones" };
    return Object.keys(names).filter((k) => !Array.isArray(p[k]) || p[k].length === 0).map((k) => names[k]);
  };
  const confirmedSpecs = (p) => (OXI.specFields || []).filter((f) => specValue(p, f) !== null);

  /* ------------------------- Fotografías ------------------------- */
  const creditFor = (src) => credits[src] || null;
  const isIllustrative = (img) => Boolean(img && (img.ilustrativa || creditFor(img.src)));
  const pendingPhotoHtml = (label = "Fotografía pendiente") =>
    `<div class="photo-pending" role="img" aria-label="${escapeHtml(label)}"><img src="assets/images/logo/oxi-mark.svg" alt="" width="44" height="44"><span>${escapeHtml(label)}</span></div>`;
  const photoTagHtml = (img) => (isIllustrative(img) ? `<span class="photo-tag">Foto ilustrativa</span>` : "");

  /* ------------------------- Tarjeta de producto ------------------------- */
  const MINI_KEYS = ["potenciaHP", "voltaje", "fases"];
  function cardHtml(p, opts = {}) {
    const cat = getCategory(p.categoria);
    const img = (p.imagenes || [])[0];
    const media = img
      ? `<img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt || p.nombre)}" loading="lazy" decoding="async" width="640" height="480" class="${img.encuadre === "contain" ? "fit-contain" : ""}">${photoTagHtml(img)}`
      : pendingPhotoHtml();
    const mini = (OXI.specFields || []).filter((f) => MINI_KEYS.includes(f.key)).map((f) => {
      const v = specValue(p, f);
      return `<div><dt>${f.label}</dt><dd class="${v ? "" : "is-pending"}">${v ? escapeHtml(v) : "—"}</dd></div>`;
    }).join("");
    const aos = opts.aos === false ? "" : ` data-aos="zoom-in-up" data-aos-delay="${opts.delay || 0}"`;
    return `
      <article class="p-card"${aos}>
        <a class="p-card-media" href="${productUrl(p)}" tabindex="-1" aria-hidden="true">${media}</a>
        <div class="p-card-body">
          ${cat ? `<a class="p-card-cat" href="${catalogUrl(cat.id)}">${escapeHtml(cat.nombre)}</a>` : ""}
          <h3 class="p-card-title"><a href="${productUrl(p)}">${escapeHtml(p.nombre)}</a></h3>
          <div class="p-card-ref">Ref. ${escapeHtml(refText(p))}</div>
          <p class="p-card-desc">${escapeHtml(p.resumen)}</p>
          <dl class="mini-plate" aria-label="Datos técnicos principales">${mini}</dl>
          <div class="p-card-foot">
            <div class="price p-card-price ${hasPrice(p) ? "" : "is-consult"}">${escapeHtml(priceText(p))}${hasPrice(p) ? " <small>COP</small>" : ""}</div>
            <div class="p-card-actions">
              <a class="btn btn-oxi-line btn-sm" href="${productUrl(p)}"><i class="bi bi-file-earmark-text" aria-hidden="true"></i>Ficha técnica</a>
              <button type="button" class="btn btn-wa btn-sm" data-quote="${escapeHtml(p.id)}"><i class="bi bi-whatsapp" aria-hidden="true"></i>Cotizar</button>
            </div>
          </div>
        </div>
      </article>`;
  }

  /* ------------------------- Contacto enlazado ------------------------- */
  /* Elementos con data-oxi="campo" toman su valor de company.js.
     data-oxi-hide-empty oculta el elemento (o su contenedor [data-oxi-wrap]) si el dato está pendiente. */
  function bindCompany(root = document) {
    const values = {
      nombre: C.nombre, telefono: C.telefono, email: C.email, ciudad: C.ciudad, direccion: C.direccion,
      horario: C.horario, pais: C.pais, descripcion: C.descripcion, tiktok: C.redes?.tiktok,
      facebook: C.redes?.facebook, instagram: C.redes?.instagram, youtube: C.redes?.youtube,
      whatsappTexto: C.telefono || (C.whatsapp ? `+${C.whatsapp}` : null)
    };
    root.querySelectorAll("[data-oxi]").forEach((el) => {
      const key = el.dataset.oxi;
      const v = values[key];
      const wrap = el.closest("[data-oxi-wrap]") || el;
      if (!v) {
        if (el.hasAttribute("data-oxi-hide-empty")) wrap.hidden = true;
        else if (el.dataset.oxiPending) { el.textContent = el.dataset.oxiPending; el.classList.add("is-pending"); }
        return;
      }
      if (el.tagName === "A") {
        if (key === "email") el.href = `mailto:${v}`;
        else if (key === "telefono") el.href = `tel:${String(v).replace(/[^\d+]/g, "")}`;
        else if (["tiktok", "facebook", "instagram", "youtube"].includes(key)) el.href = v;
      }
      if (!el.hasAttribute("data-oxi-keep-text")) el.textContent = v;
    });
    root.querySelectorAll("[data-wa-general]").forEach((a) => {
      a.href = OXI.whatsapp ? OXI.whatsapp.link(OXI.whatsapp.generalMessage()) : "#";
      a.target = "_blank"; a.rel = "noopener";
    });
  }

  /* ------------------------- Créditos de fotos ------------------------- */
  function renderCredits() {
    const box = document.getElementById("photo-credits");
    if (!box) return;
    const used = new Set([...document.querySelectorAll("img[src]")].map((i) => i.getAttribute("src")));
    const list = Object.entries(credits);
    if (!list.length) { box.closest("details")?.remove(); return; }
    box.innerHTML = list
      .sort(([a], [b]) => (used.has(b) - used.has(a)))
      .map(([, c]) => `<li><a href="${escapeHtml(c.fuente)}" target="_blank" rel="noopener">${escapeHtml(c.titulo)}</a> — ${escapeHtml(c.autor)}, ${escapeHtml(c.licencia)}</li>`)
      .join("");
  }

  /* ------------------------- Lightbox ------------------------- */
  let lb = null;
  function lightbox(images, start = 0) {
    if (!window.bootstrap) return;
    if (!lb) {
      const el = document.createElement("div");
      el.className = "modal fade lightbox";
      el.tabIndex = -1;
      el.setAttribute("aria-label", "Visor de fotografías");
      el.setAttribute("aria-modal", "true");
      el.setAttribute("role", "dialog");
      el.innerHTML = `
        <div class="modal-dialog modal-xl modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body">
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              <img alt="">
              <button type="button" class="lb-nav lb-prev" aria-label="Foto anterior"><i class="bi bi-chevron-left" aria-hidden="true"></i></button>
              <button type="button" class="lb-nav lb-next" aria-label="Foto siguiente"><i class="bi bi-chevron-right" aria-hidden="true"></i></button>
            </div>
            <div class="lb-caption" aria-live="polite"></div>
          </div>
        </div>`;
      document.body.appendChild(el);
      lb = { el, modal: new bootstrap.Modal(el), img: el.querySelector("img"), cap: el.querySelector(".lb-caption"), list: [], i: 0 };
      const show = (d) => { lb.i = (lb.i + d + lb.list.length) % lb.list.length; paint(); };
      el.querySelector(".lb-prev").addEventListener("click", () => show(-1));
      el.querySelector(".lb-next").addEventListener("click", () => show(1));
      el.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") show(-1); if (e.key === "ArrowRight") show(1); });
    }
    function paint() {
      const im = lb.list[lb.i];
      lb.img.src = im.src; lb.img.alt = im.alt || "";
      const c = creditFor(im.src);
      lb.cap.textContent = [im.alt, isIllustrative(im) ? "Foto ilustrativa" : "", c ? `Foto: ${c.autor} (${c.licencia})` : "", lb.list.length > 1 ? `${lb.i + 1} de ${lb.list.length}` : ""].filter(Boolean).join("  |  ");
      lb.el.querySelectorAll(".lb-nav").forEach((b) => (b.hidden = lb.list.length < 2));
    }
    lb.list = images; lb.i = start; paint(); lb.modal.show();
  }

  /* ------------------------- Toast ------------------------- */
  function toast(msg) {
    let host = document.getElementById("oxi-toast");
    if (!host) {
      host = document.createElement("div");
      host.id = "oxi-toast";
      host.className = "position-fixed bottom-0 start-50 translate-middle-x p-3";
      host.style.zIndex = 2100;
      host.setAttribute("aria-live", "polite");
      document.body.appendChild(host);
    }
    host.innerHTML = `<div class="toast toast-oxi align-items-center show" role="status"><div class="d-flex"><div class="toast-body">${escapeHtml(msg)}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Cerrar"></button></div></div>`;
    const t = host.firstElementChild;
    t.querySelector(".btn-close").onclick = () => t.remove();
    setTimeout(() => t.remove(), 5000);
  }

  /* ------------------------- JSON-LD dinámico ------------------------- */
  function addJsonLd(obj, id) {
    if (id) document.getElementById(id)?.remove();
    const s = document.createElement("script");
    s.type = "application/ld+json";
    if (id) s.id = id;
    s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  }
  const absUrl = (path) => `${(C.sitioWeb || location.origin).replace(/\/$/, "")}/${String(path).replace(/^\//, "")}`;

  /* ------------------------- Google Analytics 4 ------------------------- */
  function loadAnalytics() {
    const id = C.analytics?.ga4Id;
    if (!id || !/^G-[A-Z0-9]+$/.test(id)) return;
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", id, { anonymize_ip: true });
  }
  /** Eventos de negocio (cotización, descarga PDF). Si GA4 no está activo, no hace nada. */
  const track = (name, params = {}) => { if (typeof window.gtag === "function") window.gtag("event", name, params); };

  /* ------------------------- Arranque común ------------------------- */
  function initCommon() {
    // Cabecera con sombra al desplazar
    const header = document.querySelector(".site-header");
    if (header) {
      const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    // Año
    document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
    // Lista de categorías en el pie
    const fc = document.getElementById("footer-categories");
    if (fc) fc.innerHTML = categories().map((c) => `<li><a href="${catalogUrl(c.id)}">${escapeHtml(c.nombre)}</a></li>`).join("");

    bindCompany();
    loadAnalytics();

    // AOS (respeta prefers-reduced-motion)
    if (window.AOS) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      AOS.init({ once: true, duration: 650, easing: "ease-out-cubic", offset: 60, disable: reduce });
    }
    renderCredits();
  }

  OXI.utils = {
    escapeHtml, normalize, hasPrice, priceText, refText, specValue, categories, getCategory, getProduct,
    productsIn, productUrl, catalogUrl, pendingSections, confirmedSpecs, creditFor, isIllustrative,
    pendingPhotoHtml, photoTagHtml, cardHtml, bindCompany, renderCredits, lightbox, toast, addJsonLd, absUrl, track,
    priceFormat: (n) => priceFmt.format(n)
  };

  document.addEventListener("DOMContentLoaded", () => {
    initCommon();
    document.dispatchEvent(new CustomEvent("oxi:ready"));
  });
})();
