from comparator.base import BaseComparator
from partner_api.wunderground import WundergroundAPI
from django import forms


class WeatherComparator(BaseComparator):
    NAME = 'weather'
    REQUIRED_ATTRIBUTES = ("latitude", "longitude")
    TRIGGERS = [r"distance from (?P<destination_location>.*)"]
    TITLE = "Weather at destination"
    EXTRA_FIELDS = {
        'ideal_temperature': forms.CharField()
    }

    def score(self, latitude, longitude, ideal_temperature, date):
        w = WundergroundAPI()
        weather_at_destination = w.get_weather(latitude, longitude, date)
        return abs(weather_at_destination - ideal_temperature)