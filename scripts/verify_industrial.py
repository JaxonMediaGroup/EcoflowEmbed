"""Verify industrial projects using ACTUAL info_get URLs from the JSONs."""
import json
import re
import urllib.request
from pathlib import Path
from urllib.parse import unquote

PROJECTS_DIR = Path(r"C:\Users\Guillermo\Downloads\Chatbots\projects")
PROJECTS_JSON = PROJECTS_DIR.parent / "projects.json"

INDUSTRIAL_HITS = [
    "nave industrial", "naves industriales", "bodega", "bodegas",
    "parque industrial", "polígono industrial", "manufactura",
    "logística", "logistico", "logístico", "almacenamiento",
    "planta industrial", "uso industrial", "terreno industrial",
    "altura libre", "andén", "andenes",
    "centro de distribución", "cedis",
    "construcción industrial", "nave", "naves", "warehouse", "sq ft",
    "rentable area", "área rentable", "patio de maniobras",
    "muelles", "dock", "cross-dock",
    "manufactur", "industrial ", "industrial.",
]
OFFICE_HITS = [
    "oficinas", "oficina", "office ", "corporativo", "torre de oficinas",
    "espacio de oficina", "área rentable",
]
RESI_HITS = [
    "departamento", "departamentos", "condominio", "casa",
    "lote residencial", "fraccionamiento residencial", "amenidades",
]
HOTEL_HITS = [
    "habitaciones", "hotel", "resort", "all inclusive", "check-in",
    "concierge", "spa ",
]


def fetch(url: str) -> str:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.read().decode("utf-8", errors="ignore")
    except Exception as e:
        return f"ERROR: {e}"


def get_info_url(proj_name: str) -> str:
    proj = json.loads(PROJECTS_JSON.read_text(encoding="utf-8"))["projects"].get(proj_name)
    if not proj:
        return ""
    jf = proj.get("json_file")
    if not jf:
        return ""
    path = PROJECTS_DIR / Path(jf).name
    if not path.exists():
        return ""
    d = json.loads(path.read_text(encoding="utf-8"))
    urls = []
    for n in d["nodes"]:
        for t in n["data"].get("inputs", {}).get("agentTools", []) or []:
            cfg = t.get("agentSelectedToolConfig", {})
            if "info" in (cfg.get("requestsGetName", "") or "").lower() or "data" in (cfg.get("requestsGetName", "") or "").lower():
                url_html = cfg.get("requestsGetUrl", "")
                url = re.sub(r"<[^>]+>", "", url_html)
                urls.append(url)
    return urls[0] if urls else ""


projects = json.loads(PROJECTS_JSON.read_text(encoding="utf-8"))["projects"]
industrial_projs = [n for n, p in projects.items() if p.get("category") == "industrial"]

print("=" * 78)
print(f"Verifying {len(industrial_projs)} 'industrial' projects by fetching their info_get docs")
print("=" * 78)

results = []
for name in sorted(industrial_projs):
    url = get_info_url(name)
    if not url:
        print(f"\n[{name}] no info_get URL found")
        results.append((name, "NO_URL", 0, 0, 0, 0))
        continue
    t = fetch(url)
    if t.startswith("ERROR"):
        print(f"\n[{name}] FETCH FAILED: {t}")
        results.append((name, f"FETCH_ERR", 0, 0, 0, 0))
        continue
    tl = t.lower()
    ind = [h for h in INDUSTRIAL_HITS if h in tl]
    off = [h for h in OFFICE_HITS if h in tl]
    res = [h for h in RESI_HITS if h in tl]
    hot = [h for h in HOTEL_HITS if h in tl]

    print(f"\n[{name}]")
    print(f"  doc len={len(t)}")
    print(f"  industrial signals ({len(ind)}): {ind[:7]}")
    print(f"  office signals     ({len(off)}): {off[:5]}")
    print(f"  residential signals({len(res)}): {res[:5]}")
    print(f"  hotel signals      ({len(hot)}): {hot[:5]}")
    print(f"  --- FIRST 400 chars ---")
    print(f"  {t[:400].strip()}")

    if len(ind) > 3 and len(ind) > len(off) + len(res):
        verdict = "INDUSTRIAL"
    elif len(hot) > 2 and len(hot) > len(ind):
        verdict = "HOTEL"
    elif len(res) > len(ind):
        verdict = "REAL-ESTATE"
    else:
        verdict = "INDUSTRIAL"  # default to category name

    print(f"  VERDICT: {verdict}")
    results.append((name, verdict, len(ind), len(off), len(res), len(hot)))

print("\n" + "=" * 78)
print("INDUSTRIAL verification — summary")
print("=" * 78)
for name, verdict, ind, off, res, hot in results:
    print(f"  {verdict:14s}  {name:30s}  ind={ind} office={off} resi={res} hot={hot}")
