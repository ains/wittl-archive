import requests


class Rome2RioAPI():
    API_KEY = "wJpvLThd"
    BASE_URL = "http://free.rome2rio.com/api/1.2/json/Search"

    def __init__(self):
        pass

    def do_search(self, **kwargs):
        params = {"key": self.API_KEY}
        params.update(kwargs)

        r = requests.get(self.BASE_URL, params=params)
        return r.json()