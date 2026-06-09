"""Rebase local project JSON files from a remote backup snapshot.

Usage:
    python scripts/rebase_projects_from_snapshot.py backups_remote_20260603_132418
    python scripts/rebase_projects_from_snapshot.py backups_remote_20260603_132418 --apply
"""

from __future__ import annotations

import argparse
import json
import shutil
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
PROJECTS_JSON = REPO_ROOT / "projects.json"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("snapshot_dir", help="Snapshot folder created by scripts/sync_remote_chatflows.py")
    parser.add_argument("--apply", action="store_true", help="Write files and update projects.json")
    return parser.parse_args()


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def canonical_json_path(relative_path: str) -> str:
    return relative_path[:-4] if relative_path.endswith(".bak") else relative_path


def default_json_path(project_name: str) -> str:
    return f"projects/{project_name} Agents.json"


def main() -> int:
    args = parse_args()
    snapshot_dir = (REPO_ROOT / args.snapshot_dir).resolve()
    audit_path = snapshot_dir / "reports" / "audit_summary.json"

    if not snapshot_dir.exists():
        print(f"Snapshot folder not found: {snapshot_dir}")
        return 1
    if not audit_path.exists():
        print(f"Audit summary not found: {audit_path}")
        return 1

    projects_config = load_json(PROJECTS_JSON)
    audits = load_json(audit_path)

    planned = []
    missing_sources = []

    for item in audits:
        registered_name = item.get("registered_name")
        local_json_file = item.get("local_json_file")
        flow_file = item.get("flow_file")
        if not registered_name or not flow_file:
            continue

        if not local_json_file:
            local_json_file = default_json_path(registered_name)

        source_path = REPO_ROOT / flow_file
        if not source_path.exists():
            missing_sources.append(str(source_path))
            continue

        target_rel = canonical_json_path(local_json_file)
        target_path = REPO_ROOT / target_rel
        old_path = REPO_ROOT / local_json_file
        planned.append(
            {
                "project": registered_name,
                "source_path": source_path,
                "target_rel": target_rel,
                "target_path": target_path,
                "old_rel": local_json_file,
                "old_path": old_path,
            }
        )

    print(f"Snapshot          : {snapshot_dir}")
    print(f"Registered rebases: {len(planned)}")
    print(f"Missing sources   : {len(missing_sources)}")

    bak_targets = sum(1 for item in planned if item["old_rel"].endswith(".bak"))
    print(f"Projects on .bak  : {bak_targets}")

    for item in planned[:15]:
        print(f"  {item['project']}: {item['target_rel']}")
    if len(planned) > 15:
        print(f"  ... and {len(planned) - 15} more")

    if missing_sources:
        print("\nMissing snapshot flow files:")
        for path in missing_sources[:20]:
            print(f"  {path}")
        return 1

    if not args.apply:
        print("\n[DRY RUN] No files written. Re-run with --apply to update the repo.")
        return 0

    for item in planned:
        item["target_path"].parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(item["source_path"], item["target_path"])

        project = projects_config["projects"].get(item["project"])
        if project is not None:
            project["json_file"] = item["target_rel"].replace("\\", "/")

        if item["old_rel"].endswith(".bak") and item["old_path"].exists() and item["old_path"] != item["target_path"]:
            item["old_path"].unlink()

    with PROJECTS_JSON.open("w", encoding="utf-8") as handle:
        json.dump(projects_config, handle, ensure_ascii=False, indent=2)
        handle.write("\n")

    bak_remaining = [
        project["json_file"]
        for project in projects_config.get("projects", {}).values()
        if str(project.get("json_file", "")).endswith(".bak")
    ]

    print("\nRebase completed")
    print(f"  projects.json updated : {PROJECTS_JSON}")
    print(f"  Canonical files synced: {len(planned)}")
    print(f"  .bak refs remaining   : {len(bak_remaining)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())