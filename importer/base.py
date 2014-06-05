class BaseImporter():
    NAME = "base"
    URL_PATTERNS = set()
    SORTABLE_ATTRS = {}

    def __init__(self):
        pass

    def get_attributes(self, url):
        raise NotImplementedError()