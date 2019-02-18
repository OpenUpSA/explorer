import pandas
import geojson

from django.core.management.base import BaseCommand, CommandError
from explorer.models import Dataset


class Command(BaseCommand):
    help = 'Import csv files into the dataset model'

    def add_arguments(self, parser):
        parser.add_argument('csv_file')
        parser.add_argument('name')

    def handle(self, *args, **kwargs):
        if kwargs['csv_file'] is None:
            raise
        else:
            feature_collection = []
            frame = pandas.read_csv(kwargs['csv_file'])
            frame = frame.fillna('')
            columns = {}
            for column in frame:
                if column not in ['Latitude', 'Longitude']:
                    columns[column] = list(frame[column].unique())
            for index, series in frame.iterrows():
                properties = {}
                for k, v in series.items():
                    if k == 'Longitude':
                        longitude = v
                    elif k == 'Latitude':
                        latitude = v
                    else:
                        properties[k] = v
                point = geojson.Point((longitude, latitude))
                feature = geojson.Feature(
                    geometry=point, properties=properties)
                feature_collection.append(feature)
            Dataset.objects.create(
                name=kwargs['name'],
                columns=columns,
                data=geojson.FeatureCollection(feature_collection))
