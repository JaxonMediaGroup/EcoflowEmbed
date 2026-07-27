#!/usr/bin/env python3
"""
Upgrade We Work General a gpt-5.6-sol + reasoning low en los 4 nodos.
Preserva temperature, streaming, allowImageUploads, FLOWISE_CREDENTIAL_ID.
Hace GET previo del chatflow para preservar STT/TTS/chatbotConfig en el PUT.
"""
import os
import json, io, os, sys
import requests

PATH = r"projects/We Work General Agents.json"
CONFIG = json.load(io.open("projects.json", encoding="utf-8"))
P = CONFIG["projects"]["We Work General"]
CHATFLOW_ID = P["chatflow_id"]
API_KEY = os.environ.get("FLOWISE_API_KEY", os.environ["FLOWISE_API_KEY"])
URL = CONFIG.get("flowise_url", "https://ecoflow.koppi.mx")
CRED = CONFIG.get("openai_credential_id", "e8fe03f6-9865-4abf-a662-ebdfe5561c5a")

HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

NEW_MODEL = "gpt-5.6-sol"
NEW_REASONING = "low"

# ---------------------------------------------------------------------------
# 1) Modificar JSON local
# ---------------------------------------------------------------------------
with io.open(PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

touched = []
for node in data["nodes"]:
    ins = node.get("data", {}).get("inputs", {})
    if not isinstance(ins, dict):
        continue
    for ck in ("agentModelConfig", "conditionAgentModelConfig"):
        cfg = ins.get(ck)
        if isinstance(cfg, dict) and cfg.get("modelName") == "gpt-5.4":
            old_model = cfg["modelName"]
            old_reason = cfg.get("reasoning", "")
            cfg["modelName"] = NEW_MODEL
            cfg["reasoning"] = NEW_REASONING
            # Asegurar que keepalive/cred no se pierdan
            cfg["FLOWISE_CREDENTIAL_ID"] = CRED
            touched.append({
                "label": node["data"]["label"],
                "config_key": ck,
                "old_model": old_model,
                "new_model": NEW_MODEL,
                "old_reasoning": old_reason,
                "new_reasoning": NEW_REASONING,
                "temperature": cfg.get("temperature"),
                "streaming": cfg.get("streaming"),
                "allowImageUploads": cfg.get("allowImageUploads"),
            })

with io.open(PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"JSON local actualizado: {len(touched)} nodos.")
for t in touched:
    print(f"  {t['label']:<45} {t['old_model']} ({t['old_reasoning'] or '∅'}) → {t['new_model']} ({t['new_reasoning']})  temp={t['temperature']} stream={t['streaming']} img={t['allowImageUploads']}")

# ---------------------------------------------------------------------------
# 2) GET chatflow actual para preservar STT/TTS/chatbotConfig
# ---------------------------------------------------------------------------
r = requests.get(f"{URL}/api/v1/chatflows/{CHATFLOW_ID}", headers=HEADERS, timeout=30)
r.raise_for_status()
current = r.json()
print(f"\nServidor: {current['name']}")

# ---------------------------------------------------------------------------
# 3) Re-leer JSON local (ya modificado) y construir body
# ---------------------------------------------------------------------------
with io.open(PATH, "r", encoding="utf-8") as f:
    flow_data = json.load(f)

update_body = {
    "flowData": json.dumps(flow_data, ensure_ascii=False),
}
# Preservar TODOS los campos top-level con valor no vacío
for key in ("chatbotConfig", "apiConfig", "analytic", "speechToText", "textToSpeech", "category", "type"):
    if current.get(key):
        update_body[key] = current[key]

print("\nBody del PUT incluye:")
for k in update_body:
    if k == "flowData":
        print(f"  flowData: <{len(update_body['flowData'])} bytes>")
    else:
        print(f"  {k}: {str(update_body[k])[:80]}")

# ---------------------------------------------------------------------------
# 4) PUT
# ---------------------------------------------------------------------------
r2 = requests.put(
    f"{URL}/api/v1/chatflows/{CHATFLOW_ID}",
    headers=HEADERS,
    json=update_body,
    timeout=60,
)
if r2.status_code == 200:
    print(f"\n✅ Push exitoso: We Work General → gpt-5.6-sol + reasoning low")
else:
    print(f"\n❌ Push fallido: {r2.status_code}")
    print(r2.text[:800])
    sys.exit(1)
