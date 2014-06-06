class BaseComparator():
    NAME = ""
    TITLE = ""
    DESCRIPTION = ""
    REQUIRED_ATTRIBUTES = set()

    DISPLAY_NAME = ""
    PREPOSITION = ""
    FIELDS = []

    def __init__(self):
        pass

    def score(self, **kwargs):
        pass

    @property
    def data(self):
        return {
            "title": self.TITLE,
            "description": self.DESCRIPTION,
            "display_name": self.DISPLAY_NAME,
            "preposition": self.PREPOSITION,
            "fields": self.FIELDS
        }