"""
v4: English condition agent instructions + bulletproof multilingual across ALL agents.
- Condition agent → English (better GPT compliance)
- Q&A / Sales / Off-Topic Guard → reinforce strict language matching
"""
import requests, json, time, sys, re

URL = "https://ecoflow.koppi.mx"
KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
H = {"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}

SKIP_IDS = {
    "a2dbda66-1339-43ae-9c67-d97f30c198ac",  # WTC
    "82ee9777-2d5f-49e9-9998-850eb5063928",  # ALE
    "90b046f2-2b56-4ad1-9fc5-abcd229de895",  # koppi
    "2bc49a0b-5459-4dab-b9a6-f4080c43371c",  # KIO
}


def get_category(name):
    n = name.lower()
    if n.startswith("lst") or "santisima" in n or "santísima" in n:
        return "lst"
    if "punta cuerna" in n:
        return "residencial_campo"
    if any(x in n for x in ["alvar", "coronado", "mavila"]):
        return "resort_quivira"
    if n.startswith("quivira") or n == "quivira":
        return "resort_quivira"
    if "ara dream" in n or "dream diamante" in n:
        return "resort_playa"
    if "sls" in n:
        return "resort_playa"
    if "pueblo bonito" in n:
        return "resort_playa"
    if any(x in n for x in ["nogales", "virreyes"]):
        return "casas"
    if "mahi" in n:
        return "casas"
    if any(x in n for x in ["archandel", "bosques de tepepan", "hideaways", "mozaiko"]):
        return "departamentos"
    if any(x in n for x in ["nauma", "nativas", "torre alhena", "volterra", "miyana"]):
        return "departamentos"
    if "plataforma" in n:
        return "departamentos"
    if "crm ai" in n:
        return "departamentos"
    if any(x in n for x in ["brisas", "nizuc", "mita map"]):
        return "hoteles"
    if any(x in n for x in ["ggi agwa", "ggi palmas", "torre zero", "we work", "wework", "ribra"]):
        return "oficinas"
    if any(x in n for x in ["punta zero", "gran terraza"]):
        return "centros_comerciales"
    if any(x in n for x in ["vesta", "prologis"]):
        return "industrial"
    if "novotech" in n and "mision punta" not in n and "misión punta" not in n:
        return "industrial"
    if "mision punta" in n or "misión punta" in n:
        return "terrenos"
    if "terralago" in n:
        return "terrenos"
    return "general"


# ═══════════════════════════════════════════════════════════
# CONDITION AGENT — ENGLISH TEMPLATES (per category)
# ═══════════════════════════════════════════════════════════

TEMPLATES = {
    "departamentos": {
        "desc": "a residential apartment development in Mexico",
        "topics": (
            "location, amenities, apartment types, prices, floor plans, "
            "construction progress, financing, delivery date, neighborhood, nearby schools, "
            "transportation, property appreciation, investment, parking, common areas"
        ),
        "examples_0": [
            ('"¿Qué tipos de departamentos tienen?"', "unit types"),
            ('"¿Cuándo entregan?"', "delivery date"),
            ('"¿Tienen roof garden?"', "amenities"),
            ('"¿Aceptan crédito Infonavit?"', "financing"),
        ],
        "examples_1": [
            ('"María García maria@gmail.com 5551234567"', "contact data"),
            ('"Quiero agendar una visita al showroom"', "appointment"),
        ],
        "smart": [
            ('"Me gustan los perros"', "pet-friendly areas, dog park"),
            ('"Tengo 2 hijos"', "playground, schools, parks"),
            ('"Me gusta cocinar"', "kitchen design, interiors"),
            ('"Trabajo desde casa"', "study rooms, coworking, internet"),
            ('"Me gusta hacer ejercicio"', "gym, pool, sports areas"),
            ('"¿Hay buenos restaurantes cerca?"', "neighborhood, lifestyle"),
            ('"Busco algo para invertir"', "appreciation, ROI, rental income"),
            ('"¿Es segura la zona?"', "security, gated access, surveillance"),
        ],
    },
    "resort_quivira": {
        "desc": "a luxury resort residential community in Los Cabos, Mexico",
        "topics": (
            "residences, condos, villas, prices, availability, "
            "golf course, beach club, amenities, investment, vacation rental, "
            "location, lifestyle, ocean view, penthouse"
        ),
        "examples_0": [
            ('"¿Qué tipos de residencias tienen?"', "available units"),
            ('"¿Tienen vista al mar?"', "features"),
            ('"¿Puedo rentarlo cuando no lo use?"', "vacation rental"),
            ('"¿Cómo es el campo de golf?"', "amenities"),
        ],
        "examples_1": [
            ('"Juan Pérez juan@email.com 5559876543"', "contact data"),
            ('"Quiero una visita virtual"', "appointment"),
        ],
        "smart": [
            ('"Me encanta el surf"', "beach, water activities"),
            ('"Busco un lugar para retirarme"', "lifestyle, community, climate"),
            ('"Me gusta el golf"', "golf course, club, tournaments"),
            ('"Quiero algo para vacaciones"', "vacation rental, shared use"),
            ('"¿Hay buena comida?"', "restaurants, beach club, dining"),
            ('"Mi familia es grande"', "villas, spacious homes, family areas"),
            ('"Me interesa como inversión"', "appreciation, rental program, ROI"),
            ('"¿Se puede llevar mascotas?"', "pet-friendly policies, green areas"),
        ],
    },
    "resort_playa": {
        "desc": "a beachfront residential resort development in Mexico",
        "topics": (
            "apartments, houses, residences, prices, availability, "
            "beach club, amenities, investment, location, lifestyle, "
            "fractional ownership, financing"
        ),
        "examples_0": [
            ('"¿Qué tipos de unidades tienen?"', "available options"),
            ('"¿Tienen acceso a playa privada?"', "amenities"),
            ('"¿Cómo funciona la propiedad fraccional?"', "purchase model"),
            ('"¿Cuánto cuestan?"', "pricing"),
        ],
        "examples_1": [
            ('"Ana López ana@email.com 3331234567"', "contact data"),
            ('"Quiero agendar una visita"', "appointment"),
        ],
        "smart": [
            ('"Me encanta el mar"', "beach, views, beach club"),
            ('"Busco un lugar para vacacionar"', "stay options, rental"),
            ('"Me gusta el snorkel"', "water activities, location"),
            ('"Quiero un lugar tranquilo"', "lifestyle, privacy, surroundings"),
            ('"¿Hay vida nocturna?"', "neighborhood, dining, entertainment"),
            ('"Tengo hijos pequeños"', "kids areas, pool, safety"),
            ('"¿Se puede pescar?"', "activities, water sports"),
            ('"Me interesa como inversión"', "appreciation, vacation rental"),
        ],
    },
    "casas": {
        "desc": "a residential house development in Mexico",
        "topics": (
            "house models, lots, prices, availability, amenities, "
            "financing, finishes, gated community, security, "
            "clubhouse, green areas, delivery"
        ),
        "examples_0": [
            ('"¿Qué modelos de casas tienen?"', "available models"),
            ('"¿Cuánto miden los terrenos?"', "lot sizes"),
            ('"¿Tienen casa club?"', "amenities"),
            ('"¿Aceptan crédito bancario?"', "financing"),
        ],
        "examples_1": [
            ('"Roberto Díaz roberto@email.com 8441234567"', "contact data"),
            ('"Quiero visitar la casa muestra"', "appointment"),
        ],
        "smart": [
            ('"Tengo 3 perros"', "private garden, pet-friendly areas"),
            ('"Me gusta la jardinería"', "garden, green areas"),
            ('"Mis hijos necesitan escuela"', "nearby schools"),
            ('"Trabajo en el centro"', "location, commute, access roads"),
            ('"Me gusta hacer parrilladas"', "garden, terrace, common areas"),
            ('"¿Es tranquilo?"', "security, privacy, gated community"),
            ('"Busco espacio para mi familia"', "spacious models, bedrooms"),
            ('"¿Hay parques?"', "green areas, parks, neighborhood"),
        ],
    },
    "lst": {
        "desc": "a vineyard with boutique hotel, restaurant, spa, and wine experiences in Mexico",
        "topics": (
            "suites, lodging, reservations, wine tastings, restaurant, "
            "spa, activities, residential lots, vineyard, events, "
            "gastronomy, tours, location"
        ),
        "examples_0": [
            ('"¿Qué tipos de suites tienen?"', "lodging"),
            ('"¿Tienen catas de vino?"', "experiences"),
            ('"¿Cómo es el restaurante?"', "dining"),
            ('"¿Tienen spa?"', "services"),
            ('"¿Venden lotes?"', "residential lots"),
        ],
        "examples_1": [
            ('"Carmen Ruiz carmen@email.com 4151234567"', "contact data"),
            ('"Quiero reservar para este fin de semana"', "reservation"),
        ],
        "smart": [
            ('"Me encanta el vino"', "wine tastings, vineyard, grape varieties"),
            ('"Es nuestro aniversario"', "romantic packages, spa, dinner"),
            ('"Busco un lugar tranquilo"', "countryside, nature, surroundings"),
            ('"Me gusta la buena comida"', "restaurant, menu, chef"),
            ('"¿Puedo llevar a mis hijos?"', "family activities, kids areas"),
            ('"Me interesa vivir en viñedos"', "residential lots, community"),
            ('"Quiero desconectarme de la ciudad"', "lifestyle, retreat, peace"),
            ('"¿Hacen bodas?"', "weddings, events, capacity"),
        ],
    },
    "residencial_campo": {
        "desc": "a countryside residential development with vineyards and equestrian amenities in Mexico",
        "topics": (
            "lots, land, vineyards, walnut trees, amenities, polo, equestrian club, "
            "boutique hotel, prices, availability, financing, "
            "country lifestyle, location"
        ),
        "examples_0": [
            ('"¿Qué tamaño de lotes tienen?"', "available lots"),
            ('"¿Tienen campo de polo?"', "amenities"),
            ('"¿Puedo plantar mi propio viñedo?"', "lifestyle"),
            ('"¿Cómo es el club ecuestre?"', "amenities"),
        ],
        "examples_1": [
            ('"Luis Torres luis@email.com 8181234567"', "contact data"),
            ('"Quiero conocer el desarrollo"', "visit"),
        ],
        "smart": [
            ('"Me encantan los caballos"', "equestrian club, polo"),
            ('"Me gusta el vino"', "vineyards, private production"),
            ('"Busco tranquilidad"', "country lifestyle, nature"),
            ('"Quiero un lugar para fines de semana"', "lots, country home"),
            ('"Tengo una familia grande"', "spacious lots, community"),
            ('"Me gusta el aire libre"', "activities, trails, countryside"),
            ('"¿Está lejos de la ciudad?"', "location, access, distance"),
            ('"Me interesa como inversión"', "appreciation, development, growth"),
        ],
    },
    "hoteles": {
        "desc": "a luxury hotel in Mexico",
        "topics": (
            "rooms, suites, villas, rates, availability, "
            "spa, restaurants, activities, events, weddings, "
            "packages, all-inclusive, location"
        ),
        "examples_0": [
            ('"¿Qué tipos de habitaciones tienen?"', "lodging options"),
            ('"¿Cuánto cuesta por noche?"', "rates"),
            ('"¿Tienen spa?"', "services"),
            ('"¿Qué restaurantes tienen?"', "dining"),
        ],
        "examples_1": [
            ('"Sofia Herrera sofia@email.com 9981234567"', "contact data"),
            ('"Quiero reservar para diciembre"', "reservation"),
        ],
        "smart": [
            ('"Es nuestro aniversario"', "romantic packages, spa"),
            ('"Viajo con niños"', "kids activities, kids club"),
            ('"Me gusta bucear"', "water activities, excursions"),
            ('"Quiero una boda en la playa"', "weddings, events, capacity"),
            ('"Busco relajarme"', "spa, massages, yoga, wellness"),
            ('"¿Tienen alberca?"', "amenities, infinity pool"),
            ('"Quiero algo exclusivo"', "private villas, premium suites"),
            ('"¿Aceptan mascotas?"', "pet-friendly policies"),
        ],
    },
    "oficinas": {
        "desc": "a corporate office building in Mexico",
        "topics": (
            "office spaces, square footage, rental prices, sale prices, "
            "configurations, parking, services, location, "
            "access, meeting rooms, security"
        ),
        "examples_0": [
            ('"¿Qué metrajes tienen disponibles?"', "available spaces"),
            ('"¿Cuánto cuesta la renta?"', "pricing"),
            ('"¿Tienen estacionamiento?"', "services"),
            ('"¿Están cerca del metro?"', "location"),
        ],
        "examples_1": [
            ('"Carlos Mendoza carlos@empresa.com 5551234567"', "contact data"),
            ('"Quiero agendar un recorrido"', "visit"),
        ],
        "smart": [
            ('"Somos un equipo de 20 personas"', "square footage, configurations"),
            ('"Necesitamos sala de juntas"', "corporate amenities, services"),
            ('"¿Hay buenos restaurantes cerca?"', "neighborhood, lifestyle"),
            ('"Buscamos imagen corporativa"', "building category, design"),
            ('"¿Tienen fibra óptica?"', "infrastructure, technology"),
            ('"Mi equipo usa bicicleta"', "bike parking, access, area"),
            ('"Necesitamos espacio flexible"', "configurations, coworking"),
            ('"¿Se puede estacionar fácilmente?"', "parking, access"),
        ],
    },
    "centros_comerciales": {
        "desc": "a commercial center with retail spaces for rent and sale in Mexico",
        "topics": (
            "retail spaces, square footage, rental prices, sale prices, "
            "location, foot traffic, parking, services, "
            "permitted business types, hours"
        ),
        "examples_0": [
            ('"¿Qué locales tienen disponibles?"', "retail spaces"),
            ('"¿Cuánto cuesta la renta de un local?"', "pricing"),
            ('"¿Cuántas personas pasan al día?"', "foot traffic"),
            ('"¿Qué giros están permitidos?"', "regulations"),
        ],
        "examples_1": [
            ('"Laura Vega laura@negocio.com 5551234567"', "contact data"),
            ('"Quiero conocer los locales"', "visit"),
        ],
        "smart": [
            ('"Tengo un restaurante"', "food court spaces, restaurant locations"),
            ('"Quiero abrir una tienda de ropa"', "available spaces, area"),
            ('"¿Hay mucho tráfico de gente?"', "foot traffic, strategic location"),
            ('"Busco buena ubicación para mi negocio"', "commercial advantages"),
            ('"¿Tienen local en planta baja?"', "locations within center"),
            ('"¿Hay estacionamiento para clientes?"', "parking, access"),
            ('"¿Qué otras tiendas hay?"', "tenant mix, anchor stores"),
            ('"¿Está en crecimiento la zona?"', "appreciation, location, projection"),
        ],
    },
    "industrial": {
        "desc": "an industrial park with warehouses and logistics spaces in Mexico",
        "topics": (
            "warehouses, storage, land, square footage, technical specs, "
            "rental prices, sale prices, infrastructure, logistics, "
            "location, highway access, services"
        ),
        "examples_0": [
            ('"¿Qué metrajes de naves tienen?"', "available spaces"),
            ('"¿Cuánto cuesta la renta por m²?"', "pricing"),
            ('"¿Tienen acceso a carretera federal?"', "logistics"),
            ('"¿Qué especificaciones tiene la nave?"', "technical specs"),
        ],
        "examples_1": [
            ('"Ing. Martínez martinez@empresa.com 4771234567"', "contact data"),
            ('"Quiero una visita al parque"', "visit"),
        ],
        "smart": [
            ('"Manejamos productos refrigerados"', "infrastructure, climate control"),
            ('"Necesitamos muelle de carga"', "warehouse specs, loading docks"),
            ('"¿Hay transporte público para trabajadores?"', "location, access"),
            ('"Somos una empresa de logística"', "strategic location, connectivity"),
            ('"¿Tienen vigilancia 24/7?"', "security, park services"),
            ('"Necesitamos espacio de oficina también"', "warehouse + office configs"),
            ('"¿Se puede ampliar después?"', "land, scalability"),
            ('"¿Qué empresas están ahí?"', "industrial cluster, tenants"),
        ],
    },
    "terrenos": {
        "desc": "a land development with lots for sale in Mexico",
        "topics": (
            "lots, land, areas, prices, availability, "
            "zoning, infrastructure, utilities, "
            "financing, location, master plan"
        ),
        "examples_0": [
            ('"¿Qué tamaños de lotes tienen?"', "lot sizes"),
            ('"¿Cuánto cuestan?"', "pricing"),
            ('"¿Qué uso de suelo tienen?"', "zoning"),
            ('"¿Ya tienen servicios?"', "infrastructure"),
        ],
        "examples_1": [
            ('"Pedro Salazar pedro@email.com 6121234567"', "contact data"),
            ('"Quiero conocer el terreno"', "visit"),
        ],
        "smart": [
            ('"Quiero construir mi casa"', "residential lots, project"),
            ('"Me gusta la naturaleza"', "surroundings, green areas, views"),
            ('"Busco algo para invertir"', "appreciation, growth, urbanization"),
            ('"¿Está urbanizado?"', "utilities, current infrastructure"),
            ('"¿Hay playa cerca?"', "location, surroundings, distances"),
            ('"Quiero un terreno grande"', "lot options, sizes"),
            ('"¿Puedo construir un negocio?"', "zoning, regulations"),
            ('"¿Hay financiamiento?"', "payment plans, credit"),
        ],
    },
}

TEMPLATES["general"] = TEMPLATES["departamentos"]


def build_condition_instructions(project_name, category, offtopic_idx):
    """Build ENGLISH condition agent instructions with Spanish examples."""
    t = TEMPLATES.get(category, TEMPLATES["general"])

    inst = (
        f'<p>You are a multilingual intent classifier for <strong>{project_name}</strong>, '
        f'{t["desc"]}. Your job is to understand what the user needs and route them to the correct agent.</p>'
        f''
        f'<p><strong>Categories:</strong></p>'
        f'<ol start="0">'
        f'<li><strong>General inquiry</strong> — Any question that CAN BE RELATED to the project: '
        f'{t["topics"]}. Works in any language.</li>'
        f'<li><strong>Contact or appointment</strong> — When the user shares personal data '
        f'(name, email, phone) or asks to schedule a visit/call.</li>'
        f'<li><strong>Off-topic</strong> — ONLY when the question is IMPOSSIBLE to relate '
        f'to {project_name}: homework, programming code, math equations, '
        f'step-by-step recipes, text translation, historical biographies, creative poetry.</li>'
        f'</ol>'
    )

    # Examples
    inst += '<p><strong>Classification examples:</strong></p><ul>'
    for ex, desc in t["examples_0"]:
        inst += f'<li>{ex} → 0 ({desc})</li>'
    for ex, desc in t["examples_1"]:
        inst += f'<li>{ex} → 1 ({desc})</li>'
    inst += '</ul>'

    # Smart routing
    inst += (
        f'<p><strong>🧠 SMART ROUTING:</strong></p>'
        f'<p>The user is ALREADY talking to the {project_name} assistant. '
        f'If someone mentions a personal interest, hobby, or need, the project agent is smart enough '
        f'to connect it to {project_name}. Your job is to give it the chance to do so.</p>'
        f'<p><strong>These ARE project-related (→ 0):</strong></p><ul>'
    )
    for ex, reason in t["smart"]:
        inst += f'<li>{ex} → 0 — can talk about {reason}</li>'
    inst += '</ul>'

    # Off-topic
    inst += (
        f'<p><strong>These ARE off-topic (→ {offtopic_idx}):</strong></p><ul>'
        f'<li>"Resuelve 2x+3=7" → {offtopic_idx}</li>'
        f'<li>"Write me Python code" → {offtopic_idx}</li>'
        f'<li>"Dame la receta del pastel de chocolate" → {offtopic_idx}</li>'
        f'<li>"Help me with my history homework" → {offtopic_idx}</li>'
        f'<li>"Tell me Einstein\'s biography" → {offtopic_idx}</li>'
        f'<li>"Escríbeme un poema de amor" → {offtopic_idx}</li>'
        f'<li>"Translate this to Japanese" → {offtopic_idx}</li>'
        f'<li>"What\'s the square root of 144?" → {offtopic_idx}</li>'
        f'</ul>'
    )

    # Golden rule
    inst += (
        f'<p><strong>⚡ GOLDEN RULE:</strong> When in doubt, ALWAYS route to a project category (0). '
        f'The {project_name} agent knows how to connect any lifestyle topic to the project. '
        f'Only route to {offtopic_idx} if it is clearly ACADEMIC, TECHNICAL, or a knowledge request '
        f'that has nothing to do with real estate or the project\'s lifestyle.</p>'
    )

    # Language note
    inst += (
        f'<p><strong>🌍 LANGUAGE NOTE:</strong> Classify by intent, NOT by language. '
        f'If the user writes in English, French, Chinese, Arabic, or any language, classify the same way. '
        f'The downstream agents handle multilingual responses.</p>'
    )

    return inst


# ═══════════════════════════════════════════════════════════
# MULTILINGUAL REINFORCEMENT BLOCK — injected into Q&A, Sales, Guard
# ═══════════════════════════════════════════════════════════

LANG_RULE_QA = (
    '<p><strong>🌍 STRICT LANGUAGE RULE:</strong></p>'
    '<ul>'
    '<li>Detect the language of the user\'s LAST message.</li>'
    '<li>Respond ENTIRELY in that EXACT language. No mixing.</li>'
    '<li>If the user switches language mid-conversation, switch IMMEDIATELY.</li>'
    '<li>If the user writes in Chinese, respond in Chinese. In Arabic, respond in Arabic. In Portuguese, respond in Portuguese. ANY language.</li>'
    '<li>NEVER mix languages in the same response (e.g., no Spanish words in an English response).</li>'
    '<li>This rule overrides everything else. Even if your instructions are in English/Spanish, your RESPONSE must match the USER\'s language.</li>'
    '</ul>'
)

LANG_RULE_GUARD = (
    '<p><strong>🌍 STRICT LANGUAGE RULE:</strong> '
    'Detect the user\'s language and respond ENTIRELY in that language. '
    'If they write in Chinese, respond in Chinese. In French, respond in French. '
    'NEVER mix languages. If the user switches language, switch immediately.</p>'
)


def inject_lang_rule(content, rule_block):
    """Inject/replace language rule in an agent's system prompt."""
    # Remove old language rules (various patterns)
    patterns = [
        r'<p><strong>🌍 CRITICAL LANGUAGE RULE:.*?</strong></p>',
        r'<p><strong>🌍 CRITICAL:.*?</strong></p>',
        r'<p><strong>🌍 LANGUAGE:.*?</strong></p>',
        r'<p><strong>🌍 REGLA DE IDIOMA:.*?</strong></p>',
        r'<p><strong>🌍 IDIOMA:.*?</strong></p>',
        r'<p><strong>🌍 STRICT LANGUAGE RULE:.*?</ul>',
        r'<p><strong>🌍 STRICT LANGUAGE RULE:</strong>.*?</p>',
    ]
    cleaned = content
    for pat in patterns:
        cleaned = re.sub(pat, '', cleaned, flags=re.DOTALL)

    # Find insertion point: after first </p> (after the title)
    first_p_end = cleaned.find('</p>')
    if first_p_end != -1:
        insert_at = first_p_end + 4
        return cleaned[:insert_at] + rule_block + cleaned[insert_at:]
    else:
        return rule_block + cleaned


def find_offtopic_scenario_idx(scenarios):
    for i, s in enumerate(scenarios):
        sc = s.get("scenario", "").lower()
        if "completely unrelated" in sc or "off-topic" in sc or "impossible to relate" in sc:
            return i
    return None


def main():
    print("=" * 70)
    print("🌍 v4: English Condition Agent + Bulletproof Multilingual")
    print("=" * 70)

    resp = requests.get(f"{URL}/api/v1/chatflows", headers=H, timeout=30)
    if resp.status_code != 200:
        print(f"❌ Failed: {resp.status_code}")
        sys.exit(1)

    agentflows = [cf for cf in resp.json() if cf.get("type") == "AGENTFLOW"]
    print(f"   {len(agentflows)} AGENTFLOWs\n")

    results = {"fixed": [], "skipped": [], "failed": []}

    for i, cf in enumerate(agentflows):
        cf_id = cf["id"]
        cf_name = cf.get("name", "Unknown")

        if cf_id in SKIP_IDS:
            results["skipped"].append((cf_name, "skip list"))
            continue

        try:
            detail = requests.get(f"{URL}/api/v1/chatflows/{cf_id}", headers=H, timeout=30)
            flow_data = json.loads(detail.json()["flowData"])
        except Exception as e:
            results["failed"].append((cf_name, str(e)))
            continue

        category = get_category(cf_name)
        changes = []

        for node in flow_data["nodes"]:
            ntype = node["data"]["name"]
            label = node["data"].get("label", "").lower()

            # ── CONDITION AGENT ──
            if ntype == "conditionAgentAgentflow":
                scenarios = node["data"]["inputs"]["conditionAgentScenarios"]
                ot_idx = find_offtopic_scenario_idx(scenarios)
                if ot_idx is not None:
                    new_inst = build_condition_instructions(cf_name, category, ot_idx)
                    node["data"]["inputs"]["conditionAgentInstructions"] = new_inst
                    changes.append("condition→EN")

            # ── Q&A AGENT (not Sales, not Guard) ──
            elif ntype == "agentAgentflow":
                msgs = node["data"]["inputs"].get("agentMessages", [])
                if not msgs:
                    continue
                content = msgs[0].get("content", "")

                if "off-topic" in label or "guard" in label:
                    # Off-Topic Guard — inject short lang rule
                    msgs[0]["content"] = inject_lang_rule(content, LANG_RULE_GUARD)
                    changes.append("guard+lang")
                elif "sales" in label or "contacto" in label or "lead" in label:
                    # Sales Agent — inject full lang rule
                    msgs[0]["content"] = inject_lang_rule(content, LANG_RULE_QA)
                    changes.append("sales+lang")
                else:
                    # Q&A Agent — inject full lang rule
                    msgs[0]["content"] = inject_lang_rule(content, LANG_RULE_QA)
                    changes.append("qa+lang")

        if not changes:
            results["skipped"].append((cf_name, "no changes needed"))
            continue

        # Push
        payload = {"flowData": json.dumps(flow_data, ensure_ascii=False)}
        push = requests.put(
            f"{URL}/api/v1/chatflows/{cf_id}",
            headers=H, json=payload, timeout=30
        )
        if push.status_code == 200:
            print(f"  ✅ {cf_name} [{category}] — {', '.join(changes)}")
            results["fixed"].append((cf_name, changes))
        else:
            print(f"  ❌ {cf_name} — {push.status_code}")
            results["failed"].append((cf_name, f"Push {push.status_code}"))

        time.sleep(0.3)

    print("\n" + "=" * 70)
    print(f"✅ {len(results['fixed'])} updated | ⏭️ {len(results['skipped'])} skipped | ❌ {len(results['failed'])} failed")
    print("=" * 70)
    if results["failed"]:
        print("\n❌ FAILED:")
        for n, r in results["failed"]:
            print(f"   ✗ {n}: {r}")


if __name__ == "__main__":
    main()
