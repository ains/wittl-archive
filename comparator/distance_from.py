from comparator.base import BaseComparator


class DistanceFromComparator(BaseComparator):
    REQUIRED_ATTRIBUTES = ("latitude", "longitude")

    def score(self, latitude, longitude, origin_location):
        return 0


TRIGGERS = [(["distance from nearest (?P<to_location>.*)"], DistanceFromComparator)]