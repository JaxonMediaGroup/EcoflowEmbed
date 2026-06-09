"""Inspect all target agents to extract per-project personalization data."""
import json
import re
from pathlib import Path

PROJECTS_DIR = Path(r"C:\Users\Guillermo\Downloads\Chatbots\projects")

TARGETS = [
    "Brisas Ixtapa Agents.json",
    "Anahuac Orientador Vocacional Agents.json",
    "NIZUC Agents.json",
    "Quvira Showrom Agents.json",
    "Ribra - Arcos Bosques Agents.json",
    "SLS - Residences, yacht & sail club Agents.json",
    # also peek Terralago for sanity
    "Terralago Agents.json",
]


def find_main_qa_agent(nodes):
    """Return the first Agent node that is not an off-topic guard or classifier."""
    for n in nodes:
        if n["data"].get("type") == "Agent":
            label = n["data"].get("label", "")
            if "guard" in label.lower() or "off-topic" in label.lower():
                continue
            if "sales" in label.lower() and "agent" in label.lower():
                continue
            return n
    return None


def extract_contact(system_text):
    """Try to extract phone, email, web from a system prompt."""
    if not system_text:
        return {}
    phone = re.findall(r"(\+?\d[\d\s\-]{7,}\d)", system_text)
    email = re.findall(r"[\w.+-]+@[\w-]+\.[\w.-]+", system_text)
    web = re.findall(r"https?://[^\s<>'\"]+", system_text)
    return {
        "phones": list(set(p.strip() for p in phone))[:5],
        "emails": list(set(email))[:5],
        "urls": list(set(web))[:8],
    }


for fname in TARGETS:
    path = PROJECTS_DIR / fname
    if not path.exists():
        print(f"\n[!!] MISSING: {fname}")
        continue
    print("\n" + "=" * 78)
    print(f"FILE: {fname}")
    print("=" * 78)
    with open(path, encoding="utf-8") as f:
        d = json.load(f)

    print(f"nodes: {len(d['nodes'])}, edges: {len(d['edges'])}")
    for n in d["nodes"]:
        nid = n["id"]
        label = n["data"].get("label", "?")
        typ = n["data"].get("type", "?")
        inputs = n["data"].get("inputs", {}) or {}
        cfg = inputs.get("agentModelConfig", {}) or inputs.get("conditionAgentModelConfig", {}) or {}
        model = cfg.get("modelName", "?")
        temp = cfg.get("temperature", "?")
        tools = inputs.get("agentTools", []) or []
        tool_names = []
        for t in tools:
            cfg2 = t.get("agentSelectedToolConfig", {}) or {}
            name = cfg2.get("requestsGetName") or t.get("agentSelectedTool", "?")
            tool_names.append(name)
        print(f"  {nid:35s} | {typ:18s} | label={label!r:55s} | m={model} t={temp} | tools={tool_names}")

    qa = find_main_qa_agent(d["nodes"])
    if qa is None:
        print("  [no Q&A agent found]")
        continue
    msgs = qa["data"]["inputs"].get("agentMessages", []) or []
    full_text = "\n".join(m.get("content", "") for m in msgs)
    print(f"\n  --- Q&A system prompt length: {len(full_text)} chars, {len(msgs)} msgs")
    print(f"  --- Contact hints: {extract_contact(full_text)}")
    # show first ~400 chars of first system message
    for i, m in enumerate(msgs):
        if m.get("role") == "system":
            print(f"\n  --- SYS MSG {i+1} (first 600 chars) ---")
            print(m["content"][:600].replace("\n", " "))
            break
    # show info_get tool description if any
    for t in tools:
        cfg2 = t.get("agentSelectedToolConfig", {}) or {}
        if "info_get" in (cfg2.get("requestsGetName") or "").lower() or "info" in (cfg2.get("requestsGetName") or "").lower():
            print(f"\n  --- info_get URL: {cfg2.get('requestsGetUrl', '?')[:200]}")
            print(f"  --- info_get desc: {cfg2.get('requestsGetDescription', '?')[:200]}")
