"""Verify patched files: valid JSON, correct architecture, personalization present."""
import json
import re
import sys
from pathlib import Path

PROJECTS_DIR = Path(r"C:\Users\Guillermo\Downloads\Chatbots\projects")

FILES = [
    "Brisas Ixtapa Agents.json",
    "Anahuac Orientador Vocacional Agents.json",
    "NIZUC Agents.json",
    "Quvira Showrom Agents.json",
    "Ribra - Arcos Bosques Agents.json",
    "SLS - Residences, yacht & sail club Agents.json",
    "Terralago Agents.json",
]

# Personalization markers we expect to find for each project
PER_PROJECT_MARKERS = {
    "Brisas Ixtapa Agents.json": ["Brisas Ixtapa", "Ixtapa-Zihuatanejo", "club de playa"],
    "Anahuac Orientador Vocacional Agents.json": ["Universidad Anáhuac México", "licenciaturas", "admisión", "5628 8800"],
    "NIZUC Agents.json": ["Nizuc", "lagunas"],
    "Quvira Showrom Agents.json": ["Quivira", "parque industrial", "Coronado", "Mavila"],
    "Ribra - Arcos Bosques Agents.json": ["Ribra - Arcos Bosques", "Arcos Bosques"],
    "SLS - Residences, yacht & sail club Agents.json": ["SLS - Residences, yacht & sail club", "Yacht", "sail club"],
    "Terralago Agents.json": ["Terralago", "LEED Gold", "55 7948 2065", "ventas@terralago.mx"],
}


def find_guard_node(nodes):
    for n in nodes:
        label = (n["data"].get("label") or "").lower()
        if n["data"].get("type") == "Agent" and ("guard" in label or "off-topic" in label):
            return n
    return None


def find_qa_agent(nodes):
    for n in nodes:
        if n["data"].get("type") == "Agent":
            label = (n["data"].get("label") or "").lower()
            if "guard" in label or "off-topic" in label:
                continue
            return n
    return None


def find_condition(nodes):
    for n in nodes:
        if n["data"].get("type") == "ConditionAgent":
            return n
    return None


def check_edges(edges):
    cond_id = "conditionAgentAgentflow_0"
    has_start_to_cond = any(e["source"] == "startAgentflow_0" and e["target"] == cond_id for e in edges)
    has_cond_to_qa = any(e["source"] == cond_id and e["target"].startswith("agentAgentflow_0") and e["target"] != "agentAgentflow_1" for e in edges)
    has_cond_to_guard = any(e["source"] == cond_id and e["target"] == "agentAgentflow_1" for e in edges)
    return has_start_to_cond, has_cond_to_qa, has_cond_to_guard


print("=" * 88)
print(f"{'FILE':52s} {'JSON':4s} {'NODES':5s} {'TEMP':5s} {'ANTI-HALU':9s} {'GUARD':5s} {'PERSONAL':8s}")
print("=" * 88)

all_ok = True
for fname in FILES:
    path = PROJECTS_DIR / fname
    try:
        d = json.loads(path.read_text(encoding="utf-8"))
        json_ok = "OK"
    except Exception as e:
        print(f"  {fname}: JSON INVALID -> {e}")
        all_ok = False
        continue

    nodes = d["nodes"]
    edges = d["edges"]
    qa = find_qa_agent(nodes)
    cond = find_condition(nodes)
    guard = find_guard_node(nodes)

    qa_temp = qa["data"]["inputs"].get("agentModelConfig", {}).get("temperature", "?") if qa else "?"
    cond_temp = cond["data"]["inputs"].get("conditionAgentModelConfig", {}).get("temperature", "?") if cond else "?"
    guard_temp = guard["data"]["inputs"].get("agentModelConfig", {}).get("temperature", "?") if guard else "?"

    msgs = qa["data"]["inputs"].get("agentMessages", []) if qa else []
    anti_present = any("ANTI-ALUCINACIÓN" in m.get("content", "") or "REGLA OPERATIVA" in m.get("content", "") for m in msgs)

    guard_present = "OK" if guard else "MISSING"
    guard_content = (guard["data"]["inputs"]["agentMessages"][0]["content"] if guard and guard["data"]["inputs"].get("agentMessages") else "")
    markers = PER_PROJECT_MARKERS.get(fname, [])
    personal_hits = sum(1 for m in markers if m in guard_content)
    personal_ok = "OK" if personal_hits == len(markers) else f"{personal_hits}/{len(markers)}"

    has_stc, has_cqa, has_cg = check_edges(edges)
    edges_ok = "OK" if (has_stc and has_cqa and has_cg) else "BAD"

    status = "OK" if all([anti_present, guard_present == "OK", personal_hits == len(markers), qa_temp == "0.1", cond_temp == "0", guard_temp == "0", edges_ok == "OK"]) else "ISSUE"
    if status == "ISSUE":
        all_ok = False

    print(f"  {fname:50s} {json_ok:4s} {len(nodes):5d} {qa_temp:5s} {'YES' if anti_present else 'NO':9s} {guard_present:5s} {personal_ok:8s}  [{status}]  edges={edges_ok}")

    # check for the personal markers if not all hit
    if personal_hits != len(markers):
        for m in markers:
            mark = "✓" if m in guard_content else "✗"
            print(f"        {mark} {m!r}")

print("=" * 88)
print("OVERALL:", "ALL OK" if all_ok else "SOME ISSUES")
sys.exit(0 if all_ok else 1)
