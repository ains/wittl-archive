import requests
from bs4 import BeautifulSoup


class AirbnbImporter():
    NAME = "airbnb"
    URL_PATTERNS = ("https?:\/\/(www.)?airbnb.([a-zA-Z.]+)\/rooms\/[0-9]+",)

    def __init__(self):
        pass

    @staticmethod
    def meta_property_getter(soup):
        def getter(property_name):
            meta_tag = soup.find("meta", attrs={"property": property_name})
            return meta_tag["content"] if meta_tag is not None else ""

        return getter

    def extract_attributes(self, page):
        attributes = {}

        soup = BeautifulSoup(page)
        property_detail_table = soup.find("table", id="description_details")
        property_detail_rows = property_detail_table.find_all("tr")
        table_attributes = [
            (1, "person_capacity"),
            (2, "bedrooms"),
            (3, "bathrooms"),
            (4, "beds"),
            (9, "check_in_time"),
            (10, "check_out_time")
        ]

        for (index, attribute_name) in table_attributes:
            if index < len(property_detail_rows):
                row = property_detail_rows[index]
                attributes[attribute_name] = row.find_all("td")[1].get_text()

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

        return attributes

    def get_attributes(self, url):
        r = requests.get(url)
        return self.extract_attributes(r.text)