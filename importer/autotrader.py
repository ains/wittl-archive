import HTMLParser
import requests
from bs4 import BeautifulSoup
from importer.base import BaseImporter


class AutoTraderImporter(BaseImporter):
    NAME = "autotrader"
    URL_PATTERNS = [r"https?:\/\/(www.)?autotrader.co.uk\/.*?"]

    @staticmethod
    def meta_getter(soup):
        def property_getter(property_name):
            h = HTMLParser.HTMLParser()
            meta_tag = soup.find("meta", attrs={"property": property_name})
            return h.unescape(meta_tag["content"]) if meta_tag is not None else ""

        def name_getter(name_name):
            h = HTMLParser.HTMLParser()
            meta_tag = soup.find("meta", attrs={"name": name_name})
            return h.unescape(meta_tag["content"]) if meta_tag is not None else ""

        def property_getter():
            return property_getter

        def name_getter():
            return name_getter


    def extract_attributes(self, page):
        attributes = {}

        soup = BeautifulSoup(page)

        table_attributes = {
            'Urban mpg': 'urban_mpg', 'Extra Urban mpg': 'extra_urban_mpg', 'Average mpg': 'mpg', 
            'CO<sub>2</sub> emissions': 'CO2_emissions', 'Annual Tax': 'annual_tax',
            'Engine power': 'engine_power', 'Acceleration (0-62mph)': 'accleration',
            'Wheel drive': 'wheel_drive', 'Engine size': 'engine_size',
            'Top speed': 'top_speed', 'No. of doors': 'num_doors',
            'Boot capacity - seats up': 'boot_capacity', 'No. of seats': 'num_seats',
            'Max towing weight (braked)': 'max_towing_weight_braked',
            'Max towing weight (unbraked)': 'max_towing_weight_unbraked'
        }

        for (attribute_label, internal_name) in table_attributes.items():
            label_element = soup.find("th", text=attribute_label)
            if label_element:
                value_element = label_element.find_next_sibling("td")
                attributes[internal_name] = value_element.string

        attributes["price"] = soup.find('span', attrs={'id': 'price'})
        
        meta_property_getter = self.meta_getter(soup).property_getter()
        meta_properties = [
            ("og:title", "name"),
            ("og:url", "url"),
            ("og:image", "image")
        ]
        attributes.update({key: meta_property_getter(property_name) for (property_name, key) in meta_properties})

        meta_name_getter = self.meta_getter(soup).name_getter()
        meta_names = [
            ("description", "description")
        ]
        attributes.update({key: meta_name_getter(property_name) for (property_name, key) in meta_names})

        return attributes


    def get_attributes(self, url):
        r = requests.get(url)
        return self.extract_attributes(r.text)