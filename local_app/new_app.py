from flask import Flask, request, jsonify, session
import os, json

app = Flask(__name__)
app.secretkey = "localsecret"  # simple local key

DICT_FILE = "data/dictionary.json"
USERS_DIR = "users"

os.makedirs(USERS_DIR, exist_ok=True)

def getuserdict_path(username):
    return os.path.join(USERS_DIR, f"{username}.json")

def load_dict(username):
    path = getuserdict_path(username)
    if not os.path.exists(path):
        with open(DICT_FILE) as f:
            data = json.load(f)
        with open(path, "w") as f:
            json.dump(data, f)
    with open(path) as f:
        return json.load(f)

def save_dict(username, data):
    with open(getuserdict_path(username), "w") as f:
        json.dump(data, f)

@app.route("/signin", methods=["POST"])
def signin():
    username = request.json["username"]
    session["username"] = username
    load_dict(username)  # ensure copy exists
    return jsonify({"status": "signed in"})

@app.route("/signout")
def signout():
    session.pop("username", None)
    return jsonify({"status": "signed out"})

@app.route("/next_word")
def next_word():
    username = session.get("username")
    if not username:
        return jsonify({"word": "Please sign in", "definition": "", "translations": {}, "score": 0})
    data = load_dict(username)
    # pick lowest score word
    word_entry = min(data["sp"], key=lambda w: w["score"])
    return jsonify(word_entry)

@app.route("/submit", methods=["POST"])
def submit():
    username = session.get("username")
    if not username:
        return jsonify({"error": "not signed in"}), 403
    data = load_dict(username)
    req = request.json
    word = req["word"]
    answer = req["answer"].strip().lower()
    for entry in data["sp"]:
        if entry["word"] == word:
            if answer in [v.lower() for v in entry["translations"].values()]:
                entry["score"] += 1
            else:
                entry["score"] = max(0, entry["score"] - 1)
    save_dict(username, data)
    return jsonify({"status": "updated"})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
