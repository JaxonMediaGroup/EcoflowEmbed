"""Local admin services for Flowise agent projects.

The admin panel treats files in ``projects/`` as editable drafts and Flowise as
the publish target. This module is intentionally framework-light so it can be
tested without booting Flask.
"""

from __future__ import annotations

import copy
import difflib
import json
import os
import re
import shutil
import unicodedata
from datetime import datetime
from pathlib import Path
from typing import Any

import requests


CORE_BLOCKS = [
    ("INFORMACION DINAMICA", "informacion_dinamica"),
    ("INFORMACION DE TERCEROS", "informacion_terceros"),
    ("MANEJO DE INCERTIDUMBRE", "manejo_incertidumbre"),
    ("ANTI-INFERENCIA", "anti_inferencia"),
    ("PROHIBICION DE PROMESAS", "prohibicion_promesas"),
    ("SUGERIR CONTACTO HUMANO", "sugerir_contacto_humano"),
    ("TONO Y ESTILO", "tono_y_estilo"),
]


def _default_repo_root() -> Path:
    here = Path(__file__).resolve()
    candidates = [
        Path(os.getenv("ADMIN_REPO_ROOT", "")).expanduser(),
        here.parents[2],  # C:/.../Chatbots when running from analytics/insights
        Path.cwd(),
        Path.cwd().parent,
    ]
    for candidate in candidates:
        if candidate and (candidate / "projects.json").exists():
            return candidate
    return here.parents[2]


REPO_ROOT = _default_repo_root()
PROJECTS_JSON = REPO_ROOT / "projects.json"
PROJECTS_DIR = REPO_ROOT / "projects"
ADMIN_DIR = REPO_ROOT / "admin_state"
BACKUP_DIR = ADMIN_DIR / "backups"
AUDIT_LOG = ADMIN_DIR / "audit_log.jsonl"


class AdminError(Exception):
    def __init__(self, message: str, status: int = 400):
        super().__init__(message)
        self.status = status


def utc_now() -> str:
    return datetime.utcnow().replace(microsecond=0).isoformat() + "Z"


def read_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    with tmp.open("w", encoding="utf-8", newline="\n") as handle:
        json.dump(data, handle, ensure_ascii=False, indent=2)
        handle.write("\n")
    tmp.replace(path)


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value or "")
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    value = re.sub(r"[^A-Za-z0-9]+", "-", value).strip("-").lower()
    return value or "project"


def normalize_text(value: str) -> str:
    value = unicodedata.normalize("NFKD", value or "")
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    return value.upper()


def parse_json_maybe(value: Any) -> list[Any]:
    if isinstance(value, list):
        return value
    if isinstance(value, str) and value.strip():
        try:
            parsed = json.loads(value)
            return parsed if isinstance(parsed, list) else []
        except json.JSONDecodeError:
            return []
    return []


def load_projects_config() -> dict[str, Any]:
    if not PROJECTS_JSON.exists():
        raise AdminError(f"projects.json not found at {PROJECTS_JSON}", 500)
    data = read_json(PROJECTS_JSON)
    data.setdefault("projects", {})
    return data


def latest_snapshot_dir() -> Path | None:
    snapshots = [
        p for p in REPO_ROOT.glob("backups_remote_*")
        if p.is_dir() and (p / "reports" / "audit_summary.json").exists()
    ]
    if not snapshots:
        return None
    return max(snapshots, key=lambda p: p.stat().st_mtime)


def load_audit_items() -> list[dict[str, Any]]:
    snap = latest_snapshot_dir()
    if not snap:
        return []
    try:
        items = read_json(snap / "reports" / "audit_summary.json")
        return items if isinstance(items, list) else []
    except Exception:
        return []


def audit_index() -> dict[str, dict[str, Any]]:
    index: dict[str, dict[str, Any]] = {}
    for item in load_audit_items():
        for key in (item.get("id"), item.get("name"), item.get("registered_name")):
            if key:
                index[str(key).lower()] = item
    return index


def project_path(project: dict[str, Any]) -> Path | None:
    json_file = project.get("json_file")
    if not json_file:
        return None
    path = REPO_ROOT / str(json_file)
    return path


def resolve_project(project_id: str) -> tuple[str, dict[str, Any]]:
    config = load_projects_config()
    projects = config.get("projects", {})
    target = (project_id or "").strip()
    target_l = target.lower()
    for name, project in projects.items():
        candidates = {
            name.lower(),
            slugify(name),
            str(project.get("chatflow_id", "")).lower(),
            slugify(str(project.get("chatflow_id", ""))),
        }
        if target_l in candidates or slugify(target) in candidates:
            return name, project
    raise AdminError(f"Project not found: {project_id}", 404)


def flow_nodes(flow: dict[str, Any]) -> list[dict[str, Any]]:
    nodes = flow.get("nodes", [])
    return nodes if isinstance(nodes, list) else []


def node_type(node: dict[str, Any]) -> str:
    data = node.get("data", {}) or {}
    return str(data.get("type") or data.get("name") or node.get("type") or "Unknown")


def node_inputs(node: dict[str, Any]) -> dict[str, Any]:
    return node.get("data", {}).get("inputs", {}) or {}


def extract_model(inputs: dict[str, Any]) -> str:
    for key in ("agentModelConfig", "conditionAgentModelConfig", "llmModelConfig"):
        cfg = inputs.get(key)
        if isinstance(cfg, dict):
            model = str(cfg.get("modelName") or cfg.get("model") or "").strip()
            if model:
                return model
    return ""


def has_credential(inputs: dict[str, Any]) -> bool:
    for key in ("agentModelConfig", "conditionAgentModelConfig", "llmModelConfig"):
        cfg = inputs.get(key)
        if isinstance(cfg, dict) and str(cfg.get("FLOWISE_CREDENTIAL_ID", "")).strip():
            return True
    return False


def extract_messages(inputs: dict[str, Any]) -> list[dict[str, str]]:
    messages = []
    for key in ("agentMessages", "llmMessages"):
        raw = inputs.get(key)
        if isinstance(raw, list):
            for idx, item in enumerate(raw):
                if isinstance(item, dict):
                    content = str(item.get("content", "") or "")
                    role = str(item.get("role", item.get("type", "message")) or "message")
                else:
                    content = str(item or "")
                    role = "message"
                if content:
                    messages.append({"index": idx, "role": role, "content": content})
    return messages


def summarize_tools(node: dict[str, Any]) -> tuple[list[str], list[str]]:
    inputs = node_inputs(node)
    custom_tools: list[str] = []
    for tool in inputs.get("agentTools", []) or []:
        if not isinstance(tool, dict):
            continue
        config = tool.get("agentSelectedToolConfig", {}) or {}
        name = (
            config.get("requestsGetName")
            or config.get("customToolName")
            or tool.get("agentSelectedTool")
            or ""
        )
        name = str(name).strip()
        if name and name not in custom_tools:
            custom_tools.append(name)

    builtin_tools = []
    for item in parse_json_maybe(inputs.get("agentToolsBuiltInOpenAI")):
        name = str(item).strip()
        if name and name not in builtin_tools:
            builtin_tools.append(name)
    return custom_tools, builtin_tools


def choose_qna_node(flow: dict[str, Any]) -> dict[str, Any] | None:
    candidates: list[tuple[int, dict[str, Any]]] = []
    fallback: list[tuple[int, dict[str, Any]]] = []
    for node in flow_nodes(flow):
        if node.get("data", {}).get("name") not in ("agentAgentflow", "llmAgentflow"):
            continue
        label = str(node.get("data", {}).get("label", "")).lower()
        prompt = "\n".join(m["content"] for m in extract_messages(node_inputs(node)))
        item = (len(prompt), node)
        fallback.append(item)
        if any(tag in label for tag in ("lead", "sales", "contact", "off-topic", "guard")):
            continue
        candidates.append(item)
    if candidates:
        return max(candidates, key=lambda x: x[0])[1]
    if fallback:
        return max(fallback, key=lambda x: x[0])[1]
    return None


def analyze_prompt(prompt: str) -> dict[str, bool]:
    normalized = normalize_text(prompt)
    blocks = {key: marker in normalized for marker, key in CORE_BLOCKS}
    blocks["anti_inferencia"] = blocks["anti_inferencia"] or "ANTI-INFERENCE" in normalized
    blocks["rules_get"] = "RULES_GET" in normalized
    blocks["forbidden_document_phrase_rule"] = (
        "ACCORDING TO THE DOCUMENT" in normalized or "SEGUN EL DOCUMENTO" in normalized
    )
    return blocks


def prompt_profile(blocks: dict[str, bool]) -> str:
    core = [key for _, key in CORE_BLOCKS]
    present = sum(1 for key in core if blocks.get(key))
    if present >= 6:
        return "modern-guardrailed"
    if "ANTI-INFERENCE RULES" in str(blocks):
        return "minimal-anti-inference"
    if present >= 2:
        return "partial-guardrails"
    return "legacy-or-custom"


def summarize_flow(flow: dict[str, Any]) -> dict[str, Any]:
    counts = {"start": 0, "condition": 0, "agent": 0, "other": 0}
    models: list[str] = []
    custom_tools: list[str] = []
    builtin_tools: list[str] = []
    nodes_summary = []

    for node in flow_nodes(flow):
        data = node.get("data", {}) or {}
        inputs = node_inputs(node)
        dtype = node_type(node)
        name = str(data.get("name") or "")
        if name == "startAgentflow" or dtype == "Start":
            counts["start"] += 1
        elif name == "conditionAgentAgentflow" or dtype == "ConditionAgent":
            counts["condition"] += 1
        elif name in ("agentAgentflow", "llmAgentflow") or dtype in ("Agent", "LLM"):
            counts["agent"] += 1
        else:
            counts["other"] += 1

        model = extract_model(inputs)
        if model and model not in models:
            models.append(model)
        ct, bt = summarize_tools(node)
        for tool in ct:
            if tool not in custom_tools:
                custom_tools.append(tool)
        for tool in bt:
            if tool not in builtin_tools:
                builtin_tools.append(tool)
        messages = extract_messages(inputs)
        prompt = messages[0]["content"] if messages else ""
        nodes_summary.append({
            "id": node.get("id", data.get("id", "")),
            "label": data.get("label", node.get("id", "")),
            "type": dtype,
            "name": name,
            "model": model,
            "has_credential": has_credential(inputs),
            "custom_tools": ct,
            "builtin_tools": bt,
            "message_count": len(messages),
            "prompt_excerpt": prompt[:280],
            "prompt_length": len(prompt),
        })

    qna = choose_qna_node(flow)
    qna_prompt = ""
    qna_label = ""
    if qna:
        qna_label = str(qna.get("data", {}).get("label", ""))
        qna_prompt = "\n".join(m["content"] for m in extract_messages(node_inputs(qna)))
    blocks = analyze_prompt(qna_prompt)
    return {
        "node_counts": counts,
        "edge_count": len(flow.get("edges", []) if isinstance(flow.get("edges"), list) else []),
        "models": models,
        "custom_tools": custom_tools,
        "builtin_tools": builtin_tools,
        "qna_label": qna_label,
        "qna_blocks": blocks,
        "prompt_profile": prompt_profile(blocks),
        "nodes": nodes_summary,
    }


def list_projects() -> dict[str, Any]:
    config = load_projects_config()
    audits = audit_index()
    projects = []
    total_local = 0
    total_remote = 0
    total_issues = 0

    for name, project in sorted(config.get("projects", {}).items(), key=lambda x: x[0].lower()):
        path = project_path(project)
        has_local = bool(path and path.exists())
        flow = None
        summary = {}
        validation = {"errors": [], "warnings": [], "status": "missing"}
        if has_local and path:
            try:
                flow = read_json(path)
                summary = summarize_flow(flow)
                validation = validate_flow(flow, require_publish_ready=False)
                total_local += 1
            except Exception as exc:
                validation = {"errors": [f"Cannot read local JSON: {exc}"], "warnings": [], "status": "error"}

        audit = audits.get(str(project.get("chatflow_id", "")).lower()) or audits.get(name.lower()) or {}
        has_remote = bool(audit)
        if has_remote:
            total_remote += 1
        issues = audit.get("issues", []) or validation.get("errors", [])
        total_issues += len(issues)
        projects.append({
            "id": slugify(name),
            "name": name,
            "chatflow_id": project.get("chatflow_id", ""),
            "json_file": project.get("json_file", ""),
            "type": project.get("type", "AGENTFLOW"),
            "category": project.get("category", ""),
            "has_local": has_local,
            "has_remote": has_remote,
            "local_mtime": datetime.fromtimestamp(path.stat().st_mtime).isoformat() if has_local and path else "",
            "remote_updated_at": audit.get("updatedDate", ""),
            "node_counts": summary.get("node_counts", {}),
            "models": summary.get("models", []),
            "custom_tools": summary.get("custom_tools", []),
            "builtin_tools": summary.get("builtin_tools", []),
            "prompt_profile": summary.get("prompt_profile", audit.get("analysis", {}).get("prompt_profile", "")),
            "validation_status": validation.get("status"),
            "issues": issues,
            "agent_count": summary.get("node_counts", {}).get("agent", 0),
        })

    return {
        "projects": projects,
        "summary": {
            "total_projects": len(projects),
            "with_local": total_local,
            "with_remote": total_remote,
            "total_issues": total_issues,
            "snapshot": str(latest_snapshot_dir() or ""),
        },
    }


def project_detail(project_id: str) -> dict[str, Any]:
    name, project = resolve_project(project_id)
    path = project_path(project)
    flow = None
    summary = {}
    validation = {"errors": ["Local JSON missing"], "warnings": [], "status": "missing"}
    if path and path.exists():
        flow = read_json(path)
        summary = summarize_flow(flow)
        validation = validate_flow(flow, require_publish_ready=False)
    audits = audit_index()
    audit = audits.get(str(project.get("chatflow_id", "")).lower()) or audits.get(name.lower()) or {}
    return {
        "project": {
            "id": slugify(name),
            "name": name,
            "chatflow_id": project.get("chatflow_id", ""),
            "json_file": project.get("json_file", ""),
            "type": project.get("type", "AGENTFLOW"),
            "category": project.get("category", ""),
            "has_local": bool(path and path.exists()),
            "has_remote": bool(audit),
            "local_path": str(path) if path else "",
            "local_mtime": datetime.fromtimestamp(path.stat().st_mtime).isoformat() if path and path.exists() else "",
            "remote_updated_at": audit.get("updatedDate", ""),
        },
        "flow": flow,
        "summary": summary,
        "validation": validation,
        "audit": audit,
        "history": read_audit_log(name, limit=25),
    }


def validate_flow(flow: dict[str, Any] | None, require_publish_ready: bool = False) -> dict[str, Any]:
    errors: list[str] = []
    warnings: list[str] = []
    if not isinstance(flow, dict):
        return {"status": "error", "errors": ["Flow must be a JSON object"], "warnings": warnings}
    nodes = flow.get("nodes")
    edges = flow.get("edges")
    if not isinstance(nodes, list):
        errors.append("Flow must include a nodes array")
        nodes = []
    if not isinstance(edges, list):
        errors.append("Flow must include an edges array")
        edges = []
    summary = summarize_flow({"nodes": nodes, "edges": edges})
    if summary["node_counts"].get("start", 0) < 1:
        errors.append("At least one Start node is required")
    if summary["node_counts"].get("agent", 0) < 1:
        errors.append("At least one Agent or LLM node is required")
    if summary["node_counts"].get("agent", 0) < 3:
        warnings.append("Fewer than 3 agent nodes; verify routing coverage")
    if summary["node_counts"].get("condition", 0) < 1:
        warnings.append("No ConditionAgent found; routing may be limited")
    for node in summary["nodes"]:
        if node["type"] in ("Agent", "LLM", "ConditionAgent") and not node.get("model"):
            warnings.append(f"{node['label']} has no model configured")
        if require_publish_ready and node["type"] in ("Agent", "LLM", "ConditionAgent") and not node.get("has_credential"):
            errors.append(f"{node['label']} has no Flowise credential configured")
    blocks = summary.get("qna_blocks", {})
    missing_blocks = [key for _, key in CORE_BLOCKS if not blocks.get(key)]
    if missing_blocks:
        warnings.append("Missing core Q&A blocks: " + ", ".join(missing_blocks))
    if "rules_get" not in summary.get("custom_tools", []):
        warnings.append("No rules_get tool configured")
    if "web_search_preview" not in summary.get("builtin_tools", []):
        warnings.append("No web_search_preview built-in")
    status = "error" if errors else "warning" if warnings else "ok"
    return {"status": status, "errors": errors, "warnings": warnings, "summary": summary}


def update_project(project_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    name, project = resolve_project(project_id)
    config = load_projects_config()
    path = project_path(project)
    if not path:
        raise AdminError("Project does not define json_file", 400)
    flow = read_json(path) if path.exists() else {"nodes": [], "edges": []}

    metadata = payload.get("metadata") or {}
    if metadata:
        current = config["projects"][name]
        for key in ("category", "type", "chatflow_id", "json_file"):
            if key in metadata:
                current[key] = metadata[key]
        write_json(PROJECTS_JSON, config)

    patch = payload.get("flow_patch") or {}
    if patch:
        apply_flow_patch(flow, patch)
        validation = validate_flow(flow, require_publish_ready=False)
        if validation["errors"]:
            raise AdminError("; ".join(validation["errors"]), 400)
        write_json(path, flow)
        append_audit_log(name, "update_draft", {"path": str(path), "fields": list(patch.keys())})

    return project_detail(name)


def apply_flow_patch(flow: dict[str, Any], patch: dict[str, Any]) -> None:
    nodes = flow.get("nodes", [])
    if not isinstance(nodes, list):
        raise AdminError("Cannot patch flow without nodes array", 400)
    node_updates = patch.get("nodes", [])
    if not isinstance(node_updates, list):
        raise AdminError("flow_patch.nodes must be an array", 400)
    by_id = {str(node.get("id") or node.get("data", {}).get("id")): node for node in nodes}
    for update in node_updates:
        node_id = str(update.get("id", ""))
        node = by_id.get(node_id)
        if not node:
            raise AdminError(f"Node not found: {node_id}", 404)
        inputs = node.setdefault("data", {}).setdefault("inputs", {})
        if "label" in update:
            node["data"]["label"] = str(update["label"])
        if "model" in update:
            for key in ("agentModelConfig", "conditionAgentModelConfig", "llmModelConfig"):
                cfg = inputs.get(key)
                if isinstance(cfg, dict):
                    cfg["modelName"] = str(update["model"])
        if "messages" in update:
            messages = update["messages"]
            if not isinstance(messages, list):
                raise AdminError("node.messages must be an array", 400)
            target_key = "agentMessages" if "agentMessages" in inputs else "llmMessages" if "llmMessages" in inputs else ""
            if not target_key:
                raise AdminError(f"Node has no editable messages: {node_id}", 400)
            existing = inputs.get(target_key) or []
            new_messages = copy.deepcopy(existing)
            for msg in messages:
                idx = int(msg.get("index", 0))
                while len(new_messages) <= idx:
                    new_messages.append({"role": "systemMessage", "content": ""})
                if not isinstance(new_messages[idx], dict):
                    new_messages[idx] = {"role": "systemMessage", "content": ""}
                if "role" in msg:
                    new_messages[idx]["role"] = msg["role"]
                if "content" in msg:
                    new_messages[idx]["content"] = msg["content"]
            inputs[target_key] = new_messages


def create_project(payload: dict[str, Any]) -> dict[str, Any]:
    name = str(payload.get("name", "")).strip()
    if not name:
        raise AdminError("name is required", 400)
    config = load_projects_config()
    if name in config.get("projects", {}):
        raise AdminError("Project already exists", 409)
    category = str(payload.get("category", "real-estate")).strip() or "real-estate"
    source = payload.get("template_project") or find_template_project()
    _, source_project = resolve_project(str(source))
    source_path = project_path(source_project)
    if not source_path or not source_path.exists():
        raise AdminError("Template flow is not available", 500)
    json_file = f"projects/{name} Agents.json"
    target_path = REPO_ROOT / json_file
    if target_path.exists():
        raise AdminError("Target JSON already exists", 409)
    flow = read_json(source_path)
    rewrite_flow_labels(flow, name)
    config["projects"][name] = {
        "chatflow_id": str(payload.get("chatflow_id", "")).strip(),
        "json_file": json_file,
        "type": str(payload.get("type", "AGENTFLOW")).strip() or "AGENTFLOW",
        "category": category,
    }
    write_json(target_path, flow)
    write_json(PROJECTS_JSON, config)
    append_audit_log(name, "create_project", {"template": str(source), "path": json_file})
    return project_detail(name)


def find_template_project() -> str:
    for item in list_projects()["projects"]:
        if item.get("prompt_profile") == "modern-guardrailed" and item.get("has_local"):
            return item["name"]
    raise AdminError("No modern local template project found", 500)


def rewrite_flow_labels(flow: dict[str, Any], name: str) -> None:
    for node in flow_nodes(flow):
        data = node.get("data", {}) or {}
        label = str(data.get("label", ""))
        if label and "Multilingual Q&A" in label:
            data["label"] = f"{name} Multilingual Q&A"


def backup_project(project_id: str, reason: str = "manual") -> dict[str, Any]:
    name, project = resolve_project(project_id)
    path = project_path(project)
    if not path or not path.exists():
        raise AdminError("Local JSON missing; nothing to back up", 404)
    stamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    backup_name = f"{slugify(name)}__{stamp}.json"
    target = BACKUP_DIR / backup_name
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, target)
    append_audit_log(name, "backup", {"backup": str(target), "reason": reason})
    return {"ok": True, "backup": str(target), "created_at": utc_now()}


def diff_project(project_id: str) -> dict[str, Any]:
    name, project = resolve_project(project_id)
    path = project_path(project)
    if not path or not path.exists():
        raise AdminError("Local JSON missing", 404)
    local_flow = read_json(path)
    remote_flow = load_remote_flow(project)
    local_text = json.dumps(local_flow, ensure_ascii=False, indent=2, sort_keys=True).splitlines()
    remote_text = json.dumps(remote_flow or {}, ensure_ascii=False, indent=2, sort_keys=True).splitlines()
    diff_lines = list(difflib.unified_diff(
        remote_text,
        local_text,
        fromfile="remote-flowise",
        tofile="local-draft",
        lineterm="",
        n=3,
    ))
    return {
        "project": name,
        "has_remote": remote_flow is not None,
        "changed": bool(diff_lines),
        "diff": diff_lines[:1200],
        "truncated": len(diff_lines) > 1200,
        "line_count": len(diff_lines),
    }


def load_remote_flow(project: dict[str, Any]) -> dict[str, Any] | None:
    chatflow_id = str(project.get("chatflow_id", "")).strip()
    if not chatflow_id:
        return None
    flowise_url = os.getenv("FLOWISE_URL", "").rstrip("/")
    flowise_key = os.getenv("FLOWISE_API_KEY", "")
    if flowise_url and flowise_key:
        headers = {"Authorization": f"Bearer {flowise_key}", "Accept": "application/json"}
        response = requests.get(f"{flowise_url}/api/v1/chatflows/{chatflow_id}", headers=headers, timeout=45)
        response.raise_for_status()
        payload = response.json()
        flow_data = payload.get("flowData")
        if isinstance(flow_data, str):
            return json.loads(flow_data)
        return flow_data if isinstance(flow_data, dict) else None

    snap = latest_snapshot_dir()
    if not snap:
        return None
    for folder in ("flowdata", "raw"):
        for candidate in (snap / folder).glob(f"*__{chatflow_id}.json"):
            data = read_json(candidate)
            if folder == "flowdata":
                return data
            flow_data = data.get("flowData")
            if isinstance(flow_data, str):
                return json.loads(flow_data)
            if isinstance(flow_data, dict):
                return flow_data
    return None


def publish_project(project_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    if payload.get("confirm") is not True:
        raise AdminError("Publishing requires confirm=true", 409)
    name, project = resolve_project(project_id)
    path = project_path(project)
    if not path or not path.exists():
        raise AdminError("Local JSON missing", 404)
    flow = read_json(path)
    validation = validate_flow(flow, require_publish_ready=True)
    if validation["errors"]:
        raise AdminError("Publish blocked: " + "; ".join(validation["errors"]), 400)
    backup = backup_project(name, reason="pre_publish")

    flowise_url = os.getenv("FLOWISE_URL", "").rstrip("/")
    flowise_key = os.getenv("FLOWISE_API_KEY", "")
    chatflow_id = str(project.get("chatflow_id", "")).strip()
    if not flowise_url or not flowise_key:
        append_audit_log(name, "publish_blocked", {"reason": "missing_flowise_credentials"})
        raise AdminError("FLOWISE_URL and FLOWISE_API_KEY are required to publish", 500)
    if not chatflow_id:
        raise AdminError("chatflow_id is required to publish", 400)

    headers = {
        "Authorization": f"Bearer {flowise_key}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
    current_resp = requests.get(f"{flowise_url}/api/v1/chatflows/{chatflow_id}", headers=headers, timeout=45)
    current_resp.raise_for_status()
    current = current_resp.json()
    flow_data = {
        "nodes": flow.get("nodes", []),
        "edges": flow.get("edges", []),
        "viewport": flow.get("viewport") or parse_flow_data(current).get("viewport") or {"x": 0, "y": 0, "zoom": 1},
    }
    update_payload = {
        "name": current.get("name", name),
        "flowData": json.dumps(flow_data, ensure_ascii=False),
        "deployed": current.get("deployed", True),
        "isPublic": current.get("isPublic"),
        "apikeyid": current.get("apikeyid"),
        "chatbotConfig": current.get("chatbotConfig"),
        "apiConfig": current.get("apiConfig"),
        "analytic": current.get("analytic"),
        "speechToText": current.get("speechToText"),
        "category": current.get("category", project.get("category")),
        "type": current.get("type", project.get("type", "AGENTFLOW")),
    }
    publish_resp = requests.put(
        f"{flowise_url}/api/v1/chatflows/{chatflow_id}",
        headers=headers,
        data=json.dumps(update_payload, ensure_ascii=False).encode("utf-8"),
        timeout=60,
    )
    publish_resp.raise_for_status()
    append_audit_log(name, "publish", {"chatflow_id": chatflow_id, "backup": backup["backup"]})
    return {
        "ok": True,
        "project": name,
        "chatflow_id": chatflow_id,
        "backup": backup,
        "published_at": utc_now(),
        "validation": validation,
    }


def parse_flow_data(current: dict[str, Any]) -> dict[str, Any]:
    flow_data = current.get("flowData")
    if isinstance(flow_data, str):
        try:
            return json.loads(flow_data)
        except json.JSONDecodeError:
            return {}
    return flow_data if isinstance(flow_data, dict) else {}


def append_audit_log(project: str, action: str, details: dict[str, Any]) -> None:
    ADMIN_DIR.mkdir(parents=True, exist_ok=True)
    record = {
        "timestamp": utc_now(),
        "project": project,
        "action": action,
        "details": details,
    }
    with AUDIT_LOG.open("a", encoding="utf-8", newline="\n") as handle:
        handle.write(json.dumps(record, ensure_ascii=False) + "\n")


def read_audit_log(project: str | None = None, limit: int = 100) -> list[dict[str, Any]]:
    if not AUDIT_LOG.exists():
        return []
    records = []
    with AUDIT_LOG.open("r", encoding="utf-8") as handle:
        for line in handle:
            try:
                item = json.loads(line)
            except json.JSONDecodeError:
                continue
            if project and item.get("project") != project:
                continue
            records.append(item)
    return list(reversed(records[-limit:]))
