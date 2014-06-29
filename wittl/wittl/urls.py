from django.conf.urls import patterns, include, url
from django.contrib import admin
from api import router, lists_router
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

admin.autodiscover()

urlpatterns = patterns('',
                       url(r'^$', 'web.views.index', name='index'),

                       url(r'^list/$', 'web.views.list_list', name='list_list'),
                       url(r'^list/create$', 'web.views.list_create', name='list_create'),
                       url(r'^list/(?P<list_id>[0-9]+)$', 'web.views.list_view', name='list_view'),

                       url(r'^accounts/login/$', 'web.views.login', name='login'),
                       url(r'^accounts/logout/$', 'django.contrib.auth.views.logout_then_login', name='logout'),
                       url(r'^accounts/settings/$', 'web.views.account_settings', name='settings'),
                       url(r'^accounts/register/$', 'web.views.register', name="register"),

                       url(r'^admin/', include(admin.site.urls)),
                       url(r'^api/v1/token-auth/', 'wittl.api.obtain_auth_token'),
                       url(r'^api/v1/', include(router.urls)),
                       url(r'^api/v1/', include(lists_router.urls)),
                       url(r'^favourites', 'web.views.favourite_list', name='favourites'),
)


urlpatterns += staticfiles_urlpatterns()