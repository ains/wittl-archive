import json
from django.views.decorators.csrf import csrf_exempt
import comparator

from collections import defaultdict

from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.shortcuts import render, get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from django.http import HttpResponse, HttpResponseServerError, HttpResponseRedirect, HttpResponseForbidden

from models import List, ListItem, ListComparator, ListForm
from importer import get_importer_for_url


def index(request):
    return render(request, "index.html")


@require_POST
def list_create(request):
    form = ListForm(request.POST)
    if form.is_valid():
        form.instance.creator = request.user
        form.instance.save()
        form.instance.users.add(request.user)
        form.instance.save()

        success_url = reverse('list_view', args=(form.instance.id,))
        return HttpResponseRedirect(success_url)
    else:
        return HttpResponse(reverse('list_list'))


@login_required
def list_list(request):
    user_lists = request.user.list_set.all()
    render_data = {
        "create_form": ListForm(),
        "lists": user_lists
    }
    return render(request, "list/list.html", render_data)


@login_required
def list_view(request, list_id):
    list = get_object_or_404(List, id=list_id)
    render_data = {
        "list": list,
        "comparators": list.get_comparators_for_user(request.user)
    }
    return render(request, "list/view.html", render_data)

@login_required
def all_comparators(request):
    def get_comparator_data(comparator_class):
        return {
            'name': comparator_class.NAME,
            'required_attributes': comparator_class.REQUIRED_ATTRIBUTES
        }

    comparator_json = json.dumps(map(get_comparator_data, comparator.all_comparators.values()))
    return HttpResponse(comparator_json)


@login_required
@csrf_exempt
@require_POST
def save_comparator_settings(request):
    comparator_id = request.POST['comparator_id']
    new_configuration = request.POST['configuration']
    comparator = get_object_or_404(ListComparator, id=comparator_id)
    comparator.configuration = new_configuration
    comparator.save()

    return HttpResponse("ok")


@login_required
@csrf_exempt
@require_POST
def update_wittl_order(request, list_id):
    list = get_object_or_404(List, id=list_id)
    if list.user_invited(request.user):
        wittl_ids = request.POST.getlist("wittl_ids[]")
        for i, id in enumerate(wittl_ids):
            wittl = ListComparator.objects.get(pk=int(id))
            wittl.order = i
            wittl.save()

        return HttpResponse("ok")

    return HttpResponseForbidden()