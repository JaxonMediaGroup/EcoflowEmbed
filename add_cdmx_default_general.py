#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sitúa el agente We Work General en Ciudad de México por defecto (modo flexible),
sin interferir con info de otras sedes.

- Default: responde con contexto CDMX (13 sedes listadas en el doc).
- Si el usuario menciona otra ciudad/país: responde con info global de WeWork
  (servicios, tipos de espacio) SIN inventar sedes específicas.
- No toca chatbotConfig/welcomeMessage.
"""
import json, io, os, sys
import requests

PATH = r"projects/We Work General Agents.json"
CONFIG = json.load(io.open("projects.json", encoding="utf-8"))
CHATFLOW_ID = CONFIG["projects"]["We Work General"]["chatflow_id"]
API_KEY = os.environ.get("FLOWISE_API_KEY", "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8")
URL = CONFIG.get("flowise_url", "https://ecoflow.koppi.mx")
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

# ---------------------------------------------------------------------------
# Bloque a insertar (modo CDMX flexible)
# ---------------------------------------------------------------------------
CDMX_BLOCK = """
<li><strong>📍 UBICACIÓN POR DEFECTO — CIUDAD DE MÉXICO:</strong> Tu contexto principal es <strong>WeWork Ciudad de México</strong>. El documento lista 13 sedes en CDMX (Reforma Latino, Reforma 26, Varsovia, Lago Alberto, Miguel de Cervantes Saavedra, Montes Urales, Insurgentes Sur 601, Insurgentes Sur 1079, Mitikah, Artz Pedregal, Avenida Santa Fe, Park Plaza y Prolongación Paseo de la Reforma). <strong>Cuando el usuario NO especifique ciudad, asume CDMX</strong> y responde con esas sedes y servicios locales.</li>
<li><strong>🌎 SI EL USUARIO MENCIONA OTRA CIUDAD/PAÍS</strong> (Monterrey, Guadalajara, NY, Madrid, etc.): responde con la <strong>información global de WeWork</strong> que sí aplica en cualquier lugar (qué es WeWork, tipos de espacios, membresías All Access/On Demand, Enterprise, reglamento general). <strong>NUNCA inventes direcciones, sedes específicas, precios locales ni disponibilidad</strong> de ciudades que no estén en el documento. Si te preguntan por una sede concreta fuera de CDMX, di: "Para esa ciudad te recomiendo validar directamente con el equipo de WeWork, ya que la disponibilidad y sedes varían por región."</li>
<li><strong>🔄 DETECCIÓN DE UBICACIÓN</strong>: si el usuario es ambiguo ("¿tienen oficinas?", "¿dónde están?"), responde primero con CDMX. Solo amplía a nivel global si el usuario deja claro que busca fuera de CDMX (ej: "en otro país", "en Monterrey", "internacional").</li>
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

    # Evitar doble inserción
    if "UBICACIÓN POR DEFECTO — CIUDAD DE MÉXICO" in content:
        print("El bloque CDMX ya existe. Saltando.")
        break

    # Insertar justo después del primer <li> de la lista de instrucciones específicas
    # (el que define "WeWork es coworking...").
    anchor = '<li><strong>WeWork es coworking / oficinas flexibles</strong>: NO vendes departamentos ni bienes raíces.'
    idx = content.find(anchor)
    if idx == -1:
        print("ERROR: no se encontró el ancla.", file=sys.stderr)
        sys.exit(1)

    # ir al final de ese </li>
    close = content.find("</li>", idx)
    if close == -1:
        print("ERROR: no se encontró cierre </li>.", file=sys.stderr)
        sys.exit(1)
    insert_at = close + len("</li>")

    new_content = content[:insert_at] + "\n" + CDMX_BLOCK + content[insert_at:]
    msgs[0]["content"] = new_content
    modified += 1

if modified == 0:
    print("No se modificó nada.", file=sys.stderr)
    sys.exit(1)

with io.open(PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print(f"Bloque CDMX insertado en {modified} agente(s).")

# ---------------------------------------------------------------------------
# PUSH preservando STT/TTS
# ---------------------------------------------------------------------------
r = requests.get(f"{URL}/api/v1/chatflows/{CHATFLOW_ID}", headers=HEADERS, timeout=30)
r.raise_for_status()
cur = r.json()

body = {"flowData": json.dumps(data, ensure_ascii=False)}
for k in ("speechToText", "textToSpeech", "category", "type"):
    if cur.get(k):
        body[k] = cur[k]

r2 = requests.put(
    f"{URL}/api/v1/chatflows/{CHATFLOW_ID}",
    headers=HEADERS,
    json=body,
    timeout=90,
)
print("Push:", "✅" if r2.status_code == 200 else f"❌ {r2.status_code} {r2.text[:300]}")
