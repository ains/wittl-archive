from web.models import List, ListItem, ListComparator

from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied


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