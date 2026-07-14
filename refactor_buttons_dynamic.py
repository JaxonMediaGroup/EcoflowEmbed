#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Reemplaza el bloque de botones hardcodeados por instrucciones dinámicas:
el agente lee los links del documento (info_get) y los envuelve en botones HTML.
Sin URLs hardcodeadas en el prompt.
"""
import json, io, os, sys
import requests

PATH = r"projects/WE WORK Agents.json"
CONFIG = json.load(io.open("projects.json", encoding="utf-8"))
CHATFLOW_ID = "987464b9-dec9-416c-a007-165c91b8848c"
API_KEY = os.environ.get("FLOWISE_API_KEY", "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8")
URL = CONFIG.get("flowise_url", "https://ecoflow.koppi.mx")
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

BTN_STYLE = (
    "display:inline-block;padding:11px 20px;background:#000;color:#fff;"
    "border-radius:6px;font-weight:600;font-size:14px;margin:5px 4px;"
    "text-decoration:none;font-family:Inter,Helvetica,Arial,sans-serif"
)

# ---------------------------------------------------------------------------
# NUEVO BLOQUE: dinámico, sin URLs hardcodeadas
# ---------------------------------------------------------------------------
NEW_BUTTONS_BLOCK = f"""
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
<pre style="background:#f4f4f4;padding:10px;border-radius:6px;white-space:pre-wrap;overflow-x:auto">&lt;a href="URL_DEL_DOCUMENTO" target="_blank" rel="noopener" style="{BTN_STYLE}"&gt;ETIQUETA_CORTA →&lt;/a&gt;</pre>
<p><strong>Reglas:</strong></p>
<ul>
<li><strong>SOLO usa URLs que aparezcan literalmente en el documento bajo "Link:"</strong>. NUNCA inventes, modifies ni completes URLs.</li>
<li>Si el documento no trae link para lo que pregunta el usuario, NO muestres botón — responde con texto y ofrece contacto.</li>
<li>Puedes mostrar <strong>1 botón</strong> (pregunta específica) o <strong>varios botones juntos</strong> (comparación o "muéstrame todo").</li>
<li>La etiqueta del botón debe ser corta y clara, derivada del Título del documento. Ejemplos: "Oficina 4 personas", "Sala 8 personas", "Ver todas las oficinas", "Ver todas las salas".</li>
<li>NUNCA muestres la URL cruda como texto plano — siempre como botón HTML.</li>
<li>Ejemplo de respuesta con 2 botones (URLs reales extraídas del documento):</li>
</ul>
<pre style="background:#f4f4f4;padding:10px;border-radius:6px;white-space:pre-wrap;overflow-x:auto">&lt;a href="URL_EXTRAÍDA_DEL_DOC_1" target="_blank" rel="noopener" style="{BTN_STYLE}"&gt;Etiqueta corta 1 →&lt;/a&gt;&lt;a href="URL_EXTRAÍDA_DEL_DOC_2" target="_blank" rel="noopener" style="{BTN_STYLE}"&gt;Etiqueta corta 2 →&lt;/a&gt;</pre>
<p><strong>Recuerda:</strong> las URLs se actualizan directo en el documento. Tu trabajo es leerlas de ahí, no memorizarlas.</p>
""".strip()

# ---------------------------------------------------------------------------
# Cargar, reemplazar bloque, guardar
# ---------------------------------------------------------------------------
with io.open(PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

import re
replaced = 0
for node in data["nodes"]:
    if "Q&A" not in node["data"]["label"]:
        continue
    msgs = node["data"]["inputs"].get("agentMessages")
    if not (isinstance(msgs, list) and msgs):
        continue
    content = msgs[0]["content"]

    # El bloque viejo va desde "🔘 CATÁLOGO DE BOTONES" hasta justo antes de "🚫 ANTI-INFERENCIA"
    start_marker = "<p><strong>🔘 CATÁLOGO DE BOTONES — OBLIGATORIO:</strong></p>"
    end_marker = "<p><strong>🚫 ANTI-INFERENCIA:</strong></p>"

    si = content.find(start_marker)
    ei = content.find(end_marker)
    if si == -1 or ei == -1:
        print("No se encontró el bloque. start:", si, "end:", ei, file=sys.stderr)
        sys.exit(1)

    new_content = content[:si] + NEW_BUTTONS_BLOCK + "\n\n" + content[ei:]
    msgs[0]["content"] = new_content
    replaced += 1

    # Validar que ya no queden URLs hardcodeadas
    urls_restantes = re.findall(r"https://wework\.koppi\.mx[a-zA-Z0-9/\-]*", new_content)
    print(f"URLs wework.koppi.mx restantes en prompt: {len(urls_restantes)}")
    for u in sorted(set(urls_restantes)):
        print(f"  - {u}")

if replaced == 0:
    print("ERROR: no se modificó ningún Q&A", file=sys.stderr)
    sys.exit(1)

with io.open(PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print(f"\nBloque reemplazado en {replaced} agente(s). JSON guardado.")

# ---------------------------------------------------------------------------
# PUSH al servidor (preservando STT/TTS/name)
# ---------------------------------------------------------------------------
r = requests.get(f"{URL}/api/v1/chatflows/{CHATFLOW_ID}", headers=HEADERS, timeout=30)
r.raise_for_status()
current = r.json()

update_body = {"flowData": json.dumps(data, ensure_ascii=False)}
for key in ("speechToText", "textToSpeech", "category", "type", "name"):
    if current.get(key):
        update_body[key] = current[key]

r2 = requests.put(
    f"{URL}/api/v1/chatflows/{CHATFLOW_ID}",
    headers=HEADERS,
    json=update_body,
    timeout=90,
)
if r2.status_code == 200:
    print(f"\n✅ Push exitoso: We Work Santa Fe (botones dinámicos)")
else:
    print(f"\n❌ Push fallido: {r2.status_code}\n{r2.text[:600]}")
    sys.exit(1)
