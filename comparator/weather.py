import datetime

from comparator.base import BaseComparator
from partner_api.wunderground import WundergroundAPI
from django import forms


class WeatherComparator(BaseComparator):
    NAME = "weather"
    TITLE = "Weather at location"
    PRIMARY_FIELD = None
    DESCRIPTION = "Compare locations by how close the temperature is to your ideal temperature."

    REQUIRED_ATTRIBUTES = ("latitude", "longitude")
    TRIGGERS = [r"weather at destination"]
    EXTRA_FIELDS = {
        'ideal_temperature': forms.CharField()
    }

    def score(self, latitude, longitude, ideal_temperature, date=datetime.datetime.now()):
        w = WundergroundAPI()
        weather_at_destination = w.get_weather(latitude, longitude, date)
        return abs(weather_at_destination - int(ideal_temperature))