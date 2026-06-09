import json

with open(r"c:\Users\Guillermo\Downloads\WTC Agents.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"Nodes: {len(data['nodes'])}")
print(f"Edges: {len(data['edges'])}")
print("\nNode labels:")
for n in data["nodes"]:
    label = n["data"]["label"]
    ntype = n["data"]["type"]
    nid = n["id"]
    print(f"  [{nid}] {ntype}: {label}")

print("\nEdge routing:")
for e in data["edges"]:
    src = e["sourceHandle"].split("-output-")[-1] if "-output-" in e["sourceHandle"] else "start"
    tgt = e["target"]
    lbl = e["data"].get("edgeLabel", "")
    print(f"  output {lbl} -> {tgt}")

# Check scenarios count
for n in data["nodes"]:
    if n["data"]["type"] == "ConditionAgent":
        scenarios = n["data"]["inputs"]["conditionAgentScenarios"]
        outputs = n["data"]["outputAnchors"]
        print(f"\nRouter scenarios: {len(scenarios)}")
        print(f"Router outputs: {len(outputs)}")
        for i, s in enumerate(scenarios):
            print(f"  {i}: {s['scenario'][:80]}...")

print("\nJSON is valid!")
