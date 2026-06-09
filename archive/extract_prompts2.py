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
    
    print(f'\n{"="*80}')
    print(f'FILE: {fname}')
    print(f'{"="*80}')
    
    for node in data.get('nodes', []):
        d = node.get('data', {})
        label = d.get('label', '')
        name = d.get('name', '')
        inputs = d.get('inputs', {})
        
        # Only look at Q&A agent nodes
        if 'Q&A' not in label and 'Info General' not in label:
            continue
        
        agent_messages = inputs.get('agentMessages', '')
        if not agent_messages:
            print(f'  Label: {label} -- agentMessages is EMPTY')
            continue
        
        # agentMessages could be a JSON string containing array
        if isinstance(agent_messages, str):
            try:
                messages = json.loads(agent_messages)
            except:
                messages = agent_messages
        else:
            messages = agent_messages
        
        print(f'  Label: {label}')
        print(f'  Name: {name}')
        print(f'  agentMessages type: {type(messages).__name__}')
        
        if isinstance(messages, list):
            for i, msg in enumerate(messages):
                if isinstance(msg, dict):
                    role = msg.get('role', 'unknown')
                    content = msg.get('content', '')
                    print(f'\n  Message[{i}] role={role}, length={len(content)}')
                    if role == 'system' or role == 'apiMessage':
                        if len(content) <= 500:
                            print(f'  FULL CONTENT:')
                            print(content)
                        else:
                            print(f'  FIRST 150 chars:')
                            print(repr(content[:150]))
                            print(f'  LAST 300 chars:')
                            print(repr(content[-300:]))
                        has_doc = 'documento' in content.lower() or 'document' in content.lower()
                        print(f'  Mentions documento/document: {has_doc}')
                else:
                    print(f'  Message[{i}]: {repr(str(msg)[:200])}')
        elif isinstance(messages, str):
            print(f'  Raw string len={len(messages)}')
            print(f'  FIRST 200: {repr(messages[:200])}')
            print(f'  LAST 300: {repr(messages[-300:])}')
        
        print()
