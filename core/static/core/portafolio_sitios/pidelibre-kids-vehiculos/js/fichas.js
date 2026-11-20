/* GENERADO por tools/datos_negocio.py desde datos-del-negocio/*.csv. No editar a mano:
   cambia los CSV y vuelve a ejecutar  python3 tools/datos_negocio.py importar  */
(function () {
  const D = window.REVISTA;
  if (!D) return;
  const NEGOCIO = {};
  const PRODUCTOS = {
  "SX2128": {
    "disponible": true
  },
  "X15A": {
    "disponible": true
  },
  "S313": {
    "disponible": true,
    "specs": {
      "dimensiones": "92 × 67 × 72 cm"
    }
  },
  "S618": {
    "disponible": true,
    "specs": {
      "bateria": "12 V",
      "dimensiones": "86 × 63 × 64 cm"
    }
  },
  "FT699": {
    "disponible": true,
    "specs": {
      "dimensiones": "83 × 82 × 89 cm",
      "ocupantes": "2"
    }
  },
  "UNIMOG": {
    "disponible": true,
    "marca": "Mercedes-Benz (licencia)"
  },
  "017": {
    "disponible": true
  },
  "MCE-83": {
    "disponible": true
  },
  "ME-68": {
    "disponible": true
  },
  "MT3": {
    "disponible": true,
    "specs": {
      "edad": "2 a 5 años",
      "dimensiones": "84 × 44 × 57 cm"
    }
  },
  "MA010": {
    "disponible": true,
    "specs": {
      "motor": "2 tiempos",
      "cilindraje": "50 cc",
      "dimensiones": "100 × 59 × 53 cm"
    }
  },
  "ATV008": {
    "disponible": true,
    "specs": {
      "motor": "4 tiempos",
      "cilindraje": "125 cc",
      "dimensiones": "160 × 95 × 100 cm"
    }
  },
  "ATV011": {
    "disponible": true,
    "specs": {
      "motor": "4 tiempos",
      "cilindraje": "180 cc",
      "dimensiones": "170 × 103 × 93 cm"
    }
  },
  "MQ-01": {
    "disponible": true
  },
  "KXD708": {
    "disponible": true,
    "marca": "KMV",
    "specs": {
      "motor": "2 tiempos",
      "cilindraje": "50 cc"
    }
  },
  "DB-005": {
    "disponible": true,
    "specs": {
      "motor": "2 tiempos",
      "cilindraje": "60 cc"
    }
  },
  "KMV502": {
    "disponible": true,
    "marca": "KMV",
    "specs": {
      "motor": "4 tiempos",
      "cilindraje": "110 cc"
    }
  },
  "MC-NK": {
    "disponible": true
  },
  "MC-27": {
    "disponible": true
  },
  "MC-MB": {
    "disponible": true
  },
  "PB-01": {
    "disponible": true
  },
  "PB-02": {
    "disponible": true
  }
};
  Object.assign(D.negocio, NEGOCIO);
  D.productos.forEach((p) => {
    const a = PRODUCTOS[p.ref];
    if (!a) return;
    const { specs, ...resto } = a;
    p.specs = Object.assign(p.specs || {}, specs || {});
    Object.assign(p, resto);
  });
})();
