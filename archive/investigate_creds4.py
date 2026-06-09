import requests, json

FLOWISE_URL = "https://ecoflow.koppi.mx"
API_KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
headers = {"Authorization": f"Bearer {API_KEY}"}

# Get the WTC chatflow
r = requests.get(f"{FLOWISE_URL}/api/v1/chatflows/a2dbda66-1339-43ae-9c67-d97f30c198ac", headers=headers)
cf = r.json()
flow = json.loads(cf["flowData"])

# For each node, check ALL data fields for credential references
openai_cred = "e8fe03f6"
for node in flow["nodes"]:
    nid = node["id"]
    label = node["data"].get("label", "?")
    data_str = json.dumps(node["data"], ensure_ascii=False)
    
    # Check for credential keyword
    has_credential = "credential" in data_str.lower()
    has_openai = openai_cred in data_str
    
    if has_credential or has_openai:
        print(f"\n=== {nid} ({label}) ===")
        if has_openai:
            print("  ** HAS OpenAI credential ID **")
        # Find credential references
        inputs = node["data"].get("inputs", {})
        for k, v in inputs.items():
            if "credential" in k.lower() or (isinstance(v, str) and openai_cred in v):
                print(f"  inputs[{k}] = {v}")
        
        # Check inputParams
        for p in node["data"].get("inputParams", []):
            if "credential" in p.get("name", "").lower() or "credential" in p.get("label", "").lower():
                print(f"  inputParam: name={p.get('name')}, label={p.get('label')}, type={p.get('type')}")

# Also look at top-level chatflow fields for credentials
print("\n=== Top-level chatflow fields ===")
for k in cf:
    if k == "flowData":
        continue
    v = cf[k]
    if isinstance(v, str) and len(v) > 500:
        print(f"  {k}: str({len(v)} chars)")
        if openai_cred in v:
            print(f"    ** CONTAINS OpenAI cred ID **")
    elif v is not None:
        v_str = str(v)
        print(f"  {k}: {v_str[:200]}")
        if openai_cred in v_str:
            print(f"    ** CONTAINS OpenAI cred ID **")

# Check a known working chatflow (Anahuac)
print("\n\n=== Checking Anahuac chatflow ===")
r2 = requests.get(f"{FLOWISE_URL}/api/v1/chatflows", headers=headers)
chatflows = r2.json()
for cf2 in chatflows:
    if "anahuac" in cf2.get("name","").lower():
        print(f"Found: {cf2['name']} ({cf2['id']})")
        flow2 = json.loads(cf2["flowData"])
        for node in flow2["nodes"]:
            data_str = json.dumps(node["data"], ensure_ascii=False)
            if openai_cred in data_str:
                print(f"  Node {node['id']}: HAS OpenAI cred")
            # Check for ANY credential value
            inputs = node["data"].get("inputs", {})
            for k, v in inputs.items():
                if "credential" in k.lower() and v:
                    print(f"  Node {node['data'].get('label','?')}: inputs[{k}] = {v}")
        break
