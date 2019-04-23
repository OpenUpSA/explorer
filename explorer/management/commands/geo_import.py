import json
from django.core.files import File
from django.core.management.base import BaseCommand, CommandError
from explorer.models import Geographic


class Command(BaseCommand):
    help = 'Import csv files into the dataset model'

    def add_arguments(self, parser):
        parser.add_argument('geojson_file')
        parser.add_argument('name')

    def handle(self, *args, **kwargs):
        if kwargs['geojson_file'] is None:
            raise
        else:
            with open(kwargs['geojson_file'], 'r') as geo_file:
                geojson = json.load(geo_file)
                properties = list(geojson['features'][0]['properties'].keys())
                f = File(geo_file)
                Geographic.objects.create(
                    name=kwargs['name'], columns=properties, filename=f)
