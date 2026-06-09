import requests, json
URL = 'https://ecoflow.koppi.mx'
KEY = 'Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8'
H = {'Authorization': f'Bearer {KEY}'}

resp = requests.get(f'{URL}/api/v1/chatflows', headers=H, timeout=30)
for cf in resp.json():
    if cf['name'] == 'Nativas':
        cf_id = cf['id']
        print(f'ID: {cf_id}')
        detail = requests.get(f'{URL}/api/v1/chatflows/{cf_id}', headers=H, timeout=30)
        flow = json.loads(detail.json()['flowData'])
        for node in flow['nodes']:
            ntype = node['data']['name']
            label = node['data'].get('inputs', {}).get('agentName', node['data'].get('label', ''))
            print(f'  Node: {ntype} | {label}')
            if ntype == 'conditionAgentAgentflow':
                scenarios = node['data']['inputs']['conditionAgentScenarios']
                for i, s in enumerate(scenarios):
                    txt = s.get('scenario', '')[:100]
                    print(f'    Scenario {i}: {txt}')
                inst = node['data']['inputs'].get('conditionAgentInstructions', '')
                print(f'    Instructions: {len(inst)} chars')
                print(f'    First 300: {inst[:300]}')
        break
