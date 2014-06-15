from comparator.base import BaseComparator
from partner_api.factual_api import FactualAPI
from django.template.defaultfilters import pluralize


class NearbyComparator(BaseComparator):
    NAME = "nearby"
    TITLE = "Nearby"
    DESCRIPTION = "Compare items by the number of places nearby."
    REQUIRED_ATTRIBUTES = {"latitude", "longitude"}

    DISPLAY_NAME = "nearby"
    PREPOSITION = ""
    FIELDS = {"poi_name": {"type": "text"}}

    def score(self, latitude, longitude, poi_name):
        radius = 1000
        f = FactualAPI()
        data = f.get_nearby(latitude, longitude, radius, poi_name)
        score = data.total_row_count()

        return {
            "score": 1 / (score + 1),
            "summary": "{} {} within 1km".format(score, poi_name)
        }