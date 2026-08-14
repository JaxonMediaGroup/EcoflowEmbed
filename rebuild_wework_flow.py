#!/usr/bin/env python3
"""Reconstruye el flow WeWork clonando el template Memory Chatbot (formato valido)
y sustituyendo el prompt del Agent con el de Susie Romero."""
import json, sys, urllib.request, urllib.error, urllib.parse

BASE = "https://strapi-langflow.tsiek2.easypanel.host"

def api(method, path, token, data=None, raw=False):
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

# 2. Borrar el flow WeWork anterior (roto)
OLD = "2bbcca38-51c2-4a78-9263-5d873307e84d"
del_resp = api("DELETE", "/api/v1/flows/" + OLD, tok)
print("[OK] Flow viejo borrado:", del_resp.get("removed", del_resp))

# 3. Cargar template valido (Memory Chatbot)
with open("/opt/langflow/template_memory_chatbot.json") as f:
    template = json.load(f)

# 4. Cargar prompts WeWork
with open("/opt/langflow/wework_prompts_clean.json") as f:
    PROMPTS = json.load(f)
QA_PROMPT = PROMPTS.get("WE WORK Multilingual Q&A", "Eres asistente de WeWork Santa Fe 505.")

# 5. Modificar el nodo Agent: cambiar display_name e inyectar el prompt
nodes = template["data"]["nodes"]
for n in nodes:
    nd = n.get("data", {})
    if nd.get("type") == "Agent":
        nd["display_name"] = "WeWork Q&A (Susie)"
        tmpl = nd.get("node", {}).get("template", {})
        # El campo del system prompt en el Agent de Langflow
        if "agent_instructions" in tmpl:
            tmpl["agent_instructions"]["value"] = QA_PROMPT
            print("[OK] Prompt inyectado en agent_instructions")
        elif "system_prompt" in tmpl:
            tmpl["system_prompt"]["value"] = QA_PROMPT
            print("[OK] Prompt inyectado en system_prompt")
        else:
            # Buscar campo de instructions
            candidates = [k for k in tmpl if "instruct" in k.lower() or "prompt" in k.lower() or "system" in k.lower()]
            print("[INFO] Campos candidatos para prompt:", candidates)
            if candidates:
                tmpl[candidates[0]]["value"] = QA_PROMPT
                print(f"[OK] Prompt inyectado en {candidates[0]}")

# 6. Cambiar nombre del flow
template["name"] = "WeWork Santa Fe 505 - Q&A"
template["description"] = "Agente Q&A multilingue de WeWork Santa Fe 505 (Susie Romero). Basado en el flow de Flowise."
template["tags"] = ["wework", "coworking"]

# Limpiar campos que no van en POST
for k in ["id", "endpoint_name"]:
    template.pop(k, None)

# 7. Crear el flow
print("[..] Creando flow WeWork desde template valido...")
result = api("POST", "/api/v1/flows/", tok, template)
if "error" in result:
    print("[ERR]", json.dumps(result, ensure_ascii=False)[:500])
    sys.exit(1)

fid = result.get("id", "?")
n_nodes = len(result.get("data", {}).get("nodes", []))
print("[OK] Flow creado!")
print("     ID:", fid)
print("     Nodos:", n_nodes)
print("     Editar UI:", BASE + "/flow/" + fid)
print("     Test API:", BASE + "/api/v1/run/" + fid)
