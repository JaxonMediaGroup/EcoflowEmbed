import requests, json

FLOWISE_URL = "https://ecoflow.koppi.mx"
API_KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
headers = {"Authorization": f"Bearer {API_KEY}"}

# Check flow-config
r = requests.get(f"{FLOWISE_URL}/api/v1/flow-config/a2dbda66-1339-43ae-9c67-d97f30c198ac", headers=headers)
config = r.json()
config_str = json.dumps(config, ensure_ascii=False)

openai_cred_id = "e8fe03f6-9865-4abf-a662-ebdfe5561c5a"

if openai_cred_id[:8] in config_str:
    print("OpenAI credential found in flow-config!")
    idx = config_str.find(openai_cred_id[:8])
    print(f"Context: ...{config_str[max(0,idx-100):idx+100]}...")
else:
    print("OpenAI credential NOT in flow-config")

print(f"\nResponse type: {type(config).__name__}")
if isinstance(config, list):
    print(f"List length: {len(config)}")
    if config:
        item = config[0]
        if isinstance(item, dict):
            print(f"First item keys: {list(item.keys())}")
elif isinstance(config, dict):
    print(f"Dict keys: {list(config.keys())}")

# Try full export to see credentials
print("\n=== Trying full export ===")
r2 = requests.post(f"{FLOWISE_URL}/api/v1/export-import/export", headers=headers, json={})
if r2.status_code == 200:
    export = r2.json()
    export_str = json.dumps(export, ensure_ascii=False)
    if openai_cred_id[:8] in export_str:
        # Find all occurrences
        idx = 0
        count = 0
        while True:
            idx = export_str.find(openai_cred_id[:8], idx)
            if idx == -1:
                break
            context = export_str[max(0,idx-80):idx+120]
            if count < 3:
                print(f"\n  Occurrence {count+1}: ...{context}...")
            count += 1
            idx += 1
        print(f"\n  Total occurrences of OpenAI credential: {count}")
    else:
        print("  OpenAI credential NOT in export")
    
    # Check export structure
    if isinstance(export, dict):
        for k, v in export.items():
            if isinstance(v, list):
                print(f"  {k}: list[{len(v)}]")
            elif isinstance(v, str):
                print(f"  {k}: str({len(v)} chars)")
            else:
                print(f"  {k}: {type(v).__name__}")
else:
    print(f"  Export failed: {r2.status_code}")
