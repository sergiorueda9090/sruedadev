/* =========================================================================
   CATÁLOGO MAQUINARIA — MAQUETADOR (PDF + revista)
   Construye páginas A4 desde window.CATALOGO (data/catalogo.js).
   - Fichas sin cortes entre páginas; categorías que fluyen con reglas
     para no dejar un equipo solo al final o al inicio de una página.
   - Enlaces: índice, "Cotizar" por WhatsApp por equipo, QR, mapa.
   - Créditos de fotos (licencias libres) en la contraportada.
   ========================================================================= */
(function () {
  "use strict";

  const D = window.CATALOGO;
  const N = D.negocio;
  const CR = window.CREDITOS_FOTOS || {};
  const raiz = document.getElementById("catalogo");

  /* ---------- utilidades ---------- */
  const esc = (v) =>
    String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const vacio = (v) => v === null || v === undefined || v === "";
  const pendiente = (campo) => `<span class="pendiente">Pendiente: ${esc(campo)}</span>`;
  const valor = (v, campo) => (vacio(v) ? pendiente(campo) : esc(v));
  const pesos = (p) => `$${Number(p).toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;
  const el = (html) => {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };
  const cat = (id) => D.categorias.find((c) => c.id === id) || {};
  const deCategoria = (id) => D.equipos.filter((x) => x.categoria === id);

  /* ---------- enlaces ---------- */
  const wa = (texto) => (N.whatsappLink ? N.whatsappLink + (texto ? `?text=${encodeURIComponent(texto)}` : "") : null);
  const insta = () =>
    N.instagram ? (/^https?:/.test(N.instagram) ? N.instagram : `https://instagram.com/${N.instagram.replace(/^@/, "")}`) : null;
  const U = N.ubicacion || {};
  const mapa = () => {
    const q = U.lat && U.lng ? `${U.lat},${U.lng}` : U.consultaMapa || N.direccion;
    return q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : null;
  };
  const enlace = (url, html, cls = "") =>
    url ? `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener">${html}</a>` : html;
  const MSG = "Hola, vi el catálogo y quiero cotizar alquiler de maquinaria";
  const botonCotizar = (x) => {
    const url = x.disponible === false ? null : wa(`Hola, quiero cotizar el alquiler de: ${x.nombre} (${x.ref})`);
    return url ? `<a class="btn-pedir" data-ref="${esc(x.ref)}" href="${esc(url)}" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i>Cotizar</a>` : "";
  };
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
          <div class="marca"><img src="${esc(N.logo)}" alt=""><div><span>${esc(N.nombre)}</span><small>${esc(N.subtitulo || "")}</small></div></div>
          <div class="seccion">${esc(seccion)}</div>
        </header>
        <div class="pagina__cuerpo"></div>
        <footer class="pagina__footer">
          ${enlace(wa(MSG), `<span><i class="bi bi-whatsapp"></i>Cotiza por WhatsApp: ${valor(N.whatsapp, "WhatsApp")}</span>`)}
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
    const tira = D.categorias
      .map((c) => ({ c, f: (deCategoria(c.id).find((x) => x.foto) || {}).foto }))
      .filter((t) => t.f)
      .slice(0, 6)
      .map((t) => `<a href="#cat-${esc(t.c.id)}"><img src="${esc(t.f)}" alt=""><span>${esc(t.c.nombre)} <i class="bi bi-chevron-right"></i></span></a>`)
      .join("");
    raiz.appendChild(el(`
      <section class="pagina portada">
        ${cintaPrueba()}
        <div class="portada__top">
          <div class="portada__marca"><img src="${esc(N.logo)}" alt="Logo ${esc(N.nombre)}"><div><b>${esc(N.nombre)}</b><span>${esc(N.subtitulo || "")}</span></div></div>
          ${enlace(wa(MSG), `<i class="bi bi-whatsapp"></i> Solicita una cotización`, "pill-cta")}
        </div>
        <div class="portada__texto">
          <div class="kicker">Catálogo de equipos</div>
          <h1>Alquiler de<br>maquinaria pesada</h1>
          <div class="portada__lema"><span class="subrayado">${valor(N.eslogan, "eslogan")}</span></div>
        </div>
        <div class="portada__foto">
          <img src="${esc(N.fotoPortada)}" alt="">
          ${enlace(wa(MSG), `<i class="bi bi-whatsapp"></i> Por hora · día · mes`, "pill-cta")}
        </div>
        <div class="tira">${tira}</div>
        <div class="portada__pie">
          <div class="qr">${qrSvg(wa(MSG))}</div>
          ${enlace(wa(MSG), `<div class="wa"><i class="bi bi-whatsapp"></i><div><small>Escríbenos por WhatsApp</small><b>${valor(N.whatsapp, "WhatsApp")}</b></div></div>`)}
          <div class="script">Tu obra<br>no se detiene</div>
        </div>
        <div class="portada__banda">
          ${(D.servicios || []).slice(0, 4).map((x) => `<span><i class="bi ${esc(x.icono)}"></i>${esc(x.titulo)}</span>`).join("")}
        </div>
      </section>`));
  }

  /* ---------- 2. nosotros y servicios ---------- */
  function nosotros() {
    const p = paginaInterior("Nosotros");
    cuerpo(p).innerHTML = `
      <div class="kicker">Quiénes somos</div>
      <h2 class="titulo-pagina"><span class="subrayado">${esc(N.nombre)}</span></h2>
      <p class="nosotros__texto">${valor(N.descripcion, "descripción")}</p>
      <div class="kicker">Servicios</div>
      <div class="grid-servicios mt-3">
        ${(D.servicios || []).map((s) => `<div class="servicio"><i class="bi ${esc(s.icono)}"></i><div><b>${esc(s.titulo)}</b><span>${esc(s.texto)}</span></div></div>`).join("")}
      </div>
      <dl class="ficha-empresa">
        <div><dt>Atendemos a</dt><dd>${valor(N.publico, "público")}</dd></div>
        <div><dt>Cobertura</dt><dd>${valor(N.cobertura, "zona de cobertura")}</dd></div>
        <div><dt>Horario</dt><dd>${valor(N.horario, "horario")}</dd></div>
        <div><dt>Ubicación</dt><dd>${enlace(mapa(), valor(N.direccion, "dirección") + ' <i class="bi bi-box-arrow-up-right small"></i>')}</dd></div>
      </dl>
      <div class="lema-grande"><span class="subrayado">${valor(N.eslogan, "eslogan")}</span></div>`;
  }

  /* ---------- 3. índice ---------- */
  function indice() {
    const p = paginaInterior("Contenido");
    cuerpo(p).innerHTML = `
      <div class="kicker">Nuestros equipos</div>
      <h2 class="titulo-pagina">Maquinaria disponible</h2>
      <div class="grid-indice">
        ${D.categorias.map((c) => {
          const l = deCategoria(c.id);
          if (!l.length) return "";
          const f = (l.find((x) => x.foto) || {}).foto;
          return `
            <a class="cat-card" href="#cat-${esc(c.id)}">
              ${f ? `<img src="${esc(f)}" alt="">` : ""}
              <div class="cat-card__info">
                <div><div class="cat-card__nombre"><i class="bi ${esc(c.icono)}"></i> ${esc(c.nombre)}</div>
                <div class="cat-card__intro">${esc(c.intro)} · ${l.length} equipo${l.length === 1 ? "" : "s"}</div></div>
                <div class="cat-card__pag" data-indice="${esc(c.id)}"></div>
              </div>
            </a>`;
        }).join("")}
      </div>
      <p class="indice__ayuda"><i class="bi bi-hand-index"></i> Toca una categoría para ir directo a ella · Condiciones de alquiler en la página <b data-indice="condiciones"></b></p>`;
  }

  /* ---------- ficha de equipo ---------- */
  function ficha(x) {
    const c = cat(x.categoria);
    const T = x.tarifas || {};
    const tarifa = (k, nombre) => (vacio(T[k]) ? "" : `<div class="tarifa"><small>${nombre}</small><b>${pesos(T[k])}</b></div>`);
    const tarifas = [tarifa("hora", "Hora"), tarifa("dia", "Día"), tarifa("mes", "Mes")].join("") || pendiente("tarifas");
    return el(`
      <article class="equipo" data-ref="${esc(x.ref)}">
        <div class="equipo__foto">
          ${x.foto ? `<img src="${esc(x.foto)}" alt="${esc(x.nombre)}">` : `<div class="h-100 d-grid" style="place-items:center">${pendiente("foto")}</div>`}
          <span class="equipo__ref">${esc(x.ref)}</span>
          ${x.destacado ? `<span class="equipo__top">Más solicitado</span>` : ""}
          ${x.disponible === false ? `<div class="no-disponible">No disponible</div>` : ""}
        </div>
        <div class="equipo__cuerpo">
          <h3 class="equipo__nombre">${esc(x.nombre)}</h3>
          <p class="equipo__desc">${valor(x.descripcion, "descripción")}</p>
          <dl class="specs">
            ${(x.especificaciones || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("") || pendiente("especificaciones")}
          </dl>
          <div class="equipo__pie">
            ${tarifas}
            <span class="operador"><i class="bi bi-person-badge"></i>Operador: ${valor(x.operador, "operador")}</span>
            ${botonCotizar(x)}
          </div>
        </div>
      </article>`);
  }

  /* ---------- 4. equipos por categoría (fluyen entre páginas) ---------- */
  function equipos() {
    const inicio = {};
    let p = null;
    const nuevaPagina = (s) => (p = paginaInterior(s));
    const nuevaSeccion = (c, cont) => {
      const s = el(`
        <section class="seccion-cat" ${cont ? "" : `id="cat-${esc(c.id)}"`}>
          <div class="banda"><i class="bi ${esc(c.icono)}"></i>${esc(c.nombre)}${cont ? " (cont.)" : ""} <i class="bi bi-chevron-right flecha"></i>${cont ? "" : `<small>${esc(c.intro)}</small>`}</div>
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
        const f = ficha(x);
        sec.querySelector(".lista").appendChild(f);
        if (!desborda(cuerpo(p))) { primero = false; return; }
        // Regla de corte: nunca menos de 2 equipos a cada lado. Si no se puede,
        // la sección completa pasa a la página siguiente.
        const aqui = sec.querySelectorAll(".equipo").length - 1; // ya ubicados en esta página
        const quedan = lista.length - i;                          // este + los que faltan
        const esCont = sec.classList.contains("es-cont");
        if (!primero && !esCont && (aqui < 2 || (quedan < 2 && aqui - 1 < 2))) primero = true;
        if (primero) {
          sec.remove();
          const h = p.querySelector(".pagina__header .seccion");
          h.textContent = h.textContent.replace(` · ${c.nombre}`, "");
          nuevaPagina(c.nombre);
          cuerpo(p).appendChild(sec);
          inicio[c.id] = p;
        } else {
          f.remove();
          const mover = [f];
          const previos = sec.querySelectorAll(".equipo");
          if (quedan < 2 && previos.length >= 3) mover.unshift(previos[previos.length - 1]);
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

  /* ---------- 5. condiciones y cómo alquilar ---------- */
  function condiciones() {
    const p = paginaInterior("Condiciones");
    p.id = "condiciones";
    cuerpo(p).innerHTML = `
      <div class="kicker">Antes de alquilar</div>
      <h2 class="titulo-pagina">Condiciones de alquiler</h2>
      <div class="grid-cond">
        ${(D.condiciones || []).map((c) => `<div class="cond"><i class="bi ${esc(c.icono)}"></i><div><b>${esc(c.titulo)}</b><span>${esc(c.texto)}</span></div></div>`).join("") || pendiente("condiciones de alquiler")}
      </div>
      <div class="kicker mt-5">Cómo alquilar</div>
      <div class="pasos">
        <div class="paso"><i class="bi bi-search"></i><b>Elige el equipo</b></div>
        <div class="paso"><i class="bi bi-whatsapp"></i><b>Pide tu cotización</b></div>
        <div class="paso"><i class="bi bi-calendar-check"></i><b>Confirma fechas y obra</b></div>
        <div class="paso"><i class="bi bi-truck-flatbed"></i><b>Recibe el equipo</b></div>
      </div>
      <p class="aviso-cond"><i class="bi bi-info-circle-fill"></i> Las tarifas de este catálogo son de referencia. El valor final depende del tiempo de alquiler, la distancia a la obra y si el equipo va con operador.</p>`;
    return p;
  }

  /* ---------- 6. cierre ---------- */
  function cierre() {
    const creditos = Object.entries(CR).map(([ref, c]) => `${esc(ref)}: “${esc(c.archivo.replace(/^File:/, ""))}”, ${esc(c.autor || "autor desconocido")}, ${esc(c.licencia)}, Wikimedia Commons.`).join("<br>");
    const p = el(`
      <section class="pagina cierre" id="contacto">
        ${cintaPrueba()}
        <img class="cierre__logo" src="${esc(N.logo)}" alt="Logo ${esc(N.nombre)}">
        <h2>¿Listo para empezar<br><span class="subrayado">tu obra?</span></h2>
        <p>Cuéntanos qué equipo necesitas, por cuánto tiempo y dónde es la obra. Te respondemos con la cotización.</p>
        ${enlace(wa(MSG), `<i class="bi bi-whatsapp"></i> Solicita tu cotización`, "btn-grande")}
        ${wa() ? `<div class="cierre__qr qr">${qrSvg(wa(MSG))}</div><div class="cierre__qr-txt">Escanea y cotiza por WhatsApp</div>` : ""}
        <div class="cierre__datos">
          <div>${enlace(wa(MSG), `<i class="bi bi-whatsapp"></i>${valor(N.whatsapp, "WhatsApp")}`)}</div>
          <div><i class="bi bi-clock-fill"></i>${valor(N.horario, "horario")}</div>
          <div>${enlace(mapa(), `<i class="bi bi-geo-alt-fill"></i>${valor(N.direccion, "dirección")}`)}</div>
          <div><i class="bi bi-map-fill"></i>${valor(N.cobertura, "cobertura")}</div>
          <div>${enlace(insta(), `<i class="bi bi-instagram"></i>${valor(N.instagram, "Instagram")}`)}</div>
          <div><i class="bi bi-envelope-fill"></i>${valor(N.correo, "correo")}</div>
        </div>
        ${creditos ? `<div class="creditos"><b>Créditos de fotografías (licencias libres):</b>${creditos}</div>` : ""}
      </section>`);
    raiz.appendChild(p);
    return p;
  }

  /* ---------- reparte el espacio libre ---------- */
  function repartirEspacio() {
    const MM = 96 / 25.4;
    raiz.querySelectorAll(".pagina").forEach((p) => {
      const c = cuerpo(p);
      const fichas = c ? c.querySelectorAll(".equipo") : [];
      if (!c || !fichas.length) return;
      // Si sobra mucho espacio, se agrega un llamado a cotizar en lugar de dejar el hueco
      const libre0 = c.getBoundingClientRect().bottom - c.lastElementChild.getBoundingClientRect().bottom;
      if (libre0 > 75 * MM) {
        c.insertAdjacentHTML("beforeend", `
          <aside class="cta-relleno">
            <div>
              <div class="kicker kicker--claro">¿Varios equipos para tu obra?</div>
              <h3>Arma tu cotización completa</h3>
              <p>Dinos qué equipos necesitas, por cuánto tiempo y dónde es la obra. Incluimos transporte y operador si lo requieres.</p>
              ${enlace(wa(MSG), `<i class="bi bi-whatsapp"></i> Cotizar por WhatsApp`, "btn-pedir btn-pedir--grande")}
            </div>
            ${wa() ? `<div class="qr">${qrSvg(wa(MSG))}</div>` : ""}
          </aside>`);
      }
      if (fichas.length < 2) return;
      const ultimo = c.lastElementChild.getBoundingClientRect().bottom;
      const libre = c.getBoundingClientRect().bottom - parseFloat(getComputedStyle(c).paddingBottom) - ultimo;
      if (libre <= 0) return;
      const huecos = fichas.length - 1 + c.querySelectorAll(".seccion-cat").length - 1;
      const extra = Math.min(libre / Math.max(huecos, 1), 8 * MM);
      c.querySelectorAll(".lista").forEach((l) => (l.style.gap = `calc(3mm + ${extra.toFixed(1)}px)`));
      c.querySelectorAll(".seccion-cat + .seccion-cat").forEach((s) => (s.style.marginTop = `calc(5mm + ${extra.toFixed(1)}px)`));
    });
  }

  /* ---------- validación ---------- */
  function validar() {
    const refs = new Set([...raiz.querySelectorAll(".equipo[data-ref]")].map((n) => n.dataset.ref));
    const faltantes = D.equipos.filter((x) => !refs.has(x.ref)).map((x) => x.ref);
    const pendientes = [];
    D.equipos.forEach((x) => ["nombre", "descripcion", "foto"].forEach((k) => vacio(x[k]) && pendientes.push(`${x.ref}: ${k}`)));
    window.__VALIDACION__ = { equipos: D.equipos.length, enCatalogo: refs.size, faltantes, pendientes };
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
    nosotros();
    indice();
    const inicioCat = equipos();
    const pCond = condiciones();
    cierre();

    const paginas = [...raiz.querySelectorAll(".pagina")];
    const num = (p) => String(paginas.indexOf(p) + 1).padStart(2, "0");
    paginas.forEach((p) => {
      const n = p.querySelector(".pagina__footer .num");
      if (n) n.textContent = num(p);
    });
    Object.entries(inicioCat).forEach(([id, p]) => {
      const t = raiz.querySelector(`[data-indice="${id}"]`);
      if (t) t.textContent = num(p);
    });
    const tc = raiz.querySelector('[data-indice="condiciones"]');
    if (tc) tc.textContent = num(pCond);

    repartirEspacio();
    validar();
    if (new URLSearchParams(location.search).has("pliegos")) armarPliegos(paginas);
    document.documentElement.dataset.listo = "1";
    document.dispatchEvent(new CustomEvent("catalogo:listo"));
  }

  const fuentes = document.fonts
    ? Promise.all(
        ['900 1em "Montserrat"', '800 1em "Montserrat"', '600 1em "Montserrat"', '500 1em "Montserrat"', '700 1em "Barlow Condensed"', '700 1em "Caveat"']
          .map((f) => document.fonts.load(f).catch(() => null))
      ).then(() => document.fonts.ready)
    : Promise.resolve();
  const imagenes = () =>
    Promise.all(D.equipos.filter((x) => x.foto).map((x) => new Promise((r) => {
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
