/* ==========================================================================
   Solar Ingeniería Diseño y Construcciones — comportamiento del sitio
   Sin dependencias propias: usa Bootstrap (menú offcanvas) y AOS (entradas)
   si están disponibles; sin ellos el contenido sigue completo.
   1. Datos centralizados  2. Header y menú  3. Carta solar
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

  /* ---- 3. Carta solar --------------------------------------------------- */
  // Proyección polar equidistante vista desde arriba: norte arriba, este a
  // la derecha, centro = cenit, borde = horizonte. Hora solar aproximada.
  const chart = $('[data-sunchart]');
  if (chart) initSunChart(chart);

  function initSunChart(container) {
    const svg = $('svg', container);
    const NS = 'http://www.w3.org/2000/svg';
    const LAT = Number(get('cartaSolar.latitud')) || 7.12;
    const rad = (d) => (d * Math.PI) / 180;
    const deg = (r) => (r * 180) / Math.PI;
    const C = 150; const R = 120;
    const phi = rad(LAT);

    const dayOfYear = (d) => Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
    const declinationFor = (date) => 23.44 * Math.sin(rad((360 / 365) * (284 + dayOfYear(date))));

    const seasons = {
      hoy: { label: 'Hoy', dec: declinationFor(new Date()) },
      junio: { label: '21 jun', dec: 23.44 },
      equinoccio: { label: 'Equinoccio', dec: 0 },
      diciembre: { label: '21 dic', dec: -23.44 }
    };

    function sunPosition(decDeg, hour) {
      const d = rad(decDeg);
      const H = rad(15 * (hour - 12));
      const sinAlt = Math.sin(phi) * Math.sin(d) + Math.cos(phi) * Math.cos(d) * Math.cos(H);
      const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
      const azS = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(d) * Math.cos(phi));
      const az = (deg(azS) + 180 + 360) % 360; // desde el norte, en sentido horario
      return { alt: deg(alt), az };
    }
    function halfDayHours(decDeg) {
      const x = -Math.tan(phi) * Math.tan(rad(decDeg));
      return deg(Math.acos(Math.max(-1, Math.min(1, x)))) / 15;
    }
    function project(alt, az) {
      const r = (R * (90 - Math.max(alt, 0))) / 90;
      return [C + r * Math.sin(rad(az)), C - r * Math.cos(rad(az))];
    }
    const el = (name, attrs = {}) => {
      const node = document.createElementNS(NS, name);
      Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
      return node;
    };

    // Retícula: horizonte, anillos de 30° y 60°, ejes y puntos cardinales
    svg.setAttribute('viewBox', '0 0 300 300');
    svg.append(el('circle', { cx: C, cy: C, r: R, class: 'horizon' }));
    [60, 30].forEach((alt) => {
      const r = (R * (90 - alt)) / 90;
      svg.append(el('circle', { cx: C, cy: C, r, class: 'grid-line' }));
      const t = el('text', { x: C + 4, y: C - r - 3, class: 'ring-label' });
      t.textContent = `${alt}°`; svg.append(t);
    });
    svg.append(el('line', { x1: C - R, y1: C, x2: C + R, y2: C, class: 'grid-line' }));
    svg.append(el('line', { x1: C, y1: C - R, x2: C, y2: C + R, class: 'grid-line' }));
    [['N', C, C - R - 10], ['S', C, C + R + 20], ['E', C + R + 14, C + 4], ['O', C - R - 14, C + 4]].forEach(([s, x, y]) => {
      const t = el('text', { x, y, 'text-anchor': 'middle', class: 'axis-label' });
      t.textContent = s; svg.append(t);
    });

    // Trayectorias de cada fecha
    const paths = {};
    Object.entries(seasons).forEach(([key, s]) => {
      const h0 = halfDayHours(s.dec);
      const pts = [];
      for (let t = 12 - h0; t <= 12 + h0 + 1e-6; t += h0 / 40) {
        const p = sunPosition(s.dec, t);
        pts.push(project(p.alt, p.az).map((n) => n.toFixed(1)).join(','));
      }
      const path = el('polyline', { points: pts.join(' '), class: 'path' });
      if (key === 'hoy') path.style.display = 'none';
      paths[key] = path;
      svg.append(path);
    });

    const ray = el('line', { class: 'sun-ray', x1: C, y1: C, x2: C, y2: C });
    const halo = el('circle', { class: 'sun-halo', r: 14, cx: C, cy: C });
    const sun = el('circle', { class: 'sun', r: 7, cx: C, cy: C });
    svg.append(ray, halo, sun);

    const range = $('input[type="range"]', container);
    const hourOut = $('[data-hour]', container);
    const altOut = $('[data-alt]', container);
    const azOut = $('[data-az]', container);
    const dayOut = $('[data-daylength]', container);
    const latOut = $$('[data-lat]', container);
    const buttons = $$('[data-season]', container);
    latOut.forEach((n) => { n.textContent = `${LAT.toLocaleString('es-CO', { maximumFractionDigits: 1 })}° N`; });

    const cardinals = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
    const fmtHour = (h) => {
      const hh = Math.floor(h); const mm = Math.round((h - hh) * 60);
      return `${String(hh).padStart(2, '0')}:${String(mm === 60 ? 0 : mm).padStart(2, '0')}`;
    };
    let season = 'hoy';
    let hour = 9.5;

    function draw(h) {
      const s = seasons[season];
      const h0 = halfDayHours(s.dec);
      const clamped = Math.min(Math.max(h, 12 - h0), 12 + h0);
      const p = sunPosition(s.dec, clamped);
      const [x, y] = project(p.alt, p.az);
      sun.setAttribute('cx', x); sun.setAttribute('cy', y);
      halo.setAttribute('cx', x); halo.setAttribute('cy', y);
      ray.setAttribute('x2', x); ray.setAttribute('y2', y);
      const up = h > 12 - h0 && h < 12 + h0 && p.alt > 0.5;
      altOut.innerHTML = up ? `${Math.round(p.alt)}°` : '<small>Bajo el horizonte</small>';
      azOut.innerHTML = up ? `${Math.round(p.az)}°<small>${cardinals[Math.round(p.az / 22.5) % 16]}</small>` : '—';
      hourOut.textContent = fmtHour(h);
      const total = 2 * h0;
      dayOut.textContent = `${Math.floor(total)} h ${String(Math.round((total % 1) * 60)).padStart(2, '0')} min`;
      sun.style.opacity = up ? 1 : 0.25;
      halo.style.opacity = up ? 0.22 : 0;
    }

    function selectSeason(key) {
      season = key;
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.season === key)));
      Object.entries(paths).forEach(([k, p]) => {
        p.classList.toggle('is-active', k === key);
        if (k === 'hoy') p.style.display = key === 'hoy' ? '' : 'none';
      });
      draw(hour);
    }

    buttons.forEach((b) => b.addEventListener('click', () => selectSeason(b.dataset.season)));
    range.addEventListener('input', () => { hour = Number(range.value); draw(hour); });

    // Hora inicial: la actual (dentro del día solar) o media mañana
    const now = new Date();
    const nowH = now.getHours() + now.getMinutes() / 60;
    const target = nowH >= 6.5 && nowH <= 17.5 ? Math.round(nowH * 4) / 4 : 9.5;
    range.value = target;
    selectSeason('hoy');

    // Único momento animado de la página: el sol recorre su arco hasta la hora actual
    if (reducedMotion) { hour = target; draw(hour); return; }
    const start = 6; const duration = 1600; let t0;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (ts) => {
      if (!t0) t0 = ts;
      const k = Math.min((ts - t0) / duration, 1);
      hour = start + (target - start) * ease(k);
      draw(hour);
      if (k < 1) requestAnimationFrame(step); else { hour = target; draw(hour); }
    };
    requestAnimationFrame(step);
  }

  /* ---- 4. Formulario ---------------------------------------------------- */
  const form = $('#form-cotizacion');
  if (form) initForm(form);

  function initForm(f) {
    const status = $('#form-status');
    const submit = $('button[type="submit"]', f);
    const services = { diseno: 'diseno', ingenieria: 'ingenieria', construccion: 'construccion', mantenimiento: 'mantenimiento' };
    const pre = new URLSearchParams(location.search).get('servicio');
    if (pre && services[pre]) f.elements.servicio.value = services[pre];

    const rules = {
      nombre: (v) => (v.trim().length >= 3 ? '' : 'Escriba su nombre y apellido.'),
      correo: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Escriba un correo válido, por ejemplo nombre@empresa.com.'),
      telefono: (v) => (/^[+\d][\d\s-]{6,17}$/.test(v.trim()) ? '' : 'Escriba un teléfono de 7 a 15 dígitos.'),
      municipio: (v) => (v.trim().length >= 3 ? '' : 'Indique el municipio donde está el proyecto.'),
      tipo: (v) => (v ? '' : 'Elija el tipo de proyecto.'),
      consumo: (v) => (!v || (Number(v) > 0 && Number(v) < 10000000) ? '' : 'Escriba el consumo en kWh al mes, solo números.'),
      mensaje: (v) => (v.trim().length >= 15 ? '' : 'Cuéntenos un poco más del proyecto (mínimo 15 caracteres).'),
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
        `Solicitud de cotización — ${SITE.empresa.nombre}`,
        `Nombre: ${data.nombre}`,
        data.empresa ? `Empresa: ${data.empresa}` : null,
        `Correo: ${data.correo}`,
        `Teléfono: ${data.telefono}`,
        `Municipio: ${data.municipio}`,
        `Tipo de proyecto: ${labelOf('tipo')}`,
        data.servicio ? `Servicio: ${labelOf('servicio')}` : null,
        data.consumo ? `Consumo aproximado: ${data.consumo} kWh/mes` : null,
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
          showStatus('ok', '<p><strong>Solicitud enviada.</strong> Recibimos sus datos y le responderemos por correo o teléfono.</p>');
          f.reset();
        } else {
          // Sin destino configurado: nada se envía. Se ofrecen los canales que existan.
          const text = summary(data);
          const wa = whatsappUrl(text);
          const mail = SITE.contacto && SITE.contacto.correo;
          const actions = [
            wa ? `<a class="btn-site btn-primary-site" href="${esc(wa)}" target="_blank" rel="noopener"><i class="bi bi-whatsapp" aria-hidden="true"></i> Enviar por WhatsApp</a>` : '',
            mail ? `<a class="btn-site btn-ghost-site" href="mailto:${esc(mail)}?subject=${encodeURIComponent('Solicitud de cotización')}&body=${encodeURIComponent(text)}"><i class="bi bi-envelope" aria-hidden="true"></i> Enviar por correo</a>` : ''
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
