"""
Analyze all agent JSON files to extract project name, type, and context
from their system prompts and condition agent instructions.
"""
import json
import os
import re

CHATBOTS_DIR = r"c:\Users\Guillermo\Downloads\Chatbots"

def extract_project_info(filepath):
    """Extract project name, description, and topics from agent JSON."""
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    info = {
        "file": os.path.basename(filepath),
        "project_name": "",
        "system_prompt_excerpt": "",
        "scenarios": [],
        "has_offtopic": False,
        "num_scenarios": 0,
        "num_agents": 0,
        "agent_labels": [],
        "topics_mentioned": [],
    }
    
    for node in data.get("nodes", []):
        nd = node.get("data", {})
        
        # Count agents and get labels
        if nd.get("name") == "agentAgentflow":
            info["num_agents"] += 1
            info["agent_labels"].append(nd.get("label", ""))
        
        # Get condition agent info
        if nd.get("name") == "conditionAgentAgentflow":
            scenarios = nd.get("inputs", {}).get("conditionAgentScenarios", [])
            info["scenarios"] = [s.get("scenario", "") for s in scenarios]
            info["num_scenarios"] = len(scenarios)
            
            # Check if off-topic already exists
            for s in scenarios:
                sc = s.get("scenario", "").lower()
                if "off-topic" in sc or "unrelated" in sc or "fuera de tema" in sc:
                    info["has_offtopic"] = True
            
            # Get instructions
            instructions = nd.get("inputs", {}).get("conditionAgentInstructions", "")
            info["condition_instructions"] = instructions[:300]
        
        # Get Q&A agent system prompt (first agent, usually the main one)
        if nd.get("name") == "agentAgentflow":
            messages = nd.get("inputs", {}).get("agentMessages", [])
            for msg in messages:
                if msg.get("role") == "system" and msg.get("content"):
                    content = msg["content"]
                    # Strip HTML
                    clean = re.sub(r'<[^>]+>', ' ', content)
                    clean = re.sub(r'\s+', ' ', clean).strip()
                    
                    # Extract project description from first 300 chars
                    if not info["system_prompt_excerpt"]:
                        info["system_prompt_excerpt"] = clean[:400]
                    
                    # Try to extract project name
                    if not info["project_name"]:
                        # Look for "advisor for X" or "asesor de X" patterns
                        m = re.search(r'(?:advisor|assistant|asesor|asistente)\s+(?:for|de|del|para)\s+([^.]+?)(?:\.|Your|Tu|CRITICAL|REGLA)', clean, re.IGNORECASE)
                        if m:
                            info["project_name"] = m.group(1).strip()
                        else:
                            # Try "agent for X"
                            m = re.search(r'(?:agent|agente)\s+(?:for|de|del|para)\s+([^.]+?)(?:\.|Your|Tu|CRITICAL|REGLA)', clean, re.IGNORECASE)
                            if m:
                                info["project_name"] = m.group(1).strip()
                    
                    # Extract topics/keywords
                    keywords = re.findall(r'(?:hotel|casa|terreno|lote|departamento|apartment|condo|villa|residencia|oficina|office|comercial|commercial|shopping|tienda|restaurante|torre|tower|playa|beach|luxury|lujo|resort|fraccionamiento|desarrollo|development|industrial|bodega|warehouse|parque industrial)', clean, re.IGNORECASE)
                    info["topics_mentioned"].extend(keywords)
    
    info["topics_mentioned"] = list(set([t.lower() for t in info["topics_mentioned"]]))
    
    return info


def main():
    files = sorted([f for f in os.listdir(CHATBOTS_DIR) if f.endswith(".json") and "Agents" in f])
    
    print(f"Found {len(files)} agent files\n")
    print("=" * 120)
    
    results = []
    for f in files:
        path = os.path.join(CHATBOTS_DIR, f)
        try:
            info = extract_project_info(path)
            results.append(info)
        except Exception as e:
            print(f"❌ Error reading {f}: {e}")
    
    # Print summary table
    print(f"{'#':<3} {'File':<45} {'Project':<30} {'Scenarios':<5} {'OT?':<5} {'Topics'}")
    print("-" * 140)
    
    for i, r in enumerate(results, 1):
        ot = "✅" if r["has_offtopic"] else "❌"
        topics = ", ".join(r["topics_mentioned"][:5]) if r["topics_mentioned"] else "?"
        print(f"{i:<3} {r['file']:<45} {r['project_name'][:28]:<30} {r['num_scenarios']:<5} {ot:<5} {topics}")
    
    # Print detailed info for each
    print("\n\n" + "=" * 120)
    print("DETAILED PROJECT INFO")
    print("=" * 120)
    
    for i, r in enumerate(results, 1):
        print(f"\n{'─' * 100}")
        print(f"#{i} {r['file']}")
        print(f"  Project: {r['project_name']}")
        print(f"  Agent labels: {', '.join(r['agent_labels'])}")
        print(f"  Scenarios ({r['num_scenarios']}): {r['scenarios']}")
        print(f"  Has Off-Topic: {r['has_offtopic']}")
        print(f"  Topics detected: {r['topics_mentioned']}")
        print(f"  System prompt: {r['system_prompt_excerpt'][:250]}...")


if __name__ == "__main__":
    main()
