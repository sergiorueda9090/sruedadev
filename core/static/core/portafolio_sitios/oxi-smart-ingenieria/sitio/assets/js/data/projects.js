/* =====================================================================
   PROYECTOS — portafolio (página Proyectos e Inicio)
   ---------------------------------------------------------------------
   Solo proyectos REALES de Oxi Smart Ingeniería, con fotos propias y
   autorización del cliente final. Mientras la lista esté vacía, el sitio
   muestra un estado vacío con invitación a cotizar.

   Formato de cada proyecto:
   {
     id: "finca-ejemplo-meta",                // sin espacios ni tildes
     nombre: "Aireación de 6 estanques de tilapia",
     ubicacion: "Municipio, Departamento",
     tipo: "aireacion",                       // id de un tipo de solución (abajo)
     equipos: ["aireador-de-paletas"],        // ids de products.js (o texto libre)
     descripcion: "Qué se hizo y para qué.",
     resultados: [],                          // SOLO resultados medidos y verificables
     fecha: "2026-05",                        // opcional, AAAA-MM
     imagenes: [
       { src: "assets/images/projects/finca-ejemplo-1.webp", alt: "Descripción de la foto" }
     ]
   }
   ===================================================================== */
window.OXI = window.OXI || {};

window.OXI.projectTypes = [
  { id: "aireacion", nombre: "Aireación de estanques" },
  { id: "oxigenacion", nombre: "Oxigenación en tanques" },
  { id: "infraestructura", nombre: "Tanques e infraestructura" },
  { id: "control", nombre: "Control y monitoreo" }
];

window.OXI.projects = [];
