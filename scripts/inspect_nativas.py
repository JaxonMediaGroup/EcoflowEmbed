import json

with open(r"C:\Users\Guillermo\Downloads\Chatbots\projects\Nativas Agents.json", encoding="utf-8") as f:
    d = json.load(f)

node = d["nodes"][1]  # Nativas Multilingual Q&A
print("LABEL:", node["data"]["label"])
print("TEMP:", node["data"]["inputs"]["agentModelConfig"].get("temperature"))
print("TOOLS:", len(node["data"]["inputs"].get("agentTools", []) or []))
for i, m in enumerate(node["data"]["inputs"]["agentMessages"]):
    role = m["role"]
    content = m["content"]
    print("\n" + "=" * 70)
    print(f"SYSTEM MSG {i+1} | role={role} | chars={len(content)}")
    print("=" * 70)
    print(content)
