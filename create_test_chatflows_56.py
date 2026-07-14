#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Crea chatflows duplicados de prueba con gpt-5.6-sol + reasoning low.

- We Work General  ->  TEST - We Work General (5.6-sol)
- We Work Santa Fe  ->  TEST - We Work Santa Fe (5.6-sol)

Copia el flowData del chatflow origen (que está en gpt-5.4), cambia modelo
a gpt-5.6-sol + reasoning 'low', y lo sube como chatflow NUEVO (POST).
Preserva speechToText/textToText del origen.
"""
import json, io, os, sys, copy
import requests

CONFIG = json.load(io.open("projects.json", encoding="utf-8"))
API_KEY = os.environ.get("FLOWISE_API_KEY", "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8")
URL = CONFIG.get("flowise_url", "https://ecoflow.koppi.mx")
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Accept": "application/json", "Content-Type": "application/json"}

# Origen -> nuevo nombre
TARGETS = [
    {
        "source_chatflow_id": CONFIG["projects"]["We Work General"]["chatflow_id"],
        "source_name": "We Work General",
        "new_name": "TEST - We Work General (5.6-sol)",
        "new_key": "TEST - We Work General",
        "new_json_file": "projects/TEST - We Work General Agents.json",
        "category": "coworking",
    },
    {
        "source_chatflow_id": "987464b9-dec9-416c-a007-165c91b8848c",
        "source_name": "We Work Santa Fe",
        "new_name": "TEST - We Work Santa Fe (5.6-sol)",
        "new_key": "TEST - We Work Santa Fe",
        "new_json_file": "projects/TEST - We Work Santa Fe Agents.json",
        "category": "coworking",
    },
]


def upgrade_models(flow):
    """Cambia gpt-5.4 -> gpt-5.6-sol + reasoning low en todos los nodos."""
    changed = 0
    for node in flow.get("nodes", []):
        ins = node.get("data", {}).get("inputs", {})
        if not isinstance(ins, dict):
            continue
        for ck in ("agentModelConfig", "conditionAgentModelConfig"):
            cfg = ins.get(ck, {})
            if isinstance(cfg, dict) and cfg.get("modelName") in ("gpt-5.4", "gpt-5.6", "gpt-5.6-sol"):
                cfg["modelName"] = "gpt-5.6-sol"
                cfg["reasoning"] = "low"
                cfg["allowImageUploads"] = True
                changed += 1
    return changed


created_entries = []

for t in TARGETS:
    print(f"\n{'='*70}")
    print(f"Procesando: {t['source_name']}  ->  {t['new_name']}")
    print(f"{'='*70}")

    # 1) GET del chatflow origen
    r = requests.get(f"{URL}/api/v1/chatflows/{t['source_chatflow_id']}", headers=HEADERS, timeout=30)
    r.raise_for_status()
    src = r.json()
    flow = json.loads(src["flowData"])
    print(f"  Origen: {src['name']} ({len(flow['nodes'])} nodos)")

    # 2) Upgrade modelos
    flow = copy.deepcopy(flow)
    changed = upgrade_models(flow)
    print(f"  Nodos upgraded a gpt-5.6-sol + reasoning low: {changed}")

    # 3) Guardar JSON local de prueba
    local_path = t["new_json_file"]
    with io.open(local_path, "w", encoding="utf-8") as f:
        json.dump(flow, f, ensure_ascii=False, indent=2)
    print(f"  JSON local guardado: {local_path}")

    # 4) POST crear chatflow nuevo
    flow_data_str = json.dumps(flow, ensure_ascii=False)
    payload = {
        "name": t["new_name"],
        "flowData": flow_data_str,
        "deployed": True,
        "isPublic": src.get("isPublic", False),
        "chatbotConfig": src.get("chatbotConfig"),
        "apiConfig": src.get("apiConfig"),
        "analytic": src.get("analytic"),
        "speechToText": src.get("speechToText"),
        "textToSpeech": src.get("textToSpeech"),
        "category": t["category"],
        "type": src.get("type", "AGENTFLOW"),
    }
    r2 = requests.post(
        f"{URL}/api/v1/chatflows",
        headers=HEADERS,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        timeout=90,
    )
    if r2.status_code not in (200, 201):
        print(f"  ❌ Error creando chatflow: {r2.status_code}")
        print(r2.text[:500])
        sys.exit(1)
    created = r2.json()
    new_id = str(created.get("id", "")).strip()
    if not new_id:
        print(f"  ❌ Respuesta sin id: {created}")
        sys.exit(1)
    print(f"  ✅ Chatflow creado: {created.get('name', t['new_name'])} (id: {new_id})")

    created_entries.append({
        "key": t["new_key"],
        "entry": {
            "chatflow_id": new_id,
            "json_file": local_path,
            "type": "AGENTFLOW",
            "category": t["category"],
        },
        "name": created.get("name", t["new_name"]),
        "id": new_id,
    })

# 5) Registrar en projects.json
print(f"\n{'='*70}")
print("Registrando en projects.json")
print(f"{'='*70}")
for ce in created_entries:
    CONFIG["projects"][ce["key"]] = ce["entry"]
    print(f"  + {ce['key']:<35} id={ce['id']}  file={ce['entry']['json_file']}")

with io.open("projects.json", "w", encoding="utf-8") as f:
    json.dump(CONFIG, f, ensure_ascii=False, indent=2)
print("\n✅ projects.json actualizado")

print(f"\n{'='*70}")
print("RESUMEN")
print(f"{'='*70}")
for ce in created_entries:
    print(f"  {ce['name']}")
    print(f"    id:   {ce['id']}")
    print(f"    file: {ce['entry']['json_file']}")
    print(f"    chat: {URL}/chat/{ce['id']}")
