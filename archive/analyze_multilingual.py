"""
Analyze multilingual instructions across all agent files.
Checks if agents have proper language-detection/response rules.
"""
import json
import os
import re

FOLDER = r"c:\Users\Guillermo\Downloads\Chatbots"

MULTILINGUAL_PATTERNS = [
    r"respond in the user'?s (query )?language",
    r"respond in the same language",
    r"responde en el (mismo )?idioma",
    r"detect(s|ar)? the (user'?s )?language",
    r"detecta el idioma",
    r"reply in the language",
    r"answer in the language",
    r"Respuesta en ese mismo idioma",
    r"always respond in the language",
    r"multilingual",
    r"idioma del usuario",
    r"user'?s language",
    r"match(es)? the language",
    r"same language as the (user|query|question)",
]

def check_file(filepath):
    filename = os.path.basename(filepath)
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    results = []
    for node in data.get("nodes", []):
        nd = node.get("data", {})
        if nd.get("type") != "Agent":
            continue
        
        label = nd.get("label", "?")
        label_lower = label.lower()
        
        # Skip non-Q&A
        if any(w in label_lower for w in ["sales", "lead", "ventas", "condition", "availability"]):
            continue
        
        msgs = nd.get("inputs", {}).get("agentMessages", [])
        sys_content = ""
        for m in msgs:
            if m.get("role") == "system":
                sys_content = m.get("content", "")
                break
        
        if not sys_content:
            continue
        
        # Check for multilingual instructions
        found_patterns = []
        for pat in MULTILINGUAL_PATTERNS:
            match = re.search(pat, sys_content, re.IGNORECASE)
            if match:
                found_patterns.append(match.group())
        
        # Check prompt language
        # Simple heuristic: count Spanish vs English indicator words
        es_words = len(re.findall(r'\b(eres|siempre|responde|cuando|usuario|herramienta|ejecuta|información|pregunta|usa|nunca|debes)\b', sys_content, re.IGNORECASE))
        en_words = len(re.findall(r'\b(you are|always|respond|when|user|tool|execute|information|question|use|never|must|should)\b', sys_content, re.IGNORECASE))
        
        prompt_lang = "SPANISH" if es_words > en_words else "ENGLISH" if en_words > es_words else "MIXED"
        
        # Extract the actual multilingual instruction (context around it)
        lang_instruction = ""
        for pat in [r'[^.]*(?:language|idioma)[^.]*\.', r'[^<]*(?:language|idioma)[^<]*']:
            match = re.search(pat, sys_content, re.IGNORECASE)
            if match:
                lang_instruction = match.group().strip()[:150]
                break
        
        has_multilingual = len(found_patterns) > 0
        
        results.append({
            "file": filename,
            "agent": label,
            "prompt_lang": prompt_lang,
            "has_multilingual": has_multilingual,
            "patterns_found": found_patterns,
            "lang_instruction": lang_instruction,
            "prompt_len": len(sys_content),
            "es_words": es_words,
            "en_words": en_words,
        })
    
    return results


def main():
    files = sorted([f for f in os.listdir(FOLDER) if f.endswith('.json') and not f.endswith('.bak')])
    files = [f for f in files if 'update_prompts' not in f and 'analyze' not in f and 'safe_update' not in f]
    
    all_results = []
    for f in files:
        try:
            results = check_file(os.path.join(FOLDER, f))
            all_results.extend(results)
        except Exception as e:
            print(f"ERROR: {f} — {e}")
    
    # Separate into groups
    no_multilingual = [r for r in all_results if not r["has_multilingual"]]
    has_multilingual = [r for r in all_results if r["has_multilingual"]]
    
    print(f"{'='*100}")
    print(f"MULTILINGUAL ANALYSIS: {len(all_results)} Q&A agents across {len(files)} files")
    print(f"{'='*100}\n")
    
    print(f"⚠️  AGENTS WITHOUT MULTILINGUAL INSTRUCTIONS ({len(no_multilingual)}):")
    print(f"{'─'*100}")
    for r in no_multilingual:
        print(f"  ❌ {r['file']}")
        print(f"     Agent: {r['agent']}")
        print(f"     Prompt language: {r['prompt_lang']} (ES:{r['es_words']} EN:{r['en_words']})")
        print(f"     Prompt length: {r['prompt_len']} chars")
        if r['lang_instruction']:
            print(f"     Closest lang mention: \"{r['lang_instruction'][:100]}\"")
        print()
    
    print(f"\n✅ AGENTS WITH MULTILINGUAL INSTRUCTIONS ({len(has_multilingual)}):")
    print(f"{'─'*100}")
    for r in has_multilingual:
        print(f"  ✅ {r['file']}")
        print(f"     Agent: {r['agent']}")
        print(f"     Prompt language: {r['prompt_lang']}")
        print(f"     Rules found: {r['patterns_found']}")
        print()


if __name__ == "__main__":
    main()
