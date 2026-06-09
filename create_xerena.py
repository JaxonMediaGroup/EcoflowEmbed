"""
create_xerena.py — Create the Xerena chatbot in Flowise and register it in projects.json.

Usage:
    python create_xerena.py            # Create new chatflow in Flowise
    python create_xerena.py --dry-run  # Validate JSON without uploading

After running, the new chatflow_id is saved automatically to projects.json.
"""
import requests
import json
import sys
import os

FLOWISE_URL = "https://ecoflow.koppi.mx"
API_KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
CREDENTIAL_ID = "e8fe03f6-9865-4abf-a662-ebdfe5561c5a"
PROJECT_NAME = "Xerena"
JSON_FILE = "projects/Xerena Agents.json"
CATEGORY = "real-estate"

BASE_DIR = os.path.dirname(__file__)
CONFIG_FILE = os.path.join(BASE_DIR, "projects.json")
JSON_PATH = os.path.join(BASE_DIR, JSON_FILE)

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}


def inject_credential(flow_data):
    """Inject OpenAI credential ID into all chatOpenAI model configs."""
    injected = 0
    for node in flow_data.get("nodes", []):
        inputs = node.get("data", {}).get("inputs", {})
        label = node.get("data", {}).get("label", node.get("id"))
        for config_key, model_key in [
            ("agentModelConfig", "agentModel"),
            ("conditionAgentModelConfig", "conditionAgentModel"),
        ]:
            cfg = inputs.get(config_key, {})
            if cfg and cfg.get(model_key) == "chatOpenAI":
                cfg["FLOWISE_CREDENTIAL_ID"] = CREDENTIAL_ID
                print(f"  Credential injected → {label} ({config_key})")
                injected += 1
    return injected


def load_projects():
    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_chatflow_id(chatflow_id):
    config = load_projects()
    config["projects"][PROJECT_NAME] = {
        "chatflow_id": chatflow_id,
        "json_file": JSON_FILE,
        "type": "AGENTFLOW",
        "category": CATEGORY,
    }
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(config, f, ensure_ascii=False, indent=2)
    print(f"  Saved to projects.json: {PROJECT_NAME} → {chatflow_id}")


def main():
    dry_run = "--dry-run" in sys.argv

    # 1. Load JSON
    if not os.path.exists(JSON_PATH):
        print(f"ERROR: JSON file not found: {JSON_PATH}")
        sys.exit(1)

    with open(JSON_PATH, "r", encoding="utf-8-sig") as f:
        flow_data = json.load(f)

    nodes = flow_data.get("nodes", [])
    edges = flow_data.get("edges", [])
    print(f"\nXerena Chatbot Creator")
    print(f"  File  : {JSON_FILE}")
    print(f"  Nodes : {len(nodes)}")
    print(f"  Edges : {len(edges)}")

    # 2. Inject credentials
    injected = inject_credential(flow_data)
    print(f"  Credentials injected: {injected}")

    if dry_run:
        print("\n[DRY RUN] Validation passed. No changes uploaded.")
        return

    # 3. Check if already exists in projects.json
    config = load_projects()
    existing = config.get("projects", {}).get(PROJECT_NAME, {})
    if existing.get("chatflow_id"):
        print(f"\nWARNING: {PROJECT_NAME} already has chatflow_id: {existing['chatflow_id']}")
        answer = input("Overwrite and create a NEW chatflow? [y/N]: ").strip().lower()
        if answer != "y":
            print("Aborted.")
            sys.exit(0)

    # 4. Create chatflow via POST
    payload = {
        "name": PROJECT_NAME,
        "type": "AGENTFLOW",
        "deployed": True,
        "isPublic": False,
        "flowData": json.dumps(flow_data, ensure_ascii=False),
        "category": CATEGORY,
        "chatbotConfig": json.dumps({
            "welcomeMessage": "¡Bienvenido a Xerena Cabo Tezal! Soy tu asesor especializado. ¿En qué puedo ayudarte hoy? 🌊",
            "botMessage": {"backgroundColor": "#f7f8ff", "textColor": "#303235"},
            "userMessage": {"backgroundColor": "#1b4f72", "textColor": "#ffffff"},
            "textInput": {"backgroundColor": "#ffffff", "textColor": "#303235", "sendButtonColor": "#1b4f72"},
            "chatWindow": {"backgroundColor": "#ffffff"},
            "poweredByTextColor": "#303235",
            "footer": {"company": "DIT Desarrollo Inmobiliario", "companyLink": "https://www.ditdesarrollo.com"}
        }),
    }

    print(f"\nCreating chatflow '{PROJECT_NAME}' in Flowise...")
    r = requests.post(
        f"{FLOWISE_URL}/api/v1/chatflows",
        headers=HEADERS,
        json=payload,
    )

    if r.status_code in (200, 201):
        result = r.json()
        chatflow_id = result.get("id")
        print(f"\n✅ Chatflow created successfully!")
        print(f"   Name : {result.get('name')}")
        print(f"   ID   : {chatflow_id}")
        print(f"   URL  : {FLOWISE_URL}/agentcanvas/{chatflow_id}")
        save_chatflow_id(chatflow_id)
    else:
        print(f"\n❌ Failed to create chatflow: {r.status_code}")
        print(f"   {r.text[:500]}")
        sys.exit(1)


if __name__ == "__main__":
    main()
