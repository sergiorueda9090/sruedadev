/*
 * Cabaña Las Tres Marías — arranque.
 * Aplica window.TM (config.js) al HTML: modo revisión/publicación, datos de la cabaña,
 * fichas de lugares, ubicación, preguntas frecuentes, planes, enlaces de WhatsApp y medición opcional.
 * Expone window.TMApp con utilidades para gallery.js y booking.js.
 */
(function () {
  'use strict';

  /* ---------- 1. Configuración ---------- */
  var TM = window.TM || {};
  var REVISION = TM.modo !== 'publicacion';
  var UBI = TM.ubicacion || {};
  var POL = TM.politicas || {};

  /* ---------- 2. Utilidades ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'text') node.textContent = attrs[k];
        else if (k === 'class') node.className = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  // Ícono del sprite SVG de index.html (#i-<nombre>).
  function icon(name) { return '<svg class="ic" aria-hidden="true"><use href="#i-' + name + '"/></svg>'; }

  function pendingTag(text) { return el('span', { class: 'pending-tag', text: text || 'Por confirmar' }); }

  function isSafeHttpsUrl(url) {
    try { return new URL(url).protocol === 'https:'; } catch (e) { return false; }
  }

  function waNumber() {
    var n = String(TM.whatsapp || '').replace(/\D/g, '');
    return n.length >= 10 ? n : '';
  }

  function waUrl(text) {
    var n = waNumber();
    return n ? 'https://wa.me/' + n + '?text=' + encodeURIComponent(text) : '';
  }

  function attr(clave) {
    var a = (TM.atributos || []).filter(function (x) { return x.clave === clave; })[0];
    return a && a.valor ? a.valor : '';
  }

  // Abre WhatsApp en otra pestaña. Con 'noopener' window.open devuelve siempre null,
  // así que se corta opener a mano y solo se navega aquí si el navegador bloqueó la ventana.
  function openWa(url) {
    var w = window.open(url, '_blank');
    if (w) w.opener = null;
    else window.location.href = url;
  }

  /* Medición opcional (GA4). Sin TM.ga4 no se carga nada y track() no hace nada. */
  var GA4 = /^G-[A-Z0-9]{4,}$/.test(String(TM.ga4 || '')) ? TM.ga4 : '';
  function track(name, params) {
    if (GA4 && typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }
  function initAnalytics() {
    if (!GA4) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA4);
    // Se carga después del evento load para no competir con la foto principal.
    var load = function () {
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4);
      document.head.appendChild(s);
    };
    if (document.readyState === 'complete') load(); else window.addEventListener('load', load);
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a, button');
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (/wa\.me\//.test(href)) track('clic_whatsapp', { ubicacion: a.id || a.className.split(' ')[0] || 'enlace' });
      else if (a.hasAttribute('data-track')) track(a.getAttribute('data-track'));
      else if (href === '#reservar') track('clic_reservar');
    });
  }

  window.TMApp = { $: $, $$: $$, el: el, pendingTag: pendingTag, waUrl: waUrl, waNumber: waNumber, openWa: openWa, track: track, revision: REVISION };

  /* ---------- 3. Modo revisión / publicación ---------- */
  function applyMode() {
    $$('[data-only="revision"]').forEach(function (n) { n.hidden = !REVISION; });
    $$('[data-only="publicacion"]').forEach(function (n) { n.hidden = REVISION; });
  }

  /* ---------- 4. La cabaña en datos ---------- */
  function renderFacts() {
    var list = $('#facts-list');
    if (!list) return;
    var items = (TM.atributos || []).filter(function (a) { return REVISION || a.valor; });
    items.forEach(function (a) {
      list.appendChild(el('li', null, [
        el('span', { class: 'k', text: a.etiqueta }),
        a.valor ? el('span', { class: 'v', text: a.valor }) : el('span', { class: 'v' }, [pendingTag()])
      ]));
    });
    if (!items.length) { list.hidden = true; $('#facts-empty').hidden = false; }
  }

  /* ---------- 5. Fichas de lugares ---------- */
  function renderPlaces() {
    var box = $('#places');
    if (!box) return;
    var rows = [
      ['ubicacion', 'Ubicación'], ['experiencia', 'Experiencia'], ['exigencia', 'Exigencia física'],
      ['equipo', 'Qué llevar'], ['acceso', 'Acceso']
    ];
    (TM.lugares || []).forEach(function (p) {
      if (!p.publicar && !REVISION) return;
      var dl = el('dl');
      rows.forEach(function (r) {
        if (!p[r[0]] && !REVISION) return;
        dl.appendChild(el('dt', { text: r[1] }));
        dl.appendChild(el('dd', null, [p[r[0]] ? p[r[0]] : pendingTag()]));
      });
      var src = el('p', { class: 'place-src' }, ['Fuente: ']);
      if (p.fuente && p.enlace && isSafeHttpsUrl(p.enlace)) {
        src.appendChild(el('a', { href: p.enlace, target: '_blank', rel: 'noopener', text: p.fuente }));
      } else if (p.fuente) {
        src.appendChild(document.createTextNode(p.fuente));
      } else {
        src.appendChild(pendingTag());
      }
      var card = el('article', { class: 'place' }, [
        el('h4', { text: p.nombre }),
        el('p', { class: 'place-kind' }, [p.tipo, !p.publicar ? ' ' : null, !p.publicar ? pendingTag('Solo en revisión') : null]),
        dl, src
      ]);
      box.appendChild(el('div', { class: 'col-md-6 col-xl-4' }, [card]));
    });
  }

  /* ---------- 6. Ubicación ---------- */
  var RECOMENDACION_GENERAL = 'Lleva ropa abrigada e impermeable. En la alta montaña la niebla puede bajar la visibilidad en la vía: conduce con luces encendidas y sin prisa.';

  function renderLocation() {
    var zona = UBI.zona || '';
    $$('[data-loc]').forEach(function (dd) {
      var key = dd.getAttribute('data-loc');
      var val = UBI[key] || '';
      if (key === 'recomendaciones' && !val) val = RECOMENDACION_GENERAL;
      dd.textContent = '';
      if (key === 'zona') {
        dd.appendChild(document.createTextNode(zona));
        if (!UBI.confirmada && REVISION) { dd.appendChild(document.createTextNode(' ')); dd.appendChild(pendingTag('Sector exacto por confirmar')); }
        return;
      }
      if (val) dd.textContent = val;
      else if (REVISION) dd.appendChild(pendingTag());
    });
    $$('[data-loc-row]').forEach(function (row) {
      if (!UBI[row.getAttribute('data-loc-row')] && !REVISION) row.hidden = true;
    });

    var hasCoords = typeof UBI.lat === 'number' && typeof UBI.lng === 'number';
    if (hasCoords) {
      var q = UBI.lat + ',' + UBI.lng;
      var box = $('#map-box');
      box.textContent = '';
      box.appendChild(el('iframe', {
        src: 'https://www.google.com/maps?q=' + encodeURIComponent(q) + '&z=15&output=embed',
        title: 'Mapa con la ubicación de Cabaña Las Tres Marías', loading: 'lazy', referrerpolicy: 'no-referrer-when-downgrade'
      }));
      var link = el('a', { class: 'link-tm', href: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q), target: '_blank', rel: 'noopener', text: 'Abrir la ubicación en Google Maps' });
      $('.loc-contact').before(el('p', null, [link]));
    }

    var fz = $('[data-footer-zona]');
    if (fz) {
      fz.textContent = 'Zona de ' + zona;
      if (UBI.confirmada && UBI.sector) fz.textContent = UBI.sector + ', ' + zona;
    }
  }

  /* ---------- 7. Preguntas frecuentes ---------- */
  function confirmedAmenities() {
    return (TM.atributos || []).filter(function (a) { return a.valor && a.clave !== 'capacidad'; })
      .map(function (a) { return a.etiqueta + ': ' + a.valor; });
  }

  function faqItems() {
    var cap = TM.capacidadMaxima;
    var amen = confirmedAmenities();
    var tarifas = (TM.tarifas || []).map(function (t) { return t.texto + (t.nota ? ' (' + t.nota + ')' : ''); });
    var sitio = UBI.confirmada ? UBI.sector : '';
    return [
      { q: '¿Dónde está ubicada Cabaña Las Tres Marías?',
        a: 'En Berlín, corregimiento del municipio de Tona, en Santander (Colombia). ' +
          (sitio ? 'Sector: ' + sitio + (UBI.direccion ? '. Dirección: ' + UBI.direccion + '.' : '.') : 'Escríbenos por WhatsApp y te indicamos el sector exacto y cómo llegar.'),
        pending: !UBI.confirmada },
      { q: '¿Cuál es la capacidad máxima?',
        a: cap ? 'Hasta ' + cap + ' personas, contando adultos y niños.' : 'La capacidad se confirma al consultar. Indícanos cuántas personas viajan y te respondemos.',
        pending: !cap },
      { q: '¿Qué espacios y comodidades incluye?',
        a: amen.length ? amen.join('. ') + '.' : 'Estamos confirmando el detalle de habitaciones, baños, cocina y servicios. Pregúntanos por lo que necesites antes de reservar.',
        pending: !amen.length },
      { q: '¿Cómo puedo consultar disponibilidad?',
        a: 'Llena el formulario de reserva con tus fechas y el número de personas. Se prepara un mensaje de WhatsApp con tus datos; al recibirlo te respondemos con la disponibilidad, el precio total y las condiciones. Enviar el mensaje no confirma la reserva.' },
      { q: '¿Cuáles son las tarifas?',
        a: tarifas.length ? tarifas.join('. ') + '.' : 'Aún no publicamos tarifas. Pídelas por WhatsApp indicando fechas y número de personas.',
        pending: !tarifas.length },
      { q: '¿Qué planes se pueden disfrutar?',
        a: 'Proponemos cinco ideas: familiar, romántico, amigos, aventura y descanso. No son paquetes con servicios incluidos; sirven para contarnos cómo quieres vivir tu estadía.' },
      { q: '¿Qué lugares naturales se pueden visitar?',
        a: 'En la región están el Páramo de Berlín, con frailejones y lagunas, y El Picacho, muy conocido por los ciclistas. Las rutas, distancias y tiempos desde la cabaña los confirmaremos con guías locales antes de publicarlos.' },
      { q: '¿Cómo se llega a la cabaña?',
        a: UBI.indicaciones || 'Te enviamos las indicaciones por WhatsApp. En la vía de montaña puede haber niebla: maneja con luces encendidas y con calma.',
        pending: !UBI.indicaciones },
      { q: '¿Qué debo llevar para una caminata?',
        a: 'Ropa por capas, chaqueta impermeable, gorro y guantes, botas con buen agarre, protector solar y gafas (en la altura el sol quema aunque esté nublado), agua, algo de comer y una bolsa para traer de vuelta tu basura. En el páramo no se hacen fogatas.' },
      { q: '¿Se permiten mascotas?',
        a: attr('mascotas') || 'Lo estamos confirmando. Pregúntanos antes de reservar si viajas con tu mascota.',
        pending: !attr('mascotas') },
      { q: '¿Cuáles son las políticas de cancelación?',
        a: POL.cancelacion || 'Las condiciones de cancelación aún no están publicadas. Te las enviamos antes de que hagas cualquier pago.',
        pending: !POL.cancelacion },
      { q: '¿Qué ocurre si hay condiciones climáticas adversas?',
        a: (POL.clima ? POL.clima + ' ' : 'Lo que pasa con la reserva en ese caso se define en las condiciones de reserva. ') +
          'En la montaña la niebla, la lluvia y el frío llegan rápido: si el clima empeora, deja las caminatas para otro momento y no salgas a la vía con poca visibilidad.',
        pending: !POL.clima }
    ];
  }

  function renderFaq() {
    var box = $('#faq');
    if (!box) return;
    var collapsible = !!(window.bootstrap && window.bootstrap.Collapse);
    faqItems().forEach(function (it, i) {
      var id = 'faq-' + i;
      var body = el('div', { class: 'accordion-body' }, [el('p', { text: it.a })]);
      if (it.pending && REVISION) body.firstChild.append(' ', pendingTag());
      var btn = el('button', {
        class: 'accordion-button' + (collapsible ? ' collapsed' : ''), type: 'button',
        'aria-expanded': collapsible ? 'false' : 'true', 'aria-controls': id
      }, [it.q]);
      if (collapsible) { btn.setAttribute('data-bs-toggle', 'collapse'); btn.setAttribute('data-bs-target', '#' + id); }
      box.appendChild(el('div', { class: 'accordion-item' }, [
        el('h3', { class: 'accordion-header' }, [btn]),
        el('div', { id: id, class: 'accordion-collapse' + (collapsible ? ' collapse' : '') }, [body])
      ]));
    });
  }

  /* ---------- 8. Planes (pestañas accesibles) ---------- */
  function goToForm(planName) {
    var select = $('#f-plan');
    if (select && planName) {
      select.value = planName;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
    var target = $('#reservar');
    target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    setTimeout(function () { $('#f-nombre').focus({ preventScroll: true }); }, 600);
  }

  function initPlans() {
    var root = $('[data-plans]');
    if (!root) return;
    var tabs = $$('[role="tab"]', root);
    var panels = $$('[role="tabpanel"]', root);

    function select(i, focus) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
      if (window.TMAnim) window.TMAnim.plan(panels[i]);
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i, false); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = tabs.length, next = null;
        if (k === 'ArrowRight') next = (i + 1) % n;
        else if (k === 'ArrowLeft') next = (i - 1 + n) % n;
        else if (k === 'Home') next = 0;
        else if (k === 'End') next = n - 1;
        if (next !== null) { e.preventDefault(); select(next, true); }
      });
    });
    panels.forEach(function (p) { p.tabIndex = 0; });
    root.classList.add('is-ready');
    select(0, false);

    // Tarifas por plan, si existen.
    (TM.tarifas || []).forEach(function (t) {
      var panel = $('[data-plan="' + t.plan + '"]', root);
      if (!panel || !t.texto) return;
      var row = $('.plan-rate', panel);
      $('dd', row).textContent = t.texto + (t.nota ? ' (' + t.nota + ')' : '');
      row.hidden = false;
    });

    $$('[data-plan-cta]', root).forEach(function (btn) {
      var panel = btn.closest('[data-plan]');
      var name = panel.getAttribute('data-plan-name');
      btn.addEventListener('click', function () {
        var url = waUrl('Hola, quisiera consultar el ' + name + ' en Cabaña Las Tres Marías. ¿Podrían informarme la disponibilidad, el precio total y las condiciones de reserva?');
        track('consultar_plan', { plan: name });
        if (url) openWa(url);
        else goToForm(name);
      });
    });
  }

  /* ---------- 9. Enlaces de WhatsApp ---------- */
  function initWaLinks() {
    var has = !!waNumber();
    $$('[data-wa-link]').forEach(function (a) {
      if (has) {
        a.href = waUrl(a.getAttribute('data-wa-text') || '');
        a.target = '_blank';
        a.rel = 'noopener';
      }
    });
    var float = $('#wa-float');
    var footerWa = $('#footer-contact [data-wa-link]');
    if (!has) {
      // Sin número: los enlaces llevan al formulario y lo dicen.
      float.setAttribute('aria-label', 'Ir al formulario de consulta');
      float.innerHTML = icon('chat-dots');
      footerWa.textContent = 'Consultar disponibilidad';
      if (REVISION) { footerWa.after(' ', pendingTag('WhatsApp por configurar')); }
    }
    // El botón flotante se esconde sobre el hero (ya tiene sus CTA) y mientras el formulario
    // está en pantalla, para no tapar sus controles.
    var watched = ['#inicio', '#reservar'].map(function (s) { return $(s); }).filter(Boolean);
    if ('IntersectionObserver' in window && watched.length) {
      var onScreen = {};
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { onScreen[en.target.id] = en.isIntersecting; });
        float.classList.toggle('is-hidden', Object.keys(onScreen).some(function (k) { return onScreen[k]; }));
      }, { threshold: 0.12 });
      watched.forEach(function (n) { io.observe(n); });
    }
  }

  /* ---------- 10. Redes y contacto del pie ---------- */
  function renderSocial() {
    var ul = $('#footer-social');
    var map = { instagram: 'instagram', facebook: 'facebook', tiktok: 'tiktok' };
    var names = { instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok' };
    Object.keys(TM.redes || {}).forEach(function (k) {
      var url = TM.redes[k];
      if (!url || !isSafeHttpsUrl(url) || !map[k]) return;
      var link = el('a', { href: url, target: '_blank', rel: 'noopener', 'aria-label': names[k] });
      link.innerHTML = icon(map[k]);
      ul.appendChild(el('li', null, [link]));
    });
    ul.hidden = !ul.children.length;
    if (TM.correo && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(TM.correo)) {
      $('#footer-contact').appendChild(el('li', null, [el('a', { href: 'mailto:' + TM.correo, text: TM.correo })]));
    }
  }

  /* ---------- 11. Header, menú y sección activa ---------- */
  function initHeader() {
    var header = $('.site-header');
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var menu = $('#menu');
    if (menu && window.bootstrap) {
      var col = window.bootstrap.Collapse.getOrCreateInstance(menu, { toggle: false });
      var toggler = $('.navbar-toggler');
      menu.addEventListener('show.bs.collapse', function () { header.classList.add('is-open'); toggler.setAttribute('aria-label', 'Cerrar menú'); });
      menu.addEventListener('hide.bs.collapse', function () { header.classList.remove('is-open'); toggler.setAttribute('aria-label', 'Abrir menú'); });
      $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { if (menu.classList.contains('show')) col.hide(); }); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('show')) { col.hide(); toggler.focus(); }
      });
    }

    var links = $$('.site-header .nav-link');
    if (!('IntersectionObserver' in window)) return;
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('active'); a.removeAttribute('aria-current'); });
        var a = byId[en.target.id];
        if (a) { a.classList.add('active'); a.setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- 12. SEO ----------
   * Canonical, Open Graph absoluto y JSON-LD se escriben en el HTML con tools/seo.py
   * (los rastreadores de redes sociales no ejecutan JavaScript). */

  /* ---------- 13. Arranque ---------- */
  applyMode();
  renderFacts();
  renderPlaces();
  renderLocation();
  renderFaq();
  initPlans();
  initWaLinks();
  renderSocial();
  initHeader();
  initAnalytics();
  var y = $('#year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
