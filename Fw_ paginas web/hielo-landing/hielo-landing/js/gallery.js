/* ==========================================================================
   gallery.js — visor de la galería con <dialog> nativo
   Teclado: Enter/Espacio abre, ← → navegan, Escape cierra y el foco
   vuelve a la miniatura que abrió el visor.
   ========================================================================== */
(function () {
  'use strict';

  var items = Array.prototype.slice.call(document.querySelectorAll('.g-item'));
  var dialogo = document.getElementById('lightbox');
  if (!items.length || !dialogo) return;

  // Sin soporte de <dialog>: la miniatura abre la foto grande directamente.
  if (typeof dialogo.showModal !== 'function') {
    items.forEach(function (b) { b.addEventListener('click', function () { location.href = b.dataset.full; }); });
    return;
  }

  var img = document.getElementById('lightbox-img');
  var pie = document.getElementById('lightbox-caption');
  var contador = document.getElementById('lightbox-count');
  var actual = 0;
  var origen = null;

  function mostrar(i) {
    actual = (i + items.length) % items.length;
    var b = items[actual];
    var mini = b.querySelector('img');
    img.src = b.dataset.full;
    img.alt = mini ? mini.alt : '';
    pie.textContent = (b.dataset.caption || '') + ' (foto de referencia)';
    contador.textContent = (actual + 1) + ' de ' + items.length;
  }

  items.forEach(function (b, i) {
    b.setAttribute('aria-haspopup', 'dialog');
    var mini = b.querySelector('img');
    b.setAttribute('aria-label', 'Ampliar: ' + (b.dataset.caption || (mini && mini.alt) || 'foto'));
    b.addEventListener('click', function () {
      origen = b;
      mostrar(i);
      dialogo.showModal();
      dialogo.querySelector('[data-lb="close"]').focus();
    });
  });

  dialogo.addEventListener('click', function (e) {
    var accion = e.target.closest('[data-lb]');
    if (accion) {
      var a = accion.dataset.lb;
      if (a === 'prev') mostrar(actual - 1);
      else if (a === 'next') mostrar(actual + 1);
      else dialogo.close();
      return;
    }
    // Clic fuera de la imagen (sobre el fondo) cierra.
    if (e.target === dialogo) dialogo.close();
  });

  dialogo.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); mostrar(actual - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); mostrar(actual + 1); }
  });

  dialogo.addEventListener('close', function () {
    img.removeAttribute('src');
    if (origen) origen.focus();
  });
})();
