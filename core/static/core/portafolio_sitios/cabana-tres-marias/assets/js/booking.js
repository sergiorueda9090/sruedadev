/*
 * Cabaña Las Tres Marías — formulario de consulta.
 * Valida los datos, arma el mensaje (vista previa en vivo) y lo abre en WhatsApp.
 * No envía nada a ningún servidor ni simula disponibilidad.
 */
(function () {
  'use strict';

  var App = window.TMApp;
  var form = document.getElementById('booking-form');
  if (!App || !form) return;
  var $ = App.$;
  var TM = window.TM || {};
  var CAP = typeof TM.capacidadMaxima === 'number' && TM.capacidadMaxima > 0 ? TM.capacidadMaxima : null;

  var f = {
    nombre: $('#f-nombre'), llegada: $('#f-llegada'), salida: $('#f-salida'),
    adultos: $('#f-adultos'), ninos: $('#f-ninos'), plan: $('#f-plan'), mensaje: $('#f-mensaje')
  };
  var errorsBox = $('#form-errors');
  var preview = $('#preview-text');
  var waMissing = $('#wa-missing');

  /* ---------- 1. Fechas ---------- */
  function todayISO() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function parseISODate(s) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s || '')) return null;
    var p = s.split('-').map(Number);
    var d = new Date(p[0], p[1] - 1, p[2]);
    return d.getMonth() === p[1] - 1 ? d : null;
  }
  function addDays(iso, n) {
    var d = parseISODate(iso); d.setDate(d.getDate() + n);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  var fmt = new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  function human(iso) { var d = parseISODate(iso); return d ? fmt.format(d) : ''; }

  var today = todayISO();
  f.llegada.min = today;
  f.salida.min = addDays(today, 1);
  f.llegada.addEventListener('change', function () {
    if (parseISODate(f.llegada.value)) {
      f.salida.min = addDays(f.llegada.value, 1);
      if (f.salida.value && f.salida.value <= f.llegada.value) f.salida.value = '';
    }
  });

  /* ---------- 2. Capacidad ---------- */
  var hint = $('#capacity-hint');
  if (CAP) {
    hint.textContent = 'Capacidad máxima: ' + CAP + ' personas entre adultos y niños.';
    hint.hidden = false;
    f.adultos.max = CAP;
    f.ninos.max = CAP - 1;
  } else if (App.revision) {
    hint.textContent = 'La capacidad máxima aún no está configurada: el formulario no limita el número de huéspedes. ';
    hint.appendChild(App.pendingTag());
    hint.hidden = false;
  }

  /* ---------- 3. Mensaje ---------- */
  function int(v) { var n = parseInt(v, 10); return isNaN(n) ? null : n; }

  function buildMessage() {
    var v = function (x) { return x.value.trim(); };
    return [
      'Hola, quisiera consultar disponibilidad para Cabaña Las Tres Marías.',
      '',
      'Nombre: ' + (v(f.nombre) || '[tu nombre]'),
      'Llegada: ' + (human(f.llegada.value) || '[fecha]'),
      'Salida: ' + (human(f.salida.value) || '[fecha]'),
      'Adultos: ' + (int(f.adultos.value) !== null ? int(f.adultos.value) : '[cantidad]'),
      'Niños: ' + (int(f.ninos.value) !== null ? int(f.ninos.value) : 0),
      'Plan de interés: ' + (f.plan.value || 'Aún no lo sé'),
      'Mensaje adicional: ' + (v(f.mensaje) || 'Ninguno'),
      '',
      '¿Podrían informarme la disponibilidad, el precio total y las condiciones de reserva?'
    ].join('\n');
  }

  function updatePreview() { preview.textContent = buildMessage(); }
  form.addEventListener('input', updatePreview);
  form.addEventListener('change', updatePreview);
  updatePreview();

  /* ---------- 4. Validación ---------- */
  function setError(input, msg) {
    var p = document.getElementById('e-' + input.name);
    input.classList.toggle('is-invalid', !!msg);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (p) p.textContent = msg || '';
  }

  function validate() {
    var errs = [];
    function check(input, msg) { setError(input, msg); if (msg) errs.push({ input: input, msg: msg }); }

    check(f.nombre, f.nombre.value.trim().length < 2 ? 'Escribe tu nombre.' : '');

    var lle = parseISODate(f.llegada.value), sal = parseISODate(f.salida.value);
    check(f.llegada, !lle ? 'Elige la fecha de llegada.' : (f.llegada.value < today ? 'La llegada no puede ser una fecha pasada.' : ''));
    check(f.salida, !sal ? 'Elige la fecha de salida.' : (lle && f.salida.value <= f.llegada.value ? 'La salida debe ser posterior a la llegada.' : ''));

    var a = int(f.adultos.value), n = int(f.ninos.value);
    if (f.ninos.value.trim() === '') n = 0;
    check(f.adultos, a === null || a < 1 || String(a) !== f.adultos.value.trim() ? 'Indica al menos 1 adulto, en números enteros.' : '');
    check(f.ninos, n === null || n < 0 || (f.ninos.value.trim() !== '' && String(n) !== f.ninos.value.trim()) ? 'Indica el número de niños, o 0.' : '');
    if (CAP && a !== null && n !== null && a + n > CAP) {
      check(f.adultos, 'Son ' + (a + n) + ' huéspedes y la capacidad máxima es de ' + CAP + '.');
    }
    return errs;
  }

  function showErrors(errs) {
    errorsBox.textContent = '';
    if (!errs.length) { errorsBox.hidden = true; return; }
    var title = document.createElement('strong');
    title.textContent = errs.length === 1 ? 'Revisa un dato antes de continuar:' : 'Revisa ' + errs.length + ' datos antes de continuar:';
    var ul = document.createElement('ul');
    errs.forEach(function (e) {
      var li = document.createElement('li'), a = document.createElement('a');
      a.href = '#' + e.input.id; a.textContent = e.msg;
      a.addEventListener('click', function (ev) { ev.preventDefault(); e.input.focus(); });
      li.appendChild(a); ul.appendChild(li);
    });
    errorsBox.append(title, ul);
    errorsBox.hidden = false;
    errs[0].input.focus();
  }

  // Revalida un campo al corregirlo, sin molestar mientras se escribe por primera vez.
  Object.keys(f).forEach(function (k) {
    f[k].addEventListener('blur', function () {
      if (f[k].getAttribute('aria-invalid') === 'true') validate();
    });
  });

  /* ---------- 5. Envío ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var errs = validate();
    showErrors(errs);
    if (errs.length) return;
    var msg = buildMessage();
    var url = App.waUrl(msg);
    App.track('consulta_formulario', { plan: f.plan.value || 'sin plan', con_whatsapp: !!url });
    if (url) {
      App.openWa(url);
      waMissing.hidden = true;
    } else {
      waMissing.hidden = false;
      $('#copy-msg').focus();
    }
  });

  $('#copy-msg').addEventListener('click', function () {
    var status = $('#copy-status');
    var text = buildMessage();
    var done = function () { status.textContent = 'Mensaje copiado.'; };
    var fail = function () { status.textContent = 'No se pudo copiar. Selecciona el texto del mensaje y cópialo.'; };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fail);
    else {
      try {
        var ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        document.execCommand('copy') ? done() : fail();
        ta.remove();
      } catch (err) { fail(); }
    }
  });

  if (!App.waNumber() && App.revision) {
    // En revisión se avisa desde el principio que el número falta.
    waMissing.hidden = false;
  }
})();
