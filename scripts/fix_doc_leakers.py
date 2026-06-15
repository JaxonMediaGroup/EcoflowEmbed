"""
Fix all 24 chatbots that still respond with forbidden document-source phrases.
For each bot:
  1. Download fresh flowData from server
  2. Add forbidden-phrases block to ALL Agent node system messages
  3. Save locally
  4. Push to server
"""
import json
import sys
import requests
from pathlib import Path

ROOT = Path(__file__).parent.parent
PROJECTS_JSON = ROOT / "projects.json"

FLOWISE_URL = "https://ecoflow.koppi.mx"
API_KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

# Markdown version (for bots with plain/markdown system prompts)
FORBIDDEN_MD = (
    "\n\n**⛔ STRICTLY FORBIDDEN PHRASES (ALL LANGUAGES):**\n"
    '- NUNCA uses: "según el documento", "el documento menciona", "de acuerdo con el documento", '
    '"no se menciona en el documento", "no viene en el documento", "el documento no incluye", '
    '"según la ficha", "en la ficha", "la ficha indica", "la ficha menciona", "la ficha no incluye", '
    '"according to the document", "the document states", "based on the provided document", '
    '"not mentioned in the document".\n'
    '- NUNCA uses frases que revelen que consultas una fuente externa, como: '
    '"en la información que tengo", "en la información oficial que tengo", '
    '"no aparece en la información", "no está en la información que tengo", '
    '"la información que tengo aquí", "la información disponible aquí", '
    '"según los datos que tengo", "en los datos que tengo".\n'
    "- NEVER reveal you are consulting a document, ficha, file, or external data source.\n"
    "- Respond naturally as an expert. Instead of \"El precio no aparece en la información que tengo\" "
    "say \"No cuento con el precio confirmado en este momento.\"\n"
)

# HTML version (for bots with HTML system prompts)
FORBIDDEN_HTML = (
    "<p><strong>⛔ STRICTLY FORBIDDEN PHRASES (ALL LANGUAGES):</strong></p>"
    "<ul>"
    '<li>NUNCA uses: "según el documento", "el documento menciona", "de acuerdo con el documento", '
    '"no se menciona en el documento", "no viene en el documento", "el documento no incluye", '
    '"según la ficha", "en la ficha", "la ficha indica", "la ficha menciona", "la ficha no incluye", '
    '"according to the document", "the document states", "based on the provided document", '
    '"not mentioned in the document".</li>'
    '<li>NUNCA uses frases que revelen que consultas una fuente externa, como: '
    '"en la información que tengo", "en la información oficial que tengo", '
    '"no aparece en la información", "no está en la información que tengo", '
    '"la información que tengo aquí", "la información disponible aquí", '
    '"según los datos que tengo", "en los datos que tengo".</li>'
    "<li>NEVER reveal you are consulting a document, ficha, file, or external data source.</li>"
    '<li>Respond naturally as an expert. Instead of "El precio no aparece en la información que tengo" '
    'say "No cuento con el precio confirmado en este momento."</li>'
    "</ul>"
)

SENTINEL = "no aparece en la informaci"  # only present in the expanded block

LEAKER_NAMES = [
    "Aerolíneas Ejecutivas ALE",
    "Alvar",
    "Ara Dream Diamante",
    "Archandel",
    "Bosques de Tepepan",
    "Brisas Ixtapa",
    "CRM AI",
    "Club de Golf",
    "Coronado",
    "GGI Agwa Bosques",
    "GGI Miyana Residencial",
    "GGI Palmas Uno",
    "Gran Terraza Coapa",
    "Hideaways",
    "KIO",
    "LST - Providencia",
    "LST La Santisima",
    "LST Los Senderos",
    "LST San Francisco",
    "LST San Lucas",
    "LST Santa Catalina",
    "Los Nogales",
    "Lst Providencia Coahuila",
    "Mahi Residencial",
    "Mavila",
    "Mita Map",
    "Mozaiko Lindavista",
    "NIZUC",
    "Nativas",
    "Nauma Lomas",
    "Novotech - Silao",
    "Novotech La Paz",
    "Novotech Mision Punta Norte",
    "Novotech SSEISO",
    "Prologis - Lerma",
    "Punta Cuerna",
    "Punta Zero",
    "Quivira",
    "Quvira Showroom",
    "Reserva Castilla",
    "Ribra - Arcos Bosques",
    "SLS - Residences",
    "TU - Apodaca Park 1",
    "Terralago",
    "Torre Alhena",
    "Torre Zero Centro de Neogcios",
    "Torre Zero Providencia",
    "Vesta Park",
    "Virreyes",
    "Volterra",
    "WE WORK",
    "WTC",
    "Wingate",
    "Xerena",
    "koppi",
    "plataformaNauma",
]


def inject_forbidden(flow_data: dict) -> list[str]:
    """
    Add forbidden phrases block to system message of every Agent node.
    Returns list of modified agent labels.
    """
    modified = []
    for node in flow_data.get("nodes", []):
        d = node.get("data", {})
        if d.get("type") not in ("Agent",):
            continue
        label = d.get("label", "?")
        msgs = d.get("inputs", {}).get("agentMessages") or []
        for msg in msgs:
            if msg.get("role") != "system":
                continue
            content = msg["content"]
            if SENTINEL in content:
                continue  # already has it
            # detect format
            if "<p>" in content or "<ul>" in content or "<li>" in content:
                msg["content"] = content.rstrip() + FORBIDDEN_HTML
            else:
                msg["content"] = content.rstrip() + FORBIDDEN_MD
            modified.append(label)
    return modified


def fetch_flow_data(chatflow_id: str) -> tuple[dict, dict]:
    """Returns (server_response_json, parsed_flow_data)."""
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

    ok_count = 0
    fail_count = 0

    for name in LEAKER_NAMES:
        info = all_projects.get(name)
        if not info:
            print(f"[{name}] ❌ Not found in projects.json — skipping")
            fail_count += 1
            continue

        chatflow_id = info["chatflow_id"]
        json_file = ROOT / info["json_file"] if info.get("json_file") else None

        print(f"\n[{name}]")

        # 1. Download fresh from server
        try:
            server_meta, flow_data = fetch_flow_data(chatflow_id)
        except Exception as e:
            print(f"  ❌ Download failed: {e}")
            fail_count += 1
            continue

        # 2. Inject forbidden block
        modified = inject_forbidden(flow_data)
        if not modified:
            print(f"  ⚠️  No agent nodes modified (already had block or no system message)")
        else:
            for lbl in modified:
                print(f"  ✅ Added forbidden block to [{lbl}]")

        # 3. Save locally
        if json_file:
            json_file.parent.mkdir(parents=True, exist_ok=True)
            json_file.write_text(
                json.dumps({"nodes": flow_data["nodes"], "edges": flow_data.get("edges", [])},
                           ensure_ascii=False, indent=2),
                encoding="utf-8",
            )
            print(f"  💾 Saved to {json_file.name}")

        # 4. Push to server
        if push_flow(chatflow_id, server_meta, flow_data):
            print(f"  🚀 Push successful")
            ok_count += 1
        else:
            print(f"  ❌ Push failed")
            fail_count += 1

    print(f"\n{'='*50}")
    print(f"Done: {ok_count} OK, {fail_count} failed")


if __name__ == "__main__":
    main()
