import requests, json

FLOWISE_URL = "https://ecoflow.koppi.mx"
API_KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
headers = {"Authorization": f"Bearer {API_KEY}"}

# 1. List all credentials
r = requests.get(f"{FLOWISE_URL}/api/v1/credentials", headers=headers)
creds = r.json()
print("=== All credentials on server ===")
for c in creds:
    cid = c.get("id", "?")
    cname = c.get("name", "?")
    ctype = c.get("credentialName", "?")
    print(f"  id={cid}, name={cname}, type={ctype}")

# 2. Check the ORIGINAL export from Downloads root
print("\n=== Original WTC export (c:\\Users\\Guillermo\\Downloads\\WTC Agents.json) ===")
try:
    with open(r"c:\Users\Guillermo\Downloads\WTC Agents.json", encoding="utf-8") as f:
        orig = json.load(f)
    
    found_creds = []
    for node in orig.get("nodes", []):
        ndata = node.get("data", {})
        nid = ndata.get("id", "")
        cred = ndata.get("credential", "NONE")
        label = ndata.get("label", "")[:50]
        if cred and cred != "NONE":
            found_creds.append((nid, cred, label))
            print(f"  CRED: {nid} -> credential={cred} | {label}")
    
    if not found_creds:
        print("  No credential fields found at data.credential level")
    
    # Deep search for any credential-like values
    print("\n  Deep search for credential patterns...")
    def deep_find(obj, path=""):
        if isinstance(obj, dict):
            for k, v in obj.items():
                if "credential" in k.lower() and v and str(v) not in ("NONE", "", "{}"):
                    print(f"  FOUND: {path}.{k} = {repr(v)[:150]}")
                deep_find(v, f"{path}.{k}")
        elif isinstance(obj, list):
            for i, item in enumerate(obj):
                deep_find(item, f"{path}[{i}]")
    
    deep_find(orig)
    
    # Count nodes
    print(f"\n  Nodes: {len(orig.get('nodes', []))}")
    print(f"  Edges: {len(orig.get('edges', []))}")
    for node in orig.get("nodes", []):
        ndata = node.get("data", {})
        print(f"    {ndata.get('id','')}: {ndata.get('label','')[:60]}")

except FileNotFoundError:
    print("  File not found")
except Exception as e:
    print(f"  Error: {e}")

# 3. Compare Chatbots version
print("\n=== Chatbots version (our modified file) ===")
try:
    with open(r"c:\Users\Guillermo\Downloads\Chatbots\WTC Agents.json", encoding="utf-8") as f:
        modified = json.load(f)
    
    for node in modified.get("nodes", []):
        ndata = node.get("data", {})
        nid = ndata.get("id", "")
        cred = ndata.get("credential", "NONE")
        if cred and cred != "NONE":
            print(f"  CRED: {nid} -> credential={cred}")
    
    print(f"  Nodes: {len(modified.get('nodes', []))}")
    print(f"  Edges: {len(modified.get('edges', []))}")
except Exception as e:
    print(f"  Error: {e}")
