"""
Query each Flowise chatbot with a discovery question to understand
what type of project each one is. Uses the prediction API.
"""
import json
import requests
import time
import os

FLOWISE_URL = "https://ecoflow.koppi.mx"
API_KEY = "Qik9wf7ELh1P6KIUC904BG3Po8ZzBfrprfcqUjwjOT8"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

# Discovery question - short and direct
QUESTION_ES = "Describe brevemente en 2 oraciones: ¿qué tipo de proyecto es?, ¿qué se vende o renta aquí? (casas, departamentos, terrenos, lotes, oficinas, hotel, viñedo, centro comercial, etc) y ¿dónde está ubicado?"
QUESTION_EN = "Briefly in 2 sentences: what type of project is this? What is sold or rented here? (houses, apartments, lots, offices, hotel, vineyard, mall, etc) and where is it located?"

OUTPUT_FILE = r"c:\Users\Guillermo\Downloads\Chatbots\project_discovery.json"

def get_all_chatflows():
    """Get all chatflows from Flowise API."""
    resp = requests.get(f"{FLOWISE_URL}/api/v1/chatflows", headers=HEADERS, timeout=15)
    resp.raise_for_status()
    return resp.json()

def query_chatbot(chatflow_id, question, timeout=45):
    """Send a question to a chatflow and get the response."""
    try:
        resp = requests.post(
            f"{FLOWISE_URL}/api/v1/prediction/{chatflow_id}",
            headers=HEADERS,
            json={"question": question, "overrideConfig": {"sessionId": f"discovery_{chatflow_id}"}},
            timeout=timeout
        )
        if resp.status_code == 200:
            data = resp.json()
            # Response can be in different formats
            if isinstance(data, dict):
                return data.get("text", data.get("answer", str(data)))
            return str(data)
        else:
            return f"ERROR {resp.status_code}: {resp.text[:200]}"
    except requests.Timeout:
        return "TIMEOUT"
    except Exception as e:
        return f"EXCEPTION: {str(e)}"

def detect_language(chatflows_data, chatflow_id):
    """Detect if chatflow uses Spanish or English from its flow data."""
    for cf in chatflows_data:
        if cf.get("id") == chatflow_id:
            flow_str = cf.get("flowData", "")
            # Simple heuristic: check for Spanish keywords
            if "asesor" in flow_str.lower() or "inmobiliario" in flow_str.lower() or "pregunta general sobre" in flow_str.lower():
                return "es"
            return "en"
    return "es"

def main():
    print("🔍 Fetching all chatflows from Flowise...")
    chatflows = get_all_chatflows()
    
    # Filter only agentflow type (not chatflow)
    agents = []
    for cf in chatflows:
        name = cf.get("name", "")
        cf_id = cf.get("id", "")
        cf_type = cf.get("type", "")
        
        # Skip non-agent flows or test flows
        if not name or "test" in name.lower():
            continue
        
        agents.append({
            "id": cf_id,
            "name": name,
            "type": cf_type
        })
    
    print(f"📋 Found {len(agents)} chatflows to query\n")
    
    results = []
    
    for i, agent in enumerate(agents, 1):
        lang = detect_language(chatflows, agent["id"])
        question = QUESTION_ES if lang == "es" else QUESTION_EN
        
        print(f"[{i}/{len(agents)}] 🤖 Querying: {agent['name']}...", end=" ", flush=True)
        
        response = query_chatbot(agent["id"], question)
        
        # Truncate for display
        display_resp = response[:150].replace('\n', ' ') if response else "NO RESPONSE"
        print(f"✅ {display_resp}...")
        
        results.append({
            "name": agent["name"],
            "id": agent["id"],
            "type": agent["type"],
            "response": response
        })
        
        # Small delay to not hammer the API
        time.sleep(1)
    
    # Save full results
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"\n\n💾 Full results saved to: {OUTPUT_FILE}")
    
    # Print summary
    print("\n" + "=" * 120)
    print("SUMMARY OF ALL PROJECTS")
    print("=" * 120)
    
    for i, r in enumerate(results, 1):
        resp_clean = r["response"][:300].replace('\n', ' ') if r["response"] else "NO RESPONSE"
        print(f"\n{'─' * 100}")
        print(f"#{i} {r['name']}")
        print(f"   {resp_clean}")

if __name__ == "__main__":
    main()
