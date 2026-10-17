# Perfiles de empresas de construcción e ingeniería en Santander (Colombia)

Fecha de consulta: **17 de octubre de 2026** (todas las URL citadas se consultaron ese día salvo que se indique otra cosa).

---

## 1. Propósito, metodología y limitaciones

### Propósito
Perfilar 18 empresas de construcción/ingeniería de Santander a partir de fuentes públicas, para definir cinco **arquetipos de sitio web de demostración**:

1. Constructora corporativa
2. Ingeniería civil y geotecnia
3. Remodelaciones, mantenimiento y adecuaciones
4. Topografía
5. Ingeniería multidisciplinaria

Los perfiles sirven solo como insumo de mercado. **Los sitios de demostración usan marcas ficticias y no copian textos, imágenes, logotipos ni diseños de estas empresas.**

### Metodología
- Punto de partida: directorio Informa Colombia, sector Construcción, departamento de Santander (https://www.informacolombia.com/directorio-empresas/actividad/F_CONSTRUCCION/departamento_santander). La primera página del listado incluye 6 de las 18 empresas (OTACC, Fermar, Diateco, Diseños y Construcciones, En Obra Ingenieros, Maquinobras).
- Búsqueda web por nombre comercial + municipio, y prueba directa de dominios probables (`curl`) para localizar sitios oficiales.
- En cada sitio oficial se revisó: que carga por HTTPS, si redirige de HTTP a HTTPS, menú y páginas, si hay formulario, si hay enlace de WhatsApp, si hay portafolio, el CMS (meta `generator`) y la presencia de la meta `viewport`.
- Fichas de directorios de terceros (Informa Colombia/eInforma, Empresite, EMIS, D&B) para confirmar la razón social, el municipio y la actividad CIIU cuando no había web.
- Repositorios universitarios (UIS Noesis, UPB) con informes de práctica que mencionan a la empresa. Solo prueban que la empresa existe y a qué se dedica; no se usaron para nada más.
- **No se recogen** nombres de personas naturales, cédulas, celulares, NIT ni teléfonos (lo pide el encargo y no aporta al objetivo).

### Leyenda
- **[A]** Confirmado en una fuente pública, con su URL. Si la fuente es un directorio de terceros (no oficial), se indica «(directorio)».
- **[B]** Hipótesis comercial inferida de lo observado. No es un hecho.
- **[C]** Pendiente de verificación. Incluye los posibles homónimos.

### Limitaciones
- **Informa Colombia y eInforma** respondieron HTTP 429 (límite de peticiones) después de unas pocas consultas. Solo se pudieron leer las fichas de APV, Gradex, CON&RECOL, Pascal y SEG; las demás fichas de directorio se conocen por los resúmenes del buscador.
- Los datos financieros y de número de empleados de los directorios son estimaciones comerciales: no se usan.
- **gradex.com.co** devuelve 403 a `curl` (Cloudflare), pero carga con un navegador o fetch; su contenido se leyó con WebFetch.
- **simeldecolombia.com** devuelve 406 (Mod_Security) a `curl`; se leyó con WebFetch.
- **otacc.com** es una aplicación de una sola página (SPA): el HTML inicial no tiene contenido y el texto sale del paquete JavaScript.
- **No se hizo una revisión visual en navegador** (ni capturas ni pruebas a 360/768/1440 px). La «experiencia móvil» solo se infiere de la meta `viewport` y del CMS, y queda como hipótesis [B].
- Para 4 empresas (CREATO, IngeCAD, MW Construcciones, SIMEL Ingeniería) no se localizó una fuente que confirme una entidad en Santander con ese nombre exacto.

---

## 2. Tabla resumen

| # | Empresa | Ubicación publicada | Especialidad | Web oficial | Arquetipo |
|---|---|---|---|---|---|
| 1 | APV Construcciones | Floridablanca [A] | Diseño arquitectónico, mantenimiento, adecuaciones | https://www.apvconstrucciones.com [A] | 3 |
| 2 | IG+ Ingeniería | Floridablanca [A] | Geotecnia, consultoría e interventoría, Oil & Gas | https://igmas.com.co [A] | 2 |
| 3 | Gradex Ingeniería | Floridablanca [A] | Estudios, diseños e interventoría: ambiental, agua, riesgo | https://gradex.com.co [A] | 5 (secundario 2) |
| 4 | CAPITEL Construcciones | Bucaramanga [A] | Diseño y construcción, infraestructura hospitalaria, consultoría | https://capitelconstrucciones.com [A] | 1 |
| 5 | CREATO Grupo Constructor | No confirmada [C] | No confirmada | No se localizó sitio oficial en esta búsqueda | 1 (tentativo, [B]) |
| 6 | CON&RECOL | Bucaramanga [A] | Mantenimiento, remodelaciones, adecuaciones, aseo | https://conrecol.com [A] | 3 |
| 7 | IngeCAD Contratistas | No confirmada [C] | No confirmada | No se localizó sitio oficial en esta búsqueda | Sin base |
| 8 | H&T Ingeniería | Bucaramanga [A] | Diseño estructural, patología, vulnerabilidad sísmica | https://www.hytingenieria.com [A] | 2 |
| 9 | Pascal Ingenieros | Bucaramanga [A] | Geotecnia, consultoría y construcción | https://pascal.com.co [A] | 2 |
| 10 | SEG Construcción y Consultoría | Bucaramanga [A] (directorio) | Obra civil para telecomunicaciones | No se localizó sitio oficial en esta búsqueda | 5 (tentativo, [B]) |
| 11 | En Obra Ingenieros | Floridablanca [A] | Construcción de obras y edificios | http://enobraingenieros.org [A] (solo HTTP) | 1 (tentativo; secundario 3) |
| 12 | OTACC | Bucaramanga [A] | EPC: vivienda, Oil & Gas, renovables, infraestructura | https://otacc.com [A] | 1 |
| 13 | Diateco | Barrancabermeja [A] | EPC civil, mecánico y eléctrico; maquinaria; combustibles | https://www.diateco.com [A] | 5 |
| 14 | MW Construcciones | No confirmada [C] | No confirmada | No se localizó sitio oficial en esta búsqueda | Sin base |
| 15 | SIMEL Ingeniería | Posible: Barrancabermeja [C] | Posible: alquiler de equipos y obra civil petrolera | Posible: https://www.simeldecolombia.com [C] | 5 (tentativo, [C]) |
| 16 | Montajes y Construcciones Fermar | Barrancabermeja [A] | Obras civiles, eléctricas, mecánicas y ambientales para hidrocarburos | https://www.fermarsas.com [A] | 5 |
| 17 | Maquinobras de Colombia | Bucaramanga [A] (directorio) | Obra civil; alquiler de maquinaria (directorio) | No se localizó sitio oficial en esta búsqueda | 1 (tentativo, [B]) |
| 18 | Diseños y Construcciones S.A.S. (Discon) | Bucaramanga [A] | Ingeniería civil, eléctrica, mecánica e instrumentación | https://discon.com.co [A] | 5 |

Resultado: **14 de 18** empresas confirmadas en Santander (11 con sitio oficial verificado y 3 solo por directorio o repositorio). Hay 1 posible coincidencia (SIMEL) y 3 sin confirmar.

---

## 3. Perfiles por empresa

### 1. APV Construcciones
- **Nombre / razón social:** APV Construcciones S.A.S. [A] (https://www.apvconstrucciones.com y ficha en https://www.informacolombia.com/directorio-empresas/informacion-empresa/apv-construcciones-sas).
- **Ubicación:** Floridablanca, Santander. El sitio dice que está establecida desde 2015 [A] (/nosotros).
- **Especialidad:** soluciones arquitectónicas y estructurales para espacios residenciales, comerciales e institucionales [A]. CIIU: otras actividades especializadas de construcción [A] (directorio).
- **Servicios identificados [A]:** diseño de proyectos arquitectónicos; mantenimiento, adecuación, ampliación y remodelación; interventoría y acompañamiento de trámites (curaduría y planeación); visualización 3D; logística de insumos de obra; certificación de puntos de anclaje.
- **Tipo de clientes:** residencial, comercial e institucional [A]. Tiene una sección «Nuestros clientes» sin contenido visible en el texto [A].
- **Diferenciadores comprobables:** declara estar inscrita en el RUC (sistema de gestión SST y ambiente) [A]. El servicio de certificación de anclajes es poco común en el sector [A].
- **Portafolio verificable:** no se observó una galería de proyectos en el sitio.
- **Sitio web oficial:** https://www.apvconstrucciones.com [A]. Está hecho con Google Sites, tiene HTTPS y redirige de HTTP a HTTPS.
- **Oportunidad de mejora digital [B]:** sin formulario ni WhatsApp (solo correo y teléfonos); sin portafolio; sin página por servicio; la página de inicio es una sola frase; el pie de página dice 2024; la plataforma limita el SEO local (sin datos estructurados ni título por servicio).
- **Fuentes:** https://www.apvconstrucciones.com/nosotros · /servicios · /contacto · ficha de Informa Colombia citada (17-10-2026).
- **Arquetipo:** **3** (remodelación/adecuaciones con diseño).

### 2. IG+ Ingeniería
- **Nombre / razón social:** IG+ Ingeniería S.A.S. [A] (https://igmas.com.co/nosotros/). El sitio anuncia una renovación de imagen («ahora somos IG+») y sus enlaces a redes sociales siguen apuntando a cuentas de «ED Ingeotecnia» [A]. Que sea la misma sociedad renombrada es una inferencia [B] que queda por confirmar [C].
- **Ubicación:** Floridablanca (Cañaveral) [A] (https://igmas.com.co/contacto/).
- **Especialidad:** consultoría, interventoría y construcción especializadas en geotecnia, con alcance nacional [A].
- **Servicios [A]:** estudios, exploración e instrumentación geotécnica; geofísica; estudios de amenaza, vulnerabilidad y riesgo; taludes y excavaciones; cimentaciones; respuesta sísmica local; monitoreo; laboratorio; ingeniería para Oil & Gas (ductos, cruces dirigidos); hidrología e hidráulica. Su pie de página lista además estructuras, pavimentos, **topografía**, interventoría y construcción.
- **Tipo de clientes [A]:** transportadoras de gas, constructoras de vivienda en altura del área metropolitana y proyectos de energía. Hay casos fuera de Colombia (Perú, Nicaragua, El Salvador, Bahamas) en /proyectos/.
- **Diferenciadores comprobables [A]:** declara certificación ISO 9001, 14001 y 45001 en la página de inicio; más de 14 años de experiencia; casos con cliente, longitud o volumen.
- **Portafolio verificable:** sí, en https://igmas.com.co/proyectos/ (casos con cliente y cifras).
- **Sitio web oficial:** https://igmas.com.co [A]. WordPress con plugin de SEO, HTTPS y redirección desde HTTP, formulario, WhatsApp, boletín y brochure descargable.
- **Oportunidad [B]:** los contadores de la portada aparecen en «0» en el HTML (se animan con JavaScript; sin JS o para buscadores muestran cero). Las redes sociales tienen la marca anterior (inconsistencia de marca). Las líneas de negocio no tienen página propia.
- **Fuentes:** https://igmas.com.co/ · /nosotros/ · /servicios/ · /proyectos/ · /contacto/ (17-10-2026).
- **Arquetipo:** **2**. Es el referente más completo de la muestra para este arquetipo.

### 3. Gradex Ingeniería
- **Nombre / razón social:** Gradex Ingeniería S.A. [A] (https://gradex.com.co; ficha en https://www.informacolombia.com/directorio-empresas/informacion-empresa/gradex-ingenieria-sa).
- **Ubicación:** Floridablanca (Cañaveral) [A].
- **Especialidad:** estudios, diseños e interventorías. CIIU: actividades de ingeniería y consultoría técnica [A].
- **Servicios [A]:** gestión del riesgo; diseño de obras civiles; medio ambiente; agua potable y saneamiento; tratamiento de aguas residuales industriales y domésticas; estudios hidrológicos e hidráulicos; estudios básicos e integrales; socialización con comunidades; asesoría e interventoría.
- **Tipo de clientes [B]:** sector hidrocarburos y obras lineales. Lo sugieren las publicaciones sobre puntos de control de derrames en ríos y un informe de práctica de la UPB sobre diseños para locaciones de pozos petroleros (https://repository.upb.edu.co/handle/20.500.11912/8856, [A] para la existencia de esos trabajos).
- **Diferenciadores comprobables [A]:** combina lo técnico con la gestión social; publica el resultado de su auditoría RUC 2025.
- **Portafolio verificable:** no se observó una sección de proyectos detallada; solo videos y publicaciones recientes.
- **Sitio web oficial:** https://gradex.com.co [A] (detrás de Cloudflare; WhatsApp publicado).
- **Oportunidad [B]:** sin casos de proyecto con alcance y cliente; no se pudo confirmar si hay página por servicio ni formulario [C].
- **Fuentes:** https://gradex.com.co · ficha de Informa Colombia · repositorio UPB citado (17-10-2026).
- **Arquetipo:** **5**. Secundario 2 por la parte hidráulica y de riesgo.

### 4. CAPITEL Construcciones
- **Nombre / razón social:** CAPITEL Construcciones S.A.S. [A] (https://capitelconstrucciones.com). Un informe de práctica de la UPB menciona «Capitel Construcciones e Ingeniería S.A.S.» en un proyecto de Metrolínea (https://repository.upb.edu.co/handle/20.500.11912/8596); que sea la misma entidad está por confirmar [C]. Existe un homónimo argentino, «Capitel Constructora», que no tiene relación.
- **Ubicación:** Bucaramanga [A].
- **Especialidad:** diseño y construcción, con un nicho de infraestructura hospitalaria [A].
- **Servicios [A]:** arquitectura e ingeniería (vivienda, urbano, hospitalario); obras civiles (educativas, institucionales, industriales, comerciales); consultoría e interventoría (vías, saneamiento, geotecnia, telecomunicaciones, redes); saneamiento básico (acueducto, alcantarillado, PTAR); sistemas contra incendios.
- **Tipo de clientes [A]:** entidades públicas y privadas. Tiene una sección «Algunos de nuestros clientes».
- **Diferenciadores comprobables [A]:** fundada en 2010; publica cifras de m² diseñados y construidos; habilitación y vulnerabilidad sísmica hospitalaria; intervención en una concesión vial 4G (proyecto destacado).
- **Portafolio verificable:** sí, como categorías de proyectos destacados en la portada y un brochure PDF.
- **Sitio web oficial:** https://capitelconstrucciones.com [A]. HTML estático de una sola página, con formulario, WhatsApp, enlace a Instagram y LinkedIn y una página «Trabaje con nosotros».
- **Oportunidad [B]:** **HTTP no redirige a HTTPS** (http:// responde 200); el título de la página es solo «CAPITEL», muy pobre para SEO local; no hay página por servicio ni ficha por proyecto; el brochure en PDF tiene una ruta con barra invertida (`img\Brochure…`), que puede fallar en algunos servidores.
- **Fuentes:** https://capitelconstrucciones.com · repositorio UPB citado (17-10-2026).
- **Arquetipo:** **1**.

### 5. CREATO Grupo Constructor
- **Nombre / razón social:** no confirmada [C]. El buscador muestra una «Creato Constructora S.A.S.» con domicilio en Envigado, Antioquia (https://www.datacreditoempresas.com.co/directorio/creato-constructora-sas.html) y una página de Facebook «Grupo Creato Constructora» sin ubicación visible (https://www.facebook.com/grupocreato.constructora/). **Puede tratarse de homónimos fuera de Santander.**
- **Ubicación, especialidad, servicios, clientes, diferenciadores, portafolio:** no encontrados.
- **Sitio web oficial:** no se localizó sitio oficial en esta búsqueda. creato.co está a la venta (parking de dominio); creato.com.co no responde.
- **Oportunidad [B]:** sin datos suficientes.
- **Arquetipo:** 1, tentativo y basado solo en el nombre («grupo constructor») [B].

### 6. CON&RECOL
- **Nombre / razón social:** CON&RECOL S.A.S., marca de Construcciones y Reformas de Colombia S.A.S. [A] (https://conrecol.com; ficha en https://www.informacolombia.com/directorio-empresas/informacion-empresa/construcciones-reformas-colombia-sas).
- **Ubicación:** Bucaramanga [A]. Declara cobertura en todos los departamentos [A].
- **Especialidad:** mantenimiento de infraestructura, remodelaciones y adecuaciones. CIIU: terminación y acabado de edificios [A].
- **Servicios [A]:** catálogo amplio de mantenimiento (eléctrico, hidrosanitario, aire acondicionado, cubiertas e impermeabilización, drywall y cielorrasos, pintura, cerrajería, carpintería, redes de voz y datos, alarmas); obra (construcción general, remodelación, diseño y planos, montajes electromecánicos); aseo y servicios generales (conjuntos, limpieza posobra, piscinas, jardinería).
- **Tipo de clientes [A]:** conjuntos residenciales, instalaciones industriales y comerciales. Tiene una sección «Nuestros clientes».
- **Diferenciadores comprobables [A]:** dice atender las 24 horas, los 7 días; origen en 2008 como persona natural antes de constituirse como sociedad.
- **Portafolio verificable:** no se observó una galería de proyectos; hay un video enlazado de YouTube.
- **Sitio web oficial:** https://conrecol.com [A]. HTTPS con redirección y formulario.
- **Oportunidad [B]:** plantilla antigua (muestra el aviso de «navegador desactualizado»); sin WhatsApp; los servicios aparecen como listas largas sin página propia ni llamada a la acción; un teléfono con el indicativo antiguo de 7 dígitos «(7)»; sin casos antes/después. Es un caso claro para el arquetipo 3.
- **Fuentes:** https://conrecol.com · ficha de Informa Colombia citada (17-10-2026).
- **Arquetipo:** **3**. Es el referente más directo.

### 7. IngeCAD Contratistas
- **Nombre / razón social:** no confirmada [C]. El buscador solo devolvió nombres parecidos (p. ej. «Ingecar S.A.S.», Bucaramanga), sin relación demostrada.
- **Resto de campos:** no encontrados.
- **Sitio web oficial:** no se localizó sitio oficial en esta búsqueda. ingecadcontratistas.com devuelve 404 e ingecad.com carga sin contenido identificable; ninguno se atribuye a la empresa.
- **Arquetipo:** sin base.

### 8. H&T Ingeniería
- **Nombre / razón social:** H&T Ingeniería S.A.S. [A] (https://www.hytingenieria.com).
- **Ubicación:** Bucaramanga [A] (pie de página).
- **Especialidad:** diseño estructural, patología y vulnerabilidad sísmica [A].
- **Servicios [A]:** diseño estructural (edificaciones, puentes, acero, postensados); revisión y peritaje estructural; estudios de vulnerabilidad (sísmica, remoción en masa, inundación); supervisión técnica; patología y reforzamiento; modelado BIM.
- **Tipo de clientes [A]:** consorcios, constructoras, metalmecánicas, alcaldías y corporaciones ambientales, según los clientes nombrados en /proyectos.
- **Diferenciadores comprobables [A]:** puentes metálicos colgantes y en arco en Santander; estructuras hospitalarias; uso de BIM; cifras de proyectos y m² intervenidos en la portada.
- **Portafolio verificable:** sí, en https://www.hytingenieria.com/proyectos, organizado por categorías (vial, institucional, patologías, vulnerabilidad).
- **Sitio web oficial:** https://www.hytingenieria.com [A]. Wix con HTTPS y HSTS, formulario, WhatsApp y blog.
- **Oportunidad [B]:** queda publicada una página de prueba («copia-de-servicios»); el correo de contacto usa otro dominio (ingenieriahyt.com), lo que dispersa la marca; algunos proyectos se repiten entre categorías; Wix limita el rendimiento móvil (no medido).
- **Fuentes:** https://www.hytingenieria.com · /proyectos (17-10-2026).
- **Arquetipo:** **2** (ingeniería estructural, cercana a la civil y geotécnica).

### 9. Pascal Ingenieros
- **Nombre / razón social:** Pascal Ingenieros S.A.S. [A] (https://pascal.com.co; ficha en https://www.informacolombia.com/directorio-empresas/informacion-empresa/pascal-ingenieros-sas, que registra como CIIU actividades inmobiliarias). **Homónimo:** pascalingenieria.com es un estudio de ingeniería de España, sin relación.
- **Ubicación:** Bucaramanga (Cabecera) [A].
- **Especialidad:** construcción y consultoría especializada en geotecnia [A].
- **Servicios [A]:** estudios de suelos; estabilización de taludes y excavaciones; estructuras de contención, anclajes, soil nailing y micropilotes; asesoría técnica en diseño y obra; desarrollo de un proyecto propio de vivienda o comercio y de minibodegas.
- **Tipo de clientes [B]:** constructoras y propietarios que necesitan estudios o estabilización, más compradores de su propio proyecto.
- **Diferenciadores comprobables [A]:** dice contar con ingenieros con maestría en geotecnia; combina consultoría con promoción inmobiliaria propia.
- **Portafolio verificable:** solo páginas del proyecto propio («SanAngelo», minibodegas); no se observaron casos de consultoría.
- **Sitio web oficial:** https://pascal.com.co [A]. HTTPS con redirección; HTML estático.
- **Oportunidad [B]:** plantilla de 2012 (aviso de copyright) con caracteres mal codificados (tildes rotas); sin formulario ni WhatsApp; teléfono con el formato antiguo «(7)»; una sección «Próximamente» sin contenido; sin casos geotécnicos.
- **Fuentes:** https://pascal.com.co · ficha de Informa Colombia citada (17-10-2026).
- **Arquetipo:** **2**.

### 10. SEG Construcción y Consultoría
- **Nombre / razón social:** SEG Construcción y Consultoría S.A.S. [A] (directorio: https://www.informacolombia.com/directorio-empresas/informacion-empresa/seg-construccion-consultoria-sas). En los informes universitarios aparece como «SEGCYC».
- **Ubicación:** Bucaramanga [A] (directorio).
- **Especialidad:** obra civil para infraestructura de telecomunicaciones [A]. CIIU: otras obras de ingeniería civil [A] (directorio). Fuentes: informes de práctica de la UIS en https://noesis.uis.edu.co/items/c2c61244-47f2-4724-adc8-7dd8e1267ce3/full, https://noesis.uis.edu.co/items/1b20f81b-bfea-4e97-9c95-c2e981997e10/full y https://noesis.uis.edu.co/entities/publication/caf9615c-d15a-46e7-95d3-4617a01225ca/full.
- **Servicios [A]:** construcción y supervisión de estaciones de telecomunicaciones; presupuestos y cantidades de obra.
- **Tipo de clientes [B]:** operadores o administradores de torres de telecomunicaciones.
- **Diferenciadores / portafolio:** no encontrados.
- **Sitio web oficial:** no se localizó sitio oficial en esta búsqueda. **Ojo:** seg.com.co pertenece a una firma contable (otra empresa).
- **Oportunidad [B]:** sin presencia web localizada; nicho B2B donde un sitio con capacidades y cobertura ayudaría en licitaciones.
- **Arquetipo:** **5**, tentativo [B].

### 11. En Obra Ingenieros
- **Nombre / razón social:** En Obra Ingenieros S.A.S. [A] (aparece en el listado de partida de Informa Colombia; sitio http://enobraingenieros.org). **Homónimos:** enobra.co es una tienda de materiales y drywall; Enobra S.A.S. es de Medellín. Ninguno se atribuye a esta empresa.
- **Ubicación:** Floridablanca (Lagos) [A].
- **Especialidad:** construcción de obras y edificios; asesoría en obras civiles [A]. CIIU: construcción de proyectos de servicio público (según el resumen del buscador de la ficha de directorio) [C].
- **Servicios [A]:** construcción de obras y edificaciones; asesoría en manejo de obra civil.
- **Tipo de clientes / diferenciadores / portafolio:** no encontrados en el sitio.
- **Sitio web oficial:** http://enobraingenieros.org [A]. **Solo funciona por HTTP; por HTTPS falla.**
- **Oportunidad [B]:** sin HTTPS; correo de contacto en un dominio gratuito (gmail); el formulario muestra un aviso de «propiedades no válidas» y quedan textos del editor («Haga clic para editar»); una sola página sin servicios ni proyectos. Es un ejemplo claro de presencia mínima.
- **Fuentes:** http://enobraingenieros.org · listado de Informa Colombia (17-10-2026).
- **Arquetipo:** **1**, tentativo. Secundario 3.

### 12. OTACC
- **Nombre / razón social:** OTACC S.A. según el título del sitio; el listado de Informa Colombia la registra como «OTACC S.A.S.» [A]. La forma societaria vigente está por confirmar [C].
- **Ubicación:** Bucaramanga (Cabecera) [A] (pie de página del sitio).
- **Especialidad:** ingeniería y construcción por líneas de negocio [A].
- **Servicios [A]:** vivienda; Oil & Gas (facilidades de superficie); energías renovables (EPC de granjas solares: desarrollo, diseño, trámites, construcción); infraestructura (puentes, intercambiadores, vías, aeropuertos, instituciones).
- **Tipo de clientes [A]:** petroleras, entidades públicas (INVIAS, alcaldía, Aerocivil, fondo de infraestructura educativa), empresas privadas y actores de energía solar (galería de logos en el sitio).
- **Diferenciadores comprobables [A]:** sitio bilingüe con una sección para OTACC USA; fundación propia; contadores de megaproyectos, malla vial y puentes. Las ofertas de empleo de 2026 hablan de unos 59 años de experiencia [A] (https://co.computrabajo.com/ofertas-de-trabajo/oferta-de-trabajo-de-profesional-de-calidad-construccion-en-bucaramanga-4B4E35BFEBA69D5D61373E686DCF3405).
- **Portafolio verificable:** sí, con proyectos por línea de negocio dentro de la SPA.
- **Sitio web oficial:** https://otacc.com [A]. SPA en React, HTTPS con redirección.
- **Oportunidad [B]:** el contenido solo aparece con JavaScript (el HTML inicial está vacío), lo que perjudica el SEO y la vista previa al compartir enlaces; no se observaron formulario ni WhatsApp en el código; el PBX publicado usa el formato antiguo «(7)».
- **Fuentes:** https://otacc.com (incluido su paquete JS) · oferta de Computrabajo citada (17-10-2026).
- **Arquetipo:** **1**. Es el referente corporativo grande de la muestra.

### 13. Diateco
- **Nombre / razón social:** Diateco S.A.S. [A] (https://www.diateco.com; listado de Informa Colombia).
- **Ubicación:** Barrancabermeja (sede), con una oficina en Bogotá [A] (pie de página del sitio).
- **Especialidad:** ingeniería, procura y construcción (EPC) integrales [A].
- **Servicios [A]:** diseño, procura, construcción y mantenimiento de obras civiles, mecánicas, metalmecánicas, eléctricas y de instrumentación; operación y mantenimiento de campos; alquiler de maquinaria pesada; suministro móvil de combustibles; estaciones de servicio; renta de oficinas.
- **Tipo de clientes [A]:** sector petrolero y entidades públicas (casos de locaciones petroleras y un colegio municipal en Girón). Tiene una página «Nuestros clientes». Figura como afiliada en el directorio de Campetrol (https://campetrol.org/directorio/afiliado/diateco-s-a-s/).
- **Diferenciadores comprobables [A]:** dice tener 34 años de experiencia; páginas de HSEQ, certificaciones, línea ética, filiales y prensa.
- **Portafolio verificable:** sí, en /proyectos-destacados/, organizado por especialidad (civil, mecánica, eléctrica e instrumentación).
- **Sitio web oficial:** https://www.diateco.com [A]. WordPress + Elementor, con WhatsApp y formulario en /contacto/.
- **Oportunidad [B]:** el pie de página dice © 2023 (contenido posiblemente desactualizado); el dominio sin «www» no respondió en la prueba; mezcla líneas B2B muy distintas (EPC y combustibles) en un solo menú.
- **Fuentes:** https://www.diateco.com · /servicios/ · Campetrol citado (17-10-2026).
- **Arquetipo:** **5**.

### 14. MW Construcciones
- **Nombre / razón social:** no confirmada [C]. Solo aparecieron homónimos: «MW Construcciones» S.A. en Buenos Aires (Argentina) y «MW Construction» en EE. UU. **Ninguno es de Santander.**
- **Resto de campos:** no encontrados.
- **Sitio web oficial:** no se localizó sitio oficial en esta búsqueda.
- **Arquetipo:** sin base.

### 15. SIMEL Ingeniería
- **Nombre / razón social:** no confirmada con ese nombre exacto [C]. La coincidencia más probable es **Simel de Colombia S.A.S.**, de Barrancabermeja (https://www.lasempresas.com.co/barrancabermeja/simel-de-colombia-sas/ y https://www.simeldecolombia.com). **Homónimos descartados:** Grupo SIMEL (México y Panamá) y SIMEL Ltda. (Bolivia).
- **Ubicación:** Barrancabermeja, si es la misma empresa [C].
- **Servicios (de Simel de Colombia) [A, entidad por confirmar]:** alquiler de equipos (retroexcavadora, compresores, generadores, equipos de soldadura); instalación y mantenimiento de infraestructura; obra civil; mantenimiento de tuberías y tanques; sandblasting; mejoramiento vial.
- **Tipo de clientes [A, entidad por confirmar]:** logos de petrolera y de una empresa de inspección.
- **Portafolio:** publicaciones de equipos; los contadores aparecen en «0».
- **Sitio web:** https://www.simeldecolombia.com, por confirmar que corresponde a la empresa pedida [C]. Tiene WhatsApp y no tiene formulario visible.
- **Oportunidad [B]:** sin formulario; contadores en cero; portafolio centrado en la flota y no en proyectos.
- **Arquetipo:** **5**, tentativo [C].

### 16. Montajes y Construcciones Fermar
- **Nombre / razón social:** Montajes y Construcciones Fermar S.A.S. (MC Fermar) [A] (https://www.fermarsas.com; listado de Informa Colombia).
- **Ubicación:** Barrancabermeja [A].
- **Especialidad:** obras civiles, ambientales, eléctricas, mecánicas y de instrumentación, más consultoría, diseño e interventoría, para la industria petrolera y los sectores público y privado [A]. Constituida en 1993 [A].
- **Servicios [A]:** construcción, mantenimiento y diseño de obras mecánicas, civiles, ambientales y eléctricas.
- **Tipo de clientes [A]:** petroleras, transporte de hidrocarburos, terminales portuarias y servicios públicos (enlaces de la sección «Nuestros clientes»). Ha ejecutado proyectos en Santander, Antioquia y Meta.
- **Diferenciadores comprobables [A]:** política de inclusión laboral publicada; sección «Estamos certificados»; boletín mensual en PDF.
- **Portafolio verificable:** sí, en https://www.fermarsas.com/proyectos/.
- **Sitio web oficial:** https://www.fermarsas.com [A]. WordPress + Elementor, HTTPS con redirección, formulario, WhatsApp, PQRS y página de postulaciones.
- **Oportunidad [B]:** quedan enlaces a la plantilla y al CMS; errata visible en un encabezado («FERMA»); los 29 años declarados no cuadran con la fecha de constitución de 1993 (son unos 33 a la fecha), lo que delata contenido sin actualizar.
- **Fuentes:** https://www.fermarsas.com · /proyectos/ (17-10-2026).
- **Arquetipo:** **5**.

### 17. Maquinobras de Colombia
- **Nombre / razón social:** Maquinobras de Colombia S.A.S. [A] (listado de Informa Colombia; ficha https://directorio-empresas.einforma.co/informacion-empresa/maquinobras-colombia-sas, leída solo a través del buscador por el HTTP 429).
- **Ubicación:** Bucaramanga [A] (directorio).
- **Especialidad:** CIIU de otras obras de ingeniería civil; el directorio menciona como actividades secundarias la consultoría de ingeniería y el alquiler de maquinaria [A] (directorio, por resumen del buscador). Un registro de importación de 2022 indica la compra de equipos de perforación [A] (https://www.importgenius.com/importers/maquinobras-de-colombia-s-a-s).
- **Servicios / clientes / diferenciadores / portafolio:** no encontrados en una fuente oficial.
- **Sitio web oficial:** no se localizó sitio oficial en esta búsqueda (se probaron varios dominios sin respuesta).
- **Oportunidad [B]:** sin presencia web localizada pese a figurar entre las empresas grandes del directorio.
- **Arquetipo:** **1**, tentativo [B]. Podría acercarse al 2 si la perforación es geotécnica [C].

### 18. Diseños y Construcciones S.A.S. (Discon)
- **Nombre / razón social:** Diseños y Construcciones S.A.S., marca Discon [A] (https://discon.com.co; listado de Informa Colombia). **No confundir** con Construcciones Diseños Estudios S.A., también de Bucaramanga.
- **Ubicación:** Bucaramanga [A].
- **Especialidad:** ingeniería civil, eléctrica, mecánica e instrumentación para los sectores público y privado; servicios, construcción, minería y energía [A].
- **Servicios [A]:** edificaciones; construcción industrial; obras mecánicas; refinería y petróleo; sistemas de potencia (cada uno con su página /service/).
- **Tipo de clientes [A]:** petroleras, una multinacional industrial y edificación (fichas de proyecto por cliente en /lq-project/).
- **Diferenciadores comprobables [A]:** trayectoria declarada de 37 a 39 años (cifra inconsistente dentro del mismo sitio); sistema integrado de gestión publicado; acciones de sostenibilidad (cambio a luminarias LED, siembra de árboles).
- **Portafolio verificable:** sí, en https://discon.com.co/proyectos/.
- **Sitio web oficial:** https://discon.com.co [A]. WordPress con tema comercial, HTTPS con redirección, formularios y WhatsApp.
- **Oportunidad [B]:** URL de servicios en inglés con erratas («petrolium-refinery»); queda un enlace a la demo del tema; los años de experiencia son inconsistentes; la visión sigue fijada «para 2025» (contenido vencido).
- **Fuentes:** https://discon.com.co (17-10-2026).
- **Arquetipo:** **5**.

---

## 4. Síntesis

### Patrones observados
- **Servicios más comunes:** diseño y construcción de obra civil; interventoría y consultoría; mantenimiento de infraestructura; servicios a la industria petrolera (muy marcado en Barrancabermeja: Diateco, Fermar, posiblemente SIMEL); geotecnia y estabilización de taludes (IG+, Pascal y, en parte, CAPITEL). La infraestructura hospitalaria y educativa aparece como nicho (CAPITEL, H&T, OTACC).
- **Señales de confianza que el sector usa:** certificaciones ISO, inscripción RUC/HSEQ, galería de logos de clientes, contadores (años, m², proyectos), años de trayectoria, páginas de políticas (datos, ética, PQRS) y «Trabaje con nosotros».
- **Carencias digitales frecuentes [B]:**
  - Contenido desactualizado o inconsistente: años de experiencia que no cuadran, visión «2025», © 2023/2024, indicativos telefónicos antiguos «(7)».
  - Restos de plantilla o editor: páginas «copia de…», enlaces a la demo del tema, «Haga clic para editar», contadores en 0.
  - Faltan páginas por servicio y fichas de proyecto con alcance, cliente y cifras: solo IG+, H&T, Diateco, Fermar y Discon las tienen en algún grado.
  - Seguridad: un sitio sin HTTPS (En Obra) y otro sin redirección HTTP→HTTPS (CAPITEL).
  - SEO: títulos genéricos («CAPITEL»), una SPA sin contenido en el HTML inicial (OTACC) y sitios en Google Sites o Wix con poco control técnico.
  - Contacto: varios sitios sin formulario o sin WhatsApp (APV, Pascal, CON&RECOL, SIMEL); correo en un dominio gratuito o distinto del sitio.
  - 6 de las 18 empresas no tienen un sitio oficial localizado (4 de ellas tampoco están confirmadas en Santander).

### Cómo se traduce en los cinco arquetipos (marcas ficticias, contenido original)

1. **Constructora corporativa** (referencias: OTACC, CAPITEL, En Obra)
   - Inicio con líneas de negocio (vivienda, infraestructura, industrial/energía) y cifras configurables (en «Por confirmar» si no hay dato).
   - Portafolio filtrable por sector con ficha de proyecto (alcance, ubicación, año, cliente opcional).
   - Bloques de clientes y certificaciones (marcadores de posición, sin logos reales), «Trabaje con nosotros», políticas (datos, ética, PQRS) y contacto con formulario honesto + WhatsApp.
   - Contenido renderizado en el HTML (no solo con JS) por SEO.
2. **Ingeniería civil y geotecnia** (referencias: IG+, Pascal, H&T)
   - Una página por servicio técnico (estudios de suelos, taludes, cimentaciones, estructural, patología, vulnerabilidad sísmica, AVR).
   - Casos técnicos con problema → solución → cifras (m, m³, pisos).
   - Sección de equipo y laboratorio, normativa de referencia (NSR-10, como contexto genérico) y botón «Solicitar cotización de estudio» con formulario de datos del predio.
3. **Remodelaciones, mantenimiento y adecuaciones** (referencias: CON&RECOL, APV)
   - Catálogo de servicios agrupado (eléctrico, hidrosanitario, cubiertas, drywall, pintura, mantenimiento locativo) con una tarjeta y una llamada a la acción cada uno.
   - Galería antes/después, segmentos (hogar, conjuntos residenciales, comercio, empresas), WhatsApp destacado y horario de atención/urgencias configurable.
   - Formulario de visita técnica.
4. **Topografía** (sin referencia directa en la muestra: solo IG+ lista la topografía como línea y como monitoreo)
   - Servicios típicos del oficio: levantamientos, replanteo, nivelación, georreferenciación, fotogrametría con dron, monitoreo de deformaciones.
   - Equipos (genéricos), entregables (planos, modelos, ortofotos), cobertura municipal y formulario con ubicación y área del predio.
   - Como no hay empresa de referencia, todo el contenido debe ser genérico y marcarse como ejemplo.
5. **Ingeniería multidisciplinaria** (referencias: Diateco, Fermar, Discon, Gradex)
   - Divisiones por especialidad (civil, mecánica, eléctrica e instrumentación, ambiental/social) con su propia página.
   - Sectores atendidos (hidrocarburos, energía, público, industrial), página HSEQ y certificaciones, casos por especialidad y cobertura regional.
   - Flota y equipos opcionales, proveedores y postulaciones.

**Aviso:** estos perfiles solo orientan la estructura. Los sitios de demostración usan **marcas, textos, imágenes y datos ficticios**, no reproducen el diseño, los textos, las fotos ni los logotipos de ninguna de estas empresas, y dejan vacío o «Por confirmar» cualquier dato real no suministrado.

---

## 5. Datos pendientes de verificación

1. **CREATO Grupo Constructor:** existencia y domicilio en Santander; descartar el homónimo de Envigado y verificar la página de Facebook.
2. **IngeCAD Contratistas:** existencia y razón social (consultar el RUES o la Cámara de Comercio de Bucaramanga).
3. **MW Construcciones:** existencia en Santander (solo hay homónimos en Argentina y EE. UU.).
4. **SIMEL Ingeniería:** confirmar si es Simel de Colombia S.A.S. (Barrancabermeja) y si simeldecolombia.com es su sitio.
5. **IG+ Ingeniería:** confirmar que es la sociedad antes conocida como ED Ingeotecnia (las redes sociales siguen con esa marca).
6. **CAPITEL:** confirmar si «Capitel Construcciones e Ingeniería S.A.S.» (informe UPB) es la misma sociedad que CAPITEL Construcciones S.A.S.
7. **OTACC:** forma societaria vigente (S.A. en el sitio, S.A.S. en el directorio).
8. **En Obra Ingenieros:** CIIU exacto (la ficha de directorio no cargó por el HTTP 429).
9. **Maquinobras de Colombia:** servicios reales y si tiene sitio web; si su perforación es geotécnica o de otro tipo.
10. **SEG Construcción y Consultoría:** sitio web y portafolio; alcance actual de su actividad en telecomunicaciones.
11. **Gradex Ingeniería:** si el sitio tiene formulario y páginas por servicio (solo se leyó la portada).
12. **Diateco:** vigencia del contenido (pie de página © 2023).
13. **Todas:** la experiencia móvil real no se probó en un navegador; requiere una revisión visual a 360/768/1440 px antes de usarla como argumento comercial.
