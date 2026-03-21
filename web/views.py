from django.shortcuts import render
from django.http import HttpResponse, Http404
from django.conf import settings
from django.views.decorators.clickjacking import xframe_options_sameorigin


PORTAFOLIO_PAGES = {
    'abogado-corporativo': {
        'title': 'Ramírez & Asociados — Bufete de Abogados',
        'desc': 'Sitio web corporativo para bufete de abogados especializado en derecho empresarial. Diseño elegante con secciones de servicios legales, equipo profesional y formulario de consulta.',
        'category': 'Página Corporativa',
        'icon': 'bi-briefcase',
        'color': '#a5b4fc',
        'template': 'portafolio/abogado-corporativo.html',
    },
    'constructora': {
        'title': 'Altavista Constructora — Proyectos Residenciales',
        'desc': 'Landing page para constructora de proyectos residenciales de lujo. Catálogo de apartamentos y casas con galería visual y llamados a la acción.',
        'category': 'Landing Page',
        'icon': 'bi-buildings',
        'color': '#86efac',
        'template': 'portafolio/constructora.html',
    },
    'consultorio-dental': {
        'title': 'DentalSmile — Consultorio Odontológico',
        'desc': 'Página web para clínica dental con catálogo de servicios, sistema de citas online, testimonios de pacientes y galería de resultados.',
        'category': 'Página Corporativa',
        'icon': 'bi-hospital',
        'color': '#93c5fd',
        'template': 'portafolio/consultorio-dental.html',
    },
    'dev-software-landing': {
        'title': 'DevCraft — Empresa de Desarrollo de Software',
        'desc': 'Sitio web para empresa de tecnología que ofrece desarrollo web, software a medida, bots inteligentes y soluciones cloud AWS.',
        'category': 'Página Corporativa',
        'icon': 'bi-code-slash',
        'color': '#c4b5fd',
        'template': 'portafolio/dev-software-landing.html',
    },
    'gym': {
        'title': 'IronForge Gym — Gimnasio y Centro Fitness',
        'desc': 'Landing page para gimnasio con planes de membresía, horarios de clases, galería de instalaciones y formulario de inscripción.',
        'category': 'Landing Page',
        'icon': 'bi-heart-pulse',
        'color': '#fca5a5',
        'template': 'portafolio/gym_landing_imagenes.html',
    },
    'lumiere-botanica': {
        'title': 'Lumière Botánica — Cosmética Natural',
        'desc': 'E-commerce de sérum facial con ingredientes 100% naturales. Diseño premium con sección de ingredientes, beneficios y llamado a compra.',
        'category': 'E-commerce',
        'icon': 'bi-flower2',
        'color': '#f9a8d4',
        'template': 'portafolio/lumiere_botanica.html',
    },
    'mente-plena-psicologia': {
        'title': 'Mente Plena — Consultorio Psicológico',
        'desc': 'Sitio web para consultorio de psicología con servicios para adultos, niños y familias. Incluye agendamiento de citas presenciales y virtuales.',
        'category': 'Página Corporativa',
        'icon': 'bi-peace',
        'color': '#67e8f9',
        'template': 'portafolio/mente_plena_psicologia.html',
    },
    'seguro': {
        'title': 'Seguros.com — Plataforma de Seguros Digital',
        'desc': 'Landing page moderna para plataforma de seguros digitales con diseño vibrante, cotizador integrado y planes comparativos.',
        'category': 'Landing Page',
        'icon': 'bi-shield-check',
        'color': '#fdba74',
        'template': 'portafolio/seguro.html',
    },
    'spa': {
        'title': 'Bella Spa — Centro de Bienestar y Belleza',
        'desc': 'Página web para spa de lujo con catálogo de tratamientos, galería de ambientes, precios de servicios y reserva de citas.',
        'category': 'Página Corporativa',
        'icon': 'bi-droplet-half',
        'color': '#d8b4fe',
        'template': 'portafolio/Spa.html',
    },
    'structura-constructora': {
        'title': 'Structura — Constructora Comercial e Industrial',
        'desc': 'Sitio corporativo para constructora especializada en proyectos comerciales e industriales de gran escala. Portafolio de obras y servicios de ingeniería.',
        'category': 'Página Corporativa',
        'icon': 'bi-building-gear',
        'color': '#fcd34d',
        'template': 'portafolio/structura_constructora.html',
    },
    'vialidad-automovilistico': {
        'title': 'Vialidad — Centro Automovilístico',
        'desc': 'Página web para escuela de conducción con cursos para carro y moto, tramitación de licencias, horarios y formulario de inscripción.',
        'category': 'Página Corporativa',
        'icon': 'bi-car-front',
        'color': '#5eead4',
        'template': 'portafolio/vialidad_automovilistico.html',
    },
    'colombia-viva-viajes': {
        'title': 'Colombia Viva — Agencia de Viajes Nacionales',
        'desc': 'Sitio web para agencia de turismo nacional con paquetes a Cartagena, San Andrés, Amazonas, Eje Cafetero y Medellín. Reservas online y galería de destinos.',
        'category': 'Página Corporativa',
        'icon': 'bi-airplane',
        'color': '#fbbf24',
        'template': 'portafolio/colombia_viva_viajes.html',
    },
    'brasakfire': {
        'title': 'BrasakFire — Restaurante de Comida Rápida',
        'desc': 'Landing page para restaurante de hamburguesas, alitas y papas fritas. Diseño moderno con menú visual, pedidos online y promociones.',
        'category': 'Landing Page',
        'icon': 'bi-fire',
        'color': '#f97316',
        'template': 'portafolio/landing-brasakfire.html',
    },
    'muvit-mudanzas': {
        'title': 'Muvit — Empresa de Mudanzas y Logística',
        'desc': 'Página web para empresa de mudanzas residenciales, empresariales y fletes en Colombia. Cotizador online y seguimiento de servicios.',
        'category': 'Página Corporativa',
        'icon': 'bi-truck',
        'color': '#60a5fa',
        'template': 'portafolio/muvit_mudanzas.html',
    },
    'patitas-vet': {
        'title': 'Patitas — Clínica Veterinaria Premium',
        'desc': 'Sitio web para clínica veterinaria con servicios médicos, pet shop y peluquería canina y felina. Agendamiento de citas y catálogo de productos.',
        'category': 'Página Corporativa',
        'icon': 'bi-heart-pulse',
        'color': '#c084fc',
        'template': 'portafolio/patitas_vet.html',
    },
    'wanderlust-viajes': {
        'title': 'Wanderlust — Agencia de Viajes y Aventura',
        'desc': 'Página web para agencia de viajes nacionales e internacionales con enfoque en aventura, cultura y naturaleza. Paquetes turísticos y reservas online.',
        'category': 'Página Corporativa',
        'icon': 'bi-globe-americas',
        'color': '#34d399',
        'template': 'portafolio/wanderlust_agencia_viajes.html',
    },
}


def index(request):
    return render(request, 'pages/index.html', {
        'portafolio_pages': PORTAFOLIO_PAGES,
    })


def portafolio_demo(request, slug):
    page = PORTAFOLIO_PAGES.get(slug)
    if not page:
        raise Http404
    return render(request, 'pages/portafolio_demo.html', {
        'page': page,
        'slug': slug,
    })


@xframe_options_sameorigin
def portafolio_raw(request, slug):
    page = PORTAFOLIO_PAGES.get(slug)
    if not page:
        raise Http404
    file_path = settings.BASE_DIR / 'templates' / page['template']
    content = file_path.read_text(encoding='utf-8')
    return HttpResponse(content)


def learning(request):
    return render(request, 'pages/learning.html')


def testing_temario(request):
    return render(request, 'pages/testing_temario.html')


def testing_dia1(request):
    return render(request, 'pages/testing_dia1.html')


def testing_dia2(request):
    return render(request, 'pages/testing_dia2.html')


def testing_dia3(request):
    return render(request, 'pages/testing_dia3.html')


def robots_txt(request):
    file_path = settings.BASE_DIR / 'robots.txt'
    content = file_path.read_text(encoding='utf-8')
    return HttpResponse(content, content_type='text/plain')


def sitemap_xml(request):
    file_path = settings.BASE_DIR / 'sitemap.xml'
    content = file_path.read_text(encoding='utf-8')
    return HttpResponse(content, content_type='application/xml')
