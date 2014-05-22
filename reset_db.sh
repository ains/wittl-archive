rm db.sqlite3
(export DEVELOPMENT=1; python manage.py syncdb --noinput)
(export DEVELOPMENT=1; python manage.py update_admin_user --username=admin --password=development)