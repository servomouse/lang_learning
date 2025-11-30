from flask import Flask, jsonify, send_from_directory, request
import json
import os

DICTIONARY_FILE = 'new_dict.json'
SCORES_FILE = 'scores.json'
USERS_FILE = 'users.json'


class AppData:
    def __init__(self):
        self.current_user = None
        with open(DICTIONARY_FILE, 'r', encoding='utf-8') as file:
            self.dictionary = json.load(file)

        if os.path.isfile(SCORES_FILE):
            with open(SCORES_FILE, 'r', encoding='utf-8') as file:
                self.scores = json.load(file)
        else:
            with open(SCORES_FILE, 'w', encoding='utf-8') as file:
                json.dump({}, file, ensure_ascii=False, indent=4)

        if os.path.isfile(USERS_FILE):
            with open(USERS_FILE, 'r', encoding='utf-8') as file:
                self.users = json.load(file)
        else:
            self.save_users()
    
    def get_dictionary(self):
        return self.dictionary
    
    def add_item(self, new_item):
        pass

    def save_dictionary(self):
        with open(DICTIONARY_FILE, 'w', encoding='utf-8') as file:
            json.dump(self.dictionary, file, ensure_ascii=False, indent=4)

    # Scores:
    
    def update_score(self, langs, word, new_score):
        key = f"{langs[0]}-{langs[1]}-{word}"
        if self.current_user not in self.scores:
            self.scores[self.current_user] = {}
        self.scores[self.current_user][key] = new_score
        self.save_scores()

    def get_scores(self):
        return self.scores
    
    def save_scores(self):
        with open(SCORES_FILE, 'w', encoding='utf-8') as file:
            json.dump(self.scores, file, ensure_ascii=False, indent=4)

    # Users:
    
    def add_user(self, login, password):
        if login in self.users: # User exists
            print(f"Error: Cannot add user {login}: user exists")
            return False
        self.users[login] = password
        self.save_users()
        return True
    
    def verify_user(self, login, password):
        if login in self.users and password == self.users[login]:
            return True
        return False
    
    def save_users(self):
        with open(USERS_FILE, 'w', encoding='utf-8') as file:
            json.dump(self.users, file, ensure_ascii=False, indent=4)


app = Flask(__name__)
dict = AppData()

@app.route('/api/dictionary', methods=['GET'])
def get_dictionary():
    dictionary = dict.get_dictionary()
    return jsonify(dictionary)

@app.route('/api/update_score', methods=['POST'])
def update_score():
    data = request.json
    # language = data.get('language')
    # word = data.get('word')
    # is_correct = data.get('is_correct')
    print(f"Received data: {data}")

@app.route('/')
def serve_index():
    return send_from_directory('', 'new_index.html')

if __name__ == '__main__':
    app.run(debug=True)