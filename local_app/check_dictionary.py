import json
import os

DICTIONARY_FILE = "data/dictionary.json"

def validate_dictionary():
    if not os.path.exists(DICTIONARY_FILE):
        print("❌ Error: dictionary.json not found.")
        return

    with open(DICTIONARY_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    words = data.get('sp', [])
    errors = []

    required_keys = ['word', 'hint', 'translations', 'examples', 'score']
    
    print(f"--- Checking {len(words)} entries ---")

    for index, entry in enumerate(words):
        word_text = entry.get('word', f"Unknown (Index {index})")

        # 1. Check for missing keys
        missing = [key for key in required_keys if key not in entry]
        if missing:
            errors.append(f"Row {index} ({word_text}): Missing keys {missing}")

        # 2. Check for missing language translations
        if 'translations' in entry:
            if 'en' not in entry['translations'] or 'ru' not in entry['translations']:
                errors.append(f"Row {index} ({word_text}): Missing 'en' or 'ru' translation")

    if errors:
        print("❌ Structural errors found:")
        for err in errors:
            print(f"  - {err}")
    else:
        print("✅ All entries have required fields.")

if __name__ == "__main__":
    validate_dictionary()