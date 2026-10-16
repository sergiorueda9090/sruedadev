/* ==========================================================================
   form.js — validación y preparación de la solicitud de cotización
   La página no tiene backend: nunca se muestra «solicitud enviada» salvo que
   SITE.formEndpoint (https) responda 2xx. Sin endpoint, se prepara un mensaje
   de WhatsApp que el usuario revisa y envía, o se informa que no se envió nada.
   ========================================================================== */
(function () {
  'use strict';

  var form = document.getElementById('form-cotizacion');
  if (!form) return;

  var S = window.SITE || {};
  var H = window.Hielo || {};
  var wa = H.wa;
  var el = H.util.el;
  var icono = H.util.icono;
  var alerta = document.getElementById('form-errores');
  var resultado = document.getElementById('form-resultado');
  var TIEMPO_MAX = 15000;

  /* Opciones de tipo de hielo desde los productos visibles */
  var selTipo = form.elements.tipo;
  var asesoria = selTipo.querySelector('option[value="No estoy seguro"]');
  (H.productos || []).forEach(function (p) {
    selTipo.insertBefore(el('option', { value: p.nombre, text: p.nombre }), asesoria);
  });
  document.addEventListener('hielo:producto', function (e) {
    var existe = Array.prototype.some.call(selTipo.options, function (o) { return o.value === e.detail; });
    if (existe) { selTipo.value = e.detail; validarCampo(selTipo); }
  });

  /* Reglas */
  function soloDigitos(v) { return String(v || '').replace(/\D/g, ''); }
  function telefonoValido(v) {
    var d = soloDigitos(v);
    if (d.length === 12 && d.indexOf('57') === 0) d = d.slice(2);
    return d.length === 10 && (d[0] === '3' || d.indexOf('60') === 0);
  }
  var reglas = {
    nombre: function (v) { return v.trim().length >= 2 ? '' : 'Escribe tu nombre.'; },
    empresa: function (v) { return v.trim().length >= 2 ? '' : 'Escribe el nombre de tu empresa o negocio.'; },
    telefono: function (v) {
      if (!v.trim()) return 'Escribe un teléfono de contacto.';
      return telefonoValido(v) ? '' : 'El teléfono debe tener 10 dígitos: celular que empiece por 3 o fijo que empiece por 60.';
    },
    correo: function (v) {
      if (!v.trim()) return 'Escribe tu correo electrónico.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Revisa el correo: debe tener la forma nombre@dominio.com.';
    },
    ciudad: function (v) { return v.trim().length >= 2 ? '' : 'Indica la ciudad o municipio de entrega.'; },
    tipo: function (v) { return v ? '' : 'Elige un tipo de hielo o «No estoy seguro».'; },
    cantidad: function (v) {
      var n = Number(v);
      if (!String(v).trim()) return 'Indica una cantidad aproximada.';
      return Number.isInteger(n) && n >= 1 && n <= 1000000 ? '' : 'Escribe un número entero mayor que cero.';
    },
    frecuencia: function (v) { return v ? '' : 'Elige cada cuánto compras.'; },
    acepta: function (v, campo) { return campo.checked ? '' : 'Debes autorizar el tratamiento de datos para preparar la solicitud.'; }
  };

  function errorDe(campo) { return document.getElementById('e-' + campo.name); }

  function validarCampo(campo) {
    var regla = reglas[campo.name];
    if (!regla) return true;
    var msg = regla(campo.value, campo);
    var caja = errorDe(campo);
    campo.classList.toggle('is-invalid', !!msg);
    campo.classList.toggle('is-valid', !msg && campo.type !== 'checkbox');
    if (msg) campo.setAttribute('aria-invalid', 'true'); else campo.removeAttribute('aria-invalid');
    if (caja) caja.textContent = msg;
    return !msg;
  }

  // Valida al salir de un campo y, si ya mostraba error, mientras se corrige.
  Object.keys(reglas).forEach(function (nombre) {
    var campo = form.elements[nombre];
    campo.addEventListener('blur', function () { if (campo.value || campo.dataset.tocado) validarCampo(campo); campo.dataset.tocado = '1'; });
    campo.addEventListener(campo.tagName === 'SELECT' || campo.type === 'checkbox' ? 'change' : 'input', function () {
      if (campo.classList.contains('is-invalid') || campo.classList.contains('is-valid')) validarCampo(campo);
    });
  });

  function datos() {
    var f = form.elements;
    return {
      nombre: f.nombre.value.trim(),
      empresa: f.empresa.value.trim(),
      telefono: f.telefono.value.trim(),
      correo: f.correo.value.trim(),
      ciudad: f.ciudad.value.trim(),
      tipo: f.tipo.value,
      cantidad: f.cantidad.value.trim() + ' ' + f.unidad.value,
      frecuencia: f.frecuencia.value,
      mensaje: f.mensaje.value.trim()
    };
  }

  function mensaje(d) {
    return [
      'Hola, quiero solicitar una cotización de hielo.',
      '',
      'Nombre: ' + d.nombre,
      'Empresa o negocio: ' + d.empresa,
      'Teléfono: ' + d.telefono,
      'Correo: ' + d.correo,
      'Ciudad de entrega: ' + d.ciudad,
      'Tipo de hielo: ' + d.tipo,
      'Cantidad aproximada: ' + d.cantidad,
      'Frecuencia de compra: ' + d.frecuencia
    ].concat(d.mensaje ? ['Mensaje: ' + d.mensaje] : []).join('\n');
  }

  /* Resultado */
  function mostrar(estado, titulo, texto, msg, acciones) {
    resultado.className = 'result' + (estado ? ' is-' + estado : '');
    document.getElementById('resultado-titulo').textContent = titulo;
    document.getElementById('resultado-texto').textContent = texto;
    var pre = document.getElementById('resultado-mensaje');
    pre.textContent = msg || '';
    pre.hidden = !msg;
    var cont = document.getElementById('resultado-acciones');
    cont.textContent = '';
    (acciones || []).forEach(function (a) { cont.appendChild(a); });
    resultado.hidden = false;
    resultado.focus();
  }

  function botonCopiar(texto) {
    var b = el('button', { type: 'button', class: 'btn btn-quiet' }, [icono('clipboard'), ' Copiar resumen']);
    b.addEventListener('click', function () {
      var listo = function () { b.textContent = ''; b.appendChild(icono('check2')); b.appendChild(document.createTextNode(' Resumen copiado')); };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(texto).then(listo, function () { seleccionar(); });
      } else {
        seleccionar();
      }
    });
    function seleccionar() {
      var r = document.createRange();
      r.selectNodeContents(document.getElementById('resultado-mensaje'));
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      b.textContent = 'Resumen seleccionado: cópialo con Ctrl+C';
    }
    return b;
  }

  function botonEditar() {
    var b = el('button', { type: 'button', class: 'btn btn-quiet' }, [icono('pencil'), ' Editar datos']);
    b.addEventListener('click', function () { form.elements.nombre.focus(); });
    return b;
  }

  function enlaceWa(texto) {
    var u = wa && wa.url(texto);
    if (!u) return null;
    return el('a', { class: 'btn btn-wa', href: u, target: '_blank', rel: 'noopener' }, [icono('whatsapp'), ' Abrir WhatsApp con este mensaje']);
  }

  function endpoint() {
    var u = S.formEndpoint;
    if (typeof u !== 'string') return null;
    try { var x = new URL(u); return x.protocol === 'https:' ? x.href : null; } catch (e) { return null; }
  }

  function prepararWhatsApp(texto, titulo, intro) {
    mostrar(null, titulo || 'Revisa tu solicitud antes de enviarla',
      (intro ? intro + ' ' : '') + 'Se abrirá WhatsApp con este mensaje. No se envía nada hasta que lo confirmes allí.',
      texto, [enlaceWa(texto), botonEditar()]);
  }

  function sinCanal(texto) {
    mostrar('warning', 'Tu solicitud no se ha enviado',
      'Esta página todavía no tiene configurado un canal para recibir solicitudes, así que tus datos no salieron de tu navegador. Puedes copiar el resumen para enviarlo por otro medio.',
      texto, [botonCopiar(texto), botonEditar()]);
  }

  function enviar(url, d, texto, boton) {
    var ctrl = 'AbortController' in window ? new AbortController() : null;
    var reloj = setTimeout(function () { if (ctrl) ctrl.abort(); }, TIEMPO_MAX);
    boton.disabled = true;
    var etiqueta = boton.textContent;
    boton.textContent = 'Enviando…';
    var cuerpo = Object.assign({ formulario: 'cotizacion', pagina: location.href, enviado: new Date().toISOString(), acepta_datos: true }, d);
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      form.reset();
      Array.prototype.forEach.call(form.elements, function (c) { c.classList.remove('is-valid', 'is-invalid'); });
      mostrar('ok', 'Solicitud enviada', 'Recibimos tu solicitud. El equipo comercial te contactará por teléfono o correo.', null, []);
    }).catch(function () {
      var alt = enlaceWa(texto);
      mostrar('warning', 'No pudimos enviar la solicitud',
        'El servicio de recepción no respondió. Tus datos siguen en el formulario.' + (alt ? ' También puedes enviarla por WhatsApp.' : ''),
        texto, [alt, botonCopiar(texto)].filter(Boolean));
    }).then(function () {
      clearTimeout(reloj);
      boton.disabled = false;
      boton.textContent = etiqueta;
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var invalidos = Object.keys(reglas).map(function (n) { return form.elements[n]; }).filter(function (c) { return !validarCampo(c); });
    if (invalidos.length) {
      alerta.textContent = invalidos.length === 1
        ? 'Falta corregir 1 campo. Revisa el mensaje junto a él.'
        : 'Faltan ' + invalidos.length + ' campos por corregir. Revisa los mensajes junto a cada uno.';
      alerta.hidden = false;
      resultado.hidden = true;
      invalidos[0].focus();
      return;
    }
    alerta.hidden = true;
    var d = datos();
    var texto = mensaje(d);
    var url = endpoint();
    if (url) enviar(url, d, texto, form.querySelector('[type="submit"]'));
    else if (wa && wa.disponible()) prepararWhatsApp(texto);
    else sinCanal(texto);
  });
})();
