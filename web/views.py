import json

from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse_lazy
from django.shortcuts import render, get_object_or_404
from django.views.decorators.http import require_POST
from django.http import HttpResponse, HttpResponseServerError
from django.views.generic import CreateView

from models import List, ListItem
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
        return super(ListCreateView, self).form_valid(form)


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
        "list": list
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
