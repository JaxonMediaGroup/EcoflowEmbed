"""
nizuc_kb_agent.py — Fase 2: agente NIZUC con Knowledge retrieval (QA v2).

Crea la copia "NIZUC QA perf v2" con agentKnowledgeDocumentStores (store
NIZUC KB, faiss + text-embedding-3-small) en lugar del tool requestsGet,
ajusta el prompt y corre una bateria multiidioma vs produccion (incluye
cambio repentino de idioma en la misma conversacion).

Uso:
    python scripts/nizuc_kb_agent.py crear    # QA v2 + bateria
    python scripts/nizuc_kb_agent.py bateria  # solo bateria
    python scripts/nizuc_kb_agent.py borrar   # elimina la copia QA v2
"""
import json
import sys
import time
import uuid
from pathlib import Path

import requests

sys.path.insert(0, str(Path(__file__).parent))
from nizuc_perf_test import PROD_ID, headers, load_api_key

REPO = Path(__file__).parent.parent
BASE = 'https://ecoflow.koppi.mx'
QA_NAME = 'NIZUC QA perf v2'
STORE_ID = '6880b93b-7489-4e89-bd06-aa0f33cdbea4'

DESCRIPCION_KB = (
    'Official NIZUC Resort & Spa knowledge: contact directory and emails, opening hours '
    '(gym, spa, pools, restaurants), restaurants and menus, dietary options (kosher, vegan), '
    'activities and tours, accommodations and suites, policies (pets, kids club, dress code), '
    'transportation and location. Search this for ANY factual question about Nizuc.'
)

REEMPLAZOS_PROMPT = [
    ('Your PRIMARY information source is the info_get tool.',
     'Your PRIMARY information source is the NIZUC KNOWLEDGE provided in your context.'),
    ('<strong>Always use this FIRST to get official Nizuc  information from the Google document. This is your primary information source.</strong>',
     ''),
    ('(hi, hello, hola, buenas, gracias, thank you, bye, ok, goodbye, or equivalent in ANY language): '
     'respond warmly and briefly WITHOUT calling info_get. No document information is needed for these.',
     '(hi, hello, hola, buenas, gracias, thank you, bye, ok, goodbye, or equivalent in ANY language): '
     'respond warmly and briefly WITHOUT searching the knowledge. No information is needed for these.'),
    ('Only call info_get when the user asks something that requires Nizuc information '
     'that is not already present in the conversation.',
     'Search the knowledge when the user asks something that requires Nizuc information '
     'that is not already present in the conversation.'),
    ('Tu ÚNICA fuente de información verificada son las herramientas oficiales configuradas para Nizuc (info_get y similares).',
     'Tu ÚNICA fuente de información verificada es la base de conocimiento oficial de Nizuc provista en el contexto.'),
    ('info_get y similares', 'la base de conocimiento oficial'),
]

# (tipo, pregunta, misma_sesion_que_anterior)
BATERIA_MULTI = [
    ('ES', 'A que hora abre el gimnasio?', False),
    ('EN', 'How do I get from the airport to the resort?', False),
    ('PT', 'Voces tem piscina só para adultos?', False),
    ('FR', 'Quels restaurants avez-vous et quel type de cuisine?', False),
    ('ES', 'Aceptan mascotas en el resort?', False),
    ('EN', 'Is there a kids club and what ages is it for?', False),
    ('ES-swap', 'Y el spa, a que hora abre?', True),        # cambio repentino EN->ES en misma sesion
    ('PT-swap', 'E quanto custa o day use?', True),        # cambio ES->PT en misma sesion
    ('corte', 'gracias por todo!', True),
]


def find_qa(key):
    r = requests.get(f'{BASE}/api/v1/chatflows', headers=headers(key), timeout=45)
    r.raise_for_status()
    for f in r.json():
        if f.get('name') == QA_NAME:
            return f['id']
    return None


def crear(key):
    qa_id = find_qa(key)
    if qa_id:
        print(f'QA v2 ya existe: {qa_id}')
        return qa_id
    prod = requests.get(f'{BASE}/api/v1/chatflows/{PROD_ID}', headers=headers(key), timeout=45).json()
    fd = json.loads(prod['flowData'])
    qa = next(n for n in fd['nodes'] if 'Q&A' in (n.get('data') or {}).get('label', ''))
    inputs = qa['data']['inputs']

    inputs['agentTools'] = []  # fuera requestsGet: el knowledge reemplaza al tool
    inputs['agentKnowledgeDocumentStores'] = [{
        'documentStore': f'{STORE_ID}:NIZUC KB',
        'docStoreDescription': DESCRIPCION_KB,
        'returnSourceDocuments': False,
    }]
    for viejo, nuevo in REEMPLAZOS_PROMPT:
        for m in inputs['agentMessages']:
            m['content'] = m['content'].replace(viejo, nuevo)

    payload = {
        'name': QA_NAME,
        'flowData': json.dumps({'nodes': fd['nodes'], 'edges': fd['edges'],
                                'viewport': fd.get('viewport', {'x': 0, 'y': 0, 'zoom': 1})},
                               ensure_ascii=False),
        'deployed': False,
        'isPublic': False,
        'type': prod.get('type', 'AGENTFLOW'),
        'category': prod.get('category'),
    }
    r = requests.post(f'{BASE}/api/v1/chatflows', headers=headers(key),
                      data=json.dumps(payload, ensure_ascii=False).encode('utf-8'), timeout=60)
    r.raise_for_status()
    qa_id = r.json().get('id') or r.json().get('data', {}).get('id')
    print(f'QA v2 creado: {qa_id}')
    return qa_id


def borrar(key):
    qa_id = find_qa(key)
    if not qa_id:
        print('no hay QA v2 que borrar')
        return
    r = requests.delete(f'{BASE}/api/v1/chatflows/{qa_id}', headers=headers(key), timeout=45)
    print('borrado' if r.ok else f'HTTP {r.status_code}')


def preguntar(key, flow_id, sid, q):
    t0 = time.time()
    r = requests.post(f'{BASE}/api/v1/prediction/{flow_id}', headers=headers(key),
                      json={'question': q, 'overrideConfig': {'sessionId': sid}}, timeout=120)
    dt = time.time() - t0
    if r.status_code != 200:
        return dt, f'HTTP {r.status_code}: {r.text[:90]}'
    return dt, r.json().get('text', '')[:170].replace('\n', ' ')


def bateria(key):
    qa_id = find_qa(key)
    if not qa_id:
        raise SystemExit('no existe QA v2; corre "crear" primero')
    corrida = uuid.uuid4().hex[:6]
    print(f'{"tipo":9s} {"prod":>6s} {"QA2":>6s}  pregunta')
    for i, (tipo, q, same) in enumerate(BATERIA_MULTI):
        sid = f'kb-{corrida}-{i:02d}' if not same else f'kb-{corrida}-{i-1:02d}'
        dp, rp = preguntar(key, PROD_ID, f'{sid}-p', q)
        dq, rq = preguntar(key, qa_id, f'{sid}-q', q)
        print(f'{tipo:9s} {dp:5.1f}s {dq:5.1f}s  {q}')
        print(f'{"":9s} {"":6s} {"":6s}   PROD: {rp[:120]}')
        print(f'{"":9s} {"":6s} {"":6s}   QA2 : {rq[:120]}')
        time.sleep(1)


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in ('crear', 'bateria', 'borrar'):
        print(__doc__)
        return
    key = load_api_key()
    {'crear': lambda: (crear(key), bateria(key)), 'bateria': lambda: bateria(key),
     'borrar': lambda: borrar(key)}[sys.argv[1]]()


if __name__ == '__main__':
    main()
