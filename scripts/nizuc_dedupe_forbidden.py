# -*- coding: utf-8 -*-
"""Deduplica los bloques "⛔ STRICTLY FORBIDDEN PHRASES" repetidos en los prompts de NIZUC.

Cada mensaje tenía el mismo bloque largo (lista de frases prohibidas + NEVER reveal)
copiado 2-3 veces con colas distintas ("Respond naturally..." y "CUANDO NO TENGAS..."),
~3,000 caracteres de bloat. Este script deja UN solo bloque por mensaje con la unión
de las guías únicas, y corrige el residuo inmobiliario "un asesor que podrá ayudarte"
por la referencia al concierge/reservaciones. Falla ruidosamente si algo no coincide.
"""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
AGENT_FILE = ROOT / "projects" / "NIZUC Agents.json"

MAIN_LABEL = "Nizuc  Multilingual Q&A"
GUARD_LABEL = "Off-Topic Guard (Multilingual) - Nizuc"

# Fragmentos compartidos (formato HTML de los Agent nodes).
LISTA_FRASES = (
    '<li>NUNCA uses: "según el documento", "el documento menciona", '
    '"de acuerdo con el documento", "no se menciona en el documento", '
    '"no viene en el documento", "el documento no incluye", "según la ficha", '
    '"en la ficha", "la ficha indica", "la ficha menciona", "la ficha no incluye", '
    '"according to the document", "the document states", '
    '"based on the provided document", "not mentioned in the document".</li>'
    '<li>NUNCA uses frases que revelen que consultas una fuente externa, como: '
    '"en la información que tengo", "en la información oficial que tengo", '
    '"no aparece en la información", "no está en la información que tengo", '
    '"la información que tengo aquí", "la información disponible aquí", '
    '"según los datos que tengo", "en los datos que tengo".</li>'
    '<li>NEVER reveal you are consulting a document, ficha, file, or external data source.</li>'
)
ITEM_RESPOND = (
    '<li>Respond naturally as an expert. Instead of "El precio no aparece en la '
    'información que tengo" say "No cuento con el precio confirmado en este momento."</li>'
)
ITEM_CUANDO_VIEJO = (
    '<li><strong>CUANDO NO TENGAS LA INFORMACIÓN:</strong> NUNCA digas que no viene '
    'en el documento/ficha/fuente. Di simplemente: "No cuento con esa información '
    'confirmada, pero con gusto puedo ponerte en contacto con un asesor que podrá '
    'ayudarte." — Ofrece siempre el contacto humano como siguiente paso.</li>'
)
ITEM_CUANDO_NUEVO = (
    '<li><strong>CUANDO NO TENGAS LA INFORMACIÓN:</strong> NUNCA digas que no viene '
    'en el documento/ficha/fuente. Di simplemente: "No cuento con esa información '
    'confirmada, pero con gusto puedo ponerte en contacto con el concierge o el '
    'equipo de reservaciones, que podrá ayudarte." — Ofrece siempre el contacto '
    'humano como siguiente paso.</li>'
)
CABECERA_HTML = '<p><strong>⛔ STRICTLY FORBIDDEN PHRASES (ALL LANGUAGES):</strong></p><ul>'

# Bloque completo con cola "Respond naturally" (se elimina; su guía se conserva).
BLOQUE_RESPOND = CABECERA_HTML + LISTA_FRASES + ITEM_RESPOND + "</ul>"

# Bloque corto en inglés del msg0 del agente principal (se elimina; su ejemplo se conserva).
BLOQUE_EN_CORTO = (
    '<p><strong>⛔ STRICTLY FORBIDDEN PHRASES (ALL LANGUAGES):</strong></p><ul>'
    '<li><p>NEVER use phrases like: "según el documento", "el documento menciona", '
    '"de acuerdo con el documento", "no se menciona en el documento", '
    '"no viene en el documento", "el documento no incluye", '
    '"according to the document", "the document states", '
    '"based on the provided document", "not mentioned in the document".</p></li>'
    '<li><p>NEVER reveal you are consulting a document, file, or external data source.</p></li>'
    '<li><p>Instead, respond naturally as if you have personal expert knowledge of the '
    'project. Example: Instead of "Según el documento, el precio es..." say "El precio es..."</p></li></ul>'
)
# El ejemplo único del bloque corto, reescrito para NIZUC.
ITEM_EJEMPLO = (
    '<li>Respond naturally as if you have personal expert knowledge of NIZUC. '
    'Example: Instead of "Según el documento, el precio es..." say "El precio es..."</li>'
)

# Bloque en markdown del msg1 del agente principal (copia con cola "Respond naturally").
BLOQUE_MD_RESPOND = (
    "**⛔ STRICTLY FORBIDDEN PHRASES (ALL LANGUAGES):**\n"
    '- NUNCA uses: "según el documento", "el documento menciona", '
    '"de acuerdo con el documento", "no se menciona en el documento", '
    '"no viene en el documento", "el documento no incluye", "según la ficha", '
    '"en la ficha", "la ficha indica", "la ficha menciona", "la ficha no incluye", '
    '"according to the document", "the document states", '
    '"based on the provided document", "not mentioned in the document".\n'
    '- NUNCA uses frases que revelen que consultas una fuente externa, como: '
    '"en la información que tengo", "en la información oficial que tengo", '
    '"no aparece en la información", "no está en la información que tengo", '
    '"la información que tengo aquí", "la información disponible aquí", '
    '"según los datos que tengo", "en los datos que tengo".\n'
    "- NEVER reveal you are consulting a document, ficha, file, or external data source.\n"
    '- Respond naturally as an expert. Instead of "El precio no aparece en la '
    'información que tengo" say "No cuento con el precio confirmado en este momento."'
)


def reemplazar(texto, viejo, nuevo, etiqueta, veces=1):
    encontrados = texto.count(viejo)
    if encontrados < veces:
        print(f"ERROR: no se encontró el patrón [{etiqueta}] ({encontrados}/{veces}); no se modificó nada.")
        sys.exit(1)
    return texto.replace(viejo, nuevo, veces)


def main():
    with open(AGENT_FILE, encoding="utf-8") as f:
        data = json.load(f)

    nodos = {n["data"].get("label"): n for n in data["nodes"] if n.get("data")}
    msgs_main = nodos[MAIN_LABEL]["data"]["inputs"]["agentMessages"]
    msg_guard = nodos[GUARD_LABEL]["data"]["inputs"]["agentMessages"][0]

    # --- Agente principal, msg0 (HTML): 3 bloques -> 1 ---
    m0 = msgs_main[0]["content"]
    m0 = reemplazar(m0, BLOQUE_EN_CORTO, "", "msg0: bloque EN corto")
    m0 = reemplazar(m0, BLOQUE_RESPOND, "", "msg0: bloque duplicado")
    bloque_final = (
        CABECERA_HTML + LISTA_FRASES + ITEM_RESPOND + ITEM_EJEMPLO + ITEM_CUANDO_NUEVO + "</ul>"
    )
    m0 = reemplazar(m0, CABECERA_HTML + LISTA_FRASES + ITEM_CUANDO_VIEJO + "</ul>", bloque_final, "msg0: bloque consolidado")
    msgs_main[0]["content"] = m0

    # --- Agente principal, msg1 (markdown): 2 bloques -> 1 ---
    m1 = msgs_main[1]["content"]
    m1 = reemplazar(m1, BLOQUE_MD_RESPOND + "\n\n", "", "msg1: bloque duplicado")
    # Reinsertar la línea "Respond naturally" (única del bloque eliminado) en el bloque restante.
    linea_respond_md = (
        '- Respond naturally as an expert. Instead of "El precio no aparece en la '
        'información que tengo" say "No cuento con el precio confirmado en este momento."'
    )
    m1 = reemplazar(
        m1,
        "- NEVER reveal you are consulting a document, ficha, file, or external data source.\n- **CUANDO NO TENGAS LA INFORMACIÓN:**",
        "- NEVER reveal you are consulting a document, ficha, file, or external data source.\n"
        + linea_respond_md
        + "\n- **CUANDO NO TENGAS LA INFORMACIÓN:**",
        "msg1: línea respond reintroducida",
    )
    m1 = reemplazar(m1, "un asesor que podrá ayudarte", "el concierge o el equipo de reservaciones, que podrá ayudarte", "msg1: asesor -> concierge")
    m1 = reemplazar(m1, "Responde naturalmente como un asesor experto que conoce el proyecto", "Responde naturalmente como un concierge experto que conoce el resort", "msg1: ítem 6 concierge")
    msgs_main[1]["content"] = m1

    # --- Guard (HTML): 2 bloques -> 1 ---
    g = msg_guard["content"]
    g = reemplazar(g, BLOQUE_RESPOND, "", "guard: bloque duplicado")
    g = reemplazar(
        g,
        CABECERA_HTML + LISTA_FRASES + ITEM_CUANDO_VIEJO + "</ul>",
        CABECERA_HTML + LISTA_FRASES + ITEM_RESPOND + ITEM_CUANDO_NUEVO + "</ul>",
        "guard: bloque consolidado",
    )
    msg_guard["content"] = g

    with open(AGENT_FILE, "w", encoding="utf-8", newline="\n") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
        f.write("\n")

    print(f"OK: bloques consolidados en {AGENT_FILE}")


if __name__ == "__main__":
    main()
