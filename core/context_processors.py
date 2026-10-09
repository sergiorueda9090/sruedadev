from . import data


def site_globals(request):
    """Datos usados en partials compartidos por todas las páginas (navbar, footer, flotantes)."""
    return {
        "servicios": data.SERVICIOS,
        "whatsapp_numero": data.WHATSAPP_NUMERO,
        "whatsapp_texto": data.WHATSAPP_TEXTO,
    }
