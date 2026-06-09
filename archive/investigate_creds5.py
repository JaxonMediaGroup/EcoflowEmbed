import requests, json

FLOWISE_URL = "https://ecoflow.koppi.mx"
API_KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
headers = {"Authorization": f"Bearer {API_KEY}"}

openai_cred = "e8fe03f6"

# Get the WTC chatflow
r = requests.get(f"{FLOWISE_URL}/api/v1/chatflows/a2dbda66-1339-43ae-9c67-d97f30c198ac", headers=headers)
cf = r.json()
flow = json.loads(cf["flowData"])

# For each node that has the credential, find EXACTLY where
for node in flow["nodes"]:
    nid = node["id"]
    label = node["data"].get("label", "?")
    data_str = json.dumps(node["data"], ensure_ascii=False)
    
    if openai_cred not in data_str:
        continue
    
    print(f"\n=== {nid} ({label}) ===")
    
    # Recursively search for the credential
    def find_in_obj(obj, path=""):
        if isinstance(obj, dict):
            for k, v in obj.items():
                find_in_obj(v, f"{path}.{k}")
        elif isinstance(obj, list):
            for i, v in enumerate(obj):
                find_in_obj(v, f"{path}[{i}]")
        elif isinstance(obj, str) and openai_cred in obj:
            print(f"  {path} = {obj[:200]}")
    
    find_in_obj(node["data"], "data")

# Also check speechToText
print("\n=== speechToText ===")
st = cf.get("speechToText", "")
if isinstance(st, str):
    st_obj = json.loads(st) if st else {}
else:
    st_obj = st
print(json.dumps(st_obj, indent=2, ensure_ascii=False)[:500])

# Check the new agent (agentAgentflow_7) specifically - show ALL inputs
print("\n\n=== agentAgentflow_7 FULL INPUTS ===")
for node in flow["nodes"]:
    if node["id"] == "agentAgentflow_7":
        inputs = node["data"].get("inputs", {})
        for k, v in inputs.items():
            v_str = str(v)
            if len(v_str) > 200:
                print(f"  {k}: {v_str[:200]}...")
            else:
                print(f"  {k}: {v}")
        break
