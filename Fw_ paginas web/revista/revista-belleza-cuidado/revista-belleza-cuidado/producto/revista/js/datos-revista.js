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
    limpieza: "bi-water", tonicos: "bi-droplet-half", serums: "bi-eyedropper",
    hidratacion: "bi-moisture", "proteccion-solar": "bi-sun", kits: "bi-gift",
  };
  const tipos = {};
  K.categorias.forEach((c) => { tipos[c.id] = { nombre: c.nombre, icono: ICONOS[c.id] || "bi-circle", color: c.color }; });

  window.REVISTA = {
    modoPrueba: C.modo !== "publicacion",
    avisoPrueba: "Precios de referencia (noviembre de 2026): confirma disponibilidad por WhatsApp",
    mostrarRef: false,                               // la tienda no usa referencias visibles
    temporada: "Edición 2026",
    tipos,

    fotoPresentacion: img("revista/presentacion-1000.webp"),
    fotosApertura: [img("revista/apertura-1-1000.webp"), img("revista/apertura-2-1000.webp"), img("revista/apertura-3-1000.webp")],
    apertura: {
      titulo: "Una rutina en pocos pasos",
      intro: "La línea Madagascar Centella de SKIN1004, ordenada como se usa: limpiar, tonificar, tratar, hidratar y proteger.",
      guia: [
        { icono: "bi-list-ol", titulo: "Sigue el orden", texto: "Limpieza, tónico, sérum o ampolla, crema y, de día, protector solar." },
        { icono: "bi-person-check", titulo: "Elige por tu piel", texto: "Hay opciones para piel sensible, mixta o grasa y para dar luminosidad." },
        { icono: "bi-whatsapp", titulo: "Pregúntanos", texto: "Te ayudamos por WhatsApp a armar tu rutina y confirmar disponibilidad." },
      ],
    },

    negocio: {
      nombre: C.marca.nombre,
      descripcion: C.marca.descripcion,
      tipo: "Tienda de skincare coreano",
      publico: "Personas que arman su rutina de cuidado facial y quienes buscan un regalo",
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
      subtitulo: "SKIN1004 Madagascar Centella: limpieza, tónicos, sérums, cremas y protección solar. Elige en la revista y pide por WhatsApp.",
      foto: img("revista/portada-1000.webp"),
    },

    propuesta: [
      { icono: "bi-patch-check", titulo: "Registro INVIMA", texto: "Cada ficha muestra el registro sanitario y los ingredientes destacados." },
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
        { icono: "bi-card-text", titulo: "Lee el envase", texto: "Ingredientes completos, modo de uso y advertencias." },
        { icono: "bi-hand-index", titulo: "Prueba en piel", texto: "Aplica un poco en una zona pequeña antes del primer uso." },
        { icono: "bi-sun", titulo: "Protector de día", texto: "Si usas tónicos o sérums con ácidos, aplica protector solar." },
        { icono: "bi-person-heart", titulo: "Consulta", texto: "Si tu piel reacciona o tienes una condición, consulta a un dermatólogo." },
      ],
    },
    contacto: {
      titulo: "Tu rutina de skincare empieza aquí",
      sub: "Escríbenos por WhatsApp y te ayudamos a elegir según tu tipo de piel.",
    },

    categorias: K.categorias.map((c) => ({ id: c.id, nombre: c.nombre, propulsion: c.id, intro: c.resumen })),

    productos: K.productos.map((p) => {
      return {
        // en la revista el nombre va sin la línea; la línea se muestra junto a la marca
        ref: p.id, categoria: p.categoria, nombre: p.nombre.replace(/^Madagascar Centella\s+/, ""), propulsion: p.categoria,
        marca: [p.marca, /^Madagascar Centella/.test(p.nombre) && "Madagascar Centella"].filter(Boolean).join(" · ") || null, modelo: null,
        foto: R + K.imagen(p, "frente", 900),
        fotos: K.vistasDe(p).map((v) => R + K.imagen(p, v.id, 900)),
        descripcion: p.resumen,
        specs: {
          contenido: p.contenido || null,
          // varios registros (kits): se resume; la lista completa está en la ficha web
          registro: p.registro ? (p.registro.includes(",") ? `${p.registro.split(",").length} registros NSOC` : p.registro) : null,
          ingredientes: (p.ingredientes || []).slice(0, 3).join(", ") || null,
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

  // créditos: fotos de producto y de ambiente de la marca, del catálogo público del distribuidor
  window.CREDITOS_FOTOS = {
    "Portada, aperturas y productos": { archivo: "Fotografías de producto SKIN1004", pagina: "https://lineaestetica.co/Skin-1004/", autor: "SKIN1004 (Craver Corporation)", licencia: "derechos de la marca" },
  };
})();
