import json, os

backup_dir = r'c:\Users\Guillermo\Documents\GitHub\EcoflowEmbed\backups_remote_20260603_132418\raw'
for fn in sorted(os.listdir(backup_dir)):
    if not fn.endswith('.json'):
        continue
    with open(os.path.join(backup_dir, fn), encoding='utf-8') as f:
        data = json.load(f)
    cfg = data.get('chatbotConfig')
    if cfg:
        print(f'{fn}: chatbotConfig={json.dumps(cfg)[:300]}')
    fd = data.get('flowData', '')
    if 'allowImageUploads' in fd:
        import re
        matches = re.findall(r'"allowImageUploads"\s*:\s*(\S+)', fd)
        unique = set(matches)
        print(f'  {fn}: allowImageUploads values in flowData: {unique}')
