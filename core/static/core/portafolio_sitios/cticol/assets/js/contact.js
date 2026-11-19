/*
 * CTICOL — botón «Contáctanos» y encuesta de cotización (única forma de cotizar del sitio).
 *   1. El botón flotante despliega las dependencias (Logística o despachos, Contabilidad, PQRS, Tesorería),
 *      cada una con su enlace de WhatsApp.
 *   2. «Solicitar cotización» (en el panel y en todos los botones [data-quote-open] del sitio) abre una
 *      encuesta breve: tipo de carga y ciudad. Al continuar se abre WhatsApp de la línea de cotizaciones
 *      con el mensaje inicial y las respuestas escritas. El sitio no envía nada por su cuenta.
 * Sin JavaScript, los botones [data-quote-open] abren WhatsApp directamente con el mensaje inicial.
 * Depende de assets/js/config.js (window.CT), generado por tools/build.py.
 */
(function () {
  'use strict';

  const CT = window.CT || {};
  const widget = document.querySelector('[data-wa-widget]');
  const panel = widget && widget.querySelector('[data-wa-panel]');
  const toggle = widget && widget.querySelector('[data-wa-toggle]');

  /* 1. Panel ------------------------------------------------------------ */
  function paso(nombre) {
    if (!panel) return;
    panel.querySelectorAll('[data-wa-step]').forEach((s) => { s.hidden = s.dataset.waStep !== nombre; });
  }

  function abrir(nombre, carga) {
    if (!panel) return;
    paso(nombre);
    panel.hidden = false;
    widget.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    const form = panel.querySelector('[data-wa-form]');
    if (nombre === 'quote' && form) {
      if (carga) {
        const op = Array.from(form.querySelectorAll('input[name="carga"]')).find((r) => r.value === carga);
        if (op) op.checked = true;
      }
      const marcado = form.querySelector('input[name="carga"]:checked');
      (marcado ? form.querySelector('input[name="ciudad"]') : form.querySelector('input[name="carga"]')).focus();
    } else {
      const primero = panel.querySelector('[data-wa-step="menu"] .wa-cta');
      if (primero) primero.focus();
    }
  }

  function cerrar(devolverFoco) {
    if (!panel || panel.hidden) return;
    panel.hidden = true;
    widget.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (devolverFoco) toggle.focus();
  }

  if (panel && toggle) {
    toggle.addEventListener('click', () => (panel.hidden ? abrir('menu') : cerrar(false)));
    panel.querySelector('[data-wa-close]').addEventListener('click', () => cerrar(true));
    panel.addEventListener('click', (ev) => {
      const ir = ev.target.closest('[data-wa-go]');
      if (ir) abrir(ir.dataset.waGo);
    });
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && !panel.hidden) cerrar(true);
    });
    document.addEventListener('click', (ev) => {
      if (!panel.hidden && !widget.contains(ev.target) && !ev.target.closest('[data-quote-open]')) cerrar(false);
    });
  }

  // Todos los «Solicitar cotización» del sitio llevan a la misma encuesta.
  document.addEventListener('click', (ev) => {
    const btn = ev.target.closest('[data-quote-open]');
    if (!btn || !panel) return;
    ev.preventDefault();
    abrir('quote', btn.dataset.carga || '');
  });

  /* 2. Encuesta --------------------------------------------------------- */
  const REGLAS = {
    carga: (f) => Boolean(f.querySelector('input[name="carga"]:checked')) || 'Seleccione el tipo de carga.',
    ciudad: (f) => f.querySelector('input[name="ciudad"]').value.trim().length >= 2 || 'Escriba la ciudad donde se encuentra.'
  };

  function marcar(form, campo, msg) {
    const err = form.querySelector(`[data-err="${campo}"]`);
    if (err) err.textContent = msg || '';
    const objetivo = campo === 'carga' ? form.querySelector('.wa-opts') : form.querySelector('input[name="ciudad"]');
    if (campo === 'ciudad') {
      if (msg) {
        objetivo.setAttribute('aria-invalid', 'true');
        objetivo.setAttribute('aria-describedby', err.id);
      } else {
        objetivo.removeAttribute('aria-invalid');
        objetivo.removeAttribute('aria-describedby');
      }
    }
    if (objetivo) objetivo.classList.toggle('is-invalid', Boolean(msg));
  }

  document.querySelectorAll('[data-wa-form]').forEach((form) => {
    form.addEventListener('change', (ev) => {
      if (ev.target.name === 'carga') marcar(form, 'carga', '');
    });
    // Revalidar en «input» (no en blur): si el error desaparece al salir del campo, el botón se mueve y el clic se pierde.
    form.querySelector('input[name="ciudad"]').addEventListener('input', () => {
      const r = REGLAS.ciudad(form);
      if (r === true) marcar(form, 'ciudad', '');
    });

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      let primero = null;
      Object.keys(REGLAS).forEach((campo) => {
        const r = REGLAS[campo](form);
        marcar(form, campo, r === true ? '' : r);
        if (r !== true && !primero) {
          primero = campo === 'carga' ? form.querySelector('input[name="carga"]') : form.querySelector('input[name="ciudad"]');
        }
      });
      if (primero) { primero.focus(); return; }

      const carga = form.querySelector('input[name="carga"]:checked').value;
      const ciudad = form.querySelector('input[name="ciudad"]').value.trim();
      const texto = [
        (CT.whatsapp && CT.whatsapp.mensaje) || 'Hola, quiero solicitar una cotización de transporte de carga.',
        '',
        `• Tipo de carga: ${carga}`,
        `• Ciudad donde me encuentro: ${ciudad}`
      ].join('\n');
      const numero = form.dataset.wa;
      window.open(`https://wa.me/${numero}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
    });
  });
})();
