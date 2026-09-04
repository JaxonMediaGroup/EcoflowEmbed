"""
nizuc_kb_setup.py — Fase 2 del agente NIZUC: knowledge store con retrieval.

Crea el store "NIZUC KB" (API loader al Google Doc, chunks de 1200 tokens),
hace upsert con embeddings + SimpleStore persistente y valida la recuperación
con preguntas multiidioma. No toca el store "Nizuc" viejo (flow viejo).

Uso:
    python scripts/nizuc_kb_setup.py crear   # store + loader + upsert + validacion
    python scripts/nizuc_kb_setup.py probar  # solo validacion multiidioma
    python scripts/nizuc_kb_setup.py sync    # tras editar el Google Doc: re-chunks + re-embed
    python scripts/nizuc_kb_setup.py borrar  # elimina el store NIZUC KB
"""
import json
import sys
from pathlib import Path

import requests

REPO = Path(__file__).parent.parent
STORE_NAME = 'NIZUC KB'
GDOC_URL = ('https://docs.google.com/document/d/1PSvg-_gwZue30e60QS8Zh2C_w-rAIw_vQcYZkDArDvg'
            '/export?format=txt')
CREDENTIAL = '10ca0bac-6033-4f4f-aff2-d5c35aef4580'
BASE = 'https://ecoflow.koppi.mx'

LOADER_BODY = {
    'loaderId': 'apiLoader',
    'loaderConfig': {
        'textSplitter': '', 'method': 'GET', 'url': GDOC_URL, 'headers': '',
        'caFile': '', 'body': '', 'metadata': '', 'omitMetadataKeys': '',
    },
    'splitterId': 'tokenTextSplitter',
    'splitterConfig': {'encodingName': 'gpt2', 'chunkSize': '1200', 'chunkOverlap': '200'},
}

PRUEBAS_MULTIIDIOMA = [
    ('ES', 'a que hora abre el gimnasio'),
    ('ES', 'tienen alberca solo para adultos'),
    ('EN', 'how do I get from the airport to the resort'),
    ('EN', 'do you have kosher menu options'),
    ('PT', 'qual o horario do spa'),
    ('FR', 'quels restaurants avez-vous'),
    ('ES', 'aceptan mascotas'),
    ('EN', 'is there a kids club and what ages'),
]


def load_api_key():
    for line in (REPO / '.env').read_text(encoding='utf-8').splitlines():
        if line.startswith('FLOWISE_API_KEY='):
            return line.split('=', 1)[1].strip()
    raise SystemExit('No se encontro FLOWISE_API_KEY')


def headers(key, json_body=True):
    h = {'Authorization': f'Bearer {key}', 'Accept': 'application/json'}
    if json_body:
        h['Content-Type'] = 'application/json'
    return h


def find_store(key):
    r = requests.get(f'{BASE}/api/v1/document-store/store', headers=headers(key), timeout=45)
    r.raise_for_status()
    for s in r.json():
        if s.get('name') == STORE_NAME:
            return s['id']
    return None


def crear(key):
    viejo = find_store(key)
    if viejo:
        print(f'store ya existe: {viejo} (usandolo)')
        store_id = viejo
    else:
        r = requests.post(f'{BASE}/api/v1/document-store/store', headers=headers(key),
                          json={'name': STORE_NAME, 'description': 'KB del agente NIZUC (Google Doc, retrieval)'}, timeout=45)
        r.raise_for_status()
        store_id = r.json()['id']
        print(f'store creado: {store_id}')

    print('guardando loader...')
    r = requests.post(f'{BASE}/api/v1/document-store/loader/save', headers=headers(key),
                      json={'storeId': store_id, **LOADER_BODY}, timeout=90)
    if not r.ok:
        raise SystemExit(f'loader/save HTTP {r.status_code}: {r.text[:300]}')
    loader = r.json()
    loader_id = loader.get('id') or (loader.get('loaders') or [{}])[0].get('id')
    print(f'loader: {loader_id}')

    print('procesando loader (fetch gdoc + chunks)...')
    r = requests.post(f'{BASE}/api/v1/document-store/loader/process/{loader_id}',
                      headers=headers(key), json={'storeId': store_id, **LOADER_BODY}, timeout=300)
    if not r.ok:
        raise SystemExit(f'loader/process HTTP {r.status_code}: {r.text[:300]}')
    proc = r.json()
    if isinstance(proc, dict):
        print('chunks:', proc.get('totalChunks'), '| chars:', proc.get('totalChars'))

    for modelo in ('text-embedding-3-small', 'text-embedding-ada-002'):
        print(f'upsert con embeddings {modelo}...')
        body = {
            'storeId': store_id,
            'embeddingName': 'openAIEmbeddings',
            'embeddingConfig': {'modelName': modelo, 'credentialId': CREDENTIAL},
            'vectorStoreName': 'simpleStoreLlamaIndex',
            'vectorStoreConfig': {},
            'isStrictSave': True,
        }
        r = requests.post(f'{BASE}/api/v1/document-store/vectorstore/insert', headers=headers(key),
                          json=body, timeout=600)
        if r.ok:
            print(f'upsert OK con {modelo}')
            break
        print(f'  fallo {modelo}: HTTP {r.status_code} {r.text[:200]}')
    else:
        raise SystemExit('ningun modelo de embeddings funciono')

    ver = requests.get(f'{BASE}/api/v1/document-store/store/{store_id}', headers=headers(key), timeout=45).json()
    print(f"status del store: {ver.get('status')} | chunks: {ver.get('totalChunks')} | chars: {ver.get('totalChars')}")
    return store_id


def probar(key):
    store_id = find_store(key)
    if not store_id:
        raise SystemExit('no existe el store; corre "crear" primero')
    for idioma, q in PRUEBAS_MULTIIDIOMA:
        r = requests.post(f'{BASE}/api/v1/document-store/vectorstore/query', headers=headers(key),
                          json={'storeId': store_id, 'query': q, 'k': 4}, timeout=120)
        if not r.ok:
            print(f'[{idioma}] HTTP {r.status_code}: {r.text[:150]}')
            continue
        data = r.json()
        docs = data.get('docs') or []
        print(f'[{idioma}] {q}  ({data.get("timeTaken", "?")} ms)')
        for d in docs[:2]:
            texto = (d.get('pageContent') or '')[:110].replace('\n', ' ').replace('\r', ' ')
            print(f'   - {texto}')


def borrar(key):
    store_id = find_store(key)
    if not store_id:
        print('no hay store que borrar')
        return
    r = requests.delete(f'{BASE}/api/v1/document-store/store/{store_id}', headers=headers(key), timeout=45)
    print('borrado' if r.ok else f'HTTP {r.status_code}: {r.text[:150]}')


UPSERT = {
    'embeddingName': 'openAIEmbeddings',
    'embeddingConfig': {'modelName': 'text-embedding-3-small', 'credentialId': CREDENTIAL},
    'vectorStoreName': 'faiss',
    'vectorStoreConfig': {'basePath': '/root/.flowise/nizuc_kb_faiss', 'topK': '10'},
}


def sync(key):
    """Re-procesa el Google Doc y re-embebe el store tras editar el documento."""
    store_id = find_store(key)
    if not store_id:
        raise SystemExit('no existe el store; corre "crear" primero')
    s = requests.get(f'{BASE}/api/v1/document-store/store/{store_id}', headers=headers(key), timeout=45).json()
    loader = next((l for l in s.get('loaders', []) if l.get('totalChunks')), None)
    if not loader:
        raise SystemExit('no hay loader con chunks; corre "crear" primero')
    print(f're-procesando loader {loader["id"][:8]} (fetch gdoc + chunks)...')
    r = requests.post(f'{BASE}/api/v1/document-store/loader/process/{loader["id"]}',
                      headers=headers(key), json={'storeId': store_id, **LOADER_BODY}, timeout=300)
    if not r.ok:
        raise SystemExit(f'loader/process HTTP {r.status_code}: {r.text[:200]}')
    print('re-embebiendo (faiss + text-embedding-3-small)...')
    r = requests.post(f'{BASE}/api/v1/document-store/vectorstore/insert', headers=headers(key),
                      json={'storeId': store_id, **UPSERT, 'isStrictSave': True}, timeout=600)
    if not r.ok:
        raise SystemExit(f'vectorstore/insert HTTP {r.status_code}: {r.text[:200]}')
    print('sync OK — el agente ya responde con el contenido actualizado')
    ver = requests.get(f'{BASE}/api/v1/document-store/store/{store_id}', headers=headers(key), timeout=45).json()
    print(f"status: {ver.get('status')} | chunks: {ver.get('totalChunks')} | chars: {ver.get('totalChars')}")


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in ('crear', 'probar', 'sync', 'borrar'):
        print(__doc__)
        return
    key = load_api_key()
    {'crear': crear, 'probar': probar, 'sync': lambda k: sync(k), 'borrar': borrar}[sys.argv[1]](key)


if __name__ == '__main__':
    main()
