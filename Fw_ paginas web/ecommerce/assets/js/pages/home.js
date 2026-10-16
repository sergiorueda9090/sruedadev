/* ESSENCE & TIME — Inicio: secciones alimentadas por el catálogo */
(function (ET) {
  'use strict';

  ET.pages = ET.pages || {};
  ET.pages.home = {
    init() {
      const { catalog, ui, config, utils } = ET;
      const { $, esc } = utils;
      const byRank = (a, b) => a.featured - b.featured;
      // Cada fotografía aparece una sola vez en la portada: se reservan las del
      // hero y del mosaico de categorías, y cada sección excluye lo ya mostrado.
      const used = new Set(['r03', 'p01', 'p07', 'r08']);
      const take = (list, n) => {
        const out = list.filter((p) => !used.has(p.id)).slice(0, n);
        out.forEach((p) => used.add(p.id));
        return out;
      };
      const available = catalog.all().filter((p) => catalog.isAvailable(p)).sort(byRank);

      // Relojes: uno por estilo cuando sea posible
      const watches = available.filter((p) => p.category === 'relojes' && !used.has(p.id));
      const picked = [];
      ['Deportivo', 'Clásico', 'Contemporáneo'].forEach((st) => {
        const w = watches.find((x) => x.watch.style === st && !picked.includes(x));
        if (w) picked.push(w);
      });
      watches.forEach((w) => { if (picked.length < 4 && !picked.includes(w)) picked.push(w); });
      picked.forEach((p) => used.add(p.id));

      // Regalos: un perfume, un reloj y un set
      const gifts = catalog.giftScope().filter((p) => catalog.isAvailable(p)).sort(byRank);
      const giftPicks = ['perfumes', 'relojes', 'regalos']
        .map((cat) => take(gifts.filter((p) => p.category === cat), 1)[0]).filter(Boolean);

      // Favoritos de la colección: lo más destacado que no se ha mostrado
      const favs = take(available, 8);

      $('[data-home-favs]').innerHTML = favs
        .map((p) => `<div class="swiper-slide">${ui.productCard(p, { sizes: '(min-width: 992px) 22vw, (min-width: 576px) 44vw, 72vw' })}</div>`).join('');
      $('[data-home-watches]').innerHTML = picked.map((p) => ui.productCard(p, { sizes: '(min-width: 992px) 14vw, 45vw' })).join('');
      $('[data-home-gifts]').innerHTML = giftPicks.map((p) => ui.productCard(p)).join('');

      $('[data-home-budgets]').innerHTML = config.budgets
        .map((b) => `<a class="chip" href="regalos.html?presupuesto=${b.slug}">${esc(b.label)}</a>`).join('');

      const news = $('[data-home-newsletter]');
      news.innerHTML = ui.newsletterHTML('home');
      ui.mountNewsletter(news.querySelector('form'));
    },
  };
})(window.ET);
