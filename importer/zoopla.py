import requests
import HTMLParser
import re


from bs4 import BeautifulSoup
from importer.base import BaseImporter
from urlparse import urlparse, urljoin

class ZooplaImporter(BaseImporter):
    NAME = "zoopla"
    URL_PATTERNS = (r"https?:\/\/(www.)?zoopla.co.uk\/[a-z\-]+\/details\/([0-9]+)",)

    @staticmethod
    def meta_property_getter(soup):
        def getter(property_name):
            h = HTMLParser.HTMLParser()
            meta_tag = soup.find("meta", attrs={"property": property_name})
            return h.unescape(meta_tag["content"]) if meta_tag is not None else ""

        return getter

    @staticmethod
    def google_tag_getter(page_contents):
        def getter(property_name):
            match_regex = "googletag\.pubads\(\)\.setTargeting\(\"{}\", \"(.*?)\"\)".format(property_name)
            pattern = re.compile(match_regex)
            return pattern.search(page_contents).group(1)

        return getter

    def get_attributes(self, url):
        attributes = {}

        r = requests.get(url)
        page = r.text
        soup = BeautifulSoup(page)

        google_tag_getter = self.google_tag_getter(page)
        meta_getter = self.meta_property_getter(soup)

        attributes["beds"] = google_tag_getter("beds_min")
        attributes["price_raw"] = google_tag_getter("price_actual")

        attributes["street_address"] = meta_getter("og:street-address")
        attributes["postal_code"] = meta_getter("og:postal-code")
        attributes["image"] = meta_getter("og:image")

        attributes["price_formatted"] = soup.find("div", class_="listing-details-price text-price").text.strip()
        attributes["name"] = soup.find("h1", class_="listing-details-h1").text
        attributes["description"] = soup.find("div", itemprop="description").text.strip()
        attributes["subtitle"] = attributes["street_address"]

        #Get Lat Lon
        page_url = urlparse(url)
        map_url = soup.find("span", text="Map & nearby").parent["href"]
        full_map_url = urljoin(page_url.scheme + "://" + page_url.netloc, map_url)
        lat_regex = r"lat = (-?[0-9.]+)"
        lon_regex = r"lon = (-?[0-9.]+)"


        map_page = requests.get(full_map_url).text
        attributes["latitude"] = re.search(lat_regex, map_page).group(1)
        attributes["longitude"] = re.search(lon_regex, map_page).group(1)

        return attributes