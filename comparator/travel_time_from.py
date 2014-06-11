import datetime

from comparator.base import BaseComparator
from partner_api.rome2rio import Rome2RioAPI


class TravelTimeFromComparator(BaseComparator):
    NAME = "travel_time_from"
    TITLE = "Travel time from"
    DESCRIPTION = "The total time to get to your destination from your chosen start location"
    REQUIRED_ATTRIBUTES = {"latitude", "longitude"}

    DISPLAY_NAME = "travel time"
    PREPOSITION = "from"
    FIELDS = {
        "origin_location": {"type": "text"}
    }

    @staticmethod
    def get_route_data(route):
        total_duration = 0

        for segment in route["segments"]:
            total_duration += segment["duration"]

        return {
            "name": route["name"],
            "duration": total_duration
        }

    def score(self, latitude, longitude, origin_location):
        destintation_lat_lon = "{},{}".format(latitude, longitude)
        r2r_api = Rome2RioAPI()

        trip_data = r2r_api.do_search(oName=origin_location, dPos=destintation_lat_lon)
        all_routes = map(self.get_route_data, trip_data["routes"])
        sorted_routes = sorted(all_routes, key=lambda x: x["duration"])
        shortest_duration = int(sorted_routes[0]["duration"])

        h, m = divmod(shortest_duration, 60)
        duration_string = ""
        if h > 0:
            duration_string += "{} Hours ".format(h)
        duration_string += "{} Minutes".format(m)

        return {
            "score": shortest_duration,
            "summary": "<strong>{}</strong> from {}".format(duration_string, origin_location)
        }