"""Quick verification of Torre Zero fixes."""
import json
import requests
import time
from pathlib import Path

FLOWISE_URL = "https://ecoflow.koppi.mx"
API_KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

cfg = json.loads(Path("projects.json").read_text(encoding="utf-8"))
TARGETS = ["Torre Zero Centro de Neogcios", "Torre Zero Providencia"]
QUESTION = "Cual es el precio y que incluye?"

LEAK = [
    "segun el documento", "en el documento", "el documento indica",
    "segun la ficha", "en la ficha", "la ficha indica",
    "according to the document", "based on the document",
    "not in the document", "no aparece en el documento",
]

for name in TARGETS:
    cid = cfg["projects"][name]["chatflow_id"]
    r = requests.post(
        f"{FLOWISE_URL}/api/v1/prediction/{cid}",
        headers=HEADERS,
        json={"question": QUESTION, "overrideConfig": {"sessionId": f"verify_{cid[:8]}"}},
        timeout=50,
    )
    print(f"[{name}]")
    if r.status_code == 200:
        text = r.json().get("text", r.json().get("answer", ""))
        hits = [p for p in LEAK if p.lower() in text.lower()]
        status = "LEAK: " + str(hits) if hits else "OK - clean"
        print(f"  Status: {status}")
        print(f"  Response: {text[:300]}")
    else:
        print(f"  HTTP {r.status_code}: {r.text[:300]}")
    print()
    time.sleep(2)
