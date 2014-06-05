import re
from airbnb import AirbnbImporter
from zoopla import ZooplaImporter

LOADED_IMPORTERS = [AirbnbImporter, ZooplaImporter]
IMPORTER_DICT = {importer.NAME: importer for importer in LOADED_IMPORTERS}


def get_importer_for_url(url):
    for importer in LOADED_IMPORTERS:
        if any(re.match(pattern, url) for pattern in importer.URL_PATTERNS):
            return importer()

    return None


def get_importer_by_name(name):
    return IMPORTER_DICT.get(name)
