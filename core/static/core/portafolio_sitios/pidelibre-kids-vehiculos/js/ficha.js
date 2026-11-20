/* =========================================================================
   FICHA TÉCNICA — "Plano de taller" (producto.html)
   Solo usa datos reales de js/datos.js; lo que falta NO se inventa:
   se ofrece como pregunta por WhatsApp.
   - Plano acotado: vista lateral (foto + cotas de largo y alto) y vista
     superior (huella largo × ancho), las dos a la misma escala.
   - Placa de identificación: referencia, modelo, marca, motor, colores.
   - Frente al catálogo: largo y cilindraje comparados con los demás.
   - ¿Cabe por tu puerta?: calcula con el ancho y el alto reales.
   - Imprimir ficha: hoja limpia para tiendas y distribuidores.
   window.Tienda.ficha = { html(p), activar(p) }
   ========================================================================= */
(function () {
  "use strict";

  const T = window.Tienda;
  const { D, esc, wa, etiqueta, urlProducto } = T;

  /* ---------- lectura de datos ---------- */
  // "92 × 67 × 72 cm" → { largo, ancho, alto }
  const medidas = (p) => {
    const m = String((p.specs || {}).dimensiones || "").match(/([\d.,]+)\s*[×x]\s*([\d.,]+)\s*[×x]\s*([\d.,]+)/);
    if (!m) return null;
    const n = (v) => parseFloat(v.replace(",", "."));
    return { largo: n(m[1]), ancho: n(m[2]), alto: n(m[3]) };
  };
  const cc = (p) => { const m = String((p.specs || {}).cilindraje || "").match(/[\d.]+/); return m ? parseFloat(m[0]) : null; };
  const fmt = (n) => Number(n).toLocaleString("es-CO", { maximumFractionDigits: 1 });

  // datos que el cliente suele preguntar, según la propulsión
  const PREGUNTAS = {
    electrico: [["edad", "Edad recomendada", "la edad recomendada"], ["bateria", "Batería", "la batería (voltaje y capacidad)"],
      ["velocidad", "Velocidad", "la velocidad máxima"], ["autonomia", "Autonomía", "la autonomía por carga"],
      ["carga", "Tiempo de carga", "el tiempo de carga"], ["pesoMax", "Peso máximo", "el peso máximo que soporta"],
      ["ocupantes", "Ocupantes", "cuántos niños caben"], ["dimensiones", "Medidas", "las medidas (largo, ancho y alto)"]],
    gasolina: [["edad", "Edad recomendada", "la edad recomendada"], ["arranque", "Arranque", "el sistema de arranque"],
      ["transmision", "Transmisión", "la transmisión"], ["velocidad", "Velocidad", "la velocidad máxima"],
      ["pesoMax", "Peso máximo", "el peso máximo que soporta"], ["dimensiones", "Medidas", "las medidas (largo, ancho y alto)"]],
  };

  /* ---------- plano acotado (SVG, unidades en px de un lienzo de 640) ---------- */
  const VW = 640, IZQ = 84, DER = 24, ARR = 18;
  const escala = (m) => (VW - IZQ - DER) / m.largo;

  // cota con extremos en "T" y texto; pathLength=1 permite dibujarla al entrar en pantalla
  const cotaH = (x1, x2, y, valor, nombre) => `
    <g class="cota">
      <path pathLength="1" d="M${x1} ${y}H${x2}M${x1} ${y - 7}v14M${x2} ${y - 7}v14"/>
      <text class="cota__num" x="${(x1 + x2) / 2}" y="${y + 30}" text-anchor="middle">${fmt(valor)} cm <tspan class="cota__nom">${nombre}</tspan></text>
    </g>`;
  const cotaV = (y1, y2, x, valor, nombre) => `
    <g class="cota">
      <path pathLength="1" d="M${x} ${y1}V${y2}M${x - 7} ${y1}h14M${x - 7} ${y2}h14"/>
      <text class="cota__num" transform="translate(${x - 16} ${(y1 + y2) / 2}) rotate(-90)" text-anchor="middle">${fmt(valor)} cm <tspan class="cota__nom">${nombre}</tspan></text>
    </g>`;

  function vistaLateral(p, m, foto) {
    const s = escala(m), w = m.largo * s, h = m.alto * s, alto = ARR + h + 58;
    return `
      <figure class="plano__vista">
        <svg viewBox="0 0 ${VW} ${alto}" role="img" aria-label="Vista lateral: ${fmt(m.largo)} cm de largo y ${fmt(m.alto)} cm de alto">
          <rect class="plano__caja" x="${IZQ}" y="${ARR}" width="${w}" height="${h}"/>
          <image class="plano__foto" href="${esc(foto)}" x="${IZQ}" y="${ARR}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>
          <path class="plano__guia" d="M${IZQ} ${ARR + h}v26M${IZQ + w} ${ARR + h}v26M${IZQ} ${ARR}h-34M${IZQ} ${ARR + h}h-34"/>
          ${cotaH(IZQ, IZQ + w, ARR + h + 20, m.largo, "de largo")}
          ${cotaV(ARR, ARR + h, IZQ - 26, m.alto, "de alto")}
        </svg>
        <figcaption>Vista lateral</figcaption>
      </figure>`;
  }

  function vistaSuperior(m, ruedas) {
    const s = escala(m), w = m.largo * s, h = m.ancho * s, alto = ARR + h + ARR;
    // llantas: proporcionales a la huella, asomadas por los costados
    const lw = w * .2, lh = Math.max(10, h * .16), x0 = IZQ, y0 = ARR;
    const llanta = (x, y) => `<rect class="plano__llanta" x="${x}" y="${y}" width="${lw}" height="${lh}" rx="${lh / 3}"/>`;
    const centro = y0 + (h - lh) / 2, arriba = y0, abajo = y0 + h - lh;
    // p.ruedas: 2 (moto), 3 (una adelante y dos atrás) o 4 (por defecto)
    // las llantas de los costados asoman bajo la carrocería; las del centro van encima
    const costado = ruedas === 2 ? "" : ruedas === 3 ? llanta(x0 + w * .72, arriba) + llanta(x0 + w * .72, abajo)
      : llanta(x0 + w * .08, arriba) + llanta(x0 + w * .72, arriba) + llanta(x0 + w * .08, abajo) + llanta(x0 + w * .72, abajo);
    const encima = ruedas === 2 ? llanta(x0 + w * .04, centro) + llanta(x0 + w * .76, centro)
      : ruedas === 3 ? llanta(x0 + w * .04, centro) : "";
    return `
      <figure class="plano__vista">
        <svg viewBox="0 0 ${VW} ${alto}" role="img" aria-label="Vista superior: ${fmt(m.largo)} cm de largo y ${fmt(m.ancho)} cm de ancho">
          ${costado}
          <rect class="plano__huella" x="${x0 + 2}" y="${y0 + lh * .55}" width="${w - 4}" height="${h - lh * 1.1}" rx="${Math.min(22, h * .14)}"/>
          <path class="plano__eje" d="M${x0 + 14} ${y0 + h / 2}H${x0 + w - 14}"/>
          ${encima}
          <path class="plano__guia" d="M${IZQ} ${ARR}h-34M${IZQ} ${ARR + h}h-34"/>
          ${cotaV(ARR, ARR + h, IZQ - 26, m.ancho, "de ancho")}
        </svg>
        <figcaption>Vista superior, a la misma escala</figcaption>
      </figure>`;
  }

  function plano(p) {
    const m = medidas(p);
    if (m) {
      return `
        <div class="plano">
          <div class="plano__vistas">
            ${vistaLateral(p, m, p.fotoPlano || p.foto)}
            ${vistaSuperior(m, p.ruedas || 4)}
          </div>
          <p class="plano__nota">Medidas del fabricante, tomadas de su infografía. El dibujo de la vista superior es esquemático; las proporciones son reales.</p>
        </div>`;
    }
    const pedir = wa(`Hola, ¿me pueden enviar las medidas (largo, ancho y alto) del ${p.nombre} (ref. ${p.ref})?`);
    return `
      <div class="plano plano--sin-medidas">
        <figure class="plano__vista">
          <div class="plano__marco"><img src="${esc(p.foto)}" alt="${esc(p.nombre)}"${p.fotoAmbiente ? ' class="foto--ambiente"' : ""}></div>
        </figure>
        <p class="plano__pendiente">Todavía no publicamos las medidas de este modelo.
          ${pedir ? `<a href="${esc(pedir)}" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i> Pedir las medidas</a>` : ""}</p>
      </div>`;
  }

  /* ---------- placa de identificación ---------- */
  function placa(p) {
    const s = p.specs || {};
    const cat = D.categorias.find((c) => c.id === p.categoria) || {};
    const m = medidas(p);
    const filas = [
      ["Modelo", p.modelo !== p.ref ? p.modelo : null], ["Marca", p.marca], ["Tipo", cat.nombre],
      ["Motor", s.motor], ["Cilindraje", s.cilindraje], ["Batería", s.bateria], ["Potencia", s.potencia],
      ["Velocidad", s.velocidad], ["Autonomía", s.autonomia], ["Arranque", s.arranque], ["Transmisión", s.transmision],
      ["Edad recomendada", s.edad], ["Ocupantes", s.ocupantes], ["Peso máximo", s.pesoMax], ["Tiempo de carga", s.carga],
      ["Medidas", m ? `${fmt(m.largo)} × ${fmt(m.ancho)} × ${fmt(m.alto)} cm` : null],
      ["Garantía", p.garantia],
    ].filter(([, v]) => v !== null && v !== undefined && v !== "");
    const colores = p.colores || [];
    return `
      <aside class="placa" aria-label="Placa de identificación">
        <div class="placa__cabeza">${etiqueta(p)}<b class="placa__ref">${esc(p.ref)}</b></div>
        <dl class="placa__datos">${filas.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        ${colores.length ? `
        <div class="placa__colores">
          <p>${colores.length === 1 ? "Color de fábrica" : `${colores.length} colores de fábrica`}</p>
          <ul>${colores.map((c) => `
            <li><button type="button" class="placa__color" data-color="${esc(c.nombre)}" aria-label="Ver en ${esc(c.nombre)}">
              <img src="${esc(c.foto || p.foto)}" alt="" loading="lazy"><span><i style="background:${esc(c.hex)}"></i>${esc(c.nombre)}</span>
            </button></li>`).join("")}</ul>
        </div>` : ""}
      </aside>`;
  }

  /* ---------- frente al catálogo ---------- */
  function comparativa(p, titulo, valor, unidad) {
    const v = valor(p);
    if (v === null) return "";
    const otros = D.productos.filter((x) => valor(x) !== null).sort((a, b) => valor(a) - valor(b));
    if (otros.length < 2) return "";
    const max = Math.max(...otros.map(valor));
    const pos = otros.findIndex((x) => x.ref === p.ref) + 1;
    return `
      <div class="compara">
        <h3>${titulo}</h3>
        <p class="compara__sub">Puesto ${pos} de ${otros.length}, de menor a mayor.</p>
        <ol class="compara__lista">${otros.map((x) => {
          const yo = x.ref === p.ref;
          const nombre = yo ? `<b>${esc(x.nombre)}</b>` : `<a href="${esc(urlProducto(x.ref))}">${esc(x.nombre)}</a>`;
          return `<li class="${yo ? "es-este" : ""}"${yo ? ' aria-current="true"' : ""}>
            <span class="compara__nombre">${nombre}</span>
            <span class="compara__barra"><i style="--v:${(valor(x) / max).toFixed(3)}"></i></span>
            <span class="compara__valor">${fmt(valor(x))} ${unidad}</span></li>`;
        }).join("")}</ol>
      </div>`;
  }

  /* ---------- ¿cabe por tu puerta? ---------- */
  function puerta(p) {
    const m = medidas(p);
    if (!m) return "";
    return `
      <div class="puerta">
        <h3>¿Cabe por tu puerta?</h3>
        <p class="puerta__sub">Mide el ancho libre de la puerta, con la hoja abierta, y escríbelo aquí.</p>
        <label class="puerta__campo">
          <span>Ancho de tu puerta</span>
          <span class="puerta__input"><input id="puerta-cm" type="number" inputmode="numeric" min="30" max="300" value="80" aria-describedby="puerta-res"><span>cm</span></span>
        </label>
        <p id="puerta-res" class="puerta__res" aria-live="polite"></p>
      </div>`;
  }
  function resultadoPuerta(m, cm) {
    if (!(cm > 0)) return { clase: "", texto: "Escribe el ancho en centímetros." };
    if (m.ancho + 2 <= cm) return { clase: "si", texto: `Pasa de frente: mide ${fmt(m.ancho)} cm de ancho y te sobran ${fmt(cm - m.ancho)} cm.` };
    if (m.alto + 2 <= cm) return { clase: "casi", texto: `De frente no pasa (${fmt(m.ancho)} cm de ancho), pero inclinado de lado sí: su alto es ${fmt(m.alto)} cm. Pide ayuda a otro adulto para moverlo.` };
    return { clase: "no", texto: `No pasa: mide ${fmt(m.ancho)} cm de ancho y ${fmt(m.alto)} cm de alto. Se puede entregar en un espacio exterior o por un acceso más ancho.` };
  }

  /* ---------- datos que faltan: se preguntan, no se inventan ---------- */
  function faltantes(p) {
    const s = p.specs || {};
    const lista = (PREGUNTAS[p.propulsion] || []).filter(([k]) => !s[k]);
    if (!lista.length || !wa()) return "";
    return `
      <div class="faltan">
        <h3>Pregunta lo que necesitas saber</h3>
        <p>Estos datos aún no están publicados para la referencia ${esc(p.ref)}. Te respondemos con la ficha del fabricante.</p>
        <ul>${lista.map(([, nombre, frase]) => `
          <li><a href="${esc(wa(`Hola, ¿me confirman ${frase} del ${p.nombre} (ref. ${p.ref})?`))}" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i> ${esc(nombre)}</a></li>`).join("")}</ul>
      </div>`;
  }

  /* ---------- ensamblado ---------- */
  function html(p) {
    const comp = [
      comparativa(p, "Largo frente al catálogo", (x) => (medidas(x) || {}).largo ?? null, "cm"),
      comparativa(p, "Cilindraje frente al catálogo", cc, "cc"),
    ].join("");
    const util = puerta(p) + faltantes(p);
    return `
      <section class="ficha-tec prop-borde--${esc(p.propulsion)}" id="ficha" aria-labelledby="ficha-tit">
        <header class="ficha-tec__cabeza">
          <div>
            <h2 class="titulo" id="ficha-tit">Ficha técnica</h2>
            <p class="ficha-tec__de">${esc(p.nombre)}, referencia ${esc(p.ref)}</p>
          </div>
          <button type="button" class="btn-secundario ficha-tec__imprimir" id="imprimir-ficha"><i class="bi bi-printer"></i> Imprimir ficha</button>
        </header>
        <div class="ficha-tec__hoja">
          ${plano(p)}
          <div class="ficha-tec__bajo">
            ${placa(p)}
            ${comp ? `<div class="ficha-tec__compara">${comp}</div>` : ""}
          </div>
        </div>
        ${util ? `<div class="ficha-tec__util">${util}</div>` : ""}
        <p class="ficha-tec__fuente">Datos de la ficha y las fotos del fabricante. Si un dato no aparece es porque aún no está confirmado.</p>
      </section>`;
  }

  function activar(p, alElegirColor) {
    const raiz = document.getElementById("ficha");
    if (!raiz) return;

    // las cotas se dibujan una sola vez, al llegar al plano
    const plano = raiz.querySelector(".plano");
    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (plano && !quieto && "IntersectionObserver" in window) {
      plano.classList.add("plano--animar");
      const io = new IntersectionObserver((ents) => {
        if (ents.some((e) => e.isIntersecting)) { plano.classList.add("plano--visible"); io.disconnect(); }
      }, { threshold: .35 });
      io.observe(plano);
    }

    // puerta
    const m = medidas(p), inp = raiz.querySelector("#puerta-cm"), res = raiz.querySelector("#puerta-res");
    if (m && inp && res) {
      const calc = () => { const r = resultadoPuerta(m, parseFloat(inp.value)); res.className = `puerta__res ${r.clase}`; res.textContent = r.texto; };
      inp.addEventListener("input", calc);
      calc();
    }

    // colores de la placa: eligen el color en el formulario de compra
    raiz.addEventListener("click", (e) => {
      const b = e.target.closest(".placa__color");
      if (b && alElegirColor) alElegirColor(b.dataset.color);
    });

    const imp = raiz.querySelector("#imprimir-ficha");
    if (imp) imp.addEventListener("click", () => {
      if (plano) plano.classList.add("plano--visible");
      document.body.classList.add("imprimiendo-ficha");
      window.print();
    });
    window.addEventListener("afterprint", () => document.body.classList.remove("imprimiendo-ficha"));
  }

  T.ficha = { html, activar, medidas };
})();
