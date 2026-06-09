import requests, json

FLOWISE_URL = "https://ecoflow.koppi.mx"
API_KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
headers = {"Authorization": f"Bearer {API_KEY}"}

# Get a chatflow that works and has agents with OpenAI
# Let's check multiple chatflows to find one with credentials
r = requests.get(f"{FLOWISE_URL}/api/v1/chatflows", headers=headers)
chatflows = r.json()

print("=== Searching for chatflows with credentials in flowData ===\n")
found_any = False

# Check the .bak files locally to find credential patterns
import os
bak_dir = r"c:\Users\Guillermo\Downloads\Chatbots"
bak_files = [f for f in os.listdir(bak_dir) if f.endswith('.json.bak')]

for bak in bak_files[:5]:
    fpath = os.path.join(bak_dir, bak)
    try:
        with open(fpath, encoding='utf-8') as f:
            data = json.load(f)
        for node in data.get('nodes', []):
            ndata = node.get('data', {})
            cred = ndata.get('credential')
            if cred:
                found_any = True
                print(f"FILE: {bak}")
                print(f"  node={ndata.get('id','')}, credential={cred}")
                print(f"  label={ndata.get('label','')[:60]}")
                break
    except:
        pass

if not found_any:
    print("No credentials found in first 5 .bak files either")
    print("\nChecking ALL .bak files...")
    for bak in bak_files:
        fpath = os.path.join(bak_dir, bak)
        try:
            with open(fpath, encoding='utf-8') as f:
                data = json.load(f)
            for node in data.get('nodes', []):
                ndata = node.get('data', {})
                cred = ndata.get('credential')
                if cred:
                    found_any = True
                    print(f"  FOUND in {bak}: node={ndata.get('id','')}, credential={cred}")
                    break
        except:
            pass

if not found_any:
    print("  No credentials in ANY .bak file")

# Check live chatflows via API — find ones with credentials
print("\n=== Checking live chatflows via API ===")
checked = 0
for cf in chatflows[:10]:
    r2 = requests.get(f"{FLOWISE_URL}/api/v1/chatflows/{cf['id']}", headers=headers)
    if r2.status_code != 200:
        continue
    cf_data = r2.json()
    fd = json.loads(cf_data.get('flowData', '{}'))
    for node in fd.get('nodes', []):
        ndata = node.get('data', {})
        cred = ndata.get('credential')
        if cred:
            print(f"  {cf['name']}: node={ndata.get('id','')}, credential={cred}, label={ndata.get('label','')[:40]}")
            found_any = True
    checked += 1

if not found_any:
    print(f"  No credentials found in {checked} chatflows checked")

# The OpenAI credential ID is: e8fe03f6-9865-4abf-a662-ebdfe5561c5a
# Let's check if there's a different mechanism
print("\n=== Checking flow-config for WTC ===")
r3 = requests.get(f"{FLOWISE_URL}/api/v1/flow-config/a2dbda66-1339-43ae-9c67-d97f30c198ac", headers=headers)
if r3.status_code == 200:
    config = r3.json()
    print(f"  Keys: {list(config.keys())[:20]}")
    # Look for credential references
    config_str = json.dumps(config)
    if 'e8fe03f6' in config_str:
        print("  OpenAI credential ID found in flow-config!")
    else:
        print("  OpenAI credential ID NOT in flow-config")
else:
    print(f"  flow-config status: {r3.status_code}")
