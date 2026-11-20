/* =========================================================================
   REVISTA VITALIA — datos
   La revista NO tiene catálogo propio: lee la tienda (../assets/js/config.js y
   ../assets/js/products.js) y arma window.REVISTA para el maquetador (revista.js).
   Cambiar un producto, un precio o el WhatsApp en la tienda cambia la revista.
   Aquí solo van los textos propios de la revista (portada, apertura, pasos…).
   ========================================================================= */
(function () {
  "use strict";

  const VT = window.VT || {};
  const C = VT.config, K = VT.catalogo;
  if (!C || !K) { console.error("Revista: faltan config.js o products.js de la tienda"); return; }

  const R = "../";                                   // raíz de la tienda vista desde /revista/
  const img = (ruta) => R + "assets/images/" + ruta;
  const numero = (C.contacto.whatsapp || "").replace(/\D/g, "");
  // "573143801560" → "+57 314 380 1560"
  const numeroVisible = numero.length === 12 && numero.startsWith("57")
    ? `+57 ${numero.slice(2, 5)} ${numero.slice(5, 8)} ${numero.slice(8)}` : (numero ? `+${numero}` : null);
  const red = (n) => ((C.redes || []).find((r) => r.nombre === n) || {}).url || null;

  // tipo = categoría de la tienda: nombre, icono y color propio de la tienda
  const ICONOS = {
    "bienestar-diario": "bi-cup-hot", nutricion: "bi-basket2", vitaminas: "bi-capsule",
    "cuidado-personal": "bi-droplet", cosmetica: "bi-flower1", accesorios: "bi-bag",
  };
  const tipos = {};
  K.categorias.forEach((c) => { tipos[c.id] = { nombre: c.nombre, icono: ICONOS[c.id] || "bi-circle", color: c.color }; });

  window.REVISTA = {
    modoPrueba: C.modo !== "publicacion",
    avisoPrueba: "Marca de demostración: productos y precios de ejemplo",
    mostrarRef: false,                               // la tienda no usa referencias visibles
    temporada: "Edición 2026",
    tipos,

    fotoPresentacion: img("editorial/rutina-1100.webp"),
    fotosApertura: [img("editorial/suplemento-1100.webp"), img("editorial/etiquetas-1100.webp"), img("editorial/alimentacion-1100.webp")],
    apertura: {
      titulo: "Una rutina que se entiende",
      intro: "Productos de bienestar, nutrición y cuidado personal con la etiqueta a la vista, para decidir con calma.",
      guia: [
        { icono: "bi-card-checklist", titulo: "Lee la etiqueta", texto: "Composición, presentación y advertencias de cada producto, antes de comprar." },
        { icono: "bi-person-heart", titulo: "Consulta si lo necesitas", texto: "Si tomas medicamentos o estás en embarazo, habla primero con un profesional de la salud." },
        { icono: "bi-whatsapp", titulo: "Pregúntanos", texto: "Te respondemos por WhatsApp sobre presentaciones y disponibilidad." },
      ],
    },

    negocio: {
      nombre: C.marca.nombre,
      descripcion: C.marca.descripcion,
      tipo: "Tienda de bienestar y cuidado personal",
      publico: "Personas que organizan su rutina de bienestar y quienes buscan un regalo",
      pais: "Colombia",
      ciudad: C.contacto.ciudad || null,
      whatsapp: numeroVisible,
      whatsappLink: numero ? `https://wa.me/${numero}` : null,
      telefono: null, direccion: null,
      instagram: red("Instagram"), facebook: red("Facebook"),
      sitioWeb: null,                                // el dominio de config.js aún es un marcador
      correo: C.contacto.correo || null,
      cobertura: null,
      logo: img("icons/favicon.svg"),
      moneda: C.moneda.codigo,
    },

    portada: {
      titulo: C.marca.lema,
      subtitulo: "Bienestar diario, nutrición, vitaminas, cuidado personal y cosmética. Elige en la revista y pide por WhatsApp.",
      foto: img("hero/retrato-1000.webp"),
    },

    propuesta: [
      { icono: "bi-card-checklist", titulo: "Etiqueta abierta", texto: "Composición y advertencias visibles en cada ficha." },
      { icono: "bi-whatsapp", titulo: "Pedidos por WhatsApp", texto: "Arma tu carrito y envíanos el pedido en un mensaje." },
      { icono: "bi-truck", titulo: "Envíos en Colombia", texto: "Te confirmamos costo y tiempo según tu ciudad." },
    ],
    pasos: [
      { titulo: "Elige tus productos", texto: "Agrégalos al carrito desde la revista o la tienda." },
      { titulo: "Completa tus datos", texto: "Dirección, envío y forma de pago que prefieres." },
      { titulo: "Envía el pedido por WhatsApp", texto: "Se abre el mensaje con todo listo; solo lo envías." },
      { titulo: "Confirmamos y despachamos", texto: "Te respondemos con el total final y el pago." },
    ],
    antes: {
      titulo: "Antes de usar",
      items: [
        { icono: "bi-card-text", titulo: "Lee la etiqueta", texto: "Porción, modo de uso y advertencias del fabricante." },
        { icono: "bi-hand-index", titulo: "Prueba en piel", texto: "En cosméticos, aplica un poco en el antebrazo primero." },
        { icono: "bi-thermometer-half", titulo: "Conserva bien", texto: "Lugar fresco y seco, con el envase bien cerrado." },
        { icono: "bi-person-heart", titulo: "Consulta", texto: "Si tienes una condición de salud, pregunta a tu profesional." },
      ],
    },
    contacto: {
      titulo: "Tu rutina de bienestar empieza aquí",
      sub: "Escríbenos por WhatsApp y te ayudamos a elegir.",
    },

    categorias: K.categorias.map((c) => ({ id: c.id, nombre: c.nombre, propulsion: c.id, intro: c.resumen })),

    productos: K.productos.map((p) => {
      const e = p.envase || {};
      return {
        ref: p.id, categoria: p.categoria, nombre: p.nombre, marca: null, modelo: null, propulsion: p.categoria,
        foto: R + K.imagen(p, "frente", 900),
        fotos: K.vistasDe(p).map((v) => R + K.imagen(p, v.id, 900)),
        descripcion: p.resumen,
        specs: {
          contenido: e.contenido || null,
          medida: e.medida || null,
          ingredientes: (p.ingredientes || []).slice(0, 2).join(", ") || null,
        },
        especiales: (p.beneficios || []).map((b) => b.titulo),
        colores: [],
        precio: p.precio,
        precioAnterior: p.precioAnterior || null,
        etiqueta: p.etiqueta || null,
        disponible: true,
        garantia: null,
        url: R + "pages/producto.html?id=" + encodeURIComponent(p.id),
      };
    }),
  };

  // créditos de las fotos de Unsplash usadas en la revista (licencia Unsplash; detalle en assets/images/credits.json)
  window.CREDITOS_FOTOS = {
    "Portada": { archivo: "Mujer bajo la luz de la mañana", pagina: "https://unsplash.com/photos/GaRBZn-6yS0", autor: "Roman Manshin", licencia: "Licencia Unsplash", licencia_url: "https://unsplash.com/license" },
    "Presentación": { archivo: "Cuaderno, café y bolígrafos", pagina: "https://unsplash.com/photos/ndzacdfVECo", autor: "Mengkol Smile", licencia: "Licencia Unsplash", licencia_url: "https://unsplash.com/license" },
    "Apertura 1": { archivo: "Frascos de vidrio en una despensa", pagina: "https://unsplash.com/photos/CNs9I5uJ83s", autor: "Cabri Caldwell", licencia: "Licencia Unsplash", licencia_url: "https://unsplash.com/license" },
    "Apertura 2": { archivo: "Etiqueta de un empaque de avena", pagina: "https://unsplash.com/photos/As7P6QTLuUY", autor: "Paul Einerhand", licencia: "Licencia Unsplash", licencia_url: "https://unsplash.com/license" },
    "Apertura 3": { archivo: "Puesto de mercado con verduras", pagina: "https://unsplash.com/photos/Zaiuy5dKeCk", autor: "Shelley Pauls", licencia: "Licencia Unsplash", licencia_url: "https://unsplash.com/license" },
  };
})();
