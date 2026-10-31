/* Páginas internas: lista de créditos de fotografías desde window.CREDITOS (credits.js). */
(function () {
  'use strict';
  var lista = document.getElementById('lista-creditos');
  if (!lista) return;
  var creditos = window.CREDITOS || [];
  var nombresGrupo = { hero: 'Portada', catalogo: 'Catálogo', servicios: 'Servicios', proyectos: 'Obras de referencia', secciones: 'Otras secciones' };
  var anchoMenor = { hero: 960, catalogo: 640, servicios: 800, proyectos: 800, secciones: 800 };

  function el(tag, attrs, texto) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (texto) n.textContent = texto;
    return n;
  }

  lista.textContent = '';
  creditos.forEach(function (c) {
    var li = el('li');
    li.appendChild(el('img', { src: 'assets/img/' + c.grupo + '/' + c.slot + '-' + anchoMenor[c.grupo] + '.webp', alt: '', width: '96', height: '72', loading: 'lazy' }));
    var info = el('div');
    info.appendChild(el('strong', null, c.alt));
    info.appendChild(el('p', null, (nombresGrupo[c.grupo] || c.grupo) + ': ' + c.slot));
    info.appendChild(el('p', null, 'Autor: ' + c.autor));
    var p = el('p');
    var lic = el('a', { href: c.licenciaUrl, rel: 'license noopener', target: '_blank' }, c.licencia);
    var fuente = el('a', { href: c.fuente, rel: 'noopener', target: '_blank' }, c.titulo);
    p.appendChild(lic);
    p.appendChild(document.createTextNode(', fuente: '));
    p.appendChild(fuente);
    info.appendChild(p);
    li.appendChild(info);
    lista.appendChild(li);
  });
  if (!creditos.length) lista.appendChild(el('li', null, 'Aún no hay fotografías registradas.'));
})();
