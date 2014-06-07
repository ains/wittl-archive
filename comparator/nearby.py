from comparator.base import BaseComparator
from partner_api.factual_api import FactualAPI
from django.template.defaultfilters import pluralize


class NearbyComparator(BaseComparator):
    NAME = "nearby"
    TITLE = "Nearby"
    DESCRIPTION = "Compare items by the number of places nearby."
    REQUIRED_ATTRIBUTES = {"latitude", "longitude"}

    DISPLAY_NAME = "ideal temperature"
    PREPOSITION = "of"
    FIELDS = [{"name": "ideal_temperature", "type": "text"}]

    def score(self, latitude, longitude, radius, poi_name):
        f = FactualAPI()
        data = f.get_nearby(latitude, longitude, radius, poi_name)
        score = data.total_row_count()

        return {
            "score": score,
            "Summary": "{} {}'s within 10km".format(score, poi_name)
        }