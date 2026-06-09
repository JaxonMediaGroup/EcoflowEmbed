"""
Add multilingual instruction to the 9 agents that are missing it.
Append-only approach — does not modify existing prompt text.
"""
import json
import os
import shutil
import sys

FOLDER = r"c:\Users\Guillermo\Downloads\Chatbots"

TARGET_FILES = [
    "Los Nogales Agents.json",
    "Mahi Residencial Agents.json",
    "Mozaiko Lindavista Agents.json",
    "Torre Alhena Agents.json",
    "Punta Zero Agents.json",
    "Terralago Agents.json",
    "Terraza Coapa Agents.json",
    "Torre Zero Centro de Neogcios Agents.json",
    "Torre Zero Providencia Agents.json",
]

MULTILINGUAL_RULE = (
    '<p><strong>🌐 MULTILINGUAL RULE:</strong></p>'
    '<ul>'
    '<li><p>Detect the user\'s language from their message.</p></li>'
    '<li><p>ALWAYS respond in the SAME LANGUAGE as the user\'s query.</p></li>'
    '<li><p>If the user writes in French, respond in French. If in Portuguese, respond in Portuguese. And so on for any language.</p></li>'
    '</ul>'
)

ALREADY_HAS = [
    "MULTILINGUAL RULE",
    "respond in the user's query language",
    "respond in the SAME LANGUAGE",
    "Detect the user's language",
    "Respuesta en ese mismo idioma",
]

def main():
    dry_run = "--apply" not in sys.argv
    mode = "DRY-RUN" if dry_run else "APPLYING"
    
    print(f"\n{'='*70}")
    print(f"  MODE: {mode} — Multilingual fix for {len(TARGET_FILES)} files")
    print(f"{'='*70}\n")
    
    updated = 0
    for filename in TARGET_FILES:
        filepath = os.path.join(FOLDER, filename)
        if not os.path.exists(filepath):
            print(f"  NOT FOUND: {filename}")
            continue
        
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        changed = False
        for node in data.get("nodes", []):
            nd = node.get("data", {})
            if nd.get("type") != "Agent":
                continue
            label = nd.get("label", "").lower()
            if any(w in label for w in ["sales", "lead", "condition", "availability"]):
                continue
            
            msgs = nd.get("inputs", {}).get("agentMessages", [])
            for msg in msgs:
                if msg.get("role") != "system":
                    continue
                content = msg.get("content", "")
                if any(m in content for m in ALREADY_HAS):
                    print(f"  SKIP: {filename} (already has multilingual)")
                    continue
                
                if not dry_run:
                    msg["content"] = content + MULTILINGUAL_RULE
                changed = True
                print(f"  {'WOULD UPDATE' if dry_run else 'UPDATED'}: {filename} → {nd.get('label','?')}")
        
        if changed and not dry_run:
            bak = filepath + ".bak"
            if not os.path.exists(bak):
                shutil.copy2(filepath, bak)
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            json.load(open(filepath, 'r', encoding='utf-8'))  # validate
            updated += 1
    
    print(f"\n  {'Would update' if dry_run else 'Updated'}: {updated if not dry_run else 'see above'}")
    if dry_run:
        print(f"  Run with --apply to execute.\n")

if __name__ == "__main__":
    main()
