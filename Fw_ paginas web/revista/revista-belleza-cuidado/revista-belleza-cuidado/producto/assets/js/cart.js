/* VITALIA — carrito y favoritos en localStorage.
 * Única lógica de carrito del sitio. Solo se guardan { id, cantidad }: los precios y
 * totales se recalculan siempre desde products.js, nunca desde lo guardado.
 * Lo leído se valida (ids existentes, cantidades enteras dentro del rango) antes de usarlo.
 * Emite el evento 'vt:carrito' / 'vt:favoritos' en document al cambiar.
 */
(function (VT) {
  'use strict';
  const PREFIJO = 'vitalia:v1:';
  const MAX = (VT.config && VT.config.carrito.cantidadMaxima) || 10;

  const almacen = {
    leer(clave, defecto) {
      try {
        const v = localStorage.getItem(PREFIJO + clave);
        return v ? JSON.parse(v) : defecto;
      } catch (e) { return defecto; }
    },
    guardar(clave, valor) {
      try { localStorage.setItem(PREFIJO + clave, JSON.stringify(valor)); } catch (e) { /* almacenamiento no disponible */ }
    },
    borrar(clave) { try { localStorage.removeItem(PREFIJO + clave); } catch (e) { /* sin acceso */ } }
  };

  const limitar = (n) => Math.min(MAX, Math.max(1, Math.floor(Number(n)) || 1));
  const emitir = (nombre, detalle) => document.dispatchEvent(new CustomEvent(nombre, { detail: detalle }));

  function leerCarrito() {
    const crudo = almacen.leer('carrito', []);
    if (!Array.isArray(crudo)) return [];
    const vistos = new Set();
    return crudo.filter((it) => it && typeof it.id === 'string' && VT.catalogo.porId(it.id) && !vistos.has(it.id) && vistos.add(it.id))
      .map((it) => ({ id: it.id, cantidad: limitar(it.cantidad) }));
  }

  let items = leerCarrito();

  function persistir(cambio) {
    almacen.guardar('carrito', items);
    emitir('vt:carrito', cambio || {});
  }

  VT.carrito = {
    MAX,
    items: () => items.map((i) => ({ ...i })),
    lineas: () => items.map((i) => {
      const p = VT.catalogo.porId(i.id);
      return { producto: p, cantidad: i.cantidad, total: p.precio * i.cantidad };
    }),
    cantidad: (id) => (items.find((i) => i.id === id) || { cantidad: 0 }).cantidad,
    unidades: () => items.reduce((a, i) => a + i.cantidad, 0),
    subtotal: () => VT.carrito.lineas().reduce((a, l) => a + l.total, 0),
    // Devuelve la cantidad realmente añadida (puede ser menor si se alcanza el máximo).
    agregar(id, n = 1) {
      if (!VT.catalogo.porId(id)) return 0;
      const actual = items.find((i) => i.id === id);
      const antes = actual ? actual.cantidad : 0;
      const nueva = Math.min(MAX, antes + limitar(n));
      if (actual) actual.cantidad = nueva; else items.push({ id, cantidad: nueva });
      persistir({ tipo: 'agregar', id, añadidos: nueva - antes });
      return nueva - antes;
    },
    cambiar(id, n) {
      const it = items.find((i) => i.id === id);
      if (!it) return;
      it.cantidad = limitar(n);
      persistir({ tipo: 'cambiar', id });
    },
    quitar(id) {
      items = items.filter((i) => i.id !== id);
      persistir({ tipo: 'quitar', id });
    },
    vaciar() { items = []; persistir({ tipo: 'vaciar' }); },
    // Costo de envío del método elegido (precios demostrativos de config.js)
    envio(metodoId) {
      const m = VT.config.envios.find((e) => e.id === metodoId);
      if (!m) return 0;
      const gratis = VT.config.envioGratisDesde;
      return gratis != null && VT.carrito.subtotal() >= gratis ? 0 : m.precio;
    }
  };

  // ---------- favoritos ----------
  function leerFavoritos() {
    const crudo = almacen.leer('favoritos', []);
    return Array.isArray(crudo) ? [...new Set(crudo.filter((id) => typeof id === 'string' && VT.catalogo.porId(id)))] : [];
  }
  let favs = leerFavoritos();

  VT.favoritos = {
    lista: () => favs.slice(),
    tiene: (id) => favs.includes(id),
    alternar(id) {
      if (!VT.catalogo.porId(id)) return false;
      const ahora = !favs.includes(id);
      favs = ahora ? favs.concat(id) : favs.filter((f) => f !== id);
      almacen.guardar('favoritos', favs);
      emitir('vt:favoritos', { id, activo: ahora });
      return ahora;
    }
  };

  // Sincroniza entre pestañas
  window.addEventListener('storage', (e) => {
    if (e.key === PREFIJO + 'carrito') { items = leerCarrito(); emitir('vt:carrito', { tipo: 'externo' }); }
    if (e.key === PREFIJO + 'favoritos') { favs = leerFavoritos(); emitir('vt:favoritos', { tipo: 'externo' }); }
  });

  VT.almacen = almacen;
})(window.VT = window.VT || {});
