"""Download all remote Flowise chatflows and generate a per-project audit.

Usage:
    python scripts/sync_remote_chatflows.py
"""

from __future__ import annotations

import json
import os
import re
import unicodedata
from datetime import datetime
from pathlib import Path

import requests


REPO_ROOT = Path(__file__).resolve().parents[1]
CONFIG_FILE = REPO_ROOT / "projects.json"
API_KEY_FALLBACK = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"

CORE_BLOCKS = [
    ("INFORMACION DINAMICA", "informacion_dinamica"),
    ("INFORMACION DE TERCEROS", "informacion_terceros"),
    ("MANEJO DE INCERTIDUMBRE", "manejo_incertidumbre"),
    ("ANTI-INFERENCIA", "anti_inferencia"),
    ("PROHIBICION DE PROMESAS", "prohibicion_promesas"),
    ("SUGERIR CONTACTO HUMANO", "sugerir_contacto_humano"),
    ("TONO Y ESTILO", "tono_y_estilo"),
]


def load_config() -> dict:
    with open(CONFIG_FILE, "r", encoding="utf-8") as handle:
        return json.load(handle)


def resolve_api_key(config: dict) -> str:
    env_name = str(config.get("api_key_env", "")).strip()
    if env_name:
        api_key = str(os.environ.get(env_name, "")).strip()
        if api_key:
            return api_key
    return API_KEY_FALLBACK


def normalize_text(value: str) -> str:
    value = unicodedata.normalize("NFKD", value or "")
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    return value.upper()


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value or "")
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    value = re.sub(r"[^A-Za-z0-9]+", "_", value).strip("_")
    return value or "chatflow"


def parse_json_maybe(value):
    if isinstance(value, list):
        return value
    if isinstance(value, str) and value.strip():
        try:
            parsed = json.loads(value)
            return parsed if isinstance(parsed, list) else []
        except json.JSONDecodeError:
            return []
    return []


def iter_model_names(flow: dict) -> list[str]:
    models: list[str] = []
    for node in flow.get("nodes", []):
        inputs = node.get("data", {}).get("inputs", {})
        for config_key in ("agentModelConfig", "conditionAgentModelConfig"):
            config = inputs.get(config_key)
            if isinstance(config, dict):
                model_name = str(config.get("modelName", "")).strip()
                if model_name and model_name not in models:
                    models.append(model_name)
    return models


def summarize_tools(node: dict) -> tuple[list[str], list[str]]:
    inputs = node.get("data", {}).get("inputs", {})
    custom_tools: list[str] = []
    for tool in inputs.get("agentTools", []) or []:
        config = tool.get("agentSelectedToolConfig", {}) or {}
        tool_name = (
            config.get("requestsGetName")
            or config.get("customToolName")
            or tool.get("agentSelectedTool")
            or ""
        )
        tool_name = str(tool_name).strip()
        if tool_name and tool_name not in custom_tools:
            custom_tools.append(tool_name)

    builtins = parse_json_maybe(inputs.get("agentToolsBuiltInOpenAI"))
    builtin_tools = [str(item).strip() for item in builtins if str(item).strip()]
    return custom_tools, builtin_tools


def choose_qna_node(flow: dict) -> dict | None:
    candidates: list[tuple[int, dict]] = []
    fallback: list[tuple[int, dict]] = []
    for node in flow.get("nodes", []):
        if node.get("data", {}).get("name") != "agentAgentflow":
            continue
        label = str(node.get("data", {}).get("label", "")).lower()
        messages = node.get("data", {}).get("inputs", {}).get("agentMessages", []) or []
        prompt = str(messages[0].get("content", "")) if messages else ""
        prompt_len = len(prompt)
        fallback.append((prompt_len, node))
        if any(tag in label for tag in ("lead", "sales", "contact", "off-topic", "guard", "admissions")):
            continue
        candidates.append((prompt_len, node))

    if candidates:
        return max(candidates, key=lambda item: item[0])[1]
    if fallback:
        return max(fallback, key=lambda item: item[0])[1]
    return None


def analyze_prompt(prompt: str) -> dict:
    normalized = normalize_text(prompt)
    blocks = {}
    for marker, key in CORE_BLOCKS:
        blocks[key] = marker in normalized

    blocks["anti_inferencia"] = blocks["anti_inferencia"] or ("ANTI-INFERENCE" in normalized)
    blocks["rules_get"] = "RULES_GET" in normalized
    blocks["forbidden_document_phrase_rule"] = "ACCORDING TO THE DOCUMENT" in normalized or "SEGUN EL DOCUMENTO" in normalized
    blocks["minimal_anti_inference_only"] = "ANTI-INFERENCE RULES" in normalized and not blocks["manejo_incertidumbre"]
    return blocks


def classify_prompt_profile(blocks: dict) -> str:
    core_keys = [key for _, key in CORE_BLOCKS]
    present_core = sum(1 for key in core_keys if blocks.get(key))
    if present_core >= 6:
        return "modern-guardrailed"
    if blocks.get("minimal_anti_inference_only"):
        return "minimal-anti-inference"
    if present_core >= 2:
        return "partial-guardrails"
    return "legacy-or-custom"


def analyze_flow(flow: dict) -> dict:
    node_counts = {"start": 0, "condition": 0, "agent": 0, "other": 0}
    all_custom_tools: list[str] = []
    all_builtin_tools: list[str] = []

    for node in flow.get("nodes", []):
        node_name = node.get("data", {}).get("name")
        if node_name == "startAgentflow":
            node_counts["start"] += 1
        elif node_name == "conditionAgentAgentflow":
            node_counts["condition"] += 1
        elif node_name == "agentAgentflow":
            node_counts["agent"] += 1
        else:
            node_counts["other"] += 1

        custom_tools, builtin_tools = summarize_tools(node)
        for tool_name in custom_tools:
            if tool_name not in all_custom_tools:
                all_custom_tools.append(tool_name)
        for builtin_name in builtin_tools:
            if builtin_name not in all_builtin_tools:
                all_builtin_tools.append(builtin_name)

    qna_node = choose_qna_node(flow)
    qna_label = ""
    qna_prompt = ""
    if qna_node:
        qna_label = str(qna_node.get("data", {}).get("label", "")).strip()
        messages = qna_node.get("data", {}).get("inputs", {}).get("agentMessages", []) or []
        if messages:
            qna_prompt = str(messages[0].get("content", ""))

    blocks = analyze_prompt(qna_prompt)
    return {
        "node_counts": node_counts,
        "edge_count": len(flow.get("edges", [])),
        "models": iter_model_names(flow),
        "custom_tools": all_custom_tools,
        "builtin_tools": all_builtin_tools,
        "qna_label": qna_label,
        "qna_blocks": blocks,
        "prompt_profile": classify_prompt_profile(blocks),
    }


def match_registered_project(config: dict, chatflow_name: str, chatflow_id: str) -> tuple[str | None, dict | None]:
    projects = config.get("projects", {})
    for name, project in projects.items():
        if project.get("chatflow_id") == chatflow_id:
            return name, project
    for name, project in projects.items():
        if name.lower() == chatflow_name.lower():
            return name, project
    return None, None


def collect_issues(summary: dict, registered_name: str | None, registered_project: dict | None) -> list[str]:
    issues: list[str] = []
    if not registered_name:
        issues.append("Not registered in projects.json")
    if registered_project:
        json_file = registered_project.get("json_file")
        if json_file:
            local_path = REPO_ROOT / json_file
            if not local_path.exists():
                issues.append(f"Local file missing: {json_file}")

    if summary["node_counts"]["condition"] == 0:
        issues.append("No condition agent found")
    if summary["node_counts"]["agent"] < 3:
        issues.append("Fewer than 3 agent nodes")

    qna_blocks = summary["qna_blocks"]
    missing_core = [key for _, key in CORE_BLOCKS if not qna_blocks.get(key)]
    if missing_core:
        issues.append("Missing core Q&A blocks: " + ", ".join(missing_core))
    if "rules_get" not in summary["custom_tools"]:
        issues.append("No rules_get tool configured")
    if "web_search_preview" not in summary["builtin_tools"]:
        issues.append("No web_search_preview built-in")
    return issues


def write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as handle:
        handle.write(content)


def generate_report(snapshot_name: str, inventory: list[dict]) -> str:
    lines = [
        f"# Remote Chatflows Audit - {snapshot_name}",
        "",
        f"Total chatflows audited: {len(inventory)}",
        f"Registered in projects.json: {sum(1 for item in inventory if item['registered_name'])}",
        f"Unregistered remotely deployed chatflows: {sum(1 for item in inventory if not item['registered_name'])}",
        "",
        "## Summary",
        "",
        "| Name | Type | Registered | Profile | Tools | Models | Issues |",
        "| --- | --- | --- | --- | --- | --- | --- |",
    ]

    for item in inventory:
        registered = item["registered_name"] or "No"
        tools = ", ".join(item["analysis"]["custom_tools"][:4]) or "-"
        models = ", ".join(item["analysis"]["models"]) or "-"
        issues = str(len(item["issues"]))
        lines.append(
            f"| {item['name']} | {item['type']} | {registered} | {item['analysis']['prompt_profile']} | {tools} | {models} | {issues} |"
        )

    lines.append("")
    lines.append("## Per Project")
    lines.append("")

    for item in inventory:
        analysis = item["analysis"]
        blocks = analysis["qna_blocks"]
        lines.extend(
            [
                f"### {item['name']}",
                "",
                f"- ID: {item['id']}",
                f"- Type: {item['type']}",
                f"- Updated: {item['updatedDate']}",
                f"- Registered project: {item['registered_name'] or 'No'}",
                f"- Local file: {item['local_json_file'] or 'No linked file'}",
                f"- Structure: start={analysis['node_counts']['start']}, condition={analysis['node_counts']['condition']}, agent={analysis['node_counts']['agent']}, other={analysis['node_counts']['other']}, edges={analysis['edge_count']}",
                f"- Q&A node: {analysis['qna_label'] or 'Not detected'}",
                f"- Models: {', '.join(analysis['models']) or '-'}",
                f"- Custom tools: {', '.join(analysis['custom_tools']) or '-'}",
                f"- Built-in tools: {', '.join(analysis['builtin_tools']) or '-'}",
                f"- Prompt profile: {analysis['prompt_profile']}",
                "- Core blocks:",
                f"  - informacion_dinamica: {'yes' if blocks['informacion_dinamica'] else 'no'}",
                f"  - informacion_terceros: {'yes' if blocks['informacion_terceros'] else 'no'}",
                f"  - manejo_incertidumbre: {'yes' if blocks['manejo_incertidumbre'] else 'no'}",
                f"  - anti_inferencia: {'yes' if blocks['anti_inferencia'] else 'no'}",
                f"  - prohibicion_promesas: {'yes' if blocks['prohibicion_promesas'] else 'no'}",
                f"  - sugerir_contacto_humano: {'yes' if blocks['sugerir_contacto_humano'] else 'no'}",
                f"  - tono_y_estilo: {'yes' if blocks['tono_y_estilo'] else 'no'}",
                f"  - rules_get_in_prompt: {'yes' if blocks['rules_get'] else 'no'}",
                "- Issues:",
            ]
        )

        if item["issues"]:
            for issue in item["issues"]:
                lines.append(f"  - {issue}")
        else:
            lines.append("  - None")
        lines.append("")

    return "\n".join(lines)


def main() -> None:
    config = load_config()
    flowise_url = str(config.get("flowise_url", "https://ecoflow.koppi.mx")).rstrip("/")
    api_key = resolve_api_key(config)
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    snapshot_name = datetime.now().strftime("%Y%m%d_%H%M%S")
    snapshot_dir = REPO_ROOT / f"backups_remote_{snapshot_name}"
    raw_dir = snapshot_dir / "raw"
    flow_dir = snapshot_dir / "flowdata"
    report_dir = snapshot_dir / "reports"

    response = requests.get(f"{flowise_url}/api/v1/chatflows", headers=headers, timeout=60)
    response.raise_for_status()
    chatflows = response.json()
    write_json(snapshot_dir / "chatflows_index.json", chatflows)

    inventory: list[dict] = []

    for chatflow in sorted(chatflows, key=lambda item: item.get("updatedDate", ""), reverse=True):
        chatflow_id = str(chatflow.get("id", "")).strip()
        if not chatflow_id:
            continue

        detail_response = requests.get(f"{flowise_url}/api/v1/chatflows/{chatflow_id}", headers=headers, timeout=60)
        detail_response.raise_for_status()
        detail = detail_response.json()

        safe_name = slugify(str(chatflow.get("name", "chatflow")))
        raw_path = raw_dir / f"{safe_name}__{chatflow_id}.json"
        flow_path = flow_dir / f"{safe_name}__{chatflow_id}.json"
        write_json(raw_path, detail)

        flow_payload = detail.get("flowData", "{}")
        try:
            flow = json.loads(flow_payload) if isinstance(flow_payload, str) else dict(flow_payload)
        except json.JSONDecodeError:
            flow = {}
        write_json(flow_path, flow)

        analysis = analyze_flow(flow)
        registered_name, registered_project = match_registered_project(config, str(chatflow.get("name", "")), chatflow_id)
        local_json_file = registered_project.get("json_file") if registered_project else None
        issues = collect_issues(analysis, registered_name, registered_project)

        inventory.append(
            {
                "id": chatflow_id,
                "name": chatflow.get("name", ""),
                "type": chatflow.get("type", ""),
                "updatedDate": chatflow.get("updatedDate", ""),
                "registered_name": registered_name,
                "local_json_file": local_json_file,
                "analysis": analysis,
                "issues": issues,
                "raw_file": str(raw_path.relative_to(REPO_ROOT)).replace("\\", "/"),
                "flow_file": str(flow_path.relative_to(REPO_ROOT)).replace("\\", "/"),
            }
        )

    report_markdown = generate_report(snapshot_name, inventory)
    write_json(report_dir / "audit_summary.json", inventory)
    write_text(report_dir / "audit_summary.md", report_markdown)

    print(f"Snapshot directory: {snapshot_dir}")
    print(f"Chatflows downloaded: {len(inventory)}")
    print(f"Registered: {sum(1 for item in inventory if item['registered_name'])}")
    print(f"Unregistered: {sum(1 for item in inventory if not item['registered_name'])}")
    print(f"Audit report: {report_dir / 'audit_summary.md'}")


if __name__ == "__main__":
    main()