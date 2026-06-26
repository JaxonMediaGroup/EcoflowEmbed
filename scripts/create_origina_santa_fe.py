"""Create an Origina Santa Fe agentflow backed by a new Google document.

The agentflow is cloned from the standardized "WE WORK Agents.json" template
(prompts already include the strict forbidden-phrases sections) and the
project name plus document id are swapped in every node label and prompt.
"""

from __future__ import annotations

import copy
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "projects" / "WE WORK Agents.json"
OUTPUT = ROOT / "projects" / "Origina Santa Fe Agents.json"

PROJECT_NAME = "Origina Santa Fe"
DOCUMENT_ID = "1s87q5T4ADseMFOKal904rKYOXytKsgY9gkru2EcUuqM"
DOCUMENT_URL = (
    f"https://docs.google.com/document/d/{DOCUMENT_ID}/export?format=txt"
)

# Project metadata copied from WE WORK (residential real estate advisor).
CATEGORY = "real-estate"
TYPE = "AGENTFLOW"

OLD_PROJECT_NAME = "WE WORK"
OLD_DOCUMENT_ID = "1GgoBxaD6M5sNDguqIlPm0OT8c_eHwdvgVWu0WI7eSQA"


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
    raise ValueError(f"Missing system message in node: {node.get('id')}")


def replace_project(content: str) -> str:
    """Swap the WE WORK project name for Origina Santa Fe inside a prompt."""
    if not content:
        return content
    return content.replace(OLD_PROJECT_NAME, PROJECT_NAME)


def replace_in_object(obj):
    """Recursively swap the project name inside any nested input structure."""
    if isinstance(obj, str):
        return replace_project(obj)
    if isinstance(obj, list):
        return [replace_in_object(item) for item in obj]
    if isinstance(obj, dict):
        return {key: replace_in_object(value) for key, value in obj.items()}
    return obj


def build_flow() -> dict:
    with SOURCE.open("r", encoding="utf-8-sig") as handle:
        flow = copy.deepcopy(json.load(handle))

    general = node_by_id(flow, "agentAgentflow_0")
    general["data"]["label"] = f"{PROJECT_NAME} Multilingual Q&A"
    system_message(general)["content"] = replace_project(
        system_message(general)["content"]
    )
    # Point the info_get tool at the new Google document.
    for tool in general["data"]["inputs"].get("agentTools", []):
        cfg = tool.get("agentSelectedToolConfig", {})
        if cfg.get("agentSelectedTool") == "requestsGet":
            cfg["requestsGetUrl"] = f"<p>{DOCUMENT_URL}</p>"
            cfg["requestsGetDescription"] = replace_project(
                cfg.get("requestsGetDescription", "")
            )

    router = node_by_id(flow, "conditionAgentAgentflow_0")
    router["data"]["label"] = f"{PROJECT_NAME} Intent Router"
    router_inputs = router["data"]["inputs"]
    router_inputs["conditionAgentInstructions"] = replace_project(
        router_inputs.get("conditionAgentInstructions", "")
    )
    # Scenarios live in both inputs.conditionAgentScenarios and
    # inputParams[*].default (Flowise keeps a copy for the editor).
    router_inputs["conditionAgentScenarios"] = [
        {"scenario": f"General question about {PROJECT_NAME}"},
        {"scenario": "Contact request or appointment scheduling"},
        {
            "scenario": (
                f"User asks something COMPLETELY UNRELATED to {PROJECT_NAME} "
                "(homework, coding, math, recipes, trivia, jokes, weather, "
                "sports, politics, health advice) - in any language"
            )
        },
    ]
    router_data = router["data"]
    for param in router_data.get("inputParams", []):
        if "default" in param:
            param["default"] = replace_in_object(param["default"])

    sales = node_by_id(flow, "agentAgentflow_1")
    sales["data"]["label"] = f"{PROJECT_NAME} Lead Agent"
    system_message(sales)["content"] = replace_project(
        system_message(sales)["content"]
    )
    # Make sure the lead tool records the project value correctly.
    sales_inputs = sales["data"]["inputs"]
    for tool in sales_inputs.get("agentTools", []):
        cfg = tool.get("agentSelectedToolConfig", {})
        func = cfg.get("customToolFunc", "") or ""
        if OLD_PROJECT_NAME in func:
            cfg["customToolFunc"] = func.replace(OLD_PROJECT_NAME, PROJECT_NAME)

    off_topic = node_by_id(flow, "agentAgentflow_2")
    off_topic["data"]["label"] = f"{PROJECT_NAME} Off-Topic Guard"
    system_message(off_topic)["content"] = replace_project(
        system_message(off_topic)["content"]
    )

    validate(flow)
    return flow


def validate(flow: dict) -> None:
    nodes = flow.get("nodes", [])
    edges = flow.get("edges", [])
    node_ids = [node.get("id") for node in nodes]
    if len(node_ids) != len(set(node_ids)):
        raise ValueError("Duplicate node IDs")
    if len(nodes) != 5 or len(edges) != 4:
        raise ValueError(
            f"Unexpected topology: {len(nodes)} nodes, {len(edges)} edges"
        )
    if DOCUMENT_ID not in json.dumps(flow, ensure_ascii=False):
        raise ValueError("New document URL was not applied")
    if OLD_DOCUMENT_ID in json.dumps(flow, ensure_ascii=False):
        raise ValueError("Old document id still referenced")
    if OLD_PROJECT_NAME in json.dumps(flow, ensure_ascii=False):
        raise ValueError("Old project name still referenced")
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
