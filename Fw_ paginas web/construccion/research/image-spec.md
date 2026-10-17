# Especificación de fotografías (uso interno del equipo)

Raíz: `construccion/assets/<sitio>/images/`. Cada «slot» produce dos archivos WebP:

- `<slot>-1600.webp` — ancho máx. 1600 px, calidad 78.
- `<slot>-800.webp` — ancho máx. 800 px, calidad 76.

Sin metadatos EXIF. Proporción original conservada salvo recorte indicado; nunca deformar.
Mínimo aceptable de la fuente: 1600 px de ancho para `hero`, 1200 px para el resto.

## Fuentes y licencias aceptadas

1. **Wikimedia Commons** (preferente; usar la API `https://commons.wikimedia.org/w/api.php` con `prop=imageinfo&iiprop=url|extmetadata|size`): CC0, dominio público, CC BY, CC BY-SA. Preferir «Quality images», «Featured pictures» o fotos de alta resolución bien expuestas.
2. **Unsplash / Pexels**: solo si se verifica la página de la foto y su licencia; registrar la URL de la página.

Rechazar: logotipos o nombres de empresas visibles (vallas, grúas, cascos, vehículos rotulados), marcas comerciales, rostros en primer plano identificables, marcas de agua, fotos de una constructora concreta presentada en su obra, imágenes de baja calidad, temas que no correspondan al slot. Si una foto tiene un rótulo pequeño, se puede recortar (anotarlo en `cambios`).

## Registro de créditos

Cada carpeta `images/` lleva `credits.js` (script clásico, funciona en `file://`):

```js
window.CREDITOS = [
  {
    slot: 'hero',
    alt: 'Descripción en español de lo que realmente se ve en la foto',
    titulo: 'Título original del archivo',
    autor: 'Autor tal como lo pide la licencia',
    licencia: 'CC BY-SA 4.0',
    licenciaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    fuente: 'https://commons.wikimedia.org/wiki/File:...',
    cambios: 'Redimensionada y convertida a WebP'
  }
];
```

Todas las fotos son **de referencia**: los sitios las etiquetan como tales y nunca las presentan como obras de la empresa.

## Slots

### constructora (arquitectura contemporánea, hormigón, vidrio, materiales naturales)
| slot | contenido |
|---|---|
| hero | Edificio contemporáneo terminado: fachada de hormigón y vidrio, composición fuerte, cielo limpio. Apaisada. |
| presentacion | Obra en ejecución: estructura de concreto, formaleta o andamios, personal con EPP (sin logos). |
| srv-edificaciones | Edificio en construcción (estructura aporticada, losas). |
| srv-obras-civiles | Obra civil: vía, puente, muro de contención, alcantarillado. |
| srv-comercial | Edificio comercial o institucional terminado (colegio, biblioteca, oficinas). |
| srv-adecuaciones | Interior en adecuación o remodelación (drywall, acabados en proceso). |
| port-1 | Edificio residencial multifamiliar terminado. |
| port-2 | Edificio de oficinas / corporativo. |
| port-3 | Edificio institucional (educativo, cultural, salud). |
| port-4 | Local o centro comercial, arquitectura contemporánea. |
| port-5 | Obra civil terminada (puente, intercambio vial). |
| port-6 | Vivienda unifamiliar o casas contemporáneas. |
| gal-1 … gal-5 | Detalles arquitectónicos: textura de hormigón, fachada de vidrio, escalera, madera/piedra, patrón de fachada. |

### remodelaciones (cálido, interiores renovados, fachadas, comercios, acabados)
| slot | contenido |
|---|---|
| hero | Interior residencial renovado, luminoso, materiales cálidos (sala o cocina). Apaisada. |
| cat-remodelacion | Cocina o baño remodelado terminado. |
| cat-mantenimiento | Trabajo de mantenimiento locativo (reparación, plomería, electricidad, herramientas). |
| cat-pintura | Pintura de muros o fachada en proceso. |
| cat-impermeabilizacion | Cubierta/terraza con impermeabilización o trabajo en techo. |
| cat-comercial | Local comercial u oficina adecuada, interior contemporáneo. |
| espacio-residencial | Interior de vivienda (otra estancia). |
| espacio-empresarial | Oficina o espacio de trabajo renovado. |
| comparador | Interior renovado nítido con líneas claras (sirve para el comparador). Además genera con PIL `comparador-boceto-1600.webp` y `-800.webp`: boceto a lápiz derivado de la MISMA foto (escala de grises → `ImageFilter.FIND_EDGES` o *dodge blend* con desenfoque gaussiano invertido → tono papel cálido). Mismas dimensiones exactas que `comparador`. Registrar en credits.js como obra derivada (misma licencia). |
| detalle-1 … detalle-3 | Detalles de acabados: baldosa, madera, grifería, textura de muro. |

### geotecnia (campo geotécnico, perforaciones, taludes, cimentaciones)
| slot | contenido |
|---|---|
| hero | Equipo de perforación geotécnica en campo (sonda, barreno). Apaisada. |
| srv-estudios | Muestras de suelo, núcleos en cajas portatestigos o ensayo SPT. |
| srv-taludes | Talud, estabilización de ladera, excavación o deslizamiento. |
| srv-cimentaciones | Pilotes, muro de contención, anclajes o excavación con entibado. |
| srv-consultoria | Ingeniero/a revisando planos o terreno (sin rostro protagonista). |
| laboratorio | Ensayo de suelos en laboratorio (tamices, prensa, muestras). |
| caso-1 | Ladera/talud intervenido. |
| caso-2 | Excavación profunda urbana. |
| caso-3 | Cimentación profunda o placa en ejecución. |

### topografia (estación total, GNSS, drones, foto aérea, campo)
| slot | contenido |
|---|---|
| hero | Topógrafo con estación total en un paisaje abierto o montañoso. Muy apaisada (se recorta a 21:9). |
| equipo-estacion | Estación total en trípode, primer plano. |
| equipo-gnss | Receptor GNSS en bastón o trípode. |
| replanteo | Replanteo en obra: estacas, jalón, nivel, personal en campo. |
| aerea | Vista aérea cenital de terreno, lotes, vías o urbanización. |
| dron | Dron multirrotor de mapeo en vuelo o en campo. |
| planos | Plano topográfico, curvas de nivel o cartografía impresa. |
| campo-2 | Trabajo topográfico en zona rural o vía. |
| nivel | Nivel topográfico / mira de nivelación. |

### ingenieria-integral (industria, estructuras metálicas, instalaciones, campo)
| slot | contenido |
|---|---|
| hero | Infraestructura industrial o estructura metálica con escala (planta, nave, montaje). Apaisada, buena para fondo oscuro. |
| disc-civil | Obra civil (concreto, vía, cimentación). |
| disc-estructural | Montaje de estructura metálica (vigas, columnas, soldadura). |
| disc-electrica | Subestación, tableros eléctricos o redes. |
| disc-mecanica | Tuberías industriales, equipos, planta de proceso. |
| mantenimiento | Personal haciendo mantenimiento industrial (EPP, sin logos). |
| interventoria | Supervisión técnica en obra: casco, planos, inspección. |
| sector-industria | Planta industrial exterior. |
| sector-energia | Infraestructura energética (líneas, solar, subestación). |
| sector-infraestructura | Puente o vía. |
| port-1 … port-4 | Proyectos de referencia variados: nave industrial, tanque/planta, estructura metálica, obra vial. |
