"""Inspect all nodes and edges of Torre Zero Providencia."""
import json
from pathlib import Path

data = json.loads(Path("projects/Torre Zero Providencia Agents.json").read_text(encoding="utf-8"))

print("=== ALL NODES ===")
for n in data["nodes"]:
    d = n.get("data", {})
    nid = n.get("id", "?")
    ntype = d.get("type", "?")
    name = d.get("name", "?")
    label = d.get("label", "?")
    print(f"  id={nid} | type={ntype} | name={name} | label={label}")
    inputs = d.get("inputs", {})
    for k, v in inputs.items():
        if v and k not in ("agentMessages", "agentTools"):
            print(f"    {k}: {str(v)[:150]}")

print()
print("=== ALL EDGES ===")
for e in data.get("edges", []):
    src = e.get("source", "?")
    tgt = e.get("target", "?")
    src_handle = e.get("sourceHandle", "")
    tgt_handle = e.get("targetHandle", "")
    print(f"  {src} ({src_handle}) -> {tgt} ({tgt_handle})")
