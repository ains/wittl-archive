import re
from importer.base import BaseImporter
from partner_api.zoopla import ZooplaAPI


class ZooplaImporter(BaseImporter):
    NAME = "zoopla"
    URL_PATTERNS = [r"https?:\/\/(www.)?zoopla.co.uk\/[a-z\-]+\/details\/([0-9]+)"]

    def get_attributes(self, url):
        attributes = {
            'beds': 'num_bedrooms',
            'price': 'price',
            'street_address': 'displayable_address',
            'subtitle': 'displayable_address',
            'image': 'image_url',
            'description': 'description',
            'latitude': 'latitude',
            'longitude': 'longitude',
            'postcode': 'outcode'
        }

        pattern = re.compile(self.URL_PATTERNS[0])
        listing_id = pattern.search(url).groups()[-1]

        listing = ZooplaAPI().get_property(listing_id)

        for (key, value) in attributes.items():
            attributes[key] = listing[value]

        attributes["name"] = listing['num_bedrooms'] + ' bedroom property, ' + listing['street_name']

        return attributes
