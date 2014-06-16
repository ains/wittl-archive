import HTMLParser
import requests
from bs4 import BeautifulSoup
from importer.base import BaseImporter


class AutoTraderImporter(BaseImporter):
    NAME = "autotrader"
    URL_PATTERNS = [r"https?:\/\/(www.)?autotrader.co.uk\/.*?"]
    SORTABLE_ATTRS = {
        "boot_capacity": "Boot capacity - seats up",
        "mpg": "Average mpg",
        "accleration": "Acceleration (0-62mph)",
        "top_speed": "Top speed"
    }

    class MetaGetter():
        def __init__(self, soup):
            self.soup = soup
            pass

        def property(self, property_name):
            h = HTMLParser.HTMLParser()
            meta_tag = self.soup.find("meta", attrs={"property": property_name})
            return h.unescape(meta_tag["content"]) if meta_tag is not None else ""

        def name(self, name_name):
            h = HTMLParser.HTMLParser()
            meta_tag = self.soup.find("meta", attrs={"name": name_name})
            return h.unescape(meta_tag["content"]) if meta_tag is not None else ""


    def extract_attributes(self, page):
        attributes = {}

        soup = BeautifulSoup(page)

        table_attributes = {
            'Urban mpg': 'urban_mpg', 'Extra Urban mpg': 'extra_urban_mpg', 'Average mpg': 'mpg',
            'CO<sub>2</sub> emissions': 'CO2_emissions', 
            'Engine power': 'engine_power', 'Acceleration (0-62mph)': 'accleration',
            'Wheel drive': 'wheel_drive', 'Engine size': 'engine_size',
            'Top speed': 'top_speed', 'No. of doors': 'num_doors',
            'Boot capacity - seats up': 'boot_capacity', 'No. of seats': 'num_seats',
            'Max towing weight (braked)': 'max_towing_weight_braked',
            'Max towing weight (unbraked)': 'max_towing_weight_unbraked'
        }

        non_numerical_values = ["name", "url", "description", "wheel_drive", "image"]

        for (attribute_label, internal_name) in table_attributes.items():
            label_element = soup.find("th", text=attribute_label)
            if label_element:
                value_string = label_element.find_next_sibling("td").string
                if value_string != "No details available" and internal_name not in non_numerical_values:
                    value = value_string.split()[0]
                    attributes[internal_name] = float(value) if "." in value else int(value)
                else:
                    attributes[internal_name] = value_string

        attributes["price"] = int(soup.find('span', attrs={'id': 'price'}).string[1:].replace(",", ""))

        meta_property_getter = self.MetaGetter(soup).property
        meta_properties = [
            ("og:title", "name"),
            ("og:url", "url"),
            ("og:image", "image")
        ]
        attributes.update({key: meta_property_getter(property_name) for (property_name, key) in meta_properties})

        meta_name_getter = self.MetaGetter(soup).name
        meta_names = [
            ("description", "description")
        ]
        attributes.update({key: meta_name_getter(property_name) for (property_name, key) in meta_names})

        return attributes


    def get_attributes(self, url):
        r = requests.get(url)
        return self.extract_attributes(r.text)