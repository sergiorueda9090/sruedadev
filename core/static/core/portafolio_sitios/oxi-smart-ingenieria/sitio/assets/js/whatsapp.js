/* =====================================================================
   OXI SMART — Cotizador por WhatsApp
   · El número sale SOLO de company.js (OXI.company.whatsapp).
   · Cualquier botón con data-quote="id-producto" abre el cotizador.
   · Un <form data-quote-form> en la página se convierte en cotizador.
   ===================================================================== */
(() => {
  "use strict";
  const OXI = (window.OXI = window.OXI || {});

  const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();

  /** Enlace oficial de WhatsApp con el mensaje codificado. */
  function link(text) {
    const num = String(OXI.company?.whatsapp || "").replace(/\D/g, "");
    const base = num ? `https://wa.me/${num}` : "https://wa.me/";
    return `${base}?text=${encodeURIComponent(text)}`;
  }

  /** Mensaje de cotización con el formato acordado. */
  function buildMessage(d) {
    const U = OXI.utils;
    const p = d.productId ? U.getProduct(d.productId) : null;
    const lines = ["Hola, estoy interesado en cotizar con Oxi Smart Ingeniería.", ""];
    if (p) {
      lines.push(`Producto: ${p.nombre}`, `Referencia: ${U.refText(p)}`, `Precio: ${U.priceText(p)}`);
    } else {
      lines.push("Producto: Asesoría para elegir el equipo");
    }
    lines.push(
      `Cantidad: ${Math.max(1, parseInt(d.cantidad, 10) || 1)}`,
      `Nombre: ${clean(d.nombre) || "—"}`,
      `Empresa: ${clean(d.empresa) || "—"}`,
      `Ciudad: ${clean(d.ciudad) || "—"}`
    );
    if (clean(d.comentarios)) lines.push(`Comentarios: ${clean(d.comentarios)}`);
    lines.push("", "Solicito información comercial y técnica.");
    return lines.join("\n");
  }

  const generalMessage = () =>
    "Hola, estoy interesado en cotizar con Oxi Smart Ingeniería.\n\nSolicito información comercial y técnica.";

  /* ------------------------- Formulario ------------------------- */
  function productOptions(selected) {
    const U = OXI.utils;
    const groups = U.categories().map((c) => {
      const opts = U.productsIn(c.id)
        .map((p) => `<option value="${U.escapeHtml(p.id)}"${p.id === selected ? " selected" : ""}>${U.escapeHtml(p.nombre)}${p.referencia ? ` (${U.escapeHtml(p.referencia)})` : ""}</option>`)
        .join("");
      return opts ? `<optgroup label="${U.escapeHtml(c.nombre)}">${opts}</optgroup>` : "";
    }).join("");
    return `<option value=""${selected ? "" : " selected"}>Necesito asesoría para elegir</option>${groups}`;
  }

  function formHtml(uid, selected) {
    return `
      <div class="row g-3">
        <div class="col-12">
          <label class="form-label" for="${uid}-producto">Producto</label>
          <select class="form-select" id="${uid}-producto" name="productId">${productOptions(selected)}</select>
          <div class="form-text" data-q="info"></div>
        </div>
        <div class="col-sm-4">
          <label class="form-label" for="${uid}-cantidad">Cantidad</label>
          <input class="form-control qty" type="number" id="${uid}-cantidad" name="cantidad" min="1" max="9999" step="1" value="1" required inputmode="numeric">
        </div>
        <div class="col-sm-8">
          <label class="form-label" for="${uid}-nombre">Nombre</label>
          <input class="form-control" type="text" id="${uid}-nombre" name="nombre" autocomplete="name" required maxlength="80">
          <div class="invalid-feedback">Escriba su nombre para que sepamos a quién responder.</div>
        </div>
        <div class="col-sm-6">
          <label class="form-label" for="${uid}-empresa">Empresa o finca <span class="fw-normal text-body-secondary">(opcional)</span></label>
          <input class="form-control" type="text" id="${uid}-empresa" name="empresa" autocomplete="organization" maxlength="80">
        </div>
        <div class="col-sm-6">
          <label class="form-label" for="${uid}-ciudad">Ciudad</label>
          <input class="form-control" type="text" id="${uid}-ciudad" name="ciudad" autocomplete="address-level2" required maxlength="60">
          <div class="invalid-feedback">Escriba la ciudad o municipio donde está el proyecto.</div>
        </div>
        <div class="col-12">
          <label class="form-label" for="${uid}-comentarios">Comentarios <span class="fw-normal text-body-secondary">(opcional)</span></label>
          <textarea class="form-control" id="${uid}-comentarios" name="comentarios" rows="3" maxlength="500" placeholder="Área o número de estanques, especie, energía disponible…"></textarea>
        </div>
        <div class="col-12">
          <details>
            <summary class="small fw-semibold text-deep">Ver el mensaje que se enviará</summary>
            <pre class="quote-preview mt-2" data-q="preview" aria-live="polite"></pre>
          </details>
        </div>
        <div class="col-12 d-grid">
          <button type="submit" class="btn btn-wa btn-lg"><i class="bi bi-whatsapp" aria-hidden="true"></i>Enviar cotización por WhatsApp</button>
        </div>
      </div>`;
  }

  function wireForm(form, selected) {
    const uid = form.id || `q${Math.random().toString(36).slice(2, 7)}`;
    form.noValidate = true;
    form.innerHTML = formHtml(uid, selected);
    const preview = form.querySelector('[data-q="preview"]');
    const info = form.querySelector('[data-q="info"]');
    const data = () => Object.fromEntries(new FormData(form).entries());
    const refresh = () => {
      const d = data();
      preview.textContent = buildMessage(d);
      const p = d.productId ? OXI.utils.getProduct(d.productId) : null;
      info.textContent = p ? `Ref. ${OXI.utils.refText(p)}  |  ${OXI.utils.priceText(p)}` : "Le ayudamos a elegir el equipo según su proyecto.";
    };
    form.addEventListener("input", refresh);
    form.addEventListener("change", refresh);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        form.querySelector(":invalid")?.focus();
        return;
      }
      const d = data();
      const url = link(buildMessage(d));
      OXI.utils.track("generate_lead", { method: "whatsapp", item_id: d.productId || "asesoria", quantity: Number(d.cantidad) || 1 });
      window.open(url, "_blank", "noopener");
      if (!OXI.company?.whatsapp) console.warn("[Oxi] company.whatsapp está pendiente: WhatsApp pedirá elegir el contacto.");
      form.dispatchEvent(new CustomEvent("oxi:quote-sent", { bubbles: true, detail: { url } }));
    });
    refresh();
    return form;
  }

  /* ------------------------- Modal ------------------------- */
  let modal = null;
  function openQuote(productId) {
    if (!window.bootstrap) { window.location.href = `contacto.html?producto=${encodeURIComponent(productId || "")}#cotizar`; return; }
    if (!modal) {
      const el = document.createElement("div");
      el.className = "modal fade";
      el.id = "quoteModal";
      el.tabIndex = -1;
      el.setAttribute("aria-labelledby", "quoteModalTitle");
      el.setAttribute("aria-hidden", "true");
      el.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div class="modal-content" style="border-radius: var(--r-lg)">
            <div class="modal-header border-0 pb-0 px-4 pt-4">
              <div>
                <h2 class="modal-title h4" id="quoteModalTitle">Solicitar cotización</h2>
                <p class="mb-0 small">Se abrirá WhatsApp con su solicitud lista para enviar.</p>
              </div>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body px-4 pb-4"><form id="quoteModalForm"></form></div>
          </div>
        </div>`;
      document.body.appendChild(el);
      modal = { el, bs: new bootstrap.Modal(el), form: el.querySelector("form") };
      modal.el.addEventListener("shown.bs.modal", () => modal.form.querySelector('[name="nombre"]').focus());
      modal.form.addEventListener("oxi:quote-sent", () => modal.bs.hide());
    }
    wireForm(modal.form, productId);
    modal.bs.show();
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-quote]");
    if (!btn) return;
    e.preventDefault();
    openQuote(btn.dataset.quote);
  });

  document.addEventListener("oxi:ready", () => {
    document.querySelectorAll("form[data-quote-form]").forEach((f) => {
      const pre = new URLSearchParams(location.search).get("producto");
      wireForm(f, pre && OXI.utils.getProduct(pre) ? pre : "");
    });
    // Botón flotante
    if (!document.querySelector(".wa-float")) {
      const a = document.createElement("a");
      a.className = "wa-float";
      a.href = link(generalMessage());
      a.target = "_blank";
      a.rel = "noopener";
      a.setAttribute("aria-label", "Escribir por WhatsApp");
      a.innerHTML = '<i class="bi bi-whatsapp" aria-hidden="true"></i>';
      document.body.appendChild(a);
    }
  });

  OXI.whatsapp = { link, buildMessage, generalMessage, openQuote, wireForm };
})();
