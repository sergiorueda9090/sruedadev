/* VITALIA — arranque. Monta el header, el footer y los paneles compartidos, ejecuta
 * el módulo de la página según <body data-page="…"> y, al final, las animaciones.
 * Los módulos de página se registran en VT.paginas desde su propio archivo.
 */
(function (VT) {
  'use strict';
  VT.paginas = VT.paginas || {};

  function arrancar() {
    try {
      VT.ui.montarShell();
      VT.forms.newsletter();
      const modulo = VT.paginas[VT.u.PAGINA];
      if (modulo) modulo();
    } catch (err) {
      // Un error de datos no debe dejar el contenido oculto
      document.documentElement.classList.remove('anim');
      console.error('[VITALIA]', err);
    }
    if (VT.anim && VT.anim.init) VT.anim.init();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})(window.VT = window.VT || {});
