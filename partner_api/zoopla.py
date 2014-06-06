import keys
import requests


class ZooplaAPI():
    def __init__(self):
        self.key = keys.ZOOPLA_KEY
        self.base_url = 'http://api.zoopla.co.uk/api/v1/'

    def get_property(self, listing_id):
        request_url = '{}property_listings.json'.format(self.base_url)
        params = {'api_key': self.key, 'listing_id': listing_id}
        return requests.get(request_url, params=params).json()['listing'][0]
