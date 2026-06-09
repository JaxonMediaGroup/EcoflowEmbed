import requests, json

FLOWISE_URL = "https://ecoflow.koppi.mx"
API_KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
CHATFLOW_ID = "a2dbda66-1339-43ae-9c67-d97f30c198ac"

headers = {"Authorization": f"Bearer {API_KEY}"}
r = requests.get(f"{FLOWISE_URL}/api/v1/chatflows/{CHATFLOW_ID}", headers=headers)
cf = r.json()

print("=== Top-level keys ===")
for k in cf.keys():
    val = cf[k]
    if isinstance(val, str) and len(val) > 200:
        print(f"  {k}: (string, {len(val)} chars)")
    else:
        print(f"  {k}: {repr(val)[:200]}")

print("\n=== Nodes credential check ===")
fd = json.loads(cf.get("flowData", "{}"))
for node in fd.get("nodes", []):
    nid = node.get("data", {}).get("id", node.get("id"))
    label = node.get("data", {}).get("label", "")
    cred = node.get("data", {}).get("credential", "NONE")
    print(f"  {nid}: cred={cred} | {label}")

print("\n=== Agent 7 field types ===")
for node in fd.get("nodes", []):
    if node.get("data", {}).get("id") == "agentAgentflow_7":
        inputs = node["data"]["inputs"]
        for key in ["agentMessages", "agentTools", "agentToolsBuiltInOpenAI", 
                     "agentKnowledgeDocumentStores", "agentStructuredOutput", "agentUpdateState"]:
            val = inputs.get(key, "MISSING")
            vtype = type(val).__name__
            if isinstance(val, list):
                print(f"  {key}: list[{len(val)}]")
                for i, item in enumerate(val):
                    itype = type(item).__name__
                    if isinstance(item, dict):
                        print(f"    [{i}] dict keys: {list(item.keys())}")
                        for ik, iv in item.items():
                            ivtype = type(iv).__name__
                            if isinstance(iv, str):
                                print(f"      {ik}: str({len(iv)} chars)")
                            elif isinstance(iv, dict):
                                print(f"      {ik}: dict keys: {list(iv.keys())}")
                            else:
                                print(f"      {ik}: {ivtype} = {repr(iv)[:100]}")
                    else:
                        print(f"    [{i}] {itype}: {repr(item)[:100]}")
            elif isinstance(val, str):
                print(f"  {key}: str({len(val)} chars) = {repr(val)[:100]}")
            else:
                print(f"  {key}: {vtype} = {repr(val)[:100]}")

print("\n=== Agent 1 field types (reference) ===")
for node in fd.get("nodes", []):
    if node.get("data", {}).get("id") == "agentAgentflow_1":
        inputs = node["data"]["inputs"]
        for key in ["agentMessages", "agentTools", "agentToolsBuiltInOpenAI"]:
            val = inputs.get(key, "MISSING")
            vtype = type(val).__name__
            if isinstance(val, list):
                print(f"  {key}: list[{len(val)}]")
                for i, item in enumerate(val):
                    itype = type(item).__name__
                    if isinstance(item, dict):
                        print(f"    [{i}] dict keys: {list(item.keys())}")
                    else:
                        print(f"    [{i}] {itype}: {repr(item)[:100]}")
            elif isinstance(val, str):
                print(f"  {key}: str({len(val)} chars) = {repr(val)[:100]}")
            else:
                print(f"  {key}: {vtype} = {repr(val)[:100]}")
