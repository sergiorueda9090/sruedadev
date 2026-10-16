/* ==========================================================================
   ESSENCE & TIME — Validación de formularios
   Reglas declarativas, mensajes en español, aria-invalid + aria-describedby,
   resumen de errores y foco en el primer campo inválido.
   Uso: ET.validation.attach(form, { fields: { email: ['required','email'] }, onValid(data) {} })
   ========================================================================== */
(function (ET) {
  'use strict';

  const { $ } = ET.utils;

  const RULES = {
    required: (v) => v.trim().length > 0,
    checked: (_v, el) => (el.type === 'radio' && el.form
      ? !!el.form.querySelector(`input[name="${el.name}"]:checked`)
      : el.checked),
    email: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    // Celular colombiano: 10 dígitos iniciando en 3; fijo nacional: 60 + 8 dígitos
    phoneCO: (v) => {
      const d = v.replace(/[\s()+-]/g, '').replace(/^57(?=\d{10}$)/, '');
      return !v || /^3\d{9}$/.test(d) || /^60\d{8}$/.test(d);
    },
    name: (v) => !v || /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' .-]{2,60}$/.test(v.trim()),
    min10: (v) => !v || v.trim().length >= 10,
    min20: (v) => !v || v.trim().length >= 20,
    max500: (v) => v.length <= 500,
    orderRef: (v) => !v || /^ET-\d{6}-[A-Z0-9]{4,6}$/i.test(v.trim()),
  };

  const MESSAGES = {
    required: 'Completa este campo.',
    checked: 'Marca esta casilla para continuar.',
    email: 'Escribe un correo válido, por ejemplo nombre@correo.com.',
    phoneCO: 'Escribe un celular de 10 dígitos que empiece por 3, o un fijo que empiece por 60.',
    name: 'Usa solo letras, espacios y guiones (2 a 60 caracteres).',
    min10: 'Escribe al menos 10 caracteres para que podamos ubicar la dirección.',
    min20: 'Cuéntanos un poco más: al menos 20 caracteres.',
    max500: 'El texto no puede superar los 500 caracteres.',
    orderRef: 'El número de pedido tiene el formato ET-260101-ABCD.',
  };

  function fieldWrap(el) { return el.closest('[data-field]') || el.closest('.field'); }

  function setError(el, message) {
    const wrap = fieldWrap(el);
    const errId = (el.getAttribute('aria-describedby') || '').split(' ').find((id) => id.endsWith('-error'));
    const err = errId ? document.getElementById(errId) : wrap && $('.field__error', wrap);
    if (message) {
      el.setAttribute('aria-invalid', 'true');
      if (wrap) { wrap.classList.add('is-invalid'); wrap.classList.remove('is-valid'); }
      if (err) err.textContent = message;
    } else {
      el.removeAttribute('aria-invalid');
      if (wrap) wrap.classList.remove('is-invalid');
      if (err) err.textContent = '';
    }
  }

  function validateField(el, rules, custom = {}) {
    const value = el.type === 'checkbox' || el.type === 'radio' ? '' : String(el.value || '');
    const failed = rules.find((r) => !RULES[r](value, el));
    const msg = failed ? ((custom[el.name] && custom[el.name][failed]) || MESSAGES[failed]) : '';
    setError(el, msg);
    return !failed;
  }

  function attach(form, { fields, messages = {}, onValid, summary = null }) {
    if (!form || form.dataset.validation) return;
    form.dataset.validation = '1';
    form.setAttribute('novalidate', '');

    // Grupos de radio: se valida y enfoca el primer botón del grupo
    const resolve = (name) => {
      const el = form.elements[name];
      return el && !el.tagName && el.length ? el[0] : el;
    };
    const entries = () => Object.entries(fields)
      .map(([name, rules]) => [resolve(name), rules])
      .filter(([el]) => el && !el.disabled);

    // Validación al salir del campo; corrección en vivo una vez marcado como inválido
    entries().forEach(([el, rules]) => {
      if (el.type === 'radio') return;
      el.addEventListener('blur', () => { if (el.value || el.type === 'checkbox') validateField(el, rules, messages); });
      el.addEventListener(el.type === 'checkbox' || el.tagName === 'SELECT' ? 'change' : 'input', () => {
        if (el.getAttribute('aria-invalid') === 'true') validateField(el, rules, messages);
      });
    });

    form.addEventListener('change', (e) => {
      if (e.target.type !== 'radio' || !fields[e.target.name]) return;
      const first = resolve(e.target.name);
      if (first.getAttribute('aria-invalid') === 'true') validateField(first, fields[e.target.name], messages);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const invalid = entries().filter(([el, rules]) => !validateField(el, rules, messages)).map(([el]) => el);
      if (summary) {
        summary.hidden = invalid.length === 0;
        if (invalid.length) {
          summary.innerHTML = `<i class="bi bi-exclamation-circle" aria-hidden="true"></i><p>Revisa ${invalid.length === 1 ? 'el campo marcado' : `los ${invalid.length} campos marcados`} para continuar.</p>`;
        }
      }
      if (invalid.length) { invalid[0].focus(); return; }
      onValid(new FormData(form), form);
    });
  }

  ET.validation = { attach, validateField, setError, RULES, MESSAGES };
})(window.ET);
