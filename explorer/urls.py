from django.conf.urls import url
from . import views

urlpatterns = [
    url('^$', views.explorer, name='home'),
    url(r'^api/v1/datasets$', views.DatasetsView.as_view()),
    url(r'^api/v1/datasets/(?P<did>\d+)', views.DatasetView.as_view())
]
