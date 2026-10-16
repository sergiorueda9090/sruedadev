/* ==========================================================================
   ESSENCE & TIME — Favoritos
   Estado persistido: ['id-producto', ...] sin duplicados.
   Evento global: 'et:wishlist-change' con { id, saved }.
   ========================================================================== */
(function (ET) {
  'use strict';

  const KEY = 'wishlist';
  const { catalog, storage, utils } = ET;
  let ids = [];
  let removedCount = 0; // favoritos descartados porque el producto ya no existe

  function load() {
    const raw = storage.get(KEY, []);
    const list = Array.isArray(raw) ? raw : [];
    const unique = [...new Set(list.map(String))];
    ids = unique.filter((id) => catalog.byId(id));
    const removedNow = unique.length - ids.length;
    if (removedNow > 0 || unique.length !== list.length) storage.set(KEY, ids);
    // El aviso se conserva hasta mostrarse en la página de favoritos
    removedCount = (Number(storage.get('wishlist-removed', 0)) || 0) + removedNow;
    if (removedNow > 0) storage.set('wishlist-removed', removedCount);
  }

  const api = {
    has(id) { return ids.includes(id); },
    count() { return ids.length; },
    ids() { return [...ids]; },
    products() { return ids.map((id) => catalog.byId(id)).filter(Boolean); },
    removedCount() { return removedCount; },
    clearRemovedNotice() { removedCount = 0; storage.remove('wishlist-removed'); },

    /** Alterna un favorito y devuelve true si quedó guardado. */
    toggle(id) {
      if (!catalog.byId(id)) return false;
      const saved = !this.has(id);
      ids = saved ? [id, ...ids] : ids.filter((x) => x !== id);
      storage.set(KEY, ids);
      utils.emit('et:wishlist-change', { id, saved });
      return saved;
    },

    remove(id) {
      if (!this.has(id)) return;
      ids = ids.filter((x) => x !== id);
      storage.set(KEY, ids);
      utils.emit('et:wishlist-change', { id, saved: false });
    },
  };

  load();
  storage.onExternalChange(KEY, () => { load(); utils.emit('et:wishlist-change', { external: true }); });

  ET.wishlist = api;
})(window.ET);
