import datetime

from comparator.base import BaseComparator
from partner_api.wunderground import WundergroundAPI
from django import forms


class WeatherComparator(BaseComparator):
    NAME = "weather"
    TITLE = "Weather at location"
    DESCRIPTION = "Compare locations by how close the temperature is to your ideal temperature."
    REQUIRED_ATTRIBUTES = {"latitude", "longitude"}

    DISPLAY_NAME = "ideal temperature"
    PREPOSITION = "of around"
    FIELDS = {"ideal_temperature": {"type": "text"}}

    def score(self, latitude, longitude, ideal_temperature, date=datetime.datetime.now()):
        w = WundergroundAPI()
        weather_at_destination = w.get_weather(latitude, longitude, date)
        score = abs(weather_at_destination - int(ideal_temperature))
        return {
            "score": score,
            "summary": u"<strong>{}<small>\u2103</small></strong> from your ideal temperature".format(score)
        }