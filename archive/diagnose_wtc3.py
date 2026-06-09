"""
Get a WORKING chatflow from the server and compare its agent node structure 
with WTC's agentAgentflow_7 to find the JSON parse error cause.
Also check if credentials exist in other chatflows' nodes.
"""
import requests, json

FLOWISE_URL = "https://ecoflow.koppi.mx"
API_KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"

headers = {"Authorization": f"Bearer {API_KEY}"}

# 1. Get list of all chatflows to find a working one
r = requests.get(f"{FLOWISE_URL}/api/v1/chatflows", headers=headers)
chatflows = r.json()

# Find a few AGENTFLOW chatflows to compare (not WTC)
candidates = [cf for cf in chatflows if cf.get("type") == "AGENTFLOW" and cf["name"] != "WTC"]

print(f"Found {len(candidates)} AGENTFLOW candidates (excluding WTC)")

# Pick first candidate and check its structure
if candidates:
    ref = candidates[0]
    print(f"\nReference chatflow: {ref['name']} (id: {ref['id']})")
    
    r2 = requests.get(f"{FLOWISE_URL}/api/v1/chatflows/{ref['id']}", headers=headers)
    ref_data = r2.json()
    ref_fd = json.loads(ref_data.get("flowData", "{}"))
    
    # Find an agent node with tools
    for node in ref_fd.get("nodes", []):
        ndata = node.get("data", {})
        if ndata.get("type") == "Agent":
            tools = ndata.get("inputs", {}).get("agentTools", "")
            cred = ndata.get("credential", "NONE")
            msgs = ndata.get("inputs", {}).get("agentMessages", "")
            print(f"\n  Agent: {ndata.get('label', '')}")
            print(f"  credential: {cred}")
            print(f"  agentTools type: {type(tools).__name__}", end="")
            if isinstance(tools, list) and tools:
                t = tools[0]
                print(f" - first item type: {type(t).__name__}")
                if isinstance(t, dict):
                    cfg = t.get("agentSelectedToolConfig", "")
                    print(f"    config type: {type(cfg).__name__}")
            elif isinstance(tools, str):
                print(f" - string len: {len(tools)}")
            else:
                print()
            print(f"  agentMessages type: {type(msgs).__name__}", end="")
            if isinstance(msgs, list) and msgs:
                print(f" - first item type: {type(msgs[0]).__name__}")
            elif isinstance(msgs, str):
                print(f" - string: {msgs[:100]}")
            else:
                print()
            # Show ALL data keys
            print(f"  All data keys: {sorted(ndata.keys())}")
            break

# 2. Check credentials across multiple chatflows
print("\n\n=== Credential check across chatflows ===")
cred_found = 0
for cf in candidates[:5]:
    r3 = requests.get(f"{FLOWISE_URL}/api/v1/chatflows/{cf['id']}", headers=headers)
    cf_data = r3.json()
    cf_fd = json.loads(cf_data.get("flowData", "{}"))
    has_cred = False
    for node in cf_fd.get("nodes", []):
        cred = node.get("data", {}).get("credential")
        if cred:
            has_cred = True
            cred_found += 1
            print(f"  {cf['name']}: node {node.get('data',{}).get('id','')} has credential={cred}")
            break
    if not has_cred:
        # Check if credential is at a different level
        for node in cf_fd.get("nodes", []):
            ndata = node.get("data", {})
            for k, v in ndata.items():
                if "cred" in k.lower() and v:
                    print(f"  {cf['name']}: node {ndata.get('id','')} has {k}={repr(v)[:100]}")
                    has_cred = True
                    break
            if has_cred:
                break
        if not has_cred:
            print(f"  {cf['name']}: NO credentials in flowData nodes")

print(f"\nTotal chatflows with credentials in flowData: {cred_found}")

# 3. Now compare the WTC agent 7 node's inputParams vs a working agent
print("\n\n=== InputParams comparison ===")
# WTC
r_wtc = requests.get(f"{FLOWISE_URL}/api/v1/chatflows/a2dbda66-1339-43ae-9c67-d97f30c198ac", headers=headers)
wtc = json.loads(r_wtc.json().get("flowData", "{}"))

wtc7 = None
wtc1 = None
for node in wtc.get("nodes", []):
    nid = node.get("data", {}).get("id", "")
    if nid == "agentAgentflow_7":
        wtc7 = node
    elif nid == "agentAgentflow_1":
        wtc1 = node

if wtc7 and wtc1:
    params7 = len(wtc7["data"].get("inputParams", []))
    params1 = len(wtc1["data"].get("inputParams", []))
    print(f"Agent 1 inputParams count: {params1}")
    print(f"Agent 7 inputParams count: {params7}")
    
    # Compare param names
    names1 = [p.get("name") for p in wtc1["data"].get("inputParams", [])]
    names7 = [p.get("name") for p in wtc7["data"].get("inputParams", [])]
    print(f"Agent 1 param names: {names1}")
    print(f"Agent 7 param names: {names7}")
    
    if names1 != names7:
        print("MISMATCH!")
        print(f"  In 1 but not 7: {set(names1) - set(names7)}")
        print(f"  In 7 but not 1: {set(names7) - set(names1)}")
