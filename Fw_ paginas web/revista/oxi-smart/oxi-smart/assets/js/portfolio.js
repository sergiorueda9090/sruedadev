/* =====================================================================
   OXI SMART — Portafolio de proyectos (proyectos.html)
   Filtros por tipo de solución y visor ampliado de fotos.
   Datos: assets/js/data/projects.js
   ===================================================================== */
(() => {
  "use strict";
  const OXI = (window.OXI = window.OXI || {});

  function cardHtml(pr, i = 0) {
    const U = OXI.utils;
    const esc = U.escapeHtml;
    const type = (OXI.projectTypes || []).find((t) => t.id === pr.tipo);
    const img = (pr.imagenes || [])[0];
    const equipos = (pr.equipos || []).map((id) => {
      const p = U.getProduct(id);
      return p ? `<a href="${U.productUrl(p)}">${esc(p.nombre)}</a>` : esc(id);
    }).join(", ");
    return `
      <article class="project-card" data-aos="fade-up" data-aos-delay="${(i % 3) * 60}">
        <button type="button" class="project-media" data-project="${esc(pr.id)}" aria-label="Ver fotografías de ${esc(pr.nombre)}">
          ${img ? `<img src="${esc(img.src)}" alt="${esc(img.alt || pr.nombre)}" loading="lazy" width="600" height="400">` : U.pendingPhotoHtml()}
        </button>
        <div class="project-body">
          ${type ? `<span class="p-card-cat">${esc(type.nombre)}</span>` : ""}
          <h3 class="h5 mt-1 mb-2">${esc(pr.nombre)}</h3>
          <p class="small mb-0">${esc(pr.descripcion)}</p>
          <dl>
            ${pr.ubicacion ? `<dt>Ubicación</dt><dd>${esc(pr.ubicacion)}</dd>` : ""}
            ${equipos ? `<dt>Equipos</dt><dd>${equipos}</dd>` : ""}
            ${(pr.resultados || []).length ? `<dt>Resultados</dt><dd>${pr.resultados.map(esc).join("<br>")}</dd>` : ""}
          </dl>
        </div>
      </article>`;
  }

  OXI.portfolio = { cardHtml };

  // Visor: funciona en cualquier página que muestre tarjetas de proyecto
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-project]");
    if (!b) return;
    const pr = (OXI.projects || []).find((x) => x.id === b.dataset.project);
    if (pr && (pr.imagenes || []).length) OXI.utils.lightbox(pr.imagenes, 0);
  });

  document.addEventListener("oxi:ready", () => {
    const grid = document.getElementById("projects-grid");
    if (!grid) return;
    const U = OXI.utils;
    const esc = U.escapeHtml;
    const chips = document.getElementById("projects-chips");
    const all = OXI.projects || [];
    let current = new URLSearchParams(location.search).get("tipo") || "";

    if (!all.length) {
      chips.closest("[data-filters]")?.setAttribute("hidden", "");
      grid.innerHTML = `
        <div class="col-12"><div class="empty-state">
          <h2 class="h3">Estamos documentando nuestros proyectos</h2>
          <p>Publicaremos aquí cada proyecto con fotografías propias, ubicación, equipos instalados y resultados verificables. Mientras tanto, pídanos referencias de instalaciones o cuéntenos su proyecto.</p>
          <div class="d-flex flex-wrap gap-2">
            <button type="button" class="btn btn-wa" data-quote=""><i class="bi bi-whatsapp" aria-hidden="true"></i>Pedir referencias</button>
            <a class="btn btn-oxi-line" href="catalogo.html">Ver equipos</a>
          </div>
        </div></div>`;
      return;
    }

    const types = (OXI.projectTypes || []).filter((t) => all.some((p) => p.tipo === t.id));
    const chip = (id, label, n) => `<button type="button" class="chip" data-tipo="${id}" aria-pressed="${current === id}">${esc(label)} <span class="chip-n">${n}</span></button>`;
    chips.innerHTML = chip("", "Todos", all.length) + types.map((t) => chip(t.id, t.nombre, all.filter((p) => p.tipo === t.id).length)).join("");

    function render() {
      const list = all.filter((p) => !current || p.tipo === current);
      chips.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.tipo === current)));
      grid.innerHTML = list.map((pr, i) => `<div class="col-md-6 col-lg-4">${cardHtml(pr, i)}</div>`).join("");
      if (window.AOS) AOS.refreshHard();
    }
    chips.addEventListener("click", (e) => {
      const c = e.target.closest(".chip");
      if (!c) return;
      current = c.dataset.tipo;
      history.replaceState(null, "", current ? `?tipo=${current}` : location.pathname);
      render();
    });
    render();
  });
})();
