from comparator.base import BaseComparator
from partner_api.google_maps import GoogleMapsAPI


class DistanceFromComparator(BaseComparator):
    NAME = "distance_from"
    TITLE = "Distance from"
    PRIMARY_FIELD = "origin_location"
    DESCRIPTION = "The distance from a place to a given destination."

    REQUIRED_ATTRIBUTES = ("latitude", "longitude")
    TRIGGERS = [r"distance from (?P<destination_location>.*)"]

    def score(self, latitude, longitude, to_lat, to_lon):
        return GoogleMapsAPI().get_distance(latitude, longitude, to_lat, to_lon)