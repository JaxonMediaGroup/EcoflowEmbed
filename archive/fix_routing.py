"""
Fix routing for ALL agents: Add KEY PRINCIPLE to condition agent instructions.
The principle ensures the router assumes user questions are about the project,
not unrelated topics. This prevents overly restrictive routing.
"""
import json
import os
import re
import shutil

CHATBOTS_DIR = r"C:\Users\Guillermo\Downloads\Chatbots"

# WTC already fixed
SKIP_FILES = {"WTC Agents.json"}

# Novotech files don't have condition agents (checked earlier)
# Only process files that have conditionAgentInstructions

KEY_PRINCIPLE_EN = (
    '<p>🔑 <strong>KEY PRINCIPLE:</strong> The user is ALREADY chatting with this assistant. '
    'Therefore, ASSUME their questions are about {project_name} unless the topic is CLEARLY and '
    'COMPLETELY unrelated (e.g., homework, coding, math, recipes, general trivia). '
    'If the question COULD relate to the project in any way, route it to the relevant category. '
    'When in doubt, ALWAYS choose the project-related category.</p>'
)

KEY_PRINCIPLE_ES = (
    '<p>🔑 <strong>PRINCIPIO CLAVE:</strong> El usuario YA está conversando con este asistente. '
    'Por lo tanto, ASUME que sus preguntas son sobre {project_name} a menos que el tema sea CLARAMENTE '
    'no relacionado (ej: tareas escolares, programación, matemáticas, recetas, trivia). '
    'Si la pregunta PODRÍA relacionarse con el proyecto, enruta a la categoría relevante. '
    'En caso de duda, SIEMPRE elige la categoría del proyecto.</p>'
)

def detect_language(instructions):
    """Detect if the instructions are primarily in Spanish or English."""
    spanish_markers = [
        "clasificador de intenciones", "Pregunta general", "datos de contacto",
        "ubicación", "amenidades", "horarios", "servicios",
        "Solicita contacto", "pregunta general sobre"
    ]
    for marker in spanish_markers:
        if marker.lower() in instructions.lower():
            return "es"
    return "en"

def extract_project_name(scenarios_list):
    """Extract project name from the first scenario."""
    if not scenarios_list:
        return "the project"
    first = scenarios_list[0].get("scenario", "")
    # Pattern: "General question about X" or "Pregunta general sobre X"
    m = re.search(r"(?:about|sobre)\s+(.+?)$", first, re.IGNORECASE)
    if m:
        return m.group(1).strip()
    return "the project"

def process_file(filepath):
    """Add KEY PRINCIPLE to a single agent JSON file."""
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    modified = False
    nodes = data.get("nodes", [])

    for node in nodes:
        node_data = node.get("data", {})
        if node_data.get("name") != "conditionAgentAgentflow":
            continue

        inputs = node_data.get("inputs", {})
        instructions = inputs.get("conditionAgentInstructions", "")
        scenarios = inputs.get("conditionAgentScenarios", [])

        if not instructions:
            continue

        # Skip if already has KEY PRINCIPLE
        if "KEY PRINCIPLE" in instructions or "PRINCIPIO CLAVE" in instructions:
            print(f"  ⏭️  Already has KEY PRINCIPLE, skipping")
            continue

        project_name = extract_project_name(scenarios)
        lang = detect_language(instructions)

        if lang == "es":
            principle = KEY_PRINCIPLE_ES.format(project_name=project_name)
        else:
            principle = KEY_PRINCIPLE_EN.format(project_name=project_name)

        # Insert principle at the beginning of the instructions
        # Handle both <p> start and non-<p> start
        if instructions.strip().startswith("<p>"):
            # Insert before the first <p>
            new_instructions = principle + instructions
        else:
            new_instructions = principle + instructions

        inputs["conditionAgentInstructions"] = new_instructions
        modified = True
        print(f"  ✅ Added {lang.upper()} principle for: {project_name}")

    if modified:
        # Create backup
        backup_path = filepath + ".pre_routing_fix"
        if not os.path.exists(backup_path):
            shutil.copy2(filepath, backup_path)

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    return modified

def main():
    json_files = [f for f in os.listdir(CHATBOTS_DIR)
                  if f.endswith("Agents.json") and not f.endswith(".bak")
                  and f not in SKIP_FILES]
    json_files.sort()

    total = 0
    modified = 0

    for filename in json_files:
        filepath = os.path.join(CHATBOTS_DIR, filename)

        # Quick check: does it have a condition agent?
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        if "conditionAgentAgentflow" not in content:
            continue

        total += 1
        print(f"\n📄 {filename}")

        try:
            if process_file(filepath):
                modified += 1
        except Exception as e:
            print(f"  ❌ Error: {e}")

    print(f"\n{'='*50}")
    print(f"📊 Results: {modified}/{total} files modified")
    print(f"💾 Backups saved as .pre_routing_fix")

if __name__ == "__main__":
    main()
