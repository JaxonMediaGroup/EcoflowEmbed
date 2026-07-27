import os
import requests, json

headers = {'Authorization': f'Bearer {os.environ["FLOWISE_API_KEY"]}'}
r = requests.get('https://ecoflow.koppi.mx/api/v1/chatflows', headers=headers)
flows = r.json()

for f in flows:
    name = f.get('name', '')
    if 'santisima' in name.lower() or 'santísima' in name.lower() or 'lst' in name.lower():
        fid = f['id']
        print(f"ID: {fid} | Name: {name}")
