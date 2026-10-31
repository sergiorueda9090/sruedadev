/*
 * Configuración del sitio. Es el archivo que se edita al recibir los datos reales de la empresa.
 *
 * «Rasante Maquinaria y Equipos» es una MARCA FICTICIA DE DEMOSTRACIÓN: sustitúyala por el nombre real.
 *
 * - modo: 'revision'    → muestra el aviso de demostración, las etiquetas «Por confirmar»
 *                          y todo el catálogo de referencia.
 *         'publicacion' → oculta todo lo pendiente y en el catálogo solo muestra equipos con confirmado: true.
 * - Deje en '' (o [] en listas) todo dato no confirmado: la página lo oculta o lo marca.
 * - contacto.whatsapp: número internacional solo con dígitos, p. ej. '57' + 10 dígitos.
 * - formEndpoint: URL https que recibe el formulario como JSON (POST). Vacío = el formulario
 *   valida, prepara el mensaje y dice claramente que no se envió.
 * - Tras editar este archivo ejecute `python3 tools/seo.py` (canonical, Open Graph, JSON-LD, sitemap).
 */
window.SITE = {
  modo: 'revision',

  marca: {
    nombre: 'Rasante',
    complemento: 'Maquinaria y Equipos',
    ficticia: true
  },

  // URL https definitiva del sitio, con barra final. Vacío = no se declara canonical ni sitemap.
  dominio: '',
  formEndpoint: '',

  contacto: {
    telefono: '',        // Formato visible, p. ej. '+57 300 000 0000'. Solo si está verificado.
    whatsapp: '',        // Solo dígitos con código de país.
    email: '',
    direccion: '',       // Solo si la empresa quiere publicarla.
    ciudad: '',
    departamento: '',
    horario: ''
  },

  // Zonas de operación confirmadas, p. ej. ['Bucaramanga y área metropolitana', 'Santander', 'Norte de Santander'].
  cobertura: [],

  // Dato de experiencia verificable, p. ej. 'Operando desde 2012'. Vacío = no se muestra.
  experiencia: '',

  // Solo perfiles confirmados (URL https completa).
  redes: {
    facebook: '',
    instagram: '',
    linkedin: '',
    youtube: ''
  },

  // Medición: no se carga nada mientras ga4 esté vacío. Con ID, solo tras aceptar el aviso de cookies.
  analytics: {
    ga4: ''              // p. ej. 'G-XXXXXXXXXX' (no inventar)
  },

  // Ventajas que la empresa puede demostrar. confirmado: false = solo visible en modo revisión.
  diferenciadores: [
    {
      icono: 'bi-geo-alt',
      titulo: 'Cobertura en la región',
      texto: 'Zonas y ciudades donde la empresa opera y puede movilizar equipos.',
      confirmado: false
    },
    {
      icono: 'bi-truck',
      titulo: 'Transporte de la maquinaria hasta la obra',
      texto: 'Movilización en cama baja propia o contratada, y condiciones de entrega en el frente de trabajo.',
      confirmado: false
    },
    {
      icono: 'bi-person-gear',
      titulo: 'Operadores y mantenimiento',
      texto: 'Si los equipos se alquilan con operador calificado y quién asume el mantenimiento durante el contrato.',
      confirmado: false
    },
    {
      icono: 'bi-clipboard-check',
      titulo: 'Documentación del equipo',
      texto: 'Documentos que se entregan con cada equipo: SOAT, revisión técnico-mecánica, pólizas, certificados de inspección.',
      confirmado: false
    },
    {
      icono: 'bi-headset',
      titulo: 'Atención comercial directa',
      texto: 'Un contacto comercial que revisa cada solicitud y responde con disponibilidad y condiciones.',
      confirmado: false
    }
  ],

  mensajes: {
    whatsappGeneral: 'Hola, estoy interesado en conocer más sobre sus servicios. ¿Podrían ayudarme con información y una cotización?',
    // {equipo} y {ciudad} se reemplazan; si no hay ciudad se omite esa parte.
    whatsappEquipo: 'Hola, quiero consultar disponibilidad y cotización de: {equipo}{ciudad}. ¿Me pueden dar información?'
  }
};
