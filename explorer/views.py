from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from .models import Dataset
from .serializer import DatasetSerializer, DatasetsSerializer
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
        query = Dataset.objects.all()
        serializer = DatasetsSerializer(query, many=True)
        return JsonResponse(serializer.data, safe=False)
