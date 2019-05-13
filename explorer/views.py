from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from .models import Dataset, Geography
from .serializer import DatasetSerializer, DatasetsSerializer, GeographySerializer, GeographysSerializer
from django.http import JsonResponse


def explorer(request):
    """
    home page for explorer
    """
    return render(request, 'explorer/explorer.djhtml')


class DatasetView(APIView):
    def get(self, request, did):
        query = get_object_or_404(Dataset, id=did)
        serializer = DatasetSerializer(query)
        return JsonResponse(serializer.data)


class DatasetsView(APIView):
    def get(self, request):
        query = Dataset.objects.filter(approved=True)
        serializer = DatasetsSerializer(query, many=True)
        return JsonResponse(serializer.data, safe=False)


class GeographyView(APIView):
    def get(self, request, id):
        query = get_object_or_404(Geography, id=id)
        serializer = GeographySerializer(query, context={'request': request})
        return JsonResponse(serializer.data)


class GeographysView(APIView):
    def get(self, request):
        query = Geography.objects.all()
        serializer = GeographysSerializer(query, many=True)
        return JsonResponse(serializer.data, safe=False)
