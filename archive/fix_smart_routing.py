"""
Fix Off-Topic routing v2: Make it SMARTER, not just stricter.
- Off-topic ONLY for things absolutely impossible to relate to the project
- Add smart routing examples showing how borderline questions ARE project-related
- Keep blocking homework, code, recipes, etc.
"""
import json
import requests
import time
import sys
import re

FLOWISE_URL = "https://ecoflow.koppi.mx"
API_KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

SKIP_IDS = {
    "a2dbda66-1339-43ae-9c67-d97f30c198ac",  # WTC
    "82ee9777-2d5f-49e9-9998-850eb5063928",  # ALE
    "90b046f2-2b56-4ad1-9fc5-abcd229de895",  # koppi
    "2bc49a0b-5459-4dab-b9a6-f4080c43371c",  # KIO
}


def find_offtopic_scenario_idx(scenarios):
    for i, s in enumerate(scenarios):
        sc = s.get("scenario", "").lower()
        if "completely unrelated" in sc or "off-topic" in sc:
            return i
    return None


def build_smart_instructions(project_name, offtopic_idx, num_scenarios):
    """Build SMART routing instructions that balance intelligence with off-topic blocking."""
    
    # Build the list of project scenario numbers (0 to N-2, excluding off-topic)
    project_cats = ", ".join([str(i) for i in range(offtopic_idx)])
    
    return (
        f'<p><strong>🧠 SMART ROUTING RULES:</strong></p>'
        f'<p>The user is ALREADY chatting with the {project_name} assistant. '
        f'Your job is to route their message to the right category.</p>'
        f''
        f'<p><strong>✅ ROUTE TO PROJECT (categories {project_cats}):</strong></p>'
        f'<ul>'
        f'<li>ANY question that COULD be answered with project info</li>'
        f'<li>Questions about lifestyle, preferences, needs → relate to the project</li>'
        f'<li>Greetings (hola, hi, buenos días) → route to general info (0)</li>'
        f'<li>Vague questions that could connect to the project in any way</li>'
        f'</ul>'
        f''
        f'<p><strong>💡 SMART EXAMPLES (these ARE project-related, route to 0):</strong></p>'
        f'<ul>'
        f'<li>"Me gustan los perros" → 0 (the agent can talk about pet-friendly areas)</li>'
        f'<li>"Tengo hijos" → 0 (the agent can mention kids areas, schools nearby)</li>'
        f'<li>"Hace mucho calor" → 0 (the agent can mention pool, AC, climate)</li>'
        f'<li>"Me gusta correr" → 0 (the agent can mention running paths, gym)</li>'
        f'<li>"Cómo llego desde el aeropuerto" → 0 (location/directions)</li>'
        f'<li>"Me interesa invertir" → 0 (investment info)</li>'
        f'<li>"Busco algo con vista" → 0 (unit options)</li>'
        f'<li>"Quiero algo para vacaciones" → 0 (lifestyle, rental options)</li>'
        f'<li>"Hay Starbucks cerca?" → 0 (neighborhood info)</li>'
        f'<li>"Es segura la zona?" → 0 (location safety)</li>'
        f'<li>"Quiero una hamburguesa" → 0 (the agent can mention restaurants, food areas)</li>'
        f'</ul>'
        f''
        f'<p><strong>🚫 ROUTE TO OFF-TOPIC ({offtopic_idx}) ONLY when the question is IMPOSSIBLE to relate to the project:</strong></p>'
        f'<ul>'
        f'<li>"Resuelve esta ecuación: 2x+3=7" → {offtopic_idx}</li>'
        f'<li>"Escríbeme código en Python" → {offtopic_idx}</li>'
        f'<li>"Dame la receta del pastel de chocolate" → {offtopic_idx}</li>'
        f'<li>"Ayúdame con mi tarea de historia" → {offtopic_idx}</li>'
        f'<li>"¿Cuánto es la raíz cuadrada de 144?" → {offtopic_idx}</li>'
        f'<li>"Traduce este texto al japonés" → {offtopic_idx}</li>'
        f'<li>"¿Quién ganó la Champions League?" → {offtopic_idx}</li>'
        f'<li>"Cuéntame la biografía de Einstein" → {offtopic_idx}</li>'
        f'<li>"Dame consejos para bajar de peso" → {offtopic_idx}</li>'
        f'<li>"Escríbeme un poema de amor" → {offtopic_idx}</li>'
        f'</ul>'
        f''
        f'<p><strong>⚡ GOLDEN RULE:</strong> When in doubt, ALWAYS route to a project category (0). '
        f'The project agent is smart enough to find a way to connect ANY lifestyle topic to {project_name}. '
        f'Only send to {offtopic_idx} if it is ACADEMIC, TECHNICAL, or clearly a request for non-project knowledge.</p>'
    )


def fix_instructions(instructions, project_name, offtopic_idx, num_scenarios):
    """Remove old off-topic additions and add smart routing."""
    
    # Remove old off-topic examples block (from fix v1)
    old_v1 = r'<p><strong>🚫 OFF-TOPIC EXAMPLES.*?realmente trata sobre el proyecto\.</p>'
    instructions = re.sub(old_v1, '', instructions, flags=re.DOTALL)
    
    # Remove old weak off-topic instruction
    old_weak = r'<p><strong>⚠️ Category \d+ - OFF-TOPIC:</strong>.*?ALWAYS choose the project category\.</strong></p>'
    instructions = re.sub(old_weak, '', instructions, flags=re.DOTALL)
    
    # Remove old KEY PRINCIPLE
    old_kp = r'<p>🔑\s*<strong>KEY PRINCIPLE:</strong>.*?project-related category\.</p>'
    instructions = re.sub(old_kp, '', instructions, flags=re.DOTALL)
    
    # Clean up any double whitespace/newlines from removals
    instructions = re.sub(r'\n{3,}', '\n\n', instructions)
    instructions = instructions.strip()
    
    # Append new smart instructions
    instructions += build_smart_instructions(project_name, offtopic_idx, num_scenarios)
    
    return instructions


def also_fix_scenario_text(scenarios, offtopic_idx, project_name):
    """Make the off-topic scenario text less aggressive."""
    scenarios[offtopic_idx]["scenario"] = (
        f"User asks something IMPOSSIBLE to relate to {project_name} "
        f"(academic homework, coding, math equations, recipes step-by-step, "
        f"translations, historical biographies, poetry writing) - in any language"
    )


def main():
    print("=" * 70)
    print("🧠 SMART OFF-TOPIC ROUTING v2 - Balance intelligence + blocking")
    print("=" * 70)

    resp = requests.get(f"{FLOWISE_URL}/api/v1/chatflows", headers=HEADERS, timeout=30)
    if resp.status_code != 200:
        print(f"❌ Failed: {resp.status_code}")
        sys.exit(1)

    agentflows = [cf for cf in resp.json() if cf.get("type") == "AGENTFLOW"]
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

        cond_node = None
        for node in flow_data["nodes"]:
            if node["data"]["name"] == "conditionAgentAgentflow":
                cond_node = node
                break

        if not cond_node:
            results["skipped"].append((cf_name, "No condition agent"))
            print(f"   ⏭️  SKIP: No condition agent")
            continue

        scenarios = cond_node["data"]["inputs"]["conditionAgentScenarios"]
        ot_idx = find_offtopic_scenario_idx(scenarios)
        if ot_idx is None:
            results["skipped"].append((cf_name, "No off-topic scenario"))
            print(f"   ⏭️  SKIP: No off-topic scenario")
            continue

        num_scenarios = len(scenarios)

        # Fix scenario text
        also_fix_scenario_text(scenarios, ot_idx, cf_name)
        print(f"   📋 Scenario {ot_idx} text updated")

        # Fix instructions
        old_inst = cond_node["data"]["inputs"]["conditionAgentInstructions"]
        new_inst = fix_instructions(old_inst, cf_name, ot_idx, num_scenarios)
        cond_node["data"]["inputs"]["conditionAgentInstructions"] = new_inst
        print(f"   📝 Instructions: {len(old_inst)} → {len(new_inst)} chars")

        # Push
        payload = {"flowData": json.dumps(flow_data, ensure_ascii=False)}
        push = requests.put(
            f"{FLOWISE_URL}/api/v1/chatflows/{cf_id}",
            headers=HEADERS, json=payload, timeout=30
        )
        if push.status_code == 200:
            print(f"   ✅ Pushed!")
            results["fixed"].append(cf_name)
        else:
            print(f"   ❌ Push failed: {push.status_code}")
            results["failed"].append((cf_name, f"Push {push.status_code}"))

        time.sleep(0.3)

    print("\n" + "=" * 70)
    print(f"📊 FIXED: {len(results['fixed'])} | SKIPPED: {len(results['skipped'])} | FAILED: {len(results['failed'])}")
    print("=" * 70)
    for n in results["fixed"]:
        print(f"   ✓ {n}")


if __name__ == "__main__":
    main()
