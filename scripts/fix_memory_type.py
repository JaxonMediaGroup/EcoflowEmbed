"""
Set Memory Type to 'windowSize' (20) on all Agent nodes of the 7 patched projects,
then re-push to ecoflow.
"""
import json
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

PROJECTS_DIR = Path(r"C:\Users\Guillermo\Downloads\Chatbots\projects")
ARCHIVE_DIR = PROJECTS_DIR / ".archive"
ROOT_DIR = PROJECTS_DIR.parent
PUSH_SCRIPT = ROOT_DIR / "push.py"

PROJECT_PUSH_NAMES = {
    "Brisas Ixtapa Agents.json": "Brisas Ixtapa",
    "Anahuac Orientador Vocacional Agents.json": "Anahuac Orientador Vocacional",
    "NIZUC Agents.json": "NIZUC",
    "Quvira Showrom Agents.json": "Quvira Showroom",
    "Ribra - Arcos Bosques Agents.json": "Ribra - Arcos Bosques",
    "SLS - Residences, yacht & sail club Agents.json": "SLS - Residences",
    "Terralago Agents.json": "Terralago",
}


def backup(path: Path) -> Path:
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    dest_dir = ARCHIVE_DIR / ts
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / path.name
    shutil.copy2(path, dest)
    return dest


def patch_file(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    changed_agents = []
    for n in data["nodes"]:
        if n["data"].get("type") != "Agent":
            continue
        label = n["data"].get("label", "?")
        inputs = n["data"].setdefault("inputs", {})
        old_type = inputs.get("agentMemoryType", "?")
        old_size = inputs.get("agentMemoryWindowSize", "?")
        inputs["agentMemoryType"] = "windowSize"
        inputs["agentMemoryWindowSize"] = "20"
        # Also bump enable memory if not set
        if not inputs.get("agentEnableMemory"):
            inputs["agentEnableMemory"] = True
        changed_agents.append((label, old_type, old_size))

    if not changed_agents:
        return {"file": path.name, "status": "no changes"}

    bkp = backup(path)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return {
        "file": path.name,
        "status": "PATCHED",
        "backup": str(bkp),
        "agents": changed_agents,
    }


def push_to_ecoflow(push_name: str) -> tuple[int, str]:
    """Run push.py and return exit code + combined output."""
    proc = subprocess.run(
        [sys.executable, str(PUSH_SCRIPT), push_name],
        capture_output=True,
        text=True,
        cwd=str(ROOT_DIR),
    )
    return proc.returncode, (proc.stdout + proc.stderr).strip()


def main() -> None:
    print("=" * 88)
    print("PHASE 1: Local patch — set memoryType=windowSize, windowSize=20 on all Agent nodes")
    print("=" * 88)
    results = []
    for fname, push_name in PROJECT_PUSH_NAMES.items():
        path = PROJECTS_DIR / fname
        if not path.exists():
            print(f"  [MISSING] {fname}")
            continue
        r = patch_file(path)
        if r["status"] == "PATCHED":
            print(f"  [PATCHED] {fname}")
            for label, old_t, old_s in r["agents"]:
                print(f"     - {label}: memoryType {old_t!r} -> 'windowSize', windowSize {old_s!r} -> '20'")
        results.append((fname, push_name, r))

    print()
    print("=" * 88)
    print("PHASE 2: Re-push to ecoflow.koppi.mx")
    print("=" * 88)
    push_results = []
    for fname, push_name, r in results:
        print(f"\n--- {push_name} ---")
        rc, out = push_to_ecoflow(push_name)
        print(out)
        push_results.append((push_name, rc == 0))

    print()
    print("=" * 88)
    print("SUMMARY")
    print("=" * 88)
    for push_name, ok in push_results:
        print(f"  {'OK ' if ok else 'FAIL'}  {push_name}")
    print(f"\n{sum(1 for _, ok in push_results if ok)}/{len(push_results)} pushed successfully")


if __name__ == "__main__":
    main()
