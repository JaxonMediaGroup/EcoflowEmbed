import json
import sys

def show_agent(path, label, node_idx=1):
    print(f"\n{'='*70}\n{label}\n{'='*70}")
    with open(path, encoding="utf-8") as f:
        d = json.load(f)
    node = d["nodes"][node_idx]
    inputs = node["data"]["inputs"]
    cfg = inputs.get("agentModelConfig", {})
    print(f"label: {node['data'].get('label')}")
    print(f"model: {cfg.get('modelName')}")
    print(f"temperature: {cfg.get('temperature')}")
    print(f"topP: {cfg.get('topP')}")
    print(f"memoryType: {inputs.get('agentMemoryType')}")
    print(f"tools count: {len(inputs.get('agentTools', []) or [])}")
    print(f"system messages: {len(inputs.get('agentMessages', []) or [])}")
    msgs = inputs.get("agentMessages", []) or []
    for i, m in enumerate(msgs):
        if m.get("role") == "system":
            print(f"\n--- SYSTEM MSG {i+1} ---")
            print(m["content"])

show_agent(
    r"C:\Users\Guillermo\Downloads\Chatbots\projects\Terralago Agents.json",
    "TERRALAGO (problematico)",
    node_idx=1,
)
show_agent(
    r"C:\Users\Guillermo\Downloads\Chatbots\projects\WTC Agents.json",
    "WTC nodo 0 (sano)",
    node_idx=1,
)
