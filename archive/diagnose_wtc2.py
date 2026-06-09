import requests, json

FLOWISE_URL = "https://ecoflow.koppi.mx"
API_KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
CHATFLOW_ID = "a2dbda66-1339-43ae-9c67-d97f30c198ac"

headers = {"Authorization": f"Bearer {API_KEY}"}
r = requests.get(f"{FLOWISE_URL}/api/v1/chatflows/{CHATFLOW_ID}", headers=headers)
cf = r.json()
fd = json.loads(cf.get("flowData", "{}"))

# Save current server state for comparison
with open("WTC_server_state.json", "w", encoding="utf-8") as f:
    json.dump(fd, f, ensure_ascii=False, indent=2)
print("Saved server state to WTC_server_state.json")

# Deep search for any credential references in entire flowData
def find_cred_keys(obj, path=""):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if "cred" in k.lower() or "apikey" in k.lower() or "api_key" in k.lower():
                print(f"  CRED KEY: {path}.{k} = {repr(v)[:200]}")
            find_cred_keys(v, f"{path}.{k}")
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            find_cred_keys(item, f"{path}[{i}]")

print("\n=== Credential/API key references in flowData ===")
find_cred_keys(fd)

# Compare agent 7 vs agent 1 - check ALL data keys
print("\n=== Full data keys comparison ===")
agents = {}
for node in fd.get("nodes", []):
    nid = node.get("data", {}).get("id", "")
    if nid in ("agentAgentflow_1", "agentAgentflow_7"):
        agents[nid] = node

for aid in ("agentAgentflow_1", "agentAgentflow_7"):
    if aid in agents:
        data = agents[aid].get("data", {})
        print(f"\n--- {aid} ({data.get('label', '')}) ---")
        print(f"  Top-level data keys: {sorted(data.keys())}")
        inputs = data.get("inputs", {})
        print(f"  Input keys: {sorted(inputs.keys())}")
        # Check for any non-standard types
        for k, v in inputs.items():
            vtype = type(v).__name__
            if vtype not in ("str", "bool", "NoneType"):
                if isinstance(v, list):
                    print(f"  {k}: list[{len(v)}]")
                elif isinstance(v, dict):
                    print(f"  {k}: dict({len(v)} keys)")
                else:
                    print(f"  {k}: {vtype}")

# Check if there's a difference at the raw node level (outside data)
print("\n=== Node-level keys (outside data) ===")
for aid in ("agentAgentflow_1", "agentAgentflow_7"):
    if aid in agents:
        node = agents[aid]
        print(f"\n--- {aid} ---")
        print(f"  Node keys: {sorted(node.keys())}")
        for k, v in node.items():
            if k != "data":
                print(f"  {k}: {repr(v)[:100]}")

# Check if conditionAgent scenarios look right
print("\n=== ConditionAgent scenarios ===")
for node in fd.get("nodes", []):
    if node.get("data", {}).get("name") == "conditionAgentAgentflow":
        scenarios = node["data"]["inputs"].get("conditionAgentScenarios", [])
        for i, s in enumerate(scenarios):
            print(f"  [{i}] type={type(s).__name__}", end="")
            if isinstance(s, dict):
                print(f" keys={list(s.keys())} scenario={s.get('scenario','')[:80]}")
            elif isinstance(s, str):
                print(f" val={s[:80]}")
            else:
                print(f" val={repr(s)[:80]}")
