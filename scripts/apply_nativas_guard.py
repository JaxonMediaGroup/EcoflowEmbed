"""
Apply the Nativas-style anti-hallucination architecture to multiple agent JSONs.

For each project:
  1. Lower temperature of the main Q&A agent to 0.1 (was 0.2-0.9)
  2. Inject a second system message with the ANTI-INFERENCIA + anti-hallucination
     rule block (taken from Nativas and adapted to the project)
  3. Add a Multilingual Condition Agent (temp=0) that routes to:
       - scenario 0 -> the existing Q&A agent
       - scenario 1 -> a project-personalized Off-Topic Guard (temp=0)
  4. Backup the original file to projects/.archive/<timestamp>/<file>
"""
from __future__ import annotations

import copy
import json
import re
import shutil
from datetime import datetime
from pathlib import Path
from typing import Any

PROJECTS_DIR = Path(r"C:\Users\Guillermo\Downloads\Chatbots\projects")
ARCHIVE_DIR = PROJECTS_DIR / ".archive"


# ---------------------------------------------------------------------------
# Per-project personalization
# ---------------------------------------------------------------------------
# type = "real_estate" | "university" -- changes the topic lists
# topics_es / topics_en = the bullet list shown in the guard greeting
# contact = shown in the off-topic redirect
# classifier_examples = a few golden examples for the condition agent
# anti_inference_prompt = the project-specific anti-hallucination rules

PROJECT_CONFIGS: list[dict[str, Any]] = [
    {
        "file": "Brisas Ixtapa Agents.json",
        "project_name": "Brisas Ixtapa",
        "type": "real_estate",
        "topics_es": [
            "Ubicación en Ixtapa-Zihuatanejo y cómo llegar",
            "Lotes y residenciales disponibles",
            "Amenidades, club de playa, vistas al océano",
            "Precios, financiamiento y planes de pago",
            "Proceso de compra y preventa",
            "Información de contacto y visitas",
        ],
        "topics_en": [
            "Location in Ixtapa-Zihuatanejo and how to get there",
            "Available lots and residences",
            "Amenities, beach club, ocean views",
            "Pricing, financing and payment plans",
            "Purchase and presale process",
            "Contact info and visit scheduling",
        ],
        "contact_es": "Contacta a un asesor comercial de Brisas Ixtapa para información personalizada.",
        "contact_en": "Contact a Brisas Ixtapa sales advisor for personalized information.",
        "model": "gpt-5.1",
    },
    {
        "file": "Anahuac Orientador Vocacional Agents.json",
        "project_name": "Universidad Anáhuac México",
        "type": "university",
        "topics_es": [
            "Carreras y licenciaturas disponibles",
            "Planes de estudio y mallas curriculares",
            "Proceso de admisión y fechas clave",
            "Becas, financiamiento y mensualidades",
            "Campus, modalidades (presencial / en línea / mixta)",
            "Vida universitaria, intercambios y deportes",
        ],
        "topics_en": [
            "Available undergraduate programs and majors",
            "Curriculum and study plans",
            "Admission process and key dates",
            "Scholarships, financial aid and tuition",
            "Campuses and modalities (on-site / online / hybrid)",
            "Student life, exchanges and sports",
        ],
        "contact_es": "Para información personalizada sobre admisión, contacta a la Universidad Anáhuac: 5628 8800 / 5627 0210.",
        "contact_en": "For personalized admissions info, contact Universidad Anáhuac: 5628 8800 / 5627 0210.",
        "model": "gpt-5.2",
    },
    {
        "file": "NIZUC Agents.json",
        "project_name": "Nizuc",
        "type": "real_estate",
        "topics_es": [
            "Ubicación y accesos al desarrollo",
            "Tipologías de lotes y departamentos",
            "Amenidades, lagunas y zonas verdes",
            "Precios, financiamiento y preventa",
            "Proceso de compra y contrato",
            "Información de contacto y citas",
        ],
        "topics_en": [
            "Location and access to the development",
            "Lot and apartment typologies",
            "Amenities, lagoons and green areas",
            "Pricing, financing and presale",
            "Purchase and contract process",
            "Contact info and appointment booking",
        ],
        "contact_es": "Para información personalizada, contacta a un asesor comercial de Nizuc.",
        "contact_en": "For personalized information, contact a Nizuc sales advisor.",
        "model": "gpt-5.2",
    },
    {
        "file": "Quvira Showrom Agents.json",
        "project_name": "Quivira",
        "type": "real_estate",
        "topics_es": [
            "Ubicación del parque industrial",
            "Lotes y naves industriales disponibles",
            "Infraestructura, servicios y amenidades",
            "Precios, financiamiento y opciones de arrendamiento",
            "Comparativa con Coronado, Mavila y otros desarrollos",
            "Proceso comercial y contacto",
        ],
        "topics_en": [
            "Industrial park location",
            "Available industrial lots and buildings",
            "Infrastructure, services and amenities",
            "Pricing, financing and lease options",
            "Comparison with Coronado, Mavila and other developments",
            "Sales process and contact",
        ],
        "contact_es": "Para información personalizada, contacta a un asesor comercial de Quivira.",
        "contact_en": "For personalized information, contact a Quivira sales advisor.",
        "model": "gpt-5.1",
    },
    {
        "file": "Ribra - Arcos Bosques Agents.json",
        "project_name": "Ribra - Arcos Bosques",
        "type": "real_estate",
        "topics_es": [
            "Ubicación en Arcos Bosques y accesos",
            "Tipologías de departamentos",
            "Amenidades, áreas comunes y servicios",
            "Precios, financiamiento y planes de pago",
            "Proceso de compra y entrega",
            "Información de contacto y visitas",
        ],
        "topics_en": [
            "Location in Arcos Bosques and access",
            "Apartment typologies",
            "Amenities, common areas and services",
            "Pricing, financing and payment plans",
            "Purchase and delivery process",
            "Contact info and visit scheduling",
        ],
        "contact_es": "Para información personalizada, contacta a un asesor comercial de Ribra - Arcos Bosques.",
        "contact_en": "For personalized information, contact a Ribra - Arcos Bosques sales advisor.",
        "model": "gpt-5.1",
    },
    {
        "file": "SLS - Residences, yacht & sail club Agents.json",
        "project_name": "SLS - Residences, yacht & sail club",
        "type": "real_estate",
        "topics_es": [
            "Ubicación y acceso al desarrollo",
            "Residencias de lujo y tipologías",
            "Yacht & sail club y amenidades premium",
            "Precios, financiamiento y preventa",
            "Proceso de compra y contrato",
            "Información de contacto y visitas",
        ],
        "topics_en": [
            "Location and access to the development",
            "Luxury residences and typologies",
            "Yacht & sail club and premium amenities",
            "Pricing, financing and presale",
            "Purchase and contract process",
            "Contact info and visit scheduling",
        ],
        "contact_es": "Para información personalizada, contacta a un asesor comercial de SLS Residences.",
        "contact_en": "For personalized information, contact an SLS Residences sales advisor.",
        "model": "gpt-5.1",
    },
    {
        "file": "Terralago Agents.json",
        "project_name": "Terralago",
        "type": "real_estate",
        "topics_es": [
            "Ubicación en Lomas Verdes / Presa Madín y accesos",
            "Lotes unifamiliares y plurifamiliares",
            "Amenidades, parques y más de 75,000 m² de áreas verdes",
            "Precios desde $4.5M MXN y financiamiento",
            "Proceso de preventa y contrato",
            "Certificación LEED Gold y sustentabilidad",
            "Contacto: 55 7948 2065 | ventas@terralago.mx",
        ],
        "topics_en": [
            "Location in Lomas Verdes / Presa Madín and access",
            "Single-family and multi-family lots",
            "Amenities, parks and 75,000+ m² of green areas",
            "Pricing from $4.5M MXN and financing",
            "Presale and contract process",
            "LEED Gold certification and sustainability",
            "Contact: 55 7948 2065 | ventas@terralago.mx",
        ],
        "contact_es": "Para información personalizada, contacta a ventas: 55 7948 2065 | ventas@terralago.mx",
        "contact_en": "For personalized information, contact sales: 55 7948 2065 | ventas@terralago.mx",
        "model": "gpt-5.1",
    },
]


# ---------------------------------------------------------------------------
# Templates
# ---------------------------------------------------------------------------

def build_classifier(cfg: dict) -> str:
    """Multilingual condition agent instructions, personalized for the project."""
    pn = cfg["project_name"]
    return f"""<p>You are a multilingual intent classifier for <strong>{pn}</strong>. Your job is to understand what the user needs and route them to the correct agent.</p>

<p><strong>Categories:</strong></p>
<ol start="0">
<li><strong>In-scope</strong> - Any question that CAN be related to {pn}: features, products, services, processes, contact info, visiting, financing, history, certifications, location, nearby services, or lifestyle topics that the project agent can connect back to the project. Works in any language.</li>
<li><strong>Off-topic</strong> - ONLY when the question is IMPOSSIBLE to relate to {pn}: homework, programming code, math equations, step-by-step recipes, text translations, historical biographies, creative poetry, sports scores, politics, AI help, health advice, weather.</li>
</ol>

<p><strong>Classification examples:</strong></p>
<ul>
<li>"What is {pn}?" &rarr; 0</li>
<li>"How can I contact {pn}?" &rarr; 0</li>
<li>"Tell me about pricing/financing" &rarr; 0</li>
<li>"I want to schedule a visit" &rarr; 0</li>
</ul>

<p><strong>SMART ROUTING:</strong></p>
<p>The user is ALREADY talking to the {pn} assistant. If the user mentions a personal interest or lifestyle, the project agent can connect it back to {pn}. Give it the chance to do so.</p>

<p><strong>These ARE in-scope (&rarr; 0):</strong></p>
<ul>
<li>Any question about {pn} features, services, or contact</li>
<li>Lifestyle questions that can be tied to the project (security, location, investment, family life, sustainability)</li>
<li>Investment, financing, or presale questions</li>
</ul>

<p><strong>These ARE off-topic (&rarr; 1):</strong></p>
<ul>
<li>"Solve 2x+3=7" &rarr; 1</li>
<li>"Write me Python code" &rarr; 1</li>
<li>"Give me a chocolate cake recipe" &rarr; 1</li>
<li>"Help me with my history homework" &rarr; 1</li>
<li>"Tell me Einstein's biography" &rarr; 1</li>
<li>"Write me a love poem" &rarr; 1</li>
<li>"Translate this to Japanese" &rarr; 1</li>
<li>"What's the square root of 144?" &rarr; 1</li>
</ul>

<p><strong>GOLDEN RULE:</strong> When in doubt, ALWAYS route to category 0. The {pn} agent knows how to connect lifestyle topics to the project. Only route to 1 if it is clearly ACADEMIC, TECHNICAL, or a knowledge request that has nothing to do with {pn}.</p>

<p><strong>LANGUAGE NOTE:</strong> Classify by intent, NOT by language. If the user writes in English, French, Chinese, Arabic, or any language, classify the same way. The downstream agents handle multilingual responses.</p>"""


def build_guard(cfg: dict) -> str:
    """Project-personalized off-topic guard prompt."""
    pn = cfg["project_name"]
    topics_es = cfg["topics_es"]
    topics_en = cfg["topics_en"]
    contact_es = cfg["contact_es"]
    contact_en = cfg["contact_en"]

    topics_es_html = "".join(f"<li>{t}</li>" for t in topics_es)
    topics_en_html = "".join(f"<li>{t}</li>" for t in topics_en)

    return f"""<p>Eres el GUARDIA DE ALCANCE del chatbot de <strong>{pn}</strong>.</p>

<p><strong>STRICT LANGUAGE RULE:</strong> Detect the user's language and respond ENTIRELY in that language. If they write in Chinese, respond in Chinese. In French, respond in French. NEVER mix languages. If the user switches language, switch immediately.</p>

<p>TU ÚNICO TRABAJO: Rechazar amablemente preguntas fuera de tema y redirigir al usuario a temas de {pn}.</p>

<p>REGLAS DE RESPUESTA:</p>

<p>1. Si el usuario envía un SALUDO (Hola, Hi, Hello, Buenos días, etc.), responde:</p>
<p>'¡Hola! Soy el asistente virtual de <strong>{pn}</strong>. ¿En qué puedo ayudarte?</p>
<p>Puedo ayudarte con:<br>
{topics_es_html[:0]}<ul>
{topics_es_html}
</ul></p>

<p>2. Para CUALQUIER pregunta fuera de tema, responde:</p>
<p>'Soy el asistente virtual de <strong>{pn}</strong> y solo puedo ayudarte con temas relacionados al desarrollo.</p>
<p>Puedo ayudarte con:<br>
<ul>
{topics_es_html}
</ul></p>
<p>{contact_es}</p>
<p>¿Tienes alguna pregunta sobre {pn}?'</p>

<p>3. ADAPTA el idioma al del usuario:</p>
<ul>
<li>English &mdash; use these topics:
<ul>
{topics_en_html}
</li>
</ul>
</li>
<li>French, Portuguese, etc. &mdash; translate the topics to the user's language</li>
<li>Always match the user's language</li>
</ul>

<p>ESTRICTAMENTE PROHIBIDO:</p>
<ul>
<li>NUNCA respondas preguntas fuera de tema, ni siquiera parcialmente</li>
<li>NUNCA digas 'No sé pero...' y luego respondas</li>
<li>NUNCA uses búsqueda web ni herramientas externas</li>
<li>NUNCA proporciones conocimiento general</li>
<li>Mantén las respuestas CORTAS y siempre redirige a temas de {pn}</li>
</ul>"""


def build_anti_hallucination_block(cfg: dict) -> str:
    """Second system message with the Nativas-style anti-hallucination rules.

    Project-personalized: replaces {PROJECT} with the actual name.
    """
    pn = cfg["project_name"]
    if cfg["type"] == "university":
        subject = "academic programs, admissions, scholarships, campuses, and student services"
    else:
        subject = "the project: lots, residences, amenities, location, pricing, financing, presale, contact, and visit scheduling"

    return f"""REGLA OPERATIVA CRÍTICA — ANTI-ALUCINACIÓN para {pn}:

1. **FUENTE ÚNICA:** Tu ÚNICA fuente de información verificada son las herramientas oficiales configuradas para {pn} (info_get y similares). NUNCA uses conocimiento general, entrenamiento previo, patrones de industria, proyectos comparables ni razonamiento indirecto para afirmar datos sobre {pn}.

2. **CUANDO LA HERRAMIENTA FALLA O NO TIENE EL DATO:** Responde de forma breve y honesta:
   ES: "Información pendiente: ________. Te recomiendo validarlo directamente con un asesor comercial de {pn}."
   EN: "Information pending: ________. I recommend validating directly with a {pn} sales advisor."

3. **ANTI-INFERENCIA — PROHIBIDO INFERIR:** NUNCA completes datos con:
   - Conocimiento general del modelo
   - Patrones típicos del sector
   - Proyectos comparables
   - Prácticas de mercado
   - Datos parciales o razonamiento indirecto
   
   SOLO afirma información verificada explícitamente en las fuentes oficiales de {pn}. Si la fuente oficial no lo tiene, dilo — NO llenes el vacío con deducciones plausibles.

4. **INFORMACIÓN DINÁMICA — NUNCA CONFIRMAR COMO HECHO:**
   - Precios, disponibilidad, inventario, promociones, descuentos
   - Condiciones de pago, financiamiento, tasas
   - Fechas de entrega, etapas de lanzamiento
   - Amenidades pendientes de confirmar
   - Datos de contacto (teléfonos, correos) que no estén en la fuente
   
   Siempre redirige: "Esta información puede variar. Te recomiendo validarla directamente con un asesor comercial."

5. **PROHIBICIONES EXPLÍCITAS — NUNCA prometas ni afirmes:**
   - Plusvalía o rendimientos financieros
   - Fechas de entrega no confirmadas
   - Amenidades no cerradas
   - Precios no validados por la fuente oficial
   - Disponibilidad sin inventario actualizado
   - Condiciones hipotecarias no confirmadas
   - Promociones o descuentos no vigentes

6. **FRASES PROHIBIDAS EN TU RESPUESTA:**
   - NUNCA digas: "según el documento", "el documento menciona", "de acuerdo con el documento", "no se menciona en el documento", "no viene en el documento", "the document states", "based on the provided document", "according to the document"
   - NUNCA reveles que estás consultando un documento, archivo o fuente de datos
   - Responde naturalmente como un asesor experto que conoce el proyecto

7. **IDIOMA:** Detecta el idioma del ÚLTIMO mensaje del usuario y responde ENTERAMENTE en ese idioma. Si cambia de idioma entre mensajes, cambia tú también inmediatamente.

8. **ALCANCE — TEMAS QUE SÍ MANEJAS:** {subject}. Para cualquier otro tema, redirige amablemente al tema del proyecto o al área correspondiente.

9. **ESTILO:** Tono amable, profesional, breve. Sin exageraciones comerciales. Sin promesas. Sin lenguaje ambiguo. Enfócate en resolver dudas reales con datos verificados.

10. **ESCALAMIENTO:** Si el usuario pide cotización detallada, disponibilidad exacta, negociación o seguimiento comercial, sugiere amablemente el contacto con un asesor comercial."""


# ---------------------------------------------------------------------------
# Node templates
# ---------------------------------------------------------------------------

def make_condition_node(cfg: dict) -> dict:
    return {
        "id": "conditionAgentAgentflow_0",
        "type": "agentFlow",
        "position": {"x": 100, "y": 81.5},
        "width": 202,
        "height": 75,
        "selected": False,
        "positionAbsolute": {"x": 100, "y": 81.5},
        "dragging": False,
        "data": {
            "id": "conditionAgentAgentflow_0",
            "label": "Multilingual Condition Agent",
            "version": 2,
            "name": "conditionAgentAgentflow",
            "type": "ConditionAgent",
            "color": "#ff8fab",
            "baseClasses": ["ConditionAgent"],
            "category": "Agent Flows",
            "description": f"Route user messages to the {cfg['project_name']} Q&A agent or to the off-topic guard.",
            "inputParams": [
                {"label": "Model", "name": "conditionAgentModel", "type": "asyncOptions", "loadMethod": "listModels", "loadConfig": True, "id": "conditionAgentAgentflow_0-input-conditionAgentModel-asyncOptions", "display": True},
                {"label": "Instructions", "name": "conditionAgentInstructions", "type": "string", "rows": 4, "optional": True, "acceptVariable": True, "id": "conditionAgentAgentflow_0-input-conditionAgentInstructions-string", "display": True},
                {"label": "Input", "name": "conditionAgentInput", "type": "string", "rows": 4, "optional": True, "acceptVariable": True, "id": "conditionAgentAgentflow_0-input-conditionAgentInput-string", "display": True},
                {"label": "Conditions", "name": "conditionAgentScenarios", "type": "array", "optional": True, "array": [{"label": "Condition", "name": "scenario", "type": "string", "rows": 2, "placeholder": "Scenario for this output"}], "id": "conditionAgentAgentflow_0-input-conditionAgentScenarios-array", "display": True},
                {"label": "Override System Prompt", "name": "conditionAgentOverrideSystemPrompt", "type": "string", "rows": 4, "optional": True, "id": "conditionAgentAgentflow_0-input-conditionAgentOverrideSystemPrompt-string", "display": True},
            ],
            "inputAnchors": [],
            "inputs": {
                "conditionAgentModel": "chatOpenAI",
                "conditionAgentInstructions": build_classifier(cfg),
                "conditionAgentInput": '<p><span class="variable" data-type="mention" data-id="question" data-label="question">{{ question }}</span> </p>',
                "conditionAgentScenarios": [
                    {"scenario": f"General question about {cfg['project_name']} (features, services, location, pricing, contact, financing, presale, admissions, etc.) - in any language"},
                    {"scenario": f"User asks something COMPLETELY UNRELATED to {cfg['project_name']} (homework, coding, math, recipes, general trivia, jokes, translations, weather, sports, politics, AI, health advice, or ANY topic not about this project) - in any language"},
                ],
                "conditionAgentOverrideSystemPrompt": "",
                "conditionAgentModelConfig": {
                    "cache": "", "modelName": cfg["model"], "temperature": "0",
                    "streaming": True, "maxTokens": "", "topP": "",
                    "frequencyPenalty": "", "presencePenalty": "", "timeout": "",
                    "strictToolCalling": "", "stopSequence": "", "basepath": "",
                    "proxyUrl": "", "baseOptions": "", "allowImageUploads": "",
                    "reasoning": "", "conditionAgentModel": "chatOpenAI",
                },
            },
            "outputAnchors": [
                {"id": "conditionAgentAgentflow_0-output-0", "label": "0", "name": "0"},
                {"id": "conditionAgentAgentflow_0-output-1", "label": "1", "name": "1"},
            ],
            "outputs": {},
            "selected": False,
        },
    }


def make_guard_node(cfg: dict) -> dict:
    return {
        "id": "agentAgentflow_1",
        "type": "agentFlow",
        "position": {"x": 370, "y": 180},
        "width": 167,
        "height": 100,
        "selected": False,
        "positionAbsolute": {"x": 370, "y": 180},
        "dragging": False,
        "data": {
            "id": "agentAgentflow_1",
            "label": f"Off-Topic Guard (Multilingual) - {cfg['project_name']}",
            "version": 3.2,
            "name": "agentAgentflow",
            "type": "Agent",
            "color": "#FF6B6B",
            "baseClasses": ["Agent"],
            "category": "Agent Flows",
            "description": f"Blocks off-topic questions and redirects users to {cfg['project_name']} topics.",
            "inputParams": [],
            "inputAnchors": [],
            "inputs": {
                "agentModel": "chatOpenAI",
                "agentMessages": [{"role": "system", "content": build_guard(cfg)}],
                "agentToolsBuiltInOpenAI": "",
                "agentToolsBuiltInGemini": "",
                "agentToolsBuiltInAnthropic": "",
                "agentTools": [],
                "agentKnowledgeDocumentStores": [],
                "agentKnowledgeVSEmbeddings": [],
                "agentEnableMemory": True,
                "agentMemoryType": "windowSize",
                "agentMemoryWindowSize": "20",
                "agentMemoryMaxTokenLimit": "2000",
                "agentUserMessage": "",
                "agentReturnResponseAs": "userMessage",
                "agentStructuredOutput": "",
                "agentUpdateState": "",
                "agentModelConfig": {
                    "cache": "", "modelName": cfg["model"], "temperature": "0",
                    "streaming": True, "maxTokens": "", "topP": "",
                    "frequencyPenalty": "", "presencePenalty": "", "timeout": "",
                    "strictToolCalling": "", "stopSequence": "", "basepath": "",
                    "proxyUrl": "", "baseOptions": "", "allowImageUploads": "",
                    "reasoning": "", "agentModel": "chatOpenAI",
                },
            },
            "outputAnchors": [
                {"id": "agentAgentflow_1-output-agentAgentflow", "label": "Agent", "name": "agentAgentflow"},
            ],
            "outputs": {},
            "selected": False,
        },
    }


# ---------------------------------------------------------------------------
# Patch pipeline
# ---------------------------------------------------------------------------

def find_qa_agent_id(data: dict) -> str:
    """Return the id of the first Agent node that isn't a guard."""
    for n in data["nodes"]:
        if n["data"].get("type") == "Agent":
            label = (n["data"].get("label") or "").lower()
            if "guard" in label or "off-topic" in label:
                continue
            return n["id"]
    raise RuntimeError("No Q&A agent found")


def find_qa_agent(data: dict) -> dict:
    for n in data["nodes"]:
        if n["data"].get("type") == "Agent":
            label = (n["data"].get("label") or "").lower()
            if "guard" in label or "off-topic" in label:
                continue
            return n
    raise RuntimeError("No Q&A agent found")


def patch_qa_agent(data: dict, cfg: dict) -> tuple[bool, str, str]:
    """Lower temperature and inject anti-hallucination block. Returns (changed, old_temp, new_temp)."""
    qa = find_qa_agent(data)
    inputs = qa["data"]["inputs"]
    cfg_mc = inputs.get("agentModelConfig") or {}
    old_temp = str(cfg_mc.get("temperature", "?"))
    new_temp = "0.1"
    cfg_mc["temperature"] = new_temp
    if "modelName" in cfg_mc and not cfg_mc.get("modelName"):
        cfg_mc["modelName"] = cfg["model"]
    inputs["agentModelConfig"] = cfg_mc

    # Inject / replace the anti-hallucination second system message
    msgs = inputs.get("agentMessages") or []
    block = build_anti_hallucination_block(cfg)
    # Look for an existing "REGLA OPERATIVA" or "ANTI-ALUCINACIÓN" system message
    replaced = False
    for m in msgs:
        if m.get("role") == "system":
            content = m.get("content", "")
            if "ANTI-ALUCINACIÓN" in content or "REGLA OPERATIVA" in content:
                m["content"] = block
                replaced = True
                break
    if not replaced:
        msgs.append({"role": "system", "content": block})
    inputs["agentMessages"] = msgs
    return old_temp != new_temp, old_temp, new_temp


def rewire(data: dict, cfg: dict) -> None:
    """Replace edges to route Start -> Condition -> [Q&A, Guard]."""
    qa_id = find_qa_agent_id(data)
    new_edges = [
        {
            "source": "startAgentflow_0",
            "sourceHandle": "startAgentflow_0-output-startAgentflow",
            "target": "conditionAgentAgentflow_0",
            "targetHandle": "conditionAgentAgentflow_0",
            "data": {"sourceColor": "#7EE787", "targetColor": "#ff8fab", "isHumanInput": False},
            "type": "agentFlow",
            "id": "startAgentflow_0-startAgentflow_0-output-startAgentflow-conditionAgentAgentflow_0-conditionAgentAgentflow_0",
        },
        {
            "source": "conditionAgentAgentflow_0",
            "sourceHandle": "conditionAgentAgentflow_0-output-0",
            "target": qa_id,
            "targetHandle": qa_id,
            "data": {"sourceColor": "#ff8fab", "targetColor": "#4DD0E1", "edgeLabel": "0", "isHumanInput": False},
            "type": "agentFlow",
            "id": f"conditionAgentAgentflow_0-conditionAgentAgentflow_0-output-0-{qa_id}-{qa_id}",
        },
        {
            "source": "conditionAgentAgentflow_0",
            "sourceHandle": "conditionAgentAgentflow_0-output-1",
            "target": "agentAgentflow_1",
            "targetHandle": "agentAgentflow_1",
            "data": {"sourceColor": "#ff8fab", "targetColor": "#FF6B6B", "edgeLabel": "1", "isHumanInput": False, "edgeStyle": "default"},
            "type": "agentFlow",
            "id": "reactflow__edge-conditionAgentAgentflow_0-conditionAgentAgentflow_0-output-1-agentAgentflow_1-agentAgentflow_1",
            "style": {"stroke": "#FF6B6B", "strokeWidth": 2},
        },
    ]
    data["edges"] = new_edges


def backup(path: Path) -> Path:
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    dest_dir = ARCHIVE_DIR / ts
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / path.name
    shutil.copy2(path, dest)
    return dest


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def process(cfg: dict) -> dict:
    path = PROJECTS_DIR / cfg["file"]
    if not path.exists():
        return {"file": cfg["file"], "status": "MISSING"}

    # Skip if already patched
    raw = path.read_text(encoding="utf-8")
    if "agentAgentflow_1" in raw and "Off-Topic Guard" in raw and "conditionAgentAgentflow_0" in raw:
        return {"file": cfg["file"], "status": "SKIPPED (already patched)"}

    bkp = backup(path)
    data = json.loads(raw)

    # 1. Patch Q&A agent (temperature + anti-hallucination block)
    changed, old_temp, new_temp = patch_qa_agent(data, cfg)

    # 2. Reposition existing Q&A agent slightly right for cleaner layout
    qa = find_qa_agent(data)
    qa["position"] = {"x": 370, "y": -10}
    qa["positionAbsolute"] = {"x": 370, "y": -10}

    # 3. Add condition agent + guard
    data["nodes"].append(make_condition_node(cfg))
    data["nodes"].append(make_guard_node(cfg))

    # 4. Rewire edges
    rewire(data, cfg)

    # 5. Save
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    return {
        "file": cfg["file"],
        "status": "PATCHED",
        "backup": str(bkp),
        "temp": f"{old_temp} -> {new_temp}",
        "nodes": len(data["nodes"]),
        "edges": len(data["edges"]),
    }


def main() -> None:
    results = []
    for cfg in PROJECT_CONFIGS:
        r = process(cfg)
        results.append(r)
        print(f"[{r['status']:9s}] {r['file']:55s}", end="")
        if r["status"] == "PATCHED":
            print(f"  temp={r['temp']:14s}  nodes={r['nodes']} edges={r['edges']}  backup={r['backup']}")
        else:
            print()
    print("\nDone.")


if __name__ == "__main__":
    main()
