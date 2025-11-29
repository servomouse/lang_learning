from flask import Flask, jsonify, send_from_directory
import json

app = Flask(__name__)

# Load the dictionary from the JSON file
def load_dictionary():
    with open('new_dict.json', 'r', encoding='utf-8') as file:
        return json.load(file)

@app.route('/api/dictionary', methods=['GET'])
def get_dictionary():
    dictionary = load_dictionary()
    return jsonify(dictionary)

@app.route('/')
def serve_index():
    return send_from_directory('', 'new_index.html')

if __name__ == '__main__':
    app.run(debug=True)