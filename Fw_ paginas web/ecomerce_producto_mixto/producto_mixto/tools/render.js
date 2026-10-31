/* Genera las imágenes de producto de VITALIA a partir de tools/estudio.html.
 * Requiere un servidor en la raíz del proyecto y playwright-core:
 *   python3 -m http.server 8091 &
 *   NODE_PATH=<ruta a node_modules con playwright> node tools/render.js [http://localhost:8091] [id-producto]
 * Escribe PNG temporales en tools/_render/; tools/imagenes.py los convierte a WebP.
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const BASE = process.argv[2] || 'http://localhost:8091';
const SOLO = process.argv[3] || '';
const OUT = path.join(__dirname, '_render');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--headless=new'], ignoreDefaultArgs: ['--headless=old'] });
  const page = await browser.newPage({ viewport: { width: 1300, height: 1300 } });
  page.on('pageerror', (e) => console.error('ERROR', e.message));
  await page.goto(`${BASE}/tools/estudio.html#vitamina-c-zinc/frente`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const { ids, vistas, cats } = await page.evaluate(() => ({
    ids: window.VT.catalogo.productos.map((p) => p.id),
    vistas: ['frente', 'posterior', 'lateral', 'ingredientes', 'entorno', 'presentacion', 'comparar-antes', 'comparar-despues', 'recorte'],
    cats: Object.keys(window.Estudio.grupos)
  }));
  const tomar = async (hash, archivo, transparente) => {
    await page.evaluate((h) => { location.hash = h; }, hash);
    await page.waitForTimeout(60);
    await page.evaluate(() => Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))));
    await page.waitForTimeout(120);
    const el = await page.$('#lienzo');
    await el.screenshot({ path: path.join(OUT, archivo), omitBackground: !!transparente });
  };
  for (const id of ids) {
    if (SOLO && !id.startsWith(SOLO) && SOLO !== 'productos') continue;
    for (const v of vistas) {
      const p = await page.evaluate((i) => window.VT.catalogo.porId(i), id);
      if (v === 'ingredientes' && !p.ingredienteFoto) continue;
      await tomar(`${id}/${v}`, `${id}--${v}.png`, v === 'recorte');
    }
    console.log('ok', id);
  }
  if (!SOLO || SOLO === 'extras') {
    for (const c of cats) await tomar(`categoria/${c}`, `categoria--${c}.png`);
    await tomar('og/og', 'og.png');
    await tomar('heroe/heroe', 'heroe.png', true);
    console.log('ok extras');
  }
  await browser.close();
})();
