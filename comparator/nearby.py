from comparator.base import BaseComparator
from partner_api.factual_api import FactualAPI


class NearbyComparator(BaseComparator):
    NAME = "nearby"
    TITLE = "Nearby"
    PRIMARY_FIELD = "poi_name"
    DESCRIPTION = "Compare items by the number of places nearby."

    REQUIRED_ATTRIBUTES = ("latitude", "longitude")
    TRIGGERS = [r"number of (?P<poi_name>.*) nearby"]

    def score(self, latitude, longitude, radius, search_parameter):
        f = FactualAPI()
        data = f.get_nearby(latitude, longitude, radius, search_parameter)
        return data.total_row_count()