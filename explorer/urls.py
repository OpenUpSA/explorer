from django.conf.urls import url
from . import views

urlpatterns = [
    url('^$', views.explorer, name='home'),
    url(r'^api/v1/datasets', views.DatasetView.as_view())
]
