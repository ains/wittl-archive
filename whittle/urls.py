import web.views
from django.conf.urls import patterns, include, url
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
                       url(r'^$', 'web.views.index', name='index'),

                       url(r'^list/$', 'web.views.list_list', name='list_list'),
                       url(r'^list/create$', web.views.ListCreateView.as_view(), name='list_create'),
                       url(r'^list/(?P<list_id>[0-9]+)$', 'web.views.list_view', name='list_view'),
                       url(r'^list/(?P<list_id>[0-9]+)/insert_item$', 'web.views.insert_list_item',
                           name='insert_list_item'),
                       url(r'^list/(?P<list_id>[0-9]+)/get_scores', 'web.views.get_scores',
                           name='get_scores'),

                       url(r'^comparator/$', 'web.views.all_comparators', name='all_comparators'),

                       # url(r'^blog/', include('blog.urls')),
                       (r'^accounts/login/$', 'django.contrib.auth.views.login'),

                       url(r'^admin/', include(admin.site.urls)),
)
