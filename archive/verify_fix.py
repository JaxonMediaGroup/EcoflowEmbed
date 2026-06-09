import json

with open(r"c:\Users\Guillermo\Downloads\Chatbots\WTC Agents.json", encoding="utf-8") as f:
    data = json.load(f)

for node in data["nodes"]:
    if node["data"].get("name") == "conditionAgentAgentflow":
        scenarios = node["data"]["inputs"]["conditionAgentScenarios"]
        for i, s in enumerate(scenarios):
            text = s["scenario"][:90]
            print(f"[{i}] {text}")
        break

# Check agent 7 inputParams
for node in data["nodes"]:
    if node["data"].get("id") == "agentAgentflow_7":
        params = node["data"].get("inputParams", [])
        names = [p["name"] for p in params]
        print(f"\nAgent 7 inputParams count: {len(params)}")
        
        # Check tools array schema
        for p in params:
            if p["name"] == "agentTools":
                arr_names = [a.get("name") for a in p.get("array", [])]
                has_config = "agentSelectedToolConfig" in arr_names
                print(f"Has agentSelectedToolConfig in tools schema: {has_config}")
                print(f"Tools array fields: {arr_names}")
                break
        
        print(f"Has agentToolsBuiltInGemini: {'agentToolsBuiltInGemini' in names}")
        print(f"Has agentToolsBuiltInAnthropic: {'agentToolsBuiltInAnthropic' in names}")
        print(f"Has agentMemoryMaxTokenLimit: {'agentMemoryMaxTokenLimit' in names}")
        break

print(f"\nJSON valid: OK | nodes={len(data['nodes'])} | edges={len(data['edges'])}")
