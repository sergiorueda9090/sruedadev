/* VITALIA — interfaz compartida: utilidades, header, footer, menú móvil, buscador,
 * paneles de carrito y favoritos, tarjetas de producto, notificaciones y WhatsApp.
 * El header y el footer se generan aquí desde config.js; cada HTML trae una versión
 * mínima de respaldo para funcionar sin JavaScript.
 */
(function (VT) {
  'use strict';
  const cfg = VT.config;
  const cat = VT.catalogo;

  // ---------- utilidades ----------
  const ROOT = document.body.dataset.root || '';
  const PAGINA = document.body.dataset.page || '';
  const fmtCOP = new Intl.NumberFormat(cfg.moneda.locale, { style: 'currency', currency: cfg.moneda.codigo, maximumFractionDigits: 0 });
  const fmtFecha = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const u = {
    ROOT, PAGINA, esc,
    dinero: (n) => fmtCOP.format(n),
    fecha: (iso) => fmtFecha.format(new Date(iso + 'T12:00:00')),
    url: (ruta) => ROOT + ruta,
    pagina: (nombre) => ROOT + 'pages/' + nombre,
    ficha: (id) => `${ROOT}pages/producto.html?id=${encodeURIComponent(id)}`,
    img: (p, vista, ancho) => ROOT + cat.imagen(p, vista, ancho),
    $: (sel, ctx = document) => ctx.querySelector(sel),
    $$: (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel)),
    param: (k) => new URLSearchParams(location.search).get(k),
    debounce(fn, ms = 180) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; },
    reducido: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    normalizar: (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''),
    estrellas(n) {
      let h = '';
      for (let i = 1; i <= 5; i++) {
        const cls = n >= i - 0.25 ? 'bi-star-fill' : (n >= i - 0.75 ? 'bi-star-half' : 'bi-star vacia');
        h += `<i class="bi ${cls}" aria-hidden="true"></i>`;
      }
      return `<span class="estrellas" aria-hidden="true">${h}</span>`;
    },
    nota: (n) => n.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    // Enlace seguro de WhatsApp o null si no hay número configurado
    whatsapp(mensaje) {
      const num = String(cfg.contacto.whatsapp || '').replace(/\D/g, '');
      return num.length >= 10 ? `https://wa.me/${num}?text=${encodeURIComponent(mensaje)}` : null;
    }
  };

  const revision = cfg.modo !== 'publicacion';
  document.documentElement.classList.add(revision ? 'modo-revision' : 'modo-publicacion');

  // ---------- marca ----------
  const LOGO_MARK = `<svg class="logo-mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><g transform="rotate(-40 16 16)"><rect x="3.5" y="10.25" width="25" height="11.5" rx="5.75" fill="none" stroke="#AB004E" stroke-width="1.7"/><path d="M16 10.25h6.75a5.75 5.75 0 0 1 0 11.5H16z" fill="#AB004E"/></g><circle cx="25" cy="6.8" r="2.1" fill="#B0018F"/></svg>`;
  const logo = (extra = '') => `<a class="logo" href="${u.url('index.html')}" ${extra}>${LOGO_MARK}<span class="logo-text">${esc(cfg.marca.nombre)}</span><span class="visually-hidden">, ir al inicio</span></a>`;
  const RAMA = `<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true" focusable="false"><path d="M30 190 C70 140 110 90 170 20"/><path d="M60 152 C40 140 30 118 34 96 C56 104 68 126 60 152Z"/><path d="M60 152 C80 150 100 136 108 116 C86 112 68 128 60 152Z"/><path d="M92 112 C74 98 70 76 78 56 C98 68 104 92 92 112Z"/><path d="M92 112 C112 112 130 100 140 82 C118 76 100 92 92 112Z"/><path d="M128 66 C116 52 116 32 126 16 C142 30 142 50 128 66Z"/><path d="M128 66 C146 68 162 58 172 42 C152 36 136 48 128 66Z"/></svg>`;

  // ---------- navegación ----------
  const NAV = [
    { id: 'catalogo', href: 'pages/catalogo.html', texto: 'Tienda' },
    { id: 'categorias', texto: 'Categorías', mega: true },
    { id: 'bienestar', href: 'pages/bienestar.html', texto: 'Bienestar' },
    { id: 'nosotros', href: 'pages/nosotros.html', texto: 'Nosotros' },
    { id: 'faq', href: 'pages/preguntas-frecuentes.html', texto: 'Ayuda' },
    { id: 'contacto', href: 'pages/contacto.html', texto: 'Contacto' }
  ];
  const actual = (id) => (PAGINA === id || (id === 'catalogo' && PAGINA === 'producto') ? 'aria-current="page"' : '');
  const catUrl = (c) => `${u.pagina('catalogo.html')}?categoria=${c.id}`;

  function megaMenu() {
    return `<div class="dropdown-menu mega" aria-labelledby="btnCategorias">
      <div class="mega-grid">${cat.categorias.map((c) => `<a class="mega-item" href="${catUrl(c)}">
        <img src="${u.url(`assets/images/categorias/${c.id}-480.webp`)}" alt="" width="56" height="56" loading="lazy">
        <span><strong>${esc(c.nombre)}</strong><span>${esc(c.resumen)}</span></span></a>`).join('')}</div>
      <div class="mega-pie"><a class="enlace-v" href="${u.pagina('catalogo.html')}">Ver todo el catálogo <i class="bi bi-arrow-up-right" aria-hidden="true"></i></a>
        <a href="${u.pagina('catalogo.html')}?destacados=1">Productos destacados</a></div></div>`;
  }

  function header() {
    const navItems = NAV.map((n) => n.mega
      ? `<li class="dropdown"><button class="nav-link-v" id="btnCategorias" type="button" data-bs-toggle="dropdown" data-bs-offset="0,12" aria-expanded="false">${n.texto} <i class="bi bi-chevron-down" aria-hidden="true"></i></button>${megaMenu()}</li>`
      : `<li><a class="nav-link-v" href="${u.url(n.href)}" ${actual(n.id)}>${n.texto}</a></li>`).join('');
    return `
      <div class="topbar"><p>Tu bienestar comienza con decisiones informadas.</p>
        <p class="topbar-extra">Envíos a todo Colombia con <a href="${u.pagina('preguntas-frecuentes.html')}#envios">condiciones de ejemplo</a><span data-solo-revision> (tienda de demostración)</span></p></div>
      <div class="site-header" id="siteHeader">
        <div class="container-v header-row">
          <button class="icon-btn solo-movil" type="button" data-bs-toggle="offcanvas" data-bs-target="#menuMovil" aria-controls="menuMovil" aria-label="Abrir menú"><i class="bi bi-list" aria-hidden="true"></i></button>
          ${logo()}
          <nav class="nav-main" aria-label="Principal"><ul>${navItems}</ul></nav>
          <div class="header-actions">
            <button class="icon-btn" type="button" data-bs-toggle="modal" data-bs-target="#buscador" aria-label="Buscar productos"><i class="bi bi-search" aria-hidden="true"></i></button>
            <div class="dropdown solo-desktop">
              <button class="icon-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Cuenta"><i class="bi bi-person" aria-hidden="true"></i></button>
              <div class="dropdown-menu dropdown-menu-end dropdown-cuenta">
                <div class="cuenta-head"><strong>Tu cuenta</strong><p>El inicio de sesión no está disponible en esta tienda de demostración.</p></div>
                <button class="dropdown-item" type="button" data-bs-toggle="offcanvas" data-bs-target="#panelFavoritos"><i class="bi bi-heart" aria-hidden="true"></i> Mis favoritos</button>
                <a class="dropdown-item" href="${u.pagina('carrito.html')}"><i class="bi bi-bag" aria-hidden="true"></i> Mi carrito</a>
                <a class="dropdown-item" href="${u.pagina('preguntas-frecuentes.html')}#pedidos"><i class="bi bi-box-seam" aria-hidden="true"></i> Seguimiento de pedidos</a>
                <a class="dropdown-item" href="${u.pagina('contacto.html')}"><i class="bi bi-chat-dots" aria-hidden="true"></i> Atención al cliente</a>
              </div>
            </div>
            <button class="icon-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#panelFavoritos" aria-controls="panelFavoritos" aria-label="Favoritos"><i class="bi bi-heart" aria-hidden="true"></i><span class="contador" data-contador="favoritos" data-vacio="true"></span></button>
            <button class="icon-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#panelCarrito" aria-controls="panelCarrito" aria-label="Carrito"><i class="bi bi-bag" aria-hidden="true"></i><span class="contador" data-contador="carrito" data-vacio="true"></span></button>
          </div>
        </div>
      </div>`;
  }

  function menuMovil() {
    return `<div class="offcanvas offcanvas-start panel-v" tabindex="-1" id="menuMovil" aria-labelledby="menuMovilTitulo">
      <div class="offcanvas-header"><h2 class="offcanvas-title" id="menuMovilTitulo">Menú</h2>
        <button type="button" class="btn-cerrar" data-bs-dismiss="offcanvas" aria-label="Cerrar menú"><i class="bi bi-x-lg" aria-hidden="true"></i></button></div>
      <div class="offcanvas-body">
        <nav aria-label="Menú móvil"><ul class="list-unstyled m-0 py-3">
          ${NAV.filter((n) => !n.mega).map((n) => `<li><a class="nav-link-v fs-5 px-0" href="${u.url(n.href)}" ${actual(n.id)}>${n.texto}</a></li>`).join('')}
        </ul></nav>
        <h3 class="h6 mt-3 mb-2" style="font-family:var(--f-sans);font-weight:700">Categorías</h3>
        <ul class="list-unstyled m-0">${cat.categorias.map((c) => `<li><a class="mega-item" href="${catUrl(c)}"><img src="${u.url(`assets/images/categorias/${c.id}-480.webp`)}" alt="" width="56" height="56" loading="lazy"><span><strong>${esc(c.nombre)}</strong></span></a></li>`).join('')}</ul>
        <div class="py-4 d-grid gap-2">
          <button class="btn-v btn-sec" type="button" data-bs-toggle="offcanvas" data-bs-target="#panelFavoritos"><i class="bi bi-heart" aria-hidden="true"></i> Mis favoritos</button>
          <p class="small texto-suave m-0">El inicio de sesión no está disponible en esta tienda de demostración.</p>
        </div>
      </div></div>`;
  }

  function paneles() {
    return `
    <div class="offcanvas offcanvas-end panel-v" tabindex="-1" id="panelCarrito" aria-labelledby="panelCarritoTitulo">
      <div class="offcanvas-header"><h2 class="offcanvas-title" id="panelCarritoTitulo">Tu carrito</h2>
        <button type="button" class="btn-cerrar" data-bs-dismiss="offcanvas" aria-label="Cerrar carrito"><i class="bi bi-x-lg" aria-hidden="true"></i></button></div>
      <div class="offcanvas-body" id="carritoCuerpo"></div>
      <div class="offcanvas-footer" id="carritoPie"></div>
    </div>
    <div class="offcanvas offcanvas-end panel-v" tabindex="-1" id="panelFavoritos" aria-labelledby="panelFavoritosTitulo">
      <div class="offcanvas-header"><h2 class="offcanvas-title" id="panelFavoritosTitulo">Tus favoritos</h2>
        <button type="button" class="btn-cerrar" data-bs-dismiss="offcanvas" aria-label="Cerrar favoritos"><i class="bi bi-x-lg" aria-hidden="true"></i></button></div>
      <div class="offcanvas-body" id="favoritosCuerpo"></div>
    </div>
    <div class="modal fade buscador" id="buscador" tabindex="-1" aria-labelledby="buscadorTitulo" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable"><div class="modal-content">
        <h2 class="visually-hidden" id="buscadorTitulo">Buscar productos</h2>
        <form class="buscador-campo" role="search" action="${u.pagina('catalogo.html')}">
          <i class="bi bi-search" aria-hidden="true"></i>
          <label class="visually-hidden" for="buscadorInput">Buscar por nombre, ingrediente o categoría</label>
          <input id="buscadorInput" name="q" type="search" autocomplete="off" placeholder="Busca por nombre o ingrediente" aria-describedby="buscadorEstado" aria-controls="buscadorResultados">
          <button type="button" class="btn-cerrar" data-bs-dismiss="modal" aria-label="Cerrar buscador"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
        </form>
        <ul class="buscador-resultados" id="buscadorResultados"></ul>
        <div class="buscador-pie"><span id="buscadorEstado" aria-live="polite"></span></div>
      </div></div>
    </div>
    <div class="toasts" id="toasts" aria-live="polite" aria-atomic="false"></div>`;
  }

  function footer() {
    const anio = new Date().getFullYear();
    const redes = cfg.redes.map((r) => r.url
      ? `<a class="red" href="${esc(r.url)}" target="_blank" rel="noopener" aria-label="${esc(r.nombre)}"><i class="bi bi-${r.icono}" aria-hidden="true"></i></a>`
      : `<span class="red red-ejemplo" role="img" aria-label="${esc(r.nombre)}: red de ejemplo, sin enlace"><i class="bi bi-${r.icono}" aria-hidden="true"></i></span>`).join('');
    return `<div class="container-v">
      <div class="footer-top">
        <div class="footer-marca">${logo()}
          <p>${esc(cfg.marca.descripcion)}</p>
          ${cfg.marca.conceptual ? `<p class="nota-demo"><i class="bi bi-info-circle" aria-hidden="true"></i> Marca conceptual: productos, precios, opiniones y datos comerciales son demostrativos.</p>` : ''}
        </div>
        <div class="footer-cols">
          <div class="footer-col"><h2>Categorías</h2><ul>${cat.categorias.map((c) => `<li><a href="${catUrl(c)}">${esc(c.nombre)}</a></li>`).join('')}</ul></div>
          <div class="footer-col"><h2>Atención al cliente</h2><ul>
            <li><a href="${u.pagina('contacto.html')}">Contacto</a></li>
            <li><a href="${u.pagina('preguntas-frecuentes.html')}">Preguntas frecuentes</a></li>
            <li><a href="${u.pagina('preguntas-frecuentes.html')}#envios">Envíos y devoluciones</a></li>
            <li><a href="${u.pagina('carrito.html')}">Tu carrito</a></li></ul></div>
          <div class="footer-col"><h2>Información legal</h2><ul>
            <li><a href="${u.pagina('politicas-de-privacidad.html')}">Política de privacidad</a></li>
            <li><a href="${u.pagina('terminos-y-condiciones.html')}">Términos y condiciones</a></li>
            <li><a href="${u.pagina('terminos-y-condiciones.html')}#productos">Uso responsable de los productos</a></li></ul></div>
          <div class="footer-col"><h2>VITALIA</h2><ul>
            <li><a href="${u.pagina('nosotros.html')}">Nosotros</a></li>
            <li><a href="${u.pagina('bienestar.html')}">Guía de bienestar</a></li>
            <li><a href="${u.pagina('catalogo.html')}">Tienda</a></li>
            <li><a href="${u.pagina('portafolio.html')}">Caso de portafolio</a></li></ul></div>
        </div>
      </div>
      <div class="footer-meta">
        <div><span class="footer-etiqueta">Redes sociales (de ejemplo)</span><div class="redes">${redes}</div></div>
        <div><span class="footer-etiqueta">Métodos de pago ilustrativos</span><ul class="pagos">${cfg.pagos.map((p) => `<li><i class="bi bi-${p.icono}" aria-hidden="true"></i>${esc(p.nombre)}</li>`).join('')}</ul></div>
      </div>
      <div class="footer-bottom">
        <p>© ${anio} ${esc(cfg.marca.nombre)}. Tienda conceptual sin operación comercial.</p>
        <p>Diseño y desarrollo conceptual por <a href="${esc(cfg.desarrollador.url)}" target="_blank" rel="noopener">${esc(cfg.desarrollador.nombre)}</a>.</p>
      </div></div>`;
  }

  // ---------- WhatsApp flotante ----------
  let mensajeWA = cfg.contacto.mensajeWhatsapp;
  function whatsappFlotante() {
    const link = u.whatsapp(mensajeWA);
    if (!link && !revision) return '';
    if (link) return `<div class="wa-flotante"><a class="wa-btn" id="waBtn" href="${link}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp"><i class="bi bi-whatsapp" aria-hidden="true"></i></a></div>`;
    return `<div class="wa-flotante">
      <div class="wa-panel" id="waPanel" hidden role="dialog" aria-labelledby="waTitulo">
        <strong id="waTitulo">WhatsApp por configurar</strong>
        <p>Esta tienda de demostración no tiene un número activo. Así se vería el mensaje que se enviaría:</p>
        <blockquote id="waMensaje">${esc(mensajeWA)}</blockquote>
        <p>Para activarlo, escribe el número en <code>assets/js/config.js</code> (contacto.whatsapp).</p>
        <button class="btn-v btn-sec btn-sm" type="button" id="waCopiar"><i class="bi bi-clipboard" aria-hidden="true"></i> Copiar mensaje</button>
      </div>
      <button class="wa-btn" id="waBtn" type="button" aria-expanded="false" aria-controls="waPanel" aria-label="WhatsApp: ver mensaje preparado"><i class="bi bi-whatsapp" aria-hidden="true"></i></button>
    </div>`;
  }
  function bindWhatsapp() {
    const btn = u.$('#waBtn'); const panel = u.$('#waPanel');
    if (!btn || !panel) return;
    const cerrar = () => { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      const abrir = panel.hidden; panel.hidden = !abrir; btn.setAttribute('aria-expanded', String(abrir));
      if (abrir) u.$('#waCopiar').focus();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { cerrar(); btn.focus(); } });
    document.addEventListener('click', (e) => { if (!panel.hidden && !e.target.closest('.wa-flotante')) cerrar(); });
    u.$('#waCopiar').addEventListener('click', async (e) => {
      try { await navigator.clipboard.writeText(mensajeWA); e.currentTarget.innerHTML = '<i class="bi bi-check2" aria-hidden="true"></i> Mensaje copiado'; } catch (err) { e.currentTarget.textContent = 'Selecciona el texto para copiarlo'; }
    });
  }
  function setMensajeWhatsapp(texto) {
    mensajeWA = texto;
    const btn = u.$('#waBtn');
    if (!btn) return;
    if (btn.tagName === 'A') btn.href = u.whatsapp(texto);
    const m = u.$('#waMensaje'); if (m) m.textContent = texto;
  }

  // ---------- tarjeta de producto ----------
  function tarjeta(p, o = {}) {
    const c = cat.categoria(p.categoria);
    const fav = VT.favoritos.tiene(p.id);
    const total = cat.totalOpiniones(p);
    const carga = o.eager ? 'eager' : 'lazy';
    return `<article class="card-p" data-producto="${p.id}" ${o.reveal === false ? '' : 'data-card'}>
      <div class="card-p-media">
        <img src="${u.img(p, 'frente', 400)}" srcset="${u.img(p, 'frente', 400)} 400w, ${u.img(p, 'frente', 900)} 900w" sizes="(min-width: 992px) 25vw, 50vw" alt="${esc(p.nombre)}, envase frontal" width="400" height="500" loading="${carga}" decoding="async">
        <img class="alt" src="${u.img(p, 'entorno', 400)}" alt="" width="400" height="500" loading="lazy" decoding="async">
        ${p.etiqueta ? `<span class="card-p-badge ${p.etiqueta === 'Nuevo' ? 'nuevo' : ''}">${esc(p.etiqueta)}</span>` : ''}
        <button class="btn-fav" type="button" data-fav="${p.id}" aria-pressed="${fav}" aria-label="${fav ? 'Quitar de favoritos' : 'Guardar en favoritos'}: ${esc(p.nombre)}"><i class="bi bi-heart" aria-hidden="true"></i></button>
        <div class="card-p-quick"><button class="btn-v btn-claro btn-sm" type="button" data-add-cart="${p.id}" aria-label="Añadir ${esc(p.nombre)} al carrito"><i class="bi bi-bag-plus" aria-hidden="true"></i><span class="txt"> Añadir al carrito</span></button></div>
      </div>
      <div class="card-p-body">
        <p class="card-p-cat">${esc(c.nombre)}</p>
        <h3 class="card-p-nombre"><a href="${u.ficha(p.id)}">${esc(p.nombre)}</a></h3>
        ${o.presentacion ? `<p class="card-p-pres">${esc(p.presentacion)}</p>` : ''}
        <p class="valoracion m-0">${u.estrellas(p.valoracion.promedio)}<strong>${u.nota(p.valoracion.promedio)}</strong><span>(${total} opiniones de ejemplo)</span><span class="visually-hidden">Valoración de demostración: ${u.nota(p.valoracion.promedio)} de 5.</span></p>
        <p class="precio m-0"><span class="actual">${u.dinero(p.precio)}</span>${p.precioAnterior ? `<del><span class="visually-hidden">Precio anterior de referencia: </span>${u.dinero(p.precioAnterior)}</del>` : ''}</p>
      </div>
    </article>`;
  }

  // ---------- notificaciones ----------
  function toast({ titulo, texto, img, accion, icono = 'bi-check2-circle', duracion = 4200 }) {
    const cont = u.$('#toasts'); if (!cont) return;
    const t = document.createElement('div');
    t.className = 'toast-v'; t.setAttribute('role', 'status');
    t.innerHTML = `${img ? `<img src="${img}" alt="" width="44" height="55">` : `<i class="bi ${icono}" aria-hidden="true"></i>`}
      <div><strong>${esc(titulo)}</strong>${texto ? `<span>${esc(texto)}</span>` : ''}</div>
      ${accion ? `<button type="button">${esc(accion.texto)}</button>` : ''}`;
    if (accion) t.querySelector('button').addEventListener('click', () => { accion.fn(); quitar(); });
    cont.appendChild(t);
    while (cont.children.length > 3) cont.firstElementChild.remove();
    let timer = setTimeout(quitar, duracion);
    t.addEventListener('mouseenter', () => clearTimeout(timer));
    t.addEventListener('mouseleave', () => { timer = setTimeout(quitar, 1800); });
    function quitar() { t.classList.add('saliendo'); setTimeout(() => t.remove(), 300); }
  }

  // ---------- paneles ----------
  const abrirCarrito = () => { const el = u.$('#panelCarrito'); if (el && window.bootstrap) window.bootstrap.Offcanvas.getOrCreateInstance(el).show(); else location.href = u.pagina('carrito.html'); };

  function selectorCantidad(id, n, contexto) {
    const max = VT.carrito.MAX;
    return `<div class="cantidad" role="group" aria-label="Cantidad">
      <button type="button" data-qty="-1" data-id="${id}" ${n <= 1 ? 'disabled' : ''} aria-label="Restar una unidad"><i class="bi bi-dash" aria-hidden="true"></i></button>
      <input type="number" inputmode="numeric" min="1" max="${max}" value="${n}" data-qty-input data-id="${id}" aria-label="Cantidad de ${esc(cat.porId(id).nombre)}" id="qty-${contexto}-${id}">
      <button type="button" data-qty="1" data-id="${id}" ${n >= max ? 'disabled' : ''} aria-label="Sumar una unidad"><i class="bi bi-plus" aria-hidden="true"></i></button></div>`;
  }

  function lineaCarrito(l, contexto) {
    const p = l.producto;
    return `<div class="linea-item" data-linea="${p.id}">
      <a class="img" href="${u.ficha(p.id)}" tabindex="-1" aria-hidden="true"><img src="${u.img(p, 'frente', 400)}" alt="" width="84" height="105" loading="lazy"></a>
      <div><h3><a href="${u.ficha(p.id)}">${esc(p.nombre)}</a></h3>
        <p class="meta">${esc(p.presentacion)}<br>${u.dinero(p.precio)} c/u</p>
        <div class="acciones">${selectorCantidad(p.id, l.cantidad, contexto)}<strong>${u.dinero(l.total)}</strong></div>
        <button class="btn-texto" type="button" data-quitar="${p.id}">Eliminar<span class="visually-hidden"> ${esc(p.nombre)} del carrito</span></button>
      </div></div>`;
  }

  function vacio({ icono, titulo, texto, cta, href }) {
    return `<div class="vacio"><div class="icono-vacio"><i class="bi ${icono}" aria-hidden="true"></i></div><h3>${titulo}</h3><p>${texto}</p>
      <a class="btn-v" href="${href}">${cta}</a></div>`;
  }

  function renderCarritoPanel() {
    const cuerpo = u.$('#carritoCuerpo'); const pie = u.$('#carritoPie');
    if (!cuerpo) return;
    const lineas = VT.carrito.lineas();
    if (!lineas.length) {
      cuerpo.innerHTML = vacio({ icono: 'bi-bag', titulo: 'Tu carrito está vacío', texto: 'Explora el catálogo y añade lo que quieras revisar con calma.', cta: 'Explorar productos', href: u.pagina('catalogo.html') });
      pie.hidden = true; return;
    }
    cuerpo.innerHTML = lineas.map((l) => lineaCarrito(l, 'panel')).join('');
    pie.hidden = false;
    pie.innerHTML = `<dl class="totales"><div><dt>Subtotal (${VT.carrito.unidades()} ${VT.carrito.unidades() === 1 ? 'unidad' : 'unidades'})</dt><dd>${u.dinero(VT.carrito.subtotal())}</dd></div>
      <div><dt>Envío</dt><dd class="texto-suave fw-normal">Se calcula en el checkout</dd></div></dl>
      <div class="d-grid gap-2"><a class="btn-v" href="${u.pagina('checkout.html')}">Continuar al proceso de compra <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
      <a class="btn-v btn-sec" href="${u.pagina('carrito.html')}">Ver carrito completo</a></div>
      <p class="small texto-suave mt-3 mb-0">Compra de demostración: no se procesan pagos.</p>`;
  }

  function renderFavoritos() {
    const cuerpo = u.$('#favoritosCuerpo'); if (!cuerpo) return;
    const ps = VT.favoritos.lista().map(cat.porId);
    if (!ps.length) {
      cuerpo.innerHTML = vacio({ icono: 'bi-heart', titulo: 'Aún no tienes favoritos', texto: 'Toca el corazón de un producto para guardarlo aquí y compararlo después.', cta: 'Ver productos', href: u.pagina('catalogo.html') });
      return;
    }
    cuerpo.innerHTML = ps.map((p) => `<div class="linea-item">
      <a class="img" href="${u.ficha(p.id)}" tabindex="-1" aria-hidden="true"><img src="${u.img(p, 'frente', 400)}" alt="" width="84" height="105" loading="lazy"></a>
      <div><h3><a href="${u.ficha(p.id)}">${esc(p.nombre)}</a></h3><p class="meta">${u.dinero(p.precio)}</p>
        <div class="acciones"><button class="btn-v btn-sm" type="button" data-add-cart="${p.id}"><i class="bi bi-bag-plus" aria-hidden="true"></i> Añadir al carrito</button>
        <button class="btn-texto" type="button" data-fav="${p.id}" aria-pressed="true">Quitar<span class="visually-hidden"> ${esc(p.nombre)} de favoritos</span></button></div></div></div>`).join('')
      + '<p class="small texto-suave py-3 m-0">Los favoritos se guardan solo en este navegador.</p>';
  }

  function actualizarContadores(pulso) {
    const n = VT.carrito.unidades(); const f = VT.favoritos.lista().length;
    u.$$('[data-contador="carrito"]').forEach((el) => {
      el.textContent = n; el.dataset.vacio = String(n === 0);
      el.parentElement.setAttribute('aria-label', n ? `Carrito: ${n} ${n === 1 ? 'unidad' : 'unidades'}` : 'Carrito vacío');
      if (pulso) { el.classList.remove('pulso'); void el.offsetWidth; el.classList.add('pulso'); }
    });
    u.$$('[data-contador="favoritos"]').forEach((el) => {
      el.textContent = f; el.dataset.vacio = String(f === 0);
      el.parentElement.setAttribute('aria-label', f ? `Favoritos: ${f}` : 'Favoritos, sin productos guardados');
    });
  }

  function sincronizarFavBotones() {
    u.$$('[data-fav]').forEach((b) => {
      const p = cat.porId(b.dataset.fav); if (!p) return;
      const on = VT.favoritos.tiene(p.id);
      b.setAttribute('aria-pressed', String(on));
      if (b.classList.contains('btn-fav')) b.setAttribute('aria-label', `${on ? 'Quitar de favoritos' : 'Guardar en favoritos'}: ${p.nombre}`);
    });
  }

  // ---------- buscador ----------
  function buscar(q) {
    const n = u.normalizar(q.trim());
    if (!n) return [];
    return cat.productos.filter((p) => u.normalizar([p.nombre, cat.categoria(p.categoria).nombre, p.resumen, (p.ingredientes || []).join(' ')].join(' ')).includes(n));
  }
  function bindBuscador() {
    const modal = u.$('#buscador'); const input = u.$('#buscadorInput'); const lista = u.$('#buscadorResultados'); const estado = u.$('#buscadorEstado');
    if (!modal) return;
    const resaltar = (txt, q) => {
      const i = u.normalizar(txt).indexOf(u.normalizar(q.trim()));
      return i < 0 || !q.trim() ? esc(txt) : esc(txt.slice(0, i)) + '<mark>' + esc(txt.slice(i, i + q.trim().length)) + '</mark>' + esc(txt.slice(i + q.trim().length));
    };
    const pintar = () => {
      const q = input.value;
      if (!q.trim()) {
        lista.innerHTML = cat.destacados().slice(0, 4).map((p) => itemBusqueda(p, '')).join('');
        estado.textContent = 'Sugerencias: productos destacados.';
        return;
      }
      const r = buscar(q);
      lista.innerHTML = r.map((p) => itemBusqueda(p, q)).join('');
      estado.innerHTML = r.length
        ? `${r.length} ${r.length === 1 ? 'resultado' : 'resultados'}. Pulsa Enter para verlos en el catálogo.`
        : `Sin resultados para «${esc(q)}». Prueba con «vitamina», «crema» o «infusión».`;
    };
    const itemBusqueda = (p, q) => `<li><a href="${u.ficha(p.id)}"><img src="${u.img(p, 'frente', 400)}" alt="" width="56" height="70" loading="lazy">
      <div>${resaltar(p.nombre, q)}<span>${esc(cat.categoria(p.categoria).nombre)}</span></div><strong>${u.dinero(p.precio)}</strong></a></li>`;
    input.addEventListener('input', u.debounce(pintar, 120));
    modal.addEventListener('shown.bs.modal', () => { input.focus(); pintar(); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { const a = lista.querySelector('a'); if (a) { e.preventDefault(); a.focus(); } }
    });
    lista.addEventListener('keydown', (e) => {
      const links = u.$$('a', lista); const i = links.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' && i < links.length - 1) { e.preventDefault(); links[i + 1].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); (i > 0 ? links[i - 1] : input).focus(); }
    });
  }

  // ---------- eventos globales ----------
  function feedbackBoton(btn) {
    if (!btn.classList.contains('btn-v') || btn.classList.contains('cargando') || btn.classList.contains('hecho')) return;
    const html = btn.innerHTML;
    btn.classList.add('cargando');
    setTimeout(() => {
      btn.classList.remove('cargando'); btn.classList.add('hecho');
      btn.innerHTML = '<i class="bi bi-check2" aria-hidden="true"></i><span class="txt"> Añadido</span>';
      setTimeout(() => { btn.classList.remove('hecho'); btn.innerHTML = html; }, 1400);
    }, 320);
  }

  function añadir(id, n, btn) {
    const p = cat.porId(id); if (!p) return;
    const añadidos = VT.carrito.agregar(id, n);
    if (btn) feedbackBoton(btn);
    if (añadidos > 0) {
      toast({ titulo: `${p.nombre} en tu carrito`, texto: añadidos > 1 ? `${añadidos} unidades añadidas` : 'Añadido correctamente', img: u.img(p, 'frente', 400), accion: { texto: 'Ver carrito', fn: abrirCarrito } });
    } else {
      toast({ titulo: 'Cantidad máxima alcanzada', texto: `Puedes llevar hasta ${VT.carrito.MAX} unidades de cada producto.`, icono: 'bi-info-circle' });
    }
  }

  function bindGlobal() {
    document.addEventListener('click', (e) => {
      const add = e.target.closest('[data-add-cart]');
      if (add) {
        e.preventDefault();
        const fuente = add.dataset.qtyFrom ? u.$(add.dataset.qtyFrom) : null;
        añadir(add.dataset.addCart, fuente ? fuente.value : 1, add);
        if (add.dataset.irA) setTimeout(() => { location.href = add.dataset.irA; }, 350);
        return;
      }
      const fav = e.target.closest('[data-fav]');
      if (fav) {
        e.preventDefault();
        const p = cat.porId(fav.dataset.fav);
        const on = VT.favoritos.alternar(p.id);
        fav.classList.remove('latido'); void fav.offsetWidth; if (on) fav.classList.add('latido');
        toast({ titulo: on ? 'Guardado en favoritos' : 'Quitado de favoritos', texto: p.nombre, icono: on ? 'bi-heart-fill' : 'bi-heart', duracion: 2600 });
        return;
      }
      const qty = e.target.closest('[data-qty]');
      if (qty) {
        const id = qty.dataset.id;
        if (id && VT.carrito.cantidad(id)) VT.carrito.cambiar(id, VT.carrito.cantidad(id) + Number(qty.dataset.qty));
        return;
      }
      const quitar = e.target.closest('[data-quitar]');
      if (quitar) {
        const p = cat.porId(quitar.dataset.quitar); const n = VT.carrito.cantidad(p.id);
        VT.carrito.quitar(p.id);
        toast({ titulo: 'Producto eliminado', texto: p.nombre, icono: 'bi-trash3', accion: { texto: 'Deshacer', fn: () => VT.carrito.agregar(p.id, n) } });
      }
    });
    // Escritura directa de cantidad en carrito: se valida al confirmar
    document.addEventListener('change', (e) => {
      const inp = e.target.closest('[data-qty-input]');
      if (inp && inp.dataset.id && VT.carrito.cantidad(inp.dataset.id)) {
        const v = Math.floor(Number(inp.value));
        VT.carrito.cambiar(inp.dataset.id, Number.isFinite(v) ? v : 1);
      }
    });
    document.addEventListener('vt:carrito', (e) => {
      // conserva el foco del selector de cantidad tras re-renderizar
      const foco = document.activeElement && document.activeElement.id;
      actualizarContadores(e.detail && e.detail.tipo === 'agregar');
      renderCarritoPanel();
      if (foco && document.getElementById(foco)) document.getElementById(foco).focus();
    });
    document.addEventListener('vt:favoritos', () => { actualizarContadores(); renderFavoritos(); sincronizarFavBotones(); });

    // Header: cambia de apariencia al desplazarse
    const h = u.$('#siteHeader'); let ticking = false;
    const onScroll = () => { if (!ticking) { requestAnimationFrame(() => { h.classList.toggle('is-scrolled', window.scrollY > 12); ticking = false; }); ticking = true; } };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  function montarShell() {
    const head = u.$('#site-header'); const foot = u.$('#site-footer');
    if (head) head.innerHTML = header();
    if (foot) { foot.innerHTML = footer(); foot.classList.add('site-footer'); }
    document.body.insertAdjacentHTML('beforeend', menuMovil() + paneles() + whatsappFlotante());
    // Cierra el menú móvil al abrir otro panel desde él
    u.$$('#menuMovil [data-bs-toggle="offcanvas"]').forEach((b) => b.addEventListener('click', () => {
      const m = window.bootstrap && window.bootstrap.Offcanvas.getInstance(u.$('#menuMovil')); if (m) m.hide();
    }));
    renderCarritoPanel(); renderFavoritos(); actualizarContadores();
    bindGlobal(); bindBuscador(); bindWhatsapp();
  }

  VT.u = u;
  VT.ui = { montarShell, tarjeta, toast, abrirCarrito, añadir, lineaCarrito, selectorCantidad, vacio, setMensajeWhatsapp, sincronizarFavBotones, buscar, RAMA, LOGO_MARK };
})(window.VT = window.VT || {});
