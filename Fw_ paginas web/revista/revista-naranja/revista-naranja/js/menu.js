/* =========================================================================
   REVISTA NARANJA — MAQUETADOR
   Construye páginas A4 desde window.CATALOGO (data/menu.js).
   - Cada producto se agrega y, si no cabe completo, pasa a la página
     siguiente (ningún producto queda cortado).
   - Enlaces interactivos: índice, "Pedir" por WhatsApp, Instagram, mapa, QR.
   - Emite "catalogo:listo" para el visor de revista (js/revista.js).
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
  const cat = (id) => D.categorias.find((c) => c.id === id);
  const deCategoria = (id) => D.productos.filter((x) => x.categoria === id);

  /* ---------- enlaces ---------- */
  const linkWhatsApp = (texto) =>
    N.whatsappLink ? N.whatsappLink + (texto ? `?text=${encodeURIComponent(texto)}` : "") : null;
  const linkInstagram = () =>
    N.instagram ? (/^https?:/.test(N.instagram) ? N.instagram : `https://instagram.com/${N.instagram.replace(/^@/, "")}`) : null;
  const linkMapa = () =>
    N.direccion ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(N.direccion)}` : null;
  const enlace = (url, html, cls = "") =>
    url ? `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener">${html}</a>` : html;
  const MSG_GENERAL = "Hola, vi el menú y quiero hacer un pedido";
  const botonPedir = (x) => {
    const url = x.disponible === false ? null : linkWhatsApp(`Hola, quiero pedir: ${x.nombre} (${x.ref})`);
    return url ? `<a class="btn-pedir" href="${esc(url)}" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i>Pedir</a>` : "";
  };
  const qrSvg = (texto) => {
    if (!texto || typeof qrcode !== "function") return "";
    const q = qrcode(0, "M");
    q.addData(texto);
    q.make();
    return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
  };

  const cintaPrueba = () => (D.modoPrueba ? `<div class="cinta-prueba">DATOS DE PRUEBA</div>` : "");
  const credito = () => (D.modoPrueba ? `<div class="credito-foto">Fotos de referencia: TheMealDB / TheCocktailDB</div>` : "");

  /* ---------- estructura de página ---------- */
  function paginaInterior(seccion, tema) {
    const p = el(`
      <section class="pagina tema-${esc(tema)}">
        ${cintaPrueba()}
        <header class="pagina__header">
          <div class="marca"><img src="${esc(N.logo)}" alt=""><span>${esc(N.nombre)}</span></div>
          <div class="seccion">${esc(seccion)}</div>
        </header>
        <div class="pagina__cuerpo"></div>
        <footer class="pagina__footer">
          ${enlace(linkWhatsApp(MSG_GENERAL), `<span><i class="bi bi-whatsapp"></i>Pedidos: ${valor(N.whatsapp, "WhatsApp")}</span>`)}
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
    raiz.appendChild(el(`
      <section class="pagina portada">
        ${cintaPrueba()}
        <div class="portada__crema"></div>
        <div class="portada__foto-wrap">
          <img class="portada__foto" src="${esc(N.fotoPortada)}" alt="">
          <div class="blob">Menú<br>de la<br>casa</div>
        </div>
        <div class="portada__titulos">
          <div class="script">especial</div>
          <h1 class="display">Menú del Fogón</h1>
          <div class="portada__nombre">${esc(N.nombre)} · ${valor(N.eslogan, "eslogan")}</div>
          <div class="portada__horario">${valor(N.horario, "horario")}</div>
        </div>
        <div class="barra-contacto">
          ${enlace(linkWhatsApp(MSG_GENERAL), `<span><i class="bi bi-whatsapp"></i>${valor(N.whatsapp, "WhatsApp")}</span>`)}
          <div class="qr">${qrSvg(linkWhatsApp(MSG_GENERAL))}</div>
          ${enlace(linkInstagram(), `<span><i class="bi bi-instagram"></i>${valor(N.instagram, "Instagram")}</span>`)}
        </div>
        ${credito()}
      </section>`));
  }

  /* ---------- 2. bienvenida ---------- */
  function bienvenida() {
    const p = paginaInterior("Bienvenidos", "crema");
    p.classList.add("bienvenida");
    const fotos = D.productos.filter((x) => x.destacado && x.foto).slice(0, 3);
    const pos = [
      { l: "4mm", t: "14mm", s: "52mm" },
      { l: "60mm", t: "0mm", s: "66mm" },
      { l: "130mm", t: "16mm", s: "50mm" },
    ];
    cuerpo(p).innerHTML = `
      <div class="script">bienvenidos a</div>
      <h2 class="display">${esc(N.nombre)}</h2>
      <p class="bienvenida__texto">${valor(N.descripcion, "descripción")}</p>
      <dl class="ficha m-0 mb-4 mt-4">
        <div><dt>Cocina</dt><dd>${valor(N.tipoComida, "tipo de comida")}</dd></div>
        <div><dt>Horario</dt><dd>${valor(N.horario, "horario")}</dd></div>
        <div><dt>Dirección</dt><dd>${enlace(linkMapa(), valor(N.direccion, "dirección") + ' <i class="bi bi-box-arrow-up-right small"></i>')}</dd></div>
        <div><dt>Ideal para</dt><dd>${valor(N.publico, "público")}</dd></div>
      </dl>
      ${N.servicios && N.servicios.length ? `
      <div class="servicios">
        <i class="bi bi-truck"></i>
        <div><div class="display">${esc(N.servicios[0])}</div><span>${N.servicios.slice(1).map(esc).join(" · ")}</span></div>
      </div>` : ""}
      <div class="bienvenida__fotos">
        ${fotos.map((x, i) => `<div class="circulo" style="left:${pos[i].l};top:${pos[i].t};width:${pos[i].s};height:${pos[i].s}"><img src="${esc(x.foto)}" alt="${esc(x.nombre)}"></div>`).join("")}
      </div>`;
  }

  /* ---------- 3. índice ---------- */
  function indice() {
    const p = paginaInterior("Contenido", "naranja");
    p.classList.add("indice");
    const fila = (href, img, nombre, intro, key) => `
      <a class="indice__item" href="${href}">
        <div class="indice__thumb">${img ? `<img src="${esc(img)}" alt="">` : ""}</div>
        <div><div class="indice__nombre">${esc(nombre)}</div>${intro ? `<div class="indice__intro">${esc(intro)}</div>` : ""}</div>
        <div class="indice__pagina" data-indice="${key}"></div>
      </a>`;
    const reco = D.productos.find((x) => x.destacado && x.foto);
    cuerpo(p).innerHTML = `
      <div class="script">nuestra carta</div>
      <h2 class="display">Contenido</h2>
      ${reco ? fila("#destacados", reco.foto, "Recomendados", "Lo más pedido de la casa", "destacados") : ""}
      ${D.categorias
        .map((c) => {
          const l = deCategoria(c.id);
          if (!l.length) return "";
          return fila(`#cat-${esc(c.id)}`, (l.find((x) => x.foto) || {}).foto, c.nombre, `${c.intro} · ${l.length} opciones`, esc(c.id));
        })
        .join("")}
      ${fila("#contacto", null, "Pedidos y contacto", "WhatsApp, dirección y horario", "contacto").replace('<div class="indice__thumb"></div>', '<div class="indice__thumb d-grid" style="place-items:center;font-size:20pt"><i class="bi bi-whatsapp"></i></div>')}
      <p class="indice__ayuda"><i class="bi bi-hand-index"></i> Toca una sección para ir directo a ella.</p>`;
  }

  /* ---------- 4. recomendados ---------- */
  function recomendados() {
    const lista = D.productos.filter((x) => x.destacado);
    if (!lista.length) return null;
    let p = paginaInterior("Recomendados", "crema");
    p.classList.add("recomendados");
    p.id = "destacados";
    const primera = p;
    cuerpo(p).innerHTML = `<div class="script">lo más pedido</div><h2 class="display">Recomendados</h2><div class="reco-grid"></div>`;
    lista.forEach((x) => {
      const b = el(`
        <article class="reco">
          <div class="reco__foto">
            <div class="circulo">${x.foto ? `<img src="${esc(x.foto)}" alt="${esc(x.nombre)}">` : pendiente("foto")}</div>
            <div class="blob">${vacio(x.precio) ? "?" : "$" + Math.round(x.precio / 1000) + "K"}</div>
          </div>
          <span class="pill">${esc(x.nombre)}</span>
          <p>${valor(x.descripcion, "descripción")}</p>
          <div class="d-flex align-items-center gap-2"><span class="precio">${fmtPrecio(x.precio)}</span>${botonPedir(x)}</div>
        </article>`);
      p.querySelector(".reco-grid").appendChild(b);
      if (desborda(cuerpo(p))) {
        b.remove();
        p = paginaInterior("Recomendados", "crema");
        p.classList.add("recomendados");
        cuerpo(p).innerHTML = `<div class="reco-grid"></div>`;
        p.querySelector(".reco-grid").appendChild(b);
      }
    });
    return primera;
  }

  /* ---------- ítem de producto ---------- */
  function item(x) {
    const ingr = x.ingredientes && x.ingredientes.length
      ? `<p class="item__ingr"><strong>Ingredientes:</strong> ${x.ingredientes.map(esc).join(" · ")}</p>` : "";
    return el(`
      <article class="item" data-ref="${esc(x.ref)}">
        ${x.destacado ? `<span class="badge-top"><i class="bi bi-star-fill"></i> Top</span>` : ""}
        <div class="item__foto">
          ${x.foto ? `<img src="${esc(x.foto)}" alt="${esc(x.nombre)}">` : `<div class="h-100 d-grid" style="place-items:center">${pendiente("foto")}</div>`}
          ${x.disponible === false ? `<div class="no-disponible">No<br>disponible</div>` : ""}
        </div>
        <div class="item__caja">
          <h3 class="pill">${esc(x.nombre)}</h3>
          <p class="item__desc">${valor(x.descripcion, "descripción")}</p>
          ${ingr}
          <div class="item__pie">
            <span class="ref">${esc(x.ref)}</span>
            <span class="puntos"></span>
            <span class="precio">${fmtPrecio(x.precio)}</span>
            ${botonPedir(x)}
          </div>
        </div>
      </article>`);
  }

  /* ---------- 5. páginas de categorías ----------
     Las categorías fluyen una tras otra (varias por página, como en la
     referencia). El fondo alterna naranja / crema por página. El título de
     una categoría nunca queda solo al final: entra junto a su primer producto. */
  function categorias() {
    const inicio = {};
    let nPag = 0;
    let p = null;
    const nuevaPagina = (seccion) => {
      p = paginaInterior(seccion, nPag++ % 2 === 0 ? "naranja" : "crema");
      return p;
    };
    const nuevaSeccion = (c, cont) => {
      const s = el(`
        <section class="seccion-cat" ${cont ? "" : `id="cat-${esc(c.id)}"`}>
          <div class="cat-header ${cont ? "cat-header--cont" : ""}">
            <div class="script">${cont ? "continuación" : esc(c.intro)}</div>
            <h2 class="display">${esc(c.nombre)}</h2>
          </div>
          <div class="lista"></div>
        </section>`);
      cuerpo(p).appendChild(s);
      return s;
    };

    D.categorias.forEach((c) => {
      const lista = deCategoria(c.id);
      if (!lista.length) return;
      if (!p) nuevaPagina(c.nombre);
      else p.querySelector(".pagina__header .seccion").textContent += ` · ${c.nombre}`;
      let sec = nuevaSeccion(c, false);
      let primero = true;
      inicio[c.id] = p;

      lista.forEach((x) => {
        const it = item(x);
        sec.querySelector(".lista").appendChild(it);
        if (!desborda(cuerpo(p))) { primero = false; return; }
        if (primero) {
          // título + primer producto no caben: la sección completa pasa a página nueva
          sec.remove();
          const hdr = p.querySelector(".pagina__header .seccion");
          hdr.textContent = hdr.textContent.replace(` · ${c.nombre}`, "");
          nuevaPagina(c.nombre);
          cuerpo(p).appendChild(sec);
          inicio[c.id] = p;
        } else {
          it.remove();
          nuevaPagina(c.nombre);
          sec = nuevaSeccion(c, true);
          sec.querySelector(".lista").appendChild(it);
        }
        primero = false;
      });
    });
    return inicio;
  }

  /* ---------- 6. gracias / contacto (contraportada) ---------- */
  function gracias() {
    const p = el(`
      <section class="pagina gracias" id="contacto">
        ${cintaPrueba()}
        <img class="gracias__logo" src="${esc(N.logo)}" alt="Logo ${esc(N.nombre)}">
        <h2 class="display">¡Gracias!</h2>
        <p class="gracias__texto">${valor(N.descripcion, "descripción")}</p>
        ${enlace(linkWhatsApp(MSG_GENERAL), `<i class="bi bi-whatsapp"></i> Haz tu pedido`, "btn-grande")}
        ${linkWhatsApp() ? `<div class="gracias__qr qr">${qrSvg(linkWhatsApp(MSG_GENERAL))}</div><div class="gracias__qr-txt">Escanea para pedir por WhatsApp</div>` : ""}
        <div class="gracias__datos">
          <div>${enlace(linkMapa(), `<i class="bi bi-geo-alt-fill"></i>${valor(N.direccion, "dirección")}`)}</div>
          <div>${enlace(linkWhatsApp(MSG_GENERAL), `<i class="bi bi-whatsapp"></i>${valor(N.whatsapp, "WhatsApp")}`)}</div>
          <div><i class="bi bi-clock-fill"></i>${valor(N.horario, "horario")}</div>
          <div><i class="bi bi-globe2"></i>${N.sitioWeb ? enlace(N.sitioWeb, esc(N.sitioWeb)) : pendiente("sitio web")}</div>
        </div>
        <div class="conecta">Síguenos</div>
        <div class="mt-2">${enlace(linkInstagram(), `<i class="bi bi-instagram"></i> ${valor(N.instagram, "Instagram")}`)}</div>
      </section>`);
    raiz.appendChild(p);
    return p;
  }

  /* ---------- reparte el espacio libre de cada página de productos ----------
     Agranda los espacios entre productos (con un máximo) para que la página
     no quede con un hueco abajo. */
  function repartirEspacio() {
    const MM = 96 / 25.4;
    raiz.querySelectorAll(".pagina").forEach((p) => {
      const c = cuerpo(p);
      const items = c ? c.querySelectorAll(".item") : [];
      if (!c || items.length < 2) return;
      const ultimo = items[items.length - 1].getBoundingClientRect().bottom;
      const libre = c.getBoundingClientRect().bottom - parseFloat(getComputedStyle(c).paddingBottom) - ultimo;
      const huecos = items.length - 1 + c.querySelectorAll(".seccion-cat").length - 1;
      if (libre <= 0 || huecos <= 0) return;
      const extra = Math.min(libre / huecos, 9 * MM);
      c.querySelectorAll(".lista").forEach((l) => (l.style.gap = `calc(3.6mm + ${extra.toFixed(1)}px)`));
      c.querySelectorAll(".seccion-cat + .seccion-cat").forEach((sc) => (sc.style.marginTop = `calc(6mm + ${extra.toFixed(1)}px)`));
    });
  }

  /* ---------- validación ---------- */
  function validar() {
    const refs = new Set([...raiz.querySelectorAll(".item[data-ref]")].map((n) => n.dataset.ref));
    const faltantes = D.productos.filter((x) => !refs.has(x.ref)).map((x) => x.ref);
    const pendientes = [];
    D.productos.forEach((x) =>
      ["nombre", "descripcion", "precio", "foto"].forEach((k) => vacio(x[k]) && pendientes.push(`${x.ref}: ${k}`))
    );
    const informe = { productos: D.productos.length, enCatalogo: refs.size, faltantes, pendientes };
    window.__VALIDACION__ = informe;
    console.log("VALIDACION " + JSON.stringify(informe));
  }

  /* ---------- pliegos (index.html?pliegos) ---------- */
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
    const pReco = recomendados();
    const inicioCat = categorias();
    const pFin = gracias();

    const paginas = [...raiz.querySelectorAll(".pagina")];
    const num = (p) => String(paginas.indexOf(p) + 1).padStart(2, "0");
    paginas.forEach((p) => {
      const n = p.querySelector(".pagina__footer .num");
      if (n) n.textContent = num(p);
    });
    const poner = (key, p) => {
      const t = raiz.querySelector(`[data-indice="${key}"]`);
      if (t && p) t.textContent = num(p);
    };
    Object.entries(inicioCat).forEach(([id, p]) => poner(id, p));
    poner("destacados", pReco);
    poner("contacto", pFin);

    repartirEspacio();
    validar();
    if (new URLSearchParams(location.search).has("pliegos")) armarPliegos(paginas);
    document.documentElement.dataset.listo = "1";
    document.dispatchEvent(new CustomEvent("catalogo:listo"));
  }

  const fuentes = document.fonts
    ? Promise.all(
        ['400 1em "Titan One"', '400 1em "Yellowtail"', '400 1em "Poppins"', '600 1em "Poppins"', '500 1em "Poppins"']
          .map((f) => document.fonts.load(f).catch(() => null))
      ).then(() => document.fonts.ready)
    : Promise.resolve();
  const imagenes = () =>
    Promise.all(D.productos.filter((x) => x.foto).map((x) => new Promise((r) => {
      const i = new Image();
      i.onload = i.onerror = r;
      i.src = x.foto;
    })));
  Promise.all([
    fuentes,
    imagenes(),
    new Promise((r) => (document.readyState === "complete" ? r() : window.addEventListener("load", r))),
  ]).then(construir);
})();
