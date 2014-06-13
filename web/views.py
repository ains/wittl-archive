from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.shortcuts import render, redirect
from django.views.decorators.http import require_POST
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib import messages
from django.contrib.auth import authenticate, login

from models import List, ListForm
from wittl.shortcuts import get_list
from forms import UserCreationForm, UserChangePasswordForm

def register(request):
    if request.method == "POST":
        user_form = UserCreationForm(request.POST)
        if user_form.is_valid():
            user_form.save()
            user_data = user_form.cleaned_data
            user = authenticate(username = user_data['username'], 
                                password = user_data['password2'])
            login(request, user)
            return redirect(reverse("list_list"))
    else:
        user_form = UserCreationForm()

    return render(request, "registration/register.html", {
            'form' : user_form,
    })


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
    list = get_list(request.user, id=list_id)
    render_data = {
        "list": list,
        "comparators": list.get_comparators_for_user(request.user)
    }
    return render(request, "list/view.html", render_data)


@login_required
def favourite_list(request):
    return render(request, "list/favourites.html")

@login_required
def account_settings(request):
    if request.method == "POST":
        user_form = UserChangePasswordForm(request.POST)
        if user_form.is_valid():
            request.user.set_password(user_form.cleaned_data["password1"])
            request.user.save()
            messages.success(request, 'Password successfully changed')
            return redirect(reverse("settings"))
    else:
        user_form = UserChangePasswordForm()

    return render(request, "settings.html", {
            'form' : user_form,
    })
