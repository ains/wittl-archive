import json
from django.db import models
from django.contrib.auth.models import AbstractUser
from comparator import run_comparator


class User(AbstractUser):
    pass


class List(models.Model):
    name = models.CharField(max_length=256)
    creator = models.ForeignKey(User)

    def __unicode__(self):
        return "{}/{}".format(self.creator, self.name)


class ListItem(models.Model):
    name = models.CharField(max_length=256)
    card_image = models.CharField(max_length=256)
    list = models.ForeignKey(List)
    #JSON of object attributes
    attributes = models.TextField()

    def __unicode__(self):
        return self.name

    def price_test(self):
        return run_comparator("travel prices from london", json.loads(self.attributes))