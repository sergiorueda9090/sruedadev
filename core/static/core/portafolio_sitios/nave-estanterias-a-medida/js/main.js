/* Nave — landing de proyectos de almacenamiento a medida.
   Script clásico (sin módulos) para que funcione también abriendo el archivo directamente. */
(function () {
  'use strict';

  /* ======================================================
     1. CONFIGURACIÓN — lo único que se edita para un cliente
     ====================================================== */
  const CONFIG = {
    // 'revision' muestra el aviso de demostración y los «Por confirmar»; 'publicacion' los oculta.
    modo: 'revision',

    whatsapp: {
      // Número de EJEMPLO (código de país + número, sin «+» ni espacios).
      // Reemplazar por el número autorizado y poner esEjemplo en false.
      // Mientras esEjemplo sea true, el botón NO abre WhatsApp: muestra un aviso.
      numero: '573001234567',
      esEjemplo: true,
      mensaje: 'Hola, quiero conversar sobre un proyecto de almacenamiento para mi bodega.'
    },

    // URL que recibe el formulario por POST (JSON). Vacía = formulario sin conectar.
    formEndpoint: '',

    contacto: { telefono: '', correo: '', direccion: '', horario: '' }
  };

  /* ======================================================
     2. UTILIDADES
     ====================================================== */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const esRevision = CONFIG.modo !== 'publicacion';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const soloDigitos = (v) => String(v || '').replace(/\D/g, '');

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
     3. MODO Y CONTACTO
     ====================================================== */
  function initModo() {
    document.documentElement.setAttribute('data-modo', esRevision ? 'revision' : 'publicacion');
    // El aviso se puede ocultar; se recuerda solo durante la sesión del navegador.
    let oculto = false;
    try { oculto = sessionStorage.getItem('nave.avisoOculto') === '1'; } catch (e) { /* almacenamiento no disponible */ }
    $('#review-bar').hidden = !esRevision || oculto;
    $('#review-close').addEventListener('click', () => {
      $('#review-bar').hidden = true;
      try { sessionStorage.setItem('nave.avisoOculto', '1'); } catch (e) { /* sin almacenamiento: se oculta solo en esta vista */ }
    });
    $('#year').textContent = String(new Date().getFullYear());
  }

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

  /* ======================================================
     4. HEADER Y MENÚ
     ====================================================== */
  function initHeader() {
    const header = $('#site-header');
    const hero = $('#inicio');
    const pintar = () => {
      const limite = hero ? hero.offsetHeight - header.offsetHeight - 40 : 40;
      header.classList.toggle('is-solid', window.scrollY > limite);
    };
    pintar();
    window.addEventListener('scroll', pintar, { passive: true });
    window.addEventListener('resize', pintar);

    // Al elegir un destino del menú, se cierra el panel y luego se navega.
    const panel = $('#menu');
    $$('a[href^="#"]', panel).forEach((a) => a.addEventListener('click', (e) => {
      if (!window.bootstrap) return;
      e.preventDefault();
      const destino = $(a.getAttribute('href'));
      panel.addEventListener('hidden.bs.offcanvas', () => {
        destino.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
        history.replaceState(null, '', a.getAttribute('href'));
      }, { once: true });
      window.bootstrap.Offcanvas.getOrCreateInstance(panel).hide();
    }));
  }

  /* ======================================================
     5. WHATSAPP
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
      btn.hidden = false;
      btn.setAttribute('aria-label', 'WhatsApp por configurar');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        aviso('<strong>WhatsApp por configurar.</strong> El número actual es de ejemplo: edita <code>CONFIG.whatsapp</code> en js/main.js. Mientras tanto, usa el <a href="#diagnostico">formulario de diagnóstico</a>.');
      });
    }
  }

  /* ======================================================
     6. FORMULARIO DE DIAGNÓSTICO (admite información parcial)
     ====================================================== */
  function initForm() {
    const form = $('#dx-form');
    const status = $('#form-status');
    const submit = $('button[type="submit"]', form);
    const correo = $('#f-correo');
    const telefono = $('#f-telefono');
    const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

    function marcar(input, errId, mensaje) {
      const err = $('#' + errId);
      if (!mensaje) { input.removeAttribute('aria-invalid'); err.hidden = true; err.textContent = ''; return true; }
      input.setAttribute('aria-invalid', 'true');
      err.hidden = false;
      err.textContent = mensaje;
      return false;
    }

    // Devuelve la lista de campos inválidos en el orden en que aparecen.
    function validar() {
      const malos = [];
      const nombre = $('#f-nombre');
      if (!marcar(nombre, 'e-nombre', nombre.value.trim().length >= 2 ? '' : 'Escribe tu nombre.')) malos.push(nombre);

      const c = correo.value.trim();
      const t = soloDigitos(telefono.value);
      let errCorreo = '';
      let errTel = '';
      if (!c && !t) errCorreo = 'Escribe un correo o un teléfono para poder contactarte.';
      if (c && !emailOk(c)) errCorreo = 'Revisa el correo: debe tener la forma nombre@empresa.com.';
      if (telefono.value.trim() && t.length < 7) errTel = 'El teléfono debe tener al menos 7 dígitos.';
      if (!marcar(correo, 'e-correo', errCorreo)) malos.push(correo);
      if (!marcar(telefono, 'e-telefono', errTel)) malos.push(telefono);

      const datos = $('#f-datos');
      if (!marcar(datos, 'e-datos', datos.checked ? '' : 'Necesitamos tu autorización para responder la solicitud.')) malos.push(datos);
      return malos;
    }

    // Progreso de los datos opcionales del proyecto: anima a completar sin exigir.
    const opcionales = $$('[data-proyecto]', form);
    const fill = $('#dx-bar-fill');
    const texto = $('#dx-progress-text');
    function progreso() {
      const n = opcionales.filter((i) => i.value.trim() !== '').length;
      fill.style.width = (n / opcionales.length * 100) + '%';
      texto.textContent = n === 0
        ? 'Ningún dato del proyecto todavía. No hace falta completarlos todos.'
        : n + ' de ' + opcionales.length + ' datos del proyecto. ' + (n < opcionales.length ? 'Con esto ya podemos empezar.' : 'Tenemos una muy buena base para el diagnóstico.');
    }
    opcionales.forEach((i) => i.addEventListener('input', progreso));
    opcionales.forEach((i) => i.addEventListener('change', progreso));

    $$('input', form).forEach((i) => i.addEventListener('input', () => { if (i.hasAttribute('aria-invalid')) validar(); }));

    const setStatus = (tipo, html) => { status.className = 'form-status is-' + tipo; status.innerHTML = html; };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const malos = validar();
      if (malos.length) {
        setStatus('error', 'Falta un dato imprescindible. Revisa ' + (malos.length === 1 ? 'el campo marcado' : 'los campos marcados') + '.');
        malos[0].focus();
        return;
      }
      const datos = Object.fromEntries(new FormData(form).entries());
      datos.autorizacion = true;
      datos.origen = 'landing-3-proyectos-medida';

      if (!CONFIG.formEndpoint) {
        const resumen = 'Hola, soy ' + datos.nombre + (datos.empresa ? ' de ' + datos.empresa : '') + '. Quiero un diagnóstico' + (datos.solucion ? ' para: ' + datos.solucion : '') + '. ' + (datos.descripcion || '');
        const wa = whatsappUrl(resumen);
        setStatus('info', '<strong>Tu solicitud no se envió:</strong> el formulario aún no está conectado a un sistema de recepción. ' +
          (wa ? 'Puedes enviarla por <a href="' + wa + '" target="_blank" rel="noopener">WhatsApp</a>.' : 'Para activarlo, configura <code>CONFIG.formEndpoint</code> en js/main.js.'));
        return;
      }
      const label = submit.textContent;
      submit.disabled = true;
      submit.setAttribute('aria-busy', 'true');
      submit.textContent = 'Enviando…';
      setStatus('info', 'Enviando tu solicitud…');
      try {
        const resp = await fetch(CONFIG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(datos) });
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        form.reset();
        progreso();
        setStatus('success', '<strong>Solicitud de diagnóstico enviada.</strong> Te contactaremos para agendar la primera conversación.');
      } catch (err) {
        setStatus('error', 'No pudimos enviar la solicitud. Inténtalo de nuevo en unos minutos.');
      } finally {
        submit.disabled = false;
        submit.removeAttribute('aria-busy');
        submit.textContent = label;
      }
    });
  }

  /* ======================================================
     7. ANIMACIONES (opt-in; sin GSAP o con movimiento reducido todo queda visible)
     ====================================================== */
  function initAnimaciones() {
    const gsap = window.gsap;
    if (!gsap || reduceMotion) return;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    // Momento principal: la foto se abre como el portón de una nave y el titular sube línea a línea.
    gsap.timeline({ defaults: { ease: 'power4.out' } })
      .fromTo('.hero-media', { clipPath: 'inset(0 46% 0 46%)' }, { clipPath: 'inset(0 0% 0 0%)', duration: 1.5, ease: 'power3.inOut' })
      .from('.hero-media img', { scale: 1.12, duration: 2, ease: 'power2.out' }, 0)
      .from('.hero-line > span', { yPercent: 105, duration: 1, stagger: .09 }, .75)
      .from('[data-hero-side]', { opacity: 0, y: 20, duration: .8 }, 1.15);

    if (!window.ScrollTrigger) return;
    const mm = gsap.matchMedia();

    // Revelado discreto de fotografías al entrar.
    $$('.reveal').forEach((fig) => {
      gsap.fromTo(fig, { clipPath: 'inset(12% 0 0 0)', opacity: .001 }, {
        clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: fig, start: 'top 88%', once: true }
      });
    });

    // Parallax leve de la foto de operación, solo en escritorio.
    mm.add('(min-width: 992px)', () => {
      gsap.fromTo('.operation-media img', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.operation', start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // La línea de tiempo se llena de amarillo con el scroll.
    const lista = $('#tl-list');
    gsap.fromTo(lista, { '--progress': 0 }, { '--progress': 1, ease: 'none', scrollTrigger: { trigger: lista, start: 'top 70%', end: 'bottom 60%', scrub: .5 } });
  }

  /* ======================================================
     8. ARRANQUE
     ====================================================== */
  function init() {
    initModo();
    renderContacto();
    initHeader();
    initWhatsapp();
    initForm();
    initAnimaciones();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
