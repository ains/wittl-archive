from django.conf.urls import patterns, include, url
from django.contrib import admin
from api import router, lists_router

admin.autodiscover()

urlpatterns = patterns('',
                       url(r'^$', 'web.views.index', name='index'),

                       url(r'^list/$', 'web.views.list_list', name='list_list'),
                       url(r'^list/create$', 'web.views.list_create', name='list_create'),
                       url(r'^list/(?P<list_id>[0-9]+)$', 'web.views.list_view', name='list_view'),
                       url(r'^list/(?P<list_id>[0-9]+)/update_wittl_order', 'web.views.update_wittl_order',
                           name='update_wittl_order'),

                       url(r'^comparator/$', 'web.views.all_comparators', name='all_comparators'),
                       url(r'^comparator/update$', 'web.views.save_comparator_settings',
                           name='save_comparator_settings'),

                       url(r'^accounts/login/$', 'django.contrib.auth.views.login', name='login'),
                       url(r'^accounts/logout/$', 'django.contrib.auth.views.logout_then_login', name='logout'),

                       url(r'^admin/', include(admin.site.urls)),
                       url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
                       url(r'^api/v1/token-auth/', 'rest_framework.authtoken.views.obtain_auth_token'),
                       url(r'^api/v1/', include(router.urls)),
                       url(r'^api/v1/', include(lists_router.urls)),
                       url(r'^favourites', 'web.views.favourite_list', name='favourites'),
)
