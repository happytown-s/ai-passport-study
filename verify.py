import json

for fname in ["textbook-generative-ai.json", "textbook-ai-risks.json"]:
    path = f"src/data/{fname}"
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    print(f"{fname}: {len(data)} topics")
    for t in data:
        print(f"  - {t['topicId']}: {t['title']}")
    print()
