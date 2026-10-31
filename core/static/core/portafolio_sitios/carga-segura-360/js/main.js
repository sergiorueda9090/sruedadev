/* =========================================================================
   Carga Segura 360 — comportamiento de la página
   1. Configuración y utilidades
   2. Datos del negocio en la página (nombre, contacto, cobertura, modo)
   3. WhatsApp (botones y botón flotante)
   4. Formulario de cotización (validación + mensaje de WhatsApp)
   5. Navegación, protocolo (pestañas) y pie de página
   6. Animaciones (GSAP, opcionales)
   ========================================================================= */
(function () {
  'use strict';

  /* 1. Configuración y utilidades ---------------------------------------- */
  var cfg = window.BUSINESS_CONFIG || {};
  var modo = cfg.modo === 'publicacion' ? 'publicacion' : 'revision';
  var WA_RE = /^573\d{9}$/;
  var waNumber = WA_RE.test(String(cfg.whatsappNumber || '')) ? cfg.whatsappNumber : '';

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (text != null) n.textContent = text;
    return n;
  }
  function isHttps(url) { return /^https:\/\/[^\s]+$/i.test(String(url || '')); }
  function waLink(text) { return 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(text); }
  function todayISO() {
    var d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }

  /* 2. Datos del negocio ------------------------------------------------- */
  document.documentElement.setAttribute('data-modo', modo);

  if (cfg.businessName) {
    $$('[data-cfg="businessName"]').forEach(function (n) { n.textContent = cfg.businessName; });
  }

  // Contacto: con dato -> enlace; sin dato -> «Por configurar» (revisión) u oculto (publicación).
  var contactos = {
    whatsapp: waNumber ? { text: '+' + waNumber.replace(/^57(\d{3})(\d{3})(\d{4})$/, '57 $1 $2 $3'), href: waLink(cfg.messages && cfg.messages.general || 'Hola') } : null,
    phone: cfg.phone ? { text: cfg.phone, href: 'tel:' + String(cfg.phone).replace(/[^\d+]/g, '') } : null,
    email: cfg.email ? { text: cfg.email, href: 'mailto:' + cfg.email } : null,
    schedule: cfg.schedule ? { text: cfg.schedule } : null,
    address: cfg.address ? { text: cfg.address } : null,
    razonSocial: cfg.legal && cfg.legal.razonSocial ? { text: cfg.legal.razonSocial } : null,
    nit: cfg.legal && cfg.legal.nit ? { text: cfg.legal.nit } : null
  };
  $$('[data-contact]').forEach(function (item) {
    var key = item.getAttribute('data-contact');
    var slot = $('[data-contact-value]', item) || item;
    var dato = contactos[key];
    slot.textContent = '';
    if (dato) {
      var n = dato.href ? el('a', { href: dato.href }, dato.text) : el('span', {}, dato.text);
      if (dato.href && /^https:/.test(dato.href)) { n.target = '_blank'; n.rel = 'noopener'; }
      slot.appendChild(n);
    } else if (modo === 'revision') {
      slot.appendChild(el('span', { 'class': 'pending' }, 'Por configurar'));
    } else {
      item.hidden = true;
    }
  });

  // Redes y condiciones del servicio: solo con URL https válida.
  $$('[data-social]').forEach(function (a) {
    var url = cfg.social && cfg.social[a.getAttribute('data-social')];
    if (isHttps(url)) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; } else { a.closest('li').remove(); }
  });
  $$('[data-social-list]').forEach(function (ul) { if (!ul.children.length) ul.closest('[data-social-wrap]').hidden = true; });
  $$('[data-conditions]').forEach(function (a) {
    if (isHttps(cfg.serviceConditionsUrl)) { a.href = cfg.serviceConditionsUrl; a.target = '_blank'; a.rel = 'noopener'; }
    else if (modo === 'revision') { a.replaceWith(el('span', { 'class': 'pending' }, 'Condiciones del servicio: por configurar')); }
    else { a.closest('li') ? a.closest('li').remove() : a.remove(); }
  });

  // Cobertura: paradas de la ruta (municipios) y destinos regionales.
  var area = Array.isArray(cfg.serviceArea) ? cfg.serviceArea.filter(Boolean) : [];
  $$('[data-coverage]').forEach(function (list) {
    list.textContent = '';
    area.forEach(function (m) {
      var li = el('li', { 'class': 'stop' });
      li.appendChild(el('span', { 'class': 'stop-dot', 'aria-hidden': 'true' }));
      li.appendChild(el('span', { 'class': 'stop-name' }, m));
      list.appendChild(li);
    });
  });
  $$('[data-coverage-text]').forEach(function (n) {
    if (!area.length) return;
    n.textContent = area.length > 1 ? area.slice(0, -1).join(', ') + ' y ' + area[area.length - 1] : area[0];
  });
  var regional = Array.isArray(cfg.regionalDestinations) ? cfg.regionalDestinations.filter(Boolean) : [];
  $$('[data-regional]').forEach(function (box) {
    var list = $('[data-regional-list]', box);
    var empty = $('[data-regional-empty]', box);
    if (regional.length) {
      regional.forEach(function (d) { list.appendChild(el('li', {}, d)); });
      if (empty) empty.remove();
    } else {
      list.remove();
      if (modo === 'publicacion' && box.hasAttribute('data-hide-empty')) box.hidden = true;
    }
  });

  /* 3. WhatsApp ---------------------------------------------------------- */
  // Con número: abre WhatsApp con un mensaje preparado. Sin número: lleva al
  // formulario, que explica que el canal aún no está configurado.
  var formSection = document.getElementById('form-cotizacion');
  formSection = formSection && formSection.closest('section');
  var formAnchor = formSection && formSection.id ? '#' + formSection.id : '#contenido';
  $$('[data-wa]').forEach(function (a) {
    var texto = a.getAttribute('data-wa-text') || (cfg.messages && cfg.messages.general) || 'Hola';
    if (waNumber) {
      a.href = waLink(texto);
      a.target = '_blank';
      a.rel = 'noopener';
    } else {
      a.href = formAnchor;
      a.setAttribute('data-wa-pending', '');
    }
  });

  /* 4. Formulario -------------------------------------------------------- */
  var form = $('#form-cotizacion');
  if (form) {
    var status = $('#form-status');
    var preview = $('#form-preview');
    var fecha = $('input[type="date"]', form);
    if (fecha) fecha.min = todayISO();

    if (!waNumber) {
      var aviso = $('#form-wa-aviso');
      if (aviso) aviso.hidden = false;
    }

    var mensajes = {
      required: 'Este campo es obligatorio.',
      celular: 'Escribe un celular colombiano de 10 dígitos que empiece por 3.',
      fecha: 'La fecha no puede ser anterior a hoy.',
      min: 'Cuéntanos un poco más (mínimo 10 caracteres).'
    };

    function errorDe(campo) {
      var v = campo.value.trim();
      if (campo.required && !v) return mensajes.required;
      if (!v) return '';
      if (campo.getAttribute('data-validate') === 'celular') {
        var digitos = v.replace(/\D/g, '').replace(/^57(?=3\d{9}$)/, '');
        if (!/^3\d{9}$/.test(digitos)) return mensajes.celular;
      }
      if (campo.type === 'date' && v < todayISO()) return mensajes.fecha;
      if (campo.minLength > 0 && v.length < campo.minLength) return mensajes.min;
      return '';
    }

    function marcar(campo, msg) {
      var box = document.getElementById(campo.id + '-error');
      campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (box) box.textContent = msg;
    }

    $$('input, select, textarea', form).forEach(function (campo) {
      if (campo.type === 'checkbox') return;
      campo.addEventListener('blur', function () { if (campo.value.trim()) marcar(campo, errorDe(campo)); });
      campo.addEventListener('input', function () { if (campo.getAttribute('aria-invalid') === 'true') marcar(campo, errorDe(campo)); });
    });

    function construirMensaje() {
      var lineas = [(cfg.messages && cfg.messages.formIntro) || 'Hola, quiero solicitar una cotización:', ''];
      $$('[data-label]', form).forEach(function (campo) {
        var etiqueta = campo.getAttribute('data-label');
        var valor;
        if (campo.type === 'checkbox') valor = campo.checked ? 'Sí' : 'No';
        else if (campo.tagName === 'SELECT') valor = campo.value ? campo.options[campo.selectedIndex].text : '';
        else valor = campo.value.trim();
        if (campo.type === 'date' && valor) {
          var p = valor.split('-');
          valor = p[2] + '/' + p[1] + '/' + p[0];
        }
        if (valor) lineas.push('• ' + etiqueta + ': ' + valor);
      });
      return lineas.join('\n');
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var invalidos = [];
      $$('input, select, textarea', form).forEach(function (campo) {
        if (campo.type === 'checkbox') return;
        var msg = errorDe(campo);
        marcar(campo, msg);
        if (msg) invalidos.push(campo);
      });
      preview.hidden = true;
      if (invalidos.length) {
        status.className = 'form-status is-error';
        status.textContent = invalidos.length === 1
          ? 'Revisa el campo marcado para continuar.'
          : 'Revisa los ' + invalidos.length + ' campos marcados para continuar.';
        invalidos[0].focus();
        return;
      }
      var texto = construirMensaje();
      if (waNumber) {
        window.open(waLink(texto), '_blank', 'noopener');
        status.className = 'form-status is-ok';
        status.textContent = 'Abrimos WhatsApp con tu solicitud. Revísala y envíala desde allí; la cotización llega como respuesta del equipo.';
      } else {
        status.className = 'form-status is-demo';
        status.textContent = 'Solicitud lista. El WhatsApp de la empresa aún no está configurado, así que no se envió nada. Este es el mensaje que se enviaría:';
        $('pre', preview).textContent = texto;
        preview.hidden = false;
      }
    });

    var copiar = $('#form-copy');
    if (copiar) {
      copiar.addEventListener('click', function () {
        var texto = $('pre', preview).textContent;
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(texto).then(function () { copiar.textContent = 'Mensaje copiado'; });
        } else {
          var r = document.createRange();
          r.selectNodeContents($('pre', preview));
          var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
          copiar.textContent = 'Texto seleccionado: cópialo con Ctrl + C';
        }
      });
    }
  }

  /* 5. Navegación y pie -------------------------------------------------- */
  var header = $('.site-header');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Cierra el menú móvil al elegir una sección.
  var menu = $('#menu');
  $$('#menu a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (menu && menu.classList.contains('show') && window.bootstrap) window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
    });
  });

  // Protocolo de buenas prácticas: pestañas accesibles (flechas, Inicio, Fin).
  var tabs = $$('.protocol-tab');
  function activar(tab, foco) {
    tabs.forEach(function (t) {
      var activa = t === tab;
      t.setAttribute('aria-selected', activa ? 'true' : 'false');
      t.tabIndex = activa ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !activa;
    });
    tab.classList.add('is-seen');
    if (foco) tab.focus();
    var panelActivo = document.getElementById(tab.getAttribute('aria-controls'));
    if (panelActivo && window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.gsap.fromTo(panelActivo.children, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out', overwrite: true });
    }
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { activar(tab, false); });
    tab.addEventListener('keydown', function (e) {
      var destino = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') destino = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') destino = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') destino = tabs[0];
      else if (e.key === 'End') destino = tabs[tabs.length - 1];
      if (destino) { e.preventDefault(); activar(destino, true); }
    });
  });

  $$('[data-year]').forEach(function (n) { n.textContent = new Date().getFullYear(); });

  var creditos = $('[data-credits]');
  if (creditos && Array.isArray(window.CREDITOS)) {
    window.CREDITOS.forEach(function (c) {
      var li = el('li');
      li.appendChild(document.createTextNode(c.archivo + ': ' + (c.autor || 'autor no indicado') + ' — '));
      var a = el('a', { href: c.origen, target: '_blank', rel: 'noopener' }, 'ver original');
      li.appendChild(a);
      li.appendChild(document.createTextNode(' (' + c.licencia + ')'));
      creditos.appendChild(li);
    });
  }

  /* 6. Animaciones ------------------------------------------------------- */
  // Opt-in: si GSAP no carga o el usuario prefiere menos movimiento, todo
  // queda visible y estático. Los estados iniciales los pone GSAP, no el CSS.
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap || reduce) return;
  var gsap = window.gsap;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  // Momento principal: el titular y luego el mosaico, pieza por pieza.
  var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-title', { y: 26, opacity: 0, duration: 0.7 })
    .from('.hero-side > *', { y: 16, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.4')
    .from('.hero-mosaic figure', { clipPath: 'inset(0 0 100% 0)', duration: 0.8, stagger: 0.12, ease: 'power2.inOut' }, 0.3);

  if (!window.ScrollTrigger) return;

  gsap.from('.flow li', {
    opacity: 0, y: 18, duration: 0.45, stagger: 0.1, ease: 'power2.out',
    scrollTrigger: { trigger: '.flow', start: 'top 80%', once: true }
  });

  window.addEventListener('load', function () { window.ScrollTrigger.refresh(); });
})();
