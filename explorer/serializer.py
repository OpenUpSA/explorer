from rest_framework import serializers
from .models import Dataset, Geography


class DatasetsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = ('id', 'name')


class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = ('columns', 'data')


class GeographySerializer(serializers.ModelSerializer):
    filename_url = serializers.SerializerMethodField()

    def get_filename_url(self, obj):
        return self.context['request'].build_absolute_uri(obj.filename.url)

    class Meta:
        model = Geography
        fields = ('id', 'name', 'columns', 'filename_url')


class GeographysSerializer(serializers.ModelSerializer):
    class Meta:
        model = Geography
        fields = ('id', 'name')
