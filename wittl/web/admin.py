from django.contrib import admin
from models import User, List, ListItem, ListComparator, ListComment

admin.site.register(User)
admin.site.register(List)
admin.site.register(ListItem)
admin.site.register(ListComparator)
admin.site.register(ListComment)