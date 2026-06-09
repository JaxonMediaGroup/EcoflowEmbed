"""
Upload updated LST La Santisima JSON to Flowise via API.
This pushes the file with KEY PRINCIPLE directly to the live chatflow.
"""
import requests
import json

FLOWISE_URL = "https://ecoflow.koppi.mx"
API_KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
CHATFLOW_ID = "4c84d4c6-2df9-4d60-ac7e-6c9a78608f1c"
JSON_FILE = "Anahuac Orientador Vocacional Agents.json"

headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

# 1. Read the local updated JSON
with open(JSON_FILE, 'r', encoding='utf-8') as f:
    flow_data = json.load(f)

# Verify KEY PRINCIPLE is present
for node in flow_data['nodes']:
    if node['data'].get('name') == 'conditionAgentAgentflow':
        instr = node['data']['inputs']['conditionAgentInstructions']
        if 'KEY PRINCIPLE' in instr:
            print("✅ KEY PRINCIPLE found in condition agent instructions")
        else:
            print("❌ KEY PRINCIPLE NOT found! Aborting.")
            exit(1)

# 2. Get current chatflow from Flowise to see structure
r = requests.get(f"{FLOWISE_URL}/api/v1/chatflows/{CHATFLOW_ID}", headers=headers)
if r.status_code != 200:
    print(f"❌ Failed to get chatflow: {r.status_code} {r.text}")
    exit(1)

current = r.json()
print(f"📄 Current chatflow: {current['name']}")

# 3. Update with new flowData
flow_data_str = json.dumps(flow_data, ensure_ascii=False)

update_body = {
    "flowData": flow_data_str
}

r2 = requests.put(
    f"{FLOWISE_URL}/api/v1/chatflows/{CHATFLOW_ID}",
    headers=headers,
    json=update_body
)

if r2.status_code == 200:
    print("✅ Successfully updated LST La Santisima in Flowise!")
    # Verify
    updated = r2.json()
    fd = json.loads(updated.get('flowData', '{}'))
    for node in fd.get('nodes', []):
        if node.get('data', {}).get('name') == 'conditionAgentAgentflow':
            if 'KEY PRINCIPLE' in node['data']['inputs'].get('conditionAgentInstructions', ''):
                print("✅ Verified: KEY PRINCIPLE is live in Flowise!")
            else:
                print("⚠️ KEY PRINCIPLE not found in response, check manually")
else:
    print(f"❌ Failed to update: {r2.status_code}")
    print(r2.text[:500])
