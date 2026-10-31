/* Completa el aviso de privacidad con los datos de config.js */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var s = window.SITE || {};
    document.querySelectorAll('[data-bind="marca.nombre"]').forEach(function (n) { if (s.marca && s.marca.nombre) n.textContent = s.marca.nombre; });
    var a = s.aviso || {};
    var r = document.getElementById('responsable');
    if (r && a.responsable) r.textContent = a.responsable + (a.nit ? ', NIT ' + a.nit : '');
  });
})();
