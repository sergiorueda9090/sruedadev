from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings


def index(request):
    return render(request, 'pages/index.html')


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
