/* VITALIA — configuración central de la tienda.
 * Es el único archivo que se edita al recibir los datos reales de un cliente.
 * Todo dato vacío ('' o null) se oculta o se marca «Por configurar» en la interfaz.
 * Los productos, precios y opiniones están en products.js.
 */
(function (VT) {
  'use strict';

  VT.config = {
    // 'revision' muestra los avisos de prototipo y los datos por confirmar;
    // 'publicacion' los oculta (cámbialo solo cuando todo el contenido sea real).
    modo: 'revision',

    marca: {
      nombre: 'VITALIA',
      lema: 'Bienestar que se siente',
      descripcion: 'Productos de bienestar, nutrición y cuidado personal elegidos con información clara, para que decidas con calma qué entra en tu rutina.',
      conceptual: true // marca ficticia de portafolio: activa los avisos de demostración
    },

    // Dominio definitivo sin barra final. tools/seo.py lo usa para canonical, Open Graph y sitemap.
    dominio: 'https://vitalia.sruedadev.com',

    moneda: { codigo: 'COP', locale: 'es-CO' },

    contacto: {
      // Número en formato internacional sin «+» ni espacios (p. ej. '573001234567').
      // Vacío a propósito: no se publica un número inventado. Sin número, el botón
      // de WhatsApp muestra el mensaje preparado y explica que falta configurarlo.
      whatsapp: '',
      mensajeWhatsapp: 'Hola, quiero recibir información sobre los productos de VITALIA.',
      mensajeProducto: 'Hola, quiero recibir información sobre {producto} de VITALIA.',
      correo: '',
      horario: '',
      ciudad: ''
    },

    // Redes de ejemplo: sin URL se muestran como «de ejemplo», sin enlace.
    redes: [
      { nombre: 'Instagram', icono: 'instagram', url: '' },
      { nombre: 'Facebook', icono: 'facebook', url: '' },
      { nombre: 'TikTok', icono: 'tiktok', url: '' },
      { nombre: 'YouTube', icono: 'youtube', url: '' }
    ],

    // Métodos de envío del checkout. Precios demostrativos en COP.
    envios: [
      { id: 'estandar', nombre: 'Envío estándar', detalle: 'Tiempo de entrega por confirmar con la transportadora', precio: 12000 },
      { id: 'express', nombre: 'Envío prioritario', detalle: 'Solo en ciudades principales, por confirmar', precio: 22000 },
      { id: 'recogida', nombre: 'Recoger en punto aliado', detalle: 'Puntos de entrega por definir', precio: 0 }
    ],
    // null = sin envío gratuito configurado (no se promete en ninguna parte).
    envioGratisDesde: null,

    // Ilustrativos: el checkout no procesa pagos.
    pagos: [
      { id: 'tarjeta', nombre: 'Tarjeta débito o crédito', icono: 'credit-card-2-front', detalle: 'Se pagaría en la pasarela, nunca en esta página.' },
      { id: 'pse', nombre: 'PSE', icono: 'bank', detalle: 'Transferencia desde tu banco a través de la pasarela.' },
      { id: 'efectivo', nombre: 'Pago en efectivo', icono: 'cash-coin', detalle: 'Corresponsales y puntos de pago de la pasarela.' },
      { id: 'contraentrega', nombre: 'Contraentrega', icono: 'box-seam', detalle: 'Sujeto a cobertura de la transportadora.' }
    ],

    cupones: {}, // sin cupones configurados

    departamentos: ['Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D. C.', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada'],

    carrito: { cantidadMaxima: 10 },

    animaciones: {
      activas: true,     // false desactiva GSAP en todo el sitio
      duracion: 0.9,
      desplazamiento: 28 // px que recorre un elemento al aparecer
    },

    desarrollador: { nombre: 'SRuedaDev', url: 'https://sruedadev.com/' }
  };
})(window.VT = window.VT || {});
