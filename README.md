wittl
=====

Getting started on development
---------------

Grab or create a keys.py file with the valid API keys.

Install the requirements:
```
pip install -r requirements.txt

NodeJS is required to build Handlebars and SASS templates.
Install node/grunt dependencies using:
```
npm install
```

To do a single compilation of resources:
```
grunt
```

To continuously watch and build (when modifying sass or handlebars use:
```
grunt watch
```

Reset the development database:
```
./reset_db.sh
```

Run the development server:
```
python manage.py runserver
```
