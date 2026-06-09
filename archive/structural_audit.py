"""
Deep structural analysis: Compare all agents against GGI Agwa Bosques structure.
Check for routing conflicts, missing nodes, and structural issues.
"""
import requests, json, sys

URL = "https://ecoflow.koppi.mx"
KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
H = {"Authorization": f"Bearer {KEY}"}

SKIP_IDS = {
    "a2dbda66-1339-43ae-9c67-d97f30c198ac",
    "82ee9777-2d5f-49e9-9998-850eb5063928",
    "90b046f2-2b56-4ad1-9fc5-abcd229de895",
    "2bc49a0b-5459-4dab-b9a6-f4080c43371c",
}

resp = requests.get(f"{URL}/api/v1/chatflows", headers=H, timeout=30)
agentflows = [cf for cf in resp.json() if cf.get("type") == "AGENTFLOW" and cf["id"] not in SKIP_IDS]

print(f"Analyzing {len(agentflows)} agents...\n")

# Reference structure (Agwa Bosques):
# Start → Condition Agent (3 scenarios: General, Contact, Off-Topic)
#   → 0: Q&A Agent (has tools, has knowledge or tools)
#   → 1: Sales Agent (has tools for saving data)
#   → 2: Off-Topic Guard (no tools, temp 0)

issues_report = []

for cf in agentflows:
    cf_id = cf["id"]
    name = cf["name"]
    detail = requests.get(f"{URL}/api/v1/chatflows/{cf_id}", headers=H, timeout=30)
    flow = json.loads(detail.json()["flowData"])
    
    nodes = flow["nodes"]
    edges = flow["edges"]
    
    # Classify nodes
    start_nodes = []
    condition_nodes = []
    agent_nodes = []
    other_nodes = []
    
    for node in nodes:
        ntype = node["data"]["name"]
        if ntype == "startAgentflow":
            start_nodes.append(node)
        elif ntype == "conditionAgentAgentflow":
            condition_nodes.append(node)
        elif ntype == "agentAgentflow":
            agent_nodes.append(node)
        else:
            other_nodes.append(node)
    
    issues = []
    info = []
    
    # Basic structure check
    info.append(f"Nodes: {len(start_nodes)} start, {len(condition_nodes)} condition, {len(agent_nodes)} agents, {len(other_nodes)} other")
    
    if len(condition_nodes) == 0:
        issues.append("❌ NO CONDITION AGENT — no routing, all goes to one agent")
    
    if len(condition_nodes) > 1:
        issues.append(f"⚠️ Multiple condition agents ({len(condition_nodes)})")
    
    # Analyze condition agent scenarios
    for cond in condition_nodes:
        scenarios = cond["data"]["inputs"].get("conditionAgentScenarios", [])
        info.append(f"Scenarios: {len(scenarios)}")
        
        has_general = False
        has_contact = False
        has_offtopic = False
        
        for i, s in enumerate(scenarios):
            sc = s.get("scenario", "").lower()
            if "general" in sc or "question" in sc or "inquiry" in sc:
                has_general = True
            if "contact" in sc or "appointment" in sc or "datos" in sc:
                has_contact = True
            if "off-topic" in sc or "unrelated" in sc or "impossible" in sc:
                has_offtopic = True
        
        if not has_general:
            issues.append("⚠️ No 'general question' scenario detected")
        if not has_contact:
            issues.append("🔴 NO CONTACT SCENARIO — user data (name/email/phone) won't route to Sales Agent!")
        if not has_offtopic:
            issues.append("⚠️ No off-topic scenario")
        
        # Check condition agent instructions for contact routing clarity
        inst = cond["data"]["inputs"].get("conditionAgentInstructions", "").lower()
        if "contact" not in inst and "contacto" not in inst and "appointment" not in inst and "cita" not in inst:
            issues.append("⚠️ Condition instructions don't mention contact/appointment routing")
        
        # Check: does the condition instruction clarify that name/email/phone = contact?
        if "name, email" not in inst and "nombre, email" not in inst and "personal data" not in inst and "datos personales" not in inst:
            issues.append("⚠️ Instructions may not clearly define that raw contact data = route to Sales")
    
    # Analyze agent nodes
    qa_agents = []
    sales_agents = []
    guard_agents = []
    unknown_agents = []
    
    for agent in agent_nodes:
        label = agent["data"].get("label", "").lower()
        tools = agent["data"]["inputs"].get("agentTools", [])
        cfg = agent["data"]["inputs"].get("agentModelConfig", {})
        temp = cfg.get("temperature", "?")
        max_tok = cfg.get("maxTokens", "")
        msgs = agent["data"]["inputs"].get("agentMessages", [])
        prompt_len = len(msgs[0].get("content", "")) if msgs else 0
        
        if "off-topic" in label or "guard" in label:
            guard_agents.append(agent)
            if len(tools) > 0:
                issues.append(f"⚠️ Guard has {len(tools)} tools (should have 0)")
            if str(temp) != "0":
                issues.append(f"⚠️ Guard temp={temp} (should be 0)")
        elif "sales" in label or "contacto" in label or "lead" in label:
            sales_agents.append(agent)
            if len(tools) == 0:
                issues.append("⚠️ Sales Agent has NO tools (can't save to Google Sheets)")
            if max_tok and str(max_tok).strip():
                issues.append(f"⚠️ Sales Agent maxTokens={max_tok} (should be empty)")
        else:
            qa_agents.append(agent)
            if prompt_len < 500:
                issues.append(f"⚠️ Q&A Agent prompt very short ({prompt_len} chars)")
    
    if len(qa_agents) == 0 and len(agent_nodes) > 0:
        issues.append("⚠️ No clear Q&A agent identified")
    
    # Check edges: does condition agent connect to all agent types?
    if condition_nodes:
        cond_id = condition_nodes[0]["id"]
        cond_targets = set()
        for edge in edges:
            if edge["source"] == cond_id:
                cond_targets.add(edge["target"])
        
        qa_connected = any(a["id"] in cond_targets for a in qa_agents)
        sales_connected = any(a["id"] in cond_targets for a in sales_agents)
        guard_connected = any(a["id"] in cond_targets for a in guard_agents)
        
        if not qa_connected and qa_agents:
            issues.append("🔴 Q&A Agent NOT connected to condition agent!")
        if not sales_connected and sales_agents:
            issues.append("🔴 Sales Agent NOT connected to condition agent!")
        if not guard_connected and guard_agents:
            issues.append("🔴 Guard NOT connected to condition agent!")
    
    # Check: is start → condition agent?
    if start_nodes and condition_nodes:
        start_id = start_nodes[0]["id"]
        start_targets = [e["target"] for e in edges if e["source"] == start_id]
        if condition_nodes[0]["id"] not in start_targets:
            issues.append("🔴 Start does NOT connect to condition agent!")
    
    # Check for the specific conflict: name/phone without "quiero contactar"
    # This happens when contact scenario description is narrow
    if condition_nodes:
        for s in condition_nodes[0]["data"]["inputs"].get("conditionAgentScenarios", []):
            sc = s.get("scenario", "").lower()
            if "contact" in sc or "appointment" in sc:
                # Check if it's too narrow (requires explicit request)
                if "providing" in sc and "request" not in sc:
                    pass  # Standard pattern, should work
    
    # Compile report
    agent_summary = f"Q&A:{len(qa_agents)} Sales:{len(sales_agents)} Guard:{len(guard_agents)}"
    if unknown_agents:
        agent_summary += f" Unknown:{len(unknown_agents)}"
    
    status = "✅" if not issues else ("🔴" if any("🔴" in i for i in issues) else "⚠️")
    
    issues_report.append({
        "name": name,
        "status": status,
        "agents": agent_summary,
        "scenarios": len(condition_nodes[0]["data"]["inputs"].get("conditionAgentScenarios", [])) if condition_nodes else 0,
        "issues": issues,
        "info": info,
    })

# Print report
print("=" * 80)
print("STRUCTURAL ANALYSIS REPORT")
print("=" * 80)

# Group by status
for status_filter, header in [("🔴", "CRITICAL ISSUES"), ("⚠️", "WARNINGS"), ("✅", "GOOD")]:
    group = [r for r in issues_report if r["status"] == status_filter]
    if not group:
        continue
    print(f"\n{'─'*80}")
    print(f"{status_filter} {header} ({len(group)} agents)")
    print(f"{'─'*80}")
    for r in group:
        print(f"\n  {r['status']} {r['name']}")
        print(f"     Agents: {r['agents']} | Scenarios: {r['scenarios']}")
        for issue in r["issues"]:
            print(f"     {issue}")

print(f"\n{'='*80}")
print(f"SUMMARY: {sum(1 for r in issues_report if r['status']=='✅')} good, "
      f"{sum(1 for r in issues_report if r['status']=='⚠️')} warnings, "
      f"{sum(1 for r in issues_report if r['status']=='🔴')} critical")
