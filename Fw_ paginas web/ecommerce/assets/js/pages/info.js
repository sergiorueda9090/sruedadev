/* ESSENCE & TIME — Páginas informativas y legales
   Rellena valores configurables (tarifas, políticas, datos del responsable).
   Si un valor es null, se conserva la marca «Pendiente» escrita en el HTML. */
(function (ET) {
  'use strict';

  ET.pages = ET.pages || {};
  ET.pages.info = {
    init() {
      const { config, utils } = ET;
      const { $, $$, esc, formatCOP } = utils;

      const table = $('[data-shipping-table] tbody');
      if (table) {
        table.innerHTML = config.shipping.zones.map((z) => `<tr>
          <th scope="row">${esc(z.label)}</th>
          <td>${z.departments === '*' ? 'Todos los demás departamentos' : esc(z.departments.join(', '))}</td>
          <td class="num">${formatCOP(z.rate)}</td></tr>`).join('');
      }
      const free = $('[data-free-shipping]');
      if (free && config.shipping.freeShippingFrom != null) {
        free.textContent = `Envío gratis en pedidos desde ${formatCOP(config.shipping.freeShippingFrom)} después de descuentos.`;
      }

      // Políticas: solo se reemplaza la marca de pendiente cuando hay un valor aprobado
      $$('[data-policy]').forEach((el) => {
        const v = config.policies[el.dataset.policy];
        if (v == null || v === false) return;
        el.textContent = el.dataset.policy === 'returnsWindowDays' ? `${v} días` : (v === true ? 'Disponible' : String(v));
      });

      // Datos del responsable / vendedor
      const values = {
        legalName: config.brand.legalName,
        taxId: config.brand.taxId,
        address: config.contact.address,
        email: config.contact.email,
        phone: config.contact.phone,
      };
      $$('[data-config]').forEach((el) => {
        const v = values[el.dataset.config];
        if (v) el.textContent = v;
      });

      const contact = $('[data-contact-list]');
      if (contact) {
        const c = config.contact;
        const rows = [
          c.email && `<li>Correo: <a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>`,
          c.phone && `<li>Teléfono: <a href="tel:${esc(c.phone)}">${esc(c.phone)}</a></li>`,
          c.hours && `<li>Horario: ${esc(c.hours)}</li>`,
        ].filter(Boolean);
        contact.innerHTML = rows.length ? `<ul>${rows.join('')}</ul>` : '';
      }
    },
  };
})(window.ET);
