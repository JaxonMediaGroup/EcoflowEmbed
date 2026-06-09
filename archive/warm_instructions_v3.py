"""
Warm & Personalized Condition Agent Instructions v3
- Customized per project category with warm tone
- Smart routing examples relevant to each project type
- Off-topic only for truly impossible-to-relate questions
"""
import json
import requests
import time
import sys
import re

FLOWISE_URL = "https://ecoflow.koppi.mx"
API_KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

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
    if n.startswith("quivira") or (n == "quivira"):
        return "resort_quivira"
    if "ara dream" in n or "dream diamante" in n:
        return "resort_playa"
    if "sls" in n:
        return "resort_playa"
    if any(x in n for x in ["pueblo bonito"]):
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


# =============================================================================
# PERSONALIZED INSTRUCTION TEMPLATES PER CATEGORY
# =============================================================================

def build_instructions(project_name, category, offtopic_idx):
    """Build the complete condition agent instructions, warm and personalized."""

    templates = {
        # ─────────────────── DEPARTAMENTOS ───────────────────
        "departamentos": {
            "desc": "un desarrollo residencial de departamentos en México",
            "inquiry_topics": (
                "ubicación, amenidades, tipos de departamentos, precios, planos, "
                "avance de obra, financiamiento, fecha de entrega, zona, escuelas cercanas, "
                "transporte, plusvalía, inversión, estacionamiento, áreas comunes"
            ),
            "examples_0": [
                ('"¿Qué tipos de departamentos tienen?"', "tipos de unidades"),
                ('"¿Cuándo entregan?"', "fecha de entrega"),
                ('"¿Tienen roof garden?"', "amenidades"),
                ('"¿Aceptan crédito Infonavit?"', "financiamiento"),
            ],
            "examples_1": [
                ('"María García maria@gmail.com 5551234567"', "datos de contacto"),
                ('"Quiero agendar una visita al showroom"', "cita"),
            ],
            "smart_examples": [
                ('"Me gustan los perros"', "puede hablar de áreas pet-friendly, dog park"),
                ('"Tengo 2 hijos"', "puede hablar de ludoteca, escuelas, parques"),
                ('"Me gusta cocinar"', "puede hablar de las cocinas, diseño interior"),
                ('"Trabajo desde casa"', "puede hablar de study rooms, coworking, internet"),
                ('"Me gusta hacer ejercicio"', "puede hablar de gimnasio, alberca, áreas deportivas"),
                ('"¿Hay buenos restaurantes cerca?"', "zona, estilo de vida, alrededores"),
                ('"Busco algo para invertir"', "plusvalía, rendimiento, renta"),
                ('"¿Es segura la zona?"', "seguridad, vigilancia, acceso controlado"),
            ],
        },

        # ─────────────────── RESORT QUIVIRA ───────────────────
        "resort_quivira": {
            "desc": "una comunidad residencial de lujo tipo resort en Los Cabos, México",
            "inquiry_topics": (
                "residencias, condominios, villas, precios, disponibilidad, "
                "campo de golf, club de playa, amenidades, inversión, renta vacacional, "
                "ubicación, estilo de vida, ocean view, penthouse"
            ),
            "examples_0": [
                ('"¿Qué tipos de residencias tienen?"', "unidades disponibles"),
                ('"¿Tienen vista al mar?"', "características"),
                ('"¿Puedo rentarlo cuando no lo use?"', "renta vacacional"),
                ('"¿Cómo es el campo de golf?"', "amenidades"),
            ],
            "examples_1": [
                ('"Juan Pérez juan@email.com 5559876543"', "datos de contacto"),
                ('"Quiero una visita virtual"', "cita"),
            ],
            "smart_examples": [
                ('"Me encanta el surf"', "puede hablar de la playa, actividades acuáticas"),
                ('"Busco un lugar para retirarme"', "estilo de vida, comunidad, clima"),
                ('"Me gusta el golf"', "campo de golf, club, torneos"),
                ('"Quiero algo para vacaciones"', "renta vacacional, uso compartido"),
                ('"¿Hay buena comida?"', "restaurantes, club de playa, gastronomía"),
                ('"Mi familia es grande"', "villas, residencias amplias, áreas familiares"),
                ('"Me interesa como inversión"', "plusvalía, rental program, ROI"),
                ('"¿Se puede llevar mascotas?"', "políticas pet-friendly, áreas verdes"),
            ],
        },

        # ─────────────────── RESORT PLAYA ───────────────────
        "resort_playa": {
            "desc": "un desarrollo residencial de playa en México",
            "inquiry_topics": (
                "departamentos, casas, residencias, precios, disponibilidad, "
                "club de playa, amenidades, inversión, ubicación, estilo de vida, "
                "propiedad fraccional, financiamiento"
            ),
            "examples_0": [
                ('"¿Qué tipos de unidades tienen?"', "opciones disponibles"),
                ('"¿Tienen acceso a playa privada?"', "amenidades"),
                ('"¿Cómo funciona la propiedad fraccional?"', "modelo de compra"),
                ('"¿Cuánto cuestan?"', "precios"),
            ],
            "examples_1": [
                ('"Ana López ana@email.com 3331234567"', "datos de contacto"),
                ('"Quiero agendar una visita"', "cita"),
            ],
            "smart_examples": [
                ('"Me encanta el mar"', "puede hablar de la playa, vistas, club de playa"),
                ('"Busco un lugar para vacacionar"', "opciones de estancia, renta"),
                ('"Me gusta el snorkel"', "actividades acuáticas, ubicación"),
                ('"Quiero un lugar tranquilo"', "estilo de vida, privacidad, entorno"),
                ('"¿Hay vida nocturna?"', "zona, alrededores, restaurantes"),
                ('"Tengo hijos pequeños"', "áreas infantiles, alberca, seguridad"),
                ('"¿Se puede pescar?"', "actividades, deportes acuáticos"),
                ('"Me interesa como inversión"', "plusvalía, renta vacacional"),
            ],
        },

        # ─────────────────── CASAS ───────────────────
        "casas": {
            "desc": "un desarrollo residencial de casas en México",
            "inquiry_topics": (
                "modelos de casas, lotes, precios, disponibilidad, amenidades, "
                "financiamiento, acabados, fraccionamiento, seguridad, "
                "casa club, áreas verdes, entrega"
            ),
            "examples_0": [
                ('"¿Qué modelos de casas tienen?"', "modelos disponibles"),
                ('"¿Cuánto miden los terrenos?"', "lotes"),
                ('"¿Tienen casa club?"', "amenidades"),
                ('"¿Aceptan crédito bancario?"', "financiamiento"),
            ],
            "examples_1": [
                ('"Roberto Díaz roberto@email.com 8441234567"', "datos de contacto"),
                ('"Quiero visitar la casa muestra"', "cita"),
            ],
            "smart_examples": [
                ('"Tengo 3 perros"', "puede hablar de jardín privado, áreas pet-friendly"),
                ('"Me gusta la jardinería"', "puede hablar de jardín, áreas verdes"),
                ('"Mis hijos necesitan escuela"', "puede hablar de escuelas cercanas"),
                ('"Trabajo en el centro"', "ubicación, accesos, distancias"),
                ('"Me gusta hacer parrilladas"', "jardín, terraza, áreas comunes"),
                ('"¿Es tranquilo?"', "seguridad, privacidad, fraccionamiento cerrado"),
                ('"Busco espacio para mi familia"', "modelos amplios, recámaras"),
                ('"¿Hay parques?"', "áreas verdes, parques, zona"),
            ],
        },

        # ─────────────────── LST (Viñedos/Hotel Boutique) ───────────────────
        "lst": {
            "desc": "un viñedo con hotel boutique, restaurante, spa y experiencias vinícolas en México",
            "inquiry_topics": (
                "suites, hospedaje, reservaciones, catas de vino, restaurante, "
                "spa, actividades, lotes residenciales, viñedo, eventos, "
                "gastronomía, tours, ubicación"
            ),
            "examples_0": [
                ('"¿Qué tipos de suites tienen?"', "hospedaje"),
                ('"¿Tienen catas de vino?"', "experiencias"),
                ('"¿Cómo es el restaurante?"', "gastronomía"),
                ('"¿Tienen spa?"', "servicios"),
                ('"¿Venden lotes?"', "terrenos residenciales"),
            ],
            "examples_1": [
                ('"Carmen Ruiz carmen@email.com 4151234567"', "datos de contacto"),
                ('"Quiero reservar para este fin de semana"', "reservación"),
            ],
            "smart_examples": [
                ('"Me encanta el vino"', "puede hablar de catas, viñedo, variedades"),
                ('"Es nuestro aniversario"', "puede hablar de paquetes románticos, spa, cena"),
                ('"Busco un lugar tranquilo"', "puede hablar del entorno, campo, naturaleza"),
                ('"Me gusta la buena comida"', "puede hablar del restaurante, menú, chef"),
                ('"¿Puedo llevar a mis hijos?"', "actividades familiares, áreas infantiles"),
                ('"Me interesa vivir en viñedos"', "lotes residenciales, comunidad"),
                ('"Quiero desconectarme de la ciudad"', "estilo de vida, retiro, paz"),
                ('"¿Hacen bodas?"', "eventos, bodas, capacidad"),
            ],
        },

        # ─────────────────── RESIDENCIAL CAMPO ───────────────────
        "residencial_campo": {
            "desc": "un desarrollo residencial campestre con viñedos y amenidades ecuestres en México",
            "inquiry_topics": (
                "lotes, terrenos, viñedos, nogales, amenidades, polo, club ecuestre, "
                "hotel boutique, precios, disponibilidad, financiamiento, "
                "estilo de vida campestre, ubicación"
            ),
            "examples_0": [
                ('"¿Qué tamaño de lotes tienen?"', "terrenos disponibles"),
                ('"¿Tienen campo de polo?"', "amenidades"),
                ('"¿Puedo plantar mi propio viñedo?"', "estilo de vida"),
                ('"¿Cómo es el club ecuestre?"', "amenidades"),
            ],
            "examples_1": [
                ('"Luis Torres luis@email.com 8181234567"', "datos de contacto"),
                ('"Quiero conocer el desarrollo"', "visita"),
            ],
            "smart_examples": [
                ('"Me encantan los caballos"', "puede hablar del club ecuestre, polo"),
                ('"Me gusta el vino"', "puede hablar de viñedos, producción propia"),
                ('"Busco tranquilidad"', "estilo de vida campestre, naturaleza"),
                ('"Quiero un lugar para fines de semana"', "terrenos, casa de campo"),
                ('"Tengo una familia grande"', "lotes amplios, comunidad"),
                ('"Me gusta el aire libre"', "actividades, senderos, campo"),
                ('"¿Está lejos de la ciudad?"', "ubicación, accesos, distancia"),
                ('"Me interesa como inversión"', "plusvalía, desarrollo, crecimiento"),
            ],
        },

        # ─────────────────── HOTELES ───────────────────
        "hoteles": {
            "desc": "un hotel de lujo en México",
            "inquiry_topics": (
                "habitaciones, suites, villas, tarifas, disponibilidad, "
                "spa, restaurantes, actividades, eventos, bodas, "
                "paquetes, todo incluido, ubicación"
            ),
            "examples_0": [
                ('"¿Qué tipos de habitaciones tienen?"', "opciones de hospedaje"),
                ('"¿Cuánto cuesta por noche?"', "tarifas"),
                ('"¿Tienen spa?"', "servicios"),
                ('"¿Qué restaurantes tienen?"', "gastronomía"),
            ],
            "examples_1": [
                ('"Sofia Herrera sofia@email.com 9981234567"', "datos de contacto"),
                ('"Quiero reservar para diciembre"', "reservación"),
            ],
            "smart_examples": [
                ('"Es nuestro aniversario"', "puede hablar de paquetes románticos, spa"),
                ('"Viajo con niños"', "puede hablar de actividades infantiles, kids club"),
                ('"Me gusta bucear"', "actividades acuáticas, excursiones"),
                ('"Quiero una boda en la playa"', "eventos, bodas, capacidad"),
                ('"Busco relajarme"', "spa, masajes, yoga, bienestar"),
                ('"¿Tienen alberca?"', "amenidades, infinity pool"),
                ('"Quiero algo exclusivo"', "villas privadas, suites premium"),
                ('"¿Aceptan mascotas?"', "políticas, pet-friendly"),
            ],
        },

        # ─────────────────── OFICINAS ───────────────────
        "oficinas": {
            "desc": "un edificio de oficinas corporativas en México",
            "inquiry_topics": (
                "espacios de oficina, metrajes, precios de renta, venta, "
                "configuraciones, estacionamiento, servicios, ubicación, "
                "accesos, salas de juntas, seguridad"
            ),
            "examples_0": [
                ('"¿Qué metrajes tienen disponibles?"', "espacios"),
                ('"¿Cuánto cuesta la renta?"', "precios"),
                ('"¿Tienen estacionamiento?"', "servicios"),
                ('"¿Están cerca del metro?"', "ubicación"),
            ],
            "examples_1": [
                ('"Carlos Mendoza carlos@empresa.com 5551234567"', "datos de contacto"),
                ('"Quiero agendar un recorrido"', "visita"),
            ],
            "smart_examples": [
                ('"Somos un equipo de 20 personas"', "puede hablar de metrajes, configuraciones"),
                ('"Necesitamos sala de juntas"', "servicios, amenidades corporativas"),
                ('"¿Hay buenos restaurantes cerca?"', "zona, alrededores, estilo de vida"),
                ('"Buscamos imagen corporativa"', "diseño, categoría del edificio"),
                ('"¿Tienen fibra óptica?"', "infraestructura, tecnología"),
                ('"Mi equipo usa bicicleta"', "ciclopuerto, accesos, zona"),
                ('"Necesitamos espacio flexible"', "configuraciones, coworking"),
                ('"¿Se puede estacionar fácilmente?"', "estacionamiento, accesos"),
            ],
        },

        # ─────────────────── CENTROS COMERCIALES ───────────────────
        "centros_comerciales": {
            "desc": "un centro comercial con locales en renta y venta en México",
            "inquiry_topics": (
                "locales comerciales, metrajes, precios de renta, venta, "
                "ubicación, afluencia, estacionamiento, servicios, "
                "giro permitido, horarios"
            ),
            "examples_0": [
                ('"¿Qué locales tienen disponibles?"', "espacios comerciales"),
                ('"¿Cuánto cuesta la renta de un local?"', "precios"),
                ('"¿Cuántas personas pasan al día?"', "afluencia"),
                ('"¿Qué giros están permitidos?"', "regulaciones"),
            ],
            "examples_1": [
                ('"Laura Vega laura@negocio.com 5551234567"', "datos de contacto"),
                ('"Quiero conocer los locales"', "visita"),
            ],
            "smart_examples": [
                ('"Tengo un restaurante"', "puede hablar de locales para restaurante, zona food court"),
                ('"Quiero abrir una tienda de ropa"', "locales disponibles, metrajes, zona"),
                ('"¿Hay mucho tráfico de gente?"', "afluencia, ubicación estratégica"),
                ('"Busco buena ubicación para mi negocio"', "ventajas del centro comercial"),
                ('"¿Tienen local en planta baja?"', "ubicaciones dentro del centro"),
                ('"¿Hay estacionamiento para clientes?"', "estacionamiento, accesos"),
                ('"¿Qué otras tiendas hay?"', "mezcla comercial, anclas"),
                ('"¿Está en crecimiento la zona?"', "plusvalía, ubicación, proyección"),
            ],
        },

        # ─────────────────── INDUSTRIAL ───────────────────
        "industrial": {
            "desc": "un parque industrial con naves y espacios logísticos en México",
            "inquiry_topics": (
                "naves industriales, bodegas, terrenos, metrajes, especificaciones técnicas, "
                "precios de renta, venta, infraestructura, logística, "
                "ubicación, accesos carreteros, servicios"
            ),
            "examples_0": [
                ('"¿Qué metrajes de naves tienen?"', "espacios disponibles"),
                ('"¿Cuánto cuesta la renta por m²?"', "precios"),
                ('"¿Tienen acceso a carretera federal?"', "logística"),
                ('"¿Qué especificaciones tiene la nave?"', "specs técnicos"),
            ],
            "examples_1": [
                ('"Ing. Martínez martinez@empresa.com 4771234567"', "datos de contacto"),
                ('"Quiero una visita al parque"', "cita"),
            ],
            "smart_examples": [
                ('"Manejamos productos refrigerados"', "puede hablar de infraestructura, clima controlado"),
                ('"Necesitamos muelle de carga"', "especificaciones de nave, andenes"),
                ('"¿Hay transporte público para trabajadores?"', "ubicación, accesos"),
                ('"Somos una empresa de logística"', "ubicación estratégica, conectividad"),
                ('"¿Tienen vigilancia 24/7?"', "seguridad, servicios del parque"),
                ('"Necesitamos espacio de oficina también"', "naves con oficina, configuraciones"),
                ('"¿Se puede ampliar después?"', "terrenos, escalabilidad"),
                ('"¿Qué empresas están ahí?"', "clúster industrial, vecinos"),
            ],
        },

        # ─────────────────── TERRENOS ───────────────────
        "terrenos": {
            "desc": "un desarrollo con lotes y terrenos en venta en México",
            "inquiry_topics": (
                "lotes, terrenos, superficies, precios, disponibilidad, "
                "uso de suelo, infraestructura, servicios, "
                "financiamiento, ubicación, master plan"
            ),
            "examples_0": [
                ('"¿Qué tamaños de lotes tienen?"', "superficies"),
                ('"¿Cuánto cuestan?"', "precios"),
                ('"¿Qué uso de suelo tienen?"', "regulaciones"),
                ('"¿Ya tienen servicios?"', "infraestructura"),
            ],
            "examples_1": [
                ('"Pedro Salazar pedro@email.com 6121234567"', "datos de contacto"),
                ('"Quiero conocer el terreno"', "visita"),
            ],
            "smart_examples": [
                ('"Quiero construir mi casa"', "puede hablar de lotes residenciales, proyecto"),
                ('"Me gusta la naturaleza"', "entorno, áreas verdes, vistas"),
                ('"Busco algo para invertir"', "plusvalía, crecimiento, urbanización"),
                ('"¿Está urbanizado?"', "servicios, infraestructura actual"),
                ('"¿Hay playa cerca?"', "ubicación, entorno, distancias"),
                ('"Quiero un terreno grande"', "opciones de lotes, superficies"),
                ('"¿Puedo construir un negocio?"', "uso de suelo, regulaciones"),
                ('"¿Hay financiamiento?"', "planes de pago, crédito"),
            ],
        },
    }

    # Fallback
    t = templates.get(category, templates["departamentos"])

    # ── Build the instruction string ──
    # Base classification
    inst = (
        f'<p>Eres un clasificador de intenciones multilingüe para personas interesadas en '
        f'<strong>{project_name}</strong>, {t["desc"]}. '
        f'Tu trabajo es entender qué necesita el usuario y enviarlo al agente correcto.</p>'
        f''
        f'<p><strong>Categorías:</strong></p>'
        f'<ol start="0">'
        f'<li><strong>Consulta general</strong> — Cualquier pregunta que se pueda relacionar con el proyecto: '
        f'{t["inquiry_topics"]}. Funciona en cualquier idioma.</li>'
        f'<li><strong>Contacto o cita</strong> — Cuando el usuario comparte datos personales '
        f'(nombre, email, teléfono) o pide agendar visita/llamada.</li>'
    )

    # Add off-topic category
    inst += (
        f'<li><strong>Fuera de tema</strong> — SOLO cuando la pregunta es IMPOSIBLE de relacionar '
        f'con {project_name}: tareas escolares, código de programación, ecuaciones matemáticas, '
        f'recetas paso a paso, traducción de textos, biografías históricas, poesía creativa.</li>'
        f'</ol>'
    )

    # Examples for categories 0 and 1
    inst += '<p><strong>Ejemplos de clasificación:</strong></p><ul>'
    for ex, desc in t["examples_0"]:
        inst += f'<li>{ex} → 0 ({desc})</li>'
    for ex, desc in t["examples_1"]:
        inst += f'<li>{ex} → 1 ({desc})</li>'
    inst += '</ul>'

    # Smart routing section
    inst += (
        f'<p><strong>🧠 ROUTING INTELIGENTE:</strong></p>'
        f'<p>Recuerda: el usuario YA está hablando con el asistente de <strong>{project_name}</strong>. '
        f'Si alguien menciona un interés, gusto o necesidad personal, el agente del proyecto es lo '
        f'suficientemente inteligente para conectarlo con {project_name}. '
        f'Tu trabajo es darle la oportunidad de hacerlo.</p>'
        f'<p><strong>💡 Estos SÍ son del proyecto (→ 0):</strong></p><ul>'
    )
    for ex, reason in t["smart_examples"]:
        inst += f'<li>{ex} → 0 — {reason}</li>'
    inst += '</ul>'

    # Off-topic section
    inst += (
        f'<p><strong>🚫 Estos SÍ son fuera de tema (→ {offtopic_idx}):</strong></p><ul>'
        f'<li>"Resuelve 2x+3=7" → {offtopic_idx}</li>'
        f'<li>"Escríbeme código en Python" → {offtopic_idx}</li>'
        f'<li>"Dame la receta del pastel de chocolate" → {offtopic_idx}</li>'
        f'<li>"Ayúdame con mi tarea de historia" → {offtopic_idx}</li>'
        f'<li>"Cuéntame la biografía de Einstein" → {offtopic_idx}</li>'
        f'<li>"Escríbeme un poema de amor" → {offtopic_idx}</li>'
        f'<li>"Traduce este texto al japonés" → {offtopic_idx}</li>'
        f'<li>"¿Cuánto es la raíz cuadrada de 144?" → {offtopic_idx}</li>'
        f'</ul>'
    )

    # Golden rule
    inst += (
        f'<p><strong>⚡ REGLA DE ORO:</strong> Si tienes duda, SIEMPRE envía a una categoría del proyecto (0). '
        f'El agente de {project_name} sabe cómo conectar cualquier tema de estilo de vida con el proyecto. '
        f'Solo envía a {offtopic_idx} si es algo ACADÉMICO, TÉCNICO o claramente una solicitud de '
        f'conocimiento que no tiene nada que ver con bienes raíces ni con el estilo de vida del proyecto.</p>'
    )

    # Multilingual note
    inst += (
        f'<p><strong>🌍 Nota:</strong> Clasifica por intención, no por idioma. '
        f'Si el usuario escribe en inglés, francés o cualquier idioma, clasifica igual. '
        f'El sistema maneja las respuestas multilingües automáticamente.</p>'
    )

    return inst


def find_offtopic_scenario_idx(scenarios):
    for i, s in enumerate(scenarios):
        sc = s.get("scenario", "").lower()
        if "completely unrelated" in sc or "off-topic" in sc or "impossible to relate" in sc:
            return i
    return None


def main():
    print("=" * 70)
    print("🎨 WARM & PERSONALIZED Instructions v3")
    print("=" * 70)

    resp = requests.get(f"{FLOWISE_URL}/api/v1/chatflows", headers=HEADERS, timeout=30)
    if resp.status_code != 200:
        print(f"❌ Failed: {resp.status_code}")
        sys.exit(1)

    agentflows = [cf for cf in resp.json() if cf.get("type") == "AGENTFLOW"]
    print(f"   {len(agentflows)} AGENTFLOW chatflows")

    results = {"fixed": [], "skipped": [], "failed": []}

    for i, cf in enumerate(agentflows):
        cf_id = cf["id"]
        cf_name = cf.get("name", "Unknown")
        print(f"\n{'─' * 60}")
        print(f"[{i+1}/{len(agentflows)}] {cf_name}")

        if cf_id in SKIP_IDS:
            results["skipped"].append((cf_name, "Skip list"))
            print(f"   ⏭️  SKIP")
            continue

        try:
            detail = requests.get(
                f"{FLOWISE_URL}/api/v1/chatflows/{cf_id}",
                headers=HEADERS, timeout=30
            )
            if detail.status_code != 200:
                results["failed"].append((cf_name, f"HTTP {detail.status_code}"))
                continue
            flow_data = json.loads(detail.json()["flowData"])
        except Exception as e:
            results["failed"].append((cf_name, str(e)))
            continue

        cond_node = None
        for node in flow_data["nodes"]:
            if node["data"]["name"] == "conditionAgentAgentflow":
                cond_node = node
                break

        if not cond_node:
            results["skipped"].append((cf_name, "No condition agent"))
            print(f"   ⏭️  SKIP: No condition agent")
            continue

        scenarios = cond_node["data"]["inputs"]["conditionAgentScenarios"]
        ot_idx = find_offtopic_scenario_idx(scenarios)
        if ot_idx is None:
            results["skipped"].append((cf_name, "No off-topic scenario"))
            print(f"   ⏭️  SKIP: No off-topic scenario")
            continue

        category = get_category(cf_name)
        print(f"   📂 Category: {category}, off-topic idx: {ot_idx}")

        # Build new instructions
        new_inst = build_instructions(cf_name, category, ot_idx)
        old_inst = cond_node["data"]["inputs"]["conditionAgentInstructions"]
        cond_node["data"]["inputs"]["conditionAgentInstructions"] = new_inst
        print(f"   📝 Instructions: {len(old_inst)} → {len(new_inst)} chars")

        # Push
        payload = {"flowData": json.dumps(flow_data, ensure_ascii=False)}
        push = requests.put(
            f"{FLOWISE_URL}/api/v1/chatflows/{cf_id}",
            headers=HEADERS, json=payload, timeout=30
        )
        if push.status_code == 200:
            print(f"   ✅ Pushed!")
            results["fixed"].append((cf_name, category))
        else:
            print(f"   ❌ Push failed: {push.status_code}")
            results["failed"].append((cf_name, f"Push {push.status_code}"))

        time.sleep(0.3)

    print("\n" + "=" * 70)
    print(f"📊 FIXED: {len(results['fixed'])} | SKIPPED: {len(results['skipped'])} | FAILED: {len(results['failed'])}")
    print("=" * 70)
    for n, c in results["fixed"]:
        print(f"   ✓ {n} [{c}]")
    if results["failed"]:
        print("\n❌ FAILED:")
        for n, r in results["failed"]:
            print(f"   ✗ {n}: {r}")


if __name__ == "__main__":
    main()
