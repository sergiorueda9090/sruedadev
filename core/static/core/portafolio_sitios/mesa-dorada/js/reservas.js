/* =========================================================================
   RESERVA DE MESA POR WHATSAPP
   - Fecha: desde hoy hasta `anticipacionDias`; avisa si ese día está cerrado.
   - Hora: solo horas dentro del horario del día elegido (cada `intervalo`
     minutos, hasta `ultimaAntesDeCierre` minutos antes del cierre). Si la
     fecha es hoy, no ofrece horas que ya pasaron.
   - Envía UNA solicitud por WhatsApp; el restaurante la confirma.
   ========================================================================= */
(function () {
  "use strict";

  const N = window.CATALOGO.negocio;
  const H = N.horarioSemana || {};
  const C = Object.assign({ intervalo: 30, ultimaAntesDeCierre: 90, maxPersonas: 20, anticipacionDias: 60 }, N.reservasConfig || {});
  const $ = (id) => document.getElementById(id);
  const esc = (v) =>
    String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const deIso = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const aMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const h12 = (min) => {
    const h = Math.floor(min / 60), m = min % 60;
    if (h === 12 && m === 0) return "12:00 m.";
    return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "a.m." : "p.m."}`;
  };
  const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

  function horasDe(fechaIso) {
    if (!fechaIso) return [];
    const d = deIso(fechaIso);
    const r = H[d.getDay()];
    if (!r) return null; // cerrado
    let desde = aMin(r[0]);
    const hasta = aMin(r[1]) - C.ultimaAntesDeCierre;
    const ahora = new Date();
    if (fechaIso === iso(ahora)) {
      const min = ahora.getHours() * 60 + ahora.getMinutes() + 30; // al menos 30 min de anticipación
      while (desde < min) desde += C.intervalo;
    }
    const out = [];
    for (let m = desde; m <= hasta; m += C.intervalo) out.push(m);
    return out;
  }

  function pintarHoras() {
    const f = $("res-fecha").value;
    const sel = $("res-hora");
    const aviso = $("res-aviso-dia");
    const horas = horasDe(f);
    const previa = sel.value;
    aviso.textContent = "";
    if (!f) {
      sel.innerHTML = `<option value="">Elige primero la fecha</option>`;
      sel.disabled = true;
      return;
    }
    if (horas === null) {
      sel.innerHTML = `<option value="">Cerrado ese día</option>`;
      sel.disabled = true;
      aviso.textContent = `Los ${DIAS[deIso(f).getDay()]} no abrimos. Elige otra fecha.`;
      return;
    }
    if (!horas.length) {
      sel.innerHTML = `<option value="">Sin horas disponibles</option>`;
      sel.disabled = true;
      aviso.textContent = "Ya no quedan horas para reservar hoy. Elige otra fecha.";
      return;
    }
    sel.disabled = false;
    sel.innerHTML = `<option value="">Selecciona…</option>` +
      horas.map((m) => `<option value="${m}" ${String(m) === previa ? "selected" : ""}>${h12(m)}</option>`).join("");
  }

  function mensaje() {
    const f = deIso($("res-fecha").value);
    const fecha = f.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const ocasion = $("res-ocasion").value;
    const notas = $("res-notas").value.trim();
    return [
      `¡Hola, ${N.nombre}! Quiero reservar una mesa 🍽️`,
      "",
      `Fecha: ${fecha}`,
      `Hora: ${h12(Number($("res-hora").value))}`,
      `Personas: ${$("res-personas").value}`,
      `Nombre: ${$("res-nombre").value.trim()}`,
      ocasion ? `Ocasión: ${ocasion}` : null,
      notas ? `Notas: ${notas}` : null,
      "",
      "Quedo atento(a) a la confirmación.",
    ].filter((x) => x !== null).join("\n");
  }

  function montar() {
    const hoy = new Date();
    const max = new Date(); max.setDate(max.getDate() + C.anticipacionDias);
    $("res-fecha").min = iso(hoy);
    $("res-fecha").max = iso(max);
    $("res-personas").max = C.maxPersonas;
    $("res-personas-max").textContent = C.maxPersonas;
    $("res-ocasion").innerHTML = `<option value="">Ninguna en especial</option>` +
      (N.ocasiones || []).map((o) => `<option>${esc(o)}</option>`).join("");
    pintarHoras();
    $("res-fecha").addEventListener("input", pintarHoras);
    $("form-reserva").addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      form.classList.add("was-validated");
      if (!form.checkValidity() || $("res-hora").disabled) return;
      if (!N.whatsappLink) { alert("Falta configurar el WhatsApp del restaurante."); return; }
      window.open(`${N.whatsappLink}?text=${encodeURIComponent(mensaje())}`, "_blank", "noopener");
      $("res-enviada").classList.remove("d-none");
    });
  }

  window.Reservas = { montar };
})();
