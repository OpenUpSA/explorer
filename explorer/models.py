from django.contrib.gis.db import models
from django.contrib.postgres.fields import JSONField

class Dataset(models.Model):
    name = models.CharField(max_length=25)
    columns = JSONField()
    data = JSONField()

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Location(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, related_name="locations")
    coordinates = models.PointField()
    data = JSONField()

    def __str__(self):
        return "%s: %s" % (self.category, self.name)
