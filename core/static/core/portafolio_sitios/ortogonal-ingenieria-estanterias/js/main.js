/* Ortogonal — landing de ingeniería de almacenamiento.
   Script clásico (sin módulos) para que funcione también abriendo el archivo directamente. */
(function () {
  'use strict';

  /* ======================================================
     1. CONFIGURACIÓN — lo único que se edita para un cliente
     ====================================================== */
  const CONFIG = {
    // 'revision': muestra la barra de demostración y los elementos «Por confirmar».
    // 'publicacion': los oculta, junto con indicadores sin valor y testimonios de ejemplo.
    modo: 'revision',

    whatsapp: {
      // Número de EJEMPLO: código de país + número, sin «+» ni espacios.
      // Reemplazar por el número autorizado del cliente y poner esEjemplo en false.
      // Mientras esEjemplo sea true, el botón NO abre WhatsApp: muestra un aviso.
      numero: '573001234567',
      esEjemplo: true,
      mensaje: 'Hola, quiero solicitar una cotización de racks o estanterías para mi bodega.'
    },

    // URL que recibe el formulario por POST (JSON). Vacía = formulario sin conectar.
    // Ejemplos: un endpoint propio, Formspree, Getform o una función serverless.
    formEndpoint: '',

    // Datos de contacto. Vacío ('') = no se publica (en revisión se marca «Por configurar»).
    contacto: {
      telefono: '',
      correo: '',
      direccion: '',
      horario: ''
    },

    // Indicadores de confianza. valor null = sin dato verificado: no se publica.
    indicadores: [
      { valor: null, etiqueta: 'Años de experiencia' },
      { valor: null, etiqueta: 'Proyectos instalados' },
      { valor: null, etiqueta: 'Posiciones de pallet montadas' },
      { valor: null, etiqueta: 'Ciudades atendidas' }
    ],

    // Testimonios. ejemplo: true = texto de muestra, solo visible en modo revisión.
    testimonios: [
      { ejemplo: true, texto: 'Pasamos de almacenar en piso a tener cada referencia ubicada. El diagnóstico nos mostró que teníamos más altura útil de la que creíamos.', nombre: 'Nombre del cliente', cargo: 'Jefe de bodega', empresa: 'Empresa cliente' },
      { ejemplo: true, texto: 'El montaje se hizo por etapas y nunca tuvimos que detener los despachos. Entregaron planos y placas de capacidad de cada módulo.', nombre: 'Nombre del cliente', cargo: 'Gerente de operaciones', empresa: 'Empresa cliente' }
    ]
  };

  /* ======================================================
     2. UTILIDADES
     ====================================================== */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const esRevision = CONFIG.modo !== 'publicacion';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else node.setAttribute(k, v);
    });
    (children || []).forEach((c) => node.append(c));
    return node;
  }

  function soloDigitos(v) { return String(v || '').replace(/\D/g, ''); }

  function whatsappUrl(texto) {
    const n = soloDigitos(CONFIG.whatsapp.numero);
    if (!n || CONFIG.whatsapp.esEjemplo) return '';
    return 'https://wa.me/' + n + '?text=' + encodeURIComponent(texto);
  }

  let toastTimer;
  function aviso(html) {
    const t = $('#toast-note');
    t.innerHTML = html;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 7000);
  }

  /* ======================================================
     3. MODO REVISIÓN / PUBLICACIÓN
     ====================================================== */
  function initModo() {
    document.documentElement.setAttribute('data-modo', esRevision ? 'revision' : 'publicacion');
    $('#review-bar').hidden = !esRevision;
    const y = $('#year');
    if (y) y.textContent = String(new Date().getFullYear());
  }

  /* ======================================================
     4. CONTENIDO GENERADO DESDE CONFIG
     ====================================================== */
  function renderContacto() {
    const c = CONFIG.contacto;
    const filas = [
      ['Teléfono', c.telefono, c.telefono ? 'tel:+' + soloDigitos(c.telefono) : ''],
      ['Correo', c.correo, c.correo ? 'mailto:' + c.correo : ''],
      ['Dirección', c.direccion, ''],
      ['Horario', c.horario, '']
    ];
    ['#contact-data', '#footer-contact'].forEach((sel) => {
      const dl = $(sel);
      filas.forEach(([etiqueta, valor, href]) => {
        if (!valor && !esRevision) return;
        const dd = el('dd');
        if (!valor) dd.textContent = 'Por configurar';
        else if (href) dd.append(el('a', { href, text: valor }));
        else dd.textContent = valor;
        dl.append(el('div', { class: valor ? '' : 'is-empty' }, [el('dt', { text: etiqueta }), dd]));
      });
    });
  }

  function renderIndicadores() {
    const row = $('#indicator-row');
    const visibles = CONFIG.indicadores.filter((i) => i.valor !== null && i.valor !== '' || esRevision);
    if (!visibles.length) { $('#indicadores').hidden = true; return; }
    visibles.forEach((i) => {
      const vacio = i.valor === null || i.valor === '';
      row.append(el('div', { class: 'indicator' + (vacio ? ' is-empty' : '') }, [
        el('dt', {}, vacio ? [i.etiqueta, el('span', { class: 'pending-tag ms-2', text: 'Por configurar' })] : [i.etiqueta]),
        el('dd', { text: vacio ? '—' : String(i.valor) })
      ]));
    });
  }

  function renderTestimonios() {
    const grid = $('#testimonial-grid');
    const visibles = CONFIG.testimonios.filter((t) => !t.ejemplo || esRevision);
    if (!visibles.length) { $('#testimonios').hidden = true; return; }
    visibles.forEach((t) => {
      const cap = el('figcaption', {}, [el('strong', { text: t.nombre }), t.cargo + ', ' + t.empresa]);
      const fig = el('figure', { class: 'testimonial' }, [el('blockquote', { text: '«' + t.texto + '»' }), cap]);
      if (t.ejemplo) fig.prepend(el('p', { class: 'mb-0' }, [el('span', { class: 'pending-tag', text: 'Ejemplo: reemplazar por un testimonio real' })]));
      grid.append(fig);
    });
  }

  /* ======================================================
     5. NAVEGACIÓN
     ====================================================== */
  function initNav() {
    const header = $('#site-header');
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Cierra el menú móvil al elegir un enlace.
    const collapse = $('#nav-principal');
    $$('#nav-principal a').forEach((a) => a.addEventListener('click', () => {
      if (collapse.classList.contains('show') && window.bootstrap) window.bootstrap.Collapse.getOrCreateInstance(collapse).hide();
    }));

    // Marca la sección visible en el menú.
    const links = $$('#nav-principal .nav-link');
    const secciones = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          links.forEach((a) => {
            const activo = a.getAttribute('href') === '#' + e.target.id;
            a.classList.toggle('active', activo);
            if (activo) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      secciones.forEach((s) => io.observe(s));
    }
  }

  /* ======================================================
     6. PESTAÑAS DE SOLUCIONES (sin JS se ven todas las fichas)
     ====================================================== */
  function initTabs() {
    $$('[data-tabs]').forEach((root) => {
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
        tabs[i].scrollIntoView({ block: 'nearest', inline: 'nearest' });
        if (!reduceMotion && window.gsap) {
          window.gsap.fromTo(panels[i].children, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .45, stagger: .08, ease: 'power2.out' });
        }
      }

      panels.forEach((p) => p.setAttribute('tabindex', '0'));
      tabs.forEach((t, i) => {
        t.addEventListener('click', () => select(i, false));
        t.addEventListener('keydown', (e) => {
          const map = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
          if (!(e.key in map)) return;
          e.preventDefault();
          select((map[e.key] + tabs.length) % tabs.length, true);
        });
      });
      tabs.forEach((t, j) => { panels[j].hidden = t.getAttribute('aria-selected') !== 'true'; });
    });
  }

  /* ======================================================
     7. WHATSAPP
     ====================================================== */
  function initWhatsapp() {
    const btn = $('#wa-float');
    const url = whatsappUrl(CONFIG.whatsapp.mensaje);
    if (url) {
      btn.href = url;
      btn.target = '_blank';
      btn.rel = 'noopener';
      btn.setAttribute('aria-label', 'Escribir por WhatsApp (abre en otra pestaña)');
      btn.hidden = false;
    } else if (esRevision) {
      // En revisión se muestra para valorar el diseño, pero explica que falta el número real.
      btn.setAttribute('aria-label', 'WhatsApp por configurar');
      btn.hidden = false;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        aviso('<strong>WhatsApp por configurar.</strong> El número actual es de ejemplo. Edita <code>CONFIG.whatsapp</code> en js/main.js. Mientras tanto, usa el <a href="#cotizar">formulario de cotización</a>.');
      });
    }
  }

  /* ======================================================
     8. FORMULARIO
     ====================================================== */
  function initForm() {
    const form = $('#quote-form');
    const status = $('#form-status');
    const submit = $('button[type="submit"]', form);
    const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

    const reglas = {
      nombre: (v) => v.trim().length >= 2 || 'Escribe tu nombre.',
      empresa: (v) => v.trim().length >= 2 || 'Escribe el nombre de la empresa.',
      correo: (v) => (!v.trim() ? 'Escribe tu correo para enviarte la propuesta.' : emailOk(v.trim()) || 'Revisa el correo: debe tener la forma nombre@empresa.com.'),
      telefono: (v) => !v.trim() || soloDigitos(v).length >= 7 || 'El teléfono debe tener al menos 7 dígitos.',
      mensaje: (v) => v.trim().length >= 10 || 'Cuéntanos en una o dos frases qué necesitas.',
      autorizacion: (_, input) => input.checked || 'Necesitamos tu autorización para responder la solicitud.'
    };

    function validar(input) {
      const regla = reglas[input.name];
      if (!regla) return true;
      const r = regla(input.value, input);
      const err = $('#e-' + (input.name === 'autorizacion' ? 'datos' : input.name));
      if (r === true) {
        input.removeAttribute('aria-invalid');
        if (err) { err.hidden = true; err.textContent = ''; }
        return true;
      }
      input.setAttribute('aria-invalid', 'true');
      if (err) { err.hidden = false; err.textContent = r; }
      return false;
    }

    $$('input, textarea', form).forEach((i) => {
      i.addEventListener('blur', () => { if (i.value || i.hasAttribute('aria-invalid')) validar(i); });
      i.addEventListener('input', () => { if (i.hasAttribute('aria-invalid')) validar(i); });
    });

    function setStatus(tipo, html) {
      status.className = 'form-status is-' + tipo;
      status.innerHTML = html;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const campos = $$('input, textarea, select', form);
      const invalidos = campos.filter((c) => !validar(c));
      if (invalidos.length) {
        setStatus('error', 'Revisa ' + (invalidos.length === 1 ? 'el campo marcado' : 'los ' + invalidos.length + ' campos marcados') + '.');
        invalidos[0].focus();
        return;
      }
      const datos = Object.fromEntries(new FormData(form).entries());
      datos.autorizacion = true;
      datos.origen = 'landing-1-ingenieria';

      if (!CONFIG.formEndpoint) {
        // Sin integración no se finge un envío.
        const resumen = 'Hola, soy ' + datos.nombre + ' de ' + datos.empresa + '. ' + datos.mensaje;
        const wa = whatsappUrl(resumen);
        setStatus('info', '<strong>Tu solicitud no se envió:</strong> este formulario aún no está conectado a un sistema de recepción. ' +
          (wa ? 'Puedes enviarla ahora por <a href="' + wa + '" target="_blank" rel="noopener">WhatsApp</a>.' : 'Para activarlo, configura <code>CONFIG.formEndpoint</code> en js/main.js.'));
        return;
      }

      submit.setAttribute('aria-busy', 'true');
      submit.disabled = true;
      const textoBoton = submit.textContent;
      submit.textContent = 'Enviando…';
      setStatus('info', 'Enviando tu solicitud…');
      try {
        const resp = await fetch(CONFIG.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(datos)
        });
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        form.reset();
        setStatus('success', '<strong>Solicitud enviada.</strong> Te contactaremos al correo indicado para coordinar el diagnóstico.');
      } catch (err) {
        setStatus('error', 'No pudimos enviar la solicitud. Inténtalo de nuevo en unos minutos' + (whatsappUrl('') ? ' o escríbenos por WhatsApp.' : '.'));
      } finally {
        submit.removeAttribute('aria-busy');
        submit.disabled = false;
        submit.textContent = textoBoton;
      }
    });
  }

  /* ======================================================
     9. ANIMACIONES (opt-in: sin GSAP o con movimiento reducido, todo queda visible)
     ====================================================== */
  function initAnimaciones() {
    const gsap = window.gsap;
    if (!gsap || reduceMotion) return;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    // Momento principal: el hero entra y las cotas se dibujan sobre la foto.
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('[data-hero-line]', { y: 28, opacity: 0, duration: .9, stagger: .12 })
      .from('.hero-media img', { scale: 1.08, duration: 1.6, ease: 'power2.out' }, 0);
    $$('.cota line, .cota circle').forEach((s) => {
      const len = typeof s.getTotalLength === 'function' ? s.getTotalLength() : 400;
      gsap.set(s, { strokeDasharray: len, strokeDashoffset: len });
    });
    tl.to('.cota-v line, .cota-v circle', { strokeDashoffset: 0, duration: .8, stagger: .1, ease: 'power2.inOut' }, .5)
      .to('.cota-h line', { strokeDashoffset: 0, duration: .7, stagger: .1, ease: 'power2.inOut' }, .8)
      .to('.cota-p line, .cota-p circle', { strokeDashoffset: 0, duration: .6, stagger: .08, ease: 'power2.inOut' }, 1.05)
      .from('.cota-label', { opacity: 0, duration: .4, stagger: .15 }, 1.2);

    if (!window.ScrollTrigger) return;

    // Revelado de fotografías grandes (clip-path, sin desplazar el contenido).
    $$('.reveal-img').forEach((fig) => {
      gsap.fromTo(fig, { clipPath: 'inset(0 0 100% 0)' }, {
        clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power3.inOut',
        scrollTrigger: { trigger: fig, start: 'top 85%', once: true }
      });
    });

    // La línea del proceso avanza con el scroll (solo en escritorio, donde es visible).
    const fill = $('.process-rail-fill');
    if (fill && window.matchMedia('(min-width: 1200px)').matches) {
      gsap.fromTo(fill, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.process-list', start: 'top 75%', end: 'bottom 60%', scrub: .6 } });
      gsap.from('.process-step', { y: 24, opacity: 0, duration: .7, stagger: .12, ease: 'power2.out', scrollTrigger: { trigger: '.process-list', start: 'top 80%', once: true } });
    }
  }

  /* ======================================================
     10. ARRANQUE
     ====================================================== */
  function init() {
    initModo();
    renderContacto();
    renderIndicadores();
    renderTestimonios();
    initNav();
    initTabs();
    initWhatsapp();
    initForm();
    initAnimaciones();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
