import json

# Read the WTC Agents JSON
with open(r"c:\Users\Guillermo\Downloads\Chatbots\WTC Agents.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Brevity instruction to inject into ALL agent system prompts
BREVITY_RULE = (
    "\n\n✂️ BREVITY RULE — MANDATORY:\n"
    "- Keep responses SHORT and DIRECT. Maximum 3-5 bullet points per answer.\n"
    "- Do NOT list every single detail. Give the MOST RELEVANT info first.\n"
    "- If there are many results (more than 3), show TOP 3 and say: '...y [X] opciones más. ¿Quieres ver más?'\n"
    "- NEVER repeat information the user already knows.\n"
    "- NEVER add long introductions or conclusions. Go straight to the answer.\n"
    "- Use SHORT bullet points, not full paragraphs.\n"
    "- ONE emoji per line maximum. Do not over-decorate.\n"
    "- If the answer is simple, respond in 1-2 lines. Not everything needs a formatted list."
)

BREVITY_HTML = (
    "<br><br><strong>✂️ BREVITY RULE — MANDATORY:</strong><br>"
    "- Keep responses SHORT and DIRECT. Maximum 3-5 bullet points per answer.<br>"
    "- Do NOT list every single detail. Give the MOST RELEVANT info first.<br>"
    "- If there are many results (more than 3), show TOP 3 and say: '...y [X] opciones más. ¿Quieres ver más?'<br>"
    "- NEVER repeat information the user already knows.<br>"
    "- NEVER add long introductions or conclusions. Go straight to the answer.<br>"
    "- Use SHORT bullet points, not full paragraphs.<br>"
    "- ONE emoji per line maximum. Do not over-decorate.<br>"
    "- If the answer is simple, respond in 1-2 lines. Not everything needs a formatted list."
)

modified = 0
for node in data["nodes"]:
    nid = node["id"]
    label = node["data"].get("label", "")
    
    # Skip start node and condition agent
    if "startAgentflow" in nid or "conditionAgent" in nid:
        continue
    
    messages = node["data"]["inputs"].get("agentMessages", [])
    if not messages:
        print(f"  SKIP {nid} ({label}) - no messages")
        continue
    
    for msg in messages:
        if msg.get("role") == "system":
            content = msg.get("content", "")
            
            # Check if already has brevity rule
            if "BREVITY RULE" in content:
                print(f"  SKIP {nid} ({label}) - already has brevity rule")
                continue
            
            # Content is HTML (wrapped in <p> tags)
            if "<p>" in content:
                # Insert before the closing </p> tag at the very end
                # Or append to the HTML content
                if content.rstrip().endswith("</p>"):
                    content = content.rstrip()[:-4] + BREVITY_HTML + "</p>"
                else:
                    content = content + BREVITY_HTML
            else:
                content = content + BREVITY_RULE
            
            msg["content"] = content
            modified += 1
            print(f"  MODIFIED {nid} ({label})")

print(f"\nTotal modified: {modified}")

# Write back
with open(r"c:\Users\Guillermo\Downloads\Chatbots\WTC Agents.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("File saved.")
