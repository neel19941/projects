import json,ssl
import urllib.request, urllib.parse, urllib.error
import xml.etree.ElementTree as ET

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

place_name = input("Enter a place name: ")
base_url = "http://py4e-data.dr-chuck.net/opengeo?"
parms = dict()
parms['q'] = place_name
address_param = urllib.parse.urlencode(parms)
url = base_url + address_param
print(url)
print('Retrieving', url)
uh = urllib.request.urlopen(url,context=ctx)
data = uh.read().decode()
print('Retrieved', len(data), 'characters', data[:20].replace('\n', ' '))
parsed_data = json.loads(data)
pluscode = parsed_data['features'][0]['properties']['plus_code']
print (pluscode)