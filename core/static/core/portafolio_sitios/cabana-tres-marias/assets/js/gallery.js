/*
 * Cabaña Las Tres Marías — galería y visor de fotos.
 * Filtros de la galería + un visor accesible (Escape, flechas, foco atrapado,
 * fondo bloqueado) que también usan las fotos de «Conoce cada espacio».
 */
(function () {
  'use strict';

  var App = window.TMApp;
  if (!App) return;
  var $ = App.$, $$ = App.$$;

  var NOTES = {
    ilustrativa: 'Foto ilustrativa, no es la cabaña',
    referencia: 'Paisaje de referencia, lugar por confirmar'
  };

  /* ---------- 1. Visor ---------- */
  var lb = $('#lightbox');
  var img = $('#lb-img');
  var cap = $('#lb-caption');
  var count = $('#lb-count');
  var btnClose = $('#lb-close'), btnPrev = $('#lb-prev'), btnNext = $('#lb-next');
  var items = [], index = 0, opener = null;
  var outside = ['.site-header', 'main', '.site-footer', '.wa-float', '.review-bar'];

  function show(i) {
    index = (i + items.length) % items.length;
    var it = items[index];
    img.src = it.src;
    img.alt = it.alt;
    cap.textContent = it.caption;
    if (NOTES[it.tipo]) {
      var note = document.createElement('span');
      note.className = 'photo-note';
      note.textContent = NOTES[it.tipo];
      cap.appendChild(note);
    }
    count.textContent = (index + 1) + ' de ' + items.length;
    var many = items.length > 1;
    btnPrev.hidden = !many;
    btnNext.hidden = !many;
    // Precarga la siguiente.
    if (many) { var pre = new Image(); pre.src = items[(index + 1) % items.length].src; }
  }

  function open(list, i, from) {
    if (!list.length) return;
    items = list;
    opener = from || document.activeElement;
    var sbw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = sbw ? sbw + 'px' : '';
    document.body.classList.add('lb-open');
    outside.forEach(function (s) { var n = $(s); if (n) n.setAttribute('inert', ''); });
    lb.hidden = false;
    show(i);
    btnClose.focus();
    document.addEventListener('keydown', onKey);
  }

  function close() {
    lb.hidden = true;
    img.src = 'data:,';
    document.body.classList.remove('lb-open');
    document.body.style.paddingRight = '';
    outside.forEach(function (s) { var n = $(s); if (n) n.removeAttribute('inert'); });
    document.removeEventListener('keydown', onKey);
    if (opener && opener.focus) opener.focus();
  }

  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowRight' && items.length > 1) { e.preventDefault(); show(index + 1); }
    else if (e.key === 'ArrowLeft' && items.length > 1) { e.preventDefault(); show(index - 1); }
    else if (e.key === 'Tab') {
      var f = [btnClose, btnPrev, btnNext].filter(function (b) { return !b.hidden; });
      var pos = f.indexOf(document.activeElement);
      e.preventDefault();
      var next = e.shiftKey ? (pos <= 0 ? f.length - 1 : pos - 1) : (pos + 1) % f.length;
      f[next].focus();
    }
  }

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', function () { show(index - 1); });
  btnNext.addEventListener('click', function () { show(index + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-stage')) close(); });

  // Deslizar en pantallas táctiles.
  var x0 = null;
  lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (x0 === null || items.length < 2) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    x0 = null;
  });

  window.TMLightbox = { open: open, close: close };

  /* ---------- 2. Fotos de los espacios ---------- */
  var spaceBtns = $$('[data-lb="espacios"]');
  function spaceItem(b) {
    var im = $('img', b);
    return { src: b.getAttribute('data-full'), alt: im.alt, caption: b.getAttribute('data-caption'), tipo: b.getAttribute('data-tipo') };
  }
  spaceBtns.forEach(function (b, i) {
    // El nombre accesible incluye el texto visible de la etiqueta (WCAG 2.5.3).
    var note = $('.photo-note', b);
    b.setAttribute('aria-label', 'Ampliar: ' + b.getAttribute('data-caption') + (note ? '. ' + note.textContent : ''));
    b.addEventListener('click', function () { open(spaceBtns.map(spaceItem), i, b); });
  });

  /* ---------- 3. Galería con filtros ---------- */
  var grid = $('#g-grid');
  if (!grid) return;
  var figures = $$('.g-item', grid);
  var filters = $$('.g-filter');
  var status = $('#g-status');
  var empty = $('#g-empty');

  function visible() { return figures.filter(function (f) { return !f.hidden; }); }

  function galleryItem(f) {
    var b = $('.g-open', f), im = $('img', f);
    return { src: b.getAttribute('data-full'), alt: im.alt, caption: f.querySelector('figcaption').firstChild.textContent.trim(), tipo: b.getAttribute('data-tipo') };
  }

  function apply(cat, announce) {
    figures.forEach(function (f) { f.hidden = cat !== 'todas' && f.getAttribute('data-cat') !== cat; });
    filters.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-filter') === cat ? 'true' : 'false'); });
    var n = visible().length;
    empty.hidden = n > 0;
    if (announce) status.textContent = n === 1 ? '1 foto' : n + ' fotos';
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  filters.forEach(function (b) {
    var cat = b.getAttribute('data-filter');
    // Una categoría sin fotos solo se muestra en revisión.
    if (cat !== 'todas' && !App.revision && !figures.some(function (f) { return f.getAttribute('data-cat') === cat; })) b.hidden = true;
    b.addEventListener('click', function () { apply(cat, true); });
  });

  grid.addEventListener('click', function (e) {
    var b = e.target.closest('.g-open');
    if (!b) return;
    var list = visible();
    open(list.map(galleryItem), list.indexOf(b.closest('.g-item')), b);
  });

  apply('todas', false);
  status.textContent = figures.length + ' fotos';
})();
