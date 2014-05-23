from comparator.base import BaseComparator
from partner_api.rome2rio import Rome2RioAPI


class TravelTimeFromComparator(BaseComparator):
    NAME = "travel_time_from"
    REQUIRED_ATTRIBUTES = ("latitude", "longitude")
    TRIGGERS = [r"travel time from (?P<origin_location>.*)"]
    TITLE = "Travel time from {{origin_location}}"

    @staticmethod
    def get_route_data(route):
        return {
            "name": route["name"],
            "duration": route["duration"]
        }

    def score(self, latitude, longitude, origin_location):
        destintation_lat_lon = "{},{}".format(latitude, longitude)
        r2r_api = Rome2RioAPI()

        trip_data = r2r_api.do_search(oName=origin_location, dPos=destintation_lat_lon)
        all_routes = map(self.get_route_data, trip_data["routes"])

        sorted_routes = sorted(all_routes, key=lambda x: x["duration"])
        return int(sorted_routes[0]["duration"])