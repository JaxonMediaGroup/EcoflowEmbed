"""
Remove duplicate entries in agentMessages arrays for all chatbots.
Some bots have the same system message appearing twice in the array
(likely from a Flowise bug or prior double-injection).
"""
import json
import requests
from pathlib import Path

ROOT = Path(__file__).parent.parent
PROJECTS_JSON = ROOT / "projects.json"

FLOWISE_URL = "https://ecoflow.koppi.mx"
API_KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}


def dedup_messages(flow_data: dict) -> list[str]:
    """
    Remove duplicate entries in agentMessages for every Agent node.
    Returns list of node labels that were modified.
    """
    modified = []
    for node in flow_data.get("nodes", []):
        d = node.get("data", {})
        if d.get("type") != "Agent":
            continue
        label = d.get("label", "?")
        inputs = d.get("inputs", {})
        msgs = inputs.get("agentMessages")
        if not msgs or not isinstance(msgs, list):
            continue

        seen = []
        unique = []
        for msg in msgs:
            key = (msg.get("role"), msg.get("content"))
            if key not in seen:
                seen.append(key)
                unique.append(msg)

        if len(unique) < len(msgs):
            removed = len(msgs) - len(unique)
            inputs["agentMessages"] = unique
            modified.append(f"{label} ({removed} duplicate(s) removed)")

    return modified


def fetch_flow_data(chatflow_id: str) -> tuple[dict, dict]:
    r = requests.get(
        f"{FLOWISE_URL}/api/v1/chatflows/{chatflow_id}",
        headers={"Authorization": f"Bearer {API_KEY}"},
        timeout=20,
    )
    r.raise_for_status()
    server = r.json()
    flow_data = json.loads(server["flowData"])
    return server, flow_data


def push_flow(chatflow_id: str, server_meta: dict, flow_data: dict) -> bool:
    flow_str = json.dumps(flow_data, ensure_ascii=False)
    body = {"flowData": flow_str}
    for key in ("chatbotConfig", "apiConfig", "analytic", "speechToText", "category", "type"):
        if server_meta.get(key):
            body[key] = server_meta[key]
    r = requests.put(
        f"{FLOWISE_URL}/api/v1/chatflows/{chatflow_id}",
        headers=HEADERS,
        json=body,
        timeout=30,
    )
    return r.status_code == 200


def main():
    projects = json.loads(PROJECTS_JSON.read_text(encoding="utf-8"))
    all_projects = projects["projects"]

    total_modified = 0
    total_clean = 0
    total_fail = 0

    for name, info in all_projects.items():
        chatflow_id = info["chatflow_id"]
        json_file = ROOT / info["json_file"] if info.get("json_file") else None

        try:
            server_meta, flow_data = fetch_flow_data(chatflow_id)
        except Exception as e:
            print(f"[{name}] ❌ Download failed: {e}")
            total_fail += 1
            continue

        modified = dedup_messages(flow_data)

        if not modified:
            total_clean += 1
            continue

        print(f"\n[{name}]")
        for m in modified:
            print(f"  🧹 {m}")

        # Save locally
        if json_file:
            json_file.parent.mkdir(parents=True, exist_ok=True)
            json_file.write_text(
                json.dumps({"nodes": flow_data["nodes"], "edges": flow_data.get("edges", [])},
                           ensure_ascii=False, indent=2),
                encoding="utf-8",
            )

        # Push
        if push_flow(chatflow_id, server_meta, flow_data):
            print(f"  🚀 Push successful")
            total_modified += 1
        else:
            print(f"  ❌ Push failed")
            total_fail += 1

    print(f"\n{'='*50}")
    print(f"Done: {total_modified} cleaned, {total_clean} already clean, {total_fail} failed")


if __name__ == "__main__":
    main()
