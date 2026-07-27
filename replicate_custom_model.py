#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Replica la config del Condition Agent (chatOpenAICustom) a TODOS los agentes
de ambos chatflows TEST.

Cambios por agente:
- agentModel/conditionAgentModel: chatOpenAI -> chatOpenAICustom
- agentToolsBuiltInOpenAI: se vacía (chatOpenAICustom no soporta web_search)
- agentModelConfig/conditionAgentModelConfig:
    * agentModel/conditionAgentModel -> chatOpenAICustom
    * Se elimina FLOWISE_CREDENTIAL_ID (custom no la usa)
    * reasoning y allowImageUploads se preservan
- modelName gpt-5.6-luna y reasoning low se mantienen
"""
import os
import json, io, os, sys
import requests

CONFIG = json.load(io.open("projects.json", encoding="utf-8"))
API_KEY = os.environ.get("FLOWISE_API_KEY", os.environ["FLOWISE_API_KEY"])
URL = CONFIG.get("flowise_url", "https://ecoflow.koppi.mx")
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

TARGETS = [
    ("TEST - We Work General", "projects/TEST - We Work General Agents.json", "93d1191d-349a-4510-b8aa-59eb56d225d7"),
    ("TEST - We Work Santa Fe", "projects/TEST - We Work Santa Fe Agents.json", "1fe4826e-e182-4cb8-89da-de6fe9c0a896"),
]

for label, fpath, cid in TARGETS:
    print(f"\n{'='*70}")
    print(f"{label}")
    print(f"{'='*70}")

    d = json.load(io.open(fpath, encoding="utf-8"))
    changed = 0
    for node in d["nodes"]:
        ins = node.get("data", {}).get("inputs", {})
        if not isinstance(ins, dict):
            continue
        lbl = node["data"]["label"]
        # ¿Es un agente conversacional (agentAgentflow)?
        is_agent = "agentModel" in ins
        # ¿Es condition agent?
        is_cond = "conditionAgentModel" in ins

        if is_agent:
            # Cambiar tipo de modelo
            old = ins.get("agentModel")
            ins["agentModel"] = "chatOpenAICustom"
            # Vaciar web_search (chatOpenAICustom no lo soporta)
            if ins.get("agentToolsBuiltInOpenAI"):
                ins["agentToolsBuiltInOpenAI"] = ""
            # Model config
            cfg = ins.get("agentModelConfig", {})
            if cfg:
                cfg["agentModel"] = "chatOpenAICustom"
                cfg.pop("FLOWISE_CREDENTIAL_ID", None)
                # mantener modelName, reasoning, allowImageUploads, temperature, streaming
            changed += 1
            print(f"  {lbl[:42]:<44} {old} -> chatOpenAICustom")

        elif is_cond:
            # El condition agent YA usa chatOpenAICustom; asegurar consistencia
            old = ins.get("conditionAgentModel")
            ins["conditionAgentModel"] = "chatOpenAICustom"
            cfg = ins.get("conditionAgentModelConfig", {})
            if cfg:
                cfg["conditionAgentModel"] = "chatOpenAICustom"
                cfg.pop("FLOWISE_CREDENTIAL_ID", None)
            changed += 1
            print(f"  {lbl[:42]:<44} {old} -> chatOpenAICustom (ya estaba)")

    json.dump(d, io.open(fpath, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"  {changed} agentes actualizados")

    # PUSH preservando STT/TTS
    r = requests.get(f"{URL}/api/v1/chatflows/{cid}", headers=HEADERS, timeout=30)
    cur = r.json()
    body = {"flowData": json.dumps(d, ensure_ascii=False)}
    for k in ("speechToText", "textToSpeech", "category", "type", "name"):
        if cur.get(k):
            body[k] = cur[k]
    r2 = requests.put(f"{URL}/api/v1/chatflows/{cid}", headers=HEADERS, json=body, timeout=90)
    print(f"  Push: {'✅' if r2.status_code==200 else '❌ '+str(r2.status_code)+' '+r2.text[:200]}")
