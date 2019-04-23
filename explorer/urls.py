from django.conf.urls import url
from . import views

urlpatterns = [
    url('^$', views.explorer, name='home'),
    url(r'^api/v1/datasets$', views.DatasetsView.as_view()),
    url(r'^api/v1/datasets/(?P<did>\d+)', views.DatasetView.as_view()),
    url(r'^api/v1/geography$', views.GeographysView.as_view()),
    url(r'^api/v1/geography/(?P<id>\d+)', views.GeographyView.as_view())
]
# if settings.DEBUG:
#     from django.conf.urls.static import static
#     urlpatterns += static(
#         settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
