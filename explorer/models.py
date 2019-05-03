from django.db import models
from django.contrib.postgres.fields import ArrayField, JSONField


class Dataset(models.Model):
    name = models.CharField(max_length=25)
    columns = JSONField()
    data = JSONField()

    def __str__(self):
        return self.name


class Geography(models.Model):
    name = models.CharField(max_length=25)
    columns = ArrayField(models.CharField(max_length=20))
    filename = models.FileField(upload_to='')

    def __str__(self):
        return self.name
