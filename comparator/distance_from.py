from comparator.base import BaseComparator


class DistanceFromComparator(BaseComparator):
    NAME = 'distance_from'
    REQUIRED_ATTRIBUTES = ("latitude", "longitude")
    TRIGGERS = ["distance from nearest (?P<to_location>.*)"]

    def score(self, latitude, longitude, origin_location):
        return 0