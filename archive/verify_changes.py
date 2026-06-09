import json, re
with open('WTC Agents.json','r',encoding='utf-8') as f:
    data = json.load(f)

emoji_re = re.compile('[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF\U0001F900-\U0001F9FF\u2600-\u26FF\u2700-\u27BF\U0001FA00-\U0001FAFF\U0001FA70-\U0001FAFF]+')
for node in data['nodes']:
    nid = node['data']['id']
    msgs = node['data'].get('inputs',{}).get('agentMessages',[])
    for m in msgs:
        if m.get('content'):
            found = emoji_re.findall(m['content'])
            if found:
                print(f"{nid}: remaining emojis: {found[:5]}")
    instr = node['data'].get('inputs',{}).get('conditionAgentInstructions','')
    if instr:
        found = emoji_re.findall(instr)
        if found:
            print(f"{nid} (instructions): remaining emojis: {found[:5]}")
print('Emoji check done')

for node in data['nodes']:
    if node['data']['id'] == 'agentAgentflow_7':
        content = node['data']['inputs']['agentMessages'][0]['content']
        print('\n--- Available Spaces: guided strategy present:', 'CONVERSATIONAL GUIDANCE' in content)
        print('--- NO-EMOJI rule present:', 'NO-EMOJI RULE' in content)
        print('--- First 500 chars ---')
        print(content[:500])
