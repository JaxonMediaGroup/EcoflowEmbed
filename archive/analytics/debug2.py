import re
from flowise_client import get_chatflows, get_all_messages
from datetime import datetime, timedelta
from analyzer import analyze_chatflow, OFF_TOPIC_USER_PATTERNS, _matches_any

chatflows = get_chatflows()
wtc = None
for cf in chatflows:
    if "WTC" in cf.get("name", ""):
        wtc = cf
        break

start = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%dT00:00:00.000Z")
msgs = get_all_messages(wtc["id"], start_date=start)

# Check if messages are properly sorted
print(f"Total messages: {len(msgs)}")
dates = [m.get("createdDate", "") for m in msgs]
is_sorted = all(dates[i] <= dates[i+1] for i in range(len(dates)-1) if dates[i] and dates[i+1])
print(f"Messages sorted by date: {is_sorted}")

# Check message interleaving
roles = [m.get("role", "") for m in msgs[:30]]
print(f"First 30 roles: {roles}")

# Run analyze_chatflow and check
result = analyze_chatflow("WTC", msgs)
print(f"\nOff-topic found by analyze_chatflow: {len(result['off_topic'])}")
print(f"  Answered: {result['off_topic_answered']}")
print(f"  Refused: {result['off_topic_refused']}")

# Direct check
print(f"\nDirect pattern check on user messages:")
for m in msgs:
    content = m.get("content", "") or ""
    if m.get("role") == "userMessage" and len(content) > 5:
        if _matches_any(content, OFF_TOPIC_USER_PATTERNS):
            print(f"  MATCH: {content[:100]}")
