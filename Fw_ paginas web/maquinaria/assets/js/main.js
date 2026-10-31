/*
 * Rasante (demostración) — interacciones del sitio.
 * Lee window.SITE (config.js), window.CATALOGO (catalogo.js) y window.CREDITOS (credits.js).
 * Bloques: 1 utilidades · 2 modo y datos de la empresa · 3 WhatsApp · 4 catálogo · 5 placa y carrusel del hero
 *          6 visor de fotos · 7 formulario · 8 navegación · 9 animaciones (GSAP) · 10 medición
 */
(function () {
  'use strict';

  var SITE = window.SITE || {};
  var CAT = window.CATALOGO || { categorias: [], equipos: [] };
  var CREDITOS = window.CREDITOS || [];
  var contacto = SITE.contacto || {};
  var REVISION = SITE.modo !== 'publicacion';
  var MOVIMIENTO = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Utilidades ------------------------------------------------------- */
  function $(sel, raiz) { return (raiz || document).querySelector(sel); }
  function $$(sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); }

  // Crea un elemento; los hijos de texto siempre van como texto (nunca HTML).
  function el(tag, attrs) {
    var nodo = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'class') nodo.className = v;
      else if (k === 'text') nodo.textContent = v;
      else nodo.setAttribute(k, v === true ? '' : v);
    });
    for (var i = 2; i < arguments.length; i++) {
      var hijo = arguments[i];
      if (hijo === null || hijo === undefined || hijo === false) continue;
      nodo.appendChild(typeof hijo === 'string' ? document.createTextNode(hijo) : hijo);
    }
    return nodo;
  }
  function icono(nombre) { return el('i', { class: 'bi ' + nombre, 'aria-hidden': 'true' }); }
  function pendiente(texto) { return el('span', { class: 'pending-tag', text: texto || 'Por confirmar' }); }

  function isSafeHttpsUrl(url) {
    try { return new URL(url).protocol === 'https:'; } catch (e) { return false; }
  }

  var avisoTimer;
  function avisar(texto) {
    var caja = $('#aviso-flotante');
    caja.textContent = texto;
    caja.classList.add('is-visible');
    clearTimeout(avisoTimer);
    avisoTimer = setTimeout(function () { caja.classList.remove('is-visible'); }, 5200);
  }

  function credito(clave) {
    for (var i = 0; i < CREDITOS.length; i++) {
      if (CREDITOS[i].grupo + '/' + CREDITOS[i].slot === clave) return CREDITOS[i];
    }
    return null;
  }

  function categoria(id) {
    for (var i = 0; i < CAT.categorias.length; i++) if (CAT.categorias[i].id === id) return CAT.categorias[i];
    return null;
  }
  function equipo(id) {
    for (var i = 0; i < CAT.equipos.length; i++) if (CAT.equipos[i].id === id) return CAT.equipos[i];
    return null;
  }

  // En publicación solo se muestran los equipos confirmados.
  var EQUIPOS = CAT.equipos.filter(function (e) { return REVISION || e.confirmado === true; });
  var CATEGORIAS = CAT.categorias.filter(function (c) {
    return EQUIPOS.some(function (e) { return e.cat === c.id; });
  });

  /* 2. Modo y datos de la empresa --------------------------------------- */
  document.documentElement.classList.add(REVISION ? 'modo-revision' : 'modo-publicacion');

  var telHref = (contacto.telefono || '').replace(/[^\d+]/g, '');
  var waNumero = (contacto.whatsapp || '').replace(/\D/g, '');
  if (waNumero.length < 10 || waNumero.length > 15) waNumero = '';
  var email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contacto.email || '') ? contacto.email : '';
  var lugar = [contacto.ciudad, contacto.departamento].filter(Boolean).join(', ');
  var cobertura = (SITE.cobertura || []).filter(Boolean);

  function renderTopbar() {
    var cont = $('#topbar .topbar__inner');
    var items = [];
    if (lugar) items.push(el('span', null, icono('bi-geo-alt'), lugar));
    if (cobertura.length) items.push(el('span', { class: 'topbar__secundario' }, icono('bi-map'), 'Cobertura: ' + cobertura.slice(0, 3).join(', ')));
    if (contacto.horario) items.push(el('span', { class: 'topbar__secundario' }, icono('bi-clock'), contacto.horario));
    if (contacto.telefono && telHref) items.push(el('a', { href: 'tel:' + telHref }, icono('bi-telephone'), contacto.telefono));
    if (email) items.push(el('a', { href: 'mailto:' + email, class: 'topbar__secundario' }, icono('bi-envelope'), email));
    if (!items.length) return;
    items.forEach(function (n) { cont.appendChild(n); });
    $('#topbar').hidden = false;
  }

  // Lista de datos de contacto para la sección de contacto y el pie.
  function datosContacto() {
    var d = [];
    d.push(contacto.telefono && telHref
      ? { i: 'bi-telephone', k: 'Teléfono', v: contacto.telefono, href: 'tel:' + telHref }
      : { i: 'bi-telephone', k: 'Teléfono', falta: 'Teléfono por configurar' });
    d.push(waNumero
      ? { i: 'bi-whatsapp', k: 'WhatsApp comercial', v: '+' + waNumero, href: waUrl(SITE.mensajes && SITE.mensajes.whatsappGeneral), externo: true }
      : { i: 'bi-whatsapp', k: 'WhatsApp comercial', falta: 'WhatsApp por configurar' });
    d.push(email
      ? { i: 'bi-envelope', k: 'Correo', v: email, href: 'mailto:' + email }
      : { i: 'bi-envelope', k: 'Correo', falta: 'Correo por configurar' });
    var dir = [contacto.direccion, lugar].filter(Boolean).join(', ');
    d.push(dir ? { i: 'bi-geo-alt', k: 'Ubicación', v: dir } : { i: 'bi-geo-alt', k: 'Ubicación', falta: 'Ubicación por configurar' });
    if (contacto.horario) d.push({ i: 'bi-clock', k: 'Horario', v: contacto.horario });
    return d;
  }

  function renderContacto() {
    var lista = $('#datos');
    var pie = $('#pie-datos');
    var hay = false;
    datosContacto().forEach(function (d) {
      if (d.falta) {
        if (!REVISION) return;
        lista.appendChild(el('li', null, icono(d.i), el('div', null, el('span', { text: d.k }), pendiente(d.falta))));
        return;
      }
      hay = true;
      var valor = d.href
        ? el('a', { href: d.href, target: d.externo ? '_blank' : null, rel: d.externo ? 'noopener' : null }, d.v)
        : el('strong', { text: d.v });
      lista.appendChild(el('li', null, icono(d.i), el('div', null, el('span', { text: d.k }), valor)));
      var valorPie = d.href
        ? el('a', { href: d.href, target: d.externo ? '_blank' : null, rel: d.externo ? 'noopener' : null }, d.v)
        : document.createTextNode(d.v);
      pie.appendChild(el('li', null, icono(d.i), valorPie));
    });
    if (!hay) {
      if (REVISION) pie.appendChild(el('li', null, pendiente('Datos de contacto por configurar')));
      else {
        lista.appendChild(el('li', null, icono('bi-ui-checks'), el('div', null, el('strong', { text: 'Usa el formulario para escribirnos.' }))));
        pie.appendChild(el('li', null, el('a', { href: '#contacto', text: 'Escríbenos por el formulario' })));
      }
    }

    var redes = $('#pie-redes');
    var nombres = { facebook: 'Facebook', instagram: 'Instagram', linkedin: 'LinkedIn', youtube: 'YouTube' };
    Object.keys(nombres).forEach(function (k) {
      var url = (SITE.redes || {})[k];
      if (!url || !isSafeHttpsUrl(url)) return;
      redes.appendChild(el('li', null, el('a', { href: url, target: '_blank', rel: 'noopener', 'aria-label': nombres[k] + ' (se abre en otra pestaña)' }, icono('bi-' + k))));
    });
    redes.hidden = !redes.children.length;
  }

  function renderNosotros() {
    if (SITE.experiencia) {
      var p = $('#nosotros-experiencia');
      p.textContent = SITE.experiencia;
      p.hidden = false;
    }
    var lista = $('#ventajas');
    (SITE.diferenciadores || []).forEach(function (v) {
      if (!REVISION && v.confirmado !== true) return;
      lista.appendChild(el('li', null,
        icono(v.icono || 'bi-check2-square'),
        el('strong', null, v.titulo, v.confirmado === true ? null : ' ', v.confirmado === true ? null : pendiente()),
        el('p', { text: v.texto })));
    });
    if (!lista.children.length) { lista.hidden = true; $('#diferenciadores-titulo').hidden = true; }
  }

  function renderCobertura() {
    var base = $('#cobertura-base');
    var zonas = $('#zonas');
    if (lugar) base.textContent = 'Sede en ' + lugar + '. Estas son las zonas donde atendemos obras:';
    else if (REVISION) base.appendChild(pendiente('Sede por confirmar'));
    cobertura.forEach(function (z) { zonas.appendChild(el('li', null, icono('bi-geo-alt'), z)); });
    if (!cobertura.length) {
      if (REVISION) zonas.appendChild(el('li', { class: 'zonas__pendiente' }, icono('bi-geo'), 'Zonas de operación por confirmar'));
      else if (!lugar) $('#cobertura').hidden = true;
    }
    if (cobertura.length) {
      var lista = cobertura.length > 1 ? cobertura.slice(0, -1).join(', ') + ' y ' + cobertura[cobertura.length - 1] : cobertura[0];
      $('#faq-zonas').textContent = 'Atendemos obras en ' + lista + '. Si tu obra está en otra zona, consúltanos y revisamos si podemos atenderla.';
    }
    if (email) $('#faq-correo').textContent = ', por ejemplo el correo ' + email;
  }

  /* 3. WhatsApp ------------------------------------------------------- */
  function waUrl(mensaje) {
    if (!waNumero) return '';
    return 'https://wa.me/' + waNumero + '?text=' + encodeURIComponent(mensaje || '');
  }
  function mensajeEquipo(nombre, ciudad) {
    var plantilla = (SITE.mensajes && SITE.mensajes.whatsappEquipo) || 'Hola, quiero cotizar: {equipo}{ciudad}.';
    return plantilla.replace('{equipo}', nombre).replace('{ciudad}', ciudad ? ' para una obra en ' + ciudad : '');
  }

  // Prepara un enlace o botón de WhatsApp. Sin número: en revisión avisa y lleva al formulario; en publicación se oculta.
  function prepararWa(nodo, mensaje, alternativa) {
    var etiqueta = nodo.getAttribute('data-etiqueta') || nodo.textContent.trim();
    if (waNumero) {
      if (nodo.tagName === 'A') {
        nodo.href = waUrl(mensaje);
        nodo.target = '_blank';
        nodo.rel = 'noopener';
      } else {
        nodo.addEventListener('click', function () { window.open(waUrl(typeof mensaje === 'function' ? mensaje() : mensaje), '_blank', 'noopener'); });
      }
      nodo.setAttribute('aria-label', etiqueta + ' (abre WhatsApp en otra pestaña)');
      return;
    }
    if (!REVISION) { nodo.hidden = true; return; }
    nodo.classList.add('es-pendiente');
    nodo.setAttribute('aria-label', etiqueta + ' (número de WhatsApp por configurar)');
    nodo.addEventListener('click', function (ev) {
      ev.preventDefault();
      if (alternativa) alternativa();
      avisar('WhatsApp por configurar: falta el número en assets/js/config.js. Puedes usar el formulario.');
    });
  }

  function bindWaEstaticos() {
    $$('[data-wa]').forEach(function (nodo) {
      var tema = nodo.getAttribute('data-wa');
      var cat = nodo.closest('.servicio') && $('[data-filtro]', nodo.closest('.servicio'));
      var catId = cat ? cat.getAttribute('data-filtro') : '';
      nodo.setAttribute('data-etiqueta', 'Consultar por WhatsApp: ' + tema);
      prepararWa(nodo, mensajeEquipo(tema), function () { irAlFormulario(catId ? 'cat:' + catId : ''); });
    });
    var flotante = $('#wa-flotante');
    if (waNumero || REVISION) {
      flotante.hidden = false;
      prepararWa(flotante, (SITE.mensajes && SITE.mensajes.whatsappGeneral) || '', function () { irAlFormulario(''); });
      // Mientras el hero (con su propio botón de WhatsApp) está a la vista, el flotante se retira.
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (en) {
          var visible = en[0].isIntersecting;
          flotante.classList.toggle('is-oculto', visible);
          if (visible) flotante.setAttribute('tabindex', '-1'); else flotante.removeAttribute('tabindex');
        }, { threshold: 0.05 }).observe($('#inicio'));
      }
    }
  }

  /* 4. Catálogo -------------------------------------------------------- */
  var estado = { cat: 'todos', completo: false };
  var LIMITE_TODOS = 12;
  var tarjetasVisibles = [];

  // En «Toda la maquinaria» se intercalan categorías para que los primeros equipos sean variados.
  function ordenTodos() {
    var colas = CATEGORIAS.map(function (c) { return EQUIPOS.filter(function (e) { return e.cat === c.id; }); });
    var salida = [];
    var hay = true;
    while (hay) {
      hay = false;
      colas.forEach(function (cola) { if (cola.length) { salida.push(cola.shift()); hay = true; } });
    }
    return salida;
  }

  function fotoEquipo(e) {
    var c = credito('catalogo/' + e.id);
    return {
      src: 'assets/img/catalogo/' + e.id + '-640.webp',
      grande: 'assets/img/catalogo/' + e.id + '-1280.webp',
      alt: c ? c.alt : e.nombre,
      credito: c
    };
  }

  function tarjeta(e) {
    var f = fotoEquipo(e);
    var cat = categoria(e.cat);
    var botonFoto = !f.credito
      ? el('div', { class: 'equipo__foto equipo__foto--pendiente' }, icono('bi-camera'), el('span', { text: 'Foto por confirmar' }))
      : el('button', { class: 'equipo__foto', type: 'button', 'aria-label': 'Ampliar foto: ' + e.nombre },
      el('img', {
        src: f.src, srcset: f.src + ' 640w, ' + f.grande + ' 1280w',
        sizes: '(min-width: 992px) 31vw, (min-width: 576px) 46vw, 92vw',
        width: '640', height: '480', loading: 'lazy', decoding: 'async', alt: f.alt
      }),
      el('span', { class: 'equipo__lupa', 'aria-hidden': 'true' }, icono('bi-arrows-angle-expand')));
    if (f.credito) {
      botonFoto.addEventListener('click', function () {
        var items = itemsCatalogo();
        var i = items.map(function (it) { return it.equipo.id; }).indexOf(e.id);
        abrirVisor(items, i, botonFoto);
      });
    }

    var specs = null;
    if (e.specs && e.specs.length) {
      specs = el('ul', { class: 'equipo__specs' });
      e.specs.forEach(function (s) { specs.appendChild(el('li', { text: s })); });
    } else if (REVISION) {
      specs = el('p', { class: 'equipo__pendiente' }, pendiente('Especificaciones y disponibilidad por confirmar'));
    }

    return el('article', { class: 'equipo', 'data-cat': e.cat },
      botonFoto,
      el('div', { class: 'equipo__cuerpo' },
        el('p', { class: 'equipo__cat', text: cat ? cat.nombre : '' }),
        el('h3', { class: 'equipo__nombre', text: e.nombre }),
        el('p', { class: 'equipo__uso', text: e.uso }),
        specs,
        accionesEquipo(e)));
  }

  function accionesEquipo(e) {
    var info = el('a', { class: 'btn btn-linea btn-sm', href: '#formulario', 'aria-label': 'Solicitar información: ' + e.nombre }, 'Solicitar información');
    info.addEventListener('click', function (ev) { ev.preventDefault(); cerrarVisor(); irAlFormulario(e.id); });
    var wa = el('a', { class: 'btn btn-whatsapp btn-sm', href: '#formulario', 'data-etiqueta': 'Cotizar por WhatsApp: ' + e.nombre },
      icono('bi-whatsapp'), 'Cotizar por WhatsApp');
    prepararWa(wa, mensajeEquipo(e.nombre), function () { cerrarVisor(); irAlFormulario(e.id); });
    return el('div', { class: 'equipo__acciones' }, info, wa);
  }

  function itemsCatalogo() {
    return tarjetasVisibles.filter(function (e) { return fotoEquipo(e).credito; }).map(function (e) {
      var f = fotoEquipo(e);
      return { src: f.grande, alt: f.alt, titulo: e.nombre, credito: f.credito, equipo: e };
    });
  }

  function renderFiltros() {
    var cont = $('#filtros');
    var opciones = [{ id: 'todos', nombre: 'Toda la maquinaria', n: EQUIPOS.length }].concat(CATEGORIAS.map(function (c) {
      return { id: c.id, nombre: c.nombre, n: EQUIPOS.filter(function (e) { return e.cat === c.id; }).length };
    }));
    opciones.forEach(function (o) {
      var b = el('button', { class: 'filtro', type: 'button', 'data-cat': o.id, 'aria-pressed': o.id === estado.cat ? 'true' : 'false' },
        o.nombre, el('small', { text: String(o.n) }));
      b.addEventListener('click', function () { filtrar(o.id, false); });
      cont.appendChild(b);
    });
    if (opciones.length <= 2) cont.hidden = true; // con una sola categoría el filtro no aporta
  }

  function renderCatalogo(animar) {
    var grid = $('#catalogo-grid');
    var lista = estado.cat === 'todos' ? ordenTodos() : EQUIPOS.filter(function (e) { return e.cat === estado.cat; });
    var total = lista.length;
    if (estado.cat === 'todos' && !estado.completo) lista = lista.slice(0, LIMITE_TODOS);
    tarjetasVisibles = lista;
    grid.textContent = '';

    if (!total) {
      grid.appendChild(el('div', { class: 'catalogo__vacio' },
        el('p', null, el('strong', { text: 'Estamos preparando el catálogo de equipos.' })),
        el('p', { text: 'Cuéntanos qué equipo necesitas y te respondemos con disponibilidad y condiciones.' }),
        el('a', { class: 'btn btn-obra', href: '#formulario', text: 'Solicitar información' })));
    }
    lista.forEach(function (e) { grid.appendChild(tarjeta(e)); });

    var mas = $('#catalogo-mas');
    var restantes = total - lista.length;
    mas.hidden = restantes <= 0;
    mas.textContent = 'Mostrar los ' + restantes + ' equipos restantes';

    var cat = categoria(estado.cat);
    $('#catalogo-estado').textContent = 'Mostrando ' + lista.length + ' de ' + total + ' equipos' + (cat ? ' de ' + cat.nombre : '') + '.';

    if (animar && window.gsap && MOVIMIENTO) {
      window.gsap.from(grid.children, { opacity: 0, y: 18, duration: .45, stagger: .04, ease: 'power2.out', clearProps: 'all' });
    }
  }

  function filtrar(cat, desplazar) {
    estado.cat = cat;
    estado.completo = false;
    $$('#filtros .filtro').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-cat') === cat ? 'true' : 'false'); });
    renderCatalogo(true);
    if (desplazar) {
      var destino = $('#equipos');
      destino.scrollIntoView({ behavior: MOVIMIENTO ? 'smooth' : 'auto' });
    }
  }

  function bindCatalogo() {
    $('#catalogo-mas').addEventListener('click', function () {
      var antes = tarjetasVisibles.length;
      estado.completo = true;
      renderCatalogo(false);
      var siguiente = $$('#catalogo-grid .equipo')[antes];
      if (siguiente) $('.equipo__foto', siguiente).focus();
    });
    $$('[data-filtro]').forEach(function (a) {
      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        filtrar(a.getAttribute('data-filtro'), true);
      });
    });
  }

  // Índice bajo el hero y lista del pie: categorías con su número de equipos.
  function renderIndices() {
    var indice = $('#indice');
    var pie = $('#pie-categorias');
    CATEGORIAS.forEach(function (c) {
      var n = EQUIPOS.filter(function (e) { return e.cat === c.id; }).length;
      var a = el('a', { href: '#equipos', 'data-filtro': c.id }, c.nombre,
        el('span', { class: 'indice__cuenta', text: n + (n === 1 ? ' equipo' : ' equipos') }));
      indice.appendChild(el('li', null, a));
      pie.appendChild(el('li', null, el('a', { href: '#equipos', 'data-filtro': c.id, text: c.nombre })));
    });
    if (!CATEGORIAS.length) indice.closest('.indice').hidden = true;
  }

  /* 5. Placa del hero ------------------------------------------------- */
  function opcionesEquipos(select, catId, incluirCategorias) {
    select.textContent = '';
    if (incluirCategorias) {
      select.appendChild(el('option', { value: '', text: 'Selecciona una opción' }));
      CATEGORIAS.forEach(function (c) {
        var grupo = el('optgroup', { label: c.nombre });
        grupo.appendChild(el('option', { value: 'cat:' + c.id, text: c.nombre + ': varios equipos o no estoy seguro' }));
        EQUIPOS.filter(function (e) { return e.cat === c.id; }).forEach(function (e) {
          grupo.appendChild(el('option', { value: e.id, text: e.nombre }));
        });
        select.appendChild(grupo);
      });
      select.appendChild(el('option', { value: 'otro', text: 'Otro equipo o servicio' }));
      return;
    }
    select.appendChild(el('option', { value: 'cat:' + catId, text: 'Aún no sé qué equipo necesito' }));
    EQUIPOS.filter(function (e) { return e.cat === catId; }).forEach(function (e) {
      select.appendChild(el('option', { value: e.id, text: e.nombre }));
    });
  }

  function nombreTipo(valor) {
    if (!valor) return '';
    if (valor === 'otro') return 'Otro equipo o servicio';
    if (valor.indexOf('cat:') === 0) {
      var c = categoria(valor.slice(4));
      return c ? c.nombre : valor;
    }
    var e = equipo(valor);
    return e ? e.nombre : valor;
  }

  function bindPlaca() {
    var form = $('#placa');
    if (!CATEGORIAS.length) { form.hidden = true; return; }
    var chips = $('#placa-categorias');
    var select = $('#placa-equipo');
    CATEGORIAS.forEach(function (c, i) {
      var input = el('input', { type: 'radio', name: 'placa-cat', value: c.id, id: 'placa-cat-' + c.id, checked: i === 0 });
      input.addEventListener('change', function () { opcionesEquipos(select, c.id, false); });
      chips.appendChild(el('label', { class: 'chip', for: 'placa-cat-' + c.id }, input, el('span', { text: c.nombre })));
    });
    opcionesEquipos(select, CATEGORIAS[0].id, false);

    function seleccion() {
      return { tipo: select.value, ciudad: $('#placa-ciudad').value.trim() };
    }
    var wa = $('#placa-wa');
    wa.setAttribute('data-etiqueta', 'Cotizar por WhatsApp el equipo seleccionado');
    prepararWa(wa, function () {
      var s = seleccion();
      return mensajeEquipo(nombreTipo(s.tipo), s.ciudad);
    }, function () { var s = seleccion(); irAlFormulario(s.tipo, s.ciudad); });

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var s = seleccion();
      irAlFormulario(s.tipo, s.ciudad);
    });
  }

  // Carrusel de portada: fundido entre las fotos de .hero__media cada INTERVALO ms.
  // Con movimiento reducido no avanza solo; siempre se puede pausar y elegir foto.
  function bindCarrusel() {
    var slides = $$('#hero-media .hero__slide');
    var controles = $('#hero-controles');
    if (slides.length < 2) { controles.hidden = true; return; }
    var INTERVALO = 6000;
    var actual = 0;
    var timer = null;
    var pausado = !MOVIMIENTO;
    var botonPausa = $('#hero-pausa');
    var puntos = slides.map(function (img, i) {
      var b = el('button', { class: 'hero__punto', type: 'button', 'aria-label': 'Foto ' + (i + 1) + ' de ' + slides.length, 'aria-current': i === 0 ? 'true' : 'false' });
      b.addEventListener('click', function () { ir(i); reiniciar(); });
      $('#hero-puntos').appendChild(b);
      return b;
    });

    function cargar(img) {
      if (!img.getAttribute('data-src')) return;
      img.srcset = img.getAttribute('data-srcset');
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
    }
    function ir(i) {
      cargar(slides[i]);
      slides[actual].classList.remove('is-activa');
      puntos[actual].setAttribute('aria-current', 'false');
      actual = (i + slides.length) % slides.length;
      slides[actual].classList.add('is-activa');
      puntos[actual].setAttribute('aria-current', 'true');
      cargar(slides[(actual + 1) % slides.length]); // la siguiente queda lista antes de mostrarse
    }
    function reiniciar() {
      clearInterval(timer);
      if (!pausado && !document.hidden) timer = setInterval(function () { ir(actual + 1); }, INTERVALO);
    }
    function pintarPausa() {
      botonPausa.setAttribute('aria-pressed', pausado ? 'true' : 'false');
      $('i', botonPausa).className = 'bi ' + (pausado ? 'bi-play-fill' : 'bi-pause-fill');
      $('.visually-hidden', botonPausa).textContent = pausado ? 'Reanudar fotos' : 'Pausar fotos';
    }
    botonPausa.addEventListener('click', function () { pausado = !pausado; pintarPausa(); reiniciar(); });
    document.addEventListener('visibilitychange', reiniciar);
    // Las demás fotos se piden cuando la página terminó de cargar: no compiten con la portada.
    function precargar() { cargar(slides[1]); }
    if (document.readyState === 'complete') precargar(); else window.addEventListener('load', precargar);
    pintarPausa();
    reiniciar();
  }

  /* 6. Visor de fotos ------------------------------------------------- */
  var visor = { items: [], i: 0, origen: null };

  function textoCredito(c) {
    if (!c) return null;
    var frag = document.createDocumentFragment();
    frag.appendChild(document.createTextNode('Foto de referencia: ' + c.autor + ', '));
    frag.appendChild(el('a', { href: c.licenciaUrl, target: '_blank', rel: 'noopener license', text: c.licencia }));
    frag.appendChild(document.createTextNode(', vía '));
    frag.appendChild(el('a', { href: c.fuente, target: '_blank', rel: 'noopener', text: 'Wikimedia Commons' }));
    frag.appendChild(document.createTextNode('. No corresponde a equipos de la empresa.'));
    return frag;
  }

  function mostrarVisor() {
    var it = visor.items[visor.i];
    var img = $('#visor-img');
    img.src = it.src;
    img.alt = it.alt || it.titulo;
    $('#visor-titulo').textContent = it.titulo;
    $('#visor-contador').textContent = (visor.i + 1) + ' de ' + visor.items.length;
    var cred = $('#visor-credito');
    cred.textContent = '';
    var t = textoCredito(it.credito);
    if (t) cred.appendChild(t);
    var acciones = $('#visor-acciones');
    acciones.textContent = '';
    if (it.equipo) acciones.appendChild(accionesEquipo(it.equipo));
    var unico = visor.items.length < 2;
    $('#visor-prev').hidden = unico;
    $('#visor-next').hidden = unico;
    // precarga de las vecinas
    [visor.i - 1, visor.i + 1].forEach(function (j) {
      var v = visor.items[(j + visor.items.length) % visor.items.length];
      if (v) { var pre = new Image(); pre.src = v.src; }
    });
  }

  function abrirVisor(items, i, origen) {
    var dlg = $('#visor');
    if (!dlg.showModal) { window.open(items[i].src, '_blank', 'noopener'); return; }
    visor.items = items; visor.i = i; visor.origen = origen;
    mostrarVisor();
    dlg.showModal();
    $('#visor-cerrar').focus();
  }
  function cerrarVisor() {
    var dlg = $('#visor');
    if (dlg.open) dlg.close();
  }
  function moverVisor(paso) {
    visor.i = (visor.i + paso + visor.items.length) % visor.items.length;
    mostrarVisor();
  }

  function bindVisor() {
    var dlg = $('#visor');
    $('#visor-cerrar').addEventListener('click', cerrarVisor);
    $('#visor-prev').addEventListener('click', function () { moverVisor(-1); });
    $('#visor-next').addEventListener('click', function () { moverVisor(1); });
    dlg.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowLeft') { ev.preventDefault(); moverVisor(-1); }
      if (ev.key === 'ArrowRight') { ev.preventDefault(); moverVisor(1); }
    });
    dlg.addEventListener('click', function (ev) { if (ev.target === dlg || ev.target.classList.contains('visor__figura')) cerrarVisor(); });
    dlg.addEventListener('close', function () {
      if (visor.origen && document.contains(visor.origen)) visor.origen.focus();
    });

    // Galería de proyectos (botones estáticos con data-visor).
    var botones = $$('[data-visor="proyectos"]');
    var items = botones.map(function (b) {
      var img = $('img', b);
      return { src: b.getAttribute('data-src'), alt: img.alt, titulo: b.getAttribute('data-titulo'), credito: credito(img.getAttribute('data-foto')) };
    });
    botones.forEach(function (b, i) {
      b.setAttribute('aria-label', 'Ampliar foto: ' + b.getAttribute('data-titulo'));
      b.addEventListener('click', function () { abrirVisor(items, i, b); });
    });
  }

  /* 7. Formulario ----------------------------------------------------- */
  var form = $('#formulario');
  var intentado = false;

  function irAlFormulario(tipo, ciudad) {
    var select = $('#f-tipo');
    if (tipo && $('option[value="' + tipo + '"]', select)) select.value = tipo;
    if (ciudad) $('#f-ciudad').value = ciudad;
    if (tipo) avisar('Seleccionado en el formulario: ' + nombreTipo(tipo) + '.');
    form.scrollIntoView({ behavior: MOVIMIENTO ? 'smooth' : 'auto', block: 'start' });
    var primero = $('#f-nombre');
    setTimeout(function () { primero.focus({ preventScroll: true }); }, MOVIMIENTO ? 500 : 0);
  }

  var reglas = {
    nombre: function (v) { return v.length < 3 ? 'Escribe tu nombre (mínimo 3 caracteres).' : ''; },
    empresa: function (v) { return v.length < 2 ? 'Escribe el nombre de la empresa o «Independiente».' : ''; },
    telefono: function (v) {
      if (!v) return 'Escribe un teléfono de contacto.';
      var digitos = v.replace(/\D/g, '');
      return !/^[+\d\s().-]+$/.test(v) || digitos.length < 7 || digitos.length > 15
        ? 'Revisa el teléfono: usa solo números (7 a 15 dígitos), por ejemplo 300 123 4567.' : '';
    },
    correo: function (v) { return v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? 'Revisa el correo: debe tener la forma nombre@empresa.com.' : ''; },
    tipo: function (v) { return v ? '' : 'Elige el servicio o equipo que necesitas.'; },
    ciudad: function (v) { return v.length < 3 ? 'Escribe la ciudad o municipio de la obra.' : ''; },
    necesidad: function (v) { return v.length < 20 ? 'Describe la necesidad con al menos 20 caracteres (llevas ' + v.length + ').' : ''; },
    autorizacion: function (v, campo) { return campo.checked ? '' : 'Debes autorizar el tratamiento de datos para enviar la solicitud.'; }
  };

  function validarCampo(campo) {
    var regla = reglas[campo.name];
    if (!regla) return true;
    var msg = regla(campo.value.trim(), campo);
    var error = $('#' + campo.id + '-error');
    campo.classList.toggle('is-invalid', !!msg);
    campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (error) error.textContent = msg;
    return !msg;
  }

  function datosFormulario() {
    var d = {};
    ['nombre', 'empresa', 'telefono', 'correo', 'tipo', 'ciudad', 'necesidad'].forEach(function (k) { d[k] = form.elements[k].value.trim(); });
    d.tipoNombre = nombreTipo(d.tipo);
    return d;
  }

  function mensajeSolicitud(d) {
    return 'Hola, quiero solicitar una cotización.\n' +
      'Nombre: ' + d.nombre + '\nEmpresa: ' + d.empresa + '\nTeléfono: ' + d.telefono +
      (d.correo ? '\nCorreo: ' + d.correo : '') +
      '\nServicio o equipo: ' + d.tipoNombre + '\nCiudad de la obra: ' + d.ciudad + '\nNecesidad: ' + d.necesidad;
  }

  function resumen(d) {
    var dl = el('dl');
    [['Nombre', d.nombre], ['Empresa', d.empresa], ['Teléfono', d.telefono], ['Correo', d.correo || 'No indicado'],
      ['Servicio o equipo', d.tipoNombre], ['Ciudad', d.ciudad], ['Necesidad', d.necesidad]].forEach(function (par) {
      dl.appendChild(el('dt', { text: par[0] }));
      dl.appendChild(el('dd', { text: par[1] }));
    });
    return dl;
  }

  function mostrarResultado(tipo, titulo, parrafos, d, acciones) {
    $('#aviso-flotante').classList.remove('is-visible');
    var caja = $('#resultado');
    caja.className = 'resultado resultado--' + tipo;
    caja.textContent = '';
    var iconos = { ok: 'bi-check-circle-fill', aviso: 'bi-exclamation-triangle-fill', error: 'bi-x-octagon-fill' };
    caja.appendChild(el('h3', null, icono(iconos[tipo]), titulo));
    parrafos.forEach(function (p) { caja.appendChild(el('p', { text: p })); });
    if (d) caja.appendChild(resumen(d));
    if (acciones && acciones.length) {
      var cont = el('div', { class: 'acciones' });
      acciones.forEach(function (a) { cont.appendChild(a); });
      caja.appendChild(cont);
    }
    caja.hidden = false;
    caja.setAttribute('role', tipo === 'error' ? 'alert' : 'status');
    caja.focus();
  }

  function accionesAlternativas(d) {
    var lista = [];
    if (waNumero) {
      lista.push(el('a', { class: 'btn btn-whatsapp', href: waUrl(mensajeSolicitud(d)), target: '_blank', rel: 'noopener' },
        icono('bi-whatsapp'), 'Enviar por WhatsApp'));
    }
    if (navigator.clipboard) {
      var copiar = el('button', { class: 'btn btn-linea', type: 'button' }, icono('bi-clipboard'), 'Copiar solicitud');
      copiar.addEventListener('click', function () {
        navigator.clipboard.writeText(mensajeSolicitud(d)).then(function () { avisar('Solicitud copiada al portapapeles.'); },
          function () { avisar('No se pudo copiar: selecciona el texto del resumen.'); });
      });
      lista.push(copiar);
    }
    return lista;
  }

  function bindFormulario() {
    opcionesEquipos($('#f-tipo'), null, true);
    var endpoint = isSafeHttpsUrl(SITE.formEndpoint) ? SITE.formEndpoint : '';
    if (!endpoint) {
      var aviso = $('#form-conexion');
      aviso.textContent = REVISION
        ? 'Modo demostración: el formulario valida los datos pero todavía no envía nada (falta configurar formEndpoint en config.js).'
        : 'Este formulario todavía no envía solicitudes en línea. Al completarlo podrás ' + (waNumero ? 'enviarlo por WhatsApp o ' : '') + 'copiar el texto de tu solicitud.';
      aviso.hidden = false;
    }

    $$('input, select, textarea', form).forEach(function (campo) {
      var evento = campo.type === 'checkbox' || campo.tagName === 'SELECT' ? 'change' : 'blur';
      campo.addEventListener(evento, function () { if (intentado) validarCampo(campo); });
      campo.addEventListener('input', function () { if (intentado && campo.classList.contains('is-invalid')) validarCampo(campo); });
    });

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      intentado = true;
      var campos = $$('input, select, textarea', form).filter(function (c) { return reglas[c.name]; });
      var invalidos = campos.filter(function (c) { return !validarCampo(c); });
      if (invalidos.length) {
        $('#resultado').hidden = true;
        invalidos[0].focus();
        avisar(invalidos.length === 1 ? 'Hay 1 campo por corregir.' : 'Hay ' + invalidos.length + ' campos por corregir.');
        return;
      }
      var d = datosFormulario();
      if (!endpoint) {
        mostrarResultado('aviso', 'Solicitud lista, pero no enviada', [
          'Este formulario todavía no está conectado al correo ni al sistema de la empresa, así que tus datos no salieron de este navegador.',
          waNumero ? 'Puedes enviarla por WhatsApp con un clic o copiar el texto.' : 'Puedes copiar el texto de la solicitud para enviarlo por otro medio.'
        ], d, accionesAlternativas(d));
        return;
      }
      var boton = $('#f-enviar');
      boton.disabled = true;
      boton.textContent = 'Enviando…';
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.assign({ origen: location.href, fecha: new Date().toISOString() }, d))
      }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        mostrarResultado('ok', 'Solicitud enviada', ['Recibimos tu solicitud. Te contactaremos al teléfono o correo que indicaste.'], d, []);
        form.reset();
        intentado = false;
      }).catch(function () {
        mostrarResultado('error', 'No se pudo enviar la solicitud', [
          'El servidor no respondió. Tus datos siguen en el formulario: inténtalo de nuevo en unos minutos' + (waNumero ? ' o envíala por WhatsApp.' : '.')
        ], d, accionesAlternativas(d));
      }).then(function () {
        boton.disabled = false;
        boton.textContent = 'Enviar solicitud';
      });
    });
  }

  /* 8. Navegación ----------------------------------------------------- */
  function bindNavegacion() {
    var menu = $('#menu');
    $$('a[href^="#"]', menu).forEach(function (a) {
      a.addEventListener('click', function () {
        var oc = window.bootstrap && window.bootstrap.Offcanvas.getInstance(menu);
        if (oc) oc.hide();
      });
    });
    // Sección activa en el menú.
    var enlaces = $$('.menu .nav-link');
    var mapa = {};
    enlaces.forEach(function (a) { mapa[a.getAttribute('href').slice(1)] = a; });
    if (!('IntersectionObserver' in window)) return;
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id === 'proceso' || en.target.id === 'cobertura' || en.target.id === 'preguntas' ? 'nosotros' : en.target.id;
        enlaces.forEach(function (a) { a.classList.remove('is-activo'); a.removeAttribute('aria-current'); });
        if (mapa[id]) { mapa[id].classList.add('is-activo'); mapa[id].setAttribute('aria-current', 'location'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main > section[id]').forEach(function (s) { obs.observe(s); });
  }

  // Texto alternativo de respaldo para imágenes estáticas (tools/seo.py ya lo escribe en el HTML).
  // Una imagen sin crédito registrado aún no tiene archivo: se retira en vez de mostrarse rota.
  function completarAlts() {
    $$('img[data-foto]').forEach(function (img) {
      var c = credito(img.getAttribute('data-foto'));
      if (!c) {
        var fig = img.closest('.nosotros__foto');
        if (fig) { fig.hidden = true; fig.parentNode.classList.add('sin-foto'); }
        img.remove();
        return;
      }
      if (!img.alt) img.alt = c.alt;
    });
  }

  /* 9. Animaciones (GSAP) --------------------------------------------- */
  // Opcionales: sin GSAP o con movimiento reducido, todo el contenido queda visible y estático.
  function animar() {
    var gsap = window.gsap;
    if (!gsap || !MOVIMIENTO) return;
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero__slide.is-activa', { scale: 1.06, duration: 1.8, ease: 'power2.out' }, 0)
      .from('.hero__titulo', { y: 36, opacity: 0, duration: .8 }, .15)
      .from('.hero__lead', { y: 24, opacity: 0, duration: .7 }, .3)
      .from('.hero__acciones .btn', { y: 16, opacity: 0, duration: .5, stagger: .08 }, .45)
      .from('.placa', { y: 30, opacity: 0, duration: .8 }, .55)
      .from('.indice__lista li', { opacity: 0, duration: .4, stagger: .05 }, .7);

    if (!window.ScrollTrigger) return;
    gsap.registerPlugin(window.ScrollTrigger);

    // Las fotos de servicios se descubren de lado, como al retirar una lona.
    $$('.servicio__foto').forEach(function (fig, i) {
      var desde = fig.closest('.servicio--invertido') ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)';
      gsap.fromTo(fig, { clipPath: desde }, {
        clipPath: 'inset(0 0% 0 0%)', duration: 1.1, ease: 'power3.inOut',
        scrollTrigger: { trigger: fig, start: 'top 82%', once: true }
      });
      gsap.from($('img', fig), { scale: 1.12, duration: 1.4, ease: 'power2.out', scrollTrigger: { trigger: fig, start: 'top 82%', once: true } });
    });

    // La línea central de la vía avanza con el scroll; cada abscisa aparece al llegar.
    var via = $('#via');
    via.style.setProperty('--avance', 0);
    gsap.to(via, {
      '--avance': 1, ease: 'none',
      scrollTrigger: { trigger: via, start: 'top 80%', end: 'bottom 55%', scrub: .6 }
    });
    gsap.from('.via__paso', {
      opacity: 0, y: 20, duration: .6, stagger: .15, ease: 'power2.out',
      scrollTrigger: { trigger: via, start: 'top 75%', once: true }
    });
  }

  /* 10. Medición (GA4 con consentimiento) ---------------------------- */
  function medicion() {
    var id = (SITE.analytics || {}).ga4 || '';
    if (!/^G-[A-Z0-9]{4,}$/.test(id)) return; // sin ID válido no se carga nada
    var CLAVE = 'rasante.v1.consentimiento';
    var guardado = null;
    try { guardado = localStorage.getItem(CLAVE); } catch (e) { /* almacenamiento bloqueado */ }
    function cargar() {
      var s = el('script', { src: 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id), async: true });
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', id, { anonymize_ip: true });
    }
    if (guardado === 'si') { cargar(); return; }
    if (guardado === 'no') return;
    var banner = $('#consentimiento');
    banner.hidden = false;
    $$('[data-consentimiento]', banner).forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-consentimiento');
        try { localStorage.setItem(CLAVE, v); } catch (e) { /* sin persistencia */ }
        banner.hidden = true;
        if (v === 'si') cargar();
      });
    });
  }

  /* Arranque ---------------------------------------------------------- */
  $('#anio').textContent = String(new Date().getFullYear());
  completarAlts();
  renderTopbar();
  renderContacto();
  renderNosotros();
  renderCobertura();
  renderIndices();
  renderFiltros();
  renderCatalogo(false);
  bindCatalogo();
  bindFormulario();
  bindPlaca();
  bindCarrusel();
  bindWaEstaticos();
  bindVisor();
  bindNavegacion();
  animar();
  medicion();
})();
