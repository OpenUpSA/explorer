====
Explorer 0.1
====

Explorer is a simple Django app to view points on the map.

This project is still in its early stages(0.1) so there will be bugs


Goals of the app
-----------------
1. Add Datasets as map layers.
2. Points can be filtered according to column values.
3. Tooltips can be configured to show less or more information about a point.


Quick start
--------------

1. Add "explorer" to your INSTALLED_APPS
   
   INSTALLED_APPS = [
       ...
       'explorer',
   ]
2. Include the explorer URLconf to the projects urls.py

   url(r'^explorer/', include('explorer.urls'))

3. Run `python manage.py migrate` to create the explorer models.

4. Make sure the admin app is enabled (This will be used to upload the csv files)
