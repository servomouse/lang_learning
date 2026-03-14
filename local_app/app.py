from flask import Flask, render_template, request, redirect, session, url_for
import json
import random
import os
import shutil


DICTIONARY_FILE = "data/dictionary.json"
USERS_DIR = "data/users/"

if not os.path.exists(USERS_DIR):
    os.makedirs(USERS_DIR)


def get_user_dict_path(username):
    return os.path.join(USERS_DIR, f"{username}_dict.json")


def sync_user_dictionary(username):
    user_path = get_user_dict_path(username)
    master_data = load_json(DICTIONARY_FILE)
    
    if not os.path.exists(user_path):
        save_json(user_path, master_data)
        return

    user_data = load_json(user_path)
    user_list = user_data.get('sp', [])
    master_list = master_data.get('sp', [])

    # If master has more words, append them to the user's list
    if len(master_list) > len(user_list):
        new_words = master_list[len(user_list):]
        user_list.extend(new_words)
        user_data['sp'] = user_list
        save_json(user_path, user_data)


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

def get_user_word(username):
    user_path = get_user_dict_path(username)
    data = load_json(user_path)
    sp_list = data.get('sp', [])
    if not sp_list: return None

    idx = random.randrange(len(sp_list))
    entry = sp_list[idx]
    
    # Check current mode
    mode = session.get('mode', 'Words')

    if mode == 'Conjugations' and 'conjugations' in entry:
        # Pick a random tense
        tense = random.choice(list(entry['conjugations'].keys()))
        # Pick a random person (avoiding empty ones like Imperativo 'yo')
        persons = {k: v for k, v in entry['conjugations'][tense].items() if v}
        person = random.choice(list(persons.keys()))
        
        return {
            "index": idx,
            "question": entry['word'], # The Infinitive
            "hint": f"{tense} ({person})",
            "answer": persons[person],
            "mode": "Conjugations"
        }
    
    # Default: Words mode
    return {
        "index": idx,
        "question": entry['word'],
        "hint": entry.get('hint', ''),
        "answer": entry['translations'].get('en'),
        "mode": "Words"
    }

def get_random_word():
    # Used for initial load and skips
    data = load_json(DICTIONARY_FILE)
    sp_list = data.get('sp', [])
    if not sp_list: return None
    
    entry = random.choice(sp_list)
    return {
        "question": entry['word'],
        "hint": entry.get('hint', ''),
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
        
        # 2. Sync the master dictionary to the user's personal file
        sync_user_dictionary(username)
        
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
    app.run(host='0.0.0.0', port=5000, debug=True)
