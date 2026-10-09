/* =========================================================
   F & A — interacciones del sitio. Sin librerias externas.
   ========================================================= */
(function () {
    'use strict';

    /* --- Respaldo del logo ---
       Antes esto era un onerror="" en el HTML, pero la Content Security Policy
       estricta no ejecuta manejadores en linea. Se comprueba tanto el evento
       'error' como el estado de las imagenes que ya terminaron de cargar antes
       de que corriera este script. */
    (function respaldoLogo() {
        function fallar(img) {
            var contenedor = img.closest('.' + img.getAttribute('data-respaldo'));
            if (contenedor) { contenedor.classList.add('sin-logo'); }
            img.remove();
        }
        document.querySelectorAll('img[data-respaldo]').forEach(function (img) {
            if (img.complete) {
                if (img.naturalWidth === 0) { fallar(img); }
                return;
            }
            img.addEventListener('error', function () { fallar(img); });
        });
    })();

    /* --- Cabecera con fondo al hacer scroll --- */
    var cabecera = document.getElementById('cabecera');
    var btnArriba = document.getElementById('btn-arriba');

    /* La version anterior leia window.scrollY y hacia classList.toggle en el
       mismo manejador, en CADA evento de scroll. Como .fija cambia la altura del
       logo, cada toggle invalidaba la maqueta y la lectura siguiente obligaba al
       navegador a recalcularla en el acto: PageSpeed lo marcaba como
       "Redistribucion forzada", 85 ms en movil.

       Dos cambios: la lectura se hace dentro de requestAnimationFrame (el
       momento del fotograma en que la maqueta ya esta al dia, asi que leer no
       cuesta nada), y solo se escribe cuando el estado cambia de verdad, no en
       cada pixel de scroll. */
    var pendiente = false;
    var estadoFija = null;
    var estadoArriba = null;

    function alScroll() {
        if (pendiente) { return; }
        pendiente = true;
        window.requestAnimationFrame(function () {
            pendiente = false;
            var y = window.scrollY;

            var fija = y > 40;
            if (cabecera && fija !== estadoFija) {
                estadoFija = fija;
                cabecera.classList.toggle('fija', fija);
            }

            var arriba = y > 600;
            if (btnArriba && arriba !== estadoArriba) {
                estadoArriba = arriba;
                btnArriba.classList.toggle('visible', arriba);
            }
        });
    }
    window.addEventListener('scroll', alScroll, { passive: true });
    alScroll();

    if (btnArriba) {
        btnArriba.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* --- Menu movil --- */
    var hamburguesa = document.getElementById('hamburguesa');
    var menu = document.getElementById('menu');

    if (hamburguesa && menu) {
        hamburguesa.addEventListener('click', function () {
            var abierto = menu.classList.toggle('abierto');
            hamburguesa.classList.toggle('abierta', abierto);
            hamburguesa.setAttribute('aria-expanded', String(abierto));
            document.body.style.overflow = abierto ? 'hidden' : '';
        });

        // Cerrar al elegir una opcion
        menu.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                menu.classList.remove('abierto');
                hamburguesa.classList.remove('abierta');
                hamburguesa.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    /* --- Aparicion progresiva de secciones --- */
    var animables = document.querySelectorAll('.aparece');

    if ('IntersectionObserver' in window) {
        var observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    observador.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        // El escalonado se calcula por contenedor, no sobre la lista global: así
        // cada rejilla empieza a contar desde cero y las tarjetas de una misma
        // fila entran una detrás de otra, no en un orden arbitrario.
        var contadores = new Map();
        animables.forEach(function (el) {
            var grupo = el.parentNode;
            var n = contadores.get(grupo) || 0;
            contadores.set(grupo, n + 1);
            el.style.transitionDelay = Math.min(n, 5) * 90 + 'ms';
            observador.observe(el);
        });
    } else {
        animables.forEach(function (el) { el.classList.add('visible'); });
    }

    /* --- Brillo que sigue al cursor en las tarjetas de servicio y en los planes --- */
    document.querySelectorAll('.tarjeta, .plan').forEach(function (t) {
        t.addEventListener('mousemove', function (ev) {
            var r = t.getBoundingClientRect();
            t.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
            t.style.setProperty('--my', (ev.clientY - r.top) + 'px');
        });
    });

    /* =====================================================================
       Videos de fondo de seccion, en bucle SIN COSTURA (Servicios y Precios).

       El problema: `<video loop>` corta en seco al llegar al final y vuelve al
       primer fotograma. Si el clip no empalma exactamente, se ve un salto cada
       vuelta.

       La solucion: dos <video> con el mismo clip, superpuestos. Cuando el que
       se esta viendo se acerca al final, el otro arranca desde cero y se cruzan
       con un fundido. El final se disuelve en el principio, asi que el
       movimiento nunca se detiene ni da un tiron.

       OJO con el selector: tiene que ser `.fondo-video[data-video]` y en
       PLURAL. Con `querySelector('[data-video]')` cogia el primer elemento del
       documento con ese atributo, que es el video del hero, y el resultado era
       que el hero acababa con tres <video> encima y Servicios con ninguno: su
       clip no llegaba a reproducirse nunca y solo se veia el respaldo CSS.

       Cada seccion lleva su propio estado (sus dos capas, su activo/espera), no
       hay variables compartidas entre ellas.

       Cuando NO se descarga el video (son varios MB):
         - en pantallas pequenas, donde ademas suele haber datos moviles
         - con "ahorro de datos" activado en el navegador
         - con "reducir movimiento" activado en el sistema
         - si el navegador bloquea la reproduccion automatica
       En todos esos casos se queda el fondo CSS de respaldo de cada seccion.
       ===================================================================== */
    (function videosDeFondo() {
        var cajas = document.querySelectorAll('.fondo-video[data-video]');
        if (!cajas.length) { return; }

        var conexion = navigator.connection || {};
        var noConviene =
            window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
            window.matchMedia('(max-width: 760px)').matches ||
            conexion.saveData === true;

        if (noConviene || !('IntersectionObserver' in window)) { return; }

        var FUNDIDO = 1.0;          // segundos (reales) que dura el cruce

        cajas.forEach(function (caja) {
            var fuente = caja.getAttribute('data-video');
            // Cada clip elige su ritmo desde la plantilla. El de Servicios va
            // acelerado porque se grabo muy lento; el de Precios es una pantalla
            // de interfaz y acelerarla la vuelve nerviosa.
            var VELOCIDAD = parseFloat(caja.getAttribute('data-velocidad')) || 1;
            var videos = null;
            var activo, espera, cruzando = false;

            function crearVideo() {
                var v = document.createElement('video');
                v.muted = true;
                v.defaultMuted = true;
                v.playsInline = true;
                // Algunos navegadores solo respetan el atributo, no la propiedad
                v.setAttribute('muted', '');
                v.setAttribute('playsinline', '');
                v.preload = 'auto';
                v.className = 'capa-video';
                v.style.transitionDuration = FUNDIDO + 's';
                v.playbackRate = v.defaultPlaybackRate = VELOCIDAD;
                v.src = fuente;
                caja.appendChild(v);
                return v;
            }

            function cruzar() {
                var dur = activo.duration;
                // `espera` ya no nace con el primero: hasta que exista no hay
                // con quien cruzar, y el clip simplemente sigue su curso.
                if (cruzando || !espera || !dur || isNaN(dur)) { return; }
                // `currentTime` y `duration` van en segundos DEL CLIP, pero el
                // cruce dura FUNDIDO segundos REALES. Al ir mas rapido, esos
                // segundos reales consumen mas metraje, asi que hay que empezar
                // antes: FUNDIDO * VELOCIDAD segundos de clip. Sin este ajuste
                // el video saliente se acaba y se congela antes de terminar el
                // fundido.
                if (activo.currentTime < dur - FUNDIDO * VELOCIDAD) { return; }

                cruzando = true;
                var saliente = activo;

                espera.currentTime = 0;
                var p = espera.play();
                if (p && p.catch) { p.catch(function () {}); }

                espera.classList.add('visible');
                saliente.classList.remove('visible');

                // Se intercambian los papeles: el que entra pasa a ser el activo
                activo = espera;
                espera = saliente;

                setTimeout(function () {
                    saliente.pause();
                    cruzando = false;
                }, FUNDIDO * 1000);
            }

            function iniciar() {
                /* Los dos videos del fundido se creaban a la vez, y como los dos
                   apuntan al MISMO archivo salian dos descargas en paralelo: el
                   navegador no puede servir de cache una respuesta que todavia
                   esta llegando. En el informe de PageSpeed aparecia
                   servicios-fondo.mp4 dos veces, 833 KiB cada una, casi la mitad
                   de todo lo que pesaba la pagina.

                   Ahora el segundo se crea cuando el primero ya se puede
                   reproducir, momento en el que la respuesta esta completa y en
                   cache (los estaticos van con Cache-Control, ver
                   application.properties): la segunda peticion sale del disco y
                   no de la red. El cruce no corre prisa, ocurre al final del
                   clip, varios segundos despues. */
                activo = crearVideo();
                videos = [activo];
                activo.addEventListener('timeupdate', cruzar);

                activo.addEventListener('canplay', function () {
                    var p = activo.play();
                    if (p && p.catch) {
                        p.catch(function () {
                            // Bloqueada: fuera el video, se queda el fondo CSS
                            caja.remove();
                        });
                    }
                    activo.classList.add('visible');
                    caja.classList.add('listo');

                    espera = crearVideo();
                    espera.addEventListener('timeupdate', cruzar);
                    videos.push(espera);
                }, { once: true });

                // Si el archivo no se puede cargar, el fondo CSS sigue ahi
                activo.addEventListener('error', function () { caja.remove(); }, { once: true });
            }

            // No se descarga hasta que la seccion esta cerca, y se pausa cuando
            // se sale de pantalla: ni gasta datos de quien nunca baja hasta
            // aqui, ni consume bateria decodificando algo que nadie mira.
            var vigia = new IntersectionObserver(function (entradas) {
                entradas.forEach(function (e) {
                    if (e.isIntersecting) {
                        if (!videos) { iniciar(); return; }
                        var p = activo.play();
                        if (p && p.catch) { p.catch(function () {}); }
                    } else if (videos) {
                        videos.forEach(function (v) { v.pause(); });
                    }
                });
            }, { rootMargin: '300px 0px' });

            vigia.observe(caja.closest('.seccion') || caja);
        });
    })();

    /* =====================================================================
       Videos simples: el del hero y el fondo de las paginas legales.

       Comparten la misma logica porque hacen lo mismo: un clip en bucle dentro
       de un contenedor, sin el cruce de dos capas que si necesita el fondo de
       Servicios. Para añadir otro, basta con sumar su selector arriba.

       A diferencia del de Servicios, aqui basta con `loop`: el clip se ve
       entero dentro de un marco, no de fondo bajo un texto, y el corte del
       bucle se nota mucho menos. Si algun dia molesta, se le aplica el mismo
       cruce de dos capas que en Servicios.

       NO se descarga con ahorro de datos ni con movimiento reducido.

       Lo de las pantallas pequenas va por contenedor, con `data-movil`: el del
       hero SI se ve en el telefono, porque ahi es la unica imagen del bloque y
       sin el la portada movil queda solo texto. El fondo de las paginas legales
       no: son megas para decorar el fondo de un texto largo que se lee igual
       sin el, y ahi el telefono suele ir con datos.
       ===================================================================== */
    document.querySelectorAll('.hero-video[data-video], .fondo-legal[data-video]')
            .forEach(function (caja) {

        var conexion = navigator.connection || {};
        var movil = window.matchMedia('(max-width: 760px)').matches;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
            conexion.saveData === true ||
            (movil && caja.getAttribute('data-movil') !== 'si')) { return; }

        var v = document.createElement('video');
        v.muted = true;
        v.defaultMuted = true;
        v.loop = true;
        v.playsInline = true;
        v.setAttribute('muted', '');
        v.setAttribute('playsinline', '');
        v.setAttribute('loop', '');
        v.preload = 'auto';
        v.src = caja.getAttribute('data-video');

        v.addEventListener('canplay', function () {
            var p = v.play();
            if (p && p.catch) {
                // Reproduccion bloqueada: se retira y queda el panel de marca
                p.catch(function () { v.remove(); });
            }
            v.classList.add('listo');
        }, { once: true });

        v.addEventListener('error', function () { v.remove(); }, { once: true });

        caja.appendChild(v);

        // Se pausa cuando el hero sale de pantalla: no tiene sentido gastar
        // bateria decodificando algo que quedo tres pantallas mas arriba.
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entradas) {
                entradas.forEach(function (e) {
                    if (e.isIntersecting) {
                        var p = v.play();
                        if (p && p.catch) { p.catch(function () {}); }
                    } else {
                        v.pause();
                    }
                });
            }, { threshold: 0.1 }).observe(caja);
        }
    });

    /* --- Carruseles ---
       Uno solo para todos: el del proceso y el de resenas comparten esta logica.
       Se activa sobre cualquier .carrusel que tenga dentro una .carrusel-pista,
       y las tarjetas son los hijos de la pista, sea cual sea su clase.

       Se apoya en scroll-snap: el navegador se encarga del arrastre y del iman,
       y aqui solo decidimos a que tarjeta ir y cual esta activa. */
    document.querySelectorAll('.carrusel').forEach(function (raiz) {
        var pista = raiz.querySelector('.carrusel-pista');
        var contenedorPuntos = raiz.querySelector('.carrusel-puntos');
        if (!pista || !contenedorPuntos) { return; }

        var tarjetas = Array.prototype.slice.call(pista.children);
        if (!tarjetas.length) { return; }

        // La separacion entre tarjetas se lee del CSS, no de un numero fijo aqui:
        // asi cambiar el `gap` no obliga a tocar el JavaScript.
        function separacion() {
            return parseFloat(window.getComputedStyle(pista).columnGap) || 0;
        }

        var flechas = Array.prototype.slice.call(raiz.querySelectorAll('.carrusel-flecha'));
        var duracion = parseInt(raiz.getAttribute('data-autoplay'), 10) || 4500;
        var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var indice = 0;
        var temporizador = null;
        var movimientoPropio = false;   // true mientras el carrusel se desplaza solo
        var finMovimiento = null;

        raiz.style.setProperty('--duracion', duracion + 'ms');

        /* Cuantas tarjetas caben enteras: define cual es el ultimo indice util.

           El resultado se guarda porque medir es caro: getBoundingClientRect
           obliga al navegador a recalcular la maqueta si algo la invalido antes,
           y esto se llamaba en cada paso del autoplay y en cada flecha. Era el
           segundo "Redistribucion forzada" del informe de PageSpeed.

           Solo cambia si cambia el ancho disponible, asi que la medida se tira a
           la basura al redimensionar (ver el listener de resize de mas abajo) y
           se vuelve a tomar la proxima vez que haga falta. */
        var cachePorVista = 0;

        function olvidarMedidas() { cachePorVista = 0; }

        function porVista() {
            if (cachePorVista) { return cachePorVista; }
            var ancho = tarjetas[0].getBoundingClientRect().width;
            if (!ancho) { return 1; }
            cachePorVista = Math.max(1, Math.round(pista.clientWidth / ancho));
            return cachePorVista;
        }

        function maximo() {
            return Math.max(0, tarjetas.length - porVista());
        }

        function irA(i, suave) {
            indice = Math.min(Math.max(i, 0), maximo());
            // Se marca que el movimiento lo provoca el propio carrusel. Sin esto,
            // el sincronizador de mas abajo lee un scrollLeft que todavia va a
            // medio camino, cree que lo movio la persona y devuelve el indice a
            // donde estaba: el carrusel se quedaba clavado en la primera tarjeta.
            movimientoPropio = true;
            clearTimeout(finMovimiento);
            finMovimiento = setTimeout(function () { movimientoPropio = false; }, 700);

            var destino = tarjetas[indice].offsetLeft - pista.offsetLeft;
            if (suave === false) {
                var previo = pista.style.scrollBehavior;
                pista.style.scrollBehavior = 'auto';
                pista.scrollLeft = destino;
                pista.style.scrollBehavior = previo;
            } else {
                pista.scrollTo({ left: destino, behavior: quieto ? 'auto' : 'smooth' });
            }
            pintar();
        }

        function pintar() {
            tarjetas.forEach(function (t, i) {
                t.classList.toggle('activa', i === indice);
            });
            // Se vuelven a crear los puntos para reiniciar la animacion de avance
            contenedorPuntos.innerHTML = '';
            for (var i = 0; i <= maximo(); i++) {
                (function (n) {
                    var b = document.createElement('button');
                    b.type = 'button';
                    b.className = 'punto-nav' + (n === indice ? ' activo' : '');
                    b.setAttribute('aria-label', 'Ir a la etapa ' + (n + 1));
                    b.setAttribute('aria-selected', String(n === indice));
                    b.setAttribute('role', 'tab');
                    b.addEventListener('click', function () { irA(n); reiniciar(); });
                    contenedorPuntos.appendChild(b);
                })(i);
            }
            flechas.forEach(function (f) {
                var dir = parseInt(f.getAttribute('data-dir'), 10);
                f.disabled = (dir < 0 && indice === 0) || (dir > 0 && indice === maximo());
            });
        }

        function avanzar() {
            irA(indice >= maximo() ? 0 : indice + 1);
        }

        function reiniciar() {
            if (temporizador) { clearInterval(temporizador); }
            if (quieto) { return; }
            temporizador = setInterval(avanzar, duracion);
        }

        function pausar() {
            raiz.classList.add('pausado');
            if (temporizador) { clearInterval(temporizador); temporizador = null; }
        }

        function reanudar() {
            raiz.classList.remove('pausado');
            reiniciar();
        }

        flechas.forEach(function (f) {
            f.addEventListener('click', function () {
                irA(indice + parseInt(f.getAttribute('data-dir'), 10));
                reiniciar();
            });
        });

        /* Pausa mientras el usuario esta mirando o interactuando */
        // OJO: aqui NO hay pausa al pasar el cursor por encima, y es a proposito.
        // La habia, pero el carrusel ocupa casi toda la pantalla en su seccion:
        // al bajar con la rueda del raton el cursor queda encima, asi que se
        // quedaba detenido justo mientras alguien lo estaba mirando. Parecia que
        // no funcionaba.
        //
        // Lo que si se conserva:
        //   - pausa al enfocar con teclado, para que quien navegue con Tab pueda
        //     leer sin que se le mueva el contenido debajo
        //   - pausa cuando la seccion no esta a la vista (no gasta bateria)
        //   - cualquier interaccion manual reinicia el temporizador, asi que
        //     siempre queda un intervalo completo antes del siguiente salto
        raiz.addEventListener('focusin', pausar);
        raiz.addEventListener('focusout', reanudar);

        /* Si arrastra a mano, sincronizamos el indice con donde quedo */
        var esperaScroll = null;
        pista.addEventListener('scroll', function () {
            if (esperaScroll) { clearTimeout(esperaScroll); }
            esperaScroll = setTimeout(function () {
                // Si el desplazamiento lo provoco irA(), no hay nada que sincronizar
                if (movimientoPropio) { return; }
                var ancho = tarjetas[0].getBoundingClientRect().width + separacion();
                var nuevo = Math.round(pista.scrollLeft / ancho);
                if (nuevo !== indice) {
                    // Lo movio la persona arrastrando: se apunta donde quedo y se
                    // reinicia el temporizador, para no quitarle la tarjeta de
                    // delante justo despues de que la puso ahi.
                    indice = Math.min(nuevo, maximo());
                    pintar();
                    reiniciar();
                }
            }, 140);
        }, { passive: true });

        /* Teclado: flechas izquierda y derecha */
        raiz.setAttribute('tabindex', '0');
        raiz.addEventListener('keydown', function (ev) {
            if (ev.key === 'ArrowLeft') { ev.preventDefault(); irA(indice - 1); reiniciar(); }
            if (ev.key === 'ArrowRight') { ev.preventDefault(); irA(indice + 1); reiniciar(); }
        });

        /* Al cambiar el tamaño cambia cuantas caben: recalcular */
        var esperaResize = null;
        window.addEventListener('resize', function () {
            if (esperaResize) { clearTimeout(esperaResize); }
            esperaResize = setTimeout(function () {
                olvidarMedidas();
                irA(Math.min(indice, maximo()), false);
            }, 180);
        });

        /* No gastar ciclos si la sección no está a la vista */
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entradas) {
                entradas.forEach(function (e) {
                    if (e.isIntersecting) { reanudar(); } else { pausar(); }
                });
            }, { threshold: 0.25 }).observe(raiz);
        } else {
            reiniciar();
        }

        pintar();
    });

    /* =====================================================================
       Utilidades de estado asincrono
       ===================================================================== */

    /** Peticion con tiempo limite: sin esto, una red lenta deja el boton girando para siempre. */
    function pedir(url, opciones, milisegundos) {
        opciones = opciones || {};
        var corte = new AbortController();
        var reloj = setTimeout(function () { corte.abort(); }, milisegundos || 12000);
        opciones.signal = corte.signal;
        return fetch(url, opciones).finally(function () { clearTimeout(reloj); });
    }

    /** Traduce un fallo tecnico a algo que el usuario entienda y pueda accionar. */
    function mensajeDeFallo(error, estado) {
        if (estado === 429) {
            return 'Enviaste varias solicitudes seguidas. Espera un momento e inténtalo de nuevo, '
                 + 'o escríbenos por WhatsApp.';
        }
        if (estado >= 500) {
            return 'El problema es de nuestro lado. Vuelve a intentarlo en unos segundos.';
        }
        if (error && error.name === 'AbortError') {
            return 'La conexión está tardando demasiado. Revisa tu internet e inténtalo otra vez.';
        }
        if (!navigator.onLine) {
            return 'Parece que no tienes conexión a internet.';
        }
        return 'No pudimos completar la operación. Inténtalo de nuevo.';
    }

    /* --- Botones de "recargar" de las pantallas de error --- */
    document.querySelectorAll('[data-accion="recargar"]').forEach(function (b) {
        b.addEventListener('click', function () { window.location.reload(); });
    });

    /* =====================================================================
       Formulario de contacto asincrono: enviando / error / exito
       Si el JS falla o esta bloqueado, el formulario sigue funcionando con el
       envio normal del navegador. Por eso se intercepta aqui y no se depende
       de esto para que el sitio sirva.
       ===================================================================== */
    (function formularioAsincrono() {
        var form = document.getElementById('form-contacto');
        if (!form || !window.fetch) { return; }

        var boton = form.querySelector('button[type="submit"]');
        var textoBoton = boton ? boton.innerHTML : '';
        var zonaAviso = document.getElementById('aviso-formulario');

        function limpiarErrores() {
            form.querySelectorAll('.campo.error').forEach(function (c) { c.classList.remove('error'); });
            form.querySelectorAll('.mensaje-error.js').forEach(function (m) { m.remove(); });
            if (zonaAviso) { zonaAviso.innerHTML = ''; }
        }

        function marcarCampo(nombre, texto) {
            var campo = form.querySelector('[name="' + nombre + '"]');
            if (!campo) { return; }
            var contenedor = campo.closest('.campo');
            if (contenedor) { contenedor.classList.add('error'); }
            var span = document.createElement('span');
            span.className = 'mensaje-error js';
            span.textContent = texto;
            (contenedor || campo.parentNode).appendChild(span);
        }

        function cargando(activo) {
            if (!boton) { return; }
            boton.setAttribute('aria-busy', activo ? 'true' : 'false');
            boton.disabled = activo;
            boton.innerHTML = activo
                ? '<span class="girador"></span> Enviando…'
                : textoBoton;
        }

        function mostrarFallo(texto) {
            if (!zonaAviso) { return; }
            zonaAviso.innerHTML =
                '<div class="alerta alerta-fallo" role="alert">'
              + '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/>'
              + '<path d="M12 8v5M12 16h.01" stroke-linecap="round"/></svg>'
              + '<div class="alerta-contenido"><strong>No se pudo enviar</strong>'
              + '<div class="alerta-texto"></div>'
              + '<button type="button" class="btn btn-primario" data-reintentar>Reintentar</button>'
              + '</div></div>';
            zonaAviso.querySelector('.alerta-texto').textContent = texto;
            zonaAviso.querySelector('[data-reintentar]')
                     .addEventListener('click', function () { enviar(); });
            zonaAviso.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        function mostrarExito(texto) {
            form.reset();
            if (!zonaAviso) { return; }
            zonaAviso.innerHTML =
                '<div class="alerta-exito" role="status">'
              + '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0b63f6" '
              + 'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icono-fijo">'
              + '<circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.5 2.5L16 9.5"/></svg>'
              + '<span></span></div>';
            zonaAviso.querySelector('span').textContent = texto;
            zonaAviso.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        function enviar() {
            limpiarErrores();
            cargando(true);

            pedir(form.action, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: new URLSearchParams(new FormData(form))
            }).then(function (r) {
                return r.json().catch(function () { return {}; })
                        .then(function (datos) { return { estado: r.status, datos: datos }; });
            }).then(function (res) {
                cargando(false);
                if (res.estado === 200 && res.datos.ok) {
                    mostrarExito(res.datos.mensaje || '¡Gracias! Recibimos tu solicitud.');
                    return;
                }
                if (res.estado === 400 && res.datos.errores) {
                    Object.keys(res.datos.errores).forEach(function (campo) {
                        marcarCampo(campo, res.datos.errores[campo]);
                    });
                    var primero = form.querySelector('.campo.error');
                    if (primero) { primero.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
                    return;
                }
                mostrarFallo(res.datos.mensaje || mensajeDeFallo(null, res.estado));
            }).catch(function (e) {
                cargando(false);
                mostrarFallo(mensajeDeFallo(e, 0));
            });
        }

        form.addEventListener('submit', function (ev) {
            ev.preventDefault();
            enviar();
        });
    })();

    /* =====================================================================
       Portafolio: camino de reintento.
       El contenido llega pintado desde el servidor. Estos estados solo entran
       en juego si la rejilla llego vacia (por ejemplo, porque la base fallo al
       pintar la pagina): entonces se ofrece reintentar contra /api/proyectos.
       ===================================================================== */
    (function estadoPortafolio() {
        var grid = document.getElementById('grid-proyectos');
        var cargandoBloque = document.getElementById('portafolio-cargando');
        var errorBloque = document.getElementById('portafolio-error');
        var vacioBloque = document.getElementById('portafolio-vacio');
        var botonReintentar = document.getElementById('portafolio-reintentar');
        if (!grid || !cargandoBloque || !errorBloque || !vacioBloque) { return; }

        var filtros = document.getElementById('filtros');

        function mostrar(cual) {
            cargandoBloque.hidden = cual !== 'cargando';
            errorBloque.hidden = cual !== 'error';
            vacioBloque.classList.toggle('oculto', cual !== 'vacio');
            grid.hidden = cual !== 'datos';
            if (filtros) { filtros.hidden = cual !== 'datos'; }
        }

        function tarjeta(p) {
            var a = document.createElement('a');
            a.className = 'proyecto-card aparece visible';
            a.href = '/portafolio/' + p.slug;
            a.setAttribute('data-cat', p.categoria);

            var medio = document.createElement('div');
            medio.className = 'proyecto-img';
            if (p.imagen) {
                var img = document.createElement('img');
                img.src = p.imagen;
                img.alt = p.nombre;
                img.loading = 'lazy';
                medio.appendChild(img);
            } else {
                var ph = document.createElement('div');
                ph.className = 'ph';
                var marca = document.createElement('span');
                marca.textContent = 'F&A';
                ph.appendChild(marca);
                medio.appendChild(ph);
            }

            var cuerpo = document.createElement('div');
            cuerpo.className = 'proyecto-cuerpo';

            var chip = document.createElement('span');
            chip.className = 'chip';
            chip.textContent = p.categoria;

            var titulo = document.createElement('h3');
            titulo.textContent = p.nombre;

            var resumen = document.createElement('p');
            resumen.textContent = p.resumen;

            cuerpo.appendChild(chip);
            cuerpo.appendChild(titulo);
            cuerpo.appendChild(resumen);

            if (p.tecnologias) {
                var stack = document.createElement('div');
                stack.className = 'stack';
                p.tecnologias.split(',').forEach(function (t) {
                    var s = document.createElement('span');
                    s.textContent = t.trim();
                    stack.appendChild(s);
                });
                cuerpo.appendChild(stack);
            }

            a.appendChild(medio);
            a.appendChild(cuerpo);
            return a;
        }

        function cargar() {
            mostrar('cargando');
            pedir('/api/proyectos', { headers: { 'Accept': 'application/json' } })
                .then(function (r) {
                    if (!r.ok) { throw Object.assign(new Error('http'), { estado: r.status }); }
                    return r.json();
                })
                .then(function (datos) {
                    var lista = datos.proyectos || [];
                    if (!lista.length) { mostrar('vacio'); return; }
                    grid.innerHTML = '';
                    lista.forEach(function (p) { grid.appendChild(tarjeta(p)); });
                    mostrar('datos');
                })
                .catch(function (e) {
                    document.getElementById('portafolio-error-texto').textContent =
                        mensajeDeFallo(e, e.estado || 0);
                    mostrar('error');
                });
        }

        if (botonReintentar) { botonReintentar.addEventListener('click', cargar); }

        // Contenido ya pintado por el servidor: no se toca nada.
        if (grid.querySelector('.proyecto-card')) { return; }
        // Rejilla vacia: puede ser que no haya proyectos o que algo fallara.
        // Se intenta una vez contra la API antes de dar por buena la respuesta.
        cargar();
    })();

    /* --- Esqueleto mientras cargan las fotos reales --- */
    document.querySelectorAll('.paso-media img, .proyecto-img img').forEach(function (img) {
        var caja = img.parentNode;
        if (img.complete) { return; }
        caja.classList.add('cargando');
        var quitar = function () { caja.classList.remove('cargando'); };
        img.addEventListener('load', quitar);
        img.addEventListener('error', quitar);
    });

    /* --- Resaltar en el menu la seccion visible --- */
    var secciones = document.querySelectorAll('main section[id]');
    var enlaces = document.querySelectorAll('.menu a[data-ancla]');

    if (secciones.length && enlaces.length && 'IntersectionObserver' in window) {
        var espia = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (e) {
                if (!e.isIntersecting) { return; }
                enlaces.forEach(function (a) {
                    a.style.color = a.getAttribute('data-ancla') === e.target.id ? '#0b63f6' : '';
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        secciones.forEach(function (s) { espia.observe(s); });
    }

})();
