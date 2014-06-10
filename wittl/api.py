import json

from django.http import HttpResponseForbidden, HttpResponseServerError
from django.shortcuts import get_object_or_404

from importer import get_importer_for_url
from comparator import all_comparators
from web.models import List, ListItem, User, ListComparator

from rest_framework.decorators import link, action
from rest_framework.response import Response
from rest_framework import viewsets, routers
from rest_framework.serializers import ModelSerializer, SerializerMethodField

from rest_framework_nested.routers import NestedSimpleRouter


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name')


class ListItemSerializer(ModelSerializer):
    favourited = SerializerMethodField("is_favourited")

    def transform_attributes(self, obj, value):
        decoded_attrs = json.loads(value)
        decoded_attrs["sortable_attrs"] = obj.sortable_attrs
        return decoded_attrs

    def is_favourited(self, obj):
        user = self.context['request'].user
        return user.favourites.filter(pk=obj.pk).exists()

    class Meta:
        model = ListItem
        fields = ('name', 'attributes', 'id', 'card_image', 'favourited')


class ListSerializer(ModelSerializer):
    items = ListItemSerializer()
    users = UserSerializer()

    class Meta:
        model = List
        fields = ('name', 'id', 'users', 'items')
        depth = 1


class ListComparatorSerializer(ModelSerializer):
    def transform_configuration(self, obj, value):
        return json.loads(value)

    class Meta:
        model = ListComparator
        fields = ('comparator_name', 'id', 'order', 'configuration', 'list')


class ListViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = request.user.list_set.all()
        serializer = ListSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        list = get_object_or_404(List, pk=pk)
        if list.user_invited(request.user):
            serializer = ListSerializer(list, context={'request': request})
            return Response(serializer.data)
        else:
            return HttpResponseForbidden()

    @link()
    def score_data(self, request, pk=None):
        list = get_object_or_404(List, pk=pk)

        score_data = {}
        for item in list.items.all():
            score_data[item.id] = item.comparator_data(request.user)
        return Response(score_data)


class ListItemViewSet(viewsets.ViewSet):
    def list(self, request, list_pk=None):
        queryset = get_object_or_404(List, pk=list_pk).items.all()
        serializer = ListItemSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def retrieve(self, request, pk=None, list_pk=None):
        list_item = get_object_or_404(ListItem, pk=pk)
        if list_item.list.user_invited(request.user):
            serializer = ListItemSerializer(list_item, context={'request': request})
            return Response(serializer.data)
        else:
            return HttpResponseForbidden()

    def create(self, request, list_pk=None):
        list = get_object_or_404(List, id=list_pk)

        import_url = request.DATA["url"]
        importer = get_importer_for_url(import_url)
        if importer is not None:
            attributes = importer.get_attributes(import_url)

            new_item = ListItem()
            new_item.name = attributes["name"]
            new_item.subtitle = attributes["subtitle"]
            new_item.list = list
            new_item.card_image = attributes["image"]
            new_item.attributes = json.dumps(attributes)
            new_item.source = importer.NAME
            new_item.save()

            serializer = ListItemSerializer(new_item, context={'request': request})
            return Response(serializer.data)
        else:
            return HttpResponseServerError("Unrecognised URL")

    @action()
    def toggle_favourite(self, request, pk=None, list_pk=None):
        list_item = get_object_or_404(ListItem, pk=pk)
        user = request.user
        if user.favourites.filter(pk=pk).exists():
            user.favourites.remove(list_item)
        else:
            user.favourites.add(list_item)
        serializer = ListItemSerializer(user.favourites.all(), many=True, context={'request': request})
        return Response(serializer.data)

    @link()
    def score_data(self, request, pk=None, list_pk=None):
        list_item = get_object_or_404(ListItem, pk=pk)
        return Response(list_item.comparator_data(request.user))


class ListComparatorViewset(viewsets.ViewSet):
    def list(self, request, list_pk=None):
        list = get_object_or_404(List, pk=list_pk)
        comparators = list.get_comparators_for_user(request.user)
        serializer = ListComparatorSerializer(comparators, many=True, context={'request': request})
        return Response(serializer.data)

    def update(self, request, pk=None, list_pk=None):
        comparator = get_object_or_404(ListComparator, pk=list_pk)
        comparator.order = request.DATA["id"]
        comparator.configuration = json.dumps(request.DATA["configuration"])
        comparator.save()

        serializer = ListComparatorSerializer(comparator, context={'request': request})
        return Response(serializer.data)


class ComparatorViewSet(viewsets.ViewSet):
    def list(self, request):
        response_data = [comparator().data for comparator_name, comparator in all_comparators.items()]
        return Response(response_data)

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'lists', ListViewSet, base_name="list")
router.register(r'wittls', ComparatorViewSet, base_name="comparator")

lists_router = NestedSimpleRouter(router, r'lists', lookup='list')
lists_router.register(r'items', ListItemViewSet, base_name='listitem')
lists_router.register(r'wittls', ListComparatorViewset, base_name='listwittl')