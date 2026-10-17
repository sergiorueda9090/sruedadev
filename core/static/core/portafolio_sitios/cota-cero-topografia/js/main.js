/* Cota Cero Topografía — comportamiento propio del sitio. Depende de shared/js/core.js (window.CES). */
(function () {
  'use strict';

  const CES = window.CES;
  const SITE = window.SITE || {};
  if (!CES) return;

  /* ---------- 1. Curvas de nivel del hero: se trazan una sola vez ---------- */

  function drawContours() {
    const group = CES.$('.hero__contours .contours');
    if (!group || CES.prefersReducedMotion()) return;
    const paths = CES.$$('path', group);
    paths.forEach((path, i) => {
      const length = Math.ceil(path.getTotalLength());
      path.style.setProperty('--len', String(length));
      path.style.setProperty('--delay', `${(i % 12) * 0.06}s`);
    });
    group.classList.add('is-drawing');
  }

  /* ---------- 2. Panel de capas ---------- */

  function initLayers() {
    const section = CES.$('#servicios');
    const switches = CES.$$('.layer-switch[role="switch"]');
    if (!section || !switches.length) return;
    section.classList.add('js-layers');

    const infos = CES.$$('[data-info]', section);
    const empty = CES.$('[data-layer-empty]', section);
    // Orden de activación: la descripción visible es la de la última capa encendida.
    let stack = switches.filter((s) => s.getAttribute('aria-checked') === 'true').map((s) => s.dataset.layer);

    const render = () => {
      switches.forEach((sw) => {
        const on = stack.includes(sw.dataset.layer);
        sw.setAttribute('aria-checked', String(on));
        const layer = CES.$(`[data-layer-group="${sw.dataset.layer}"]`, section);
        if (layer) layer.classList.toggle('is-off', !on);
      });
      const current = stack[stack.length - 1];
      infos.forEach((info) => { info.hidden = info.dataset.info !== current; });
      if (empty) empty.hidden = Boolean(current);
    };

    switches.forEach((sw) => {
      // Un <button> ya responde a Enter y Espacio con click.
      sw.addEventListener('click', () => {
        const name = sw.dataset.layer;
        stack = stack.filter((n) => n !== name);
        if (sw.getAttribute('aria-checked') !== 'true') stack.push(name);
        render();
      });
    });
    render();
  }

  /* ---------- 3. Poligonal del flujo de trabajo (escritorio) ---------- */

  function layoutTraverse() {
    const stations = CES.$$('.traverse__station');
    if (stations.length < 2) return;
    const update = () => {
      const marks = stations.map((s) => CES.$('.traverse__mark', s));
      stations.forEach((station, i) => {
        const next = marks[i + 1];
        if (!next || window.innerWidth < 992) {
          station.style.removeProperty('--leg-w');
          station.style.removeProperty('--leg-js');
          return;
        }
        const a = marks[i].getBoundingClientRect();
        const b = next.getBoundingClientRect();
        const dx = b.left - a.left;
        const dy = b.top - a.top;
        station.style.setProperty('--leg-w', `${Math.hypot(dx, dy)}px`);
        station.style.setProperty('--leg-js', `${Math.atan2(dy, dx)}rad`);
      });
    };
    update();
    let frame = 0;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
  }

  /* ---------- 4. Mensaje de WhatsApp a partir del formulario ---------- */

  function whatsappText(data) {
    const lines = [
      'Hola, quiero cotizar un servicio topográfico.',
      `Nombre: ${data.nombre || ''}`,
      data.empresa ? `Empresa: ${data.empresa}` : '',
      `Ubicación: ${data.ubicacion || ''}`,
      `Servicios: ${data.servicios || ''}`,
      `Uso: ${data.uso || ''}`,
      data.area ? `Área aproximada: ${data.area}` : '',
      data.mensaje ? `Detalle: ${data.mensaje}` : '',
      `Contacto: ${data.telefono || ''} / ${data.email || ''}`
    ];
    return lines.filter(Boolean).join('\n');
  }

  /* ---------- Arranque ---------- */

  CES.init(SITE);
  drawContours();
  initLayers();
  layoutTraverse();
  CES.initForm(CES.$('#form-cotizacion'), SITE, {
    whatsappText,
    subject: 'Solicitud de cotización topográfica',
    successText: 'Recibimos su solicitud de cotización. Le responderemos por el medio de contacto que indicó.'
  });
  CES.initLightbox(CES.$('[data-gallery]'));
  CES.initAOS();
})();
