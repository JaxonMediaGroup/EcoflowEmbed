"""Classify each project's real product from its info_get URL and system prompt."""
import json
import re
from pathlib import Path
from urllib.parse import unquote

PROJECTS_DIR = Path(r"C:\Users\Guillermo\Downloads\Chatbots\projects")
PROJECTS_JSON = PROJECTS_DIR.parent / "projects.json"

# Hospitality-resort signals
RESORT_SIGNALS = [
    "hotel", "resort", "all inclusive", "all-inclusive", "rooms", "suites",
    "concierge", "spa ", "spa de", "check-in", "check in", "huésped",
    "operación hotelera", "reservation", "booking", "nights", "tarifa",
    "pueblo bonito", "ritz", "four seasons", "hilton",
]

projects = json.loads(PROJECTS_JSON.read_text(encoding="utf-8"))["projects"]

for proj_name, proj in sorted(projects.items()):
    cat = proj.get("category", "")
    if cat not in ("hospitality", "real-estate"):
        continue
    jf = proj.get("json_file")
    if not jf:
        continue
    path = PROJECTS_DIR / Path(jf).name
    if not path.exists():
        continue
    d = json.loads(path.read_text(encoding="utf-8"))

    # Get info_get URL
    info_url = ""
    for n in d["nodes"]:
        for t in n["data"].get("inputs", {}).get("agentTools", []) or []:
            cfg = t.get("agentSelectedToolConfig", {})
            if cfg.get("requestsGetName") in ("info_get",) or "info" in (cfg.get("requestsGetName", "") or "").lower():
                url_html = cfg.get("requestsGetUrl", "")
                info_url = re.sub(r"<[^>]+>", "", url_html)  # strip <p></p>
                info_url = unquote(info_url).replace("export?format=txt", "")
                break

    # Get system prompt excerpt
    sys_text = ""
    for n in d["nodes"]:
        if n["data"].get("type") == "Agent":
            label = (n["data"].get("label") or "").lower()
            if "guard" in label or "off-topic" in label:
                continue
            for m in n["data"]["inputs"].get("agentMessages", []):
                if m.get("role") == "system":
                    sys_text += m.get("content", "") + " "

    # Look for resort signals
    text_lower = sys_text.lower()
    hits = [s for s in RESORT_SIGNALS if s in text_lower]

    # Detect product type
    has_lots = any(w in text_lower for w in ["lote", "lotes", "lot ", "lots "])
    has_apartments = any(w in text_lower for w in ["departamento", "departamentos", "apartment", "apartments", "condo", "condominio"])
    has_houses = any(w in text_lower for w in ["casa", "casas", "house", "villa", "townhouse"])
    has_hotel = any(w in text_lower for w in ["hotel", "resort", "habitación", "habitaciones", "rooms", "suites"])

    products = []
    if has_lots: products.append("lotes")
    if has_apartments: products.append("departamentos")
    if has_houses: products.append("casas/villas")
    if has_hotel: products.append("HOTEL/RESORT")

    print(f"\n[{cat:13s}] {proj_name}")
    print(f"  info: {info_url[-60:] if info_url else '(no info_get)'}")
    print(f"  products detected: {', '.join(products) if products else '(unclear)'}")
    if hits:
        print(f"  resort signals: {hits[:5]}")
    else:
        print(f"  resort signals: (none)")
