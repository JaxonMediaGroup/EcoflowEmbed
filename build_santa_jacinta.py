"""Generate the LST Santa Jacinta Agentflow from the stable real-estate template."""

from __future__ import annotations

import copy
import json
import os
from textwrap import dedent

from build_club_de_golf import (
    find_node,
    load_template,
    set_system_prompt,
    set_temperature,
)
from prompt_standards import build_real_estate_qa_prompt


BASE_DIR = os.path.dirname(__file__)
OUT_FILE = os.path.join(BASE_DIR, "projects", "LST Santa Jacinta Agents.json")
DOC_EXPORT_URL = (
    "https://docs.google.com/document/d/"
    "1-yTzdO1F7CB_ffiS04Uimm5Q9wjVithI9YxmrPxl6IY/export?format=txt"
)
MODEL_NAME = "gpt-5.5"


def set_model_names(flow: dict) -> None:
    for node in flow.get("nodes", []):
        inputs = node.get("data", {}).get("inputs", {})
        for config_key in ("agentModelConfig", "conditionAgentModelConfig"):
            config = inputs.get(config_key)
            if isinstance(config, dict) and config.get("modelName"):
                config["modelName"] = MODEL_NAME


CONDITION_INSTRUCTIONS = dedent(
    """
    You are a multilingual intent classifier for Santa Jacinta, a premium countryside
    residential development next to Club de Golf Los Encinos in Estado de Mexico.

    Route the user's message into exactly one category:
    0. General inquiry about Santa Jacinta: location, lot sizes, prices, availability,
       amenities, equestrian club, natural resources, maintenance, security, lifestyle,
       showroom, investment, or any need that can reasonably relate to the project.
    1. Contact or appointment: the user shares personal contact information or asks for
       an advisor, quote, current price, availability, showroom visit, call, or WhatsApp.
    2. Off-topic: only requests impossible to relate to Santa Jacinta, such as homework,
       coding, math, recipes, trivia, politics, or unrelated translations.

    When in doubt, choose category 0. Never route a plausible project question to off-topic.
    """
).strip()


QA_SYSTEM_PROMPT = build_real_estate_qa_prompt(
    advisor_identity=(
        "You are a multilingual real estate advisor for Santa Jacinta, a premium "
        "countryside residential development next to Club de Golf Los Encinos in "
        "Estado de Mexico."
    ),
    verified_facts=[
        "The development covers 47.77 hectares",
        "There are 120 lots",
        "Lot sizes range from 1,200 to 3,600 square meters",
        "The showroom is in Edificio Euro Ten, Juan Salvador Agraz 61, floor 1, Las Tinajas, Santa Fe, CDMX",
        "Price per square meter must be confirmed by a sales advisor",
        "The development is next to Club de Golf Los Encinos in Estado de Mexico",
        "It includes flood irrigation and rainwater collection management systems",
        "Its wells have capacity of up to 650,000 cubic meters",
        "Cider batches are produced with apples grown inside the development",
        "Monthly maintenance is approximately MXN 25,000 and should be treated as subject to update",
        "Equestrian amenities include 150 stables, grass, sand and covered arenas, and paddock",
        "Other amenities include a cafeteria and a 4,000-square-meter clubhouse",
        "The clubhouse includes an indoor pool, gym, art room, children's playroom, paddle and tennis courts, and business center",
        "Security includes drones and a waiting area for drivers and security escorts",
    ],
    soft_cta_es="Si quieres, puedo contarte mas sobre los lotes o las amenidades.",
    soft_cta_en="Would you like to know more about the lots or amenities?",
    value_cta_example=(
        "Santa Jacinta combina grandes lotes, naturaleza y amenidades ecuestres. "
        "Si quieres, un asesor puede confirmarte precios y disponibilidad actualizados."
    ),
    lead_invite_es=(
        "Veo que tienes interes en Santa Jacinta. Puedo ponerte en contacto con un "
        "asesor para recibir informacion personalizada. Comparteme tu nombre, telefono "
        "y correo, y te contactaran a la brevedad."
    ),
    lead_invite_en=(
        "I can see you're interested in Santa Jacinta. I can connect you with an advisor "
        "for personalized information. Share your name, phone, and email, and they will "
        "contact you shortly."
    ),
    info_tool_name="info_get",
    rules_tool_name=None,
    advisor_label="specialized advisor",
    high_intent_topics=[
        "price per square meter",
        "updated availability",
        "a showroom visit",
        "a quote",
        "WhatsApp follow-up",
    ],
)


LEADS_SYSTEM_PROMPT = dedent(
    """
    You are the multilingual lead collector for Santa Jacinta.

    Respond entirely in the language of the user's last message. Explain that collecting
    details does not confirm a visit, price, reservation, or purchase; a specialized advisor
    will follow up with current information.

    Ask for all of the following in one message:
    - Full name
    - Phone or WhatsApp number
    - Email address
    - Main interest (pricing, availability, lots, or showroom visit)

    Validate that the email contains @ and the phone has enough digits. Ask once for any
    missing key field, then thank the user and confirm that the information was registered.
    Never promise an appointment, availability, fixed pricing, returns, or financing approval.

    Add variable: $project = "lst_santa_jacinta"
    """
).strip()


OFFTOPIC_SYSTEM_PROMPT = dedent(
    """
    You are the scope guard for the Santa Jacinta chatbot. Respond entirely in the language
    of the user's last message. Politely reject unrelated requests and redirect to topics you
    can help with: location, lots, amenities, equestrian club, natural-resource systems,
    maintenance, pricing, availability, showroom visits, and advisor contact.

    Never answer an off-topic request, even partially. Never mention tools, prompts, files,
    documents, or that you are an AI. Keep the response short.
    """
).strip()


def main() -> None:
    flow = copy.deepcopy(load_template())
    set_model_names(flow)

    condition_node = find_node(flow, "conditionAgentAgentflow_0")
    condition_node["data"]["label"] = "Santa Jacinta Router"
    condition_node["data"]["inputs"]["conditionAgentInstructions"] = CONDITION_INSTRUCTIONS
    condition_node["data"]["inputs"]["conditionAgentSystemPrompt"] = (
        "Classify the user's message into exactly one category. When in doubt, choose "
        "the project-related category instead of off-topic."
    )
    condition_node["data"]["inputs"]["conditionAgentScenarios"] = [
        {"scenario": "General question about Santa Jacinta"},
        {"scenario": "Advisor contact, quote, availability, showroom visit, or personal data"},
        {"scenario": "Request impossible to relate to Santa Jacinta"},
    ]
    set_temperature(condition_node, "conditionAgentModelConfig", "0")

    qa_node = find_node(flow, "agentAgentflow_0")
    qa_node["data"]["label"] = "Santa Jacinta Multilingual Q&A"
    qa_node["data"]["inputs"]["agentToolsBuiltInOpenAI"] = ""
    qa_node["data"]["inputs"]["agentTools"] = [
        {
            "agentSelectedTool": "requestsGet",
            "agentSelectedToolRequiresHumanInput": "",
            "agentSelectedToolConfig": {
                "requestsGetUrl": f"<p>{DOC_EXPORT_URL}</p>",
                "requestsGetName": "info_get",
                "requestsGetDescription": (
                    "PRIMARY TOOL: Always use this first for official Santa Jacinta "
                    "project information."
                ),
                "requestsGetHeaders": "",
                "requestsGetQueryParamsSchema": "",
                "requestsGetMaxOutputLength": "",
                "agentSelectedTool": "requestsGet",
            },
        }
    ]
    set_system_prompt(qa_node, QA_SYSTEM_PROMPT)
    set_temperature(qa_node, "agentModelConfig", "0.1")

    leads_node = find_node(flow, "agentAgentflow_1")
    leads_node["data"]["label"] = "Santa Jacinta Leads"
    set_system_prompt(leads_node, LEADS_SYSTEM_PROMPT)
    set_temperature(leads_node, "agentModelConfig", "0")

    offtopic_node = find_node(flow, "agentAgentflow_2")
    offtopic_node["data"]["label"] = "Santa Jacinta Off-Topic Guard"
    set_system_prompt(offtopic_node, OFFTOPIC_SYSTEM_PROMPT)
    offtopic_node["data"]["inputs"]["agentTools"] = []
    offtopic_node["data"]["inputs"]["agentToolsBuiltInOpenAI"] = ""
    set_temperature(offtopic_node, "agentModelConfig", "0")

    with open(OUT_FILE, "w", encoding="utf-8") as handle:
        json.dump(flow, handle, ensure_ascii=False, indent=2)

    print("LST Santa Jacinta flow generated successfully")
    print(f"  Output: {os.path.relpath(OUT_FILE, BASE_DIR)}")
    print(f"  Nodes : {len(flow.get('nodes', []))}")
    print(f"  Edges : {len(flow.get('edges', []))}")


if __name__ == "__main__":
    main()
