/* =========================================================================
   REVISTA BURGER — MAQUETADOR
   Construye páginas A4 desde window.CATALOGO (data/menu.js) y los dibujos
   de js/dibujos.js. Paginación sin cortes, índice con enlaces, botón "Pedir"
   por WhatsApp, QR y evento "catalogo:listo" para el visor de revista.
   ========================================================================= */
(function () {
  "use strict";

  const D = window.CATALOGO;
  const N = D.negocio;
  const DIB = window.DIBUJOS || {};
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
  const dib = (nombre, estilo, cls = "dib") => `<div class="${cls}" style="${estilo}">${DIB[nombre] || ""}</div>`;
  const est = () => `<span class="est">${DIB.estrella || "★"}</span>`;
  const cinta = (texto, cls = "") => `<div class="cinta ${cls}">${est()}${est()}<span>${esc(texto)}</span>${est()}${est()}</div>`;
  const olas = (html) => `<div class="olas"><span class="ola">${DIB.ola || ""}</span>${html}<span class="ola">${DIB.ola || ""}</span></div>`;

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
  const credito = () => (D.modoPrueba ? `<div class="credito-foto">Fotos de referencia: TheMealDB / TheCocktailDB</div>` : "");

  /* ---------- página interior ---------- */
  function paginaInterior(seccion, tema) {
    const p = el(`
      <section class="pagina ${tema === "negro" ? "tema-negro" : ""}">
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
      <section class="pagina tema-negro portada">
        ${cintaPrueba()}
        ${dib("papas", "left:8mm;top:96mm;width:26mm;height:32mm;transform:rotate(-12deg)")}
        ${dib("vaso", "right:9mm;top:88mm;width:22mm;height:36mm;transform:rotate(10deg)")}
        ${dib("hamburguesa", "left:10mm;top:178mm;width:34mm;height:28mm;transform:rotate(-6deg)")}
        ${dib("hotdog", "right:7mm;top:186mm;width:36mm;height:18mm;transform:rotate(8deg)")}
        ${olas(`<span class="portada__kicker">TU HAMBURGUESERÍA</span>`)}
        <h1>${esc(N.nombre.toUpperCase())}</h1>
        <div class="portada__sub">${esc((N.subtitulo || "").toUpperCase())}</div>
        <img class="portada__foto" src="${esc(N.fotoPortada)}" alt="">
        ${olas(`<span class="portada__menu">MENÚ</span>`)}
        <div class="portada__tags">${(N.etiquetasPortada || []).map((t) => `<span>${esc(t)}</span>`).join("")}</div>
        <div class="portada__dir">${enlace(linkMapa(), valor(N.direccion, "dirección"))}</div>
        <div class="portada__pie">
          ${enlace(linkWhatsApp(MSG_GENERAL), `<span><i class="bi bi-whatsapp"></i>${valor(N.whatsapp, "WhatsApp")}</span>`)}
          <div class="qr">${qrSvg(linkWhatsApp(MSG_GENERAL))}</div>
          ${enlace(linkInstagram(), `<span><i class="bi bi-instagram"></i>${valor(N.instagram, "Instagram")}</span>`)}
        </div>
        ${credito()}
      </section>`));
  }

  /* ---------- 2. bienvenida ---------- */
  function bienvenida() {
    const p = paginaInterior("Bienvenidos", "kraft");
    p.classList.add("bienvenida");
    const iconos = { Domicilios: "bi-bicycle", "Para llevar": "bi-bag-check", "En el local": "bi-shop" };
    cuerpo(p).innerHTML = `
      ${dib("hamburguesa", "", "dib bienvenida__boceto")}
      <h2>¡Bienvenidos!</h2>
      <p class="bienvenida__texto">${valor(N.descripcion, "descripción")}</p>
      <dl class="ficha">
        ${cinta("La casa")}
        <div><dt>Cocina</dt><dd>${valor(N.tipoComida, "tipo de comida")}</dd></div>
        <div><dt>Horario</dt><dd>${valor(N.horario, "horario")}</dd></div>
        <div><dt>Dirección</dt><dd>${enlace(linkMapa(), valor(N.direccion, "dirección") + ' <i class="bi bi-box-arrow-up-right small"></i>')}</dd></div>
        <div><dt>Ideal para</dt><dd>${valor(N.publico, "público")}</dd></div>
      </dl>
      <div class="servicios">
        ${(N.servicios || []).map((s) => `<div class="servicio"><i class="bi ${iconos[s] || "bi-check2-circle"}"></i>${esc(s)}</div>`).join("")}
      </div>
      <div class="bienvenida__fotos">
        ${D.productos.filter((x) => x.foto && x.disponible !== false).filter((x, i, a) => a.findIndex((y) => y.categoria === x.categoria) === i).slice(0, 4)
          .map((x) => `<figure class="mini-polaroid"><img src="${esc(x.foto)}" alt="${esc(x.nombre)}"><figcaption>${esc(x.nombre)}</figcaption></figure>`).join("")}
      </div>`;
  }

  /* ---------- 3. índice ---------- */
  function indice() {
    const p = paginaInterior("Contenido", "negro");
    p.classList.add("indice");
    const fila = (href, img, icono, nombre, intro, key) => `
      <a class="indice__item" href="${href}">
        <div class="indice__thumb">${img ? `<img src="${esc(img)}" alt="">` : `<i class="bi ${icono}"></i>`}</div>
        <div><div class="indice__nombre">${esc(nombre)}</div>${intro ? `<div class="indice__intro">${esc(intro)}</div>` : ""}</div>
        <div class="indice__pagina" data-indice="${key}"></div>
      </a>`;
    const reco = D.productos.find((x) => x.destacado && x.foto);
    cuerpo(p).innerHTML = `
      <div class="titular">${cinta("Nuestro menú", "cinta--kraft cinta--grande")}</div>
      ${reco ? fila("#destacados", reco.foto, "", "Los más pedidos", "Recomendados de la casa", "destacados") : ""}
      ${D.categorias
        .map((c) => {
          const l = deCategoria(c.id);
          return l.length
            ? fila(`#cat-${esc(c.id)}`, (l.find((x) => x.foto) || {}).foto, "", c.nombre, `${c.intro} · ${l.length} opciones`, esc(c.id))
            : "";
        })
        .join("")}
      ${fila("#contacto", null, "bi-whatsapp", "Pedidos y contacto", "WhatsApp, dirección y horario", "contacto")}
      <p class="indice__ayuda"><i class="bi bi-hand-index"></i> Toca una sección para ir directo a ella.</p>`;
  }

  /* ---------- 4. recomendados ---------- */
  function recomendados() {
    const lista = D.productos.filter((x) => x.destacado);
    if (!lista.length) return null;
    let p = paginaInterior("Recomendados", "negro");
    p.classList.add("recomendados");
    p.id = "destacados";
    const primera = p;
    cuerpo(p).innerHTML = `<div class="titular">${cinta("Los más pedidos", "cinta--kraft cinta--grande")}</div><div class="reco-grid"></div>`;
    lista.forEach((x) => {
      const b = el(`
        <article class="reco">
          <figure class="polaroid m-0">
            ${x.foto ? `<img src="${esc(x.foto)}" alt="${esc(x.nombre)}">` : pendiente("foto")}
            <figcaption>${esc(x.nombre)}</figcaption>
            <span class="etiqueta-precio">${vacio(x.precio) ? "?" : "$" + Math.round(x.precio / 1000) + "K"}</span>
          </figure>
          <p>${valor(x.descripcion, "descripción")}</p>
          ${botonPedir(x)}
        </article>`);
      p.querySelector(".reco-grid").appendChild(b);
      if (desborda(cuerpo(p))) {
        b.remove();
        p = paginaInterior("Recomendados", "negro");
        p.classList.add("recomendados");
        cuerpo(p).innerHTML = `<div class="reco-grid"></div>`;
        p.querySelector(".reco-grid").appendChild(b);
      }
    });
    return primera;
  }

  /* ---------- ítem ---------- */
  function item(x) {
    const ingr = x.ingredientes && x.ingredientes.length
      ? `<p class="item__ingr"><strong>Ingredientes:</strong> ${x.ingredientes.map(esc).join(" · ")}</p>` : "";
    return el(`
      <article class="item" data-ref="${esc(x.ref)}">
        <div class="item__foto">
          ${x.foto ? `<img src="${esc(x.foto)}" alt="${esc(x.nombre)}">` : `<div class="h-100 d-grid" style="place-items:center">${pendiente("foto")}</div>`}
          ${x.disponible === false ? `<div class="no-disponible">No<br>disponible</div>` : ""}
        </div>
        ${x.destacado ? `<span class="badge-top">★ TOP</span>` : ""}
        <div>
          <h3 class="item__nombre">${esc(x.nombre)}<span class="ref">${esc(x.ref)}</span></h3>
          <p class="item__desc">${valor(x.descripcion, "descripción")}</p>
          ${ingr}
        </div>
        <div class="item__precio">
          <span class="precio">${fmtPrecio(x.precio)}</span>
          ${botonPedir(x)}
        </div>
      </article>`);
  }

  /* ---------- 5. categorías en paneles (fluyen entre páginas) ---------- */
  function categorias() {
    const inicio = {};
    let p = null;
    const bocetos = ["hamburguesa", "papas", "vaso", "hotdog"];
    let nPag = 0;
    const nuevaPagina = (seccion) => {
      p = paginaInterior(seccion, "kraft");
      const b = bocetos[nPag++ % bocetos.length];
      p.insertAdjacentHTML("afterbegin", dib(b, "right:-6mm;top:4mm;width:44mm;height:40mm;transform:rotate(12deg)", "dib boceto-esquina"));
      return p;
    };
    const nuevaSeccion = (c, cont) => {
      const s = el(`
        <section class="seccion-cat panel-${esc(c.panel)}" ${cont ? "" : `id="cat-${esc(c.id)}"`}>
          ${cinta(cont ? `${c.nombre} (cont.)` : c.nombre)}
          ${cont ? "" : `<p class="seccion-cat__intro">${esc(c.intro)}</p>`}
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

      lista.forEach((x, i) => {
        const it = item(x);
        sec.querySelector(".lista").appendChild(it);
        if (!desborda(cuerpo(p))) { primero = false; return; }
        // un solo producto bajo el título al final de la página → la sección completa pasa
        if (!primero && sec.querySelectorAll(".item").length === 2 && !sec.classList.contains("es-cont")) primero = true;
        if (primero) {
          sec.remove();
          const hdr = p.querySelector(".pagina__header .seccion");
          hdr.textContent = hdr.textContent.replace(` · ${c.nombre}`, "");
          nuevaPagina(c.nombre);
          cuerpo(p).appendChild(sec);
          inicio[c.id] = p;
        } else {
          it.remove();
          // si solo quedaría este último producto en la página nueva, se lleva también el anterior
          const mover = [it];
          const previos = sec.querySelectorAll(".item");
          if (i === lista.length - 1 && previos.length >= 3) mover.unshift(previos[previos.length - 1]);
          mover.forEach((m) => m.remove());
          nuevaPagina(c.nombre);
          sec = nuevaSeccion(c, true);
          sec.classList.add("es-cont");
          mover.forEach((m) => sec.querySelector(".lista").appendChild(m));
        }
        primero = false;
      });
    });
    return inicio;
  }

  /* ---------- 6. gracias (contraportada) ---------- */
  function gracias() {
    const p = el(`
      <section class="pagina tema-negro gracias" id="contacto">
        ${cintaPrueba()}
        ${dib("papas", "left:10mm;top:18mm;width:24mm;height:30mm;transform:rotate(-10deg)")}
        ${dib("vaso", "right:12mm;top:20mm;width:20mm;height:32mm;transform:rotate(8deg)")}
        ${dib("hotdog", "left:8mm;bottom:22mm;width:38mm;height:19mm;transform:rotate(-6deg)")}
        ${dib("hamburguesa", "right:10mm;bottom:20mm;width:36mm;height:30mm;transform:rotate(7deg)")}
        <img class="gracias__logo" src="${esc(N.logo)}" alt="Logo ${esc(N.nombre)}">
        <h2>¡GRACIAS!</h2>
        <div class="gracias__sub">por tu visita</div>
        <p class="gracias__texto">${valor(N.eslogan, "eslogan")}</p>
        ${enlace(linkWhatsApp(MSG_GENERAL), `<i class="bi bi-whatsapp"></i> Haz tu pedido`, "btn-grande")}
        ${linkWhatsApp() ? `<div class="gracias__qr qr">${qrSvg(linkWhatsApp(MSG_GENERAL))}</div><div class="gracias__qr-txt">Escanea y pide por WhatsApp</div>` : ""}
        <div class="gracias__datos">
          <div>${enlace(linkMapa(), `<i class="bi bi-geo-alt-fill"></i>${valor(N.direccion, "dirección")}`)}</div>
          <div>${enlace(linkWhatsApp(MSG_GENERAL), `<i class="bi bi-whatsapp"></i>${valor(N.whatsapp, "WhatsApp")}`)}</div>
          <div><i class="bi bi-clock-fill"></i>${valor(N.horario, "horario")}</div>
          <div>${enlace(linkInstagram(), `<i class="bi bi-instagram"></i>${valor(N.instagram, "Instagram")}`)}</div>
          <div><i class="bi bi-globe2"></i>${N.sitioWeb ? enlace(N.sitioWeb, esc(N.sitioWeb)) : pendiente("sitio web")}</div>
        </div>
      </section>`);
    raiz.appendChild(p);
    return p;
  }

  /* ---------- reparte el espacio libre entre los ítems ---------- */
  function repartirEspacio() {
    const MM = 96 / 25.4;
    raiz.querySelectorAll(".pagina").forEach((p) => {
      const c = cuerpo(p);
      const items = c ? c.querySelectorAll(".item") : [];
      if (!c || items.length < 2) return;
      const ultimo = c.lastElementChild.getBoundingClientRect().bottom;
      const libre = c.getBoundingClientRect().bottom - parseFloat(getComputedStyle(c).paddingBottom) - ultimo;
      if (libre <= 0) return;
      const extra = Math.min(libre / items.length, 6 * MM) / 2;
      items.forEach((it) => (it.style.padding = `calc(3mm + ${extra.toFixed(1)}px) 0`));
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
    window.__VALIDACION__ = { productos: D.productos.length, enCatalogo: refs.size, faltantes, pendientes };
    console.log("VALIDACION " + JSON.stringify(window.__VALIDACION__));
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
        ['400 1em "Luckiest Guy"', '700 1em "Oswald"', '500 1em "Oswald"', '500 1em "Montserrat"', '700 1em "Montserrat"', '800 1em "Montserrat"']
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
