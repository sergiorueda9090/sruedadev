/* ESSENCE & TIME — Favoritos: sincronizado con el contador y con otras pestañas */
(function (ET) {
  'use strict';

  ET.pages = ET.pages || {};
  ET.pages.favorites = {
    init() {
      const { wishlist, ui, utils } = ET;
      const { $, plural } = utils;
      const grid = $('[data-fav-grid]');
      const empty = $('[data-fav-empty]');
      const summary = $('[data-fav-summary]');
      const live = $('[data-fav-live]');

      const removed = wishlist.removedCount();
      if (removed) {
        $('[data-fav-notice]').innerHTML = `<div class="notice mb-5" role="status"><i class="bi bi-info-circle" aria-hidden="true"></i>
          <p>${removed === 1 ? 'Un producto guardado ya no está en el catálogo y lo quitamos de tu lista.' : `${removed} productos guardados ya no están en el catálogo y los quitamos de tu lista.`}</p></div>`;
        wishlist.clearRemovedNotice();
      }

      const render = () => {
        const list = wishlist.products();
        summary.textContent = list.length
          ? `${plural(list.length, 'producto guardado', 'productos guardados')}. Se conservan en este navegador.`
          : 'Los productos que guardas se conservan en este navegador.';
        grid.innerHTML = list.map((p) => ui.productCard(p, { heading: 'h2' })).join('');
        grid.hidden = !list.length;
        empty.innerHTML = list.length ? '' : ui.emptyState({
          title: 'Todavía no has guardado tus favoritos.',
          text: 'Pulsa el corazón de cualquier producto para guardarlo aquí y compararlo más tarde.',
          actions: [{ label: 'Explorar la colección', href: 'perfumes.html' }, { label: 'Ver relojes', href: 'relojes.html' }],
        });
      };

      document.addEventListener('et:wishlist-change', (e) => {
        render();
        if (e.detail && e.detail.id && !e.detail.saved) {
          live.textContent = 'Producto quitado de favoritos.';
          // Mantener el foco en un lugar útil tras eliminar una tarjeta
          const next = grid.querySelector('.pcard__link') || empty.querySelector('a');
          if (next && document.activeElement === document.body) next.focus();
        }
      });
      render();
    },
  };
})(window.ET);
