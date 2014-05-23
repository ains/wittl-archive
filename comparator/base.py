class BaseComparator():
    NAME = ""
    TITLE = ""
    REQUIRED_ATTRIBUTES = []
    TRIGGERS = []

    def __init__(self):
        pass

    def score(self, **kwargs):
        pass
