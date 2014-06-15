import requests
import keys


class GoogleMapsAPI():
    def __init__(self):
        self.key = keys.GOOGLE_MAPS_KEY
        self.base_url = 'https://maps.googleapis.com/maps/api/distancematrix/'

    def get_distance(self, from_lat, from_lon, destination):
        origin = '{},{}'.format(from_lat, from_lon)
        params = {'origins': origin, 'destinations': destination, 'key': self.key}
        request_url = '{}json?'.format(self.base_url)
        response = requests.get(request_url, params=params)

        return response.json()['rows'][0]['elements'][0]['distance']
