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
            self.scores = {}
            self.save_scores()

        if os.path.isfile(USERS_FILE):
            with open(USERS_FILE, 'r', encoding='utf-8') as file:
                self.users = json.load(file)
        else:
            self.users = {}
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
        if self.current_user not in self.scores:
            self.scores[self.current_user] = {}
        if langs[0] not in self.scores[self.current_user]:
            self.scores[self.current_user] = langs[0]
        if langs[1] not in self.scores[self.current_user][langs[0]]:
            self.scores[self.current_user][langs[0]] = langs[1]
        self.scores[self.current_user][langs[0]][langs[1]][word] = new_score
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
app_data = AppData()

@app.route('/api/dictionary', methods=['GET'])
def get_dictionary():
    dictionary = app_data.get_dictionary()
    return jsonify(dictionary)

@app.route('/api/scores', methods=['GET'])
def get_scores():
    scores = app_data.get_scores()
    return jsonify(scores)

@app.route('/api/update_score', methods=['POST'])
def update_score():
    data = request.get_json()
    # language = data.get('language')
    # word = data.get('word')
    # is_correct = data.get('is_correct')
    print(f"Received data: {data}")

@app.route('/api/add_user', methods=['POST'])
def add_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    print(f"Add user received data: {data}")

    res = app_data.add_user(username, password)

    if res == "User doesn't exist":
        return jsonify({"status": "error", "message": "User doesn't exist"}), 404

    if res == "Incorrect password":
        return jsonify({"status": "error", "message": "Incorrect password"}), 401

    return jsonify({"status": "success", "message": "Login successful"}), 200
    # language = data.get('language')
    # word = data.get('word')
    # is_correct = data.get('is_correct')
    print(f"Add user received data: {data}")

@app.route('/api/verify_user', methods=['POST'])
def verify_user():
    data = request.get_json()
    # language = data.get('language')
    # word = data.get('word')
    # is_correct = data.get('is_correct')
    print(f"Verify user received data: {data}")

@app.route('/')
def serve_index():
    return send_from_directory('', 'new_index.html')

if __name__ == '__main__':
    app.run(debug=True)