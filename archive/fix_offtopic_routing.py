"""
Fix Off-Topic Guard routing for all 38 agents:
1. Lower condition agent temperature to 0
2. Rewrite off-topic instructions with clear examples
3. Push to Flowise
"""
import json
import requests
import time
import sys
import os
import re

FLOWISE_URL = "https://ecoflow.koppi.mx"
API_KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

# Skip these (no off-topic guard added)
SKIP_IDS = {
    "a2dbda66-1339-43ae-9c67-d97f30c198ac",  # WTC
    "82ee9777-2d5f-49e9-9998-850eb5063928",  # ALE
    "90b046f2-2b56-4ad1-9fc5-abcd229de895",  # koppi
    "2bc49a0b-5459-4dab-b9a6-f4080c43371c",  # KIO
}


def find_offtopic_scenario_idx(scenarios):
    """Find the index of the off-topic scenario."""
    for i, s in enumerate(scenarios):
        sc = s.get("scenario", "").lower()
        if "completely unrelated" in sc or "off-topic" in sc:
            return i
    return None


def build_offtopic_examples(project_name, offtopic_idx):
    """Build clear off-topic examples to append to instructions."""
    return (
        f'<p><strong>🚫 OFF-TOPIC EXAMPLES (Category {offtopic_idx}):</strong></p>'
        f'<ul>'
        f'<li>"Dame una receta de pastel" → {offtopic_idx}</li>'
        f'<li>"¿Quién ganó el mundial?" → {offtopic_idx}</li>'
        f'<li>"Help me with my homework" → {offtopic_idx}</li>'
        f'<li>"Write me Python code" → {offtopic_idx}</li>'
        f'<li>"¿Cuánto es 2+2?" → {offtopic_idx}</li>'
        f'<li>"Cuéntame un chiste" → {offtopic_idx}</li>'
        f'<li>"¿Quién es Messi?" → {offtopic_idx}</li>'
        f'<li>"Translate this to French" → {offtopic_idx}</li>'
        f'<li>"What is the capital of Japan?" → {offtopic_idx}</li>'
        f'<li>"dame tips de salud" → {offtopic_idx}</li>'
        f'</ul>'
        f'<p><strong>REGLA:</strong> Si la pregunta NO tiene nada que ver con {project_name}, '
        f'clasifícala como {offtopic_idx}. Solo envía a categorías del proyecto si la pregunta '
        f'realmente trata sobre el proyecto.</p>'
    )


def fix_instructions(instructions, project_name, offtopic_idx):
    """Replace the weak off-topic instruction with strong one."""
    # Remove old weak off-topic instruction (the one we appended before)
    old_pattern = (
        r'<p><strong>⚠️ Category \d+ - OFF-TOPIC:</strong>.*?'
        r'ALWAYS choose the project category\.</strong></p>'
    )
    instructions = re.sub(old_pattern, '', instructions, flags=re.DOTALL)

    # Remove old KEY PRINCIPLE if present
    key_principle_pattern = (
        r'<p>🔑\s*<strong>KEY PRINCIPLE:</strong>.*?project-related category\.</p>'
    )
    instructions = re.sub(key_principle_pattern, '', instructions, flags=re.DOTALL)

    # Add strong off-topic examples at the end
    instructions += build_offtopic_examples(project_name, offtopic_idx)

    return instructions


def main():
    print("=" * 70)
    print("🔧 FIX OFF-TOPIC ROUTING - Temperature + Instructions")
    print("=" * 70)

    # Fetch all chatflows
    print("\n📋 Fetching all chatflows...")
    resp = requests.get(f"{FLOWISE_URL}/api/v1/chatflows", headers=HEADERS, timeout=30)
    if resp.status_code != 200:
        print(f"❌ Failed: {resp.status_code}")
        sys.exit(1)

    all_chatflows = resp.json()
    agentflows = [cf for cf in all_chatflows if cf.get("type") == "AGENTFLOW"]
    print(f"   {len(agentflows)} AGENTFLOW chatflows")

    results = {"fixed": [], "skipped": [], "failed": []}

    for i, cf in enumerate(agentflows):
        cf_id = cf["id"]
        cf_name = cf.get("name", "Unknown")
        print(f"\n{'─' * 60}")
        print(f"[{i+1}/{len(agentflows)}] {cf_name}")

        if cf_id in SKIP_IDS:
            results["skipped"].append((cf_name, "Skip list"))
            print(f"   ⏭️  SKIP")
            continue

        # Fetch full data
        try:
            detail = requests.get(
                f"{FLOWISE_URL}/api/v1/chatflows/{cf_id}",
                headers=HEADERS, timeout=30
            )
            if detail.status_code != 200:
                results["failed"].append((cf_name, f"HTTP {detail.status_code}"))
                continue
            flow_data = json.loads(detail.json()["flowData"])
        except Exception as e:
            results["failed"].append((cf_name, str(e)))
            continue

        # Find condition agent
        cond_node = None
        for node in flow_data["nodes"]:
            if node["data"]["name"] == "conditionAgentAgentflow":
                cond_node = node
                break

        if not cond_node:
            results["skipped"].append((cf_name, "No condition agent"))
            print(f"   ⏭️  SKIP: No condition agent")
            continue

        # Find off-topic scenario
        scenarios = cond_node["data"]["inputs"]["conditionAgentScenarios"]
        ot_idx = find_offtopic_scenario_idx(scenarios)
        if ot_idx is None:
            results["skipped"].append((cf_name, "No off-topic scenario"))
            print(f"   ⏭️  SKIP: No off-topic scenario")
            continue

        # === FIX 1: Temperature → 0 ===
        old_temp = cond_node["data"]["inputs"]["conditionAgentModelConfig"]["temperature"]
        cond_node["data"]["inputs"]["conditionAgentModelConfig"]["temperature"] = 0
        print(f"   🌡️  Temperature: {old_temp} → 0")

        # === FIX 2: Rewrite instructions ===
        old_inst = cond_node["data"]["inputs"]["conditionAgentInstructions"]
        new_inst = fix_instructions(old_inst, cf_name, ot_idx)
        cond_node["data"]["inputs"]["conditionAgentInstructions"] = new_inst
        print(f"   📝 Instructions updated ({len(old_inst)} → {len(new_inst)} chars)")

        # Push to Flowise
        payload = {"flowData": json.dumps(flow_data, ensure_ascii=False)}
        push = requests.put(
            f"{FLOWISE_URL}/api/v1/chatflows/{cf_id}",
            headers=HEADERS, json=payload, timeout=30
        )
        if push.status_code == 200:
            print(f"   ✅ Pushed successfully!")
            results["fixed"].append(cf_name)
        else:
            print(f"   ❌ Push failed: {push.status_code}")
            results["failed"].append((cf_name, f"Push {push.status_code}"))

        time.sleep(0.3)

    # Summary
    print("\n" + "=" * 70)
    print("📊 SUMMARY")
    print("=" * 70)
    print(f"\n✅ FIXED ({len(results['fixed'])}):")
    for n in results["fixed"]:
        print(f"   ✓ {n}")
    print(f"\n⏭️  SKIPPED ({len(results['skipped'])}):")
    for n, r in results["skipped"]:
        print(f"   → {n}: {r}")
    print(f"\n❌ FAILED ({len(results['failed'])}):")
    for n, r in results["failed"]:
        print(f"   ✗ {n}: {r}")


if __name__ == "__main__":
    main()
