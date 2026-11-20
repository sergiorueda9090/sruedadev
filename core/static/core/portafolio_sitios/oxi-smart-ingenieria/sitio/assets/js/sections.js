/* =====================================================================
   OXI SMART — Secciones dinámicas de Inicio y Empresa
   Cualquier elemento con data-render="..." se llena con los datos centrales.
   ===================================================================== */
(() => {
  "use strict";
  document.addEventListener("oxi:ready", () => {
    const OXI = window.OXI;
    const U = OXI.utils;
    const C = OXI.company;
    const esc = U.escapeHtml;

    const renderers = {
      /* Lista corta de líneas en el hero */
      "hero-lines": (el) => {
        el.innerHTML = U.categories().map((c) => `<li><a href="${U.catalogUrl(c.id)}">${esc(c.nombre)}</a></li>`).join("");
      },

      /* Párrafos de presentación corporativa */
      presentacion: (el) => {
        el.innerHTML = (C.presentacion || []).map((t, i) => `<p class="${i === 0 ? "lead" : ""}">${esc(t)}</p>`).join("");
      },

      /* Misión y visión: solo si están aprobadas */
      "mision-vision": (el) => {
        const items = [["Misión", C.mision], ["Visión", C.vision]].filter(([, v]) => v);
        if (!items.length) { el.closest("[data-render-wrap]")?.remove(); el.remove(); return; }
        el.innerHTML = items.map(([k, v]) => `<div class="col-md-6"><div class="benefit"><h3>${k}</h3><p>${esc(v)}</p></div></div>`).join("");
      },

      /* Categorías en filas con foto */
      categories: (el) => {
        el.innerHTML = U.categories().map((c, i) => {
          const n = U.productsIn(c.id).length;
          const thumb = c.imagen
            ? `<img src="${esc(c.imagen)}" alt="" loading="lazy" width="224" height="168">`
            : `<i class="bi ${esc(c.icono)}" aria-hidden="true"></i>`;
          return `<a class="cat-row" href="${U.catalogUrl(c.id)}" data-aos="fade-up" data-aos-delay="${i * 50}">
              <span class="cat-thumb">${thumb}</span>
              <span><h3>${esc(c.nombre)}</h3><p>${esc(c.descripcion)}</p></span>
              <span class="cat-count">${n} ${n === 1 ? "equipo" : "equipos"}</span>
            </a>`;
        }).join("");
      },

      /* Productos destacados */
      featured: (el) => {
        const list = (OXI.products || []).filter((p) => p.destacado).slice(0, Number(el.dataset.limit) || 6);
        el.innerHTML = list.map((p, i) => `<div class="col-sm-6 col-lg-4">${U.cardHtml(p, { delay: (i % 3) * 70 })}</div>`).join("");
      },

      /* Vista previa de proyectos (o aviso honesto si aún no hay) */
      "projects-preview": (el) => {
        const list = (OXI.projects || []).slice(0, 3);
        if (!list.length) {
          el.innerHTML = `
            <div class="col-12"><div class="empty-state d-md-flex align-items-center justify-content-between gap-4">
              <div>
                <h3>Portafolio en preparación</h3>
                <p class="mb-md-0">Estamos documentando nuestros proyectos con fotografías y resultados verificables. Si quiere conocer instalaciones de referencia, pídalas por WhatsApp.</p>
              </div>
              <button type="button" class="btn btn-wa flex-shrink-0" data-quote=""><i class="bi bi-whatsapp" aria-hidden="true"></i>Pedir referencias</button>
            </div></div>`;
          return;
        }
        el.innerHTML = list.map((pr, i) => `<div class="col-md-4">${OXI.portfolio.cardHtml(pr, i)}</div>`).join("");
      },

      /* Testimonios: la sección solo existe si hay testimonios reales */
      testimonials: (el) => {
        const list = C.testimonios || [];
        const wrap = el.closest("[data-render-wrap]");
        if (!list.length) { (wrap || el).remove(); return; }
        el.innerHTML = list.map((t) => `
          <div class="col-md-6 col-lg-4"><figure class="benefit mb-0">
            <blockquote class="mb-3"><p>“${esc(t.texto)}”</p></blockquote>
            <figcaption class="small"><strong class="text-deep">${esc(t.nombre)}</strong>${t.cargo ? `, ${esc(t.cargo)}` : ""}${t.empresa ? ` — ${esc(t.empresa)}` : ""}${t.ciudad ? ` (${esc(t.ciudad)})` : ""}</figcaption>
          </figure></div>`).join("");
      },

      /* Mapa (solo si está configurado) */
      map: (el) => {
        if (!C.mapaEmbedUrl) { el.remove(); return; }
        el.innerHTML = `<iframe src="${esc(C.mapaEmbedUrl)}" title="Ubicación de ${esc(C.nombre)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" style="border:0;width:100%;height:320px;border-radius:var(--r-md)"></iframe>`;
      }
    };

    document.querySelectorAll("[data-render]").forEach((el) => {
      const fn = renderers[el.dataset.render];
      if (fn) fn(el);
    });

    // Selector de producto del panel PDF (catálogo)
    const pdfProd = document.getElementById("pdf-product");
    if (pdfProd) {
      pdfProd.innerHTML = U.categories().map((c) => {
        const opts = U.productsIn(c.id).map((p) => `<option value="${esc(p.id)}">${esc(p.nombre)}</option>`).join("");
        return opts ? `<optgroup label="${esc(c.nombre)}">${opts}</optgroup>` : "";
      }).join("");
    }

    if (window.AOS) AOS.refreshHard();
    U.renderCredits();
  });
})();
