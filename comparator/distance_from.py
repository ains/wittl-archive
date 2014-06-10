from comparator.base import BaseComparator
from partner_api.google_maps import GoogleMapsAPI


class DistanceFromComparator(BaseComparator):
    NAME = "distance_from"
    TITLE = "Distance from"
    DESCRIPTION = "The distance from a place to a given destination."
    REQUIRED_ATTRIBUTES = {"latitude", "longitude"}

    DISPLAY_NAME = "distance"
    PREPOSITION = "to"
    FIELDS = {"destination_location": {"type": "text"}}

    def score(self, latitude, longitude, to_lat, to_lon):
        score = GoogleMapsAPI().get_distance(latitude, longitude, to_lat, to_lon)
        return {
            "score": score,
            "summary": ""
        }