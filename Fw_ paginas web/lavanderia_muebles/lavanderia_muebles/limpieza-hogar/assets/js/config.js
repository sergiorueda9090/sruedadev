/* =========================================================================
   Hogar Claro — configuración comercial
   -------------------------------------------------------------------------
   ÚNICO archivo que se edita al recibir los datos del negocio.
   Ningún dato se inventa: lo no confirmado queda vacío ('' o null) y la
   página lo oculta (modo 'publicacion') o lo marca «Por configurar» (modo 'revision').
   ========================================================================= */
window.SITE = {
  modo: 'revision', // 'revision' | 'publicacion'

  marca: {
    nombre: 'Hogar Claro',
    descriptor: 'Limpieza profesional'
  },

  // 57 + 10 dígitos, sin «+» ni espacios. Ejemplo de FORMATO (no es real): '573000000000'.
  whatsapp: '',

  contacto: { telefono: '', correo: '', horario: '', direccion: '' },

  ciudadPrincipal: 'Bucaramanga',
  municipios: ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta'],

  redes: { instagram: '', facebook: '', tiktok: '' },

  // Servicios que el negocio presta hoy. false = se oculta de la página y del formulario.
  servicios: {
    general: true,
    profunda: true,
    cocina: true,
    banos: true,
    habitaciones: true,
    mudanza: true,
    remodelacion: true,
    oficina: true
  },

  // Lavado de muebles/tapicería como complemento. Solo poner true si el negocio lo ofrece.
  complementoTapiceria: false,

  mensajes: {
    // {municipio} y {tipo} se reemplazan con lo que elija la persona.
    general: 'Hola, quiero cotizar un servicio de limpieza para mi hogar. El inmueble está en {municipio} y necesito {tipo}.',
    servicio: 'Hola, quiero cotizar {servicio}. ¿Qué información necesitan?',
    paquete: 'Hola, me interesa el paquete «{paquete}». ¿Qué información necesitan para cotizarlo?'
  },

  // Alcance editable de cada paquete. precio: null = «Cotizar». Entero en COP para fijar tarifa.
  paquetes: [
    { nombre: 'Hogar en orden', para: 'Mantenimiento de un hogar habitado.', alcance: ['Polvo en superficies a la mano', 'Barrido y trapeado', 'Cocina y baños: limpieza de superficies', 'Tendido de camas si lo pides'], precio: null },
    { nombre: 'Limpieza profunda', para: 'Cuando hace tiempo no se hace a fondo.', alcance: ['Todo lo de «Hogar en orden»', 'Interior de gabinetes vacíos y electrodomésticos acordados', 'Juntas de baldosa, grifería y vidrios interiores de baño', 'Zonas acordadas detrás o debajo de muebles movibles'], precio: null },
    { nombre: 'Mudanza sin complicaciones', para: 'Inmueble desocupado, antes de entrar o al entregar.', alcance: ['Gabinetes, closets y cajones por dentro', 'Pisos, guardaescobas y puertas', 'Cocina y baños a fondo', 'Ventanas por el lado interior'], precio: null },
    { nombre: 'Oficina limpia', para: 'Oficinas pequeñas y consultorios.', alcance: ['Escritorios y superficies de trabajo despejadas', 'Pisos y papeleras', 'Cocineta y baño de la oficina', 'Frecuencia acordada'], precio: null }
  ],

  aviso: { responsable: '', nit: '' },
  seo: { dominio: '' } // https://… — sin dominio no se publican canonical ni datos estructurados
};
