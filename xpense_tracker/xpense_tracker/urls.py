from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from expenses.views import *

urlpatterns = [
    path('', login_page, name='login_page'),
    path('expenses/', include('expenses.urls')),  
    path('admin/', admin.site.urls),
    path('register_page/', register_page, name='register_page'), 
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
