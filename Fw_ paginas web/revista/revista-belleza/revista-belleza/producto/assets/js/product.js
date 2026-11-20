/* VITALIA — ficha de producto (pages/producto.html?id=<id>).
 * Galería con miniaturas, zoom, vista ampliada en modal, teclado y deslizamiento;
 * comparador antes/después; «Etiqueta abierta»; información desplegable; opiniones
 * demostrativas; preguntas del producto; relacionados y barra de compra en móvil.
 */
(function (VT) {
  'use strict';
  VT.paginas = VT.paginas || {};

  VT.paginas.producto = function () {
    const { u, ui, catalogo, config } = VT;
    const esc = u.esc;
    const p = catalogo.porId(u.param('id') || '');
    const ficha = u.$('#ficha');

    if (!p) {
      ficha.innerHTML = `<div class="error-404"><div><p class="cifra" aria-hidden="true">?</p><h1 class="h2">No encontramos este producto</h1>
        <p class="texto-suave">Puede que el enlace esté incompleto o que el producto ya no forme parte del catálogo.</p>
        <a class="btn-v mt-2" href="catalogo.html">Ir a la tienda</a></div></div>`;
      document.title = 'Producto no encontrado | VITALIA';
      return;
    }

    const c = catalogo.categoria(p.categoria);
    const vistas = catalogo.vistasDe(p);
    const total = catalogo.totalOpiniones(p);
    const MAX = VT.carrito.MAX;

    // ---------- SEO dinámico ----------
    document.title = `${p.nombre} | VITALIA`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = `${p.nombre}: ${p.resumen} Producto de demostración de la tienda conceptual VITALIA.`;
    const can = document.querySelector('link[rel="canonical"]');
    if (can) can.href = `${config.dominio}/pages/producto.html?id=${p.id}`;
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${config.dominio}/` },
        { '@type': 'ListItem', position: 2, name: c.nombre, item: `${config.dominio}/pages/catalogo.html?categoria=${c.id}` },
        { '@type': 'ListItem', position: 3, name: p.nombre }
      ]
    });
    document.head.appendChild(ld);
    ui.setMensajeWhatsapp(config.contacto.mensajeProducto.replace('{producto}', p.nombre));

    // ---------- bloque principal ----------
    const fav = VT.favoritos.tiene(p.id);
    const waLink = u.whatsapp(config.contacto.mensajeProducto.replace('{producto}', p.nombre));
    u.$('#migas').innerHTML = `<li><a href="../index.html">Inicio</a></li><li><a href="catalogo.html?categoria=${c.id}">${esc(c.nombre)}</a></li><li aria-current="page">${esc(p.nombre)}</li>`;

    u.$('.ficha', ficha).outerHTML = `<div class="ficha">
      <div class="galeria" aria-roledescription="galería" aria-label="Imágenes de ${esc(p.nombre)}">
        <div class="galeria-principal" id="galPrincipal" tabindex="0" role="group" aria-label="Imagen ampliable. Usa las flechas para cambiar de imagen y Enter para ampliar.">
          ${vistas.map((v, i) => `<img class="${i === 0 ? 'activa' : 'saliendo'}" src="${u.img(p, v.id, 900)}" srcset="${u.img(p, v.id, 400)} 400w, ${u.img(p, v.id, 900)} 900w" sizes="(min-width: 992px) 52vw, 100vw" alt="${esc(p.nombre)}: ${esc(v.nombre.toLowerCase())}" width="900" height="1125" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} data-i="${i}" ${i ? 'aria-hidden="true"' : ''}>`).join('')}
          <span class="galeria-etiqueta" id="galEtiqueta">${esc(vistas[0].nombre)}</span>
          <button class="icon-btn galeria-flecha prev" type="button" data-gal="-1" aria-label="Imagen anterior"><i class="bi bi-chevron-left" aria-hidden="true"></i></button>
          <button class="icon-btn galeria-flecha next" type="button" data-gal="1" aria-label="Imagen siguiente"><i class="bi bi-chevron-right" aria-hidden="true"></i></button>
          <div class="galeria-btns">
            <button class="icon-btn solo-desktop" type="button" id="galZoom" aria-pressed="false" aria-label="Activar zoom sobre la imagen"><i class="bi bi-zoom-in" aria-hidden="true"></i></button>
            <button class="icon-btn" type="button" id="galAmpliar" aria-label="Ver imagen ampliada"><i class="bi bi-arrows-fullscreen" aria-hidden="true"></i></button>
          </div>
        </div>
        <div class="miniaturas" role="tablist" aria-label="Vistas del producto" id="galMinis">
          ${vistas.map((v, i) => `<button type="button" role="tab" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-i="${i}" aria-label="${esc(v.nombre)}" aria-controls="galPrincipal"><img src="${u.img(p, v.id, 400)}" alt="" width="72" height="90" loading="lazy"></button>`).join('')}
        </div>
      </div>

      <div class="info-prod">
        <p class="card-p-cat"><a href="catalogo.html?categoria=${c.id}">${esc(c.nombre)}</a></p>
        <h1>${esc(p.nombre)}</h1>
        <a class="valoracion text-decoration-none mb-3" href="#opiniones">${u.estrellas(p.valoracion.promedio)}<strong>${u.nota(p.valoracion.promedio)}</strong><span>${total} opiniones de ejemplo</span><span class="visually-hidden">: valoración de demostración. Ir a las opiniones.</span></a>
        <p class="resumen">${esc(p.resumen)}</p>
        <p class="precio">
          <span class="actual">${u.dinero(p.precio)}</span>
          ${p.precioAnterior ? `<del><span class="visually-hidden">Precio anterior de referencia: </span>${u.dinero(p.precioAnterior)}</del>` : ''}
          ${p.etiqueta ? `<span class="card-p-badge position-static ${p.etiqueta === 'Nuevo' ? 'nuevo' : ''}">${esc(p.etiqueta)}</span>` : ''}
        </p>
        <p class="small texto-suave" data-solo-revision>Precio demostrativo en pesos colombianos. IVA y envío según configuración de la tienda real.</p>
        <ul class="ficha-datos">
          <li><span class="k">Presentación</span><span>${esc(p.presentacion)}</span></li>
          <li><span class="k">Disponibilidad</span><span class="disponible">Disponible para pedido de demostración</span></li>
          <li><span class="k">Envío</span><span>Costo y tiempos visibles en el checkout</span></li>
        </ul>
        <div class="compra-acciones">
          <div class="cantidad" role="group" aria-label="Cantidad">
            <button type="button" data-cant="-1" aria-label="Restar una unidad"><i class="bi bi-dash" aria-hidden="true"></i></button>
            <input type="number" inputmode="numeric" id="cantidadFicha" min="1" max="${MAX}" value="1" aria-label="Cantidad">
            <button type="button" data-cant="1" aria-label="Sumar una unidad"><i class="bi bi-plus" aria-hidden="true"></i></button>
          </div>
          <button class="btn-v" type="button" id="btnAgregar" data-add-cart="${p.id}" data-qty-from="#cantidadFicha"><i class="bi bi-bag-plus" aria-hidden="true"></i> Añadir al carrito</button>
          <button class="btn-v btn-sec comprar-ahora" type="button" data-add-cart="${p.id}" data-qty-from="#cantidadFicha" data-ir-a="checkout.html">Comprar ahora</button>
          <button class="btn-fav" type="button" data-fav="${p.id}" aria-pressed="${fav}" aria-label="${fav ? 'Quitar de favoritos' : 'Guardar en favoritos'}: ${esc(p.nombre)}"><i class="bi bi-heart" aria-hidden="true"></i></button>
        </div>
        <p class="error-msg" id="err-cantidad" aria-live="polite"></p>
        <div class="ficha-enlaces">
          <a href="#informacion"><i class="bi bi-card-list" aria-hidden="true"></i> Información completa</a>
          <a href="#etiqueta"><i class="bi bi-card-checklist" aria-hidden="true"></i> Ingredientes y advertencias</a>
          ${waLink ? `<a href="${waLink}" target="_blank" rel="noopener"><i class="bi bi-whatsapp" aria-hidden="true"></i> Preguntar por WhatsApp</a>`
            : (config.modo !== 'publicacion' ? `<button type="button" data-abrir-wa><i class="bi bi-whatsapp" aria-hidden="true"></i> Preguntar por WhatsApp</button>` : '')}
        </div>
        <div class="aviso-ficha"><i class="bi bi-info-circle" aria-hidden="true"></i><p class="m-0">Información demostrativa. Antes de publicar la tienda debe sustituirse por la ficha técnica verificada del fabricante, incluido su registro sanitario. Este producto no es un medicamento.</p></div>
      </div>
    </div>`;

    // ---------- secciones ----------
    const comp = textosComparacion(p);
    const listaIngredientes = p.ingredientes.length ? p.ingredientes : (p.materiales || []);
    const lineas = (arr) => `<ul>${arr.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
    const usoTexto = p.modoUso ? `<p>${esc(p.modoUso)}</p>` : '<p>El modo de uso lo define la etiqueta aprobada del fabricante. No se publica en este prototipo para no difundir instrucciones de consumo sin verificar.</p>';
    const acc = [
      ['descripcion', 'Descripción completa', `<p>${esc(p.descripcion)}</p>`],
      ['composicion', p.ingredientes.length ? 'Ingredientes y composición' : 'Materiales', `${lineas(listaIngredientes)}<p>${esc(p.composicion)}</p>`],
      ['presentacion', 'Presentación', `<p>${esc(p.presentacion)}. Medidas aproximadas: ${esc(p.envase.medida)}.</p>`],
      ['uso', 'Modo de uso', usoTexto],
      ['advertencias', 'Advertencias', lineas(p.advertencias)],
      ['conservacion', 'Conservación', `<p>${esc(p.conservacion)}</p>`],
      ['envios', 'Envíos y devoluciones', `<p>Los métodos y costos de envío se muestran en el checkout antes de confirmar. Las condiciones de cambios y devoluciones están en los <a href="terminos-y-condiciones.html#devoluciones">términos y condiciones</a>. En esta tienda de demostración son condiciones de ejemplo.</p>`]
    ];
    const dist = p.valoracion.distribucion;

    u.$('#fichaSecciones').innerHTML = `
    <section class="seccion" id="etiqueta" aria-labelledby="carTitulo">
      <div class="container-v row g-5 mx-auto px-0">
        <div class="col-lg-6" data-reveal>
          <h2 id="carTitulo">Características del producto</h2>
          <p class="texto-suave medida mb-4">Lo que puedes comprobar al recibirlo y usarlo. Sin promesas de resultados.</p>
          <ul class="beneficios-prod">${p.beneficios.map((b) => `<li><i class="bi bi-${b.icono}" aria-hidden="true"></i><div><h3>${esc(b.titulo)}</h3><p>${esc(b.texto)}</p></div></li>`).join('')}</ul>
        </div>
        <div class="col-lg-5 offset-lg-1" data-reveal>
          <div class="etiqueta-abierta" aria-labelledby="etqTitulo">
            <h3 id="etqTitulo">Etiqueta abierta</h3>
            <p class="sub">${esc(p.nombre)}, ${esc(p.envase.contenido)}</p>
            <div class="regla-gruesa"></div>
            <dl>
              <div><dt>${p.ingredientes.length ? 'Ingredientes' : 'Materiales'}</dt><dd>${esc(listaIngredientes.join(', '))}</dd></div>
              <div><dt>Composición</dt><dd>${esc(p.composicion)}</dd></div>
              <div><dt>Presentación</dt><dd>${esc(p.presentacion)}</dd></div>
              <div><dt>Modo de uso</dt><dd>${p.modoUso ? esc(p.modoUso) : 'Según la etiqueta del fabricante.'}</dd></div>
            </dl>
            <div class="regla-media"></div>
            <dl><div><dt>Advertencias</dt><dd>${lineas(p.advertencias)}</dd></div><div><dt>Conservación</dt><dd>${esc(p.conservacion)}</dd></div></dl>
            <div class="regla-gruesa"></div>
            <p class="pie">Contenido demostrativo: debe reemplazarse por la información verificada del fabricante antes de publicar.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="seccion banda-marfil" aria-labelledby="compTitulo">
      <div class="container-v row g-5 align-items-center mx-auto px-0">
        <div class="col-lg-4" data-reveal>
          <h2 id="compTitulo">${esc(comp.titulo)}</h2>
          <p class="texto-suave">${esc(comp.texto)}</p>
          <p class="small"><i class="bi bi-arrows" aria-hidden="true"></i> Arrastra el control o usa las flechas del teclado para comparar.</p>
        </div>
        <div class="col-lg-8" data-reveal>
          ${comparador(p, comp)}
          <div class="comparador-pie"><p><i class="bi bi-info-circle" aria-hidden="true"></i>${esc(comp.nota)}</p><p>Imágenes ilustrativas</p></div>
        </div>
      </div>
    </section>

    <section class="seccion" id="informacion" aria-labelledby="infoTitulo">
      <div class="container-v row g-5 mx-auto px-0">
        <div class="col-lg-4" data-reveal><h2 id="infoTitulo">Información del producto</h2><p class="texto-suave">Todo lo que normalmente buscarías en la etiqueta, en un solo lugar.</p></div>
        <div class="col-lg-8" data-reveal>${acordeon('accInfo', acc, 0)}</div>
      </div>
    </section>

    <section class="seccion banda-marfil" id="opiniones" aria-labelledby="opTitulo">
      <div class="container-v">
        <div class="sec-head" data-reveal><div><h2 id="opTitulo">Opiniones</h2><p>Valoraciones y comentarios de ejemplo para mostrar el diseño. No provienen de compras reales ni de un sistema de opiniones verificadas.</p></div></div>
        <div class="row g-5">
          <div class="col-lg-5" data-reveal>
            <div class="resumen-opiniones">
              <div><p class="nota-grande m-0">${u.nota(p.valoracion.promedio)}</p>${u.estrellas(p.valoracion.promedio)}<p class="small texto-suave m-0 mt-1">${total} valoraciones de demostración</p></div>
              <ul class="distribucion" aria-label="Distribución de valoraciones">
                ${[5, 4, 3, 2, 1].map((n, i) => `<li><span>${n} ${n === 1 ? 'estrella' : 'estrellas'}</span><span class="barra" aria-hidden="true"><span style="width:${total ? Math.round(dist[i] / total * 100) : 0}%"></span></span><span>${dist[i]}</span></li>`).join('')}
              </ul>
            </div>
          </div>
          <div class="col-lg-7" data-reveal>
            ${p.opiniones.map((o) => `<article class="opinion"><header><strong>${esc(o.nombre)}</strong>${u.estrellas(o.puntuacion)}<span class="visually-hidden">${o.puntuacion} de 5</span><time datetime="${o.fecha}">${u.fecha(o.fecha)}</time><span class="etq-demo">Opinión de ejemplo</span></header><p>${esc(o.texto)}</p></article>`).join('')}
          </div>
        </div>
      </div>
    </section>

    <section class="seccion" aria-labelledby="pfTitulo">
      <div class="container-v row g-5 mx-auto px-0">
        <div class="col-lg-4" data-reveal><h2 id="pfTitulo">Preguntas sobre este producto</h2><p class="texto-suave">Respuestas generales. Para decisiones sobre tu salud, consulta con un profesional.</p></div>
        <div class="col-lg-8" data-reveal>${acordeon('accFaq', p.faq.map((f, i) => [`p${i}`, f.p, `<p>${esc(f.r)}</p>`]), -1)}</div>
      </div>
    </section>

    <section class="seccion banda-salvia" aria-labelledby="relTitulo">
      <div class="container-v">
        <div class="carrusel" data-carrusel>
          <div class="sec-head" data-reveal><div><h2 id="relTitulo">También te puede interesar</h2><p>De la misma categoría y complementos para tu rutina.</p></div>
            <div class="carrusel-ctrl"><button class="icon-btn" type="button" data-prev aria-label="Productos anteriores"><i class="bi bi-arrow-left" aria-hidden="true"></i></button>
            <span class="carrusel-estado" data-estado aria-live="polite"></span>
            <button class="icon-btn" type="button" data-next aria-label="Productos siguientes"><i class="bi bi-arrow-right" aria-hidden="true"></i></button></div></div>
          <div class="carrusel-pista carrusel-productos" tabindex="0" role="region" aria-label="Productos relacionados">${catalogo.relacionados(p, 6).map((r) => ui.tarjeta(r)).join('')}</div>
        </div>
      </div>
    </section>

    <div class="barra-compra" id="barraCompra" aria-hidden="true">
      <div class="nombre"><strong>${esc(p.nombre)}</strong>${u.dinero(p.precio)}</div>
      <button class="btn-v btn-sm" type="button" data-add-cart="${p.id}" data-qty-from="#cantidadFicha" tabindex="-1"><i class="bi bi-bag-plus" aria-hidden="true"></i> Añadir</button>
    </div>

    <div class="modal fade modal-galeria" id="modalGaleria" tabindex="-1" aria-labelledby="modalGalTitulo" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered"><div class="modal-content">
        <div class="modal-header"><h2 class="modal-title h5" id="modalGalTitulo" style="font-family:var(--f-sans);font-weight:600">${esc(p.nombre)}</h2>
          <span class="ms-3 small texto-suave" id="modalGalEstado" aria-live="polite"></span>
          <button type="button" class="btn-cerrar ms-auto" data-bs-dismiss="modal" aria-label="Cerrar vista ampliada"><i class="bi bi-x-lg" aria-hidden="true"></i></button></div>
        <div class="modal-body"><div class="visor">
          <img id="modalGalImg" src="${u.img(p, vistas[0].id, 900)}" alt="" width="900" height="1125">
          <button class="icon-btn galeria-flecha prev" type="button" data-modal-gal="-1" aria-label="Imagen anterior"><i class="bi bi-chevron-left" aria-hidden="true"></i></button>
          <button class="icon-btn galeria-flecha next" type="button" data-modal-gal="1" aria-label="Imagen siguiente"><i class="bi bi-chevron-right" aria-hidden="true"></i></button>
        </div></div>
      </div></div>
    </div>`;

    galeria(p, vistas);
    cantidadFicha();
    comparadorInteractivo();
    barraCompra();
    u.$$('[data-carrusel]').forEach(VT.widgets.carrusel);
    if (VT.anim) VT.anim.tarjetas(u.$('#fichaSecciones'));
    const abrirWa = u.$('[data-abrir-wa]');
    if (abrirWa) abrirWa.addEventListener('click', (e) => { e.stopPropagation(); const b = u.$('#waBtn'); if (b) b.click(); });

    // ---------- piezas ----------
    function acordeon(id, items, abierto) {
      return `<div class="accordion acordeon" id="${id}">${items.map(([k, t, body], i) => `
        <div class="accordion-item"><h3 class="accordion-header" id="h-${id}-${k}"><button class="accordion-button${i === abierto ? '' : ' collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#c-${id}-${k}" aria-expanded="${i === abierto}" aria-controls="c-${id}-${k}">${esc(t)}</button></h3>
        <div id="c-${id}-${k}" class="accordion-collapse collapse${i === abierto ? ' show' : ''}" aria-labelledby="h-${id}-${k}"><div class="accordion-body">${body}</div></div></div>`).join('')}</div>`;
    }

    function textosComparacion(prod) {
      const t = prod.comparacion.tipo;
      if (t === 'textura') return { titulo: 'Textura y acabado', texto: 'Compara cómo se ve el producto antes y después de prepararlo o aplicarlo.', antes: prod.comparacion.antes, despues: prod.comparacion.despues, nota: 'Comparación ilustrativa de la textura. No muestra resultados en la piel ni en el cuerpo.' };
      if (t === 'organizacion') return { titulo: 'Antes y después de organizar', texto: 'Así cambia una repisa cuando cada día tiene su compartimento.', antes: 'Sin organizar', despues: 'Con organizador', nota: 'Escena ilustrativa de organización. No muestra efectos de ningún complemento.' };
      return { titulo: 'Evolución de la presentación', texto: 'Del envase genérico a la presentación actual de VITALIA, con etiqueta completa y materiales reciclables.', antes: 'Presentación anterior', despues: 'Presentación actual', nota: 'Comparación ilustrativa del envase, no de resultados del producto.' };
    }

    /* Comparador antes / después.
     * Para usar fotografías reales, reemplaza los archivos
     *   assets/images/products/<id>/comparar-antes-{700,1200}.webp
     *   assets/images/products/<id>/comparar-despues-{700,1200}.webp
     * por imágenes 4:3 del mismo encuadre, con autorización de uso y sin afirmar
     * resultados de salud, pérdida de peso o cambios físicos no comprobados.
     * Los rótulos salen de products.js (comparacion.antes / comparacion.despues).
     */
    function comparador(prod, txt) {
      const src = (lado, w) => u.url(`assets/images/products/${prod.id}/comparar-${lado}-${w}.webp`);
      return `<div class="comparador" id="comparador">
        <img src="${src('despues', 1200)}" srcset="${src('despues', 700)} 700w, ${src('despues', 1200)} 1200w" sizes="(min-width: 992px) 60vw, 100vw" alt="${esc(txt.despues)}: ${esc(prod.nombre)}" width="1200" height="900" loading="lazy">
        <div class="capa-antes"><img src="${src('antes', 1200)}" srcset="${src('antes', 700)} 700w, ${src('antes', 1200)} 1200w" sizes="(min-width: 992px) 60vw, 100vw" alt="${esc(txt.antes)}: ${esc(prod.nombre)}" width="1200" height="900" loading="lazy"></div>
        <span class="rotulo izq">${esc(txt.antes)}</span><span class="rotulo der">${esc(txt.despues)}</span>
        <span class="divisor" aria-hidden="true"></span><span class="tirador" aria-hidden="true"><i class="bi bi-arrow-left-right"></i></span>
        <label class="visually-hidden" for="comparadorRango">Comparar ${esc(txt.antes.toLowerCase())} y ${esc(txt.despues.toLowerCase())}</label>
        <input type="range" id="comparadorRango" min="0" max="100" value="50" step="1" aria-valuetext="50 % ${esc(txt.antes.toLowerCase())}">
      </div>`;
    }

    function comparadorInteractivo() {
      const cmp = u.$('#comparador'); const r = u.$('#comparadorRango');
      if (!cmp) return;
      const set = () => {
        cmp.style.setProperty('--pos', r.value + '%');
        r.setAttribute('aria-valuetext', `${r.value} % ${comp.antes.toLowerCase()}, ${100 - r.value} % ${comp.despues.toLowerCase()}`);
      };
      r.addEventListener('input', set);
      r.addEventListener('pointerdown', () => cmp.classList.add('arrastrando'));
      window.addEventListener('pointerup', () => cmp.classList.remove('arrastrando'));
      set();
      // Pequeña pista de movimiento al entrar en pantalla (solo si se permiten animaciones)
      if (VT.anim && VT.anim.activo && window.gsap) {
        const o = { v: 50 };
        const pista = window.gsap.timeline({ scrollTrigger: { trigger: cmp, start: 'top 70%', once: true } })
          .to(o, { v: 32, duration: 0.7, ease: 'power2.inOut', onUpdate: () => { r.value = Math.round(o.v); set(); } })
          .to(o, { v: 50, duration: 0.8, ease: 'power2.inOut', onUpdate: () => { r.value = Math.round(o.v); set(); } });
        // La pista nunca compite con el usuario
        ['pointerdown', 'focus', 'keydown'].forEach((ev) => r.addEventListener(ev, () => pista.kill(), { once: true }));
      }
    }

    function galeria(prod, vs) {
      const cont = u.$('#galPrincipal'); const imgs = u.$$('img', cont); const minis = u.$$('#galMinis button');
      const etq = u.$('#galEtiqueta'); const zoomBtn = u.$('#galZoom');
      let i = 0; let zoom = false;
      const ir = (n, foco) => {
        i = (n + vs.length) % vs.length;
        imgs.forEach((im, k) => { im.classList.toggle('activa', k === i); im.classList.toggle('saliendo', k !== i); im.toggleAttribute('aria-hidden', k !== i); });
        minis.forEach((m, k) => { m.setAttribute('aria-selected', String(k === i)); m.tabIndex = k === i ? 0 : -1; });
        if (foco) minis[i].focus();
        etq.textContent = vs[i].nombre;
        setZoom(false);
        actualizarModal();
      };
      const setZoom = (on) => { zoom = on; cont.classList.toggle('zoom', on); if (zoomBtn) { zoomBtn.setAttribute('aria-pressed', String(on)); zoomBtn.setAttribute('aria-label', on ? 'Desactivar zoom' : 'Activar zoom sobre la imagen'); } cont.style.cursor = on ? 'zoom-out' : ''; };
      minis.forEach((m, k) => {
        m.addEventListener('click', () => ir(k));
        m.addEventListener('keydown', (e) => {
          if (['ArrowRight', 'ArrowDown'].includes(e.key)) { e.preventDefault(); ir(i + 1, true); }
          if (['ArrowLeft', 'ArrowUp'].includes(e.key)) { e.preventDefault(); ir(i - 1, true); }
          if (e.key === 'Home') { e.preventDefault(); ir(0, true); }
          if (e.key === 'End') { e.preventDefault(); ir(vs.length - 1, true); }
        });
      });
      cont.addEventListener('click', (e) => {
        const b = e.target.closest('[data-gal]');
        if (b) { ir(i + Number(b.dataset.gal)); return; }
        if (e.target.closest('#galZoom')) { setZoom(!zoom); return; }
        if (e.target.closest('#galAmpliar')) { abrirModal(); return; }
        if (zoom) { setZoom(false); return; }
        // En pantallas táctiles o sin zoom activo: abrir la vista ampliada
        abrirModal();
      });
      cont.addEventListener('mousemove', (e) => {
        if (!zoom) return;
        const r = cont.getBoundingClientRect();
        cont.style.setProperty('--zx', `${((e.clientX - r.left) / r.width) * 100}%`);
        cont.style.setProperty('--zy', `${((e.clientY - r.top) / r.height) * 100}%`);
      });
      cont.addEventListener('mouseleave', () => setZoom(false));
      cont.addEventListener('keydown', (e) => {
        if (e.target !== cont) return;
        if (e.key === 'ArrowRight') { e.preventDefault(); ir(i + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); ir(i - 1); }
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirModal(); }
      });
      // Deslizar en táctil
      let x0 = null;
      cont.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') x0 = e.clientX; });
      cont.addEventListener('pointerup', (e) => {
        if (x0 == null) return; const dx = e.clientX - x0; x0 = null;
        if (Math.abs(dx) > 40) { ir(i + (dx < 0 ? 1 : -1)); cont.dataset.swipe = '1'; setTimeout(() => delete cont.dataset.swipe, 50); }
      });
      cont.addEventListener('click', (e) => { if (cont.dataset.swipe) e.stopImmediatePropagation(); }, true);

      // Modal
      const modalEl = u.$('#modalGaleria'); const mImg = u.$('#modalGalImg'); const mEst = u.$('#modalGalEstado');
      function actualizarModal() {
        mImg.src = u.img(prod, vs[i].id, 900);
        mImg.alt = `${prod.nombre}: ${vs[i].nombre.toLowerCase()}`;
        mEst.textContent = `${vs[i].nombre}, ${i + 1} de ${vs.length}`;
      }
      function abrirModal() {
        actualizarModal();
        if (window.bootstrap) window.bootstrap.Modal.getOrCreateInstance(modalEl).show();
      }
      modalEl.addEventListener('click', (e) => { const b = e.target.closest('[data-modal-gal]'); if (b) ir(i + Number(b.dataset.modalGal)); });
      modalEl.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); ir(i + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); ir(i - 1); }
      });
      modalEl.addEventListener('hidden.bs.modal', () => cont.focus());
    }

    function cantidadFicha() {
      const inp = u.$('#cantidadFicha'); const err = u.$('#err-cantidad');
      const btns = u.$$('[data-cant]');
      const fijar = (v) => {
        let n = Math.floor(Number(v));
        if (!Number.isFinite(n) || n < 1) { n = 1; err.textContent = 'La cantidad mínima es 1.'; }
        else if (n > MAX) { n = MAX; err.textContent = `Puedes llevar hasta ${MAX} unidades por producto.`; }
        else err.textContent = '';
        inp.value = n;
        btns[0].disabled = n <= 1; btns[1].disabled = n >= MAX;
      };
      btns.forEach((b) => b.addEventListener('click', () => fijar(Number(inp.value) + Number(b.dataset.cant))));
      inp.addEventListener('change', () => fijar(inp.value));
      inp.addEventListener('blur', () => fijar(inp.value));
      fijar(1); err.textContent = '';
    }

    function barraCompra() {
      const barra = u.$('#barraCompra'); const objetivo = u.$('#btnAgregar');
      if (!('IntersectionObserver' in window) || !barra) return;
      const mq = window.matchMedia('(max-width: 991.98px)');
      new IntersectionObserver(([e]) => {
        const ver = !e.isIntersecting && e.boundingClientRect.top < 0 && mq.matches;
        barra.classList.toggle('visible', ver);
        barra.setAttribute('aria-hidden', String(!ver));
        barra.querySelector('button').tabIndex = ver ? 0 : -1;
        document.body.classList.toggle('con-barra-compra', ver);
      }).observe(objetivo);
    }
  };
})(window.VT = window.VT || {});
