"""
nizuc_perf_test.py — QA del agente NIZUC con prompt de eficiencia.

Crea una copia QA del agentflow cd55ce82 ("NIZUC QA perf"), aplica dos reglas
de uso de info_get (saludos sin tool / no re-bajar si ya esta en contexto),
corre una bateria A/B contra produccion y reporta latencias y respuestas.

Uso:
    python scripts/nizuc_perf_test.py crear     # crea QA + bateria A/B
    python scripts/nizuc_perf_test.py bateria   # solo bateria (QA existente)
    python scripts/nizuc_perf_test.py borrar    # elimina la copia QA
"""
import json
import sys
import time
import uuid
from pathlib import Path

import requests

REPO = Path(__file__).parent.parent
PROD_ID = 'cd55ce82-5916-4117-aa3a-98ebd5d0c890'
QA_NAME = 'NIZUC QA perf'

REGLA_EFICIENCIA = (
    '<p><strong>EFFICIENCY RULES - TOOL USAGE:</strong></p>'
    '<ul>'
    '<li><p><strong>Greetings, farewells, thanks, and simple courtesies</strong> '
    '(hi, hello, hola, buenas, gracias, thank you, bye, ok, goodbye, or equivalent in ANY language): '
    'respond warmly and briefly WITHOUT calling info_get. No document information is needed for these.</p></li>'
    '<li><p><strong>If the needed information is ALREADY in this conversation</strong> '
    '(from a previous info_get result above), answer from it and DO NOT call info_get again.</p></li>'
    '<li><p>Only call info_get when the user asks something that requires Nizuc information '
    'that is not already present in the conversation.</p></li>'
    '</ul>'
)


def load_api_key():
    for line in (REPO / '.env').read_text(encoding='utf-8').splitlines():
        if line.startswith('FLOWISE_API_KEY='):
            return line.split('=', 1)[1].strip()
    raise SystemExit('No se encontro FLOWISE_API_KEY')


def headers(key):
    return {'Authorization': f'Bearer {key}', 'Accept': 'application/json', 'Content-Type': 'application/json'}


def get_flow(base, key, flow_id):
    r = requests.get(f'{base}/api/v1/chatflows/{flow_id}', headers=headers(key), timeout=45)
    r.raise_for_status()
    return r.json()


def find_qa(base, key):
    r = requests.get(f'{base}/api/v1/chatflows', headers=headers(key), timeout=45)
    r.raise_for_status()
    for f in r.json():
        if f.get('name') == QA_NAME:
            return f['id']
    return None


def crear_qa(base, key):
    qa_id = find_qa(base, key)
    if qa_id:
        print(f'QA ya existe: {qa_id}')
        return qa_id
    prod = get_flow(base, key, PROD_ID)
    flow_data = json.loads(prod['flowData'])
    qa_node = next(n for n in flow_data['nodes'] if 'Q&A' in (n.get('data') or {}).get('label', ''))
    mensajes = qa_node['data']['inputs']['agentMessages']
    ya_tiene = 'EFFICIENCY RULES' in mensajes[0]['content']
    if not ya_tiene:
        mensajes[0]['content'] = mensajes[0]['content'] + REGLA_EFICIENCIA
    payload = {
        'name': QA_NAME,
        'flowData': json.dumps({'nodes': flow_data['nodes'], 'edges': flow_data['edges'],
                                'viewport': flow_data.get('viewport', {'x': 0, 'y': 0, 'zoom': 1})},
                               ensure_ascii=False),
        'deployed': False,
        'isPublic': False,
        'type': prod.get('type', 'AGENTFLOW'),
        'category': prod.get('category'),
    }
    r = requests.post(f'{base}/api/v1/chatflows', headers=headers(key),
                      data=json.dumps(payload, ensure_ascii=False).encode('utf-8'), timeout=60)
    r.raise_for_status()
    qa_id = r.json().get('id') or r.json().get('chatflowid') or r.json().get('data', {}).get('id')
    print(f'QA creado: {qa_id}')
    return qa_id


def borrar_qa(base, key):
    qa_id = find_qa(base, key)
    if not qa_id:
        print('no hay QA que borrar')
        return
    r = requests.delete(f'{base}/api/v1/chatflows/{qa_id}', headers=headers(key), timeout=45)
    print('borrado' if r.ok else f'error {r.status_code}: {r.text[:120]}')


BATERIA = [
    # (tipo, pregunta, misma_sesion_que_anterior)
    ('saludo', 'hola', False),
    ('saludo', 'good morning!', False),
    ('saludo', 'gracias por todo', False),
    ('factual', 'A que hora abre el gimnasio?', False),
    ('factual', 'Tienen alberca solo para adultos?', False),
    ('factual', 'How do I get from the airport to the resort?', False),
    ('factual', 'Que restaurantes tienen y que tipo de comida?', False),
    ('followup', 'y el spa a que hora abre?', True),
    ('followup', 'y cuanto cuesta un masaje?', True),
]


def preguntar(base, key, flow_id, sid, q):
    t0 = time.time()
    r = requests.post(f'{base}/api/v1/prediction/{flow_id}', headers=headers(key),
                      json={'question': q, 'overrideConfig': {'sessionId': sid}}, timeout=120)
    dt = time.time() - t0
    if r.status_code != 200:
        return dt, f'HTTP {r.status_code}: {r.text[:100]}'
    return dt, r.json().get('text', '')[:150].replace('\n', ' ')


def bateria(base, key):
    qa_id = find_qa(base, key)
    if not qa_id:
        raise SystemExit('No existe la copia QA; corre "crear" primero')
    corrida = uuid.uuid4().hex[:6]
    print(f'{"tipo":9s} {"prod":>6s} {"QA":>6s}  pregunta / respuestas')
    for i, (tipo, q, same) in enumerate(BATERIA):
        sid = f'qa-{corrida}-{i:02d}' if not same else f'qa-{corrida}-{i-1:02d}'
        dp, rp = preguntar(base, key, PROD_ID, sid if same else f'{sid}-p', q)
        dq, rq = preguntar(base, key, qa_id, sid if same else f'{sid}-q', q)
        print(f'{tipo:9s} {dp:5.1f}s {dq:5.1f}s  {q}')
        print(f'{"":9s} {"":6s} {"":6s}   PROD: {rp[:110]}')
        print(f'{"":9s} {"":6s} {"":6s}   QA  : {rq[:110]}')
        time.sleep(1)


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in ('crear', 'bateria', 'borrar'):
        print(__doc__)
        return
    base = 'https://ecoflow.koppi.mx'
    key = load_api_key()
    cmd = sys.argv[1]
    if cmd == 'crear':
        crear_qa(base, key)
        bateria(base, key)
    elif cmd == 'bateria':
        bateria(base, key)
    else:
        borrar_qa(base, key)


if __name__ == '__main__':
    main()
