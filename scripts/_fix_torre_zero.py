"""
Fix Torre Zero Centro de Negocios and Torre Zero Providencia:
1. Add forbidden-document-phrases rule to the Q&A agent system prompt
2. Push both to the Flowise server
"""
import json
import sys
import requests
from pathlib import Path

ROOT = Path(__file__).parent.parent
PROJECTS_JSON = ROOT / "projects.json"

FLOWISE_URL = "https://ecoflow.koppi.mx"
API_KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
CREDENTIAL_ID = "10ca0bac-6033-4f4f-aff2-d5c35aef4580"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

FORBIDDEN_BLOCK = """\n\n**🚫 FRASES ESTRICTAMENTE PROHIBIDAS:**\n- NUNCA uses frases como: "según el documento", "el documento menciona", "de acuerdo con el documento", "no se menciona en el documento", "no viene en el documento", "el documento no incluye", "según la ficha", "en la ficha", "la ficha indica", "la ficha menciona", "la ficha no incluye", "according to the document", "the document states", "based on the provided document", "not mentioned in the document".\n- NUNCA reveles que estás consultando un documento, ficha, archivo o fuente de datos externa.\n- Responde naturalmente como un experto que conoce el proyecto. Ejemplo: en lugar de "Según el documento, el precio es..." di simplemente "El precio es..."\n"""

TARGETS = [
    "Torre Zero Centro de Neogcios",
    "Torre Zero Providencia",
]


def inject_credentials(flow_data: dict) -> int:
    injected = 0
    for node in flow_data.get("nodes", []):
        inputs = node.get("data", {}).get("inputs", {})
        for cfg_key, model_key in [
            ("agentModelConfig", "agentModel"),
            ("conditionAgentModelConfig", "conditionAgentModel"),
        ]:
            cfg = inputs.get(cfg_key)
            if isinstance(cfg, dict) and cfg.get(model_key) == "chatOpenAI":
                cfg["FLOWISE_CREDENTIAL_ID"] = CREDENTIAL_ID
                injected += 1
    return injected


def add_forbidden_block(flow_data: dict, project_name: str) -> bool:
    """Add forbidden phrases block to Q&A agent system prompt. Returns True if modified."""
    modified = False
    for node in flow_data.get("nodes", []):
        d = node.get("data", {})
        if d.get("type") != "Agent":
            continue
        label = d.get("label", "")
        if "Q&A" not in label and "q&a" not in label.lower():
            continue
        msgs = d.get("inputs", {}).get("agentMessages", [])
        for msg in msgs:
            if msg.get("role") != "system":
                continue
            content = msg["content"]
            # Skip if rule already present
            if "FRASES ESTRICTAMENTE PROHIBIDAS" in content or "STRICTLY FORBIDDEN PHRASES" in content:
                print(f"  [{label}] forbidden block already present — skipping")
                continue
            msg["content"] = content.rstrip() + FORBIDDEN_BLOCK
            print(f"  [{label}] ✅ Added forbidden phrases block")
            modified = True
    return modified


def push_project(name: str, project: dict, flow_data: dict) -> bool:
    chatflow_id = project["chatflow_id"]
    flow_str = json.dumps(flow_data, ensure_ascii=False)

    # Fetch current server metadata to preserve config
    r = requests.get(f"{FLOWISE_URL}/api/v1/chatflows/{chatflow_id}", headers=HEADERS, timeout=20)
    if r.status_code != 200:
        print(f"  ❌ Failed to fetch current chatflow: {r.status_code}")
        return False
    current = r.json()

    update_body = {"flowData": flow_str}
    for key in ("chatbotConfig", "apiConfig", "analytic", "speechToText", "category", "type"):
        if current.get(key):
            update_body[key] = current[key]

    r2 = requests.put(
        f"{FLOWISE_URL}/api/v1/chatflows/{chatflow_id}",
        headers=HEADERS,
        json=update_body,
        timeout=20,
    )
    if r2.status_code == 200:
        print(f"  ✅ Push successful")
        return True
    else:
        print(f"  ❌ Push failed: {r2.status_code} — {r2.text[:300]}")
        return False


def main():
    cfg = json.loads(PROJECTS_JSON.read_text(encoding="utf-8"))

    for name in TARGETS:
        print(f"\n{'='*60}")
        print(f"Processing: {name}")
        project = cfg["projects"][name]
        json_path = ROOT / project["json_file"]

        if not json_path.exists():
            print(f"  ❌ JSON not found: {json_path}")
            continue

        flow_data = json.loads(json_path.read_text(encoding="utf-8"))

        # 1. Add forbidden phrases block
        modified = add_forbidden_block(flow_data, name)
        if not modified:
            print(f"  No prompt changes needed")

        # 2. Inject credentials
        injected = inject_credentials(flow_data)
        print(f"  Credentials injected: {injected}")

        # 3. Save locally
        json_path.write_text(json.dumps(flow_data, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"  Saved locally: {project['json_file']}")

        # 4. Push to server
        print(f"  Pushing to server...")
        push_project(name, project, flow_data)

    print(f"\n{'='*60}")
    print("Done. Run test_document_leak.py to verify.")


if __name__ == "__main__":
    main()
