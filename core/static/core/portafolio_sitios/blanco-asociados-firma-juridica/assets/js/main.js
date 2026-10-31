/* =========================================================
   Blanco & Asociados — interacción de la página
   Script clásico (funciona también en file://).
   ========================================================= */
(function () {
  'use strict';

  /* 1. CONFIGURACIÓN */

  // Número de WhatsApp con indicativo de país, solo dígitos (57 + 10 dígitos).
  const WHATSAPP_NUMBER = "573XXXXXXXXX";

  // URL que recibe el formulario por POST (JSON). Vacío = formulario en demostración.
  const FORM_ENDPOINT = "";

  // 'revision' muestra avisos de demostración y datos «Por confirmar»; 'publicacion' los oculta.
  const MODO = 'revision';

  /* 2. UTILIDADES */
  const raiz = document.documentElement;
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const whatsappValido = /^57\d{10}$/.test(WHATSAPP_NUMBER);

  let temporizador;
  function avisar(texto) {
    const aviso = $('#aviso-flotante');
    aviso.textContent = texto;
    aviso.hidden = false;
    clearTimeout(temporizador);
    temporizador = setTimeout(() => { aviso.hidden = true; }, 5000);
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
        enlace.addEventListener('click', () => avisar('El WhatsApp de la firma aún no está configurado. Puede dejar su solicitud en el formulario.'));
      }
    });
  }

  /* 4. NAVEGACIÓN */
  function prepararNavegacion() {
    const cabecera = $('#cabecera');
    const subir = $('.subir');
    const menu = $('#menu');

    const alDesplazar = () => {
      cabecera.classList.toggle('fija', window.scrollY > 10);
      subir.classList.toggle('visible', window.scrollY > 800);
    };
    window.addEventListener('scroll', alDesplazar, { passive: true });
    alDesplazar();

    subir.addEventListener('click', () => {
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

  /* 5. DIRECTORIO DE SERVICIOS (pestañas accesibles) */
  function prepararDirectorio() {
    const pestanas = $$('.dir-tab');
    if (!pestanas.length) return;

    function activar(tab, enfocar) {
      pestanas.forEach((t) => {
        const sel = t === tab;
        t.setAttribute('aria-selected', sel ? 'true' : 'false');
        t.tabIndex = sel ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        panel.hidden = !sel;
        if (sel && !reducirMovimiento && window.gsap) {
          window.gsap.fromTo(panel.children, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .45, stagger: .05, ease: 'power2.out' });
        }
      });
      if (enfocar) tab.focus();
      if (enfocar) tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }

    pestanas.forEach((tab, i) => {
      tab.addEventListener('click', () => activar(tab, false));
      tab.addEventListener('keydown', (e) => {
        const teclas = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
        if (e.key in teclas) {
          e.preventDefault();
          activar(pestanas[(i + teclas[e.key] + pestanas.length) % pestanas.length], true);
        } else if (e.key === 'Home') { e.preventDefault(); activar(pestanas[0], true); }
        else if (e.key === 'End') { e.preventDefault(); activar(pestanas[pestanas.length - 1], true); }
      });
    });

    // Estado inicial (sin JS, todos los paneles quedan visibles).
    const inicial = pestanas.find((t) => t.getAttribute('aria-selected') === 'true') || pestanas[0];
    pestanas.forEach((t) => { document.getElementById(t.getAttribute('aria-controls')).hidden = t !== inicial; });

    // «Consultar sobre este servicio» deja el tipo de consulta preseleccionado.
    $$('[data-consulta]').forEach((b) => b.addEventListener('click', () => {
      const select = $('#f-tipo');
      if (select) select.value = b.dataset.consulta;
    }));
  }

  /* 6. AVISO DE PRIVACIDAD */
  function prepararPrivacidad() {
    const dialogo = $('#privacidad');
    if (!dialogo || typeof dialogo.showModal !== 'function') return;
    $$('[data-abrir-privacidad]').forEach((b) => b.addEventListener('click', () => dialogo.showModal()));
    $('[data-cerrar-privacidad]', dialogo).addEventListener('click', () => dialogo.close());
    dialogo.addEventListener('click', (e) => { if (e.target === dialogo) dialogo.close(); });
  }

  /* 7. FORMULARIO EMPRESARIAL */
  const MENSAJES = {
    nombre: 'Indique su nombre (mínimo 3 caracteres).',
    empresa: 'Indique el nombre de la empresa.',
    correo: 'Escriba un correo válido, por ejemplo nombre@empresa.com.',
    telefono: 'Escriba un teléfono de 7 a 20 caracteres (números, espacios, + ( ) -).',
    tipo: 'Seleccione el tipo de consulta.',
    descripcion: 'Describa su necesidad en términos generales (entre 20 y 600 caracteres).',
    acepto: 'Necesitamos su autorización para atender la solicitud.'
  };

  function validar(campo) {
    const ok = campo.checkValidity();
    campo.setAttribute('aria-invalid', ok ? 'false' : 'true');
    const err = document.getElementById('e-' + campo.name);
    if (err) err.textContent = ok ? '' : MENSAJES[campo.name];
    return ok;
  }

  function prepararFormulario() {
    const form = $('#formulario');
    if (!form) return;
    const campos = $$('input, select, textarea', form);
    const estado = $('#form-estado');
    const desc = $('#f-descripcion');
    desc.addEventListener('input', () => { $('#d-contador').textContent = desc.value.length; });
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
      const malos = campos.filter((c) => !validar(c));
      if (malos.length) { malos[0].focus(); return; }

      if (!FORM_ENDPOINT) {
        mostrar('Solicitud validada. Este formulario es de demostración y todavía no está conectado a un servidor, así que no se envió ningún dato.');
        return;
      }
      const boton = $('button[type="submit"]', form);
      boton.disabled = true;
      try {
        const r = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form).entries()))
        });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        form.reset();
        $('#d-contador').textContent = '0';
        mostrar('Solicitud enviada. La firma le contactará para agendar la conversación.');
      } catch (e) {
        mostrar('No se pudo enviar la solicitud. Inténtelo de nuevo en unos minutos o escriba por WhatsApp.', true);
      } finally {
        boton.disabled = false;
      }
    });
  }

  /* 8. ANIMACIONES */
  function animar() {
    const listo = () => raiz.classList.add('anim-listo');
    if (reducirMovimiento || !window.gsap) { listo(); return; }
    const gsap = window.gsap;
    const ST = window.ScrollTrigger;
    if (ST) gsap.registerPlugin(ST);

    gsap.set('[data-hero], [data-hero-foto]', { visibility: 'visible' });
    listo();

    // Entrada del hero: la retícula se traza y el panorama se abre como un plano.
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero .reticula span', { scaleY: 0, transformOrigin: 'top', duration: 1.2, stagger: .08, ease: 'power2.inOut' }, 0)
      .from('.hero-titulo', { y: 40, opacity: 0, duration: 1 }, .2)
      .from('.hero-sub, .hero-acciones', { y: 20, opacity: 0, duration: .8, stagger: .12 }, .45)
      .from('[data-hero-foto]', { clipPath: 'inset(0% 100% 0% 0%)', duration: 1.4, ease: 'power4.inOut' }, .35)
      .from('.ejes li', { y: 24, opacity: 0, duration: .6, stagger: .08 }, 1.1);

    if (!ST) return;

    gsap.to('.hero-panorama img', { scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.hero-panorama', start: 'top 60%', end: 'bottom top', scrub: true } });

    gsap.utils.toArray('[data-revelar]').forEach((el) => {
      gsap.from(el, { y: 26, opacity: 0, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    // Escala de segmentos: las barras crecen en orden.
    gsap.from('.escalon-barra', { scaleY: 0, duration: .9, stagger: .15, ease: 'power3.out', scrollTrigger: { trigger: '.escala', start: 'top 80%', once: true } });

    // Línea de tiempo: el trazo bronce avanza con el desplazamiento.
    const linea = $('.linea-tiempo');
    if (linea) {
      const progreso = document.createElement('span');
      progreso.className = 'linea-tiempo-progreso';
      progreso.setAttribute('aria-hidden', 'true');
      linea.appendChild(progreso);
      const mm = gsap.matchMedia();
      mm.add('(min-width: 992px)', () => {
        gsap.fromTo(progreso, { scaleX: 0, scaleY: 1 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: linea, start: 'top 75%', end: 'bottom 55%', scrub: .6 } });
      });
      mm.add('(max-width: 991.98px)', () => {
        gsap.fromTo(progreso, { scaleY: 0, scaleX: 1 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: linea, start: 'top 75%', end: 'bottom 60%', scrub: .6 } });
      });
      gsap.from('.hito', { y: 20, opacity: 0, duration: .7, stagger: .15, ease: 'power2.out', scrollTrigger: { trigger: linea, start: 'top 80%', once: true } });
    }

    gsap.from('.perfil', { y: 30, opacity: 0, duration: .8, stagger: .12, ease: 'power2.out', scrollTrigger: { trigger: '.equipo .row', start: 'top 82%', once: true } });
    gsap.from('.articulo', { y: 30, opacity: 0, duration: .8, stagger: .12, ease: 'power2.out', scrollTrigger: { trigger: '.recursos .row', start: 'top 82%', once: true } });
  }

  /* 9. ARRANQUE */
  function iniciar() {
    if (MODO === 'publicacion') raiz.classList.add('modo-publicacion');
    prepararWhatsApp();
    prepararNavegacion();
    prepararDirectorio();
    prepararPrivacidad();
    prepararFormulario();
    $$('[data-anio]').forEach((el) => { el.textContent = new Date().getFullYear(); });
    animar();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
