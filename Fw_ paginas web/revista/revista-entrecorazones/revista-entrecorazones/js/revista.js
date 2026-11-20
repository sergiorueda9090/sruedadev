/* =========================================================================
   VISOR TIPO REVISTA — usa StPageFlip (vendor/page-flip)
   Espera a que catalogo.js termine de paginar y pasa cada página A4 a una
   hoja del libro. El PDF (index.html) no se ve afectado.
   ========================================================================= */
(function () {
  "use strict";

  const A4_W = 793.7; // 210 mm a 96 dpi
  const A4_H = 1122.5; // 297 mm a 96 dpi
  const RATIO = A4_W / A4_H;

  document.addEventListener("catalogo:listo", iniciar);

  /* ---------- confirmación de mayoría de edad ----------
     Se pide una vez por sesión del navegador. Si el almacenamiento no está
     disponible (modo privado), simplemente se vuelve a preguntar. */
  (function edad() {
    const CLAVE = "revista:mayor18";
    const caja = document.getElementById("edad");
    if (!caja) return;
    let ok = false;
    try { ok = sessionStorage.getItem(CLAVE) === "si"; } catch (_) {}
    if (ok) return;
    caja.hidden = false;
    document.body.classList.add("edad-abierta");
    document.getElementById("edadSi").focus();
    document.getElementById("edadSi").onclick = () => {
      try { sessionStorage.setItem(CLAVE, "si"); } catch (_) {}
      caja.hidden = true;
      document.body.classList.remove("edad-abierta");
    };
    document.getElementById("edadNo").onclick = () => {
      document.querySelector(".edad__botones").hidden = true;
      document.getElementById("edadSalida").hidden = false;
    };
  })();

  /* ---------- sonido de hoja (sintetizado con Web Audio, sin archivos) ----------
     Ruido filtrado con barrido de frecuencia = roce del papel, más un golpe
     grave muy suave al asentarse la hoja. */
  const Sonido = (() => {
    const CLAVE = "revista:sonido";
    let ctx = null;
    let activo = true;
    try { activo = localStorage.getItem(CLAVE) !== "off"; } catch (_) {}

    function contexto() {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
      }
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    }

    function ruido(c, segundos) {
      const buf = c.createBuffer(1, Math.floor(c.sampleRate * segundos), c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src = c.createBufferSource();
      src.buffer = buf;
      return src;
    }

    let ultimo = 0;
    function hoja() {
      if (!activo) return;
      const ahora = performance.now();
      if (ahora - ultimo < 250) return; // evita sonidos duplicados
      ultimo = ahora;
      const c = contexto();
      if (!c) return;
      const t = c.currentTime;
      const dur = 0.42 + Math.random() * 0.08;
      const variacion = 0.85 + Math.random() * 0.3;

      // roce del papel
      const src = ruido(c, dur);
      const bp = c.createBiquadFilter();
      bp.type = "bandpass";
      bp.Q.value = 0.9;
      bp.frequency.setValueAtTime(900 * variacion, t);
      bp.frequency.exponentialRampToValueAtTime(3800 * variacion, t + dur * 0.55);
      bp.frequency.exponentialRampToValueAtTime(1400 * variacion, t + dur);
      const hp = c.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 400;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.22, t + 0.06);
      g.gain.setValueAtTime(0.22, t + dur * 0.45);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(bp).connect(hp).connect(g).connect(c.destination);
      src.start(t);
      src.stop(t + dur);

      // la hoja se asienta
      const t2 = t + dur * 0.8;
      const golpe = ruido(c, 0.12);
      const lp = c.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 500;
      const g2 = c.createGain();
      g2.gain.setValueAtTime(0.0001, t2);
      g2.gain.exponentialRampToValueAtTime(0.18, t2 + 0.01);
      g2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.12);
      golpe.connect(lp).connect(g2).connect(c.destination);
      golpe.start(t2);
      golpe.stop(t2 + 0.12);
    }

    return {
      hoja,
      get activo() { return activo; },
      alternar() {
        activo = !activo;
        try { localStorage.setItem(CLAVE, activo ? "on" : "off"); } catch (_) {}
        if (activo) contexto();
        return activo;
      },
    };
  })();

  function iniciar() {
    const visor = document.querySelector(".visor");
    const escenario = document.getElementById("escenario");
    const libro = document.getElementById("libro");
    const paginas = [...document.querySelectorAll("#catalogo > .pagina")];
    const total = paginas.length;

    // Envolver cada página A4 en una hoja del libro
    const hojas = paginas.map((p, i) => {
      const h = document.createElement("div");
      h.className = "hoja";
      if (i === 0 || i === total - 1) h.dataset.density = "hard"; // portada y contraportada rígidas
      h.appendChild(p);
      libro.appendChild(h);
      return h;
    });

    // El libro ocupa el alto disponible; StPageFlip decide si muestra doble página
    // o una sola (pantallas angostas) y mantiene la proporción A4.
    function ajustarAlto() {
      const cs = getComputedStyle(escenario);
      libro.style.height = escenario.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) + "px";
    }
    ajustarAlto();

    const inicial = Math.min(Math.max((parseInt((location.hash.match(/p=(\d+)/) || [])[1], 10) || 1) - 1, 0), total - 1);
    const flip = new St.PageFlip(libro, {
      width: Math.round(A4_W),
      height: Math.round(A4_H),
      size: "stretch",
      minWidth: 260, // por debajo de 2 × 260 px de ancho pasa a una sola página
      maxWidth: Math.round(A4_W),
      minHeight: Math.round(260 / RATIO),
      maxHeight: Math.round(A4_H),
      showCover: true,
      usePortrait: true,
      drawShadow: true,
      maxShadowOpacity: 0.45,
      flippingTime: 900,
      mobileScrollSupport: false,
      useMouseEvents: true,
      clickEventForward: true, // permite hacer clic en el enlace de WhatsApp
      startPage: inicial, // revista.html#p=5 abre en la página 5
    });
    flip.loadFromHTML(hojas);

    // Escala de la página A4 dentro de la hoja
    const escalar = () => {
      const k = flip.getRender().getRect().pageWidth / A4_W;
      if (k > 0) libro.style.setProperty("--k", k.toFixed(4));
    };
    escalar();

    let t;
    window.addEventListener("resize", () => {
      ajustarAlto();
      clearTimeout(t);
      t = setTimeout(() => { flip.update(); escalar(); }, 120);
    });

    /* ---------- controles ---------- */
    const $ = (id) => document.getElementById(id);
    const contador = $("contador");
    function actualizar() {
      const i = flip.getCurrentPageIndex();
      const portrait = flip.getOrientation() === "portrait";
      let txt;
      if (portrait || i === 0 || i === total - 1) txt = `${i + 1}`;
      else {
        const izq = i % 2 === 1 ? i : i - 1; // con portada sola, las dobles empiezan en impares
        txt = izq + 1 < total ? `${izq + 1}–${izq + 2}` : `${izq + 1}`;
      }
      contador.textContent = `${txt} / ${total}`;
      $("btnAnterior").disabled = $("btnInicio").disabled = i === 0;
      $("btnSiguiente").disabled = $("btnFin").disabled = i >= total - (portrait ? 1 : 2) && i !== 0;
      escalar();
    }
    flip.on("flip", (e) => {
      actualizar();
      history.replaceState(null, "", `#p=${e.data + 1}`);
    });
    flip.on("changeOrientation", actualizar);
    flip.on("changeState", (e) => { if (e.data === "flipping") Sonido.hoja(); });
    flip.on("init", actualizar);

    // Ir a una página con sonido (solo si realmente cambia de página)
    const irA = (accion) => {
      const antes = flip.getCurrentPageIndex();
      accion();
      if (flip.getState() === "flipping" || flip.getCurrentPageIndex() !== antes) Sonido.hoja();
    };
    const siguiente = () => irA(() => flip.flipNext());
    const anterior = () => irA(() => flip.flipPrev());
    const irPagina = (n) => { if (n !== flip.getCurrentPageIndex()) irA(() => flip.flip(n)); };

    $("btnAnterior").onclick = anterior;
    $("btnSiguiente").onclick = siguiente;
    $("btnInicio").onclick = () => irPagina(0);
    $("btnFin").onclick = () => irPagina(total - 1);
    const pintarSonido = () => {
      $("btnSonido").innerHTML = `<i class="bi ${Sonido.activo ? "bi-volume-up" : "bi-volume-mute"}"></i>`;
      $("btnSonido").title = Sonido.activo ? "Silenciar sonido" : "Activar sonido";
    };
    pintarSonido();
    $("btnSonido").onclick = () => { Sonido.alternar(); pintarSonido(); };

    // Enlaces internos (índice): pasar la hoja hasta la sección en lugar de saltar
    libro.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const destino = document.getElementById(a.getAttribute("href").slice(1));
      const idx = destino ? hojas.indexOf(destino.closest(".hoja")) : -1;
      if (idx >= 0) {
        e.preventDefault();
        irPagina(idx);
      }
    });

    /* ---------- lupa: páginas visibles ampliadas ----------
       Clona las páginas A4 que se ven en el libro y las muestra a un tamaño
       legible, con scroll. Los enlaces (WhatsApp, Instagram) siguen activos;
       los enlaces del índice cierran la lupa y pasan la hoja. */
    const lupa = $("lupa");
    const lupaCont = $("lupaContenido");
    let zoom = 0; // 0 = ajustar al ancho
    const visibles = () => {
      const i = flip.getCurrentPageIndex();
      if (flip.getOrientation() === "portrait" || i === 0 || i === total - 1) return [i];
      const izq = i % 2 === 1 ? i : i - 1;
      return izq + 1 < total ? [izq, izq + 1] : [izq];
    };
    function pintarLupa() {
      const idx = visibles();
      const disponible = lupaCont.clientWidth - 32;
      // En pantallas angostas, ajustar al ancho deja la letra muy chica: se abre al 90 %
      // y se recorre la página con desplazamiento horizontal.
      const ajuste = Math.max(Math.min(disponible / A4_W, 1.5), 0.9);
      const k = zoom || ajuste;
      $("lupaNivel").textContent = Math.round(k * 100) + "%";
      lupaCont.innerHTML = "";
      idx.forEach((n) => {
        const clon = paginas[n].cloneNode(true);
        clon.removeAttribute("id");
        clon.querySelectorAll("[id]").forEach((x) => x.removeAttribute("id"));
        clon.style.transform = `scale(${k})`;
        const marco = document.createElement("div");
        marco.className = "lupa__pagina";
        marco.style.width = A4_W * k + "px";
        marco.style.height = A4_H * k + "px";
        marco.appendChild(clon);
        lupaCont.appendChild(marco);
      });
      return ajuste;
    }
    function abrirLupa() {
      zoom = 0;
      lupa.hidden = false;
      document.body.classList.add("lupa-abierta");
      pintarLupa();
      lupaCont.scrollTop = 0;
      $("lupaCerrar").focus();
    }
    function cerrarLupa() {
      lupa.hidden = true;
      document.body.classList.remove("lupa-abierta");
      $("btnLupa").focus();
    }
    const cambiarZoom = (d) => {
      const actual = zoom || pintarLupa();
      zoom = Math.min(Math.max(+(actual + d).toFixed(2), 0.5), 2.5);
      pintarLupa();
    };
    $("btnLupa").onclick = abrirLupa;
    $("lupaCerrar").onclick = cerrarLupa;
    $("lupaMas").onclick = () => cambiarZoom(0.15);
    $("lupaMenos").onclick = () => cambiarZoom(-0.15);
    lupa.addEventListener("click", (e) => {
      if (e.target === lupa || e.target === lupaCont) return cerrarLupa();
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      const destino = document.getElementById(a.getAttribute("href").slice(1));
      const idx = destino ? hojas.indexOf(destino.closest(".hoja")) : -1;
      cerrarLupa();
      if (idx >= 0) irPagina(idx);
    });
    window.addEventListener("resize", () => { if (!lupa.hidden && !zoom) pintarLupa(); });

    $("btnPantalla").onclick = () =>
      document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();

    document.addEventListener("keydown", (e) => {
      if (document.body.classList.contains("edad-abierta")) return;
      if (document.body.classList.contains("lupa-abierta")) {
        if (e.key === "Escape") cerrarLupa();
        if (e.key === "+" || e.key === "=") cambiarZoom(0.15);
        if (e.key === "-") cambiarZoom(-0.15);
        return;
      }
      if (e.key === "z" || e.key === "Z") abrirLupa();
      if (e.key === "ArrowRight" || e.key === "PageDown") siguiente();
      if (e.key === "ArrowLeft" || e.key === "PageUp") anterior();
      if (e.key === "Home") irPagina(0);
      if (e.key === "End") irPagina(total - 1);
    });

    actualizar();
    visor.classList.add("visor--listo");
  }
})();
