/* =========================================================================
   PRODUCTO — producto.html?ref=CE-01
   Foto grande, color (muestras), cantidad, "Agregar al carrito",
   "Cotizar solo este por WhatsApp", ficha técnica y relacionados.
   ========================================================================= */
(function () {
  "use strict";

  const T = window.Tienda;
  const { D, N, esc, pesos, etiqueta, precioHTML, wa, porRef } = T;
  const ref = new URLSearchParams(location.search).get("ref") || "";
  const p = porRef[ref];
  const raiz = document.getElementById("producto");
  const cat = p ? D.categorias.find((c) => c.id === p.categoria) || {} : {};

  T.cabecera("tienda");
  T.pie();

  if (!p) {
    document.title = `Producto no encontrado · ${N.nombre}`;
    raiz.innerHTML = `
      <div class="no-encontrado">
        <h1 class="titulo">No encontramos esa referencia</h1>
        <p class="sub">Puede que el vehículo ya no esté en el catálogo o que el enlace esté incompleto.</p>
        <a class="btn-principal mt-3" href="tienda.html"><i class="bi bi-grid"></i> Ir a la tienda</a>
      </div>`;
    return;
  }

  /* ---------- SEO del producto ---------- */
  document.title = `${p.nombre} · ${N.nombre}`;
  const meta = (s, v, attr = "name") => {
    let m = document.querySelector(`meta[${attr}="${s}"]`);
    if (!m) { m = document.createElement("meta"); m.setAttribute(attr, s); document.head.appendChild(m); }
    m.setAttribute("content", v);
  };
  meta("description", p.descripcion);
  meta("og:title", `${p.nombre} · ${N.nombre}`, "property");
  meta("og:image", p.foto, "property");
  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org", "@type": "Product", name: p.nombre, sku: p.ref, image: p.foto, description: p.descripcion,
    color: (p.colores || []).map((c) => c.nombre).join(", "),
    ...(typeof p.precio === "number" ? { offers: { "@type": "Offer", price: p.precio, priceCurrency: N.moneda || "COP", availability: p.disponible === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock" } } : {}),
  });
  document.head.appendChild(ld);

  /* ---------- página ---------- */
  const agotado = p.disponible === false;
  const ident = [p.marca, p.modelo && `Modelo ${p.modelo}`].filter(Boolean).join(" · ");
  const colores = p.colores || [];
  const galeria = T.galeria(p);
  const relacionados = D.productos.filter((x) => x.ref !== p.ref && x.categoria === p.categoria)
    .concat(D.productos.filter((x) => x.ref !== p.ref && x.categoria !== p.categoria && x.propulsion === p.propulsion))
    .slice(0, 3);

  // compra con confianza: solo lo que el negocio confirmó (negocio.csv / js/fichas.js)
  const pagos = Array.isArray(N.pagos) ? N.pagos.join(", ") : N.pagos;
  const garantia = p.garantia || N.garantiaGeneral;
  const puntos = [
    ["bi-truck", "Envío", N.envios || N.cobertura && !/prueba/i.test(N.cobertura) && N.cobertura],
    ["bi-credit-card", "Formas de pago", pagos],
    ["bi-shield-check", "Garantía", garantia],
    ["bi-shop", "Visítanos", [N.direccion, N.horario].filter(Boolean).join(". ")],
  ].filter(([, , v]) => v);
  const confianza = puntos.length ? `
        <ul class="confianza" aria-label="Compra con confianza">
          ${puntos.map(([i, t, v]) => `<li><i class="bi ${i}" aria-hidden="true"></i><span><b>${t}</b>${esc(v)}</span></li>`).join("")}
        </ul>` : "";

  raiz.innerHTML = `
    <nav aria-label="Ruta" class="migas">
      <a href="tienda.html">Tienda</a><i class="bi bi-chevron-right" aria-hidden="true"></i>
      <a href="tienda.html?cat=${esc(p.categoria)}">${esc(cat.nombre || "")}</a><i class="bi bi-chevron-right" aria-hidden="true"></i>
      <span aria-current="page">${esc(p.nombre)}</span>
    </nav>

    <div class="pdp prop-borde--${esc(p.propulsion)}">
      <div class="pdp__galeria">
        <figure class="pdp__foto">
          <img id="foto-principal" src="${esc(p.foto)}" alt="${esc(p.nombre)}"${p.fotoAmbiente ? ' class="foto--ambiente"' : ""}>
          ${agotado ? `<span class="agotado">Agotado por ahora</span>` : ""}
        </figure>
        ${galeria.length > 1 ? `
        <div class="miniaturas" role="group" aria-label="Fotos de ${esc(p.nombre)}">
          ${galeria.map((f, i) => `<button type="button" class="miniatura" data-foto="${esc(f)}" aria-label="Ver foto ${i + 1} de ${galeria.length}" aria-pressed="${i === 0}"><img src="${esc(f)}" alt="" loading="lazy"></button>`).join("")}
        </div>` : ""}
      </div>

      <div class="pdp__info">
        <div class="tarjeta__tags">${etiqueta(p)}<span class="ref">Ref. ${esc(p.ref)}</span></div>
        <h1 class="pdp__nombre">${esc(p.nombre)}</h1>
        ${ident ? `<p class="pdp__ident">${esc(ident)}</p>` : ""}
        <div class="precio precio--grande">${precioHTML(p)}</div>
        <p class="pdp__desc">${esc(p.descripcion)}</p>
        ${p.propulsion === "gasolina" ? `<p class="aviso-gasolina"><i class="bi bi-exclamation-triangle-fill"></i> Motor a combustión: uso con supervisión adulta, casco y equipo de protección. Edad según el fabricante.</p>` : ""}

        <form id="form-compra" class="compra">
          ${colores.length ? `
          <fieldset class="muestras">
            <legend>Color: <b id="color-txt">${esc(colores[0].nombre)}</b></legend>
            <div class="muestras__lista">
              ${colores.map((c, i) => `
                <label class="muestra" title="${esc(c.nombre)}">
                  <input type="radio" name="color" value="${esc(c.nombre)}" ${i === 0 ? "checked" : ""} ${agotado ? "disabled" : ""}>
                  <span class="muestra__circulo" style="background:${esc(c.hex)}"></span><span class="muestra__nombre">${esc(c.nombre)}</span>
                </label>`).join("")}
            </div>
          </fieldset>` : ""}
          ${agotado ? "" : `
          <div class="cantidad">
            <span id="cant-label">Cantidad</span>
            <div class="stepper" role="group" aria-labelledby="cant-label">
              <button type="button" data-paso="-1" aria-label="Quitar una unidad"><i class="bi bi-dash"></i></button>
              <input id="cantidad" type="number" min="1" max="${window.Carrito.MAX}" value="1" inputmode="numeric" aria-label="Cantidad">
              <button type="button" data-paso="1" aria-label="Agregar una unidad"><i class="bi bi-plus"></i></button>
            </div>
          </div>`}
          <div class="compra__botones">
            ${agotado
              ? (wa(`Hola, ¿cuándo llega el ${p.nombre} (${p.ref})?`) ? `<a class="btn-wa btn-grande" href="${esc(wa(`Hola, ¿cuándo llega el ${p.nombre} (${p.ref})?`))}" target="_blank" rel="noopener"><i class="bi bi-bell"></i> Avísame cuando llegue</a>` : "")
              : `<button type="submit" class="btn-principal btn-grande"><i class="bi bi-cart-plus"></i> Agregar al carrito</button>
                 ${N.whatsappLink ? `<a class="btn-wa btn-grande" id="cotizar-uno" href="#" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i> Cotizar solo este por WhatsApp</a>` : ""}`}
          </div>
          <p class="compra__nota"><i class="bi bi-info-circle"></i> Sin pago en línea: te enviamos la cotización con disponibilidad y envío por WhatsApp.</p>
        </form>
        ${confianza}

        ${(p.especiales || []).length ? `<ul class="especiales">${p.especiales.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>` : ""}
      </div>
    </div>

    ${T.ficha.html(p)}

    ${relacionados.length ? `
    <section class="relacionados" aria-labelledby="rel-tit">
      <h2 class="titulo" id="rel-tit">También te puede interesar</h2>
      <div class="grilla">${relacionados.map(T.tarjeta).join("")}</div>
    </section>` : ""}`;

  /* ---------- interacción ---------- */
  const form = document.getElementById("form-compra");
  const colorElegido = () => (form.querySelector('[name="color"]:checked') || {}).value || "";
  const cantidad = () => Math.max(1, Math.min(window.Carrito.MAX, parseInt((document.getElementById("cantidad") || {}).value, 10) || 1));
  const actualizarCotizar = () => {
    const a = document.getElementById("cotizar-uno");
    if (!a) return;
    const c = colorElegido(), n = cantidad();
    a.href = wa([
      `Hola, quiero cotizar:`,
      `• ${n} × ${p.nombre} (${p.ref})${c ? ` · color ${c}` : ""}${typeof p.precio === "number" ? ` · ref. ${pesos(p.precio * n)}` : ""}`,
      `¿Me confirman disponibilidad y el costo del envío?`,
    ].join("\n"));
  };
  // galería: miniaturas y foto según el color elegido
  const verFoto = (src) => {
    const img = document.getElementById("foto-principal");
    if (!src || img.getAttribute("src") === src) return;
    img.src = src;
    document.querySelectorAll(".miniatura").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.foto === src)));
  };
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".miniatura");
    if (b) verFoto(b.dataset.foto);
  });
  form.addEventListener("change", (e) => {
    if (e.target.name === "color") {
      document.getElementById("color-txt").textContent = e.target.value;
      verFoto(T.fotoDe(p, e.target.value));
    }
    actualizarCotizar();
  });
  form.addEventListener("input", actualizarCotizar);
  form.addEventListener("click", (e) => {
    const b = e.target.closest("[data-paso]");
    if (!b) return;
    const i = document.getElementById("cantidad");
    i.value = Math.max(1, Math.min(window.Carrito.MAX, (parseInt(i.value, 10) || 1) + parseInt(b.dataset.paso, 10)));
    actualizarCotizar();
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!agotado) window.Carrito.agregar(p.ref, colorElegido(), cantidad());
  });
  // los colores de la placa técnica eligen el color de compra y suben a la foto
  T.ficha.activar(p, (color) => {
    const r = form.querySelector(`[name="color"][value="${CSS.escape(color)}"]`);
    if (r && !r.disabled) { r.checked = true; r.dispatchEvent(new Event("change", { bubbles: true })); }
    else verFoto(T.fotoDe(p, color));
    document.querySelector(".pdp__foto").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
  });
  actualizarCotizar();
})();
