from django.conf.urls import url, include
from . import views

urlpatterns = [
    url("^$", views.explorer, name="home"),
    url("^docs$", views.api_root, name="docs"),
    url(r"^api/v1/datasets$", views.DatasetsView.as_view(), name="datasets"),
    url(r"^api/v1/datasets/(?P<id>\d+)", views.DatasetView.as_view(), name="dataset"),
]
