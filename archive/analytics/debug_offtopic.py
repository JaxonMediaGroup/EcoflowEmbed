import requests
import re

# Get data from dashboard
r = requests.get("http://localhost:5050/api/data?days=30")
d = r.json()
rs = d.get("results", [])

# Find messages with the WTC chatflow
for x in rs:
    if "WTC" in x.get("chatflow", ""):
        print(f"Chatflow: {x['chatflow']}")
        print(f"  Total messages: {x['total_messages']}")
        print(f"  User messages: {x['user_messages']}")
        print(f"  Bot messages: {x['bot_messages']}")
        print(f"  Off-topic found: {len(x.get('off_topic', []))}")
        break

# Now let's manually check some user messages from the API
from flowise_client import get_chatflows, get_all_messages
from datetime import datetime, timedelta
from analyzer import OFF_TOPIC_USER_PATTERNS, _matches_any

chatflows = get_chatflows()
wtc = None
for cf in chatflows:
    if "WTC" in cf.get("name", ""):
        wtc = cf
        break

if wtc:
    start = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%dT00:00:00.000Z")
    msgs = get_all_messages(wtc["id"], start_date=start)
    user_msgs = [m for m in msgs if m.get("role") == "userMessage"]
    
    print(f"\nWTC chatflow: {wtc['name']}")
    print(f"Total messages: {len(msgs)}")
    print(f"User messages: {len(user_msgs)}")
    
    # Check each user message against patterns
    hits = 0
    print("\n=== User messages matching OFF-TOPIC patterns ===")
    for m in user_msgs:
        content = m.get("content", "")
        if content and len(content) > 5 and _matches_any(content, OFF_TOPIC_USER_PATTERNS):
            hits += 1
            print(f"  [{m.get('createdDate','')[:10]}] {content[:100]}")
            # Show which pattern matched
            for p in OFF_TOPIC_USER_PATTERNS:
                if re.search(p, content.lower()):
                    print(f"    → matched: {p[:60]}")
                    break
    
    print(f"\nTotal matches: {hits}/{len(user_msgs)}")
    
    if hits == 0:
        # Show sample user messages to debug
        print("\n=== Sample user messages (first 20) ===")
        for m in user_msgs[:20]:
            print(f"  {m.get('content','')[:100]}")
