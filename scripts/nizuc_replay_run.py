"""
nizuc_replay_run.py — Fase 2 del replay de NIZUC.

Re-envia el corpus historico de preguntas contra el flow nuevo
(cd55ce82) con sessionId fresco por pregunta, en paralelo y con
reanudacion automatica (los resultados ya guardados no se repiten).

Entrada:  scripts/nizuc_replay/corpus.json     (Fase 1)
Salida:   scripts/nizuc_replay/replay_results.json

Uso:
    export FLOWISE_API_KEY=...   (o definir en .env del repo)
    python scripts/nizuc_replay_run.py
"""
import json
import os
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests

BASE = Path(__file__).parent / "nizuc_replay"
CORPUS = BASE / "corpus.json"
RESULTS = BASE / "replay_results.json"

FLOW_URL = "https://ecoflow.koppi.mx/api/v1/prediction/cd55ce82-5916-4117-aa3a-98ebd5d0c890"
SESSION_PREFIX = "replay-260902"
WORKERS = 5
TIMEOUT_S = 240


def load_api_key():
    key = os.environ.get("FLOWISE_API_KEY")
    if key:
        return key
    env_file = Path(__file__).parent.parent / ".env"
    with open(env_file, encoding="utf-8") as f:
        for line in f:
            if line.startswith("FLOWISE_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit("No se encontro FLOWISE_API_KEY")


def preguntar(item, api_key):
    sid = f"{SESSION_PREFIX}-{item['id']:04d}"
    t0 = time.time()
    try:
        r = requests.post(
            FLOW_URL,
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={"question": item["pregunta"], "overrideConfig": {"sessionId": sid}},
            timeout=TIMEOUT_S,
        )
        r.raise_for_status()
        texto = r.json().get("text", "")
        return {**item, "respuesta": texto, "segundos": round(time.time() - t0, 1), "status": "ok"}
    except Exception as e:
        return {**item, "respuesta": "", "segundos": round(time.time() - t0, 1),
                "status": f"error: {type(e).__name__}: {str(e)[:120]}"}


def main():
    with open(CORPUS, encoding="utf-8") as f:
        corpus = json.load(f)

    hechos = {}
    if RESULTS.exists():
        with open(RESULTS, encoding="utf-8") as f:
            hechos = {r["id"]: r for r in json.load(f) if r.get("status") == "ok"}

    pendientes = [c for c in corpus if c["id"] not in hechos]
    print(f"corpus: {len(corpus)} | ya contestados: {len(hechos)} | por enviar: {len(pendientes)}")
    if not pendientes:
        print("nada que hacer.")
        return

    api_key = load_api_key()
    resultados = list(hechos.values())
    guardados = 0

    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        futuros = {pool.submit(preguntar, item, api_key): item["id"] for item in pendientes}
        for futuro in as_completed(futuros):
            res = futuro.result()
            resultados.append(res)
            guardados += 1
            if res["status"] != "ok":
                print(f"  [{res['id']:04d}] {res['status'][:100]}")
            if guardados % 20 == 0:
                with open(RESULTS, "w", encoding="utf-8") as f:
                    json.dump(resultados, f, ensure_ascii=False, indent=1)
                ok = sum(1 for r in resultados if r["status"] == "ok")
                print(f"  progreso: {guardados}/{len(pendientes)} (ok acumulado: {ok})")

    with open(RESULTS, "w", encoding="utf-8") as f:
        json.dump(resultados, f, ensure_ascii=False, indent=1)

    ok = [r for r in resultados if r["status"] == "ok"]
    err = [r for r in resultados if r["status"] != "ok"]
    print(f"\nfinal: {len(ok)} ok, {len(err)} errores")
    if ok:
        segs = sorted(r["segundos"] for r in ok)
        print(f"latencia: mediana {segs[len(segs)//2]}s | p90 {segs[int(len(segs)*0.9)]}s | max {segs[-1]}s")


if __name__ == "__main__":
    main()
