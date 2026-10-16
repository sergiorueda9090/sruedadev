/* ESSENCE & TIME — Preguntas frecuentes: filtro de preguntas visibles */
(function (ET) {
  'use strict';

  ET.pages = ET.pages || {};
  ET.pages.faq = {
    init() {
      const { $, $$, normalize, debounce, plural } = ET.utils;
      const input = $('#faq-q');
      const count = $('#faq-count');
      const empty = $('[data-faq-empty]');
      const items = $$('[data-faq-item]').map((el) => ({
        el,
        btn: $('.accordion-et__btn', el),
        text: normalize(el.textContent),
      }));
      const groups = $$('[data-faq-group]');

      const apply = () => {
        const q = normalize(input.value);
        const terms = q.split(' ').filter((t) => t.length > 1);
        let visible = 0;
        items.forEach((it) => {
          const match = !terms.length || terms.every((t) => it.text.includes(t));
          it.el.hidden = !match;
          if (match) visible += 1;
          // Con una búsqueda activa, las coincidencias se abren para leerlas sin más clics
          ET.ui.setAccordion(it.btn, terms.length > 0 && match);
        });
        groups.forEach((g) => { g.hidden = !$$('[data-faq-item]', g).some((el) => !el.hidden); });

        count.textContent = terms.length ? `${plural(visible, 'pregunta coincide', 'preguntas coinciden')} con «${input.value.trim()}».` : '';
        empty.hidden = visible > 0;
        if (!visible) {
          empty.innerHTML = ET.ui.emptyState({
            title: 'Ninguna pregunta coincide',
            text: 'Prueba con otra palabra, por ejemplo «envío», «cupón» o «garantía», o escríbenos directamente.',
            actions: [{ label: 'Limpiar búsqueda', button: true, attrs: 'data-faq-clear' }, { label: 'Ir a contacto', href: 'contacto.html' }],
          });
        }
      };

      input.addEventListener('input', debounce(apply, 150));
      empty.addEventListener('click', (e) => {
        if (!e.target.closest('[data-faq-clear]')) return;
        input.value = '';
        apply();
        input.focus();
      });

      // Enlace directo a una categoría: lleva el foco al título del grupo
      if (window.location.hash.startsWith('#faq-')) {
        const target = document.querySelector(window.location.hash);
        if (target) target.querySelector('.faq-group__title')?.setAttribute('tabindex', '-1');
      }
    },
  };
})(window.ET);
