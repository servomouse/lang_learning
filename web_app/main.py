from flask import Flask, jsonify, send_from_directory, request, render_template
import json
import os

DICTIONARY_FILE = 'data/dict.json'
SCORES_FILE = 'data/scores.json'
USERS_FILE = 'data/users.json'


def set_nested_value(d, keys, value):
    for key in keys[:-1]:
        if key not in d or not isinstance(d[key], dict):
            d[key] = {}
        d = d[key]
    d[keys[-1]] = value


class DictionaryClass:
    def __init__(self):
        print("Initializing DictionaryClass")
        super().__init__()
        with open(DICTIONARY_FILE, 'r', encoding='utf-8') as file:
            self.dictionary = json.load(file)
    
    def get_dictionary(self):
        return self.dictionary
    
    def add_item(self, new_item):
        pass

    def save_dictionary(self):
        with open(DICTIONARY_FILE, 'w', encoding='utf-8') as file:
            json.dump(self.dictionary, file, ensure_ascii=False, indent=4)


class UsersClass:
    def __init__(self):
        print("Initializing UsersClass")
        super().__init__()
        if os.path.isfile(USERS_FILE):
            with open(USERS_FILE, 'r', encoding='utf-8') as file:
                self.users = json.load(file)
        else:
            self.users = {}
            self.save_users()
    
    def add_user(self, username, password):
        if username in self.users: # User exists
            print(f"Error: Cannot add user {username}: user exists")
            return "User already exists!"
        self.users[username] = password
        self.save_users()
        return "Success"
    
    def verify_user(self, username, password):
        if username not in self.users:
            return "User doesn't exist"
        if password != self.users[username]:
            return "Incorrect password"
        return "Success"
    
    def save_users(self):
        with open(USERS_FILE, 'w', encoding='utf-8') as file:
            json.dump(self.users, file, ensure_ascii=False, indent=4)


class ScoresClass:
    def __init__(self):
        print("Initializing ScoresClass")
        super().__init__()
        if os.path.isfile(SCORES_FILE):
            with open(SCORES_FILE, 'r', encoding='utf-8') as file:
                self.scores = json.load(file)
        else:
            self.scores = {}
            self.save_scores()
    
    def update_score(self, username, langs, word, translation, new_score):
        set_nested_value(self.scores, [username, langs[0], word, langs[1], translation],  new_score)
        self.save_scores()

    def get_scores(self):
        return self.scores
    
    def save_scores(self):
        with open(SCORES_FILE, 'w', encoding='utf-8') as file:
            json.dump(self.scores, file, ensure_ascii=False, indent=4)


class AppData(DictionaryClass, UsersClass, ScoresClass):
    def __init__(self):
        print("Initializing AppData")
        super().__init__()


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
    print(f"Received data: {data}")
    app_data.update_score(data["username"], [data["base_lang"], data["target_lang"]], data["word"], data["translation"], data["new_score"])
    return jsonify({"status": "success", "message": "success"}), 200


@app.route('/api/add_user', methods=['POST'])
def add_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    print(f"Add user received data: {data}")

    res = app_data.add_user(username, password)

    if res == "Success":
        return jsonify({"status": "success", "message": "success"}), 200

    return jsonify({"status": "error", "message": "User already exists!"}), 401


@app.route('/api/verify_user', methods=['POST'])
def verify_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    print(f"Verify user received data: {data}")

    res = app_data.verify_user(username, password)

    if res == "Success":
        return jsonify({"status": "success", "message": "success"}), 200

    return jsonify({"status": "error", "message": res}), 401


@app.route('/')
def serve_index():
    return render_template('new_index.html')


if __name__ == '__main__':
    app.run(debug=True)
