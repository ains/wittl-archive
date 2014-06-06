import keys
import requests
import re


class ZooplaAPI():
    def __init__(self):
        self.key = keys.ZOOPLA_KEY
        self.base_url = 'http://api.zoopla.co.uk/api/v1/'

    def get_property(self, url):
        URL_PATTERNS = r"https?:\/\/(www.)?zoopla.co.uk\/[a-z\-]+\/details\/([0-9]+)"
        pattern = re.compile(URL_PATTERNS)
        listing_id = pattern.search(url).groups()[-1]

        request_url = '{}property_listings.json'.format(self.base_url)
        params = {'api_key': self.key, 'listing_id': listing_id}
        return requests.get(request_url, params=params).json()['listing'][0]
