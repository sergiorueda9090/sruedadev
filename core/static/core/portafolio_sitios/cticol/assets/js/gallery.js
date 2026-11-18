/*
 * CTICOL — filtros por categoría (flota y proyectos) y visor de fotos (proyectos).
 *   Filtros: botones [data-filter] con aria-pressed; ocultan los elementos [data-cat]
 *            de la rejilla [data-filter-grid] y anuncian cuántos quedan.
 *            flota.html#camas-bajas abre la flota ya filtrada.
 *   Visor:   <dialog> nativo; flechas del teclado, Escape y botones para navegar.
 */
(function () {
  'use strict';

  /* Filtros ------------------------------------------------------------ */
  document.querySelectorAll('.filters').forEach((grupo) => {
    const cont = grupo.closest('.container');
    const grid = cont && cont.querySelector('[data-filter-grid]');
    const contador = cont && cont.querySelector('[data-filter-count]');
    if (!grid) return;
    const items = Array.from(grid.querySelectorAll('[data-cat]'));
    const botones = Array.from(grupo.querySelectorAll('[data-filter]'));

    const aplicar = (filtro, anunciar) => {
      let visibles = 0;
      items.forEach((it) => {
        const ver = filtro === '*' || it.dataset.cat === filtro;
        it.classList.toggle('is-hidden', !ver);
        if (ver) {
          visibles += 1;
          if (window.gsap) window.gsap.set(it, { autoAlpha: 1, y: 0 });
        }
      });
      botones.forEach((b) => {
        const activo = b.dataset.filter === filtro;
        b.classList.toggle('is-active', activo);
        b.setAttribute('aria-pressed', String(activo));
      });
      if (contador && anunciar) {
        const nombre = filtro === '*' ? '' : ` en «${botones.find((b) => b.dataset.filter === filtro).textContent}»`;
        contador.textContent = `${visibles} ${visibles === 1 ? 'resultado' : 'resultados'}${nombre}.`;
      }
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    };

    botones.forEach((b) => b.addEventListener('click', () => aplicar(b.dataset.filter, true)));

    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash && botones.some((b) => b.dataset.filter === hash)) aplicar(hash, true);
  });

  /* Visor de fotos ------------------------------------------------------ */
  const dialog = document.querySelector('[data-lightbox-dialog]');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const imgEl = dialog.querySelector('[data-lb-img]');
  const cap = dialog.querySelector('[data-lb-cap]');
  let lista = [];
  let actual = 0;
  let origen = null;

  const mostrar = (i) => {
    actual = (i + lista.length) % lista.length;
    const b = lista[actual];
    imgEl.src = b.dataset.full;
    imgEl.alt = b.dataset.alt || '';
    cap.textContent = `${b.dataset.caption} (${actual + 1} de ${lista.length})`;
  };

  document.querySelectorAll('[data-lightbox]').forEach((btn) => {
    btn.addEventListener('click', () => {
      lista = Array.from(document.querySelectorAll('[data-lightbox]')).filter((b) => !b.closest('.is-hidden'));
      origen = btn;
      mostrar(lista.indexOf(btn));
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    });
  });

  dialog.querySelector('[data-lb-close]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-lb-prev]').addEventListener('click', () => mostrar(actual - 1));
  dialog.querySelector('[data-lb-next]').addEventListener('click', () => mostrar(actual + 1));
  dialog.addEventListener('click', (ev) => {
    if (ev.target === dialog || ev.target.classList.contains('lb-inner')) dialog.close();
  });
  dialog.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowLeft') mostrar(actual - 1);
    if (ev.key === 'ArrowRight') mostrar(actual + 1);
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    imgEl.removeAttribute('src');
    if (origen) origen.focus();
  });
})();
