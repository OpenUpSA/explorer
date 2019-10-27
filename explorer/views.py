from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .models import Dataset, Location, Category
from .serializer import DatasetSerializer, DatasetsSerializer, CategorySerializer, CategoriesSerializer, LocationsSerializer, LocationSerializer
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.reverse import reverse


def explorer(request):
    """
    home page for explorer
    """
    return render(request, "explorer/explorer.djhtml")


@api_view(["GET"])
def api_root(request, format=None):
    return Response(
        {"Datasets": reverse("explorer:datasets", request=request, format=format)}
    )


class DatasetView(APIView):
    """
    Get a particular dataset.
    """

    def get(self, request, id):
        query = get_object_or_404(Dataset, id=id)
        serializer = DatasetSerializer(query)
        return JsonResponse(serializer.data)

class DatasetsView(APIView):
    """
    Get all the avaliable datasets.
    """

    def get(self, request):
        query = Dataset.objects.all()
        serializer = DatasetsSerializer(query, many=True, context={"request": request})
        return JsonResponse(serializer.data, safe=False)

class CategoryView(APIView):
    def get(self, request, id):
        query = get_object_or_404(Category, id=id)
        serializer = CategorySerializer(query)
        return JsonResponse(serializer.data)

class CategoriesView(APIView):
    def get(self, request):
        query = Category.objects.all()
        serializer = CategoriesSerializer(query, many=True, context={"request": request})
        return JsonResponse(serializer.data, safe=False)
