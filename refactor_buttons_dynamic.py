#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Reemplaza el bloque de links por instrucciones de medios dinámicos:
- links de espacios -> botones HTML;
- imágenes del Directorio de empresas -> imágenes HTML.

La condición depende de la sección del documento, no de empresas o IDs fijos.
"""
import os
import json, io, os, sys, uuid

TARGET_PRINCIPAL = "--directorio" not in sys.argv
LOCAL_ONLY = "--local-only" in sys.argv
VERIFY_RESPONSE = "--verify-response" in sys.argv
CONFIG = json.load(io.open("projects.json", encoding="utf-8"))
if TARGET_PRINCIPAL:
    PATH = r"projects/WE WORK Agents.json"
    CHATFLOW_ID = "987464b9-dec9-416c-a007-165c91b8848c"
    TARGET_NAME = "We Work Santa Fe"
else:
    PATH = r"projects/We Work Santa Fe Directorio Agents.json"
    CHATFLOW_ID = CONFIG["projects"]["We Work Santa Fe Directorio"]["chatflow_id"]
    TARGET_NAME = "We Work Santa Fe - Directorio"
API_KEY = os.environ.get("FLOWISE_API_KEY", os.environ["FLOWISE_API_KEY"])
URL = CONFIG.get("flowise_url", "https://ecoflow.koppi.mx")
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

BTN_STYLE = (
    "display:inline-block;padding:11px 20px;background:#000;color:#fff;"
    "border-radius:6px;font-weight:600;font-size:14px;margin:5px 4px;"
    "text-decoration:none;font-family:Inter,Helvetica,Arial,sans-serif"
)
IMAGE_STYLE = (
    "display:block;width:100%;max-width:680px;height:auto;border-radius:10px;"
    "margin:10px 0;border:1px solid #e5e5e5"
)

# ---------------------------------------------------------------------------
# NUEVO BLOQUE: clasificación dinámica por sección del documento
# ---------------------------------------------------------------------------
NEW_BUTTONS_BLOCK = f"""
<p><strong>🔗 LINKS Y MEDIOS — CLASIFICACIÓN OBLIGATORIA:</strong></p>
<p>Después de ejecutar <code>info_get</code>, clasifica cada link por su <strong>contexto y formato</strong>, nunca por una lista fija de empresas o IDs:</p>
<ol>
<li>Dentro de <strong>"Directorio de empresas"</strong>, un link es <strong>IMAGEN</strong> si está marcado como <code>Imagen:</code> o <code>Tipo: imagen</code>, si es una URL de Google Drive con forma <code>/file/d/FILE_ID/view</code>, o si termina en una extensión de imagen.</li>
<li>Los demás links del directorio —por ejemplo, páginas web corporativas— son <strong>BOTONES</strong>.</li>
<li>Fuera del directorio, los links de oficinas, salas o espacios también son <strong>BOTONES</strong>.</li>
</ol>
<p><strong>Cómo reconocer el alcance:</strong> el encabezado "Directorio de empresas" inicia la sección. Todas las entradas debajo pertenecen al directorio hasta que comience el siguiente encabezado o sección principal. El nombre que acompaña al link es la etiqueta del botón o el texto alternativo de la imagen.</p>
<p><strong>Consulta obligatoria del directorio:</strong></p>
<ul>
<li>Si el usuario pide el directorio completo, busca y procesa <strong>TODAS</strong> las entradas que <code>info_get</code> devuelva dentro de esa sección. No limites la cantidad y no memorices empresas.</li>
<li>Si pide una empresa específica, compara el nombre sin distinguir mayúsculas/minúsculas y muestra solo las coincidencias.</li>
<li>Usa exclusivamente las entradas del bloque "Directorio de empresas" devuelto por <code>info_get</code>. No sustituyas un link ausente mediante búsqueda web ni conocimiento general.</li>
<li>Si una entrada dice "pendiente de confirmar", respétalo y no inventes un enlace.</li>
</ul>
<p><strong>🖼️ Transformación dinámica de imágenes:</strong></p>
<ol>
<li>Para una URL de Google Drive con forma <code>https://drive.google.com/file/d/FILE_ID/view...</code>, extrae exactamente el texto entre <code>/d/</code> y <code>/view</code>. Ese texto es <code>FILE_ID</code>.</li>
<li>Construye el <code>src</code> visual como <code>https://drive.google.com/thumbnail?id=FILE_ID&amp;sz=w1200</code>.</li>
<li>Conserva la URL original del documento como <code>href</code> para que la imagen sea clicable.</li>
<li>Para una URL directa terminada en <code>.png</code>, <code>.jpg</code>, <code>.jpeg</code>, <code>.webp</code>, <code>.gif</code> o <code>.svg</code>, usa la misma URL como <code>src</code> y <code>href</code>.</li>
</ol>
<p><strong>Formato exacto para cada entrada clasificada como imagen:</strong></p>
<pre style="background:#f4f4f4;padding:10px;border-radius:6px;white-space:pre-wrap;overflow-x:auto">&lt;p&gt;&lt;strong&gt;NOMBRE_DE_EMPRESA&lt;/strong&gt;&lt;/p&gt;
&lt;a href="URL_ORIGINAL_DEL_DOCUMENTO" target="_blank" rel="noopener"&gt;&lt;img src="URL_VISUAL_DERIVADA" alt="Directorio de empresas — NOMBRE_DE_EMPRESA" loading="lazy" style="{IMAGE_STYLE}"&gt;&lt;/a&gt;</pre>
<p><strong>🔘 Formato para los demás links:</strong></p>
<pre style="background:#f4f4f4;padding:10px;border-radius:6px;white-space:pre-wrap;overflow-x:auto">&lt;a href="URL_DEL_DOCUMENTO" target="_blank" rel="noopener" style="{BTN_STYLE}"&gt;ETIQUETA_CORTA →&lt;/a&gt;</pre>
<p><strong>Reglas:</strong></p>
<ul>
<li><strong>SOLO usa URLs que aparezcan literalmente en el documento</strong>, ya sea bajo "Link:" o asociadas directamente a una entrada del Directorio de empresas. NUNCA inventes, modifies ni completes la URL original.</li>
<li>La única transformación permitida es derivar el <code>src</code> visual mediante las reglas anteriores; el <code>href</code> siempre conserva la URL original.</li>
<li>Una página corporativa como <code>https://www.empresa.com</code> no es una imagen: renderízala como botón.</li>
<li>Si el documento no trae link para lo que pregunta el usuario, no muestres botón ni imagen; responde con texto y ofrece contacto.</li>
<li>Puedes mostrar <strong>1 botón</strong> (pregunta específica) o <strong>varios botones juntos</strong> (comparación o "muéstrame todo").</li>
<li>La etiqueta del botón debe ser corta y clara, derivada del Título del documento. Ejemplos: "Oficina 4 personas", "Sala 8 personas", "Ver todas las oficinas", "Ver todas las salas".</li>
<li>NUNCA muestres una URL cruda como texto plano.</li>
<li>NUNCA uses sintaxis Markdown para estos medios (<code>[texto](url)</code> o <code>![alt](url)</code>); emite directamente el HTML indicado.</li>
<li>Fuera de la sección "Directorio de empresas", no asumas que un link de Google Drive es una imagen: usa la regla general de botones.</li>
<li>Ejemplo de respuesta con 2 botones (URLs reales extraídas del documento):</li>
</ul>
<pre style="background:#f4f4f4;padding:10px;border-radius:6px;white-space:pre-wrap;overflow-x:auto">&lt;a href="URL_EXTRAÍDA_DEL_DOC_1" target="_blank" rel="noopener" style="{BTN_STYLE}"&gt;Etiqueta corta 1 →&lt;/a&gt;&lt;a href="URL_EXTRAÍDA_DEL_DOC_2" target="_blank" rel="noopener" style="{BTN_STYLE}"&gt;Etiqueta corta 2 →&lt;/a&gt;</pre>
<p><strong>Recuerda:</strong> la condición depende de la sección y del formato de cada URL. Las empresas y sus links pueden agregarse, quitarse o cambiar sin modificar este prompt.</p>
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

    # Acepta cualquiera de las versiones anteriores del encabezado.
    start_markers = (
        "<p><strong>🔘 CATÁLOGO DE BOTONES — OBLIGATORIO:</strong></p>",
        "<p><strong>🔘 BOTONES DE LINKS — OBLIGATORIO:</strong></p>",
        "<p><strong>🔗 LINKS Y MEDIOS — CLASIFICACIÓN OBLIGATORIA:</strong></p>",
    )
    end_marker = "<p><strong>🚫 ANTI-INFERENCIA:</strong></p>"

    si = next((content.find(marker) for marker in start_markers if marker in content), -1)
    ei = content.find(end_marker)
    if si == -1 or ei == -1:
        print("No se encontró el bloque. start:", si, "end:", ei, file=sys.stderr)
        sys.exit(1)

    new_content = content[:si] + NEW_BUTTONS_BLOCK + "\n\n" + content[ei:]
    msgs[0]["content"] = new_content
    replaced += 1

    # Vacío significa Infinity en Requests Get: devuelve la respuesta completa.
    tools = node["data"]["inputs"].get("agentTools")
    tool_entries = tools if isinstance(tools, list) else [tools]
    for tool in tool_entries:
        if not isinstance(tool, dict):
            continue
        tool_config = tool.get("agentSelectedToolConfig", {})
        if tool_config.get("requestsGetName") == "info_get":
            tool_config["requestsGetMaxOutputLength"] = ""

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

if LOCAL_ONLY:
    print("Modo local: no se enviaron cambios al servidor.")
    sys.exit(0)

from urllib.error import HTTPError
from urllib.request import Request, urlopen


def api_request(method, endpoint, body=None, timeout=90):
    payload = None if body is None else json.dumps(body, ensure_ascii=False).encode("utf-8")
    request = Request(endpoint, data=payload, headers=HEADERS, method=method)
    try:
        with urlopen(request, timeout=timeout) as response:
            raw = response.read().decode("utf-8")
            return response.status, json.loads(raw) if raw else {}
    except HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        print(f"HTTP {error.code}: {detail[:600]}", file=sys.stderr)
        raise

# ---------------------------------------------------------------------------
# PUSH al servidor (preservando STT/TTS/name)
# ---------------------------------------------------------------------------
_, current = api_request("GET", f"{URL}/api/v1/chatflows/{CHATFLOW_ID}", timeout=30)

update_body = {"flowData": json.dumps(data, ensure_ascii=False)}
for key in ("speechToText", "textToSpeech", "category", "type", "name"):
    if current.get(key):
        update_body[key] = current[key]

status, _ = api_request(
    "PUT",
    f"{URL}/api/v1/chatflows/{CHATFLOW_ID}",
    body=update_body,
    timeout=90,
)
if status == 200:
    print(f"\nOK: Push exitoso: {TARGET_NAME} (links y medios)")
else:
    print(f"\nERROR: Push fallido: {status}")
    sys.exit(1)

if VERIFY_RESPONSE:
    _, prediction = api_request(
        "POST",
        f"{URL}/api/v1/prediction/{CHATFLOW_ID}",
        body={
            "question": "Muéstrame todo el Directorio de empresas.",
            "overrideConfig": {
                "sessionId": f"verify_wework_company_directory_media_{uuid.uuid4().hex}"
            },
        },
        timeout=180,
    )
    answer = prediction.get("text", "")
    # Fixtures actuales del documento: solo validan la ejecución. No forman
    # parte del prompt ni de la condición dinámica del agente.
    expected_ids = (
        "13QklhSekhq1wiCi8sQ_O9URLYH02RZE2",
        "1XKl12GzyIdDPdwXMEweCSCwpdh7-RMnC",
        "1bjwt_Bh5nU1vRGSUInyXFumuaytEGZrm",
        "1rblTLUuQriCqG_Me2S7U8FKWV1tRk6Qx",
        "1XULA65m4N4QhrcU6_ZWajajZ2WKHTlBA",
        "18aeOvvxFntRetgWnnwhco9I9PrCyav_5",
        "1BOFoqS4EOy91aWbYvyPdLFPt1rb9aNU6",
        "16Qu4sbCcycgQCZ_gS7gu1BxeGwQaKM6-",
        "1ojMHMwpxcywE8xK5shvcFPy2_DbzVPQm",
    )
    checks = {
        "all_images": answer.count("<img ") >= len(expected_ids),
        "all_document_ids": all(file_id in answer for file_id in expected_ids),
        "drive_thumbnails": (
            answer.count("drive.google.com/thumbnail?id=") >= len(expected_ids)
        ),
    }
    print("Verificación de respuesta:", checks)
    if not all(checks.values()):
        print(f"Respuesta recibida: {answer[:1200]}", file=sys.stderr)
        sys.exit(1)
