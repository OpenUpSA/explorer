from django.contrib.gis.geos import Point

from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer, GeometrySerializerMethodField
from .models import Dataset, Location, Category


class DatasetsSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name="explorer:dataset", lookup_field="id"
    )

    class Meta:
        model = Dataset
        fields = ("id", "name", "url")


class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = ("columns", "data")

class CategoriesSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name="explorer:category", lookup_field="id")

    class Meta:
        model = Category
        fields = ('id', 'name', 'url')

class LocationSerializer(GeoFeatureModelSerializer):
    """ A class to serialize locations as GeoJSON compatible data """

    # a field which contains a geometry value and can be used as geo_field
    coordinates = GeometrySerializerMethodField()

    def get_coordinates(self, obj):
        return obj.coordinates

    class Meta:
        model = Location
        geo_field = 'coordinates'
        fields = "__all__"

class LocationsSerializer(serializers.Serializer):
    locations = LocationSerializer(many=True)

    class Meta:
        fields = ('locations', )


class CategorySerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    locations = LocationSerializer(many=True)

    class Meta:
        fields = ("name", 'locations')

