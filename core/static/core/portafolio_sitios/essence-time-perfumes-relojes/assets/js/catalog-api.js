/* ==========================================================================
   ESSENCE & TIME — API del catálogo
   Consultas sobre ET.products (assets/js/products.js): búsqueda, variantes,
   relacionados y facetas. Sin dependencias del DOM.
   ========================================================================== */
(function (ET) {
  'use strict';

  const { config, utils } = ET;
  const products = ET.products || [];
  const byIdMap = new Map(products.map((p) => [p.id, p]));
  const bySlugMap = new Map(products.map((p) => [p.slug, p]));

  const categoryLabel = (slug) => (config.categories.find((c) => c.slug === slug) || {}).label || '';
  const subcategoryLabel = (cat, sub) => {
    const c = config.categories.find((x) => x.slug === cat);
    return (c && (c.subcategories.find((s) => s.slug === sub) || {}).label) || '';
  };
  const GENDER_LABEL = { mujer: 'Mujer', hombre: 'Hombre', unisex: 'Unisex' };
  const GENDER_WORDS = { mujer: 'mujer ella femenino', hombre: 'hombre el masculino', unisex: 'unisex' };

  /* ---- Índice de búsqueda (se construye una vez) ----------------------- */
  const STOP = new Set(['de', 'del', 'para', 'el', 'la', 'los', 'las', 'y', 'con', 'en', 'un', 'una', 'por', 'a']);

  const index = products.map((p) => {
    const w = p.watch || {};
    const fields = {
      name: utils.normalize(p.name),
      brand: utils.normalize(p.brand),
      category: utils.normalize(`${categoryLabel(p.category)} ${subcategoryLabel(p.category, p.subcategory)} ${p.productType || ''}`),
      attrs: utils.normalize([
        GENDER_WORDS[p.gender] || '',
        p.concentration, p.family, p.accord, p.productType,
        ...(p.notes ? [...p.notes.top, ...p.notes.heart, ...p.notes.base] : []),
        w.caseMaterial, w.strapMaterial, w.strapType, w.dialColor, w.movement, w.style, w.color,
        ...(p.tags || []), p.short,
      ].filter(Boolean).join(' ')),
    };
    const words = new Set(Object.values(fields).join(' ').split(' ').filter((x) => x.length > 1));
    return { p, fields, words };
  });

  const vocabulary = new Set();
  index.forEach((entry) => entry.words.forEach((w) => { if (w.length >= 4) vocabulary.add(w); }));

  function tokenMatches(field, token) {
    if (!field) return false;
    if (token.length < 3) return field.split(' ').some((word) => word === token);
    return field.split(' ').some((word) => word.startsWith(token) || (token.length >= 4 && word.startsWith(token.replace(/(es|s)$/, ''))))
      || field.includes(token);
  }

  function levenshtein(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 3;
    const row = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i += 1) {
      let prev = row[0];
      row[0] = i;
      for (let j = 1; j <= b.length; j += 1) {
        const tmp = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = tmp;
      }
    }
    return row[b.length];
  }

  /* ---- API ---------------------------------------------------------------- */
  const catalog = {
    all() { return products.slice(); },
    byId(id) { return byIdMap.get(id) || null; },
    bySlug(slug) { return bySlugMap.get(slug) || null; },
    inCategory(cat) { return products.filter((p) => p.category === cat); },

    categoryLabel,
    subcategoryLabel,
    genderLabel(g) { return GENDER_LABEL[g] || ''; },

    variant(product, vid) {
      if (!product) return null;
      return product.variants.find((v) => v.id === vid) || null;
    },
    /** Primera variante con stock; si todas están agotadas, la primera. */
    defaultVariant(product) {
      return product.variants.find((v) => v.stock > 0) || product.variants[0];
    },
    hasChoice(product) { return product.variants.length > 1; },
    totalStock(product) { return product.variants.reduce((n, v) => n + Math.max(0, v.stock), 0); },
    isAvailable(product) { return this.totalStock(product) > 0; },
    minPrice(product) { return Math.min(...product.variants.map((v) => v.price)); },
    /** Precio que se muestra en listados: el de la variante por defecto. */
    displayVariant(product) { return this.defaultVariant(product); },
    discountPct(variant) {
      if (!variant.compareAt || variant.compareAt <= variant.price) return 0;
      return Math.round((1 - variant.price / variant.compareAt) * 100);
    },
    isNew(product) { return (product.tags || []).includes('nuevo'); },
    stockState(variant) {
      if (variant.stock <= 0) return 'out';
      if (variant.stock <= config.catalog.lowStockThreshold) return 'low';
      return 'in';
    },

    /** Línea breve de características para tarjetas. */
    metaLine(product) {
      const v = this.defaultVariant(product);
      if (product.category === 'relojes' && product.watch) {
        const w = product.watch;
        return [w.diameterMm ? `${w.diameterMm} mm` : null, w.caseMaterial, w.strapType].filter(Boolean).join(', ');
      }
      const vols = product.variants.map((x) => x.volumeMl).filter(Boolean);
      const volText = vols.length > 1 ? `${vols.join(' y ')} ml` : (v.volumeMl ? `${v.volumeMl} ml` : null);
      return [product.concentration || product.productType, volText].filter(Boolean).join(', ');
    },

    /** Relacionados: primero los indicados en los datos; luego por categoría, marca y etiquetas. */
    related(product, limit = 4) {
      const picked = (product.related || []).map((id) => byIdMap.get(id)).filter(Boolean);
      const scored = products
        .filter((p) => p.id !== product.id && !picked.includes(p))
        .map((p) => {
          let s = 0;
          if (p.category === product.category) s += 3;
          if (p.subcategory === product.subcategory) s += 2;
          if (p.brand === product.brand) s += 2;
          if (p.gender && p.gender === product.gender) s += 1;
          s += (p.tags || []).filter((t) => (product.tags || []).includes(t)).length;
          return { p, s };
        })
        .sort((a, b) => b.s - a.s || a.p.featured - b.p.featured)
        .map((x) => x.p);
      return [...picked, ...scored].slice(0, limit);
    },

    /** Búsqueda: todos los términos deben coincidir; puntúa por campo. */
    search(query) {
      const tokens = utils.normalize(query).split(' ').filter((t) => t && !STOP.has(t));
      if (!tokens.length) return [];
      const weights = { name: 6, brand: 5, category: 3, attrs: 1 };
      return index
        .map(({ p, fields }) => {
          let score = 0;
          const all = tokens.every((t) => {
            let hit = false;
            Object.entries(fields).forEach(([k, f]) => {
              if (tokenMatches(f, t)) { score += weights[k]; hit = true; }
            });
            return hit;
          });
          return all ? { p, score } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score || a.p.featured - b.p.featured)
        .map((x) => x.p);
    },

    /** Si un término no coincide con nada, propone la palabra más cercana del catálogo. */
    suggestQuery(query) {
      const tokens = utils.normalize(query).split(' ').filter((t) => t && !STOP.has(t));
      let changed = false;
      const fixed = tokens.map((t) => {
        if (t.length < 4 || [...vocabulary].some((w) => w.startsWith(t))) return t;
        let best = null;
        let bestD = 3;
        vocabulary.forEach((w) => {
          const d = levenshtein(t, w);
          if (d < bestD) { bestD = d; best = w; }
        });
        if (best) { changed = true; return best; }
        return t;
      });
      const suggestion = fixed.join(' ');
      return changed && this.search(suggestion).length ? suggestion : null;
    },
  };

  /* ---- Facetas ----------------------------------------------------------
     key = parámetro de URL. get(p) devuelve un array de etiquetas legibles;
     el valor del filtro es el slug de la etiqueta. Una faceta solo se
     muestra si en el conjunto actual hay 2 o más valores distintos.        */
  const slugify = (s) => utils.normalize(s).replace(/\s+/g, '-');
  const watchAttr = (k) => (p) => (p.watch && p.watch[k] ? [p.watch[k]] : []);
  const labelsFrom = (list) => (slugs) => (slugs || []).map((s) => (list.find((x) => x.slug === s) || {}).label).filter(Boolean);

  const FACETS = {
    cat:           { label: 'Categoría',        get: (p) => [p.category === 'regalos' ? subcategoryLabel(p.category, p.subcategory) : categoryLabel(p.category)] },
    sub:           { label: 'Tipo de producto', get: (p) => [subcategoryLabel(p.category, p.subcategory)].filter(Boolean) },
    genero:        { label: 'Género',           get: (p) => (p.gender ? [GENDER_LABEL[p.gender]] : []) },
    marca:         { label: 'Marca',            get: (p) => [p.brand] },
    concentracion: { label: 'Concentración',    get: (p) => (p.concentration ? [p.concentration] : []) },
    familia:       { label: 'Familia olfativa', get: (p) => (p.family ? [p.family] : []) },
    volumen:       { label: 'Volumen',          get: (p) => p.variants.map((v) => v.volumeMl).filter(Boolean).map((ml) => `${ml} ml`), sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
    correa:        { label: 'Tipo de correa',   get: watchAttr('strapType') },
    material:      { label: 'Material de caja', get: watchAttr('caseMaterial') },
    color:         { label: 'Color de esfera',  get: watchAttr('dialColor') },
    estilo:        { label: 'Estilo',           get: watchAttr('style') },
    // Facetas con slug propio en config: el valor de URL es el slug configurado
    momento:       { label: 'Momento de uso',   get: (p) => labelsFrom(config.moments)(p.moments),     slugOf: (l) => (config.moments.find((m) => m.label === l) || {}).slug },
    ocasion:       { label: 'Ocasión',          get: (p) => labelsFrom(config.occasions)(p.occasions), slugOf: (l) => (config.occasions.find((m) => m.label === l) || {}).slug },
  };

  /** Alcance de la página de regalos: categoría regalos + productos marcados como «regalo». */
  catalog.giftScope = () => products.filter((p) => p.category === 'regalos' || (p.tags || []).includes('regalo'));
  catalog.newScope = () => products.filter((p) => (p.tags || []).includes('nuevo'));

  catalog.slugify = slugify;
  catalog.FACETS = FACETS;

  /** Valores presentes de una faceta en un conjunto: [{ value, label, count }]. */
  catalog.facetValues = (key, list) => {
    const def = FACETS[key];
    const counts = new Map();
    list.forEach((p) => {
      new Set(def.get(p)).forEach((label) => {
        const value = (def.slugOf && def.slugOf(label)) || slugify(label);
        const prev = counts.get(value);
        counts.set(value, { value, label, count: (prev ? prev.count : 0) + 1 });
      });
    });
    const out = [...counts.values()];
    return out.sort(def.sort ? (a, b) => def.sort(a.label, b.label) : (a, b) => a.label.localeCompare(b.label, 'es'));
  };

  catalog.matchesFacet = (key, product, values) => {
    if (!values || !values.length) return true;
    const def = FACETS[key];
    const own = def.get(product).map((l) => (def.slugOf && def.slugOf(l)) || slugify(l));
    return values.some((v) => own.includes(v));
  };

  ET.catalog = catalog;
})(window.ET);
