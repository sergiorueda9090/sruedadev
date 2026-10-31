/* VITALIA — portada: productos destacados, estante del héroe, rutina y testimonios. */
(function (VT) {
  'use strict';
  VT.paginas = VT.paginas || {};

  VT.paginas.inicio = function () {
    const { u, ui, catalogo, widgets } = VT;

    const destacados = u.$('#destacados');
    if (destacados) {
      destacados.innerHTML = catalogo.destacados().slice(0, 8).map((p) => ui.tarjeta(p)).join('');
      if (VT.anim) VT.anim.tarjetas(destacados);
    }

    // Estante del héroe: tres productos complementarios
    const estante = u.$('#heroEstante');
    if (estante) {
      estante.innerHTML = ['infusion-calma', 'magnesio-noche', 'gel-ducha-eucalipto'].map(catalogo.porId).map((p) =>
        `<a class="estante-item" href="${u.ficha(p.id)}"><span class="img"><img src="${u.url(`assets/images/products/${p.id}/recorte-600.webp`)}" alt="" width="600" height="750" loading="lazy"></span>
          <span>${u.esc(p.nombre)}</span><strong>${u.dinero(p.precio)}</strong></a>`).join('');
    }

    const tabs = u.$('#rutinaTabs');
    if (tabs) widgets.pestanas(tabs);

    u.$$('[data-carrusel]').forEach(widgets.carrusel);
  };
})(window.VT = window.VT || {});
