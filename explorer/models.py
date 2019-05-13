from django.db import models
from django.contrib.postgres.fields import ArrayField, JSONField
from django.contrib.auth.models import User


class Dataset(models.Model):
    name = models.CharField(max_length=25)
    columns = JSONField()
    data = JSONField()
    version = models.IntegerField(default=2018)
    source = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    approved = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Geography(models.Model):
    name = models.CharField(max_length=25)
    columns = ArrayField(models.CharField(max_length=20))
    filename = models.FileField(upload_to='')
    version = models.IntegerField(default=2018)
    source = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    approved = models.BooleanField(default=False)

    def __str__(self):
        return self.name
