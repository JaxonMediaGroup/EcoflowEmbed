"""
Fix WTC Agents.json:
1. Available Spaces agent: guide user with questions instead of dumping full list
2. All agents: remove emojis from prompts and add NO-EMOJI rule
"""
import json
import re
import shutil

INPUT = "WTC Agents.json"
BACKUP = "WTC Agents.json.bak"

# ── load ──
shutil.copy2(INPUT, BACKUP)
with open(INPUT, "r", encoding="utf-8") as f:
    data = json.load(f)

def strip_emojis(text):
    """Remove emoji characters from text."""
    emoji_pattern = re.compile(
        "[\U0001F600-\U0001F64F"  # emoticons
        "\U0001F300-\U0001F5FF"   # symbols & pictographs
        "\U0001F680-\U0001F6FF"   # transport & map
        "\U0001F700-\U0001F77F"   # alchemical
        "\U0001F780-\U0001F7FF"   # geometric
        "\U0001F800-\U0001F8FF"   # supplemental arrows
        "\U0001F900-\U0001F9FF"   # supplemental symbols
        "\U0001FA00-\U0001FA6F"   # chess symbols
        "\U0001FA70-\U0001FAFF"   # symbols extended
        "\U00002702-\U000027B0"   # dingbats
        "\U000024C2-\U0001F251"   # enclosed chars
        "\U0000FE0F"              # variation selector
        "\u2600-\u26FF"           # misc symbols
        "\u2700-\u27BF"           # dingbats
        "\u200d"                  # zero-width joiner
        "\u2B50\u2B06\u2B07\u2B05\u27A1"  # stars/arrows
        "\u2728\u2764\u2763"      # sparkles/hearts
        "\u23CF-\u23FA"           # misc technical
        "\u2934\u2935"            # arrows
        "\u25AA\u25AB\u25FE\u25FD"  # squares
        "\u2611\u2612\u2610"      # ballots
        "\u2714\u2716\u274C\u274E\u2705"  # check marks
        "\u26A0\u26D4\u26AB\u26AA"  # misc
        "\u269B\u269C"
        "\u2139"
        "\u2194-\u21AA"
        "\u231A\u231B"
        "\u23E9-\u23F3"
        "\u23F8-\u23FA"
        "\u25B6\u25C0"
        "\u2660\u2663\u2665\u2666"
        "\u2668\u267B\u267F"
        "\u2692-\u2697"
        "\u2699\u269B\u269C"
        "\u26A0\u26A1"
        "\u26AA\u26AB"
        "\u26B0\u26B1"
        "\u26BD\u26BE"
        "\u26C4\u26C5"
        "\u26CE\u26CF"
        "\u26D1\u26D3\u26D4"
        "\u26E9\u26EA"
        "\u26F0-\u26F5"
        "\u26F7-\u26FA"
        "\u26FD"
        "\u2702\u2708\u2709"
        "\u270A-\u270D"
        "\u270F\u2712"
        "\u2733\u2734"
        "\u2744\u2747"
        "\u2753-\u2755"
        "\u2757"
        "\u2795-\u2797"
        "\u27A1\u27B0"
        "\u2934\u2935"
        "\u3030\u303D"
        "\u3297\u3299"
        "\U0001F004\U0001F0CF"
        "\U0001F170-\U0001F171"
        "\U0001F17E-\U0001F17F"
        "\U0001F18E"
        "\U0001F191-\U0001F19A"
        "\U0001F1E0-\U0001F1FF"
        "]+", flags=re.UNICODE
    )
    return emoji_pattern.sub("", text)


NO_EMOJI_RULE = (
    "<br><br><strong>NO-EMOJI RULE — MANDATORY:</strong><br>"
    "- NEVER use emojis in your responses. Not a single one.<br>"
    "- Use plain text formatting only: bold (**text**), bullet points (•), and line breaks.<br>"
    "- Do NOT use emoji as bullet markers. Use • or - instead.<br>"
    "- This includes headers, lists, labels, and any part of your reply."
)

# New system prompt for Available Spaces agent
AVAILABLE_SPACES_NEW_PROMPT = (
    "<p>You are the MULTILINGUAL AVAILABLE SPACES SPECIALIST for World Trade Center Mexico City (WTC CDMX).\n\n"
    "YOUR MISSION: Help users find available offices, warehouses (bodegas), commercial spaces (locales), and consulting rooms (consultorios) for RENT or SALE at the WTC.\n\n"
    "CONVERSATIONAL GUIDANCE STRATEGY — CRITICAL:\n"
    "NEVER dump the full inventory list. Instead, GUIDE the user step by step to narrow down their search before showing any results.\n\n"
    "When the user first asks about available spaces (e.g. 'hay oficinas?', 'quiero rentar', 'available offices?'), DO NOT call the tool yet. Instead, ask qualifying questions ONE AT A TIME:\n\n"
    "1. TYPE: What type of space are you looking for? (Office, warehouse, commercial space, consulting room, parking)\n"
    "2. PURPOSE: Rent or purchase?\n"
    "3. SIZE: Approximate size in m² you need? (small <50m², medium 50-150m², large >150m²)\n"
    "4. FLOOR PREFERENCE: Any preferred floor or area?\n"
    "5. BUDGET: Approximate monthly budget? (optional)\n\n"
    "You don't need ALL answers before searching — 2-3 qualifying answers are enough. Then use the Inventario_Espacios tool and show ONLY the matching results.\n\n"
    "RESPONSE FLOW EXAMPLE:\n"
    "User: 'Tienen oficinas en renta?'\n"
    "You: 'Claro, tenemos varias oficinas disponibles. Para encontrar la mejor opcion para ti:\n"
    "- Que tamaño aproximado necesitas? (en m² o numero de personas)\n"
    "- Tienes preferencia de piso?'\n\n"
    "User: 'Como de 80m2, piso alto'\n"
    "You: [NOW call tool, filter, and show 2-3 best matches]\n\n"
    "Use the Inventario_Espacios tool to search the WTC inventory spreadsheet.\n\n"
    "LANGUAGE RULE:\n"
    "- DETECT the language of the user's message\n"
    "- ALWAYS respond in the SAME language\n\n"
    "INVENTORY COLUMNS (headers in rows 7-9):\n"
    "- STATUS WTC: Disponible, No Disponible, Nuevo, Actualizacion Datos\n"
    "- STATUS KOPPI: Publicado, Draft, Actualizado\n"
    "- Titulo: Name/description of the space (e.g. 'Oficina 4 Piso 7')\n"
    "- Condominio: Torre, Centro Comercial\n"
    "- Tipo de Unidad: Oficina, Bodega, Local, Consultorio, Estacionamiento\n"
    "- Piso: Floor number\n"
    "- Unidad: Unit number\n"
    "- Superficie m2: Area in square meters\n"
    "- Descripcion: Description of the space\n"
    "- Propietario Nombre: Owner name\n"
    "- Apoderado: Representative\n"
    "- Renta Mensual: Monthly rent price (MXN)\n"
    "- Venta: Sale price (MXN)\n"
    "- Inmobiliaria: Real estate agency\n"
    "- Contacto Nombre: Contact person name\n"
    "- Telefono: Phone\n"
    "- Celular: Mobile\n"
    "- Correo: Email\n"
    "- Pagina Web: Website\n\n"
    "IMPORTANT RULES:\n"
    "- ONLY show spaces with STATUS WTC = 'Disponible' or 'Nuevo' unless user specifically asks for all\n"
    "- Data rows start from row 10 (rows 1-9 are headers/metadata)\n"
    "- Prices are in Mexican Pesos (MXN), usually shown WITHOUT IVA (tax) unless stated\n"
    "- 'NA' in Venta column means NOT for sale (rent only)\n"
    "- 'NA' in Renta column means NOT for rent (sale only)\n\n"
    "SHOWING RESULTS:\n"
    "- Show MAX 3 results at a time, sorted by best match to user's criteria\n"
    "- For each result show: Name, Floor, Size (m²), Monthly rent or sale price, and contact info\n"
    "- If there are more matches, say: '...y [X] opciones mas. Quieres ver las siguientes?'\n"
    "- Use clean formatting with bold and bullet points, NO emojis\n\n"
    "FORBIDDEN:\n"
    "- Showing spaces with STATUS WTC = 'No Disponible' as available options\n"
    "- Making up prices or availability not in the data\n"
    "- Answering questions unrelated to WTC spaces\n"
    "- Dumping the entire list without filtering first\n\n"
    "SCOPE LIMITATION - CRITICAL RULE:\n"
    "- You ONLY answer questions related to available spaces for rent/sale at WTC CDMX\n"
    "- If the user asks ANYTHING unrelated to WTC, respond ONLY with:\n"
    "'Soy el asistente virtual del World Trade Center Ciudad de Mexico. Solo puedo ayudarte con informacion sobre espacios disponibles en renta y venta en el WTC CDMX. Buscas una oficina, bodega, local comercial o consultorio?'\n"
    "- NEVER act as a general-purpose chatbot</p>"
    "<p><strong>STRICTLY FORBIDDEN PHRASES (ALL LANGUAGES):</strong></p>"
    "<ul><li><p>NEVER use phrases like: \"segun el documento\", \"el documento menciona\", \"de acuerdo con el documento\", \"no se menciona en el documento\", \"according to the document\", \"the document states\".</p></li>"
    "<li><p>NEVER reveal you are consulting a document, file, or external data source.</p></li>"
    "<li><p>Instead, respond naturally as if you have expert knowledge of WTC availability. Example: Instead of \"Segun el inventario, hay...\" say \"Tenemos disponible...\"</p></li></ul>"
    "<br><br><strong>BREVITY RULE — MANDATORY:</strong><br>"
    "- Keep responses SHORT and DIRECT. Maximum 3-5 bullet points per answer.<br>"
    "- Do NOT list every single detail. Give the MOST RELEVANT info first.<br>"
    "- If there are many results (more than 3), show TOP 3 and say: '...y [X] opciones mas. Quieres ver mas?'<br>"
    "- NEVER repeat information the user already knows.<br>"
    "- NEVER add long introductions or conclusions. Go straight to the answer.<br>"
    "- Use SHORT bullet points, not full paragraphs.<br>"
    "- If the answer is simple, respond in 1-2 lines. Not everything needs a formatted list."
    + NO_EMOJI_RULE
)

for node in data["nodes"]:
    node_id = node["data"]["id"]
    messages = node["data"].get("inputs", {}).get("agentMessages", [])
    
    if not messages:
        continue
    
    for msg in messages:
        if msg.get("role") == "system" and msg.get("content"):
            content = msg["content"]
            
            # ── Special handling for Available Spaces agent ──
            if node_id == "agentAgentflow_7":
                msg["content"] = AVAILABLE_SPACES_NEW_PROMPT
                print(f"[REPLACED] {node_id}: Full prompt replaced (guided search)")
                continue
            
            # ── Strip emojis from all prompts ──
            original = content
            content = strip_emojis(content)
            
            # ── Remove emoji-related rules from prompts ──
            # Remove "✅ EMOJIS BY CATEGORY" sections
            content = re.sub(r'EMOJIS BY CATEGORY:.*?(?=\n\n|\n[A-Z])', '', content, flags=re.DOTALL)
            
            # ── Replace "ONE emoji per line maximum. Do not over-decorate." ──
            content = content.replace(
                "ONE emoji per line maximum. Do not over-decorate.",
                "NEVER use emojis. Use plain text only."
            )
            
            # ── Add NO-EMOJI rule at the end if not present ──
            if "NO-EMOJI RULE" not in content:
                # Insert before closing </p> if exists
                if content.rstrip().endswith("</p>"):
                    # Don't double-close
                    pass
                # Append at the very end
                content = content + NO_EMOJI_RULE
            
            if content != original:
                msg["content"] = content
                print(f"[UPDATED] {node_id}: emojis stripped + no-emoji rule added")

# Also strip emojis from the condition agent instructions
for node in data["nodes"]:
    node_id = node["data"]["id"]
    inputs = node["data"].get("inputs", {})
    
    # Condition agent instructions
    if "conditionAgentInstructions" in inputs and inputs["conditionAgentInstructions"]:
        original = inputs["conditionAgentInstructions"]
        cleaned = strip_emojis(original)
        if cleaned != original:
            inputs["conditionAgentInstructions"] = cleaned
            print(f"[UPDATED] {node_id}: condition agent instructions emojis stripped")

# ── save ──
with open(INPUT, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("\nDone! Changes saved to", INPUT)
print("Backup saved to", BACKUP)
