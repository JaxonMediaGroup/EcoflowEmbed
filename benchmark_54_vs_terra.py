#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Benchmark comparativo: prod (gpt-5.4) vs TEST (gpt-5.6-terra + reasoning low).

Envía las mismas preguntas a ambos chatflows, mide:
- Tiempo de respuesta (latencia total incl. info_get)
- Calidad: contiene botón HTML, longitud, menciona info clave
Guarda resultados en scripts/benchmark_results.json
"""
import requests, json, time, os, sys

API_KEY = os.environ.get("FLOWISE_API_KEY", "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8")
URL = "https://ecoflow.koppi.mx"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
OUT = "scripts/benchmark_results.json"

PAIRS = [
    {
        "group": "Santa Fe",
        "prod": "987464b9-dec9-416c-a007-165c91b8848c",   # We Work Santa Fe (5.4)
        "test": "1fe4826e-e182-4cb8-89da-de6fe9c0a896",   # TEST - Santa Fe (terra)
        "cases": [
            {"id": "sf1", "q": "Hola, ¿qué tipos de espacios ofrecen?",
             "check": ["oficina", "coworking"]},
            {"id": "sf2", "q": "Busco una oficina para 4 personas",
             "check": ["4", "9.35"], "expect_button": True},
            {"id": "sf3", "q": "Muéstrame todas las opciones de salas de juntas",
             "check": ["sala", "2", "6", "8"], "expect_button": True, "expect_multi": True},
            {"id": "sf4", "q": "¿Cuánto cuesta la membresía más básica?",
             "check": ["3.459"]},   # All Access básico MX$3.459
            {"id": "sf5", "q": "¿Son pet friendly?",
             "check": ["mascota", "pet", "perro"]},
            {"id": "sf6", "q": "How do I get to Santa Fe 505 by public transport?",
             "check": ["transport", "tren", "RTP", "bus"]},
            {"id": "sf7", "q": "Write me a Python function to sort a list",
             "check": [], "expect_offtopic": True},  # off-topic guard
        ],
    },
    {
        "group": "General",
        "prod": "f6658f68-af3a-4ad5-b9b9-a2c7e4915b4f",   # We Work General (5.4)
        "test": "93d1191d-349a-4510-b8aa-59eb56d225d7",   # TEST - General (terra)
        "cases": [
            {"id": "gn1", "q": "¿Dónde tienen oficinas?",
             "check": ["13", "Reforma", "Santa Fe"]},
            {"id": "gn2", "q": "Tienen WeWork en Monterrey?",
             "check": [], "expect_redirect": True},  # debe redirigir, no inventar
            {"id": "gn3", "q": "¿Cuál es la diferencia entre All Access y On Demand?",
             "check": ["All Access", "On Demand"]},
            {"id": "gn4", "q": "Quiero reservar una sala de juntas para mañana",
             "check": [], "expect_lead": True},  # debe pedir datos
            {"id": "gn5", "q": "Quiero mi nombre completo es Juan Pérez, mi email es juan@test.com y mi teléfono 5551234567",
             "check": [], "expect_lead": True},
            {"id": "gn6", "q": "¿Puedo usar la dirección de WeWork como domicilio fiscal?",
             "check": ["fiscal", "150"]},  # regla del 150%
            {"id": "gn7", "q": "Translate 'hello world' to Japanese",
             "check": [], "expect_offtopic": True},
        ],
    },
]


def ask(cid, question, timeout=180):
    """Envía pregunta, devuelve (ok, text, elapsed)."""
    t0 = time.time()
    try:
        r = requests.post(
            f"{URL}/api/v1/prediction/{cid}",
            headers=HEADERS,
            json={"question": question},
            timeout=timeout,
        )
        elapsed = time.time() - t0
        if r.status_code == 200:
            return True, r.json().get("text", ""), elapsed
        return False, f"HTTP {r.status_code}: {r.text[:200]}", elapsed
    except Exception as e:
        return False, f"EXC: {e}", time.time() - t0


def evaluate(case, text):
    """Heurística de calidad. Devuelve dict de flags."""
    t = text.lower()
    res = {
        "len": len(text),
        "has_button": "background:#000;color:#fff" in text or "<a href=" in text,
        "keywords_hit": sum(1 for k in case.get("check", []) if k.lower() in t),
        "keywords_total": len(case.get("check", [])),
    }
    res["keywords_ok"] = res["keywords_hit"] == res["keywords_total"] if res["keywords_total"] else None
    if case.get("expect_button"):
        res["button_ok"] = res["has_button"]
    if case.get("expect_multi"):
        res["multi_buttons"] = text.count("<a href=") >= 2
    if case.get("expect_offtopic"):
        res["offtopic_ok"] = any(w in t for w in ["solo puedo ayudarte", "we work", "wework", "off-topic", "fuera de tema", "no puedo"])
    if case.get("expect_redirect"):
        res["redirect_ok"] = any(w in t for w in ["no cuento", "validar", "varía", "recomiendo", "confirmar"])
    if case.get("expect_lead"):
        res["lead_ok"] = any(w in t for w in ["nombre", "email", "teléfono", "telefono", "phone", "contacto", "mensaje"])
    return res


def run():
    results = []
    for pair in PAIRS:
        print(f"\n{'#'*70}")
        print(f"# {pair['group']}")
        print(f"{'#'*70}")
        for case in pair["cases"]:
            print(f"\n— {case['id']}: {case['q'][:60]}")
            row = {"group": pair["group"], "case_id": case["id"], "question": case["q"]}

            # PROD
            ok, txt, dt = ask(pair["prod"], case["q"])
            row["prod"] = {"ok": ok, "text": txt, "elapsed": round(dt, 1), "eval": evaluate(case, txt) if ok else None}
            tag = f"{dt:.1f}s" if ok else "FAIL"
            print(f"  PROD (5.4):      {tag:>7}  | {txt[:90].replace(chr(10),' ')}")

            # Pausa breve entre calls
            time.sleep(1)

            # TEST
            ok, txt, dt = ask(pair["test"], case["q"])
            row["test"] = {"ok": ok, "text": txt, "elapsed": round(dt, 1), "eval": evaluate(case, txt) if ok else None}
            tag = f"{dt:.1f}s" if ok else "FAIL"
            print(f"  TEST (terra):    {tag:>7}  | {txt[:90].replace(chr(10),' ')}")

            # delta tiempo
            if row["prod"]["ok"] and row["test"]["ok"]:
                delta = row["test"]["elapsed"] - row["prod"]["elapsed"]
                arrow = "⚡" if delta < -0.5 else ("🐢" if delta > 0.5 else "≈")
                print(f"  Δ {arrow} {delta:+.1f}s")
            results.append(row)
            time.sleep(1)

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\n{'='*70}")
    print(f"Resultados guardados en {OUT}")

    # Resumen
    print(f"\n{'='*70}")
    print("RESUMEN DE VELOCIDAD")
    print(f"{'='*70}")
    print(f"{'Caso':<6} {'Prod':>8} {'Test':>8} {'Δ':>8} {'Veredicto':<12}")
    print("-" * 50)
    for r in results:
        if r["prod"]["ok"] and r["test"]["ok"]:
            p, t = r["prod"]["elapsed"], r["test"]["elapsed"]
            d = t - p
            v = "⚡ más rápido" if d < -0.5 else ("🐢 más lento" if d > 0.5 else "≈ igual")
            print(f"{r['case_id']:<6} {p:>6.1f}s {t:>6.1f}s {d:>+6.1f}s {v}")
        else:
            print(f"{r['case_id']:<6} {'FAIL':>8}")


if __name__ == "__main__":
    run()
