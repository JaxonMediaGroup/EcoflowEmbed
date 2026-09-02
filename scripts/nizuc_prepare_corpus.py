"""
nizuc_prepare_corpus.py — Fase 1 del replay de NIZUC.

Limpia y consolida las preguntas historicas del flow viejo (dfcd62a3)
en un corpus deduplicado y etiquetado por tema, listo para el replay
contra el flow nuevo (cd55ce82).

Entrada:  scripts/nizuc_replay/preguntas_raw.json  (Fase 0)
Salida:   scripts/nizuc_replay/corpus.json

Uso:
    python scripts/nizuc_prepare_corpus.py
"""
import json
import re
import unicodedata
from collections import Counter
from pathlib import Path

BASE = Path(__file__).parent / "nizuc_replay"
RAW = BASE / "preguntas_raw.json"
OUT = BASE / "corpus.json"

# Mensajes que no son preguntas: saludos, despedidas, acks (match de mensaje completo)
RUIDO_EXACTO = {
    "hola", "hola!", "hola.", "holaa", "buenas", "buenas!", "buenas tardes",
    "buenas noches", "buenos dias", "buenos dias!", "hey", "hi", "hi!", "hello",
    "good morning", "good evening", "good afternoon", "gracias", "gracias!",
    "muchas gracias", "thank you", "thanks", "ok", "okay", "okey", "vale",
    "perfecto", "genial", "adios", "bye", "goodbye", "si", "no", "saludos",
    "hi there", "hey there", "ok gracias", "hola gracias", "gracias por todo",
    "buen dia", "buenas tardes!", "que tal", "qué tal",
}

# Etiquetado por tema: (tema, palabras clave normalizadas). El primer match gana.
TEMAS = [
    ("GYM", ["gym", "gimnasio", "fitness", "salle de sport", "pesas", "entrenamiento", "entrenar", "workout"]),
    ("SPA", ["spa", "masaje", "massage", "sauna", "tratamiento", "facial", "belleza", "beauty", "espa ", "nails", "manicura", "hydrotherapy", "circuito"]),
    ("RESTAURANTES", ["restaurante", "restaurant", "comida", "menu", "food", "cena", "dinner", "desayuno", "breakfast", "lunch", "brunch", "kosher", "halal", "tequila", "chef", "cocina", "kitchen", "pizzeria", "sushi", "roof top", "rooftop", "bar ", " bar", "wine", "vino", "drink", "bebida", "room service"]),
    ("PRECIOS", ["precio", "price", "cost", "cuanto cuesta", "cuanto vale", "tarifa", "rate", "caro", "expensive", "costo", "noche cuesta", "per night"]),
    ("RESERVAS", ["reserv", "booking", "book ", "appointment", "agendar", "cancelar la"]),
    ("MASCOTAS", ["mascota", "pet", "perro", "dog", "gato", "cat", "animal"]),
    ("FAMILIA", ["nino", "kid", "child", "famil", "babysitting", "nanny", "cuna", "crib", "bebe", "baby", "adolescent", "menor de edad", "teenager"]),
    ("TRANSPORTE", ["aeropuerto", "airport", "transport", "shuttle", "taxi", "uber", "rentar", "rental", "pick up", "pickup", "traslado", "carro", "coche"]),
    ("PLAYAS_PISCINAS", ["playa", "beach", "pool", "alberca", "piscina", "cabana", "camastro", "sunbed"]),
    ("ACTIVIDADES", ["actividad", "tour", "excursion", "snorkel", "kayak", "paddle", "buceo", "diving", "pesca", "fishing", "yacht", "barco", "boat", "bike", "tennis", "tenis", "golf", "clase", "class", "yoga", "entretenimiento", "entertainment", "musica en vivo", "live music"]),
    ("ALOJAMIENTO", ["habitacion", "room", "suite", "villa", "alojamiento", "estancia", "hospedar", "noche", "night", "check in", "checkin", "check out", "checkout", "residence", "lopen", "amenidades", "amenities", "instalaciones", "facilities"]),
    ("UBICACION", ["ubicac", "donde queda", "donde esta", "location", "direccion", "address", "how far", "lejos", "cerca", "como llegar", "directions", "zona hotelera", "cancun"]),
    ("CONTACTO", ["telefono", "phone", "correo", "email", "contacto", "whatsapp", "llamar", "extension", "concierge", "numero"]),
]


def normalizar(texto):
    """Texto para clave de dedupe: NFKC, sin acentos, minusculas, espacios colapsados."""
    t = unicodedata.normalize("NFKC", texto or "")
    t = "".join(c for c in unicodedata.normalize("NFD", t) if unicodedata.category(c) != "Mn")
    return re.sub(r"\s+", " ", t).strip().lower()


def limpiar_texto(texto):
    """Texto representativo: sin espacios multiples ni caracteres de control."""
    t = re.sub(r"[^\S\n]+", " ", texto or "")
    t = re.sub(r"\s*\n\s*", " ", t)
    return t.strip()


def es_ruido(clave):
    if clave in RUIDO_EXACTO:
        return True
    # solo emojis / puntuacion / numeros
    if re.fullmatch(r"[\W\d_]*", clave) or len(clave) < 2:
        return True
    return False


def tema_de(clave):
    for tema, keywords in TEMAS:
        for kw in keywords:
            if kw in clave:
                return tema
    return "OTROS"


def main():
    with open(RAW, encoding="utf-8") as f:
        raw = json.load(f)

    clusters = {}
    for item in raw:
        texto = limpiar_texto(item["content"])
        if not texto:
            continue
        clave = normalizar(texto)
        if not clave:
            continue
        c = clusters.setdefault(clave, {
            "pregunta": texto,
            "veces": 0,
            "primera": item["created"],
            "ultima": item["created"],
            "sesiones": set(),
        })
        c["veces"] += 1
        c["sesiones"].add(item["session"])
        c["primera"] = min(c["primera"], item["created"])
        c["ultima"] = max(c["ultima"], item["created"])

    corpus = []
    for clave, c in sorted(clusters.items(), key=lambda kv: kv[1]["primera"]):
        bucket = "ruido" if es_ruido(clave) else "pregunta"
        corpus.append({
            "id": len(corpus) + 1,
            "pregunta": c["pregunta"],
            "bucket": bucket,
            "tema": tema_de(clave),
            "veces": c["veces"],
            "sesiones": len(c["sesiones"]),
            "primera": c["primera"][:10],
            "ultima": c["ultima"][:10],
        })

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(corpus, f, ensure_ascii=False, indent=1)

    preguntas = [c for c in corpus if c["bucket"] == "pregunta"]
    ruido = [c for c in corpus if c["bucket"] == "ruido"]
    print(f"mensajes originales : {len(raw)}")
    print(f"clusters unicos     : {len(corpus)}")
    print(f"  preguntas         : {len(preguntas)}")
    print(f"  ruido (saludos etc): {len(ruido)}")
    print("\npreguntas por tema:")
    for tema, n in Counter(c["tema"] for c in preguntas).most_common():
        print(f"  {tema:18} {n}")


if __name__ == "__main__":
    main()
