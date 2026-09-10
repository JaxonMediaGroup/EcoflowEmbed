# -*- coding: utf-8 -*-
"""Adapta los prompts del agentflow de NIZUC de plantilla inmobiliaria a concierge hotelero.

NIZUC es un resort de lujo (categoría hospitality), pero los prompts heredaban
copy de desarrollos residenciales: "lotes y departamentos", "financiamiento",
"preventa", "asesor comercial", etc. Este script aplica reemplazos exactos sobre
el HTML crudo de los prompts y falla ruidosamente si algún patrón ya no coincide.
"""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
AGENT_FILE = ROOT / "projects" / "NIZUC Agents.json"

# (texto_original, texto_nuevo, apariciones_mínimas_esperadas)
REPLACEMENTS = [
    # --- Agente principal, mensaje 0 (inglés) ---
    (
        "You are a multilingual real estate advisor for Nizuc.",
        "You are a multilingual luxury hotel concierge for NIZUC Resort &amp; Spa.",
        1,
    ),
    (
        "For price/size ranges",
        "For rates, prices and schedules",
        1,
    ),
    (
        "if it appears textually in the document",
        "if it appears textually in the NIZUC knowledge",
        1,
    ),
    (
        "I'll connect you with sales",
        "I'll connect you with our concierge or reservations team",
        1,
    ),
    (
        "If nothing found: redirect to sales",
        "If nothing found: redirect to the concierge or reservations team",
        1,
    ),
    # --- Agente principal, mensaje 1 (español, anti-alucinación) ---
    (
        "Te recomiendo validarlo directamente con un asesor comercial de Nizuc.",
        "Te recomiendo validarlo directamente con el concierge o el equipo de reservaciones de NIZUC.",
        1,
    ),
    (
        "I recommend validating directly with a Nizuc sales advisor.",
        "I recommend validating directly with the NIZUC concierge or reservations team.",
        1,
    ),
    (
        "- Precios, disponibilidad, inventario, promociones, descuentos",
        "- Tarifas, promociones y disponibilidad de suites",
        1,
    ),
    (
        "- Condiciones de pago, financiamiento, tasas",
        "- Condiciones de reserva, políticas de cancelación y cargos",
        1,
    ),
    (
        "- Fechas de entrega, etapas de lanzamiento",
        "- Disponibilidad de restaurantes, actividades y horarios",
        1,
    ),
    (
        "- Amenidades pendientes de confirmar",
        "- Amenidades o servicios por confirmar o temporalmente suspendidos",
        1,
    ),
    (
        "Te recomiendo validarla directamente con un asesor comercial.",
        "Te recomiendo validarla directamente con el concierge o recepción.",
        1,
    ),
    (
        "- Plusvalía o rendimientos financieros",
        "- Disponibilidad o upgrades no confirmados por reservaciones",
        1,
    ),
    (
        "- Fechas de entrega no confirmadas",
        "- Reservas, eventos o solicitudes especiales no confirmadas",
        1,
    ),
    (
        "- Amenidades no cerradas",
        "- Amenidades u horarios no confirmados",
        1,
    ),
    (
        "- Precios no validados por la fuente oficial",
        "- Tarifas o precios de menús no validados por la fuente oficial",
        1,
    ),
    (
        "- Disponibilidad sin inventario actualizado",
        "- Disponibilidad sin confirmación del equipo de reservaciones",
        1,
    ),
    (
        "- Condiciones hipotecarias no confirmadas",
        "- Políticas de cancelación o cargos no confirmados",
        1,
    ),
    (
        "the project: lots, residences, amenities, location, pricing, financing, presale, contact, and visit scheduling.",
        "NIZUC Resort &amp; Spa: suites y habitaciones, restaurantes y menús, spa y bienestar, actividades, tours y kids club, horarios y políticas, ubicación y transporte, tarifas y reservaciones, e información de contacto.",
        1,
    ),
    (
        "redirige amablemente al tema del proyecto",
        "redirige amablemente al tema del resort NIZUC",
        1,
    ),
    (
        "Si el usuario pide cotización detallada, disponibilidad exacta, negociación o seguimiento comercial, sugiere amablemente el contacto con un asesor comercial.",
        "Si el usuario quiere hacer o modificar una reservación, solicita algo especial (celebraciones, dietas, transporte) o necesita atención personalizada, sugiere amablemente el contacto con el concierge o el equipo de reservaciones.",
        1,
    ),
    # --- Condition Agent (instrucciones y escenarios) ---
    (
        "features, products, services, processes, contact info, visiting, financing, history, certifications, location, nearby services, or lifestyle topics that the project agent can connect back to the project",
        "suites and accommodations, restaurants and menus, spa and wellness, activities, tours and kids club, schedules, policies, location and transportation, rates and reservations, contact info, or lifestyle topics that the concierge can connect back to NIZUC",
        1,
    ),
    (
        '"Tell me about pricing/financing"',
        '"Tell me about rates and reservations"',
        1,
    ),
    (
        '"I want to schedule a visit"',
        '"I want to book a stay"',
        1,
    ),
    (
        "(security, location, investment, family life, sustainability)",
        "(dining, wellness, celebrations, family travel, local attractions)",
        1,
    ),
    (
        "Investment, financing, or presale questions",
        "Rates, availability or booking questions",
        1,
    ),
    (
        "The Nizuc agent knows how to connect lifestyle topics to the project.",
        "The NIZUC concierge knows how to connect lifestyle topics to the resort.",
        1,
    ),
    (
        "General question about Nizuc (features, services, location, pricing, contact, financing, presale, admissions, etc.)",
        "General question about NIZUC (suites, restaurants, spa, activities, schedules, policies, location, rates, reservations, contact, etc.)",
        1,
    ),
    # --- Off-Topic Guard (lista ES aparece 2 veces; lista EN, 1 vez) ---
    (
        "<li>Ubicación y accesos al desarrollo</li><li>Tipologías de lotes y departamentos</li><li>Amenidades, lagunas y zonas verdes</li><li>Precios, financiamiento y preventa</li><li>Proceso de compra y contrato</li><li>Información de contacto y citas</li>",
        "<li>Ubicación y transporte al resort</li><li>Habitaciones y suites</li><li>Restaurantes, menús y opciones dietéticas</li><li>Spa, bienestar, actividades y tours</li><li>Tarifas, reservaciones y políticas del resort</li><li>Horarios, contacto y solicitudes especiales</li>",
        2,
    ),
    (
        "<li>Location and access to the development</li><li>Lot and apartment typologies</li><li>Amenities, lagoons and green areas</li><li>Pricing, financing and presale</li><li>Purchase and contract process</li><li>Contact info and appointment booking</li>",
        "<li>Location and transportation to the resort</li><li>Rooms and suites</li><li>Restaurants, menus and dietary options</li><li>Spa, wellness, activities and tours</li><li>Rates, reservations and resort policies</li><li>Schedules, contact and special requests</li>",
        1,
    ),
    (
        "solo puedo ayudarte con temas relacionados al desarrollo.",
        "solo puedo ayudarte con temas relacionados al resort NIZUC.",
        1,
    ),
    (
        "Para información personalizada, contacta a un asesor comercial de Nizuc.",
        "Para información personalizada o reservaciones, contacta al concierge o al equipo de reservaciones de NIZUC.",
        1,
    ),
]


def iter_prompt_fields(data):
    """Itera todos los campos de prompt del agentflow junto a su setter."""
    for node in data["nodes"]:
        d = node.get("data", {})
        if d.get("type") == "Agent":
            for msg in d.get("inputs", {}).get("agentMessages", []) or []:
                yield lambda v, m=msg: m.__setitem__("content", v), msg["content"]
        elif d.get("type") == "ConditionAgent":
            inputs = d.get("inputs", {})
            instr = inputs.get("conditionAgentInstructions", "")
            yield (
                lambda v, i=inputs: i.__setitem__("conditionAgentInstructions", v),
                instr,
            )
            for scenario in inputs.get("conditionAgentScenarios", []) or []:
                yield (
                    lambda v, s=scenario: s.__setitem__("scenario", v),
                    scenario["scenario"],
                )


def main():
    with open(AGENT_FILE, encoding="utf-8") as f:
        data = json.load(f)

    # Paso 1: validar que cada patrón existe con las apariciones esperadas.
    contador = {old: 0 for old, _, _ in REPLACEMENTS}
    for _, texto in iter_prompt_fields(data):
        for old, _, _ in REPLACEMENTS:
            contador[old] += texto.count(old)

    errores = [
        f"NO ENCONTRADO ({contador[old]}/{esperado}): {old[:80]}..."
        for old, _, esperado in REPLACEMENTS
        if contador[old] < esperado
    ]
    if errores:
        print("ERROR: patrones sin coincidencia, no se modificó nada:")
        for e in errores:
            print(" -", e)
        sys.exit(1)

    # Paso 2: aplicar reemplazos y guardar.
    for setter, texto in iter_prompt_fields(data):
        for old, new, _ in REPLACEMENTS:
            texto = texto.replace(old, new)
        setter(texto)

    with open(AGENT_FILE, "w", encoding="utf-8", newline="\n") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
        f.write("\n")

    print(f"OK: {len(REPLACEMENTS)} reemplazos aplicados en {AGENT_FILE}")


if __name__ == "__main__":
    main()
