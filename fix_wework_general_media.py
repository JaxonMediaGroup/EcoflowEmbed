#!/usr/bin/env python3
"""
Habilita imágenes + Speech-to-Text + Text-to-Speech en We Work General.

- Imágenes: allowImageUploads = True en los 4 nodos (se guarda en el JSON local).
- STT/TTS: top-level del chatflow (se envía en el PUT, no va en flowData).

Usa el mismo credential_id que ya usa el chatflow hermano "WE WORK".
"""
import json, io, os, sys
import requests

PATH = r"projects/We Work General Agents.json"
CONFIG = json.load(io.open("projects.json", encoding="utf-8"))
P = CONFIG["projects"]["We Work General"]
CHATFLOW_ID = P["chatflow_id"]
API_KEY = os.environ.get("FLOWISE_API_KEY", "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8")
URL = CONFIG.get("flowise_url", "https://ecoflow.koppi.mx")
CRED = "10ca0bac-6033-4f4f-aff2-d5c35aef4580"   # mismo credential que usa el Q&A actual

HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

# ---------------------------------------------------------------------------
# 1) Activar allowImageUploads en los 4 nodos del JSON local
# ---------------------------------------------------------------------------
with io.open(PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

touched = 0
for node in data["nodes"]:
    ins = node.get("data", {}).get("inputs", {})
    if not isinstance(ins, dict):
        continue
    for ck in ("agentModelConfig", "conditionAgentModelConfig"):
        cfg = ins.get(ck)
        if isinstance(cfg, dict) and cfg.get("modelName") == "gpt-5.4":
            cfg["allowImageUploads"] = True
            touched += 1
            print(f"  [img] {node['data']['label']}: allowImageUploads=True")

with io.open(PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print(f"Imágenes activadas en {touched} nodos del archivo local.\n")

# ---------------------------------------------------------------------------
# 2) GET del chatflow actual (para preservar campos existentes)
# ---------------------------------------------------------------------------
r = requests.get(f"{URL}/api/v1/chatflows/{CHATFLOW_ID}", headers=HEADERS, timeout=30)
r.raise_for_status()
current = r.json()
print(f"Servidor: {current['name']} ({len(current.get('flowData','{}'))} bytes flowData)")

# ---------------------------------------------------------------------------
# 3) Re-leer el JSON local YA MODIFICADO (con allowImageUploads) e inyectar cred
# ---------------------------------------------------------------------------
with io.open(PATH, "r", encoding="utf-8") as f:
    flow_data = json.load(f)

CRED_SERVER = CONFIG.get("openai_credential_id", "e8fe03f6-9865-4abf-a662-ebdfe5561c5a")
for node in flow_data.get("nodes", []):
    ins = node.get("data", {}).get("inputs", {})
    for ck, mk in (("agentModelConfig", "agentModel"),
                   ("conditionAgentModelConfig", "conditionAgentModel")):
        cfg = ins.get(ck, {})
        if cfg.get(mk) == "chatOpenAI":
            cfg["FLOWISE_CREDENTIAL_ID"] = CRED_SERVER

# ---------------------------------------------------------------------------
# 4) Construir el body del PUT: flowData + STT + TTS + campos preservados
# ---------------------------------------------------------------------------
SPEECH_TO_TEXT = {
    "openAIWhisper": {"credentialId": CRED, "language": "en", "status": True},
    "assemblyAiTranscribe": {"status": False},
    "localAISTT": {"status": False},
    "azureCognitive": {"status": False},
    "groqWhisper": {"status": False},
}
TEXT_TO_SPEECH = {
    "openai": {"credentialId": CRED, "autoPlay": True, "status": True, "voice": "coral"},
    "elevenlabs": {"status": False},
}

update_body = {
    "flowData": json.dumps(flow_data, ensure_ascii=False),
    "speechToText": json.dumps(SPEECH_TO_TEXT, ensure_ascii=False),
    "textToSpeech": json.dumps(TEXT_TO_SPEECH, ensure_ascii=False),
}
# preservar campos existentes no vacíos
for key in ("chatbotConfig", "apiConfig", "analytic", "category", "type"):
    if current.get(key):
        update_body[key] = current[key]

print("\nBody del PUT:")
print("  speechToText:", update_body["speechToText"])
print("  textToSpeech:", update_body["textToSpeech"])
print("  nodos con allowImageUploads=True:", sum(
    1 for n in flow_data["nodes"]
    for ck in ("agentModelConfig", "conditionAgentModelConfig")
    if n.get("data", {}).get("inputs", {}).get(ck, {}).get("allowImageUploads") is True
))

# ---------------------------------------------------------------------------
# 5) PUT
# ---------------------------------------------------------------------------
r2 = requests.put(
    f"{URL}/api/v1/chatflows/{CHATFLOW_ID}",
    headers=HEADERS,
    json=update_body,
    timeout=60,
)
if r2.status_code == 200:
    print(f"\n✅ Push exitoso: We Work General (imágenes + STT + TTS)")
else:
    print(f"\n❌ Push fallido: {r2.status_code}")
    print(r2.text[:500])
    sys.exit(1)
