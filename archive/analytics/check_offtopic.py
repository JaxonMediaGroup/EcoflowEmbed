import requests
r = requests.get("http://localhost:5050/api/data?days=30")
d = r.json()
print("Status:", r.status_code)

rs = d.get("results", [])
total_ot = sum(len(x.get("off_topic", [])) for x in rs)
ans = sum(x.get("off_topic_answered", 0) for x in rs)
ref = sum(x.get("off_topic_refused", 0) for x in rs)

print(f"Off-topic total: {total_ot}")
print(f"  Answered (abuse): {ans}")
print(f"  Refused (good): {ref}")

top = [x for x in rs if len(x.get("off_topic", [])) > 0]
top.sort(key=lambda x: len(x["off_topic"]), reverse=True)

print("\nTop chatflows with off-topic abuse:")
for x in top[:10]:
    name = x["chatflow"]
    count = len(x["off_topic"])
    a = x["off_topic_answered"]
    r2 = x["off_topic_refused"]
    print(f"  {name}: {count} ({a} answered / {r2} refused)")

# Show some sample off-topic questions
print("\nSample off-topic questions (answered):")
shown = 0
for x in top:
    for ot in x["off_topic"]:
        if not ot["refused"] and shown < 10:
            print(f"  [{x['chatflow'][:20]}] Q: {ot['user_question'][:80]}")
            print(f"    Agent: {ot.get('agent_name', 'N/A')}")
            shown += 1
