/* =====================================================================
   Categorías del catálogo (fuente única para web y PDF)
   - id: se usa en products.js (campo "categoria") y en la URL (?categoria=)
   - orden: posición en menús, catálogo e índice del PDF
   - icono: nombre de Bootstrap Icons (https://icons.getbootstrap.com)
   - imagen: foto de la categoría (opcional; null = se usa el icono)
   ===================================================================== */
window.OXI = window.OXI || {};

window.OXI.categories = [
  {
    id: "aireadores",
    nombre: "Aireadores",
    orden: 1,
    icono: "bi-fan",
    imagen: "assets/images/products/aireador-paletas-operacion.webp",
    descripcion:
      "Equipos que transfieren oxígeno al agua y la ponen en movimiento en estanques en tierra y reservorios."
  },
  {
    id: "oxigenacion",
    nombre: "Sistemas de oxigenación",
    orden: 2,
    icono: "bi-wind",
    imagen: "assets/images/products/difusor-disco.webp",
    descripcion:
      "Soplado y difusión de aire para tanques, estanques profundos y sistemas de alta densidad."
  },
  {
    id: "piscicultura",
    nombre: "Equipos para piscicultura",
    orden: 3,
    icono: "bi-speedometer2",
    imagen: "assets/images/products/alimentador-automatico.webp",
    descripcion:
      "Medición, control y alimentación para manejar la producción con datos."
  },
  {
    id: "tanques",
    nombre: "Tanques y estructuras",
    orden: 4,
    icono: "bi-circle",
    imagen: "assets/images/products/tanque-circular.webp",
    descripcion:
      "Tanques circulares, geomembranas y estructuras para levante y engorde."
  },
  {
    id: "accesorios",
    nombre: "Accesorios y componentes",
    orden: 5,
    icono: "bi-nut",
    imagen: "assets/images/products/flotadores-aireador.webp",
    descripcion:
      "Repuestos, flotadores, mangueras y componentes para instalación y mantenimiento."
  }
];
