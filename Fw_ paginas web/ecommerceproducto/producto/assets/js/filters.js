/* VITALIA — catálogo: búsqueda, filtros por categoría y precio, destacados,
 * ordenamiento, cambio de cuadrícula, contador de resultados y estado vacío.
 * El estado se refleja en la URL (?q=&categoria=&min=&max=&destacados=1&orden=)
 * para poder compartir o recargar una búsqueda.
 */
(function (VT) {
  'use strict';
  VT.paginas = VT.paginas || {};

  VT.paginas.catalogo = function () {
    const { u, ui, catalogo } = VT;
    const $ = u.$;
    const precios = catalogo.productos.map((p) => p.precio);
    const PMIN = Math.floor(Math.min(...precios) / 1000) * 1000;
    const PMAX = Math.ceil(Math.max(...precios) / 1000) * 1000;
    const ORDENES = ['relevancia', 'precio-asc', 'precio-desc', 'nombre'];

    const params = new URLSearchParams(location.search);
    const estado = {
      q: params.get('q') || '',
      categorias: new Set((params.get('categoria') || '').split(',').filter((c) => catalogo.categoria(c))),
      min: Number(params.get('min')) || null,
      max: Number(params.get('max')) || null,
      destacados: params.get('destacados') === '1',
      orden: ORDENES.includes(params.get('orden')) ? params.get('orden') : 'relevancia',
      vista: (VT.almacen.leer('vista', 'amplia') === 'compacta') ? 'compacta' : 'amplia'
    };

    const el = {
      form: $('#formFiltros'), q: $('#fBuscar'), cats: $('#fCategorias'), min: $('#fMin'), max: $('#fMax'),
      dest: $('#fDestacados'), orden: $('#fOrden'), limpiar: $('#fLimpiar'), rejilla: $('#rejilla'),
      resultados: $('#resultados'), activos: $('#filtrosActivos'), nFiltros: $('#nFiltros'), ver: $('#fVer'),
      titulo: $('#catTitulo'), desc: $('#catDescripcion')
    };

    // ---------- controles ----------
    el.cats.innerHTML = catalogo.categorias.map((c) => `<label class="filtro-opcion"><span><input type="checkbox" name="categoria" value="${c.id}"> ${u.esc(c.nombre)}</span><em>${catalogo.porCategoria(c.id).length}</em></label>`).join('');
    el.min.placeholder = u.dinero(PMIN); el.max.placeholder = u.dinero(PMAX);
    $('#fRangoAyuda').textContent = `Precios entre ${u.dinero(PMIN)} y ${u.dinero(PMAX)}.`;

    function volcarEstado() {
      el.q.value = estado.q;
      u.$$('input[name="categoria"]', el.cats).forEach((c) => { c.checked = estado.categorias.has(c.value); });
      el.min.value = estado.min || ''; el.max.value = estado.max || '';
      el.dest.checked = estado.destacados;
      el.orden.value = estado.orden;
      u.$$('[data-vista]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.vista === estado.vista)));
      el.rejilla.classList.toggle('compacta', estado.vista === 'compacta');
      el.rejilla.classList.toggle('amplia', estado.vista === 'amplia');
    }

    // ---------- filtrado ----------
    function filtrar() {
      const n = u.normalizar(estado.q.trim());
      let lista = catalogo.productos.filter((p) => {
        if (n && !u.normalizar(`${p.nombre} ${catalogo.categoria(p.categoria).nombre} ${p.ingredientes.join(' ')}`).includes(n)) return false;
        if (estado.categorias.size && !estado.categorias.has(p.categoria)) return false;
        if (estado.min != null && p.precio < estado.min) return false;
        if (estado.max != null && p.precio > estado.max) return false;
        if (estado.destacados && !p.destacado) return false;
        return true;
      });
      const porNombre = (a, b) => a.nombre.localeCompare(b.nombre, 'es');
      const orden = {
        relevancia: (a, b) => (b.destacado - a.destacado) || catalogo.productos.indexOf(a) - catalogo.productos.indexOf(b),
        'precio-asc': (a, b) => a.precio - b.precio || porNombre(a, b),
        'precio-desc': (a, b) => b.precio - a.precio || porNombre(a, b),
        nombre: porNombre
      }[estado.orden];
      lista = lista.slice().sort(orden);
      return lista;
    }

    function chipsActivos() {
      const chips = [];
      if (estado.q.trim()) chips.push({ k: 'q', t: `«${estado.q.trim()}»` });
      estado.categorias.forEach((c) => chips.push({ k: 'cat', v: c, t: catalogo.categoria(c).nombre }));
      if (estado.min != null) chips.push({ k: 'min', t: `Desde ${u.dinero(estado.min)}` });
      if (estado.max != null) chips.push({ k: 'max', t: `Hasta ${u.dinero(estado.max)}` });
      if (estado.destacados) chips.push({ k: 'dest', t: 'Destacados' });
      el.activos.innerHTML = chips.map((c) => `<button class="chip" type="button" data-quitar-filtro="${c.k}" ${c.v ? `data-valor="${c.v}"` : ''}>${u.esc(c.t)} <i class="bi bi-x" aria-hidden="true"></i><span class="visually-hidden">: quitar filtro</span></button>`).join('');
      el.nFiltros.textContent = chips.length ? `(${chips.length})` : '';
      return chips.length;
    }

    function actualizarUrl() {
      const p = new URLSearchParams();
      if (estado.q.trim()) p.set('q', estado.q.trim());
      if (estado.categorias.size) p.set('categoria', [...estado.categorias].join(','));
      if (estado.min != null) p.set('min', estado.min);
      if (estado.max != null) p.set('max', estado.max);
      if (estado.destacados) p.set('destacados', '1');
      if (estado.orden !== 'relevancia') p.set('orden', estado.orden);
      const qs = p.toString();
      history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
    }

    function encabezado() {
      // Si se filtra una sola categoría, el título de la página la nombra
      if (estado.categorias.size === 1) {
        const c = catalogo.categoria([...estado.categorias][0]);
        el.titulo.textContent = c.nombre; el.desc.textContent = c.resumen;
        document.title = `${c.nombre} | VITALIA`;
      } else {
        el.titulo.textContent = estado.destacados ? 'Productos destacados' : 'Tienda';
        el.desc.textContent = 'Todos los productos con su etiqueta a la vista. Filtra por categoría o precio y compara con calma.';
        document.title = 'Tienda | VITALIA';
      }
    }

    function pintar() {
      const lista = filtrar();
      const nActivos = chipsActivos();
      if (VT.anim && VT.anim.limpiar) VT.anim.limpiar(el.rejilla);
      if (!lista.length) {
        el.rejilla.innerHTML = `<div class="vacio" style="grid-column:1/-1"><div class="icono-vacio"><i class="bi bi-search" aria-hidden="true"></i></div>
          <h3>No encontramos productos con esos filtros</h3><p>Prueba con otra palabra, amplía el rango de precio o quita alguna categoría.</p>
          <button class="btn-v" type="button" data-limpiar-todo>Limpiar filtros</button></div>`;
      } else {
        el.rejilla.innerHTML = lista.map((p) => ui.tarjeta(p, { presentacion: true })).join('');
        if (VT.anim) VT.anim.tarjetas(el.rejilla);
      }
      const total = catalogo.productos.length;
      el.resultados.innerHTML = lista.length === total && !nActivos
        ? `<strong>${total}</strong> productos`
        : `<strong>${lista.length}</strong> de ${total} productos`;
      if (el.ver) el.ver.textContent = lista.length ? `Ver ${lista.length} ${lista.length === 1 ? 'resultado' : 'resultados'}` : 'Sin resultados';
      encabezado();
      actualizarUrl();
    }

    // ---------- rango de precio ----------
    function leerRango() {
      const a = el.min.value === '' ? null : Math.max(0, Math.round(Number(el.min.value)));
      const b = el.max.value === '' ? null : Math.max(0, Math.round(Number(el.max.value)));
      const err = $('#err-rango');
      if (a != null && b != null && a > b) {
        err.textContent = 'El precio «Desde» no puede ser mayor que «Hasta».';
        el.min.setAttribute('aria-invalid', 'true'); el.min.setAttribute('aria-describedby', 'err-rango');
        return false;
      }
      err.textContent = ''; el.min.removeAttribute('aria-invalid');
      estado.min = Number.isFinite(a) ? a : null; estado.max = Number.isFinite(b) ? b : null;
      return true;
    }

    // ---------- eventos ----------
    el.form.addEventListener('submit', (e) => e.preventDefault());
    el.q.addEventListener('input', u.debounce(() => { estado.q = el.q.value; pintar(); }, 200));
    el.cats.addEventListener('change', (e) => {
      if (e.target.name !== 'categoria') return;
      if (e.target.checked) estado.categorias.add(e.target.value); else estado.categorias.delete(e.target.value);
      pintar();
    });
    [el.min, el.max].forEach((i) => i.addEventListener('input', u.debounce(() => { if (leerRango()) pintar(); }, 350)));
    el.dest.addEventListener('change', () => { estado.destacados = el.dest.checked; pintar(); });
    el.orden.addEventListener('change', () => { estado.orden = el.orden.value; pintar(); });
    u.$$('[data-vista]').forEach((b) => b.addEventListener('click', () => {
      estado.vista = b.dataset.vista; VT.almacen.guardar('vista', estado.vista); volcarEstado();
    }));

    function limpiar() {
      estado.q = ''; estado.categorias.clear(); estado.min = null; estado.max = null; estado.destacados = false; estado.orden = 'relevancia';
      $('#err-rango').textContent = '';
      volcarEstado(); pintar();
    }
    el.limpiar.addEventListener('click', () => { limpiar(); el.q.focus(); });
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-limpiar-todo]')) { limpiar(); el.resultados.focus && el.resultados.setAttribute('tabindex', '-1'); el.resultados.focus(); }
      const chip = e.target.closest('[data-quitar-filtro]');
      if (!chip) return;
      const k = chip.dataset.quitarFiltro;
      if (k === 'q') estado.q = '';
      if (k === 'cat') estado.categorias.delete(chip.dataset.valor);
      if (k === 'min') estado.min = null;
      if (k === 'max') estado.max = null;
      if (k === 'dest') estado.destacados = false;
      volcarEstado(); pintar();
      const siguiente = el.activos.querySelector('.chip'); (siguiente || el.q).focus();
    });

    volcarEstado();
    pintar();
  };
})(window.VT = window.VT || {});
