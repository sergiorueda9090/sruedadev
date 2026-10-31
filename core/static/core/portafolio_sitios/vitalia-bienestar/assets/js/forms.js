/* VITALIA — validación accesible de formularios (newsletter, contacto, checkout).
 * Formularios honestos: nada se envía ni se guarda. Al validar, se muestra una
 * confirmación de demostración que lo dice explícitamente.
 * Reglas por atributo: required, type="email", data-tel (opcional), minlength, data-msg-*.
 */
(function (VT) {
  'use strict';
  const RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const RE_TEL = /^[0-9+()\s-]{7,20}$/;

  function errorDe(campo) {
    const v = campo.type === 'checkbox' ? campo.checked : campo.value.trim();
    const nombre = campo.dataset.nombre || 'Este campo';
    if (campo.type === 'radio') {
      const grupo = campo.form.querySelectorAll(`[name="${campo.name}"]`);
      return campo.required && ![...grupo].some((r) => r.checked) ? (campo.dataset.msgRequerido || `Elige ${nombre.toLowerCase()}.`) : '';
    }
    if (campo.required && !v) {
      return campo.dataset.msgRequerido || (campo.type === 'checkbox' ? 'Debes aceptar para continuar.' : `${nombre} es obligatorio.`);
    }
    if (!v) return '';
    if (campo.type === 'email' && !RE_CORREO.test(v)) return 'Escribe un correo válido, por ejemplo nombre@correo.com.';
    if (campo.hasAttribute('data-tel') && !RE_TEL.test(v)) return 'Escribe un teléfono válido: solo números, espacios o «+».';
    const min = Number(campo.getAttribute('minlength'));
    if (min && v.length < min) return `${nombre} debe tener al menos ${min} caracteres.`;
    if (campo.dataset.patron && !new RegExp(campo.dataset.patron).test(v)) return campo.dataset.msgPatron || `${nombre} no tiene un formato válido.`;
    return '';
  }

  function pintarError(campo, msg) {
    const id = campo.type === 'radio' ? `err-${campo.name}` : `err-${campo.id}`;
    let caja = document.getElementById(id);
    if (!caja) return;
    caja.textContent = msg;
    const objetivos = campo.type === 'radio' ? campo.form.querySelectorAll(`[name="${campo.name}"]`) : [campo];
    objetivos.forEach((c) => {
      if (msg) c.setAttribute('aria-invalid', 'true'); else c.removeAttribute('aria-invalid');
      const desc = new Set((c.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
      desc.add(id); c.setAttribute('aria-describedby', [...desc].join(' '));
    });
  }

  // Valida un formulario completo. Devuelve true si es válido; si no, enfoca el primer error.
  function validar(form) {
    const campos = [...form.querySelectorAll('input, select, textarea')].filter((c) => !c.disabled && c.type !== 'hidden' && c.type !== 'submit');
    const vistos = new Set(); const errores = [];
    campos.forEach((c) => {
      if (c.type === 'radio') { if (vistos.has(c.name)) return; vistos.add(c.name); }
      const msg = errorDe(c); pintarError(c, msg);
      if (msg) errores.push({ campo: c, msg });
    });
    const resumen = form.querySelector('.form-resumen-errores');
    if (resumen) {
      resumen.hidden = errores.length < 2;
      if (errores.length >= 2) resumen.innerHTML = `<strong>Revisa ${errores.length} campos:</strong><ul class="mb-0 mt-1">${errores.map((e) => `<li><a href="#${e.campo.id}">${VT.u.esc(e.msg)}</a></li>`).join('')}</ul>`;
    }
    if (errores.length) {
      const primero = errores[0].campo;
      primero.focus({ preventScroll: true });
      primero.scrollIntoView({ block: 'center', behavior: VT.u.reducido() ? 'auto' : 'smooth' });
    }
    return !errores.length;
  }

  // Validación en vivo después del primer intento (no molesta mientras se escribe la primera vez)
  function enVivo(form) {
    form.addEventListener('blur', (e) => {
      const c = e.target;
      if (c.matches('input, select, textarea') && (c.value || c.getAttribute('aria-invalid'))) pintarError(c, errorDe(c));
    }, true);
    form.addEventListener('input', (e) => {
      const c = e.target;
      if (c.getAttribute('aria-invalid')) pintarError(c, errorDe(c));
    });
    form.addEventListener('change', (e) => { if (e.target.type === 'radio' || e.target.type === 'checkbox') pintarError(e.target, errorDe(e.target)); });
  }

  function confirmar(form, { titulo, texto }) {
    const destino = form.parentElement.querySelector('[data-confirmacion]') || form.nextElementSibling;
    destino.innerHTML = `<div class="form-ok" role="status" tabindex="-1"><i class="bi bi-check2-circle" aria-hidden="true"></i><p><strong>${titulo}</strong>${texto}</p></div>`;
    destino.hidden = false;
    destino.querySelector('.form-ok').focus();
  }

  function simularEnvio(btn, fn) {
    btn.classList.add('cargando'); btn.setAttribute('aria-disabled', 'true');
    setTimeout(() => { btn.classList.remove('cargando'); btn.removeAttribute('aria-disabled'); fn(); }, 700);
  }

  function newsletter() {
    document.querySelectorAll('[data-form="newsletter"]').forEach((form) => {
      enVivo(form);
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validar(form)) return;
        simularEnvio(form.querySelector('[type="submit"]'), () => {
          form.reset();
          confirmar(form, { titulo: 'Suscripción de demostración registrada en pantalla.', texto: ' Tu correo no se envió ni se guardó: esta tienda no tiene un servicio de correo conectado.' });
        });
      });
    });
  }

  function contacto() {
    const form = document.querySelector('[data-form="contacto"]');
    if (!form) return;
    enVivo(form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validar(form)) return;
      const datos = new FormData(form);
      const nombre = String(datos.get('nombre')).trim().split(' ')[0];
      simularEnvio(form.querySelector('[type="submit"]'), () => {
        form.reset();
        confirmar(form, { titulo: `Gracias, ${VT.u.esc(nombre)}. Mensaje de demostración listo.`, texto: ' No se envió ni se almacenó: en una tienda real llegaría al canal de atención configurado.' });
      });
    });
  }

  VT.forms = { validar, enVivo, errorDe, pintarError, confirmar, simularEnvio, newsletter, contacto };
})(window.VT = window.VT || {});
