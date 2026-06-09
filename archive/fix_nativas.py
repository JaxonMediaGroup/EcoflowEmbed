"""
Fix Nativas: Add Off-Topic Guard + Warm Instructions
"""
import requests, json, copy, time

URL = "https://ecoflow.koppi.mx"
KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
H = {"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}
NATIVAS_ID = "9325bc13-9725-4215-8bfb-455cfa67f768"

TOPICS_DEPA = [
    ("📍", "Ubicación y cómo llegar", "Location and directions"),
    ("🏢", "Tipos de departamentos", "Unit types"),
    ("💰", "Precios y disponibilidad", "Pricing and availability"),
    ("🏊", "Amenidades del desarrollo", "Development amenities"),
    ("💳", "Financiamiento y formas de pago", "Financing and payment options"),
    ("📞", "Información de contacto y visitas", "Contact info and scheduling visits"),
]

def build_guard_prompt():
    topics_es = "\n".join([f"{e} {es}" for e, es, en in TOPICS_DEPA])
    topics_en = "\n".join([f"{e} {en}" for e, es, en in TOPICS_DEPA])
    return (
        "<p>Eres el GUARDIA DE ALCANCE del chatbot de <strong>Nativas</strong>.</p>"
        "<p>🎯 TU ÚNICO TRABAJO: Rechazar amablemente preguntas fuera de tema y redirigir al usuario a temas de Nativas.</p>"
        "<p>🌍 REGLA DE IDIOMA: DETECTA el idioma del mensaje del usuario. SIEMPRE responde en el MISMO idioma.</p>"
        "<p>📝 REGLAS DE RESPUESTA:</p>"
        "<p>1. Si el usuario envía un SALUDO (Hola, Hi, Hello, Buenos días, etc.), responde cálidamente:</p>"
        "<p>'🏠 ¡Hola! Soy el asistente virtual de <strong>Nativas</strong>. ¿En qué puedo ayudarte?'</p>"
        "<p>Luego lista los temas disponibles.</p>"
        "<p>2. Para CUALQUIER pregunta fuera de tema, responde:</p>"
        "<p>'🏠 Soy el asistente virtual de <strong>Nativas</strong> y solo puedo ayudarte con temas relacionados al proyecto.</p>"
        f"<p>Puedo ayudarte con:</p><p>{topics_es}</p>"
        "<p>¿Tienes alguna pregunta sobre Nativas?'</p>"
        "<p>3. ADAPTA el idioma al del usuario:</p>"
        "<ul>"
        f"<li>Inglés: usa estos temas: {topics_en}</li>"
        "<li>Francés, portugués, etc.: traduce los temas</li>"
        "<li>Siempre coincide con el idioma del usuario</li>"
        "</ul>"
        "<p>⛔ ESTRICTAMENTE PROHIBIDO:</p>"
        "<ul>"
        "<li>NUNCA respondas preguntas fuera de tema, ni siquiera parcialmente</li>"
        "<li>NUNCA digas 'No sé pero...' y luego respondas</li>"
        "<li>NUNCA uses búsqueda web ni herramientas</li>"
        "<li>NUNCA proporciones conocimiento general</li>"
        "<li>Mantén las respuestas CORTAS y siempre redirige a temas de Nativas</li>"
        "</ul>"
    )

def build_warm_instructions(offtopic_idx):
    return (
        '<p>Eres un clasificador de intenciones multilingüe para personas interesadas en '
        '<strong>Nativas</strong>, un desarrollo residencial de departamentos en México. '
        'Tu trabajo es entender qué necesita el usuario y enviarlo al agente correcto.</p>'
        '<p><strong>Categorías:</strong></p>'
        '<ol start="0">'
        '<li><strong>Consulta general</strong> — Cualquier pregunta que se pueda relacionar con el proyecto: '
        'ubicación, amenidades, tipos de departamentos, precios, planos, avance de obra, financiamiento, '
        'fecha de entrega, zona, escuelas cercanas, transporte, plusvalía, inversión, estacionamiento, áreas comunes. '
        'Funciona en cualquier idioma.</li>'
        '<li><strong>Contacto o cita</strong> — Cuando el usuario comparte datos personales '
        '(nombre, email, teléfono) o pide agendar visita/llamada.</li>'
        f'<li><strong>Fuera de tema</strong> — SOLO cuando la pregunta es IMPOSIBLE de relacionar '
        f'con Nativas: tareas escolares, código de programación, ecuaciones matemáticas, '
        f'recetas paso a paso, traducción de textos, biografías históricas, poesía creativa.</li>'
        '</ol>'
        '<p><strong>Ejemplos de clasificación:</strong></p><ul>'
        '<li>"¿Qué tipos de departamentos tienen?" → 0 (tipos de unidades)</li>'
        '<li>"¿Cuándo entregan?" → 0 (fecha de entrega)</li>'
        '<li>"¿Tienen roof garden?" → 0 (amenidades)</li>'
        '<li>"¿Aceptan crédito Infonavit?" → 0 (financiamiento)</li>'
        '<li>"María García maria@gmail.com 5551234567" → 1 (datos de contacto)</li>'
        '<li>"Quiero agendar una visita al showroom" → 1 (cita)</li>'
        '</ul>'
        '<p><strong>🧠 ROUTING INTELIGENTE:</strong></p>'
        '<p>Recuerda: el usuario YA está hablando con el asistente de <strong>Nativas</strong>. '
        'Si alguien menciona un interés, gusto o necesidad personal, el agente del proyecto es lo '
        'suficientemente inteligente para conectarlo con Nativas. '
        'Tu trabajo es darle la oportunidad de hacerlo.</p>'
        '<p><strong>💡 Estos SÍ son del proyecto (→ 0):</strong></p><ul>'
        '<li>"Me gustan los perros" → 0 — puede hablar de áreas pet-friendly, dog park</li>'
        '<li>"Tengo 2 hijos" → 0 — puede hablar de ludoteca, escuelas, parques</li>'
        '<li>"Me gusta cocinar" → 0 — puede hablar de las cocinas, diseño interior</li>'
        '<li>"Trabajo desde casa" → 0 — puede hablar de study rooms, coworking, internet</li>'
        '<li>"Me gusta hacer ejercicio" → 0 — puede hablar de gimnasio, alberca, áreas deportivas</li>'
        '<li>"¿Hay buenos restaurantes cerca?" → 0 — zona, estilo de vida, alrededores</li>'
        '<li>"Busco algo para invertir" → 0 — plusvalía, rendimiento, renta</li>'
        '<li>"¿Es segura la zona?" → 0 — seguridad, vigilancia, acceso controlado</li>'
        '</ul>'
        f'<p><strong>🚫 Estos SÍ son fuera de tema (→ {offtopic_idx}):</strong></p><ul>'
        f'<li>"Resuelve 2x+3=7" → {offtopic_idx}</li>'
        f'<li>"Escríbeme código en Python" → {offtopic_idx}</li>'
        f'<li>"Dame la receta del pastel de chocolate" → {offtopic_idx}</li>'
        f'<li>"Ayúdame con mi tarea de historia" → {offtopic_idx}</li>'
        f'<li>"Cuéntame la biografía de Einstein" → {offtopic_idx}</li>'
        f'<li>"Escríbeme un poema de amor" → {offtopic_idx}</li>'
        f'<li>"Traduce este texto al japonés" → {offtopic_idx}</li>'
        f'<li>"¿Cuánto es la raíz cuadrada de 144?" → {offtopic_idx}</li>'
        '</ul>'
        f'<p><strong>⚡ REGLA DE ORO:</strong> Si tienes duda, SIEMPRE envía a una categoría del proyecto (0). '
        f'El agente de Nativas sabe cómo conectar cualquier tema de estilo de vida con el proyecto. '
        f'Solo envía a {offtopic_idx} si es algo ACADÉMICO, TÉCNICO o claramente una solicitud de '
        f'conocimiento que no tiene nada que ver con bienes raíces ni con el estilo de vida del proyecto.</p>'
        '<p><strong>🌍 Nota:</strong> Clasifica por intención, no por idioma. '
        'Si el usuario escribe en inglés, francés o cualquier idioma, clasifica igual. '
        'El sistema maneja las respuestas multilingües automáticamente.</p>'
    )


def main():
    print("🔧 Fixing Nativas...")

    # 1. Fetch
    resp = requests.get(f"{URL}/api/v1/chatflows/{NATIVAS_ID}", headers=H, timeout=30)
    if resp.status_code != 200:
        print(f"❌ Fetch failed: {resp.status_code}")
        return
    flow_data = json.loads(resp.json()["flowData"])

    # Find condition agent
    cond_node = None
    for node in flow_data["nodes"]:
        if node["data"]["name"] == "conditionAgentAgentflow":
            cond_node = node
            break
    if not cond_node:
        print("❌ No condition agent found")
        return

    cond_id = cond_node["id"]
    scenarios = cond_node["data"]["inputs"]["conditionAgentScenarios"]
    new_idx = len(scenarios)  # will be 2
    print(f"   Current scenarios: {len(scenarios)}, new off-topic idx: {new_idx}")

    # 2. Add off-topic scenario
    scenarios.append({
        "scenario": (
            "User asks something COMPLETELY UNRELATED to Nativas "
            "(homework, coding, math, recipes, general trivia, jokes, translations, "
            "weather, sports, politics, AI, health advice, or ANY topic not about this project) "
            "- in any language"
        )
    })

    # 3. Add output anchor to condition agent
    cond_node["data"]["outputAnchors"].append({
        "id": f"{cond_id}-output-{new_idx}",
        "label": "Condition Agent",
        "name": "conditionAgentAgentflow"
    })

    # 4. Set warm instructions
    cond_node["data"]["inputs"]["conditionAgentInstructions"] = build_warm_instructions(new_idx)
    # Also set temperature to 0
    if "conditionAgentModelConfig" in cond_node["data"]["inputs"]:
        cond_node["data"]["inputs"]["conditionAgentModelConfig"]["temperature"] = "0"

    # 5. Determine new agent ID
    max_idx = -1
    for node in flow_data["nodes"]:
        if node["data"]["name"] == "agentAgentflow":
            try:
                idx = int(node["id"].split("_")[-1])
                if idx > max_idx:
                    max_idx = idx
            except ValueError:
                pass
    new_agent_id = f"agentAgentflow_{max_idx + 1}"

    # 6. Copy inputParams from first agent
    first_agent = None
    for node in flow_data["nodes"]:
        if node["data"]["name"] == "agentAgentflow":
            first_agent = node
            break
    input_params = []
    if first_agent:
        input_params = copy.deepcopy(first_agent["data"]["inputParams"])
        for param in input_params:
            if "id" in param:
                param["id"] = param["id"].replace(first_agent["id"], new_agent_id)

    # 7. Position
    cond_x = cond_node.get("position", {}).get("x", 0)
    cond_y = cond_node.get("position", {}).get("y", 0)

    # 8. Create Off-Topic Guard node
    guard_node = {
        "id": new_agent_id,
        "type": "agentFlow",
        "position": {"x": cond_x + 350, "y": cond_y + (new_idx * 130)},
        "width": 329,
        "height": 72,
        "selected": False,
        "positionAbsolute": {"x": cond_x + 350, "y": cond_y + (new_idx * 130)},
        "data": {
            "id": new_agent_id,
            "label": "\ud83d\udeab Off-Topic Guard (Multilingual)",
            "version": 3.2,
            "name": "agentAgentflow",
            "type": "Agent",
            "color": "#FF6B6B",
            "baseClasses": ["Agent"],
            "category": "Agent Flows",
            "description": "Blocks off-topic questions and redirects to project topics",
            "inputParams": input_params,
            "inputAnchors": [],
            "inputs": {
                "agentModel": "chatOpenAI",
                "agentMessages": [{"role": "system", "content": build_guard_prompt()}],
                "agentToolsBuiltInOpenAI": "",
                "agentToolsBuiltInGemini": "",
                "agentToolsBuiltInAnthropic": "",
                "agentTools": [],
                "agentKnowledgeDocumentStores": [],
                "agentKnowledgeVSEmbeddings": [],
                "agentEnableMemory": True,
                "agentMemoryType": "windowSize",
                "agentMemoryWindowSize": "20",
                "agentMemoryMaxTokenLimit": "2000",
                "agentUserMessage": "",
                "agentReturnResponseAs": "userMessage",
                "agentStructuredOutput": "",
                "agentUpdateState": "",
                "agentModelConfig": {
                    "cache": "",
                    "modelName": "gpt-5.1",
                    "temperature": "0",
                    "streaming": True,
                    "maxTokens": "",
                    "topP": "",
                    "frequencyPenalty": "",
                    "presencePenalty": "",
                    "timeout": "",
                    "strictToolCalling": "",
                    "stopSequence": "",
                    "basepath": "",
                    "proxyUrl": "",
                    "baseOptions": "",
                    "allowImageUploads": "",
                    "reasoning": "",
                    "agentModel": "chatOpenAI"
                }
            },
            "outputAnchors": [
                {"id": f"{new_agent_id}-output-agentAgentflow", "label": "Agent", "name": "agentAgentflow"}
            ],
            "outputs": {},
            "selected": False
        },
        "dragging": False
    }
    flow_data["nodes"].append(guard_node)

    # 9. Add edge
    edge = {
        "source": cond_id,
        "sourceHandle": f"{cond_id}-output-{new_idx}",
        "target": new_agent_id,
        "targetHandle": new_agent_id,
        "data": {
            "sourceColor": "#ff8fab",
            "targetColor": "#FF6B6B",
            "isHumanInput": False,
            "edgeStyle": "default"
        },
        "type": "agentFlow",
        "id": f"reactflow__edge-{cond_id}-{cond_id}-output-{new_idx}-{new_agent_id}-{new_agent_id}",
        "style": {"stroke": "#FF6B6B", "strokeWidth": 2}
    }
    flow_data["edges"].append(edge)

    print(f"   ✅ Added Off-Topic Guard node: {new_agent_id}")
    print(f"   ✅ Added scenario {new_idx}")
    print(f"   ✅ Added warm instructions")

    # 10. Push
    payload = {"flowData": json.dumps(flow_data, ensure_ascii=False)}
    push = requests.put(
        f"{URL}/api/v1/chatflows/{NATIVAS_ID}",
        headers=H, json=payload, timeout=30
    )
    if push.status_code == 200:
        print(f"   ✅ Pushed to Flowise!")
    else:
        print(f"   ❌ Push failed: {push.status_code} - {push.text[:200]}")


if __name__ == "__main__":
    main()
