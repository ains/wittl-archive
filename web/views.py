import json
from django.views.decorators.csrf import csrf_exempt
import comparator

from collections import defaultdict

from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse_lazy
from django.shortcuts import render, get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from django.http import HttpResponse, HttpResponseServerError
from django.views.generic import CreateView

from models import List, ListItem, ListComparator
from importer import get_importer_for_url


def index(request):
    return render(request, "index.html")


class ListCreateView(CreateView):
    model = List
    template_name = 'list/create.html'
    fields = ['name']
    success_url = reverse_lazy('list_list')

    def form_valid(self, form):
        form.instance.creator = self.request.user
        resp = super(ListCreateView, self).form_valid(form)

        form.instance.users.add(self.request.user)
        form.instance.save()

        return resp


@login_required
def list_list(request):
    user_lists = request.user.list_set.all()
    render_data = {
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
@require_POST
def insert_list_item(request, list_id):
    list = get_object_or_404(List, id=list_id)

    import_url = request.POST["url"]
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

    return HttpResponseServerError()


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
@require_GET
def card_data(request):
    card = ListItem.objects.get(id=request.GET['list_item_id'])
    return HttpResponse(card.attributes)

@login_required
def get_scores(request, list_id):
    list = get_object_or_404(List, id=list_id)
    user_comparators = list.get_comparators_for_user(request.user)

    score_data = defaultdict(dict)
    for item in list.listitem_set.all():
        for comparator in user_comparators:
            score_data[item.id][comparator.comparator_name] = comparator.run(item.decoded_attributes)

    return HttpResponse(json.dumps(score_data))


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