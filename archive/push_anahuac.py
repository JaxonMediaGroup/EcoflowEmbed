"""
Upload Anáhuac Orientador Vocacional agent JSON to Flowise via API.
Pushes the local file with the MAPA DE EXPERIENCIAS HUMANAS to the live chatflow.
"""
import requests
import json
import sys

FLOWISE_URL = "https://ecoflow.koppi.mx"
API_KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
CHATFLOW_ID = "4c84d4c6-2df9-4d60-ac7e-6c9a78608f1c"
JSON_FILE = "Anahuac Orientador Vocacional Agents.json"

if not CHATFLOW_ID:
    print("❌ CHATFLOW_ID no está configurado. Obtén el ID del chatflow en Flowise y ponlo en este script.")
    sys.exit(1)

headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

# 1. Read the local updated JSON
with open(JSON_FILE, 'r', encoding='utf-8') as f:
    flow_data = json.load(f)

# Verify the MAPA DE EXPERIENCIAS is present in the agent prompt
found_mapa = False
for node in flow_data.get('nodes', []):
    agent_msgs = node.get('data', {}).get('inputs', {}).get('agentMessages', '')
    if isinstance(agent_msgs, list):
        for msg in agent_msgs:
            if isinstance(msg, dict) and 'MAPA DE EXPERIENCIAS HUMANAS' in msg.get('content', ''):
                found_mapa = True
                break
    elif isinstance(agent_msgs, str) and 'MAPA DE EXPERIENCIAS HUMANAS' in agent_msgs:
        found_mapa = True
    if found_mapa:
        print("✅ MAPA DE EXPERIENCIAS HUMANAS encontrado en el prompt del agente")
        break

if not found_mapa:
    print("❌ MAPA DE EXPERIENCIAS HUMANAS NO encontrado en el JSON. Abortando.")
    sys.exit(1)

# 2. Get current chatflow from Flowise
r = requests.get(f"{FLOWISE_URL}/api/v1/chatflows/{CHATFLOW_ID}", headers=headers)
if r.status_code != 200:
    print(f"❌ No se pudo obtener el chatflow: {r.status_code} {r.text}")
    sys.exit(1)

current = r.json()
print(f"📄 Chatflow actual: {current['name']}")

# 3. Preserve credentials from server into local flowData
server_flow = json.loads(current.get('flowData', '{}'))
server_creds = {}
for node in server_flow.get('nodes', []):
    nid = node.get('id') or node.get('data', {}).get('id')
    cred = node.get('data', {}).get('credential')
    if nid and cred:
        server_creds[nid] = cred

injected = 0
for node in flow_data.get('nodes', []):
    nid = node.get('id') or node.get('data', {}).get('id')
    if nid and nid in server_creds:
        node.setdefault('data', {})['credential'] = server_creds[nid]
        injected += 1

print(f"🔑 Credenciales preservadas: {injected} nodos (de {len(server_creds)} en servidor)")

# 4. Update with merged flowData
flow_data_str = json.dumps(flow_data, ensure_ascii=False)

# Preserve top-level chatflow fields (chatbotConfig, speechToText, etc.)
update_body = {"flowData": flow_data_str}
for key in ('chatbotConfig', 'apiConfig', 'analytic', 'speechToText', 'category', 'type'):
    if current.get(key):
        update_body[key] = current[key]

r2 = requests.put(
    f"{FLOWISE_URL}/api/v1/chatflows/{CHATFLOW_ID}",
    headers=headers,
    json=update_body
)

if r2.status_code == 200:
    print("✅ Anáhuac Orientador Vocacional actualizado exitosamente en Flowise!")
    # Verify
    updated = r2.json()
    fd = json.loads(updated.get('flowData', '{}'))
    verified = False
    for node in fd.get('nodes', []):
        msgs = node.get('data', {}).get('inputs', {}).get('agentMessages', '')
        if isinstance(msgs, list):
            for msg in msgs:
                if isinstance(msg, dict) and 'MAPA DE EXPERIENCIAS HUMANAS' in msg.get('content', ''):
                    verified = True
                    break
        elif isinstance(msgs, str) and 'MAPA DE EXPERIENCIAS HUMANAS' in msgs:
            verified = True
        if verified:
            print("✅ Verificado: MAPA DE EXPERIENCIAS HUMANAS está live en Flowise!")
            break
    if not verified:
        print("⚠️ MAPA DE EXPERIENCIAS no encontrado en la respuesta, verifica manualmente")
else:
    print(f"❌ Error al actualizar: {r2.status_code}")
    print(r2.text[:500])
