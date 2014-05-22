from comparator.base import BaseComparator
from partner_api.rome2rio import Rome2RioAPI
from money import Money


class TravelPricesFromComparator(BaseComparator):
    REQUIRED_ATTRIBUTES = ("latitude", "longitude")

    @staticmethod
    def get_route_data(route):
        route_total = Money(0, currency="USD")

        for segment in route["segments"]:
            segment_price = segment["indicativePrice"]
            if segment_price:
                price = segment["indicativePrice"]["price"]
                currency = segment["indicativePrice"]["currency"]
                route_total += Money(price, currency=currency)

        return {
            "name": route["name"],
            "total_price": route_total
        }

    def score(self, latitude, longitude, origin_location):
        destintation_lat_lon = "{},{}".format(latitude, longitude)
        r2r_api = Rome2RioAPI()

        trip_data = r2r_api.do_search(oName=origin_location, dPos=destintation_lat_lon)
        all_routes = map(self.get_route_data, trip_data["routes"])

        sorted_routes = sorted(all_routes, key=lambda x: x["total_price"])
        return sorted_routes[0]["total_price"] * 2


TRIGGERS = [(["travel prices from (?P<origin_location>.*)"], TravelPricesFromComparator)]