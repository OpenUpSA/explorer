from rest_framework import serializers
from .models import Dataset


class DatasetsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = ('id', 'name')


class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = ('columns', 'data')
