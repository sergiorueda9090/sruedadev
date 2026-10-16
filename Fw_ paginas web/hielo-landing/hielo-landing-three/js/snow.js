/* ==========================================================================
   snow.js — altura del hero a pantalla completa y efecto de hielo que cae
   - Copos de nieve y cubos 🧊 dibujados en un <canvas> solo dentro del hero
     (SITE.heroEfectos activa o desactiva cada uno).
   - El emoji se pre-renderiza una vez; si el sistema no tiene fuente de emoji
     en color, se dibuja un cubo vectorial equivalente.
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

  var efectos = Object.assign({ copos: true, cubos: true }, (window.SITE || {}).heroEfectos || {});
  if (!efectos.copos && !efectos.cubos) { canvas.hidden = true; return; }
  var ctx = canvas.getContext('2d');
  var CLAVE = 'hielo.efecto';
  var copos = [];
  var cubos = [];
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

  // Cubo 🧊 pre-renderizado (64 px). Se comprueba que el emoji salga en color.
  var cuboSprite = document.createElement('canvas');
  cuboSprite.width = cuboSprite.height = 64;
  (function () {
    var c = cuboSprite.getContext('2d');
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = '52px "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", "Twemoji Mozilla", sans-serif';
    c.fillStyle = '#000';
    c.fillText('\u{1F9CA}', 32, 35);
    var d = c.getImageData(0, 0, 64, 64).data, color = 0;
    for (var i = 0; i < d.length; i += 4) {
      if (d[i + 3] > 40 && (Math.abs(d[i] - d[i + 1]) > 18 || Math.abs(d[i + 1] - d[i + 2]) > 18)) color++;
    }
    if (color > 60) return; // emoji en color disponible
    // Alternativa: cubo de hielo dibujado (cara frontal, cara superior y brillo).
    c.clearRect(0, 0, 64, 64);
    c.lineJoin = 'round';
    c.fillStyle = 'rgba(214, 242, 247, .92)';
    c.strokeStyle = 'rgba(120, 190, 205, .95)';
    c.lineWidth = 2;
    c.beginPath(); c.moveTo(12, 22); c.lineTo(44, 22); c.lineTo(44, 54); c.lineTo(12, 54); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = 'rgba(240, 252, 255, .95)';
    c.beginPath(); c.moveTo(12, 22); c.lineTo(22, 12); c.lineTo(54, 12); c.lineTo(44, 22); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = 'rgba(170, 222, 233, .95)';
    c.beginPath(); c.moveTo(44, 22); c.lineTo(54, 12); c.lineTo(54, 44); c.lineTo(44, 54); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(255, 255, 255, .95)'; c.lineWidth = 3; c.lineCap = 'round';
    c.beginPath(); c.moveTo(18, 30); c.lineTo(18, 42); c.stroke();
  })();

  function cubo(arriba) {
    var lado = 18 + Math.random() * 22;
    // En pantallas anchas, la mayoría cae a la derecha para no tapar el titular.
    var x = ancho >= 992 && Math.random() < 0.7 ? ancho * (0.5 + Math.random() * 0.5) : Math.random() * ancho;
    return {
      x: x,
      y: arriba ? -lado - Math.random() * alto * 0.5 : Math.random() * alto,
      lado: lado,
      vy: 34 + lado * 1.6 + Math.random() * 20,
      ang: Math.random() * Math.PI * 2,
      giro: (Math.random() - 0.5) * 1.2,              // rad/s
      a: 0.7 + Math.random() * 0.25
    };
  }

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
    var n = efectos.copos ? Math.min(110, Math.round((ancho * alto) / 13000)) : 0;
    while (copos.length < n) copos.push(copo(false));
    copos.length = n;
    var nc = efectos.cubos ? Math.max(5, Math.min(16, Math.round(ancho / 95))) : 0;
    while (cubos.length < nc) cubos.push(cubo(false));
    cubos.length = nc;
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
    for (var j = 0; j < cubos.length; j++) {
      var k = cubos[j];
      k.y += k.vy * dt;
      k.x += viento * 0.35 * dt;
      k.ang += k.giro * dt;
      if (k.y > alto + k.lado) { cubos[j] = cubo(true); continue; }
      if (k.x > ancho + k.lado) k.x = -k.lado;
      ctx.globalAlpha = k.a;
      ctx.save();
      ctx.translate(k.x, k.y);
      ctx.rotate(k.ang);
      ctx.drawImage(cuboSprite, -k.lado / 2, -k.lado / 2, k.lado, k.lado);
      ctx.restore();
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
    boton.querySelector('span').textContent = pausado ? 'Reanudar efecto' : 'Detener efecto';
    boton.querySelector('i').className = 'bi ' + (pausado ? 'bi-play-fill' : 'bi-snow');
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
