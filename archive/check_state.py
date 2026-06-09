import requests, json

URL = "https://ecoflow.koppi.mx"
H = {"Authorization": "Bearer Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"}

# Check Hideaways current state
r = requests.get(f"{URL}/api/v1/chatflows/e23e1850-dd98-4f48-9fa8-4a8488497a4d", headers=H, timeout=30)
fd = json.loads(r.json()["flowData"])
for n in fd["nodes"]:
    if n["data"]["name"] == "conditionAgentAgentflow":
        print("=== SCENARIOS ===")
        for i, s in enumerate(n["data"]["inputs"]["conditionAgentScenarios"]):
            print(f"  {i}: {s['scenario'][:100]}")
        temp = n["data"]["inputs"]["conditionAgentModelConfig"]["temperature"]
        print(f"\n=== TEMPERATURE: {temp}")
        inst = n["data"]["inputs"]["conditionAgentInstructions"]
        print(f"\n=== INSTRUCTIONS LENGTH: {len(inst)} chars")
        print(f"\n=== FIRST 600 chars ===")
        print(inst[:600])
        print(f"\n=== LAST 600 chars ===")
        print(inst[-600:])
