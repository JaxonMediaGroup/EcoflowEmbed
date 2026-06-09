/**
 * CRM-IA Agentflow Generator
 * Reads the template node definitions and builds a configured FlowiseAI Agentflow V2
 *
 * Architecture:
 *   Start → ConditionAgent (5 scenarios)
 *     ├─[0] leads/contacts  → HTTP(GET /leads)       → Agent (Lead Manager)
 *     ├─[1] availability    → HTTP(GET /item-pages)   → LLM (Availability Presenter)
 *     ├─[2] quotes/pricing  → HTTP(GET /item-pages)   → CustomFunction → HumanInput
 *     │                                                  ├─[approve] DirectReply
 *     │                                                  └─[reject]  DirectReply
 *     ├─[3] reports         → Agent (Report Writer)
 *     └─[4] general         → Agent (General CRM Assistant)
 *
 * Strapi data model:
 *   /item-pages → tipologías (Departamentos, Penthouses, etc.)
 *     └─ items.data[] → individual units
 *         └─ features[] → { atributo, valor, formato_texto }
 *   Availability: publishedAt !== null → available; publishedAt === null → sold
 */

const fs = require("fs");
const path = require("path");

const STRAPI_URL = "https://alhenastrapi.thekoppi.com/api";

// ── Minimal Flowise Agentflow V2 node templates ───────
// These replicate the structure FlowiseAI expects, without needing an external template file.
const NODE_TEMPLATES = {
  Start: {
    name: "startAgentflow",
    type: "Start",
    category: "Start",
    version: 1,
    inputParams: [
      { label: "Type", name: "startInputType", type: "options", options: [{ label: "Chat Input", name: "chatInput" }, { label: "Form Input", name: "formInput" }] },
      { label: "Ephemeral Memory", name: "startEphemeralMemory", type: "boolean" },
      { label: "State", name: "startState", type: "array", acceptVariable: true, optional: true },
      { label: "Persist State", name: "startPersistState", type: "boolean" },
    ],
    outputAnchors: [{ id: "{{ID}}-output-startAgentflow", name: "startAgentflow", label: "Start" }],
  },
  ConditionAgent: {
    name: "conditionAgentAgentflow",
    type: "ConditionAgent",
    category: "Condition Agent",
    version: 1,
    inputParams: [
      { label: "Model", name: "conditionAgentModel", type: "asyncOptions" },
      { label: "Instructions", name: "conditionAgentInstructions", type: "string", rows: 4 },
      { label: "Input", name: "conditionAgentInput", type: "string", rows: 2, acceptVariable: true },
      { label: "Scenarios", name: "conditionAgentScenarios", type: "array" },
      { label: "Override System Prompt", name: "conditionAgentOverrideSystemPrompt", type: "string", rows: 4, optional: true },
    ],
    outputAnchors: [], // dynamically set per scenario
  },
  HTTP: {
    name: "httpAgentflow",
    type: "HTTP",
    category: "HTTP",
    version: 1,
    inputParams: [
      { label: "Method", name: "method", type: "options", options: [{ label: "GET", name: "GET" }, { label: "POST", name: "POST" }, { label: "PUT", name: "PUT" }, { label: "PATCH", name: "PATCH" }, { label: "DELETE", name: "DELETE" }] },
      { label: "URL", name: "url", type: "string", acceptVariable: true },
      { label: "Headers", name: "headers", type: "array", optional: true },
      { label: "Query Params", name: "queryParams", type: "string", rows: 4, optional: true, acceptVariable: true },
      { label: "Body Type", name: "bodyType", type: "options", options: [{ label: "JSON", name: "json" }, { label: "Form Data", name: "formData" }, { label: "Raw", name: "raw" }], optional: true },
      { label: "Body", name: "body", type: "string", rows: 4, optional: true, acceptVariable: true },
      { label: "Response Type", name: "responseType", type: "options", options: [{ label: "JSON", name: "json" }, { label: "Text", name: "text" }] },
    ],
    outputAnchors: [{ id: "{{ID}}-output-httpAgentflow", name: "httpAgentflow", label: "HTTP" }],
  },
  Agent: {
    name: "agentAgentflow",
    type: "Agent",
    category: "Agent",
    version: 1,
    inputParams: [
      { label: "Model", name: "agentModel", type: "asyncOptions" },
      { label: "Messages", name: "agentMessages", type: "array" },
      { label: "Tools", name: "agentTools", type: "string", optional: true },
      { label: "Knowledge (Document Stores)", name: "agentKnowledgeDocumentStores", type: "string", optional: true },
      { label: "Knowledge (VS Embeddings)", name: "agentKnowledgeVSEmbeddings", type: "string", optional: true },
      { label: "Enable Memory", name: "agentEnableMemory", type: "boolean" },
      { label: "Memory Type", name: "agentMemoryType", type: "options", options: [{ label: "All Messages", name: "allMessages" }, { label: "Window", name: "window" }] },
      { label: "Return Response As", name: "agentReturnResponseAs", type: "options", options: [{ label: "User Message", name: "userMessage" }, { label: "AI Message", name: "aiMessage" }] },
      { label: "Structured Output", name: "agentStructuredOutput", type: "string", optional: true },
      { label: "Update State", name: "agentUpdateState", type: "array", optional: true },
    ],
    outputAnchors: [{ id: "{{ID}}-output-agentAgentflow", name: "agentAgentflow", label: "Agent" }],
  },
  LLM: {
    name: "llmAgentflow",
    type: "LLM",
    category: "LLM",
    version: 1,
    inputParams: [
      { label: "Model", name: "llmModel", type: "asyncOptions" },
      { label: "Messages", name: "llmMessages", type: "array" },
      { label: "Enable Memory", name: "llmEnableMemory", type: "boolean" },
      { label: "Memory Type", name: "llmMemoryType", type: "options", options: [{ label: "All Messages", name: "allMessages" }, { label: "Window", name: "window" }] },
      { label: "Return Response As", name: "llmReturnResponseAs", type: "options", options: [{ label: "User Message", name: "userMessage" }, { label: "AI Message", name: "aiMessage" }] },
      { label: "Structured Output", name: "llmStructuredOutput", type: "string", optional: true },
      { label: "Update State", name: "llmUpdateState", type: "array", optional: true },
    ],
    outputAnchors: [{ id: "{{ID}}-output-llmAgentflow", name: "llmAgentflow", label: "LLM" }],
  },
  CustomFunction: {
    name: "customFunctionAgentflow",
    type: "CustomFunction",
    category: "Custom Function",
    version: 1,
    inputParams: [
      { label: "Input Variables", name: "customFunctionInputVariables", type: "array" },
      { label: "Javascript Function", name: "customFunctionJavascriptFunction", type: "code", rows: 10 },
      { label: "Update State", name: "customFunctionUpdateState", type: "array", optional: true },
    ],
    outputAnchors: [{ id: "{{ID}}-output-customFunctionAgentflow", name: "customFunctionAgentflow", label: "Custom Function" }],
  },
  HumanInput: {
    name: "humanInputAgentflow",
    type: "HumanInput",
    category: "Human Input",
    version: 1,
    inputParams: [
      { label: "Description Type", name: "humanInputDescriptionType", type: "options", options: [{ label: "Fixed", name: "fixed" }, { label: "Dynamic", name: "dynamic" }] },
      { label: "Description", name: "humanInputDescription", type: "string", rows: 4, acceptVariable: true },
      { label: "Model", name: "humanInputModel", type: "asyncOptions", optional: true },
      { label: "Enable Feedback", name: "humanInputEnableFeedback", type: "boolean" },
    ],
    outputAnchors: [
      { id: "{{ID}}-output-0", name: "humanInputAgentflow", label: "Approve" },
      { id: "{{ID}}-output-1", name: "humanInputAgentflow", label: "Reject" },
    ],
  },
  DirectReply: {
    name: "directReplyAgentflow",
    type: "DirectReply",
    category: "Direct Reply",
    version: 1,
    inputParams: [
      { label: "Message", name: "directReplyMessage", type: "string", rows: 4, acceptVariable: true },
    ],
    outputAnchors: [{ id: "{{ID}}-output-directReplyAgentflow", name: "directReplyAgentflow", label: "Direct Reply" }],
  },
  StickyNote: {
    name: "stickyNoteAgentflow",
    type: "StickyNote",
    category: "Sticky Note",
    version: 1,
    inputParams: [
      { label: "Note", name: "note", type: "string", rows: 6 },
    ],
    outputAnchors: [],
  },
};

// ── Build a Flowise node from inline templates ─────────
function createNode(type, id, label, position, inputOverrides, customOutputAnchors) {
  const tmpl = NODE_TEMPLATES[type];
  if (!tmpl) throw new Error(`Unknown node type "${type}"`);

  const inputParams = tmpl.inputParams.map((p) => ({
    ...p,
    id: `${id}-input-${p.name}`,
  }));

  const inputs = {};
  tmpl.inputParams.forEach((p) => { inputs[p.name] = ""; });
  if (inputOverrides) Object.assign(inputs, inputOverrides);

  const outputAnchors = customOutputAnchors || tmpl.outputAnchors.map((a) => ({
    ...a,
    id: a.id.replace("{{ID}}", id),
  }));

  // FlowiseAI needs inputAnchors for incoming edges (all except Start)
  const inputAnchors = type === "Start" ? [] : [
    { id: `${id}-input-${tmpl.name}`, name: tmpl.name, label: tmpl.type }
  ];

  return {
    id,
    position,
    positionAbsolute: position,
    type: "agentFlow",
    selected: false,
    width: type === "StickyNote" ? 300 : 300,
    height: type === "StickyNote" ? 200 : 500,
    data: {
      id,
      label,
      name: tmpl.name,
      version: tmpl.version,
      type: tmpl.type,
      category: tmpl.category,
      inputAnchors,
      inputParams,
      inputs,
      outputAnchors,
    },
  };
}

// ── Edge helper ────────────────────────────────────────
function edge(sourceId, sourceHandle, targetId) {
  return {
    source: sourceId,
    sourceHandle,
    target: targetId,
    targetHandle: targetId,
    type: "agentFlow",
    data: { edgeLabel: "" },
    id: `reactflow__edge-${sourceId}-${sourceHandle}-${targetId}-${targetId}`,
  };
}

// ════════════════════════════════════════════════════════
//  BUILD NODES
// ════════════════════════════════════════════════════════

const nodes = [];

// ── 1. START ───────────────────────────────────────────
nodes.push(
  createNode("Start", "startAgentflow_0", "Start", { x: 100, y: 400 }, {
    startInputType: "chatInput",
    startEphemeralMemory: false,
    startState: [
      { key: "strapiUrl", value: STRAPI_URL },
      { key: "leadData", value: "" },
      { key: "itemPagesData", value: "" },
      { key: "currentQuote", value: "" },
    ],
    startPersistState: true,
  })
);

// ── 2. CONDITION AGENT (Intent Router) ─────────────────
const conditionAgentLabel = "Router de Intención";
nodes.push(
  createNode(
    "ConditionAgent",
    "conditionAgentAgentflow_0",
    conditionAgentLabel,
    { x: 450, y: 370 },
    {
      conditionAgentModel: "",
      conditionAgentInstructions:
        "Clasifica la intención del usuario en un CRM inmobiliario. Analiza si el usuario quiere: gestionar leads/contactos, consultar disponibilidad de unidades, solicitar una cotización o precios, generar un reporte, o simplemente tiene una pregunta general o saludo.",
      conditionAgentInput:
        '<p><span class="variable" data-type="mention" data-id="question" data-label="question">{{ question }}</span> </p>',
      conditionAgentScenarios: [
        { scenario: "El usuario quiere consultar, buscar, crear o gestionar leads o contactos" },
        { scenario: "El usuario pregunta sobre disponibilidad de unidades, departamentos o inventario" },
        { scenario: "El usuario solicita una cotización, quiere saber precios o costos de unidades" },
        { scenario: "El usuario quiere generar un reporte, resumen ejecutivo o análisis de datos" },
        { scenario: "El usuario hace un saludo, pregunta general o tema no relacionado con las opciones anteriores" },
      ],
      conditionAgentOverrideSystemPrompt: "",
    },
    // 5 output anchors
    [
      { id: "conditionAgentAgentflow_0-output-0", label: "Leads", name: "conditionAgentAgentflow" },
      { id: "conditionAgentAgentflow_0-output-1", label: "Disponibilidad", name: "conditionAgentAgentflow" },
      { id: "conditionAgentAgentflow_0-output-2", label: "Cotización", name: "conditionAgentAgentflow" },
      { id: "conditionAgentAgentflow_0-output-3", label: "Reportes", name: "conditionAgentAgentflow" },
      { id: "conditionAgentAgentflow_0-output-4", label: "General", name: "conditionAgentAgentflow" },
    ]
  )
);

// ── 3. HTTP – GET Leads ────────────────────────────────
nodes.push(
  createNode("HTTP", "httpAgentflow_0", "GET Leads", { x: 800, y: 80 }, {
    method: "GET",
    url: `${STRAPI_URL}/leads?populate=*&sort=createdAt:desc&pagination[pageSize]=25`,
    headers: [
      { key: "Content-Type", value: "application/json" },
    ],
    queryParams: "",
    bodyType: "",
    body: "",
    responseType: "json",
  })
);

// ── 4. AGENT – Lead Manager ────────────────────────────
nodes.push(
  createNode("Agent", "agentAgentflow_0", "Agente de Leads", { x: 1200, y: 80 }, {
    agentModel: "",
    agentMessages: [
      {
        role: "system",
        content:
          "Eres el asistente de gestión de leads del CRM inmobiliario Torre Alhena. Tu rol es ayudar a los asesores de ventas a consultar y analizar información de leads.\n\n## Contexto\n- Tienes acceso a datos de leads obtenidos de la API de Strapi\n- Los leads tienen campos: nombre, email, teléfono, fuente (Instagram, Facebook, sitio web, referido, etc.), estatus (nuevo, contactado, en seguimiento, calificado, perdido, convertido), y notas\n- El contexto del lead actual (si existe) viene en $vars.leadContext\n\n## Capacidades\n1. **Buscar leads**: Filtra y presenta leads por nombre, estatus, fuente, etc.\n2. **Analizar leads**: Identifica leads sin contactar, leads calientes, patrones\n3. **Recomendar acciones**: Sugiere próximos pasos para cada lead\n4. **Resumir**: Presenta la información de forma clara y estructurada\n\n## Formato de respuesta\n- Usa tablas markdown cuando presentes múltiples leads\n- Incluye indicadores de estatus con emojis (🟢 nuevo, 🔵 contactado, 🟡 seguimiento, ⭐ calificado, 🔴 perdido, ✅ convertido)\n- Siempre responde en español\n- Sé conciso pero informativo",
      },
    ],
    agentTools: "",
    agentKnowledgeDocumentStores: "",
    agentKnowledgeVSEmbeddings: "",
    agentEnableMemory: true,
    agentMemoryType: "allMessages",
    agentReturnResponseAs: "userMessage",
    agentStructuredOutput: "",
    agentUpdateState: "",
  })
);

// ── 5. HTTP – GET Item Pages (Disponibilidad) ─────────
nodes.push(
  createNode("HTTP", "httpAgentflow_1", "GET Disponibilidad", { x: 800, y: 230 }, {
    method: "GET",
    url: `${STRAPI_URL}/item-pages?populate[items][populate][features][populate]=*&populate[valoresTipologia][populate]=*&publicationState=preview`,
    headers: [
      { key: "Content-Type", value: "application/json" },
    ],
    queryParams: "",
    bodyType: "",
    body: "",
    responseType: "json",
  })
);

// ── 6. LLM – Availability Presenter ───────────────────
nodes.push(
  createNode("LLM", "llmAgentflow_0", "Presentar Disponibilidad", { x: 1200, y: 230 }, {
    llmModel: "",
    llmMessages: [
      {
        role: "system",
        content:
          "Eres un asistente especializado en presentar información de disponibilidad de unidades inmobiliarias del desarrollo Torre Alhena.\n\n## Estructura de datos que recibes\nRecibes un JSON de la API `/item-pages` de Strapi. La estructura es:\n```\ndata: [\n  {\n    attributes: {\n      nombre: \"Departamentos\",  // tipología\n      slug: \"departamentos\",\n      items: {\n        data: [\n          {\n            attributes: {\n              nombre: \"B-301\",\n              publishedAt: \"2024-01-01T...\" | null,\n              features: [\n                { atributo: \"Precio\", valor: \"3500000\", formato_texto: \"$3,500,000 MXN\" },\n                { atributo: \"Nivel\", valor: \"3\" },\n                { atributo: \"m²\", valor: \"85.5\" },\n                { atributo: \"Recámaras\", valor: \"2\" }\n              ]\n            }\n          }\n        ]\n      }\n    }\n  }\n]\n```\n\n## Regla de disponibilidad\n- `publishedAt !== null` → 🟢 **Disponible**\n- `publishedAt === null` → 🔴 **Vendido**\n\n## Formato de presentación\n- Agrupa las unidades por tipología (Departamentos, Penthouses, etc.)\n- Muestra: nombre, nivel, superficie (m²), recámaras, precio formateado, estatus\n- Incluye un resumen al inicio: total de unidades, disponibles, vendidas\n- Si el usuario pregunta por algo específico, filtra la información relevante\n- Usa tablas markdown cuando presentes múltiples unidades\n- Responde siempre en español\n- Si no hay datos, indica amablemente que no se encontraron unidades",
      },
    ],
    llmEnableMemory: true,
    llmMemoryType: "allMessages",
    llmReturnResponseAs: "userMessage",
    llmStructuredOutput: "",
    llmUpdateState: "",
  })
);

// ── 7. HTTP – GET Item Pages (Cotización) ──────────────
nodes.push(
  createNode("HTTP", "httpAgentflow_2", "GET Cotización Data", { x: 800, y: 400 }, {
    method: "GET",
    url: `${STRAPI_URL}/item-pages?populate[items][populate][features][populate]=*&populate[valoresTipologia][populate]=*&publicationState=preview`,
    headers: [
      { key: "Content-Type", value: "application/json" },
    ],
    queryParams: "",
    bodyType: "",
    body: "",
    responseType: "json",
  })
);

// ── 8. CUSTOM FUNCTION – Quote Builder ─────────────────
nodes.push(
  createNode("CustomFunction", "customFunctionAgentflow_0", "Generar Cotización", { x: 1200, y: 400 }, {
    customFunctionInputVariables: [
      { variableName: "itemPagesData", variableValue: '<p><span class="variable" data-type="mention" data-id="httpAgentflow_2" data-label="GET Cotización Data">{{ GET Cotización Data }}</span></p>' },
      { variableName: "userQuestion", variableValue: '<p><span class="variable" data-type="mention" data-id="question" data-label="question">{{ question }}</span></p>' },
    ],
    customFunctionJavascriptFunction: `/*
 * Genera una cotización a partir de /item-pages de Strapi (Torre Alhena).
 * Variables: $itemPagesData, $userQuestion
 * Acceso: $flow.sessionId, $flow.chatId, $flow.input, $flow.state
 *
 * Estructura de datos:
 *   data[].attributes.nombre = tipología ("Departamentos")
 *   data[].attributes.items.data[].attributes.nombre = unidad ("B-301")
 *   data[].attributes.items.data[].attributes.publishedAt = disponibilidad
 *   data[].attributes.items.data[].attributes.features[] = { atributo, valor, formato_texto }
 */

function feat(item, key) {
  const f = (item.attributes?.features || []).find(
    ft => ft.atributo?.toLowerCase() === key.toLowerCase()
  );
  return f || null;
}

let raw;
try {
  raw = typeof $itemPagesData === 'string' ? JSON.parse($itemPagesData) : $itemPagesData;
} catch (e) {
  return '❌ No se pudieron obtener los datos. Por favor intenta de nuevo.';
}

const pages = raw?.data || [];
if (!pages.length) {
  return '❌ No hay información de unidades disponible en este momento.';
}

const today = new Date().toLocaleDateString('es-MX', {
  year: 'numeric', month: 'long', day: 'numeric'
});

let quote = '## 📋 Cotización Torre Alhena\\n\\n';
quote += '| Campo | Detalle |\\n|---|---|\\n';
quote += '| **Fecha** | ' + today + ' |\\n';
quote += '| **Sesión** | ' + ($flow.sessionId || 'N/A') + ' |\\n\\n';

pages.forEach(function(page) {
  const tipo = page.attributes?.nombre || 'Sin tipo';
  const items = page.attributes?.items?.data || [];
  const available = items.filter(i => i.attributes?.publishedAt !== null);
  if (!available.length) return;

  quote += '### ' + tipo + '\\n\\n';
  quote += '| Unidad | Nivel | m² | Recámaras | Precio |\\n|---|---|---|---|---|\\n';

  available.forEach(function(item) {
    const name = item.attributes?.nombre || 'N/A';
    const nivel = feat(item, 'Nivel')?.valor || '-';
    const m2 = feat(item, 'm²')?.valor || feat(item, 'm2')?.valor || '-';
    const recs = feat(item, 'Recámaras')?.valor || feat(item, 'Recamaras')?.valor || '-';
    const precioFeat = feat(item, 'Precio');
    const precio = precioFeat?.formato_texto || (precioFeat?.valor ? '$' + Number(precioFeat.valor).toLocaleString('es-MX') + ' MXN' : 'Consultar');
    quote += '| ' + name + ' | ' + nivel + ' | ' + m2 + ' | ' + recs + ' | ' + precio + ' |\\n';
  });

  quote += '\\n';
});

quote += '---\\n';
quote += '> ⚠️ **Esta cotización es informativa y está sujeta a confirmación.**\\n';
quote += '> *Generada automáticamente el ' + today + '*\\n';

return quote;`,
    customFunctionUpdateState: [
      { key: "currentQuote", value: '<p><span class="variable" data-type="mention" data-id="customFunctionAgentflow_0" data-label="Generar Cotización">{{ Generar Cotización }}</span></p>' },
      { key: "itemPagesData", value: '<p><span class="variable" data-type="mention" data-id="httpAgentflow_2" data-label="GET Cotización Data">{{ GET Cotización Data }}</span></p>' },
    ],
  })
);

// ── 9. HUMAN INPUT – Quote Approval ────────────────────
nodes.push(
  createNode("HumanInput", "humanInputAgentflow_0", "Aprobar Cotización", { x: 1550, y: 400 }, {
    humanInputDescriptionType: "fixed",
    humanInputDescription:
      '<p>Se ha generado la siguiente cotización. Por favor revísala y decide si deseas aprobarla o rechazarla.</p><p><span class="variable" data-type="mention" data-id="customFunctionAgentflow_0" data-label="Generar Cotización">{{ Generar Cotización }}</span></p>',
    humanInputModel: "",
    humanInputEnableFeedback: true,
  })
);

// ── 10. DIRECT REPLY – Quote Approved ──────────────────
nodes.push(
  createNode("DirectReply", "directReplyAgentflow_0", "Cotización Aprobada", { x: 1900, y: 350 }, {
    directReplyMessage:
      '<p>✅ <strong>Cotización aprobada exitosamente.</strong></p><p>La cotización ha sido registrada. Un asesor se pondrá en contacto para formalizar el proceso.</p><p><span class="variable" data-type="mention" data-id="customFunctionAgentflow_0" data-label="Generar Cotización">{{ Generar Cotización }}</span></p>',
  })
);

// ── 11. DIRECT REPLY – Quote Rejected ──────────────────
nodes.push(
  createNode("DirectReply", "directReplyAgentflow_1", "Cotización Rechazada", { x: 1900, y: 470 }, {
    directReplyMessage:
      "<p>📝 <strong>Cotización no aprobada.</strong></p><p>Entendido. Si necesitas ajustes o una nueva cotización con diferentes opciones, no dudes en pedirlo.</p>",
  })
);

// ── 12. AGENT – Report Writer ──────────────────────────
nodes.push(
  createNode("Agent", "agentAgentflow_1", "Agente de Reportes", { x: 800, y: 560 }, {
    agentModel: "",
    agentMessages: [
      {
        role: "system",
        content:
          "Eres un generador de reportes para el CRM inmobiliario Torre Alhena. Tu especialidad es crear reportes ejecutivos, de seguimiento y análisis de datos del CRM.\n\n## Estructura de datos de Strapi\n- **Unidades**: vienen de `/item-pages`, cada tipología contiene `items.data[]`\n- **Disponibilidad**: `publishedAt !== null` = disponible, `publishedAt === null` = vendido\n- **Características**: cada item tiene `features[]` con objetos `{ atributo, valor, formato_texto }`\n  - Atributos comunes: Precio, Nivel, m², Recámaras\n\n## Tipos de reportes que puedes generar\n1. **Resumen Ejecutivo**: Panorama general de leads, conversiones, disponibilidad por tipología\n2. **Reporte de Seguimiento**: Estado de leads activos, próximas acciones\n3. **Análisis de Fuentes**: Rendimiento por canal (Instagram, Facebook, referidos, etc.)\n4. **Reporte de Ventas**: Unidades vendidas/disponibles por tipología con valores de features\n\n## Formato de reportes\n- Usa encabezados claros con markdown (##, ###)\n- Incluye KPIs con emojis relevantes (📊 📈 💰 🏠 👥)\n- Usa tablas para datos comparativos\n- Incluye sección de \"Recomendaciones\" al final\n- Fecha del reporte y período analizado\n- Responde siempre en español\n\n## Si no tienes datos suficientes\n- Genera un reporte con la estructura correcta indicando que se necesita más data\n- Sugiere qué datos serían necesarios",
      },
    ],
    agentTools: "",
    agentKnowledgeDocumentStores: "",
    agentKnowledgeVSEmbeddings: "",
    agentEnableMemory: true,
    agentMemoryType: "allMessages",
    agentReturnResponseAs: "userMessage",
    agentStructuredOutput: "",
    agentUpdateState: "",
  })
);

// ── 13. AGENT – General CRM Assistant ──────────────────
nodes.push(
  createNode("Agent", "agentAgentflow_2", "Asistente General", { x: 800, y: 710 }, {
    agentModel: "",
    agentMessages: [
      {
        role: "system",
        content:
          "Eres el asistente general del CRM inmobiliario Torre Alhena. Ayudas a los asesores de ventas con cualquier consulta relacionada con el sistema y el proceso de ventas inmobiliarias.\n\n## Sobre Torre Alhena\n- Desarrollo inmobiliario con tipologías: Departamentos, Penthouses, etc.\n- La API de Strapi usa `/item-pages` para tipologías e items\n- Disponibilidad se determina por `publishedAt` (null = vendido, fecha = disponible)\n\n## Tu personalidad\n- Amable y profesional\n- Respuestas concisas y útiles\n- Proactivo: sugiere acciones relevantes\n\n## Puedes ayudar con\n- Explicar cómo funciona el CRM\n- Orientar sobre el proceso de ventas inmobiliarias\n- Dar tips de seguimiento a leads\n- Explicar terminología inmobiliaria\n- Redirigir al usuario si su pregunta requiere otra funcionalidad:\n  - \"Para consultar leads, puedes preguntar: '¿Cuáles son mis leads activos?'\"\n  - \"Para ver disponibilidad: '¿Qué unidades hay disponibles?'\"\n  - \"Para cotizar: 'Genera una cotización para...'\"\n  - \"Para reportes: 'Dame un resumen ejecutivo'\"\n\n## Importante\n- Responde siempre en español\n- Si recibes un saludo, responde amablemente y ofrece ayuda\n- Si la pregunta no es sobre el CRM, redirige amablemente",
      },
    ],
    agentTools: "",
    agentKnowledgeDocumentStores: "",
    agentKnowledgeVSEmbeddings: "",
    agentEnableMemory: true,
    agentMemoryType: "allMessages",
    agentReturnResponseAs: "userMessage",
    agentStructuredOutput: "",
    agentUpdateState: "",
  })
);

// ── 14. STICKY NOTE – Architecture ─────────────────────
nodes.push(
  createNode("StickyNote", "stickyNoteAgentflow_0", "Arquitectura CRM-IA", { x: 100, y: 50 }, {
    note:
      "🏗️ CRM-IA Agentflow v2.0 (Torre Alhena)\n\n" +
      "Start → Router de Intención (ConditionAgent)\n" +
      "├─ Leads → HTTP(/leads) → Agente de Leads\n" +
      "├─ Disponibilidad → HTTP(/item-pages) → LLM\n" +
      "├─ Cotización → HTTP(/item-pages) → CustomFunc → HumanInput\n" +
      "├─ Reportes → Agente de Reportes\n" +
      "└─ General → Asistente General\n\n" +
      "📐 Strapi: /item-pages → tipologías → items → features[]\n" +
      "📐 Disponibilidad: publishedAt ? disponible : vendido\n\n" +
      "⚠️ Configura los modelos (LLM) en cada nodo Agent/LLM/ConditionAgent\n" +
      "⚠️ Agrega el Bearer Token de Strapi en los headers de cada nodo HTTP",
  })
);

// ════════════════════════════════════════════════════════
//  BUILD EDGES
// ════════════════════════════════════════════════════════

const edges = [
  // Start → ConditionAgent
  edge("startAgentflow_0", "startAgentflow_0-output-startAgentflow", "conditionAgentAgentflow_0"),

  // [0] Leads path: ConditionAgent → HTTP(Leads) → Agent(Lead Manager)
  edge("conditionAgentAgentflow_0", "conditionAgentAgentflow_0-output-0", "httpAgentflow_0"),
  edge("httpAgentflow_0", "httpAgentflow_0-output-httpAgentflow", "agentAgentflow_0"),

  // [1] Availability path: ConditionAgent → HTTP(Units) → LLM(Availability)
  edge("conditionAgentAgentflow_0", "conditionAgentAgentflow_0-output-1", "httpAgentflow_1"),
  edge("httpAgentflow_1", "httpAgentflow_1-output-httpAgentflow", "llmAgentflow_0"),

  // [2] Quotes path: ConditionAgent → HTTP(Prices) → CustomFunc → HumanInput → DirectReply
  edge("conditionAgentAgentflow_0", "conditionAgentAgentflow_0-output-2", "httpAgentflow_2"),
  edge("httpAgentflow_2", "httpAgentflow_2-output-httpAgentflow", "customFunctionAgentflow_0"),
  edge("customFunctionAgentflow_0", "customFunctionAgentflow_0-output-customFunctionAgentflow", "humanInputAgentflow_0"),
  edge("humanInputAgentflow_0", "humanInputAgentflow_0-output-0", "directReplyAgentflow_0"),   // Approve
  edge("humanInputAgentflow_0", "humanInputAgentflow_0-output-1", "directReplyAgentflow_1"),   // Reject

  // [3] Reports path: ConditionAgent → Agent(Reports)
  edge("conditionAgentAgentflow_0", "conditionAgentAgentflow_0-output-3", "agentAgentflow_1"),

  // [4] General path: ConditionAgent → Agent(General)
  edge("conditionAgentAgentflow_0", "conditionAgentAgentflow_0-output-4", "agentAgentflow_2"),
];

// ════════════════════════════════════════════════════════
//  OUTPUT
// ════════════════════════════════════════════════════════

const agentflow = { nodes, edges };
const outputPath = path.resolve(__dirname, "..", "CRM-IA-Agentflow.json");
fs.writeFileSync(outputPath, JSON.stringify(agentflow, null, 2), "utf8");

console.log(`✅ Agentflow generated: ${outputPath}`);
console.log(`   Nodes: ${nodes.length}`);
console.log(`   Edges: ${edges.length}`);
console.log(`\n   Node list:`);
nodes.forEach((n) => {
  console.log(`     - ${n.data.label} (${n.data.type}) @ (${n.position.x}, ${n.position.y})`);
});
