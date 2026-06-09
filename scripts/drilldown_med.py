"""Deep dive: temperature, tools, knowledge stores for the MED-risk agents."""
import json
from pathlib import Path

PROJECTS_DIR = Path(r"C:\Users\Guillermo\Downloads\Chatbots\projects")

MED = [
    "CRM AI Agents.json",
    "Gran Terraza Coapa Agents.json",
    "Punta Zero Agents.json",
    "LST La Santisima Agents.json",
    "LST Los Senderos Agents.json",
    "LST San Francisco Agents.json",
    "LST San Lucas Agents.json",
    "LST Santa Catalina Agents.json",
    "WTC Agents.json",
    "Wingate Agents.json",
    "plataformaNauma Agents.json",
]

for fname in MED:
    path = PROJECTS_DIR / fname
    if not path.exists():
        print(f"[MISSING] {fname}")
        continue
    with open(path, encoding="utf-8") as f:
        d = json.load(f)
    print(f"\n=== {fname} ===")
    for n in d["nodes"]:
        typ = n["data"].get("type")
        label = n["data"].get("label", "?")
        if typ == "Agent":
            inputs = n["data"].get("inputs", {}) or {}
            cfg = inputs.get("agentModelConfig", {}) or {}
            tools = inputs.get("agentTools", []) or []
            doc_stores = inputs.get("agentKnowledgeDocumentStores", []) or []
            vs_embeddings = inputs.get("agentKnowledgeVSEmbeddings", []) or []
            tool_names = [t.get("agentSelectedToolConfig", {}).get("requestsGetName")
                          or t.get("agentSelectedTool") for t in tools]
            ds_names = [ds.get("documentStore", "?") if isinstance(ds, dict) else ds for ds in doc_stores]
            vs_names = [vs.get("vectorStore", "?") if isinstance(vs, dict) else vs for vs in vs_embeddings]
            print(f"  {label:55s}  t={str(cfg.get('temperature', '?')):4s}  tools={len(tools)} {tool_names}  doc_stores={ds_names}  vs={vs_names}")
        elif typ == "ConditionAgent":
            cfg = n["data"]["inputs"].get("conditionAgentModelConfig", {}) or {}
            print(f"  {label:55s}  t={str(cfg.get('temperature', '?'))}  (ConditionAgent)")
