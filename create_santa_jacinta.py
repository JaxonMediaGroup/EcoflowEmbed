"""Create and register the LST Santa Jacinta Agentflow in Ecoflow."""

from __future__ import annotations

import json
import os
import sys
import types
import urllib.error
import urllib.request

# The legacy helper module imports requests even though the helpers used here do not.
# Provide a harmless placeholder so this creator can run with Python's standard library.
sys.modules.setdefault("requests", types.ModuleType("requests"))
from create_wingate import inject_credential, load_config, resolve_api_key, resolve_credential_id


DEFAULT_FLOWISE_URL = "https://ecoflow.koppi.mx"
PROJECT_NAME = "LST Santa Jacinta"
JSON_FILE = "projects/LST Santa Jacinta Agents.json"
CATEGORY = "real-estate"
BASE_DIR = os.path.dirname(__file__)
CONFIG_FILE = os.path.join(BASE_DIR, "projects.json")
JSON_PATH = os.path.join(BASE_DIR, JSON_FILE)


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
        "welcomeMessage": (
            "Bienvenido a Santa Jacinta. Puedo ayudarte con lotes, amenidades, "
            "ubicacion, mantenimiento, showroom y contacto con asesores. "
            "¿Que te gustaria saber?"
        ),
        "botMessage": {"backgroundColor": "#f4f1e8", "textColor": "#26352c"},
        "userMessage": {"backgroundColor": "#315b45", "textColor": "#ffffff"},
        "textInput": {
            "backgroundColor": "#ffffff",
            "textColor": "#26352c",
            "sendButtonColor": "#315b45",
        },
        "chatWindow": {"backgroundColor": "#ffffff"},
        "poweredByTextColor": "#26352c",
        "footer": {"company": "Santa Jacinta", "companyLink": ""},
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


def verify_remote(flowise_url: str, api_key: str, chatflow_id: str) -> None:
    request = urllib.request.Request(
        f"{flowise_url}/api/v1/chatflows/{chatflow_id}",
        headers={"Authorization": f"Bearer {api_key}"},
        method="GET",
    )
    with urllib.request.urlopen(request, timeout=120) as response:
        result = json.loads(response.read().decode("utf-8"))
    remote_flow = json.loads(result.get("flowData") or "{}")
    models = sorted(
        {
            config.get("modelName")
            for node in remote_flow.get("nodes", [])
            for config in (
                node.get("data", {}).get("inputs", {}).get("agentModelConfig"),
                node.get("data", {}).get("inputs", {}).get("conditionAgentModelConfig"),
            )
            if isinstance(config, dict) and config.get("modelName")
        }
    )
    print("Remote verification passed")
    print(f"  Name    : {result.get('name')}")
    print(f"  Type    : {result.get('type')}")
    print(f"  Deployed: {result.get('deployed')}")
    print(f"  Nodes   : {len(remote_flow.get('nodes', []))}")
    print(f"  Models  : {', '.join(models)}")


def main() -> None:
    dry_run = "--dry-run" in sys.argv
    verify = "--verify" in sys.argv
    update = "--update" in sys.argv
    config = load_config()
    flowise_url = str(config.get("flowise_url", DEFAULT_FLOWISE_URL)).rstrip("/")
    api_key = resolve_api_key(config)
    credential_id = resolve_credential_id(config)

    if verify:
        existing = config.get("projects", {}).get(PROJECT_NAME, {})
        chatflow_id = existing.get("chatflow_id")
        if not chatflow_id:
            raise RuntimeError(f"No registered chatflow id for {PROJECT_NAME}")
        verify_remote(flowise_url, api_key, chatflow_id)
        return

    if not os.path.exists(JSON_PATH):
        raise FileNotFoundError(f"Run build_santa_jacinta.py first: {JSON_PATH}")

    with open(JSON_PATH, "r", encoding="utf-8-sig") as handle:
        flow_data = json.load(handle)

    injected = inject_credential(flow_data, credential_id)
    payload = build_payload(flow_data)
    json.loads(payload["flowData"])
    json.loads(payload["chatbotConfig"])

    print("LST Santa Jacinta Chatbot Creator")
    print(f"  Nodes: {len(flow_data.get('nodes', []))}")
    print(f"  Edges: {len(flow_data.get('edges', []))}")
    print(f"  Credentials injected: {injected}")

    if dry_run:
        print("[DRY RUN] Validation passed. No changes uploaded.")
        return

    existing = config.get("projects", {}).get(PROJECT_NAME, {})
    if update:
        chatflow_id = existing.get("chatflow_id")
        if not chatflow_id:
            raise RuntimeError(f"No registered chatflow id for {PROJECT_NAME}")
        request = urllib.request.Request(
            f"{flowise_url}/api/v1/chatflows/{chatflow_id}",
            data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            method="PUT",
        )
        try:
            with urllib.request.urlopen(request, timeout=120) as response:
                status = response.status
                body = response.read().decode("utf-8")
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(
                f"Failed to update chatflow ({exc.code}): {body[:500]}"
            ) from exc
        if status != 200:
            raise RuntimeError(f"Failed to update chatflow ({status}): {body[:500]}")
        print("Chatflow updated successfully")
        print(f"  ID  : {chatflow_id}")
        print(f"  URL : {flowise_url}/agentcanvas/{chatflow_id}")
        return

    if existing.get("chatflow_id"):
        raise RuntimeError(
            f"{PROJECT_NAME} already exists with chatflow_id {existing['chatflow_id']}"
        )

    request = urllib.request.Request(
        f"{flowise_url}/api/v1/chatflows",
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            status = response.status
            body = response.read().decode("utf-8")
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(
            f"Failed to create chatflow ({exc.code}): {body[:500]}"
        ) from exc
    if status not in (200, 201):
        raise RuntimeError(f"Failed to create chatflow ({status}): {body[:500]}")

    result = json.loads(body)
    chatflow_id = result.get("id")
    if not chatflow_id:
        raise RuntimeError("Ecoflow response did not include a chatflow id")

    print("Chatflow created successfully")
    print(f"  Name: {result.get('name')}")
    print(f"  ID  : {chatflow_id}")
    print(f"  URL : {flowise_url}/agentcanvas/{chatflow_id}")
    save_chatflow_id(chatflow_id)


if __name__ == "__main__":
    main()
