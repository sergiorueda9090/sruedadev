/* VITALIA — módulos de páginas informativas: contacto, guía y preguntas frecuentes. */
(function (VT) {
  'use strict';
  VT.paginas = VT.paginas || {};

  // Resalta en el índice lateral la sección visible
  function indice(sel) {
    const nav = VT.u.$(sel);
    if (!nav || !('IntersectionObserver' in window)) return;
    const links = VT.u.$$('a', nav);
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => {
          const on = a.getAttribute('href') === '#' + e.target.id;
          a.classList.toggle('activo', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    links.forEach((a) => { const t = document.querySelector(a.getAttribute('href')); if (t) obs.observe(t); });
  }

  VT.paginas.bienestar = () => indice('#indiceGuia');

  VT.paginas.faq = function () {
    indice('#indiceFaq');
    // Abre la primera pregunta de la sección enlazada (#envios, #pedidos…)
    const id = location.hash.slice(1);
    const sec = id && document.getElementById(id);
    const btn = sec && sec.querySelector('.accordion-button');
    if (btn && window.bootstrap) window.bootstrap.Collapse.getOrCreateInstance(VT.u.$(btn.dataset.bsTarget)).show();
  };

  VT.paginas.contacto = function () {
    const { config, u } = VT;
    VT.forms.contacto();
    const c = config.contacto;
    const wa = u.whatsapp(c.mensajeWhatsapp);
    if (wa) u.$('#canalWa').innerHTML = `<a href="${wa}" target="_blank" rel="noopener">Escribir por WhatsApp</a>`;
    if (c.correo) u.$('#canalCorreo').innerHTML = `<a href="mailto:${u.esc(c.correo)}">${u.esc(c.correo)}</a>`;
    if (c.horario) u.$('#canalHorario').textContent = c.horario;
  };
})(window.VT = window.VT || {});
