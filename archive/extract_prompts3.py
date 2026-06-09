import json, os, re

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
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for node in data.get('nodes', []):
        d = node.get('data', {})
        label = d.get('label', '')
        inputs = d.get('inputs', {})
        
        if 'Q&A' not in label and 'Info General' not in label:
            continue
        
        agent_messages = inputs.get('agentMessages', '')
        if not agent_messages:
            continue
        
        if isinstance(agent_messages, str):
            try:
                messages = json.loads(agent_messages)
            except:
                continue
        else:
            messages = agent_messages
        
        if not isinstance(messages, list) or len(messages) == 0:
            continue
        
        content = messages[0].get('content', '')
        
        print(f'{"="*80}')
        print(f'FILE: {fname}')
        print(f'LABEL: {label}')
        print(f'TOTAL LENGTH: {len(content)}')
        
        # Extract ALL closing tags in last 500 chars
        tail = content[-500:]
        
        # Find all HTML tags in the tail
        tags = re.findall(r'</?[^>]+>', tail)
        print(f'LAST HTML TAGS: {" ".join(tags[-20:])}')
        
        # Show exact last 80 chars raw
        print(f'EXACT LAST 80 CHARS: {repr(content[-80:])}')
        
        # What is the very last tag?
        all_tags = re.findall(r'</?[^>]+>', content)
        if all_tags:
            print(f'VERY LAST TAG IN PROMPT: {all_tags[-1]}')
        
        # Does it end with </p>, </ul>, </ol>, </li> etc?
        stripped = content.rstrip()
        for ending in ['</p>', '</ul>', '</ol>', '</li>', '</blockquote>', '</div>', '</strong>', '</em>']:
            if stripped.endswith(ending):
                print(f'ENDS WITH: {ending}')
                break
        
        # Check if the prompt already has the document rule
        has_doc_rule = 'NO DEBES ENVIAR' in content or 'no enviar' in content.lower() or 'no envíes' in content.lower()
        has_doc_mention = 'documento' in content.lower()
        print(f'Has document-sending prohibition: {has_doc_rule}')
        print(f'Mentions "documento": {has_doc_mention}')
        
        # Full content for short prompts
        if len(content) <= 1100:
            print(f'\nFULL CONTENT:')
            print(content)
        
        print()
