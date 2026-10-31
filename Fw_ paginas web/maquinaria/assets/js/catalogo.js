/*
 * Catálogo de equipos. Cada equipo usa las fotos assets/img/catalogo/<id>-640.webp y -1280.webp
 * (el texto alternativo y el crédito salen de assets/js/credits.js, generado por tools/fotos.py).
 *
 * TODOS LOS EQUIPOS ACTUALES SON DE REFERENCIA (confirmado: false): describen tipos de equipo del
 * sector, no inventario de la empresa. Al recibir el listado real:
 *   - deje solo los equipos que la empresa ofrece y márquelos con confirmado: true;
 *   - en specs ponga únicamente características verificadas (p. ej. 'Capacidad del volco: 14 m³');
 *   - sustituya las fotos por fotografías propias con el mismo id (o cambie el id).
 * En modo 'publicacion' solo se muestran los equipos con confirmado: true.
 */
window.CATALOGO = {
  categorias: [
    { id: 'tierra', nombre: 'Movimiento de tierras' },
    { id: 'carga', nombre: 'Vehículos de carga' },
    { id: 'vias', nombre: 'Vías y pavimentación' },
    { id: 'izaje', nombre: 'Grúas y elevación' },
    { id: 'concreto', nombre: 'Concreto y formaletería' },
    { id: 'industrial', nombre: 'Equipos industriales' }
  ],

  equipos: [
    // Movimiento de tierras
    { id: 'excavadora-orugas', cat: 'tierra', nombre: 'Excavadora hidráulica de orugas',
      uso: 'Excavación masiva, zanjas profundas, cargue de volquetas y demolición en terrenos irregulares.', specs: [], confirmado: false },
    { id: 'excavadora-ruedas', cat: 'tierra', nombre: 'Excavadora de ruedas',
      uso: 'Excavación y cargue en obras urbanas y vías, con desplazamiento rápido entre frentes sin cama baja.', specs: [], confirmado: false },
    { id: 'miniexcavadora', cat: 'tierra', nombre: 'Miniexcavadora',
      uso: 'Redes de servicios, zanjas angostas y trabajos en espacios reducidos o dentro de edificaciones.', specs: [], confirmado: false },
    { id: 'retroexcavadora', cat: 'tierra', nombre: 'Retroexcavadora cargadora',
      uso: 'Equipo versátil para excavar, cargar material y nivelar en obras pequeñas y medianas.', specs: [], confirmado: false },
    { id: 'bulldozer', cat: 'tierra', nombre: 'Bulldozer',
      uso: 'Descapote, empuje de material, conformación de terraplenes y apertura de vías.', specs: [], confirmado: false },
    { id: 'cargador-frontal', cat: 'tierra', nombre: 'Cargador frontal',
      uso: 'Cargue de agregados y material suelto en volquetas, acopio en patios y canteras.', specs: [], confirmado: false },
    { id: 'minicargador', cat: 'tierra', nombre: 'Minicargador',
      uso: 'Limpieza de obra, movimiento de material en áreas pequeñas y trabajo con accesorios.', specs: [], confirmado: false },
    { id: 'motoniveladora', cat: 'tierra', nombre: 'Motoniveladora',
      uso: 'Nivelación y perfilado de subrasantes, bases granulares y mantenimiento de vías destapadas.', specs: [], confirmado: false },
    { id: 'mototrailla', cat: 'tierra', nombre: 'Mototraílla',
      uso: 'Corte, cargue, transporte y extendido de tierra en grandes movimientos de tierra.', specs: [], confirmado: false },
    { id: 'compactador-suelo', cat: 'tierra', nombre: 'Compactador de suelos',
      uso: 'Compactación de rellenos, subrasantes y capas granulares con tambor liso o pata de cabra.', specs: [], confirmado: false },

    // Vehículos de carga
    { id: 'volqueta', cat: 'carga', nombre: 'Volqueta doble troque',
      uso: 'Transporte de material de excavación, agregados y escombros entre la obra y el sitio de disposición.', specs: [], confirmado: false },
    { id: 'volquete-articulado', cat: 'carga', nombre: 'Volquete articulado',
      uso: 'Acarreo de material dentro de la obra o la cantera, en terrenos blandos y pendientes fuertes.', specs: [], confirmado: false },
    { id: 'tractocamion', cat: 'carga', nombre: 'Tractocamión',
      uso: 'Arrastre de semirremolques: planchones, camas bajas y furgones para carga pesada.', specs: [], confirmado: false },
    { id: 'camion-plataforma', cat: 'carga', nombre: 'Camión plataforma',
      uso: 'Transporte de acero, formaletas, prefabricados y materiales paletizados hasta la obra.', specs: [], confirmado: false },
    { id: 'camion-grua', cat: 'carga', nombre: 'Camión grúa',
      uso: 'Carga, descarga y ubicación de materiales en obra con grúa hidráulica articulada.', specs: [], confirmado: false },
    { id: 'cama-baja', cat: 'carga', nombre: 'Cama baja',
      uso: 'Movilización de maquinaria pesada entre obras: excavadoras, bulldozers y rodillos.', specs: [], confirmado: false },
    { id: 'carrotanque', cat: 'carga', nombre: 'Carrotanque de agua',
      uso: 'Riego para compactación, control de polvo y suministro de agua en frentes de obra.', specs: [], confirmado: false },
    { id: 'camion-taller', cat: 'carga', nombre: 'Vehículo de apoyo y mantenimiento',
      uso: 'Mantenimiento de campo, combustible y lubricación de la maquinaria en el frente de obra.', specs: [], confirmado: false },

    // Vías y pavimentación
    { id: 'rodillo-tandem', cat: 'vias', nombre: 'Rodillo vibratorio tándem',
      uso: 'Compactación de carpetas asfálticas con dos tambores vibratorios.', specs: [], confirmado: false },
    { id: 'rodillo-neumatico', cat: 'vias', nombre: 'Compactador de neumáticos',
      uso: 'Sellado y acabado de mezclas asfálticas y compactación de bases granulares.', specs: [], confirmado: false },
    { id: 'fresadora', cat: 'vias', nombre: 'Fresadora de pavimento',
      uso: 'Retiro controlado de capas de asfalto para rehabilitación y reparcheo de vías.', specs: [], confirmado: false },
    { id: 'pavimentadora', cat: 'vias', nombre: 'Pavimentadora de asfalto',
      uso: 'Extendido de mezcla asfáltica con espesor y ancho controlados.', specs: [], confirmado: false },

    // Grúas y elevación
    { id: 'grua-torre', cat: 'izaje', nombre: 'Grúa torre',
      uso: 'Izaje de materiales en edificaciones en altura durante toda la etapa de estructura.', specs: [], confirmado: false },
    { id: 'grua-telescopica', cat: 'izaje', nombre: 'Grúa móvil telescópica',
      uso: 'Izajes puntuales de vigas, estructuras y equipos, con montaje rápido en el sitio.', specs: [], confirmado: false },
    { id: 'grua-orugas', cat: 'izaje', nombre: 'Grúa sobre orugas',
      uso: 'Izajes pesados y de gran alcance en puentes, plantas industriales y obras de infraestructura.', specs: [], confirmado: false },
    { id: 'montacargas', cat: 'izaje', nombre: 'Montacargas',
      uso: 'Manipulación de cargas paletizadas en bodegas, patios y plantas.', specs: [], confirmado: false },
    { id: 'manipulador-telescopico', cat: 'izaje', nombre: 'Manipulador telescópico',
      uso: 'Elevación y ubicación de materiales en altura y en terreno de obra.', specs: [], confirmado: false },
    { id: 'plataforma-articulada', cat: 'izaje', nombre: 'Plataforma elevadora articulada',
      uso: 'Trabajo en altura con alcance horizontal para montajes, fachadas y mantenimiento.', specs: [], confirmado: false },
    { id: 'elevador-tijera', cat: 'izaje', nombre: 'Elevador de tijera',
      uso: 'Trabajo en altura sobre superficies firmes: instalaciones, cielos rasos y acabados.', specs: [], confirmado: false },

    // Concreto y formaletería
    { id: 'mixer', cat: 'concreto', nombre: 'Camión mezclador de concreto',
      uso: 'Transporte de concreto premezclado desde la planta hasta el frente de vaciado.', specs: [], confirmado: false },
    { id: 'autobomba', cat: 'concreto', nombre: 'Autobomba de concreto',
      uso: 'Bombeo de concreto con pluma para losas, muros y elementos en altura.', specs: [], confirmado: false },
    { id: 'planta-dosificadora', cat: 'concreto', nombre: 'Planta dosificadora de concreto',
      uso: 'Producción de concreto en el sitio para obras con alto volumen de vaciado.', specs: [], confirmado: false },
    { id: 'bomba-estacionaria', cat: 'concreto', nombre: 'Bomba estacionaria de concreto',
      uso: 'Bombeo por tubería a grandes alturas o distancias donde no llega una pluma.', specs: [], confirmado: false },
    { id: 'formaleta-metalica', cat: 'concreto', nombre: 'Formaleta metálica',
      uso: 'Encofrado reutilizable para muros, columnas y losas con acabado uniforme.', specs: [], confirmado: false },
    { id: 'andamio', cat: 'concreto', nombre: 'Andamio multidireccional',
      uso: 'Acceso seguro a fachadas y estructuras para mampostería, acabados y montajes.', specs: [], confirmado: false },
    { id: 'puntales', cat: 'concreto', nombre: 'Puntales metálicos',
      uso: 'Apuntalamiento de losas y vigas durante el vaciado y el fraguado del concreto.', specs: [], confirmado: false },

    // Equipos industriales
    { id: 'perforadora', cat: 'industrial', nombre: 'Equipo de perforación para cimentación',
      uso: 'Perforación de pilotes, caissons y anclajes para cimentaciones profundas.', specs: [], confirmado: false },
    { id: 'trituradora', cat: 'industrial', nombre: 'Planta trituradora de agregados',
      uso: 'Trituración y clasificación de roca para producir agregados en cantera o en obra.', specs: [], confirmado: false },
    { id: 'generador', cat: 'industrial', nombre: 'Planta eléctrica diésel',
      uso: 'Energía para campamentos, equipos eléctricos y frentes de obra sin red disponible.', specs: [], confirmado: false },
    { id: 'compresor', cat: 'industrial', nombre: 'Compresor de aire portátil',
      uso: 'Aire comprimido para martillos neumáticos, perforación y limpieza de superficies.', specs: [], confirmado: false },
    { id: 'soldadura', cat: 'industrial', nombre: 'Equipos de soldadura',
      uso: 'Montaje y reparación de estructuras metálicas, tuberías y elementos de acero en obra.', specs: [], confirmado: false },
    { id: 'contenedor-obra', cat: 'industrial', nombre: 'Contenedores y módulos de obra',
      uso: 'Oficinas, almacenes y campamentos temporales para el frente de trabajo.', specs: [], confirmado: false }
  ]
};
