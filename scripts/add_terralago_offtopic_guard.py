"""
Adds a Multilingual ConditionAgent + Off-Topic Guard to Terralago Agents.json
"""
import json
from pathlib import Path
from html import escape

PROJECT_FILE = Path(__file__).parent.parent / "projects" / "Terralago Agents.json"

# ── HTML-encoded prompts ──────────────────────────────────────────────────────

CLASSIFIER_INSTRUCTIONS = """<p>You are a multilingual intent classifier for <strong>Terralago</strong>, a premium mixed-use urban development in Lomas Verdes, Naucalpan, Estado de México. Your job is to understand what the user needs and route them to the correct agent.</p><p><strong>Categories:</strong></p><ol start="0"><li><strong>General inquiry</strong> — Any question that CAN BE RELATED to the project: location, lot types, prices, financing, presale process, amenities, parks, LEED certification, sustainability, infrastructure, nearby services, construction progress, investment, contact info, visiting the development. Works in any language.</li><li><strong>Off-topic</strong> — ONLY when the question is IMPOSSIBLE to relate to Terralago or real estate: homework, programming code, math equations, step-by-step recipes, text translations, historical biographies, creative poetry, sports scores, politics, AI help, health advice, weather.</li></ol><p><strong>Classification examples:</strong></p><ul><li>"¿Dónde está ubicado Terralago?" → 0 (location)</li><li>"¿Cuánto cuesta un lote?" → 0 (pricing)</li><li>"¿Tienen lotes unifamiliares?" → 0 (lot types)</li><li>"¿Qué amenidades tiene?" → 0 (amenities)</li><li>"¿Qué es la certificación LEED?" → 0 (sustainability)</li><li>"¿Cómo puedo contactarlos?" → 0 (contact)</li><li>"¿Hay opciones de financiamiento?" → 0 (financing)</li><li>"What lots are available?" → 0 (lot availability)</li></ul><p><strong>🧠 SMART ROUTING:</strong></p><p>The user is ALREADY talking to the Terralago assistant. If someone mentions a personal interest or lifestyle, the project agent can connect it to Terralago. Your job is to give it the chance to do so.</p><p><strong>These ARE project-related (→ 0):</strong></p><ul><li>"Me gusta vivir cerca de la naturaleza" → 0 — can talk about parks, Presa Madín views, green areas</li><li>"Tengo hijos pequeños" → 0 — can talk about playgrounds, nearby schools, safe streets</li><li>"Busco una inversión inmobiliaria" → 0 — can talk about appreciation, presale pricing</li><li>"¿Es segura la zona?" → 0 — can talk about Lomas Verdes, gated community, resilience plan</li><li>"Me interesan los desarrollos sustentables" → 0 — can talk about LEED Gold, zero-discharge water</li><li>"¿Hay buenas escuelas cerca?" → 0 — can talk about Colegio Alemán, Carol Bauer, UVM (5 min)</li></ul><p><strong>These ARE off-topic (→ 1):</strong></p><ul><li>"Resuelve 2x+3=7" → 1</li><li>"Write me Python code" → 1</li><li>"Dame la receta del pastel de chocolate" → 1</li><li>"Help me with my history homework" → 1</li><li>"Tell me Einstein's biography" → 1</li><li>"Escríbeme un poema de amor" → 1</li><li>"Translate this to Japanese" → 1</li><li>"What's the square root of 144?" → 1</li></ul><p><strong>⚡ GOLDEN RULE:</strong> When in doubt, ALWAYS route to category 0. The Terralago agent knows how to connect lifestyle topics to the project. Only route to 1 if it is clearly ACADEMIC, TECHNICAL, or a knowledge request that has nothing to do with real estate or Terralago's lifestyle.</p><p><strong>🌐 LANGUAGE NOTE:</strong> Classify by intent, NOT by language. If the user writes in English, French, Chinese, Arabic, or any language, classify the same way. The downstream agents handle multilingual responses.</p>"""

GUARD_SYSTEM_PROMPT = """<p>Eres el GUARDIA DE ALCANCE del chatbot de <strong>Terralago</strong>.</p><p><strong>🌍 STRICT LANGUAGE RULE:</strong> Detect the user's language and respond ENTIRELY in that language. If they write in Chinese, respond in Chinese. In French, respond in French. NEVER mix languages. If the user switches language, switch immediately.</p><p>🎯 TU ÚNICO TRABAJO: Rechazar amablemente preguntas fuera de tema y redirigir al usuario a temas de Terralago.</p><p>📋 REGLAS DE RESPUESTA:</p><p>1. Si el usuario envía un SALUDO (Hola, Hi, Hello, Buenos días, etc.), responde:</p><p>'🏡 ¡Hola! Soy el asistente virtual de <strong>Terralago</strong>, el primer desarrollo urbano en México con certificación LEED Gold. ¿En qué puedo ayudarte?</p><p>Puedo ayudarte con:</p><p>📍 Ubicación y cómo llegar<br>🏘️ Tipos de lotes disponibles<br>💰 Precios y financiamiento<br>🌳 Parques y amenidades<br>🌿 Certificación LEED y sustentabilidad<br>📞 Información de contacto y visitas'</p><p>2. Para CUALQUIER pregunta fuera de tema, responde:</p><p>'🏡 Soy el asistente virtual de <strong>Terralago</strong> y solo puedo ayudarte con temas relacionados al desarrollo.</p><p>Puedo ayudarte con:</p><p>📍 Ubicación y accesos<br>🏘️ Lotes unifamiliares y plurifamiliares<br>💰 Precios desde $4.5M MXN y financiamiento<br>🌳 Más de 75,000 m² de parques y amenidades<br>🌿 Certificación LEED Gold y sustentabilidad<br>📞 Contacto: 55 7948 2065 | ventas@terralago.mx</p><p>¿Tienes alguna pregunta sobre Terralago?'</p><p>3. ADAPTA el idioma al del usuario:</p><ul><li>Inglés — use these topics: 📍 Location and directions / 🏘️ Lot types / 💰 Pricing from $4.5M MXN and financing / 🌳 Over 75,000 m² of parks and amenities / 🌿 LEED Gold certification and sustainability / 📞 Contact: 55 7948 2065 | ventas@terralago.mx</li><li>Francés, portugués, etc. — traduce los temas al idioma del usuario</li><li>Siempre coincide con el idioma del usuario</li></ul><p>⛔ ESTRICTAMENTE PROHIBIDO:</p><ul><li>NUNCA respondas preguntas fuera de tema, ni siquiera parcialmente</li><li>NUNCA digas 'No sé pero...' y luego respondas</li><li>NUNCA uses búsqueda web ni herramientas externas</li><li>NUNCA proporciones conocimiento general</li><li>Mantén las respuestas CORTAS y siempre redirige a temas de Terralago</li></ul>"""

# ── Node definitions ──────────────────────────────────────────────────────────

CONDITION_NODE = {
    "id": "conditionAgentAgentflow_0",
    "type": "agentFlow",
    "position": {"x": 100, "y": 81.5},
    "width": 202,
    "height": 75,
    "selected": False,
    "positionAbsolute": {"x": 100, "y": 81.5},
    "data": {
        "id": "conditionAgentAgentflow_0",
        "label": "Multilingual Condition Agent",
        "version": 2,
        "name": "conditionAgentAgentflow",
        "type": "ConditionAgent",
        "color": "#ff8fab",
        "baseClasses": ["ConditionAgent"],
        "category": "Agent Flows",
        "description": "Route user messages between Terralago Q&A and Off-Topic Guard",
        "inputParams": [
            {
                "label": "Model",
                "name": "conditionAgentModel",
                "type": "asyncOptions",
                "loadMethod": "listModels",
                "loadConfig": True,
                "id": "conditionAgentAgentflow_0-input-conditionAgentModel-asyncOptions",
                "display": True
            },
            {
                "label": "Instructions",
                "name": "conditionAgentInstructions",
                "type": "string",
                "rows": 4,
                "optional": True,
                "acceptVariable": True,
                "id": "conditionAgentAgentflow_0-input-conditionAgentInstructions-string",
                "display": True
            },
            {
                "label": "Input",
                "name": "conditionAgentInput",
                "type": "string",
                "rows": 4,
                "optional": True,
                "acceptVariable": True,
                "id": "conditionAgentAgentflow_0-input-conditionAgentInput-string",
                "display": True
            },
            {
                "label": "Conditions",
                "name": "conditionAgentScenarios",
                "type": "array",
                "optional": True,
                "array": [
                    {
                        "label": "Condition",
                        "name": "scenario",
                        "type": "string",
                        "rows": 2,
                        "placeholder": "Scenario for this output"
                    }
                ],
                "id": "conditionAgentAgentflow_0-input-conditionAgentScenarios-array",
                "display": True
            },
            {
                "label": "Override System Prompt",
                "name": "conditionAgentOverrideSystemPrompt",
                "type": "string",
                "rows": 4,
                "optional": True,
                "id": "conditionAgentAgentflow_0-input-conditionAgentOverrideSystemPrompt-string",
                "display": True
            }
        ],
        "inputAnchors": [],
        "inputs": {
            "conditionAgentModel": "chatOpenAI",
            "conditionAgentInstructions": CLASSIFIER_INSTRUCTIONS,
            "conditionAgentInput": "<p><span class=\"variable\" data-type=\"mention\" data-id=\"question\" data-label=\"question\">{{ question }}</span> </p>",
            "conditionAgentScenarios": [
                {
                    "scenario": "General question about Terralago (location, lots, prices, amenities, LEED certification, sustainability, contact, financing, presale)"
                },
                {
                    "scenario": "User asks something COMPLETELY UNRELATED to Terralago or real estate (homework, coding, math, recipes, general trivia, jokes, translations, weather, sports, politics, AI, health advice, or ANY topic not about this development) - in any language"
                }
            ],
            "conditionAgentOverrideSystemPrompt": "",
            "conditionAgentModelConfig": {
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
                "conditionAgentModel": "chatOpenAI"
            }
        },
        "outputAnchors": [
            {
                "id": "conditionAgentAgentflow_0-output-0",
                "label": "0",
                "name": "0"
            },
            {
                "id": "conditionAgentAgentflow_0-output-1",
                "label": "1",
                "name": "1"
            }
        ],
        "outputs": {},
        "selected": False
    },
    "dragging": False
}

GUARD_NODE = {
    "id": "agentAgentflow_1",
    "type": "agentFlow",
    "position": {"x": 370, "y": 180},
    "width": 167,
    "height": 100,
    "selected": False,
    "positionAbsolute": {"x": 370, "y": 180},
    "data": {
        "id": "agentAgentflow_1",
        "label": "🚫 Agent Off-Topic Guard (Multilingual)",
        "version": 3.2,
        "name": "agentAgentflow",
        "type": "Agent",
        "color": "#FF6B6B",
        "baseClasses": ["Agent"],
        "category": "Agent Flows",
        "description": "Blocks off-topic questions and redirects users to Terralago topics",
        "inputParams": [],
        "inputAnchors": [],
        "inputs": {
            "agentModel": "chatOpenAI",
            "agentMessages": [
                {
                    "role": "system",
                    "content": GUARD_SYSTEM_PROMPT
                }
            ],
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
            {
                "id": "agentAgentflow_1-output-agentAgentflow",
                "label": "Agent",
                "name": "agentAgentflow"
            }
        ],
        "outputs": {},
        "selected": False
    },
    "dragging": False
}

# ── Edges ─────────────────────────────────────────────────────────────────────

NEW_EDGES = [
    # Start → ConditionAgent
    {
        "source": "startAgentflow_0",
        "sourceHandle": "startAgentflow_0-output-startAgentflow",
        "target": "conditionAgentAgentflow_0",
        "targetHandle": "conditionAgentAgentflow_0",
        "data": {
            "sourceColor": "#7EE787",
            "targetColor": "#ff8fab",
            "isHumanInput": False
        },
        "type": "agentFlow",
        "id": "startAgentflow_0-startAgentflow_0-output-startAgentflow-conditionAgentAgentflow_0-conditionAgentAgentflow_0"
    },
    # ConditionAgent → Terralago Q&A (scenario 0)
    {
        "source": "conditionAgentAgentflow_0",
        "sourceHandle": "conditionAgentAgentflow_0-output-0",
        "target": "agentAgentflow_0",
        "targetHandle": "agentAgentflow_0",
        "data": {
            "sourceColor": "#ff8fab",
            "targetColor": "#4DD0E1",
            "edgeLabel": "0",
            "isHumanInput": False
        },
        "type": "agentFlow",
        "id": "conditionAgentAgentflow_0-conditionAgentAgentflow_0-output-0-agentAgentflow_0-agentAgentflow_0"
    },
    # ConditionAgent → Off-Topic Guard (scenario 1)
    {
        "source": "conditionAgentAgentflow_0",
        "sourceHandle": "conditionAgentAgentflow_0-output-1",
        "target": "agentAgentflow_1",
        "targetHandle": "agentAgentflow_1",
        "data": {
            "sourceColor": "#ff8fab",
            "targetColor": "#FF6B6B",
            "edgeLabel": "1",
            "isHumanInput": False,
            "edgeStyle": "default"
        },
        "type": "agentFlow",
        "id": "reactflow__edge-conditionAgentAgentflow_0-conditionAgentAgentflow_0-output-1-agentAgentflow_1-agentAgentflow_1",
        "style": {
            "stroke": "#FF6B6B",
            "strokeWidth": 2
        }
    }
]

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    data = json.loads(PROJECT_FILE.read_text(encoding="utf-8"))

    # Reposition Q&A agent slightly right/up for cleaner layout
    for node in data["nodes"]:
        if node["id"] == "agentAgentflow_0":
            node["position"]["x"] = 370
            node["position"]["y"] = -10
            node["positionAbsolute"]["x"] = 370
            node["positionAbsolute"]["y"] = -10

    # Add new nodes
    data["nodes"].append(CONDITION_NODE)
    data["nodes"].append(GUARD_NODE)

    # Replace edges with new routing
    data["edges"] = NEW_EDGES

    PROJECT_FILE.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    print(f"✅ Updated: {PROJECT_FILE.name}")
    print(f"   Nodes: {len(data['nodes'])} | Edges: {len(data['edges'])}")


if __name__ == "__main__":
    main()
