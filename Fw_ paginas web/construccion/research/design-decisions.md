# Decisiones de diseño

Cinco sitios conceptuales con **marcas ficticias** y un showroom. Cada sitio tiene una sola «idea fuerte» —el elemento memorable— y todo lo demás se mantiene sobrio. Las ideas fuertes salen del oficio de cada especialidad, no de un catálogo de efectos.

| Sitio | Marca ficticia | Idea fuerte | Tipografía | Base cromática |
|---|---|---|---|---|
| Constructora | Basalto Constructora | Hero asimétrico: el titular invade la fotografía sobre un bloque petróleo, como un voladizo | Archivo (eje de anchura: 118 en titulares, 100 en texto) | Petróleo + blanco cálido + mineral, cobre puntual |
| Geotecnia | Estrato Geotecnia | Los servicios se leen como un **registro de perforación**: estratos con tramas geotécnicas que se seleccionan | Sofia Sans Condensed (titulares) + Sofia Sans (texto) | Marino + blanco técnico + acero, verde mineral |
| Remodelaciones | Obra Fina Remodelaciones | **Comparador antes/después** (boceto ↔ foto, declarado ilustrativo) y WhatsApp como canal principal | Bricolage Grotesque (opsz 96 en titulares, 14 en texto) | Arena + blanco cálido + carbón, terracota |
| Topografía | Cota Cero Topografía | **Curvas de nivel** que se dibujan sobre el hero y un **panel de capas** tipo SIG para explorar servicios | Schibsted Grotesk | Verde bosque + blanco + grafito, lima en detalles |
| Ingeniería integral | Nodo Ingeniería Integral | **Matriz disciplinas × etapas** interactiva que muestra la coordinación multidisciplinaria | IBM Plex Sans Condensed (titulares) + IBM Plex Sans (texto) | Azul noche + blanco + titanio, naranja industrial |
| Showroom | (estudio configurable) | Muro de galería: cinco filas grandes con capturas reales de cada demo | Geologica | Hormigón claro + tinta, color solo en las vistas previas |

## Revisión del plan frente a los tics genéricos

Primer borrador → cambio aplicado:

- **Remodelaciones** tenía fondo crema, serif de alto contraste y terracota (el tic n.º 1). El brief pide arena, blanco cálido y terracota, así que la paleta se mantiene, pero: la serif se sustituye por una grotesca cálida (Bricolage Grotesque), la terracota baja a `#A34B2A` (más tierra cocida, lejos de `#D97757`) y la arena pasa a ser superficie de sección, no fondo de toda la página.
- **Topografía** con verde bosque + lima rozaba el tic n.º 2 (fondo casi negro + acento ácido). Se corrige usando el bosque como color de marca en bloques concretos, el blanco como fondo dominante y la lima solo en marcadores de mapa, foco y estado activo, nunca en texto sobre blanco.
- **Constructora** y **Topografía** iban a usar ambas una grotesca de anchura variable; Topografía cambia a Schibsted Grotesk (proporciones fijas, más cartográfica) para que no se confundan.
- **Todos**: se eliminan las etiquetas en mayúsculas sobre cada titular, las cadenas con punto medio, las flechas añadidas al texto de los botones y la tipografía monoespaciada para datos. La numeración (01, 02…) solo aparece en metodologías y flujos, que sí son secuencias.
- **Tarjetas**: ningún sitio usa la rejilla de tarjetas redondeadas con sombra gris. Cada uno resuelve sus listas de otra forma (franjas, estratos, pestañas, capas, matriz).

## Principios comunes

- Alineación a la izquierda por defecto; centrado solo en piezas cortas aisladas.
- Medida de texto ≤ 70 caracteres (`max-width: 62ch` aprox.).
- Radios por jerarquía, no uno global: fotos y bloques estructurales a 0 en Constructora, Geotecnia, Topografía e Integral; Remodelaciones usa el arco solo en la foto del hero y 6 px en controles.
- Movimiento: AOS con `once: true`, duración 600–700 ms, solo en titulares de sección, imágenes clave y la entrada escalonada de listas de servicios. Una sola animación orquestada por sitio (la de la idea fuerte). Sin AOS o con `prefers-reduced-motion`, todo se ve.
- Fotos: siempre con la marca «Foto de referencia» en portafolios y casos; créditos completos en el pie.
- Datos de contacto vacíos: en modo `revision` aparecen como «Por configurar»; en modo `publicacion` se ocultan.

---

## 1. Basalto Constructora (`assets/constructora/`)

**Audiencia y tarea**: propietarios, desarrolladores y empresas que evalúan a quién confiar una obra. La página debe transmitir método y solidez, y llevar a una solicitud de cotización.

**Color**
- Petróleo `#0E3A45` (marca, bloques), petróleo profundo `#082A33`
- Blanco cálido `#F5F4F0` (fondo)
- Mineral `#8B9399` (líneas, texto terciario sobre oscuro), mineral claro `#DCDFDF`
- Tinta `#1C2528` (texto)
- Cobre `#A0541F` (CTA primario, reglas activas, ≤ 5 % de la superficie)

**Tipografía**: Archivo variable. Titulares `wdth 118, wght 700`, interletrado −0,02 em; texto `wdth 100, wght 400`, 17 px / 1,6. Escala cuarta justa (1,333): 14 · 17 · 22,6 · 30 · 40 · 53 · 71 px; titular del hero con `clamp(2.6rem, 6vw, 5.4rem)`.

**Composición**
```
┌ barra de demo ───────────────────────────────────────────────┐
├ barra superior: teléfono · correo · ubicación (config) ──────┤
├ header sticky: marca | nav | [Solicitar una cotización] ─────┤
│ ┌──────── petróleo ────────┐┌────────── FOTO ─────────────┐ │
│ │ Construimos espacios.    ││                             │ │
│ │ Desarrollamos futuro.  ──┼┼──► el bloque invade la foto  │ │
│ │ subtítulo                ││                             │ │
│ │ [Cotizar] [Proyectos]    ││                             │ │
│ └──────────────────────────┘└─────────────────────────────┘ │
├ franja de capacidades (5 enunciados separados por filetes) ──┤
│ presentación: texto 5 col | foto obra 7 col                  │
│ servicios: 4 filas anchas alternadas foto/texto (no tarjetas) │
│ portafolio: filtros + mosaico 3×2 con alturas variadas        │
│ metodología: línea horizontal de 5 etapas numeradas           │
│ diferenciadores: lista a 2 columnas con icono lineal          │
│ galería: tira con scroll-snap manual + visor                  │
│ FAQ (details) | CTA petróleo | formulario 2 col | footer      │
└──────────────────────────────────────────────────────────────┘
```

**Estilo fotográfico**: arquitectura terminada con luz limpia, encuadres frontales y detalles de material.

## 2. Estrato Geotecnia (`assets/geotecnia/`)

**Audiencia y tarea**: constructoras, diseñadores estructurales, propietarios de lotes y entidades que necesitan estudios antes de diseñar. Debe explicar servicios técnicos sin volverse un documento académico y llevar a describir un proyecto.

**Color**
- Marino `#14253D`, marino profundo `#0C1828`
- Blanco técnico `#F3F5F6`
- Acero `#5F6B78` (texto secundario), acero claro `#C9D0D6` (retícula, filetes)
- Verde mineral `#3F7360` (acento, CTA)
- Solo en el registro: arena `#C9A86A`, limo `#A39C83`, arcilla `#8D6A4F`, roca `#5B5F63`

**Tipografía**: Sofia Sans Condensed 700–800 para titulares (densos, de rótulo técnico); Sofia Sans 400/600 para texto, 17 px / 1,6. Escala tercera mayor (1,25).

**Composición**
```
│ nav marino                                                   │
│ ┌ marino con retícula 24 px ──┐┌┐┌──────── FOTO sonda ─────┐ │
│ │ Ingeniería que comienza     ││││                         │ │
│ │ en el terreno.              │││← columna estratigráfica  │ │
│ │ [Consultar un proyecto]     ││││   (SVG con tramas)      │ │
│ └─────────────────────────────┘└┘└─────────────────────────┘ │
│ servicios = registro de perforación                          │
│ ┌──┬───────────────────────────────────────────────────────┐ │
│ │▒▒│ Estudios geotécnicos y de suelos   (seleccionado)     │ │
│ │░░│ Estabilidad de taludes y excavaciones                 │ │
│ │▓▓│ Cimentaciones y estructuras de contención             │ │
│ │::│ Consultoría y acompañamiento técnico                  │ │
│ └──┴───────────────────────────────────────────────────────┘ │
│   → panel: cuándo se necesita · qué incluye · qué se entrega │
│ metodología 5 pasos | casos ilustrativos | qué preparar + FAQ │
│ formulario «Describa su proyecto» | CTA | footer             │
```

**Idea fuerte**: pestañas verticales accesibles (`role="tablist"`, flechas arriba/abajo) cuya columna izquierda son estratos con tramas de convención geotécnica (puntos = arena, guiones = arcilla, círculos = grava). En móvil se convierte en una pila con la banda del estrato a la izquierda. El perfil del hero es ilustrativo y lo dice.

**Interventoría**: se incluye como bloque `data-status="pendiente"` («confirmar si forma parte del perfil»), visible solo en revisión.

## 3. Obra Fina Remodelaciones (`assets/remodelaciones/`)

**Audiencia y tarea**: hogares, administradores de propiedad horizontal, comercios y oficinas que necesitan remodelar o mantener. La conversión principal es WhatsApp; la secundaria, el formulario corto.

**Color**
- Blanco cálido `#FBF8F3` (fondo)
- Arena `#E4D5BE` (superficies de sección), arena clara `#F1E8DA`
- Carbón suave `#2F2C29` (texto y bloques oscuros)
- Terracota `#A34B2A` (acento, CTA), terracota profunda `#8A3D21` (hover)

**Tipografía**: Bricolage Grotesque variable. Titulares `opsz 96, wght 700`, interletrado −0,025 em; texto `opsz 14, wght 400`, 17 px / 1,6.

**Composición**
```
│ header: marca | nav | [WhatsApp] [Cotizar]   (WhatsApp visible en móvil) │
│ ┌ texto ─────────────────┐ ╭──── FOTO en arco ────╮          │
│ │ Transformamos espacios │ │                      │          │
│ │ para que funcionen     │ │                      │          │
│ │ mejor.                 │ │                      │          │
│ │ [Solicitar visita] [Ver servicios]              │          │
│ └────────────────────────┘ ╰──────────────────────╯          │
│ chips de espacios: residencial · comercial · empresarial      │
│ servicios por categoría = pestañas con foto + lista           │
│ comparador antes/después a ancho completo (arena)             │
│ proceso 4 pasos | FAQ | formulario corto | CTA WhatsApp       │
│ barra fija inferior en móvil: [WhatsApp] [Cotizar]            │
```

**Idea fuerte**: comparador con `input type="range"` (accesible por teclado) que revela la foto sobre un boceto a lápiz derivado de la misma imagen. Rótulo explícito: «Comparador ilustrativo: el boceto se generó a partir de la foto de referencia. En el sitio real se usan fotos de antes y después de obras propias.»

**WhatsApp**: número en `js/config.js`. Si está vacío, los botones abren un diálogo que muestra el mensaje preparado y explica que falta configurar el número (modo revisión) o se ocultan (modo publicación). Nunca se inventa un número.

## 4. Cota Cero Topografía (`assets/topografia/`)

**Audiencia y tarea**: constructoras, propietarios de predios, diseñadores e interventorías que necesitan levantamientos, replanteos y planos. Debe transmitir precisión y orden técnico.

**Color**
- Bosque `#1E3B2F`, bosque profundo `#142A21`
- Blanco `#FFFFFF` (fondo), papel `#F2F5F1` (superficie)
- Grafito `#2E3236` (texto), gris `#646B70` (texto secundario)
- Lima `#C8E05A` (solo marcadores, foco y estado activo sobre bosque)

**Tipografía**: Schibsted Grotesk 400–800. Titulares 700 con interletrado −0,03 em; texto 400, 17 px / 1,6. Escala tercera mayor.

**Composición**
```
│ header técnico (blanco, filete inferior)                     │
│ ┌──────────── FOTO panorámica 21:9 ───────────────────────┐ │
│ │  ~~~ curvas de nivel SVG que se trazan al cargar ~~~     │ │
│ │  ┼ punto de control      Precisión que orienta          │ │
│ │                          cada proyecto.  [Solicitar]    │ │
│ └──────────────────────────────────────────────────────────┘ │
│ servicios = panel de capas                                   │
│ ┌ capas ─────────┐┌ plano SVG del predio ──────────────────┐ │
│ │ ■ Levantamiento ││ curvas + puntos                        │ │
│ │ □ Replanteo     ││ ejes + estacas                         │ │
│ │ □ Planimetría   ││ linderos + cotas                       │ │
│ │ □ Nivelación    ││ perfil                                 │ │
│ └─────────────────┘└───────────────────────────────────────┘ │
│ aplicaciones 3 columnas | tecnología (pendiente) | galería    │
│ flujo + entregables | FAQ | formulario | footer               │
```

**Idea fuerte**: interruptores (`role="switch"`) que encienden capas del plano y actualizan la descripción del servicio. Las curvas del hero se trazan una sola vez (stroke-dashoffset); con movimiento reducido aparecen ya dibujadas.

**Drones / LiDAR**: bloque `data-status="pendiente"`: «Solo se publica si la empresa lo confirma».

## 5. Nodo Ingeniería Integral (`assets/ingenieria-integral/`)

**Audiencia y tarea**: gerentes de proyecto, áreas de mantenimiento y compras de empresas industriales y de infraestructura. Debe presentar a la firma como socio que coordina disciplinas y llevar a una conversación B2B.

**Color**
- Azul noche `#0D1B2A`, noche 800 `#15283D`
- Blanco `#FFFFFF`, superficie `#EEF0F2`
- Titanio `#8D959E` (filetes y texto terciario sobre oscuro), titanio claro `#D5D9DD`
- Naranja industrial `#E06C1A` (sobre noche; como fondo lleva texto noche)

**Tipografía**: IBM Plex Sans Condensed 600/700 para titulares (lenguaje de documentación técnica), IBM Plex Sans 400/500 para texto, 17 px / 1,6.

**Composición**
```
│ header transparente sobre foto → sólido al desplazar          │
│ ┌──────── FOTO industrial a sangre, veladura noche ────────┐ │
│ │                                                          │ │
│ │ Ingeniería integral para proyectos                       │ │
│ │ que exigen precisión.  ▬ (filete naranja)                │ │
│ │ [Hablar con un especialista] [Explorar capacidades]      │ │
│ └──────────────────────────────────────────────────────────┘ │
│ capacidades: 4 disciplinas en franja con icono               │
│ matriz disciplinas × etapas (idea fuerte)                    │
│          Ingeniería  Construcción  Mantenimiento  Interventoría* │
│ Civil       ●            ●             ●             ○        │
│ Estructural ●            ●             ○             ○        │
│ Eléctrica   ●            ●             ●             ○        │
│ Mecánica    ●            ●             ●             ○        │
│ detalle por disciplina | sectores | portafolio ref. | método  │
│ contacto B2B 2 col (canales | formulario) | footer            │
```

**Idea fuerte**: al elegir una disciplina (pestañas horizontales) se resalta su fila y aparece el detalle; al elegir una etapa se resalta la columna. La columna de interventoría está marcada «por confirmar».

## Showroom (`index.html`)

**Audiencia y tarea**: prospectos del sector a quienes se les presenta el servicio de diseño y desarrollo web.

**Color**: hormigón claro `#E8E7E3`, papel `#F7F6F3`, tinta `#1B1F23`, gris `#5E6368`. Sin acento propio: el color lo aportan las vistas previas de cada demo.

**Tipografía**: Geologica 300–800 (geométrica con un punto técnico).

**Composición**: titular grande a la izquierda con un collage escalonado de las cinco capturas a la derecha; luego cinco filas grandes alternadas (captura en marco de navegador | nombre del arquetipo, especialidad, qué incluye, botón «Ver demostración»), cada una con la etiqueta «Proyecto conceptual». Cierre con qué incluye el servicio y contacto configurable. Cada demo tiene una barra superior con «Volver al showroom».
