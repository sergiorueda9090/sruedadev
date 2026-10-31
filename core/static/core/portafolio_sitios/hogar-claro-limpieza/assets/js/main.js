/* =========================================================================
   Hogar Claro — comportamiento de la página
   Script clásico (defer). Bloques: 1 utilidades · 2 modo y datos
   3 WhatsApp · 4 navegación · 5 plano de servicios · 6 paquetes
   7 formulario · 8 SEO · 9 animaciones (GSAP opcional)
   ========================================================================= */
(function () {
  'use strict';

  /* ---------- 1. Utilidades ---------- */
  const SITE = window.SITE || {};
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esRevision = SITE.modo !== 'publicacion';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const soloDigitos = (s) => String(s || '').replace(/\D/g, '');
  const leer = (ruta) => ruta.split('.').reduce((o, k) => (o == null ? o : o[k]), SITE);
  const urlSegura = (u) => { try { return new URL(u).protocol === 'https:'; } catch (e) { return false; } };

  function el(tag, attrs, hijos) {
    const n = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (v == null || v === false) return;
      if (k === 'text') n.textContent = v;
      else if (k === 'class') n.className = v;
      else n.setAttribute(k, v === true ? '' : v);
    });
    (hijos || []).forEach((h) => n.append(h));
    return n;
  }
  const pendiente = (t) => el('span', { class: 'pending-tag', text: t || 'Por configurar' });

  document.addEventListener('error', (e) => {
    const t = e.target;
    if (t && t.tagName === 'IMG') { const ph = t.closest('.ph'); if (ph) ph.classList.add('is-broken'); }
  }, true);

  // Nombre de cada servicio tal como aparece en el formulario y en los mensajes.
  const SERVICIOS = {
    general: 'Aseo general', profunda: 'Limpieza profunda', cocina: 'Cocina', banos: 'Baños',
    habitaciones: 'Habitaciones', mudanza: 'Limpieza por mudanza', remodelacion: 'Después de remodelación', oficina: 'Oficina pequeña'
  };
  const activos = SITE.servicios || {};
  const servicioActivo = (id) => activos[id] !== false;
  const municipios = Array.isArray(SITE.municipios) ? SITE.municipios : [];

  /* ---------- 2. Modo y datos ---------- */
  function initModo() {
    $('#review-bar').hidden = !esRevision;
    $$('[data-bind]').forEach((n) => { const v = leer(n.dataset.bind); if (v) n.textContent = v; });
    $('#year').textContent = String(new Date().getFullYear());
    $$('[data-only="tapiceria"]').forEach((n) => { n.hidden = SITE.complementoTapiceria !== true; });
  }

  function renderListas() {
    municipios.concat(['Otro municipio']).forEach((m) => $('#f-municipio').append(el('option', { text: m })));
    Object.keys(SERVICIOS).filter(servicioActivo).forEach((id) => $('#f-tipo').append(el('option', { text: SERVICIOS[id] })));
    $('#f-tipo').append(el('option', { text: 'Varios servicios o no estoy seguro' }));
    if (municipios.length) { const ul = $('#coverage-list'); ul.textContent = ''; municipios.forEach((m) => ul.append(el('li', { text: m }))); }
  }

  function renderContacto() {
    const c = SITE.contacto || {};
    const dl = $('#contact-list');
    [
      ['WhatsApp', waValido ? '+' + numeroWa : '', waValido ? 'https://wa.me/' + numeroWa : ''],
      ['Teléfono', c.telefono, c.telefono ? 'tel:+' + soloDigitos(c.telefono) : ''],
      ['Correo', c.correo, c.correo ? 'mailto:' + c.correo : ''],
      ['Horario', c.horario, '']
    ].forEach(([etq, v, href]) => {
      if (!v && !esRevision) return;
      const dd = el('dd');
      if (!v) dd.append(pendiente());
      else if (href) dd.append(el('a', { href, text: v, target: href.startsWith('http') ? '_blank' : null, rel: href.startsWith('http') ? 'noopener' : null }));
      else dd.textContent = v;
      dl.append(el('div', {}, [el('dt', { text: etq }), dd]));
    });
    if (!dl.children.length) dl.append(el('div', {}, [el('dd', { text: 'Escríbenos desde el formulario de cotización.' })]));
    const ul = $('#social-list');
    const redes = SITE.redes || {};
    [['instagram', 'Instagram'], ['facebook', 'Facebook'], ['tiktok', 'TikTok']].forEach(([k, n]) => {
      if (redes[k] && urlSegura(redes[k])) ul.append(el('li', {}, [el('a', { href: redes[k], target: '_blank', rel: 'noopener' }, [el('i', { class: 'bi bi-' + k, 'aria-hidden': 'true' }), n])]));
    });
    if (!ul.children.length && esRevision) ul.append(el('li', {}, [pendiente('Redes por configurar')]));
  }

  /* ---------- 3. WhatsApp ---------- */
  const numeroWa = soloDigitos(SITE.whatsapp);
  const waValido = numeroWa.length >= 11 && numeroWa.length <= 15;
  const enlaceWa = (t) => 'https://wa.me/' + numeroWa + '?text=' + encodeURIComponent(t);
  const msj = SITE.mensajes || {};

  function textoBoton(a) {
    if (a.dataset.wa === 'servicio') return (msj.servicio || '').replace('{servicio}', a.dataset.servicio);
    if (a.dataset.wa === 'paquete') return (msj.paquete || '').replace('{paquete}', a.dataset.paquete);
    // Mensaje general sin datos aún: deja los marcadores en lenguaje natural.
    return (msj.general || '').replace('{municipio}', 'el área metropolitana de ' + (SITE.ciudadPrincipal || 'Bucaramanga')).replace('{tipo}', 'una limpieza (les cuento los detalles)');
  }

  function initWhatsApp() {
    $$('[data-wa]').forEach((a) => {
      if (waValido) { a.href = enlaceWa(textoBoton(a)); a.target = '_blank'; a.rel = 'noopener'; }
      else a.href = '#cotizar';
      a.addEventListener('click', () => { if (a.dataset.formTipo && !waValido) $('#f-tipo').value = a.dataset.formTipo; });
    });
    if (!waValido && esRevision) $('.hero-actions').after(el('p', { class: 'mb-4' }, [pendiente('WhatsApp por configurar: los botones llevan al formulario')]));
  }

  /* ---------- 4. Navegación ---------- */
  function initNav() {
    const collapse = $('#nav-principal');
    $$('#nav-principal a').forEach((a) => a.addEventListener('click', () => {
      if (collapse.classList.contains('show') && window.bootstrap) window.bootstrap.Collapse.getOrCreateInstance(collapse).hide();
    }));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && collapse.classList.contains('show') && window.bootstrap) { window.bootstrap.Collapse.getOrCreateInstance(collapse).hide(); $('.navbar-toggler').focus(); }
    });
    const links = $$('#nav-principal .nav-link');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => { const on = a.getAttribute('href') === '#' + e.target.id; a.classList.toggle('active', on); if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      }), { rootMargin: '-45% 0px -50% 0px' });
      links.map((a) => $(a.getAttribute('href'))).filter(Boolean).forEach((s) => io.observe(s));
    }
  }

  /* ---------- 5. Plano de servicios (sin JS se ven todas las fichas) ---------- */
  function initPlano() {
    // Servicios desactivados en config: fuera de la página.
    Object.keys(SERVICIOS).filter((id) => !servicioActivo(id)).forEach((id) => {
      $$('[data-svc="' + id + '"]').forEach((n) => { if (n.classList.contains('room')) n.classList.add('room--static'); else n.remove(); });
    });
    const tabs = $$('.svc-tabs [role="tab"]');
    if (!tabs.length) return;
    const panels = tabs.map((t) => $('#' + t.getAttribute('aria-controls')));
    const rooms = $$('#floorplan .room:not(.room--static)');
    $('.svc-tabs').hidden = false;
    $('#floorplan').removeAttribute('hidden');
    $('#planner').classList.add('is-enhanced');

    function select(i, foco) {
      tabs.forEach((t, j) => { const on = i === j; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; panels[j].hidden = !on; });
      if (foco) tabs[i].focus();
      const zona = tabs[i].dataset.rooms;
      $$('#floorplan .room').forEach((r) => r.classList.toggle('is-on', zona === 'all' ? !r.matches('[data-room="ropas"]') : r.dataset.room === zona));
      if (window.gsap && !reduceMotion) window.gsap.fromTo(panels[i], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .35, ease: 'power2.out' });
    }
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i, false));
      t.addEventListener('keydown', (e) => {
        const n = tabs.length; let j = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % n;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + n) % n;
        if (e.key === 'Home') j = 0;
        if (e.key === 'End') j = n - 1;
        if (j !== null) { e.preventDefault(); select(j, true); }
      });
    });
    // Clic en un espacio del plano = elegir su servicio (el teclado usa las pestañas).
    rooms.forEach((r) => r.addEventListener('click', () => {
      const i = tabs.findIndex((t) => t.dataset.svc === r.dataset.svc);
      if (i >= 0) select(i, false);
    }));
    select(0, false);
  }

  /* ---------- 6. Paquetes ---------- */
  const cop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
  function renderPaquetes() {
    const root = $('#packs');
    (SITE.paquetes || []).forEach((p) => {
      const conPrecio = Number.isInteger(p.precio) && p.precio > 0;
      root.append(el('article', { class: 'sheet' }, [
        el('h3', { text: p.nombre }),
        el('p', { class: 'sheet-for', text: p.para }),
        el('ul', {}, (p.alcance || []).map((x) => el('li', { text: x }))),
        el('p', { class: 'sheet-price' }, conPrecio
          ? ['Desde ' + cop.format(p.precio), el('small', { text: 'Valor de referencia; se confirma al cotizar.' })]
          : ['Cotizar', el('small', { text: 'Según tamaño, estado y fecha.' })]),
        el('a', { class: 'btn-go-outline', href: '#cotizar', 'data-wa': 'paquete', 'data-paquete': p.nombre }, ['Cotizar este paquete'])
      ]));
    });
  }

  /* ---------- 7. Formulario ---------- */
  function hoyISO() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function fechaLegible(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  function initFormulario() {
    const form = $('#quote-form');
    const resumen = $('#form-errors');
    const preview = $('#preview');
    const texto = $('#preview-text');
    const enviar = $('#preview-send');
    const estado = $('#preview-status');
    const fecha = $('#f-fecha');
    fecha.min = hoyISO();
    const campos = [
      { i: $('#f-inmueble'), e: $('#e-inmueble'), ok: (v) => v !== '' },
      { i: $('#f-tamano'), e: $('#e-tamano'), ok: (v) => v !== '' },
      { i: $('#f-tipo'), e: $('#e-tipo'), ok: (v) => v !== '' },
      { i: $('#f-municipio'), e: $('#e-municipio'), ok: (v) => v !== '' },
      { i: fecha, e: $('#e-fecha'), ok: (v) => v === '' || v >= hoyISO() }
    ];
    const marcar = (c, ok) => { c.i.classList.toggle('is-invalid', !ok); c.i.setAttribute('aria-invalid', String(!ok)); c.e.hidden = ok; };
    // Revalida al escribir (no al salir del campo) para no desplazar el botón bajo el cursor.
    campos.forEach((c) => ['input', 'change'].forEach((ev) => c.i.addEventListener(ev, () => { if (c.i.classList.contains('is-invalid')) marcar(c, c.ok(c.i.value.trim())); })));

    function construir() {
      const d = new FormData(form);
      const tipo = String(d.get('tipo'));
      const inicio = (msj.general || '').replace('{municipio}', d.get('municipio')).replace('{tipo}', tipo.charAt(0).toLowerCase() + tipo.slice(1));
      const l = [inicio, ''];
      l.push('Tipo de inmueble: ' + d.get('inmueble'));
      l.push('Tamaño aproximado: ' + d.get('tamano'));
      if (d.get('fecha')) l.push('Fecha deseada: ' + fechaLegible(String(d.get('fecha'))) + ' (sé que depende de su disponibilidad)');
      const det = String(d.get('detalle') || '').trim();
      if (det) l.push('Detalle: ' + det);
      l.push('', 'Puedo enviar fotos de los espacios por este chat.');
      return l.join('\n');
    }
    function actualizarEnlace() {
      if (waValido) {
        enviar.href = enlaceWa(texto.value); enviar.removeAttribute('aria-disabled'); enviar.removeAttribute('tabindex');
        estado.textContent = 'WhatsApp se abrirá con el mensaje escrito; se envía solo cuando lo confirmes en el chat.';
      } else {
        enviar.href = '#'; enviar.setAttribute('aria-disabled', 'true'); enviar.tabIndex = -1;
        estado.textContent = 'El número de WhatsApp del negocio aún no está configurado. Copia el mensaje para enviarlo cuando esté disponible.';
      }
    }
    texto.addEventListener('input', actualizarEnlace);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const malos = campos.filter((c) => { const ok = c.ok(c.i.value.trim()); marcar(c, ok); return !ok; });
      if (malos.length) {
        resumen.hidden = false;
        resumen.textContent = malos.length === 1 ? 'Falta o hay que corregir un dato: ' + malos[0].e.textContent : 'Hay ' + malos.length + ' datos por completar o corregir. Revisa los campos marcados.';
        malos[0].i.focus(); preview.hidden = true; return;
      }
      resumen.hidden = true;
      texto.value = construir();
      preview.hidden = false;
      actualizarEnlace();
      preview.focus({ preventScroll: true });
      preview.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    });
    $('#preview-copy').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(texto.value); estado.textContent = 'Mensaje copiado. Pégalo en el chat de WhatsApp del negocio.'; }
      catch (err) { texto.select(); estado.textContent = 'Selecciona el texto y cópialo con Ctrl+C (o mantén presionado en el celular).'; }
    });
  }

  /* ---------- 8. SEO ---------- */
  function initSEO() {
    const dominio = (SITE.seo || {}).dominio;
    if (!dominio || !urlSegura(dominio)) return;
    document.head.append(el('link', { rel: 'canonical', href: dominio.replace(/\/$/, '') + '/' }));
    const c = SITE.contacto || {};
    const tel = c.telefono || (waValido ? '+' + numeroWa : '');
    if (esRevision || !tel) return;
    const datos = { '@context': 'https://schema.org', '@type': 'LocalBusiness', name: SITE.marca.nombre, description: 'Limpieza general y profunda de hogares y oficinas pequeñas.', url: dominio, telephone: tel, areaServed: municipios.map((m) => ({ '@type': 'City', name: m })) };
    if (c.correo) datos.email = c.correo;
    document.head.append(el('script', { type: 'application/ld+json', text: JSON.stringify(datos) }));
  }

  /* ---------- 9. Animaciones ---------- */
  function initAnimaciones() {
    const gsap = window.gsap;
    if (!gsap || reduceMotion) return;
    // Momento principal: la lista de chequeo del hero se marca casilla por casilla.
    const ticks = $$('.checklist .tick');
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('[data-anim="hero"]', { y: 18, opacity: 0, duration: .65, stagger: .08 })
      .from('.hp--main', { clipPath: 'inset(100% 0 0 0 round 14px)', duration: 1, ease: 'power2.inOut' }, .1)
      .from('.hp--side', { x: -20, opacity: 0, duration: .6 }, '-=.4')
      .fromTo(ticks, { strokeDasharray: 16, strokeDashoffset: 16 }, { strokeDashoffset: 0, duration: .35, stagger: .28, ease: 'power1.out' }, '-=.2');
    if (!window.ScrollTrigger) return;
    gsap.registerPlugin(window.ScrollTrigger);
    gsap.from('.flow li', { opacity: 0, y: 14, duration: .45, stagger: .1, ease: 'power2.out', scrollTrigger: { trigger: '.flow', start: 'top 80%', once: true } });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initModo();
    renderListas();
    renderContacto();
    renderPaquetes();
    initPlano();
    initWhatsApp();
    initNav();
    initFormulario();
    initSEO();
    initAnimaciones();
  });
})();
