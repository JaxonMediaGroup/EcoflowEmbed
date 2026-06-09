"""
create_wingate.py - Create the Wingate chatbot in Flowise and register it in
projects.json.

Usage:
    python create_wingate.py
    python create_wingate.py --dry-run
"""

from __future__ import annotations

import json
import os
import sys

import requests


DEFAULT_API_KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
DEFAULT_FLOWISE_URL = "https://ecoflow.koppi.mx"
PROJECT_NAME = "Wingate"
JSON_FILE = "projects/Wingate Agents.json"
CATEGORY = "education"

BASE_DIR = os.path.dirname(__file__)
CONFIG_FILE = os.path.join(BASE_DIR, "projects.json")
JSON_PATH = os.path.join(BASE_DIR, JSON_FILE)


def load_config() -> dict:
    with open(CONFIG_FILE, "r", encoding="utf-8") as handle:
        return json.load(handle)


def resolve_api_key(config: dict) -> str:
    env_name = config.get("api_key_env")
    if env_name:
        api_key = os.environ.get(env_name, "").strip()
        if api_key:
            return api_key
    return DEFAULT_API_KEY


def resolve_credential_id(config: dict) -> str:
    credential_id = str(config.get("openai_credential_id", "")).strip()
    if credential_id:
        return credential_id
    raise ValueError("openai_credential_id is missing in projects.json")


def inject_credential(flow_data: dict, credential_id: str) -> int:
    injected = 0
    for node in flow_data.get("nodes", []):
        inputs = node.get("data", {}).get("inputs", {})
        label = node.get("data", {}).get("label", node.get("id"))
        for config_key, model_key in (
            ("agentModelConfig", "agentModel"),
            ("conditionAgentModelConfig", "conditionAgentModel"),
        ):
            config = inputs.get(config_key, {})
            if config and config.get(model_key) == "chatOpenAI":
                config["FLOWISE_CREDENTIAL_ID"] = credential_id
                injected += 1
                print(f"  Credential injected -> {label} ({config_key})")
    return injected


def save_chatflow_id(chatflow_id: str) -> None:
    config = load_config()
    config.setdefault("projects", {})[PROJECT_NAME] = {
        "chatflow_id": chatflow_id,
        "json_file": JSON_FILE,
        "type": "AGENTFLOW",
        "category": CATEGORY,
    }
    with open(CONFIG_FILE, "w", encoding="utf-8") as handle:
        json.dump(config, handle, ensure_ascii=False, indent=2)
    print(f"  Saved to projects.json: {PROJECT_NAME} -> {chatflow_id}")


def build_payload(flow_data: dict) -> dict:
    chatbot_config = {
        "welcomeMessage": "Bienvenido a The Wingate School. Puedo ayudarte con admisiones, programas academicos, horarios, idiomas, instalaciones y actividades. ?Que te gustaria saber?",
        "botMessage": {"backgroundColor": "#f4f6fb", "textColor": "#243447"},
        "userMessage": {"backgroundColor": "#1f5aa6", "textColor": "#ffffff"},
        "textInput": {
            "backgroundColor": "#ffffff",
            "textColor": "#243447",
            "sendButtonColor": "#1f5aa6",
        },
        "chatWindow": {"backgroundColor": "#ffffff"},
        "poweredByTextColor": "#243447",
        "footer": {"company": "The Wingate School", "companyLink": ""},
    }
    return {
        "name": PROJECT_NAME,
        "type": "AGENTFLOW",
        "deployed": True,
        "isPublic": False,
        "flowData": json.dumps(flow_data, ensure_ascii=False),
        "category": CATEGORY,
        "chatbotConfig": json.dumps(chatbot_config, ensure_ascii=False),
    }


def main() -> None:
    dry_run = "--dry-run" in sys.argv
    config = load_config()
    flowise_url = str(config.get("flowise_url", DEFAULT_FLOWISE_URL)).rstrip("/")
    api_key = resolve_api_key(config)
    credential_id = resolve_credential_id(config)

    if not os.path.exists(JSON_PATH):
        print(f"ERROR: JSON file not found: {JSON_PATH}")
        print("Run: python build_wingate.py")
        sys.exit(1)

    with open(JSON_PATH, "r", encoding="utf-8-sig") as handle:
        flow_data = json.load(handle)

    nodes = flow_data.get("nodes", [])
    edges = flow_data.get("edges", [])
    print("\nWingate Chatbot Creator")
    print(f"  File  : {JSON_FILE}")
    print(f"  Nodes : {len(nodes)}")
    print(f"  Edges : {len(edges)}")

    injected = inject_credential(flow_data, credential_id)
    print(f"  Credentials injected: {injected}")

    payload = build_payload(flow_data)
    json.loads(payload["flowData"])
    json.loads(payload["chatbotConfig"])

    if dry_run:
        print("\n[DRY RUN] Validation passed. No changes uploaded.")
        return

    existing = config.get("projects", {}).get(PROJECT_NAME, {})
    if existing.get("chatflow_id"):
        print(f"\nWARNING: {PROJECT_NAME} already has chatflow_id: {existing['chatflow_id']}")
        answer = input("Overwrite and create a NEW chatflow? [y/N]: ").strip().lower()
        if answer != "y":
            print("Aborted.")
            sys.exit(0)

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    print(f"\nCreating chatflow '{PROJECT_NAME}' in Flowise...")
    response = requests.post(
        f"{flowise_url}/api/v1/chatflows",
        headers=headers,
        json=payload,
        timeout=120,
    )

    if response.status_code in (200, 201):
        result = response.json()
        chatflow_id = result.get("id")
        print("\nChatflow created successfully")
        print(f"  Name : {result.get('name')}")
        print(f"  ID   : {chatflow_id}")
        print(f"  URL  : {flowise_url}/agentcanvas/{chatflow_id}")
        save_chatflow_id(chatflow_id)
        return

    print(f"\nFailed to create chatflow: {response.status_code}")
    print(f"  {response.text[:500]}")
    sys.exit(1)


if __name__ == "__main__":
    main()