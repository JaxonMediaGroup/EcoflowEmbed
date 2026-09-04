#!/usr/bin/env python3
"""
flowise-kb-sync — sincronizacion automatica del Google Doc de NIZUC al
store de conocimiento "NIZUC KB" (faiss + text-embedding-3-small).

Corre por systemd timer (cada 15 min). Compara el hash del documento:
si no cambio, no hace nada; si cambio, re-chunkea y re-embebe el store,
y el agente queda actualizado en la siguiente pregunta.

Configuracion en /etc/flowise-kb-sync.env (chmod 600):
    FLOWISE_URL=https://ecoflow.koppi.mx
    FLOWISE_API_KEY=...

Estado en /var/lib/flowise-kb-sync/last_hash
Log: journalctl -u flowise-kb-sync
"""
import hashlib
import json
import os
import sys
import urllib.request
from pathlib import Path

STORE_NAME = 'NIZUC KB'
GDOC_URL = ('https://docs.google.com/document/d/1PSvg-_gwZue30e60QS8Zh2C_w-rAIw_vQcYZkDArDvg'
            '/export?format=txt')
CREDENTIAL_ID = '10ca0bac-6033-4f4f-aff2-d5c35aef4580'
STATE = Path('/var/lib/flowise-kb-sync/last_hash')

LOADER_BODY = {
    'loaderId': 'apiLoader',
    'loaderConfig': {
        'textSplitter': '', 'method': 'GET', 'url': GDOC_URL, 'headers': '',
        'caFile': '', 'body': '', 'metadata': '', 'omitMetadataKeys': '',
    },
    'splitterId': 'tokenTextSplitter',
    'splitterConfig': {'encodingName': 'gpt2', 'chunkSize': '1200', 'chunkOverlap': '200'},
}

UPSERT_BODY = {
    'embeddingName': 'openAIEmbeddings',
    'embeddingConfig': {'modelName': 'text-embedding-3-small', 'credentialId': CREDENTIAL_ID},
    'vectorStoreName': 'faiss',
    'vectorStoreConfig': {'basePath': '/root/.flowise/nizuc_kb_faiss', 'topK': '10'},
    'isStrictSave': True,
}


def load_env():
    for linea in Path('/etc/flowise-kb-sync.env').read_text().splitlines():
        if '=' in linea and not linea.startswith('#'):
            k, v = linea.split('=', 1)
            os.environ.setdefault(k.strip(), v.strip())


def http(metodo, url, headers=None, body=None, timeout=300):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=metodo,
                                 headers={'Accept': 'application/json',
                                          'Content-Type': 'application/json', **(headers or {})})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        texto = r.read().decode('utf-8', errors='replace')
        return json.loads(texto) if texto.strip().startswith(('{', '[')) else {}


def main():
    load_env()
    base = os.environ['FLOWISE_URL'].rstrip('/')
    auth = {'Authorization': f"Bearer {os.environ['FLOWISE_API_KEY']}"}

    # 1) hash del documento actual
    with urllib.request.urlopen(GDOC_URL, timeout=60) as r:
        contenido = r.read()
    nuevo_hash = hashlib.sha256(contenido).hexdigest()
    anterior = STATE.read_text().strip() if STATE.exists() else ''
    if nuevo_hash == anterior:
        print('sin cambios en el documento; nada que hacer')
        return

    # 2) localizar el loader del store con chunks
    stores = http('GET', f'{base}/api/v1/document-store/store', headers=auth)
    store = next((s for s in stores if s.get('name') == STORE_NAME), None)
    if not store:
        print(f'error: no existe el store {STORE_NAME}', file=sys.stderr)
        sys.exit(1)
    detalle = http('GET', f"{base}/api/v1/document-store/store/{store['id']}", headers=auth)
    loader = next((l for l in detalle.get('loaders', []) if l.get('totalChunks')), None)
    if not loader:
        print('error: el store no tiene loader con chunks', file=sys.stderr)
        sys.exit(1)

    # 3) re-chunks + re-embed
    http('POST', f"{base}/api/v1/document-store/loader/process/{loader['id']}",
         headers=auth, body={'storeId': store['id'], **LOADER_BODY})
    http('POST', f'{base}/api/v1/document-store/vectorstore/insert',
         headers=auth, body={'storeId': store['id'], **UPSERT_BODY}, timeout=600)

    # 4) guardar estado solo si todo fue bien
    STATE.parent.mkdir(parents=True, exist_ok=True)
    STATE.write_text(nuevo_hash)
    ver = http('GET', f"{base}/api/v1/document-store/store/{store['id']}", headers=auth)
    print(f"sync OK: {ver.get('totalChunks')} chunks, {ver.get('totalChars')} chars "
          f"(hash {nuevo_hash[:12]}...)")


if __name__ == '__main__':
    main()
