import pandas
import geojson
from .models import Dataset
import traceback


def import_csv(dataset_name, csv_file, version, user):
    """
    Import the csv data to json fields
    """
    feature_collection = []
    try:
        frame = pandas.read_csv(csv_file)
        frame = frame.fillna('')
        columns = {}
        if 'Latitude' not in list(frame.columns) or 'Longitude' not in list(
                frame.columns):
            raise Exception("Latitude/Longitude column not found in csv")
        if 'Name' not in list(frame.columns):
            raise Exception("Name column not found")
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
            feature = geojson.Feature(geometry=point, properties=properties)
            feature_collection.append(feature)
        Dataset.objects.create(
            version=version,
            source=user,
            name=dataset_name,
            columns=columns,
            data=geojson.FeatureCollection(feature_collection))
    except Exception:
        traceback.print_exc()
        raise
