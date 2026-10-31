/* Finca La Cruz: formulario en forma de frase → mensaje de WhatsApp, selección
 * de modalidad y animaciones. Depende de main.js (window.EV). */
(function () {
  'use strict';

  var EV = window.EV;
  var sitio = EV.sitio() || {};
  var form = document.getElementById('form-reserva');
  if (!form) return;

  /* Modalidad → opción del selector «tipo de evento» que se preselecciona. */
  var TIPO_POR_MODALIDAD = {
    'Celebración familiar': 'una reunión familiar',
    'Fiesta grande': '',
    'Jornada empresarial': 'un evento de empresa',
    'Otro tipo de evento': 'otro tipo de evento'
  };

  var campoFecha = form.elements.fecha;
  campoFecha.min = EV.hoyISO();

  var reglas = {
    nombre: function (v) { return v.length < 2 ? 'Escribe tu nombre.' : ''; },
    tipo: function (v) { return v ? '' : 'Elige el tipo de evento.'; },
    fecha: function (v) {
      if (!v) return 'Elige una fecha tentativa.';
      return v < EV.hoyISO() ? 'La fecha tentativa no puede ser anterior a hoy.' : '';
    },
    invitados: function (v) {
      var n = Number(v);
      return Number.isInteger(n) && n >= 1 && n <= 9999 ? '' : 'Escribe el número aproximado de invitados (solo números).';
    },
    telefono: function (v) {
      if (!v) return 'Escribe un teléfono de contacto.';
      return EV.telefonoValido(v) ? '' : 'Revisa el teléfono: debe tener 10 dígitos, por ejemplo 300 123 4567.';
    },
    mensaje: function (v) { return v.length > 500 ? 'El mensaje adicional admite hasta 500 caracteres.' : ''; }
  };

  function construirMensaje() {
    var d = form.elements;
    var lineas = [
      'Hola, Finca La Cruz. Quiero consultar disponibilidad.',
      '',
      '- Nombre: ' + d.nombre.value.trim(),
      '- Teléfono: ' + d.telefono.value.trim(),
      '- Tipo de evento: ' + d.tipo.value.replace(/^(un|una)\s+/, ''),
      '- Fecha tentativa: ' + EV.fechaLegible(d.fecha.value),
      '- Invitados (aprox.): ' + d.invitados.value.trim()
    ];
    if (d.modalidad.value) lineas.push('- Modalidad de interés: ' + d.modalidad.value);
    if (d.mensaje.value.trim()) lineas.push('- Mensaje: ' + d.mensaje.value.trim());
    return lineas.join('\n');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var estado = form.querySelector('[data-estado]');
    estado.className = 'form-estado';
    estado.textContent = '';
    if (!EV.validar(form, reglas)) {
      estado.className = 'form-estado is-error';
      estado.textContent = 'Revisa los datos marcados para preparar el mensaje.';
      return;
    }
    EV.entregarPorWhatsApp(estado, sitio.whatsapp, construirMensaje());
  });
  EV.revalidarAlEditar(form, reglas);

  /* El selector se ajusta al ancho de la opción elegida para no romper la frase. */
  var selectorTipo = form.elements.tipo;
  function ajustarSelector() {
    var medida = document.createElement('span');
    medida.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font:inherit';
    medida.textContent = selectorTipo.options[selectorTipo.selectedIndex].text;
    selectorTipo.parentNode.appendChild(medida);
    selectorTipo.style.width = 'calc(' + medida.offsetWidth + 'px + 1.4em)';
    medida.remove();
  }
  selectorTipo.addEventListener('change', ajustarSelector);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustarSelector);
  ajustarSelector();

  /* Botones de modalidad: anotan la modalidad, preseleccionan el tipo y llevan al formulario. */
  var chip = form.querySelector('[data-modalidad-chip]');
  function elegirModalidad(nombre) {
    form.elements.modalidad.value = nombre || '';
    chip.hidden = !nombre;
    chip.querySelector('[data-modalidad-nombre]').textContent = nombre || '';
    var tipo = nombre ? TIPO_POR_MODALIDAD[nombre] : '';
    if (tipo) { selectorTipo.value = tipo; ajustarSelector(); }
  }
  document.querySelectorAll('[data-modalidad]').forEach(function (boton) {
    boton.addEventListener('click', function (e) {
      e.preventDefault();
      elegirModalidad(boton.getAttribute('data-modalidad'));
      document.getElementById('reservar').scrollIntoView({ behavior: EV.puedeAnimar() ? 'smooth' : 'auto' });
      form.elements.nombre.focus({ preventScroll: true });
    });
  });
  chip.querySelector('[data-modalidad-quitar]').addEventListener('click', function () {
    elegirModalidad('');
    form.elements.nombre.focus();
  });

  /* Sin enlace de mapa, la fila «Mapa» desaparece en modo publicación. */
  if (!sitio.mapaUrl && EV.config.modo === 'publicacion') {
    var filaMapa = document.querySelector('[data-fila-mapa]');
    if (filaMapa) filaMapa.hidden = true;
  }

  function animar() {
    if (!EV.prepararGsap()) return;
    var gsap = window.gsap;

    /* Momento principal: el bloque de color se extiende y las fotos se descubren. */
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero-bloque', { scaleX: 0, duration: 1, ease: 'power4.inOut' })
      .from('.hero-titulo', { autoAlpha: 0, y: 30, duration: .9 }, '-=.25')
      .from('.hero-sub, .hero-acciones', { autoAlpha: 0, y: 18, duration: .7, stagger: .12 }, '-=.5')
      .from('.hero-foto', { clipPath: 'inset(100% 0 0 0)', duration: 1.2, ease: 'power4.out' }, .55)
      .from('.hero-baile', { autoAlpha: 0, y: 40, duration: .9 }, 1.1);

    if (!window.ScrollTrigger) return;

    /* Fotos con esquina curva: se descubren de abajo hacia arriba. */
    gsap.utils.toArray('.espacio-foto, .empresas-foto-a, .empresas-foto-b, .reservar-foto').forEach(function (el) {
      gsap.from(el, {
        clipPath: 'inset(100% 0 0 0)', duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
    });

    /* Grupos que entran escalonados. */
    [['.social-item', '.social-fila'], ['.m', '.mosaico'], ['.modalidad', '.modalidades-grilla'], ['.proceso-lista li', '.proceso-lista']].forEach(function (par) {
      gsap.from(par[0], {
        autoAlpha: 0, y: 36, duration: .8, stagger: .1, ease: 'power3.out',
        scrollTrigger: { trigger: par[1], start: 'top 82%', once: true }
      });
    });

    gsap.utils.toArray('.seccion .titulo-lc').forEach(function (titulo) {
      gsap.from(titulo, {
        autoAlpha: 0, x: -24, duration: .9, ease: 'power3.out',
        scrollTrigger: { trigger: titulo, start: 'top 88%', once: true }
      });
    });
  }

  animar();
})();
