"""Inspect Nativas: all agent nodes, their prompts, and structure."""
import requests, json

URL = "https://ecoflow.koppi.mx"
KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
H = {"Authorization": f"Bearer {KEY}"}
NATIVAS_ID = "9325bc13-9725-4215-8bfb-455cfa67f768"

resp = requests.get(f"{URL}/api/v1/chatflows/{NATIVAS_ID}", headers=H, timeout=30)
flow = json.loads(resp.json()["flowData"])

print("=== NODES ===")
for node in flow["nodes"]:
    ntype = node["data"]["name"]
    label = node["data"].get("label", "")
    nid = node["id"]
    print(f"\n{'='*60}")
    print(f"ID: {nid} | Type: {ntype} | Label: {label}")
    
    if ntype == "agentAgentflow":
        msgs = node["data"]["inputs"].get("agentMessages", [])
        tools = node["data"]["inputs"].get("agentTools", [])
        kb = node["data"]["inputs"].get("agentKnowledgeDocumentStores", [])
        model_cfg = node["data"]["inputs"].get("agentModelConfig", {})
        mem = node["data"]["inputs"].get("agentEnableMemory", False)
        mem_window = node["data"]["inputs"].get("agentMemoryWindowSize", "")
        
        print(f"  Model: {model_cfg.get('agentModel', '?')} / {model_cfg.get('modelName', '?')}")
        print(f"  Temperature: {model_cfg.get('temperature', '?')}")
        print(f"  Memory: {mem} (window: {mem_window})")
        print(f"  Tools: {len(tools)}")
        print(f"  Knowledge stores: {len(kb)}")
        for m in msgs:
            role = m.get("role", "?")
            content = m.get("content", "")
            print(f"  Message [{role}]: {len(content)} chars")
            print(f"  --- CONTENT START ---")
            print(content[:2000])
            if len(content) > 2000:
                print(f"  ... ({len(content)} total chars)")
            print(f"  --- CONTENT END ---")
    
    elif ntype == "conditionAgentAgentflow":
        scenarios = node["data"]["inputs"].get("conditionAgentScenarios", [])
        inst = node["data"]["inputs"].get("conditionAgentInstructions", "")
        print(f"  Scenarios: {len(scenarios)}")
        for i, s in enumerate(scenarios):
            print(f"    [{i}] {s.get('scenario', '')[:120]}")
        print(f"  Instructions: {len(inst)} chars")

print("\n\n=== EDGES ===")
for edge in flow["edges"]:
    print(f"  {edge['source']} --> {edge['target']}")
