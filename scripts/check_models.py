import csv
from collections import defaultdict

rows = []
with open(r"C:\Users\Guillermo\Downloads\Chatbots\projects\.audit\audit_full.csv", encoding="utf-8") as f:
    rows = list(csv.DictReader(f))

by_model = defaultdict(list)
for r in rows:
    by_model[r["model"]].append(r)

print("=" * 78)
print("MODELO distribution across all 72 Q&A agents")
print("=" * 78)
for model, items in sorted(by_model.items(), key=lambda x: -len(x[1])):
    print(f"  {model:15s}  {len(items):3d} agents")

print()
print("=" * 78)
print("AGENTES que NO son gpt-5.2  (necesitan upgrade)")
print("=" * 78)
non_52 = [r for r in rows if r["model"] != "gpt-5.2"]
if not non_52:
    print("  (ninguno - todos en gpt-5.2)")
for r in sorted(non_52, key=lambda x: (x["model"], x["project"])):
    label = r["label"][:50]
    print(f"  {r['model']:12s}  {r['project']:42s}  agent={label}")
print()
print(f"Total: {len(non_52)} de {len(rows)} agentes no estan en gpt-5.2")
