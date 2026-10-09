from django.urls import path

from . import views

app_name = "core"

urlpatterns = [
    path("", views.home, name="home"),
    path("contacto", views.contacto, name="contacto"),
    path("portafolio/<slug:slug>/", views.portafolio_detalle, name="portafolio_detalle"),
    path("servicios/<slug:slug>/", views.servicio_detalle, name="servicio_detalle"),
    path("robots.txt", views.robots_txt, name="robots_txt"),
    path("sitemap.xml", views.sitemap_xml, name="sitemap_xml"),
]
