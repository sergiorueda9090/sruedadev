/* ==========================================================================
   snow.js — altura del hero a pantalla completa y nieve sobre la foto
   - La nieve se dibuja en un <canvas> solo dentro del hero.
   - Se detiene cuando el hero sale de pantalla o la pestaña se oculta.
   - Botón «Pausar nieve» (contenido en movimiento que arranca solo debe
     poder pausarse); la preferencia se recuerda en este navegador.
   - Con prefers-reduced-motion no hay nieve.
   ========================================================================== */
(function () {
  'use strict';

  var hero = document.querySelector('.hero');
  if (!hero) return;
  var raiz = document.documentElement;

  /* Altura: el hero ocupa la pantalla que queda bajo la barra y el menú. */
  function medir() {
    var top = Math.max(0, Math.round(hero.getBoundingClientRect().top + window.scrollY));
    raiz.style.setProperty('--hero-top', top + 'px');
  }
  medir();
  window.addEventListener('resize', medir, { passive: true });
  window.addEventListener('load', medir);

  var canvas = hero.querySelector('.snow');
  var boton = document.getElementById('snow-toggle');
  var reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canvas || !canvas.getContext || reducido) {
    if (canvas) canvas.hidden = true;
    return;
  }

  var ctx = canvas.getContext('2d');
  var CLAVE = 'hielo.nieve';
  var copos = [];
  var ancho = 0, alto = 0, dpr = 1;
  var visible = true, pausado = false, iniciado = false;
  var raf = 0, ultimo = 0, t = 0;

  try { pausado = localStorage.getItem(CLAVE) === 'pausa'; } catch (e) { /* sin almacenamiento */ }

  // Copo pre-renderizado: un punto con borde suave, más barato que dibujar gradientes por copo.
  var sprite = document.createElement('canvas');
  sprite.width = sprite.height = 32;
  (function () {
    var s = sprite.getContext('2d');
    var g = s.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.45, 'rgba(255,255,255,.85)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    s.fillStyle = g;
    s.fillRect(0, 0, 32, 32);
  })();

  function copo(arriba) {
    var r = Math.pow(Math.random(), 1.8) * 3.4 + 0.8;   // muchos pequeños, pocos grandes
    return {
      x: Math.random() * ancho,
      y: arriba ? -10 - Math.random() * alto * 0.3 : Math.random() * alto,
      r: r,
      vy: 18 + r * 14 + Math.random() * 12,               // px/s: los grandes caen más rápido (más cerca)
      fase: Math.random() * Math.PI * 2,
      osc: 8 + Math.random() * 18,
      a: 0.35 + Math.min(0.55, r / 6)
    };
  }

  function ajustar() {
    var rect = canvas.getBoundingClientRect();
    ancho = rect.width; alto = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(ancho * dpr);
    canvas.height = Math.round(alto * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.min(140, Math.round((ancho * alto) / 11000));
    while (copos.length < n) copos.push(copo(false));
    copos.length = n;
  }

  function cuadro(ahora) {
    var dt = Math.min(0.05, (ahora - (ultimo || ahora)) / 1000);
    ultimo = ahora;
    t += dt;
    var viento = Math.sin(t * 0.25) * 14 + 6;            // ráfaga suave y lenta
    ctx.clearRect(0, 0, ancho, alto);
    for (var i = 0; i < copos.length; i++) {
      var c = copos[i];
      c.y += c.vy * dt;
      c.x += (viento * (c.r / 3) + Math.sin(t * 1.1 + c.fase) * c.osc * 0.4) * dt;
      if (c.y > alto + 8) { copos[i] = copo(true); continue; }
      if (c.x > ancho + 8) c.x = -8; else if (c.x < -8) c.x = ancho + 8;
      var d = c.r * 2.4;
      ctx.globalAlpha = c.a;
      ctx.drawImage(sprite, c.x - d / 2, c.y - d / 2, d, d);
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(cuadro);
  }

  function actualizar() {
    var debe = iniciado && visible && !pausado && !document.hidden;
    if (debe && !raf) { ultimo = 0; raf = requestAnimationFrame(cuadro); }
    if (!debe && raf) { cancelAnimationFrame(raf); raf = 0; }
    canvas.classList.toggle('is-on', iniciado && !pausado);
  }

  function pintarBoton() {
    if (!boton) return;
    boton.setAttribute('aria-pressed', pausado ? 'true' : 'false');
    boton.querySelector('span').textContent = pausado ? 'Volver a nevar' : 'Detener nieve';
    boton.querySelector('i').className = 'bi ' + (pausado ? 'bi-play-fill' : 'bi-pause-fill');
  }

  function iniciar() {
    if (iniciado) return;
    iniciado = true;
    ajustar();
    if (boton) boton.hidden = false;
    pintarBoton();
    actualizar();
  }

  if (boton) {
    boton.addEventListener('click', function () {
      pausado = !pausado;
      try { localStorage.setItem(CLAVE, pausado ? 'pausa' : 'activa'); } catch (e) { /* sin almacenamiento */ }
      pintarBoton();
      actualizar();
    });
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; actualizar(); }).observe(hero);
  }
  document.addEventListener('visibilitychange', actualizar);
  window.addEventListener('resize', function () { if (iniciado) ajustar(); }, { passive: true });

  // Empieza cuando la foto termina de aclararse; sin animación de entrada, enseguida.
  document.addEventListener('hielo:hero-listo', iniciar);
  setTimeout(iniciar, raiz.classList.contains('js-anim') ? 2600 : 300);
})();
