import json

with open(r"c:\Users\Guillermo\Downloads\Chatbots\WTC Agents.json", encoding="utf-8") as f:
    data = json.load(f)

nodes = {n["data"]["id"]: n["data"].get("label", "") for n in data["nodes"]}
router = [n for n in data["nodes"] if "conditionAgent" in n["data"]["id"]][0]
scenarios = router["data"]["inputs"]["conditionAgentScenarios"]

print("=== Scenarios (0-indexed) ===")
for i, s in enumerate(scenarios):
    text = s["scenario"][:100]
    print(f"  [{i}] {text}")

print("\n=== Full Routing ===")
edges = [e for e in data["edges"] if "conditionAgentAgentflow_0-output-" in e.get("sourceHandle", "")]
edges.sort(key=lambda e: int(e["sourceHandle"].split("output-")[1]))
for e in edges:
    idx = e["sourceHandle"].split("output-")[1]
    target = e["target"]
    label = nodes.get(target, "?")
    print(f"  output-{idx} -> {target} ({label})")

print(f"\nJSON valid: OK")
print(f"Nodes: {len(data['nodes'])}, Edges: {len(data['edges'])}")

# Verify key expectations
assert scenarios[6]["scenario"].startswith("User asks about AVAILABLE"), f"Scenario 6 should be Available Spaces, got: {scenarios[6]['scenario'][:50]}"
assert scenarios[7]["scenario"].startswith("User asks something UNRELATED"), f"Scenario 7 should be Off-Topic, got: {scenarios[7]['scenario'][:50]}"

edge6 = [e for e in edges if e["sourceHandle"].endswith("output-6")][0]
edge7 = [e for e in edges if e["sourceHandle"].endswith("output-7")][0]
assert edge6["target"] == "agentAgentflow_7", f"output-6 should go to agentAgentflow_7, goes to {edge6['target']}"
assert edge7["target"] == "agentAgentflow_6", f"output-7 should go to agentAgentflow_6, goes to {edge7['target']}"

print("\nAll assertions passed!")
