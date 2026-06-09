import json

with open(r"c:\Users\Guillermo\Downloads\WTC Agents.json", "r", encoding="utf-8") as f:
    data = json.load(f)

SCOPE_TEMPLATE = """

🚫 SCOPE LIMITATION - CRITICAL RULE:
- You ONLY answer questions related to {domain}
- If the user asks ANYTHING unrelated to WTC (homework, coding, math, recipes, personal advice, general knowledge, jokes, translations, etc.), respond ONLY with:
'🏢 Soy el asistente virtual del World Trade Center Ciudad de México. Solo puedo ayudarte con información sobre el WTC CDMX: ubicación, servicios, directorio, estacionamiento, eventos y reglamentos. ¿En qué puedo ayudarte sobre el WTC?'
- NEVER act as a general-purpose chatbot or personal assistant
- If someone says just 'Hola' or greets you, respond with a WTC-focused welcome message listing what you can help with"""

# Agent configs: (agent_id, domain description, check_web_search)
agents_to_fix = [
    ("agentAgentflow_1", "professional services at or near WTC CDMX", True),
    ("agentAgentflow_3", "ACCESS AND EXIT regulations at WTC CDMX", False),
    ("agentAgentflow_4", "REMODELING AND CONSTRUCTION regulations at WTC CDMX", False),
    ("agentAgentflow_5", "PARKING at WTC CDMX", False),
]

fixed = 0
for node in data["nodes"]:
    node_id = node["id"]
    for agent_id, domain, has_web in agents_to_fix:
        if node_id == agent_id:
            msgs = node["data"]["inputs"]["agentMessages"]
            for msg in msgs:
                if msg["role"] == "system":
                    content = msg["content"]
                    # Check if already has SCOPE LIMITATION
                    if "SCOPE LIMITATION" in content:
                        print(f"  {agent_id}: Already has SCOPE LIMITATION, skipping")
                        continue
                    
                    # Insert before the FORBIDDEN PHRASES section
                    marker = "</p><p><strong>⛔ STRICTLY FORBIDDEN PHRASES"
                    if marker in content:
                        scope_rule = SCOPE_TEMPLATE.format(domain=domain)
                        if has_web:
                            scope_rule += "\n- NEVER use web search to answer questions unrelated to WTC"
                        content = content.replace(
                            marker,
                            scope_rule + marker
                        )
                        msg["content"] = content
                        fixed += 1
                        print(f"  ✅ {agent_id}: Added SCOPE LIMITATION ({domain})")
                    else:
                        print(f"  ❌ {agent_id}: Could not find FORBIDDEN PHRASES marker!")

print(f"\nFixed {fixed} agents")

# Save
with open(r"c:\Users\Guillermo\Downloads\WTC Agents.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("File saved successfully!")

# Verify
with open(r"c:\Users\Guillermo\Downloads\WTC Agents.json", "r", encoding="utf-8") as f:
    data2 = json.load(f)

scope_count = 0
for node in data2["nodes"]:
    if node["data"]["type"] == "Agent":
        msgs = node["data"]["inputs"].get("agentMessages", [])
        for msg in msgs:
            if msg["role"] == "system" and "SCOPE LIMITATION" in msg["content"]:
                scope_count += 1
                print(f"  ✅ {node['id']}: Has SCOPE LIMITATION")

print(f"\nTotal agents with SCOPE LIMITATION: {scope_count}/7")
