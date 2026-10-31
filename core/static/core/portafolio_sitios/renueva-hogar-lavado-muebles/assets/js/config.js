/* =========================================================================
   Renueva Hogar — configuración comercial
   -------------------------------------------------------------------------
   ÚNICO archivo que se edita al recibir los datos del negocio.
   Regla: ningún dato se inventa. Lo que no esté confirmado se deja vacío
   ('' o null) y la página lo oculta (modo 'publicacion') o lo marca
   «Por configurar» (modo 'revision').
   ========================================================================= */
window.SITE = {
  // 'revision' muestra la barra de demostración y los avisos «Por configurar».
  // Cambiar a 'publicacion' cuando los datos estén completos y verificados.
  modo: 'revision',

  marca: {
    nombre: 'Renueva Hogar',
    descriptor: 'Lavado profesional de muebles'
  },

  // Número en formato internacional SIN «+», espacios ni guiones: 57 + 10 dígitos.
  // Ejemplo de formato (NO es un número real): '573000000000'. Vacío = sin configurar.
  whatsapp: '',

  contacto: {
    telefono: '',     // para llamadas, si es distinto del WhatsApp
    correo: '',
    horario: '',      // p. ej. 'Lunes a sábado, 8:00 a. m. – 6:00 p. m.' (solo si está confirmado)
    direccion: ''     // servicio a domicilio: dejar vacío si no hay sede de atención al público
  },

  ciudadPrincipal: 'Bucaramanga',
  // Cobertura sujeta a confirmación operativa: el texto de la página lo aclara.
  municipios: ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta'],

  // URLs completas (https://…). Vacías = no se muestran.
  redes: {
    instagram: '',
    facebook: '',
    tiktok: ''
  },

  // Mensajes precargados de WhatsApp. {mueble} se reemplaza en los botones «Cotizar este mueble».
  mensajes: {
    general: 'Hola, quiero cotizar el lavado de un sofá o sala en Bucaramanga. ¿Qué información necesitan para darme un precio?',
    mueble: 'Hola, quiero cotizar el lavado de {mueble}. ¿Qué información necesitan para darme un precio?',
    paquete: 'Hola, me interesa el paquete «{paquete}». ¿Qué información necesitan para cotizarlo?'
  },

  // Paquetes. precio: null = «Solicitar cotización». Si el negocio fija tarifas,
  // escribir el valor en COP como entero (p. ej. 150000) y opcionalmente 'precioNota'.
  paquetes: [
    {
      id: 'individual',
      nombre: 'Mueble individual',
      para: 'Una poltrona, un sillón, un sofá pequeño o un grupo de sillas.',
      incluye: ['Revisión del tipo de tela antes de empezar', 'Aspirado en seco', 'Lavado y extracción según el material', 'Recomendaciones de secado'],
      precio: null,
      precioNota: ''
    },
    {
      id: 'sala',
      nombre: 'Sala completa',
      para: 'Sofá principal, sofá auxiliar o poltronas de una misma sala.',
      incluye: ['Todo lo del mueble individual, en cada pieza', 'Cojines sueltos de la sala', 'Atención puntual de manchas visibles, según su origen', 'Revisión final contigo'],
      precio: null,
      precioNota: ''
    },
    {
      id: 'sala-sillas',
      nombre: 'Renovación de sala y sillas',
      para: 'La sala completa más las sillas tapizadas del comedor.',
      incluye: ['Todo lo de la sala completa', 'Sillas de comedor tapizadas', 'Orden de trabajo pensado para que puedas usar los espacios', 'Recomendaciones de cuidado por tipo de tela'],
      precio: null,
      precioNota: ''
    }
  ],

  // Resultados reales de antes y después. Mientras esté vacío se muestra una
  // simulación claramente marcada como ilustrativa. Cada par debe ser el MISMO mueble:
  // { antes: 'assets/images/resultados/sala-1-antes.webp', despues: '…-despues.webp',
  //   alt: 'Sofá gris de tres puestos', nota: 'Floridablanca, mancha de café' }
  resultados: [],

  aviso: {
    responsable: '',  // razón social o nombre del responsable del tratamiento de datos
    nit: ''
  },

  seo: {
    // Dominio definitivo (https://www.ejemplo.com). Mientras esté vacío NO se
    // publican canonical ni datos estructurados.
    dominio: ''
  }
};
