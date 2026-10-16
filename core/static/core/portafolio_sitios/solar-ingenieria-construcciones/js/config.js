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
    nombre: 'Solar Ingeniería Diseño y Construcciones',
    razonSocial: null,     // ej. 'Solar Ingeniería Diseño y Construcciones S.A.S.'
    nit: null,             // ej. '900.000.000-0'
    ciudad: null,          // ej. 'Bucaramanga'
    region: 'Santander, Colombia'
  },

  // Latitud usada por la carta solar de la portada. Por defecto, Bucaramanga
  // (capital de Santander). Cámbiala por la de la sede cuando se confirme.
  cartaSolar: {
    latitud: 7.12,
    lugar: 'Bucaramanga'
  },

  contacto: {
    telefono: null,      // ej. '+57 607 000 0000'  (formato de visualización)
    telefonoHref: null,  // ej. '+576070000000'     (solo dígitos y + para tel:)
    correo: null,        // ej. 'proyectos@dominio.com.co'
    whatsapp: null,      // solo dígitos con indicativo, ej. '573000000000'
    direccion: null,     // dirección completa de la sede
    horario: null        // ej. 'Lunes a viernes, 7:30 a. m. a 5:30 p. m.'
  },

  // Mensaje inicial de WhatsApp (solo se usa si hay número).
  whatsappMensaje: 'Hola, quisiera información sobre un proyecto de energía solar.',

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
