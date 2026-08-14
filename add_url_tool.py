#!/usr/bin/env python3
"""Anade un componente URL (Google Doc de WeWork) como tool del agente."""
import json, sys, urllib.request, urllib.error, urllib.parse, copy

BASE = "https://strapi-langflow.tsiek2.easypanel.host"
FLOW_ID = "34b13ca8-afb1-4d70-98e4-6e4d0dba81ac"
GOOGLE_DOC = "https://docs.google.com/document/d/1GgoBxaD6M5sNDguqIlPm0OT8c_eHwdvgVWu0WI7eSQA/export?format=txt"

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
ldata = urllib.parse.urlencode({"username": "admin", "password": PWD}).encode()
req = urllib.request.Request(BASE + "/api/v1/login", data=ldata, method="POST")
req.add_header("Content-Type", "application/x-www-form-urlencoded")
with urllib.request.urlopen(req) as r:
    tok = json.loads(r.read())["access_token"]
print("[OK] Login OK")

# 2. Cargar flow actual
flow = api("GET", "/api/v1/flows/" + FLOW_ID, tok)
if "error" in flow:
    print("[ERR] No se pudo cargar el flow:", flow)
    sys.exit(1)
print("[OK] Flow cargado:", flow.get("name"))

flow_data = flow["data"]
nodes = flow_data["nodes"]
edges = flow_data["edges"]

# 3. Encontrar el nodo Agent
agent_node = None
for n in nodes:
    if n.get("data", {}).get("type") == "Agent":
        agent_node = n
        break
if not agent_node:
    print("[ERR] No se encontro nodo Agent en el flow")
    sys.exit(1)
agent_id = agent_node["id"]
print("[OK] Agent encontrado:", agent_id)

# 4. Cargar el nodo URLComponent del template Simple Agent
with open("/opt/langflow/template_simple_agent.json") as f:
    simple = json.load(f)
url_template_node = next(n for n in simple["data"]["nodes"]
                         if n.get("data", {}).get("type") == "URLComponent")

# 5. Crear el nodo URL con la URL del Google Doc de WeWork
url_node = copy.deepcopy(url_template_node)
# Generar nuevo ID unico
new_url_id = "URLComponent-wework-doc"
url_node["id"] = new_url_id
url_node["data"]["id"] = new_url_id
url_node["position"] = {"x": 100, "y": -150}
url_node["positionAbsolute"] = {"x": 100, "y": -150}

# Configurar la URL del Google Doc
tmpl = url_node["data"]["node"]["template"]
if "urls" in tmpl:
    tmpl["urls"]["value"] = GOOGLE_DOC
    print("[OK] URL del Google Doc configurada")
# Formato texto plano (no HTML)
if "format" in tmpl:
    tmpl["format"]["value"] = "text"
    print("[OK] Formato: text")

# 6. Crear la edge: URLComponent -> Agent (como tool)
# Estructura de handles copiada del template Simple Agent (valida)
new_edge = {
    "id": "url-to-agent-tool",
    "source": new_url_id,
    "target": agent_id,
    "sourceHandle": {
        "dataType": "URLComponent",
        "id": new_url_id,
        "name": "component_as_tool",
        "output_types": ["Tool"],
    },
    "targetHandle": {
        "fieldName": "tools",
        "id": agent_id,
        "inputTypes": ["Tool"],
        "type": "other",
    },
    "animated": False,
    "className": "",
    "selected": False,
    "data": {"targetHandle": {"handleType": "target", "fieldName": "tools"}},
}

# 7. Actualizar el flow completo
flow_data["nodes"] = nodes + [url_node]
flow_data["edges"] = edges + [new_edge]
flow["data"] = flow_data

# Limpiar campos que no van en PUT
for k in list(flow.keys()):
    if k not in ["name", "description", "data", "tags", "is_component"]:
        flow.pop(k, None)

print("[..] Actualizando flow con herramienta URL...")
result = api("PUT", "/api/v1/flows/" + FLOW_ID, tok, flow)
if "error" in result:
    print("[ERR]", json.dumps(result, ensure_ascii=False)[:500])
    sys.exit(1)

print("[OK] Flow actualizado!")
print("     Nodos totales:", len(result.get("data", {}).get("nodes", [])))
print("     Edges totales:", len(result.get("data", {}).get("edges", [])))
print("     Editar UI:", BASE + "/flow/" + FLOW_ID)
