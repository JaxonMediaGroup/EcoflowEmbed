"""Apply P0+P1+P2 audit fixes and re-push to ecoflow.koppi.mx."""
import json
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

# Reuse the anti-halu block builder
sys.path.insert(0, str(Path(__file__).parent))
from apply_nativas_guard import build_anti_hallucination_block  # noqa: E402

PROJECTS_DIR = Path(r"C:\Users\Guillermo\Downloads\Chatbots\projects")
ARCHIVE_DIR = PROJECTS_DIR / ".archive"
ROOT_DIR = PROJECTS_DIR.parent
PUSH_SCRIPT = ROOT_DIR / "push.py"
ANTI_HALU_MARKER = "ANTI-ALUCINACIÓN"


def backup(path: Path) -> Path:
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    dest_dir = ARCHIVE_DIR / ts
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / path.name
    shutil.copy2(path, dest)
    return dest


def set_temp_and_memory(node: dict) -> tuple[bool, str, str, str, str]:
    """Force temp=0.1 and memoryType=windowSize, windowSize=20. Returns (changed, old_temp, new_temp, old_mem, new_mem)."""
    inputs = node["data"].setdefault("inputs", {})
    cfg = inputs.setdefault("agentModelConfig", {})
    old_temp = str(cfg.get("temperature", "?"))
    cfg["temperature"] = "0.1"

    old_mem = str(inputs.get("agentMemoryType", "?"))
    inputs["agentMemoryType"] = "windowSize"
    old_ws = str(inputs.get("agentMemoryWindowSize", "?"))
    inputs["agentMemoryWindowSize"] = "20"
    if not inputs.get("agentEnableMemory"):
        inputs["agentEnableMemory"] = True

    changed = (old_temp != "0.1") or (old_mem != "windowSize") or (old_ws != "20")
    return changed, old_temp, "0.1", old_mem, "windowSize"


def inject_anti_hal_block(node: dict, project_name: str) -> tuple[bool, str, int]:
    """Inject ANTI-ALUCINACIÓN block as a new system message. Returns (changed, status, count)."""
    inputs = node["data"].setdefault("inputs", {})
    msgs = inputs.setdefault("agentMessages", [])
    for m in msgs:
        if m.get("role") == "system" and ANTI_HALU_MARKER in (m.get("content") or ""):
            return False, "already-has-block", 0
    cfg = {"project_name": project_name, "type": "real_estate"}
    block = build_anti_hallucination_block(cfg)
    msgs.append({"role": "system", "content": block})
    return True, "injected", 1


# P0 targets: fix temp + memory on every Agent+ConditionAgent node
P0_FILES = [
    "Torre Zero Providencia Agents.json",
    "Torre Zero Centro de Neogcios Agents.json",
    "Gran Terraza Coapa Agents.json",
    "Punta Zero Agents.json",
]
# P1 targets: inject anti-halu in the Q&A agent
P1_FILES = [
    ("LST La Santisima Agents.json", "LST La Santisima"),
    ("LST Los Senderos Agents.json", "LST Los Senderos"),
    ("LST San Francisco Agents.json", "LST San Francisco"),
    ("LST San Lucas Agents.json", "LST San Lucas"),
    ("LST Santa Catalina Agents.json", "LST Santa Catalina"),
    ("Wingate Agents.json", "Wingate"),
    ("plataformaNauma Agents.json", "plataformaNauma"),
]
# P2: WTC Shopping Center agent
P2_FILE = "WTC Agents.json"

PROJECT_PUSH_NAMES = {
    "Torre Zero Providencia Agents.json": "Torre Zero Providencia",
    "Torre Zero Centro de Neogcios Agents.json": "Torre Zero Centro de Neogcios",
    "Gran Terraza Coapa Agents.json": "Gran Terraza Coapa",
    "Punta Zero Agents.json": "Punta Zero",
    "LST La Santisima Agents.json": "LST La Santisima",
    "LST Los Senderos Agents.json": "LST Los Senderos",
    "LST San Francisco Agents.json": "LST San Francisco",
    "LST San Lucas Agents.json": "LST San Lucas",
    "LST Santa Catalina Agents.json": "LST Santa Catalina",
    "Wingate Agents.json": "Wingate",
    "plataformaNauma Agents.json": "plataformaNauma",
    "WTC Agents.json": "WTC",
}


def find_main_qa(nodes):
    for n in nodes:
        if n["data"].get("type") == "Agent":
            label = (n["data"].get("label") or "").lower()
            if "guard" in label or "off-topic" in label:
                continue
            if "sales" in label and "agent" in label:
                continue
            return n
    return None


def patch_p0(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    changes = []
    for n in data["nodes"]:
        typ = n["data"].get("type")
        if typ == "Agent":
            label = n["data"].get("label", "?")
            if "guard" in label.lower() or "off-topic" in label.lower():
                continue
            if "sales" in label.lower():
                ch, ot, nt, om, nm = set_temp_and_memory(n)
                if ch:
                    changes.append((label, ot, nt, om, nm, "P0/sales"))
                continue
            ch, ot, nt, om, nm = set_temp_and_memory(n)
            if ch:
                changes.append((label, ot, nt, om, nm, "P0/qa"))
        elif typ == "ConditionAgent":
            label = n["data"].get("label", "?")
            inputs = n["data"].setdefault("inputs", {})
            cfg = inputs.setdefault("conditionAgentModelConfig", {})
            old_temp = str(cfg.get("temperature", "?"))
            cfg["temperature"] = "0.1"
            if old_temp != "0.1":
                changes.append((label, old_temp, "0.1", "(N/A)", "(N/A)", "P0/cond"))
    if not changes:
        return {"file": path.name, "status": "no changes"}
    bkp = backup(path)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return {"file": path.name, "status": "PATCHED", "changes": changes, "backup": str(bkp)}


def patch_p1(path: Path, project_name: str) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    qa = find_main_qa(data["nodes"])
    if not qa:
        return {"file": path.name, "status": "no Q&A found"}
    changed, status, count = inject_anti_hal_block(qa, project_name)
    if not changed:
        return {"file": path.name, "status": f"SKIPPED ({status})"}
    # Also force temp 0.1 + windowSize 20 (defensive)
    set_temp_and_memory(qa)
    bkp = backup(path)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return {"file": path.name, "status": "PATCHED", "block_status": status, "backup": str(bkp)}


def patch_p2_wtc(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    target_label_keyword = "shopping"
    changes = []
    for n in data["nodes"]:
        if n["data"].get("type") != "Agent":
            continue
        label = n["data"].get("label", "")
        if target_label_keyword in label.lower():
            ch, ot, nt, om, nm = set_temp_and_memory(n)
            if ch:
                changes.append((label, ot, nt, om, nm))
    if not changes:
        return {"file": path.name, "status": "no changes"}
    bkp = backup(path)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return {"file": path.name, "status": "PATCHED", "changes": changes, "backup": str(bkp)}


def push_to_ecoflow(push_name: str) -> tuple[int, str]:
    proc = subprocess.run(
        [sys.executable, str(PUSH_SCRIPT), push_name],
        capture_output=True, text=True, cwd=str(ROOT_DIR),
    )
    return proc.returncode, (proc.stdout + proc.stderr).strip()


# ============================================================================
# Main
# ============================================================================
def main():
    patched_files: list[tuple[str, str]] = []  # (filename, push_name)

    # --- P0 ---
    print("=" * 88)
    print("PHASE 1: P0 — temperature 0.9 -> 0.1 + memoryType -> windowSize 20")
    print("=" * 88)
    for fname in P0_FILES:
        path = PROJECTS_DIR / fname
        r = patch_p0(path)
        print(f"\n  [{r['status']}] {fname}")
        if r["status"] == "PATCHED":
            patched_files.append((fname, PROJECT_PUSH_NAMES[fname]))
            for label, ot, nt, om, nm, kind in r["changes"]:
                print(f"     {kind:7s} {label[:55]:55s} t={ot}->{nt}  mem={om}->{nm}")

    # --- P1 ---
    print("\n" + "=" * 88)
    print("PHASE 2: P1 — inject ANTI-ALUCINACIÓN block in Q&A agent")
    print("=" * 88)
    for fname, proj_name in P1_FILES:
        path = PROJECTS_DIR / fname
        r = patch_p1(path, proj_name)
        print(f"\n  [{r['status']}] {fname}")
        if r["status"] == "PATCHED":
            patched_files.append((fname, PROJECT_PUSH_NAMES[fname]))
            print(f"     block={r.get('block_status')}")

    # --- P2 ---
    print("\n" + "=" * 88)
    print("PHASE 3: P2 — WTC Shopping Center temp 0.4 -> 0.1")
    print("=" * 88)
    path = PROJECTS_DIR / P2_FILE
    r = patch_p2_wtc(path)
    print(f"\n  [{r['status']}] {P2_FILE}")
    if r["status"] == "PATCHED":
        patched_files.append((P2_FILE, PROJECT_PUSH_NAMES[P2_FILE]))
        for label, ot, nt, om, nm in r["changes"]:
            print(f"     {label[:55]:55s} t={ot}->{nt}  mem={om}->{nm}")

    # --- Push ---
    print("\n" + "=" * 88)
    print(f"PHASE 4: Push {len(patched_files)} files to ecoflow.koppi.mx")
    print("=" * 88)
    results = []
    for fname, push_name in patched_files:
        print(f"\n--- {push_name} ---")
        rc, out = push_to_ecoflow(push_name)
        # Print only the relevant lines (skip the model config echo)
        for line in out.splitlines():
            if "Push successful" in line or "Push failed" in line or "Failed" in line or "ERROR" in line:
                print(f"   {line}")
        results.append((push_name, rc == 0))

    # --- Summary ---
    print("\n" + "=" * 88)
    print("SUMMARY — Proyectos actualizados y subidos a ecoflow")
    print("=" * 88)
    for i, (fname, push_name) in enumerate(patched_files, 1):
        ok = dict(results)[push_name]
        print(f"  {i:2d}. {'OK' if ok else 'FAIL'}  {push_name}")
    ok_count = sum(1 for _, ok in results if ok)
    print(f"\n  {ok_count}/{len(results)} subidos correctamente")
    return patched_files


if __name__ == "__main__":
    main()
