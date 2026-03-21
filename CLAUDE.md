# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio and educational website for Sergio Rueda, a fullstack developer based in Bucaramanga, Colombia. Built with Django 4.2, Bootstrap 5.3.3, and vanilla JavaScript. Spanish is the primary language. The site has two distinct sections: a services portfolio and a learning/tutorials platform.

## Commands

```bash
# Run dev server (port 80 may require admin; use 8080)
python manage.py runserver 8080

# System check
python manage.py check

# Migrations (MySQL backend, db name: srueda)
python manage.py migrate
```

No build step, no linter, no test suite configured.

## Architecture

### Django Project Layout

- **`srueda/`** — Django project config (settings, root urls, wsgi/asgi)
- **`web/`** — Single Django app. All views are simple `render()` calls in `views.py`. URL namespace is `web` (use `{% url 'web:index' %}` in templates)
- **`templates/`** — All Django templates (configured via `TEMPLATES['DIRS']` in settings)
- **`web/static/`** — CSS, JS, images (configured via `STATICFILES_DIRS` in settings)

### Two Template Systems

The site has **two independent visual designs** with separate base templates:

**1. Portfolio site** (`base.html`) — Services, projects, about, contact
- Uses Bootstrap 5.3.3 + Bootstrap Icons + `web/static/css/styles.css`
- Dark/light theme toggle via CSS custom properties (`theme-dark`/`theme-light` on `<body>`, persisted in localStorage)
- Glassmorphism design (`.glass` class), accent colors `.accent-1` through `.accent-11`
- Template blocks: `title`, `meta_description`, `canonical`, `og_title`, `og_description`, `og_url`, `og_type`, `twitter_title`, `twitter_description`, `extra_head`, `extra_schema`, `content`, `extra_js`

**2. Learning site** (`pages/learning_base.html`) — Tutorial lessons
- Standalone design: Space Grotesk + JetBrains Mono fonts, Font Awesome 6 icons, GitHub-dark aesthetic
- All CSS is inline in the base template (not in external files)
- `learning.html` is also standalone (does NOT extend either base template)
- Template blocks: `title`, `content`, `extra_js`

### Template Structure

```
templates/
  base.html                    — Portfolio base (head, SEO schemas, nav, footer)
  partials/_header.html        — Portfolio navbar ({% include %})
  partials/_footer.html        — Portfolio footer
  partials/_whatsapp.html      — Floating WhatsApp button
  sections/_*.html             — Homepage section fragments (13 files)
  pages/
    index.html                 — Homepage (extends base.html, includes sections)
    learning.html              — Tutorial catalog (standalone, own CSS)
    learning_base.html         — Base for lesson pages (standalone, own CSS)
    testing_temario.html       — 21-day testing course syllabus (extends learning_base)
    testing_dia[1-3].html      — Individual lesson days (extend learning_base)
```

### Adding a New Portfolio Page

1. Create `templates/pages/page.html` extending `base.html`
2. Add view in `web/views.py`: `return render(request, 'pages/page.html')`
3. Add URL in `web/urls.py`

### Adding a New Lesson Day

1. Create `templates/pages/course_diaN.html` extending `pages/learning_base.html`
2. Add view and URL following the `testing_dia*` pattern
3. Update navigation links (prev/next) in adjacent day templates
4. Update the temario page to link to the new day

### URL Routes (app_name: `web`)

| URL | Name | Template |
|---|---|---|
| `/` | `index` | Homepage |
| `/learning/` | `learning` | Tutorial catalog |
| `/learning/testing-django/` | `testing_temario` | Course syllabus |
| `/learning/testing-django/dia-N/` | `testing_diaN` | Lesson day N |
| `/robots.txt` | `robots` | Served from file |
| `/sitemap.xml` | `sitemap` | Served from file |

### SEO

- JSON-LD schemas in `base.html`: `ProfessionalService` (with 6 `Service` offers) and `WebSite`
- Per-page schemas via `{% block extra_schema %}`
- Twitter Cards and Open Graph tags fully configured
- `robots.txt` and `sitemap.xml` served via Django views (not static files)

### Placeholders (need real values before production)

- WhatsApp: `57XXXXXXXXXX`
- Domain: `sergiorueda.dev`
- Missing assets: `og-cover.jpg`, `favicon-32.png`, `favicon-16.png`, `apple-touch-icon.png`
- Database credentials in `srueda/settings.py` are hardcoded — should use environment variables for production

### Non-project directories

- **`env/`** — Python virtual environment (not project code)
- **`Fw_ paginas web/`** — Collection of standalone HTML landing page designs (not part of the active Django site)
