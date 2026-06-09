"""Fetch the info_get Google Docs and look for actual hotel/resort vs real-estate signals."""
import re
import json
from pathlib import Path
from urllib.parse import unquote
import urllib.request

PROJECTS_DIR = Path(r"C:\Users\Guillermo\Downloads\Chatbots\projects")
PROJECTS_JSON = PROJECTS_DIR.parent / "projects.json"

# Real hotel/resort indicators
HOTEL_HITS = [
    "hotel ", "hoteleria", "operación hotelera", "all inclusive", "all-inclusive",
    "habitaciones", "rooms", "suites de hotel", "check-in", "check in",
    "número de habitaciones", "operado por", "tarifa por noche",
    "restaurant", "restaurante del hotel", "concierge", "spa",
    "renta de habitaciones", "alojamiento temporal", "estancia",
    "pueblo bonito resorts",
]
# Real estate indicators (residential)
RESI_HITS = [
    "lote", "lotes", "compra de", "venta de", "inversion", "inversión",
    "prevent", "entrega", "escrituración", "plusvalía", "hipoteca",
    "departamento", "condominio", "casa", "torre residencial",
    "fraccionamiento", "desarrollo residencial", "residencial",
]


def fetch(url: str) -> str:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as r:
            return r.read().decode("utf-8", errors="ignore")
    except Exception as e:
        return f"ERROR: {e}"


projects = json.loads(PROJECTS_JSON.read_text(encoding="utf-8"))["projects"]
hospitality_projects = [n for n, p in projects.items() if p.get("category") == "hospitality"]

for proj_name in sorted(hospitality_projects):
    proj = projects[proj_name]
    jf = proj.get("json_file")
    if not jf:
        continue
    path = PROJECTS_DIR / Path(jf).name
    if not path.exists():
        continue
    d = json.loads(path.read_text(encoding="utf-8"))
    info_url = ""
    for n in d["nodes"]:
        for t in n["data"].get("inputs", {}).get("agentTools", []) or []:
            cfg = t.get("agentSelectedToolConfig", {})
            if "info" in (cfg.get("requestsGetName", "") or "").lower():
                url_html = cfg.get("requestsGetUrl", "")
                info_url = re.sub(r"<[^>]+>", "", url_html)
                break
        if info_url:
            break

    if not info_url:
        print(f"\n[{proj_name}] no info_get URL")
        continue

    text = fetch(info_url)
    if text.startswith("ERROR"):
        print(f"\n[{proj_name}] fetch failed: {text}")
        continue

    text_lower = text.lower()
    # Look at first 2000 chars
    print(f"\n{'=' * 70}")
    print(f"[{proj_name}]  info URL: {info_url[-60:]}")
    print(f"{'=' * 70}")
    print(f"DOC length: {len(text)} chars")
    print(f"\n--- FIRST 800 chars ---")
    print(text[:800].strip())
    print(f"\n--- KEYWORD SCAN ---")
    hotel_hits = [h for h in HOTEL_HITS if h in text_lower]
    resi_hits = [h for h in RESI_HITS if h in text_lower]
    print(f"Hotel/resort signals: {len(hotel_hits)}  -> {hotel_hits[:8]}")
    print(f"Real-estate signals: {len(resi_hits)}  -> {resi_hits[:8]}")
    verdict = "HOSPITALITY" if len(hotel_hits) > len(resi_hits) * 0.5 and len(hotel_hits) >= 3 else "REAL-ESTATE"
    print(f"VERDICT (keyword-based): {verdict}")
