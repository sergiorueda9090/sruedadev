/* ==========================================================================
   Datos del sitio — ÚNICO archivo que hay que editar al recibir información
   verificada de la empresa.

   Regla: un valor en null NO se muestra. Nada de lo que hay aquí se ha
   inventado: todo dato de contacto, legal o social está vacío hasta que la
   empresa lo confirme por escrito.

   modo:
     'revision'    → muestra el contenido provisional con la etiqueta
                     «Por confirmar» y el aviso de prototipo.
     'publicacion' → oculta todo elemento marcado data-status="pendiente"
                     y muestra las alternativas data-only="publicacion".

   Los colores y la tipografía están en el bloque :root de css/styles.css.
   ========================================================================== */
window.SITE = {
  modo: 'revision',

  empresa: {
    nombre: 'Easypark de Colombia S.A.S.',
    nombreCorto: 'Easypark de Colombia',
    nit: null,                 // ej. '900.000.000-0'
    ciudad: 'Bucaramanga',     // dato del encargo, pendiente de verificar la dirección
    region: 'Santander, Colombia'
  },

  contacto: {
    telefono: null,      // ej. '302 271 9337'      (formato de visualización)
    telefonoHref: null,  // ej. '+573022719337'     (solo dígitos y + para tel:)
    correo: null,        // ej. 'comercial@dominio.com.co'
    whatsapp: null,      // solo dígitos con indicativo, ej. '573022719337'
    direccion: null,     // dirección completa de la sede
    horario: null        // ej. 'Lunes a viernes, 8:00 a. m. a 6:00 p. m.'
  },

  // Datos recibidos que NO se han verificado. Solo se ven en modo revisión,
  // con la etiqueta «Sin verificar», y nunca se convierten en enlaces.
  // Cuando la empresa confirme el número, cópialo a contacto.telefono /
  // telefonoHref (y a whatsapp si ese número tiene WhatsApp) y bórralo de aquí.
  porVerificar: {
    telefono: '302 271 9337'
  },

  // Mensaje inicial de WhatsApp (solo se usa si hay número).
  whatsappMensaje: 'Hola, quisiera información sobre sus servicios para parqueaderos.',

  // Perfiles oficiales: añade solo los que la empresa confirme.
  // ej. { red: 'LinkedIn', url: 'https://www.linkedin.com/company/...', icono: 'linkedin' }
  redes: [],

  legal: {
    // URL de la política de tratamiento de datos aprobada (Ley 1581 de 2012).
    // Mientras sea null, el enlace lleva al borrador interno privacidad.html.
    privacidad: null
  },

  // Destino del formulario (POST JSON). null = el formulario valida pero
  // informa que no se ha enviado nada.
  formEndpoint: null
};
