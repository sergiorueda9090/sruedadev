/*
 * CTICOL — consulta de envíos (rastreo.html) mientras la plataforma de rastreo está en desarrollo.
 * Valida el número de remesa/manifiesto y el nombre, y abre WhatsApp de Despachos con la consulta escrita.
 * No consulta ningún sistema: el equipo de despachos responde con la ubicación (GPS) de la carga.
 */
(function () {
  'use strict';

  const form = document.querySelector('[data-track-form]');
  if (!form) return;
  const estado = form.querySelector('[data-track-status]');
  const numero = form.dataset.wa;

  const REGLAS = {
    guia: (v) => v.length >= 3 || 'Escriba el número de remesa, manifiesto o guía (o la placa del vehículo).',
    nombre: (v) => v.length >= 2 || 'Escriba su nombre o el de su empresa.'
  };

  function marcar(el, msg) {
    const err = form.querySelector(`#e-${el.name}`);
    const desc = (el.getAttribute('aria-describedby') || '').split(' ').filter((id) => id && id !== `e-${el.name}`);
    if (msg) desc.push(`e-${el.name}`);
    if (desc.length) el.setAttribute('aria-describedby', desc.join(' ')); else el.removeAttribute('aria-describedby');
    if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    if (err) err.textContent = msg || '';
  }

  const validar = (el) => {
    const r = REGLAS[el.name]((el.value || '').trim());
    marcar(el, r === true ? '' : r);
    return r === true;
  };

  form.addEventListener('input', (ev) => {
    if (ev.target.getAttribute('aria-invalid') === 'true') validar(ev.target);
  });

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const campos = ['guia', 'nombre'].map((n) => form.elements.namedItem(n));
    const malos = campos.filter((el) => !validar(el));
    if (malos.length) { malos[0].focus(); return; }
    const [guia, nombre] = campos.map((el) => el.value.trim());
    const texto = ['*Consulta de envío (sitio web)*', '', `*Remesa / manifiesto / guía:* ${guia}`, `*Nombre o empresa:* ${nombre}`,
      '', 'Hola, quiero saber el estado y la ubicación de mi envío.'].join('\n');
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank', 'noopener');
    estado.innerHTML = `<div class="msg msg--warn"><p><strong>Abrimos WhatsApp con su consulta.</strong> Presione «Enviar» para que la reciba nuestro equipo de despachos.</p>
      <p>Si WhatsApp no se abrió, use este enlace: <a href="${url}" target="_blank" rel="noopener">abrir WhatsApp</a>.</p></div>`;
    estado.setAttribute('tabindex', '-1');
    estado.focus();
  });
})();
