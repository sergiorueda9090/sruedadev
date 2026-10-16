/* ESSENCE & TIME — Contacto: validación y confirmación de demostración (sin envío) */
(function (ET) {
  'use strict';

  ET.pages = ET.pages || {};
  ET.pages.contact = {
    init() {
      const { config, utils } = ET;
      const { $, esc } = utils;
      const form = $('#contact-form');
      const done = $('[data-contact-done]');
      const msg = $('#c-msg');
      const counter = $('#c-msg-count');

      // Canales configurados: solo se muestran los que tienen un valor real
      const c = config.contact;
      const rows = [
        c.email && `<li><i class="bi bi-envelope" aria-hidden="true"></i><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>`,
        c.phone && `<li><i class="bi bi-telephone" aria-hidden="true"></i><a href="tel:${esc(c.phone)}">${esc(c.phone)}</a></li>`,
        c.hours && `<li><i class="bi bi-clock" aria-hidden="true"></i>${esc(c.hours)}</li>`,
        c.address && `<li><i class="bi bi-geo-alt" aria-hidden="true"></i>${esc(c.address)}</li>`,
      ].filter(Boolean);
      const wa = c.whatsapp
        ? `<a class="btn-et btn-et--secondary mt-3" href="https://wa.me/${esc(c.whatsapp.replace(/\D/g, ''))}" target="_blank" rel="noopener"><i class="bi bi-whatsapp" aria-hidden="true"></i>Escribir por WhatsApp</a>`
        : '';
      if (rows.length || wa) {
        $('[data-contact-channels]').innerHTML = `<h2 class="h6">Otros canales</h2><ul class="contact-channels__list">${rows.join('')}</ul>${wa}`;
      }

      const updateCount = () => {
        const n = msg.value.length;
        counter.textContent = n ? `${n} de 500 caracteres${n < 20 ? `, faltan ${20 - n} para el mínimo` : ''}.` : 'Entre 20 y 500 caracteres.';
      };
      msg.addEventListener('input', updateCount);

      ET.validation.attach(form, {
        summary: $('[data-error-summary]', form),
        fields: {
          reason: ['required'],
          name: ['required', 'name'],
          email: ['required', 'email'],
          order: ['orderRef'],
          message: ['required', 'min20', 'max500'],
          consent: ['checked'],
        },
        messages: {
          reason: { required: 'Elige el motivo de tu consulta.' },
          consent: { checked: 'Necesitamos tu autorización para responder la consulta.' },
        },
        onValid() {
          // Demo: no se envía ni se guarda nada
          form.hidden = true;
          done.hidden = false;
          done.focus();
        },
      });

      $('[data-contact-reset]').addEventListener('click', () => {
        form.reset();
        updateCount();
        done.hidden = true;
        form.hidden = false;
        $('#c-reason').focus();
      });
    },
  };
})(window.ET);
