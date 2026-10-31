/* =========================================================
   Tu Derecho, Nuestra Orientación — interacción de la página
   Script clásico (funciona también en file://).
   ========================================================= */
(function () {
  'use strict';

  /* 1. CONFIGURACIÓN */

  // Número de WhatsApp con indicativo de país, solo dígitos (57 + 10 dígitos).
  const WHATSAPP_NUMBER = "573XXXXXXXXX";

  // URL que recibe el formulario por POST (JSON). Vacío = formulario en demostración.
  const FORM_ENDPOINT = "";

  // 'revision' muestra avisos y servicios «Por confirmar»; 'publicacion' oculta ambos.
  const MODO = 'revision';

  // Servicios que el profesional confirma que presta (true). Los demás se marcan
  // «Por confirmar» en revisión y no se muestran en publicación.
  const SERVICIOS = {
    divorcios: false, custodia: false, alimentos: false, sucesiones: false, 'familia-otros': false,
    liquidaciones: false, terminacion: false, prestaciones: false, conflictos: false, derechos: false,
    contratos: false, obligaciones: false, responsabilidad: false, arrendamientos: false, procesos: false
  };

  /* 2. UTILIDADES */
  const raiz = document.documentElement;
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const whatsappValido = /^57\d{10}$/.test(WHATSAPP_NUMBER);

  let temporizador;
  function avisar(texto) {
    const nota = $('#aviso-flotante');
    nota.textContent = texto;
    nota.hidden = false;
    clearTimeout(temporizador);
    temporizador = setTimeout(() => { nota.hidden = true; }, 5000);
  }

  /* 3. WHATSAPP */
  function prepararWhatsApp() {
    $$('[data-whatsapp]').forEach((enlace) => {
      if (whatsappValido) {
        enlace.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(enlace.dataset.whatsapp);
        enlace.target = '_blank';
        enlace.rel = 'noopener';
        if (enlace.hasAttribute('data-whatsapp-texto')) enlace.textContent = '+' + WHATSAPP_NUMBER;
      } else {
        enlace.addEventListener('click', () => avisar('El número de WhatsApp todavía no está configurado. Puedes escribirnos con el formulario de contacto.'));
      }
    });
  }

  /* 4. SERVICIOS CONFIGURABLES */
  function aplicarServicios() {
    $$('[data-servicio]').forEach((li) => {
      if (SERVICIOS[li.dataset.servicio] === true) return;
      if (MODO === 'publicacion') { li.classList.add('oculto'); return; }
      li.classList.add('inactivo');
      const chip = document.createElement('span');
      chip.className = 'por-confirmar';
      chip.textContent = 'Por confirmar';
      li.appendChild(chip);
    });
  }

  /* 5. NAVEGACIÓN */
  function prepararNavegacion() {
    const barra = $('#barra');
    const arriba = $('.arriba');
    const menu = $('#menu');

    const alDesplazar = () => {
      barra.classList.toggle('sombra', window.scrollY > 8);
      arriba.classList.toggle('visible', window.scrollY > 700);
    };
    window.addEventListener('scroll', alDesplazar, { passive: true });
    alDesplazar();

    arriba.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reducirMovimiento ? 'auto' : 'smooth' });
      $('.logo').focus({ preventScroll: true });
    });

    $$('#menu a').forEach((a) => a.addEventListener('click', () => {
      if (menu.classList.contains('show') && window.bootstrap) window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }));

    const enlaces = $$('.menu .nav-link');
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entradas) => {
        entradas.forEach((e) => {
          if (!e.isIntersecting) return;
          enlaces.forEach((a) => {
            const activo = a.getAttribute('href') === '#' + e.target.id;
            a.classList.toggle('activo', activo);
            if (activo) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      enlaces.map((a) => $(a.getAttribute('href'))).filter(Boolean).forEach((s) => obs.observe(s));
    }
  }

  /* 6. TARJETAS DE SITUACIÓN */
  function prepararSituaciones() {
    const tarjetas = $$('.situacion');

    function alternar(tarjeta, abrir) {
      const boton = $('.situacion-boton', tarjeta);
      const abierta = abrir === undefined ? !tarjeta.classList.contains('abierta') : abrir;
      tarjeta.classList.toggle('abierta', abierta);
      boton.setAttribute('aria-expanded', abierta ? 'true' : 'false');
      boton.firstChild.textContent = abierta ? 'Ver menos ' : 'Ver más ';
    }

    tarjetas.forEach((t) => $('.situacion-boton', t).addEventListener('click', () => alternar(t)));

    // Los atajos del hero abren la tarjeta correspondiente.
    $$('[data-ir-situacion]').forEach((a) => a.addEventListener('click', (e) => {
      const tarjeta = $('#sit-' + a.dataset.irSituacion);
      if (!tarjeta) return;
      e.preventDefault();
      tarjeta.scrollIntoView({ behavior: reducirMovimiento ? 'auto' : 'smooth', block: 'center' });
      alternar(tarjeta, true);
      tarjeta.classList.remove('resaltada');
      void tarjeta.offsetWidth;
      tarjeta.classList.add('resaltada');
      $('.situacion-boton', tarjeta).focus({ preventScroll: true });
    }));
  }

  /* 7. PESTAÑAS DE SERVICIOS */
  function prepararAreas() {
    const tabs = $$('.segmento');
    function activar(tab, enfocar) {
      tabs.forEach((t) => {
        const sel = t === tab;
        t.setAttribute('aria-selected', sel ? 'true' : 'false');
        t.tabIndex = sel ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        panel.hidden = !sel;
        if (sel && !reducirMovimiento && window.gsap) {
          window.gsap.fromTo(panel, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .45, ease: 'power2.out' });
          window.gsap.fromTo($$('.lista-servicios li', panel), { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: .4, stagger: .05, delay: .1 });
        }
      });
      if (enfocar) tab.focus();
    }
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activar(tab, false));
      tab.addEventListener('keydown', (e) => {
        const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (!dir) return;
        e.preventDefault();
        activar(tabs[(i + dir + tabs.length) % tabs.length], true);
      });
    });
    const inicial = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
    tabs.forEach((t) => { document.getElementById(t.getAttribute('aria-controls')).hidden = t !== inicial; });
  }

  /* 8. AVISO DE PRIVACIDAD */
  function prepararPrivacidad() {
    const dialogo = $('#privacidad');
    if (!dialogo || typeof dialogo.showModal !== 'function') return;
    $$('[data-abrir-privacidad]').forEach((b) => b.addEventListener('click', () => dialogo.showModal()));
    $('[data-cerrar-privacidad]', dialogo).addEventListener('click', () => dialogo.close());
    dialogo.addEventListener('click', (e) => { if (e.target === dialogo) dialogo.close(); });
  }

  /* 9. FORMULARIO */
  const MENSAJES = {
    nombre: 'Escribe tu nombre (mínimo 3 letras).',
    telefono: 'Escribe un número de contacto válido (7 a 20 caracteres).',
    correo: 'Revisa el correo: debe tener la forma nombre@dominio.com.',
    tema: 'Elige el tema de tu consulta.',
    mensaje: 'Cuéntanos un poco más (entre 15 y 500 caracteres).',
    acepto: 'Necesitamos tu autorización para poder responderte.',
    preferencia: 'Si prefieres correo, escríbelo arriba para poder contactarte.'
  };

  function validar(campo) {
    let ok = campo.checkValidity();
    const err = document.getElementById('e-' + campo.name);
    campo.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (err) err.textContent = ok ? '' : MENSAJES[campo.name];
    return ok;
  }

  function prepararFormulario() {
    const form = $('#formulario');
    if (!form) return;
    const campos = $$('input:not([type="radio"]), select, textarea', form);
    const estado = $('#form-estado');
    const correo = $('#f-correo');
    const msj = $('#f-mensaje');
    msj.addEventListener('input', () => { $('#m-contador').textContent = msj.value.length; });

    // Si la persona prefiere correo, el correo pasa a ser obligatorio.
    const sincronizarCorreo = () => {
      const pref = $('input[name="preferencia"]:checked', form);
      correo.required = !!pref && pref.value === 'Correo';
      $('#e-preferencia').textContent = '';
    };
    $$('input[name="preferencia"]', form).forEach((r) => r.addEventListener('change', sincronizarCorreo));

    campos.forEach((c) => {
      c.addEventListener('blur', () => { if (c.value || c.type === 'checkbox') validar(c); });
      c.addEventListener('input', () => { if (c.getAttribute('aria-invalid') === 'true') validar(c); });
    });

    const mostrar = (texto, esError) => {
      estado.textContent = texto;
      estado.classList.toggle('es-error', !!esError);
      estado.hidden = false;
      estado.focus();
    };

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      estado.hidden = true;
      sincronizarCorreo();
      const malos = campos.filter((c) => !validar(c));
      if (correo.required && !correo.value) $('#e-preferencia').textContent = MENSAJES.preferencia;
      if (malos.length) { malos[0].focus(); return; }

      if (!FORM_ENDPOINT) {
        mostrar('Tus datos están completos. Esta página es una demostración y el formulario aún no está conectado, así que no se envió nada. Cuando se configure, tu consulta llegará directamente al equipo.');
        return;
      }
      const boton = $('.formulario-enviar', form);
      boton.disabled = true;
      boton.textContent = 'Enviando…';
      try {
        const r = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form).entries()))
        });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        form.reset();
        $('#m-contador').textContent = '0';
        mostrar('Recibimos tu consulta. Te contactaremos por el medio que elegiste.');
      } catch (e) {
        mostrar('No pudimos enviar tu consulta. Revisa tu conexión e inténtalo de nuevo, o escríbenos por WhatsApp.', true);
      } finally {
        boton.disabled = false;
        boton.textContent = 'Enviar mi consulta';
      }
    });
  }

  /* 10. ANIMACIONES */
  function partirPalabras(el) {
    const palabras = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = palabras.map((p) => '<span class="palabra" aria-hidden="true">' + p + '</span>').join(' ');
  }

  function animar() {
    const listo = () => raiz.classList.add('anim-listo');
    if (reducirMovimiento || !window.gsap) { listo(); return; }
    const gsap = window.gsap;
    const ST = window.ScrollTrigger;
    if (ST) gsap.registerPlugin(ST);

    const titulo = $('[data-hero-titulo]');
    partirPalabras(titulo);
    gsap.set('[data-hero], [data-hero-foto], [data-hero-titulo], [data-hero-burbuja]', { visibility: 'visible' });
    listo();

    // Entrada del hero: el arco crece, las palabras llegan una a una y la burbuja «responde».
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('[data-hero-foto]', { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 32px 32px)', duration: 1.2, ease: 'power3.inOut' }, 0)
      .from('[data-hero-foto] img', { scale: 1.15, duration: 1.6 }, 0)
      .from('.hero-titulo .palabra', { y: 26, opacity: 0, duration: .7, stagger: .045 }, .25)
      .from('[data-hero]', { y: 16, opacity: 0, duration: .7, stagger: .12 }, .8)
      .from('[data-hero-burbuja]', { scale: .6, opacity: 0, transformOrigin: '85% 100%', duration: .7, ease: 'back.out(1.7)' }, 1.1)
      .from('.hero-burbuja li', { y: 8, opacity: 0, duration: .4, stagger: .07 }, 1.35);

    if (!ST) return;

    gsap.utils.toArray('[data-revelar]').forEach((el) => {
      gsap.from(el, { y: 20, opacity: 0, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
    gsap.from('.situacion', { y: 30, opacity: 0, duration: .7, stagger: .08, ease: 'power2.out', scrollTrigger: { trigger: '.situaciones-grid', start: 'top 85%', once: true } });
    gsap.from('.ruta-paso', { y: 30, opacity: 0, duration: .7, stagger: .14, ease: 'power2.out', scrollTrigger: { trigger: '.ruta', start: 'top 82%', once: true } });
    gsap.from('.ruta-num', { scale: 0, duration: .5, stagger: .14, ease: 'back.out(2)', scrollTrigger: { trigger: '.ruta', start: 'top 82%', once: true } });
    gsap.from('.cta-foto', { scale: .85, opacity: 0, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: '.cta-caja', start: 'top 80%', once: true } });
  }

  /* 11. ARRANQUE */
  function iniciar() {
    if (MODO === 'publicacion') raiz.classList.add('modo-publicacion');
    aplicarServicios();
    prepararWhatsApp();
    prepararNavegacion();
    prepararSituaciones();
    prepararAreas();
    prepararPrivacidad();
    prepararFormulario();
    $$('[data-anio]').forEach((el) => { el.textContent = new Date().getFullYear(); });
    animar();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
