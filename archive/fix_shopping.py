import json

with open(r"c:\Users\Guillermo\Downloads\WTC Agents.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for node in data["nodes"]:
    if node["id"] == "agentAgentflow_2":
        # 1. Fix temperature: 0.1 is too conservative for tool-using agent, set to 0.4
        config = node["data"]["inputs"]["agentModelConfig"]
        old_temp = config["temperature"]
        config["temperature"] = "0.4"
        print(f"  ✅ Temperature: {old_temp} → 0.4")

        # 2. Fix the system prompt - strengthen tool usage instruction and clarify scope
        msgs = node["data"]["inputs"]["agentMessages"]
        for msg in msgs:
            if msg["role"] == "system":
                content = msg["content"]
                
                # a) Add MANDATORY tool usage rule before the SCOPE LIMITATION
                old_scope = "🚫 SCOPE LIMITATION - CRITICAL RULE:\n- You ONLY answer questions related to the World Trade Center Mexico City (WTC CDMX) shopping center and nearby commercial options"
                new_scope = """⚠️ MANDATORY TOOL USAGE - CRITICAL:
- You MUST ALWAYS use the Directorio_Centro_Comercial tool BEFORE answering ANY question about food, restaurants, stores, banks, pharmacies, or any commercial service
- NEVER give a generic or vague answer without first searching the directory
- Questions about food, hamburgers, pizza, coffee, tacos, sushi, etc. are VALID — search the directory for restaurants with that type of food
- If the user asks "quiero hamburguesa", "dónde como", "hay restaurantes", etc., ALWAYS search the directory FIRST and show specific results with names, levels, and locations

🚫 SCOPE LIMITATION - CRITICAL RULE:
- You ONLY answer questions related to the World Trade Center Mexico City (WTC CDMX) shopping center and nearby commercial options
- Questions about food, restaurants, shopping, banks, etc. at or near WTC are ALWAYS valid — answer them using the directory"""
                
                if old_scope in content:
                    content = content.replace(old_scope, new_scope)
                    print("  ✅ Added MANDATORY TOOL USAGE rule + clarified food scope")
                else:
                    print("  ❌ Could not find SCOPE LIMITATION marker!")
                
                # b) Remove "recipes" from the off-topic examples (could confuse food queries)
                old_offtopic = "homework, coding, math, recipes, personal advice, general knowledge, jokes, etc."
                new_offtopic = "homework, coding, math, personal advice, general knowledge, jokes, translations, etc."
                if old_offtopic in content:
                    content = content.replace(old_offtopic, new_offtopic)
                    print("  ✅ Removed 'recipes' from off-topic examples (avoids confusion with food queries)")
                
                msg["content"] = content
        break

# Also fix Agent 0 (Info General) - remove "recipes" from off-topic list to avoid food confusion
for node in data["nodes"]:
    if node["id"] == "agentAgentflow_0":
        msgs = node["data"]["inputs"]["agentMessages"]
        for msg in msgs:
            if msg["role"] == "system":
                content = msg["content"]
                old_offtopic = "homework, coding, math, recipes, personal advice, general knowledge, jokes, translations, etc."
                new_offtopic = "homework, coding, math, personal advice, general knowledge, jokes, translations, etc."
                if old_offtopic in content:
                    content = content.replace(old_offtopic, new_offtopic)
                    msg["content"] = content
                    print("  ✅ Agent 0 (Info General): Removed 'recipes' from off-topic list")
        break

with open(r"c:\Users\Guillermo\Downloads\WTC Agents.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("\n  File saved!")

# Verify
with open(r"c:\Users\Guillermo\Downloads\WTC Agents.json", "r", encoding="utf-8") as f:
    data2 = json.load(f)

for node in data2["nodes"]:
    if node["id"] == "agentAgentflow_2":
        t = node["data"]["inputs"]["agentModelConfig"]["temperature"]
        content = node["data"]["inputs"]["agentMessages"][0]["content"]
        has_mandatory = "MANDATORY TOOL USAGE" in content
        has_recipes = "recipes" in content.split("SCOPE LIMITATION")[1] if "SCOPE LIMITATION" in content else False
        print(f"\n  Shopping Center agent:")
        print(f"    Temperature: {t}")
        print(f"    MANDATORY TOOL USAGE rule: {'✅' if has_mandatory else '❌'}")
        print(f"    'recipes' in off-topic: {'⚠️ YES' if has_recipes else '✅ removed'}")

print("\n  JSON valid! ✅")
