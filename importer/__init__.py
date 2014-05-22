import re
from airbnb import AirbnbImporter

LOADED_IMPORTERS = [AirbnbImporter]

importer_patterns = []
for importer in LOADED_IMPORTERS:
    importer_patterns.append((importer, map(re.compile, importer.URL_PATTERNS)))


def get_importer_for_url(url):
    for (importer, pattern_list) in importer_patterns:
        if any(re.match(pattern, url) for pattern in pattern_list):
            return importer()

    return None