/* =========================================================================
   REVISTA DE VEHÍCULOS INFANTILES — MAQUETADOR
   Construye páginas A4 desde window.REVISTA (js/datos.js):
     portada · presentación · índice · aperturas (eléctricos / gasolina) ·
     fichas por categoría (2 por página; si queda uno solo, ficha de página
     completa) · cómo comprar · contacto.
   - Campos en null no se muestran: quedan en el reporte de pendientes.
   - Versión digital: barra de navegación, escala a la pantalla, teclado.
   - Impresión/PDF: cada .pagina es una hoja A4 independiente.
   ========================================================================= */
(function () {
  "use strict";

  const D = window.REVISTA;
  const N = D.negocio;
  const CR = window.CREDITOS_FOTOS || {};
  const raiz = document.getElementById("revista");

  /* ---------- utilidades ---------- */
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const vacio = (v) => v === null || v === undefined || v === "" || (Array.isArray(v) && !v.length);
  const pesos = (n) => `$${Number(n).toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;
  const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const deCategoria = (id) => D.productos.filter((p) => p.categoria === id);
  const categorias = D.categorias.filter((c) => deCategoria(c.id).length); // sin categorías vacías
  const wa = (texto) => (N.whatsappLink ? N.whatsappLink + (texto ? `?text=${encodeURIComponent(texto)}` : "") : null);
  const MSG = `Hola, vi la revista de ${N.nombre} y quiero información`;
  const insta = () => (N.instagram ? (/^https?:/.test(N.instagram) ? N.instagram : `https://instagram.com/${N.instagram.replace(/^@/, "")}`) : null);
  const qrSvg = (texto) => {
    if (!texto || typeof qrcode !== "function") return "";
    const q = qrcode(0, "M"); q.addData(texto); q.make();
    return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
  };

  const PROPULSION = {
    electrico: { nombre: "Eléctrico", icono: "bi-lightning-charge-fill" },
    gasolina: { nombre: "Gasolina", icono: "bi-fuel-pump-fill" },
    pedales: { nombre: "Pedales", icono: "bi-bicycle" },
    accesorio: { nombre: "Accesorio", icono: "bi-shield-check" },
  };
  // etiqueta de propulsión con el dato que la distingue (voltaje o cilindraje)
  const etiquetaProp = (p) => {
    const P = PROPULSION[p.propulsion] || { nombre: "Por confirmar", icono: "bi-question-circle" };
    const s = p.specs || {};
    const extra = p.propulsion === "electrico" && s.bateria ? ` ${s.bateria.split("·")[0].trim()}`
      : p.propulsion === "gasolina" && s.cilindraje ? ` ${s.cilindraje}` : "";
    return `<span class="prop prop--${esc(p.propulsion)}"><i class="bi ${P.icono}"></i>${P.nombre}${esc(extra)}</span>`;
  };

  const SPECS = [
    ["edad", "Edad recomendada"], ["bateria", "Batería"], ["motor", "Motor"], ["cilindraje", "Cilindraje"],
    ["potencia", "Potencia"], ["velocidad", "Velocidad"], ["autonomia", "Autonomía"], ["arranque", "Arranque"],
    ["transmision", "Transmisión"], ["pesoMax", "Peso máximo"], ["ocupantes", "Ocupantes"], ["carga", "Tiempo de carga"],
    ["dimensiones", "Medidas"],
  ];
  const specsDe = (p) => SPECS.filter(([k]) => !vacio((p.specs || {})[k])).map(([k, n]) => [n, p.specs[k]]);

  /* ---------- estructura de página ---------- */
  let nPag = 0;
  const secciones = []; // para la barra: { id, nombre }
  function pagina(clase, seccion, opciones = {}) {
    nPag++;
    const id = opciones.id || `p-${nPag}`;
    const interior = opciones.interior !== false;
    const p = el(`
      <section class="pagina ${clase}" id="${id}" data-seccion="${esc(seccion)}" ${opciones.color ? `style="--c-seccion: var(--${opciones.color})"` : ""}>
        ${D.modoPrueba ? `<div class="cinta-prueba">Empresa de prueba: contacto de ejemplo</div>` : ""}
        ${interior ? `
        <header class="pagina__header">
          <span class="marca"><img src="${esc(N.logo)}" alt="">${esc(N.nombre)}</span>
          <span class="seccion">${esc(seccion)}</span>
        </header>` : ""}
        <div class="pagina__cuerpo"></div>
        ${interior ? `
        <footer class="pagina__footer">
          ${wa(MSG) ? `<a href="${esc(wa(MSG))}" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i>Pedidos por WhatsApp ${esc(N.whatsapp)}</a>` : "<span></span>"}
          <span class="num">${nPag}</span>
        </footer>` : ""}
      </section>`);
    raiz.appendChild(p);
    if (opciones.enBarra) secciones.push({ id, nombre: opciones.enBarra });
    return p.querySelector(".pagina__cuerpo");
  }

  /* ---------- 1. portada ---------- */
  function portada() {
    const c = pagina("portada", "Portada", { id: "p-portada", interior: false, enBarra: "Portada" });
    const P = D.portada;
    c.innerHTML = `
      <div class="portada__top">
        <span class="portada__marca"><img src="${esc(N.logo)}" alt="Logo ${esc(N.nombre)}">${esc(N.nombre)}</span>
        ${D.temporada ? `<span class="portada__temporada">${esc(D.temporada)}</span>` : ""}
      </div>
      <div class="portada__foto"><img src="${esc(P.foto)}" alt=""></div>
      <div class="franjas" aria-hidden="true"><i class="f-electrico"></i><i class="f-gasolina"></i><i class="f-pedales"></i></div>
      <div class="portada__texto">
        <h1>${esc(P.titulo)}</h1>
        <p>${esc(P.subtitulo)}</p>
      </div>
      <div class="portada__pie">
        <ul class="leyenda">
          ${["electrico", "gasolina", "pedales"].filter((k) => D.productos.some((p) => p.propulsion === k))
            .map((k) => `<li class="prop prop--${k}"><i class="bi ${PROPULSION[k].icono}"></i>${PROPULSION[k].nombre}</li>`).join("")}
        </ul>
        ${wa(MSG) ? `<a class="portada__wa" href="${esc(wa(MSG))}" target="_blank" rel="noopener"><span class="qr">${qrSvg(wa(MSG))}</span><span><small>Pide tu catálogo de precios</small><b>${esc(N.whatsapp)}</b></span></a>` : ""}
      </div>`;
  }

  /* ---------- 2. presentación ---------- */
  function presentacion() {
    const c = pagina("presentacion", "Quiénes somos", { enBarra: "Quiénes somos" });
    const foto = D.fotoPresentacion || D.productos[0].foto;
    const datos = [["Qué hacemos", N.tipo], ["Atendemos a", N.publico], ["Cobertura", N.cobertura], ["Ciudad", [N.ciudad, N.pais].filter(Boolean).join(", ")]]
      .filter(([, v]) => !vacio(v));
    c.innerHTML = `
      <h2 class="titulo">${esc(N.nombre)}</h2>
      <div class="presentacion__grid">
        <p class="presentacion__texto">${esc(N.descripcion)}</p>
        <ul class="propuesta">
          ${(D.propuesta || []).map((x) => `<li><i class="bi ${esc(x.icono)}"></i><div><b>${esc(x.titulo)}</b><span>${esc(x.texto)}</span></div></li>`).join("")}
        </ul>
      </div>
      <figure class="presentacion__foto"><img src="${esc(foto)}" alt=""></figure>
      <dl class="datos-empresa">${datos.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`;
  }

  /* ---------- 3. índice ---------- */
  function indice() {
    const c = pagina("indice", "Contenido", { id: "p-indice", enBarra: "Contenido" });
    c.innerHTML = `
      <h2 class="titulo">En esta edición</h2>
      <ol class="indice-lista">
        ${categorias.map((cat) => {
          const l = deCategoria(cat.id);
          return `
          <li class="indice__item prop-borde--${esc(cat.propulsion)}">
            <a href="#cat-${esc(cat.id)}">
              <img src="${esc(l[0].foto)}" alt="">
              <span class="indice__texto"><b>${esc(cat.nombre)}</b><span>${esc(cat.intro)}</span><small>${l.length} ${l.length === 1 ? "modelo" : "modelos"}</small></span>
              <span class="indice__pag" data-indice="${esc(cat.id)}"></span>
            </a>
          </li>`;
        }).join("")}
        <li class="indice__item indice__item--simple"><a href="#p-comprar"><span class="indice__texto"><b>Cómo comprar</b></span><span class="indice__pag" data-indice="comprar"></span></a></li>
        <li class="indice__item indice__item--simple"><a href="#p-contacto"><span class="indice__texto"><b>Contacto</b></span><span class="indice__pag" data-indice="contacto"></span></a></li>
      </ol>`;
  }

  /* ---------- 4. aperturas de sección ---------- */
  function aperturaElectrica() {
    if (!categorias.some((c) => c.propulsion === "electrico")) return;
    const c = pagina("apertura apertura--electrico", "Movilidad eléctrica", { color: "electrico", enBarra: "Movilidad eléctrica" });
    // fotos del mosaico: rutas de D.fotosApertura o, si no hay, las fotos principales de los eléctricos
    const mosaico = ((D.fotosApertura || []).length ? D.fotosApertura
      : D.productos.filter((p) => p.propulsion === "electrico" && p.foto).map((p) => p.foto)).slice(0, 3);
    c.innerHTML = `
      <div class="mosaico mosaico--${mosaico.length}">${mosaico.map((f) => `<img src="${esc(f)}" alt="">`).join("")}</div>
      <div class="franjas franjas--fina" aria-hidden="true"><i class="f-electrico"></i></div>
      <h2 class="apertura__titulo">Movilidad eléctrica</h2>
      <p class="apertura__intro">Carros con batería recargable: silenciosos, sin combustible y listos para el patio, el parque o la finca.</p>
      <h3 class="apertura__sub">Cómo elegir</h3>
      <div class="guia">
        <div><i class="bi bi-person-arms-up"></i><b>Por edad</b><span>Pregúntanos la edad recomendada por el fabricante para cada modelo.</span></div>
        <div><i class="bi bi-battery-charging"></i><b>Por batería</b><span>Te confirmamos el voltaje, la autonomía y el tiempo de carga.</span></div>
        <div><i class="bi bi-people"></i><b>Por ocupantes y peso</b><span>Confirma el número de puestos y el peso máximo antes de elegir para dos niños.</span></div>
      </div>`;
  }
  // banda de uso responsable para la sección a gasolina (va sobre las fichas)
  const usoResponsable = () => `
      <div class="aviso-gasolina">
        <b><i class="bi bi-exclamation-triangle-fill"></i> Uso responsable</b>
        <span><i class="bi bi-eye"></i>Supervisión adulta en todo momento</span>
        <span><i class="bi bi-shield-check"></i>Casco y equipo de protección</span>
        <span><i class="bi bi-person-check"></i>Edad según el fabricante</span>
      </div>`;

  /* ---------- fichas ---------- */
  function precioHTML(p) {
    if (vacio(p.precio)) return `<div class="precio precio--consultar"><small>Precio</small><b>Consultar</b></div>`;
    return `<div class="precio"><small>Precio</small><b>${pesos(p.precio)}</b></div>`;
  }
  function botonHTML(p, corto) {
    const texto = p.disponible === false
      ? `Hola, ¿cuándo llega el ${p.nombre} (${p.ref})?`
      : `Hola, me interesa el ${p.nombre} (${p.ref}). ¿Me confirman disponibilidad y colores?`;
    const url = wa(texto);
    if (!url) return "";
    return `<a class="btn-wa" href="${esc(url)}" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i>${p.disponible === false ? "Consultar llegada" : corto ? "Pedir" : "Pedir por WhatsApp"}</a>`;
  }
  function fichaHTML(p, variante) {
    const sp = specsDe(p);
    const ident = [p.marca, p.modelo && `Modelo ${p.modelo}`].filter(Boolean).join(" · ");
    return `
      <article class="ficha ficha--${variante}" data-ref="${esc(p.ref)}">
        <figure class="ficha__foto">
          <img src="${esc(p.foto)}" alt="${esc(p.nombre)}"${p.fotoAmbiente ? ' class="foto--ambiente"' : ""}>
          ${p.disponible === false ? `<span class="agotado">Agotado por ahora</span>` : ""}
        </figure>
        <div class="ficha__info">
          <div class="ficha__tags">${etiquetaProp(p)}<span class="ref">Ref. ${esc(p.ref)}</span></div>
          <h3 class="ficha__nombre">${esc(p.nombre)}</h3>
          ${ident ? `<div class="ficha__ident">${esc(ident)}</div>` : ""}
          <p class="ficha__desc">${esc(p.descripcion)}</p>
          ${sp.length ? `<dl class="specs">${sp.slice(0, 6).map(([k, v]) => `<div${k === "Medidas" ? ' class="spec--ancha"' : ""}><dd>${esc(v)}</dd><dt>${esc(k)}</dt></div>`).join("")}</dl>
          <p class="fuente">Datos de la ficha del fabricante.</p>` : ""}
          ${(p.especiales || []).length ? `<ul class="especiales">${p.especiales.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>` : ""}
          ${(p.colores || []).length ? `<div class="colores">${p.colores.map((c) => `<span><i style="background:${esc(c.hex)}"></i>${esc(c.nombre)}</span>`).join("")}</div>` : ""}
          <div class="ficha__pie">${precioHTML(p)}${botonHTML(p, variante !== "completa")}</div>
        </div>
      </article>`;
  }

  const inicioCat = {};
  function productos() {
    let primeraElectrica = true;
    categorias.forEach((cat) => {
      if (cat.propulsion === "electrico" && primeraElectrica) { aperturaElectrica(); primeraElectrica = false; }
      const lista = deCategoria(cat.id);
      for (let i = 0; i < lista.length; i += 2) {
        const par = lista.slice(i, i + 2);
        const color = cat.propulsion === "accesorio" ? "pizarra" : cat.propulsion;
        const c = pagina(`productos${par.length === 1 ? " productos--sola" : ""}`, cat.nombre, { color, enBarra: i === 0 ? cat.nombre : null });
        if (i === 0) inicioCat[cat.id] = nPag;
        c.innerHTML = `
          <div class="cat-titulo" ${i === 0 ? `id="cat-${esc(cat.id)}"` : ""}>
            <h2>${esc(cat.nombre)}${i > 0 ? `<small> (continuación)</small>` : ""}</h2>
            ${i === 0 ? `<p>${esc(cat.intro)}</p>` : ""}
          </div>
          ${cat.propulsion === "gasolina" ? usoResponsable() : ""}
          ${par.length === 1 ? fichaHTML(par[0], "completa") : par.map((p, k) => fichaHTML(p, k % 2 ? "der" : "izq")).join("")}`;
      }
    });
  }

  /* ---------- cómo comprar ---------- */
  function comprar() {
    const c = pagina("comprar", "Cómo comprar", { id: "p-comprar", enBarra: "Cómo comprar" });
    c.innerHTML = `
      <h2 class="titulo">Cómo comprar</h2>
      <ol class="pasos">
        ${(D.pasos || []).map((x) => `<li><b>${esc(x.titulo)}</b><span>${esc(x.texto)}</span></li>`).join("")}
      </ol>
      <div class="comprar__bloques">
        <section>
          <h3>Para tiendas y distribuidores</h3>
          <p>Pide la lista de precios por volumen y la disponibilidad de cada referencia. Te enviamos fotos y fichas técnicas para tu tienda.</p>
          ${wa(`Hola, soy distribuidor y quiero la lista de precios de ${N.nombre}`) ? `<a class="btn-wa" href="${esc(wa(`Hola, soy distribuidor y quiero la lista de precios de ${N.nombre}`))}" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i>Pedir lista de precios</a>` : ""}
        </section>
        <section>
          <h3>Cómo leer las fichas</h3>
          <ul class="leer">
            ${[["electrico", "Funciona con batería recargable."], ["gasolina", "Motor a combustión; requiere supervisión adulta."], ["pedales", "Se mueve con la fuerza del niño."]]
              .filter(([k]) => D.productos.some((p) => p.propulsion === k))
              .map(([k, txt]) => `<li>${etiquetaProp({ propulsion: k, specs: {} })}${txt}</li>`).join("")}
          </ul>
          <p class="nota">Las especificaciones son las declaradas por el fabricante. Los precios incluyen IVA y pueden cambiar sin previo aviso; confírmalos al hacer tu pedido.</p>
        </section>
      </div>
      <section class="antes">
        <h3>Antes de la primera salida</h3>
        <ul>
          <li><i class="bi bi-book"></i><b>Lee el manual</b><span>Edad, peso máximo y uso recomendado por el fabricante.</span></li>
          <li><i class="bi bi-battery-charging"></i><b>Carga completa</b><span>Un adulto conecta y desconecta el cargador.</span></li>
          <li><i class="bi bi-shield-check"></i><b>Casco puesto</b><span>En motos, cuatrimotos y vehículos a gasolina.</span></li>
          <li><i class="bi bi-signpost-split"></i><b>Terreno seguro</b><span>Lejos de calles, piscinas y escaleras.</span></li>
        </ul>
      </section>`;
  }

  /* ---------- contacto ---------- */
  function contacto() {
    const c = pagina("contacto", "Contacto", { id: "p-contacto", interior: false, enBarra: "Contacto" });
    const item = (url, icono, texto) => vacio(texto) ? "" :
      (url ? `<li><a href="${esc(url)}" target="_blank" rel="noopener"><i class="bi ${icono}"></i>${esc(texto)}</a></li>` : `<li><i class="bi ${icono}"></i>${esc(texto)}</li>`);
    const creditos = Object.entries(CR).map(([ref, x]) =>
      `${esc(ref)}: <a href="${esc(x.pagina)}" target="_blank" rel="noopener">${esc(x.archivo.replace(/^File:/, ""))}</a>, ${esc(x.autor || "autor desconocido")}, ${esc(x.licencia)}`).join(" · ");
    c.innerHTML = `
      <div class="franjas" aria-hidden="true"><i class="f-electrico"></i><i class="f-gasolina"></i><i class="f-pedales"></i></div>
      <img class="contacto__logo" src="${esc(N.logo)}" alt="Logo ${esc(N.nombre)}">
      <h2>La próxima aventura comienza aquí</h2>
      <p class="contacto__sub">Conoce nuestros modelos y encuentra el vehículo ideal para cada pequeño conductor.</p>
      <div class="contacto__grid">
        ${wa(MSG) ? `<a class="contacto__qr" href="${esc(wa(MSG))}" target="_blank" rel="noopener"><span class="qr">${qrSvg(wa(MSG))}</span><span>Escanea y escríbenos por WhatsApp</span></a>` : ""}
        <ul class="contacto__lista">
          ${item(wa(MSG), "bi-whatsapp", N.whatsapp)}
          ${item(N.telefono ? `tel:${N.telefono.replace(/\s/g, "")}` : null, "bi-telephone", N.telefono)}
          ${item(N.correo ? `mailto:${N.correo}` : null, "bi-envelope", N.correo)}
          ${item(insta(), "bi-instagram", N.instagram)}
          ${item(N.facebook, "bi-facebook", N.facebook ? "Facebook" : null)}
          ${item(N.sitioWeb, "bi-globe2", N.sitioWeb)}
          ${item(N.direccion ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(N.direccion)}` : null, "bi-geo-alt", N.direccion)}
          ${item(null, "bi-map", [N.ciudad, N.pais].filter(Boolean).join(", "))}
        </ul>
      </div>
      ${creditos ? `<p class="creditos"><b>Créditos de fotografías (Wikimedia Commons, licencias libres):</b> ${creditos}</p>` : ""}
      <span class="num num--contacto">${nPag}</span>`;
  }

  /* ---------- números del índice ---------- */
  function numerar() {
    Object.entries(inicioCat).forEach(([id, n]) => { const t = raiz.querySelector(`[data-indice="${id}"]`); if (t) t.textContent = n; });
    const num = (id) => [...raiz.querySelectorAll(".pagina")].findIndex((p) => p.id === id) + 1;
    raiz.querySelector('[data-indice="comprar"]').textContent = num("p-comprar");
    raiz.querySelector('[data-indice="contacto"]').textContent = num("p-contacto");
  }

  /* ---------- validación y reporte de pendientes ---------- */
  function validar() {
    const refs = new Set([...raiz.querySelectorAll(".ficha[data-ref]")].map((n) => n.dataset.ref));
    const faltantes = D.productos.filter((p) => !refs.has(p.ref)).map((p) => p.ref);
    const pendientes = [];
    ["telefono", "direccion", "correo", "facebook", "sitioWeb"].forEach((k) => vacio(N[k]) && pendientes.push(`negocio: ${k}`));
    D.productos.forEach((p) => {
      ["marca", "precio", "garantia", "foto"].forEach((k) => vacio(p[k]) && pendientes.push(`${p.ref}: ${k}`));
      vacio((p.specs || {}).edad) && pendientes.push(`${p.ref}: edad recomendada`);
      Object.entries(p.specs || {}).forEach(([k, v]) => vacio(v) && pendientes.push(`${p.ref}: ${k}`));
    });
    const cortadas = [...raiz.querySelectorAll(".pagina")].filter((p) => {
      const c = p.querySelector(".pagina__cuerpo");
      return c && c.scrollHeight > c.clientHeight + 1;
    }).map((p) => p.id);
    window.__VALIDACION__ = { paginas: nPag, productos: D.productos.length, enRevista: refs.size, faltantes, cortadas, pendientes };
    console.log("VALIDACION " + JSON.stringify(window.__VALIDACION__));
  }

  /* ---------- modos: revista (visor con hojas) o PDF (páginas apiladas) ---------- */
  // revista.html      → visor tipo revista (js/visor.js pasa las hojas)
  // revista.html?pdf  → páginas A4 apiladas, para imprimir y generar el PDF
  const MODO_PDF = new URLSearchParams(location.search).has("pdf");
  function modo() {
    document.title = `${N.nombre} · Revista de vehículos infantiles`;
    if (MODO_PDF) {
      document.body.classList.remove("modo-revista");
      document.body.classList.add("modo-pdf");
      return;
    }
    // datos que usa el visor: secciones para el selector y WhatsApp
    window.REVISTA_VISOR = { secciones, whatsapp: wa(MSG), nombre: N.nombre, logo: N.logo };
    document.dispatchEvent(new CustomEvent("revista:listo"));
  }

  /* ---------- montaje ---------- */
  function construir() {
    portada();
    presentacion();
    indice();
    productos();
    comprar();
    contacto();
    numerar();
    validar();
    document.documentElement.dataset.listo = "1";
    modo();
  }

  const fuentes = document.fonts
    ? Promise.all(["400 1em Archivo", "700 1em Archivo", "800 1em Archivo"].map((f) => document.fonts.load(f).catch(() => null))).then(() => document.fonts.ready)
    : Promise.resolve();
  const imagenes = () => Promise.all(D.productos.filter((p) => p.foto).map((p) => new Promise((r) => { const i = new Image(); i.onload = i.onerror = r; i.src = p.foto; })));
  Promise.all([fuentes, imagenes()]).then(construir);
})();
