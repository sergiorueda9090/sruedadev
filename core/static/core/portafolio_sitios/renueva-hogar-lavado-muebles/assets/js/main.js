/* =========================================================================
   Renueva Hogar — comportamiento de la página
   Script clásico (defer), sin módulos: funciona también abriendo el archivo.
   Bloques: 1 utilidades · 2 modo y datos · 3 WhatsApp · 4 navegación
            5 muestrario · 6 paquetes · 7 comparador · 8 formulario
            9 SEO · 10 animaciones (GSAP opcional)
   ========================================================================= */
(function () {
  'use strict';

  /* ---------- 1. Utilidades ---------- */
  const SITE = window.SITE || {};
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esRevision = SITE.modo !== 'publicacion';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const soloDigitos = (s) => String(s || '').replace(/\D/g, '');
  const leer = (ruta) => ruta.split('.').reduce((o, k) => (o == null ? o : o[k]), SITE);

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

  function urlSegura(u) {
    try { return new URL(u).protocol === 'https:'; } catch (e) { return false; }
  }

  function pendiente(texto) { return el('span', { class: 'pending-tag', text: texto || 'Por configurar' }); }

  // Si una foto no carga, el contenedor .ph muestra su fondo de respaldo.
  document.addEventListener('error', (e) => {
    const t = e.target;
    if (t && t.tagName === 'IMG') { const ph = t.closest('.ph'); if (ph) ph.classList.add('is-broken'); }
  }, true);

  /* ---------- 2. Modo y datos de config ---------- */
  function initModo() {
    document.documentElement.setAttribute('data-modo', esRevision ? 'revision' : 'publicacion');
    $('#review-bar').hidden = !esRevision;
    $$('[data-bind]').forEach((n) => { const v = leer(n.dataset.bind); if (v) n.textContent = v; });
    $('#year').textContent = String(new Date().getFullYear());
  }

  function renderCobertura() {
    const lista = $('#coverage-list');
    const sel = $('#f-municipio');
    const municipios = Array.isArray(SITE.municipios) ? SITE.municipios : [];
    if (municipios.length) {
      lista.textContent = '';
      municipios.forEach((m) => lista.append(el('li', { text: m })));
    }
    municipios.concat(['Otro municipio']).forEach((m) => sel.append(el('option', { text: m })));
  }

  function renderContacto() {
    const c = SITE.contacto || {};
    const dl = $('#contact-list');
    const wa = soloDigitos(SITE.whatsapp);
    const filas = [
      ['WhatsApp', wa ? '+' + wa : '', wa ? 'https://wa.me/' + wa : ''],
      ['Teléfono', c.telefono, c.telefono ? 'tel:+' + soloDigitos(c.telefono) : ''],
      ['Correo', c.correo, c.correo ? 'mailto:' + c.correo : ''],
      ['Horario', c.horario, ''],
      ['Dirección', c.direccion, '']
    ];
    filas.forEach(([etq, valor, href]) => {
      if (!valor && !esRevision) return;
      const dd = el('dd');
      if (!valor) dd.append(pendiente());
      else if (href) dd.append(el('a', { href, text: valor, target: href.startsWith('http') ? '_blank' : null, rel: href.startsWith('http') ? 'noopener' : null }));
      else dd.textContent = valor;
      dl.append(el('div', {}, [el('dt', { text: etq }), dd]));
    });
    if (!dl.children.length) dl.append(el('div', {}, [el('dd', { text: 'Escríbenos por el formulario de cotización.' })]));

    const ul = $('#social-list');
    const redes = SITE.redes || {};
    const iconos = { instagram: 'bi-instagram', facebook: 'bi-facebook', tiktok: 'bi-tiktok' };
    const nombres = { instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok' };
    Object.keys(iconos).forEach((k) => {
      const u = redes[k];
      if (u && urlSegura(u)) {
        ul.append(el('li', {}, [el('a', { href: u, target: '_blank', rel: 'noopener' }, [el('i', { class: 'bi ' + iconos[k], 'aria-hidden': 'true' }), nombres[k]])]));
      }
    });
    if (!ul.children.length) {
      if (esRevision) ul.append(el('li', {}, [pendiente('Redes por configurar')]));
      else ul.closest('div').hidden = true;
    }
  }

  /* ---------- 3. WhatsApp ---------- */
  const numeroWa = soloDigitos(SITE.whatsapp);
  const waValido = numeroWa.length >= 11 && numeroWa.length <= 15;
  const enlaceWa = (texto) => 'https://wa.me/' + numeroWa + '?text=' + encodeURIComponent(texto);

  function mensajePara(a) {
    const m = SITE.mensajes || {};
    if (a.dataset.wa === 'mueble') return (m.mueble || '').replace('{mueble}', a.dataset.mueble || 'un mueble');
    if (a.dataset.wa === 'paquete') return (m.paquete || '').replace('{paquete}', a.dataset.paquete || '');
    return m.general || 'Hola, quiero cotizar el lavado de un mueble.';
  }

  // Con número: cada botón abre WhatsApp con su mensaje. Sin número: lleva al
  // formulario (que explica que el canal aún no está configurado).
  function initWhatsApp() {
    $$('[data-wa]').forEach((a) => {
      if (waValido) {
        a.href = enlaceWa(mensajePara(a));
        a.target = '_blank';
        a.rel = 'noopener';
      } else {
        a.href = '#cotizar';
      }
      a.addEventListener('click', () => {
        // Los botones de un mueble concreto preseleccionan el formulario.
        if (a.dataset.formTipo) { const s = $('#f-tipo'); s.value = a.dataset.formTipo; }
      });
    });
    if (!waValido && esRevision) {
      const nota = el('p', { class: 'mt-2 mb-0' }, [pendiente('WhatsApp por configurar: los botones llevan al formulario')]);
      $('.hero-actions').after(nota);
    }
  }

  /* ---------- 4. Navegación ---------- */
  function initNav() {
    const header = $('#site-header');
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const collapse = $('#nav-principal');
    $$('#nav-principal a').forEach((a) => a.addEventListener('click', () => {
      if (collapse.classList.contains('show') && window.bootstrap) window.bootstrap.Collapse.getOrCreateInstance(collapse).hide();
    }));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && collapse.classList.contains('show') && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(collapse).hide();
        $('.navbar-toggler').focus();
      }
    });

    const links = $$('#nav-principal .nav-link');
    const secciones = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          links.forEach((a) => {
            const on = a.getAttribute('href') === '#' + e.target.id;
            a.classList.toggle('active', on);
            if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      secciones.forEach((s) => io.observe(s));
    }
  }

  /* ---------- 5. Muestrario (pestañas; sin JS se ven todas las fichas) ---------- */
  function initMuestrario() {
    const root = $('[data-tabs]');
    const list = $('[role="tablist"]', root);
    const tabs = $$('[role="tab"]', list);
    const panels = tabs.map((t) => $('#' + t.getAttribute('aria-controls')));
    list.hidden = false;
    root.classList.add('is-enhanced');

    function select(i, focus) {
      tabs.forEach((t, j) => {
        const on = i === j;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
      if (list.scrollWidth > list.clientWidth) {
        list.scrollTo({ left: tabs[i].offsetLeft - 16, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
      if (!reduceMotion && window.gsap) {
        window.gsap.fromTo($('.swatch-photo img', panels[i]), { scale: 1.06, opacity: .4 }, { scale: 1, opacity: 1, duration: .6, ease: 'power2.out' });
        window.gsap.fromTo($('.swatch-body', panels[i]).children, { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: .4, stagger: .05, ease: 'power2.out' });
      }
    }
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i, false));
      t.addEventListener('keydown', (e) => {
        const n = tabs.length;
        let j = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % n;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + n) % n;
        if (e.key === 'Home') j = 0;
        if (e.key === 'End') j = n - 1;
        if (j !== null) { e.preventDefault(); select(j, true); }
      });
    });
    select(0, false);
  }

  /* ---------- 6. Paquetes ---------- */
  const cop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

  function renderPaquetes() {
    const root = $('#packs');
    (SITE.paquetes || []).forEach((p) => {
      const tienePrecio = Number.isInteger(p.precio) && p.precio > 0;
      const precio = el('div', { class: 'pack-price' }, tienePrecio
        ? [el('small', { text: 'Desde' }), el('strong', { text: cop.format(p.precio) }), p.precioNota ? el('small', { text: p.precioNota }) : '']
        : [el('strong', { text: 'Solicitar cotización' }), el('small', { text: 'Según piezas, tamaño y tela.' })]);
      const btn = el('a', { class: 'btn-line', href: '#cotizar', 'data-wa': 'paquete', 'data-paquete': p.nombre }, ['Cotizar ' + p.nombre.toLowerCase()]);
      root.append(el('article', { class: 'pack zig-top' }, [
        el('h3', { text: p.nombre }),
        el('p', { class: 'pack-for', text: p.para }),
        el('ul', {}, (p.incluye || []).map((i) => el('li', {}, [el('i', { class: 'bi bi-check2', 'aria-hidden': 'true' }), el('span', { text: i })]))),
        precio,
        btn
      ]));
    });
  }

  /* ---------- 7. Comparador antes / después ---------- */
  function initComparador(fig) {
    const stage = $('.compare-stage', fig);
    const range = $('.compare-range', fig);
    const set = () => stage.style.setProperty('--pos', range.value + '%');
    range.addEventListener('input', set);
    set();
  }

  function renderResultados() {
    const pares = (SITE.resultados || []).filter((r) => r && r.antes && r.despues);
    if (!pares.length) {
      // Sin resultados reales: la simulación solo se muestra en revisión;
      // en publicación se oculta la sección completa para no confundir.
      if (!esRevision) { $('#resultados').hidden = true; $$('a[href="#resultados"]').forEach((a) => a.closest('li').remove()); return; }
      initComparador($('[data-compare]'));
      return;
    }
    const root = $('#resultados-root');
    root.textContent = '';
    $('#resultados-intro').textContent = 'Fotos reales del mismo mueble antes y después del lavado. Desliza para comparar.';
    const grid = el('div', { class: 'results-grid' });
    pares.forEach((r) => {
      const fig = el('figure', { class: 'compare', 'data-compare': true }, [
        el('div', { class: 'compare-stage ph' }, [
          el('img', { class: 'compare-after', src: r.despues, alt: (r.alt || 'Mueble') + ' después del lavado', loading: 'lazy' }),
          el('div', { class: 'compare-before', 'aria-hidden': 'true' }, [el('img', { src: r.antes, alt: '', loading: 'lazy' })]),
          el('span', { class: 'compare-label compare-label--a', 'aria-hidden': 'true', text: 'Antes' }),
          el('span', { class: 'compare-label compare-label--b', 'aria-hidden': 'true', text: 'Después' }),
          el('input', { class: 'compare-range', type: 'range', min: '0', max: '100', value: '50', 'aria-label': 'Comparar antes y después: ' + (r.alt || 'mueble') }),
          el('span', { class: 'compare-handle', 'aria-hidden': 'true' }, [el('i', { class: 'bi bi-arrow-left-right' })])
        ]),
        r.nota ? el('figcaption', { class: 'result-note', text: r.nota }) : ''
      ]);
      grid.append(fig);
      initComparador(fig);
    });
    root.append(grid);
  }

  /* ---------- 8. Formulario → mensaje de WhatsApp ---------- */
  function initFormulario() {
    const form = $('#quote-form');
    const resumen = $('#form-errors');
    const preview = $('#preview');
    const texto = $('#preview-text');
    const enviar = $('#preview-send');
    const estado = $('#preview-status');
    const campos = [
      { input: $('#f-tipo'), error: $('#e-tipo'), ok: (v) => v !== '' },
      { input: $('#f-cantidad'), error: $('#e-cantidad'), ok: (v) => /^\d+$/.test(v) && +v >= 1 && +v <= 60 },
      { input: $('#f-municipio'), error: $('#e-municipio'), ok: (v) => v !== '' }
    ];

    function marcar(c, valido) {
      c.input.classList.toggle('is-invalid', !valido);
      c.input.setAttribute('aria-invalid', String(!valido));
      c.error.hidden = valido;
    }
    // Se revalida mientras se escribe (no al salir del campo) para que el error no
    // desaparezca justo al pulsar el botón y lo desplace bajo el cursor.
    campos.forEach((c) => ['input', 'change'].forEach((ev) => c.input.addEventListener(ev, () => { if (c.input.classList.contains('is-invalid')) marcar(c, c.ok(c.input.value.trim())); })));

    function construir() {
      const d = new FormData(form);
      const lineas = ['Hola, quiero cotizar el lavado de un mueble.', ''];
      lineas.push('Mueble: ' + d.get('tipo'));
      lineas.push('Puestos o unidades: ' + d.get('cantidad'));
      lineas.push('Municipio: ' + d.get('municipio'));
      const det = String(d.get('detalle') || '').trim();
      if (det) lineas.push('Detalle: ' + det);
      const nom = String(d.get('nombre') || '').trim();
      if (nom) lineas.push('Nombre: ' + nom);
      lineas.push('Prefiero que me contacten: ' + String(d.get('contacto')).toLowerCase());
      lineas.push('', 'Les envío fotos del mueble por este chat.');
      return lineas.join('\n');
    }

    function actualizarEnlace() {
      if (waValido) {
        enviar.href = enlaceWa(texto.value);
        enviar.removeAttribute('aria-disabled');
        estado.textContent = 'Al abrir WhatsApp verás el mensaje listo; se envía solo cuando tú lo confirmes en el chat.';
      } else {
        enviar.href = '#';
        enviar.setAttribute('aria-disabled', 'true');
        enviar.tabIndex = -1;
        estado.textContent = 'El número de WhatsApp del negocio aún no está configurado: copia el mensaje para enviarlo cuando esté disponible.';
      }
    }
    texto.addEventListener('input', actualizarEnlace);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const malos = campos.filter((c) => { const ok = c.ok(c.input.value.trim()); marcar(c, ok); return !ok; });
      if (malos.length) {
        resumen.hidden = false;
        resumen.textContent = malos.length === 1 ? 'Falta un dato: ' + malos[0].error.textContent : 'Faltan ' + malos.length + ' datos. Revisa los campos marcados.';
        malos[0].input.focus();
        preview.hidden = true;
        return;
      }
      resumen.hidden = true;
      texto.value = construir();
      preview.hidden = false;
      actualizarEnlace();
      preview.focus({ preventScroll: true });
      preview.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    });

    $('#preview-copy').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(texto.value);
        estado.textContent = 'Mensaje copiado. Pégalo en el chat de WhatsApp del negocio.';
      } catch (err) {
        texto.select();
        estado.textContent = 'Selecciona el texto y cópialo con Ctrl+C (o mantén presionado en el celular).';
      }
    });
  }

  /* ---------- 9. SEO: canonical y datos estructurados solo con dominio real ---------- */
  function initSEO() {
    const dominio = (SITE.seo || {}).dominio;
    if (!dominio || !urlSegura(dominio)) return;
    document.head.append(el('link', { rel: 'canonical', href: dominio.replace(/\/$/, '') + '/' }));
    // LocalBusiness solo con datos verificables: nombre, dominio y al menos un contacto real.
    const c = SITE.contacto || {};
    const tel = c.telefono || (waValido ? '+' + numeroWa : '');
    if (SITE.modo !== 'publicacion' || !tel) return;
    const datos = {
      '@context': 'https://schema.org', '@type': 'HomeAndConstructionBusiness',
      name: SITE.marca.nombre, description: 'Lavado de muebles y tapicería a domicilio.',
      url: dominio, telephone: tel,
      areaServed: (SITE.municipios || []).map((m) => ({ '@type': 'City', name: m }))
    };
    if (c.correo) datos.email = c.correo;
    document.head.append(el('script', { type: 'application/ld+json', text: JSON.stringify(datos) }));
  }

  /* ---------- 10. Animaciones (solo si GSAP cargó y no hay reducción de movimiento) ---------- */
  function initAnimaciones() {
    const gsap = window.gsap;
    if (!gsap || reduceMotion) return;

    // Momento principal: la foto del hero se descubre en tres «pasadas» de boquilla.
    const foto = $('#hero-photo');
    const pasadas = [0, 1, 2].map((i) => {
      const p = el('span', { class: 'pass', 'aria-hidden': 'true' });
      p.style.top = (i * 33.34) + '%';
      p.style.height = '33.4%';
      foto.append(p);
      return p;
    });
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('[data-anim="hero"]', { y: 22, opacity: 0, duration: .7, stagger: .09 })
      .to(pasadas, { scaleX: 0, duration: .75, stagger: .16, ease: 'power2.inOut' }, .15)
      .from('.swatch-tag', { y: 18, opacity: 0, duration: .5 }, '-=.25')
      .add(() => pasadas.forEach((p) => p.remove()));

    if (!window.ScrollTrigger) return;
    gsap.registerPlugin(window.ScrollTrigger);

    // La costura del proceso se cose mientras la sección avanza (solo escritorio).
    const mm = gsap.matchMedia();
    mm.add('(min-width: 992px)', () => {
      gsap.fromTo('#stitch-line', { clipPath: 'inset(0 100% 0 0)' }, {
        clipPath: 'inset(0 0% 0 0)', ease: 'none',
        scrollTrigger: { trigger: '.stitch-wrap', start: 'top 75%', end: 'bottom 55%', scrub: .6 }
      });
      gsap.from('.step', { opacity: 0, y: 16, duration: .5, stagger: .12, ease: 'power2.out', scrollTrigger: { trigger: '.stitch-wrap', start: 'top 75%' } });
    });

    // Revelado de fotos grandes: una sola vez, sin repetir al subir.
    $$('.process-photos figure, .care-photo, .problems-media .ph').forEach((f) => {
      gsap.from(f, { clipPath: 'inset(8% 8% 8% 8% round 14px)', duration: 1, ease: 'power2.out', scrollTrigger: { trigger: f, start: 'top 85%', once: true } });
    });
  }

  /* ---------- Arranque ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initModo();
    renderCobertura();
    renderContacto();
    renderPaquetes();
    renderResultados();
    initWhatsApp();
    initNav();
    initMuestrario();
    initFormulario();
    initSEO();
    initAnimaciones();
  });
})();
