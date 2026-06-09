"""
push.py — Unified push script for all Flowise projects.

Usage:
    python push.py WTC
    python push.py "Anahuac Orientador Vocacional"
    python push.py --list          # Show all projects
    python push.py --dry-run WTC   # Validate without uploading

Reads project config from projects.json.
"""
import requests
import json
import sys
import os

CONFIG_FILE = os.path.join(os.path.dirname(__file__), "projects.json")


def load_config():
    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def find_project(config, name):
    """Find project by exact or partial name match (case-insensitive)."""
    projects = config["projects"]
    # Exact match
    if name in projects:
        return name, projects[name]
    # Case-insensitive match
    for pname, pdata in projects.items():
        if pname.lower() == name.lower():
            return pname, pdata
    # Partial match
    matches = [(pname, pdata) for pname, pdata in projects.items() if name.lower() in pname.lower()]
    if len(matches) == 1:
        return matches[0]
    if len(matches) > 1:
        print(f"Ambiguous name '{name}'. Matches:")
        for m, _ in matches:
            print(f"  - {m}")
        sys.exit(1)
    return None, None


def inject_credentials(flow_data, server_flow, credential_id):
    """Inject FLOWISE_CREDENTIAL_ID into all chatOpenAI model configs."""
    injected = 0
    for node in flow_data.get("nodes", []):
        nid = node.get("id") or node.get("data", {}).get("id")
        inputs = node.get("data", {}).get("inputs", {})
        label = node.get("data", {}).get("label", nid)

        for config_key, model_key in [
            ("agentModelConfig", "agentModel"),
            ("conditionAgentModelConfig", "conditionAgentModel"),
        ]:
            cfg = inputs.get(config_key, {})
            if cfg and cfg.get(model_key) == "chatOpenAI":
                cfg["FLOWISE_CREDENTIAL_ID"] = credential_id
                print(f"  {label}: {config_key} = {credential_id[:8]}...")
                injected += 1

    return injected


def push(project_name, dry_run=False):
    config = load_config()
    name, project = find_project(config, project_name)
    if not project:
        print(f"Project '{project_name}' not found. Use --list to see available projects.")
        sys.exit(1)

    chatflow_id = project.get("chatflow_id")
    json_file = project.get("json_file")

    if not chatflow_id:
        print(f"Project '{name}' has no chatflow_id configured.")
        sys.exit(1)
    if not json_file:
        print(f"Project '{name}' has no json_file configured.")
        sys.exit(1)

    json_path = os.path.join(os.path.dirname(__file__), json_file)
    if not os.path.exists(json_path):
        print(f"JSON file not found: {json_path}")
        sys.exit(1)

    api_key = os.environ.get("FLOWISE_API_KEY", config.get("api_key_env", ""))
    # Fallback: try reading from push_wtc.py style hardcoded (for backwards compat)
    if not api_key or api_key == "FLOWISE_API_KEY":
        api_key = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"

    flowise_url = config.get("flowise_url", "https://ecoflow.koppi.mx")
    credential_id = config.get("openai_credential_id", "e8fe03f6-9865-4abf-a662-ebdfe5561c5a")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    # 1. Read local JSON
    print(f"\n{'[DRY RUN] ' if dry_run else ''}Pushing: {name}")
    print(f"  File: {json_file}")
    print(f"  Chatflow: {chatflow_id}")

    with open(json_path, "r", encoding="utf-8-sig") as f:
        flow_data = json.load(f)

    nodes = flow_data.get("nodes", [])
    edges = flow_data.get("edges", [])
    print(f"  Nodes: {len(nodes)}, Edges: {len(edges)}")

    # 2. Get current chatflow from server
    r = requests.get(f"{flowise_url}/api/v1/chatflows/{chatflow_id}", headers=headers)
    if r.status_code != 200:
        print(f"  Failed to fetch chatflow: {r.status_code} {r.text[:200]}")
        sys.exit(1)

    current = r.json()
    server_flow = json.loads(current.get("flowData", "{}"))
    print(f"  Server: {current['name']} ({len(server_flow.get('nodes', []))} nodes)")

    # 3. Inject credentials
    injected = inject_credentials(flow_data, server_flow, credential_id)
    print(f"  Credentials injected: {injected}")

    if dry_run:
        print("\n  [DRY RUN] Validation passed. No changes uploaded.")
        return

    # 4. Upload
    flow_data_str = json.dumps(flow_data, ensure_ascii=False)
    update_body = {"flowData": flow_data_str}
    for key in ("chatbotConfig", "apiConfig", "analytic", "speechToText", "category", "type"):
        if current.get(key):
            update_body[key] = current[key]

    r2 = requests.put(
        f"{flowise_url}/api/v1/chatflows/{chatflow_id}",
        headers=headers,
        json=update_body,
    )

    if r2.status_code == 200:
        print(f"\n  Push successful: {name}")
    else:
        print(f"\n  Push failed: {r2.status_code}")
        print(f"  {r2.text[:500]}")
        sys.exit(1)


def list_projects():
    config = load_config()
    projects = config["projects"]
    print(f"\n{'Name':<40} {'Chatflow ID':<40} {'JSON File':<50} {'Category'}")
    print("=" * 170)
    for name, p in sorted(projects.items()):
        cid = (p.get("chatflow_id") or "-")[:36]
        jf = p.get("json_file") or "-"
        cat = p.get("category", "-")
        has_file = ""
        if p.get("json_file"):
            path = os.path.join(os.path.dirname(__file__), p["json_file"])
            has_file = " [local]" if os.path.exists(path) else " [missing]"
        print(f"  {name:<38} {cid:<40} {jf}{has_file:<20} {cat}")
    print(f"\nTotal: {len(projects)} projects")


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args or "--help" in args or "-h" in args:
        print(__doc__)
        sys.exit(0)
    if "--list" in args:
        list_projects()
        sys.exit(0)

    dry_run = "--dry-run" in args
    project_args = [a for a in args if not a.startswith("--")]
    if not project_args:
        print("Please specify a project name. Use --list to see available projects.")
        sys.exit(1)

    project_name = " ".join(project_args)
    push(project_name, dry_run=dry_run)
