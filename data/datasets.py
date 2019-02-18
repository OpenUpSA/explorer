import pandas
import geojson
import json
import os

all_datasets = []

for csv in os.listdir('.'):
    print('Working on {}'.format(csv))
    if csv[-3:] == 'csv':
        feature_collection = []
        df = pandas.read_csv(csv)
        df = df.fillna('')
        columns = {}
        for col in df:
            if col not in ['Latitude', 'Longitude']:
                columns[col] = list(df[col].unique())

                dataset = {'name': csv[:-4], 'columns': columns}

        for index, series in df.iterrows():
            properties = {}
            for k, v in series.items():
                if k == 'Longitude':
                    longitude = v
                elif k == 'Latitude':
                    latitude = v
                else:
                    properties[k] = v
            feature = geojson.Point(
                (latitude, longitude), properties=properties)
            feature_collection.append(feature)

        dataset['geojson'] = geojson.FeatureCollection(feature_collection)
        all_datasets.append(dataset)
    else:
        pass

complete_set = {'datasets': all_datasets}

with open('collection.json', 'w') as json_file:
    json.dump(complete_set, json_file)
