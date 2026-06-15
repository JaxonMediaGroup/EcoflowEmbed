"""Download Torre Zero Centro de Negocios and Torre Zero Providencia from Flowise."""
import json
import requests
from pathlib import Path

FLOWISE_URL = "https://ecoflow.koppi.mx"
API_KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

ROOT = Path(__file__).parent.parent
cfg = json.loads((ROOT / "projects.json").read_text(encoding="utf-8"))

TARGETS = ["Torre Zero Centro de Neogcios", "Torre Zero Providencia"]

for name in TARGETS:
    info = cfg["projects"][name]
    cid = info["chatflow_id"]
    r = requests.get(f"{FLOWISE_URL}/api/v1/chatflows/{cid}", headers=HEADERS, timeout=20)
    print(f"{name}: HTTP {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        flow_raw = data.get("flowData", "{}")
        flow = json.loads(flow_raw) if isinstance(flow_raw, str) else flow_raw
        out = {"nodes": flow.get("nodes", []), "edges": flow.get("edges", [])}
        out_path = ROOT / info["json_file"]
        out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"  -> Saved {info['json_file']} ({len(out['nodes'])} nodes)")
    else:
        print(f"  -> Error: {r.text[:300]}")
