/* Estudio de producto de VITALIA: dibuja en SVG los envases ficticios a partir de
 * products.js (campo «envase») para generar las imágenes del catálogo.
 * Lo usa tools/render.js con Chrome headless; también puede abrirse a mano:
 *   tools/estudio.html#vitamina-c-zinc/frente
 */
(function () {
  'use strict';
  const { catalogo } = window.VT;
  const PAPEL = '#FBFAF6';
  const MARFIL = '#F2EEE3';
  const TINTA = '#1E2D2B';
  const PETROLEO = '#1F4B5A';
  const BOTANICO = '#2E5B45';
  const SERIF = "'Newsreader', Georgia, serif";
  const SANS = "'Hanken Grotesk', Arial, sans-serif";
  let uid = 0;
  const nid = (p) => `${p}${++uid}`;

  // ---------- color ----------
  const hex2rgb = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const rgb2hex = (r) => '#' + r.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => { const x = hex2rgb(a), y = hex2rgb(b); return rgb2hex(x.map((v, i) => v + (y[i] - v) * t)); };
  const dark = (h, t) => mix(h, '#000000', t);
  const light = (h, t) => mix(h, '#FFFFFF', t);
  const lum = (h) => { const [r, g, b] = hex2rgb(h); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };
  const sobre = (fondo) => (lum(fondo) > 0.6 ? TINTA : '#FFFFFF');
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  function wrap(text, max) {
    const out = []; let line = '';
    text.split(' ').forEach((w) => {
      if ((line + ' ' + w).trim().length > max && line) { out.push(line); line = w; } else line = (line + ' ' + w).trim();
    });
    if (line) out.push(line);
    return out;
  }

  // ---------- defs compartidos ----------
  function cilindro(id, fuerza = 1) {
    const a = (v) => (v * fuerza).toFixed(3);
    return `<linearGradient id="${id}" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity="${a(0.34)}"/>
      <stop offset="0.12" stop-color="#000" stop-opacity="${a(0.10)}"/>
      <stop offset="0.24" stop-color="#fff" stop-opacity="${a(0.16)}"/>
      <stop offset="0.32" stop-color="#fff" stop-opacity="${a(0.04)}"/>
      <stop offset="0.62" stop-color="#000" stop-opacity="0"/>
      <stop offset="0.86" stop-color="#000" stop-opacity="${a(0.16)}"/>
      <stop offset="1" stop-color="#000" stop-opacity="${a(0.40)}"/></linearGradient>`;
  }
  const FILTROS = `
    <filter id="sb8" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
    <filter id="sb20" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="20"/></filter>
    <filter id="sb40" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="40"/></filter>
    <filter id="grano" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.07"/></feComponentTransfer></filter>
    <filter id="papel" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.12"/></feComponentTransfer></filter>
    <filter id="tela" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.9" numOctaves="2" seed="4"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.10"/></feComponentTransfer></filter>
    <filter id="vetas" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.25 0.012" numOctaves="3" seed="7"/><feColorMatrix type="matrix" values="0 0 0 0 0.36  0 0 0 0 0.24  0 0 0 0 0.13  0 0 0 0.9 -0.2"/></filter>
    <filter id="granulo" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="2" seed="3"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.45"/></feComponentTransfer></filter>`;

  // ---------- etiquetas ----------
  function etiquetaFrente(p, w, h, o = {}) {
    const e = p.envase; const c = catalogo.categoria(p.categoria);
    const tinta = o.antes ? '#555' : sobre(e.etiqueta);
    const acento = o.antes ? '#777' : (lum(e.etiqueta) > 0.6 ? PETROLEO : '#fff');
    if (o.antes) {
      const lines = wrap(p.nombre.toUpperCase(), Math.max(8, Math.round(w / 22)));
      const fs = Math.min(w * 0.085, 40);
      return `<rect width="${w}" height="${h}" fill="#FFFFFF"/>
        <text x="${w / 2}" y="${h * 0.2}" text-anchor="middle" font-family="${SANS}" font-weight="800" font-size="${fs * 0.9}" fill="#8a8a8a">VITALIA</text>
        ${lines.map((l, i) => `<text x="${w / 2}" y="${h * 0.38 + i * fs * 1.15}" text-anchor="middle" font-family="${SANS}" font-weight="700" font-size="${fs}" fill="#444">${esc(l)}</text>`).join('')}
        ${[0, 1, 2, 3].map((i) => `<rect x="${w * 0.14}" y="${h * 0.66 + i * h * 0.05}" width="${w * (0.72 - i * 0.08)}" height="${Math.max(2, h * 0.012)}" fill="#bbb"/>`).join('')}
        <text x="${w / 2}" y="${h * 0.94}" text-anchor="middle" font-family="${SANS}" font-weight="600" font-size="${fs * 0.55}" fill="#777">${esc(e.contenido)}</text>`;
    }
    const nameMax = Math.max(11, Math.round(w / (h > w * 1.1 ? 19 : 16)));
    const lines = wrap(p.nombre, nameMax);
    const largo = Math.max(...lines.map((l) => l.length));
    const fsN = Math.min(w * 0.115, h * 0.11, (w * 0.84) / (largo * 0.47)) * (lines.length > 2 ? 0.9 : 1);
    const banda = h * 0.17;
    const yN = h * 0.36 - ((lines.length - 1) * fsN * 1.05) / 2;
    return `<rect width="${w}" height="${h}" fill="${e.etiqueta}"/>
      <rect width="${w}" height="${h}" fill="${e.etiqueta}" filter="url(#papel)"/>
      <text x="${w / 2}" y="${h * 0.15}" text-anchor="middle" font-family="${SERIF}" font-weight="500" font-size="${w * 0.062}" letter-spacing="${w * 0.02}" fill="${acento}">VITALIA</text>
      <circle cx="${w / 2}" cy="${h * 0.205}" r="${w * 0.009}" fill="${e.banda}"/>
      ${lines.map((l, i) => `<text x="${w / 2}" y="${yN + fsN * 0.35 + i * fsN * 1.05}" text-anchor="middle" font-family="${SERIF}" font-weight="400" font-size="${fsN}" fill="${tinta}">${esc(l)}</text>`).join('')}
      <rect x="${w * 0.36}" y="${h * 0.6}" width="${w * 0.28}" height="${Math.max(1.5, w * 0.004)}" fill="${tinta}" opacity="0.5"/>
      <text x="${w / 2}" y="${h * 0.69}" text-anchor="middle" font-family="${SANS}" font-weight="500" font-size="${w * 0.046}" fill="${tinta}" opacity="0.75">${esc(c.nombre)}</text>
      <rect y="${h - banda}" width="${w}" height="${banda}" fill="${e.banda}"/>
      <text x="${w / 2}" y="${h - banda / 2 + w * 0.018}" text-anchor="middle" font-family="${SANS}" font-weight="600" font-size="${w * 0.05}" letter-spacing="${w * 0.004}" fill="${sobre(e.banda)}">${esc(e.contenido)}</text>`;
  }

  function codigoBarras(x, y, w, h, seed) {
    let s = seed, out = '', cx = x;
    while (cx < x + w) {
      s = (s * 9301 + 49297) % 233280; const bw = 1 + (s % 3);
      if (s % 2) out += `<rect x="${cx}" y="${y}" width="${bw}" height="${h}" fill="${TINTA}"/>`;
      cx += bw + 1;
    }
    return out;
  }

  function etiquetaPosterior(p, w, h) {
    const e = p.envase; const tinta = sobre(e.etiqueta);
    const fs = Math.max(9, w * 0.038);
    const items = (p.ingredientes.length ? p.ingredientes : (p.materiales || [])).slice(0, 5);
    let y = h * 0.2; const rows = [];
    rows.push(`<text x="${w * 0.1}" y="${h * 0.11}" font-family="${SERIF}" font-size="${w * 0.055}" letter-spacing="${w * 0.012}" fill="${tinta}">VITALIA</text>`);
    rows.push(`<text x="${w * 0.1}" y="${y}" font-family="${SANS}" font-weight="700" font-size="${fs * 1.05}" fill="${tinta}">${p.ingredientes.length ? 'Ingredientes' : 'Materiales'}</text>`);
    y += fs * 0.7;
    rows.push(`<rect x="${w * 0.1}" y="${y}" width="${w * 0.8}" height="${Math.max(1, fs * 0.12)}" fill="${tinta}"/>`);
    items.forEach((it) => {
      wrap(it, Math.round(w * 0.8 / (fs * 0.52))).slice(0, 2).forEach((l) => {
        y += fs * 1.35;
        rows.push(`<text x="${w * 0.1}" y="${y}" font-family="${SANS}" font-size="${fs}" fill="${tinta}" opacity="0.85">${esc(l)}</text>`);
      });
    });
    y += fs * 0.9;
    rows.push(`<rect x="${w * 0.1}" y="${y}" width="${w * 0.8}" height="${Math.max(1, fs * 0.08)}" fill="${tinta}" opacity="0.5"/>`);
    wrap('Producto conceptual de demostración. Sin registro sanitario. No apto para la venta.', Math.round(w * 0.8 / (fs * 0.5))).forEach((l) => {
      y += fs * 1.3;
      rows.push(`<text x="${w * 0.1}" y="${y}" font-family="${SANS}" font-weight="600" font-size="${fs * 0.92}" fill="${tinta}" opacity="0.8">${esc(l)}</text>`);
    });
    const bh = h * 0.1;
    rows.push(`<rect x="${w * 0.1 - 4}" y="${h * 0.8 - bh - 6}" width="${w * 0.42 + 8}" height="${bh + 12}" fill="#fff"/>`);
    rows.push(codigoBarras(w * 0.1, h * 0.8 - bh, w * 0.42, bh, p.id.length * 97));
    rows.push(`<rect y="${h * 0.86}" width="${w}" height="${h * 0.14}" fill="${e.banda}"/>`);
    return `<rect width="${w}" height="${h}" fill="${e.etiqueta}"/><rect width="${w}" height="${h}" fill="${e.etiqueta}" filter="url(#papel)"/>${rows.join('')}`;
  }

  function etiquetaLateral(p, w, h) {
    const e = p.envase; const tinta = sobre(e.etiqueta);
    const fs = Math.min(w * 0.2, h * 0.11);
    return `<rect width="${w}" height="${h}" fill="${e.etiqueta}"/><rect width="${w}" height="${h}" fill="${e.etiqueta}" filter="url(#papel)"/>
      <rect x="0" width="${w * 0.16}" height="${h}" fill="${e.banda}"/>
      <text transform="translate(${w * 0.52} ${h * 0.82}) rotate(-90)" font-family="${SERIF}" font-size="${fs}" letter-spacing="${fs * 0.22}" fill="${lum(e.etiqueta) > 0.6 ? PETROLEO : '#fff'}">VITALIA</text>
      <g transform="translate(${w * 0.8} ${h * 0.2})" fill="none" stroke="${tinta}" stroke-width="${Math.max(1.2, w * 0.012)}" opacity="0.7">
        <circle r="${w * 0.07}"/><path d="M${-w * 0.03} ${w * 0.01} l${w * 0.03} ${-w * 0.035} l${w * 0.03} ${w * 0.035}"/></g>
      <text transform="translate(${w * 0.84} ${h * 0.86}) rotate(-90)" font-family="${SANS}" font-size="${Math.max(8, w * 0.06)}" fill="${tinta}" opacity="0.7">${esc(e.contenido)} · Lote demo</text>`;
  }

  function etiqueta(p, cara, w, h, o) {
    if (cara === 'posterior') return etiquetaPosterior(p, w, h);
    if (cara === 'lateral') return etiquetaLateral(p, w, h);
    return etiquetaFrente(p, w, h, o);
  }

  // Coloca una etiqueta (w×h) con su sombreado cilíndrico.
  function aplicarEtiqueta(p, cara, x, y, w, h, o, fuerza = 1, clip = '') {
    const g = nid('lg'); const c = nid('lc');
    return `<defs>${cilindro(g, fuerza)}<clipPath id="${c}"><rect width="${w}" height="${h}" ${clip}/></clipPath></defs>
      <g transform="translate(${x} ${y})" clip-path="url(#${c})">${etiqueta(p, cara, w, h, o)}<rect width="${w}" height="${h}" fill="url(#${g})"/></g>`;
  }

  // ---------- envases ----------
  // Cada forma dibuja con el origen en el centro de la base (y negativa hacia arriba)
  // y devuelve { svg, w, h } con su ancho y alto totales.

  function cuerpoHombros(w, h, sh, nw, r) {
    return `M${-w / 2} ${-r} L${-w / 2} ${-h + sh} C${-w / 2} ${-h + sh * 0.35} ${-nw / 2 - (w - nw) * 0.08} ${-h} ${-nw / 2} ${-h}
      L${nw / 2} ${-h} C${nw / 2 + (w - nw) * 0.08} ${-h} ${w / 2} ${-h + sh * 0.35} ${w / 2} ${-h + sh} L${w / 2} ${-r}
      Q${w / 2} 0 ${w / 2 - r} 0 L${-w / 2 + r} 0 Q${-w / 2} 0 ${-w / 2} ${-r} Z`;
  }

  function brillos(w, h, top, op = 1) {
    return `<rect x="${-w * 0.36}" y="${top}" width="${w * 0.045}" height="${h}" rx="${w * 0.02}" fill="#fff" opacity="${0.32 * op}"/>
      <rect x="${-w * 0.29}" y="${top + h * 0.05}" width="${w * 0.012}" height="${h * 0.8}" rx="3" fill="#fff" opacity="${0.22 * op}"/>
      <rect x="${w * 0.36}" y="${top + h * 0.1}" width="${w * 0.02}" height="${h * 0.7}" rx="4" fill="#fff" opacity="${0.12 * op}"/>`;
  }

  function tapaRosca(cw, ch, y, color, rayas = true) {
    const g = nid('cg');
    let s = `<defs>${cilindro(g, 1.1)}</defs><rect x="${-cw / 2}" y="${y}" width="${cw}" height="${ch}" rx="${Math.min(10, cw * 0.05)}" fill="${color}"/>`;
    if (rayas) for (let x = -cw / 2 + 7; x < cw / 2 - 4; x += 8) s += `<rect x="${x}" y="${y + 3}" width="2" height="${ch - 6}" fill="#000" opacity="0.07"/>`;
    s += `<rect x="${-cw / 2}" y="${y}" width="${cw}" height="${ch}" rx="${Math.min(10, cw * 0.05)}" fill="url(#${g})"/>
      <rect x="${-cw / 2 + 2}" y="${y + 2}" width="${cw - 4}" height="${Math.max(3, ch * 0.06)}" rx="3" fill="#fff" opacity="0.28"/>`;
    return s;
  }

  function frasco(p, cara, o = {}) {
    const e = p.envase; const w = 300, h = 400, sh = 70, nw = 196, neck = 22, cw = 232, ch = 112;
    const vidrio = o.antes ? '#F4F4F1' : e.vidrio; const tapa = o.antes ? '#FFFFFF' : e.tapa;
    const g = nid('fg');
    const svg = `<defs>${cilindro(g, o.antes ? 0.7 : 1.1)}</defs>
      <rect x="${-nw / 2 + 6}" y="${-h - neck}" width="${nw - 12}" height="${neck + 4}" fill="${dark(vidrio, 0.25)}"/>
      <path d="${cuerpoHombros(w, h, sh, nw, 22)}" fill="${vidrio}"/>
      <path d="${cuerpoHombros(w, h, sh, nw, 22)}" fill="url(#${g})"/>
      ${o.antes ? '' : `<path d="M${-w / 2 + 6} -16 Q${-w / 2 + 6} -4 ${-w / 2 + 26} -4 L${w / 2 - 26} -4 Q${w / 2 - 6} -4 ${w / 2 - 6} -16" fill="none" stroke="#fff" stroke-opacity="0.18" stroke-width="5"/>`}
      ${aplicarEtiqueta(p, cara, -w / 2, -h + sh + 22, w, h - sh - 70, o, o.antes ? 0.6 : 0.9)}
      ${brillos(w, h - sh - 40, -h + sh - 6, o.antes ? 0.4 : 1)}
      ${tapaRosca(cw, ch, -h - neck - ch + 4, tapa, true)}`;
    return { svg, w: cw > w ? cw : w, h: h + neck + ch };
  }

  function tarro(p, cara, o = {}) {
    const e = p.envase; const w = 420, h = 300, lid = 104;
    const cuerpo = o.antes ? '#F4F4F1' : e.vidrio; const tapa = o.antes ? '#FFFFFF' : e.tapa;
    const g = nid('tg');
    const path = cuerpoHombros(w, h, 26, w - 26, 30);
    const svg = `<defs>${cilindro(g, 1)}</defs>
      <path d="${path}" fill="${cuerpo}"/><path d="${path}" fill="url(#${g})"/>
      ${aplicarEtiqueta(p, cara, -w / 2, -h + 46, w, h - 92, o, 0.8)}
      ${brillos(w, h - 80, -h + 40, 0.6)}
      ${tapaRosca(w + 6, lid, -h - lid + 8, tapa, false)}
      ${[0.25, 0.42, 0.59].map((t) => `<rect x="${-(w + 6) / 2}" y="${-h - lid + 8 + lid * t + lid * 0.35}" width="${w + 6}" height="2" fill="#000" opacity="0.06"/>`).join('')}`;
    return { svg, w: w + 6, h: h + lid - 8 };
  }

  function gotero(p, cara, o = {}) {
    const e = p.envase; const w = 210, h = 250, sh = 60, nw = 96;
    const vidrio = o.antes ? '#F4F4F1' : e.vidrio; const tapa = o.antes ? '#FFFFFF' : e.tapa;
    const g = nid('gg'); const gb = nid('gb');
    const svg = `<defs>${cilindro(g, 1)}${cilindro(gb, 1.3)}
        <linearGradient id="${gb}v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.25"/><stop offset="0.4" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
      <path d="${cuerpoHombros(w, h, sh, nw, 18)}" fill="${vidrio}"/>
      <rect x="${-w / 2 + 10}" y="${-h * 0.62}" width="${w - 20}" height="${h * 0.62 - 10}" rx="12" fill="${dark(vidrio, 0.06)}" opacity="0.6"/>
      <path d="${cuerpoHombros(w, h, sh, nw, 18)}" fill="url(#${g})"/>
      ${aplicarEtiqueta(p, cara, -w / 2, -h + sh + 12, w, h - sh - 46, o, 0.9)}
      ${brillos(w, h - sh, -h + sh - 6)}
      <rect x="${-nw / 2 - 6}" y="${-h - 46}" width="${nw + 12}" height="50" rx="6" fill="${tapa}"/>
      <rect x="${-nw / 2 - 6}" y="${-h - 46}" width="${nw + 12}" height="50" rx="6" fill="url(#${gb})"/>
      <path d="M${-34} ${-h - 44} C${-38} ${-h - 120} ${-30} ${-h - 172} 0 ${-h - 172} C${30} ${-h - 172} ${38} ${-h - 120} ${34} ${-h - 44} Z" fill="${tapa}"/>
      <path d="M${-34} ${-h - 44} C${-38} ${-h - 120} ${-30} ${-h - 172} 0 ${-h - 172} C${30} ${-h - 172} ${38} ${-h - 120} ${34} ${-h - 44} Z" fill="url(#${gb})"/>
      <path d="M-20 ${-h - 70} C-24 ${-h - 120} -18 ${-h - 154} -6 ${-h - 160}" stroke="#fff" stroke-opacity="0.25" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    return { svg, w, h: h + 172 };
  }

  function dispensador(p, cara, o = {}) {
    const e = p.envase; const w = 250, h = 500, sh = 74, nw = 96;
    const cuerpo = o.antes ? '#F4F4F1' : e.vidrio; const tapa = o.antes ? '#FFFFFF' : e.tapa;
    const g = nid('dg'); const gc = nid('dc');
    const svg = `<defs>${cilindro(g, 1)}${cilindro(gc, 1.2)}</defs>
      <path d="${cuerpoHombros(w, h, sh, nw, 26)}" fill="${cuerpo}"/><path d="${cuerpoHombros(w, h, sh, nw, 26)}" fill="url(#${g})"/>
      ${aplicarEtiqueta(p, cara, -w / 2, -h + sh + 40, w, h - sh - 110, o, 0.85)}
      ${brillos(w, h - sh - 40, -h + sh, 0.55)}
      <rect x="${-nw / 2 - 4}" y="${-h - 44}" width="${nw + 8}" height="48" rx="8" fill="${tapa}"/>
      <rect x="${-nw / 2 - 4}" y="${-h - 44}" width="${nw + 8}" height="48" rx="8" fill="url(#${gc})"/>
      <rect x="-13" y="${-h - 100}" width="26" height="60" fill="${dark(tapa, 0.08)}"/>
      <rect x="-13" y="${-h - 100}" width="26" height="60" fill="url(#${gc})"/>
      <path d="M-56 ${-h - 100} L-56 ${-h - 128} Q-56 ${-h - 140} -44 ${-h - 140} L66 ${-h - 140} L118 ${-h - 136} Q126 ${-h - 134} 126 ${-h - 126} L126 ${-h - 118} L60 ${-h - 114} L60 ${-h - 100} Z" fill="${tapa}"/>
      <path d="M-56 ${-h - 128} L66 ${-h - 128}" stroke="#fff" stroke-opacity="0.25" stroke-width="4"/>
      <rect x="-56" y="${-h - 140}" width="116" height="40" rx="10" fill="url(#${gc})"/>`;
    return { svg, w: w + 60, h: h + 140, dx: 0 };
  }

  function tubo(p, cara, o = {}) {
    const e = p.envase; const k = e.pequeno ? 0.62 : 1;
    const wt = 240 * k, wb = 176 * k, h = (e.pequeno ? 470 : 470) * k, capH = 86 * k, capW = 132 * k, crimp = 30 * k;
    const cuerpo = o.antes ? '#F4F4F1' : e.vidrio; const tapa = o.antes ? '#FFFFFF' : e.tapa;
    const g = nid('ug'); const gc = nid('uc');
    const top = -h; const base = -capH;
    const path = `M${-wt / 2} ${top + crimp} L${wt / 2} ${top + crimp} C${wt / 2} ${top + h * 0.45} ${wb / 2 + 10 * k} ${base - 70 * k} ${capW / 2 + 6 * k} ${base - 6 * k}
      L${capW / 2 + 6 * k} ${base} L${-capW / 2 - 6 * k} ${base} L${-capW / 2 - 6 * k} ${base - 6 * k} C${-wb / 2 - 10 * k} ${base - 70 * k} ${-wt / 2} ${top + h * 0.45} ${-wt / 2} ${top + crimp} Z`;
    const lw = wt * 0.8, lh = (h - capH - crimp) * 0.56;
    const svg = `<defs>${cilindro(g, 0.9)}${cilindro(gc, 1.2)}<clipPath id="${g}c"><path d="${path}"/></clipPath></defs>
      <rect x="${-wt / 2}" y="${top}" width="${wt}" height="${crimp + 2}" fill="${dark(cuerpo, 0.04)}"/>
      ${Array.from({ length: Math.floor(crimp / 4) }, (_, i) => `<rect x="${-wt / 2}" y="${top + 2 + i * 4}" width="${wt}" height="1.4" fill="#000" opacity="0.08"/>`).join('')}
      <path d="${path}" fill="${cuerpo}"/>
      <g clip-path="url(#${g}c)">${aplicarEtiqueta(p, cara, -lw / 2, top + crimp + 26 * k, lw, lh, o, 0.4)}
        ${cara === 'frente' && !o.antes ? `<rect x="${-wt / 2}" y="${top + crimp + 26 * k + lh + 10 * k}" width="${wt}" height="${8 * k}" fill="${e.banda}"/>` : ''}</g>
      <path d="${path}" fill="url(#${g})"/>
      <rect x="${-capW / 2}" y="${base}" width="${capW}" height="${capH}" rx="${10 * k}" fill="${tapa}"/>
      <rect x="${-capW / 2}" y="${base}" width="${capW}" height="${capH}" rx="${10 * k}" fill="url(#${gc})"/>
      <rect x="${-wt * 0.3}" y="${top + crimp + 10}" width="${wt * 0.05}" height="${h * 0.55}" rx="6" fill="#fff" opacity="0.25"/>`;
    return { svg, w: wt, h };
  }

  function caja(p, cara, o = {}) {
    const e = p.envase; const W = cara === 'lateral' ? 170 : 300, D = cara === 'lateral' ? 230 : 120, H = 440, rise = 44;
    const x0 = -(W + D) / 2;
    const fondo = o.antes ? '#F4F4F1' : e.vidrio;
    const cara1 = cara === 'lateral' ? 'lateral' : (cara === 'posterior' ? 'posterior' : 'frente');
    const svg = `
      <path d="M${x0} ${-H} L${x0 + D} ${-H - rise} L${x0 + W + D} ${-H - rise} L${x0 + W} ${-H} Z" fill="${light(fondo, 0.35)}"/>
      <path d="M${x0 + W} ${-H} L${x0 + W + D} ${-H - rise} L${x0 + W + D} ${-rise} L${x0 + W} 0 Z" fill="${dark(fondo, 0.16)}"/>
      <g transform="matrix(1 ${-rise / D} 0 1 ${x0 + W} 0)">
        <rect x="0" y="${-H * 0.22}" width="${D}" height="${H * 0.08}" fill="${dark(e.banda, 0.1)}"/>
        <text x="${D / 2}" y="${-H * 0.62}" text-anchor="middle" font-family="${SERIF}" font-size="${D * 0.16}" letter-spacing="${D * 0.03}" fill="${dark(fondo, 0.55)}">VITALIA</text></g>
      <rect x="${x0}" y="${-H}" width="${W}" height="${H}" fill="${fondo}"/>
      <rect x="${x0}" y="${-H}" width="${W}" height="${H}" fill="${fondo}" filter="url(#papel)"/>
      ${aplicarEtiqueta(p, cara1, x0 + W * 0.08, -H + H * 0.1, W * 0.84, H * 0.8, o, 0.1)}
      <rect x="${x0}" y="${-H}" width="${W}" height="${H}" fill="none" stroke="#000" stroke-opacity="0.08"/>
      <path d="M${x0} ${-H + 2} L${x0 + W} ${-H + 2}" stroke="#fff" stroke-opacity="0.5" stroke-width="3"/>`;
    return { svg, w: W + D, h: H + rise };
  }

  function doypack(p, cara, o = {}) {
    const e = p.envase; const k = cara === 'lateral' ? 0.62 : 1;
    const w = 400 * k, h = 560, seal = 46;
    const fondo = o.antes ? '#F4F4F1' : e.vidrio;
    const g = nid('pg'); const gv = nid('pv');
    const path = `M${-w / 2 + 6} ${-h} L${w / 2 - 6} ${-h} L${w / 2 - 2} ${-h + seal} C${w / 2 + 10} ${-h * 0.55} ${w / 2 + 12} ${-h * 0.2} ${w / 2 + 4} -22
      Q${w / 2} 0 ${w / 2 - 30} 0 L${-w / 2 + 30} 0 Q${-w / 2} 0 ${-w / 2 - 4} -22 C${-w / 2 - 12} ${-h * 0.2} ${-w / 2 - 10} ${-h * 0.55} ${-w / 2 + 2} ${-h + seal} Z`;
    const lw = w * 0.78, lh = h * 0.46;
    const ventana = cara === 'frente' && !o.antes;
    const svg = `<defs>${cilindro(g, 0.8)}<linearGradient id="${gv}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.18"/><stop offset="0.25" stop-color="#fff" stop-opacity="0"/><stop offset="0.85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.18"/></linearGradient>
        <clipPath id="${g}c"><path d="${path}"/></clipPath></defs>
      <path d="${path}" fill="${fondo}"/>
      <g clip-path="url(#${g}c)">
        <rect x="${-w}" y="${-h}" width="${w * 2}" height="${h}" fill="${fondo}" filter="url(#papel)"/>
        ${Array.from({ length: 9 }, (_, i) => `<rect x="${-w / 2}" y="${-h + 6 + i * 4.4}" width="${w}" height="1.5" fill="#000" opacity="0.07"/>`).join('')}
        <rect x="${-w / 2}" y="${-h + seal + 26}" width="${w}" height="5" fill="#000" opacity="0.08"/>
        ${aplicarEtiqueta(p, cara, -lw / 2, -h + seal + 56, lw, lh, o, 0.2)}
        ${ventana ? `<rect x="${-w * 0.3}" y="${-h * 0.33}" width="${w * 0.6}" height="${h * 0.2}" rx="${h * 0.1}" fill="${e.tapa}"/>
          <rect x="${-w * 0.3}" y="${-h * 0.33}" width="${w * 0.6}" height="${h * 0.2}" rx="${h * 0.1}" fill="#C9A27A" filter="url(#granulo)"/>
          <rect x="${-w * 0.3 + 10}" y="${-h * 0.33 + 6}" width="${w * 0.25}" height="6" rx="3" fill="#fff" opacity="0.35"/>` : ''}
        <rect x="${-w}" y="${-h}" width="${w * 2}" height="${h}" fill="url(#${g})"/>
        <rect x="${-w}" y="${-h}" width="${w * 2}" height="${h}" fill="url(#${gv})"/>
        <path d="M${-w / 2} -30 Q0 -6 ${w / 2} -30" stroke="#000" stroke-opacity="0.12" stroke-width="3" fill="none"/>
      </g>
      <circle cx="${w / 2 - 22}" cy="${-h + 24}" r="7" fill="${MARFIL}"/>`;
    return { svg, w: w + 24, h };
  }

  function botella(p, cara, o = {}) {
    const e = p.envase; const w = 230, h = 620, sh = 44, nw = 172, capH = 104;
    const cuerpo = o.antes ? '#D9E6EC' : e.vidrio; const tapa = o.antes ? '#2A2A2A' : e.tapa;
    const g = nid('bg'); const gc = nid('bc');
    const path = cuerpoHombros(w, h, sh, nw, 30);
    const madera = !o.antes;
    const svg = `<defs>${cilindro(g, 1.1)}${cilindro(gc, 1)}<clipPath id="${gc}k"><rect x="${-nw / 2 - 2}" y="${-h - capH + 6}" width="${nw + 4}" height="${capH}" rx="14"/></clipPath></defs>
      <path d="${path}" fill="${cuerpo}"/>
      ${o.antes ? `<path d="${path}" fill="#fff" opacity="0.25"/>` : `<path d="${path}" fill="${cuerpo}" filter="url(#papel)"/>`}
      <path d="${path}" fill="url(#${g})"/>
      ${madera ? `<text transform="translate(${cara === 'lateral' ? w * 0.18 : 0} ${-h * 0.42})${cara === 'lateral' ? ' scale(0.55 1)' : ''}" text-anchor="middle" font-family="${SERIF}" font-size="34" letter-spacing="9" fill="${light(cuerpo, 0.45)}">VITALIA</text>
        <rect x="${cara === 'lateral' ? w * 0.18 - 6 : -6}" y="${-h * 0.42 + 22}" width="12" height="3" rx="1.5" fill="${e.banda}" opacity="0.7"/>` : ''}
      ${brillos(w, h - sh - 60, -h + sh + 20, o.antes ? 1.2 : 0.7)}
      <g clip-path="url(#${gc}k)">
        <rect x="${-nw / 2 - 2}" y="${-h - capH + 6}" width="${nw + 4}" height="${capH}" fill="${tapa}"/>
        ${madera ? `<rect x="${-nw / 2 - 2}" y="${-h - capH + 6}" width="${nw + 4}" height="${capH}" filter="url(#vetas)" opacity="0.55"/>` : ''}
        <rect x="${-nw / 2 - 2}" y="${-h - capH + 6}" width="${nw + 4}" height="${capH}" fill="url(#${gc})"/></g>
      <rect x="${-nw / 2 - 2}" y="${-h - 8}" width="${nw + 4}" height="10" fill="${madera ? '#E9E3D6' : '#111'}" opacity="0.9"/>
      ${cara === 'lateral'
        ? `<rect x="-14" y="${-h - capH - 58}" width="28" height="70" rx="14" fill="none" stroke="${dark(tapa, 0.25)}" stroke-width="14"/>`
        : `<path d="M-46 ${-h - capH + 10} C-46 ${-h - capH - 60} 46 ${-h - capH - 60} 46 ${-h - capH + 10}" fill="none" stroke="${dark(tapa, madera ? 0.3 : 0)}" stroke-width="16" stroke-linecap="round"/>`}`;
    return { svg, w, h: h + capH + 50 };
  }

  const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  function pastillero(p, cara, o = {}) {
    const e = p.envase; const n = 7, cw = 98, gap = 6, H = 96, depth = 46;
    const W = n * cw + (n - 1) * gap;
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = -W / 2 + i * (cw + gap);
      s += `<rect x="${x}" y="${-H}" width="${cw}" height="${H}" rx="10" fill="${e.vidrio}"/>
        <rect x="${x}" y="${-H}" width="${cw}" height="${H}" rx="10" fill="#000" opacity="0.04"/>
        <rect x="${x + 6}" y="${-H + 8}" width="${cw * 0.12}" height="${H - 18}" rx="5" fill="#fff" opacity="0.6"/>
        <path d="M${x + 4} ${-H} L${x + 18} ${-H - depth} L${x + cw + 14} ${-H - depth} L${x + cw} ${-H} Z" fill="${i % 2 ? e.tapa : light(e.tapa, 0.12)}"/>
        <rect x="${x - 1}" y="${-H - 8}" width="${cw + 2}" height="12" rx="5" fill="${dark(e.tapa, 0.12)}"/>
        <text x="${x + cw / 2 + 9}" y="${-H - depth / 2 + 8}" text-anchor="middle" font-family="${SANS}" font-weight="700" font-size="22" fill="${BOTANICO}">${DIAS[i]}</text>`;
    }
    return { svg: s, w: W + 20, h: H + depth };
  }

  const FORMAS = { frasco, tarro, gotero, dispensador, tubo, caja, doypack, botella, pastillero };
  const dibujar = (p, cara, o) => FORMAS[p.envase.forma](p, cara, o);

  // ---------- escenas ----------
  function fondoEstudio(W, H, tono, horizonte = 0.7, gobo = true) {
    const pared = mix(tono, PAPEL, 0.86); const piso = mix(tono, PAPEL, 0.76);
    const g = nid('w');
    return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${light(pared, 0.25)}"/><stop offset="${horizonte - 0.02}" stop-color="${pared}"/>
        <stop offset="${horizonte + 0.02}" stop-color="${piso}"/><stop offset="1" stop-color="${dark(piso, 0.05)}"/></linearGradient>
        <radialGradient id="${g}r" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#fff" stop-opacity="0.45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#${g})"/>
      <rect width="${W}" height="${H}" fill="url(#${g}r)"/>
      ${gobo ? `<g filter="url(#sb20)" opacity="0.22" fill="${dark(pared, 0.35)}" transform="translate(${W * 0.78} ${H * 0.12}) rotate(28)">
        ${[[0, 0, 80, 18, 10], [60, 70, 90, 20, -25], [-40, 120, 70, 16, 35], [30, 190, 100, 22, -10], [-70, 250, 80, 17, 20], [90, 160, 60, 14, 50]].map(([x, y, rx, ry, r]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${r} ${x} ${y})"/>`).join('')}
        <rect x="-4" y="-40" width="8" height="340" rx="4"/></g>` : ''}`;
  }

  function sombras(cx, base, w, k = 1) {
    return `<ellipse cx="${cx + w * 0.45}" cy="${base - 4}" rx="${w * 0.95}" ry="${26 * k}" fill="#1E2D2B" opacity="0.12" filter="url(#sb40)"/>
      <ellipse cx="${cx + w * 0.06}" cy="${base}" rx="${w * 0.56}" ry="${14 * k}" fill="#1E2D2B" opacity="0.30" filter="url(#sb8)"/>
      <ellipse cx="${cx}" cy="${base}" rx="${w * 0.46}" ry="${5 * k}" fill="#1E2D2B" opacity="0.35" filter="url(#sb8)"/>`;
  }

  function colocar(p, cara, cx, base, alto, o = {}) {
    const d = dibujar(p, cara, o);
    const k = Math.min(alto / d.h, (o.maxW || 1e9) / d.w);
    return { svg: `${o.sinSombra ? '' : sombras(cx, base, d.w * k, k)}<g transform="translate(${cx} ${base}) scale(${k})">${d.svg}</g>`, w: d.w * k, h: d.h * k };
  }

  const svgDoc = (W, H, cuerpo) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${FILTROS}</defs>${cuerpo}</svg>`;
  const grano = (W, H) => `<rect width="${W}" height="${H}" filter="url(#grano)"/>`;
  const tonoDe = (p) => catalogo.categoria(p.categoria).color;
  const altoBase = (p) => ({ tubo: p.envase.pequeno ? 0.48 : 0.6, caja: 0.56, doypack: 0.62, botella: 0.68, pastillero: 0.22, tarro: 0.5, gotero: 0.56, dispensador: 0.66, frasco: 0.58 }[p.envase.forma]);

  function escenaEstudio(p, cara, W = 1000, H = 1250, o = {}) {
    const base = H * 0.8;
    const alto = H * altoBase(p);
    const pr = colocar(p, cara, W / 2, base, alto, { maxW: W * 0.8, antes: o.antes });
    return svgDoc(W, H, fondoEstudio(W, H, o.antes ? '#C9CCCB' : tonoDe(p), 0.7, !o.antes) + pr.svg + grano(W, H));
  }

  function escenaDetalle(p) { // accesorios: acercamiento a la tapa/cierre
    const W = 1000, H = 1250;
    const pr = colocar(p, 'frente', W / 2, H * 1.3, H * altoBase(p) * 2.0, { maxW: W * 1.9 });
    return svgDoc(W, H, fondoEstudio(W, H, tonoDe(p), 0.92, true) + pr.svg + grano(W, H));
  }

  function escenaPresentacion(p) {
    const W = 1000, H = 1250; const e = p.envase; const c = catalogo.categoria(p.categoria);
    const cx = 255, base = H * 0.74;
    const pr = colocar(p, 'frente', cx, base, H * Math.min(0.5, altoBase(p) * 0.92), { maxW: 340, sinSombra: true });
    const top = base - pr.h; const L = BOTANICO;
    const dimX = cx + pr.w / 2 + 34;
    const filas = [['Contenido neto', e.contenido], ['Presentación', p.presentacion.split('·')[0].trim()], ['Medidas aprox.', e.medida], ['Categoría', c.nombre]];
    let y = 640; let tabla = '';
    filas.forEach(([k, v]) => {
      tabla += `<rect x="560" y="${y - 44}" width="380" height="1.5" fill="${TINTA}" opacity="0.25"/>
        <text x="560" y="${y - 8}" font-family="${SANS}" font-size="24" fill="${TINTA}" opacity="0.7">${esc(k)}</text>`;
      wrap(v, 22).forEach((l, i) => { tabla += `<text x="560" y="${y + 26 + i * 34}" font-family="${SERIF}" font-size="31" fill="${TINTA}">${esc(l)}</text>`; y += i ? 34 : 0; });
      y += 108;
    });
    return svgDoc(W, H, `<rect width="${W}" height="${H}" fill="${MARFIL}"/><rect width="${W}" height="${H}" fill="${MARFIL}" filter="url(#papel)"/>
      <rect x="40" y="40" width="${W - 80}" height="${H - 80}" fill="none" stroke="${TINTA}" stroke-opacity="0.18"/>
      <text x="560" y="330" font-family="${SERIF}" font-size="60" fill="${TINTA}">Presentación</text>
      <text x="560" y="378" font-family="${SANS}" font-size="24" fill="${TINTA}" opacity="0.65">${esc(p.nombre)}</text>
      <rect x="560" y="420" width="64" height="4" fill="${e.banda}"/>
      ${tabla}
      <text x="560" y="${H - 96}" font-family="${SANS}" font-size="21" fill="${TINTA}" opacity="0.6">Datos demostrativos del prototipo.</text>
      <ellipse cx="${cx}" cy="${base}" rx="${pr.w * 0.5}" ry="6" fill="${TINTA}" opacity="0.18" filter="url(#sb8)"/>
      ${pr.svg}
      <g stroke="${L}" stroke-width="2" fill="none">
        <path d="M${dimX} ${top} L${dimX} ${base}"/><path d="M${dimX - 10} ${top} L${dimX + 10} ${top}"/><path d="M${dimX - 10} ${base} L${dimX + 10} ${base}"/>
        <path d="M${cx - pr.w / 2} ${base + 46} L${cx + pr.w / 2} ${base + 46}"/><path d="M${cx - pr.w / 2} ${base + 36} L${cx - pr.w / 2} ${base + 56}"/><path d="M${cx + pr.w / 2} ${base + 36} L${cx + pr.w / 2} ${base + 56}"/></g>
      <text transform="translate(${dimX + 26} ${(top + base) / 2}) rotate(90)" text-anchor="middle" font-family="${SANS}" font-size="24" fill="${L}">alto</text>
      <text x="${cx}" y="${base + 90}" text-anchor="middle" font-family="${SANS}" font-size="24" fill="${L}">ancho</text>
      ${grano(W, H)}`);
  }

  function escenaFoto(src, W, H, cuerpo, filtro = '') {
    return `<div class="foto" style="width:${W}px;height:${H}px;position:relative;overflow:hidden">
      <img src="${src}" style="position:absolute;inset:-4%;width:108%;height:108%;object-fit:cover;${filtro}">
      <div style="position:absolute;inset:0">${cuerpo}</div></div>`;
  }

  function escenaIngredientes(p) {
    const W = 1000, H = 1250; const nombre = p.ingredienteTexto.split(':')[0];
    const plate = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;inset:0"><defs>${FILTROS}</defs>
      <rect x="56" y="${H - 186}" width="${Math.max(380, nombre.length * 19 + 120)}" height="122" rx="61" fill="${PAPEL}" opacity="0.94"/>
      <text x="112" y="${H - 132}" font-family="${SANS}" font-size="24" fill="${TINTA}" opacity="0.7">Ingrediente ilustrativo</text>
      <text x="112" y="${H - 90}" font-family="${SERIF}" font-size="36" fill="${TINTA}">${esc(nombre)}</text></svg>`;
    return escenaFoto(`../assets/images/ingredientes/${p.ingredienteFoto}-900.webp`, W, H, plate, 'filter:saturate(0.9)');
  }

  function escenaEntorno(p) {
    const W = 1000, H = 1250; const tipo = p.entorno;
    const conEncimera = tipo === 'cocina' || tipo === 'bano';
    const base = conEncimera ? H * 0.84 : H * 0.82;
    const alto = H * altoBase(p) * (conEncimera ? 0.95 : 0.9);
    const pr = colocar(p, 'frente', W * 0.5, base, alto, { maxW: W * 0.7 });
    const piedra = tipo === 'bano' ? '#E9E6DF' : '#EFE8DA';
    const encimera = conEncimera ? `<defs><linearGradient id="enc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${light(piedra, 0.3)}"/><stop offset="0.08" stop-color="${piedra}"/><stop offset="1" stop-color="${dark(piedra, 0.1)}"/></linearGradient></defs>
      <rect x="0" y="${H * 0.7}" width="${W}" height="${H * 0.3}" fill="url(#enc)"/>
      <rect x="0" y="${H * 0.7}" width="${W}" height="${H * 0.3}" fill="${piedra}" filter="url(#papel)" opacity="0.6"/>
      <rect x="0" y="${H * 0.7}" width="${W}" height="3" fill="#fff" opacity="0.7"/>` : '';
    const luz = `<defs><linearGradient id="calido" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE9C2" stop-opacity="0.28"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#calido)"/>`;
    const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;inset:0"><defs>${FILTROS}</defs>${encimera}${luz}${pr.svg}${grano(W, H)}</svg>`;
    const filtro = conEncimera ? 'filter:blur(14px) saturate(0.85) brightness(1.05)' : (tipo === 'madera' ? 'filter:sepia(0.25) saturate(1.1) brightness(1.06)' : 'filter:brightness(1.08) saturate(0.9)');
    return escenaFoto(`../assets/images/entornos/${tipo}-1200.webp`, W, H, svg, filtro);
  }

  // ---------- comparador (1200×900) ----------
  function superficie(W, H, base = '#EFEAE0') {
    return `<rect width="${W}" height="${H}" fill="${base}"/><rect width="${W}" height="${H}" fill="${base}" filter="url(#tela)"/>
      <defs><radialGradient id="vig" cx="0.4" cy="0.35" r="0.9"><stop offset="0" stop-color="#fff" stop-opacity="0.35"/><stop offset="1" stop-color="#000" stop-opacity="0.08"/></radialGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#vig)"/>`;
  }
  function cuchara(cx, cy, color, granulo = true) {
    return `<g transform="translate(${cx} ${cy}) rotate(-24)">
      <ellipse cx="10" cy="14" rx="150" ry="112" fill="#1E2D2B" opacity="0.18" filter="url(#sb20)"/>
      <rect x="120" y="-14" width="300" height="28" rx="14" fill="#C9A577"/><rect x="120" y="-14" width="300" height="28" rx="14" filter="url(#vetas)" opacity="0.45"/>
      <ellipse rx="150" ry="112" fill="#D7B88E"/><ellipse rx="132" ry="96" fill="#B9956A"/>
      <ellipse rx="118" ry="84" fill="${color}"/>${granulo ? `<ellipse rx="118" ry="84" fill="${color}" filter="url(#granulo)"/>` : ''}
      <ellipse cx="-30" cy="-26" rx="60" ry="30" fill="#fff" opacity="0.22" filter="url(#sb8)"/></g>`;
  }
  function vaso(cx, cy, r, liquido, espuma) {
    return `<g transform="translate(${cx} ${cy})">
      <circle cx="18" cy="22" r="${r + 10}" fill="#1E2D2B" opacity="0.2" filter="url(#sb20)"/>
      <circle r="${r + 10}" fill="#fff" opacity="0.55"/><circle r="${r + 10}" fill="none" stroke="#fff" stroke-width="6" opacity="0.9"/>
      <circle r="${r}" fill="${liquido}"/>
      ${espuma ? `<circle r="${r * 0.82}" fill="${light(liquido, 0.35)}" filter="url(#granulo)"/>` : ''}
      <path d="M${-r * 0.7} ${-r * 0.45} A${r} ${r} 0 0 1 ${-r * 0.1} ${-r * 0.82}" stroke="#fff" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.6"/></g>`;
  }
  function taza(cx, cy, r, liquido) {
    return `<g transform="translate(${cx} ${cy})">
      <circle cx="20" cy="24" r="${r + 60}" fill="#1E2D2B" opacity="0.16" filter="url(#sb20)"/>
      <circle r="${r + 70}" fill="#F7F3EA"/><circle r="${r + 70}" fill="none" stroke="#E2DACB" stroke-width="3"/>
      <rect x="${r + 8}" y="-22" width="70" height="44" rx="22" fill="#F7F3EA" stroke="#E2DACB" stroke-width="3"/>
      <circle r="${r + 12}" fill="#FBF8F2"/><circle r="${r}" fill="${liquido}"/>
      <ellipse cx="${-r * 0.35}" cy="${-r * 0.4}" rx="${r * 0.4}" ry="${r * 0.14}" fill="#fff" opacity="0.35" filter="url(#sb8)" transform="rotate(-30 ${-r * 0.35} ${-r * 0.4})"/></g>`;
  }
  function gota(cx, cy, r, color) {
    return `<g transform="translate(${cx} ${cy})">
      <ellipse cx="14" cy="18" rx="${r * 1.05}" ry="${r * 0.95}" fill="#1E2D2B" opacity="0.18" filter="url(#sb8)"/>
      <ellipse rx="${r * 1.05}" ry="${r}" fill="${color}" opacity="0.92"/>
      <ellipse rx="${r * 1.05}" ry="${r}" fill="none" stroke="${dark(color, 0.12)}" stroke-width="3" opacity="0.5"/>
      <ellipse cx="${-r * 0.35}" cy="${-r * 0.4}" rx="${r * 0.32}" ry="${r * 0.18}" fill="#fff" opacity="0.85" transform="rotate(-25 ${-r * 0.35} ${-r * 0.4})"/>
      <ellipse cx="${r * 0.4}" cy="${r * 0.45}" rx="${r * 0.18}" ry="${r * 0.08}" fill="#fff" opacity="0.4"/></g>`;
  }
  function trazo(cx, cy, color, brillo = 0.5) {
    const d = 'M-330 40 C-250 -70 -120 -90 -10 -60 C120 -26 240 -80 330 -40 C350 10 300 70 230 70 C120 70 0 110 -120 100 C-220 92 -320 110 -330 40 Z';
    return `<g transform="translate(${cx} ${cy}) rotate(-8)">
      <path d="${d}" fill="#1E2D2B" opacity="0.08" filter="url(#sb8)" transform="translate(6 10)"/>
      <path d="${d}" fill="${color}" opacity="0.85"/>
      <path d="${d}" fill="${color}" filter="url(#tela)" opacity="0.7"/>
      <path d="M-280 20 C-180 -50 -60 -40 60 -30 C160 -22 240 -50 300 -30" stroke="#fff" stroke-width="16" stroke-linecap="round" fill="none" opacity="${brillo}" filter="url(#sb8)"/></g>`;
  }
  function espuma(cx, cy) {
    let s = `<g transform="translate(${cx} ${cy})"><ellipse cx="16" cy="20" rx="230" ry="160" fill="#1E2D2B" opacity="0.12" filter="url(#sb20)"/>`;
    let seed = 11;
    for (let i = 0; i < 70; i++) {
      seed = (seed * 9301 + 49297) % 233280; const a = (seed / 233280) * Math.PI * 2;
      seed = (seed * 9301 + 49297) % 233280; const rr = Math.sqrt(seed / 233280);
      seed = (seed * 9301 + 49297) % 233280; const r = 14 + (seed % 34);
      const x = Math.cos(a) * rr * 200, y = Math.sin(a) * rr * 130;
      s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#FBFCFA" stroke="#DDE6DC" stroke-width="2"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.35}" r="${r * 0.22}" fill="#fff"/>`;
    }
    return s + '</g>';
  }
  function capsula(x, y, rot, c1, c2, k = 1) {
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${k})">
      <rect x="-34" y="-14" width="68" height="28" rx="14" fill="#1E2D2B" opacity="0.18" filter="url(#sb8)" transform="translate(4 6)"/>
      <path d="M0 -14 L-20 -14 A14 14 0 0 0 -20 14 L0 14 Z" fill="${c1}"/><path d="M0 -14 L20 -14 A14 14 0 0 1 20 14 L0 14 Z" fill="${c2}"/>
      <rect x="-28" y="-9" width="44" height="5" rx="2.5" fill="#fff" opacity="0.45"/></g>`;
  }
  function pastilleroArriba(cx, cy, conCapsulas) {
    let s = `<g transform="translate(${cx} ${cy})"><rect x="-470" y="-110" width="940" height="230" rx="34" fill="#1E2D2B" opacity="0.16" filter="url(#sb20)" transform="translate(10 16)"/>`;
    const caps = [['#E4B23C', '#F4E3B5'], ['#A9BBA2', '#E9EFE4'], ['#9DB8BF', '#E2ECEE'], ['#D8C6A0', '#F2EBDC']];
    for (let i = 0; i < 7; i++) {
      const x = -455 + i * 130;
      s += `<rect x="${x}" y="-100" width="120" height="210" rx="22" fill="#F4F1E8"/><rect x="${x + 8}" y="-92" width="104" height="194" rx="16" fill="#E7E2D5"/>
        <text x="${x + 60}" y="-56" text-anchor="middle" font-family="${SANS}" font-weight="700" font-size="26" fill="${BOTANICO}">${DIAS[i]}</text>`;
      if (conCapsulas) {
        s += capsula(x + 42, 6, 30 + i * 7, caps[i % 4][0], caps[i % 4][1], 0.72) + capsula(x + 76, 52, -40 + i * 5, caps[(i + 1) % 4][0], caps[(i + 1) % 4][1], 0.72);
      }
    }
    return s + '</g>';
  }

  function texturas(p, lado) {
    const W = 1200, H = 900; const c = p.comparacion; const color = lado === 'antes' ? c.colorA : c.colorB;
    let obj = '';
    switch (p.id) {
      case 'proteina-vegetal-vainilla':
      case 'colageno-frutos-rojos':
        obj = lado === 'antes' ? cuchara(560, 460, color) : vaso(600, 450, 210, color, p.id === 'proteina-vegetal-vainilla'); break;
      case 'ritual-matinal':
        obj = lado === 'antes' ? cuchara(560, 460, color) : taza(560, 450, 170, color); break;
      case 'infusion-calma':
        obj = lado === 'antes' ? cuchara(560, 460, color) : taza(560, 450, 170, color); break;
      case 'serum-hialuronico':
        obj = lado === 'antes' ? gota(600, 450, 120, '#DCEBEE') : trazo(600, 450, '#DCEBEE', 0.75); break;
      case 'crema-manos-karite':
        obj = lado === 'antes' ? gota(600, 450, 140, '#FAF6EE') + `<ellipse cx="600" cy="440" rx="60" ry="40" fill="#fff" opacity="0.5" filter="url(#sb8)"/>` : trazo(600, 450, '#F7F2E8', 0.4); break;
      case 'balsamo-labial-cacao':
        obj = lado === 'antes'
          ? `<g transform="translate(600 450) rotate(-30)"><rect x="-260" y="-58" width="380" height="116" rx="20" fill="#1E2D2B" opacity="0.18" filter="url(#sb20)" transform="translate(10 16)"/><rect x="-260" y="-58" width="300" height="116" rx="12" fill="#F1E7DA"/><rect x="40" y="-46" width="70" height="92" fill="#E9D6BC"/><path d="M110 -46 L150 -30 Q168 0 150 30 L110 46 Z" fill="#E4CFB2"/><rect x="-250" y="-58" width="80" height="116" fill="#9DB8BF"/></g>`
          : trazo(600, 450, '#E9D6BC', 0.6); break;
      case 'gel-ducha-eucalipto':
        obj = lado === 'antes' ? gota(600, 450, 150, '#CFE0CF') : espuma(600, 450); break;
      default: obj = '';
    }
    return svgDoc(W, H, superficie(W, H, p.categoria === 'cosmetica' || p.categoria === 'cuidado-personal' ? '#ECE7DE' : '#EFE8DA') + `<g transform="translate(600 450) scale(${p.id.includes('serum') || p.id.includes('crema') || p.id.includes('balsamo') ? 1.5 : 1.25}) translate(-600 -450)">${obj}</g>` + grano(W, H));
  }

  function organizacion(lado) {
    const W = 1200, H = 900;
    let s = superficie(W, H, '#EDE7DB');
    if (lado === 'antes') {
      const caps = [['#E4B23C', '#F4E3B5'], ['#A9BBA2', '#E9EFE4'], ['#9DB8BF', '#E2ECEE'], ['#D8C6A0', '#F2EBDC']];
      let seed = 5;
      for (let i = 0; i < 26; i++) {
        seed = (seed * 9301 + 49297) % 233280; const x = 160 + (seed % 880);
        seed = (seed * 9301 + 49297) % 233280; const y = 160 + (seed % 600);
        seed = (seed * 9301 + 49297) % 233280;
        s += capsula(x, y, seed % 180, caps[i % 4][0], caps[i % 4][1], 1.1);
      }
      [[300, 300, '#8A4B12'], [860, 620, '#1F4B5A'], [760, 230, '#7A4A1A']].forEach(([x, y, c]) => {
        s += `<circle cx="${x + 10}" cy="${y + 14}" r="92" fill="#1E2D2B" opacity="0.2" filter="url(#sb20)"/><circle cx="${x}" cy="${y}" r="88" fill="${c}"/><circle cx="${x}" cy="${y}" r="70" fill="#F3EFE6"/>
          <circle cx="${x}" cy="${y}" r="70" fill="none" stroke="#000" stroke-opacity="0.06" stroke-width="10" stroke-dasharray="3 6"/>`;
      });
    } else {
      s += pastilleroArriba(600, 450, true);
    }
    return svgDoc(W, H, s + grano(W, H));
  }

  function comparar(p, lado) {
    const t = p.comparacion.tipo;
    if (t === 'textura') return texturas(p, lado);
    if (t === 'organizacion') return organizacion(lado);
    return escenaEstudio(p, 'frente', 1200, 900, { antes: lado === 'antes' });
  }

  // ---------- grupos (categorías, héroe, Open Graph) ----------
  function grupo(ids, W, H, o = {}) {
    const ps = ids.map(catalogo.porId);
    const base = H * (o.base || 0.82);
    const tono = o.tono || tonoDe(ps[0]);
    const anchoUtil = W * (o.ancho || 0.78); const x0 = (o.x0 != null ? o.x0 : (W - anchoUtil) / 2);
    const paso = anchoUtil / ps.length;
    let s = o.transparente ? '' : fondoEstudio(W, H, tono, o.horizonte || 0.68, true);
    // de atrás hacia adelante: los extremos un poco más atrás
    const orden = ps.map((p, i) => ({ p, i, z: -Math.abs(i - (ps.length - 1) / 2) })).sort((a, b) => (a.p.envase.forma === 'pastillero') - (b.p.envase.forma === 'pastillero') || a.z - b.z);
    orden.forEach(({ p, i, z }) => {
      const ancho = p.envase.forma === 'pastillero';
      const cx = ancho ? W * 0.4 : x0 + paso * (i + 0.5) + (ps.some((q) => q.envase.forma === 'pastillero') ? paso * 0.12 : 0);
      const b = ancho ? base + H * 0.06 : base + z * H * 0.03;
      s += colocar(p, 'frente', cx, b, H * altoBase(p) * (o.escala || 0.9) * (1 + z * 0.06), { maxW: ancho ? W * 0.56 : paso * 1.15 }).svg;
    });
    return svgDoc(W, H, s + (o.transparente ? '' : grano(W, H)) + (o.extra || ''));
  }

  function recorte(p) {
    const W = 800, H = 1000;
    const pr = colocar(p, 'frente', W / 2, H * 0.94, H * 0.88, { maxW: W * 0.92, sinSombra: true });
    return svgDoc(W, H, `<ellipse cx="${W / 2}" cy="${H * 0.94}" rx="${pr.w * 0.46}" ry="10" fill="#1E2D2B" opacity="0.32" filter="url(#sb8)"/>` + pr.svg);
  }

  function og() {
    const W = 1200, H = 630;
    const g = grupo(['serum-hialuronico', 'vitamina-c-zinc', 'infusion-calma', 'botella-termica'], W, H, { tono: '#A9BBA2', x0: 520, ancho: 0.52, base: 0.88, escala: 0.62, horizonte: 0.74,
      extra: `<text x="72" y="270" font-family="${SERIF}" font-size="92" letter-spacing="14" fill="${TINTA}">VITALIA</text>
        <text x="76" y="336" font-family="${SERIF}" font-size="40" fill="${TINTA}" opacity="0.8">Bienestar que se siente</text>
        <rect x="76" y="380" width="80" height="4" fill="#E4B23C"/>
        <text x="76" y="452" font-family="${SANS}" font-size="24" fill="${TINTA}" opacity="0.65">Tienda conceptual de demostración</text>` });
    return g;
  }

  // ---------- API ----------
  const ESCENAS = {
    frente: (p) => escenaEstudio(p, 'frente'),
    posterior: (p) => (p.ingredientes.length ? escenaEstudio(p, 'posterior') : escenaDetalle(p)),
    lateral: (p) => (p.envase.forma === 'pastillero'
      ? svgDoc(1000, 1250, fondoEstudio(1000, 1250, tonoDe(p), 0.38, false) + `<g transform="translate(500 760) scale(1.0) rotate(90)">${pastilleroArriba(0, 0, true).replace('<g transform="translate(0 0)">', '<g>')}</g>` + grano(1000, 1250))
      : escenaEstudio(p, 'lateral')),
    ingredientes: escenaIngredientes,
    entorno: escenaEntorno,
    presentacion: escenaPresentacion,
    'comparar-antes': (p) => comparar(p, 'antes'),
    'comparar-despues': (p) => comparar(p, 'despues'),
    recorte
  };
  const GRUPOS = {
    'bienestar-diario': ['infusion-calma', 'colageno-frutos-rojos'],
    nutricion: ['ritual-matinal', 'proteina-vegetal-vainilla'],
    vitaminas: ['omega-algas', 'vitamina-c-zinc', 'magnesio-noche'],
    'cuidado-personal': ['crema-manos-karite', 'gel-ducha-eucalipto'],
    cosmetica: ['serum-hialuronico', 'balsamo-labial-cacao'],
    accesorios: ['pastillero-semanal', 'botella-termica']
  };

  window.Estudio = {
    escena(id, vista) {
      const p = catalogo.porId(id);
      return ESCENAS[vista](p);
    },
    categoria(id) {
      const ids = GRUPOS[id];
      return grupo(ids, 1000, 1000, { escala: ids.length > 2 ? 0.74 : 0.86, ancho: ids.length > 2 ? 0.86 : 0.7 });
    },
    og,
    heroe: () => grupo(['colageno-frutos-rojos', 'serum-hialuronico', 'vitamina-c-zinc'], 1100, 800, { transparente: true, escala: 0.9, ancho: 0.9, base: 0.96 }),
    grupos: GRUPOS
  };

  function montar() {
    const [id, vista] = decodeURIComponent(location.hash.slice(1) || 'vitamina-c-zinc/frente').split('/');
    const raiz = document.getElementById('lienzo');
    raiz.innerHTML = id === 'categoria' ? window.Estudio.categoria(vista) : (id === 'og' ? og() : (id === 'heroe' ? window.Estudio.heroe() : window.Estudio.escena(id, vista)));
  }
  window.addEventListener('hashchange', montar);
  document.fonts.ready.then(montar);
})();
