import json

from django.http import HttpResponseForbidden, HttpResponse, HttpResponseServerError
from django.shortcuts import get_object_or_404
from rest_framework.decorators import link
from rest_framework.response import Response
from importer import get_importer_for_url
from web.models import List, ListItem
from rest_framework import viewsets, routers
from rest_framework.serializers import ModelSerializer


class ListItemSerializer(ModelSerializer):
    def transform_attributes(self, obj, value):
        return json.loads(value)

    class Meta:
        model = ListItem


class ListSerializer(ModelSerializer):
    items = ListItemSerializer()

    class Meta:
        model = List
        fields = ('name', 'items')
        depth = 1


class ListViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = request.user.list_set.all()
        serializer = ListSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        list = get_object_or_404(List, pk=pk)
        if list.user_invited(request.user):
            serializer = ListSerializer(list)
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
    def list(self, request):
        queryset = ListItem.objects.filter(list__users=request.user).all()
        serializer = ListItemSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        list_item = get_object_or_404(ListItem, pk=pk)
        if list_item.list.user_invited(request.user):
            serializer = ListItemSerializer(list_item)
            return Response(serializer.data)
        else:
            return HttpResponseForbidden()

    def create(self, request):
        list_id = request.DATA['list_id']
        list = get_object_or_404(List, id=list_id)

        import_url = request.DATA["url"]
        importer = get_importer_for_url(import_url)
        if importer is not None:
            attributes = importer.get_attributes(import_url)

            new_item = ListItem()
            new_item.name = attributes["name"]
            new_item.list = list
            new_item.card_image = attributes["image"]
            new_item.attributes = json.dumps(attributes)
            new_item.save()

            return HttpResponse("ok")
        else:
            return HttpResponseServerError("Unrecognised URL")

    @link()
    def score_data(self, request, pk=None):
        list_item = get_object_or_404(ListItem, pk=pk)
        return Response(list_item.comparator_data(request.user))

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'lists', ListViewSet, base_name="lists")
router.register(r'list-items', ListItemViewSet, base_name="list-items")
