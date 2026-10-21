/* Estiba — catálogo, selector de necesidades, filtros, galería y formulario.
   Script clásico (sin módulos) para que funcione también abriendo el archivo directamente. */
(function () {
  'use strict';

  /* ======================================================
     1. CONFIGURACIÓN — lo único que se edita para un cliente
     ====================================================== */
  const CONFIG = {
    // 'revision' muestra avisos y elementos «Por confirmar»; 'publicacion' los oculta.
    modo: 'revision',

    whatsapp: {
      // Número de EJEMPLO (código de país + número, sin «+» ni espacios).
      // Reemplazar por el número autorizado y poner esEjemplo en false.
      // Mientras esEjemplo sea true, el botón NO abre WhatsApp: muestra un aviso.
      numero: '573001234567',
      esEjemplo: true,
      mensaje: 'Hola, quiero cotizar un sistema de racks para mi bodega.'
    },

    // URL que recibe el formulario por POST (JSON). Vacía = formulario sin conectar.
    formEndpoint: '',

    // Texto opcional sobre el tiempo de respuesta, solo si el proveedor lo garantiza.
    // Ejemplo: 'Respondemos en un día hábil.'  Vacío = no se muestra.
    tiempoRespuesta: '',

    contacto: { telefono: '', correo: '', direccion: '', horario: '' }
  };

  // Sistemas del catálogo: la letra coincide con la loseta de cada tarjeta.
  const SISTEMAS = {
    A: { nombre: 'Rack selectivo', id: 'sistema-selectivo' },
    B: { nombre: 'Drive-in y drive-through', id: 'sistema-drivein' },
    C: { nombre: 'Rack dinámico', id: 'sistema-dinamico' },
    D: { nombre: 'Cantilever', id: 'sistema-cantilever' },
    E: { nombre: 'Estantería liviana', id: 'sistema-liviana' },
    F: { nombre: 'Estantería semipesada', id: 'sistema-semipesada' },
    G: { nombre: 'Rack para carga pesada', id: 'sistema-pesada' }
  };

  // Recomendaciones ORIENTATIVAS del selector. Editar según el portafolio real.
  const NECESIDADES = {
    pallets: {
      titulo: 'Muchos pallets que mover y ubicar',
      texto: 'Cuando la carga llega y sale en pallets, el sistema depende sobre todo de cuántas referencias manejas y de cómo rotan.',
      recs: [
        { c: 'A', por: 'Si tienes muchas referencias y necesitas llegar a cualquier pallet.' },
        { c: 'B', por: 'Si son pocas referencias con muchos pallets de cada una.' },
        { c: 'C', por: 'Si debe salir primero lo que entró primero.' }
      ],
      revisar: ['Peso y medidas del pallet', 'Altura de elevación del montacargas', 'Número de referencias y rotación']
    },
    pesada: {
      titulo: 'Carga pesada o materias primas',
      texto: 'Con cargas de alto peso la prioridad es la estructura: perfiles, refuerzos, anclaje y protección contra impactos.',
      recs: [
        { c: 'G', por: 'Bastidores y largueros reforzados para cargas concentradas.' },
        { c: 'A', por: 'Selectivo dimensionado para el peso real, si la carga es paletizada y variada.' }
      ],
      revisar: ['Peso real por posición, no el estimado', 'Estado y espesor del piso', 'Equipo de manejo: montacargas o puente grúa']
    },
    largos: {
      titulo: 'Tubos, perfiles, láminas o madera',
      texto: 'Los materiales largos necesitan apoyos sin obstáculos al frente para cargarse de lado y no deformarse.',
      recs: [
        { c: 'D', por: 'Brazos en voladizo a una o dos caras, según el espacio y el acceso.' }
      ],
      revisar: ['Longitud máxima del material', 'Peso por metro lineal', 'Si se carga a mano o con montacargas']
    },
    vertical: {
      titulo: 'Cajas y piezas que se toman a mano',
      texto: 'Para preparación de pedidos y repuestos conviene que cada referencia quede a la altura de trabajo y bien identificada.',
      recs: [
        { c: 'F', por: 'Picking con muchas referencias y rotación alta.' },
        { c: 'E', por: 'Productos de bajo peso, archivo o inventarios pequeños.' },
        { c: 'C', por: 'Cajas que deben salir en orden de llegada.' }
      ],
      revisar: ['Peso de la caja más pesada', 'Cantidad de referencias', 'Si se necesitará un segundo nivel con pasarela']
    },
    altura: {
      titulo: 'Una bodega alta con el piso lleno',
      texto: 'Si la mercancía ocupa el piso y sobra altura, el crecimiento está hacia arriba: más niveles de rack o un entrepiso.',
      recs: [
        { c: 'A', por: 'Racks de mayor altura si tienes montacargas con alcance suficiente.' },
        { c: 'B', por: 'Alta densidad cuando el volumen por referencia es grande.' },
        { c: null, nombre: 'Entrepiso o mezzanine', por: 'Para operación manual: una plataforma intermedia duplica la superficie útil. Se cotiza a la medida.' }
      ],
      revisar: ['Altura libre bajo la cubierta y obstáculos (luminarias, rociadores)', 'Alcance del montacargas', 'Capacidad del piso']
    }
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
  const soloDigitos = (v) => String(v || '').replace(/\D/g, '');

  function whatsappUrl(texto) {
    const n = soloDigitos(CONFIG.whatsapp.numero);
    if (!n || CONFIG.whatsapp.esEjemplo) return '';
    return 'https://wa.me/' + n + '?text=' + encodeURIComponent(texto);
  }

  function irA(target) {
    const destino = typeof target === 'string' ? $(target) : target;
    if (!destino) return;
    destino.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
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
     3. MODO Y DATOS DE CONTACTO
     ====================================================== */
  function initModo() {
    document.documentElement.setAttribute('data-modo', esRevision ? 'revision' : 'publicacion');
    $('#review-bar').hidden = !esRevision;
    $('#year').textContent = String(new Date().getFullYear());
    const rt = $('#response-time');
    if (rt) rt.textContent = CONFIG.tiempoRespuesta;
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
     4. NAVEGACIÓN
     ====================================================== */
  function initNav() {
    const collapse = $('#nav-principal');
    $$('#nav-principal a:not(.dropdown-toggle)').forEach((a) => a.addEventListener('click', () => {
      if (collapse.classList.contains('show') && window.bootstrap) window.bootstrap.Collapse.getOrCreateInstance(collapse).hide();
    }));
  }

  /* ======================================================
     5. CATÁLOGO: FILTROS Y RESALTADO
     ====================================================== */
  const catalogo = { aplicar: null };

  function initFiltros() {
    const chips = $$('.chip[data-filter]');
    const cards = $$('.sys-card:not([data-always])');
    const count = $('#filter-count');
    const vacio = $('#catalog-empty');

    function aplicar(filtro) {
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === filtro)));
      let visibles = 0;
      cards.forEach((card) => {
        const ok = filtro === 'todos' || card.dataset.cat.split(' ').includes(filtro);
        card.hidden = !ok;
        if (ok) visibles += 1;
      });
      count.textContent = visibles === cards.length ? cards.length + ' sistemas' : 'Mostrando ' + visibles + ' de ' + cards.length + ' sistemas';
      vacio.hidden = visibles > 0;
      if (!reduceMotion && window.gsap) {
        window.gsap.fromTo(cards.filter((c) => !c.hidden), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .35, stagger: .05, ease: 'power2.out', clearProps: 'transform' });
      }
    }
    chips.forEach((c) => c.addEventListener('click', () => aplicar(c.dataset.filter)));
    $$('[data-filter-reset]').forEach((b) => b.addEventListener('click', () => aplicar('todos')));
    catalogo.aplicar = aplicar;
  }

  function resaltarSistema(codigo) {
    const s = SISTEMAS[codigo];
    if (!s) return;
    const card = $('#' + s.id);
    if (card.hidden && catalogo.aplicar) catalogo.aplicar('todos');
    $$('.sys-card.is-highlight').forEach((c) => c.classList.remove('is-highlight'));
    card.classList.add('is-highlight');
    irA(card);
    const boton = $('.btn-quote-sys', card);
    setTimeout(() => boton.focus({ preventScroll: true }), reduceMotion ? 0 : 600);
    setTimeout(() => card.classList.remove('is-highlight'), 4000);
  }

  /* ======================================================
     6. SELECTOR DE NECESIDADES
     ====================================================== */
  function initSelector() {
    const botones = $$('.need-btn');
    const vacio = $('#need-empty');
    const contenido = $('#need-content');

    function mostrar(clave, desplazar) {
      const n = NECESIDADES[clave];
      if (!n) return;
      botones.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.need === clave)));
      

      const recs = el('ul', { class: 'need-recs' });
      n.recs.forEach((r) => {
        const nombre = r.c ? SISTEMAS[r.c].nombre : r.nombre;
        const tile = el('span', { class: 'tile', 'aria-hidden': 'true', text: r.c || '+' });
        const texto = el('span', { class: 'rec-text' }, [el('strong', { text: nombre }), el('small', { text: r.por })]);
        const link = r.c
          ? el('a', { href: '#' + SISTEMAS[r.c].id, 'data-rec': r.c }, [tile, texto, el('i', { class: 'bi bi-chevron-down', 'aria-hidden': 'true' })])
          : el('a', { href: '#propuesta', 'data-quote-free': nombre }, [tile, texto, el('i', { class: 'bi bi-pencil-square', 'aria-hidden': 'true' })]);
        recs.append(el('li', {}, [link]));
      });
      const revisar = el('ul', { class: 'need-check' });
      n.revisar.forEach((t) => revisar.append(el('li', { text: t })));

      contenido.replaceChildren(
        el('h3', { text: n.titulo }),
        el('p', { text: n.texto }),
        el('p', { class: 'need-label', text: 'Sistemas que conviene evaluar' }),
        recs,
        el('p', { class: 'need-label', text: 'Datos que definen la elección' }),
        revisar,
        el('a', { class: 'btn btn-primary-ind', href: '#propuesta', 'data-from-need': n.titulo }, ['Cotizar con esta necesidad'])
      );
      vacio.hidden = true;
      contenido.hidden = false;

      $$('[data-rec]', contenido).forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); resaltarSistema(a.dataset.rec); }));
      $$('[data-from-need]', contenido).forEach((a) => a.addEventListener('click', () => { $('#f-necesidad').value = a.dataset.fromNeed; }));
      $$('[data-quote-free]', contenido).forEach((a) => a.addEventListener('click', () => preseleccionar(a.dataset.quoteFree)));

      if (!reduceMotion && window.gsap) {
        window.gsap.fromTo(contenido.children, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .4, stagger: .05, ease: 'power2.out' });
      }
      if (desplazar) irA('#selector');
    }

    botones.forEach((b) => b.addEventListener('click', () => mostrar(b.dataset.need, false)));
    // Se muestra un ejemplo desde el inicio para que el panel no quede vacío.
    mostrar('pallets', false);
    // Accesos rápidos del hero: preseleccionan la necesidad.
    $$('[data-need-link]').forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      mostrar(a.dataset.needLink, true);
    }));
  }

  /* ======================================================
     7. PRESELECCIÓN DEL FORMULARIO DESDE EL CATÁLOGO
     ====================================================== */
  function preseleccionar(texto) {
    const select = $('#f-sistema');
    const opcion = $$('option', select).find((o) => o.textContent === texto);
    if (!opcion) return;
    select.value = opcion.value || opcion.textContent;
    select.classList.add('is-prefilled');
  }

  function initCotizarSistema() {
    $$('.btn-quote-sys').forEach((b) => b.addEventListener('click', () => {
      preseleccionar(b.dataset.quote);
      irA('#propuesta');
      setTimeout(() => $('#f-nombre').focus({ preventScroll: true }), reduceMotion ? 0 : 700);
    }));
    $('#f-sistema').addEventListener('change', (e) => e.target.classList.remove('is-prefilled'));
  }

  /* ======================================================
     8. GALERÍA (desplazamiento con botones y teclado)
     ====================================================== */
  function initGaleria() {
    const track = $('#gallery-track');
    const prev = $('[data-gal="prev"]');
    const next = $('[data-gal="next"]');
    const paso = () => ($('.gal-item', track).getBoundingClientRect().width + 16);
    const actualizar = () => {
      prev.disabled = track.scrollLeft < 8;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    };
    prev.addEventListener('click', () => track.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    track.addEventListener('scroll', actualizar, { passive: true });
    window.addEventListener('resize', actualizar);
    actualizar();
  }

  /* ======================================================
     9. BARRA DE ACCIÓN Y WHATSAPP
     ====================================================== */
  function initBarraAccion() {
    const bar = $('#action-bar');
    const hero = $('#inicio');
    const form = $('#propuesta');
    let pasoHero = false;
    let enForm = false;
    const pintar = () => bar.classList.toggle('is-visible', pasoHero && !enForm);
    if (!('IntersectionObserver' in window)) { bar.classList.add('is-visible'); return; }
    new IntersectionObserver(([e]) => { pasoHero = !e.isIntersecting; pintar(); }).observe(hero);
    new IntersectionObserver(([e]) => { enForm = e.isIntersecting; pintar(); }, { threshold: .15 }).observe(form);
  }

  function initWhatsapp() {
    const btn = $('#wa-btn');
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
        aviso('<strong>WhatsApp por configurar.</strong> El número actual es de ejemplo: edita <code>CONFIG.whatsapp</code> en js/main.js. Mientras tanto, usa el <a href="#propuesta">formulario</a>.');
      });
    }
  }

  /* ======================================================
     10. FORMULARIO
     ====================================================== */
  function initForm() {
    const form = $('#quote-form');
    const status = $('#form-status');
    const submit = $('button[type="submit"]', form);
    const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    const reglas = {
      nombre: (v) => v.trim().length >= 2 || 'Escribe tu nombre.',
      correo: (v) => (!v.trim() ? 'Escribe tu correo para enviarte la propuesta.' : emailOk(v.trim()) || 'Revisa el correo: debe tener la forma nombre@empresa.com.'),
      telefono: (v) => (soloDigitos(v).length >= 7) || 'Escribe un teléfono de al menos 7 dígitos.',
      autorizacion: (_, i) => i.checked || 'Necesitamos tu autorización para enviarte la propuesta.'
    };
    function validar(input) {
      const regla = reglas[input.name];
      if (!regla) return true;
      const r = regla(input.value, input);
      const err = $('#e-' + (input.name === 'autorizacion' ? 'datos' : input.name));
      if (r === true) { input.removeAttribute('aria-invalid'); err.hidden = true; err.textContent = ''; return true; }
      input.setAttribute('aria-invalid', 'true');
      err.hidden = false;
      err.textContent = r;
      return false;
    }
    $$('input, textarea', form).forEach((i) => {
      i.addEventListener('blur', () => { if (i.value || i.hasAttribute('aria-invalid')) validar(i); });
      i.addEventListener('input', () => { if (i.hasAttribute('aria-invalid')) validar(i); });
    });
    const setStatus = (tipo, html) => { status.className = 'form-status is-' + tipo; status.innerHTML = html; };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const invalidos = $$('input, textarea, select', form).filter((c) => !validar(c));
      if (invalidos.length) {
        setStatus('error', 'Revisa ' + (invalidos.length === 1 ? 'el campo marcado' : 'los ' + invalidos.length + ' campos marcados') + '.');
        invalidos[0].focus();
        return;
      }
      const datos = Object.fromEntries(new FormData(form).entries());
      datos.autorizacion = true;
      datos.origen = 'landing-2-almacenamiento';

      if (!CONFIG.formEndpoint) {
        const resumen = 'Hola, soy ' + datos.nombre + (datos.empresa ? ' de ' + datos.empresa : '') + '. Me interesa: ' + (datos.sistema || 'asesoría para elegir un sistema') + '. ' + (datos.mensaje || '');
        const wa = whatsappUrl(resumen);
        setStatus('info', '<strong>Tu solicitud no se envió:</strong> el formulario aún no está conectado a un sistema de recepción. ' +
          (wa ? 'Puedes enviarla por <a href="' + wa + '" target="_blank" rel="noopener">WhatsApp</a>.' : 'Para activarlo, configura <code>CONFIG.formEndpoint</code> en js/main.js.'));
        return;
      }
      const texto = submit.textContent;
      submit.disabled = true;
      submit.setAttribute('aria-busy', 'true');
      submit.textContent = 'Enviando…';
      setStatus('info', 'Enviando tu solicitud…');
      try {
        const resp = await fetch(CONFIG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(datos) });
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        form.reset();
        $('#f-sistema').classList.remove('is-prefilled');
        setStatus('success', '<strong>Solicitud enviada.</strong> Te contactaremos para precisar los datos de tu bodega.');
      } catch (err) {
        setStatus('error', 'No pudimos enviar la solicitud. Inténtalo de nuevo en unos minutos.');
      } finally {
        submit.disabled = false;
        submit.removeAttribute('aria-busy');
        submit.textContent = texto;
      }
    });
  }

  /* ======================================================
     11. ANIMACIONES (opt-in; sin GSAP todo queda visible)
     ====================================================== */
  function initAnimaciones() {
    const gsap = window.gsap;
    if (!gsap || reduceMotion) return;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    // Entrada del hero: titular y foto; los accesos rápidos suben al final.
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('[data-hero]', { y: 24, opacity: 0, duration: .8, stagger: .12 })
      .from('[data-hero-photo]', { clipPath: 'inset(0 0 0 100%)', duration: 1.1, ease: 'power3.inOut' }, .15)
      .from('.quick-needs li', { y: 16, opacity: 0, duration: .45, stagger: .06 }, .7);

    if (!window.ScrollTrigger) return;
    // Las losetas del catálogo «se encienden» al entrar, como señales de pasillo.
    gsap.from('.sys-media .tile', { scale: .4, opacity: 0, duration: .5, stagger: .06, ease: 'back.out(2)', scrollTrigger: { trigger: '#catalog-grid', start: 'top 80%', once: true } });
    gsap.from('.gal-item', { x: 60, opacity: 0, duration: .8, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '#gallery-track', start: 'top 85%', once: true } });
  }

  /* ======================================================
     12. ARRANQUE
     ====================================================== */
  function init() {
    initModo();
    renderContacto();
    initNav();
    initFiltros();
    initSelector();
    initCotizarSistema();
    initGaleria();
    initBarraAccion();
    initWhatsapp();
    initForm();
    initAnimaciones();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
