"""Contenido de la página, centralizado aquí para no repetirlo entre vistas y
context processors. No hay CMS ni modelos todavía: esto es lo más cercano a
una única fuente de verdad para el contenido estático del sitio.
"""

SERVICIOS = [
    {
        "slug": "desarrollo-web",
        # Apunta a la ficha de servicio más cercana en /servicios/<slug>/ (ver
        # PLANES). No hay una ficha "desarrollo-web" propia: esta tarjeta cubre
        # tanto landing pages como sitios corporativos, así que enlaza a la más
        # general de las dos.
        "detalle_slug": "paginas-web-corporativas",
        "titulo": "Desarrollo Web",
        "descripcion": (
            "Sitios corporativos, landing pages y portales rápidos, responsivos y "
            "optimizados para aparecer en Google. Diseño propio, nada de plantillas genéricas."
        ),
        "icono": (
            '<rect x="2" y="4" width="20" height="16" rx="2"></rect>'
            '<path d="M2 9h20M6 6.5h.01M9 6.5h.01"></path>'
        ),
        "entregables": ["Diseño UI/UX", "Sitio responsivo", "SEO técnico", "Certificado SSL"],
    },
    {
        "slug": "software-a-medida",
        "detalle_slug": "software-a-la-medida",
        "titulo": "Software a tu Medida",
        "descripcion": (
            "Sistemas de gestión hechos para tu operación real: inventario, facturación, "
            "citas, reportes. Automatizamos lo que hoy haces en papel o en Excel."
        ),
        "icono": '<path d="M8 17l-5-5 5-5M16 7l5 5-5 5M14 4l-4 16"></path>',
        "entregables": ["Análisis de procesos", "Módulos a medida", "Roles y permisos", "Reportes"],
    },
    {
        "slug": "ai-automatizacion",
        "detalle_slug": "agentes-ia-automatizacion",
        "titulo": "AI Automatización",
        "descripcion": (
            "Automatizamos tareas repetitivas y flujos de trabajo con inteligencia artificial: "
            "chatbots, procesamiento de documentos y agentes que trabajan por ti."
        ),
        "icono": (
            '<rect x="4" y="8" width="16" height="12" rx="2"></rect>'
            '<path d="M12 8V4M9 4h6M8 13h.01M16 13h.01"></path><path d="M2 14h2M20 14h2"></path>'
        ),
        "entregables": ["Chatbots con IA", "Automatización de procesos", "Análisis de datos", "Agentes personalizados"],
    },
    {
        "slug": "integracion-apis",
        "detalle_slug": "desarrollo-apis",
        "titulo": "Integración con APIs",
        "descripcion": (
            "Conectamos tu sistema con pasarelas de pago, CRMs, facturación electrónica y "
            "cualquier servicio externo que tu operación necesite."
        ),
        "icono": '<path d="M9 3v4M15 3v4M9 17v4M15 17v4"></path><rect x="6" y="7" width="12" height="10" rx="2"></rect>',
        "entregables": ["Conexión con terceros", "Facturación electrónica", "Webhooks", "Sincronización de datos"],
    },
    {
        "slug": "tiendas-online",
        "detalle_slug": "tiendas-online",
        "titulo": "E-commerce",
        "descripcion": (
            "Tiendas en línea con catálogo, carrito, pasarela de pagos y control de stock, "
            "integradas con tus redes sociales."
        ),
        "icono": (
            '<path d="M2 3h2.5l2.2 11.2a2 2 0 002 1.6h8.7a2 2 0 002-1.6L21 7H6"></path>'
            '<circle cx="9" cy="20" r="1.4"></circle><circle cx="18" cy="20" r="1.4"></circle>'
        ),
        "entregables": ["Catálogo", "Pasarela de pagos", "Control de stock", "Envíos"],
    },
]

PROCESO = [
    {
        "numero": "01",
        "etiqueta": "Diagnóstico",
        "titulo": "Conversamos sobre tu proyecto",
        "descripcion": "Entiendo tu necesidad, objetivos, usuarios y presupuesto aproximado.",
        "foto": "descubrimiento",
    },
    {
        "numero": "02",
        "etiqueta": "Alcance y precio",
        "titulo": "Definimos la solución",
        "descripcion": "Acordamos funcionalidades, entregables, tiempos, costos y condiciones.",
        "foto": "propuesta",
    },
    {
        "numero": "03",
        "etiqueta": "Construcción",
        "titulo": "Desarrollo y validación",
        "descripcion": "Construyo la solución y revisamos el funcionamiento conforme al alcance acordado.",
        "foto": "desarrollo",
    },
    {
        "numero": "04",
        "etiqueta": "Puesta en marcha",
        "titulo": "Entrega y publicación",
        "descripcion": "Realizo la puesta en marcha, entrego la documentación acordada y explico cómo utilizar la solución.",
        "foto": "pruebas",
    },
]

PROYECTOS = [
    # Landing pages propias: proyectos realmente construidos, servidos desde este mismo sitio.
    {
        "slug": "bufete-ramirez-asociados",
        "categoria": "Web",
        "imagen": "core/img/portafolio/bufete-ramirez-asociados.jpg",
        "nombre": "Ramírez & Asociados — Derecho Corporativo",
        "resumen": "Landing page corporativa para un bufete de derecho empresarial: áreas de práctica, equipo y formulario de consulta.",
        "stack": ["HTML5", "CSS3", "Bootstrap 5", "JavaScript"],
    },
    {
        "slug": "colombia-viva-viajes",
        "categoria": "Web",
        "imagen": "core/img/portafolio/colombia-viva-viajes.jpg",
        "nombre": "Colombia Viva — Turismo Nacional",
        "resumen": "Landing page para una agencia de turismo nacional, con destinos destacados y paquetes de viaje.",
        "stack": ["HTML5", "CSS3", "Bootstrap 5", "JavaScript"],
    },
    {
        "slug": "altavista-constructora",
        "categoria": "Web",
        "imagen": "core/img/portafolio/altavista-constructora.jpg",
        "nombre": "Altavista — Constructora de Proyectos Premium",
        "resumen": "Landing page para una constructora de proyectos residenciales premium, con catálogo de apartamentos y casas.",
        "stack": ["HTML5", "CSS3", "Bootstrap 5", "JavaScript"],
    },
    {
        "slug": "dentalsmile-consultorio",
        "categoria": "Web",
        "imagen": "core/img/portafolio/dentalsmile-consultorio.jpg",
        "nombre": "DentalSmile — Consultorio Odontológico",
        "resumen": "Landing page para un consultorio odontológico: servicios de blanqueamiento, ortodoncia e implantes, y agendamiento de citas.",
        "stack": ["HTML5", "CSS3", "Bootstrap 5", "JavaScript"],
    },
    {
        "slug": "portafolio-desarrollador-freelance",
        "categoria": "Web",
        "imagen": "core/img/portafolio/portafolio-desarrollador-freelance.jpg",
        "nombre": "Portafolio — Desarrollador Web Freelance",
        "resumen": "Sitio de presentación personal para un desarrollador freelance especializado en Django, Python, PHP e IA.",
        "stack": ["HTML5", "CSS3", "Bootstrap 5", "JavaScript"],
    },
    {
        "slug": "devcraft-desarrollo-software",
        "categoria": "Software",
        "imagen": "core/img/portafolio/devcraft-desarrollo-software.jpg",
        "nombre": "DevCraft — Desarrollo Web y Software",
        "resumen": "Landing page para una marca de desarrollo de software, bots inteligentes y soluciones en AWS.",
        "stack": ["HTML5", "CSS3", "Bootstrap 5", "JavaScript"],
    },
    {
        "slug": "ironforge-gym",
        "categoria": "Web",
        "imagen": "core/img/portafolio/ironforge-gym.jpg",
        "nombre": "Ironforge Gym",
        "resumen": "Landing page para un gimnasio: disciplinas (musculación, CrossFit, boxeo, spinning) y planes de membresía.",
        "stack": ["HTML5", "CSS3", "Bootstrap 5", "JavaScript"],
    },
    {
        "slug": "brasakfire-hamburgueseria",
        "categoria": "Web",
        "imagen": "core/img/portafolio/brasakfire-hamburgueseria.jpg",
        "nombre": "BrasakFire — Hamburguesería",
        "resumen": "Landing page para una hamburguesería, con menú destacado y pedidos por WhatsApp.",
        "stack": ["HTML5", "CSS3", "Bootstrap 5", "JavaScript"],
    },
    {
        "slug": "lumiere-botanica-serum",
        "categoria": "E-commerce",
        "imagen": "core/img/portafolio/lumiere-botanica-serum.jpg",
        "nombre": "Lumière Botanica — Sérum Facial",
        "resumen": "Landing page de lanzamiento para un sérum facial natural, orientada a preventa y captura de interesados.",
        "stack": ["HTML5", "CSS3", "Bootstrap 5", "JavaScript"],
    },
    {
        "slug": "mente-plena-psicologia",
        "categoria": "Web",
        "imagen": "core/img/portafolio/mente-plena-psicologia.jpg",
        "nombre": "Mente Plena — Consultorio de Psicología",
        "resumen": "Landing page para un consultorio de psicología con atención presencial y virtual para adultos, niños y familias.",
        "stack": ["HTML5", "CSS3", "Bootstrap 5", "JavaScript"],
    },
    {
        "slug": "muvit-mudanzas-logistica",
        "categoria": "Web",
        "imagen": "core/img/portafolio/muvit-mudanzas-logistica.jpg",
        "nombre": "Muvit — Mudanzas & Logística",
        "resumen": "Landing page para una empresa de mudanzas y logística, con cotización de fletes y transporte.",
        "stack": ["HTML5", "CSS3", "Bootstrap 5", "JavaScript"],
    },
    {
        "slug": "patitas-vet-clinica",
        "categoria": "Web",
        "imagen": "core/img/portafolio/patitas-vet-clinica.jpg",
        "nombre": "Patitas Vet — Clínica Veterinaria & Pet Shop",
        "resumen": "Landing page para una clínica veterinaria con pet shop y peluquería, mostrando servicios y agendamiento.",
        "stack": ["HTML5", "CSS3", "Bootstrap 5", "JavaScript"],
    },
    {
        "slug": "seguros-com-digital",
        "categoria": "Software",
        "imagen": "core/img/portafolio/seguros-com-digital.jpg",
        "nombre": "Seguros.com — Seguridad Digital",
        "resumen": "Landing page para una plataforma digital de seguros, enfocada en cotización rápida en línea.",
        "stack": ["HTML5", "CSS3", "Bootstrap 5", "JavaScript"],
    },
    {
        "slug": "bella-spa-centro-belleza",
        "categoria": "Web",
        "imagen": "core/img/portafolio/bella-spa-centro-belleza.jpg",
        "nombre": "Bella Spa — Centro de Belleza & Bienestar",
        "resumen": "Landing page para un spa de bienestar: masajes, tratamientos faciales y reserva de citas.",
        "stack": ["HTML5", "CSS3", "Bootstrap 5", "JavaScript"],
    },
    {
        "slug": "clinica-aurora-medicina-estetica",
        "categoria": "Web",
        "imagen": "core/img/portafolio/clinica-aurora-medicina-estetica.jpg",
        "nombre": "Clínica Aurora — Medicina Estética",
        "resumen": "Landing page para una clínica de medicina estética y cirugía plástica en Medellín, con paquetes de turismo médico.",
        "stack": ["HTML5", "CSS3", "Bootstrap 5", "JavaScript"],
    },
    {
        "slug": "structura-construccion-industrial",
        "categoria": "Web",
        "imagen": "core/img/portafolio/structura-construccion-industrial.jpg",
        "nombre": "Structura — Construcción Comercial & Industrial",
        "resumen": "Landing page para una constructora especializada en proyectos comerciales e industriales de gran escala.",
        "stack": ["HTML5", "CSS3", "Bootstrap 5", "JavaScript"],
    },
    {
        "slug": "vialidad-centro-automovilistico",
        "categoria": "Web",
        "imagen": "core/img/portafolio/vialidad-centro-automovilistico.jpg",
        "nombre": "Vialidad — Centro Automovilístico",
        "resumen": "Landing page para una autoescuela: cursos de conducción para carros y motos, y trámite de licencias.",
        "stack": ["HTML5", "CSS3", "Bootstrap 5", "JavaScript"],
    },
    {
        "slug": "wanderlust-agencia-viajes",
        "categoria": "Web",
        "imagen": "core/img/portafolio/wanderlust-agencia-viajes.jpg",
        "nombre": "Wanderlust — Agencia de Viajes",
        "resumen": "Landing page para una agencia de viajes con destinos nacionales e internacionales y paquetes a medida.",
        "stack": ["HTML5", "CSS3", "Bootstrap 5", "JavaScript"],
    },
]

PLANES = [
    {
        "slug": "landing-pages",
        "titulo": "Landing pages",
        "descripcion": "Para captar clientes y promocionar servicios, productos o campañas.",
        "cta": "Crear mi landing page",
        "imagen": "core/img/servicios/landing-pages.jpg",
        "problema": (
            "Necesitas una página enfocada en un solo objetivo —vender un producto, captar "
            "contactos de una campaña o promocionar un servicio puntual— sin la distracción de "
            "un sitio completo con varias secciones."
        ),
        "para_quien": (
            "Para negocios que lanzan una campaña, un producto específico o una promoción y "
            "necesitan convertir visitas en contactos lo más rápido posible."
        ),
        "funcionalidades": [
            "Página de una sola sección, enfocada en conversión",
            "Formulario de contacto y enlace directo a WhatsApp",
            "Diseño adaptable a celular, tablet y computador",
            "Optimización básica para buscadores",
            "Certificado de seguridad SSL",
            "Integración con Google Analytics",
        ],
        "que_necesito": [
            "Textos e imágenes del producto o servicio a promocionar (o los armamos juntos)",
            "Identidad visual: logo y colores, si ya los tienes",
            "Claridad sobre el objetivo de la página: vender, agendar citas, captar contactos, etc.",
        ],
        "factores_costo": [
            "Número de secciones dentro de la página (hero, beneficios, testimonios, FAQ, etc.)",
            "Si el formulario debe conectarse a un sistema externo o solo a WhatsApp/correo",
            "Diseño desde cero frente a adaptación de una plantilla",
        ],
        "faq": [
            {
                "pregunta": "¿En cuánto tiempo puedo tener mi landing page lista?",
                "respuesta": "Normalmente entre 3 y 7 días hábiles, dependiendo de qué tan definido tengas el contenido.",
            },
            {
                "pregunta": "¿Puedo usarla para varias campañas distintas?",
                "respuesta": "Lo ideal es una landing por campaña u oferta, así cada una mantiene un mensaje enfocado. Se pueden crear nuevas reutilizando el mismo diseño base.",
            },
            {
                "pregunta": "¿Incluye dominio y alojamiento?",
                "respuesta": "No vienen incluidos, pero te oriento en la elección y configuración, o me encargo de todo el proceso si lo prefieres.",
            },
        ],
    },
    {
        "slug": "paginas-web-corporativas",
        "titulo": "Páginas web corporativas",
        "descripcion": "Para presentar la empresa, sus servicios y su propuesta de valor.",
        "cta": "Crear mi página web",
        "imagen": "core/img/servicios/paginas-corporativas.jpg",
        "problema": (
            "Tu negocio no tiene una presencia digital que refleje lo que realmente ofrece: te "
            "buscan en Google y no encuentran nada propio, solo redes sociales."
        ),
        "para_quien": (
            "Para empresas que necesitan presentar su marca, sus servicios y su trayectoria de "
            "forma profesional, con varias secciones independientes (inicio, servicios, "
            "nosotros, contacto)."
        ),
        "funcionalidades": [
            "Sitio de varias secciones independientes (inicio, servicios, nosotros, contacto)",
            "Catálogo de servicios o productos con fichas detalladas",
            "Galería de proyectos o trabajos realizados",
            "Formulario de contacto y enlace directo a WhatsApp",
            "Optimización básica para buscadores",
            "Diseño adaptable a celular, tablet y computador",
        ],
        "que_necesito": [
            "Información de la empresa: historia, servicios, equipo, si aplica",
            "Fotos o material gráfico propio (o te oriento en cómo conseguirlo)",
            "Identidad visual: logo y colores",
        ],
        "factores_costo": [
            "Número de secciones y páginas independientes",
            "Cantidad de servicios o productos a presentar con ficha propia",
            "Si necesita contenido en más de un idioma",
        ],
        "faq": [
            {
                "pregunta": "¿Cuántas páginas incluye?",
                "respuesta": "Depende del alcance que definamos: desde un sitio de una sola página con varias secciones, hasta uno con páginas independientes por servicio.",
            },
            {
                "pregunta": "¿Puedo actualizar el contenido yo mismo después?",
                "respuesta": "Podemos conversar si necesitas un panel para editar textos e imágenes, o si prefieres que yo haga los cambios cuando los necesites.",
            },
            {
                "pregunta": "¿Aparecerá mi negocio en Google?",
                "respuesta": "Se entrega con optimización técnica básica (SEO on-page). Posicionar en los primeros resultados es un trabajo continuo que se cotiza aparte si lo necesitas.",
            },
        ],
    },
    {
        "slug": "tiendas-online",
        "titulo": "Tiendas e-commerce",
        "descripcion": "Para vender productos, administrar pedidos y recibir pagos en línea.",
        "cta": "Crear mi tienda online",
        "imagen": "core/img/servicios/tiendas-ecommerce.jpg",
        "problema": (
            "Vendes por redes sociales o WhatsApp y cada vez es más difícil controlar "
            "inventario, pedidos y pagos a medida que creces."
        ),
        "para_quien": (
            "Para negocios que quieren vender en línea con catálogo, carrito de compras y "
            "pagos, sin depender solo de mensajes directos."
        ),
        "funcionalidades": [
            "Catálogo de productos con categorías y buscador",
            "Carrito de compras y pasarela de pagos",
            "Control de inventario y pedidos",
            "Diseño adaptable a celular, tablet y computador",
            "Certificado de seguridad SSL",
        ],
        "que_necesito": [
            "Listado de productos con fotos, precios y variantes (talla, color, etc.)",
            "La pasarela de pagos que quieres usar, o te oriento en cuál elegir",
            "Política de envíos y devoluciones, si ya la tienes definida",
        ],
        "factores_costo": [
            "Número de productos y variantes a cargar",
            "Pasarelas de pago a integrar",
            "Si necesita sincronización con un sistema de inventario o facturación existente",
        ],
        "faq": [
            {
                "pregunta": "¿Qué pasarelas de pago puedo usar?",
                "respuesta": "Las que ya operan en Colombia (Wompi, PayU, Mercado Pago, entre otras). Evaluamos juntos cuál conviene según tu operación.",
            },
            {
                "pregunta": "¿Quién carga los productos al catálogo?",
                "respuesta": "Hago la carga inicial con la información que me compartas. Después puedes administrar el catálogo tú mismo o pedirme que lo haga.",
            },
            {
                "pregunta": "¿Se integra con facturación electrónica?",
                "respuesta": "Se puede integrar, pero no viene incluido por defecto: se evalúa según el sistema de facturación que ya uses o quieras usar.",
            },
        ],
    },
    {
        "slug": "software-a-la-medida",
        "titulo": "Software a la medida",
        "descripcion": "Para digitalizar operaciones y desarrollar sistemas adaptados a cada empresa.",
        "cta": "Desarrollar mi software",
        "imagen": "core/img/servicios/software-medida.jpg",
        "problema": (
            "Tu operación depende de hojas de cálculo, cuadernos o sistemas genéricos que no se "
            "ajustan a cómo realmente trabajas, y eso te hace perder tiempo y cometer errores."
        ),
        "para_quien": (
            "Para organizaciones que necesitan un sistema propio que resuelva un proceso "
            "específico: inventario, citas, facturación interna, gestión de clientes, reportes, "
            "entre otros."
        ),
        "funcionalidades": [
            "Levantamiento de requerimientos y análisis de procesos",
            "Desarrollo a la medida en web",
            "Integración con los sistemas que ya utilizas",
            "Gestión de usuarios, roles y permisos",
            "Documentación técnica y capacitación al equipo",
        ],
        "que_necesito": [
            "Una descripción de cómo funciona hoy el proceso que quieres digitalizar",
            "Acceso o información de los sistemas existentes que deba integrar",
            "Disponibilidad para dos o tres reuniones cortas de validación durante el desarrollo",
        ],
        "factores_costo": [
            "Número de módulos y procesos a digitalizar",
            "Complejidad de las integraciones con sistemas existentes",
            "Cantidad de usuarios, roles y permisos distintos",
        ],
        "faq": [
            {
                "pregunta": "¿Cómo empieza el proceso?",
                "respuesta": "Con una conversación donde entiendo tu operación actual y qué problema específico quieres resolver, antes de proponer cualquier solución.",
            },
            {
                "pregunta": "¿Qué pasa si mi negocio crece y necesito más funciones?",
                "respuesta": "El sistema se construye por módulos, así que se le pueden agregar funcionalidades nuevas más adelante sin rehacer lo existente.",
            },
            {
                "pregunta": "¿Me entregan el código?",
                "respuesta": "Sí, al finalizar recibes el código fuente, los accesos y la documentación técnica necesaria para operarlo.",
            },
        ],
    },
    {
        "slug": "agentes-ia-automatizacion",
        "titulo": "Agentes de IA y automatización",
        "descripcion": "Para automatizar tareas, conectar herramientas y trabajar con información.",
        "cta": "Automatizar mi negocio",
        "imagen": "core/img/servicios/agentes-ia.jpg",
        "problema": (
            "Tu equipo pierde horas en tareas repetitivas —responder las mismas preguntas, "
            "copiar datos entre sistemas, revisar documentos— que podrían resolverse solas."
        ),
        "para_quien": (
            "Para empresas que quieren automatizar tareas repetitivas, conectar sus "
            "herramientas entre sí o dar respuesta inmediata a sus clientes con un agente "
            "conectado a su operación real."
        ),
        "funcionalidades": [
            "Chatbots y agentes conectados a tu operación (WhatsApp, web, correo)",
            "Automatización de procesos y flujos de trabajo entre herramientas",
            "Procesamiento y extracción de datos de documentos",
            "Integración con los sistemas que ya utilizas",
            "Documentación técnica y capacitación al equipo",
        ],
        "que_necesito": [
            "Una descripción clara de la tarea o conversación que quieres automatizar",
            "Acceso a las herramientas o sistemas que el agente debe consultar o actualizar",
            "Ejemplos reales de casos: preguntas frecuentes, documentos tipo, flujos actuales",
        ],
        "factores_costo": [
            "Cantidad de sistemas y herramientas a conectar",
            "Complejidad de las tareas que el agente debe resolver por sí solo",
            "Volumen de conversaciones o documentos a procesar",
        ],
        "faq": [
            {
                "pregunta": "¿El agente reemplaza a mi equipo?",
                "respuesta": "No. Se encarga de tareas repetitivas y de primer nivel, y deriva a una persona los casos que realmente lo necesitan.",
            },
            {
                "pregunta": "¿Funciona con WhatsApp?",
                "respuesta": "Sí, se puede conectar a WhatsApp Business, a tu sitio web o a ambos, según lo que necesites.",
            },
            {
                "pregunta": "¿Qué pasa si el agente no sabe responder algo?",
                "respuesta": "Se define un comportamiento claro para esos casos: deriva la conversación a una persona o pide la información que le falta, nunca inventa una respuesta.",
            },
        ],
    },
    {
        "slug": "desarrollo-apis",
        "titulo": "Desarrollo e integración de APIs",
        "descripcion": "Para conectar aplicaciones, pasarelas de pago y servicios externos.",
        "cta": "Conectar mis sistemas",
        "imagen": "core/img/servicios/apis.jpg",
        "problema": (
            "Tus sistemas no se hablan entre sí: cargas los mismos datos en varias plataformas "
            "a mano, o necesitas conectar tu sitio con una pasarela de pagos, un CRM o un "
            "sistema de facturación."
        ),
        "para_quien": (
            "Para empresas que ya tienen sistemas en funcionamiento y necesitan que se "
            "comuniquen entre sí, o que quieren conectar su plataforma con servicios externos."
        ),
        "funcionalidades": [
            "Conexión con pasarelas de pago, CRMs y facturación electrónica",
            "Desarrollo de APIs propias para que otros sistemas consuman tu información",
            "Webhooks y sincronización de datos en tiempo real",
            "Documentación técnica de la integración",
        ],
        "que_necesito": [
            "Acceso o credenciales de los sistemas a integrar (o a quien los administre)",
            "Documentación de las APIs externas, si ya la tienes",
            "Claridad sobre qué datos deben viajar entre cada sistema y con qué frecuencia",
        ],
        "factores_costo": [
            "Número de sistemas a integrar",
            "Si las APIs externas ya existen o hay que construir alguna desde cero",
            "Volumen y frecuencia de los datos que se sincronizan",
        ],
        "faq": [
            {
                "pregunta": "¿Pueden integrar cualquier sistema?",
                "respuesta": "La mayoría de sistemas modernos exponen una API. Si el que usas no tiene una, evaluamos alternativas, como exportación e importación automatizada.",
            },
            {
                "pregunta": "¿Qué pasa si una de las plataformas cambia su API?",
                "respuesta": "Es un riesgo propio de depender de terceros. Si ocurre, se ajusta la integración; las condiciones de ese soporte se acuerdan por escrito.",
            },
            {
                "pregunta": "¿Necesito conocimientos técnicos para pedir esto?",
                "respuesta": "No. Cuéntame qué sistemas usas y qué te gustaría que hicieran juntos, y yo evalúo la mejor forma de conectarlos.",
            },
        ],
    },
]

FAQ = [
    {
        "pregunta": "¿Cuánto cuesta desarrollar una página web?",
        "respuesta": (
            "El precio depende del tipo de sitio, las funcionalidades, el contenido, las "
            "integraciones y el alcance. Después de conocer tus necesidades, te presento una "
            "propuesta con el valor y los entregables definidos."
        ),
    },
    {
        "pregunta": "¿Cuánto tiempo tarda un proyecto?",
        "respuesta": (
            "Depende del alcance: una landing page puede estar lista en una a dos semanas, "
            "mientras un sistema de gestión o un agente de IA conectado a varias plataformas "
            "toma más tiempo. El cronograma queda definido por escrito en la propuesta."
        ),
    },
    {
        "pregunta": "¿Puedo solicitar cambios durante el desarrollo?",
        "respuesta": (
            "Sí. Revisamos los avances juntos durante todo el proceso y ajusto lo que sea "
            "necesario dentro del alcance acordado. Cambios que amplíen ese alcance se cotizan "
            "aparte."
        ),
    },
    {
        "pregunta": "¿El dominio y el alojamiento están incluidos?",
        "respuesta": (
            "No vienen incluidos en el desarrollo, pero te oriento en la elección y "
            "configuración del dominio y el alojamiento, o me encargo de todo el proceso si lo "
            "prefieres."
        ),
    },
    {
        "pregunta": "¿Mi página funcionará en celulares?",
        "respuesta": "Sí, todo lo que desarrollo es responsivo: se adapta a celular, tablet y computador desde el diseño.",
    },
    {
        "pregunta": "¿Ofreces mantenimiento y soporte?",
        "respuesta": (
            "Sí, quedo disponible después de la entrega para soporte, ajustes y mejoras. Las "
            "condiciones de cobertura se acuerdan por escrito junto con la propuesta."
        ),
    },
    {
        "pregunta": "¿Puedo solicitar una funcionalidad que no aparece en la lista?",
        "respuesta": (
            "Sí. Cada proyecto se cotiza según lo que realmente necesitas, así que cuéntame qué "
            "función buscas y evaluamos cómo incluirla en el alcance."
        ),
    },
    {
        "pregunta": "¿Cómo se realizan los pagos?",
        "respuesta": (
            "Normalmente con un anticipo para iniciar el desarrollo y el saldo contra entrega. "
            "Para proyectos más largos se puede acordar un pago por etapas, siempre definido "
            "por escrito antes de empezar."
        ),
    },
]

TESTIMONIOS = [
    {
        "texto": "Llevábamos años con el inventario en cuadernos. El sistema que nos hicieron nos ordenó la bodega en un mes y ahora sé exactamente qué tengo.",
        "avatar": "M",
        "nombre": "María Fernanda Vera",
        "cargo": "Gerente General · Distribuidora Andina",
    },
    {
        "texto": "Lo que más valoro es que me explicaron todo sin tecnicismos y cumplieron la fecha. La página ya me trajo clientes que llegaron buscando en Google.",
        "avatar": "C",
        "nombre": "Carlos Zambrano",
        "cargo": "Propietario · Taller Industrial Zambrano",
    },
    {
        "texto": "El acompañamiento después de la entrega fue lo que marcó la diferencia. Cada vez que hemos necesitado un ajuste, responden el mismo día.",
        "avatar": "A",
        "nombre": "Andrea Loor",
        "cargo": "Coordinadora Administrativa · Grupo Comercial del Litoral",
    },
    {
        "texto": "La app para controlar los despachos nos quitó horas de papeleo cada día. Los turnos cuadran solos y el cierre de caja dejó de ser un dolor de cabeza.",
        "avatar": "R",
        "nombre": "Ricardo Cedeño",
        "cargo": "Administrador · Estación Norte",
    },
    {
        "texto": "Vendía solo por WhatsApp y me perdía pedidos. Con la tienda en línea ahora los clientes compran de madrugada y yo despacho en la mañana.",
        "avatar": "G",
        "nombre": "Gabriela Mendoza",
        "cargo": "Dueña · Boutique Aurora",
    },
    {
        "texto": "Nos hicieron el sistema de avance de obra a la medida, no una plantilla. Se nota que primero entendieron cómo trabajamos y después programaron.",
        "avatar": "L",
        "nombre": "Luis Alberto Párraga",
        "cargo": "Jefe de Operaciones · Constructora Manabí",
    },
    {
        "texto": "Pedí cambios a mitad del proyecto y en vez de cobrarme aparte me explicaron qué convenía y qué no. Terminamos con algo mejor de lo que yo había pedido.",
        "avatar": "P",
        "nombre": "Patricia Solórzano",
        "cargo": "Contadora · Agroservicios del Valle",
    },
    {
        "texto": "Tres presupuestos pedí. Ellos fueron los únicos que me dieron el precio cerrado por escrito desde el principio, y ese fue exactamente el que pagué.",
        "avatar": "J",
        "nombre": "Jorge Intriago",
        "cargo": "Gerente · Ferretería El Constructor",
    },
]

CLIENTES = [
    {"nombre": "Distribuidora Andina", "sector": "Comercio"},
    {"nombre": "Taller Industrial Zambrano", "sector": "Metalmecánica"},
    {"nombre": "Grupo Comercial del Litoral", "sector": "Retail"},
    {"nombre": "Estación Norte", "sector": "Combustibles"},
    {"nombre": "Constructora Manabí", "sector": "Construcción"},
    {"nombre": "Agroservicios del Valle", "sector": "Agroindustria"},
]

SERVICIOS_INTERES = [
    "Desarrollo Web",
    "Software a tu Medida",
    "AI Automatización",
    "Integración con APIs",
    "E-commerce",
]

PRESUPUESTOS = [
    "Aún no lo he definido",
    "Menos de $1 millón COP",
    "$1 a $3 millones COP",
    "$3 a $6 millones COP",
    "Más de $6 millones COP",
]

WHATSAPP_NUMERO = "573506240534"
WHATSAPP_TEXTO = "Hola+sruedadev.com%2C+quiero+informaci%C3%B3n+sobre+sus+servicios+de+desarrollo."
