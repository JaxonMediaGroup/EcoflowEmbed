#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Copia la sección de botones HTML del Santa Fe al General.
Inserta el bloque justo antes de '🚫 ANTI-INFERENCIA' en el Q&A.
Las URLs se leen del doc (dinámico), no se hardcodean.
"""
import json, io, os, sys
import requests

PATH = r"projects/We Work General Agents.json"
CONFIG = json.load(io.open("projects.json", encoding="utf-8"))
CHATFLOW_ID = CONFIG["projects"]["We Work General"]["chatflow_id"]
API_KEY = os.environ.get("FLOWISE_API_KEY", "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8")
URL = CONFIG.get("flowise_url", "https://ecoflow.koppi.mx")
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

BTN_STYLE = (
    "display:inline-block;padding:11px 20px;background:#000;color:#fff;"
    "border-radius:6px;font-weight:600;font-size:14px;margin:5px 4px;"
    "text-decoration:none;font-family:Inter,Helvetica,Arial,sans-serif"
)

BUTTONS_BLOCK = f"""
<p><strong>🔘 BOTONES DE LINKS — OBLIGATORIO:</strong></p>
<p>El documento (info_get) contiene secciones con esta estructura:</p>
<pre style="background:#f4f4f4;padding:10px;border-radius:6px;white-space:pre-wrap;overflow-x:auto">Información &lt;tipo de espacio&gt;:
Link: &lt;URL completa extraída del documento&gt;
Título: "&lt;descripción del espacio&gt;"

Información &lt;otro espacio&gt;:
Link: &lt;URL completa extraída del documento&gt;
Título: "..."</pre>
<p><strong>Cuando el usuario pregunte por un espacio, oficina o sala:</strong></p>
<ol>
<li>Ejecuta <code>info_get</code> y busca las secciones relevantes.</li>
<li>Por cada sección relevante, extrae su <strong>Link</strong> y su <strong>Título</strong>.</li>
<li>Envuelve CADA link en un botón HTML con este formato EXACTO:</li>
</ol>
<pre style="background:#f4f4f4;padding:10px;border-radius:6px;white-space:pre-wrap;overflow-x:auto">&lt;a href="URL_DEL_DOCUMENTO" style="{BTN_STYLE}"&gt;ETIQUETA_CORTA →&lt;/a&gt;</pre>
<p><strong>Reglas:</strong></p>
<ul>
<li><strong>SOLO usa URLs que aparezcan literalmente en el documento bajo "Link:"</strong>. NUNCA inventes, modifies ni completes URLs.</li>
<li>Si el documento no trae link para lo que pregunta el usuario, NO muestres botón — responde con texto y ofrece contacto.</li>
<li>Puedes mostrar <strong>1 botón</strong> (pregunta específica) o <strong>varios botones juntos</strong> (comparación o "muéstrame todo").</li>
<li>La etiqueta del botón debe ser corta y clara, derivada del Título del documento. Ejemplos: "Oficina 4 personas", "Sala 8 personas", "Ver todas las oficinas", "Ver todas las salas", "WeWork Avenida Santa Fe".</li>
<li>NUNCA muestres la URL cruda como texto plano — siempre como botón HTML.</li>
<li>Ejemplo de respuesta con 2 botones (URLs reales extraídas del documento):</li>
</ul>
<pre style="background:#f4f4f4;padding:10px;border-radius:6px;white-space:pre-wrap;overflow-x:auto">&lt;a href="URL_EXTRAÍDA_DEL_DOC_1" style="{BTN_STYLE}"&gt;Etiqueta corta 1 →&lt;/a&gt;&lt;a href="URL_EXTRAÍDA_DEL_DOC_2" style="{BTN_STYLE}"&gt;Etiqueta corta 2 →&lt;/a&gt;</pre>
<p><strong>Recuerda:</strong> las URLs se actualizan directo en el documento. Tu trabajo es leerlas de ahí, no memorizarlas.</p>

""".strip()

# ---------------------------------------------------------------------------
with io.open(PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

modified = 0
for node in data["nodes"]:
    if "Q&A" not in node["data"]["label"]:
        continue
    msgs = node["data"]["inputs"].get("agentMessages")
    if not (isinstance(msgs, list) and msgs):
        continue
    content = msgs[0]["content"]

    if "BOTONES DE LINKS" in content:
        print("El bloque de botones ya existe. Saltando.")
        break

    anchor = "<p><strong>🚫 ANTI-INFERENCIA:</strong></p>"
    idx = content.find(anchor)
    if idx == -1:
        print("ERROR: no se encontró el ancla ANTI-INFERENCIA.", file=sys.stderr)
        sys.exit(1)

    msgs[0]["content"] = content[:idx] + BUTTONS_BLOCK + "\n" + content[idx:]
    modified += 1

if modified == 0:
    sys.exit(0)

with io.open(PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print(f"Bloque de botones insertado en {modified} agente(s).")

# PUSH preservando STT/TTS
r = requests.get(f"{URL}/api/v1/chatflows/{CHATFLOW_ID}", headers=HEADERS, timeout=30)
r.raise_for_status()
cur = r.json()
body = {"flowData": json.dumps(data, ensure_ascii=False)}
for k in ("speechToText", "textToSpeech", "category", "type", "name"):
    if cur.get(k):
        body[k] = cur[k]
r2 = requests.put(f"{URL}/api/v1/chatflows/{CHATFLOW_ID}", headers=HEADERS, json=body, timeout=90)
print("Push:", "✅" if r2.status_code == 200 else f"❌ {r2.status_code} {r2.text[:300]}")
