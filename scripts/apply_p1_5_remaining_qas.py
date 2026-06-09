"""P1.5: inject ANTI-ALUCINACIÓN block into ALL Q&A agents of a project (not just the first)."""
import json
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from apply_nativas_guard import build_anti_hallucination_block  # noqa: E402

PROJECTS_DIR = Path(r"C:\Users\Guillermo\Downloads\Chatbots\projects")
ARCHIVE_DIR = PROJECTS_DIR / ".archive"
ROOT_DIR = PROJECTS_DIR.parent
PUSH_SCRIPT = ROOT_DIR / "push.py"
ANTI_HALU_MARKER = "ANTI-ALUCINACIÓN"

TARGETS = [
    ("LST La Santisima Agents.json", "LST La Santisima"),
    ("LST Los Senderos Agents.json", "LST Los Senderos"),
    ("LST San Francisco Agents.json", "LST San Francisco"),
    ("LST San Lucas Agents.json", "LST San Lucas"),
    ("LST Santa Catalina Agents.json", "LST Santa Catalina"),
    ("plataformaNauma Agents.json", "plataformaNauma"),
]


def backup(path: Path) -> Path:
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    dest_dir = ARCHIVE_DIR / ts
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / path.name
    shutil.copy2(path, dest)
    return dest


def inject(node, project_name):
    inputs = node["data"].setdefault("inputs", {})
    msgs = inputs.setdefault("agentMessages", [])
    for m in msgs:
        if m.get("role") == "system" and ANTI_HALU_MARKER in (m.get("content") or ""):
            return False
    cfg = {"project_name": project_name, "type": "real_estate"}
    msgs.append({"role": "system", "content": build_anti_hallucination_block(cfg)})
    return True


def is_qa_agent(node):
    if node["data"].get("type") != "Agent":
        return False
    label = (node["data"].get("label") or "").lower()
    if "guard" in label or "off-topic" in label:
        return False
    if "condition" in label or "classifier" in label:
        return False
    return True


def push(push_name):
    proc = subprocess.run(
        [sys.executable, str(PUSH_SCRIPT), push_name],
        capture_output=True, text=True, cwd=str(ROOT_DIR),
    )
    return proc.returncode, (proc.stdout + proc.stderr)


for fname, push_name in TARGETS:
    path = PROJECTS_DIR / fname
    data = json.loads(path.read_text(encoding="utf-8"))
    injected = []
    for n in data["nodes"]:
        if not is_qa_agent(n):
            continue
        if inject(n, push_name):
            injected.append(n["data"].get("label", "?"))
    if not injected:
        print(f"[SKIP] {fname}: no second Q&A to inject")
        continue
    bkp = backup(path)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n[PATCHED] {fname}")
    for lbl in injected:
        print(f"  + injected in: {lbl}")
    print(f"  backup: {bkp}")
    rc, out = push(push_name)
    for line in out.splitlines():
        if "Push successful" in line or "Push failed" in line or "Failed" in line:
            print(f"  {line.strip()}")
