/* =========================================================================
   LISTA DE COTIZACIÓN POR WHATSAPP — alquiler de maquinaria
   - El cliente agrega equipos (desde la web o la revista incrustada).
   - Por equipo: modalidad (hora/día/mes), duración, unidades, operador y nota.
   - Datos de la obra: fecha de inicio, ubicación, transporte, tipo de trabajo,
     nombre/empresa y notas.
   - Muestra un VALOR DE REFERENCIA y envía UN solo mensaje de WhatsApp.
   ========================================================================= */
(function () {
  "use strict";

  const D = window.CATALOGO;
  const N = D.negocio;
  const CLAVE = "cotizacion:" + N.nombre;
  const porRef = Object.fromEntries(D.equipos.map((x) => [x.ref, x]));
  const $ = (id) => document.getElementById(id);
  const esc = (v) =>
    String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pesos = (n) => `$${Number(n).toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;
  const MODOS = { hora: { s: "hora", p: "horas" }, dia: { s: "día", p: "días" }, mes: { s: "mes", p: "meses" } };
  const modosDe = (x) => Object.keys(MODOS).filter((k) => typeof (x.tarifas || {})[k] === "number");

  /* ---------- estado ---------- */
  // ref -> { modo, tiempo, unidades, operador, nota }
  let items = {};
  let datos = { fecha: "", obra: "", transporte: true, trabajo: "", nombre: "", empresa: "", notas: "" };
  try {
    const g = JSON.parse(localStorage.getItem(CLAVE) || "null");
    if (g && g.items) {
      items = Object.fromEntries(Object.entries(g.items).filter(([r]) => porRef[r] && porRef[r].disponible !== false));
      datos = Object.assign(datos, g.datos || {});
    }
  } catch (_) { /* sin almacenamiento: funciona igual */ }
  const guardar = () => { try { localStorage.setItem(CLAVE, JSON.stringify({ items, datos })); } catch (_) {} };

  const nuevoItem = (x) => ({
    modo: modosDe(x).includes("dia") ? "dia" : modosDe(x)[0] || "dia",
    tiempo: 1,
    unidades: 1,
    operador: x.operador === "Incluido" ? true : false,
    nota: "",
  });
  const valorItem = (r) => {
    const x = porRef[r], it = items[r];
    const t = (x.tarifas || {})[it.modo];
    return typeof t === "number" ? t * it.tiempo * it.unidades : null;
  };
  const total = () => Object.keys(items).reduce((s, r) => s + (valorItem(r) || 0), 0);
  const sinValor = () => Object.keys(items).filter((r) => valorItem(r) === null);
  const cantidad = () => Object.keys(items).length;

  /* ---------- acciones ---------- */
  let primeraVez = !cantidad();
  function agregar(ref) {
    const x = porRef[ref];
    if (!x || x.disponible === false) return;
    if (!items[ref]) items[ref] = nuevoItem(x);
    else items[ref].unidades = Math.min(20, items[ref].unidades + 1);
    guardar();
    pintar();
    avisar(primeraVez ? `${x.nombre} agregado · ajusta tiempo y operador en “Ver cotización”` : `${x.nombre} agregado a tu cotización`, primeraVez ? 3500 : 1800);
    primeraVez = false;
  }
  function quitar(ref) { delete items[ref]; guardar(); pintar(); }
  function vaciar() { items = {}; guardar(); pintar(); }

  /* ---------- botón en las tarjetas ---------- */
  function control(x) {
    if (x.disponible === false) return `<span class="agotado">No disponible</span>`;
    return `<span class="ctrl-cot" data-ref="${esc(x.ref)}"></span>`;
  }
  function pintarControles() {
    document.querySelectorAll(".ctrl-cot").forEach((c) => {
      const en = !!items[c.dataset.ref];
      c.innerHTML = en
        ? `<button type="button" class="btn btn-en-lista" data-accion="ver"><i class="bi bi-check2-circle"></i> En tu cotización</button>`
        : `<button type="button" class="btn btn-amarillo" data-accion="agregar"><i class="bi bi-clipboard-plus"></i> Agregar a cotización</button>`;
    });
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".ctrl-cot [data-accion]");
    if (!b) return;
    const ref = b.closest(".ctrl-cot").dataset.ref;
    if (b.dataset.accion === "agregar") agregar(ref);
    else bootstrap.Offcanvas.getOrCreateInstance($("panel-cot")).show();
  });

  /* ---------- panel ---------- */
  function lineaHTML(r) {
    const x = porRef[r], it = items[r];
    const modos = modosDe(x);
    const t = (x.tarifas || {})[it.modo];
    const v = valorItem(r);
    return `
      <div class="linea" data-ref="${esc(r)}">
        <img src="${esc(x.foto)}" alt="">
        <div class="linea__info">
          <div class="linea__nombre">${esc(x.nombre)} <small>${esc(x.ref)}</small></div>
          <div class="linea__fila">
            <label>Cobro
              <select class="form-select form-select-sm" data-campo="modo" ${modos.length ? "" : "disabled"}>
                ${modos.length ? modos.map((m) => `<option value="${m}" ${m === it.modo ? "selected" : ""}>Por ${MODOS[m].s}</option>`).join("") : `<option>Por confirmar</option>`}
              </select>
            </label>
            <label>${MODOS[it.modo] ? MODOS[it.modo].p[0].toUpperCase() + MODOS[it.modo].p.slice(1) : "Tiempo"}
              <input type="number" class="form-control form-control-sm" data-campo="tiempo" min="1" max="999" value="${it.tiempo}">
            </label>
            <label>Unidades
              <input type="number" class="form-control form-control-sm" data-campo="unidades" min="1" max="20" value="${it.unidades}">
            </label>
          </div>
          <div class="linea__fila2">
            ${x.operador === "Opcional"
              ? `<label class="form-check m-0"><input class="form-check-input" type="checkbox" data-campo="operador" ${it.operador ? "checked" : ""}> <span class="form-check-label">Con operador</span></label>`
              : `<span class="chip-op"><i class="bi bi-person-badge"></i> Operador ${x.operador === "Incluido" ? "incluido" : "por confirmar"}</span>`}
            <button type="button" class="btn-quitar" data-accion="quitar" aria-label="Quitar ${esc(x.nombre)}"><i class="bi bi-trash3"></i> Quitar</button>
          </div>
          <input class="form-control form-control-sm mt-2 nota-item" data-campo="nota" maxlength="120" value="${esc(it.nota)}" placeholder="Nota para este equipo (ej. con martillo, turno nocturno)">
          <div class="linea__valor">${typeof t === "number" ? `${pesos(t)} / ${MODOS[it.modo].s} · ` : ""}<b>${v === null ? "Valor por confirmar" : pesos(v)}</b></div>
        </div>
      </div>`;
  }

  function pintarTotales() {
    const n = cantidad();
    $("barra-cot").classList.toggle("visible", n > 0);
    document.body.classList.toggle("con-cot", n > 0);
    $("barra-cant").textContent = n;
    $("barra-total").textContent = n ? `Ref. ${pesos(total())}${sinValor().length ? " +" : ""}` : "";
    $("cot-total").textContent = pesos(total());
    $("cot-aviso-valor").classList.toggle("d-none", !sinValor().length);
    $("btn-enviar").disabled = !n;
    $("btn-vaciar").classList.toggle("d-none", !n);
  }

  function pintar() {
    pintarControles();
    const lista = $("cot-lista");
    lista.innerHTML = cantidad()
      ? Object.keys(items).map(lineaHTML).join("")
      : `<div class="cot-vacia"><i class="bi bi-clipboard"></i><p>Aún no has agregado equipos.<br>Elige los que necesitas en <a href="#maquinaria" data-bs-dismiss="offcanvas">Maquinaria</a>.</p></div>`;
    pintarTotales();
  }

  // cambios dentro de cada línea (sin repintar todo mientras escribe)
  document.addEventListener("input", (e) => {
    const l = e.target.closest(".linea[data-ref]");
    if (!l || !e.target.dataset.campo) return;
    const r = l.dataset.ref, it = items[r], c = e.target.dataset.campo;
    if (!it) return;
    if (c === "tiempo" || c === "unidades") {
      const max = c === "tiempo" ? 999 : 20;
      const n = Math.max(1, Math.min(max, parseInt(e.target.value, 10) || 1));
      it[c] = n;
    } else if (c === "operador") it.operador = e.target.checked;
    else if (c === "nota") it.nota = e.target.value;
    else if (c === "modo") it.modo = e.target.value;
    guardar();
    if (c === "modo") { l.outerHTML = lineaHTML(r); }
    else {
      const v = valorItem(r), t = (porRef[r].tarifas || {})[it.modo];
      l.querySelector(".linea__valor").innerHTML = `${typeof t === "number" ? `${pesos(t)} / ${MODOS[it.modo].s} · ` : ""}<b>${v === null ? "Valor por confirmar" : pesos(v)}</b>`;
    }
    pintarTotales();
  });
  document.addEventListener("change", (e) => {
    // normaliza los números al salir del campo
    if (e.target.matches('.linea [data-campo="tiempo"], .linea [data-campo="unidades"]')) {
      const r = e.target.closest(".linea").dataset.ref;
      if (items[r]) e.target.value = items[r][e.target.dataset.campo];
    }
  });
  document.addEventListener("click", (e) => {
    const b = e.target.closest('.linea [data-accion="quitar"]');
    if (b) quitar(b.closest(".linea").dataset.ref);
  });

  /* ---------- mensaje de WhatsApp ---------- */
  const fechaLarga = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };
  function mensaje() {
    const lineas = Object.keys(items).map((r) => {
      const x = porRef[r], it = items[r], v = valorItem(r);
      const tiempo = MODOS[it.modo] ? `${it.tiempo} ${it.tiempo === 1 ? MODOS[it.modo].s : MODOS[it.modo].p}` : "tiempo por definir";
      const op = x.operador === "Opcional" ? (it.operador ? "con operador" : "sin operador") : x.operador === "Incluido" ? "con operador" : "operador por confirmar";
      return `• ${it.unidades} × ${x.nombre} (${x.ref})\n    ${tiempo} · ${op} · ${v === null ? "valor por confirmar" : "ref. " + pesos(v)}` +
        (it.nota.trim() ? `\n    ↳ _${it.nota.trim()}_` : "");
    });
    return [
      `¡Hola, ${N.nombre}! Quiero cotizar alquiler de maquinaria 🚜`,
      `Solicitud #${Date.now().toString(36).toUpperCase().slice(-4)}`,
      "",
      ...lineas,
      "",
      `*Valor de referencia: ${pesos(total())}*${sinValor().length ? " (+ equipos por confirmar)" : ""}`,
      datos.transporte ? "Transporte a la obra: sí, por cotizar" : "Transporte a la obra: no (lo recojo)",
      "",
      `Fecha de inicio: ${fechaLarga(datos.fecha)}`,
      `Ubicación de la obra: ${datos.obra.trim()}`,
      datos.trabajo ? `Tipo de trabajo: ${datos.trabajo}` : null,
      `Nombre: ${datos.nombre.trim()}`,
      datos.empresa.trim() ? `Empresa: ${datos.empresa.trim()}` : null,
      datos.notas.trim() ? `Notas: ${datos.notas.trim()}` : null,
    ].filter((p) => p !== null).join("\n");
  }
  function enviar(e) {
    e.preventDefault();
    const f = $("form-cot");
    f.classList.add("was-validated");
    if (!f.checkValidity() || !cantidad()) return;
    if (!N.whatsappLink) { alert("Falta configurar el WhatsApp de la empresa."); return; }
    window.open(`${N.whatsappLink}?text=${encodeURIComponent(mensaje())}`, "_blank", "noopener");
    $("cot-enviada").classList.remove("d-none");
  }

  /* ---------- formulario ---------- */
  function montarFormulario() {
    const hoy = new Date();
    const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    $("fecha").min = iso(hoy);
    if (datos.fecha && datos.fecha < iso(hoy)) datos.fecha = "";
    ["fecha", "obra", "trabajo", "nombre", "empresa", "notas"].forEach((k) => ($(k).value = datos[k] || ""));
    $("transporte").checked = !!datos.transporte;
    $("form-cot").addEventListener("input", (e) => {
      const t = e.target;
      if (t.id === "transporte") datos.transporte = t.checked;
      else if (t.id in datos) datos[t.id] = t.value;
      guardar();
    });
    $("form-cot").addEventListener("submit", enviar);
    $("btn-vaciar").addEventListener("click", () => { if (confirm("¿Vaciar la cotización?")) vaciar(); });
    $("btn-nueva").addEventListener("click", () => { vaciar(); $("cot-enviada").classList.add("d-none"); });
    const panel = $("panel-cot");
    panel.addEventListener("show.bs.offcanvas", () => document.body.classList.add("panel-abierto"));
    panel.addEventListener("hidden.bs.offcanvas", () => document.body.classList.remove("panel-abierto"));
  }

  /* ---------- aviso ---------- */
  let tAviso;
  function avisar(texto, ms = 1800) {
    const t = $("toast-cot");
    t.textContent = texto;
    t.classList.add("visible");
    clearTimeout(tAviso);
    tAviso = setTimeout(() => t.classList.remove("visible"), ms);
  }

  /* ---------- desde la revista incrustada ---------- */
  window.addEventListener("message", (e) => {
    const fr = document.getElementById("iframe-revista");
    if (!fr || e.source !== fr.contentWindow) return;
    const m = e.data;
    if (!m || m.tipo !== "cotizacion:agregar" || typeof m.ref !== "string" || !porRef[m.ref]) return;
    agregar(m.ref);
  });

  window.Cotizacion = { control, agregar, montar: () => { montarFormulario(); pintar(); } };
})();
