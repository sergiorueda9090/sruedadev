# Fotografías: especificación de slots

Cada slot es **una foto distinta** (nunca la misma foto en dos slots; `tools/fotos.py usar` avisa si se repite).
Fuente: Wikimedia Commons con licencia CC0, dominio público, CC BY o CC BY-SA. El script filtra la licencia y
registra el crédito en `tools/credits.json` → `assets/js/credits.js`.

Criterios de aceptación de una foto:

- Muestra claramente el equipo pedido, completo o casi completo (en catálogo no cortar cucharón, pluma, tolva ni ruedas).
- Fotografía real, nítida, bien expuesta, apariencia profesional. Nada de maquetas, juguetes, museos, chatarra, accidentes, fotos históricas en blanco y negro.
- Sin marcas de agua, sin texto superpuesto, sin rostros protagonistas.
- Evitar que el nombre de una **empresa de alquiler, constructora u operador** sea protagonista (rótulos grandes en puertas, plumas o volcos). La marca del fabricante en la máquina es aceptable si no domina la imagen.
- Preferir entornos de obra o cantera reales sobre fondos de feria/exposición.
- Variar encuadres (lateral, 3/4, trabajando, de cerca) dentro de cada categoría.

Proporciones (`--ratio`) y grupo (`--grupo`):

| grupo | ratio | uso |
|---|---|---|
| hero | 16:9 | portada; encuadre con espacio libre a la izquierda o arriba para el texto |
| catalogo | 4:3 | tarjetas del catálogo y visor ampliado |
| servicios | 5:4 | filas editoriales de líneas de servicio |
| proyectos | 3:2 | galería «Aplicaciones de referencia» |
| secciones | ver slot | fotos de apoyo de otras secciones |

## hero
| slot | contenido |
|---|---|
| hero | Excavadora o equipo pesado trabajando en un gran movimiento de tierras o vía en construcción, plano amplio, luz natural potente. Mínimo 2400 px de ancho. |
| hero-2, hero-3, hero-4 | Fotos adicionales del carrusel: otras escenas (vehículos de carga, concreto, izaje). Misma regla de encuadre. |

## catalogo — Movimiento de tierras (`tierra`)
| slot | contenido |
|---|---|
| excavadora-orugas | Excavadora hidráulica de orugas, tamaño medio/grande |
| excavadora-ruedas | Excavadora hidráulica de ruedas (neumáticos) |
| miniexcavadora | Miniexcavadora |
| retroexcavadora | Retroexcavadora cargadora (backhoe loader) |
| bulldozer | Bulldozer / tractor de orugas con hoja |
| cargador-frontal | Cargador frontal de ruedas |
| minicargador | Minicargador / cargador compacto (skid steer o compact track loader) |
| motoniveladora | Motoniveladora |
| mototrailla | Mototraílla / scraper |
| compactador-suelo | Compactador de suelo de un tambor (liso o pata de cabra) |

## catalogo — Vehículos de carga (`carga`)
| slot | contenido |
|---|---|
| volqueta | Volqueta doble troque (camión volquete rígido de 3 ejes) |
| volquete-articulado | Camión volquete articulado (articulated dump truck) |
| tractocamion | Tractocamión / cabezote |
| camion-plataforma | Camión plataforma o planchón con carga de obra |
| camion-grua | Camión con grúa articulada (knuckle boom / grúa hidráulica sobre camión) |
| cama-baja | Cama baja transportando maquinaria pesada |
| carrotanque | Carrotanque / camión cisterna de agua para obra |
| camion-taller | Vehículo de apoyo / taller móvil / camión de mantenimiento o lubricación de obra |

## catalogo — Vías y pavimentación (`vias`)
| slot | contenido |
|---|---|
| rodillo-tandem | Rodillo vibratorio tándem para asfalto |
| rodillo-neumatico | Compactador de neumáticos |
| fresadora | Fresadora de pavimento (cold planer) |
| pavimentadora | Pavimentadora / terminadora de asfalto extendiendo mezcla |

## catalogo — Grúas y elevación (`izaje`)
| slot | contenido |
|---|---|
| grua-torre | Grúa torre en obra |
| grua-telescopica | Grúa móvil telescópica sobre camión / todoterreno |
| grua-orugas | Grúa sobre orugas (celosía) |
| montacargas | Montacargas industrial / de patio |
| manipulador-telescopico | Manipulador telescópico (telehandler) |
| plataforma-articulada | Plataforma elevadora articulada o telescópica (boom lift) |
| elevador-tijera | Elevador de tijera |

## catalogo — Concreto y formaletería (`concreto`)
| slot | contenido |
|---|---|
| mixer | Camión mezclador de concreto (mixer) |
| autobomba | Camión bomba de concreto con pluma desplegada |
| planta-dosificadora | Planta dosificadora / central de concreto |
| bomba-estacionaria | Bomba estacionaria de concreto (remolcable) |
| formaleta-metalica | Formaletas / encofrados metálicos para muros, columnas o losas |
| andamio | Sistema de andamio tubular/multidireccional en fachada o estructura |
| puntales | Puntales metálicos sosteniendo una losa (vista de puntales en obra) |

## catalogo — Equipos industriales (`industrial`)
| slot | contenido |
|---|---|
| perforadora | Equipo de perforación / piloteadora para cimentación |
| trituradora | Trituradora o planta de trituración de agregados en cantera |
| generador | Generador eléctrico industrial (planta eléctrica diésel) en obra |
| compresor | Compresor de aire portátil remolcable de obra |
| soldadura | Soldador trabajando estructura metálica (con equipo de protección), sin rostro visible |
| contenedor-obra | Contenedores / módulos de oficina o campamento de obra |

## servicios (5:4) — fotos distintas a las del catálogo
| slot | contenido |
|---|---|
| srv-tierras | Varias máquinas en un gran movimiento de tierras (excavadora cargando volqueta, etc.) |
| srv-transporte | Volquetas o camiones transportando material por vía de obra, o cama baja con máquina en carretera |
| srv-izaje | Grúa izando una pieza (viga, estructura metálica, prefabricado) |
| srv-concreto | Vaciado de concreto con pluma de autobomba o manguera sobre losa |
| srv-vias | Cuadrilla pavimentando: terminadora + rodillos sobre asfalto |

## proyectos (3:2) — vistas amplias de obras de infraestructura (referencias del sector)
| slot | contenido |
|---|---|
| proy-via | Construcción de autopista/carretera, vista amplia |
| proy-puente | Puente o viaducto en construcción |
| proy-cantera | Cantera o mina a cielo abierto con equipos |
| proy-edificio | Edificio en estructura con grúas torre |
| proy-urbano | Obra urbana: redes, alcantarillado o espacio público con maquinaria |

## secciones
| slot | ratio | contenido |
|---|---|---|
| equipo-tecnico | 4:5 | Ingeniero/a o personal con casco y chaleco revisando planos o equipo en obra, rostro no protagonista |
| cta | 21:9 | Obra o maquinaria al atardecer / panorámica dramática, con zona tranquila para texto |
