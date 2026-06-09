"""
Explore all Flowise API endpoints on ecoflow.koppi.mx
"""
import requests
import json

URL = "https://ecoflow.koppi.mx"
KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
H = {"Authorization": f"Bearer {KEY}"}

# 1. List all chatflows
r = requests.get(f"{URL}/api/v1/chatflows", headers=H)
flows = r.json()
print(f"=== CHATFLOWS ({len(flows)}) ===")
for f in flows:
    name = f.get("name", "?")
    ftype = f.get("type", "?")
    deployed = f.get("deployed", "?")
    public = f.get("isPublic", "?")
    fid = f["id"][:12]
    print(f"  {fid}... | {name:40s} | type={ftype} | deployed={deployed} | public={public}")

# 2. List all tools
r2 = requests.get(f"{URL}/api/v1/tools", headers=H)
tools = r2.json()
print(f"\n=== TOOLS ({len(tools)}) ===")
for t in tools:
    tid = t["id"][:12]
    tname = t.get("name", "?")
    tdesc = t.get("description", "")[:60]
    print(f"  {tid}... | {tname:30s} | {tdesc}")

# 3. List all variables
r3 = requests.get(f"{URL}/api/v1/variables", headers=H)
vars_ = r3.json()
print(f"\n=== VARIABLES ({len(vars_)}) ===")
for v in vars_:
    vname = v.get("name", "?")
    vtype = v.get("type", "?")
    vval = str(v.get("value", ""))[:40]
    print(f"  {vname:20s} | type={vtype} | value={vval}")

# 4. List document stores
r4 = requests.get(f"{URL}/api/v1/document-store/store", headers=H)
stores = r4.json()
print(f"\n=== DOCUMENT STORES ({len(stores)}) ===")
for s in stores:
    sid = s["id"][:12]
    sname = s.get("name", "?")
    sstatus = s.get("status", "?")
    print(f"  {sid}... | {sname:30s} | status={sstatus}")

# 5. Ping
r5 = requests.get(f"{URL}/api/v1/ping", headers=H)
print(f"\n=== PING: {r5.text[:100]} ===")

# 6. List credentials
r6 = requests.get(f"{URL}/api/v1/credentials", headers=H)
if r6.status_code == 200:
    creds = r6.json()
    print(f"\n=== CREDENTIALS ({len(creds)}) ===")
    for c in creds:
        cid = c["id"][:12]
        cname = c.get("name", "?")
        ctype = c.get("credentialName", "?")
        print(f"  {cid}... | {cname:30s} | type={ctype}")
else:
    print(f"\n=== CREDENTIALS: {r6.status_code} ===")

# 7. Stats
r7 = requests.get(f"{URL}/api/v1/stats", headers=H)
if r7.status_code == 200:
    print(f"\n=== STATS: {json.dumps(r7.json())[:300]} ===")
else:
    print(f"\n=== STATS: {r7.status_code} ===")

# 8. Available nodes
r8 = requests.get(f"{URL}/api/v1/nodes", headers=H)
if r8.status_code == 200:
    nodes = r8.json()
    print(f"\n=== AVAILABLE NODES ({len(nodes)}) ===")
    categories = {}
    for n in nodes:
        cat = n.get("category", "unknown")
        categories[cat] = categories.get(cat, 0) + 1
    for cat, count in sorted(categories.items()):
        print(f"  {cat}: {count} nodes")
else:
    print(f"\n=== NODES: {r8.status_code} ===")

# 9. API Keys
r9 = requests.get(f"{URL}/api/v1/apikey", headers=H)
if r9.status_code == 200:
    keys = r9.json()
    print(f"\n=== API KEYS ({len(keys)}) ===")
    for k in keys:
        print(f"  {k.get('keyName','?'):20s} | id={k.get('id','?')[:12]}...")
else:
    print(f"\n=== API KEYS: {r9.status_code} ===")

# 10. Executions
r10 = requests.get(f"{URL}/api/v1/executions", headers=H)
if r10.status_code == 200:
    execs = r10.json()
    print(f"\n=== EXECUTIONS: {json.dumps(execs)[:300]} ===")
else:
    print(f"\n=== EXECUTIONS: {r10.status_code} ===")

# 11. Check chatbot config for Anahuac
anahuac_id = "4c84d4c6-2df9-4d60-ac7e-6c9a78608f1c"
r11 = requests.get(f"{URL}/api/v1/chatflows/{anahuac_id}", headers=H)
if r11.status_code == 200:
    cf = r11.json()
    print(f"\n=== ANAHUAC CHATFLOW DETAIL ===")
    print(f"  name: {cf.get('name')}")
    print(f"  type: {cf.get('type')}")
    print(f"  deployed: {cf.get('deployed')}")
    print(f"  isPublic: {cf.get('isPublic')}")
    print(f"  chatbotConfig: {str(cf.get('chatbotConfig',''))[:200]}")
    print(f"  apiConfig: {str(cf.get('apiConfig',''))[:200]}")
    print(f"  analytic: {str(cf.get('analytic',''))[:200]}")
    print(f"  speechToText: {str(cf.get('speechToText',''))[:100]}")
    print(f"  category: {cf.get('category')}")

# 12. Check streaming support
r12 = requests.get(f"{URL}/api/v1/chatflows-streaming/{anahuac_id}", headers=H)
print(f"\n=== STREAMING CHECK: {r12.status_code} - {r12.text[:100]} ===")

# 13. Version
r13 = requests.get(f"{URL}/api/v1/version", headers=H)
print(f"\n=== VERSION: {r13.text[:100]} ===")
