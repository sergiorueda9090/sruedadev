/* =========================================================================
   OXI SMART — MAQUETADOR DEL CATÁLOGO A4 (PDF + revista)
   Construye las páginas desde los MISMOS datos del sitio web:
     assets/js/data/company.js · categories.js · products.js · credits.js
   - Si cambia un producto o precio en products.js, el catálogo lo trae.
   - Fichas sin cortes entre páginas; una categoría nunca deja su banda
     sola al final de una página.
   - Campos en null → se marcan "Pendiente" (no se inventa información).
   - Al terminar dispara el evento "catalogo:listo" (lo usa revista.js).
   ========================================================================= */
(function () {
  "use strict";

  const OXI = window.OXI || {};
  const C = OXI.company || {};
  const CATS = [...(OXI.categories || [])].sort((a, b) => a.orden - b.orden);
  const PRODS = OXI.products || [];
  const FIELDS = OXI.specFields || [];
  const CR = OXI.credits || {};
  const raiz = document.getElementById("catalogo");

  const LOGO = "assets/images/logo/oxi-logo.svg";
  const MARCA = "assets/images/logo/oxi-mark.svg";
  const FOTO_PORTADA = "assets/images/banners/hero-aireadores.webp";
  const FOTO_EMPRESA = "assets/images/banners/estanques-aireacion.webp";
  const FOTO_COTIZAR = "assets/images/banners/tilapia-tanque.webp";

  /* ---------- utilidades ---------- */
  const esc = (v) =>
    String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const vacio = (v) => v === null || v === undefined || v === "" || (Array.isArray(v) && !v.length);
  const pendiente = (campo) => `<span class="pendiente">Pendiente: ${esc(campo)}</span>`;
  const valor = (v, campo) => (vacio(v) ? pendiente(campo) : esc(v));
  const pesos = (p) => `$${Number(p).toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;
  const el = (html) => {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };
  const cat = (id) => CATS.find((c) => c.id === id) || {};
  const deCategoria = (id) => PRODS.filter((p) => p.categoria === id);
  const fotoCategoria = (c) => c.imagen || (deCategoria(c.id).find((p) => p.imagenes && p.imagenes.length) || { imagenes: [{}] }).imagenes[0].src;

  /* ---------- enlaces (misma regla que assets/js/whatsapp.js) ---------- */
  const numeroWa = String(C.whatsapp || "").replace(/\D/g, "");
  const wa = (texto) => `${numeroWa ? `https://wa.me/${numeroWa}` : "https://wa.me/"}?text=${encodeURIComponent(texto)}`;
  const MSG = `Hola, estoy interesado en cotizar con ${C.nombre}.\n\nVi el catálogo ${C.catalogo?.edicion || ""} y solicito información comercial y técnica.`;
  const msgProducto = (p) =>
    `Hola, estoy interesado en cotizar con ${C.nombre}.\n\nProducto: ${p.nombre}\nReferencia: ${p.referencia || "Por asignar"}\nPrecio: ${vacio(p.precio) ? "Consultar precio" : pesos(p.precio) + " COP"}\n\nSolicito información comercial y técnica.`;
  const enlace = (url, html, cls = "") =>
    url ? `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener">${html}</a>` : `<span class="${cls}">${html}</span>`;
  const qrSvg = (texto) => {
    if (!texto || typeof qrcode !== "function") return "";
    const q = qrcode(0, "M");
    q.addData(texto);
    q.make();
    return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
  };
  // El QR solo se imprime con un número real: un QR a "wa.me/" sin número no sirve en papel.
  const qrWhatsapp = () => (numeroWa ? qrSvg(wa(MSG)) : `<div class="qr-pendiente">QR pendiente:<br>número de WhatsApp</div>`);
  const tiktok = C.redes && C.redes.tiktok;
  const usuarioTiktok = tiktok ? "@" + tiktok.split("@").pop() : null;
  const web = C.sitioWeb ? C.sitioWeb.replace(/^https?:\/\//, "") : null;

  /* ---------- estructura de página interior ---------- */
  function paginaInterior(seccion) {
    const p = el(`
      <section class="pagina pagina--interior">
        <header class="pagina__header">
          <div class="marca"><img src="${MARCA}" alt=""><div><b>${esc(C.nombre)}</b><span>${esc(C.catalogo?.titulo || "Catálogo")} ${esc(C.catalogo?.edicion || "")}</span></div></div>
          <div class="seccion">${esc(seccion)}</div>
        </header>
        <div class="pagina__cuerpo"></div>
        <footer class="pagina__footer">
          ${enlace(wa(MSG), `<i class="bi bi-whatsapp"></i>Cotiza por WhatsApp${numeroWa ? ": " + esc(C.telefono || numeroWa) : ""}`)}
          ${web ? enlace(C.sitioWeb, `<i class="bi bi-globe2"></i>${esc(web)}`) : ""}
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
        <div class="portada__foto"><img src="${FOTO_PORTADA}" alt="Aireadores de paletas en operación en un estanque piscícola"></div>
        <div class="portada__top">
          <div class="portada__logo"><img src="${LOGO}" alt="Logo ${esc(C.nombre)}"></div>
          <div class="portada__edicion">Edición ${esc(C.catalogo?.edicion || "")}</div>
        </div>
        <div class="portada__texto">
          <div class="kicker kicker--claro">${esc(C.catalogo?.titulo || "Catálogo de equipos")}</div>
          <h1>Equipos para<br><span>piscicultura</span> y oxigenación</h1>
          <p>${esc(C.lema)}</p>
        </div>
        <div class="portada__cats">
          ${CATS.filter((c) => deCategoria(c.id).length).map((c) => `<a href="#cat-${esc(c.id)}"><i class="bi ${esc(c.icono)}"></i><span>${esc(c.nombre)}</span></a>`).join("")}
        </div>
        <div class="portada__pie">
          <div class="contacto">
            ${enlace(wa(MSG), `<i class="bi bi-whatsapp"></i>${numeroWa ? esc(C.telefono || numeroWa) : "Cotiza por WhatsApp"}`)}
            ${web ? enlace(C.sitioWeb, `<i class="bi bi-globe2"></i>${esc(web)}`) : ""}
            ${tiktok ? enlace(tiktok, `<i class="bi bi-tiktok"></i>${esc(usuarioTiktok)}`) : ""}
          </div>
          ${enlace(wa(MSG), `<i class="bi bi-whatsapp"></i> Solicita tu cotización`, "btn-pedir btn-pedir--grande")}
        </div>
      </section>`));
  }

  /* ---------- 2. empresa ---------- */
  function empresa() {
    const p = paginaInterior("Empresa");
    cuerpo(p).innerHTML = `
      <div class="empresa__foto"><img src="${FOTO_EMPRESA}" alt="Estanque piscícola con aireación"></div>
      <div class="kicker">Quiénes somos</div>
      <h2 class="titulo-pagina">${esc(C.nombre)}</h2>
      <div class="empresa__texto">${(C.presentacion || [C.descripcion]).map((t) => `<p>${esc(t)}</p>`).join("")}</div>
      <div class="grid-mv">
        <div class="mv"><h3><i class="bi bi-bullseye"></i>Misión</h3><p>${valor(C.mision, "misión")}</p></div>
        <div class="mv"><h3><i class="bi bi-eye"></i>Visión</h3><p>${valor(C.vision, "visión")}</p></div>
      </div>
      <div class="datos-empresa">
        <div class="dato"><i class="bi bi-geo-alt-fill"></i><div><b>Ubicación</b>${valor(C.ciudad, "ciudad")}, ${esc(C.pais)}</div></div>
        <div class="dato"><i class="bi bi-clock-fill"></i><div><b>Horario</b>${valor(C.horario, "horario")}</div></div>
        <div class="dato"><i class="bi bi-envelope-fill"></i><div><b>Correo</b>${valor(C.email, "correo")}</div></div>
      </div>
      <div class="kicker mt-4">Qué encontrarás en este catálogo</div>
      <div class="lineas">
        ${CATS.filter((c) => deCategoria(c.id).length).map((c) => `<a href="#cat-${esc(c.id)}"><i class="bi ${esc(c.icono)}"></i><span>${esc(c.nombre)}</span></a>`).join("")}
      </div>`;
  }

  /* ---------- 3. índice ---------- */
  function indice() {
    const p = paginaInterior("Contenido");
    cuerpo(p).innerHTML = `
      <div class="kicker">Contenido</div>
      <h2 class="titulo-pagina">Nuestras <em>líneas de producto</em></h2>
      <div class="grid-indice">
        ${CATS.map((c) => {
          const l = deCategoria(c.id);
          if (!l.length) return "";
          const f = fotoCategoria(c);
          return `
            <a class="cat-card" href="#cat-${esc(c.id)}">
              <div class="cat-card__foto">${f ? `<img src="${esc(f)}" alt="">` : `<div class="icono-grande"><i class="bi ${esc(c.icono)}"></i></div>`}</div>
              <div class="cat-card__info">
                <div class="cat-card__nombre"><i class="bi ${esc(c.icono)}"></i>${esc(c.nombre)}</div>
                <div class="cat-card__intro">${esc(c.descripcion)}</div>
                <div class="cat-card__cuenta">${l.length} producto${l.length === 1 ? "" : "s"}</div>
              </div>
              <div class="cat-card__pag"><div><small>Página</small><b data-indice="${esc(c.id)}"></b></div></div>
            </a>`;
        }).join("")}
      </div>
      <p class="indice__ayuda"><i class="bi bi-hand-index"></i> Toca una línea para ir directo a ella · Equipos destacados en la página <b data-indice="destacados"></b> · Guía de selección en la página <b data-indice="guia"></b> · Cómo cotizar en la página <b data-indice="cotizar"></b></p>`;
  }

  /* ---------- foto de producto ---------- */
  function foto(p, { conTop = false } = {}) {
    const i = (p.imagenes || [])[0];
    const top = conTop && p.destacado ? `<span class="etiqueta-top"><i class="bi bi-star-fill"></i>Destacado</span>` : "";
    if (!i) return `<div class="sin-foto"><i class="bi ${esc(cat(p.categoria).icono || "bi-image")}"></i>Fotografía pendiente</div>${top}`;
    return `<img src="${esc(i.src)}" alt="${esc(i.alt || p.nombre)}" class="${i.encuadre === "contain" ? "contain" : ""}">${top}${i.ilustrativa ? `<span class="etiqueta-foto">Foto ilustrativa</span>` : ""}`;
  }
  const precio = (p) =>
    vacio(p.precio)
      ? `<div class="precio precio--consultar"><small>Precio</small><b>Consultar precio</b></div>`
      : `<div class="precio"><small>Precio ${esc(C.moneda || "COP")}</small><b>${pesos(p.precio)}</b></div>`;
  const botonCotizar = (p) => `<a class="btn-pedir" data-ref="${esc(p.id)}" href="${esc(wa(msgProducto(p)))}" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i>Cotizar</a>`;

  /* ---------- 4. destacados ---------- */
  function destacados() {
    const lista = PRODS.filter((p) => p.destacado);
    if (!lista.length) return null;
    const p = paginaInterior("Destacados");
    p.id = "destacados";
    const celdas = lista.slice(0, 6).map((x) => `
      <article class="dest">
        <div class="dest__foto">${foto(x)}</div>
        <div class="dest__cuerpo">
          <div class="dest__cat">${esc(cat(x.categoria).nombre)}</div>
          <h3>${esc(x.nombre)}</h3>
          <p>${valor(x.resumen, "resumen")}</p>
          <div class="dest__pie">${precio(x)}<a class="ver" href="#prod-${esc(x.id)}">Ver equipo <i class="bi bi-arrow-right"></i></a></div>
        </div>
      </article>`);
    if (celdas.length % 2) {
      celdas.push(`
        <article class="dest dest--cta">
          <div class="kicker kicker--claro">Asesoría</div>
          <h3>¿No sabes qué equipo necesitas?</h3>
          <p>Cuéntanos el tipo de cultivo, el tamaño de tus estanques o tanques y la energía disponible en la finca.</p>
          ${enlace(wa(MSG), `<i class="bi bi-whatsapp"></i> Escríbenos`, "btn-pedir btn-pedir--grande btn-claro")}
        </article>`);
    }
    cuerpo(p).innerHTML = `
      <div class="kicker">Lo más consultado</div>
      <h2 class="titulo-pagina">Equipos <em>destacados</em></h2>
      <div class="grid-destacados">${celdas.join("")}</div>`;
    // Si no caben, se reduce el alto de las fotos hasta que quepan
    let h = 47;
    while (desborda(cuerpo(p)) && h > 22) {
      h -= 3;
      p.querySelectorAll(".dest__foto").forEach((f) => (f.style.height = h + "mm"));
    }
    return p;
  }

  /* ---------- datos técnicos (assets/js/data/fichas-tecnicas.js) ---------- */
  const FICHAS = OXI.fichas || {};
  const SISTEMAS = OXI.sistemas || [];
  const lineasCat = (c) => deCategoria(c.id);

  /* ---------- esquema de medidas (SVG) ---------- */
  function esquema(dim) {
    if (!dim) return "";
    const st = 'stroke="currentColor" fill="none" stroke-width="1.4"';
    const cota = 'stroke="#13A6A0" stroke-width="1" marker-start="url(#fl)" marker-end="url(#fl)"';
    const defs = `<defs><marker id="fl" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 1 L7 4 L0 7z" fill="#13A6A0"/></marker></defs>`;
    const txt = (x, y, t, rot) => `<text x="${x}" y="${y}" ${rot ? `transform="rotate(${rot} ${x} ${y})"` : ""} text-anchor="middle" class="cota">${esc(t)}</text>`;
    if (dim.tipo === "cilindro") {
      return `<svg viewBox="0 0 220 150" class="esquema">${defs}
        <ellipse cx="100" cy="38" rx="70" ry="18" ${st}/>
        <path d="M30 38 V108 A70 18 0 0 0 170 108 V38" ${st}/>
        <path d="M30 108 A70 18 0 0 1 170 108" ${st} stroke-dasharray="3 3" opacity=".45"/>
        <line x1="30" y1="12" x2="170" y2="12" ${cota}/>${txt(100, 8, "Ø " + dim.d)}
        <line x1="188" y1="38" x2="188" y2="108" ${cota}/>${txt(204, 73, dim.h, -90)}
      </svg>`;
    }
    // caja isométrica
    return `<svg viewBox="0 0 220 150" class="esquema">${defs}
      <path d="M40 60 L120 40 L180 62 L100 84 Z" ${st}/>
      <path d="M40 60 V112 L100 136 V84" ${st}/>
      <path d="M100 136 L180 114 V62" ${st}/>
      <line x1="34" y1="122" x2="94" y2="146" ${cota}/>${txt(52, 145, dim.l, 22)}
      <line x1="108" y1="146" x2="186" y2="124" ${cota}/>${txt(160, 146, dim.a, -16)}
      <line x1="26" y1="60" x2="26" y2="112" ${cota}/>${txt(16, 86, dim.h, -90)}
    </svg>`;
  }

  /* ---------- 5a. portadilla de categoría: doble página (foto izq. + texto der.) ---------- */
  function apertura(c, n) {
    const f = fotoCategoria(c);
    const lista = lineasCat(c);
    const izq = el(`
      <section class="pagina apertura apertura--foto" id="cat-${esc(c.id)}">
        ${f ? `<img class="apertura__img" src="${esc(f)}" alt="">` : `<div class="apertura__grafica"><i class="bi ${esc(c.icono)}"></i></div>`}
        <div class="apertura__num">${String(n).padStart(2, "0")}</div>
        <div class="apertura__marca"><img src="${MARCA}" alt=""> ${esc(C.nombre)}</div>
      </section>`);
    const der = el(`
      <section class="pagina apertura apertura--texto">
        <div class="apertura__texto">
          <div class="kicker kicker--claro">Línea de producto ${String(n).padStart(2, "0")}</div>
          <h2><i class="bi ${esc(c.icono)}"></i><br>${esc(c.nombre)}</h2>
          <p>${esc(c.descripcion)}</p>
          <ol class="apertura__lista">
            ${lista.map((x) => `<li><a href="#prod-${esc(x.id)}"><span>${esc(x.nombre)}</span><i></i><b data-indice="prod-${esc(x.id)}"></b></a></li>`).join("")}
          </ol>
          <p class="apertura__ayuda"><i class="bi bi-book-half"></i> Cada equipo en doble página: presentación a la izquierda y ficha técnica a la derecha.</p>
        </div>
        <div class="apertura__marca">${esc(C.catalogo?.titulo || "")} ${esc(C.catalogo?.edicion || "")}</div>
      </section>`);
    raiz.appendChild(izq);
    raiz.appendChild(der);
    return izq;
  }

  /* ---------- 5b. página de producto (izquierda del pliego) ---------- */
  function paginaProducto(x) {
    const c = cat(x.categoria);
    const F = FICHAS[x.id] || {};
    const p = paginaInterior(c.nombre);
    p.id = `prod-${x.id}`;
    p.dataset.prod = x.id;
    p.classList.add("pp");
    const i = (x.imagenes || [])[0];
    const fotoHtml = i
      ? `<img src="${esc(i.src)}" alt="${esc(i.alt || x.nombre)}" class="${i.encuadre === "contain" ? "contain" : ""}">${i.ilustrativa ? `<span class="etiqueta-foto">Foto ilustrativa</span>` : ""}`
      : `<div class="plano"><i class="bi ${esc(c.icono)}"></i><span>Fotografía del equipo pendiente</span></div>`;
    const extra = (x.imagenes || []).slice(1, 3);
    cuerpo(p).innerHTML = `
      <div class="pp__foto ${extra.length ? "pp__foto--con-mini" : ""}">
        ${fotoHtml}
        ${x.destacado ? `<span class="etiqueta-top"><i class="bi bi-star-fill"></i>Destacado</span>` : ""}
        ${extra.length ? `<div class="pp__minis">${extra.map((m) => `<img src="${esc(m.src)}" alt="${esc(m.alt || "")}">`).join("")}</div>` : ""}
      </div>
      <div class="pp__meta">
        <span class="dest__cat"><i class="bi ${esc(c.icono)}"></i> ${esc(c.nombre)}</span>
        <span class="ref">REF. ${x.referencia ? esc(x.referencia) : '<span class="pendiente">Por asignar</span>'}</span>
      </div>
      <h2 class="pp__nombre">${esc(x.nombre)}</h2>
      <p class="pp__lead">${valor(x.resumen, "resumen")}</p>
      <p class="pp__desc">${valor(x.descripcion, "descripción")}</p>
      ${(F.ventajas || []).length ? `<div class="pp__ventajas">${F.ventajas.map((v) => `<div class="ventaja"><i class="bi ${esc(v.i)}"></i><b>${esc(v.t)}</b><span>${esc(v.d)}</span></div>`).join("")}</div>` : ""}
      ${(x.aplicaciones || []).length ? `<div class="pp__aplic"><b>Aplicaciones</b><ul class="aplic">${x.aplicaciones.map((a) => `<li><i class="bi bi-check2"></i>${esc(a)}</li>`).join("")}</ul></div>` : ""}
      <div class="pp__pie">
        ${precio(x)}
        <a class="pp__ver" href="#ficha-${esc(x.id)}">Ficha técnica <i class="bi bi-arrow-right"></i></a>
        ${botonCotizar(x)}
      </div>`;
    // si el texto no cabe, la foto cede espacio
    const fo = p.querySelector(".pp__foto");
    let h = 100;
    while (desborda(cuerpo(p)) && h > 55) fo.style.height = (h -= 5) + "mm";
    return p;
  }

  /* ---------- 5c. ficha técnica (derecha del pliego) ---------- */
  function paginaFicha(x) {
    const c = cat(x.categoria);
    const F = FICHAS[x.id];
    const p = paginaInterior("Ficha técnica");
    p.id = `ficha-${x.id}`;
    p.classList.add("ft");
    if (!F) {
      cuerpo(p).innerHTML = `<div class="ft__cab"><div><div class="kicker">Ficha técnica</div><h2>${esc(x.nombre)}</h2></div></div>${pendiente("ficha técnica completa")}`;
      return p;
    }
    const rec = new Set(F.sistemas?.recomendado || []);
    const pos = new Set(F.sistemas?.posible || []);
    cuerpo(p).innerHTML = `
      <div class="ft__cab">
        <div>
          <div class="kicker">Ficha técnica · ${esc(c.nombre)}</div>
          <h2>${esc(x.nombre)}</h2>
        </div>
        <div class="ft__ref"><small>Referencia</small>${x.referencia ? `<b>${esc(x.referencia)}</b>` : '<span class="pendiente">Por asignar</span>'}</div>
      </div>
      <div class="ft__kpis">
        ${(F.kpis || []).map((k) => `<div class="kpi"><b>${esc(k.v)}<small>${esc(k.u)}</small></b><span>${esc(k.l)}</span></div>`).join("")}
      </div>
      <div class="ft__grid">
        <div class="ft__tablas">
          ${(F.grupos || []).map((g) => `
            <table class="placa">
              <caption><i class="bi ${esc(g.i)}"></i>${esc(g.t)}</caption>
              <tbody>${g.f.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</tbody>
            </table>`).join("")}
        </div>
        <aside class="ft__lado">
          ${F.dim ? `<div class="ft__caja"><h4><i class="bi bi-rulers"></i>Esquema de medidas</h4>${esquema(F.dim)}</div>` : ""}
          <div class="ft__caja">
            <h4><i class="bi bi-grid-3x3-gap"></i>Uso recomendado</h4>
            <ul class="sistemas">
              ${SISTEMAS.map((s) => {
                const nivel = rec.has(s.id) ? "rec" : pos.has(s.id) ? "pos" : "no";
                return `<li class="sis sis--${nivel}"><i class="bi ${esc(s.icono)}"></i><span>${esc(s.nombre)}</span><em>${nivel === "rec" ? "●●●" : nivel === "pos" ? "●●○" : "○○○"}</em></li>`;
              }).join("")}
            </ul>
            <div class="sis-ley"><span>●●● Ideal</span><span>●●○ Posible</span><span>○○○ No aplica</span></div>
          </div>
        </aside>
      </div>
      <div class="ft__listas">
        ${(F.incluye || []).length ? `<div><h4><i class="bi bi-box-seam"></i>Incluye</h4><ul>${F.incluye.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>` : ""}
        ${(F.mantenimiento || []).length ? `<div><h4><i class="bi bi-wrench-adjustable"></i>Mantenimiento</h4><ul>${F.mantenimiento.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>` : ""}
      </div>
      <div class="ft__pie">
        <div class="garantia"><i class="bi bi-patch-check-fill"></i><div><small>Garantía</small><b>${valor(F.garantia, "garantía")}</b></div></div>
        ${F.referencial ? `<p class="ft__nota"><i class="bi bi-info-circle"></i>Datos técnicos de referencia para equipos de este tipo. Los valores definitivos dependen del modelo y se confirman en la cotización formal.</p>` : ""}
        ${botonCotizar(x)}
      </div>`;
    // ajuste fino si una ficha extensa no cabe
    if (desborda(cuerpo(p))) p.classList.add("ft--compacta");
    if (desborda(cuerpo(p))) p.classList.add("ft--mini");
    return p;
  }

  /* ---------- 5. líneas de producto en pliegos: producto (izq.) + ficha (der.) ----------
     Con portada sola, las páginas pares quedan a la izquierda: cada producto
     empieza en página par para que su ficha quede enfrente. */
  function productos() {
    const inicio = {};
    const total = () => raiz.querySelectorAll(".pagina").length;
    let n = 0;
    CATS.forEach((c) => {
      const lista = lineasCat(c);
      if (!lista.length) return;
      // la portadilla (doble página) empieza en página par → los productos también
      if ((total() + 1) % 2 === 1) relleno();
      inicio[c.id] = apertura(c, ++n);
      lista.forEach((x) => {
        paginaProducto(x);
        paginaFicha(x);
      });
    });
    return inicio;
  }

  /* página comodín para cuadrar los pliegos (solo si hace falta) */
  function relleno() {
    const p = el(`
      <section class="pagina relleno">
        <img class="relleno__img" src="assets/images/banners/asesoria-revista.jpg" data-fuente="assets/images/products/aireador-splash-2.webp" alt="Estanques piscícolas con aireadores en operación">
        <div class="relleno__caja">
          <div class="kicker kicker--claro">Asesoría técnica</div>
          <h2>¿No sabes qué equipo necesitas?</h2>
          <p>Cuéntanos el tipo de cultivo, el área y la profundidad de tus estanques o tanques, y la energía disponible en la finca. Te ayudamos a elegir.</p>
          ${enlace(wa(MSG), `<i class="bi bi-whatsapp"></i> Habla con un asesor`, "btn-pedir btn-pedir--grande btn-claro")}
        </div>
        <span class="etiqueta-foto">Foto ilustrativa</span>
      </section>`);
    raiz.appendChild(p);
    return p;
  }

  /* ---------- 5d. guía de selección ---------- */
  function guia() {
    const p = paginaInterior("Guía de selección");
    p.id = "guia";
    const cols = PRODS.filter((x) => FICHAS[x.id] && ["aireadores", "oxigenacion"].includes(x.categoria));
    cuerpo(p).innerHTML = `
      <div class="kicker">Guía rápida</div>
      <h2 class="titulo-pagina">¿Qué equipo de <em>oxigenación</em> elegir?</h2>
      <p class="guia__intro">Cruza tu sistema de cultivo con el equipo. Toca el nombre del equipo para ir a su ficha técnica.</p>
      <table class="matriz">
        <thead><tr><th></th>${cols.map((x) => `<th><a href="#ficha-${esc(x.id)}">${esc(x.nombre)}</a></th>`).join("")}</tr></thead>
        <tbody>
          ${SISTEMAS.map((s) => `<tr><th><i class="bi ${esc(s.icono)}"></i>${esc(s.nombre)}</th>${cols.map((x) => {
            const S = FICHAS[x.id].sistemas || {};
            const v = (S.recomendado || []).includes(s.id) ? "rec" : (S.posible || []).includes(s.id) ? "pos" : "";
            return `<td>${v ? `<span class="punto punto--${v}"></span>` : ""}</td>`;
          }).join("")}</tr>`).join("")}
        </tbody>
      </table>
      <div class="sis-ley mt-2"><span><span class="punto punto--rec"></span> Recomendado</span><span><span class="punto punto--pos"></span> Posible</span></div>
      <div class="guia__tips">
        <div class="tip"><i class="bi bi-moon-stars"></i><b>Mide en la madrugada</b><span>El oxígeno disuelto baja durante la noche y llega a su mínimo antes del amanecer.</span></div>
        <div class="tip"><i class="bi bi-thermometer-half"></i><b>Más calor, menos oxígeno</b><span>El agua caliente retiene menos oxígeno: en clima cálido la aireación es más crítica.</span></div>
        <div class="tip"><i class="bi bi-diagram-2"></i><b>Reparte la aireación</b><span>Varios equipos bien ubicados oxigenan mejor que uno solo de gran potencia.</span></div>
        <div class="tip"><i class="bi bi-lightning-charge"></i><b>Revisa la energía</b><span>Confirma voltaje y fases disponibles en la finca antes de elegir el motor.</span></div>
      </div>
      <p class="ft__nota mt-4"><i class="bi bi-info-circle"></i>Guía orientativa. Para dimensionar la aireación de tu proyecto, escríbenos con el área, la profundidad y la especie.</p>`;
    return p;
  }

  /* ---------- 6. cómo cotizar ---------- */
  function comoCotizar() {
    const p = paginaInterior("Cómo cotizar");
    p.id = "cotizar";
    cuerpo(p).innerHTML = `
      <div class="kicker">Cotización</div>
      <h2 class="titulo-pagina">Cómo <em>cotizar</em> tus equipos</h2>
      <div class="pasos">
        <div class="paso"><i class="bi bi-search"></i><b>Elige</b><span>Revisa el catálogo y anota los equipos que te interesan.</span></div>
        <div class="paso"><i class="bi bi-whatsapp"></i><b>Escríbenos</b><span>Toca “Cotizar” en la ficha o escríbenos por WhatsApp.</span></div>
        <div class="paso"><i class="bi bi-chat-dots"></i><b>Cuéntanos</b><span>Cantidad, ciudad y tipo de cultivo o proyecto.</span></div>
        <div class="paso"><i class="bi bi-file-earmark-text"></i><b>Recibe</b><span>Te enviamos la cotización formal con precio y condiciones.</span></div>
      </div>
      <div class="kicker">Mensaje sugerido</div>
      <div class="mensaje-modelo mt-3">Hola, estoy interesado en cotizar con ${esc(C.nombre)}.
Producto: (nombre del equipo)
Cantidad: (unidades)
Ciudad: (municipio del proyecto)
Solicito información comercial y técnica.</div>
      <div class="aviso"><i class="bi bi-info-circle-fill"></i><div>${valor(C.catalogo?.notaPrecios, "nota de precios")}</div></div>
      <div class="cotizar__foto"><img src="${FOTO_COTIZAR}" alt="Tilapias en un tanque de cultivo"><span class="etiqueta-foto">Foto ilustrativa</span></div>`;
    // La foto final se ajusta al espacio que quede (o se quita si no cabe)
    const fc = p.querySelector(".cotizar__foto");
    let hf = 62;
    while (desborda(cuerpo(p)) && hf > 30) fc.style.height = (hf -= 4) + "mm";
    if (desborda(cuerpo(p))) fc.remove();
    return p;
  }

  /* ---------- 7. contraportada ---------- */
  function cierre() {
    const usados = new Set([...raiz.querySelectorAll("img")].map((i) => i.dataset.fuente || i.getAttribute("src")));
    const creditos = Object.entries(CR)
      .filter(([src]) => usados.has(src))
      .filter(([, c], i, arr) => arr.findIndex(([, d]) => d.fuente === c.fuente) === i)
      .map(([, c]) => `“${esc(c.titulo.replace(/\.(jpe?g|png)$/i, ""))}”, ${esc(c.autor || "autor desconocido")}, ${esc(c.licencia)}`)
      .join(" · ");
    const p = el(`
      <section class="pagina cierre" id="contacto">
        <div class="cierre__logo"><img src="${LOGO}" alt="Logo ${esc(C.nombre)}"></div>
        <h2>Oxigena tu producción<br><span>con el equipo adecuado</span></h2>
        <p>Cuéntanos qué necesitas y en qué ciudad está tu proyecto. Te respondemos con la cotización.</p>
        ${enlace(wa(MSG), `<i class="bi bi-whatsapp"></i> Solicita tu cotización por WhatsApp`, "btn-pedir btn-pedir--grande")}
        <div class="cierre__qr qr">${qrWhatsapp()}</div>
        <div class="cierre__qr-txt">Escanea y cotiza por WhatsApp</div>
        <div class="cierre__datos">
          <div>${enlace(wa(MSG), `<i class="bi bi-whatsapp"></i>${valor(C.telefono || (numeroWa || null), "WhatsApp")}`)}</div>
          <div><i class="bi bi-envelope-fill"></i>${valor(C.email, "correo")}</div>
          <div><i class="bi bi-geo-alt-fill"></i>${valor(C.direccion, "dirección")}${C.ciudad ? ", " + esc(C.ciudad) : ""}</div>
          <div><i class="bi bi-clock-fill"></i>${valor(C.horario, "horario")}</div>
          <div>${web ? enlace(C.sitioWeb, `<i class="bi bi-globe2"></i>${esc(web)}`) : `<i class="bi bi-globe2"></i>${pendiente("sitio web")}`}</div>
          <div>${tiktok ? enlace(tiktok, `<i class="bi bi-tiktok"></i>${esc(usuarioTiktok)}`) : ""}</div>
        </div>
        ${creditos ? `<div class="creditos"><b>Fotografías ilustrativas de Wikimedia Commons (licencias libres):</b>${creditos}</div>` : ""}
      </section>`);
    raiz.appendChild(p);
    return p;
  }

  /* ---------- reparte el espacio libre de las páginas de productos ---------- */
  function repartirEspacio() {
    const MM = 96 / 25.4;
    raiz.querySelectorAll(".pagina").forEach((p) => {
      const c = cuerpo(p);
      const fichas = c ? c.querySelectorAll(".producto") : [];
      if (!c || !fichas.length) return;
      const fondo = () => c.getBoundingClientRect().bottom - parseFloat(getComputedStyle(c).paddingBottom);
      // Mucho espacio libre → llamado a cotizar en lugar del hueco
      if (fondo() - c.lastElementChild.getBoundingClientRect().bottom > 48 * MM) {
        c.insertAdjacentHTML("beforeend", `
          <aside class="cta-relleno">
            <div>
              <div class="kicker kicker--claro">¿Necesitas varios equipos?</div>
              <h3>Arma tu cotización completa</h3>
              <p>Dinos qué equipos necesitas, cuántas unidades y dónde está tu proyecto.</p>
              ${enlace(wa(MSG), `<i class="bi bi-whatsapp"></i> Cotizar por WhatsApp`, "btn-pedir btn-pedir--grande btn-claro")}
            </div>
            ${numeroWa ? `<div class="qr" style="background:#fff;padding:2mm;border-radius:2mm">${qrSvg(wa(MSG))}</div>` : ""}
          </aside>`);
        if (desborda(c)) c.lastElementChild.remove();
      }
      if (fichas.length < 2) return;
      const libre = fondo() - c.lastElementChild.getBoundingClientRect().bottom;
      if (libre <= 0) return;
      const huecos = fichas.length - 1 + c.querySelectorAll(".seccion-cat").length - 1;
      const extra = Math.min(libre / Math.max(huecos, 1), 7 * MM);
      c.querySelectorAll(".lista").forEach((l) => (l.style.gap = `calc(4mm + ${extra.toFixed(1)}px)`));
      c.querySelectorAll(".seccion-cat + .seccion-cat").forEach((s) => (s.style.marginTop = `calc(6mm + ${extra.toFixed(1)}px)`));
    });
  }

  /* ---------- validación (la lee tools/generar_pdf_revista.sh en consola) ---------- */
  function validar() {
    const ids = new Set([...raiz.querySelectorAll(".pagina[data-prod]")].map((n) => n.dataset.prod));
    const sinFicha = PRODS.filter((p) => !FICHAS[p.id]).map((p) => p.id);
    const sinImagen = PRODS.filter((p) => vacio(p.imagenes)).map((p) => p.id);
    const malPareadas = PRODS.filter((p) => { const i = [...raiz.querySelectorAll(".pagina")].indexOf(raiz.querySelector(`#prod-${CSS.escape(p.id)}`)); return (i + 1) % 2 !== 0; }).map((p) => p.id);
    const faltantes = PRODS.filter((p) => !ids.has(p.id)).map((p) => p.id);
    const todas = [...raiz.querySelectorAll(".pagina")];
    const cortadas = todas.filter((p) => { const c = cuerpo(p); return c && desborda(c); }).map((p) => todas.indexOf(p) + 1);
    const pendientes = [];
    PRODS.forEach((p) => {
      if (vacio(p.imagenes)) pendientes.push(`${p.id}: foto`);
      if (vacio(p.precio)) pendientes.push(`${p.id}: precio`);
      if (vacio(p.referencia)) pendientes.push(`${p.id}: referencia`);
    });
    window.__VALIDACION__ = { productos: PRODS.length, enCatalogo: ids.size, faltantes, sinImagen, sinFicha, malPareadas, paginasDesbordadas: cortadas, pendientes: pendientes.length };
    console.log("VALIDACION " + JSON.stringify(window.__VALIDACION__));
  }

  /* ---------- pliegos (index_revista.html?pliegos = revista abierta) ---------- */
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
    empresa();
    indice();
    const pDest = destacados();
    const pGuia = guia();
    const inicioCat = productos();
    const pCot = comoCotizar();
    // la contraportada debe quedar en página par para cerrar la revista
    if ((raiz.querySelectorAll(".pagina").length + 1) % 2 === 1) relleno();
    cierre();

    const paginas = [...raiz.querySelectorAll(".pagina")];
    const num = (p) => String(paginas.indexOf(p) + 1).padStart(2, "0");
    paginas.forEach((p) => {
      const n = p.querySelector(".pagina__footer .num");
      if (n) n.textContent = num(p);
    });
    const marcar = (clave, p) => raiz.querySelectorAll(`[data-indice="${clave}"]`).forEach((t) => (t.textContent = p ? num(p) : "—"));
    Object.entries(inicioCat).forEach(([id, p]) => marcar(id, p));
    marcar("destacados", pDest);
    marcar("cotizar", pCot);
    marcar("guia", pGuia);
    PRODS.forEach((x) => marcar("prod-" + x.id, raiz.querySelector(`#prod-${CSS.escape(x.id)}`)));

    repartirEspacio();
    validar();
    if (new URLSearchParams(location.search).has("pliegos")) armarPliegos(paginas);
    document.documentElement.dataset.listo = "1";
    document.dispatchEvent(new CustomEvent("catalogo:listo"));
  }

  const fuentes = document.fonts
    ? Promise.all(['800 1em "Manrope"', '700 1em "Manrope"', '400 1em "Inter"', '500 1em "Inter"', '600 1em "Inter"']
        .map((f) => document.fonts.load(f).catch(() => null))).then(() => document.fonts.ready)
    : Promise.resolve();
  const srcs = [FOTO_PORTADA, FOTO_EMPRESA, FOTO_COTIZAR, ...CATS.map((c) => c.imagen), ...PRODS.flatMap((p) => (p.imagenes || []).slice(0, 1).map((i) => i.src))].filter(Boolean);
  const imagenes = () => Promise.all(srcs.map((s) => new Promise((r) => { const i = new Image(); i.onload = i.onerror = r; i.src = s; })));
  Promise.all([
    fuentes,
    imagenes(),
    new Promise((r) => (document.readyState === "complete" ? r() : window.addEventListener("load", r))),
  ]).then(construir);
})();
