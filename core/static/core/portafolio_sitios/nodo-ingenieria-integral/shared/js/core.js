/*
 * Núcleo compartido de las cinco demostraciones.
 * Script clásico (funciona en file://). Expone window.CES.
 * Cada sitio carga: config.js → images/credits.js → shared/js/core.js → js/main.js
 * y llama a CES.init(window.SITE) desde su main.js.
 */
(function () {
  'use strict';

  const CES = {};
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- 1. Utilidades ---------- */

  CES.$ = (selector, context = document) => context.querySelector(selector);
  CES.$$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  CES.filled = (value) => typeof value === 'string' && value.trim() !== '';
  CES.digits = (value) => String(value || '').replace(/\D/g, '');
  CES.prefersReducedMotion = () => reducedMotionQuery.matches;

  CES.isSafeHttpsUrl = (value) => {
    if (!CES.filled(value)) return false;
    try {
      return new URL(value).protocol === 'https:';
    } catch (error) {
      return false;
    }
  };

  /** Crea un elemento: el('a', { href: '#', class: 'x' }, ['texto', otroNodo]) */
  CES.el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (value === null || value === undefined || value === false) return;
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else node.setAttribute(key, value === true ? '' : value);
    });
    [].concat(children).forEach((child) => {
      if (child === null || child === undefined) return;
      node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    });
    return node;
  };

  CES.isRevision = () => document.documentElement.dataset.modo !== 'publicacion';

  /* ---------- 2. Contacto y canales ---------- */

  /** Número en formato internacional sin signos (57 + 10 dígitos para Colombia). */
  CES.whatsappUrl = (numero, texto) => {
    const digits = CES.digits(numero);
    if (digits.length < 10) return '';
    const query = CES.filled(texto) ? `?text=${encodeURIComponent(texto)}` : '';
    return `https://wa.me/${digits}${query}`;
  };

  CES.telHref = (telefono) => {
    const clean = String(telefono || '').replace(/[^\d+]/g, '');
    return clean.length >= 7 ? `tel:${clean}` : '';
  };

  CES.mailHref = (email, subject, body) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ''))) return '';
    const params = new URLSearchParams();
    if (subject) params.set('subject', subject);
    if (body) params.set('body', body);
    const query = params.toString().replace(/\+/g, '%20');
    return `mailto:${email}${query ? `?${query}` : ''}`;
  };

  function hrefForContact(key, value, site) {
    if (key === 'telefono') return CES.telHref(value);
    if (key === 'email') return CES.mailHref(value);
    if (key === 'whatsapp') return CES.whatsappUrl(value, site.whatsappMensaje);
    if (key === 'mapa') return CES.isSafeHttpsUrl(value) ? value : '';
    return '';
  }

  function markPending(node, label) {
    node.classList.add('ces-pending');
    node.textContent = label;
    if (node.tagName === 'A') {
      node.removeAttribute('href');
      node.removeAttribute('target');
    }
  }

  function hideNode(node) {
    const wrap = node.closest('[data-contact-wrap]') || node;
    wrap.hidden = true;
  }

  /**
   * Rellena los elementos [data-contact="telefono|email|whatsapp|direccion|ciudad|horario|mapa"]
   * con site.contacto. Sin dato: «Por configurar» en revisión, oculto en publicación.
   * data-contact-label="texto fijo" conserva el texto del enlace y solo pone el href.
   */
  CES.bindContact = (site) => {
    const contacto = site.contacto || {};
    CES.$$('[data-contact]').forEach((node) => {
      const key = node.dataset.contact;
      const value = contacto[key];
      const href = CES.filled(value) ? hrefForContact(key, value, site) : '';
      const needsHref = node.tagName === 'A';
      const usable = CES.filled(value) && (!needsHref || href);

      if (!usable) {
        if (CES.isRevision()) markPending(node, node.dataset.placeholder || 'Por configurar');
        else hideNode(node);
        return;
      }
      if (needsHref) {
        node.href = href;
        if (/^https:/.test(href)) {
          node.target = '_blank';
          node.rel = 'noopener noreferrer';
        }
      }
      if (!node.hasAttribute('data-contact-label')) node.textContent = value;
    });
  };

  /* ---------- 3. Diálogo genérico (WhatsApp sin número, avisos) ---------- */

  let dialog;
  function ensureDialog() {
    if (dialog) return dialog;
    dialog = CES.el('dialog', { class: 'ces-dialog', 'aria-labelledby': 'ces-dialog-title' });
    const title = CES.el('h2', { class: 'ces-dialog__title', id: 'ces-dialog-title' });
    const body = CES.el('div', { class: 'ces-dialog__body' });
    const close = CES.el('button', { type: 'button', class: 'ces-dialog__close' }, 'Cerrar');
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.append(title, body, close);
    document.body.append(dialog);
    return dialog;
  }

  CES.showDialog = (titleText, nodes, returnFocusTo) => {
    const d = ensureDialog();
    CES.$('.ces-dialog__title', d).textContent = titleText;
    CES.$('.ces-dialog__body', d).replaceChildren(...[].concat(nodes));
    d.addEventListener('close', () => returnFocusTo && returnFocusTo.focus(), { once: true });
    d.showModal();
    CES.$('.ces-dialog__close', d).focus();
  };

  /**
   * Botones [data-whatsapp] (opcional data-whatsapp-text). Con número: enlace wa.me.
   * Sin número: en revisión abre un diálogo con el mensaje preparado; en publicación se ocultan.
   */
  CES.initWhatsAppButtons = (site) => {
    const numero = (site.contacto || {}).whatsapp;
    CES.$$('[data-whatsapp]').forEach((node) => {
      const text = node.dataset.whatsappText || site.whatsappMensaje || '';
      const url = CES.whatsappUrl(numero, text);
      if (url) {
        node.href = url;
        node.target = '_blank';
        node.rel = 'noopener noreferrer';
        return;
      }
      if (!CES.isRevision()) {
        (node.closest('[data-contact-wrap]') || node).hidden = true;
        return;
      }
      node.setAttribute('href', '#whatsapp-sin-configurar');
      node.setAttribute('aria-haspopup', 'dialog');
      node.addEventListener('click', (event) => {
        event.preventDefault();
        CES.showDialog('WhatsApp sin configurar', [
          CES.el('p', {}, 'Este botón abrirá una conversación de WhatsApp con este mensaje ya escrito:'),
          CES.el('blockquote', { class: 'ces-dialog__quote' }, text),
          CES.el('p', { class: 'ces-dialog__note' }, 'Falta el número: se configura en contacto.whatsapp dentro de js/config.js.')
        ], node);
      });
    });
  };

  /* ---------- 4. Modo, canonical, año, créditos ---------- */

  CES.applyMode = (site) => {
    document.documentElement.dataset.modo = site.modo === 'publicacion' ? 'publicacion' : 'revision';
  };

  CES.setCanonical = (site) => {
    if (!CES.isSafeHttpsUrl(site.canonical) || CES.$('link[rel="canonical"]')) return;
    document.head.append(CES.el('link', { rel: 'canonical', href: site.canonical }));
  };

  CES.setYear = () => {
    CES.$$('[data-year]').forEach((node) => { node.textContent = String(new Date().getFullYear()); });
  };

  /** Lista de créditos fotográficos a partir de window.CREDITOS (images/credits.js). */
  CES.renderCredits = (container) => {
    if (!container) return;
    const credits = Array.isArray(window.CREDITOS) ? window.CREDITOS : [];
    if (!credits.length) {
      container.replaceChildren(CES.el('p', {}, 'Sin fotografías de terceros registradas.'));
      return;
    }
    const list = CES.el('ul', { class: 'ces-credits' });
    credits.forEach((item) => {
      const parts = [CES.el('span', { class: 'ces-credits__title' }, item.titulo || item.slot)];
      if (item.autor) parts.push(`, ${item.autor}`);
      if (item.licencia) {
        parts.push(', ');
        parts.push(CES.isSafeHttpsUrl(item.licenciaUrl)
          ? CES.el('a', { href: item.licenciaUrl, target: '_blank', rel: 'noopener noreferrer license' }, item.licencia)
          : item.licencia);
      }
      if (CES.isSafeHttpsUrl(item.fuente)) {
        parts.push('. ');
        parts.push(CES.el('a', { href: item.fuente, target: '_blank', rel: 'noopener noreferrer' }, 'Fuente'));
      }
      if (item.cambios) parts.push(`. ${item.cambios}.`);
      list.append(CES.el('li', {}, parts));
    });
    container.replaceChildren(list);
  };

  /** Texto alternativo registrado en credits.js para un slot. */
  CES.altFor = (slot, fallback = '') => {
    const credits = Array.isArray(window.CREDITOS) ? window.CREDITOS : [];
    const found = credits.find((item) => item.slot === slot);
    return found && found.alt ? found.alt : fallback;
  };

  /* ---------- 5. Header y navegación móvil ---------- */

  CES.initHeader = (selector = '[data-header]') => {
    const header = CES.$(selector);
    if (!header) return;
    const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
  };

  /**
   * Botón [data-nav-toggle][aria-controls="id"] que abre/cierra el panel #id (.is-open).
   * Cierra con Escape, al pulsar un enlace del panel o al pasar a escritorio.
   */
  CES.initNav = () => {
    CES.$$('[data-nav-toggle]').forEach((button) => {
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      if (!panel) return;
      const breakpoint = Number(button.dataset.navBreakpoint || 992);
      const labelOpen = button.dataset.labelOpen || 'Abrir menú';
      const labelClose = button.dataset.labelClose || 'Cerrar menú';

      const setOpen = (open) => {
        panel.classList.toggle('is-open', open);
        button.setAttribute('aria-expanded', String(open));
        button.setAttribute('aria-label', open ? labelClose : labelOpen);
        document.body.classList.toggle('ces-nav-open', open);
      };

      setOpen(false);
      button.addEventListener('click', () => setOpen(!panel.classList.contains('is-open')));
      panel.addEventListener('click', (event) => {
        if (event.target.closest('a')) setOpen(false);
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && panel.classList.contains('is-open')) {
          setOpen(false);
          button.focus();
        }
      });
      window.addEventListener('resize', () => {
        if (window.innerWidth >= breakpoint && panel.classList.contains('is-open')) setOpen(false);
      });
    });
  };

  /** Marca en la navegación el enlace de la sección visible (aria-current="true"). */
  CES.initScrollSpy = (linkSelector = '[data-spy] a[href^="#"]') => {
    const links = CES.$$(linkSelector);
    if (!links.length || !('IntersectionObserver' in window)) return;
    const byId = new Map();
    links.forEach((link) => {
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (target) byId.set(target, link);
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.removeAttribute('aria-current'));
        const active = byId.get(entry.target);
        if (active) active.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    byId.forEach((link, section) => observer.observe(section));
  };

  /* ---------- 6. Animaciones (AOS opcional) ---------- */

  /**
   * <html class="no-aos"> mantiene visible todo lo que tenga data-aos.
   * Solo se retira si AOS cargó y el usuario no pidió movimiento reducido.
   */
  CES.initAOS = (options = {}) => {
    if (!window.AOS || CES.prefersReducedMotion()) return;
    document.documentElement.classList.remove('no-aos');
    window.AOS.init(Object.assign({ once: true, duration: 650, easing: 'ease-out-cubic', offset: 40 }, options));
  };

  /* ---------- 7. Formularios honestos ---------- */

  const MESSAGES = {
    valueMissing: 'Este campo es obligatorio.',
    typeMismatchEmail: 'Escriba un correo válido, por ejemplo nombre@empresa.com.',
    typeMismatch: 'El formato no es válido.',
    patternMismatch: 'El formato no es válido.',
    tooShort: (min) => `Escriba al menos ${min} caracteres.`,
    tooLong: (max) => `Use como máximo ${max} caracteres.`
  };

  function messageFor(field) {
    const v = field.validity;
    if (v.valueMissing) return field.dataset.msgRequired || MESSAGES.valueMissing;
    if (v.typeMismatch) return field.dataset.msgType || (field.type === 'email' ? MESSAGES.typeMismatchEmail : MESSAGES.typeMismatch);
    if (v.patternMismatch) return field.dataset.msgPattern || MESSAGES.patternMismatch;
    if (v.tooShort) return MESSAGES.tooShort(field.minLength);
    if (v.tooLong) return MESSAGES.tooLong(field.maxLength);
    return field.validationMessage;
  }

  function setError(control, errorNode, message) {
    control.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (errorNode) {
      errorNode.textContent = message || '';
      errorNode.hidden = !message;
    }
  }

  function validateField(field) {
    if (field.type === 'checkbox' && field.closest('[data-required-group]')) return true;
    const valid = field.checkValidity();
    setError(field, document.getElementById(`${field.id}-error`), valid ? '' : messageFor(field));
    return valid;
  }

  function validateGroup(group) {
    const checked = CES.$$('input[type="checkbox"]', group).some((input) => input.checked);
    setError(group, document.getElementById(`${group.id}-error`), checked ? '' : (group.dataset.msgRequired || 'Elija al menos una opción.'));
    return checked;
  }

  function formToData(form) {
    const data = {};
    new FormData(form).forEach((value, key) => {
      const text = String(value).trim();
      data[key] = data[key] ? `${data[key]}, ${text}` : text;
    });
    return data;
  }

  function statusParagraphs(status, kind, nodes) {
    status.className = `ces-status is-${kind}`;
    status.replaceChildren(...nodes);
    status.hidden = false;
  }

  function alternativeLinks(site, data, opts) {
    const links = [];
    const contacto = site.contacto || {};
    const text = opts.whatsappText ? opts.whatsappText(data) : '';
    const wa = CES.whatsappUrl(contacto.whatsapp, text);
    if (wa) links.push(CES.el('a', { href: wa, target: '_blank', rel: 'noopener noreferrer', class: 'ces-status__link' }, 'Enviar estos datos por WhatsApp'));
    const mail = CES.mailHref(contacto.email, opts.subject || 'Solicitud desde el sitio web', text);
    if (mail) links.push(CES.el('a', { href: mail, class: 'ces-status__link' }, 'Enviar estos datos por correo'));
    return links;
  }

  /**
   * Valida de forma accesible y nunca simula un envío.
   * - Con site.formEndpoint (https): POST JSON; éxito solo con respuesta 2xx.
   * - Sin endpoint: explica que no se envió nada y ofrece WhatsApp/correo si están configurados.
   * Requisitos de marcado: cada campo con id y un <p id="{id}-error" hidden> enlazado en aria-describedby;
   * grupos de casillas en <fieldset data-required-group id="..."> con su {id}-error; un [data-form-status].
   * opts: { whatsappText(data) => string, subject, successText }
   */
  CES.initForm = (form, site, opts = {}) => {
    if (!form) return;
    form.noValidate = true;
    const status = CES.$('[data-form-status]', form);
    const submit = CES.$('[type="submit"]', form);
    const fields = CES.$$('input, select, textarea', form).filter((f) => f.type !== 'hidden' && f.name);
    const groups = CES.$$('[data-required-group]', form);
    let attempted = false;

    fields.forEach((field) => {
      const handler = () => {
        if (!attempted) return;
        const group = field.closest('[data-required-group]');
        if (group) validateGroup(group);
        else validateField(field);
      };
      field.addEventListener('input', handler);
      field.addEventListener('change', handler);
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      attempted = true;
      const invalid = [];
      fields.forEach((field) => { if (!validateField(field)) invalid.push(field); });
      groups.forEach((group) => { if (!validateGroup(group)) invalid.push(CES.$('input', group)); });

      if (invalid.length) {
        const count = invalid.length;
        if (status) statusParagraphs(status, 'error', [CES.el('p', {}, count === 1 ? 'Revise el campo marcado.' : `Revise los ${count} campos marcados.`)]);
        const first = fields.concat(groups.map((g) => CES.$('input', g))).find((f) => invalid.includes(f));
        (first || invalid[0]).focus();
        return;
      }

      const data = formToData(form);
      const alternatives = alternativeLinks(site, data, opts);

      if (!CES.isSafeHttpsUrl(site.formEndpoint)) {
        const nodes = [CES.el('p', { class: 'ces-status__lead' }, 'Los datos están completos, pero esta página no los envió.')];
        if (alternatives.length) {
          nodes.push(CES.el('p', {}, 'El formulario aún no tiene un canal de envío conectado. Puede enviarlos ahora por:'));
          nodes.push(CES.el('p', { class: 'ces-status__links' }, alternatives));
        } else if (CES.isRevision()) {
          nodes.push(CES.el('p', {}, 'Demostración sin canal configurado: para recibir solicitudes, defina formEndpoint, contacto.whatsapp o contacto.email en js/config.js.'));
        } else {
          nodes.push(CES.el('p', {}, 'Por ahora no es posible enviar solicitudes desde el sitio.'));
        }
        if (status) statusParagraphs(status, 'info', nodes);
        if (status) status.focus();
        return;
      }

      if (submit) {
        submit.disabled = true;
        submit.setAttribute('aria-busy', 'true');
      }
      if (status) statusParagraphs(status, 'info', [CES.el('p', {}, 'Enviando su solicitud…')]);
      try {
        const response = await fetch(site.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(Object.assign({ origen: document.title }, data))
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        form.reset();
        attempted = false;
        if (status) statusParagraphs(status, 'success', [CES.el('p', { class: 'ces-status__lead' }, opts.successText || 'Recibimos su solicitud. Le responderemos por el medio de contacto que indicó.')]);
      } catch (error) {
        const nodes = [CES.el('p', { class: 'ces-status__lead' }, 'No se pudo enviar la solicitud. Sus datos siguen en el formulario.')];
        if (alternatives.length) nodes.push(CES.el('p', { class: 'ces-status__links' }, alternatives));
        else nodes.push(CES.el('p', {}, 'Intente de nuevo en unos minutos.'));
        if (status) statusParagraphs(status, 'error', nodes);
      } finally {
        if (submit) {
          submit.disabled = false;
          submit.removeAttribute('aria-busy');
        }
        if (status) status.focus();
      }
    });
  };

  /* ---------- 8. Visor de galería accesible ---------- */

  /**
   * Botones [data-lightbox-item] dentro de root, con data-src (imagen grande), data-alt y data-caption opcional.
   * Abre un <dialog> con anterior/siguiente (botones y flechas), Escape y retorno del foco.
   */
  CES.initLightbox = (root) => {
    if (!root) return;
    const items = CES.$$('[data-lightbox-item]', root);
    if (!items.length) return;
    let index = 0;
    let opener = null;

    const box = CES.el('dialog', { class: 'ces-lightbox', 'aria-label': 'Visor de imágenes' });
    const figure = CES.el('figure', { class: 'ces-lightbox__figure' });
    const img = CES.el('img', { class: 'ces-lightbox__img', alt: '' });
    const caption = CES.el('figcaption', { class: 'ces-lightbox__caption' });
    const counter = CES.el('p', { class: 'ces-lightbox__counter', 'aria-live': 'polite' });
    const prev = CES.el('button', { type: 'button', class: 'ces-lightbox__nav is-prev', 'aria-label': 'Imagen anterior' }, CES.el('i', { class: 'bi bi-chevron-left', 'aria-hidden': 'true' }));
    const next = CES.el('button', { type: 'button', class: 'ces-lightbox__nav is-next', 'aria-label': 'Imagen siguiente' }, CES.el('i', { class: 'bi bi-chevron-right', 'aria-hidden': 'true' }));
    const close = CES.el('button', { type: 'button', class: 'ces-lightbox__close', 'aria-label': 'Cerrar visor' }, CES.el('i', { class: 'bi bi-x-lg', 'aria-hidden': 'true' }));
    figure.append(img, caption);
    box.append(close, prev, figure, next, counter);
    document.body.append(box);

    const show = (i) => {
      index = (i + items.length) % items.length;
      const item = items[index];
      img.src = item.dataset.src;
      img.alt = item.dataset.alt || '';
      caption.textContent = item.dataset.caption || '';
      caption.hidden = !item.dataset.caption;
      counter.textContent = `${index + 1} de ${items.length}`;
      const single = items.length < 2;
      prev.hidden = single;
      next.hidden = single;
    };

    items.forEach((item, i) => {
      item.addEventListener('click', () => {
        opener = item;
        show(i);
        box.showModal();
        close.focus();
      });
    });
    prev.addEventListener('click', () => show(index - 1));
    next.addEventListener('click', () => show(index + 1));
    close.addEventListener('click', () => box.close());
    box.addEventListener('click', (event) => { if (event.target === box) box.close(); });
    box.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') show(index - 1);
      if (event.key === 'ArrowRight') show(index + 1);
    });
    box.addEventListener('close', () => { if (opener) opener.focus(); });
  };

  /* ---------- 9. Pestañas accesibles ---------- */

  /**
   * [role="tablist"] con [role="tab"][aria-controls]. Flechas según aria-orientation,
   * Inicio/Fin, activación automática. onChange(tab, panel) opcional.
   */
  CES.initTabs = (tablist, onChange) => {
    if (!tablist) return;
    const tabs = CES.$$('[role="tab"]', tablist);
    const vertical = tablist.getAttribute('aria-orientation') === 'vertical';
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const selected = t === tab;
        t.setAttribute('aria-selected', String(selected));
        t.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
      });
      if (focus) tab.focus();
      if (onChange) onChange(tab, document.getElementById(tab.getAttribute('aria-controls')));
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab, false));
      tab.addEventListener('keydown', (event) => {
        const prevKey = vertical ? 'ArrowUp' : 'ArrowLeft';
        const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
        let target = null;
        if (event.key === prevKey) target = tabs[(i - 1 + tabs.length) % tabs.length];
        if (event.key === nextKey) target = tabs[(i + 1) % tabs.length];
        if (event.key === 'Home') target = tabs[0];
        if (event.key === 'End') target = tabs[tabs.length - 1];
        if (target) {
          event.preventDefault();
          select(target, true);
        }
      });
    });
    select(tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0], false);
  };

  /* ---------- 10. Arranque común ---------- */

  CES.init = (site = {}) => {
    CES.applyMode(site);
    CES.setCanonical(site);
    CES.bindContact(site);
    CES.initWhatsAppButtons(site);
    CES.initHeader();
    CES.initNav();
    CES.initScrollSpy();
    CES.renderCredits(CES.$('[data-credits]'));
    CES.setYear();
  };

  window.CES = CES;
})();
