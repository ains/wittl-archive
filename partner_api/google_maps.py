import requests


class GoogleMaps():
    def __init__(self):
        self.key = 'AIzaSyCWKYgtklp2F3UoU8TNlovlF_LpqbarfXg'
        self.base_url = 'https://maps.googleapis.com/maps/api/distancematrix/'

    def get_distance(self, from_lat, from_lon, to_lat, to_lon):
        origin = '{},{}'.format(from_lat, from_lon)
        destination = '{},{}'.format(to_lat, to_lon)
        params = {'origins': origin, 'destinations': destination, 'key': self.key}
        request_url = '{}json?'.format(self.base_url)
        response = requests.get(request_url, params=params)

        return response.json()['rows'][0]['elements'][0]['distance']['value']