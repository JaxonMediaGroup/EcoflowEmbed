# Guía de agentes EcoFlow

Esta guía define el **template base** para crear y mantener agentes del chatbot EcoFlow.
Úsala junto con el script [`scripts/agent_factory.py`](scripts/agent_factory.py), que
automatiza todo el flujo.

> **TL;DR** — Cuando te pidan crear un agente nuevo, ejecuta `agent_factory.py create`.
> Cuando te pidan actualizar uno, ejecuta `agent_factory.py update` (el script detecta
> qué módulos ya tiene y pregunta antes de agregar). **El modelo default es `gpt-5.4`.**

---

## 1. Template base

El template canónico es **`projects/Volterra Agents.json`**. Todos los agentes comparten:

- **Topología**: 5 nodos, 4 edges.
- **Formato**: HTML (`<p><strong>...`) en los 4 prompts.
- **Prompts estandarizados** con las secciones anti-alucinación obligatorias.

### Estructura de nodos

```
Start → agentAgentflow_0 (Q&A + info_get)
            ↓
   conditionAgentAgentflow_0 (Intent Router)
       ├──→ agentAgentflow_1 (Sales / Lead Agent)
       └──→ agentAgentflow_2 (Off-Topic Guard)
```

| Nodo ID | Rol | Herramienta |
|---|---|---|
| `agentAgentflow_0` | Q&A multilingüe | `requestsGet` (info_get) |
| `conditionAgentAgentflow_0` | Clasificador de intención | — |
| `agentAgentflow_1` | Captura de leads | `customTool` (Google Sheets) |
| `agentAgentflow_2` | Guardia fuera de tema | — |

### Marcador de proyecto

Los prompts usan el **nombre del proyecto** en lugar de una variable. El script reemplaza
todas las apariciones de `Volterra` por el nombre del proyecto nuevo en:

- `data.label` de los 4 nodos
- contenido de los `agentMessages` (system)
- `conditionAgentInstructions` del router
- `conditionAgentScenarios` (en `inputs` **y** en la copia espejo `inputParams[*].default`)
- `requestsGetDescription` del info_get
- valor `$project` del sales agent (en minúsculas, ej. `volterra` → `mi-proyecto`)

### Secciones obligatorias del prompt Q&A (vienen en el template)

Estas secciones son **parte del template base** y NO se negocian con el cliente:

- `CRITICAL LANGUAGE RULE` — responder en el idioma del usuario
- `MANDATORY PROCESS` — info_get primero
- `🚫 ANTI-INFERENCIA`
- `⚠️ INFORMACIÓN DE TERCEROS`
- `📊 INFORMACIÓN DINÁMICA — OBLIGATORIO`
- `❓ MANEJO DE INCERTIDUMBRE — OBLIGATORIO`
- `🚫 PROHIBICIÓN DE PROMESAS — OBLIGATORIO`
- `📞 SUGERIR CONTACTO HUMANO — OBLIGATORIO`
- `🎯 TONO Y ESTILO — OBLIGATORIO`
- `⛔ STRICTLY FORBIDDEN PHRASES` (x3 variantes, nunca revelar el documento)

---

## 2. Checklist — qué preguntar SIEMPRE

### Al crear un agente nuevo

| Dato | Obligatorio | Default |
|---|---|---|
| **Nombre del proyecto** | sí | — |
| **ID del Google Doc** | sí | — |
| **Categoría** | sí | `real-estate` |
| **Modelo OpenAI** | sí | `gpt-5.4` |

Categorías válidas: `real-estate`, `commercial`, `industrial`, `hospitality`,
`education`, `coworking`, `tech`, `aviation`, `crm`.

### Al actualizar un agente

Antes de proponer módulos opcionales, **el script detecta qué ya tiene**. Pero como buena
práctica, pregunta al cliente solo lo que aplique (ver §3).

---

## 3. Módulos opcionales (tema de proyecto / cliente)

Estos son **adiciones comerciales** que NO vienen en el template base. Se agregan solo si
el cliente los pide. **El script valida que no existan antes de agregarlos** (nunca duplica).

### 3.1 Sales funnel / CTA progresivo
`--funnel`

Estrategia de CTA que evoluciona según cuántas preguntas hizo el usuario:
- **Preguntas 1-2 (warm-up):** respuesta cálida + CTA suave.
- **Preguntas 3-4 (value push):** destacar exclusividad + CTA más fuerte.
- **Pregunta 5+:** captura de lead obligatoria en cada respuesta.

### 3.2 Calendar link
`--calendar "https://cal.example.com/book"`

Agrega un enlace de agendamiento presentable como botón clicable cuando se ofrece cita.

### 3.3 Segunda fuente de documentos
`--second-doc DOC_ID`

Clona la herramienta `info_get` apuntando a un segundo Google Doc. Útil cuando el proyecto
tiene ficha técnica + catálogo por separado.

### 3.4 Cambio de modelo
`--model gpt-5.4`

Sobreescribe el modelo en los 4 nodos. Default `gpt-5.4`. Válidos: `gpt-5.4`, `gpt-5.2`,
`gpt-5.1`, `gpt-4.1`.

---

## 4. Cómo usar el script

### Crear un agente (flujo completo: JSON + chatflow + push)

```bash
python scripts/agent_factory.py create "Nombre Proyecto" DOC_ID
```

Con opciones:

```bash
python scripts/agent_factory.py create "Nombre Proyecto" DOC_ID \
    --category real-estate \
    --model gpt-5.4 \
    --funnel \
    --calendar "https://cal.example.com/book" \
    --second-doc OTRO_DOC_ID
```

Solo generar el JSON local (sin tocar ecoflow):

```bash
python scripts/agent_factory.py create "Nombre Proyecto" DOC_ID --local-only
```

### Actualizar un agente existente

```bash
python scripts/agent_factory.py update "Nombre Proyecto" \
    --funnel \
    --calendar "https://cal.example.com/book" \
    --model gpt-5.4
```

El modo `update` **reporta primero** qué módulos tiene el agente (modelo, fuentes, funnel,
calendar) y luego aplica solo lo que falta. Para editar el JSON sin hacer push:

```bash
python scripts/agent_factory.py update "Nombre Proyecto" --funnel --dry-run
```

### Detalles del flujo completo (sin `--local-only`)

1. Genera `projects/<Nombre> Agents.json` desde el template Volterra.
2. Crea el chatflow en ecoflow (copia metadata del `--source-project`, default Volterra).
3. Registra el proyecto en `projects.json` (chatflow_id + json_file + categoría).
4. Hace push (inyecta el `openai_credential_id` de `projects.json` y sube el flowData).

---

## 5. Regla de oro

> **El script valida antes de agregar.** Si un agente ya tiene el funnel, el calendar, o
> una segunda fuente, `update` NO los duplica. Solo agrega lo que falta. Antes de proponer
> un módulo opcional al cliente, ejecuta `update --dry-run` para ver el estado actual.

---

## 6. Notas técnicas

- **Template**: `projects/Volterra Agents.json` (no mover ni renombrar; el script depende de él).
- **Doc ID del template**: `1T97hAvHvDQ-umekGkeHPD9LheZIU8BPAStoCrDCvtgg`. El script valida
  que no quede ninguna referencia a este doc en el agente generado.
- **API key**: se lee de la variable de entorno `FLOWISE_API_KEY`; si no está, usa el
  fallback histórico (igual que `push.py`).
- **Credencial OpenAI**: se lee de `projects.json` → `openai_credential_id`
  (`10ca0bac-6033-4f4f-aff2-d5c35aef4580`). No la hardcodees en el script.
- **`push.py`** tiene un `credential_id` default desfasado en su código (`e8fe03f6-...`);
  este script no lo usa — lee siempre de `projects.json`. No se modifica `push.py`.
- **Validaciones del script** (ambos modos): topología 5 nodos/4 edges, sin IDs duplicados,
  edges válidos, sin trazas del template (nombre `Volterra` ni su doc ID), doc ID objetivo
  presente, nodos canónicos presentes.
