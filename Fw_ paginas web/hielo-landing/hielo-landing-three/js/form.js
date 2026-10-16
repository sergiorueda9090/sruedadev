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
  var asesoria = selTipo.querySelector('option[value="Necesito asesoría"]');
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
    nombre: function (v) { return v.trim().length >= 2 ? '' : 'Falta tu nombre.'; },
    empresa: function (v) { return v.trim().length >= 2 ? '' : 'Falta el nombre del negocio.'; },
    telefono: function (v) {
      if (!v.trim()) return 'Falta un teléfono de contacto.';
      return telefonoValido(v) ? '' : 'Usa 10 dígitos: un celular que empiece por 3 o un fijo que empiece por 60.';
    },
    correo: function (v) {
      if (!v.trim()) return 'Falta tu correo.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Ese correo no es válido; debe verse como nombre@dominio.com.';
    },
    ciudad: function (v) { return v.trim().length >= 2 ? '' : 'Falta el municipio de entrega.'; },
    tipo: function (v) { return v ? '' : 'Elige un tipo de hielo o la opción de asesoría.'; },
    cantidad: function (v) {
      var n = Number(v);
      if (!String(v).trim()) return 'Falta tu consumo estimado.';
      return Number.isInteger(n) && n >= 1 && n <= 1000000 ? '' : 'Usa un número entero mayor que cero.';
    },
    frecuencia: function (v) { return v ? '' : 'Elige cada cuánto compras hielo.'; },
    acepta: function (v, campo) { return campo.checked ? '' : 'Para continuar, acepta el uso de tus datos para esta solicitud.'; }
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
      'Hola, quiero cotizar hielo para mi negocio.',
      '',
      'Nombre: ' + d.nombre,
      'Negocio: ' + d.empresa,
      'Teléfono: ' + d.telefono,
      'Correo: ' + d.correo,
      'Municipio de entrega: ' + d.ciudad,
      'Hielo que necesito: ' + d.tipo,
      'Consumo estimado: ' + d.cantidad,
      'Compro: ' + d.frecuencia.toLowerCase()
    ].concat(d.mensaje ? ['Detalles: ' + d.mensaje] : []).join('\n');
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
    var b = el('button', { type: 'button', class: 'btn btn-quiet' }, [icono('clipboard'), ' Copiar el resumen']);
    b.addEventListener('click', function () {
      var listo = function () { b.textContent = ''; b.appendChild(icono('check2')); b.appendChild(document.createTextNode(' Copiado')); };
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
      b.textContent = 'Texto seleccionado: usa Ctrl+C para copiarlo';
    }
    return b;
  }

  function botonEditar() {
    var b = el('button', { type: 'button', class: 'btn btn-quiet' }, [icono('pencil'), ' Corregir datos']);
    b.addEventListener('click', function () { form.elements.nombre.focus(); });
    return b;
  }

  function enlaceWa(texto) {
    var u = wa && wa.url(texto);
    if (!u) return null;
    return el('a', { class: 'btn btn-wa', href: u, target: '_blank', rel: 'noopener' }, [icono('whatsapp'), ' Enviar este mensaje por WhatsApp']);
  }

  function endpoint() {
    var u = S.formEndpoint;
    if (typeof u !== 'string') return null;
    try { var x = new URL(u); return x.protocol === 'https:' ? x.href : null; } catch (e) { return null; }
  }

  function prepararWhatsApp(texto, titulo, intro) {
    mostrar(null, titulo || 'Tu solicitud está lista',
      (intro ? intro + ' ' : '') + 'Al pulsar el botón se abre WhatsApp con este texto. Solo se envía cuando lo confirmas allí.',
      texto, [enlaceWa(texto), botonEditar()]);
  }

  function sinCanal(texto) {
    mostrar('warning', 'Tu solicitud no salió de esta página',
      'La empresa aún no ha activado un canal para recibir solicitudes desde aquí, así que no se envió nada. Copia el resumen si quieres hacerlo llegar por otro medio.',
      texto, [botonCopiar(texto), botonEditar()]);
  }

  function enviar(url, d, texto, boton) {
    var ctrl = 'AbortController' in window ? new AbortController() : null;
    var reloj = setTimeout(function () { if (ctrl) ctrl.abort(); }, TIEMPO_MAX);
    boton.disabled = true;
    var etiqueta = boton.textContent;
    boton.textContent = 'Enviando tu solicitud…';
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
      mostrar('ok', 'Recibimos tu solicitud', 'Te contactaremos por teléfono o correo con la cotización.', null, []);
    }).catch(function () {
      var alt = enlaceWa(texto);
      mostrar('warning', 'La solicitud no llegó',
        'El servicio que recibe las solicitudes no respondió. Tus datos siguen en el formulario; inténtalo de nuevo' + (alt ? ' o envíala por WhatsApp.' : '.'),
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
        ? 'Hay 1 campo por revisar; mira el aviso junto a él.'
        : 'Hay ' + invalidos.length + ' campos por revisar; mira el aviso junto a cada uno.';
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
