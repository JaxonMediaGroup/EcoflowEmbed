from flowise_client import get_chatflows
cfs = get_chatflows()
print(f"{len(cfs)} chatflows found")
for c in cfs[:5]:
    print(f"  {c['name']}")
