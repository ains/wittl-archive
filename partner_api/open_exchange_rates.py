import requests


class OpenExchangeRatesAPI():
    BASE_URL = "http://openexchangerates.org/api/"
    API_KEY = "a73695b6e8f24aa7b398b9212a33252f"

    def __init__(self):
        pass

    def get_latest_rates(self, base):
        params = {"app_id": self.API_KEY, "base": base}
        api_url = "{}{}".format(self.BASE_URL, "latest.json")
        r = requests.get(api_url, params=params)

        return r.json()