"""Push every project in projects.json to ecoflow (idempotent)."""
import json
import subprocess
import sys
from pathlib import Path

PROJECTS_JSON = Path(r"C:\Users\Guillermo\Downloads\Chatbots\projects.json")
PUSH_SCRIPT = PROJECTS_JSON.parent / "push.py"

projects = json.loads(PROJECTS_JSON.read_text(encoding="utf-8"))["projects"]
ok, fail = 0, 0
fails = []
for proj_name in sorted(projects):
    if not projects[proj_name].get("json_file"):
        continue
    proc = subprocess.run(
        [sys.executable, str(PUSH_SCRIPT), proj_name],
        capture_output=True, text=True, cwd=str(PUSH_SCRIPT.parent),
    )
    success = proc.returncode == 0
    if success:
        ok += 1
        print(f"  [OK]   {proj_name}")
    else:
        fail += 1
        fails.append(proj_name)
        print(f"  [FAIL] {proj_name}: {proc.stderr[:200] or proc.stdout[-200:]}")

print(f"\n{ok} ok, {fail} fail")
if fails:
    print("Failed:")
    for f in fails:
        print(f"  - {f}")
