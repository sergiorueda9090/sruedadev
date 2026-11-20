/* =====================================================================
   OXI SMART — Generador de catálogo y fichas PDF (HTML2PDF.js)
   ---------------------------------------------------------------------
   Lee SIEMPRE los mismos datos que el sitio (OXI.products, categories,
   company): si cambia un precio en products.js, el siguiente PDF lo trae.

   Método: cada página A4 se compone como HTML de 794×1123 px, se mide
   (para que nada se corte), se numera, y se rasteriza página a página con
   html2pdf → canvas → jsPDF. Los enlaces (WhatsApp, web) quedan activos.

   API:
     OXI.pdf.catalog()              catálogo completo
     OXI.pdf.catalog("aireadores")  catálogo de una categoría
     OXI.pdf.product("id")          ficha técnica individual
   Botones: [data-pdf-catalog], [data-pdf-category-from="#select"], [data-pdf-product="id"]
   ===================================================================== */
(() => {
  "use strict";
  const OXI = (window.OXI = window.OXI || {});

  const PAGE_W = 794;          // px  (A4 a 96 ppp)
  const PAGE_H = 1123;
  const MM_PER_PX = 210 / PAGE_W;
  const SCALE = 2;             // resolución de rasterizado (2 = nítido, ~150 ppp en A4)
  const JPEG_Q = 0.86;

  /* ------------------------- Estilos del documento ------------------------- */
  const CSS = `
  .pdfx-stage{position:fixed;left:-20000px;top:0;width:${PAGE_W}px;z-index:-1;pointer-events:none}
  .pdfx-page{position:relative;width:${PAGE_W}px;height:${PAGE_H}px;overflow:hidden;background:#fff;color:#465563;
    font-family:Inter,"Segoe UI",Arial,sans-serif;font-size:12.5px;line-height:1.55;box-sizing:border-box;
    text-rendering:auto;-webkit-font-smoothing:auto;font-kerning:none;font-variant-ligatures:none}
  .pdfx-page *{box-sizing:border-box}
  .pdfx-page h1,.pdfx-page h2,.pdfx-page h3{font-family:Manrope,"Segoe UI",Arial,sans-serif;color:#123B52;font-weight:800;letter-spacing:-.02em;margin:0;line-height:1.12}
  .pdfx-page p{margin:0 0 8px}
  .pdfx-head{position:absolute;left:44px;right:44px;top:26px;height:34px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #DCE4EA}
  .pdfx-brand{display:flex;align-items:center;gap:8px;font-family:Manrope,Arial,sans-serif;font-weight:800;color:#123B52;font-size:13px;letter-spacing:-.01em}
  .pdfx-brand img{width:22px;height:22px}
  .pdfx-brand span{font-family:Inter,Arial,sans-serif;font-weight:500;color:#087EAA;font-size:11px;margin-left:2px}
  .pdfx-head-r{font-size:11px;color:#465563}
  .pdfx-foot{position:absolute;left:44px;right:44px;bottom:22px;height:28px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid #DCE4EA;font-size:10.5px;color:#6b7c89}
  .pdfx-foot a{color:#087EAA;text-decoration:none}
  .pdfx-foot b{color:#123B52;font-weight:600}
  .pdfx-body{position:absolute;left:44px;right:44px;top:76px;bottom:62px;overflow:hidden}
  .pdfx-cat{font-size:11.5px;font-weight:600;color:#087EAA;margin-bottom:4px}
  .pdfx-photo{position:relative;width:100%;border-radius:14px;background-color:#F3F6F8;background-repeat:no-repeat;background-position:center;background-size:cover}
  .pdfx-photo.contain{background-size:contain;background-color:#fff;border:1px solid #DCE4EA}
  .pdfx-photo .tag{position:absolute;left:10px;bottom:10px;background:rgba(255,255,255,.92);color:#123B52;font-size:9.5px;font-weight:500;padding:2px 8px;border-radius:99px}
  .pdfx-pending{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#6b7c89;font-size:12px;font-weight:500;
    background:repeating-linear-gradient(135deg,transparent 0 14px,rgba(18,59,82,.05) 14px 15px),#F3F6F8}
  .pdfx-pending img{width:40px;height:40px;opacity:.55}
  .pdfx-cols{display:flex;gap:26px;margin-top:20px}
  .pdfx-cols>.l{flex:1 1 auto;min-width:0}
  .pdfx-cols>.r{flex:0 0 276px}
  .pdfx-h3{font-size:14px;margin:14px 0 6px!important}
  .pdfx-list{list-style:none;padding:0;margin:0}
  .pdfx-list li{position:relative;padding:4px 0 4px 18px;border-bottom:1px solid #EEF2F5}
  .pdfx-list li:before{content:"";position:absolute;left:2px;top:10px;width:8px;height:8px;border-radius:50%;border:2px solid #13A6A0}
  .pdfx-price{border:1px solid #DCE4EA;border-radius:12px;padding:14px 16px;margin-bottom:14px}
  .pdfx-price .v{font-family:Manrope,Arial,sans-serif;font-weight:800;color:#123B52;font-size:26px;letter-spacing:-.02em;line-height:1.1}
  .pdfx-price .v small{font-family:Inter,Arial,sans-serif;font-size:12px;font-weight:500;color:#465563;letter-spacing:0}
  .pdfx-price .v.consult{color:#087EAA;font-size:21px}
  .pdfx-price .n{font-size:9.5px;color:#6b7c89;margin-top:6px;line-height:1.4}
  .pdfx-plate{position:relative;border:1.5px solid #123B52;border-radius:10px;padding:10px 10px 6px}
  .pdfx-plate:before,.pdfx-plate:after{content:"";position:absolute;top:6px;width:5px;height:5px;border-radius:50%;background:#b6c4ce}
  .pdfx-plate:before{left:6px}.pdfx-plate:after{right:6px}
  .pdfx-plate .t{font-family:Manrope,Arial,sans-serif;font-weight:800;color:#123B52;font-size:12.5px;padding:0 4px 7px;border-bottom:1.5px solid #123B52}
  .pdfx-plate table{width:100%;border-collapse:collapse}
  .pdfx-plate td{padding:5px 4px;border-bottom:1px solid #DCE4EA;vertical-align:top;font-size:11px}
  .pdfx-plate tr:last-child td{border-bottom:0}
  .pdfx-plate td.k{color:#465563;width:44%}
  .pdfx-plate td.v{color:#123B52;font-weight:700;font-family:Manrope,Arial,sans-serif}
  .pdfx-plate td.v.p{color:#8696a2;font-weight:400;font-family:Inter,Arial,sans-serif}
  .pdfx-quote{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:space-between;gap:16px;background:#F3F6F8;border-radius:12px;padding:14px 18px}
  .pdfx-quote .t{font-family:Manrope,Arial,sans-serif;font-weight:800;color:#123B52;font-size:14px}
  .pdfx-quote .s{font-size:10.5px;color:#465563;margin-top:2px;word-break:break-all}
  .pdfx-quote .s a{color:#087EAA;text-decoration:none}
  .pdfx-btn{display:inline-block;background:#2B7A5F;color:#fff!important;font-weight:600;font-size:12px;padding:9px 16px;border-radius:7px;text-decoration:none;white-space:nowrap}
  .pdfx-note{font-size:10.5px;color:#6b7c89;margin-top:10px}
  /* Portada */
  .pdfx-cover-photo{position:absolute;left:0;right:0;top:0;height:640px;background-size:cover;background-position:center 60%;background-color:#F3F6F8}
  .pdfx-cover-photo svg{position:absolute;left:0;bottom:-1px;width:100%;height:70px}
  .pdfx-cover-logo{position:absolute;left:44px;top:34px;display:flex;align-items:center;gap:10px;background:#fff;padding:10px 16px 10px 12px;border-radius:12px}
  .pdfx-cover-logo img{width:38px;height:38px}
  .pdfx-cover-logo .n{font-family:Manrope,Arial,sans-serif;font-weight:800;color:#123B52;font-size:19px;letter-spacing:-.02em;line-height:1}
  .pdfx-cover-logo .s{font-size:11px;color:#087EAA;font-weight:500;letter-spacing:.08em;margin-top:3px}
  .pdfx-cover-copy{position:absolute;left:56px;right:56px;top:660px}
  .pdfx-cover-copy h1{font-size:58px;letter-spacing:-.04em;line-height:1}
  .pdfx-cover-copy .ed{font-family:Manrope,Arial,sans-serif;font-weight:700;color:#087EAA;font-size:22px;margin-top:10px}
  .pdfx-cover-copy p{font-size:14px;max-width:470px;margin-top:16px;line-height:1.55}
  .pdfx-cover-contact{position:absolute;left:56px;right:56px;bottom:44px;display:flex;flex-wrap:wrap;gap:8px 28px;border-top:1.5px solid #123B52;padding-top:14px;font-size:12px;color:#123B52}
  .pdfx-cover-contact a{color:#123B52;text-decoration:none;font-weight:600}
  .pdfx-cover-contact span.k{color:#6b7c89;font-weight:400;margin-right:6px}
  /* Presentación */
  .pdfx-intro h2{font-size:32px;margin-bottom:14px!important}
  .pdfx-intro p{font-size:13.5px;line-height:1.65;max-width:600px}
  .pdfx-lines{margin-top:18px;border-top:1px solid #DCE4EA}
  .pdfx-line{display:flex;gap:16px;align-items:flex-start;padding:11px 0;border-bottom:1px solid #DCE4EA}
  .pdfx-line .ic{flex:0 0 38px;height:38px;border-radius:9px;background:#E6F4F6;color:#087EAA;display:flex;align-items:center;justify-content:center;font-size:18px}
  .pdfx-line h3{font-size:15px;margin-bottom:2px!important}
  .pdfx-line p{margin:0;font-size:11.5px}
  .pdfx-line .c{margin-left:auto;font-size:11px;color:#087EAA;font-weight:600;white-space:nowrap;padding-top:2px}
  /* Índice */
  .pdfx-toc h2{font-size:32px;margin-bottom:18px!important}
  .pdfx-toc-cat{margin-bottom:14px}
  .pdfx-toc-row{display:flex;align-items:baseline;gap:6px;padding:3px 0;text-decoration:none;color:#465563}
  .pdfx-toc-row .d{flex:1;border-bottom:1px dotted #b9c7d1;transform:translateY(-3px)}
  .pdfx-toc-row .pg{font-variant-numeric:tabular-nums;color:#123B52;font-weight:600;min-width:20px;text-align:right}
  .pdfx-toc-row.cat{font-family:Manrope,Arial,sans-serif;font-weight:800;color:#123B52;font-size:15px;border-bottom:1.5px solid #123B52;padding-bottom:5px;margin-bottom:4px}
  .pdfx-toc-row.cat .d{border:0}
  .pdfx-toc-row .ref{font-size:10.5px;color:#8696a2;margin-left:6px}
  /* Contraportada */
  .pdfx-back{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 80px}
  .pdfx-back img.mk{width:76px;height:76px;margin-bottom:22px}
  .pdfx-back h2{font-size:40px;letter-spacing:-.035em;max-width:560px}
  .pdfx-back .lead{font-size:15px;margin-top:14px;max-width:520px}
  .pdfx-back-list{margin-top:30px;border-top:1.5px solid #123B52}
  .pdfx-back-list div{display:flex;padding:10px 0;border-bottom:1px solid #DCE4EA;font-size:13px}
  .pdfx-back-list .k{width:140px;color:#6b7c89}
  .pdfx-back-list a,.pdfx-back-list .v{color:#123B52;font-weight:600;text-decoration:none}
  .pdfx-back .wa{margin-top:26px;align-self:flex-start;font-size:14px;padding:12px 22px}
  .pdfx-credits{position:absolute;left:80px;right:80px;bottom:34px;font-size:8.5px;color:#8696a2;line-height:1.45}
  .pdfx-wave{position:absolute;left:0;right:0;bottom:0;height:150px}
  `;

  /* ------------------------- Utilidades ------------------------- */
  const U = () => OXI.utils;
  const C = () => OXI.company;
  const esc = (s) => U().escapeHtml(s);
  const abs = (src) => new URL(src, document.baseURI).href;
  const WAVE = (fill = "#fff") =>
    `<svg viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true"><path fill="${fill}" d="M0 46c120-26 240-26 360 0s240 26 360 0 240-26 360 0 240 26 360 0V80H0z"/></svg>`;

  function contactItems() {
    const c = C();
    const items = [];
    if (c.whatsapp) items.push({ k: "WhatsApp", v: c.telefono || `+${c.whatsapp}`, href: OXI.whatsapp.link(OXI.whatsapp.generalMessage()) });
    else if (c.telefono) items.push({ k: "Teléfono", v: c.telefono, href: `tel:${c.telefono.replace(/[^\d+]/g, "")}` });
    if (c.email) items.push({ k: "Correo", v: c.email, href: `mailto:${c.email}` });
    if (c.sitioWeb) items.push({ k: "Sitio web", v: c.sitioWeb.replace(/^https?:\/\//, ""), href: c.sitioWeb });
    if (c.ciudad) items.push({ k: "Ciudad", v: c.ciudad });
    Object.entries(c.redes || {}).forEach(([red, url]) => {
      if (url) items.push({ k: red.charAt(0).toUpperCase() + red.slice(1), v: url.replace(/^https?:\/\/(www\.)?/, ""), href: url });
    });
    return items;
  }
  const footContact = () => {
    const c = C();
    const parts = [];
    if (c.whatsapp) parts.push(`WhatsApp <b>${esc(c.telefono || "+" + c.whatsapp)}</b>`);
    if (c.email) parts.push(`<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`);
    if (c.sitioWeb) parts.push(`<a href="${esc(c.sitioWeb)}">${esc(c.sitioWeb.replace(/^https?:\/\//, ""))}</a>`);
    if (!parts.length && c.redes?.tiktok) parts.push(`<a href="${esc(c.redes.tiktok)}">TikTok @oxismartingenieri</a>`);
    return parts.join("   |   ");
  };

  function page(inner, { head = true, foot = true, headRight = "" } = {}) {
    const el = document.createElement("section");
    el.className = "pdfx-page";
    el.innerHTML = `
      ${head ? `<div class="pdfx-head"><div class="pdfx-brand"><img src="${abs("assets/images/logo/oxi-mark.svg")}" alt="">Oxi Smart<span>Ingeniería</span></div><div class="pdfx-head-r">${esc(headRight)}</div></div>` : ""}
      ${inner}
      ${foot ? `<div class="pdfx-foot"><div>${footContact()}</div><div class="pdfx-pn"></div></div>` : ""}`;
    return el;
  }

  const photoBox = (img, h, label) =>
    img
      ? `<div class="pdfx-photo${img.encuadre === "contain" ? " contain" : ""}" style="height:${h}px;background-image:url('${abs(img.src)}')">${U().isIllustrative(img) ? '<span class="tag">Foto ilustrativa</span>' : ""}</div>`
      : `<div class="pdfx-photo pdfx-pending" style="height:${h}px"><img src="${abs("assets/images/logo/oxi-mark.svg")}" alt=""><span>${esc(label || "Fotografía pendiente")}</span></div>`;

  /* ------------------------- Páginas ------------------------- */
  function coverPage(title, edition, text) {
    const c = C();
    const hero = abs("assets/images/banners/hero-aireadores.webp");
    const contact = contactItems().slice(0, 4).map((i) =>
      `<div><span class="k">${esc(i.k)}</span>${i.href ? `<a href="${esc(i.href)}">${esc(i.v)}</a>` : esc(i.v)}</div>`).join("");
    return page(`
      <div class="pdfx-cover-photo" style="background-image:url('${hero}')">${WAVE()}</div>
      <div class="pdfx-cover-logo"><img src="${abs("assets/images/logo/oxi-mark.svg")}" alt=""><div><div class="n">${esc(c.nombreCorto)}</div><div class="s">Ingeniería</div></div></div>
      <div class="pdfx-cover-copy">
        <h1>${esc(title)}</h1>
        <div class="ed">${esc(edition)}</div>
        <p>${esc(text)}</p>
      </div>
      <div class="pdfx-cover-contact">${contact}</div>`, { head: false, foot: false });
  }

  function introPage(cats) {
    const c = C();
    const lines = cats.map((cat) => `
      <div class="pdfx-line">
        <div class="ic"><i class="bi ${esc(cat.icono)}"></i></div>
        <div><h3>${esc(cat.nombre)}</h3><p>${esc(cat.descripcion)}</p></div>
        <div class="c">${U().productsIn(cat.id).length} equipos</div>
      </div>`).join("");
    return page(`
      <div class="pdfx-body pdfx-intro">
        <h2>${esc(c.nombre)}</h2>
        ${(c.presentacion || []).map((t) => `<p>${esc(t)}</p>`).join("")}
        <h3 class="pdfx-h3" style="font-size:17px;margin-top:22px!important">Líneas comerciales</h3>
        <div class="pdfx-lines">${lines}</div>
        <p class="pdfx-note">${esc(c.catalogo.notaPrecios)}</p>
      </div>`, { headRight: `${c.catalogo.titulo} ${c.catalogo.edicion}` });
  }

  function tocPage(cats, title) {
    const rows = cats.map((cat) => `
      <div class="pdfx-toc-cat">
        <a class="pdfx-toc-row cat" data-goto="cat:${esc(cat.id)}"><span>${esc(cat.nombre)}</span><span class="d"></span><span class="pg" data-pg="cat:${esc(cat.id)}"></span></a>
        ${U().productsIn(cat.id).map((p) => `
          <a class="pdfx-toc-row" data-goto="p:${esc(p.id)}"><span>${esc(p.nombre)}<span class="ref">Ref. ${esc(U().refText(p))}</span></span><span class="d"></span><span class="pg" data-pg="p:${esc(p.id)}"></span></a>`).join("")}
      </div>`).join("");
    return page(`<div class="pdfx-body pdfx-toc"><h2>Contenido</h2>${rows}</div>`, { headRight: title });
  }

  const specRows = (p) =>
    (OXI.specFields || []).map((f) => {
      const v = U().specValue(p, f);
      return `<tr><td class="k">${esc(f.label)}</td><td class="v${v ? "" : " p"}">${v ? esc(v) : "Por confirmar"}</td></tr>`;
    }).join("");
  const listSection = (p, key, label) =>
    (p[key] || []).length ? `<h3 class="pdfx-h3">${label}</h3><ul class="pdfx-list">${p[key].map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : "";

  function quoteStrip(p) {
    const url = U().absUrl(U().productUrl(p));
    const msg = OXI.whatsapp.buildMessage({ productId: p.id, cantidad: 1 });
    return `
      <div class="pdfx-quote">
        <div><div class="t">Cotice este equipo</div><div class="s">Ficha en línea: <a href="${esc(url)}">${esc(url.replace(/^https?:\/\//, ""))}</a></div></div>
        <a class="pdfx-btn" href="${esc(OXI.whatsapp.link(msg))}">Cotizar por WhatsApp</a>
      </div>`;
  }

  /** Devuelve 1 o 2 páginas para el producto (2 si el contenido no cabe en una). */
  function productPages(p, headRight, stage) {
    const cat = U().getCategory(p.categoria);
    const img = (p.imagenes || [])[0];
    const priceBox = `
      <div class="pdfx-price">
        <div class="v${U().hasPrice(p) ? "" : " consult"}">${esc(U().priceText(p))}${U().hasPrice(p) ? " <small>COP</small>" : ""}</div>
        <div class="n">${U().hasPrice(p) ? esc(C().catalogo.notaPrecios) : "Precio sujeto a configuración. Solicítelo por WhatsApp."}</div>
      </div>`;
    const plate = `<div class="pdfx-plate"><div class="t">Datos técnicos</div><table>${specRows(p)}</table></div>`;
    const title = `
      <div class="pdfx-cat">${esc(cat?.nombre || "")}</div>
      <h1 style="font-size:30px">${esc(p.nombre)}</h1>
      <div style="font-size:12px;margin:4px 0 14px">Referencia: <b style="color:#123B52">${esc(U().refText(p))}</b></div>`;
    const lists = ["caracteristicas", "aplicaciones", "ventajas", "componentes", "recomendaciones"]
      .map((k) => listSection(p, k, { caracteristicas: "Características", aplicaciones: "Aplicaciones", ventajas: "Ventajas", componentes: "Componentes", recomendaciones: "Recomendaciones" }[k])).join("");
    const pend = U().pendingSections(p);
    const pendNote = pend.length || p.estado !== "aprobado"
      ? `<p class="pdfx-note">Ficha en validación${pend.length ? `: ${esc(pend.join(", "))} pendientes de aprobación` : ""}. Los datos se confirman en la cotización.</p>` : "";

    const single = page(`
      <div class="pdfx-body" data-fit>
        ${title}
        ${photoBox(img, 360)}
        <div class="pdfx-cols">
          <div class="l"><h3 class="pdfx-h3" style="margin-top:0!important">Descripción</h3><p>${esc(p.descripcion)}</p>${lists}${pendNote}</div>
          <div class="r">${priceBox}${plate}</div>
        </div>
        <div data-spacer style="height:84px"></div>
        ${quoteStrip(p)}
      </div>`, { headRight });
    single.dataset.anchor = `p:${p.id}`;
    if (fits(single, stage)) return [single];

    // No cabe: página 1 con foto, precio y placa; página 2 con el resto.
    const a = page(`
      <div class="pdfx-body">
        ${title}
        ${photoBox(img, 400)}
        <div class="pdfx-cols"><div class="l"><h3 class="pdfx-h3" style="margin-top:0!important">Descripción</h3><p>${esc(p.descripcion)}</p></div><div class="r">${priceBox}${plate}</div></div>
      </div>`, { headRight });
    a.dataset.anchor = `p:${p.id}`;
    const b = page(`
      <div class="pdfx-body" data-fit>
        <div class="pdfx-cat">${esc(cat?.nombre || "")}</div>
        <h2 style="font-size:22px">${esc(p.nombre)} <span style="font-weight:500;font-size:14px;color:#6b7c89">(continuación)</span></h2>
        <div class="pdfx-cols" style="margin-top:6px"><div class="l">${lists}${pendNote}</div></div>
        <div data-spacer style="height:84px"></div>
        ${quoteStrip(p)}
      </div>`, { headRight });
    return [a, b];
  }

  function fits(pg, stage) {
    stage.appendChild(pg);
    const body = pg.querySelector("[data-fit]");
    const ok = !body || body.scrollHeight <= body.clientHeight + 1;
    if (window.OXI_PDF_DEBUG && body) console.warn("[pdf fit]", body.scrollHeight, body.clientHeight);
    pg.remove();
    return ok;
  }

  function backPage() {
    const c = C();
    const list = contactItems().map((i) =>
      `<div><span class="k">${esc(i.k)}</span>${i.href ? `<a href="${esc(i.href)}">${esc(i.v)}</a>` : `<span class="v">${esc(i.v)}</span>`}</div>`).join("");
    const credits = Object.values(OXI.credits || {});
    return page(`
      <div class="pdfx-back">
        <img class="mk" src="${abs("assets/images/logo/oxi-mark.svg")}" alt="">
        <h2>${esc(c.nombre)}</h2>
        <p class="lead">${esc(c.descripcion)}</p>
        <div class="pdfx-back-list">${list}</div>
        <a class="pdfx-btn wa" href="${esc(OXI.whatsapp.link(OXI.whatsapp.generalMessage()))}">Solicitar cotización por WhatsApp</a>
      </div>
      ${credits.length ? `<div class="pdfx-credits">Las fotografías marcadas como “Foto ilustrativa” son referenciales y no corresponden a equipos o proyectos de ${esc(c.nombre)}. Créditos (Wikimedia Commons): ${credits.map((x) => `${esc(x.autor)}, ${esc(x.licencia)}`).join("; ")}.</div>` : ""}`,
      { head: false, foot: false });
  }

  /* ------------------------- Progreso ------------------------- */
  let overlay;
  function progress(text, pct) {
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "pdf-progress";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-labelledby", "pdfProgTitle");
      overlay.innerHTML = `<div class="pdf-progress-card"><h2 id="pdfProgTitle">Preparando su PDF</h2><p class="mb-0 small" aria-live="polite"></p>
        <div class="progress" role="progressbar" aria-label="Progreso" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width:0%"></div></div></div>`;
      document.body.appendChild(overlay);
    }
    overlay.classList.add("is-open");
    overlay.querySelector("p").textContent = text;
    overlay.querySelector(".progress-bar").style.width = `${pct}%`;
    overlay.querySelector(".progress").setAttribute("aria-valuenow", Math.round(pct));
  }
  const closeProgress = () => overlay?.classList.remove("is-open");

  /* ------------------------- Motor ------------------------- */
  function ensureStyle() {
    if (document.getElementById("pdfx-style")) return;
    const s = document.createElement("style");
    s.id = "pdfx-style";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  async function waitAssets(stage) {
    if (document.fonts) {
      await Promise.all(["800 30px Manrope", "700 20px Manrope", "400 12px Inter", "500 12px Inter", "600 12px Inter"].map((f) => document.fonts.load(f).catch(() => {})));
      await document.fonts.ready;
    }
    const urls = new Set();
    stage.querySelectorAll("img").forEach((i) => urls.add(i.src));
    stage.querySelectorAll("[style*='background-image']").forEach((el) => {
      const m = el.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      if (m) urls.add(m[1]);
    });
    await Promise.all([...urls].map((u) => new Promise((res) => { const im = new Image(); im.onload = im.onerror = res; im.src = u; })));
  }

  /* El paquete html2pdf incluye jsPDF pero no lo expone como global: se obtiene una
     instancia A4 a partir de un elemento mínimo y su primera hoja se reutiliza (la
     página 1 del documento se dibuja encima, cubriéndola por completo). */
  async function newPdf() {
    const Ctor = window.jspdf?.jsPDF || window.jsPDF;
    if (Ctor) return new Ctor({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
    return html2pdf()
      .set({ margin: 0, image: { type: "jpeg", quality: 0.5 }, html2canvas: { scale: 1, logging: false, backgroundColor: "#ffffff" }, jsPDF: { unit: "mm", format: "a4", orientation: "portrait", compress: true } })
      .from('<div style="width:4px;height:4px;background:#fff"></div>', "string")
      .toPdf().get("pdf");
  }

  /* HTML2PDF.js se carga solo cuando alguien pide un PDF (≈900 KB menos en cada visita). */
  const HTML2PDF_SRC = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
  const HTML2PDF_SRI = "sha384-Yv5O+t3uE3hunW8uyrbpPW3iw6/5/Y7HitWJBLgqfMoA36NogMmy+8wWZMpn3HWc";
  let libPromise = null;
  function loadLib() {
    if (window.html2pdf) return Promise.resolve();
    if (!libPromise) {
      libPromise = new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = HTML2PDF_SRC;
        s.integrity = HTML2PDF_SRI;
        s.crossOrigin = "anonymous";
        s.referrerPolicy = "no-referrer";
        s.onload = resolve;
        s.onerror = () => { libPromise = null; reject(new Error("html2pdf no cargó")); };
        document.head.appendChild(s);
      });
    }
    return libPromise;
  }

  async function render(pages, fileName, meta) {
    progress("Cargando el generador…", 1);
    try { await loadLib(); } catch {
      closeProgress();
      U().toast("No se pudo cargar el generador de PDF. Revise su conexión a internet y vuelva a intentarlo.");
      return;
    }
    ensureStyle();
    const stage = document.createElement("div");
    stage.className = "pdfx-stage";
    stage.setAttribute("aria-hidden", "true");
    document.body.appendChild(stage);
    try {
      progress("Componiendo páginas…", 3);
      const list = pages(stage);           // [{el, anchor?}]
      const total = list.length;
      // Numeración y anclas
      const anchors = {};
      list.forEach((el, i) => {
        stage.appendChild(el);
        const n = el.querySelector(".pdfx-pn");
        if (n) n.textContent = `Página ${i + 1} de ${total}`;
        if (el.dataset.anchor && !anchors[el.dataset.anchor]) anchors[el.dataset.anchor] = i + 1;
        if (el.dataset.catAnchor && !anchors[el.dataset.catAnchor]) anchors[el.dataset.catAnchor] = i + 1;
      });
      stage.querySelectorAll("[data-pg]").forEach((s) => (s.textContent = anchors[s.dataset.pg] || ""));
      await waitAssets(stage);

      const pdf = await newPdf();
      pdf.setProperties({
        title: meta.title, subject: meta.subject || C().descripcion, author: C().nombre,
        keywords: "aireadores para piscicultura, sistemas de oxigenación, equipos para acuicultura, tanques para piscicultura, Colombia",
        creator: `${C().nombre} — catálogo digital`
      });

      for (let i = 0; i < total; i++) {
        progress(`Página ${i + 1} de ${total}`, 5 + (i / total) * 90);
        const el = list[i];
        const canvas = await html2pdf()
          .set({ margin: 0, html2canvas: { scale: SCALE, useCORS: true, backgroundColor: "#ffffff", logging: false, width: PAGE_W, height: PAGE_H, scrollX: 0, scrollY: 0 }, jsPDF: { unit: "mm", format: "a4" } })
          .from(el).toCanvas().get("canvas");
        if (i > 0) pdf.addPage("a4", "portrait");
        else pdf.setPage(1);
        pdf.addImage(canvas.toDataURL("image/jpeg", JPEG_Q), "JPEG", 0, 0, 210, 297, undefined, "FAST");
        canvas.width = canvas.height = 0; // liberar memoria

        // Enlaces activos
        const base = el.getBoundingClientRect();
        el.querySelectorAll("a[href], a[data-goto]").forEach((a) => {
          const r = a.getBoundingClientRect();
          if (!r.width || !r.height) return;
          const box = [(r.left - base.left) * MM_PER_PX, (r.top - base.top) * MM_PER_PX, r.width * MM_PER_PX, r.height * MM_PER_PX];
          if (a.dataset.goto) {
            const target = anchors[a.dataset.goto];
            if (target) pdf.link(...box, { pageNumber: target });
          } else pdf.link(...box, { url: a.href });
        });
        await new Promise((r) => setTimeout(r, 0)); // deja respirar la interfaz
      }

      // Marcadores (panel lateral del lector PDF)
      if (pdf.outline && meta.outline) {
        meta.outline.forEach((o) => { const pg = anchors[o.anchor]; if (pg) pdf.outline.add(null, o.title, { pageNumber: pg }); });
      }

      progress("Guardando archivo…", 98);
      pdf.save(fileName);
      U().track("file_download", { file_name: fileName, file_extension: "pdf" });
      U().toast(`Listo: ${fileName}`);
    } catch (err) {
      console.error("[Oxi PDF]", err);
      U().toast("No se pudo generar el PDF. Recargue la página e intente de nuevo; si sigue fallando, escríbanos por WhatsApp.");
    } finally {
      stage.remove();
      closeProgress();
    }
  }

  /* ------------------------- API pública ------------------------- */
  function catalog(categoryId) {
    const c = C();
    const one = categoryId ? U().getCategory(categoryId) : null;
    if (categoryId && !one) return U().toast("Esa categoría no existe en el catálogo.");
    const cats = one ? [one] : U().categories().filter((x) => U().productsIn(x.id).length);
    const titleRight = one ? `${one.nombre}  |  ${c.catalogo.titulo} ${c.catalogo.edicion}` : `${c.catalogo.titulo} ${c.catalogo.edicion}`;
    const fileName = one ? `oxi-smart-catalogo-${one.id}-${c.catalogo.edicion}.pdf` : `oxi-smart-catalogo-${c.catalogo.edicion}.pdf`;
    const outline = [];
    return render((stage) => {
      const pages = [
        coverPage(one ? one.nombre : c.catalogo.titulo, one ? `${c.catalogo.titulo} ${c.catalogo.edicion}` : `Edición ${c.catalogo.edicion}`, one ? one.descripcion : c.descripcion)
      ];
      if (!one) pages.push(introPage(cats));
      pages.push(tocPage(cats, titleRight));
      cats.forEach((cat) => {
        outline.push({ title: cat.nombre, anchor: `cat:${cat.id}` });
        U().productsIn(cat.id).forEach((p, i) => {
          const pp = productPages(p, one ? titleRight : `${cat.nombre}  |  ${c.catalogo.titulo} ${c.catalogo.edicion}`, stage);
          if (i === 0) pp[0].dataset.catAnchor = `cat:${cat.id}`;
          pages.push(...pp);
        });
      });
      pages.push(backPage());
      return pages;
    }, fileName, { title: one ? `${c.nombre} — ${one.nombre}` : `${c.nombre} — ${c.catalogo.titulo} ${c.catalogo.edicion}`, outline });
  }

  function product(id) {
    const p = U().getProduct(id);
    if (!p) return U().toast("No encontramos ese producto en el catálogo.");
    const c = C();
    return render((stage) => productPages(p, `Ficha técnica  |  ${c.catalogo.edicion}`, stage),
      `ficha-tecnica-${p.id}.pdf`, { title: `Ficha técnica — ${p.nombre} — ${c.nombre}` });
  }

  /* ------------------------- Botones ------------------------- */
  let busy = false;
  document.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-pdf-catalog], [data-pdf-category-from], [data-pdf-product], [data-pdf-product-from]");
    if (!b) return;
    e.preventDefault();
    if (busy) return;
    busy = true;
    b.setAttribute("aria-busy", "true");
    try {
      if (b.hasAttribute("data-pdf-product")) await product(b.dataset.pdfProduct);
      else if (b.hasAttribute("data-pdf-product-from")) await product(document.querySelector(b.dataset.pdfProductFrom)?.value);
      else if (b.hasAttribute("data-pdf-category-from")) await catalog(document.querySelector(b.dataset.pdfCategoryFrom)?.value);
      else await catalog(b.dataset.pdfCatalog || undefined);
    } finally {
      busy = false;
      b.removeAttribute("aria-busy");
    }
  });

  OXI.pdf = { catalog, product };
})();
