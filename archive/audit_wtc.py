import json

f = open(r'c:\Users\Guillermo\Downloads\Chatbots\WTC Agents.json', 'r', encoding='utf-8')
d = json.load(f)
f.close()

nodes = d['nodes']
edges = d['edges']
router = nodes[1]

scenarios = router['data']['inputs']['conditionAgentScenarios']
outputs = router['data']['outputAnchors']

print('=== ROUTER AUDIT ===')
print('Scenarios:', len(scenarios))
print('Output anchors:', len(outputs))
print('Match:', len(scenarios) == len(outputs))
print()

for i, s in enumerate(scenarios):
    label = s['scenario'][:90]
    print(f'  Scenario {i}: {label}...')
print()

for o in outputs:
    oid = o['id']
    olabel = o['label']
    print(f'  Output: {oid} (label={olabel})')
print()

print('=== EDGES FROM ROUTER ===')
for e in edges:
    src = e.get('source', '')
    sh = e.get('sourceHandle', '')
    if src == 'conditionAgentAgentflow_0' and 'output' in sh:
        target_node = next((n for n in nodes if n['id'] == e['target']), None)
        label = target_node['data']['label'] if target_node else 'NOT FOUND!'
        el = e['data'].get('edgeLabel', '?')
        print(f'  Output-{el} -> {e["target"]} = {label}')
print()

print('=== CRITICAL ROUTING CHECK ===')
# Verify scenario index matches what each agent expects
expected_mapping = {
    '0': 'Info General',
    '1': 'Professional Services',
    '2': 'Shopping Center',
    '3': 'Access Regulations',
    '4': 'owners',
    '5': 'PARKING',
    '6': 'Off-Topic',
    '7': 'Available Spaces',
}

errors = []
for e in edges:
    src = e.get('source', '')
    if src == 'conditionAgentAgentflow_0':
        el = e['data'].get('edgeLabel', '?')
        target_node = next((n for n in nodes if n['id'] == e['target']), None)
        if target_node:
            agent_label = target_node['data']['label']
            expected_key = expected_mapping.get(el, '')
            if expected_key and expected_key.lower() not in agent_label.lower():
                errors.append(f'MISMATCH! Edge {el} expected "{expected_key}" but connects to "{agent_label}"')
            else:
                print(f'  OK: Edge {el} -> {agent_label}')

if errors:
    print()
    for err in errors:
        print(f'  ERROR: {err}')
else:
    print()
    print('  ALL EDGES ROUTE CORRECTLY!')

print()
print('=== NEW AGENT TOOL CHECK ===')
new_agent = next((n for n in nodes if n['id'] == 'agentAgentflow_7'), None)
if new_agent:
    tools = new_agent['data']['inputs'].get('agentTools', [])
    msgs = new_agent['data']['inputs'].get('agentMessages', [])
    model_cfg = new_agent['data']['inputs'].get('agentModelConfig', {})
    print(f'  Label: {new_agent["data"]["label"]}')
    print(f'  Model: {model_cfg.get("modelName", "?")}')
    print(f'  Temperature: {model_cfg.get("temperature", "?")}')
    print(f'  Tools count: {len(tools)}')
    if tools:
        for t in tools:
            cfg = t.get('agentSelectedToolConfig', {})
            print(f'    Tool: {cfg.get("requestsGetName", "?")}')
            url = cfg.get('requestsGetUrl', '')
            print(f'    URL contains new sheet ID: {"1Ba1PLXvzSdaBV8U4UjmzgrjbjTEawMEJy1OxOZ5heLg" in url}')
            print(f'    URL contains Inventario: {"Inventario" in url}')
            print(f'    MaxOutput: {cfg.get("requestsGetMaxOutputLength", "?")}')
    if msgs:
        content = msgs[0].get('content', '')
        print(f'  System prompt length: {len(content)} chars')
        print(f'  Contains "Inventario_Espacios": {"Inventario_Espacios" in content}')
        print(f'  Contains column descriptions: {"STATUS WTC" in content and "Superficie" in content and "Renta" in content}')
else:
    print('  ERROR: agentAgentflow_7 NOT FOUND!')

print()
print('=== SCENARIO vs OFF-TOPIC ORDER CHECK ===')
s6 = scenarios[6]['scenario']
s7 = scenarios[7]['scenario']
print(f'  Scenario 6 is OFF-TOPIC: {"UNRELATED" in s6}')
print(f'  Scenario 7 is AVAILABLE: {"AVAILABLE SPACES" in s7}')

# This is a PROBLEM - off-topic should be LAST
if 'UNRELATED' in s6 and 'AVAILABLE' in s7:
    print()
    print('  WARNING: Off-topic (scenario 6) comes BEFORE Available Spaces (scenario 7).')
    print('  The router instructions say category 7=Available, 8=Off-topic')
    print('  But scenarios array has: index 6=Off-topic, index 7=Available')
    print('  This means the EDGE for off-topic (6) correctly goes to Off-Topic Guard')
    print('  And the EDGE for available (7) correctly goes to Available Spaces agent')
    print('  The router will match by SCENARIO TEXT, not by number, so this is OK.')
