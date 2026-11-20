/* =========================================================================
   CATÁLOGO DIGITAL — MAQUETADOR
   Construye páginas A4 a partir de window.CATALOGO (data/productos.js).
   Las tarjetas se agregan una a una y, si una no cabe completa, pasa a la
   página siguiente: ningún producto queda cortado entre páginas.
   ========================================================================= */
(function () {
  "use strict";

  const D = window.CATALOGO;
  const N = D.negocio;
  const raiz = document.getElementById("catalogo");

  /* ---------- utilidades ---------- */
  const esc = (v) =>
    String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const pendiente = (campo) => `<span class="pendiente">Pendiente: ${esc(campo)}</span>`;
  const valor = (v, campo) => (v === null || v === undefined || v === "" ? pendiente(campo) : esc(v));

  // Formato COP sin decimales. El número se conserva tal cual fue entregado.
  const fmtPrecio = (p) => {
    if (p === null || p === undefined) return pendiente("precio");
    return `$${Number(p).toLocaleString("es-CO", { maximumFractionDigits: 0 })}<small>${esc(N.moneda)}</small>`;
  };

  const el = (html) => {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };

  /* ---------- enlaces (PDF interactivo) ---------- */
  const linkWhatsApp = (texto) =>
    N.whatsappLink ? N.whatsappLink + (texto ? `?text=${encodeURIComponent(texto)}` : "") : null;
  const linkInstagram = () =>
    N.instagram ? (/^https?:/.test(N.instagram) ? N.instagram : `https://instagram.com/${N.instagram.replace(/^@/, "")}`) : null;
  const linkMapa = () =>
    N.direccion ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(N.direccion)}` : null;
  const linkWeb = () => N.sitioWeb || null;
  // Envuelve contenido en <a> solo si existe el enlace
  const enlace = (url, html, cls = "") =>
    url ? `<a class="lnk ${cls}" href="${esc(url)}" target="_blank" rel="noopener">${html}</a>` : html;
  const mensajePedido = (x) => `Hola, quiero pedir: ${x.nombre} (${x.ref})`;

  // Código QR (SVG) usando vendor/qrcode
  const qrSvg = (texto) => {
    if (!texto || typeof qrcode !== "function") return "";
    const q = qrcode(0, "M");
    q.addData(texto);
    q.make();
    return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
  };

  const cintaPrueba = () => (D.modoPrueba ? `<div class="cinta-prueba">DATOS DE PRUEBA</div>` : "");

  /* ---------- estructura de página ---------- */
  function paginaInterior(seccion) {
    const p = el(`
      <section class="pagina">
        ${cintaPrueba()}
        <header class="pagina__header">
          <div class="marca"><img src="${esc(N.logo)}" alt=""><span>${esc(N.nombre)}</span></div>
          <div class="seccion">${esc(seccion)}</div>
        </header>
        <div class="pagina__cuerpo"></div>
        <footer class="pagina__footer">
          <span>${enlace(linkWhatsApp(), `<i class="bi bi-whatsapp"></i>Pedidos: ${valor(N.whatsapp, "WhatsApp")}`)}</span>
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
        <img class="portada__logo" src="${esc(N.logo)}" alt="Logo ${esc(N.nombre)}">
        <div class="portada__kicker">Carta · Catálogo</div>
        <h1>${esc(N.nombre)}</h1>
        <div class="portada__eslogan">${valor(N.eslogan, "eslogan")}</div>
        <hr class="portada__linea">
        <div class="portada__datos">
          ${enlace(linkWhatsApp(), `<i class="bi bi-whatsapp"></i>${valor(N.whatsapp, "WhatsApp")}`)}
          ${enlace(linkInstagram(), `<i class="bi bi-instagram"></i>${valor(N.instagram, "Instagram")}`)}
        </div>
      </section>`));
  }

  /* ---------- 2. presentación ---------- */
  function presentacion() {
    const p = paginaInterior("Quiénes somos");
    cuerpo(p).innerHTML = `
      <div class="etiqueta mb-2">Bienvenidos</div>
      <h2 class="presentacion__titulo">${esc(N.nombre)}</h2>
      <p class="presentacion__texto">${valor(N.descripcion, "descripción del negocio")}</p>
      <dl class="ficha">
        <div class="ficha__fila"><dt>Tipo de comida</dt><dd>${valor(N.tipoComida, "tipo de comida")}</dd></div>
        <div class="ficha__fila"><dt>Pensado para</dt><dd>${valor(N.publico, "público objetivo")}</dd></div>
        <div class="ficha__fila"><dt>Dirección</dt><dd>${enlace(linkMapa(), valor(N.direccion, "dirección") + ' <i class="bi bi-box-arrow-up-right small"></i>')}</dd></div>
        <div class="ficha__fila"><dt>Horario</dt><dd>${valor(N.horario, "horario")}</dd></div>
      </dl>
      <div class="presentacion__cita">${valor(N.eslogan, "eslogan")}</div>`;
  }

  /* ---------- 3. índice (números se completan al final) ---------- */
  function indice() {
    const p = paginaInterior("Contenido");
    // muchas categorías → filas más compactas para que el índice quepa en una página
    if (D.categorias.length > 5) p.classList.add("indice--compacto");
    const items = D.categorias
      .map((c) => {
        const n = D.productos.filter((x) => x.categoria === c.id).length;
        return `
        <a class="indice__item" href="#cat-${esc(c.id)}">
          <div class="indice__icono"><i class="bi ${esc(c.icono)}"></i></div>
          <div>
            <div class="indice__nombre">${esc(c.nombre)}</div>
            <div class="indice__intro">${esc(c.intro)}</div>
            <div class="indice__cuenta">${n} producto${n === 1 ? "" : "s"}</div>
          </div>
          <div class="indice__pagina" data-indice="${esc(c.id)}"></div>
        </a>`;
      })
      .join("");
    cuerpo(p).innerHTML = `
      <div class="etiqueta mb-2">Nuestra carta</div>
      <h2 class="indice__titulo">Índice</h2>
      ${items}
      <a class="indice__item" href="#destacados">
        <div class="indice__icono"><i class="bi bi-star-fill"></i></div>
        <div><div class="indice__nombre">Recomendados de la casa</div></div>
        <div class="indice__pagina" data-indice="destacados"></div>
      </a>
      <a class="indice__item" href="#contacto">
        <div class="indice__icono"><i class="bi bi-geo-alt-fill"></i></div>
        <div><div class="indice__nombre">Contacto y pedidos</div></div>
        <div class="indice__pagina" data-indice="contacto"></div>
      </a>
      <p class="indice__ayuda"><i class="bi bi-hand-index"></i> Toca una categoría para ir directo a ella.</p>`;
  }

  /* ---------- tarjeta de producto ---------- */
  function tarjeta(x) {
    const foto = x.foto
      ? `<img class="producto__foto" src="${esc(x.foto)}" alt="${esc(x.nombre)}">`
      : `<div class="h-100 d-grid" style="place-items:center">${pendiente("fotografía")}</div>`;
    const ingr = x.ingredientes && x.ingredientes.length
      ? `<p class="producto__ingr"><strong>Ingredientes:</strong> ${x.ingredientes.map(esc).join(" · ")}</p>`
      : "";
    return el(`
      <article class="producto" data-ref="${esc(x.ref)}">
        <div class="producto__foto-wrap">
          ${foto}
          <span class="producto__ref">${esc(x.ref)}</span>
          ${x.destacado ? `<span class="badge-destacado"><i class="bi bi-star-fill"></i> Recomendado</span>` : ""}
          ${x.disponible === false ? `<div class="no-disponible"><span>No disponible</span></div>` : ""}
        </div>
        <div class="producto__cuerpo">
          <h3 class="producto__nombre">${esc(x.nombre)}</h3>
          <p class="producto__desc">${valor(x.descripcion, "descripción")}</p>
          ${ingr}
          <div class="producto__pie">
            <span class="producto__porcion">${x.porcion ? `<i class="bi bi-rulers"></i> ${esc(x.porcion)}` : ""}</span>
            <span class="d-flex align-items-center gap-2">
              <span class="precio">${fmtPrecio(x.precio)}</span>
              ${botonPedir(x)}
            </span>
          </div>
        </div>
      </article>`);
  }
  function botonPedir(x) {
    const url = x.disponible === false ? null : linkWhatsApp(mensajePedido(x));
    return url
      ? `<a class="btn-pedir" href="${esc(url)}" target="_blank" rel="noopener" title="Pedir por WhatsApp"><i class="bi bi-whatsapp"></i>Pedir</a>`
      : "";
  }

  /* ---------- 4. destacados ---------- */
  function destacados() {
    const lista = D.productos.filter((x) => x.destacado);
    if (!lista.length) return null;
    let p = paginaInterior("Recomendados");
    p.id = "destacados";
    const primera = p;
    cuerpo(p).innerHTML = `
      <div class="etiqueta mb-2"><i class="bi bi-star-fill"></i> Selección de la casa</div>
      <h2 class="destacados__titulo">Recomendados</h2>
      <p class="destacados__sub">Los platos que más piden nuestros clientes.</p>`;
    lista.forEach((x) => {
      const cat = D.categorias.find((c) => c.id === x.categoria);
      const bloque = el(`
        <article class="destacado" data-ref="${esc(x.ref)}">
          ${x.foto ? `<img class="destacado__foto" src="${esc(x.foto)}" alt="${esc(x.nombre)}">` : `<div class="d-grid" style="place-items:center">${pendiente("fotografía")}</div>`}
          <div class="destacado__info">
            <span class="etiqueta">${esc(cat ? cat.nombre : x.categoria)} · ${esc(x.ref)}</span>
            <h3>${esc(x.nombre)}</h3>
            <p>${valor(x.descripcion, "descripción")}</p>
            ${x.disponible === false ? `<p>${pendiente("no disponible")}</p>` : ""}
            <span class="d-flex align-items-center justify-content-between mt-auto">
              <span class="precio">${fmtPrecio(x.precio)}</span>
              ${botonPedir(x)}
            </span>
          </div>
        </article>`);
      cuerpo(p).appendChild(bloque);
      if (desborda(cuerpo(p))) {
        bloque.remove();
        p = paginaInterior("Recomendados");
        cuerpo(p).appendChild(bloque);
      }
    });
    return primera;
  }

  /* ---------- 5. páginas de productos por categoría ---------- */
  function categorias() {
    const inicio = {};
    D.categorias.forEach((c) => {
      const lista = D.productos.filter((x) => x.categoria === c.id);
      if (!lista.length) return;

      const nueva = (continuacion) => {
        const p = paginaInterior(c.nombre);
        cuerpo(p).innerHTML = continuacion
          ? `<div class="cat-header cat-header--cont"><i class="bi ${esc(c.icono)}"></i><h2>${esc(c.nombre)} <small class="text-body-secondary fw-normal" style="font-size:9pt">(continuación)</small></h2></div><div class="grilla"></div>`
          : `<div class="cat-header"><i class="bi ${esc(c.icono)}"></i><h2>${esc(c.nombre)}</h2><p>${esc(c.intro)}</p></div><div class="grilla"></div>`;
        return p;
      };

      let p = nueva(false);
      p.id = `cat-${c.id}`;
      inicio[c.id] = p;
      lista.forEach((x) => {
        const t = tarjeta(x);
        p.querySelector(".grilla").appendChild(t);
        if (desborda(cuerpo(p))) {
          t.remove();
          p = nueva(true);
          p.querySelector(".grilla").appendChild(t);
        }
      });
    });
    return inicio;
  }

  /* ---------- 6. contacto ---------- */
  function contacto() {
    const p = paginaInterior("Contacto");
    p.id = "contacto";
    const item = (icono, titulo, v, campo, url) => {
      const caja = `<i class="bi ${icono}"></i><div><dt>${titulo}</dt><dd>${valor(v, campo)}</dd>${url ? `<span class="contacto__accion">Abrir <i class="bi bi-arrow-up-right"></i></span>` : ""}</div>`;
      return url
        ? `<a class="contacto__item lnk" href="${esc(url)}" target="_blank" rel="noopener">${caja}</a>`
        : `<div class="contacto__item">${caja}</div>`;
    };
    cuerpo(p).innerHTML = `
      <div class="etiqueta mb-2">Estamos para atenderte</div>
      <h2 class="contacto__titulo">Contacto</h2>
      <div class="contacto__grid">
        ${item("bi-whatsapp", "WhatsApp", N.whatsapp, "WhatsApp", linkWhatsApp("Hola, vi el catálogo y quiero hacer un pedido"))}
        ${item("bi-instagram", "Instagram", N.instagram, "Instagram", linkInstagram())}
        ${item("bi-geo-alt-fill", "Dirección", N.direccion, "dirección", linkMapa())}
        ${item("bi-clock-fill", "Horario", N.horario, "horario")}
        ${item("bi-globe2", "Sitio web", N.sitioWeb, "sitio web", linkWeb())}
        ${item("bi-shop", "Tipo de comida", N.tipoComida, "tipo de comida")}
      </div>`;
    return p;
  }

  /* ---------- 7. cierre ---------- */
  function cierre() {
    raiz.appendChild(el(`
      <section class="pagina cierre">
        ${cintaPrueba()}
        <img class="cierre__logo" src="${esc(N.logo)}" alt="">
        <h2>¿Listo para pedir?</h2>
        <p>Escríbenos por WhatsApp con la referencia de los productos que quieres y te confirmamos tu pedido.</p>
        ${enlace(linkWhatsApp("Hola, vi el catálogo y quiero hacer un pedido"), `<i class="bi bi-whatsapp"></i>${valor(N.whatsapp, "WhatsApp")}`, "cierre__boton")}
        ${linkWhatsApp() ? `
        <div class="cierre__qr">
          <div class="cierre__qr-img">${qrSvg(linkWhatsApp("Hola, vi el catálogo y quiero hacer un pedido"))}</div>
          <span>Escanea para pedir<br>por WhatsApp</span>
        </div>` : ""}
        <div class="cierre__datos">
          ${enlace(linkInstagram(), `<i class="bi bi-instagram"></i> ${valor(N.instagram, "Instagram")}`)} &nbsp;·&nbsp;
          ${enlace(linkMapa(), `<i class="bi bi-geo-alt-fill"></i> ${valor(N.direccion, "dirección")}`)}
        </div>
      </section>`));
  }

  /* ---------- validación: todo producto debe aparecer en el catálogo ---------- */
  function validar() {
    const refs = new Set([...raiz.querySelectorAll(".producto[data-ref]")].map((n) => n.dataset.ref));
    const faltantes = D.productos.filter((x) => !refs.has(x.ref)).map((x) => x.ref);
    const pendientes = [];
    D.productos.forEach((x) => {
      ["nombre", "descripcion", "precio", "foto"].forEach((k) => {
        if (x[k] === null || x[k] === undefined || x[k] === "") pendientes.push(`${x.ref}: ${k}`);
      });
    });
    const informe = { productos: D.productos.length, enCatalogo: refs.size, faltantes, pendientes };
    window.__VALIDACION__ = informe;
    console.log("VALIDACION " + JSON.stringify(informe));
  }

  /* ---------- modo pliegos (index.html?pliegos): revista abierta ----------
     Portada sola y luego páginas de dos en dos (2–3, 4–5, …), igual que en
     revista.html. Se usa para exportar dist/catalogo-revista.pdf. */
  function armarPliegos(paginas) {
    document.body.classList.add("modo-pliegos");
    const sola = (p) => {
      const w = el(`<div class="pliego pliego--sola"></div>`);
      raiz.appendChild(w);
      w.appendChild(p);
    };
    sola(paginas[0]);
    for (let i = 1; i < paginas.length; i += 2) {
      if (i + 1 >= paginas.length) { sola(paginas[i]); break; }
      const w = el(`<div class="pliego"></div>`);
      raiz.appendChild(w);
      w.appendChild(paginas[i]);
      w.appendChild(paginas[i + 1]);
    }
  }

  /* ---------- montaje ---------- */
  function construir() {
    portada();
    presentacion();
    indice();
    const pDest = destacados();
    const inicioCat = categorias();
    const pCont = contacto();
    cierre();

    const paginas = [...raiz.querySelectorAll(".pagina")];
    paginas.forEach((p, i) => {
      const n = p.querySelector(".pagina__footer .num");
      if (n) n.textContent = String(i + 1).padStart(2, "0");
    });
    const num = (p) => String(paginas.indexOf(p) + 1).padStart(2, "0");
    Object.entries(inicioCat).forEach(([id, p]) => {
      const t = raiz.querySelector(`[data-indice="${id}"]`);
      if (t) t.textContent = num(p);
    });
    const tD = raiz.querySelector('[data-indice="destacados"]');
    if (tD) pDest ? (tD.textContent = num(pDest)) : tD.closest(".indice__item").remove();
    raiz.querySelector('[data-indice="contacto"]').textContent = num(pCont);

    validar();
    if (new URLSearchParams(location.search).has("pliegos")) armarPliegos(paginas);
    document.documentElement.dataset.listo = "1";
    document.dispatchEvent(new CustomEvent("catalogo:listo"));
  }

  // Se espera a fuentes e imágenes para medir alturas reales antes de paginar.
  const fuentes = document.fonts
    ? Promise.all(
        ['400 1em "Work Sans"', '600 1em "Work Sans"', '600 1em "Fraunces"', '800 1em "Fraunces"', 'italic 400 1em "Fraunces"']
          .map((f) => document.fonts.load(f).catch(() => null))
      ).then(() => document.fonts.ready)
    : Promise.resolve();
  Promise.all([
    fuentes,
    new Promise((r) => (document.readyState === "complete" ? r() : window.addEventListener("load", r))),
  ]).then(construir);
})();
