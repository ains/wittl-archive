from comparator.base import BaseComparator
from partner_api.factual_api import FactualAPI


class NearbyComparator(BaseComparator):
    NAME = 'nearby'
    REQUIRED_ATTRIBUTES = ("latitude", "longitude")
    TRIGGERS = [r"distance from (?P<destination_location>.*)"]
    TITLE = "Number of {{x}} nearby"

    def score(self, latitude, longitude, radius, search_parameter):
        f = FactualAPI()
        data = f.get_nearby(latitude, longitude, radius, search_parameter)
        return data.total_row_count()