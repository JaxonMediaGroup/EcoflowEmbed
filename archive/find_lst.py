import requests, json

headers = {'Authorization': 'Bearer Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8'}
r = requests.get('https://ecoflow.koppi.mx/api/v1/chatflows', headers=headers)
flows = r.json()

for f in flows:
    name = f.get('name', '')
    if 'santisima' in name.lower() or 'santísima' in name.lower() or 'lst' in name.lower():
        fid = f['id']
        print(f"ID: {fid} | Name: {name}")
