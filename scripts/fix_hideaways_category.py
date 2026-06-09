"""Reclassify Hideaways from hospitality to real-estate per 'resort_only' rule."""
import json
from pathlib import Path

PROJECTS_JSON = Path(r"C:\Users\Guillermo\Downloads\Chatbots\projects.json")

data = json.loads(PROJECTS_JSON.read_text(encoding="utf-8"))
proj = data["projects"].get("Hideaways")
if not proj:
    print("ERROR: Hideaways not found in projects.json")
    raise SystemExit(1)

old = proj.get("category")
proj["category"] = "real-estate"

# Backup
backup = PROJECTS_JSON.with_suffix(".json.bak")
backup.write_text(PROJECTS_JSON.read_text(encoding="utf-8"), encoding="utf-8")
print(f"Backup: {backup}")

PROJECTS_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Hideaways category: {old!r} -> 'real-estate'  (rule: resort_only)")

# Verify
new_data = json.loads(PROJECTS_JSON.read_text(encoding="utf-8"))["projects"]
print(f"\nNew category: {new_data['Hideaways']['category']}")
