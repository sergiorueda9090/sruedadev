/* ==========================================================================
   ESSENCE & TIME — Motor de catálogo
   Compartido por perfumes, lociones, relojes, regalos, novedades y búsqueda.
   <body data-page="catalog" data-scope="perfumes|lociones|relojes|regalos|novedades|search">
   Estado en la URL (history.replaceState): facetas multivalor separadas por
   comas, min, max, disponible, presupuesto, orden, q. Sin recargas.
   ========================================================================== */
(function (ET) {
  'use strict';

  const SCOPES = {
    perfumes:  { facets: ['genero', 'marca', 'concentracion', 'familia', 'volumen', 'momento'], shortcuts: ['genero', 'concentracion'], extraShortcut: 'sets' },
    lociones:  { facets: ['sub', 'marca', 'volumen', 'genero'], shortcuts: ['sub'] },
    relojes:   { facets: ['genero', 'marca', 'estilo', 'correa', 'material', 'color'], shortcuts: ['genero', 'estilo'], extraShortcut: 'gift-watches' },
    regalos:   { facets: ['cat', 'ocasion', 'genero'], shortcuts: ['ocasion'], budgets: true },
    novedades: { facets: ['cat', 'genero', 'marca'], shortcuts: ['cat'] },
    search:    { facets: ['cat', 'genero', 'marca'], shortcuts: [] },
  };
  const RESERVED = ['min', 'max', 'disponible', 'presupuesto', 'orden', 'q'];

  ET.pages = ET.pages || {};
  ET.pages.catalog = {
    init() {
      const { config, catalog, utils, ui } = ET;
      const { $, $$, esc, formatCOP, plural } = utils;
      const scopeKey = document.body.dataset.scope;
      const scope = SCOPES[scopeKey];
      const pageSize = config.catalog.pageSize;
      const pageFile = utils.currentPage();

      const el = {
        grid: $('[data-grid]'),
        count: $('[data-result-count]'),
        sort: $('[data-sort]'),
        filters: $('[data-filters]'),
        sidebar: $('[data-filters-sidebar]'),
        drawerBody: $('[data-filters-drawer-body]'),
        drawerCount: $('[data-drawer-count]'),
        active: $('[data-active-filters]'),
        more: $('[data-loadmore]'),
        shortcuts: $('[data-shortcuts]'),
        live: $('[data-live]'),
        searchHead: $('[data-search-head]'),
        filterBtnCount: $('[data-filter-btn-count]'),
      };

      /* ---- Conjunto base ------------------------------------------------ */
      const params = utils.params();
      const query = (params.get('q') || '').trim().slice(0, 80);
      let base;
      if (scopeKey === 'search') base = query ? catalog.search(query) : [];
      else if (scopeKey === 'regalos') base = catalog.giftScope();
      else if (scopeKey === 'novedades') base = catalog.newScope();
      else base = catalog.inCategory(scopeKey);

      const facets = scope.facets.filter((k) => catalog.facetValues(k, base).length >= 2);
      const priceOf = (p) => catalog.displayVariant(p).price;
      const prices = base.map(priceOf);
      const priceBounds = { min: prices.length ? Math.min(...prices) : 0, max: prices.length ? Math.max(...prices) : 0 };

      /* ---- Estado --------------------------------------------------------- */
      const state = { sel: {}, min: null, max: null, available: false, budget: null, sort: 'featured', shown: pageSize };
      const readURL = () => {
        const p = utils.params();
        facets.forEach((k) => {
          const raw = p.get(k);
          state.sel[k] = raw ? raw.split(',').map((x) => catalog.slugify(x)).filter(Boolean) : [];
        });
        const toInt = (v) => { const n = Number.parseInt(v, 10); return Number.isFinite(n) && n >= 0 ? n : null; };
        state.min = toInt(p.get('min'));
        state.max = toInt(p.get('max'));
        state.available = p.get('disponible') === '1';
        state.budget = scope.budgets && config.budgets.some((b) => b.slug === p.get('presupuesto')) ? p.get('presupuesto') : null;
        const sort = p.get('orden');
        state.sort = config.catalog.sortOptions.some((o) => o.value === sort) ? sort : 'featured';
      };
      const writeURL = () => {
        const p = new URLSearchParams();
        if (query) p.set('q', query);
        facets.forEach((k) => { if (state.sel[k].length) p.set(k, state.sel[k].join(',')); });
        if (state.min != null) p.set('min', state.min);
        if (state.max != null) p.set('max', state.max);
        if (state.available) p.set('disponible', '1');
        if (state.budget) p.set('presupuesto', state.budget);
        if (state.sort !== 'featured') p.set('orden', state.sort);
        const qs = p.toString();
        history.replaceState(null, '', qs ? `${pageFile}?${qs}` : pageFile);
      };

      /* ---- Filtrado ------------------------------------------------------- */
      const budgetDef = () => config.budgets.find((b) => b.slug === state.budget);
      const passes = (p, skipFacet) => {
        for (const k of facets) {
          if (k !== skipFacet && !catalog.matchesFacet(k, p, state.sel[k])) return false;
        }
        const price = priceOf(p);
        if (state.min != null && price < state.min) return false;
        if (state.max != null && price > state.max) return false;
        const b = budgetDef();
        if (b && (price < b.min || (b.max != null && price > b.max))) return false;
        if (state.available && !catalog.isAvailable(p)) return false;
        return true;
      };

      const sorters = {
        featured: scopeKey === 'search' ? null : (a, b) => a.featured - b.featured,
        newest: (a, b) => String(b.addedAt).localeCompare(String(a.addedAt)) || a.featured - b.featured,
        'price-asc': (a, b) => priceOf(a) - priceOf(b),
        'price-desc': (a, b) => priceOf(b) - priceOf(a),
        'name-asc': (a, b) => a.name.localeCompare(b.name, 'es'),
      };
      const results = () => {
        const list = base.filter((p) => passes(p));
        const fn = sorters[state.sort];
        // Los agotados van al final sin alterar el orden elegido
        const sorted = fn ? list.slice().sort(fn) : list.slice();
        return sorted.sort((a, b) => Number(!catalog.isAvailable(a)) - Number(!catalog.isAvailable(b)));
      };

      /* ---- Formulario de filtros (uno solo; se mueve entre barra y panel) --- */
      const groupHTML = (k) => {
        const def = catalog.FACETS[k];
        const values = catalog.facetValues(k, base);
        const id = `f-${k}`;
        return `<div class="filter-group">
          <h3 class="m-0"><button type="button" class="filter-group__toggle" aria-expanded="true" aria-controls="${id}">${esc(def.label)}<i class="bi bi-chevron-down" aria-hidden="true"></i></button></h3>
          <fieldset class="filter-group__body" id="${id}"><legend class="visually-hidden">${esc(def.label)}</legend>
            ${values.map((v) => `<label class="check-et"><input type="checkbox" name="${k}" value="${esc(v.value)}">
              <span>${esc(v.label)}</span><span class="check-et__count" data-c="${k}:${esc(v.value)}"></span></label>`).join('')}
          </fieldset></div>`;
      };
      el.filters.innerHTML = `
        ${scope.budgets ? `<div class="filter-group"><h3 class="m-0"><button type="button" class="filter-group__toggle" aria-expanded="true" aria-controls="f-presupuesto">Presupuesto<i class="bi bi-chevron-down" aria-hidden="true"></i></button></h3>
          <fieldset class="filter-group__body" id="f-presupuesto"><legend class="visually-hidden">Presupuesto</legend>
            <label class="check-et"><input type="radio" name="presupuesto" value=""><span>Cualquier precio</span></label>
            ${config.budgets.map((b) => `<label class="check-et"><input type="radio" name="presupuesto" value="${b.slug}"><span>${esc(b.label)}</span><span class="check-et__count" data-c="presupuesto:${b.slug}"></span></label>`).join('')}
          </fieldset></div>` : ''}
        ${facets.map(groupHTML).join('')}
        ${base.length > 1 && priceBounds.max > priceBounds.min ? `<div class="filter-group"><h3 class="m-0"><button type="button" class="filter-group__toggle" aria-expanded="true" aria-controls="f-precio">Precio<i class="bi bi-chevron-down" aria-hidden="true"></i></button></h3>
          <fieldset class="filter-group__body" id="f-precio"><legend class="visually-hidden">Precio en pesos colombianos</legend>
            <div class="price-range">
              <div class="field" data-field><label class="field__label" for="f-min">Mínimo</label>
                <input class="input-et" id="f-min" name="min" type="number" inputmode="numeric" min="0" step="10000" placeholder="${priceBounds.min}" aria-describedby="f-price-error"></div>
              <div class="field" data-field><label class="field__label" for="f-max">Máximo</label>
                <input class="input-et" id="f-max" name="max" type="number" inputmode="numeric" min="0" step="10000" placeholder="${priceBounds.max}" aria-describedby="f-price-error"></div>
            </div>
            <p class="field__hint m-0">De ${formatCOP(priceBounds.min)} a ${formatCOP(priceBounds.max)}</p>
            <p class="field__error" id="f-price-error" role="alert"></p>
          </fieldset></div>` : ''}
        ${base.some((p) => !catalog.isAvailable(p)) ? `<div class="filter-group"><div class="filter-group__body pt-4">
          <label class="check-et"><input type="checkbox" name="disponible" value="1"><span>Ocultar productos agotados</span></label></div></div>` : ''}
        <div class="filters__actions"><button type="button" class="btn-et btn-et--text" data-clear>Limpiar filtros</button></div>`;

      // Ordenamiento
      el.sort.innerHTML = config.catalog.sortOptions
        .map((o) => `<option value="${o.value}">${esc(scopeKey === 'search' && o.value === 'featured' ? 'Relevancia' : o.label)}</option>`).join('');

      const syncForm = () => {
        $$('input[type="checkbox"]', el.filters).forEach((i) => {
          i.checked = i.name === 'disponible' ? state.available : (state.sel[i.name] || []).includes(i.value);
        });
        $$('input[name="presupuesto"]', el.filters).forEach((i) => { i.checked = (state.budget || '') === i.value; });
        const min = $('#f-min'); const max = $('#f-max');
        if (min) min.value = state.min ?? '';
        if (max) max.value = state.max ?? '';
        el.sort.value = state.sort;
      };

      // Mover el formulario según el ancho (sin duplicar el DOM ni los listeners)
      const mq = window.matchMedia('(min-width: 992px)');
      const placeFilters = () => {
        const target = mq.matches ? el.sidebar : el.drawerBody;
        if (target && el.filters.parentElement !== target) target.appendChild(el.filters);
        if (mq.matches) {
          const drawer = bootstrap.Offcanvas.getInstance('#filters-drawer');
          if (drawer) drawer.hide();
        }
      };
      mq.addEventListener('change', placeFilters);
      placeFilters();

      /* ---- Render ---------------------------------------------------------- */
      const updateCounts = () => {
        facets.forEach((k) => {
          const pool = base.filter((p) => passes(p, k));
          catalog.facetValues(k, base).forEach((v) => {
            const n = pool.filter((p) => catalog.matchesFacet(k, p, [v.value])).length;
            const c = $(`[data-c="${k}:${v.value}"]`, el.filters);
            if (c) c.textContent = n;
            const input = $(`input[name="${k}"][value="${v.value}"]`, el.filters);
            if (input) {
              input.disabled = n === 0 && !input.checked;
              input.closest('.check-et').classList.toggle('is-disabled', input.disabled);
            }
          });
        });
        if (scope.budgets) {
          const saved = state.budget;
          config.budgets.forEach((b) => {
            state.budget = b.slug;
            const n = base.filter((p) => passes(p)).length;
            const c = $(`[data-c="presupuesto:${b.slug}"]`, el.filters);
            if (c) c.textContent = n;
          });
          state.budget = saved;
        }
      };

      const activeChips = () => {
        const chips = [];
        facets.forEach((k) => state.sel[k].forEach((v) => {
          const val = catalog.facetValues(k, base).find((x) => x.value === v);
          if (val) chips.push({ k, v, label: val.label });
        }));
        if (state.budget) chips.push({ k: 'presupuesto', v: state.budget, label: budgetDef().label });
        if (state.min != null) chips.push({ k: 'min', label: `Desde ${formatCOP(state.min)}` });
        if (state.max != null) chips.push({ k: 'max', label: `Hasta ${formatCOP(state.max)}` });
        if (state.available) chips.push({ k: 'disponible', label: 'Solo disponibles' });
        el.active.innerHTML = chips.length
          ? `${chips.map((c) => `<button type="button" class="chip" data-unset="${c.k}" data-v="${esc(c.v || '')}">${esc(c.label)}<i class="bi bi-x-lg" aria-hidden="true"></i><span class="visually-hidden">: quitar filtro</span></button>`).join('')}
             <button type="button" class="btn-et btn-et--text btn-et--sm" data-clear>Limpiar todo</button>`
          : '';
        if (el.filterBtnCount) el.filterBtnCount.textContent = chips.length ? `(${chips.length})` : '';
        return chips.length;
      };

      const syncShortcuts = () => {
        $$('[data-shortcut]').forEach((b) => {
          if (b.dataset.shortcut.startsWith('link:')) return;
          const [k, v] = b.dataset.shortcut.split(':');
          const on = k === 'all' ? activeCount === 0 : (state.sel[k] || []).length === 1 && state.sel[k][0] === v;
          b.setAttribute('aria-pressed', String(on));
        });
      };

      let activeCount = 0;
      let lastLen = -1;
      const render = ({ announce = true, keepShown = false } = {}) => {
        const list = results();
        if (!keepShown) state.shown = pageSize;
        const visible = list.slice(0, state.shown);
        activeCount = activeChips();
        updateCounts();
        syncShortcuts();

        el.count.innerHTML = `<strong>${list.length}</strong> ${list.length === 1 ? 'producto' : 'productos'}`;
        if (el.drawerCount) el.drawerCount.textContent = `Ver ${plural(list.length, 'resultado', 'resultados')}`;

        if (!list.length) {
          el.grid.innerHTML = '';
          el.grid.hidden = true;
          el.more.innerHTML = scopeKey === 'search' && !activeCount ? '' : ui.emptyState({
            title: 'Ningún producto coincide con estos filtros',
            text: 'Quita algún filtro o amplía el rango de precio para ver más opciones.',
            actions: [{ label: 'Limpiar filtros', button: true, attrs: 'data-clear' }],
          });
        } else {
          el.grid.hidden = false;
          el.grid.innerHTML = visible.map((p, i) => ui.productCard(p, { eager: i < 2 })).join('');
          const pct = Math.round((visible.length / list.length) * 100);
          el.more.innerHTML = list.length > pageSize ? `<div class="load-more">
              <div class="load-more__progress dial-progress" aria-hidden="true"><div class="dial-track"></div><div class="dial-progress__fill" style="width:${pct}%"></div></div>
              <p class="load-more__label">Mostrando ${visible.length} de ${list.length}</p>
              ${visible.length < list.length ? `<button type="button" class="btn-et btn-et--secondary" data-more>Cargar ${Math.min(pageSize, list.length - visible.length)} productos más</button>` : ''}
            </div>` : '';
        }
        if (announce && list.length !== lastLen) el.live.textContent = `${plural(list.length, 'producto', 'productos')} ${activeCount ? 'con los filtros aplicados' : 'en total'}.`;
        lastLen = list.length;
        ET.anim.refresh();
      };

      const apply = (opts) => { writeURL(); render(opts); };

      /* ---- Eventos ------------------------------------------------------------ */
      el.filters.addEventListener('change', (e) => {
        const t = e.target;
        if (t.name === 'disponible') state.available = t.checked;
        else if (t.name === 'presupuesto') state.budget = t.value || null;
        else if (facets.includes(t.name)) {
          const set = new Set(state.sel[t.name]);
          if (t.checked) set.add(t.value); else set.delete(t.value);
          state.sel[t.name] = [...set];
        } else return;
        apply();
      });

      const priceErr = $('#f-price-error');
      const readPrice = utils.debounce(() => {
        const min = $('#f-min'); const max = $('#f-max');
        const parse = (i) => (i.value === '' ? null : Math.max(0, Math.round(Number(i.value))));
        const a = parse(min); const b = parse(max);
        if (a != null && b != null && a > b) {
          ET.validation.setError(max, 'El máximo debe ser mayor o igual que el mínimo.');
          if (priceErr) priceErr.textContent = 'El máximo debe ser mayor o igual que el mínimo.';
          return;
        }
        ET.validation.setError(max, '');
        if (priceErr) priceErr.textContent = '';
        state.min = Number.isFinite(a) ? a : null;
        state.max = Number.isFinite(b) ? b : null;
        apply();
      }, 450);
      el.filters.addEventListener('input', (e) => { if (e.target.name === 'min' || e.target.name === 'max') readPrice(); });

      el.filters.addEventListener('click', (e) => {
        const tog = e.target.closest('.filter-group__toggle');
        if (tog) {
          const open = tog.getAttribute('aria-expanded') !== 'true';
          tog.setAttribute('aria-expanded', String(open));
          document.getElementById(tog.getAttribute('aria-controls')).hidden = !open;
        }
      });

      el.sort.addEventListener('change', () => { state.sort = el.sort.value; apply({ keepShown: true }); });

      const clearAll = () => {
        facets.forEach((k) => { state.sel[k] = []; });
        Object.assign(state, { min: null, max: null, available: false, budget: null });
        syncForm();
        apply();
      };

      document.addEventListener('click', (e) => {
        if (e.target.closest('[data-clear]')) { clearAll(); el.count.focus?.(); return; }
        const un = e.target.closest('[data-unset]');
        if (un) {
          const k = un.dataset.unset;
          if (facets.includes(k)) state.sel[k] = state.sel[k].filter((v) => v !== un.dataset.v);
          else if (k === 'presupuesto') state.budget = null;
          else if (k === 'disponible') state.available = false;
          else state[k] = null;
          syncForm();
          apply();
          const next = $('[data-unset]', el.active) || el.sort;
          next.focus();
          return;
        }
        if (e.target.closest('[data-more]')) {
          const firstNew = state.shown;
          state.shown += pageSize;
          render({ announce: false, keepShown: true });
          const card = $$('.pcard', el.grid)[firstNew];
          if (card) $('.pcard__link', card).focus({ preventScroll: false });
          el.live.textContent = `Se cargaron más productos. Mostrando ${Math.min(state.shown, results().length)}.`;
          return;
        }
        const sc = e.target.closest('[data-shortcut]');
        if (sc) {
          const [k, v] = sc.dataset.shortcut.split(':');
          if (k === 'link') return;
          if (k !== 'all' && !facets.includes(k)) return; // faceta sin datos: se sigue el enlace
          e.preventDefault();
          const on = sc.getAttribute('aria-pressed') === 'true';
          facets.forEach((f) => { state.sel[f] = []; });
          if (k !== 'all' && !on) state.sel[k] = [v];
          syncForm();
          apply();
          if (sc.hasAttribute('data-scroll-results')) {
            $('.toolbar').scrollIntoView({ behavior: utils.prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
            el.count.focus({ preventScroll: true });
          }
        }
      });

      /* ---- Accesos rápidos (derivados de datos reales) ------------------------ */
      if (el.shortcuts) {
        const chips = [];
        scope.shortcuts.filter((k) => facets.includes(k)).forEach((k) => {
          catalog.facetValues(k, base).forEach((v) => chips.push(`<button type="button" class="chip" data-shortcut="${k}:${v.value}" aria-pressed="false">${esc(v.label)}</button>`));
        });
        if (scope.extraShortcut === 'sets') {
          const sets = catalog.inCategory('regalos').filter((p) => p.subcategory === 'sets');
          if (sets.length) chips.push(`<a class="chip" href="regalos.html?cat=${catalog.slugify(catalog.subcategoryLabel('regalos', 'sets'))}" data-shortcut="link:sets">Sets de fragancias</a>`);
        }
        if (scope.extraShortcut === 'gift-watches' && catalog.giftScope().some((p) => p.category === 'relojes')) {
          chips.push(`<a class="chip" href="regalos.html?cat=relojes" data-shortcut="link:gift">Ideas para regalar</a>`);
        }
        el.shortcuts.innerHTML = chips.length ? `<button type="button" class="chip" data-shortcut="all" aria-pressed="false">Todos</button>${chips.join('')}` : '';
        el.shortcuts.hidden = !chips.length;
      }

      /* ---- Búsqueda: cabecera y sugerencias ------------------------------------ */
      if (scopeKey === 'search' && el.searchHead) {
        const qInput = $('#q-page');
        if (qInput) qInput.value = query;
        document.title = query ? `Resultados para «${query}» | Essence & Time` : 'Buscar | Essence & Time';
        const suggestion = !base.length && query ? catalog.suggestQuery(query) : null;
        el.searchHead.innerHTML = query
          ? `<h1 class="page-head__title">Resultados para «${esc(query)}»</h1>
             <p class="page-head__text">${base.length ? `${plural(base.length, 'producto coincide', 'productos coinciden')} con tu búsqueda.` : ''}</p>`
          : '<h1 class="page-head__title">Buscar en la tienda</h1><p class="page-head__text">Escribe un perfume, una marca, una nota olfativa o un material.</p>';
        if (query && !base.length) {
          $('[data-catalog-body]').hidden = true;
          const featured = catalog.all().filter((p) => catalog.isAvailable(p)).sort((a, b) => a.featured - b.featured).slice(0, 4);
          $('[data-search-empty]').innerHTML = `${suggestion ? `<p class="search-suggest">¿Quisiste decir <a href="busqueda.html?q=${encodeURIComponent(suggestion)}">${esc(suggestion)}</a>?</p>` : ''}
          ${ui.emptyState({
            title: 'No encontramos coincidencias. Prueba con otra marca o categoría.',
            text: suggestion ? '' : 'Revisa la ortografía o usa un término más general, como «perfume», «reloj» o «vainilla».',
            actions: [{ label: 'Ver perfumes', href: 'perfumes.html' }, { label: 'Ver lociones', href: 'lociones.html' }, { label: 'Ver relojes', href: 'relojes.html' }],
          })}
          <section class="section-sm" aria-labelledby="search-fav"><h2 class="h3" id="search-fav">Favoritos de la colección</h2>
            <div class="pgrid pgrid--4 mt-4">${featured.map((p) => ui.productCard(p)).join('')}</div></section>`;
          return;
        }
        if (!query) { $('[data-catalog-body]').hidden = true; return; }
      }

      readURL();
      syncForm();
      render({ announce: false });
      writeURL();
    },
  };
})(window.ET);
