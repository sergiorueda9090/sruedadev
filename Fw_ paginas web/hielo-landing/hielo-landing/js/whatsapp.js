/* ==========================================================================
   whatsapp.js — construcción segura de enlaces wa.me
   Solo genera enlaces si SITE.contacto.whatsapp es un número válido
   (solo dígitos, con indicativo de país). Nunca usa un número de ejemplo.
   ========================================================================== */
(function () {
  'use strict';

  var LIMITE_TEXTO = 1500; // wa.me acepta textos largos, pero se recorta por seguridad

  function numero() {
    var site = window.SITE || {};
    var n = site.contacto && site.contacto.whatsapp;
    if (typeof n !== 'string') return null;
    n = n.replace(/\D/g, '');
    // Colombia: 57 + 10 dígitos. Se aceptan otros países entre 10 y 15 dígitos.
    return /^\d{10,15}$/.test(n) ? n : null;
  }

  function disponible() {
    return numero() !== null;
  }

  function url(mensaje) {
    var n = numero();
    if (!n) return null;
    var texto = String(mensaje || '').slice(0, LIMITE_TEXTO);
    return 'https://wa.me/' + n + (texto ? '?text=' + encodeURIComponent(texto) : '');
  }

  var mensajes = {
    general: function () {
      return 'Hola, quisiera recibir información y una cotización de hielo para mi negocio.';
    },
    producto: function (nombre) {
      return 'Hola, quisiera recibir información y una cotización de ' + nombre +
        '. Me gustaría conocer las presentaciones disponibles, el precio por volumen y las condiciones de entrega.';
    },
    cobertura: function () {
      return 'Hola, quisiera saber si tienen cobertura de entrega en mi zona y cuáles son las condiciones de entrega.';
    }
  };

  window.Hielo = window.Hielo || {};
  window.Hielo.wa = { numero: numero, disponible: disponible, url: url, mensajes: mensajes };
})();
