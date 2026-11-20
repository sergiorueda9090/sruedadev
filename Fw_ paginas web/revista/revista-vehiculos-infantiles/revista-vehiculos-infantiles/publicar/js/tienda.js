/* =========================================================================
   TIENDA — tienda.html
   Filtros (propulsión, categoría, edad, precio máximo, disponibles), orden
   y búsqueda. El estado de los filtros va en la URL para poder compartirla:
   tienda.html?prop=electrico&edad=5&orden=precio-asc
   ========================================================================= */
(function () {
  "use strict";

  const T = window.Tienda;
  const { D, esc, sinTildes, pesos, PROP, rangoEdad } = T;
  const $ = (id) => document.getElementById(id);
  const productos = D.productos;
  const categorias = D.categorias.filter((c) => productos.some((p) => p.categoria === c.id));
  const cat = (id) => D.categorias.find((c) => c.id === id) || {};
  const precios = productos.map((p) => p.precio).filter((n) => typeof n === "number");
  const PMAX = precios.length ? Math.ceil(Math.max(...precios) / 100000) * 100000 : 0;

  // estado desde la URL
  const u = new URLSearchParams(location.search);
  const f = {
    prop: (u.get("prop") || "").split(",").filter((k) => PROP[k]),
    cat: u.get("cat") || "",
    edad: u.get("edad") || "",
    precio: parseInt(u.get("precio"), 10) || PMAX,
    disp: u.get("disp") === "1",
    q: u.get("q") || "",
    orden: u.get("orden") || "",
  };

  function montar() {
    T.cabecera("tienda");
    T.pie();
    T.carrusel(document.getElementById("banners"));
    $("nota-precios").textContent = D.modoPrueba
      ? "Precios y especificaciones de ejemplo para la maqueta. No corresponden a los vehículos de las fotos."
      : "Precios con IVA incluido; pueden cambiar sin previo aviso. El envío se cotiza según la ciudad.";

    const props = Object.keys(PROP).filter((k) => productos.some((p) => p.propulsion === k));
    $("f-prop").innerHTML = props.map((k) => `
      <label class="f-op f-op--${k}"><input class="form-check-input" type="checkbox" name="prop" value="${k}" ${f.prop.includes(k) ? "checked" : ""}>
        <i class="bi ${PROP[k].icono}"></i><span>${PROP[k].nombre}</span><small>${productos.filter((p) => p.propulsion === k).length}</small></label>`).join("");
    $("f-cat").innerHTML = [`<label class="f-op"><input class="form-check-input" type="radio" name="cat" value="" ${f.cat ? "" : "checked"}><span>Todas</span></label>`]
      .concat(categorias.map((c) => `<label class="f-op"><input class="form-check-input" type="radio" name="cat" value="${esc(c.id)}" ${f.cat === c.id ? "checked" : ""}><span>${esc(c.nombre)}</span><small>${productos.filter((p) => p.categoria === c.id).length}</small></label>`)).join("");

    const rangos = productos.map(rangoEdad).filter(Boolean);
    if (rangos.length) {
      const min = Math.min(...rangos.map((r) => r[0])), max = Math.max(...rangos.map((r) => r[1]));
      for (let e = min; e <= max; e++) $("f-edad").insertAdjacentHTML("beforeend", `<option value="${e}">${e} ${e === 1 ? "año" : "años"}</option>`);
    }
    $("f-edad").value = f.edad;
    // sin datos de edad o de precio, esos filtros no sirven: se ocultan
    if (!rangos.length) $("f-edad").closest("fieldset").hidden = true;
    if (!PMAX) $("f-precio").closest("fieldset").hidden = true;
    const r = $("f-precio");
    r.min = 0; r.max = PMAX; r.value = f.precio;
    $("f-disponibles").checked = f.disp;
    if (!precios.length) $("orden").querySelectorAll('option[value^="precio"]').forEach((o) => o.remove());
    $("orden").value = f.orden;

    $("form-filtros").addEventListener("input", leer);
    $("orden").addEventListener("change", () => { f.orden = $("orden").value; pintar(); });
    $("limpiar").addEventListener("click", limpiar);
    $("limpiar-2").addEventListener("click", limpiar);
    $("activos").addEventListener("click", (e) => {
      const b = e.target.closest("[data-quitar]");
      if (!b) return;
      const [k, v] = b.dataset.quitar.split(":");
      if (k === "prop") f.prop = f.prop.filter((x) => x !== v);
      else if (k === "precio") f.precio = PMAX;
      else if (k === "disp") f.disp = false;
      else f[k] = "";
      sincronizarFormulario();
      pintar();
    });
    pintar();
  }

  function leer() {
    f.prop = [...document.querySelectorAll('[name="prop"]:checked')].map((i) => i.value);
    f.cat = (document.querySelector('[name="cat"]:checked') || {}).value || "";
    f.edad = $("f-edad").value;
    f.precio = parseInt($("f-precio").value, 10);
    f.disp = $("f-disponibles").checked;
    pintar();
  }
  function sincronizarFormulario() {
    document.querySelectorAll('[name="prop"]').forEach((i) => (i.checked = f.prop.includes(i.value)));
    document.querySelectorAll('[name="cat"]').forEach((i) => (i.checked = i.value === f.cat));
    $("f-edad").value = f.edad;
    $("f-precio").value = f.precio;
    $("f-disponibles").checked = f.disp;
    const q = document.getElementById("cab-q");
    if (q) q.value = f.q;
  }
  function limpiar() {
    Object.assign(f, { prop: [], cat: "", edad: "", precio: PMAX, disp: false, q: "" });
    sincronizarFormulario();
    pintar();
  }

  function pintar() {
    const q = sinTildes(f.q.trim());
    const edad = parseInt(f.edad, 10);
    let lista = productos.filter((p) => {
      const r = rangoEdad(p);
      const texto = sinTildes([p.ref, p.nombre, p.descripcion, p.modelo || "", cat(p.categoria).nombre, ...(p.colores || []).map((c) => c.nombre)].join(" "));
      return (!f.prop.length || f.prop.includes(p.propulsion))
        && (!f.cat || p.categoria === f.cat)
        && (!f.edad || (r && edad >= r[0] && edad <= r[1]))
        && (!PMAX || f.precio >= PMAX || (typeof p.precio === "number" && p.precio <= f.precio))
        && (!f.disp || p.disponible !== false)
        && (!q || texto.includes(q));
    });
    if (f.orden === "precio-asc") lista.sort((a, b) => (a.precio ?? Infinity) - (b.precio ?? Infinity));
    if (f.orden === "precio-desc") lista.sort((a, b) => (b.precio ?? -1) - (a.precio ?? -1));
    if (f.orden === "nombre") lista.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    // los agotados al final, salvo que se ordene por nombre
    if (f.orden !== "nombre") lista = lista.filter((p) => p.disponible !== false).concat(lista.filter((p) => p.disponible === false));

    $("grilla").innerHTML = lista.map(T.tarjeta).join("");
    $("sin-resultados").classList.toggle("d-none", lista.length > 0);
    $("f-precio-txt").textContent = f.precio >= PMAX ? "Sin límite" : `Hasta ${pesos(f.precio)}`;
    $("resumen").textContent = `${lista.length} de ${productos.length} vehículos`;

    // chips de filtros activos (se quitan con un toque)
    const chips = [
      ...f.prop.map((k) => [`prop:${k}`, PROP[k].nombre]),
      f.cat && ["cat:", cat(f.cat).nombre],
      f.edad && ["edad:", `Para ${f.edad} ${f.edad === "1" ? "año" : "años"}`],
      PMAX && f.precio < PMAX && ["precio:", `Hasta ${pesos(f.precio)}`],
      f.disp && ["disp:", "Solo disponibles"],
      f.q && ["q:", `“${f.q}”`],
    ].filter(Boolean);
    $("activos").innerHTML = chips.map(([k, t]) => `<button type="button" class="chip chip--quitar" data-quitar="${esc(k)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)} <i class="bi bi-x"></i></button>`).join("");

    // la URL refleja los filtros para compartir la búsqueda
    const p = new URLSearchParams();
    if (f.prop.length) p.set("prop", f.prop.join(","));
    if (f.cat) p.set("cat", f.cat);
    if (f.edad) p.set("edad", f.edad);
    if (PMAX && f.precio < PMAX) p.set("precio", f.precio);
    if (f.disp) p.set("disp", "1");
    if (f.q) p.set("q", f.q);
    if (f.orden) p.set("orden", f.orden);
    history.replaceState(null, "", p.toString() ? `?${p}` : location.pathname);
  }

  montar();
})();
