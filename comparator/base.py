class BaseComparator():
    NAME = ""
    TITLE = ""
    DESCRIPTION = ""
    PRIMARY_FIELD = None

    REQUIRED_ATTRIBUTES = set()
    TRIGGERS = []
    EXTRA_FIELDS = {}

    def __init__(self):
        pass

    def score(self, **kwargs):
        raise NotImplementedError()