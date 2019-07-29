from rest_framework import serializers
from .models import Dataset


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
