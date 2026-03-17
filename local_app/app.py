from flask import Flask, render_template, request, redirect, session, url_for
import json
import random
import os
import shutil


DICTIONARY_FILE = "data/dictionary.json"
USERS_DIR = "data/users/"
TENSE_TIERS = [
    (0, ["Presente de Indicativo"]), # Always available
    (10, ["Preterito Indefenido de Indicativo", "Preterito Imperfecto de Indicativo"]),
    (25, ["Futuro Simple", "Potencial Simple", "Imperativo Afirmativo"]),
    (40, ["Presente de Subjuntivo", "Preterito Perfecto de Indicativo"]),
    (60, ["Preterito Imperfecto de subjuntivo", "Imperativo Negativo"]),
    (80, ["Futuro Perfecto", "Potencial Perfecto", "Preterito Pluscuamperfecto de Indicativo"]),
    (95, ["Futuro Simple de Subjuntivo", "Preterito Pluscuamperfecto de Subjuntivo", "Preterito Perfecto de Subjuntivo", "Futuro Perfecto de Subjuntivo"])
]

if not os.path.exists(USERS_DIR):
    os.makedirs(USERS_DIR)


def get_user_dict_path(username):
    return os.path.join(USERS_DIR, f"{username}_dict.json")


def sync_all_users():
    master_data = load_json(DICTIONARY_FILE)
    master_list = master_data.get('sp', [])
    
    if not os.path.exists(USERS_DIR):
        return

    for filename in os.listdir(USERS_DIR):
        if filename.endswith("_dict.json"):
            user_path = os.path.join(USERS_DIR, filename)
            user_data = load_json(user_path)
            user_list = user_data.get('sp', [])

            # 1. Map existing scores to a unique identifier: "word|translation"
            # Example key: "decir|to say"
            score_map = {}
            for item in user_list:
                key = f"{item['word']}|{item['translations'].get('en', '')}"
                score_map[key] = item.get('score', 0)

            # 2. Rebuild the user list using master data + preserved scores
            new_user_list = []
            for master_item in master_list:
                # Create a fresh copy of the master entry
                updated_item = master_item.copy()
                
                # Look up the score using the unique key
                key = f"{master_item['word']}|{master_item['translations'].get('en', '')}"
                updated_item['score'] = score_map.get(key, 0)
                
                new_user_list.append(updated_item)

            # 3. Save if there's any change (new words or updated metadata)
            user_data['sp'] = new_user_list
            save_json(user_path, user_data)
            print(f"Synced and re-mapped dictionary for: {filename}")


# Helper to load/save JSON
def load_json(filename):
    if not os.path.exists(filename): 
        return {}
    # Explicitly use utf-8 to read Cyrillic correctly
    with open(filename, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return {}

def save_json(filename, data):
    # Explicitly use utf-8 to write
    with open(filename, 'w', encoding='utf-8') as f:
        # ensure_ascii=False is the magic key for readable Cyrillic
        json.dump(data, f, indent=4, ensure_ascii=False)

def get_word(username):
    user_path = get_user_dict_path(username)
    data = load_json(user_path)
    sp_list = data.get('sp', [])
    if not sp_list: return None

    idx = random.randrange(len(sp_list))
    entry = sp_list[idx]
    
    return {
        "index": idx,
        "question": entry['word'],
        "hint": entry.get('definition', ''),
        "answer": entry['translations'].get('en'),
        "mode": "Words"
    }

def get_conjugation(username):
    user_path = get_user_dict_path(username)
    data = load_json(user_path)
    sp_list = data.get('sp', [])
    
    # 1. Filter verbs
    verbs = [(i, word) for i, word in enumerate(sp_list) if 'conjugations' in word and word['conjugations']]
    if not verbs:
        return get_word(username)

    # 2. Determine available tenses based on progress
    progress = get_user_progress(username)
    allowed_tenses = []
    for threshold, tenses in TENSE_TIERS:
        if progress >= threshold:
            allowed_tenses.extend(tenses)
        else:
            break

    # 3. Pick a random verb
    idx, entry = random.choice(verbs)
    
    # 4. Filter available tenses for THIS specific verb
    verb_tenses = [t for t in entry['conjugations'].keys() if t in allowed_tenses]
    
    # Fallback if the verb doesn't have the simple tenses yet
    if not verb_tenses:
        verb_tenses = ["Presente de Indicativo"] if "Presente de Indicativo" in entry['conjugations'] else list(entry['conjugations'].keys())

    tense_name = random.choice(verb_tenses)
    tense_data = entry['conjugations'][tense_name]
    
    available_persons = [p for p, val in tense_data.items() if val and val.strip()]
    person = random.choice(available_persons)
    
    return {
        "index": idx,
        "question": entry['word'],
        "hint": f"{tense_name} ({person})",
        "answer": tense_data[person],
        "mode": "Conjugations"
    }

def get_user_progress(username):
    user_path = get_user_dict_path(username)
    data = load_json(user_path)
    sp_list = data.get('sp', [])
    if not sp_list:
        return 0
    
    positive_scores = [item for item in sp_list if item.get('score', 0) > 0]
    return (len(positive_scores) / len(sp_list)) * 100

def get_user_word(username):
    mode = session.get('mode', 'Words')
    if mode == 'Conjugations':
        return get_conjugation(username)
    return get_word(username)

def get_random_word():
    # Used for initial load and skips
    data = load_json(DICTIONARY_FILE)
    sp_list = data.get('sp', [])
    if not sp_list: return None
    
    entry = random.choice(sp_list)
    return {
        "question": entry['word'],
        "hint": entry.get('definition', ''),
        "answer": entry['translations'].get('en')
    }


app = Flask(__name__)
app.secret_key = "local_secret_key" # Simple key for local sessions


@app.route('/logout')
def logout():
    session.clear()
    return render_template('index.html', logged_in=False)


@app.route('/')
def index():
    if 'username' not in session:
        return render_template('index.html', logged_in=False)
    
    if 'session_score' not in session:
        session['session_score'] = 0
    
    # Use get_user_word to get the index and the data from the user's file
    word_data = get_user_word(session['username'])
    
    if not word_data:
        return "Dictionary is empty!", 404

    return render_template('index.html', 
                           logged_in=True, 
                           username=session['username'], 
                           score=session['session_score'],
                           **word_data)

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    print(f"{username = }")
    if username:
        # 1. Sanitize username for filename safety
        username = "".join(x for x in username if x.isalnum())
        session['username'] = username
        user_path = get_user_dict_path(username)
        
        # If it's a brand new user, create their file immediately
        if not os.path.exists(user_path):
            master_data = load_json(DICTIONARY_FILE)
            save_json(user_path, master_data)

        
        # 3. Initialize session score
        session['session_score'] = 0
        
    return redirect(url_for('index'))


@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    word_index = data.get('word_index')
    is_correct = data.get('is_correct') # Boolean from frontend
    
    user_path = get_user_dict_path(session['username'])
    user_data = load_json(user_path)
    
    try:
        idx = int(word_index)
        item = user_data['sp'][idx]
        
        # Update score based on frontend result
        if is_correct:
            session['session_score'] += 1
            item['score'] = item.get('score', 0) + 1
        else:
            session['session_score'] -= 1
            item['score'] = item.get('score', 0) - 1
            
        save_json(user_path, user_data)
    except (IndexError, TypeError, ValueError) as e:
        print(f"Error updating index {word_index}: {e}")

    # Return updated session score and next word
    return {
        "score": session['session_score'],
        "next_word": get_user_word(session['username'])
    }


@app.route('/skip', methods=['GET'])
def skip():
    if 'username' not in session:
        return {"error": "Unauthorized"}, 401
    return get_user_word(session['username'])


@app.route('/set_mode', methods=['POST'])
def set_mode():
    data = request.get_json()
    session['mode'] = data.get('mode', 'Words')
    return {"status": "success"}


if __name__ == '__main__':
    # print("Syncing user's dictionaries:", end="")
    sync_all_users()
    # print("     Complete")
    app.run(host='0.0.0.0', port=5000, debug=True)
