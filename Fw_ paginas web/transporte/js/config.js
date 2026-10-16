/* ==========================================================================
   Datos del sitio — ÚNICO archivo que hay que editar al recibir información
   verificada de la cooperativa.

   Regla: un valor en null NO se muestra. Nada de lo que hay aquí se ha
   inventado: todo dato de contacto, legal o social está vacío hasta que la
   cooperativa lo confirme por escrito.

   modo:
     'revision'    → muestra el contenido provisional con la marca
                     «Por confirmar» (para que la cooperativa lo revise).
     'publicacion' → oculta todo elemento marcado data-status="pendiente"
                     y muestra las alternativas data-only="publicacion".
   ========================================================================== */
window.SITE = {
  modo: 'revision',

  nombreLegal: 'Cooperativa Santandereana de Transportadores Limitada',
  ubicacion: 'Bucaramanga, Santander', // tomado del encargo; confirmar dirección exacta

  contacto: {
    telefono: null,      // ej. '+57 607 000 0000'  (formato de visualización)
    telefonoHref: null,  // ej. '+576070000000'     (solo dígitos para tel:)
    correo: null,        // ej. 'contacto@dominio.com.co'
    whatsapp: null,      // solo dígitos con indicativo, ej. '573000000000'
    direccion: null,     // dirección completa de la sede
    horario: null        // ej. 'Lunes a viernes, 7:00 a. m. a 6:00 p. m.'
  },

  // Perfiles oficiales: añade solo los que la cooperativa confirme.
  // Formato: { red: 'Facebook', url: 'https://…', icono: 'facebook' }
  redes: [],

  legal: {
    politicaDatosUrl: null,  // política de tratamiento de datos (Ley 1581 de 2012)
    privacidadUrl: null      // aviso de privacidad
  },

  // URL del servicio que recibirá el formulario (POST JSON).
  // Mientras sea null, el formulario valida pero NO envía nada y lo dice.
  formEndpoint: null
};
