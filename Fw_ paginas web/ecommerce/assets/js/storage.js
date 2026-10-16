/* ==========================================================================
   ESSENCE & TIME — Persistencia local
   Envoltorio de localStorage con claves versionadas (et:v1:<clave>),
   tolerante a JSON corrupto, cuota llena o almacenamiento bloqueado.
   AVISO: localStorage es editable por el usuario. Nada de lo que aquí se
   guarda es fiable para un comercio real; los módulos que lo consumen
   recalculan precios y validan stock contra el catálogo en cada lectura.
   ========================================================================== */
(function (ET) {
  'use strict';

  const { namespace, version } = ET.config.storage;
  const prefix = `${namespace}:v${version}:`;
  const memory = new Map(); // respaldo si localStorage no está disponible

  let available = true;
  try {
    const probe = `${prefix}__probe`;
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
  } catch (e) {
    available = false;
  }

  const storage = {
    available,

    get(key, fallback = null) {
      try {
        const raw = available ? window.localStorage.getItem(prefix + key) : memory.get(key);
        if (raw == null) return fallback;
        return JSON.parse(raw);
      } catch (e) {
        return fallback;
      }
    },

    set(key, value) {
      const raw = JSON.stringify(value);
      try {
        if (available) window.localStorage.setItem(prefix + key, raw);
        else memory.set(key, raw);
        return true;
      } catch (e) {
        memory.set(key, raw);
        return false;
      }
    },

    remove(key) {
      try {
        if (available) window.localStorage.removeItem(prefix + key);
      } catch (e) { /* sin acción */ }
      memory.delete(key);
    },

    /** Notifica cambios hechos en otra pestaña para la clave indicada. */
    onExternalChange(key, handler) {
      window.addEventListener('storage', (ev) => {
        if (ev.key === prefix + key) handler();
      });
    },
  };

  ET.storage = storage;
})(window.ET);
