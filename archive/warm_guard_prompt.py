"""
Update Off-Topic Guard prompts to be warm, short, modern.
Personalized per project category.
"""
import requests, json, time, sys

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


# ─────────────────────────────────────────────────────────
# WARM GUARD PROMPTS — short, modern, personalized
# ─────────────────────────────────────────────────────────

WARM_GUARD = {
    "departamentos": {
        "es": (
            "¡Hola! 😊\n"
            "Estoy aquí para ayudarte con todo sobre {name}.\n\n"
            "Desde precios y disponibilidad hasta amenidades, departamentos o agendar una visita, "
            "dime qué te gustaría conocer y te apoyo."
        ),
        "en": (
            "Hi there! 😊\n"
            "I'm here to help you with everything about {name}.\n\n"
            "From pricing and availability to amenities, apartments, or scheduling a visit — "
            "just let me know what you'd like to know!"
        ),
    },
    "resort_quivira": {
        "es": (
            "¡Hola! 😊\n"
            "Estoy aquí para ayudarte con todo sobre {name}.\n\n"
            "Desde residencias y precios hasta golf, club de playa o renta vacacional, "
            "dime qué te gustaría saber y con gusto te ayudo."
        ),
        "en": (
            "Hi there! 😊\n"
            "I'm here to help you with everything about {name}.\n\n"
            "From residences and pricing to golf, beach club, or vacation rentals — "
            "just let me know what you'd like to know!"
        ),
    },
    "resort_playa": {
        "es": (
            "¡Hola! 😊\n"
            "Estoy aquí para ayudarte con todo sobre {name}.\n\n"
            "Desde residencias y precios hasta club de playa, amenidades o inversión, "
            "dime qué te gustaría conocer y te apoyo."
        ),
        "en": (
            "Hi there! 😊\n"
            "I'm here to help you with everything about {name}.\n\n"
            "From residences and pricing to beach club, amenities, or investment options — "
            "just let me know what you'd like to know!"
        ),
    },
    "casas": {
        "es": (
            "¡Hola! 😊\n"
            "Estoy aquí para ayudarte con todo sobre {name}.\n\n"
            "Desde modelos de casas y precios hasta amenidades, lotes o financiamiento, "
            "dime qué te gustaría saber y con gusto te ayudo."
        ),
        "en": (
            "Hi there! 😊\n"
            "I'm here to help you with everything about {name}.\n\n"
            "From house models and pricing to amenities, lots, or financing — "
            "just let me know what you'd like to know!"
        ),
    },
    "lst": {
        "es": (
            "¡Hola! 😊\n"
            "Estoy aquí para ayudarte con todo sobre {name}.\n\n"
            "Desde hospedaje y experiencias vinícolas hasta restaurante, spa o eventos, "
            "dime qué te gustaría conocer y te apoyo."
        ),
        "en": (
            "Hi there! 😊\n"
            "I'm here to help you with everything about {name}.\n\n"
            "From lodging and wine experiences to dining, spa, or events — "
            "just let me know what you'd like to know!"
        ),
    },
    "residencial_campo": {
        "es": (
            "¡Hola! 😊\n"
            "Estoy aquí para ayudarte con todo sobre {name}.\n\n"
            "Desde lotes y terrenos hasta viñedos, club ecuestre o estilo de vida campestre, "
            "dime qué te gustaría saber y con gusto te ayudo."
        ),
        "en": (
            "Hi there! 😊\n"
            "I'm here to help you with everything about {name}.\n\n"
            "From lots and land to vineyards, equestrian club, or country lifestyle — "
            "just let me know what you'd like to know!"
        ),
    },
    "hoteles": {
        "es": (
            "¡Hola! 😊\n"
            "Estoy aquí para ayudarte con todo sobre {name}.\n\n"
            "Desde habitaciones y tarifas hasta spa, restaurantes o actividades, "
            "dime qué te gustaría conocer y te apoyo."
        ),
        "en": (
            "Hi there! 😊\n"
            "I'm here to help you with everything about {name}.\n\n"
            "From rooms and rates to spa, dining, or activities — "
            "just let me know what you'd like to know!"
        ),
    },
    "oficinas": {
        "es": (
            "¡Hola! 😊\n"
            "Estoy aquí para ayudarte con todo sobre {name}.\n\n"
            "Desde espacios disponibles y precios hasta servicios, estacionamiento o ubicación, "
            "dime qué necesitas saber y con gusto te ayudo."
        ),
        "en": (
            "Hi there! 😊\n"
            "I'm here to help you with everything about {name}.\n\n"
            "From available spaces and pricing to services, parking, or location — "
            "just let me know what you need!"
        ),
    },
    "centros_comerciales": {
        "es": (
            "¡Hola! 😊\n"
            "Estoy aquí para ayudarte con todo sobre {name}.\n\n"
            "Desde locales disponibles y precios hasta ubicación, afluencia o servicios, "
            "dime qué te gustaría conocer y te apoyo."
        ),
        "en": (
            "Hi there! 😊\n"
            "I'm here to help you with everything about {name}.\n\n"
            "From available spaces and pricing to location, foot traffic, or services — "
            "just let me know what you'd like to know!"
        ),
    },
    "industrial": {
        "es": (
            "¡Hola! 😊\n"
            "Estoy aquí para ayudarte con todo sobre {name}.\n\n"
            "Desde naves y bodegas hasta especificaciones, ubicación o logística, "
            "dime qué necesitas saber y con gusto te ayudo."
        ),
        "en": (
            "Hi there! 😊\n"
            "I'm here to help you with everything about {name}.\n\n"
            "From warehouses and specs to location or logistics — "
            "just let me know what you need!"
        ),
    },
    "terrenos": {
        "es": (
            "¡Hola! 😊\n"
            "Estoy aquí para ayudarte con todo sobre {name}.\n\n"
            "Desde lotes y precios hasta uso de suelo, servicios o financiamiento, "
            "dime qué te gustaría saber y con gusto te ayudo."
        ),
        "en": (
            "Hi there! 😊\n"
            "I'm here to help you with everything about {name}.\n\n"
            "From lots and pricing to land use, utilities, or financing — "
            "just let me know what you'd like to know!"
        ),
    },
}

# Fallback
WARM_GUARD["general"] = WARM_GUARD["departamentos"]


def build_guard_system_prompt(project_name, category):
    """Build the new warm, short, modern guard prompt."""
    t = WARM_GUARD.get(category, WARM_GUARD["general"])
    msg_es = t["es"].format(name=project_name)
    msg_en = t["en"].format(name=project_name)

    return (
        f"<p>Eres el asistente virtual de <strong>{project_name}</strong>. "
        f"Tu único trabajo es redirigir amablemente al usuario hacia temas del proyecto.</p>"
        f"<p><strong>🌍 IDIOMA:</strong> Detecta el idioma del usuario y responde en el mismo idioma.</p>"
        f"<p><strong>📝 CÓMO RESPONDER:</strong></p>"
        f"<p>Para CUALQUIER mensaje (saludo, pregunta fuera de tema, o cualquier cosa que no sea del proyecto), "
        f"responde con este mensaje cálido:</p>"
        f"<p><strong>En español:</strong></p>"
        f"<p>{msg_es}</p>"
        f"<p><strong>In English:</strong></p>"
        f"<p>{msg_en}</p>"
        f"<p><strong>Otros idiomas:</strong> Traduce el mensaje al idioma del usuario manteniendo el mismo tono cálido y corto.</p>"
        f"<p><strong>⛔ REGLAS:</strong></p>"
        f"<ul>"
        f"<li>NUNCA respondas preguntas fuera de tema, ni parcialmente</li>"
        f"<li>NUNCA des conocimiento general, recetas, código, traducciones, etc.</li>"
        f"<li>Mantén SIEMPRE el tono amigable y corto</li>"
        f"<li>NO uses listas largas de temas — el mensaje ya los menciona naturalmente</li>"
        f"</ul>"
    )


def find_guard_node(flow_data):
    """Find the Off-Topic Guard agent node."""
    for node in flow_data["nodes"]:
        label = node["data"].get("label", "").lower()
        if "off-topic" in label or "off topic" in label:
            return node
    return None


def main():
    print("=" * 70)
    print("🎨 Warm Off-Topic Guard Prompts Update")
    print("=" * 70)

    resp = requests.get(f"{URL}/api/v1/chatflows", headers=H, timeout=30)
    if resp.status_code != 200:
        print(f"❌ Failed: {resp.status_code}")
        sys.exit(1)

    agentflows = [cf for cf in resp.json() if cf.get("type") == "AGENTFLOW"]
    print(f"   {len(agentflows)} AGENTFLOWs")

    results = {"fixed": [], "skipped": [], "failed": []}

    for i, cf in enumerate(agentflows):
        cf_id = cf["id"]
        cf_name = cf.get("name", "Unknown")
        print(f"\n[{i+1}/{len(agentflows)}] {cf_name}", end="")

        if cf_id in SKIP_IDS:
            results["skipped"].append((cf_name, "skip list"))
            print(" ⏭️")
            continue

        try:
            detail = requests.get(f"{URL}/api/v1/chatflows/{cf_id}", headers=H, timeout=30)
            flow_data = json.loads(detail.json()["flowData"])
        except Exception as e:
            results["failed"].append((cf_name, str(e)))
            print(f" ❌ {e}")
            continue

        guard = find_guard_node(flow_data)
        if not guard:
            results["skipped"].append((cf_name, "no guard node"))
            print(" ⏭️ no guard")
            continue

        category = get_category(cf_name)
        new_prompt = build_guard_system_prompt(cf_name, category)

        # Update the system message
        messages = guard["data"]["inputs"].get("agentMessages", [])
        if messages:
            old_len = len(messages[0].get("content", ""))
            messages[0]["content"] = new_prompt
        else:
            old_len = 0
            guard["data"]["inputs"]["agentMessages"] = [{"role": "system", "content": new_prompt}]

        print(f" [{category}] {old_len}→{len(new_prompt)} chars", end="")

        # Push
        payload = {"flowData": json.dumps(flow_data, ensure_ascii=False)}
        push = requests.put(
            f"{URL}/api/v1/chatflows/{cf_id}",
            headers=H, json=payload, timeout=30
        )
        if push.status_code == 200:
            print(" ✅")
            results["fixed"].append((cf_name, category))
        else:
            print(f" ❌ {push.status_code}")
            results["failed"].append((cf_name, f"Push {push.status_code}"))

        time.sleep(0.3)

    print("\n" + "=" * 70)
    print(f"✅ {len(results['fixed'])} updated | ⏭️ {len(results['skipped'])} skipped | ❌ {len(results['failed'])} failed")
    print("=" * 70)
    for n, c in results["fixed"]:
        print(f"   ✓ {n} [{c}]")
    if results["failed"]:
        print("\n❌ FAILED:")
        for n, r in results["failed"]:
            print(f"   ✗ {n}: {r}")


if __name__ == "__main__":
    main()
