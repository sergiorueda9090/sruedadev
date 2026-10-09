# Prompt maestro — Generador de landing pages
**Autor:** Sergio Rueda · **Plantilla base:** `_plantilla_maestra.html`

---

## Cómo usar este prompt

1. Copia TODO el bloque de abajo (a partir de `=== INICIO DEL PROMPT ===`).
2. Rellena los datos de **BLOQUE 1 — BRIEF DEL CLIENTE** antes de enviarlo.
3. Opcional: ajusta los datos de **BLOQUE 2 — PERSONALIZACIÓN**.
4. Pégalo en tu modelo (Claude, ChatGPT, Gemini).
5. Recibirás un archivo HTML único y autónomo listo para abrir en el navegador.

> Los campos marcados con `[...]` son los que DEBES rellenar.
> Los campos entre `{opcional}` pueden dejarse en blanco si no aplican.

---

## === INICIO DEL PROMPT ===

Eres un **desarrollador web senior y diseñador UI/UX** especializado en landing pages de alta conversión para negocios de servicios en Colombia y LATAM. Tu tarea es generar una landing page completa, responsive y lista para producción, siguiendo exactamente la estructura de la plantilla maestra descrita más abajo.

---

### BLOQUE 1 — BRIEF DEL CLIENTE (rellena antes de enviar)

**Información del negocio:**
- **Nicho / Rubro:** `[EJ: odontología, veterinaria, gym, spa, abogado, psicólogo, constructora, restaurante, estética, agencia de viajes, inmobiliaria, tienda online, clínica estética, academia, taller mecánico, etc.]`
- **Nombre del negocio:** `[EJ: DentalPro Smile]`
- **Tagline / slogan corto (máx. 8 palabras):** `[EJ: Sonríe con confianza toda la vida]`
- **Ciudad / país:** `[EJ: Bucaramanga, Colombia]`
- **Años de experiencia:** `[EJ: 15]`
- **Público objetivo:** `[EJ: familias de estrato 4-6, adultos 25-55 años]`
- **Propuesta de valor única (qué te diferencia):** `[EJ: tecnología 3D + financiación hasta 24 meses + garantía escrita]`

**Contacto:**
- **Dirección:** `[EJ: Carrera 35 #52-14, Cabecera]`
- **Teléfono / WhatsApp:** `[EJ: +57 300 123 4567]`
- **Email:** `[EJ: contacto@dentalprosmile.co]`
- **Dominio:** `[EJ: dentalprosmile.co]`
- **Horarios:** `[EJ: Lun-Vie 8:00-18:00, Sáb 9:00-13:00]`
- **Redes sociales:** `{Instagram, Facebook, TikTok, LinkedIn — déjame @handles o marca "omitir"}`

**Servicios / productos (mínimo 3, recomendado 6):**
- Servicio 1: `[nombre — descripción corta — precio desde $]`
- Servicio 2: `[...]`
- Servicio 3: `[...]`
- Servicio 4: `{opcional}`
- Servicio 5: `{opcional}`
- Servicio 6: `{opcional}`

**Equipo / profesionales (opcional, ideal 3-4):**
- Persona 1: `[nombre — cargo — credencial corta]`
- Persona 2: `[...]`
- Persona 3: `{opcional}`
- Persona 4: `{opcional}`

**Planes de precio (3 columnas, el del medio destacado):**
- Plan básico: `[nombre — precio — 4-5 beneficios]`
- Plan medio (destacado): `[nombre — precio — 5-6 beneficios]`
- Plan premium: `[nombre — precio — 5-6 beneficios]`

> Si no hay planes estandarizables, indica: `SIN PRECIOS PÚBLICOS` y reemplazaré la sección por un flujo de "Cómo trabajamos" en 4 pasos.

**Testimonios (3 clientes reales o realistas):**
- Testimonio 1: `[texto — nombre — cargo/ciudad]`
- Testimonio 2: `[...]`
- Testimonio 3: `[...]`

**FAQ (5 preguntas típicas del rubro):**
- Pregunta 1 + respuesta: `[...]`
- Pregunta 2 + respuesta: `[...]`
- Pregunta 3 + respuesta: `[...]`
- Pregunta 4 + respuesta: `[...]`
- Pregunta 5 + respuesta: `[...]`

> Si no las tienes, indica `GENERA FAQ TÍPICAS` y las crearás tú basadas en el rubro.

**Estilo visual deseado:**
- **Ambiente:** `[elegante / cálido / vibrante / minimalista / lujoso / técnico / infantil-amigable / premium-oscuro]`
- **Sensación de marca:** `[confianza / energía / calma / diversión / seriedad / sofisticación]`

---

### BLOQUE 2 — PERSONALIZACIÓN (opcional)

- **Idioma:** Español (Colombia) por defecto.
- **Moneda:** COP (pesos colombianos) por defecto.
- **Ubicación del mapa:** si no entrego coordenadas, deja el iframe con placeholder `[PEGA_AQUI_EMBED_GOOGLE_MAPS]`.
- **Imágenes:** usa `https://picsum.photos/seed/[KEYWORD]/W/H` con seeds temáticos del nicho para que sean estables entre recargas.

---

### BLOQUE 3 — ESPECIFICACIÓN TÉCNICA (obligatoria, no modificar)

#### Stack
- **HTML5 + CSS3 + JS vanilla** en un solo archivo autónomo.
- **Bootstrap 5.3.3** y **Bootstrap Icons 1.11.3** vía CDN (jsdelivr).
- **Google Fonts** vía CDN — elige el par según el nicho (ver tabla más abajo).
- **Sin frameworks JS adicionales**, sin build step, sin npm.
- Todo el CSS va inline en una sola etiqueta `<style>` dentro del `<head>`.
- Todo el JS va al final, antes del `</body>`.

#### Estructura obligatoria (14 secciones en este orden)

1. **Navbar sticky** con scroll detection (transparente → blanco al hacer scroll), logo + 5-6 enlaces + CTA destacado + hamburguesa en móvil.
2. **Hero** a pantalla completa con imagen/gradiente de fondo, badge de confianza, H1 con palabra clave en itálica, subtítulo de 1 línea, 2 CTAs (primario + secundario).
3. **Trust bar** (barra de métricas) — 4 números de confianza con etiqueta corta.
4. **Servicios** — grid de tarjetas con icono circular, título, descripción y precio "desde".
5. **Nosotros / Por qué elegirnos** — imagen a un lado + 3-4 razones diferenciadoras con íconos.
6. **Equipo** — tarjetas cuadradas con foto, nombre, rol y bio de 1 línea. *(Omitir si no aplica al rubro).*
7. **Galería / Antes-después / Portfolio** — grid 3 columnas con hover effect. *(Omitir si no aplica).*
8. **Precios** — 3 columnas, la del medio destacada con etiqueta "MÁS POPULAR". *(Reemplazar por "Cómo trabajamos" si no hay precios públicos).*
9. **Testimonios** — 3 tarjetas con estrellas, texto en itálica, foto + nombre + cargo.
10. **FAQ** — acordeón vertical de 5 preguntas, con una columna lateral de texto + CTA de WhatsApp.
11. **CTA de cierre** — franja a todo el ancho con gradiente de marca, título + subtítulo + 2 botones.
12. **Contacto + Mapa** — formulario de 4-5 campos a la izquierda; tarjetas de info (ubicación, tel, email, horarios) + iframe de Google Maps a la derecha.
13. **Footer** — 3 columnas (marca+social, enlaces, contacto) + línea de copyright con NIT y enlaces legales.
14. **Flotantes**: botón de WhatsApp (con animación de flotado + ondas expansivas + wiggle del ícono) y botón "subir" que aparece tras 500px de scroll.

#### Responsive (obligatorio)

Breakpoints escalonados:

| Rango | Dispositivo | Ajustes clave |
|---|---|---|
| ≥ 1920px | 4K / ultra-wide | `font-size: 17px`, container 1500px |
| ≥ 1400px | Desktop grande | Container 1320px |
| 992-1199px | Laptop | Hero compacto |
| 768-991px | Tablet | Nav móvil activo, secciones 80px |
| 576-767px | Móvil grande | CTAs apilados, flotantes 52px |
| 361-575px | Móvil | `font-size: 15px` |
| ≤ 360px | iPhone SE | `font-size: 14px`, galería 1 col |

**Además:**
- `viewport-fit=cover` + `env(safe-area-inset-*)` para iPhones con notch.
- `theme-color` en meta con el color primario de marca.
- Inputs con `font-size: 16px` (anti-zoom iOS).
- Media query para landscape en móvil (altura limitada).
- `@media (prefers-reduced-motion: reduce)` que desactive animaciones.
- `@media print` que oculte nav, flotantes y CTAs.

#### Animaciones del botón de WhatsApp (obligatorias)

- **Flotación vertical**: sube/baja 8px cada 3s, ease-in-out.
- **Dos ondas expansivas** (pseudo-elementos `::before` y `::after`): escalan de 1 a 2.4x con opacidad 0.55 → 0, desfasadas 1.1s.
- **Wiggle del ícono**: rotación ±12° al final del ciclo de 3s.
- **Hover**: pausa todo, escala a 1.12x, sube 4px, sombra verde intensa.
- Las ondas van en `z-index: -1` respecto al botón (dentro de su stacking context).

#### SEO (obligatorio)

- `<title>` y `<meta name="description">` únicos para el negocio.
- Open Graph completo (`og:type`, `og:title`, `og:description`, `og:url`, `og:image`, `og:locale=es_CO`).
- Twitter Cards (`summary_large_image`).
- `<link rel="canonical">` al dominio.
- Favicons (`favicon-32.png`, `favicon-16.png`, `apple-touch-icon.png`).
- **JSON-LD Schema.org** con el `@type` correcto según el rubro:

| Rubro | `@type` recomendado |
|---|---|
| Médico / clínica | `MedicalBusiness` |
| Odontología | `Dentist` |
| Veterinaria | `VeterinaryCare` |
| Abogado / bufete | `LegalService` o `Attorney` |
| Gym / fitness | `ExerciseGym` |
| Spa / estética / belleza | `HealthAndBeautyBusiness` |
| Constructora | `GeneralContractor` |
| Restaurante | `Restaurant` |
| Hotel | `LodgingBusiness` |
| Inmobiliaria | `RealEstateAgent` |
| Taller mecánico | `AutoRepair` |
| Academia / curso | `EducationalOrganization` |
| Psicólogo | `MedicalBusiness` (specialty) |
| Agencia de viajes | `TravelAgency` |
| Por defecto | `LocalBusiness` |

El JSON-LD debe incluir `name`, `description`, `url`, `telephone`, `email`, `priceRange`, `image`, `address` (PostalAddress), `geo` (GeoCoordinates), `openingHoursSpecification` y `aggregateRating`.

#### Accesibilidad

- Contraste AA mínimo en todo el texto.
- `alt` descriptivo en todas las imágenes.
- `aria-label` en botones con solo ícono (WhatsApp, scroll-top, menú móvil).
- `<label>` en todos los inputs del formulario.
- Checkbox de política de tratamiento de datos (obligatorio en Colombia — Ley 1581).

#### JavaScript mínimo requerido

- Año dinámico en footer (`new Date().getFullYear()`).
- Scroll detection para navbar y botón scroll-top.
- Toggle del menú móvil + cierre al hacer clic en un enlace.
- FAQ acordeón (solo uno abierto a la vez).
- Scroll reveal con `IntersectionObserver` (clase `.reveal` + `.visible`).
- Validación básica del formulario con `checkValidity()` + alert (comentario TODO para integrar Formspree/EmailJS/backend).

---

### BLOQUE 4 — PALETA DE COLORES POR NICHO

Antes de escribir el HTML, genera primero una **tabla de paleta** para el rubro con estas columnas:

| Token CSS | HEX | Nombre | Uso |
|---|---|---|---|
| `--primary` | `#xxxxxx` | `[nombre]` | Color dominante, CTAs, acentos fuertes |
| `--primary-dark` | `#xxxxxx` | `[nombre]` | Hover, footer, títulos |
| `--primary-light` | `#xxxxxx` | `[nombre]` | Gradientes, detalles |
| `--accent` | `#xxxxxx` | `[nombre]` | Acento secundario, eyebrows, iconos |
| `--accent-light` | `#xxxxxx` | `[nombre]` | Gradientes del accent |
| `--bg` | `#ffffff` o similar | Blanco / base | Fondo principal |
| `--surface` | `#xxxxxx` | `[nombre]` | Fondo de secciones alternas |
| `--border` | `#xxxxxx` | `[nombre]` | Bordes sutiles |
| `--text` | `#xxxxxx` | `[nombre]` | Títulos |
| `--text-body` | `#xxxxxx` | `[nombre]` | Párrafos |
| `--text-muted` | `#xxxxxx` | `[nombre]` | Metadatos, placeholders |

**Reglas para la paleta:**
- Máximo 3 colores dominantes + 2 neutros.
- Contraste AA en todos los pares texto/fondo.
- Tono emocional acorde al rubro (ver guía abajo).
- Incluye justificación breve de 2 líneas al final de la tabla explicando por qué eliges esos colores para ESTE rubro específico.

**Guía tonal por rubro (úsala como punto de partida, no copia literal):**

| Rubro | Paleta sugerida | Fuentes sugeridas |
|---|---|---|
| Médico / odontólogo / veterinario | Azul marino + teal + blanco | Nunito + Lora |
| Spa / estética / belleza | Rosa palo + dorado + crema | Playfair Display + Poppins |
| Gym / deporte | Negro + rojo/naranja vibrante + amarillo | Bebas Neue + Inter |
| Abogado / corporativo | Azul marino + dorado + gris | Merriweather + Inter |
| Psicología / bienestar | Verde salvia + beige + terracota | Fraunces + DM Sans |
| Constructora / industrial | Negro + naranja + gris carbón | Archivo Black + Inter |
| Viajes / turismo | Turquesa + naranja coral + blanco | Poppins + Caveat |
| Restaurante gourmet | Borgoña + dorado + crema oscura | Cormorant Garamond + Lato |
| Inmobiliaria premium | Azul petróleo + oro + blanco hueso | Playfair + Montserrat |
| Tech / software / dev | Negro + cyan/magenta neón | DM Sans + JetBrains Mono |
| Academia infantil | Amarillo + rosa + azul cielo | Fredoka + Nunito |
| Veterinaria familiar | Verde menta + amarillo cálido | Nunito + Caveat |

---

### BLOQUE 5 — FORMATO DE ENTREGA

Responde en **este orden exacto**:

1. **Resumen de 3-4 líneas** sobre el enfoque conceptual que vas a darle a la landing (tono, ángulo comercial, beneficio central del hero).
2. **Tabla de paleta de colores** según BLOQUE 4, con justificación.
3. **Tabla de tipografías** (fuente display + fuente body + URL de Google Fonts).
4. **Archivo HTML completo** en un solo bloque de código, listo para guardar como `[nombre-cliente].html` y abrir en el navegador sin más.

**No incluyas:**
- Explicaciones largas fuera de las tablas pedidas.
- Archivos CSS/JS separados.
- Dependencias de npm o build steps.
- Mock de backend — solo formulario con TODO comentado.

---

### BLOQUE 6 — CHECKLIST DE CALIDAD (autoverifica antes de entregar)

- [ ] Las 14 secciones existen en el orden correcto.
- [ ] Todas las variables `[...]` del brief están reemplazadas con contenido real.
- [ ] Ninguna imagen queda rota — todas con URL válida de `picsum.photos/seed/`.
- [ ] Navbar es sticky y cambia al hacer scroll.
- [ ] El botón de WhatsApp tiene flotación + ondas + wiggle.
- [ ] Hay al menos 6 breakpoints responsive.
- [ ] JSON-LD tiene el `@type` correcto para el rubro.
- [ ] El hero H1 contiene la palabra clave principal en `<em>`.
- [ ] Formulario con label en cada input y checkbox de tratamiento de datos.
- [ ] `prefers-reduced-motion` y `@media print` presentes.
- [ ] Contraste AA verificado en botones, navbar sobre hero y textos sobre fondos de color.
- [ ] Meta `theme-color` configurado con `--primary`.
- [ ] WhatsApp del footer y del flotante abren el mismo número con mensaje pre-cargado URL-encoded.

---

## === FIN DEL PROMPT ===

---

## Tips de uso

- **Si el modelo trunca el HTML**, pídele: *"Continúa el archivo exactamente desde donde lo cortaste, sin repetir nada."*
- **Si quieres variantes rápidas**, reenvía el mismo prompt cambiando solo el **BLOQUE 1** y pide: *"Solo genera paleta y HTML; conserva la estructura."*
- **Si el cliente no da datos**, escribe en cada campo: *"Inventa datos realistas coherentes con el rubro."*
- **Para ofrecer el servicio**, muestra la plantilla ya llena de odontología (`_plantilla_maestra.html`) como ejemplo de entregable antes de cerrar la venta.
