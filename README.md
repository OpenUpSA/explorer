
Explorer 0.1
=============

Explorer is a simple Django app to view points on the map.

This project is still in its early stages(0.1) so there will be bugs


Goals of the app
-----------------
1. Add Datasets as geojson map layers.
2. Points can be filtered according to column values.
3. Tooltips can be configured to show less or more information about a point.


Install
--------------

1. Add ```explorer``` to your INSTALLED_APPS
   
   ```INSTALLED_APPS = [
       ...
       'explorer',
   ]```
   
2. Include the explorer URLconf to the projects urls.py

   ```url(r'^explorer/', include('explorer.urls'))```

3. Run ```python manage.py migrate``` to create the explorer models.

4. Make sure the admin app is enabled (This will be used to upload the csv files)

Quick Start
------------------
Datasets can be imported via 2 methods

1. ```./manage.py csv_import <csv file> <dataset name>```

2. Uploaded from the admin menu, under the explorer app.



Layers
-------
![Layers](screenshots/Layers.png)


Filters
---------
![Filters](screenshots/Filtering.png)

Tooltips
----------
![Tooltips](screenshots/tooltips.png)


