/*
 * CTICOL — formulario de cotización (contacto.html#cotizar).
 *
 * No simula envíos. Según assets/js/config.js (window.CT):
 *   - formWhatsapp + whatsapp.numero → siempre abre WhatsApp con la solicitud escrita
 *     (el usuario presiona «Enviar»; un sitio estático no puede enviarlo solo).
 *   - formEndpoint (https)           → además, POST JSON; solo confirma si el servidor responde 2xx.
 *   - ninguno                        → dice que no hay canal configurado y ofrece copiar el resumen.
 * Validación accesible: errores junto a cada campo, resumen con enlaces y foco en el primer error.
 */
(function () {
  'use strict';

  const form = document.querySelector('[data-quote-form]');
  if (!form) return;
  const CT = window.CT || {};
  const estado = form.querySelector('[data-form-status]');
  const resumenErr = form.querySelector('[data-error-summary]');
  const boton = form.querySelector('[data-submit]');
  const campo = (n) => form.elements.namedItem(n);

  // Servicio preseleccionado desde ?servicio=<id>
  const pedido = new URLSearchParams(window.location.search).get('servicio');
  const select = campo('servicio');
  if (pedido && select && Array.from(select.options).some((o) => o.value === pedido)) select.value = pedido;

  const REGLAS = [
    ['nombre', (v) => v.length >= 3 || 'Escriba su nombre completo.'],
    ['telefono', (v) => {
      const digitos = v.replace(/\D/g, '');
      if (!v) return 'Escriba un número de teléfono.';
      return (/^[0-9 +()\-]+$/.test(v) && digitos.length >= 7 && digitos.length <= 15) || 'Escriba un teléfono válido, solo con números (7 a 15 dígitos).';
    }],
    ['correo', (v) => {
      if (!v) return 'Escriba su correo electrónico.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Escriba un correo válido, por ejemplo nombre@empresa.com.';
    }],
    ['servicio', (v) => Boolean(v) || 'Seleccione el tipo de servicio.'],
    ['origen', (v) => v.length >= 2 || 'Escriba la ciudad de origen.'],
    ['destino', (v) => v.length >= 2 || 'Escriba la ciudad de destino.'],
    ['carga', (v) => v.length >= 10 || 'Describa la carga: qué es, peso y medidas aproximadas (mínimo 10 caracteres).'],
    ['datos', (v, el) => el.checked || 'Debe autorizar el tratamiento de datos para que podamos responderle.']
  ];

  function marcar(el, mensaje) {
    const err = form.querySelector(`#e-${el.name}`);
    const hint = el.getAttribute('aria-describedby') ? el.getAttribute('aria-describedby').split(' ').filter((id) => id !== `e-${el.name}`) : [];
    if (mensaje) {
      el.setAttribute('aria-invalid', 'true');
      el.setAttribute('aria-describedby', hint.concat(`e-${el.name}`).join(' '));
      if (err) err.textContent = mensaje;
    } else {
      el.removeAttribute('aria-invalid');
      if (hint.length) el.setAttribute('aria-describedby', hint.join(' ')); else el.removeAttribute('aria-describedby');
      if (err) err.textContent = '';
    }
  }

  function validar() {
    const errores = [];
    REGLAS.forEach(([nombre, regla]) => {
      const el = campo(nombre);
      const r = regla((el.value || '').trim(), el);
      const msg = r === true ? '' : r;
      marcar(el, msg);
      if (msg) errores.push({ el, msg });
    });
    return errores;
  }

  // Revalida mientras se escribe, solo si el campo ya tenía un error. (No se usa focusout:
  // quitar un mensaje al perder el foco movía el siguiente campo bajo el cursor a mitad del clic.)
  const revalidar = (ev) => {
    const el = ev.target;
    if (!el.name || el.getAttribute('aria-invalid') !== 'true') return;
    const regla = REGLAS.find(([n]) => n === el.name);
    if (!regla) return;
    const r = regla[1]((el.value || '').trim(), el);
    marcar(el, r === true ? '' : r);
  };
  form.addEventListener('input', revalidar);
  form.addEventListener('change', revalidar);

  function mostrar(tipo, html) {
    estado.innerHTML = `<div class="msg msg--${tipo}">${html}</div>`;
  }

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function datos() {
    const v = (n) => (campo(n).value || '').trim();
    const servicio = (CT.servicios && CT.servicios[v('servicio')]) || 'Otro / no está seguro';
    return {
      nombre: v('nombre'), empresa: v('empresa'), telefono: v('telefono'), correo: v('correo'),
      servicio, servicioId: v('servicio'), origen: v('origen'), destino: v('destino'),
      carga: v('carga'), mensaje: v('mensaje'), autorizaDatos: true,
      pagina: window.location.pathname, fecha: new Date().toISOString()
    };
  }

  // Formato de WhatsApp: *negrita* para las etiquetas.
  function resumen(d) {
    const campos = [
      ['Nombre', d.nombre], ['Empresa', d.empresa], ['Teléfono', d.telefono], ['Correo', d.correo],
      ['Servicio', d.servicio], ['Origen', d.origen], ['Destino', d.destino], ['Carga', d.carga], ['Mensaje', d.mensaje]
    ].filter(([, v]) => v).map(([k, v]) => `*${k}:* ${v}`);
    return ['*Solicitud de cotización (sitio web)*', ''].concat(campos).join('\n');
  }

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    estado.innerHTML = '';
    if (campo('web').value) return; // trampa para robots

    const errores = validar();
    if (errores.length) {
      resumenErr.hidden = false;
      resumenErr.innerHTML = `<p><strong>Revise ${errores.length === 1 ? 'un campo' : `${errores.length} campos`} antes de continuar:</strong></p><ul>${
        errores.map((x) => `<li><a href="#${x.el.id}">${esc(x.msg)}</a></li>`).join('')}</ul>`;
      errores[0].el.focus();
      return;
    }
    resumenErr.hidden = true;
    resumenErr.innerHTML = '';

    const d = datos();
    const texto = resumen(d);
    const urlWa = CT.whatsapp && CT.whatsapp.numero ? `https://wa.me/${CT.whatsapp.numero}?text=${encodeURIComponent(texto)}` : '';
    const conWa = Boolean(urlWa) && CT.formWhatsapp !== false;
    const enlaceWa = conWa ? `<a href="${urlWa}" target="_blank" rel="noopener">abrir WhatsApp ${esc(CT.whatsapp.mostrar || '')}</a>` : '';
    const enlaceCorreo = CT.correo ? `<a href="mailto:${esc(CT.correo)}?subject=${encodeURIComponent('Solicitud de cotización')}&body=${encodeURIComponent(texto.replace(/\*/g, ''))}">envíela por correo</a>` : '';

    // WhatsApp se abre aquí mismo, dentro del clic: después de un await el navegador bloquearía la ventana.
    // Un sitio estático no puede enviar el mensaje solo: queda escrito y el usuario presiona «Enviar».
    if (conWa) window.open(urlWa, '_blank', 'noopener');
    const avisoWa = conWa
      ? `<p><strong>Abrimos WhatsApp con su solicitud escrita.</strong> Para que llegue a nuestro WhatsApp ${esc(CT.whatsapp.mostrar || '')}, presione «Enviar» en WhatsApp.</p>
         <p>Si WhatsApp no se abrió, use este enlace: ${enlaceWa}${enlaceCorreo ? ` o ${enlaceCorreo}` : ''}.</p>`
      : '';
    const enfocar = () => { estado.setAttribute('tabindex', '-1'); estado.focus(); };

    if (CT.formEndpoint) {
      boton.disabled = true;
      boton.textContent = 'Enviando…';
      try {
        const r = await fetch(CT.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(d)
        });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        mostrar('ok', `<p><strong>Recibimos su solicitud de cotización.</strong> Le responderemos al teléfono o al correo que nos indicó.</p>${avisoWa}`);
        form.reset();
      } catch (err) {
        mostrar(conWa ? 'warn' : 'err', `<p><strong>Nuestro servidor no recibió la solicitud.</strong> Sus datos siguen en el formulario.</p>${
          avisoWa || (enlaceCorreo ? `<p>Puede ${enlaceCorreo}.</p>` : '')}`);
      } finally {
        boton.disabled = false;
        boton.textContent = 'Solicitar cotización';
        enfocar();
      }
      return;
    }

    if (conWa) {
      mostrar('warn', avisoWa);
      enfocar();
      return;
    }

    mostrar('err', `<p><strong>Su solicitud no se envió.</strong> Este formulario todavía no tiene un canal de envío configurado.</p>
      <p>Copie el resumen y envíelo por correo o teléfono.</p><button type="button" class="btn-dark" data-copiar>Copiar resumen</button>`);
    const copiar = estado.querySelector('[data-copiar]');
    copiar.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(texto); copiar.textContent = 'Resumen copiado'; }
      catch (e) { copiar.textContent = 'No se pudo copiar'; }
    });
    copiar.focus();
  });
})();
