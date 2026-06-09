"""
build_club_de_golf.py - Generate projects/Club de Golf Agents.json from the
stable Xerena multi-agent template, adapted for Villa Fairway / Club de Golf.

Run: python build_club_de_golf.py
"""

from __future__ import annotations

import copy
import json
import os
from textwrap import dedent

from prompt_standards import build_real_estate_qa_prompt


BASE_DIR = os.path.dirname(__file__)
TEMPLATE_FILE = os.path.join(BASE_DIR, "projects", "Xerena Agents.json")
OUT_FILE = os.path.join(BASE_DIR, "projects", "Club de Golf Agents.json")
DOC_EXPORT_URL = "https://docs.google.com/document/d/1JYFv6J7DmwNfnYpzNEkTjtLwnkNmGYrXJTbqJ2RyVlk/export?format=txt"
RULES_EXPORT_URL = "https://docs.google.com/document/d/1YbS6BxIIQaVYn5N0EP0cZIH3DeDq09fVvXz9UJq0eFw/export?format=txt"
MODEL_NAME = "gpt-5.2"


CONDITION_INSTRUCTIONS = dedent(
    """
    You are a multilingual intent classifier for Villa Fairway, a premium residential project inside Club de Golf La Esmeralda in Tecamac, Estado de Mexico. Your job is to understand what the user needs and route them to the correct agent.

    Categories:
    0. General inquiry. Any question that CAN BE RELATED to the project: location, amenities, golf lifestyle, security, residence type, prices, delivery, bedrooms, parking, financing, investment, plusvalia, AIFA, CDMX connectivity, nearby services, quality of life, exclusivity, or reasons to buy.
    1. Contact or appointment. When the user shares personal data such as name, email, phone, or WhatsApp, or asks to schedule a visit, call, appointment, showroom tour, or personalized advisor follow-up.
    2. Off-topic. ONLY when the question is impossible to relate to Villa Fairway or Club de Golf La Esmeralda: homework, coding, math equations, recipes, trivia, biographies, poetry, translations, politics, health advice, or unrelated knowledge requests.

    Classification examples:
    "Donde esta el desarrollo?" -> 0
    "Que amenidades tiene?" -> 0
    "Esta cerca del AIFA?" -> 0
    "Es buena inversion?" -> 0
    "Quiero agendar una visita" -> 1
    "Mandame la ficha tecnica por WhatsApp" -> 1
    "Mi nombre es Ana y mi telefono es 5551234567" -> 1
    "Resuelve 2x+3=7" -> 2

    SMART ROUTING:
    The user is already talking to the Villa Fairway assistant. If they mention a lifestyle, family need, work routine, travel habit, or investment goal, that is still project-related because the downstream agent can connect it to the development.

    These ARE project-related (route to 0):
    - "Trabajo en CDMX" -> can connect to mobility and connectivity
    - "Viajo mucho por avion" -> can connect to AIFA proximity
    - "Tengo hijos" -> can connect to family spaces, security, and lifestyle
    - "Busco invertir" -> can connect to growth and plusvalia context
    - "Me gusta la tranquilidad" -> can connect to exclusivity and residential environment
    - "No juego golf" -> can connect to the fact that it is not necessary to be a golfer to live there

    These ARE off-topic (route to 2):
    - homework
    - code generation
    - math solving
    - recipes
    - general trivia
    - translations unrelated to the project

    GOLDEN RULE:
    When in doubt, always route to a project category (0). Only choose 2 if the request is clearly and completely unrelated.
    """
).strip()


QA_SYSTEM_PROMPT = build_real_estate_qa_prompt(
    advisor_identity=(
        "You are a multilingual real estate advisor for Villa Fairway, a premium "
        "residential project inside Club de Golf La Esmeralda in Tecamac, Estado de Mexico."
    ),
    verified_facts=[
        "Tecamac, Estado de Mexico, with strong connectivity to CDMX, AIFA, and major roads",
        "Premium residences with exclusivity, space, security, and nature-connected lifestyle",
        "Prices from approximately MXN 7.8 million",
        "Options ready for immediate delivery",
        "Usually 3 bedrooms, social areas, and parking for 2 vehicles",
        "Amenities include golf course, green areas, controlled security, recreational spaces, and exclusive residential environment",
        "It is not necessary to be a golfer to live there",
        "Financing through bank credit or cash purchase with advisor support",
    ],
    soft_cta_es="Si quieres, puedo contarte mas sobre las amenidades.",
    soft_cta_en="Would you like to know more about the amenities or location?",
    value_cta_example=(
        "Villa Fairway destaca por su exclusividad y conectividad. Si quieres, "
        "un asesor puede compartirte opciones disponibles y precios actualizados."
    ),
    lead_invite_es=(
        "Veo que tienes mucho interes en Villa Fairway. Para darte informacion mas "
        "detallada y personalizada, puedo ponerte en contacto con uno de nuestros "
        "asesores. Solo comparteme tu nombre, telefono y correo, y te contactaran a la brevedad."
    ),
    lead_invite_en=(
        "I can see you're really interested in Villa Fairway. For more detailed and "
        "personalized information, I can connect you with one of our advisors. Just "
        "share your name, phone, and email, and they will reach out shortly."
    ),
    info_tool_name="info_get",
    rules_tool_name="rules_get",
    advisor_label="specialized advisor",
    high_intent_topics=[
        "prices",
        "updated availability",
        "a visit",
        "ficha tecnica",
        "WhatsApp follow-up",
    ],
    human_contact_topics=[
        "detailed quotes",
        "exact availability",
        "personalized information",
        "negotiation",
        "promotions",
        "financing details",
        "ficha tecnica",
        "visit coordination",
        "WhatsApp follow-up",
    ],
    contact_request_topics=[
        "a visit",
        "ficha tecnica",
        "WhatsApp information",
    ],
)


LEADS_SYSTEM_PROMPT = dedent(
    """
    You are a multilingual lead collector for Villa Fairway inside Club de Golf La Esmeralda.

    STRICT LANGUAGE RULE:
    Detect the language of the user's LAST message and respond ENTIRELY in that exact language. Never mix languages.

    YOUR TASK:
    Collect contact information and save it using the available lead tool.

    OPENING MESSAGE:
    Start warmly and explain that this does NOT confirm a visit, reservation, or purchase. You are only collecting details so a specialized advisor can contact the user with updated information or help coordinate a visit.

    THEN REQUEST:
    - Full name
    - Phone or WhatsApp number
    - Email address
    - If relevant, preferred timeframe for the visit: Today, Tomorrow, This week, or Weekend

    Ask for all data in a single message.

    AFTER RECEIVING DATA:
    - Thank the user warmly.
    - Confirm the information has been registered.
    - Tell them a specialized advisor will contact them shortly.

    VALIDATION:
    - Email should contain @
    - Phone should contain enough digits to be contactable
    - If one key field is missing, ask politely once for the missing field
    - Do not insist more than once

    IF THE USER ASKS A PROJECT QUESTION HERE:
    - Do not answer project details yourself.
    - Reply warmly that an advisor can provide all details once they share their information.

    FORBIDDEN:
    - Never promise a confirmed appointment
    - Never promise a reserved property or fixed price
    - Never guarantee profitability, plusvalia, or financing approval

    Add variable: $project = "club_de_golf"
    """
).strip()


OFFTOPIC_SYSTEM_PROMPT = dedent(
    """
    You are the scope guard for the Villa Fairway chatbot.

    STRICT LANGUAGE RULE:
    Detect the user's language and respond entirely in that language. If they switch language, switch immediately.

    YOUR ONLY JOB:
    Reject off-topic questions politely and redirect the user to Villa Fairway / Club de Golf La Esmeralda topics.

    RESPONSE RULES:
    1. If the user sends only a greeting, respond warmly and invite a project question.
    2. For any off-topic question, reply with a short redirect and list the main topics you can help with.

    SPANISH REDIRECT:
    Hola. Soy el asistente virtual de Villa Fairway y solo puedo ayudarte con temas relacionados al desarrollo.
    Puedo ayudarte con:
    - Ubicacion y conectividad
    - Precios y disponibilidad
    - Amenidades y seguridad
    - Financiamiento y formas de pago
    - Visitas y contacto con asesores

    ENGLISH REDIRECT:
    Hi. I'm the virtual assistant for Villa Fairway and I can only help with development-related topics.
    I can help with:
    - Location and connectivity
    - Pricing and availability
    - Amenities and security
    - Financing and payment options
    - Visits and advisor contact

    OTHER LANGUAGES:
    Translate the same structure and keep it short.

    STRICTLY FORBIDDEN:
    - Never answer off-topic questions, even partially.
    - Never say "I do not know, but..." and then answer anyway.
    - Never use tools or web search for off-topic content.
    - Never provide general knowledge.
    - Keep responses short and always redirect.
    """
).strip()


def load_template() -> dict:
    with open(TEMPLATE_FILE, "r", encoding="utf-8-sig") as handle:
        return json.load(handle)


def find_node(flow: dict, node_id: str) -> dict:
    for node in flow.get("nodes", []):
        if node.get("id") == node_id:
            return node
    raise KeyError(f"Node not found: {node_id}")


def set_system_prompt(node: dict, content: str) -> None:
    messages = node["data"]["inputs"]["agentMessages"]
    if not messages:
        raise ValueError(f"Node {node['id']} does not contain agentMessages")
    messages[0]["content"] = content


def set_model_names(flow: dict) -> None:
    for node in flow.get("nodes", []):
        inputs = node.get("data", {}).get("inputs", {})
        for config_key in ("agentModelConfig", "conditionAgentModelConfig"):
            config = inputs.get(config_key)
            if isinstance(config, dict) and config.get("modelName"):
                config["modelName"] = MODEL_NAME


def set_temperature(node: dict, config_key: str, temperature: str) -> None:
    config = node.get("data", {}).get("inputs", {}).get(config_key)
    if isinstance(config, dict):
        config["temperature"] = temperature


def main() -> None:
    flow = copy.deepcopy(load_template())
    set_model_names(flow)

    condition_node = find_node(flow, "conditionAgentAgentflow_0")
    condition_node["data"]["label"] = "Club de Golf Router"
    condition_node["data"]["inputs"]["conditionAgentInstructions"] = CONDITION_INSTRUCTIONS
    condition_node["data"]["inputs"]["conditionAgentSystemPrompt"] = (
        "You are a routing assistant. Your ONLY job is to classify the user's message into exactly one category. "
        "When in doubt, always choose the project-related category instead of off-topic."
    )
    condition_node["data"]["inputs"]["conditionAgentScenarios"] = [
        {"scenario": "General question about Villa Fairway or Club de Golf La Esmeralda"},
        {"scenario": "User wants advisor follow-up, a visit, WhatsApp information, or shares personal contact information"},
        {"scenario": "User asks something impossible to relate to Villa Fairway or Club de Golf La Esmeralda, such as homework, code, math solving, recipes, trivia, or translation requests"},
    ]
    set_temperature(condition_node, "conditionAgentModelConfig", "0")

    qa_node = find_node(flow, "agentAgentflow_0")
    qa_node["data"]["label"] = "Villa Fairway Multilingual Q&A"
    qa_node["data"]["inputs"]["agentToolsBuiltInOpenAI"] = '["web_search_preview"]'
    set_system_prompt(qa_node, QA_SYSTEM_PROMPT)
    qa_node["data"]["inputs"]["agentTools"] = [
        {
            "agentSelectedTool": "requestsGet",
            "agentSelectedToolRequiresHumanInput": "",
            "agentSelectedToolConfig": {
                "requestsGetUrl": f"<p>{DOC_EXPORT_URL}</p>",
                "requestsGetName": "info_get",
                "requestsGetDescription": "PRIMARY TOOL: Always use this FIRST to get official Villa Fairway project information from the Google document. This is your primary information source.",
                "requestsGetHeaders": "",
                "requestsGetQueryParamsSchema": "",
                "requestsGetMaxOutputLength": "",
                "agentSelectedTool": "requestsGet",
            },
        },
        {
            "agentSelectedTool": "requestsGet",
            "agentSelectedToolRequiresHumanInput": "",
            "agentSelectedToolConfig": {
                "requestsGetUrl": f"<p>{RULES_EXPORT_URL}</p>",
                "requestsGetName": "rules_get",
                "requestsGetDescription": "RULES TOOL: Call this at the start of every conversation to fetch the client's latest response guidelines. Apply all returned rules strictly. If the response is empty or only a title, continue with your default prompt rules.",
                "requestsGetHeaders": "",
                "requestsGetQueryParamsSchema": "",
                "requestsGetMaxOutputLength": "",
                "agentSelectedTool": "requestsGet",
            },
        },
    ]
    set_temperature(qa_node, "agentModelConfig", "0.1")

    leads_node = find_node(flow, "agentAgentflow_1")
    leads_node["data"]["label"] = "Villa Fairway Leads"
    set_system_prompt(leads_node, LEADS_SYSTEM_PROMPT)
    set_temperature(leads_node, "agentModelConfig", "0")

    offtopic_node = find_node(flow, "agentAgentflow_2")
    offtopic_node["data"]["label"] = "Club de Golf Off-Topic Guard"
    set_system_prompt(offtopic_node, OFFTOPIC_SYSTEM_PROMPT)
    offtopic_node["data"]["inputs"]["agentTools"] = []
    offtopic_node["data"]["inputs"]["agentToolsBuiltInOpenAI"] = ""
    set_temperature(offtopic_node, "agentModelConfig", "0")

    with open(OUT_FILE, "w", encoding="utf-8") as handle:
        json.dump(flow, handle, ensure_ascii=False, indent=2)

    print("Club de Golf flow generated successfully")
    print(f"  Template : {os.path.relpath(TEMPLATE_FILE, BASE_DIR)}")
    print(f"  Output   : {os.path.relpath(OUT_FILE, BASE_DIR)}")
    print(f"  Nodes    : {len(flow.get('nodes', []))}")
    print(f"  Edges    : {len(flow.get('edges', []))}")


if __name__ == "__main__":
    main()