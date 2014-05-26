import json
from django.forms import Form
import comparator

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.template import Template, Context


class User(AbstractUser):
    pass


class List(models.Model):
    name = models.CharField(max_length=256)
    creator = models.ForeignKey(User, related_name="created_lists")
    users = models.ManyToManyField(User)

    def __unicode__(self):
        return "{}/{}".format(self.creator, self.name)

    def get_comparators_for_user(self, user):
        return self.listcomparator_set.filter(user=user).all()


class ListItem(models.Model):
    name = models.CharField(max_length=256)
    card_image = models.CharField(max_length=256)
    list = models.ForeignKey(List)
    #JSON of object attributes
    attributes = models.TextField()

    def __unicode__(self):
        return self.name

    @property
    def decoded_attributes(self):
        return json.loads(self.attributes)


class ListComparator(models.Model):
    user = models.ForeignKey(User)
    list = models.ForeignKey(List)
    order = models.IntegerField()
    comparator_name = models.CharField(max_length="128")

    #JSON for comparator's special fields
    configuration = models.TextField()

    def get_comparator_class(self):
        return comparator.get_comparator_by_name(self.comparator_name)

    @property
    def title(self):
        c = Context(self.decoded_configuration)
        return Template(self.get_comparator_class().TITLE).render(c)

    @property
    def comparator_form(self):
        form = Form()
        form.fields = self.get_comparator_class().EXTRA_FIELDS
        return form

    @property
    def decoded_configuration(self):
        return json.loads(self.configuration)

    def get_configuration_attribute(self, attr):
        return self.decoded_configuration.get(attr)

    def get_primary_field_value(self):
        return self.get_configuration_attribute(self.get_comparator_class().PRIMARY_FIELD)

    def run(self, object):
        return comparator.run_comparator_by_name(self.comparator_name, self.decoded_configuration, object)

    def __unicode__(self):
        return "{}/{}/{}".format(self.user, self.list, self.comparator_name)