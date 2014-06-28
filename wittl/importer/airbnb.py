import HTMLParser
import requests
from bs4 import BeautifulSoup
from importer.base import BaseImporter


class AirbnbImporter(BaseImporter):
    NAME = "airbnb"
    URL_PATTERNS = [r"https?:\/\/(www.)?airbnb.([a-zA-Z.]+)\/rooms\/[0-9]+"]
    SORTABLE_ATTRS = {'bathrooms': 'Bathrooms', 'person_capacity': 'Guests', 'bedrooms': 'Bedrooms', 'beds': 'Beds'}

    @staticmethod
    def meta_property_getter(soup):
        def getter(property_name):
            h = HTMLParser.HTMLParser()
            meta_tag = soup.find("meta", attrs={"property": property_name})
            return h.unescape(meta_tag["content"]) if meta_tag is not None else ""

        return getter

    def extract_attributes(self, page):
        attributes = {}

        soup = BeautifulSoup(page)

        table_attributes = {
            "Accommodates:": "person_capacity",
            "Bedrooms:": "bedrooms",
            "Bathrooms:": "bathrooms",
            "Beds:": "beds",
            "Check In:": "check_in_time",
            "Check Out:": "check_out_time"
        }

        for (attribute_label, internal_name) in table_attributes.items():
            label_element = soup.find("td", text=attribute_label)
            if label_element:
                value_element = label_element.find_next_sibling("td")
                attributes[internal_name] = value_element.string

        meta_property_getter = self.meta_property_getter(soup)
        meta_properties = [
            ("og:title", "name"),
            ("og:description", "description"),
            ("airbedandbreakfast:locality", "locality"),
            ("airbedandbreakfast:region", "region"),
            ("airbedandbreakfast:country", "country"),
            ("airbedandbreakfast:city", "city"),
            ("airbedandbreakfast:location:latitude", "latitude"),
            ("airbedandbreakfast:location:longitude", "longitude"),
            ("og:image", "image")
        ]
        attributes.update({key: meta_property_getter(property_name) for (property_name, key) in meta_properties})

        attributes["subtitle"] = attributes["city"]

        return attributes

    def get_attributes(self, url):
        r = requests.get(url)
        return self.extract_attributes(r.text)