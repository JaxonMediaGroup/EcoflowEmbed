"""
nizuc_kb_publish.py — publica en produccion el agente NIZUC fase 2 (v3):
Knowledge del store NIZUC KB (faiss + text-embedding-3-small) en vez del
tool requestsGet, y router (condition agent) en gpt-5.4.

Validado en QA: piso 2.5s (-37%), factuales ~5s (-22%), calidad identica,
multiidioma y cambio repentino de idioma verificados (ES/EN/PT/FR).

Uso:
    python scripts/nizuc_kb_publish.py publicar
    python scripts/nizuc_kb_publish.py revertir
"""
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import requests

sys.path.insert(0, str(Path(__file__).parent))
from nizuc_kb_agent import DESCRIPCION_KB, REEMPLAZOS_PROMPT, STORE_ID
from nizuc_perf_test import PROD_ID, headers, load_api_key, REPO

BASE = 'https://ecoflow.koppi.mx'


def backup_path():
    return REPO / 'projects' / f'NIZUC Agents.backup-{datetime.now(timezone.utc):%Y%m%d-%H%M}.json'


def transformar(fd):
    qa = next(n for n in fd['nodes'] if 'Q&A' in (n.get('data') or {}).get('label', ''))
    inputs = qa['data']['inputs']
    inputs['agentTools'] = []
    inputs['agentKnowledgeDocumentStores'] = [{
        'documentStore': f'{STORE_ID}:NIZUC KB',
        'docStoreDescription': DESCRIPCION_KB,
        'returnSourceDocuments': False,
    }]
    for viejo, nuevo in REEMPLAZOS_PROMPT:
        for m in inputs['agentMessages']:
            m['content'] = m['content'].replace(viejo, nuevo)
    router = next(n for n in fd['nodes'] if (n.get('data') or {}).get('name') == 'conditionAgentAgentflow')
    cfg = router['data']['inputs']['conditionAgentModelConfig']
    cfg['modelName'] = 'gpt-5.4'
    cfg['reasoning'] = ''
    return fd


def put_flow(key, prod, fd):
    payload = {
        'name': prod.get('name', 'NIZUC'),
        'flowData': json.dumps({'nodes': fd['nodes'], 'edges': fd['edges'],
                                'viewport': fd.get('viewport', {'x': 0, 'y': 0, 'zoom': 1})},
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


def publicar():
    key = load_api_key()
    prod = requests.get(f'{BASE}/api/v1/chatflows/{PROD_ID}', headers=headers(key), timeout=45).json()
    fd = json.loads(prod['flowData'])

    destino = backup_path()
    destino.write_text(json.dumps(fd, ensure_ascii=False, indent=1), encoding='utf-8')
    print(f'backup: {destino.name}')

    fd = transformar(fd)
    put_flow(key, prod, fd)
    print('publicado OK')

    ver = json.loads(requests.get(f'{BASE}/api/v1/chatflows/{PROD_ID}', headers=headers(key), timeout=45).json()['flowData'])
    qa = next(n for n in ver['nodes'] if 'Q&A' in (n.get('data') or {}).get('label', ''))
    router = next(n for n in ver['nodes'] if (n.get('data') or {}).get('name') == 'conditionAgentAgentflow')
    checks = {
        'knowledge configurado': bool(qa['data']['inputs'].get('agentKnowledgeDocumentStores')),
        'sin requestsGet': not qa['data']['inputs'].get('agentTools'),
        'router gpt-5.4': router['data']['inputs']['conditionAgentModelConfig'].get('modelName') == 'gpt-5.4',
        'prompt ajustado': 'NIZUC KNOWLEDGE' in qa['data']['inputs']['agentMessages'][0]['content'],
    }
    for k, v in checks.items():
        print(f'  {k}: {"OK" if v else "FALLO"}')
    if not all(checks.values()):
        raise SystemExit('verificacion fallo — usar revertir')


def revertir():
    key = load_api_key()
    backups = sorted(REPO.glob('projects/NIZUC Agents.backup-*.json'))
    if not backups:
        raise SystemExit('no hay backups')
    destino = backups[-1]
    fd = json.loads(destino.read_text(encoding='utf-8'))
    prod = requests.get(f'{BASE}/api/v1/chatflows/{PROD_ID}', headers=headers(key), timeout=45).json()
    put_flow(key, prod, fd)
    print(f'revertido desde {destino.name}')


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'revertir':
        revertir()
    else:
        publicar()
