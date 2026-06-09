"""
Add Off-Topic Guard agent to LST La Santisima (and push to Flowise).
- Adds a new scenario "Off-Topic" to the condition agent
- Adds a new output anchor (3) to the condition agent
- Adds an Off-Topic Guard agent node
- Adds an edge from condition output 3 → Off-Topic Guard
- Updates condition agent instructions to include off-topic category
- Pushes to Flowise via API
"""
import json
import requests
import copy

FLOWISE_URL = "https://ecoflow.koppi.mx"
API_KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

LST_CHATFLOW_ID = "80f70d3a-4e14-49cf-b743-7ca9dd841a70"
LOCAL_FILE = r"c:\Users\Guillermo\Downloads\Chatbots\LST La Santisima Agents.json"

def load_local_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_local_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def add_offtopic_guard(flow_data, project_name="La Santísima Trinidad"):
    """Add Off-Topic Guard to a flow that doesn't have one."""
    
    # Find the condition agent node
    condition_node = None
    condition_idx = None
    for i, node in enumerate(flow_data["nodes"]):
        if node["data"]["name"] == "conditionAgentAgentflow":
            condition_node = node
            condition_idx = i
            break
    
    if not condition_node:
        print("❌ No condition agent found!")
        return False
    
    # Check if off-topic already exists
    scenarios = condition_node["data"]["inputs"]["conditionAgentScenarios"]
    for s in scenarios:
        if "off-topic" in s["scenario"].lower() or "unrelated" in s["scenario"].lower():
            print("⚠️ Off-topic scenario already exists, skipping")
            return False
    
    # Determine the new scenario index
    new_idx = len(scenarios)
    print(f"📋 Current scenarios: {len(scenarios)}, adding Off-Topic as scenario {new_idx}")
    
    # 1. Add off-topic scenario
    scenarios.append({
        "scenario": f"User asks something COMPLETELY UNRELATED to {project_name} (personal questions, homework, coding, math, recipes, general knowledge, jokes, translations, health advice, sports, politics, AI, or ANY topic not about the real estate project) - in any language"
    })
    
    # 2. Add output anchor to condition agent
    condition_node["data"]["outputAnchors"].append({
        "id": f"conditionAgentAgentflow_0-output-{new_idx}",
        "label": new_idx,
        "name": new_idx,
        "description": f"Condition {new_idx}"
    })
    
    # 3. Update condition agent instructions to include off-topic category
    old_instructions = condition_node["data"]["inputs"]["conditionAgentInstructions"]
    
    # Build new instructions with off-topic category
    offtopic_category = (
        f"<p><strong>Category {new_idx}:</strong> OFF-TOPIC (CLEARLY unrelated to {project_name})</p>"
        f"<ul>"
        f"<li><p>Homework, coding, math, recipes, general trivia</p></li>"
        f"<li><p>Personal advice, jokes, translations, sports, politics</p></li>"
        f"<li><p>ANY topic that has NOTHING to do with the real estate project</p></li>"
        f"</ul>"
        f"<p><strong>⚠️ IMPORTANT:</strong> When in doubt between off-topic and a project category, ALWAYS choose the project category. "
        f"Only classify as off-topic if the question is CLEARLY and COMPLETELY unrelated.</p>"
    )
    
    # Append off-topic category to existing instructions
    new_instructions = old_instructions + offtopic_category
    condition_node["data"]["inputs"]["conditionAgentInstructions"] = new_instructions
    
    # 4. Find the highest agentAgentflow index to determine new node ID
    max_agent_idx = -1
    for node in flow_data["nodes"]:
        if node["data"]["name"] == "agentAgentflow":
            node_id = node["id"]
            # Extract index from agentAgentflow_X
            idx = int(node_id.split("_")[-1])
            if idx > max_agent_idx:
                max_agent_idx = idx
    
    new_agent_id = f"agentAgentflow_{max_agent_idx + 1}"
    print(f"🆕 New Off-Topic Guard node ID: {new_agent_id}")
    
    # Detect language from instructions
    is_spanish = "categoría" in old_instructions.lower() or "pregunta" in old_instructions.lower() or "usuario" in old_instructions.lower()
    
    # 5. Create Off-Topic Guard agent node
    if is_spanish:
        system_content = (
            f"<p>Eres el GUARDIA DE ALCANCE del chatbot de <strong>{project_name}</strong>.\n\n"
            f"🎯 TU ÚNICO TRABAJO: Rechazar amablemente preguntas fuera de tema y redirigir al usuario a temas de {project_name}.\n\n"
            f"🌍 REGLA DE IDIOMA: DETECTA el idioma del mensaje del usuario. SIEMPRE responde en el MISMO idioma.\n\n"
            f"📝 REGLAS DE RESPUESTA:\n\n"
            f"1. Si el usuario envía un SALUDO (Hola, Hi, Hello, Buenos días, etc.), responde cálidamente:\n"
            f"'🏠 ¡Hola! Soy el asistente virtual de <strong>{project_name}</strong>. Puedo ayudarte con información sobre el proyecto, ubicación, precios, amenidades y más. ¿En qué puedo ayudarte?'\n\n"
            f"2. Para CUALQUIER pregunta fuera de tema (tareas, código, matemáticas, recetas, conocimiento general, chistes, traducciones, clima, deportes, política, IA, etc.), responde:\n"
            f"'🏠 Soy el asistente virtual de <strong>{project_name}</strong> y solo puedo ayudarte con temas relacionados al proyecto.\n\n"
            f"Puedo ayudarte con:\n"
            f"📍 Ubicación y cómo llegar\n"
            f"💰 Precios y disponibilidad\n"
            f"🏡 Tipos de unidades y amenidades\n"
            f"📞 Información de contacto\n\n"
            f"¿Tienes alguna pregunta sobre {project_name}?'\n\n"
            f"3. ADAPTA el idioma:\n"
            f"- Si el usuario escribe en inglés, responde en inglés\n"
            f"- Si el usuario escribe en francés, responde en francés\n"
            f"- Siempre coincide con el idioma del usuario\n\n"
            f"⛔ ESTRICTAMENTE PROHIBIDO:\n"
            f"- NUNCA respondas preguntas fuera de tema, ni siquiera parcialmente\n"
            f"- NUNCA digas 'No sé pero...' y luego respondas\n"
            f"- NUNCA uses búsqueda web\n"
            f"- NUNCA proporciones conocimiento general, ayuda con tareas, código, matemáticas, recetas, etc.\n"
            f"- Mantén las respuestas CORTAS y siempre redirige a temas de {project_name}</p>"
        )
    else:
        system_content = (
            f"<p>You are the SCOPE GUARD for the <strong>{project_name}</strong> chatbot.\n\n"
            f"🎯 YOUR ONLY JOB: Politely decline off-topic questions and redirect users to {project_name} topics.\n\n"
            f"🌍 LANGUAGE RULE: DETECT the language of the user's message. ALWAYS respond in the SAME language.\n\n"
            f"📝 RESPONSE RULES:\n\n"
            f"1. If the user sends a GREETING (Hola, Hi, Hello, Buenos días, etc.), respond warmly:\n"
            f"'🏠 Hello! I'm the virtual assistant for <strong>{project_name}</strong>. I can help you with project information, location, pricing, amenities and more. How can I help you?'\n\n"
            f"2. For ANY off-topic question (homework, coding, math, recipes, general knowledge, personal advice, jokes, translations, weather, sports, politics, AI, etc.), respond:\n"
            f"'🏠 I'm the virtual assistant for <strong>{project_name}</strong> and I can only help with topics related to the project.\n\n"
            f"I can help you with:\n"
            f"📍 Location and directions\n"
            f"💰 Pricing and availability\n"
            f"🏡 Unit types and amenities\n"
            f"📞 Contact information\n\n"
            f"Do you have any questions about {project_name}?'\n\n"
            f"3. ADAPT the language:\n"
            f"- If user writes in Spanish, respond in Spanish\n"
            f"- If user writes in French, respond in French\n"
            f"- Always match the user's language\n\n"
            f"⛔ STRICTLY FORBIDDEN:\n"
            f"- NEVER answer off-topic questions, not even partially\n"
            f"- NEVER say 'I don't know but...' and then answer anyway\n"
            f"- NEVER use web search\n"
            f"- NEVER provide general knowledge, homework help, code, math, recipes, etc.\n"
            f"- Keep responses SHORT and always redirect to {project_name} topics</p>"
        )
    
    offtopic_node = {
        "id": new_agent_id,
        "type": "agentFlow",
        "position": {
            "x": 168.0,
            "y": 400.0
        },
        "width": 329,
        "height": 72,
        "selected": False,
        "positionAbsolute": {
            "x": 168.0,
            "y": 400.0
        },
        "data": {
            "id": new_agent_id,
            "label": "🚫 Off-Topic Guard (Multilingual)",
            "version": 3.2,
            "name": "agentAgentflow",
            "type": "Agent",
            "color": "#FF6B6B",
            "baseClasses": ["Agent"],
            "category": "Agent Flows",
            "description": "Blocks off-topic questions and redirects users to project topics",
            "inputParams": [
                {
                    "label": "Model",
                    "name": "agentModel",
                    "type": "asyncOptions",
                    "loadMethod": "listModels",
                    "loadConfig": True,
                    "id": f"{new_agent_id}-input-agentModel-asyncOptions",
                    "display": True
                },
                {
                    "label": "Messages",
                    "name": "agentMessages",
                    "type": "array",
                    "optional": True,
                    "acceptVariable": True,
                    "array": [
                        {
                            "label": "Role",
                            "name": "role",
                            "type": "options",
                            "options": [
                                {"label": "System", "name": "system"},
                                {"label": "Assistant", "name": "assistant"},
                                {"label": "Developer", "name": "developer"},
                                {"label": "User", "name": "user"}
                            ]
                        },
                        {
                            "label": "Content",
                            "name": "content",
                            "type": "string",
                            "acceptVariable": True,
                            "generateInstruction": True,
                            "rows": 4
                        }
                    ],
                    "id": f"{new_agent_id}-input-agentMessages-array",
                    "display": True
                },
                {
                    "label": "OpenAI Built-in Tools",
                    "name": "agentToolsBuiltInOpenAI",
                    "type": "multiOptions",
                    "optional": True,
                    "options": [
                        {"label": "Web Search", "name": "web_search_preview", "description": "Search the web for the latest information"},
                        {"label": "Code Interpreter", "name": "code_interpreter", "description": "Write and run Python code in a sandboxed environment"},
                        {"label": "Image Generation", "name": "image_generation", "description": "Generate images based on a text prompt"}
                    ],
                    "show": {"agentModel": "chatOpenAI"},
                    "id": f"{new_agent_id}-input-agentToolsBuiltInOpenAI-multiOptions",
                    "display": True
                },
                {
                    "label": "Gemini Built-in Tools",
                    "name": "agentToolsBuiltInGemini",
                    "type": "multiOptions",
                    "optional": True,
                    "options": [
                        {"label": "URL Context", "name": "urlContext", "description": "Extract content from given URLs"},
                        {"label": "Google Search", "name": "googleSearch", "description": "Search real-time web content"},
                        {"label": "Code Execution", "name": "codeExecution", "description": "Write and run Python code in a sandboxed environment"}
                    ],
                    "show": {"agentModel": "chatGoogleGenerativeAI"},
                    "id": f"{new_agent_id}-input-agentToolsBuiltInGemini-multiOptions",
                    "display": False
                },
                {
                    "label": "Anthropic Built-in Tools",
                    "name": "agentToolsBuiltInAnthropic",
                    "type": "multiOptions",
                    "optional": True,
                    "options": [
                        {"label": "Web Search", "name": "web_search_20250305", "description": "Search the web for the latest information"},
                        {"label": "Web Fetch", "name": "web_fetch_20250910", "description": "Retrieve full content from specified web pages"}
                    ],
                    "show": {"agentModel": "chatAnthropic"},
                    "id": f"{new_agent_id}-input-agentToolsBuiltInAnthropic-multiOptions",
                    "display": False
                },
                {
                    "label": "Tools",
                    "name": "agentTools",
                    "type": "array",
                    "optional": True,
                    "array": [
                        {
                            "label": "Tool",
                            "name": "agentSelectedTool",
                            "type": "asyncOptions",
                            "loadMethod": "listTools",
                            "loadConfig": True
                        },
                        {
                            "label": "Require Human Input",
                            "name": "agentSelectedToolRequiresHumanInput",
                            "type": "boolean",
                            "optional": True
                        }
                    ],
                    "id": f"{new_agent_id}-input-agentTools-array",
                    "display": True
                },
                {
                    "label": "Knowledge (Document Stores)",
                    "name": "agentKnowledgeDocumentStores",
                    "type": "array",
                    "description": "Give your agent context about different document sources. Document stores must be upserted in advance.",
                    "array": [
                        {"label": "Document Store", "name": "documentStore", "type": "asyncOptions", "loadMethod": "listStores"},
                        {"label": "Describe Knowledge", "name": "docStoreDescription", "type": "string", "generateDocStoreDescription": True, "placeholder": "Describe what the knowledge base is about", "rows": 4},
                        {"label": "Return Source Documents", "name": "returnSourceDocuments", "type": "boolean", "optional": True}
                    ],
                    "optional": True,
                    "id": f"{new_agent_id}-input-agentKnowledgeDocumentStores-array",
                    "display": True
                },
                {
                    "label": "Knowledge (Vector Embeddings)",
                    "name": "agentKnowledgeVSEmbeddings",
                    "type": "array",
                    "description": "Give your agent context about different document sources from existing vector stores and embeddings",
                    "array": [
                        {"label": "Vector Store", "name": "vectorStore", "type": "asyncOptions", "loadMethod": "listVectorStores", "loadConfig": True},
                        {"label": "Embedding Model", "name": "embeddingModel", "type": "asyncOptions", "loadMethod": "listEmbeddings", "loadConfig": True},
                        {"label": "Knowledge Name", "name": "knowledgeName", "type": "string", "placeholder": "A short name for the knowledge base"},
                        {"label": "Describe Knowledge", "name": "knowledgeDescription", "type": "string", "placeholder": "Describe what the knowledge base is about", "rows": 4},
                        {"label": "Return Source Documents", "name": "returnSourceDocuments", "type": "boolean", "optional": True}
                    ],
                    "optional": True,
                    "id": f"{new_agent_id}-input-agentKnowledgeVSEmbeddings-array",
                    "display": True
                },
                {
                    "label": "Enable Memory",
                    "name": "agentEnableMemory",
                    "type": "boolean",
                    "description": "Enable memory for the conversation thread",
                    "default": True,
                    "optional": True,
                    "id": f"{new_agent_id}-input-agentEnableMemory-boolean",
                    "display": True
                },
                {
                    "label": "Memory Type",
                    "name": "agentMemoryType",
                    "type": "options",
                    "options": [
                        {"label": "All Messages", "name": "allMessages", "description": "Retrieve all messages from the conversation"},
                        {"label": "Window Size", "name": "windowSize", "description": "Uses a fixed window size to surface the last N messages"},
                        {"label": "Conversation Summary", "name": "conversationSummary", "description": "Summarizes the whole conversation"},
                        {"label": "Conversation Summary Buffer", "name": "conversationSummaryBuffer", "description": "Summarize conversations once token limit is reached. Default to 2000"}
                    ],
                    "optional": True,
                    "default": "allMessages",
                    "show": {"agentEnableMemory": True},
                    "id": f"{new_agent_id}-input-agentMemoryType-options",
                    "display": True
                },
                {
                    "label": "Window Size",
                    "name": "agentMemoryWindowSize",
                    "type": "number",
                    "default": "20",
                    "description": "Uses a fixed window size to surface the last N messages",
                    "show": {"agentMemoryType": "windowSize"},
                    "id": f"{new_agent_id}-input-agentMemoryWindowSize-number",
                    "display": True
                },
                {
                    "label": "Max Token Limit",
                    "name": "agentMemoryMaxTokenLimit",
                    "type": "number",
                    "default": "2000",
                    "description": "Summarize conversations once token limit is reached. Default to 2000",
                    "show": {"agentMemoryType": "conversationSummaryBuffer"},
                    "id": f"{new_agent_id}-input-agentMemoryMaxTokenLimit-number",
                    "display": False
                },
                {
                    "label": "Input Message",
                    "name": "agentUserMessage",
                    "type": "string",
                    "description": "Add an input message as user message at the end of the conversation",
                    "rows": 4,
                    "optional": True,
                    "acceptVariable": True,
                    "show": {"agentEnableMemory": True},
                    "id": f"{new_agent_id}-input-agentUserMessage-string",
                    "display": True
                },
                {
                    "label": "Return Response As",
                    "name": "agentReturnResponseAs",
                    "type": "options",
                    "options": [
                        {"label": "User Message", "name": "userMessage"},
                        {"label": "Assistant Message", "name": "assistantMessage"}
                    ],
                    "default": "userMessage",
                    "id": f"{new_agent_id}-input-agentReturnResponseAs-options",
                    "display": True
                },
                {
                    "label": "JSON Structured Output",
                    "name": "agentStructuredOutput",
                    "description": "Instruct the Agent to give output in a JSON structured schema",
                    "type": "array",
                    "optional": True,
                    "acceptVariable": True,
                    "array": [
                        {"label": "Key", "name": "key", "type": "string"},
                        {
                            "label": "Type", "name": "type", "type": "options",
                            "options": [
                                {"label": "String", "name": "string"},
                                {"label": "String Array", "name": "stringArray"},
                                {"label": "Number", "name": "number"},
                                {"label": "Boolean", "name": "boolean"},
                                {"label": "Enum", "name": "enum"},
                                {"label": "JSON Array", "name": "jsonArray"}
                            ]
                        },
                        {"label": "Enum Values", "name": "enumValues", "type": "string", "placeholder": "value1, value2, value3", "description": "Enum values. Separated by comma", "optional": True, "show": {"agentStructuredOutput[$index].type": "enum"}},
                        {"label": "JSON Schema", "name": "jsonSchema", "type": "code", "placeholder": "{}", "description": "JSON schema for the structured output", "optional": True, "hideCodeExecute": True, "show": {"agentStructuredOutput[$index].type": "jsonArray"}},
                        {"label": "Description", "name": "description", "type": "string", "placeholder": "Description of the key"}
                    ],
                    "id": f"{new_agent_id}-input-agentStructuredOutput-array",
                    "display": True
                },
                {
                    "label": "Update Flow State",
                    "name": "agentUpdateState",
                    "description": "Update runtime state during the execution of the workflow",
                    "type": "array",
                    "optional": True,
                    "acceptVariable": True,
                    "array": [
                        {"label": "Key", "name": "key", "type": "asyncOptions", "loadMethod": "listRuntimeStateKeys"},
                        {"label": "Value", "name": "value", "type": "string", "acceptVariable": True, "acceptNodeOutputAsVariable": True}
                    ],
                    "id": f"{new_agent_id}-input-agentUpdateState-array",
                    "display": True
                }
            ],
            "inputAnchors": [],
            "inputs": {
                "agentModel": "chatOpenAI",
                "agentMessages": [
                    {
                        "role": "system",
                        "content": system_content
                    }
                ],
                "agentToolsBuiltInOpenAI": "",
                "agentTools": [],
                "agentKnowledgeDocumentStores": [],
                "agentKnowledgeVSEmbeddings": [],
                "agentEnableMemory": True,
                "agentMemoryType": "windowSize",
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
                    "id": f"{new_agent_id}-output-agentAgentflow",
                    "label": "Agent",
                    "name": "agentAgentflow"
                }
            ],
            "outputs": {},
            "selected": False
        },
        "dragging": False
    }
    
    # 6. Add the node
    flow_data["nodes"].append(offtopic_node)
    
    # 7. Add edge from condition agent output → Off-Topic Guard
    new_edge = {
        "source": "conditionAgentAgentflow_0",
        "sourceHandle": f"conditionAgentAgentflow_0-output-{new_idx}",
        "target": new_agent_id,
        "targetHandle": new_agent_id,
        "data": {
            "sourceColor": "#ff8fab",
            "targetColor": "#FF6B6B",
            "edgeLabel": str(new_idx),
            "isHumanInput": False
        },
        "type": "agentFlow",
        "id": f"conditionAgentAgentflow_0-conditionAgentAgentflow_0-output-{new_idx}-{new_agent_id}-{new_agent_id}"
    }
    flow_data["edges"].append(new_edge)
    
    print(f"✅ Added Off-Topic Guard: scenario {new_idx}, node {new_agent_id}")
    return True


def push_to_flowise(flow_data, chatflow_id):
    """Push flow data to Flowise API."""
    flow_data_str = json.dumps(flow_data, ensure_ascii=False)
    
    payload = {"flowData": flow_data_str}
    
    print(f"\n📤 Pushing to Flowise chatflow {chatflow_id}...")
    resp = requests.put(
        f"{FLOWISE_URL}/api/v1/chatflows/{chatflow_id}",
        headers=HEADERS,
        json=payload,
        timeout=30
    )
    
    if resp.status_code == 200:
        print("✅ Successfully updated in Flowise!")
        # Verify
        verify = requests.get(
            f"{FLOWISE_URL}/api/v1/chatflows/{chatflow_id}",
            headers=HEADERS,
            timeout=15
        )
        if verify.status_code == 200:
            vdata = verify.json()
            fd = json.loads(vdata["flowData"])
            # Check for Off-Topic Guard node
            for node in fd["nodes"]:
                if "Off-Topic" in node["data"].get("label", ""):
                    print(f"✅ Verified: Off-Topic Guard node '{node['data']['label']}' is live!")
                    return True
            print("⚠️ Off-Topic Guard node not found in verification")
        return True
    else:
        print(f"❌ Failed: {resp.status_code} - {resp.text[:500]}")
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("🛡️ Adding Off-Topic Guard to LST La Santísima Trinidad")
    print("=" * 60)
    
    # Load local JSON
    flow_data = load_local_json(LOCAL_FILE)
    print(f"📂 Loaded {LOCAL_FILE}")
    print(f"   Nodes: {len(flow_data['nodes'])}, Edges: {len(flow_data['edges'])}")
    
    # Add Off-Topic Guard
    success = add_offtopic_guard(flow_data, "La Santísima Trinidad")
    
    if success:
        # Save locally
        save_local_json(LOCAL_FILE, flow_data)
        print(f"💾 Saved locally: {LOCAL_FILE}")
        
        # Push to Flowise
        push_to_flowise(flow_data, LST_CHATFLOW_ID)
    else:
        print("No changes made.")
