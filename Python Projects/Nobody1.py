import urllib.request
import xml.etree.ElementTree as ET
import json

url = input('Enter location: ')
if len(url) < 1 : 
    url = 'http://py4e-data.dr-chuck.net/comments_42.json'

print('Retrieving', url)
uh = urllib.request.urlopen(url)
data = uh.read()
print('Retrieved',len(data),'characters')
tree = json.loads(data)
counts=tree["comments"]
total = 0
for item in counts:
    total = total + int(item["count"])
print('count:',total)

