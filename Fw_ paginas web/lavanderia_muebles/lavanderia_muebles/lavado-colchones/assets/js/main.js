/* =========================================================================
   Descanso Fresco — comportamiento de la página
   Script clásico (defer). Bloques: 1 utilidades · 2 modo y datos
   3 WhatsApp · 4 navegación · 5 plano de tamaños · 6 galería · 7 paquetes
   8 formulario · 9 SEO · 10 animaciones (GSAP opcional)
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
  const esColor = (c) => /^#[0-9a-f]{6}$/i.test(String(c || ''));

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

  /* ---------- 2. Modo y datos ---------- */
  function initModo() {
    $('#review-bar').hidden = !esRevision;
    $$('[data-bind]').forEach((n) => { const v = leer(n.dataset.bind); if (v) n.textContent = v; });
    $('#year').textContent = String(new Date().getFullYear());
    const c = SITE.colores || {};
    if (esColor(c.primario)) document.documentElement.style.setProperty('--blue', c.primario);
    if (esColor(c.acento)) document.documentElement.style.setProperty('--turq', c.acento);
  }

  const municipios = Array.isArray(SITE.municipios) ? SITE.municipios : [];
  const tamanos = Array.isArray(SITE.tamanos) && SITE.tamanos.length ? SITE.tamanos : [];

  function renderListas() {
    ['#sizer-municipio', '#f-municipio'].forEach((s) => municipios.concat(['Otro municipio']).forEach((m) => $(s).append(el('option', { text: m }))));
    const ft = $('#f-tamano');
    tamanos.forEach((t) => ft.insertBefore(el('option', { value: t.nombre, text: t.nombre + ' (' + t.ancho + ' × ' + t.largo + ' cm)' }), ft.options[ft.options.length - 1]));
    if (municipios.length) {
      const txt = municipios.length > 1 ? municipios.slice(0, -1).join(', ') + ' y ' + municipios[municipios.length - 1] : municipios[0];
      $('#footer-municipios').textContent = txt;
    }
  }

  function renderContacto() {
    const c = SITE.contacto || {};
    const dl = $('#contact-list');
    const filas = [
      ['WhatsApp', waValido ? '+' + numeroWa : '', waValido ? 'https://wa.me/' + numeroWa : ''],
      ['Teléfono', c.telefono, c.telefono ? 'tel:+' + soloDigitos(c.telefono) : ''],
      ['Correo', c.correo, c.correo ? 'mailto:' + c.correo : ''],
      ['Horario', c.horario, '']
    ];
    filas.forEach(([etq, v, href]) => {
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
    if (!ul.children.length) {
      if (esRevision) ul.append(el('li', {}, [pendiente('Redes por configurar')]));
      else { ul.previousElementSibling.hidden = true; ul.hidden = true; }
    }
  }

  /* ---------- 3. WhatsApp ---------- */
  const numeroWa = soloDigitos(SITE.whatsapp);
  const waValido = numeroWa.length >= 11 && numeroWa.length <= 15;
  const enlaceWa = (t) => 'https://wa.me/' + numeroWa + '?text=' + encodeURIComponent(t);
  const msj = SITE.mensajes || {};

  function initWhatsApp() {
    $$('[data-wa="general"], [data-wa="paquete"]').forEach((a) => {
      const texto = a.dataset.wa === 'paquete' ? (msj.paquete || '').replace('{paquete}', a.dataset.paquete) : msj.general;
      if (waValido) { a.href = enlaceWa(texto); a.target = '_blank'; a.rel = 'noopener'; }
    });
    if (!waValido && esRevision) $('.hero-actions').after(el('p', { class: 'mt-3' }, [pendiente('WhatsApp por configurar: los botones llevan al formulario')]));
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

  /* ---------- 5. Plano de tamaños ---------- */
  let tamanoActual = tamanos.find((t) => t.id === 'queen') || tamanos[0];

  function enlaceTamano() {
    const muni = $('#sizer-municipio').value;
    if (!waValido || !muni || !tamanoActual) return null;
    const texto = (msj.tamano || '').replace('{tamano}', tamanoActual.nombre.toLowerCase() + ' (' + tamanoActual.ancho + ' × ' + tamanoActual.largo + ' cm)').replace('{municipio}', muni);
    return enlaceWa(texto);
  }

  function actualizarCtas() {
    const href = enlaceTamano();
    [$('#sizer-cta'), $('[data-wa="final"]')].forEach((a) => {
      if (href) { a.href = href; a.target = '_blank'; a.rel = 'noopener'; }
      else { a.href = a.id === 'sizer-cta' ? '#cotizar' : '#tamanos'; a.removeAttribute('target'); }
    });
  }

  function initSizer() {
    const grupo = $('#sizer-tabs');
    if (!tamanos.length) { $('#tamanos').hidden = true; return; }
    const bed = $('#plan-bed');
    const botones = tamanos.map((t) => el('button', { type: 'button', role: 'radio', class: 'size-opt', 'aria-checked': 'false', tabindex: '-1', text: t.nombre }));
    botones.forEach((b) => grupo.append(b));

    function elegir(i, foco) {
      tamanoActual = tamanos[i];
      botones.forEach((b, j) => { b.setAttribute('aria-checked', String(i === j)); b.tabIndex = i === j ? 0 : -1; });
      if (foco) botones[i].focus();
      const t = tamanoActual;
      bed.style.setProperty('--w', t.ancho);
      bed.style.setProperty('--l', t.largo);
      bed.classList.toggle('is-single', t.ancho < 140);
      $('#plan-w').textContent = t.ancho + ' cm';
      $('#plan-l').textContent = t.largo + ' cm';
      $('#sizer-name').textContent = t.nombre;
      $('#sizer-measure').textContent = 'Referencia: ' + t.ancho + ' × ' + t.largo + ' cm';
      $('#sizer-cta').lastChild.textContent = ' Cotizar colchón ' + t.nombre;
      $('#final-cta-text').textContent = 'Cotizar colchón ' + t.nombre;
      actualizarCtas();
    }
    botones.forEach((b, i) => {
      b.addEventListener('click', () => elegir(i, false));
      b.addEventListener('keydown', (e) => {
        const n = botones.length; let j = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % n;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + n) % n;
        if (j !== null) { e.preventDefault(); elegir(j, true); }
      });
    });
    elegir(Math.max(0, tamanos.indexOf(tamanoActual)), false);
    $('#sizer-municipio').addEventListener('change', actualizarCtas);

    // Sin número o sin municipio, el botón lleva al formulario con el tamaño ya elegido.
    $('#sizer-cta').addEventListener('click', (e) => {
      if (enlaceTamano()) return;
      if (waValido && !$('#sizer-municipio').value) {
        e.preventDefault();
        $('#sizer-municipio').classList.add('is-invalid');
        $('#sizer-municipio').focus();
        return;
      }
      $('#f-tamano').value = tamanoActual.nombre;
      if ($('#sizer-municipio').value) $('#f-municipio').value = $('#sizer-municipio').value;
    });
    $('#sizer-municipio').addEventListener('change', (e) => e.target.classList.remove('is-invalid'));
  }

  /* ---------- 6. Galería con filtros ---------- */
  function initGaleria() {
    const items = $$('#gallery li');
    const botones = $$('.filter');
    botones.forEach((b) => b.addEventListener('click', () => {
      const f = b.dataset.filter;
      botones.forEach((o) => { const on = o === b; o.classList.toggle('is-on', on); o.setAttribute('aria-pressed', String(on)); });
      const visibles = items.filter((li) => { const show = f === 'todo' || li.dataset.cat === f; li.hidden = !show; return show; });
      $('#gallery-status').textContent = visibles.length + ' fotos';
      if (window.gsap && !reduceMotion) window.gsap.fromTo(visibles, { opacity: 0, scale: .97 }, { opacity: 1, scale: 1, duration: .4, stagger: .04, ease: 'power2.out' });
    }));
  }

  /* ---------- 7. Paquetes ---------- */
  const cop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
  function renderPaquetes() {
    const root = $('#packs');
    (SITE.paquetes || []).forEach((p) => {
      const conPrecio = Number.isInteger(p.precio) && p.precio > 0;
      root.append(el('article', { class: 'menu-row' }, [
        el('div', {}, [el('h3', { text: p.nombre }), el('p', { class: 'menu-for', text: p.para })]),
        el('ul', {}, (p.incluye || []).map((i) => el('li', { text: i }))),
        el('div', { class: 'menu-price' }, [
          el('strong', { text: conPrecio ? 'Desde ' + cop.format(p.precio) : 'Precio según cotización' }),
          el('a', { class: 'btn-outline-soft', href: '#cotizar', 'data-wa': 'paquete', 'data-paquete': p.nombre }, ['Cotizar servicio'])
        ])
      ]));
    });
  }

  /* ---------- 8. Formulario ---------- */
  function initFormulario() {
    const form = $('#quote-form');
    const resumen = $('#form-errors');
    const preview = $('#preview');
    const texto = $('#preview-text');
    const enviar = $('#preview-send');
    const estado = $('#preview-status');
    const campos = [
      { i: $('#f-tamano'), e: $('#e-tamano'), ok: (v) => v !== '' },
      { i: $('#f-cantidad'), e: $('#e-cantidad'), ok: (v) => /^\d+$/.test(v) && +v >= 1 && +v <= 30 },
      { i: $('#f-municipio'), e: $('#e-municipio'), ok: (v) => v !== '' },
      { i: $('#f-contacto'), e: $('#e-contacto'), ok: (v) => v !== '' }
    ];
    const marcar = (c, ok) => { c.i.classList.toggle('is-invalid', !ok); c.i.setAttribute('aria-invalid', String(!ok)); c.e.hidden = ok; };
    // Revalida al escribir (no al salir del campo) para no desplazar el botón bajo el cursor.
    campos.forEach((c) => ['input', 'change'].forEach((ev) => c.i.addEventListener(ev, () => { if (c.i.classList.contains('is-invalid')) marcar(c, c.ok(c.i.value.trim())); })));

    function construir() {
      const d = new FormData(form);
      const n = +d.get('cantidad');
      const l = ['Hola, quiero cotizar la limpieza de ' + (n === 1 ? 'un colchón.' : n + ' colchones.'), ''];
      l.push('Tamaño: ' + d.get('tamano'));
      l.push('Cantidad: ' + n);
      l.push('Municipio: ' + d.get('municipio'));
      const extras = d.getAll('extra');
      if (extras.length) l.push('También quiero agregar: ' + extras.join(' y '));
      const det = String(d.get('detalle') || '').trim();
      if (det) l.push('Detalle: ' + det);
      l.push('Prefiero que me contacten: ' + String(d.get('contacto')).toLowerCase());
      l.push('', 'Puedo enviar fotos del colchón por este chat.');
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
        resumen.textContent = malos.length === 1 ? 'Falta un dato: ' + malos[0].e.textContent : 'Faltan ' + malos.length + ' datos. Revisa los campos marcados.';
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
    // Los botones de paquete sin número de WhatsApp llevan al formulario.
    $$('[data-wa="paquete"]').forEach((a) => a.addEventListener('click', () => {
      if (waValido) return;
      const p = a.dataset.paquete.toLowerCase();
      if (p.includes('cabecero')) $('input[name="extra"][value="cabecero tapizado"]').checked = true;
      const t = tamanos.find((x) => p.includes(x.nombre.toLowerCase()));
      if (t) $('#f-tamano').value = t.nombre;
    }));
  }

  /* ---------- 9. SEO ---------- */
  function initSEO() {
    const dominio = (SITE.seo || {}).dominio;
    if (!dominio || !urlSegura(dominio)) return;
    document.head.append(el('link', { rel: 'canonical', href: dominio.replace(/\/$/, '') + '/' }));
    const c = SITE.contacto || {};
    const tel = c.telefono || (waValido ? '+' + numeroWa : '');
    if (esRevision || !tel) return;
    const datos = { '@context': 'https://schema.org', '@type': 'HomeAndConstructionBusiness', name: SITE.marca.nombre, description: 'Limpieza de colchones a domicilio.', url: dominio, telephone: tel, areaServed: municipios.map((m) => ({ '@type': 'City', name: m })) };
    if (c.correo) datos.email = c.correo;
    document.head.append(el('script', { type: 'application/ld+json', text: JSON.stringify(datos) }));
  }

  /* ---------- 10. Animaciones ---------- */
  function initAnimaciones() {
    const gsap = window.gsap;
    if (!gsap || reduceMotion) return;
    // Momento principal: la habitación «se abre» como una cortina suave.
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('[data-anim="hero"]', { y: 18, opacity: 0, duration: .8, stagger: .1 })
      .from('#hero-photo', { clipPath: 'inset(0% 18% 0% 18% round 36px)', duration: 1.3, ease: 'power2.inOut' }, .2)
      .from('#hero-photo img', { scale: 1.08, duration: 1.6, ease: 'power2.out' }, .2)
      .from('.hero-tech', { y: 30, opacity: 0, duration: .7 }, '-=.7')
      .from('.hero-notes li', { x: 16, opacity: 0, duration: .5, stagger: .1 }, '-=.5');
    if (!window.ScrollTrigger) return;
    gsap.registerPlugin(window.ScrollTrigger);
    gsap.from('.plan-bed', { scale: .85, opacity: 0, duration: .8, ease: 'back.out(1.4)', scrollTrigger: { trigger: '#sizer', start: 'top 75%', once: true } });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initModo();
    renderListas();
    renderContacto();
    renderPaquetes();
    initWhatsApp();
    initNav();
    initSizer();
    initGaleria();
    initFormulario();
    initSEO();
    initAnimaciones();
  });
})();
