"""
SAFE UPDATE SCRIPT — Append-only approach.
Adds the FORBIDDEN PHRASES rule to the END of each agent's system prompt.
Does NOT modify any existing prompt text — only appends a new HTML block.

Features:
- Creates .bak backups before modifying
- Skips files that already have the rule
- Skips ConditionAgent nodes (not relevant)
- Two modes: --dry-run (default) and --apply
- Validates JSON integrity after writing
"""
import json
import os
import sys
import shutil

FOLDER = r"c:\Users\Guillermo\Downloads\Chatbots"

FORBIDDEN_RULE = (
    '<p><strong>⛔ STRICTLY FORBIDDEN PHRASES (ALL LANGUAGES):</strong></p>'
    '<ul>'
    '<li><p>NEVER use phrases like: "según el documento", "el documento menciona", '
    '"de acuerdo con el documento", "no se menciona en el documento", '
    '"no viene en el documento", "el documento no incluye", '
    '"according to the document", "the document states", '
    '"based on the provided document", "not mentioned in the document".</p></li>'
    '<li><p>NEVER reveal you are consulting a document, file, or external data source.</p></li>'
    '<li><p>Instead, respond naturally as if you have personal expert knowledge of the project. '
    'Example: Instead of "Según el documento, el precio es..." say "El precio es..."</p></li>'
    '</ul>'
)

ALREADY_HAS_MARKERS = [
    "STRICTLY FORBIDDEN PHRASES",
    "FRASES ESTRICTAMENTE PROHIBIDAS",
    "NUNCA menciones que consultaste",
    "NUNCA uses frases como",
]


def process_file(filepath, dry_run=True):
    """Process a single JSON agent file. Returns (status, details)."""
    filename = os.path.basename(filepath)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    nodes = data.get("nodes", [])
    updated_agents = []
    skipped_agents = []
    
    for node in nodes:
        nd = node.get("data", {})
        
        # Skip non-agent nodes
        if nd.get("type") not in ("Agent",):
            continue
        
        label = nd.get("label", "Unknown")
        label_lower = label.lower()
        inputs = nd.get("inputs", {})
        messages = inputs.get("agentMessages", [])
        
        # Skip Sales/Lead agents and Condition agents — they don't consult documents
        is_sales = any(w in label_lower for w in ["sales", "lead", "ventas"])
        is_condition = "condition" in label_lower
        is_availability = "availability" in label_lower or "disponibilidad" in label_lower
        
        if is_sales:
            skipped_agents.append(f"{label} (Sales agent — skipped)")
            continue
        if is_condition:
            skipped_agents.append(f"{label} (Condition agent — skipped)")
            continue
        if is_availability:
            skipped_agents.append(f"{label} (Availability agent — skipped)")
            continue
        
        # Find system message
        sys_msg = None
        for msg in messages:
            if msg.get("role") == "system":
                sys_msg = msg
                break
        
        if not sys_msg or not sys_msg.get("content"):
            skipped_agents.append(f"{label} (no system prompt)")
            continue
        
        content = sys_msg["content"]
        
        # Check if rule already exists
        if any(marker in content for marker in ALREADY_HAS_MARKERS):
            skipped_agents.append(f"{label} (already has rule)")
            continue
        
        # SAFE APPEND: Just add the rule at the end
        new_content = content + FORBIDDEN_RULE
        
        if not dry_run:
            sys_msg["content"] = new_content
        
        updated_agents.append(label)
    
    if not updated_agents:
        return "SKIPPED", skipped_agents
    
    if not dry_run and updated_agents:
        # Create backup
        bak_path = filepath + ".bak"
        if not os.path.exists(bak_path):
            shutil.copy2(filepath, bak_path)
        
        # Write updated JSON
        output = json.dumps(data, ensure_ascii=False, indent=2)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(output)
        
        # Validate JSON integrity
        with open(filepath, 'r', encoding='utf-8') as f:
            json.load(f)  # Will raise if invalid
    
    return "UPDATED", updated_agents, skipped_agents


def main():
    dry_run = "--apply" not in sys.argv
    mode = "DRY-RUN" if dry_run else "APPLYING CHANGES"
    
    files = sorted([f for f in os.listdir(FOLDER) 
                     if f.endswith('.json') and not f.endswith('.bak')])
    
    # Exclude our own scripts
    files = [f for f in files if 'update_prompts' not in f and 'analyze_prompts' not in f]
    
    print(f"\n{'='*80}")
    print(f"  MODE: {mode}")
    print(f"  Files to process: {len(files)}")
    print(f"{'='*80}\n")
    
    stats = {"updated": 0, "skipped": 0, "errors": 0}
    all_updated = []
    all_skipped = []
    
    for filename in files:
        filepath = os.path.join(FOLDER, filename)
        try:
            result = process_file(filepath, dry_run=dry_run)
            status = result[0]
            
            if status == "UPDATED":
                _, updated, skipped = result
                stats["updated"] += 1
                print(f"  {'WOULD UPDATE' if dry_run else 'UPDATED'}: {filename}")
                for a in updated:
                    print(f"    + {a}")
                    all_updated.append(f"{filename} → {a}")
                for s in skipped:
                    print(f"    - skip: {s}")
            else:
                _, skipped = result
                stats["skipped"] += 1
                reason = ", ".join(skipped) if skipped else "no agents"
                print(f"  SKIP: {filename} ({reason})")
                
        except Exception as e:
            stats["errors"] += 1
            print(f"  ERROR: {filename} — {e}")
    
    print(f"\n{'='*80}")
    print(f"  SUMMARY ({mode}):")
    print(f"    Files updated: {stats['updated']}")
    print(f"    Files skipped: {stats['skipped']}")
    print(f"    Errors: {stats['errors']}")
    print(f"    Total agents that {'would get' if dry_run else 'got'} the rule: {len(all_updated)}")
    print(f"{'='*80}")
    
    if dry_run:
        print(f"\n  To apply changes, run: python safe_update.py --apply\n")


if __name__ == "__main__":
    main()
