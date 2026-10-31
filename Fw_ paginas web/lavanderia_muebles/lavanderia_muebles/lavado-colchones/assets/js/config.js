/* =========================================================================
   Descanso Fresco — configuración comercial
   -------------------------------------------------------------------------
   ÚNICO archivo que se edita al recibir los datos del negocio.
   Ningún dato se inventa: lo no confirmado queda vacío ('' o null) y la
   página lo oculta (modo 'publicacion') o lo marca «Por configurar» (modo 'revision').
   ========================================================================= */
window.SITE = {
  modo: 'revision', // 'revision' | 'publicacion'

  marca: {
    nombre: 'Descanso Fresco',
    descriptor: 'Cuidado profesional de colchones'
  },

  // Colores de marca (opcional). Cambian los tokens principales sin tocar el CSS.
  // Mantén contraste AA: 'primario' debe leerse con texto blanco encima.
  colores: {
    primario: '',   // p. ej. '#23649A'
    acento: ''      // p. ej. '#177A75'
  },

  // 57 + 10 dígitos, sin «+» ni espacios. Ejemplo de FORMATO (no es real): '573000000000'.
  whatsapp: '',

  contacto: { telefono: '', correo: '', horario: '', direccion: '' },

  ciudadPrincipal: 'Bucaramanga',
  municipios: ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta'],

  redes: { instagram: '', facebook: '', tiktok: '' },

  // Medidas de referencia en cm (ancho × largo) usadas en el plano a escala.
  // Son medidas comunes en Colombia; cada fabricante puede variar.
  tamanos: [
    { id: 'sencillo', nombre: 'Sencillo', ancho: 100, largo: 190 },
    { id: 'semidoble', nombre: 'Semidoble', ancho: 120, largo: 190 },
    { id: 'doble', nombre: 'Doble', ancho: 140, largo: 190 },
    { id: 'queen', nombre: 'Queen', ancho: 160, largo: 190 },
    { id: 'king', nombre: 'King', ancho: 200, largo: 200 }
  ],

  mensajes: {
    // {tamano} y {municipio} se reemplazan con lo que elija la persona.
    tamano: 'Hola, quiero cotizar la limpieza de un colchón. El tamaño es {tamano} y estoy ubicado en {municipio}.',
    general: 'Hola, quiero cotizar la limpieza de un colchón. ¿Qué información necesitan?',
    paquete: 'Hola, me interesa «{paquete}». ¿Qué información necesitan para cotizarlo?'
  },

  // precio: null = «Cotizar servicio». Para fijar tarifa: entero en COP.
  paquetes: [
    { nombre: 'Colchón individual', para: 'Sencillo o semidoble.', incluye: ['Aspirado de ambas caras, si el colchón se puede voltear', 'Tratamiento de manchas según el material', 'Recomendaciones de secado'], precio: null },
    { nombre: 'Colchón doble o queen', para: 'Camas de dos personas.', incluye: ['Todo lo del colchón individual', 'Revisión de bordes y costuras'], precio: null },
    { nombre: 'Colchón king', para: 'El tamaño más grande.', incluye: ['Todo lo del colchón doble', 'Tiempo de secado estimado según la habitación'], precio: null },
    { nombre: 'Colchón más cabecero', para: 'Cualquier tamaño, con cabecero tapizado en tela.', incluye: ['Limpieza del colchón', 'Aspirado y limpieza del cabecero', 'Prueba previa en una zona poco visible del tapizado'], precio: null }
  ],

  aviso: { responsable: '', nit: '' },
  seo: { dominio: '' } // https://… — sin dominio no se publican canonical ni datos estructurados
};
