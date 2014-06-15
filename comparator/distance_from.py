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

    def score(self, latitude, longitude, destination_location):
        distance_data = GoogleMapsAPI().get_distance(latitude, longitude, destination_location)
        return {
            "score": distance_data["value"],
            "summary": "{} from {}".format(distance_data["text"], destination_location)
        }