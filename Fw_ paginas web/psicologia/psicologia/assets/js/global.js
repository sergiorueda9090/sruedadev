/*
 * Utilidades compartidas por las tres demos (window.PSI): datos de configuración,
 * menú móvil, enlaces de WhatsApp, formularios, aviso de privacidad y visor de
 * imágenes. Cada página añade su propio comportamiento en <marca>.js.
 * Script clásico con defer: funciona también abriendo el HTML con file://.
 */
(function () {
  'use strict';

  var doc = document.documentElement;
  var raiz = window.PSI_CONFIG || { modo: 'revision', marcas: {} };
  var marca = document.body.dataset.marca || '';
  var cfg = (raiz.marcas && raiz.marcas[marca]) || {};
  var modo = raiz.modo === 'publicacion' ? 'publicacion' : 'revision';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  doc.dataset.modo = modo;

  var PSI = window.PSI = { cfg: cfg, modo: modo, marca: marca };

  /* ---------- 1. Utilidades ---------- */

  PSI.$ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  PSI.$$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  // Las animaciones solo corren si GSAP cargó y la persona no pidió reducir movimiento.
  PSI.motionOk = function () {
    return !!(window.gsap && window.ScrollTrigger) && !reduce.matches;
  };

  // La intro del hero solo se anima si el <head> dejó los elementos ocultos a tiempo.
  PSI.heroPendiente = function () { return doc.classList.contains('anim-hero'); };
  PSI.soltarHero = function () { doc.classList.remove('anim-hero'); };

  function digitos(valor) { return String(valor || '').replace(/\D/g, ''); }

  PSI.waUrl = function (texto) {
    var numero = digitos(cfg.whatsapp);
    if (numero.length < 8 || numero.length > 15) return null;
    return 'https://wa.me/' + numero + '?text=' + encodeURIComponent(texto || cfg.mensajeWhatsapp || '');
  };

  /* ---------- 2. Menú y cabecera ---------- */

  function initMenu() {
    var boton = PSI.$('.js-menu-toggle');
    var header = PSI.$('.js-header');
    if (header) {
      var pendiente = false;
      var marcar = function () {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
        pendiente = false;
      };
      window.addEventListener('scroll', function () {
        if (!pendiente) { pendiente = true; window.requestAnimationFrame(marcar); }
      }, { passive: true });
      marcar();
    }
    if (!boton) return;
    var menu = document.getElementById(boton.getAttribute('aria-controls'));
    if (!menu) return;

    var cerrar = function (devolverFoco) {
      boton.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-abierto');
      if (devolverFoco) boton.focus();
    };
    boton.addEventListener('click', function () {
      var abrir = boton.getAttribute('aria-expanded') !== 'true';
      boton.setAttribute('aria-expanded', String(abrir));
      document.body.classList.toggle('menu-abierto', abrir);
      if (abrir) {
        var primero = menu.querySelector('a');
        if (primero) primero.focus();
      }
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) cerrar(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && boton.getAttribute('aria-expanded') === 'true') cerrar(true);
    });
    window.matchMedia('(min-width: 992px)').addEventListener('change', function (mq) {
      if (mq.matches) cerrar(false);
    });
  }

  /* ---------- 3. WhatsApp y datos de contacto ---------- */

  function initWhatsApp() {
    PSI.$$('a[data-wa]').forEach(function (enlace) {
      var url = PSI.waUrl(enlace.dataset.waMsg);
      if (url) {
        enlace.href = url;
        enlace.target = '_blank';
        enlace.rel = 'noopener';
        return;
      }
      // Sin número configurado el botón no finge abrir WhatsApp: lleva al formulario y lo dice.
      enlace.href = enlace.dataset.waFallback || '#contacto';
      enlace.classList.add('wa-off');
      var etiqueta = enlace.querySelector('[data-wa-label]');
      if (etiqueta && enlace.dataset.waOffLabel) etiqueta.textContent = enlace.dataset.waOffLabel;
      if (modo === 'revision' && !enlace.hasAttribute('data-wa-quiet')) {
        var nota = document.createElement('span');
        nota.className = 'wa-nota';
        nota.textContent = 'WhatsApp por configurar';
        enlace.appendChild(nota);
      }
    });
  }

  function initDatos() {
    PSI.$$('[data-dato]').forEach(function (el) {
      var clave = el.dataset.dato;
      var valor = String(cfg[clave] || '').trim();
      var envoltorio = el.closest('[data-dato-wrap]');
      if (!valor) {
        if (modo === 'publicacion' && envoltorio) { envoltorio.hidden = true; return; }
        el.textContent = 'Por configurar';
        el.classList.add('pendiente');
        el.removeAttribute('href');
        return;
      }
      el.textContent = valor;
      if (el.tagName === 'A') {
        if (clave === 'correo') el.href = 'mailto:' + valor;
        else if (clave === 'telefono') el.href = 'tel:+' + digitos(valor);
      }
    });

    PSI.$$('[data-dato-lista]').forEach(function (lista) {
      var valores = cfg[lista.dataset.datoLista] || [];
      var envoltorio = lista.closest('[data-dato-wrap]');
      lista.textContent = '';
      if (!valores.length) {
        if (modo === 'publicacion' && envoltorio) { envoltorio.hidden = true; return; }
        valores = ['Por configurar'];
        lista.classList.add('pendiente');
      }
      valores.forEach(function (v) {
        var li = document.createElement('li');
        li.textContent = v;
        lista.appendChild(li);
      });
    });
  }

  /* ---------- 4. Enlaces que preseleccionan el formulario ---------- */

  function initPreseleccion() {
    document.addEventListener('click', function (e) {
      var enlace = e.target.closest('[data-servicio], [data-municipio]');
      if (!enlace) return;
      [['servicio', enlace.dataset.servicio], ['municipio', enlace.dataset.municipio]].forEach(function (par) {
        if (!par[1]) return;
        var select = PSI.$('form[data-psi-form] [name="' + par[0] + '"]');
        if (!select) return;
        var existe = PSI.$$('option', select).some(function (o) { return o.value === par[1]; });
        if (existe) {
          select.value = par[1];
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    });
  }

  /* ---------- 5. Aviso de privacidad (details#privacidad en el pie) ---------- */

  function initPrivacidad() {
    var aviso = document.getElementById('privacidad');
    if (!aviso) return;
    var abrir = function () { aviso.open = true; };
    document.addEventListener('click', function (e) {
      if (e.target.closest('a[href="#privacidad"]')) abrir();
    });
    if (window.location.hash === '#privacidad') abrir();
    PSI.$$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ---------- 6. Formularios ---------- */

  var RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function revisar(campo, form) {
    var v = String(campo.value || '').trim();
    switch (campo.dataset.rule) {
      case 'nombre':
        return v.length < 2 ? 'Escribe tu nombre (al menos 2 letras).' : '';
      case 'contacto': {
        var elegido = form.querySelector('[name="via"]:checked');
        var via = elegido ? elegido.value : '';
        var n = digitos(v).length;
        var esCorreo = RE_CORREO.test(v);
        var esTel = /^[+\d\s().-]+$/.test(v) && n >= 7 && n <= 15;
        if (!v) return 'Escribe un teléfono o un correo para poder responderte.';
        if (via === 'Correo' && !esCorreo) return 'Elegiste correo: escribe una dirección válida, como nombre@correo.com.';
        if ((via === 'WhatsApp' || via === 'Llamada') && !esTel) return 'Elegiste ' + via.toLowerCase() + ': escribe un teléfono de 7 a 15 dígitos.';
        if (!esCorreo && !esTel) return 'Escribe un teléfono de 7 a 15 dígitos o un correo válido.';
        return '';
      }
      case 'requerido':
        return v ? '' : (campo.dataset.msg || 'Completa este campo.');
      case 'check':
        return campo.checked ? '' : (campo.dataset.msg || 'Marca esta casilla para continuar.');
      default:
        return '';
    }
  }

  function marcar(campo, mensaje) {
    var id = campo.id + '-error';
    var error = document.getElementById(id);
    if (!error) {
      error = document.createElement('p');
      error.className = 'campo-error';
      error.id = id;
      (campo.closest('.campo') || campo.parentNode).appendChild(error);
    }
    error.textContent = mensaje;
    error.hidden = !mensaje;
    var descritos = (campo.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
    var sinError = descritos.filter(function (d) { return d !== id; });
    if (mensaje) {
      campo.setAttribute('aria-invalid', 'true');
      campo.setAttribute('aria-describedby', sinError.concat(id).join(' '));
    } else {
      campo.removeAttribute('aria-invalid');
      if (sinError.length) campo.setAttribute('aria-describedby', sinError.join(' '));
      else campo.removeAttribute('aria-describedby');
    }
  }

  function resumen(form) {
    var datos = new FormData(form);
    var lineas = [cfg.mensajeWhatsapp || 'Hola, quisiera recibir información.', ''];
    var etiquetas = { nombre: 'Nombre', servicio: 'Servicio de interés', municipio: 'Municipio', para: 'La consulta es para', via: 'Prefiero contacto por', contacto: 'Teléfono o correo', mensaje: 'Mensaje' };
    Object.keys(etiquetas).forEach(function (k) {
      var v = String(datos.get(k) || '').trim();
      if (v) lineas.push(etiquetas[k] + ': ' + v);
    });
    return lineas.join('\n');
  }

  function estado(form, html, tipo) {
    var caja = form.querySelector('[data-estado]');
    if (!caja) return;
    caja.className = 'form-estado form-estado--' + tipo;
    caja.innerHTML = html;
    caja.hidden = false;
    caja.focus();
  }

  function respuestaDemo(form) {
    var texto = resumen(form);
    var url = PSI.waUrl(texto);
    var html = '<p><strong>Formulario demostrativo.</strong> Los datos están completos, pero no se enviaron: esta página todavía no está conectada a un servidor.</p>';
    if (url) {
      html += '<p>Puedes enviar la misma solicitud por WhatsApp; se abrirá con el mensaje listo para que lo revises.</p>' +
        '<a class="form-estado__accion" target="_blank" rel="noopener" href="' + url + '">Enviar la solicitud por WhatsApp</a>';
    } else if (RE_CORREO.test(cfg.correo || '')) {
      html += '<p>Puedes enviar la misma solicitud por correo.</p>' +
        '<a class="form-estado__accion" href="mailto:' + cfg.correo + '?subject=' + encodeURIComponent('Solicitud de información') +
        '&body=' + encodeURIComponent(texto) + '">Escribir al correo</a>';
    } else {
      html += '<p>El número de WhatsApp y el correo de esta demo también están pendientes de configuración, así que por ahora no hay un canal activo.</p>';
    }
    estado(form, html, 'demo');
  }

  function initFormularios() {
    PSI.$$('form[data-psi-form]').forEach(function (form) {
      form.noValidate = true;
      var campos = PSI.$$('[data-rule]', form);

      campos.forEach(function (campo) {
        var evento = (campo.type === 'checkbox' || campo.tagName === 'SELECT') ? 'change' : 'input';
        campo.addEventListener(evento, function () {
          if (campo.getAttribute('aria-invalid') === 'true') marcar(campo, revisar(campo, form));
        });
      });
      PSI.$$('[name="via"]', form).forEach(function (radio) {
        radio.addEventListener('change', function () {
          var contacto = form.querySelector('[data-rule="contacto"]');
          if (contacto && contacto.value.trim()) marcar(contacto, revisar(contacto, form));
          var tipo = radio.value === 'Correo' ? 'email' : 'tel';
          if (contacto) {
            contacto.setAttribute('inputmode', tipo);
            contacto.setAttribute('autocomplete', tipo === 'email' ? 'email' : 'tel');
          }
        });
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var errores = campos.filter(function (campo) {
          var msg = revisar(campo, form);
          marcar(campo, msg);
          return !!msg;
        });
        if (errores.length) {
          estado(form, '<p>Revisa ' + (errores.length === 1 ? 'el campo marcado' : 'los ' + errores.length + ' campos marcados') + ' antes de continuar.</p>', 'error');
          errores[0].focus();
          return;
        }

        var endpoint = String(cfg.formEndpoint || '');
        if (!/^https:\/\//.test(endpoint)) { respuestaDemo(form); return; }

        var boton = form.querySelector('[type="submit"]');
        var textoBoton = boton ? boton.textContent : '';
        if (boton) { boton.disabled = true; boton.textContent = 'Enviando…'; }
        fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
          .then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            form.reset();
            estado(form, '<p><strong>Solicitud enviada.</strong> El equipo te responderá por el medio que elegiste.</p>', 'ok');
          })
          .catch(function () {
            estado(form, '<p>No se pudo enviar la solicitud. Revisa tu conexión e inténtalo de nuevo.</p>', 'error');
          })
          .then(function () {
            if (boton) { boton.disabled = false; boton.textContent = textoBoton; }
          });
      });
    });
  }

  /* ---------- 7. Visor de imágenes accesible (<dialog>) ---------- */

  PSI.visor = function (botones) {
    if (!botones.length || typeof HTMLDialogElement !== 'function') return;
    var dialogo = document.createElement('dialog');
    dialogo.className = 'visor';
    dialogo.setAttribute('aria-label', 'Imagen ampliada');
    dialogo.innerHTML =
      '<figure class="visor__figura"><img alt=""><figcaption></figcaption></figure>' +
      '<button type="button" class="visor__btn visor__cerrar" aria-label="Cerrar imagen"><i class="bi bi-x-lg" aria-hidden="true"></i></button>' +
      '<button type="button" class="visor__btn visor__ant" aria-label="Imagen anterior"><i class="bi bi-arrow-left" aria-hidden="true"></i></button>' +
      '<button type="button" class="visor__btn visor__sig" aria-label="Imagen siguiente"><i class="bi bi-arrow-right" aria-hidden="true"></i></button>' +
      '<p class="visor__contador" aria-live="polite"></p>';
    document.body.appendChild(dialogo);

    var img = dialogo.querySelector('img');
    var pie = dialogo.querySelector('figcaption');
    var contador = dialogo.querySelector('.visor__contador');
    var actual = 0;
    var origen = null;

    var mostrar = function (i) {
      actual = (i + botones.length) % botones.length;
      var b = botones[actual];
      var miniatura = b.querySelector('img');
      img.src = b.dataset.grande;
      img.alt = miniatura ? miniatura.alt : '';
      img.width = Number(b.dataset.w) || 1200;
      img.height = Number(b.dataset.h) || 800;
      pie.textContent = b.dataset.pie || '';
      contador.textContent = 'Imagen ' + (actual + 1) + ' de ' + botones.length;
    };

    botones.forEach(function (b, i) {
      b.addEventListener('click', function () {
        origen = b;
        mostrar(i);
        dialogo.showModal();
      });
    });
    dialogo.querySelector('.visor__cerrar').addEventListener('click', function () { dialogo.close(); });
    dialogo.querySelector('.visor__ant').addEventListener('click', function () { mostrar(actual - 1); });
    dialogo.querySelector('.visor__sig').addEventListener('click', function () { mostrar(actual + 1); });
    dialogo.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') mostrar(actual - 1);
      if (e.key === 'ArrowRight') mostrar(actual + 1);
    });
    dialogo.addEventListener('click', function (e) { if (e.target === dialogo) dialogo.close(); });
    dialogo.addEventListener('close', function () { if (origen) origen.focus(); });
  };

  /* ---------- 8. Arranque ---------- */

  initMenu();
  initWhatsApp();
  initDatos();
  initPreseleccion();
  initPrivacidad();
  initFormularios();

  if (PSI.motionOk()) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    // Las fotos con loading="lazy" cambian la altura de la página al cargar.
    window.addEventListener('load', function () { window.ScrollTrigger.refresh(); });
  } else {
    PSI.soltarHero();
  }
})();
