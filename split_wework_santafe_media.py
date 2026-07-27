#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Separa la variante de We Work Santa Fe con imágenes en un chatflow nuevo y
restaura el chatflow original al estado versionado anterior.

La operación es reejecutable: si projects.json ya contiene el nuevo ID, lo
reutiliza en vez de crear otro chatflow.
"""
import io
import json
import os
import subprocess
import sys
import uuid
from urllib.error import HTTPError
from urllib.request import Request, urlopen


CONFIG_PATH = "projects.json"
SOURCE_PATH = "projects/WE WORK Agents.json"
NEW_PATH = "projects/We Work Santa Fe Directorio Agents.json"
SOURCE_ID = "987464b9-dec9-416c-a007-165c91b8848c"
NEW_PROJECT_KEY = "We Work Santa Fe Directorio"
NEW_NAME = "We Work Santa Fe - Directorio"
VERIFY_RESPONSES = "--verify-responses" in sys.argv

with io.open(CONFIG_PATH, encoding="utf-8") as file:
    config = json.load(file)

base_url = config.get("flowise_url", "https://ecoflow.koppi.mx")
api_key = os.environ.get(
    "FLOWISE_API_KEY",
    "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8",
)
headers = {
    "Authorization": f"Bearer {api_key}",
    "Accept": "application/json",
    "Content-Type": "application/json",
}


def api_request(method, endpoint, body=None, timeout=90):
    payload = None if body is None else json.dumps(body, ensure_ascii=False).encode("utf-8")
    request = Request(endpoint, data=payload, headers=headers, method=method)
    try:
        with urlopen(request, timeout=timeout) as response:
            raw = response.read().decode("utf-8")
            return response.status, json.loads(raw) if raw else {}
    except HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        print(f"HTTP {error.code}: {detail[:800]}", file=sys.stderr)
        raise


def get_chatflow(chatflow_id):
    _, result = api_request(
        "GET",
        f"{base_url}/api/v1/chatflows/{chatflow_id}",
        timeout=30,
    )
    return result


def prompt_text(flow):
    for node in flow.get("nodes", []):
        data = node.get("data", {})
        if "Q&A" not in data.get("label", ""):
            continue
        messages = data.get("inputs", {}).get("agentMessages", [])
        if messages:
            return messages[0].get("content", "")
    raise RuntimeError("No se encontró el prompt del agente Q&A")


def load_git_baseline():
    raw = subprocess.check_output(
        ["git", "show", "HEAD:projects/WE WORK Agents.json"],
        text=True,
        encoding="utf-8",
    )
    return json.loads(raw)


source = get_chatflow(SOURCE_ID)
registered = config.get("projects", {}).get(NEW_PROJECT_KEY, {})
new_id = str(registered.get("chatflow_id", "")).strip()
if new_id:
    existing = get_chatflow(new_id)
    media_flow = json.loads(existing["flowData"])
    if "LINKS Y MEDIOS — CLASIFICACIÓN OBLIGATORIA" not in prompt_text(media_flow):
        raise RuntimeError(f"El ID registrado {new_id} no contiene la variante con imágenes")
    print(f"Reutilizando chatflow existente: {new_id}")
else:
    media_flow = json.loads(source["flowData"])
    media_prompt = prompt_text(media_flow)
    if "LINKS Y MEDIOS — CLASIFICACIÓN OBLIGATORIA" not in media_prompt:
        raise RuntimeError("El chatflow origen no contiene la variante con imágenes para separar")

baseline_flow = load_git_baseline()
baseline_prompt = prompt_text(baseline_flow)
if "BOTONES DE LINKS — OBLIGATORIO" not in baseline_prompt:
    raise RuntimeError("El baseline de Git no contiene la versión previa de botones")
if "LINKS Y MEDIOS — CLASIFICACIÓN OBLIGATORIA" in baseline_prompt:
    raise RuntimeError("El baseline de Git ya contiene la variante con imágenes")

if not new_id:
    payload = {
        "name": NEW_NAME,
        "flowData": json.dumps(media_flow, ensure_ascii=False),
        "deployed": source.get("deployed", True),
        "isPublic": source.get("isPublic", False),
    }
    for key in (
        "chatbotConfig",
        "apiConfig",
        "analytic",
        "speechToText",
        "textToSpeech",
        "category",
        "type",
    ):
        if source.get(key) is not None:
            payload[key] = source[key]

    status, created = api_request(
        "POST",
        f"{base_url}/api/v1/chatflows",
        body=payload,
        timeout=90,
    )
    if status not in (200, 201):
        raise RuntimeError(f"No se pudo crear el chatflow: HTTP {status}")
    new_id = str(created.get("id", "")).strip()
    if not new_id:
        raise RuntimeError("Flowise creó el chatflow sin devolver un ID")

    created_flow = json.loads(get_chatflow(new_id)["flowData"])
    if "LINKS Y MEDIOS — CLASIFICACIÓN OBLIGATORIA" not in prompt_text(created_flow):
        raise RuntimeError("La verificación del chatflow nuevo no encontró la variante con imágenes")
    print(f"Chatflow nuevo creado: {new_id}")

restore_payload = {"flowData": json.dumps(baseline_flow, ensure_ascii=False)}
for key in (
    "name",
    "deployed",
    "isPublic",
    "chatbotConfig",
    "apiConfig",
    "analytic",
    "speechToText",
    "textToSpeech",
    "category",
    "type",
):
    if source.get(key) is not None:
        restore_payload[key] = source[key]

status, _ = api_request(
    "PUT",
    f"{base_url}/api/v1/chatflows/{SOURCE_ID}",
    body=restore_payload,
    timeout=90,
)
if status != 200:
    raise RuntimeError(f"No se pudo restaurar Santa Fe: HTTP {status}")

restored_flow = json.loads(get_chatflow(SOURCE_ID)["flowData"])
restored_prompt = prompt_text(restored_flow)
if "BOTONES DE LINKS — OBLIGATORIO" not in restored_prompt:
    raise RuntimeError("La verificación del ID original no encontró la versión previa")
if "LINKS Y MEDIOS — CLASIFICACIÓN OBLIGATORIA" in restored_prompt:
    raise RuntimeError("El ID original todavía contiene la variante con imágenes")

with io.open(NEW_PATH, "w", encoding="utf-8") as file:
    json.dump(media_flow, file, ensure_ascii=False, indent=2)
with io.open(SOURCE_PATH, "w", encoding="utf-8") as file:
    json.dump(baseline_flow, file, ensure_ascii=False, indent=2)

config.setdefault("projects", {})[NEW_PROJECT_KEY] = {
    "chatflow_id": new_id,
    "json_file": NEW_PATH,
    "type": source.get("type", "AGENTFLOW"),
    "category": source.get("category") or "coworking",
}
with io.open(CONFIG_PATH, "w", encoding="utf-8") as file:
    json.dump(config, file, ensure_ascii=False, indent=2)

print(f"ID original restaurado: {SOURCE_ID}")
print(f"Nuevo ID con imagenes: {new_id}")
print(f"Chat nuevo: {base_url}/chat/{new_id}")

if VERIFY_RESPONSES:
    question = "Muéstrame el Directorio de empresas de Baltra y DiDi."
    answers = {}
    for label, chatflow_id in (("original", SOURCE_ID), ("directorio", new_id)):
        session_id = f"verify_wework_split_{label}_{uuid.uuid4().hex}"
        _, prediction = api_request(
            "POST",
            f"{base_url}/api/v1/prediction/{chatflow_id}",
            body={
                "question": question,
                "overrideConfig": {"sessionId": session_id},
            },
            timeout=180,
        )
        answers[label] = prediction.get("text", "")

    checks = {
        "original_without_images": "<img " not in answers["original"],
        "original_without_thumbnails": "drive.google.com/thumbnail" not in answers["original"],
        "new_with_two_images": answers["directorio"].count("<img ") >= 2,
        "new_with_baltra": "13QklhSekhq1wiCi8sQ_O9URLYH02RZE2" in answers["directorio"],
        "new_with_didi": "1XKl12GzyIdDPdwXMEweCSCwpdh7-RMnC" in answers["directorio"],
    }
    print("Verificacion de respuestas:", checks)
    if not all(checks.values()):
        print(f"Original: {answers['original'][:1000]}", file=sys.stderr)
        print(f"Directorio: {answers['directorio'][:1000]}", file=sys.stderr)
        sys.exit(1)
