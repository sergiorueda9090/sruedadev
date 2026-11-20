/* =====================================================================
   OXI SMART — Ficha técnica (producto.html?id=...)
   ===================================================================== */
(() => {
  "use strict";
  document.addEventListener("oxi:ready", () => {
    const OXI = window.OXI;
    const U = OXI.utils;
    const root = document.getElementById("product-root");
    if (!root) return;

    const id = new URLSearchParams(location.search).get("id") || location.pathname.split("/").pop().replace(/\.html$/, "");
    const p = U.getProduct(id);

    if (!p) {
      document.title = "Producto no encontrado | Oxi Smart Ingeniería";
      document.querySelector('meta[name="robots"]')?.setAttribute("content", "noindex, follow");
      root.innerHTML = `
        <div class="container section">
          <div class="empty-state">
            <h1 class="h2">No encontramos este producto</h1>
            <p>Puede que el enlace esté incompleto o que el equipo ya no esté en el catálogo. Revise el catálogo completo o escríbanos.</p>
            <div class="d-flex flex-wrap gap-2">
              <a class="btn btn-oxi" href="catalogo.html">Ir al catálogo</a>
              <button type="button" class="btn btn-wa" data-quote=""><i class="bi bi-whatsapp" aria-hidden="true"></i>Pedir asesoría</button>
            </div>
          </div>
        </div>`;
      return;
    }

    const cat = U.getCategory(p.categoria);
    const imgs = p.imagenes || [];
    const esc = U.escapeHtml;

    /* ---------- SEO dinámico ---------- */
    const title = `${p.nombre}${p.referencia ? ` ${p.referencia}` : ""} | ${cat ? cat.nombre : "Catálogo"} | Oxi Smart Ingeniería`;
    const desc = `${p.resumen} ${U.hasPrice(p) ? `Precio: ${U.priceText(p)}.` : "Consulte precio."} Cotice por WhatsApp con Oxi Smart Ingeniería.`;
    document.title = title;
    const setMeta = (sel, attr, val) => document.querySelector(sel)?.setAttribute(attr, val);
    setMeta('meta[name="description"]', "content", desc);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('link[rel="canonical"]', "href", U.absUrl(U.productUrl(p)));
    setMeta('meta[property="og:url"]', "content", U.absUrl(U.productUrl(p)));
    if (imgs[0]) setMeta('meta[property="og:image"]', "content", U.absUrl(imgs[0].src));

    U.addJsonLd({
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: U.absUrl("") },
        { "@type": "ListItem", position: 2, name: "Catálogo", item: U.absUrl("catalogo.html") },
        cat && { "@type": "ListItem", position: 3, name: cat.nombre, item: U.absUrl(U.catalogUrl(cat.id)) },
        { "@type": "ListItem", position: cat ? 4 : 3, name: p.nombre, item: U.absUrl(U.productUrl(p)) }
      ].filter(Boolean)
    }, "ld-breadcrumb");
    // Product schema solo con precio confirmado (Google exige offers, review o rating).
    if (U.hasPrice(p)) {
      U.addJsonLd({
        "@context": "https://schema.org", "@type": "Product",
        name: p.nombre, description: p.descripcion, sku: p.referencia || undefined, category: cat?.nombre,
        image: imgs.map((i) => U.absUrl(i.src)),
        brand: { "@type": "Brand", name: OXI.company.nombre },
        offers: {
          "@type": "Offer", priceCurrency: "COP", price: p.precio, availability: "https://schema.org/InStock",
          url: U.absUrl(U.productUrl(p)), seller: { "@type": "Organization", name: OXI.company.nombre }
        }
      }, "ld-product");
    }

    /* ---------- Bloques ---------- */
    const gallery = imgs.length
      ? `<button type="button" class="gallery-main" id="gallery-main" aria-label="Ampliar fotografía">
           <img src="${esc(imgs[0].src)}" alt="${esc(imgs[0].alt || p.nombre)}" width="1200" height="900" class="${imgs[0].encuadre === "contain" ? "fit-contain" : ""}" fetchpriority="high">
           ${U.photoTagHtml(imgs[0])}
           <span class="zoom-hint"><i class="bi bi-arrows-fullscreen" aria-hidden="true"></i>Ampliar</span>
         </button>
         ${imgs.length > 1 ? `<div class="gallery-thumbs" role="group" aria-label="Fotografías del producto">${imgs.map((im, i) =>
           `<button type="button" class="gallery-thumb" data-i="${i}" aria-current="${i === 0}" aria-label="Ver foto ${i + 1} de ${imgs.length}"><img src="${esc(im.src)}" alt="" loading="lazy" width="160" height="120"></button>`).join("")}</div>` : ""}`
      : `<div class="gallery-main" style="cursor:default">${U.pendingPhotoHtml("Fotografía del equipo pendiente")}</div>`;

    const plate = `
      <div class="plate">
        <div class="plate-head">
          <span class="plate-title">Datos técnicos</span>
          <span class="plate-ref">${esc(p.nombre)}  |  Ref. ${esc(U.refText(p))}</span>
        </div>
        <dl class="plate-grid">
          ${(OXI.specFields || []).map((f) => {
            const v = U.specValue(p, f);
            return `<div class="plate-cell"><dt>${f.label}</dt><dd class="${v ? "" : "is-pending"}">${v ? esc(v) : "Por confirmar"}</dd></div>`;
          }).join("")}
        </dl>
        ${U.confirmedSpecs(p).length < (OXI.specFields || []).length ? `<p class="plate-foot mb-0">Los datos “Por confirmar” se publicarán cuando el fabricante o Oxi Smart los valide. Pídalos en su cotización.</p>` : ""}
      </div>`;

    const listBlock = (key, heading) => {
      const arr = p[key] || [];
      if (!arr.length) return "";
      return `<section class="spec-section col-md-6" data-aos="fade-up"><h2>${heading}</h2><ul class="check-list">${arr.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section>`;
    };
    const pend = U.pendingSections(p);

    root.innerHTML = `
      <div class="container page-head pb-0">
        <nav aria-label="Ruta de navegación">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="index.html">Inicio</a></li>
            <li class="breadcrumb-item"><a href="catalogo.html">Catálogo</a></li>
            ${cat ? `<li class="breadcrumb-item"><a href="${U.catalogUrl(cat.id)}">${esc(cat.nombre)}</a></li>` : ""}
            <li class="breadcrumb-item active" aria-current="page">${esc(p.nombre)}</li>
          </ol>
        </nav>
      </div>
      <div class="container">
        <div class="row g-4 g-lg-5">
          <div class="col-lg-7" data-aos="fade-in">${gallery}</div>
          <div class="col-lg-5">
            ${cat ? `<a class="p-card-cat" href="${U.catalogUrl(cat.id)}">${esc(cat.nombre)}</a>` : ""}
            <h1 class="product-title mt-1">${esc(p.nombre)}</h1>
            <p class="product-ref mb-3">Referencia: <strong class="text-deep">${esc(U.refText(p))}</strong></p>
            <p class="lead">${esc(p.resumen)}</p>
            <div class="product-buy">
              <div class="price ${U.hasPrice(p) ? "" : "is-consult"}">${esc(U.priceText(p))}${U.hasPrice(p) ? " <small>COP</small>" : ""}</div>
              <p class="price-note mt-2 mb-3">${U.hasPrice(p) ? esc(OXI.company.catalogo.notaPrecios) : "El precio depende de la configuración. Pídalo por WhatsApp y le respondemos con la cotización."}</p>
              <div class="d-grid gap-2">
                <button type="button" class="btn btn-wa btn-lg" data-quote="${esc(p.id)}"><i class="bi bi-whatsapp" aria-hidden="true"></i>Cotizar por WhatsApp</button>
                <button type="button" class="btn btn-oxi-line" data-pdf-product="${esc(p.id)}"><i class="bi bi-file-earmark-pdf" aria-hidden="true"></i>Descargar ficha PDF</button>
              </div>
            </div>
            ${p.estado !== "aprobado" ? `<div class="notice mt-3"><i class="bi bi-info-circle" aria-hidden="true"></i><p>Ficha en validación. Precio, referencia y datos técnicos se confirman en la cotización.</p></div>` : ""}
          </div>
        </div>

        <div class="row g-4 g-lg-5 section-tight">
          <div class="col-lg-7">
            <section data-aos="fade-up">
              <h2 class="h3">Descripción</h2>
              <p>${esc(p.descripcion)}</p>
            </section>
          </div>
        </div>

        <section class="mb-5" data-aos="fade-up" aria-label="Especificaciones técnicas">
          <h2 class="h3 mb-3">Especificaciones técnicas</h2>
          ${plate}
        </section>

        <div class="row g-4 g-lg-5">
          ${listBlock("caracteristicas", "Características")}
          ${listBlock("aplicaciones", "Aplicaciones")}
          ${listBlock("ventajas", "Ventajas")}
          ${listBlock("componentes", "Componentes")}
          ${listBlock("recomendaciones", "Recomendaciones")}
        </div>
        ${pend.length ? `<p class="pending-list mt-4">Pendiente de aprobación: ${esc(pend.join(", "))}.</p>` : ""}

        <section class="section-tight" id="relacionados" aria-labelledby="rel-title"></section>
      </div>`;

    /* ---------- Galería y lightbox ---------- */
    let current = 0;
    const main = document.getElementById("gallery-main");
    root.querySelectorAll(".gallery-thumb").forEach((b) =>
      b.addEventListener("click", () => {
        current = +b.dataset.i;
        const im = imgs[current];
        const img = main.querySelector("img");
        img.src = im.src; img.alt = im.alt || p.nombre;
        img.className = im.encuadre === "contain" ? "fit-contain" : "";
        const tag = main.querySelector(".photo-tag");
        if (tag) tag.hidden = !U.isIllustrative(im);
        root.querySelectorAll(".gallery-thumb").forEach((x) => x.setAttribute("aria-current", String(x === b)));
      })
    );
    main?.addEventListener("click", () => U.lightbox(imgs, current));

    /* ---------- Relacionados ---------- */
    const rel = U.productsIn(p.categoria).filter((x) => x.id !== p.id).slice(0, 3);
    const relBox = document.getElementById("relacionados");
    if (rel.length) {
      relBox.innerHTML = `
        <div class="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
          <h2 id="rel-title" class="h3 mb-0">Más en ${esc(cat?.nombre || "el catálogo")}</h2>
          <a class="link-arrowless" href="${U.catalogUrl(p.categoria)}">Ver toda la categoría</a>
        </div>
        <div class="row g-4">${rel.map((x, i) => `<div class="col-sm-6 col-lg-4">${U.cardHtml(x, { delay: i * 60 })}</div>`).join("")}</div>`;
    } else relBox.remove();

    if (window.AOS) AOS.refreshHard();
    U.renderCredits();
  });
})();
