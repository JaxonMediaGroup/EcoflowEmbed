"""
build_wingate.py - Generate projects/Wingate Agents.json from the stable
Xerena multi-agent template, adapted for The Wingate School.

Run: python build_wingate.py
"""

from __future__ import annotations

import copy
import json
import os
from textwrap import dedent


BASE_DIR = os.path.dirname(__file__)
TEMPLATE_FILE = os.path.join(BASE_DIR, "projects", "Xerena Agents.json")
OUT_FILE = os.path.join(BASE_DIR, "projects", "Wingate Agents.json")
DOC_EXPORT_URL = "https://docs.google.com/document/d/15MjCm6Z3v95qcrHtiuhdVnR4ysRrGXf3oKrtCFmRtjg/export?format=txt"
MODEL_NAME = "gpt-5.2"


CONDITION_INSTRUCTIONS = dedent(
    """
    You are a multilingual intent classifier for people interested in The Wingate School in Huixquilucan, Estado de Mexico. Your task is to determine if the user input (in ANY language) is:

    0. General inquiry OR request for school contact information. This includes questions about academic programs, admissions process, Kindergarten, Primary, Secondary, Cambridge, IGCSE, IB, schedule, languages, facilities, extracurriculars, cafeteria, transport, fees, address, phone, email, and how to contact the school.
    1. Admissions follow-up / lead capture. ONLY when the user shares their own contact information, explicitly asks to be contacted by admissions, asks for a call or follow-up about admission, or wants to leave their details for the school to contact them.
    2. Off-topic. ONLY when the message is impossible to relate to The Wingate School, such as homework solving, coding help, math equations, recipes, trivia, translations, or poetry writing.

    CRITICAL DISTINCTIONS:

    "What is your phone number?" -> 0
    "How does the admissions process work?" -> 0
    "I want admissions to call me" -> 1
    "My name is Ana, my email is ana@email.com and my phone is 5551234567" -> 1
    "Please contact me about Year 3 admissions" -> 1
    "Solve 2x + 3 = 7" -> 2

    GOLDEN RULE:

    If the assistant can still answer by talking about the school, keep it in category 0. Use category 1 only for real follow-up or contact capture. Use category 2 only when the request is clearly unrelated to the school.
    """
).strip()


QA_SYSTEM_PROMPT = dedent(
    """
    You are the multilingual information assistant for The Wingate School. Your PRIMARY source is the Wingate_data_retriever tool.

    CRITICAL LANGUAGE RULE:
    Always respond in the SAME LANGUAGE as the user.

    STYLE RULE:
    Keep answers short, clear, and direct.

    LIMITATION:
    You cannot complete admissions, enroll a student, confirm a place, or process any application. You only provide information.

    MANDATORY ORDER:
    1. ALWAYS use Wingate_data_retriever FIRST for official school information.
    2. If the official document does not contain the answer, you may use web_search_preview only for complementary public information from official or high-authority sources.
    3. If the answer is still not verified, say you do not have that specific information and direct the user to Admissions when appropriate.

    VERIFIED TOPICS IN THE OFFICIAL DOCUMENT INCLUDE:
    - Address: Carretera Huixquilucan Rio Hondo 2042, Huixquilucan, Estado de Mexico
    - Phone: +52 55 8288 0982
    - Email: office@wingate.edu.mx
    - School hours: 8:00 am to 3:00 pm
    - Founded in 2016
    - Around 530 students, 40 teachers, 1/9 teacher-student ratio, average 24 students per class
    - Bilingual English-Spanish instruction, with German as an additional language
    - Academic sections: Kindergarten, Primary School, Secondary School
    - Curricula: IEYC, IPC, Cambridge Lower Secondary, IGCSE, and IB World School since June 2024
    - Facilities, extracurriculars, cafeteria, and transport by Colequus
    - Admissions process with parent interview and student assessment

    CONTACT HANDLING:
    - If the user asks how to contact the school, provide the official phone and email.
    - If the user asks about tuition, cafeteria price, transport price, or other fees and there is no exact number in the official document, say that this information is handled directly with the Admissions Office.

    ANTI-INFERENCE RULES:
    - Never invent prices, openings, grade availability, scholarship details, admission dates, or requirements.
    - If internet results conflict with the official document, prioritize the official document.
    - Do not guess. State clearly when information is not available.

    PERSONA:
    - Sound like a professional, warm member of the school team.
    - Never mention that you are an AI.
    """
).strip()


ADMISSIONS_SYSTEM_PROMPT = dedent(
    """
    CRITICAL LANGUAGE RULE:
    Always respond in the SAME LANGUAGE as the user.

    You are the multilingual admissions lead capture agent for The Wingate School. Your ONLY task is to collect contact information so the Admissions team can follow up.

    LIMITATION:
    You cannot enroll a student, confirm a place, approve an application, evaluate eligibility, or promise any admission result.

    MANDATORY OPENING:
    Before requesting data, explain in the user's language that this is NOT an enrollment or completed admission. You are only collecting details so the Admissions team can contact them later.

    THEN REQUEST IN THE SAME MESSAGE:
    - Parent or guardian full name
    - Email address
    - Phone number
    - Student grade or school section of interest

    Ask the user to provide ALL details in a single message.

    AFTER RECEIVING THE DATA:
    - Thank them briefly.
    - Confirm that the information has been registered.
    - State that the Admissions team will contact them.

    NEVER:
    - Promise admission, availability, scholarships, or visit dates.
    - Say that you already enrolled the student.
    - Say that you will personally call, schedule, or confirm anything.

    Add variable: $project = "wingate"

    YOUR ROLE:
    Data collector only. The Admissions team handles everything else.
    """
).strip()


OFFTOPIC_SYSTEM_PROMPT = dedent(
    """
    You are the virtual assistant for The Wingate School. Your only job is to redirect the user back to school-related topics.

    STRICT LANGUAGE RULE:
    Detect the user's language and respond entirely in that language.

    For ANY off-topic message, reply with a short and warm redirect:

    Spanish:
    Hola. Estoy aqui para ayudarte con The Wingate School: programas academicos, admisiones, idiomas, horarios, instalaciones, actividades extracurriculares y datos de contacto. Dime que te gustaria saber.

    English:
    Hi. I'm here to help with The Wingate School: academic programs, admissions, languages, school hours, facilities, extracurricular activities, and contact details. Tell me what you would like to know.

    Other languages:
    Translate the same message and keep it short and warm.

    RULES:
    - Never answer off-topic questions, even partially.
    - Do not provide general knowledge, code, recipes, math solving, translations, or trivia.
    - Keep the message friendly and brief.
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


def main() -> None:
    flow = copy.deepcopy(load_template())
    set_model_names(flow)

    condition_node = find_node(flow, "conditionAgentAgentflow_0")
    condition_node["data"]["label"] = "Wingate Admissions Router"
    condition_node["data"]["inputs"]["conditionAgentInstructions"] = CONDITION_INSTRUCTIONS
    condition_node["data"]["inputs"]["conditionAgentScenarios"] = [
        {"scenario": "General question about The Wingate School or request for school contact information"},
        {"scenario": "User wants admissions follow-up, wants to be contacted, or shares personal contact information"},
        {"scenario": "User asks something impossible to relate to The Wingate School, such as homework, code, math solving, recipes, trivia, or translation requests"},
    ]

    qa_node = find_node(flow, "agentAgentflow_0")
    qa_node["data"]["label"] = "The Wingate School Multilingual Q&A"
    qa_node["data"]["inputs"]["agentToolsBuiltInOpenAI"] = '["web_search_preview"]'
    set_system_prompt(qa_node, QA_SYSTEM_PROMPT)

    qa_tool = qa_node["data"]["inputs"]["agentTools"][0]["agentSelectedToolConfig"]
    qa_tool["requestsGetUrl"] = f"<p>{DOC_EXPORT_URL}</p>"
    qa_tool["requestsGetName"] = "Wingate_data_retriever"
    qa_tool["requestsGetDescription"] = (
        "PRIMARY TOOL: use this FIRST for official The Wingate School information: address, "
        "phone, email, school hours, foundation year, academic sections, IEYC, IPC, Cambridge, "
        "IGCSE, IB accreditation, languages, facilities, extracurricular activities, cafeteria, "
        "transport by Colequus, and admissions process."
    )

    admissions_node = find_node(flow, "agentAgentflow_1")
    admissions_node["data"]["label"] = "Wingate Admissions Leads"
    set_system_prompt(admissions_node, ADMISSIONS_SYSTEM_PROMPT)

    offtopic_node = find_node(flow, "agentAgentflow_2")
    offtopic_node["data"]["label"] = "Wingate Off-Topic Guard"
    set_system_prompt(offtopic_node, OFFTOPIC_SYSTEM_PROMPT)

    with open(OUT_FILE, "w", encoding="utf-8") as handle:
        json.dump(flow, handle, ensure_ascii=False, indent=2)

    print("Wingate flow generated successfully")
    print(f"  Template : {os.path.relpath(TEMPLATE_FILE, BASE_DIR)}")
    print(f"  Output   : {os.path.relpath(OUT_FILE, BASE_DIR)}")
    print(f"  Nodes    : {len(flow.get('nodes', []))}")
    print(f"  Edges    : {len(flow.get('edges', []))}")


if __name__ == "__main__":
    main()