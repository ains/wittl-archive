from importer import get_importer_for_url

url = "http://www.zoopla.co.uk/for-sale/details/33359943"
importer = get_importer_for_url(url)
print(importer.get_attributes(url))