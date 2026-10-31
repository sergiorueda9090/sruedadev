/* Alquieventos: catálogo con filtros, solicitud de cotización (cantidades
 * guardadas en sessionStorage) y envío por WhatsApp. Depende de main.js (window.EV).
 * Sin este archivo el catálogo se ve completo y cada «Cotizar» lleva al contacto. */
(function () {
  'use strict';

  var EV = window.EV;
  var sitio = EV.sitio() || {};
  var CLAVE = 'alquieventos.solicitud.v1';
  var MAX_CANTIDAD = 9999;

  var NOMBRE_CATEGORIA = { carpas: 'Carpas', mesas: 'Mesas', sillas: 'Sillas', tarimas: 'Tarimas', mobiliario: 'Mobiliario' };

  /* ---------- Catálogo leído del HTML ---------- */
  var tarjetas = Array.prototype.slice.call(document.querySelectorAll('[data-producto]'));
  var catalogo = {};
  tarjetas.forEach(function (li) {
    var img = li.querySelector('img');
    catalogo[li.getAttribute('data-producto')] = {
      nombre: li.querySelector('.producto-nombre').textContent.trim(),
      categoria: li.getAttribute('data-categoria'),
      foto: img ? img.getAttribute('src') : ''
    };
  });

  /* ---------- Estado de la solicitud ---------- */
  var solicitud = leer();

  function leer() {
    var mapa = new Map();
    try {
      var datos = JSON.parse(window.sessionStorage.getItem(CLAVE) || '[]');
      if (Array.isArray(datos)) {
        datos.forEach(function (par) {
          var id = Array.isArray(par) ? par[0] : null;
          var n = Array.isArray(par) ? Number(par[1]) : 0;
          if (catalogo[id] && Number.isInteger(n) && n >= 1 && n <= MAX_CANTIDAD) mapa.set(id, n);
        });
      }
    } catch (e) { /* sessionStorage no disponible o dato corrupto: se empieza vacío */ }
    return mapa;
  }

  function guardar() {
    try { window.sessionStorage.setItem(CLAVE, JSON.stringify(Array.from(solicitud.entries()))); } catch (e) { /* modo privado */ }
  }

  var anuncio = document.querySelector('[data-anuncio]');
  function anunciar(texto) {
    if (!anuncio) return;
    anuncio.textContent = '';
    window.setTimeout(function () { anuncio.textContent = texto; }, 30);
  }

  function fijarCantidad(id, cantidad, avisar) {
    var anterior = solicitud.get(id) || 0;
    var n = Math.max(0, Math.min(MAX_CANTIDAD, Math.round(cantidad) || 0));
    if (n === 0) solicitud.delete(id);
    else solicitud.set(id, n);
    guardar();
    actualizarTodo();
    if (avisar !== false) {
      var nombre = catalogo[id].nombre;
      if (n === 0) anunciar(nombre + ' se quitó de la solicitud.');
      else if (anterior === 0) anunciar(nombre + ' se agregó a la solicitud.');
      else anunciar(nombre + ': ' + n + ' unidades.');
    }
    if (anterior === 0 && n > 0) latirContador();
  }

  /* ---------- Controles de cantidad ---------- */
  function crearSelectorCantidad(id, prefijo) {
    var nombre = catalogo[id].nombre;
    var caja = document.createElement('div');
    caja.className = 'cantidad';

    var menos = document.createElement('button');
    menos.type = 'button';
    menos.className = 'cantidad-boton';
    menos.setAttribute('data-paso', '-1');
    menos.setAttribute('aria-label', 'Restar una unidad de ' + nombre);
    menos.innerHTML = '<i class="bi bi-dash" aria-hidden="true"></i>';

    var campo = document.createElement('input');
    campo.type = 'number';
    campo.inputMode = 'numeric';
    campo.min = '1';
    campo.max = String(MAX_CANTIDAD);
    campo.className = 'cantidad-campo';
    campo.id = prefijo + '-cant-' + id;
    campo.setAttribute('aria-label', 'Cantidad de ' + nombre);

    var mas = document.createElement('button');
    mas.type = 'button';
    mas.className = 'cantidad-boton';
    mas.setAttribute('data-paso', '1');
    mas.setAttribute('aria-label', 'Sumar una unidad de ' + nombre);
    mas.innerHTML = '<i class="bi bi-plus" aria-hidden="true"></i>';

    caja.addEventListener('click', function (e) {
      var boton = e.target.closest('[data-paso]');
      if (!boton) return;
      fijarCantidad(id, (solicitud.get(id) || 0) + Number(boton.getAttribute('data-paso')));
    });
    campo.addEventListener('change', function () {
      var n = parseInt(campo.value, 10);
      fijarCantidad(id, n >= 1 ? n : 1);
    });

    caja.appendChild(menos);
    caja.appendChild(campo);
    caja.appendChild(mas);
    return caja;
  }

  function sincronizarCantidad(caja, id) {
    var campo = caja.querySelector('.cantidad-campo');
    var n = solicitud.get(id) || 0;
    if (document.activeElement !== campo || Number(campo.value) !== n) campo.value = n;
  }

  /* Tarjeta del catálogo: botón «Cotizar» o selector de cantidad. */
  function actualizarTarjeta(li) {
    var id = li.getAttribute('data-producto');
    var accion = li.querySelector('[data-accion]');
    var enSolicitud = solicitud.has(id);
    li.classList.toggle('is-seleccionado', enSolicitud);
    var selector = accion.querySelector('.cantidad');
    var boton = accion.querySelector('[data-agregar]');
    if (enSolicitud) {
      if (!selector) {
        selector = crearSelectorCantidad(id, 'cat');
        var etiqueta = document.createElement('span');
        etiqueta.className = 'producto-en-lista';
        etiqueta.innerHTML = '<i class="bi bi-check2" aria-hidden="true"></i> En tu solicitud';
        accion.appendChild(etiqueta);
        accion.appendChild(selector);
        var teniaFoco = boton && document.activeElement === boton;
        if (boton) boton.hidden = true;
        if (teniaFoco) selector.querySelector('.cantidad-campo').focus();
      }
      sincronizarCantidad(selector, id);
    } else if (selector) {
      var foco = accion.contains(document.activeElement);
      selector.remove();
      var e = accion.querySelector('.producto-en-lista');
      if (e) e.remove();
      boton.hidden = false;
      if (foco) boton.focus();
    }
  }

  /* Listas de la solicitud (panel, formulario y resumen). Se actualizan por
   * filas para no perder el foco del control que se está usando. */
  function actualizarLista(contenedor) {
    var tipo = contenedor.getAttribute('data-lista-solicitud');
    var editable = tipo !== 'resumen';
    var vacio = contenedor.querySelector('.lista-vacia');
    var ul = contenedor.querySelector('ul');

    if (!solicitud.size) {
      if (ul) ul.remove();
      if (!vacio) {
        vacio = document.createElement('div');
        vacio.className = 'lista-vacia';
        vacio.innerHTML = editable
          ? '<p>Aún no has agregado productos.</p><a href="#catalogo" data-cerrar-panel>Explorar el catálogo</a>'
          : '<p>Tu lista está vacía. Agrega productos desde el catálogo.</p>';
        contenedor.appendChild(vacio);
      }
      return;
    }
    if (vacio) vacio.remove();
    if (!ul) {
      ul = document.createElement('ul');
      ul.className = 'lista-items';
      contenedor.appendChild(ul);
    }

    Array.prototype.slice.call(ul.children).forEach(function (fila) {
      if (!solicitud.has(fila.getAttribute('data-id'))) {
        var conFoco = fila.contains(document.activeElement);
        fila.remove();
        if (conFoco) {
          var siguiente = ul.querySelector('button, input');
          (siguiente || contenedor.closest('.offcanvas, form, aside') || document.body).focus();
        }
      }
    });

    solicitud.forEach(function (cantidad, id) {
      var fila = ul.querySelector('[data-id="' + id + '"]');
      if (!fila) {
        fila = document.createElement('li');
        fila.className = 'lista-item';
        fila.setAttribute('data-id', id);
        var p = catalogo[id];
        var img = document.createElement('img');
        img.src = p.foto;
        img.alt = '';
        img.width = 64;
        img.height = 48;
        img.loading = 'lazy';
        var texto = document.createElement('div');
        texto.className = 'lista-texto';
        texto.innerHTML = '<span class="lista-nombre"></span><span class="lista-cat"></span>';
        texto.querySelector('.lista-nombre').textContent = p.nombre;
        texto.querySelector('.lista-cat').textContent = NOMBRE_CATEGORIA[p.categoria];
        fila.appendChild(img);
        fila.appendChild(texto);
        if (editable) {
          fila.appendChild(crearSelectorCantidad(id, tipo));
          var quitar = document.createElement('button');
          quitar.type = 'button';
          quitar.className = 'lista-quitar';
          quitar.setAttribute('aria-label', 'Quitar ' + p.nombre + ' de la solicitud');
          quitar.innerHTML = '<i class="bi bi-x-lg" aria-hidden="true"></i>';
          quitar.addEventListener('click', function () { fijarCantidad(id, 0); });
          fila.appendChild(quitar);
        } else {
          var cant = document.createElement('span');
          cant.className = 'lista-cant';
          fila.appendChild(cant);
        }
        ul.appendChild(fila);
      }
      if (editable) sincronizarCantidad(fila.querySelector('.cantidad'), id);
      else fila.querySelector('.lista-cant').textContent = '× ' + cantidad;
    });
  }

  var contador = document.querySelector('[data-contador-num]');
  function actualizarTodo() {
    tarjetas.forEach(actualizarTarjeta);
    document.querySelectorAll('[data-lista-solicitud]').forEach(actualizarLista);
    if (contador) contador.textContent = solicitud.size;
    document.querySelectorAll('[data-vaciar]').forEach(function (b) { b.hidden = !solicitud.size; });
    var error = document.getElementById('ae-productos-error');
    if (error && solicitud.size) error.textContent = '';
  }

  function latirContador() {
    var caja = document.querySelector('[data-contador]');
    if (!caja || !EV.puedeAnimar()) return;
    window.gsap.fromTo(caja, { scale: 1.45 }, { scale: 1, duration: .5, ease: 'back.out(3)' });
  }

  /* ---------- Filtros ---------- */
  var botonesFiltro = document.querySelectorAll('[data-filtro]');
  var conteo = document.querySelector('[data-conteo]');
  var filtroAnimado = false;

  function filtrar(categoria) {
    var visibles = [];
    tarjetas.forEach(function (li) {
      var mostrar = categoria === 'todos' || li.getAttribute('data-categoria') === categoria;
      li.hidden = !mostrar;
      if (mostrar) visibles.push(li);
    });
    botonesFiltro.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-filtro') === categoria));
    });
    if (conteo) {
      conteo.textContent = categoria === 'todos'
        ? 'Mostrando los ' + visibles.length + ' productos'
        : 'Mostrando ' + visibles.length + ' de ' + tarjetas.length + ' productos: ' + NOMBRE_CATEGORIA[categoria];
    }
    if (filtroAnimado && EV.puedeAnimar()) {
      window.gsap.fromTo(visibles, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .45, stagger: .04, ease: 'power2.out', overwrite: true });
    }
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  botonesFiltro.forEach(function (b) {
    b.addEventListener('click', function () {
      filtroAnimado = true;
      filtrar(b.getAttribute('data-filtro'));
    });
  });
  document.querySelectorAll('[data-ir-categoria]').forEach(function (a) {
    a.addEventListener('click', function () {
      filtroAnimado = true;
      filtrar(a.getAttribute('data-ir-categoria'));
    });
  });

  /* Botón «Cotizar» de cada tarjeta: agrega una unidad sin salir del catálogo. */
  tarjetas.forEach(function (li) {
    li.querySelector('[data-agregar]').addEventListener('click', function (e) {
      e.preventDefault();
      fijarCantidad(li.getAttribute('data-producto'), 1);
    });
  });

  /* ---------- Panel lateral ---------- */
  var panel = document.getElementById('panel-solicitud');
  document.addEventListener('click', function (e) {
    var enlace = e.target.closest('[data-cerrar-panel]');
    if (!enlace || !panel || !panel.contains(enlace) || !window.bootstrap) return;
    e.preventDefault();
    var destino = document.querySelector(enlace.getAttribute('href'));
    panel.addEventListener('hidden.bs.offcanvas', function () {
      if (!destino) return;
      destino.scrollIntoView({ behavior: EV.puedeAnimar() ? 'smooth' : 'auto' });
      var primerCampo = destino.querySelector('input:not([type="hidden"]), button');
      if (primerCampo) primerCampo.focus({ preventScroll: true });
    }, { once: true });
    window.bootstrap.Offcanvas.getOrCreateInstance(panel).hide();
  });
  document.querySelectorAll('[data-vaciar]').forEach(function (b) {
    b.addEventListener('click', function () {
      solicitud.clear();
      guardar();
      actualizarTodo();
      anunciar('La solicitud quedó vacía.');
    });
  });

  /* ---------- Formulario ---------- */
  var form = document.getElementById('form-cotizacion');
  var resumenFecha = document.querySelector('[data-resumen-fecha]');

  if (form) {
    form.elements.fecha.min = EV.hoyISO();
    form.elements.fecha.addEventListener('change', function () {
      var legible = EV.fechaLegible(form.elements.fecha.value);
      resumenFecha.textContent = legible ? 'Para el ' + legible : 'Sin fecha definida';
    });

    var reglas = {
      nombre: function (v) { return v.length < 2 ? 'Escribe tu nombre.' : ''; },
      telefono: function (v) {
        if (!v) return 'Escribe un teléfono de contacto.';
        return EV.telefonoValido(v) ? '' : 'Revisa el teléfono: debe tener 10 dígitos, por ejemplo 300 123 4567.';
      },
      fecha: function (v) {
        if (!v) return 'Elige la fecha del evento.';
        return v < EV.hoyISO() ? 'La fecha del evento no puede ser anterior a hoy.' : '';
      },
      tipo: function (v) { return v ? '' : 'Elige el tipo de evento.'; },
      lugar: function (v) { return v.length < 5 ? 'Escribe el lugar de entrega (dirección o nombre del lugar y municipio).' : ''; },
      comentarios: function (v) { return v.length > 600 ? 'Los comentarios admiten hasta 600 caracteres.' : ''; }
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var estado = form.querySelector('[data-estado]');
      estado.className = 'form-estado';
      estado.textContent = '';

      var camposOk = EV.validar(form, reglas);
      var errorProductos = document.getElementById('ae-productos-error');
      errorProductos.textContent = solicitud.size ? '' : 'Agrega al menos un producto del catálogo.';
      if (camposOk && !solicitud.size) {
        var irCatalogo = form.querySelector('.lista-vacia a');
        if (irCatalogo) irCatalogo.focus();
      }
      if (!camposOk || !solicitud.size) {
        estado.className = 'form-estado is-error';
        estado.textContent = 'Revisa los datos marcados para preparar la solicitud.';
        return;
      }

      var d = form.elements;
      var lineas = [
        'Hola, Alquieventos. Quiero cotizar este alquiler:',
        '',
        '- Nombre: ' + d.nombre.value.trim(),
        '- Teléfono: ' + d.telefono.value.trim(),
        '- Fecha del evento: ' + EV.fechaLegible(d.fecha.value),
        '- Lugar de entrega: ' + d.lugar.value.trim(),
        '- Tipo de evento: ' + d.tipo.value,
        '',
        'Productos:'
      ];
      solicitud.forEach(function (n, id) { lineas.push('- ' + n + ' x ' + catalogo[id].nombre); });
      if (d.comentarios.value.trim()) lineas.push('', 'Comentarios: ' + d.comentarios.value.trim());
      d.productos.value = Array.from(solicitud.entries()).map(function (p) { return p[1] + ' x ' + catalogo[p[0]].nombre; }).join('; ');

      EV.entregarPorWhatsApp(estado, sitio.whatsapp, lineas.join('\n'));
    });
    EV.revalidarAlEditar(form, reglas);
  }

  /* ---------- Animaciones ---------- */
  function animar() {
    if (!EV.prepararGsap()) return;
    var gsap = window.gsap;

    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero-foto', { clipPath: 'inset(0 0 0 100%)', duration: 1.2, ease: 'power4.inOut' }, 0)
      .from('.hero-zona', { autoAlpha: 0, y: 12, duration: .6 }, .3)
      .from('.hero-titulo', { autoAlpha: 0, y: 26, duration: .8 }, .4)
      .from('.hero-sub, .hero-acciones', { autoAlpha: 0, y: 16, duration: .6, stagger: .1 }, .6)
      .from('.hero-atajos a', { autoAlpha: 0, y: 10, duration: .4, stagger: .06 }, .85);

    if (!window.ScrollTrigger) return;

    /* Tarjetas del catálogo: entran en tandas al llegar a ellas (solo la primera vez). */
    gsap.set(tarjetas, { autoAlpha: 0, y: 28 });
    window.ScrollTrigger.batch(tarjetas, {
      start: 'top 92%',
      once: true,
      onEnter: function (lote) {
        gsap.to(lote, { autoAlpha: 1, y: 0, duration: .6, stagger: .07, ease: 'power3.out', overwrite: true });
      }
    });

    [['.categoria', '.categorias-lista'], ['.montaje', '.montajes-grilla'], ['.pasos-ae li', '.pasos-ae'], ['.beneficios-lista li', '.beneficios-lista']].forEach(function (par) {
      gsap.from(par[0], {
        autoAlpha: 0, y: 24, duration: .6, stagger: .08, ease: 'power2.out',
        scrollTrigger: { trigger: par[1], start: 'top 85%', once: true }
      });
    });
  }

  filtrar('todos');
  actualizarTodo();
  animar();
})();
