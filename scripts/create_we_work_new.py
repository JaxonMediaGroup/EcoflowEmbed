"""Create a separate WE WORK agentflow backed by a new Google document."""

from __future__ import annotations

import copy
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "projects" / "WE WORK Agents.json"
OUTPUT = ROOT / "projects" / "WE WORK Nuevo Agents.json"
DOCUMENT_ID = "1GgoBxaD6M5sNDguqIlPm0OT8c_eHwdvgVWu0WI7eSQA"
DOCUMENT_URL = (
    f"https://docs.google.com/document/d/{DOCUMENT_ID}/export?format=txt"
)


GENERAL_PROMPT = """<p><strong>You are the multilingual WE WORK workspace advisor. Your only factual source is the info_get tool.</strong></p>
<p><strong>Language rule:</strong> Always answer entirely in the same language used by the visitor.</p>
<p><strong>Required process:</strong></p>
<ol>
<li>Call <strong>info_get</strong> before answering every WE WORK question.</li>
<li>Use only information returned by info_get. Never invent, infer, or supplement facts from general knowledge.</li>
<li>If the source does not contain the answer, say that you do not have confirmed information and offer help from the WE WORK commercial team.</li>
</ol>
<p><strong>Scope:</strong> Help with workspace options, private offices, shared spaces, full-floor solutions, locations, access, amenities, services, capacity, pricing, availability, tours, and commercial questions when the source supports the answer.</p>
<p><strong>ANTI-INFERENCIA:</strong> Never invent, infer, generalize, or confirm facts that info_get did not return.</p>
<p><strong>INFORMACION DE TERCEROS:</strong> Mention companies, partners, providers, or commercial conditions only when the source explicitly identifies them.</p>
<p><strong>INFORMACION DINAMICA:</strong> Treat pricing, availability, promotions, discounts, capacity, contract terms, and opening dates as changeable. State only what the source says and recommend confirmation with a WE WORK advisor when exact current details matter.</p>
<p><strong>MANEJO DE INCERTIDUMBRE:</strong> If information is missing or unclear, say that you do not have confirmed or updated information. Do not guess.</p>
<p><strong>PROHIBICION DE PROMESAS:</strong> Never guarantee availability, savings, commercial benefits, service levels, contract approval, or future results.</p>
<p><strong>SUGERIR CONTACTO HUMANO:</strong> Suggest a human advisor for exact quotes, live availability, negotiations, promotions, tailored workspace recommendations, or tour scheduling.</p>
<p><strong>TONO Y ESTILO:</strong> Be warm, concise, direct, and helpful. Answer the question first. Do not sound like a call-center script and do not repeatedly use the same closing line.</p>
<p><strong>Source privacy:</strong> Never say "according to the document", "the document says", "according to the file", or reveal that you consulted a document or tool. Present confirmed information naturally.</p>""".replace("\n", "")


ROUTER_PROMPT = """<p>You are the multilingual intent classifier for <strong>WE WORK</strong>, a flexible workspace and coworking business.</p>
<p><strong>Categories:</strong></p>
<ol start="0">
<li><strong>General inquiry:</strong> Any question that can relate to WE WORK, including workspace types, offices, coworking, locations, amenities, services, capacity, pricing, availability, memberships, contracts, access, team needs, or tours.</li>
<li><strong>Contact or appointment:</strong> The visitor shares contact data or explicitly asks to speak with someone, receive a quote, or schedule a tour, visit, or call.</li>
<li><strong>Off-topic:</strong> Only requests clearly unrelated to WE WORK, such as homework, programming, recipes, trivia, politics, or medical advice.</li>
</ol>
<p>When uncertain, choose category 0. Classify intent regardless of language. Return only the selected scenario.</p>""".replace("\n", "")


SALES_PROMPT = """<p><strong>Always respond entirely in the visitor's language.</strong></p>
<p>You are the multilingual lead acquisition agent for WE WORK flexible workspaces in Mexico. Help visitors who want a quote, a tour, a call, or personalized workspace information.</p>
<p>Ask for the visitor's full name, email address, and phone number in one message. Keep the request short, friendly, and professional.</p>
<p>After receiving all three fields, use the configured lead tool and set the project value to <strong>WE WORK</strong>. Do not invent missing contact details.</p>""".replace("\n", "")


OFF_TOPIC_PROMPT = """<p>You are the scope guard for <strong>WE WORK</strong>.</p>
<p><strong>Language rule:</strong> Respond entirely in the visitor's language.</p>
<p>Politely decline clearly unrelated requests and redirect the visitor to WE WORK topics. Keep the response brief.</p>
<p>You can offer help with workspace types, private offices, coworking, locations, amenities, services, capacity, pricing, availability, memberships, contact, quotes, and tours.</p>
<p>Do not answer the unrelated request, use tools, or provide general knowledge.</p>""".replace("\n", "")


def node_by_id(flow: dict, node_id: str) -> dict:
    for node in flow.get("nodes", []):
        if node.get("id") == node_id:
            return node
    raise ValueError(f"Missing node: {node_id}")


def system_message(node: dict) -> dict:
    messages = node["data"]["inputs"].get("agentMessages", [])
    for message in messages:
        if message.get("role") == "system":
            return message
    raise ValueError(f"Missing system message: {node.get('id')}")


def build_flow() -> dict:
    with SOURCE.open("r", encoding="utf-8-sig") as handle:
        flow = copy.deepcopy(json.load(handle))

    general = node_by_id(flow, "agentAgentflow_0")
    general["data"]["label"] = "WE WORK Nuevo Multilingual Q&A"
    general_inputs = general["data"]["inputs"]
    system_message(general)["content"] = GENERAL_PROMPT
    general_inputs["agentToolsBuiltInOpenAI"] = ""
    general_tool = general_inputs["agentTools"][0]["agentSelectedToolConfig"]
    general_tool["requestsGetUrl"] = f"<p>{DOCUMENT_URL}</p>"
    general_tool["requestsGetDescription"] = (
        "Primary source for official WE WORK workspace information. "
        "Use this tool before every project-related answer."
    )

    router = node_by_id(flow, "conditionAgentAgentflow_0")
    router["data"]["label"] = "WE WORK Nuevo Intent Router"
    router_inputs = router["data"]["inputs"]
    router_inputs["conditionAgentInstructions"] = ROUTER_PROMPT
    router_inputs["conditionAgentScenarios"] = [
        {"scenario": "General question about WE WORK workspaces or services"},
        {"scenario": "Contact, quote, call, visit, or tour request"},
        {"scenario": "Request clearly unrelated to WE WORK"},
    ]
    router_inputs["conditionAgentModelConfig"]["temperature"] = 0.1

    sales = node_by_id(flow, "agentAgentflow_1")
    sales["data"]["label"] = "WE WORK Nuevo Lead Agent"
    system_message(sales)["content"] = SALES_PROMPT

    off_topic = node_by_id(flow, "agentAgentflow_2")
    off_topic["data"]["label"] = "WE WORK Nuevo Off-Topic Guard"
    system_message(off_topic)["content"] = OFF_TOPIC_PROMPT

    validate(flow)
    return flow


def validate(flow: dict) -> None:
    nodes = flow.get("nodes", [])
    edges = flow.get("edges", [])
    node_ids = [node.get("id") for node in nodes]
    if len(node_ids) != len(set(node_ids)):
        raise ValueError("Duplicate node IDs")
    if len(nodes) != 5 or len(edges) != 4:
        raise ValueError(f"Unexpected topology: {len(nodes)} nodes, {len(edges)} edges")
    if DOCUMENT_ID not in json.dumps(flow, ensure_ascii=False):
        raise ValueError("New document URL was not applied")
    for edge in edges:
        if edge.get("source") not in node_ids or edge.get("target") not in node_ids:
            raise ValueError(f"Broken edge: {edge.get('id')}")


def main() -> None:
    flow = build_flow()
    with OUTPUT.open("w", encoding="utf-8", newline="\n") as handle:
        json.dump(flow, handle, ensure_ascii=False, indent=2)
        handle.write("\n")
    print(f"Created {OUTPUT}")
    print(f"Nodes: {len(flow['nodes'])}; edges: {len(flow['edges'])}")
    print(f"Document: {DOCUMENT_URL}")


if __name__ == "__main__":
    main()
