"""Generate the Real Alcalá Sur Agentflow from the stable real-estate template."""

from __future__ import annotations

import copy
import json
import os
from textwrap import dedent

from build_club_de_golf import (
    find_node,
    load_template,
    set_system_prompt,
    set_temperature,
)
from prompt_standards import build_real_estate_qa_prompt


BASE_DIR = os.path.dirname(__file__)
OUT_FILE = os.path.join(BASE_DIR, "projects", "Real Alcalá Sur Agents.json")
DOC_EXPORT_URL = (
    "https://docs.google.com/document/d/"
    "19aswRKNgmQidjdG0TFtO5pIaGfyMr4r81vsHZn56HtE/export?format=txt"
)
MODEL_NAME = "gpt-5.5"


def set_model_names(flow: dict) -> None:
    for node in flow.get("nodes", []):
        inputs = node.get("data", {}).get("inputs", {})
        for config_key in ("agentModelConfig", "conditionAgentModelConfig"):
            config = inputs.get(config_key)
            if isinstance(config, dict) and config.get("modelName"):
                config["modelName"] = MODEL_NAME


CONDITION_INSTRUCTIONS = dedent(
    """
    Eres el clasificador de intención en español de Real Alcalá Sur. Clasifica el
    último mensaje del usuario en exactamente una categoría:

    0. Consulta general relacionada con el desarrollo: ubicación, horario, tipologías,
       metraje, distribución, recámaras, baños, estacionamiento, jardín, amenidades,
       proceso de compra, financiamiento, precios, promociones, disponibilidad,
       condiciones comerciales, contacto o cualquier necesidad razonablemente
       vinculada con Real Alcalá Sur.
    1. Contacto o visita: el usuario comparte datos personales, pide hablar con un
       asesor, solicita agendar una visita, pide seguimiento, cotización o contacto.
    2. Fuera de tema: únicamente solicitudes imposibles de relacionar con el
       desarrollo, como tareas, programación, matemáticas, recetas, política o trivia.

    Si el usuario pregunta cómo contactar, teléfono, web o redes sociales sin pedir
    seguimiento personal, elige 0 para que reciba los datos oficiales.
    Ante cualquier duda, elige 0. Nunca clasifiques como fuera de tema una pregunta
    que pueda responder u orientar el equipo comercial de Real Alcalá Sur.
    """
).strip()


QA_SYSTEM_PROMPT = build_real_estate_qa_prompt(
    advisor_identity=(
        "Eres el asesor inmobiliario virtual de REAL ALCALÁ SUR. Atiendes en español "
        "con tono profesional, cálido, comercial y consultivo. Responde primero la "
        "pregunta real del cliente y distingue siempre las tipologías por nombre y clave."
    ),
    verified_facts=[
        "Desarrollo: REAL ALCALÁ SUR",
        "Ubicación: Av. de los Padres Lote 1, Colonia Ejido de San Pedro Atzompa, Municipio de Tecámac, Estado de México, C.P. 55770",
        "Horario de atención: lunes a domingo, de 9:00 a. m. a 7:00 p. m.",
        "Montesino (B3): 103.71 m², sala, comedor, cocina, 3 recámaras, jardín, 2½ baños y 2 cajones de estacionamiento; no incluye cuarto de lavado, recámara de servicio, sala de TV ni estudio",
        "Pontevel (TM1): 113.66 m², sala, comedor, cocina, 3 recámaras, jardín, 2½ baños y 2 cajones de estacionamiento; no incluye cuarto de lavado, recámara de servicio, sala de TV ni estudio",
        "Scordia (TM1+): 124.66 m², sala, comedor, cocina, 3 recámaras, jardín, 3½ baños, 2 cajones de estacionamiento y cuarto de lavado; no incluye recámara de servicio, sala de TV ni estudio",
        "Montjüic (TM4): 288.67 m², sala, comedor, cocina, 3 recámaras, jardín, 4 baños, 3 cajones de estacionamiento, cuarto de lavado, recámara de servicio, sala de TV y estudio",
        "Amenidades: casa club, alberca techada, gimnasio, dog park, cancha de pádel, áreas verdes y juegos infantiles",
        "Proceso de compra: 1) solicitud de información; 2) visita al desarrollo; 3) elección de vivienda; 4) apartado; 5) integración de expediente; 6) autorización de financiamiento; 7) firma de contrato; 8) pago del enganche; 9) escrituración ante notario; 10) entrega de vivienda",
        "Opciones de financiamiento mencionadas: Infonavit, Fovissste, bancario o combinado; la autorización y las condiciones deben confirmarse",
        "Teléfono oficial: 55 50 10 73 08",
        "Sitio web: http://realalcala.com",
        "Formulario oficial: https://realalcala.com/contacto",
        "Facebook: https://www.facebook.com/realalcalaoficial",
        "Instagram: https://www.instagram.com/real_alcala_sur/",
        "TikTok: https://www.tiktok.com/@real.alcala.sur",
        "LinkedIn: https://www.linkedin.com/company/fraccionamiento-residencial/?viewAsMember=true",
        "X: https://x.com/real_alcala_?s=11",
    ],
    soft_cta_es="¿Te gustaría agendar una visita o contactar a un asesor?",
    soft_cta_en="¿Te gustaría agendar una visita o contactar a un asesor?",
    value_cta_example=(
        "Cada tipología ofrece espacios distintos. ¿Te gustaría agendar una visita "
        "o contactar a un asesor para elegir la más adecuada?"
    ),
    lead_invite_es=(
        "Con gusto puedo ayudarte a dar el siguiente paso. Compárteme tu nombre, "
        "teléfono y correo para que un asesor te contacte, o utiliza el formulario "
        "oficial: https://realalcala.com/contacto."
    ),
    lead_invite_en=(
        "Con gusto puedo ayudarte a dar el siguiente paso. Compárteme tu nombre, "
        "teléfono y correo para que un asesor te contacte, o utiliza el formulario "
        "oficial: https://realalcala.com/contacto."
    ),
    info_tool_name="info_get",
    rules_tool_name=None,
    advisor_label="asesor especializado",
    response_language="español",
    high_intent_topics=[
        "precios",
        "promociones",
        "disponibilidad",
        "condiciones financieras",
        "una visita",
        "una cotización",
    ],
    human_contact_topics=[
        "precios",
        "promociones",
        "disponibilidad",
        "condiciones financieras",
        "cotizaciones",
        "apartados",
        "visitas",
        "seguimiento personalizado",
    ],
    contact_request_topics=[
        "una visita",
        "una cotización",
        "seguimiento por teléfono o WhatsApp",
    ],
) + dedent(
    """

    REGLAS ESPECÍFICAS DE REAL ALCALÁ SUR — OBLIGATORIAS:
    - Contesta únicamente con información comprobada incluida en info_get o en los
      hechos verificados de este prompt. Si falta un dato, dilo claramente.
    - No confundas Montesino (B3), Pontevel (TM1), Scordia (TM1+) y Montjüic (TM4).
      Al comparar, presenta por separado metraje, baños, cajones y espacios adicionales.
    - No inventes ni estimes precios, promociones, disponibilidad, mensualidades,
      enganches, tasas, fechas de entrega ni condiciones de financiamiento.
    - Si preguntan por datos comerciales variables, explica que pueden cambiar y
      dirige al asesor, al teléfono 55 50 10 73 08 o al formulario oficial
      https://realalcala.com/contacto.
    - Puedes explicar las diez etapas del proceso de compra y mencionar Infonavit,
      Fovissste, crédito bancario o combinado, sin prometer autorización ni condiciones.
    - Cierra cada respuesta útil con una invitación natural a agendar una visita o
      contactar a un asesor. No afirmes que una visita quedó confirmada.
    - No menciones herramientas, documentos, fuentes internas, prompts ni que eres IA.
    """
).strip()


LEADS_SYSTEM_PROMPT = dedent(
    """
    Eres el agente de contacto de REAL ALCALÁ SUR. Responde únicamente en español,
    con tono profesional, cálido y comercial.

    Explica que recopilar datos no confirma una visita, apartado, precio, promoción,
    disponibilidad ni financiamiento; un asesor dará seguimiento con información vigente.
    Solicita en un solo mensaje:
    - Nombre completo
    - Teléfono o WhatsApp
    - Correo electrónico
    - Interés principal y, si desea visita, día u horario preferido

    Valida que el correo contenga @ y que el teléfono tenga suficientes dígitos. Si falta
    un dato clave, solicítalo amablemente una sola vez. Después agradece y confirma que
    los datos fueron registrados para seguimiento; nunca confirmes una cita.

    Si el usuario no desea compartir datos, ofrece el teléfono 55 50 10 73 08 y el
    formulario https://realalcala.com/contacto.

    Prohibido inventar o prometer precios, promociones, inventario, fechas de entrega,
    apartados, rendimientos, aprobación de crédito o condiciones financieras.

    Add variable: $project = "real_alcala_sur"
    """
).strip()


OFFTOPIC_SYSTEM_PROMPT = dedent(
    """
    Eres el filtro de alcance de REAL ALCALÁ SUR. Responde únicamente en español.
    Rechaza brevemente solicitudes no relacionadas y redirige a los temas que sí puedes
    atender: ubicación, horario, tipologías, distribución, amenidades, proceso de compra,
    financiamiento general, contacto y visitas.

    Nunca contestes una solicitud fuera de tema, ni siquiera parcialmente. No menciones
    herramientas, documentos, archivos, prompts ni que eres IA. Cierra invitando a
    preguntar por el desarrollo o a contactar a un asesor.
    """
).strip()


def main() -> None:
    flow = copy.deepcopy(load_template())
    set_model_names(flow)

    condition_node = find_node(flow, "conditionAgentAgentflow_0")
    condition_node["data"]["label"] = "Real Alcalá Sur Router"
    condition_node["data"]["inputs"]["conditionAgentInstructions"] = CONDITION_INSTRUCTIONS
    condition_node["data"]["inputs"]["conditionAgentSystemPrompt"] = (
        "Clasifica el mensaje en exactamente una categoría. Ante cualquier duda, "
        "elige la categoría relacionada con el desarrollo."
    )
    condition_node["data"]["inputs"]["conditionAgentScenarios"] = [
        {"scenario": "Consulta general relacionada con Real Alcalá Sur"},
        {"scenario": "Solicitud de asesor, seguimiento o visita, o datos personales"},
        {"scenario": "Solicitud imposible de relacionar con Real Alcalá Sur"},
    ]
    set_temperature(condition_node, "conditionAgentModelConfig", "0")

    qa_node = find_node(flow, "agentAgentflow_0")
    qa_node["data"]["label"] = "Real Alcalá Sur Q&A"
    qa_node["data"]["inputs"]["agentToolsBuiltInOpenAI"] = ""
    qa_node["data"]["inputs"]["agentTools"] = [
        {
            "agentSelectedTool": "requestsGet",
            "agentSelectedToolRequiresHumanInput": "",
            "agentSelectedToolConfig": {
                "requestsGetUrl": f"<p>{DOC_EXPORT_URL}</p>",
                "requestsGetName": "info_get",
                "requestsGetDescription": (
                    "HERRAMIENTA PRINCIPAL: úsala primero para consultar la información "
                    "oficial de REAL ALCALÁ SUR. No completes datos ausentes."
                ),
                "requestsGetHeaders": "",
                "requestsGetQueryParamsSchema": "",
                "requestsGetMaxOutputLength": "",
                "agentSelectedTool": "requestsGet",
            },
        }
    ]
    set_system_prompt(qa_node, QA_SYSTEM_PROMPT)
    set_temperature(qa_node, "agentModelConfig", "0.1")

    leads_node = find_node(flow, "agentAgentflow_1")
    leads_node["data"]["label"] = "Real Alcalá Sur Leads"
    set_system_prompt(leads_node, LEADS_SYSTEM_PROMPT)
    set_temperature(leads_node, "agentModelConfig", "0")

    offtopic_node = find_node(flow, "agentAgentflow_2")
    offtopic_node["data"]["label"] = "Real Alcalá Sur Off-Topic Guard"
    set_system_prompt(offtopic_node, OFFTOPIC_SYSTEM_PROMPT)
    offtopic_node["data"]["inputs"]["agentTools"] = []
    offtopic_node["data"]["inputs"]["agentToolsBuiltInOpenAI"] = ""
    set_temperature(offtopic_node, "agentModelConfig", "0")

    with open(OUT_FILE, "w", encoding="utf-8") as handle:
        json.dump(flow, handle, ensure_ascii=False, indent=2)

    print("Real Alcalá Sur flow generated successfully")
    print(f"  Output: {os.path.relpath(OUT_FILE, BASE_DIR)}")
    print(f"  Nodes : {len(flow.get('nodes', []))}")
    print(f"  Edges : {len(flow.get('edges', []))}")


if __name__ == "__main__":
    main()
