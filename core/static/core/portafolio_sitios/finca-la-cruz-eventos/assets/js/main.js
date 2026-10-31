/* Utilidades compartidas por las tres demos y el portafolio (window.EV).
 * Script clásico: debe cargarse después de config.js y antes del script de cada página.
 *
 * Convenciones de marcado que resuelve este archivo (<body data-sitio="villaJardin">):
 *   [data-tel="0"]           enlace tel: al teléfono 0 de la configuración
 *   [data-tel-texto="0"]     muestra el teléfono 0 con formato
 *   [data-wa]                enlace a WhatsApp (mensaje en data-wa-msg); se oculta si no hay número
 *   [data-wa-alterno]        se muestra solo cuando NO hay WhatsApp configurado
 *   [data-cfg="clave"]       texto del dato; si está vacío conserva el texto «Por confirmar»
 *   [data-cfg-enlace="clave"] enlace https del dato; se oculta si está vacío
 *   [data-pendiente]         contenido provisional: se oculta en modo 'publicacion'
 *   [data-anio]              año actual
 */
(function () {
  'use strict';

  var CONFIG = window.EVENTOS || {};
  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)');

  function soloDigitos(valor) {
    return String(valor || '').replace(/\D+/g, '');
  }

  function formatoTelefono(numero) {
    var d = soloDigitos(numero);
    return d.length === 10 ? d.slice(0, 3) + ' ' + d.slice(3, 6) + ' ' + d.slice(6) : d;
  }

  function enlaceTel(numero) {
    return 'tel:+57' + soloDigitos(numero);
  }

  function enlaceWhatsApp(numero, texto) {
    var d = soloDigitos(numero);
    if (!d) return '';
    return 'https://wa.me/' + d + (texto ? '?text=' + encodeURIComponent(texto) : '');
  }

  function esHttps(url) {
    try { return new URL(url).protocol === 'https:'; } catch (e) { return false; }
  }

  function datosSitio() {
    var clave = document.body.getAttribute('data-sitio');
    return (clave && CONFIG[clave]) || null;
  }

  function aplicarModo() {
    var modo = CONFIG.modo === 'publicacion' ? 'publicacion' : 'revision';
    document.documentElement.setAttribute('data-modo', modo);
    if (modo === 'publicacion') {
      document.querySelectorAll('[data-pendiente]').forEach(function (el) { el.hidden = true; });
    }
  }

  function aplicarContacto(sitio) {
    if (!sitio) return;
    var telefonos = sitio.telefonos || [];

    document.querySelectorAll('[data-tel]').forEach(function (el) {
      var tel = telefonos[Number(el.getAttribute('data-tel'))];
      if (tel) el.setAttribute('href', enlaceTel(tel.numero));
      else el.hidden = true;
    });
    document.querySelectorAll('[data-tel-texto]').forEach(function (el) {
      var tel = telefonos[Number(el.getAttribute('data-tel-texto'))];
      el.textContent = tel ? formatoTelefono(tel.numero) : 'Por confirmar';
    });

    var hayWhatsApp = soloDigitos(sitio.whatsapp).length >= 10;
    document.querySelectorAll('[data-wa]').forEach(function (el) {
      if (!hayWhatsApp) { el.hidden = true; return; }
      el.setAttribute('href', enlaceWhatsApp(sitio.whatsapp, el.getAttribute('data-wa-msg') || sitio.mensajeWhatsapp));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    });
    document.querySelectorAll('[data-wa-alterno]').forEach(function (el) { el.hidden = hayWhatsApp; });

    document.querySelectorAll('[data-cfg]').forEach(function (el) {
      var valor = sitio[el.getAttribute('data-cfg')];
      if (valor) {
        el.textContent = valor;
        el.removeAttribute('data-pendiente');
        el.classList.remove('dato-pendiente');
      }
    });
    document.querySelectorAll('[data-cfg-enlace]').forEach(function (el) {
      var url = sitio[el.getAttribute('data-cfg-enlace')];
      if (url && esHttps(url)) el.setAttribute('href', url);
      else el.hidden = true;
    });
  }

  /* Cabecera: sombra al desplazarse y cierre del menú móvil al elegir un enlace. */
  function iniciarCabecera() {
    var cabecera = document.querySelector('[data-cabecera]');
    if (!cabecera) return;
    var marcar = function () { cabecera.classList.toggle('is-scrolled', window.scrollY > 24); };
    marcar();
    window.addEventListener('scroll', marcar, { passive: true });

    var menu = cabecera.querySelector('.navbar-collapse');
    if (menu && window.bootstrap) {
      menu.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function () {
          if (menu.classList.contains('show')) window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
        });
      });
    }
  }

  /* Botón flotante: aparece cuando el hero sale de la vista para no duplicar su CTA. */
  function iniciarFlotante() {
    var flotantes = document.querySelectorAll('[data-flotante]');
    var hero = document.querySelector('[data-hero]');
    var mostrar = function (visible) {
      flotantes.forEach(function (el) { el.classList.toggle('is-visible', visible); });
    };
    if (!flotantes.length) return;
    if (!hero || !('IntersectionObserver' in window)) { mostrar(true); return; }
    new IntersectionObserver(function (entradas) {
      mostrar(!entradas[0].isIntersecting);
    }, { threshold: 0.05 }).observe(hero);
  }

  /* Si una foto no carga, se muestra un fondo neutro con su texto alternativo. */
  function vigilarImagenes() {
    document.addEventListener('error', function (e) {
      var img = e.target;
      if (!img || img.tagName !== 'IMG' || img.classList.contains('img-fallida')) return;
      img.classList.add('img-fallida');
      var marco = img.parentElement;
      if (marco) {
        marco.classList.add('marco-fallido');
        marco.setAttribute('data-alt', img.alt || 'Imagen no disponible');
      }
    }, true);
  }

  /* ---------- Formularios ---------- */

  function telefonoValido(valor) {
    var d = soloDigitos(valor);
    if (d.indexOf('57') === 0 && d.length === 12) d = d.slice(2);
    return d.length === 10 && /^(3|60)/.test(d);
  }

  function hoyISO() {
    var h = new Date();
    h.setMinutes(h.getMinutes() - h.getTimezoneOffset());
    return h.toISOString().slice(0, 10);
  }

  function fechaLegible(iso) {
    var p = String(iso || '').split('-').map(Number);
    if (p.length !== 3 || !p[0]) return '';
    return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  function marcarCampo(campo, mensaje) {
    var idError = campo.id + '-error';
    var error = document.getElementById(idError);
    if (error) error.textContent = mensaje;
    if (mensaje) campo.setAttribute('aria-invalid', 'true');
    else campo.removeAttribute('aria-invalid');
    var descritos = (campo.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
    if (descritos.indexOf(idError) === -1 && error) {
      descritos.push(idError);
      campo.setAttribute('aria-describedby', descritos.join(' '));
    }
  }

  /* reglas: { nombreDelCampo: function (valor, campo) { return 'mensaje de error' | '' } }
   * Devuelve true si todo es válido; si no, enfoca el primer campo con error. */
  function validar(formulario, reglas) {
    var primero = null;
    Object.keys(reglas).forEach(function (nombre) {
      var campo = formulario.elements[nombre];
      if (!campo) return;
      var mensaje = reglas[nombre](String(campo.value || '').trim(), campo) || '';
      marcarCampo(campo, mensaje);
      if (mensaje && !primero) primero = campo;
    });
    if (primero) primero.focus();
    return !primero;
  }

  /* Revalida un campo al salir de él una vez que ya mostró un error. */
  function revalidarAlEditar(formulario, reglas) {
    Object.keys(reglas).forEach(function (nombre) {
      var campo = formulario.elements[nombre];
      if (!campo || !campo.addEventListener) return;
      var revisar = function () {
        if (campo.getAttribute('aria-invalid') === 'true') {
          marcarCampo(campo, reglas[nombre](String(campo.value || '').trim(), campo) || '');
        }
      };
      campo.addEventListener('input', revisar);
      campo.addEventListener('change', revisar);
    });
  }

  /* Abre WhatsApp con el mensaje y deja en el formulario un enlace por si el
   * navegador bloqueó la ventana. No envía nada a ningún servidor. */
  function entregarPorWhatsApp(estado, numero, texto) {
    var url = enlaceWhatsApp(numero, texto);
    if (!url) {
      estado.className = 'form-estado is-error';
      estado.textContent = 'El número de WhatsApp de esta demo no está configurado. Llama al teléfono de contacto para cotizar.';
      return false;
    }
    estado.className = 'form-estado is-listo';
    estado.textContent = '';
    var p = document.createElement('p');
    p.textContent = 'Tu mensaje está listo. Se abrirá WhatsApp para que lo revises y lo envíes tú. Si no se abrió, ';
    var a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = 'abre WhatsApp aquí';
    p.appendChild(a);
    p.appendChild(document.createTextNode('.'));
    estado.appendChild(p);
    window.open(url, '_blank', 'noopener');
    return true;
  }

  /* ---------- Movimiento ---------- */

  function puedeAnimar() {
    return !!window.gsap && !reducido.matches;
  }

  function prepararGsap() {
    if (!puedeAnimar()) return false;
    if (window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);
    document.documentElement.classList.add('con-movimiento');
    return true;
  }

  function iniciar() {
    document.documentElement.classList.add('con-js');
    aplicarContacto(datosSitio());
    aplicarModo();
    iniciarCabecera();
    iniciarFlotante();
    document.querySelectorAll('[data-anio]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  vigilarImagenes();

  window.EV = {
    config: CONFIG,
    sitio: datosSitio,
    soloDigitos: soloDigitos,
    formatoTelefono: formatoTelefono,
    enlaceTel: enlaceTel,
    enlaceWhatsApp: enlaceWhatsApp,
    telefonoValido: telefonoValido,
    hoyISO: hoyISO,
    fechaLegible: fechaLegible,
    validar: validar,
    revalidarAlEditar: revalidarAlEditar,
    entregarPorWhatsApp: entregarPorWhatsApp,
    puedeAnimar: puedeAnimar,
    prepararGsap: prepararGsap
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
