import pusher

from web.models import List, ListItem, ListComparator

from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied
from django.conf import settings


def get_list(user, *args, **kwargs):
    list_obj = get_object_or_404(List, *args, **kwargs)
    if list_obj.user_invited(user):
        return list_obj
    else:
        raise PermissionDenied()


def get_list_item(user, *args, **kwargs):
    list_item = get_object_or_404(ListItem, *args, **kwargs)
    if list_item.list.user_invited(user):
        return list_item
    else:
        raise PermissionDenied()


def get_list_comparator(user, *args, **kwargs):
    list_comparator = get_object_or_404(ListComparator, *args, **kwargs)
    if list_comparator.list.user_invited(user):
        return list_comparator
    else:
        raise PermissionDenied()


def notify_list(list_id, event, message):
    p = pusher.Pusher(
        app_id=settings.PUSHER_APP_ID,
        key=settings.PUSHER_KEY,
        secret=settings.PUSHER_SECRET
    )
    channel_name = "list-{}".format(list_id)
    p[channel_name].trigger(event, message)