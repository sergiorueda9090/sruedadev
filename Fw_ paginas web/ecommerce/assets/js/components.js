/* ==========================================================================
   ESSENCE & TIME — Componentes compartidos
   Plantillas JS (sin fetch: funciona con servidor local y con file://).
   Se montan una sola vez desde main.js → ET.ui.mount().
   ========================================================================== */
(function (ET) {
  'use strict';

  const { config, catalog, cart, wishlist, utils } = ET;
  const { esc, formatCOP, $, $$ } = utils;
  const IMG_ROOT = 'assets/images/';
  const IMG_EXT = '.webp';

  /* ---- Imágenes ---------------------------------------------------------- */
  /** <img> responsive para imágenes de producto 4:5 exportadas a 400 y 800 px. */
  function productImg(image, { cls = '', eager = false, sizes = '(min-width: 1200px) 22vw, (min-width: 768px) 30vw, 48vw', alt } = {}) {
    if (!image) return '';
    const base = IMG_ROOT + image.src;
    return `<img class="${cls}" src="${base}-800${IMG_EXT}" srcset="${base}-400${IMG_EXT} 400w, ${base}-800${IMG_EXT} 800w"
      sizes="${sizes}" width="800" height="1000" alt="${esc(alt ?? image.alt)}"
      ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  }

  /* ---- Marca de esfera (estados vacíos, 404) ----------------------------- */
  function dialMark(cls = 'empty-state__mark') {
    const ticks = Array.from({ length: 60 }, (_, i) => {
      const major = i % 5 === 0;
      return `<line x1="50" y1="${major ? 6 : 8}" x2="50" y2="${major ? 13 : 11}" transform="rotate(${i * 6} 50 50)" stroke-width="${major ? 1.4 : .8}"/>`;
    }).join('');
    return `<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true" focusable="false" fill="none" stroke="currentColor">
      <circle cx="50" cy="50" r="46" stroke-width=".8"/>${ticks}
      <line x1="50" y1="50" x2="50" y2="24" stroke-width="1.6" stroke-linecap="round"/>
      <line x1="50" y1="50" x2="68" y2="58" stroke-width="1.2" stroke-linecap="round"/>
      <circle cx="50" cy="50" r="2.2" fill="currentColor" stroke="none"/></svg>`;
  }

  /* ---- Precio ------------------------------------------------------------ */
  function priceHTML(variant, { from = false, size = '' } = {}) {
    const sale = variant.compareAt && variant.compareAt > variant.price;
    return `<p class="price ${size} m-0">
      ${from ? '<span class="price__from">Desde</span>' : ''}
      <span class="price__now ${sale ? 'price__now--sale' : ''}">${sale ? '<span class="visually-hidden">Precio actual: </span>' : ''}${formatCOP(variant.price)}</span>
      ${sale ? `<span class="price__was"><span class="visually-hidden">Precio anterior: </span>${formatCOP(variant.compareAt)}</span>` : ''}
    </p>`;
  }

  function stockHTML(variant) {
    const state = catalog.stockState(variant);
    if (state === 'out') return '<span class="stock stock--out">Agotado</span>';
    if (state === 'low') return `<span class="stock stock--low">Quedan ${variant.stock} ${variant.stock === 1 ? 'unidad' : 'unidades'}</span>`;
    return '<span class="stock">Disponible</span>';
  }

  /* ---- Tarjeta de producto ------------------------------------------------ */
  /** Nombre de la elección: «tamaño» para volúmenes; si no, la etiqueta del producto. */
  function variantNoun(p) {
    if (p.variantLabel) return p.variantLabel.toLowerCase();
    return p.variants.some((x) => x.volumeMl) ? 'tamaño' : 'opción';
  }

  function productCard(p, { feature = false, heading = 'h3', eager = false, sizes } = {}) {
    const v = catalog.displayVariant(p);
    const available = catalog.isAvailable(p);
    const pct = catalog.discountPct(v);
    const saved = wishlist.has(p.id);
    const url = `producto.html?p=${encodeURIComponent(p.slug)}`;
    const [main, alt] = p.images;
    const tags = [
      !available ? '<span class="tag tag--soldout">Agotado</span>' : '',
      available && pct ? `<span class="tag tag--sale">−${pct} %</span>` : '',
      catalog.isNew(p) ? '<span class="tag tag--new">Nuevo</span>' : '',
    ].join('');
    const choice = catalog.hasChoice(p);
    const action = !available
      ? `<a class="btn-et btn-et--text pcard__add" href="${url}">Ver detalles<span class="visually-hidden"> de ${esc(p.name)}</span></a>`
      : choice
        ? `<button type="button" class="btn-et btn-et--text pcard__add" data-quick="${p.id}">Elegir ${esc(variantNoun(p))}<span class="visually-hidden"> de ${esc(p.name)}</span></button>`
        : `<button type="button" class="btn-et btn-et--text pcard__add" data-add="${p.id}" data-vid="${v.id}">Añadir<span class="visually-hidden"> ${esc(p.name)} al carrito</span></button>`;

    return `<article class="pcard ${feature ? 'pcard--feature' : ''} ${alt ? 'pcard--has-alt' : ''} ${available ? '' : 'pcard--soldout'}" data-pid="${p.id}">
      <div class="pcard__media">
        ${productImg(main, { cls: 'pcard__img pcard__img--main', eager, sizes })}
        ${alt ? productImg(alt, { cls: 'pcard__img pcard__img--alt', alt: '', sizes }) : ''}
        <div class="pcard__tags">${tags}</div>
        <button type="button" class="icon-btn pcard__fav" data-fav="${p.id}" aria-pressed="${saved}"
          aria-label="${saved ? 'Quitar' : 'Guardar'} ${esc(p.name)} ${saved ? 'de' : 'en'} favoritos">
          <i class="bi ${saved ? 'bi-heart-fill' : 'bi-heart'}" aria-hidden="true"></i></button>
      </div>
      <div class="pcard__body">
        <p class="pcard__brand m-0">${esc(p.brand)}</p>
        <${heading} class="pcard__name"><a class="pcard__link" href="${url}">${esc(p.name)}</a></${heading}>
        <p class="pcard__meta">${esc(catalog.metaLine(p))}</p>
        <div class="pcard__foot">
          ${priceHTML(v, { from: choice && catalog.minPrice(p) < Math.max(...p.variants.map((x) => x.price)) && v.price === catalog.minPrice(p) })}
          ${action}
        </div>
      </div>
    </article>`;
  }

  function skeletonCards(n = 4) {
    return Array.from({ length: n }, () => `<div class="pcard pcard--skeleton" aria-hidden="true">
      <div class="pcard__media"></div><div class="skeleton-line skeleton-line--short"></div><div class="skeleton-line"></div></div>`).join('');
  }

  /* ---- Breadcrumbs y estados vacíos -------------------------------------- */
  function breadcrumbs(items) {
    return `<nav class="crumbs" aria-label="Ruta de navegación"><ol>
      ${items.map((it, i) => (i === items.length - 1
        ? `<li><span aria-current="page">${esc(it.label)}</span></li>`
        : `<li><a href="${it.href}">${esc(it.label)}</a></li>`)).join('')}
    </ol></nav>`;
  }

  function emptyState({ title, text, actions = [], heading = 'h2' }) {
    return `<div class="empty-state">
      ${dialMark()}
      <${heading}>${esc(title)}</${heading}>
      ${text ? `<p>${esc(text)}</p>` : ''}
      ${actions.length ? `<div class="empty-state__actions">${actions.map((a, i) => (a.button
        ? `<button type="button" class="btn-et ${i === 0 ? 'btn-et--primary' : 'btn-et--secondary'}" ${a.attrs || ''}>${esc(a.label)}</button>`
        : `<a class="btn-et ${i === 0 ? 'btn-et--primary' : 'btn-et--secondary'}" href="${a.href}">${esc(a.label)}</a>`)).join('')}</div>` : ''}
    </div>`;
  }

  /* ---- Navegación: estructura derivada de datos -------------------------- */
  /** Columnas del mega menú: solo enlaces con al menos un producto. */
  function megaColumns(cat) {
    const list = cat === 'regalos' ? ET.catalog.giftScope() : catalog.inCategory(cat);
    const page = config.categories.find((c) => c.slug === cat).page;
    const col = (title, key, max = 6) => {
      const values = catalog.facetValues(key, list).slice(0, max);
      return values.length ? { title, links: values.map((v) => ({ label: v.label, href: `${page}?${key}=${v.value}` })) } : null;
    };
    const plan = {
      perfumes: [col('Para quién', 'genero'), col('Concentración', 'concentracion'), col('Momento de uso', 'momento')],
      lociones: [col('Tipo de producto', 'sub'), col('Para quién', 'genero'), col('Volumen', 'volumen', 4)],
      relojes:  [col('Para quién', 'genero'), col('Estilo', 'estilo'), col('Tipo de correa', 'correa')],
      regalos:  [col('Qué regalar', 'cat'), col('Ocasión', 'ocasion'),
        { title: 'Presupuesto', links: config.budgets.map((b) => ({ label: b.label, href: `regalos.html?presupuesto=${b.slug}` })) }],
    };
    return plan[cat].filter(Boolean);
  }

  function featureFor(cat) {
    const list = (cat === 'regalos' ? catalog.inCategory('regalos') : catalog.inCategory(cat)).filter((p) => catalog.isAvailable(p));
    return list.sort((a, b) => a.featured - b.featured)[0] || null;
  }

  function megaHTML(cat) {
    const c = config.categories.find((x) => x.slug === cat);
    const cols = megaColumns(cat);
    const f = featureFor(cat);
    return `<div class="mega" id="mega-${cat}" hidden>
      <div class="wrap mega__inner">
        ${cols.map((colm) => `<div class="mega__col"><h2>${esc(colm.title)}</h2><ul class="mega__list">
          ${colm.links.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('')}</ul></div>`).join('')}
        ${f ? `<a class="mega__feature" href="producto.html?p=${f.slug}">
          ${productImg(f.images[0], { sizes: '120px', alt: '' })}
          <span><strong>${esc(f.name)}</strong><p>${esc(f.brand)}, ${formatCOP(catalog.displayVariant(f).price)}</p></span></a>` : '<div></div>'}
        <p class="mega__all m-0"><a href="${c.page}">Ver todo en ${esc(c.label.toLowerCase())}</a></p>
      </div></div>`;
  }

  /* ---- Header ------------------------------------------------------------- */
  const NAV = [
    { label: 'Inicio', href: 'index.html' },
    { label: 'Perfumes', href: 'perfumes.html', mega: 'perfumes' },
    { label: 'Lociones', href: 'lociones.html', mega: 'lociones' },
    { label: 'Relojes', href: 'relojes.html', mega: 'relojes' },
    { label: 'Regalos', href: 'regalos.html', mega: 'regalos' },
    { label: 'Novedades', href: 'novedades.html' },
  ];

  function brandHTML(extra = '') {
    const l = config.brand.logoText;
    return `<a class="brand ${extra}" href="index.html" aria-label="${esc(config.brand.name)}, ir al inicio">
      <span>${esc(l.first)}</span><span class="brand__amp" aria-hidden="true">${esc(l.joiner)}</span><span>${esc(l.second)}</span></a>`;
  }

  function headerHTML() {
    const page = utils.currentPage();
    const current = (href) => (href === page ? 'aria-current="page"' : '');
    const tb = config.topbar;
    return `
    ${tb.enabled ? `<div class="topbar"><div class="wrap topbar__inner">
      <p class="topbar__msg">${esc(tb.message)}${tb.link ? `<a href="${tb.link.href}">${esc(tb.link.label)}</a>` : ''}</p>
      ${config.demo.enabled ? '<p class="topbar__demo">Tienda de demostración: no se procesan pagos</p>' : ''}
    </div></div>` : ''}
    <header class="site-header" id="site-header">
      <div class="wrap site-header__inner">
        <button type="button" class="icon-btn site-header__menu-btn" data-bs-toggle="offcanvas" data-bs-target="#mobile-nav" aria-controls="mobile-nav" aria-label="Abrir menú">
          <i class="bi bi-list" aria-hidden="true"></i></button>
        ${brandHTML()}
        <nav class="main-nav" aria-label="Principal">
          <ul class="main-nav__list">
            ${NAV.map((n) => `<li class="main-nav__item ${n.mega ? 'has-mega' : ''}" ${n.mega ? `data-mega="${n.mega}"` : ''}>
              <a class="main-nav__link" href="${n.href}" ${current(n.href)}>${n.label}</a>
              ${n.mega ? `<button type="button" class="main-nav__toggle" aria-expanded="false" aria-controls="mega-${n.mega}">
                <span class="visually-hidden">Mostrar secciones de ${n.label}</span><i class="bi bi-chevron-down" aria-hidden="true"></i></button>
                ${megaHTML(n.mega)}` : ''}
            </li>`).join('')}
          </ul>
        </nav>
        <div class="header-actions">
          <button type="button" class="icon-btn" data-search-toggle aria-expanded="false" aria-controls="search-panel" aria-label="Buscar productos">
            <i class="bi bi-search" aria-hidden="true"></i></button>
          <a class="icon-btn header-actions__fav" href="favoritos.html" aria-label="Favoritos" data-fav-link>
            <i class="bi bi-heart" aria-hidden="true"></i><span class="count-badge" data-fav-count data-count="0">0</span></a>
          <a class="icon-btn icon-btn--wide" href="carrito.html" data-cart-open aria-label="Carrito">
            <i class="bi bi-bag" aria-hidden="true"></i><span class="count-badge" data-cart-count data-count="0">0</span>
            <span class="header-actions__cart-total" data-cart-subtotal></span></a>
        </div>
      </div>
      <div class="search-panel" id="search-panel" hidden>
        <div class="wrap search-panel__inner">
          ${searchFormHTML('header')}
          <p class="search-panel__hint">Busca por nombre, marca, notas olfativas o material. Pulsa Escape para cerrar.</p>
        </div>
      </div>
    </header>
    ${mobileNavHTML()}`;
  }

  function mobileNavHTML() {
    const page = utils.currentPage();
    return `<div class="offcanvas offcanvas-start mobile-nav" tabindex="-1" id="mobile-nav" aria-labelledby="mobile-nav-title">
      <div class="offcanvas-header">
        <h2 class="visually-hidden" id="mobile-nav-title">Menú</h2>
        ${brandHTML()}
        <button type="button" class="icon-btn" data-bs-dismiss="offcanvas" aria-label="Cerrar menú"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
      </div>
      <div class="offcanvas-body">
        <ul class="mobile-nav__list">
          ${NAV.map((n) => (n.mega ? `<li>
            <button type="button" class="mobile-nav__toggle" data-bs-toggle="collapse" data-bs-target="#mnav-${n.mega}" aria-expanded="false" aria-controls="mnav-${n.mega}">
              ${n.label}<i class="bi bi-chevron-down" aria-hidden="true"></i></button>
            <div class="collapse" id="mnav-${n.mega}"><ul class="mobile-nav__sub">
              <li><a href="${n.href}" ${n.href === page ? 'aria-current="page"' : ''}>Ver todo en ${n.label.toLowerCase()}</a></li>
              ${((megaColumns(n.mega)[0]) || { links: [] }).links.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('')}
            </ul></div></li>`
            : `<li><a class="mobile-nav__link" href="${n.href}" ${n.href === page ? 'aria-current="page"' : ''}>${n.label}</a></li>`)).join('')}
        </ul>
        <div class="mobile-nav__utility">
          <a href="favoritos.html"><i class="bi bi-heart" aria-hidden="true"></i>Favoritos</a>
          <a href="carrito.html"><i class="bi bi-bag" aria-hidden="true"></i>Carrito</a>
          <a href="contacto.html"><i class="bi bi-chat" aria-hidden="true"></i>Contacto</a>
          <a href="faq.html"><i class="bi bi-question-circle" aria-hidden="true"></i>Preguntas frecuentes</a>
        </div>
      </div>
    </div>`;
  }

  /* ---- Buscador (combobox reutilizable) ------------------------------------ */
  function searchFormHTML(id, value = '') {
    return `<form class="search-panel__form" action="busqueda.html" method="get" role="search" data-search-form>
      <label class="visually-hidden" for="q-${id}">Buscar en la tienda</label>
      <div class="input-group-et">
        <input class="input-et" id="q-${id}" name="q" type="search" autocomplete="off" spellcheck="false"
          placeholder="Perfume, reloj, marca o nota" value="${esc(value)}"
          role="combobox" aria-expanded="false" aria-autocomplete="list" aria-controls="q-${id}-list" maxlength="80">
        <button class="btn-et btn-et--primary" type="submit">Buscar</button>
      </div>
      <ul class="suggest" id="q-${id}-list" role="listbox" aria-label="Sugerencias" hidden></ul>
      <p class="visually-hidden" aria-live="polite" data-suggest-status></p>
    </form>`;
  }

  function mountSearch(form) {
    if (!form || form.dataset.ready) return;
    form.dataset.ready = '1';
    const input = $('input[name="q"]', form);
    const list = $('.suggest', form);
    const status = $('[data-suggest-status]', form);
    let items = [];
    let active = -1;

    const close = () => {
      list.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      active = -1;
    };
    const setActive = (i) => {
      const opts = $$('[role="option"]', list);
      opts.forEach((o) => o.setAttribute('aria-selected', 'false'));
      active = i;
      if (i >= 0 && opts[i]) {
        opts[i].setAttribute('aria-selected', 'true');
        input.setAttribute('aria-activedescendant', opts[i].id);
        opts[i].scrollIntoView({ block: 'nearest' });
      } else input.removeAttribute('aria-activedescendant');
    };
    const render = () => {
      const q = input.value.trim();
      if (q.length < 2) { close(); status.textContent = ''; return; }
      const results = catalog.search(q);
      items = results.slice(0, 6).map((p) => ({ href: `producto.html?p=${p.slug}`, p }));
      items.push({ href: `busqueda.html?q=${encodeURIComponent(q)}`, all: true });
      list.innerHTML = items.map((it, i) => (it.all
        ? `<li role="option" id="${list.id}-${i}" class="suggest__all" aria-selected="false" data-href="${it.href}">
            ${results.length ? `Ver los ${results.length} resultados para «${esc(q)}»` : `Buscar «${esc(q)}» en toda la tienda`}</li>`
        : `<li role="option" id="${list.id}-${i}" aria-selected="false" data-href="${it.href}">
            ${productImg(it.p.images[0], { sizes: '44px', alt: '' })}
            <span><span class="suggest__name">${esc(it.p.name)}</span><span class="suggest__meta">${esc(it.p.brand)}, ${formatCOP(catalog.displayVariant(it.p).price)}</span></span>
          </li>`)).join('');
      list.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      active = -1;
      status.textContent = results.length
        ? `${utils.plural(results.length, 'resultado', 'resultados')}. Usa las flechas para recorrerlos.`
        : 'Sin coincidencias. Pulsa Intro para buscar en toda la tienda.';
    };

    input.addEventListener('input', utils.debounce(render, 120));
    input.addEventListener('keydown', (e) => {
      const n = list.hidden ? 0 : items.length;
      if (e.key === 'ArrowDown' && n) { e.preventDefault(); setActive((active + 1) % n); }
      else if (e.key === 'ArrowUp' && n) { e.preventDefault(); setActive(active <= 0 ? n - 1 : active - 1); }
      else if (e.key === 'Enter' && active >= 0 && items[active]) { e.preventDefault(); window.location.href = items[active].href; }
      else if (e.key === 'Escape' && !list.hidden) { e.preventDefault(); e.stopPropagation(); close(); }
    });
    list.addEventListener('mousedown', (e) => e.preventDefault()); // conserva el foco en el campo
    list.addEventListener('click', (e) => {
      const opt = e.target.closest('[role="option"]');
      if (opt) window.location.href = opt.dataset.href;
    });
    input.addEventListener('blur', () => setTimeout(close, 120));
    form.addEventListener('submit', (e) => {
      if (!input.value.trim()) { e.preventDefault(); input.focus(); }
    });
  }

  /* ---- Footer ------------------------------------------------------------- */
  function footerHTML() {
    const c = config.contact;
    const contactItems = [
      c.email ? `<li><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>` : '',
      c.phone ? `<li><a href="tel:${esc(c.phone)}">${esc(c.phone)}</a></li>` : '',
      c.whatsapp ? `<li><a href="https://wa.me/${esc(c.whatsapp.replace(/\D/g, ''))}" rel="noopener" target="_blank">WhatsApp</a></li>` : '',
    ].join('');
    const year = new Date().getFullYear();
    return `<footer class="site-footer">
      <div class="dial-track" aria-hidden="true"></div>
      <div class="wrap site-footer__top">
        <div class="row row-et gy-5">
          <div class="col-12 col-lg-4 site-footer__brand">
            ${brandHTML('brand--lg')}
            <p>${esc(config.brand.description)}</p>
            ${config.social.length ? `<div class="site-footer__social">${config.social.map((s) => `<a class="icon-btn icon-btn--surface" href="${esc(s.url)}" rel="noopener" target="_blank" aria-label="${esc(s.label)}"><i class="bi ${esc(s.icon)}" aria-hidden="true"></i></a>`).join('')}</div>` : ''}
          </div>
          <div class="col-6 col-md-3 col-lg-2">
            <h2>Tienda</h2>
            <ul class="footer-links">
              ${config.categories.map((cat) => `<li><a href="${cat.page}">${esc(cat.label)}</a></li>`).join('')}
              <li><a href="novedades.html">Novedades</a></li>
            </ul>
          </div>
          <div class="col-6 col-md-3 col-lg-2">
            <h2>Atención al cliente</h2>
            <ul class="footer-links">
              <li><a href="contacto.html">Contacto</a></li>
              <li><a href="faq.html">Preguntas frecuentes</a></li>
              <li><a href="envios-devoluciones.html">Envíos y devoluciones</a></li>
              ${contactItems}
            </ul>
          </div>
          <div class="col-6 col-md-3 col-lg-1">
            <h2>Tu cuenta</h2>
            <ul class="footer-links">
              <li><a href="favoritos.html">Favoritos</a></li>
              <li><a href="carrito.html">Carrito</a></li>
              <li><a href="nosotros.html">Nosotros</a></li>
            </ul>
          </div>
          ${document.body.dataset.footerNews === 'off' ? '' : `<div class="col-12 col-md-9 col-lg-3">
            <h2 id="footer-news-title">Novedades por correo</h2>
            ${newsletterHTML('footer')}
          </div>`}
        </div>
      </div>
      <div class="wrap">
        <div class="site-footer__bottom">
          <p>© ${year} ${esc(config.brand.name)}. ${config.demo.enabled ? esc(config.demo.notice) : ''}</p>
          <p><a href="privacidad.html">Política de privacidad</a> <span aria-hidden="true">&nbsp;/&nbsp;</span> <a href="terminos.html">Términos y condiciones</a></p>
        </div>
      </div>
    </footer>`;
  }

  /* ---- Newsletter (demostración: no guarda ni envía el correo) ----------- */
  function newsletterHTML(id) {
    return `<form class="newsletter__form" data-newsletter novalidate>
      <div class="field mb-0" data-field>
        <label class="field__label" for="nl-email-${id}">Correo electrónico</label>
        <div class="input-group-et">
          <input class="input-et" id="nl-email-${id}" name="email" type="email" autocomplete="email" required
            aria-describedby="nl-email-${id}-error">
          <button class="btn-et btn-et--primary" type="submit">Suscribirme</button>
        </div>
        <p class="field__error" id="nl-email-${id}-error"></p>
      </div>
      <div class="field mb-0" data-field>
        <label class="check-et"><input type="checkbox" name="consent" required aria-describedby="nl-consent-${id}-error">
          <span>Acepto recibir novedades y la <a href="privacidad.html">política de privacidad</a>.</span></label>
        <p class="field__error" id="nl-consent-${id}-error"></p>
      </div>
      <p class="newsletter__status" role="status" aria-live="polite"></p>
    </form>`;
  }

  function mountNewsletter(form) {
    if (!form || form.dataset.ready) return;
    form.dataset.ready = '1';
    ET.validation.attach(form, {
      fields: {
        email: ['required', 'email'],
        consent: ['checked'],
      },
      messages: { consent: { checked: 'Marca la casilla para aceptar el envío de novedades.' } },
      onValid() {
        $('.newsletter__status', form).innerHTML = '<span class="text-success-et">Suscripción de demostración completada. Esta versión no guarda ni envía tu correo.</span>';
        form.reset();
      },
    });
  }

  /* ---- Toasts ------------------------------------------------------------- */
  function toastStack() {
    let el = $('.toast-stack');
    if (!el) {
      el = utils.html('<div class="toast-stack" role="status" aria-live="polite" aria-atomic="false"></div>');
      document.body.appendChild(el);
    }
    return el;
  }

  function toast({ title, text = '', image = null, action = null, secondary = null, tone = '', duration = 5200 }) {
    const el = utils.html(`<div class="toast-et ${tone ? `toast-et--${tone}` : ''}">
      ${image ? productImg(image, { cls: 'toast-et__img', sizes: '44px', alt: '' }) : ''}
      <div class="toast-et__body"><strong>${esc(title)}</strong>${text ? `<span>${esc(text)}</span>` : ''}
        ${action || secondary ? `<div class="toast-et__actions">${action ? `<a href="${action.href}">${esc(action.label)}</a>` : ''}${secondary ? `<button type="button" class="toast-et__link" data-toast-dismiss>${esc(secondary)}</button>` : ''}</div>` : ''}</div>
      <button type="button" class="icon-btn icon-btn--sm" aria-label="Cerrar aviso"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    </div>`);
    const stack = toastStack();
    stack.appendChild(el);
    while (stack.children.length > 3) stack.firstElementChild.remove();
    ET.anim.toastIn(el);

    let timer;
    const dismiss = () => { clearTimeout(timer); ET.anim.toastOut(el, () => el.remove()); };
    const arm = () => { timer = setTimeout(dismiss, duration); };
    $$('.icon-btn, [data-toast-dismiss]', el).forEach((b) => b.addEventListener('click', dismiss));
    el.addEventListener('mouseenter', () => clearTimeout(timer));
    el.addEventListener('mouseleave', arm);
    el.addEventListener('focusin', () => clearTimeout(timer));
    el.addEventListener('focusout', arm);
    arm();
    return el;
  }

  /* ---- Minicarrito -------------------------------------------------------- */
  function miniCartShell() {
    return `<div class="offcanvas offcanvas-end mini-cart" tabindex="-1" id="mini-cart" aria-labelledby="mini-cart-title">
      <div class="offcanvas-header">
        <h2 class="offcanvas-title" id="mini-cart-title">Tu carrito</h2>
        <button type="button" class="icon-btn" data-bs-dismiss="offcanvas" aria-label="Cerrar carrito"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
      </div>
      <div class="offcanvas-body" data-mini-body></div>
      <div class="mini-cart__foot" data-mini-foot></div>
    </div>`;
  }

  function renderMiniCart() {
    const body = $('[data-mini-body]');
    const foot = $('[data-mini-foot]');
    if (!body) return;
    const t = cart.totals();
    if (!t.lines.length) {
      body.innerHTML = emptyState({
        title: 'Tu carrito está vacío',
        text: 'Explora la colección y añade tu próxima fragancia o reloj.',
        actions: [{ label: 'Ver perfumes', href: 'perfumes.html' }, { label: 'Ver relojes', href: 'relojes.html' }],
        heading: 'h3',
      });
      foot.hidden = true;
      return;
    }
    foot.hidden = false;
    body.innerHTML = t.lines.map((l) => `<div class="line ${l.issue ? 'line--issue' : ''}">
      ${productImg(l.product.images[0], { cls: 'line__img', sizes: '76px', alt: '' })}
      <div class="line__body">
        <p class="line__brand">${esc(l.product.brand)}</p>
        <h3 class="line__name"><a href="producto.html?p=${l.product.slug}">${esc(l.product.name)}</a></h3>
        <p class="line__variant">${catalog.hasChoice(l.product) ? `${esc(l.variant.label)}, ` : ''}cantidad ${l.qty}</p>
        <div class="line__controls">
          <span class="price m-0">${l.issue === 'unavailable' ? '<span class="stock stock--out">Agotado</span>' : formatCOP(l.lineTotal)}</span>
          <button type="button" class="btn-et btn-et--text line__remove" data-remove="${l.pid}" data-vid="${l.vid}">Eliminar<span class="visually-hidden"> ${esc(l.product.name)}</span></button>
        </div>
      </div></div>`).join('');
    foot.innerHTML = `
      <div class="mini-cart__row"><span>Subtotal (${utils.plural(t.count, 'producto', 'productos')})</span><span class="num">${formatCOP(t.subtotal)}</span></div>
      ${t.discount ? `<div class="mini-cart__row"><span>Descuento ${esc(t.coupon.code)}</span><span class="num">−${formatCOP(t.discount)}</span></div>` : ''}
      <p class="mini-cart__note">El envío se calcula en el checkout según el departamento de entrega.</p>
      <div class="mini-cart__actions">
        <a class="btn-et btn-et--primary btn-et--block" href="checkout.html">Ir al checkout</a>
        <a class="btn-et btn-et--secondary btn-et--block" href="carrito.html">Ver carrito</a>
      </div>`;
  }

  /* ---- Selector rápido de variante (modal) ------------------------------- */
  let quickModal = null;
  function openQuickPick(pid, opener) {
    const p = catalog.byId(pid);
    if (!p) return;
    let el = $('#quick-pick');
    if (!el) {
      el = utils.html(`<div class="modal fade modal-et" id="quick-pick" tabindex="-1" aria-labelledby="quick-pick-title" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered"><div class="modal-content">
          <div class="modal-header"><h2 class="modal-title" id="quick-pick-title">Elige una opción</h2>
            <button type="button" class="icon-btn" data-bs-dismiss="modal" aria-label="Cerrar"><i class="bi bi-x-lg" aria-hidden="true"></i></button></div>
          <div class="modal-body" data-quick-body></div>
        </div></div></div>`);
      document.body.appendChild(el);
      quickModal = new bootstrap.Modal(el);
      el.addEventListener('hidden.bs.modal', () => { if (el._opener) el._opener.focus(); });
    }
    el._opener = opener;
    const def = catalog.defaultVariant(p);
    $('[data-quick-body]', el).innerHTML = `
      <div class="quick-pick">${productImg(p.images[0], { sizes: '96px', alt: '' })}
        <div><p class="quick-pick__brand">${esc(p.brand)}</p><p class="quick-pick__name h-display">${esc(p.name)}</p>
          <a href="producto.html?p=${p.slug}">Ver ficha completa</a></div></div>
      <form data-quick-form>
        <fieldset class="variant-group mb-4"><legend>${esc(variantNoun(p).charAt(0).toUpperCase() + variantNoun(p).slice(1))}</legend>
          ${p.variants.map((v) => `<label class="variant-chip"><input type="radio" name="vid" value="${v.id}" ${v.id === def.id ? 'checked' : ''} ${v.stock <= 0 ? 'disabled' : ''}>
            <span>${esc(v.label)}<small>${v.stock <= 0 ? 'Agotado' : formatCOP(v.price)}</small></span></label>`).join('')}
        </fieldset>
        <button type="submit" class="btn-et btn-et--primary btn-et--block">Añadir al carrito</button>
      </form>`;
    $('[data-quick-form]', el).addEventListener('submit', (e) => {
      e.preventDefault();
      const vid = new FormData(e.target).get('vid');
      quickModal.hide();
      addToCart(pid, vid, 1, opener);
    }, { once: true });
    quickModal.show();
  }

  /* ---- Acciones de compra y favoritos ------------------------------------ */
  function addToCart(pid, vid, qty = 1, button = null) {
    const res = cart.add(pid, vid, qty);
    if (!res.ok) {
      toast({ title: 'No se pudo añadir', text: res.error, tone: 'error' });
      return res;
    }
    const label = catalog.hasChoice(res.product) ? `${res.product.name}, ${res.variant.label}` : res.product.name;
    toast({
      title: 'Añadido al carrito',
      text: res.warning || label,
      image: res.product.images[0],
      action: { label: 'Ver carrito', href: 'carrito.html' },
      secondary: 'Seguir comprando',
      duration: 6500,
    });
    if (button) ET.anim.confirmButton(button);
    return res;
  }

  function updateFavButtons(id) {
    $$(`[data-fav="${id}"]`).forEach((btn) => {
      const p = catalog.byId(id);
      const saved = wishlist.has(id);
      btn.setAttribute('aria-pressed', String(saved));
      btn.setAttribute('aria-label', `${saved ? 'Quitar' : 'Guardar'} ${p.name} ${saved ? 'de' : 'en'} favoritos`);
      const icon = $('i', btn);
      if (icon) icon.className = `bi ${saved ? 'bi-heart-fill' : 'bi-heart'}`;
      const text = $('[data-fav-text]', btn);
      if (text) text.textContent = saved ? 'Guardado en favoritos' : 'Guardar en favoritos';
    });
  }

  function updateCounters(bump = false) {
    const n = cart.count();
    $$('[data-cart-count]').forEach((b) => {
      b.textContent = n; b.dataset.count = n;
      if (bump) { b.classList.remove('is-bumped'); void b.offsetWidth; b.classList.add('is-bumped'); }
    });
    $$('[data-cart-subtotal]').forEach((s) => { s.textContent = n ? formatCOP(cart.totals().subtotal) : ''; });
    $$('[data-cart-open]').forEach((a) => a.setAttribute('aria-label', n ? `Carrito: ${utils.plural(n, 'producto', 'productos')}, subtotal ${formatCOP(cart.totals().subtotal)}` : 'Carrito vacío'));
    const f = wishlist.count();
    $$('[data-fav-count]').forEach((b) => { b.textContent = f; b.dataset.count = f; });
    $$('[data-fav-link]').forEach((a) => a.setAttribute('aria-label', f ? `Favoritos: ${f} guardados` : 'Favoritos'));
  }

  /* ---- Comportamiento del header ----------------------------------------- */
  function bindHeader() {
    const header = $('#site-header');
    if (!header) return;
    const items = $$('.has-mega', header);
    const searchPanel = $('#search-panel');
    const searchBtn = $('[data-search-toggle]', header);
    let hoverTimer;
    // El hover solo abre el mega menú tras un movimiento real del puntero: si el
    // cursor ya estaba sobre la navegación al cargar, no se abre solo.
    let pointerMoved = false;
    document.addEventListener('pointermove', () => { pointerMoved = true; }, { once: true, passive: true });

    const closeMega = (except) => items.forEach((it) => {
      if (it === except) return;
      it.classList.remove('is-open');
      const b = $('.main-nav__toggle', it);
      b.setAttribute('aria-expanded', 'false');
      $('.mega', it).hidden = true;
    });
    const openMega = (it) => {
      closeSearch();
      closeMega(it);
      it.classList.add('is-open');
      $('.main-nav__toggle', it).setAttribute('aria-expanded', 'true');
      $('.mega', it).hidden = false;
    };

    items.forEach((it) => {
      const btn = $('.main-nav__toggle', it);
      btn.addEventListener('click', () => (btn.getAttribute('aria-expanded') === 'true' ? closeMega() : openMega(it)));
      // Apertura por hover solo con puntero fino, con pequeña intención para no parpadear
      it.addEventListener('pointerenter', (e) => {
        if (e.pointerType !== 'mouse' || !pointerMoved) return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => openMega(it), 140);
      });
      it.addEventListener('pointerleave', (e) => {
        if (e.pointerType !== 'mouse') return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => closeMega(), 220);
      });
      it.addEventListener('focusout', (e) => { if (!it.contains(e.relatedTarget)) closeMega(); });
    });

    function openSearch() {
      closeMega();
      searchPanel.hidden = false;
      searchBtn.setAttribute('aria-expanded', 'true');
      $('input', searchPanel).focus();
    }
    function closeSearch(returnFocus = false) {
      if (searchPanel.hidden) return;
      searchPanel.hidden = true;
      searchBtn.setAttribute('aria-expanded', 'false');
      if (returnFocus) searchBtn.focus();
    }
    searchBtn.addEventListener('click', () => (searchPanel.hidden ? openSearch() : closeSearch()));
    mountSearch($('[data-search-form]', searchPanel));

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const openItem = items.find((it) => it.classList.contains('is-open'));
      if (openItem) { closeMega(); $('.main-nav__toggle', openItem).focus(); }
      else if (!searchPanel.hidden) closeSearch(true);
    });
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) { closeMega(); closeSearch(); }
    });

    // Sombra discreta al hacer scroll (sin listeners costosos)
    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    header.before(sentinel);
    new IntersectionObserver(([en]) => header.classList.toggle('is-scrolled', !en.isIntersecting)).observe(sentinel);
  }

  /* ---- Delegación global de eventos (una sola vez) ----------------------- */
  function bindGlobal() {
    document.addEventListener('click', (e) => {
      const fav = e.target.closest('[data-fav]');
      if (fav) {
        e.preventDefault();
        const id = fav.dataset.fav;
        const saved = wishlist.toggle(id);
        const p = catalog.byId(id);
        toast({
          title: saved ? 'Guardado en favoritos' : 'Quitado de favoritos',
          text: p.name,
          action: saved ? { label: 'Ver favoritos', href: 'favoritos.html' } : null,
          duration: 3200,
        });
        return;
      }
      const add = e.target.closest('[data-add]');
      if (add) { e.preventDefault(); addToCart(add.dataset.add, add.dataset.vid, 1, add); return; }
      const quick = e.target.closest('[data-quick]');
      if (quick) { e.preventDefault(); openQuickPick(quick.dataset.quick, quick); return; }
      const rm = e.target.closest('[data-mini-body] [data-remove]');
      if (rm) {
        const p = catalog.byId(rm.dataset.remove);
        cart.remove(rm.dataset.remove, rm.dataset.vid);
        toast({ title: 'Producto eliminado', text: p ? p.name : '', duration: 3200 });
        const target = $('#mini-cart .btn-et') || $('#mini-cart [data-bs-dismiss]');
        if (target) target.focus();
        return;
      }
      const cartOpen = e.target.closest('[data-cart-open]');
      if (cartOpen && !e.metaKey && !e.ctrlKey && utils.currentPage() !== 'carrito.html') {
        e.preventDefault();
        bootstrap.Offcanvas.getOrCreateInstance('#mini-cart').show();
      }
    });

    document.addEventListener('et:cart-change', (e) => {
      updateCounters(e.detail && e.detail.reason === 'add');
      renderMiniCart();
    });
    document.addEventListener('et:wishlist-change', (e) => {
      updateCounters();
      if (e.detail && e.detail.id) updateFavButtons(e.detail.id);
      else catalog.all().forEach((p) => updateFavButtons(p.id));
    });
  }

  /* ---- Acordeón accesible -------------------------------------------------
     <div class="accordion-et" data-accordion>
       <div class="accordion-et__item"><h3><button class="accordion-et__btn" aria-expanded="false" aria-controls="x">…</button></h3>
       <div class="accordion-et__panel" id="x" role="region" aria-labelledby="…" hidden>…</div></div>     */
  function setAccordion(btn, open) {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', String(open));
    if (panel) panel.hidden = !open;
  }
  function mountAccordions(scope = document) {
    $$('[data-accordion]', scope).forEach((acc) => {
      if (acc.dataset.ready) return;
      acc.dataset.ready = '1';
      acc.addEventListener('click', (e) => {
        const btn = e.target.closest('.accordion-et__btn');
        if (!btn || !acc.contains(btn)) return;
        setAccordion(btn, btn.getAttribute('aria-expanded') !== 'true');
      });
    });
  }

  /* ---- Montaje ------------------------------------------------------------- */
  function mount() {
    if (ET.ui._mounted) return;
    ET.ui._mounted = true;

    const slot = $('[data-et="header"]');
    if (slot) {
      slot.innerHTML = headerHTML();
      slot.classList.add('header-slot--ready');
      bindHeader();
    }
    const fslot = $('[data-et="footer"]');
    if (fslot) fslot.outerHTML = footerHTML();

    document.body.insertAdjacentHTML('beforeend', miniCartShell());
    const mini = $('#mini-cart');
    mini.addEventListener('show.bs.offcanvas', () => { renderMiniCart(); ET.anim.miniCartIn(mini); });

    if (config.seo.siteUrl && !$('link[rel="canonical"]')) {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = `${config.seo.siteUrl.replace(/\/$/, '')}/${utils.currentPage()}${window.location.search}`;
      document.head.appendChild(link);
    }
    mountAccordions();
    $$('[data-newsletter]').forEach(mountNewsletter);
    $$('[data-search-form]').forEach(mountSearch);
    bindGlobal();
    updateCounters();
    renderMiniCart();
  }

  ET.ui = {
    mount, productCard, skeletonCards, priceHTML, stockHTML, productImg, breadcrumbs, emptyState,
    dialMark, toast, addToCart, openQuickPick, searchFormHTML, mountSearch, newsletterHTML, mountNewsletter,
    updateCounters, mountAccordions, setAccordion,
  };
})(window.ET);
