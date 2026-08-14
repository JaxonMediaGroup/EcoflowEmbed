#!/usr/bin/env python3
"""Construye el flow WeWork Santa Fe en Langflow via API."""
import json, sys, urllib.request, urllib.error, urllib.parse

BASE = "https://strapi-langflow.tsiek2.easypanel.host"

def api(method, path, token, data=None):
    url = BASE + path
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, method=method)
    req.add_header("Content-Type", "application/json")
    if token:
        req.add_header("Authorization", "Bearer " + token)
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        return {"error": e.code, "msg": e.read().decode()[:800]}

# 1. Login
with open("/opt/langflow/.langflow_secret") as f:
    PWD = f.read().strip()
data = urllib.parse.urlencode({"username": "admin", "password": PWD}).encode()
req = urllib.request.Request(BASE + "/api/v1/login", data=data, method="POST")
req.add_header("Content-Type", "application/x-www-form-urlencoded")
with urllib.request.urlopen(req) as r:
    tok = json.loads(r.read())["access_token"]
print("[OK] Login OK")

# 2. Cargar prompts limpios
with open("/opt/langflow/wework_prompts_clean.json") as f:
    PROMPTS = json.load(f)

qa_prompt = PROMPTS.get("WE WORK Multilingual Q&A", "Eres un asistente de WeWork Santa Fe 505.")

# 3. Construir el flow con formato Langflow 1.11
# Arquitectura: ChatInput -> Agent (Q&A Susie) -> ChatOutput
# (version simplificada del flow de 4 agentes; se pueden anadir mas despues)

chatinput = {
    "id": "chatinput-1",
    "type": "genericNode",
    "position": {"x": -300, "y": 200},
    "data": {
        "id": "ChatInput",
        "type": "ChatInput",
        "node": {
            "template": {"input_value": {"type": "MessageTextInput", "value": ""}},
            "base_classes": ["Message"],
            "display_name": "Chat Input",
        },
        "display_name": "Chat Input",
        "label": "ChatInput",
    },
}

agent = {
    "id": "agent-wework-qa",
    "type": "genericNode",
    "position": {"x": 200, "y": 200},
    "data": {
        "id": "Agent",
        "type": "Agent",
        "node": {
            "template": {
                "agent_llm": {"type": "str", "value": ""},
                "tools": {"type": "list", "value": [], "list": True},
                "system_prompt": {"type": "str", "value": qa_prompt},
                "input_value": {"type": "str", "value": ""},
                "add_current_date_tool": {"type": "bool", "value": True, "list": False},
                "max_iterations": {"type": "int", "value": 5},
            },
            "base_classes": ["Message", "Agent"],
        },
        "display_name": "WeWork Q&A (Susie)",
        "label": "Agent",
    },
}

chatoutput = {
    "id": "chatoutput-1",
    "type": "genericNode",
    "position": {"x": 700, "y": 200},
    "data": {
        "id": "ChatOutput",
        "type": "ChatOutput",
        "node": {
            "template": {"input_value": {"type": "MessageTextInput", "value": ""}},
            "base_classes": ["Message"],
        },
        "display_name": "Chat Output",
        "label": "ChatOutput",
    },
}

flow_data = {
    "name": "WeWork Santa Fe 505 - Q&A",
    "description": "Agente Q&A multilingue de WeWork Santa Fe 505 (Susie Romero). Replica del flow de Flowise.",
    "data": {
        "nodes": [chatinput, agent, chatoutput],
        "edges": [],
        "viewport": {"zoom": 0.8, "x": 0, "y": 0},
    },
    "tags": ["wework", "coworking"],
    "is_component": False,
}

print("[..] Creando flow WeWork...")
result = api("POST", "/api/v1/flows/", tok, flow_data)
if "error" in result:
    print("[ERR]", json.dumps(result, ensure_ascii=False))
    sys.exit(1)

fid = result.get("id", "?")
print("[OK] Flow creado!")
print("     ID:", fid)
print("     Nombre:", result.get("name"))
print("     Editar en UI:", BASE + "/flow/" + fid)
print("     Test API:", BASE + "/api/v1/run/" + fid)
