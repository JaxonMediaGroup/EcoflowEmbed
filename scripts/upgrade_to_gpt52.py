"""
Upgrade ALL nodes (Agent + ConditionAgent) to gpt-5.2 across every project.
Touches:
  - agentModelConfig.modelName (Agent, Sales, Guard, etc.)
  - conditionAgentModelConfig.modelName (ConditionAgent)

Skips nodes that:
  - already have modelName == "gpt-5.2"
  - have empty modelName (don't add 5.2 to empty)

Backs up to .archive/ and re-pushes to ecoflow.koppi.mx.
"""
import json
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from collections import defaultdict

PROJECTS_DIR = Path(r"C:\Users\Guillermo\Downloads\Chatbots\projects")
PROJECTS_JSON = PROJECTS_DIR.parent / "projects.json"
ARCHIVE_DIR = PROJECTS_DIR / ".archive"
ROOT_DIR = PROJECTS_DIR.parent
PUSH_SCRIPT = ROOT_DIR / "push.py"
TARGET_MODEL = "gpt-5.2"


def backup(path: Path) -> Path:
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    dest_dir = ARCHIVE_DIR / ts
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / path.name
    shutil.copy2(path, dest)
    return dest


def push(push_name: str) -> tuple[int, str]:
    proc = subprocess.run(
        [sys.executable, str(PUSH_SCRIPT), push_name],
        capture_output=True, text=True, cwd=str(ROOT_DIR),
    )
    return proc.returncode, (proc.stdout + proc.stderr).strip()


def upgrade_node(node: dict) -> list[tuple[str, str, str]]:
    """Returns list of (field, old_model, new_model) for nodes that changed."""
    changes = []
    inputs = node["data"].setdefault("inputs", {})

    # 1. agentModelConfig (Agent nodes)
    cfg = inputs.get("agentModelConfig")
    if isinstance(cfg, dict):
        old = (cfg.get("modelName") or "").strip()
        if old and old != TARGET_MODEL:
            cfg["modelName"] = TARGET_MODEL
            changes.append(("agentModelConfig", old, TARGET_MODEL))

    # 2. conditionAgentModelConfig (ConditionAgent nodes)
    cfg2 = inputs.get("conditionAgentModelConfig")
    if isinstance(cfg2, dict):
        old = (cfg2.get("modelName") or "").strip()
        if old and old != TARGET_MODEL:
            cfg2["modelName"] = TARGET_MODEL
            changes.append(("conditionAgentModelConfig", old, TARGET_MODEL))

    return changes


def main():
    all_projects = json.loads(PROJECTS_JSON.read_text(encoding="utf-8"))["projects"]

    stats = defaultdict(int)
    projects_with_changes: list[tuple[str, str]] = []  # (filename, push_name)
    skipped_no_json: list[str] = []

    # Phase 1: local patch
    print("=" * 88)
    print("PHASE 1: Local upgrade of modelName to gpt-5.2")
    print("=" * 88)

    for proj_name, proj in sorted(all_projects.items()):
        json_file = proj.get("json_file")
        if not json_file:
            skipped_no_json.append(proj_name)
            continue
        path = PROJECTS_DIR / Path(json_file).name
        if not path.exists():
            skipped_no_json.append(proj_name)
            continue

        data = json.loads(path.read_text(encoding="utf-8"))
        file_changes = []
        for n in data["nodes"]:
            typ = n["data"].get("type")
            if typ not in ("Agent", "ConditionAgent"):
                continue
            label = n["data"].get("label", "?")
            for field, old, new in upgrade_node(n):
                file_changes.append((typ, label, field, old, new))

        if not file_changes:
            continue

        backup(path)
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        stats["files_changed"] += 1
        stats["nodes_changed"] += len(file_changes)
        projects_with_changes.append((path.name, proj_name))
        print(f"\n  [{path.name}]")
        for typ, label, field, old, new in file_changes:
            print(f"     {typ:18s} {label[:45]:45s} {field:30s} {old:8s} -> {new}")

    print()
    print("=" * 88)
    print(f"PHASE 2: Push {len(projects_with_changes)} changed files to ecoflow")
    print("=" * 88)
    push_ok = 0
    push_fail = 0
    for fname, push_name in projects_with_changes:
        rc, out = push(push_name)
        ok = (rc == 0)
        if ok:
            push_ok += 1
        else:
            push_fail += 1
        # Print only the success/fail line
        for line in out.splitlines():
            if "Push successful" in line or "Push failed" in line or "Failed" in line:
                print(f"  [{('OK' if ok else 'FAIL'):4s}] {push_name:42s} {line.strip()}")

    print()
    print("=" * 88)
    print("SUMMARY")
    print("=" * 88)
    print(f"  Files patched:    {stats['files_changed']}")
    print(f"  Nodes upgraded:   {stats['nodes_changed']}")
    print(f"  Pushes ok:        {push_ok}/{len(projects_with_changes)}")
    print(f"  Pushes failed:    {push_fail}")
    print(f"  No JSON (skip):   {len(skipped_no_json)}")
    if skipped_no_json:
        for p in skipped_no_json:
            print(f"     - {p}")


if __name__ == "__main__":
    main()
