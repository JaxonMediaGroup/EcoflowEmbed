"""Check if all Q&A agents have the 'no document mention' rule."""
import requests, json

URL = "https://ecoflow.koppi.mx"
KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
H = {"Authorization": f"Bearer {KEY}"}

SKIP_IDS = {
    "a2dbda66-1339-43ae-9c67-d97f30c198ac",  # WTC
    "82ee9777-2d5f-49e9-9998-850eb5063928",  # ALE
    "90b046f2-2b56-4ad1-9fc5-abcd229de895",  # koppi
    "2bc49a0b-5459-4dab-b9a6-f4080c43371c",  # KIO
}

# Phrases to check for
BAD_PHRASES = ["documento", "document", "fuente de datos", "data source", "source file"]
GOOD_PHRASES = ["nunca menciones", "never mention", "never say", "prohibid", "forbidden", "no menciones"]

resp = requests.get(f"{URL}/api/v1/chatflows", headers=H, timeout=30)
agentflows = [cf for cf in resp.json() if cf.get("type") == "AGENTFLOW" and cf["id"] not in SKIP_IDS]

has_rule = []
missing_rule = []
no_qa = []

for cf in agentflows:
    name = cf["name"]
    detail = requests.get(f"{URL}/api/v1/chatflows/{cf['id']}", headers=H, timeout=30)
    flow = json.loads(detail.json()["flowData"])
    
    # Find Q&A / main agent (not Sales, not Off-Topic Guard)
    qa_node = None
    for node in flow["nodes"]:
        if node["data"]["name"] != "agentAgentflow":
            continue
        label = node["data"].get("label", "").lower()
        if "sales" in label or "off-topic" in label or "guard" in label or "contacto" in label:
            continue
        # This is likely the Q&A / main agent
        qa_node = node
        break
    
    if not qa_node:
        no_qa.append(name)
        continue
    
    msgs = qa_node["data"]["inputs"].get("agentMessages", [])
    prompt = msgs[0].get("content", "") if msgs else ""
    prompt_lower = prompt.lower()
    
    has_good = any(g in prompt_lower for g in GOOD_PHRASES)
    
    if has_good:
        has_rule.append(name)
    else:
        # Check if it mentions document at all
        mentions_doc = any(b in prompt_lower for b in BAD_PHRASES)
        missing_rule.append((name, mentions_doc, len(prompt)))

print(f"✅ HAVE the 'no document' rule ({len(has_rule)}):")
for n in has_rule:
    print(f"   ✓ {n}")

print(f"\n⚠️  MISSING the rule ({len(missing_rule)}):")
for n, has_doc_ref, plen in missing_rule:
    flag = "⚠️ mentions doc!" if has_doc_ref else ""
    print(f"   ✗ {n} ({plen} chars) {flag}")

print(f"\n🔍 No Q&A agent found ({len(no_qa)}):")
for n in no_qa:
    print(f"   ? {n}")
