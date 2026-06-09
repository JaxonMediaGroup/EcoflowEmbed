"""
Script to add the "no document references" rule to all agent Q&A prompts.
Only modifies the Q&A agent system prompt (the one with info_get or similar tool).
Does NOT touch the Sales Agent, Condition Agent, or any other config.
Creates backups before modifying.
"""
import json
import os
import re
import shutil

FOLDER = r"c:\Users\Guillermo\Downloads\Chatbots"

# The forbidden phrases rule to inject (HTML format)
FORBIDDEN_RULE = (
    '<li><p><strong>\ud83d\udeab STRICTLY FORBIDDEN PHRASES (in any language):</strong> '
    'Never say: &quot;seg\u00fan el documento&quot;, &quot;de acuerdo al documento&quot;, '
    '&quot;en el documento se indica&quot;, &quot;no viene detallado en el documento&quot;, '
    '&quot;esa informaci\u00f3n no viene en el documento&quot;, &quot;the document states&quot;, '
    '&quot;according to the document&quot;, &quot;el documento menciona&quot;, '
    '&quot;no aparece en el documento&quot;, &quot;based on the information provided&quot;, '
    '&quot;en la informaci\u00f3n oficial&quot;, &quot;seg\u00fan la informaci\u00f3n oficial&quot;, '
    'or ANY reference to a document, source file, or data source. '
    'The user must NEVER know you are consulting a document. '
    'Respond naturally as a knowledgeable advisor who simply knows the project.</p></li>'
)

# Escaped version for JSON string context (with \" instead of &quot;)
FORBIDDEN_RULE_ESCAPED = FORBIDDEN_RULE.replace('&quot;', '\\"')

def already_has_rule(content):
    """Check if the prompt already has the forbidden phrases rule."""
    checks = [
        "STRICTLY FORBIDDEN PHRASES",
        "NUNCA menciones",  # Brisas Ixtapa style
        "NUNCA menciones \\\"el documento\\\"",
        "NUNCA menciones 'el documento'",
    ]
    return any(c in content for c in checks)

def find_qa_agent_node(data):
    """Find the Q&A agent node (the one with info_get or similar GET tool, not the sales agent)."""
    candidates = []
    for node in data.get("nodes", []):
        node_data = node.get("data", {})
        node_type = node_data.get("type", "")
        if node_type != "Agent":
            continue
        
        inputs = node_data.get("inputs", {})
        tools = inputs.get("agentTools", [])
        
        # Check if this agent has a requestsGet tool (info_get / similar)
        has_info_tool = False
        for tool in tools:
            if isinstance(tool, dict):
                selected = tool.get("agentSelectedTool", "")
                config = tool.get("agentSelectedToolConfig", {})
                tool_name = config.get("requestsGetName", "")
                if selected == "requestsGet" or "info" in tool_name.lower():
                    has_info_tool = True
                    break
        
        if has_info_tool:
            candidates.append(node)
    
    return candidates

def inject_rule_into_prompt(content):
    """Inject the forbidden phrases rule into the system prompt content."""
    
    # Strategy 1: Find patterns like "ALWAYS use info_get FIRST" and modify surrounding text
    # Remove references to "official document" / "documento oficial" from the info_get instruction
    
    # Pattern: "to obtain information from the official X document"
    content = re.sub(
        r'to obtain information from the official [^"<]+ document',
        'to get information, but NEVER mention the document, source, or tool in your responses',
        content
    )
    
    # Pattern: "to get information from official documents"
    content = re.sub(
        r'to get information from official documents',
        'to get information, but NEVER mention the document, source, or tool in your responses',
        content
    )
    
    # Pattern: "from the official X document" (standalone)
    content = re.sub(
        r'from the official [^"<]+ document',
        '',
        content
    )
    
    # Pattern: "obtener información del documento oficial de X"
    content = re.sub(
        r'obtener informaci\u00f3n del documento oficial de [^"<]+',
        'obtener informaci\u00f3n, pero NUNCA menciones el documento, fuente o herramienta en tus respuestas',
        content
    )
    
    # Pattern: "para obtener la información" (without "oficial")
    content = re.sub(
        r'para obtener la informaci\u00f3n, pero NUNCA menciones',
        'para obtener la informaci\u00f3n, pero NUNCA menciones',
        content
    )
    
    # Pattern: "Your ONLY information source is the info_get tool"
    content = re.sub(
        r'Your ONLY information source is the info_get tool\.',
        'Your information comes from info_get, but NEVER mention the document, source, or tool in your responses. Respond naturally as a knowledgeable advisor.',
        content
    )
    
    # Now inject the FORBIDDEN RULE after the first <ol> list item that mentions info_get
    # Look for the closing </li> after the info_get rule and insert after it
    
    if "STRICTLY FORBIDDEN PHRASES" not in content:
        # Try to find the first rule about info_get and add after it
        # Pattern: </p></li> after "info_get" mention in an <ol>
        info_patterns = [
            r'(info_get[^<]*</p></li>)',
            r'(info_get[^<]*</li>)',
            r'(Informacion_General[^<]*</p></li>)',
        ]
        
        inserted = False
        for pattern in info_patterns:
            match = re.search(pattern, content)
            if match:
                insert_pos = match.end()
                content = content[:insert_pos] + FORBIDDEN_RULE_ESCAPED + content[insert_pos:]
                inserted = True
                break
        
        if not inserted:
            # Try Spanish pattern: after "Usa info_get" rule
            match = re.search(r'(Usa info_get[^<]*</p></li>)', content)
            if match:
                insert_pos = match.end()
                content = content[:insert_pos] + FORBIDDEN_RULE_ESCAPED + content[insert_pos:]
                inserted = True
        
        if not inserted:
            # Fallback: insert before </ol> (end of rules list)
            match = re.search(r'(</ol>)', content)
            if match:
                insert_pos = match.start()
                content = content[:insert_pos] + FORBIDDEN_RULE_ESCAPED + content[insert_pos:]
                inserted = True
    
    # Fix fallback messages that mention "document"
    # Pattern: "If the information is NOT in the document"
    content = re.sub(
        r'If the information is NOT in the document, DO NOT invent or elaborate\.',
        'If you don\\'t have certain data, DO NOT invent or elaborate.',
        content
    )
    content = re.sub(
        r'If information is not found in the document',
        'If you don\\'t have certain information',
        content
    )
    content = re.sub(
        r'If information not found in the document',
        'If you don\\'t have certain information',
        content
    )
    
    # Fix "info_get (official document) - USE FIRST"
    content = re.sub(
        r'info_get \(official document\)',
        'info_get',
        content
    )
    content = re.sub(
        r'info_get \(documento oficial\)',
        'info_get',
        content
    )
    
    # Fix priority lists mentioning "official document"
    content = re.sub(
        r'from the official document',
        '',
        content
    )
    
    # Fix "the information doesn't appear in the document" style fallbacks
    content = re.sub(
        r'the information does not appear in the document',
        'you don\\'t have that specific information',
        content
    )
    content = re.sub(
        r'la informaci\u00f3n no aparece en el documento',
        'no cuentas con esa informaci\u00f3n espec\u00edfica',
        content
    )
    
    return content


def process_file(filepath):
    """Process a single agent JSON file."""
    filename = os.path.basename(filepath)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        raw = f.read()
    
    data = json.loads(raw)
    
    qa_nodes = find_qa_agent_node(data)
    if not qa_nodes:
        return f"SKIP (no Q&A agent found): {filename}"
    
    modified = False
    results = []
    
    for node in qa_nodes:
        node_data = node["data"]
        label = node_data.get("label", "unknown")
        inputs = node_data.get("inputs", {})
        messages = inputs.get("agentMessages", [])
        
        for msg in messages:
            if msg.get("role") == "system":
                content = msg["content"]
                
                if already_has_rule(content):
                    results.append(f"  ALREADY OK: {label}")
                    continue
                
                new_content = inject_rule_into_prompt(content)
                
                if new_content != content:
                    msg["content"] = new_content
                    modified = True
                    results.append(f"  UPDATED: {label}")
                else:
                    results.append(f"  NO CHANGE (pattern not found): {label}")
    
    if modified:
        # Create backup
        backup_path = filepath + ".bak"
        if not os.path.exists(backup_path):
            shutil.copy2(filepath, backup_path)
        
        # Write updated file
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        # Validate
        with open(filepath, 'r', encoding='utf-8') as f:
            json.loads(f.read())
    
    status = "MODIFIED" if modified else "UNCHANGED"
    return f"{status}: {filename}\n" + "\n".join(results)


def main():
    files = [f for f in os.listdir(FOLDER) if f.endswith('.json') and f != 'update_prompts.py']
    files.sort()
    
    print(f"Found {len(files)} agent files\n")
    
    updated = 0
    skipped = 0
    errors = 0
    
    for filename in files:
        filepath = os.path.join(FOLDER, filename)
        try:
            result = process_file(filepath)
            print(result)
            if "MODIFIED" in result:
                updated += 1
            else:
                skipped += 1
        except Exception as e:
            print(f"ERROR: {filename} — {e}")
            errors += 1
        print()
    
    print(f"\n{'='*50}")
    print(f"SUMMARY: {updated} updated, {skipped} unchanged/skipped, {errors} errors")
    print(f"Total files: {len(files)}")


if __name__ == "__main__":
    main()
