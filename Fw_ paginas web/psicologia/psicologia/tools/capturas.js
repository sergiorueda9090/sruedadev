/*
 * Regenera las vistas previas del catálogo (index.html) y las og:image.
 * Requiere un servidor local en la raíz de psicologia/ y Playwright para Node:
 *   python3 -m http.server 8765 &
 *   NODE_PATH=/ruta/a/node_modules node tools/capturas.js
 *   python3 tools/capturas.py      # convierte las PNG a WebP 640/1200
 */
const { chromium } = require('playwright');
const path = require('path');

const BASE = process.env.BASE || 'http://localhost:8765';
const SALIDA = path.join(__dirname, '_capturas');
const DEMOS = [['neuroavanzar', 'neuroavanzar'], ['aprehender', 'aprehender'], ['integra', 'integra-neurorehabilitacion']];

(async () => {
  require('fs').mkdirSync(SALIDA, { recursive: true });
  const navegador = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--headless=new'] });
  for (const [marca, ruta] of DEMOS) {
    const pagina = await navegador.newPage({ viewport: { width: 1440, height: 900 } });
    await pagina.goto(`${BASE}/${ruta}/`, { waitUntil: 'networkidle' });
    await pagina.addStyleTag({ content: '.demo-aviso{display:none!important}' });
    await pagina.waitForTimeout(4000); // deja terminar la intro del hero
    await pagina.screenshot({ path: path.join(SALIDA, `${marca}.png`) });
    await pagina.close();
  }
  await navegador.close();
})();
