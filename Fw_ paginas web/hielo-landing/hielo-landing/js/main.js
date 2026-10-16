/* ==========================================================================
   main.js — datos de la empresa en la página, navegación y comportamiento general
   Bloques: 1. utilidades  2. modo y marca  3. campos [data-campo]
            4. productos  5. calidad  6. cifras  7. cobertura  8. clientes
            9. FAQ  10. WhatsApp  11. pie  12. SEO  13. navegación  14. sectores
   ========================================================================== */
(function () {
  'use strict';

  var S = window.SITE || {};
  var REV = S.modo !== 'publicacion';
  var wa = (window.Hielo && window.Hielo.wa) || { disponible: function () { return false; }, url: function () { return null; }, mensajes: {} };
  var doc = document;

  /* 1. Utilidades --------------------------------------------------------- */
  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }

  function get(path) {
    return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, S);
  }
  function vacio(v) {
    return v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0);
  }
  function el(tag, attrs, children) {
    var n = doc.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'text') n.textContent = v;
        else if (k === 'class') n.className = v;
        else n.setAttribute(k, v === true ? '' : v);
      });
    }
    (children || []).forEach(function (c) {
      if (c === null || c === undefined) return;
      n.appendChild(typeof c === 'string' ? doc.createTextNode(c) : c);
    });
    return n;
  }
  function icono(nombre) { return el('i', { class: 'bi bi-' + nombre, 'aria-hidden': 'true' }); }
  function pendiente(etiqueta, bloque) {
    return el('span', { class: 'pending' + (bloque ? ' pending-block' : ''), text: etiqueta + ': por confirmar' });
  }
  function urlSegura(u) {
    try {
      var x = new URL(u, doc.baseURI);
      return x.protocol === 'https:' || (x.protocol === 'http:' && x.hostname === 'localhost') ? x.href : null;
    } catch (e) { return null; }
  }
  function urlRelativaOHttps(u) {
    if (typeof u !== 'string' || !u) return null;
    if (/^[a-z0-9][\w\-./]*\.html(#[\w-]*)?$/i.test(u) || /^#[\w-]+$/.test(u)) return u;
    return /^https:\/\//i.test(u) ? urlSegura(u) : null;
  }
  function formatearWa(n) {
    var m = /^57(\d{3})(\d{3})(\d{4})$/.exec(n);
    return m ? '+57 ' + m[1] + ' ' + m[2] + ' ' + m[3] : '+' + n;
  }
  function abrirEnPestana(a) {
    a.target = '_blank';
    a.rel = 'noopener';
  }

  window.Hielo = window.Hielo || {};
  window.Hielo.util = { el: el, icono: icono, pendiente: pendiente, REV: REV };

  /* 2. Modo y marca ------------------------------------------------------- */
  if (!REV) doc.documentElement.classList.add('modo-publicacion');

  var nombre = get('empresa.nombreComercial');
  var marca = nombre || (REV ? '[Nombre de la empresa]' : 'Fábrica de hielo');
  $$('[data-marca]').forEach(function (n) { n.textContent = marca; });
  $$('[data-razon]').forEach(function (n) { n.textContent = get('empresa.razonSocial') || marca; });
  var logoCfg = get('empresa.logo');
  var logo = typeof logoCfg !== 'string' ? null
    : /^assets\/[\w\-./]+\.(svg|png|webp)$/i.test(logoCfg) ? logoCfg
    : /^https:\/\//i.test(logoCfg) ? urlSegura(logoCfg) : null;
  if (logo) $$('.brand-logo').forEach(function (img) { img.src = logo; });

  // Atributos del hero (máximo tres)
  var atributos = (S.atributosHero || []).filter(Boolean).slice(0, 3);
  var listaAtributos = $('#atributos-hero');
  if (listaAtributos) {
    if (atributos.length) {
      listaAtributos.textContent = '';
      atributos.forEach(function (t) { listaAtributos.appendChild(el('li', null, [icono('check2-circle'), ' ' + t])); });
    } else {
      listaAtributos.closest('.hero-pane').hidden = true;
    }
  }

  /* 3. Campos [data-campo] y [data-condicion] ------------------------------ */
  function valorVisible(n, valor, tipo) {
    if (tipo === 'tel') {
      var href = get('contacto.telefonoHref') || String(valor).replace(/[^\d+]/g, '');
      return el('a', { href: 'tel:' + href, text: valor });
    }
    if (tipo === 'wa') {
      var u = wa.url(wa.mensajes.general && wa.mensajes.general());
      if (!u) return null; // número inválido: se trata como vacío
      var a = el('a', { href: u, text: formatearWa(wa.numero()), 'aria-label': 'WhatsApp ' + formatearWa(wa.numero()) + ' (se abre en una pestaña nueva)' });
      abrirEnPestana(a);
      return a;
    }
    if (tipo === 'mail') return el('a', { href: 'mailto:' + valor, text: valor });
    if (tipo === 'lista') return doc.createTextNode(valor.join(', '));
    if (tipo === 'si-no') return doc.createTextNode(valor ? 'Sí, con entregas programadas' : 'No por ahora');
    return doc.createTextNode(String(valor));
  }

  $$('[data-campo]').forEach(function (n) {
    var campo = n.getAttribute('data-campo');
    var tipo = n.getAttribute('data-tipo');
    var etiqueta = n.getAttribute('data-etiqueta') || campo;
    var valor = get(campo);
    var destino = n.classList.contains('v') ? n : ($('.v', n) || n);
    var nodo = (tipo === 'si-no' ? (valor === true || valor === false) : !vacio(valor)) ? valorVisible(n, valor, tipo) : null;

    destino.textContent = '';
    if (nodo) {
      destino.appendChild(nodo);
    } else if (REV) {
      destino.appendChild(pendiente(etiqueta, n.hasAttribute('data-bloque')));
    } else {
      // En publicación se oculta el dato y, si es una fila de lista, la fila completa.
      var fila = n.tagName === 'DD' ? n.parentElement : n;
      fila.hidden = true;
    }
  });

  $$('[data-condicion]').forEach(function (n) {
    var valor = get(n.getAttribute('data-condicion'));
    if (valor) {
      var anio = $('[data-anio]', n);
      if (anio) anio.textContent = String(valor);
      return;
    }
    var parrafoAnio = $('[data-anio]', n);
    if (parrafoAnio) parrafoAnio.closest('p').hidden = true;
    if (REV) {
      var ref = $('h3', n) || $(':scope > span', n) || n;
      ref.appendChild(doc.createTextNode(' '));
      ref.appendChild(pendiente(n.getAttribute('data-etiqueta') || 'Dato'));
    } else {
      n.hidden = true;
    }
  });

  // Barra superior: si en publicación no queda ningún dato, se oculta entera.
  var topbar = $('#topbar');
  if (topbar && !REV && !$$('.topbar-list li', topbar).some(function (li) { return !li.hidden; })) topbar.hidden = true;

  /* 4. Productos ----------------------------------------------------------- */
  var productos = (S.productos || []).filter(function (p) {
    return p && (p.disponible === true || (REV && p.disponible === null));
  });
  window.Hielo.productos = productos;

  function botonCotizar(p) {
    var u = wa.url(wa.mensajes.producto(p.nombre));
    var a = el('a', { class: 'btn btn-brand', href: u || '#cotizacion', 'data-producto': p.nombre }, ['Cotizar este producto']);
    if (u) {
      abrirEnPestana(a);
      a.setAttribute('aria-label', 'Cotizar ' + p.nombre + ' por WhatsApp (se abre en una pestaña nueva)');
      a.prepend(icono('whatsapp'));
    } else {
      a.setAttribute('aria-label', 'Cotizar ' + p.nombre + ' con el formulario');
    }
    return a;
  }

  function fichaProducto(p, i) {
    var base = String(p.imagen || '');
    var media = el('figure', { class: 'product-media' }, [
      el('img', {
        src: base + '-sm.webp',
        srcset: base + '-sm.webp 600w, ' + base + '.webp ' + (p.ancho || 1000) + 'w',
        sizes: i === 0 ? '(min-width: 992px) 56vw, (min-width: 768px) 100vw, 100vw' : '(min-width: 768px) 50vw, 100vw',
        width: p.ancho || 1000, height: p.alto || 750,
        loading: 'lazy', decoding: 'async', alt: p.alt || p.nombre
      }),
      el('span', { class: 'ref-tag', text: 'Foto de referencia' })
    ]);

    var presentaciones;
    if (!vacio(p.presentaciones)) {
      presentaciones = el('ul', { class: 'chips' }, p.presentaciones.map(function (t) { return el('li', { text: t }); }));
    } else if (REV) {
      presentaciones = pendiente('Presentaciones y pesos');
    } else {
      presentaciones = doc.createTextNode('Te las indicamos al cotizar.');
    }

    var cuerpo = el('div', { class: 'product-body' }, [
      el('h3', { class: 'product-name', text: p.nombre }),
      el('p', { class: 'product-desc', text: p.descripcion || '' }),
      el('dl', { class: 'product-specs' }, [
        el('div', null, [el('dt', { text: 'Aplicaciones recomendadas' }),
          el('dd', null, [el('ul', { class: 'chips' }, (p.aplicaciones || []).map(function (t) { return el('li', { text: t }); }))])]),
        el('div', null, [el('dt', { text: 'Presentaciones' }), el('dd', null, [presentaciones])])
      ]),
      el('div', { class: 'product-foot' }, [
        el('span', { class: 'price-note' }, [icono('tag'), S.textoPrecio || 'Solicitar precio mayorista']),
        botonCotizar(p)
      ])
    ]);

    var card = el('article', { class: 'product' + (i === 0 ? ' product--lead' : ''), id: 'producto-' + p.id }, [media, cuerpo]);
    if (p.disponible === null) card.appendChild(el('span', { class: 'pending pending-badge', text: 'Producto por confirmar' }));
    return card;
  }

  var listaProductos = $('#lista-productos');
  if (listaProductos) {
    listaProductos.textContent = '';
    if (productos.length) {
      productos.forEach(function (p, i) { listaProductos.appendChild(fichaProducto(p, i)); });
    } else {
      listaProductos.appendChild(el('p', { class: 'note' }, [icono('info-circle'),
        REV ? ' Ningún producto está confirmado ni propuesto en js/config.js.' : ' Escríbenos para conocer los tipos de hielo disponibles.']));
    }
  }

  /* 5. Calidad: nota de proceso y documentos -------------------------------- */
  var notaProceso = $('#nota-proceso');
  if (notaProceso && (get('calidad.procesoConfirmado') || !REV)) notaProceso.hidden = true;

  var docsLista = $('#lista-documentos');
  if (docsLista) {
    var registro = get('calidad.registroSanitario');
    var certs = (get('calidad.certificaciones') || []).filter(Boolean);
    if (registro) docsLista.appendChild(el('li', null, [icono('patch-check'), el('strong', { text: 'Documento sanitario:' }), ' ' + registro]));
    certs.forEach(function (c) { docsLista.appendChild(el('li', null, [icono('patch-check'), c])); });
    if (!registro && !certs.length) {
      if (REV) {
        docsLista.appendChild(el('li', null, [pendiente('Registro, permiso o notificación sanitaria')]));
        docsLista.appendChild(el('li', null, [pendiente('Certificaciones verificadas')]));
      } else {
        $('#documentos').hidden = true;
      }
    }
  }

  /* 6. Cifras: solo valores numéricos documentados -------------------------- */
  var cifras = (S.indicadores || []).filter(function (c) { return c && typeof c.valor === 'number' && isFinite(c.valor); });
  if (cifras.length) {
    var lista = $('#lista-cifras');
    cifras.forEach(function (c) {
      lista.appendChild(el('li', null, [
        el('span', { class: 'stat-value' }, [
          c.prefijo || '',
          el('span', { 'data-count': String(c.valor), text: c.valor.toLocaleString('es-CO') }),
          c.sufijo || ''
        ]),
        el('span', { class: 'stat-label', text: c.etiqueta })
      ]));
    });
    $('#cifras').hidden = false;
    $('#sin-cifras').hidden = true;
    $('#capacidad').setAttribute('aria-labelledby', 'capacidad-titulo-cifras');
  }

  /* 7. Cobertura ------------------------------------------------------------- */
  var municipios = (get('cobertura.municipios') || []).filter(Boolean);
  var base = get('cobertura.ciudadBase');
  if (base) $('#mapa-base').textContent = base;
  var mapaLista = $('#mapa-municipios');
  if (mapaLista && municipios.length) {
    var max = 10;
    var mostrar = municipios.length > max ? municipios.slice(0, max - 1).concat(['+' + (municipios.length - max + 1) + ' más']) : municipios;
    mostrar.forEach(function (m, i) {
      var ang = (-90 + (360 / mostrar.length) * i) * Math.PI / 180;
      var li = el('li', { text: m });
      // Sobre el anillo intermedio del esquema (centro 50% / 45%, radio ≈ 26%).
      li.style.left = (50 + 26 * Math.cos(ang)).toFixed(2) + '%';
      li.style.top = (45 + 26 * Math.sin(ang)).toFixed(2) + '%';
      mapaLista.appendChild(li);
    });
    $('#mapa-texto').textContent = 'Esquema de cobertura, no a escala.';
  } else if (!REV) {
    $('#mapa-texto').textContent = 'Consúltanos si entregamos en tu zona.';
  }
  var coords = get('cobertura.coordenadas');
  if (coords && isFinite(coords.lat) && isFinite(coords.lng)) {
    var enlace = $('#mapa-enlace');
    enlace.href = 'https://www.openstreetmap.org/?mlat=' + coords.lat + '&mlon=' + coords.lng + '#map=15/' + coords.lat + '/' + coords.lng;
    enlace.hidden = false;
  }

  /* 8. Clientes o guía por sector -------------------------------------------- */
  var logos = (get('clientes.logos') || []).filter(function (l) { return l && l.src && l.nombre; });
  var testimonios = (get('clientes.testimonios') || []).filter(function (t) { return t && t.texto && t.autor; });
  if (logos.length || testimonios.length) {
    var ul = $('#lista-logos');
    logos.forEach(function (l) {
      ul.appendChild(el('li', null, [el('img', { src: l.src, alt: l.nombre, width: l.ancho || 160, height: l.alto || 56, loading: 'lazy' })]));
    });
    var q = $('#lista-testimonios');
    testimonios.forEach(function (t) {
      q.appendChild(el('figure', null, [
        el('blockquote', null, [el('p', { text: t.texto })]),
        el('figcaption', { text: [t.autor, t.cargo, t.empresa].filter(Boolean).join(', ') })
      ]));
    });
    $('#con-clientes').hidden = false;
    $('#sin-clientes').hidden = true;
    $('#clientes').setAttribute('aria-labelledby', 'clientes-titulo-real');
  } else {
    var tabla = $('#matriz');
    var columnas = productos.length ? productos : (S.productos || []).filter(function (p) { return p.disponible !== false; });
    if (tabla && columnas.length) {
      var thead = el('thead', null, [el('tr', null, [el('th', { scope: 'col', text: 'Tipo de negocio' })].concat(
        columnas.map(function (p) {
          var corto = p.nombre.replace(/^Hielo (en )?/i, '');
          return el('th', { scope: 'col', text: corto.charAt(0).toUpperCase() + corto.slice(1) });
        })
      ))]);
      var tbody = el('tbody');
      (S.usosPorSector || []).forEach(function (fila) {
        tbody.appendChild(el('tr', null, [el('th', { scope: 'row', text: fila.sector })].concat(columnas.map(function (p) {
          var usa = (fila.productos || []).indexOf(p.id) !== -1;
          return el('td', null, usa
            ? [icono('check-circle-fill'), el('span', { class: 'visually-hidden', text: 'Uso habitual' })]
            : [el('span', { class: 'no', 'aria-hidden': 'true', text: '–' }), el('span', { class: 'visually-hidden', text: 'Poco habitual' })]);
        }))));
      });
      tabla.appendChild(thead);
      tabla.appendChild(tbody);
    } else if (tabla) {
      $('#clientes').hidden = true;
    }
  }

  /* 9. Preguntas frecuentes --------------------------------------------------- */
  function respuestaAuto(clave) {
    var confirmados = (S.productos || []).filter(function (p) { return p.disponible === true; });
    if (clave === 'productos' && confirmados.length) {
      return 'Fabricamos ' + confirmados.map(function (p) { return p.nombre.toLowerCase(); }).join(', ') + '. Revisa la sección de productos para ver usos y presentaciones.';
    }
    if (clave === 'presentaciones') {
      var con = confirmados.filter(function (p) { return !vacio(p.presentaciones); });
      if (con.length) return con.map(function (p) { return p.nombre + ': ' + p.presentaciones.join(', ') + '.'; }).join(' ');
    }
    if (clave === 'cobertura' && municipios.length) {
      return 'Entregamos en ' + municipios.join(', ') + '. Si tu municipio no aparece, consúltanos.';
    }
    if (clave === 'anticipacion' && get('operacion.anticipacionPedido')) return get('operacion.anticipacionPedido');
    return null;
  }

  var faq = $('#faq-lista');
  if (faq) {
    var n = 0;
    (S.faq || []).forEach(function (item) {
      if (!item || !item.pregunta) return;
      var r = item.respuesta || (item.auto ? respuestaAuto(item.auto) : null);
      if (!r && !REV) return;
      n += 1;
      var id = 'faq-' + n;
      var btn = el('button', {
        class: 'accordion-button collapsed', type: 'button',
        'data-bs-toggle': 'collapse', 'data-bs-target': '#' + id,
        'aria-expanded': 'false', 'aria-controls': id, id: id + '-btn'
      }, [item.pregunta]);
      var cuerpo = el('div', { class: 'accordion-body' }, [r ? el('p', { class: 'mb-0', text: r }) : pendiente('Respuesta de la empresa', true)]);
      faq.appendChild(el('div', { class: 'accordion-item' }, [
        el('h3', { class: 'accordion-header' }, [btn]),
        el('div', { id: id, class: 'accordion-collapse collapse', role: 'region', 'aria-labelledby': id + '-btn', 'data-bs-parent': '#faq-lista' }, [cuerpo])
      ]));
    });
    if (!n) $('#preguntas').hidden = true;
  }

  /* 10. WhatsApp: botones generales y flotante --------------------------------- */
  var hayWa = wa.disponible();
  $$('[data-wa]').forEach(function (a) {
    var tipo = a.getAttribute('data-wa');
    var u = hayWa && wa.mensajes[tipo] ? wa.url(wa.mensajes[tipo]()) : null;
    if (u) {
      a.href = u;
      abrirEnPestana(a);
      a.setAttribute('aria-label', a.textContent.trim() + ' (WhatsApp, se abre en una pestaña nueva)');
    } else if (a.classList.contains('btn-wa')) {
      // Sin número: en revisión se explica; en publicación el botón desaparece.
      if (REV) $$('[data-wa-off]').forEach(function (p) { p.hidden = false; });
      else a.hidden = true;
    }
  });

  var flotante = $('#wa-float');
  if (flotante) {
    if (hayWa) {
      flotante.href = wa.url(wa.mensajes.general());
      abrirEnPestana(flotante);
      flotante.setAttribute('aria-label', 'Escríbenos por WhatsApp (se abre en una pestaña nueva)');
      flotante.hidden = false;
    } else if (REV) {
      flotante.classList.add('is-pending');
      $('.wa-float-label', flotante).textContent = 'WhatsApp por configurar';
      flotante.setAttribute('aria-label', 'WhatsApp por configurar: ir al formulario de cotización');
      flotante.hidden = false;
    }
    // Se retira mientras el formulario está en pantalla para no tapar sus controles.
    var form = $('#form-cotizacion');
    if (form && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entradas) {
        flotante.style.visibility = entradas[0].isIntersecting ? 'hidden' : '';
      }, { threshold: 0.05 }).observe(form);
    }
  }

  /* 11. Pie -------------------------------------------------------------------- */
  var anio = $('#anio');
  if (anio) anio.textContent = String(new Date().getFullYear());

  var priv = urlRelativaOHttps(get('legal.politicaPrivacidad'));
  if (priv) $$('[data-privacidad]').forEach(function (a) { a.href = priv; });

  var redes = $('#redes');
  (S.redes || []).forEach(function (r) {
    var u = r && urlSegura(r.url);
    if (!u || !/^https:/.test(u)) return;
    var a = el('a', { href: u, 'aria-label': r.red + ' (se abre en una pestaña nueva)' }, [icono(String(r.icono || 'link-45deg').replace(/[^a-z0-9-]/g, ''))]);
    abrirEnPestana(a);
    redes.appendChild(el('li', null, [a]));
  });
  if (redes && !redes.children.length) {
    if (REV) redes.appendChild(el('li', null, [pendiente('Redes sociales oficiales')]));
    else redes.hidden = true;
  }

  var creditos = $('#lista-creditos');
  (S.creditosFotos || []).forEach(function (c) {
    var u = urlSegura(c.url);
    creditos.appendChild(el('li', null, [
      c.foto + ': ',
      u ? el('a', { href: u, text: c.autor, rel: 'noopener', target: '_blank' }) : c.autor,
      ' (' + c.licencia + ')'
    ]));
  });

  /* 12. SEO: título, canonical y datos estructurados --------------------------- */
  var ciudad = get('empresa.ciudad');
  if (nombre) {
    doc.title = nombre + ' | Fábrica de hielo' + (ciudad ? ' en ' + ciudad : '') + ' — venta y distribución';
    var ogt = $('meta[property="og:title"]');
    if (ogt) ogt.setAttribute('content', doc.title);
  }
  var canon = urlSegura(get('empresa.urlCanonica'));
  if (canon && /^https:/.test(canon)) {
    doc.head.appendChild(el('link', { rel: 'canonical', href: canon }));
    doc.head.appendChild(el('meta', { property: 'og:url', content: canon }));
    var ogi = $('meta[property="og:image"]');
    if (ogi) ogi.setAttribute('content', new URL('assets/img/og-hielo.jpg', canon).href);
  }
  var tel = get('contacto.telefonoHref') || get('contacto.telefono');
  var dir = get('empresa.direccion');
  if (nombre && (tel || dir)) {
    var ld = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: nombre,
      description: get('empresa.descripcion') || 'Fabricación y distribución de hielo para negocios.'
    };
    if (get('empresa.razonSocial')) ld.legalName = get('empresa.razonSocial');
    if (canon) { ld.url = canon; ld.image = new URL('assets/img/og-hielo.jpg', canon).href; }
    if (tel) ld.telephone = tel;
    if (get('contacto.correo')) ld.email = get('contacto.correo');
    if (dir || ciudad) {
      ld.address = { '@type': 'PostalAddress', addressCountry: 'CO' };
      if (dir) ld.address.streetAddress = dir;
      if (ciudad) ld.address.addressLocality = ciudad;
      if (get('empresa.departamento')) ld.address.addressRegion = get('empresa.departamento');
    }
    if (coords && isFinite(coords.lat) && isFinite(coords.lng)) ld.geo = { '@type': 'GeoCoordinates', latitude: coords.lat, longitude: coords.lng };
    if (municipios.length) ld.areaServed = municipios.map(function (m) { return { '@type': 'City', name: m }; });
    var same = (S.redes || []).map(function (r) { return r && urlSegura(r.url); }).filter(Boolean);
    if (same.length) ld.sameAs = same;
    doc.head.appendChild(el('script', { type: 'application/ld+json', text: JSON.stringify(ld) }));
  }

  /* 13. Navegación --------------------------------------------------------------- */
  var cabecera = $('#cabecera');
  function alDesplazar() { cabecera.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', alDesplazar, { passive: true });
  alDesplazar();

  var menu = $('#menu');
  var toggler = $('.navbar-toggler');
  function cerrarMenu(devolverFoco) {
    if (!menu || !menu.classList.contains('show') || !window.bootstrap) return;
    window.bootstrap.Collapse.getOrCreateInstance(menu, { toggle: false }).hide();
    if (devolverFoco && toggler) toggler.focus();
  }
  $$('#menu a[href^="#"]').forEach(function (a) { a.addEventListener('click', function () { cerrarMenu(false); }); });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarMenu(true); });
  if (menu && toggler) {
    menu.addEventListener('shown.bs.collapse', function () { toggler.setAttribute('aria-label', 'Cerrar menú'); });
    menu.addEventListener('hidden.bs.collapse', function () { toggler.setAttribute('aria-label', 'Abrir menú'); });
  }

  // Al seguir un ancla, el foco pasa a la sección (lectores de pantalla y teclado).
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () {
      var id = a.getAttribute('href').slice(1);
      var destino = id && doc.getElementById(id);
      if (!destino) return;
      if (!destino.hasAttribute('tabindex')) destino.setAttribute('tabindex', '-1');
      setTimeout(function () { destino.focus({ preventScroll: true }); }, 0);
    });
  });

  // Enlace activo según la sección visible
  var enlaces = $$('#menu .nav-link');
  if ('IntersectionObserver' in window) {
    var porId = {};
    enlaces.forEach(function (a) { porId[a.getAttribute('href').slice(1)] = a; });
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        enlaces.forEach(function (a) { a.classList.remove('active'); a.removeAttribute('aria-current'); });
        var a = porId[en.target.id];
        if (a) { a.classList.add('active'); a.setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(porId).forEach(function (id) { var s = doc.getElementById(id); if (s) observador.observe(s); });
  }

  // «Cotizar este producto» sin WhatsApp: preselecciona el producto en el formulario.
  doc.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-producto][href="#cotizacion"]');
    if (!a) return;
    doc.dispatchEvent(new CustomEvent('hielo:producto', { detail: a.getAttribute('data-producto') }));
  });

  /* 14. Sectores: pestañas accesibles ------------------------------------------- */
  var tabs = $$('.sector-tab');
  function activar(tab, enfocar) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var panel = doc.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (enfocar) {
      tab.focus();
      tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }
  if (tabs.length) {
    activar(tabs[0], false);
    var vertical = function () { return window.matchMedia('(min-width: 992px)').matches; };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { activar(t, false); });
      t.addEventListener('keydown', function (e) {
        var sig = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        var destino = null;
        if (sig) destino = tabs[(i + sig + tabs.length) % tabs.length];
        if (e.key === 'Home') destino = tabs[0];
        if (e.key === 'End') destino = tabs[tabs.length - 1];
        if (destino) { e.preventDefault(); activar(destino, true); }
      });
    });
    var lista = $('.sector-menu');
    var ajustarOrientacion = function () { lista.setAttribute('aria-orientation', vertical() ? 'vertical' : 'horizontal'); };
    ajustarOrientacion();
    window.addEventListener('resize', ajustarOrientacion, { passive: true });
  }
})();
