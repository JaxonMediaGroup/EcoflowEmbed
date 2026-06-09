import json, os

files = [
    'Coronado Agents.json',
    'koppi Agents.json',
    'Novotech - Silao Agents.json',
    'Terralago Agents.json',
    'Punta Zero Agents.json',
    'WTC Agents.json',
    'Los Nogales Agents.json',
    'Torre Alhena Agents.json',
    'Alvar Agents.json',
    'LST La Santisima Agents.json',
]

for fname in files:
    path = os.path.join('.', fname)
    if not os.path.exists(path):
        print(f'=== {fname} === FILE NOT FOUND')
        continue
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    found = False
    for node in data.get('nodes', []):
        d = node.get('data', {})
        label = d.get('label', '')
        name = d.get('name', '')
        node_id = node.get('id', '')
        
        inputs = d.get('inputs', {})
        sys_msg = inputs.get('systemMessage', inputs.get('systemMessagePrompt', ''))
        
        if not sys_msg:
            for param in d.get('inputParams', []):
                if param.get('name') in ('systemMessage', 'systemMessagePrompt'):
                    sys_msg = param.get('default', '')
        
        if sys_msg and len(sys_msg) > 50:
            print(f'=== {fname} ===')
            print(f'  Node ID: {node_id}')
            print(f'  Label: {label}')
            print(f'  Name: {name}')
            print(f'  Prompt length: {len(sys_msg)}')
            print(f'  FIRST 150 chars: {repr(sys_msg[:150])}')
            print(f'  LAST 300 chars: {repr(sys_msg[-300:])}')
            has_doc = 'documento' in sys_msg.lower() or 'document' in sys_msg.lower()
            print(f'  Mentions documento/document: {has_doc}')
            print()
            found = True
    
    if not found:
        print(f'=== {fname} === NO SYSTEM PROMPT FOUND IN STANDARD FIELDS')
        for node in data.get('nodes', []):
            d = node.get('data', {})
            label = d.get('label', '')
            name = d.get('name', '')
            inputs = d.get('inputs', {})
            prompt_keys = [k for k in inputs.keys() if any(w in k.lower() for w in ['prompt', 'message', 'system', 'instruction'])]
            if prompt_keys:
                print(f'  Node "{label}" ({name}): keys = {prompt_keys}')
                for pk in prompt_keys:
                    val = inputs[pk]
                    if isinstance(val, str) and len(val) > 20:
                        print(f'    {pk} len={len(val)}: {repr(val[:100])}...')
                        print(f'    LAST 300: {repr(val[-300:])}')
        print()
