/* VITALIA — widgets reutilizables: carrusel con scroll-snap y pestañas ARIA.
 * Ambos mejoran HTML que ya es usable sin JavaScript (la pista se desplaza con el
 * dedo o el trackpad; los paneles de pestañas se ven todos si el JS no carga).
 */
(function (VT) {
  'use strict';

  // <div data-carrusel> con .carrusel-pista, [data-prev], [data-next] y [data-estado] opcional
  function carrusel(raiz) {
    const pista = raiz.querySelector('.carrusel-pista');
    const prev = raiz.querySelector('[data-prev]');
    const next = raiz.querySelector('[data-next]');
    const estado = raiz.querySelector('[data-estado]');
    if (!pista) return;
    const items = () => Array.from(pista.children);
    const paso = () => { const it = items()[0]; return it ? it.getBoundingClientRect().width + parseFloat(getComputedStyle(pista).columnGap || 16) : pista.clientWidth; };
    const actualizar = () => {
      const max = pista.scrollWidth - pista.clientWidth - 2;
      if (prev) prev.disabled = pista.scrollLeft <= 2;
      if (next) next.disabled = pista.scrollLeft >= max;
      if (estado) {
        const vis = Math.max(1, Math.round(pista.clientWidth / paso()));
        const i = Math.min(items().length, Math.round(pista.scrollLeft / paso()) + vis);
        estado.textContent = `${i} de ${items().length}`;
      }
    };
    const mover = (dir) => pista.scrollBy({ left: dir * paso(), behavior: VT.u.reducido() ? 'auto' : 'smooth' });
    if (prev) prev.addEventListener('click', () => mover(-1));
    if (next) next.addEventListener('click', () => mover(1));
    pista.addEventListener('scroll', VT.u.debounce(actualizar, 60), { passive: true });
    pista.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); mover(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); mover(-1); }
    });
    window.addEventListener('resize', VT.u.debounce(actualizar, 120));
    actualizar();
  }

  // [role=tablist] con [role=tab][aria-controls]; navegación con flechas, Inicio y Fin
  function pestanas(lista, alCambiar) {
    const tabs = Array.from(lista.querySelectorAll('[role="tab"]'));
    const activar = (tab, foco) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        t.classList.toggle('activo', on);
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (foco) tab.focus();
      if (alCambiar) alCambiar(tab);
    };
    tabs.forEach((t) => {
      t.addEventListener('click', () => activar(t, false));
      t.addEventListener('keydown', (e) => {
        const i = tabs.indexOf(t); let n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') n = tabs[0];
        if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); activar(n, true); }
      });
    });
    activar(tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0], false);
  }

  VT.widgets = { carrusel, pestanas };
})(window.VT = window.VT || {});
