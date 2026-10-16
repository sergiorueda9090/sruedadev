/* ==========================================================================
   Comportamiento del sitio. Sin dependencias propias: usa Bootstrap (menú
   offcanvas) y AOS (entradas al hacer scroll) si están disponibles.
   ========================================================================== */
(() => {
  'use strict';

  const SITE = window.SITE || { modo: 'revision', contacto: {}, legal: {}, redes: [] };
  const root = document.documentElement;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const get = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), SITE);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. Modo y datos centralizados ----------------------------------- */
  root.dataset.mode = SITE.modo === 'publicacion' ? 'publicacion' : 'revision';

  // Texto: data-field="contacto.telefono". Enlace: data-href="tel:contacto.telefonoHref"
  $$('[data-field]').forEach((el) => {
    const value = get(el.dataset.field);
    if (value) el.textContent = value;
  });
  $$('[data-href]').forEach((el) => {
    const [scheme, path] = el.dataset.href.split(':');
    const value = get(path);
    if (value) el.href = `${scheme}:${value}`;
  });
  // Un elemento con data-requires solo se muestra si el dato existe
  $$('[data-requires]').forEach((el) => {
    if (get(el.dataset.requires)) el.classList.add('is-ready');
  });

  const wa = SITE.contacto && SITE.contacto.whatsapp;
  $$('[data-wa]').forEach((el) => {
    if (!wa) return;
    el.href = `https://wa.me/${wa}`;
    el.target = '_blank';
    el.rel = 'noopener';
  });

  const hasContact = Object.values(SITE.contacto || {}).some(Boolean);
  $$('[data-contact-empty]').forEach((el) => { el.hidden = hasContact; });

  // Documentos legales: enlace si hay URL; aviso si falta
  Object.entries(SITE.legal || {}).forEach(([key, url]) => {
    $$(`[data-legal="${key}"]`).forEach((a) => {
      if (url) { a.href = url; a.hidden = false; }
    });
    $$(`[data-legal-missing="${key}"]`).forEach((el) => { el.hidden = Boolean(url); });
  });

  const social = $('[data-social]');
  if (social && Array.isArray(SITE.redes) && SITE.redes.length) {
    SITE.redes.forEach(({ red, url, icono }) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = url; a.target = '_blank'; a.rel = 'noopener';
      a.setAttribute('aria-label', `${red} (se abre en otra pestaña)`);
      a.innerHTML = `<i class="bi bi-${icono}" aria-hidden="true"></i>`;
      li.append(a); social.append(li);
    });
    social.hidden = false;
  }

  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---- 2. Navegación ---------------------------------------------------- */
  const menu = $('#menu');
  $$('.main-nav .nav-link, .nav-cta').forEach((link) => {
    link.addEventListener('click', () => {
      if (!menu || !window.bootstrap) return;
      const instance = window.bootstrap.Offcanvas.getInstance(menu);
      if (instance) instance.hide();
    });
  });

  // Enlace activo según la sección visible
  const navLinks = $$('.main-nav .nav-link');
  const sections = navLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => {
          const active = a.getAttribute('href') === `#${entry.target.id}`;
          a.classList.toggle('is-active', active);
          if (active) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => io.observe(s));
  }

  // Los enlaces con data-consulta preseleccionan el tipo de consulta
  const tipo = $('#f-tipo');
  $$('[data-consulta]').forEach((a) => {
    a.addEventListener('click', () => {
      if (tipo && $(`option[value="${a.dataset.consulta}"]`, tipo)) tipo.value = a.dataset.consulta;
    });
  });

  /* ---- 3. Animaciones de entrada --------------------------------------- */
  // Sin AOS (CDN caído) o con movimiento reducido, el contenido queda visible:
  // styles.css solo oculta [data-aos] cuando <html> tiene .aos-ready.
  if (window.AOS && !reducedMotion) {
    root.classList.add('aos-ready');
    window.AOS.init({ duration: 600, easing: 'ease-out-cubic', once: true, offset: 40 });
  } else {
    $$('[data-aos]').forEach((el) => el.removeAttribute('data-aos'));
  }

  /* ---- 4. Formulario ---------------------------------------------------- */
  const form = $('#form-contacto');
  if (!form) return;

  const status = $('[data-form-status]', form);
  const submitBtn = $('[data-submit]', form);
  const submitLabel = $('[data-submit-label]', form);
  const spinner = $('.spinner-border', submitBtn);
  let submitting = false;

  const rules = {
    nombre(v) {
      if (!v) return 'Escribe tu nombre completo.';
      if (v.length < 3) return 'El nombre debe tener al menos 3 caracteres.';
      return '';
    },
    correo(v) {
      if (!v) return 'Escribe tu correo electrónico.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Revisa el correo: debe tener el formato nombre@dominio.com.';
      return '';
    },
    telefono(v) {
      if (!v) return '';
      const digits = v.replace(/[\s\-().]/g, '');
      if (!/^(\+?57)?\d{7,10}$/.test(digits)) return 'Revisa el teléfono: usa entre 7 y 10 dígitos, sin letras.';
      return '';
    },
    tipo(v) { return v ? '' : 'Elige el tipo de consulta.'; },
    mensaje(v) {
      if (!v) return 'Escribe tu mensaje.';
      if (v.length < 10) return 'Cuéntanos un poco más: el mensaje necesita al menos 10 caracteres.';
      return '';
    },
    autorizacion(_, el) { return el.checked ? '' : 'Para enviar la consulta debes autorizar el tratamiento de tus datos.'; }
  };

  const validate = (el) => {
    const rule = rules[el.name];
    if (!rule) return true;
    const msg = rule(el.value.trim(), el);
    const err = $(`#${el.id}-err`);
    if (err) err.textContent = msg;
    if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    return !msg;
  };

  // Validación al salir del campo y corrección en vivo de un campo ya marcado
  $$('input, select, textarea', form).forEach((el) => {
    el.addEventListener('blur', () => { if (el.value || el.dataset.touched) validate(el); el.dataset.touched = '1'; });
    el.addEventListener(el.type === 'checkbox' || el.tagName === 'SELECT' ? 'change' : 'input', () => {
      if (el.getAttribute('aria-invalid') === 'true') validate(el);
    });
  });

  const showStatus = (kind, title, body) => {
    status.className = `form-status form-status--${kind}`;
    status.innerHTML = '';
    const strong = document.createElement('strong');
    strong.textContent = title;
    status.append(strong);
    if (typeof body === 'string') {
      const p = document.createElement('p'); p.textContent = body; status.append(p);
    } else if (body) {
      status.append(body);
    }
    status.hidden = false;
    status.focus({ preventScroll: true });
    status.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
  };

  const setLoading = (on) => {
    submitting = on;
    submitBtn.disabled = on;
    spinner.hidden = !on;
    submitLabel.textContent = on ? 'Enviando…' : 'Enviar solicitud';
  };

  const payload = () => {
    const data = Object.fromEntries(new FormData(form));
    data.autorizacion = form.autorizacion.checked;
    Object.keys(data).forEach((k) => { if (typeof data[k] === 'string') data[k] = data[k].trim(); });
    return data;
  };

  // Sin backend: el mensaje NO se envía y se dice con claridad.
  const notConnected = (data) => {
    const wrap = document.createElement('div');
    const p = document.createElement('p');
    p.textContent = 'Tus datos están completos, pero este formulario todavía no está conectado a un sistema de envío. Tu mensaje no se ha enviado.';
    wrap.append(p);

    const correo = SITE.contacto && SITE.contacto.correo;
    if (correo || wa) {
      const p2 = document.createElement('p');
      p2.style.marginTop = '.5rem';
      p2.append('Puedes enviarlo directamente: ');
      const body = `${data.mensaje}\n\n${data.nombre}${data.empresa ? ` (${data.empresa})` : ''}\n${data.correo}${data.telefono ? `\n${data.telefono}` : ''}`;
      if (correo) {
        const a = document.createElement('a');
        a.href = `mailto:${correo}?subject=${encodeURIComponent('Solicitud de información')}&body=${encodeURIComponent(body)}`;
        a.textContent = 'por correo';
        p2.append(a);
      }
      if (correo && wa) p2.append(' o ');
      if (wa) {
        const a = document.createElement('a');
        a.href = `https://wa.me/${wa}?text=${encodeURIComponent(body)}`;
        a.target = '_blank'; a.rel = 'noopener';
        a.textContent = 'por WhatsApp';
        p2.append(a);
      }
      p2.append('.');
      wrap.append(p2);
    } else {
      const p2 = document.createElement('p');
      p2.style.marginTop = '.5rem';
      p2.textContent = 'Los canales oficiales de contacto se publicarán en esta página cuando la cooperativa los confirme.';
      wrap.append(p2);
    }
    showStatus('info', 'Formulario pendiente de conexión', wrap);
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitting) return;   // protección frente a envíos duplicados

    const fields = $$('input, select, textarea', form).filter((el) => rules[el.name]);
    const invalid = fields.filter((el) => !validate(el));
    if (invalid.length) {
      status.hidden = true;
      invalid[0].focus();
      return;
    }

    const data = payload();
    if (!SITE.formEndpoint) { notConnected(data); return; }

    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(SITE.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      $$('[aria-invalid]', form).forEach((el) => el.removeAttribute('aria-invalid'));
      showStatus('success', 'Solicitud enviada', 'La cooperativa recibió tu consulta y te responderá por el medio que indicaste.');
    } catch (err) {
      showStatus('error', 'No pudimos enviar tu solicitud', 'Revisa tu conexión e inténtalo de nuevo. Tus datos siguen en el formulario.');
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  });
})();
