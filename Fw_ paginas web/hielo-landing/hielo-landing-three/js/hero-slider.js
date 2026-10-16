/* ==========================================================================
   hero-slider.js — carrusel de fotos del banner principal
   - Las fotos salen de SITE.heroDiapositivas (config.js): para cambiar una
     imagen basta con editar esa lista.
   - Cambia sola cada SITE.heroIntervalo ms con un fundido; botones anterior,
     pausa y siguiente; flechas ← → cuando el foco está en los controles.
   - Se detiene si el banner sale de pantalla, la pestaña se oculta o el
     visitante pulsa pausa. Con prefers-reduced-motion no rota sola.
   - Solo descarga la foto siguiente cuando está por mostrarse.
   ========================================================================== */
(function () {
  'use strict';

  var S = window.SITE || {};
  var fotos = (S.heroDiapositivas || []).filter(function (d) { return d && d.grande && d.alt; });
  var cont = document.getElementById('hero-fotos');
  var primera = cont && cont.querySelector('.hero-slide');
  if (!cont || !primera || !fotos.length) return;

  var reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var intervalo = reducido ? 0 : Math.max(0, Number(S.heroIntervalo) || 0);
  if (intervalo && intervalo < 4000) intervalo = 4000; // tiempo mínimo para leer

  function rutaSegura(r) { return typeof r === 'string' && /^assets\/[\w\-./]+\.(webp|jpe?g|png|avif)$/i.test(r) ? r : null; }

  function aplicar(pic, d) {
    var g = rutaSegura(d.grande), m = rutaSegura(d.mediana), mv = rutaSegura(d.movil);
    if (!g) return;
    var src = pic.querySelector('source');
    var img = pic.querySelector('img');
    if (src) {
      if (mv) src.srcset = mv; else src.remove();
    }
    img.src = m || g;
    img.srcset = (m ? m + ' 1200w, ' : '') + g + ' ' + (d.ancho || 1800) + 'w';
    img.sizes = '100vw';
    if (d.ancho && d.alto) { img.width = d.ancho; img.height = d.alto; }
    img.alt = d.alt;
    pic.dataset.cargada = '1';
  }

  // La primera foto ya está en el HTML (carga prioritaria). Si config.js la cambió, se sincroniza.
  var img0 = primera.querySelector('img');
  if (rutaSegura(fotos[0].grande) && img0.getAttribute('src') !== (rutaSegura(fotos[0].mediana) || fotos[0].grande)) aplicar(primera, fotos[0]);
  else primera.dataset.cargada = '1';

  var ctrl = document.getElementById('hero-ctrl');
  if (fotos.length < 2) { if (ctrl) ctrl.hidden = true; return; }

  // Resto de diapositivas: estructura vacía; la imagen se asigna al mostrarse.
  var slides = [primera];
  fotos.slice(1).forEach(function (d, i) {
    var pic = document.createElement('picture');
    pic.className = 'hero-slide';
    pic.dataset.slide = String(i + 1);
    pic.setAttribute('aria-hidden', 'true');
    var source = document.createElement('source');
    source.media = '(max-width: 767.98px)';
    source.sizes = '100vw';
    var img = document.createElement('img');
    img.decoding = 'async';
    img.alt = '';
    pic.appendChild(source);
    pic.appendChild(img);
    slides[slides.length - 1].after(pic);
    slides.push(pic);
  });

  var actual = 0, reloj = 0, pausado = false, visible = true;
  var botonPausa = document.getElementById('hero-pausa');
  var contador = document.getElementById('hero-count');
  var anuncio = document.getElementById('hero-anuncio');

  function precargar(i) {
    var pic = slides[i];
    if (pic && !pic.dataset.cargada) aplicar(pic, fotos[i]);
  }

  function mostrar(i, porUsuario) {
    i = (i + slides.length) % slides.length;
    if (i === actual) return;
    precargar(i);
    var nueva = slides[i], vieja = slides[actual];
    var img = nueva.querySelector('img');
    var cambiar = function () {
      nueva.classList.add('is-active');
      nueva.removeAttribute('aria-hidden');
      vieja.classList.remove('is-active');
      vieja.setAttribute('aria-hidden', 'true');
      actual = i;
      contador.textContent = (i + 1) + ' / ' + slides.length;
      // Solo se anuncia cuando el cambio lo pidió el visitante.
      if (porUsuario) anuncio.textContent = 'Foto ' + (i + 1) + ' de ' + slides.length + ': ' + fotos[i].alt;
      precargar((i + 1) % slides.length);
    };
    if (img.complete && img.naturalWidth) cambiar();
    else { img.addEventListener('load', cambiar, { once: true }); img.addEventListener('error', cambiar, { once: true }); }
  }

  function programar() {
    clearTimeout(reloj);
    reloj = 0;
    if (intervalo && !pausado && visible && !document.hidden) {
      reloj = setTimeout(function () { mostrar(actual + 1, false); programar(); }, intervalo);
    }
  }

  function pintarPausa() {
    if (!botonPausa) return;
    if (!intervalo) { botonPausa.hidden = true; return; }
    botonPausa.setAttribute('aria-pressed', pausado ? 'true' : 'false');
    botonPausa.setAttribute('aria-label', pausado ? 'Reanudar el cambio de fotos' : 'Pausar el cambio de fotos');
    botonPausa.querySelector('i').className = 'bi ' + (pausado ? 'bi-play-fill' : 'bi-pause-fill');
  }

  ctrl.hidden = false;
  contador.textContent = '1 / ' + slides.length;
  pintarPausa();

  ctrl.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    if (b === botonPausa) { pausado = !pausado; pintarPausa(); programar(); return; }
    var paso = Number(b.getAttribute('data-hero-ir'));
    if (paso) { mostrar(actual + paso, true); programar(); }
  });
  ctrl.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      mostrar(actual + (e.key === 'ArrowRight' ? 1 : -1), true);
      programar();
    }
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; programar(); }).observe(cont);
  }
  document.addEventListener('visibilitychange', programar);

  // Primera rotación cuando termina la entrada del hero (o enseguida si no hay animación).
  var iniciado = false;
  function iniciar() {
    if (iniciado) return;
    iniciado = true;
    precargar(1);
    programar();
  }
  document.addEventListener('hielo:hero-listo', iniciar);
  setTimeout(iniciar, document.documentElement.classList.contains('js-anim') ? 2600 : 300);
})();
