from django.conf.urls import url
from . import views

urlpatterns = [
    url("^$", views.explorer, name="home"),
    url("^docs$", views.api_root, name="docs"),
    url(r"^api/v1/datasets$", views.DatasetsView.as_view(), name="datasets"),
    url(r"^api/v1/datasets/(?P<id>\d+)", views.DatasetView.as_view(), name="dataset"),
    url(r"^api/v1/categories$", views.CategoriesView.as_view(), name="categories"),
    url(r"^api/v1/categories/(?P<id>\d+)$", views.CategoryView.as_view(), name="category"),
    #url(r"^api/v1/locations/(?P<id>\d+)$", views.LocationsView.as_view(), name="locations"),
]
