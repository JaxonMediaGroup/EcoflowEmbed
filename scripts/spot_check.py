"""Spot-check which markers the audit caught in Torre Zero Providencia."""
import json

with open(r"C:\Users\Guillermo\Downloads\Chatbots\projects\Torre Zero Providencia Agents.json", encoding="utf-8") as f:
    d = json.load(f)

for n in d["nodes"]:
    if n["data"].get("type") != "Agent":
        continue
    label = n["data"].get("label", "?")
    if "guard" in label.lower() or "off-topic" in label.lower():
        continue
    msgs = n["data"]["inputs"].get("agentMessages", [])
    for i, m in enumerate(msgs):
        if m.get("role") != "system":
            continue
        content = m["content"]
        print(f"=== {label} - SYSTEM MSG {i+1} (len={len(content)}) ===")
        for marker in [
            "no inventes", "no inventar", "no inferir", "información pendiente",
            "ANTI-ALUCINACIÓN", "ANTI-INFERENCIA", "fuente única", "do not invent",
            "manejo de incertidumbre", "prohibición de promesas",
        ]:
            if marker.lower() in content.lower():
                idx = content.lower().find(marker.lower())
                start = max(0, idx - 80)
                end = min(len(content), idx + 250)
                print(f'  HIT: "{marker}"')
                print(f"    ...{content[start:end]}...")
                print()
