/* =====================================================================
   OXI SMART — Catálogo (catalogo.html)
   Búsqueda, filtros por categoría, orden y paginación. El estado vive
   en la URL (?q=&categoria=&orden=&pagina=) para poder compartir enlaces.
   ===================================================================== */
(() => {
  "use strict";
  document.addEventListener("oxi:ready", () => {
    const OXI = window.OXI;
    const U = OXI.utils;
    const grid = document.getElementById("catalog-grid");
    if (!grid) return;

    const els = {
      search: document.getElementById("catalog-search"),
      sort: document.getElementById("catalog-sort"),
      chips: document.getElementById("catalog-chips"),
      meta: document.getElementById("catalog-meta"),
      pager: document.getElementById("catalog-pager"),
      title: document.getElementById("catalog-title"),
      clear: document.getElementById("catalog-clear")
    };
    const PER_PAGE = OXI.company?.catalogo?.productosPorPagina || 9;
    const params = new URLSearchParams(location.search);
    const state = {
      q: params.get("q") || "",
      cat: U.getCategory(params.get("categoria")) ? params.get("categoria") : "",
      sort: params.get("orden") || "destacados",
      page: Math.max(1, parseInt(params.get("pagina"), 10) || 1)
    };

    /* Chips de categoría */
    const all = OXI.products || [];
    const chip = (id, label, n) =>
      `<button type="button" class="chip" data-cat="${id}" aria-pressed="${state.cat === id}">${U.escapeHtml(label)} <span class="chip-n">${n}</span></button>`;
    els.chips.innerHTML = chip("", "Todos", all.length) + U.categories().map((c) => chip(c.id, c.nombre, U.productsIn(c.id).length)).join("");

    els.search.value = state.q;
    els.sort.value = state.sort;

    const sorters = {
      destacados: (a, b) => (b.destacado === true) - (a.destacado === true) || catOrder(a) - catOrder(b),
      "nombre-asc": (a, b) => a.nombre.localeCompare(b.nombre, "es"),
      "nombre-desc": (a, b) => b.nombre.localeCompare(a.nombre, "es"),
      // Productos sin precio confirmado siempre al final
      "precio-asc": (a, b) => priceKey(a, 1) - priceKey(b, 1),
      "precio-desc": (a, b) => priceKey(b, -1) - priceKey(a, -1)
    };
    function catOrder(p) { return U.getCategory(p.categoria)?.orden ?? 99; }
    function priceKey(p, dir) { return U.hasPrice(p) ? p.precio : dir > 0 ? Infinity : -Infinity; }

    function filtered() {
      const q = U.normalize(state.q);
      const words = q.split(/\s+/).filter(Boolean);
      return all
        .filter((p) => !state.cat || p.categoria === state.cat)
        .filter((p) => {
          if (!words.length) return true;
          const hay = U.normalize([p.nombre, p.referencia, p.resumen, U.getCategory(p.categoria)?.nombre].join(" "));
          return words.every((w) => hay.includes(w));
        })
        .sort(sorters[state.sort] || sorters.destacados);
    }

    function syncUrl() {
      const p = new URLSearchParams();
      if (state.q) p.set("q", state.q);
      if (state.cat) p.set("categoria", state.cat);
      if (state.sort !== "destacados") p.set("orden", state.sort);
      if (state.page > 1) p.set("pagina", state.page);
      history.replaceState(null, "", `${location.pathname}${p.toString() ? `?${p}` : ""}`);
    }

    function render({ scroll = false } = {}) {
      const list = filtered();
      const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
      state.page = Math.min(state.page, pages);
      const slice = list.slice((state.page - 1) * PER_PAGE, state.page * PER_PAGE);

      els.chips.querySelectorAll(".chip").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.cat === state.cat)));
      const cat = U.getCategory(state.cat);
      els.title.textContent = cat ? cat.nombre : "Todos los equipos";
      els.meta.textContent = list.length
        ? `${list.length} ${list.length === 1 ? "equipo" : "equipos"}${state.q ? ` para “${state.q}”` : ""}${pages > 1 ? `  |  página ${state.page} de ${pages}` : ""}`
        : "";
      els.clear.hidden = !(state.q || state.cat);

      grid.innerHTML = slice.length
        ? slice.map((p, i) => `<div class="col-sm-6 col-lg-4">${U.cardHtml(p, { delay: (i % 3) * 60 })}</div>`).join("")
        : `<div class="col-12"><div class="empty-state">
             <h3>No encontramos equipos${state.q ? ` para “${U.escapeHtml(state.q)}”` : ""}</h3>
             <p>Pruebe con otra palabra, quite el filtro de categoría o escríbanos: le ayudamos a elegir el equipo.</p>
             <div class="d-flex flex-wrap gap-2">
               <button type="button" class="btn btn-oxi" data-reset>Ver todos los equipos</button>
               <button type="button" class="btn btn-wa" data-quote=""><i class="bi bi-whatsapp" aria-hidden="true"></i>Pedir asesoría</button>
             </div></div></div>`;

      // Paginación
      if (pages > 1) {
        const item = (n, label, disabled, active) =>
          `<li class="page-item${disabled ? " disabled" : ""}${active ? " active" : ""}"><button type="button" class="page-link" data-page="${n}"${active ? ' aria-current="page"' : ""}${disabled ? " disabled" : ""}>${label}</button></li>`;
        let html = item(state.page - 1, '<span aria-hidden="true">‹</span><span class="visually-hidden">Anterior</span>', state.page === 1);
        for (let n = 1; n <= pages; n++) html += item(n, n, false, n === state.page);
        html += item(state.page + 1, '<span aria-hidden="true">›</span><span class="visually-hidden">Siguiente</span>', state.page === pages);
        els.pager.innerHTML = `<ul class="pagination justify-content-center">${html}</ul>`;
      } else els.pager.innerHTML = "";

      syncUrl();
      if (window.AOS) AOS.refreshHard();
      if (scroll) document.getElementById("catalogo-listado").scrollIntoView({ behavior: "smooth", block: "start" });
      U.renderCredits();
    }

    /* Eventos */
    let t;
    els.search.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => { state.q = els.search.value.trim(); state.page = 1; render(); }, 180);
    });
    document.getElementById("catalog-search-form").addEventListener("submit", (e) => e.preventDefault());
    els.sort.addEventListener("change", () => { state.sort = els.sort.value; state.page = 1; render(); });
    els.chips.addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      state.cat = b.dataset.cat; state.page = 1; render();
    });
    els.pager.addEventListener("click", (e) => {
      const b = e.target.closest("[data-page]");
      if (!b || b.disabled) return;
      state.page = parseInt(b.dataset.page, 10); render({ scroll: true });
    });
    const reset = () => { state.q = ""; state.cat = ""; state.page = 1; els.search.value = ""; render(); };
    els.clear.addEventListener("click", reset);
    const note = document.getElementById("price-note");
    if (note) note.textContent = OXI.company?.catalogo?.notaPrecios || "";
    grid.addEventListener("click", (e) => { if (e.target.closest("[data-reset]")) reset(); });

    /* Selector de categoría del panel PDF */
    const pdfCat = document.getElementById("pdf-category");
    if (pdfCat) {
      pdfCat.innerHTML = U.categories().map((c) => `<option value="${c.id}">${U.escapeHtml(c.nombre)} (${U.productsIn(c.id).length})</option>`).join("");
      if (state.cat) pdfCat.value = state.cat;
    }

    render();
  });
})();
