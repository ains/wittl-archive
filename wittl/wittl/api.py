import json
import itertools
import importer

from django.http import HttpResponseForbidden, HttpResponseServerError

from importer import get_importer_for_url
from comparator import all_comparators
from web.models import List, ListItem, User, ListComparator, ListComment
from shortcuts import get_list, get_list_comparator, get_list_item, notify_list

from rest_framework.decorators import link, action
from rest_framework.response import Response
from rest_framework import viewsets, routers
from rest_framework.serializers import ModelSerializer, SerializerMethodField, Field
from rest_framework.permissions import AllowAny
from rest_framework_nested.routers import NestedSimpleRouter
from rest_framework.authentication import SessionAuthentication
from rest_framework.authtoken.views import ObtainAuthToken


class UnsafeSessionAuthentication(SessionAuthentication):
    def authenticate(self, request):
        http_request = request._request
        user = getattr(http_request, 'user', None)

        if not user or not user.is_active:
            return None

        return user, None


class TokenAuth(ObtainAuthToken):
    permission_classes = (AllowAny,)
    authentication_classes = (UnsafeSessionAuthentication,)


obtain_auth_token = TokenAuth.as_view()


class UserSerializer(ModelSerializer):
    gravatar_url = Field("gravatar_url")

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'gravatar_url')


class ListCommentSerializer(ModelSerializer):
    author = UserSerializer()

    def transform_added(self, obj, value):
        return value.strftime("%H:%M")

    class Meta:
        model = ListComment


class ListItemSerializer(ModelSerializer):
    favourited = SerializerMethodField("is_favourited")

    def transform_attributes(self, obj, value):
        decoded_attrs = json.loads(value)
        decoded_attrs["sortable_attrs"] = obj.sortable_attrs
        return decoded_attrs

    def is_favourited(self, obj):
        user = self.context['request'].user
        if not user.is_authenticated():
            return False
        return user.favourites.filter(pk=obj.pk).exists()

    class Meta:
        model = ListItem
        fields = ('name', 'attributes', 'id', 'card_image', 'favourited', 'list', "url")


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
    permission_classes = (AllowAny,)

    def list(self, request):
        queryset = request.user.list_set.all()
        serializer = ListSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        list = get_list(request.user, pk=pk)
        serializer = ListSerializer(list, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, pk=None):
        list = get_list(request.user, pk=pk)
        list.delete()

        return Response("ok")

    @link()
    def score_data(self, request, pk=None):
        list = get_list(request.user, pk=pk)

        score_data = {}
        for item in list.items.all():
            score_data[item.id] = item.comparator_data(request.user)
        return Response(score_data)


class ListItemViewSet(viewsets.ViewSet):
    permission_classes = (AllowAny,)

    def list(self, request, list_pk=None):
        queryset = get_list(request.user, pk=list_pk).items.all()
        serializer = ListItemSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def retrieve(self, request, pk=None, list_pk=None):
        list_item = get_list_item(request.user, pk=pk)
        if list_item.list.user_invited(request.user):
            serializer = ListItemSerializer(list_item, context={'request': request})
            return Response(serializer.data)
        else:
            return HttpResponseForbidden()

    def create(self, request, list_pk=None):
        list = get_list(request.user, id=list_pk)

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
            new_item.url = import_url
            new_item.save()

            serializer = ListItemSerializer(new_item, context={'request': request})
            notify_list(list.id, "added", serializer.data)
            return Response(serializer.data)
        else:
            return HttpResponseServerError("Unrecognised URL")

    def delete(self, request, pk=None, list_pk=None):
        list_item = get_list_item(request.user, pk=pk)
        list_item.delete()

        notify_list(list_pk, "removed", {"item_id": pk})
        return Response("ok")

    @action()
    def toggle_favourite(self, request, pk=None, list_pk=None):
        list_item = get_list_item(request.user, pk=pk)
        user = request.user
        if user.favourites.filter(pk=pk).exists():
            user.favourites.remove(list_item)
        else:
            user.favourites.add(list_item)
        serializer = ListItemSerializer(user.favourites.all(), many=True, context={'request': request})
        return Response(serializer.data)

    @link()
    def score_data(self, request, pk=None, list_pk=None):
        list_item = get_list_item(request.user, pk=pk)
        return Response(list_item.comparator_data(request.user))


class FavouritesViewSet(viewsets.ViewSet):
    def list(self, request, list_pk=None):
        queryset = request.user.favourites.all()
        serializer = ListItemSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)


class ListComparatorViewset(viewsets.ViewSet):
    def list(self, request, list_pk=None):
        list = get_list(request.user, pk=list_pk)
        comparators = list.get_comparators_for_user(request.user)
        serializer = ListComparatorSerializer(comparators, many=True, context={'request': request})
        return Response(serializer.data)

    def update(self, request, pk=None, list_pk=None):
        comparator = get_list_comparator(request.user, pk=pk)
        comparator.comparator_name = request.DATA["comparator_name"]
        comparator.order = request.DATA["order"]
        comparator.configuration = json.dumps(request.DATA["configuration"])
        comparator.save()

        serializer = ListComparatorSerializer(comparator, context={'request': request})
        return Response(serializer.data)

    def create(self, request, list_pk=None):
        list = get_list(request.user, pk=list_pk)

        comparator = ListComparator()
        comparator.user = request.user
        comparator.list = list
        comparator.comparator_name = request.DATA["comparator_name"]
        comparator.configuration = json.dumps(request.DATA["configuration"])
        comparator.order = 10
        comparator.save()

        serializer = ListComparatorSerializer(comparator, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, pk=None, list_pk=None):
        comparator = get_list_comparator(request.user, pk=pk)
        comparator.delete()
        return Response("ok")


class ComparatorViewSet(viewsets.ViewSet):
    def list(self, request):
        response_data = {comparator_name: comparator().data
                         for comparator_name, comparator in all_comparators.items()}
        return Response(response_data)


class ValidUrlPatternViewSet(viewsets.ViewSet):
    permission_classes = (AllowAny,)

    def list(self, request):
        all_patterns = [imp.URL_PATTERNS for imp in importer.LOADED_IMPORTERS]

        return Response(itertools.chain.from_iterable(all_patterns))


class UserViewSet(viewsets.ViewSet):
    def list(self, request):
        query = request.QUERY_PARAMS["query"]
        queryset = User.objects.filter(username__startswith=query).all()
        serializer = UserSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)


class ListUserViewSet(viewsets.ViewSet):
    def list(self, request, list_pk=None):
        list = get_list(request.user, pk=list_pk)
        queryset = list.users.all()
        serializer = UserSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def create(self, request, list_pk=None):
        list = get_list(request.user, pk=list_pk)
        user_pk = request.DATA["user_id"]
        user = User.objects.get(pk=user_pk)
        list.users.add(user)

        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, pk=None, list_pk=None):
        user = User.objects.get(pk=pk)
        list = get_list(request.user, pk=list_pk)
        list.users.remove(user)

        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data)


class ListCommentViewSet(viewsets.ViewSet):
    def list(self, request, list_pk=None):
        list = get_list(request.user, pk=list_pk)
        queryset = list.listcomment_set.all()
        serializer = ListCommentSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def create(self, request, list_pk=None):
        list = get_list(request.user, pk=list_pk)
        comment = ListComment()
        comment.author = request.user
        comment.list = list
        comment.body = request.DATA["body"]
        comment.save()

        serializer = ListCommentSerializer(comment, context={'request': request})
        notify_list(list.id, "newComment", serializer.data)
        return Response(serializer.data)

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'lists', ListViewSet, base_name="list")
router.register(r'user-search', UserViewSet, base_name="usersearch")
router.register(r'wittls', ComparatorViewSet, base_name="comparator")
router.register(r'favourites', FavouritesViewSet, base_name="favourites")
router.register(r'valid-urls', ValidUrlPatternViewSet, base_name="validurls")

lists_router = NestedSimpleRouter(router, r'lists', lookup='list')
lists_router.register(r'items', ListItemViewSet, base_name='listitem')
lists_router.register(r'wittls', ListComparatorViewset, base_name='listwittl')
lists_router.register(r'users', ListUserViewSet, base_name='listusers')
lists_router.register(r'comments', ListCommentViewSet, base_name='comments')