/* ==========================================================================
   Easypark de Colombia — comportamiento del sitio
   Sin dependencias propias: usa Bootstrap (menú offcanvas) y AOS (entradas)
   si están disponibles; sin ellos el contenido sigue completo.
   1. Datos centralizados  2. Header y menú  3. Plano animado del parqueadero
   4. Formulario  5. Animaciones
   ========================================================================== */
(() => {
  'use strict';

  const SITE = window.SITE || { modo: 'revision', contacto: {}, legal: {}, redes: [], empresa: {} };
  const root = document.documentElement;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const get = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), SITE);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. Datos centralizados ------------------------------------------- */
  root.dataset.mode = SITE.modo === 'publicacion' ? 'publicacion' : 'revision';

  // Texto: data-field="contacto.telefono"
  $$('[data-field]').forEach((el) => {
    const value = get(el.dataset.field);
    if (value) el.textContent = value;
  });
  // Enlace: data-href="tel:contacto.telefonoHref" / "mailto:contacto.correo"
  $$('[data-href]').forEach((el) => {
    const [scheme, path] = el.dataset.href.split(':');
    const value = get(path);
    if (value) el.href = `${scheme}:${value}`;
  });
  // Un elemento con data-requires solo se muestra si el dato existe
  $$('[data-requires]').forEach((el) => {
    if (get(el.dataset.requires)) el.classList.add('is-ready');
  });
  // Un elemento con data-missing solo se muestra si el dato falta
  $$('[data-missing]').forEach((el) => {
    el.hidden = Boolean(get(el.dataset.missing));
  });

  // En publicación, una fila con data-hide-empty se oculta si el dato falta
  if (root.dataset.mode === 'publicacion') {
    $$('[data-hide-empty]').forEach((el) => { el.hidden = !get(el.dataset.hideEmpty); });
  }

  const whatsappUrl = (text) => {
    const number = SITE.contacto && SITE.contacto.whatsapp;
    if (!number || !/^\d{8,15}$/.test(number)) return null;
    return `https://wa.me/${number}?text=${encodeURIComponent(text || SITE.whatsappMensaje || '')}`;
  };
  $$('[data-wa]').forEach((el) => {
    const url = whatsappUrl(el.dataset.wa || SITE.whatsappMensaje);
    if (!url) return;
    el.href = url;
    el.target = '_blank';
    el.rel = 'noopener';
  });

  const hasContact = Object.values(SITE.contacto || {}).some(Boolean);
  $$('[data-contact-empty]').forEach((el) => { el.hidden = hasContact; });

  // Política de privacidad: URL aprobada si existe; si no, el borrador local
  if (SITE.legal && SITE.legal.privacidad) {
    $$('[data-legal="privacidad"]').forEach((a) => { a.href = SITE.legal.privacidad; });
  }

  const social = $('[data-social]');
  if (social && Array.isArray(SITE.redes) && SITE.redes.length) {
    SITE.redes.forEach(({ red, url, icono }) => {
      if (!/^https:\/\//.test(url || '')) return;
      const li = document.createElement('li');
      const a = document.createElement('a');
      const i = document.createElement('i');
      a.href = url; a.target = '_blank'; a.rel = 'noopener';
      a.setAttribute('aria-label', `${red} (se abre en otra pestaña)`);
      i.className = `bi bi-${String(icono || 'link-45deg').replace(/[^a-z0-9-]/g, '')}`;
      i.setAttribute('aria-hidden', 'true');
      a.append(i); li.append(a); social.append(li);
    });
    social.closest('[data-social-wrap]')?.removeAttribute('hidden');
  }

  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---- 2. Header y menú ------------------------------------------------- */
  const header = $('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Cierra el menú móvil al elegir un enlace a la misma página (anclas)
  const menu = $('#menu');
  if (menu) {
    $$('a', menu).forEach((link) => {
      link.addEventListener('click', () => {
        if (!window.bootstrap) return;
        const instance = window.bootstrap.Offcanvas.getInstance(menu);
        if (instance) instance.hide();
      });
    });
  }

  /* ---- 3. Plano animado del parqueadero ------------------------------- */
  // Ilustración: un vehículo llega, la talanquera sube, el vehículo ocupa un
  // cupo libre y el tablero descuenta un cupo. El HTML ya trae el estado
  // final, así que sin JavaScript o con movimiento reducido no se anima.
  const lot = $('[data-lot]');
  if (lot && !reducedMotion && 'animate' in Element.prototype) {
    const car = $('[data-arriving]', lot);
    const arm = $('[data-arm]', lot);
    const target = $('[data-target-bay]', lot);
    const counter = $('[data-free]', lot);
    const finalFree = Number(counter.textContent);
    const [bx, by] = car.dataset.bay.split(',').map(Number);
    const pose = (x, y, r) => ({ transform: `translate(${x}px, ${y}px) rotate(${r}deg)` });

    counter.textContent = String(finalFree + 1);
    target.classList.add('is-target');
    car.style.transform = pose(-90, 250, 90).transform;

    const run = () => {
      const duration = 4200;
      const drive = car.animate([
        { ...pose(-90, 250, 90), offset: 0 },
        { ...pose(-14, 250, 90), offset: 0.22, easing: 'ease-out' },
        { ...pose(-14, 250, 90), offset: 0.36, easing: 'ease-in-out' },
        { ...pose(bx - 70, 250, 90), offset: 0.72, easing: 'ease-in' },
        { ...pose(bx - 12, 274, 140), offset: 0.86 },
        { ...pose(bx, by, 180), offset: 1, easing: 'ease-out' }
      ], { duration, fill: 'forwards', easing: 'ease-in-out' });
      arm.animate([
        { transform: 'scaleY(1)', offset: 0 },
        { transform: 'scaleY(1)', offset: 0.22 },
        { transform: 'scaleY(.12)', offset: 0.32 },
        { transform: 'scaleY(.12)', offset: 0.6 },
        { transform: 'scaleY(1)', offset: 0.72 },
        { transform: 'scaleY(1)', offset: 1 }
      ], { duration, fill: 'forwards' });
      drive.finished.then(() => {
        counter.textContent = String(finalFree);
        target.classList.remove('is-target');
      }).catch(() => {});
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { io.disconnect(); setTimeout(run, 350); }
      }, { threshold: 0.45 });
      io.observe(lot);
    } else {
      run();
    }
  }

  /* ---- 4. Formulario ---------------------------------------------------- */
  const form = $('#form-cotizacion');
  if (form) initForm(form);

  function initForm(f) {
    const status = $('#form-status');
    const submit = $('button[type="submit"]', f);
    const services = { operacion: 'operacion', acceso: 'acceso', pagos: 'pagos', soporte: 'soporte' };
    const pre = new URLSearchParams(location.search).get('servicio');
    if (pre && services[pre]) f.elements.servicio.value = services[pre];

    const rules = {
      nombre: (v) => (v.trim().length >= 3 ? '' : 'Escriba su nombre y apellido.'),
      correo: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Escriba un correo válido, por ejemplo nombre@empresa.com.'),
      telefono: (v) => (/^[+\d][\d\s-]{6,17}$/.test(v.trim()) ? '' : 'Escriba un teléfono de 7 a 15 dígitos.'),
      empresa: (v) => (v.trim().length >= 2 ? '' : 'Escriba el nombre de la empresa o del inmueble.'),
      ciudad: (v) => (v.trim().length >= 3 ? '' : 'Indique la ciudad o el municipio.'),
      tipo: (v) => (v ? '' : 'Elija el tipo de inmueble.'),
      cupos: (v) => (!v || (Number.isInteger(Number(v)) && Number(v) > 0 && Number(v) < 100000) ? '' : 'Escriba el número aproximado de cupos, solo números.'),
      mensaje: (v) => (v.trim().length >= 15 ? '' : 'Cuéntenos un poco más de su necesidad (mínimo 15 caracteres).'),
      privacidad: (_, input) => (input.checked ? '' : 'Debe aceptar el tratamiento de datos para enviar la solicitud.')
    };

    function setError(name, message) {
      const input = f.elements[name];
      const box = $(`#err-${name}`);
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (box) {
        box.innerHTML = message ? `<i class="bi bi-exclamation-circle" aria-hidden="true"></i><span></span>` : '';
        if (message) box.querySelector('span').textContent = message;
        box.classList.toggle('is-visible', Boolean(message));
      }
    }
    function validate(name) {
      const input = f.elements[name];
      const message = rules[name](input.value || '', input);
      setError(name, message);
      return !message;
    }
    Object.keys(rules).forEach((name) => {
      const input = f.elements[name];
      input.addEventListener('blur', () => { if (input.value || input.getAttribute('aria-invalid') === 'true') validate(name); });
      input.addEventListener('change', () => { if (input.getAttribute('aria-invalid') === 'true') validate(name); });
    });

    function showStatus(tone, html) {
      status.className = `form-status is-visible is-${tone}`;
      status.innerHTML = html;
      status.focus();
    }
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    function summary(data) {
      const labelOf = (name) => {
        const sel = f.elements[name];
        return sel && sel.selectedOptions && sel.selectedOptions[0] ? sel.selectedOptions[0].textContent.trim() : '';
      };
      return [
        `Solicitud de propuesta — ${SITE.empresa.nombre}`,
        `Nombre: ${data.nombre}`,
        `Empresa o inmueble: ${data.empresa}`,
        data.cargo ? `Cargo: ${data.cargo}` : null,
        `Correo: ${data.correo}`,
        `Teléfono: ${data.telefono}`,
        `Ciudad: ${data.ciudad}`,
        `Tipo de inmueble: ${labelOf('tipo')}`,
        data.cupos ? `Cupos aproximados: ${data.cupos}` : null,
        data.servicio ? `Servicio: ${labelOf('servicio')}` : null,
        `Mensaje: ${data.mensaje}`
      ].filter(Boolean).join('\n');
    }

    let busy = false;
    f.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (busy) return;
      const invalid = Object.keys(rules).filter((name) => !validate(name));
      if (invalid.length) {
        showStatus('error', `<p>Revise ${invalid.length === 1 ? 'el campo marcado' : `los ${invalid.length} campos marcados`} antes de enviar.</p>`);
        f.elements[invalid[0]].focus();
        return;
      }
      if (f.elements.sitio_web.value) return; // trampa para bots

      const data = Object.fromEntries(new FormData(f).entries());
      delete data.sitio_web;
      busy = true;
      submit.disabled = true;
      const original = submit.innerHTML;
      submit.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Enviando…';

      try {
        if (SITE.formEndpoint) {
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 12000);
          const res = await fetch(SITE.formEndpoint, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data), signal: ctrl.signal
          });
          clearTimeout(timer);
          if (!res.ok) throw new Error(String(res.status));
          showStatus('ok', '<p><strong>Solicitud enviada.</strong> Recibimos sus datos. La empresa le responderá por correo o teléfono.</p>');
          f.reset();
        } else {
          // Sin destino configurado: nada se envía. Se ofrecen los canales que existan.
          const text = summary(data);
          const wa = whatsappUrl(text);
          const mail = SITE.contacto && SITE.contacto.correo;
          const actions = [
            wa ? `<a class="btn-site btn-primary-site" href="${esc(wa)}" target="_blank" rel="noopener"><i class="bi bi-whatsapp" aria-hidden="true"></i> Enviar por WhatsApp</a>` : '',
            mail ? `<a class="btn-site btn-ghost-site" href="mailto:${esc(mail)}?subject=${encodeURIComponent('Solicitud de propuesta')}&body=${encodeURIComponent(text)}"><i class="bi bi-envelope" aria-hidden="true"></i> Enviar por correo</a>` : ''
          ].join('');
          showStatus('info',
            (root.dataset.mode === 'revision'
              ? '<p><strong>Su solicitud no se ha enviado.</strong> Este sitio es un prototipo y el formulario todavía no está conectado a un correo ni a un CRM.</p>'
              : '<p><strong>Su solicitud no se ha enviado.</strong> El envío en línea no está disponible por ahora.</p>') +
            (actions
              ? `<p>Puede enviar los mismos datos por uno de estos canales:</p><div class="actions">${actions}</div>`
              : '<p>Los datos de contacto de la empresa están pendientes de confirmación. Sus datos no se han guardado.</p>'));
        }
      } catch (err) {
        showStatus('error', '<p><strong>No pudimos enviar la solicitud.</strong> Revise su conexión e inténtelo de nuevo en unos minutos.</p>');
      } finally {
        busy = false;
        submit.disabled = false;
        submit.innerHTML = original;
      }
    });
  }

  /* ---- 5. Animaciones --------------------------------------------------- */
  if (window.AOS && !reducedMotion) {
    window.AOS.init({ once: true, duration: 650, easing: 'ease-out-cubic', offset: 60 });
  } else {
    $$('[data-aos]').forEach((n) => n.removeAttribute('data-aos'));
  }
})();
