"""Fix Sales Agent maxTokens: remove the 100 limit across all agents."""
import requests, json, time

URL = "https://ecoflow.koppi.mx"
KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
H = {"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}

SKIP_IDS = {
    "a2dbda66-1339-43ae-9c67-d97f30c198ac",
    "82ee9777-2d5f-49e9-9998-850eb5063928",
    "90b046f2-2b56-4ad1-9fc5-abcd229de895",
    "2bc49a0b-5459-4dab-b9a6-f4080c43371c",
}

resp = requests.get(f"{URL}/api/v1/chatflows", headers=H, timeout=30)
agentflows = [cf for cf in resp.json() if cf.get("type") == "AGENTFLOW" and cf["id"] not in SKIP_IDS]

fixed = []
had_issue = []

for cf in agentflows:
    cf_id = cf["id"]
    name = cf["name"]
    detail = requests.get(f"{URL}/api/v1/chatflows/{cf_id}", headers=H, timeout=30)
    flow = json.loads(detail.json()["flowData"])
    
    changed = False
    for node in flow["nodes"]:
        if node["data"]["name"] != "agentAgentflow":
            continue
        label = node["data"].get("label", "").lower()
        cfg = node["data"]["inputs"].get("agentModelConfig", {})
        max_tok = cfg.get("maxTokens", "")
        
        if max_tok and str(max_tok).strip():
            had_issue.append((name, label, max_tok))
            cfg["maxTokens"] = ""
            changed = True
    
    if changed:
        payload = {"flowData": json.dumps(flow, ensure_ascii=False)}
        push = requests.put(f"{URL}/api/v1/chatflows/{cf_id}", headers=H, json=payload, timeout=30)
        if push.status_code == 200:
            fixed.append(name)
            print(f"  ✅ {name}")
        else:
            print(f"  ❌ {name} — {push.status_code}")
        time.sleep(0.3)

print(f"\n{'='*60}")
print(f"Found maxTokens set on {len(had_issue)} agent nodes across {len(set(n for n,_,_ in had_issue))} chatflows:")
for name, label, val in had_issue:
    print(f"  {name} / {label} — was: {val}")
print(f"\nFixed: {len(fixed)} chatflows")
