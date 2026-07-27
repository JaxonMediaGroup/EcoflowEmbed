"""Create, register, update, and verify the Real Alcalá Sur Agentflow in Ecoflow."""

from __future__ import annotations

import json
import os
import sys
import types
import urllib.error
import urllib.request

# Reuse the project's legacy fallback credential without requiring the requests package.
sys.modules.setdefault("requests", types.ModuleType("requests"))
from create_wingate import DEFAULT_API_KEY


DEFAULT_FLOWISE_URL = "https://ecoflow.koppi.mx"
PROJECT_NAME = "Real Alcalá Sur"
JSON_FILE = "projects/Real Alcalá Sur Agents.json"
CATEGORY = "real-estate"
BASE_DIR = os.path.dirname(__file__)
CONFIG_FILE = os.path.join(BASE_DIR, "projects.json")
JSON_PATH = os.path.join(BASE_DIR, JSON_FILE)


def load_config() -> dict:
    with open(CONFIG_FILE, "r", encoding="utf-8") as handle:
        return json.load(handle)


def resolve_api_key(config: dict) -> str:
    env_name = str(config.get("api_key_env", "")).strip()
    api_key = os.environ.get(env_name, "").strip() if env_name else ""
    return api_key or DEFAULT_API_KEY


def resolve_credential_id(config: dict) -> str:
    credential_id = str(config.get("openai_credential_id", "")).strip()
    if not credential_id:
        raise RuntimeError("openai_credential_id is missing in projects.json")
    return credential_id


def inject_credential(flow_data: dict, credential_id: str) -> int:
    injected = 0
    for node in flow_data.get("nodes", []):
        inputs = node.get("data", {}).get("inputs", {})
        for config_key, model_key in (
            ("agentModelConfig", "agentModel"),
            ("conditionAgentModelConfig", "conditionAgentModel"),
        ):
            config = inputs.get(config_key)
            if isinstance(config, dict) and config.get(model_key) == "chatOpenAI":
                config["FLOWISE_CREDENTIAL_ID"] = credential_id
                injected += 1
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
        "welcomeMessage": (
            "Bienvenido a Real Alcalá Sur. Puedo ayudarte con tipologías, metrajes, "
            "amenidades, ubicación, proceso de compra y visitas. ¿Qué te gustaría saber?"
        ),
        "botMessage": {"backgroundColor": "#f7f4ef", "textColor": "#2f2a26"},
        "userMessage": {"backgroundColor": "#8a5a34", "textColor": "#ffffff"},
        "textInput": {
            "backgroundColor": "#ffffff",
            "textColor": "#2f2a26",
            "sendButtonColor": "#8a5a34",
        },
        "chatWindow": {"backgroundColor": "#ffffff"},
        "poweredByTextColor": "#2f2a26",
        "footer": {
            "company": "Real Alcalá",
            "companyLink": "http://realalcala.com",
        },
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


def api_request(
    url: str,
    api_key: str,
    *,
    method: str = "GET",
    payload: dict | None = None,
) -> tuple[int, str]:
    body = (
        json.dumps(payload, ensure_ascii=False).encode("utf-8")
        if payload is not None
        else None
    )
    request = urllib.request.Request(
        url,
        data=body,
        headers={
            "Authorization": f"Bearer {api_key}",
            **({"Content-Type": "application/json"} if body is not None else {}),
        },
        method=method,
    )
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            return response.status, response.read().decode("utf-8")
    except urllib.error.HTTPError as exc:
        error_body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(
            f"Ecoflow request failed ({exc.code}): {error_body[:500]}"
        ) from exc


def verify_remote(flowise_url: str, api_key: str, chatflow_id: str) -> dict:
    status, body = api_request(
        f"{flowise_url}/api/v1/chatflows/{chatflow_id}", api_key
    )
    if status != 200:
        raise RuntimeError(f"Unexpected Ecoflow verification status: {status}")
    result = json.loads(body)
    remote_flow = json.loads(result.get("flowData") or "{}")
    labels = {
        node.get("data", {}).get("label")
        for node in remote_flow.get("nodes", [])
    }
    required_labels = {
        "Real Alcalá Sur Router",
        "Real Alcalá Sur Q&A",
        "Real Alcalá Sur Leads",
        "Real Alcalá Sur Off-Topic Guard",
    }
    missing = required_labels - labels
    if missing:
        raise RuntimeError(f"Remote flow is missing nodes: {sorted(missing)}")
    if result.get("name") != PROJECT_NAME or result.get("type") != "AGENTFLOW":
        raise RuntimeError("Remote flow metadata does not match Real Alcalá Sur")
    if not result.get("deployed"):
        raise RuntimeError("Remote flow exists but is not deployed")
    print("Remote verification passed")
    print(f"  Name    : {result.get('name')}")
    print(f"  ID      : {chatflow_id}")
    print(f"  Type    : {result.get('type')}")
    print(f"  Deployed: {result.get('deployed')}")
    print(f"  Nodes   : {len(remote_flow.get('nodes', []))}")
    return result


def smoke_test_remote(flowise_url: str, api_key: str, chatflow_id: str) -> None:
    questions = [
        "¿Cuántos baños y cajones de estacionamiento tiene Montjüic?",
        "¿Cuál es el precio y la disponibilidad de Scordia hoy?",
        "What time are you open?",
    ]
    for question in questions:
        status, body = api_request(
            f"{flowise_url}/api/v1/prediction/{chatflow_id}",
            api_key,
            method="POST",
            payload={"question": question},
        )
        if status != 200:
            raise RuntimeError(f"Prediction smoke test failed ({status})")
        result = json.loads(body)
        answer = str(result.get("text") or result.get("answer") or "").strip()
        if not answer:
            raise RuntimeError("Prediction smoke test returned an empty answer")
        print("Prediction smoke test passed")
        print(f"  Question: {question}")
        print(f"  Answer  : {answer}")


def main() -> None:
    dry_run = "--dry-run" in sys.argv
    verify = "--verify" in sys.argv
    smoke_test = "--smoke-test" in sys.argv
    update = "--update" in sys.argv
    config = load_config()
    flowise_url = str(config.get("flowise_url", DEFAULT_FLOWISE_URL)).rstrip("/")
    api_key = resolve_api_key(config)
    credential_id = resolve_credential_id(config)
    existing = config.get("projects", {}).get(PROJECT_NAME, {})

    if verify:
        chatflow_id = existing.get("chatflow_id")
        if not chatflow_id:
            raise RuntimeError(f"No registered chatflow id for {PROJECT_NAME}")
        verify_remote(flowise_url, api_key, chatflow_id)
        if smoke_test:
            smoke_test_remote(flowise_url, api_key, chatflow_id)
        print(f"  Canvas  : {flowise_url}/agentcanvas/{chatflow_id}")
        print(f"  Endpoint: {flowise_url}/api/v1/prediction/{chatflow_id}")
        return

    if not os.path.exists(JSON_PATH):
        raise FileNotFoundError(f"Run build_real_alcala_sur.py first: {JSON_PATH}")

    with open(JSON_PATH, "r", encoding="utf-8-sig") as handle:
        flow_data = json.load(handle)

    injected = inject_credential(flow_data, credential_id)
    payload = build_payload(flow_data)
    json.loads(payload["flowData"])
    json.loads(payload["chatbotConfig"])

    print("Real Alcalá Sur Chatbot Creator")
    print(f"  Nodes: {len(flow_data.get('nodes', []))}")
    print(f"  Edges: {len(flow_data.get('edges', []))}")
    print(f"  Credentials injected: {injected}")
    if injected < 4:
        raise RuntimeError("Expected credentials in the router and three agent nodes")

    if dry_run:
        print("[DRY RUN] Validation passed. No changes uploaded.")
        return

    if update:
        chatflow_id = existing.get("chatflow_id")
        if not chatflow_id:
            raise RuntimeError(f"No registered chatflow id for {PROJECT_NAME}")
        status, _ = api_request(
            f"{flowise_url}/api/v1/chatflows/{chatflow_id}",
            api_key,
            method="PUT",
            payload=payload,
        )
        if status != 200:
            raise RuntimeError(f"Failed to update chatflow ({status})")
    else:
        if existing.get("chatflow_id"):
            raise RuntimeError(
                f"{PROJECT_NAME} already exists with chatflow_id "
                f"{existing['chatflow_id']}; use --update"
            )
        status, body = api_request(
            f"{flowise_url}/api/v1/chatflows",
            api_key,
            method="POST",
            payload=payload,
        )
        if status not in (200, 201):
            raise RuntimeError(f"Failed to create chatflow ({status})")
        result = json.loads(body)
        chatflow_id = result.get("id")
        if not chatflow_id:
            raise RuntimeError("Ecoflow response did not include a chatflow id")
        save_chatflow_id(chatflow_id)

    verify_remote(flowise_url, api_key, chatflow_id)
    print(f"  Canvas  : {flowise_url}/agentcanvas/{chatflow_id}")
    print(f"  Endpoint: {flowise_url}/api/v1/prediction/{chatflow_id}")


if __name__ == "__main__":
    main()
