/* =========================================================
   Abogado Fabián Blanco — interacción de la página
   Script clásico (funciona también en file://). Sin dependencias
   obligatorias: Bootstrap y GSAP mejoran la experiencia si cargan.
   ========================================================= */
(function () {
  'use strict';

  /* 1. CONFIGURACIÓN — lo único que se edita al recibir los datos reales */

  // Número de WhatsApp con indicativo de país, solo dígitos (57 + 10 dígitos).
  const WHATSAPP_NUMBER = "573XXXXXXXXX";

  // URL que recibe el formulario por POST (JSON). Vacío = formulario en demostración.
  const FORM_ENDPOINT = "";

  // 'revision' muestra los datos «Por confirmar»; 'publicacion' los oculta.
  const MODO = 'revision';

  // Áreas que el abogado atiende. true = confirmada por él.
  // En modo publicación solo se muestran las confirmadas.
  const AREAS = {
    civil: false,
    comercial: false,
    laboral: false,
    familia: false,
    administrativo: false,
    asesoria: false
  };

  /* 2. CONSTANTES Y UTILIDADES */
  const raiz = document.documentElement;
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const whatsappValido = /^57\d{10}$/.test(WHATSAPP_NUMBER);

  function urlWhatsApp(mensaje) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(mensaje);
  }

  let temporizadorAviso;
  function avisar(texto) {
    const aviso = $('#aviso-flotante');
    if (!aviso) return;
    aviso.textContent = texto;
    aviso.hidden = false;
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => { aviso.hidden = true; }, 5000);
  }

  /* 3. MODO Y ÁREAS */
  function aplicarModo() {
    if (MODO === 'publicacion') raiz.classList.add('modo-publicacion');
  }

  function aplicarAreas() {
    $$('[data-area]').forEach((item) => {
      const confirmada = AREAS[item.dataset.area] === true;
      const estado = $('.estado', item);
      if (confirmada && estado) {
        estado.textContent = 'Confirmada';
        estado.classList.add('confirmada');
      }
      if (!confirmada && MODO === 'publicacion') item.classList.add('oculta');
      if (confirmada && MODO === 'publicacion' && estado) estado.remove();
    });
  }

  /* 4. WHATSAPP */
  function prepararWhatsApp() {
    $$('[data-whatsapp]').forEach((enlace) => {
      if (whatsappValido) {
        enlace.href = urlWhatsApp(enlace.dataset.whatsapp);
        enlace.target = '_blank';
        enlace.rel = 'noopener';
        if (enlace.hasAttribute('data-whatsapp-texto')) {
          enlace.textContent = '+' + WHATSAPP_NUMBER.replace(/^57(\d{3})(\d{3})(\d{4})$/, '57 $1 $2 $3');
        }
      } else {
        // Sin número real: se informa en lugar de abrir un enlace roto.
        enlace.addEventListener('click', () => {
          avisar('El número de WhatsApp aún no está configurado. Mientras tanto, puede usar el formulario de contacto.');
        });
      }
    });
  }

  /* 5. NAVEGACIÓN */
  function prepararNavegacion() {
    const encabezado = $('#encabezado');
    const volver = $('.volver-arriba');
    const menu = $('#menu');

    const alDesplazar = () => {
      const y = window.scrollY;
      encabezado.classList.toggle('con-sombra', y > 8);
      volver.classList.toggle('visible', y > 700);
    };
    window.addEventListener('scroll', alDesplazar, { passive: true });
    alDesplazar();

    volver.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reducirMovimiento ? 'auto' : 'smooth' });
      $('.marca').focus({ preventScroll: true });
    });

    // Cierra el menú móvil al elegir una sección.
    $$('#menu a').forEach((a) => a.addEventListener('click', () => {
      if (menu.classList.contains('show') && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    }));

    // Marca la sección visible en el menú.
    const enlaces = $$('.menu-lista .nav-link');
    const secciones = enlaces.map((a) => $(a.getAttribute('href'))).filter(Boolean);
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
      secciones.forEach((s) => obs.observe(s));
    }
  }

  /* 6. AVISO DE PRIVACIDAD */
  function prepararPrivacidad() {
    const dialogo = $('#privacidad');
    if (!dialogo || typeof dialogo.showModal !== 'function') return;
    $$('[data-abrir-privacidad]').forEach((b) => b.addEventListener('click', () => dialogo.showModal()));
    $('[data-cerrar-privacidad]', dialogo).addEventListener('click', () => dialogo.close());
    dialogo.addEventListener('click', (e) => { if (e.target === dialogo) dialogo.close(); });
  }

  /* 7. FORMULARIO */
  const MENSAJES = {
    nombre: 'Escriba su nombre completo (mínimo 3 caracteres).',
    correo: 'Escriba un correo válido, por ejemplo nombre@dominio.com.',
    telefono: 'Use solo números, espacios o los signos + ( ) -, entre 7 y 20 caracteres.',
    perfil: 'Indique si consulta como persona o como empresa.',
    area: 'Seleccione el tema de su consulta.',
    mensaje: 'Describa brevemente lo que necesita (entre 15 y 500 caracteres).',
    acepto: 'Para responderle necesitamos su autorización de tratamiento de datos.'
  };

  function validarCampo(campo) {
    const error = document.getElementById('e-' + campo.name);
    const valido = campo.checkValidity();
    campo.setAttribute('aria-invalid', valido ? 'false' : 'true');
    if (error) error.textContent = valido ? '' : MENSAJES[campo.name];
    return valido;
  }

  function prepararFormulario() {
    const form = $('#formulario');
    if (!form) return;
    const estado = $('#form-estado');
    const mensaje = $('#f-mensaje');
    const contador = $('#f-contador');
    const campos = $$('input, select, textarea', form);

    mensaje.addEventListener('input', () => { contador.textContent = mensaje.value.length + ' / 500'; });
    campos.forEach((c) => {
      c.addEventListener('blur', () => { if (c.value || c.type === 'checkbox') validarCampo(c); });
      c.addEventListener('input', () => { if (c.getAttribute('aria-invalid') === 'true') validarCampo(c); });
    });

    function mostrarEstado(texto, esError) {
      estado.textContent = texto;
      estado.classList.toggle('es-error', !!esError);
      estado.hidden = false;
      estado.focus();
    }

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      estado.hidden = true;
      const invalidos = campos.filter((c) => !validarCampo(c));
      if (invalidos.length) {
        invalidos[0].focus();
        return;
      }

      const datos = Object.fromEntries(new FormData(form).entries());

      if (!FORM_ENDPOINT) {
        mostrarEstado('Los datos están completos, pero este formulario es una demostración y aún no está conectado a un servidor: no se envió ninguna información. Cuando se configure el canal de recepción, su solicitud llegará directamente al abogado.');
        return;
      }

      const boton = $('.formulario-enviar', form);
      boton.disabled = true;
      boton.textContent = 'Enviando…';
      try {
        const resp = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(datos)
        });
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        form.reset();
        contador.textContent = '0 / 500';
        mostrarEstado('Solicitud enviada. Le responderemos por el canal que indicó.');
      } catch (err) {
        mostrarEstado('No fue posible enviar la solicitud. Revise su conexión e inténtelo de nuevo, o escriba por WhatsApp.', true);
      } finally {
        boton.disabled = false;
        boton.textContent = 'Enviar solicitud';
      }
    });
  }

  /* 8. ANIMACIONES (GSAP + ScrollTrigger) */
  function animar() {
    const listo = () => raiz.classList.add('anim-listo');
    if (reducirMovimiento || !window.gsap) { listo(); return; }
    const gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    // Un único momento orquestado: la entrada del hero.
    gsap.set('[data-hero], [data-hero-foto]', { visibility: 'visible' });
    listo();
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero-regla', { scaleY: 0, duration: 1.1, ease: 'power2.inOut' }, 0)
      .from('[data-hero-linea]', { yPercent: 110, duration: 1, stagger: .12 }, .15)
      .from('[data-hero-foto]', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.3, ease: 'power4.inOut' }, .1)
      .from('[data-hero-foto] img', { scale: 1.12, duration: 1.6 }, .1)
      .from('.hero-retrato-fondo', { xPercent: -8, opacity: 0, duration: 1.2 }, .4)
      .from('[data-hero]', { y: 18, opacity: 0, duration: .8, stagger: .1 }, .55)
      .from('.hero-monograma', { opacity: 0, duration: 2 }, .6);

    if (!window.ScrollTrigger) return;

    // Al desplazarse: revelados discretos y una sola vez.
    gsap.utils.toArray('[data-revelar]').forEach((el) => {
      gsap.from(el, { y: 22, opacity: 0, duration: .9, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    gsap.utils.toArray('[data-revelar-foto]').forEach((el) => {
      gsap.from(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.2, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 82%', once: true } });
    });
    gsap.from('.indice-item', { y: 16, opacity: 0, duration: .7, stagger: .07, ease: 'power2.out', scrollTrigger: { trigger: '.indice', start: 'top 82%', once: true } });
    gsap.from('.paso', { y: 24, opacity: 0, duration: .8, stagger: .12, ease: 'power2.out', scrollTrigger: { trigger: '.pasos', start: 'top 80%', once: true } });
    // Profundidad discreta: el retrato y su fondo se separan levemente al bajar.
    gsap.to('.hero-retrato-fondo', { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  /* 9. ARRANQUE */
  function iniciar() {
    aplicarModo();
    aplicarAreas();
    prepararWhatsApp();
    prepararNavegacion();
    prepararPrivacidad();
    prepararFormulario();
    $$('[data-anio]').forEach((el) => { el.textContent = new Date().getFullYear(); });
    animar();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
