from factual import Factual
from factual.utils import circle


class FactualApi():
    def __init__(self):
        self.key = 'wsFe9EAGZaonuLPYGH8jBevYIAAFDiSQnJXizNCt'
        self.secret = '5grxa14smxPAxDNoYmfbidNNKoA895MRfqwUVjmN'
        self.factual = Factual(self.key, self.secret)

    #radius in metres
    def get_nearby(self, lat, lon, radius, search_parameter):
        table = self.factual.table("global")
        query = table.search(search_parameter).include_count(True)
        query = query.geo(circle(lat, lon, radius))
        print query.data()
        return query.data()
