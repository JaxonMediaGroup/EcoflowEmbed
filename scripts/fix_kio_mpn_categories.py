"""Reclassify KIO (industrial -> tech) and Novotech Mision Punta Norte (industrial -> real-estate)."""
import json
from pathlib import Path

PROJECTS_JSON = Path(r"C:\Users\Guillermo\Downloads\Chatbots\projects.json")

data = json.loads(PROJECTS_JSON.read_text(encoding="utf-8"))

# Backup
backup = PROJECTS_JSON.with_suffix(".json.bak2")
backup.write_text(PROJECTS_JSON.read_text(encoding="utf-8"), encoding="utf-8")
print(f"Backup: {backup}")

changes = [
    ("KIO", "industrial", "tech", "KIO Networks = data centers, not industrial"),
    ("Novotech Mision Punta Norte", "industrial", "real-estate", "Doc says 'desarrollo residencial sostenible' with lotes residenciales"),
]

for name, old, new, reason in changes:
    proj = data["projects"].get(name)
    if not proj:
        print(f"  [SKIP] {name} not found")
        continue
    actual_old = proj.get("category")
    if actual_old != old:
        print(f"  [WARN] {name}: expected category {old!r}, found {actual_old!r}")
    proj["category"] = new
    print(f"  {name}: {actual_old!r:13s} -> {new!r:13s}  ({reason})")

PROJECTS_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"\nUpdated: {PROJECTS_JSON}")

# Verify
new_data = json.loads(PROJECTS_JSON.read_text(encoding="utf-8"))["projects"]
for name, _, new, _ in changes:
    print(f"  verify {name}: {new_data[name]['category']!r}")
