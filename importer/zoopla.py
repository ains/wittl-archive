from importer.base import BaseImporter


class ZooplaImporter(BaseImporter):
    NAME = "zoopla"
    URL_PATTERNS = set()

    def get_attributes(self, url):
        raise NotImplementedError()