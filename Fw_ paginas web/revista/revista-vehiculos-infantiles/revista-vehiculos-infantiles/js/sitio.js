/* =========================================================================
   SITIO WEB — VEHÍCULOS INFANTILES
   Completa sitio.html con js/datos.js (la misma fuente que la revista).
   Filtros: tipo de propulsión (selector grande), categoría, edad del niño
   y búsqueda. Cada vehículo tiene ficha completa y "Agregar al pedido".
   ========================================================================= */
(function () {
  "use strict";

  const D = window.REVISTA;
  const N = D.negocio;
  const CR = window.CREDITOS_FOTOS || {};
  const $ = (id) => document.getElementById(id);
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const vacio = (v) => v === null || v === undefined || v === "" || (Array.isArray(v) && !v.length);
  const pesos = (n) => `$${Number(n).toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;
  const sinTildes = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const MSG = `Hola, vi la página de ${N.nombre} y quiero información`;
  const wa = (t) => (N.whatsappLink ? N.whatsappLink + (t ? `?text=${encodeURIComponent(t)}` : "") : null);
  const insta = () => (N.instagram ? (/^https?:/.test(N.instagram) ? N.instagram : `https://instagram.com/${N.instagram.replace(/^@/, "")}`) : null);
  const qrSvg = (texto) => {
    if (!texto || typeof qrcode !== "function") return "";
    const q = qrcode(0, "M"); q.addData(texto); q.make();
    return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
  };
  const cat = (id) => D.categorias.find((c) => c.id === id) || {};
  const productos = D.productos;
  const categorias = D.categorias.filter((c) => productos.some((p) => p.categoria === c.id));

  const PROP = {
    electrico: { nombre: "Eléctricos", uno: "Eléctrico", icono: "bi-lightning-charge-fill", texto: "Con batería recargable" },
    gasolina: { nombre: "A gasolina", uno: "Gasolina", icono: "bi-fuel-pump-fill", texto: "Con supervisión adulta" },
    pedales: { nombre: "De pedales", uno: "Pedales", icono: "bi-bicycle", texto: "Con la fuerza del niño" },
    accesorio: { nombre: "Accesorios", uno: "Accesorio", icono: "bi-shield-check", texto: "Protección y repuestos" },
  };
  const etiqueta = (p) => {
    const P = PROP[p.propulsion] || { uno: "Por confirmar", icono: "bi-question-circle" };
    const s = p.specs || {};
    const extra = p.propulsion === "electrico" && s.bateria ? ` ${s.bateria.split("·")[0].trim()}` : p.propulsion === "gasolina" && s.cilindraje ? ` ${s.cilindraje}` : "";
    return `<span class="prop prop--${esc(p.propulsion)}"><i class="bi ${P.icono}"></i>${P.uno}${esc(extra)}</span>`;
  };
  const SPECS = [
    ["edad", "Edad recomendada"], ["bateria", "Batería"], ["motor", "Motor"], ["cilindraje", "Cilindraje"],
    ["potencia", "Potencia"], ["velocidad", "Velocidad"], ["autonomia", "Autonomía"], ["arranque", "Arranque"],
    ["transmision", "Transmisión"], ["pesoMax", "Peso máximo"], ["ocupantes", "Ocupantes"], ["carga", "Tiempo de carga"],
    ["dimensiones", "Medidas"],
  ];
  const specsDe = (p) => SPECS.filter(([k]) => !vacio((p.specs || {})[k])).map(([k, n]) => [n, p.specs[k]]);
  // "3 a 6 años" → [3, 6]; si la edad no está definida (p. ej. "Según fabricante") → null
  const rangoEdad = (p) => {
    const m = ((p.specs || {}).edad || "").match(/(\d+)\s*a\s*(\d+)\s*años/);
    return m ? [parseInt(m[1], 10), parseInt(m[2], 10)] : null;
  };

  /* ---------- SEO ---------- */
  function seo() {
    const titulo = `${N.nombre} · Vehículos infantiles`;
    document.title = titulo;
    const meta = (s, v) => { const m = document.querySelector(s); if (m && v) m.setAttribute("content", v); };
    meta('meta[name="description"]', N.descripcion);
    meta('meta[property="og:title"]', titulo);
    meta('meta[property="og:description"]', D.portada.titulo);
    meta('meta[property="og:image"]', D.portada.foto);
    const ld = {
      "@context": "https://schema.org",
      "@type": "Store",
      name: N.nombre,
      description: N.descripcion,
      telephone: N.telefono || N.whatsapp,
      address: N.direccion ? { "@type": "PostalAddress", streetAddress: N.direccion, addressLocality: N.ciudad, addressCountry: N.pais } : undefined,
      sameAs: [insta(), N.facebook, N.sitioWeb].filter(Boolean),
      makesOffer: productos.filter((p) => typeof p.precio === "number").map((p) => ({
        "@type": "Offer", sku: p.ref, price: p.precio, priceCurrency: N.moneda || "COP",
        availability: p.disponible === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
        itemOffered: { "@type": "Product", name: p.nombre, description: p.descripcion, image: p.foto, color: (p.colores || []).map((c) => c.nombre).join(", ") },
      })),
    };
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  }

  /* ---------- general ---------- */
  function general() {
    if (D.modoPrueba) $("aviso-prueba").classList.remove("d-none");
    document.querySelectorAll(".js-wa").forEach((a) => { const u = wa(MSG); if (u) a.href = u; else a.remove(); });
    ["nav-logo", "pie-logo"].forEach((id) => ($(id).src = N.logo));
    $("nav-nombre").textContent = $("pie-nombre").textContent = N.nombre;
    $("hero-titulo").textContent = D.portada.titulo;
    $("hero-sub").textContent = D.portada.subtitulo;
    $("hero-foto").src = D.portada.foto;
    $("nota-precios").textContent = productos.some((p) => typeof p.precio === "number")
      ? "Precios con IVA incluido; pueden cambiar sin previo aviso. Las especificaciones son las declaradas por el fabricante."
      : "Escríbenos por WhatsApp para conocer el precio y la disponibilidad de cada modelo. Las especificaciones son las declaradas por el fabricante.";
    const wd = wa(`Hola, soy distribuidor y quiero la lista de precios de ${N.nombre}`);
    if (wd) $("wa-distribuidor").href = wd; else $("wa-distribuidor").remove();
    $("propuesta").innerHTML = (D.propuesta || []).map((x) => `<li><i class="bi ${esc(x.icono)}"></i><div><b>${esc(x.titulo)}</b><span>${esc(x.texto)}</span></div></li>`).join("");
    $("pasos").innerHTML = (D.pasos || []).map((x) => `<li><b>${esc(x.titulo)}</b><span>${esc(x.texto)}</span></li>`).join("");
  }

  /* ---------- catálogo ---------- */
  const filtro = { prop: "", cat: "", edad: "", q: "" };

  function tarjeta(p) {
    const sp = specsDe(p).slice(0, 3);
    const agotado = p.disponible === false;
    return `
      <article class="tarjeta prop-borde--${esc(p.propulsion)}" data-ref="${esc(p.ref)}">
        <button type="button" class="tarjeta__foto" data-ficha="${esc(p.ref)}" aria-label="Ver ficha de ${esc(p.nombre)}">
          <img src="${esc(p.foto)}" alt="${esc(p.nombre)}" loading="lazy"${p.fotoAmbiente ? ' class="foto--ambiente"' : ""}>
          ${agotado ? `<span class="agotado">Agotado por ahora</span>` : ""}
        </button>
        <div class="tarjeta__cuerpo">
          <div class="tarjeta__tags">${etiqueta(p)}<span class="ref">Ref. ${esc(p.ref)}</span></div>
          <h3>${esc(p.nombre)}</h3>
          ${sp.length ? `<dl class="cifras">${sp.map(([k, v]) => `<div${k === "Medidas" ? ' class="cifra--ancha"' : ""}><dd>${esc(v)}</dd><dt>${esc(k)}</dt></div>`).join("")}</dl>` : ""}
          <div class="tarjeta__pie">
            <div class="precio">${typeof p.precio === "number" ? `<small>Precio</small><b>${pesos(p.precio)}</b>` : `<small>Precio</small><b>Consultar</b>`}</div>
            <button type="button" class="btn-ficha" data-ficha="${esc(p.ref)}">Ver ficha</button>
          </div>
          <div class="ctrl-pedido" data-ref="${esc(p.ref)}"></div>
        </div>
      </article>`;
  }

  function controles() {
    document.querySelectorAll(".ctrl-pedido").forEach((c) => {
      const ref = c.dataset.ref, p = productos.find((x) => x.ref === ref);
      if (p.disponible === false) {
        const u = wa(`Hola, ¿cuándo llega el ${p.nombre} (${p.ref})?`);
        c.innerHTML = u ? `<a class="btn-secundario w-100" href="${esc(u)}" target="_blank" rel="noopener"><i class="bi bi-bell"></i> Avísame cuando llegue</a>` : "";
      } else if (window.Carrito.tiene(ref)) {
        c.innerHTML = `<a class="btn-en-pedido w-100" href="carrito.html"><i class="bi bi-check2-circle"></i> En tu carrito: ver carrito</a>`;
      } else {
        c.innerHTML = `<button type="button" class="btn-principal w-100" data-carrito="${esc(ref)}"><i class="bi bi-cart-plus"></i> Agregar al carrito</button>`;
      }
    });
  }

  function catalogo() {
    // selector grande por propulsión
    const props = ["electrico", "gasolina", "pedales", "accesorio"].filter((k) => productos.some((p) => p.propulsion === k));
    $("selector").innerHTML = props.map((k) => {
      const n = productos.filter((p) => p.propulsion === k).length;
      return `<button type="button" class="selector__op selector__op--${k}" data-prop="${k}" aria-pressed="false">
        <i class="bi ${PROP[k].icono}"></i><b>${PROP[k].nombre}</b><span>${PROP[k].texto}</span><small>${n} ${n === 1 ? "modelo" : "modelos"}</small></button>`;
    }).join("");

    $("chips-categoria").innerHTML = [`<button type="button" class="chip activo" data-cat="">Todas</button>`]
      .concat(categorias.map((c) => `<button type="button" class="chip" data-cat="${esc(c.id)}">${esc(c.nombre)}</button>`)).join("");

    // edades posibles según los rangos de las fichas
    const rangos = productos.map(rangoEdad).filter(Boolean);
    if (rangos.length) {
      const min = Math.min(...rangos.map((r) => r[0])), max = Math.max(...rangos.map((r) => r[1]));
      for (let e = min; e <= max; e++) $("filtro-edad").insertAdjacentHTML("beforeend", `<option value="${e}">${e} ${e === 1 ? "año" : "años"}</option>`);
    } else {
      $("filtro-edad").closest(".campo").hidden = true; // sin edades en las fichas, el filtro no sirve
    }

    $("grilla").innerHTML = productos.map(tarjeta).join("");
    controles();
    aplicar();

    $("selector").addEventListener("click", (e) => {
      const b = e.target.closest("[data-prop]");
      if (!b) return;
      filtro.prop = filtro.prop === b.dataset.prop ? "" : b.dataset.prop;
      filtro.cat = "";
      aplicar();
      document.getElementById("catalogo").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
    $("chips-categoria").addEventListener("click", (e) => {
      const b = e.target.closest("[data-cat]");
      if (!b) return;
      filtro.cat = b.dataset.cat;
      if (filtro.cat) filtro.prop = "";
      aplicar();
    });
    $("filtro-edad").addEventListener("change", (e) => { filtro.edad = e.target.value; aplicar(); });
    $("buscar").addEventListener("input", (e) => { filtro.q = sinTildes(e.target.value.trim()); aplicar(); });
    $("limpiar-filtros").addEventListener("click", () => {
      Object.assign(filtro, { prop: "", cat: "", edad: "", q: "" });
      $("filtro-edad").value = ""; $("buscar").value = "";
      aplicar();
    });
    document.addEventListener("click", (e) => {
      const f = e.target.closest("[data-ficha]");
      if (f) abrirFicha(f.dataset.ficha);
    });
    // contador del carrito en el menú y botones de las tarjetas
    const contar = () => { const n = window.Carrito.cantidad(); $("nav-cant").textContent = n; $("nav-cant").classList.toggle("activo", n > 0); };
    contar();
    document.addEventListener("carrito:cambio", () => { controles(); contar(); });
  }

  function aplicar() {
    let n = 0;
    productos.forEach((p) => {
      const r = rangoEdad(p), edad = parseInt(filtro.edad, 10);
      const texto = sinTildes([p.ref, p.nombre, p.descripcion, cat(p.categoria).nombre, ...(p.colores || []).map((c) => c.nombre)].join(" "));
      const ok = (!filtro.prop || p.propulsion === filtro.prop)
        && (!filtro.cat || p.categoria === filtro.cat)
        && (!filtro.edad || (r && edad >= r[0] && edad <= r[1]))
        && (!filtro.q || texto.includes(filtro.q));
      document.querySelector(`.tarjeta[data-ref="${p.ref}"]`).hidden = !ok;
      if (ok) n++;
    });
    document.querySelectorAll(".selector__op").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.prop === filtro.prop)));
    document.querySelectorAll(".chip").forEach((b) => b.classList.toggle("activo", b.dataset.cat === filtro.cat));
    $("sin-resultados").classList.toggle("d-none", n > 0);
    const partes = [filtro.prop && PROP[filtro.prop].nombre.toLowerCase(), filtro.cat && cat(filtro.cat).nombre.toLowerCase(), filtro.edad && `para ${filtro.edad} ${filtro.edad === "1" ? "año" : "años"}`].filter(Boolean);
    $("resumen-filtros").textContent = `${n} ${n === 1 ? "vehículo" : "vehículos"}${partes.length ? " " + partes.join(", ") : ""}.`;
  }

  /* ---------- ficha completa (modal) ---------- */
  let modal;
  function abrirFicha(ref) {
    const p = productos.find((x) => x.ref === ref);
    if (!p) return;
    const sp = specsDe(p);
    const ident = [p.marca, p.modelo && `Modelo ${p.modelo}`].filter(Boolean).join(" · ");
    $("ficha-cuerpo").innerHTML = `
      <div class="ficha prop-borde--${esc(p.propulsion)}">
        <figure class="ficha__foto"><img src="${esc(p.foto)}" alt="${esc(p.nombre)}"></figure>
        <div class="ficha__info">
          <div class="tarjeta__tags">${etiqueta(p)}<span class="ref">Ref. ${esc(p.ref)}</span></div>
          <h2 id="ficha-titulo">${esc(p.nombre)}</h2>
          ${ident ? `<p class="ficha__ident">${esc(ident)}</p>` : ""}
          <p>${esc(p.descripcion)}</p>
          ${p.propulsion === "gasolina" ? `<p class="aviso-gasolina"><i class="bi bi-exclamation-triangle-fill"></i> Motor a combustión: uso con supervisión adulta, casco y equipo de protección. Edad según el fabricante.</p>` : ""}
          ${sp.length ? `<dl class="cifras cifras--ficha">${sp.map(([k, v]) => `<div><dd>${esc(v)}</dd><dt>${esc(k)}</dt></div>`).join("")}</dl>
          <p class="fuente">Datos de la ficha del fabricante.</p>` : ""}
          ${(p.especiales || []).length ? `<ul class="especiales">${p.especiales.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>` : ""}
          ${(p.colores || []).length ? `<div class="colores">${p.colores.map((c) => `<span><i style="background:${esc(c.hex)}"></i>${esc(c.nombre)}</span>`).join("")}</div>` : ""}
          ${p.garantia ? `<p><b>Garantía:</b> ${esc(p.garantia)}</p>` : ""}
          <p><a href="producto.html?ref=${encodeURIComponent(p.ref)}#ficha"><i class="bi bi-rulers"></i> Ver la ficha técnica completa</a></p>
          <div class="ficha__pie">
            <div class="precio">${typeof p.precio === "number" ? `<small>Precio</small><b>${pesos(p.precio)}</b>` : `<small>Precio</small><b>Consultar</b>`}</div>
            <div class="ctrl-pedido" data-ref="${esc(p.ref)}"></div>
          </div>
        </div>
      </div>`;
    controles();
    modal = modal || new bootstrap.Modal($("modal-ficha"));
    modal.show();
  }
  // al agregar desde la ficha, se cierra y se ve el aviso
  document.addEventListener("click", (e) => { if (e.target.closest("#ficha-cuerpo [data-carrito]") && modal) modal.hide(); });

  /* ---------- banners y "explora por tipo" ---------- */
  function banners() {
    window.Tienda.carrusel(document.getElementById("banners"));
    const EXPLORA = [
      { cat: "carros-electricos", foto: "assets/carros-electricos/unimog-4.webp", pos: "50% 60%" },
      { cat: "motos-electricas", foto: "assets/motos-electricas/me-68-2.webp", pos: "50% 45%" },
      { cat: "motos-gasolina", foto: "assets/banners/ambiente-moto-cross-800.webp", pos: "40% 50%" },
      { cat: "cuatrimotos-gasolina", foto: "assets/banners/ambiente-cuatrimoto-800.webp", pos: "55% 60%" },
    ].filter((x) => productos.some((p) => p.categoria === x.cat));
    $("explora").innerHTML = EXPLORA.map((x) => {
      const c = cat(x.cat), n = productos.filter((p) => p.categoria === x.cat).length;
      return `
        <a class="explora__item prop-borde--${esc(c.propulsion)}" href="tienda.html?cat=${esc(x.cat)}">
          <img src="${esc(x.foto)}" alt="" loading="lazy" style="object-position:${x.pos}">
          <span class="explora__texto"><b>${esc(c.nombre)}</b><small>${n} ${n === 1 ? "modelo" : "modelos"}</small></span>
        </a>`;
    }).join("");
  }

  /* ---------- contacto y pie ---------- */
  function contacto() {
    const item = (url, icono, texto) => vacio(texto) ? "" :
      (url ? `<li><a href="${esc(url)}" target="_blank" rel="noopener"><i class="bi ${icono}"></i>${esc(texto)}</a></li>` : `<li><i class="bi ${icono}"></i>${esc(texto)}</li>`);
    $("contacto-lista").innerHTML = [
      item(wa(MSG), "bi-whatsapp", N.whatsapp),
      item(N.telefono ? `tel:${N.telefono.replace(/\s/g, "")}` : null, "bi-telephone", N.telefono),
      item(N.correo ? `mailto:${N.correo}` : null, "bi-envelope", N.correo),
      item(insta(), "bi-instagram", N.instagram),
      item(N.facebook, "bi-facebook", N.facebook ? "Facebook" : null),
      item(N.sitioWeb, "bi-globe2", N.sitioWeb),
      item(N.direccion ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(N.direccion)}` : null, "bi-geo-alt", N.direccion),
      item(null, "bi-map", [N.ciudad, N.pais].filter(Boolean).join(", ")),
      item(null, "bi-truck", N.cobertura),
    ].join("");
    const q = qrSvg(wa(MSG));
    if (q) $("qr-web").innerHTML = q; else $("qr-web").closest(".contacto__qr").remove();
    $("pie-redes").innerHTML = [
      insta() && `<a href="${esc(insta())}" target="_blank" rel="noopener" aria-label="Instagram"><i class="bi bi-instagram"></i></a>`,
      N.facebook && `<a href="${esc(N.facebook)}" target="_blank" rel="noopener" aria-label="Facebook"><i class="bi bi-facebook"></i></a>`,
      wa(MSG) && `<a href="${esc(wa(MSG))}" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>`,
    ].filter(Boolean).join("");
    const cr = Object.entries(CR);
    if (!cr.length) $("pie-creditos").remove();
    else $("lista-creditos").innerHTML = cr.map(([ref, c]) =>
      `<div>${esc(ref)}: <a href="${esc(c.pagina)}" target="_blank" rel="noopener">${esc(c.archivo.replace(/^File:/, ""))}</a>, ${esc(c.autor || "autor desconocido")}, ${c.licencia_url ? `<a href="${esc(c.licencia_url)}" target="_blank" rel="noopener">${esc(c.licencia)}</a>` : esc(c.licencia)}</div>`).join("");
  }

  seo();
  general();
  banners();
  catalogo();
  contacto();
})();
