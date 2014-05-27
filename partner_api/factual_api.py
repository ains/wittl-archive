import keys

from factual import Factual
from factual.utils import circle


class FactualAPI():
    def __init__(self):
        self.key = keys.FACTUAL_KEY
        self.secret = keys.FACTUAL_SECRET
        self.factual = Factual(self.key, self.secret)

    #returns query object
    def get_nearby(self, lat, lon, radius, search_parameter):
        table = self.factual.table("global")
        query = table.search(search_parameter).include_count(True)
        query = query.geo(circle(lat, lon, radius))
        return query