from django.urls import path
from . import views

app_name = 'web'

urlpatterns = [
    path('', views.index, name='index'),
    path('learning/', views.learning, name='learning'),
    path('learning/testing-django/', views.testing_temario, name='testing_temario'),
    path('learning/testing-django/dia-1/', views.testing_dia1, name='testing_dia1'),
    path('learning/testing-django/dia-2/', views.testing_dia2, name='testing_dia2'),
    path('learning/testing-django/dia-3/', views.testing_dia3, name='testing_dia3'),
    path('robots.txt', views.robots_txt, name='robots'),
    path('sitemap.xml', views.sitemap_xml, name='sitemap'),
]
