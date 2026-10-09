# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this directory is

A collection of ~20 **standalone HTML landing page designs** in Spanish, each targeting a different industry (dental clinic, lawyer, gym, vet, travel agency, psychology, construction, insurance, spa, moving company, etc.). These are self-contained mockups / design references — **not** part of the active Django site in the parent directory (`C:\proyectos\sergio\`). See the parent `CLAUDE.md` for the Django project.

Each `.html` file is a complete, single-file landing page: HTML + all CSS in a `<style>` block + JS inline. No build step, no bundler, no package manager, no tests.

Files are large (typically 600–2300 lines; ~33k lines across the directory). Use `Grep` or `Read` with `offset`/`limit` to target the `:root` palette, a specific component class, or the `<body>` section rather than reading a whole file.

## Running / previewing

Just open the file in a browser. No server or dependencies required — Bootstrap, Bootstrap Icons, and Google Fonts all load from CDNs at runtime.

```bash
# Windows
start consultorio-dental.html
```

## Conventions across files

- **Language**: Spanish (`<html lang="es">`)
- **Stack**: Bootstrap 5.3.x + Bootstrap Icons + Google Fonts via CDN — no local assets. Most files also load `bootstrap.bundle.min.js` for interactive components.
- **CSS**: Inline inside `<style>`. Each file defines its own palette as CSS custom properties under `:root` (e.g. `--blue`, `--teal`, `--bg`, `--cyan`, `--magenta`). Palettes and token names differ per file — do **not** assume tokens from one file exist in another.
- **SEO**: Most files include `<meta description>`, Open Graph tags, and a Schema.org JSON-LD block. Placeholders like `[NOMBRE]`, `[TU EMAIL]`, `[LINKEDIN URL]`, `tudominio.com` mean "fill in before publishing."

## Two aesthetic families

Files roughly split into two visual styles:

1. **Light / professional** (business verticals) — e.g. `consultorio-dental.html`, `abogado-corporativo.html`, `constructora.html`, `seguro.html`. White/pastel backgrounds, Nunito/Lora-style serif pairing, blue/teal palettes.
2. **Dark / tech** (developer-focused) — e.g. `developer.html`, `dev-software-landing.html`, `test.html`, `system_prompt.html`. Near-black backgrounds, neon accents (cyan/magenta/green/yellow), DM Sans + Unbounded or Sora + JetBrains Mono.

When editing, stay within the file's existing palette and font pairing unless the user asks for a redesign.

## Editing guidelines

- Each file is independent. A change in one file should not affect any other — do **not** factor shared CSS out into a new file unless the user explicitly asks.
- For a new landing page, the fastest path is usually to **duplicate the closest existing file** (same industry vertical or same aesthetic family) and rewrite the content.
- Keep Spanish copy unless the user requests English.
