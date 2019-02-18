from django.shortcuts import render
from rest_framework.views import APIView
from .models import Dataset
from .serializer import DatasetSerializer
from django.http import JsonResponse


def explorer(request):
    """
    home page for explorer
    """
    return render(request, 'explorer/explorer.djhtml')


class DatasetView(APIView):
    def get(self, request):
        query = Dataset.objects.all()
        serializer = DatasetSerializer(query, many=True)
        return JsonResponse(serializer.data, safe=False)
