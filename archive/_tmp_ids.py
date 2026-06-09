import json, re

for f in ['push_wtc.py','push_lst.py','push_anahuac.py']:
    with open(f, encoding='utf-8') as fh:
        content = fh.read()
    cid = re.search(r'CHATFLOW_ID\s*=\s*"([^"]+)"', content)
    jf = re.search(r'JSON_FILE\s*=\s*"([^"]+)"', content)
    print(f"{f}: chatflow={cid.group(1) if cid else '?'}, json={jf.group(1) if jf else '?'}")

with open('projects/project_discovery.json', encoding='utf-8') as f:
    disc = json.load(f)
print(f"\nDiscovery: {len(disc)} projects")
for p in disc:
    print(f"  {p['name']}: {p['id']} ({p['type']})")
