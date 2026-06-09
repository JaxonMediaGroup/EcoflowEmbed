"""
Full audit of all 58 Flowise agents in the Chatbots portfolio.
Outputs:
  - console table
  - CSV: projects/.audit/audit_full.csv
  - JSON: projects/.audit/audit_full.json
"""
import json
import re
import csv
import sys
from pathlib import Path
from collections import defaultdict

PROJECTS_DIR = Path(r"C:\Users\Guillermo\Downloads\Chatbots\projects")
PROJECTS_JSON = PROJECTS_DIR.parent / "projects.json"
AUDIT_DIR = PROJECTS_DIR / ".audit"
AUDIT_DIR.mkdir(exist_ok=True)

# Risk markers (Spanish + English)
ANTI_HALU_MARKERS = [
    "ANTI-ALUCINACIÓN", "ANTI-ALUCINACION", "ANTI-INFERENCIA",
    "no inventes", "no inventar", "no complete datos con suposiciones",
    "no completes huecos", "do not invent", "do not make up",
    "do not fabricate", "no fabrication", "no inferir",
    "información pendiente", "informacion pendiente", "information pending",
    "fuente única", "fuente unica", "single source",
    "nunca uses conocimiento general", "nunca inferir",
    "manejo de incertidumbre", "prohibición de promesas",
    "prohibicion de promesas",
]
FORBIDDEN_PHRASES_MARKERS = [
    "STRICTLY FORBIDDEN PHRASES", "FRASES ESTRICTAMENTE PROHIBIDAS",
    "NUNCA menciones que consultaste", "NUNCA uses frases como",
    "nunca reveles que", "nunca reveles que estás consultando",
    "never reveal you are consulting",
]
LANGUAGE_RULE_MARKERS = [
    "STRICT LANGUAGE RULE", "REGLA DE IDIOMA", "MISMATCHING IDIOMAS",
    "MULTILINGUAL RULE", "LANGUAGE RULE",
]

# Categorize temperature
def temp_risk(t):
    try:
        t = float(t)
    except (TypeError, ValueError):
        return ("?", "unknown")
    if t >= 0.7:
        return ("HIGH", t)
    if t >= 0.3:
        return ("MED", t)
    return ("LOW", t)


def memory_risk(memory_type, window_size):
    """Memory type risk: allMessages on a long conversation can carry stale context."""
    if memory_type == "allMessages":
        return "MED"  # could be problematic in long convos
    if memory_type in ("windowSize", "conversationSummaryBuffer", "conversationSummary"):
        try:
            ws = int(window_size)
            if ws > 30:
                return "LOW-MED"  # large window
            if ws <= 20:
                return "LOW"
            return "MED"
        except (TypeError, ValueError):
            return "?"
    return "?"


def count_markers(text, markers):
    if not text:
        return 0, []
    hits = []
    for m in markers:
        if m.lower() in text.lower():
            hits.append(m)
    return len(hits), hits


def audit_agent(node):
    """Extract audit fields from an Agent node."""
    label = node["data"].get("label", "?")
    nid = node["data"].get("id", "?")
    inputs = node["data"].get("inputs", {}) or {}
    cfg = inputs.get("agentModelConfig", {}) or {}
    model = cfg.get("modelName", "")
    temp = cfg.get("temperature", "")
    temp_label, temp_val = temp_risk(temp)

    tools = inputs.get("agentTools", []) or []
    tool_names = []
    for t in tools:
        cfg2 = t.get("agentSelectedToolConfig", {}) or {}
        name = cfg2.get("requestsGetName") or t.get("agentSelectedTool", "?")
        tool_names.append(name)

    has_info_get = any("info" in (n or "").lower() for n in tool_names)
    has_web_search = any("search" in (n or "").lower() for n in tool_names)
    has_any_tool = len(tools) > 0

    memory_type = inputs.get("agentMemoryType", "")
    window_size = inputs.get("agentMemoryWindowSize", "")
    mem_label = memory_risk(memory_type, window_size)

    msgs = inputs.get("agentMessages", []) or []
    full_text = "\n".join(m.get("content", "") or "" for m in msgs)

    anti_hits, anti_markers_found = count_markers(full_text, ANTI_HALU_MARKERS)
    forbidden_hits, forbidden_markers_found = count_markers(full_text, FORBIDDEN_PHRASES_MARKERS)
    lang_hits, _ = count_markers(full_text, LANGUAGE_RULE_MARKERS)

    sys_prompt_len = sum(len(m.get("content", "") or "") for m in msgs if m.get("role") == "system")

    is_sales = any(w in label.lower() for w in ["sales", "lead", "ventas"])
    is_guard = any(w in label.lower() for w in ["guard", "off-topic", "off topic"])
    is_classifier = "condition" in label.lower() or "classifier" in label.lower()

    return {
        "id": nid,
        "label": label,
        "is_sales": is_sales,
        "is_guard": is_guard,
        "is_classifier": is_classifier,
        "model": model,
        "temp": str(temp),
        "temp_val": str(temp_val),
        "temp_risk": temp_label,
        "tool_count": len(tools),
        "tool_names": tool_names,
        "has_info_get": has_info_get,
        "has_web_search": has_web_search,
        "has_any_tool": has_any_tool,
        "memory_type": memory_type or "(none)",
        "window_size": str(window_size) if window_size else "(none)",
        "memory_risk": mem_label,
        "sys_prompt_len": sys_prompt_len,
        "anti_hal_count": anti_hits,
        "anti_hal_markers": anti_markers_found,
        "forbidden_count": forbidden_hits,
        "forbidden_markers": forbidden_markers_found,
        "lang_rule_count": lang_hits,
    }


def compute_agent_risk(a):
    """Score 0-100. Higher = more risk of hallucination."""
    if a["is_guard"]:
        return 0  # guards don't hallucinate factual info; they have hardcoded scripts
    if a["is_sales"]:
        return 5  # sales agents are constrained, low risk
    score = 0
    # Temperature
    score += {"HIGH": 50, "MED": 25, "LOW": 0, "?": 15}.get(a["temp_risk"], 15)
    # No tools
    if not a["has_any_tool"]:
        score += 15
    elif not a["has_info_get"]:
        score += 5
    # No anti-hallucination rules
    if a["anti_hal_count"] == 0:
        score += 20
    # No forbidden phrases
    if a["forbidden_count"] == 0:
        score += 5
    # Memory risk
    score += {"HIGH": 0, "MED": 5, "LOW-MED": 2, "LOW": 0, "?": 3}.get(a["memory_risk"], 3)
    return min(score, 100)


def risk_band(score):
    if score >= 60:
        return "HIGH"
    if score >= 30:
        return "MED"
    return "LOW"


# Main loop
all_projects = json.loads(PROJECTS_JSON.read_text(encoding="utf-8"))["projects"]

results = []
not_found = []

for proj_name, proj in sorted(all_projects.items()):
    json_file = proj.get("json_file")
    chatflow_id = proj.get("chatflow_id", "")
    if not json_file:
        not_found.append((proj_name, chatflow_id, "no json_file in projects.json"))
        continue
    path = PROJECTS_DIR / Path(json_file).name
    if not path.exists():
        not_found.append((proj_name, chatflow_id, f"missing: {path}"))
        continue

    try:
        d = json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:
        not_found.append((proj_name, chatflow_id, f"invalid JSON: {e}"))
        continue

    nodes = d.get("nodes", [])
    edges = d.get("edges", [])

    has_condition = any(n["data"].get("type") == "ConditionAgent" for n in nodes)
    agent_nodes = [n for n in nodes if n["data"].get("type") == "Agent"]
    guard_nodes = [n for n in agent_nodes if "guard" in (n["data"].get("label") or "").lower()
                   or "off-topic" in (n["data"].get("label") or "").lower()]
    sales_nodes = [n for n in agent_nodes if any(w in (n["data"].get("label") or "").lower()
                                                for w in ["sales", "lead"])]
    qa_nodes = [n for n in agent_nodes if n not in guard_nodes and n not in sales_nodes]

    for n in qa_nodes:
        a = audit_agent(n)
        score = compute_agent_risk(a)
        results.append({
            "project": proj_name,
            "chatflow_id": chatflow_id,
            **a,
            "has_condition": has_condition,
            "n_guards": len(guard_nodes),
            "n_sales": len(sales_nodes),
            "n_nodes": len(nodes),
            "n_edges": len(edges),
            "risk_score": score,
            "risk_band": risk_band(score),
        })

# Sort by risk
results.sort(key=lambda r: (-r["risk_score"], r["project"]))

# Write CSV
csv_path = AUDIT_DIR / "audit_full.csv"
with open(csv_path, "w", encoding="utf-8", newline="") as f:
    fieldnames = [
        "project", "risk_band", "risk_score", "label", "model", "temp", "temp_risk",
        "tool_count", "has_info_get", "has_web_search", "tool_names",
        "memory_type", "window_size", "memory_risk",
        "anti_hal_count", "anti_hal_markers", "forbidden_count", "forbidden_markers",
        "lang_rule_count", "sys_prompt_len", "has_condition", "n_guards", "n_sales",
        "n_nodes", "n_edges", "chatflow_id",
    ]
    w = csv.DictWriter(f, fieldnames=fieldnames)
    w.writeheader()
    for r in results:
        row = {k: r.get(k, "") for k in fieldnames}
        row["anti_hal_markers"] = "; ".join(r["anti_hal_markers"])
        row["forbidden_markers"] = "; ".join(r["forbidden_markers"])
        row["tool_names"] = ", ".join(r["tool_names"])
        w.writerow(row)

# Write JSON
json_path = AUDIT_DIR / "audit_full.json"
json_path.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")

# Console summary
print("=" * 110)
print(f"AGENT AUDIT — {len(results)} Q&A agents across {len(set(r['project'] for r in results))} projects")
print("=" * 110)

# Band distribution
bands = defaultdict(int)
for r in results:
    bands[r["risk_band"]] += 1
print(f"\nRisk distribution:  HIGH={bands['HIGH']}  MED={bands['MED']}  LOW={bands['LOW']}")
print(f"Missing/invalid JSONs: {len(not_found)}")
for nf in not_found:
    print(f"  - {nf[0]} ({nf[1]}): {nf[2]}")

print("\n" + "=" * 110)
print("HIGH RISK (score >= 60) — fix immediately")
print("=" * 110)
high = [r for r in results if r["risk_band"] == "HIGH"]
if not high:
    print("  (none)")
for r in high:
    reasons = []
    if r["temp_risk"] == "HIGH":
        reasons.append(f"temp {r['temp']}")
    if not r["has_any_tool"]:
        reasons.append("NO TOOLS")
    if r["anti_hal_count"] == 0:
        reasons.append("no anti-halu rules")
    if r["forbidden_count"] == 0:
        reasons.append("no forbidden phrases")
    if r["memory_risk"] in ("MED",):
        reasons.append(f"memoryType={r['memory_type']}")
    print(f"  {r['project']:42s}  score={r['risk_score']:3d}  t={r['temp']:4s}  tools={r['tool_count']}  "
          f"anti-halu={r['anti_hal_count']:2d}  mem={r['memory_type']:15s}  guards={r['n_guards']}  cond={r['has_condition']}  -- {', '.join(reasons)}")

print("\n" + "=" * 110)
print("MEDIUM RISK (30 <= score < 60) — review soon")
print("=" * 110)
med = [r for r in results if r["risk_band"] == "MED"]
if not med:
    print("  (none)")
for r in med:
    reasons = []
    if r["temp_risk"] == "MED":
        reasons.append(f"temp {r['temp']}")
    if r["anti_hal_count"] == 0:
        reasons.append("no anti-halu rules")
    if r["forbidden_count"] == 0:
        reasons.append("no forbidden phrases")
    if r["memory_risk"] in ("MED",):
        reasons.append(f"memoryType={r['memory_type']}")
    if r["n_guards"] == 0:
        reasons.append("no guard")
    if not r["has_condition"]:
        reasons.append("no ConditionAgent")
    print(f"  {r['project']:42s}  score={r['risk_score']:3d}  t={r['temp']:4s}  tools={r['tool_count']}  "
          f"anti-halu={r['anti_hal_count']:2d}  mem={r['memory_type']:15s}  guards={r['n_guards']}  cond={r['has_condition']}  -- {', '.join(reasons)}")

print("\n" + "=" * 110)
print("LOW RISK (score < 30) — count only")
print("=" * 110)
low = [r for r in results if r["risk_band"] == "LOW"]
print(f"  {len(low)} agents: ", end="")
print(", ".join(sorted(set(r['project'] for r in low))))

print()
print("=" * 110)
print(f"Detailed CSV: {csv_path}")
print(f"Detailed JSON: {json_path}")
print("=" * 110)
