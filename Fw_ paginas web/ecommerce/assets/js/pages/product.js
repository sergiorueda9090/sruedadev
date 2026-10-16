/* ==========================================================================
   ESSENCE & TIME — Ficha de producto (producto.html?p=<slug>)
   Funciona para perfumes, lociones, relojes y regalos con datos del catálogo.
   Solo muestra los campos que existen: nunca rellena especificaciones.
   ========================================================================== */
(function (ET) {
  'use strict';

  ET.pages = ET.pages || {};
  ET.pages.product = {
    init() {
      const { config, catalog, cart, wishlist, ui, utils } = ET;
      const { $, $$, esc, formatCOP } = utils;
      const root = $('[data-pdp]');
      const params = utils.params();
      const key = (params.get('p') || params.get('id') || '').trim();
      const product = catalog.bySlug(key) || catalog.byId(key);

      /* ---- Producto inexistente ------------------------------------------ */
      if (!product) {
        document.title = 'Producto no encontrado | Essence & Time';
        const robots = document.createElement('meta');
        robots.name = 'robots'; robots.content = 'noindex';
        document.head.appendChild(robots);
        root.innerHTML = `<div class="page-head">${ui.breadcrumbs([{ label: 'Inicio', href: 'index.html' }, { label: 'Producto no encontrado' }])}</div>
          ${ui.emptyState({
            heading: 'h1',
            title: 'No encontramos este producto',
            text: 'Puede que el enlace esté incompleto o que el producto ya no forme parte del catálogo.',
            actions: [{ label: 'Ver perfumes', href: 'perfumes.html' }, { label: 'Ver lociones', href: 'lociones.html' }, { label: 'Ver relojes', href: 'relojes.html' }],
          })}`;
        return;
      }

      const cat = config.categories.find((c) => c.slug === product.category);
      const isWatch = product.category === 'relojes';
      const isSet = Array.isArray(product.contents);
      const choice = catalog.hasChoice(product);
      let variant = catalog.defaultVariant(product);
      const fromUrl = catalog.variant(product, params.get('v') || '');
      if (fromUrl) variant = fromUrl;

      document.title = `${product.name}, ${product.brand} | Essence & Time`;
      const metaDesc = $('meta[name="description"]');
      if (metaDesc) metaDesc.content = `${product.short} ${catalog.metaLine(product)}. Precio en pesos colombianos.`.slice(0, 158);
      $$('meta[property="og:title"]').forEach((m) => { m.content = document.title; });

      /* ---- Especificaciones disponibles ------------------------------------ */
      const specRows = [];
      const add = (label, value) => { if (value) specRows.push([label, value]); };
      if (product.category === 'perfumes' || product.category === 'lociones') {
        add('Tipo de producto', product.productType || catalog.subcategoryLabel(product.category, product.subcategory));
        add('Concentración', product.concentration);
        add('Familia olfativa', product.family && product.accord && product.accord !== product.family ? `${product.family} (${product.accord.toLowerCase()})` : product.family);
        add('Volumen', product.variants.map((x) => x.volumeMl).filter(Boolean).map((ml) => `${ml} ml`).join(', '));
        add('Género comercial', catalog.genderLabel(product.gender));
        add('Marca', product.brand);
      }
      if (isWatch) {
        const w = product.watch;
        add('Material de caja', w.caseMaterial);
        add('Material de correa', w.strapMaterial && `${w.strapMaterial} (${w.strapType.toLowerCase()})`);
        add('Diámetro de caja', w.diameterMm && `${w.diameterMm} mm`);
        add('Mecanismo', w.movement);
        add('Color de esfera', w.dialColor);
        add('Resistencia al agua', w.waterResistance);
        add('Estilo', w.style);
        add('Género comercial', catalog.genderLabel(product.gender));
        add('Garantía comercial', config.policies.watchWarranty);
      }
      if (product.category === 'regalos') {
        add('Tipo', catalog.subcategoryLabel('regalos', product.subcategory));
        add('Marca', product.brand);
        add('Género comercial', catalog.genderLabel(product.gender));
      }
      (product.features || []).forEach((f) => { if (!/conceptual/i.test(f)) specRows.push(['Característica', f]); });

      const accItems = [
        { id: 'desc', title: 'Descripción', open: true, html: `<p>${esc(product.description)}</p>` },
        specRows.length && { id: 'specs', title: 'Características', html: `<dl class="spec-list">${specRows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` },
        isSet && { id: 'contents', title: 'Contenido del set', html: `<ul>${product.contents.map((c) => `<li>${esc(c)}</li>`).join('')}</ul><p class="text-xs">Set conceptual de demostración.</p>` },
        product.usage && { id: 'usage', title: 'Modo de uso', html: `<p>${esc(product.usage)}</p><p class="text-xs">Indicación orientativa del catálogo de demostración. No constituye una recomendación médica o dermatológica.</p>` },
        { id: 'ship', title: 'Envíos y devoluciones', html: shippingHTML() },
      ].filter(Boolean);

      function shippingHTML() {
        const rates = config.shipping.zones.map((z) => z.rate);
        const min = Math.min(...rates); const max = Math.max(...rates);
        const free = config.shipping.freeShippingFrom;
        return `<p>Envío a todo Colombia con tarifa según el departamento: de ${formatCOP(min)} a ${formatCOP(max)} (tarifas de demostración).${free ? ` Gratis desde ${formatCOP(free)}.` : ''}</p>
          <p>${config.policies.returnsWindowDays ? `Tienes ${config.policies.returnsWindowDays} días para solicitar un cambio o devolución.` : 'Las condiciones de cambios y devoluciones están pendientes de aprobación.'}
          Consulta <a href="envios-devoluciones.html">envíos y devoluciones</a>.</p>`;
      }

      /* ---- Galería ---------------------------------------------------------- */
      const imgs = product.images;
      const many = imgs.length > 1;
      const galleryHTML = `
        <div class="gallery" data-gallery>
          <div class="gallery__desktop">
            ${many ? `<div class="gallery__thumbs" role="group" aria-label="Imágenes del producto">
              ${imgs.map((im, i) => `<button type="button" class="gallery__thumb" data-thumb="${i}" aria-pressed="${i === 0}" aria-label="Ver imagen ${i + 1} de ${imgs.length}">
                ${ui.productImg(im, { sizes: '88px', alt: '' })}</button>`).join('')}</div>` : ''}
            <button type="button" class="gallery__main" data-zoom aria-label="Ampliar imagen: ${esc(imgs[0].alt)}">
              ${ui.productImg(imgs[0], { cls: 'gallery__img', eager: true, sizes: '(min-width: 992px) 50vw, 100vw' })}
              <span class="gallery__zoom-hint" aria-hidden="true"><i class="bi bi-arrows-angle-expand"></i></span>
            </button>
          </div>
          <div class="gallery__mobile" ${many ? 'data-carousel-gallery' : ''}>
            <div class="swiper"><div class="swiper-wrapper">
              ${imgs.map((im, i) => `<div class="swiper-slide"><button type="button" class="gallery__main" data-zoom="${i}" aria-label="Ampliar imagen ${i + 1}: ${esc(im.alt)}">
                ${ui.productImg(im, { cls: 'gallery__img', eager: i === 0, sizes: '100vw' })}</button></div>`).join('')}
            </div>${many ? '<div class="gallery__dots"></div>' : ''}</div>
          </div>
        </div>`;

      /* ---- Panel de compra ---------------------------------------------- */
      const variantName = product.variantLabel || (product.variants.some((x) => x.volumeMl) ? 'Tamaño' : 'Presentación');
      const panelHTML = `
        <div class="buy" data-buy>
          <p class="buy__brand m-0"><a href="busqueda.html?q=${encodeURIComponent(product.brand)}">${esc(product.brand)}</a></p>
          <h1 class="buy__name">${esc(product.name)}</h1>
          <p class="buy__short">${esc(product.short)}</p>
          <div class="buy__price" data-price aria-live="polite"></div>
          <p class="buy__meta"><span data-stock></span><span class="buy__sku">Referencia <span data-sku></span></span></p>
          <form class="buy__form" data-buy-form novalidate>
            ${choice ? `<fieldset class="variant-group buy__variants"><legend>${esc(variantName)}</legend>
              ${product.variants.map((x) => `<label class="variant-chip"><input type="radio" name="vid" value="${x.id}" ${x.id === variant.id ? 'checked' : ''}>
                <span>${esc(x.label)}<small>${x.stock <= 0 ? 'Agotado' : formatCOP(x.price)}</small></span></label>`).join('')}
            </fieldset>` : `<input type="hidden" name="vid" value="${variant.id}">`}
            <div class="buy__row">
              <div class="buy__qty">
                <label class="field__label" for="qty">Cantidad</label>
                <div class="qty" data-qty>
                  <button type="button" class="qty__btn" data-step="-1" aria-label="Quitar una unidad"><i class="bi bi-dash" aria-hidden="true"></i></button>
                  <input class="qty__input" id="qty" name="qty" type="number" inputmode="numeric" min="1" value="1" aria-describedby="qty-msg">
                  <button type="button" class="qty__btn" data-step="1" aria-label="Añadir una unidad"><i class="bi bi-plus" aria-hidden="true"></i></button>
                </div>
              </div>
              <button type="submit" class="btn-et btn-et--primary buy__add" data-add-btn>Añadir al carrito</button>
            </div>
            <p class="field__hint buy__msg" id="qty-msg" data-qty-msg aria-live="polite"></p>
          </form>
          <button type="button" class="btn-et btn-et--text buy__fav" data-fav="${product.id}" aria-pressed="${wishlist.has(product.id)}">
            <i class="bi ${wishlist.has(product.id) ? 'bi-heart-fill' : 'bi-heart'}" aria-hidden="true"></i>
            <span data-fav-text>${wishlist.has(product.id) ? 'Guardado en favoritos' : 'Guardar en favoritos'}</span></button>
          <p class="notice notice--demo buy__demo"><i class="bi bi-info-circle" aria-hidden="true"></i>
            <span>Producto conceptual de demostración. Precio e inventario simulados; no se procesan pagos.</span></p>
          <div class="accordion-et buy__acc" data-accordion>
            ${accItems.map((a) => `<div class="accordion-et__item">
              <h2 class="m-0"><button type="button" class="accordion-et__btn" id="acc-b-${a.id}" aria-expanded="${!!a.open}" aria-controls="acc-p-${a.id}">${esc(a.title)}</button></h2>
              <div class="accordion-et__panel" id="acc-p-${a.id}" role="region" aria-labelledby="acc-b-${a.id}" ${a.open ? '' : 'hidden'}>${a.html}</div></div>`).join('')}
          </div>
        </div>`;

      /* ---- Notas olfativas (bloque editorial) -------------------------- */
      const notesHTML = product.notes ? `
        <section class="notes section" aria-labelledby="notes-title">
          <div class="dial-track" aria-hidden="true"></div>
          <div class="notes__grid">
            <h2 class="notes__title" id="notes-title">Notas olfativas</h2>
            ${[['Salida', 'Lo primero que percibes', product.notes.top], ['Corazón', 'Aparece después de unos minutos', product.notes.heart], ['Fondo', 'Lo que permanece al final', product.notes.base]]
              .filter(([, , list]) => list && list.length)
              .map(([t, d, list]) => `<div class="notes__col"><h3>${t}</h3><p class="notes__hint">${d}</p><ul>${list.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></div>`).join('')}
          </div>
        </section>` : '';

      const related = catalog.related(product, 4);
      const crumbs = [{ label: 'Inicio', href: 'index.html' }];
      if (cat) crumbs.push({ label: cat.label, href: cat.page });
      if (cat && product.subcategory && product.category !== 'regalos') {
        crumbs.push({ label: catalog.subcategoryLabel(product.category, product.subcategory), href: `${cat.page}?${product.category === 'lociones' ? 'sub' : 'genero'}=${catalog.slugify(product.category === 'lociones' ? catalog.subcategoryLabel('lociones', product.subcategory) : catalog.genderLabel(product.gender))}` });
      }
      crumbs.push({ label: product.name });

      root.innerHTML = `
        <div class="page-head pdp__crumbs">${ui.breadcrumbs(crumbs)}</div>
        <div class="pdp__grid ${isWatch ? 'pdp__grid--watch' : ''}">
          <div class="pdp__gallery">${galleryHTML}</div>
          <div class="pdp__panel">${panelHTML}</div>
        </div>
        ${notesHTML}
        ${related.length ? `<section class="section related" aria-labelledby="rel-title">
          <div class="section-head"><h2 class="section-head__title" id="rel-title">También te puede interesar</h2>
            ${cat ? `<a class="btn-et btn-et--text" href="${cat.page}">Ver todo en ${esc(cat.label.toLowerCase())}</a>` : ''}</div>
          <div class="pgrid pgrid--4">${related.map((p) => ui.productCard(p)).join('')}</div></section>` : ''}`;
      ui.mountAccordions(root);

      /* ---- Estado de la variante ------------------------------------------ */
      const form = $('[data-buy-form]', root);
      const qtyInput = $('#qty', root);
      const msg = $('[data-qty-msg]', root);
      const addBtn = $('[data-add-btn]', root);
      const limit = () => Math.min(variant.stock, config.catalog.maxQtyPerLine);
      const inCart = () => (cart.lines().find((l) => l.pid === product.id && l.vid === variant.id) || { qty: 0 }).qty;

      const syncVariant = () => {
        $('[data-price]', root).innerHTML = ui.priceHTML(variant, { size: 'price--lg' });
        $('[data-stock]', root).innerHTML = ui.stockHTML(variant);
        $('[data-sku]', root).textContent = variant.sku;
        const max = limit();
        const remaining = Math.max(0, max - inCart());
        qtyInput.max = String(Math.max(1, remaining));
        qtyInput.value = String(Math.min(Math.max(1, Number(qtyInput.value) || 1), Math.max(1, remaining)));
        const out = variant.stock <= 0;
        addBtn.disabled = out || remaining === 0;
        addBtn.textContent = out ? 'Agotado' : remaining === 0 ? 'Máximo en el carrito' : 'Añadir al carrito';
        qtyInput.disabled = out || remaining === 0;
        $$('[data-step]', root).forEach((b) => { b.disabled = qtyInput.disabled; });
        msg.textContent = out ? 'Esta presentación está agotada. Elige otra o guárdala en favoritos.'
          : remaining === 0 ? `Ya tienes en el carrito las ${max} unidades disponibles.`
            : inCart() ? `Tienes ${inCart()} en el carrito. Puedes añadir hasta ${remaining} más.` : '';
        syncStepper();
      };
      const syncStepper = () => {
        const n = Number(qtyInput.value);
        $('[data-step="-1"]', root).disabled = qtyInput.disabled || n <= 1;
        $('[data-step="1"]', root).disabled = qtyInput.disabled || n >= Number(qtyInput.max);
      };

      form.addEventListener('change', (e) => {
        if (e.target.name !== 'vid') return;
        variant = catalog.variant(product, e.target.value) || variant;
        const u = new URL(window.location.href);
        u.searchParams.set('v', variant.id);
        history.replaceState(null, '', u);
        syncVariant();
      });
      $$('[data-step]', root).forEach((b) => b.addEventListener('click', () => {
        const next = utils.clampInt(Number(qtyInput.value) + Number(b.dataset.step), 1, Number(qtyInput.max), 1);
        qtyInput.value = String(next);
        syncStepper();
      }));
      qtyInput.addEventListener('change', () => {
        const max = Number(qtyInput.max);
        const n = Number.parseInt(qtyInput.value, 10);
        if (!Number.isFinite(n) || n < 1) { qtyInput.value = '1'; msg.textContent = 'La cantidad mínima es 1.'; }
        else if (n > max) { qtyInput.value = String(max); msg.textContent = `Puedes añadir hasta ${max} ${max === 1 ? 'unidad' : 'unidades'}.`; }
        syncStepper();
      });

      let busy = false;
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (busy || addBtn.disabled) return; // evita añadir dos veces con doble clic
        const n = Number.parseInt(qtyInput.value, 10);
        if (!Number.isFinite(n) || n < 1) { msg.textContent = 'Elige una cantidad válida.'; qtyInput.focus(); return; }
        if (!catalog.variant(product, variant.id)) { msg.textContent = `Elige ${variantName.toLowerCase()}.`; return; }
        busy = true;
        const res = ui.addToCart(product.id, variant.id, n, addBtn);
        setTimeout(() => { busy = false; syncVariant(); }, 1650);
        if (res.ok) qtyInput.value = '1';
      });
      document.addEventListener('et:cart-change', () => { if (!busy) syncVariant(); });

      syncVariant();

      /* ---- Galería: miniaturas, teclado, modal y carrusel móvil ---------- */
      const mainBtn = $('.gallery__desktop .gallery__main', root);
      let current = 0;
      const show = (i) => {
        current = (i + imgs.length) % imgs.length;
        const im = imgs[current];
        const img = $('.gallery__img', mainBtn);
        const swap = () => {
          img.outerHTML = ui.productImg(im, { cls: 'gallery__img', eager: true, sizes: '(min-width: 992px) 50vw, 100vw' });
          mainBtn.setAttribute('aria-label', `Ampliar imagen: ${im.alt}`);
        };
        if (ET.anim.enabled && window.gsap) {
          window.gsap.to(img, { opacity: 0, duration: .18, onComplete: () => { swap(); window.gsap.from($('.gallery__img', mainBtn), { opacity: 0, duration: .35 }); } });
        } else swap();
        $$('[data-thumb]', root).forEach((t) => t.setAttribute('aria-pressed', String(Number(t.dataset.thumb) === current)));
      };
      $$('[data-thumb]', root).forEach((t) => {
        t.addEventListener('click', () => show(Number(t.dataset.thumb)));
        t.addEventListener('keydown', (e) => {
          if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
          e.preventDefault();
          const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1;
          const next = (Number(t.dataset.thumb) + dir + imgs.length) % imgs.length;
          show(next);
          $(`[data-thumb="${next}"]`, root).focus();
        });
      });

      const zoomEl = $('#zoom-modal');
      const zoom = new bootstrap.Modal(zoomEl);
      let opener = null;
      const openZoom = (i, from) => {
        opener = from;
        const im = imgs[i];
        $('#zoom-title').textContent = `${product.name}: imagen ${i + 1} de ${imgs.length}`;
        $('[data-zoom-body]').innerHTML = `${ui.productImg(im, { cls: 'zoom-modal__img', eager: true, sizes: '(min-width: 992px) 800px, 100vw' })}<p class="zoom-modal__caption">${esc(im.alt)}</p>`;
        zoom.show();
      };
      zoomEl.addEventListener('hidden.bs.modal', () => { if (opener) opener.focus(); });
      root.addEventListener('click', (e) => {
        const z = e.target.closest('[data-zoom]');
        if (!z) return;
        openZoom(z.dataset.zoom ? Number(z.dataset.zoom) : current, z);
      });

      const mob = $('[data-carousel-gallery] .swiper', root);
      if (mob && window.Swiper) {
        new window.Swiper(mob, {
          slidesPerView: 1,
          speed: utils.prefersReducedMotion() ? 0 : 420,
          pagination: { el: $('.gallery__dots', root), clickable: true, bulletElement: 'button' },
          keyboard: { enabled: true, onlyInViewport: true },
          a11y: { paginationBulletMessage: 'Ver imagen {{index}}', slideLabelMessage: 'Imagen {{index}} de {{slidesLength}}' },
        });
      }
    },
  };
})(window.ET);
