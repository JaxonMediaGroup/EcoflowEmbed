"""
DRY-RUN: Analyze all agent files to understand their structure before making changes.
This script does NOT modify any files - it only reports what it finds.
"""
import json
import os

FOLDER = r"c:\Users\Guillermo\Downloads\Chatbots"

def analyze_file(filepath):
    filename = os.path.basename(filepath)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    nodes = data.get("nodes", [])
    agents = []
    
    for node in nodes:
        nd = node.get("data", {})
        if nd.get("type") != "Agent":
            continue
        
        label = nd.get("label", "?")
        inputs = nd.get("inputs", {})
        messages = inputs.get("agentMessages", [])
        tools = inputs.get("agentTools", [])
        
        # Find tool type
        tool_names = []
        for t in tools:
            if isinstance(t, dict):
                sel = t.get("agentSelectedTool", "")
                cfg = t.get("agentSelectedToolConfig", {})
                name = cfg.get("requestsGetName", "") or cfg.get("customToolName", "") or sel
                tool_names.append(name)
        
        # Check system prompt
        sys_content = ""
        for msg in messages:
            if msg.get("role") == "system":
                sys_content = msg.get("content", "")
                break
        
        has_forbidden = "STRICTLY FORBIDDEN PHRASES" in sys_content
        has_nunca = "NUNCA menciones" in sys_content
        has_info_get = "info_get" in sys_content or "Informacion_General" in sys_content
        has_requestsGet = any("requestsGet" in str(t) for t in tools)
        mentions_document = any(w in sys_content.lower() for w in ["document", "documento", "documento oficial"])
        has_ol = "<ol>" in sys_content
        prompt_len = len(sys_content)
        
        # Find where we could safely insert (after first </li> that mentions info_get)
        import re
        insertion_point = None
        # Look for first <li> containing info_get
        match = re.search(r'info_get[^<]*</p></li>', sys_content)
        if match:
            insertion_point = f"after 'info_get...{sys_content[match.start():match.start()+40]}...'"
        else:
            match = re.search(r'Informacion_General[^<]*</p></li>', sys_content)
            if match:
                insertion_point = f"after 'Informacion_General...'"
            else:
                match = re.search(r'info_get[^<]*</li>', sys_content)
                if match:
                    insertion_point = f"after 'info_get (no </p>)'"
        
        agents.append({
            "label": label,
            "tools": tool_names,
            "has_forbidden": has_forbidden,
            "has_nunca": has_nunca,
            "has_info_get": has_info_get,
            "has_requestsGet": has_requestsGet,
            "mentions_document": mentions_document,
            "has_ol": has_ol,
            "prompt_len": prompt_len,
            "insertion_point": insertion_point,
            "is_qa": has_info_get or has_requestsGet,
        })
    
    return filename, agents


def main():
    files = sorted([f for f in os.listdir(FOLDER) if f.endswith('.json') and 'update' not in f])
    
    print(f"{'='*100}")
    print(f"DRY-RUN ANALYSIS: {len(files)} files")
    print(f"{'='*100}\n")
    
    already_ok = []
    needs_update = []
    no_qa = []
    cant_insert = []
    
    for filename in files:
        filepath = os.path.join(FOLDER, filename)
        try:
            fname, agents = analyze_file(filepath)
            
            qa_agents = [a for a in agents if a["is_qa"]]
            
            if not qa_agents:
                no_qa.append(fname)
                print(f"  NO Q&A AGENT: {fname}")
                continue
            
            for a in qa_agents:
                status = ""
                if a["has_forbidden"] or a["has_nunca"]:
                    already_ok.append(fname)
                    status = "ALREADY HAS RULE"
                elif a["insertion_point"]:
                    needs_update.append(fname)
                    status = "NEEDS UPDATE"
                else:
                    cant_insert.append(fname)
                    status = "NO INSERTION POINT FOUND"
                
                print(f"  [{status}] {fname}")
                print(f"    Agent: {a['label']}")
                print(f"    Tools: {a['tools']}")
                print(f"    Prompt length: {a['prompt_len']} chars")
                print(f"    Has <ol>: {a['has_ol']}")
                print(f"    Mentions 'document': {a['mentions_document']}")
                print(f"    Insertion point: {a['insertion_point']}")
                print()
                
        except Exception as e:
            print(f"  ERROR: {fname} — {e}\n")
    
    print(f"\n{'='*100}")
    print(f"SUMMARY:")
    print(f"  Already has rule: {len(already_ok)} files")
    print(f"  Needs update (insertion point found): {len(needs_update)} files")
    print(f"  No Q&A agent found: {len(no_qa)} files") 
    print(f"  No safe insertion point: {len(cant_insert)} files")
    print(f"{'='*100}")
    
    if cant_insert:
        print(f"\nFILES NEEDING MANUAL REVIEW:")
        for f in cant_insert:
            print(f"  - {f}")
    
    if needs_update:
        print(f"\nFILES THAT WOULD BE UPDATED:")
        for f in needs_update:
            print(f"  - {f}")


if __name__ == "__main__":
    main()
