import json

from django.http import HttpResponseForbidden
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
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

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'lists', ListViewSet, base_name="lists")
