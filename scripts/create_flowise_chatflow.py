"""Create a new Flowise chatflow from a local agentflow JSON file."""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path

import requests


ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "projects.json"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("name", help="Name for the new Flowise chatflow")
    parser.add_argument("json_file", help="Agentflow JSON path relative to the repository")
    parser.add_argument(
        "--source-project",
        required=True,
        help="Existing project whose remote metadata should be copied",
    )
    parser.add_argument("--category", default="coworking")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    api_key = os.getenv("FLOWISE_API_KEY", "").strip()
    if not api_key:
        raise SystemExit("FLOWISE_API_KEY is required")

    with CONFIG_PATH.open("r", encoding="utf-8-sig") as handle:
        config = json.load(handle)

    source = config["projects"].get(args.source_project)
    if not source:
        raise SystemExit(f"Unknown source project: {args.source_project}")

    flow_path = (ROOT / args.json_file).resolve()
    if ROOT not in flow_path.parents or not flow_path.is_file():
        raise SystemExit(f"Invalid agentflow path: {flow_path}")

    with flow_path.open("r", encoding="utf-8-sig") as handle:
        flow = json.load(handle)

    flowise_url = config.get("flowise_url", "https://ecoflow.koppi.mx").rstrip("/")
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }

    source_response = requests.get(
        f"{flowise_url}/api/v1/chatflows/{source['chatflow_id']}",
        headers=headers,
        timeout=45,
    )
    source_response.raise_for_status()
    source_remote = source_response.json()

    flow_data = {
        "nodes": flow.get("nodes", []),
        "edges": flow.get("edges", []),
        "viewport": flow.get("viewport", {"x": 0, "y": 0, "zoom": 1}),
    }
    payload = {
        "name": args.name,
        "flowData": json.dumps(flow_data, ensure_ascii=False),
        "deployed": source_remote.get("deployed", True),
        "isPublic": source_remote.get("isPublic", False),
        "apikeyid": source_remote.get("apikeyid"),
        "chatbotConfig": source_remote.get("chatbotConfig"),
        "apiConfig": source_remote.get("apiConfig"),
        "analytic": source_remote.get("analytic"),
        "speechToText": source_remote.get("speechToText"),
        "category": args.category,
        "type": source_remote.get("type", source.get("type", "AGENTFLOW")),
    }

    create_response = requests.post(
        f"{flowise_url}/api/v1/chatflows",
        headers=headers,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        timeout=60,
    )
    create_response.raise_for_status()
    created = create_response.json()
    created_id = str(created.get("id", "")).strip()
    if not created_id:
        raise RuntimeError(f"Flowise response did not include an id: {created}")

    print(json.dumps({"id": created_id, "name": created.get("name", args.name)}))


if __name__ == "__main__":
    main()
