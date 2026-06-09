"""Inspect GGI Agwa Bosques: all agent nodes and prompts."""
import requests, json

URL = "https://ecoflow.koppi.mx"
KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
H = {"Authorization": f"Bearer {KEY}"}

resp = requests.get(f"{URL}/api/v1/chatflows", headers=H, timeout=30)
for cf in resp.json():
    if cf["name"] == "GGI Agwa Bosques":
        cf_id = cf["id"]
        print(f"ID: {cf_id}")
        detail = requests.get(f"{URL}/api/v1/chatflows/{cf_id}", headers=H, timeout=30)
        flow = json.loads(detail.json()["flowData"])
        for node in flow["nodes"]:
            ntype = node["data"]["name"]
            label = node["data"].get("label", "")
            nid = node["id"]
            print(f"\n{'='*60}")
            print(f"ID: {nid} | Type: {ntype} | Label: {label}")
            if ntype == "agentAgentflow":
                msgs = node["data"]["inputs"].get("agentMessages", [])
                tools = node["data"]["inputs"].get("agentTools", [])
                model_cfg = node["data"]["inputs"].get("agentModelConfig", {})
                print(f"  Model: {model_cfg.get('modelName', '?')} temp: {model_cfg.get('temperature', '?')}")
                print(f"  Tools: {len(tools)}")
                for m in msgs:
                    print(f"  [{m.get('role','')}] ({len(m.get('content',''))} chars):")
                    print(m.get("content", ""))
                    print("---END---")
            elif ntype == "conditionAgentAgentflow":
                scenarios = node["data"]["inputs"].get("conditionAgentScenarios", [])
                print(f"  Scenarios: {len(scenarios)}")
                for i, s in enumerate(scenarios):
                    print(f"    [{i}] {s.get('scenario','')[:120]}")
        break
