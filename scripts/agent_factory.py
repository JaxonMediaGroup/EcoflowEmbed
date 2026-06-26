"""agent_factory.py — Create or update EcoFlow agentflows from the standard template.

Template base: projects/Volterra Agents.json (HTML canonical prompts).
Modelo default: gpt-5.4.

MODO CREAR:
    python scripts/agent_factory.py create "Nombre Proyecto" DOC_ID \\
        [--category real-estate] [--model gpt-5.4] [--source-project Volterra] \\
        [--funnel] [--calendar URL] [--second-doc DOC_ID] [--local-only]

MODO ACTUALIZAR:
    python scripts/agent_factory.py update "Nombre Proyecto" \\
        [--doc NEW_ID] [--funnel] [--calendar URL] [--second-doc DOC_ID] \\
        [--model gpt-5.4] [--local-only] [--dry-run]

--local-only  : solo genera/edita el JSON local, sin crear chatflow ni subir a ecoflow.
--dry-run     : (modo update) aplica cambios al JSON local pero NO hace push.

El flujo completo (sin --local-only):
  1. Genera/actualiza el JSON local.
  2. Crea el chatflow en ecoflow (solo modo create) y lo registra en projects.json.
  3. Hace push (inyecta credencial OpenAI de projects.json y sube el flowData).
"""

from __future__ import annotations

import argparse
import copy
import json
import os
import sys
from pathlib import Path
from typing import Any

try:
    import requests
except ImportError:  # pragma: no cover
    requests = None  # type: ignore


ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "projects.json"

# ---------------------------------------------------------------------------
# Template base y constantes
# ---------------------------------------------------------------------------

TEMPLATE_PROJECT = "Volterra"
TEMPLATE_FILE = ROOT / "projects" / "Volterra Agents.json"
TEMPLATE_DOC_ID = "1T97hAvHvDQ-umekGkeHPD9LheZIU8BPAStoCrDCvtgg"

# Modelo OpenAI por defecto para TODOS los nuevos agentes.
DEFAULT_MODEL = "gpt-5.4"
VALID_MODELS = {"gpt-5.4", "gpt-5.2", "gpt-5.1", "gpt-4.1"}

# Categorías válidas en projects.json.
VALID_CATEGORIES = {
    "real-estate", "commercial", "industrial", "hospitality",
    "education", "coworking", "tech", "aviation", "crm",
}

# IDs de nodo canónicos del template (no cambian entre proyectos).
NODE_QA = "agentAgentflow_0"
NODE_ROUTER = "conditionAgentAgentflow_0"
NODE_SALES = "agentAgentflow_1"
NODE_OFFTOPIC = "agentAgentflow_2"

# Nodos que tienen configuración de modelo OpenAI (agentModelConfig / conditionAgentModelConfig).
MODEL_CONFIG_KEYS = ("agentModelConfig", "conditionAgentModelConfig")


# ---------------------------------------------------------------------------
# Prompts canónicos en HTML (extraídos de Volterra). {PROJECT} se reemplaza.
# {PROJECT_LOWER} se usa donde el original usaba minúsculas (ej. valor $project).
# ---------------------------------------------------------------------------

# Marcador de inserción para el sales funnel (se inserta en el prompt Q&A antes
# de las secciones anti-alucinación).
FUNNEL_MARKER = "SALES FUNNEL - CTA STRATEGY"
CALENDAR_MARKER = "CALENDAR_LINK"


def _doc_url(doc_id: str) -> str:
    return f"https://docs.google.com/document/d/{doc_id}/export?format=txt"


def project_json_name(project_name: str) -> str:
    return f"projects/{project_name} Agents.json"


def project_slug(project_name: str) -> str:
    """Slug en minúsculas para el valor $project del sales agent (ej. 'volterra')."""
    return project_name.lower().strip()


# ---------------------------------------------------------------------------
# Utilidades de navegación del flow
# ---------------------------------------------------------------------------

def load_flow(path: Path) -> dict:
    with path.open("r", encoding="utf-8-sig") as handle:
        return json.load(handle)


def save_flow(path: Path, flow: dict) -> None:
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        json.dump(flow, handle, ensure_ascii=False, indent=2)
        handle.write("\n")


def node_by_id(flow: dict, node_id: str) -> dict:
    for node in flow.get("nodes", []):
        if node.get("id") == node_id:
            return node
    raise ValueError(f"Nodo faltante: {node_id}")


def system_message(node: dict) -> dict:
    messages = node["data"]["inputs"].get("agentMessages", [])
    for message in messages:
        if message.get("role") == "system":
            return message
    raise ValueError(f"Nodo sin system message: {node.get('id')}")


def replace_in_object(obj: Any, replacements: dict[str, str]) -> Any:
    """Reemplaza recursivamente cada ocurrencia de las claves por su valor."""
    if isinstance(obj, str):
        for old, new in replacements.items():
            obj = obj.replace(old, new)
        return obj
    if isinstance(obj, list):
        return [replace_in_object(item, replacements) for item in obj]
    if isinstance(obj, dict):
        return {key: replace_in_object(value, replacements) for key, value in obj.items()}
    return obj


def set_model(flow: dict, model: str) -> int:
    """Sobreescribe modelName en todos los nodos con config de modelo."""
    if model not in VALID_MODELS:
        raise ValueError(f"Modelo inválido '{model}'. Válidos: {sorted(VALID_MODELS)}")
    count = 0
    for node in flow.get("nodes", []):
        inputs = node.get("data", {}).get("inputs", {})
        for cfg_key in MODEL_CONFIG_KEYS:
            cfg = inputs.get(cfg_key)
            if isinstance(cfg, dict) and cfg.get("modelName"):
                cfg["modelName"] = model
                count += 1
    return count


def get_current_model(flow: dict) -> str | None:
    """Devuelve el modelName del primer nodo con config de modelo."""
    for node in flow.get("nodes", []):
        inputs = node.get("data", {}).get("inputs", {})
        for cfg_key in MODEL_CONFIG_KEYS:
            cfg = inputs.get(cfg_key)
            if isinstance(cfg, dict) and cfg.get("modelName"):
                return cfg.get("modelName")
    return None


def count_request_get_tools(flow: dict) -> int:
    """Cuenta cuántas herramientas requestsGet tiene el nodo Q&A."""
    try:
        qa = node_by_id(flow, NODE_QA)
    except ValueError:
        return 0
    count = 0
    for tool in qa["data"]["inputs"].get("agentTools", []):
        cfg = tool.get("agentSelectedToolConfig", {})
        if cfg.get("agentSelectedTool") == "requestsGet":
            count += 1
    return count


def has_funnel(qa_content: str) -> bool:
    return FUNNEL_MARKER in qa_content


def has_calendar(qa_content: str) -> bool:
    return CALENDAR_MARKER in qa_content or "{{CALENDAR_LINK}}" in qa_content


# ---------------------------------------------------------------------------
# Bloques de texto para módulos opcionales
# ---------------------------------------------------------------------------

def funnel_block(project_name: str) -> str:
    """Sales funnel / CTA progresivo para el prompt Q&A (HTML)."""
    p = project_name
    return (
        f"<p><strong>🎯 {FUNNEL_MARKER} (MANDATORY):</strong></p>"
        "<p>Cuenta el número de mensajes del USUARIO en el historial. "
        "Cada mensaje = 1 pregunta. Sigue esta progresión:</p>"
        "<ol>"
        "<li><p><strong>Preguntas 1-2 (Warm-up):</strong> Responde cálidamente. "
        "Termina con un CTA suave invitando a explorar más:</p>"
        "<p>ES: \"¿Te gustaría conocer más sobre las amenidades o la ubicación?\"  <br>"
        "EN: \"Would you like to know more about the amenities or location?\"</p></li>"
        f"<li><p><strong>Preguntas 3-4 (Value push):</strong> Responde y destaca la exclusividad con un CTA más fuerte:</p>"
        f"<p>ES: \"{p} es uno de los desarrollos más exclusivos de la zona. ¿Te gustaría que un asesor te comparta las opciones disponibles y precios actualizados?\"  <br>"
        f"EN: \"{p} is one of the most exclusive developments in the area. Would you like an advisor to share available options and updated pricing?\"</p></li>"
        "<li><p><strong>Pregunta 5+ (Lead capture):</strong> SIEMPRE responde la pregunta primero, luego SIEMPRE agrega este mensaje amable (adaptado al idioma del usuario):</p>"
        "<p>ES: \"Veo que estás muy interesado en conocer más sobre el desarrollo. Para darte información más detallada y personalizada, puedo ponerte en contacto con uno de nuestros asesores. Solo déjame tu nombre, teléfono y correo, y en breve te contactarán para ayudarte con todo lo que necesites.\"  <br>"
        "EN: \"I can see you're really interested in learning more about the development. To give you more detailed and personalized information, I can connect you with one of our advisors. Just leave me your name, phone, and email, and they'll contact you shortly.\"  <br>"
        "FR: \"Je vois que vous êtes très intéressé par le développement. Pour vous donner des informations plus détaillées et personnalisées, je peux vous mettre en contact avec l'un de nos conseillers. Laissez-moi votre nom, téléphone et email.\"</p></li>"
        "</ol>"
        "<p><strong>IMPORTANTE:</strong> Después de la pregunta 5, incluye el mensaje de captura de lead en CADA respuesta, aunque el usuario siga preguntando.</p>"
    )


def calendar_block(url: str) -> str:
    """Bloque de calendar link para el prompt Q&A (HTML)."""
    safe = url.replace("&", "&amp;")
    return (
        f"<p><strong>📅 {CALENDAR_MARKER}:</strong> Cuando ofrezcas agendar una cita, "
        f"presentala como enlace/botón clicable: "
        f"<a href=\"{safe}\">{safe}</a></p>"
    )


def inject_qa_section(qa_content: str, new_block: str) -> str:
    """Inserta new_block en el prompt Q&A antes de la primera sección
    anti-alucinación (ANTI-INFERENCIA), que es donde va la lógica comercial."""
    anchor = "<p><strong>🚫 ANTI-INFERENCIA:</strong></p>"
    if anchor not in qa_content:
        # fallback: insertar al final
        return qa_content + new_block
    idx = qa_content.index(anchor)
    return qa_content[:idx] + new_block + qa_content[idx:]


# ---------------------------------------------------------------------------
# Construcción del flow (modo create)
# ---------------------------------------------------------------------------

def build_flow(
    project_name: str,
    doc_id: str,
    *,
    model: str = DEFAULT_MODEL,
    funnel: bool = False,
    calendar_url: str | None = None,
    second_doc_id: str | None = None,
) -> dict:
    flow = copy.deepcopy(load_flow(TEMPLATE_FILE))

    replacements = {
        TEMPLATE_PROJECT: project_name,
        # el sales agent usa el valor $project en minúsculas ("volterra")
        f'el valor "volterra"': f'el valor "{project_slug(project_name)}"',
    }
    template_url = _doc_url(TEMPLATE_DOC_ID)
    target_url = _doc_url(doc_id)

    # 1. Reemplazar nombre del proyecto en TODO el flow (labels, prompts,
    #    router scenarios y la copia espejo en inputParams[*].default).
    flow = replace_in_object(flow, replacements)

    # 2. Apuntar el info_get al documento objetivo.
    qa = node_by_id(flow, NODE_QA)
    qa_inputs = qa["data"]["inputs"]
    tool_url_updated = False
    for tool in qa_inputs.get("agentTools", []):
        cfg = tool.get("agentSelectedToolConfig", {})
        if cfg.get("agentSelectedTool") == "requestsGet":
            cfg["requestsGetUrl"] = f"<p>{target_url}</p>"
            cfg["requestsGetDescription"] = cfg.get("requestsGetDescription", "").replace(
                template_url, target_url
            )
            tool_url_updated = True
    if not tool_url_updated:
        raise ValueError("No se encontró la herramienta requestsGet en el nodo Q&A")

    # 3. Segundo documento opcional (clona la herramienta info_get existente).
    if second_doc_id:
        existing = None
        for tool in qa_inputs.get("agentTools", []):
            cfg = tool.get("agentSelectedToolConfig", {})
            if cfg.get("agentSelectedTool") == "requestsGet":
                existing = tool
                break
        if existing is not None:
            second = copy.deepcopy(existing)
            second_cfg = second["agentSelectedToolConfig"]
            second_cfg["requestsGetUrl"] = f"<p>{_doc_url(second_doc_id)}</p>"
            second_cfg["requestsGetDescription"] = (
                f"Secondary source for official {project_name} information. "
                "Use when the primary source does not contain the answer."
            )
            qa_inputs["agentTools"].append(second)

    # 4. Módulos opcionales del prompt Q&A.
    qa_msg = system_message(qa)
    if funnel:
        qa_msg["content"] = inject_qa_section(qa_msg["content"], funnel_block(project_name))
    if calendar_url:
        qa_msg["content"] = inject_qa_section(qa_msg["content"], calendar_block(calendar_url))

    # 5. Modelo OpenAI.
    set_model(flow, model)

    # 6. Labels de los 4 nodos (el replace_in_object ya puso el nombre;
    #    nos aseguramos del formato "<Project> <Rol>").
    for node_id, suffix in [
        (NODE_QA, "Multilingual Q&A"),
        (NODE_ROUTER, "Intent Router"),
        (NODE_SALES, "Lead Agent"),
        (NODE_OFFTOPIC, "Off-Topic Guard"),
    ]:
        node = node_by_id(flow, node_id)
        node["data"]["label"] = f"{project_name} {suffix}"

    validate_flow(flow, project_name, doc_id)
    return flow


# ---------------------------------------------------------------------------
# Actualización del flow (modo update)
# ---------------------------------------------------------------------------

def update_flow(
    flow: dict,
    project_name: str,
    *,
    doc_id: str | None = None,
    funnel: bool = False,
    calendar_url: str | None = None,
    second_doc_id: str | None = None,
    model: str | None = None,
) -> dict:
    flow = copy.deepcopy(flow)

    if model:
        set_model(flow, model)

    qa = node_by_id(flow, NODE_QA)
    qa_msg = system_message(qa)

    if doc_id:
        qa_inputs = qa["data"]["inputs"]
        target_url = _doc_url(doc_id)
        updated = False
        for tool in qa_inputs.get("agentTools", []):
            cfg = tool.get("agentSelectedToolConfig", {})
            if cfg.get("agentSelectedTool") == "requestsGet":
                cfg["requestsGetUrl"] = f"<p>{target_url}</p>"
                updated = True
        if not updated:
            raise ValueError("No se encontró requestsGet para actualizar el documento")

    if funnel and not has_funnel(qa_msg["content"]):
        qa_msg["content"] = inject_qa_section(qa_msg["content"], funnel_block(project_name))

    if calendar_url and not has_calendar(qa_msg["content"]):
        qa_msg["content"] = inject_qa_section(qa_msg["content"], calendar_block(calendar_url))

    if second_doc_id:
        qa_inputs = qa["data"]["inputs"]
        existing_ids = {
            t.get("agentSelectedToolConfig", {}).get("requestsGetUrl", "")
            for t in qa_inputs.get("agentTools", [])
        }
        new_url = f"<p>{_doc_url(second_doc_id)}</p>"
        if new_url not in existing_ids:
            template = None
            for tool in qa_inputs.get("agentTools", []):
                cfg = tool.get("agentSelectedToolConfig", {})
                if cfg.get("agentSelectedTool") == "requestsGet":
                    template = tool
                    break
            if template is not None:
                second = copy.deepcopy(template)
                second["agentSelectedToolConfig"]["requestsGetUrl"] = new_url
                second["agentSelectedToolConfig"]["requestsGetDescription"] = (
                    f"Secondary source for official {project_name} information."
                )
                qa_inputs["agentTools"].append(second)

    return flow


# ---------------------------------------------------------------------------
# Validación
# ---------------------------------------------------------------------------

def validate_flow(flow: dict, project_name: str, doc_id: str | None = None) -> None:
    nodes = flow.get("nodes", [])
    edges = flow.get("edges", [])
    node_ids = [n.get("id") for n in nodes]

    if len(node_ids) != len(set(node_ids)):
        raise ValueError("IDs de nodo duplicados")
    if len(nodes) != 5 or len(edges) != 4:
        raise ValueError(f"Topología inesperada: {len(nodes)} nodos, {len(edges)} edges")

    blob = json.dumps(flow, ensure_ascii=False)
    if TEMPLATE_DOC_ID in blob:
        raise ValueError("Quedan referencias al doc ID del template (Volterra)")
    # El nombre "Volterra" puede aparecer dentro de "gpt" u otros sitios; validamos
    # solo la aparición aislada en labels/prompts buscando el patrón con espacios.
    if "Volterra " in blob or "Volterra." in blob or "Volterra," in blob or ">Volterra<" in blob:
        raise ValueError("Quedan referencias al nombre del template (Volterra)")

    if doc_id and doc_id not in blob:
        raise ValueError("El doc ID objetivo no quedó aplicado")

    for edge in edges:
        if edge.get("source") not in node_ids or edge.get("target") not in node_ids:
            raise ValueError(f"Edge roto: {edge.get('id')}")

    for required in (NODE_QA, NODE_ROUTER, NODE_SALES, NODE_OFFTOPIC):
        if required not in node_ids:
            raise ValueError(f"Nodo canónico faltante: {required}")


# ---------------------------------------------------------------------------
# projects.json
# ---------------------------------------------------------------------------

def load_config() -> dict:
    with CONFIG_PATH.open("r", encoding="utf-8-sig") as handle:
        return json.load(handle)


def save_config(config: dict) -> None:
    with CONFIG_PATH.open("w", encoding="utf-8", newline="\n") as handle:
        json.dump(config, handle, ensure_ascii=False, indent=2)
        handle.write("\n")


def register_project(config: dict, project_name: str, chatflow_id: str, category: str) -> bool:
    projects = config.setdefault("projects", {})
    if project_name in projects and projects[project_name].get("chatflow_id") == chatflow_id:
        return False
    projects[project_name] = {
        "chatflow_id": chatflow_id,
        "json_file": project_json_name(project_name),
        "type": "AGENTFLOW",
        "category": category,
    }
    return True


# ---------------------------------------------------------------------------
# Integración con ecoflow (crear chatflow + push)
# ---------------------------------------------------------------------------

def _api_key(config: dict) -> str:
    api_key = os.environ.get("FLOWISE_API_KEY", "").strip()
    if api_key:
        return api_key
    # Fallback histórico de push.py.
    return "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"


def _headers(api_key: str) -> dict:
    return {
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }


def create_chatflow(
    config: dict,
    project_name: str,
    flow: dict,
    source_project: str,
    category: str,
) -> str:
    """Crea un chatflow nuevo en ecoflow y devuelve su id."""
    if requests is None:
        raise RuntimeError("requests no instalado; usa --local-only")
    source = config["projects"].get(source_project)
    if not source:
        raise SystemExit(f"Proyecto origen desconocido: {source_project}")

    flowise_url = config.get("flowise_url", "https://ecoflow.koppi.mx").rstrip("/")
    headers = _headers(_api_key(config))

    r = requests.get(
        f"{flowise_url}/api/v1/chatflows/{source['chatflow_id']}",
        headers=headers,
        timeout=45,
    )
    r.raise_for_status()
    source_remote = r.json()

    flow_data = {
        "nodes": flow.get("nodes", []),
        "edges": flow.get("edges", []),
        "viewport": flow.get("viewport", {"x": 0, "y": 0, "zoom": 1}),
    }
    payload = {
        "name": project_name,
        "flowData": json.dumps(flow_data, ensure_ascii=False),
        "deployed": source_remote.get("deployed", True),
        "isPublic": source_remote.get("isPublic", False),
        "apikeyid": source_remote.get("apikeyid"),
        "chatbotConfig": source_remote.get("chatbotConfig"),
        "apiConfig": source_remote.get("apiConfig"),
        "analytic": source_remote.get("analytic"),
        "speechToText": source_remote.get("speechToText"),
        "category": category,
        "type": source_remote.get("type", "AGENTFLOW"),
    }
    cr = requests.post(
        f"{flowise_url}/api/v1/chatflows",
        headers=headers,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        timeout=60,
    )
    cr.raise_for_status()
    created = cr.json()
    created_id = str(created.get("id", "")).strip()
    if not created_id:
        raise RuntimeError(f"Flowise no devolvió id: {created}")
    return created_id


def inject_credentials(flow: dict, credential_id: str) -> int:
    """Inyecta FLOWISE_CREDENTIAL_ID en los configs de modelo chatOpenAI."""
    injected = 0
    for node in flow.get("nodes", []):
        inputs = node.get("data", {}).get("inputs", {})
        for cfg_key in MODEL_CONFIG_KEYS:
            cfg = inputs.get(cfg_key, {})
            model_key = "agentModel" if cfg_key == "agentModelConfig" else "conditionAgentModel"
            if cfg and cfg.get(model_key) == "chatOpenAI":
                cfg["FLOWISE_CREDENTIAL_ID"] = credential_id
                injected += 1
    return injected


def push_chatflow(config: dict, project_name: str, flow: dict) -> None:
    """Sube el flowData a un chatflow existente."""
    if requests is None:
        raise RuntimeError("requests no instalado; usa --local-only")
    project = config["projects"].get(project_name)
    if not project:
        raise SystemExit(f"Proyecto no registrado en projects.json: {project_name}")

    chatflow_id = project["chatflow_id"]
    flowise_url = config.get("flowise_url", "https://ecoflow.koppi.mx").rstrip("/")
    credential_id = config.get("openai_credential_id", "10ca0bac-6033-4f4f-aff2-d5c35aef4580")
    headers = _headers(_api_key(config))

    injected = inject_credentials(flow, credential_id)
    print(f"  Credenciales inyectadas: {injected}")

    flow_data_str = json.dumps(flow, ensure_ascii=False)
    update_body = {"flowData": flow_data_str}

    r = requests.get(
        f"{flowise_url}/api/v1/chatflows/{chatflow_id}", headers=headers, timeout=45
    )
    if r.status_code != 200:
        raise SystemExit(f"No se pudo obtener el chatflow: {r.status_code} {r.text[:200]}")
    current = r.json()
    for key in ("chatbotConfig", "apiConfig", "analytic", "speechToText", "category", "type"):
        if current.get(key):
            update_body[key] = current[key]

    r2 = requests.put(
        f"{flowise_url}/api/v1/chatflows/{chatflow_id}",
        headers=headers,
        json=update_body,
        timeout=60,
    )
    if r2.status_code != 200:
        raise SystemExit(f"Push fallido: {r2.status_code}\n{r2.text[:500]}")
    print(f"  Push exitoso: {project_name}")


# ---------------------------------------------------------------------------
# Reporte de estado (detección de módulos)
# ---------------------------------------------------------------------------

def report_modules(flow: dict) -> None:
    qa = node_by_id(flow, NODE_QA)
    content = system_message(qa)["content"]
    model = get_current_model(flow)
    tools = count_request_get_tools(flow)

    print("  Estado actual del agente:")
    print(f"    Modelo:           {model or '(desconocido)'}")
    print(f"    Fuentes info_get: {tools}")
    print(f"    Sales funnel:     {'sí' if has_funnel(content) else 'no'}")
    print(f"    Calendar link:    {'sí' if has_calendar(content) else 'no'}")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def cmd_create(args: argparse.Namespace) -> None:
    project_name = args.name
    doc_id = args.doc_id
    if args.model not in VALID_MODELS:
        raise SystemExit(f"Modelo inválido. Válidos: {sorted(VALID_MODELS)}")
    if args.category not in VALID_CATEGORIES:
        raise SystemExit(f"Categoría inválida. Válidas: {sorted(VALID_CATEGORIES)}")

    output_path = ROOT / project_json_name(project_name)
    if output_path.exists():
        raise SystemExit(f"Ya existe {output_path}. Usa 'update' para modificarlo.")

    print(f"Creando agente: {project_name}")
    flow = build_flow(
        project_name,
        doc_id,
        model=args.model,
        funnel=args.funnel,
        calendar_url=args.calendar,
        second_doc_id=args.second_doc,
    )
    save_flow(output_path, flow)
    print(f"  JSON generado: {output_path}")
    print(f"  Documento: {_doc_url(doc_id)}")
    report_modules(flow)

    if args.local_only:
        print("\n[--local-only] No se creó chatflow ni se subió a ecoflow.")
        return

    config = load_config()
    print("\nCreando chatflow en ecoflow...")
    chatflow_id = create_chatflow(
        config, project_name, flow, args.source_project, args.category
    )
    print(f"  Chatflow creado: {chatflow_id}")

    registered = register_project(config, project_name, chatflow_id, args.category)
    save_config(config)
    print(f"  Registrado en projects.json: {'sí' if registered else 'ya existía'}")

    print("\nHaciendo push...")
    push_chatflow(config, project_name, flow)


def cmd_update(args: argparse.Namespace) -> None:
    project_name = args.name
    if args.model and args.model not in VALID_MODELS:
        raise SystemExit(f"Modelo inválido. Válidos: {sorted(VALID_MODELS)}")

    output_path = ROOT / project_json_name(project_name)
    if not output_path.exists():
        raise SystemExit(f"No existe {output_path}. Usa 'create' primero.")

    config = load_config()
    if project_name not in config.get("projects", {}):
        print(f"  [aviso] '{project_name}' no está en projects.json; --local-only implícito.")
        args.local_only = True

    flow = load_flow(output_path)
    print(f"Actualizando agente: {project_name}")
    report_modules(flow)

    flow = update_flow(
        flow,
        project_name,
        doc_id=args.doc,
        funnel=args.funnel,
        calendar_url=args.calendar,
        second_doc_id=args.second_doc,
        model=args.model,
    )

    # Validar que el doc principal siga presente (si se cambió, validar el nuevo).
    save_flow(output_path, flow)
    print("  JSON actualizado.")
    report_modules(flow)

    if args.local_only or args.dry_run:
        label = "[--local-only]" if args.local_only else "[--dry-run]"
        print(f"\n{label} No se hizo push a ecoflow.")
        return

    print("\nHaciendo push...")
    push_chatflow(config, project_name, flow)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Crea o actualiza agentes EcoFlow desde el template Volterra.",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    common_optional = [
        ("--funnel", {"action": "store_true", "help": "Agregar sales funnel / CTA progresivo"}),
        ("--calendar", {"metavar": "URL", "help": "Agregar calendar link con esta URL"}),
        ("--second-doc", {"metavar": "DOC_ID", "help": "Agregar una segunda fuente info_get"}),
        ("--model", {"default": None, "help": "Modelo OpenAI (default gpt-5.4)"}),
    ]

    p_create = sub.add_parser("create", help="Crear un agente nuevo")
    p_create.add_argument("name", help="Nombre del proyecto")
    p_create.add_argument("doc_id", help="ID del Google Doc principal")
    p_create.add_argument("--category", default="real-estate")
    p_create.add_argument("--source-project", default=TEMPLATE_PROJECT,
                          help="Proyecto del que copiar metadata remota (default Volterra)")
    p_create.add_argument("--local-only", action="store_true",
                          help="Solo generar JSON, sin crear chatflow ni subir")
    for flag, kwargs in common_optional:
        p_create.add_argument(flag, **kwargs)
    p_create.set_defaults(func=cmd_create, model_default=DEFAULT_MODEL)

    p_update = sub.add_parser("update", help="Actualizar un agente existente")
    p_update.add_argument("name", help="Nombre del proyecto")
    p_update.add_argument("--doc", metavar="DOC_ID", help="Nuevo ID de Google Doc principal")
    p_update.add_argument("--local-only", action="store_true",
                          help="Solo editar JSON, sin push")
    p_update.add_argument("--dry-run", action="store_true",
                          help="Editar JSON local pero sin push")
    for flag, kwargs in common_optional:
        p_update.add_argument(flag, **kwargs)
    p_update.set_defaults(func=cmd_update)

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    # default de modelo solo para create
    if args.command == "create" and args.model is None:
        args.model = DEFAULT_MODEL
    args.func(args)


if __name__ == "__main__":
    main()
