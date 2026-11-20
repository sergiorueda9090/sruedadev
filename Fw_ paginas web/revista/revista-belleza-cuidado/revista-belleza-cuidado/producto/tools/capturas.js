/* Capturas para pages/portafolio.html. Requiere un servidor en la raíz y Playwright:
 *   python3 -m http.server 8091 &
 *   NODE_PATH=<node_modules con playwright> node tools/capturas.js [http://localhost:8091]
 * Escribe PNG en tools/_capturas/; tools/capturas.py los convierte a WebP.
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const BASE = (process.argv[2] || 'http://localhost:8091') + '/';
const OUT = path.join(__dirname, '_capturas');
fs.mkdirSync(OUT, { recursive: true });
const OCULTAR = '.toasts,.wa-flotante{display:none!important}';
const listo = async (p) => { await p.addStyleTag({ content: OCULTAR }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(2600); };
const desplazar = async (p) => { const H = await p.evaluate(() => document.body.scrollHeight); for (let y = 0; y < H; y += 600) { await p.mouse.wheel(0, 600); await p.waitForTimeout(60); } await p.waitForTimeout(800); };

(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--headless=new'], ignoreDefaultArgs: ['--headless=old'] });
  const d = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  let p = await d.newPage();
  await p.goto(BASE + 'index.html', { waitUntil: 'networkidle' }); await listo(p);
  await p.screenshot({ path: path.join(OUT, 'inicio-1440.png') });

  await p.goto(BASE + 'pages/catalogo.html', { waitUntil: 'networkidle' }); await listo(p);
  await (await p.$('#formFiltros')).screenshot({ path: path.join(OUT, 'comp-filtros.png') });
  const card = await p.$('#rejilla .card-p:nth-child(3)'); await card.hover(); await p.waitForTimeout(700);
  await card.screenshot({ path: path.join(OUT, 'comp-tarjeta.png') });

  await p.goto(BASE + 'pages/producto.html?id=vitamina-c-zinc', { waitUntil: 'networkidle' }); await listo(p); await desplazar(p);
  await (await p.$('.etiqueta-abierta')).screenshot({ path: path.join(OUT, 'comp-etiqueta.png') });
  await p.evaluate(() => { const r = document.getElementById('comparadorRango'); r.value = 42; r.dispatchEvent(new Event('input')); });
  await (await p.$('#comparador')).screenshot({ path: path.join(OUT, 'comp-comparador.png') });
  await p.evaluate(() => { VT.carrito.vaciar(); VT.carrito.agregar('vitamina-c-zinc', 2); VT.carrito.agregar('infusion-calma', 1); VT.carrito.agregar('serum-hialuronico', 1); });
  await p.evaluate(() => window.bootstrap.Offcanvas.getOrCreateInstance(document.getElementById('panelCarrito')).show()); await p.waitForTimeout(900);
  await (await p.$('#panelCarrito')).screenshot({ path: path.join(OUT, 'comp-carrito.png') });

  await p.goto(BASE + 'pages/checkout.html', { waitUntil: 'networkidle' }); await listo(p);
  await p.check('input[name="envio"][value="estandar"]');
  await (await p.$('#formCheckout fieldset:nth-of-type(3)')).screenshot({ path: path.join(OUT, 'comp-checkout.png') });
  await p.evaluate(() => VT.carrito.vaciar());
  await d.close();

  const m = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  p = await m.newPage();
  for (const [n, u] of [['movil-inicio', 'index.html'], ['movil-ficha', 'pages/producto.html?id=serum-hialuronico'], ['movil-catalogo', 'pages/catalogo.html']]) {
    await p.goto(BASE + u, { waitUntil: 'networkidle' }); await listo(p);
    if (n === 'movil-catalogo') { await p.evaluate(() => window.scrollTo(0, 330)); await p.waitForTimeout(900); }
    await p.screenshot({ path: path.join(OUT, n + '.png') });
  }
  await b.close();
  console.log('capturas en', OUT);
})();
