"""
nizuc_publish_prompt.py — publica en produccion el prompt de eficiencia del
agente NIZUC (cd55ce82) validado en QA (scripts/nizuc_perf_test.py).

Hace backup del flowData vivo en projects/NIZUC Agents.backup-*.json,
agrega la seccion EFFICIENCY RULES al system prompt del nodo Q&A y publica
con PUT siguiendo las convenciones de admin_service.py.

Uso:
    python scripts/nizuc_publish_prompt.py publicar   # backup + publish + verificacion
    python scripts/nizuc_publish_prompt.py revertir   # restaura el ultimo backup
"""
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import requests

sys.path.insert(0, str(Path(__file__).parent))
from nizuc_perf_test import PROD_ID, REGLA_EFICIENCIA, get_flow, headers, load_api_key, REPO

BASE = 'https://ecoflow.koppi.mx'


def backup_path():
    return REPO / 'projects' / f'NIZUC Agents.backup-{datetime.now(timezone.utc):%Y%m%d-%H%M}.json'


def publicar():
    key = load_api_key()
    prod = get_flow(BASE, key, PROD_ID)
    flow_data = json.loads(prod['flowData'])

    destino = backup_path()
    destino.write_text(json.dumps(flow_data, ensure_ascii=False, indent=1), encoding='utf-8')
    print(f'backup: {destino.name}')

    qa_node = next(n for n in flow_data['nodes'] if 'Q&A' in (n.get('data') or {}).get('label', ''))
    mensajes = qa_node['data']['inputs']['agentMessages']
    if 'EFFICIENCY RULES' in mensajes[0]['content']:
        print('el prompt ya contiene la regla; nada que publicar')
        return
    mensajes[0]['content'] += REGLA_EFICIENCIA

    payload = {
        'name': prod.get('name', 'NIZUC'),
        'flowData': json.dumps({'nodes': flow_data['nodes'], 'edges': flow_data['edges'],
                                'viewport': flow_data.get('viewport', {'x': 0, 'y': 0, 'zoom': 1})},
                               ensure_ascii=False),
        'deployed': prod.get('deployed', True),
        'isPublic': prod.get('isPublic'),
        'apikeyid': prod.get('apikeyid'),
        'chatbotConfig': prod.get('chatbotConfig'),
        'apiConfig': prod.get('apiConfig'),
        'analytic': prod.get('analytic'),
        'speechToText': prod.get('speechToText'),
        'category': prod.get('category'),
        'type': prod.get('type', 'AGENTFLOW'),
    }
    r = requests.put(f'{BASE}/api/v1/chatflows/{PROD_ID}', headers=headers(key),
                     data=json.dumps(payload, ensure_ascii=False).encode('utf-8'), timeout=60)
    r.raise_for_status()
    print('publicado OK')

    ver = get_flow(BASE, key, PROD_ID)
    ok = 'EFFICIENCY RULES' in json.loads(ver['flowData'])['nodes'][
        next(i for i, n in enumerate(json.loads(ver['flowData'])['nodes'])
             if 'Q&A' in (n.get('data') or {}).get('label', ''))
    ]['data']['inputs']['agentMessages'][0]['content']
    print('verificacion de prompt en vivo:', 'OK' if ok else 'FALLO')


def revertir():
    key = load_api_key()
    backups = sorted(REPO.glob('projects/NIZUC Agents.backup-*.json'))
    if not backups:
        raise SystemExit('no hay backups')
    destino = backups[-1]
    flow_data = json.loads(destino.read_text(encoding='utf-8'))
    prod = get_flow(BASE, key, PROD_ID)
    payload = {
        'name': prod.get('name', 'NIZUC'),
        'flowData': json.dumps({'nodes': flow_data['nodes'], 'edges': flow_data['edges'],
                                'viewport': flow_data.get('viewport', {'x': 0, 'y': 0, 'zoom': 1})},
                               ensure_ascii=False),
        'deployed': prod.get('deployed', True),
        'isPublic': prod.get('isPublic'),
        'apikeyid': prod.get('apikeyid'),
        'chatbotConfig': prod.get('chatbotConfig'),
        'apiConfig': prod.get('apiConfig'),
        'analytic': prod.get('analytic'),
        'speechToText': prod.get('speechToText'),
        'category': prod.get('category'),
        'type': prod.get('type', 'AGENTFLOW'),
    }
    r = requests.put(f'{BASE}/api/v1/chatflows/{PROD_ID}', headers=headers(key),
                     data=json.dumps(payload, ensure_ascii=False).encode('utf-8'), timeout=60)
    r.raise_for_status()
    print(f'revertido desde {destino.name}')


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in ('publicar', 'revertir'):
        print(__doc__)
        return
    if sys.argv[1] == 'publicar':
        publicar()
    else:
        revertir()


if __name__ == '__main__':
    main()
