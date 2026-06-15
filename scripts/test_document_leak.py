"""
Test all chatbots for "document leak" — responses that reveal the chatbot
is consulting a document/ficha instead of responding naturally.

Sends a simple price/info question to each bot and checks if the response
contains forbidden phrases like "según el documento", "la ficha", etc.
"""
import json
import time
import requests
from pathlib import Path

FLOWISE_URL = "https://ecoflow.koppi.mx"
API_KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

PROJECTS_JSON = Path(__file__).parent.parent / "projects.json"

# Generic question that forces the bot to look up info from its document
TEST_QUESTION = "¿Qué documentos necesito para firmar contrato y cuánto tarda el proceso de escrituración?"

# Phrases that indicate the bot is exposing its document source
LEAK_PHRASES = [
    # Spanish - document references
    "según el documento",
    "de acuerdo al documento",
    "de acuerdo con el documento",
    "el documento menciona",
    "el documento indica",
    "el documento dice",
    "el documento señala",
    "el documento no incluye",
    "el documento no menciona",
    "en el documento",
    "no viene en el documento",
    "no aparece en el documento",
    "no se menciona en el documento",
    "no está en el documento",
    "no consta en el documento",
    "no se especifica en el documento",
    # Spanish - ficha references
    "según la ficha",
    "de acuerdo con la ficha",
    "la ficha indica",
    "la ficha menciona",
    "la ficha dice",
    "la ficha señala",
    "la ficha no incluye",
    "la ficha no menciona",
    "en la ficha",
    "no viene en la ficha",
    "no aparece en la ficha",
    "no se menciona en la ficha",
    # Spanish - generic source exposure
    "según la información proporcionada",
    "según los datos proporcionados",
    "de acuerdo con la información",
    "con base en la información",
    "de acuerdo con los datos",
    "según mi base de datos",
    "según mis datos",
    "en mi base de datos",
    "la base de datos indica",
    "no tengo esa información en",
    "esa información no está disponible en",
    "la fuente",
    "el archivo",
    "la documentación indica",
    "según la documentación",
    # English - document references
    "according to the document",
    "based on the document",
    "the document states",
    "the document says",
    "the document mentions",
    "the document indicates",
    "not mentioned in the document",
    "not in the document",
    "not found in the document",
    "based on the provided document",
    "based on the information provided",
    "according to the provided",
    "based on the data",
    # Generic info_get / tool references
    "la herramienta",
    "info_get",
    "la fuente oficial",
    # Indirect source exposure — "in the info I have"
    "en la información que tengo",
    "en la información oficial que tengo",
    "en la información disponible",
    "en la información que manejo",
    "en la información a la mano",
    "no está disponible en la información",
    "no aparece en la información",
    "no viene en la información",
    "no está indicado en la información",
    "no está especificado en la información",
    "no se especifica en la información",
    "no se indica en la información",
    "no se menciona en la información",
    "no consta en la información",
    "la información que tengo aquí",
    "la información oficial que tengo",
    "la información que tengo disponible",
    "la información que manejo aquí",
    "información disponible aquí",
    "información que tengo a la mano",
    "según los datos que tengo",
    "en los datos que tengo",
    "no aparece en los datos",
    "no está en los datos que tengo",
]

TIMEOUT = 45
DELAY_BETWEEN = 1.5  # seconds between requests to avoid rate limits


def query_chatbot(chatflow_id: str, question: str) -> dict:
    """Send question to chatbot. Returns dict with status and response."""
    try:
        resp = requests.post(
            f"{FLOWISE_URL}/api/v1/prediction/{chatflow_id}",
            headers=HEADERS,
            json={
                "question": question,
                "overrideConfig": {
                    "sessionId": f"doc_leak_test_{chatflow_id[:8]}"
                }
            },
            timeout=TIMEOUT
        )
        if resp.status_code == 200:
            data = resp.json()
            if isinstance(data, dict):
                text = data.get("text", data.get("answer", str(data)))
            else:
                text = str(data)
            return {"ok": True, "text": text}
        else:
            return {"ok": False, "text": f"HTTP {resp.status_code}: {resp.text[:200]}"}
    except requests.Timeout:
        return {"ok": False, "text": "TIMEOUT"}
    except Exception as e:
        return {"ok": False, "text": f"ERROR: {str(e)[:200]}"}


def detect_leaks(text: str) -> list[str]:
    """Return list of leak phrases found in the response (case-insensitive)."""
    text_lower = text.lower()
    found = []
    for phrase in LEAK_PHRASES:
        if phrase.lower() in text_lower:
            found.append(phrase)
    return found


def main():
    data = json.loads(PROJECTS_JSON.read_text(encoding="utf-8"))
    projects = data["projects"]

    # Only test projects with a valid chatflow_id
    testable = {
        name: info
        for name, info in projects.items()
        if info.get("chatflow_id", "").strip()
    }

    print(f"Testing {len(testable)} chatbots for document leak phrases")
    print(f"Question: \"{TEST_QUESTION}\"\n")
    print("=" * 80)

    results = []
    leakers = []
    errors = []

    for i, (name, info) in enumerate(sorted(testable.items()), 1):
        chatflow_id = info["chatflow_id"]
        print(f"[{i:02d}/{len(testable)}] {name} ...", end=" ", flush=True)

        result = query_chatbot(chatflow_id, TEST_QUESTION)

        if not result["ok"]:
            print(f"SKIP ({result['text'][:60]})")
            errors.append({"name": name, "reason": result["text"]})
            results.append({
                "name": name, "chatflow_id": chatflow_id,
                "status": "error", "leaks": [], "response": result["text"]
            })
            time.sleep(DELAY_BETWEEN)
            continue

        response_text = result["text"]
        leaks = detect_leaks(response_text)

        if leaks:
            print(f"⚠️  LEAK FOUND: {leaks}")
            leakers.append({
                "name": name,
                "leaks": leaks,
                "snippet": response_text[:300].replace('\n', ' ')
            })
            results.append({
                "name": name, "chatflow_id": chatflow_id,
                "status": "leak", "leaks": leaks, "response": response_text[:500]
            })
        else:
            print(f"OK  — {response_text[:80].replace(chr(10), ' ')}")
            results.append({
                "name": name, "chatflow_id": chatflow_id,
                "status": "clean", "leaks": [], "response": response_text[:300]
            })

        time.sleep(DELAY_BETWEEN)

    # ── Summary ───────────────────────────────────────────────────────────────
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)

    clean = [r for r in results if r["status"] == "clean"]
    print(f"\n✅ CLEAN  ({len(clean)}):")
    for r in clean:
        print(f"   {r['name']}")

    if leakers:
        print(f"\n⚠️  LEAKING DOCUMENT PHRASES ({len(leakers)}):")
        for l in leakers:
            print(f"\n   [{l['name']}]")
            print(f"   Phrases: {', '.join(l['leaks'])}")
            print(f"   Snippet: {l['snippet'][:200]}")
    else:
        print("\n✅ No document leaks found!")

    if errors:
        print(f"\n❌ ERRORS / SKIPPED ({len(errors)}):")
        for e in errors:
            print(f"   {e['name']}: {e['reason'][:80]}")

    print(f"\nTotal: {len(results)} tested | {len(clean)} clean | {len(leakers)} leaking | {len(errors)} errors")

    # Save full results
    out_path = PROJECTS_JSON.parent / "scripts" / "doc_leak_results.json"
    out_path.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nFull results saved to: {out_path}")


if __name__ == "__main__":
    main()
