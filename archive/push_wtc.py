"""
Upload WTC Agents JSON to Flowise via API.
Pushes the local file with the new Available Spaces agent to the live chatflow.
"""
import requests
import json
import sys

FLOWISE_URL = "https://ecoflow.koppi.mx"
API_KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
CHATFLOW_ID = "a2dbda66-1339-43ae-9c67-d97f30c198ac"
JSON_FILE = "WTC Agents.json"

headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

# 1. Read the local updated JSON
with open(JSON_FILE, 'r', encoding='utf-8') as f:
    flow_data = json.load(f)

# Verify the new Available Spaces agent exists
found_agent = False
for node in flow_data.get('nodes', []):
    label = node.get('data', {}).get('label', '')
    if 'Available Spaces' in label:
        found_agent = True
        print(f"✅ Agente encontrado: {label}")
        break

if not found_agent:
    print("❌ Agent 'Available Spaces' NO encontrado en el JSON. Abortando.")
    sys.exit(1)

# Verify routing: 8 scenarios
router = None
for node in flow_data.get('nodes', []):
    if node.get('data', {}).get('name') == 'conditionAgentAgentflow':
        router = node
        break

if router:
    scenarios = router['data']['inputs'].get('conditionAgentScenarios', [])
    print(f"✅ Router con {len(scenarios)} scenarios")
    if len(scenarios) != 8:
        print(f"⚠️ Se esperaban 8 scenarios, hay {len(scenarios)}")
else:
    print("❌ Router no encontrado. Abortando.")
    sys.exit(1)

# 2. Get current chatflow from Flowise
r = requests.get(f"{FLOWISE_URL}/api/v1/chatflows/{CHATFLOW_ID}", headers=headers)
if r.status_code != 200:
    print(f"❌ No se pudo obtener el chatflow: {r.status_code} {r.text}")
    sys.exit(1)

current = r.json()
print(f"📄 Chatflow actual: {current['name']}")

# 3. Preserve credentials: copy from server first, fallback to hardcoded
OPENAI_CREDENTIAL_ID = "e8fe03f6-9865-4abf-a662-ebdfe5561c5a"

server_flow = json.loads(current.get('flowData', '{}'))

# Build map of server credentials per node
server_creds = {}
for node in server_flow.get('nodes', []):
    nid = node.get('id') or node.get('data', {}).get('id')
    if not nid:
        continue
    inputs = node.get('data', {}).get('inputs', {})
    amc = inputs.get('agentModelConfig', {})
    if amc and amc.get('FLOWISE_CREDENTIAL_ID'):
        server_creds.setdefault(nid, {})['agentModelConfig'] = amc['FLOWISE_CREDENTIAL_ID']
    camc = inputs.get('conditionAgentModelConfig', {})
    if camc and camc.get('FLOWISE_CREDENTIAL_ID'):
        server_creds.setdefault(nid, {})['conditionAgentModelConfig'] = camc['FLOWISE_CREDENTIAL_ID']

injected = 0
for node in flow_data.get('nodes', []):
    nid = node.get('id') or node.get('data', {}).get('id')
    inputs = node.get('data', {}).get('inputs', {})
    label = node.get('data', {}).get('label', nid)

    # Agent model config: use server value or fallback to hardcoded
    amc = inputs.get('agentModelConfig', {})
    if amc and amc.get('agentModel') == 'chatOpenAI':
        cred = server_creds.get(nid, {}).get('agentModelConfig', OPENAI_CREDENTIAL_ID)
        amc['FLOWISE_CREDENTIAL_ID'] = cred
        print(f"  🔑 {label}: agentModelConfig credential = {cred[:8]}...")
        injected += 1

    # Condition agent model config: use server value or fallback to hardcoded
    camc = inputs.get('conditionAgentModelConfig', {})
    if camc and camc.get('conditionAgentModel') == 'chatOpenAI':
        cred = server_creds.get(nid, {}).get('conditionAgentModelConfig', OPENAI_CREDENTIAL_ID)
        camc['FLOWISE_CREDENTIAL_ID'] = cred
        camc['FLOWISE_CREDENTIAL_ID'] = cred
        print(f"  🔑 {label}: conditionAgentModelConfig credential = {cred[:8]}...")
        injected += 1

print(f"🔑 Total credenciales inyectadas: {injected}")

# 4. Update with merged flowData
flow_data_str = json.dumps(flow_data, ensure_ascii=False)

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
    print("✅ WTC Agents actualizado exitosamente en Flowise!")
    # Verify
    updated = r2.json()
    fd = json.loads(updated.get('flowData', '{}'))
    verified = False
    for node in fd.get('nodes', []):
        if 'Available Spaces' in node.get('data', {}).get('label', ''):
            verified = True
            break
    if verified:
        print("✅ Verificado: Agent Available Spaces está live en Flowise!")
    else:
        print("⚠️ Agent Available Spaces no encontrado en la respuesta, verifica manualmente")
else:
    print(f"❌ Error al actualizar: {r2.status_code}")
    print(r2.text[:500])
