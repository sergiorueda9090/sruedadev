#!/usr/bin/env node
/* =====================================================================
   OXI SMART — Generador SEO (Node.js ≥ 16, sin dependencias)
   ---------------------------------------------------------------------
   Lee assets/js/data/*.js (la misma fuente del sitio) y escribe:
     · En cada página, entre <!-- seo:start --> y <!-- seo:end -->:
       canonical, Open Graph, Twitter Card, verificación de Search Console
       y JSON-LD (Organization + WebSite en inicio, BreadcrumbList en el resto)
     · sitemap.xml (páginas + una URL por producto)
     · robots.txt
   Uso:  node tools/build-seo.js
   Ejecútelo cada vez que cambie el dominio, agregue productos o edite
   títulos/descripciones de las páginas.
   ===================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ["company", "categories", "products", "projects"]) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, "assets/js/data", `${f}.js`), "utf8"), ctx, { filename: `${f}.js` });
}
const { company: C, products = [] } = ctx.window.OXI;
const SITE = String(C.sitioWeb || "").replace(/\/$/, "");
if (!/^https:\/\//.test(SITE)) {
  console.error("✗ company.sitioWeb debe ser una URL https:// (ej. https://www.midominio.com)");
  process.exit(1);
}
const url = (p = "") => `${SITE}/${p}`;
const OG_IMAGE = "assets/images/banners/og-oxi-smart.jpg";
const today = new Date().toISOString().slice(0, 10);

const PAGES = [
  { file: "index.html", path: "", name: "Inicio", priority: "1.0" },
  { file: "nosotros.html", path: "nosotros.html", name: "Empresa", priority: "0.7" },
  { file: "catalogo.html", path: "catalogo.html", name: "Catálogo", priority: "0.9" },
  { file: "proyectos.html", path: "proyectos.html", name: "Proyectos", priority: "0.6" },
  { file: "contacto.html", path: "contacto.html", name: "Contacto", priority: "0.7" },
  { file: "producto.html", path: "producto.html", name: "Ficha técnica", dynamic: true }
];

const attr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const json = (o) => JSON.stringify(o, null, 2).replace(/</g, "\\u003c").split("\n").map((l) => "  " + l).join("\n");

function organization() {
  const sameAs = Object.values(C.redes || {}).filter(Boolean);
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE}/#organization`,
    name: C.nombre,
    url: url(),
    logo: url("assets/images/logo/oxi-logo.png"),
    description: C.descripcion,
    areaServed: C.pais
  };
  if (sameAs.length) org.sameAs = sameAs;
  if (C.email) org.email = C.email;
  const phone = C.telefono || (C.whatsapp ? `+${C.whatsapp}` : null);
  if (phone) org.contactPoint = [{ "@type": "ContactPoint", telephone: phone, contactType: "sales", areaServed: "CO", availableLanguage: "es" }];
  if (C.ciudad || C.direccion) {
    org.address = { "@type": "PostalAddress", addressCountry: "CO" };
    if (C.direccion) org.address.streetAddress = C.direccion;
    if (C.ciudad) org.address.addressLocality = C.ciudad;
  }
  return org;
}
const website = () => ({ "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE}/#website`, name: C.nombre, url: url(), inLanguage: "es-CO", publisher: { "@id": `${SITE}/#organization` } });
const breadcrumb = (pg) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: url() },
    { "@type": "ListItem", position: 2, name: pg.name, item: url(pg.path) }
  ]
});

for (const pg of PAGES) {
  const file = path.join(ROOT, pg.file);
  let html = fs.readFileSync(file, "utf8");
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || C.nombre;
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || C.descripcion;
  const lines = [
    `<link rel="canonical" href="${attr(url(pg.path))}">`,
    `<meta property="og:type" content="${pg.dynamic ? "product" : "website"}">`,
    `<meta property="og:site_name" content="${attr(C.nombre)}">`,
    `<meta property="og:locale" content="es_CO">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${desc}">`,
    `<meta property="og:url" content="${attr(url(pg.path))}">`,
    `<meta property="og:image" content="${attr(url(OG_IMAGE))}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta name="twitter:card" content="summary_large_image">`
  ];
  if (C.analytics && C.analytics.searchConsole) lines.push(`<meta name="google-site-verification" content="${attr(C.analytics.searchConsole)}">`);
  const ld = [];
  if (pg.file === "index.html") ld.push(organization(), website());
  else if (!pg.dynamic) ld.push(breadcrumb(pg)); // producto.html genera su BreadcrumbList/Product en el navegador
  const block = [
    "<!-- seo:start -->",
    "  <!-- Generado por tools/build-seo.js — no editar a mano -->",
    ...lines.map((l) => "  " + l),
    ...ld.map((o) => `  <script type="application/ld+json">\n${json(o)}\n  </script>`),
    "  <!-- seo:end -->"
  ].join("\n");
  if (!/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/.test(html)) { console.error(`✗ ${pg.file}: faltan los marcadores seo`); continue; }
  html = html.replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, block);
  fs.writeFileSync(file, html);
  console.log(`✓ ${pg.file}`);
}

/* sitemap.xml */
const esc = (s) => s.replace(/&/g, "&amp;");
const entries = PAGES.filter((p) => !p.dynamic).map((p) => ({ loc: url(p.path), pr: p.priority }))
  .concat(products.map((p) => ({ loc: url(`producto.html?id=${encodeURIComponent(p.id)}`), pr: "0.8" })));
fs.writeFileSync(path.join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  entries.map((e) => `  <url>\n    <loc>${esc(e.loc)}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${e.pr}</priority>\n  </url>`).join("\n") +
  `\n</urlset>\n`);
console.log(`✓ sitemap.xml (${entries.length} URL)`);

/* robots.txt */
fs.writeFileSync(path.join(ROOT, "robots.txt"),
  `# Oxi Smart Ingeniería\nUser-agent: *\nAllow: /\nDisallow: /tools/\nDisallow: /docs/\n\nSitemap: ${url("sitemap.xml")}\n`);
console.log("✓ robots.txt");
