import os
import unittest

from importer.airbnb import AirbnbImporter


class TestAirbnbImporter(unittest.TestCase):
    def setUp(self):
        self.fixture_directory = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'fixtures')

    def test_extract_attributes(self):
        importer = AirbnbImporter()
        with open(os.path.join(self.fixture_directory, "airbnb_01.html")) as f:
            test_page = f.read()
            actual_value = importer.extract_attributes(test_page)
            expected_value = {'city': u'Sobral de Monte Agra\xe7o', 'bathrooms': u'4',
             'name': u'VILLA C. ALTO, ECO WSurfR, ERICEIRA in Sobral de Monte Agra\xe7o',
             'locality': u'Sobral de Monte Agra\xe7o', 'person_capacity': u'8', 'region': u'Lisbon', 'bedrooms': u'4',
             'longitude': u'-9.122657054546687', 'beds': u'4', 'check_in_time': u'4:00 PM',
             'image': u'https://a2.muscache.com/pictures/33554496/x_large.jpg', 'country': u'Portugal',
             'latitude': u'39.02080210161029', 'check_out_time': u'12:00 PM (noon)',
             'description': u'House in Sobral de Monte Agra\xe7o, Portugal. CNN TRAVEL, \r 1 February, 2013\r Named Ericeira as one of the "4 super swell surf towns (even if you don\'t surf) off the world".\r See (website hidden)\r \r Casa do Alto is an unique villa with cascading pool and magnificent view of countryside and se...'}

            self.assertEqual(actual_value, expected_value)

if __name__ == '__main__':
    unittest.main()