/* =========================================================================
   MESA DORADA — MAQUETADOR (PDF + revista)
   Cada categoría abre página propia con su diseño:
   - "lista": página gris, fotos redondas con pestaña naranja (4 por página)
   - "arcos": página crema, fotos en arco en 3 columnas (6 por página)
   Si una categoría no cabe, continúa en otra página del mismo diseño.
   ========================================================================= */
(function () {
  "use strict";

  const D = window.CATALOGO;
  const N = D.negocio;
  const raiz = document.getElementById("catalogo");

  /* ---------- utilidades ---------- */
  const esc = (v) =>
    String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const vacio = (v) => v === null || v === undefined || v === "";
  const pendiente = (campo) => `<span class="pendiente">Pendiente: ${esc(campo)}</span>`;
  const valor = (v, campo) => (vacio(v) ? pendiente(campo) : esc(v));
  const fmtPrecio = (p) =>
    vacio(p) ? pendiente("precio") : `$${Number(p).toLocaleString("es-CO", { maximumFractionDigits: 0 })}<small>${esc(N.moneda)}</small>`;
  const el = (html) => {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };
  const deCategoria = (id) => D.productos.filter((x) => x.categoria === id);
  const divisor = (cls = "") => `<div class="divisor ${cls}"><span></span></div>`;

  /* ---------- enlaces ---------- */
  const wa = (t) => (N.whatsappLink ? N.whatsappLink + (t ? `?text=${encodeURIComponent(t)}` : "") : null);
  const insta = () =>
    N.instagram ? (/^https?:/.test(N.instagram) ? N.instagram : `https://instagram.com/${N.instagram.replace(/^@/, "")}`) : null;
  const mapa = () => (N.direccion ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(N.direccion)}` : null);
  const enlace = (url, html, cls = "") =>
    url ? `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener">${html}</a>` : html;
  const MSG = "Hola, vi la carta y quiero hacer un pedido";
  const botonPedir = (x) => {
    const url = x.disponible === false ? null : wa(`Hola, quiero pedir: ${x.nombre} (${x.ref})`);
    return url ? `<a class="btn-pedir" data-ref="${esc(x.ref)}" href="${esc(url)}" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i>Pedir</a>` : "";
  };
  const qrSvg = (texto) => {
    if (!texto || typeof qrcode !== "function") return "";
    const q = qrcode(0, "M");
    q.addData(texto);
    q.make();
    return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
  };
  const cintaPrueba = () => (D.modoPrueba ? `<div class="cinta-prueba">DATOS DE PRUEBA</div>` : "");

  /* ---------- página interior ---------- */
  function paginaInterior(seccion, fondo) {
    const p = el(`
      <section class="pagina fondo-${esc(fondo)}">
        ${cintaPrueba()}
        <header class="pagina__header">
          <div class="marca"><img src="${esc(N.logo)}" alt=""><span>${esc(N.nombre)}</span></div>
          <div class="seccion">${esc(seccion)}</div>
        </header>
        <div class="pagina__cuerpo"></div>
        <footer class="pagina__footer">
          ${enlace(wa(MSG), `<span><i class="bi bi-whatsapp"></i>Pedidos y reservas: ${valor(N.whatsapp, "WhatsApp")}</span>`)}
          <span class="linea"></span>
          <span class="num"></span>
        </footer>
      </section>`);
    raiz.appendChild(p);
    return p;
  }
  const cuerpo = (p) => p.querySelector(".pagina__cuerpo");
  const desborda = (c) => c.scrollHeight > c.clientHeight + 1;

  /* ---------- 1. portada ---------- */
  function portada() {
    const dest = D.productos.filter((x) => x.foto && x.ref !== (D.productos.find((y) => y.foto === N.fotoPortada) || {}).ref);
    const mini = [dest.find((x) => x.categoria === "postres"), dest.find((x) => x.categoria === "favoritos")].filter(Boolean);
    raiz.appendChild(el(`
      <section class="pagina portada">
        ${cintaPrueba()}
        <img class="portada__logo" src="${esc(N.logo)}" alt="Logo ${esc(N.nombre)}">
        <div class="portada__kicker">${esc(N.subtitulo || "Nuestra carta")}</div>
        <h1><em>${esc(N.nombre)}</em><span>Nuestra carta</span></h1>
        ${divisor("divisor--cafe divisor--centro")}
        <div class="portada__escena">
          <div class="arco__foto"><img src="${esc(N.fotoPortada)}" alt=""></div>
          ${mini[0] ? `<div class="mini mini--izq"><img src="${esc(mini[0].foto)}" alt=""></div>` : ""}
          ${mini[1] ? `<div class="mini mini--der"><img src="${esc(mini[1].foto)}" alt=""></div>` : ""}
        </div>
        <div class="portada__eslogan">${valor(N.eslogan, "eslogan")}</div>
        <div class="portada__pie">
          <div>
            <div>${enlace(wa(MSG), `<i class="bi bi-whatsapp"></i>${valor(N.whatsapp, "WhatsApp")}`)}</div>
            <div><i class="bi bi-clock"></i>${valor(N.horario, "horario")}</div>
            <div>${enlace(insta(), `<i class="bi bi-instagram"></i>${valor(N.instagram, "Instagram")}`)}</div>
          </div>
          <div class="qr">${qrSvg(wa(MSG))}</div>
        </div>
        ${D.modoPrueba ? `<div class="credito-foto" style="color:#fff">Fotos de referencia: TheMealDB / TheCocktailDB</div>` : ""}
      </section>`));
  }

  /* ---------- 2. bienvenida ---------- */
  function bienvenida() {
    const p = paginaInterior("Bienvenidos", "gris");
    const tres = D.productos.filter((x) => x.destacado && x.foto).slice(0, 3);
    cuerpo(p).innerHTML = `
      <h2 class="titulo-lista">Bienvenidos a la mesa</h2>
      ${divisor()}
      <p class="bienvenida__texto">${valor(N.descripcion, "descripción")}</p>
      <dl class="ficha">
        <div><dt>Cocina</dt><dd>${valor(N.tipoComida, "tipo de comida")}</dd></div>
        <div><dt>Horario</dt><dd>${valor(N.horario, "horario")}</dd></div>
        <div><dt>Dirección</dt><dd>${enlace(mapa(), valor(N.direccion, "dirección") + ' <i class="bi bi-box-arrow-up-right small"></i>')}</dd></div>
        <div><dt>Reservas</dt><dd>${enlace(wa("Hola, quiero hacer una reserva"), valor(N.reservas, "reservas"))}</dd></div>
      </dl>
      <div class="trio">
        ${tres.map((x) => `<figure><div class="circulo"><img src="${esc(x.foto)}" alt=""></div><figcaption>${esc(x.nombre)}</figcaption></figure>`).join("")}
      </div>
      ${wa() ? `
      <aside class="reserva">
        <div>
          <h3>Reserva tu mesa</h3>
          <p>Escríbenos por WhatsApp con el día, la hora y el número de personas.</p>
          ${enlace(wa("Hola, quiero reservar una mesa"), `<i class="bi bi-whatsapp"></i>Reservar por WhatsApp`, "btn-pedir")}
        </div>
        <div class="qr">${qrSvg(wa("Hola, quiero reservar una mesa"))}</div>
      </aside>` : ""}`;
  }

  /* ---------- 3. índice ---------- */
  function indice() {
    const p = paginaInterior("Contenido", "crema");
    cuerpo(p).innerHTML = `
      <h2 class="titulo-arcos"><em>${esc(N.nombre)}</em><span>Nuestra carta</span></h2>
      ${divisor("divisor--cafe divisor--centro")}
      ${D.categorias.map((c) => {
        const l = deCategoria(c.id);
        if (!l.length) return "";
        const f = (l.find((x) => x.foto) || {}).foto;
        return `
          <a class="indice__item" href="#cat-${esc(c.id)}">
            <div class="indice__thumb">${f ? `<img src="${esc(f)}" alt="">` : ""}</div>
            <div><div class="indice__nombre">${esc(c.nombre)}</div><div class="indice__intro">${esc(c.intro)}</div></div>
            <span class="indice__puntos"></span>
            <span class="indice__pagina" data-indice="${esc(c.id)}"></span>
          </a>`;
      }).join("")}
      <p class="indice__ayuda">Toca una sección para ir directo a ella.</p>`;
  }

  /* ---------- tarjetas ---------- */
  function itemLista(x) {
    return el(`
      <article class="item" data-ref="${esc(x.ref)}">
        <div class="item__texto">
          <h3 class="item__nombre">${esc(x.nombre)}</h3>
          <p class="item__desc">${valor(x.descripcion, "descripción")}</p>
          <div class="item__pie">
            <span class="precio">${fmtPrecio(x.precio)}</span>
            ${botonPedir(x)}
            <span class="ref">${esc(x.ref)}</span>
          </div>
        </div>
        <div class="item__foto">
          <div class="circulo">
            ${x.foto ? `<img src="${esc(x.foto)}" alt="${esc(x.nombre)}">` : `<div class="h-100 d-grid" style="place-items:center">${pendiente("foto")}</div>`}
            ${x.disponible === false ? `<div class="no-disponible">No<br>disponible</div>` : ""}
          </div>
        </div>
      </article>`);
  }
  function itemArco(x) {
    return el(`
      <article class="arco" data-ref="${esc(x.ref)}">
        <div class="arco__foto">
          ${x.destacado ? `<span class="badge-top">★ Favorito</span>` : ""}
          ${x.foto ? `<img src="${esc(x.foto)}" alt="${esc(x.nombre)}">` : `<div class="h-100 d-grid" style="place-items:center">${pendiente("foto")}</div>`}
          ${x.disponible === false ? `<div class="no-disponible">No disponible</div>` : ""}
        </div>
        <h3 class="arco__nombre">${esc(x.nombre)}</h3>
        <p class="arco__desc">${valor(x.descripcion, "descripción")}</p>
        <div class="arco__pie"><span class="precio">${fmtPrecio(x.precio)}</span>${botonPedir(x)}</div>
      </article>`);
  }

  /* ---------- 4. categorías ---------- */
  function categorias() {
    const inicio = {};
    D.categorias.forEach((c) => {
      const lista = deCategoria(c.id);
      if (!lista.length) return;
      const arcos = c.diseno === "arcos";
      const nueva = (cont) => {
        const p = paginaInterior(c.corto || c.nombre, arcos ? "crema" : "gris");
        const titulo = arcos
          ? `<h2 class="titulo-arcos">${c.marca ? `<em>${esc(N.nombre)}</em><span>${esc(c.nombre)}</span>` : `<span class="solo">${esc(c.nombre)}</span>`}${cont ? `<span style="font-size:12pt">(continuación)</span>` : ""}</h2>
             ${cont ? "" : `<p class="bajada-centro">${esc(c.intro)}</p>`}
             ${divisor("divisor--cafe divisor--centro")}
             <div class="grid-arcos"></div>`
          : `<h2 class="titulo-lista">${esc(c.nombre)}${cont ? ` <small style="font-size:14pt">(continuación)</small>` : ""}</h2>
             ${cont ? "" : `<p class="bajada">${esc(c.intro)}</p>`}
             ${divisor()}
             <div class="lista"></div>`;
        cuerpo(p).innerHTML = titulo;
        return p;
      };
      let p = nueva(false);
      p.id = `cat-${c.id}`;
      inicio[c.id] = p;
      const cont = () => p.querySelector(arcos ? ".grid-arcos" : ".lista");
      lista.forEach((x) => {
        const t = arcos ? itemArco(x) : itemLista(x);
        cont().appendChild(t);
        if (desborda(cuerpo(p))) {
          t.remove();
          p = nueva(true);
          cont().appendChild(t);
        }
      });
    });
    return inicio;
  }

  /* ---------- 5. cierre ---------- */
  function cierre() {
    const p = el(`
      <section class="pagina cierre" id="contacto">
        ${cintaPrueba()}
        <img class="cierre__logo" src="${esc(N.logo)}" alt="Logo ${esc(N.nombre)}">
        <h2><em>¡Gracias por</em><span>acompañarnos!</span></h2>
        ${divisor("divisor--centro")}
        <p>Pide para llevar o reserva tu mesa por WhatsApp. Te esperamos.</p>
        ${enlace(wa(MSG), `<i class="bi bi-whatsapp"></i> Pedir o reservar`, "btn-grande")}
        ${wa() ? `<div class="cierre__qr qr">${qrSvg(wa(MSG))}</div><div><b>Escanea y escríbenos por WhatsApp</b></div>` : ""}
        <div class="cierre__datos">
          <div>${enlace(mapa(), `<i class="bi bi-geo-alt-fill"></i>${valor(N.direccion, "dirección")}`)}</div>
          <div><i class="bi bi-clock-fill"></i>${valor(N.horario, "horario")}</div>
          <div>${enlace(insta(), `<i class="bi bi-instagram"></i>${valor(N.instagram, "Instagram")}`)}</div>
          <div><i class="bi bi-globe2"></i>${N.sitioWeb ? enlace(N.sitioWeb, esc(N.sitioWeb)) : pendiente("sitio web")}</div>
        </div>
      </section>`);
    raiz.appendChild(p);
    return p;
  }

  /* ---------- reparto de espacio en páginas "lista" ---------- */
  function repartirEspacio() {
    const MM = 96 / 25.4;
    raiz.querySelectorAll(".pagina").forEach((p) => {
      const c = cuerpo(p);
      const l = c && c.querySelector(".lista");
      if (!l || l.children.length < 2) return;
      const libre = c.getBoundingClientRect().bottom - parseFloat(getComputedStyle(c).paddingBottom) - l.getBoundingClientRect().bottom;
      if (libre > 0) l.style.gap = `calc(5mm + ${Math.min(libre / (l.children.length - 1), 12 * MM).toFixed(1)}px)`;
    });
  }

  /* ---------- validación ---------- */
  function validar() {
    const refs = new Set([...raiz.querySelectorAll("[data-ref].item, [data-ref].arco")].map((n) => n.dataset.ref));
    const faltantes = D.productos.filter((x) => !refs.has(x.ref)).map((x) => x.ref);
    const pendientes = [];
    D.productos.forEach((x) => ["nombre", "descripcion", "precio", "foto"].forEach((k) => vacio(x[k]) && pendientes.push(`${x.ref}: ${k}`)));
    window.__VALIDACION__ = { productos: D.productos.length, enCatalogo: refs.size, faltantes, pendientes };
    console.log("VALIDACION " + JSON.stringify(window.__VALIDACION__));
  }

  /* ---------- pliegos ---------- */
  function armarPliegos(paginas) {
    const envolver = (ps, sola) => {
      const w = el(`<div class="pliego ${sola ? "pliego--sola" : ""}"></div>`);
      raiz.appendChild(w);
      ps.forEach((p) => w.appendChild(p));
    };
    envolver([paginas[0]], true);
    for (let i = 1; i < paginas.length; i += 2) {
      if (i + 1 >= paginas.length) envolver([paginas[i]], true);
      else envolver([paginas[i], paginas[i + 1]], false);
    }
  }

  /* ---------- montaje ---------- */
  function construir() {
    portada();
    bienvenida();
    indice();
    const inicioCat = categorias();
    cierre();

    const paginas = [...raiz.querySelectorAll(".pagina")];
    const num = (p) => String(paginas.indexOf(p) + 1).padStart(2, "0");
    paginas.forEach((p, i) => {
      const n = p.querySelector(".pagina__footer .num");
      if (n) n.textContent = num(p);
      // con portada sola, las páginas pares (2, 4, …) quedan a la izquierda del pliego
      if (i > 0) p.classList.add((i + 1) % 2 === 0 ? "lado-izq" : "lado-der");
    });
    Object.entries(inicioCat).forEach(([id, p]) => {
      const t = raiz.querySelector(`[data-indice="${id}"]`);
      if (t) t.textContent = num(p);
    });

    repartirEspacio();
    validar();
    if (new URLSearchParams(location.search).has("pliegos")) armarPliegos(paginas);
    document.documentElement.dataset.listo = "1";
    document.dispatchEvent(new CustomEvent("catalogo:listo"));
  }

  const fuentes = document.fonts
    ? Promise.all(['700 1em "Playfair Display"', '400 1em "Playfair Display"', 'italic 700 1em "Playfair Display"', '400 1em "Lato"', '700 1em "Lato"', '900 1em "Lato"']
        .map((f) => document.fonts.load(f).catch(() => null))).then(() => document.fonts.ready)
    : Promise.resolve();
  const imagenes = () =>
    Promise.all(D.productos.filter((x) => x.foto).map((x) => new Promise((r) => {
      const i = new Image();
      i.onload = i.onerror = r;
      i.src = x.foto;
    })));
  Promise.all([fuentes, imagenes(), new Promise((r) => (document.readyState === "complete" ? r() : window.addEventListener("load", r)))]).then(construir);
})();
